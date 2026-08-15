# HCC Hardware Inventory — Master Register

**Standing job (Jeff, 2026-08-13):** *"make sure we stay on top of the inventory
that's coming in, what we buy from now on... really make sure that we're adding to
the system rather than taking away from it. It's all got to be tracked meticulously."*

Every session that buys, receives, installs, retires or repurposes hardware updates
this file. A phone-readable copy lives at `iCloudDrive/HCC Inventory.md` — keep the
two in sync whenever this changes.

Status legend: **ORDERED** → **ON HAND** → **INSTALLED** · plus **RETIRED** / **RESALE**

---

## Zigbee layer

| Item | Qty | Status | Cost | Location / Notes |
|---|---|---|---|---|
| Haozee Zigbee 3.0 dongle (CC2652P1, +20dBm) | 1 | ORDERED · ETA Aug 13–17 | $8.92 | Coordinator. USB extension cable ON HAND. Z2M, not ZHA. |
| Tuya Zigbee door/window sensor (Excellux 2-pc) | 2 pks | ORDERED · ETA ~Aug 14 | $9.58 ×2 | battery end devices |
| Zigbee door/window sensor (Coolo 2-pc) | 1 pk | ORDERED · ETA ~Aug 15 | $6.39 | battery |
| Zigbee door/window sensor (Excellux 1-pc) | 1 | ORDERED · ETA ~Aug 15 | $2.79 | battery |
| Zigbee water leak sensor (Haozee) | 2 | ORDERED · ETA ~Aug 14 | $5.09 ea | battery |
| Zigbee water leak sensor (Gleco, probe cable) | 1 | ORDERED · ETA ~Aug 14 | $4.40 | battery |
| Zigbee water leak sensor (Gleco **Z2M-only**) | 1 | ORDERED · ETA ~Aug 14 | $4.62 | ⚠️ no ZHA — this locked the Z2M decision |
| Zigbee water detector (Excellux) | 1 | ORDERED · ETA ~Aug 15 | $6.19 | battery |
| ⚠️ Tuya **WiFi** water sensor (Qianhong) | 1 | ORDERED · ETA ~Aug 14 | $5.68 | NOT Zigbee — wrong variant selected. Needs Tuya cloud/LocalTuya or shelf it. |

**Mesh status: zero routers.** Every device above is battery = end device. First
routers will be the mains-powered light switches. Until then all devices connect
directly to the dongle (CC2652P handles ~50 direct children — the reason not to
swap to a ZBDongle-E, decided 2026-08-13).

## Lighting project

| Item | Qty | Status | Cost | Notes |
|---|---|---|---|---|
| Kasa HS220 dimmer, single-pole (WiFi, 150 W LED) | **2 (confirmed)** | ON HAND | — | **ASSIGNED: living room** (12 ft from dongle — mesh contribution redundant there, WiFi is fine). #2 = bedroom or spare, pending Inovelli test |
| Inovelli Blue 2-1 VZM31-SN (Zigbee) | 0 | **TO BUY: 2** | ~$60 ea | **#1 = KITCHEN, dimmer mode** — far-point router + the dimming test. **#2 = GARAGE man-door, On/Off mode + "3-Way Dumb" type** — the existing kitchen 3-way toggle KEEPS WORKING, no dummy switch needed. Mesh chain: dongle → kitchen → garage, landing a router on top of the door relay + sensors. (Corrected 08-13: the 2-1 manual is titled "On-Off or Dimmer" — it does both modes.) |
| Leviton Decora E5603-SW 3-way (dumb) | 1 | ON HAND — companion/spare | — | Reassigned 08-13: garage goes smart (Inovelli #2). Use this as a fresh dumb companion in the kitchen 3-way position if the existing toggle is worn; else shelf |
| GE UltraPro paddle, single-pole (dumb) | 1 | ON HAND | — | bedroom repurposed-receptacle position |
| MOES single-gang dimmer module (the beige box) | 1 | ON HAND | — | **ASSIGNED: single LED over kitchen sink (~12 W** vs 100 W/gang limit — finally a load it fits). ⚠️ needs a MOMENTARY push-button at the wall, not a standard toggle (toggles cause continuous-ramp misbehavior, researched 08-06). Confirm protocol from label: WM- prefix = WiFi/Tuya, ZM- = Zigbee |
| Lepro 14 W LED downlights w/ j-boxes | several | ON HAND — **SPARES ONLY** | — | replacements for existing fixtures, NOT expansion (Jeff 08-13) |

**Mesh geometry (Jeff 08-13):** kitchen is the FARTHEST point needing mesh; living
room is ~12 ft from the dongle. Router priority is therefore kitchen first — not
living room as originally assumed.

## Wiring consumables & tools (from bin photos — no purchases needed for install work)

12/2 NM cable (yellow, good length) · Wago-style lever connectors (45-pc kit + loose) ·
old-work boxes, single-gang boxes, misc plates · NM staples · structured-wiring plates ·
multimeter · wire strippers/cutters · headlamp · screwdrivers · Energetic recessed fixture

## Irrigation

| Item | Qty | Status | Cost | Notes |
|---|---|---|---|---|
| 3/4" Orbit valve (zone-1 replacement) | 1 | ON HAND | — | install tomorrow — zone 1 diaphragm leak (~3.8 gal/hr, confirmed by meter) |
| 3/4" spare valves | several | ON HAND | — | one becomes the **master valve** → PUMP + COM |
| Spare wire runs, manifold → controller | plenty | IN PLACE | — | confirmed by Jeff |

## Mower / sensor

| Item | Qty | Status | Cost | Notes |
|---|---|---|---|---|
| ESP32-D on screw-terminal breakout | 1 | INSTALLED | — | fw 1.4.0, OTA-ready pending private hosting |
| Spare ESP32 | 1 | TO ORDER (~$9) | — | Jeff committed 08-11 — flash + bench-soak on arrival; unblocks OTA proof + watchdog test |

## Garage door

| Item | Qty | Status | Cost | Notes |
|---|---|---|---|---|
| SONOFF MINI-D (Matter, dry contact) | 1 | ON HAND | — | wire + eWeLink Inching + Matter-commission (Pending Item 1) |
| Garage door position: **2× contact sensors** (from inbound stock) | 2 | plan | — | **#1 at CLOSED position** (bottom of track/frame), **#2 at FULLY-OPEN position** (overhead track where the door rests when up). Template sensor derives 3 states: CLOSED / OPEN / **PARTIAL** — covers Jeff's hot-day "cracked open" venting. Possible later automation: pulse-wait-pulse for a repeatable vent stop |
| MyQ hub + sensor | 1 set | RESALE | — | eBay when Jeff gets to it |

## Network

| Item | Qty | Status | Cost | Notes |
|---|---|---|---|---|
| MoCA adapter set | 1 pr | ON HAND — SHELF | — | Garage WiFi measured ADEQUATE 08-13 (mower box, last 50 uploads: mean −71.5 dBm, worst −76, zero buffered uploads ever; GaragePC + Tuya plug also clean). **Trigger to deploy:** if the Matter garage relay feels laggy once installed → MoCA backhaul + AP in garage. Needs coax at garage — unverified. |

**ISP (confirmed by photo 08-13):** AT&T Fiber, gateway **BGW320-500** (integrated ONT,
WiFi 6). Admin UI at `http://192.168.1.254` — login uses the Device Access Code printed
on the unit's label. LAN is 192.168.1.x (matches Beehive at .66). Household WiFi SSID
in use is `Loewen301`, NOT the factory SSID on the label. The old Xfinity notes refer
to Jeff's *email/mail*, not current internet service.
If true mesh WiFi is ever wanted: AT&T's All-Fi/Smart WiFi extenders pair with this
gateway, or the MoCA + AP route above — decision deferred since garage WiFi measured fine.

## Other on-hand (from CLAUDE.md spare inventory, unchanged)

KESU 500GB USB drive (AirTV DVR) · Lenovo B570 (kiosk candidate) · Delam XLR mic
(GaragePC voice) · WD 320GB bare HDD (Mint test drive) · HDMI-005 Miracast stick ·
HDMI→USB capture stick (kitchen TV chain) · AirTV 2 (inbound) · GaragePC HP
TouchSmart 520

---

## Rules for maintaining this

1. **Log at order time**, not arrival — ORDERED with ETA, promote to ON HAND when
   Jeff confirms the box.
2. **Nothing gets bought twice** because nobody checked this file. Check here first.
3. **Retired ≠ deleted** — mark RETIRED/RESALE with a reason, keep the row.
4. **Wrong-variant purchases get flagged loudly** (see the Qianhong WiFi sensor) so
   the lesson survives: *verify the protocol variant in the listing before ordering.*
5. Sync the iCloud copy after every edit.

## 2026-08-13 — Sylvania WiFi plugs (4, living room lamps)
**STATUS: ON HAND, working, but VENDOR LOCKED — cannot enter Home Assistant.**
- Tuya hardware (port 6668 confirmed) at .199/.200/.202/.205, but Sylvania locked the product ID
  so ONLY the "SYLVANIA Smart WiFi" app accepts them. Proven 08-13: Smart Life DETECTS a reset plug
  then rejects it — "This device is not supported by this app."
- Sylvania app CAN scan HA's Tuya QR but Tuya blocks the confirm step ("use the designated APP").
- Only remaining route = LocalTuya with hand-extracted local keys. NOT attempted, not worth it.
- **DECISION: replace with Zigbee plugs when the dongle arrives.** Keep these on Sylvania+Alexa meanwhile.
- DO NOT re-attempt the Smart Life path — this is settled.

## ZIGBEE MESH PLUGS — selected 2026-08-14
**BUY: THIRDREALITY Zigbee Smart Plug 4-Pack — ASIN B09KNHWF7L (~$50).** Listing MUST say
"Zigbee Repeater" and "Requires ZigBee Hub". Z2M page 3RSP019BZ verified CLEAN — no routing
warnings (contrast: Enbrighten 43080 warns it stops relaying for child devices). Tested better
range than SONOFF S40 Lite (+5 ft through 2 walls) and zero dropouts over 14 days.

**⚠️ SHIPS IN BLE MODE — must be manually switched to Zigbee mode before it will pair.**
Out of the box it looks dead to the coordinator. Find the exact button sequence at pairing time.

**⚠️ DO NOT BUY the lookalikes:**
- THIRDREALITY "Smart Plug M3" B0FJRNW7YS = Matter over **WiFi**, not Zigbee.
- SONOFF "S40 Lite" exists in BOTH Zigbee (B09XMH3X3G, currently OOS) and WiFi (B09LV7K4DH) versions,
  same product name. Zigbee one says "Hub Needed"; WiFi one says "No Hub Required".
**RULE: "Requires a hub" = the Zigbee one. "No hub required" = WiFi, useless for the mesh.**

Quantity needed: 5 — four to replace the vendor-locked Sylvania living-room plugs, one for the
garage as the relay to the door sensors.

## ORDER 2026-08-14 — arriving 4-8 AM Fri 8/15 (~$33.83)
| Item | For | Cost | Status |
|---|---|---|---|
| **Orbit 57280 3/4" FPT L-Series** auto valve | **MASTER VALVE** — the reason today's valve work slipped | $13.58 | ORDERED |
| **Kasa HS220** dimmer (Amazon Resale, **USED - Mint**) | 3rd dimmer — bedroom/kitchen/living room now all covered | $13.86 | ORDERED |
| Leviton 3-Gang Decora/GFCI wall plate | one of the new multi-gang boxes | $1.82 | ORDERED |
| Leviton F-Connector Decora insert | coax feed into a Decora plate | $4.57 | ORDERED |

**Kasa switch count now 3** (2 on hand + this one) = bedroom, kitchen/dining, living room all covered.
Still needed for lighting: 1x HS200 (garage) — plus the garage 2-location decision (HS210 kit vs cap one position).

**⚠️ The HS220 is USED/refurb.** Before install: FACTORY RESET it (hold the button ~10 s until the LED
blinks amber/green) so it is not still bound to the previous owner's TP-Link account, THEN disable
auto-firmware-update, THEN pair. A used smart switch that is still claimed will silently refuse to pair.

**Orbit 57280 is 3/4" FPT** — matches the existing 3/4" irrigation pipe. Installs below the hose-spigot
tee, between the red winterization ball valve and the manifold; wires to PUMP + COMMON at the controller.

## BACKFLOW / IRRIGATION CONNECTION — 2026-08-15

**Finding:** the valve on the wall stub (old spigot penetration, 3/4" PEX from the main) is a plain
Orbit valve with a **solid jar-top bonnet — no vent openings**. It is NOT a backflow device. The system
has been running with **no backflow protection at the point of connection.**

| Item | Role | Cost | Status |
|---|---|---|---|
| **Orbit 3/4" electric anti-siphon valve** | **DECIDED 8/15** — master valve **+** backflow in one body, on the wall stub | $18.34 | to order |
| *old plain Orbit wall valve (jar-top, no vent)* | **BEING REMOVED ENTIRELY** — was never a backflow device | — | remove |
| **Orbit 57280** 3/4" FPT L-Series valve | bought 8/14 as the master — **redundant now.** Becomes the **SPARE ZONE VALVE.** | $13.58 | HAVE |
| **T&S B-969** 1/2" AVB (ASSE 1001, bronze) | too small — 1/2" chokes the 3/4" line. Not for this job. | — | have, unusable here |
| 3/4" check valve | in the pit with the zone valves | — | installed |

**Orbit 51059** (3/4" FTP brass AVB, $18.49) was looked at and NOT bought — the combined anti-siphon
valve does the same job plus the master-valve function for the same money and fewer fittings.

**The 57280 is not wasted.** Once the anti-siphon valve is the master, the 57280 becomes the spare zone
valve — genuinely worth having, since a failed zone-1 diaphragm is exactly what caused the ~88 gal/day
leak found 2026-08-13. Only ONE valve needs to be wired as the master; don't wire both in series.

**Layout if the anti-siphon valve is used** (diagram: `docs/utilities/backflow_layout.html` + PDF):
wall stub → ONE 90° elbow turning up → anti-siphon valve straddling the riser, **vent dome UP**, cast
flow arrows followed → straight down into the blue 3/4" PEX → pit box (check valve → zones 1-6 → heads).
The valve provides the up/across/down turns internally, so only one elbow is added.

**Rules that govern the device:** dome up and above grade; critical level **6" min above the highest
head** (wall height covers this easily); never more than 12 h under continuous pressure — satisfied
because the vent sits downstream of the valve seat, so closing the valve unloads it.

**Honest limit, unchanged by any option considered:** the six zone valves are shutoff valves DOWNSTREAM
of an atmospheric breaker, which the standard does not strictly permit. The by-the-book fix is a
pressure vacuum breaker (ASSE 1020, ~$80-150) **plus annual testing by a licensed tester** — which is
exactly the utility attention Jeff is avoiding. Decision made knowingly.

**Replacement strategy (Jeff's call, and it is the right one):** an AVB fails SILENTLY — a stiff poppet
looks fine and simply doesn't open when needed. So swap the cheap valve on a schedule rather than pay
~9x for bronze. Target: spring startup, every 1-2 years. **TODO: add a yearly HA reminder** in the
alert batch.
