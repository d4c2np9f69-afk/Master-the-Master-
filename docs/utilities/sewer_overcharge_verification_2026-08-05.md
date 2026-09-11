# Sewer overcharge tracking — verification handoff for the coworker session (2026-08-05)

**Goal reminder (full context in `irrigation_gallons_model.md`):** Jeff is building a case
against **City of White House** (sewer authority, separate from WHUD/water) for a refund —
irrigation water never enters the sewer but is being sewer-billed anyway. The app tracks a
running "Total sewer overcharge" dollar figure in `localStorage.water_billing_history` as the
evidence trail. This doc is what changed on the app side today and what needs checking against
the real HA instance, which the cloud session cannot reach directly.

## What changed in `index.html` today (all pushed, commit history has full detail)

1. **Sewer rate updated** — Base $22.74 → **$23.42**, per-gallon $0.00982 → **$0.01011**.
   Confirmed from Jeff's real 5/7–6/6/26 City of White House bill (usage 6,839 gal), exact match
   to the bill's $92.56 base+consumption. `RATE_SEWER` (line ~4176) and `SEWER_BASE`/
   `SEWER_PER_GAL` (line ~7929, inside `loadUtilities()`).

2. **Garbage/Stormwater split out as their own line items.** The same bill also carries
   Sanitation Services ($24.00 flat) and a Stormwater Fee ($8.99 flat) — real charges, but flat,
   not usage-based. Added `GARBAGE_FLAT`/`STORMWATER_FLAT` constants, two new stat cells on the
   WATER utility card, both folded into `Combined` (now the true full monthly bill). **Deliberately
   NOT added to `SEWER_BASE`/`SEWER_PER_GAL`/`sewerWaste`** — those need to stay pure usage-based
   numbers for the overcharge case to hold up under scrutiny.

3. **Real bug fixed: the tracked overcharge total was using the wrong irrigation estimate.**
   The app has two ways to estimate monthly irrigation gallons:
   - `irrMonthlyGal()` — a rough guess from the programmed watering schedule (assumes every
     scheduled run happened, ignores rain delays/skips/manual overrides).
   - `irrGalFromHistory()` — pulls real B-Hyve zone on/off history from HA's recorder and computes
     actual gallons from real runtime × the configured `IRR_FLOW` GPM per zone.

   The refined, accurate number from `irrGalFromHistory()` was being calculated and briefly shown
   in the on-screen note (`#util-irr-sewer-note`), but was **never saved into
   `water_billing_history`** — the permanent record that "Total sewer overcharge tracked" sums.
   Every historical entry since billing-history tracking began (07-23) has the cruder schedule
   estimate baked into its `irrGal`/`waste` fields, not the real one. Since the schedule estimate
   assumes 100% of programmed watering ran, any month with rain delays means the OLD tracked
   number is likely an **overestimate**, not an underestimate.

   Fixed: `irrGalFromHistory()` now also overwrites the current cycle's `irrGal`/`waste` fields in
   `water_billing_history` with the real number, every time it successfully fetches, and
   re-renders the history table. Going forward, any cycle open while the app runs successfully
   will self-correct to the real number.

## What only the coworker (real LAN/HA access) can check — cloud session cannot verify these

1. **HA recorder retention.** How far back does `/api/history/period` actually go on Beehive?
   This determines whether old *closed* cycles in `water_billing_history` can be retroactively
   recomputed with real B-Hyve data, or whether the fix only helps going forward. Check
   Settings → System → Storage, or the `recorder:` config's `purge_keep_days`.

2. **Confirm `irrGalFromHistory()` is actually succeeding live**, not silently failing. Open the
   app on Jeff's phone/browser with dev tools, watch the Network tab for the
   `/api/history/period/...?filter_entity_id=switch....` calls while on HOME — should return 200
   with real state-change arrays for each B-Hyve zone switch. If they 401/timeout, the refined
   number never lands and the bug isn't actually fixed for Jeff, just in theory.

3. **Spot-check `IRR_FLOW` GPM constants against reality.** Currently hardcoded in `index.html`:
   `{1:17.2, 2:14.3, 5:5.7}` (zone → GPM). `irrigation_gallons_model.md` flags these can drift
   (clogged/replaced heads, pressure changes). If Beehive has real flow-meter data during an
   isolated single-zone B-Hyve run, compare `meter_gallons_during_run / run_minutes` against the
   coded GPM for that zone — recalibrate if they've drifted meaningfully.

4. **Cross-check `sensor.water_flow`/meter readings for gaps.** If the RTL-SDR meter reader had
   any dropouts during a billing cycle already in `water_billing_history`, that cycle's `gal`
   total (and everything downstream: `water`, `sewer`, `irrGal`, `waste`) may be understated —
   independent of today's fix, worth a sanity pass while in there.

5. **Pull the live `localStorage.water_billing_history` off Jeff's actual device** (or via remote
   debugging) after the app's been open through at least one full watering cycle post-fix, and
   confirm `irrGal`/`waste` for the current cycle actually changed from the schedule-estimate
   value to something that lines up with real B-Hyve run durations for that period.

## Going forward

Jeff is sending printed City of White House / WHUD bills as they arrive. Cloud session's job each
time: cross-check the bill's printed Base/Consumption/Garbage/Stormwater/Total against what the
app shows for that same cycle in `water_billing_history`, flag any mismatch beyond normal
rounding, and treat a real mismatch as a signal to re-derive rates from the new bill (same as this
session did on 08-05) rather than assume the app's stale constants are still correct.
