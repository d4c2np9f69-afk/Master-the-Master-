#!/usr/bin/env node
/* todo-hygiene-test.js — the todo list stays a TODO LIST.
 *
 * Jeff, 2026-09-16 02:09, after a night of it:
 *   "That was like pulling teeth. Don't let that to-do list get like that again. It's not a
 *    catch-all and it most definitely is not a push-this-to-Jeff list."
 *
 * Both halves of that had actually happened, which is why this is a test and not a note:
 *
 *  1. CATCH-ALL. `docs/OPEN_ITEMS.md` reached 3,601 lines and 192 numbered entries that produced
 *     four real jobs. Findings, lessons, stop signs and finished work had all been numbered like
 *     tasks. Split on 2026-09-16 into OPEN_ITEMS (do) / FINDINGS_AND_STOPS (know) /
 *     OPEN_ITEMS_CLOSED (done) — 168 lines.
 *
 *  2. PUSH-TO-JEFF. Rows were parked under "waiting on Jeff" without anyone re-checking they were
 *     still true. When they finally were checked, on the night this test was written:
 *       #5   he had rotated the key WEEKS earlier and nobody recorded it
 *       #11  said "~3 sensors still in his hands"; 12 were on the mesh, reporting
 *       #158 said "which unit?"; the record already answered it AND the part was replaced
 *       #91  said "NOT DEPLOYED — Jeff's call"; it had shipped 18 days earlier
 *       #112 was filed as his chore. It is down because of a setup script WE ran.
 *     Five rows, all sitting in his lane, none of them actually his.
 *
 * THE RULES, each mapping to one of those failures. Exit 0 is the only pass.
 */
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..');
const TODO = path.join(REPO, 'docs', 'OPEN_ITEMS.md');
const CLOSED = path.join(REPO, 'docs', 'OPEN_ITEMS_CLOSED.md');

if (!fs.existsSync(TODO)) {
  console.log('todo-hygiene-test.js: SKIPPED — docs/OPEN_ITEMS.md not found.');
  process.exit(0);
}
const todo = fs.readFileSync(TODO, 'utf8');
const lines = todo.split('\n');

let fails = 0;
const check = (name, ok, detail) => {
  console.log((ok ? '  PASS  ' : '  FAIL  ') + name + (!ok && detail ? '\n          ' + detail : ''));
  if (!ok) fails++;
};

console.log('\ntodo-hygiene-test.js — it is a todo list, not a catch-all and not a push-to-Jeff list\n');

// ── RULE 1: no finished work parked in the todo list ──────────────────────────
// A heading that announces something is done belongs in OPEN_ITEMS_CLOSED.md. Strikethrough
// rows inside the action table are allowed — that is how a row is struck on its way out.
const doneHeadings = lines.filter((l) =>
  /^#{2,4}\s/.test(l) && /(✅|🟢|\bCLOSED\b|\bFIXED\b|\bRESOLVED\b|\bSOLVED\b)/i.test(l)
  && !/^#\s/.test(l));
check('no finished work sitting in the todo list', doneHeadings.length === 0,
  doneHeadings.slice(0, 3).map((l) => l.slice(0, 90)).join('\n          '));

// ── RULE 2: the waiting-on-Jeff block must be RE-VERIFIED, and recently ───────
// This is the anti-"push it to Jeff" rule. A row may not simply sit in his lane: somebody has to
// have re-measured it, and said when. #5 sat for a month after he had already done it.
const MAX_AGE_DAYS = 21;
const waitIdx = lines.findIndex((l) => /WAITING ON JEFF/i.test(l));
if (waitIdx === -1) {
  check('the waiting-on-Jeff section exists and is dated', true, '(no such section — fine)');
} else {
  const header = lines.slice(waitIdx, waitIdx + 4).join(' ');
  const m = header.match(/RE-VERIFIED\s+(\d{4}-\d{2}-\d{2})/i);
  check('the waiting-on-Jeff block carries a RE-VERIFIED date', !!m,
    'Add "RE-VERIFIED <YYYY-MM-DD>" to that heading — and actually re-measure the rows first.');
  if (m) {
    const age = (Date.now() - Date.parse(m[1])) / 86400000;
    check(`those rows were re-verified within ${MAX_AGE_DAYS} days`, age <= MAX_AGE_DAYS,
      `last verified ${m[1]} — ${Math.floor(age)} days ago. Re-measure them; do not just re-date it.`);
  }
}

// ── RULE 3: every action row names an owner ───────────────────────────────────
// A task with no owner is how something sits for months with nobody wrong.
const actionRows = lines.filter((l) => /^\|\s*(~~)?\*\*#\d+/.test(l));
const ownerless = actionRows.filter((l) => !/\*\*(CLAUDE|JEFF)/i.test(l) && !/~~/.test(l));
check('every action row names an owner', ownerless.length === 0,
  ownerless.slice(0, 3).map((l) => l.slice(0, 90)).join('\n          '));

// ── RULE 4: nothing is open here AND closed over there ────────────────────────
if (fs.existsSync(CLOSED)) {
  const closedNums = new Set();
  for (const l of fs.readFileSync(CLOSED, 'utf8').split('\n')) {
    if (/^#{2,4}\s/.test(l)) {
      const m = l.match(/#(\d{1,3})\b/);
      if (m) closedNums.add(m[1]);
    }
  }
  const openNums = [];
  for (const l of lines) {
    if (/^#{2,4}\s/.test(l)) {
      const m = l.match(/#(\d{1,3})\b/);
      if (m && closedNums.has(m[1])) openNums.push('#' + m[1]);
    }
  }
  check('no item is open here and closed in OPEN_ITEMS_CLOSED', openNums.length === 0,
    'both places: ' + openNums.join(', '));
}

// ── RULE 5: it stays small enough to read in one sitting ──────────────────────
// It hit 3,601 lines. The cap is a ratchet: to add something, finish something.
const MAX_LINES = 400;
check(`the todo list is under ${MAX_LINES} lines`, lines.length <= MAX_LINES,
  `${lines.length} lines. Move reference material to docs/FINDINGS_AND_STOPS.md and finished work ` +
  'to docs/OPEN_ITEMS_CLOSED.md. Do NOT raise the cap.');

if (fails) {
  console.log(`\nTODO HYGIENE FAILED — ${fails} problem(s).`);
  console.log('A todo list holds things somebody is going to DO. Everything else is reference.\n');
  process.exit(1);
}
console.log('\ntodo-hygiene-test.js: clean.\n');
process.exit(0);
