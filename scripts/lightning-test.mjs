// Test /api/lightning against LIVE data and against known-tricky METAR strings.
// Run: node scripts/lightning-test.mjs
import { onRequestGet } from '../functions/api/lightning.js';

let fails = 0;
function check(name, got, want) {
  const ok = got === want;
  if (!ok) fails++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `  got=${got} want=${want}`}`);
}

// ---- 1. parser edge cases, using the same regexes via a live-shaped fetch stub ----
const CASES = [
  // [label, rawOb, expect status contains]
  ['TS overhead (KBNA, the real one from this morning)',
   'METAR KBNA 201053Z 23005KT 6SM -TSRA BR BKN090CB OVC110 22/21 A3006 RMK AO2 TSB45 SLP174 OCNL LTGICCCCG OHD TS OHD MOV E P0012 T02170206 $',
   'OVERHEAD'],
  ['heavy TS, distant lightning (KMQY, real)',
   'METAR KMQY 201056Z AUTO 00000KT 4SM +TSRA BR FEW025 SCT037 OVC090 22/22 A3008 RMK AO2 LTG DSNT ALQDS TSB12E27B33 SLP188 P0008',
   'OVERHEAD'],
  ['TSNO must NOT count as a thunderstorm',
   'METAR K1M5 201035Z AUTO 00000KT 10SM CLR 21/20 A3007 RMK AO2 TSNO',
   'NONE'],
  ['LTGNO must NOT count as lightning',
   'METAR KXNX 201035Z AUTO 00000KT 7SM BR CLR 21/21 A3007 RMK AO2 LTGNO',
   'NONE'],
  ['plain mist is quiet',
   'METAR KXNX 201035Z AUTO 00000KT 7SM BR CLR 21/21 A3007 RMK AO2',
   'NONE'],
];

const HOME = { lat: 36.473, lon: -86.6515 };

async function runWith(raws) {
  const orig = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url).includes('aviationweather')) {
      return {
        ok: true,
        json: async () =>
          raws.map((r, i) => ({
            icaoId: r.slice(6, 10),
            name: 'Test Field, TN, US',
            lat: HOME.lat + (i + 1) * 0.05,
            lon: HOME.lon,
            reportTime: new Date().toISOString(),
            rawOb: r,
            wxString: '',
          })),
      };
    }
    return { ok: true, json: async () => ({ features: [] }) }; // no alerts
  };
  try {
    const res = await onRequestGet();
    return await res.json();
  } finally {
    globalThis.fetch = orig;
  }
}

console.log('\nPARSER CASES (alerts stubbed empty so the observation is what is tested)\n');
for (const [label, raw, want] of CASES) {
  const out = await runWith([raw]);
  check(label, out.status, want);
}

// ---- 2. live fire against the real feed ----
console.log('\nLIVE — real NOAA feed, right now\n');
const live = await onRequestGet().then((r) => r.json());
console.log('  status   :', live.status, '(' + live.level + ')');
console.log('  detail   :', live.detail);
console.log('  nearest  :', live.nearestMi == null ? '—' : live.nearestMi + ' mi');
console.log('  hail     :', live.hail);
console.log('  alert    :', live.alert ? live.alert.event : 'none');
console.log('  stale    :', live.stale);
console.log('  observed :');
for (const h of live.observedBy) {
  console.log(
    `     ${String(h.mi).padStart(3)} mi  ${h.id}  ${h.name}  ts=${h.ts}${h.overhead ? ' OVERHEAD' : ''}${h.distant ? ' distant' : ''}  ${h.ageMin}min`
  );
}
if (!live.ok) fails++;
if (live.status === 'NONE' && live.observedBy.length) {
  console.log('  FAIL  reported NONE while stations were flagged');
  fails++;
}

console.log('\n' + (fails ? `${fails} FAILURE(S)` : 'all checks passed') + '\n');
process.exit(fails ? 1 : 0);
