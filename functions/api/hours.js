// /api/hours — engine hour sensor bridge between ESP32 and the HCC app
// GET  → returns latest sensor data (from KV) or zeroed stub
// POST → stores reading from ESP32, forwards to Beehive HA webhook

// KV binding: Cloudflare Pages may expose it as HCC_KV or MOWER_KV depending
// on how the binding was named in the dashboard. Try both so either works.
function getKV(env) {
  return env.HCC_KV || env.MOWER_KV || null;
}

export async function onRequestGet({ env }) {
  const kv = getKV(env);
  if (kv) {
    try {
      const raw = await kv.get('hours_data');
      if (raw) return Response.json(JSON.parse(raw));
    } catch (_) {}
  }
  return Response.json({
    hours: 0, lastSync: null, battery: null,
    rpm_peak: null, rpm_avg: null,
    dist_total_m: null, dist_session_m: null, speed_mph: null,
    source: 'stub'
  });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch (_) {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const kv = getKV(env);

  // Heartbeats (engine off) only carry battery/wifi/temp — they don't know the
  // mow's hours, RPM, distance, or GPS track. Merging onto the last full reading
  // (instead of overwriting it) means parking the mower to charge doesn't erase
  // what it just recorded; the heartbeat only refreshes the fields it actually has.
  const isHeartbeat = body.source === 'heartbeat' || body.engine_running === false;
  let merged = body;
  if (isHeartbeat && kv) {
    try {
      const prevRaw = await kv.get('hours_data');
      if (prevRaw) merged = { ...JSON.parse(prevRaw), ...body };
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
