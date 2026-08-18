# Guardian Air Station — DIY fire / air-quality / gas node (planned 2026-08-18)

**Jeff's spec:** combo smoke + CO + gas + "whatever else we can cram into a project box,"
tied to the wired smoke-alarm interconnect and the hub. Verified 08-18: **no commercial
product does this** (smoke+CO combos exist ~$50; nothing adds radon/gas/hub). So we build.

## Architecture — two layers

- **Layer 1 (legal/life-safety, unchanged):** UL hardwired interconnected alarms.
  A **Kidde SM120X relay ($18.99)** wired to the interconnect (black/white/red) closes dry
  contacts when ANY alarm fires.
- **Layer 2 (the box):** ESP32 DevKit on the ordered 30-pin screw-terminal board, ESPHome,
  WiFi → HA. The SM120X contacts wire **directly into an ESP32 GPIO** (binary_sensor) —
  no Zigbee bridge module needed; the station IS the interconnect listener.

```
[6 wired alarms]--red interconnect--[SM120X relay]--2 wires--┐
[PMS5003 particulate]--UART--┐                               │
[MH-Z19B CO2]---------UART---┼--[ESP32 DevKit + terminal     ├--WiFi/ESPHome--> [Beehive HA]
[ZE07-CO carbon monox.]-UART-┤    board, 5V wall cube]-------┘                     │
[MQ-4 methane/nat-gas]--ADC--┤                                    ┌────────────────┼────────┐
[BME280 temp/hum/press]-I2C--┘                              [phone push]  [Zigbee siren]  [popups/lights]
```

## BOM (prices verified 2026-08-18; re-verify listings at order time)

| Part | Role | Price | Note |
|---|---|---|---|
| **ESP32 DevKit V1, 30-pin** | brain | ~$3–5 AliExpress | ⚠️ NOT YET ORDERED — the $2.39 board ordered 08-18 is only the screw-terminal carrier; the DevKit slots into it. Must be 30-pin to match. |
| **Plantower PMS5003** | laser particulate PM1/2.5/10 — early smoke + AQI | ~$13–15 ([AliExpress](https://www.aliexpress.com/item/1005001573069933.html)) | ESPHome native `pmsx003`; 2026.1 added AQI calc |
| **Winsen MH-Z19B** | NDIR CO₂ | ~$12–18 ([Amazon](https://www.amazon.com/MH-Z19-MH-Z19B-Sensor-Dioxide-0-5000ppm/dp/B09L572ZSD)) | ESPHome native `mhz19` (Z19C US price $29 — buy B on Ali/Amazon) |
| **Winsen ZE07-CO** | electrochemical CO (data-grade) | ~$10–15 ([AliExpress](https://www.aliexpress.com/i/4000070255816.html)) | UART; UL CO stays the hardwired layer's job |
| **MQ-4** | methane / natural gas (gas house!) | ~$2–3 | analog; heater draws ~150 mA; threshold alerts, not calibrated ppm |
| **BME280** | temp / humidity / pressure | ~$2–3 | I²C |
| **Kidde SM120X** | interconnect → dry contact | $18.99 ([Walmart](https://www.walmart.com/ip/126664352)) | mounts in j-box off any alarm in the chain |
| 5V 2A wall cube, project box, wire | power/enclosure | $0 | junk drawer + ordered connectors/Dupont |

**Total new spend ≈ $50–60** (incl. SM120X). Radon: **$15 EPA test kit FIRST**; only if
elevated, add RadonEye RD200 (~$97, native ESPHome BLE) later.

## Flash chain (what's needed — all already available)

1. ESPHome — run via **web.esphome.io** in Chrome on the beast (USB WebSerial flash), or the
   ESPHome add-on on Beehive for OTA after first flash. No extra hardware: DevKit has USB.
2. USB **data** cable (not charge-only).
3. Claude writes the YAML (UART×3 via hardware+software UARTs, ADC, I²C, GPIO binary_sensor
   for interconnect, AQI template); first flash over USB, all later changes OTA.
4. HA auto-discovers the node; alarms wired in `automation.*`: interconnect GPIO → same path
   as the leak alarm (time-sensitive push + Zigbee siren + lights).

## Division of labor
- **Jeff:** SM120X into a j-box on the interconnect; sensors → screw terminals per pin map
  (will be in the YAML doc); box mounting near a hallway alarm + outlet.
- **Claude:** YAML, flash, HA automations, dashboards, calibration curves (MQ-4 burn-in 24–48 h).

Artifact (printable, with diagram): published 08-18. Related: `docs/beehive/panic_alarm_automation.md`
(siren ordered 08-18, $14.59 — arrives with the haul).
