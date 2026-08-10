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

export async function onRequestGet({ env }) {
  const kv = getKV(env);
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
