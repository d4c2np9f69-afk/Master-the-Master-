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
  await post(kv, parked({ engine_running: true, source: 'live', lat: 36.4780, lon: -86.6610, track: [] }));
  check('engine running merges the bare lat/lon', (await nCells(kv)) === 1,
    `got ${await nCells(kv)} cells`);
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

console.log('\n-- control channel: auth --');
const TOKEN = 'test-maintenance-token-0123456789';
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

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
