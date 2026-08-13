# Home Network Map — BGW320-500 device census (2026-08-13)

Captured from the gateway's IP Allocation table. The BGW320 cannot rename devices —
names below are self-reported hostnames; identifications are from MAC vendor prefixes
plus project knowledge. **(?) = needs Jeff to confirm.**

## Gateway config as of tonight (changed by Claude, Jeff-approved)
- 2.4 GHz: `Loewen301`, **channel pinned to 1**, password unchanged — all IoT untouched (mower posted at −66 dBm post-change)
- 5 GHz: renamed **`Loewen301-5G`**, same password — phones/TVs/laptops rejoin this for speed
- Band steering: disabled (consequence of the split — intended)
- Zigbee plan: **channel 25** on the dongle (max separation from WiFi ch 1)
- Fixed allocations: **.66 Beehive** (Jeff, earlier) · **.215 Fire TV** (added tonight)

## Infrastructure
| IP | Name | What it is |
|---|---|---|
| .254 | gateway | AT&T BGW320-500 |
| .66 | — | **Beehive** (HA, Beelink J45) — FIXED |
| .196 | RE200 | ✅ CONVERTED 08-13: **wired Access Point** (Cat6 backhaul). Broadcasts Loewen301 (2.4, ch 6) + Loewen301-5G (WPA2, house password). Admin: http://192.168.1.196, password in HCC-secrets. The volatile wireless-repeater hop is GONE |
| .194 | 301Server | (?) house-number name — the beast? CodeProject.AI host? |
| .121 | GaragePC | HP TouchSmart (wired NIC; second random-MAC entry is its WiFi) |

## HCC project devices
| IP | Name | What it is |
|---|---|---|
| .215 | 20BEB83A8C5D | **Fire TV** (PiPup target) — FIXED tonight |
| .209 | TY_WR | Tuya device — Sharky vacuum or a Smart Life socket (?) |
| .198 | CMWC1ZZABR | likely the **B-Hyve controller** (?) |
| .166 | dp-730602E4 | possibly the **AirTV 2** (?) |
| .164 / — | WS-SD00PJBA / WS-Uejlwa4yAnSI | (?) unknown "WS-" pair — LUX thermostat? |
| — | esp32-21206C, esp32-6BFCA4 | one is the **mower box** (mostly "off" = sleeping, correct); what's the other? (?) |
| .170/.224/.195/.210 | ESP_DFC785, ESP_DFE142, ESP_0BDE3B, espressif | **four more ESP8266/ESP32s, online** — Jeff's other builds? (?) |
| .171 | Nest Protect | **smoke/CO alarm — HA has a Nest integration; Guardian candidate, zero new hardware** |
| .222 | NETGEAR NTV300 | old NeoTV streamer — still online; still used? (?) |
| .197 | MyQ-E31 | ⚠️ **MyQ hub still online — being sold on eBay. Unplug + factory-reset before listing** |

## Cameras
| IP | Name | What it is |
|---|---|---|
| .214–.220, .204 | Blink-Device ×7, "Linux" | 6 Blink cams + sync module (.204 is Amazon-MAC "Linux" = likely Sync Module 2) |
| Mini-1 / Mini-2 | — | likely **Blink Mini** indoor cams (Mini-2 has an Espressif MAC) (?) |
| .207/.104 + off entries | Zmodo-IPC, BraxtonBedroom3/4, BraxtonsBedroom, Main-Bedroom-2 | **legacy Zmodo camera system, partially ONLINE** — still wanted, or retire? (?) |

## Entertainment / family
Vizio TV ×2 + VIZIOCastAudio4523 (.68 = the soundbar) + VC-E-L-2T3HD74 (.251, Vizio E-series) ·
32onnRokuTV (.241) · PS5 · XBOX · HP printer (.208) · Angelas-iPhone (.172) · Jeff's iPhone (.223) ·
Braxtons-MacBook-Air ·  DellMasterBed (= Lenovo B570) · OfficeMain (?) · Apple Watches (several
rotating private MACs) · assorted iPhones/UUID names = iOS private WiFi addresses (normal)

## Oddballs to identify
- **SHENZHEN RF-LINK** — possibly the Weather Underground station console (KTNWHITE21)? (?)
- `.82 none-3` / `.161 none-4` — unknown, online (?)
- 3× `wlan0` at .200/.202/.205 (same vendor prefix, online) — likely **Echo Dots** (?)
- `android-2dc969f...` — an Android device (?)

## Standing notes
- Names are device-reported; this file is the rename layer. Update it when devices are added/retired.
- The 2.4 channel is PINNED (1). If WiFi congestion ever appears, re-evaluate here **and** check the Zigbee channel before moving it.

## Update 2026-08-13 late — extender fleet
- **RE200 → wired AP, done** (see Infrastructure row). Login lesson: its 2018 login page fails SILENTLY when the request rides a flapping wireless link — every "wrong password" was really a dropped link. Wired access worked first try.
- **Generic "Wireless-N Repeater"** (no-name, 2.4-only, MAC 00:E0:20:84:30:FB, broadcasts `Loewen301_Ext`, default 192.168.10.1 admin/admin): **RETIRE.** Cheap wireless-only repeat, pure airtime pollution next to the new wired AP. Unplug once RE200 coverage is confirmed; it has a LAN port but is not worth AP conversion.
- **D-Link DAP-1520** (dual-band, MAC 1C:5F:2B:B9:08:62): the `Loewen301-EXT`/`-EXT5G` broadcaster. **RETIRE — no Ethernet port, conversion impossible** (Jeff spotted the disqualifier himself). eBay-able.
- RE200 admin password set = WiFi password (recorded in HCC-secrets/att_bgw320_gateway.txt file).
