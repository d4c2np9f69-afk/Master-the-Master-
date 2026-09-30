# Garage Door — SONOFF MINI DRY Setup Plan (2026-08-06)

Part arrived: **SONOFF MINI DRY** (Matter, dry-contact relay, box says "MINI Dry" — same part as the "MINI-D" researched earlier). This is the final hardware call from 08-05 — confirmed correct, not a repeat of the earlier ratgdo/SONOFF-Basic/SONOFF-SV guessing mistakes.

Terminals on the device (from the box/unit itself):
- **NO / COM / NC** — the dry-contact relay output. This is what wires to the garage opener.
- **N / L** — mains AC power input (100-240V).
- **S1 / S2** — optional external switch input (not needed for this setup).
- **DC+ / DC-** — low-voltage DC power input (12-48V), alternative to N/L.

Everything below is sourced from SONOFF's own docs/help center and independent reviews (CNX Software, SmartHomeScene) — see Sources at the bottom, not guessed.

---

## Install location: the opener, not the wall switch (resolved 08-06)

Jeff has outlet access at both the wall-switch location and the opener itself, and asked which is the right install point. **Recommendation: the opener.**

- The low-voltage "wall console" terminals live at the opener's control board — installing there is the direct, short wire run. Installing at the wall switch would mean extending that run unnecessarily.
- The wall-switch box is likely sized for just a momentary pushbutton — the Sonoff module may not physically fit in there alongside existing wiring (same box-depth concern already flagged for the Kasa lighting switches). Worth a quick look before ruling it out, but the opener location avoids the question entirely.
- 🔴 **CORRECTED 2026-08-24 BY JEFF — the original line here read "Outlet availability is equal at both spots, so it isn't the deciding factor here." THAT IS WRONG AND IT WAS THE WHOLE POINT.** Jeff, verbatim: *"it could not be hooked up at the wall sensor because that was low-voltage — low-voltage will not work for this unit."* **The wall-switch location is LOW-VOLTAGE ONLY. There is no mains there.** The MINI-D needs 100-240V AC on N/L (or 12-48V DC on DC+/DC-), so the wall-switch box was never a candidate — this is a hard electrical disqualifier, not the soft box-depth/wire-run preference argued above. **Install at the opener, powered from the ceiling outlet the opener itself plugs into.** Jeff knew this before the doc did; the doc had it backwards for 18 days.

## Coexistence with the existing MyQ hub + wall button (resolved 08-06)

**Confirmed via research: this works fine, no conflict.** MyQ hubs connect to the exact same "wall console" terminals as the physical wall button (standard design, not a workaround) — the same red/white wires Jeff already bridge-tested on 08-05. Wiring the Sonoff's relay output onto those same two wires adds a **third** independent trigger onto one shared low-voltage sense circuit, not a competing signal path. Since it's a simple momentary-contact circuit (not a power circuit), any one of the three — wall button, MyQ, or the Sonoff relay — briefly shorting those two wires triggers the door, completely independent of the other two. This is the same pattern keypads and extra remotes already use on these systems.

## Powering the module: a simple cord, not a splice into the opener (resolved 08-06)

The N/L terminals are bare screw terminals — this is a hardwire module, not a plug-in device. Since there's outlet access at the opener, the straightforward approach is a basic 2-conductor AC cord with a molded plug on one end (a "lamp cord" / "appliance power cord," cheap at any hardware store — or repurpose a spare extension cord by cutting off the female end). Strip the other end, land the two conductors on **N** and **L**, plug the cord into the wall outlet. No need to splice into the opener's own internal wiring — that would mean opening its housing for no benefit now that outlet access is confirmed.

---

## Step 1 (Jeff/coworker, on-site): Decide how to power the module

The device needs **either** AC (100-240V via N/L) **or** DC (12-48V via DC+/DC-) — not both. **Resolved above: use AC via N/L, powered from the outlet at the opener location, via a simple cord** — no voltage guessing needed since DC isn't in play here.

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

## Door position sensor — now in scope (added 08-06)

Jeff has both parts of the MyQ (hub + sensor) and plans to sell it rather than keep opening a separate app just to check open/closed status — reasonable, since the whole point of this project is one app for everything. That means the sensor Pending Item (previously "future, not needed now") is **now active**: without it, the HCC app has no way to show real door-open/closed state once MyQ is gone.

**Recommendation: a Zigbee door/window contact sensor**, not a wired reed switch — fits Jeff's existing Zigbee-coordinator plan (Pending Item 8) instead of adding a separate wiring run, battery-powered so no extra wiring at the door at all.

- **SONOFF SNZB-04P** — same brand ecosystem as the coordinator dongle already in play, confirmed Zigbee2MQTT/ZHA compatible.
- **Aqara Door/Window Sensor** — the other well-regarded option, small, long battery life, widely used.
- Mount one half on the door's bottom panel, the other on the floor/frame at the fully-closed position — standard magnetic contact sensor, not a tilt sensor. (Tilt sensors are an alternative some prefer for garage doors specifically since they avoid magnet alignment on a moving track, but they have their own quirks — a stuck/dusty tilt ball can misreport. Contact sensors are the simpler, cheaper default; only reach for a tilt sensor if the contact sensor proves finicky on the actual door.)
- Needs the Zigbee coordinator paired into HA first (separate from this Sonoff/Matter relay work) — see Pending Item 8/the Zigbee dongle discussion elsewhere in CLAUDE.md.
- Once paired, this becomes its own `binary_sensor.*` entity in HA, completely independent of the Sonoff relay — the app side will read real open/closed state from it once Jeff has the entity ID.

## Sources

- [How to Add a Garage Door Opener to Home Assistant Using a Dry Contact Relay — SONOFF](https://sonoff.tech/en-us/blogs/news/how-to-add-a-garage-door-opener-to-home-assistant-using-a-dry-contact-relay)
- [How to automate a garage door — SONOFF Help Center](https://help.sonoff.tech/docs/How-to-automate-a-garage-door)
- [How to Automate Your Garage Door with MINI-D — SONOFF](https://sonoff.tech/en-us/blogs/news/how-to-automate-your-garage-door-with-mini-d-a-smarter-safer-solution)
- [SONOFF MINI-D Review — CNX Software](https://www.cnx-software.com/2025/01/15/sonoff-mini-d-review-matter-enabled-dry-contact-wifi-switch-ewelink-home-assistant-apple-home/)
- [Sonoff Matter Dry-Contact Switch MINI-D Review — SmartHomeScene](https://smarthomescene.com/reviews/sonoff-matter-dry-contact-switch-mini-d-review/)
- [Sonoff MINI-D inching mode — Home Assistant Community](https://community.home-assistant.io/t/sonoff-mini-d-inching-mode/903505)
- [SONOFF MINI-D — Help Center (terminals/wiring)](https://help.sonoff.tech/docs/mini-d)
- [How to Install Chamberlain MyQ Smart Garage Hub — Trunetto](https://www.trunetto.com/troubleshooting/garage-doors/chamberlain/how-to-install-chamberlain-myq-smart-garage-hub) (confirms MyQ shares the same wall-console terminals as the physical button)
- [Garage Sensor: Contact or Tilt? — SmartThings Community](https://community.smartthings.com/t/garage-sensor-contact-or-tilt/36468) (contact vs. tilt sensor tradeoffs for garage doors)
