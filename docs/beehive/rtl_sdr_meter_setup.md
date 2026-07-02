# RTL-SDR Meter Reader Setup (water + gas → Beehive → HCC app)

**Goal:** read the WATER (Itron `100WD` MIU, ERT-SCM, endpoint **79453337**, unencrypted) and
GAS (Itron 100G ERT) meters with the RTL-SDR dongle plugged into the J45, publish readings to
Home Assistant, then light up the HCC app's Utility cards.

**Do this AFTER the restore finishes and Beehive is fully back.** Both meters are unencrypted
Itron ERT → the purpose-built tool is **rtlamr2mqtt** (made exactly for Itron ERT gas/water/
electric meters). No Zadig/SDR#/Windows drivers — the add-on ships the Linux driver.

---

## ✅ LIVE (2026-07-02) — both meters reading via rtlamr2mqtt
Confirmed by listen-mode discovery + rtlamr2mqtt publishing:
- **Water:** ID **`79453337`**, protocol **`scm+`** (NOT plain scm — that's the key), raw reading `129105`.
- **Gas:** ID **`33393066`**, protocol **`scm`** (barcode on the Itron 100G matched exactly), raw `883384`.
- Reception is excellent (SDR hears ~20 neighborhood meters). rtlamr center 912.6 MHz.
- **WORKING config** (listen_mode off, both meters):
```yaml
general:
  sleep_for: 60
  verbosity: info
  listen_mode: false
custom_parameters: {}
mqtt:
  ha_autodiscovery_topic: homeassistant
  ha_status_topic: homeassistant/status
  base_topic: rtlamr
  discovery_interval: 300
meters:
  - id: "79453337"
    protocol: scm+
    name: water_meter
  - id: "33393066"
    protocol: scm
    name: gas_meter
```
- HA entities: **`sensor.water_meter`**, **`sensor.gas_meter`** (raw counts).
- **STILL TO DO:** (1) add a `format:` per meter to match the real dials (water raw `129105` ≈ 12,910.5 gal → likely `format: "#####.#"`; confirm gas format vs its dial); (2) HA utility_meter/derivative helpers for today/month/flow; (3) wire `UTIL_ENTITIES` in the app.
- **Discovery tip:** `listen_mode: true` + `meters: []` runs rtlamr `-msgtype=all` with no filter → logs every meter's ID + type. That's how we found the protocols/IDs.

---

## ⚙️ DRIVERS — none needed (important)
**Do NOT download Zadig / SDR# / WinUSB.** Those are Windows-only, and we're plugging the dongle
into the **J45 (HA OS = Linux)**. The **rtlamr2mqtt** (and rtl_433) add-on **ships the RTL-SDR
Linux driver** and HA auto-detects the dongle the moment it's plugged in. Nothing to install,
nothing to download. (The only time Zadig/SDR# would apply is an *optional* bench test on the
beast — which we're skipping.)

## Step 1 — Plug in the RTL-SDR
- Insert the RTL-SDR into a **free USB port on the J45** (use the USB extension so it's away from
  other USB — reduces interference). Antenna vertical, near a window facing the meters if possible.

## Step 2 — Install the MQTT broker (the messenger)
1. Beehive → **Settings → Add-ons → Add-on Store**.
2. Install **Mosquitto broker** → **Start** → enable "Start on boot" + "Watchdog".
3. **Settings → Devices & Services** → it should auto-suggest the **MQTT** integration → **Configure**.
4. Create an MQTT user for the add-on: **Settings → People → Users → Add** (e.g. user `mqtt`, a
   password) — we'll put these in the rtlamr2mqtt config below.

## Step 3 — Install rtlamr2mqtt (the meter decoder)
1. **Settings → Add-ons → Add-on Store → ⋮ (top-right) → Repositories**.
2. Add: **`https://github.com/allangood/rtlamr2mqtt`** → Add → close.
3. Find **rtlamr2mqtt** in the store → **Install**.
4. Open its **Configuration** tab and paste the config from Step 4.
5. **Start** the add-on, enable "Start on boot" + "Watchdog".

## Step 4 — rtlamr2mqtt config (template — adjust to the add-on's schema)
```yaml
general:
  sleep_for: 300          # seconds between reads (SCM comes ~every minute; 300 = poll every 5 min)
  verbosity: info
  tickle_rtl_tcp: false
mqtt:
  host: core-mosquitto
  port: 1883
  user: mqtt              # the MQTT user you made
  password: CHANGE_ME
  ha_autodiscovery: true
  ha_autodiscovery_topic: homeassistant
meters:
  - id: 79453337          # WATER — confirmed
    protocol: scm+        # ERT-SCM (try scm+ first; if no reads, try scm)
    name: water_meter
    unit_of_measurement: gal
    icon: mdi:water
    # format: "#####.###" # optional: force decimal placement to match the LCD reading
  # - id: <GAS_ERT_ID>    # GAS — uncomment once we have the full ID
  #   protocol: scm
  #   name: gas_meter
  #   unit_of_measurement: ccf
  #   icon: mdi:fire
```

## Step 5 — Confirm it's decoding
- Open the rtlamr2mqtt add-on **Log** tab. Within a few minutes you should see it catch messages
  from ID `79453337` and publish a reading. If nothing after ~10 min:
  - Antenna placement (get it near/facing the meters, or run it to a window).
  - Try `protocol: scm` instead of `scm+`.
  - Confirm the dongle is seen (add-on log shows the RTL-SDR init).

## Step 6 — Sensors appear in HA
- With `ha_autodiscovery: true`, HA auto-creates a sensor like **`sensor.water_meter`** (the
  cumulative gallons reading). Check **Settings → Devices & Services → Entities** → search "water".

## Step 7 — Light up the HCC app
- In `index.html` → `loadUtilities()` → **`UTIL_ENTITIES`**, set the real entity_ids, e.g.:
  ```js
  water_today: 'sensor.water_meter_today',   // if we build a daily helper, else use the raw total
  water_month: 'sensor.water_meter_month',
  water_flow:  'sensor.water_meter_flow',
  ```
  (The raw meter gives a cumulative total; "today/month/flow" come from HA utility-meter/derivative
  helpers we add on top of `sensor.water_meter`.)
- Commit → the Water card flips to **LIVE**.

## Gotchas / reminders
- **European timestamp → Central:** the Kamstrup-side reads report European time. Convert to
  `America/Chicago` in any decode/display code that uses a meter timestamp.
- **Cumulative vs. usage:** the meter reports a running total (like an odometer). "Today/This
  month/Flow" are derived in HA (utility_meter helper for daily/monthly, derivative for flow).
- **Gas:** same flow once we have the gas ERT ID — add the second `meters:` entry.
- **Sewer claim:** the water gallons here feed the City-of-White-House sewer-overpayment numbers.

---

### Alternative decoder (if rtlamr2mqtt gives trouble)
**rtl_433** add-on also decodes ERT (`-R 149` SCM, `-R 151` SCM+) → MQTT. rtlamr2mqtt is the
cleaner ERT-specific path, so try it first.
