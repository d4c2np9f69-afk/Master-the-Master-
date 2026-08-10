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
function gpsPointsFrom(body) {
  const track = [];
  if (Array.isArray(body.track)) {
    for (const p of body.track) {
      if (Array.isArray(p) && typeof p[0] === 'number' && typeof p[1] === 'number') track.push([p[0], p[1]]);
      else if (p && typeof p.lat === 'number' && typeof p.lon === 'number') track.push([p.lat, p.lon]);
    }
  }
  // Smooth the breadcrumb path (it's a real trajectory, so smoothing is valid).
  // The single current lat/lon is appended AFTER — it has no neighbours to smooth
  // against, and blending it into the path would drag the trail toward it.
  const pts = smoothGpsPath(track);
  if (typeof body.lat === 'number' && typeof body.lon === 'number' && body.has_fix !== false) {
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
    if (k === 'track' || k === '__cmd') continue;
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
      if (raw) return Response.json({ ...JSON.parse(raw), history, coverage_n, tracking_paused: paused, paused_since: pausedAt || null });
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

  const isHeartbeat = body.source === 'heartbeat' || body.engine_running === false;

  // Accumulate the yard map automatically, on every reading that carries GPS.
  // No button, no app open, no start/stop — it records from the box's first fix
  // to its last, which is the whole point.
  if (kv) {
    try {
      const pausedRaw = await kv.get(COVERAGE_PAUSED_KEY);
      if (pausedRaw !== '1') {
        const pts = gpsPointsFrom(body);
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
  }

  // The moment a heartbeat follows a real live reading is exactly "the mow just
  // ended" — log a permanent snapshot of that completed mow (hours/RPM/distance)
  // so mow-to-mow comparisons survive instead of only ever showing the latest
  // state. dist_session_m/rpm_peak/rpm_avg are already scoped to "this mow" by
  // the sensor box itself, so they're recorded as-is, not recomputed here.
  const wasLive = prev && prev.source !== 'heartbeat' && prev.engine_running !== false && typeof prev.hours === 'number';
  if (isHeartbeat && wasLive && kv) {
    try {
      const histRaw = await kv.get(MOW_HISTORY_KEY);
      const hist = histRaw ? JSON.parse(histRaw) : [];
      hist.push({
        date: new Date().toISOString(),
        hours_end: prev.hours,
        rpm_peak: (typeof prev.rpm_peak === 'number') ? prev.rpm_peak : null,
        rpm_avg: (typeof prev.rpm_avg === 'number') ? prev.rpm_avg : null,
        dist_session_m: (typeof prev.dist_session_m === 'number') ? prev.dist_session_m : null,
        battery: (typeof prev.battery === 'number') ? prev.battery : null,
        esp_temp_f: (typeof prev.esp_temp_f === 'number') ? prev.esp_temp_f : null,
        shock_events: (typeof prev.shock_events === 'number') ? prev.shock_events : null,
        // That mow's own GPS breadcrumb trail, so any individual past mow's path can
        // be pulled back up later rather than only ever having the most recent one.
        track: Array.isArray(prev.track) ? prev.track : null,
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

  return Response.json({ ok: true });
}
