
// Extract the REAL functions out of index.html (brace-matched) and run them against REAL HA states.
const fs = require('fs');
const src = fs.readFileSync('index.html', 'utf8');
function extract(name){
  const sig = '\nfunction ' + name + '(';
  const start = src.indexOf(sig);
  if (start < 0) throw new Error('MISSING in index.html: ' + name);
  let i = src.indexOf('{', start), depth = 0;
  for (; i < src.length; i++){
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) return src.slice(start, i + 1); }
  }
  throw new Error('unbalanced: ' + name);
}
const code = ['garageOpenerId','garagePositionId','garageIsOverheadDoor','garagePickOne','garagePick','garageSensorIsOpen'].map(extract).join('\n');
eval(code);
if (typeof garagePick !== 'function') { console.error('extraction failed'); process.exit(1); }

const states = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
let fail = 0;
function check(label, got, want){
  const ok = got === want; if (!ok) fail++;
  console.log((ok ? '  PASS  ' : '  FAIL  ') + label + '  got=' + got + (ok ? '' : '  WANT=' + want));
}

console.log('\n--- garagePick against LIVE Beehive ---');
const p = garagePick(states);
check('opener switch', p.sw && p.sw.entity_id, 'switch.garage_garage_door_opener');
check('position sensor', p.sensor && p.sensor.entity_id, 'binary_sensor.garage_door_down_contact');
check('no cover entity', p.cover === undefined, true);
if (p.sensor) console.log('  door reads "' + p.sensor.state + '" -> ' + (garageSensorIsOpen(p.sensor) ? 'OPEN' : 'CLOSED'));

console.log('\n--- every *garage* entity in the house ---');
const expect = {
  'switch.garage_garage_door_opener': true,
  'binary_sensor.garage_door_down_contact': true,
  'switch.garage_camera_motion_detection': false,
  'binary_sensor.garage_motion': false,
  'binary_sensor.garage_man_door_contact': false,
  'binary_sensor.garage_man_door_battery_low': false,
  'binary_sensor.garage_door_down_battery_low': false,
};
let seen = 0;
for (const s of states){
  if (s.entity_id.toLowerCase().indexOf('garage') < 0) continue;
  const got = garageIsOverheadDoor(s.entity_id);
  if (s.entity_id in expect){ seen++; check(s.entity_id, got, expect[s.entity_id]); }
  else console.log('  (info) ' + s.entity_id + ' -> ' + got);
}
check('all 7 expected garage entities present in HA', seen, 7);

console.log('\n--- REGRESSION: the pre-fix code, on the same data ---');
const oldSw = states.filter(s => s.entity_id.indexOf('switch.') === 0 && s.entity_id.toLowerCase().indexOf('garage') >= 0);
const oldSensor = states.filter(s => s.entity_id.indexOf('binary_sensor.') === 0 && s.entity_id.toLowerCase().indexOf('garage') >= 0);
console.log('  old switch.*garage*        matched ' + oldSw.length + ': ' + oldSw.map(x => x.entity_id).join(', '));
console.log('  old binary_sensor.*garage* matched ' + oldSensor.length + ': ' + oldSensor.map(x => x.entity_id).join(', '));
console.log('  -> old code would have taken [0]: ' + oldSw[0].entity_id + ' / ' + oldSensor[0].entity_id);

console.log('\n--- Guardian Night Check buckets ---');
const doors = states.filter(function(s){ var id = s.entity_id.toLowerCase(); return s.entity_id.indexOf('binary_sensor.') === 0 && (id.indexOf('door') >= 0 || id.indexOf('window') >= 0) && !garageIsOverheadDoor(id) && !/(battery|_low|motion|camera|tamper|spare|update|connectivity|problem|linkquality|signal)/.test(id) && id.indexOf('mercedes') < 0 && id.indexOf('gle') < 0 && id.indexOf('mbapi') < 0; });
const gar = states.filter(function(s){ return (s.entity_id.indexOf('cover.') === 0 || s.entity_id.indexOf('binary_sensor.') === 0) && garageIsOverheadDoor(s.entity_id); });
console.log('  Doors (' + doors.length + '): ' + doors.map(d => d.entity_id + '=' + d.state).join('  '));
console.log('  Garage door (' + gar.length + '): ' + gar.map(g => g.entity_id + '=' + g.state).join('  '));
check('man door counted as a Door', doors.some(d => d.entity_id === 'binary_sensor.garage_man_door_contact'), true);
check('no battery flag in Doors', doors.every(d => !/battery|_low/.test(d.entity_id)), true);
check('no spare contact in Doors', doors.every(d => !/spare/.test(d.entity_id)), true);
check('Garage row is exactly 1 entity', gar.length, 1);
check('Garage row is the overhead door', gar[0] && gar[0].entity_id, 'binary_sensor.garage_door_down_contact');

console.log('\n' + (fail ? '*** FAILURES: ' + fail + ' ***' : 'ALL CHECKS PASSED') + '\n');
process.exit(fail ? 1 : 0);
