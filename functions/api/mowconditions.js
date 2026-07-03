// /api/mowconditions — hourly Open-Meteo data for the mowing-conditions tiles
// (rain risk, soil temp, dew-on-grass, rain 24-48h, lightning). Server-side so the
// browser never has to reach api.open-meteo.com directly — that direct call was
// flaking out and leaving those tiles blank. Same pattern as /api/weather + /api/forecast.
export async function onRequestGet() {
  const url = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=36.477&longitude=-86.66'
    + '&current=temperature_2m,relative_humidity_2m'
    + '&hourly=precipitation_probability,precipitation,soil_temperature_0cm,weathercode'
    + '&temperature_unit=fahrenheit&precipitation_unit=inch'
    + '&past_days=0&forecast_days=3&timezone=America%2FChicago';
  try {
    const r = await fetch(url, { cf: { cacheTtl: 600 } });
    if (!r.ok) throw new Error('Open-Meteo ' + r.status);
    const d = await r.json();
    if (!d || !d.hourly || !d.current) throw new Error('bad shape');
    // Return the Open-Meteo JSON as-is (the app already knows how to read .current / .hourly).
    return Response.json(d, { headers: { 'Cache-Control': 'public, max-age=600' } });
  } catch (e) {
    return Response.json({ error: String(e && e.message || e) }, { status: 503 });
  }
}
