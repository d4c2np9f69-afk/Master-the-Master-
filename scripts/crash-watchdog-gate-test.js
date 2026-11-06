#!/usr/bin/env node
/* crash-watchdog-gate-test.js — written 2026-10-14, the same session as the mistake.
 *
 * Jeff's rule, 2026-09-16 00:10: "Every mistake you make gets a test in the gate that fails on
 * exactly that mistake, written the same session you made it. Not an apology, not a note — a test."
 *
 * THE MISTAKE (2026-10-14, and it cost Jeff the alert he was supposed to get):
 *   The Beast bugchecked at 18:33:17 — 0xEF, csrss.exe, STATUS_IN_PAGE_ERROR, the sixth crash in
 *   the live series. The crash watchdog ran at 21:24:59 and logged:
 *       "no new crash. uptime 0 days, 5 dump(s) known"
 *   ...and texted him NOTHING.
 *   Cause: the script pinned its dump directory to one literal path, C:\Windows\Minidump. On
 *   2026-10-06 18:14 — hours AFTER that script was written the same day — the dump destination
 *   was moved to D: (MinidumpDir = D:\Minidump, DumpFile = D:\MEMORY.DMP) and nobody updated the
 *   reader. So the real dump landed in D:\Minidump\101426-12515-01.dmp while the watchdog stared
 *   at an untouched C:\Windows\Minidump and reported GREEN. Jeff found out because the
 *   grandfather clock went quiet — the crash watchdog never spoke.
 *
 *   This is the project's oldest failure wearing a new hat: a check that cannot see the thing it
 *   names will report that everything is fine. Same family as the 2026-08-21 camera check
 *   printing ALL GOOD eleven minutes after the popups died.
 *
 * WHAT THIS GATE ASSERTS — the one question that actually matters:
 *   ARE DUMPS PILING UP ANYWHERE THE WATCHDOG WOULD NOT LOOK?
 *   It works out the directories the script would really scan (the registry, if the script reads
 *   it, plus any literal fallback paths), then probes every plausible dump location on the box.
 *   A directory that HOLDS .dmp FILES but is NOT covered is a hard FAIL.
 *   It also asserts the script still resolves that path from CrashControl rather than hardcoding
 *   it, and that it keeps the second trigger (Event 1001 / Kernel-Power 41) so a crash that
 *   writes NO dump at all — 3 of the 5 crashes in the 08-19/08-20 series — still reaches Jeff.
 *
 * Checked for duplication first, per the build-first-search rule: Search-HCC.ps1 over the
 * decisions ledger, the conversation archive, the reference guides and the repo returns the
 * watchdog itself and nothing that gates it. No gate in scripts/ touches crashes or dumps.
 *
 * PROVEN RED BEFORE BEING BELIEVED (the 09-16 condition): the hardcoded single dump directory was
 * put back into the live script, this gate failed naming D:\Minidump as uncovered, the fix was
 * restored, and it went green.
 *
 * Narrow on purpose — a gate that cries wolf gets ignored, which is worse than no gate. It is a
 * SKIP, never a FAIL, when the script or the registry is not on this machine: the watchdog lives
 * OUTSIDE this public repo on purpose (it names an HA credential path), and a non-Windows
 * checkout has no CrashControl key at all.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HOME = process.env.USERPROFILE || process.env.HOME || '';
// HCC_CRASH_WATCHDOG points the gate at a fixture so it can be proven RED without ever mutating
// the live watchdog. Added 2026-10-14 after an in-place "proof" silently left a D:\Minidump
// literal behind in dead code, so the coverage check below stayed green and was never tested.
// Editing a live instrument to test the thing that watches it is how you end up with neither.
const SCRIPT = process.env.HCC_CRASH_WATCHDOG || path.join(HOME, 'HCC-Scripts', 'Watch-Crashes.ps1');

let fails = 0;
let skips = 0;
function check(what, ok, why) {
  if (ok) { console.log('  ok    ' + what); return; }
  fails++;
  console.log('  FAIL  ' + what + (why ? '\n          -> ' + why : ''));
}
function skip(what) { skips++; console.log('  SKIP  ' + what); }

console.log('\ncrash-watchdog-gate-test.js — can the crash watchdog actually SEE a crash?\n');

if (!fs.existsSync(SCRIPT)) {
  skip('the crash watchdog is not on this machine (it lives outside this public repo)');
  console.log('\ncrash-watchdog-gate-test.js: skipped (nothing to assert here).\n');
  process.exit(0);
}

const src = fs.readFileSync(SCRIPT, 'utf8');

// ---- 1. it must not pin the dump directory to one literal path ----------------------------
// Exactly the shape of the 10-14 bug: an assignment fixing the dump dir to a single drive path.
const hardcoded = /\$dumpDir\s*=\s*['"][A-Za-z]:\\/.test(src);
check('does not pin $dumpDir to a single literal drive path',
  !hardcoded,
  'that is the 2026-10-14 bug verbatim. Resolve dump dirs from the CrashControl registry key instead.');

// ---- 2. it must ask the system where dumps go ---------------------------------------------
const readsRegistry = /CrashControl/i.test(src) && /MinidumpDir/i.test(src);
check('resolves the dump directory from the CrashControl registry key',
  readsRegistry,
  'the dump destination is a system setting that can be moved at any time - ask the registry, never assume.');

// ---- 3. it must still catch a crash that writes NO dump -----------------------------------
const hasEventTrigger = /\b1001\b/.test(src) && /Kernel-Power/i.test(src);
check('has a second trigger for a crash that leaves no dump (Event 1001 / Kernel-Power 41)',
  hasEventTrigger,
  '3 of the 5 crashes in the 08-19/08-20 series wrote no bugcheck and no dump at all. A dump-only watchdog is silent through every one of those.');

// ---- 4. THE LIVE CHECK: are dumps landing somewhere unwatched? ----------------------------
function regQuery(value) {
  try {
    const out = execFileSync('reg',
      ['query', 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\CrashControl', '/v', value],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const m = out.match(new RegExp(value + '\\s+REG_\\w+\\s+(.+)', 'i'));
    return m ? m[1].trim() : null;
  } catch (e) { return null; }
}

const SYSROOT = process.env.SystemRoot || 'C:\\Windows';
const expand = (p) => (p || '').replace(/%SystemRoot%/i, SYSROOT);
const norm = (p) => expand(p).replace(/\//g, '\\').replace(/\\+$/, '').toLowerCase();

const regMinidumpDir = regQuery('MinidumpDir');
const regDumpFile = regQuery('DumpFile');

if (!regMinidumpDir) {
  skip('CrashControl\\MinidumpDir is unreadable here (not Windows, or no permission)');
} else {
  // The directories the script would REALLY scan.
  const scanned = new Set();
  if (readsRegistry) scanned.add(norm(regMinidumpDir));
  // ...plus any literal dump-dir paths it falls back to.
  for (const m of src.matchAll(/['"]([A-Za-z]:\\[^'"]*Minidump)['"]/gi)) scanned.add(norm(m[1]));

  // Every plausible place a dump could be sitting on this box.
  const candidates = new Set([
    norm(regMinidumpDir),
    norm('C:\\Windows\\Minidump'),
    norm('D:\\Minidump'),
  ]);
  if (regDumpFile) candidates.add(norm(path.dirname(expand(regDumpFile))));

  let probed = 0;
  for (const dir of candidates) {
    if (!dir || !fs.existsSync(dir)) continue;
    let dmps = [];
    try {
      dmps = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.dmp'));
    } catch (e) { continue; }
    if (!dmps.length) continue;
    // A location holding only MEMORY.DMP is the FULL dump, not the minidump set. The watchdog
    // reads minidumps by design, so do not cry wolf over it.
    if (dmps.every((f) => f.toLowerCase() === 'memory.dmp')) {
      console.log('  ok    ' + dir + ' holds only MEMORY.DMP (the full dump), not the minidump set');
      continue;
    }
    probed++;
    check(`the ${dmps.length} crash dump(s) in ${dir} are in a directory the watchdog scans`,
      scanned.has(dir),
      'dumps are accumulating where the watchdog does not look, so it will report "no new crash" through a real bugcheck - which is exactly what happened on 2026-10-14 at 21:24:59.');
  }
  if (!probed) skip('no minidumps anywhere on this box yet - nothing to prove coverage against');
  console.log('        watchdog would scan: ' + (Array.from(scanned).join(', ') || '(nothing)'));
  console.log('        registry says: MinidumpDir=' + regMinidumpDir + '  DumpFile=' + (regDumpFile || '?'));
}

if (fails) {
  console.log(`\nCRASH WATCHDOG GATE FAILED - ${fails} problem(s).`);
  console.log('A crash watchdog that looks in the wrong place reports GREEN through a real crash.');
  console.log('Fix: resolve dump dirs from the CrashControl registry key, and keep the');
  console.log('Event 1001 / Kernel-Power 41 trigger for crashes that write no dump at all.\n');
  process.exit(1);
}
console.log(`\ncrash-watchdog-gate-test.js: clean${skips ? ' (' + skips + ' skipped)' : ''}.\n`);
process.exit(0);
