# Irrigation GPM calibration — real measured data, replace IRR_FLOW (2026-08-06)

**For the cloud session to implement.** Tonight, with nothing else running in the house, ran
isolated single-zone tests on zones 1, 2, and 5 (the only three zones `IRR_FLOW` tracks), timed
precisely via HA's real switch on/off timestamps, and measured real gallons delivered via the
water meter's before/after readings once its batch caught up. This replaces the original
spec-sheet-guess constants with real, verified numbers.

## Current code (wrong)

```js
var IRR_FLOW={1:17.2,2:14.3,5:5.7}; // zone GPM (MP3500 x6/x5, MP3000 x3) — 82 psi supply, no shortfall
```

Both the assumed head counts and (for zone 5) the assumed nozzle model were wrong — see "Real
config" below, confirmed directly by Jeff (he installed the whole system himself).

## Real config (confirmed by Jeff, the installer)

| Zone | Real head count | Real nozzle model | Real arc mix |
|---|---|---|---|
| 1 | 4 | MP3500 | 2× 90°, 2× 180° |
| 2 | 5 | MP3500 | 3× 180°, 2× 90° |
| 5 | 3 | MP3000 | 2× 90°, 1× 180° |

(Zone 3 — not tracked in `IRR_FLOW` — is MP3000 with a known bad head, excluded from this test.)

## Predicted vs. measured

Predicted = official Hunter MP Rotator performance data (`LIT-461-US B 8/16` design guide, pulled
directly from Hunter's own PDF) at the recommended 40 PSI, summed per real head/arc above.
Measured = real isolated test tonight, water meter delta ÷ real HA-confirmed on-duration.

| Zone | Old `IRR_FLOW` (GPM) | Predicted (real config, 40 PSI) | **Measured (real, isolated)** | Match |
|---|---|---|---|---|
| 1 | 17.2 | 8.28 | **8.78** | 106% |
| 2 | 14.3 | 11.14 | **10.09** | 91% |
| 5 | 5.7 | 3.36 | **4.4** | 131% |

Zones 1 and 2 matched the precise Hunter-spec prediction closely (within ~10%) — strong
confirmation the system runs close to its rated performance once the real head count/arc config is
used instead of the original guess. Zone 5 ran further above prediction (only 3 heads → smaller
absolute flow, so proportionally more room for real-world pressure variance to show up); still a
real, solid, isolated measurement, just not as tight a spec-match as 1 and 2.

## Recommended fix

```js
var IRR_FLOW={1:8.78,2:10.09,5:4.4}; // zone GPM — REAL measured 2026-08-06, isolated single-zone
                                       // tests via HA switch timing + water meter delta. Replaces
                                       // spec-sheet guess (was 17.2/14.3/5.7, based on wrong head
                                       // counts/nozzle models — see irrigation_gpm_calibration_2026-08-06.md
```

**Why measured over predicted:** the case needs real-world numbers, not a theoretical calculation —
and the measured values already account for whatever real pressure/wear/arc-precision factors
exist at this specific installation, which the spec-sheet prediction can't. Use measured.

## Real, direct effect on the sewer-overcharge case

This is a large downward revision — the old constants were overestimating irrigation gallons by
49-96% depending on zone (17.2→8.78 is a 49% cut, 14.3→10.09 is a 29% cut, 5.7→4.4 is a 23% cut).
**The tracked "Total sewer overcharge" running total in `water_billing_history` has very likely
been significantly overstated this whole time** for any cycle that included real watering on these
three zones. Once this constant is updated, `irrGalFromHistory()` will self-correct going forward
automatically (per its existing real-vs-estimate overwrite logic) — but **past cycles already
closed under the old estimate won't retroactively fix themselves**, same limitation already flagged
in `sewer_overcharge_coworker_verification_2026-08-05.md` regarding recorder retention. Worth a
clear, honest note to Jeff (already given verbally) that the running total needs to be understood
as "corrected going forward from 2026-08-06," not "accurate for the whole tracked history."

## What's still missing

Zones 3, 4, 6 (back_left/back_right/garden — no `IRR_FLOW` entry at all) remain untested and
uncalibrated. Zone 3 has a known bad head per Jeff, so its real GPM would need remeasuring after
that's fixed anyway. Zones 4 and 6 have simply never been tested — same isolated-test method
applies whenever there's a quiet window to run them.
