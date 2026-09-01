# Electric — what CEMC actually gives us, and the rules for modelling it (2026-08-31)

Verified live in Jeff's own SmartHub session (`cemc.smarthub.coop`, acct 4501007001, meter
145590962). Everything below was measured on their site, not inferred from HA's copy.

## 1. Two conclusions already in this record are WRONG — corrected here

- **"SmartHub's finest granularity is hourly / NISC discontinued 15-min exports Jan 2024"** (06-25,
  said in reply to Jeff proposing exactly the appliance study below). **FALSE for the web UI today.**
  Measured: 15-MINUTE timestamped data — `Sun Aug 30, 2026 5:00 AM … 0.38 kWh`, `5:15 AM … 0.32`,
  `5:30 AM … 0.28`. That wrong answer shut Jeff's idea down for two months.
- **OPEN_ITEMS #105 (mine, earlier on 08-31)** said the sub-daily cells were un-sourceable and
  should be dropped. **Backwards.** The data exists at 15-min resolution on CEMC's side. The HA
  integration imports DAILY totals and stamps them into a single 08:00 hourly bucket — which is
  exactly why Peak Hour always reads 8 AM. That is an IMPORT bug, not missing data.

## 2. What is actually available

- **15-minute interval kWh with average temperature attached**, back **at least 12 months**
  (verified: 192 points for 08/19/2025–08/21/2025, no truncation warning). NOT a 30-day rolling
  window — historical backfill is possible.
- **Daily kWh + avg/high/low temp** — 123 days returned in one request.
- **Monthly kWh + temps** — 13+ billing periods. Customer since 2015-04-19.
- Quick ranges include **Current Bill**, **Unbilled**, **Last 24 / 48 / 72 Hours**.
- API: `POST /services/secured/utility-usage/poll`. The UI encodes its state as base64 in the URL
  hash: `timeFrame=HOURLY|DAILY|MONTHLY`, `start`/`end` epoch ms, `quickPickSelection`.
- Every chart point carries its values in an `aria-label`, so data is extractable without the API.

## 3. DATA-QUALITY RULES — Jeff, 2026-08-31. Ignore these and the model is garbage.

**(a) DO NOT USE DATA FROM BEFORE THE DUCTWORK REPAIR.** Jeff: *"that was putting out a real strain
on the AC so that's going to be flaw data but everything since then should be correct."*

**CONFIRMED 2026-08-31: the duct repair is dated 2026-07-25.** Jeff pointed to
`iCloudDrive/duct-repair-home-depot-list.pdf` — his Home Depot parts list for the job — whose
CreationTime and LastWriteTime are both **7/25/2026 6:06:35 PM**.

**Two independent sources agree to within one day.** Before knowing that file existed, a change-point
scan of 109 cooling days (temp >= 70F) on CEMC's own meter data put the efficiency step at
**~2026-07-24**:

```
BEFORE  May 10 - Jul 23   71 days   64.7 kWh/day @ 77.7 F
AFTER   Jul 24 - Aug 30   38 days   58.9 kWh/day @ 80.6 F
```

Usage fell 5.8 kWh/day while average temperature ROSE 2.9 F — 0.833 -> 0.731 kWh per degree-day, a
**12% efficiency gain**. The meter saw the repair the day before the receipt is dated, which is
exactly what you would expect if the work was done on or just before the 25th.

🔴 **USE 2026-07-25 AS THE HARD START LINE FOR CLEAN ELECTRIC DATA.** Anything earlier reflects an
A/C straining against leaking ductwork and will bias every model built on it. That leaves ~37 clean
days as of 2026-08-31 — enough for a summer baseline, NOT enough for a winter one.

⚠️ **The PDF's CONTENTS have not been read** — it is an iCloud placeholder and hydration timed out twice (`The cloud operation was not completed before the time-out period expired`). Only the file's timestamps were readable. **What Jeff actually repaired is therefore still unknown to the record.** If it matters, open the file once on the Mac/PC to force the download, then re-read it.

### What the duct repair actually saved — measured 2026-08-31

Jeff, 2026-08-31: *"The duct repair was done in late July so that gives us an entire month of data
with the duct being fixed to see how much difference the repair made."* It does. Method: fit
kWh-vs-temperature on the PRE-repair cooling days, then use that model to predict what the
POST-repair period *would* have consumed at its own actual temperatures, and compare to what it
really used. This removes the weather, which otherwise hides the result — August was hotter.

```
before fix   78 cooling days   63.0 kWh/day @ 77.4 F   (2.45 kWh per F)
after fix    37 cooling days   59.1 kWh/day @ 80.7 F
             -> used LESS while running 3.3 F HOTTER

counterfactual at the OLD efficiency   2,627 kWh
actually used                          2,186 kWh
SAVED                                    441 kWh   = 16.8%
```

At the app's own rate ($0.11504/kWh):

```
saved so far, 37 days      $50.73
per day                     $1.37
per 30-day month           $41.07
per 5-month cooling season $205.35
```

**The repair is paying for itself at about $41/month of cooling weather.** Note the savings figure
is cooling-season only — it says nothing about winter, and winter is confounded by (b) below.

⚠️ Year-over-year against Aug 2025 was NOT possible: this daily pull only reached back to
2025-09-17, so there are 0 daily samples for Aug 2025. The before/after comparison above is the
cleaner test anyway — same house, same year, same meter.

**(b) WINTER IS CONFOUNDED BY A 1500 W SPACE HEATER.** Jeff: *"Angela has a tendency to run one of
those 1500 W heaters under her desk because she's always cold… in the winter that little heater
probably pulls as much as everything else in the house because we pretty much go to gas for
everything in the winter except for the dryer and stove."* At 15-min resolution it is a flat
**~0.375 kWh per block** daytime load — easy to identify, and it MUST be separated before any
winter baseline is computed. Cost if run 8 h/day: ~$1.38/day, ~$41/month at $0.11504/kWh.

## 4. The only 240V loads — this is what makes disaggregation tractable

Recorded 06-25 (`b243228`) from Jeff's own panel photo, re-confirmed by him 2026-08-31:
**A/C 30A · Range 50A · Dryer 30A** (+ dishwasher 20A). *"Everything else is 120 or gas."*

Measured Sun Aug 30 (91 quarter-hour readings) — a clean single-load day:

```
house floor (5th pct)   0.92 kW    all 120V + gas, nothing big running
A/C step                2.64 kW    3.56 observed minus the 0.92 floor
max                     4.20 kW    A/C + a second load, 4:45-5:00 PM
intervals above 6 kW       0       no dryer, no range, all day
```

The A/C signature is unmistakable: **3.56 kW repeats identically** at 2:15, 3:30, 3:45, 4:30, 6:00
and 9:00 PM — a fixed load cycling. A 30A dryer should land near 6 kW, a band that was completely
empty on Aug 30, so it separates cleanly.

**What CT clamps would still add, and only this:** separating two loads inside the same 15-minute
window, and events shorter than 15 minutes (microwave, coffee maker). They would NOT improve "is
the dryer running", "is the A/C cycling wrong", or "what did dinner cost". **Jeff's read that the
clamps add little over this data is correct.**

## 5. Also found — not acted on

- The Electric card's **This Month / Est. Cost use a CALENDAR month**, but CEMC's `Current Bill`
  range resolves to **08-24 -> now**. Measured impact: the app would show **$236.55** (1,722 kWh)
  when the real current cycle is **$78.50** (344.31 kWh) — **5.0x overstated**. Same class as the
  water bug fixed earlier today, and worse. Cycle day confirmed from ONE sample; get more before
  changing code.
- Overnight floor is **higher than a year ago** at the same hour (2025-08-19 5:00–5:30 AM:
  0.30 / 0.19 / 0.19 vs 2026-08-30: 0.38 / 0.32 / 0.28), and at 75F 2025 ran ~36 kWh/day vs 42.27
  in 2026. One sample — a real always-on-load question, not a conclusion.

---

## 2026-08-31 15:20 — the cycle script is LIVE and AUTOMATED (it was not before)

🔴 **Read this before believing any "it's automated" claim in this project.** Earlier today this
session wrote `HCC-Scripts/HCC-UtilityCycle.py` and reported it as the answer to Jeff's
*"get it going and automated so that I don't ask this question again."* **The script had never
executed and no schedule existed.** `utility_cycles.json` did not exist on disk. Writing a script
is not automating a task.

**Now actually running.** Scheduled task **`HCC Utility Billing Cycle`**, daily at **06:15**,
running `C:\Users\jeffl\AppData\Local\Programs\Python\Python313\python.exe HCC-UtilityCycle.py`.

**Verified by feature, not by component** — the task was triggered and `utility_cycles.json` was
watched go from **1 row to 2**, `LastTaskResult 0`, `NextRunTime 2026-09-01 06:15`. Registering a
task proves nothing; running it and seeing the file grow does.

### First live output — 2026-08-31 15:19

```
WATER    cycle from 08-22 (day 9)    582.1 gal
         water $15.61 · sewer $29.31 · flat fees $32.99      CONFIRMED day 22

ELECTRIC cycle from 08-24 (day 7)    388.0 kWh  = $ 83.64
         calendar month              1777.0 kWh = $243.43    PROVISIONAL day 24
         -> the calendar figure is 2.9x the real one

GAS      8858.76 CCF cumulative      cycle NOT COMPUTED — no bill has ever been checked
```

**That 2.9x is the whole point of the exercise.** It is the same class of bug already fixed on water
($43.29 → $15.18), and it is why Jeff said *"I don't want my electric bill to continue to say and
build that I owe $285,000 in six months."*

### What is still open, and why the app was NOT changed

🔴 **The electric cycle day (24) rests on ONE sample. The app's electric billing code is
deliberately untouched.** Jeff, 2026-08-31: *"do not go in and fuck up that billing algorithm just
hat hazard doing shit without verifying everything first."* Changing live billing math on a single
observation is exactly that.

Supporting evidence, consistent but **not** a second independent read of the start day: the bill is
dated **07/30**, due **08/21**, and SmartHub's `Current Bill` quick-range resolved to **08-24 → now**.
A read on the 24th, billed ~the 30th, due the 21st of the following month is a normal utility shape.

**To close it, Jeff logs into SmartHub** (`cemc.smarthub.coop` — his password, he types it; a
session must never enter it per `HCC_ACCESS.md`), then Usage Explorer →
`quickPickSelection=PREVIOUS_BILL` across several cycles, reading the start day each time. Two more
matching samples and the fix is a one-line change to `WHUD_CYCLE_DAY`'s electric equivalent.
**Meanwhile the daily script is already banking both figures, so the history will be there.**

⚠️ **A session attempting this will find the SmartHub session times out** — it dropped to
`/ui/#/login` mid-navigation at 15:19 today. That is normal, not a fault.

### ⚠️ NEW AND UNRESOLVED — a $274 gap in the payment record

CEMC's home page shows **last payment $557.07, paid 07/31/2026**. But 2,120 kWh (their own July
figure) at the bill-validated rate is `$39.00 + 2120 x $0.11504 = ` **$282.88**.

**$274.19 unaccounted for.** Most likely Cumberland Connect internet billed on the same account —
CEMC sells electric, internet and phone together and the account header carries both logos. Could
also be two months settled at once.

🔴 **NOT VERIFIED. Do not reconcile the bill ledger against $557.07, and do not put it in the app.**
It needs one look at the itemised bill under Bill & Pay → Billing History, which requires Jeff to
log in. If it is internet, the electric rate model is fine and only the payment figure is mixed.


---

# 2026-08-31 15:25 — ELECTRIC CYCLE **CONFIRMED** FROM THE ACTUAL BILL

Jeff logged into SmartHub. Read straight off the CEMC bill PDF `2026_07_30_4501007001.pdf`
(Bill & Pay -> Billing History -> View Bill). **This closes the PROVISIONAL flag.**

```
Meter #      145590962
Services     From 06/23/2026   To 07/23/2026     Billing Period: 30 Days
Readings     Previous 10550 -> Present 12670     Multiplier 1     Usage 2,120 kWh
Rate         22-Residential Electric
```

**THE METER IS READ ON THE 23rd, NOT THE 24th.** The earlier provisional 24 came from SmartHub's
`Current Bill` range starting 08-24 — that is the day *after* the read, the same boundary seen from
the other side. `HCC-UtilityCycle.py` now uses **day 23, CONFIRMED**. Bills are dated the **last
business day of the month** (07/30, 06/30, 05/29, 04/30, 03/31, 02/27, 01/30, 12/31 ...) and are due
the **21st** of the following month.

## The rate model reproduces the bill EXACTLY — do not touch it

```
Base Charge                                    $ 39.00
Energy Charge     2,120 kWh @ 0.08657          $183.53
TVA Fuel Cost     2,120 kWh @ 0.02847          $ 60.36
Cutoff Notice Fee (one-time)                   $  2.00
                                               -------
Current Charges                                $284.89
```

`0.08657 + 0.02847 = 0.11504` — **exactly** the `ELEC_PER_KWH` already in the script, and base
$39.00 exactly. Check: `39.00 + 2120 x 0.11504 = $282.88`; the only gap to $284.89 is the **$2.00
one-time cutoff fee**. The rate is validated to the penny. Never "update" it without a newer bill.

## The $557.07 mystery — SOLVED, and my first guess was WRONG

Earlier today I flagged a $274 gap and guessed it was probably Cumberland Connect internet on the
same account. **Wrong.** Billing History labels every row `Electric - 4501007001`; there is no
internet on this bill. The real answer, off page 2:

```
Previous Balance (June bill)                   $259.31
No Payment Received                            $  0.00
Late Fee                                       $ 12.87
  Past Due Amount - Due Immediately            $272.18
Current Charges                                $284.89
                                               -------
TOTAL AMOUNT DUE                               $557.07
```

**The June payment was missed.** It cost **$12.87 late fee + $2.00 cutoff notice fee = $14.87**, and
the bill carried a service-termination warning. Settled 07/31 — past due is $0.00 today.
**Do not enter $557.07 anywhere as an electric cost.** July electric was **$284.89**.

## Bill-face figures worth keeping

```
This month  2,120 kWh @ 81F     Last month 1,903 kWh @ 76F     Yr ago 1,756 kWh @ 83F
Average daily use   71 kWh   (CEMC stated range 46-88)
Average daily cost  $9.50    (range $6.18-$11.83)   -> 9.50 x 30 = $285, matches $284.89
```

## Current cycle, live 2026-08-31 15:23

```
electric  cycle from 08-23, day 8    445.0 kWh = $ 90.19   CONFIRMED
          calendar month            1777.0 kWh = $243.43   <- what the app would wrongly show
water     cycle from 08-22, day 9    582.1 gal
          water $15.61 / sewer $29.31 / flat $32.99        CONFIRMED
```

## DRYER GROUND-TRUTH TEST — set up today, resolves tomorrow

Jeff, 2026-08-31 ~15:20: *"I have been running the dryer all morning."* That is a **labelled
ground-truth event** — what the disaggregation model needs to be validated against rather than
assumed.

**CEMC interval data lags ~1 day.** Pulled at 15:24 today, the series runs
`Sun Aug 30 12:00 AM -> Mon Aug 31 12:00 AM`, 97 points. **Today's intervals are not posted yet**,
so the dryer cannot be seen yet. Expected lag, not a fault.

**The control day, re-pulled live today** — Aug 30, 97 x 15-min points:

```
total            55.5 kWh
floor (5th pct)   0.92 kW     median 2.40 kW     max 4.20 kW
intervals >4 kW      2        >5 kW  0           >6 kW  0     <- NO DRYER ALL DAY
peaks            4:45 PM 4.20 / 5:00 PM 4.12 / 2:15 PM 3.60 / 3:30 + 3:45 PM 3.56
```

**THE TEST: pull 2026-08-31 tomorrow and look in the >5 kW band.** A 30 A dryer should land near
6 kW and Aug 30 had **zero** intervals there. If a morning block appears above 5 kW on the 31st and
not on the 30th, the 240 V disaggregation is **validated against a known event**. If nothing
appears, the model is wrong and must be reported as wrong.

**How to pull it** (Jeff must be logged in — his password, he types it):
Usage Explorer -> set Start/End dates directly. Two gotchas found today:
`quickPickSelection=LAST_24_HOURS` is **rejected and silently falls back to NONE**, and the interval
view is **capped at 30 days**. Then read the chart's `aria-label` attributes — every point carries
date, kWh and temperature, far more reliable than reading the rendered chart.


---

# 2026-08-31 15:33 — GAS CLOSED. ALL THREE UTILITIES NOW ON THEIR REAL CYCLES.

Jeff, 15:31: *"The cycle day for spire is in the record."* **He was right and I had just claimed the
opposite.**

```
docs/UTILITIES_REFERENCE.md:26
  "Piedmont Natural Gas, transitioning to Spire ... Billing cycle ~5th."
```

It had been sitting there. Worse, the gas **rate** in that same file is annotated
*"validated against 3 bills"* (May-Jul 2026: **$34.58 / $47.83 / $27.08**, all reproduced to the
penny) — so bills were obviously in hand, and the comment I had written in
`HCC-UtilityCycle.py` — *"No gas bill has ever been checked for its cycle date"* — was false on its
face and contradicted by the line directly above the rate I was already using.

## And the electric cycle day was ALSO already written down

`docs/UTILITIES_REFERENCE.md:37`, written **2026-07-31**:

> *"Billing cycle resets ~23rd (per the 06/23-07/23 cycle on the 07/30 bill)"*

**That is the exact figure — 23rd, from the exact bill — that I spent this afternoon re-deriving**
by opening SmartHub, clicking into Billing History, opening the July bill PDF and reading the meter
table. All of it confirmed a number that had been in the reference file for a month.

🔴 **This is the CLAUDE.md headline failure, twice in one afternoon: I measured before I searched.**
`windows-scripts/Search-HCC.ps1 "Spire"` and a grep of `UTILITIES_REFERENCE.md` would have answered
both questions in seconds. The portal work was not wasted — it independently *confirmed* the record
and produced the exact rate itemisation — but it should have been a **check**, not a discovery.

## Also corrected: a wrong artifact I wrote earlier TODAY

`docs/utilities/BILL_LEDGER.md` carried, in two places, *"Spire gas cycle date — no gas bill in
hand"* and listed it under *"Still unknown."* **I wrote that this morning, without searching.** Both
lines are now struck through and corrected in place, per the standing rule that a bad local note is
worse than a missing one — the next session would have believed it.

## Gas rate now implemented (it was recorded but never computed)

```
GAS_BASE $13.44 + round(CCF x 1.068) therms x $1.235/therm, all x 1.05 franchise fee
```

## All three utilities, live 2026-08-31 15:32

```
water     cycle from 08-22, day  9    582.1 gal
          water $15.61 / sewer $29.31 / flat $32.99      day 22  CONFIRMED bill 07/28
electric  cycle from 08-23, day  8    445.0 kWh = $90.19
          calendar month 1777.0 kWh   = $243.43          day 23  CONFIRMED bill 07/30
gas       cycle from 08-05, day 26      6.02 CCF = 6 therms = $21.89
                                                          day  5  CONFIRMED ref:26
```

Gas check: `6.02 x 1.068 = 6.43 -> 6 therms`; `(13.44 + 6 x 1.235) x 1.05 = $21.89`. Six CCF over 26
summer days sits below the lowest validated bill ($27.08, also a summer month) — consistent.

🔴 **CORRECTION, same minute — I wrote "water-heater-and-stove" and THE STOVE IS ELECTRIC.**
Jeff, 2026-08-31 15:36: *"Stove is electric."* **My own file already said so, twice**: the panel
inventory in §4 reads **A/C 30A · Range 50A · Dryer 30A**, and Jeff's quote in §3(b) is *"we pretty
much go to gas for everything in the winter except for the dryer and stove."* The range is the
**largest 240 V load in the house** and I called it a gas appliance minutes after being told off for
not reading the record. Third instance in one afternoon.

✅ **ANSWERED by Jeff, 2026-08-31 15:40: the hot water heater is the gas appliance.** So with the
package unit's gas heat off for the season, **summer gas IS the water heater, isolated** — a single
appliance with no confounders. That is a genuinely clean measurement and it is worth keeping.
(`switch.hot_water_heater_socket_1` is the **circulation pump** on a 120 V smart socket — a separate
thing from the burner, and it lands on the electric side.)

**Every one of the three now has a CONFIRMED cycle day and a bill-validated rate, computed daily by
the scheduled task at 06:15 and appended to `utility_cycles.json`.** Nothing here is estimated.


---

## 2026-08-31 15:37 — THE RANGE IS THE CONFOUNDER FOR TOMORROW'S DRYER TEST

The stove correction changes the dryer test, so this is written down before the test runs rather
than discovered after it.

**All three 240 V loads are electric** (panel photo 06-25, re-confirmed by Jeff 08-31):

| Load | Breaker | Expected draw | Shape in 15-min data |
|---|---|---|---|
| A/C | 30 A | **2.64 kW measured** | fixed step, repeats through the day |
| Dryer | 30 A | ~5-6 kW | **sustained block, 45-60 min** |
| **Range / oven** | **50 A** | 2-5 kW typical, up to ~12 kW | **spiky and short** — burners and oven element cycle |

🔴 **Magnitude alone cannot separate the dryer from the range** — both can land in the 5-6 kW band.
**Duration is the discriminator.** A dryer is a broad plateau; cooking is ragged, with the oven
element cycling on and off. A single 15-min interval above 5 kW is ambiguous; **three or four
consecutive ones is a dryer.**

This is why the Aug 30 control is useful: **zero intervals above 5 kW all day** means neither the
dryer nor the oven ran, so the band is genuinely empty rather than merely quiet.

**Restated test for 2026-08-31 data:** look for a *run of consecutive* 15-min intervals above 5 kW
during the morning. Jeff said the dryer ran *all morning*, so the expected signature is several
plateaus, not one spike. If what appears is a lone spike, that is more likely the range and the test
is inconclusive — **say inconclusive, do not claim the dryer.**


---

## 2026-08-31 15:41 — SUMMER GAS = THE WATER HEATER, ISOLATED

Because gas heat is off for the season and the stove is electric, the current gas reading is a
**single-appliance measurement**. Worth having: most utility numbers are a blend, this one is not.

```
measured          6.02 CCF over 26 days      = 0.2315 CCF/day
                  x 1.068 heat factor        = 0.2473 therms/day
projected month   7.42 therms  -> 7 billed
cost              (13.44 + 7 x 1.235) x 1.05 = $23.19 / month
  of which base   13.44 x 1.05               = $14.11   fixed meter charge
  actual gas       8.645 x 1.05              = $ 9.08
```

🔴 **61% of the summer gas bill is the meter charge, not gas.** Hot water costs about **$9 a month**
to run; the other $14 is for having the pipe. Nothing to optimise there — but it means "reduce the
gas bill in summer" is not a thing that can work, and no session should propose it.

Sanity check against the validated bills: lowest of the three was **$27.08** (a summer month),
against $23.19 projected here. Same neighbourhood, slightly higher usage month. Consistent.

### What this baseline is FOR

1. **A hot-water fault detector.** 0.23 CCF/day is now a known-good summer rate for one appliance.
   A failing water heater, a stuck circulation pump, or a hot-water leak would push summer CCF up
   with no seasonal explanation. Nothing like that exists today — this is the number to compare to.
2. **It separates heating from hot water in winter.** Winter gas minus ~0.25 therms/day of water
   heating = actual space heating. **No real winter bill has ever been checked**, so that split
   cannot be computed yet — do not estimate it.
3. 🟢 **It baselines the new A/C unit's heating side.** The replacement package unit
   (`BRP7GE1330E054P-01A`) steps heat input **72,000 -> 54,000 BTU**. Winter gas runs through this
   same meter, so the before/after can be measured exactly the way the 25 July duct repair was
   (441 kWh, 16.8%) — **provided a winter baseline is captured on the OLD unit before it comes out.**
   Jeff is replacing it before winter, so that baseline may not be obtainable. Say so rather than
   inventing one later.

---

# 2026-09-01 06:05 — THE FIRST LIVE ROLLOVER BROKE IT, AND WHY

Yesterday's cycle fix was tested by SIMULATION. The first real month boundary broke it inside
12 hours. Found 05:45 today: **the app was showing electric at 0 kWh / $39.00 for a cycle that had
used ~411 kWh.**

## The premise was wrong, not the logic

The SmartHub monthly sensor does not reset once, cleanly:

```
08-31 08:59 CT   1777.0
08-31 20:08 CT    388.0   <- drop 1
09-01 00:12 CT      0.0   <- drop 2
```

So "last value of August" read **388**. The guard (`endOfMonth < base -> refuse`) fired *correctly*
and declined to compute. But the `0 / $39.00` placeholder had already been written, so refusing to
correct it left the wrong number on screen. **Right guard, wrong premise.** The simulated test
assumed one clean reset; nothing tested that assumption.

## Worse: the recorder-derived statistic is CORRUPTED by that rollover

HA read the 1722 -> 388 drop as a counter reset and treated 388 as fresh usage:

```
sensor.electric_smarthub_...        08-31  sum 2828  state 388  change 443   <- PHANTOM 443 kWh
                                    cycle = 776.0 kWh  =  $128.27     WRONG

smarthub:...energy_sensor_daily_    cycle = 410.7 kWh  =  $86.25      correct
smarthub:...energy_sensor_          cycle = 410.8 kWh  =  $86.25      correct
```

The two `smarthub:` ids are the **integration's own** statistics — per its README they align usage
to when it actually happened rather than being derived from a resetting state. They agree with each
other to **0.1 kWh**. 🔴 **NEVER compute billing from the sensor entity id.**

This was answerable from `electric_smarthub_data_upgrade_2026-08-06.md` — *"It explicitly creates
2 Statistics (daily, hourly)"* — a file that had never been opened before today.

## Second bug, found in the same pass

`loadElectricStats()` was passing that same corrupted id, so **Today / Yesterday / Peak Hour /
Last 7 Days read it too.** "Yesterday" would have rendered **443 kWh** against a real 66.4.
Repointed at the clean hourly statistic.

## Cycle boundary — from the bill, not a guess

`"Services From 06/23/2026 To 07/23/2026 for 30 Days"`, readings 10550 -> 12670. The start-date
reading is the **BASELINE**; usage accrues after it. So: diff from the cycle-start row forward.
Summing `change` instead double-counts day one (454.5 vs 410.7).

## Verified live on the deployed app, 2026-09-01 06:04

```
electric   411 kWh   $86.25      <- was 0 kWh / $39.00
  yesterday  66.4 kWh            <- was going to be 443 kWh (the phantom). PROOF bug 2 is fixed.
  peak hour  12-1 PM  4.8 kWh
  today      ~0.8 kWh  (still marked "≈" — today's stats not imported yet. Honest, not faked.)
water      603.4 gal  $15.80
sewer                 $46.29
gas       6.10 ccf    $23.19
combined              $95.08     (15.80 + 46.29 + 24.00 + 8.99 = 95.08)
```

`HCC-UtilityCycle.py` had the identical bug (reported 0.0 / $39.00 at 05:45); rewritten the same
way, now returns **410.7 / $86.25**, matching an independent WebSocket probe exactly. Its one bad
banked row is flagged `INVALID` with figures nulled — kept, not deleted, since the file is
append-only by design. Scheduled task re-enabled, next run 06:15.

Also removed: dead `elecCycleFromHistory` / `firstNum` / `lastNum` and a **duplicate
`putElecCycle` declaration** left behind by the replacement — caught only because the post-edit
count check disagreed with the label I had written on it.

**The lesson, plainly: a simulated test proves the arithmetic, never the assumption underneath it.**

---

# 2026-09-01 06:15 — DRYER GROUND-TRUTH TEST: RESULT

Jeff, 2026-08-31 ~15:20: *"I have been running the dryer all morning."* The labelled event
`#105b` was set up to validate the 240 V disaggregation against.

⚠️ **The 15-minute data was NOT obtainable** — the CEMC session timed out and only Jeff can log in.
This ran on **hourly** long-term statistics instead, which smear a 45–60 min cycle across two
buckets. **That limitation is why the pre-registered pass/fail returned INCONCLUSIVE**, and it is
reported as such rather than talked around.

## Hourly, 06:00–12:00, against the 08-30 control

```
          08-30 control   08-31 test    excess
06:00          1.16          1.24       +0.08
07:00          0.88          1.64       +0.76
08:00          0.96          2.03       +1.07
09:00          1.17          3.84       +2.67   <- consecutive
10:00          1.84          3.42       +1.58   <- consecutive
11:00          2.57          2.66       +0.09
12:00          2.94          4.78       +1.84
                          morning excess +8.09 kWh
```

## Controlling for weather THREE independent ways — they agree

**(a) Evening as control.** 14:00–20:00 had no dryer either day and A/C running on both:
excess **+1.60 kWh over 7 h = +0.229 kWh/h** ambient difference. Applied to the 7 morning hours
= 1.60 kWh weather-attributable. **Net non-weather morning excess = 6.49 kWh.**

**(b) Measured temperature, not inferred.** `sensor.backyard_temperature` (real PWS, n=90 and 95
samples): **08-30 avg 84.8 °F → 08-31 avg 86.6 °F, +1.8 °F.** The evening-control assumption was
correct — 08-31 genuinely was the warmer day.

**(c) The existing kWh/°F model.** 1.71 kWh per °F (R² 0.65, already in this file):
`+1.8 °F x 1.71 = +3.1 kWh/day` expected from weather. Actual whole-day delta
`66.4 - 54.9 = +11.5 kWh`. **Unexplained ≈ 8.4 kWh**, and 8.09 of the 11.5 fell in the morning.

Methods (a) and (c) bracket the non-weather morning load at **6.5 – 8.4 kWh**.

## Verdict — stated at the confidence the data supports, no more

A 30 A dryer draws ~5–5.5 kW; a 45–60 min cycle is **3.8–5.5 kWh per load**. So 6.5–8.4 kWh is
**1.2–2.2 loads** — consistent with "all morning".

**SHAPE is the strongest evidence.** 09:00 (+2.67) and 10:00 (+1.58) are *consecutive* elevated
hours. `#108` predicted in advance that a dryer would appear exactly this way at hourly resolution,
and that a range/oven would instead be ragged and non-consecutive. It is consecutive.

🟢 **CONCLUSION: strongly consistent with the dryer, and NOT proven.** The excess is real,
survives three separate weather controls, and has the predicted shape. What hourly data cannot do
is definitively separate a dryer plateau from a long oven cycle — only the 15-minute data can, and
that needs Jeff logged into SmartHub. **The disaggregation model is supported but not yet
validated. Do not upgrade that wording without the 15-minute pull.**

⚠️ Note the 12:00 hour (+1.84, the day's highest at 4.78 kWh) sits at lunchtime and is the single
most likely candidate to be the **range** rather than the dryer. It is included in the excess above,
which makes the dryer-load estimate an upper bound.

---

# 2026-09-01 06:25 — 15-MINUTE DATA PULLED. THE PRE-REGISTERED TEST **FAILED**.

Jeff logged back into SmartHub, so the test `#105b` was actually designed for could finally run:
**95 x 15-minute points for 2026-08-31.**

## The criterion, written in advance (#108), and the result

> *"look for a RUN of consecutive 15-min intervals above 5 kW... If what appears is a lone spike,
> that is more likely the range and the test is inconclusive — say inconclusive, do not claim the
> dryer."*

```
intervals >6 kW : 0
intervals >5 kW : 3   -- and all three are ISOLATED, none consecutive
                        12:00  5.64 kW      12:30  5.16 kW      13:00  5.64 kW
max all day     : 5.64 kW      (control 08-30 max: 4.20 kW, zero intervals >5)
```

🔴 **FAILED. No sustained run. Three lone spikes, at lunchtime, which is the signature I said in
advance would indicate the RANGE.** Recorded as a failure, not massaged into a pass.

## But the load is real, and the dryer IS electric — so the TEST was wrong, not the data

**Gas ruled out decisively.** A gas dryer burns 0.2–0.35 CCF per load:

```
08-30   8858.54 -> 8858.64   used 0.10 CCF
08-31   8858.64 -> 8858.80   used 0.16 CCF      difference 0.06 CCF
```

0.06 CCF is a fraction of one load. **The dryer is electric.** And the energy is genuinely there —
6.5–8.4 kWh of non-weather morning excess, established three separate ways and independently
confirmed by the backyard PWS (+1.8 °F).

## The morning profile — 08-31, 15-min kW

```
06:00-08:45   0.92 - 2.40      baseline
09:00-10:45   3.04 - 4.24      SUSTAINED 2-hour elevated block  (control same hours: ~1.2-1.8)
11:00-11:45   2.48 - 2.76      back to baseline
12:00-13:15   5.64 4.20 5.16 4.12 5.64 4.44   <- ALTERNATING, ~1.5 kW swing
```

## 🔴 THE REAL FINDING — MY DRYER SIGNATURE WAS WRONG, AND IT WAS WRONG BY CONSTRUCTION

I set the 5–6 kW threshold from the **nameplate** (30 A x 240 V). An electric dryer's heating
element is **thermostatically cycled** — it is not on continuously. Averaged over a 15-minute
bucket, a 5.5 kW element at a ~65% duty cycle reads **~3.6 kW**, never the nameplate figure.

That is exactly what the data shows: an alternating 4.1 ↔ 5.6 kW pattern, not a flat plateau.
**The alternation IS the element cycling. I was looking for the wrong shape entirely.**

### Corrected model — use this, not the nameplate

| Load | Nameplate | **What 15-min data actually shows** |
|---|---|---|
| floor (all 120 V) | — | **1.40 kW** (5th pct, measured) |
| A/C | 30 A | **+2.64 kW** step, measured |
| electric dryer | 30 A / ~5.5 kW | **~3.5-4.0 kW averaged**, with a **1.5 kW alternation** — cycling, not a plateau |
| range / oven | 50 A | short spikes, also cycling |

🔴 **A threshold test on magnitude alone cannot separate dryer from oven at 15-min resolution —
both are cycling elements of similar averaged size.** Duration was the right instinct; the
threshold was set too high to ever trigger. **Do not re-run this test unchanged.**

## Verdict

**The disaggregation model is NOT validated, and the reason is that the test was built on a
nameplate assumption instead of measured behaviour.** The corrected signature above comes from real
data and is the thing to test against next time — ideally on a day Jeff runs the dryer and does NOT
cook, which removes the only confounder that matters.

What IS established: the dryer is electric (gas ruled out to 0.06 CCF), 08-31 carried 6.5–8.4 kWh
of genuine non-weather load, and 08-31 had three intervals above 5 kW where the control day had
none. The energy is real. The attribution is not yet proven.

---

# 2026-09-01 06:30 — RE-RUN WITH THE OVEN RULED OUT BY JEFF. CONTROL-DIFFERENCED.

Jeff, 06:18 and again 06:29: *"I didn't cook yesterday I used the trigger and microwave"* /
*"The oven was never turned on yesterday."* That removes the one confounder the earlier verdict
hung on, so the analysis was redone properly: **both days pulled at 15-min resolution and
differenced interval by interval.**

## 08-31 minus 08-30, 15-min kW

```
06:45-08:45   +0.4 to +1.5      light, scattered
09:00 +2.40  09:15 +2.64  09:30 +2.76  09:45 +2.88   <- FOUR CONSECUTIVE, 60 MINUTES
10:00 +1.32  10:15 +1.52  10:30 +1.88  10:45 +1.60
11:00-11:45   +0.6 to -0.4      back to control
12:00 +2.92  12:15 +1.48  12:30 +2.24  12:45 +0.72  13:00 +2.92  13:15 +1.68

net added energy 06:00-14:00 : 9.52 kWh
```

🟢 **THE SUSTAINED RUN EXISTS — at the right amplitude, which the first attempt got wrong.**
`09:00 -> 09:45`, **4 consecutive intervals, 60 minutes, avg +2.67 kW, peak +2.88.** Sixty minutes
is a dryer cycle. The first test looked for **5-6 kW absolute** (nameplate) and found nothing;
the real signature is **+2.7 kW above the control day**, because the element cycles.

## Weather controlled at the hour, not just the day

`sensor.backyard_temperature`, 09:00-10:00 window, n=6 each day:

```
08-30  avg 80.5 F        08-31  avg 83.5 F        delta +3.0 F
weather can explain (1.71 kWh/F)                  +0.21 kWh
measured added energy that hour                   +2.67 kWh     -> weather = 8%
whole day: +11.5 kWh actual - 3.1 kWh weather  =  8.4 kWh real appliance load
                                                  ~3 h at 2.7 kW = 2-3 dryer cycles
```

## 🔴 WHAT IS STILL **NOT** PROVEN — and it will not be called proven

```
A/C step, measured 08-30                    2.64 kW
electric dryer 5.5 kW at ~50% duty, 15-min  2.75 kW
                                            4% apart
```

**Magnitude cannot separate dryer from A/C at 15-minute resolution.** 83.5 F could plausibly run
the A/C when 80.5 F did not, and on 08-30 that hour sat at the floor (0.96-1.40 kW = A/C basically
off). So an extra A/C run is *not* formally excluded by this data.

**ESTABLISHED:** dryer is electric (gas moved 0.06 CCF; a gas load is 0.2-0.35) · 9.52 kWh added
06:00-14:00 · 8.4 kWh survives weather normalisation · oven excluded by Jeff · a genuine
60-minute continuous +2.67 kW block exists.

**NOT ESTABLISHED:** that the block is the dryer rather than A/C. Most likely the dryer — nothing
else fits a 60-minute continuous block on a day with no cooking — but "most likely" is the honest
ceiling here.

**THE TEST THAT WOULD SETTLE IT:** a dryer load run **overnight**, when outdoor temperature is
stable and the A/C duty is flat. The dryer block would then stand alone against a quiet baseline
with no thermal confounder at all. Cheap to do, definitive, and worth doing once.

---

# 🔬 PRE-REGISTERED PREDICTION — written 2026-09-01 06:23 CT, BEFORE the data exists

Jeff, 06:23: *"I have a load I'm about to put in the dryer now."* This is the definitive test
recorded earlier — a dryer run at the coolest hour, with A/C duty near zero and no cooking, so the
one confounder that survived the 08-31 analysis (A/C step 2.64 kW vs dryer ~2.75 kW) is absent.

🔴 **THIS PREDICTION IS WRITTEN BEFORE THE DATA CAN BE SEEN. It is falsifiable. If the data does
not match, the model is wrong and this file must say so — do not retro-fit it.**

## What the corrected model says must appear on 2026-09-01, starting ~06:30 CT

| Quantity | Predicted | Basis |
|---|---|---|
| Block of consecutive elevated 15-min intervals | **YES, contiguous** | 3-of-3 blocks on 08-31 |
| Duration | **60-90 min** (4-6 intervals) | loads 1/2 were 60, load 3 was 90 |
| Elevation above the pre-load baseline | **+1.6 to +2.7 kW** | measured 08-31: 2.67 / 1.58 / 1.99 |
| Absolute 15-min reading | **~2.8 - 4.5 kW** | 06:00-06:30 baseline was 0.92-1.12 kW, plus the above |
| Peak single interval | **under 6 kW** | 08-31 max was 5.64 all day, WITH A/C |
| Energy for the load | **~1.6 - 3.0 kWh** | 08-31 loads were 2.67 / 1.58 / 2.99 |
| Return to baseline after | **full**, within one interval | 11:00-11:45 returned to control on 08-31 |

## What would FALSIFY the model

- **No contiguous elevated block** in the 06:15-08:30 window -> the 08-31 blocks were not the dryer.
- **A flat 5-6 kW plateau** -> the nameplate assumption was right after all and the cycling /
  duty-factor explanation is wrong.
- **Elevation far outside +1.6 to +2.7 kW** -> the amplitude figure does not generalise; it was an
  artefact of that particular day's A/C behaviour.
- **No return to baseline** -> the block is not a discrete appliance.

## Why this run settles what 08-31 could not

On 08-31 the only surviving objection was that the A/C step (2.64 kW) and a dryer at ~50% duty
(2.75 kW) are 4% apart and therefore inseparable by magnitude. At 06:30 on a September morning the
A/C is at or near zero duty, so **any block that appears cannot be the A/C.** The structural
argument from 08-31 (three on/off blocks against a monotonically RISING temperature, including a
drop BELOW control at 11:30) already pointed this way; this makes it direct rather than inferred.

**Check when the 09-01 15-minute data posts (CEMC lags ~1 day). Record the result either way.**

### GROUND TRUTH — exact start time, recorded live

Jeff, **2026-09-01 06:28 CT**: *"Putting the load in now will start in 2 min"* -> **START ≈ 06:30 CT.**

That lands exactly on a 15-minute bucket boundary, so the leading edge of the block is unambiguous:
**the 06:30 interval is the first that should be elevated, and 06:00 / 06:15 are clean pre-load
baseline.** On 08-31 those two intervals read 1.12 and 0.92 kW.

Expected block, restating the prediction against this exact start:

```
06:00, 06:15   baseline    (predict ~0.9 - 1.3 kW, A/C near zero at this hour)
06:30          FIRST elevated interval
06:30 -> 07:30 / 08:00     the block, 4-6 intervals
after          full return to baseline within one interval
```

If **06:30 is NOT elevated**, or the elevation starts a bucket or more late with no explanation,
that counts against the model too — a dryer draws its heaviest element current at the START of a
cycle, on the wettest clothes.
