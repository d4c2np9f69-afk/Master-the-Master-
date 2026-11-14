// Handler tests for functions/api/hours.js — the mower sensor bridge.
//
// This subsystem is owned by the local coworker session specifically because it
// can only be verified against real hardware and the live endpoint. This file is
// the part that CAN be checked without either, so it exists to make regressions
// in the fiddly bits — the coverage gate, the control channel — impossible to
// ship unnoticed. Run it before every deploy of hours.js:
//
//   node scripts/mower-hours-test.mjs
//
// It talks to the real exported handlers through a mock KV. No network, no box.

import { onRequestPost, onRequestGet } from '../functions/api/hours.js';
const TOKEN = 'test-maintenance-token-0123456789';

function mockKV(seed = {}) {
  const m = new Map(Object.entries(seed));
  return {
    _m: m,
    async get(k) { return m.has(k) ? m.get(k) : null; },
    async put(k, v) { m.set(k, String(v)); },
  };
}

const post = (kv, body) =>
  onRequestPost({ request: new Request('https://x/api/hours', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }), env: { MOWER_KV: kv } });

const get = (kv, qs = '') =>
  onRequestGet({ request: new Request('https://x/api/hours' + qs), env: { MOWER_KV: kv } });

const cover = async (kv) => {
  const raw = await kv.get('yard_coverage');
  return raw ? JSON.parse(raw) : {};
};
const nCells = async (kv) => Object.keys(await cover(kv)).length;

let pass = 0, fail = 0;
function check(name, cond, detail) {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}${detail ? '  -> ' + detail : ''}`); }
}

// A realistic parked heartbeat, matching a real payload captured 2026-08-11.
const parked = (over = {}) => ({
  hours_seconds: 19890, hours: 5.525, battery: 13.22, rpm_peak: 0, rpm_avg: 0,
  has_fix: true, lat: 36.476639, lon: -86.660133, dist_session_m: 0,
  dist_total_m: 6326, mpu_ok: 1, gps_rx: 4, vibration: 0.003, wifi_rssi: -65,
  pitch: -12.4, roll: 28.4, shock_events: 0, esp_temp_f: 143,
  track: [[36.476638, -86.66013]], source: 'heartbeat', engine_running: false,
  ...over,
});

console.log('\n-- coverage gate (parked drift must not become mowed yard) --');
{
  const kv = mockKV();
  await post(kv, parked());
  check('parked heartbeat with 1 track point adds no cells', (await nCells(kv)) === 0,
    `got ${await nCells(kv)} cells`);

  // The real bug: it is not just about ADDING cells. A repeat parked reading was
  // incrementing the visit count on the garage cell every 5 minutes, and coverage
  // shades by visit count — so the parking spot was becoming the most "confirmed"
  // ground on the map without ever adding a cell.
  for (let i = 0; i < 5; i++) await post(kv, parked());
  const cells = await cover(kv);
  check('repeat parked heartbeats never inflate a visit count',
    Object.values(cells).every((v) => v === 0) || Object.keys(cells).length === 0,
    JSON.stringify(cells));
}
{
  const kv = mockKV();
  // A mow-end upload that failed on WiFi and is flushed later still arrives as a
  // heartbeat, but carries the whole mow. Dropping it would lose a real mow's map.
  const many = [];
  for (let i = 0; i < 12; i++) many.push([36.4770 + i * 0.00005, -86.6605 + i * 0.00005]);
  await post(kv, parked({ track: many }));
  check('delayed multi-point track on a heartbeat IS merged', (await nCells(kv)) > 5,
    `got ${await nCells(kv)} cells`);
}
{
  const kv = mockKV();
  // Jeff idled it in the garage for 3 minutes to calibrate the vibration
  // threshold, and that alone painted 6 cells over the parking spot. A running
  // engine is not a moving mower — warm-ups and maintenance runs must not map.
  await post(kv, parked({ engine_running: true, source: 'live',
                          lat: 36.4780, lon: -86.6610, track: [] }));
  check('a running engine standing still adds nothing', (await nCells(kv)) === 0,
    `got ${await nCells(kv)} cells`);

  await post(kv, parked({ engine_running: true, source: 'live',
                          lat: 36.4780, lon: -86.6610,
                          track: [[36.4780, -86.6610]] }));
  check('one lone track point is still not travel', (await nCells(kv)) === 0,
    `got ${await nCells(kv)} cells`);
}
{
  const kv = mockKV();
  const many = [];
  for (let i = 0; i < 10; i++) many.push([36.4780 + i * 0.00005, -86.6610]);
  await post(kv, parked({ engine_running: true, source: 'live', track: many }));
  check('genuine travel still maps', (await nCells(kv)) > 5, `got ${await nCells(kv)} cells`);
}
{
  const kv = mockKV({ mower_ctrl_token: TOKEN });
  const many = [];
  for (let i = 0; i < 10; i++) many.push([36.4780 + i * 0.00005, -86.6610]);
  await post(kv, parked({ engine_running: true, track: many }));
  const before = await nCells(kv);
  let r = await post(kv, { __cmd: 'queue_cmd', do: 'clear_coverage' });
  check('clearing coverage needs a credential', r.status === 401, `status ${r.status}`);
  const j = await (await post(kv, { __cmd: 'queue_cmd', do: 'clear_coverage', token: TOKEN })).json();
  check('authorised clear wipes the map', (await nCells(kv)) === 0 && j.cells_removed === before,
    JSON.stringify(j));
}
{
  const kv = mockKV();
  // Old firmware sent has_fix:0, and 0 !== false, so a literal "0,0" Null Island
  // cell got written. It really happened; it must stay impossible.
  await post(kv, parked({ engine_running: true, has_fix: 0, lat: 0, lon: 0, track: [] }));
  const c = await cover(kv);
  check('no-fix 0,0 never creates a cell', !('0,0' in c) && Object.keys(c).length === 0,
    JSON.stringify(c));
}

console.log('\n-- hour meter + mow history (must not regress) --');
{
  const kv = mockKV();
  await post(kv, parked());
  const j = await (await get(kv)).json();
  check('hours reaches the app as a decimal', j.hours === 5.525, `got ${j.hours}`);
  check('device secret is not echoed publicly', !('secret' in j), JSON.stringify(Object.keys(j)));

  await post(kv, parked({ source: 'mow_end', mow_ended: true, hours: 6.1,
    rpm_peak: 2950, rpm_avg: 2700, dist_session_m: 812 }));
  const j2 = await (await get(kv)).json();
  check('mow_end records one history entry', j2.history.length === 1, JSON.stringify(j2.history));
  check('history captures the mow from the body, not prev',
    j2.history[0]?.rpm_peak === 2950 && j2.history[0]?.dist_session_m === 812,
    JSON.stringify(j2.history[0]));
}

console.log('\n-- a dead sensor must not keep serving its last reading --');
{
  const kv = mockKV();
  // Healthy reading first, so there is something for the merge to resurrect.
  await post(kv, parked({ mpu_ok: 1, pitch: -12.4, roll: 28.5, tilt_deg: 0.3 }));
  let j = await (await get(kv)).json();
  check('healthy tilt is served normally', j.pitch === -12.4, `got ${j.pitch}`);

  // Now the MPU goes silent. Firmware 1.4.0 omits tilt entirely in this case —
  // verified against the real box on the bench, which sent no pitch/roll at all.
  const dead = parked({ mpu_ok: 0 });
  delete dead.pitch; delete dead.roll;
  await post(kv, dead);
  j = await (await get(kv)).json();
  check('stale pitch is dropped, not inherited from the last good reading',
    j.pitch === undefined, `got ${j.pitch}`);
  check('stale roll is dropped too', j.roll === undefined, `got ${j.roll}`);
  check('mpu_ok still reports the failure', j.mpu_ok === 0, `got ${j.mpu_ok}`);
  check('unrelated fields still merge normally', j.hours === 5.525, `got ${j.hours}`);
}
{
  const kv = mockKV();
  // A no-fix reading SHOULD keep the last known position — deliberately different
  // from tilt, and worth pinning so nobody "fixes" it later.
  await post(kv, parked({ has_fix: true, lat: 36.4766, lon: -86.6601 }));
  const nofix = parked({ has_fix: false });
  delete nofix.lat; delete nofix.lon;
  await post(kv, nofix);
  const j = await (await get(kv)).json();
  check('last known position survives a no-fix reading', j.lat === 36.4766, `got ${j.lat}`);
  check('has_fix honestly reports no fix', j.has_fix === false, `got ${j.has_fix}`);
}

console.log('\n-- per-cycle fields must not be inherited by the merge --');
{
  const kv = mockKV();
  // A cycle that carried an ack and vibration stats.
  await post(kv, parked({ cmd_ack: 1, last_cmd: 1, last_cmd_ok: true,
                          vib_max: 0.31, vib_avg: 0.12, vib_n: 40 }));
  let j = await (await get(kv)).json();
  check('ack and vib stats are served on the cycle that sent them',
    j.cmd_ack === 1 && j.vib_max === 0.31, JSON.stringify({a: j.cmd_ack, v: j.vib_max}));

  // Next cycle: command retired, stats reset — the box sends none of them.
  await post(kv, parked());
  j = await (await get(kv)).json();
  check('retired ack is not still asserted', j.cmd_ack === undefined, `got ${j.cmd_ack}`);
  check('stale vib stats are dropped', j.vib_max === undefined, `got ${j.vib_max}`);
  check('but hours still carry forward', j.hours === 5.525, `got ${j.hours}`);
  check('and the track still carries forward', Array.isArray(j.track) && j.track.length === 1,
    JSON.stringify(j.track));
}

console.log('\n-- control channel: auth --');

{
  const kv = mockKV();
  let r = await post(kv, { __cmd: 'queue_cmd', do: 'zero_tilt' });
  check('command with no credential is rejected', r.status === 401, `status ${r.status}`);

  r = await post(kv, { __cmd: 'queue_cmd', do: 'zero_tilt', token: 'wrong' });
  check('command with a wrong token is rejected', r.status === 401, `status ${r.status}`);

  // A blank/short token in KV must never authorise a blank token from a caller.
  const kv2 = mockKV({ mower_ctrl_token: '' });
  r = await post(kv2, { __cmd: 'queue_cmd', do: 'zero_tilt', token: '' });
  check('empty token cannot authorise against an empty KV value', r.status === 401, `status ${r.status}`);
}
{
  const kv = mockKV({ mower_ctrl_token: TOKEN });
  const r = await post(kv, { __cmd: 'queue_cmd', do: 'zero_tilt', token: TOKEN });
  check('valid token authorises', r.status === 200, `status ${r.status}`);
}
{
  // The family password path, hashed exactly as auth.js stores it.
  const enc = new TextEncoder().encode('hunter2');
  const buf = await crypto.subtle.digest('SHA-256', enc);
  const hash = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  const kv = mockKV({ auth_hash: hash });
  let r = await post(kv, { __cmd: 'queue_cmd', do: 'zero_tilt', password: 'hunter2' });
  check('family password authorises', r.status === 200, `status ${r.status}`);
  r = await post(kv, { __cmd: 'queue_cmd', do: 'reboot', password: 'nope' });
  check('wrong family password is rejected', r.status === 401, `status ${r.status}`);
}

console.log('\n-- control channel: config clamping --');
{
  const kv = mockKV({ mower_ctrl_token: TOKEN });
  let j = await (await post(kv, { __cmd: 'set_cfg', token: TOKEN,
    cfg: { vib_threshold: 50 } })).json();
  check('a threshold that would kill the hour meter is refused',
    j.rejected.some((r) => r.key === 'vib_threshold'), JSON.stringify(j));

  j = await (await post(kv, { __cmd: 'set_cfg', token: TOKEN,
    cfg: { vib_threshold: 0.02, made_up_key: 1 } })).json();
  check('an in-range value is accepted', j.accepted.vib_threshold === 0.02, JSON.stringify(j.accepted));
  check('an unknown key is reported, not silently dropped',
    j.rejected.some((r) => r.key === 'made_up_key'), JSON.stringify(j.rejected));
  check('cfg_rev bumps when config changes', j.cfg_rev === 1, `got ${j.cfg_rev}`);

  const before = j.cfg_rev;
  j = await (await post(kv, { __cmd: 'set_cfg', token: TOKEN, cfg: { nonsense: 1 } })).json();
  check('a fully rejected patch does not bump cfg_rev', j.cfg_rev === before, `got ${j.cfg_rev}`);
}

console.log('\n-- control channel: command delivery + ack --');
{
  const kv = mockKV({ mower_ctrl_token: TOKEN });
  await post(kv, { __cmd: 'queue_cmd', do: 'zero_tilt', token: TOKEN });

  let j = await (await post(kv, parked())).json();
  check('box receives the queued command on its next upload',
    j.cmd?.do === 'zero_tilt' && typeof j.cmd?.id === 'number', JSON.stringify(j.cmd));
  const id = j.cmd.id;

  j = await (await post(kv, parked())).json();
  check('unacked command is re-sent (a box that died mid-command retries)',
    j.cmd?.id === id, JSON.stringify(j.cmd));

  j = await (await post(kv, parked({ cmd_ack: id }))).json();
  check('acking clears it from the same response', !j.cmd, JSON.stringify(j.cmd));

  j = await (await post(kv, parked())).json();
  check('acked command stays gone', !j.cmd, JSON.stringify(j.cmd));
}
{
  const kv = mockKV({ mower_ctrl_token: TOKEN });
  await post(kv, { __cmd: 'queue_cmd', do: 'zero_tilt', token: TOKEN });
  const j = await (await post(kv, { __cmd: 'queue_cmd', do: 'zero_tilt', token: TOKEN })).json();
  check('duplicate command collapses (never zero twice)', !!j.already_queued, JSON.stringify(j));
}
{
  const kv = mockKV({ mower_ctrl_token: TOKEN });
  let r = await post(kv, { __cmd: 'queue_cmd', do: 'rm_rf', token: TOKEN });
  check('an unknown command is refused', r.status === 400, `status ${r.status}`);

  r = await post(kv, { __cmd: 'queue_cmd', do: 'ota', token: TOKEN });
  check('OTA without a pinned https URL is refused', r.status === 400, `status ${r.status}`);

  const j = await (await post(kv, { __cmd: 'queue_cmd', do: 'ota', token: TOKEN,
    url: 'https://toro1-5rz.pages.dev/fw/mower-1.4.0.bin', sha256: 'abc' })).json();
  check('OTA with a pinned URL is accepted', j.queued?.args?.url?.endsWith('.bin'), JSON.stringify(j));
}

console.log('\n-- control channel: config handed down only when box is behind --');
{
  const kv = mockKV({ mower_ctrl_token: TOKEN });
  await post(kv, { __cmd: 'set_cfg', token: TOKEN, cfg: { vib_threshold: 0.02 } });

  let j = await (await post(kv, parked())).json();
  check('a box reporting no cfg_rev is sent the config', j.cfg?.vib_threshold === 0.02,
    JSON.stringify(j));

  j = await (await post(kv, parked({ cfg_rev: j.cfg_rev }))).json();
  check('an up-to-date box is not re-sent the config', !j.cfg, JSON.stringify(j));
  check('cfg_rev is always reported so drift is visible', typeof j.cfg_rev === 'number',
    JSON.stringify(j));
}

console.log('\n-- telemetry must survive a broken control channel --');
{
  // If the control channel ever throws, the reading must still be stored. Losing
  // telemetry to a config bug would be the worst possible trade.
  const kv = mockKV({ mower_ctrl: '{ this is not json' });
  const r = await post(kv, parked());
  check('malformed ctrl in KV does not fail the upload', r.status === 200, `status ${r.status}`);
  const j = await (await get(kv)).json();
  check('reading still stored despite bad ctrl', j.hours === 5.525, `got ${j.hours}`);
}

// ---- 2026-09-24: Jeff stopped mid-mow for gas + water and the app showed TWO mows
// and "This Mow 0.23 mi" (the last stretch only) for a 0.92 mi mow. ----------------
console.log('\n-- one mow per gas stop (2026-09-24) --');
const mowEnd = (over = {}) => ({ ...parked(), source: 'mow_end', mow_ended: true, ...over });
const trk = (n, off = 0) => Array.from({ length: n }, (_, i) => [36.4768 + (i + off) * 0.00004, -86.6600 + (i + off) * 0.00004]);
const hist = async (kv) => JSON.parse((await kv.get('hours_history')) || '[]');
{
  const kv = mockKV();
  // stretch 1: 0.81 h, 1,101 m. Its upload made it (WiFi at the gas can).
  await post(kv, mowEnd({ hours: 6.3833, dist_total_m: 7439, dist_session_m: 1101, rpm_peak: 3650, rpm_avg: 3560, track: trk(80) }));
  // stretch 2 right after the gas stop: 0.27 h, 376 m.
  await post(kv, mowEnd({ hours: 6.65, dist_total_m: 7815, dist_session_m: 376, rpm_peak: 3600, rpm_avg: 3540, track: trk(31, 80) }));
  const h = await hist(kv);
  check('a gas stop mid-mow records ONE mow, not two', h.length === 1, `got ${h.length} entries`);
  check('merged mow keeps the final hour meter', h[0]?.hours_end === 6.65, JSON.stringify(h[0]?.hours_end));
  check('merged mow distance = both stretches (1,101 + 376)', h[0]?.dist_mow_m === 1477, JSON.stringify(h[0]?.dist_mow_m));
  check('merged mow keeps both stretches of track', h[0]?.track?.length === 111, `got ${h[0]?.track?.length}`);
  check('merged mow keeps the higher RPM peak', h[0]?.rpm_peak === 3650, JSON.stringify(h[0]?.rpm_peak));
}
{
  // The first stretch's upload FAILED (no WiFi in the yard), so its points are still at
  // the front of the box's buffer on the second upload — must not be doubled.
  const kv = mockKV();
  await post(kv, mowEnd({ hours: 6.3833, dist_total_m: 7439, dist_session_m: 1101, track: trk(80) }));
  await post(kv, mowEnd({ hours: 6.65, dist_total_m: 7815, dist_session_m: 376, track: trk(111) }));
  const h = await hist(kv);
  check('a re-sent buffer is not double-counted in the track', h[0]?.track?.length === 111, `got ${h[0]?.track?.length}`);
}
{
  // A real separate mow days later must stay separate, and get its own odometer distance.
  const kv = mockKV({ hours_history: JSON.stringify([{ date: '2026-09-20T20:00:00.000Z', hours_end: 5.575, dist_total_m: 6338, dist_mow_m: 900 }]) });
  await post(kv, mowEnd({ hours: 6.65, dist_total_m: 7815, dist_session_m: 376, track: trk(20) }));
  const h = await hist(kv);
  check('a mow days later is a NEW entry', h.length === 2, `got ${h.length}`);
  check('its distance comes from the odometer, not the last stretch', h[1]?.dist_mow_m === 1477, JSON.stringify(h[1]?.dist_mow_m));
}

console.log('\n-- one-time parked-drift cleanup (2026-09-24) --');
{
  const kv = mockKV({ yard_coverage: JSON.stringify({ '3647664,-8666015': 670, '3647665,-8666015': 5, '3647700,-8666100': 1, '3647701,-8666101': 2 }) });
  await post(kv, parked());
  const c = await cover(kv);
  check('parking-spot drift cells (4+ visits) are removed', !c['3647664,-8666015'] && !c['3647665,-8666015'], JSON.stringify(c));
  check('real grass (1-2 visits) is kept', c['3647700,-8666100'] === 1 && c['3647701,-8666101'] === 2, JSON.stringify(c));
  await kv.put('yard_coverage', JSON.stringify({ ...c, '3647664,-8666015': 9 }));
  await post(kv, parked());
  check('cleanup runs only ONCE', (await cover(kv))['3647664,-8666015'] === 9, JSON.stringify(await cover(kv)));
}

console.log('\n-- second one-time parked-drift cleanup (2026-11-05) --');
{
  // The 09-24 cleanup ran on the live KV, so its flag is set. The leak carried on after it,
  // through the hole the span gate closes, and repainted the same spot. Made-up mid-ocean cells.
  const kv = mockKV({
    coverage_cleanup_2026_09_24: JSON.stringify({ removed: 184 }),
    yard_coverage: JSON.stringify({ '1000000,2000000': 410, '1000001,2000000': 4, '1000100,2000100': 1, '1000101,2000101': 2, '1000102,2000102': 3 }),
  });
  await post(kv, parked());
  const c = await cover(kv);
  check('runs even though the 09-24 flag is already set', !c['1000000,2000000'] && !c['1000001,2000000'], JSON.stringify(c));
  check('1, 2 and 3-visit cells are kept', c['1000100,2000100'] === 1 && c['1000101,2000101'] === 2 && c['1000102,2000102'] === 3, JSON.stringify(c));
  const flag = JSON.parse((await kv.get('coverage_cleanup_2026_11_05')) || '{}');
  check('records what it removed, cell by cell, so it can be put back',
        flag.removed === 2 && flag.cells && flag.cells['1000000,2000000'] === 410 && flag.cells['1000001,2000000'] === 4, JSON.stringify(flag));
  await kv.put('yard_coverage', JSON.stringify({ ...c, '1000000,2000000': 9 }));
  await post(kv, parked());
  check('and it runs only once', (await cover(kv))['1000000,2000000'] === 9);
}

console.log('');
console.log('-- CREDENTIAL LEAK GATE (2026-10-13) --');
// WHY THIS EXISTS: on 2026-10-13 11:0x PM a maintenance POST was sent WITHOUT `__cmd`, so it
// missed the control-channel branch and fell through to the telemetry path. The body's
// `token` was stored verbatim in `hours_data` and written into the sensor log - and BOTH are
// served by the UNAUTHENTICATED GET. A live 64-char maintenance token was published at
// https://toro1-5rz.pages.dev/api/hours until it was noticed and cleared.
// Same class as BUG 4 in docs/mower/gps_firmware_coworker_findings_2026-08-11.md, where the
// box's `secret` was echoed. `secret` had been fixed; `token`/`password` had not.
{
  const kv = mockKV();
  await post(kv, parked({ token: TOKEN, password: 'family-password', secret: 'box-secret' }));
  const bad = (t) => t.includes(TOKEN) || t.includes('family-password') || t.includes('box-secret');

  const storedRaw = await kv.get('hours_data');
  check('a credential in a stray POST is never STORED in hours_data', !bad(storedRaw), storedRaw.slice(0, 150));

  const logRaw = (await kv.get('sensor_log')) || '';
  check('a credential is never written to the sensor log', !bad(logRaw), logRaw.slice(0, 150));

  const body = await (await get(kv)).text();
  check('the unauthenticated GET serves no credential', !bad(body), body.slice(0, 150));

  const logBody = await (await get(kv, '?log=1')).text();
  check('?log=1 serves no credential', !bad(logBody), logBody.slice(0, 150));
}
{
  // The redactor must also scrub a value ALREADY in KV from before the fix - that is the real
  // 10-13 situation: one log row still held the token after the live reading was cleared,
  // and the log keeps 5,000 rows so it would not roll off for a long time.
  const kv = mockKV({
    hours_data: JSON.stringify({ hours: 6.65, token: TOKEN }),
    sensor_log: JSON.stringify([{ date: '2026-10-13T04:04:00.000Z', source: 'live', token: TOKEN }]),
  });
  const body = await (await get(kv)).text();
  check('a PRE-EXISTING stored credential is redacted on output', !body.includes(TOKEN), body.slice(0, 150));
  const logBody = await (await get(kv, '?log=1')).text();
  check('a PRE-EXISTING logged credential is redacted on ?log=1', !logBody.includes(TOKEN), logBody.slice(0, 150));
  check('redaction does not damage the real data', JSON.parse(body).hours === 6.65, body.slice(0, 150));
}


// ---- #270 - THE GHOST `cfg` FIELD (2026-11-04) -------------------------------------
// The 10-13 control POST in commit 3194249 omitted `__cmd`, missed the authorised branch
// and fell through to the telemetry path carrying a token AND a cfg patch. The token was
// deleted, the cfg was not, so `cfg: {"idle_interval_s": 3600}` merged into hours_data and
// the PUBLIC GET served it as telemetry for three weeks. It was never live - the box
// measured 894 s - and it cost a session a false alarm that an hour-long interval was
// queued to ship. Measured still present on the live endpoint 2026-11-04 2:52 PM.
{
  console.log('\n-- ghost cfg field (#270, 2026-11-04) --');
  const ghost = { hours: 7.7583, dist_total_m: 9541, cfg: { idle_interval_s: 3600 } };

  const kv = mockKV({ hours_data: JSON.stringify(ghost) });
  const served = await (await get(kv)).json();
  check('the public GET no longer serves the ghost cfg',
        served.cfg === undefined, JSON.stringify(served.cfg));
  check('stripping cfg does not damage the real telemetry',
        served.hours === 7.7583 && served.dist_total_m === 9541, JSON.stringify(served).slice(0, 120));

  // A heartbeat merges `{ ...prev, ...body }`, so a cfg in `prev` SURVIVES a body without
  // one. Deleting it from the incoming body alone would never evict the stored ghost -
  // this is the check that proves the eviction actually happens.
  await post(kv, { source: 'heartbeat', engine_running: false, hours: 7.7583, battery: 12.4 });
  const stored = JSON.parse(await kv.get('hours_data'));
  check('the next heartbeat EVICTS the ghost from stored hours_data',
        stored.cfg === undefined, JSON.stringify(stored.cfg));
  check('that heartbeat still keeps the real stored telemetry',
        stored.dist_total_m === 9541, JSON.stringify(stored).slice(0, 120));

  // The origin itself: a control POST that forgot __cmd.
  const kv2 = mockKV({ mower_ctrl_token: TOKEN });
  await post(kv2, { token: TOKEN, cfg: { idle_interval_s: 3600 }, hours: 1.5 });
  const stored2 = JSON.parse(await kv2.get('hours_data'));
  check('a stray control POST can no longer plant a new cfg ghost',
        stored2.cfg === undefined, JSON.stringify(stored2.cfg));
  check('and that stray POST still never stores the token',
        stored2.token === undefined, JSON.stringify(stored2.token));

  // REGRESSION GUARD: `down.cfg` is built from CTRL_KEY, not from the telemetry body, so
  // scrubbing the body must not stop the box from receiving its real config.
  const kv3 = mockKV({ mower_ctrl_token: TOKEN });
  await post(kv3, { __cmd: 'set_cfg', token: TOKEN, cfg: { idle_interval_s: 600 } });
  const reply = await (await post(kv3, { source: 'heartbeat', engine_running: false, cfg_rev: 0 })).json();
  check('the BOX still receives cfg downstream (control channel intact)',
        !!reply.cfg && reply.cfg.idle_interval_s === 600, JSON.stringify(reply.cfg));
}


// ---- #267 - THE LOST MOW ON A BUFFERED REPLAY ------------------------------------
// Diagnosed 2026-11-03, fix written the same day, and it had NO test until 11-04.
// Jeff: "why did it lose my data ??? That's bull shit." The box was not at fault: when a
// mow ends out of WiFi range the firmware resends the reading from a 20-slot ring buffer
// in RTC RAM, but that buffer is a 64-byte packed struct with no room for a "this was a
// mow end" flag. The replay therefore arrives as source:"buffered" with mow_ended null,
// matched neither trigger, and the mow was dropped with no error while the reading was
// still logged, merged into coverage and shown on the card.
// Measured over the whole sensor log: every engine-hours value that ever arrived buffered
// was lost, 3 for 3, 88 minutes of mowing - 6.3833 (09-24), 7.0833 (10-23), 7.7583 (11-03).
// Untested, this silently regresses, which is exactly the 50-day hour-meter failure again.
{
  console.log('\n-- lost mow on buffered replay (#267) --');
  // Dated well back so the MERGE_GAP_MIN rule cannot fold these into the previous entry -
  // that merge is a separate behaviour with its own tests above.
  const seed = () => mockKV({
    hours_history: JSON.stringify([
      { date: '2026-10-23T18:00:00.000Z', hours_end: 7.0833, dist_total_m: 9100, rpm_avg: 2700 },
    ]),
  });

  // The real 11-03 case, replayed.
  let kv = seed();
  await post(kv, { source: 'buffered', age_s: 600, engine_running: false,
                   hours: 7.7583, dist_total_m: 9541, rpm_peak: 3100, rpm_avg: 2800 });
  let h = await hist(kv);
  check('a buffered replay carrying unrecorded runtime IS recorded', h.length === 2, `${h.length} entries`);
  check('it is recorded with the replayed end-hours',
        h.length === 2 && h[1].hours_end === 7.7583, JSON.stringify(h[h.length - 1]).slice(0, 150));

  // The ring buffer flushes several slots back-to-back carrying identical hours. Only the
  // first can ever record - the test is self-idempotent, which is why it needs no new
  // firmware field.
  await post(kv, { source: 'buffered', age_s: 540, engine_running: false, hours: 7.7583, dist_total_m: 9541 });
  check('a second replay of the SAME hours records nothing (idempotent)',
        (await hist(kv)).length === 2, `${(await hist(kv)).length} entries`);

  // A parked heartbeat must never invent a mow out of nothing.
  kv = seed();
  await post(kv, { source: 'heartbeat', engine_running: false, hours: 7.0833, battery: 12.4 });
  check('a heartbeat with no new runtime records nothing',
        (await hist(kv)).length === 1, `${(await hist(kv)).length} entries`);

  // MIN_LOST_MOW_H = one minute. Below that it is noise, not a mow.
  kv = seed();
  await post(kv, { source: 'heartbeat', engine_running: false, hours: 7.0833 + 0.008, battery: 12.4 });
  check('under a minute of new runtime is NOT a mow (MIN_LOST_MOW_H)',
        (await hist(kv)).length === 1, `${(await hist(kv)).length} entries`);

  kv = seed();
  await post(kv, { source: 'heartbeat', engine_running: false, hours: 7.0833 + 0.02, battery: 12.4 });
  check('just over a minute of new runtime IS recorded',
        (await hist(kv)).length === 2, `${(await hist(kv)).length} entries`);
}

// ---- Firmware 1.5.0: the track arrives as one binary file, ahead of the mow_end post ----
// Coordinates are made up (mid-ocean), never the yard: this repo is public.
const TRK_MARKER = -2147483648;
const trkFile = (mows) => {
  const n = mows.reduce((s, m) => s + 1 + m.pts.length, 0);
  const dv = new DataView(new ArrayBuffer(n * 8));
  let o = 0;
  for (const m of mows) {
    dv.setInt32(o, TRK_MARKER, true); dv.setInt32(o + 4, m.id, true); o += 8;
    for (const p of m.pts) {
      dv.setInt32(o, Math.round(p[0] * 1e6), true); dv.setInt32(o + 4, Math.round(p[1] * 1e6), true); o += 8;
    }
  }
  return dv.buffer;
};
const postRaw = (kv, buf) =>
  onRequestPost({ request: new Request('https://x/api/hours?track_file=1', {
    method: 'POST', headers: { 'content-type': 'application/octet-stream' }, body: buf,
  }), env: { MOWER_KV: kv } });
const postTrk = (kv, mows) => postRaw(kv, trkFile(mows));
const walk = (n, startLat = 10.0, stepM = 3) =>
  Array.from({ length: n }, (_, i) => [+(startLat + i * stepM / 111320).toFixed(6), 20.0]);
const stored = async (kv, id) => { const r = await kv.get(`mow_trk:${id}`); return r ? JSON.parse(r).pts : null; };
const histOf = async (kv) => JSON.parse((await kv.get('hours_history')) || '[]');
const mowEnd15 = (id, hours, over = {}) => ({
  source: 'mow_end', mow_ended: true, engine_running: false, fw: '1.5.0', hours, track: [],
  mow_id: id, trk_pts: 0, dist_total_m: 1000, ...over,
});
const FW15_HB = (hours, over = {}) => ({ source: 'heartbeat', engine_running: false, fw: '1.5.0', hours, track: [], ...over });
const minsAgo = (m) => new Date(Date.now() - m * 60000).toISOString();

console.log('\n-- track file: parsing and storage --');
{
  const kv = mockKV();
  const res = await postTrk(kv, [{ id: 5, pts: walk(20) }]);
  const j = await res.json();
  check('a good file answers 200 ok:true (the box deletes its copy on exactly this)',
        res.status === 200 && j.ok === true, JSON.stringify(j));
  const got = await stored(kv, 5);
  check('every point is stored under the mow id, to the microdegree',
        got && got.length === 20 && got[19][0] === walk(20)[19][0] && got[19][1] === 20,
        JSON.stringify(got && got[19]));

  check('a file not a whole number of records is refused',
        (await postRaw(kv, new ArrayBuffer(9))).status === 400);
  check('an oversized file is refused',
        (await postRaw(kv, new ArrayBuffer(257 * 1024))).status === 413);

  const kv2 = mockKV();
  await postTrk(kv2, [{ id: 1, pts: [[10, 20], [95, 20], [10, 200], [0, 0], [10.00003, 20]] }]);
  const g2 = await stored(kv2, 1);
  check('impossible positions and 0,0 are dropped, good ones kept',
        g2 && g2.length === 2, JSON.stringify(g2));

  const kv3 = mockKV();
  const buf = trkFile([{ id: 9, pts: walk(3) }]);
  await postRaw(kv3, buf.slice(8));
  check('points with no marker to name their mow are not guessed at',
        kv3._m.size === 0 || !(await stored(kv3, 0)), [...kv3._m.keys()].join());

  const kv4 = mockKV();
  const r4 = await postTrk(kv4, [{ id: 3, pts: walk(30) }, { id: 4, pts: walk(40, 10.001) }]);
  check('one file holding two mows stores both',
        (await stored(kv4, 3)).length === 30 && (await stored(kv4, 4)).length === 40 && (await r4.json()).ok);

  const kv5 = mockKV();
  await postTrk(kv5, [{ id: 7, pts: walk(30) }]);
  for (const k of ['hours_history', 'sensor_log', 'hours_data']) {
    check(`the track POST does not write ${k} (one writer, nothing to race)`, !kv5._m.has(k));
  }
}

console.log('\n-- track file: resends --');
{
  // The box resends whenever it did not get a clean OK, including when the server's answer
  // was lost on the way back. So a resend must cost nothing and change nothing.
  const kv = mockKV();
  await postTrk(kv, [{ id: 21, pts: walk(30) }]);
  const puts = [];
  const realPut = kv.put.bind(kv);
  kv.put = async (k, v) => { puts.push(k); return realPut(k, v); };
  const before = JSON.stringify(await cover(kv));
  const r = await postTrk(kv, [{ id: 21, pts: walk(30) }]);
  check('an identical resend still answers ok, so the box can delete its copy',
        (await r.json()).ok === true);
  check('an identical resend writes nothing at all to KV', puts.length === 0, puts.join());
  check('an identical resend leaves the map alone', JSON.stringify(await cover(kv)) === before);

  // Longer resend: the first upload got through, the OK did not, and the file then grew.
  const kv2 = mockKV();
  await postTrk(kv2, [{ id: 22, pts: walk(30) }]);
  const firstCells = await cover(kv2);
  await postTrk(kv2, [{ id: 22, pts: walk(60) }]);
  const after = await cover(kv2);
  const twice = Object.keys(firstCells).filter((k) => after[k] > 1);
  check('a longer resend stores the longer track', (await stored(kv2, 22)).length === 60);
  check('a longer resend paints the new ground', Object.keys(after).length > Object.keys(firstCells).length);
  // The new stretch starts ON the last point already merged, so the join can touch a cell
  // or two. What must not happen is the first 30 points counting as a second pass.
  check('a longer resend does not count the ground it already merged as a second pass',
        Object.keys(firstCells).length > 10 && twice.length <= 2,
        `${twice.length} of ${Object.keys(firstCells).length} cells counted twice`);
}

console.log('\n-- track file: coverage --');
{
  const kv = mockKV();
  await postTrk(kv, [{ id: 1, pts: walk(30) }]);
  const n1 = await nCells(kv);
  check('a track that went somewhere paints the map', n1 > 30, `${n1} cells`);

  const before = JSON.stringify(await cover(kv));
  const res = await postTrk(kv, [{ id: 1, pts: walk(30) }]);
  check('a resend (the OK was lost on the way back) still answers ok', (await res.json()).ok === true);
  check('a resend changes no visit count', JSON.stringify(await cover(kv)) === before);

  const kv2 = mockKV();
  await postTrk(kv2, [{ id: 2, pts: walk(4, 10.0, 1.5) }]);
  check('a track spanning under 15 m paints nothing (idling, parked drift)', (await nCells(kv2)) === 0);

  const kv3 = mockKV();
  await kv3.put('coverage_paused', '1');
  await postTrk(kv3, [{ id: 3, pts: walk(30) }]);
  check('paused: the map is left alone', (await nCells(kv3)) === 0);
  check('paused: the track itself is still kept', (await stored(kv3, 3)).length === 30);

  const kv4 = mockKV();
  await postTrk(kv4, [{ id: 4, pts: walk(30) }]);
  await postTrk(kv4, [{ id: 5, pts: walk(30) }]);
  const twice = Object.values(await cover(kv4));
  check('two real mows over the same ground do count two visits', twice.every((v) => v === 2), twice.slice(0, 5).join());

  // NVS erased (board swapped): ids restart and collide with an old mow's key. Length alone
  // would call the new mow "already have it" and lose it.
  const kv5 = mockKV();
  await postTrk(kv5, [{ id: 1, pts: walk(50) }]);
  await postTrk(kv5, [{ id: 1, pts: walk(20, 10.01) }]);
  check('same id but different ground is a different mow: it replaces, not skips',
        (await stored(kv5, 1))[0][0] === 10.01);
}

console.log('\n-- mow_end attaches the stored track --');
{
  let kv = mockKV();
  await postTrk(kv, [{ id: 6, pts: walk(400) }]);
  await post(kv, mowEnd15(6, 8, { trk_pts: 400 }));
  let h = await histOf(kv);
  check('history entry records the mow id and the full count',
        h.length === 1 && h[0].mow_ids && h[0].mow_ids[0] === 6 && h[0].track_pts === 400, JSON.stringify(h[0]).slice(0, 160));
  check('history keeps a decimated copy, so 50 mows stay a small value',
        h[0].track.length > 50 && h[0].track.length <= 100, `${h[0].track && h[0].track.length} pts`);
  check('the decimated copy keeps both ends of the mow',
        h[0].track[0][0] === walk(400)[0][0] && h[0].track[h[0].track.length - 1][0] === walk(400)[399][0]);
  const live = await (await get(kv)).json();
  check('the live reading carries the new track for the app', live.track && live.track.length === h[0].track.length);

  // The trap in the old code: a mow with no track of its own copied the previous one.
  kv = mockKV({ hours_data: JSON.stringify({ hours: 7, track: walk(50, 20.0) }),
                hours_history: JSON.stringify([{ date: minsAgo(600), hours_end: 7, track: walk(50, 20.0) }]) });
  await post(kv, mowEnd15(1, 8, { trk_pts: 0 }));
  h = await histOf(kv);
  check('a 1.5.0 mow with no track never inherits the previous mow\'s', h[1].track === null, JSON.stringify(h[1].track).slice(0, 80));
  check('...and the live reading drops the stale 1.4.0 track', ((await (await get(kv)).json()).track || []).length === 0);

  // 1.4.0 must carry on working: it is what is on the mower today.
  kv = mockKV({ hours_data: JSON.stringify({ hours: 7, track: walk(50, 20.0) }) });
  await post(kv, { source: 'mow_end', mow_ended: true, engine_running: false, fw: '1.4.0', hours: 8, track: [] });
  h = await histOf(kv);
  check('1.4.0 still gets its old fallback track', h[0].track && h[0].track.length === 50);
  kv = mockKV();
  await post(kv, { source: 'mow_end', mow_ended: true, engine_running: true, fw: '1.4.0', hours: 8, track: walk(30) });
  check('1.4.0 still paints coverage from a JSON track', (await nCells(kv)) > 30);

  // A cut mow never got a mow_end. Its track must stay with the record that follows it.
  kv = mockKV({ hours_history: JSON.stringify([{ date: minsAgo(9000), hours_end: 7, mow_ids: [3], track_pts: 10, track_want: 10 }]) });
  await postTrk(kv, [{ id: 4, pts: walk(20) }, { id: 5, pts: walk(20, 10.001) }, { id: 6, pts: walk(20, 10.002) }]);
  await post(kv, mowEnd15(6, 8, { trk_pts: 20 }));
  h = await histOf(kv);
  check('ids since the last record all go on this one', JSON.stringify(h[1].mow_ids) === '[4,5,6]', JSON.stringify(h[1].mow_ids));
  check('and all their points are counted', h[1].track_pts === 60, `${h[1].track_pts}`);

  // First 1.5.0 mow after 1.4.0 history: no earlier id to count from.
  kv = mockKV({ hours_history: JSON.stringify([{ date: minsAgo(9000), hours_end: 7, track: walk(9) }]) });
  await post(kv, mowEnd15(12, 8));
  check('with no earlier id it attaches only its own', JSON.stringify((await histOf(kv))[1].mow_ids) === '[12]');
}

console.log('\n-- a gas stop folds into one mow; a resend does not double it --');
{
  const kv = mockKV();
  await postTrk(kv, [{ id: 1, pts: walk(30) }]);
  await post(kv, mowEnd15(1, 8, { trk_pts: 30 }));
  await postTrk(kv, [{ id: 2, pts: walk(30, 10.001) }]);
  await post(kv, mowEnd15(2, 8.01, { trk_pts: 30 }));
  let h = await histOf(kv);
  check('two stretches minutes apart are one record', h.length === 1 && JSON.stringify(h[0].mow_ids) === '[1,2]', JSON.stringify(h.map((e) => e.mow_ids)));
  check('holding both stretches\' points', h[0].track_pts === 60, `${h[0].track_pts}`);
  await post(kv, mowEnd15(2, 8.01, { trk_pts: 30 }));
  h = await histOf(kv);
  check('the same mow_end twice does not double the points', h[0].track_pts === 60 && h[0].mow_ids.length === 2, `${h[0].track_pts}`);
  check('nor raises what it is waiting for', h[0].track_want === 60, `${h[0].track_want}`);
}

console.log('\n-- a track that arrives after its mow_end (late, or KV not yet consistent) --');
{
  const kv = mockKV();
  await post(kv, mowEnd15(8, 8, { trk_pts: 25 }));
  let h = await histOf(kv);
  check('the mow is recorded without it, and says what it is waiting for',
        h[0].track === null && h[0].track_pts === 0 && h[0].track_want === 25, JSON.stringify(h[0]).slice(0, 200));
  const frozen = { date: h[0].date, hours_mow: h[0].hours_mow, segments: h[0].segments };

  await postTrk(kv, [{ id: 8, pts: walk(25) }]);
  check('the track POST still leaves history alone', (await histOf(kv))[0].track === null);

  await post(kv, FW15_HB(8));
  h = await histOf(kv);
  check('the next post fills it in', h[0].track && h[0].track.length === 25 && h[0].track_pts === 25, JSON.stringify(h[0]).slice(0, 160));
  check('the live reading gets it too', ((await (await get(kv)).json()).track || []).length === 25);
  check('and nothing else about the record moved (a heartbeat must not "fold" into it)',
        h[0].date === frozen.date && h[0].hours_mow === frozen.hours_mow && h[0].segments === frozen.segments,
        JSON.stringify(h[0]).slice(0, 160));

  const raw = await kv.get('hours_history');
  await post(kv, FW15_HB(8));
  check('once filled, a heartbeat writes nothing to history', (await kv.get('hours_history')) === raw);

  // A heartbeat inside the merge window, with nothing to fill, must leave it untouched.
  const kv2 = mockKV();
  await post(kv2, mowEnd15(9, 8));
  const raw2 = await kv2.get('hours_history');
  await post(kv2, FW15_HB(8));
  check('nothing due: history is byte-identical after a heartbeat', (await kv2.get('hours_history')) === raw2);

  // Points that will never come (file lost): stop asking after two days.
  const kv3 = mockKV({ hours_history: JSON.stringify([{ date: minsAgo(3000), hours_end: 8, mow_ids: [1], track_pts: 0, track_want: 9 }]) });
  await postTrk(kv3, [{ id: 1, pts: walk(9) }]);
  await post(kv3, FW15_HB(8));
  check('past 48 h it stops looking', (await histOf(kv3))[0].track_pts === 0);
}

console.log('\n-- GET ?track= --');
{
  const kv = mockKV();
  await postTrk(kv, [{ id: 1, pts: walk(30) }]);
  await post(kv, mowEnd15(1, 8, { trk_pts: 30 }));
  await postTrk(kv, [{ id: 2, pts: walk(30, 10.001) }]);
  await post(kv, mowEnd15(2, 8.01, { trk_pts: 30 }));
  let j = await (await get(kv, '?track=latest')).json();
  check('latest returns every stretch of the latest mow, full resolution',
        j.ok && j.tracks.length === 2 && j.tracks[0].pts.length === 30 && j.tracks[1].id === 2, JSON.stringify(j).slice(0, 120));
  j = await (await get(kv, '?track=1')).json();
  check('a number means that mow id, not "latest"', j.tracks.length === 1 && j.tracks[0].id === 1, JSON.stringify(j).slice(0, 120));
  j = await (await get(kv, '?track=99')).json();
  check('an unknown id is empty, not an error', j.ok && j.tracks.length === 0);
  j = await (await get(mockKV(), '?track=latest')).json();
  check('no mows yet is empty, not an error', j.ok && j.tracks.length === 0);
  j = await (await get(mockKV({ hours_history: JSON.stringify([{ hours_end: 7, track: walk(5) }]) }), '?track=latest')).json();
  check('1.4.0-only history is empty, not an error', j.ok && j.tracks.length === 0);
}

console.log('\n-- a replayed mow keeps the time it actually ended --');
{
  // Comment at readAt says stamping arrival time poisoned the merge. readAt was computed and
  // never used, so it still did.
  const seed = () => mockKV({ hours_history: JSON.stringify([{ date: minsAgo(60), hours_end: 7, hours_mow: 0.5 }]) });
  let kv = seed();
  await post(kv, { source: 'buffered', mow_ended: true, engine_running: false, fw: '1.4.0', age_s: 3000, hours: 7.001, track: [] });
  let h = await histOf(kv);
  check('a mow replayed from 50 min ago, started 10 min after the last, folds in',
        h.length === 1 && h[0].hours_end === 7.001, `${h.length} entries`);
  kv = mockKV({ hours_history: JSON.stringify([{ date: minsAgo(600), hours_end: 7 }]) });
  await post(kv, { source: 'buffered', mow_ended: true, engine_running: false, fw: '1.4.0', age_s: 1800, hours: 7.5, track: [] });
  h = await histOf(kv);
  const ago = (Date.now() - Date.parse(h[1].date)) / 60000;
  check('its record is dated when it ended, not when the radio got through', Math.abs(ago - 30) < 1, `${ago.toFixed(1)} min ago`);
}

console.log('\n-- the 1.5.0 tunables can be set --');
{
  const kv = mockKV({ mower_ctrl_token: TOKEN });
  const j = await (await post(kv, { __cmd: 'set_cfg', token: TOKEN, cfg: { track_min_mps: 0.3, track_max_hdop: 4 } })).json();
  check('track_min_mps and track_max_hdop are accepted', j.accepted && j.accepted.track_min_mps === 0.3 && j.accepted.track_max_hdop === 4, JSON.stringify(j).slice(0, 160));
  const j2 = await (await post(kv, { __cmd: 'set_cfg', token: TOKEN, cfg: { track_min_mps: 9 } })).json();
  check('and clamped', j2.rejected.length === 1);
}

// How heavy is one mow's file? A Pages Function has a CPU budget, and if this POST were ever
// killed for it the box would resend the same file forever. Printed, not asserted: Node on
// this PC is not a Cloudflare isolate, so a pass/fail number here would prove nothing.
{
  const kv = mockKV();
  const big = []; for (let r = 0; r < 40; r++) for (let i = 0; i < 50; i++) big.push([+(10 + r * 2e-5).toFixed(6), +(20 + (r % 2 ? 49 - i : i) * 2.7e-5).toFixed(6)]);
  const t0 = performance.now();
  await postTrk(kv, [{ id: 1, pts: big }]);
  console.log(`  note: ${big.length}-point file (~6 km mow), first request on a cold JIT: ${(performance.now() - t0).toFixed(1)} ms in Node, ${await nCells(kv)} cells`);
}


// ---- 2026-11-05: the meter Jeff reads, and the mow record the box actually made ----------
// Jeff: "The hours say 14.5 instead of 15.5" / "Make sure the app all matches the box".
// Fixtures are the real 11-05 records and sensor_log rows with every GPS point removed
// (yard coordinates never go in this public repo); tracks are replaced by counts' worth of
// dummy points far from any real place.
const fakeTrk = (n) => Array.from({ length: n }, (_, i) => [10 + i * 1e-5, 20]);
const REAL_HIST = () => [
  { date: '2026-08-12T00:35:27.411Z', hours_end: 5.575, rpm_peak: 3740, rpm_avg: 3725, dist_session_m: 11, battery: 11.21, esp_temp_f: 141, shock_events: 0, track: fakeTrk(4) },
  { date: '2026-09-24T20:53:41.813Z', hours_end: 6.65, rpm_peak: 3650, rpm_avg: 3555, dist_session_m: 376, battery: 12.66, esp_temp_f: 154, shock_events: 0, track: fakeTrk(11) },
  { date: '2026-11-03T19:55:21.535Z', hours_end: 7.1583, hours_mow: 0.5083, rpm_peak: 3680, rpm_avg: 3630, dist_session_m: 135, dist_total_m: 8616, dist_mow_m: 135, battery: 12.43, esp_temp_f: 137, shock_events: 0, track: fakeTrk(9) },
  { date: '2026-11-03T20:48:30.020Z', hours_end: 7.5333, hours_mow: 0.375, rpm_peak: 3620, rpm_avg: 3543, dist_session_m: 49, dist_total_m: 9195, dist_mow_m: 579, battery: 12.72, esp_temp_f: 154, shock_events: 0, track: fakeTrk(8) },
  { date: '2026-11-05T20:45:07.929Z', hours_end: 7.7583, hours_mow: 0.225, rpm_peak: 3650, rpm_avg: 3561, dist_session_m: 346, dist_total_m: 9541, dist_mow_m: 346, battery: 13.45, esp_temp_f: 123, shock_events: 0, track: fakeTrk(1) },
];
const REAL_LOG = () => [
  { date: '2026-09-17T13:19:44.514Z', hours: 5.575, source: 'heartbeat', dist_total_m: 6338 },
  { date: '2026-09-24T20:53:42.006Z', hours: 6.65, source: 'mow_end', dist_total_m: 7815, dist_session_m: 376, rpm_peak: 3650, rpm_avg: 3555 },
  { date: '2026-10-23T22:13:25.482Z', hours: 7.0833, source: 'buffered', age_s: 900, dist_total_m: 8481, dist_session_m: 666, rpm_peak: 3800, rpm_avg: 3590, battery: 12.49, esp_temp_f: 153, shock_events: 0 },
  { date: '2026-10-23T22:13:26.000Z', hours: 7.0833, source: 'buffered', age_s: 840, dist_total_m: 8481 },
  { date: '2026-11-03T19:55:21.985Z', hours: 7.1583, source: 'mow_end', dist_total_m: 8616, dist_session_m: 135 },
  { date: '2026-11-03T20:48:30.456Z', hours: 7.5333, source: 'mow_end', dist_total_m: 9195, dist_session_m: 49 },
  { date: '2026-11-03T21:32:07.143Z', hours: 7.7583, source: 'buffered', age_s: 900, dist_total_m: 9541, dist_session_m: 346, rpm_peak: 3650, rpm_avg: 3561 },
  { date: '2026-11-05T20:30:00.000Z', hours: 7.7583, source: 'heartbeat', dist_total_m: 9541 },
];
const boxNow = { source: 'heartbeat', engine_running: false, fw: '1.4.0', hours: 7.7583, dist_total_m: 9541, battery: 13.4, track: [] };
const near = (a, b, tol = 1e-3) => typeof a === 'number' && Math.abs(a - b) < tol;

console.log('\n-- the hour meter: one number on every device (Jeff 11-05) --');
{
  let kv = mockKV({ hours_data: JSON.stringify(boxNow) });
  let j = await (await get(kv)).json();
  check('with no reading saved yet, the app gets Jeff\'s 11-05 reading: 15.5', j.meter_hours === 15.5, `meter_hours ${j.meter_hours}`);
  kv = mockKV({ hours_data: JSON.stringify({ ...boxNow, hours: 8.2583 }) });
  j = await (await get(kv)).json();
  check('half an hour of box time later it reads 16.0', near(j.meter_hours, 16.0), `meter_hours ${j.meter_hours}`);
  kv = mockKV({ hours_data: JSON.stringify({ ...boxNow, hours: 0.1 }) });
  j = await (await get(kv)).json();
  check('a box whose count restarted from 0 never takes hours off the meter', j.meter_hours === 15.5, `meter_hours ${j.meter_hours}`);

  const CT = 'family-ctrl-token-abcdef0123456789';
  kv = mockKV({ hours_data: JSON.stringify(boxNow), ctrl_token: CT });
  let r = await post(kv, { __cmd: 'set_hours', meter: 16.2 });
  check('setting hours with no login is refused', r.status === 401, `status ${r.status}`);
  r = await post(kv, { __cmd: 'set_hours', meter: 16.2, ctrl_token: 'wrong-token-0000000000000' });
  check('and with a wrong token', r.status === 401, `status ${r.status}`);
  r = await post(kv, { __cmd: 'set_hours', meter: 'abc', ctrl_token: CT });
  check('a reading that is not a number is refused', r.status === 400, `status ${r.status}`);
  r = await post(kv, { __cmd: 'set_hours', meter: 16.2, ctrl_token: CT });
  j = await r.json();
  check('the app\'s family login can save a meter reading', r.status === 200 && j.ok && j.meter_hours === 16.2, JSON.stringify(j));
  j = await (await get(kv)).json();
  check('and every device then reads it', j.meter_hours === 16.2, `meter_hours ${j.meter_hours}`);
  r = await post(kv, { __cmd: 'set_hours', meter: 15.9, ctrl_token: CT });
  j = await (await get(kv)).json();
  check('a LOWER reading is accepted too: the meter is the truth', j.meter_hours === 15.9, `meter_hours ${j.meter_hours}`);
  check('set_hours never lands in the telemetry', !(await kv.get('sensor_log')) && JSON.parse(await kv.get('hours_data')).meter === undefined);
  r = await post(mockKV({ ctrl_token: CT }), { __cmd: 'set_hours', meter: 16, ctrl_token: CT });
  check('with no box reading to anchor it, nothing is saved', r.status === 409, `status ${r.status}`);
  r = await post(mockKV({ hours_data: JSON.stringify(boxNow), mower_ctrl_token: TOKEN }), { __cmd: 'set_hours', meter: 16, token: TOKEN });
  check('the maintenance token works as well', r.status === 200 && (await r.json()).meter_hours === 16);
}

console.log('\n-- one-time repair of the record the buffered bug left (11-05) --');
{
  const kv = mockKV({ hours_history: JSON.stringify(REAL_HIST()), sensor_log: JSON.stringify(REAL_LOG()), hours_data: JSON.stringify(boxNow) });
  await post(kv, boxNow);
  const h = await hist(kv);
  const at = (x) => h.find((e) => near(e.hours_end, x, 1e-6));
  check('five mows on record afterwards', h.length === 5, h.map((e) => e.hours_end).join(' '));
  const m1023 = at(7.0833);
  check('the lost 10-23 mow is back', !!m1023);
  check('  dated when it ended, 10-23 21:58:25Z', m1023 && m1023.date === '2026-10-23T21:58:25.482Z', m1023 && m1023.date);
  check('  26.0 minutes', m1023 && near(m1023.hours_mow, 0.4333, 1e-4), m1023 && m1023.hours_mow);
  check('  666 m, measured from the 09-24 odometer', m1023 && m1023.dist_mow_m === 666, m1023 && m1023.dist_mow_m);
  check('  in date order', h.indexOf(m1023) === 2);
  const a = at(7.1583);
  check('the 11-03 1:55 PM stretch is its own 4.5 min, not 30.5', a && near(a.hours_mow, 0.075, 1e-4), a && a.hours_mow);
  check('the 11-03 stretch filed under 11-05 is gone from 11-05', !h.some((e) => e.date.startsWith('2026-11-05')));
  const b = at(7.7583);
  check('  and folded into the 11-03 afternoon mow it belongs to', b && near(b.hours_mow, 0.6, 1e-4) && b.segments === 2, b && JSON.stringify({ m: b.hours_mow, s: b.segments }));
  check('  which now ends 11-03 21:17:07Z', b && b.date === '2026-11-03T21:17:07.143Z', b && b.date);
  check('  925 m for that mow (579 + 346)', b && b.dist_mow_m === 925, b && b.dist_mow_m);
  check('08-12 and 09-24 get their run times (0.05 h, 1.075 h)', near(at(5.575).hours_mow, 0.05, 1e-4) && near(at(6.65).hours_mow, 1.075, 1e-4),
    `${at(5.575).hours_mow} / ${at(6.65).hours_mow}`);
  const sum = h.reduce((t, e) => t + (e.hours_mow || 0), 0);
  check('per-mow hours add up to everything the box counted since 08-11', near(sum, 7.7583 - 5.525, 1e-3), sum.toFixed(4));
  const flag = JSON.parse((await kv.get('history_repair_2026_11_05')) || 'null');
  check('what it did is kept under the flag', flag && flag.done.length >= 4 && Array.isArray(flag.skipped), JSON.stringify(flag).slice(0, 200));
  const raw = await kv.get('hours_history');
  await post(kv, boxNow);
  check('it runs once: the next upload changes nothing', (await kv.get('hours_history')) === raw);
}
{
  // The record no longer looks the way it did: touch nothing, say why.
  const odd = REAL_HIST().filter((e) => e.hours_end !== 6.65 && e.hours_end !== 7.5333);
  const kv = mockKV({ hours_history: JSON.stringify(odd), sensor_log: JSON.stringify(REAL_LOG()), hours_data: JSON.stringify(boxNow) });
  await post(kv, boxNow);
  const h = await hist(kv);
  check('a record that has changed shape gets no insert and no fold', h.length === odd.length && !h.some((e) => near(e.hours_end, 7.0833, 1e-6)), h.map((e) => e.hours_end).join(' '));
  const flag = JSON.parse(await kv.get('history_repair_2026_11_05'));
  check('  and the flag says what was skipped', flag.skipped.length >= 2, JSON.stringify(flag.skipped));
}

console.log('\n-- a recovered mow is dated by when its hours first arrived (11-05) --');
{
  // The exact 11-05 failure, replayed with the repair already done: the 7.7583 reading came in
  // on 11-03 and was missed, and a heartbeat recovers it later. It must land on 11-03.
  const before = REAL_HIST().slice(0, 4);
  before.splice(2, 0, { date: '2026-10-23T21:58:25.482Z', hours_end: 7.0833, hours_mow: 0.4333, dist_total_m: 8481 });
  before[3].hours_mow = 0.075;
  const kv = mockKV({ hours_history: JSON.stringify(before), sensor_log: JSON.stringify(REAL_LOG()),
                      hours_data: JSON.stringify(boxNow), history_repair_2026_11_05: '{"done":[]}' });
  await post(kv, boxNow);
  const h = await hist(kv);
  const last = h[h.length - 1];
  check('no 11-05 record is made for an 11-03 stretch', !h.some((e) => e.date.startsWith('2026-11-05')), h.map((e) => e.date).join(' '));
  check('  it folds into the 11-03 mow, ending 21:17:07Z', last.hours_end === 7.7583 && last.date === '2026-11-03T21:17:07.143Z' && last.segments === 2,
    JSON.stringify({ d: last.date, s: last.segments }));
}
{
  // Nothing in the log for that value: dated now, as before. A recovery is never dropped.
  const kv = mockKV({ hours_history: JSON.stringify([{ date: '2026-10-01T00:00:00.000Z', hours_end: 7 }]), history_repair_2026_11_05: '{"done":[]}' });
  await post(kv, { ...boxNow, hours: 7.3 });
  const h = await hist(kv);
  check('with no log row it is still recorded, dated now', h.length === 2 && Date.now() - Date.parse(h[1].date) < 60000, JSON.stringify(h[1]).slice(0, 120));
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
