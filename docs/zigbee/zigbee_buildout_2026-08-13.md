# Zigbee Buildout — Running List

Started 2026-08-13. Living document — add to it as things are decided or bought.

Jeff is automating the whole house step by step. Zigbee is the backbone for the
**sensor and switch layer**; ESPHome/WiFi stays for custom builds (mower ESP32,
future CT-clamp energy monitor); cloud only where the vendor gives no local option
(LUX, Blink, B-Hyve, SmartHub).

---

## Coordinator

| Item | Detail |
|---|---|
| **Haozee Zigbee 3.0 USB Dongle Plus** | $8.92 · ETA Aug 13–17 |
| Chipset | **TI CC2652P1** + CH340C USB-serial |
| Radio | +20 dBm PA, removable external SMA antenna |
| Firmware | Ships pre-flashed with Z-Stack 3.x coordinator |

Same silicon as the well-regarded SONOFF ZBDongle-P, not a CC2531 clone. The PA
and external antenna give it better range than the base SONOFF-E originally planned.

**Install note that matters more than people expect:** put it on a **USB extension
cable**, not straight into the J45. USB 3.0 ports emit strong 2.4 GHz noise and
Zigbee sits in that band. Keep it a foot or two from the box and away from the
RTL-SDR. This is the single most common self-inflicted Zigbee problem.

---

## 🔴 Decision made for us: **Zigbee2MQTT, not ZHA**

One of the leak sensors already on order (Gleco Intelligent, "For z2m") states
plainly: **"Don't support ZHA/eWelink app."** So the choice is settled by hardware
already bought.

That's the right call anyway — CC2652P running Z-Stack is Z2M's best-supported
combination, device support is far wider, and the live network map / per-device
link quality is what makes a flaky sensor diagnosable instead of mysterious.

Cost: needs the Mosquitto broker add-on. Ten minutes, once.

---

## Inbound (from AliExpress orders, ETA Aug 13–17)

Read off order screenshots — **counts want confirming against the actual boxes.**

### Water leak sensors — approx. 5
| Store | Item | Price | Note |
|---|---|---|---|
| Haozee Smart | Zigbee water leak detector | $5.09 | ×2 orders seen |
| Gleco Smart Life | Tuya Zigbee water leak, probe cable | $4.40 | |
| Gleco Intelligent | Zigbee water leak, **Z2M version** | $4.62 | ⚠️ Z2M only, no ZHA |
| Excellux | Zigbee water detector | $6.19 | |
| Qianhong | Tuya water sensor | $5.68 | ⚠️ **WiFi variant selected, not Zigbee** |

### Door / window contact sensors — approx. 7–8
| Store | Item | Price | Note |
|---|---|---|---|
| Excellux | Tuya Zigbee door/window, 2 pcs | $9.58 | ordered ×2 |
| Coolo | Zigbee door/window contact, 2 pcs | $6.39 | |
| Excellux | Zigbee door/window, 1 pc | $2.79 | |

---

## ⚠️ Two things worth knowing before it all lands

**1. The Qianhong sensor is the WiFi variant, not Zigbee.** It won't join the mesh.
It'd need Tuya cloud or LocalTuya — a separate integration and a separate failure
mode. Not a disaster for $5.68, but don't count it as part of the Zigbee layer.

**2. Every single inbound device is battery-powered — there are no routers.**

This is the important one. Battery sensors are *end devices*: they sleep, and they
do not relay for anything else. Everything on this list talks directly to the
dongle and nothing extends coverage.

That's fine for sensors near the J45. It gets marginal at the far end of a house.
**Mains-powered devices are what form the mesh** — every one you add makes coverage
better for the battery devices around it.

Which is exactly why the light switches should be Zigbee: four mains-powered
switches spread through the house become the backbone this sensor layer leans on.

---

## Next up: Zigbee dimmers for the lighting project

Replaces the Kasa HS220P3 + HS200 plan (WiFi — see
`docs/lighting/`). All wiring prep carries over unchanged; only the device changes.

Requirements to match against:

- **96–108 W LED loads** (8–9 × 12 W ProGreen panels per room)
- **Neutral required** — confirmed present in the bedroom boxes; **kitchen and
  living room not yet verified**
- **TRIAC / forward-phase dimming** — ProGreen specify an SCR-type dimmer
- **Confirmed working in Zigbee2MQTT**
- 3 × single-pole dimmers (bedroom, kitchen+dining, living room)
- 1 × non-dim for the garage — **2 switch locations**, so needs a 2-gang/companion
  solution, not a single-pole (see Pending Item 19 in CLAUDE.md)

**Shortlist: TO DO** — real products verified in-session, not from memory.

---

## Leak sensor placement (given 2026-08-13)

Today's irrigation leak ran ~3.8 gal/hr undetected until an automation caught it.
These sensors are the indoor equivalent. Priority spots:

- Water heater — highest consequence
- Under each sink
- Washing machine
- HVAC condensate pan
- Any supply manifold indoors

**Not** the irrigation valve box — outdoor, permanently damp, wrong tool.

---

## Also open

- **Master valve** on irrigation supply → PUMP + COM (parts already on hand, free)
- **Zone 1 valve** replacement (leaking diaphragm, part in hand)
- Panic button / siren for the Guardian alarm layer — needs the mesh first
- Kasa switches: **keep sealed if returnable**; otherwise redeploy where WiFi is fine
