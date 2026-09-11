# Beehive Safety / Alarm Shopping List (Jeff's DIY security layer)

**Philosophy (Jeff's ask):** *tons* of **life-safety** coverage (smoke/CO/leak/gas/freeze),
but **lean on intrusion** (only key doors + a few motions — not every window). All Zigbee →
pairs to one coordinator stick in the J45, no wiring, all local in Beehive. Panic button is
already wired to trigger the siren.

> **Order of operations:** J45 set up → RTL-SDR (meters) → THEN this alarm layer. Don't buy
> ahead of the J45 being solid.

---

## 1) The brain of the alarm (buy first, everything else pairs to it)
| Item | Why | ~Price |
|---|---|---|
| **Zigbee coordinator USB stick** — Sonoff Zigbee 3.0 Dongle Plus (model "P", EFR32MG21) | Gives Beehive the Zigbee "radio." Everything below pairs to it. Runs Zigbee2MQTT or ZHA. Plug into a free J45 USB port. | ~$20 |
| **USB extension cable** (0.5–1 m) | Move the Zigbee stick away from the J45/RTL-SDR to avoid USB-3 interference (real issue). | ~$6 |

## 2) The alarm OUTPUT (this is what "panic" sets off)
| Item | Why | ~Price |
|---|---|---|
| **Zigbee siren/strobe (indoor)** — e.g. HEIMAN HS2WD-E, Frient/Develco, or Neo | Becomes the `siren.*` entity. Loud + strobe. | ~$30–40 |
| *(optional later)* outdoor siren/strobe | Exterior deterrent | ~$40 |

## 3) LIFE-SAFETY sensors — the "tons of safety" priority ⭐
| Item | Where | Qty | ~Price ea |
|---|---|---|---|
| **Zigbee smoke detector** (Frient/Heiman) | Hallways/bedrooms | 2–3 | ~$35 |
| **Zigbee CO detector** (Heiman) — natural gas house, so CO matters | Near furnace/water heater + hall | 1–2 | ~$40 |
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
