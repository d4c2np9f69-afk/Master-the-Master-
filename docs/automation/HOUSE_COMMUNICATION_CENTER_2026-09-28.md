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
