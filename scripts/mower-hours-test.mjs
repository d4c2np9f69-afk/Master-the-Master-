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

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
