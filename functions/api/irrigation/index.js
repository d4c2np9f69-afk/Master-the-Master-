// /api/irrigation — GET: fetches live status from Orbit B-Hyve via their unofficial REST API
const API_BASES = [
  'https://api.orbitbhyve.com/v1',
  'https://api.orbitonline.com/v1',
];

// Multiple known app IDs — try each if login fails
const APP_IDS = [
  'Orbit Support Dashboard',
  'com.orbitbhyve.ios',
  'com.orbit.orbitbhyve',
];

function makeHeaders(appId) {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'orbit-app-id': appId,
    'orbit-api-key': '1',
    'User-Agent': 'bhyve/2.67 (iPhone; iOS 17; Scale/3.00)',
  };
}

// Returns { session, base, appId } — tries every known base URL × app ID combination
async function bhyveLogin(email, password) {
  const attempts = [];
  for (const base of API_BASES) {
    for (const appId of APP_IDS) {
      try {
        const r = await fetch(`${base}/session`, {
          method: 'POST',
          headers: makeHeaders(appId),
          body: JSON.stringify({ session: { email, password } })
        });
        const body = await r.text().catch(() => '');
        attempts.push({ base, appId, status: r.status, body: body.slice(0, 80) });
        if (r.ok) {
          try {
            const session = JSON.parse(body);
            if (session && (session.orbit_session_token || session.token || session.session_token)) {
              return { session, base, appId };
            }
          } catch (_) {}
        }
      } catch (e) {
        attempts.push({ base, appId, status: 'network_error', body: e.message });
      }
    }
  }
  // All attempts failed — return detailed diagnostic
  const summary = attempts.map(a => `${a.base.replace('https://','').split('/')[0]}/${a.appId.slice(0,10)}: ${a.status}`).join(' | ');
  throw new Error('login_failed — ' + summary);
}

export async function onRequestGet({ env }) {
  const email = env.BHYVE_EMAIL;
  const password = env.BHYVE_PASSWORD;

  if (!email || !password) {
    return Response.json({ ok: false, error: 'credentials_not_configured' }, { status: 503 });
  }

  try {
    const { session, base, appId } = await bhyveLogin(email, password);

    // Handle different session field names across API versions
    const token = session.orbit_session_token || session.token || session.session_token;
    const userId = session.user_id || session.id || session.userId;

    if (!token || !userId) {
      throw new Error('no_session_token — session fields: ' + JSON.stringify(Object.keys(session)));
    }

    const devHeaders = makeHeaders(appId);
    devHeaders['orbit-session-token'] = token;
    delete devHeaders['Content-Type'];

    const dr = await fetch(`${base}/devices?user_id=${userId}`, { headers: devHeaders });
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

    return Response.json({
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
    });

  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}
