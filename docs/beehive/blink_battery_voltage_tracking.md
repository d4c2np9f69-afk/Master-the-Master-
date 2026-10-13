# Blink battery voltage tracking — built 2026-08-22 (it did NOT exist before)

## Jeff was right, and the search backs him up

Jeff, 2026-08-22: *"That was supposed to already be set up the day I changed the batteries. We
were tracking the others to see at what point they failed so that we could get an accurate reading
on the voltage being the failure versus them saying the thing is OK… I'm sure it wasn't built."*

**It was not built.** Checked before answering, not assumed:

- Master record searched three ways — `battery voltage trend`, `Blink battery`,
  `Blink batteries changed`: **no hits** in decisions, conversation, project history, or the
  iCloud reference guides.
- Repo grep for `battery_voltage`: the **only** hits are the **mower's** voltage. Nothing Blink.
- Live HA: **no `sensor.*` entity anywhere exposes a Blink battery voltage.** Only the coarse
  `binary_sensor.*_battery` ok/low flags exist.

So no trend line ever existed, because nothing was ever collecting one.

## Why the coarse flag is useless, which is Jeff's whole point

Blink reports `battery: ok` until lithium cells fall off a cliff — **fine one minute, dead the
next.** An ok/low flag can never tell you the failure voltage. Only a logged voltage curve can,
and the voltage is a **camera ATTRIBUTE**, which HA's recorder does not store. That is precisely
why nothing was ever captured: the number was visible live and vanished forever every time.

## What now exists

**`windows-scripts/Log-BlinkBatteries.ps1`** — read-only against HA, appends to
`C:\Users\jeffl\HCC-Scripts\blink-battery-log.csv`:
`timestamp, camera, battery_flag, voltage, low_flag, wifi_dbm, temp_f, note`

Scheduled task **"HCC Blink Battery Log"**, every **15 minutes**, `StartWhenAvailable`.
Verified running 2026-08-22 11:19, `LastTaskResult 0`.

**`windows-scripts/Show-BlinkBatteryTrend.ps1`** — the report. Per camera it prints the current
voltage, the change, and the per-day drain rate once there is more than half a day of data. Most
importantly it scans for the two events that actually answer the question:

- `>> FLIPPED TO LOW at <time> - last voltage before that: <v>`
- `>> WENT DARK at <time> - LAST VOLTAGE READ: <v>  <== the real failure point`

## Baseline at first log, 2026-08-22 11:18

| Camera | Voltage | Flag |
|---|---|---|
| back_left | 168 | ok — replaced by Jeff |
| 301_backyard | 166 | ok — replaced by Jeff |
| front_right | 151 | ok |
| **301_driveway** | **146** | ok — **lowest, next due, and the one most likely to give us the first real failure datapoint** |
| 301_front_doorbell | *none* | doorbell reports no voltage — device capability |
| garage | *none* | mains Mini, no battery |

## 🔴 THE EXPERIMENT — Jeff's explicit intent, stated 2026-08-22

Jeff: *"That was the whole reason I didn't change all of the batteries. At one time I was waiting
to see what the failure point was of the other two, the front right and the driveway, so that we
would know exactly when we needed to change the batteries based off the voltage versus the sensor
that says OK."*

**`front_right` (151) and `301_driveway` (146) are deliberately still on their ORIGINAL batteries.
That is a decision, not neglect.** He replaced `back_left` and `301_backyard` and left these two
running specifically to find the failure voltage.

🔴 **DO NOT replace, or tell Jeff to replace, the front_right or driveway batteries when they
flag low.** Running them to actual failure IS the experiment. The voltage captured at the moment
they die is the entire deliverable. Ask him before touching either.

**The experiment is NOT lost by the late start.** Both are still well above failure at 151 and 146,
and logging began 2026-08-22 — so the whole descent through the failure region, which is the only
part that matters, will be captured. What was lost is the early, uninteresting part of the curve.

## Known limit

There is **no back-history**. This starts from 2026-08-22 and cannot be backfilled, because the
attribute was never recorded. The curve builds from here.

---

# The origin of this experiment — from the master record, 2026-08-18

Jeff recalled this on 08-22 and the record confirms him word for word. Quoted here so it stops
being oral history:

**JEFF — 2026-08-18 04:05:42 PM CT:**
> *"Btw it kinda strange those cameras run on 2aa lithium batteries and the back yard left camera
> went out too so I was changing the batteries and in both cameras **only one battery was dead the
> other one was at 100%** needless to say I put two new batteries in both cameras but why do you
> think only one was bad? Is the camera only pulling from one battery?"*

**JEFF — 2026-08-18 05:18:24 PM CT:**
> *"I don't think we ever got a warning on the two I had to replace so **we may have to set our own
> warning** because the two just went dark and it was definitely the one battery was dead in both.
> **So maybe around the 150 mark is the real failure**"*

**Jeff called the number on 08-18. The logging to confirm it was never built until 08-22.**

## Why only one cell died — the answer to his question

The 2 AA lithium cells sit in **series**, so the *same current* flows through both. Cells are never
perfectly matched, so the weaker one depletes first. Once it is exhausted, the good cell keeps
driving current **through** the dead one and can **reverse-charge** it — which destroys that cell
outright while leaving the other near full. That is exactly the observed "one completely dead, one
at 100%," and it is normal series-cell behaviour, not a camera fault. The camera is not "pulling
from one battery."

**This also explains the no-warning failures.** A single pack reading stays respectable while one
cell quietly collapses, then falls off a cliff when that cell gives out. That is precisely why the
two cameras "just went dark."

🔴 **Limitation of this experiment, stated honestly:** the logged number is one value per camera, so
it can establish a **failure threshold**, but it **cannot reveal which cell is weak** or detect
imbalance. Sudden death is still possible above the threshold. The trend narrows the window; it
cannot eliminate the surprise.

## Status at 2026-08-22 11:25 — both test cameras are already at/below Jeff's mark

| Camera | Voltage | vs Jeff's 150 hypothesis |
|---|---|---|
| front_right | **151** | **right at it** |
| 301_driveway | **146** | **already below it** |

Both could go dark any day. Logging runs every 15 min, so the failure will be captured.

## The alarm — built and VERIFIED 2026-08-22

`Log-BlinkBatteries.ps1` now pushes to `notify.mobile_app_jeffs_iphone` (time-sensitive) on:

- **`FAILURE CAPTURED: <cam>`** — the camera stopped reporting a voltage, i.e. it just died. The
  push carries **the last voltage read**, which is the datapoint this whole exercise exists for.
- **`Battery crossed 150: <cam>`** — voltage fell below Jeff's suspected mark.

The push path was tested end-to-end on 08-22 and accepted by HA — not merely assumed to work.

## Jeff's stated end goal

> *"so then moving forward anytime the voltage got to that point I would change them all at once
> that was the logic behind it."*

Once a real failure voltage is confirmed, the plan is **replace all cameras' cells together at that
threshold**, rather than waiting for each to die. Do not propose anything that conflicts with this.

---

# 🏁 EXPERIMENT CLOSED 2026-10-13 ~5:45 PM — JEFF CHANGED ALL THE BATTERIES
> **Jeff 5:50 PM:** *"Okay all the batteries have been changed in the blink cameras"*
> **6:01 PM:** *"All the cameras are up and working in the blink app"*

**This is not the experiment being abandoned — it is Jeff executing his own stated end goal**
(*"anytime the voltage got to that point I would change them all at once, that was the logic behind
it"*). It ran **52 days**, 2026-08-22 11:18 → 2026-10-13 18:01, **4,519 readings per camera**.

## 🔴 THE ANSWER, AND IT IS NOT THE ONE WE EXPECTED
**Jeff's 08-18 hypothesis — *"maybe around the 150 mark is the real failure"* — IS NOT SUPPORTED.**
**Neither test camera ever failed. Not once, in 52 days, from at or below the mark.**

| camera | first logged 08-22 | last before the swap | net over 52 days | min | max | mean | readings **below 150** |
|---|---|---|---|---|---|---|---|
| **front_right** (test) | 151 | **150** | **−1** | 147 | 178 | 162.4 | **561 / 4519 = 12%** |
| **301_driveway** (test) | 146 | **151** | **+5** | **131** | 175 | 162.2 | 251 / 4519 = 6% |
| back_left | 168 | 147 | −21 | 147 | 175 | 159.9 | 1377 / 4519 = **30%** |
| 301_backyard | 166 | 147 | −21 | 146 | 173 | 156.0 | 1306 / 4519 = **29%** |

## 🔑 THE REAL FINDING: THIS NUMBER IS NOT A STATE-OF-CHARGE READING
- **`301_driveway` fell to 131 and came back up to 151.** A battery does not recharge itself. The
  value swings with **temperature and load**, not remaining capacity.
- Both test cameras swung **~30–44 points** while their *net* 52-day change was ≈ zero.
- **`back_left` and `301_backyard` sat below 150 for ~30% of all readings and never died either.**
- ⇒ **You cannot predict a Blink battery failure from this number, and "below 150" means nothing.**
  The "Battery crossed 150" push built on 08-22 is therefore a **false-alarm generator** — it would
  have fired on four cameras that were all perfectly fine.

## ✅ PROVEN, NOT ASSUMED: NEITHER TEST CAMERA EVER WENT DARK
The log holds **230 polls with no voltage** for front_right and 230 for 301_driveway — which looks
like death until you check whose. **All 230 are the SAME timestamps, and ALL FOUR cameras are blank
in every one of them. Camera-specific blanks: `front_right` 0, `301_driveway` 0.**
⇒ Those are **Blink-side API gaps**, not failures. This is the ghost-value trap again: the shape of
"dead camera" and the shape of "the cloud returned nothing for everybody" are identical **per
camera**, and only separate when you compare across devices.

## ▶ WHAT THIS MEANS GOING FORWARD
1. **Jeff's replace-them-all-at-once policy is the CORRECT one** — and today's action is exactly it.
   The experiment's conclusion is that no voltage threshold can do better, so a **calendar** beats a
   **threshold**. 52 days of data says the number cannot give the warning he wanted.
2. 🔴 **The 150-crossing alert should be retired or raised** — it is now proven to fire on healthy
   cameras. **Not changed yet; Jeff's call** (cameras are a frozen subsystem).
3. **The failure-capture alert is still worth keeping**, but it must ignore a poll where **every**
   camera is blank, or it will cry death on every Blink API gap. **Not changed yet.**
4. ⚠️ **Scheduled task `HCC Camera Battery Watch` last ran 2026-10-13 07:30 with `LastTaskResult 1`
   (failure).** Separate from the logger (`HCC Blink Battery Log`, result 0, healthy). **Not
   investigated — flagged only.**

## 📍 NEW BASELINE — fresh cells, 2026-10-13 18:00
| camera | pre-swap | post-swap |
|---|---|---|
| 301_driveway | 151 | **173** |
| front_right | 150 | **179** |
| back_left | 147 | **180** |
| 301_backyard | 147 | **175** |

⚠️ **`back_left` reported LATE and briefly looked unchanged.** At the 17:46 poll the other three had
jumped and back_left still read 147, which reads exactly like "this one didn't get new cells." It
came in at 180 on the next poll. 🔑 **Give the logger one more 15-minute cycle before concluding a
camera was missed.** (Its wifi also moved −38 → −47, consistent with being handled.)
*Fresh-cell range is 173–180, so a genuine new-battery reading is ~175±5 — useful for next time.*
