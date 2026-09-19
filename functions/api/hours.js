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
  idle_interval_s:   [60, 3600],
  sample_interval_s: [10, 120],
  track_min_step_m:  [1, 20],
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

function metresBetween(la1, lo1, la2, lo2) {
  const cosL = Math.cos(la1 * Math.PI / 180) || 1;
  const dx = (lo2 - lo1) * 111320 * cosL;
  const dy = (la2 - la1) * 111320;
  return Math.sqrt(dx * dx + dy * dy);
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
    if (k === 'track' || k === '__cmd' || k === 'secret') continue;
    entry[k] = body[k];
  }
  entry.track_points = Array.isArray(body.track) ? body.track.length : null;
  if (!entry.source) entry.source = (body.engine_running === false) ? 'heartbeat' : 'live';
  return entry;
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
        return Response.json({ log: logRaw ? JSON.parse(logRaw) : [] });
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
        const { secret, ...stored } = JSON.parse(raw);
        return Response.json({ ...stored, history, coverage_n, tracking_paused: paused, paused_since: pausedAt || null });
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
        const trackN = Array.isArray(body.track) ? body.track.length : 0;
        const reallyMoved = trackN >= 2;
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
  const isMowEnd = body.mow_ended === true || body.source === 'mow_end';
  if (isMowEnd && kv) {
    try {
      const histRaw = await kv.get(MOW_HISTORY_KEY);
      const hist = histRaw ? JSON.parse(histRaw) : [];
      const num = (v) => (typeof v === 'number' && isFinite(v)) ? v : null;
      // Prefer the body's own value, falling back to the merged/previous reading for
      // anything a given payload happens not to carry.
      const pick = (k) => num(body[k] !== undefined ? body[k] : (prev ? prev[k] : undefined));
      const hoursEnd = num(body.hours) !== null ? num(body.hours)
                     : (num(body.hours_seconds) !== null ? +(body.hours_seconds / 3600).toFixed(4) : null);
      const track = Array.isArray(body.track) && body.track.length
        ? body.track
        : (prev && Array.isArray(prev.track) && prev.track.length ? prev.track : null);
      hist.push({
        date: new Date().toISOString(),
        hours_end: hoursEnd,
        rpm_peak: pick('rpm_peak'),
        rpm_avg: pick('rpm_avg'),
        dist_session_m: pick('dist_session_m'),
        battery: pick('battery'),
        esp_temp_f: pick('esp_temp_f'),
        shock_events: pick('shock_events'),
        // That mow's own GPS breadcrumb trail, so any individual past mow's path can
        // be pulled back up later rather than only ever having the most recent one.
        track: track,
      });
      await kv.put(MOW_HISTORY_KEY, JSON.stringify(hist.slice(-MOW_HISTORY_MAX)));
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
        down.cfg = ctrl.cfg;
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
