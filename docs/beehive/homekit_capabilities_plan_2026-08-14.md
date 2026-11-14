# HomeKit — what it adds, and how to use it WITHOUT repeating the Alexa mess

Researched 2026-08-14, after proving Apple TV camera popups work.

## The governing lesson (learned the hard way, on Alexa, today)
Jeff's Alexa is a mess because Home Assistant was allowed to expose **67 entities**, including
**nine Supervisor add-ons** (Z-Wave JS, Studio Code Server...) that became voice-controllable
hazards, plus duplicates of every Tuya socket. **Do not let HomeKit become the same.**

**Rule: expose to HomeKit ONLY things a human would say out loud or tap on a watch.**
Never add-ons, never diagnostic sensors, never anything already well served in HA.

## Division of labour that actually fits this house
- **Home Assistant = the brain.** AI object detection, cooldowns, presence logic, annotated
  images, cross-vendor glue (Blink + Tuya + B-Hyve + Mercedes + utilities).
- **HomeKit = the Apple-side face.** TV popups, Siri, Apple Watch, CarPlay, lock screen.
HomeKit is not a competitor here; it is a display and voice layer over HA's thinking.

## Genuinely worth having (ranked for THIS house)

### 1. CarPlay garage door — the standout
CarPlay shows a **garage door button on the dashboard automatically as you approach home**,
driven by iPhone GPS. Given the SONOFF MINI-D garage project, this is the single most useful
HomeKit feature available to Jeff. Expose the garage cover to HomeKit once it is built.

### 2. Apple Watch control
Both Jeff and Angela have Apple Watches on the network. Lights, garage, irrigation from the
wrist with no phone. Nothing to build — it comes free with whatever is exposed.

### 3. Siri as a second voice path
Worth knowing: Alexa **reserves** phrases like "fast forward", which is why the commercial-skip
script needed the awkward "turn on FF the Commercials" workaround (documented 08-03). Siri has
different reserved words, so some commands Alexa refuses may work naturally through HomeKit.

### 4. Local execution via the Apple TV hub
The Apple TV runs HomeKit automations locally. Faster and survives an internet outage. Good
place for simple, must-not-fail rules.

### 5. Presence
Apple's iPhone presence is generally more reliable than what has been fought with before
(Angela's tracker going stale, 08-01). Useful as a cross-check for HA's own presence.

## Do NOT bother with
- **HomeKit Secure Video** — needs iCloud+ AND cameras that actually stream. Blink does neither.
- **Duplicating HA's phone notifications.** Now that both can notify, pick one:
  **keep HA's** (AI-filtered, cooled down, annotated image) and let HomeKit do the TV popup only.
  Otherwise the Alexa double-alert problem returns in a new outfit.
- **Video clips in HomeKit** — researched, rejected: HA's ffmpeg camera on local MP4 is
  documented as hanging/freezing. Jeff is happy with stills anyway.

## Expose list — when each becomes real
| Thing | When | Why HomeKit |
|---|---|---|
| Cameras (5 + garage) | DONE 08-14 | Apple TV popups |
| Garage door | when SONOFF MINI-D is wired | **CarPlay proximity button**, Siri, Watch |
| Kasa lights | after living-room install | Siri, Watch, "turn off all lights" |
| Irrigation zones | anytime | Siri from the yard, no phone digging |
| Zigbee plugs | when dongle lands | Siri/Watch |
| **Add-ons, diagnostics, meters** | **NEVER** | the Alexa hazard |
