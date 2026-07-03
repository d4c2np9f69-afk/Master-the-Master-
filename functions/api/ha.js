// /api/ha — server-side proxy to Home Assistant (Beehive).
//
// WHY: the app is an https page and talking to HA directly from the browser hits three
// walls — mixed content (local http), CORS, and the Nabu Casa relay being slow enough to
// trip browser fetch timeouts. Irrigation/weather never have these problems because they go
// through Cloudflare Functions (server-to-server). This does the same for HA: the browser
// calls same-origin /api/ha?path=/api/states with its bearer token, and we forward the
// request to the Nabu Casa remote URL from the edge — no CORS, no mixed content, and a
// generous server-side timeout instead of a fragile browser one.
//
// The token is NOT stored here — the browser passes it per-request (same-origin, https) and
// we relay it. To avoid being an open proxy, we only forward to Jeff's Nabu Casa host and
// only to /api/ paths.

const ALLOWED_HOSTS = ['kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa'];
const DEFAULT_BASE = 'https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Only proxy HA API paths — never arbitrary URLs.
  let path = url.searchParams.get('path') || '/api/';
  if (!path.startsWith('/')) path = '/' + path;
  if (!path.startsWith('/api/')) {
    return Response.json({ error: 'path must start with /api/' }, { status: 400 });
  }

  // Target base: from the app's X-HA-Base header, but only if it's an allowed HA host;
  // otherwise fall back to the known-good Nabu Casa URL (never proxy to a random host).
  let base = request.headers.get('X-HA-Base') || DEFAULT_BASE;
  let target;
  try { target = new URL(base); } catch (e) { target = new URL(DEFAULT_BASE); }
  if (!ALLOWED_HOSTS.includes(target.hostname)) target = new URL(DEFAULT_BASE);

  const fwdHeaders = {};
  const auth = request.headers.get('Authorization');
  if (auth) fwdHeaders['Authorization'] = auth;

  const init = { method: request.method, headers: fwdHeaders };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    fwdHeaders['Content-Type'] = request.headers.get('Content-Type') || 'application/json';
    init.body = await request.text();
  }

  // Server-side timeout — generous, since the Nabu Casa relay adds a hop. This is the
  // knob that was too tight in the browser; here it can be comfortably large.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  init.signal = controller.signal;

  try {
    const resp = await fetch(target.origin + path, init);
    clearTimeout(timer);
    const body = await resp.text();
    return new Response(body, {
      status: resp.status,
      headers: {
        'Content-Type': resp.headers.get('Content-Type') || 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (e) {
    clearTimeout(timer);
    return Response.json(
      { error: 'ha_unreachable', detail: String((e && e.message) || e) },
      { status: 502 }
    );
  }
}
