// /api/irrigation — GET: fetches live status from Orbit B-Hyve via their unofficial REST API
const API_BASES = [
  'https://api.orbitonline.com/v1',
  'https://api2.orbitonline.com/v1',
  'https://api.bhyve.com/v1',
];

const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'orbit-app-id': 'Orbit Support Dashboard',
  'orbit-api-key': '1',
  'User-Agent': 'bhyve/2.67 (iPhone; iOS 17; Scale/3.00)',
};

// Returns { session, base } — tries each known base URL until one works
async function bhyveLogin(email, password) {
  let lastErr = 'login_failed: no base URL worked';
  for (const base of API_BASES) {
    const r = await fetch(`${base}/session`, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: JSON.stringify({ email, password })
    });
    if (r.ok) {
      const session = await r.json();
      return { session, base };
    }
    const body = await r.text().catch(() => '');
    lastErr = 'login_failed_' + r.status + ' (' + base.replace('https://','') + '): ' + body.slice(0, 120);
    if (r.status !== 404) break; // 404 means endpoint moved — retry. 401/422 means wrong creds — stop.
  }
  throw new Error(lastErr);
}

export async function onRequestGet({ env }) {
  const email = env.BHYVE_EMAIL;
  const password = env.BHYVE_PASSWORD;

  if (!email || !password) {
    return Response.json({ ok: false, error: 'credentials_not_configured' }, { status: 503 });
  }

  try {
    const { session, base } = await bhyveLogin(email, password);
    const token = session.orbit_session_token;
    const userId = session.user_id;

    if (!token || !userId) throw new Error('no_session_token');

    const devHeaders = { ...BASE_HEADERS, 'orbit-session-token': token };
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
      return Response.json({ ok: false, error: 'no_timer_device_found' }, { status: 404 });
    }

    const status = timer.status || {};
    const watering = status.watering_status || {};
    const activeStations = watering.stations || [];
    const activeZone = activeStations.length > 0 ? activeStations[0].station : null;

    // B-Hyve stores connection status in several fields depending on firmware version
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
