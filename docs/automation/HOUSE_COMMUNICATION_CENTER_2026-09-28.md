# 🕰️ THE GRANDFATHER CLOCK = THE HOUSE COMMUNICATION CENTER — Jeff's goal, 2026-09-28

> **Jeff, 12:23 PM:** *"That clock is going to be the entire house communication center I'm going to
> have everything we have now on it plus I want it to become a alarm and handle all warnings and such.
> Where it is positioned it can be heard all over the house it needs to be set to it loudest and we
> might even need a better speaker in the end but this is my goal and I would like to be able to even
> talk to it if necessary in the future"*

🛑 **GOAL ONLY, 2026-09-28 — Jeff 12:30: "I didn't tell you to build the alarm yet I was just letting you know my goal." No phase starts without his word.** **This is the direction for the clock from now on.** Every new announcement, alarm or warning should
be designed to come out of the clock. Read this before adding any voice/alert feature anywhere.

## What it already does (live 2026-09-28)
Chimes /15 min (quiet 22:01–06:00) · 7 AM anthem + weather + holidays (moved from 6 at Angela's request 09-28) · noon inside/outside temp ·
house status 9 AM / 3 PM / 9 PM ("everything is good" / "N errors") · 10 PM forecast + moon ·
NWS warnings (Tornado + Flash Flood 24/7, others 06–22) · lightning within 10 mi (daytime, 1/h) ·
"Angela will arrive in about 15 minutes". Source of truth: `HCC-Scripts\chime_listener.py`, the
`hcc_chime` / `hcc_speak` / `hcc_status` events, and OPEN_ITEMS #209.

## 🔴 The requirement that changes once it is an ALARM
A chime that misses is an annoyance. **A fire warning that misses is a life-safety failure.** Today the
clock has single points of failure, and each one has ALREADY happened:

| failure | has it happened? | what the house knows today |
|---|---|---|
| The Beast is off / rebooting | 09-26 18:30 → 09-28 09:10, 39 h silent | **nothing — no alert** |
| Bluetooth link breaks up | 09-28 09:45 (dongle behind the PC) | nothing |
| The speaker powers itself off | 09-26 overnight | a log line only |
| Another program takes the speaker | Kodi, 09-26 | fixed at the source (Kodi pinned to TV) |

⛔ **NO CAMERA ALERTS ON THE CLOCK — Jeff 2026-09-28 12:44: *"I don't want camera stuff playing on the clock."*** Verified that day: the only senders of hcc_speak/hcc_chime/hcc_status are the clock automations, lightning, Angela 15-min-out and HCC-WeatherWarning.py.

🌩️ **WEATHER WARNINGS — Jeff 12:43: *"All weather warnings should play through the clock and everywhere else."*** HCC-WeatherWarning.py now acts on EVERY NWS "...Warning" (not just 6 types; watches/advisories still ignored) and announces on every Echo (`notify.alexa_media_everywhere`) alongside the clock, both phones, the Fire TV popup and HA. Hours rule (09-24) unchanged: Tornado + Flash Flood 24/7, others 06-22 on clock/Echos; phones always. Test 12:45: clock spoke, Echo announce accepted by HA.

**Rules for alarm-grade work:**
1. **The clock is never the ONLY channel for a life-safety alarm.** Phone push (time-sensitive) +
   Echo announce stay as backups. Alert fatigue rules still apply (`alert_fatigue_fix_2026-08-14.md`).
2. **HA must know when the clock is down** — a heartbeat, not a hope (Phase 1).
3. **Alarms override quiet hours**, like Tornado / Flash Flood already do.
4. **Measure, don't make Jeff the test** — every playback change is checked with the
   `took X s for Y s of audio` / underflow log before he hears it (the 09-28 double-speed lesson).

## Phases (each needs Jeff's go; build the ALARM as ONE subsystem — his instruction 09-10/09-16)
1. **$0 — make it trustworthy:** clock heartbeat into HA + alert when it goes silent; inventory every
   announcement that goes to Alexa today and mirror the useful ones to the clock.
2. **$0 — alarm voice:** the alarm subsystem (OPEN_ITEMS "THE ONE BIG THING") speaks through the clock:
   leak, door-while-away, panic (#10), severe weather — alarm tone + words, repeat until acknowledged.
3. **Hardware Jeff buys — fire:** smoke via Kidde SM120X on the Firex interconnect (~$12.50–15, verified
   09-19) + a separate CO detector. Then fire/CO speak through the clock.
4. **Voice in ("talk to it"):** needs a microphone + HA Assist (Nabu Casa cloud speech is already paid
   for). The W200 has no mic. **Already owned, $0: a Delam BM-800-class condenser mic** (BEEHIVE_REFERENCE spare-hardware list, set aside for a voice assistant) — check it first. Research + price before naming any part (CLAUDE.md rule 8).
5. **Louder / independent:** a better speaker and/or the clock on its own small computer, so it no
   longer depends on the Beast. Price before recommending. ⛔ **Not a second BT dongle** — Windows
   supports only one Bluetooth radio (Microsoft Bluetooth FAQ).

## Loudness today
PC side is at digital full scale: Windows endpoint 100 %, chimes peak 0.95 with the +9 dB limiter
(`boost_db` in `chime_config.json`). **The rest is the W200's own volume — its + button, Jeff's hands.**

## 🔊 DECISION 2026-09-28 13:15 — the QFX is the house alarm speaker. Do NOT pitch alarm speakers.
> **Jeff:** *"I'm trying to use it instead of having to buy alarm speakers."*

Jeff already owns a **QFX PBX-BF120** (12" battery PA speaker: Bluetooth / **AUX IN** / USB / TF / FM /
mic in, physical VOLUME knob that doubles as power, charges at DC 5 V 1 A, FCC ID OGGQFX-1215, built 19/07).
Plan: it replaces the W200 as the clock/alarm speaker. **Speaker knob at (or just under) max and left there; the
software sets each sound's level** — chimes/voice normal, leak loud, tornado + break-in FULL (Jeff 13:11).
- **Unpublished — MEASURE the real device, never code against a description** (the mower hour-meter lesson):
  watts, clean-max point, idle auto-off, AUX-vs-BT priority.
- **Test session (when Angela is not resting):** stepped tones at knob-max → mark where it distorts = "full";
  30–60 min idle watch for auto-off; dB readings on Jeff's Apple Watch Noise app at the clock, bedroom, far end.
- Loudness levers at $0: alarm tones re-pitched into 2–4 kHz, harder limiting on alarms than chimes, placement.
- Battery: 5 V 1 A charging < full-volume draw — minutes of alarm fine, hours at max drain it even plugged in.
- Honest limits: an alarm is only as reliable as its chain (HA → Beast → link). Best end-state = a small
  board at the clock wired into AUX IN (no Beast, no Bluetooth) — Jeff's call, priced before named.
- Voice tuning (#212) was done on the W200 — retune by ear after the swap.
- ⚠️ Supersedes the 08-27 note "Jeff buys real sirens himself" — using the QFX instead is the plan now.

### Placement + loudness targets (Jeff 13:25)
- QFX **plugged in and charging permanently**, **behind the grandfather clock, out of sight — AIMED AT THE FRONT DOOR and tilted slightly up to bounce off the tray ceiling** (Jeff 13:30). Per the plan that line runs across the living room toward the FOYER, which the master and guest bedroom doors open onto — the sleeping rooms get the direct sound, and a break-in alarm faces the entry.
  Clock = plan #79 — **the CENTER of the house** (Jeff 13:28: "basically in the middle of the house"), at the living room's SE corner where bedrooms, kitchen and office meet; **living room has a 10 ft tray
  ceiling** (not yet on the floor plan). Plan distances: guest bed ~22 ft, kitchen ~23 ft, master bed ~28–29 ft.
- Targets (verified 09-28): **NFPA 72 sleeping areas ≥ 75 dBA at the pillow** (and 15 dB over ambient);
  **UL 217 smoke alarm ≥ 85 dB at 10 ft**. Jeff's alarm shopping: 105–120 dB (those ratings are at the siren).
- Estimate only (no published watts): ~100–110 dB at 1 m at knob max, probably not 120. **Master bedroom with the door
  closed is the one to measure** — Apple Watch Noise app at the pillow; fallback = the master bedroom Echo, $0.

## 🛠️ PLAN 2026-09-28 13:39 — one ESP32 at the clock drives the QFX AND an ear-piercing siren
> **Jeff:** *"Okay so we add a ear pearcing siren to it and make the esp 32 drive both"*

- **Split:** QFX = voice + tones (via AUX IN, wired); piezo siren = raw volume / deterrent (~120 dB class);
  ESP32 at the clock drives both → no Beast, no Bluetooth in the alarm path.
- **Owned (per docs/inventory, 09-28):** spare 16A WiFi mini relay module ($3.39, "spare/project relay");
  ESP32 30-pin screw-terminal board ($2.39); a spare ESP32 was "TO ORDER" 08-11 and is also earmarked for the
  Air Station — **unverified whether it arrived**. Network shows **esp32-21206C (NOT the mower box)** + four
  unidentified ESP devices online (NETWORK_MAP) — identify before buying.
- **To price before naming (CLAUDE.md rule 8):** an I2S DAC/line-out board for the ESP32 (built-in DAC too rough
  for voice) · the piezo siren + its power supply · anything to switch it.
- Status: **PLAN ONLY — nothing bought or built.** Next: Jeff says whether he has a spare ESP32 in hand.

### Parts priced 2026-09-28 13:4x (Amazon, Jeff's Chrome via CDP, read-only) — Jeff has a spare ESP32 ("Yes", 13:41)
ESPHome speaker media player (esphome.io, checked): plain ESP32 OK for announcements/WAV/MP3/FLAC; PSRAM recommended not
required; OPUS not for plain ESP32.
| part | pick | price | rating |
|---|---|---|---|
| I2S DAC w/ AUX out | 2-pack PCM5102A (B0DNW32Y46) | $8.88 | 4.6★ / 28 |
| siren | wired alarm siren horn 15 W, 6–12 V DC (B07P1FNJTG) | $11.99 | 4.2★ / 1K+ |
| siren switch | HiLetgo 5 V 1-ch relay 2-pack (B00LW15A4W) | $7.39 | 4.6★ / 1.1K |
| ESP32 | Jeff's spare | $0 | |
| 12 V ≥1.5 A adapter | check shelf first | $0? | |
≈ $28. dB figures on siren listings are seller claims — unverified. $0 switching alternative: the owned 16A WiFi mini
relay on the adapter's mains side (HA-driven, not ESP32). **NOT ORDERED — Jeff orders.**

### Power from Jeff's shelf (13:48)
- Jeff's spare ESP32 has **USB-C**; his USB-C cable fits ✅.
- Charger shown (GDP06AV-0500500) = **5 V ⎓ 500 mA — too weak** (WiFi bursts can brown-out/reboot the ESP32 mid-alarm).
  Needs a **5 V ≥ 1 A** phone charger. Siren needs a separate **12 V DC (⎓, not AC) ≥ 1.5 A** adapter (15 W siren ≈ 1.25 A).

### 🛒 IN JEFF'S AMAZON CART 2026-09-28 13:55 (added by Claude on Jeff's request — NOT ordered; Jeff checks out)
| asin | item | $ |
|---|---|---|
| B0DQ43LMRH | 5 V 2 A UL-listed USB charger ×2 (ESP32 box) | 7.95 |
| B07K2Z76NB | Xnrtop 12 V 120 dB piezo siren ×2 — 9–12 V, **100–150 mA**, 1 m leads | 9.16 |
| B0DL8YR2V4 | 12 V 1 A adapter, 5.5×2.1 center-positive (fine print: ETL to UL 62368-1) | 8.97 |
| B0CR8TZ41W | California JOS 2M+2F DC screw-terminal barrel connectors | 3.97 |
= $30.05. The piezo (not the 15 W horn) is what Jeff chose ("cheapest siren") → a 12 V ≥0.5 A adapter suffices.
**13:58 Jeff "Yes we need the audio board" → B0DNW32Y46 PCM5102A 2-pack $8.88 ADDED (cart 6→7, read back). Still NOT in the cart: HiLetgo relay (B00LW15A4W, $7.39) — the ESP32 cannot switch the 12 V siren without a relay or MOSFET. Also needed: a 3.5 mm male-male aux cable DAC → QFX AUX IN (check shelf).**
Jeff's cart already held a 10 ft USB 3.0 extension + 10 ft micro-USB cable (untouched).

## 🔁 RE-STUDY 2026-09-28 14:00–14:21 — Jeff: "do you have tunnel vision ... make sure we are not buying a bunch of shit that could be run just as well with something we already have"
He was right. **The HA box (Beehive, Beelink J45) can be the audio source itself** — verified from HA 14:0x: the
Supervisor audio card has an **analog stereo output** profile (HDMI currently active; switchable), and the **VLC
add-on (`core_vlc`) is installed + running** (`media_player.vlc_telnet` idle). **Jeff 14:21: "The j45 had a audio jack."**
- **CHOSEN DIRECTION = A: HA box 3.5 mm out → long aux cable → QFX AUX IN.** Removes the Beast, Bluetooth, the ESP32
  and the DAC from the chain. HA plays chimes/voice/alarms directly.
- Location: HA box = plan #3, master bedroom NE corner (beside the BGW320); clock = house center → ~28 ft straight,
  **~40–50 ft of cable routed** (attic). Risk: hum on a long unbalanced run — fix only if heard (ground-loop isolator).
- **Siren switching at $0:** Jeff's owned spare 16 A WiFi mini relay module (not yet paired) switches the siren's 12 V
  adapter. All 4 HA smart sockets are in use (garage fan, 2 bed lamps, water pump) — checked.
- **Cart consequences (awaiting Jeff's word):** PCM5102A DAC ($8.88) + 5 V charger 2-pack ($7.95) become unnecessary;
  HiLetgo relay never added. Siren + 12 V adapter + JOS connectors still needed. Add: 40–50 ft 3.5 mm M-M aux cable.
- Work to move the clock into HA: chimes + voice + preludes become HA automations playing through VLC (switch the
  Supervisor audio output to analog first; files go in /media). The Beast listener stays as fallback until proven.

### 🛒 CART AFTER THE SWAP — 2026-09-28 14:24 (read back from Amazon; NOT ordered)
Jeff 14:22: the run goes **under the floor in the crawl space** to the clock (~37 ft on the plan + 2 drops ≈ 45 ft → 50 ft cable).
Added **Monoprice 100647 50' 3.5 mm stereo M/M (B0015V5KPI) $4.99** (4.6★/1.8K, sold by Amazon). **Removed** the PCM5102A
DAC and the 5 V charger 2-pack. Clock-box items now: siren 2-pk $9.16 · 12 V 1 A adapter $8.97 · JOS connectors $3.97 ·
50 ft aux $4.99 = **$27.09**. Jeff's own 2 items (10 ft USB 3.0 extension, 10 ft micro-USB) untouched.
Siren switch = **Jeff's EXTRA SMART PLUG** (Jeff 14:28: "I have a extra smart plug") — the siren's 12 V adapter plugs into it; HA switches the plug. **Brand = TUYA (Jeff 14:28) ✅** — joins HA through the existing Tuya integration (the same one Sharky uses; re-authed 08-19). The 16 A WiFi mini module (AliExpress 08-18, $3.39) is only a fallback and was never confirmed received. No ESP32, no relay.

- 14:31 Jeff showed he already owns the female 5.5 mm DC barrel **screw-terminal connectors** → JOS (B0CR8TZ41W) REMOVED
  from the cart (read back: badge 5). Clock-box items now: siren $9.16 + 12 V 1 A adapter $8.97 + 50 ft aux $4.99 = **$23.12**.
  Next $0 check: a 12 V DC ≥0.5 A adapter with a 5.5×2.1 plug from Jeff's shelf would drop the $8.97 too.

- 14:57 **Jeff owns a TDC Power SA1A-120-0420: 12 V ⎓ 0.42 A, center-positive barrel, UL listed** — siren draws 0.10–0.15 A →
  fine (≈3× headroom). Fit-test the plug in the green screw-terminal connector. 12 V adapter (B0DL8YR2V4) REMOVED from the cart
  (read back: badge 4). **Clock-box purchase now = siren 2-pk $9.16 + 50 ft Monoprice aux $4.99 = $14.15.** Everything else owned:
  QFX speaker, HA box audio jack + VLC add-on, Tuya smart plug (siren switch), screw-terminal connectors, 12 V adapter.
  (The old Zmodo power bricks Jeff checked are all 5 V — 1 A x2 micro-USB, 2 A x1 — useful for USB gear, not the siren.)
- 15:03 Jeff: **install BOTH sirens at the clock, pointed in opposite directions** (piezos are directional) — one toward the
  front door/foyer (bedroom doors, same aim as the QFX), one toward the kitchen/back of the house. Wired in PARALLEL on the one
  green screw connector (both red → +, both black → −); 2 × 0.10–0.15 A ≈ 0.3 A < the TDC adapter's 0.42 A; one Tuya plug
  switches both. Plug fit verified by Jeff's photo 14:59.
- 📐 **WIRING DIAGRAM (Jeff 15:06 "draw out the set up with everything labeled")** — artifact
  **https://claude.ai/artifact/SekU1JPieXzxc5r7VicuKK** (source `docs/automation/clock-alarm/clock-alarm-setup.html`;
  republish to THAT url). Chain, floor-plan placement, siren terminal close-up, parts ($14.15 to buy), install order.
  Correction: from the clock, "opposite the front door" points toward the back/east (office side), not the kitchen.
- 15:12 Jeff: "Those sirens have a different end on them" — correct: the Xnrtop listing says **"Adopt 3.5mm plug"** (photos: red/black
  lead ending in a 3.5 mm plug, called a "12V power plug"). I had read only "1 m wire". **Plan: snip the plug off, strip, screw terminal.**
  Also a safety point: a 12 V lead on a 3.5 mm plug next to the QFX's 3.5 mm AUX input could be cross-plugged. Diagram updated.
- 15:24–15:28 Q&A with Jeff. **Bluetooth CAN drive the QFX just as loud** — the cable was for reliability (no Beast, no BT
  link in the alarm chain), not loudness. Option on the table: pair the QFX to the Beast over BT today ($0) for the pillow
  test + as the clock speaker; cable later. **Sirens are HOLD until the pillow test** (Jeff 15:22 "do we need the sirens at
  all") — they still add a 2nd independent path + the ear-piercing deterrent. Siren chain = HA → Tuya plug → 12 V adapter →
  sirens (no BT/Beast/cable). ⚠️ **HA's core Tuya integration is CLOUD** — no internet = HA cannot switch the plug. Before the
  alarm handles break-in/fire: a Zigbee plug (local mesh) or local Tuya control. (The owned Zigbee TS0224 siren is already
  local, but Jeff judged it too weak 08-27.)


---

## 🚨 2026-10-13 3:55 PM — THE TUYA PLUG IS IN HA. IT IS NAMED **House Alarm**.

Jeff 4:00 PM: *"I just added a smart plug that will control the House Alarm I need you to add it
and then we can test it."* 4:03 PM: *"It's name is House Alarm 🚨"*

**This is the exact plug the 09-28 plan called for** ("Siren switch = Jeff's EXTRA SMART PLUG …
Brand = TUYA") — nothing new was bought, and nothing had to be paired by hand.

### What was found, not assumed
- It **self-discovered through the existing Tuya cloud integration** and was already in HA when
  Jeff asked. Device registry `identifiers [['tuya','ebef9dfc20df3a4a16hega']]`, config entry
  `tuya` / `ap-000895.1644…1306` — the same entry that carries the 4 sockets already in service.
- **First state written `2026-10-13T20:55:44Z` = 3:55 PM Central**, five minutes before his message.
- It arrived under its factory name **`C0003_P10_W8_EC02`**, with **4 entities and no power
  metering** — so there is no electrical way to confirm the siren is drawing; the test is acoustic.

### ✅ DONE — renamed, and VERIFIED by re-reading the registry after the write
`config/device_registry/update` → `name_by_user: House Alarm`, then four
`config/entity_registry/update` calls. Read back:

| was | now |
|---|---|
| `switch.c0003_p10_w8_ec02_socket_1` | **`switch.house_alarm`** |
| `switch.c0003_p10_w8_ec02_child_lock` | `switch.house_alarm_child_lock` |
| `select.c0003_p10_w8_ec02_power_on_behavior` | `select.house_alarm_power_on_behavior` |
| `select.c0003_p10_w8_ec02_indicator_light_mode` | `select.house_alarm_indicator_light_mode` |

⚠️ **`switch.house_alarm` is the ONE entity every automation targets.** The other three are
settings on a device we installed — kept deliberately under the entity-hygiene rule's own
carve-out (same reasoning as `switch.sharky_do_not_disturb`), not clutter.

### 🔑 `select.house_alarm_power_on_behavior` reads `power_off` — and that is CORRECT, leave it
This plug switches a **siren**, not a panel. `power_off` means a power blip brings it back
**silent**. `last` would resume screaming after an outage, and `power_on` would sound it on every
restore. **Do not "helpfully" change this to `last`.**

### 🚨 The siren itself — Jeff's photo, 4:01 PM
Round piezo, white housing / orange face, black L-bracket, two-wire pigtail (**red = +**, the
other = **−**). This is the **Xnrtop 12 V 120 dB piezo, B07K2Z76NB**, the 2-pack from the 09-28
cart — so they arrived. The 09-28 build is unchanged and still correct:

```
HA  →  switch.house_alarm (Tuya plug)  →  TDC Power SA1A-120-0420  →  green screw-terminal
         120 V AC                          12 V ⎓ 0.42 A, owned        connector
                                                                            ↓
                                         BOTH sirens in PARALLEL  (red→+, other→−)
                                         2 × 0.10–0.15 A ≈ 0.3 A  <  0.42 A  ✅ ~3× headroom
```
- ✂️ **The leads end in a 3.5 mm plug** ("Adopt 3.5mm plug") — snip it off, strip, into the screw
  terminal. ⚠️ **And that is a real hazard worth repeating: a 12 V lead on a 3.5 mm plug sitting
  next to the QFX's 3.5 mm AUX IN can be cross-plugged.** Cut the plug off, don't just tape it.
- 📍 Placement (Jeff 09-28 15:03): **both at the clock, aimed in opposite directions** — one at the
  front door / foyer (the bedroom doors open onto it), one toward the back/east office side.
- 📐 Wiring diagram already exists: **https://claude.ai/artifact/SekU1JPieXzxc5r7VicuKK**
  (source `docs/automation/clock-alarm/clock-alarm-setup.html`) — **republish to THAT url.**

### 🔴 THE WEAK LINK, UNCHANGED FROM 09-28 AND NOW LIVE
**HA's core Tuya integration is CLOUD.** No internet ⇒ HA cannot switch this plug ⇒ **no siren.**
That is acceptable for a deterrent and a leak/weather alarm; it is **not** acceptable as the only
path for break-in or fire. The fix is local control, and it is not a purchase:
- the `tuya_local` / LocalTuya route using the Tuya credentials HA already holds, **or**
- move the siren onto a Zigbee plug (local mesh, no cloud) — the Zigbee plug 4-pack is already the
  standing lighting-plan item.
**Priced before named, per rule 8. Nothing ordered.**

### ⏭ NEXT, IN ORDER
1. **TEST — needs Jeff's go.** 2-second pulse of `switch.house_alarm`, then off. 🔴 **Not fired
   blind: 120 dB next to his head is a hearing injury.** Sirens mounted and away from his ears first.
2. Then the automations ("set it up for all the things that it will work with").

### ✅ 2026-10-13 4:17 PM — FIRED AND HEARD. THE SIREN CHAIN IS PROVEN END TO END.
> **Jeff 4:17 PM:** *"Works perfectly"* · **4:18 PM:** *"It's loud !!"*

**That retires the 09-28 open question** (Jeff 15:22: *"do we need the sirens at all"*) — yes, and
they deliver the deterrent the TS0224 never could.

| measurement | value |
|---|---|
| `switch.house_alarm` ON confirmed | **1.7–2.1 s** after the service call |
| OFF confirmed | **1.6–1.7 s** |
| `assumed_state` on the entity | **absent** — HA reports real device state, not an optimistic echo |
| power metering | **none** — the only instrument is Jeff's ears |

⚠️ **The first pulse at 4:11 PM did NOT sound** — the chain was not finished at the siren end.
Jeff completed it and it fired on the 4:17 PM pulse. **Nothing in HA was changed between the two**;
the plug behaved identically both times, which is why "is the plug lying?" had to be settled first
(it wasn't — no `assumed_state`, and a 2 s round trip is a real device report).

### 🔑 THE PLUG'S PHYSICAL BUTTON WORKS, AND HA STAYS IN SYNC — read off the logbook
Four state changes 21:14:24–21:16:26 UTC carry **`context_user_id: None` and no service call** =
Jeff's hand on the plug. HA tracked every one. Two consequences that pull opposite ways:
- ✅ **It is the fastest kill switch in the house** — faster than the app, Alexa or HA.
- 🔴 **An intruder can silence the alarm by walking up and pressing it.** That is what
  `switch.house_alarm_child_lock` would stop. **Left OFF deliberately** — the fast kill is worth more
  today than the hardening. Revisit once the sirens are mounted at the clock and out of easy reach.

### 🔴🔴 THE ONE DESIGN RULE EVERY SIREN AUTOMATION MUST OBEY
**This plug has NO built-in duration.** The TS0224 has a 60-second minimum and stops itself; a dumb
plug **runs until something turns it off.** So:
1. **Every automation that turns it on MUST have a guaranteed off**, and the off must not sit behind
   anything that can throw. The leak alert was silently dead in *both* channels until 08-26 because
   a failing `notify` aborts every action after it — same trap, worse consequence here.
2. **A WATCHDOG IS REQUIRED, NOT OPTIONAL:** if `switch.house_alarm` is `on` longer than its longest
   legitimate run and no alarm is active, **force it off.** Without it, one failed automation leaves
   a 120 dB siren screaming until somebody unplugs it.

## 🛠️ 2026-10-13 4:29–4:36 PM — BUILT: WHAT THE BIG SIREN FIRES ON
> **Jeff 4:29 PM:** *"It should go off for 2 min for a tornado 🌪️ warning or other emergency warning
> and if the panic button is pushed — all the leak sensors should be going through the other siren
> the small one."* · **4:33 PM:** *"It needs to work on our watches too"*

### ✅ THE LEAK HALF WAS ALREADY DONE — nothing built, nothing changed
`automation.hcc_water_leak_alarm_all_zigbee_leak_sensors` has driven **only the 301 Alarm** since
2026-08-27, via `mqtt.publish` → `zigbee2mqtt/301 Alarm/set`, tone `emergency`, `very_high`, strobe,
60 s. **The big siren was never wired to it and still isn't.** Exactly what Jeff asked for.

### 🏗️ ONE OWNER FOR THE BIG SIREN — `automation.hcc_house_alarm_siren_2_min`
**Nothing calls `switch.house_alarm` directly. Everything fires the HA event `hcc_siren`.**
One owner ⇒ one 2-minute rule, one guaranteed off, one thing for the watchdog to police.

| | |
|---|---|
| entity | `automation.hcc_house_alarm_siren_2_min` (id `hcc_house_alarm_siren`) |
| trigger | event `hcc_siren` (optional `reason` is shown in the notification) |
| mode | `restart` — a second warning restarts the 2 min instead of queueing |
| actions | `persistent_notification` **first** → `switch.house_alarm` ON → 301 Alarm via `mqtt.publish` → **delay 2:00** → `switch.house_alarm` OFF |

🔑 **IT FIRES BOTH SIRENS, ON PURPOSE.** `switch.house_alarm` is **Tuya CLOUD** — internet down, it is
silent. The 301 Alarm is **Zigbee LOCAL** — weak, but always reachable. Two independent paths, $0,
covering this plug's one real failure mode. The 301 runs **60 s not 120**: that is its documented
known-good duration and `number.301_alarm_max_duration` reads 60. The big siren carries the full two
minutes.

### 🛡️ `automation.hcc_house_alarm_runaway_watchdog_force_off` — REQUIRED, NOT OPTIONAL
Trigger: `switch.house_alarm` **on for 3 minutes** (the 2-minute legit run + a minute of margin for
the ~2 s cloud round trip). Action: **`switch.turn_off` FIRST**, then notify — deliberately inverting
the usual record-first order, because here *the action is the safety* and a failing notify must never
be what stops the siren from stopping. Catches the one case the guaranteed off cannot: **an HA restart
during the 2-minute delay leaves a 120 dB siren running until somebody unplugs it.**
⚠️ Accepted side effect: a deliberate manual run over 3 minutes also gets killed, with a push saying why.

### 🚨 PANIC BUTTON — v2 ARMED, v1 DISABLED
- `automation.hcc_panic_button_v2_actually_reaches_people` → **ON**. Now fires `hcc_siren` **early**,
  right after the `persistent_notification`, so 120 dB does not wait behind four notify calls.
- Its old `siren.turn_on` on `siren.301_alarm` was **removed** — the new owner drives that same device
  at **`very_high`**, which `siren.turn_on` cannot reach (it tops out at `high`).
- `automation.hcc_panic_button` (v1) → **OFF**. It reached nobody, and two armed panic automations is
  its own bug.
- 🔴 **STILL JEFF'S CALL, UNCHANGED:** the webhook is `local_only: false` — internet-reachable — and
  critical alerts bypass Do Not Disturb. Anyone who learns the webhook id could ring both phones at 3 AM.

### 🌪️ WEATHER — only the SIX immediate life threats get the siren
`HCC-WeatherWarning.py` patched (backup `HCC-WeatherWarning.py.bak-20261013-siren`; `py_compile`
clean; `--status` ran live and reached NWS). New `siren(event)` fires the `hcc_siren` event **only for
`ACT_ON`**: Tornado · Severe Thunderstorm · Flash Flood · Extreme Wind · Dust Storm · Snow Squall.
- **`is_warning()` is unchanged** — every NWS "… Warning" still reaches the phones and the clock.
  **But a 120 dB siren for a Heat Warning is alert fatigue with a hearing hazard attached.**
- **NO NIGHT RULE on the siren, on purpose** — a tornado at 3 AM is when it matters most.
- Placed **after `push()`** so a siren failure can never cost the phone alert.

### ⌚ "IT NEEDS TO WORK ON OUR WATCHES TOO" — this exposed a REAL defect
**There is no watch notify target in HA** — only `notify.mobile_app_jeffs_iphone` and
`notify.mobile_app_angelas_iphone`. An Apple Watch **mirrors the iPhone**, so the thing that decides
whether it makes a noise is the **interruption level**, not the target.
🔴 **Weather warnings were pushing at `interruption-level: time-sensitive`.** That breaks through a
**Focus** but **NOT** through Do Not Disturb or a silenced watch — **so a Tornado Warning at 3 AM
could have arrived silently.** The panic button was already correct at `critical: 1`.
✅ **Fixed:** the `ACT_ON` six now push `critical: 1, volume 1.0`, which bypasses DND, Focus and the
ringer switch on **both** phone and watch. Everything else stays `time-sensitive` **deliberately** —
a critical alert for a Freeze Warning is how people end up switching critical alerts off entirely.
⚠️ **One thing software cannot set: iOS asks once per app to "Allow Critical Alerts."** If that was
ever denied for Home Assistant on either phone, `critical:1` silently degrades to an ordinary
notification. **Test, do not assume** — a critical test push was sent to Jeff's phone 4:35 PM.
