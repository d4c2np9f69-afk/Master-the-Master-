// /api/auth — family login for the HCC app
// POST {password}           → validates against KV hash, returns HA token
// POST {action:"setup", password, ha_token} → one-time setup (only if no hash exists yet)

function getKV(env) {
  return env.HCC_KV || env.MOWER_KV || null;
}

async function sha256(str) {
  const data = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost({ request, env }) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  };

  let body;
  try { body = await request.json(); } catch (_) {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: cors });
  }

  const kv = getKV(env);
  if (!kv) {
    return new Response(JSON.stringify({ error: 'kv_unavailable' }), { status: 500, headers: cors });
  }

  // Bootstrap-only: pre-stage the HA token in KV before setup runs, so a
  // public-facing setup page never has to carry it. Locked out once a
  // password already exists.
  if (body.action === 'stage_token') {
    if (!body.ha_token) {
      return new Response(JSON.stringify({ error: 'ha_token required' }), { status: 400, headers: cors });
    }
    const existing = await kv.get('auth_hash');
    if (existing) {
      return new Response(JSON.stringify({ error: 'already_setup' }), { status: 403, headers: cors });
    }
    await kv.put('setup_ha_token', body.ha_token);
    return new Response(JSON.stringify({ ok: true }), { headers: cors });
  }

  // One-time setup: store the password hash + HA token.
  // ha_token may come in the request body, OR (so it never has to appear in a
  // public page or a client) be pre-staged in KV under 'setup_ha_token' —
  // consumed once and deleted.
  if (body.action === 'setup') {
    if (!body.password) {
      return new Response(JSON.stringify({ error: 'password required' }), { status: 400, headers: cors });
    }
    const existing = await kv.get('auth_hash');
    if (existing) {
      return new Response(JSON.stringify({ error: 'already_setup', hint: 'delete auth_hash from KV to reset' }), { status: 403, headers: cors });
    }
    let ha_token = body.ha_token;
    if (!ha_token) {
      ha_token = await kv.get('setup_ha_token');
      if (ha_token) await kv.delete('setup_ha_token');
    }
    if (!ha_token) {
      return new Response(JSON.stringify({ error: 'ha_token required (or stage it in KV as setup_ha_token)' }), { status: 400, headers: cors });
    }
    const hash = await sha256(body.password);
    await kv.put('auth_hash', hash);
    await kv.put('auth_ha_token', ha_token);
    return new Response(JSON.stringify({ ok: true }), { headers: cors });
  }

  // Normal login
  if (!body.password) {
    return new Response(JSON.stringify({ error: 'password required' }), { status: 400, headers: cors });
  }

  const hash = await sha256(body.password);
  const stored = await kv.get('auth_hash');

  if (!stored) {
    return new Response(JSON.stringify({ error: 'not_setup', hint: 'run setup first' }), { status: 503, headers: cors });
  }

  if (hash !== stored) {
    return new Response(JSON.stringify({ error: 'invalid' }), { status: 401, headers: cors });
  }

  const ha_token = await kv.get('auth_ha_token') || '';
  return new Response(JSON.stringify({ ok: true, ha_token }), { headers: cors });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
