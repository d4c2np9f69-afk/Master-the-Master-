#!/usr/bin/env node
/* asset-version-gate-test.js — written 2026-10-08, the same session as the mistake it catches.
 *
 * THE MISTAKE THIS COVERS — and it happened TWICE in one evening, which is the whole argument
 * for a gate rather than a note:
 *
 *   docs/house-plan/index.html loads its scripts with a cache-buster, `plan-app.js?v=20260925f`.
 *   Twice on 2026-10-08 a session edited plan-app.js / plan-live.js, reloaded, and saw NOTHING
 *   CHANGE — because the `?v=` string had not changed, so the browser served the file it already
 *   had. The first time it looked like the new code was broken (0 elements found where 4 were
 *   expected) and real time went into chasing a bug that did not exist.
 *
 *   The far worse half: that is not a local testing quirk. **No device would ever have received
 *   the change.** Jeff's phone, his iPad and the installed PWA would all have kept serving the
 *   old file indefinitely. A change that ships to nobody looks exactly like a change that works.
 *
 *   This is the same class as the stale-build problem the project already fixed once for the main
 *   app (sw-restart-gate-test.js, "a stale build cannot survive a restart any more"). The house
 *   plan has its own versioning and was never covered.
 *
 * HOW IT WORKS — content-addressed, no git required, no guessing:
 *   A manifest records the sha256 of every versioned asset alongside the `?v=` token that was
 *   current when they were last recorded. If an asset's hash moved but the token did not, the
 *   change cannot reach a browser that has the old copy -> FAIL.
 *
 *   After bumping `?v=` in index.html, re-record with:
 *       node scripts/asset-version-gate-test.js --record
 *
 * WHY IT DOES NOT CRY WOLF:
 *   - Exits 0 (SKIPPED) if the page or its assets are not on this machine.
 *   - Only files actually referenced with `?v=` are tracked, discovered from the HTML itself, so
 *     adding or removing a script needs no edit here.
 *   - It never fails for a *token* change alone; bumping the version and changing nothing is
 *     harmless and simply re-records.
 *   - A missing manifest is a first run, not a failure: it records and passes, saying so.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PAGE = path.join(__dirname, '..', 'docs', 'house-plan', 'index.html');
const DIR = path.dirname(PAGE);
const MANIFEST = path.join(DIR, '.asset-version.json');
const RECORD = process.argv.includes('--record');

let fails = 0;
const check = (name, ok, detail) => {
  console.log((ok ? '  PASS  ' : '  FAIL  ') + name + (!ok && detail ? '   [' + String(detail).slice(0, 220) + ']' : ''));
  if (!ok) fails++;
};

console.log('asset-version-gate-test.js — a change nobody can receive is not a change\n');

if (!fs.existsSync(PAGE)) {
  console.log('asset-version-gate-test.js: SKIPPED — no docs/house-plan/index.html here');
  process.exit(0);
}

const html = fs.readFileSync(PAGE, 'utf8');
const refs = [...html.matchAll(/(?:src|href)\s*=\s*"([^"?]+)\?v=([^"]+)"/g)]
  .map((m) => ({ file: m[1], ver: m[2] }));

if (!refs.length) {
  console.log('asset-version-gate-test.js: SKIPPED — index.html references no ?v= assets');
  process.exit(0);
}

const tokens = [...new Set(refs.map((r) => r.ver))];
check('all versioned assets share one ?v= token', tokens.length === 1,
  'found ' + tokens.length + ': ' + tokens.join(', ') + ' — a split token means half the page updates and half does not');
const token = tokens[0];

// Hash CONTENT, not bytes on disk. Line endings must be normalised first or this gate cries wolf
// on every checkout: git's EOL filter rewrites LF->CRLF on checkout, so `git checkout -- file`
// alone changes the raw bytes and would look like an un-shipped edit. That was caught while
// proving this gate red-then-green on 2026-10-08 — the restore step stayed red — and it is the
// same CRLF trap SESSION_START.md §3 already warns about for live-vs-local index.html.
const TEXT = /\.(js|css|html|json|svg|map|txt|md)$/i;
function contentHash(p) {
  const buf = fs.readFileSync(p);
  const data = TEXT.test(p) ? Buffer.from(buf.toString('utf8').replace(/\r\n/g, '\n'), 'utf8') : buf;
  return crypto.createHash('sha256').update(data).digest('hex').slice(0, 16);
}

const now = {};
for (const r of refs) {
  const p = path.join(DIR, r.file);
  if (!fs.existsSync(p)) { check('asset exists: ' + r.file, false, 'referenced by index.html but not on disk'); continue; }
  now[r.file] = contentHash(p);
}

let prior = null;
if (fs.existsSync(MANIFEST)) {
  try { prior = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); } catch { prior = null; }
}

if (RECORD || !prior) {
  fs.writeFileSync(MANIFEST, JSON.stringify({ version: token, assets: now }, null, 2) + '\n');
  console.log((RECORD ? '  RECORDED' : '  FIRST RUN — recorded') + '  version ' + token + ', ' +
    Object.keys(now).length + ' asset(s)');
  if (fails) { console.log('\nASSET VERSION GATE FAILED — ' + fails + ' problem(s).\n'); process.exit(1); }
  console.log('\nasset-version-gate-test.js: clean.\n');
  process.exit(0);
}

const changed = Object.keys(now).filter((f) => prior.assets && prior.assets[f] !== now[f]);
if (changed.length && token === prior.version) {
  check('every changed asset got a ?v= bump', false,
    changed.join(', ') + ' changed while ?v= stayed "' + token +
    '" — browsers and the installed PWA will keep serving the OLD file. Bump ?v= in index.html, then: node scripts/asset-version-gate-test.js --record');
} else {
  check('every changed asset got a ?v= bump', true, '');
  if (token !== prior.version) {
    fs.writeFileSync(MANIFEST, JSON.stringify({ version: token, assets: now }, null, 2) + '\n');
    console.log('  NOTE    version moved ' + prior.version + ' -> ' + token + ', manifest re-recorded');
  }
}

if (fails) {
  console.log('\nASSET VERSION GATE FAILED — ' + fails + ' problem(s).');
  console.log('This fired twice on 2026-10-08. A change that ships to nobody looks exactly like a change that works.\n');
  process.exit(1);
}
console.log('\nasset-version-gate-test.js: clean — ' + Object.keys(now).length + ' asset(s) at ?v=' + token + '.\n');
