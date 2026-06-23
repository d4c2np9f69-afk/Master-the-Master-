# HCC Toro TimeMaster 21200 — Project Memory

**READ THIS FIRST.** This file is the single source of truth for any AI session working on this project. Do not guess. Do not ask Jeff to re-explain. Everything you need is here.

---

## Critical Rules (Never Break These)

1. **NEVER ask Jeff for credentials** — Cloudflare API token, KV IDs, WiFi passwords, HA tokens are all already configured. Reference them from this file.
2. **NEVER suggest hiring an IT person.**
3. **NEVER make excuses or blame unclear history** — read this file and the git log.
4. Commands must work the first time. Test before telling Jeff to run something.
5. When in doubt, check git log and this file before touching anything.

---

## What This Project Is

A Progressive Web App (PWA) for Jeff's Toro TimeMaster 21200 lawn mower. Single `index.html` file deployed on Cloudflare Pages.

- **Live URL:** `https://toro1-5rz.pages.dev`
- **Cloudflare Pages project name:** `toro1`
- **Repo:** `d4c2np9f69-afk/master-the-master-`
- **Active branch:** `claude/time-master-project-liq1jw`
- **`main` branch:** contains only `Toro_TimeMaster_PWA_Package.zip` — do NOT use it for deploys

The app has four sections: **YARD** (mower data), **HOME**, **WEATHER**, **IRRIGATION**.

---

## Deployment Pipeline

**GitHub Actions is BROKEN** — `CLOUDFLARE_API_TOKEN` secret is not set in the GitHub repo. Every Actions run fails with: `##[error]Input required and not supplied: apiToken`

**Actual deployment:** Cloudflare Pages native Git integration watches `claude/time-master-project-liq1jw` and deploys automatically on every push. This IS working.

**Workflow:** Push to `claude/time-master-project-liq1jw` → Cloudflare Pages native integration picks it up → live at `toro1-5rz.pages.dev` within ~60 seconds.

---

## Cloudflare Infrastructure

| Resource | Name | ID |
|---|---|---|
| KV Namespace | `MOWER_KV` | `ec5b28597d9c4fb9b182b1aea1d50eff` |
| KV Binding (Pages env var) | `HCC_KV` | maps to `MOWER_KV` |
| Pages project | `toro1` | — |

**The binding:** In Cloudflare Pages settings, the KV namespace `MOWER_KV` is bound to the variable name `HCC_KV`. The `functions/api/hours.js` code references `env.HCC_KV` — this is correct and intentional.

**KV key used:** `hours_data` — stores the latest JSON payload from the ESP32 sensor box.

---

## Engine Hours — Current State

- **Jeff's real hours as of 2026-06-22 backup:** `5.9 hrs`
- **`DEFAULT_STATE.hours` in index.html:** `5.9` ✓
- **`MOWER_BASELINE` in index.html (line ~2497):** `5.9` ✓
- **How hours work:** `MOWER_BASELINE` (5.9) + `d.hours` from sensor API = total displayed hours. Sensor hours are cumulative runtime since ESP32 was installed, NOT total mower lifetime hours.

**Jeff's maintenance log (from 2026-06-22 backup — 7 entries, all dated 2026-05-31 at 3.5 hrs):**
- Cable Inspection, Clear Coat Entire Mower, New Mulching Gator Blades, Battery Charge, Post-Mow Cleanup, Pre-Mow Safety Check, Mow #3 (1.0 hr, 4.0 mi)

**Purchase history:** New Mulching Gator Blades — $31.85 — 2026-05-31

---

## Sensor / ESP32 Hardware

The sensor box is a custom ESP32 running ESPHome firmware. It is **permanently mounted on the mower** and powered by the mower's 12V battery. All lights are on, battery is fully charged.

**Confirmed working (tested 10+ times on bench by Jeff):** Vibration sensor triggered → registered in app. RPM registered. These worked BEFORE the current session's commits.

**ESPHome firmware file:** `beehive/esphome/hcc-mower.yaml`

**What the ESP32 posts:**
- Every 90 seconds when `engine_on` (RPM > 200): full sensor payload to `https://toro1-5rz.pages.dev/api/hours`
- Every 5 minutes when engine is OFF: heartbeat with `engine_running: false`, battery, WiFi RSSI, temp, `source: "heartbeat"`

**JSON fields the app reads from `/api/hours` GET:**
```
hours, battery, battery_v, voltage, voltage_v, batt, batt_raw
rpm_peak, rpm_avg
dist_total_m, dist_session_m, speed_mph, gps_speed_mph, mph
lat, lon, has_fix, track[]
pitch, roll, vibration, vibration_g, vibe, vibration_level
shock_events, shocks, impact_count
wifi_rssi, rssi, esp_temp_f, esp_temp, temp_f
mpu_ok, gps_rx
source, lastSync, engine_running
```

**Status messages the app shows:**
- `source === 'stub'` → orange "Sensor box not connected yet — start the engine and the data will appear"
- `source === 'heartbeat'` or `engine_running === false` → green "Engine off · Box connected · Battery X.XX V · WiFi -XX dBm"
- Normal engine-running data → gray "Sensor: X.X hrs · X.XX mi GPS · last sync [time]"

---

## Key Files

```
index.html               — entire PWA (single file, ~300KB)
service-worker.js        — cache version: hcc-v4
manifest.json            — PWA manifest
functions/api/hours.js   — GET/POST sensor data ↔ Cloudflare KV
functions/setup.js       — serves Beehive install script at /setup
beehive/esphome/hcc-mower.yaml    — ESP32 firmware (ESPHome)
beehive/esphome/secrets.yaml.template — WiFi/API key template (never commit real secrets)
images/                  — hero-home.jpg, hero-irr.jpg, hero-yard.jpg
icons/                   — icon-192.png, icon-512.png
```

---

## index.html Structure

- Lines 1–1208: HTML/CSS
- Line 1209: `<script>` (single JS block — do NOT add another `<script>` tag inside this block)
- Lines 1209–2809: All JavaScript
- Line 2809: `</script>` (closing tag)
- Lines 2810+: closing HTML

**CRITICAL:** Never put a `<script>` or `</script>` tag inside the JS block. The HTML parser treats script content as raw text — a bare `<script>` inside becomes a JS SyntaxError that kills the entire app (blank page). This was the bug that caused the great blank-page incident of 2026-06-23.

**`localStorage` key:** `toro21200` — stores the full `S` state object.

---

## Known Issues / Active Investigation

### Sensor data showing dead (UNDER INVESTIGATION as of 2026-06-23)

**Symptom:** All sensor fields show `—` and Battery shows `0.00 V`. The status bar shows "Sensor box not connected yet" (orange) meaning `/api/hours` is returning the stub response.

**What Jeff confirmed:** Sensor WAS working — vibration and RPM registered 10+ times on bench before this session's commits.

**What changed in this session:**
1. `a973c8f` — fixed blank page (removed 2 stray `<script>` tags), bumped SW to hcc-v4 — **should not affect sensor**
2. `98b8dca` — modified `hours.js` to add `MOWER_KV` fallback — **potentially broke something**
3. `b629c83` — reverted `hours.js` to original — **should have restored**
4. `fe1edb8` — added heartbeat to ESPHome YAML, added status display logic to index.html — **display logic only**
5. `53eb7d4` — updated `DEFAULT_STATE.hours` and `MOWER_BASELINE` to 5.9 — **should not affect sensor**

**Most likely cause:** Either (a) the KV binding `HCC_KV` is not correctly set in Cloudflare Pages environment, meaning the POST from ESP32 stores nothing and GET returns stub every time; or (b) the ESP32 lost its config/WiFi and isn't posting. The next real mow session will confirm — if after 1 hour of mowing the sensor data still shows `0.00 V` and `—`, the KV binding needs to be verified in Cloudflare Pages dashboard.

**How to verify KV binding:** Cloudflare dashboard → Pages → toro1 project → Settings → Environment variables → check that `HCC_KV` is listed under KV namespace bindings.

**How to manually test the POST pipeline:**
```bash
curl -X POST https://toro1-5rz.pages.dev/api/hours \
  -H "Content-Type: application/json" \
  -d '{"hours":0.1,"battery":12.6,"rpm_peak":3200,"source":"test"}'
# Should return: {"ok":true}
# Then GET:
curl https://toro1-5rz.pages.dev/api/hours
# Should return the test payload, NOT the stub
```

---

## ESPHome Heartbeat OTA Update (PENDING)

The `beehive/esphome/hcc-mower.yaml` has a new 5-minute engine-off heartbeat added (commit `fe1edb8`). This needs to be flashed to the ESP32 via OTA.

**Instructions for Jeff:**
1. Open Home Assistant → ESPHome add-on
2. Find the `hcc-mower` device
3. Click the three-dot menu → Install → Wirelessly
4. Wait ~2 minutes for OTA update to complete
5. The box will reboot and start posting heartbeats every 5 min when parked

---

## Git Log (Recent — most recent first)

```
53eb7d4  Restore Jeff's real hours — update default state and sensor baseline to 5.9h
b629c83  Revert hours.js to original — undo KV refactor that may have broken sensor read
fe1edb8  Add engine-off heartbeat and improve sensor status display
98b8dca  Fix sensor API — accept MOWER_KV binding as fallback for HCC_KV  ← (was reverted)
a973c8f  Fix fatal JS syntax error — remove stray <script> tags inside script block
8497827  Bump service worker to hcc-v3 — force cache clear of 2.1MB old build
739d004  Extract hero photos from HTML — drop from 2.1MB to 295KB
686bece  Switch Step 3 copy command from curl to wget for HA Terminal compatibility
a463d09  Add /setup endpoint that serves install script directly
c1c004c  Auto-detect Beehive by IP when homeassistant.local fails
```

---

## Jeff's Contact / Account Info

- **Email:** jeff.loewen@comcast.net
- **Cloudflare account:** credentials already configured — never ask for them
- **Home Assistant instance:** "Beehive" — accessible at `homeassistant.local` or local IP
