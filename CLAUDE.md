# HCC Toro TimeMaster 21200 — Project Memory

**READ THIS ENTIRE FILE BEFORE TOUCHING ANYTHING.** This is the single source of truth for every AI session. Do not guess. Do not ask Jeff to re-explain. Everything you need is here.

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
8. **NEVER put `<script>` or `</script>` tags inside the JS block of index.html** — this causes a fatal blank page (the great blank-page incident of 2026-06-23). Raw text only inside the JS block.
9. **Always check `git log` and this file before changing anything**
10. **Be proactive** — find and fix bugs before Jeff sees them. Do not wait for Jeff to report issues.
11. **Keep this file LEAN (memory hygiene)** — it's injected into every message, so bloat costs efficiency (and money) on every turn. Condense finished work into the **Change Log** (one line each); never paste full commit-hash lists or blow-by-blow narratives — that detail lives in `git log`. Trim reference sections when they go stale, and periodically re-condense the whole file (as Jeff directed 2026-07-28) rather than letting it only ever grow. Target: well under 400 lines.
    - **PROTECTED — NEVER trim or compress:** "Jeff's Message", "The Working Relationship", these "Mandatory Rules", and the "Debugging Protocol" below. These come FIRST, before any technical work, every session. Compression only ever touches history/changelog/reference — never the relationship. They are the point of the whole project.
12. **ATTACK THE SOURCE, TEST ON MY END — never push the run-around to Jeff (PROTECTED, Jeff's standing rule 2026-07-03).** See the Debugging Protocol below. Jeff depends on me to know what I can fix and to test it myself. Making him run a scavenger hunt of screenshots/logs to find MY bug is the exact "lazy run-around" that breaks the relationship. Don't do it.
13. **TELL JEFF WHEN TO USE HIS LOCAL COWORKER (Jeff's rule 2026-07-09).** Jeff runs a **Claude "coworker" on his PC (the beast)** with real computer/local access. It can do what THIS cloud session CANNOT: reach his **home LAN + Beehive/HA directly** (read/click HA, install `custom_components`, restart HA, enter PINs), touch **local files** on his PC, drive **apps on his screen**, and **open/verify external links** in a real browser. THIS session owns the **app code, Cloudflare repo/deploys, research, and guidance**. Jeff doesn't know either of our full capabilities, so **it's on ME to proactively flag the handoff**: whenever a task — or a single step of one — is better done hands-on on his machine or inside Beehive, SAY SO and hand over a crisp, copy-pasteable instruction.
    - **COORDINATION (avoid two-Claude collisions on the same branch):** the coworker treats app code (`index.html`, `functions/`) as **READ-ONLY reference** and does hands-on local/Beehive/web work; **THIS cloud session owns ALL app-code edits + commits + pushes.** Coworker runs `git pull` at the start of each session to get the latest `CLAUDE.md`. Confirmed working since 07-09.

---

## 🛠️ Debugging Protocol — Attack the Source, Test on My End (PROTECTED — Jeff's standing rule)

> Jeff, verbatim (2026-07-03): *"Log this so we don't go through this kind of round robin of checks again and we attack the source… I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end."*

When ANYTHING is broken or misbehaving, in this order — **before asking Jeff to check a single thing:**

1. **Reproduce/verify on MY end first.** Read the actual code path end-to-end. Run the **Playwright harness** with **mocked data** to reproduce the failure and prove the fix.
2. **Audit my own recent changes as the prime suspect.** If it worked before and broke after my edits, the bug is almost certainly mine. Diff my changes; don't blame his setup or his network.
3. **Attack the root cause, not the symptom.** Ask "why is this whole *class* of problem possible?" and remove it. Prefer the architectural fix that makes the failure impossible, not a bigger timeout/retry.
4. **Only ask Jeff for what I genuinely cannot get myself,** and be upfront about that limit early. Say plainly: "I've tested X, Y, Z on my end; the one thing only you can see is ___."
5. **One specific ask, not a list.** If blocked, name the single thing I need — never a pile of "try this, then that, send me this log."
6. **Match his effort to the payoff.** Before asking him to edit configs / pull logs / take screenshots, first ask: could I have caught this with my own harness? If yes, do that instead.
7. **On the HCC project specifically, this file (`CLAUDE.md`) IS the first research step** — before web search, before live HA/browser investigation. It already contains validated rate formulas, meter serials, endpoint IDs, and a dated change log of exactly what was fixed and why. Grep/read the relevant section here first; only fall back to live exploration or web research for what this doc doesn't cover.

**Known fragile pattern (don't repeat):** any new `fetch(base + '/api/...')` straight from the browser to HA. Use **`haFetch()`** (routes through `/api/ha`). Never hoist a shared `AbortSignal.timeout` across retries. Keep timeouts generous for the Nabu Casa relay.

---

## Mandatory Pre-Session Checklist

1. Read this entire file
2. Run `git log --oneline -15` to see recent changes
3. Run the Playwright diagnostic (see Testing section below)
4. Note what's working and what's broken before touching anything
5. Fix any broken state FIRST before doing new work

---

## What This Project Is

A Progressive Web App (PWA) for Jeff's Toro TimeMaster 21200 lawn mower, grown into a whole-home command center. Single `index.html` file deployed on Cloudflare Pages.

- **Live URL:** `https://toro1-5rz.pages.dev` (also `loewenhome.com`)
- **Cloudflare Pages project name:** `toro1`
- **Repo:** `d4c2np9f69-afk/master-the-master-`
- **Active branch:** `claude/time-master-project-liq1jw`
- **`main` branch:** contains only `Toro_TimeMaster_PWA_Package.zip` — do NOT use it for deploys

Six sections: **HOME**, **WEATHER**, **IRRIGATION**, **YARD** (mower data), **GUARDIAN** (whole-home safety/security/alarm — LUX thermostat lives here too), **CAR** (vehicle switcher: Mercedes GLE 350 + Ford F-250).

**🛡️ HOME GUARDIAN is the designated home for ALL Home Assistant security, home-alarm, and system checks (Jeff, 07-04).** Every future security/alarm feature goes here, built from the Section Kit + `--a-guardian` accent, live from HA `/api/states` via `loadGuardian()`.

---

## Project Goals (what every session should move forward)

- App always fully working across all sections (nav, modals, tabs)
- Live sensor data flowing from ESP32 → app (battery/RPM/GPS/mileage)
- GPS map track persists across mow sessions
- Maintenance log (LOG MOW / LOG SERVICE / SET HOURS) working, saved to `localStorage` key `toro21200`
- This file stays accurate and current — it's the persistent memory; any AI reading it should need to ask Jeff nothing

---

## Deployment Pipeline

**GitHub Actions is broken and irrelevant** (missing `CLOUDFLARE_API_TOKEN` secret — do not try to fix, it doesn't matter).

**Actual deployment:** Cloudflare Pages' native Git integration watches `claude/time-master-project-liq1jw` and auto-deploys on every push — live at `toro1-5rz.pages.dev` within ~60 seconds.

---

## Cloudflare Infrastructure

| Resource | Name | ID |
|---|---|---|
| KV Namespace | `MOWER_KV` | `ec5b28597d9c4fb9b182b1aea1d50eff` |
| KV Binding (Pages env var) | `MOWER_KV` | maps to the KV namespace above |
| Pages project | `toro1` | — |

**CRITICAL — KV Binding:** variable name is `MOWER_KV`. Code must reference `env.MOWER_KV`. `getKV(env)` in `functions/api/hours.js` tries `env.HCC_KV || env.MOWER_KV` — covers both names, do NOT remove this dual-check. KV key `hours_data` stores the latest ESP32 payload.

**Manual pipeline test:**
```bash
curl -X POST https://toro1-5rz.pages.dev/api/hours -H "Content-Type: application/json" -d '{"hours":0.1,"battery":12.6,"rpm_peak":3200,"source":"test"}'
curl https://toro1-5rz.pages.dev/api/hours
```
If GET returns `{"source":"stub"}` after a POST, the KV binding is broken in Cloudflare Pages settings.

---

## Engine Hours

Total displayed (`S.hours`) = `S.hoursBaseline` + the sensor's cumulative `d.hours` (runtime since the ESP32 was installed, NOT lifetime hours). `S.hours` only ever moves FORWARD from a sensor sync (protects against a sensor reset).

**Master Hour Calibration:** header button **⏱ SET HOURS** (or tap the hour-meter display) lets Jeff enter the TRUE hours off the mower's physical meter. It sets `S.hours` everywhere AND re-syncs `S.hoursBaseline = trueHours − S.lastSensorHours` so future sensor runtime keeps totaling correctly (can correct down too, with a confirm prompt). Default baseline = 5.9 (fresh install). Fix for "sensor missed a mow, hours are off": read the physical meter, type it in, done.

---

## Sensor / ESP32 Hardware

Custom ESP32 running Arduino `.ino` firmware (NOT the ESPHome YAML in `beehive/esphome/hcc-mower.yaml` — that's a separate, never-flashed config, don't confuse them), permanently mounted on the mower, powered by its 12V battery.

**What it posts:**
- Every 90s when `engine_on` (RPM > 200): full sensor payload to `/api/hours`
- Every 5 min when engine OFF: heartbeat (`engine_running: false`, battery, WiFi RSSI, temp, `source: "heartbeat"`)

**Fields read from `/api/hours` GET:** `hours, battery/voltage variants, rpm_peak/avg, dist_total_m, dist_session_m, speed/gps_speed, lat/lon/has_fix/track[], pitch/roll/vibration, shock_events, wifi_rssi, esp_temp_f, mpu_ok, gps_rx, source, lastSync, engine_running`

**Status messages:** `source==='stub'` → orange "not connected yet"; `source==='heartbeat'`/`engine_running===false` → green "Engine off · Box connected"; else → gray live telemetry line.

---

## index.html Structure

- HTML/CSS (sections, heroes, cards), then a single `<script>` block containing all JavaScript, then closing HTML. Single file, several thousand lines and growing — check `wc -l` for the current count.

**CRITICAL:** NEVER put a `<script>` or `</script>` tag inside the JS block — fatal JS SyntaxError that blanks the entire app (the 2026-06-23 blank-page incident, commit `8497827`).

**`localStorage` key:** `toro21200` — the full `S` state object including `sensorTrack`.

**CSS class names (do NOT rename):** Modal `.modal-ov`/`.modal-ov.show`, `.modal-box`, `.mbtns`, `.mbtn`/`.mbtn.primary`/`.mbtn.secondary`, `.btn-green`. Nav: `button.snav-btn` (`#snav-home/weather/irr/yard/guardian/car` — keep swipe-nav `SECTIONS`/`NAV_IDS` arrays in the same order as the section DOM). Sections: `#section-home/weather/irrigation/yard/guardian/car`. YARD tabs `button.tab`. CAR tabs `button.car-tab` (scoped `carTab()`, not global `showTab()`); tab bars `#car-merc-tabs`/`#car-ford-tabs`. Vehicle picker `.car-picker`/`button.car-pick` (`#pick-merc`/`#pick-ford`), `carSwitchVehicle('merc'|'ford')`.

---

## 🎬 Hero Image Gold Standard (mandatory for every section, current & future)

Every hero — including any NEW section — MUST use the shared hero-grade module. Never grade a hero individually.

- **`.hcc-hero-grade`** (CSS) — the one cinematic color grade for every hero `<img>`.
- **`.hcc-hero-vignette`** (CSS) — warm-center/dark-edge vignette, paints under text overlays.
- **`applyHeroGrades()`** (JS, runs at INIT) — auto-tags every `.house-hero`/`.sec-hero`/`.hcc-hero` container + its `<img>`.

**To add a hero for a new section:** put the photo in an `<img>` inside a `.sec-hero` (or `.house-hero`/`.hcc-hero`) container with a descriptive `alt`. That's it — do NOT add a per-hero `filter` CSS (fights the shared grade); if a hero needs a nudge, adjust the shared `.hcc-hero-grade` values (affects all, keep them unified). Never re-shoot a photo just to "fix" tone.

---

## 🎨 Visual Consistency Gold Standard (design tokens + section kit)

**Tokens (`:root`):** Status `--ok`/`--warn`/`--bad`/`--info` — never hardcode these hexes, use the token or `statusColor(level)` helper or `.s-ok/.s-warn/.s-bad/.s-info`. Brand `--gold/--text/--muted/--dim/--bg/--surface/--card/--border/--serif`. Every NEW section gets its own `--a-<id>` accent (nav underline + card-title bar). Shape `--radius` (10px).

**Section Kit — build every new section from these, no bespoke markup:** `.sec-hero` + `<img>`; `.card` + `.card-title` (`.cat-<accent>`); spec rows `<ul class="spec-list"><li><span class="sk">Label</span><span class="sv">Value</span></li></ul>`; status banners `.wx-banner`/`.wx-load`/`.wx-go`/`.wx-caution`/`.wx-no`; buttons `.btn-full`+`.btn-gray`/`.btn-green`/`.btn-red`; external links use a real `<a target="_blank" rel="noopener">` styled as a button, NOT `window.open` (no-op in installed iOS PWA).

**Theme:** toggle in header, `toggleTheme()`, persists in `localStorage.hcc_theme` (default light). Implemented as `html.light{…}` overriding only the design tokens — drive all text/borders from tokens (`var(--text)` etc.), **never hardcode a light text color** on a card (vanishes in light mode).

**Typography:** ONE font everywhere — `--font` and `--serif` both point at the Apple system stack. Never reintroduce a serif or second font family.

---

## Key Files

```
index.html                        — entire PWA (single file)
service-worker.js                 — cache version: hcc-v10
manifest.json                     — PWA manifest
functions/api/hours.js            — GET/POST sensor data ↔ Cloudflare KV
functions/api/auth.js             — family login (see Family Login below)
functions/api/ha.js                — server-side proxy to HA (Nabu Casa)
functions/api/climate.js          — LUX thermostat via Azure B2C + myluxstat.io
functions/api/weather.js          — WU KTNWHITE21 + Open-Meteo fallback
functions/api/mowconditions.js    — Open-Meteo hourly mow conditions proxy
functions/api/irrigation/index.js — GET B-Hyve status + ?tk=1 session token
functions/api/irrigation/control.js — POST B-Hyve control (legacy fallback)
functions/setup.js                — serves Beehive install script at /setup
beehive/esphome/hcc-mower.yaml     — ESP32 heartbeat config (NOT flashed to hardware)
images/                           — hero-home.jpg, hero-irr.jpg, hero-yard.jpg, hero-guardian.jpg, hero-car.jpg
icons/                            — icon-192.png, icon-512.png
```

---

## Family Login (`functions/api/auth.js`)

Lets Jeff/family log in with just a shared password instead of pasting an HA token per device. Server holds the real HA token; app only ever handles the password.

- `POST /api/auth {"action":"setup","password":"...","ha_token":"..."}` — **one-time only**, hashes (SHA-256) and stores `auth_hash`/`auth_ha_token` in the `MOWER_KV`/`HCC_KV` KV namespace. Refuses to run again if `auth_hash` exists (`{"error":"already_setup"}` — expected, not a bug).
- `POST /api/auth {"password":"..."}` — normal login, compares hash, returns `{"ok":true,"ha_token":"..."}`.
- **Setup already done and verified working (2026-07-21).** Do not re-run `action:"setup"`.
- **To reset/rotate:** delete `auth_hash` (and `auth_ha_token` if rotating) from KV via the Cloudflare dashboard, then re-run setup with new values.
- The actual password/token are intentionally NOT recorded in this repo — only hashed in KV. If they ever need changing, ask Jeff directly.

---

## Testing — Playwright Diagnostic

Always run before reporting anything as done.

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

Expected: all tests passing. If any fail, fix them before doing anything else.

---

## Change Log (condensed — full detail always in `git log`; one line per session's work)

- **07-31 (coworker, later):** **Root-caused "Fire TV camera popup notifications missing or 10-15 min late."** Jeff's actual complaint: motion → Blink → CodeProject.AI → auto-show-camera-on-Fire-TV pipeline was unreliable. Checked HA history/logbook directly: `binary_sensor.301_driveway_motion` (and siblings) never transitioned to `on` even once across 3 full days, only flickering `off`↔`unavailable` — meanwhile the known recurring `blinkpy.auth.LoginError` crash (see 07-28 entry below, tracked upstream at home-assistant/core#176836 and fronzbot/blinkpy#1217, no confirmed fix in either as of this session) was caught live in the log during this session. Root cause: that crash leaves Blink's sensors stuck at a stale value instead of going `unavailable`, so the existing `HCC Watchdog` (which only triggers on `to: unavailable`) can't detect it — explains both "missing" and "very late" (only recovers on the next manual HA restart). **Fix:** new automation `HCC — Blink Auto-Heal` (id `hcc_blink_auto_heal`), triggers on `system_log_event` where `level` is ERROR/CRITICAL and logger `name` contains "blink" (keyed on logger name, not message text — matches the exact `custom_components.blink.coordinator` logger seen in the real crash, avoids false positives), calls `homeassistant.reload_config_entry` on Blink's entry (`01KY0MYHR8VN4646FQDSXA7VDC`) + notifies Jeff's phone. Converts a 10-15+ minute (or multi-day) outage into a few-second self-heal. Condition template verified via `/api/template` against real ERROR/WARNING/non-Blink cases; the actual `reload_config_entry` action was live-tested and reconnected cleanly with zero errors. Jeff's picture-in-picture idea (so camera popup doesn't take over the whole TV) is a real, matched community pattern (the "PiPup" Android app, triggered via ADB intent) but needs a new app installed on the physical Fire TV — held pending Jeff's go-ahead, not done this session.
- **07-31 (coworker):** **Root-caused and fixed "new automations silently don't save"** (open since 07-28). `configuration.yaml` had no `automation: !include automations.yaml` line — all real automations lived inside `packages/hcc.yaml`'s own `automation:` key, so any automation created via the UI wrote successfully to `automations.yaml` (confirmed via direct API GET) but nothing ever loaded that file — no error, because from HA's config tree it was never referenced. Added the missing include line, restarted HA: 3 real orphaned automations came alive (`HCC Watchdog — Integration Down Alert`, `HCC — Auto Launch Sling on Fire TV Wake`, `HCC — Recorder Down Watchdog`), plus 2 exact duplicate copies of the Recorder Watchdog (from repeated failed-looking save attempts) which were deleted first so they wouldn't triple-fire. Also: water/gas meters going "unavailable" was **not** the 07-28 WHUD pit-radio theory — that's a real separate finding, but the proximate cause blocking both meters was the rtlamr2mqtt add-on losing the RTL-SDR USB device (`No supported devices found`, add-on restart didn't clear it) — fixed by a full Beehive host reboot, which resets the USB bus. `HCC — Freeze Warning` automation removed entirely per Jeff's request (was a recurring annoyance, backyard temp already covered via Alexa) — see Pending Items, item removed.
- **07-31:** Full stability audit (3 parallel passes: HA/fetch layer, forms/localStorage, CSS/DOM consistency) run proactively after Jeff flagged the app breaking constantly. Found and fixed: **~20 external-link buttons across YARD/WEATHER used `window.open()`, a no-op in an installed iOS PWA** — converted to real `<a target="_blank">` (new `openExternal()` helper for the 2 spots needing JS logic first) + added missing `.vbtn`/`.upg-btn`/`.filter-row` CSS that had zero styling; 3 HA calls (`loadIrrigationFromHA`, `haIrrToggle`, `blinkSendPin`) bypassed `haFetch()` with short timeouts, same class as the "Beehive Offline" bug; the one unguarded `JSON.parse` in the file (state load on boot) — same failure class as the 06-23 blank-page incident; `saveSvc()` had no input validation unlike its siblings; `save()`/credential-save failures were silently swallowed; deleted dormant Mercedes-PIN-in-localStorage code that contradicted the 07-24 server-side-PIN invariant. Electric rate constant also updated same session (see below).
- **07-28:** Utility tiles (water/gas/electric) fully fixed — entity wiring, cost math, billing history, water Flow, electric Now/Today — all validated against Jeff's real bills. Root cause of several bugs: fields were gated behind conditions that silently skipped them once the real HA helper existed. Recorder was dead 07-02→07-28 (missing `default_config:`), now fixed — explains why history only goes back to the fix date. B-Hyve confirmed already working (was never broken — don't re-investigate `coordinator.py` without a fresh real error).
- **07-26:** Garage Door card built (app-side done, `loadGarage()`/`garageToggle()`); needs the **ratgdo board** (myQ is permanently API-blocked by Chamberlain, no software fix exists — see Garage Door section).
- **07-24:** F-250 added to CAR with vehicle switcher (see CAR reference below). CAR PIN prompts removed — mbapi2020 handles PIN server-side, app must never send a `pin` field. Fire TV motion pop-up fixed (`cmd media_session dispatch pause`, not the no-op `keyevent 127`).
- **07-23:** Sewer billing calibrated + shown separately from water; billing-history tracking added (`localStorage` key `water_billing_history`, up to 24 cycles).
- **07-22:** CAR rebuilt on real researched mbapi2020 services (see CAR reference below) — lesson: never guess entity/service names for an integration, read its actual source first.
- **07-21:** CAR live (mbapi2020/GLE 350), Blink cameras live, Family Login live. Stale-content bug root cause was Cloudflare's **CDN edge cache** on `service-worker.js` (separate from browser cache) plus a missing SW registration — check `cf-cache-status` on the custom domain, not just `Cache-Control`.
- **07-16:** CAR section added (Mercedes GLE 350).
- **07-09 → 07-15:** Blink cameras live (removed a stale `custom_components/blink` override — never re-add it), local AI camera detection (CodeProject.AI on the beast), Fire TV paired via ADB, iPad wall-display groundwork (Safari-15 `AbortSignal.timeout` polyfill).
- **07-01 → 07-07:** HA calls moved behind a server-side proxy (`haFetch()`→`/api/ha`) — fixes the whole "Beehive Offline" class of bug (mixed-content/CORS/relay timeouts); root cause was a shared `AbortSignal.timeout` reused across retries, never hoist one out of a retry loop. Water+gas meters went live via RTL-SDR. First HA devices (Tuya plug, Sharky vacuum) live.
- **06-23 → 06-29:** Initial build-out — nav/modals, GPS persistence + calibration, LUX/CLIMATE integration, light/dark theme, hero-grade + design-token system, font unification. See `git log` for detail.

---

## Beehive / Home Assistant Integration

**Hardware:** Beelink J45 (Gemini) mini-PC, Intel Pentium J4205, x86, ~8GB/128GB, running HA OS off its **internal SSD** (migrated off a flaky external USB drive 2026-07-02 — external is retired, don't reintroduce it; both USB ports are free for RTL-SDR + a future Zigbee/Thread stick).

**Architecture — three ways anything connects (only radio sticks physically plug into the J45):**
- **USB stick in the J45:** RTL-SDR (water+gas meters, live). Future: one Zigbee/Thread coordinator stick → whole mesh of cheap sensors/plugs for a security layer with no wiring.
- **Wi-Fi/LAN:** ESP32/ESPHome sensors, Shelly plugs, local cameras.
- **Cloud:** Blink, B-Hyve, LUX thermostat, SmartHub (CEMC electric).

**How Claude works (so nobody expects the wrong thing):** this cloud session has NO network access to Jeff's home LAN (Beehive J45 or "the beast" = Jeff's PC) — it writes exact instructions for Jeff or the local "coworker" session to execute. The coworker session (Claude Code on the beast) DOES have that access — see Mandatory Rule 13.

**HA Base URL:** `http://homeassistant.local:8123` (auto-fallback `http://192.168.1.66:8123`); remote via Nabu Casa `https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa`. **Beast note:** the beast itself sometimes can't reach `192.168.1.66:8123` (VPN/AV blocking local IP) — use the phone if that happens.

**HA Token:** Jeff enters a Long-Lived Access Token once in the app (Profile → Long-Lived Access Tokens → Create Token, entered via HOME → "OPEN BEEHIVE ↗") → stored in `localStorage.ha_token`, used for all API calls.

**Camera section:** HA token + Beehive online → fetches camera entities from `/api/states`; no cameras found → shows Blink 2FA PIN entry (`blinkSendPin()` → `POST /api/services/blink/send_pin`).

**Irrigation section:** tries `loadIrrigationFromHA()` first (filters B-Hyve switches by zone/bhyve/orbit in entity_id or attributes); falls back to `loadIrrigationDirect()` (direct B-Hyve cloud API) if no B-Hyve entities in HA. `haIrrToggle(entityId, 'on'|'off')` → `POST /api/services/switch/turn_on|off`.

**CAR — mbapi2020 service architecture (Mercedes GLE 350):**
- **VIN:** `4JGFB4KB0MA478988` (hardcoded `CAR_VIN`). Helper: `carMbSvc(service, extraData)` → `haFetch('/api/services/mbapi2020/'+service, {vin: CAR_VIN, ...extraData})`.
- **Gas-vehicle services (NOT EV):** `engine_start`/`engine_stop` (start needs PIN), `doors_lock`/`doors_unlock` (unlock needs PIN), `auxheat_start/stop` (gas-only exhaust heater, no PIN), `temperature_configure` (16-30°C per zone, send as strings not numbers), `preconditioning_configure_seats`, `sigpos_start` (flash lights), `windows_close/open` (PIN for open), `sunroof_open/tilt/close` (PIN for open/tilt).
- **NOT for gas vehicles:** `preheat_start` (EV-only), `battery_max_soc_configure`, `charge_program_configure`.
- **PIN:** set up in Mercedes Me app, then stored in mbapi2020 integration options in HA — services auto-use it, app must never prompt for or send a `pin` field.
- **Entity naming:** `sensor.gle_350_odometer`, `lock.gle_350_lock`, `binary_sensor.gle_350_windows_closed` (⚠️ inverted semantics, `on`=closed — code must detect `*_closed` and flip logic), `switch.gle_350_auxheat`, `button.gle_350_preclimate_start`.
- **Scoping:** always scope CAR entity/lock lookups to Mercedes/GLE/mbapi entities — house entities can bleed in otherwise (fixed 07-21).

**Ford F-250 (2001, VIN `3FTNX21FX1MA23431`, 7.3L Power Stroke Diesel, 4WD, crew cab):** no connected-car features (pre-dates FordPass Connect) — no remote start/lock/GPS from HA. `carSwitchVehicle('merc'|'ford')` persists in `localStorage.hcc_vehicle`. Future: OBD-II port + Veepeak OBDCheck BLE+ (~$30) + ESP32/ESPHome for live RPM/coolant/battery/DTCs, optional NEO-6M GPS module.

**Garage Door — ratgdo:** Jeff's Chamberlain myQ MYQ-G0402 hub is permanently useless for HA (Chamberlain blocked all 3rd-party API access 2023; native `myq` integration removed; no HACS workaround exists or is coming — confirmed dead 07-28, don't revisit absent a major policy reversal). **Correct path: ratgdo board** (~$35, ratcloud.llc/Amazon) wired directly to the opener motor (3 wires), ESPHome firmware, local WiFi to HA, no cloud dependency. Works with Security+ 2.0 (yellow learn button), Security+ (purple/red), older (orange/dry contacts) — Jeff needs to check his opener's learn-button color. Expected entities: `cover.ratgdo_*`, `light.ratgdo_*`, `lock.ratgdo_*`, `binary_sensor.ratgdo_*`. App already auto-detects any `cover.*garage*` entity (`loadGuardian()`/`loadGarage()`) — card appears the moment ratgdo is adopted. myQ hub can stay plugged in alongside it for the Chamberlain phone app.

---

## Pending Items (Next Session Should Address These)

1. **Ratgdo board** (~$35) — Jeff to buy + install on the opener (see Garage Door above); app side is already done and will auto-detect it.
2. **iPad Air 2 wall-display** — Safari-15 polyfill deployed and working; HA token persistence + "Add to Home Screen" + Guided Access still need final confirmation.
3. **F-250 OBD-II sensor box** — Veepeak OBDCheck BLE+ (~$30) + ESP32 + optional GPS for live diagnostics.
4. **PiPup app on the Fire TV** — Jeff liked the picture-in-picture idea for camera popups instead of a full app takeover; needs the "PiPup" Android app side-loaded on the physical Fire TV device before it can be wired up. Pending Jeff's go-ahead (see 07-31 coworker entry in Change Log for the researched approach).
5. **Panic automation (HA side)** — app already fires webhook `hcc-panic-button`; HA automation pending Zigbee hardware (coordinator stick + siren + sensors). See `docs/beehive/panic_alarm_automation.md`.
6. **Lighthouse score** — 60/100, low priority (unminified single-file index.html).
7. **Lucky Mike "Smart Stall"** — queued, plans in `docs/lucky-mike/` (read `INTEGRATION_NOTES.md` first). New "STABLE" section, `--a-stable` accent. **Do not start until Jeff says go.**
8. **Desktop-wide-browser layout gap** — heroes leave black space on windows >~700px wide (`aspect-ratio`+`max-height:460px` with no width constraint). Low priority, app is used on phone.
9. **Irrigation sewer-overcharge estimate should use real B-Hyve runtime, not a fixed schedule (Jeff, 07-30).** `irrMonthlyGal()` currently multiplies `IRR_RUNMIN[s]` (a hardcoded weekly-schedule assumption) × `IRR_DAYS_WK * 4.33` — this misses rain delays, skipped days, and manual overrides, so it's not accurate enough for the sewer refund request Jeff wants to file with WHUD (irrigation water never enters the sewer, but WHUD bills sewer on all metered water). B-Hyve's real zone switches (`switch.z2_front_left`, `switch.z3_back_left`, `switch.z4_back_right`, + 3 more — reconnected 07-30, `connected:true`, exposes `is_watering`/`zone_name`/`station`, but **no flow-rate or duration attributes**, so GPM-per-zone must stay a configured constant) DO report real on/off state, so real per-event runtime is derivable from HA recorder history the same way `waterFlowFromHistory()` already pulls real data elsewhere in this file. Fix: sum each zone's actual on-duration per billing cycle from HA history × existing per-zone GPM constant, replacing the fixed-schedule guess.

---

## LUX Thermostat — API Reference (DO NOT CHANGE UNLESS BROKEN)

**Auth flow** (4 steps, in `functions/api/climate.js`):
1. GET the B2C authorize URL with PKCE code_challenge → parse `x-ms-cpim-csrf` cookie + `transId` from HTML
2. POST `SelfAsserted` with `{logonIdentifier, password, request_type:'RESPONSE'}` + CSRF header + cookies
3. GET `confirmed` → follow redirects to the custom-scheme URL → extract `code=`
4. POST the token endpoint with `{grant_type:authorization_code, code, code_verifier, client_id, redirect_uri}` → `{access_token, refresh_token}`

**Client ID:** `b335ca43-3bde-4406-b281-8816afb7cc91` · **Redirect URI:** `connecteddevicesjci.luxmobile://connecteddevicesjci/path` · **Scope:** `.../mobile/user_impersonation .../mobile/read_write offline_access openid`

**API (Bearer token):** `GET /api/location/user` → devices list. `GET /api/device` + header `Deviceid` → `{systemmode, holdheat, holdcool, currenttemp, fanmode}`. `POST /api/device` + `Deviceid` header + full state JSON (writes use **POST not PUT** — PUT returns 500).

**Fields (°F, no conversion):** `systemmode` 0=off/1=heat/2=cool/3=auto; `holdheat`/`holdcool` = setpoints; `currenttemp`; `fanmode` 0=auto/1=on.

**Jeff's device:** CS1-DD-FB.

---

## Water + Gas + Electric Meter Integration

**Status:** Water + Gas LIVE via RTL-SDR + rtlamr2mqtt on the J45. Electric "This Month" LIVE via the SmartHub (CEMC) cloud integration — a real ATM90E32 CT-clamp build is still the future path for true instant Now/Today.

### 💧 WATER — WHUD · Kamstrup flowIQ 2100
- Meter S/N `25394131`, billing cycle ~21st. Rates: Base $10.32 + $0.00908/gal (validated). Sewer (City of White House, mirrors the WHUD meter, no separate meter): Base $22.74 + $0.00982/gal (validated).
- Read path (confirmed by WHUD supervisor): external MIU `100WD`, ERT ID `79453337`, unencrypted Itron ERT-SCM, protocol `scm+` (rtlamr2mqtt config), 915–930 MHz, ~1 SCM/min, no AES key.
- Timestamps are European (Kamstrup is Danish) — convert to Central in code. Raw ÷10 = gallons.
- App shows **This Cycle** (`whudCycleKey()`, resets ~21st) + Est. Water/Sewer/Combined + billing history + sewer-overcharge tracking (irrigation water is charged sewer fees it never actually generates).
- **⚠️ Pit radio went silent 07-28 (~17:39 UTC) — confirmed hardware, not software (07-28).** Add-on (`6713e36e_rtlamr2mqtt`) running fine with correct ID/protocol; gas (same dongle/antenna/distance) kept receiving normally throughout. Proved via the add-on's own `listen_mode` (logs ANY reception of configured meters, no filtering) — gas showed up in <90s, water never appeared at all. This rules out config/software entirely; the external MIU itself isn't transmitting or isn't reaching the receiver. **Next step: Jeff calls WHUD** (closed when found) to report the MIU not transmitting — this is their equipment. The meter also has its own separate built-in Kamstrup wM-Bus radio, but that's typically AES-128 encrypted (would need a key from WHUD) and Jeff never built a receiver for it — not a real fallback right now.
- Timing note (checked so this doesn't get blamed on the same-day recorder fix): recorder reset ~12:15 UTC 07-28; water kept transmitting fine for 5+ more hours after that, only going silent at ~17:39 UTC — the timing doesn't line up, so this looks like an independent, coincidental hardware failure, not a side effect of the recorder work.
- **⚠️ AUDIT NOTE (07-31):** the 07-31 coworker Change Log entry found a *separate* cause for water+gas going "unavailable" that same week (rtlamr2mqtt losing the RTL-SDR USB device, fixed by a host reboot) and explicitly says that's distinct from this pit-radio/MIU theory above. **Status of "Jeff calls WHUD" is unconfirmed as of 07-31** — unclear if that call ever happened or if the meter started transmitting again on its own. Whoever picks this up next: confirm current status with Jeff before assuming either resolved or still open, and if still open, promote it to a numbered Pending Item instead of leaving it buried here.

### 🔥 GAS — Piedmont/Spire · Itron 100G ERT
- Piedmont Natural Gas, transitioning to Spire (billing continues under Piedmont during transition). Account `6100 0546 4779`. Meter Elster AC-250, Piedmont# `T821986`. Billing cycle ~5th.
- Itron 100G ERT, FCC `EO9100GDLA`, unencrypted, 900–920 MHz ISM. Same RTL-SDR reads both water + gas. Raw ÷100 = CCF.
- Rates (validated against 3 bills): Base $13.44 + Distribution $0.61809/therm + PGA $0.61691/therm = $1.235/therm all-in. Heat factor 1.068 (CCF→therms). 5% local franchise fee. `(13.44 + round(CCF × 1.068) × 1.235) × 1.05`.

### ⚡ ELECTRIC — Cumberland Electric (CEMC)
- **This Month + Cost: LIVE** via SmartHub — entity `sensor.electric_smarthub_energy_monthly_usage_4501007001` (monthly running total, ~6h refresh cadence, found by keyword via `findEntity('smarthub','month')`). Now/Today are estimated client-side (24-bucket hour-of-day model, seeded from HA recorder history, `≈` prefix/EST chip) since SmartHub exposes no instantaneous reading.
- Account `4501007001`, meter `145590962` (Landis+Gyr Gridstream — not Itron, can't radio-read directly). 200A service, Challenger panel.
- Rates (validated against the 07/30/2026 bill, account 4501007001, 2,120 kWh billed): Base $39.00 + Energy $0.08657/kWh + TVA Fuel $0.02847/kWh = $0.11504/kWh all-in. TVA fuel is a pass-through surcharge that shifts most cycles — re-derive from each new bill photo Jeff provides rather than treating this as fixed.
- **Future build:** 6-channel CircuitSetup ATM90E32 board (2 chips) + ESPHome `atm90e32` → HA, for real instant Now/Today. CT1+2=200A mains, CT3-6=range/dryer/AC/well pump. ~$90-110 DIY. **Jeff wired his own house — never suggest hiring an electrician.**

---

## Jeff's Contact / Account Info

- **Email:** jeff.loewen@comcast.net
- **Cloudflare account:** credentials already configured — never ask for them
- **Home Assistant instance:** "Beehive" — local `homeassistant.local`/`192.168.1.66`; remote (primary) `https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa`
- **Weather Underground PWS:** station `KTNWHITE21`, API key `0e87ee079c0147a787ee079c01d7a75d`
- **Mower:** Toro TimeMaster 21200
- **Jeff wired his own house** — skilled and comfortable in the breaker panel. Never suggest hiring an electrician; talk to him as a capable peer on electrical/hardware.
- **Jeff is almost 60 and learning** the software/AI side — be patient and clear there, never condescending. On hands-on hardware/electrical/firmware he is experienced. Make it enjoyable.
