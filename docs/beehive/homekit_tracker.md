# HomeKit ↔ Home Assistant — Living Tracker

**Standing rule (Jeff, 2026-08-14):** *"Let's keep adding as much as we can to HomeKit and HA. I want them
to work together and share now that we have the Apple TV back. Help me track that and let's check every time
we add something if we can add it to HomeKit."*

So: **every time a new device or entity is added to HA, check it against this file and decide — in, out, or
blocked — and record the answer here.** Never leave a new device unassessed.

---

## The three bridges (all loaded, 2026-08-15)

| Bridge | Port | Source | Purpose |
|---|---|---|---|
| **HCC Cameras** | 21081 | YAML (`configuration.yaml`) | The 6 Blink clipframe cameras. Paired and working. |
| **HCC Home** | 21064 | UI config entry | Everything else — lights, zones, scripts, sensors, alarm. |
| **GLE 350 Lock** | 21065 | UI, accessory mode | HA auto-splits locks into their own accessory. |

**Why cameras are separate:** HomeKit warns that cameras degrade a shared bridge. Keeping them on their own
bridge is deliberate. **Do not merge them.** Note also that setting cameras up through the UI once created
*thirteen* config entries (one per camera plus a bridge) and a wall of pairing codes — the YAML bridge is the
known-good shape for cameras.

**The load-bearing trick for Apple TV popups:** `linked_doorbell_sensor` pointed at each motion sensor.
`linked_motion_sensor` alone only produces a phone notification — Apple reserves screen interruption for
doorbell events. Do not remove those links.

---

## In HomeKit now

**Lights**
- `light.livingroom_cans` — Kasa HS220 dimmer, full brightness control

**Scenes / routines**
- `input_boolean.night_mode` — living room to 10%
- `scene.turn_on_sharky`
- `script.hcc_good_night` · `hcc_skip_commercial` · `hcc_open_sling` · `hcc_resume_fire_tv`

**Irrigation** — `switch.z1_front_right`, `z2_front_left`, `z3_back_left`, `z4_back_right`,
`z5_right_side_drive`, `switch.garden`

**Car** — `lock.gle_350_lock` (own accessory), `switch.gle_350_auxiliary_heating`,
`switch.gle_350_pre_entry_climate_control`

**Security** — `alarm_control_panel.blink_loewen301`

**Sensors** — `sensor.backyard_temperature`, `sensor.backyard_humidity` (real PWS, not Apple's regional guess)

**Cameras** — all 6 clipframes with doorbell links

---

## Deliberately OUT

- **HA add-ons** (Z-Wave JS, Studio Code Server, Plex, VLC, Spotify, Traccar, flasher, CEC, liveview proxy) —
  same rule as Alexa: never expose infrastructure to a voice assistant. A stray command takes down real systems.
- **Camera motion-detection switches** — turning one off silently kills the alert pipeline. That is exactly how
  the cameras went dead 10–14 Aug.
- **The other ~148 sensors** — utility readings, diagnostics, battery levels. They belong in the HCC app, which
  presents them far better than a Home app tile.
- **Echo speakers / media players** — Apple and Amazon ecosystems; no value in cross-exposing.

## Known risks Jeff accepted (2026-08-14)

- **Car unlock in HomeKit.** Anyone with access to the Apple Home can unlock the Mercedes. Offered a lock-only
  option; Jeff chose full control.
- **Blink arm/disarm in HomeKit.** An accidental disarm kills every camera automation. Jeff chose to add it.

---

## Blocked — wants hardware or an integration that doesn't exist yet

| Want | Blocked on |
|---|---|
| **LUX thermostat in HomeKit** | Biggest single miss. LUX has **no HA `climate` entity** — it reaches the app through its own Azure B2C cloud API. Needs a real HA integration before HomeKit can ever see it. |
| **Garage door in HomeKit + CarPlay** | SONOFF MINI-D is bought but not wired. This is the standout win — a garage door tile in CarPlay. |
| **Door/window contacts** | Zigbee coordinator + SNZB-04P sensors not bought/paired. |
| **Zigbee plugs, siren, leak/smoke sensors** | Same — waiting on the coordinator dongle. |
| **Kitchen/dining + garage lights** | Second HS220 not installed yet; garage still needs the HS210 2-location decision. |
| **F-250 telemetry** | Needs the OBD-II + ESP32 build. |

---

## How to pair a new bridge

Settings → Devices & Services → **HomeKit Bridge** → open the bridge → scan the QR with the iPhone camera, or
Apple Home → **+** → Add Accessory → More options.

## Adding an entity to an existing bridge

Settings → Devices & Services → HomeKit Bridge → the bridge → **Configure** → include/exclude list.
Or via the options-flow API: `POST /api/config/config_entries/options/flow` with the entry_id, then steps
`init` (mode/include_exclude_mode/domains) → `include` (entities) → `bridged_device_triggers`.
**The initial create flow gives no entity control** — it takes whole domains, so always narrow via options
immediately afterward.

---

*Last reviewed 2026-08-15 evening — all six cameras on annotated images; mute system verified live (30-min back / 5-min front); clip archive running.*

---

## 🔴 CORRECTION 2026-08-23 — this file was stale; the lighting rollout moved on without it

The "Blocked" table below/above says *"Kitchen/dining + garage lights — second HS220 not installed
yet; garage still needs the HS210 2-location decision."* **That is out of date.** Read live from HA
2026-08-23 5:05 PM:

| Live in HA | Entity | In HomeKit? |
|---|---|---|
| Livingroom Cans HS220 | `light.livingroom_cans` | ✅ yes |
| **Kitchen/Dinning Room HS220** | `light.kitchen_dining_room_cans` | ❌ **NO** |
| **Bedroom Cans HS220** | `light.bedroom_cans` | ❌ **NO** |
| **TP-LINK_HS210_BB9C** | `switch.masterbath_cans` | ❌ **NO** |

**Three HS220s and one HS210 are installed and loaded.** All four `tplink` config entries report
`loaded`. So the plan's "2 on hand / 3rd if a 3rd is wanted" and this file's "not installed yet" are
both superseded by reality.

**The HS210 went to the MASTER BATH, not the garage.** That is worth stating plainly because the
garage 2-location question was long framed around an HS210 — and it was separately closed on
2026-08-17 at $0 with the Ecoeler YM2108T Jeff already owned (OPEN_ITEMS #19 / CLAUDE.md). Do not
re-open the garage question on the strength of an HS210 existing; it is in the bathroom.

**This violates the standing rule at the top of this file** — *"every time a new device or entity is
added to HA, check it against this file and decide — in, out, or blocked — and record the answer
here. Never leave a new device unassessed."* Three devices were added and never assessed.

**Decision still owed from Jeff:** do the kitchen/dining, bedroom and master-bath switches go INTO
HomeKit like the living room one, or stay out? Not done unilaterally — HomeKit is inside the camera
freeze.

### ⚠️ The HS210 cannot have auto-firmware-update disabled

Standing rule E.19 is *"Kasa auto-firmware-update OFF, every device, forever"* — because TP-Link
firmware has previously broken local control, and local control is the whole reason these are used.

Verified against the entity registry (including `disabled_by=integration` entries, so nothing is
merely hidden):

    switch.livingroom_cans_auto_update_enabled       off
    switch.kitchen_dining_room_auto_update_enabled   off
    switch.bedroom_cans_auto_update_enabled          off
    masterbath (HS210)                               NO SUCH ENTITY AT ALL

The three HS220s are correctly protected. **The HS210 does not expose the toggle** — it is absent
from the registry entirely, not disabled and not hidden. This is a model/firmware limitation, NOT a
missed setup step.

**CORRECTION to my own first draft of this note (same session):** I wrote that the Kasa app is no
help because it hides the toggle. That was over-stated. The record's "the app hides it" line was about
the HS220's HA toggle specifically; the documented community guidance for Kasa generally IS to disable
automatic firmware updates **in the Kasa app**. So for the HS210 the Kasa app is the route worth
checking — it is the only one left, since HA does not expose the entity.

`binary_sensor.masterbath_cans_cloud_connection` = **on**, so it can reach TP-Link.

**Known accepted risk, not an action item:** a future TP-Link firmware push could change or break
local control on that one switch, and there is no supported way to stop it from HA. If master-bath
local control ever breaks, look here first rather than re-debugging the network — the 2026-08-14
HS220 install already burned ~2 hours proving the network was never the problem.
