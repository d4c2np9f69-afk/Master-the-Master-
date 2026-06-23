// /api/hours — returns engine hour sensor data from KV or returns zeroed stub
// When a real ESP32 sensor posts to this endpoint (POST), it stores the reading.
// GET returns the latest reading, or a zeroed stub if nothing stored yet.
export async function onRequestGet({ env }) {
  if (env.HCC_KV) {
    try {
      const raw = await env.HCC_KV.get('hours_data');
      if (raw) return Response.json(JSON.parse(raw));
    } catch (_) {}
  }
  // Stub response — sensor not yet deployed
  return Response.json({
    hours: 0,
    lastSync: null,
    battery: null,
    rpm_peak: null,
    rpm_avg: null,
    dist_total_m: null,
    dist_session_m: null,
    speed_mph: null,
    source: 'stub'
  });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch (_) {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  if (env.HCC_KV) {
    await env.HCC_KV.put('hours_data', JSON.stringify({ ...body, lastSync: new Date().toISOString() }));
    return Response.json({ ok: true });
  }
  return Response.json({ ok: false, error: 'kv_not_configured' }, { status: 503 });
}
