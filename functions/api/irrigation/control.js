// /api/irrigation/control — POST: controls B-Hyve zones (start/stop/rain_delay)
// Body: { action, station?, minutes?, hours?, ctrl_token | password | token }
const API_BASE = 'https://api.orbitbhyve.com/v1';

// ── CONTROL AUTHORISATION — OPEN_ITEMS #184's twin, closed 2026-09-15 ────────
// VERIFIED LIVE, not assumed: the Cloudflare Pages API reports BHYVE_EMAIL and
// BHYVE_PASSWORD both SET on the toro1 production deployment. Until this gate
// existed, an unauthenticated POST to this endpoint would log in with those
// deployment credentials and start a zone, stop a zone, or set a rain delay on
// the real controller — from anywhere, with no password.
//
// Same shape as ctrlAuthorised() in functions/api/hours.js, deliberately: one
// pattern for every control-class endpoint. Accepts the maintenance token, the
// ctrl_token minted by /api/auth at family login, or the family password itself.
// The length check comes first so a missing or blank KV value can never
// authorise — that is the trap hours.js already documents.
//
// This cannot break the irrigation UI: the app drives zones through
// /api/irrigation's session-token + browser WebSocket path and never posts here.
// This endpoint is the direct-POST door, and it is the one that was standing open.
async function sha256Hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function ctrlAuthorised(env, body) {
  const kv = env.HCC_KV || env.MOWER_KV || null;
  if (!kv) return false;
  const { password, token, ctrl_token } = body || {};
  if (typeof token === 'string' && token) {
    const want = await kv.get('mower_ctrl_token');
    if (want && want.length >= 16 && token === want) return true;
  }
  if (typeof ctrl_token === 'string' && ctrl_token) {
    const want = await kv.get('ctrl_token');
    if (want && want.length >= 16 && ctrl_token === want) return true;
  }
  if (typeof password === 'string' && password) {
    const stored = await kv.get('auth_hash');
    if (stored && (await sha256Hex(password)) === stored) return true;
  }
  return false;
}

const LOGIN_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Content-Type': 'application/json; charset=utf-8;',
  'Host': 'api.orbitbhyve.com',
  'Referer': 'https://api.orbitbhyve.com/',
  'Orbit-Session-Token': '',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function bhyveLogin(email, password) {
  const r = await fetch(`${API_BASE}/session`, {
    method: 'POST',
    headers: LOGIN_HEADERS,
    body: JSON.stringify({ session: { email, password } }),
  });
  const body = await r.text().catch(() => '');
  if (!r.ok) throw new Error(`login_failed — HTTP ${r.status} — ${body.slice(0, 120)}`);
  const data = JSON.parse(body);
  const token = data.orbit_session_token || data.token || data.session_token || data.access_token;
  const userId = data.user_id || data.id || data.userId;
  if (!token || !userId) throw new Error(`login_failed — no token — keys: ${Object.keys(data).join(',')}`);
  return { token, userId };
}

async function getTimerDevice(userId, token) {
  const r = await fetch(`${API_BASE}/devices?user_id=${userId}`, {
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Host': 'api.orbitbhyve.com',
      'Referer': 'https://api.orbitbhyve.com/',
      'Orbit-Session-Token': token,
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
  });
  if (!r.ok) throw new Error('devices_failed: ' + r.status);
  const devices = await r.json();
  return (devices || []).find(d =>
    d.type === 'bhyve_timer' || d.type === 'sprinkler_timer' ||
    (Array.isArray(d.zones) && d.zones.length > 0)
  );
}

// `frames` (optional array) collects every inbound frame verbatim so a caller can prove
// what Orbit actually said instead of trusting an optimistic resolve. See ?debug=1.
async function sendWsCommand(token, message, frames) {
  // Cloudflare Workers requires https:// (not wss://) for outbound WebSocket upgrades
  const wsResp = await fetch(`${API_BASE}/events`, {
    headers: {
      'Orbit-Session-Token': token,
      'Upgrade': 'websocket',
      'Connection': 'Upgrade',
    }
  });

  if (wsResp.status !== 101) {
    throw new Error('ws_upgrade_failed: ' + wsResp.status);
  }

  const ws = wsResp.webSocket;
  ws.accept();

  return new Promise((resolve, reject) => {
    let commandSent = false;
    let settled = false;

    function sendCommand() {
      if (commandSent) return;
      commandSent = true;
      ws.send(JSON.stringify(message));
      // Resolve optimistically 3s after sending if no confirmation event arrives
      // NOT a success. The command left here, but Orbit never confirmed it. Reporting
      // ok:true for this is how a completely dead control path kept looking healthy.
      setTimeout(() => {
        if (!settled) {
          settled = true;
          try { ws.close(); } catch (_) {}
          resolve({ ok: false, event: 'unconfirmed',
                    error: 'sent_but_not_confirmed_by_bhyve' });
        }
      }, 3000);
    }

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        try { ws.close(); } catch (_) {}
        // If command was already sent, treat as success — B-Hyve may have processed it
        if (commandSent) resolve({ ok: false, event: 'unconfirmed',
                                   error: 'sent_but_not_confirmed_by_bhyve' });
        else reject(new Error('ws_timeout'));
      }
    }, 9000);

    ws.addEventListener('message', (evt) => {
      try {
        if (frames) frames.push(String(evt.data).slice(0, 400));
        const msg = JSON.parse(evt.data);

        if (!commandSent && (msg.event === 'app_connection' || msg.status === 'connected')) {
          sendCommand();
          return;
        }

        if (msg.event === 'watering_in_progress' || msg.event === 'change_mode' ||
            msg.event === 'program_changed' || msg.event === 'rain_delay') {
          if (!settled) {
            settled = true;
            clearTimeout(timeout);
            try { ws.close(); } catch (_) {}
            resolve({ ok: true, event: msg.event });
          }
          return;
        }

        if (msg.event === 'error' && !settled) {
          settled = true;
          clearTimeout(timeout);
          try { ws.close(); } catch (_) {}
          reject(new Error(msg.message || 'ws_error'));
        }
      } catch (_) {}
    });

    ws.addEventListener('error', () => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        reject(new Error('ws_error'));
      }
    });

    // Send auth handshake
    ws.send(JSON.stringify({ event: 'app_connection', orbit_session_token: token }));

    // If B-Hyve doesn't send app_connection event within 2s, send command anyway
    setTimeout(() => { sendCommand(); }, 2000);
  });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch (_) {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const email = env.BHYVE_EMAIL || body.email || '';
  const password = env.BHYVE_PASSWORD || body.password || '';

  if (!email || !password) {
    return Response.json({ ok: false, error: 'credentials_not_provided' }, { status: 400 });
  }

  // Gate BEFORE anything reaches B-Hyve. Nothing above this line touches the
  // controller, so a refused caller never causes a login attempt either.
  if (!(await ctrlAuthorised(env, body))) {
    return Response.json({ ok: false, error: 'not_authorised' }, { status: 401 });
  }

  const { action, station, minutes, hours } = body;
  if (!action) return Response.json({ ok: false, error: 'missing_action' }, { status: 400 });

  try {
    const { token, userId } = await bhyveLogin(email, password);
    const timer = await getTimerDevice(userId, token);
    if (!timer) return Response.json({ ok: false, error: 'no_timer_found' }, { status: 404 });

    let message;
    if (action === 'start' && station) {
      const runTime = Math.max(1, Math.min(60, parseInt(minutes, 10) || 10)) * 60;
      message = {
        event: 'change_mode',
        device_id: timer.id,
        mode: 'manual',
        stations: [{ station: parseInt(station, 10), run_time: runTime }]
      };
    } else if (action === 'stop') {
      message = {
        event: 'change_mode',
        device_id: timer.id,
        mode: 'auto',
        stations: []
      };
    } else if (action === 'rain_delay') {
      const h = parseInt(hours, 10) || 0;
      message = {
        event: 'rain_delay',
        device_id: timer.id,
        delay: h
      };
    } else {
      return Response.json({ ok: false, error: 'unknown_action: ' + action }, { status: 400 });
    }

    const url = new URL(request.url);
    const frames = [];
    const result = await sendWsCommand(token, message, frames);
    if (url.searchParams.get('debug') === '1') {
      result._frames = frames;
      result._sent = message;
    }
    return Response.json(result);

  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}
