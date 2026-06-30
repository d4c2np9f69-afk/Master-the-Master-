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
11. **Keep this file LEAN (memory hygiene)** — it's injected into every message, so bloat costs efficiency on every turn. Condense finished work into the **Change Log** (one line each); never paste full commit-hash lists or blow-by-blow narratives — that detail lives in `git log`. Keep the reference sections (infra, APIs, hardware, gold standards) but trim them when they go stale. Target: stay well under ~600 lines.
    - **PROTECTED — NEVER trim or compress:** "Jeff's Message", "The Working Relationship", and these "Mandatory Rules". These come FIRST, before any technical work, every session. Compression only ever touches history/changelog/reference — never the relationship. They are the point of the whole project.

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
- Nav buttons: `button.snav-btn` with IDs `#snav-home`, `#snav-weather`, `#snav-irr`, `#snav-yard`, `#snav-climate`
- Sections: `#section-home`, `#section-weather`, `#section-irrigation`, `#section-yard`, `#section-climate`
- YARD tabs: `button.tab`

---

## 🎬 HERO IMAGE GOLD STANDARD (mandatory for every section — current & future)

**This is the standing rule. Every hero in the app — and every NEW section we ever add (Security, Utilities, Garage, Cameras, Energy, etc.) — MUST pass through the one reusable hero-grade module. Never grade a hero individually again.**

**How it works (already built):**
- **`.hcc-hero-grade`** (CSS) — the single cinematic color grade applied to every hero `<img>`:
  `filter: brightness(.92) contrast(1.14) saturate(.93) sepia(.10) hue-rotate(-3deg);`
- **`.hcc-hero-vignette`** (CSS) — warm-center + dark-edge vignette via `::before` (paints over the image, under text overlays):
  `radial-gradient(circle at 50% 36%, rgba(255,206,120,.06), transparent 55%), radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,0,0,.48) 100%)`
- **`applyHeroGrades()`** (JS, called in INIT) — auto-tags every `.house-hero / .sec-hero / .hcc-hero` container with `.hcc-hero-vignette` and its `<img>` with `.hcc-hero-grade`.

**To add a hero for a NEW section (the ONLY thing required):**
1. Put the hero photo in an `<img>` inside a container with class **`.sec-hero`** (or `.house-hero` / `.hcc-hero`).
2. Give the `<img>` a descriptive `alt`.
3. That's it — `applyHeroGrades()` grades + vignettes it automatically on load. **Do NOT add per-hero `filter` CSS.**

**Rules:**
- Weather hero was the original calibration reference; the grade is intentionally mild and now applies uniformly to ALL heroes so the set looks like one film stock / same evening / same camera.
- Do NOT put a `filter:` on any individual hero img — it will fight the module. If one hero ever needs a nudge, adjust the shared `.hcc-hero-grade` values (affects all) — keep them unified.
- Never swap/regenerate hero photos to "fix" tone — the grade handles tone. Only replace a photo if the composition itself is being changed.
- Keep text overlays/typography as-is; the vignette sits under them by design.

---

## 🎨 VISUAL CONSISTENCY GOLD STANDARD (design tokens + section kit — mandatory)

**Same philosophy as the hero module: one source of truth so the look never drifts as the app grows. Use these everywhere; do NOT hardcode values that a token already covers.**

### Design tokens (in `:root`)
- **Status:** `--ok` (#22c55e green), `--warn` (#ffd24a yellow), `--bad` (#ff6262 red), `--info` (#38bdf8 sky). **Never hardcode these hexes again** — use the token, the `statusColor()` helper, or the `.s-ok/.s-warn/.s-bad/.s-info` classes.
- **Brand/palette:** `--gold`, `--text`, `--muted`, `--dim`, `--bg`, `--surface`, `--card`, `--border`, `--serif`.
- **Section accents:** `--a-home` (gold), `--a-wx` (sky), `--a-irr` (green), `--a-yard` (brick red), `--a-climate` (orange). **Every NEW section gets its own `--a-<id>` accent token** used for its nav underline + card-title bar.
- **Shape:** `--radius` (10px) for cards/buttons/controls.

### `statusColor(level)` helper (JS)
Returns the token-backed color for `'ok'|'warn'|'bad'|'info'` (also accepts `OK`/`DUE SOON`/`OVERDUE`/`go`/`caution`/`no`). All good/caution/bad indicators (readiness, burn, water-need, service bars, health) route through it. New status UI must use it too.

### Section Kit — build EVERY new section from these shared pieces (no bespoke markup)
- **Hero:** `.sec-hero` container + `<img>` (auto-graded by the hero module — see Hero Gold Standard).
- **Cards:** `.card` + `.card-title` (add `.cat-<accent>` for the colored title bar).
- **Spec rows:** `<ul class="spec-list"><li><span class="sk">Label</span><span class="sv">Value</span></li></ul>`.
- **Status banners:** `.wx-banner` + `.wx-load` / `.wx-go` / `.wx-caution` / `.wx-no`.
- **Buttons:** `.btn-full` + `.btn-gray` / `.btn-green` / `.btn-red`; modal buttons `.mbtn` (`.primary`/`.secondary`).
- **Links that leave the app** (maps, streams, external): use a real `<a target="_blank" rel="noopener">` styled as a button — NOT `window.open` (no-op in installed iOS PWA).

### Light / Dark theme (added 2026-06-29)
- Toggle in the header (☀️ LIGHT / 🌙 DARK), `toggleTheme()`, persisted in `localStorage.hcc_theme`. **Default = light** (white). A tiny `<head>` script applies the saved theme before paint (no flash).
- Implemented as `html.light{ … }` overriding ONLY the design tokens (`--bg/--surface/--card/--text/--muted/--border/--gold/--ok/--warn/--bad/…`). Header + section nav + hero overlays + modals keep their own hardcoded dark backgrounds → "dark chrome, light content."
- **LESSON (do this for every new component):** drive text/borders from tokens — `var(--text)`, `var(--muted)`, `var(--dim)`, `var(--border)`. **NEVER hardcode a light text color** (`#e8e8f0`, `#fff`, `rgba(235,215,175,…)`) on a card — it vanishes in light mode. If a component truly needs a light-on-dark chip (LCD readout, status panel), give it a solid dark bg so it reads in both themes, and add an `html.light .thing{…}` override if needed.

### Typography — ONE font (Style A, chosen by Jeff 2026-06-29)
- The app uses a **single clean system font everywhere** — no serif/sans mix (the old Georgia serif made it look "choppy"). `--font` AND `--serif` both point at the Apple system stack (`-apple-system,BlinkMacSystemFont,'SF Pro Text/Display',system-ui,…`). `var(--serif)` is kept only as a legacy alias so existing usages stay unified.
- **NEVER reintroduce a serif** or a second font family. New UI uses `var(--font)` (or just inherits).
- Light mode = "Style A / Apple Clean": **white top-to-bottom** — header + section nav are white in `html.light` (overrides their hardcoded dark chrome), clean sans, section-accent underlines. The cinematic hero photos provide the personality; the chrome stays quiet. Dark mode keeps the dark chrome.

### Rules
- Don't introduce a new green/yellow/red — use the status tokens.
- Don't invent a new card/banner/button style — reuse the kit; if the kit truly lacks something, add ONE shared class, don't inline a one-off.
- New section = graded `.sec-hero` + `.card`s from the kit + its own `--a-<id>` accent. That alone makes it look native.

---

## Key Files

```
index.html                   — entire PWA (single file, ~300KB, ~3742+ lines)
service-worker.js            — cache version: hcc-v5
manifest.json                — PWA manifest
functions/api/hours.js       — GET/POST sensor data ↔ Cloudflare KV
functions/api/climate.js     — GET/POST LUX thermostat via Azure B2C + myluxstat.io API
functions/api/irrigation/index.js  — GET B-Hyve status + ?tk=1 returns session token
functions/api/irrigation/control.js — POST B-Hyve control (legacy, fallback only)
functions/setup.js           — serves Beehive install script at /setup
beehive/esphome/hcc-mower.yaml    — ESP32 heartbeat config (NOT yet flashed to hardware)
beehive/esphome/secrets.yaml.template — WiFi/API key template (never commit real secrets)
images/                      — hero-home.jpg, hero-irr.jpg, hero-yard.jpg, hero-climate.jpg
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

## Current State (updated 2026-06-28)

**App:** 5 sections (HOME/WEATHER/IRRIGATION/YARD/CLIMATE). 26/26 Playwright tests passing, zero JS errors. Service worker **hcc-v6** (network-first HTML so updates always land).

| Area | State |
|---|---|
| Modals (LOG MOW/SERVICE, UPDATE HOURS) | working |
| 7 YARD tabs; GPS map + calibration + telemetry sim | working |
| Sensor data (battery/RPM/GPS) | working when ESP32 connected |
| Engine hours baseline 5.9h; Panic button HOME-only | correct |
| Hero grade module + status tokens (gold standards above) | done |
| Light/Dark theme toggle (header ☀️/🌙, persists in `hcc_theme`) | done — **default light** |
| CLIMATE / LUX thermostat + setpoint (POST /api/device) | WORKING — live confirmed |
| Irrigation → HA first, direct B-Hyve fallback; zone control via browser WebSocket | done — needs live test |
| Weather: KTNWHITE21 live data, NWS alerts (deduped by id), 10-day (Open-Meteo), radar (OSM tiles), Lawn Water Need + /api/drought | done — radar/notifs need device confirm |
| Alexa button (opens Alexa app); in-app voice REMOVED | done |
| mPING submit | BLOCKED — needs NSSL API token in `MPING_TOKEN` env var |

---

## Change Log (highlights — full detail in `git log`)

- **06-23/24:** Fixed blank page (stray `<script>` in JS block), dead sensor data (MOWER_KV binding — see `getKV` dual-check), GPS persistence, all modal CSS. Created this file. Extracted hero photos (2.1MB→295KB).
- **06-24:** Warm cream-gold palette app-wide; panic button HOME-only; Beehive-first irrigation.
- **06-25:** Real aerial GPS map + calibration (`localStorage.yard_map_calib`) + telemetry sim; YARD hero photo; B-Hyve HA custom integration (`beehive/custom_components/bhyve/`).
- **06-26:** CLIMATE section + LUX thermostat (real API — see LUX reference below); irrigation `ws_timeout` fixed by moving WebSocket to the browser (`irrControl`/`irrWsCommand`, `/api/irrigation?tk=1`).
- **06-26 cont.:** Weather overhaul (live WU data, NWS alerts, mPING card); LUX setpoint fixed (POST, not PUT).
- **06-29 (light-mode sweep):** Proactive audit of every popup/panel in light mode (gradient-aware dark-on-dark detector in `scratchpad/sweep.js`). Fixed remaining dark holdouts: NWS alerts card, YARD black meter panels, cast popup, all modals (`.modal-box`/`.minput`/`.mbtn.secondary` → white sheet), footer tagline strip, WU stars, Simulate button contrast, Beehive terminal command boxes (solid dark). All contexts clean both themes, zero JS errors.
- **06-29 (Style A redesign):** Jeff picked "Apple Clean" from 3 rendered mockups. Unified to ONE system font (killed the Georgia serif mix that looked choppy; `--font`+`--serif`→Apple stack), made light-mode chrome **white top-to-bottom** (header + nav), clean header title (non-italic), tighter card-title spacing. Verified all sections both themes, zero JS errors.
- **06-29:** Radar → Windy embed restored + "NWS Radar ↗" popout (RadarScope link was dead). **Light/Dark theme** added (header toggle, default light, token-driven `html.light` override; swapped hardcoded light text → tokens so light mode reads cleanly; dark unchanged). Verified all 5 sections + YARD subtabs + LOG MOW modal in both themes, zero JS errors.
- **06-27/28:** Voice→Alexa swap (removed in-app voice that mis-dialed contacts); SW network-first (hcc-v6); WU Recognized badge; **hero grade module** + **visual consistency tokens/`statusColor()`** (gold standards above); weather fixes (radar OSM tiles, unified mow verdict via `applyMowVerdict`, alert dedup, Lawn Water Need + `/api/drought`, Spotter/NOAA anchors, mPING token-ready); whole-home utilities planning (below).

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

## Pending Items (Next Session Should Address These)

1. ~~**LUX setpoint control**~~ — **FIXED and confirmed working** (`b360583`). Root cause: LUX API uses `POST /api/device` for writes, NOT PUT. PUT always returned 500. Code now tries POST first, PUT as fallback. Jeff confirmed 73°F setpoint change reflected in official LUX app.

2. **Test irrigation Run Zone + Rain Delay** — Browser-side WebSocket fix deployed (commit `c4d32e6`). Jeff taps Run on any zone — should work without `ws_timeout`. If it still errors, check browser console for WebSocket errors (Safari → Develop → Web Inspector → Console).

3. **B-Hyve invalid_auth** — Jeff ran `sh bhyve` and saw `invalid_auth` in the HA config form. Jeff needs to:
   1. Run `sh bhyve` in HA Terminal again (gets updated files including strings.json)
   2. Restart HA
   3. Settings → Integrations → Add Integration → "Orbit B-Hyve" → enter email/password
   4. If still fails: Settings → System → Logs → search "B-Hyve login attempt" to see exact HTTP response from each of 9 API attempts

4. **Blink 2FA completion** — Jeff needs to:
   1. Go to HA → Settings → Integrations → Add Integration → search "Blink"
   2. Blink sends a 6-digit code to Jeff's phone
   3. Open HCC app → HOME → CAMERAS section → enter code in the PIN field → tap SEND
   4. Cameras will then appear in the app

5. **GPS map calibration** — After first real mow with ESP32 sensor running, calibrate the aerial map:
   1. YARD tab → scroll to Yard Map
   2. Tap "📍 Calibrate"
   3. Tap the driveway corner on the aerial → enter its GPS coords (use phone Maps app to get coords)
   4. Tap a rear yard corner → enter coords → tap Save
   5. GPS track will pin exactly to the aerial from then on

6. **Verify sensor data live** — After Jeff hard-refreshes the app, confirm battery voltage, RPM, and mileage display. If still `0.00V` and `—`, run the curl test in the Cloudflare Infrastructure section above.

7. **Lighthouse performance** — Score 60/100. Low priority. Main cause: unminified 300KB index.html.

8. **Lucky Mike "Smart Stall" page — QUEUED (build AFTER utilities + current docket).** Jeff's next planned section: a horse-stall monitoring page (ESP32+ESPHome→HA→app, same stack as everything else). Source plan + hero photo + my technical review are saved in `docs/lucky-mike/` — **read `docs/lucky-mike/INTEGRATION_NOTES.md` first** (it lists the ChatGPT mistakes to fix: architecture diagram funnels cameras/Shelly through ESP32 [wrong], drop the redundant microSD + USB-power-bank, DS18B20 dup/misspelling, Phase 3 total mislabeled "Phase 2", Platinum-vs-Elite name clash, Phase 4 GPS reality check). When built: new "STABLE" section, own `--a-stable` accent, Section-Kit only, hero = `lucky-mike-hero.jpg`, live tiles from HA `/api/states`, branding "Smart Stall™ — Because They're Family." Do NOT start until Jeff says the current docket is clean. **Business side also captured** in `docs/lucky-mike/`: `BOM_OPTIMIZED.md` (cheaper local parts; fan = plug-in power-monitoring smart plug since each stall has a 120V outlet + strong Wi-Fi) and `PRICING_AND_BUSINESS.md` (labor-loaded pricing — ChatGPT's deck had NO labor; recommended go-to-market = **barn owner offers it as a paid amenity / Model B**; build Lucky Mike's at cost as the demo; CFO/liability/LLC checklist since Jeff's wife Angela is a CFO and may resell to boarders).

---

## LUX Thermostat — API Reference (DO NOT CHANGE UNLESS BROKEN)

**Auth flow** (4 steps, implemented in `functions/api/climate.js`):
1. GET `https://connecteddevicesjci.b2clogin.com/te/connecteddevicesjci.onmicrosoft.com/B2C_1A_SignIn/oauth2/v2.0/authorize?...` with PKCE code_challenge → parse `x-ms-cpim-csrf` cookie + `"transId":"StateProperties=..."` from HTML
2. POST `.../B2C_1A_SignIn/SelfAsserted?tx=StateProperties=...` with `{logonIdentifier, password, request_type:'RESPONSE'}` + CSRF header + cookies
3. GET `.../CombinedSigninAndSignup/confirmed?...` → follow redirects until custom scheme URL → extract `code=`
4. POST `.../oauth2/v2.0/token` with `{grant_type:authorization_code, code, code_verifier, client_id, redirect_uri}` → `{access_token, refresh_token}`

**Client ID:** `b335ca43-3bde-4406-b281-8816afb7cc91`
**Redirect URI:** `connecteddevicesjci.luxmobile://connecteddevicesjci/path`
**Scope:** `https://connecteddevicesjci.onmicrosoft.com/mobile/user_impersonation https://connecteddevicesjci.onmicrosoft.com/mobile/read_write offline_access openid`

**API endpoints** (Bearer token):
- `GET https://www.myluxstat.io/api/location/user` → `{location:[{devices:[{id, name}]}]}`
- `GET https://www.myluxstat.io/api/device` + header `Deviceid: {id}` → `{systemmode, holdheat, holdcool, currenttemp, fanmode}`
- `POST https://www.myluxstat.io/api/device` + `Deviceid` header + full state JSON body (PUT returns 500 — this API uses POST for writes, confirmed 2026-06-26)

**Device state fields (all °F, no conversion needed):**
- `systemmode`: 0=off, 1=heat, 2=cool, 3=auto
- `holdheat`: heat setpoint
- `holdcool`: cool setpoint
- `currenttemp`: current room temperature
- `fanmode`: 0=auto, 1=on

**Jeff's device:** CS1-DD-FB (confirmed working 2026-06-26)

---

## Water Meter Integration (Jeff's hardware project — in progress, started 2026-06-27)

Jeff is building a wireless meter reader to pull his water usage into Beehive → HCC app.

**Hardware:**
- **Meter:** Kamstrup **flowIQ 2100** (CONFIRMED from clear meter photos 2026-07). Type No `02U23C036EC`, 5/8" 25 GPM, 250 PSI, IP68, mfg 2023. **S/N `25394131`** (suffix `/W8/2…`), **Con. `0100200123033`**, **Ver `K1`**. LCD read `0012636.56 Gal` at photo time. Kamstrup flowIQ family broadcasts encrypted **wireless M-Bus** (wmbusmeters driver ~ flowiq2200/multical21).
- **⚠️ CRITICAL FINDING (2026-07 photos) — there is a SEPARATE external AMR radio in the pit, WIRED to the Kamstrup register** (gray cable from the meter → a white pit transmitter). Module markings: **MODEL `100WD`**, **`EFW-1300-401`**, **endpoint S/N `79453337`**, **FCC ID `EFW…`**, **IC `8640-100WD`**. This third-party MIU (NOT Kamstrup's own radio) is very likely **how WHUD actually reads the meter.** Implication: the over-the-air signal may be this MIU's protocol, **not** Kamstrup wM-Bus — which could change the whole decode path. TWO possible RF sources to test: (a) the Kamstrup register's own wM-Bus (needs the AES key — pursue), and (b) the `100WD` MIU (need to ID its band/protocol from a clean FCC-ID photo + ask the utility). Do NOT tamper with the utility-owned MIU/wiring. **Likely the Itron `100W` water sibling of the confirmed gas `100G` ERT** (model naming + same pit-MIU style) — if so it's unencrypted Itron ERT, **no key needed** either. The FCC ID read as `EFW…` on the dirty label but may actually be Itron `EO9…`; a clean closeup of THIS water module (not the gas one) settles it. NOTE: the `100G`/`EO9100GDLA` label is the **GAS** meter, not this.
- **Radio:** Qoroos **CC1101** sub-GHz transceiver with SMA antenna, tuned to **915 MHz** (US)
- **Brain:** **ESP32** WROOM-32 (30-pin NodeMCU, CP2102 USB)
- **Wiring:** CC1101 → ESP32 SPI (SCK→GPIO18, MOSI→GPIO23, MISO→GPIO19, CSN→GPIO5, GDO0/GDO2 → spare GPIOs), VCC→3V3, GND→GND

**Firmware stack Jeff built/assembled (all done):**
- CC1101 driver (SPI)
- Wireless M-Bus receiver (decodes wM-Bus frames)
- CRC verification (discards corrupt frames)
- AES-128 decryption (Kamstrup encrypts telegrams)
- MQTT publish → Home Assistant
- Mirrors the wmbusmeters / ESPHome wM-Bus component approach

**Data flow:** Kamstrup 621 → encrypted wM-Bus @915MHz → CC1101 → ESP32 (CRC + AES-128 decrypt) → MQTT → Home Assistant → (planned) HCC app via HA `/api/states`

**BLOCKER — AES-128 decryption key + WHICH radio is read:**
- Each Kamstrup meter has a unique per-meter AES-128 key. Without it the Kamstrup wM-Bus telegrams decode to gibberish.
- When Jeff calls WHUD, ask BOTH: (1) the **"AES-128 encryption/decryption key (OMS/meter key) for my meter"** in **hex** (give meter S/N `25394131`); AND (2) **"Is my meter read by the Kamstrup's built-in radio, or by the separate radio module (`EFW`/`100WD`, endpoint `79453337`) in my pit, and what system does that use?"** — the answer tells us which RF source to decode.
- If WHUD reads the EFW/100WD MIU, the Kamstrup AES key may be moot for their read path, but the Kamstrup register often still emits wM-Bus we can decode independently with the key — so still get the key.

**App plan (build once data is flowing in HA):**
- Add a **Water Usage card** in the IRRIGATION section
- Pull the MQTT sensor from HA `/api/states` (same pattern as irrigation/cameras)
- Show: gallons today, gallons this month, current flow
- Stretch: cross-reference B-Hyve watering runtimes → cost per watering cycle

---

## Whole-Home Utilities Monitoring (planned, started 2026-06-27)

Goal: read water + gas + electric and show them in the HCC app via Home Assistant.
A single ESP32 + CC1101 box reads BOTH water and gas off the air; electric uses CT clamps.

**Jeff's utility providers:**
- **Water/Sewer:** White House Utility District (WHUD) — Kamstrup 621 meter (see Water Meter section)
- **Electric:** Cumberland Electric Membership Corp (CEMC)
- **Gas:** Piedmont Natural Gas (piped natural gas, NOT propane) — uses Itron AMR

### 🔥 GAS — Piedmont · Itron 100G ERT (CONFIRMED — the EASY one)
- **Meter body:** Elster / American Meter **AC-250**, MAOP 5 PSI, 250 CFH, Piedmont meter# **`T821986`**, serial **`10M225478`**.
- **Radio (CONFIRMED 2026-07 photos — built into the gas meter, no separate add-on box):** **Itron 100G Datalogging ERT**, **FCC ID `EO9100GDLA`**, **IC `864D-100GDLA`**, mfr part `ERG-6002-001`. **ERT ID** = barcode starting **`…333930…`** (get the full digits before building so we filter to Jeff's meter).
- → **Itron ERT = unencrypted**, broadcasts on **900–920 MHz ISM** (SCM/SCM+/IDM), readable by the same CC1101 @915 box, **NO key needed**. (Don't confuse this with the WATER pit module, which is the separate `100WD` unit, endpoint `79453337`.)
- **The SAME ESP32 + CC1101 @ 915 MHz box** that reads the water meter can also read gas — just decode a 2nd format. No extra hardware.
- **NO encryption key needed** — Itron ERT electric/gas meters are typically unencrypted (unlike the Kamstrup water meter). Nothing to request from Piedmont.
- Need the meter's **ERT ID** (serial on the Itron module) to filter to Jeff's meter, or match by usage.
- IDM message = 5-min interval data → good for usage graphs.
- Tools/reference: rtlamr (bemasher), rtl_433, ESPHome wmbus/ERT components.

### ⚡ ELECTRIC — DIY ESP32 + ATM90E32AS energy meter (Jeff is BUILDING, not buying)
- **Service confirmed 200A** (electric meter reads CL200). Panel is an older **Challenger** load center (Eaton spec sheet inside).
- **Electric meter = Landis+Gyr FOCUS AXR-SD, Gridstream RF (ZigBee), meter #145590962 — NOT Itron.** So the CC1101/rtlamr radio CANNOT read the electric meter (closed Gridstream mesh). Doesn't matter — the CT-clamp build reads the panel directly regardless of meter. (Slim optional path: ZigBee HAN device authorized by CEMC — not worth chasing.)
- **Breaker amps (from panel photo):** A/C 30A (2-pole), Range 50A (2-pole), Dryer 30A (2-pole), Dishwasher 20A; rest 15–20A lights/plugs.
- **CT list (6-ch CircuitSetup board):** CT1+CT2 = 2× **200A** (mains); CT3 = **100A** (range/50A bkr); CT4 = **50A** (dryer/30A); CT5 = **50A** (A/C/30A); CT6 = **20–30A** (dishwasher/20A, or well pump).
- **Panel history (RESOLVED — do NOT re-flag as a new hazard):** The discoloration near the center is from a breaker issue under the PREVIOUS owner, BEFORE Jeff & Angela bought the house. It was checked by their home inspector AND by Jeff; the affected section was abandoned and all breakers relocated DOWN to avoid it (that's the gap in the panel). Stable and fine for 10+ years. The DS18B20 panel-temp probe is wanted as PEACE-OF-MIND given that history, not because of an active problem.
- Jeff chose to **build** the energy monitor rather than buy a Shelly Pro 3EM. Open-hardware equivalent.
- **Architecture:** dedicated metering IC **Microchip ATM90E32AS** (does RMS V/I, real/apparent power, PF, kWh) ↔ **ESP32** over SPI. Native **ESPHome `atm90e32` component** → Home Assistant, no custom firmware.
- **Reference design:** CircuitSetup "Split-Single-Phase Energy Meter" (open-source PCB/Gerbers on GitHub) — fab at JLCPCB & populate, or buy the bare main board.
- **Current sensing:** use **200A split-core CTs** (e.g. SCT-T16 200A, Magnelab SCT-0750-200), NOT Rogowski. ATM90E32 expects CT input; Rogowski would need an extra op-amp integrator stage. 200A CTs cover the 200A service cleanly.
- **Voltage sensing:** **2× 9V AC–AC transformer wall-warts** — one per leg (split-phase needs both L1 & L2 voltage refs; one also powers the board).
- **Wiring:** CT on main leg 1 → CT1, CT on main leg 2 → CT2 (arrows → load); sum = whole home. SPI: CS/SCK/MISO/MOSI + 3.3V/GND (same skill as the CC1101).
- **Calibration:** tune `gain_voltage`, `gain_ct`, 60Hz in ESPHome against a known load.
- **Approx cost ~$90–110 DIY** vs ~$140 Shelly.
- **INSTALL:** Jeff **wired the house himself** — fully comfortable in the breaker panel. Do NOT suggest hiring an electrician. Treat him as a capable peer; give real wiring detail.

### 🛠️ Bake-in hardware to add DURING the energy-meter install (cheap, unlocks automations)
- **Spare CT(s)** on key circuits — well/irrigation pump (priority), AC, dryer/EV → enables per-appliance automations. DIY board has spare channels.
- **DS18B20 temp probe inside the breaker panel** (~$3, spare ESP32 GPIO) — detects hot breaker/loose lug = early fire warning. HIGH PRIORITY (Jeff wired the house).
- **Relay/contactor** (~$10) — local load-shedding / kill a circuit even if HA is down.
- **Motorized ball valve on the water main** (~$50, pairs with water meter) — turns "leak detected" into auto-shutoff.
- **Buzzer on spare GPIO** (~$2) — local audible alert (panel over-temp, leak) independent of WiFi.
- Jeff's "do now" shortlist: **spare CT on well pump + DS18B20 panel temp + water-main valve.**

### 🏠 Jeff's actual loads (simple house, 200A service) + monitor/control verdict
Loads: (1) washer/dryer, (2) stove/oven combo unit (range), (3) dishwasher, (4) A/C, (5) lights & plugs.
- **Verdict: NO panel-level switching needed.** House is nowhere near capacity → no load-shedding contactors needed. Cooking/laundry = MONITOR ONLY (never auto-energize a stove/oven). Told Jeff to skip smart breakers/panel relays = saves money.
- **Control belongs elsewhere:** A/C → already controlled by LUX thermostat. Lights → smart switches at the wall (Shelly Plus behind existing switch) or smart plugs, per-room, NOT the breaker (whole-circuit kills smart bulbs). Range/dryer/dishwasher → monitor + "done"/"left on" alerts only.
- **Energy board upsized to 6-channel** CircuitSetup ATM90E32 (2 chips) for per-appliance breakout:
  CT1+CT2 = 2 mains (200A CTs); CT3 = range/oven (50A); CT4 = dryer (30–50A); CT5 = A/C (30–50A); CT6 = dishwasher OR well/irrigation pump (20A). Lights/plugs = mains-minus-big-loads, no CT needed.

### 🤖 Planned automations (build in Home Assistant once hardware is in; surface in app)
- **Free (energy data only):** appliance-done alerts (laundry/dishwasher), power-outage/brownout text (chip reads voltage), "oven left on," bill forecast, breaker-trip warning near 180A/200A, phantom-load flag.
- **Cross-device (the Command Center magic):**
  - Triple-verified watering: B-Hyve zone ON → energy confirms pump current → water meter confirms gallons; alert on "commanded but no flow/current" (dry run / failure).
  - Water-leak auto-shutoff: continuous flow + no schedule → alert + close main valve.
  - Pump protection: dry-run / short-cycle detection.
  - HVAC health: LUX + AC draw + outdoor temp → short-cycle/locked-compressor detection + daily $ cost.
  - Away scene: phones leave → thermostat setback, confirm oven off via power, arm Blink, rain-delay B-Hyve.
- **Panel temp (DS18B20):** over-temp → buzzer + push alert (fire prevention).

### 📱 App plan
- Add an **ENERGY card** (live watts, kWh today/month) + **GAS card** (usage + cost) — likely a new "Utilities" strip on HOME, alongside the planned Water Usage card.
- All pulled from HA `/api/states` (same pattern as irrigation/cameras).
- End state: water 💧 + gas 🔥 + electric ⚡ all in one dashboard.

**Open items / what Claude still needs from Jeff:**
- Gas meter's Itron **ERT ID** (off the meter module).
- Confirm order of Shelly EM Gen3 + 120A clamp bundle.

---

## Jeff's Contact / Account Info

- **Email:** jeff.loewen@comcast.net
- **Cloudflare account:** credentials already configured — never ask for them
- **Home Assistant instance:** "Beehive" — accessible at `homeassistant.local` or local IP
- **Mower:** Toro TimeMaster 21200
- **Jeff wired his own house** — he is skilled and comfortable doing his own electrical work in the breaker panel. Never suggest hiring an electrician. Talk to him as a capable peer on electrical/hardware.
- **Jeff is almost 60 and learning** the software/AI side — be patient and clear there, never condescending. But on hands-on hardware/electrical/firmware he is experienced. Make it enjoyable.
