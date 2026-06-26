// /api/forecast — 10-day daily forecast for White House, TN 37188
// Uses Weather.com (TWC) v3 daily forecast API with the WU API key
export async function onRequestGet() {
  const WU_KEY = '0e87ee079c0147a787ee079c01d7a75d';

  try {
    const r = await fetch(
      `https://api.weather.com/v3/wx/forecast/daily/10day?geocode=36.477,-86.66&format=json&units=e&language=en-US&apiKey=${WU_KEY}`,
      { headers: { 'User-Agent': 'HCC-PWA/1.0 (jeff.loewen@comcast.net)' }, cf: { cacheTtl: 1800 } }
    );
    if (!r.ok) throw new Error('TWC ' + r.status);
    const d = await r.json();

    // Normalise into a flat array of 10 days
    const days = [];
    const dp = Array.isArray(d.daypart) ? d.daypart[0] : null; // day-part interleaved array
    for (let i = 0; i < 10; i++) {
      const dayIdx  = dp ? i * 2     : null; // even indices = daytime
      const nightIdx = dp ? i * 2 + 1 : null; // odd  indices = night
      days.push({
        dayName:    (d.dayOfWeek?.[i]       || '').substring(0, 3).toUpperCase(),
        hi:         d.calendarDayTemperatureMax?.[i] ?? null,
        lo:         d.calendarDayTemperatureMin?.[i] ?? null,
        precip:     d.precipChance?.[i]     ?? null,
        narrative:  d.narrative?.[i]        || '',
        // Day-part fields (prefer daytime for icon/phrase)
        icon:       dp?.iconCode?.[dayIdx]  ?? dp?.iconCode?.[nightIdx] ?? null,
        wxPhrase:   dp?.wxPhraseShort?.[dayIdx] || dp?.wxPhraseShort?.[nightIdx] || '',
        windSpeed:  dp?.windSpeed?.[dayIdx] ?? null,
        windDir:    dp?.windDirectionCardinal?.[dayIdx] ?? null,
        uvIndex:    dp?.uvIndex?.[dayIdx]   ?? null,
      });
    }

    return Response.json({ days, updated: new Date().toISOString() }, {
      headers: { 'Cache-Control': 'public, max-age=1800' }
    });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 503 });
  }
}
