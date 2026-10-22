// /api/drought — current US Drought Monitor status for White House, TN 37188
// (Robertson County FIPS 47147). Source: U.S. Drought Monitor web service (UNL).
// Returns the dominant drought category + advice for irrigation.
const FIPS = '47147'; // Robertson County, TN (White House)

const LABELS = {
  None: { cat: 'None', label: 'No Drought',          advice: 'Soil moisture normal — water only as needed.' },
  D0:   { cat: 'D0',   label: 'Abnormally Dry',       advice: 'Drying out — keep an eye on the lawn.' },
  D1:   { cat: 'D1',   label: 'Moderate Drought',     advice: 'Lawn likely needs supplemental watering.' },
  D2:   { cat: 'D2',   label: 'Severe Drought',       advice: 'Water regularly; expect lawn stress & possible restrictions.' },
  D3:   { cat: 'D3',   label: 'Extreme Drought',      advice: 'Significant watering needed; check for local restrictions.' },
  D4:   { cat: 'D4',   label: 'Exceptional Drought',  advice: 'Critical — water per local rules; conserve.' },
};

function mdy(d) { return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(); }

export async function onRequestGet() {
  try {
    const end = new Date();
    const start = new Date(end.getTime() - 35 * 86400000); // ~5 weeks back to be safe
    const url = 'https://usdmdataservices.unl.edu/api/CountyStatistics/GetDroughtSeverityStatisticsByAreaPercent'
      + '?aoi=' + FIPS
      + '&startdate=' + encodeURIComponent(mdy(start))
      + '&enddate=' + encodeURIComponent(mdy(end))
      + '&statisticsType=1';

    const r = await fetch(url, { headers: { 'Accept': 'application/json' }, cf: { cacheTtl: 21600 } });
    if (!r.ok) throw new Error('USDM ' + r.status);
    const rows = await r.json();
    if (!Array.isArray(rows) || !rows.length) throw new Error('no rows');

    // Most recent week is last in the array (sorted by date ascending)
    const latest = rows[rows.length - 1];
    const pct = {
      None: parseFloat(latest.None ?? latest.none ?? 0),
      D0:   parseFloat(latest.D0 ?? 0),
      D1:   parseFloat(latest.D1 ?? 0),
      D2:   parseFloat(latest.D2 ?? 0),
      D3:   parseFloat(latest.D3 ?? 0),
      D4:   parseFloat(latest.D4 ?? 0),
    };
    // Dominant category = the one covering the largest share of the county
    let dom = 'None', max = -1;
    for (const k of ['None', 'D0', 'D1', 'D2', 'D3', 'D4']) {
      if (pct[k] > max) { max = pct[k]; dom = k; }
    }
    const info = LABELS[dom] || LABELS.None;
    return Response.json({
      category: info.cat,
      label: info.label,
      advice: info.advice,
      percent: Math.round(max),
      validStart: latest.ValidStart || latest.MapDate || '',
      county: 'Robertson County, TN',
      pct,
    }, { headers: { 'Cache-Control': 'public, max-age=21600' } });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 503 });
  }
}
