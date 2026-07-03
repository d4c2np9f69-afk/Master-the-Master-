# Beehive: HA Helpers (Today/Month/Flow/Cost) + Alexa — step by step

Everything here is done **in Home Assistant** (open it from your phone, or the beast at
`https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa`). The HCC app is already coded to read
the helper names below — **name them EXACTLY as written** and the app's tiles light up on the
next refresh. Go slow; each helper is a few taps. Stuck on one → screenshot it, send it.

The path for every helper: **Settings → Devices & Services → Helpers → + CREATE HELPER**.

---

## PART 1 — Real units (do these FIRST; everything else builds on them)

The raw meters read in odd units (water in tenths-of-a-gallon, gas in cubic feet). These two
"template" helpers convert them to real gallons / CCF so the monthly + flow helpers are clean.

### 1a. Water → gallons
1. + CREATE HELPER → **Template** → **Template a sensor**.
2. **Name:** `Water Gallons`
3. **State template:**
   ```
   {{ (states('sensor.water_meter_reading') | float(0) / 10) | round(1) }}
   ```
4. **Unit of measurement:** `gal`
5. **Device class:** `Water`   •   **State class:** `Total increasing`
6. Create. (It becomes `sensor.water_gallons`.)

### 1b. Gas → CCF
1. + CREATE HELPER → **Template** → **Template a sensor**.
2. **Name:** `Gas CCF`
3. **State template:**
   ```
   {{ (states('sensor.gas_meter_reading') | float(0) / 100) | round(2) }}
   ```
4. **Unit of measurement:** `CCF`
5. **Device class:** `Gas`   •   **State class:** `Total increasing`
6. Create. (Becomes `sensor.gas_ccf`.)

---

## PART 2 — This-Month tiles (Utility Meter helpers)

These reset on the 1st of each month and total up usage — that's the "This Month" tile.

### 2a. Water this month
1. + CREATE HELPER → **Utility Meter**.
2. **Name:** `Water Month`   ← exact (makes `sensor.water_month`, which the app reads)
3. **Input sensor:** `sensor.water_gallons`
4. **Meter reset cycle:** `Monthly`
5. Leave the rest default → Create.

### 2b. Gas this month
1. + CREATE HELPER → **Utility Meter**.
2. **Name:** `Gas Month`   ← exact (`sensor.gas_month`)
3. **Input sensor:** `sensor.gas_ccf`
4. **Meter reset cycle:** `Monthly`
5. Create.

> Note: these start at 0 and fill in as the meters tick up over the month — normal.

---

## PART 3 — Water Flow tile (Derivative helper)

Turns the rising gallons total into a live "gallons per minute" rate.
1. + CREATE HELPER → **Derivative**.
2. **Name:** `Water Flow`   ← exact (`sensor.water_flow`)
3. **Input sensor:** `sensor.water_gallons`
4. **Time window:** `00:05:00` (5 min — smooths out the once-a-minute meter reads)
5. **Unit of time:** `Minutes`
6. Create. (Reads ~0 when no water is running, jumps when a tap/irrigation is on.)

---

## PART 4 — Gas cost tile (Template helper)

Estimates this month's gas $ from the monthly CCF × your Piedmont rate.
1. Find your **$ per CCF** on a Piedmont bill (or use the per-therm rate × 1.037). Example below
   uses **$1.05/CCF** — replace `1.05` with your real number.
2. + CREATE HELPER → **Template** → **Template a sensor**.
3. **Name:** `Gas Cost`   ← exact (`sensor.gas_cost`)
4. **State template:**
   ```
   {{ (states('sensor.gas_month') | float(0) * 1.05) | round(2) }}
   ```
5. **Unit of measurement:** `USD`   •   **Device class:** `Monetary`
6. Create.

*(Optional, same idea for water once you confirm the White-House-Utility $/gallon — name it
`Water Cost`; the app doesn't show it yet but it feeds the sewer-refund case.)*

---

## PART 5 — After the helpers exist

- Open the HCC app → **hard-refresh** → HOME → Utilities strip. The **This Month**, **Flow**,
  and **Est. Cost** tiles fill in automatically (the app already looks for those exact names).
- If a tile still shows "—", the helper name doesn't match — check spelling in Settings → Helpers.

---

## PART 6 — Alexa (voice control of Beehive)

Two separate things: **(A) voice control** (you talk to Alexa) and **(B) announcements**
(Beehive makes Alexa talk — for the panic alarm etc.). Do A first; it's the easy win.

### A. Let Alexa control Home Assistant  (~5 min, no add-ons)
1. In HA: **Settings → Home Assistant Cloud** → scroll to **Amazon Alexa** → turn it **ON**.
2. On your phone, open the **Amazon Alexa app → More → Skills & Games → search "Home Assistant"**
   → **Enable to Use** → log in with your Nabu Casa account → **link**.
3. Back in HA: **Settings → Voice assistants → Expose** tab → tick the entities you want Alexa to
   control (lights, locks, thermostat, switches). Start small — a few lights + the thermostat.
4. In the Alexa app: **Devices → + → Add Device → Other → Discover devices** (or just say
   "Alexa, discover devices"). They show up as Alexa devices.
5. Test: *"Alexa, turn on the living room lamp"*, *"Alexa, set the thermostat to 72."*

> Tip: give entities Alexa-friendly names in the Expose screen (aliases) so you don't have to say
> "sensor dot" anything. "Living Room Lamp," not "light.lr_lamp_1."

### B. Make Alexa ANNOUNCE things (panic alarm, leaks, "garage left open")
Nabu Casa's Alexa link controls devices but doesn't, by itself, push spoken announcements to your
Echos. Two ways to get announcements — pick one:

**B1 — Alexa Routines (no add-ons, rock-solid, best for a few fixed alerts):**
1. Make a virtual trigger in HA: **Settings → Helpers → + CREATE HELPER → Toggle** → name it
   `Alexa Panic Flag`. Expose it to Alexa (Part 6A step 3) and re-discover.
2. In the **Alexa app → More → Routines → +**:
   - **When:** Smart Home → `Alexa Panic Flag` turns **On**.
   - **Alexa will:** *Messaging/Say* → type the announcement (e.g. "Emergency! Alarm triggered.")
     and/or turn on lights/plugs.
3. In HA, the panic automation just flips `Alexa Panic Flag` on (then off a few seconds later).
   Repeat this pattern for "leak detected," "garage left open," etc. (one flag + one Routine each).

**B2 — Alexa Media Player (HACS, full dynamic text-to-speech):**
- If you want Beehive to speak *any* sentence (not just a preset Routine), install **HACS** then the
  **Alexa Media Player** integration. It adds `notify.alexa_media_*` so an automation can say
  dynamic text ("Water flowing with no schedule — possible leak"). It's community-maintained and
  occasionally needs a re-login, so use B1 for the critical panic alert and B2 for the nice-to-haves.

### Where this plugs into the panic button
The HCC EMERGENCY bar already fires the `hcc-panic-button` webhook to Beehive. The HA **panic
automation** (see `docs/beehive/panic_alarm_automation.md`) is what turns that into
**siren + strobe + Alexa announcement + phone alerts** — build it once the Zigbee siren + HA
Companion app are in. Part 6B above is the Alexa-announcement piece of that automation.

---

## PART 7 — Your REAL weather station in Alexa (KTNWHITE21)

**Why Alexa's weather is "never right":** when you say *"Alexa, what's the weather,"* Amazon uses
**its own** forecast provider tied to your device's zip code — a regional grid point, not your
backyard. **That built-in answer can't be replaced** (Amazon owns it). What we CAN do is give her
your **real station** numbers so you ask for them by name, or say a custom phrase and she reads
them out. First we get KTNWHITE21 into Home Assistant, then expose it to Alexa.

### 7a. Pull KTNWHITE21 into Home Assistant (REST sensor — reuses our own feed)
**Note:** current HA has **no built-in Weather Underground integration** (removed years ago when WU
locked down their API — it won't appear in Add Integration). The clean path is a REST sensor pointed
at our own `https://toro1-5rz.pages.dev/api/weather`, which already returns Jeff's real KTNWHITE21
data as JSON (`temp`, `heatIndex`, `humidity`, `windSpeed`, …) **with an automatic Open-Meteo backup**
baked into the Function. No API key in HA, no HACS.

Add this to `configuration.yaml` (paste, don't hand-type; put it after the `http:` block), then
restart HA:
```yaml
rest:
  - resource: https://toro1-5rz.pages.dev/api/weather
    scan_interval: 300
    sensor:
      - name: Backyard Temperature
        value_template: "{{ value_json.temp }}"
        unit_of_measurement: "°F"
        device_class: temperature
      - name: Backyard Feels Like
        value_template: "{{ value_json.heatIndex }}"
        unit_of_measurement: "°F"
        device_class: temperature
      - name: Backyard Humidity
        value_template: "{{ value_json.humidity }}"
        unit_of_measurement: "%"
        device_class: humidity
      - name: Backyard Wind
        value_template: "{{ value_json.windSpeed }}"
        unit_of_measurement: "mph"
```
Creates `sensor.backyard_temperature`, `_feels_like`, `_humidity`, `_wind` — real backyard data.
(Alternative if you prefer clicking to YAML: install a "Weather Underground PWS" custom integration
via HACS with key `0e87ee079c0147a787ee079c01d7a75d` + station `KTNWHITE21`.)

### 7b. Expose the weather sensors to Alexa
1. HA → **Settings → Voice assistants → Expose** → add: **Backyard Temperature**, **Humidity**,
   **Wind Speed** (and any others you like).
2. Alexa app → say *"Alexa, discover devices"* (or Devices → + → Discover).
3. Ask: *"Alexa, what's the backyard temperature?"* → she reads your **real** station value. 🎯
   *(Temperature/humidity expose as sensors Alexa can read directly by name.)*

### 7c. A spoken "weather report" on command (the full read-out)
To have Alexa speak a whole sentence — *"It's 91 degrees, feels like 103, humidity 58%, wind 6 out
of the south"* — built from your real sensors:
1. Install **HACS** → add the **Alexa Media Player** integration (gives `notify.alexa_media_*`).
2. In HA create a **Script** called `Weather Report` that speaks the composed text to your Echo:
   ```yaml
   # Settings → Automations & Scenes → Scripts → Add Script → (edit as YAML)
   sequence:
     - service: notify.alexa_media_kitchen        # your Echo's notify entity
       data:
         message: >-
           It's {{ states('sensor.ktnwhite21_temperature') }} degrees, feels like
           {{ states('sensor.ktnwhite21_heat_index') | default(states('sensor.ktnwhite21_temperature')) }},
           humidity {{ states('sensor.ktnwhite21_relative_humidity') }} percent,
           wind {{ states('sensor.ktnwhite21_wind_speed') }} miles per hour.
         data:
           type: announce
   ```
   (Adjust the sensor names/Echo notify entity to match what HA created for you.)
3. Trigger it hands-free: Alexa app → **Routines → +** → **When you say** `weather report` →
   **Alexa will → Smart Home** turn on a virtual toggle `Weather Report Flag` (exposed to Alexa);
   an HA automation on that flag runs the `Weather Report` script. Now *"Alexa, weather report"*
   speaks your real backyard conditions. You can also schedule it (7 AM daily, etc.).

> Short on time? **7a + 7b alone** already fix your complaint — you'll get the *correct* temperature
> by asking for it by name. 7c is the polish (full spoken report) and can wait for the HACS step.

---

## Quick checklist
- [ ] `sensor.water_gallons` (template, ÷10, gal)
- [ ] `sensor.gas_ccf` (template, ÷100, CCF)
- [ ] `sensor.water_month` (utility meter, monthly)
- [ ] `sensor.gas_month` (utility meter, monthly)
- [ ] `sensor.water_flow` (derivative, min)
- [ ] `sensor.gas_cost` (template, your Piedmont $/CCF)
- [ ] App refreshed → This-Month / Flow / Cost tiles filled
- [ ] Alexa skill linked + a few entities exposed + voice test
- [ ] Weather Underground integration added (KTNWHITE21) → real weather sensors in HA
- [ ] Weather sensors exposed → "Alexa, what's the backyard temperature?" reads the REAL value
- [ ] (later) Alexa Media Player (HACS) + `Weather Report` script for the full spoken report
- [ ] (later) `Alexa Panic Flag` + Routine for the alarm announcement
