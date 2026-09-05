# Blink battery levels — checked 2026-08-22 11:10 AM

Jeff asked for current levels plus a last battery check on the doorbell. Read live from HA twice
to confirm, not quoted from memory.

## Current levels

| Camera | Voltage | Flag | Note |
|---|---|---|---|
| back_left | **168** | ok | **highest — one of the two Jeff replaced** |
| 301_backyard | **166** | ok | **the other one Jeff replaced** |
| front_right | 151 | ok | mid-life |
| **301_driveway** | **146** | ok | **lowest — this is the next one due** |
| 301_front_doorbell | *(none)* | ok | doorbell reports ok/low only, never a voltage |
| garage | *(none)* | — | mains-powered Mini, **no battery — correct, not a fault** |

**Jeff's recollection is confirmed by the data.** He said he had already changed the back left and
the backyard, and those are precisely the two highest readings (168 and 166). The other two sit
well below, so the scale and his memory agree.

**Nothing is flagged low.** All five battery cameras report `ok`, and every
`binary_sensor.*_battery` is `off`.

## The doorbell — there is no voltage to give, and that is normal

`camera.301_front_doorbell` has **never** reported a `battery_voltage` value. Blink Video
Doorbells expose only a coarse `ok`/`low` battery state, unlike the outdoor cameras which report a
number. Current state: **`ok`, not low.** So there is no "last battery check" figure to quote —
one has never existed for this device.

## 🔴 CORRECTION to this morning's claim

Earlier today the doorbell and garage were reported as **"offline since ~04:40, no telemetry."**
**That was wrong, or at best unproven, and it should not send anyone up a ladder.**

- The `04:40` timestamp was just `last_changed`, which only reflected the most recent HA
  restart/flap — not the moment anything failed.
- `sensor.blink_*_temperature` and `*_wi_fi_signal_strength` are **excluded from the recorder** —
  `301_driveway_temperature` shows a live value of 111 while returning **0 numeric readings in 30
  days** of history. So history cannot be used to date these at all.
- The two devices showing `unknown` are the **Video Doorbell** and the **mains Mini** — the two
  non-standard device types. The four standard outdoor cameras all report fine. That pattern
  points to **device capability, not failure**, and it matches the existing standing note that
  garage quirks must never be reported as faults.

**What remains genuinely unexplained** is the doorbell logging **zero motion events in 25 hours**.
That is still open — but it is not evidenced by the telemetry, and it is **not** a battery problem,
because the battery reads `ok`.

## The watch Jeff asked for already exists and is armed

`automation.hcc_low_battery_alert_all_cameras_zigbee_sensors` — **state `on`, has NEVER fired.**
It triggers on `to: 'on'` for all five camera battery sensors **including the doorbell**, plus the
Zigbee door/leak sensors. So the "keep an eye on the batteries" job is already automated and is
currently silent because nothing is low.

## Known gap in this data

Because those attributes are not recorded, only **spot readings** are possible — there is no trend
line, so no decline rate and no "weeks remaining" estimate. Adding the camera battery attributes to
the recorder would build that history going forward. Not done, as it is outside the camera freeze
and Jeff wants to move on.
