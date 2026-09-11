// /api/airquality — US AQI for White House, TN (37188), from REAL EPA MONITORS.
//
// Jeff's weather station cannot measure this at all: KTNWHITE21 is an Ambient Weather
// unit reporting temp, dewpoint, humidity, pressure, wind, rain and solar/UV only.
//
// TIERS, best first:
//   1. airnowgovapi.com site feed — the endpoint airnow.gov's own page calls. KEYLESS.
//      Returns 24 HOURS of hourly AQI + concentration per pollutant for a named EPA
//      monitor. This is measured, not modelled, and it needs no account.
//   2. Open-Meteo Air Quality (CAMS) — a global MODEL. Keyless, but modelled.
//
// They genuinely disagree, which is why the order matters. At 07:00 CDT 2026-08-20 the
// Hendersonville monitor read **AQI 51 MODERATE (PM2.5)** while Open-Meteo read
// **AQI 31 GOOD** for the same hour. When EPA monitors and a model disagree about the air
// over Jeff's house, the monitors win.
//
// SITES, nearest first. Jeff is at 36.477 / -86.660.
//   471650007  HVILLE   Hendersonville, Sumner County  36.2975 / -86.6525  ~12.4 mi S
//   470370023  Nashville, Davidson County                                  ~25 mi SSW
// Sumner is Jeff's own county. Both were discovered by watching what airnow.gov requests
// for this location — do not swap in a Nashville-only site, that was the original
// complaint about lightning and it applies here too.
//
// NOT included: pollen. Open-Meteo's pollen model is EUROPE-ONLY — verified by querying
// White House directly on 2026-08-20 and getting null for ragweed, grass and birch.
// Google's Pollen API requires billing (the $200/mo Maps credit has expired) and Ambee is
// a 30-day trial. Do not re-investigate without a new source appearing.

const SITES = [
  { id: '471650007', name: 'Hendersonville', mi: 12.4 },
  { id: '470370023', name: 'Nashville', mi: 25 },
];
const LAT = 36.477;
const LON = -86.66;
const MISSING = -999;

function aqiBand(aqi) {
  if (aqi == null || !isFinite(aqi)) return { label: '--', level: 'ok' };
  if (aqi <= 50)  return { label: 'GOOD',      level: 'ok'   };
  if (aqi <= 100) return { label: 'MODERATE',  level: 'warn' };
  if (aqi <= 150) return { label: 'SENSITIVE', level: 'warn' };
  if (aqi <= 200) return { label: 'UNHEALTHY', level: 'bad'  };
  if (aqi <= 300) return { label: 'VERY BAD',  level: 'bad'  };
  return { label: 'HAZARDOUS', level: 'bad' };
}

// Tidy AirNow's parameter names into something a UI can print.
function shortParam(p) {
  const s = String(p || '').toUpperCase();
  if (s.indexOf('PM2.5') === 0) return 'PM2.5';
  if (s.indexOf('PM10') === 0) return 'PM10';
  if (s.indexOf('O3') === 0) return 'Ozone';
  if (s.indexOf('NO2') === 0) return 'NO2';
  if (s.indexOf('SO2') === 0) return 'SO2';
  if (s.indexOf('CO') === 0) return 'CO';
  return String(p || '').split(' ')[0];
}

async function viaAirNowSite(site) {
  const r = await fetch('https://airnowgovapi.com/v2/andata/Sites/' + site.id + '.json', {
    headers: { 'User-Agent': 'HCC-PWA/1.0 (jeff.loewen@comcast.net)' },
    cf: { cacheTtl: 900 }
  });
  if (!r.ok) throw new Error('AirNow site ' + r.status);
  const d = await r.json();
  const mons = (d && d.monitors) || [];
  const times = (d && d.utcDateTimes) || [];
  if (!mons.length || !times.length) throw new Error('AirNow site empty');

  // Hourly combined AQI = the WORST pollutant that hour. That is how the EPA defines the
  // index, and it is what makes a single 24-hour line honest.
  const n = times.length;
  const series = new Array(n).fill(null);
  const perParam = {};
  let latestIdx = -1;

  for (const m of mons) {
    const key = shortParam(m.parameterName);
    const aqi = m.aqi || [];
    perParam[key] = { aqi: [], conc: [], unit: m.concUnit || '' };
    for (let i = 0; i < n; i++) {
      const v = aqi[i];
      const ok = v != null && isFinite(v) && v !== MISSING;
      perParam[key].aqi.push(ok ? Math.round(v) : null);
      const c = (m.conc || [])[i];
      perParam[key].conc.push(c != null && isFinite(c) && c !== MISSING ? c : null);
      if (ok) {
        if (series[i] == null || v > series[i]) series[i] = Math.round(v);
        if (i > latestIdx) latestIdx = i;
      }
    }
  }
  if (latestIdx < 0) throw new Error('AirNow site all-missing');

  // Dominant pollutant at the latest hour with data.
  let dominant = null;
  let aqi = null;
  for (const k of Object.keys(perParam)) {
    const v = perParam[k].aqi[latestIdx];
    if (v == null) continue;
    if (aqi == null || v > aqi) { aqi = v; dominant = k; }
  }
  const band = aqiBand(aqi);

  return {
    ok: true,
    aqi,
    label: band.label,
    level: band.level,
    dominant,
    pm2_5: perParam['PM2.5'] ? perParam['PM2.5'].conc[latestIdx] : null,
    ozone: perParam['Ozone'] ? perParam['Ozone'].conc[latestIdx] : null,
    site: d.siteName || site.name,
    siteMi: site.mi,
    time: times[latestIdx] ? times[latestIdx] + 'Z' : null,
    utcOffset: d.utcOffset == null ? -5 : d.utcOffset,
    // for the chart
    hours: times,
    series,
    perParam,
    measured: true,
    source: 'EPA AirNow — ' + (d.siteName || site.name) + ' monitor, ' + site.mi + ' mi'
  };
}

async function viaOpenMeteo() {
  const url = 'https://air-quality-api.open-meteo.com/v1/air-quality'
    + '?latitude=' + LAT + '&longitude=' + LON
    + '&current=us_aqi,pm2_5,pm10,ozone'
    + '&hourly=us_aqi&past_days=1&forecast_days=1'
    + '&timezone=America%2FChicago';
  const r = await fetch(url, { cf: { cacheTtl: 900 } });
  if (!r.ok) throw new Error('Open-Meteo AQ ' + r.status);
  const d = await r.json();
  const c = (d && d.current) || {};
  const aqi = c.us_aqi == null ? null : Math.round(c.us_aqi);
  if (aqi == null) throw new Error('Open-Meteo no AQI');
  const band = aqiBand(aqi);
  return {
    ok: true,
    aqi,
    label: band.label,
    level: band.level,
    dominant: null,
    pm2_5: c.pm2_5 == null ? null : Math.round(c.pm2_5 * 10) / 10,
    ozone: c.ozone == null ? null : Math.round(c.ozone),
    site: null,
    time: c.time || null,
    hours: (d.hourly && d.hourly.time) || [],
    series: ((d.hourly && d.hourly.us_aqi) || []).map(v => (v == null ? null : Math.round(v))),
    perParam: {},
    measured: false,
    source: 'Open-Meteo CAMS — modelled, not measured'
  };
}

export async function onRequestGet() {
  for (const site of SITES) {
    try {
      const out = await viaAirNowSite(site);
      return Response.json(out, { headers: { 'Cache-Control': 'public, max-age=900' } });
    } catch (e) {
      // try the next monitor, then the model
    }
  }
  try {
    const out = await viaOpenMeteo();
    out.note = 'EPA monitors unreachable — serving the modelled tier';
    return Response.json(out, { headers: { 'Cache-Control': 'public, max-age=900' } });
  } catch (e) {
    return Response.json({ ok: false, error: String((e && e.message) || e) }, { status: 503 });
  }
}
