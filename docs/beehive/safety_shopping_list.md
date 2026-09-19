# Beehive Safety / Alarm Shopping List (Jeff's DIY security layer)

**Philosophy (Jeff's ask):** *tons* of **life-safety** coverage (smoke/CO/leak/gas/freeze),
but **lean on intrusion** (only key doors + a few motions — not every window). All Zigbee →
pairs to one coordinator stick in the J45, no wiring, all local in Beehive. Panic button is
already wired to trigger the siren.

> **Order of operations:** J45 set up → RTL-SDR (meters) → THEN this alarm layer. Don't buy
> ahead of the J45 being solid.

> ## 🔴 THIS LIST IS PARTLY STALE — READ BEFORE SPENDING A DOLLAR (checked 2026-09-19)
>
> **Sections 1 and 2 below are already DONE. Buying them again is wasted money.** Verified
> 2026-09-16: **12 Zigbee devices** are on the mesh reporting link quality and `siren.301_alarm`
> is paired at **LQI 142**. The coordinator exists, Zigbee2MQTT is running, the radio is solved.
> The "don't buy ahead of the J45" gate in the line above refers to a stage that has passed.
>
> **What is actually left is section 3 (life-safety sensors), and only part of it** — see the
> verified-prices box under §3. Section 5's contact sensors: Jeff already owns ~4 spares.

---

## 1) ~~The brain of the alarm~~ ✅ DONE — DO NOT RE-BUY
| Item | Why | ~Price |
|---|---|---|
| ~~**Zigbee coordinator USB stick**~~ | ✅ **Already live.** Z2M running, 12 devices paired and reporting (verified 09-16). | ~~$20~~ **$0** |
| **USB extension cable** (0.5–1 m) | Only if USB-3 interference is ever actually observed — don't buy it pre-emptively. | ~$6 |

## 2) ~~The alarm OUTPUT~~ ✅ HARDWARE EXISTS (but judged too weak)
| Item | Why | ~Price |
|---|---|---|
| ~~**Zigbee siren/strobe (indoor)**~~ | ✅ `siren.301_alarm` is paired and reachable at **LQI 142**. ⚠️ **Jeff judged the TS0224 too weak and reassigned it to the leak alarm** — he buys real sirens himself later. **Do not re-pitch a siren.** | ~~$30–40~~ **$0** |
| *(optional later)* outdoor siren/strobe | Exterior deterrent — **Jeff's call, not a recommendation** | ~$40 |

## 3) LIFE-SAFETY sensors — the "tons of safety" priority ⭐

> ### ✅ PRICED + MODEL-VERIFIED 2026-09-19 — and the cheapest path is NOT on this table
>
> **The single best-value move is to instrument the alarms Jeff ALREADY has.** His hardwired
> **Firex `i4618AC`** chain can be bridged into HA with a **Kidde SM120X (~$12.50–$15** at an
> electrical supply house — GeScan $12.49, IMS $14.50, ADI; **sold out at Kidde/Konnected/Alarm
> Grid)** feeding a **spare Zigbee contact sensor he already owns ($0)**. Compatibility is
> **confirmed** via Kidde's own Firex interconnectivity list. That puts **every hardwired smoke
> alarm in the house** into HA for about **$13 total**, and stays 100% code-compliant.
> Full detail + wiring colors: `docs/automation/IDEAS_FROM_WHAT_WE_OWN_2026-09-17.md` §4c.
>
> **But it leaves exactly two holes, and these are what the table below is really for:**
>
> | hole | why the SM120X can't cover it | what fills it | verified |
> |---|---|---|---|
> | **CO** | manual: CO-only models *"will not activate the SM120X"*; on combo units *"only the Smoke portion"* trips it | **Heiman `HS1CA-E`** Zigbee CO — Z2M-supported, and Heiman became an official *Works with Home Assistant* partner Feb 2026 (fully local, no cloud) | ✅ **~$32** (AliExpress); also at Vesternet |
> | **Power outage** | manual, verbatim: *"it will not function during an AC power failure, even if it is being used with the … alarms which have battery backup power"* — the alarms still scream, HA just can't hear them | a **battery** Zigbee smoke detector: **Heiman `HS1SA-E`** (CR123A, ~3 yr, Z2M-supported, 85 dB) | ⚠️ **price NOT verified** — no US listing found; do not quote a number yet |
>
> ⚠️ **Certification caveat, stated plainly:** the Heiman units are **EN14604** (European). The US
> standard is **UL 217**. Treat these as *supplementary notification* sensors — **Jeff's hardwired
> Firex alarms remain the code-compliant life-safety layer**, which is exactly why the SM120X
> route is the better primary. Don't let a Zigbee puck replace a listed alarm.
>
> ❌ **The $0 route was checked and is CLOSED:** Alexa Guard used to do smoke/CO *sound* detection
> free on the Echos already in the house. **Amazon retired it** — now **Alexa Emergency Assist,
> $5.99/mo ($59/yr)**. A forever-subscription against a one-time ~$13 part is the wrong trade.
>
> ❌ **frient SMSZB-120** — Z2M-supported and good quality, but reviewers call it *"eye-wateringly
> expensive"* and no price was verified. Not recommended over the Heiman on Jeff's budget rule.

| Item | Where | Qty | ~Price ea |
|---|---|---|---|
| **Zigbee smoke detector** — Heiman `HS1SA-E` (⚠️ price unverified) | Hallways/bedrooms | 2–3 | ~$35 *(unverified)* |
| **Zigbee CO detector** — Heiman `HS1CA-E` ✅ **~$32 verified** — natural gas house, so CO matters | Near furnace/water heater + hall | 1–2 | **~$32** |
| **Zigbee natural-gas (methane) detector** | Near gas appliances/furnace | 1 | ~$30 |
| **Zigbee water-leak sensors** | Water heater, under kitchen/bath sinks, washer, near water-meter pit | 4–6 | ~$12 |
| **Zigbee temp sensor (freeze alert)** | Attic/crawlspace/pipes; + the planned DS18B20 in the breaker panel | 2 | ~$12 |

## 4) Water-main AUTO-SHUTOFF (high value — pairs with leak sensors + water meter)
| Item | Why | ~Price |
|---|---|---|
| **Motorized ball valve on the water main** (Zigbee/Wi-Fi, e.g. a smart valve or valve+actuator) | Leak detected → Beehive **auto-closes the main**. Turns "leak alert" into "leak stopped." | ~$50–90 |

## 5) INTRUSION — keep it lean (Jeff: don't go crazy)
| Item | Where | Qty | ~Price ea |
|---|---|---|---|
| **Zigbee contact sensors** | ONLY key doors: front, back, garage↔house | 3–4 | ~$10–13 |
| **Zigbee motion sensors** | Interior chokepoints (main hall, great room) | 2–3 | ~$12 |
| *(optional)* contacts on a few main-level windows | only if wanted | few | ~$10 |
| **Zigbee keypad or button** (arm/disarm, or panic) | By the door | 1 | ~$25 |

## 6) Garage door — myQ (Chamberlain blocks HA cloud → go LOCAL)
| Item | Why | ~Price |
|---|---|---|
| **ratgdo board** (get the model matching your opener's Security+ version) | Local Beehive control of the myQ/Chamberlain opener — open/close + position + obstruction. Bypasses the blocked myQ cloud. | ~$30 |
| *(all-Zigbee alt.)* Zigbee dry-contact relay + Zigbee tilt sensor | Trigger + open/closed state, any opener | ~$25 |

**NEED FROM JEFF:** opener **brand + model**, and wall-button **learn-button color** (yellow /
red-orange / purple / green) → confirms Security+ 1.0 vs 2.0 → picks the right ratgdo.

## 7) Notifications (free — required for panic alerts to reach phones)
- **Home Assistant Companion app** on Jeff, Angela & Braxton's iPhones (free). Enables loud
  **Critical** alerts that override silent/DND. This is how panic + smoke + leak reach everyone.

## 8) Already have / in progress (don't re-buy)
- **Blink cameras** (adding via Beehive).
- **RTL-SDR** (water/gas meters) — separate from this list but same J45.
- **DS18B20** breaker-panel temp probe (planned with the energy monitor).

---

### Cross-device automations this unlocks (build in Beehive after hardware)
- Leak sensor → close water main + Critical alert.
- Smoke/CO/gas → siren + Critical alert (+ optional HVAC-off).
- Garage left open after dark → alert + auto-close.
- Away scene (phones leave) → arm motions/contacts, confirm garage closed, rain-delay B-Hyve.
- Panic → siren + strobe lights + Critical push to the 3 phones (already wired).
