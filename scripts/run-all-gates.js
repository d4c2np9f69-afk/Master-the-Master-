#!/usr/bin/env node
/* run-all-gates.js - ONE command that runs every gate (2026-09-16)
 *
 * WHY: on 2026-09-15 a session (mine) reported "13/13 green" after running the
 * gates BY HAND. There was no runner, so the list of gates lived only in that
 * session's head - and a boot crash shipped anyway. A gate nobody runs is not a
 * gate, and a gate list that is not written down is not a list.
 *
 *   node scripts/run-all-gates.js          # static gates only (no network)
 *   node scripts/run-all-gates.js --live   # also the gates that hit the live site
 *
 * Exit 0 only if every gate it ran exited 0.
 */
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const LIVE = process.argv.includes('--live');

// Gates that need the network / the deployed site.
const LIVE_GATES = new Set(['live-e2e-test.js']);

// Gates that take a live HA /api/states dump as argv[2]. They are NOT broken and
// they are NOT optional - they simply cannot assert anything without real entity
// data. Dump one with the app open and logged in:
//   fetch('/api/ha?path=/api/states',{headers:{Authorization:'Bearer '+localStorage.ha_token}})
// then:  node scripts/run-all-gates.js --states=path\to\states.json
const ARG_GATES = new Set(['doors-entity-test.js', 'garage-entity-test.js']);
const statesArg = (process.argv.find((a) => a.startsWith('--states=')) || '').slice(9);

// Some gates need HCC_HA_TOKEN and EXIT 0 WITH A "SKIPPED" MESSAGE without it.
// Reasonable on its own - a missing local secret is not a broken app - but it meant
// sensor-coverage-test.js reported `pass` in 0.1s while asserting NOTHING, and that
// false pass went into a "20/20" reported to Jeff. A skip is not a pass: the runner
// now detects the word SKIPPED in a gate's own output and labels it SKIP.
// Set the token from the location ACCESS_MAP.md section 1 documents before running:
//   PowerShell: $env:HCC_HA_TOKEN = (Get-Content <path from HCC_ACCESS.md §1> -Raw).Trim()
// It is deliberately NOT read here - this file is in the public repo.
const HAVE_HA_TOKEN = !!(process.env.HCC_HA_TOKEN || '').trim();

// Audits that report rather than assert pass/fail - not run as gates.
const NOT_GATES = new Set(['run-all-gates.js', 'button-audit.js', 'contrast-check.js',
  'image-fit-audit.js', 'mower-hours-test.mjs']);

const gates = fs.readdirSync(DIR)
  .filter((f) => /-(test|gate-test)\.js$/.test(f) || f === 'lint-app.js')
  .filter((f) => !NOT_GATES.has(f))
  .sort();

const results = [];
let failed = 0;

for (const g of gates) {
  const isLive = LIVE_GATES.has(g);
  if (isLive && !LIVE) {
    results.push({ gate: g, code: null, note: 'skipped (needs --live)' });
    continue;
  }
  const needsStates = ARG_GATES.has(g);
  if (needsStates && !statesArg) {
    results.push({ gate: g, code: null, note: 'skipped (needs --states=<file>)' });
    continue;
  }
  const argv = [path.join(DIR, g)];
  if (needsStates) argv.push(statesArg);
  const t0 = Date.now();
  const r = spawnSync(process.execPath, argv, { encoding: 'utf8', timeout: 180000 });
  const ms = Date.now() - t0;
  const code = r.status === null ? 1 : r.status;
  // A gate that exits 0 saying SKIPPED has asserted nothing. Never call that a pass.
  const selfSkipped = code === 0 && /\bSKIPPED\b/.test(String(r.stdout || ''));
  if (selfSkipped) {
    results.push({ gate: g, code: null, ms, note: 'skipped (gate needs HCC_HA_TOKEN)' });
    continue;
  }
  if (code !== 0) failed++;
  results.push({
    gate: g, code, ms,
    note: code === 0 ? 'pass' : 'FAIL',
    tail: code === 0 ? '' : String((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-6).join('\n')
  });
}

console.log('\n  GATE                              RESULT');
console.log('  ' + '-'.repeat(56));
for (const r of results) {
  const label = r.code === null ? 'SKIP' : (r.code === 0 ? 'pass' : 'FAIL');
  const time = r.ms != null ? (' ' + (r.ms / 1000).toFixed(1) + 's') : '';
  console.log('  ' + r.gate.padEnd(34) + label + time + (r.code === null ? '  ' + r.note : ''));
  if (r.tail) console.log(r.tail.split('\n').map((l) => '        | ' + l).join('\n'));
}

const ran = results.filter((r) => r.code !== null).length;
console.log('  ' + '-'.repeat(56));
console.log('  ' + (ran - failed) + '/' + ran + ' passed' +
  (LIVE ? '' : '   (live gates skipped - add --live)'));

if (failed) { console.log('\n  ' + failed + ' GATE(S) FAILED.\n'); process.exit(1); }
console.log('\n  all gates clean.\n');
process.exit(0);
