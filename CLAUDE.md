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

- **08-02 (coworker, latest):** **Investigated the Fire TV PiP delay (real findings, not fixed yet), confirmed Blink phone-notification filtering already covers all 6 cameras, ruled out a redundant rain-skip build, and built + tested the Morning Digest automation (caught and fixed a real bug along the way).** (1) **PiP delay:** traced two real `codeproject_ai.object_detected` events end-to-end via HA's automation trace API — the whole chain (motion sensor → AI scan → detect event → Fire TV popup) completes in under 1 second on the HA side, both times. A pre-existing "Blink Fast Motion Poll" automation (10s `time_pattern`, forces a genuine `homeassistant.update_entity` cloud refetch, confirmed not a cache no-op) already covers all 6 cameras. None of that explains Jeff's reported 3-4 min real-world lag — conclusion: the delay is upstream of HA entirely (Blink's own cloud clip processing, or possibly Fire TV/PiPup rendering), not something more polling can fix. **Not resolved** — needs a real timestamped incident to trace further; asked Jeff to flag next occurrence. Confirmed camera coverage is complete and identical across scan-on-motion, fast-poll, and notify: all 6 (`301_driveway`, `front_right`, `back_left`, `301_backyard`, `garage`, `301_front_doorbell`). (2) **Blink phone notifications:** discovered `AI Object Detected Notify` (in `packages/hcc.yaml`) already does exactly what a "Blink motion filtering" build would have added — branches on `obj_type` (person/vehicle/animal) from the same CodeProject.AI event, sends distinct filtered pushes with a 15-min per-camera mute button. Confirmed live (`state: on`, real recent trigger). No build needed. (3) **Kodi buffering fix, corrected a wrong earlier fix:** Jeff's prior `advancedsettings.xml` edit was a no-op — confirmed via research that Kodi 21+ "Omega" (Jeff's on 21.3) moved cache settings out of that file into the GUI, which fully overrides the XML. Found the real live settings in `guisettings.xml` (`filecache.memorysize`/`readfactor`, both still at Kodi defaults — 20MB/4.0x, confirming the XML edit never took effect) and edited them directly since Kodi wasn't running (20MB→768MB, the GUI's own max; 4.0x→5.0x per Kodi's current official buffering-fix guidance) — verified via a live re-read of the file after editing. (4) **B-Hyve WeatherSense researched, confirmed no HA-side rain-skip automation needed:** Jeff's B-Hyve already does real weather-adaptive watering (rain-skip, temp/wind adjustment) and genuinely supports a personal weather station via PWSWeather.com/Aeris — independent testing cited 100% skip reliability on 0.2"+ rain days. Building a duplicate HA automation would've been strictly worse (no wind/temp adjustment). Closed off the pending-items list, nothing to build. (5) **Built `HCC — Morning Digest`** (daily 7am push + persistent notification: weather, vacuum status, car lock/fuel/odometer, water/gas reporting health, recent Blink self-heal count) — automates the manual "check everything" health-check Jeff kept asking for by hand. **Caught a real bug via live testing before calling it done:** the digest's "active alerts" count always silently returned 0 — confirmed via research this is a known HA-wide change (persistent notifications removed from the template-readable state machine since HA 2023.6), not fixable in a normal Jinja2 template; removed that metric entirely rather than ship a false "all clear." Verified the corrected version renders real, accurate data via two live manual triggers (`persistent_notification/get` WS call, not just the general states API which doesn't expose these notifications either) — second run correctly showed no false claims, real push landed on Jeff's phone.
- **08-01 (coworker):** **Closed out the leak-detection + Angela-tracking threads from earlier today.** (1) Installed the `Water-Monitor` HACS integration (already in HACS's default store, no custom repo needed) — pointed at `sensor.water_flow`/`sensor.water_gallons`, confirmed `Upstream sensors health: Connected`; did not fine-tune its low-flow/tank-refill thresholds (options dialog wasn't scrolling reliably this session), left on defaults with the batched-cadence caveat noted for whoever tunes it later. (2) Built the complementary fast-reacting piece: `HCC — Possible Water Leak (Idle Flow)` (entity `automation.hcc_possible_water_leak_idle_flow` — note HA slugified the entity ID from the alias text, not the `id` field set in the API call), triggers on `sensor.water_flow` >0.05 gal/min for 30+ min while both Jeff and Angela are `not_home` OR it's 1-5am, and no B-Hyve irrigation zone is on; notifies Jeff. Config-validated, confirmed `state: on`. (3) **Root-caused Angela's phone tracker unreliability — real fix, not a settings guess.** Confirmed via live evidence the HA Companion App genuinely was installed and had reported real GPS data as recently as same-day, but had gone stale (~40+ min, unmoving) even after Jeff fixed the standard iOS location permissions (Always/Precise/Background Refresh) and manually opened the app — none of that produced a fresh update, including HA's own `command_request_location_update` push (sent via `notify.mobile_app_angelas_iphone`, confirmed via official Companion App docs this is a known "hit-or-miss" feature, so its failure wasn't diagnostic on its own). Real fix, found via the app's in-app Settings → Notifications (menu relabeled in a newer app version — no longer nested under "Companion App" like the docs describe): her **Push ID was empty/stale**, meaning her phone had never registered a valid push-delivery channel with HA, so nothing — including background significant-location-change wake-ups — could reach the app. Jeff reset it; confirmed fixed with real evidence, not assumed: a genuinely fresh organic background update landed (not from a manual poke), with real GPS movement (accuracy 3.6m→10.4m) and real battery drain (90%→75%) between checks. `person.angela_loewen` is now a reliable primary signal again — the Mercedes GPS backup trigger added 08-01 earlier is no longer load-bearing, just a true backup as originally intended. (4) **Fixed `zone.work`'s location** — Jeff gave the real parking garage address (310 Commerce St, Nashville), geocoded to 36.1624877/-86.7776215, icon changed to `mdi:parking`, applied via `zone.reload`, confirmed live. Note: this address came out only ~90m from the original office coordinates, not the ~0.4mi Jeff estimated earlier — flagged to him, not fully reconciled, but he gave the address directly so it took priority over the earlier estimate.
- **08-01 (coworker):** **CORRECTION to the entry below — the water meter was never faulty. False alarm, root-caused and fully retracted same day.** The "stuck register" conclusion from the irrigation+shower test was wrong — it just wasn't watched long enough. Follow-up evidence: (1) Jeff produced WHUD's own "Water Meter Data Access Request" form, whose printed PROTOCOL field lists `Itron ERT (SCM/SCM+/IDM)` for this exact meter, with IDM underlined by the WHUD rep on a call — worth testing directly rather than trusting general web knowledge about IDM being electric-meter-only. (2) Swapped the water meter's `rtlamr2mqtt` entry from `scm+` to `idm` (gas entry untouched, unaffected throughout) and watched for ~2 hours: zero IDM packets ever decoded for this meter ID — this specific installed radio only ever transmits `scm+`, so that channel is the complete picture, not a partial one. (3) Reverted to `scm+` and immediately caught a fresh reading on restart: `179097` (stuck value) → `179371` (appeared ~20 min after the original test ended, i.e. the real usage from that test, delayed) → `179473` (appeared ~3 hours later, normal background usage). **Real root cause: `rtlamr2mqtt` runs `rtlamr` with `-unique=true`, which only re-publishes a reading when the decoded value itself changes — the meter's own transmitter evidently updates its broadcast register in batches (gaps varied from ~20 min to ~3 hours, so likely threshold/delta-based, not a fixed clock), not continuously with live flow.** The `sensor.water_meter_last_seen` heartbeat pinging normally the whole time was a real signal I misread — it confirms every RF catch, not that the *value* had refreshed, and I conflated the two. **No WHUD call needed — the meter and pit radio are both healthy.** All add-on config changes made during testing were reverted; confirmed final state is the original unmodified `scm+`/`scm` config. See the entry directly below for the original (incorrect) diagnosis, kept for the record rather than deleted.
- **08-01 (coworker):** **Diagnosed a real, distinct water-meter fault by live-testing with actual water use — not guessing.** After explaining the leak-detection ideas (Water-Monitor HACS integration, idle-flow logic), needed the pit radio's real report cadence, so ran a controlled test: triggered a B-Hyve irrigation zone via HA + Jeff took a real shower, both running simultaneously for ~47 min. Result read straight from the `rtlamr2mqtt` add-on's raw decoder log (`ha addons logs 6713e36e_rtlamr2mqtt`): the water meter (endpoint `79453337`) was freshly decoded on every capture the whole time (heartbeat/`sensor.water_meter_last_seen` updated normally every ~1.5-5 min) but reported the exact same value, `179097`, on every single read — zero movement despite substantial confirmed usage. In the identical window the gas meter (`33393066`, same dongle/antenna/pipeline) ticked normally (`885060→885062`), ruling out the dongle/software/HA entirely. Jeff confirmed irrigation and the house shower share one municipal supply, ruling out "wrong source." **Conclusion (later corrected, see entry above): the pit radio's register is stuck.** ~~Jeff needs to call WHUD again~~ — superseded, no call needed.
- **08-01 (latest):** Jeff said "go ahead and fix the remaining contrast items" — darkened the shared light-mode tokens themselves rather than doing more one-off swaps: `--gold` `#9a7b1e`→`#7e6017`, `--a-home`/`--c-health` (same old value, separate tokens, both feed visible text) matched to `#7e6017`, `--muted` alpha `.66`→`.74`, `--bad` `#d61f1f`→`#c21b1b`, plus one literal `#9a7b1e` on `.wu-badge-stars` switched to `var(--gold)` so it can't drift again. Picked each new value by computing real WCAG contrast ratios in a small Node script against every light-mode surface color in the app (white/card/surface/bg variants), not by eye — targeted a solid ≥4.5:1 margin (landed 4.3-6.7:1) rather than skimming the line. Verified via axe-core color-contrast scan: 20 → **0 violations**. Lighthouse Accessibility re-run: 96 → **100/100**. Visually spot-checked HOME/GUARDIAN/CAR in light mode via Playwright screenshots — new shades read as intentional, not muddy, no other elements broke. Full regression clean: `lint-app.js` (no anti-patterns), `smoke-test.js` (all nav/tabs/modals/374 external links pass). Pending Item 9 (the old "needs a Jeff decision" placeholder) closed/removed — this was that decision.
- **08-01 (later):** Jeff asked what other quality tools exist besides Lighthouse — ran Lighthouse's Accessibility (96/100) + Best Practices (96/100) categories (previously only ran Performance) plus axe-core (deeper a11y scan via Playwright) and a 4-viewport responsive check. Real finding: 27 elements failed WCAG color-contrast, concentrated in light mode (the app's default theme) — several dark-mode-tuned literal colors bypass the app's own theme-aware tokens. Proposed a scoped "safe" fix to Jeff (swap hardcoded colors for existing tokens only, no new color design) with a real before/after screenshot + measured ratio, got explicit go-ahead, fixed 4 instances (gold CTA headings, "Beehive Offline" red text, inactive nav labels, 2 HA-token input fields) — caught and fixed two real gaps in my own first pass (the gold fix only landed in a throwaway test copy, not the real file; a CSS specificity bug where inline styles silently beat my override). Verified via axe-core: 27 → 20 violations, nav labels + both token inputs now fully pass. Remaining ~4.0-4.4:1 items tied to the shared `--muted`/`--gold` tokens deliberately left alone (darkening those ripples across many more elements — a real design call, not a safe swap) — see Pending Items. Console errors Lighthouse flagged are 100% test-environment noise (no real `/api/*` backend on a bare local file server); PWA manifest already solid; desktop-layout gap reconfirmed but still low priority (unchanged, phone-primary).
- **08-01 (coworker, latest):** **Built Angela's work-arrival tracking, mirroring the barn pattern exactly.** Geocoded her real office (150 4th Avenue North Suite 1700, Nashville, TN 37219) via OpenStreetMap Nominatim → 36.1629809, -86.7783796 (exact address match). Added `zone.work` (100m radius, `mdi:office-building`) to `configuration.yaml` right alongside `zone.barn`, loaded live via the `zone.reload` service — no full restart needed (confirmed the zone integration exposes its own reload service, unlike some YAML-only domains). New, deliberately independent automation `HCC — Angela Arrived at Work` (id `hcc_angela_arrived_at_work`) triggers on the same Mercedes GPS tracker (`device_tracker.gle_350_device_tracker`) entering the new zone and notifies Jeff — kept separate from the barn automation per Jeff's explicit instruction, since she doesn't always go to the barn, sometimes it's work. Made the `configuration.yaml` edit via the code-server integrated terminal (`python3`, exact-string match + `assert count==1` before writing) instead of typing into the Monaco editor directly, specifically to avoid the recurring auto-indent/search-text-leak glitches that have corrupted edits to this file before. Verified live end-to-end: `zone.work` confirmed via `/api/states` with correct lat/lon/radius, automation confirmed `state: on` after `automation.reload`. Also this session: confirmed the Vizio soundbar integration (power-cycle-fixed earlier 08-01) has zero actual usage anywhere in the app or HA config — nothing references it, so there's nothing to build on top of; left alone per Jeff, he'll power-cycle manually if it recurs. Diagnosed (plan ready, not yet executed — Jeff's call) Alexa showing duplicate lamp/plug devices: caused by the same Tuya devices being exposed to Alexa twice, once via Smart Life's own native Alexa skill and once via HA/Nabu Casa's Alexa Cloud integration. Fix when Jeff says go: turn off `should_expose` for 4 switch entities (`switch.bed_lamp_socket_1`, `switch.hot_water_heater_socket_1`, `switch.mini_smart_socket11_2_socket_1`, `switch.smart_socket_2_socket_1`) on the HA/Nabu Casa side only, leaving Smart Life's copies as the ones Alexa keeps. Delivered Jeff a short action-items list for the cloud session (Lighthouse score + desktop layout gap ready now; Lucky Mike still needs explicit go before starting).
- **08-01:** Lighthouse basic wins (Pending Item 5): recompressed all JPEGs to q80 (images/ 12MB→7.1MB), deleted 6 dead image files + fixed service-worker.js's stale precache list (bumped hcc-v11→v12), trimmed Google Fonts to only the weights actually used, added `loading="lazy"` to below-the-fold images. Caught a real self-inflicted regression via a controlled Lighthouse A/B (Cumulative Layout Shift 0.023→0.436 from lazy-loading images whose containers had no reserved space) and fixed it with `aspect-ratio` on the affected containers — re-verified CLS back to 0.015, no regression. Full JS/CSS minification deliberately left out of scope (would need restructuring the single-file app) — see Pending Item 5 for what's left and honest caveats on the score measurement.
- **08-01 (coworker):** **Vizio soundbar (`AUD_D426`) integration was stuck in `setup_retry`, "Unable to connect to 192.168.1.68:9000."** Researched first: this matches a known, unresolved class of Vizio SmartCast issue (self-signed cert mismatch causing strict TLS clients to fail even when the device is reachable — the matching HA GitHub issue was closed "not planned," no upstream fix exists) rather than a config mistake on our end. Confirmed the device WAS network-reachable (got a real HTTP response) even while HA's integration kept failing, and a `reload_config_entry` didn't help — pointed to the device's own local API needing a power-cycle, same class of fix as yesterday's RTL-SDR dongle. Jeff power-cycled the soundbar; integration came back `loaded` immediately, `media_player.aud_d426`/`remote.aud_d426` both confirmed live. Not urgent if it recurs — the only functionality this integration provides is TV/soundbar CEC power sync, already a known low-priority item.
- **08-01 (coworker, later):** **Built Angela's barn-arrival tracking live, using her actual 25-mile drive to Kentucky as the real test.** Added the Mercedes GPS (`device_tracker.gle_350_device_tracker`) as a third, independent trigger on `automation.angela_almost_home` — the existing two both secretly depended on her phone (`person.angela_loewen`), which is why the 07-26 "backup" never actually helped when her phone stopped reporting. New `zone.barn` created from real coordinates captured the moment the car actually stopped moving (36.716949, -86.652950 — confirmed via 79+ seconds of zero GPS movement after continuous updates every 15-30s while driving, i.e. engine-off/parked, not a polling gap). New separate automation `HCC — Angela Arrived at Barn` (kept independent from Angela Almost Home per Jeff — she also regularly drives to work in Nashville, not just the barn) notifies Jeff on arrival; end-to-end delivery confirmed via a real test notification. Live proof during this session: her phone's tracker sat stale at "home" for 4+ minutes while she was already 10+ miles out; the Mercedes tracker updated every 15-30s the whole drive.
- **08-01 (coworker):** **24h health check + closed out the last real open item from 07-31.** Ran a full log/entity audit after a day of the new automations running unattended: Blink's periodic 15-min backstop caught 73 real recurring crashes overnight with zero user-visible impact (proof the design works — the error-triggered auto-heal alone never fired once, confirming yesterday's one-shot-per-message concern was real); water/gas/Mercedes all healthy; one new benign mbapi2020 websocket-close log line, no actual error. Sharky vacuum confirmed genuinely offline since 07-28 (3+ days, unrelated to any of this work) — a full Tuya integration reload didn't help, points to the device itself needing a physical power-cycle, handed to Jeff. **Properly fixed `automation.ai_show_camera_on_fire_tv`:** its entity_registry desync made `disabled_by` update calls fail, so used the documented `initial_state: false` YAML key instead (verified against official HA docs first — an earlier `enabled: false` guess would have been silently ignored, glad it got checked before writing). Confirmed via a real HA restart that it now correctly stays off, unlike yesterday's runtime-only `turn_off`. **Live-validated Jeff's Mercedes-GPS backup-tracking idea:** watched `device_tracker.gle_350_device_tracker` in real time as Angela drove off — flipped `home`→`not_home` within ~90 seconds of her actually starting the car, no manual refresh needed (mbapi2020 pushes location via its own websocket). Confirms it's a viable secondary trigger for Angela's Almost Home.
- **07-31 (later):** Closed the water pit-radio item per Jeff's explicit call (working now, doesn't want to flag it to WHUD). Vacuum card no longer shows raw HA states like "Unresponsive" as if it's a hard failure — unrecognized states now get an amber "may be transient, refresh to check" framing (not an app bug, just bad framing of a real but often-transient upstream state). Shipped the real fix for Pending Item 10 (irrigation sewer-overcharge): `irrGalFromHistory()` now sums each B-Hyve zone's actual on-duration this billing cycle from HA recorder history × its configured GPM, replacing the fixed-schedule guess — tested against a mocked 20-min/17.2-GPM watering event (exact 344 gal match) and against the no-zones fallback path. Researched and delivered Jeff a downloadable Zigbee alarm parts list (bare-bones panic-button kit + full Guardian safety-layer wishlist), real current products verified via web search.
- **07-31 (coworker, latest):** **Finished the Fire TV camera-popup fix: real picture-in-picture via PiPup, replacing full-screen takeover.** Jeff sideloaded PiPup (desertblade fork, `nl.rogro82.pipup`, via the Fire TV's Downloader app — GitHub's release-asset redirect chain breaks in older Downloader versions, updating it fixed the download). Granted the required `SYSTEM_ALERT_WINDOW` permission via ADB (`appops set nl.rogro82.pipup SYSTEM_ALERT_WINDOW allow`) — popups silently didn't render without it. Added `rest_command: pipup_notify` to `configuration.yaml` (POST to `http://192.168.1.215:7979/notify`, single-line flow-mapping YAML to avoid the editor's auto-indent bug on multi-line blocks). New automation `HCC — AI Camera Popup on Fire TV` (id `hcc_ai_camera_popup_fire_tv`, entity `automation.hcc_ai_camera_popup_on_fire_tv`) triggers on `codeproject_ai.object_detected` and pushes the **actual annotated frame that triggered the detection** (`trigger.event.data.saved_file`, already saved under `/config/www/ai_snapshots/` → auto-reachable via HA's `/local/` path, no signed-URL/token complexity) — not a fresh snapshot taken later, per Jeff's explicit requirement that the picture show what actually caused the alert. Disabled the old `automation.ai_show_camera_on_fire_tv` (full-screen switch) via `automation.turn_off` — **note: its entity_registry entry returns "Entity not found" on both `get` and `update` calls, a genuine desync from its live state; the `turn_off` is runtime-only and won't survive a future restart, needs a real fix by editing its YAML directly in `packages/hcc.yaml` (or deleting it) next session.** Full chain verified live end-to-end (real `camera.snapshot` + simulated `codeproject_ai.object_detected` event → automation → rest_command → real popup with real image, confirmed by Jeff). **Also hardened Blink Auto-Heal:** discovered live that HA's `system_log_event` only fires once per *unique* log message — a repeating crash-loop (confirmed via the log entry's own `count: 5`) doesn't re-trigger the error-based automation after its first catch. Added `HCC — Blink Periodic Health Reload` (id `hcc_blink_periodic_health_reload`) as a backstop: unconditional `homeassistant.reload_config_entry` on Blink every 15 minutes via `time_pattern`, no error-detection dependency at all — guarantees a hard ceiling on any Blink outage regardless of failure mode. Both Blink automations run together (fast reactive + guaranteed periodic).
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
4. **Panic automation (HA side)** — app already fires webhook `hcc-panic-button`; HA automation pending Zigbee hardware (coordinator stick + siren + sensors). See `docs/beehive/panic_alarm_automation.md`.
5. **Lighthouse score — basic wins done 07-31, full minification still pending (deliberately out of scope).** Recompressed every JPEG to quality 80 (images/ 12MB → 7.1MB, ~41% smaller, visually verified no quality loss), deleted 6 confirmed-dead image files + fixed service-worker.js's stale precache list (was still referencing 2 of those deleted files, was missing the current hero image — bumped hcc-v11→v12), trimmed the Google Fonts request from 6 weights×2 families down to only the 4-5 weights actually used, and added `loading="lazy"` to every below-the-fold/hidden-section image — then caught and fixed a real CLS regression that lazy-loading introduced (utility meter photos + Dispatch card had no reserved `aspect-ratio`, so the page jumped when they loaded in; fixed by reserving each image's real aspect ratio). Verified honestly via a controlled before/after Lighthouse A/B run in the same sandboxed environment (not a real device, not the live Cloudflare-CDN'd site — absolute numbers aren't directly comparable to a real Lighthouse run against the deployed URL): total page weight down ~56%, LCP nearly halved, CLS held steady/improved slightly, composite score unchanged. **What's left (explicitly out of scope, would need restructuring):** minifying the actual JS/CSS inside the single `index.html` file, and/or splitting the inline `<script>` into an external deferred file — those are the two biggest remaining Lighthouse opportunities (`unused-javascript` ~235 KiB, `unminified-javascript` ~71 KiB) per the local audit. For a trustworthy real score, run Lighthouse against the live `toro1-5rz.pages.dev` URL (Chrome DevTools or PageSpeed Insights), not a local file.
6. **Lucky Mike "Smart Stall"** — queued, plans in `docs/lucky-mike/` (read `INTEGRATION_NOTES.md` first). New "STABLE" section, `--a-stable` accent. **Do not start until Jeff says go.**
7. **Desktop-wide-browser layout gap** — heroes leave black space on windows >~700px wide (`aspect-ratio`+`max-height:460px` with no width constraint). Low priority, app is used on phone.
8. **Zigbee alarm hardware — Jeff purchasing 07-31.** Bare-bones parts list (coordinator, door sensors, siren) plus the full Guardian safety-layer wishlist (smoke, water leak, freeze, water-main shutoff) researched and handed to Jeff as a downloadable file this session — real current products verified via web search, not guessed. Once hardware arrives and is paired in HA, item 4 (Panic automation) becomes buildable — `docs/beehive/panic_alarm_automation.md` already has the automation YAML ready, just needs real entity ids swapped in.
9. ~~`zone.work` centered on the office instead of the actual parking garage~~ — **FIXED 08-01.** Jeff gave the real garage address (310 Commerce St, Nashville, TN); geocoded to 36.1624877, -86.7776215 (icon changed to `mdi:parking`), applied via `zone.reload`, confirmed live via `/api/states/zone.work`. Note: this address is only ~90m from the original office coordinates, not the ~0.4mi Jeff estimated earlier — flagged to him, not fully reconciled, but he gave the address directly so it took priority. ~~Also: Angela's phone tracker unreliability~~ — **FIXED 08-01, see Change Log** — real cause was an empty/stale Push ID in the app's own Notifications settings (not the iOS permissions, though those got fixed too along the way), confirmed via a genuine organic background update after the reset.
10. ~~Water meter pit radio fault, call WHUD~~ — **RETRACTED same day, no call needed.** Live-tested further (IDM protocol probe + longer observation window): the meter and pit radio are both healthy. Root cause of the original "stuck" reading was `rtlamr2mqtt`'s own `-unique=true` flag only re-publishing when the decoded value changes, combined with this meter batching its own broadcast updates (every ~20 min to ~3 hours observed, not continuous) rather than any hardware fault. See 08-01 Change Log correction entry for the full trail.
11. ~~Leak-detection automation~~ — **BOTH pieces built and live 08-01, see Change Log.** (a) `HCC — Possible Water Leak (Idle Flow)` — fast, custom automation, live. (b) `Water-Monitor` HACS integration — installed and connected, but its low-flow/tank-refill detector thresholds are still on defaults, not tuned for this meter's batched (~20min-3hr gap) reporting cadence. **Remaining follow-up, low priority:** revisit Water-Monitor's options (seed/persistence duration for the low-flow detector) once there's a few days of real data to judge whether defaults are too slow/twitchy.
12. **Fire TV PiP popup: real 3-4 min delay + wrong/stale trigger shown, still unresolved (08-02).** Traced two real detection events end-to-end via HA automation traces — the entire HA-side chain (motion → scan → detect → popup) completes in under 1 second both times, and the pre-existing "Blink Fast Motion Poll" 10s-refresh workaround already covers all 6 cameras and is confirmed to force genuine cloud refetches, not cached reads. None of that explains the reported delay — it's happening upstream of HA, most likely Blink's own cloud clip processing or Fire TV/PiPup rendering lag. **Blocked on reproduction:** need a real occurrence with a rough timestamp from Jeff to trace further; can't diagnose blind. Also discussed (not started, Jeff wants to think about it): showing the actual Blink video clip in the popup instead of just the static AI snapshot — real API support exists (`{"video": {"uri", "width"}}` in PiPup's payload) but would very likely make the delay *worse* since Blink's full clip upload is slower than the single snapshot CodeProject.AI already grabs instantly; leaning toward keeping the popup fast/image-only and separately auto-saving clips locally (via the Blink integration's own `blink.save_recent_clips` service) for after-the-fact review instead.
13. ~~Blink motion filtering for phone notifications~~ — **already existed, nothing to build (08-02).** `AI Object Detected Notify` already does this exactly: filters through CodeProject.AI, branches on person/vehicle/animal, sends distinct pushes with a 15-min per-camera mute button, confirmed live and covering all 6 cameras.
14. ~~Rain-skip irrigation automation~~ — **NOT NEEDED, confirmed via research 08-02.** Jeff's B-Hyve WeatherSense already does real weather-adaptive watering (rain-skip + temp/wind adjustment), and genuinely supports a personal weather station (PWSWeather.com/Aeris) as Jeff described. Independent testing showed 100% skip reliability on any 0.2"+ rain day. An HA-side duplicate would be strictly worse (no wind/temp handling). Not building this.
15. ~~Daily Morning Digest~~ — **BUILT AND TESTED 08-02, see Change Log.** `HCC — Morning Digest` (7am push + persistent notification, weather/vacuum/car/utility status/Blink health) is live. Caught and fixed a real bug during testing: the "active alerts" count silently always returned 0 (persistent notifications have been unreadable from templates since HA 2023.6 — confirmed via research, not a local misconfiguration) — removed that metric rather than ship a false "all clear."

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
- **Pit radio went silent 07-28 (~17:39 UTC), self-recovered — CLOSED, do not re-raise.** Was confirmed hardware-side at the time (MIU not transmitting, add-on/config ruled out via `listen_mode`). **Jeff's explicit call (07-31): water is transmitting fine now, and he does NOT want to call WHUD about it** — reporting it would draw utility-district attention/scrutiny he doesn't want, and since it resolved on its own (likely the same RTL-SDR USB reconnect from the 07-31 host reboot, or independent recovery on the MIU side — unconfirmed which), there's nothing actionable left. Leave this alone unless water goes silent again; if it does, that's a fresh incident, not a continuation of this one.
- Timing note (checked so this doesn't get blamed on the same-day recorder fix): recorder reset ~12:15 UTC 07-28; water kept transmitting fine for 5+ more hours after that, only going silent at ~17:39 UTC — the timing doesn't line up, so this looks like an independent, coincidental hardware failure, not a side effect of the recorder work.

### 🔥 GAS — Piedmont/Spire · Itron 100G ERT
- Piedmont Natural Gas, transitioning to Spire (billing continues under Piedmont during transition). Account `6100 0546 4779`. Meter Elster AC-250, Piedmont# `T821986`. Billing cycle ~5th.
- Itron 100G ERT, FCC `EO9100GDLA`, unencrypted, 900–920 MHz ISM. Same RTL-SDR reads both water + gas. Raw ÷100 = CCF.
- Rates (validated against 3 bills): Base $13.44 + Distribution $0.61809/therm + PGA $0.61691/therm = $1.235/therm all-in. Heat factor 1.068 (CCF→therms). 5% local franchise fee. `(13.44 + round(CCF × 1.068) × 1.235) × 1.05`.

### ⚡ ELECTRIC — Cumberland Electric (CEMC)
- **This Month + Cost: LIVE** via SmartHub — entity `sensor.electric_smarthub_energy_monthly_usage_4501007001` (monthly running total, ~6h refresh cadence, found by keyword via `findEntity('smarthub','month')`). Now/Today are estimated client-side (24-bucket hour-of-day model, seeded from HA recorder history, `≈` prefix/EST chip) since SmartHub exposes no instantaneous reading.
- Account `4501007001`, meter `145590962` (Landis+Gyr Gridstream — not Itron, can't radio-read directly). 200A service, Challenger panel.
- Rates (validated against the 07/30/2026 bill, account 4501007001, 2,120 kWh billed): Base $39.00 + Energy $0.08657/kWh + TVA Fuel $0.02847/kWh = $0.11504/kWh all-in. TVA fuel is a pass-through surcharge that shifts most cycles — re-derive from each new bill photo Jeff provides rather than treating this as fixed.
- **Future build:** 6-channel CircuitSetup ATM90E32 board (2 chips) + ESPHome `atm90e32` → HA, for real instant Now/Today. CT1+2=200A mains, CT3-6=range/dryer/AC/well pump. ~$90-110 DIY. **Jeff wired his own house — never suggest hiring an electrician.**
- **⚠️ "$94 seems low" — checked and confirmed NOT a bug (07-31).** Billing cycle resets ~23rd (per the 06/23–07/23 cycle on the 07/30 bill), so early in a fresh cycle "This Month" will look low against memory of a near-full-cycle bill. $94 ≈ 478 kWh ÷ 8 days ≈ 60 kWh/day, tracking in the same range as last cycle's 2,120 kWh ÷ 30 days ≈ 70 kWh/day. Confirmed with Jeff the number is climbing day to day (not frozen), which rules out a stuck SmartHub integration — the same "stale value" failure class as the Blink/vacuum issues found earlier this session. If this comes up again, first check whether it's climbing before assuming a bug.
- **Water Flow tile briefly reads a low decimal (e.g. 0.2 gpm) even with nothing obviously running — also confirmed NOT a bug (07-31).** `sensor.water_flow` is a real HA `derivative` helper with a 5-min smoothing window (`docs/beehive/ha_helpers_and_alexa.md` PART 3) — a brief burst (toilet flush, ~1.5 gal over ~30s) averages out across the full window instead of showing the real instantaneous rate. Working as documented ("reads ~0 when no water is running, jumps when a tap/irrigation is on"). Shortening the window would make it twitchier/noisier in exchange — hasn't been requested.

---

## Jeff's Contact / Account Info

- **Email:** jeff.loewen@comcast.net
- **Cloudflare account:** credentials already configured — never ask for them
- **Home Assistant instance:** "Beehive" — local `homeassistant.local`/`192.168.1.66`; remote (primary) `https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa`
- **Weather Underground PWS:** station `KTNWHITE21`, API key `0e87ee079c0147a787ee079c01d7a75d`
- **Mower:** Toro TimeMaster 21200
- **Jeff wired his own house** — skilled and comfortable in the breaker panel. Never suggest hiring an electrician; talk to him as a capable peer on electrical/hardware.
- **Jeff is almost 60 and learning** the software/AI side — be patient and clear there, never condescending. On hands-on hardware/electrical/firmware he is experienced. Make it enjoyable.
