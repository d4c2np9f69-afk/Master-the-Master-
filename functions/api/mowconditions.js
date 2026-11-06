// /api/mowconditions — Open-Meteo data for the mowing-conditions tiles.
// Server-side so the browser never has to reach api.open-meteo.com directly — that
// direct call was flaking out and leaving those tiles blank. Same pattern as
// /api/weather + /api/forecast.
//
// 2026-08-20 — added REAL soil moisture and a 15-minute rain nowcast.
// Jeff's PWS (KTNWHITE21, an Ambient Weather unit) measures temp, dewpoint, humidity,
// pressure, wind, rain and solar/UV — it has no soil probe, so "Soil Firmness" was being
// inferred from precipitation risk and was showing the exact same value as "Soil
// Condition" beside it. Open-Meteo returns modelled soil moisture at real depths, free
// and keyless, so the tile can show a measurement instead of a restatement.
//
// minutely_15 answers the question hourly data cannot: "can I mow in the next hour."
export async function onRequestGet() {
  const url = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=36.477&longitude=-86.66'
    + '&current=temperature_2m,relative_humidity_2m'
    + '&hourly=precipitation_probability,precipitation,soil_temperature_0cm,'
    +   'soil_temperature_6cm,soil_moisture_0_to_1cm,soil_moisture_3_to_9cm,weathercode'
    + '&minutely_15=precipitation,precipitation_probability'
    + '&forecast_minutely_15=8'          // next 2 hours in 15-minute steps
    + '&temperature_unit=fahrenheit&precipitation_unit=inch'
    + '&past_days=0&forecast_days=3&timezone=America%2FChicago';
  try {
    const r = await fetch(url, { cf: { cacheTtl: 600 } });
    if (!r.ok) throw new Error('Open-Meteo ' + r.status);
    const d = await r.json();
    if (!d || !d.hourly || !d.current) throw new Error('bad shape');
    // Returned as-is — the app already reads .current / .hourly / .minutely_15.
    return Response.json(d, { headers: { 'Cache-Control': 'public, max-age=600' } });
  } catch (e) {
    return Response.json({ error: String((e && e.message) || e) }, { status: 503 });
  }
}
