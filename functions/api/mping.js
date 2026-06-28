// /api/mping — proxies mPING (NOAA/OU) report submission + type fetch
// GET  /api/mping          → returns available report types from mPING API
// POST /api/mping          → submits a precipitation/phenomenon report to mPING
//
// mPING API: https://mping.nssl.noaa.gov/mping/api/v2/
// Developed by NOAA NSSL + University of Oklahoma

const MPING_BASE = 'https://mping.nssl.noaa.gov/mping/api/v2';
const UA = 'HCC-PWA/1.0 Spotter-jlo301 (jeff.loewen@comcast.net)';

export async function onRequestGet() {
  try {
    const r = await fetch(MPING_BASE + '/reporttypes/', {
      headers: { 'User-Agent': UA, 'Accept': 'application/json' }
    });
    if (!r.ok) throw new Error('mPING types ' + r.status);
    const data = await r.json();
    return Response.json(data, {
      headers: { 'Cache-Control': 'public, max-age=3600' }
    });
  } catch (e) {
    // Return hardcoded fallback types so the UI always works
    return Response.json({ results: FALLBACK_TYPES, fallback: true }, {
      headers: { 'Cache-Control': 'public, max-age=300' }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { typeId, lat, lon } = body;

    if (!typeId) return Response.json({ error: 'typeId required' }, { status: 400 });

    const obstime = new Date().toISOString();

    const payload = {
      description: { pk: typeId },
      geom: {
        type: 'Point',
        coordinates: [
          parseFloat(lon ?? -86.66),
          parseFloat(lat ?? 36.477)
        ]
      },
      obtime: obstime
    };

    // mPING REQUIRES an API token to submit reports (the reporttypes GET is open,
    // but POST /reports/ rejects unauthenticated requests). Token is provisioned
    // by NSSL on request and stored as the Cloudflare env var MPING_TOKEN.
    const token = context.env && context.env.MPING_TOKEN;
    if (!token) {
      return Response.json({
        error: 'mPING token not configured',
        detail: 'mPING requires an API key to submit. Request one from NSSL (mping@nssl.noaa.gov) for spotter jlo301, then set MPING_TOKEN in Cloudflare Pages env.'
      }, { status: 412 });
    }

    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': UA,
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': 'Token ' + token
    };

    const r = await fetch(MPING_BASE + '/reports/', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text.substring(0, 200) }; }

    if (!r.ok) {
      return Response.json({ error: 'mPING ' + r.status, detail: data }, { status: r.status });
    }

    return Response.json({ ok: true, id: data.id || data.pk || null, obstime });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// Fallback type list if the API is unreachable — based on mPING v2 standard types
const FALLBACK_TYPES = [
  // Precipitation types
  { id: 1,  description: 'None (No Precip)', category: 'Precipitation', icon: '☀️' },
  { id: 2,  description: 'Rain',              category: 'Precipitation', icon: '🌧' },
  { id: 3,  description: 'Drizzle',           category: 'Precipitation', icon: '🌦' },
  { id: 4,  description: 'Freezing Rain',     category: 'Precipitation', icon: '🌨' },
  { id: 5,  description: 'Freezing Drizzle',  category: 'Precipitation', icon: '🌨' },
  { id: 6,  description: 'Ice Pellets/Sleet', category: 'Precipitation', icon: '🧊' },
  { id: 7,  description: 'Snow',              category: 'Precipitation', icon: '❄️' },
  { id: 8,  description: 'Mixed Precip',      category: 'Precipitation', icon: '🌩' },
  // Convective
  { id: 11, description: 'Hail',              category: 'Convective',    icon: '⛈' },
  { id: 12, description: 'Small Hail',        category: 'Convective',    icon: '⛈' },
  { id: 13, description: 'Tornado',           category: 'Convective',    icon: '🌪' },
  { id: 14, description: 'Funnel Cloud',      category: 'Convective',    icon: '🌪' },
];
