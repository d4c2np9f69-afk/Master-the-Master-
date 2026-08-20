// /api/weather — proxies Weather Underground PWS KTNWHITE21 real-station data
// Falls back to Open-Meteo grid if WU is unavailable
export async function onRequestGet({ env } = {}) {
  // 2026-08-19: this key was HARDCODED here and also sat in CLAUDE.md in a PUBLIC
  // repo. Flagged as exposed on 08-16 and still exposed three days later. Prefer the
  // Cloudflare Pages env var so rotation is ONE edit in one place instead of hunting
  // three files.
  //
  // The literal below is a deliberate TEMPORARY fallback so the weather card does not
  // go dark before the env var exists — it is NOT a secret any more: it has been
  // public in git history since at least 08-16 and cannot be un-published.
  //
  // TO FINISH (Jeff): rotate at wunderground.com -> Member Settings -> My Profile ->
  // API Keys, put the NEW key in Cloudflare Pages as WU_API_KEY, then DELETE the
  // fallback below. Details: HCC-secrets/weather_underground_api_key.txt
  const WU_KEY = (env && env.WU_API_KEY) || '0e87ee079c0147a787ee079c01d7a75d';
  const WU_STATION = (env && env.WU_STATION) || 'KTNWHITE21';

  // Cardinal direction lookup (16-point compass)
  const DIRS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  function toCard(deg) {
    if (deg == null) return null;
    return DIRS[Math.round(deg / 22.5) % 16];
  }

  try {
    const r = await fetch(
      `https://api.weather.com/v2/pws/observations/current?stationId=${WU_STATION}&format=json&units=e&apiKey=${WU_KEY}&numericPrecision=decimal`,
      { headers: { 'User-Agent': 'HCC-PWA/1.0 (jeff.loewen@comcast.net)' }, cf: { cacheTtl: 300 } }
    );
    if (!r.ok) throw new Error('WU ' + r.status);
    const d = await r.json();

    // 7-DAY RAIN FROM JEFF'S OWN GAUGE. Added 2026-08-20 — Jeff: "the grass requires 1"
    // to 1.5" a week or I need to water." Daily total answers "did it rain today"; only
    // the running week answers the question he is actually asking. This is the PWS
    // dailysummary endpoint, so it is his rain gauge, not a model or a nearby airport.
    // Deliberately non-fatal: a failure here must never take down current conditions.
    let rain7d = null;
    let rain7dDays = null;
    try {
      const r7 = await fetch(
        `https://api.weather.com/v2/pws/dailysummary/7day?stationId=${WU_STATION}&format=json&units=e&apiKey=${WU_KEY}`,
        { headers: { 'User-Agent': 'HCC-PWA/1.0 (jeff.loewen@comcast.net)' }, cf: { cacheTtl: 1800 } }
      );
      if (r7.ok) {
        const d7 = await r7.json();
        const days = d7.summaries || d7.observations || [];
        if (days.length) {
          rain7dDays = days.map((o) => ({
            date: (o.obsTimeLocal || '').slice(0, 10),
            in: (o.imperial && o.imperial.precipTotal) || 0
          }));
          rain7d = Math.round(rain7dDays.reduce((a, b) => a + b.in, 0) * 100) / 100;
        }
      }
    } catch (e) { /* non-fatal by design */ }
    const obs = d?.observations?.[0];
    if (!obs) throw new Error('no observation');

    const imp = obs.imperial || {};
    const wdDeg = obs.winddir ?? null;

    return Response.json({
      // Core temps
      temp:           imp.temp    != null ? Math.round(imp.temp)    : null,
      dewpt:          imp.dewpt   != null ? Math.round(imp.dewpt)   : null,
      heatIndex:      imp.heatIndex != null ? Math.round(imp.heatIndex) : (imp.temp != null ? Math.round(imp.temp) : null),
      // Humidity + precip
      humidity:       obs.humidity != null ? Math.round(obs.humidity) : null,
      precipTotal:    imp.precipTotal != null ? Math.round(imp.precipTotal * 100) / 100 : 0,
      precipRate:     imp.precipRate  != null ? Math.round(imp.precipRate  * 100) / 100 : 0,
      // Rolling 7 days from the same gauge. Turf target is 1.0-1.5 in/week.
      rain7d,
      rain7dDays,
      // Wind
      windSpeed:      imp.windSpeed != null ? Math.round(imp.windSpeed) : null,
      windGust:       imp.windGust  != null ? Math.round(imp.windGust)  : null,
      winddir:        wdDeg,
      windDirCard:    toCard(wdDeg),
      // Pressure
      pressure:       imp.pressure != null ? Math.round(imp.pressure * 100) / 100 : null,
      // Solar
      uv:             obs.uv             != null ? Math.round(obs.uv * 10) / 10 : null,
      solarRadiation: obs.solarRadiation != null ? Math.round(obs.solarRadiation) : null,
      // Meta
      station:        obs.stationID || WU_STATION,
      neighborhood:   obs.neighborhood  || 'White House, TN',
      obsTimeLocal:   obs.obsTimeLocal  || new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
    }, { headers: { 'Cache-Control': 'public, max-age=300' } });

  } catch (e) {
    // WU unavailable — fall back to Open-Meteo so the app keeps working
    try {
      const r2 = await fetch(
        'https://api.open-meteo.com/v1/forecast' +
        '?latitude=36.477&longitude=-86.66' +
        '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure' +
        '&hourly=dewpoint_2m,apparent_temperature,windgusts_10m,precipitation' +
        '&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch' +
        '&timezone=America%2FChicago&forecast_days=1',
        { headers: { 'User-Agent': 'HCC-PWA/1.0' }, cf: { cacheTtl: 300 } }
      );
      if (!r2.ok) throw new Error('fallback ' + r2.status);
      const d2 = await r2.json();
      const c = d2.current;
      const h = d2.hourly || {};
      const now = Date.now();
      const times = h.time || [];
      let idx = 0;
      for (let i = 0; i < times.length; i++) {
        if (new Date(times[i]).getTime() <= now) idx = i;
      }
      const temp = c.temperature_2m;
      const hum  = c.relative_humidity_2m;
      const dew  = h.dewpoint_2m?.[idx] ?? (temp - ((100 - hum) / 5));
      const wdDeg = c.wind_direction_10m ?? null;
      const presHpa = c.surface_pressure ?? null;
      return Response.json({
        temp:         Math.round(temp),
        dewpt:        Math.round(dew),
        heatIndex:    Math.round(h.apparent_temperature?.[idx] ?? temp),
        humidity:     Math.round(hum),
        precipTotal:  Math.round((h.precipitation?.[idx] ?? 0) * 100) / 100,
        precipRate:   0,
        windSpeed:    Math.round(c.wind_speed_10m),
        windGust:     Math.round(h.windgusts_10m?.[idx] ?? c.wind_speed_10m),
        winddir:      wdDeg,
        windDirCard:  ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round((wdDeg??0)/22.5)%16],
        pressure:     presHpa ? Math.round(presHpa * 0.02953 * 100) / 100 : null,
        uv:           null,
        solarRadiation: null,
        station:      'Open-Meteo (WU offline)',
        neighborhood: 'White House, TN',
        obsTimeLocal: new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
      }, { headers: { 'Cache-Control': 'public, max-age=300' } });
    } catch (e2) {
      return Response.json({ error: 'unavailable: ' + e.message }, { status: 503 });
    }
  }
}
