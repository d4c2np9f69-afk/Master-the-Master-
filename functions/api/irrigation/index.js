// /api/irrigation — GET: fetches live status from Orbit B-Hyve via their unofficial REST API
const API_BASE = 'https://api.orbitbhyve.com/v1';

const LOGIN_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Content-Type': 'application/json; charset=utf-8;',
  'Host': 'api.orbitbhyve.com',
  'Referer': 'https://api.orbitbhyve.com/',
  'Orbit-Session-Token': '',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function bhyveLogin(email, password) {
  const r = await fetch(`${API_BASE}/session`, {
    method: 'POST',
    headers: LOGIN_HEADERS,
    body: JSON.stringify({ session: { email, password } }),
  });
  const body = await r.text().catch(() => '');
  if (!r.ok) throw new Error(`login_failed — HTTP ${r.status} — ${body.slice(0, 120)}`);
  const data = JSON.parse(body);
  const token = data.orbit_session_token || data.token || data.session_token || data.access_token;
  const userId = data.user_id || data.id || data.userId;
  if (!token || !userId) throw new Error(`login_failed — no token in response — keys: ${Object.keys(data).join(',')}`);
  return { token, userId };
}

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const email = env.BHYVE_EMAIL || url.searchParams.get('e') || '';
  const password = env.BHYVE_PASSWORD || url.searchParams.get('p') || '';

  if (!email || !password) {
    return Response.json({ ok: false, error: 'credentials_not_provided' }, { status: 400 });
  }

  try {
    const { token, userId } = await bhyveLogin(email, password);

    const devHeaders = {
      'Accept': 'application/json, text/plain, */*',
      'Host': 'api.orbitbhyve.com',
      'Referer': 'https://api.orbitbhyve.com/',
      'Orbit-Session-Token': token,
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    const dr = await fetch(`${API_BASE}/devices?user_id=${userId}`, { headers: devHeaders });
    if (!dr.ok) throw new Error('devices_failed: ' + dr.status);
    const devices = await dr.json();

    // Find the first sprinkler timer device
    const timer = (devices || []).find(d =>
      d.type === 'bhyve_timer' || d.type === 'sprinkler_timer' ||
      (Array.isArray(d.zones) && d.zones.length > 0)
    );
    if (!timer) {
      return Response.json({ ok: false, error: 'no_timer_device_found', devices_found: (devices||[]).map(d=>d.type) }, { status: 404 });
    }

    // Watering history — the B-Hyve device object has NO "last watered" field, and
    // /watering_events 404s (doesn't exist). The data lives in status.watering_status
    // (current) and status.watering_statuses (recent runs). Derive last-watered from
    // whichever timestamp field is present; debug dumps the raw objects to confirm it.
    const debug = url.searchParams.get('debug') === '1';
    const st = timer.status || {};
    const dbg = {
      deviceKeys: Object.keys(timer),
      statusKeys: Object.keys(st),
      watering_status: st.watering_status || null,
      watering_statuses: st.watering_statuses || null,
      next_start_programs: st.next_start_programs || null
    };
    let lastWateredFromEvents = null;
    let history = [];
    const TFIELDS = ['last_watering_time', 'stopped_watering_station_at', 'started_watering_station_at', 'end_time', 'start_time', 'wateringStationAt', 'completed_at', 'water_event_at'];
    const pickTime = (o) => {
      if (!o || typeof o !== 'object') return null;
      for (const k of TFIELDS) { if (o[k]) return o[k]; }
      return null;
    };
    const records = [];
    if (st.watering_status && typeof st.watering_status === 'object') records.push(st.watering_status);
    if (Array.isArray(st.watering_statuses)) st.watering_statuses.forEach(r => { if (r && typeof r === 'object') records.push(r); });
    const withTime = records.map(r => ({ r, t: pickTime(r) })).filter(x => x.t);
    withTime.sort((a, b) => new Date(b.t).getTime() - new Date(a.t).getTime());
    if (withTime.length) {
      lastWateredFromEvents = withTime[0].t;
      history = withTime.slice(0, 10).map(x => ({
        time: x.t,
        station: (x.r.station != null ? x.r.station : (x.r.current_station != null ? x.r.current_station : null)),
        run_time: (x.r.run_time != null ? x.r.run_time : (x.r.watering_time != null ? x.r.watering_time : null))
      }));
    }

    // Compact plain-text debug (screenshot-friendly) — ?debug=2
    if (url.searchParams.get('debug') === '2') {
      const short = (o) => o == null ? 'null' : JSON.stringify(o).slice(0, 700);
      const txt = [
        'last_watered: ' + (lastWateredFromEvents || 'null'),
        'history: ' + history.length + ' items',
        'statusKeys: ' + Object.keys(st).join(', '),
        '',
        'watering_status = ' + short(st.watering_status),
        '',
        'watering_statuses = ' + short(st.watering_statuses),
        '',
        'next_start_programs = ' + short(st.next_start_programs)
      ].join('\n');
      return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    const status = timer.status || {};
    const watering = status.watering_status || {};
    const activeStations = watering.stations || [];
    const activeZone = activeStations.length > 0 ? activeStations[0].station : null;

    const isConnected = !!(
      timer.is_connected || timer.connected ||
      status.is_connected || status.connected ||
      timer.hardware_version
    );

    const zones = (timer.zones || []).map(z => ({
      station: z.station,
      name: z.name || `Zone ${z.station}`,
      smart: !!(z.smart_watering_enabled),
      image_url: z.image_url || null
    }));

    const resp = {
      ok: true,
      device: {
        id: timer.id,
        name: timer.name || 'Irrigation Controller',
        connected: isConnected,
        run_mode: status.run_mode || 'auto',
        rain_delay: status.rain_delay || 0,
        active_station: activeZone,
        last_watered: lastWateredFromEvents || timer.last_watering_end_time || null,
        next_start_time: status.next_start_time || timer.next_start_time || null
      },
      zones,
      history
    };
    if (debug) resp._debug = dbg;
    // Include session token when browser needs it for direct WebSocket control
    if (url.searchParams.get('tk') === '1') resp._token = token;
    return Response.json(resp);

  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}
