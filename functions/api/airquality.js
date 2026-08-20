// /api/airquality — US AQI + particulates for White House, TN.
//
// Added 2026-08-20. Jeff's weather station cannot measure this at all: KTNWHITE21 is an
// Ambient Weather unit reporting temp, dewpoint, humidity, pressure, wind, rain and
// solar/UV only. Mowing throws particulates, and wildfire-smoke days are real and
// invisible from a back porch.
//
// Open-Meteo Air Quality API — free, no key, no account. Separate host from the forecast
// API, which is why this is its own endpoint rather than another field on
// /api/mowconditions.
//
// NOT included: pollen. Open-Meteo's pollen model is EUROPE-ONLY — verified by querying
// White House directly on 2026-08-20 and getting null for ragweed, grass and birch.
// Google's Pollen API requires billing (the $200/mo Maps credit has expired) and Ambee is
// a 30-day trial. There is no free US pollen source worth wiring, and it is comfort data
// rather than safety data. Do not re-investigate without a new source appearing.

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

export async function onRequestGet() {
  const url = 'https://air-quality-api.open-meteo.com/v1/air-quality'
    + '?latitude=36.477&longitude=-86.66'
    + '&current=us_aqi,pm2_5,pm10,ozone,carbon_monoxide,nitrogen_dioxide'
    + '&timezone=America%2FChicago';
  try {
    const r = await fetch(url, { cf: { cacheTtl: 900 } });
    if (!r.ok) throw new Error('Open-Meteo AQ ' + r.status);
    const d = await r.json();
    const c = (d && d.current) || {};
    const aqi = c.us_aqi == null ? null : Math.round(c.us_aqi);
    const band = aqiBand(aqi);
    return Response.json({
      ok: true,
      aqi,
      label: band.label,
      level: band.level,
      pm2_5: c.pm2_5 == null ? null : Math.round(c.pm2_5 * 10) / 10,
      pm10:  c.pm10  == null ? null : Math.round(c.pm10 * 10) / 10,
      ozone: c.ozone == null ? null : Math.round(c.ozone),
      co:    c.carbon_monoxide == null ? null : Math.round(c.carbon_monoxide),
      no2:   c.nitrogen_dioxide == null ? null : Math.round(c.nitrogen_dioxide * 10) / 10,
      time:  c.time || null,
      source: 'Open-Meteo Air Quality (CAMS)'
    }, { headers: { 'Cache-Control': 'public, max-age=900' } });
  } catch (e) {
    return Response.json({ ok: false, error: String((e && e.message) || e) }, { status: 503 });
  }
}
