#!/usr/bin/env node
/* docs-size-gate-test.js — the session-loaded files must not grow unmanaged.
 *
 * Jeff, 2026-09-16 00:18:
 *   "I don't want it cut I just don't want to continue to grow because you are not managing it —
 *    only cut the fat and old shit out. You have to manage that file the same as the overall
 *    project and the bids."
 *
 * WHY A TEST AND NOT A NOTE: `CLAUDE.md` carries its own instruction to stay lean — "Keep this
 * file LEAN (memory hygiene)… Target: well under 400 lines" — and it had reached **890 lines /
 * 87 KB** anyway, because a written target that nothing enforces is a wish. On 2026-09-16 it was
 * trimmed to 726 by removing 95 dated changelog one-liners (whose own header says the detail
 * lives in CHANGELOG_ARCHIVE.md) and 13 Pending Items that were struck through or marked
 * finished. Nothing was deleted — `docs/PROJECT_REFERENCE.md` holds the pre-trim file verbatim.
 *
 * THE ECONOMICS, which is the whole argument: `CLAUDE.md` is the only file that loads itself into
 * EVERY turn. A line in it is paid for again on every single message, forever. A line in `docs/`
 * is paid for when it is actually needed. Same information, wildly different price.
 *
 * THE CAPS ARE SET JUST ABOVE TODAY'S SIZE ON PURPOSE. This is a ratchet: to add something, trim
 * something. If a cap is hit, the fix is to move content to `docs/` — NOT to raise the cap. A cap
 * raised to fit the file is the same as no cap.
 *
 * ⚠️ PROTECTED CONTENT IS EXEMPT FROM ANY TRIM. Jeff's Message, The Working Relationship, the
 * Mandatory Rules and the Debugging Protocol are never compressed — "They are the point of the
 * whole project." They total ~96 lines and the caps below already account for them.
 */
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..');
const HOME = process.env.USERPROFILE || process.env.HOME || '';

const LIMITS = [
  // file, max lines, max KB, when it costs you
  { p: path.join(REPO, 'CLAUDE.md'),                max: 750,  kb: 70,  when: 'EVERY TURN' },
  { p: path.join(HOME, 'CLAUDE.md'),               max: 80,   kb: 5,   when: 'EVERY TURN' },
  { p: path.join(REPO, 'docs', 'SESSION_START.md'), max: 260,  kb: 18,  when: 'once per session' },
  { p: path.join(REPO, 'docs', 'OPEN_ITEMS.md'),    max: 3600, kb: 290, when: 'once per session (read gate)' },
];

let fails = 0;
console.log('\ndocs-size-gate-test.js — session-loaded files must not grow unmanaged\n');
console.log('  ' + 'file'.padEnd(34) + 'lines'.padStart(7) + '/cap' .padStart(6)
          + '      KB'.padStart(8) + '/cap'.padStart(6) + '   loaded');
console.log('  ' + '-'.repeat(86));

for (const L of LIMITS) {
  if (!fs.existsSync(L.p)) {
    console.log('  ' + path.basename(L.p).padEnd(34) + '  MISSING');
    continue;
  }
  const txt = fs.readFileSync(L.p, 'utf8');
  const lines = txt.split('\n').length;
  const kb = Buffer.byteLength(txt, 'utf8') / 1024;
  const overL = lines > L.max, overK = kb > L.kb;
  const name = L.p.replace(REPO + path.sep, '').replace(HOME + path.sep, '~' + path.sep);
  const flag = (overL || overK) ? '  <-- OVER' : '';
  console.log('  ' + name.padEnd(34)
    + String(lines).padStart(7) + ('/' + L.max).padStart(6)
    + kb.toFixed(1).padStart(8) + ('/' + L.kb).padStart(6)
    + '   ' + L.when + flag);
  if (overL) { fails++; console.log(`        FAIL: ${lines - L.max} lines over. Move content to docs/ — do NOT raise the cap.`); }
  if (overK) { fails++; console.log(`        FAIL: ${(kb - L.kb).toFixed(1)} KB over. Move content to docs/ — do NOT raise the cap.`); }
}

// The pre-trim file must stay preserved, or the trim becomes a deletion.
const ref = path.join(REPO, 'docs', 'PROJECT_REFERENCE.md');
const refOk = fs.existsSync(ref) && fs.statSync(ref).size > 50 * 1024;
console.log('');
if (!refOk) { fails++; console.log('  FAIL  docs/PROJECT_REFERENCE.md missing or truncated — the trimmed content must stay preserved'); }
else { console.log('  PASS  docs/PROJECT_REFERENCE.md preserves the pre-trim CLAUDE.md'); }

// The four protected sections must still be present in CLAUDE.md itself.
const claude = fs.readFileSync(path.join(REPO, 'CLAUDE.md'), 'utf8');
for (const marker of ["Jeff's Message", 'The Working Relationship', 'Mandatory Rules', 'Debugging Protocol']) {
  const ok = claude.includes(marker);
  console.log('  ' + (ok ? 'PASS' : 'FAIL') + '  protected section present: ' + marker);
  if (!ok) fails++;
}

if (fails) {
  console.log(`\nDOCS SIZE GATE FAILED — ${fails} problem(s).`);
  console.log('Trim the fat (closed items, dated one-liners, anything already archived) — never raise a cap.\n');
  process.exit(1);
}
console.log('\ndocs-size-gate-test.js: clean.\n');
process.exit(0);
