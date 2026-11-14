// /api/hours — engine hour sensor bridge between ESP32 and the HCC app
// GET  → returns latest sensor data (from KV) or zeroed stub
// POST → stores reading from ESP32, forwards to Beehive HA webhook

// KV binding: Cloudflare Pages may expose it as HCC_KV or MOWER_KV depending
// on how the binding was named in the dashboard. Try both so either works.
function getKV(env) {
  return env.HCC_KV || env.MOWER_KV || null;
}

const MOW_HISTORY_KEY = 'hours_history';
const MOW_HISTORY_MAX = 50;

// Full raw reading log — every single POST the sensor box ever sends (live or
// heartbeat), not just mow-end summaries. Capped at 5000 readings: at the
// box's 90s live-posting interval that's ~250 engine-on hours of history,
// years of real mowing at Jeff's usage rate, while staying well under
// Cloudflare KV's 25MB per-value limit (~2-3MB at this cap).
const SENSOR_LOG_KEY = 'sensor_log';
const SENSOR_LOG_MAX = 5000;

// ---- CUMULATIVE YARD COVERAGE (accumulated SERVER-SIDE, automatically) --------
// This deliberately lives on the server, not in the phone's localStorage, because
// the whole point is that it works with NO buttons and NO app open: you can't watch
// a phone while pushing a mower. The box posts, the server merges — so a mow is
// recorded even if the app is never opened, and every device (phone, wall iPad)
// sees the identical map instead of each building its own private one.
//
// Points are snapped to a ~1 m grid (1e-5 deg) and deduplicated, so repeat passes
// over the same ground collapse to one cell and the total size is naturally bounded
// by the actual area of the yard rather than by how much you mow.
const COVERAGE_KEY = 'yard_coverage';
const COVERAGE_PAUSED_KEY = 'coverage_paused';
const COVERAGE_PAUSED_AT_KEY = 'coverage_paused_at';
const COVERAGE_MAX = 60000;         // ~60,000 m2 ≈ 15 acres — far beyond one yard
const COVERAGE_SEG_MAX_M = 40;      // longer than this = GPS dropout, don't fill in
// FOURTH PASS, 2026-11-03. How far apart a track's two most distant points must be
// before it counts as travel. See the gate below for the measurements behind 15.
const COVERAGE_MIN_SPAN_M = 15;
const GRID = 1e5;                   // 1e-5 deg ≈ 1.1 m lat / 0.9 m lon at 36.5N

// ---- REMOTE CONTROL / CONFIG CHANNEL ------------------------------------------
// The box already reads the POST response body — postJson() in the firmware pulls
// it into `resp` and prints it, it just never parsed it. Returning config and
// commands there turns every upload into a two-way exchange, which is what makes
// this thing maintainable without pulling it off the mower and holding BOOT
// through a reflash every time a number needs changing.
//
// Shape: { cfg_rev, cfg:{...}, cmds:[{id,do,args}], next_id }
//   cfg  is DESIRED state. The box applies it whenever cfg_rev differs from its
//        own, saves it to NVS, and echoes cfg_rev back — so "did it take?" is
//        answerable from the endpoint instead of assumed.
//   cmds is a one-shot queue. Exactly ONE is handed out per response (oldest
//        first) to keep the firmware trivial, and it stays queued until the box
//        echoes cmd_ack. Retry is therefore automatic, and re-running a command
//        the box already applied is harmless.
//
// The box sleeps between uploads and cannot be woken, so a command lands on its
// next post — up to IDLE_INTERVAL_S (5 min) while parked. That is a property of
// the hardware, not a bug to chase.
const CTRL_KEY = 'mower_ctrl';
const CTRL_MAX_CMDS = 8;

// Every tunable is clamped server-side. A config channel reaching hardware must
// not be able to brick it: setting vib_threshold to 50 would mean the engine is
// never detected as running again and the hour meter silently stops forever —
// the exact class of failure that already cost months here.
const CFG_LIMITS = {
  vib_threshold:     [0.005, 1.0],   // floor sits just above the measured parked
                                     // noise floor (0.003-0.005 g), so no setting
                                     // can make idle vibration read as "running"
  // How often a parked box POSTS. Jeff, 10-13: "it's running down my battery".
  // Up to 1.4.0 it was also how often a parked box SENSED, so every engine start sat
  // somewhere inside a blind window this long. That is why the ceiling came down from
  // 3600: one setting could blind the meter for an hour, and 3600 was in fact already
  // stored and waiting to ship. From 1.5.0 sensing is sample_interval_s, so this only
  // sets radio time and how long a queued command waits.
  // The 15-17 min per-mow gaps measured 2026-11-03 span a window that contains one whole
  // sleep by construction: the most a start could lose, not what it lost (#269).
  idle_interval_s:   [60, 900],
  sample_interval_s: [10, 120],
  track_min_step_m:  [1, 20],
  // 1.5.0. See TrackLimits in firmware/mower_hours_esp32/mower_logic.h. A value that stops
  // points being recorded loses map, never hours, so these only need to be sane.
  track_min_mps:     [0, 2],
  track_max_hdop:    [1, 99],
  gps_step_max_m:    [5, 200],
  // How often engine seconds are written to flash while running. This is the
  // exposure window for the EN reset button on the box: anything already flushed
  // survives a reset, anything since does not. Floor of 30 s keeps NVS wear sane.
  flush_every_s:     [30, 900],
  // 1 = never count engine hours, whatever the vibration says. The upright gate
  // handles servicing automatically; this is the manual override for the case it
  // can't see — working on the mower while it sits flat on its wheels.
  service_mode:      [0, 1],
};
const CMDS_ALLOWED = ['zero_tilt', 'clear_track', 'flush_buffer', 'reboot', 'ota'];

// Server-side commands — handled here, never sent to the box.
// `clear_coverage` deliberately did not exist while this endpoint was
// unauthenticated, because a destructive remote command would have been
// trivially abusable. It is safe now that changes require a credential, and it
// beats a trip to the Cloudflare dashboard every time the map needs resetting.
const SERVER_CMDS_ALLOWED = ['clear_coverage'];

// ---- THE HOUR METER, AS JEFF READS IT ------------------------------------------------
// Jeff, 2026-11-05: "The hours say 14.5 instead of 15.5" / "Make sure the app all matches
// the box". The app used to compute hours on each device from a baseline stored in that
// device's localStorage, so his phone, the wall iPad and a fresh browser could each show a
// different number, and none of them knew what he last read off the mower.
//
// The meter is the truth; the box is the odometer since. The calibration lives HERE, once:
//   meter_hours = meter (what Jeff read) + box hours counted since he read it
// Every device shows the same number, and a new reading from any device updates them all.
// The box is known to miss engine time on some starts (#269), so this can drift low between
// readings; a new reading from Set Hours / Log Mow puts it back on the meter.
const METER_CAL_KEY = 'meter_cal';
// Jeff's own reading, 2026-11-05T20:49:22Z (2:49 PM CT): 15.5 on the meter while the box
// held 7.7583. Used only until the first reading is saved through set_hours.
const SEED_METER_CAL = { meter: 15.5, box: 7.7583, at: '2026-11-05T20:49:22.000Z', by: 'jeff_message' };
const METER_MAX = 100000;

async function loadMeterCal(kv) {
  try {
    const raw = kv ? await kv.get(METER_CAL_KEY) : null;
    const c = raw ? JSON.parse(raw) : null;
    if (c && typeof c.meter === 'number' && typeof c.box === 'number') return c;
  } catch (_) {}
  return SEED_METER_CAL;
}

// A box with wiped flash restarts its count from 0; that must not take hours off the meter.
function meterHoursFrom(cal, boxHours) {
  if (!cal || typeof boxHours !== 'number' || !isFinite(boxHours)) return null;
  return +(cal.meter + Math.max(0, boxHours - cal.box)).toFixed(4);
}

// set_hours is a reading, not a hardware change, so it also takes the app's family-login
// ctrl_token (minted by auth.js, same check as climate.js). Kept to this one command: the
// box-control commands stay on the password / maintenance token only.
async function meterAuthorised(kv, body) {
  if (await ctrlAuthorised(kv, body)) return true;
  const ct = body && body.ctrl_token;
  if (kv && typeof ct === 'string' && ct) {
    const want = await kv.get('ctrl_token');
    if (want && want.length >= 16 && ct === want) return true;
  }
  return false;
}

// ---- ONE-TIME HISTORY REPAIR, 2026-11-05 ------------------------------------------------
// The buffered-replay bug (#267) left wrong records, all checked against sensor_log:
//   - the 10-23 mow (box 7.0833, ended 21:58:25Z) was never recorded, and its 26 minutes
//     were added to the 11-03 1:55 PM record, which showed 0.5083 h for a 4.5-minute run;
//   - the 11-03 3:17 PM stretch (box 7.7583) was recorded at 2:45 PM on 11-05, when the fix
//     went live, instead of when it ran. It started 15 min after the 2:48 PM stretch ended,
//     so under MERGE_GAP_MIN it is part of that mow;
//   - the 08-12 and 09-24 records carry no hours_mow at all.
// Every value is read from sensor_log at run time, nothing is typed in, and each step checks
// the record still looks the way it did when this was written. Runs once, on the box's next
// upload; what it did, and what it skipped and why, are kept under the flag key.
const HIST_REPAIR_FLAG = 'history_repair_2026_11_05';
const BOX_HOURS_AT_INSTALL = 5.525;   // first upload, 2026-08-11 (gps_firmware_coworker_findings)

function repairHistory(hist, log) {
  const near = (a, b) => typeof a === 'number' && Math.abs(a - b) < 1e-6;
  const isNum = (v) => typeof v === 'number' && isFinite(v);
  const seen = (h) => log.find((r) => near(r.hours, h));
  const endedAt = (r) => Date.parse(r.date) - Math.min(Math.max(+r.age_s || 0, 0), 86400) * 1000;
  const idx = (h) => hist.findIndex((e) => near(e.hours_end, h));
  const done = [], skipped = [];

  // 09-24's odometer, so the 10-23 mow's distance can be measured from it.
  const i924 = idx(6.65), r924 = seen(6.65);
  if (i924 >= 0 && r924 && !isNum(hist[i924].dist_total_m) && isNum(r924.dist_total_m)) {
    hist[i924].dist_total_m = r924.dist_total_m;
    done.push('09-24 dist_total_m ' + r924.dist_total_m);
  }

  // The missing 10-23 mow.
  const r1023 = seen(7.0833), i1103 = idx(7.1583);
  if (idx(7.0833) >= 0) skipped.push('10-23 already recorded');
  else if (!r1023) skipped.push('10-23: no sensor_log row with hours 7.0833');
  else if (i1103 < 1 || !near(hist[i1103 - 1].hours_end, 6.65)) skipped.push('10-23: the record around it has changed');
  else {
    const prev = hist[i1103 - 1];
    const dist = isNum(r1023.dist_total_m) && isNum(prev.dist_total_m) && r1023.dist_total_m >= prev.dist_total_m
      ? +(r1023.dist_total_m - prev.dist_total_m).toFixed(1) : (isNum(r1023.dist_session_m) ? r1023.dist_session_m : null);
    const v = (k) => (isNum(r1023[k]) ? r1023[k] : null);
    hist.splice(i1103, 0, {
      date: new Date(endedAt(r1023)).toISOString(),
      hours_end: 7.0833,
      hours_mow: +(7.0833 - prev.hours_end).toFixed(4),
      rpm_peak: v('rpm_peak'), rpm_avg: v('rpm_avg'),
      dist_session_m: v('dist_session_m'), dist_total_m: v('dist_total_m'), dist_mow_m: dist,
      battery: v('battery'), esp_temp_f: v('esp_temp_f'), shock_events: v('shock_events'),
      track: null,
      repaired: HIST_REPAIR_FLAG,
    });
    done.push('inserted 10-23 mow ending ' + new Date(endedAt(r1023)).toISOString());
  }

  // 11-03 1:55 PM: its own run only.
  const j1103 = idx(7.1583);
  if (j1103 >= 1 && near(hist[j1103 - 1].hours_end, 7.0833)) {
    const e = hist[j1103], p = hist[j1103 - 1];
    const run = +(e.hours_end - p.hours_end).toFixed(4);
    if (!near(e.hours_mow, run)) { done.push('11-03 1:55 PM hours_mow ' + e.hours_mow + ' -> ' + run); e.hours_mow = run; }
    if (isNum(e.dist_total_m) && isNum(p.dist_total_m) && e.dist_total_m >= p.dist_total_m) {
      const d = +(e.dist_total_m - p.dist_total_m).toFixed(1);
      if (e.dist_mow_m !== d) { done.push('11-03 1:55 PM dist_mow_m -> ' + d); e.dist_mow_m = d; }
    }
  }

  // 11-03 3:17 PM, filed under 11-05.
  const iLate = idx(7.7583), rLate = seen(7.7583);
  if (iLate < 1) skipped.push('7.7583: not in the record');
  else if (!rLate) skipped.push('7.7583: no sensor_log row');
  else if (!near(hist[iLate - 1].hours_end, 7.5333)) skipped.push('7.7583: the entry before it has changed');
  else {
    const e = hist[iLate], p = hist[iLate - 1];
    const realEnd = endedAt(rLate);
    const runMin = (e.hours_end - p.hours_end) * 60;
    const gapMin = (realEnd - Date.parse(p.date)) / 60000 - runMin;
    if (Math.abs(Date.parse(e.date) - realEnd) < 60000) skipped.push('7.7583 already dated correctly');
    else if (isFinite(gapMin) && gapMin <= 20) {
      const prevRun = isNum(p.hours_mow) ? p.hours_mow * 60 : 0;
      p.date = new Date(realEnd).toISOString();
      if (isNum(p.rpm_avg) && isNum(e.rpm_avg) && prevRun + runMin > 0) {
        p.rpm_avg = Math.round((p.rpm_avg * prevRun + e.rpm_avg * runMin) / (prevRun + runMin));
      }
      p.rpm_peak = Math.max(+p.rpm_peak || 0, +e.rpm_peak || 0) || null;
      p.hours_end = e.hours_end;
      if (isNum(p.hours_mow)) p.hours_mow = +(p.hours_mow + runMin / 60).toFixed(4);
      if (isNum(e.dist_mow_m)) p.dist_mow_m = +((+p.dist_mow_m || 0) + e.dist_mow_m).toFixed(1);
      p.dist_session_m = e.dist_session_m; p.dist_total_m = e.dist_total_m;
      p.battery = e.battery; p.esp_temp_f = e.esp_temp_f; p.shock_events = e.shock_events;
      if (Array.isArray(e.track) && e.track.length) p.track = (Array.isArray(p.track) ? p.track : []).concat(e.track);
      p.segments = (+p.segments || 1) + 1;
      hist.splice(iLate, 1);
      done.push('folded 7.7583 into the 11-03 mow, now ending ' + p.date);
    } else {
      e.date = new Date(realEnd).toISOString();
      done.push('re-dated 7.7583 to ' + e.date);
    }
  }

  // Any record still without its own run time.
  for (let i = 0; i < hist.length; i++) {
    const e = hist[i];
    if (isNum(e.hours_mow) || !isNum(e.hours_end)) continue;
    const before = i ? hist[i - 1].hours_end : BOX_HOURS_AT_INSTALL;
    if (isNum(before) && e.hours_end >= before) {
      e.hours_mow = +(e.hours_end - before).toFixed(4);
      done.push(String(e.date || '?').slice(0, 10) + ' hours_mow ' + e.hours_mow);
    }
  }
  return { hist, done, skipped };
}

function emptyCtrl() { return { cfg_rev: 0, cfg: {}, cmds: [], next_id: 1 }; }

async function loadCtrl(kv) {
  if (!kv) return emptyCtrl();
  try {
    const raw = await kv.get(CTRL_KEY);
    if (!raw) return emptyCtrl();
    const c = JSON.parse(raw);
    return {
      cfg_rev: typeof c.cfg_rev === 'number' ? c.cfg_rev : 0,
      cfg: (c.cfg && typeof c.cfg === 'object') ? c.cfg : {},
      cmds: Array.isArray(c.cmds) ? c.cmds : [],
      next_id: typeof c.next_id === 'number' ? c.next_id : 1,
    };
  } catch (_) { return emptyCtrl(); }
}

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Issuing a command or changing config needs authorisation. The sensor's own
// uploads stay unauthenticated (the box has nowhere safe to hold a secret), but
// nothing that CHANGES the box is open to whoever finds the URL.
//
// Two accepted paths, deliberately:
//   password — the family login, the same SHA-256 hash auth.js stores under
//              `auth_hash`. This is the path the app UI uses, so Jeff can re-zero
//              the tilt himself from his phone without a second credential.
//   token    — a maintenance token in KV under `mower_ctrl_token`. Exists so a
//              maintenance session can drive the box from a terminal WITHOUT
//              anyone having to hand over or type the family password. Kept in
//              C:\Users\jeffl\HCC-secrets\ on the PC, never in this repo (public).
// Either alone is sufficient. Rotating one never locks out the other, which
// matters the day one of them is compromised or forgotten.
async function ctrlAuthorised(kv, body) {
  if (!kv) return false;
  const { password, token } = body || {};
  if (typeof token === 'string' && token) {
    const want = await kv.get('mower_ctrl_token');
    // Length check first so a missing/blank KV value can never authorise.
    if (want && want.length >= 16 && token === want) return true;
  }
  if (typeof password === 'string' && password) {
    const stored = await kv.get('auth_hash');
    if (stored && (await sha256Hex(password)) === stored) return true;
  }
  return false;
}

// Clamp a requested config patch to the limits above. Returns the accepted values
// and a list of anything rejected, so a typo is reported rather than silently
// ignored — a config channel that quietly drops half your change is worse than
// no config channel.
function sanitiseCfg(patch) {
  const accepted = {}, rejected = [];
  for (const [k, v] of Object.entries(patch || {})) {
    const lim = CFG_LIMITS[k];
    if (!lim) { rejected.push({ key: k, why: 'unknown_key' }); continue; }
    const n = Number(v);
    if (!isFinite(n)) { rejected.push({ key: k, why: 'not_a_number' }); continue; }
    if (n < lim[0] || n > lim[1]) {
      rejected.push({ key: k, why: `out_of_range_${lim[0]}_${lim[1]}` });
      continue;
    }
    accepted[k] = n;
  }
  return { accepted, rejected };
}

// Clamp config on the way OUT to the box as well, not just on the way in.
//
// 2026-11-03: sanitiseCfg ran only when a patch was accepted, and the downlink then
// served whatever was in storage verbatim. So a value that was legal when it was
// stored keeps shipping forever after the limit is tightened — and one was: an
// idle_interval_s of 3600 was sitting in mower_ctrl, accepted under the old 3600
// ceiling, queued to reach the box on its next cfg_rev mismatch. That single value
// would have cost an hour of engine time on every start.
//
// Coerces into range rather than dropping the key: a box given no value keeps its
// old one, which is the setting being corrected. Unknown keys are dropped.
function clampCfgForDevice(cfg) {
  const out = {};
  for (const [k, v] of Object.entries(cfg || {})) {
    const lim = CFG_LIMITS[k];
    if (!lim) continue;
    const n = Number(v);
    if (!isFinite(n)) continue;
    out[k] = Math.min(Math.max(n, lim[0]), lim[1]);
  }
  return out;
}

function metresBetween(la1, lo1, la2, lo2) {
  const cosL = Math.cos(la1 * Math.PI / 180) || 1;
  const dx = (lo2 - lo1) * 111320 * cosL;
  const dy = (la2 - la1) * 111320;
  return Math.sqrt(dx * dx + dy * dy);
}

// How far apart a track's two most distant points are, in metres.
//
// This is the measure of "did the mower actually GO anywhere", and it is
// deliberately not path length: a parked box's drift wanders back and forth over
// the same few metres, so its accumulated path length grows without bound while
// its span stays pinned to the GPS error circle. Span cannot be inflated by
// sitting still, which is exactly the property the coverage gate needs.
//
// O(n^2) is fine — a whole mow is ~100 points, and the firmware caps the array.
function trackSpanM(track) {
  if (!Array.isArray(track) || track.length < 2) return 0;
  const pts = [];
  for (const p of track) {
    if (Array.isArray(p) && typeof p[0] === 'number' && typeof p[1] === 'number') pts.push([p[0], p[1]]);
    else if (p && typeof p.lat === 'number' && typeof p.lon === 'number') pts.push([p.lat, p.lon]);
  }
  let best = 0;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = metresBetween(pts[i][0], pts[i][1], pts[j][0], pts[j][1]);
      if (d > best) best = d;
    }
  }
  return best;
}

// ---- THE TRACK FILE (firmware 1.5.0 and up) ----------------------------------------
// The box reads GPS once a second while the engine runs, so a mow is now hundreds or
// thousands of points rather than ~100, kept in a file on its flash. The whole file comes up
// as one binary POST (?track_file=1), BEFORE the mow_end post of the same wake:
//   - Each mow's points go under their own key, mow_trk:<id>. Nothing here reads or writes
//     hours_history, hours_data or sensor_log, so it cannot race the JSON posts on them:
//     that race lost readings at ~1 s spacing on 2026-08-11. History has one writer.
//   - mow_end then attaches them. KV is eventually consistent, so that read may miss a key
//     written 2 s ago. The record then says track_pts < track_want, and the next post fills
//     it in. A file that arrives late (the POST failed) is handled by that same path.
//   - A resend is harmless: same id + same first point + no more points = already have it.
//     That covers an OK lost on the way back. Comparing the first point is what stops a
//     board with wiped NVS, whose ids restart at 1, losing its mows to old keys.
const TRACK_FILE_PARAM = 'track_file';
const TRACK_FILE_MAX_BYTES = 256 * 1024;  // the box caps its file at 128 KB
const TRK_MARKER = -2147483648;           // INT32_MIN: first word of a "new mow" record
const TRK_KEY = (id) => `mow_trk:${id}`;
const HIST_TRACK_MAX = 100;               // points kept in hours_history per mow (50 mows)
const MOW_IDS_MAX = 10;                   // ids one record will sweep up
const TRACK_RETRY_MS = 48 * 3600 * 1000;  // stop looking for points that never came

function fwUsesTrackFile(fw) {
  const m = /^(\d+)\.(\d+)/.exec(typeof fw === 'string' ? fw : '');
  return !!m && (+m[1] > 1 || (+m[1] === 1 && +m[2] >= 5));
}

// Records are 8 bytes, little-endian: latE6, lonE6, or TRK_MARKER, mowId. Returns
// [{id, pts}] or null if the length is not a whole number of records. Points before any
// marker cannot be attributed to a mow and are dropped.
function parseTrackFile(buf) {
  if (buf.byteLength % 8) return null;
  const dv = new DataView(buf);
  const byId = new Map();
  let cur = null;
  for (let o = 0; o < buf.byteLength; o += 8) {
    const a = dv.getInt32(o, true), b = dv.getInt32(o + 4, true);
    if (a === TRK_MARKER) {
      const id = b >>> 0;
      if (!byId.has(id)) byId.set(id, { id, pts: [] });
      cur = byId.get(id);
      continue;
    }
    if (!cur || (a === 0 && b === 0)) continue;
    const lat = a / 1e6, lon = b / 1e6;
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;
    cur.pts.push([lat, lon]);
  }
  return [...byId.values()];
}

// trackSpanM is O(n^2), fine for ~100 points and not for thousands. The bounding box's
// diagonal answers the same question, "did it go anywhere", to within a factor of 1.41, and
// drift can't inflate it any more than it can inflate span.
function bboxDiagM(pts) {
  if (pts.length < 2) return 0;
  let la0 = Infinity, la1 = -Infinity, lo0 = Infinity, lo1 = -Infinity;
  for (const [la, lo] of pts) {
    if (la < la0) la0 = la; if (la > la1) la1 = la;
    if (lo < lo0) lo0 = lo; if (lo > lo1) lo1 = lo;
  }
  return metresBetween(la0, lo0, la1, lo1);
}

async function readStoredTrack(kv, id) {
  try {
    const raw = await kv.get(TRK_KEY(id));
    const o = raw ? JSON.parse(raw) : null;
    return o && Array.isArray(o.pts) ? o.pts : null;
  } catch (_) { return null; }
}

async function readStoredTracks(kv, ids) {
  let pts = [];
  for (const id of ids) {
    const p = await readStoredTrack(kv, id);
    if (p) pts = pts.concat(p);
  }
  return pts;
}

// Evenly spaced, always keeping both ends. No smoothing: this is what gets drawn.
function decimateTrack(pts, max = HIST_TRACK_MAX) {
  if (pts.length <= max) return pts;
  const out = [];
  for (let i = 0; i < max; i++) out.push(pts[Math.round(i * (pts.length - 1) / (max - 1))]);
  return out;
}

// Which mow ids a record for mow `id` takes: everything since the last id on record. A mow
// cut by a reset never got a mow_end of its own, so its track travels with the next one.
function mowIdsToAttach(hist, id) {
  let top = 0;
  for (const e of hist) {
    for (const i of (Array.isArray(e.mow_ids) ? e.mow_ids : [])) if (i > top) top = i;
  }
  if (!top || id <= top) return [id];   // first on record, a resend, or a wiped board
  const ids = [];
  for (let i = Math.max(top + 1, id - MOW_IDS_MAX + 1); i <= id; i++) ids.push(i);
  return ids;
}

// True if the record changed.
function fillEntryTrack(entry, pts) {
  if (!pts.length || pts.length === entry.track_pts) return false;
  entry.track = decimateTrack(pts);
  entry.track_pts = pts.length;
  return true;
}

async function handleTrackFile(request, kv) {
  if (!kv) return Response.json({ ok: false, error: 'no_kv' }, { status: 503 });
  if (Number(request.headers.get('content-length') || 0) > TRACK_FILE_MAX_BYTES) {
    return Response.json({ ok: false, error: 'too_big' }, { status: 413 });
  }
  const buf = await request.arrayBuffer();
  if (buf.byteLength > TRACK_FILE_MAX_BYTES) {
    return Response.json({ ok: false, error: 'too_big' }, { status: 413 });
  }
  const mows = parseTrackFile(buf);
  if (!mows) return Response.json({ ok: false, error: 'not_whole_records' }, { status: 400 });

  const fresh = [];
  let newPts = 0;
  try {
    for (const m of mows) {
      if (!m.pts.length) continue;
      const have = await readStoredTrack(kv, m.id);
      const sameMow = have && have.length && have[0][0] === m.pts[0][0] && have[0][1] === m.pts[0][1];
      const haveN = sameMow ? have.length : 0;
      if (haveN >= m.pts.length) continue;
      await kv.put(TRK_KEY(m.id), JSON.stringify({ id: m.id, pts: m.pts, at: new Date().toISOString() }));
      // Only the part not already merged, so a longer resend can't count a pass twice.
      fresh.push(m.pts.slice(Math.max(haveN - 1, 0)));
      newPts += m.pts.length - haveN;
    }
  } catch (_) {
    // Not ok: the box keeps its file and sends it again.
    return Response.json({ ok: false, error: 'kv_write' }, { status: 503 });
  }

  // After the points are safe, and outside the try above: a failure here costs some map
  // shading, and must not make the box resend a file the server already holds.
  let cells = 0;
  try {
    if (fresh.length && (await kv.get(COVERAGE_PAUSED_KEY)) !== '1') {
      const covRaw = await kv.get(COVERAGE_KEY);
      let cov = covRaw ? JSON.parse(covRaw) : {};
      let touched = false;
      for (const pts of fresh) {
        if (bboxDiagM(pts) < COVERAGE_MIN_SPAN_M) continue;
        const r = mergeCoverage(cov, gpsPointsFrom({ track: pts }, false, true));
        cov = r.cells; cells += r.added; touched = true;
      }
      if (touched) await kv.put(COVERAGE_KEY, JSON.stringify(cov));
    }
  } catch (_) {}

  return Response.json({ ok: true, mows: mows.length, new_pts: newPts, new_cells: cells });
}

// Clean a GPS path before it becomes permanent coverage.
//
// Two passes, both deliberately gentle. The track is only ~95 points for a whole
// mow, so points are far apart and aggressive smoothing would round off real
// corners where the mower actually turned. This is tuned to remove receiver
// error, not to redraw the path:
//   1. Spike rejection — a point sitting far off the line between its two
//      neighbours, while those neighbours are close to each other, is a receiver
//      glitch rather than real travel. Pulled back onto the line.
//   2. A 1-2-1 weighted average — takes the jitter off without moving any point
//      more than a fraction of the local spacing, so turns survive.
// Applied BEFORE the coverage merge, so drift produces fewer bogus cells in the
// first place rather than being papered over at render time.
const SPIKE_M = 8;

function smoothGpsPath(pts) {
  if (!Array.isArray(pts) || pts.length < 3) return pts || [];
  const cleaned = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1];
    const midLa = (a[0] + c[0]) / 2, midLo = (a[1] + c[1]) / 2;
    const dev = metresBetween(midLa, midLo, b[0], b[1]);
    const span = metresBetween(a[0], a[1], c[0], c[1]);
    cleaned.push((dev > SPIKE_M && dev > span) ? [midLa, midLo] : b);
  }
  cleaned.push(pts[pts.length - 1]);

  const out = [cleaned[0]];
  for (let i = 1; i < cleaned.length - 1; i++) {
    out.push([
      (cleaned[i - 1][0] + 2 * cleaned[i][0] + cleaned[i + 1][0]) / 4,
      (cleaned[i - 1][1] + 2 * cleaned[i][1] + cleaned[i + 1][1]) / 4
    ]);
  }
  out.push(cleaned[cleaned.length - 1]);
  return out;
}

// Pull every usable GPS point out of a reading: the breadcrumb track if the box
// sent one, plus its own current lat/lon. Using both means coverage still builds
// even on firmware/readings that report only a position and no track array.
function gpsPointsFrom(body, allowBarePoint, allowTrack) {
  const track = [];
  if (allowTrack && Array.isArray(body.track)) {
    for (const p of body.track) {
      if (Array.isArray(p) && typeof p[0] === 'number' && typeof p[1] === 'number') track.push([p[0], p[1]]);
      else if (p && typeof p.lat === 'number' && typeof p.lon === 'number') track.push([p.lat, p.lon]);
    }
  }
  // Smooth the breadcrumb path (it's a real trajectory, so smoothing is valid).
  // The single current lat/lon is appended AFTER — it has no neighbours to smooth
  // against, and blending it into the path would drag the trail toward it.
  const pts = smoothGpsPath(track);

  // The bare current lat/lon is only real COVERAGE if the mower was actually moving.
  // The box reports every 5 minutes while parked, so accepting a standalone point
  // from an engine-off reading records the parking spot's GPS drift ~288x/day as if
  // it were mown grass. Measured 2026-08-11: the entire coverage map was a
  // 16.7m x 12.5m blob at the garage, and the visit-count shading made that drift the
  // most "confirmed" ground on the map. The track[] array is gated too, by the
  // caller — see there for why a parked reading's breadcrumbs are drift, not yard.
  //
  // `has_fix` must be checked for TRUTHINESS, not `!== false`: older firmware sent the
  // number 0 for "no fix", and 0 !== false is true, so no-fix 0,0 coordinates were
  // merged as a real cell. That actually happened — a literal "0,0" cell (Null Island,
  // ~8000 km away) had to be cleaned out of KV.
  if (allowBarePoint && body.has_fix &&
      typeof body.lat === 'number' && typeof body.lon === 'number' &&
      (body.lat !== 0 || body.lon !== 0)) {
    pts.push([body.lat, body.lon]);
  }
  return pts;
}

function mergeCoverage(existing, pts) {
  // Normalise: legacy format was a plain array of cell keys (presence only).
  const counts = Array.isArray(existing)
    ? existing.reduce((m, k) => { m[k] = 1; return m; }, {})
    : Object.assign({}, existing || {});

  // Cells touched by THIS reading. Deduplicated within the reading first, so a
  // slow pass (or dense interpolation) over one cell counts as ONE visit, not
  // fifty — otherwise dwell time would masquerade as confidence.
  const touched = new Set();
  const push = (la, lo) => { touched.add(Math.round(la * GRID) + ',' + Math.round(lo * GRID)); };
  for (let i = 0; i < pts.length; i++) {
    const [la, lo] = pts[i];
    push(la, lo);
    // Fill in along each leg so coverage reflects ground actually mown rather than
    // sparse 90-second breadcrumbs — but never across a long jump, which is a GPS
    // dropout, not real travel, and would paint a fake stripe across the yard.
    if (i > 0) {
      const [pla, plo] = pts[i - 1];
      const d = metresBetween(pla, plo, la, lo);
      if (d > 1 && d <= COVERAGE_SEG_MAX_M) {
        const steps = Math.min(60, Math.ceil(d));
        for (let s = 1; s < steps; s++) {
          const t = s / steps;
          push(pla + (la - pla) * t, plo + (lo - plo) * t);
        }
      }
    }
  }

  let added = 0;
  for (const k of touched) {
    if (counts[k] === undefined) added++;
    counts[k] = (counts[k] || 0) + 1;
  }

  // Over the cap, drop the LEAST-visited cells rather than the oldest. Those are
  // precisely the one-off GPS strays; the repeatedly-mown yard is what survives.
  let keys = Object.keys(counts);
  if (keys.length > COVERAGE_MAX) {
    keys.sort((a, b) => counts[b] - counts[a]);
    const trimmed = {};
    for (let i = 0; i < COVERAGE_MAX; i++) trimmed[keys[i]] = counts[keys[i]];
    return { cells: trimmed, added };
  }
  return { cells: counts, added };
}

// Record the ENTIRE raw payload — deliberately NOT a hand-picked whitelist.
//
// A whitelist silently drops data, and this firmware genuinely uses alternate key
// names for the same reading: the app itself already reads battery as any of
// battery/battery_v/voltage/voltage_v/batt/battery_parked, vibration as
// vibration/vibration_g/vibe/vibration_level, shocks as
// shock_events/shocks/impact_count, wifi as wifi_rssi/rssi, temp as
// esp_temp_f/esp_temp/temp_f, speed as speed_mph/gps_speed_mph/mph, and so on.
// A fixed whitelist would have logged null for every one of those variants and
// quietly lost the reading. Storing the raw body means every field the box sends
// is captured — including any field added to the firmware later that this code
// has never heard of.
//
// `track` is the one exclusion: it's an array of ~95+ GPS points, and repeating it
// in all 5,000 log rows would blow past Cloudflare KV's 25 MB per-value limit. It
// is NOT lost — the live track is kept in `hours_data`, each completed mow's track
// is kept in `hours_history`, and every point is merged into `yard_coverage`. The
// log records how many points came with each reading so nothing is unaccounted for.
function logEntryFrom(body) {
  const entry = { date: new Date().toISOString() };
  for (const k in body) {
    if (!Object.prototype.hasOwnProperty.call(body, k)) continue;
    // `secret` is the box's shared credential — never persist it into the log, which
    // is served (unauthenticated) via ?log=1.
    // `secret` is the box's credential; `token`/`password` are the CONTROL-CHANNEL
    // credentials (see ctrlAuthorised). 2026-10-13: a malformed maintenance POST that
    // omitted `__cmd` fell through to this telemetry path, so its `token` was stored in
    // hours_data AND written here — and both are served UNAUTHENTICATED (`/api/hours`
    // and `?log=1`). A 64-char maintenance token was public until it was cleared.
    // This is the same class as BUG 4 in docs/mower/gps_firmware_coworker_findings_2026-08-11.md.
    if (k === 'track' || k === '__cmd' || k === 'secret' ||
        k === 'token' || k === 'password') continue;
    entry[k] = body[k];
  }
  entry.track_points = Array.isArray(body.track) ? body.track.length : null;
  if (!entry.source) entry.source = (body.engine_running === false) ? 'heartbeat' : 'live';
  return entry;
}

// Redact anything credential-shaped on the way OUT. Fixes 1 and 2 stop NEW leaks, but a
// value already written to KV would keep being served until it rolled off — on 2026-10-13
// one log row held a live 64-char maintenance token and the log keeps 5,000 rows.
function redact(o) {
  if (Array.isArray(o)) return o.map(redact);
  if (o && typeof o === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(o)) {
      if (k === 'token' || k === 'password' || k === 'secret') continue;
      out[k] = redact(v);
    }
    return out;
  }
  return o;
}

export async function onRequestGet({ env, request }) {
  const kv = getKV(env);

  // ?log=1 — the full raw reading-by-reading history, fetched on demand only
  // (not part of the normal sync payload, so routine syncs stay small/fast).
  // Parsed defensively so a malformed/absent request can never 500 the endpoint.
  let q = null;
  try { q = new URL(request.url).searchParams; } catch (_) {}
  const param = (k) => (q ? q.get(k) : null);

  if (param('log') === '1') {
    if (kv) {
      try {
        const logRaw = await kv.get(SENSOR_LOG_KEY);
        return Response.json({ log: redact(logRaw ? JSON.parse(logRaw) : []) });
      } catch (_) {}
    }
    return Response.json({ log: [] });
  }

  // ?coverage=1 — the cumulative yard map. Sent on demand rather than on every
  // 60s sync (it's the biggest payload here); the normal response carries only a
  // `coverage_n` count so the app knows when to re-fetch.
  if (param('coverage') === '1') {
    if (kv) {
      try {
        const covRaw = await kv.get(COVERAGE_KEY);
        const parsed = covRaw ? JSON.parse(covRaw) : {};
        // {"latE5,lonE5": visitCount}. Legacy array form is upgraded to count 1.
        const cells = Array.isArray(parsed)
          ? parsed.reduce((m, k) => { m[k] = 1; return m; }, {})
          : parsed;
        const pausedRaw = await kv.get(COVERAGE_PAUSED_KEY);
        const pausedAt = await kv.get(COVERAGE_PAUSED_AT_KEY);
        return Response.json({
          coverage: cells,
          coverage_n: Object.keys(cells).length,
          paused: pausedRaw === '1',
          paused_since: pausedAt || null,
        });
      } catch (_) {}
    }
    return Response.json({ coverage: {}, coverage_n: 0, paused: false });
  }

  // ?track=latest or ?track=<mow id> -- a mow's full-resolution path, one array per engine
  // stretch so a line is never drawn across a gas stop. Fetched on demand: a mow can be
  // tens of KB, and the normal sync runs every 60 s.
  const trackParam = param('track');
  if (trackParam !== null) {
    let ids = [];
    if (kv) {
      try {
        if (trackParam === 'latest') {
          const histRaw = await kv.get(MOW_HISTORY_KEY);
          const hist = histRaw ? JSON.parse(histRaw) : [];
          for (let i = hist.length - 1; i >= 0 && !ids.length; i--) {
            if (Array.isArray(hist[i].mow_ids)) ids = hist[i].mow_ids;
          }
        } else if (/^\d+$/.test(trackParam)) {
          ids = [Number(trackParam)];
        }
        const tracks = [];
        for (const id of ids) {
          const pts = await readStoredTrack(kv, id);
          if (pts) tracks.push({ id, pts });
        }
        return Response.json({ ok: true, mow_ids: ids, tracks });
      } catch (_) {}
    }
    return Response.json({ ok: true, mow_ids: [], tracks: [] });
  }

  if (kv) {
    try {
      const raw = await kv.get('hours_data');
      const histRaw = await kv.get(MOW_HISTORY_KEY);
      const history = histRaw ? JSON.parse(histRaw) : [];
      const covRaw = await kv.get(COVERAGE_KEY);
      const covParsed = covRaw ? JSON.parse(covRaw) : {};
      const coverage_n = Array.isArray(covParsed) ? covParsed.length : Object.keys(covParsed).length;
      const pausedRaw = await kv.get(COVERAGE_PAUSED_KEY);
      const paused = pausedRaw === '1';
      const pausedAt = paused ? (await kv.get(COVERAGE_PAUSED_AT_KEY)) : null;
      if (raw) {
        // This endpoint is public and unauthenticated. Echoing the whole stored body
        // was publishing the box's `secret` to anyone who asked for it.
        // `cfg` goes out with `secret` (#270): a stale config on a public endpoint reads
        // like a live setting. Stripping it on OUTPUT too means the lie stops the moment
        // this deploys, rather than at the next upload.
        const { secret, cfg, ...stored } = JSON.parse(raw);
        const meter_cal = await loadMeterCal(kv);
        const meter_hours = meterHoursFrom(meter_cal, stored.hours);
        return Response.json(redact({ ...stored, history, coverage_n, tracking_paused: paused, paused_since: pausedAt || null,
                                      meter_hours, meter_cal }));
      }
      return Response.json({
        hours: 0, lastSync: null, battery: null,
        rpm_peak: null, rpm_avg: null,
        dist_total_m: null, dist_session_m: null, speed_mph: null,
        source: 'stub', history, coverage_n,
        tracking_paused: paused, paused_since: pausedAt || null
      });
    } catch (_) {}
  }
  return Response.json({
    hours: 0, lastSync: null, battery: null,
    rpm_peak: null, rpm_avg: null,
    dist_total_m: null, dist_session_m: null, speed_mph: null,
    source: 'stub', history: [], coverage_n: 0, tracking_paused: false, paused_since: null
  });
}

export async function onRequestPost({ request, env }) {
  // Binary, so it has to branch off before the JSON parse.
  let isTrackFile = false;
  try { isTrackFile = new URL(request.url).searchParams.get(TRACK_FILE_PARAM) === '1'; } catch (_) {}
  if (isTrackFile) return handleTrackFile(request, getKV(env));

  let body;
  try { body = await request.json(); } catch (_) {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const kv = getKV(env);

  // Control commands from the app (never sent by the sensor box — the `__cmd`
  // field can't collide with real telemetry). Pause is deliberately reversible
  // and non-destructive; there is intentionally NO server-side "wipe coverage"
  // command, because this endpoint is unauthenticated and a destructive one
  // would be trivially abusable. Clearing stays a local, confirmed action.
  if (body.__cmd === 'pause_tracking') {
    if (kv) {
      await kv.put(COVERAGE_PAUSED_KEY, body.value ? '1' : '0');
      // Stamp WHEN it was paused. Jeff's stated use is switching tracking off to
      // mow something that isn't his yard (a neighbour's) — the obvious failure is
      // forgetting to switch it back on and silently losing weeks of mapping, so
      // the UI escalates its warning based on this.
      await kv.put(COVERAGE_PAUSED_AT_KEY, body.value ? new Date().toISOString() : '');
    }
    return Response.json({ ok: true, paused: !!body.value });
  }

  // A meter reading from the app (Set Hours / Log Mow). See METER_CAL_KEY.
  if (body.__cmd === 'set_hours') {
    if (!kv) return Response.json({ ok: false, error: 'no_kv' }, { status: 503 });
    if (!(await meterAuthorised(kv, body))) {
      return Response.json({ ok: false, error: 'unauthorised' }, { status: 401 });
    }
    const meter = Number(body.meter);
    if (body.meter === null || body.meter === '' || !isFinite(meter) || meter < 0 || meter > METER_MAX) {
      return Response.json({ ok: false, error: 'bad_meter' }, { status: 400 });
    }
    let boxHours = null;
    try { const d = JSON.parse((await kv.get('hours_data')) || 'null'); if (d && typeof d.hours === 'number') boxHours = d.hours; } catch (_) {}
    if (boxHours === null) return Response.json({ ok: false, error: 'no_box_hours' }, { status: 409 });
    const cal = { meter: +meter.toFixed(2), box: boxHours, at: new Date().toISOString(), by: 'app' };
    await kv.put(METER_CAL_KEY, JSON.stringify(cal));
    return Response.json({ ok: true, meter_cal: cal, meter_hours: meterHoursFrom(cal, boxHours) });
  }

  // ---- Control-channel endpoints (authorised; never sent by the sensor box) ----
  // These change what the hardware does, so unlike pause_tracking above they are
  // all gated. See ctrlAuthorised for why there are two accepted credentials.
  if (body.__cmd === 'ctrl_status' || body.__cmd === 'set_cfg' ||
      body.__cmd === 'queue_cmd'   || body.__cmd === 'cancel_cmd') {
    if (!kv) return Response.json({ ok: false, error: 'no_kv' }, { status: 503 });
    if (!(await ctrlAuthorised(kv, body))) {
      return Response.json({ ok: false, error: 'unauthorised' }, { status: 401 });
    }
    const ctrl = await loadCtrl(kv);

    if (body.__cmd === 'set_cfg') {
      const { accepted, rejected } = sanitiseCfg(body.cfg);
      if (Object.keys(accepted).length) {
        ctrl.cfg = { ...ctrl.cfg, ...accepted };
        // Only bump the revision when something actually changed, so a no-op call
        // doesn't make the box rewrite NVS for nothing.
        ctrl.cfg_rev = (ctrl.cfg_rev || 0) + 1;
        await kv.put(CTRL_KEY, JSON.stringify(ctrl));
      }
      return Response.json({ ok: true, cfg_rev: ctrl.cfg_rev, cfg: ctrl.cfg, accepted, rejected });
    }

    if (body.__cmd === 'queue_cmd' && SERVER_CMDS_ALLOWED.includes(String(body.do || ''))) {
      // Acts on KV immediately rather than being queued for the box.
      if (body.do === 'clear_coverage') {
        const covRaw = await kv.get(COVERAGE_KEY);
        const had = covRaw ? Object.keys(JSON.parse(covRaw)).length : 0;
        await kv.put(COVERAGE_KEY, JSON.stringify({}));
        return Response.json({ ok: true, did: 'clear_coverage', cells_removed: had });
      }
    }

    if (body.__cmd === 'queue_cmd') {
      const doWhat = String(body.do || '');
      if (!CMDS_ALLOWED.includes(doWhat)) {
        return Response.json({ ok: false, error: 'unknown_command', allowed: CMDS_ALLOWED }, { status: 400 });
      }
      if (ctrl.cmds.length >= CTRL_MAX_CMDS) {
        return Response.json({ ok: false, error: 'queue_full', queued: ctrl.cmds }, { status: 409 });
      }
      // Collapse duplicates: re-queueing zero_tilt while one is already pending
      // should not mean the box zeroes twice.
      const dup = ctrl.cmds.find((c) => c.do === doWhat);
      if (dup) return Response.json({ ok: true, already_queued: dup, queued: ctrl.cmds });

      const cmd = { id: ctrl.next_id, do: doWhat, issued: new Date().toISOString() };
      if (doWhat === 'ota') {
        // An OTA has to be pinned to an exact artefact. No URL, no command —
        // never let the box fetch "whatever is at the default path".
        if (typeof body.url !== 'string' || !/^https:\/\//.test(body.url)) {
          return Response.json({ ok: false, error: 'ota_needs_https_url' }, { status: 400 });
        }
        cmd.args = { url: body.url, sha256: typeof body.sha256 === 'string' ? body.sha256 : null };
      }
      ctrl.next_id += 1;
      ctrl.cmds.push(cmd);
      await kv.put(CTRL_KEY, JSON.stringify(ctrl));
      return Response.json({ ok: true, queued: cmd, pending: ctrl.cmds.length });
    }

    if (body.__cmd === 'cancel_cmd') {
      const before = ctrl.cmds.length;
      ctrl.cmds = ctrl.cmds.filter((c) => c.id !== body.id && (!body.do || c.do !== body.do));
      await kv.put(CTRL_KEY, JSON.stringify(ctrl));
      return Response.json({ ok: true, removed: before - ctrl.cmds.length, queued: ctrl.cmds });
    }

    return Response.json({ ok: true, ctrl });
  }

  const isHeartbeat = body.source === 'heartbeat' || body.engine_running === false;

  // Accumulate the yard map automatically, on every reading that carries GPS.
  // No button, no app open, no start/stop — it records from the box's first fix
  // to its last, which is the whole point.
  // ONE-TIME CLEANUP, 2026-09-24. The parked-drift leak was closed on 08-12 (see the
  // gate below) but the cells it had already painted were never removed: measured
  // today, the busiest cells sat at the garage parking spot with up to 670 "visits"
  // while a real mow paints each cell once. Measured before choosing the cutoff:
  // every cell at 4+ visits (184 of them) lies within 10.6 m of the parking spot,
  // while real mown grass (443 cells at 1 visit) has a median distance of 23 m. Only
  // two mows are on record, so no real grass can reach 4. Runs once, on the box's
  // next upload, and records what it removed under the flag key.
  //
  // RUN AGAIN, 2026-11-05, under a new flag. That cleanup was right but the leak was still
  // open: a parked 1.4.0 heartbeat kept painting through the path the span gate has since
  // closed, and the same spot grew back to 95 cells at 4+ visits. Measured on the live map
  // today (819 cells, 4 mows on record): every one of the 95 lies within 9.0 m of the
  // parking spot, median 3.9 m, and beyond 12 m nothing reaches 4. This time the removed
  // cells are kept in the flag, so it can be undone.
  const COVERAGE_CLEANUP_FLAG = 'coverage_cleanup_2026_11_05';
  const COVERAGE_DRIFT_VISITS = 4;
  if (kv) {
    try {
      if (!(await kv.get(COVERAGE_CLEANUP_FLAG))) {
        const covRaw = await kv.get(COVERAGE_KEY);
        const cov = covRaw ? JSON.parse(covRaw) : {};
        let removed = 0, kept = 0;
        const cells = {};
        if (!Array.isArray(cov)) {
          for (const k of Object.keys(cov)) {
            if (cov[k] >= COVERAGE_DRIFT_VISITS) { cells[k] = cov[k]; delete cov[k]; removed++; } else kept++;
          }
          await kv.put(COVERAGE_KEY, JSON.stringify(cov));
        }
        await kv.put(COVERAGE_CLEANUP_FLAG, JSON.stringify({ at: new Date().toISOString(), removed, kept, threshold: COVERAGE_DRIFT_VISITS, cells }));
      }
    } catch (_) {}
  }

  if (kv) {
    try {
      const pausedRaw = await kv.get(COVERAGE_PAUSED_KEY);
      if (pausedRaw !== '1') {
        // Engine running (or a real mow-end payload) => a standalone lat/lon is real
        // travel. Parked heartbeat => neither the bare point NOR the track.
        //
        // FIXED 2026-08-11 (second pass): gating only the bare point left the leak
        // wide open. The firmware clears trkHavePrev on every successful upload, so
        // the movement gate is reset and the very next GPS fix ALWAYS passes it —
        // meaning every parked heartbeat ships exactly one track point sitting on the
        // parking spot, and this merged it unconditionally. Measured live: the garage
        // cell climbing a visit every 5 minutes while real grass sat at 1-2 visits.
        // Because coverage shades by visit count, the parking spot was on its way to
        // becoming the most "confirmed" ground on the whole map.
        //
        // The >1 exception is load-bearing, not a hedge: a parked box emits exactly
        // ONE point per upload. A real mow's track is dozens. So if a heartbeat turns
        // up carrying many points, that's a mow-end upload that failed on WiFi and is
        // only now being flushed — genuine yard, and dropping it would silently lose
        // a whole mow's map every time the garage WiFi hiccups at the wrong moment.
        // THIRD PASS, 2026-08-12. Gating on engine_running was still wrong: it
        // treats "the engine is on" as "the mower is moving". Jeff idled it in the
        // garage for three minutes to calibrate the vibration threshold and that
        // alone painted 6 cells over the parking spot — the same corruption as
        // before, reached by a different route. Warm-ups, maintenance runs and
        // start-up checks would all keep doing it.
        //
        // The honest signal for travel is the breadcrumb track itself. Firmware
        // only records a point after 3 m of real movement, so:
        //   stationary (parked OR idling) -> 0 or 1 point
        //   actually mowing               -> dozens
        // Requiring 2+ points therefore means coverage can only ever grow from
        // ground the mower genuinely covered, with no dependence on engine state
        // at all. The bare lat/lon is no longer merged under any circumstance —
        // a single position is a snapshot, never evidence of travel.
        // FOURTH PASS, 2026-11-03. The third pass's rule was "2+ points = travel",
        // and it rested on one stated premise: "a parked box emits exactly ONE point
        // per upload." That premise was true in August and is now FALSE. Cutting the
        // radio duty cycle stretched the idle interval from 5 to ~15 minutes, and
        // across 15 minutes of sitting still GPS drift crosses the firmware's 3 m
        // step gate several times — so a parked heartbeat now ships a handful of
        // points and sails straight through a point-count gate.
        //
        // Measured 2026-11-03 over the 4,996 parked readings in the sensor log:
        //   0 or 1 point ... 4,940 readings  (the gate holds)
        //   2+ points .....    55 readings  (the gate leaks — one shipped FIFTY,
        //                                    engine off, engine hours unchanged)
        // That is why the 09-24 cleanup did not stick: cells over the parking spot
        // were back to 163 visits by today, because mergeCoverage interpolates along
        // every leg and 50 drift points inside a 6 m circle repaint the same cells.
        //
        // The fix is to stop counting points and measure SPAN — how far apart the
        // track's two most distant points are. Drift cannot fake distance it never
        // travelled. Measured, both sides of the threshold:
        //   parked drift footprint .. every repainted cell within 6.1 m of the spot
        //                             (so span <= ~12 m)
        //   smallest real mow ....... 28.3 m span (then 33.1 m, then 63.0 m)
        // 15 m sits between them with ~2x margin either way. A buffered mow-end
        // replay — the case the third pass was protecting — spans the whole yard and
        // still passes, so no real mow's map is lost.
        const trackN = Array.isArray(body.track) ? body.track.length : 0;
        const reallyMoved = trackN >= 2 && trackSpanM(body.track) >= COVERAGE_MIN_SPAN_M;
        const pts = gpsPointsFrom(body, false, reallyMoved);
        if (pts.length > 0) {
          const covRaw = await kv.get(COVERAGE_KEY);
          const existing = covRaw ? JSON.parse(covRaw) : {};
          const merged = mergeCoverage(existing, pts);
          // Always write: even with no NEW cells, revisits raise confidence counts,
          // which is the whole mechanism by which the map sharpens over time.
          await kv.put(COVERAGE_KEY, JSON.stringify(merged.cells));
        }
      }
    } catch (_) {}
  }

  if (kv) {
    try {
      if (!(await kv.get(HIST_REPAIR_FLAG))) {
        const histRaw = await kv.get(MOW_HISTORY_KEY);
        const logRaw = await kv.get(SENSOR_LOG_KEY);
        const r = repairHistory(histRaw ? JSON.parse(histRaw) : [], logRaw ? JSON.parse(logRaw) : []);
        if (r.done.length) await kv.put(MOW_HISTORY_KEY, JSON.stringify(r.hist));
        await kv.put(HIST_REPAIR_FLAG, JSON.stringify({ at: new Date().toISOString(), done: r.done, skipped: r.skipped }));
      }
    } catch (_) {}
  }

  let prev = null;
  if (kv) {
    try {
      const prevRaw = await kv.get('hours_data');
      if (prevRaw) prev = JSON.parse(prevRaw);
    } catch (_) {}
  }

  // Heartbeats (engine off) only carry battery/wifi/temp — they don't know the
  // mow's hours, RPM, distance, or GPS track. Merging onto the last full reading
  // (instead of overwriting it) means parking the mower to charge doesn't erase
  // what it just recorded; the heartbeat only refreshes the fields it actually has.
  // 2026-10-13: strip control-channel credentials before anything is persisted.
  // hours_data is returned verbatim by the unauthenticated GET, so a credential that
  // reaches it is published. Deleting here covers BOTH the overwrite and merge paths.
  // 2026-11-04 (#270): `cfg` is scrubbed here for exactly the reason the three above are.
  // The 10-13 stray control POST (commit 3194249) omitted `__cmd`, missed the authorised
  // branch and fell through to this telemetry path carrying BOTH a token and a cfg patch.
  // The token was deleted; the cfg was not, so it merged into hours_data and the public GET
  // served `cfg: {"idle_interval_s": 3600}` as telemetry for three weeks - a value that was
  // never live (the box measured 894 s) and that cost a session a false alarm. The firmware
  // never sends `cfg` at all (it sends `cfg_rev`), so on this path the field is always junk.
  delete body.token; delete body.password; delete body.secret; delete body.cfg;
  let merged = body;
  if (isHeartbeat && prev) {
    merged = { ...prev, ...body };
    // An empty track must not wipe the stored one. The box clears its track buffer
    // once it has been delivered, so every later parked post carries `track: []` —
    // which would blank the last mow's path out of `hours_data` about five minutes
    // after the mow ended. The phone hides this (it caches the track locally), but a
    // fresh device like the wall iPad would show no track at all.
    if ((!Array.isArray(body.track) || body.track.length === 0) &&
        Array.isArray(prev.track) && prev.track.length > 0) {
      merged.track = prev.track;
    }

    // ...but the merge must NOT resurrect a dead sensor's last reading.
    // Firmware 1.4.0 deliberately omits tilt when the MPU doesn't answer, on the
    // principle that absent is honest and stale looks fine while being a lie. The
    // merge then helpfully put the old values back, which defeats the whole point:
    // caught live on the bench, where a box with no MPU attached was still serving
    // pitch and roll of -35.3 (the classic both-axes-identical I2C garbage value).
    // If the box says the sensor is down, the sensor's fields go with it.
    if (body.mpu_ok !== undefined && !body.mpu_ok) {
      for (const k of ['pitch', 'roll', 'tilt_deg', 'upright', 'tilt_ref', 'ax', 'ay', 'az']) {
        delete merged[k];
      }
    }

    // Same class, generalised. The merge exists to carry FORWARD what a heartbeat
    // can't measure — hours, RPM, distance, the track. But some fields describe
    // only the cycle that produced them, and the box sends them conditionally:
    // an ack that has been retired, the outcome of the last command, vibration
    // statistics that reset on every successful upload. Inheriting those means
    // the endpoint keeps asserting something that stopped being true — spotted
    // live as a `cmd_ack: 1` still being served long after command 1 was retired.
    // If the box didn't send it this cycle, it isn't current, so it goes.
    // `age_s` and `mow_ended` belong here for the same reason and are the two
    // that matter most. The box sends age_s only on a replayed buffered reading
    // and mow_ended only on the single upload that closes a mow — so inheriting
    // them means the endpoint permanently claims the latest reading is an hour
    // stale, or that a mow just ended, neither of which is true.
    for (const k of ['cmd_ack', 'last_cmd', 'last_cmd_ok', 'ota_fails',
                     'vib_max', 'vib_avg', 'vib_n', 'age_s', 'mow_ended']) {
      if (body[k] === undefined) delete merged[k];
    }
    // Deliberately NOT done for lat/lon on has_fix:false — a last-known position is
    // genuinely useful while parked, the app labels its staleness via has_fix, and
    // coverage reads the raw body rather than this merged object, so it can never
    // leak into the yard map.
  }

  // The moment a heartbeat follows a real live reading is exactly "the mow just
  // ended" — log a permanent snapshot of that completed mow (hours/RPM/distance)
  // so mow-to-mow comparisons survive instead of only ever showing the latest
  // state. dist_session_m/rpm_peak/rpm_avg are already scoped to "this mow" by
  // the sensor box itself, so they're recorded as-is, not recomputed here.
  // FIXED 2026-08-11 — this had NEVER recorded a single mow.
  //
  // The old trigger fired when "a heartbeat follows a live reading", reading the mow's
  // totals out of `prev`. That assumed the box posts during a mow. It does not — it
  // posts ONLY while parked, so that transition can never occur, and `hours_history`
  // sat empty for months while 6.3 km of real mowing went unrecorded. It was also
  // gated on `typeof prev.hours === 'number'`, which was never true either, because
  // the box sent `hours_seconds` and nothing ever converted it.
  //
  // The firmware now marks the one upload that carries a finished mow's totals. Read
  // from `body`, NOT `prev`: on a mow_end post it is the BODY that holds this mow's
  // rpm_peak / dist_session_m / track.
  //
  // 2026-11-03 — THE BUFFERED REPLAY LOSES THE LABEL, AND WITH IT THE MOW.
  // Jeff: "why did it lose my data ??? That's bull shit." He was right, and the box
  // was not at fault. When a mow ends out of WiFi range the firmware saves the
  // reading into a 20-slot ring buffer in RTC RAM and resends it later — that works.
  // But the buffer is a 64-byte packed struct with no room for a "this was a mow
  // end" flag, so the replay arrives as source:"buffered", mow_ended:null and
  // matched NEITHER condition above. The reading was logged, merged into coverage
  // and shown on the live card, while the mow record was dropped with no error.
  //
  // Measured over the whole sensor log: every distinct engine-hours value that ever
  // arrived "buffered" was lost — 3 for 3, 88 minutes of mowing:
  //   6.3833 (48.5 min, 09-24) · 7.0833 (26.0 min, 10-23) · 7.7583 (13.5 min, 11-03)
  // It also CORRUPTED the surviving rows: the 11-03 1:55 PM mow was recorded as
  // 0.5083 h because the lost 10-23 runtime got absorbed into the next record that
  // happened to land. Only 0.075 h of it was that mow.
  //
  // So an unlabelled reading is treated as a finished mow when it carries runtime
  // that is not in the history yet. That test is self-idempotent and needs no new
  // firmware field: once the mow is recorded, hours_end matches and every later
  // replay or heartbeat of the same value advances nothing and is ignored. The ring
  // buffer flushes several slots back-to-back with identical hours; only the first
  // can ever record.
  const MIN_LOST_MOW_H = 1 / 60;   // one minute of engine time; below that, not a mow
  const isMowEnd = body.mow_ended === true || body.source === 'mow_end';
  const mayBeLostMowEnd = !isMowEnd && (body.source === 'buffered' || isHeartbeat);
  if ((isMowEnd || mayBeLostMowEnd) && kv) {
    try {
      const histRaw = await kv.get(MOW_HISTORY_KEY);
      const hist = histRaw ? JSON.parse(histRaw) : [];
      const num = (v) => (typeof v === 'number' && isFinite(v)) ? v : null;
      // Prefer the body's own value, falling back to the merged/previous reading for
      // anything a given payload happens not to carry.
      const pick = (k) => num(body[k] !== undefined ? body[k] : (prev ? prev[k] : undefined));
      const hoursEnd = num(body.hours) !== null ? num(body.hours)
                     : (num(body.hours_seconds) !== null ? +(body.hours_seconds / 3600).toFixed(4) : null);
      // From 1.5.0 the track never rides in this post, and the fallback must stay off: it
      // would stamp the previous mow's path onto every mow.
      const usesTrackFile = fwUsesTrackFile(body.fw);
      const track = usesTrackFile ? null
        : Array.isArray(body.track) && body.track.length
          ? body.track
          : (prev && Array.isArray(prev.track) && prev.track.length ? prev.track : null);
      const distTotal = pick('dist_total_m');
      const last = hist.length ? hist[hist.length - 1] : null;
      // When the mow actually ENDED, not when the radio finally got through. A
      // buffered replay carries age_s (measured: up to 1,860 s), and stamping it
      // with the arrival time put mows up to half an hour late and poisoned the
      // merge-gap arithmetic below, which is all timestamp differences. Clamped to a
      // day so a garbage age can never date a record into the distant past.
      const ageS = Math.min(Math.max(num(body.age_s) || 0, 0), 86400);
      let readAt = Date.now() - ageS * 1000;
      // Does this reading carry engine time the history has never recorded? For a
      // labelled mow_end that is irrelevant — it records either way. For an
      // unlabelled one it is the ONLY evidence that a mow happened, and it is what
      // makes the recovery idempotent across a multi-slot buffer flush.
      const lastEnd = last ? num(last.hours_end) : null;
      const unrecordedRun = (hoursEnd !== null && lastEnd !== null) ? hoursEnd - lastEnd : null;
      const recordThis = isMowEnd || (unrecordedRun !== null && unrecordedRun >= MIN_LOST_MOW_H);
      // A recovered mow is dated by when its hours FIRST reached the server, not by the upload
      // that noticed it. 2026-11-05: the 11-03 3:17 PM stretch arrived on 11-03, was missed, and
      // was then recorded at 2:45 PM on 11-05 when the recovery went live: two days late, and
      // too late for MERGE_GAP_MIN to see it was part of the 11-03 mow.
      if (recordThis && !isMowEnd) {
        try {
          const logRaw = await kv.get(SENSOR_LOG_KEY);
          const first = (logRaw ? JSON.parse(logRaw) : []).find((r) => typeof r.hours === 'number' && Math.abs(r.hours - hoursEnd) < 1e-6);
          if (first) {
            const t = Date.parse(first.date) - Math.min(Math.max(+first.age_s || 0, 0), 86400) * 1000;
            if (isFinite(t) && t < readAt) readAt = t;
          }
        } catch (_) {}
      }
      // 2026-09-24: the box's dist_session_m restarts whenever the engine restarts, so a
      // gas/water stop made "This Mow" report only the last stretch (376 m of a 1,477 m
      // mow). The lifetime odometer does not restart — the difference from the previous
      // mow's odometer is the true distance for this mow.
      const distSinceLast = (last && num(last.dist_total_m) !== null && distTotal !== null &&
                             distTotal >= last.dist_total_m) ? +(distTotal - last.dist_total_m).toFixed(1) : null;
      // Jeff, 2026-09-24: "I stopped ... to gas up and get some water, it should not have
      // logged 2 mows." The firmware closes a mow on ANY engine stop. If this stretch
      // started within MERGE_GAP_MIN of the previous mow ending, it is the same mow:
      // fold it into that entry instead of adding a second one.
      const MERGE_GAP_MIN = 20;
      let folded = false;
      if (last && hoursEnd !== null && num(last.hours_end) !== null && last.date) {
        const runMin = Math.max(0, (hoursEnd - last.hours_end) * 60);
        const gapMin = (readAt - Date.parse(last.date)) / 60000 - runMin;
        if (isFinite(gapMin) && gapMin <= MERGE_GAP_MIN) {
          const prevRun = num(last.hours_mow) !== null ? last.hours_mow * 60 : runMin;
          const ra = pick('rpm_avg'), la = num(last.rpm_avg);
          last.date = new Date(readAt).toISOString();
          last.rpm_avg = (ra !== null && la !== null && prevRun + runMin > 0)
            ? Math.round((la * prevRun + ra * runMin) / (prevRun + runMin)) : (ra !== null ? ra : la);
          last.rpm_peak = Math.max(num(last.rpm_peak) || 0, pick('rpm_peak') || 0) || null;
          last.hours_end = hoursEnd;
          if (num(last.hours_mow) !== null) last.hours_mow = +(last.hours_mow + runMin / 60).toFixed(4);
          if (distSinceLast !== null) last.dist_mow_m = +((num(last.dist_mow_m) || 0) + distSinceLast).toFixed(1);
          last.dist_session_m = pick('dist_session_m');
          last.dist_total_m = distTotal;
          last.battery = pick('battery'); last.esp_temp_f = pick('esp_temp_f');
          last.shock_events = pick('shock_events');
          // The box only clears its track buffer after a successful upload, so if the
          // first stretch's upload failed its points are already at the front of this one.
          if (track) {
            const lt = Array.isArray(last.track) ? last.track : [];
            const same = lt.length && track.length && lt[0][0] === track[0][0] && lt[0][1] === track[0][1];
            last.track = same ? track : lt.concat(track);
          }
          last.segments = (num(last.segments) || 1) + 1;
          folded = true;
        }
      }
      if (!folded) {
        const hoursPrev = last ? num(last.hours_end) : null;
        hist.push({
          date: new Date(readAt).toISOString(),
          hours_end: hoursEnd,
          hours_mow: (hoursEnd !== null && hoursPrev !== null) ? +Math.max(0, hoursEnd - hoursPrev).toFixed(4) : null,
          rpm_peak: pick('rpm_peak'),
          rpm_avg: pick('rpm_avg'),
          dist_session_m: pick('dist_session_m'),
          dist_total_m: distTotal,
          // No earlier odometer to diff against (first mow on record): the box's own
          // per-stretch distance is exact for a single stretch.
          dist_mow_m: distSinceLast !== null ? distSinceLast : pick('dist_session_m'),
          battery: pick('battery'),
          esp_temp_f: pick('esp_temp_f'),
          shock_events: pick('shock_events'),
          // That mow's own GPS breadcrumb trail, so any individual past mow's path can
          // be pulled back up later rather than only ever having the most recent one.
          track: track,
        });
      }
      // THE one gate that makes a mow permanent. Guarding the write alone is enough
      // and is deliberate: everything above mutates a locally-parsed copy of the
      // history, so an unlabelled reading that turns out to carry no new engine time
      // simply never persists and leaves the record untouched.
      if (recordThis) {
        const mowId = num(body.mow_id);
        if (usesTrackFile && isMowEnd && mowId) {
          const entry = hist[hist.length - 1];
          const had = Array.isArray(entry.mow_ids) ? entry.mow_ids : [];
          entry.mow_ids = [...new Set(had.concat(mowIdsToAttach(hist, mowId)))];
          // A resent mow_end has already been counted.
          entry.track_want = (num(entry.track_want) || 0) + (had.includes(mowId) ? 0 : (num(body.trk_pts) || 0));
          if (num(entry.track_pts) === null) entry.track_pts = 0;
          fillEntryTrack(entry, await readStoredTracks(kv, entry.mow_ids));
          merged.track = Array.isArray(entry.track) ? entry.track : [];
        }
        await kv.put(MOW_HISTORY_KEY, JSON.stringify(hist.slice(-MOW_HISTORY_MAX)));
      } else if (histRaw) {
        // Re-parsed because the fold above has already changed `last` in the local copy, on
        // the understanding that it is thrown away. This path writes.
        const fresh = JSON.parse(histRaw);
        const tail = fresh[fresh.length - 1];
        if (tail && Array.isArray(tail.mow_ids) && (num(tail.track_pts) || 0) < (num(tail.track_want) || 0) &&
            Date.now() - Date.parse(tail.date) < TRACK_RETRY_MS) {
          if (fillEntryTrack(tail, await readStoredTracks(kv, tail.mow_ids))) {
            await kv.put(MOW_HISTORY_KEY, JSON.stringify(fresh));
            merged.track = tail.track;
          }
        }
      }
    } catch (_) {}
  }

  // Log EVERY reading — live or heartbeat — to the full raw history, not just
  // mow-end summaries. This is the complete record: every field the box
  // reports, at every point in time it reports it.
  if (kv) {
    try {
      const logRaw = await kv.get(SENSOR_LOG_KEY);
      const log = logRaw ? JSON.parse(logRaw) : [];
      log.push(logEntryFrom(body));
      await kv.put(SENSOR_LOG_KEY, JSON.stringify(log.slice(-SENSOR_LOG_MAX)));
    } catch (_) {}
  }

  const data = { ...merged, lastSync: new Date().toISOString() };
  // Deleting it from `body` above is NOT enough to clear the one already stored: the
  // heartbeat path merges `{ ...prev, ...body }`, so a `cfg` in `prev` survives a body that
  // has none. Deleting it from the object actually persisted is what evicts the ghost, and
  // it self-heals - the box posts about every 900 s, so the field is gone within ~15 min of
  // deploy with no KV dashboard trip and no one-off admin command.
  delete data.cfg;

  if (kv) {
    await kv.put('hours_data', JSON.stringify(data));
  }

  if (env.HA_WEBHOOK_BASE) {
    try {
      await fetch(`${env.HA_WEBHOOK_BASE}/api/webhook/hcc-mower-sensor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(8000)
      });
    } catch (_) {}
  }

  // ---- Downlink: hand the box its config and at most one pending command -------
  // This is the reply to the box's own upload, so it costs no extra radio time and
  // no extra battery — the connection is already open.
  let down = { ok: true };
  if (kv) {
    try {
      const ctrl = await loadCtrl(kv);
      let dirty = false;

      // Process the ack FIRST, so a command the box just confirmed is never handed
      // back to it on this same response.
      if (typeof body.cmd_ack === 'number') {
        const before = ctrl.cmds.length;
        ctrl.cmds = ctrl.cmds.filter((c) => c.id !== body.cmd_ack);
        if (ctrl.cmds.length !== before) dirty = true;
      }
      if (dirty) await kv.put(CTRL_KEY, JSON.stringify(ctrl));

      down.cfg_rev = ctrl.cfg_rev || 0;
      // Only ship the config body when the box is actually behind. Steady state is
      // a two-field reply the firmware can parse without a JSON library.
      if ((body.cfg_rev || 0) !== (ctrl.cfg_rev || 0) && Object.keys(ctrl.cfg).length) {
        // Re-clamped on serve — see clampCfgForDevice. A value stored under an older,
        // looser limit must never reach the hardware.
        down.cfg = clampCfgForDevice(ctrl.cfg);
      }
      // Oldest first, exactly one. It stays queued until acked, so a box that dies
      // mid-command simply gets it again on its next successful upload.
      if (ctrl.cmds.length) {
        const c = ctrl.cmds[0];
        down.cmd = c.args ? { id: c.id, do: c.do, args: c.args } : { id: c.id, do: c.do };
      }
    } catch (_) { /* a control-channel fault must never fail the telemetry POST */ }
  }
  return Response.json(down);
}
