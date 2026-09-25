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
  const COLORS = { ok: '#23a55a', warn: '#e39b00', down: '#d7263d', alarm: '#d7263d', off: '#9aa3ad', unknown: '#c3c9d0' };
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
    if (window.hccPlan) window.hccPlan.rerender();
    try { paintLife(); } catch (e) { console.warn('life layer', e); }   // never let decoration break the status lights
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
      du.trunk.forEach(t => mk('line', { x1: X(t.from), y1: sy, x2: X(t.to), y2: sy, stroke: '#8fe3ff', 'stroke-width': 3, 'stroke-dasharray': '3 9', 'stroke-linecap': 'round', class: 'air' }, top));
      du.branches.forEach(b => { const gm = hp.branchGeom(b); const pts = gm.path.map(p => `${X(p[0])},${Y(p[1])}`).join(' '); mk('polyline', { points: pts, fill: 'none', stroke: '#8fe3ff', 'stroke-width': 2.4, 'stroke-dasharray': '3 9', 'stroke-linecap': 'round', class: 'air' }, top); mk('circle', { cx: X(gm.reg[0]), cy: Y(gm.reg[1]), r: 1.4 * PF, fill: 'url(#pool-cyan)', opacity: .55, class: 'pulse-soft' }, pools); });
      const u = du.unit; text(X(u.x + u.w / 2), Y(u.y) - 6, '❄ COOLING', { 'font-size': 8, fill: '#9fe9ff', 'font-weight': 700 }, top);
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
    if (!live.on) { bar.className = 'live idle'; bar.innerHTML = '<span class="led" style="background:' + COLORS.unknown + '"></span>Live status lights show when this plan is opened from the HCC app (Guardian → House map).'; return; }
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
  }
  paintBar();
})();
