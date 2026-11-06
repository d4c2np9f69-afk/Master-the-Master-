#!/usr/bin/env node
// firmware-binary-gate-test.js - no compiled firmware may ever be committable (2026-11-05).
//
// WHY THIS EXISTS: on 11-05 an arduino-cli compile, even with --output-dir pointed outside the
// repo, also wrote firmware/mower_hours_esp32/build/esp32.esp32.esp32/ INSIDE it. The .bin and
// .elf files there carry the WiFi name, the WiFi password and the device secret in plain text,
// and nothing in .gitignore covered them. This repo is PUBLIC: one "git add ." would publish
// the house WiFi password. The folder was moved out before any commit; this gate keeps it that way.
//
// It fails if git would track, or is already tracking, any firmware binary or build folder.
// Usage: node scripts/firmware-binary-gate-test.js

const { execFileSync } = require('child_process');
const path = require('path');

const REPO = path.join(__dirname, '..');
const BINARY = /(^|\/)build\/|\.(bin|elf|map|hex)$/i;
const git = (args) => execFileSync('git', args, { cwd: REPO, encoding: 'utf8' })
  .split('\n').map((s) => s.trim()).filter(Boolean);

let fail = 0;
const tracked = git(['ls-files', '--', 'firmware']).filter((f) => BINARY.test(f));
const exposed = git(['ls-files', '--others', '--exclude-standard', '--', 'firmware']).filter((f) => BINARY.test(f));

if (tracked.length) { fail++; console.log('  FAIL firmware binaries are COMMITTED: ' + tracked.join(', ')); }
else console.log('  ok   no firmware binary is committed');
if (exposed.length) { fail++; console.log('  FAIL firmware binaries are NOT git-ignored (one "git add ." from public): ' + exposed.join(', ')); }
else console.log('  ok   every firmware binary in the folder is git-ignored');

// The rule itself, checked against paths that need not exist, so a deleted line is caught
// even on a clean checkout with nothing compiled.
for (const p of ['firmware/mower_hours_esp32/build/esp32.esp32.esp32/mower_hours_esp32.ino.bin',
                 'firmware/mower_hours_esp32/mower_hours_esp32.ino.merged.bin',
                 'firmware/mower_hours_esp32/mower_hours_esp32.ino.elf']) {
  let ignored = true;
  try { execFileSync('git', ['check-ignore', '-q', '--no-index', p], { cwd: REPO }); }
  catch (e) { ignored = false; }
  if (ignored) console.log('  ok   .gitignore covers ' + p);
  else { fail++; console.log('  FAIL .gitignore does NOT cover ' + p); }
}

console.log(`\n${fail ? 'FAILED' : 'passed'}: ${fail} problem(s)`);
process.exit(fail ? 1 : 0);
