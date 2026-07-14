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

The app has five sections: **HOME**, **WEATHER**, **IRRIGATION**, **YARD** (mower data), **GUARDIAN** (whole-home safety/security/alarm watch — LUX thermostat lives here too; the old CLIMATE tab was folded in).

**🛡️ HOME GUARDIAN is the designated home for ALL Home Assistant security, home-alarm, and system checks (Jeff, 07-04).** Every future security/alarm feature goes here: cameras, door/window contacts, motion, leak/smoke, the Zigbee siren + ARM/DISARM, the panic automation surface, and any new "is-the-house-OK" check. Don't scatter these onto HOME — build them into `#section-guardian` with the Section Kit + `--a-guardian` accent, live from HA `/api/states` via `loadGuardian()`.

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
- Nav buttons: `button.snav-btn` with IDs `#snav-home`, `#snav-weather`, `#snav-irr`, `#snav-yard`, `#snav-guardian` (also update the swipe-nav `SECTIONS`/`NAV_IDS` arrays — and keep them in the SAME order as the section DOM — when adding/removing a tab)
- Sections: `#section-home`, `#section-weather`, `#section-irrigation`, `#section-yard`, `#section-guardian` (LUX thermostat `#luxCard`/`#luxSetupCard` live inside `#section-guardian`)
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

**App:** 5 sections (HOME/WEATHER/IRRIGATION/YARD/GUARDIAN). CLIMATE tab removed 07-04 — LUX thermostat folded into GUARDIAN. Zero JS errors, both themes verified. Service worker **hcc-v6** (network-first HTML so updates always land).

| Area | State |
|---|---|
| Modals (LOG MOW/SERVICE, UPDATE HOURS) | working |
| 7 YARD tabs; GPS map + calibration + telemetry sim | working |
| Sensor data (battery/RPM/GPS) | working when ESP32 connected |
| Engine hours baseline 5.9h | correct |
| Panic = red EMERGENCY bar in the White House Dispatch card (HOME top); standalone panic button removed | app fires webhook; **HA automation pending** (see below) |
| Hero grade module + status tokens (gold standards above) | done |
| Light/Dark theme toggle (header ☀️/🌙, persists in `hcc_theme`) | done — **default light** |
| CLIMATE / LUX thermostat + setpoint (POST /api/device) | WORKING — live confirmed |
| Irrigation → HA first, direct B-Hyve fallback; zone control via browser WebSocket | done — needs live test |
| Weather: KTNWHITE21 live data, NWS alerts (deduped by id), 10-day (Open-Meteo), radar (OSM tiles), Lawn Water Need + /api/drought | done — radar/notifs need device confirm |
| Alexa button (opens Alexa app); in-app voice REMOVED | done |
| mPING submit | ✅ DONE (07-03) — card now just opens the **official mPING app** (`mping.nssl.noaa.gov`) for Jeff to submit by hand. In-app submit is impossible (NSSL/Kim Elmore 07-02: NO automated/app reports ever, no API key). Removed the type-picker UI + `mpingSelect/Submit/UseGPS` JS + `.mping-*` CSS + `/api/mping` call. Do NOT rebuild in-app submit. |

---

## Change Log (highlights — full detail in `git log`)

- **07-14:** 🔍🐛 **FULL AUDIT (coworker/beast session) — found + fixed the real reason cameras/Fire TV alerts stopped working: CodeProject.AI Server silently died 3 days ago and never came back.** Jeff reported cameras + Fire TV "not working as intended" despite the 07-11 changelog saying both were confirmed working end-to-end. Root cause, confirmed on the beast directly (not guessed): the **CodeProject.AI Server Windows service was STOPPED** — even though it's set to "Automatic" startup, it did NOT come back up after the beast's last reboot (07-11, 6:08 AM). Proof it's been down exactly since then: in HA's Automations list, **"AI Camera Scan on Motion" has kept firing normally** (most recently 32 min before this check) — so Blink motion sensors + the scan trigger are fine — but **"AI Object Detected Notify" and "AI Show Camera on Fire TV" both show "Last triggered: 3 days ago"** — i.e. the scan step has been silently failing to reach CodeProject.AI (port not listening) ever since that reboot, so no object ever gets detected, so neither the phone push nor the TV pop-up automation has fired since 07-11. **Fixed the immediate symptom:** manually started the service (`Start-Service`), confirmed it's now `Running` and answering on `:32168` (firewall rule from 07-10 still correct, no change needed there). **NOT yet fixed — needs a real reliability fix so this doesn't silently die again:** "Automatic" Windows startup type is not actually surviving every reboot; recommend switching it to Automatic (Delayed Start) + a failure-recovery action, or a simple scheduled-task watchdog that checks port 32168 and restarts the service if it's down. Did not apply this yet — wanted Jeff's OK first since it's a standing system-config change. **Second real finding — the Fire TV automation contradicts Jeff's own documented decision:** `docs/home-theater-ai-plan.md` "Phase 2" records Jeff explicitly choosing (07-10) to route TV alerts through **Kodi running on the beast**, and explicitly says **"NOT simple ADB from Beehive to Fire TV — Jeff wants it routed through the beast."** But what actually got built and marked "confirmed working end-to-end" the very next day (07-11) is exactly that rejected approach — ADB-paired Fire TV + `alexa_media_player` HACS integration. Kodi itself **was installed on the beast but only ever launched once, for about 3 minutes, then never touched again** (its own log confirms this; `C:\Users\jeffl\AppData\Roaming\Kodi\kodi.log` starts and ends 07-11 6:11–6:14 AM); its HTTP remote-control (`services.webserver`) is still set to `false` in `guisettings.xml`, and **no Kodi integration was ever added to HA** — confirmed via Settings → Devices & Services, not present. Net effect: two contradictory plans exist for the same feature, and the live system runs the one Jeff said he didn't want. **Needs Jeff's call:** (a) keep the Fire TV/Alexa route now that it's unblocked, and update `home-theater-ai-plan.md` to match reality, or (b) actually finish the Kodi setup (enable its web server, add the HA integration, wire the automation per `docs/beehive/media-center-setup.md`) and retire the Fire TV automation. **Third finding, unconfirmed:** when checked via ADB before any other change, the Fire TV's screen was fully asleep (`Display Power: state=OFF`). The pop-up automation mimics a spoken Alexa command rather than a live voice request — worth Jeff physically confirming a real detection actually wakes the screen and shows the overlay, now that the AI pipeline is flowing again; that's the one thing only he can observe in the room. **Camera hardware/base feed itself looks healthy, not the broken layer:** `camera.301_backyard`'s attributes are updating in real time in HA and its live entity_picture rendered an actual current backyard photo — so the raw Blink→HA camera pipeline is fine; the AI-detection layer on top of it was what broke. **Minor items noticed, not chased down:** HA has an unread notification "Login attempt failed — invalid authentication from localhost (127.0.0.1)" from ~42 min before this check (something local hitting HA's own API with bad/no auth — not yet diagnosed, worth a look if it recurs) and a "🚨 EMERGENCY ALERT — HCC Panic triggered at 05:50 PM" logged 3 days ago (same day as the rest of the 07-11 work — almost certainly a test/accidental trigger during that session, not a real event, but flagging since panic firing is significant). **Also found:** this beast had **8 local commits sitting unpushed** (pure CLAUDE.md/changelog + HA-side documentation from prior coworker sessions, no app-code) that merged cleanly with the cloud session's latest push via `git pull` — still unpushed pending Jeff's OK.

- **07-11:** 📺 **FIRE TV PAIRED TO BEEHIVE — first piece of the TV motion-pop-up-alert plan (Phase 2 of `docs/home-theater-ai-plan.md`).** Jeff set up a new Fire TV Stick (model **AFTKRT**, `192.168.1.215`, MAC `20:BE:B8:3A:8C:5D`) in the viewing room. **Root cause hit + fixed along the way:** the beast couldn't reach it at all at first (`adb connect` → WSAEACCES) — turned out **ProtonVPN's WireGuard tunnel on the beast was blocking outbound LAN traffic**, same root-cause class as the earlier "Beehive Offline" `ERR_NETWORK_ACCESS_DENIED` issue (see 07-02 entry). Jeff disabled ProtonVPN → ADB connected immediately. Enabled Developer Options + ADB debugging on the Fire Stick (7-taps-on-device-name unlock), authorized the beast's ADB key, then added HA's **Android Debug Bridge** integration (Settings → Devices & Services → Add Integration → Android Debug Bridge → device type **Fire TV** → host `192.168.1.215`) — this triggers its own separate "Allow USB debugging?" prompt from HA's own ADB key, confirmed by Jeff on the TV screen. Device now live in HA as **"Fire TV - Viewing Room"** with a `media_player` + remote entity, state `idle`. **Decision on how the pop-up actually works:** considered a native Alexa Routine (Blink motion → "Show Camera" on the Fire TV) since it's a first-party feature needing zero HA work, but rejected it because it bypasses HA entirely — it can't reuse the existing person/vehicle AI classification or the per-camera mute helper, and (per Jeff's ask) can't be suppressed when a known family member's phone is already home. **Chose instead: route TV pop-ups through HA** via the `alexa_media_player` HACS custom integration, so the same automation that already does AI detection + muting for phone notifications (`AI Object Detected Notify` in `packages/hcc.yaml`, see 07-10 entry) can also trigger "show camera on Fire TV," and a new arrival-based automation (family phone `not_home`→`home` → auto-set the existing `input_datetime.hcc_ai_mute_<camera>` helper ~10 min out) can suppress it for expected arrivals like Angela coming home. **Progress:** `alexa_media_player` v5.15.6 installed via HACS (`custom_components/alexa_media`), HA restarted (confirmed via the HACS "Restart required" repair card → Submit — the generic Developer Tools restart button was unreliable/needed several attempts, the repair-card Submit worked on the first real try), integration setup wizard opened (Settings → Devices & Services → Add Integration → Alexa Media Player). **PENDING — Jeff must finish this on the beast's browser himself:** the wizard needs the Amazon email/password + (if 2-Step Verification is on, which it should be) a 52-character TOTP authenticator key from amazon.com → Login & Security → 2-Step Verification → Authenticator App — Claude does not handle credentials, so this step was left sitting on-screen for Jeff. **Next after that's done:** build the "show alerting camera on Fire TV" action into `AI Object Detected Notify`, and build the new arrival-suppression automation (trigger: `person.*` state `not_home`→`home`).
- **07-11:** 🔍 **loewenhome.com vs toro1-5rz.pages.dev audited — both clean, byte-for-byte identical, no fix needed.** Jeff reported seeing a "stale version" in Chrome. Full check (fresh browser tab, all caches bypassed): fetched both domains' `index.html` directly — **100% identical, 532,663 chars each**; clicked through all 5 nav tabs (Home/Weather/Irrigation/Yard/Guardian) on both domains — **zero console errors**, all API calls (`/api/weather`, `/api/mowconditions`, `/api/alerts`, `/api/hours`) returned 200; the only non-200 was an expected `401` on `/api/ha` in this token-less anonymous session (correct demo-mode behavior). `service-worker.js` (`hcc-v7`) logic is correctly built — network-first for HTML navigation, `skipWaiting()`+`clients.claim()` so updates take over immediately, old cache names get purged on activate. **Root cause of what Jeff was actually seeing: a stale `service-worker.js` cached locally in his Chrome profile** (browsers only re-check that file periodically, so it can lag behind real deploys even though the code itself is correct) — gave him the clear-site-data steps for both desktop and Android Chrome. Not a server/deploy bug.
- **07-11:** 🐛 **FOUND (not fixed — app-code, for the cloud session): desktop-wide-browser layout gap.** On any browser window wider than ~700-900px (i.e. desktop, not phone), the hero sections leave a large dead black area to the right instead of filling the window. **Root cause:** `.sec-hero-weather`/`-irr`/`-yard`/`-guardian` etc. set `aspect-ratio` + `max-height:460px` but no `width`/`max-width`, and there's no centered max-width shell around the app anywhere in the CSS. On a phone the viewport is never wide enough to hit the height cap, so it looks perfect there — but once a wide desktop window makes the box tall enough to hit `max-height:460px`, CSS derives the box's **width from the aspect ratio** (~700px) instead of the viewport, and since nothing centers it, it sits flush-left with blank space filling the rest of the window. Confirmed via direct CSS read, not just visual — no other explanation fits (not a caching issue, not domain-specific, reproduced identically on both loewenhome.com and toro1-5rz.pages.dev). **Fix needed (pick one):** (a) wrap the whole app in a centered `max-width` shell (e.g. ~480-600px) so desktop shows a clean centered "phone-width" card, or (b) make hero containers fill available width up to the real viewport (drop/adjust the `max-height` cap or add explicit `width:100%` handling) for a true responsive desktop layout. Low urgency (app is used mostly on phone) but easy to verify: any hero section in a browser wider than ~900px.
- **07-10:** 🎉 **LOCAL AI CAMERA DETECTION LIVE — CodeProject.AI + HA automations, GPU-accelerated, fully tested end-to-end.** Installed **CodeProject.AI Server 2.9.5** on the beast (`D:\CodeProject\AI`, GPU-accelerated on the GTX 1050 Ti via CUDA, YOLOv5 6.2, ~150-700ms/detection, Windows service auto-starts on boot). **Two real infra bugs found + fixed along the way:** (1) **Windows Firewall was silently blocking port 32168** from the LAN — the installer never added an inbound rule, so nothing outside the beast itself could reach it (Beehive's requests just timed out with no useful error); added `New-NetFirewallRule` for TCP 32168, fixed instantly. (2) **BIGGER FIND: `packages/hcc.yaml` was never actually loaded by HA at all** — `configuration.yaml` had no `homeassistant: packages: !include_dir_named packages` directive, so despite being valid YAML the whole file was silently ignored. **This is why `hcc_panic_button`/`hcc_mower_sensor_sync`/`hcc_freeze_warning`/`hcc_severe_weather_alert` showed "unavailable" — they were ghost/restored entities that had never truly run, ever.** Added the missing directive → **all 6 automations (4 old + 2 new) came alive simultaneously.** If those "placeholder" automations still need real logic, that's now unblocked. **New HA integration:** installed the community `codeproject_ai_object` custom component (github.com/codeproject/CodeProject.AI-HomeAssist-ObjectDetect) — patched one upstream bug in it (`image_processing.py` referenced `cpai.CodeProjectAIServerException`, which the current `codeproject-ai-api` pip package renamed to `CodeProjectAIException` — one-line `sed` fix, filed nowhere upstream yet). `image_processing:` in `configuration.yaml` now has all 3 Blink cameras (301 Backyard/Driveway/Front Doorbell) wired to `192.168.1.194:32168`, `timeout: 60` (Blink's cloud snapshot fetch is sometimes slow — expect alerts anywhere from a few seconds to ~1 min after real motion, not instant), targets person/vehicle/animal at confidence 60, plus `save_file_folder: /config/www/ai_snapshots/` for annotated (boxed) snapshot images. **Three automations added to `packages/hcc.yaml`:** `AI Camera Scan on Motion` (any of the 3 Blink motion sensors → scans that camera), `AI Object Detected Notify` (routes by object type: person=critical push w/ sound, vehicle=normal push, animal=passive/silent push; attaches the annotated snapshot image; fires a custom `hcc_ai_detection` event with camera/label/object_type/confidence for the app to consume later; gated by a per-camera mute check), `AI Notify Mute Action` (handles the "🔇 Mute 15 min" action button on the push notification — sets an `input_datetime.hcc_ai_mute_<camera>` helper 15 min out). 3 new `input_datetime` helpers (`hcc_ai_mute_301_backyard/driveway/front_doorbell`) back the per-camera cooldown. **Verified fully live** (not just deployed): forced `binary_sensor.301_driveway_motion` on twice → both times detected real cars (up to 85.9% confidence) → notification fired → **Jeff confirmed on his phone** both the push notification AND the attached annotated photo arrived correctly. **Known gaps:** only `notify.mobile_app_jeffs_iphone` is registered — Angela/Braxton need the HA Companion App installed+logged-in before they get alerts; no package/delivery detection (stock YOLO has no "package" class — would need a custom-trained model, a separate project; the person+backpack/suitcase/handbag co-occurrence heuristic is the closest community workaround if wanted later); zone/ROI filtering is supported by the component (`roi_x_min/max` etc.) but intentionally not configured yet — no known false-positive zone to calibrate against, would be guessing at coordinates blind. **Next handoff options:** app-side work to render `hcc_ai_detection` events on the camera cards ("Person detected 2m ago"), or zone/ROI tuning once Jeff flags an actual problem area, or migrating to Frigate later if true polygon zones / a native detection-gallery card become priorities (bigger lift, backend swap not an add-on).
- **07-09:** 🌐 **AT&T gateway (BGW320-500) — Beehive pinned to a FIXED IP.** Jeff (first-timer, walked through it screen-by-screen) set `192.168.1.66/homeassistant` to **Private fixed** via the gateway's **Home Network → IP Allocation → Allocate → Private fixed:192.168.1.66 → Save** (admin at `http://192.168.1.254`, needs the Device Access Code on the sticker). Verified by coworker: `.66` pings 0% loss + HA loads HTTP 200 — nothing broke (pinned to its existing IP). Note: after allocating, a device drops off the "DHCP clients" view and reappears as "Private fixed" after the lease refreshes — that's normal, not a fault. **Fixed IPs for Blink sync/cameras/Tuya plugs are NOT needed** (they're cloud-connected, not local-IP dependent) — only the Beehive mattered. **Full LAN inventory captured by coworker** (192.168.1.0/24): Beehive `.66` (84:39:be:20:0d:ad), Blink Sync `.214` (40:89:c6:19:55:b7), mower ESP32 `.195` (ESP_DBDE3B, a0:20:a6:0b:de:3b), Tuya plug#1 `.209` (TY_WR), beast `.194` (301Server); other ESP32s at `.210/.224/.196/.232` (purpose TBD), possible Sharky vacuum `.228` (WS-Uejlwa4yAnSI). **The AT&T box can't change its DNS resolver** (confirmed) — that's why DNS caching recurs; per-device 1.1.1.1 or own-router-in-IP-Passthrough is the only real DNS fix. **AT&T ActiveArmor / Smart Home Manager check DONE (07-09): Jeff confirmed NOTHING is paused or blocked** — so AT&T security is not interfering with any project device. **Only remaining tiny item:** secure-HA bookmark (Nabu Casa https) so local HA stops showing "Not secure" (that warning is just plain-http on LAN — harmless).
- **07-09:** 🔒 **PUBLIC-SHARE SAFETY + family full-access model (Jeff wants to give out the web address `loewenhome.com`).** The app is a public static PWA, so ANYONE with the URL loads it — but all home data (cameras, lights, guardian, utilities, home status) is gated behind Jeff's HA **token stored per-device**, so a stranger only sees the demo shell + public weather/dispatch numbers, never the cameras or controls. **CRITICAL fix:** the red EMERGENCY panic bar previously fired an **unauthenticated** webhook — any anonymous visitor could set off the real sirens/lights/alerts. Now `hccPanic()` **requires `getHaToken()`** (shows a friendly "armed only on the homeowner's connected device" message otherwise) AND routes through the same-origin `/api/ha` proxy instead of a direct `fetch(HA_BASE+...)` (works off home WiFi too). Verified in harness: no-token → no webhook POST + demo message; with-token → POSTs `/api/webhook/hcc-panic-button` via proxy; zero JS errors. **ACCESS MODEL:** public = view-only demo; **full access = paste Jeff's HA Long-Lived Token once on the device** (Connect to Beehive field) — so Angela, Jeff's dad, and Braxton get everything (cameras + control + panic) by entering the token on their phones. **Minor open items (low sev, noted not fixed):** `/api/hours` POST is open (a stranger could push junk mower telemetry — griefing only); the Nabu Casa URL is visible in client JS (inherent; HA still requires login). **Domain:** ✅ **LIVE** — `loewenhome.com` + `www.loewenhome.com` attached to the `toro1` Pages project, both **Active + SSL enabled**, returning HTTP 200 worldwide (verified via 1.1.1.1 & 8.8.8.8 by the coworker). App needed no code change (relative `/api/*` + relative manifest `start_url`). The old `toro1-5rz.pages.dev` still works too. (Transient: Jeff's AT&T gateway cached a stale AAAA-only record so *home-WiFi* lookups lagged — self-clears / reboot gateway / set DNS to 1.1.1.1; doesn't affect outside visitors.) Safe to share publicly (panic gated behind token; all home data token-gated).
- **07-09:** 🎬 **CAMERA-AI + HOME-THEATER PLAN captured → `docs/home-theater-ai-plan.md`.** Jeff wants (free, NO subscriptions): review Blink clips in-app, alerts that say person/car/package/animal, TV pop-up alerts, and a seamless HA-driven home theater. Key decision: **the beast (`301Server` .194, 6-core, ~2TB+500GB SSD, Nvidia GPU [model TBD via `nvidia-smi`], 24/7, in the viewing room) = the AI + media brain**; Beehive J45 stays PURE HA. Free detection path = local vision AI on the beast (Ollama+LLM Vision, or CPU YOLO/CodeProject.AI, or free Gemini tier). In-app clip player = Claude builds (HA media_source). TV pop-up needs Android TV/Shield or beast-drives-screen-via-Kodi (Apple TV can't overlay). Camera **big-tile layout already shipped**. Open Qs: exact GPU, which screen in the room, beast OS approach. See the doc.
- **07-09:** 🎥🎮 **FULL CAMERA CONTROL IN THE APP — no Blink app / no subscription needed.** Reworked `loadCameras()` + added a control layer in HOME → Security · Cameras: **🔄 REFRESH ALL** (fires `blink.trigger_camera` for every cam → waits ~7s → reloads stills), **ARM/DISARM** motion (auto-shows if an `alarm_control_panel.*` sync module exists → `alarm_control_panel.alarm_arm_away`/`alarm_disarm`), and **tap any camera → full-control panel** (`camView()`, reuses `grdModal`) with a large still, **📸 TAKE NEW SNAPSHOT** (`camSnap`→trigger+reload), **💾 SAVE CLIP** (`camSaveClip`→`blink.save_recent_clips` to `/media/blink/…`, Jeff has local clip storage), and battery/temp/wifi/motion rows pulled from the cam's sibling sensors. **Key fix:** stills now load as HA's **signed `entity_picture` URL** straight from the https Nabu Casa host (`camImgBase()` forces https) — an `<img>` load isn't CORS-gated like the old `fetch().blob()` was, which is likely why tiles showed icons before. All service calls go through the `/api/ha` proxy (`haFetch`). Verified in Playwright with mocked HA (2 cams + alarm + sensors): toolbar+arm render, panel renders w/ 5 info rows, and the correct services fire — trigger_camera (per-cam + all), save_recent_clips, alarm_arm_away — zero JS errors. Free Blink features only (on-demand snapshot/liveview/clip-save/arm); cloud clip *history* is the only thing the paid plan adds. **New app domain:** Jeff registered **loewenhome.com** via Cloudflare (proxied) — TODO: point it at the `toro1` Pages project + add it to HA `cors_allowed_origins` (belt-and-suspenders; cameras don't need it since they load from the Nabu Casa host, and all other HA calls go through the same-origin `/api/ha` proxy).
- **07-09:** 🎉🎥 **BLINK CAMERAS LIVE IN THE APP — Jeff's #1 feature, DONE (confirmed screenshot: all 6 cameras — 301 Driveway, Front Right, Back Left, 301 Backyard, Garage, 301 Front Doorbell).** Fix = removed the stale `custom_components/blink` override, deleted the broken entry, restarted HA (core 2026.7.1 has the fixed blinkpy 0.25.6+), re-added the **built-in** Blink integration → SMS PIN finally appeared → authenticated. Cameras render in HOME → Security · Cameras via `loadCameras()`. Tiles show camera icon + "idle" until a snapshot is captured (Blink is event-based). Lesson: after HA shipped the official fix, our pre-fix custom override became the bug (it shadowed the good built-in). Never re-add a custom blink override. See Pending #4 (now RESOLVED).
- **07-09:** 🎥 **BLINK ROOT CAUSE FOUND (web research) — official fix shipped; our custom component is now the blocker.** Blink's 2FA now returns HTTP 202 (`tsv_state`/`tsv_methods`); old blinkpy read 202 as success so the PIN never showed → "Login failed." Fixed upstream in **blinkpy 0.25.6** (PR #1231) → **HA core 2026.6.4** (PR #173811, "no HA-side changes needed"). Our July-3 `custom_components/blink/` override now **shadows HA's fixed built-in with stale code** — the log's `ConfigEntryNotReady` is from OUR `coordinator.py:58`. **Fix = delete the override + the broken entry, update HA ≥ 2026.6.4, use the built-in Blink integration** (`rm -rf /config/custom_components/blink` → delete Blink entry → update+restart HA → re-add Blink built-in → SMS PIN now appears). Wait ~30 min after deleting before re-adding (our old code hammered Blink's login for days → possible rate-limit). Do NOT re-add a custom blink override. Details in Pending #4.
- **07-09:** 🛠️ **Guardian ATTENTION banner now explains itself + calmer thresholds; fixed 2 dead Weather links.** The Guardian banner was crying "⚠️ ATTENTION" with no reason — root cause: a single offline device (43/44) tripped it. Now it collects **reasons** and shows them ("⚠️ ATTENTION — 1 door open", "🛑 ALERT — Water leak"), and a lone offline device no longer escalates (only >15% of devices offline flags it; below that it's a calm FYI). People "0 HOME" is now neutral (being away isn't an alert). Verified in harness: 1/44 offline + 0 home → PROTECTED; door open → ATTENTION w/ reason; leak → ALERT w/ reason; zero JS errors. Also fixed the Weather **Spotter** + **NOAA Radio** buttons (Jeff: they 404'd) — swapped the dead deep-links (`spotternetwork.org/pages/maps`, a specific TuneIn station id) for durable targets (spotternetwork.org root + a TuneIn search for Nashville NWR). **TODO when web tools are back:** pin the exact best NWR live stream + spotter map URLs (couldn't live-verify this session — search rate-limited + WebFetch 403). Added **Mandatory Rule 13 (coworker delegation).** **Link audit — remaining 404-RISK deep-links to verify** (couldn't open from here, egress 403 on all external hosts): the mower reference buttons on YARD **Parts/Diagnostics/Specs** — partstree.com ×3 (`/models/21200-...`, `/models/14d935-...` ×2), ereplacementparts.com, jackssmallengines.com, manualslib.com — plus `guardianDetails`'s `openBeehive('/lovelace/0')`. **Everything else is safe:** all PARTS[]/RULES[]/DIAG[] buttons are **search URLs** (amazon/ebay/walmart/homedepot/youtube `?q=`/`s?k=`) + App Store/WU-station = won't 404. **✅ VERIFIED 07-09 via the coworker (Claude Code on the beast): all 5 mower parts/manual deep-links are LIVE — no fix needed** (partstree ×2 = 200, jackssmallengines = 200, manualslib = 200; ereplacementparts = 403 but that's just anti-bot blocking automated requests, works fine in a real browser). Good thing we checked instead of blind-swapping working links. Only unverified item left: `guardianDetails`'s `openBeehive('/lovelace/0')` (HA-dashboard-path dependent, low priority). **The 2 actually-dead Weather links (Spotter, NOAA Radio) were already fixed.** Link audit = DONE.
- **07-07:** 🎉 **FIRST HA DEVICES LIVE IN THE APP — plug + robot vacuum.** After the SYLVANIA dead-end, a **generic Smart Life plug (JH-G01U "Mini Smart Socket," Shenzhen Jiuheng)** paired fine and is now controllable in the HCC **Lights & Plugs** card as "Bed lamp." **The HA Tuya integration is now set up and working** (2 devices / 22 entities: `switch.bed_lamp` + a **"Sharky" BL20 Pro robot vacuum**). **Pairing playbook that worked (record for future plugs):** (1) pair the plug into the **Smart Life** app using **AP Mode / slow-blink** — the fast-blink auto-scan is flaky, AP mode is reliable; (2) in HA add the **Tuya** integration with the **User Code from Smart Life** and **scan the QR with Smart Life's in-app scanner** (Settings tab → scan icon), NOT the iPhone camera (camera → opens a website) and NOT SYLVANIA (→ "designated app" error); (3) the **QR is ONE-TIME-USE** — a fresh QR, scan once, tap the blue **Confirm login** fast ("already been used" = re-scanned a spent QR). Once in HA, plugs auto-appear in the card. **Added a Robot Vacuum card** (`#vacuumCard`, `loadVacuum()`) in Guardian — hides itself unless a `vacuum.*` exists; Clean/Pause/Dock/Find via `vacuum.start|pause|return_to_base|locate`; shows state + battery. **loadLights now excludes the vacuum's setting-switches** (child-lock/DND/mop, or any switch sharing the vacuum's name-stem) so Lights & Plugs stays clean. Verified in harness: only the plug shows in Lights & Plugs, vacuum card renders with controls firing the right services, zero JS errors. **Loose ends:** porch/landscape are still on the locked SYLVANIA plugs → to automate them (sunset-on / 9pm-off), swap to working plugs (JH-G01U-type or Kasa) then build the automation.
- **07-07:** ❌ **SYLVANIA plugs = DEAD END for HA (confirmed, do NOT re-attempt the Tuya path).** They're firmware-locked to the SYLVANIA app — Smart Life explicitly rejects them ("Unknown device — this device is not supported by this app"), in BOTH EZ (fast-blink) and AP (slow-blink) mode, with everything correct: iPhone on 2.4-only (5GHz radio disabled on the BGW320-500), Bluetooth on, Local Network/Location perms granted, cellular off. Forums confirm certain SYLVANIA Smart+ plugs don't work with Tuya/Smart Life/SmartThings — walled off. The SYLVANIA account also doesn't cross into Smart Life. Back-doors (LocalTuya, flashing) need the same blocked access. **Verdict:** to get plugs into HA + the Lights & Plugs card, Jeff swaps to HA-native: **Kasa KP125/EP25 (WiFi)** = easiest today (TP-Link HA integration, pairs in ~30s, app handles the 2.4 band), or **Zigbee plugs** (Sonoff S40 ZB / ThirdReality) to ride the coming Zigbee alarm coordinator. The Lights & Plugs card already auto-lists any `light.*`/`switch.*` HA gives it, so new plugs appear with no code change. **CORRECTION (07-09): the BGW320-500 5GHz radio was NEVER turned off — Jeff confirmed it's been on the whole time. My earlier "toggle 5GHz off/back on" notes were WRONG; do NOT tell Jeff to re-enable it.** The SYLVANIA plugs stay on SYLVANIA app + Alexa as-is.
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

0. **▶️ PICK UP HERE (updated 07-03).** DONE & confirmed working: Beehive **online** in the app (via the `/api/ha` proxy — solid), water+gas meters **live & correct**, real KTNWHITE21 weather **live in HA**, and **Alexa reads the real backyard temperature** (Jeff exposed `Backyard Temperature`/`Humidity` to Alexa + discovered — confirmed working). **Remaining next steps:** (a) build the **utility helper tiles** (This-Month/Flow/Cost) per `docs/beehive/ha_helpers_and_alexa.md` — sources `sensor.water_meter_reading` (÷10) + `sensor.gas_meter_reading` (÷100); app already reads `sensor.water_month/water_flow/gas_month/gas_cost` once built. (b) Fix the `HCC — Freeze Warning` automation — it points at nonexistent `sensor.outdoor_temperature`; repoint to `sensor.backyard_temperature`. (c) **🎥 CAMERAS (Blink) = JEFF'S #1 WANTED FEATURE — TOP PRIORITY, not a side quest.** He's spent 2 days on it; it's the main thing he wants in the app. **REAL root cause found (07-03, by diffing blinkpy in the harness):** Blink changed OAuth signin to signal 2FA with **HTTP 202 + `tsv_state`/`tsv_methods`**; pinned **blinkpy 0.25.2 only knew the old 412 code** → returns None → logs "Login failed" (exactly Jeff's log). **blinkpy 0.25.7 handles the 202** (`api.py:oauth_signin`). **Fix = bump `beehive/blink/manifest.json` requirements to `blinkpy==0.25.7`** (auth.py unchanged 0.25.2→0.25.7 so imports stay valid). Version marker `2026.7.0-hcc-blinkpy257`. **Pending Jeff's live test:** re-download config_flow.py + manifest.json → restart HA (installs 0.25.7) → delete + re-add Blink → creds → PIN. Bonus: once a token is obtained, `login_attributes.refresh_token` self-renews (no repeat 2FA). Earlier "empty_cookies / dedicated session" theory was WRONG (kept as harmless belt-and-suspenders). Do NOT drop this. (mPING/Mend remain non-priorities.) (d) **⛽ GAS billing sync — WAITING on Jeff's first Spire bill** (he doesn't have one yet). Water is fully bill-synced (This Cycle + Est. Water $, validated $72.42). When the Spire bill arrives: read the meter-read date → `spireCycleKey()` (mirror `whudCycleKey()`), read the exact rate (base + per-CCF/therm; Spire bills therms, 1 CCF≈1.037 therm), relabel gas "This Month"→"This Cycle", set the real rate, validate cost vs the bill's gas-charges line. Gas sensor `sensor.gas_meter_reading` raw÷100=CCF.

1. ~~**LUX setpoint control**~~ — **FIXED and confirmed working** (`b360583`). Root cause: LUX API uses `POST /api/device` for writes, NOT PUT. PUT always returned 500. Code now tries POST first, PUT as fallback. Jeff confirmed 73°F setpoint change reflected in official LUX app.

2. **Irrigation "Last Watered" / history — FIXED & CONFIRMED WORKING (2026-07; Jeff verified it reads "Last Watered 7:30 AM").** The blank card was a URL-format bug: the real B-Hyve history endpoint puts the device id in the **PATH** — `GET /v1/watering_events/{device_id}` (with `?page&per-page`) — NOT `?device_id=` (that 404s). Confirmed via pybhyve / sebr's bhyve-home-assistant. `/api/irrigation` now fetches the path form, parses events (incl. nested `irrigation[]` per-zone runs), returns `last_watered` + `history[]` (time, station, run_time, gallons). Device `status` had no history (`watering_statuses:[]`) — dead end. `?debug=2` shows the watering_events fetch status+sample. **If still blank after deploy, read `?debug=2` for the real response shape and adjust the parse.** App also self-records observed runs (`localStorage.irr_last_seen`) as a backstop. (HA path still nicest long-term once B-Hyve is in Beehive, but the direct pull now works.) Run Zone / Rain Delay still work via browser WebSocket (`?tk=1`).

3. **B-Hyve invalid_auth** — Jeff ran `sh bhyve` and saw `invalid_auth` in the HA config form. Jeff needs to:
   1. Run `sh bhyve` in HA Terminal again (gets updated files including strings.json)
   2. Restart HA
   3. Settings → Integrations → Add Integration → "Orbit B-Hyve" → enter email/password
   4. If still fails: Settings → System → Logs → search "B-Hyve login attempt" to see exact HTTP response from each of 9 API attempts

4. **🎥 Blink cameras — ✅✅ DONE / LIVE IN THE APP (07-09, Jeff confirmed all 6 cameras showing: 301 Driveway, Front Right, Back Left, 301 Backyard, Garage, 301 Front Doorbell).** THE FIX THAT WORKED: deleted our stale `custom_components/blink` override (`rm -rf`), deleted the broken Blink entry, restarted HA (already on core **2026.7.1**, which ships the fixed blinkpy 0.25.6+), re-added the **built-in** Blink integration → email/pw → **SMS PIN appeared** → done. Cameras flow to the app via `loadCameras()` (HOME → Security · Cameras). Tiles show a camera icon + "idle" until a snapshot is captured (Blink is event/battery-based — a still appears on motion or on request; optional future polish = a "refresh snapshot" button). **DO NOT ever re-add a `custom_components/blink` override — that override shadowing the fixed built-in was the entire bug.** The repo's `beehive/blink/` files are dead artifacts (leave or delete; never install). Historical root cause (for the record): Blink's 2FA now returns HTTP 202 (`tsv_state`/`tsv_methods`); old blinkpy read 202 as success so the PIN never showed → "Login failed." Fixed upstream in blinkpy 0.25.6 ([PR #1231](https://github.com/fronzbot/blinkpy/pull/1231)) → HA core 2026.6.4 ([HA PR #173811](https://github.com/home-assistant/core/pull/173811)). ~~PENDING~~ RESOLVED. (Original diagnosis below, kept for history.) **🎥 Blink cameras — JEFF'S #1 WANTED FEATURE. ✅ ROOT CAUSE + REAL FIX FOUND 07-09 (web research): the OFFICIAL upstream fix has shipped — our July-3 custom component is now OBSOLETE and is what's still failing.** Blink changed 2FA so the login endpoint returns **HTTP 202** with `tsv_state`/`tsv_methods`; old blinkpy treated 202 as success so the PIN never appeared → "Login failed." Fixed upstream in **blinkpy 0.25.6** ([PR #1231](https://github.com/fronzbot/blinkpy/pull/1231)) and pulled into **HA core 2026.6.4** by bumping the built-in Blink integration's blinkpy to 0.25.6+ ([HA PR #173811](https://github.com/home-assistant/core/pull/173811); closed tracking issues [#173419](https://github.com/home-assistant/core/issues/173419), [#154486](https://github.com/home-assistant/core/issues/154486)). Maintainer: **"no Home Assistant side changes needed"** — pure library bump. **WHY OURS STILL FAILS:** our `custom_components/blink/` override (installed 07-03 before the fix existed) is **shadowing HA's fixed built-in with stale code** — the log's `ConfigEntryNotReady` comes from OUR `custom_components/blink/coordinator.py:58`, not HA's fixed one. The earlier "empty_cookies / dedicated session" theory was a wrong guess; the real bug was the 202 handling, now fixed in the library. **✅ THE FIX (remove the workaround, use the built-in):** (1) `rm -rf /config/custom_components/blink`; (2) HA UI → Settings → Devices & Services → Blink → Delete (clears the broken retry-looping entry); (3) update HA core to **≥ 2026.6.4**; (4) restart HA; (5) Add Integration → "Blink" (built-in) → email/pw → **SMS PIN box now appears** → enter PIN. Then cameras flow to the app (HOME → Cameras) via `loadCameras()`. **CAUTION:** our old code has hammered Blink's login every ~10s for days → account may be rate-limited; after step 2 wait ~30 min before re-adding. **DO NOT re-add a `custom_components/blink` override** — that's what broke it. The repo's `beehive/blink/` files are now dead workaround artifacts (leave or delete; do not install).

5. **GPS map calibration — REWORKED 07-06 to "Pin Track to Photo" (no coordinate entry).** After a mow (track present): YARD → Yard Map → tap **Pin Track to Photo** → tap where you STARTED, tap where you ENDED. Done — the two taps pair with the track's first/last GPS points and feed the similarity transform (`gpsToXY`). Tap ✕ to redo. No lat/lon typing (the old "invalid coordinates" flow is gone).

6. **Verify sensor data live** — After Jeff hard-refreshes the app, confirm battery voltage, RPM, and mileage display. If still `0.00V` and `—`, run the curl test in the Cloudflare Infrastructure section above.

7. **Build the Beehive PANIC automation** — app already fires webhook `hcc-panic-button` with `{action:panic,siren,lights,notify:[jeff,angela,braxton]}`. Build the HA side per **`docs/beehive/panic_alarm_automation.md`**: siren on + lights strobe + Critical push to the 3 phones (HA Companion app). **Alarm = DIY Zigbee build, NOT a commercial panel and NOT purchased yet** — Jeff will add a **Zigbee coordinator stick** (~$20, e.g. Sonoff Zigbee 3.0 Dongle) into a free J45 USB port + Zigbee **siren** (~$25-35, becomes the `siren.*` entity) + contact/motion/leak sensors + smart plugs (Zigbee2MQTT or ZHA). Sequence: J45 first → RTL-SDR meters → THEN the Zigbee alarm layer. Also needs HA Companion on Jeff/Angela/Braxton iPhones. Optional real phone call = Twilio (later). Does NOT dial 911 (Jeff does that). **✅ BUILT as the HOME GUARDIAN section (07-04)** — `#section-guardian`, accent `--a-guardian`, hero `images/hero-security.jpg`, live checks from HA `/api/states` via `loadGuardian()` (see change log). It already surfaces People/Water/Electric/Gas/HVAC/Garage/Doors/Devices + PROTECTED banner + NIGHT CHECK/AWAY MODE/SYSTEM DETAILS/TEST ALERTS. As the Zigbee alarm hardware (siren/contacts/leak/motion) comes online in Beehive, those rows auto-light and the panic automation ties in — no app rebuild needed. Camera grid still lives on HOME (`loadCameras`); can be added to Guardian later if Jeff wants it consolidated.

8. **Wire the HOME Utilities strip to live data** — UI is built (3 cards). When each meter is reading in Beehive, set the real HA entity_ids in `UTIL_ENTITIES` (in `loadUtilities()`): water_today/month/flow, gas_today/month/cost, elec_now/today/month. Card auto-lights (chip → LIVE, foot → "Live from Beehive"). Remember: convert the water meter's European timestamp → Central. Gas cost = ccf × Piedmont rate; water/sewer cost feeds the City-of-White-House sewer claim.

8. **Lighthouse performance** — Score 60/100. Low priority. Main cause: unminified 300KB index.html.

8. **Lucky Mike "Smart Stall" page — QUEUED (build AFTER utilities + current docket).** Jeff's next planned section: a horse-stall monitoring page (ESP32+ESPHome→HA→app, same stack as everything else). Source plan + hero photo + my technical review are saved in `docs/lucky-mike/` — **read `docs/lucky-mike/INTEGRATION_NOTES.md` first** (it lists the ChatGPT mistakes to fix: architecture diagram funnels cameras/Shelly through ESP32 [wrong], drop the redundant microSD + USB-power-bank, DS18B20 dup/misspelling, Phase 3 total mislabeled "Phase 2", Platinum-vs-Elite name clash, Phase 4 GPS reality check). When built: new "STABLE" section, own `--a-stable` accent, Section-Kit only, hero = `lucky-mike-hero.jpg`, live tiles from HA `/api/states`, branding "Smart Stall™ — Because They're Family." Do NOT start until Jeff says the current docket is clean. **Business side also captured** in `docs/lucky-mike/`: `BOM_OPTIMIZED.md` (cheaper local parts; fan = plug-in power-monitoring smart plug since each stall has a 120V outlet + strong Wi-Fi) and `PRICING_AND_BUSINESS.md` (labor-loaded pricing — ChatGPT's deck had NO labor; recommended go-to-market = **barn owner offers it as a paid amenity / Model B**; build Lucky Mike's at cost as the demo; CFO/liability/LLC checklist since Jeff's wife Angela is a CFO and may resell to boarders).

9. **📺 Fire TV motion pop-up alerts — ✅ DONE, LIVE, CONFIRMED WORKING END-TO-END (07-11).** Fire TV paired to HA two ways: **Android Debug Bridge** (`media_player.fire_tv_viewing_room`, direct ADB — used for the original device pairing) and **`alexa_media_player`** HACS integration (Jeff completed the Amazon login himself — Claude never handles credentials) → real control entity **`media_player.jeffrey_s_fire_tv`**. Built a **new standalone automation "AI Show Camera on Fire TV"** in `packages/hcc.yaml` (appended after `AI Notify Mute Action`, before `script:`) — triggers on the same `codeproject_ai.object_detected` event as `AI Object Detected Notify`, independently deriving its own `camera_key` (same slug pattern, e.g. `301_driveway`) so it doesn't depend on that automation's internal state. Fires only for `object_type in ['person','vehicle']`, gated by the **exact same mute-check template** used by the phone-notification path (`input_datetime.hcc_ai_mute_<camera_key>`), so the existing 🔇 "Mute 15 min" push button also silences the TV pop-up. Action: `media_player.play_media` with `media_content_type: custom`, `media_content_id: "show me the {{ camera_key | replace('_',' ') }} camera"` targeted at `media_player.jeffrey_s_fire_tv` — mimics speaking the command to it, which makes Alexa pop the live camera view up on screen. **Verified twice**: once with a direct manual service call (Jeff confirmed on the TV screen), once with a full simulated `codeproject_ai.object_detected` event fired via `hass.callWS` (vehicle/driveway) — **both the phone push notification AND the Fire TV camera pop-up fired correctly**, confirmed by Jeff. **Bumpy edit process, worth remembering:** the legacy "File editor" HA add-on's editor mishandled special keys (typed "Page_Down" as literal text into the file at one point); switched mid-session to installing/using the **Studio Code Server** add-on instead (real VS Code, much more reliable) — but even there, **VS Code's "format on save" (Prettier) reformatted the entire file on `Ctrl+S` and truncated/corrupted the new automation's long single-line flow-YAML**, silently breaking `packages/hcc.yaml` (caught immediately via `check_config`, not left broken). Both corruptions were fixed precisely via the **Terminal add-on** (real shell, SSH into HA core) using `sed`/heredoc — far more reliable than any GUI editor for this file. **Lesson for next time editing `packages/hcc.yaml`:** use the Terminal add-on directly, or if using Studio Code Server, disable format-on-save first (`editor.formatOnSave: false`) before touching this file — its dense flow-style YAML doesn't survive Prettier's reformatting. **Update (same day, 07-11): arrival-suppression automation also built and deployed**, this time entirely via the **Terminal add-on** (lesson applied — zero editor corruption issues this round). New automation **"AI Arrival Suppression"**: triggers on `person.jeff_loewen` or `person.angela_loewen` going `not_home`→`home`, then loops (`repeat.for_each`) over all 3 monitored cameras (`301_backyard`/`301_driveway`/`301_front_doorbell`) setting each `input_datetime.hcc_ai_mute_<camera>` 10 minutes out — reuses the exact same `input_datetime.set_datetime` pattern as the existing manual mute button. **Angela now has her own HA login** (`angela301`, Settings → Users, password set by Jeff not Claude) and a linked **Person entity** (`person.angela_loewen`, created without a login link since her user account already exists separately) — walked Jeff through installing the HA Companion App + generating her own Long-Lived Access Token for the HCC app on her phone. **Bonus feature added:** a **10-mile passive Zone** (`zone.almost_home`, centered on home coords) + a new automation **"Angela Almost Home"** — fires `notify.mobile_app_jeffs_iphone` when `person.angela_loewen` enters that zone, so Jeff gets a heads-up ~10 min before she arrives (depends on her phone actively reporting location once she installs the Companion App — not yet verified live since she hadn't set it up yet this session). **10 automations total now**, all confirmed loaded via `ha core check` (valid) + restart + HA Automations dashboard count. **Update (same day, 07-11, later): AI detection expanded from 3 cameras to all 6.** Jeff asked why only `301_backyard`/`301_driveway`/`301_front_doorbell` were AI-monitored, out of 6 total Blink cameras (`front_right`, `back_left`, `garage` were never wired up — no documented reason found, looks like they just weren't included in the original 07-10 CodeProject.AI setup). Added the missing 3 via the **Terminal add-on** directly (proven reliable pattern from above): (a) 3 new `image_processing:` entries in `configuration.yaml` matching the existing pattern exactly (same CodeProject.AI server `192.168.1.194:32168`, same person/vehicle/animal targets); (b) 3 new `input_datetime.hcc_ai_mute_<camera>` helpers in `packages/hcc.yaml`; (c) extended `AI Camera Scan on Motion`'s trigger entity list AND its Jinja lookup map (both edited in-place via precise `sed` string substitution on the single flow-style automation line — safer than trying to insert/reformat, avoided all editor-corruption risk); (d) extended `AI Arrival Suppression`'s `repeat.for_each` list to cover all 6 camera slugs. `AI Object Detected Notify` and `AI Show Camera on Fire TV` needed **no changes** — both already derive `camera_key` generically from the triggering entity_id, so they automatically cover any camera wired into `image_processing:`. **Verified live**: simulated a `codeproject_ai.object_detected` event for the garage camera (previously unmonitored) — Jeff confirmed he got the phone notification AND Fire TV pop-up for the garage camera specifically, nothing crossed over to other cameras. **All 6 Blink cameras are now fully AI-monitored** with TV pop-up, phone notify, mute button, and arrival-suppression all working uniformly across the board.
   **Note for future edits to this file:** the Terminal add-on (SSH into HA core) is now the established reliable method for editing `packages/hcc.yaml` — Studio Code Server works too but its Prettier format-on-save corrupted the file earlier this session (see above) and must be disabled first if used. The old legacy "File editor" add-on (`core_configurator`) should be avoided entirely — its editor mishandles special keys and nearly corrupted the file (a stray `Page_Up` keypress got typed as literal text at one point, caught before saving).
   **Update (same day, 07-11, even later): fixed Siri "Announce Notifications on Speaker" not reading alerts aloud — ✅ confirmed working.** Jeff has iOS's Siri feature (Settings → Accessibility → Siri → Spoken Responses → "Announce Notifications on Speaker") enabled for Home Assistant, expecting alerts to be spoken aloud through the phone's own speaker (no AirPods needed — this is a real iOS 16+ feature, not the older AirPods-only "Announce Notifications"). It wasn't speaking. **Root causes found (two, both real):** (1) **`AI Object Detected Notify`'s push payload used `interruption-level: active` for vehicle detections and `interruption-level: passive` for animal detections** — iOS's Announce feature only reads aloud notifications marked `time-sensitive` or `critical` by default; only "person" detections (already `critical`) qualified. Fixed via the Terminal add-on with two precise `sed` substitutions: `interruption-level: active` → `time-sensitive` (vehicle) and `interruption-level: passive` → `time-sensitive` (animal) — both were confirmed unique matches in the file before replacing, so no risk of hitting the wrong branch. **This means all 3 object types (person/vehicle/animal) now send push notifications; only the interruption-level changed, not the mute/routing logic** — animal detections still route through the same per-camera mute gate as before, just now eligible for Announce. (2) **iOS's Announce Notifications on Speaker only fires when the phone is locked with the screen off** — this is Apple's actual by-design behavior (confirmed via research, not a bug), not something any HA-side setting can change. Jeff was testing with the phone unlocked/in active use the first several attempts, which is why nothing spoke even after settings looked correct. **Verified live** after both fixes, phone locked: simulated `codeproject_ai.object_detected` events for both vehicle (driveway) and animal (backyard, "cat") — Jeff confirmed both announced aloud correctly. **If Jeff ever wants animal alerts back to silent/non-critical** (original intent was "don't bug me about the cat"), the fix here made them share the same priority as vehicle alerts — that's an explicit tradeoff he asked for this session, not an oversight.

10. **🐛 Desktop-wide-browser layout gap — found 07-11, NOT fixed (app-code/CSS, cloud session's to fix).** On any browser window wider than ~700-900px, hero sections (`.sec-hero-weather`/`-irr`/`-yard`/`-guardian` etc.) leave a large dead black area to the right instead of filling the window — looks perfect on phone, only shows on desktop. Root cause: those classes set `aspect-ratio` + `max-height:460px` with no `width`/`max-width`, and there's no centered max-width shell anywhere around the app. Once a wide window makes the box hit the height cap, CSS derives width from the aspect ratio (~700px) instead of the viewport, and nothing centers the result. Confirmed identical on both loewenhome.com and toro1-5rz.pages.dev (not a caching/deploy issue). Fix = either wrap the app in a centered max-width shell, or make hero containers properly fill the viewport width on wide screens.

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

**📄 WHUD BILL REFERENCE (from Jeff's bill photo IMG_0844, 2026-07):** provider **White House Utility District**; **Meter ID `25394131`** (= Kamstrup register S/N); **billing cycle reads ~the 21st–22nd** (bill shown: 5/21→6/22/2026, 32 days); **Usage 6,839 gal** that cycle (Current Reading 9640, Previous 2801). **WATER RATES eff 2026-01-01: Base $10.32 + $0.00908/gallon** (meters under 1"); + sewer + sales tax (that bill: water $72.42, tax $7.06, total $79.48). **✅ READING QUESTION RESOLVED (Jeff was right — the transmitted MIU reading IS the meter reading; don't send him to read the LCD).** The bill's "reading" column (9640) is WHUD's **register-unit** value, NOT gallons — that's why it didn't match our raw÷10=12,984 gal (which matches the physical LCD). Gallons/usage/cost are what matter and they come straight from the transmission. **BUILT (07-03):** water card now shows **This Cycle** (usage since the ~21st WHUD read date, via `whudCycleKey()`, not calendar month) + **Est. Water $** = `$10.32 base + gallons×$0.00908`. **Validated against the real bill: 6,839 gal cycle → $72.42, exactly the bill's Water Charges line.** (Sewer + sales tax billed on top — not in the estimate.) Divisor ÷10 confirmed correct by this match.

**Hardware:**
- **Meter:** Kamstrup **flowIQ 2100** (CONFIRMED from clear meter photos 2026-07). Type No `02U23C036EC`, 5/8" 25 GPM, 250 PSI, IP68, mfg 2023. **S/N `25394131`** (suffix `/W8/2…`), **Con. `0100200123033`**, **Ver `K1`**. LCD read `0012636.56 Gal` at photo time. Kamstrup flowIQ family broadcasts encrypted **wireless M-Bus** (wmbusmeters driver ~ flowiq2200/multical21).
- **✅ READ PATH CONFIRMED (2026-07, WHUD meter supervisor came to the house and briefed Jeff in person):** WHUD reads the meter via the **separate external MIU in the pit** (MODEL `100WD` / `EFW-1300-401`, IC `8640-100WD`), NOT the Kamstrup register's own radio. Confirmed specs:
  - **Endpoint / ERT ID: `79453337`** — this is the ID we filter on.
  - **UNENCRYPTED — open, no key.** ← the AES-key blocker is DEAD. We do not need it.
  - **Protocol: Itron `ERT-SCM`** (Standard Consumption Message) — same family as the gas meter.
  - **Frequency: hops across ~`915–930 MHz`** on each transmit (standard Itron ISM behavior; RTL-SDR scans the band).
  - **Cadence: an `SCM` every ~1 minute + a larger read hourly.**
  - **⚠️ TIMESTAMP QUIRK: the meter reports EUROPEAN time** (Kamstrup is Danish) — **convert to Central (America/Chicago) in the decode/display code** wherever a meter timestamp is used.
  - **Net effect:** water is now read the SAME way as gas — unencrypted Itron ERT via **RTL-SDR + rtl_433/rtlamr**. No CC1101, no ESP32, no AES key. One dongle reads both meters. Do NOT tamper with the utility-owned MIU/wiring.
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

**~~BLOCKER~~ RESOLVED (2026-07):** The AES-128 key question is moot — the utility reads the
unencrypted `100WD` MIU (ERT-SCM, endpoint `79453337`), so **our decode path needs NO key.**
We read that MIU with RTL-SDR + rtl_433/rtlamr, same as gas. (Jeff did save an entry in Apple
Passwords earlier as a just-in-case; it's not needed for this read path. If we ever wanted the
Kamstrup register's OWN encrypted wM-Bus instead, that would need the key — but there's no
reason to now.) The **CC1101 + ESP32 + wM-Bus/AES firmware stack Jeff built is now a backup
path only** — the RTL-SDR is the primary, simpler route for BOTH meters.

**Reader box — placement + remaining hardware:**
- The reader box is a **Wi-Fi device** → does NOT need to be near the HCC/HA. Put it where it best HEARS the meters; it just needs power + Wi-Fi and sends to HA over Wi-Fi.
- **Gas** (exterior wall) = easy from inside/garage. **Water** (underground pit, metal lid, curb) = the hard one. Try a windowsill facing the meters first; if water is weak → taller/better 915 antenna at the window, or move the box to the garage/an IP65 box near the pit.
- **Besides ESP32 + CC1101:** 5V USB adapter+cable (~$5), F-F jumpers (~$2), a good 915 MHz SMA antenna (+ optional SMA pigtail to window, ~$6), small enclosure (IP65 if outdoor, ~$8-12). **No level shifter** (both 3.3V).
- **Beehive (HA) is the hub/display — it has NO radio; it can't read the meters by itself.** It needs a receiver feeding it (ESP32+CC1101, or an RTL-SDR).
- **Radio/firmware path depends on protocol:** gas is **Itron ERT** (different decode than the Kamstrup wM-Bus stack Jeff built). Easiest Itron path = cheap **RTL-SDR (~$25-35) + rtlamr/rtl_433** — can plug **straight into the Beehive host** (Pi/NUC/HA Green-Yellow w/ USB) as an add-on, **IF Beehive is within radio range of the meters** → no separate box. If Beehive is out of range, put the radio near the meters (ESP32+CC1101 Wi-Fi box, or a small Pi+RTL-SDR) reporting back over Wi-Fi. Keep **ESP32+CC1101** for the Kamstrup wM-Bus path. **Beehive = Beelink J45 x86 mini-PC (has USB) → RTL-SDR can plug straight into it.** Remaining unknowns: is HA bare-metal/supervised (USB works) vs a VM (needs passthrough), and does the Beelink sit within range of the meters. Pick the road once WHUD confirms the water radio/protocol.
- **SHOPPING — the ONLY new buy needed (~$40):** one **RTL-SDR dongle kit** (e.g., RTL-SDR Blog V4, includes antenna + USB extension) into the Beelink. It's the universal receiver: reads gas Itron ERT now (rtlamr/rtl_433, no key) AND water either way (Itron ERT = no key; encrypted Kamstrup = wmbusmeters + the AES key); tunes both 868 & 915. Jeff already owns the Beelink + ESP32 + CC1101 (CC1101 = backup for the encrypted-Kamstrup case). Software = free HA add-ons. Optional later (only if water pit reads weak indoors): a dedicated outdoor 915 MHz antenna (~$15-20) — don't buy until proven needed.

- **DRIVERS — none needed for the real setup.** The RTL-SDR plugs into the **J45 (HA OS)** and we use the **rtl_433 add-on**, which ships the Linux driver — **NO Zadig / SDR# / WinUSB** (those are Windows-only; Jeff found a Windows SDR# guide — it's the wrong path for us). HA auto-detects the dongle. **Optional bench test on the beast** (confirm dongle + actually see/decode the gas+water meters before integrating): install **Zadig** (WinUSB driver) + run **rtl_433 for Windows** (SDR# optional, visual only); enable **Tuner AGC**. Do NOT install Windows drivers just to use it in Beehive.

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
- **Home Assistant instance:** "Beehive" — local `homeassistant.local`/`192.168.1.66`; **remote (primary) `https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa`** (Nabu Casa / HA Cloud)
- **Weather Underground PWS:** station **`KTNWHITE21`**, API key **`0e87ee079c0147a787ee079c01d7a75d`** (Jeff owns the station → free PWS key). Used by `functions/api/weather.js` AND the HA "Weather Underground" integration (so Alexa can read his real station — see `docs/beehive/ha_helpers_and_alexa.md`).
- **Mower:** Toro TimeMaster 21200
- **Jeff wired his own house** — he is skilled and comfortable doing his own electrical work in the breaker panel. Never suggest hiring an electrician. Talk to him as a capable peer on electrical/hardware.
- **Jeff is almost 60 and learning** the software/AI side — be patient and clear there, never condescending. But on hands-on hardware/electrical/firmware he is experienced. Make it enjoyable.
