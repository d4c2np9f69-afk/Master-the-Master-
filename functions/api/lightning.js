// /api/lightning — REAL observed lightning near White House, TN.
//
// WHY THIS EXISTS (2026-08-20). The app's Lightning card was never lightning data.
// It read Open-Meteo's hourly weathercode and showed RISK only if code 95/96/99
// appeared in the forecast. On 2026-08-20 at 05:59 CT Jeff had thunder and lightning
// over the house while the model was forecasting codes 53/63/61 — drizzle and plain
// rain — so the card read NONE during an active thunderstorm with a Severe
// Thunderstorm Watch in force. A forecast was being displayed as an observation.
//
// This endpoint reports what was actually OBSERVED, from two official free sources
// that need no API key:
//   1. NOAA/FAA METAR (aviationweather.gov) — trained sensors + human augmentation.
//      Present weather carries TS / VCTS; the remarks section carries LTG with a
//      proximity qualifier (OHD overhead, VC vicinity, DSNT distant) and often a
//      direction. This is a measurement, not a model.
//   2. NWS active alerts (api.weather.gov) — watches and warnings in force.
//
// KNOWN LIMIT, stated rather than hidden: the two closest fields to the house,
// K1M5 Portland (12.8 mi) and KXNX Gallatin (15.1 mi), are small AWOS sites that do
// not report thunderstorms. The nearest station that actually reports TS is KBNA at
// 25 mi. So this answers "is there lightning in the area" well and "is it directly
// over the yard" only approximately. The exact-distance upgrade is the Blitzortung
// HA integration (real strike distance + azimuth, seconds of latency, no account) —
// see docs/weather/lightning_and_station_gaps_2026-08-20.md.

const HOME_LAT = 36.473;
const HOME_LON = -86.6515;
const BOX = 1.1;            // ~75 mi of latitude either side
const STALE_MIN = 100;      // METARs are hourly + SPECI; older than this is not "NONE"

function miles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = p2 - p1;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const h =
    Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Split a raw METAR into body (present weather) and remarks — LTG lives in remarks,
// TS lives in the body. Checking the whole string for "TS" false-positives on station
// identifiers and on TSNO ("thunderstorm information not available").
function parseMetar(raw) {
  const s = String(raw || '');
  const i = s.indexOf(' RMK');
  const body = i >= 0 ? s.slice(0, i) : s;
  const rmk = i >= 0 ? s.slice(i) : '';

  // TSNO means the sensor CANNOT report thunderstorms — the opposite of a TS report.
  const bodyNoTsno = body.replace(/\bTSNO\b/g, '');
  const hasTS = /(^|\s)(\+|-)?(VC)?TS(RA|SN|GR|GS|PL)?(\s|$)/.test(bodyNoTsno);
  const vicinityOnly = /(^|\s)VCTS(\s|$)/.test(bodyNoTsno) && !/(^|\s)(\+|-)?TS(RA|SN|GR|GS|PL)?(\s|$)/.test(bodyNoTsno);

  const ltgMatch = rmk.match(/\bLTG[A-Z]*\b/);
  const hasLTG = !!ltgMatch && !/\bLTGNO\b/.test(rmk);
  // Proximity words apply to the LTG group that precedes them.
  const ltgDistant = hasLTG && /\bLTG[A-Z]*\s+DSNT\b/.test(rmk);
  const ltgOverhead = hasLTG && /\bLTG[A-Z]*\s+(OHD|OVHD)\b/.test(rmk);

  // Hail — the PWS cannot see this at all and it is the one that costs money.
  const hail = /(^|\s)(\+|-)?(VC)?(TS)?(GR|GS)(\s|$)/.test(bodyNoTsno);

  return { hasTS, vicinityOnly, hasLTG, ltgDistant, ltgOverhead, hail, rmk };
}

export async function onRequestGet() {
  const out = {
    ok: true,
    status: 'NONE',
    level: 'ok',
    detail: '',
    observedBy: [],
    nearestMi: null,
    hail: false,
    alert: null,
    source: 'NOAA/FAA METAR + NWS alerts',
    stale: false,
    checked: new Date().toISOString()
  };

  // ---- 1. observations -----------------------------------------------------
  try {
    const bbox = [
      (HOME_LAT - BOX).toFixed(2),
      (HOME_LON - BOX * 1.25).toFixed(2),
      (HOME_LAT + BOX).toFixed(2),
      (HOME_LON + BOX * 1.25).toFixed(2)
    ].join(',');

    const r = await fetch(
      `https://aviationweather.gov/api/data/metar?bbox=${bbox}&format=json`,
      {
        headers: { 'User-Agent': 'HCC-PWA/1.0 (jeff.loewen@comcast.net)' },
        cf: { cacheTtl: 120 }
      }
    );
    if (!r.ok) throw new Error('METAR ' + r.status);
    const list = await r.json();
    if (!Array.isArray(list)) throw new Error('METAR shape');

    const now = Date.now();
    let newestAgeMin = Infinity;
    const hits = [];

    for (const m of list) {
      if (m == null || m.lat == null || m.lon == null) continue;
      const dist = miles(HOME_LAT, HOME_LON, m.lat, m.lon);
      const t = m.reportTime ? Date.parse(m.reportTime.replace(' ', 'T') + (/[Zz]$/.test(m.reportTime) ? '' : 'Z')) : NaN;
      const ageMin = isFinite(t) ? (now - t) / 60000 : Infinity;
      if (ageMin < newestAgeMin) newestAgeMin = ageMin;
      if (ageMin > STALE_MIN) continue;

      const p = parseMetar(m.rawOb);
      if (p.hail) out.hail = true;
      if (!p.hasTS && !p.hasLTG) continue;

      hits.push({
        id: m.icaoId || '',
        name: (m.name || '').split(',')[0],
        mi: Math.round(dist),
        ts: p.hasTS,
        vicinityOnly: p.vicinityOnly,
        ltg: p.hasLTG,
        overhead: p.ltgOverhead,
        distant: p.ltgDistant,
        ageMin: Math.round(ageMin),
        wx: m.wxString || ''
      });
    }

    hits.sort((a, b) => a.mi - b.mi);
    out.observedBy = hits.slice(0, 5);
    if (hits.length) out.nearestMi = hits[0].mi;

    if (newestAgeMin > STALE_MIN) {
      out.stale = true;
      out.status = 'NO DATA';
      out.level = 'warn';
      out.detail = 'No current observations — newest report is ' + Math.round(newestAgeMin) + ' min old';
      return Response.json(out, { headers: { 'Cache-Control': 'public, max-age=120' } });
    }

    // Closest confirmed lightning/thunder decides the verdict. "Overhead" from any
    // station is treated as close because the observer is naming their own position.
    const close = hits.filter((h) => (h.ts && !h.vicinityOnly) || (h.ltg && !h.distant));
    const near = hits.filter((h) => h.ts || (h.ltg && h.distant));

    if (close.length && (close[0].mi <= 30 || close.some((h) => h.overhead))) {
      const h = close[0];
      out.status = 'OVERHEAD';
      out.level = 'bad';
      out.detail =
        'Thunderstorm observed at ' + h.name + ' (' + h.id + '), ' + h.mi + ' mi' +
        (h.overhead ? ' — lightning reported OVERHEAD' : '') +
        ' · ' + h.ageMin + ' min ago';
    } else if (close.length) {
      const h = close[0];
      out.status = 'CLOSE';
      out.level = 'bad';
      out.detail = 'Lightning observed ' + h.mi + ' mi away at ' + h.name + ' · ' + h.ageMin + ' min ago';
    } else if (near.length) {
      const h = near[0];
      out.status = 'NEARBY';
      out.level = 'warn';
      out.detail =
        (h.distant ? 'Distant lightning' : 'Thunderstorm in the vicinity') +
        ' — ' + h.name + ', ' + h.mi + ' mi · ' + h.ageMin + ' min ago';
    } else {
      out.status = 'NONE';
      out.level = 'ok';
      out.detail = 'No thunder or lightning reported within ~75 mi';
    }
  } catch (e) {
    out.ok = false;
    out.status = 'NO DATA';
    out.level = 'warn';
    out.detail = 'Observation feed unavailable (' + (e && e.message ? e.message : 'error') + ')';
  }

  // ---- 2. NWS watches/warnings in force -----------------------------------
  try {
    const ra = await fetch(
      `https://api.weather.gov/alerts/active?point=${HOME_LAT}%2C${HOME_LON}`,
      {
        headers: {
          'User-Agent': 'HCC-PWA/1.0 (jeff.loewen@comcast.net)',
          Accept: 'application/geo+json'
        },
        cf: { cacheTtl: 180 }
      }
    );
    if (ra.ok) {
      const da = await ra.json();
      const storm = (da.features || [])
        .map((f) => f.properties || {})
        .find((p) => /thunderstorm|tornado|hail/i.test(p.event || ''));
      if (storm) {
        out.alert = { event: storm.event, expires: storm.expires || '' };
        // A warning outranks a quiet observation — the storm may simply not have
        // reached a reporting field yet.
        if (out.status === 'NONE' && /warning/i.test(storm.event)) {
          out.status = 'WARNING';
          out.level = 'bad';
          out.detail = storm.event + ' in force';
        } else if (out.status === 'NONE') {
          out.status = 'WATCH';
          out.level = 'warn';
          out.detail = storm.event + ' in force — no strikes reported nearby yet';
        }
      }
    }
  } catch (e) {
    /* alerts are supplementary — never let them break the observation result */
  }

  return Response.json(out, { headers: { 'Cache-Control': 'public, max-age=120' } });
}
