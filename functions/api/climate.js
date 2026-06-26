// /api/climate — GET: fetch LUX thermostat status, POST: control thermostat
// GET params: e (email), p (password)
// POST body: { email, password, action, device_id, cool_sp?, heat_sp?, value? }
// Actions: set_sp, set_mode, set_fan
const LUX_BASE = 'https://integration.lux-geo.com';

async function luxLogin(email, password) {
  const r = await fetch(`${LUX_BASE}/users/sign_in.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ user: { email, password } }),
  });
  const body = await r.text().catch(() => '');
  if (!r.ok) throw new Error(`login_failed — HTTP ${r.status} — ${body.slice(0, 120)}`);
  const data = JSON.parse(body);
  const token = data.authentication_token || data.auth_token || data.token;
  const userId = data.id || data.user_id;
  if (!token || !userId) throw new Error(`login_failed — no token — keys: ${Object.keys(data).join(',')}`);
  return { token, userId };
}

async function luxGetDevices(userId, token) {
  const r = await fetch(`${LUX_BASE}/users/${userId}/produkts.json`, {
    headers: { 'Accept': 'application/json', 'X-Auth-Token': token },
  });
  if (!r.ok) throw new Error('devices_failed: ' + r.status);
  return await r.json();
}

async function luxPutDevice(userId, token, deviceId, payload) {
  const r = await fetch(`${LUX_BASE}/users/${userId}/produkts/${deviceId}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify(payload),
  });
  const body = await r.text().catch(() => '');
  if (!r.ok) throw new Error(`put_failed — HTTP ${r.status} — ${body.slice(0, 120)}`);
  return JSON.parse(body);
}

function parseDevice(d) {
  // LUX API nests status under d.current_values or d.status or top-level
  const cv = d.current_values || d.status || d;
  const current_temp = cv.indoor_temp ?? cv.temp ?? cv.current_temp ?? cv.current ?? null;
  const cool_sp = cv.cool_set_point ?? cv.cool_sp ?? cv.cooling_setpoint ?? d.cool_set_point ?? 72;
  const heat_sp = cv.heat_set_point ?? cv.heat_sp ?? cv.heating_setpoint ?? d.heat_set_point ?? 68;
  const op_mode = cv.op_mode ?? cv.mode ?? cv.system_mode ?? d.op_mode ?? 'off';
  const fan_mode = cv.fan_mode ?? cv.fan ?? d.fan_mode ?? 'auto';
  const schedule = cv.schedule ?? cv.program ?? d.program ?? null;
  return {
    device_id: d.serial_number ?? d.id ?? d.device_id,
    name: d.name || d.label || 'Thermostat',
    current_temp,
    cool_sp,
    heat_sp,
    op_mode,
    fan_mode,
    schedule_active: !!schedule,
    raw: cv,
  };
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const email = env.LUX_EMAIL || url.searchParams.get('e') || '';
  const password = env.LUX_PASSWORD || url.searchParams.get('p') || '';

  if (!email || !password) {
    return Response.json({ ok: false, error: 'credentials_not_provided' }, { status: 400 });
  }

  try {
    const { token, userId } = await luxLogin(email, password);
    const devices = await luxGetDevices(userId, token);
    const list = Array.isArray(devices) ? devices : (devices.produkts || devices.devices || [devices]);
    if (!list.length) {
      return Response.json({ ok: false, error: 'no_devices_found' }, { status: 404 });
    }
    const thermostat = parseDevice(list[0]);
    return Response.json({ ok: true, thermostat });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch (_) {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const email = env.LUX_EMAIL || body.email || '';
  const password = env.LUX_PASSWORD || body.password || '';

  if (!email || !password) {
    return Response.json({ ok: false, error: 'credentials_not_provided' }, { status: 400 });
  }

  const { action, device_id, cool_sp, heat_sp, value } = body;
  if (!action) return Response.json({ ok: false, error: 'missing_action' }, { status: 400 });

  try {
    const { token, userId } = await luxLogin(email, password);

    let targetDeviceId = device_id;
    if (!targetDeviceId) {
      const devices = await luxGetDevices(userId, token);
      const list = Array.isArray(devices) ? devices : (devices.produkts || devices.devices || [devices]);
      if (!list.length) return Response.json({ ok: false, error: 'no_devices_found' }, { status: 404 });
      targetDeviceId = list[0].serial_number ?? list[0].id;
    }

    let payload = {};
    if (action === 'set_sp') {
      if (cool_sp != null) payload.cool_set_point = parseInt(cool_sp, 10);
      if (heat_sp != null) payload.heat_set_point = parseInt(heat_sp, 10);
    } else if (action === 'set_mode') {
      payload.op_mode = value;
    } else if (action === 'set_fan') {
      payload.fan_mode = value;
    } else {
      return Response.json({ ok: false, error: 'unknown_action: ' + action }, { status: 400 });
    }

    const result = await luxPutDevice(userId, token, targetDeviceId, { produkt: payload });
    const thermostat = parseDevice(result.produkt || result);
    return Response.json({ ok: true, thermostat });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}
