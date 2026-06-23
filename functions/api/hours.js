// /api/hours — engine hour sensor bridge between ESP32 and the HCC app
// GET  → returns latest sensor data (from KV) or zeroed stub
// POST → stores reading from ESP32, forwards to Beehive HA webhook

export async function onRequestGet({ env }) {
  if (env.HCC_KV) {
    try {
      const raw = await env.HCC_KV.get('hours_data');
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

  // Store in KV so the GET can serve it to the HCC app
  if (env.HCC_KV) {
    await env.HCC_KV.put('hours_data', JSON.stringify(data));
  }

  // Forward to Beehive HA webhook so HA entities stay in sync
  // HA_WEBHOOK_BASE = e.g. https://your-ha-cloud.ui.nabu.casa  (or blank for local-only)
  if (env.HA_WEBHOOK_BASE) {
    try {
      await fetch(`${env.HA_WEBHOOK_BASE}/api/webhook/hcc-mower-sensor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (_) {}  // non-fatal — HA may be offline
  }

  return Response.json({ ok: true });
}
