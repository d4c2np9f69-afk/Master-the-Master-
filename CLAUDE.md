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

The app has six sections: **HOME**, **WEATHER**, **IRRIGATION**, **YARD** (mower data), **GUARDIAN** (whole-home safety/security/alarm watch — LUX thermostat lives here too; the old CLIMATE tab was folded in), **CAR** (Mercedes GLE 350 Pinnacle Trim Command Center with 7 sub-tabs).

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
- CAR tabs: `button.car-tab` (scoped `carTab()` function, NOT global `showTab()`)

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
| CAR section — 7 sub-tabs + `loadCar()` live via mbapi2020 + lock/unlock/flash | LIVE (07-21) |
| Sensor data (battery/RPM/GPS) | working when ESP32 connected |
| Engine hours baseline + Master Hour Calibration | correct (Jeff's real = 9.2h) |
| Panic = red EMERGENCY bar (token-gated, routes through `/api/ha` proxy) | app fires webhook; **HA automation pending** |
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

## Change Log (highlights — full detail in `git log`)

- **07-21 (coworker):** 🚗🎉 **CAR section fully LIVE — mbapi2020 installed + verified end-to-end.** Installed the `MercedesME 2020` custom integration (HACS → search "Mercedes" → `ReneNulschDE`'s repo, download, restart HA), configured region **North America**, authenticated with Jeff's Mercedes me account (Jeff entered his own email/password/verification code directly — coworker does not type third-party account passwords into browser forms). Vehicle found and named "GLE 350" (VIN `4JGFB4KB0MA478988`). **Verified live in Developer Tools → States:** `sensor.gle_350_odometer` (56883), `sensor.gle_350_fuel_level` (52%), `sensor.gle_350_range_liquid` (320), `lock.gle_350_lock` (unlocked), all 4 `sensor.gle_350_tire_pressure_*` (35/35/35/34), `binary_sensor.gle_350_windows_closed`, `sensor.gle_350_starter_battery_state`, `device_tracker.gle_350_device_tracker` (home), plus the full set of warning binary_sensors (engine light, brake fluid, wash water, park brake, tire, theft system) — all match the keywords `loadCar()` searches for exactly, no app code changes needed. **NOT available for this vehicle/account:** `oil_level`, `service_interval`, `preconditioning` — the integration's own `sensor.gle_350_rcp_features` reports `False`, meaning Mercedes hasn't enabled that capability on this account/vehicle tier (not an HA or install issue, nothing to fix here). **Confirmed by Jeff 2026-07-21: logged into `loewenhome.com` with the family password, CAR tab shows live data.** CAR section goal is fully done — install, entities, and app display all verified working.
- **07-21:** ✅ **RESOLVED — stale-content bug, corrected root cause.** The 07-20 fix (`_headers` → `Cache-Control: no-cache` on `service-worker.js`) worked on `toro1-5rz.pages.dev` but NOT on `loewenhome.com`, and no amount of waiting fixed it. **Real root cause:** standard `Cache-Control` in `_headers` only governs the *browser's* cache. Cloudflare's CDN edge caches JS assets independently (`cf-cache-status: REVALIDATED`) and was never told to stop — it kept serving the stale copy from the edge regardless of the origin header. Separately, **`index.html` had NO service worker registration call at all** — new visitors never even got a SW installed, so the "network-first" fetch logic already in `service-worker.js` was moot for them. **Fix, 3 layers (commit `e37a193`):** (1) `navigator.serviceWorker.register('/service-worker.js', {updateViaCache:'none'})` added to `index.html` (was missing) — browser bypasses its HTTP cache specifically when checking for SW updates, works regardless of any CDN; (2) `_headers` → added `CDN-Cache-Control: no-store` on `/service-worker.js` (separate directive from `Cache-Control`, tells Cloudflare's edge specifically to never cache it) plus tightened browser header to `no-cache, no-store, must-revalidate`; (3) same `_headers` block also covers `/` and `/index.html`. **Verified live on `loewenhome.com` itself** (not just the `.pages.dev` URL): `cf-cache-status: BYPASS` (was `REVALIDATED`), `Cache-Control: no-cache, no-store, must-revalidate` on `service-worker.js`. **Lesson for any future cache/stale-content bug: check `cf-cache-status` on the live custom domain, not just `Cache-Control` — Cloudflare's edge cache and the browser's HTTP cache are controlled by different headers (`CDN-Cache-Control` vs `Cache-Control`) and must both be addressed.**
- **07-21 (coworker):** 🔑 **Family Login one-time setup completed + verified** (`functions/api/auth.js`, added by cloud session). Ran the `action:"setup"` call with Jeff's password + HA Long-Lived Access Token — stored hashed/plain in KV (`auth_hash`/`auth_ha_token`). Verified end-to-end: a normal `{"password":...}` login call correctly returns `{"ok":true,"ha_token":"..."}`. See new **Family Login** section above Key Files for the mechanism, reset procedure, and why the actual credentials are deliberately NOT written anywhere in this repo. Also noticed commit `70dba84` (cloud session, same day) expanded `_headers` to force `no-cache` on `/` and `/index.html` too, on top of the `service-worker.js` fix from 07-20 — belt-and-suspenders for the stale-content bug. **`loewenhome.com` custom domain was still showing the old cached `service-worker.js` header as of the last check this session** (over an hour after the fix went live on `toro1-5rz.pages.dev`) — still likely needs a manual Cloudflare dashboard cache purge; see 07-20 entry below for the checking method.
- **07-20 (coworker):** 🔧 **Root-cause fix for the recurring "stale content" bug — `service-worker.js` was cacheable for 4 hours.** Jeff reported `loewenhome.com` still showing old content after a fix went live. Diagnosis: `index.html` was already correctly `Cache-Control: max-age=0, must-revalidate`, but `service-worker.js` itself — the file whose only job is to detect updates — was being served with Cloudflare Pages' default `public, max-age=14400, must-revalidate` (4h). Browsers could go hours (longer if offline through that window) without even requesting the new SW file, so none of the earlier fixes (hcc-v3/v6/v10 bumps, network-first HTML) fully stuck. **Fix: added `_headers` file at repo root** (Cloudflare Pages native config) forcing `/service-worker.js` → `Cache-Control: no-cache`, so the browser always revalidates it. Commit `173270a`, pushed to the deploy branch. **Verified live on `toro1-5rz.pages.dev`** (curl confirms `no-cache` now returned). **⚠️ NOT yet confirmed on `loewenhome.com` (the custom domain)** — same curl test there still returns the old `max-age=14400` header several minutes after deploy. Likely Cloudflare Pages custom-domain header propagation lag, or a zone-level Cache Rule on the `loewenhome.com` Cloudflare zone overriding `_headers`. This local session has no Cloudflare API/dashboard access to purge cache or inspect zone Cache Rules — **next session (cloud, has Cloudflare credentials) should re-check `curl -sI https://loewenhome.com/service-worker.js` for `Cache-Control: no-cache`; if still stale, purge cache for that URL in the Cloudflare dashboard (Caching → Configuration → Purge Cache, or purge by URL) and/or check for a Cache Rule on the zone that's overriding origin headers.**
- **07-17:** 🚗 **CAR section wired to live Mercedes data** via mbapi2020 HACS integration. `loadCar()` fetches `/api/states` and populates odometer, fuel level, range, lock status, oil, battery, tire pressures (all 4), windows, engine/brake/wash warnings, service interval, preconditioning, GPS. LOCK/UNLOCK + FLASH LIGHTS buttons on Vehicle Status tab. Remote Climate button wired to preconditioning entity. Status banner updates dynamically. Added to 60s self-heal interval. **Pending:** Jeff installs mbapi2020 via HACS on Beehive (see setup instructions).
- **07-16:** 🚗 **NEW SECTION — CAR (Mercedes GLE 350 Pinnacle Trim Command Center).** 7 sub-tabs via scoped `carTab()`, accent `--a-car`, hero `images/hero-car.jpg`. SW bumped to `hcc-v10`. Verified: all tabs, both themes, zero JS errors.
- **07-15 (coworker):** 🖥️ **iPad Air 2 wall-display setup IN PROGRESS.** `AbortSignal.timeout` polyfill fixed app hanging on Safari 15 (polyfill at top of `<script>` block). HA token "HCC ipad token" pasted but Jeff said "rest of pages didn't log in" — unresolved (may just be Irrigation's separate B-Hyve login). Add-to-Home-Screen + Guided Access not yet completed. Roku TV investigated → Fire TV Stick path chosen (pending purchase).
- **07-15 (coworker):** 🎯 **Fire TV universal pause/resume FIXED** — `cmd media_session dispatch pause` replaces broken `input keyevent 127` (confirmed live: genuine pause + exact-position resume on DVR). Blink fast-poll automation added (30s vs 5min default). Auto-return reverted to HOME key (Fubo app-relaunch was cold-starting, losing playback position).
- **07-14 (coworker):** 🎉 **Fire TV camera pop-up FIXED via ADB/browser** (`am start -a VIEW -d <entity_picture URL>`) — `alexa_media_player` synthetic commands confirmed dead end. CodeProject.AI Server restarted (had silently died on reboot 3 days prior). `packages/hcc.yaml` editing lesson: use Terminal add-on (sed), not Studio Code Server (Prettier corrupts flow-YAML).
- **07-11 (coworker):** 📺 **Fire TV Stick paired** (ADB + `alexa_media_player`). AI detection expanded to all 6 cameras. Arrival-suppression + "Angela Almost Home" automations. Siri Announce fix (interruption-level → time-sensitive). Desktop layout gap found (not fixed — see Pending #10). Both domains audited identical.
- **07-10 (coworker):** 🎉 **LOCAL AI CAMERA DETECTION LIVE** — CodeProject.AI 2.9.5 on beast (GPU YOLOv5, GTX 1050 Ti). 3 automations in `packages/hcc.yaml` (scan/notify/mute). Fixed: Windows Firewall port 32168 + `packages:` include directive in `configuration.yaml` (all old automations were ghost entities).
- **07-09:** 🎉🎥 **BLINK CAMERAS LIVE** (all 6) — removed stale `custom_components/blink` override, used built-in (blinkpy 0.25.6+). Full camera control (refresh/arm/snapshot/save-clip). Public-share safety (panic gated behind HA token). `loewenhome.com` + `www` LIVE + SSL. AT&T gateway: Beehive pinned to fixed `.66`. Guardian banner calmed + shows reasons. Camera-AI plan → `docs/home-theater-ai-plan.md`.
- **07-07:** 🎉 **First HA devices live** — Tuya plug ("Bed lamp") + Sharky robot vacuum in Guardian. SYLVANIA plugs = dead end (firmware-locked to SYLVANIA app). Tuya pairing playbook: Smart Life AP Mode → HA Tuya integration → QR scan (one-time-use).
- **07-06:** ⏱ **Master Hour Calibration + pre-mow reset reminder** (Jeff: sensor missed today's mow with the MPU offline, so hours were off; true = 9.2). Header **UPDATE HOURS → "SET HOURS"** now opens **MASTER HOUR CALIBRATION**: enter the true hours off the mower's physical meter → sets `S.hours` everywhere AND re-syncs `S.hoursBaseline = trueHours − S.lastSensorHours` so future sensor runtime keeps totaling right. Can correct DOWN too (confirm). New state: `S.hoursBaseline` (default 5.9, replaces the hardcoded `MOWER_BASELINE` — read LIVE each sync) + `S.lastSensorHours` (stored every sync). Hours still never move backward from a sync. A **"set [date]" line** under the hour meter (`#hdrHoursCal`, from `S.hoursCalibratedAt`) shows when it was last hand-set. Also added a slim **pre-mow RESET reminder** banner at the top of the YARD dashboard (`#preMowReminder`). Verified in harness: calibrate 9.2 → baseline 6.2, persists; sync @3.5h → 9.7; sensor reset @0h → stays 9.7; override down works; reset banner present; zero JS errors. **Jeff still needs to tap SET HOURS → 9.2 once on his device** (localStorage is per-device).
- **07-06:** 🛰️ **GPS map calibration reworked to "Pin Track to Photo"** (Jeff: old one was too convoluted, kept erroring "invalid coordinates"). Killed the type-in-lat/lon flow entirely. Now: tap **Pin Track to Photo** → tap where you STARTED, tap where you ENDED — the app pairs those two taps with the track's own first/last GPS points, so there are **no numbers to type and "invalid coordinates" is impossible**. `gpsToXY` upgraded from axis-aligned to a **2-point similarity transform** (rotation + uniform scale + translation, GPS projected to a local plane) so a diagonal track / not-perfectly-north-up photo still lines up. Removed `addCalibPt`/`saveMapCalib` + the coordinate inputs; `_mapCalib` shape unchanged (2×`{fx,fy,lat,lon}`) so any old saved calib still works. Also added a **Sensor Health note**: when `mpu_ok:0` the app explains the MPU6050 is offline (Vibration/Pitch/Roll/Tip/RPM all depend on it) + the I²C-wiring/power-cycle check, instead of a cryptic "MPU MISSING". Verified in harness (mock track + mock `mpu_ok:0`): 2 taps → calib saved with exact start/end GPS + tapped pixels, badge/clear appear, zero "invalid coordinates", note fires, zero JS errors. **NOTE:** couldn't read Jeff's live payload — the dev egress policy blocks `toro1-5rz.pages.dev` (403) — so the vibration-offline root cause is a hardware check on his box (MPU6050 I²C wiring), not an app bug (app-side reads are correct).
- **07-04:** 💡 **"Lights & Plugs" control card added to HOME GUARDIAN** (Jeff's "add the auto lighting I have now"). **Jeff's SYLVANIA Smart WiFi are PLUGS, not bulbs → they come into HA as `switch.*`, not `light.*`.** So `loadLights()` pulls BOTH `light.*` AND `switch.*` from `/api/states`, with irrigation EXCLUDED (`lightIsIrrigation()` filters out bhyve/orbit/zone/sprinkler + `is_watering`/`zone_name` attrs) so the card can NEVER fire the B-Hyve sprinklers. Card = **ALL ON / ALL OFF**, a **100/50/25%** brightness row that only appears when a dimmable bulb exists (plugs are on/off only), and a per-device pill list (💡 lights, 🔌 plugs). On/off uses generic `homeassistant.turn_on/off` (both domains); brightness uses `light.turn_on` on dimmable bulbs only — all through the `/api/ha` proxy. Loads on the Guardian tab + 60s self-heal. Verified in harness with lights+plugs+a bhyve switch: 4 devices shown, **bhyve excluded**, brightness row shows for the dimmable bulb, toggle→`homeassistant/turn_on`, 50%→`light/turn_on{brightness_pct}` on the bulb only, All Off→`homeassistant/turn_off` (no bhyve), zero JS errors. **Hardware paths:** (1) SYLVANIA plugs = Tuya-based → add via HA **Tuya** integration (Smart Life QR login) or **LocalTuya**; they auto-appear as `switch.*`. (2) **RF Wireless LED strip remote** (ON/OFF/100/50/25/MODE/SPEED) = dumb 433MHz, NOT HA-controllable → needs a **Broadlink RM4** to learn codes, OR (better) swap the controller for a cheap WiFi (Magic Home/Tuya) or **WLED-on-ESP** → native `light.*`. **CONFIRMED 07-04 (Jeff's screenshot IMG_0852): his plugs already live in the Tuya app directly** (home "301"; plugs Giraffe plug / Lamp Couch / Lamp chair / Lamp foyer + more) → use the Tuya app he has, no Smart Life crossover needed. **Full click-by-click guide written: `docs/beehive/lighting_tuya_setup.md`** (Part A add plugs via Tuya User Code + QR scan; Part B "on at sunset / off at 9pm" automations + YAML; Part C retire the old Tuya-app 9pm rule + expose back to Alexa so HA is the sole brain). Jeff wants HA to control everything. Next: he runs Part A, then I finalize the automations against the real `switch.*` entity names.
- **07-04:** 🧹 **CLIMATE tab removed — LUX thermostat folded into HOME GUARDIAN; Guardian reordered ahead of it (now the 5th/last tab).** Jeff's call: Climate would only ever hold the thermostat, so that nav slot is better spent on Guardian, which will grow into the whole HA security/alarm hub. LUX cards (`#luxCard`/`#luxSetupCard`) moved verbatim into `#section-guardian` (all `loadClimate`/`luxSetMode`/`luxAdjust`/`saveLuxCreds` JS unchanged; `guardian` tab now calls `loadGuardian()`+`loadClimate()`). New personalized hero `images/hero-guardian.jpg` (Jeff's brick house at dusk, "HOME GUARDIAN · PROTECT · MONITOR · AUTOMATE" baked in) — replaced the stock security poster; own aspect-ratio 1200/900 so the baked title never crops, status overlay moved to top. Removed `#snav-climate`; dropped `climate` from swipe `SECTIONS`/`NAV_IDS`. (A few inert `#section-climate`/`#snav-climate` CSS rules left behind — harmless, no matching elements.) Verified in harness: 5 tabs, LUX renders inside Guardian, all checks/buttons work, both themes, zero JS errors.
- **07-04:** 🛡️ **NEW SECTION — HOME GUARDIAN** (this fulfills the long-planned SECURITY section; Jeff's mockup). 6th nav tab `#snav-guardian` / `#section-guardian`, own accent `--a-guardian` (steel-blue), hero `images/hero-security.jpg`, Section-Kit only. One `haFetch('/api/states')` in `loadGuardian()` derives 8 checks — **People** (person./device_tracker home count), **Water** (leak sensor→red, else live meter=NORMAL), **Electric** (power sensor present=NORMAL, else "Meter pending"), **Gas** (smoke/CO/gas alarm→red, else meter=NORMAL), **HVAC** (climate.* hvac_action), **Garage** (cover/binary_sensor named garage), **Doors** (contact sensors, garage excluded), **Devices** (online/total across real domains) — plus an overall **PROTECTED / ATTENTION / ALERT** banner. Hardware not in Beehive yet shows honest **"Sensor pending"** (dim), never a faked value. 4 action buttons: **NIGHT CHECK** (doors/garage/locks/lights bedtime summary modal), **AWAY MODE** (runs a `scene.away`/`script.away` if it exists, else tells Jeff to make one), **SYSTEM DETAILS** (entity-count breakdown + open HA dashboard), **TEST ALERTS** (fires `persistent_notification.create` to prove the alert path). Own bottom-sheet modal `#grdModal` (`grdShow/grdClose`). Auto-refreshes in the 60s self-heal loop + on token connect. Verified in the Playwright harness with mocked HA states: section renders, all 8 checks populate, all 4 buttons open modals, placeholder path (no token) works, both light+dark clean, zero JS errors. **As you add real sensors** (Zigbee contacts/leak, garage tilt, energy monitor) the rows light up automatically — no code change. Overall status still needs its live device confirm (Jeff's Beehive).
- **07-03:** 🧹 **Section restructure for continuity (Jeff's request — app grew from mower-app to HCC).** Clean separation, no duplicated info: **WEATHER = "Weather Conditions at 301"** (pure weather: temp/dew/wind/UV/pressure/rain-rate + radar/forecast/alerts/spotter/mPING/station/burn). **YARD dashboard** now holds the mower-specific **Mowing Conditions** (mow verdict banner `wxBanner` + rain-risk/soil/dew-on-grass/heat-stress/lightning tiles) and **Ready to Mow?** (`readyCard`) — moved from Weather. **IRRIGATION** now holds **Lawn Water Need** (`wxWaterCard`). Each metric ID lives in ONE section (audited: 0 duplicate IDs). Weather hero subtitle shows sky condition, not the mow verdict. **Blank-tiles fix:** `loadWeather()` now fetches new server-side **`functions/api/mowconditions.js`** (Open-Meteo hourly proxy) instead of a direct browser call to api.open-meteo.com that was flaking → Rain Risk / Soil Temp / Dew on Grass / Rain 24-48h / Lightning populate reliably. New sensor/weather tile? Put it in the section that owns it and use `haFetch`/a Function, never a raw browser fetch.
- **07-03:** **Batch: utility tap-to-call (banners dial provider CS), dispatch card → Spire image + all 13 hotspots recalibrated (verified by overlay), man+mower GPS marker (`images/mower-marker.png`), mow verdict now matches across cards (wet dew → CAUTION), gas card → Spire branding.** Water bill captured (WHUD, meter 25394131, cycle ~21st, rates $10.32+$0.00908/gal) — reading-scale reconciliation (bill 9640 vs sensor 12,984) still pending Jeff's physical LCD read.
- **07-03:** 🎉 **Alexa now reads the REAL backyard weather** — Jeff exposed `Backyard Temperature`/`Humidity` to Amazon Alexa (HA → Voice assistants → Expose) + discovered; "Alexa, what's the backyard temperature?" reads the live KTNWHITE21 value. The "Alexa's weather is always wrong" complaint is resolved (Amazon's native weather intent can't be overridden — we expose the real sensors instead). Weather goal COMPLETE.
- **07-03:** 🎉 **Real weather (KTNWHITE21) now in HA** — added a `rest:` sensor in `configuration.yaml` pointing at our own `https://toro1-5rz.pages.dev/api/weather` (no built-in WU integration in current HA; this reuses the Function that already has the WU key + Open-Meteo fallback). Creates `sensor.backyard_temperature/_feels_like/_humidity/_wind`. Confirmed live (Feels Like 79°F). Next: expose to Alexa so she reads the real station.
- **07-03:** 🛡️ **HA now talks through a server-side proxy (`functions/api/ha.js`) — the durable fix.** The app used to call HA directly from the browser, fighting mixed-content + CORS + Nabu Casa relay timeouts (the whole "Beehive Offline / meters Waiting" class). Now `haFetch()` routes `checkBeehive`/`loadUtilities`/`loadHomeStatus`/`loadCameras`/`saveHaToken` through same-origin `/api/ha?path=/api/...`, which forwards server-to-server to the Nabu Casa URL (no CORS, no mixed content, 20s server timeout). Browser passes token + `X-HA-Base` per request (token stays in the browser). Proxy is locked to Jeff's Nabu Casa host + `/api/` paths only (not an open proxy). Same pattern as irrigation/weather = why those never break. **New HA calls should use `haFetch`, not direct `fetch(base+path)`.**
- **07-03:** 🐛 **Fixed a self-inflicted false "Beehive Offline"** — when wiring Nabu Casa, `checkBeehive` built ONE `AbortSignal.timeout(2500)` and reused it across all candidate fetches, so 2.5s was a *shared* budget and later attempts aborted instantly. Nabu Casa's remote relay routinely takes >2.5s, so a reachable HA showed red (and meters stopped loading). Fix: fresh signal per attempt + 9s timeout (also `loadUtilities`/`loadHomeStatus`), and check `r.ok`. Verified with a simulated 4s slow relay → green + meters LIVE. **Lesson: never hoist `AbortSignal.timeout` out of a retry loop; keep timeouts generous for the Nabu Casa relay.**
- **07-03:** 🎉 **BEEHIVE ONLINE IN THE APP (confirmed, green dot).** Root cause of the long-standing "Beehive Offline" was a stack of 3: mixed-content (local http from an https page), no auth token sent, and **CORS**. Fixed: Nabu Casa https URL + app sends bearer token + **HA `configuration.yaml` now has `http: cors_allowed_origins: [https://toro1-5rz.pages.dev]`** (Jeff added it via File editor, restarted HA). App reads HA remotely now. **Any new origin (or a Cloudflare Pages preview URL) that needs to read HA must be added to `cors_allowed_origins` too.**
- **07-03:** **App↔Beehive connectivity wired** — added `HA_NABU` = Nabu Casa remote URL (`https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa`) as the app's primary HA base (secure https → fixes the mixed-content "Beehive Offline"). `checkBeehive()` now tries Nabu Casa first (even if a stale local `ha_base` is cached) and sends the bearer token (HA `/api/` needs auth to confirm online). Local IP kept as home-WiFi fallback. **mPING repurposed** — killed the in-app submit (type picker + JS + CSS + `/api/mping` + deleted `functions/api/mping.js`); card + weather button now open the official mPING app for Jeff to submit by hand.
- **07-03:** **Beehive `/setup` script ran** (screen confirmed): HACS installed, HCC automations + sensors loaded, ESPHome add-on installed, mower sensor config ready. Panic + mower webhooks now live on HA (`/api/webhook/hcc-panic-button`, `/api/webhook/hcc-mower-sensor`). Remaining setup-script steps: HACS→Authorize GitHub (do), B-Hyve via HACS (optional/later — app already does irrigation), **Blink = SKIP (upstream 2FA bug)**, flash `hcc-mower.yaml` to ESP32 (later).
- **07-03:** **Utilities helper tiles + Alexa/weather plan.** `loadUtilities()` now also fills the This-Month / Flow / Cost / Electric tiles from named HA helper sensors (`sensor.water_month`, `sensor.water_flow`, `sensor.gas_month`, `sensor.gas_cost`, `sensor.electric_now/today/month`) — each skipped silently until Jeff builds it (Reading tiles still auto-find the raw meters). Wrote **`docs/beehive/ha_helpers_and_alexa.md`** (click-by-click: template ÷10/÷100 sensors → utility_meter monthly → derivative flow → gas cost template; **Alexa** skill link + expose entities; **KTNWHITE21 → HA via native Weather Underground integration** [Jeff owns the station; key `0e87ee...`] so **Alexa reads his REAL weather** by name / via a "weather report" Routine — Amazon's built-in weather intent can't be overridden, so we expose the real sensors instead).
- **06-23/24:** Fixed blank page (stray `<script>` in JS block), dead sensor data (MOWER_KV binding — see `getKV` dual-check), GPS persistence, all modal CSS. Created this file. Extracted hero photos (2.1MB→295KB).
- **06-24:** Warm cream-gold palette app-wide; panic button HOME-only; Beehive-first irrigation.
- **06-25:** Real aerial GPS map + calibration (`localStorage.yard_map_calib`) + telemetry sim; YARD hero photo; B-Hyve HA custom integration (`beehive/custom_components/bhyve/`).
- **06-26:** CLIMATE section + LUX thermostat (real API — see LUX reference below); irrigation `ws_timeout` fixed by moving WebSocket to the browser (`irrControl`/`irrWsCommand`, `/api/irrigation?tk=1`).
- **06-26 cont.:** Weather overhaul (live WU data, NWS alerts, mPING card); LUX setpoint fixed (POST, not PUT).
- **06-29 (light-mode sweep):** Proactive audit of every popup/panel in light mode (gradient-aware dark-on-dark detector in `scratchpad/sweep.js`). Fixed remaining dark holdouts: NWS alerts card, YARD black meter panels, cast popup, all modals (`.modal-box`/`.minput`/`.mbtn.secondary` → white sheet), footer tagline strip, WU stars, Simulate button contrast, Beehive terminal command boxes (solid dark). All contexts clean both themes, zero JS errors.
- **06-29 (Style A redesign):** Jeff picked "Apple Clean" from 3 rendered mockups. Unified to ONE system font (killed the Georgia serif mix that looked choppy; `--font`+`--serif`→Apple stack), made light-mode chrome **white top-to-bottom** (header + nav), clean header title (non-italic), tighter card-title spacing. Verified all sections both themes, zero JS errors.
- **06-29:** Radar → Windy embed restored + "NWS Radar ↗" popout (RadarScope link was dead). **Light/Dark theme** added (header toggle, default light, token-driven `html.light` override; swapped hardcoded light text → tokens so light mode reads cleanly; dark unchanged). Verified all 5 sections + YARD subtabs + LOG MOW modal in both themes, zero JS errors.
- **06-27/28:** Voice→Alexa swap (removed in-app voice that mis-dialed contacts); SW network-first (hcc-v6); WU Recognized badge; **hero grade module** + **visual consistency tokens/`statusColor()`** (gold standards above); weather fixes (radar OSM tiles, unified mow verdict via `applyMowVerdict`, alert dedup, Lawn Water Need + `/api/drought`, Spotter/NOAA anchors, mPING token-ready); whole-home utilities planning (below).
- **07-01:** WHUD supervisor briefed Jeff in person → **water meter blocker RESOLVED**: read via unencrypted Itron `100WD` MIU, **ERT-SCM**, endpoint **`79453337`**, ~915–930 MHz, SCM/min + hourly big read, **no AES key**, European timestamps (convert to Central). Both meters now read by one **RTL-SDR + rtl_433** (CC1101/ESP32 = backup). Sewer authority corrected to **City of White House** (no seasonal rate). AES key stored in Apple Passwords (not needed for this path). Panic/house-hero verified HOME-only.
- **07-02:** 🎉 **J45 migrated to internal drive** — Beehive now boots HA OS 18.1 standalone off the internal 128 GB SSD (was flaky external USB). Full backup → Ubuntu 26.04 live → flash to internal → restore. USB ports freed for RTL-SDR/Zigbee.
- **07-02:** **App↔Beehive connectivity** — root cause of "Beehive Offline" in the app = the https PWA can't fetch the local http HA (mixed content / LAN-only). Fix chosen: **Nabu Casa (HA Cloud, $6.50/mo trial)** for a secure `...ui.nabu.casa` URL → app reads HA remotely + works off-WiFi + easy Alexa (`tts.cloud_say` for announcements). Setup in progress (Cloud connected; remote URL provisioning). Full plan: `docs/system_audit_and_roadmap.md`. Also **mPING = dead end** (NSSL: no automated/app reports ever → repurpose card to the official app).
- **07-02:** Wired **HOME Utility cards to the live meters** — `loadUtilities()` auto-finds `water_meter`/`gas_meter` sensors, shows the reading formatted (water ÷10 gal, gas ÷100 ccf), card → LIVE. (Today/Month tiles still need HA utility_meter helpers.) Also fixed **weather hero temp** (was showing Open-Meteo forecast, not the real KTNWHITE21 station — now matches the card) and made **EXTREME heat downgrade the mow verdict to "MOW WITH CAUTION · mow early AM/evening"**.
- **07-02:** 🎉 **WATER + GAS METERS LIVE** — RTL-SDR + **rtlamr2mqtt** add-on reading both. **Water `79453337` = `scm+`** (key discovery: NOT plain scm), **Gas `33393066` = `scm`** (full ID confirmed off the Itron 100G barcode). Both publishing every 60s → `sensor.water_meter` (raw 129105), `sensor.gas_meter` (raw 883384). Full working config + discovery method in **`docs/beehive/rtl_sdr_meter_setup.md`**. No Windows drivers (add-on ships the driver). TODO: decimal `format:` to match dials, today/month/flow helpers, wire `UTIL_ENTITIES`.
- **07-01:** Added **White House Dispatch** card (top of HOME, below hero) — branded tap-to-call directory (officials, utilities, police/fire non-emerg, US House switchboard/TTY), %-positioned hotspots over `images/white-house-dispatch.jpg` (aligned + verified). **Panic redesign:** red EMERGENCY bar now = the panic button (fires `hccPanic` with a confirm; **no raw tel:911** — Jeff calls 911 himself); removed the standalone panic button. New panic intent = **sound alarm sirens + lights + alert Jeff/Angela/Braxton**; app POSTs `{action:panic,siren,lights,notify:[...]}` to webhook `hcc-panic-button`. The actual sirens/lights/alerts are a **Beehive automation** (blueprint saved: `docs/beehive/panic_alarm_automation.md`) — pending J45 setup + alarm integration + HA Companion on the 3 phones.
- **07-01:** Built **HOME Utilities strip** — 3 compact branded cards (Water=White House Utilities/flowIQ, Gas=Piedmont/Itron 100G, Electric=CEMC) with color-coded accents + Today/Month/Now data tiles. Images `images/util-{water,gas,electric}.jpg` (compact 104px cover banners, NOT auto-graded — own `.util-*` classes). Cards show clean "Waiting for Beehive meter reader" placeholders until live; `loadUtilities()` fills from HA when the `UTIL_ENTITIES` entity_ids are set (all null now → placeholders, no false readings). Verified both themes, zero JS errors.

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

---

## Pending Items (Next Session Should Address These)

0. **▶️ PICK UP HERE (updated 07-21).** Stale-content/cache bug is ✅ RESOLVED — see 07-21 changelog entry for the full root cause (CDN edge cache, not just browser cache) and the 3-layer fix. Verified live on `loewenhome.com` itself. **Remaining next steps:** (a) build **utility helper tiles** (This-Month/Flow/Cost) per `docs/beehive/ha_helpers_and_alexa.md`. (b) Fix `HCC — Freeze Warning` automation → repoint to `sensor.backyard_temperature`. (c) **⛽ GAS billing sync — WAITING on Jeff's first Spire bill.** Water is fully bill-synced ($72.42 validated). (d) **iPad Air 2 wall-display setup** — AbortSignal.timeout Safari-15 polyfill deployed + working, but HA token persistence + "Add to Home Screen" + Guided Access still need final confirmation (see 07-15 changelog).

1. ~~**LUX setpoint control**~~ — ✅ FIXED (`b360583`). POST not PUT. Jeff confirmed.

2. ~~**Irrigation "Last Watered"**~~ — ✅ FIXED. B-Hyve history endpoint = `GET /v1/watering_events/{device_id}` (path, not query). Jeff verified "Last Watered 7:30 AM."

3. **B-Hyve invalid_auth** — Jeff needs to re-run `sh bhyve` in HA Terminal → restart → re-add "Orbit B-Hyve" integration.

4. ~~**Blink cameras**~~ — ✅✅ DONE (07-09). All 6 live. Fix = deleted stale `custom_components/blink` override, used HA's built-in (blinkpy 0.25.6+ in core 2026.7.1). **NEVER re-add a `custom_components/blink` override.**

5. ~~**GPS map calibration**~~ — ✅ REWORKED to "Pin Track to Photo" (07-06). Two taps, no coordinate entry.

6. **Verify sensor data live** — after hard-refresh, confirm battery/RPM/mileage display. Curl test in Cloudflare Infrastructure section if stuck.

7. **Panic automation (HA side)** — app fires webhook `hcc-panic-button`. HA automation pending Zigbee hardware (coordinator stick + siren + sensors). Guardian section already surfaces all checks. See `docs/beehive/panic_alarm_automation.md`.

8. **Utility helper tiles** — UI built (3 cards). Set real entity_ids in `UTIL_ENTITIES` when meters are reading. Water timestamp = European → convert to Central.

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

**Status:** Water + Gas meters LIVE via RTL-SDR + rtlamr2mqtt on J45. Electric = future DIY build.

### 💧 WATER — WHUD · Kamstrup flowIQ 2100
- **Provider:** White House Utility District. **Meter S/N `25394131`**, billing cycle ~21st. **Rates:** Base $10.32 + $0.00908/gal (validated: $72.42 matches real bill).
- **Read path (CONFIRMED by WHUD supervisor):** external **MIU `100WD`**, ERT ID **`79453337`**, **unencrypted Itron ERT-SCM**, 915–930 MHz, ~1 SCM/min. **No AES key needed.**
- **⚠️ Timestamps = European** (Kamstrup is Danish) — convert to Central in code.
- App shows **This Cycle** (since ~21st, `whudCycleKey()`) + **Est. Water $**. Divisor ÷10 = gallons.
- Jeff's CC1101+ESP32+wM-Bus firmware stack = **backup only**. Primary = RTL-SDR.

### 🔥 GAS — Piedmont · Itron 100G ERT
- **Meter:** Elster AC-250, Piedmont# **`T821986`**, serial `10M225478`.
- **Radio:** Itron 100G ERT, FCC `EO9100GDLA`. **ERT ID** starts `…333930…` (need full digits to filter). **Unencrypted**, 900–920 MHz ISM. Same RTL-SDR reads both meters.
- Raw ÷100 = CCF. **Waiting on Jeff's first Spire bill** for rate/cycle calibration.

### ⚡ ELECTRIC — DIY ESP32 + ATM90E32AS (FUTURE BUILD)
- **Provider:** Cumberland Electric (CEMC). **200A service**, Challenger panel, meter Landis+Gyr (Gridstream, NOT Itron — can't radio-read).
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
