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
| Kasa HS220P3 dimmer 3-pack (WiFi) | 1 pk | ON HAND | — | **Return if window open** — superseded by Zigbee decision. Else RESALE/redeploy. |
| Kasa HS200 (WiFi) | 1 | ON HAND | — | same |
| Zigbee dimmer — living room test unit | 0 | **DECISION PENDING** | ~$60 | see wattage finding in `docs/zigbee/` |

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
| MyQ hub + sensor | 1 set | RESALE | — | eBay when Jeff gets to it |

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
