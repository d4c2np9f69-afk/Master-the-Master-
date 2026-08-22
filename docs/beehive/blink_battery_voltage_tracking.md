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
