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

// ── 4 + 5. no credential may travel in a URL — ENFORCED as of 2026-09-15 23:40 (#186)
// These three were TRACKED-not-enforced for about twenty minutes, deferred because the fix
// touches functions/api/irrigation/index.js and that file sits inside the #109 HOLD.
// They are enforced now because the fix turned out not to need anything the hold protects:
// moving a credential from a query string to the `x-hcc-creds` header is pure transport and
// goes nowhere near the watering/gallons logic the hold exists to guard.
//
// 🔴 THE PART THAT MUST NOT BE "TIDIED": the two endpoints have OPPOSITE precedence, on purpose.
//   climate.js            env FIRST,     then the caller's credential
//   irrigation/index.js   REQUEST FIRST, then env
// The irrigation order was set after a stale deployment variable masked a correct login and
// produced "not authorized" for an account whose phone app was working fine. Both orders survived
// this change unchanged. If a future session "harmonises" them, it re-breaks irrigation.
for (const [name, src] of [['climate.js', climate], ['irrigation/index.js', irrIndex]]) {
  const hits = src.match(/searchParams\.get\(\s*['"][ep]['"]\s*\)/g) || [];
  check(name + ' never reads a credential from the URL', hits.length === 0,
    hits.length + ' x searchParams ?e/?p — query strings are logged by the CDN');
  check(name + ' reads the credential from the x-hcc-creds header instead',
    /x-hcc-creds/.test(src), 'no header read found');
}
check('index.html never puts a password in a query string',
  !/['"&?]p=['"]?\s*\+\s*encodeURIComponent/.test(app),
  "found '?p=' concatenation");
check('index.html sends credentials in the header',
  /x-hcc-creds/.test(app), 'fetchWithCreds is not using the header');
// precedence guards — each endpoint keeps its own order
check('climate.js keeps env-first precedence',
  /env\.LUX_EMAIL\s*\|\|\s*req\.email/.test(climate));
check('irrigation/index.js keeps REQUEST-first precedence (the stale-env bug)',
  /reqEmail\s*\|\|\s*env\.BHYVE_EMAIL/.test(irrIndex));

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
