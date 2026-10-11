/* LIVE STATUS LIGHTS on the house plan (2026-09-25, Jeff: "made the map live and showed all the
   active devices, so you could look at the map and see if anything is down. It could have lights
   that show status").

   Every monitored dot gets a small status light: green = reporting, amber = needs a look (low
   battery, a meter gone quiet), red = DOWN (Home Assistant has lost it) or WATER, grey = switched
   off on purpose. A dot with no light is not wired to Home Assistant, so there is nothing to show.

   Where it works: only when the page is opened from the HCC app (toro1-5rz.pages.dev /
   loewenhome.com). That origin holds the app's HA token and the same-origin /api/ha proxy. The
   claude.ai copy of this plan cannot reach Home Assistant (its sandbox blocks outside calls), so
   there the plan simply shows a note saying where the live view lives.

   Read-only: this only ever GETs /api/states and /api/hours. It never changes a device and never
   asks any camera for anything - it reads the states HA already holds.
   Camera battery flags are deliberately NOT used: front_right + driveway are the unreplaced
   battery experiment and must never be shown as a fault.
   Mower: reads the box's real fields (hours, engine_running, lastSync, battery) - see
   docs/mower/gps_firmware_coworker_findings_2026-08-11.md for the field contract.
   Meters: SESSION_START.md invariant - the pit radios only republish when the value CHANGES, so
   gaps of 20 min to 3 hours are NORMAL and an unknown reading is not a fault (a false WHUD alarm
   on 08-01 came from forgetting that). So a meter only goes amber after 6 quiet hours, red after
   24, and never red for merely reading unknown. */
(function () {
  const POLL_MS = 20000;   // 20 s so the house feels live (TVs, lights, doors); still one /api/states call

  // Device number -> what to watch. e = the entities that must be reachable (any unavailable = DOWN).
  // bat = the Zigbee battery-low flag, pct = battery %, leak = the moisture flag, lqi = link quality
  // (shown, never judged - an LQI read mid-door-swing is garbage). fresh = a meter last-seen
  // timestamp. offOk = "off" means switched off on purpose (grey), not broken.
  const CAM = 'Green means Home Assistant still has this camera. It does not prove every motion reaches HA - see docs/CAMERAS_CLOSED_2026-08-22.md.';
  const Z = (id, lqi) => ({ e: ['binary_sensor.' + id + '_contact'], bat: 'binary_sensor.' + id + '_battery_low', pct: 'sensor.' + id + '_battery', lqi: 'sensor.' + lqi + '_linkquality' });
  const LK = (id, lqi) => ({ e: ['binary_sensor.' + id + '_water_leak'], leak: 'binary_sensor.' + id + '_water_leak', bat: 'binary_sensor.' + id + '_battery_low', pct: 'sensor.' + id + '_battery', lqi: 'sensor.' + lqi + '_linkquality' });
  const MO = id => 'binary_sensor.' + id + '_motion';
  const MAP = {
    1: { e: ['binary_sensor.remote_ui'], say: { on: 'Internet up (HA cloud link connected)', off: 'HA cloud link down' }, offBad: true },
    3: { ha: true },
    8: { e: ['binary_sensor.zigbee2mqtt_bridge_connection_state'], say: { on: 'Zigbee2MQTT connected', off: 'Zigbee2MQTT DISCONNECTED' }, offBad: true },
    10: { e: [MO('301_front_doorbell')], note: CAM },
    11: { e: [MO('301_driveway')], note: CAM },
    12: { e: [MO('front_right')], note: CAM },
    13: { e: [MO('back_left')], note: CAM },
    14: { e: [MO('301_backyard')], note: CAM },
    15: { e: [MO('garage')], note: 'Motion alerts are off by Jeff’s choice - not a fault. ' + CAM },
    16: { e: ['light.bedroom_cans'] },
    17: { e: ['light.kitchen_dining_room_cans'] },
    18: { e: ['light.livingroom_cans'] },
    19: { e: ['switch.masterbath_cans'] },
    21: { e: ['switch.bed_lamp_socket_1'] },
    22: { e: ['switch.smart_socket_2_socket_1'] },
    23: { e: ['switch.mini_smart_socket11_2_socket_1'] },
    24: { e: ['switch.hot_water_heater_socket_1'] },
    25: Z('front_door', '0xa4c13846705c1def'),
    26: Z('back_deck_door', '0xa4c138af3185764f'),
    27: Z('garage_man_door', '0xa4c138a359d762a5'),
    28: Z('garage_door_down', '0xa4c138efcd1e7c3d'),
    29: { none: 'Removed from Home Assistant 24 Sep 2026 - it comes back with the mesh extender.' },
    30: Z('spare_contact_1', '0xa4c13864378427d2'),
    31: LK('guest_bath_leak', '0xa4c13852856fd0ea'),
    32: LK('kitchen_sink_leak', '0xa4c13847742ea8c3'),
    33: LK('kitchen_refrigerator_leak', '0xa4c138203a757f21'),
    34: { e: ['light.garage_repeater'], lqi: 'sensor.0xa4c1386f3deff62d_linkquality' },
    35: { e: ['light.floating_repeater'], lqi: 'sensor.0xa4c138140f3ce43d_linkquality' },
    36: { e: ['siren.301_alarm'], lqi: 'sensor.301_alarm_linkquality' },
    37: { e: ['switch.ac_relay'], master: 'input_boolean.air_conditioner' },
    40: { e: ['switch.ac_relay'], master: 'input_boolean.air_conditioner' },
    41: { e: ['cover.garage_door', 'switch.garage_garage_door_opener'] },
    42: { e: ['switch.z1_front_right', 'switch.z2_front_left', 'switch.z3_back_left', 'switch.z4_back_right', 'switch.z5_right_side_drive', 'switch.garden'], say: { off: 'All zones idle' } },
    43: { e: ['switch.z1_front_right'] },
    44: { e: ['switch.z2_front_left'] },
    45: { e: ['switch.z3_back_left'] },
    46: { e: ['switch.z4_back_right'] },
    47: { e: ['switch.z5_right_side_drive'] },
    48: { e: ['switch.garden'] },
    50: { e: ['media_player.jeffrey_s_fire_tv'] },
    51: { e: ['media_player.bedroom_apple_tv'] },
    54: { e: ['media_player.living_room_echo_dot'] },
    62: { e: ['vacuum.sharky'], pct: 'sensor.sharky_battery' },
    64: { fresh: 'sensor.water_meter_last_seen' },
    65: { fresh: 'sensor.gas_meter_last_seen' },
    67: { e: ['sensor.my_weather_station_temperature'], quietMin: 60 },
    79: { e: ['input_boolean.grandfather_clock'], offOk: true, note: 'HA runs the chimes; the Beast plays them on the W200. The speaker itself does not report to HA.' },
    80: { mower: true },
  };
  /* THE COLOUR LAW - Jeff, 2026-10-08: "nothing needs to be lit red unless it's not working[;]
     one it's working it's green[,] if it's off it's black".
       working  -> green      off -> BLACK      broken -> red
     'off' was #9aa3ad grey, which read as a fault at a glance; it is now near-black. Not pure
     #000: on the dash background (#0b0f14) a pure-black lamp vanishes and you cannot tell a
     switched-off device from one that is not on the map at all. #0a0d12 plus the lamp's own
     light ring reads as deliberately dark.
     'warn' stays AMBER, not red - amber is not red, and it is the only way a low battery or a
     stale sensor gets noticed before it becomes a failure. 'unknown' stays grey: no data is not
     the same claim as switched off, and colouring it green or black would be inventing a state. */
  const COLORS = { ok: '#23a55a', warn: '#e39b00', down: '#d7263d', alarm: '#d7263d', off: '#0a0d12', unknown: '#c3c9d0' };
  const WORDS = { ok: 'Reporting', warn: 'Needs a look', down: 'DOWN', alarm: 'ALARM', off: 'Switched off', unknown: 'Unknown' };

  const live = { on: false, states: null, mower: null, when: null, err: '', res: {} };
  let token = '', base = '';
  try { token = localStorage.getItem('ha_token') || ''; base = localStorage.getItem('ha_base') || ''; } catch (e) {}

  const ago = ms => { const m = Math.round(ms / 60000); return m < 1 ? 'just now' : m < 90 ? m + ' min ago' : (m / 60).toFixed(1) + ' h ago'; };
  const cap = s => String(s).replace(/_/g, ' ').replace(/^./, c => c.toUpperCase());
  const fname = (st, id) => ((st.attributes && st.attributes.friendly_name) || id).trim();
  function words(id, st) {
    if (!st) return '';
    const s = st.state, dom = id.split('.')[0];
    if (/_contact$/.test(id)) return s === 'on' ? 'Open' : s === 'off' ? 'Closed' : cap(s);
    if (/_water_leak$/.test(id)) return s === 'on' ? 'WATER DETECTED' : s === 'off' ? 'Dry' : cap(s);
    if (/_motion$/.test(id)) return s === 'on' ? 'Motion now' : 'Connected';
    if (dom === 'light' || dom === 'switch' || dom === 'input_boolean' || dom === 'siren') return s === 'on' ? 'On' : s === 'off' ? 'Off' : cap(s);
    if (dom === 'sensor' && st.attributes && st.attributes.unit_of_measurement) return s + ' ' + st.attributes.unit_of_measurement;
    return cap(s);
  }

  const RANK = { ok: 0, off: 1, unknown: 2, warn: 3, down: 4, alarm: 5 };
  function judge(n) {
    const m = MAP[n]; if (!m) return null;
    if (m.none) return { lvl: null, lines: [m.none] };
    if (m.ha) return live.err ? { lvl: 'unknown', lines: ['Could not reach Home Assistant: ' + live.err] } : { lvl: 'ok', lines: ['Home Assistant answering (' + Object.keys(live.states || {}).length + ' entities)'] };
    if (m.mower) return judgeMower();
    if (!live.states) return { lvl: 'unknown', lines: ['Waiting for Home Assistant'] };
    const S = live.states, lines = []; let lvl = 'ok';
    const bump = l => { if (RANK[l] > RANK[lvl]) lvl = l; };
    const many = (m.e || []).length > 1;
    (m.e || []).forEach(id => {
      const st = S[id];
      if (!st) { bump('down'); lines.push(id + ' - not found in Home Assistant'); return; }
      if (st.state === 'unavailable') { bump('down'); lines.push(fname(st, id) + ' - unavailable since ' + ago(Date.now() - Date.parse(st.last_changed))); return; }
      if (st.state === 'unknown') { bump('warn'); lines.push(fname(st, id) + ' - state unknown'); return; }
      if (many && !m.say) lines.push(fname(st, id) + ': ' + words(id, st));
      else if (!many) lines.push(m.say && m.say[st.state] ? m.say[st.state] : words(id, st));
      if (m.offBad && st.state === 'off') bump('down');
      if (m.offOk && st.state === 'off') bump('off');
      if (m.quietMin) { const t = Date.parse(st.last_reported || st.last_updated); if (Date.now() - t > m.quietMin * 60000) { bump('warn'); lines.push('No new reading for ' + ago(Date.now() - t).replace(' ago', '')); } }
    });
    if (m.say && many && lvl === 'ok') { const on = m.e.filter(id => S[id] && S[id].state === 'on'); lines.push(on.length ? 'Watering now: ' + on.map(id => fname(S[id], id)).join(', ') : m.say.off); }
    if (m.leak && S[m.leak] && S[m.leak].state === 'on') bump('alarm');
    if (m.bat && S[m.bat] && S[m.bat].state === 'on') { bump('warn'); lines.push('Battery LOW'); }
    if (m.pct && S[m.pct] && S[m.pct].state !== '' && !isNaN(+S[m.pct].state)) { const p = +S[m.pct].state; lines.push('Battery ' + Math.round(p) + '%'); if (p < 15) bump('warn'); }
    if (m.lqi && S[m.lqi] && !isNaN(+S[m.lqi].state)) lines.push('Zigbee signal (LQI) ' + S[m.lqi].state);
    if (m.master && S[m.master]) { lines.push('A/C master switch: ' + (S[m.master].state === 'on' ? 'ON' : 'OFF')); if (S[m.master].state === 'off' && lvl === 'ok') bump('off'); }
    if (m.fresh) {
      const st = S[m.fresh];
      if (!st || isNaN(Date.parse(st.state))) { bump('unknown'); lines.push('No meter timestamp right now - normal after a restart; it fills in on the next read'); }
      else {
        const age = Date.now() - Date.parse(st.state);
        lines.push('Last meter read ' + ago(age));
        if (age > 24 * 3600000) bump('down'); else if (age > 6 * 3600000) bump('warn');
        lines.push('The meter only sends when its reading changes - gaps up to 3 h are normal.');
      }
    }
    if (m.note) lines.push(m.note);
    return { lvl, lines };
  }
  function judgeMower() {
    const h = live.mower;
    if (!h) return { lvl: 'unknown', lines: ['Waiting for the mower box'] };
    if (h.source === 'stub' || !h.lastSync) return { lvl: 'down', lines: ['The mower box has never reported'] };
    const age = Date.now() - Date.parse(h.lastSync), lines = [];
    // Parked, the box posts a full payload every 5 min; while the ENGINE runs it posts nothing, so a
    // gap during a mow is normal - it reports when it parks.
    lines.push(h.engine_running ? 'Mowing - the box reports when it parks' : 'Parked · box last reported ' + ago(age));
    if (h.battery) lines.push('Mower battery ' + (+h.battery).toFixed(2) + ' V');
    if (h.hours != null) lines.push('Sensor hours ' + (+h.hours).toFixed(2));
    if (h.wifi_rssi) lines.push('Wi-Fi ' + h.wifi_rssi + ' dBm' + (h.fw ? ' · firmware ' + h.fw : ''));
    let lvl = 'ok';
    if (!h.engine_running && age > 20 * 60000) lvl = age > 3 * 3600000 ? 'down' : 'warn';
    return { lvl, lines };
  }

  async function poll() {
    if (document.hidden) return;
    try {
      const hdr = { Authorization: 'Bearer ' + token }; if (base) hdr['X-HA-Base'] = base;
      const r = await fetch('/api/ha?path=' + encodeURIComponent('/api/states'), { headers: hdr, cache: 'no-store' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const arr = await r.json(); const S = {}; arr.forEach(s => { S[s.entity_id] = s; });
      live.states = S; live.err = '';
    } catch (e) { live.err = (e && e.message) || 'no answer'; live.states = null; }
    try { const r = await fetch('/api/hours', { cache: 'no-store' }); if (r.ok) live.mower = await r.json(); } catch (e) { /* mower stays as last known */ }
    live.when = new Date();
    live.res = {}; Object.keys(MAP).forEach(n => { live.res[n] = judge(+n); });
    paintBar();
    try { paintCluster(); } catch (e) { console.warn('cluster', e); }   // gauges must never break the status lights
    if (window.hccPlan) window.hccPlan.rerender();
    try { paintLife(); } catch (e) { console.warn('life layer', e); }   // never let decoration break the status lights
  }

  /* ---------- THE INSTRUMENT CLUSTER ----------
     Jeff 2026-10-06: "it needs to look like you are looking at a live car dashboard where you can
     see shit working on the map". The dots on the plan say WHICH device; this band says HOW THE
     HOUSE IS DOING, in numbers you can read across the room.

     It reads only what the 20 s poll already fetched - no extra calls, nothing commanded.
     Every entity id below was taken from a live /api/states dump on 2026-10-06, not guessed:
       sensor.my_weather_station_inside_temperature / _temperature   (Jeff's own PWS)
       sensor.water_flow · alarm_control_panel.blink_loewen301 · cover.garage_door
       binary_sensor.remote_ui · input_datetime.grandfather_clock_heartbeat
       sensor.electric_smarthub_energy_monthly_usage_4501007001_<repeat>  (the id really is doubled)
     TEMPERATURES ARE FAHRENHEIT - house rule, never print Celsius to Jeff. */
  const CL_ELEC = 'sensor.electric_smarthub_energy_monthly_usage_4501007001_electric_smarthub_energy_monthly_usage_4501007001';

  function num(id, dp) {
    const s = live.states && live.states[id];
    if (!s) return null;
    const v = parseFloat(s.state);
    if (!isFinite(v)) return null;
    return dp == null ? v : +v.toFixed(dp);
  }
  function stt(id) { const s = live.states && live.states[id]; return s ? s.state : null; }

  function paintCluster() {
    const el = document.getElementById('cluster');
    if (!el) return;
    if (!live.on || !live.states) { el.innerHTML = ''; return; }

    const inside = num('sensor.my_weather_station_inside_temperature', 0);
    const out = num('sensor.my_weather_station_temperature', 0);
    const flow = num('sensor.water_flow', 2);
    const kwh = num(CL_ELEC, 0);
    const alarm = stt('alarm_control_panel.blink_loewen301');
    const garage = stt('cover.garage_door');
    const net = stt('binary_sensor.remote_ui');
    const c = counts();
    const bad = c.down + c.alarm;

    // lights/switches genuinely on, excluding the helper groups and the camera-motion switches
    let lit = 0;
    Object.keys(live.states).forEach(id => {
      if (!/^(light|switch)\./.test(id)) return;
      if (/all_lights|do_not_disturb|camera_motion_detection|_led$|auto_update/.test(id)) return;
      if (live.states[id].state === 'on') lit++;
    });

    // the clock heartbeat: HA holds a timestamp the Beast refreshes every 5 min
    let beatMin = null;
    const hb = stt('input_datetime.grandfather_clock_heartbeat');
    if (hb) { const t = Date.parse(hb.replace(' ', 'T')); if (isFinite(t)) beatMin = Math.round((Date.now() - t) / 60000); }

    const tiles = [];
    const T = (k, v, u, lamp, cls, title) => tiles.push({ k, v, u, lamp, cls, title });

    T('Inside', inside == null ? '--' : inside, '°F', inside == null ? 'idle' : 'ok',
      inside == null ? '' : inside >= 78 ? 'hot' : inside <= 64 ? 'cold' : '', 'Ambient weather station, indoor sensor');
    T('Outside', out == null ? '--' : out, '°F', out == null ? 'idle' : 'ok',
      out == null ? '' : out >= 90 ? 'hot' : out <= 40 ? 'cold' : '', 'Jeff’s own PWS (KTNWHITE21)');
    T('Alarm', alarm ? (alarm === 'armed_away' ? 'ARMED' : alarm === 'armed_home' ? 'HOME' : alarm === 'disarmed' ? 'OFF' : String(alarm).toUpperCase()) : '--',
      '', alarm == null ? 'idle' : /^armed/.test(alarm) ? 'ok' : 'warn', '', 'Blink system arm state');
    T('Garage', garage ? String(garage).toUpperCase() : '--', '',
      garage == null ? 'idle' : garage === 'closed' ? 'ok' : 'warn', garage && garage !== 'closed' ? 'alarmed' : '',
      'Open in daytime heat is CORRECT by Jeff’s rule; still open after 10 PM is a real finding');
    T('Water now', flow == null ? '--' : flow.toFixed(2), 'gpm', flow == null ? 'idle' : flow > 2 ? 'warn' : 'ok', '',
      'A 5-minute smoothed derivative - a brief flush shows as a low decimal, that is documented-normal');
    T('Power cycle', kwh == null ? '--' : kwh, 'kWh', kwh == null ? 'idle' : 'ok', '', 'SmartHub running total this billing cycle');
    T('Lights on', lit, '', lit ? 'ok' : 'idle', '', 'Real lights and plugs that are on right now');
    T('Devices', c.ok, 'ok', bad ? 'bad' : c.warn ? 'warn' : 'ok', bad ? 'alarmed' : '',
      bad ? (bad + ' down') : c.warn ? (c.warn + ' need a look') : 'Everything that reports is answering');
    T('Internet', net === 'on' ? 'UP' : net == null ? '--' : 'DOWN', '', net === 'on' ? 'ok' : net == null ? 'idle' : 'bad',
      net === 'on' ? '' : 'alarmed', 'Home Assistant cloud link');

    let html = '';
    tiles.forEach(t => {
      const small = typeof t.v === 'string' && t.v.length > 4 ? ' sm' : '';
      html += '<div class="cl ' + (t.cls || '') + '" title="' + esc(t.title || '') + '">'
        + '<div class="cl-k">' + esc(t.k) + '</div>'
        + '<div class="cl-v' + small + '">' + esc(String(t.v)) + (t.u ? '<span class="cl-u">' + esc(t.u) + '</span>' : '') + '</div>'
        + '<span class="cl-s ' + t.lamp + '"></span></div>';
    });
    // the clock tile carries the live pip, so a frozen page is visible at a glance
    const stale = beatMin == null || beatMin > 15;
    html += '<div class="cl beat' + (stale ? ' stale' : '') + '" title="'
      + esc(beatMin == null ? 'No heartbeat from the Beast yet' : 'The clock refreshes this every 5 minutes; over 15 means it is stuck')
      + '"><div class="cl-k">Clock</div><div class="cl-v sm"><span class="beat-pip"></span>'
      + (beatMin == null ? '--' : beatMin <= 1 ? 'LIVE' : beatMin + '<span class="cl-u">min</span>') + '</div></div>';

    el.innerHTML = html;
  }

  /* ---------- THE HOUSE, ALIVE ----------
     Jeff 09:40: "add more life to the map, show the tvs on off etc really make it look like it's
     alive". Everything here is drawn from real HA state on every poll - nothing is simulated:
       · room light: every can on a dimmer that is ON throws a warm pool, scaled by its brightness
       · bed lamps glow; the garage fan spins; the hot-water pump's loop circulates
       · TVs: screen lit + flickering when playing, steady when paused, faint when on, a red standby
         dot when off - with the app, the title and a progress bar
       · Echo rings glow cyan while playing
       · doors: an open contact lights its doorway amber with how long it has been open;
         the garage door shows OPEN / moving
       · sprinklers spray when a zone runs; the A/C blows cold air down every duct when the relay runs
       · Sharky circles the dock while it cleans; camera motion pulses at the camera
       · weather at the mast (temperature, humidity, wind arrow), inside temperature at the bed,
         rain falling across the whole map while it rains
       · the Mercedes sits in the driveway when it is home
     Two layers: #L-pools (light on the floors, under the cans) and #L-life (on top, no pointer
     events). Dash mode dims the drawing but not these, which is what makes them glow. */
  function layer(id, beforeId) {
    let g = document.getElementById(id); if (g) return g;
    const world = document.getElementById('world'); if (!world) return null;
    g = document.createElementNS(NS, 'g'); g.id = id; g.setAttribute('pointer-events', 'none');
    const before = beforeId && document.getElementById(beforeId);
    if (before) world.insertBefore(g, before); else world.appendChild(g);
    return g;
  }
  function lifeDefs() {
    const svg = document.getElementById('plan'); if (!svg || document.getElementById('pool-warm')) return;
    const defs = document.createElementNS(NS, 'defs');
    defs.innerHTML =
      '<radialGradient id="pool-warm"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".95"/><stop offset=".35" stop-color="#ffc55c" stop-opacity=".45"/><stop offset="1" stop-color="#ffb13b" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="pool-tv"><stop offset="0" stop-color="#bfe0ff" stop-opacity=".85"/><stop offset=".5" stop-color="#5aa7ff" stop-opacity=".3"/><stop offset="1" stop-color="#2a6fff" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="pool-amber"><stop offset="0" stop-color="#ffc04d" stop-opacity=".9"/><stop offset="1" stop-color="#ff9500" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="pool-cyan"><stop offset="0" stop-color="#9ff3ff" stop-opacity=".9"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>' +
      '<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>';
    svg.insertBefore(defs, svg.firstChild);
  }
  const TVS = [   // fixture rect [x,y,w,h] in feet, which way the screen faces, and the entity that tells us
    { rect: [P_H(19.3), 2.8, 0.3, 5.7], face: -1, e: 'media_player.bedroom_apple_tv', name: 'Bedroom TV' },   // keep in step with plan-data.js fixtures
    { rect: [P_H(28.6), 16.6, 0.6, 4.0], face: -1, e: 'media_player.fire_tv_viewing_room', name: 'Living room TV' },
  ];
  function P_H(hx) { return 14.83 + hx; }
  const CANS = { 16: 'light.bedroom_cans', 17: 'light.kitchen_dining_room_cans', 18: 'light.livingroom_cans', 19: 'switch.masterbath_cans' };
  const DOORS = { front: 'binary_sensor.front_door_contact', deck: 'binary_sensor.back_deck_door_contact', man: 'binary_sensor.garage_man_door_contact' };
  const ZONES = { 43: 'switch.z1_front_right', 44: 'switch.z2_front_left', 45: 'switch.z3_back_left', 46: 'switch.z4_back_right', 47: 'switch.z5_right_side_drive', 48: 'switch.garden' };
  const CAMS = { 10: '301_front_doorbell', 11: '301_driveway', 12: 'front_right', 13: 'back_left', 14: '301_backyard', 15: 'garage' };
  const ECHOS = { 54: 'media_player.living_room_echo_dot', 55: 'media_player.master_bedroom' };

  function paintLife() {
    const hp = window.hccPlan, S = live.states;
    const pools = layer('L-pools', 'L-lighting'), top = layer('L-life', 'L-lamps');
    if (!hp || !pools || !top) return;
    pools.innerHTML = ''; top.innerHTML = '';
    const rain = document.getElementById('rain');
    if (!S) { if (rain) rain.hidden = true; return; }
    lifeDefs();
    const { X, Y, PF, P, devices } = hp;
    const st = id => S[id], on = id => S[id] && S[id].state === 'on';
    const dev = n => devices[n] && !devices[n].removed ? devices[n] : null;
    const esc2 = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    // labels are sized for the whole-house view on Jeff's 1536-wide screen (at Fit the drawing is ~0.6x), so every size is scaled up 1.5x
    const text = (x, y, s, o, parent) => { const a = Object.assign({ x, y, 'font-size': 7, 'text-anchor': 'middle', fill: '#fff', 'font-family': 'var(--body)', 'font-weight': 600 }, o || {}); a['font-size'] = +(a['font-size'] * 1.5).toFixed(1); if (a['stroke-width']) a['stroke-width'] = +(a['stroke-width'] * 1.4).toFixed(1); const t = mk('text', a, parent); t.textContent = s; return t; };
    const mins = iso => Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
    const dur = m => m < 60 ? m + ' min' : (m / 60).toFixed(m < 600 ? 1 : 0) + ' h';

    // 1. ROOM LIGHT — a warm pool under every can, brightness from the dimmer
    Object.entries(CANS).forEach(([n, id]) => {
      const e = st(id); if (!e || e.state !== 'on') return;
      const b = e.attributes && e.attributes.brightness != null ? e.attributes.brightness / 255 : 1;
      const k = 0.35 + 0.65 * b;
      (P.cans[n] || []).forEach(c => {
        mk('circle', { cx: X(c[0]), cy: Y(c[1]), r: (2.2 + 1.6 * b) * PF, fill: 'url(#pool-warm)', opacity: (0.75 * k).toFixed(2), class: 'pool' }, pools);
        mk('circle', { cx: X(c[0]), cy: Y(c[1]), r: 3.6, fill: '#fff4d6', opacity: (0.6 + 0.4 * b).toFixed(2), class: 'can-lit' }, top);
      });
    });
    // lamps on plugs
    [[21, 'switch.bed_lamp_socket_1'], [22, 'switch.smart_socket_2_socket_1']].forEach(([n, id]) => {
      const d = dev(n); if (!d || !on(id)) return;
      mk('circle', { cx: X(d.x), cy: Y(d.y), r: 3.2 * PF, fill: 'url(#pool-warm)', opacity: .7, class: 'pool' }, pools);
    });
    // garage fan: a spinning fan beside its plug
    { const d = dev(23); if (d && on('switch.mini_smart_socket11_2_socket_1')) { const g = mk('g', { transform: `translate(${X(d.x) + 24} ${Y(d.y)})` }, top); const r = mk('g', { class: 'spin' }, g); [0, 120, 240].forEach(a => mk('ellipse', { cx: 0, cy: -7, rx: 3, ry: 7, fill: '#cfe8ff', opacity: .9, transform: `rotate(${a})` }, r)); mk('circle', { r: 2.2, fill: '#fff' }, g); } }
    // hot-water circulation pump: a loop that circulates while it runs
    { const d = dev(24); if (d && on('switch.hot_water_heater_socket_1')) { mk('circle', { cx: X(d.x), cy: Y(d.y), r: 17, fill: 'none', stroke: '#ff7a59', 'stroke-width': 2.4, 'stroke-dasharray': '6 5', class: 'flow' }, top); text(X(d.x), Y(d.y) + 27, 'hot water circulating', { 'font-size': 6, fill: '#ffb199' }, top); } }

    // 2. TVs
    TVS.forEach(tv => {
      const e = st(tv.e); const r = tv.rect;
      const x = X(r[0]), y = Y(r[1]), w = r[2] * PF, h = r[3] * PF, cx = x + w / 2, cy = y + h / 2;
      const s = e ? e.state : 'unavailable';
      if (s === 'off' || s === 'standby' || s === 'unavailable' || s === 'unknown') {
        mk('circle', { cx: cx, cy: y + h + 3, r: 1.8, fill: '#ff3347', class: 'standby' }, top);     // the little red standby light
        return;
      }
      const playing = s === 'playing', paused = s === 'paused';
      const glow = playing ? 1 : paused ? .6 : .35;
      mk('ellipse', { cx: cx + tv.face * 4.2 * PF, cy, rx: 5 * PF, ry: 3.6 * PF, fill: 'url(#pool-tv)', opacity: (0.75 * glow).toFixed(2), class: playing ? 'tv-spill flicker' : 'tv-spill' }, pools);
      mk('rect', { x: x - 1, y: y - 1, width: w + 2, height: h + 2, rx: 1.5, fill: playing ? '#cfe6ff' : '#8fb8e8', opacity: glow, class: playing ? 'tv-screen flicker' : 'tv-screen' }, top);
      const a = e.attributes || {};
      const label = (playing ? '▶ ' : paused ? '⏸ ' : '') + (a.app_name || (s === 'on' || s === 'idle' ? 'On' : cap(s))) + (a.media_title ? ' · ' + a.media_title : '');
      const lx = cx + tv.face * 5.6 * PF, ly = y - 10;
      const t = text(lx, ly, label.length > 44 ? label.slice(0, 43) + '…' : label, { 'font-size': 7.5, fill: '#e8f3ff', 'paint-order': 'stroke', stroke: '#0b1420', 'stroke-width': 2.4 }, top);
      if (a.media_duration > 0 && a.media_position != null) {
        let pos = +a.media_position; if (playing && a.media_position_updated_at) pos += (Date.now() - Date.parse(a.media_position_updated_at)) / 1000;
        const f = Math.max(0, Math.min(1, pos / a.media_duration)), bw = 110;
        mk('rect', { x: lx - bw / 2, y: ly + 6, width: bw, height: 4, rx: 1.5, fill: '#23344a' }, top);
        mk('rect', { x: lx - bw / 2, y: ly + 6, width: (bw * f).toFixed(1), height: 4, rx: 1.5, fill: '#5aa7ff' }, top);
      }
    });
    // Echo rings while playing
    Object.entries(ECHOS).forEach(([n, id]) => { const d = dev(+n), e = st(id); if (!d || !e || e.state !== 'playing') return; mk('circle', { cx: X(d.x), cy: Y(d.y), r: 1.6 * PF, fill: 'url(#pool-cyan)', class: 'pulse-soft' }, pools); mk('circle', { cx: X(d.x), cy: Y(d.y), r: 13, fill: 'none', stroke: '#5ee7ff', 'stroke-width': 2.2, class: 'pulse-soft' }, top); });

    // 3. DOORS
    Object.entries(DOORS).forEach(([doorId, id]) => {
      const e = st(id), d = P.doors.find(z => z.id === doorId); if (!e || !d || e.state !== 'on') return;
      const g = d.gap;
      mk('line', { x1: X(g[0]), y1: Y(g[1]), x2: X(g[2]), y2: Y(g[3]), stroke: '#ffb31a', 'stroke-width': 9, 'stroke-linecap': 'round', opacity: .85, class: 'door-open' }, top);
      mk('ellipse', { cx: (X(g[0]) + X(g[2])) / 2, cy: (Y(g[1]) + Y(g[3])) / 2, rx: 2.4 * PF, ry: 2.4 * PF, fill: 'url(#pool-amber)', opacity: .6 }, pools);
      text((X(g[0]) + X(g[2])) / 2, (Y(g[1]) + Y(g[3])) / 2 - 12, 'OPEN · ' + dur(mins(e.last_changed)), { 'font-size': 7.5, fill: '#ffd27a', 'paint-order': 'stroke', stroke: '#1b1206', 'stroke-width': 2.4 }, top);
    });
    { const e = st('cover.garage_door'), gd = P.bigDoors.find(z => z.id === 'garage-door');
      if (e && gd && e.state !== 'closed') {
        const s = gd.seg, moving = e.state === 'opening' || e.state === 'closing';
        mk('line', { x1: X(s[0]), y1: Y(s[1]), x2: X(s[2]), y2: Y(s[3]), stroke: '#ffb31a', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: .85, class: moving ? 'door-open fast' : 'door-open' }, top);
        text((X(s[0]) + X(s[2])) / 2, Y(s[1]) - 14, 'GARAGE DOOR ' + (moving ? e.state.toUpperCase() + '…' : 'OPEN · ' + dur(mins(e.last_changed))), { 'font-size': 8, fill: '#ffd27a', 'paint-order': 'stroke', stroke: '#1b1206', 'stroke-width': 2.4 }, top);
      } }

    // 4. SPRINKLERS
    Object.entries(ZONES).forEach(([n, id]) => { const d = dev(+n); if (!d || !on(id)) return; for (let i = 0; i < 3; i++) mk('circle', { cx: X(d.x), cy: Y(d.y), r: 1.2 * PF, fill: 'none', stroke: '#6fd3ff', 'stroke-width': 2, class: 'spray', style: `animation-delay:${i * 0.6}s` }, top); text(X(d.x), Y(d.y) + 26, 'watering', { 'font-size': 6.5, fill: '#9fe3ff' }, top); });

    // 5. A/C — cold air down every duct while the relay runs
    if (on('switch.ac_relay')) {
      const du = P.duct, sy = Y(du.supplyY);
      du.trunk.forEach((t, ti) => {
        const x1 = X(t.from), x2 = X(t.to);
        mk('line', { x1, y1: sy, x2, y2: sy, stroke: '#8fe3ff', 'stroke-width': 3, 'stroke-dasharray': '3 9', 'stroke-linecap': 'round', class: 'air' }, top);
        // Jeff, 2026-10-08: "wind emojis going down the ductwork when the AC or heat is running".
        // Two per trunk segment, staggered, riding from the air handler outward - the segments are
        // listed unit-end first, so from->to IS the direction the air actually travels.
        for (let i = 0; i < 2; i++) {
          const puff = mk('text', { 'font-size': 13, 'text-anchor': 'middle', opacity: .92 }, top);
          puff.textContent = '💨';
          mk('animateMotion', { dur: '3.4s', repeatCount: 'indefinite', begin: (ti * 0.4 + i * 1.7).toFixed(1) + 's', path: `M ${x1} ${sy} L ${x2} ${sy}` }, puff);
        }
      });
      du.branches.forEach(b => { const gm = hp.branchGeom(b); const pts = gm.path.map(p => `${X(p[0])},${Y(p[1])}`).join(' '); mk('polyline', { points: pts, fill: 'none', stroke: '#8fe3ff', 'stroke-width': 2.4, 'stroke-dasharray': '3 9', 'stroke-linecap': 'round', class: 'air' }, top); mk('circle', { cx: X(gm.reg[0]), cy: Y(gm.reg[1]), r: 1.4 * PF, fill: 'url(#pool-cyan)', opacity: .55, class: 'pulse-soft' }, pools); });
      const u = du.unit; text(X(u.x + u.w / 2), Y(u.y) - 6, '❄ COOLING', { 'font-size': 8, fill: '#9fe9ff', 'font-weight': 700 }, top);
    }

    // 5b. THE MACHINE MESH — Jeff, 2026-10-08: "if the computers are all working together
    // the[n] show there is a network signal between them".
    // Until tonight this was undrawable: a scan of all 575 HA entities found nothing for the
    // Beast, Acer, Lenovo or KitchenPC, so a link here would have been decoration pretending
    // to be data. HCC-Scripts\Publish-MachineHealth.ps1 now publishes one retained MQTT
    // connectivity entity per machine every 5 min, with expire_after 900 so a dead publisher
    // reads UNAVAILABLE rather than holding a stale "online" - these lines go dark instead of
    // lying. Star topology, because the Beast IS the hub: it runs the AI host, the shares and
    // every scheduled job.
    // Colour follows Jeff's law (2026-10-08): up = green, off = black. A laptop that is simply
    // powered off is NOT a fault and must never be drawn red.
    {
      const HUB = 2;
      const MESH = {
        2:  'binary_sensor.hcc_machines_beast_online',
        81: 'binary_sensor.hcc_machines_acer_laptop_online',
        82: 'binary_sensor.hcc_machines_garage_laptop_online',
        83: 'binary_sensor.hcc_machines_kitchenpc_online',
      };
      const hub = dev(HUB);
      if (hub && st(MESH[HUB])) {
        const hx = X(hub.x), hy = Y(hub.y);
        let linked = 0;
        Object.keys(MESH).forEach((k) => {
          const n = +k; if (n === HUB) return;
          const d = dev(n); if (!d) return;
          const alive = on(MESH[n]);
          const x2 = X(d.x), y2 = Y(d.y);
          mk('line', {
            x1: hx, y1: hy, x2, y2,
            stroke: alive ? '#23a55a' : '#0a0d12',
            'stroke-width': alive ? 1.8 : 1,
            'stroke-dasharray': '4 6',
            'stroke-linecap': 'round',
            opacity: alive ? 0.85 : 0.3,
            class: alive ? 'air' : null,
          }, top);
          if (alive) {
            linked++;
            const pkt = mk('circle', { r: 2.6, fill: '#7df0a8' }, top);
            mk('animateMotion', { dur: '2.6s', repeatCount: 'indefinite', path: `M ${hx} ${hy} L ${x2} ${y2}` }, pkt);
          }
        });
        if (linked) {
          text(hx, hy - 20, linked + ' linked', { 'font-size': 6.5, fill: '#8fe6ad' }, top);
        }
      }
    }

    // 6. SHARKY — circles the dock while cleaning
    { const d = dev(62), e = st('vacuum.sharky'); if (d && e && /clean|return/.test(e.state)) { const g = mk('g', { transform: `translate(${X(d.x)} ${Y(d.y)})` }, top); const r = mk('g', { class: 'orbit' }, g); mk('circle', { cx: 0, cy: -2.2 * PF, r: 6, fill: '#9aa7b4', stroke: '#fff', 'stroke-width': 1.5 }, r); text(X(d.x), Y(d.y) + 30, e.state === 'cleaning' ? 'Sharky cleaning' : 'Sharky heading home', { 'font-size': 6.5, fill: '#dfe7ef' }, top); } }

    // 7. CAMERA MOTION — a pulse at the camera while Blink reports motion
    Object.entries(CAMS).forEach(([n, id]) => { const d = dev(+n); if (!d || !on('binary_sensor.' + id + '_motion')) return; mk('circle', { cx: X(d.x), cy: Y(d.y), r: 1.2 * PF, fill: 'none', stroke: '#ff5a6e', 'stroke-width': 2.4, class: 'spray' }, top); text(X(d.x), Y(d.y) - 16, 'motion', { 'font-size': 6.5, fill: '#ff9aa6' }, top); });

    // 8. WEATHER at the mast + inside temperature at the bed + rain over everything
    { const t = st('sensor.my_weather_station_temperature'), hu = st('sensor.my_weather_station_humidity'), ws = st('sensor.my_weather_station_wind_speed'), wd = st('sensor.my_weather_station_wind_direction');
      const mast = P.yard.find(y => y.kind === 'mast');
      if (t && mast && !isNaN(+t.state)) {
        const r = mast.rect, x = X(r[0] + r[2] / 2), y = Y(r[1] + r[3]) + 16;
        text(x, y, `${(+t.state).toFixed(1)}°F outside · ${hu ? hu.state + '% hum' : ''}`, { 'font-size': 8.5, fill: '#e8f3ff', 'paint-order': 'stroke', stroke: '#0b1420', 'stroke-width': 2.6 }, top);
        if (ws && wd && !isNaN(+wd.state)) {
          const spd = +ws.state, g = mk('g', { transform: `translate(${x} ${y + 16}) rotate(${(+wd.state + 180) % 360})` }, top);
          mk('path', { d: 'M0,-9 L5,3 L0,0 L-5,3 Z', fill: spd > 0 ? '#9fe9ff' : '#6f7d8c' }, g);
          text(x + 16, y + 19, spd > 0 ? `${spd} mph` : 'calm', { 'font-size': 7, fill: '#bcd3e6', 'text-anchor': 'start' }, top);
        }
      }
      const it = st('sensor.my_weather_station_inside_temperature'), d = dev(21);
      if (it && d && !isNaN(+it.state)) text(X(d.x), Y(d.y) + 26, `${(+it.state).toFixed(1)}°F inside`, { 'font-size': 7, fill: '#ffe2a0', 'paint-order': 'stroke', stroke: '#1b1206', 'stroke-width': 2.2 }, top);
      const pr = st('sensor.my_weather_station_precipitation_intensity');
      if (rain) rain.hidden = !(pr && +pr.state > 0);
    }

    // 9. THE MERCEDES — parked in the driveway when it is home
    { const e = st('device_tracker.gle_350_device_tracker'); const home = e && e.state === 'home';
      const cx = X(7.4), cy = Y(-1.4), w = 6.3 * PF, l = 13 * PF;
      const g = mk('g', { transform: `translate(${cx} ${cy})`, opacity: home ? 1 : .35 }, top);
      mk('rect', { x: -w / 2, y: -l / 2, width: w, height: l, rx: 26, fill: home ? '#2b3440' : 'none', stroke: home ? '#9aa7b4' : '#9aa7b4', 'stroke-width': 1.6, 'stroke-dasharray': home ? null : '5 4' }, g);
      if (home) {
        mk('rect', { x: -w / 2 + 10, y: -l / 2 + 42, width: w - 20, height: 34, rx: 8, fill: '#4b6278', opacity: .9 }, g);   // windscreen
        mk('rect', { x: -w / 2 + 12, y: l / 2 - 64, width: w - 24, height: 26, rx: 8, fill: '#4b6278', opacity: .8 }, g);   // rear glass
        const eng = st('binary_sensor.gle_350_engine_state'); const lit = eng && eng.state === 'on';
        [-1, 1].forEach(sx => mk('ellipse', { cx: sx * (w / 2 - 14), cy: -l / 2 + 8, rx: 10, ry: 5, fill: lit ? '#fff7cf' : '#6b7684', class: lit ? 'pulse-soft' : null }, g));
      }
      // Jeff 12:14: "show its location". Away = straight-line miles from zone.home, from the car's own GPS.
      let where = 'away';
      const z = st('zone.home'), ea = e && e.attributes;
      if (!home && z && ea && ea.latitude != null) {
        const R = 3958.8, rad = v => v * Math.PI / 180, la1 = rad(z.attributes.latitude), la2 = rad(ea.latitude);
        const dLa = la2 - la1, dLo = rad(ea.longitude - z.attributes.longitude);
        const mi = 2 * R * Math.asin(Math.sqrt(Math.sin(dLa / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLo / 2) ** 2));
        where = (mi < 10 ? mi.toFixed(1) : Math.round(mi)) + ' mi away';
      }
      text(cx, cy + l / 2 + 12, home ? 'GLE 350 · home' : 'GLE 350 · ' + where,{ 'font-size': 7.5, fill: '#dfe7ef', 'paint-order': 'stroke', stroke: '#0b1420', 'stroke-width': 2.4 }, top);
    }
  }

  /* ---------- the bar at the top of the map ---------- */
  const bar = document.getElementById('live');
  function counts() { const c = { ok: 0, off: 0, warn: 0, down: 0, alarm: 0, unknown: 0 }; Object.values(live.res).forEach(r => { if (r && r.lvl) c[r.lvl]++; }); return c; }
  function paintBar() {
    if (!bar) return;
    if (!live.on) {
      bar.className = 'live idle';
      // Showcase is a LOOK, not a reading. Say so plainly - a pretty plan that implies the
      // lights are really on would be worse than the dead one it replaces.
      bar.innerHTML = document.body.classList.contains('showcase')
        ? '<span class="led" style="background:' + COLORS.unknown + '"></span><b>SHOWCASE</b> · how the house is laid out, lit for display — <b>not live readings</b>. Open from the HCC app (Guardian → House map) for real status.'
        : '<span class="led" style="background:' + COLORS.unknown + '"></span>Live status lights show when this plan is opened from the HCC app (Guardian → House map).';
      return;
    }
    if (!live.when) { bar.className = 'live'; bar.innerHTML = '<span class="led pulse" style="background:' + COLORS.unknown + '"></span>Checking every device…'; return; }
    const c = counts(), t = live.when.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const bad = c.down + c.alarm;
    bar.className = 'live' + (live.err ? '' : c.alarm ? ' alarm' : bad ? ' bad' : c.warn ? ' warn' : ' good');
    bar.innerHTML = (live.err ? '<span class="led" style="background:' + COLORS.unknown + '"></span><b>Can’t reach Home Assistant</b> · ' + esc(live.err) + ' · retrying every minute'
      : '<span class="led pulse" style="background:' + (bad ? COLORS.down : c.warn ? COLORS.warn : COLORS.ok) + '"></span><b>LIVE</b>'
        + ' <span class="ct"><i style="background:' + COLORS.ok + '"></i>' + c.ok + ' reporting</span>'
        + (c.warn ? ' <span class="ct"><i style="background:' + COLORS.warn + '"></i>' + c.warn + ' need a look</span>' : '')
        + ' <span class="ct"><i style="background:' + COLORS.down + '"></i>' + bad + ' down</span>'
        + (c.off ? ' <span class="ct"><i style="background:' + COLORS.off + '"></i>' + c.off + ' off</span>' : ''))
      + ' <span class="when">' + t + '</span>';
    bar.title = (bad + c.warn) ? 'Tap to jump to the first device that needs attention' : 'Everything that reports to Home Assistant is answering';
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  /* ---------- the lamps ----------
     Jeff 09:24: "They don't look like lights. I want it to be like a car dashboard with real
     illumination." Each light is now a dashboard lamp: a blurred halo of light spilling round it,
     a domed lens (radial gradient, hot white-ish core -> colour -> dark rim), a dark bezel and a
     specular glint. Lit lamps breathe; amber pulses; red blinks with a flashing ring. An OFF lamp
     is an unlit lens with no glow, the way a dash shows a dark indicator.
     Lamps live in their own layer ABOVE the devices so "dash mode" can dim the whole drawing and the
     device dots while the lamps stay at full brightness. pointer-events:none, so a click still lands
     on the device underneath. */
  const NS = 'http://www.w3.org/2000/svg';
  const LENS = {   // [core, colour, rim]
    ok: ['#eafff0', '#2fe07a', '#0b6b33'], warn: ['#fff6d6', '#ffb31a', '#8a5200'],
    down: ['#ffe3e3', '#ff3347', '#7a0a14'], alarm: ['#ffe3e3', '#ff3347', '#7a0a14'],
    off: ['#8d949c', '#5b626a', '#2c3136'], unknown: ['#c9ced4', '#8f969e', '#4a5057'],
  };
  const GLOW = { ok: '#35ff86', warn: '#ffb31a', down: '#ff2d42', alarm: '#ff2d42' };
  let lampLayer = null;
  function ensureDefs() {
    const svg = document.getElementById('plan'); if (!svg || document.getElementById('lamp-glow')) return;
    const defs = document.createElementNS(NS, 'defs');
    let h = '<filter id="lamp-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3.2"/></filter>';
    Object.entries(LENS).forEach(([k, c]) => { h += `<radialGradient id="lens-${k}" cx="40%" cy="38%" r="65%"><stop offset="0" stop-color="${c[0]}"/><stop offset=".45" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient>`; });
    defs.innerHTML = h; svg.insertBefore(defs, svg.firstChild);
  }
  function lampsLayer() {
    if (lampLayer && lampLayer.isConnected) return lampLayer;
    const world = document.getElementById('world'); if (!world) return null;
    lampLayer = document.createElementNS(NS, 'g'); lampLayer.id = 'L-lamps'; lampLayer.setAttribute('pointer-events', 'none');
    world.appendChild(lampLayer); return lampLayer;
  }
  function mk(tag, attrs, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; }

  /* ---------- hooks plan-app.js calls ---------- */
  window.hccLive = {
    active: () => live.on,
    clear() { const l = lampsLayer(); if (l) l.innerHTML = ''; },
    decorate(gd, d) {                                   // the lamp on a dot
      const r = live.res[d.n]; if (!live.on || !r || !r.lvl) return;
      ensureDefs(); const layer = lampsLayer(); if (!layer) return;
      const lv = r.lvl;
      const g = mk('g', { transform: gd.getAttribute('transform') + ' translate(9 -9)', class: 'lamp lv-' + lv }, layer);
      if (lv === 'down' || lv === 'alarm') mk('circle', { r: 17, cx: -9, cy: 9, fill: 'none', stroke: GLOW.down, 'stroke-width': 2.6, class: 'down-ring' }, g);
      if (GLOW[lv]) mk('circle', { r: (lv === 'down' || lv === 'alarm') ? 15 : 12, fill: GLOW[lv], filter: 'url(#lamp-glow)', class: 'halo' }, g);
      mk('circle', { r: 7, fill: '#15191e' }, g);                                          // bezel
      mk('circle', { r: 5.7, fill: `url(#lens-${lv})`, class: 'lens' }, g);                   // lens
      mk('ellipse', { cx: -1.9, cy: -2.1, rx: 2.1, ry: 1.3, fill: '#fff', opacity: GLOW[lv] ? .75 : .35 }, g);  // glint
    },
    led(n) { const r = live.res[n]; if (!live.on || !r || !r.lvl) return ''; return '<span class="kled" title="' + WORDS[r.lvl] + '" style="background:' + COLORS[r.lvl] + '"></span>'; },
    detail(n) {
      if (!live.on) return '';
      const r = live.res[n];
      if (!r) return '<div class="ins-live"><div class="lv-h"><span class="kled hollow"></span>Not connected to Home Assistant</div></div>';
      return '<div class="ins-live">' + (r.lvl ? '<div class="lv-h"><span class="kled" style="background:' + COLORS[r.lvl] + '"></span>' + WORDS[r.lvl] + '</div>' : '') + r.lines.map(l => '<div>' + esc(l) + '</div>').join('') + '</div>';
    },
    tip(n) {
      const r = live.res[n]; if (!live.on || !r || !r.lvl) return '';
      // For a problem, show the line that explains it (e.g. "Battery LOW"), not whatever came first ("Dry").
      const why = RANK[r.lvl] >= RANK.warn ? r.lines.find(l => /LOW|unavailable|not found|WATER|No new|Last meter|DISCONNECTED|down|never|unknown/i.test(l)) : null;
      const line = why || r.lines[0];
      return WORDS[r.lvl] + (line ? ' · ' + line : '');
    },
    problems() { return Object.keys(live.res).map(Number).filter(n => { const r = live.res[n]; return r && RANK[r.lvl] >= RANK.warn; }).sort((a, b) => RANK[live.res[b].lvl] - RANK[live.res[a].lvl] || a - b); },
    words: WORDS, colors: COLORS, level: n => (live.res[n] || {}).lvl,
  };

  if (bar) bar.addEventListener('click', () => {
    if (!live.on) return;
    const p = window.hccLive.problems();
    if (window.hccPanel) window.hccPanel(true);
    if (p.length && window.hccPlan) window.hccPlan.select(p[0]);
  });

  // App-only: a way back to the app, and the polling itself.
  if (token) {
    live.on = true;
    document.body.classList.add('live-on');
    // Dash mode: ON by default in the live view (that is what Jeff asked for), remembered per browser.
    const dashBtn = document.getElementById('dash');
    const setDash = on => { document.body.classList.toggle('dash', on); if (dashBtn) { dashBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); dashBtn.innerHTML = on ? '&#9728; Day view' : '&#9790; Dash lights'; } };
    let dashPref = null; try { dashPref = localStorage.getItem('hccPlanDash'); } catch (e) {}
    setDash(dashPref !== '0');
    if (dashBtn) dashBtn.addEventListener('click', () => { const on = !document.body.classList.contains('dash'); setDash(on); try { localStorage.setItem('hccPlanDash', on ? '1' : '0'); } catch (e) {} });
    const back = document.getElementById('back-app'); if (back) back.hidden = false;
    document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });
    setInterval(poll, POLL_MS);
    poll();
  } else {
    // No token: the plan was opened OUTSIDE the HCC app - a shared link, a browser bookmark,
    // or Jeff showing it to somebody. That is the view most people ever see, and it used to
    // render stone dead: no lamps, no night view, and the "Dash lights" button in index.html
    // sat there visible but wired to nothing, because this whole block was app-only.
    // Showcase mode turns on the dark view and the decorative light pools so the drawing looks
    // like a lit house instead of a CAD plot. It carries NO live data and the bar says so.
    const dashBtn = document.getElementById('dash');
    const setShow = on => {
      document.body.classList.toggle('dash', on);
      document.body.classList.toggle('showcase', on);
      if (dashBtn) { dashBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); dashBtn.innerHTML = on ? '&#9728; Day view' : '&#9790; Dash lights'; }
      paintBar();
    };
    // Jeff, 2026-10-08: "I asked him to make the new house map look like it was a live house
    // with lights and working ceiling fans... it looks plain as hell I don't like to even show
    // people anymore." The living layer was real, but it only draws what is HAPPENING - so with
    // the A/C off and nothing watering, half of it had nothing to render and the map looked dead
    // to anyone he showed it to.
    // plan-demo.js is a snapshot of his real house with the few idle things set to a busy moment.
    // It is used ONLY here, with no token. The moment the plan is opened from the HCC app, poll()
    // overwrites live.states with the truth and none of this is reachable. live.on stays FALSE,
    // so the bar keeps saying SHOWCASE / not live readings.
    if (window.HCC_PLAN_DEMO) { live.states = window.HCC_PLAN_DEMO; live.when = null; }

    let showPref = null; try { showPref = localStorage.getItem('hccPlanShowcase'); } catch (e) {}
    setShow(showPref !== '0');
    // Draw the life layer once from the snapshot - but NOT yet. plan-live.js is loaded BEFORE
    // plan-app.js, so window.hccPlan does not exist at this point and paintLife() would return
    // immediately having drawn nothing. The token path never hits this because poll() is async
    // and by the time it resolves the plan is built. Measured: lifeNodes 0 on the first attempt.
    // Wait for the plan, then draw once. Bounded so a failure to build can never spin forever.
    (function drawShowcase(tries) {
      if (window.hccPlan) {
        try { paintLife(); } catch (e) { console.warn('showcase life layer', e); }
        return;
      }
      if (tries > 0) setTimeout(function () { drawShowcase(tries - 1); }, 100);
    })(50);
    if (dashBtn) dashBtn.addEventListener('click', () => {
      const on = !document.body.classList.contains('showcase');
      setShow(on);
      try { localStorage.setItem('hccPlanShowcase', on ? '1' : '0'); } catch (e) {}
    });
  }
  paintBar();
})();
