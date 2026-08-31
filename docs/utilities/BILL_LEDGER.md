# UTILITY BILL LEDGER — reconciled against the record and the meter

**Built 2026-08-31.** Purpose: stop re-deriving rates from scattered commit messages, and give the
sewer-overcharge case one place where every real bill lives. **Every future bill gets a row here.**

Jeff, 2026-08-31: *"I don't want my electric [bill] to continue to say and build that I owe $285,000
in six months. I want every billing cycle to cut off and go back to zero."*

---

## 1. Every bill on record, with the math re-checked

Rates in force: **Water $10.32 + $0.00908/gal** · **Sewer $23.42 + $0.01011/gal**
(sewer rose from $22.74 + $0.00982 — increase confirmed 08-05 from the 5/7–6/6/26 bill)

| Service period | Utility | Usage (gal) | Base | Consumption | Total | Checked |
|---|---|---|---|---|---|---|
| bill 05/28/26 | WHUD water | 3,258 | 10.32 | 29.58 | **$39.90** | ✅ exact |
| (cycle) | WHUD water | 6,839 | 10.32 | 62.10 | **$72.42** | ✅ exact |
| (old rates) | City sewer | 2,461 | 22.74 | 24.17 | — | ✅ at old rates |
| **4/7–5/7/26** | City sewer | **2,801** | 23.42 | 28.32 | **$51.74** | ✅ **new, 08-31** |
| 5/7–6/6/26 | City sewer | 6,839 | 23.42 | 69.14 | **$92.56** | ✅ exact |
| **6/22–7/22/26** | WHUD water | **6,359** | 10.32 | 57.74 | **$68.06** | ✅ **new, 08-31** |

**All six reproduce to the penny.** The rate constants in `index.html` (`WATER_BASE`/`WATER_PER_GAL`,
`SEWER_BASE`/`SEWER_PER_GAL`) are correct and current — no change needed.

Flat City of WH charges, confirmed on the 4/7–5/7 bill and matching `GARBAGE_FLAT`/`STORMWATER_FLAT`:
**Sanitation $24.00** · **Stormwater $8.99**. Deliberately excluded from the usage-based sewer math
so the overcharge case stays clean (settled 08-05 — do not fold them in).

### Bill details captured 2026-08-31
- **WHUD water**, acct `00710690-02`, meter `25394131`, bill 07/28/26, due 08/25/26.
  Reading 9640 → 15999 = 6,359 gal / 30 days. Water $68.06 + sales tax $6.64 = **$74.70** current.
  Past due $134.50 → total **$209.20** by 8/25, **$216.01** after. Name on account: **Angela M Loewen**.
- **City of White House sewer**, acct `0071-000690-03`, bill 07/01/26, due 07/15/26, service 4/7–5/7/26.
  Reading 0 → 2,801 (previous reading **0** — consistent with the meter swap `17272512` → `25394131`
  ~4/29/26). Base 23.42 + consumption 28.32 + sanitation 24.00 + stormwater 8.99 = **$84.73** current.
  Previous balance $239.82 → **$324.55** due. Name on account: **Angela Spinelli**.

⚠️ **The two accounts carry different names at the same service address** (Loewen vs Spinelli).
Flagged for the reimbursement claim, not acted on.

---

## 2. Does our meter agree with WHUD? — YES, within ~1%

Measured 2026-08-31 from `sensor.water_gallons`:

```
our meter 07-28: 16,687.4      our meter 08-31: 21,576.9
4,890 gal over 34 days = 144 gal/day
back-projected to 7/22:  15,825      WHUD's 7/22 bill reading:  15,999
difference: -174 gal  (-1.1%)
```

The back-projection uses a flat rate across a higher-usage summer stretch, so the true agreement is
tighter than 1.1%. **The meter build is accurate enough to replace bill-scanning for usage.**

⚠️ **Recorder history only reaches back to 2026-07-28.** Bills before that cannot be reconciled
against our own data — the data never existed. Do not promise otherwise.

---

## 3. 🔴 THE REAL DEFECT — the cycle resets on the wrong DAY

**Resets work. Nothing accumulates forever.** Verified from history:

```
sensor.water_month   08-01 00:00   174.3 -> 0.0
sensor.gas_month     08-01 00:00     1.7 -> 0.0
electric (SmartHub)  08-01 04:48   473.0 -> 0.0
```

**But the phase is wrong.** `sensor.water_month` has `last_reset 2026-08-01`, `next_reset
2026-09-01` — a **calendar month**, resetting on the **1st**. WHUD reads the meter on the **22nd**
(bill read dates 6/22 → 7/22). **21 days out of phase**, so the app's "this cycle" figure can never
equal the bill's Water Charges line.

- Both `water_month` and `gas_month` are defined in **`configuration.yaml`** — there are **0**
  `utility_meter` config entries, so they are NOT UI helpers.
- **Sewer has no counter at all** — sewer cost is derived from the water gallons, and the City bills
  on a **7th → 7th** cycle, roughly **2.5 months in arrears**. Water and sewer are therefore on
  three different clocks: ours (1st), WHUD's (22nd), the City's (7th).

### NOT YET VERIFIED — do not assume
- **Spire gas cycle date** — no gas bill in hand. `gas_month` resets on the 1st; whether that matches
  Spire is unknown.
- **CEMC electric cycle date** — the SmartHub sensor resets near the 1st, which *suggests* a calendar
  cycle, but no CEMC bill has been checked for this. (Note an unexplained SmartHub revision on
  07-30 23:21: 2057.0 → 422.0.)
- **`configuration.yaml` has NOT been read this session**, so no exact edit is proposed below.

### ✅ FIXED 2026-08-31 — app-side, no HA change, no risk to meter data

The correct billing-cycle code **already existed** (`waterCycleFromHistory()`), but
`sensor.water_month` took priority at the cycle-source branch, so it was dead code whenever HA's
helper existed — i.e. always. Introduced by `6abb907`, which fixed "Est. costs never populate" by
preferring HA's helper and silently swapped a billing-cycle number for a calendar-month one.

**Three changes in `index.html`:**
1. `var WHUD_CYCLE_DAY = 22` — one constant, cited to the bill's own "Read Dates 6/22 – 7/22".
2. `whudCycleKey()` and `waterCycleFromHistory()` both use it (was hard-coded `21` in two places).
3. Cycle source reordered: show a local estimate immediately, then **always** run
   `waterCycleFromHistory()` to override with the true cycle number. It no-ops silently if history
   is unreachable, so the "costs never populate" bug cannot come back.

**Verified against live meter data, 08-31:**
```
cycle started 08-22    reading 21,056.6 -> 21,591.8 gal = 535.2 gal this cycle
BEFORE (calendar month, 3,631.0 gal):  Est. Water $43.29   Est. Sewer $60.13
AFTER  (true WHUD cycle,   535.2 gal):  Est. Water $15.18   Est. Sewer $28.83
```
The calendar figure overstated water by **$28.11** and would have climbed to 09-01 instead of
resetting on 09-22. Gates: `lint-app.js` clean, `smoke-test.js` passed (374 links, 0 bad, 0 page errors).

**HA's `sensor.water_month` was deliberately NOT touched** — it stays a calendar meter and is now
only a placeholder. No `configuration.yaml` edit, no risk of resetting the meter.

**Still unknown — needs a real bill before anything is changed:** Spire gas cycle date, CEMC
electric cycle date. Do not guess these.

---

## 4. Known gaps in the sewer-overcharge evidence
- **`IRR_FLOW` covers only zones 1, 2 and 5.** Zones 3, 4 and 6 have **no entry at all**, so their
  water is not counted as irrigation — the tracked overcharge is **understated**.
- Recalibrated 08-06 to real measured GPM `{1:8.78, 2:10.09, 5:4.4}` (23–49% down from the old
  spec-sheet guesses), so the tracked total is **corrected going forward from 08-06, not accurate
  historically**.
- The 24-cycle history (`8d32625`, 07-23) lives in **`localStorage`** under `water_billing_history`
  — per-browser, per-device, and this project has blown localStorage away before. For a 3-year
  reimbursement claim that is not a durable evidence store. **Raised, not acted on.**
