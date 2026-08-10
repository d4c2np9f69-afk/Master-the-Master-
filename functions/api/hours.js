// /api/hours — engine hour sensor bridge between ESP32 and the HCC app
// GET  → returns latest sensor data (from KV) or zeroed stub
// POST → stores reading from ESP32, forwards to Beehive HA webhook

// KV binding: Cloudflare Pages may expose it as HCC_KV or MOWER_KV depending
// on how the binding was named in the dashboard. Try both so either works.
function getKV(env) {
  return env.HCC_KV || env.MOWER_KV || null;
}

const MOW_HISTORY_KEY = 'hours_history';
const MOW_HISTORY_MAX = 50;

// Full raw reading log — every single POST the sensor box ever sends (live or
// heartbeat), not just mow-end summaries. Capped at 5000 readings: at the
// box's 90s live-posting interval that's ~250 engine-on hours of history,
// years of real mowing at Jeff's usage rate, while staying well under
// Cloudflare KV's 25MB per-value limit (~2-3MB at this cap).
const SENSOR_LOG_KEY = 'sensor_log';
const SENSOR_LOG_MAX = 5000;

function logEntryFrom(body) {
  return {
    date: new Date().toISOString(),
    source: body.source || (body.engine_running === false ? 'heartbeat' : 'live'),
    engine_running: (typeof body.engine_running === 'boolean') ? body.engine_running : null,
    hours: (typeof body.hours === 'number') ? body.hours : null,
    battery: (typeof body.battery === 'number') ? body.battery : null,
    rpm_peak: (typeof body.rpm_peak === 'number') ? body.rpm_peak : null,
    rpm_avg: (typeof body.rpm_avg === 'number') ? body.rpm_avg : null,
    dist_total_m: (typeof body.dist_total_m === 'number') ? body.dist_total_m : null,
    dist_session_m: (typeof body.dist_session_m === 'number') ? body.dist_session_m : null,
    speed_mph: (typeof body.speed_mph === 'number') ? body.speed_mph : null,
    lat: (typeof body.lat === 'number') ? body.lat : null,
    lon: (typeof body.lon === 'number') ? body.lon : null,
    has_fix: (typeof body.has_fix === 'boolean') ? body.has_fix : null,
    pitch: (typeof body.pitch === 'number') ? body.pitch : null,
    roll: (typeof body.roll === 'number') ? body.roll : null,
    vibration: (typeof body.vibration === 'number') ? body.vibration : null,
    shock_events: (typeof body.shock_events === 'number') ? body.shock_events : null,
    wifi_rssi: (typeof body.wifi_rssi === 'number') ? body.wifi_rssi : null,
    esp_temp_f: (typeof body.esp_temp_f === 'number') ? body.esp_temp_f : null,
    mpu_ok: (typeof body.mpu_ok === 'number') ? body.mpu_ok : null,
    gps_rx: (typeof body.gps_rx === 'number') ? body.gps_rx : null,
  };
}

export async function onRequestGet({ env, request }) {
  const kv = getKV(env);
  const url = new URL(request.url);

  // ?log=1 — the full raw reading-by-reading history, fetched on demand only
  // (not part of the normal sync payload, so routine syncs stay small/fast).
  if (url.searchParams.get('log') === '1') {
    if (kv) {
      try {
        const logRaw = await kv.get(SENSOR_LOG_KEY);
        return Response.json({ log: logRaw ? JSON.parse(logRaw) : [] });
      } catch (_) {}
    }
    return Response.json({ log: [] });
  }

  if (kv) {
    try {
      const raw = await kv.get('hours_data');
      const histRaw = await kv.get(MOW_HISTORY_KEY);
      const history = histRaw ? JSON.parse(histRaw) : [];
      if (raw) return Response.json({ ...JSON.parse(raw), history });
      return Response.json({
        hours: 0, lastSync: null, battery: null,
        rpm_peak: null, rpm_avg: null,
        dist_total_m: null, dist_session_m: null, speed_mph: null,
        source: 'stub', history
      });
    } catch (_) {}
  }
  return Response.json({
    hours: 0, lastSync: null, battery: null,
    rpm_peak: null, rpm_avg: null,
    dist_total_m: null, dist_session_m: null, speed_mph: null,
    source: 'stub', history: []
  });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch (_) {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const kv = getKV(env);
  const isHeartbeat = body.source === 'heartbeat' || body.engine_running === false;

  let prev = null;
  if (kv) {
    try {
      const prevRaw = await kv.get('hours_data');
      if (prevRaw) prev = JSON.parse(prevRaw);
    } catch (_) {}
  }

  // Heartbeats (engine off) only carry battery/wifi/temp — they don't know the
  // mow's hours, RPM, distance, or GPS track. Merging onto the last full reading
  // (instead of overwriting it) means parking the mower to charge doesn't erase
  // what it just recorded; the heartbeat only refreshes the fields it actually has.
  let merged = body;
  if (isHeartbeat && prev) {
    merged = { ...prev, ...body };
  }

  // The moment a heartbeat follows a real live reading is exactly "the mow just
  // ended" — log a permanent snapshot of that completed mow (hours/RPM/distance)
  // so mow-to-mow comparisons survive instead of only ever showing the latest
  // state. dist_session_m/rpm_peak/rpm_avg are already scoped to "this mow" by
  // the sensor box itself, so they're recorded as-is, not recomputed here.
  const wasLive = prev && prev.source !== 'heartbeat' && prev.engine_running !== false && typeof prev.hours === 'number';
  if (isHeartbeat && wasLive && kv) {
    try {
      const histRaw = await kv.get(MOW_HISTORY_KEY);
      const hist = histRaw ? JSON.parse(histRaw) : [];
      hist.push({
        date: new Date().toISOString(),
        hours_end: prev.hours,
        rpm_peak: (typeof prev.rpm_peak === 'number') ? prev.rpm_peak : null,
        rpm_avg: (typeof prev.rpm_avg === 'number') ? prev.rpm_avg : null,
        dist_session_m: (typeof prev.dist_session_m === 'number') ? prev.dist_session_m : null,
      });
      await kv.put(MOW_HISTORY_KEY, JSON.stringify(hist.slice(-MOW_HISTORY_MAX)));
    } catch (_) {}
  }

  // Log EVERY reading — live or heartbeat — to the full raw history, not just
  // mow-end summaries. This is the complete record: every field the box
  // reports, at every point in time it reports it.
  if (kv) {
    try {
      const logRaw = await kv.get(SENSOR_LOG_KEY);
      const log = logRaw ? JSON.parse(logRaw) : [];
      log.push(logEntryFrom(body));
      await kv.put(SENSOR_LOG_KEY, JSON.stringify(log.slice(-SENSOR_LOG_MAX)));
    } catch (_) {}
  }

  const data = { ...merged, lastSync: new Date().toISOString() };

  if (kv) {
    await kv.put('hours_data', JSON.stringify(data));
  }

  if (env.HA_WEBHOOK_BASE) {
    try {
      await fetch(`${env.HA_WEBHOOK_BASE}/api/webhook/hcc-mower-sensor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(8000)
      });
    } catch (_) {}
  }

  return Response.json({ ok: true });
}
