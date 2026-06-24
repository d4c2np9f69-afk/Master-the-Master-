// /api/irrigation/control — POST: controls B-Hyve zones (start/stop/rain_delay)
// Body: { pin, action, station?, minutes?, hours? }
// B-Hyve protocol: send auth → wait for server confirmation → send command → wait for ack
const API = 'https://api.orbitonline.com/v1';

async function bhyveLogin(email, password) {
  const r = await fetch(`${API}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'orbit-app-id': 'Orbit Support Dashboard', 'orbit-api-key': '1' },
    body: JSON.stringify({ email, password })
  });
  if (!r.ok) throw new Error('login_failed: ' + r.status);
  return r.json();
}

async function getTimerDevice(userId, token) {
  const r = await fetch(`${API}/devices?user_id=${userId}`, {
    headers: { 'orbit-session-token': token, 'Accept': 'application/json', 'orbit-app-id': 'Orbit Support Dashboard', 'orbit-api-key': '1' }
  });
  if (!r.ok) throw new Error('devices_failed');
  const devices = await r.json();
  return (devices || []).find(d =>
    d.type === 'bhyve_timer' || d.type === 'sprinkler_timer' ||
    (Array.isArray(d.zones) && d.zones.length > 0)
  );
}

async function sendWsCommand(token, message) {
  const wsResp = await fetch('https://api.orbitonline.com/v1/events', {
    headers: {
      'orbit-session-token': token,
      'Upgrade': 'websocket',
      'Connection': 'Upgrade',
      'orbit-app-id': 'Orbit Support Dashboard',
      'orbit-api-key': '1'
    }
  });

  if (wsResp.status !== 101) {
    throw new Error('ws_upgrade_failed: ' + wsResp.status);
  }

  const ws = wsResp.webSocket;
  ws.accept();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      try { ws.close(); } catch (_) {}
      reject(new Error('ws_timeout'));
    }, 9000);

    let commandSent = false;

    ws.addEventListener('message', (evt) => {
      try {
        const msg = JSON.parse(evt.data);

        // Server confirmed our auth — send the actual command exactly once
        if (!commandSent && (msg.event === 'app_connection' || msg.status === 'connected')) {
          commandSent = true;
          ws.send(JSON.stringify(message));
          return;
        }

        // Server acknowledged the command
        if (msg.event === 'watering_in_progress' || msg.event === 'change_mode' ||
            msg.event === 'program_changed' || msg.event === 'rain_delay') {
          clearTimeout(timeout);
          try { ws.close(); } catch (_) {}
          resolve({ ok: true, event: msg.event });
          return;
        }

        if (msg.event === 'error') {
          clearTimeout(timeout);
          try { ws.close(); } catch (_) {}
          reject(new Error(msg.message || 'ws_error'));
        }
      } catch (_) {}
    });

    ws.addEventListener('error', () => {
      clearTimeout(timeout);
      reject(new Error('ws_error'));
    });

    // Step 1: authenticate — send once, wait for server to confirm before sending command
    ws.send(JSON.stringify({ event: 'app_connection', orbit_session_token: token }));
  });
}

export async function onRequestPost({ request, env }) {
  const pin = env.CONTROL_PIN;
  const email = env.BHYVE_EMAIL;
  const password = env.BHYVE_PASSWORD;

  if (!email || !password) {
    return Response.json({ ok: false, error: 'credentials_not_configured' }, { status: 503 });
  }

  let body;
  try { body = await request.json(); } catch (_) {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (pin && body.pin !== pin) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 403 });
  }

  const { action, station, minutes, hours } = body;
  if (!action) return Response.json({ ok: false, error: 'missing_action' }, { status: 400 });

  try {
    const session = await bhyveLogin(email, password);
    const token = session.orbit_session_token;
    const userId = session.user_id;
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
