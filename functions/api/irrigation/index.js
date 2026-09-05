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

// Orbit identifies the calling client with an `orbit-app-id` header. This file
// never sent one and started getting HTTP 401 on login, while the HA integration
// — which DOES send it, and cycles through these same three values — authenticated
// fine against the identical account from a different IP on the same day. That
// asymmetry is the whole diagnosis: the credentials were never the problem.
//
// Kept as a list, in the same order the HA side uses, because Orbit has retired
// individual app ids before. If all three are rejected the error reports what each
// one actually returned rather than a bare "login failed".
// 2026-08-19: `null` FIRST — meaning send NO orbit-app-id at all, exactly like
// pybhyve, the library HA's working B-Hyve integration uses. The note above says
// this file "never sent one and started getting HTTP 401", so a header was added to
// fix it. That 401 was the STALE PASSWORD, not a missing header — proven when Jeff
// updated BHYVE_PASSWORD in Cloudflare and the 401 turned into "HTTP 200 with the
// full account payload but no session token" on all three app-ids. pybhyve sends no
// orbit-app-id and gets a token from this same account, so the header is now the
// prime suspect for Orbit withholding it. Kept the three ids as fallbacks rather
// than deleting them, since a wrong guess here costs irrigation.
const APP_IDS = [
  null,
  'Orbit Support Dashboard',
  'com.orbitbhyve.ios',
  'com.orbit.orbitbhyve',
];

async function bhyveLogin(email, password) {
  const attempts = [];
  for (const appId of APP_IDS) {
    const label = appId === null ? 'no-app-id (pybhyve shape)' : appId;
    let r, body = '';
    try {
      r = await fetch(`${API_BASE}/session`, {
        method: 'POST',
        headers: appId === null ? { ...LOGIN_HEADERS } : { ...LOGIN_HEADERS, 'orbit-app-id': appId },
        body: JSON.stringify({ session: { email, password } }),
        signal: AbortSignal.timeout(15000),
      });
      body = await r.text().catch(() => '');
    } catch (e) {
      attempts.push(`${label}: ${e.name || 'network error'}`);
      continue;
    }
    if (!r.ok) { attempts.push(`${label}: HTTP ${r.status} — ${body.slice(0, 60)}`); continue; }

    let data;
    try { data = JSON.parse(body); }
    catch (_) { attempts.push(`${label}: 200 but not JSON`); continue; }

    const token = data.orbit_session_token || data.token || data.session_token || data.access_token;
    const userId = data.user_id || data.id || data.userId;
    if (token && userId) return { token, userId, appId };
    // 2026-08-19: Orbit started returning HTTP 200 with the full account payload
    // (first_name, user_id, bhyve_account_id, orbit_api_key...) but NO session
    // token, for credentials that are definitely correct. pybhyve — the library HA
    // uses — reads `orbit_session_token`, which we already check first, so the field
    // name is not the problem: Orbit is simply withholding the token. The payload
    // carries `require_password_change`, so surface its VALUE (a boolean, never a
    // secret) rather than only the key name. Without it this failure is
    // indistinguishable from a wrong password, which is what sent a session chasing
    // a stale credential for hours.
    attempts.push(
      `${label}: 200 but no token — require_password_change=${JSON.stringify(data.require_password_change)}` +
      ` — keys: ${Object.keys(data).join(',')}`
    );
  }
  throw new Error(`login_failed — ${attempts.join(' | ')}`);
}

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  // The caller's credentials win over the deployment defaults, not the other way
  // round. These env vars are set once at deploy time and quietly go stale; the
  // query params come from what Jeff actually typed into the app and are the same
  // login the B-Hyve phone app is using right now.
  //
  // The old order had env FIRST, so a stale deployment variable silently overrode
  // the correct credentials the app was sending on every request — which is exactly
  // how this endpoint ended up reporting "not authorized" for an account whose
  // password had never changed and whose phone app was working fine.
  const email = url.searchParams.get('e') || env.BHYVE_EMAIL || '';
  const password = url.searchParams.get('p') || env.BHYVE_PASSWORD || '';
  const credSource = url.searchParams.get('e') ? 'request' : 'env';

  if (!email || !password) {
    return Response.json({ ok: false, error: 'credentials_not_provided' }, { status: 400 });
  }

  try {
    const { token, userId, appId } = await bhyveLogin(email, password);

    const devHeaders = {
      'Accept': 'application/json, text/plain, */*',
      'Host': 'api.orbitbhyve.com',
      'Referer': 'https://api.orbitbhyve.com/',
      'Orbit-Session-Token': token,
      // Carry the SAME app id that the login was accepted under. Sending it only
      // on /session would just push the 401 one call further down.
      'orbit-app-id': appId,
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

    // Watering history — CORRECT endpoint is /watering_events/{device_id} (device id
    // in the PATH; a ?device_id= query 404s). Returns recent runs. Parse defensively.
    const st = timer.status || {};
    const dbg = { deviceKeys: Object.keys(timer), statusKeys: Object.keys(st), events: [] };
    let lastWateredFromEvents = null;
    let history = [];
    const evUrls = [
      `${API_BASE}/watering_events/${timer.id}?page=1&per-page=25`,
      `${API_BASE}/watering_events/${timer.id}`
    ];
    for (const eu of evUrls) {
      try {
        const wr = await fetch(eu, { headers: devHeaders });
        const bodyText = await wr.text().catch(() => '');
        dbg.events.push({ url: eu.replace(API_BASE, ''), status: wr.status, sample: bodyText.slice(0, 500) });
        if (!wr.ok || !bodyText) continue;
        let raw; try { raw = JSON.parse(bodyText); } catch (_) { continue; }
        const arr = Array.isArray(raw) ? raw
                  : Array.isArray(raw.watering_events) ? raw.watering_events
                  : Array.isArray(raw.data) ? raw.data : [];
        const events = [];
        arr.forEach(item => {
          if (item && Array.isArray(item.irrigation)) {
            item.irrigation.forEach(z => events.push(Object.assign({ _evtime: item.start_time || item.end_time }, z)));
          } else if (item) events.push(item);
        });
        const ts = (e) => new Date(e.end_time || e.start_time || e.started_watering_station_at || e._evtime || 0).getTime();
        events.sort((a, b) => ts(b) - ts(a));
        if (events.length && ts(events[0]) > 0) {
          const e0 = events[0];
          lastWateredFromEvents = e0.end_time || e0.start_time || e0.started_watering_station_at || e0._evtime || null;
          history = events.slice(0, 10).map(e => ({
            time: e.end_time || e.start_time || e.started_watering_station_at || e._evtime || null,
            station: (e.station != null ? e.station : (e.current_station != null ? e.current_station : null)),
            run_time: (e.run_time != null ? e.run_time : (e.watering_time != null ? e.watering_time : null)),
            gallons: (e.water_volume_gal != null ? e.water_volume_gal : null)
          }));
          break;
        }
      } catch (e) { dbg.events.push({ url: eu.replace(API_BASE, ''), error: String(e).slice(0, 140) }); }
    }

    // Compact plain-text debug (screenshot-friendly) — ?debug=2
    if (url.searchParams.get('debug') === '2') {
      const txt = [
        'last_watered: ' + (lastWateredFromEvents || 'null'),
        'history: ' + history.length + ' items',
        'first history item: ' + (history[0] ? JSON.stringify(history[0]) : 'none'),
        '',
        'watering_events fetch attempts:',
        ...dbg.events.map(e => '  ' + e.url + '  -> status ' + (e.status || 'ERR') + '\n    ' + (e.sample || e.error || '').slice(0, 400))
      ].join('\n');
      return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    const status = timer.status || {};
    const watering = status.watering_status || {};

    // ⚠️ THIS REPORTED "NOT WATERING" THROUGH EVERY SINGLE RUN. Fixed 2026-09-05.
    // The old code was `watering.stations[0].station`. **`watering_status.stations` does
    // not exist.** Captured straight off Orbit at 05:56:20 while Jeff stood watching
    // zone 2 physically running:
    //
    //   watering_status = { current_station: 2,
    //                       group_watering: [{ program:"e", stations:[
    //                            {station:1,run_time:43},{station:2,run_time:14},
    //                            {station:5,run_time:23} ]}],
    //                       water_event_queue: [{station:2,run_time_sec:840},
    //                                           {station:5,run_time_sec:1380}] }
    //   watering-status  = null        watering_statuses = []
    //
    // So `.stations` -> undefined -> [] -> null -> the app said idle while the sprinklers
    // were on. The running zone is `current_station`; the station LIST is nested one level
    // down in group_watering[0].stations. Orbit also ships two decoy keys - a HYPHENATED
    // `watering-status` and a plural `watering_statuses` - both empty here; do not switch
    // to either of them on the strength of the name.
    // Jeff, 2026-09-05: "B hive is active and working fine. It's all the shit that you have
    // build that's not working!" - correct, this was ours.
    const groupStations = (Array.isArray(watering.group_watering) && watering.group_watering[0]
                            && Array.isArray(watering.group_watering[0].stations))
                          ? watering.group_watering[0].stations : [];
    const wateringQueue = Array.isArray(watering.water_event_queue) ? watering.water_event_queue : [];
    const activeZone =
      (watering.current_station != null) ? watering.current_station
      : (Array.isArray(watering.stations) && watering.stations.length ? watering.stations[0].station
      : (wateringQueue.length ? wateringQueue[0].station : null));

    // ⚠️ THIS WAS HARD-WIRED TO TRUE. Fixed 2026-08-20.
    // The old expression ORed in `timer.hardware_version` — a field EVERY device record
    // always carries — so isConnected could never be false and the app displayed
    // "● ONLINE" continuously while the Water Hog was actually unplugged. Orbit reported
    // is_connected:false with last_connected_at 2026-08-13; the dashboard said ONLINE for
    // the whole week. Jeff had taken it offline because of the irrigation leak, and every
    // control command silently went nowhere because there was no controller to receive it.
    //
    // Only a real boolean from Orbit counts now. If none is present the answer is UNKNOWN
    // (null), never a cheerful true — the UI shows "CHECK APP" for that.
    const connFlags = [timer.is_connected, timer.connected, status.is_connected, status.connected];
    const realFlag = connFlags.find(v => typeof v === 'boolean');
    const isConnected = realFlag === undefined ? null : realFlag;

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
        last_connected: timer.last_connected_at || timer.last_connected || null,
        run_mode: status.run_mode || 'auto',
        rain_delay: status.rain_delay || 0,
        active_station: activeZone,
        is_watering: activeZone != null,
        // what Orbit says is still to come in this run, so the card can show progress
        watering_queue: wateringQueue.map(q => ({
          station: q.station,
          run_time: (q.run_time_sec != null ? Math.round(q.run_time_sec / 60) : (q.run_time != null ? q.run_time : null))
        })),
        program_stations: groupStations.map(s => ({ station: s.station, run_time: s.run_time })),
        last_watered: lastWateredFromEvents || timer.last_watering_end_time || null,
        next_start_time: status.next_start_time || timer.next_start_time || null
      },
      zones,
      history
    };
    if (url.searchParams.get('debug') === '1') resp._debug = dbg;
    // Include session token when browser needs it for direct WebSocket control
    if (url.searchParams.get('tk') === '1') resp._token = token;
    return Response.json(resp);

  } catch (e) {
    // Say WHICH credentials were used. A stale deployment variable silently
    // overriding the app's own login is what made this failure look like a
    // password problem for an account whose password was fine — the error should
    // never leave that ambiguous again.
    return Response.json({
      ok: false,
      error: e.message,
      cred_source: credSource,
      hint: credSource === 'env'
        ? 'Used BHYVE_EMAIL/BHYVE_PASSWORD from the Cloudflare deployment, not app-supplied credentials.'
        : 'Used credentials supplied by the app request.',
    }, { status: 503 });
  }
}
