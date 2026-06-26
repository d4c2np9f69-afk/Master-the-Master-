// /api/climate — LUX Connected Home thermostat via Azure B2C + myluxstat.io
// GET: returns thermostat status
// POST: controls thermostat — body: { email, password, action, heat_sp?, cool_sp?, value? }
// Actions: set_sp, set_mode (heat/cool/auto/off), set_fan (on/auto)

const CLIENT_ID = 'b335ca43-3bde-4406-b281-8816afb7cc91';
const REDIRECT_URI = 'connecteddevicesjci.luxmobile://connecteddevicesjci/path';
const SCOPE = 'https://connecteddevicesjci.onmicrosoft.com/mobile/user_impersonation https://connecteddevicesjci.onmicrosoft.com/mobile/read_write offline_access openid';
const B2C_TENANT = 'connecteddevicesjci.onmicrosoft.com';
const B2C_POLICY = 'B2C_1A_SignIn';
const B2C_BASE = 'https://connecteddevicesjci.b2clogin.com';
const API_BASE = 'https://www.myluxstat.io/api';

const MODE_MAP = { 0: 'off', 1: 'heat', 2: 'cool', 3: 'auto' };
const MODE_TO_INT = { off: 0, heat: 1, cool: 2, auto: 3 };

async function generatePKCE() {
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  const cv = btoa(String.fromCharCode(...buf)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(cv));
  const cc = btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return { cv, cc };
}

function parseCookiesFromHeader(raw) {
  const result = {};
  if (!raw) return result;
  // Multiple Set-Cookie values may be comma-separated (CF Workers joins them)
  // Split on comma followed by a non-space-then-semicolon sequence (new cookie starts)
  const parts = raw.split(/,(?=\s*[^;,]+=)/);
  for (const part of parts) {
    const m = part.trim().match(/^([^=\s;]+)=([^;]*)/);
    if (m) result[m[1]] = m[2];
  }
  return result;
}

function cookieStr(cookies) {
  return Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
}

async function luxAuth(email, password) {
  const { cv, cc } = await generatePKCE();

  const authUrl = new URL(`${B2C_BASE}/te/${B2C_TENANT}/${B2C_POLICY}/oauth2/v2.0/authorize`);
  authUrl.searchParams.set('nonce', cc.slice(0, 22));
  authUrl.searchParams.set('audience', `https://${B2C_TENANT}`);
  authUrl.searchParams.set('scope', SCOPE);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('code_challenge', cc);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('state', cv.slice(0, 22));
  const authorizeUrl = authUrl.toString();

  // Step 1: GET authorize page to get CSRF + StateProperties
  const r1 = await fetch(authorizeUrl);
  if (!r1.ok) throw new Error(`auth_step1: ${r1.status}`);
  const html = await r1.text();

  let cookies = parseCookiesFromHeader(r1.headers.get('set-cookie') || '');
  const csrf = cookies['x-ms-cpim-csrf'] || '';
  if (!csrf) throw new Error(`auth_no_csrf — cookie keys: ${Object.keys(cookies).join(',')}`);

  const spMatch = html.match(/"transId":"StateProperties=([^"]+)"/);
  if (!spMatch) throw new Error('auth_no_state_properties');
  const sp = spMatch[1];

  // Step 2: POST credentials to SelfAsserted
  const url2 = `${B2C_BASE}/${B2C_TENANT}/${B2C_POLICY}/SelfAsserted?tx=StateProperties=${sp}&p=${B2C_POLICY}`;
  const r2 = await fetch(url2, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Csrf-Token': csrf,
      'Cookie': cookieStr(cookies),
      'Referer': authorizeUrl,
    },
    body: new URLSearchParams({ request_type: 'RESPONSE', logonIdentifier: email, password }).toString(),
  });
  const sc2 = r2.headers.get('set-cookie') || '';
  cookies = { ...cookies, ...parseCookiesFromHeader(sc2) };

  const r2body = await r2.text().catch(() => '');
  if (r2body.includes('"status":"400"') || r2body.includes('"status":"401"')) {
    let msg = 'invalid_credentials';
    const errMatch = r2body.match(/"message"\s*:\s*"([^"]+)"/);
    if (errMatch) msg = errMatch[1];
    throw new Error(`login_failed: ${msg}`);
  }

  // Step 3: GET confirmed — follow redirects until we hit the custom-scheme one with the code
  const url3 = `${B2C_BASE}/${B2C_TENANT}/${B2C_POLICY}/api/CombinedSigninAndSignup/confirmed?csrf_token=${csrf}&tx=StateProperties=${sp}&p=${B2C_POLICY}`;
  let codeUrl = '';
  let nextUrl = url3;
  for (let i = 0; i < 8; i++) {
    const r3 = await fetch(nextUrl, {
      redirect: 'manual',
      headers: {
        'X-Csrf-Token': csrf,
        'Cookie': cookieStr(cookies),
        'Referer': url3,
      },
    });
    const loc = r3.headers.get('location') || '';
    if (!loc) break;
    const sc3 = r3.headers.get('set-cookie') || '';
    if (sc3) cookies = { ...cookies, ...parseCookiesFromHeader(sc3) };
    if (loc.startsWith('http://') || loc.startsWith('https://')) {
      nextUrl = loc;
    } else {
      codeUrl = loc;
      break;
    }
  }

  if (!codeUrl.includes('code=')) throw new Error(`auth_no_code — redirect: ${codeUrl.slice(0, 120)}`);
  const codeMatch = codeUrl.match(/[?&]code=([^&]+)/);
  if (!codeMatch) throw new Error('auth_code_parse_failed');
  const code = decodeURIComponent(codeMatch[1]);

  // Step 4: Exchange code + PKCE verifier for tokens
  const r4 = await fetch(`${B2C_BASE}/te/${B2C_TENANT}/${B2C_POLICY}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      scope: SCOPE,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
      code_verifier: cv,
    }).toString(),
  });
  const r4body = await r4.text().catch(() => '{}');
  if (!r4.ok) throw new Error(`auth_token: ${r4.status} — ${r4body.slice(0, 120)}`);
  const tokens = JSON.parse(r4body);
  if (!tokens.access_token) throw new Error(`auth_no_access_token — keys: ${Object.keys(tokens).join(',')}`);
  return tokens;
}

async function getLocationUser(accessToken) {
  const r = await fetch(`${API_BASE}/location/user`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!r.ok) throw new Error(`location_user: ${r.status}`);
  return await r.json();
}

async function getDeviceState(accessToken, deviceId) {
  const r = await fetch(`${API_BASE}/device`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Deviceid': deviceId,
    },
  });
  if (!r.ok) throw new Error(`device_state: ${r.status}`);
  return await r.json();
}

async function setDeviceState(accessToken, deviceId, state) {
  const r = await fetch(`${API_BASE}/device`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Deviceid': deviceId,
    },
    body: JSON.stringify(state),
  });
  if (!r.ok) {
    const b = await r.text().catch(() => '');
    throw new Error(`set_device: ${r.status} — ${b.slice(0, 100)}`);
  }
  return await r.json().catch(() => ({}));
}

function parseThermostat(state, deviceId, deviceName) {
  return {
    device_id: deviceId,
    name: deviceName || state.name || 'LUX Thermostat',
    current_temp: state.currenttemp ?? state.currentTemp ?? null,
    heat_sp: state.holdheat ?? state.heatSetpoint ?? 68,
    cool_sp: state.holdcool ?? state.coolSetpoint ?? 72,
    op_mode: MODE_MAP[state.systemmode] ?? 'off',
    fan_mode: (state.fanmode === 1 || state.fanMode === 'on') ? 'on' : 'auto',
    raw: state,
  };
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const email    = env.LUX_EMAIL    || url.searchParams.get('e') || '';
  const password = env.LUX_PASSWORD || url.searchParams.get('p') || '';
  if (!email || !password) return Response.json({ ok: false, error: 'credentials_not_provided' }, { status: 400 });

  try {
    const tokens = await luxAuth(email, password);
    const userData = await getLocationUser(tokens.access_token);
    const locRaw = userData.location;
    const loc = (Array.isArray(locRaw) ? locRaw[0] : locRaw) || (userData.locations?.[0]) || {};
    const devices = loc.devices || [];
    const device = devices[0];
    if (!device) {
      const diag = `no_device_found — keys:${Object.keys(userData).join(',')} loc_keys:${Object.keys(loc).join(',') || 'none'} devices:${devices.length}`;
      return Response.json({ ok: false, error: diag, raw: userData }, { status: 404 });
    }
    const state = await getDeviceState(tokens.access_token, device.id);
    return Response.json({ ok: true, thermostat: parseThermostat(state, device.id, device.name) });
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
  if (!email || !password) return Response.json({ ok: false, error: 'credentials_not_provided' }, { status: 400 });
  const { action, cool_sp, heat_sp, value } = body;
  if (!action) return Response.json({ ok: false, error: 'missing_action' }, { status: 400 });

  try {
    const tokens = await luxAuth(email, password);
    const userData = await getLocationUser(tokens.access_token);
    const locRaw = userData.location;
    const loc = (Array.isArray(locRaw) ? locRaw[0] : locRaw) || (userData.locations?.[0]) || {};
    const device = (loc.devices || [])[0];
    if (!device) {
      const diag = `no_device_found — keys:${Object.keys(userData).join(',')} loc_keys:${Object.keys(loc).join(',') || 'none'}`;
      return Response.json({ ok: false, error: diag, raw: userData }, { status: 404 });
    }

    // GET current state so we can merge and PUT only the writable fields
    // (sending read-only fields like currenttemp back to PUT causes HTTP 500)
    const currentState = await getDeviceState(tokens.access_token, device.id);

    const putBody = {
      systemmode: currentState.systemmode ?? 0,
      holdheat:   currentState.holdheat   ?? currentState.heatSetpoint ?? 68,
      holdcool:   currentState.holdcool   ?? currentState.coolSetpoint ?? 72,
      fanmode:    currentState.fanmode    ?? 0,
    };

    if (action === 'set_sp') {
      if (heat_sp != null) putBody.holdheat = parseInt(heat_sp, 10);
      if (cool_sp != null) putBody.holdcool = parseInt(cool_sp, 10);
    } else if (action === 'set_mode') {
      const modeInt = MODE_TO_INT[value];
      if (modeInt === undefined) return Response.json({ ok: false, error: 'unknown_mode: ' + value }, { status: 400 });
      putBody.systemmode = modeInt;
    } else if (action === 'set_fan') {
      putBody.fanmode = value === 'on' ? 1 : 0;
    } else {
      return Response.json({ ok: false, error: 'unknown_action: ' + action }, { status: 400 });
    }

    await setDeviceState(tokens.access_token, device.id, putBody);
    const newState = await getDeviceState(tokens.access_token, device.id);
    return Response.json({ ok: true, thermostat: parseThermostat(newState, device.id, device.name) });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}
