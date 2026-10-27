#!/usr/bin/env node
/* package-gate-test.js — every check here exists because of a mistake made on 2026-09-15/16.
 *
 * Jeff's standing rule, 2026-09-16 00:10:
 *   "Every mistake you make gets a test in the gate that fails on exactly that mistake, written
 *    the same session you made it. Not an apology, not a note — a test. If you make the SAME
 *    mistake twice, the first test was missing or too weak, and fixing it is the new first task.
 *    Your mistakes are not a character issue. They are missing coverage."
 *
 * THE MISTAKES THIS COVERS, one test each:
 *
 *  1. SHIPPED A CREDENTIAL AND CALLED THE PACKAGE "VERIFIED CLEAN".
 *     firmware/mower_hours_esp32/secrets.h went out in the handoff package with the live WiFi
 *     SSID, WiFi password and mower device secret. It is gitignored — but the packaging script
 *     copies from the FILESYSTEM, where gitignore means nothing, and the sweep that cleared it
 *     only looked for JWTs and bearer tokens. A `#define` holding a password matches neither.
 *     -> TEST 1 + 2 below.
 *
 *  2. REPORTED A PACKAGE AS COMPLETE WHILE IT WAS MISSING ITS OWN BRIEF.
 *     The build script deleted the whole output folder, including START-HERE-FOR-AI.md and
 *     MANIFEST.md, which are written INTO that folder by other steps. It destroyed them twice;
 *     the second time only an audit caught it.
 *     -> TEST 3.
 *
 *  3. LET THE PACKAGE GO STALE AND KEPT CALLING IT CURRENT.
 *     Four deploys shipped after the package was built. Its index.html and OPEN_ITEMS.md were
 *     older than the repo's while it was still being described as the current handoff.
 *     -> TEST 4.
 *
 *  4. SHIPPED BACKUP AND SCRATCH FILES AS PROJECT DOCUMENTS.
 *     *.bak-before-close files were copied into docs/ of the package.
 *     -> TEST 5.
 *
 * Skips clean (exit 0) when the package folder does not exist — this machine builds it, another
 * might not, and a gate that fails for the wrong reason gets deleted.
 */
const fs = require('fs');
const path = require('path');

const PKG = path.join(process.env.USERPROFILE || process.env.HOME || '', 'iCloudDrive', 'HCC-PROJECT');
const REPO = path.join(__dirname, '..');

if (!fs.existsSync(PKG)) {
  console.log('package-gate-test.js: SKIPPED — no package folder at ' + PKG);
  process.exit(0);
}

let fails = 0;
const check = (name, ok, detail) => {
  console.log((ok ? '  PASS  ' : '  FAIL  ') + name + (!ok && detail ? '   [' + String(detail).slice(0, 160) + ']' : ''));
  if (!ok) fails++;
};

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

console.log('\npackage-gate-test.js — the handoff package must never ship a credential\n');
const files = walk(PKG);
const rel = f => f.slice(PKG.length + 1).replace(/\\/g, '/');

// ── TEST 1: the exact file that leaked
const secrets = files.filter(f => path.basename(f) === 'secrets.h');
check('no secrets.h anywhere in the package', secrets.length === 0, secrets.map(rel).join(', '));

// ── TEST 2: credential-shaped content, by the patterns that ACTUALLY occur in this repo.
// The original sweep looked only for JWTs and bearer tokens. A #define with a password in it is
// what got through, so that shape is now first in the list.
const PATTERNS = [
  ['#define holding a secret', /#define\s+\w*(PASS|SECRET|TOKEN|KEY|SSID)\w*\s+"([^"]{3,})"/i],
  ['assigned password',        /(password|passphrase|psk)\s*[:=]\s*["']([^"']{4,})["']/i],
  ['api key assignment',       /(api[_ ]?key|client[_ ]?secret)\s*[:=]\s*["']([A-Za-z0-9_\-]{12,})["']/i],
  ['JWT',                      /eyJ[A-Za-z0-9_\-]{20,}/],
  ['bearer token',             /Bearer\s+[A-Za-z0-9_\-.]{25,}/],
];
// A placeholder is not a secret. These are the legitimate template/fixture values in this repo.
const PLACEHOLDER = /(your-|<your|example|placeholder|REPLACE_WITH|xxxx|hunter2|YourWiFi|env\.|process\.env|body\.|opts\.)/i;
// Nor is a FIELD NAME. `CONF_PASSWORD = "password"` in the bhyve component is a dictionary key,
// not a credential — it failed this test on its first run, and a gate that cries wolf gets
// ignored, which is how the real leak would get waved through next time.
const FIELD_NAME = /^(password|passwd|pass|passphrase|psk|secret|token|key|api_key|apikey|email|username|user|client_secret)$/i;
const leaks = [];
for (const f of files) {
  const st = fs.statSync(f);
  if (st.size > 6 * 1024 * 1024) continue;
  let t;
  try { t = fs.readFileSync(f, 'utf8'); } catch (_) { continue; }
  for (const [label, rx] of PATTERNS) {
    const m = rx.exec(t);
    if (!m) continue;
    const captured = m[2] || m[0];           // the VALUE, where the pattern captures one
    if (PLACEHOLDER.test(m[0])) continue;
    if (FIELD_NAME.test(captured.trim())) continue;
    leaks.push(rel(f) + '  [' + label + ': ' + captured.slice(0, 3) + '…' + captured.length + ' chars]');
  }
}
check('no credential-shaped values in any packaged file', leaks.length === 0, leaks.slice(0, 4).join(' | '));

// ── TEST 3: the package must carry its own brief and manifest
for (const must of ['START-HERE-FOR-AI.md', 'MANIFEST.md']) {
  check('package contains ' + must, fs.existsSync(path.join(PKG, must)));
}

// ── TEST 4: staleness against the repo
const pairs = [
  ['app/index.html', 'index.html'],
  ['app/service-worker.js', 'service-worker.js'],
  ['docs/OPEN_ITEMS.md', 'docs/OPEN_ITEMS.md'],
  ['rules/CLAUDE.md', 'CLAUDE.md'],
];
for (const [inPkg, inRepo] of pairs) {
  const a = path.join(PKG, inPkg), b = path.join(REPO, inRepo);
  if (!fs.existsSync(a) || !fs.existsSync(b)) { check('package has ' + inPkg, false, 'missing'); continue; }
  const same = fs.readFileSync(a).equals(fs.readFileSync(b));
  check('package ' + inPkg + ' matches the repo', same, 'STALE — rebuild the package before handing it over');
}

// ── TEST 5: no backup or scratch files masquerading as documents
const junk = files.filter(f => /\.bak|\.STALE|\.orig$|~$/i.test(path.basename(f)));
check('no .bak/.STALE/scratch files in the package', junk.length === 0, junk.slice(0, 4).map(rel).join(', '));

if (fails) {
  console.log(`\nPACKAGE GATE FAILED — ${fails} problem(s). Do not hand this package to anyone.\n`);
  process.exit(1);
}
console.log('\npackage-gate-test.js: clean — ' + files.length + ' files checked.\n');
process.exit(0);
