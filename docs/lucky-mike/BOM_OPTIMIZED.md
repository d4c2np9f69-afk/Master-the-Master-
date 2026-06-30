# Lucky Mike Smart Stall — Optimized Bill of Materials (Claude's rev)

> My cost-optimized, Home-Assistant-LOCAL parts list. Replaces ChatGPT's
> over-specced picks. **Guiding rule:** the stall already has a capable ESP32 +
> good Wi-Fi + a 120V outlet, so hang cheap sensors off the ESP32's GPIO and use a
> plug-in smart plug for the fan — don't buy a branded $15–25 gadget per function.
> Prices are rough 2026 estimates; budget the high end.

## Site facts (confirmed by Jeff 2026-06-30)
- **Barn Wi-Fi is strong** → plain Wi-Fi ESP32 + Wi-Fi cameras are fine; no PoE/
  external-antenna needed for range. (PoE still nice-to-have if a stall is wired.)
- **Each stall has a 120V wired receptacle** (for fans, etc.) → power the ESP32
  from a $5 USB adapter at the outlet (no battery), and control the fan with a
  **plug-in smart plug** (no mains wiring, customer-installable, no electrician).

## Per-stall module — ESSENTIAL (Bronze)
| Part | Pick | ~$ | Notes |
|---|---|---|---|
| Controller | ESP32 WROOM DevKit | 6 | ESPHome; USB-powered from stall outlet |
| Power | 5V USB adapter + cable | 5 | No battery needed (outlet present) |
| Temp/Humidity | BME280 (genuine) **or** SHT31 | 5–6 | SHT31 = better humidity; avoid fake BMP280 |
| Stall temp probe | DS18B20 waterproof ×1 | 3 | one is enough (drop ChatGPT's duplicate) |
| Presence/"down" | LD2410 mmWave | 5 | native ESPHome `ld2410`; in-stall occupancy/motion |
| Water level | JSN-SR04T ultrasonic (continuous) **or** float switch (low-alert) | 6 / 2 | contactless ultrasonic over trough = best cheap option |
| Water leak | leak probe/rope to GPIO | 2 | not a $13 branded unit |
| Door | reed switch to GPIO | 1 | not a $8 branded unit |
| **Fan control** | **Sonoff S31** (flash ESPHome/Tasmota, local) **or Shelly Plus Plug US** | 15 / 20 | **with power monitoring** → confirms fan actually drawing current |
| Camera | Reolink Wi-Fi (HA-local via RTSP/ONVIF) **or** Tapo C120 | 35–50 | Reolink integrates cleaner/local than Tapo |
| Enclosure | IP65 box + glands | 12 | barn dust/moisture; essential |
| Misc | dupont, terminal blocks, mounts | 8 | |
| **Per-stall essential subtotal** | | **~$100–125** | + 1 camera |

## Barn-level (shared, buy ONCE — not per stall)
| Part | Pick | ~$ | Notes |
|---|---|---|---|
| Network backup | small UPS on router/switch (CyberPower 425–600VA) | 55–70 | one blip-proof point beats a battery in every stall |
| (Wi-Fi/router) | existing — confirmed good | — | |

## Phase add-ons (per stall, optional)
| Add-on | Parts | ~$ |
|---|---|---|
| Feed weight | HX711 + load cell + mounting frame | 12 + frame |
| Extra camera angle | 2nd Reolink/Tapo | 35–50 |

## Phase 4 — GPS halter (per horse, optional R&D)
- **Store-and-forward (Wi-Fi only):** ESP32 + NEO-M8N GPS + LiPo ≈ **$25–30**.
  Logs in pasture, uploads at barn. **No live location off-property.**
- **Live tracking (cellular):** LTE-M board (e.g., LilyGO T-SIM7080G) ≈ **$35–45**
  + low-data SIM (Hologram/Soracom) **$1.5–5/mo** (pass-through to customer).
- Real constraints: battery life, halter weight, needs open sky (no fix under a
  shed). Frame as future/R&D, not a v1 promise.

## DROP from ChatGPT's list (and why)
- **microSD on the ESP32** — HA is the historian; redundant + FAT-corruption risk.
- **Li-ion 5200mAh power bank** — redundant with backup, and power banks auto-shut
  off under the ESP32's tiny draw. Outlet power makes it pointless anyway.
- **Per-stall UPS** — back the barn network once instead.
- **Branded single-function sensors** ($13–25) where a $1–6 GPIO part is better.

## Why this is the CFO story
Fewer separate devices = fewer failure points and fewer clouds. Everything is
**local to Home Assistant → $0/month** (except optional GPS SIM). Cheaper parts,
more reliable, and a clean "no subscription" pitch.
