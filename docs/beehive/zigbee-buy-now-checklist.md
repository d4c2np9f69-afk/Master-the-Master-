# Zigbee Alarm — What To Buy Right Now
_Prepared 2026-07-31. This is a "buy this today" companion to the fuller plan in_
_`docs/beehive/safety_shopping_list.md` — that doc already has the full system designed_
_(including your own rule: "tons of life-safety coverage, but lean on intrusion — only_
_key doors, not every window"). This file verifies the two things you're actively_
_eBay-shopping for right now (the dongle + door sensors) against real, current search_
_results so you don't buy the wrong version, and adds exact search terms + sources._

## ✅ Confirmed: what the existing plan already picked is still the right call

I checked every product already named in `safety_shopping_list.md` against fresh 2026
sources. Nothing needs to change. Here's the verification:

| Item already decided | Still correct? | Note |
|---|---|---|
| Sonoff Zigbee 3.0 Dongle Plus, **model "P"** | ✅ Yes | The CC2652P chip is the long-proven, community-reference coordinator — still recommended in every current comparison for a "many devices, want it to just work" setup like yours. |
| HEIMAN HS2WD-E siren | ✅ Yes, with one honest caveat | Real, still sold, still works. Its Home Assistant integration is noticeably better under **Zigbee2MQTT** than plain ZHA (ZHA only exposes the battery cleanly; the siren trigger itself works but is more limited). Doesn't block you — `siren.turn_on` still works for the panic automation either way — just know Z2M gives you more control (volume/duration) if you ever want it. |
| Frient/Heiman smoke + CO detectors | ✅ Yes | Frient HESZB-120 in particular came up repeatably as a top 2026 pick. |
| Water-leak sensors (~$12 ea) | ✅ Yes | SONOFF SNZB-05P is the current version — same price range, has an optional extension probe cable worth getting for spots like under the water heater. |
| Motorized main-line valve | ✅ Yes | **Aqara Valve Controller T1** is a real, current, confirmed-compatible product that retrofits onto your existing shutoff handle (no plumbing cut) — fits 1/2", 3/4", 1" pipe. This is the specific one to search for. |

## 🛒 Buy first — the two things you're shopping for right now

### 1. The dongle
**Search for:** `SONOFF Zigbee 3.0 USB Dongle Plus ZBDongle-P`
- ~$20. This is the coordinator — the "radio" that talks to every other device on this list.
- **Also grab a USB extension cable (~$6, any basic USB-A one, 1.5–3 ft)** if you don't
  already have one from the RTL-SDR setup. This isn't optional — USB 3.0 ports throw off
  interference in the exact 2.4GHz band Zigbee uses, and every setup guide says to move
  the dongle away from the J45 with an extension. Skipping this is the #1 cause of "my
  Zigbee devices keep dropping."

### 2. Door sensors
**Search for:** `SONOFF SNZB-04P` (note the **P** — this is the newer version; the plain
"SNZB-04" without the P still works but has weaker tamper detection and shorter battery life)
- ~$10–13 each.
- Per your own plan: **buy 3–4**, not one per door/window — front door, back door,
  garage↔house door. That's "lean on intrusion" done right.

**Total for both of these today: roughly $65–75** (dongle + cable + 4 door sensors).

## What to search for later (Phase 2, no rush — order doesn't matter)

- `HEIMAN Zigbee smoke detector` or `Frient HESZB-120`
- `HEIMAN Zigbee CO detector`
- `SONOFF SNZB-05P` (water leak)
- `SONOFF SNZB-02P` (temp/freeze)
- `Aqara Valve Controller T1` (water-main shutoff)
- `HEIMAN HS2WD-E siren`

## Setup order once the dongle + door sensors arrive

1. Plug the dongle into the **USB extension**, not directly into the J45.
2. Beehive → **Settings → Devices & Services → Add Integration → Zigbee Home Automation (ZHA)**
   → it should find the dongle's serial port automatically.
3. Pair each door sensor (hold its button ~5 sec until it blinks) — ZHA prompts you to
   confirm each one as it's found.
4. Once you've got the siren paired too, `docs/beehive/panic_alarm_automation.md` has the
   ready-to-paste automation — just swap in the real entity IDs ZHA gives you.

---

## Sources (checked today, not from memory)
- [Best Zigbee Coordinators for Home Assistant 2026 — SmartHomeScene](https://smarthomescene.com/top-picks/best-zigbee-coordinators-for-home-assistant/)
- [ZBDongle-P vs ZBDongle-E — Home Assistant Community](https://community.home-assistant.io/t/zbdongle-p-vs-zbdongle-e-vs-lidl-gateway/492732)
- [Sonoff ZBDongle-E vs ZBDongle-P comparison](https://smarthomecompared.com/dongles/sonoff-zbdongle-e-vs-sonoff-zbdongle-p)
- [Best Zigbee Door/Window Sensors for Home Assistant 2026 — SONOFF](https://sonoff.tech/en-us/blogs/news/best-zigbee-door-window-sensors-for-home-assistant-setup-and-automation-guide)
- [Sonoff SNZB-04PR2 Zigbee Door Sensor Review — SmartHomeScene](https://smarthomescene.com/reviews/sonoff-snzb-04pr2-zigbee-door-sensor-review/)
- [Heiman HS2WD-E siren + Zigbee2MQTT — official device page](https://www.zigbee2mqtt.io/devices/HS2WD-E.html)
- [Heiman ZigBee Alarm Siren HS2WD-E Review — SmartHomeScene](https://smarthomescene.com/reviews/heiman-zigbee-alarm-siren-hs2wd-e-review/)
- [Zigbee Smoke Detector Comparison, June 2026 — Home Assistant Community](https://community.home-assistant.io/t/zigbee-smoke-detector-comparison-full-article-june-2026/1014235)
- [Heiman joins Works with Home Assistant — official HA blog](https://www.home-assistant.io/blog/2026/02/24/heiman-joins-works-with-home-assistant/)
- [Home Assistant Water Leak Sensor Setup Guide — SONOFF](https://sonoff.tech/en-us/blogs/news/home-assistant-water-leak-sensor-setup-guide-get-leak-alerts-before-water-damage-happens)
- [Aqara Valve Controller T1 announcement](https://markets.financialcontent.com/clarkebroadcasting.mycentraloregon/article/bizwire-2024-11-19-aqaras-new-valve-controller-t1-modernizes-home-water-management)
