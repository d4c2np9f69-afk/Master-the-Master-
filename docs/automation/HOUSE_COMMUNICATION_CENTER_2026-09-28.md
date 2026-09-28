# 🕰️ THE GRANDFATHER CLOCK = THE HOUSE COMMUNICATION CENTER — Jeff's goal, 2026-09-28

> **Jeff, 12:23 PM:** *"That clock is going to be the entire house communication center I'm going to
> have everything we have now on it plus I want it to become a alarm and handle all warnings and such.
> Where it is positioned it can be heard all over the house it needs to be set to it loudest and we
> might even need a better speaker in the end but this is my goal and I would like to be able to even
> talk to it if necessary in the future"*

**This is the direction for the clock from now on.** Every new announcement, alarm or warning should
be designed to come out of the clock. Read this before adding any voice/alert feature anywhere.

## What it already does (live 2026-09-28)
Chimes /15 min (quiet 22:01–06:00) · 6 AM anthem + weather + holidays · noon inside/outside temp ·
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
   for). The W200 has no mic. Research + price before naming any part (CLAUDE.md rule 8).
5. **Louder / independent:** a better speaker and/or the clock on its own small computer, so it no
   longer depends on the Beast. Price before recommending. ⛔ **Not a second BT dongle** — Windows
   supports only one Bluetooth radio (Microsoft Bluetooth FAQ).

## Loudness today
PC side is at digital full scale: Windows endpoint 100 %, chimes peak 0.95 with the +9 dB limiter
(`boost_db` in `chime_config.json`). **The rest is the W200's own volume — its + button, Jeff's hands.**
