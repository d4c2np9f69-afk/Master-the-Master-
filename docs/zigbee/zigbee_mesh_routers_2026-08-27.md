# Zigbee mesh — THE ROUTER PROBLEM IS CLOSED (2026-08-27, 5:07–6:50 PM CT)

**Jeff's USB Zigbee repeaters arrived and went in the same evening. The network went from
`Router 0 / Low-LQI 6` to `Router 3 / Low-LQI 0`.** Every number below was read live off the
Z2M dashboard, its network scan, or HA's `sensor.*_linkquality` entities — none is from memory.

---

## The hardware, as the network actually reports it

| Role | Model | Manufacturer | Notes |
|---|---|---|---|
| **Repeaters** ×2 | **TS0501B** (`_TZ3210_cmnwaylf`) | Tuya | USB stick, Telink OUI. **Z2M classifies it `Router`, Mains (single phase)** — the 08-26 acceptance test PASSED |
| **Siren** | **TS0224** | Tuya | "Smart light & sound siren" — **also a Router** |
| Contact sensors ×6 | **SNZB-04** | **SONOFF** | ⚠️ the 08-13 buildout doc guessed Excellux / Coolo / Tuya. **Wrong — they are SONOFF.** |
| Leak sensors ×3 | **ZG-222Z** | **HOBEIAN** | ⚠️ same correction |

🔴 **The repeaters enumerate as a Tuya "Zigbee light" (TS0501B).** They create `light.*` entities
in HA. That is normal for this class of device — the repeater firmware is built on a light module.
**Neither auto-exposed to Alexa** (checked: only `conversation: True`, no `cloud.alexa`).

**Named in Z2M so entity IDs are clean, not hex:**
- `Garage Repeater` — `0xa4c1386f3deff62d` → `light.garage_repeater`
- `Floating Repeater` — `0xa4c138140f3ce43d` → `light.floating_repeater`
  (Jeff's name, deliberately generic: *"in case we need to move it from time to time"*)
- `301 Alarm` — `0xa4c138242e17e3f0` → `siren.301_alarm`

---

## Before → after (LQI)

| Device | 5:25 PM baseline | 6:24 PM | routed via |
|---|---|---|---|
| **Mailbox** | **0** (orphaned since 08-23) | **76** | Coordinator direct (170 from coordinator side) |
| Guest Bath Leak | 18 | **80** | **Floating Repeater** (127) |
| Garage Door Down | 25 | **83** | **Garage Repeater** (97) |
| Kitchen Refrigerator Leak | 25 | **83** | **Garage Repeater** (124) |
| Garage Man Door | 29 | **83** | **Garage Repeater** (103) |
| Kitchen Sink Leak | 43 | **91** | **Garage Repeater** (69) |
| Front Door | 65 | 65 | Coordinator direct |
| Back Deck Door | 76 | 83 | Coordinator direct |
| Spare Contact 1 | 142 | 120 | Coordinator direct |

**Devices 9 → 13 · Router 0 → 3 · Low LQI (<50) 6 → 0 · Coordinator children 9 → 4.**

Repeater links back to the coordinator: **Garage Repeater 83** (in the garage — the 167 it showed
first was a bench reading next to the antenna, do not quote it), **Floating Repeater 60–105**
depending on where it sat, **301 Alarm 196–200**.

---

## 🔴 Facts worth keeping — these cost time to establish

1. **A battery end device does NOT re-parent on command.** It stays with the parent it has.
   Some do move on their own eventually (Kitchen Refrigerator Leak hopped to the Garage Repeater
   unprompted, 25 → 124), but **the reliable way is a re-pair or a battery pull.**
2. **A mains router CAN be paired next to the antenna and then moved.** Jeff did exactly this and
   both stayed joined and re-routed. That is the easy way to commission them.
3. **SNZB-04 reset is a HOLD, not a poke:** *"Long press reset button for 5s until the LED
   indicator flashes three times"* (zigbee2mqtt.io/devices/SNZB-04). Keep pressing the button
   during the interview to hold the device awake — that is what fixed Garage Door Down's four
   failed interviews on 08-24.
4. **Z2M documents NO reset procedure for the HOBEIAN ZG-222Z.** Don't invent one — a battery
   pull forces the rejoin without needing it.
5. **The mailbox fix was the RE-PAIR, not the front repeater.** It attached straight to the
   coordinator at LQI 170 and the repeater in the bubble box had **zero** children. It had been
   orphaned since 08-23; resetting it was the whole fix. **Jeff's 08-24 "it's too far, accepted"
   is retired — it was never distance.**
6. **Only quiet periodic LQI readings are valid** (unchanged rule from 08-24).

---

## 🔊 The siren — TESTED LIVE, and it under-delivers

`siren.301_alarm` + `switch.301_alarm_light` (strobe) + `select.301_alarm_volume` +
`number.301_alarm_duration`.

**Tones available:** `burglar` · `fire` · `emergency` · `police_panic` · `fire_panic` ·
`emergency_panic`. Fired live at 6:42, 6:43, 6:46, 6:47 and 6:49 PM with Jeff listening.

🔴 **JEFF'S VERDICT, 2026-08-27 6:50 PM — SETTLED, do not re-test or re-pitch:**
> *"it's pretty weak. You get what you pay for it'll work as an alert, but it's no way it's gonna
> scare anybody off."*

**It is an indoor annunciator, not a deterrent.** The seller's 105 dB claim does not match the
hardware. Budget accordingly if a real deterrent is ever wanted.

### Three traps in this device, all found by testing

1. 🔴 **HA's siren entity cannot reach the loudest setting.** Z2M's `warning` composite has
   **four** sound levels — `low · medium · high · very_high` — but HA's siren entity only offers a
   0–1 `volume_level`, and `1.0` lands on **`high`**. `very_high` is unreachable through
   `siren.turn_on`. **Use `mqtt.publish` instead:**
   ```
   topic:   zigbee2mqtt/301 Alarm/set
   payload: {"warning":{"mode":"burglar","level":"very_high",
                        "strobe":true,"strobe_level":"very_high","duration":60}}
   stop:    {"warning":{"mode":"stop"}}
   ```
2. 🔴 **Minimum duration is 60 seconds.** There is no short chirp. Anything that fires this runs a
   **full minute** unless something explicitly stops it. **Every alarm automation needs a
   deliberate off** — #10's panic button has none today.
3. 🔴 **`select.301_alarm_volume` never reports state — it stayed `unknown` through every set.**
   It is write-only in practice. Automations must pass the level in the payload, never trust the
   select. And `assumed_state: true` means **HA's `off` is not proof the siren stopped.**

---

## Still open after tonight

- **A third repeater** when the rest land from AliExpress (Jeff, 08-27: *"could be another week or
  so"*). No spot currently needs one — Low LQI is 0.
- **`light.0xa4c138140f3ce43d`-style orphans:** watch for stale unnamed `light.*` entities from
  renamed devices.
- The **alarm subsystem** (#10 panic button, #39 door alerting) now has a real siren to drive.

## Housekeeping done
- `permit_join` and `automation.hcc_zigbee_pairing_mode_temporary_installing_sensors_08_17`
  **both verified OFF at 6:50:29 PM** after ~95 minutes open.
- The 9 previously `disabled_by: integration` `sensor.*_linkquality` entities were **enabled**, plus
  the 3 new devices' — LQI is now readable from HA without opening Z2M.
- 🔑 **Route worth remembering: the Supervisor REST proxy 401s even with a browser session token,
  but Supervisor over HA's WebSocket accepts the long-lived token** —
  `{"type":"supervisor/api","endpoint":"/addons"}`. That is how the Z2M ingress URL was obtained
  without Jeff clicking anything. MQTT port 1883 is open but **anonymous auth is refused** and
  there are no manual Mosquitto logins, so `mqtt.publish` via HA is the way to talk to Z2M directly.

---

## 📫 Built on the back of this: MAIL ARRIVED alert (7:00 PM)

**Jeff's ask, once the mailbox sensor was alive:** announce on Alexa and push his phone when the
mailbox door opens. **Only possible because the sensor came back tonight** — it had been orphaned
and silent since 08-23.

`automation.hcc_mail_arrived_mailbox_door_opened` — verified `on`, entity exists.

| | |
|---|---|
| Trigger | `binary_sensor.mailbox_contact` → `on` |
| Condition | time **07:00–20:00** · **30-minute throttle** via `this.attributes.last_triggered` |
| Action 1 | `persistent_notification.create` |
| Action 2 | `notify.alexa_media` → `media_player.living_room` + `media_player.master_bedroom`, `type: announce` |
| Action 3 | `notify.mobile_app_jeffs_iphone` |

**Why each guard exists — do not "simplify" them away:**
- **The throttle** is because the carrier opens *and* closes the door and Jeff opens it again when
  he collects the mail. Without it, one delivery announces several times.
- **The time window** stops a wind gust or a night visitor announcing at 2 AM.
- **`persistent_notification` is FIRST** for the same reason as `hcc_water_leak_alarm`: a failing
  notify service aborts every action after it. That is exactly how the leak alert was silently dead
  in *both* channels until 08-26.
- **Alexa targets are the two REAL Echos only.** `jeffrey_s_alexa_app_for_pc` and the 2nd one read
  `unavailable`; the `all_devices_*` entries are groups.

🟠 **NOT FEATURE-TESTED YET.** Creating it is not proof it fires. The real test is opening the
mailbox door and confirming both the announcement and the push. **A component check here would be
worthless** — the 08-21 stream check printed ALL GOOD eleven minutes after the popups were dead.
