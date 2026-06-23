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

  const data = { ...body, lastSync: new Date().toISOString() };

  const kv = getKV(env);
  if (kv) {
    await kv.put('hours_data', JSON.stringify(data));
  }

  if (env.HA_WEBHOOK_BASE) {
    try {
      await fetch(`${env.HA_WEBHOOK_BASE}/api/webhook/hcc-mower-sensor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (_) {}
  }

  return Response.json({ ok: true });
}
