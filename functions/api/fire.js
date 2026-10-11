// /api/fire — active fire incidents nearest White House, TN.
//
// Added 2026-08-20 after Jeff pointed at AirNow's "Current Fire Conditions" tile.
// Jeff's standing rule, same session: "just get all data as close to me as you can."
// So this sorts by real distance from the house and leads with the nearest, rather than
// reporting a state- or region-level summary.
//
// Source: NIFC / WFIGS "Incident Locations Current" — the National Interagency Fire
// Center's own public ArcGIS feature service. Free, keyless, authoritative.
//
// ⚠️ TWO TRAPS, both hit while building this:
//   1. The acreage field is `IncidentSize`, NOT `DailyAcres`. Passing a field that does
//      not exist returns HTTP 200 with ZERO features — it looks exactly like "no fires".
//   2. So a zero result must be sanity-checked. When this query first returned 0 near
//      Tennessee it also returned 0 over the whole western US in August, which is what
//      exposed the bad field name. `returnCountOnly` over the full service reported 522
//      incidents, proving the service was live and the query was wrong.
//   Keep the countOnly cross-check below — a silent empty is the failure mode here.
//
// IncidentTypeCategory: "WF" = wildfire, "RX" = prescribed burn (planned, intentional).
// They are NOT the same thing and must not be reported as one number — most fires near
// Tennessee are RX.

const HOME_LAT = 36.477;
const HOME_LON = -86.66;
const BOX = { xmin: -92, ymin: 32, xmax: -81, ymax: 41 };   // southeast US
const SERVICE = 'https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/'
              + 'WFIGS_Incident_Locations_Current/FeatureServer/0/query';

function miles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = p2 - p1;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export async function onRequestGet() {
  const params = new URLSearchParams({
    where: '1=1',
    geometry: JSON.stringify({ ...BOX, spatialReference: { wkid: 4326 } }),
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: 'IncidentName,POOState,IncidentSize,PercentContained,FireDiscoveryDateTime,IncidentTypeCategory',
    returnGeometry: 'true',
    outSR: '4326',
    f: 'geojson'
  });

  try {
    const r = await fetch(SERVICE + '?' + params.toString(), {
      headers: { 'User-Agent': 'HCC-PWA/1.0 (jeff.loewen@comcast.net)' },
      cf: { cacheTtl: 1800 }
    });
    if (!r.ok) throw new Error('NIFC ' + r.status);
    const d = await r.json();
    if (d && d.error) throw new Error('NIFC ' + JSON.stringify(d.error).slice(0, 120));

    const feats = (d && d.features) || [];
    const rows = [];
    for (const f of feats) {
      const c = f && f.geometry && f.geometry.coordinates;
      if (!c || c.length < 2) continue;
      const p = f.properties || {};
      rows.push({
        name: p.IncidentName || 'Unnamed',
        state: (p.POOState || '').replace(/^US-/, ''),
        type: p.IncidentTypeCategory || null,          // WF = wildfire, RX = prescribed
        acres: p.IncidentSize == null ? null : p.IncidentSize,
        contained: p.PercentContained == null ? null : p.PercentContained,
        discovered: p.FireDiscoveryDateTime || null,
        mi: Math.round(miles(HOME_LAT, HOME_LON, c[1], c[0]) * 10) / 10
      });
    }
    rows.sort((a, b) => a.mi - b.mi);

    // A zero here is only trustworthy if the SERVICE is answering. Silent-empty is the
    // documented failure mode of this endpoint, so prove liveness before reporting none.
    let serviceCount = null;
    if (!rows.length) {
      try {
        const cr = await fetch(SERVICE + '?where=1%3D1&returnCountOnly=true&f=json', { cf: { cacheTtl: 1800 } });
        if (cr.ok) {
          const cd = await cr.json();
          serviceCount = cd && cd.count != null ? cd.count : null;
        }
      } catch (e) { /* leave null — reported as unverified below */ }
      if (serviceCount === null) {
        return Response.json({
          ok: false, status: 'NO DATA', level: 'warn',
          detail: 'Fire service did not answer — a zero here cannot be trusted',
          nearest: null, wildfires: [], all: []
        }, { headers: { 'Cache-Control': 'public, max-age=300' } });
      }
    }

    const wildfires = rows.filter((x) => x.type === 'WF');
    const nearestWF = wildfires[0] || null;
    const nearest = rows[0] || null;

    let status = 'NONE';
    let level = 'ok';
    let detail = 'No active incidents within ~350 mi';
    if (nearestWF && nearestWF.mi <= 50) { status = nearestWF.mi + ' mi'; level = 'bad'; }
    else if (nearestWF && nearestWF.mi <= 150) { status = nearestWF.mi + ' mi'; level = 'warn'; }
    else if (nearestWF) { status = nearestWF.mi + ' mi'; level = 'ok'; }
    else if (nearest) { status = 'NONE'; level = 'ok'; }

    if (nearestWF) {
      detail = 'Nearest WILDFIRE: ' + nearestWF.name + ', ' + nearestWF.mi + ' mi ('
             + nearestWF.state + ')'
             + (nearestWF.acres != null ? ' · ' + nearestWF.acres + ' acres' : '')
             + (nearestWF.contained != null ? ' · ' + nearestWF.contained + '% contained' : '');
    } else if (nearest) {
      detail = 'No wildfires. Nearest incident is a prescribed burn: ' + nearest.name
             + ', ' + nearest.mi + ' mi (' + nearest.state + ')';
    }

    return Response.json({
      ok: true,
      status, level, detail,
      nearest,
      nearestWildfire: nearestWF,
      counts: { total: rows.length, wildfire: wildfires.length, prescribed: rows.filter((x) => x.type === 'RX').length },
      all: rows.slice(0, 12),
      serviceCount,
      source: 'NIFC / WFIGS Incident Locations (current)'
    }, { headers: { 'Cache-Control': 'public, max-age=1800' } });
  } catch (e) {
    return Response.json({
      ok: false, status: 'NO DATA', level: 'warn',
      detail: String((e && e.message) || e),
      nearest: null, nearestWildfire: null, all: []
    }, { status: 503 });
  }
}
