#!/usr/bin/env node
/* reachability-instrument-test.js — written 2026-10-10 23:4x, the same session as the mistake.
 *
 * Jeff's rule, 2026-09-16 00:10: "Every mistake you make gets a test in the gate that fails on
 * exactly that mistake, written the same session you made it. Not an apology, not a note — a test."
 *
 * THE MISTAKE (2026-10-10 23:02, caught at 23:05 before Jeff was told):
 *   Checking whether the two devices OPEN_ITEMS #225 left dark had come back, I ran
 *     ping -n 2 192.168.1.196 | tail -3
 *   and read   "Packets: Sent = 2, Received = 2, Lost = 0 (0% loss)"   as proof both were alive.
 *   They were not. Every reply line above that summary said
 *     "Reply from 192.168.1.194: Destination host unreachable"
 *   — and 192.168.1.194 is THIS machine. ping.exe counts an ICMP *unreachable* as a received
 *   reply, so its summary reports 0% loss for a host that is completely dead. It is an instrument
 *   that fails toward a FALSE PASS, the worst direction, and it was one sentence from being
 *   reported to Jeff as "both devices are back".
 *
 * WHAT THIS GATE ASSERTS: no script in this project decides reachability by parsing ping's
 * summary line. The honest instruments are `Test-Connection -Quiet` (PowerShell, a real boolean —
 * it returned False for both devices, correctly), a socket connect, or a reply line anchored to
 * the TARGET address together with `bytes=`.
 *
 * Checked for duplication first, per the build-first-search rule: `Search-HCC.ps1` over the record
 * and the repo returns no prior coverage of this, and no gate in scripts/ touches reachability.
 *
 * PROVEN RED BEFORE BEING BELIEVED (the 09-16 condition): a fixture carrying `ping -n 2 $ip` plus
 * a `% loss` match was dropped into scripts/, this gate failed on exactly that line, the fixture
 * was removed, and it went green. A check that cannot fail is not a check.
 *
 * Narrow on purpose — a gate that cries wolf gets ignored, which is worse than no gate. A file is
 * flagged only when it BOTH invokes ping AND reads ping's summary tokens. Using ping for latency,
 * or a -Quiet test, is untouched.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..');
const HOME = process.env.USERPROFILE || process.env.HOME || '';

// Every tree in this project that holds scripts. A missing one is skipped, not failed — another
// machine may not have the PC script folder.
const ROOTS = [
  path.join(REPO, 'scripts'),
  path.join(REPO, 'windows-scripts'),
  path.join(HOME, 'HCC-Scripts'),
].filter((d) => fs.existsSync(d));

const EXT = new Set(['.js', '.ps1', '.py', '.sh', '.cmd', '.bat', '.mjs']);
// Skip anything that is not OUR code. Browser test profiles under the PC script folder carry
// minified extension bundles in which "ping(" and "Received =" both occur by coincidence — on
// this gate's first run they produced 4 false failures, and a gate that cries wolf gets ignored,
// which is worse than no gate (the 09-16 rule). Tightened the same minute.
const SKIP_DIR = /profile|Extensions|node_modules|\.git|__pycache__|[Cc]ache/i;

// Calls the system ping at all.
const INVOKES_PING = /(^|[\s;|&("'`=])ping(\.exe)?\s+[-/]?[a-z0-9]*\s*[\w$.{(]/im;
// Reads ping's SUMMARY — the lying part. These tokens appear only when the summary is parsed.
const READS_SUMMARY = [
  ['% loss', /%\s*loss/i],
  ['Lost =', /Lost\s*=/i],
  ['Received =', /Received\s*=/i],
  ['"Packets: Sent"', /Packets:\s*Sent/i],
];

let fails = 0;
const check = (name, ok, detail) => {
  console.log((ok ? '  PASS  ' : '  FAIL  ') + name + (!ok && detail ? '   [' + String(detail).slice(0, 220) + ']' : ''));
  if (!ok) fails++;
};

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR.test(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (EXT.has(path.extname(e.name).toLowerCase())) out.push(p);
  }
  return out;
}

console.log("\nreachability-instrument-test.js — ping's summary counts an unreachable as a reply\n");

const files = ROOTS.flatMap((r) => walk(r));
const offenders = [];
for (const f of files) {
  if (path.resolve(f) === path.resolve(__filename)) continue;   // this file documents the pattern
  let t;
  try { t = fs.readFileSync(f, 'utf8'); } catch (_) { continue; }
  if (!INVOKES_PING.test(t)) continue;
  for (const [label, rx] of READS_SUMMARY) {
    const m = rx.exec(t);
    if (!m) continue;
    const line = t.slice(0, m.index).split(/\r?\n/).length;
    offenders.push(`${path.relative(HOME || REPO, f)}:${line} reads ${label}`);
    break;
  }
}

check(`no script decides reachability from ping's summary (${files.length} files, ${ROOTS.length} trees)`,
  offenders.length === 0, offenders.slice(0, 4).join(' | '));

// The two instruments that were already right on 2026-10-10. If either stops using -Quiet, the
// whole machine-health picture starts failing toward a false "online" again.
const MUST_BE_QUIET = [
  [path.join(HOME, 'HCC-Scripts', 'Publish-MachineHealth.ps1'), 'the HA machine-health publisher'],
  [path.join(REPO, 'windows-scripts', 'Verify-Network.ps1'), 'the whole-mesh proof script'],
];
for (const [f, what] of MUST_BE_QUIET) {
  if (!fs.existsSync(f)) { console.log('  SKIP  ' + what + ' is not on this machine'); continue; }
  const t = fs.readFileSync(f, 'utf8');
  check(`${what} still proves reachability with Test-Connection -Quiet`,
    /Test-Connection[^\r\n]*-Quiet/i.test(t),
    'it calls Test-Connection without -Quiet, or no longer calls it at all');
}

if (fails) {
  console.log(`\nREACHABILITY INSTRUMENT GATE FAILED — ${fails} problem(s).`);
  console.log('Use Test-Connection -Quiet, or match "Reply from <the target ip>:" WITH "bytes=".');
  console.log('Never read "Lost =" / "% loss": ping counts an ICMP unreachable as a received reply.\n');
  process.exit(1);
}
console.log('\nreachability-instrument-test.js: clean.\n');
process.exit(0);
