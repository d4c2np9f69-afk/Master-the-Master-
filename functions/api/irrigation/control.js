// /api/irrigation/control — POST: controls B-Hyve zones (start/stop/rain_delay)
// Body: { pin, action, station?, minutes?, hours? }
const API_BASE = 'https://api.orbitbhyve.com/v1';

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

async function sendWsCommand(token, message) {
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
      setTimeout(() => {
        if (!settled) {
          settled = true;
          try { ws.close(); } catch (_) {}
          resolve({ ok: true, event: 'sent' });
        }
      }, 3000);
    }

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        try { ws.close(); } catch (_) {}
        // If command was already sent, treat as success — B-Hyve may have processed it
        if (commandSent) resolve({ ok: true, event: 'sent' });
        else reject(new Error('ws_timeout'));
      }
    }, 9000);

    ws.addEventListener('message', (evt) => {
      try {
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

    const result = await sendWsCommand(token, message);
    return Response.json(result);

  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}
