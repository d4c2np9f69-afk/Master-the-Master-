# Electric SmartHub — real data available, instructions for the app-side upgrade (2026-08-06)

**Coworker verified this live** by logging into CEMC's SmartHub portal directly
(`cemc.smarthub.coop`, account 4501007001) and checking Home Assistant's actual state/config for
the already-installed `gagata/ha-smarthub-energy-sensor` integration (v2.2.0, HACS). All of this is
real, confirmed capability — not guessed.

## What the app currently does

`Electric` card ("This Month" + "Est. Cost") reads a single entity,
`sensor.electric_smarthub_energy_monthly_usage_4501007001_electric_smarthub_energy_monthly_usage_4501007001`
— a monthly running total, polled every 6 hours (was HA default, see fix below). "Now"/"Today" are
**estimated client-side** via a 24-bucket hour-of-day model seeded from HA recorder history
(`index.html` ~line 8117-8329, `ELEC_BASE`/`ELEC_PER_KWH` constants, `electricDayDelta()` etc.) —
SmartHub was assumed to expose no finer granularity. **That assumption is wrong.**

**Verified tonight (app-side check, 2026-08-06): the This Month/Est. Cost numbers match HA exactly**
(209 kWh, $63.04 — formula-verified: $39 base + 209 × $0.11504/kWh = $63.04). No bug in what's
there now, just missing real data that's available for the taking.

## 1. Real hourly + daily statistics already exist — no new integration needed

Confirmed via the integration's own README (fetched directly, not guessed): *"The entity only
stores the monthly value at the time it was polled. The integration also populates a historical
`statistic` which aligns the time of use with the time the energy usage actually happened."* It
explicitly creates **2 Statistics (daily, hourly)** in HA's long-term statistics database, separate
from the single monthly entity's live `state`.

**This should replace the current 24-bucket ESTIMATED Now/Today model with real data.** Query HA's
Statistics API (`history/statistics_during_period` — WebSocket-only in most HA versions, proxy
through the existing `haFetch()`/`/api/ha` pattern) for this entity's `hour` and `day` period
statistics. This is the single highest-value change here — turns an estimate into ground truth,
same upgrade class as the `irrGalFromHistory()` real-vs-estimated fix from yesterday.

Also confirmed directly in SmartHub's own web UI (Usage Explorer → Interval dropdown: Monthly /
Daily / Interval): real per-day kWh going back over a year, and real **hourly** kWh for a rolling
30-day window (labeled "Interval" in their UI, `timeFrame=HOURLY` in the URL). Matches what the
integration is already importing.

### Concrete field spec — what to build

Current stat row on the Electric card: `NOW | TODAY | THIS MONTH | EST. COST`. Proposed:

- **TODAY** — replace the ≈modeled estimate with the real sum of today's hourly statistics
  (local midnight → now). Drop the `≈`/EST chip once it's real data. Same cell, same label, just
  swap the data source.
- **YESTERDAY** *(new cell)* — sum of yesterday's real daily statistic (or sum of its 24 hourly
  stats). Straightforward now that real daily data exists.
- **PEAK HOUR** *(new cell)* — the single highest-usage hour in the last 24h, e.g. `"3-4 PM ·
  2.1 kWh"`. Directly useful for the appliance-identification idea discussed tonight (AC/dryer/oven
  cycles show up as clear hourly spikes).
- **THIS MONTH** — unchanged, already real and already correct.
- **EST. COST** — unchanged, already correct (computed from THIS MONTH × rate).
- **NOW** — leave as `—` (disabled), and please don't fake/estimate it once hourly data lands.
  SmartHub's finest real grain is hourly, not instantaneous — genuine "Now" can only come from the
  future CT-clamp hardware build. Keep it honestly blank until that exists rather than papering
  over it with another estimate.

**New sub-panel below the stat row: "Last 7 Days"** — small table or sparkline of daily kWh for the
past 7 days, source = the real daily statistics. Same visual pattern as the Water card's Billing
History table (`.util-stat`/existing Section Kit classes — no new CSS module needed). Gives a
quick usage-trend glance and sets up the appliance-identification testing Jeff wants to do next
(spot a day that stands out, then go correlate with what ran that day).

**Lower priority — account/billing fields** *(item 3 below, needs the "check attributes first"
step)*: if buildable, add as either new stat cells or a small "Billing" sub-panel:
- **BILL DUE** — `"$X.XX due Aug 21, 2026"` style
- **LAST PAYMENT** — `"$557.07 paid Jul 31, 2026"` style
- **VS LAST YEAR** — SmartHub's own live % figure, no baked-in explanatory caption (the duct-leak
  explanation is specific to today's number, not evergreen — future spikes need their own
  investigation, don't assume every future variance is explained the same way).

## 2. Poll interval fixed tonight — was still on HA's 6-hour default

Reconfigured live via Settings → Devices & Services → SmartHub Energy Integration → Reconfigure →
`poll_interval` **360 → 30** (minutes). Confirmed `reconfigure_successful`, and a fresh poll landed
immediately after (209 kWh, timestamped right at submit). SmartHub's own backend only actually
refreshes every 15-60 min per the README, so 30 min is a sensible ceiling — no benefit going lower,
real cost in extra API calls. App's "This Month" will now track much closer to real-time than the
old 6-hour-stale cadence; worth revisiting any client-side cache/staleness assumptions tied to that
old cadence if they exist.

## 3. Additional real data on the SmartHub account page — not in HA at all yet

Confirmed live in the portal (`cemc.smarthub.coop` Home page), none of this reaches HA currently:
- Current bill amount + due date (currently shows Aug 21, 2026 due date on the account)
- Last payment amount/date ($557.07 last payment, paid)
- Year-over-year usage comparison (SmartHub's own computed "% higher/lower than last year" line —
  **the 24.24%-higher figure shown right now is explained**: a real ductwork leak, since fixed by
  Jeff, not a data/tracking issue, don't flag it as an anomaly if it comes up again this cycle)

Check first whether the existing sensor already exposes any of this as `attributes` (cheap check
before building anything new) before considering scraping — lower priority than item 1.

## 4. Real current CEMC rate sheet, for the next cross-check

`cemc.org/my-account/` → scroll to "Electric Rates" → **Current Rates** button (PDF), effective
July 1, 2026. Same cross-check pattern as the other utilities: next time a real CEMC bill photo
comes in, re-derive `ELEC_BASE`/`ELEC_PER_KWH` from it rather than trusting the constants are still
current — the rate sheet is also directly fetchable now if a bill isn't handy.
