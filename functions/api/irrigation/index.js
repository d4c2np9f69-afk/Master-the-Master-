// /api/irrigation — GET: fetches live status from Orbit B-Hyve via their unofficial REST API
const API = 'https://api.orbitonline.com/v1';

async function bhyveLogin(email, password) {
  const r = await fetch(`${API}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'orbit-app-id': 'Orbit Support Dashboard', 'orbit-api-key': '1' },
    body: JSON.stringify({ email, password })
  });
  if (!r.ok) {
    const msg = await r.text().catch(() => r.status.toString());
    throw new Error('login_failed: ' + msg);
  }
  return r.json();
}

export async function onRequestGet({ env }) {
  const email = env.BHYVE_EMAIL;
  const password = env.BHYVE_PASSWORD;

  if (!email || !password) {
    return Response.json({ ok: false, error: 'credentials_not_configured' }, { status: 503 });
  }

  try {
    const session = await bhyveLogin(email, password);
    const token = session.orbit_session_token;
    const userId = session.user_id;

    if (!token || !userId) throw new Error('no_session_token');

    const dr = await fetch(`${API}/devices?user_id=${userId}`, {
      headers: { 'orbit-session-token': token, 'Accept': 'application/json', 'orbit-app-id': 'Orbit Support Dashboard', 'orbit-api-key': '1' }
    });
    if (!dr.ok) throw new Error('devices_failed: ' + dr.status);
    const devices = await dr.json();

    // Find the first sprinkler timer
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

    // B-Hyve stores connection status in several places depending on firmware version
    const isConnected = !!(
      timer.is_connected ||
      timer.connected ||
      status.is_connected ||
      status.connected ||
      timer.hardware_version  // present on all registered devices that have ever connected
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
