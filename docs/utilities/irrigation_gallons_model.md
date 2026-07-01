# Irrigation gallons model — convert B-Hyve run-time → gallons (Jeff's idea, 2026-07)

**Goal:** B-Hyve only records *how long* each zone ran (no flow sensor). The water
meter (once live) measures gallons. Combine them: calibrate a **per-zone flow rate**
from the meter, then convert the full run-time history — past AND present — into
gallons + cost. **Blocked on: water meter reading live in Beehive.** The run-time
history already works (`/api/irrigation` → `history[]`).

## Algorithm
1. **Calibrate per-zone GPM.** For runs where only one zone watered, `GPM_zone =
   meter_gallons_during_run / run_minutes`. Keep the **median across many runs** per
   zone (rejects household-use noise). Store `{zone: GPM}` (localStorage or HA).
2. **Back-fill past runs:** `gallons = run_minutes × GPM_zone` for every historical
   run — including runs from before the meter existed.
3. **Present/live:** prefer the **measured** meter delta during the run; fall back to
   the GPM model when meter data for that window isn't available.
4. **Cost:** `gallons × WHUD rate` (base $10.32 + $0.00908/gal per current bill).

## What makes it reliable (the gotchas)
- **Clean calibration windows:** B-Hyve runs zones **sequentially**, usually **5–7 AM**
  when household water use is near zero → naturally isolated windows. Use the median
  over many samples so an occasional toilet/faucet doesn't skew a zone's GPM.
- **Meter time resolution:** align run start/end to the meter's report timestamps
  (Itron ERT interval / Kamstrup reads); smart zones run 10–20 min so straddling a
  5-min interval is minor. More samples → tighter estimate.
- **Measured vs. estimated — label it:** runs matched to real meter data = *measured*
  (solid); pre-meter back-filled = *estimated* (dashed/flagged). Never show a model
  as a measurement.
- **Drift:** heads clog/replace, pressure changes → recalibrate GPM on a rolling basis.

## The WHY — sewer deduct / recoup sewer fees (Jeff's goal)
Sewer is billed on water usage assuming it all hits the drain, but **irrigation water
never enters the sewer** — so Jeff is paying sewer treatment on lawn water. Goal: use
the gallons model to **stop overpaying sewer on irrigation** (a "sewer deduct" /
irrigation credit). Reality check:
- Utilities usually grant this via a **dedicated deduct/irrigation submeter** (physical),
  OR **winter averaging** (auto-cap summer sewer at winter avg), OR occasionally
  documented usage. **ASK WHUD** which they offer + whether a deduct meter is required.
- The DIY whole-house reading gives *derived* irrigation (run-time × GPM) — great to
  **quantify the overpayment + support the case**, but WHUD may require an actual
  deduct meter to apply the credit (easy install for Jeff — pays for itself).
- Credits are typically **forward-looking, not retroactive** — the win is stopping the
  overpay going forward, not refunding past years.
- ROI angle for the family/CFO pitch: turns the meter project into documented recurring
  $ savings.

### Jeff's actual claim (2026-07): WHUD sewer = 2× water, NO sewer meter
- WHUD reportedly does **not meter sewer** — they charge sewer as a **multiple of metered
  water usage** (Jeff says ~2×). So irrigation water (which can't be sewage) is being
  sewer-billed at that multiplier. Jeff wants **3 years of reimbursement** for the overcharge.
- **FIRST get WHUD's written sewer-calc policy / rate schedule.** The case type depends on it:
  - If it's their published tariff with no irrigation exclusion → "unfair policy," hard to
    refund retroactively, easier to fix **forward** (deduct meter / winter averaging).
  - If it **violates their own tariff or is a billing error** → real **refund** leverage.
- **Retroactive is the hard part:** no separate irrigation meter existed those 3 years, so
  the model estimates it backward — utilities resist retroactive estimates. Plan for
  "forward fix" as the likely result; pursue the refund but don't bank on it.
- **Claim plan:** (1) get sewer formula in writing, (2) quantify overcharge from the gallons
  model, (3) formal adjustment request for BOTH past refund + forward fix, (4) Angela (CFO)
  reads the tariff + writes the claim. Claude to compute the 3-yr overpayment figure + draft
  the reimbursement letter once the sewer formula + usage numbers are in hand.

## Build order
1. **Now:** "Recent Runs" list on the irrigation card = date · zone · minutes (from
   `history[]`). Leave gallons/cost columns ready (blank).
2. **When meter is live in HA:** pull meter usage, run the calibration, fill gallons +
   cost, add the usage graph (daily/weekly/monthly, by zone, measured vs estimated).
