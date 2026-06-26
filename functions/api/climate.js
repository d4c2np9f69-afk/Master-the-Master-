// /api/climate — LUX Connected Home thermostat via Geo platform API
// GET params: e (email), p (password)
// POST body: { email, password, action, device_id?, cool_sp?, heat_sp?, value? }
// Actions: set_sp, set_mode, set_fan
const GEO_BASE = 'https://api.geotogether.com';

const C_TO_F = c => Math.round(c * 9 / 5 + 32);
const F_TO_C = f => ((f - 32) * 5 / 9).toFixed(1);

// Operation mode mapping (Geo numeric → name)
const MODE_FROM_GEO = { '1': 'heat', '2': 'cool', '4': 'auto', '5': 'off' };
const MODE_TO_GEO   = { heat: '1', cool: '2', auto: '4', off: '5' };

async function geoLogin(email, password) {
  const r = await fetch(`${GEO_BASE}/usersService/v2/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ username: email, password, clientId: 'android-geo-home' }),
  });
  const body = await r.text().catch(() => '');
  if (!r.ok) throw new Error(`login_failed — HTTP ${r.status} — ${body.slice(0, 200)}`);
  const data = JSON.parse(body);
  const token = data.token || data.access_token || data.authentication_token;
  const userId = data.userId || data.user_id || data.id;
  if (!token || !userId) throw new Error(`login_failed — no token — keys: ${Object.keys(data).join(',')}`);
  return { token, userId };
}

async function geoGetLive(userId, token) {
  const r = await fetch(`${GEO_BASE}/api/userdata/device/liveData?systemId=${userId}`, {
    headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
  });
  if (!r.ok) throw new Error('live_data_failed: ' + r.status);
  return await r.json();
}

function getFeature(data, name) {
  if (!Array.isArray(data)) return null;
  const item = data.find(d => d.feature === name);
  return item ? item.value : null;
}

function parseLiveData(live) {
  // liveData has deviceData array; use first channel
  const channels = live.deviceData || live.data || [];
  const ch = channels[0] || {};
  const data = ch.data || ch.channelData || [];

  const tempC     = parseFloat(getFeature(data, 'TEMPERATURE') || getFeature(data, 'INDOOR_TEMPERATURE') || '0');
  const coolSpC   = parseFloat(getFeature(data, 'COOL_SETPOINT') || getFeature(data, 'COOLING_SETPOINT') || '24');
  const heatSpC   = parseFloat(getFeature(data, 'HEATING_SETPOINT') || '20');
  const modeRaw   = getFeature(data, 'OPERATION_MODE') || '5';
  const fanRaw    = getFeature(data, 'FAN_MODE') || getFeature(data, 'FAN_STATUS') || '0';

  return {
    device_id: live.serial || live.systemId || live.id || null,
    name: live.name || 'LUX Thermostat',
    current_temp: C_TO_F(tempC),
    cool_sp: C_TO_F(coolSpC),
    heat_sp: C_TO_F(heatSpC),
    op_mode: MODE_FROM_GEO[modeRaw] || 'off',
    fan_mode: fanRaw === '1' || fanRaw === 'on' ? 'on' : 'auto',
    raw_mode: modeRaw,
    raw_fan: fanRaw,
  };
}

async function geoSetData(userId, token, feature, value) {
  const r = await fetch(`${GEO_BASE}/api/setData`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      systemId: userId,
      zone: '1',
      feature,
      value: String(value),
      activationCode: 1,
      accessLevel: '0',
    }),
  });
  const body = await r.text().catch(() => '');
  if (!r.ok) throw new Error(`set_failed — HTTP ${r.status} — ${body.slice(0, 120)}`);
  return JSON.parse(body || '{}');
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const email    = env.LUX_EMAIL    || url.searchParams.get('e') || '';
  const password = env.LUX_PASSWORD || url.searchParams.get('p') || '';

  if (!email || !password) {
    return Response.json({ ok: false, error: 'credentials_not_provided' }, { status: 400 });
  }

  try {
    const { token, userId } = await geoLogin(email, password);
    const live = await geoGetLive(userId, token);
    const thermostat = parseLiveData(live);
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

  const email    = env.LUX_EMAIL    || body.email    || '';
  const password = env.LUX_PASSWORD || body.password || '';

  if (!email || !password) {
    return Response.json({ ok: false, error: 'credentials_not_provided' }, { status: 400 });
  }

  const { action, cool_sp, heat_sp, value } = body;
  if (!action) return Response.json({ ok: false, error: 'missing_action' }, { status: 400 });

  try {
    const { token, userId } = await geoLogin(email, password);

    if (action === 'set_sp') {
      if (cool_sp != null) await geoSetData(userId, token, 'COOL_SETPOINT',  F_TO_C(parseInt(cool_sp, 10)));
      if (heat_sp != null) await geoSetData(userId, token, 'HEATING_SETPOINT', F_TO_C(parseInt(heat_sp, 10)));
    } else if (action === 'set_mode') {
      const geoMode = MODE_TO_GEO[value] || '5';
      await geoSetData(userId, token, 'OPERATION_MODE', geoMode);
    } else if (action === 'set_fan') {
      await geoSetData(userId, token, 'FAN_MODE', value === 'on' ? '1' : '0');
    } else {
      return Response.json({ ok: false, error: 'unknown_action: ' + action }, { status: 400 });
    }

    const live = await geoGetLive(userId, token);
    const thermostat = parseLiveData(live);
    return Response.json({ ok: true, thermostat });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}
