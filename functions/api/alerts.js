// /api/alerts — proxies NWS active alerts for lat=36.477, lon=-86.66 (White House, TN)
//
// Verified 2026-08-29 against api.weather.gov/points/36.477,-86.66:
//   office OHX (Nashville) · county TNC147 (Robertson) · zone TNZ007 · radar KOHX
// Free, official, no API key, no account. This is the SAME warning text NOAA
// Weather Radio reads aloud — and it is county-correct for White House, which
// no free NOAA Weather Radio audio stream currently is (KIG79 has no working
// free stream; the nearest live one is Beechgrove, ~50 mi away and the wrong
// counties). See docs/OPEN_ITEMS.md.
//
// `description` and `instruction` were added 2026-08-29: instruction is NWS's
// literal "what to do" wording (TAKE COVER NOW, move to an interior room, etc).
// Without it the app could say a tornado warning existed but not what to do.
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
      return Response.json({ alerts: [], ok: false }, {
        headers: { 'Cache-Control': 'public, max-age=60' }
      });
    }

    const d = await r.json();
    const alerts = (d.features || []).map(f => {
      const p = f.properties || {};
      return {
        id: f.id || p.id || '',
        event: p.event || '',
        headline: p.headline || (p.description || '').split('\n')[0] || '',
        severity: p.severity || 'Unknown',
        urgency: p.urgency || 'Unknown',
        certainty: p.certainty || '',
        expires: p.expires || '',
        onset: p.onset || p.effective || '',
        sent: p.sent || '',
        area: p.areaDesc || '',
        senderName: p.senderName || '',
        // The two that matter in an actual emergency:
        description: p.description || '',
        instruction: p.instruction || ''
      };
    });

    // ok:true lets the app tell "checked, nothing active" apart from "check failed".
    // Those look identical without it, and a silent failure reading as ALL CLEAR
    // is the exact class of bug this project keeps paying for.
    return Response.json({ alerts, ok: true, checked: new Date().toISOString() }, {
      headers: { 'Cache-Control': 'public, max-age=180' }
    });

  } catch (e) {
    // Always return valid JSON — empty alerts on failure so the app keeps working
    return Response.json({ alerts: [], ok: false });
  }
}
