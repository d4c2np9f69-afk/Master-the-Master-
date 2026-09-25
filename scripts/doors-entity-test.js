
const fs=require('fs');
const src=fs.readFileSync('index.html','utf8');
function extract(name){
  const start=src.indexOf('\nfunction '+name+'(');
  if(start<0) throw new Error('MISSING: '+name);
  let i=src.indexOf('{',start),d=0;
  for(;i<src.length;i++){ if(src[i]==='{')d++; else if(src[i]==='}'){d--; if(!d) return src.slice(start,i+1);} }
  throw new Error('unbalanced '+name);
}
const code=['garageIsOverheadDoor','hccDoorSensors','hccDoorIsOpen'].map(extract).join('\n');
eval(code);
// .replace(/^﻿/,'') is load-bearing: PowerShell 5.1's `Set-Content -Encoding UTF8`
// writes a BOM, and JSON.parse throws on it. The documented way to produce this file on
// this machine is PowerShell, so without this the gate crashes with a module stack trace
// and dumps the whole states file - which reads like a broken gate, not a bad input.
// Cost 10 minutes on 2026-09-19. Write BOM-less with [System.IO.File]::WriteAllText.
const states=JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^﻿/,''));
let fail=0;
function check(l,g,w){const ok=g===w;if(!ok)fail++;console.log((ok?'  PASS  ':'  FAIL  ')+l+'  got='+g+(ok?'':'  WANT='+w));}
const doors=hccDoorSensors(states);
console.log('\n--- Doors & Contacts card would list ('+doors.length+') ---');
doors.forEach(d=>{
  const base=d.entity_id.replace(/^binary_sensor\./,'').replace(/_contact$/,'');
  const bat=states.filter(b=>b.entity_id==='sensor.'+base+'_battery')[0];
  console.log('   '+(hccDoorIsOpen(d)?'OPEN  ':'closed')+'  '+d.entity_id.padEnd(42)+(bat?bat.state+'%':''));
});
console.log('\n--- exclusions that were previously counted as doors ---');
['binary_sensor.ai_doorbell_301_driveway','binary_sensor.ai_doorbell_back_left','binary_sensor.garage_man_door_battery_low','binary_sensor.garage_door_down_contact','binary_sensor.garage_door_down_battery_low']
  .forEach(id=>check('excluded: '+id, doors.some(d=>d.entity_id===id), false));
check('garage MAN door IS included', doors.some(d=>d.entity_id==='binary_sensor.garage_man_door_contact'), true);
check('front door included', doors.some(d=>d.entity_id==='binary_sensor.front_door_contact'), true);
check('back deck included', doors.some(d=>d.entity_id==='binary_sensor.back_deck_door_contact'), true);
check('no ai_doorbell at all', doors.every(d=>d.entity_id.indexOf('ai_doorbell')<0), true);
// 2026-09-24, Jeff: "delete the mailbox ... when I get the mesh extender we can redo the mailbox."
// The sensor is gone from Z2M (#196). These two checks RE-ARM THEMSELVES: the moment
// binary_sensor.mailbox_contact exists again in the states file, it must be on the card and the
// count goes back to 4. Until then, 3 contacts is the correct answer, not a failure.
const mailboxInHA=states.some(s=>s.entity_id==='binary_sensor.mailbox_contact');
if(!mailboxInHA) console.log('  NOTE  mailbox sensor not in HA (removed 2026-09-24, #196) - mailbox checks re-arm when it is re-paired');
check('mailbox contact included iff it exists in HA (it is a contact, and the card is Doors & CONTACTS)', doors.some(d=>d.entity_id==='binary_sensor.mailbox_contact'), mailboxInHA);
check('exactly '+(mailboxInHA?4:3)+' real contacts', doors.length, mailboxInHA?4:3);
console.log('\n'+(fail?'*** FAILURES: '+fail+' ***':'ALL CHECKS PASSED')+'\n');
process.exit(fail?1:0);
