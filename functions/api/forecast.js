// /api/forecast — 10-day daily forecast for White House, TN 37188
// Uses Open-Meteo (free, no API key) — far more reliable than TWC/WU
export async function onRequestGet() {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=36.477&longitude=-86.66'
      + '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max'
      + ',windspeed_10m_max,winddirection_10m_dominant,uv_index_max'
      + '&temperature_unit=fahrenheit&precipitation_unit=inch'
      + '&timezone=America%2FChicago&forecast_days=10';

    const r = await fetch(url, { cf: { cacheTtl: 1800 } });
    if (!r.ok) throw new Error('Open-Meteo ' + r.status);
    const d = await r.json();

    const daily = d.daily;
    if (!daily?.time?.length) throw new Error('no data');

    const DAY_NAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

    const days = daily.time.slice(0, 10).map((dateStr, i) => {
      const wmo = daily.weathercode[i] ?? 0;
      return {
        dayName:   DAY_NAMES[new Date(dateStr + 'T12:00:00').getDay()],
        hi:        daily.temperature_2m_max[i]            != null ? Math.round(daily.temperature_2m_max[i])  : null,
        lo:        daily.temperature_2m_min[i]            != null ? Math.round(daily.temperature_2m_min[i])  : null,
        precip:    daily.precipitation_probability_max[i] ?? null,
        narrative: '',
        icon:      wmoToTwcIcon(wmo),
        wxPhrase:  wmoPhrase(wmo),
        windSpeed: daily.windspeed_10m_max[i]             != null ? Math.round(daily.windspeed_10m_max[i])   : null,
        windDir:   degToCardinal(daily.winddirection_10m_dominant[i]),
        uvIndex:   daily.uv_index_max[i]                  != null ? Math.round(daily.uv_index_max[i])        : null,
      };
    });

    return Response.json({ days, updated: new Date().toISOString() }, {
      headers: { 'Cache-Control': 'public, max-age=1800' }
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 503 });
  }
}

// Map WMO weather codes → TWC-style icon numbers (used by existing wxFcIcon() in app)
function wmoToTwcIcon(wmo) {
  if (wmo === 0)                    return 32; // clear/sunny
  if (wmo === 1)                    return 34; // mostly clear
  if (wmo === 2)                    return 30; // partly cloudy
  if (wmo === 3)                    return 26; // overcast
  if (wmo === 45 || wmo === 48)     return 20; // fog
  if (wmo >= 51 && wmo <= 55)       return 11; // drizzle
  if (wmo >= 61 && wmo <= 65)       return 12; // rain
  if (wmo >= 71 && wmo <= 75)       return 16; // snow
  if (wmo === 77)                   return 16; // snow grains
  if (wmo >= 80 && wmo <= 82)       return 11; // showers
  if (wmo === 85 || wmo === 86)     return 16; // snow showers
  if (wmo === 95)                   return 4;  // thunderstorm
  if (wmo === 96 || wmo === 99)     return 3;  // thunderstorm + hail
  return 30; // default partly cloudy
}

function wmoPhrase(wmo) {
  const p = {
    0:'Clear',1:'Mostly Clear',2:'Partly Cloudy',3:'Overcast',
    45:'Fog',48:'Freezing Fog',
    51:'Lt Drizzle',53:'Drizzle',55:'Hvy Drizzle',
    61:'Lt Rain',63:'Rain',65:'Hvy Rain',
    71:'Lt Snow',73:'Snow',75:'Hvy Snow',77:'Snow Grains',
    80:'Showers',81:'Showers',82:'Hvy Showers',
    85:'Snow Showers',86:'Hvy Snow Shwrs',
    95:'Thunderstorm',96:'T-Storm/Hail',99:'T-Storm/Hail',
  };
  return p[wmo] || 'Mixed';
}

function degToCardinal(deg) {
  if (deg == null) return null;
  return ['N','NE','E','SE','S','SW','W','NW'][Math.round(deg / 45) % 8];
}
