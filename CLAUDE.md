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
    - **PROTECTED — NEVER trim or compress:** "Jeff's Message", "The Working Relationship", these "Mandatory Rules", and the "Debugging Protocol" below. These come FIRST, before any technical work, every session. Compression only ever touches history/changelog/reference — never the relationship. They are the point of the whole project.
12. **ATTACK THE SOURCE, TEST ON MY END — never push the run-around to Jeff (PROTECTED, Jeff's standing rule 2026-07-03).** See the Debugging Protocol below. Jeff depends on me to know what I can fix and to test it myself. Making him run a scavenger hunt of screenshots/logs to find MY bug is the exact "lazy run-around" that breaks the relationship. Don't do it.
13. **TELL JEFF WHEN TO USE HIS LOCAL COWORKER (Jeff's rule 2026-07-09).** Jeff runs a **Claude "coworker" on his PC (the beast)** with real computer/local access. It can do what THIS cloud session CANNOT: reach his **home LAN + Beehive/HA directly** (read/click HA, install `custom_components`, restart HA, enter PINs), touch **local files** on his PC, drive **apps on his screen**, and **open/verify external links** in a real browser. THIS session owns the **app code, Cloudflare repo/deploys, research, and guidance**. Jeff doesn't know either of our full capabilities, so **it's on ME to proactively flag the handoff**: whenever a task — or a single step of one — is better done hands-on on his machine or inside Beehive, SAY SO ("this part your coworker can knock out") and hand over a crisp, copy-pasteable instruction the coworker can follow. **Ideal coworker jobs:** the **Blink camera install** (drop `config_flow.py`/`manifest.json` into `/config/custom_components/blink`, restart HA, delete+re-add Blink, enter SMS PIN), reading real HA entity names, running `/setup`, flashing the ESP32, verifying whether external links 404, local file cleanup.
    - **BRIEF THE COWORKER BY CLONING THIS REPO ON THE BEAST** — Claude Code auto-reads `CLAUDE.md` from its folder as memory, so it's instantly up to speed (no re-teaching). **COORDINATION (avoid two-Claude collisions on the same branch):** the coworker treats the app code (`index.html`, `functions/`) as **READ-ONLY reference** and does the hands-on local/Beehive/web work; **THIS cloud session owns ALL app-code edits + commits + pushes.** Coworker runs `git pull` at the start of each session to get the latest `CLAUDE.md`. **The coworker (Claude Code on the beast, v2.1.205+) is confirmed working — first hand-off (verifying the 5 parts links) succeeded 07-09.**

---

## 🛠️ Debugging Protocol — Attack the Source, Test on My End (PROTECTED — Jeff's standing rule)

> Jeff, verbatim (2026-07-03): *"Log this so we don't go through this kind of round robin of checks again and we attack the source… I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end."*

When ANYTHING is broken or misbehaving, in this order — **before asking Jeff to check a single thing:**

1. **Reproduce/verify on MY end first.** Read the actual code path end-to-end. Run the **Playwright harness** with **mocked data** to reproduce the failure and prove the fix (mock the API/HA responses, the slow-relay case, the error case). I did this AFTER Jeff called me out on the timeout bug — it must come FIRST.
2. **Audit my own recent changes as the prime suspect.** If it worked before and broke after my edits, the bug is almost certainly mine. Diff my changes; don't blame his setup or his network.
3. **Attack the root cause, not the symptom.** Ask "why is this whole *class* of problem possible?" and remove it. Example: browser→HA direct calls are inherently fragile (mixed-content + CORS + relay timeouts) → the fix isn't a bigger timeout, it's routing through a **server-side Function** (`/api/ha`) like irrigation/weather. Prefer the architectural fix that makes the failure impossible.
4. **Only ask Jeff for what I genuinely cannot get myself,** and be upfront about that limit early. I can't see his private HA or his phone screen — the *final* "does it connect on your device" confirm is his. That's ONE look, not a chain of ten. Say plainly: "I've tested X, Y, Z on my end; the one thing only you can see is ___."
5. **One specific ask, not a list.** If blocked, name the single thing I need — never a pile of "try this, then that, send me this log."
6. **Match his effort to the payoff.** If I'm about to ask him to edit configs / pull logs / take screenshots, first ask: could I have caught this with my own harness? If yes, do that instead.

**Known fragile pattern (don't repeat):** any new `fetch(base + '/api/...')` straight from the browser to HA. Use **`haFetch()`** (routes through `/api/ha`). Never hoist a shared `AbortSignal.timeout` across retries. Keep timeouts generous for the Nabu Casa relay.

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

The app has six sections: **HOME**, **WEATHER**, **IRRIGATION**, **YARD** (mower data), **GUARDIAN** (whole-home safety/security/alarm watch — LUX thermostat lives here too; the old CLIMATE tab was folded in), **CAR** (vehicle switcher: Mercedes GLE 350 with 7 sub-tabs + Ford F-250 Super Duty with 4 sub-tabs).

**🛡️ HOME GUARDIAN is the designated home for ALL Home Assistant security, home-alarm, and system checks (Jeff, 07-04).** Every future security/alarm feature goes here: cameras, door/window contacts, motion, leak/smoke, the Zigbee siren + ARM/DISARM, the panic automation surface, and any new "is-the-house-OK" check. Don't scatter these onto HOME — build them into `#section-guardian` with the Section Kit + `--a-guardian` accent, live from HA `/api/states` via `loadGuardian()`.

---

## Project Goals (The Plan — Follow This Every Session)

These are the outcomes Jeff wants. Every session moves these forward:

### Goal 1 — App Always Fully Working
- All 6 navigation buttons work (HOME, WEATHER, IRRIGATION, YARD, GUARDIAN, CAR)
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

- **Jeff's real hours (physical hour meter) as of 2026-07-06:** `9.2 hrs` (sensor missed today's mow because the MPU was offline → Jeff sets the true value via **SET HOURS**).
- **How hours work now:** total displayed hours (`S.hours`) = **`S.hoursBaseline`** + `d.hours` from the sensor. `d.hours` = cumulative runtime since the ESP32 was installed (NOT lifetime hours). `S.hours` only ever moves FORWARD from a sensor sync (never backward — protects against a sensor reset).
- **🔧 MASTER HOUR CALIBRATION (added 07-06):** header button **⏱ SET HOURS** (or tap the hour-meter display) → modal `showModal('hours')` → `saveHours()`. Jeff enters the TRUE hours off the mower's physical meter; it (a) sets `S.hours` everywhere, and (b) **re-syncs `S.hoursBaseline = trueHours − S.lastSensorHours`** so future sensor runtime keeps totaling correctly. Allows correcting DOWN too (confirm prompt). `S.lastSensorHours` = the sensor's latest cumulative `d.hours`, stored on every sync. `S.hoursBaseline` default = 5.9 (fresh install). This is the fix for "sensor missed a mow, hours are off" — read the physical meter, type it in, done.
- **⚠️ Jeff must open SET HOURS and enter `9.2` once on his device** to correct the current reading (localStorage is per-device; can't be set from the repo).

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

- Lines 1–~1700: HTML/CSS (sections, heroes, cards)
- Line ~1701: `<script>` (single JS block)
- Lines ~1701–~7360: All JavaScript
- Line ~7360: `</script>` (closing tag)
- Lines ~7360+: closing HTML
- **Total: ~7372 lines / ~580KB** (as of 07-16, after CAR section added)

**CRITICAL:** NEVER put a `<script>` or `</script>` tag inside the JS block. This causes a fatal JS SyntaxError that blanks the entire app. This was the bug in commit `8497827` that caused the great blank-page incident of 2026-06-23.

**`localStorage` key:** `toro21200` — stores the full `S` state object including `sensorTrack`.

**CSS class names (do NOT rename these):**
- Modal overlay: `.modal-ov` / `.modal-ov.show` (NOT `.modal-overlay.open`)
- Modal box: `.modal-box` (NOT `.modal`)
- Button row: `.mbtns`
- Buttons: `.mbtn` / `.mbtn.primary` / `.mbtn.secondary`
- Green button: `.btn-green`
- Nav buttons: `button.snav-btn` with IDs `#snav-home`, `#snav-weather`, `#snav-irr`, `#snav-yard`, `#snav-guardian`, `#snav-car` (also update the swipe-nav `SECTIONS`/`NAV_IDS` arrays — and keep them in the SAME order as the section DOM — when adding/removing a tab)
- Sections: `#section-home`, `#section-weather`, `#section-irrigation`, `#section-yard`, `#section-guardian`, `#section-car` (LUX thermostat `#luxCard`/`#luxSetupCard` live inside `#section-guardian`)
- YARD tabs: `button.tab`
- CAR tabs: `button.car-tab` (scoped `carTab()` function, NOT global `showTab()`); tab bars: `#car-merc-tabs` (Mercedes), `#car-ford-tabs` (Ford)
- Vehicle picker: `.car-picker` strip with `button.car-pick` (IDs `#pick-merc`, `#pick-ford`); `carSwitchVehicle('merc'|'ford')` toggles vehicle

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
- **Section accents:** `--a-home` (gold), `--a-wx` (sky), `--a-irr` (green), `--a-yard` (brick red), `--a-climate` (orange), `--a-guardian` (steel-blue), `--a-car` (#7b8a9e dark / #5a6577 light). **Every NEW section gets its own `--a-<id>` accent token** used for its nav underline + card-title bar.
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
index.html                   — entire PWA (single file, ~580KB, ~7372 lines)
service-worker.js            — cache version: hcc-v10
manifest.json                — PWA manifest
functions/api/hours.js       — GET/POST sensor data ↔ Cloudflare KV
functions/api/auth.js        — family login: POST {password} → validates against KV, returns ha_token (see Family Login section below)
functions/api/ha.js           — server-side proxy to HA (Nabu Casa)
functions/api/climate.js     — GET/POST LUX thermostat via Azure B2C + myluxstat.io API
functions/api/weather.js     — WU KTNWHITE21 + Open-Meteo fallback
functions/api/mowconditions.js — Open-Meteo hourly mow conditions proxy
functions/api/irrigation/index.js  — GET B-Hyve status + ?tk=1 returns session token
functions/api/irrigation/control.js — POST B-Hyve control (legacy, fallback only)
functions/setup.js           — serves Beehive install script at /setup
beehive/esphome/hcc-mower.yaml    — ESP32 heartbeat config (NOT yet flashed to hardware)
images/                      — hero-home.jpg, hero-irr.jpg, hero-yard.jpg, hero-guardian.jpg, hero-car.jpg
icons/                       — icon-192.png, icon-512.png
```

---

## Family Login (`functions/api/auth.js`) — added 07-21

**Purpose:** lets Jeff/family log into the app with just a shared password instead of each device needing its own HA Long-Lived Access Token pasted in manually. The server holds the real HA token; the app only ever handles the password.

**How it works:**
- `POST /api/auth {"action":"setup","password":"...","ha_token":"..."}` — **one-time only.** Hashes the password (SHA-256) and stores `auth_hash` + `auth_ha_token` in the same KV namespace as `MOWER_KV`/`HCC_KV`. **Refuses to run again if `auth_hash` already exists** (returns `{"error":"already_setup"}`) — this is a safety rail so a stray repeat call can't silently overwrite the real credentials.
- `POST /api/auth {"password":"..."}` — normal login. Hashes the submitted password, compares to `auth_hash` in KV; on match returns `{"ok":true,"ha_token":"..."}` so the app can use HA without Jeff re-entering the token per device.
- **Setup confirmed done and verified working 2026-07-21** (coworker session) — ran setup, then confirmed a plain login round-trips correctly and returns the HA token. **Do not run `action:"setup"` again** — it will just get rejected with `already_setup` since it's already configured; that's expected, not a bug.
- **To reset the password or rotate the HA token:** delete the `auth_hash` key (and `auth_ha_token` if rotating the token too) from KV via the Cloudflare dashboard (Workers & Pages → KV → the `MOWER_KV`/`HCC_KV` namespace), then run `action:"setup"` again with the new values.
- **The actual password and HA token are intentionally NOT recorded in this file or anywhere in the repo** — they only live hashed/stored in Cloudflare KV. If a future session needs to change them, ask Jeff directly rather than searching here for them.

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

## Current State (updated 2026-07-16)

**App:** 6 sections (HOME/WEATHER/IRRIGATION/YARD/GUARDIAN/CAR). Zero JS errors, both themes verified. Service worker **hcc-v10** (network-first HTML so updates always land).

| Area | State |
|---|---|
| 6 nav buttons + swipe navigation | working |
| Modals (LOG MOW/SERVICE, SET HOURS) | working |
| 7 YARD tabs; GPS map + "Pin Track to Photo" calibration + telemetry sim | working |
| CAR section — vehicle switcher (GLE 350 7 tabs + F-250 4 tabs) + `loadCar()` live via mbapi2020 + lock/unlock/flash/remote start/MAX COOL/HEAT | LIVE (07-24) |
| Sensor data (battery/RPM/GPS) | working when ESP32 connected |
| Engine hours baseline + Master Hour Calibration | correct (Jeff's real = 9.2h) |
| Panic = red EMERGENCY bar (token-gated, routes through `/api/ha` proxy) | app fires webhook; **HA automation pending** |
| Garage Door card (Guardian) — OPEN/CLOSE + status via `cover.*garage*` entity | APP DONE; **ratgdo hardware needed** |
| Blink cameras (all 6) + full control (refresh/arm/snapshot/clip-save) | LIVE (07-09) |
| AI camera detection (CodeProject.AI on beast, all 6 cams, person/vehicle/animal) | LIVE (07-10) |
| Fire TV motion pop-up + universal pause/resume | LIVE (07-14/15) |
| HOME GUARDIAN (8 checks from HA + lights/plugs + vacuum + LUX thermostat) | working |
| Light/Dark theme toggle (header, persists in `hcc_theme`, default light) | done |
| Weather: KTNWHITE21 live data, NWS alerts, radar, mow conditions, Lawn Water Need | done |
| Irrigation → HA first, direct B-Hyve fallback; zone control via browser WebSocket | done |
| HA proxy (`/api/ha`) — all HA calls route server-side via Nabu Casa | done |
| Water + Gas meters live (RTL-SDR + rtlamr2mqtt) | LIVE (07-02) |
| `loewenhome.com` + `toro1-5rz.pages.dev` both active + SSL | done |
| Alexa reads real KTNWHITE21 backyard weather | done (07-03) |

---

## Change Log (condensed — full detail always in `git log`; each line = one session's work)

- **07-28 (coworker, later):** **Water Est. Water/Sewer/Combined bug fixed + water Flow/electric Now-Today seeded from real HA history.** Found `putWaterCycle()` (computes water/sewer cost, billing history, sewer-overcharge note) was gated behind "HA does NOT have `sensor.water_month`" — once that helper went live the whole block was skipped, so those fields stayed blank forever even though This Cycle displayed fine. Now always runs off whichever cycle-gallons value is available. Also added `waterFlowFromHistory()` and `elecBackfillProfile()` — both were correctly designed to need a second live sample (or a learned profile) before showing anything, which meant a fresh session showed blank indefinitely; now they seed from HA's own recorder history immediately instead. **Discovery:** HA's recorder history only goes back to ~12:15 UTC on 07-28 — this matches the `default_config:` recorder fix mentioned below (the fix necessarily restarted/reset history), not a new problem. Confirmed B-Hyve is NOT broken (was already working, see Pending Item 3) — an earlier uncommitted `coordinator.py` experiment based on that wrong assumption was stashed, not committed.
- **07-28:** **Utility entity mismatches fixed + electric usage model added.** Recorder had been dead 07-02 to 07-28 (missing `default_config:`, root-caused and fixed by the coworker session — see infra notes). App's water/gas "Reading" tiles now prefer the converted HA helpers (`sensor.water_gallons`/`sensor.gas_ccf`) over the old raw-meter auto-detect (kept as fallback). Electric "This Month" auto-finds the new SmartHub (CEMC) entity by keyword. Added a client-side 24-bucket hour-of-day usage model (EMA-updated from the monthly total's own deltas) to estimate electric Now/Today until a CT-clamp monitor exists — always shown with an explicit `EST` chip/`≈` prefix, never confused with a live reading. Wired the SmartHub hourly statistic into HA's own Energy Dashboard (Settings → Energy → Electricity grid → "CEMC Electric Grid") for real historical usage charts — confirmed working. Tried building a `recorder.get_statistics`-backed real "Today" helper entity but the service returned empty results across multiple valid parameter combinations (matches a known HA GitHub issue) — abandoned in favor of the existing client-side model. Also verified a supposed MyQ garage-door software workaround (`ehendrix23/hass_myq`) is dead (repo doesn't resolve, underlying API block is permanent) — see Garage Door section.
- **07-24 (later):** **Ford F-250 Super Duty added to CAR section with vehicle switcher.** Jeff purchased a 2001 F-250 (VIN `3FTNX21FX1MA23431`, 7.3L Power Stroke Diesel, 4WD, crew cab). Expanded CAR section with a two-button picker strip (GLE 350 / F-250) — hero image swaps dynamically, each vehicle has its own tab bar. Ford gets 4 tabs: Truck Status (OBD-II ready), Specs, Maintenance (diesel-specific: oil, fuel filter, glow plugs, dual batteries), Mods & Upgrades. Active vehicle persists in `localStorage` key `hcc_vehicle`. No HA connectivity for the F-250 (2001 = pre-connected-car era); OBD-II + ESP32 is the future path for live diagnostics. `carTab()` updated to scope tab deactivation to the active vehicle's tab bar. **Jeff should confirm specs** (assumed 7.3L Diesel/4WD/crew cab from VIN + photo).
- **07-24 (late):** **CAR commands fixed — removed incorrect app-level PIN prompts.** Root cause: I added `carPromptPin()` wrappers that blocked commands with a PIN input modal, but mbapi2020 handles PIN from its integration options automatically — the app should never send a `pin` field. Also, Jeff enabled "Disable Capability Check" in mbapi2020 options (was why all commands except flash lights failed). Fix: removed PIN prompt wrappers from `carRemoteStart`, `carLockCmd`, `carMaxCool`, `carMaxHeat`; removed `pin` field from `carMbSvc()`; updated Settings PIN card to point to Beehive integration options. **Lesson: mbapi2020 PIN is configured server-side in HA integration options — never prompt for or send it from the app.**
- **07-26:** **Garage Door control card added to Guardian section (app-side complete).** `loadGarage()`/`garageToggle()` detect `cover.*garage*` entities, show OPEN/CLOSE buttons, state, position. Wired into section nav + post-login + 60s interval. **myQ cloud API permanently blocked by Chamberlain (2023+) — no software-only path exists.** Correct solution: **ratgdo board (~$35)** wired to opener motor → ESPHome → HA local. App auto-detects `cover.*garage*` entities the moment ratgdo is adopted in Beehive. PLANNED module shows setup hint when no entity exists.
- **07-24:** **Fixed stale-data bug — app wasn't auto-refreshing sensors, cameras, or weather.** Root cause: the 60s self-heal interval refreshed Guardian/Lights/Vacuum/Utilities/Car but missed `mowerSync()`, `loadCameras()`, and `loadWeather()` — they only ran ONCE at startup. Also, section switching didn't reload data for HOME (cameras), WEATHER (weather), or YARD (sensors). Fix: section nav now calls the appropriate loader on every visit + 60s interval includes mowerSync+loadCameras + weather gets its own 5-min interval. **Lesson: when adding a new loader, add it to BOTH the section switch AND the periodic interval.**
- **07-23:** **Sewer bill calibrated + water cost validated + billing history tracking.** City of WH sewer bill (3/8-4/7/26) → sewer base $22.74 + $0.00982/gal. WHUD bill confirmed rates ($10.32 + $0.00908/gal). Water + sewer now shown SEPARATELY (Jeff's request: building a case that sewer charges on irrigation water are waste). **Billing history** added: up to 24 cycles tracked in `localStorage` key `water_billing_history`, table renders per-cycle water/sewer/irrigation waste with cumulative sewer overcharge total. History functions hoisted to `loadUtilities()` scope so table shows even without Beehive connection. CAR `carCmdFail()` + diagnostics added. `temperature_configure` fixed to send strings not numbers.
- **07-22:** **CAR commands rewritten with proper mbapi2020 service calls** (research-first, per Jeff's directive). Thorough research of mbapi2020 GitHub repo, README, source code (client.py, switch.py, lock.py, button.py, services.yaml, const.py), HA community forums. **Key findings:** (1) `preheat_start` = EV-only, NOT for gas GLE 350; (2) `engine_start` = correct remote start for gas (PIN required); (3) `auxheat_start` = gas vehicle auxiliary heater (exhaust-based, no PIN); (4) all commands use `mbapi2020.*` domain services with VIN, not generic entity-based calls; (5) PIN must be configured in mbapi2020 integration options. **What changed:** replaced all entity-guessing (`carFindEnts`/`carSendCmd`/`carSendMin`) with `carMbSvc(service, data)` helper that calls `mbapi2020.*` services with VIN `4JGFB4KB0MA478988`. REMOTE START → `engine_start`. Added STOP ENGINE → `engine_stop`. LOCK/UNLOCK → `doors_lock/doors_unlock`. FLASH → `sigpos_start`. MAX COOL → `engine_start` + `temperature_configure(16°C all zones)` + `preconditioning_configure_seats`. MAX HEAT → `engine_start` + `auxheat_start` + `temperature_configure(30°C)` + `preconditioning_configure_seats`. Entity scan now shows VIN + available gas-vehicle services + "preheat = EV only" warning. **PIN NOTE:** Jeff must configure his Mercedes me PIN in Beehive → mbapi2020 integration options for engine_start and doors_unlock to work. **Lesson: never guess entity names or service calls — research the integration's actual source code and use domain-specific services with known parameters.**
- **07-21 (coworker):** 📺 **Fubo→Sling TV switch handled, ad-skip Alexa automation wired up.** Jeff switched TV services. Confirmed `packages/hcc.yaml` has zero Fubo/Sling-specific references (all Fire TV automations use generic ADB/`media_session dispatch`, not app package names) — nothing broke. Found `script.hcc_skip_commercial` + `script.hcc_resume_fire_tv` already existed (16× `input keyevent 90` fast-forward taps + auto-resume) but were **never exposed to Alexa** — that's the whole reason "Alexa FF the commercials" wasn't working. Exposed both to Alexa. Added two new scripts to `packages/hcc.yaml`: `script.hcc_open_sling` (`monkey -p com.sling -c android.intent.category.LAUNCHER 1` via `androidtv.adb_command`, tested working live via direct ADB) and `script.hcc_check_current_app` (on-demand `dumpsys activity activities | grep mResumedActivity`, result lands in `media_player.fire_tv_viewing_room`'s `adb_response` attribute — the building block for any future "what's playing" automation). Both new scripts loaded via **Developer Tools → YAML → Quick reload** (not a full restart) and exposed to Alexa. **Voice phrases: "Alexa, turn on HCC Skip Commercial Break", "HCC Resume Fire TV Show", "HCC Open Sling TV".** Also found and reported the CAR window false-positive root cause this session (see entry below — fixed same day by cloud session).
- **07-21 (late):** Fixed false "window open" alert in CAR — root cause: `binary_sensor.gle_350_windows_closed` uses inverted semantics (`on`=closed). Code now detects `*_closed` entity names and flips logic. Also fixed CAR hero image: removed "PINNACLE TRIM" + "COMMAND CENTER" text via crop-stitch, kept Mercedes-Benz star + GLE 350 4MATIC branding. Fixed CAR/Guardian entity cross-contamination — `find('window')` in `loadCar()` was matching house window sensors; now filters to Mercedes/GLE/mbapi entities only. Fixed CAR lock cross-contamination — `val('lock.')` and `carLockCmd()` were matching house locks instead of Mercedes lock; scoped both to Mercedes/GLE/mbapi entities. Guardian doors/Night Check now exclude Mercedes entities from house lock counts. **Lesson: always check mbapi2020 entity naming conventions — `*_closed` entities invert on/off semantics. Always scope CAR entity lookups to Mercedes/GLE/mbapi to prevent house-entity bleed.**
- **07-21:** CAR section fully LIVE — mbapi2020 installed via HACS (region NA), GLE 350 authenticated (VIN `4JGFB4KB0MA478988`). Verified live: odometer/fuel/range/lock/tires×4/windows/battery/GPS + all warning sensors. NOT available (Mercedes account capability limit, not a bug): `oil_level`, `service_interval`, `preconditioning`. Jeff confirmed CAR tab shows live data after family login.
- **07-21:** Stale-content bug RESOLVED — real root cause was Cloudflare's **CDN edge cache** on `service-worker.js` (separate from browser `Cache-Control`, ignored the 07-20 `_headers` fix), plus `index.html` had **no SW registration at all**. Fix (commit `e37a193`): added the missing `navigator.serviceWorker.register(..., {updateViaCache:'none'})`, plus `CDN-Cache-Control: no-store` in `_headers`. Verified live on `loewenhome.com` itself (`cf-cache-status: BYPASS`). **Lesson: check `cf-cache-status` on the custom domain, not just `Cache-Control` — CDN cache and browser cache need separate fixes.**
- **07-21:** Family Login (`functions/api/auth.js`) one-time setup run + verified — password hash + HA token stored in KV (`auth_hash`/`auth_ha_token`); login round-trips correctly. See **Family Login** section above for reset procedure. Credentials deliberately not recorded anywhere in this repo.
- **07-17:** CAR section wired to live Mercedes data via `loadCar()`/mbapi2020 (UI complete; HACS install completed 07-21 above).
- **07-16:** NEW SECTION — CAR (Mercedes GLE 350, 7 sub-tabs, `--a-car` accent, `hero-car.jpg`). SW bumped to hcc-v10.
- **07-15:** iPad Air 2 wall-display in progress — Safari-15 `AbortSignal.timeout` polyfill fixed hanging; token persistence/Add-to-Home-Screen/Guided Access still pending. Fire TV Stick chosen over Roku (community apps dead). Fire TV universal pause/resume fixed via `cmd media_session dispatch pause` (replaces no-op `keyevent 127`).
- **07-14:** Fire TV camera pop-up fixed via ADB `am start` + browser (`alexa_media_player` synthetic commands were a dead end). CodeProject.AI restarted after silent death on reboot.
- **07-11:** Fire TV Stick paired (ADB + `alexa_media_player`). AI detection expanded to all 6 cameras + arrival-suppression automations.
- **07-10:** Local AI camera detection live — CodeProject.AI 2.9.5 on beast (GPU YOLOv5). Fixed Windows Firewall port 32168 + missing `packages:` include in `configuration.yaml`.
- **07-09:** Blink cameras live (all 6) — removed stale `custom_components/blink` override, used HA's built-in blinkpy. **Never re-add that override.** `loewenhome.com` + `www` live with SSL.
- **07-07:** First HA devices live — Tuya plug + Sharky vacuum. SYLVANIA plugs = dead end (app-locked firmware); Tuya pairing playbook established (Smart Life AP Mode → HA Tuya → QR scan).
- **07-06:** Master Hour Calibration added — **SET HOURS** button re-syncs `S.hoursBaseline` from the true physical-meter reading (never moves hours backward from a sensor sync). GPS map calibration reworked to "Pin Track to Photo" (2 taps, no manual coordinate entry, handles non-north-up photos via similarity transform).
- **07-04:** Lights & Plugs control card added to Guardian — SYLVANIA plugs are `switch.*` not `light.*`; B-Hyve explicitly excluded from ALL ON/OFF so it can never fire sprinklers. CLIMATE tab folded into Guardian (LUX thermostat lives there now). NEW SECTION — HOME GUARDIAN (8 live status checks: people/water/electric/gas/HVAC/garage/doors/devices + Night Check/Away Mode/Test Alerts buttons; unwired hardware shows honest "Sensor pending", never a faked value).
- **07-03:** Section restructure — Weather/Yard/Irrigation each own their metrics now, zero duplicate IDs. **HA now talks through a server-side proxy (`functions/api/ha.js`)** — the durable fix for the whole "Beehive Offline" class of bugs (mixed-content + CORS + Nabu Casa relay timeouts). New HA calls must use `haFetch()`, never a raw `fetch(base+path)`. Root cause of the false-offline bug: a shared `AbortSignal.timeout` reused across retries — **never hoist a timeout signal out of a retry loop.** Alexa now reads real KTNWHITE21 weather. Utilities strip + White House Dispatch card + panic redesign (siren+lights+notify, no raw `tel:911`) added. Beehive `/setup` script ran (HACS, automations, webhooks live).
- **07-01/02:** WHUD water-meter read path confirmed by utility supervisor (unencrypted Itron ERT-SCM `79453337`=`scm+`, no AES key, European timestamps→convert to Central). Gas meter `33393066`=`scm`. **Water + Gas both LIVE via RTL-SDR + rtlamr2mqtt.** J45 migrated to internal SSD (was flaky external USB, both USB ports now free for RTL-SDR/Zigbee). mPING = dead end, repurposed to link the official app.
- **06-23 to 06-29:** Initial build-out — fixed blank-page bug (stray `<script>` tag in JS block), dead sensor data (`MOWER_KV`/`HCC_KV` dual-check), GPS persistence + calibration map, CLIMATE/LUX thermostat integration, irrigation WebSocket fix, Light/Dark theme (default light, token-driven), hero-grade + design-token system (gold standards above), Style A font unification (killed Georgia-serif mix), full light-mode contrast sweep.

---


## Beehive / Home Assistant Integration — Current State

**Beehive hardware (CONFIRMED 2026-07):** **Beelink J45 (Gemini) mini-PC** — Intel Pentium **J4205** (Apollo Lake quad-core), ~**8GB/128GB**, x86, 12V/2A, SN `4205HQBG40244`, part `J45-A-8128JDOW64PRO-D8`. **x86 with USB ports → it CAN host an RTL-SDR directly** (rtl_433/rtlamr add-on) for the gas/water meter reading — no separate ESP32 box needed, IF (a) HA is installed so USB passes through (HA OS bare-metal/supervised — confirm it's not a no-USB VM) and (b) the Beelink sits within radio range of the meters (or antenna run to a window).

### Architecture — the J45 is the brains, mostly over the NETWORK (how anything new connects)
The Beelink J45 runs Home Assistant = the central hub. Devices connect THREE ways; **only radio sticks physically plug into the J45:**
- **USB stick INTO the J45** (gives HA a new "radio language"): **RTL-SDR** (water+gas meters, buying now). Later likely **one Zigbee or Thread coordinator stick** (~$20-30) → a single stick = a whole mesh of cheap door/leak/temp/motion sensors + smart plugs (this is the path for a SECURITY/ALARM layer with no wiring). Optional Z-Wave stick / BT adapter.
- **Wi-Fi / LAN** (talks to HA via the router — NO cable to the J45): ESP32/ESPHome sensors (energy monitor, backup meter box), Shelly plugs, local cameras.
- **Cloud** (HA logs into the vendor cloud over the internet): **Blink** (Sync Module is Wi-Fi→Amazon cloud, no USB/local port — that's WHY it can't cable into the J45), B-Hyve, LUX thermostat.
- **Alarm:** brand-dependent — a hardwired panel integrates via a board (Konnected/Envisalink over Wi-Fi/LAN), not a cable to the J45.
**Takeaway for planning:** most additions need NO wire to the J45 (they join over Wi-Fi/cloud). Keep a couple of USB ports free: RTL-SDR now, probably a Zigbee/Thread stick next.

**✅ FOUNDATIONAL FIX DONE (2026-07-02): Beehive now runs standalone on the J45's INTERNAL 128 GB SSD.** Migrated off the flaky external USB drive: backed up (Full backup "Reinstall", saved to Jeff's beast + iCloud), booted Ubuntu 26.04 live stick, flashed **HA OS 18.1** to the internal SSD (GNOME Disks → Restore Disk Image to /dev/sda), booted clean (Core "landingpage"), restored the backup (~45 min). External WD Elements retired; **both USB ports now free for RTL-SDR + Zigbee.** Guide: `docs/beehive/HA_OS_setup_J45.md`. (Discovery along the way: the internal SSD was NOT Windows — it held the HA data disk; Windows was already gone. Backup lives INSIDE HA on the data disk, so the "download it off first" step was essential.) **Beast network note:** the beast throws `ERR_NETWORK_ACCESS_DENIED` reaching `192.168.1.66:8123` (VPN/AV blocking local IP) — the **phone** reaches HA fine, use it for HA access if the beast blocks.

**How Claude works (so nobody expects the wrong thing):** Claude operates in the **app's cloud code workspace** (the repo + Cloudflare deploys) — it does NOT have network access to Jeff's home-LAN machines (the **Beehive J45**, or **"the beast"** = Jeff's main PC). For anything on those, Claude writes exact step-by-step instructions and Jeff executes; Claude can't log into them directly. "The beast" is useful as the **workbench** (download files, flash the install USB).

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

**CAR section — mbapi2020 service architecture (added 07-22, researched from source):**
- **VIN:** `4JGFB4KB0MA478988` (hardcoded as `CAR_VIN` in JS)
- **Helper:** `carMbSvc(service, extraData)` → `haFetch('/api/services/mbapi2020/' + service, {vin: CAR_VIN, ...extraData})`
- **Gas GLE 350 services (NOT EV):** `engine_start` (PIN req), `engine_stop`, `doors_lock`, `doors_unlock` (PIN req), `auxheat_start/stop` (gas-only exhaust heater, no PIN), `temperature_configure` (16-30°C per zone), `preconditioning_configure_seats` (bool per seat — may be ZEV-only), `sigpos_start` (flash lights), `windows_close/open` (PIN for open), `sunroof_open/tilt/close` (PIN for open/tilt)
- **NOT for gas vehicles:** `preheat_start` (EV-only "zero emission car"), `battery_max_soc_configure`, `charge_program_configure`
- **PIN:** must be set up in Mercedes Me mobile app first, then stored in mbapi2020 integration options in HA. If configured, services auto-use it (no need to pass in call). Required for: `engine_start`, `doors_unlock`, `sunroof_open/tilt`, `windows_open/move`.
- **Entity naming:** mbapi2020 creates entities like `sensor.gle_350_odometer`, `lock.gle_350_lock`, `binary_sensor.gle_350_windows_closed`, `switch.gle_350_auxheat`, `button.gle_350_preclimate_start`. Exact prefix depends on HA config.
- **Display data** (in `loadCar()`): still uses entity-based `val()` lookups for read-only sensors.
- **Commands**: always use `carMbSvc()` domain services, never entity-based `switch/turn_on` or `button/press`.

**Ford F-250 Super Duty (added 07-24):**
- **VIN:** `3FTNX21FX1MA23431` (2001, 7.3L V8 Power Stroke Diesel, 4WD, crew cab)
- **Vehicle switcher:** `carSwitchVehicle('merc'|'ford')`, persists in `localStorage` key `hcc_vehicle`. Swaps hero image + tab bar.
- **No connected-car features** — 2001 model predates FordPass Connect. No remote start/lock/GPS from HA.
- **Future path:** OBD-II port (under dash) + Veepeak OBDCheck BLE+ (~$30) + ESP32/ESPHome → live RPM, coolant temp, battery voltage, engine load, DTCs. Optional GPS module (NEO-6M, ~$12) for location tracking.
- **4 tabs:** Truck Status (OBD-II placeholders), Specs, Maintenance (diesel-specific: oil, fuel filter, glow plugs, dual batteries), Mods & Upgrades.

**Garage Door — ratgdo integration (added 07-26):**
- **Jeff's hub:** Chamberlain myQ MYQ-G0402 (WiFi garage hub, serial 9546, mfg March 2021). **This hub is now USELESS for HA** — Chamberlain permanently blocked all third-party API access in 2023. The native HA `myq` integration was removed in HA 2023.12. No HACS alternative works either.
- **Re-checked 07-28:** Jeff found a supposed HACS workaround (`ehendrix23/hass_myq`) — verified dead: the repo URL doesn't even resolve (404), and the underlying premise is confirmed permanently blocked by the HA codeowner's own public writeup (Cloudflare bot-detection + Firebase app-check added specifically to kill 3rd-party clients). No 2025/2026 reports of any software workaround holding up. Don't revisit MyQ software integrations again absent a major news event reversing Chamberlain's policy.
- **One 2026 wrinkle for ratgdo specifically:** newer openers (~late 2025+) shipping Chamberlain's "Security+ 3.0" firmware block ratgdo/Tailwind/Meross at the protocol level. Doesn't affect Jeff — his opener/hub is a 2021 unit, well before that firmware.
- **Correct path:** **ratgdo board** (~$35, ratcloud.llc or Amazon). Wires directly to the garage door opener motor unit (3 wires: GND, obstruction, control). Runs ESPHome firmware, talks locally over WiFi to HA. Sub-200ms response, no cloud dependency.
- **Compatibility:** Works with Security+ 2.0 (yellow learn button), Security+ (purple/red), and older (orange, via dry contacts). Jeff needs to check the learn button color on his ceiling-mounted opener motor.
- **Expected entities after setup:** `cover.ratgdo_*` (open/close/position), `light.ratgdo_*` (opener light), `lock.ratgdo_*` (remote lockout), `binary_sensor.ratgdo_*` (motion, obstruction, motor).
- **App detection:** `loadGuardian()` and `loadGarage()` auto-detect any `cover.*garage*` entity. The moment ratgdo is adopted in Beehive, the Garage Door card appears in Guardian with live open/close control.
- **The myQ hub can stay plugged in** for the Chamberlain phone app if Jeff still wants it — ratgdo and myQ coexist on the same opener.

---

## Pending Items (Next Session Should Address These)

0. **▶️ PICK UP HERE (updated 07-26).** ~~Garage Door card~~ — ✅ APP-SIDE DONE (card + `loadGarage()`/`garageToggle()` + wired into Guardian). **Hardware needed: ratgdo board (~$35)** — see Garage Door section below. **Remaining next steps:** (a) **Jeff: buy ratgdo board + install on opener** (see setup instructions below). (b) build **utility helper tiles** (This-Month/Flow/Cost) per `docs/beehive/ha_helpers_and_alexa.md`. (c) Fix `HCC — Freeze Warning` automation → repoint to `sensor.backyard_temperature`. (d) **iPad Air 2 wall-display setup** — AbortSignal.timeout Safari-15 polyfill deployed + working, but HA token persistence + "Add to Home Screen" + Guided Access still need final confirmation. (e) **F-250 OBD-II sensor box** — Veepeak OBDCheck BLE+ (~$30) + ESP32 + optional GPS for live diagnostics. (f) **Fire TV/Alexa media features need Beehive-side troubleshooting** (coworker job).

1. ~~**LUX setpoint control**~~ — ✅ FIXED (`b360583`). POST not PUT. Jeff confirmed.

2. ~~**Irrigation "Last Watered"**~~ — ✅ FIXED. B-Hyve history endpoint = `GET /v1/watering_events/{device_id}` (path, not query). Jeff verified "Last Watered 7:30 AM."

3. ~~**B-Hyve invalid_auth**~~ — ✅ RESOLVED. Integration is added and running correctly via the vendor cloud (see Cloud integrations list above). **Do not re-investigate or edit `custom_components/bhyve/coordinator.py` based on this line** — it's confirmed working as committed; any future auth issue needs a fresh real error before touching this code again.

4. ~~**Blink cameras**~~ — ✅✅ DONE (07-09). All 6 live. Fix = deleted stale `custom_components/blink` override, used HA's built-in (blinkpy 0.25.6+ in core 2026.7.1). **NEVER re-add a `custom_components/blink` override.**

5. ~~**GPS map calibration**~~ — ✅ REWORKED to "Pin Track to Photo" (07-06). Two taps, no coordinate entry.

6. **Verify sensor data live** — after hard-refresh, confirm battery/RPM/mileage display. Curl test in Cloudflare Infrastructure section if stuck.

7. **Panic automation (HA side)** — app fires webhook `hcc-panic-button`. HA automation pending Zigbee hardware (coordinator stick + siren + sensors). Guardian section already surfaces all checks. See `docs/beehive/panic_alarm_automation.md`.

8. ~~**Utility helper tiles**~~ — ✅ DONE (07-28). Water/Gas/Electric all live with real entity_ids, cost math, and billing history. See Change Log 07-28 entries and the Meter Integration section below.

9. **Lighthouse** — Score 60/100. Low priority (unminified 300KB index.html).

10. **Lucky Mike "Smart Stall"** — QUEUED (build AFTER current docket). Plans + review in `docs/lucky-mike/` — read `INTEGRATION_NOTES.md` first. New "STABLE" section, `--a-stable` accent. Do NOT start until Jeff says go.

11. **📺 Fire TV motion pop-up** — ✅ WORKING (07-15). Uses `cmd media_session dispatch pause` (real universal pause via Android MediaSession API, not the old no-op `keyevent 127`). Camera view via ADB `am start` + browser on Fire TV. Verified live: genuine pause + exact-position resume. Automation in `packages/hcc.yaml` → `"AI Show Camera on Fire TV"`. All 6 cameras AI-monitored (CodeProject.AI on beast, GPU-accelerated). Phone push + Siri Announce + Fire TV pop-up + per-camera mute + arrival-suppression all working. **Lesson:** edit `packages/hcc.yaml` via Terminal add-on only (Studio Code Server's Prettier corrupts it).

12. **🐛 Desktop-wide-browser layout gap** — found 07-11, NOT fixed. Heroes leave black space on windows >~700px wide. Root cause: `aspect-ratio` + `max-height:460px` with no width constraint. Fix = centered max-width shell or fill-width heroes. Low priority (app used on phone).

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

## Water + Gas + Electric Meter Integration

**Status:** Water + Gas meters LIVE via RTL-SDR + rtlamr2mqtt on J45. Electric "This Month" LIVE via the SmartHub (CEMC) cloud integration — a real ATM90E32 CT-clamp build is still the future path for true instant Now/Today.

### 💧 WATER — WHUD · Kamstrup flowIQ 2100
- **Provider:** White House Utility District. **Meter S/N `25394131`** (replaced old meter `17272512` ~4/29/26), billing cycle ~21st. **Rates:** Base $10.32 + $0.00908/gal (printed on WHUD bill, validated: math matches $39.90 charge for 3,258 gal).
- **Sewer (City of White House):** mirrors WHUD meter, no separate meter. Base $22.74 + $0.00982/gal (validated from 3/8-4/7/26 bill: $24.17 ÷ 2,461 gal). App now shows combined "Est. Water+Sewer" cost.
- **Read path (CONFIRMED by WHUD supervisor):** external **MIU `100WD`**, ERT ID **`79453337`**, **unencrypted Itron ERT-SCM**, 915–930 MHz, ~1 SCM/min. **No AES key needed.**
- **⚠️ Timestamps = European** (Kamstrup is Danish) — convert to Central in code.
- App shows **This Cycle** (since ~21st, `whudCycleKey()`) + **Est. Water+Sewer** combined cost. Divisor ÷10 = gallons.
- Jeff's CC1101+ESP32+wM-Bus firmware stack = **backup only**. Primary = RTL-SDR.

### 🔥 GAS — Piedmont/Spire · Itron 100G ERT
- **Provider:** Piedmont Natural Gas (transitioning to Spire as of 3/31/2026). Account `6100 0546 4779`. Rate: 301 Residential Service. Billing cycle ~5th of each month.
- **Meter:** Elster AC-250, Piedmont# **`T821986`**, serial `10M225478`.
- **Radio:** Itron 100G ERT, FCC `EO9100GDLA`. **ERT ID** starts `…333930…` (need full digits to filter). **Unencrypted**, 900–920 MHz ISM. Same RTL-SDR reads both meters.
- **Rates (validated from 3 bills, May-Jul 2026):** Base **$13.44** + Distribution **$0.61809/therm** + PGA **$0.61691/therm** = **$1.235/therm all-in**. Heat factor **1.068** (CCF→therms). Local franchise fee **5%**. Formula: `(13.44 + round(CCF × 1.068) × 1.235) × 1.05`. Verified to the penny on all 3 bills ($34.58 / $47.83 / $27.08).
- **Recent usage:** May=17 therms ($34.58), Jun=26 therms ($47.83), Jul=10 therms ($27.08). Summer = low (water heater + cooking only); winter = high (furnace).
- Raw ÷100 = CCF. RTL-SDR reads both water + gas meters on same dongle.

### ⚡ ELECTRIC — Cumberland Electric (CEMC)
- **This Month + Cost: LIVE** via the SmartHub (CEMC) cloud integration — entity `sensor.electric_smarthub_energy_monthly_usage_4501007001` (a monthly running total, refreshed on its own ~6h cadence; found by keyword via `findEntity('smarthub','month')`). Now/Today are estimated client-side (24-bucket hour-of-day model, `≈` prefix/EST chip) since SmartHub exposes no instantaneous reading — a DIY ESP32 + ATM90E32AS CT-clamp build (below) is the path to a real instant Now.
- **Provider:** Cumberland Electric Membership Corporation (CEMC). Account `4501007001`. **Meter `145590962`**, Landis+Gyr Gridstream (NOT Itron — can't radio-read). **200A service**, Challenger panel. Rate: 22-Residential Electric.
- **Rates (validated from 06/30/2026 bill):** Base **$39.00** + Energy **$0.08657/kWh** + TVA Fuel **$0.02815/kWh** = **$0.11472/kWh all-in**. Math verified: $39 + 1,903 × $0.11472 + $2 cutoff fee = $259.31 ✓.
- **Recent usage:** Jun 2026 = 1,903 kWh ($259.31). May = 1,205 kWh. Avg daily 61 kWh (range 31-82). Summer A/C drives big spikes (Jul 2025 peaked ~1,790 kWh).
- **Plan:** 6-channel CircuitSetup ATM90E32 board (2 chips), ESPHome `atm90e32` component → HA. CT1+CT2 = 200A mains; CT3-6 = range/dryer/AC/well pump. 2× 9V AC-AC wall-warts for voltage. ~$90-110 DIY.
- **Panel note:** discoloration = old owner's issue, inspected, stable 10+ years. DS18B20 temp probe = peace-of-mind. **Jeff wired the house — never suggest hiring an electrician.**
- **Bake-in extras:** spare CT on well pump, DS18B20 panel temp, water-main motorized valve (~$50), buzzer.
- **Verdict:** NO panel-level switching needed. Monitor only for cooking/laundry. A/C = LUX. Lights = smart plugs/switches.

### 🤖 Planned cross-device automations (once hardware is in)
- Triple-verified watering (B-Hyve + pump CT + water meter). Water-leak auto-shutoff. Pump dry-run protection. HVAC health (LUX + AC draw). Appliance-done alerts. Away scene. Panel over-temp buzzer + push.

### 📡 Hardware path
- **Primary:** RTL-SDR dongle in J45 → rtl_433/rtlamr2mqtt add-on (already working for water+gas). No Windows drivers needed.
- **Backup:** Jeff's ESP32+CC1101+wM-Bus firmware (for encrypted Kamstrup path, not needed now).
- **Still needed from Jeff:** gas meter's full ERT ID.

---

## Jeff's Contact / Account Info

- **Email:** jeff.loewen@comcast.net
- **Cloudflare account:** credentials already configured — never ask for them
- **Home Assistant instance:** "Beehive" — local `homeassistant.local`/`192.168.1.66`; **remote (primary) `https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa`** (Nabu Casa / HA Cloud)
- **Weather Underground PWS:** station **`KTNWHITE21`**, API key **`0e87ee079c0147a787ee079c01d7a75d`** (Jeff owns the station → free PWS key). Used by `functions/api/weather.js` AND the HA "Weather Underground" integration (so Alexa can read his real station — see `docs/beehive/ha_helpers_and_alexa.md`).
- **Mower:** Toro TimeMaster 21200
- **Jeff wired his own house** — he is skilled and comfortable doing his own electrical work in the breaker panel. Never suggest hiring an electrician. Talk to him as a capable peer on electrical/hardware.
- **Jeff is almost 60 and learning** the software/AI side — be patient and clear there, never condescending. But on hands-on hardware/electrical/firmware he is experienced. Make it enjoyable.
