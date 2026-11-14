#!/usr/bin/env node
/* mower-hours-watchdog-gate-test.js — written 2026-10-15, the same session as the mistakes.
 *
 * Jeff's rule, 2026-09-16 00:10: "Every mistake you make gets a test in the gate that fails on
 * exactly that mistake, written the same session you made it. Not an apology, not a note — a test."
 *
 * WHAT THIS GATES: Watch-MowerHours.ps1, built 2026-10-15 to close OPEN_ITEMS #237.
 * #237 was "after the next mow, check that the hours climbed" — a check that depended on Jeff
 * remembering to run it after an event nothing logs. By his own 2026-08-10 design rule ("no
 * pushing buttons at the beginning and end of mows") that is not finished work, so it became a
 * watchdog. The watchdog lives OUTSIDE this public repo (it names the HA token path, same as
 * Watch-Crashes.ps1), so this gate SKIPS rather than FAILS when it is not on the machine.
 *
 * THE TWO MISTAKES IT CAUGHT, BOTH MINE, BOTH IN THE FIRST HOUR:
 *
 *   1. A CHECK THAT COULD NEVER FIRE. The "box has gone silent" branch read `$d.date`. That
 *      field does not exist at the root of what GET /api/hours returns — hours.js:779 stamps the
 *      stored payload with `lastSync`, and `date` only ever appears on the ?log=1 rows and the
 *      mow-history rows. So `$ageH` was always null and the staleness branch was dead code that
 *      reported green forever. This is THE project's oldest failure mode, the one CLAUDE.md
 *      leads with: the 2026-08-21 camera check that printed ALL GOOD eleven minutes after the
 *      popups died. Caught only by running the script and noticing `age= h` printed blank.
 *
 *   2. AN ALERT THAT WOULD HAVE SHIPPED `{0}` TO JEFF'S PHONE. PowerShell binds `-f` tighter
 *      than `+`, so a message built as `'...{0}...' + '...{1}...' -f $a,$b` formats ONLY the
 *      second literal. The missed-mow alert read "The mower covered {0} m since the last check".
 *      Caught by forcing the branch to fire instead of trusting the code read.
 *
 * Narrow on purpose — a gate that cries wolf gets ignored, which is worse than no gate.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HOME = process.env.USERPROFILE || process.env.HOME || '';
// Same escape hatch as crash-watchdog-gate-test.js: point the gate at a fixture so it can be
// proven RED without ever mutating the live watchdog.
const SCRIPT = process.env.HCC_MOWER_WATCHDOG || path.join(HOME, 'HCC-Scripts', 'Watch-MowerHours.ps1');
const LOG = path.join(HOME, 'HCC-Scripts', 'mower-hours-watch.log');
const TASK = 'HCC Mower Hours Watch';

let fails = 0, skips = 0;
function check(what, ok, why) {
  if (ok) { console.log('  ok    ' + what); return; }
  fails++;
  console.log('  FAIL  ' + what + (why ? '\n          -> ' + why : ''));
}
function skip(what) { skips++; console.log('  SKIP  ' + what); }

console.log('\nmower-hours-watchdog-gate-test.js — can the mower watchdog actually SEE a missed mow?\n');

if (!fs.existsSync(SCRIPT)) {
  skip('the mower watchdog is not on this machine (it lives outside this public repo)');
  console.log('\nmower-hours-watchdog-gate-test.js: skipped (nothing to assert here).\n');
  process.exit(0);
}

const src = fs.readFileSync(SCRIPT, 'utf8');

// ---- 1. the staleness check must read a field that actually exists -------------------------
check('reads `lastSync` for the reading age, not only `date`',
  /lastSync/.test(src),
  'GET /api/hours has no `date` at its root - hours.js:779 stamps it `lastSync`. Reading $d.date makes the ' +
  '"box has gone silent" branch dead code that can never fire, which is the 2026-08-21 ALL-GOOD failure again.');

// ---- 2. the missed-mow branch must exist ---------------------------------------------------
const hasMissed = /dist/i.test(src) && /MISSED MOW/i.test(src);
check('has the MISSED MOW branch (ground covered, no engine time and no mow logged)',
  hasMissed,
  'that is the whole point of #237 and the only way to detect a missed mow without Jeff reporting that he mowed.');

// ---- 3. it must not alert on things the firmware does BY DESIGN ----------------------------
check('documents that `engine_running: true` never appears and is not a fault',
  /engine_running/.test(src) && /BY DESIGN/i.test(src),
  'the firmware keeps WiFi off during a mow and posts nothing until the engine stops. A previous session ' +
  'nearly reported the absence of engine_running as a fault.');

// ---- 4. no alert string can ship an unsubstituted format placeholder ----------------------
// The exact 10-15 bug: a literal carrying {N} joined with `+` to a later literal that takes the
// `-f`. `-f` binds tighter than `+`, so the FIRST literal is never formatted.
// The distinction that matters, and my first version of THIS CHECK got it wrong and cried wolf
// on the correct code:
//   BUG     'a {0}' +            <- literal continued
//           'b {1}' -f $x, $y    <- -f applied DIRECTLY TO A LITERAL, so only 'b {1}' formats
//   CORRECT $fmt = 'a {0}' +
//                  'b {1}'
//           ... ($fmt -f $x, $y) <- -f applied to a VARIABLE, so the whole string formats
// So the tell is not "a placeholder followed by +". It is "-f whose left operand is a string
// literal that was itself the tail of a + chain".
const lines = src.split(/\r?\n/);
const badFormat = [];
for (let i = 0; i < lines.length - 1; i++) {
  if (!/'[^']*'\s*\+\s*$/.test(lines[i])) continue;          // a literal continued with +
  for (let j = i + 1; j <= Math.min(i + 3, lines.length - 1); j++) {
    if (/^\s*'[^']*'\s*-f\s/.test(lines[j])) { badFormat.push(j + 1); break; }  // -f on a LITERAL
    if (/-f\s/.test(lines[j])) break;                        // -f on something else: fine
  }
}
check('no alert message applies -f to a string literal that was concatenated with +',
  badFormat.length === 0,
  'PowerShell binds -f tighter than +, so only the LAST literal gets formatted and the earlier one ships ' +
  '{0} to Jeff verbatim. Assign the concatenation to a variable first, then apply -f to that. ' +
  'Offending line(s): ' + badFormat.join(', '));

// ---- 5. LIVE: a malformed alert must never appear in the real log -------------------------
// Scoped to lines written AFTER the script was last changed. The 2026-10-15 proof runs
// deliberately forced the malformed alert so it could be seen, so those lines are in the log
// forever - and an unscoped check would be permanently red, which is a gate that cries wolf
// (rule 3b, condition 2) and gets ignored. A malformed line from BEFORE the current version is
// history; one written by the CURRENT version is a live defect.
if (!fs.existsSync(LOG)) {
  skip('no watchdog log on this box yet - nothing to check for malformed alerts');
} else {
  const since = fs.statSync(SCRIPT).mtime;
  const bad = fs.readFileSync(LOG, 'utf8').split(/\r?\n/).filter((l) => {
    if (!/\{\d+\}/.test(l)) return false;
    const m = l.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
    if (!m) return false;
    return new Date(m[1].replace(' ', 'T')) > since;
  });
  check('no unsubstituted {N} placeholder logged since the watchdog was last changed',
    bad.length === 0,
    'the CURRENT version produced a malformed alert. Lines: ' + bad.slice(0, 3).join(' | '));
}

// ---- 6. LIVE: the thing has to actually be scheduled -------------------------------------
// A watchdog nobody runs is a note. #237's whole defect was that it needed a human to remember.
let taskState = null;
try {
  taskState = execFileSync('powershell',
    ['-NoProfile', '-Command',
     `(Get-ScheduledTask -TaskName '${TASK}' -ErrorAction SilentlyContinue).State`],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
} catch (e) { taskState = null; }

if (!taskState) {
  skip(`scheduled task "${TASK}" not readable here (not this machine, or no permission)`);
} else {
  check(`scheduled task "${TASK}" exists and is armed`,
    taskState === 'Ready' || taskState === 'Running',
    `state is "${taskState}". #237's entire defect was a check that needed a human to remember to run it; ` +
    'an unscheduled watchdog reproduces exactly that.');
}

if (fails) {
  console.log(`\nMOWER HOURS WATCHDOG GATE FAILED - ${fails} problem(s).`);
  console.log('A watchdog that reads a field the payload does not have reports green forever,');
  console.log('and an alert that ships {0} to a phone is noise that trains Jeff to ignore it.\n');
  process.exit(1);
}
console.log(`\nmower-hours-watchdog-gate-test.js: clean${skips ? ' (' + skips + ' skipped)' : ''}.\n`);
process.exit(0);
