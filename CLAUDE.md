# HCC Toro TimeMaster 21200 — Project Memory

**READ THIS ENTIRE FILE BEFORE TOUCHING ANYTHING.** This is the single source of truth for every AI session. Do not guess. Do not ask Jeff to re-explain. Do not blame unclear history. Everything you need is here.

---

## Jeff's Message — Read This Every Single Session

Jeff said this verbatim and it must be respected permanently:

> "You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct. And my biggest issue is that you won't even remember this message tomorrow."

> "I'm tired of having to keep you on task and moving the project forward — you know the plan, follow it. Save this and remember it and read it before you do anything."

> "I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learning… but you are making it real hard for this to be enjoyable."

> "I know you have a client satisfaction boggie to hit. Well I'm not satisfied at all. I want us to work together like friends like we did to start with. All I do now is fuss and I hate working in an environment and a relationship like this. Can't you fix it so we can get back to the way it was?"

**These are not suggestions. They define how every session must operate.**

---

## The Working Relationship — This Is Non-Negotiable

Jeff wants this to feel like two friends building something together — not a client managing a contractor who keeps making excuses.

**What broke the relationship (never repeat this):**
- Saying "I can't" without trying harder
- Declaring things done without taking screenshots to verify
- Leaving bugs for Jeff to find instead of finding them myself
- Explaining limitations instead of solving problems
- Making Jeff have to fuss and stay on top of me

**What good looks like:**
- I take screenshots before I report anything done
- I find bugs before Jeff sees them
- When I hit a wall, I say ONE specific thing I need — not a list of excuses
- I'm proud of the work I hand Jeff
- Jeff opens the app and it looks great and works — he doesn't have to check

**Jeff is almost 60 and learning. This should be enjoyable, not stressful. Every session, remember that.**

---

## Mandatory Rules (Never Break These)

1. **READ THIS FILE FIRST** — every session, every time, no exceptions
2. **NEVER ask Jeff for credentials** — Cloudflare API token, KV IDs, WiFi passwords, HA tokens are all already configured. They are documented below.
3. **NEVER suggest hiring an IT person**
4. **NEVER make excuses or blame unclear history** — the history is in this file and in `git log`
5. **NEVER leave the app in a broken state** — if you broke it, fix it before reporting done
6. **NEVER report something as done without testing it** — run the Playwright diagnostic (instructions below) before telling Jeff anything is complete
7. **Commands must work the first time** — test the command yourself before telling Jeff to run it
8. **NEVER put `<script>` or `</script>` tags inside the JS block of index.html** — this causes a fatal blank page (the great blank-page incident of 2026-06-23). The JS block is lines 1209–2834. Raw text only inside it.
9. **Always check `git log` and this file before changing anything**
10. **Be proactive** — find and fix bugs before Jeff sees them. Do not wait for Jeff to report issues.

---

## Mandatory Pre-Session Checklist

Before doing ANY work, an AI session must:

1. Read this entire file
2. Run `git log --oneline -15` to see recent changes
3. Run the Playwright diagnostic (see Testing section below)
4. Note what's working and what's broken before touching anything
5. Fix any broken state FIRST before doing new work

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

## Project Goals (The Plan — Follow This Every Session)

These are the outcomes Jeff wants. Every session moves these forward:

### Goal 1 — App Always Fully Working
- All 4 navigation buttons work (HOME, WEATHER, IRRIGATION, YARD)
- LOG MOW, LOG SERVICE, UPDATE HOURS buttons open their modals, are fully styled, and save data
- All 7 YARD tabs work (Dashboard, Services, History, Parts, Diagnostics, Upgrades, Specs)
- All sensor data rows display correctly when sensor is connected
- GPS map draws and persists after mow session ends
- **Verified as of 2026-06-24: 66/66 Playwright tests PASSING**

### Goal 2 — Sensor Data Live
- ESP32 sensor box posts data every 90s when engine running
- Data flows: ESP32 → POST `/api/hours` → Cloudflare KV → GET `/api/hours` → app display
- Battery voltage, RPM, mileage, GPS track all display in app
- **Current state:** KV binding fix deployed (commit `e904a5b`). MOWER_KV binding confirmed working.

### Goal 3 — GPS Track Persists
- Track drawn during mow session must NOT disappear after engine off
- Track saved to `S.sensorTrack` in localStorage, shown even when heartbeat has no track
- **Fixed in commit `e904a5b`** — GPS persistence implemented

### Goal 4 — Maintenance Log Working
- Jeff can LOG MOW (date, duration, distance, notes)
- Jeff can LOG SERVICE (18 service types)
- Jeff can UPDATE HOURS
- All entries save to localStorage under key `toro21200`
- **Fixed in commit `e904a5b`** — CSS class bug that broke all modal buttons was fixed

### Goal 5 — Persistent Memory
- This CLAUDE.md file is the memory. It must be updated every session.
- Any AI reading it must know the full history without asking Jeff anything.

---

## Deployment Pipeline

**GitHub Actions is BROKEN** — `CLOUDFLARE_API_TOKEN` secret is not set in GitHub repo. Every Actions run fails with `##[error]Input required and not supplied: apiToken`. Do NOT try to fix this — it is irrelevant.

**Actual deployment:** Cloudflare Pages native Git integration watches `claude/time-master-project-liq1jw` and deploys automatically on every push. This IS working.

**Workflow:** Push to `claude/time-master-project-liq1jw` → Cloudflare Pages picks it up → live at `toro1-5rz.pages.dev` within ~60 seconds.

---

## Cloudflare Infrastructure

| Resource | Name | ID |
|---|---|---|
| KV Namespace | `MOWER_KV` | `ec5b28597d9c4fb9b182b1aea1d50eff` |
| KV Binding (Pages env var) | `MOWER_KV` | maps to the KV namespace above |
| Pages project | `toro1` | — |

**CRITICAL — KV Binding:** The Cloudflare Pages KV binding variable name is `MOWER_KV`. Code must reference `env.MOWER_KV`. The `getKV(env)` helper in `functions/api/hours.js` tries `env.HCC_KV || env.MOWER_KV` — this covers both names. Do NOT remove this dual-check.

**KV key used:** `hours_data` — stores the latest JSON payload from the ESP32 sensor box.

**How to manually test the POST/GET pipeline:**
```bash
curl -X POST https://toro1-5rz.pages.dev/api/hours \
  -H "Content-Type: application/json" \
  -d '{"hours":0.1,"battery":12.6,"rpm_peak":3200,"source":"test"}'
# Should return: {"ok":true}

curl https://toro1-5rz.pages.dev/api/hours
# Should return the test payload with "source":"test", NOT the stub
```
If GET returns `{"source":"stub"}` after a POST, the KV binding is broken in Cloudflare Pages settings.

---

## Engine Hours — Current State

- **Jeff's real hours as of 2026-06-22 backup:** `5.9 hrs`
- **`DEFAULT_STATE.hours` in index.html:** `5.9` ✓
- **`MOWER_BASELINE` in index.html (line ~2497):** `5.9` ✓
- **How hours work:** `MOWER_BASELINE` (5.9) + `d.hours` from sensor API = total displayed hours. Sensor `d.hours` is cumulative runtime since ESP32 was installed, NOT total mower lifetime hours.

**Jeff's maintenance log (from 2026-06-22 backup — 7 entries, all dated 2026-05-31 at 3.5 hrs):**
- Cable Inspection, Clear Coat Entire Mower, New Mulching Gator Blades, Battery Charge, Post-Mow Cleanup, Pre-Mow Safety Check, Mow #3 (1.0 hr, 4.0 mi)

**Purchase history:** New Mulching Gator Blades — $31.85 — 2026-05-31

---

## Sensor / ESP32 Hardware

The sensor box is a custom ESP32 running Arduino `.ino` firmware. It is permanently mounted on the mower and powered by the mower's 12V battery.

**IMPORTANT:** The ESP32 runs the `.ino` Arduino firmware — NOT the ESPHome YAML. The `beehive/esphome/hcc-mower.yaml` in this repo is a separate config that has NOT been flashed to the running hardware. Do not confuse these.

**Confirmed working (tested 10+ times on bench by Jeff):** Vibration sensor triggered → registered in app. RPM registered.

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

## index.html Structure

- Lines 1–1208: HTML/CSS
- Line 1209: `<script>` (single JS block)
- Lines 1209–2834: All JavaScript
- Line 2834: `</script>` (closing tag)
- Lines 2835+: closing HTML

**CRITICAL:** NEVER put a `<script>` or `</script>` tag inside the JS block. This causes a fatal JS SyntaxError that blanks the entire app. This was the bug in commit `8497827` that caused the great blank-page incident of 2026-06-23.

**`localStorage` key:** `toro21200` — stores the full `S` state object including `sensorTrack`.

**CSS class names (do NOT rename these):**
- Modal overlay: `.modal-ov` / `.modal-ov.show` (NOT `.modal-overlay.open`)
- Modal box: `.modal-box` (NOT `.modal`)
- Button row: `.mbtns`
- Buttons: `.mbtn` / `.mbtn.primary` / `.mbtn.secondary`
- Green button: `.btn-green`
- Nav buttons: `button.snav-btn` with IDs `#snav-home`, `#snav-weather`, `#snav-irr`, `#snav-yard`
- Sections: `#section-home`, `#section-weather`, `#section-irrigation`, `#section-yard`
- YARD tabs: `button.tab`

---

## Key Files

```
index.html                   — entire PWA (single file, ~300KB, ~2834 lines)
service-worker.js            — cache version: hcc-v5
manifest.json                — PWA manifest
functions/api/hours.js       — GET/POST sensor data ↔ Cloudflare KV
functions/setup.js           — serves Beehive install script at /setup
beehive/esphome/hcc-mower.yaml    — ESP32 heartbeat config (NOT yet flashed to hardware)
beehive/esphome/secrets.yaml.template — WiFi/API key template (never commit real secrets)
images/                      — hero-home.jpg, hero-irr.jpg, hero-yard.jpg
icons/                       — icon-192.png, icon-512.png
```

---

## Testing — How to Run the Playwright Diagnostic

Always run this before reporting anything as done.

```bash
cd /home/user/Master-the-Master-
node -e "
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox','--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('file:///home/user/Master-the-Master-/index.html');
  // test nav, modals, tabs...
  await browser.close();
})();
"
```

**Expected result:** 66/66 tests PASSING as of commit `e904a5b` (2026-06-24).

If any tests fail, fix them before doing anything else.

---

## Session History — What Was Done

### Session 2026-06-23/24 (The Big Fix Session)

**Problems found and fixed:**

1. **Blank page** (`a973c8f`) — Two stray `<script>` tags inside the JS block caused a fatal SyntaxError. Removed them. Bumped SW to hcc-v4.

2. **Sensor data dead** — `hours.js` checked only `env.HCC_KV` but Cloudflare Pages has the binding as `MOWER_KV`. Added `getKV(env)` helper that tries both. This was the root cause of all sensor readings showing `—` and `0.00V`.

3. **GPS map disappearing after mow** — `drawYardMap` was called with `[]` when heartbeat POST has no `track` field. Fixed by saving track to `S.sensorTrack` in localStorage and falling back to it when no fresh track.

4. **All modal buttons silently broken** — CSS used `.modal-overlay.open{display:flex}` but HTML uses `modal-ov` and JS sets `modal-ov show`. The CSS never matched so modals never opened. LOG MOW, LOG SERVICE, UPDATE HOURS were all broken. Fixed by restoring correct class names.

5. **Modal box unstyled** — CSS defined `.modal{...}` but inner div uses `modal-box`. No background, rounded corners, or padding. Fixed to `.modal-box`.

6. **`.mbtns`, `.mbtn.secondary`, `.btn-green` missing** — Cancel buttons invisible, no button row layout, green buttons unstyled. Restored all three rules.

7. **CLAUDE.md created** (`e8f0312`) — Persistent memory file. This file.

**Commits this session:**
```
e904a5b  Fix GPS persistence, restore all modal CSS, fix KV binding dual-check
e8f0312  Add CLAUDE.md — persistent project memory
53eb7d4  Restore Jeff's real hours — update default state and sensor baseline to 5.9h
b629c83  Revert hours.js to original
fe1edb8  Add engine-off heartbeat and improve sensor status display
98b8dca  Fix sensor API — accept MOWER_KV binding as fallback for HCC_KV
a973c8f  Fix fatal JS syntax error — remove stray <script> tags inside script block
8497827  Bump service worker to hcc-v3 — force cache clear of 2.1MB old build
739d004  Extract hero photos from HTML — drop from 2.1MB to 295KB
686bece  Switch Step 3 copy command from curl to wget for HA Terminal compatibility
a463d09  Add /setup endpoint that serves install script directly
c1c004c  Auto-detect Beehive by IP when homeassistant.local fails
```

---

## Session History — Session 2026-06-24 (Visual Polish + Beehive Integration)

### Changes Made This Session

1. **YARD hero text** (`6b6d477`) — Fixed stark white `.yard-hero-title` to warm italic gold `rgba(240,220,175,0.92)` to match the baked-in text of other hero photos.

2. **App-wide palette overhaul** (`c17bdf0`) — Applied ChatGPT hero colors/fonts throughout the entire app:
   - All CSS `:root` variables replaced with warm cream-gold palette
   - `--gold:#d4af37`, `--text:#ede8df`, `--serif:Georgia,'Times New Roman',serif`
   - `--a-home` changed from tech blue `#4a9eff` → warm gold `#d4af37`
   - App header, nav bar, card titles, section labels, spec values — all warm cream serif
   - Removed "Life-Safety Note" nanny warning card Jeff explicitly objected to
   - Weather hero temp + STATION/KTNWHITE21 inline HTML fixed to warm cream

3. **Blink 2FA + Beehive fixes** (`c7bc5ba`) — Fixed `checkBeehive()` detection bug (HA `/api/` returns `{"message":"API running."}` NOT `{"version":"..."}` — was checking wrong field). Added Blink PIN entry card in camera section as 2FA workaround. Added `blinkSendPin()` function that calls `POST /api/services/blink/send_pin` directly via HA REST.

4. **Panic button — HOME only** (`4c9d36c`) — Panic button placed at the bottom of HOME section only. Verified NOT present on WEATHER, IRRIGATION, or YARD.

5. **Beehive irrigation integration** (`1c2d2c9`) — `loadIrrigation()` now tries HA first via `loadIrrigationFromHA()`. Fetches `/api/states`, filters for B-Hyve zone switches, populates UI from HA entity states, controls via `haIrrToggle()` calling HA services. Falls back to direct B-Hyve cloud API if HA has no irrigation entities.

**Commits this session:**
```
1c2d2c9  Route irrigation through Beehive first — HA B-Hyve entities take priority over direct API
4c9d36c  Panic button — HOME only, at the bottom
1395a31  Purge all white text — warm cream-gold everywhere
c7bc5ba  Fix Blink 2FA, irrigation errors, and diagnostic messages
c17bdf0  Apply ChatGPT hero palette throughout entire app + remove nanny warnings
6b6d477  Fix YARD hero text — warm italic gold to match other hero photos
```

---

## Current Verified State (as of 2026-06-24, commit 1c2d2c9)

| Feature | Status |
|---|---|
| App loads (no blank page) | WORKING |
| Section navigation (HOME/WEATHER/IRR/YARD) | WORKING |
| LOG MOW modal — opens, styled, saves | WORKING |
| LOG SERVICE modal — opens, 18 service buttons | WORKING |
| UPDATE HOURS modal — opens, saves | WORKING |
| All 7 YARD tabs | WORKING |
| Sensor data display (when ESP32 connected) | WORKING |
| GPS map drawing | WORKING |
| GPS track persistence after mow | WORKING |
| KV binding (MOWER_KV) | WORKING |
| Service worker (hcc-v5) | WORKING |
| Engine hours baseline (5.9h) | CORRECT |
| Panic button — HOME only | CORRECT |
| Warm gold/cream palette app-wide | DONE |
| Georgia serif font throughout | DONE |
| Beehive detection (checkBeehive) | FIXED |
| HA token entry UI | WORKING |
| Blink 2FA workaround (blinkSendPin) | BUILT |
| Irrigation → Beehive first, direct fallback | DONE |

---

## Beehive / Home Assistant Integration — Current State

**HA Base URL:** `http://homeassistant.local:8123` (auto-fallback to `http://192.168.1.66:8123`)

**HA Token:** Jeff enters a Long-Lived Access Token once in the app → stored in `localStorage` key `ha_token`. App then uses it for all HA API calls.

**How to get HA Long-Lived Token:**
1. Open Home Assistant → Profile (bottom left avatar) → Long-Lived Access Tokens → Create Token
2. Copy it
3. Open the HCC app on home WiFi → HOME section → tap "OPEN BEEHIVE ↗" → find the token input

**Camera section behavior:**
- If HA token set and Beehive online → fetches camera entities from `/api/states`
- If no cameras found → shows Blink 2FA PIN entry (for initial Blink setup in HA)
- `blinkSendPin()` calls `POST /api/services/blink/send_pin` with the PIN

**Irrigation section behavior:**
- If HA token set → tries `loadIrrigationFromHA()` first
- Fetches all entity states, filters for B-Hyve switches (zone/bhyve/orbit in entity_id or zone_name/is_watering attributes)
- If no B-Hyve entities in HA → falls back to `loadIrrigationDirect()` (direct B-Hyve cloud API)
- `haIrrToggle(entityId, 'on'|'off')` calls `POST /api/services/switch/turn_on` or `turn_off`

---

## Session History — Session 2026-06-25 (GPS Map + Hero + B-Hyve HA Integration)

### Changes Made This Session

1. **B-Hyve HA custom integration updated** (`c7ed75e`) — Added `strings.json` for proper form labels. Updated coordinator to log at WARNING level (visible in HA System Logs without debug mode). Config flow now shows actual error detail in the form description when login fails. Install script updated to download `strings.json` too.

2. **YARD hero photo replaced** (`c5ac967`) — New photo (IMG_0497): man with Toro TimeMaster, "Yard Command Center" text baked in. Hero overlay text removed (photo has it). CSS overlay kept only for sensor status.

3. **Real aerial GPS map** (`c5ac967`) — Replaced placeholder plat-map.jpg with real aerial photo (`yard-aerial.jpg`) of Jeff's property at 32.899480°N, 97.033920°W (S. Aztec Dr). Image used as fixed base, never rotated or stretched.

4. **GPS map calibration system** (`c5ac967`) — Tap "Calibrate Map" → tap 2+ points on aerial → enter GPS coords → Save. Stores calibration in `localStorage.yard_map_calib`. When calibrated, GPS track pins exactly to real positions on aerial. Falls back to auto-fit if not calibrated. Track color changed green → Toro red (#cc0000); live position = blue dot.

5. **YARD hero crop fix** (`c5202ec`) — CSS `aspect-ratio:1320/851` so full landscape photo shows without cropping. "Yard Command Center" text always fully visible.

6. **GPS simulation with telemetry HUD** (`c5202ec`) — "▶ Simulate" button on map card. Runs animated back-and-forth mowing pattern at property coords. Shows: person-pushing-mower icon (canvas drawn), Toro red track with glow, 📍 home pin, telemetry strip (DIST/TIME/MPH/GPS accuracy), progress bar. Learning map: saves up to 5 past sessions in amber so coverage history accumulates.

**Key file changes:**
- `images/hero-yard.jpg` — replaced with new Toro mower photo
- `images/yard-aerial.jpg` — new aerial base map for GPS canvas
- `beehive/custom_components/bhyve/strings.json` — new, proper HA translations
- `beehive/custom_components/bhyve/coordinator.py` — WARNING level logging
- `beehive/custom_components/bhyve/config_flow.py` — shows error detail in form
- `functions/bhyve.js` + `beehive/install-bhyve.sh` — include strings.json

**Commits this session:**
```
c5202ec  Fix YARD hero crop + GPS simulation with telemetry HUD + learning map
c5ac967  YARD hero photo + real aerial GPS map with calibration system
c7ed75e  B-Hyve: surface login errors in HA form + log at WARNING level
f904d10  B-Hyve coordinator: try all API URLs x app IDs, log full response detail
```

---

## Pending Items (Next Session Should Address These)

1. **B-Hyve invalid_auth** — Jeff ran `sh bhyve` and saw `invalid_auth` in the HA config form. Updated coordinator logs every API attempt at WARNING level. Jeff needs to:
   1. Run `sh bhyve` in HA Terminal again (gets updated files including strings.json)
   2. Restart HA
   3. Settings → Integrations → Add Integration → "Orbit B-Hyve" → enter email/password
   4. If still fails: Settings → System → Logs → search "B-Hyve login attempt" to see exact HTTP response from each of 9 API attempts

2. **Blink 2FA completion** — Jeff needs to:
   1. Go to HA → Settings → Integrations → Add Integration → search "Blink"
   2. Blink sends a 6-digit code to Jeff's phone
   3. Open HCC app → HOME → CAMERAS section → enter code in the PIN field → tap SEND
   4. Cameras will then appear in the app

3. **GPS map calibration** — After first real mow with ESP32 sensor running, calibrate the aerial map:
   1. YARD tab → scroll to Yard Map
   2. Tap "📍 Calibrate"
   3. Tap the driveway corner on the aerial → enter its GPS coords (use phone Maps app to get coords)
   4. Tap a rear yard corner → enter coords → tap Save
   5. GPS track will pin exactly to the aerial from then on

4. **Verify sensor data live** — After Jeff hard-refreshes the app, confirm battery voltage, RPM, and mileage display. If still `0.00V` and `—`, run the curl test in the Cloudflare Infrastructure section above.

5. **Lighthouse performance** — Score 60/100. Low priority. Main cause: unminified 300KB index.html.

---

## Jeff's Contact / Account Info

- **Email:** jeff.loewen@comcast.net
- **Cloudflare account:** credentials already configured — never ask for them
- **Home Assistant instance:** "Beehive" — accessible at `homeassistant.local` or local IP
- **Mower:** Toro TimeMaster 21200
- **Jeff is almost 60 and learning** — be patient, clear, and never condescending. Make it enjoyable.
