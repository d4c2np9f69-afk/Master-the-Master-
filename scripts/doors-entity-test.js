
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
const states=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
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
check('mailbox contact included (it is a contact, and the card is Doors & CONTACTS)', doors.some(d=>d.entity_id==='binary_sensor.mailbox_contact'), true);
check('exactly 4 real contacts', doors.length, 4);
console.log('\n'+(fail?'*** FAILURES: '+fail+' ***':'ALL CHECKS PASSED')+'\n');
process.exit(fail?1:0);
