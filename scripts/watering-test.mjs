// Unit tests for the watering algorithm. buildPlan() is pure, so this needs no network and
// runs in milliseconds. An irrigation calculator that is wrong is worse than none at all —
// it either wastes water or lets the lawn burn while claiming otherwise.
//
// The spec is Jeff's, verbatim (2026-08-20): "my grass requires between 1 inch and 1.5
// inches of water per week... if we only got a half an inch then we would need to take that
// half inch and tell each zone how long it needs to run." Plus his follow-up, which found a
// real bug: "sometimes the rain comes all at once like today... the numbers catch wrong due
// to timing" — hence the root-zone cap and the forward-looking week.
//
// Run: node scripts/watering-test.mjs
import { buildPlan } from '../functions/api/watering.js';

let fails = 0;
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fails++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n          got  ${JSON.stringify(got)}\n          want ${JSON.stringify(want)}`}`);
}
const z = (p, id) => p.zones.find((x) => x.id === id);

// The real seven days to 2026-08-20, from Open-Meteo.
// Sum 1.463 in of ET0 -> x0.8 Kc = 1.17 in of demand, inside Jeff's 1.0-1.5 band.
const REAL_ET = [0.235, 0.199, 0.231, 0.241, 0.197, 0.208, 0.152];
const NO_RAIN = [0, 0, 0, 0, 0, 0, 0];

// ── 1. THE BUG JEFF FOUND: a lump-sum storm is NOT the same as a spread-out week ─────
// Identical 1.70 in totals. One fell in an afternoon, one fell across seven days.
// Before his catch these produced the same answer. They must not.
console.log('\n  LUMP-SUM STORM vs THE SAME RAIN SPREAD OUT (both 1.70 in)');
const storm  = buildPlan({ et0Days: REAL_ET, rainDays: [0, 0, 0, 0, 0, 0, 1.7] });
const spread = buildPlan({ et0Days: REAL_ET, rainDays: [0.24, 0.24, 0.24, 0.25, 0.24, 0.25, 0.24] });
check('storm: gauge caught 1.70', storm.behind.rainRawIn, 1.7);
check('storm: root zone banked only 1.00', storm.behind.rainIn, 1.0);
check('storm: 0.70 ran off / drained past the roots', storm.behind.rainLostIn, 0.7);
check('storm: still 0.17 short', storm.deficitIn, 0.17);
check('spread: all 1.70 was usable', spread.behind.rainIn, 1.7);
check('spread: nothing lost', spread.behind.rainLostIn, 0);
check('spread: fully covered', spread.deficitIn, 0);
check('THE TWO NOW DIFFER', storm.deficitIn === spread.deficitIn, false);

// ── 2. Half an inch of rain -> per-zone run times (Jeff's original example) ──────────
console.log('\n  HALF AN INCH OF RAIN, NO FORECAST DATA');
const half = buildPlan({ et0Days: REAL_ET, rainDays: [0.1, 0.1, 0.1, 0.1, 0.05, 0.05, 0] });
check('target came from his band', half.targetIn, 1.17);
check('rain', half.behind.rainIn, 0.5);
check('deficit', half.deficitIn, 0.67);
check('nothing to put down beyond the deficit', half.putDownIn, 0.67);
check('verdict names the inches', half.verdict, 'PUT DOWN 0.67"');
check('Z1 minutes for the week', z(half, 1).minutesWeek, 116);
check('Z1 minutes per watering day', z(half, 1).minutesPerDay, 39);
check('Z2 minutes for the week', z(half, 2).minutesWeek, 135);
check('Z5 minutes for the week', z(half, 5).minutesWeek, 113);
check('Z1 gallons for the week', z(half, 1).gallonsWeek, 1018);

// ── 3. THE FORWARD WEEK — Jeff's request: "the amount needed in the next 7 days" ─────
console.log('\n  LOOKING FORWARD 7 DAYS');
const fwd = buildPlan({
  et0Days: REAL_ET, rainDays: [0.1, 0.1, 0.1, 0.1, 0.05, 0.05, 0],
  et0Forecast: REAL_ET, forecastRainDays: [0.2, 0.2, 0.2, 0.1, 0.05, 0.05, 0]
});
check('behind by', fwd.deficitIn, 0.67);
check('next week needs', fwd.ahead.targetIn, 1.17);
check('rain coming', fwd.ahead.forecastRainIn, 0.8);
// 0.67 catch-up + 1.17 next week - 0.80 forecast = 1.04
check('put down over the coming week', fwd.putDownIn, 1.04);
check('run times follow the ACTIONABLE number', z(fwd, 1).minutesWeek, 181);

console.log('\n  A STORM IN THE FORECAST IS CAPPED TOO');
const fwdStorm = buildPlan({
  et0Days: REAL_ET, rainDays: [0.1, 0.1, 0.1, 0.1, 0.05, 0.05, 0],
  et0Forecast: REAL_ET, forecastRainDays: [2.5, 0, 0, 0, 0, 0, 0]
});
check('2.50 in forecast, 1.00 usable', fwdStorm.ahead.forecastRainIn, 1.0);
check('the other 1.50 is reported, not hidden', fwdStorm.ahead.forecastRainLostIn, 1.5);
check('put down', fwdStorm.putDownIn, 0.84);

console.log('\n  DO NOT WATER INTO A WET WEEK');
const soaked = buildPlan({
  et0Days: REAL_ET, rainDays: [0.1, 0.1, 0.1, 0.1, 0.05, 0.05, 0],
  et0Forecast: REAL_ET, forecastRainDays: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
});
check('behind, but rain is coming', soaked.deficitIn > 0, true);
check('still nothing to put down', soaked.putDownIn, 0);
check('verdict', soaked.verdict, 'NO WATERING NEEDED');
check('and it says why', /Let the sky do it/.test(soaked.detail), true);
check('no zone runs', z(soaked, 1).minutesWeek, 0);

// ── 4. Precipitation rates, from Hunter LIT-461 scaled by measured GPM ──────────────
// Three zones, two nozzle models, three head counts. If matched precipitation rate is
// real, these must cluster — that is the cross-check on the whole approach.
console.log('\n  PRECIPITATION RATES (Hunter spec x measured flow)');
check('Z1 in/hr', z(half, 1).inPerHr, 0.461);
check('Z2 in/hr', z(half, 2).inPerHr, 0.397);
check('Z5 in/hr', z(half, 5).inPerHr, 0.473);
check('all three within 0.1 of each other',
  Math.max(...[1, 2, 5].map((i) => z(half, i).inPerHr)) -
  Math.min(...[1, 2, 5].map((i) => z(half, i).inPerHr)) < 0.1, true);

// ── 5. ET picks the point in the band, it never leaves the band ────────────────────
console.log('\n  ET STAYS INSIDE JEFF\'S 1.0-1.5 BAND');
const scorcher = buildPlan({ et0Days: [0.34, 0.35, 0.33, 0.36, 0.34, 0.35, 0.33], rainDays: NO_RAIN });
check('a 100F week caps at his 1.5', scorcher.targetIn, 1.5);
check('and says so', scorcher.et.says, 'hot week — aim at the top of your range');
const mild = buildPlan({ et0Days: [0.10, 0.09, 0.11, 0.10, 0.09, 0.10, 0.11], rainDays: NO_RAIN });
check('a cool week floors at his 1.0', mild.targetIn, 1.0);
check('and says so', mild.et.says, 'mild week — bottom of your range is enough');
check('band is always reported', half.targetBand, { minIn: 1.0, maxIn: 1.5 });

// ── 6. Boundaries ──────────────────────────────────────────────────────────────────
console.log('\n  BOUNDARIES');
check('deficit never goes negative', buildPlan({ et0Days: REAL_ET, rainDays: [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9] }).deficitIn, 0);
const noise = buildPlan({ et0Days: REAL_ET, rainDays: [0.2, 0.2, 0.2, 0.2, 0.2, 0.07, 0] });
check('0.10 in short reads as noise', noise.verdict, 'ESSENTIALLY COVERED');
check('and stays green', noise.level, 'ok');
const dry = buildPlan({ et0Days: REAL_ET, rainDays: NO_RAIN });
check('a bone-dry week flags red', dry.level, 'bad');
check('no ET data falls back to his floor', buildPlan({ et0Days: [], rainDays: NO_RAIN }).targetIn, 1.0);
check('no forecast means no ahead block', dry.ahead, null);

// ── 7. A bare total cannot be capped, and says so ──────────────────────────────────
console.log('\n  BARE TOTAL WITH NO DAILY BREAKDOWN');
const bare = buildPlan({ et0Days: REAL_ET, rain7dIn: 1.7 });
check('total is used as-is', bare.behind.rainIn, 1.7);
check('and the payload admits no cap was applied', bare.behind.capApplied, false);
check('daily data DOES get the cap', storm.behind.capApplied, true);

// ── 8. Uncalibrated zones say why, they never guess ────────────────────────────────
console.log('\n  UNCALIBRATED ZONES');
check('Z3 has no runtime', z(dry, 3).minutesWeek, null);
check('Z3 explains why', z(dry, 3).reason, 'known bad head — fix it before measuring');
check('Z4 has no runtime', z(dry, 4).minutesWeek, null);
check('Z6 is a garden, not grass', z(dry, 6).reason, 'vegetable garden, not grass — different target');

// ── 9. Honesty flags ───────────────────────────────────────────────────────────────
console.log('\n  HONESTY FLAGS');
check('calibrated zone still flagged estimated', z(half, 1).estimated, true);
check('catch-cup instructions present', /tuna cans/.test(half.catchCupHint), true);
check('PR source names Hunter', /LIT-461/.test(half.assumptions.precipRateSource), true);
check('root-zone cap is sourced', /UMN Extension/.test(half.assumptions.rootZoneCapSource), true);
check('target is attributed to Jeff', /1\.0-1\.5 in per week/.test(half.assumptions.targetSource), true);


// ── 10. Two bugs the LIVE data exposed on 2026-08-20, after deploy ─────────────────
console.log('\n  BUGS FOUND BY RUNNING IT LIVE');
// (a) A trivial shortfall said "watering optional" in the verdict while every zone still
//     printed "1 min x 3/wk". Zones must go quiet below the noise floor.
const trivial = buildPlan({
  et0Days: REAL_ET, rainDays: [0, 0, 0, 0, 0, 0, 1.17],
  et0Forecast: [0.19,0.18,0.19,0.18,0.19,0.18,0.19], forecastRainDays: [0.82,0,0,0,0.06,0.24,0.08]
});
check('verdict is the soft one', trivial.verdict, 'ESSENTIALLY COVERED');
check('and NO zone is told to run 1 min', z(trivial, 1).minutesPerDay, 0);
check('nor for the week', z(trivial, 1).minutesWeek, 0);
check('and no gallons', z(trivial, 1).gallonsWeek, 0);
// A real shortfall still runs.
const realShort = buildPlan({ et0Days: REAL_ET, rainDays: [0.1,0.1,0.1,0.1,0.05,0.05,0] });
check('a real shortfall still produces run times', z(realShort, 1).minutesPerDay > 0, true);
// (b) Exactly at the noise floor it should still stay quiet; just above it, run.
// NB: 1.03 in must be SPREAD to test the noise floor — as a single day it would be
// capped to 1.00 and the shortfall would be 0.17, not 0.14. That mistake was in the
// first version of this test, and the code was right.
const atFloor = buildPlan({ et0Days: REAL_ET, rainDays: [0.5, 0.53, 0, 0, 0, 0, 0] });
check('rain was not capped', atFloor.behind.rainIn, 1.03);
check('0.14 short stays quiet', z(atFloor, 1).minutesWeek, 0);
const overFloor = buildPlan({ et0Days: REAL_ET, rainDays: [0.5, 0.5, 0, 0, 0, 0, 0] });
check('0.17 short runs', z(overFloor, 1).minutesWeek > 0, true);

console.log(fails === 0 ? '\n  all watering checks passed\n' : `\n  ${fails} CHECK(S) FAILED\n`);
process.exit(fails === 0 ? 0 : 1);
