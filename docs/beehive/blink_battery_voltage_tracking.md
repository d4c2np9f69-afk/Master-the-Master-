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
