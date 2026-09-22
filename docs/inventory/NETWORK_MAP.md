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
| .121 | GaragePC | HP TouchSmart — ⚠️ OFFLINE since extender retirement: ✅ ACCESSIBLE from beast 08-13. Account "Jeff Loewen Office 2" (NOT jeffl) needs its own password to browse — creds in HCC-secretsgaragepc.txt. Now on Loewen301-5G (.212) as well as .121. Win10 Pro, SMB2 on |

## HCC project devices
| IP | Name | What it is |
|---|---|---|
| .215 | 20BEB83A8C5D | **Fire TV** (PiPup target) — FIXED tonight |
| .209 | TY_WR | Tuya — hot-water-pump socket or Sharky (last two unclaimed Tuya devices) (?) |
| .198 | CMWC1ZZABR | 🔴 **NOT the B-Hyve — disproven 2026-09-03 by MAC vendor.** The B-Hyve is **`.187`**, OUI `44:67:55` = **Orbit Irrigation**. `.198` is UNIDENTIFIED; do not re-guess it as the timer. |
| .166 | dp-730602E4 | 🔴 **NOT the AirTV — disproven 2026-08-27 by MAC.** `.166` is `00-fc-8b-23-64-87`; the AirTV's label reads `88:B6:EE:C7:06:E5`. Different OUI entirely. **`.166` is still UNIDENTIFIED — do not re-guess it as the AirTV.** |
| .164 / — | WS-SD00PJBA / WS-Uejlwa4yAnSI | (?) unknown "WS-" pair — LUX thermostat? |
| — | esp32-21206C, esp32-6BFCA4 | one is the **mower box** (mostly "off" = sleeping, correct); what's the other? (?) |
| .170/.224/.195/.210 | ESP_DFC785, ESP_DFE142, ESP_0BDE3B, espressif | **four more ESP8266/ESP32s, online** — Jeff's other builds? (?) |
| .171 | "Nest Protect" | ❌ NOT a smoke alarm — see clean census: Angela's bed-lamp Tuya socket with a fake hostname |
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
Braxtons-MacBook-Air ·  DellMasterBed (= B570 w/ inherited name) · OfficeMain (?) · Apple Watches (several
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
- RE200 admin password set = WiFi password. ⚠️ **THE POINTER IN THIS LINE WAS WRONG — corrected 2026-09-03.** It is **NOT** in `att_bgw320_gateway.txt`; that file holds only the gateway access code and the unused factory SSID. The value is now recorded in **`HCC-secrets/HCC_ACCESS.md` §5**, together with the house WiFi password, which had never been written down anywhere. The FACT was right (admin password = WiFi password, verified by logging in 2026-09-03); only the location was. 🔴 `admin` is NOT the password — tested and rejected; the device locks after 10 attempts and 2 are used.

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
| .164 | WS-SD00PJBA (Eth LAN-1) | ✅ **Angela's work computer** (Lenovo/LCFC-built, corporate hostname) — wired at her office jack. ⚠️ Both of Angela's work machines run corporate VPN + firewall — they take a LAN address but tunnel all traffic and won't answer local probes; silence is NORMAL, never troubleshoot it. Her client Dell (2nd work machine, office) is likewise mostly invisible on the LAN |
| .251 | VC-E-L-2T3HD74 | Vizio E-series TV |
| .241 | 32onnRokuTV | onn 32" Roku TV |
| .208 | HP444BD6 | HP printer |
| .197 | MyQ-E31 | ⚠️ MyQ hub — UNPLUG + reset for eBay |
| .198 | CMWC1ZZABR | 🔴 NOT the B-Hyve — see above, disproven 2026-09-03. UNIDENTIFIED. |
| .166 | dp-730602E4 | **NOT the AirTV** (MAC mismatch, 2026-08-27). Still unidentified. |
| .171 | "Nest Protect" | ✅ **UNMASKED 08-13: Angela's bed-lamp Tuya socket** — proven by unplug test (down, held 60s+, at 14:50). Cheap Tuya firmware self-reporting a fake hostname. There is NO Nest hardware in this house |
| .209 | TY_WR | ✅ **Hot-water recirculating pump socket** (garage) — last Tuya standing after Sharky=.231. Switched OFF but plugged in, so radio stays up. Flap = weak garage signal |
| .204 | Linux | Amazon MAC — likely Blink Sync Module |
| .231 | Linux | ✅ **SHARKY** (robot vacuum) — proven 08-13 15:03: died the moment Jeff switched it off. Linux-based, hostname says only "Linux" |
| .214 | Blink-Device | one of the 6 Blink cameras |
| .199/.200/.202/.205 | wlan0 / (new) | ✅ **The 4 Sylvania SMART+ WiFi lamp plugs, living room** — Tuya port 6668 confirmed on all four 08-13 evening. NOT Echo Dots, NOT Bluetooth: earlier "pull test showed nothing" was a monitor watching the wrong IPs. CAN join HA via Smart Life re-pair if ever wanted |
| .170 / .224 | ESP_DFC785 / ESP_DFE142 | ✅ **Garage-fan socket / Jeff's bed-lamp socket** — Tuya IDs embed their MACs; the "mystery ESP8266s" were store-bought Tuya sockets all along. .195 ESP_0BDE3B = the remaining Tuya socket (mini smart socket / smart socket 2), sleepy |
| .82 | none-6 | (?) unknown |
| .161 | none-5 | (?) unknown |
| .172 | (UUID name) | Angela's iPhone (private-address mode) |
| .223 | iPhone | Jeff's iPhone |
| .227 | unknownf66584925fe7 | (?) iOS-style private address |

| .176 | JeffsLapTop | ✅ **Acer Aspire E5-576** — i3-8130U, 16 GB (2×8 GB dual-channel, verified), Crucial MX500 466 GB SSD. **Set up 2026-09-18:** now on **Loewen301-5G** (802.11ac, 433 Mbps), CCleaner removed + Clean-Beast + Bitwarden + Python installed, Proton VPN disabled, Ultimate Performance, never-sleep, sshd auto + watchdog, updates installed. 🔴 **RECURRING HARD FREEZE.** 58 unclean shutdowns since 02-2025, ~1 per 10 days, 3 on 09-18. Not power (frozen, not off), no WHEA, no bugcheck. **Suspect status 2026-09-18 evening:** (1) **RAM CLEARED as a cause of config** — both sticks read as a *matched* Timetec `TIMETEC-SD3-1600` pair, both rated+running 1600 at 1.35 V (mismatch theory dead); a Windows Extended memtest was armed but aborted (would have taken ~20 h, and Standard/Windows memtest is the weak tool anyway — MemTest86 on USB is the real check if RAM stays a suspect). (2) **Intel UHD 620 driver UPDATED 2019 `25.20.100.6615` → 2026 `31.0.101.2141`** via `pnputil` on `iigd_dch.inf` at ~8:17 PM (the `gfx_win` exe is a WinRAR SFX around `Installer.exe`; installed by INF, verified in the driver store). 🔴 **FROZE AGAIN ~9:45 PM** — no ping/no SSH, on never-sleep — **~90 min after the driver install and BEFORE a reboot that would fully reinitialise the new display driver.** So this occurrence does NOT clear or convict the driver; it needs a clean reboot on 2141 and then time. Needs a hard power-cycle to recover (same as prior freezes). **See OPEN_ITEMS.** **FILES 2026-09-18 10:06 PM:** the Acer's own OneDrive fails to sign in (`0x8004DE25`, a 2023-vintage cached credential OneDrive can't refresh — needs Jeff's password, which I don't handle). So its files come the same way the Lenovo's do: the Beast's open OneDrive share is **mapped as drive `O:`** (guest, no password, `AllowInsecureGuestAuth=1`, logon task `HCC-MapBeastAtLogon`, desktop shortcut "Beast Files (O drive)"). Proven by `dir O:\` from Jeff's own session. The broken OneDrive is **parked** (autostart removed, Run value saved as `OneDrive_PARKED_by_HCC`, account/app/local files intact) so it stops nagging; one sign-in re-enables it. Wake-on-WiFi tested and FAILS (QCA9377); Ethernet port has S5 WoL but jack is cracked/unplugged. |
| .173 | GarageLaptop | ✅ **Lenovo B570 (1068BAU)** — Pentium B960, 8 GB, Crucial MX500 466 GB SSD. **WIPED to Ubuntu 26.04 on 2026-09-18** (was Windows 10, name was "DellMasterBed"). Set up to match the Windows machines: auto-login (no password), never-sleep, lid-on-mains=ignore, sshd + watchdog, Chrome + Bitwarden + app shortcuts, GNOME themed Windows-like, auto-updates. WiFi = Qualcomm AR9285, **2.4 GHz only** (no 5 GHz hardware), −30 dBm. SSH as `jeffloewen`. Angela's client Dell is a separate corporate machine, not this entry. |
| .232 | esp32-6BFCA4 | ✅ **THE MOWER BOX** — confirmed 08-13 by 5-min heartbeat timing after the purge. The dormant esp32-21206C is a DIFFERENT board (?) |

**Every (?) row is a question only Jeff can answer** — fill them in as identified.

## Identifications 2026-08-13 afternoon
- **.164 WS-SD00PJBA = Angela's WORK COMPUTER** (Lenovo-built, corporate hostname), wired via house Cat6.
- **LAN-1 is the central Cat6 fan-out switch**, not a TV-stand cluster — its devices are in different rooms. TV stand physically holds only: J45/Beehive, soundbar, TV, the beast. (Second unmanaged switch's location: TBD, invisible by design.)
- **Sharky is ALIVE in HA** (docked, 100%, full telemetry) — the July "offline, needs power-cycle" note is stale. Sharky is a live suspect for .171 or .209.
- **.171 impostor behavior:** constant flap (up/down every 1–2 min) but never dies — battery-saver or weak-radio fingerprint, NOT a solid mains socket pattern. Unplug game (4 Smart Life sockets + Sharky dock) still the decider.
- Kodi: no dedicated HTPC — installed across multiple computers.

## Tuya endgame — FULLY SOLVED 2026-08-13
- **.171 = Angela's bed-lamp socket** (unplug test, 14:50; replugged, back online)
- **.231 = Sharky** (off-switch test, 15:03 — the "Linux" unknown all along)
- **.209 = hot-water pump socket** (last Tuya standing; off-but-plugged-in)
- **.195 = remaining Tuya socket**, sleepy
- .224 = Jeff's bed lamp, .170 = garage fan (MAC-embedded IDs)
- **.199/.200/.202/.205 = the 4 Sylvania WiFi lamp plugs** (Tuya port-scan, post-reset)
Every fake-hostname mystery on the network is now identified.

## Gateway changes 2026-08-14
- **2.4 GHz Mode: G/N -> B/G/N.** Done while troubleshooting a Kasa HS220 that would connect to its
  own setup AP but never join the WiFi. G/N excludes 802.11b; the HS220 is a b/g/n device. Change is
  purely permissive. Verified afterwards: all four Tuya sockets, B-Hyve, garage fan, RE200 and the
  mower box reconnected normally.
- **Guest SSID (LoewenGuest): DISABLED.** Jeff confirmed nobody uses it. One less broadcasting
  network and one less entry point. Reversible in the same Wi-Fi page.
- **Confirmed good and left alone:** WPA-2 (NOT WPA3 - would break older IoT), channel 1 fixed,
  20 MHz, SSID not hidden, WPS off, max clients 80, band steering off.
- Kasa still had not joined as of this change. Prime remaining suspect is the Kasa app offering
  **Loewen301-5G** in its network picker - the switch cannot see 5 GHz, so it accepts credentials
  and then hunts forever. Must be Loewen301.

---

# UPDATE 2026-09-03 — identifications CONFIRMED by MAC vendor, not guessed

**This is the label layer. The BGW320 still cannot rename devices — verified again 2026-09-03 by
logging into `/cgi-bin/ipalloc.ha` with the access code: the page offers `Allocate` (fixed DHCP)
and nothing else. There is no nickname field. Device nicknames are an AT&T Smart Home Manager
feature, not a gateway one.** So this table remains the only rename layer, exactly as the 08-13
session concluded.

Method: vendor prefix looked up per-OUI (first three octets only — never the full MAC) and
cross-checked against timestamps and open ports. No guessing.

| IP | MAC / OUI | vendor | identification | evidence |
|---|---|---|---|---|
| **.187** | `44:67:55:43:3e:52` | **Orbit Irrigation** | 🟢 **B-Hyve "Water Hog" irrigation timer** | Joined 2026-09-03 **14:25:54**; Orbit's cloud `last_connected` reads **14:25:45 CT** — 9 seconds apart. Hostname self-reports `espressif` (it is ESP-based), which is why it does NOT look like a timer in the gateway list. |
| **.186** | `fc:49:2d:...` | **Amazon Technologies** | 🟢 **Echo Dot, living room** | Re-plugged by Jeff 2026-09-03; appeared 14:05. Hostname `none-2`. |
| **.208** | `30:e1:71:44:4b:d6` | **Hewlett Packard** | 🟢 **HP OfficeJet 4650 printer** (hostname `HP444BD6`) | Ports **631 (IPP) + 9100 (JetDirect) OPEN, 445/139 closed**. ⚠️ It briefly looked like a GaragePC candidate — it is not. |
| **.177** | `36:dc:76:e7:50:40` | (iOS private MAC) | Jeff's iPhone **today** | ⚠️ The old map lists Jeff at `.223` — DHCP has moved. Do not treat those rows as fixed. |

## 🔴 Where the B-Hyve actually sits, and why it matters

**It is on the GATEWAY radio (`Loewen301`, ch 1), NOT on the RE200.** Confirmed from the RE200's
own client list (`status?form=ap_status`), which showed 6 clients at 14:26 and **not `.187`**.
Gateway rates it **4 bars**.

⚠️ **DO NOT use the gateway's "Connection Type" column to decide which AP a device is on.** Proven
wrong 2026-09-03: Jeff's iPhone showed as `Wi-Fi | 2.4 GHz` on the gateway **while the RE200
simultaneously listed it as one of its own clients**. The RE200's client list is the only reliable
source for that question.

**Congestion argument for wanting it on the RE200** (measured, `netsh wlan show networks mode=bssid`):
gateway ch 1 utilisation **44%**, RE200 ch 6 **23%**. Same SSID, same PSK on both — a correct
roaming setup, so a client chooses for itself and this one chose the gateway.

## Why the timer was dark for 21 days

`last_connected` was frozen at **2026-08-13T18:30:52Z** — the same day this census retired the
extender fleet. The SSIDs those units broadcast (`Loewen301_Ext` from the Wireless-N repeater,
`Loewen301-EXT`/`-EXT5G` from the D-Link DAP-1520) **no longer exist**; an air scan on 2026-09-03
found only `Loewen301`, `Loewen301-5G`, `LoewenGuest` and neighbours. Same failure as the GaragePC.
Fixed by re-provisioning through the B-hyve app's **Update Wi-Fi Settings** — see
`docs/utilities/bhyve_wifi_reconnect.md`. ⚠️ **Jeff checked and the app did not display the old
SSID, so the orphan theory fits the timeline but was never directly confirmed.**

## 🔴 THE ENTIRE NETWORK CORE IS IN THE MASTER BEDROOM (Jeff, 2026-09-22 8:09 AM)

**Jeff: *"The j45 beehive sits on top of the beast."*** Combined with the 6:37 AM layout and the
photo of the bedroom dresser, that puts **three critical things in one corner of one room**:

| in the master bedroom | |
|---|---|
| **BGW320 gateway** `.254` | the white unit on the dresser |
| **The Beast / 301Server** `.194` | |
| **J45 Beehive** `.66` | **sitting on top of the Beast** — so Home Assistant **and the Zigbee coordinator and its antenna** are here too |

### Two consequences, and both are measurable rather than theoretical

**1. 🔴 ZIGBEE RADIATES FROM THE MASTER BEDROOM**, not from the middle of the house. Every LQI
number in `zigbee_mesh_routers_2026-08-27.md` is *distance from this corner*. The mailbox at the
street, the garage sensors and the kitchen leak sensors are all reaching back here. **This is the
missing context for the 2026-09-15 antenna experiment** — the front-of-house sensors improved and
the kitchen/garage/back ones dropped when the whip was tilted, which is exactly what an antenna in
*this* room would do.

**2. 🔴 THE B-HYVE IS AS FAR FROM THE GATEWAY AS THIS HOUSE PHYSICALLY ALLOWS** — and it chose
the gateway anyway, over an RE200 sitting **one brick wall** from it. Measured 2026-09-22 06:16:
**256 ms average, 487 ms peak, 5% loss**, against the RE200 at **1 ms / 0%** in the same minute.
That is not a marginal preference; it is a sticky client holding the worst available link.

⚠️ **Also worth knowing for disaster recovery:** gateway, Beast and Beehive are **in one room on
one circuit**. A single breaker, a single surge, or one spill takes out the internet, the AI host
and the whole home-automation hub together. The UPS work in `project_hcc_ups_power_2026-08-21`
covered the Beast; whether it covers the other two is not recorded.

## 📍 PHYSICAL LAYOUT — WHERE THE RADIOS ACTUALLY ARE (Jeff, 2026-09-22 6:37 AM)

**This was never written down, and without it the B-hyve numbers look like a mystery. With it they
are obvious.** Jeff, verbatim: *"The RE200 is in the office which is closest to the B-hyve which is
on the outside wall of the office going through the brick wall. The main modem is in the master
bedroom, which is the other end of the house."*

| thing | where |
|---|---|
| **BGW320 gateway** (`.254`) | **MASTER BEDROOM — far end of the house** |
| **RE200 wired AP** (`.196`) | **OFFICE** |
| **B-hyve "Water Hog"** (`.187`) | **On the OUTSIDE WALL OF THE OFFICE** — one brick wall from the RE200 |

### 🔑 SO THE TIMER IS A FEW FEET FROM THE RE200 AND IS TALKING TO THE FAR END OF THE HOUSE INSTEAD

That is textbook **sticky-client** behaviour: it associated with the gateway at some point — most
likely while the RE200 was down, being reset, or during the 08-13 extender retirement — and 802.11
gives a client **no obligation to roam** once associated. It will hold a bad link until it drops
completely rather than move to a better AP. **Same SSID and same PSK on both radios means nothing
ever forces the decision.**

**This is what that looks like in numbers** (measured 2026-09-22 06:16, 20 packets, control taken in
the same minute):

| target | avg | peak | loss | path |
|---|---|---|---|---|
| **B-hyve `.187`** | **256 ms** | **487 ms** | **5%** | across the whole house to the master bedroom |
| RE200 `.196` | 1 ms | 6 ms | 0% | wired |
| Gateway `.254` | 0 ms | 1 ms | 0% | wired |

⚠️ **And it got WORSE after Jeff reset it that morning** — 68 ms / 0% loss at 05:11, then 256 ms /
5% loss at 06:16. **A reset does not help a sticky client; it can re-stick to the same wrong AP.**
That is the evidence that settles it: the answer is not another reset, it is removing the choice.

🟢 **One brick wall at a few feet beats a whole house of drywall, joists and appliances.** Dedicating
the RE200 is not a marginal improvement here — the correct AP is practically touching the device.

## 🔴 DECISION 2026-09-22 — THE RE200 IS DEDICATED TO THE B-HYVE

**Jeff, 2026-09-22 6:02 AM: *"We are going to have to dedicate the RE200 to the B-hyve or it will
keep dropping."*** This settles the question he first raised on **2026-09-03** and that was never
answered: *"I don't know what we gotta do to get it to hook into that."*

### Why nothing else works
The RE200 broadcasts **the same SSID and the same PSK as the gateway**. That is a correct roaming
setup, which means **the client chooses for itself** — and the timer keeps choosing the gateway.
**There is no way to pin a client to one AP when both look identical to it.** Not MAC filtering on
the RE200 (the timer would still prefer the gateway), not a reset, not re-pairing.

### Measured 2026-09-22 05:11, and this is what "dropping" looks like before it drops
| target | avg | peak | loss |
|---|---|---|---|
| **B-Hyve timer `.187`** | **68 ms** | **116 ms** | 0% |
| RE200 `.196` | 1 ms | 3 ms | 0% |
| Gateway `.254` | 0 ms | 1 ms | 0% |

**It was associated and answering the whole time.** A ping test that only asks "is it up" would have
called this healthy — it is 68x the latency of everything else on the LAN. Congestion measured
2026-09-03 backs it: gateway ch 1 at **44%** utilisation, RE200 ch 6 at **23%**.

### THE PLAN
1. **Rename the RE200's 2.4 GHz SSID** to something distinct — e.g. `Loewen301-IoT`. Admin at
   `http://192.168.1.196`, password in `HCC_ACCESS.md` §5.
   🔴 **10 login attempts before lockout and 2 are already used.** Get it right first try.
2. **Consider disabling the RE200's 5 GHz** (`Loewen301-5G`). The B-hyve is 2.4-only, so 5 GHz only
   invites other clients onto an AP we are dedicating.
3. **Re-provision the timer** — B-hyve app → **My B-hyve → Devices → Water Hog → Update Wi-Fi
   Settings** → pick the new SSID. 🔴 **NEVER Pairing Mode — Orbit's own words: *"putting the
   device in pairing mode will also Factory Reset the device,"* which wipes all six zone programs and
   the `IRR_FLOW` model built on them.** See `docs/utilities/bhyve_wifi_reconnect.md`.
4. **Re-measure the ping.** If it does not come down near the RE200's 1 ms, the radio is the problem,
   not the AP.

### ⚠️ THE ACCEPTED COST — Jeff should know this going in
The RE200 had **5 clients attached** as of 2026-09-03, **including the office printer at `.208`**.
Renaming its SSID drops every one of them back onto the gateway radio — the congested one. Nothing
breaks permanently (the `Loewen301` SSID still exists on the gateway), but the printer and whatever
else was benefiting from ch 6 lose it. **That is the price of dedicating the AP, and it is the point.**

### ✅ RETRACTED 2026-09-22 — "HA HAS ZERO B-HYVE ENTITIES" WAS WRONG

I reported that at 06:0x and it is **false**. **All six zones exist and report normally:**
`switch.z1_front_right` (station 1) · `switch.z2_front_left` (2) · `switch.z3_back_left` (3) ·
`switch.z4_back_right` (4) · `switch.z5_right_side_drive` (5) · `switch.garden` (6) — all `off`.

🔑 **WHY I GOT IT WRONG, because the mistake is reusable:** I filtered entity ids for
`bhyve|orbit|irrigation|zone_`. **Not one of those strings appears in the names.** The zones are
named after where they water, not after the vendor. That is precisely the trap SESSION_START §0
names: *"searching for the DEAD plan and finding nothing does not mean nothing is documented."*
An empty match on the wrong term became a confident claim that a whole subsystem was missing.

✅ The real list was already written down in `docs/mower/gps_firmware_coworker_findings_2026-08-11.md`
and I only found it because a read gate forced that file open. **These entities also expose a
`station` attribute** (`switch.garden` → `station: 6`) which is authoritative — use it instead of
parsing digits out of the name.

## Still unidentified — do not re-guess these
`.198 CMWC1ZZABR` · `.166 dp-730602E4` · `.183 espressif` (`28:05:A5`, an **RE200 client**) ·
`.82 none-3` · `.161 none-4` · `.182` (RE200 client, `BE-79-DD-6C-A6-5B`, locally-administered
address = a randomised phone/tablet MAC).
