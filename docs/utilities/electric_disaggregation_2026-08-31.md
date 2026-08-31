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

**The repair date is NOT recorded anywhere in this project** — searched; the only trace is *"real
ductwork leak, since fixed"* with no date. **Derived from the data instead:** scanning 109 cooling
days (temp >= 70F) for the split that best separates kWh-per-degree gives a change point at
**~2026-07-24**:

```
BEFORE  May 10 - Jul 23   71 days   64.7 kWh/day @ 77.7 F
AFTER   Jul 24 - Aug 30   38 days   58.9 kWh/day @ 80.6 F
```

Usage fell 5.8 kWh/day while average temperature ROSE 2.9 F — 0.833 -> 0.731 kWh per degree-day,
a **12% efficiency gain**. That is the signature of the duct repair. **AWAITING JEFF'S CONFIRMATION
of the real date** — do not treat ~07-24 as settled until he says so, then write it here.

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
