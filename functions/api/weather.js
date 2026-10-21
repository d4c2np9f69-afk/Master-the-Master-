// /api/weather — proxies Weather Underground PWS KTNWHITE21 real-station data
// Falls back to Open-Meteo grid if WU is unavailable
export async function onRequestGet({ env } = {}) {
  // 🔴 2026-09-16: THE HARDCODED FALLBACK KEY IS GONE. It should have been removed on
  // 2026-08-19 and was not — the comment that used to sit here even said "DELETE the
  // fallback below" and then nobody did, for 28 days.
  //
  // What was actually true, measured tonight: the literal here was BYTE-IDENTICAL to the
  // key in HCC-secrets, and that key returned HTTP 200 from api.weather.com at 01:48.
  // So a LIVE key was sitting in a public repo — not a dead one, as the old comment's
  // "it is NOT a secret any more" implied. Removing it from CLAUDE.md on 08-19 achieved
  // nothing while this copy remained.
  //
  // Safe to delete: WU_API_KEY is SET on the toro1 production Pages project (verified via
  // the Cloudflare API, names read, values never read), so the live card reads the env var
  // and never reached this literal.
  //
  // ⚠️ STILL OWED, and only Jeff can do it: the key is in the PUBLIC git history from at
  // least 08-16 and cannot be un-published. Rotate at wunderground.com → Member Settings →
  // My Profile → API Keys, then update WU_API_KEY in Cloudflare Pages. Deleting this line
  // stops NEW exposure; it does not undo the old one.
  const WU_KEY = env && env.WU_API_KEY;
  const WU_STATION = (env && env.WU_STATION) || 'KTNWHITE21';
  // No key configured is a real failure, not a silent fall-through to Open-Meteo that
  // would hide a broken env var for weeks.
  if (!WU_KEY) {
    return Response.json(
      { ok: false, error: 'wu_key_not_configured',
        hint: 'Set WU_API_KEY in the Cloudflare Pages project' },
      { status: 500 });
  }

  // Cardinal direction lookup (16-point compass)
  const DIRS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  function toCard(deg) {
    if (deg == null) return null;
    return DIRS[Math.round(deg / 22.5) % 16];
  }

  // A DEAD SENSOR DOES NOT REPORT "NOTHING" - IT REPORTS A SENTINEL.
  // Found live 2026-10-20: the outdoor array stopped transmitting to the console, and
  // Weather Underground passed the station's raw -32768 straight through. Every field
  // here was guarded with `!= null`, which accepts -32768 happily BECAUSE IT IS A NUMBER.
  // So /api/weather served `humidity: -32768` and `winddir: -32768`, and toCard() turned
  // that into a confident `windDirCard: "N"` - a wind direction that does not exist.
  // The app would have shown -32768% humidity next to a fake N wind.
  // NULL IS THE HONEST ANSWER, and every consumer already handles null (temp, dewpt,
  // windSpeed and uv were correctly null in the same payload).
  const SENTINELS = new Set([-32768, 32767, -9999, 9999, -999]);
  const live = v => (typeof v === 'number' && isFinite(v) && !SENTINELS.has(v)) ? v : null;
  const num = (v, f) => { const x = live(v); return x == null ? null : (f ? f(x) : Math.round(x)); };

  // -- THE OUTDOOR ARRAY CAN DIE WHILE WU STILL RETURNS HTTP 200 --------------
  // Found live 2026-10-20 21:20 by reading the WEATHER tab the way Jeff reads it:
  // 15 fields showing "--". The Open-Meteo fallback at the bottom of this file has
  // existed for months, but it only ran when the WU fetch THREW. With the array
  // dark, WU answered 200 with a complete-looking observation whose every outdoor
  // field was the -32768 sentinel; the sentinel guard above correctly turned those
  // into null; and the function returned a successful 200 with temp, humidity,
  // wind, dewpoint and uv all null. So the fallback never fired and the app went
  // blank with a working, free, key-less data source one call away.
  // A station that reports nothing measurable IS unavailable, whatever its HTTP code.
  async function openMeteo() {
    const r2 = await fetch(
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=36.477&longitude=-86.66' +
      '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure' +
      '&hourly=dewpoint_2m,apparent_temperature,windgusts_10m,precipitation,uv_index' +
      '&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch' +
      '&timezone=America%2FChicago&forecast_days=1',
      { headers: { 'User-Agent': 'HCC-PWA/1.0' }, cf: { cacheTtl: 300 } }
    );
    if (!r2.ok) throw new Error('fallback ' + r2.status);
    const d2 = await r2.json();
    const c = d2.current || {};
    const h = d2.hourly || {};
    const times = h.time || [];
    const nowMs = Date.now();
    let idx = 0;
    for (let i = 0; i < times.length; i++) if (new Date(times[i]).getTime() <= nowMs) idx = i;
    const t = c.temperature_2m;
    const hum = c.relative_humidity_2m;
    // Refuse a body we cannot actually read. Without this, a malformed or unexpected
    // response yields Math.round(undefined) === NaN in every field, and JSON.stringify
    // turns NaN into null - so a broken fallback would be indistinguishable from the
    // dead station it is supposed to rescue. Throw instead and keep the honest nulls.
    if (typeof t !== 'number' || !isFinite(t)) throw new Error('fallback: no temperature');
    const dew = h.dewpoint_2m?.[idx] ?? (t - ((100 - hum) / 5));
    const wd = c.wind_direction_10m ?? null;
    const presHpa = c.surface_pressure ?? null;
    return {
      temp:           Math.round(t),
      dewpt:          Math.round(dew),
      heatIndex:      Math.round(h.apparent_temperature?.[idx] ?? t),
      humidity:       Math.round(hum),
      precipTotal:    Math.round((h.precipitation?.[idx] ?? 0) * 100) / 100,
      precipRate:     0,
      windSpeed:      Math.round(c.wind_speed_10m),
      windGust:       Math.round(h.windgusts_10m?.[idx] ?? c.wind_speed_10m),
      winddir:        wd,
      windDirCard:    toCard(wd),
      pressure:       presHpa ? Math.round(presHpa * 0.02953 * 100) / 100 : null,
      uv:             h.uv_index?.[idx] ?? null,
      solarRadiation: null
    };
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
    const wdDeg = live(obs.winddir);

    const core = {
      // Core temps
      temp:           num(imp.temp),
      dewpt:          num(imp.dewpt),
      heatIndex:      num(imp.heatIndex) ?? num(imp.temp),
      // Humidity + precip
      humidity:       num(obs.humidity),
      precipTotal:    num(imp.precipTotal, x => Math.round(x * 100) / 100) ?? 0,
      precipRate:     num(imp.precipRate,  x => Math.round(x * 100) / 100) ?? 0,
      // Wind
      windSpeed:      num(imp.windSpeed),
      windGust:       num(imp.windGust),
      winddir:        wdDeg,
      windDirCard:    toCard(wdDeg),
      // Pressure
      pressure:       num(imp.pressure, x => Math.round(x * 100) / 100),
      // Solar
      uv:             num(obs.uv, x => Math.round(x * 10) / 10),
      solarRadiation: num(obs.solarRadiation)
    };

    // PRESSURE IS DELIBERATELY NOT IN THIS TEST. The indoor console carries the
    // barometer and kept reporting a healthy 29.94 all day with the outdoor array
    // dead, so including it would mask exactly the failure being caught here.
    const arrayDark = core.temp == null && core.humidity == null &&
                      core.windSpeed == null && core.dewpt == null;

    let out = core;
    let station = obs.stationID || WU_STATION;
    if (arrayDark) {
      try {
        const om = await openMeteo();
        // Keep whatever the console itself still measures; take the rest from the model.
        out = { ...om,
                pressure:    core.pressure ?? om.pressure,
                precipTotal: core.precipTotal || om.precipTotal };
        station = (obs.stationID || WU_STATION) + ' array dark - Open-Meteo';
      } catch (eDark) { /* keep the honest nulls rather than invent numbers */ }
    }

    return Response.json({
      ...out,
      // Rolling 7 days from the same gauge. Turf target is 1.0-1.5 in/week.
      rain7d,
      rain7dDays,
      // Meta
      station,
      stationDark:    arrayDark,
      neighborhood:   obs.neighborhood  || 'White House, TN',
      obsTimeLocal:   obs.obsTimeLocal  || new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
    }, { headers: { 'Cache-Control': 'public, max-age=300' } });

  } catch (e) {
    // WU unreachable or malformed - same helper as the array-dark path above, so the
    // two fallbacks can never drift apart again.
    try {
      const om = await openMeteo();
      return Response.json({
        ...om,
        rain7d: null,
        rain7dDays: null,
        station: 'Open-Meteo (WU offline)',
        stationDark: true,
        neighborhood: 'White House, TN',
        obsTimeLocal: new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
      }, { headers: { 'Cache-Control': 'public, max-age=300' } });
    } catch (e2) {
      return Response.json({ error: 'unavailable: ' + e.message }, { status: 503 });
    }
  }
}
