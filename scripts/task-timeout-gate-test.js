#!/usr/bin/env node
/* task-timeout-gate-test.js — written 2026-10-08, the same session as the mistake it catches.
 *
 * Jeff's standing rule, 2026-09-16 00:10:
 *   "Every mistake you make gets a test in the gate that fails on exactly that mistake, written
 *    the same session you made it. Not an apology, not a note — a test. Your mistakes are not a
 *    character issue. They are missing coverage."
 *
 * THE MISTAKE THIS COVERS
 *
 *   2026-10-08: `HCC Beehive Backup Sync` returned LastTaskResult 267014 (0x41306,
 *   SCHED_S_TASK_TERMINATED) and left HCC-Beehive-Backup-2026-10-08.tar.partial at
 *   632,241,640 bytes stamped 06:45 — EXACTLY 15 minutes after its 06:30 start, about 6 MB
 *   short of a 638 MB file.
 *
 *   Root cause was a contradiction inside our own setup, invisible to every other gate:
 *     Sync-HABackup.ps1 allows   DownloadSec = 1800   (30 minutes)
 *     the scheduled task allows  ExecutionTimeLimit = PT15M   (15 minutes)
 *   The script was built expecting half an hour; Windows killed it at half that. Normal runs
 *   finish in 7 minutes (06:30->06:37 every day 10-02..10-07), so the limit looked fine for
 *   weeks and then one slow day took the backup out. Nothing anywhere reported it: Jeff only
 *   found out because a session happened to read LastTaskResult.
 *
 * TWO CHECKS, because the failure has two independent halves:
 *   1. No HCC task may report a TERMINATED result. That is Windows killing our work, and it is
 *      never normal. Catches the symptom the day it happens.
 *   2. A task's ExecutionTimeLimit must be at least as long as the timeout its own script
 *      allows itself, plus margin. Catches the cause BEFORE it ever fires.
 *
 * WHY IT DOES NOT CRY WOLF (the other half of Jeff's rule — a test that cries wolf gets
 * ignored, which is worse than no test):
 *   - Tasks that are not visible without admin are reported as SKIPPED, loudly, never passed.
 *     A skip is not a pass.
 *   - A task whose script we cannot find, or whose script declares no timeout, is skipped for
 *     check 2 rather than guessed at.
 *   - ExecutionTimeLimit "PT0S" / unset means "no limit" in Task Scheduler, which is SAFE here,
 *     so it passes check 2.
 *   - Exits 0 when PowerShell or the task service is unreachable (another machine, CI) rather
 *     than failing for the wrong reason.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');

let fails = 0;
let checks = 0;
const check = (name, ok, detail) => {
  checks++;
  console.log((ok ? '  PASS  ' : '  FAIL  ') + name + (!ok && detail ? '   [' + String(detail).slice(0, 200) + ']' : ''));
  if (!ok) fails++;
};
const skip = (name, why) => console.log('  SKIP  ' + name + '   [' + why + ']');

// Windows result codes that mean "something killed this", not "this failed".
const TERMINATED = {
  267014: 'SCHED_S_TASK_TERMINATED (0x41306) — Task Scheduler stopped it, almost always ExecutionTimeLimit',
  267009: 'SCHED_S_TASK_RUNNING (0x41301) — still running at read time, not a kill',
  3221225786: 'STATUS_CONTROL_C_EXIT (0xC000013A) — forcibly terminated',
  3221225794: 'STATUS_DLL_INIT_FAILED (0xC0000142) — process could not start',
};
const KILLS = new Set([267014, 3221225786, 3221225794]);

function ps(script) {
  return execFileSync('powershell.exe',
    ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script],
    { encoding: 'utf8', timeout: 60000, maxBuffer: 8 * 1024 * 1024 });
}

// ISO-8601 duration -> seconds. Task Scheduler only ever emits D/H/M/S here.
function isoToSec(d) {
  if (!d) return null;
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(String(d).trim());
  if (!m) return null;
  return (+(m[1] || 0)) * 86400 + (+(m[2] || 0)) * 3600 + (+(m[3] || 0)) * 60 + (+(m[4] || 0));
}

// The longest timeout a PowerShell script grants itself, in seconds.
function scriptTimeoutSec(src) {
  let max = 0;
  for (const re of [/DownloadSec\s*=\s*(\d+)/g, /-TimeoutSec\s+(\d+)/g, /TimeoutSec\s*=\s*(\d+)/g]) {
    let m;
    while ((m = re.exec(src)) !== null) max = Math.max(max, +m[1]);
  }
  // ReadWriteTimeout is milliseconds when set directly on a WebRequest.
  let m2;
  const re2 = /ReadWriteTimeout\s*=\s*(\d+)/g;
  while ((m2 = re2.exec(src)) !== null) max = Math.max(max, Math.round(+m2[1] / 1000));
  return max || null;
}

console.log('task-timeout-gate-test.js — Windows must not be killing our own scheduled work\n');

let rows;
try {
  const out = ps(
    "$r = @(); " +
    "foreach ($t in (Get-ScheduledTask | Where-Object { $_.TaskName -like 'HCC*' })) { " +
    "  $i = $null; try { $i = Get-ScheduledTaskInfo -TaskName $t.TaskName -TaskPath $t.TaskPath -ErrorAction Stop } catch {} ; " +
    "  $r += [pscustomobject]@{ " +
    "    Name = $t.TaskName; " +
    "    Limit = [string]$t.Settings.ExecutionTimeLimit; " +
    "    Args = [string]($t.Actions | ForEach-Object { $_.Arguments }) ; " +
    "    Enabled = [bool]$t.Settings.Enabled; " +
    "    Trig = [string](($t.Triggers | ForEach-Object { $_.CimClass.CimClassName }) -join ','); " +
    "    Last = $(if ($i) { [int64]$i.LastTaskResult } else { $null }); " +
    "    Visible = $(if ($i) { $true } else { $false }) } " +
    "}; $r | ConvertTo-Json -Depth 3 -Compress");
  const parsed = JSON.parse(out.trim() || '[]');
  rows = Array.isArray(parsed) ? parsed : [parsed];
} catch (e) {
  console.log('task-timeout-gate-test.js: SKIPPED — cannot read the task scheduler here (' +
    String(e.message).split('\n')[0].slice(0, 90) + ')');
  process.exit(0);
}

if (!rows.length) {
  console.log('task-timeout-gate-test.js: SKIPPED — no HCC* scheduled tasks on this machine');
  process.exit(0);
}

// ── CHECK 1: nothing may be reporting a kill
//
// TUNED THE SAME HOUR IT WAS WRITTEN, because the first version cried wolf on 5 of 7 — exactly
// the trap Jeff's rule warns about ("a test that cries wolf gets ignored, which is worse than no
// test"; two gates written 2026-09-16 did the same thing and were tightened the same hour).
// Measured on 2026-10-08, not assumed:
//   HCC Beehive Backup Sync   DailyTrigger  267014       <- REAL. Task Scheduler's time limit.
//   HCC Master Record Update  DailyTrigger  0xC000013A   <- REAL. A daily one-shot force-killed.
//   HCC-HandoffWatcher        LogonTrigger  0xC000013A   <- EXPECTED.
//   HCC-MapLenovoAtLogon      LogonTrigger  0xC000013A   <- EXPECTED.
//   HCC-Mount-acer            LogonTrigger  0xC000013A   <- EXPECTED.
// A logon/startup resident is SUPPOSED to be terminated when its session ends; that is how it
// stops. Flagging those would train everyone to ignore this gate inside a week.
// Disabled tasks are skipped too — their LastTaskResult is frozen history, and at least one
// disabled duplicate on this box was retired deliberately in August and still carries a kill code.
// 267014 is NEVER excused: that code means Task Scheduler hit ExecutionTimeLimit, which is not a
// normal way for anything to end, resident or not.
const SIGINT = 3221225786;   // STATUS_CONTROL_C_EXIT
for (const t of rows) {
  if (!t.Visible || t.Last === null || t.Last === undefined) {
    skip('task result: ' + t.Name, 'not visible without admin rights — NOT a pass');
    continue;
  }
  if (t.Enabled === false) { skip('task result: ' + t.Name, 'task is disabled — its last result is frozen history'); continue; }

  const n = Number(t.Last);
  const resident = /Logon|Boot|Startup/i.test(String(t.Trig || ''));
  if (n === SIGINT && resident) {
    skip('task result: ' + t.Name, 'logon/startup resident — terminated at session end is how it stops');
    continue;
  }
  check('task result is not a kill: ' + t.Name,
    !KILLS.has(n),
    'LastTaskResult ' + n + ' = ' + (TERMINATED[n] || 'terminated'));
}

// ── CHECK 2: the task must allow at least as long as its script asks for
const MARGIN = 1.25;
for (const t of rows) {
  const limit = isoToSec(t.Limit);
  if (limit === null) { skip('time limit vs script: ' + t.Name, 'unparseable ExecutionTimeLimit "' + t.Limit + '"'); continue; }
  if (limit === 0) { check('time limit vs script: ' + t.Name, true, ''); continue; }   // 0 = no limit, safe

  const m = /-File\s+"?([^"]+\.ps1)"?/i.exec(t.Args || '');
  if (!m) { skip('time limit vs script: ' + t.Name, 'action is not a -File .ps1 we can read'); continue; }
  let src;
  try { src = fs.readFileSync(m[1], 'utf8'); }
  catch { skip('time limit vs script: ' + t.Name, 'cannot read ' + m[1]); continue; }

  const want = scriptTimeoutSec(src);
  if (!want) { skip('time limit vs script: ' + t.Name, 'script declares no timeout of its own'); continue; }

  // 🔴 SOFTENING REVERTED 2026-10-09 ON JEFF'S INSTRUCTION ("put the fucking gates back").
  // This used to SKIP any script containing resume logic, on the argument that the invariant is
  // "a kill must not lose work" rather than "the limit must be generous". That reasoning is not
  // wrong - but it was MY reasoning, applied to HIS gate, to make a red check go quiet. The same
  // instinct produced the three HCC-OVERRIDEs on his camera freeze the same night.
  // A misconfigured task is a misconfiguration whether or not something downstream can recover
  // from it. If it is genuinely acceptable, Jeff can say so; a session does not get to decide
  // that a gate he asked for should be gentler. Resumability is now reported, not excused.
  const resumable = /AddRange|Range:\s*bytes|resumeFrom/i.test(src);
  check('time limit >= its own script\'s timeout: ' + t.Name,
    limit >= want * MARGIN,
    'task allows ' + limit + 's (' + t.Limit + ') but ' + m[1].split(/[\\/]/).pop() +
    ' allows itself ' + want + 's — Windows will kill it mid-run. Raise ExecutionTimeLimit to at least ' +
    Math.ceil(want * MARGIN) + 's' +
    (resumable ? '. (That script DOES resume after a kill, so no work is lost — but the task is still misconfigured.)' : ''));
}

if (fails) {
  console.log('\nTASK TIMEOUT GATE FAILED — ' + fails + ' problem(s).');
  console.log('A scheduled job that Windows kills does not report an error anywhere. ' +
    'That is how the 2026-10-08 backup silently stopped reaching iCloud.\n');
  process.exit(1);
}
console.log('\ntask-timeout-gate-test.js: clean — ' + checks + ' check(s) across ' + rows.length + ' HCC task(s).\n');
