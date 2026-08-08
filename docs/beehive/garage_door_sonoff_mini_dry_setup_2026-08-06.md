# Garage Door — SONOFF MINI DRY Setup Plan (2026-08-06)

Part arrived: **SONOFF MINI DRY** (Matter, dry-contact relay, box says "MINI Dry" — same part as the "MINI-D" researched earlier). This is the final hardware call from 08-05 — confirmed correct, not a repeat of the earlier ratgdo/SONOFF-Basic/SONOFF-SV guessing mistakes.

Terminals on the device (from the box/unit itself):
- **NO / COM / NC** — the dry-contact relay output. This is what wires to the garage opener.
- **N / L** — mains AC power input (100-240V).
- **S1 / S2** — optional external switch input (not needed for this setup).
- **DC+ / DC-** — low-voltage DC power input (12-48V), alternative to N/L.

Everything below is sourced from SONOFF's own docs/help center and independent reviews (CNX Software, SmartHomeScene) — see Sources at the bottom, not guessed.

---

## Step 1 (Jeff/coworker, on-site): Decide how to power the module

The device needs **either** AC (100-240V via N/L) **or** DC (12-48V via DC+/DC-) — not both, and this can't be decided remotely. Check what's actually available at the opener:

- **Easiest if available:** the opener motor head is itself mains-powered (plugs into a ceiling outlet) — if there's a spare hot/neutral in that junction box, or the outlet has a free slot, power the Sonoff via **N/L** off the same circuit. No voltage guessing needed.
- **Alternative:** if the opener has a labeled low-voltage accessory terminal (common on some openers for sensors/accessories), **measure it with a multimeter first** — only use it if it reads DC and falls in the 12-48V range. Don't assume; some openers' low-voltage terminals are AC, not DC, and using AC on the DC+/DC- input would be wrong.

This is a physical/on-site call — not something I can determine from here.

## Step 2 (Jeff/coworker): Wire the relay output in parallel with the existing wall button

CLAUDE.md already has this confirmed from 08-05: Jeff bridged the two wall-button wires directly at the opener's terminals and the door moved — that's the standard compatibility test for a dry-contact relay, and it passed, confirming this device is the right fit (not a Security+2.0 encoded opener, which would NOT respond to a raw short).

- Wire the Sonoff's **NO** and **COM** terminals to those same two wires, **in parallel with the existing wall button** (don't cut the button out of the circuit — both the physical button and the Sonoff should be able to trigger the door independently). This is the standard installation pattern for this class of device.
- **Don't use S1/S2** — that's for wiring an *external* switch as a secondary trigger input to the Sonoff itself, which isn't needed here since the wall button is already wired directly to the opener's own terminals in parallel.
- Power off before wiring, verify dead, standard safety practice.

## Step 3 (Jeff/coworker): Pair to eWeLink app first — this step is mandatory, not optional

**Important finding from research:** the "Inching" (momentary pulse) setting can only be configured through the **eWeLink app** — Home Assistant's Matter integration does not expose this setting at all. So the order matters:

1. Power on the device. It enters pairing mode automatically (LED flashes two short + one long, repeating).
2. Install the **eWeLink** app (phone), create/sign in to an account, add the device by scanning its QR code (on the box or device).
3. Once added, go to the device's **Settings → Inching Setting**. Turn it **on**, and set a short duration (~0.5-1 second is typical for a momentary door-trigger pulse — matches how the physical wall button behaves).
4. This setting is stored **on the device itself** — it's a hardware/firmware behavior, not something that has to be re-sent every time. Once set, "turning on" the relay from anywhere (eWeLink, HA, Matter) will pulse briefly and auto-off, exactly like pressing the wall button.

## Step 4 (Jeff/coworker): Commission into Home Assistant via Matter

Beehive already runs HA OS, which supports Matter natively — no ESPHome flash, no extra hardware.

1. In HA: **Settings → Devices & Services → Add Integration → Matter** (if not already set up).
2. In the eWeLink app, share/export the device to Matter (eWeLink has a "Matter" export option per-device — generates a Matter pairing code/QR), **or** use the Matter QR code printed on the device/box directly.
3. Commission it into HA's Matter integration using that code.

**What to expect in HA:** based on independent testing, this shows up as a **plain on/off `switch.*` entity** in HA — not a `cover` entity like ratgdo would have given. That's expected and fine; it doesn't need to be a cover to work.

## Step 5 (me, cloud session): Wire it into the HCC app once you have the entity ID

The app's existing `loadGarage()`/`garageToggle()` code was written expecting a `cover.*garage*` entity (that assumption came from the ratgdo research, before this simpler dry-contact approach won out). Rather than have you build HA-side YAML template-cover complexity to fake a `cover` entity out of a plain switch, **I'll adjust the app itself** to recognize a plain garage switch entity and show a simple "OPEN/CLOSE" trigger button — no open/closed *state* display, since there's no position sensor yet (reed switches are still a future optional add-on, not needed for this). Just tell me the real entity ID once it's paired (e.g. `switch.something`) and I'll wire it in and test it with mocked data before you see it live.

## Testing checklist (Jeff/coworker, once wired + paired)

- [ ] Physical wall button still opens/closes the door normally (confirms the parallel wiring didn't break the existing circuit)
- [ ] Toggling the switch in the eWeLink app triggers the door
- [ ] Toggling the switch in HA (Developer Tools → States, or the entity's more-info dialog) triggers the door
- [ ] Confirm the pulse is a clean momentary trigger, not a held-on relay (if it stays on/doesn't self-reset, the Inching Setting from Step 3 wasn't saved correctly — go back and re-check it in eWeLink)

---

## Sources

- [How to Add a Garage Door Opener to Home Assistant Using a Dry Contact Relay — SONOFF](https://sonoff.tech/en-us/blogs/news/how-to-add-a-garage-door-opener-to-home-assistant-using-a-dry-contact-relay)
- [How to automate a garage door — SONOFF Help Center](https://help.sonoff.tech/docs/How-to-automate-a-garage-door)
- [How to Automate Your Garage Door with MINI-D — SONOFF](https://sonoff.tech/en-us/blogs/news/how-to-automate-your-garage-door-with-mini-d-a-smarter-safer-solution)
- [SONOFF MINI-D Review — CNX Software](https://www.cnx-software.com/2025/01/15/sonoff-mini-d-review-matter-enabled-dry-contact-wifi-switch-ewelink-home-assistant-apple-home/)
- [Sonoff Matter Dry-Contact Switch MINI-D Review — SmartHomeScene](https://smarthomescene.com/reviews/sonoff-matter-dry-contact-switch-mini-d-review/)
- [Sonoff MINI-D inching mode — Home Assistant Community](https://community.home-assistant.io/t/sonoff-mini-d-inching-mode/903505)
- [SONOFF MINI-D — Help Center (terminals/wiring)](https://help.sonoff.tech/docs/mini-d)
