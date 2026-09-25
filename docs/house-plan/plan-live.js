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
  const POLL_MS = 60000;

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

  /* ---------- hooks plan-app.js calls ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  window.hccLive = {
    active: () => live.on,
    decorate(gd, d) {                                   // the light on a dot
      const r = live.res[d.n]; if (!live.on || !r || !r.lvl) return;
      if (r.lvl === 'down' || r.lvl === 'alarm') {
        const h = document.createElementNS(NS, 'circle'); h.setAttribute('r', 15); h.setAttribute('fill', 'none'); h.setAttribute('stroke', COLORS.down); h.setAttribute('stroke-width', 2.6); h.setAttribute('class', 'down-ring'); gd.insertBefore(h, gd.firstChild);
      }
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', 8.8); c.setAttribute('cy', -8.8); c.setAttribute('r', 4.8);
      c.setAttribute('fill', COLORS[r.lvl]); c.setAttribute('stroke', '#fff'); c.setAttribute('stroke-width', 1.6);
      c.setAttribute('class', 'led-dot lv-' + r.lvl); gd.appendChild(c);
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
    const back = document.getElementById('back-app'); if (back) back.hidden = false;
    document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });
    setInterval(poll, POLL_MS);
    poll();
  }
  paintBar();
})();
