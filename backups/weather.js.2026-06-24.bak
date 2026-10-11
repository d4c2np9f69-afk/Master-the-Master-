// /api/weather — proxies open-meteo.com into the Weather Underground station format
// the app expects (temp, dewpt, heatIndex, humidity, precipTotal, windSpeed, windGust, etc.)
export async function onRequestGet() {
  try {
    const r = await fetch(
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=36.477&longitude=-86.66' +
      '&current_weather=true' +
      '&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation,windspeed_10m,windgusts_10m' +
      '&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch' +
      '&timezone=America%2FChicago&forecast_days=1',
      { headers: { 'User-Agent': 'HCC-PWA/1.0' }, cf: { cacheTtl: 300 } }
    );
    if (!r.ok) throw new Error('upstream ' + r.status);
    const d = await r.json();

    const cw = d.current_weather;
    const h = d.hourly || {};
    const times = h.time || [];
    const now = Date.now();

    // Find the index of the most recent completed hour
    let idx = 0;
    for (let i = 0; i < times.length; i++) {
      if (new Date(times[i]).getTime() <= now) idx = i;
    }

    const temp = h.temperature_2m?.[idx] ?? cw.temperature;
    const dewpt = h.dewpoint_2m?.[idx] ?? null;
    const apparent = h.apparent_temperature?.[idx] ?? temp;
    const humidity = h.relativehumidity_2m?.[idx] ?? null;
    const precip = h.precipitation?.[idx] ?? 0;
    const windSpeed = cw.windspeed;
    const windGust = h.windgusts_10m?.[idx] ?? windSpeed;

    const obsTime = new Date().toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });

    return Response.json({
      temp: Math.round(temp),
      dewpt: dewpt != null ? Math.round(dewpt) : null,
      heatIndex: Math.round(apparent),
      humidity: humidity != null ? Math.round(humidity) : null,
      precipTotal: Math.round(precip * 100) / 100,
      windSpeed: Math.round(windSpeed),
      windGust: Math.round(windGust),
      station: 'HCC-BackYard',
      neighborhood: 'White House, TN',
      obsTimeLocal: obsTime
    }, { headers: { 'Cache-Control': 'public, max-age=300' } });

  } catch (e) {
    return Response.json({ error: 'unavailable: ' + e.message }, { status: 503 });
  }
}
