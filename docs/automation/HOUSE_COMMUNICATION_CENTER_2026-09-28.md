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
