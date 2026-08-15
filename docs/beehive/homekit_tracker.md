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

*Last reviewed 2026-08-15. Update this file whenever anything is added to HA.*
