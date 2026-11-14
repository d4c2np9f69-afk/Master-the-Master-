# Project reference - moved out of CLAUDE.md 2026-11-02

CLAUDE.md loads with the first file touched in the repo and again after every compaction. Read this when working on the app.

## What This Project Is

A Progressive Web App (PWA) for Jeff's Toro TimeMaster 21200 lawn mower, grown into a whole-home command center. Single `index.html` file deployed on Cloudflare Pages.

- **Live URL:** `https://toro1-5rz.pages.dev` (also `loewenhome.com`)
- **Cloudflare Pages project name:** `toro1`
- **Repo:** `d4c2np9f69-afk/master-the-master-` — **this IS the repo Cloudflare Pages deploys, confirmed live 08-06** (Jeff saw new work appear in the app after a push here). There is a second GitHub repo, `d4c2np9f69-afk/Toro-Timemaster-`, that diverged from this one after ~07-24 (one-way "Sync from Master-the-Master-" commits show it was always downstream, never the source) — **do not develop on Toro-Timemaster- going forward**, it's a stale mirror. See `docs/repo_deploy_mystery_coworker_ask_2026-08-06.md` for the full trail if this ever comes up again.
- **Active branch:** `claude/time-master-project-liq1jw`
- **`main` branch:** contains only `Toro_TimeMaster_PWA_Package.zip` — do NOT use it for deploys

Six sections: **HOME** (cameras, then LUX thermostat, then utilities), **WEATHER**, **IRRIGATION**, **YARD** (mower data), **GUARDIAN** (whole-home safety/security/alarm), **CAR** (vehicle switcher: Mercedes GLE 350 + Ford F-250).

**🛡️ HOME GUARDIAN is the designated home for ALL Home Assistant security, home-alarm, and system checks (Jeff, 07-04).** Every future security/alarm feature goes here, built from the Section Kit + `--a-guardian` accent, live from HA `/api/states` via `loadGuardian()`.

---

## Project Goals (what every session should move forward)

- App always fully working across all sections (nav, modals, tabs)
- Live sensor data flowing from ESP32 â†’ app (battery/RPM/GPS/mileage)
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

## index.html Structure

- HTML/CSS (sections, heroes, cards), then a single `<script>` block containing all JavaScript, then closing HTML. Single file, several thousand lines and growing — check `wc -l` for the current count.

**CRITICAL:** NEVER put a `<script>` or `</script>` tag inside the JS block — fatal JS SyntaxError that blanks the entire app (the 2026-06-23 blank-page incident — introduced by `f599bd9`, fixed by `a973c8f`; the old `8497827` attribution was wrong, it only touched service-worker.js (archive §18 #1)).

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
service-worker.js                 — PWA cache version. **Bump it on every asset change.** Do NOT record the number here: this line has now been stale twice (claimed v78 at v92, claimed v96 at v112). **Read the file.**
manifest.json                     — PWA manifest
functions/api/hours.js            — GET/POST sensor data ↔ Cloudflare KV + box control channel
firmware/mower_hours_esp32/       — THE ESP32 FIRMWARE (canonical copy; secrets.h gitignored)
scripts/mower-hours-test.mjs      — run before ANY hours.js deploy (45 checks, mock KV)
functions/api/auth.js             — family login (see Family Login below)
functions/api/ha.js                — server-side proxy to HA (Nabu Casa)
functions/api/ha-stats.js          — server-side proxy to HA's WS-only Statistics API (real hourly/daily electric)
functions/api/climate.js          — LUX thermostat via Azure B2C + myluxstat.io
functions/api/weather.js          — WU KTNWHITE21 + Open-Meteo fallback
functions/api/mowconditions.js    — Open-Meteo hourly mow conditions proxy
functions/api/irrigation/index.js — GET B-Hyve status + ?tk=1 session token
functions/api/irrigation/control.js — POST B-Hyve control (legacy fallback)
functions/setup.js                — serves Beehive install script at /setup
beehive/esphome/hcc-mower.yaml     — ESP32 heartbeat config (NOT flashed to hardware)
images/                           — hero-home-dusk.jpg, hero-irr.jpg, hero-yard.jpg, hero-guardian.jpg, hero-car.jpg, hero-cameras.jpg, hero-lux.jpg
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

## Testing — RUN THESE. They work on THIS PC. (corrected 2026-08-19)

**Two commands, both from the repo root. Run before reporting ANY app change as done.**

```bash
node scripts/lint-app.js         # guardrail lint  — pure Node, NO dependencies
node scripts/smoke-test.js       # full UI smoke   — Playwright, already installed here
node scripts/image-fit-audit.js  # every photo, every device Jeff named
```

Exit code 0 = clean. `lint-app.js` catches the exact anti-patterns that caused real
production bugs: `window.open()` (dead in an installed iOS PWA — ~20 dead buttons, 07-31),
raw `fetch(base+…)` bypassing `haFetch()` (the whole "Beehive Offline" bug class), a
`<script>` tag inside the JS block (the great blank-page incident, 06-23), and unguarded
`JSON.parse`. `smoke-test.js` walks every nav section, every YARD/CAR tab, all 11 Guardian
chips, all 4 modals, and verifies every external link has a real href.

**Verified working on this PC 2026-08-19 23:33:** lint clean; smoke passed with
**374 external links / 0 bad, 0 page errors**. Node **v24.19.0**, Playwright resolvable
from the repo.

### `image-fit-audit.js` — Jeff's rule, 2026-08-20
> *"if you edit the pic make sure they fit all devices when you finish Web, TV, iPad,
> computer and iPhone both landscape and portrait."*

It does not take screenshots and eyeball them. For every `<img>` at **14 device sizes x 6
sections** it computes the exact rectangle of the source photograph that survives the
`object-fit`/`object-position` crop, and fails the build on four things that have each
already shipped as a real bug: **HEAD-CROP** (the top of `hero-yard.jpg` is cut — Jeff's
hair starts at source row 22 of 851; this shipped 08-11), **LETTERBOX** (blank bars beside
a photo — the 08-06 desktop gap), **OVERCROP** (over half the photo thrown away), and
**OVERFLOW** (page scrolls sideways). Baseline 2026-08-20: **216 renders, PASS.**

### 📺 JEFF'S ACTUAL SCREEN — measured, stop guessing at it
The beast PC drives a **60-inch Vizio** (EDID panel 133 x 75 cm, `VIZ` vendor ID),
1920x1080 native, **Windows at 125% scaling** — so his browser reports **1536 x 864 CSS
pixels**. **His "computer" and his "TV" are the same physical display.** Every earlier
responsive test jumped 1440 -> 1920 and skipped the one width he actually looks at. It is
now the first entry in the audit matrix. A 4K/3840 viewport is NOT one of his devices —
do not treat a finding that only appears there as urgent.

## Change Log — INDEX ONLY (full detail archived, read it when you need the why)

🔴 **The 100-entry index that used to sit here was removed 2026-09-16 — it was 95 lines of dated one-liners in the one file that loads on EVERY turn, and its own header already said the detail lives elsewhere.**
**Full history: `docs/CHANGELOG_ARCHIVE.md` (179 KB) and the iCloud mirror `HCC-Archive\CLAUDE_CHANGELOG_FULL.md`. The pre-trim file is preserved whole at `docs/PROJECT_REFERENCE.md`.**
New sessions: append ONE line to the archive, not to this file.

**Most recent entries only:**

**⚠️ FULL HISTORY LIVES OUTSIDE THIS FILE — and you should go read it when a decision's
reasoning matters:**
- `docs/CHANGELOG_ARCHIVE.md` (in this repo, version-controlled, NOT auto-loaded)
- `C:\Users\jeffl\iCloudDrive\HCC-Archive\CLAUDE_CHANGELOG_FULL.md` (iCloud mirror)

Moved 2026-08-16 07:18: the Change Log had reached 177 KB, 68% of this file, and this
file is injected into every message. **Keep it that way — new sessions append ONE LINE here and
the detail goes in the archive.**

- 08-15 evening (coworker — full-stack audit + the backyard camera root cause, latest)
- 08-11 evening (coworker — mower box made maintainable; 6 real bugs, all found by running it against hardware, latest)
- 08-11 10:05 PM CDT (full diagnostic sweep on Jeff's orders — closed Pending Item 17, the light-mode contrast bug class, latest)

## Jeff's Contact / Account Info

- **Email:** jeff.loewen@comcast.net
- **Cloudflare account:** credentials already configured — never ask for them
- **Home Assistant instance:** "Beehive" — local `homeassistant.local`/`192.168.1.66`; remote (primary) `https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa`
- **Weather Underground PWS:** station `KTNWHITE21`, API key **moved out of this public repo 2026-08-19 -> `HCC-secrets/weather_underground_api_key.txt`. It was public from at least 08-16 and is still in git history, so it MUST be rotated at wunderground.com - removing it from this file is not enough.**
- **Mower:** Toro TimeMaster 21200, **Serial No. 401338948** (confirmed 08-03 via data-plate photo) — falls in the `400000000-402081999` production range, so PartsTree's `21200-toro-30-timemaster-walk-behind-mower-sn-400000000-402081999` and eReplacementParts' `toro-21200-400000000402081999-...` are the correct parts-diagram links for his actual mower (not the `402082000-403599999` range).
- **Jeff wired his own house** — skilled and comfortable in the breaker panel. Never suggest hiring an electrician; talk to him as a capable peer on electrical/hardware.
- **Jeff is almost 60 and learning** the software/AI side — be patient and clear there, never condescending. On hands-on hardware/electrical/firmware he is experienced. Make it enjoyable.
