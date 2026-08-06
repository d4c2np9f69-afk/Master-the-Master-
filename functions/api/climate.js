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

// KV binding: same dual-name fallback as functions/api/hours.js
function getKV(env) {
  return env.HCC_KV || env.MOWER_KV || null;
}

const TOKEN_KV_KEY = 'lux_tokens';

async function getCachedTokens(env) {
  const kv = getKV(env);
  if (!kv) return null;
  try {
    const raw = await kv.get(TOKEN_KV_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) { return null; }
}

function accessTokenStillValid(data) {
  return !!(data && data.access_token && data.expires_at && Date.now() < data.expires_at - 5 * 60 * 1000);
}

// Stores both the access token (short-lived, ~1hr) AND the refresh token (long-lived —
// the SCOPE explicitly requests offline_access to get one). previousRefreshToken lets a
// refresh-exchange response that doesn't include a new refresh_token (some OAuth servers
// don't rotate it) keep using the one we already had instead of losing it.
async function cacheTokens(env, tokens, previousRefreshToken) {
  const kv = getKV(env);
  if (!kv) return;
  const expires_at = Date.now() + (tokens.expires_in ? tokens.expires_in * 1000 : 55 * 60 * 1000);
  const refresh_token = tokens.refresh_token || previousRefreshToken || null;
  try {
    await kv.put(TOKEN_KV_KEY, JSON.stringify({ access_token: tokens.access_token, expires_at, refresh_token }));
  } catch (_) {}
}

// Fast, single-request token refresh — same B2C token endpoint as step 4 of luxAuth(),
// just with grant_type=refresh_token instead of authorization_code, so it skips the
// whole authorize/SelfAsserted/confirmed cookie-carrying dance entirely.
async function refreshTokens(refreshToken) {
  const r = await fetch(`${B2C_BASE}/te/${B2C_TENANT}/${B2C_POLICY}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      scope: SCOPE,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
  });
  const body = await r.text().catch(() => '{}');
  if (!r.ok) throw new Error(`refresh_failed: ${r.status} — ${body.slice(0, 120)}`);
  const tokens = JSON.parse(body);
  if (!tokens.access_token) throw new Error(`refresh_no_access_token — keys: ${Object.keys(tokens).join(',')}`);
  return tokens;
}

// Runs fn(accessToken), preferring (in order): a still-valid cached access token, then a
// refresh-token exchange (fast + reliable, one request), and only falling back to the
// full interactive B2C login (slow, multi-step, the fragile path most likely to trip a
// transient failure) when neither of those is available or both fail. This is what makes
// LUX "stay logged in" the way a normal refresh-token integration does — previously the
// refresh_token from the offline_access scope was requested but never stored/used, so
// ANY access-token cache miss (expiry, or just Cloudflare KV's eventual-consistency lag
// across edge locations) fell straight back to a full login every time (08-06, Jeff:
// "does it need a token? All the other things stay logged in").
async function withAuth(env, email, password, fn) {
  const cached = await getCachedTokens(env);
  if (accessTokenStillValid(cached)) {
    try { return await fn(cached.access_token); }
    catch (e) { if (!/\b401\b/.test(e.message)) throw e; }
  }
  if (cached && cached.refresh_token) {
    try {
      const tokens = await refreshTokens(cached.refresh_token);
      await cacheTokens(env, tokens, cached.refresh_token);
      return await fn(tokens.access_token);
    } catch (_) { /* refresh token itself expired/invalid — fall through to full login */ }
  }
  const tokens = await luxAuth(email, password);
  await cacheTokens(env, tokens, null);
  return await fn(tokens.access_token);
}

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
  // POST works; PUT returns 500 on this API. Keep PUT as fallback.
  const errors = [];
  for (const method of ['POST', 'PUT']) {
    const r = await fetch(`${API_BASE}/device`, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Deviceid': deviceId,
        'User-Agent': 'LUXGeo/1.0',
      },
      body: JSON.stringify(state),
    });
    if (r.ok) return await r.json().catch(() => ({}));
    const b = await r.text().catch(() => '');
    errors.push(`${method} → ${r.status}: ${b.slice(0, 60)}`);
  }
  throw new Error(`set_device failed — ${errors.join(' | ')}`);
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
    const thermostat = await withAuth(env, email, password, async (accessToken) => {
      const userData = await getLocationUser(accessToken);
      const locRaw = userData.location;
      const loc = (Array.isArray(locRaw) ? locRaw[0] : locRaw) || (userData.locations?.[0]) || {};
      const devices = loc.devices || [];
      const device = devices[0];
      if (!device) {
        const diag = `no_device_found — keys:${Object.keys(userData).join(',')} loc_keys:${Object.keys(loc).join(',') || 'none'} devices:${devices.length}`;
        const err = new Error(diag);
        err.status = 404;
        err.raw = userData;
        throw err;
      }
      const state = await getDeviceState(accessToken, device.id);
      return parseThermostat(state, device.id, device.name);
    });
    return Response.json({ ok: true, thermostat });
  } catch (e) {
    return Response.json({ ok: false, error: e.message, raw: e.raw }, { status: e.status || 503 });
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
    const thermostat = await withAuth(env, email, password, async (accessToken) => {
      const userData = await getLocationUser(accessToken);
      const locRaw = userData.location;
      const loc = (Array.isArray(locRaw) ? locRaw[0] : locRaw) || (userData.locations?.[0]) || {};
      const device = (loc.devices || [])[0];
      if (!device) {
        const diag = `no_device_found — keys:${Object.keys(userData).join(',')} loc_keys:${Object.keys(loc).join(',') || 'none'}`;
        const err = new Error(diag);
        err.status = 404;
        err.raw = userData;
        throw err;
      }

      // GET full raw state, modify the target field, PUT the whole object back
      // (matches Python luxgeo package behavior: d = get_state(); d[field]=val; put(d))
      const currentState = await getDeviceState(accessToken, device.id);

      if (action === 'set_sp') {
        if (heat_sp != null) currentState.holdheat = parseInt(heat_sp, 10);
        if (cool_sp != null) currentState.holdcool = parseInt(cool_sp, 10);
      } else if (action === 'set_mode') {
        const modeInt = MODE_TO_INT[value];
        if (modeInt === undefined) { const err = new Error('unknown_mode: ' + value); err.status = 400; throw err; }
        currentState.systemmode = modeInt;
      } else if (action === 'set_fan') {
        currentState.fanmode = value === 'on' ? 1 : 0;
      } else {
        const err = new Error('unknown_action: ' + action); err.status = 400; throw err;
      }

      await setDeviceState(accessToken, device.id, currentState);
      const newState = await getDeviceState(accessToken, device.id);
      return parseThermostat(newState, device.id, device.name);
    });
    return Response.json({ ok: true, thermostat });
  } catch (e) {
    return Response.json({ ok: false, error: e.message, raw: e.raw }, { status: e.status || 503 });
  }
}
