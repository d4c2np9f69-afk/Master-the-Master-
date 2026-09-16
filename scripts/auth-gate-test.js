#!/usr/bin/env node
/* auth-gate-test.js — the SERVER-SIDE half of the credential gate (2026-09-15)
 *
 * WHY THIS EXISTS
 * ---------------
 * `creds-gate-test.js` proves the APP never holds or asks for credentials. It
 * says nothing about the SERVER. That gap is exactly how two unauthenticated
 * write paths survived ~989 commits of otherwise careful discipline:
 *
 *   /api/climate           POST -> env.LUX_PASSWORD   (OPEN_ITEMS #184)
 *   /api/irrigation/control POST -> env.BHYVE_PASSWORD (#184's twin)
 *
 * Both env vars were confirmed SET on the live Pages project on 2026-09-15, so
 * the irrigation one was an internet-reachable switch for the real sprinklers.
 * Every existing test looked at the client. Nobody had written the one that
 * looks at the server. A rule that only lives in a document is not a gate.
 *
 * WHAT IT CHECKS — statically, no deploy required. Exit 0 is the only pass.
 *   1. Each control-class POST calls ctrlAuthorised().
 *   2. The gate is reached BEFORE the endpoint logs in to the vendor. A check
 *      that runs after the credentials have already been used is decoration.
 *   3. The gate compares against KV (auth_hash / ctrl_token), not a constant.
 *   4. No server endpoint reads a credential out of a query string.
 *   5. The app never builds a URL carrying a password.
 *   6. /api/auth mints a ctrl_token, and the app stores it — otherwise the gate
 *      is closed to the family too, and the next session "fixes" it by removing
 *      the gate. (That is not hypothetical: index.html line ~6529 still carries
 *      the comment "Gate removed 2026-08-20" from exactly that sequence.)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

let failed = 0;
function check(name, ok, evidence) {
  if (ok) { console.log('  PASS  ' + name); return; }
  failed++;
  console.log('  FAIL  ' + name + (evidence ? '   [' + evidence + ']' : ''));
}

console.log('\nauth-gate-test.js — server-side authorisation on control endpoints\n');

const climate  = read('functions/api/climate.js');
const control  = read('functions/api/irrigation/control.js');
const irrIndex = read('functions/api/irrigation/index.js');
const authFn   = read('functions/api/auth.js');
const app      = read('index.html');

// ── 1 + 2. the gate exists AND runs before the vendor login ────────────────
const endpoints = [
  { name: '/api/climate POST',            src: climate, login: 'withAuth(' },
  { name: '/api/irrigation/control POST', src: control, login: 'bhyveLogin(' },
];
for (const ep of endpoints) {
  const post = ep.src.slice(ep.src.indexOf('export async function onRequestPost'));
  const gateAt  = post.indexOf('ctrlAuthorised(');
  const loginAt = post.indexOf(ep.login);
  check(ep.name + ' requires authorisation', gateAt !== -1, 'no ctrlAuthorised() call');
  check(ep.name + ' gates BEFORE using the stored credentials',
    gateAt !== -1 && (loginAt === -1 || gateAt < loginAt),
    'gate runs after ' + ep.login);
}

// ── 3. the gate is real: it compares to something stored in KV ─────────────
for (const [name, src] of [['climate.js', climate], ['control.js', control]]) {
  check(name + ' gate compares against KV, not a constant',
    /kv\.get\(\s*['"](auth_hash|ctrl_token|mower_ctrl_token)['"]\s*\)/.test(src));
  check(name + ' rejects a blank KV value (length check present)',
    /length\s*>=\s*16/.test(src),
    'a missing KV key could otherwise authorise');
}

// ── 4 + 5. credentials in URLs — TRACKED, NOT YET ENFORCED (OPEN_ITEMS #186)
// These are REAL and they are not fixed. They are reported every run and do not
// fail the build, for one reason that is written down rather than assumed:
// fixing them means editing functions/api/irrigation/index.js, which is inside
// the #109 HOLD ("Do NOT change code before working through it") — a hold tied
// to the sewer-overcharge claim against the City of White House.
//
// The precedence there is also load-bearing and REVERSED from climate.js:
// irrigation takes the REQUEST credential first and env second, because the old
// env-first order let a stale deployment variable mask the correct login and
// produced "not authorized" for an account whose phone app was working fine.
// Any move to a header must preserve that order exactly, per endpoint.
//
// Severity, honestly: a query string leaks a credential into CDN logs and
// browser history. That is bad. It is NOT the same class as the write paths
// above, which let a stranger run the sprinklers. Those are enforced; this is
// queued behind a hold that is Jeff's to lift.
// 🔴 WHEN #109 CLEARS: delete this block's `tracked()` calls and restore them as
// check() — the assertions themselves are already correct as written.
function tracked(name, ok, evidence) {
  console.log((ok ? '  PASS  ' : '  TRACKED (#186, not enforced)  ') + name +
    (!ok && evidence ? '   [' + evidence + ']' : ''));
}
for (const [name, src] of [['climate.js', climate], ['irrigation/index.js', irrIndex]]) {
  const hits = src.match(/searchParams\.get\(\s*['"][ep]['"]\s*\)/g) || [];
  tracked(name + ' never reads a credential from the URL', hits.length === 0,
    hits.length + ' x searchParams ?e/?p — query strings are logged by the CDN');
}
tracked('index.html never puts a password in a query string',
  !/['"&?]p=['"]?\s*\+\s*encodeURIComponent/.test(app),
  "found '?p=' concatenation");

// ── 6. the family can still get in ────────────────────────────────────────
check('/api/auth mints a ctrl_token at family login', /ctrl_token/.test(authFn));
check('the app stores the ctrl_token it is handed',   /safeSetItem\('ctrl_token'/.test(app));
check('the app sends ctrl_token on a control POST',   /payload\.ctrl_token\s*=/.test(app));

if (failed) {
  console.log('\nAUTH GATE FAILED — ' + failed + ' problem(s). Do not ship.\n');
  process.exit(1);
}
console.log('\nauth-gate-test.js: clean — every control endpoint is gated server-side.\n');
process.exit(0);
