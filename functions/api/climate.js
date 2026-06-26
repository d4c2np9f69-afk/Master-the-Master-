// /api/climate — LUX Connected Home thermostat via Geo platform API
// GET params: e (email/identity), p (password)
// POST body: { email, password, action, cool_sp?, heat_sp?, value? }
const GEO_BASE = 'https://api.geotogether.com';

const C_TO_F = c => Math.round(c * 9 / 5 + 32);
const F_TO_C = f => +((f - 32) * 5 / 9).toFixed(1);

const MODE_FROM_GEO = { '1': 'heat', '2': 'cool', '4': 'auto', '5': 'off', '0': 'off' };
const MODE_TO_GEO   = { heat: '1', cool: '2', auto: '4', off: '5' };

async function geoLogin(identity, password) {
  const r = await fetch(`${GEO_BASE}/usersservice/v2/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ identity, password }),
  });
  const body = await r.text().catch(() => '');
  if (!r.ok) throw new Error(`login_failed — HTTP ${r.status} — ${body.slice(0, 200)}`);
  const data = JSON.parse(body);
  const token = data.accessToken || data.access_token || data.token;
  if (!token) throw new Error(`login_failed — no accessToken — keys: ${Object.keys(data).join(',')}`);
  return { token, username: data.username || data.email || identity };
}

async function geoGetSystems(token) {
  const r = await fetch(`${GEO_BASE}/api/userapi/v2/user/detail-systems?systemDetails=true`, {
    headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
  });
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`systems_failed: HTTP ${r.status} — ${body.slice(0, 120)}`);
  }
  const data = await r.json();
  // systemDetails is an array; grab first systemId
  const systems = data.systemRoles || data.systemDetails || [];
  const sys = systems[0] || {};
  const systemId = sys.systemId || sys.id || null;
  return { systemId, systems };
}

async function geoGetLive(token, systemId) {
  const r = await fetch(`${GEO_BASE}/api/userapi/system/smets2-live-data/${systemId}`, {
    headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
  });
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`live_failed: HTTP ${r.status} — ${body.slice(0, 120)}`);
  }
  return await r.json();
}

async function geoGetPeriodic(token, systemId) {
  const r = await fetch(`${GEO_BASE}/api/userapi/system/smets2-periodic-data/${systemId}`, {
    headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
  });
  if (!r.ok) return null;
  return await r.json();
}

function getFeature(arr, ...names) {
  if (!Array.isArray(arr)) return null;
  for (const name of names) {
    const f = arr.find(x => x.feature === name || x.type === name || x.name === name);
    if (f) return f.value ?? f.val ?? f.data;
  }
  return null;
}

function parseThermostat(live, periodic, systemId) {
  // live data has temperature, systemStatus, power fields
  // periodic data has setPoints for heating/cooling
  const sp = (periodic && periodic.setPoints) || {};
  const heatSp = sp.heatingSetpoint ?? sp.heat ?? sp.heating ?? null;
  const coolSp = sp.coolingSetpoint ?? sp.cool ?? sp.cooling ?? null;

  // Temperature: live.temperature is likely in Celsius tenths or Celsius
  let tempC = null;
  if (live.temperature != null) {
    tempC = live.temperature > 100 ? live.temperature / 10 : live.temperature;
  }

  // Mode from systemStatus
  const status = live.systemStatus || {};
  const modeRaw = String(status.operationMode ?? status.mode ?? status.hvacMode ?? '5');
  const fanRaw  = String(status.fanMode ?? status.fan ?? '0');

  // Try device-data array if present
  const devData = live.deviceData || live.data || [];
  const ch = Array.isArray(devData) ? (devData[0] || {}) : devData;
  const features = ch.data || ch.channelData || [];
  if (features.length) {
    if (tempC === null) {
      const v = getFeature(features, 'TEMPERATURE', 'INDOOR_TEMPERATURE');
      if (v != null) tempC = parseFloat(v);
    }
  }

  return {
    device_id: systemId,
    name: live.name || live.systemName || 'LUX Thermostat',
    current_temp: tempC != null ? C_TO_F(tempC) : null,
    cool_sp: coolSp != null ? C_TO_F(parseFloat(coolSp)) : 72,
    heat_sp: heatSp != null ? C_TO_F(parseFloat(heatSp)) : 68,
    op_mode: MODE_FROM_GEO[modeRaw] || 'off',
    fan_mode: fanRaw === '1' || fanRaw === 'on' ? 'on' : 'auto',
    raw: live,
  };
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const identity = env.LUX_EMAIL    || url.searchParams.get('e') || '';
  const password  = env.LUX_PASSWORD || url.searchParams.get('p') || '';

  if (!identity || !password) {
    return Response.json({ ok: false, error: 'credentials_not_provided' }, { status: 400 });
  }

  try {
    const { token }        = await geoLogin(identity, password);
    const { systemId }     = await geoGetSystems(token);
    if (!systemId) return Response.json({ ok: false, error: 'no_system_found' }, { status: 404 });
    const live             = await geoGetLive(token, systemId);
    const periodic         = await geoGetPeriodic(token, systemId);
    const thermostat       = parseThermostat(live, periodic, systemId);
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

  const identity = env.LUX_EMAIL    || body.email    || '';
  const password  = env.LUX_PASSWORD || body.password || '';

  if (!identity || !password) {
    return Response.json({ ok: false, error: 'credentials_not_provided' }, { status: 400 });
  }

  const { action, cool_sp, heat_sp, value } = body;
  if (!action) return Response.json({ ok: false, error: 'missing_action' }, { status: 400 });

  try {
    const { token }    = await geoLogin(identity, password);
    const { systemId } = await geoGetSystems(token);
    if (!systemId) return Response.json({ ok: false, error: 'no_system_found' }, { status: 404 });

    const setUrl = `${GEO_BASE}/api/userapi/system/smets2-setpoints/${systemId}`;

    if (action === 'set_sp') {
      const payload = {};
      if (cool_sp != null) payload.coolingSetpoint = F_TO_C(parseInt(cool_sp, 10));
      if (heat_sp != null) payload.heatingSetpoint = F_TO_C(parseInt(heat_sp, 10));
      const r = await fetch(setUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const rb = await r.text().catch(() => '');
        throw new Error(`set_sp_failed: HTTP ${r.status} — ${rb.slice(0, 120)}`);
      }
    } else if (action === 'set_mode') {
      const r = await fetch(`${GEO_BASE}/api/userapi/system/smets2-setmode/${systemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ operationMode: MODE_TO_GEO[value] || '5' }),
      });
      if (!r.ok) {
        const rb = await r.text().catch(() => '');
        throw new Error(`set_mode_failed: HTTP ${r.status} — ${rb.slice(0, 120)}`);
      }
    } else if (action === 'set_fan') {
      const r = await fetch(`${GEO_BASE}/api/userapi/system/smets2-setfan/${systemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ fanMode: value === 'on' ? '1' : '0' }),
      });
      if (!r.ok) {
        const rb = await r.text().catch(() => '');
        throw new Error(`set_fan_failed: HTTP ${r.status} — ${rb.slice(0, 120)}`);
      }
    } else {
      return Response.json({ ok: false, error: 'unknown_action: ' + action }, { status: 400 });
    }

    const live     = await geoGetLive(token, systemId);
    const periodic = await geoGetPeriodic(token, systemId);
    return Response.json({ ok: true, thermostat: parseThermostat(live, periodic, systemId) });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}
