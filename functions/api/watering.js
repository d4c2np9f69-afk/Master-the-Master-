// /api/watering — how long to run each zone to hit Jeff's weekly water target.
//
// Jeff, 2026-08-20, defining the whole feature in his own words:
//   "my grass requires between 1 inch and 1.5 inches of water per week... if we got like
//    today 1.7 inches it would show that as zero watering needed. If we only got a half an
//    inch then we would need to take that half inch and tell each zone how long it needs to
//    run. Not that it would actually run the sprinkler, but I could look on there and say
//    OK I need to put down half inch of water, I need to run each zone X amount of time."
//
// So: THIS DOES NOT WATER ANYTHING. It is a readout. B-Hyve still owns the schedule.
//
// ── THE MODEL — deliberately Jeff's rule, not a re-implementation of B-Hyve ───────────
//   target   = 1.0-1.5 in/week          HIS number for HIS grass
//   rain     = 7-day total at KTNWHITE21   his own gauge, the rain he actually got
//   deficit  = max(0, target − rain)
//   minutes  = (deficit / PR_zone) × 60    per zone, split across the watering days
//
// Jeff has seen B-Hyve's full Smart Watering input list (soil type, slope, sun exposure,
// microclimate, MAD soil-moisture bucket, cycle-and-soak) and said plainly: "not all of
// it." That is the right call — every one of those factors needs a per-zone value nobody
// has measured, and a guessed input makes the answer worse, not better. B-Hyve already
// runs that model with the values Jeff entered. This card answers the one question B-Hyve
// does not show him: how far short of HIS target is the week, and what does that mean in
// minutes per zone. (Research on B-Hyve's actual algorithm: MASTER-RECORD, 2026-08-05.)
//
// WHERE ET FITS. His band is 1.0-1.5, and the honest question is which end to aim at this
// week. That is what evapotranspiration answers: ET0 × Kc is what the turf measurably lost
// to sun, heat and wind. On a 100°F week it lands near 1.5; on a cool cloudy one near 1.0.
// So ET PICKS THE POINT INSIDE HIS BAND — it never overrides it, and the band is always
// shown so the two can be compared instead of one silently replacing the other.
//
// ── PRECIPITATION RATE — the number that turns inches into minutes ───────────────────
// Verified 2026-08-20 against Hunter's own MP Rotator Design Guide (LIT-461), performance
// tables extracted from the PDF — NOT recalled, and not the flat 0.4 this file assumed in
// its first draft. At 40 PSI, square spacing:
//     MP3500  90° -> 1.28 GPM, 0.40 in/hr      MP3500 180° -> 2.86 GPM, 0.45 in/hr
//     MP3000  90° -> 0.86 GPM, 0.37 in/hr      MP3000 180° -> 1.82 GPM, 0.39 in/hr
// Those are matched rates by design, which is the entire point of MP Rotators.
//
// Each zone's spec PR below is the FLOW-WEIGHTED average of its real arcs, then scaled by
// (measured GPM / spec GPM) from Jeff's own 2026-08-06 isolated-zone tests. Real flow
// through a fixed area IS the precipitation rate, so this uses his measurement rather than
// the spec sheet wherever the two disagree. Head counts, arcs and nozzle models are from
// docs/utilities/irrigation_gpm_calibration_2026-08-06.md, confirmed by Jeff — he
// installed the system himself.
//
// The three scaled rates land at 0.46 / 0.40 / 0.47 in/hr. That they cluster this tightly,
// across two different nozzle models and three different head counts, is a real check on
// the whole approach: matched precipitation rate is holding up in his actual yard.
//
// ⚠️ STILL NOT A MEASURED RATE. The honest way to nail it is a catch-cup test: straight-
// sided cans around a zone, run 15 minutes, average the depths, multiply by 4. That gives
// PR directly — no spec sheet, no area — and captures this system's real pressure and
// spacing. `catchCupHint` carries the instructions; every runtime stays flagged `estimated`.

const WU_STATION = 'KTNWHITE21';
const LAT = 36.477;
const LON = -86.66;

// Hunter LIT-461 @ 40 PSI, square spacing. [gpm, precipInHr] per head, by arc.
const MP3500 = { 90: [1.28, 0.40], 180: [2.86, 0.45] };
const MP3000 = { 90: [0.86, 0.37], 180: [1.82, 0.39] };

// Flow-weighted spec PR for a zone's real arc mix, plus its spec GPM.
function specFor(nozzle, arcs) {
  let gpm = 0, weighted = 0;
  for (const [arc, count] of Object.entries(arcs)) {
    const [g, pr] = nozzle[arc];
    gpm += g * count;
    weighted += g * count * pr;
  }
  return { specGpm: gpm, specPr: weighted / gpm };
}

// GPM measured 2026-08-06 by isolated single-zone runs (HA switch timing + water-meter
// delta). Zones 3/4/6 are present but uncalibrated ON PURPOSE: 3 has a known bad head, 4
// and 6 have never been flow-tested. Reported as uncalibrated rather than silently guessed.
// Zone 6 is a raised vegetable garden — Jeff's 1-1.5 in target is for GRASS, so a runtime
// there would be wrong even with a measured GPM.
const ZONES = [
  { id: 1, name: 'Front Right', gpm: 8.78,  nozzle: 'MP3500', arcs: { 90: 2, 180: 2 }, spec: specFor(MP3500, { 90: 2, 180: 2 }) },
  { id: 2, name: 'Front Left',  gpm: 10.09, nozzle: 'MP3500', arcs: { 90: 2, 180: 3 }, spec: specFor(MP3500, { 90: 2, 180: 3 }) },
  { id: 5, name: 'Side Bed',    gpm: 4.40,  nozzle: 'MP3000', arcs: { 90: 2, 180: 1 }, spec: specFor(MP3000, { 90: 2, 180: 1 }) },
  { id: 3, name: 'Back Left',   gpm: null,  nozzle: 'MP3000', note: 'known bad head — fix it before measuring' },
  { id: 4, name: 'Back Right',  gpm: null,  note: 'never flow-tested' },
  { id: 6, name: 'Garden',      gpm: null,  note: 'vegetable garden, not grass — different target' }
];

const TARGET_MIN = 1.0;   // Jeff's number for his grass, in/week
const TARGET_MAX = 1.5;
const DU = 0.75;          // distribution uniformity — real heads never apply perfectly evenly
const KC = 0.8;           // crop coefficient, cool-season turf (tall fescue) in summer
const DAYS_PER_WEEK = 3;  // matches IRR_DAYS_WK in index.html
const NOISE_IN = 0.15;    // below this, "short" is not worth acting on

// ── EFFECTIVE RAINFALL — Jeff's catch, 2026-08-20 ────────────────────────────────────
// Jeff: "sometimes the rain comes all at once like today and then if I get used to that I
// would be putting down too much — the numbers catch wrong due to timing."
//
// He is right, and the reason is bigger than timing. A rain gauge measures what fell out of
// the sky; the grass only gets what the ROOT ZONE can hold. Loam holds ~1.5 in of available
// water per FOOT of soil (UMN Extension, irrigation scheduling basics), and cool-season turf
// works the top 6-8 in — so the root zone banks roughly 1 in. Rain beyond that in a single
// day drains below the roots or runs off. It is real rain; it is not available water.
//
// So a 1.7 in afternoon storm credits ~1.0 in, not 1.7 in, and the overflow is REPORTED
// (`rainLostIn`) rather than silently dropped — Jeff should see what the sky gave versus
// what the lawn actually banked.
//
// This is deliberately NOT a full soil-moisture bucket. Jeff said "not all of it" about
// B-Hyve's model and that still stands: no MAD tracking, no carry-over balance, no soil
// type per zone. One honest cap on one day's credit, which is the specific error he found.
const ROOT_ZONE_IN = 1.0;

// Sum daily rain, crediting at most one root zone per day.
function effectiveRain(days) {
  let raw = 0, eff = 0;
  for (const d of days || []) {
    const v = d || 0;
    raw += v;
    eff += Math.min(v, ROOT_ZONE_IN);
  }
  return { rawIn: Math.round(raw * 100) / 100, effIn: Math.round(eff * 100) / 100,
           lostIn: Math.round((raw - eff) * 100) / 100 };
}

// Jeff's band, with ET choosing the point inside it.
function targetFor(et0Sum) {
  const demand = Math.round(et0Sum * KC * 100) / 100;
  const target = et0Sum > 0
    ? Math.round(Math.min(TARGET_MAX, Math.max(TARGET_MIN, demand)) * 100) / 100
    : TARGET_MIN;
  return { demand, target };
}

// Real precipitation rate per zone: spec rate scaled by how its measured flow compared to
// spec flow. Same area, more water = higher rate.
function zonePr(z) {
  return (z.spec.specPr * z.gpm) / z.spec.specGpm;
}

// Pure so it can be unit-tested with no network. See scripts/watering-test.mjs.
// Pure so it can be unit-tested with no network. See scripts/watering-test.mjs.
//
// TWO WINDOWS, because Jeff asked for both (2026-08-20):
//   BEHIND  — the last 7 completed days. Where the lawn actually stands right now.
//   AHEAD   — today + the next 6, from the forecast. What the sky is about to hand him,
//             so he does not water an inch into the ground the day before a storm.
// The actionable number is `putDownIn`: catch-up + next week's demand − rain that is coming.
//
// rainDays / forecastRainDays are DAILY arrays so the root-zone cap can be applied per day.
// rain7dIn is a bare total with no daily breakdown — the cap cannot be applied to it, and
// that is flagged in the payload rather than pretended away.
export function buildPlan({ et0Days, rainDays, rain7dIn, et0Forecast, forecastRainDays }) {
  const et0 = (et0Days || []).reduce((a, b) => a + (b || 0), 0);
  const back = targetFor(et0);

  let rainIn, rainRawIn, rainLostIn, capApplied;
  if (rain7dIn != null) {
    rainIn = rainRawIn = Math.round(rain7dIn * 100) / 100;
    rainLostIn = 0;
    capApplied = false;                       // no daily breakdown, so no honest cap
  } else {
    const r = effectiveRain(rainDays);
    rainIn = r.effIn; rainRawIn = r.rawIn; rainLostIn = r.lostIn;
    capApplied = true;
  }

  const deficitIn = Math.max(0, Math.round((back.target - rainIn) * 100) / 100);

  // ── AHEAD ────────────────────────────────────────────────────────────────────────
  const et0Fwd = (et0Forecast || []).reduce((a, b) => a + (b || 0), 0);
  const fwd = targetFor(et0Fwd);
  const fRain = effectiveRain(forecastRainDays);
  const hasForecast = (forecastRainDays || []).length > 0;

  // To be square a week from now: make up what is missing, cover next week's demand, and
  // subtract the rain that is actually coming. Never below zero.
  const putDownIn = hasForecast
    ? Math.max(0, Math.round((deficitIn + fwd.target - fRain.effIn) * 100) / 100)
    : deficitIn;

  // Run times are driven by the ACTIONABLE number, not the backward-looking one.
  const applyIn = putDownIn;
  const perDayIn = applyIn / DAYS_PER_WEEK;

  const zones = ZONES.map((z) => {
    if (z.gpm == null) {
      return { id: z.id, name: z.name, calibrated: false, minutesWeek: null,
               minutesPerDay: null, gallonsWeek: null, inPerHr: null,
               estimated: true, reason: z.note };
    }
    const pr = zonePr(z);
    const effectivePr = pr * DU;              // inches actually landing per hour
    // Gate on NOISE_IN, not on >0. Caught live 2026-08-20: a 0.02 in shortfall printed
    // "ESSENTIALLY COVERED · watering is optional" in the verdict while every zone still
    // said "1 min x 3/wk", because Math.max(1, ...) floored it. Don't send Jeff outside
    // for one minute of water.
    const shouldRun = applyIn >= NOISE_IN;
    const minutesWeek = shouldRun ? Math.round((applyIn / effectivePr) * 60) : 0;
    const minutesPerDay = shouldRun ? Math.max(1, Math.round((perDayIn / effectivePr) * 60)) : 0;
    return {
      id: z.id, name: z.name, calibrated: true,
      gpm: z.gpm,
      nozzle: z.nozzle,
      inPerHr: Math.round(pr * 1000) / 1000,
      minutesWeek,
      minutesPerDay,
      gallonsWeek: Math.round(minutesWeek * z.gpm),
      estimated: true                          // PR is spec-derived until a catch-cup test
    };
  });

  let verdict, level, detail;
  if (applyIn <= 0) {
    verdict = 'NO WATERING NEEDED';
    level = 'ok';
    detail = hasForecast && fRain.effIn > 0 && deficitIn > 0
      ? 'You are ' + deficitIn.toFixed(2) + ' in behind, but ' + fRain.effIn.toFixed(2)
        + ' in of usable rain is forecast over the next 7 days. Let the sky do it.'
      : 'You got ' + rainIn.toFixed(2) + ' in of usable rain against a '
        + back.target.toFixed(2) + ' in target. The lawn is covered.';
  } else if (applyIn < NOISE_IN) {
    verdict = 'ESSENTIALLY COVERED';
    level = 'ok';
    detail = 'Short by only ' + applyIn.toFixed(2) + ' in — inside the margin of a rain '
           + 'gauge. Watering is optional.';
  } else {
    verdict = 'PUT DOWN ' + applyIn.toFixed(2) + '"';
    level = applyIn >= 0.75 ? 'bad' : 'warn';
    detail = 'Behind by ' + deficitIn.toFixed(2) + ' in'
           + (hasForecast
               ? ', next week needs ' + fwd.target.toFixed(2) + ' in, and '
                 + fRain.effIn.toFixed(2) + ' in of rain is forecast.'
               : ' against a ' + back.target.toFixed(2) + ' in target.')
           + ' Put down ' + applyIn.toFixed(2) + ' in over the coming week.';
  }

  return {
    ok: true,
    verdict, level, detail,
    // Headline numbers the card reads.
    targetIn: back.target,
    rainIn,
    deficitIn,
    putDownIn,
    targetBand: { minIn: TARGET_MIN, maxIn: TARGET_MAX },
    // BEHIND — the rolling 7 completed days.
    behind: {
      targetIn: back.target,
      rainIn,
      rainRawIn,
      rainLostIn,                  // fell, but ran off / drained past the roots
      deficitIn,
      capApplied
    },
    // AHEAD — today + next 6, from the forecast.
    ahead: hasForecast ? {
      targetIn: fwd.target,
      forecastRainIn: fRain.effIn,
      forecastRainRawIn: fRain.rawIn,
      forecastRainLostIn: fRain.lostIn,
      putDownIn
    } : null,
    et: {
      et0In: Math.round(et0 * 100) / 100,
      demandIn: back.demand,
      says: back.demand <= TARGET_MIN ? 'mild week — bottom of your range is enough'
          : back.demand >= TARGET_MAX ? 'hot week — aim at the top of your range'
          : 'normal week — ' + back.demand.toFixed(2) + ' in of real demand'
    },
    daysPerWeek: DAYS_PER_WEEK,
    zones,
    assumptions: {
      targetSource: "Jeff's rule for his grass: 1.0-1.5 in per week",
      etPicksPointInBand: true,
      rootZoneCapIn: ROOT_ZONE_IN,
      rootZoneCapSource: 'Loam holds ~1.5 in of available water per foot (UMN Extension); '
                       + 'turf roots work the top 6-8 in, so ~1 in per day is the most the '
                       + 'grass can bank. Rain past that drains below the roots or runs off.',
      distributionUniformity: DU,
      cropCoefficient: KC,
      turfType: 'cool-season (tall fescue) — 0.6 would be right for bermuda or zoysia',
      precipRateSource: 'Hunter MP Rotator Design Guide LIT-461 @ 40 PSI, flow-weighted per '
                      + "zone's real arcs, scaled by Jeff's measured GPM (2026-08-06). "
                      + 'SPEC-DERIVED, not catch-cup measured.',
      daysPerWeekNote: 'Weekly minutes split across ' + DAYS_PER_WEEK + ' watering days.'
    },
    catchCupHint: 'To replace the spec-derived rate with a real measured one: set 5-6 '
                + 'straight-sided cans (tuna cans work) around one zone, run it 15 minutes, '
                + 'average the depths in inches and multiply by 4. That is the zone’s '
                + 'true in/hr, and it captures this system’s actual pressure and head '
                + 'spacing. One zone takes about 20 minutes.',
    source: 'Rain from ' + WU_STATION + ' (your gauge) · ET0 + forecast from Open-Meteo (FAO-56)'
  };
}

export async function onRequestGet({ env }) {
  // Key is env-only here. The literal fallback in weather.js is legacy and exposed; a NEW
  // key belongs in Cloudflare Pages as WU_API_KEY. If it is missing the card says so
  // out loud rather than quietly substituting model rain for Jeff's own gauge.
  const WU_KEY = env && env.WU_API_KEY;

  try {
    const etUrl = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + LAT + '&longitude=' + LON
      + '&daily=et0_fao_evapotranspiration,precipitation_sum'
      + '&past_days=7&forecast_days=8&timezone=America%2FChicago&precipitation_unit=inch';

    const etRes = await fetch(etUrl, { cf: { cacheTtl: 3600 } });
    if (!etRes.ok) throw new Error('Open-Meteo ' + etRes.status);
    const et = await etRes.json();
    const daily = (et && et.daily) || {};
    // past_days=7 + forecast_days=8 -> 15 daily entries, index 7 is TODAY.
    //
    // ⚠️ THE WINDOWS MUST NOT OVERLAP. Caught live 2026-08-20: BEHIND used [0..6] while
    // AHEAD used [7..13], but Weather Underground's `7day` summary returns the 7 days
    // ENDING TODAY — so today's 1.17 in was credited in BEHIND (from the gauge) AND again
    // in AHEAD (from the model), and the double credit made the app under-water.
    //
    //   [1..7]   BEHIND — the 7 days ending TODAY, matching what the gauge returns
    //   [8..14]  AHEAD  — the next 7 days, starting TOMORROW
    //
    // Today's model values are a whole-day forecast while the gauge's are actual-so-far,
    // so they can disagree slightly; the gauge wins whenever it is available.
    const allEt0 = daily.et0_fao_evapotranspiration || [];
    const allRain = daily.precipitation_sum || [];
    const et0Days = allEt0.slice(1, 8);
    const omRain = allRain.slice(1, 8);
    const et0Forecast = allEt0.slice(8, 15);
    const forecastRainDays = allRain.slice(8, 15);

    // DAILY values, not a total — the root-zone cap has to be applied day by day, or a
    // single 1.7 in storm would be credited in full. See ROOT_ZONE_IN above.
    let gaugeDaily = null;
    let rainSource = 'Open-Meteo model (no station key configured)';
    let rainDaysDetail = null;
    if (WU_KEY) {
      try {
        const wuRes = await fetch(
          `https://api.weather.com/v2/pws/dailysummary/7day?stationId=${WU_STATION}&format=json&units=e&apiKey=${WU_KEY}`,
          { headers: { 'User-Agent': 'HCC-PWA/1.0 (jeff.loewen@comcast.net)' }, cf: { cacheTtl: 1800 } });
        if (wuRes.ok) {
          const d7 = await wuRes.json();
          const days = d7.summaries || d7.observations || [];
          if (days.length) {
            rainDaysDetail = days.map((o) => ({
              date: (o.obsTimeLocal || '').slice(0, 10),
              in: (o.imperial && o.imperial.precipTotal) || 0
            }));
            gaugeDaily = rainDaysDetail.map((d) => d.in);
            rainSource = WU_STATION + ' (your gauge)';
          }
        }
      } catch (e) { /* non-fatal — model rain is used instead */ }
    }

    const plan = buildPlan({
      et0Days,
      rainDays: (gaugeDaily && gaugeDaily.length) ? gaugeDaily : omRain,
      et0Forecast,
      forecastRainDays
    });
    plan.rainSource = rainSource;
    plan.rainDays = rainDaysDetail;
    plan.et0Days = et0Days.map((v) => Math.round(v * 1000) / 1000);
    plan.forecastRainDays = forecastRainDays.map((v) => Math.round((v || 0) * 100) / 100);
    return Response.json(plan, { headers: { 'Cache-Control': 'public, max-age=1800' } });
  } catch (e) {
    return Response.json({ ok: false, verdict: 'NO DATA', level: 'warn',
                           detail: String((e && e.message) || e) }, { status: 503 });
  }
}
