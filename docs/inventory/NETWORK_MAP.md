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
| — | Zmodo fleet | ✅ ALL DARK 08-13: .104 was a stale lease (already dead); the live .207 was found ON THE BACK DECK plugged in with the covered TV — unplugged by Jeff, factory-reset pending, eBay pile. Braxton-room units long gone. Privacy issue closed |

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

---

# CLEAN CENSUS — after "Clear and Rescan," 2026-08-13 late (the label layer)

Gateway cannot rename devices; THIS table is the authoritative label for every live device.
80+ stale entries purged; only live devices below. Sleepers (watches, mower ESP32, off Blink
cams) will re-register as they wake — that's correct behavior.

| IP | Gateway shows | ACTUAL DEVICE |
|---|---|---|
| .66 | homeassistant (Eth LAN-3, 1G) | **Beehive** — HA on Beelink J45, FIXED |
| .196 | RE200 (Eth LAN-1, 1G) | **Wired AP** — Loewen301 ch6 + Loewen301-5G |
| .215 | 20BEB83A8C5D | **Fire TV** (PiPup target), FIXED |
| .194 | 301Server (Eth LAN-4, 1G) | ✅ **THE BEAST** — confirmed 08-13 (its own Ethernet reports .194). CodeProject.AI host, Claude coworker machine |
| .222 | NETGEAR NTV300 (Eth LAN-1) | old NeoTV streamer — WIRED; still used? |
| .68 | VIZIOCastAudio4523 (Eth LAN-1) | Vizio soundbar |
| .164 | WS-SD00PJBA (Eth LAN-1) | ✅ **Angela's work computer** (Lenovo/LCFC-built, corporate hostname) — wired at her office jack (office = her Lenovo work laptop + the HP printer, confirmed by Jeff) |
| .251 | VC-E-L-2T3HD74 | Vizio E-series TV |
| .241 | 32onnRokuTV | onn 32" Roku TV |
| .208 | HP444BD6 | HP printer |
| .197 | MyQ-E31 | ⚠️ MyQ hub — UNPLUG + reset for eBay |
| .198 | CMWC1ZZABR | likely B-Hyve controller (?) |
| .166 | dp-730602E4 | possibly AirTV 2 (?) |
| .171 | "Nest Protect" | ⚠️ IMPOSTOR — mains-powered Tuya-family device. NOT the C20A (proven by battery-pull 08-13). Suspects: a Smart Life socket or Sharky dock. Identify by unplugging suspects one at a time |
| .209 | TY_WR | Tuya device (socket or vacuum) (?) |
| .204 | Linux | Amazon MAC — likely Blink Sync Module |
| .231 | Linux | (?) unknown, WiFi |
| .214 | Blink-Device | one of the 6 Blink cameras |
| .200/.202/.205 | wlan0 ×3 | likely Echo Dots (one now in the GARAGE per Jeff) (?) |
| .170 / .224 | ESP_DFC785 / ESP_DFE142 | ✅ **Garage-fan socket / Jeff's bed-lamp socket** — Tuya IDs embed their MACs; the "mystery ESP8266s" were store-bought Tuya sockets all along. .195 ESP_0BDE3B = likely a third Tuya socket (asleep) |
| .82 | none-6 | (?) unknown |
| .161 | none-5 | (?) unknown |
| .172 | (UUID name) | Angela's iPhone (private-address mode) |
| .223 | iPhone | Jeff's iPhone |
| .227 | unknownf66584925fe7 | (?) iOS-style private address |

| .176 | JeffsLapTop | ✅ **Acer Aspire E5-576** — i3-8130U (8th gen, AVX-capable — could host AI workloads unlike B570/GaragePC), 16 GB, 466 GB. On WiFi — move to Loewen301-5G |
| .173 | DellMasterBed | ✅ **Lenovo B570** (hand-me-down hostname, per 08-05 note — original record was RIGHT), wired |
| .232 | esp32-6BFCA4 | ✅ **THE MOWER BOX** — confirmed 08-13 by 5-min heartbeat timing after the purge. The dormant esp32-21206C is a DIFFERENT board (?) |

**Every (?) row is a question only Jeff can answer** — fill them in as identified.

## Identifications 2026-08-13 afternoon
- **.164 WS-SD00PJBA = Angela's WORK COMPUTER** (Lenovo-built, corporate hostname), wired via house Cat6.
- **LAN-1 is the central Cat6 fan-out switch**, not a TV-stand cluster — its devices are in different rooms. TV stand physically holds only: J45/Beehive, soundbar, TV, the beast. (Second unmanaged switch's location: TBD, invisible by design.)
- **Sharky is ALIVE in HA** (docked, 100%, full telemetry) — the July "offline, needs power-cycle" note is stale. Sharky is a live suspect for .171 or .209.
- **.171 impostor behavior:** constant flap (up/down every 1–2 min) but never dies — battery-saver or weak-radio fingerprint, NOT a solid mains socket pattern. Unplug game (4 Smart Life sockets + Sharky dock) still the decider.
- Kodi: no dedicated HTPC — installed across multiple computers.

## .171 endgame (2026-08-13)
Port 6668 open on .171 and .209 = both CONFIRMED Tuya-local devices. Tuya registry
holds 5 hardware devices; MAC-embedded IDs prove .224=Jeff's bed lamp, .170=garage fan.
Remaining lineup for the ".171 Nest Protect" impostor: **hot-water-pump socket,
Angela's bed-lamp socket, or Sharky** (flap pattern favors Sharky). One unplug round settles it.
