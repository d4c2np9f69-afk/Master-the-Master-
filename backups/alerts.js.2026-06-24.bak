// /api/alerts — proxies NWS active alerts for lat=36.477, lon=-86.66 (White House, TN)
export async function onRequestGet() {
  try {
    const r = await fetch(
      'https://api.weather.gov/alerts/active?point=36.477%2C-86.66',
      {
        headers: {
          'User-Agent': 'HCC-PWA/1.0 (jeff.loewen@comcast.net)',
          'Accept': 'application/geo+json'
        },
        cf: { cacheTtl: 180 }
      }
    );

    if (!r.ok) {
      // NWS sometimes returns 503; return empty rather than crashing the app
      return Response.json({ alerts: [] }, {
        headers: { 'Cache-Control': 'public, max-age=60' }
      });
    }

    const d = await r.json();
    const alerts = (d.features || []).map(f => ({
      event: f.properties?.event || '',
      headline: f.properties?.headline || f.properties?.description?.split('\n')[0] || '',
      severity: f.properties?.severity || 'Unknown',
      urgency: f.properties?.urgency || 'Unknown'
    }));

    return Response.json({ alerts }, {
      headers: { 'Cache-Control': 'public, max-age=180' }
    });

  } catch (e) {
    // Always return valid JSON — empty alerts on failure so the app keeps working
    return Response.json({ alerts: [] });
  }
}
