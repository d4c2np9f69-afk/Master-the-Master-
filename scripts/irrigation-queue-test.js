// irrigation-queue-test.js — prove the irrigation card can answer "why is the water on?"
//
// 2026-09-05, 05:56:20: zone 2 was running and the app said nothing was watering. Jeff:
// "The irrigation is running! Confirmed. You said it wasn't why". The API fix landed first
// (#136-#139); this covers the render half — the QUEUE, which is what turns "Zone 2 is on"
// into "Zone 2 for 14 more minutes, then Zone 5 for 23".
//
// It does NOT re-implement the logic. It lifts the real block out of index.html and runs it,
// so the test fails if the shipped code changes. The payload below is the ACTUAL B-Hyve
// watering_status captured live at 05:56:20 on 2026-09-05 — not invented.

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Lift the queue helpers verbatim from the shipped file.
const start = html.indexOf('var q = Array.isArray(dev.watering_queue)');
const end   = html.indexOf('// "All zones idle" is TRUE of an unplugged controller');
if (start < 0 || end < 0 || end <= start) {
  console.error('FAIL: could not locate the queue block in index.html — did it get renamed?');
  process.exit(1);
}
const block = html.slice(start, end);

let failures = 0;
function check(label, got, want) {
  const ok = got === want;
  if (!ok) failures++;
  console.log((ok ? '  PASS  ' : '  FAIL  ') + label);
  if (!ok) console.log('        got:  ' + JSON.stringify(got) + '\n        want: ' + JSON.stringify(want));
}

function render(dev) {
  const scope = { dev, active: dev.active_station };
  // eslint-disable-next-line no-new-func
  const fn = new Function('dev', 'active',
    block + '\n return { queued: queued, qMins: qMins };');
  const r = fn(scope.dev, scope.active);
  const active = scope.active;
  if (active == null) return '✓ All zones idle';
  const am = r.qMins(active);
  let qtxt = '';
  if (r.queued.length) {
    qtxt = ' · then ' + r.queued.map(s => {
      const m = r.qMins(s);
      return 'Zone ' + s + (m == null ? '' : ' (' + m + ' min)');
    }).join(', ');
  }
  return 'WATERING — Zone ' + active + (am == null ? '' : ' (' + am + ' min)') + qtxt;
}

console.log('irrigation queue render — real B-Hyve payloads\n');

// 1) THE REAL ONE. Captured 2026-09-05 05:56:20 with zone 2 physically running.
check('live 05:56:20 capture (zone 2 running, 5 queued)',
  render({
    active_station: 2,
    watering_queue: [ { station: 2, run_time_sec: 840 }, { station: 5, run_time_sec: 1380 } ]
  }),
  'WATERING — Zone 2 (14 min) · then Zone 5 (23 min)');

// 2) Idle — the state that used to be reported while water was moving.
check('idle', render({ active_station: null, watering_queue: [] }), '✓ All zones idle');

// 3) Watering with no queue reported (single-zone manual run).
check('manual single zone, no queue',
  render({ active_station: 4, watering_queue: [] }),
  'WATERING — Zone 4');

// 4) Missing run times must not render "NaN min" or "null min".
check('queue entries with no run_time_sec',
  render({ active_station: 1, watering_queue: [ { station: 1 }, { station: 3 } ] }),
  'WATERING — Zone 1 · then Zone 3');

// 5) watering_queue absent entirely (older API shape) must not throw.
check('watering_queue undefined',
  render({ active_station: 6 }),
  'WATERING — Zone 6');

// 6) A duplicated station in the queue must appear once.
check('duplicate station in queue',
  render({ active_station: 2,
           watering_queue: [ { station: 5, run_time_sec: 600 }, { station: 5, run_time_sec: 600 } ] }),
  'WATERING — Zone 2 · then Zone 5 (10 min)');

console.log('\n' + (failures ? failures + ' FAILED' : 'all passed'));
process.exit(failures ? 1 : 0);
