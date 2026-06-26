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
        last_watered: timer.last_watering_end_time || null,
        next_start_time: status.next_start_time || timer.next_start_time || null
      },
      zones
    };
    // Include session token when browser needs it for direct WebSocket control
    if (url.searchParams.get('tk') === '1') resp._token = token;
    return Response.json(resp);

  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}
