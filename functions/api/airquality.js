// /api/airquality — US AQI for White House, TN (37188).
//
// Jeff's weather station cannot measure this at all: KTNWHITE21 is an Ambient Weather
// unit reporting temp, dewpoint, humidity, pressure, wind, rain and solar/UV only.
// Mowing throws particulates, and wildfire-smoke days are invisible from a back porch.
//
// TWO TIERS, best first — 2026-08-20, after Jeff sent the AirNow reading for the house:
//
//   1. AirNow (airnowapi.org) — the EPA's OWN service, fed by REAL GROUND MONITORS.
//      Free, 500 requests/hour, needs a key. This is a measurement.
//   2. Open-Meteo Air Quality (CAMS) — a global MODEL. Free and keyless, but modelled.
//
// They genuinely disagree, which is the whole reason for the ordering. At 07:00 CDT on
// 2026-08-20, AirNow reported **AQI 51 MODERATE (PM2.5)** for 37188 while Open-Meteo
// reported **AQI 31 GOOD** for the same hour and place. When the EPA's monitors and a
// model disagree about the air over Jeff's house, the monitors win.
//
// ⚠️ Until AIRNOW_API_KEY exists in Cloudflare Pages this endpoint silently serves the
// Open-Meteo tier, which is why the fallback is kept rather than removed. `source` in
// the response says which tier answered — do not report an AQI without reading it.
//
// NOT included: pollen. Open-Meteo's pollen model is EUROPE-ONLY — verified by querying
// White House directly on 2026-08-20 and getting null for ragweed, grass and birch.
// Google's Pollen API requires billing (the $200/mo Maps credit has expired) and Ambee is
// a 30-day trial. There is no free US pollen source worth wiring, and it is comfort data
// rather than safety data. Do not re-investigate without a new source appearing.

const ZIP = '37188';
const LAT = 36.477;
const LON = -86.66;

// US AQI breakpoints — the category names the EPA actually uses.
function aqiBand(aqi) {
  if (aqi == null || !isFinite(aqi)) return { label: '--', level: 'ok' };
  if (aqi <= 50)  return { label: 'GOOD',      level: 'ok'   };
  if (aqi <= 100) return { label: 'MODERATE',  level: 'warn' };
  if (aqi <= 150) return { label: 'SENSITIVE', level: 'warn' };  // unhealthy for sensitive groups
  if (aqi <= 200) return { label: 'UNHEALTHY', level: 'bad'  };
  if (aqi <= 300) return { label: 'VERY BAD',  level: 'bad'  };
  return { label: 'HAZARDOUS', level: 'bad' };
}

// TIER 1 — EPA AirNow, real monitors.
async function viaAirNow(key) {
  const url = 'https://www.airnowapi.org/aq/observation/zipCode/current/'
    + '?format=application/json&distance=50&zipCode=' + ZIP + '&API_KEY=' + encodeURIComponent(key);
  const r = await fetch(url, {
    headers: { 'User-Agent': 'HCC-PWA/1.0 (jeff.loewen@comcast.net)' },
    cf: { cacheTtl: 900 }
  });
  if (!r.ok) throw new Error('AirNow ' + r.status);
  const list = await r.json();
  if (!Array.isArray(list) || !list.length) throw new Error('AirNow empty');

  // AirNow returns one row per pollutant. The reported AQI is the WORST of them, and the
  // pollutant driving it is the "dominant" one — that is how the EPA defines the index.
  let worst = null;
  const by = {};
  for (const o of list) {
    const v = o && o.AQI;
    if (v == null || !isFinite(v)) continue;
    const name = (o.ParameterName || '').toUpperCase();
    by[name] = v;
    if (!worst || v > worst.AQI) worst = o;
  }
  if (!worst) throw new Error('AirNow no AQI values');

  const aqi = Math.round(worst.AQI);
  const band = aqiBand(aqi);
  return {
    ok: true,
    aqi,
    label: band.label,
    level: band.level,
    dominant: worst.ParameterName || null,
    pm2_5: by['PM2.5'] != null ? by['PM2.5'] : null,
    pm10: by['PM10'] != null ? by['PM10'] : null,
    ozone: by['O3'] != null ? by['O3'] : null,
    reportingArea: worst.ReportingArea || null,
    time: (worst.DateObserved || '').trim() + ' ' + (worst.HourObserved != null ? worst.HourObserved + ':00 ' : '') + (worst.LocalTimeZone || ''),
    measured: true,
    source: 'EPA AirNow — ground monitors'
  };
}

// TIER 2 — Open-Meteo CAMS model. Keyless, but modelled rather than measured.
async function viaOpenMeteo() {
  const url = 'https://air-quality-api.open-meteo.com/v1/air-quality'
    + '?latitude=' + LAT + '&longitude=' + LON
    + '&current=us_aqi,pm2_5,pm10,ozone,carbon_monoxide,nitrogen_dioxide'
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
    pm10:  c.pm10  == null ? null : Math.round(c.pm10 * 10) / 10,
    ozone: c.ozone == null ? null : Math.round(c.ozone),
    time:  c.time || null,
    measured: false,
    source: 'Open-Meteo CAMS — modelled, not measured'
  };
}

export async function onRequestGet({ env }) {
  const key = env && env.AIRNOW_API_KEY;
  if (key) {
    try {
      const out = await viaAirNow(key);
      return Response.json(out, { headers: { 'Cache-Control': 'public, max-age=900' } });
    } catch (e) {
      // fall through — a bad key or an AirNow outage must not blank the tile
    }
  }
  try {
    const out = await viaOpenMeteo();
    if (!key) out.note = 'AIRNOW_API_KEY not set — serving the modelled tier';
    return Response.json(out, { headers: { 'Cache-Control': 'public, max-age=900' } });
  } catch (e) {
    return Response.json({ ok: false, error: String((e && e.message) || e) }, { status: 503 });
  }
}
