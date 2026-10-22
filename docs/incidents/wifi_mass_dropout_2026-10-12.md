# 📡 2026-10-12 15:21 — TEN Wi-Fi DEVICES DIED IN A FIVE-SECOND WINDOW

**Jeff asked at 4:52 PM: "why the AC relay [is] off line."** It is not a relay fault. The relay is
one of ten 2.4 GHz devices that all stopped talking to the gateway inside **five seconds**.

## The measurement

Read live from the gateway's own device list, `http://192.168.1.254/cgi-bin/devices.ha`
(the same instrument that cracked the 10-10 outage in OPEN_ITEMS #225):

| Device | IP / gateway name | Last Activity |
|---|---|---|
| NETGEAR NTV300 | `.222` | Mon Oct 12 **14:50:30** (Ethernet LAN-1 — probably unrelated) |
| **`dlinkap`** | — (mac `1e:5f:2b:b8:08:62`) | Mon Oct 12 **15:07:55** ← **13 min before the rest** |
| ESP_DFC785 | `.170` | Mon Oct 12 **15:20:53** |
| HS220 (Kasa dimmer) | `.178` | Mon Oct 12 **15:21:22** |
| HS220 (Kasa dimmer) | `.179` | Mon Oct 12 **15:21:23** |
| ESP_DFE142 | `.224` | Mon Oct 12 **15:21:23** |
| ESP_0BDE3B (weather station) | `.195` | Mon Oct 12 **15:21:23** |
| espressif | `.187` | Mon Oct 12 **15:21:23** |
| **espressif (garage door relay)** | `.183` | Mon Oct 12 **15:21:26** |
| HP OfficeJet | `.208` | Mon Oct 12 **15:21:26** |
| espressif | `.189` | Mon Oct 12 **15:21:27** |

**Every one of them: `Wi-Fi · 2.4 GHz · Type: Home · Name: Loewen301 · Mesh Client: No`.**

HA agrees to the minute — `/api/states` at 16:52 shows **~40 entities** unavailable in one cluster:
22 at 94 min (the Kasa lights `livingroom_cans`, `kitchen_dining_room`), the HP OfficeJet and
`bed_lamp_socket_1` / `mini_smart_socket11_2` at 93, **`switch.garage_garage_door_opener` at 90.1**,
**`switch.ac_relay` at 89.9**, the Sharky buttons at 88, Blink garage/doorbell at 55.5, and
`sensor.backyard_*` at 31.

Reachability, by `Test-Connection -Quiet` (**never ping's summary line** — it counts
"Destination host unreachable" from our own address as a reply, `ACCESS_MAP.md` §4):

```
192.168.1.254  UP      gateway
192.168.1.66   UP      Beehive / HA
192.168.1.181  UP      Kasa masterbath_cans  <-- 2.4 GHz and ALIVE
192.168.1.196  DOWN    RE200 extender
192.168.1.183  DOWN    SONOFF garage relay
192.168.1.208  DOWN    HP OfficeJet
192.168.1.195  DOWN    weather station
192.168.1.164  DOWN    WS-SD00PJBA
```

## Conclusion

**Ten devices spanning four unrelated vendors — Kasa, SONOFF/ESP, HP, Ambient — do not fail
within five seconds of each other. A shared radio path died.** `.181` is on the same band and the
same SSID and is still up, so the gateway's own 2.4 GHz radio is fine; what died served a subset.

**Two access points are dark, and both are candidates:**
- **`RE200`** (`b0:be:76:d5:ea:88`) — off since **Sat Oct 10 14:20:04**, i.e. still dark from the
  #225 outage, never looked at.
- **`dlinkap`** (`1e:5f:2b:b8:08:62`) — off since **Mon Oct 12 15:07:55**, thirteen minutes before
  the clients gave up. That ordering is exactly what an AP dying looks like: the AP stops, the
  clients hang on, then their leases/keepalives expire.
  ⚠️ **Not proven to be a real D-Link AP** — that MAC has the locally-administered bit set
  (`1e:` = randomized), which a true infrastructure AP would not normally use. The gateway offers
  no other identification. Treat it as "a device calling itself dlinkap", not a confirmed AP.

🔴 **The same cast of devices died in #225 on 10-10** (weather station, HP OfficeJet, SONOFF garage
relay, a Kasa dimmer). Since the RE200 has been dead since Saturday, those devices must have
re-associated with something else afterwards — and that something else is what died today.

## 🔴 THE CONSEQUENCE THAT MATTERS — THE A/C IS STUCK OFF

`switch.ac_relay` history today (9 h window, explicit `end_time=`, because
`/api/history/period` silently clamps to start+1 day):

```
12:58:01  on
13:12:43  off
14:32:43  on
14:55:43  off          <-- last real state
15:25:48  unavailable
```

**It was OFF when it went unreachable, so the dry contact is OPEN and the A/C cannot run.**
And it is supposed to be running: `input_boolean.air_conditioner` = **on**,
`automation.hcc_ac_relay_thermostat` = **on** (both since ~12:48 PM), thermostat band 69 off /
71 on, and `sensor.my_weather_station_inside_temperature` read **70.3 °F** — but that sensor is
the station that also died, so the indoor reading is **frozen at 15:21 and is not live either.**
The house has had no cooling and no indoor thermometer since 3:21 PM.

⚠️ HA cannot fix this by itself — it cannot command a relay it cannot reach. Restoring the radio
path is the whole fix; the thermostat automation will then close the contact on its own.

## What to do

1. **Power-cycle the access point / extender these devices hang off** — unplug 10 s, plug back in.
   That is the root fix and should bring back all ten, including the A/C relay and the garage door.
2. **While in the office: the RE200 has been dead since Saturday 14:20** and is still on #225's
   list as "needs one look." Same trip.
3. After it is back, confirm — do not assume: `switch.ac_relay` out of `unavailable`,
   `switch.garage_garage_door_opener` back, and `sensor.my_weather_station_inside_temperature`
   moving again.

## 🔴 The monitoring gap this exposes — AGAIN, and it is the #225 class

**Nothing told Jeff.** Ten devices vanished at 3:21 PM, the A/C stopped being controllable, and the
first anyone knew was Jeff asking a question 91 minutes later. `check_feeds()` was added in #225 for
exactly this shape and it watches the **weather-station family only**. It would have caught the
station — but not a mass dropout, and not the A/C relay going unreachable while the master switch
says the A/C should be running.

➡️ **OWED:** a check that fires when **N or more devices go unavailable inside one short window**
(the simultaneity is the signal, not any single device), plus a specific one for
`input_boolean.air_conditioner` = on while `switch.ac_relay` is unavailable. 🔴 **VERIFIED, NOT ASSUMED: that watchdog WAS NEVER BUILT.** The 09-15 design
specified *"`switch.ac_relay` unavailable 15 min → A/C OFF + push"*
(`FINDINGS_AND_STOPS.md` ~line 785). Listing every automation whose friendly name matches
`A/C|AC |relay|unavail|watchdog|offline|dead` returns 14 automations and **not one of them watches
`switch.ac_relay` for unavailability** — there are watchdogs for integrations, the recorder, the
clip pipeline, Z2M sensors, the garage relay (auto-release + stuck), phones, presence and the
clock, but nothing for this. The design note was never implemented and nobody noticed for 27 days.

## 🔑 AND THE THERMOSTAT IS ACTIVELY FAILING, SILENTLY

`automation.hcc_ac_relay_thermostat` has **`last_triggered` = 2026-10-12T21:55:00Z = 4:55 PM
Central — three minutes before this was written.** It is `on`, it is firing on schedule, and every
firing is calling a switch that has been unreachable for 90 minutes. **HA logs no failure that
anyone sees, the automation reports success, and the house does not get cooled.** That is the same
component-vs-feature trap as the 08-21 camera check: the automation ran, so every instrument says
green, while the actual feature has been dead since 3:21 PM.

⚠️ Also note `sensor.my_weather_station_inside_temperature` is **frozen at 70.3 °F** from 15:21, so
the thermostat is deciding against a stale number as well as commanding a dead relay. Two of the
three parts of that control loop are down.

---

## 2026-10-12 6:46 PM — RECOVERED, A/C RUNNING, BOTH WATCHDOGS BUILT

### Recovery
Devices came back between **6:34 PM** (ping: all eight DOWN) and **6:37:52 PM** (gateway
`devices.ha`: all `on`). Jeff: *"The re 200 is offline and it's broken so it all needs to go
through the router itself."* Verified at 6:38 PM — all ten ping UP including `.224`, HA
unavailable count **81 -> 51** (51 is the normal baseline; permanently-unavailable camera
entities make an absolute count useless as a signal).

### The A/C came back OFF and could not start itself
```
switch.ac_relay                               unavailable -> off   23:37:20Z (6:37 PM)
sensor.my_weather_station_inside_temperature  70.3 -> 73.8 F
```
Two reasons it stayed off, both real:
1. `select.wifi_smart_switch_power_on_behavior` = **off** by design (FINDINGS_AND_STOPS:768) —
   after a power cut the A/C stays off until HA turns it on.
2. The thermostat's ON branch is **`ON >= 72.5 F if off >= 5 min`** (FINDINGS_AND_STOPS:810-812).
   The relay's `off` timestamp was 6:37:20, so the 5-minute anti-short-cycle guard was blocking
   it — **and the guard was being fooled.** The compressor had actually been off since
   **2:55 PM, 3 h 45 m.** The guard was measuring how long the *entity* had existed, not how long
   the *compressor* had rested.

🔑 **An anti-short-cycle guard keyed to entity state is wrong after an outage** — the entity is
newborn, the hardware is not. Closed the contact manually at **6:40:11 PM**.

**Cooling PROVEN, not assumed:** inside **73.8 -> 73.6 F** by 6:42:44 with the relay `on`.

### Both owed watchdogs are BUILT (OPEN_ITEMS #227 closed)
| Entity | Logic |
|---|---|
| `automation.hcc_a_c_relay_offline_watchdog_ha_cannot_control_the_a_c` | `switch.ac_relay` -> `unavailable` **for 15 min** AND `input_boolean.air_conditioner` on -> time-sensitive push + persistent notification. The push approved **2026-09-15** (FINDINGS_AND_STOPS:785) and never built until today. |
| `automation.hcc_mass_dropout_watchdog_3_wi_fi_iot_devices_unavailable_at_once_a_radio_path_died` | **3 of 7** in a deliberately mixed-vendor basket (Matter relay, SONOFF, 3 Kasa, Ambient) `unavailable` **for 5 min** -> push naming the dead devices. The **simultaneity** is the signal. Mixed vendors on purpose so one vendor cloud outage cannot trip it. |

**VERIFIED, not trusted from the API's `ok`:** both entities read back from `/api/states` and both
are `on`. Trigger template dry-run **both ways** against live state: threshold 3 -> `COUNT=0
FIRES=False` (all 7 healthy, no false alarm); and seeded with three genuinely-unavailable
entities -> `COUNT=3 FIRES=True` with the message rendering the device names correctly.

⚠️ **`POST /api/config/automation/config/<id>` returned HTTP 400 twice via
`Invoke-RestMethod`** and `{"result":"ok"}` immediately via `HttpWebRequest` with explicit
`[Text.Encoding]::UTF8.GetBytes()`. The schema was never the problem — **`Invoke-RestMethod`
mangles a UTF-8 JSON body containing `\uXXXX` escapes.** Post HA config as raw UTF-8 bytes.
HA is **2026.10.0**.

### Still open
- **RE200 at `192.168.1.196` is dead hardware** (Jeff's call, 10-12) — ping DOWN, HTTP timeout,
  no ARP. Gateway last saw its wired MAC `b0:be:76:d5:ea:88` **Sat Oct 10 14:20:04**. Everything
  now rides the gateway radio on **ch 1**. Office coverage is unreplaced. OPEN_ITEMS #225.
- `1e:5f:2b:b8:08:62` ("dlinkap", off **15:07:55**, 13 min before the clients quit) is a
  **locally-administered/randomized MAC** — still NOT proven to be a real AP.
- No smart outlet feeds either AP, so **neither can be power-cycled remotely.** Enumerated all 39
  `switch.*`/`light.*` entities to confirm.
