## The Beginning — the original Toro TimeMaster app and the lost eight weeks (2026-05-19 → 2026-06-21)

This section reconstructs the origin era of the project: the first surviving app (a zip Jeff uploaded to GitHub on 2026-05-20, whose files are timestamped 2026-05-19 22:30), the month-long hole in the record between that upload and the first real code commits, and the four commits on the evening of 2026-06-21 that turned "a mower maintenance app" into the Home Command Center. Everything below is cited to a commit hash, a file path, or the contents of the code itself. Anything that is reasoning rather than evidence is prefixed **INFERRED:**.

**Primary sources for this section:**

- `Toro_TimeMaster_PWA_Package.zip` (20,663 bytes), committed to the repo's `main` branch in commit `09f02d4` (2026-05-20 08:35:18 -0500, message "Add files via upload", author `d4c2np9f69-afk <d4c2np9f69@privaterelay.appleid.com>`, committer `GitHub <noreply@github.com>` — i.e., Jeff's own GitHub account uploading through the GitHub web UI). The unzipped contents: `index.html` (43,292 bytes), `manifest.json` (401 bytes), `service-worker.js` (423 bytes), `icons/icon-192.png` (2,551 bytes), `icons/icon-512.png` (7,443 bytes) — all file-timestamped **2026-05-19 22:30**.
- Commit `0e7e18d` (2026-06-21 17:14:43 UTC) — "Extract Toro TimeMaster PWA package source files". Verified byte-identical to the zip contents.
- Commit `0b76d4c` (2026-06-21 20:31:18 UTC) — "Add full live app source — B-Hyve, weather, GPS, ESP32 integrations" (+2,285 / −525 lines on `index.html`).
- Commit `eb342db` (2026-06-21 20:39:33 UTC) — "Transform Toro app into Home Command Center (HCC)".
- Commit `6649269` (2026-06-21 20:47:38 UTC) — "Embed HCC hero image in app header".
- The first two versions of `CLAUDE.md` (commits `e8f0312` 2026-06-23 and `90e556e` 2026-06-24), used here only where they record facts about this era.

---

### 1. Day one: the original Toro TimeMaster 21200 PWA (files dated 2026-05-19)

The zip is the earliest surviving artifact of the entire project. It is a complete, working, single-file Progressive Web App — no build system, no backend, no network calls at all except outbound shopping/YouTube links. Everything about Jeff's mower that the project would later grow around is already baked into this file as hardcoded data.

**Provenance note:** the zip landed on the repo's `main` branch, and `main` never received anything else. The CLAUDE.md written a month later records this permanently:

> **`main` branch:** contains only `Toro_TimeMaster_PWA_Package.zip` — do NOT use it for deploys

(CLAUDE.md at commit `90e556e`, 2026-06-24; the same line survives in the tip CLAUDE.md as of 2026-08-16.)

**INFERRED:** The zip itself was almost certainly produced by a claude.ai conversation on or before 2026-05-19 (the app is far too polished and idiosyncratically complete to be hand-written, and its packaging — "PWA_Package.zip" with icons — matches Claude artifact export patterns). No transcript of that conversation survives anywhere in the repo. The record is silent on how many conversations preceded the zip — but one internal clue suggests at least one earlier iteration existed: the app's localStorage key is `"toro-v2"` (`const SK="toro-v2"`, zip `index.html` line 86). A "v2" key implies a "v1" app that is lost entirely.

#### 1.1 Identity and design

- **Title / branding:** `<title>Toro TimeMaster 21200</title>`; Apple home-screen name **"TimeMaster"**; header shows a red **TORO** badge (SVG, Arial Black, letterspaced) next to "TimeMaster 21200".
- **Manifest** (`manifest.json`): name "Toro TimeMaster 21200", short_name "TimeMaster", `background_color: #111111`, `theme_color: #CC0000` (Toro red), icons 192/512.
- **Service worker** (`service-worker.js`): cache name **`toro-timemaster-v1`**, a minimal install-time cache of 5 assets with a cache-first fetch handler. (This tiny cache-first worker is worth remembering: stale-cache fights became a recurring plague later in the project — the hcc-v3/v4/v5 cache-bust commits of 2026-06-23 all descend from this file.)
- **Visual design:** iOS-native look — `-apple-system` font, light theme `#f5f5f7` background with a `prefers-color-scheme: dark` variant, Toro red `#CC0000` accents, bottom tab bar with `env(safe-area-inset-bottom)` padding, black-to-dark-red gradient header. This is a completely different design language from everything that came after (the 06-21 app is dark/Archivo/neon; see §3).
- **Footer** (rendered on every page, verbatim):

> TORO TIMEMASTER 21200 · SN 401338948 · MAINTAINED TO WIN

That "MAINTAINED TO WIN" slogan is unique to the original app. The later slogan — "MASTER THE MASTER," which gave the GitHub repo its name — does not exist anywhere in the zip. (See §3.19.)

#### 1.2 The six tabs

A bottom tab bar (`#tabbar`, zip lines 75–82) with six views:

| # | Tab | Icon | Contents |
|---|-----|------|----------|
| 0 | **Dashboard** | ⊞ | Alert strip (overdue/due-soon), Asset Information card, Hour Meter card (editable), Condition Scores card (rings + sliders), Service Timeline |
| 1 | **Maintain** | 🔧 | Three sub-tabs: 📋 Schedule (Before-Each-Use checklist, Hour-Based Schedule, Engine Specs), ⏰ Alerts, 📅 Annual (per-year checklist 2024–2028 with progress bar) |
| 2 | **Parts** | ⚙️ | 16-part status list with per-part status dropdown (✓ OK / ⚠ Warn / ✕ Replace), YouTube how-to button, best-retailer button, eBay button |
| 3 | **Diagnose** | ⚠️ | Current Issues list (add/resolve) and free-form Notes |
| 4 | **Log** | ＋ | New service entry form (date, type, title, multi-line "Work Performed") appending to the timeline |
| 5 | **Shop** | 🛒 | Parts shopping list: category filters, checkbox cart, and per-part retailer comparison cards across 6 retailers |

All state persisted to `localStorage["toro-v2"]`; a green "Saved ✓" flash message confirmed each write.

#### 1.3 The mower data baked into the app (the `INIT` object, zip lines 177–192)

**Asset Information:**

| Field | Value |
|---|---|
| Model | Toro TimeMaster 21200 |
| Serial | **401338948** |
| Purchased | **2018-04-11** |
| Engine | Briggs & Stratton 223cc OHV |
| Cut Width | 30" |
| Drive | Personal Pace Self-Propel |
| Condition | "Strong · Fully Rebuilt" |

**Hour meter:** reading **1.1 hrs**, last updated **2026-05-13**, note: *"Hour meter newly installed."* So six days before the zip's file date, Jeff had installed a physical hour meter on the freshly rebuilt mower and it read 1.1 hours.

**Condition scores:** deck 90, engine 95, transmission 95, ignition 95, **overall 92** — with slider inputs to adjust each, overall auto-recomputed as the average of the four.

**The restoration timeline** (`INIT.timeline`, verbatim items):

| Date | Type | Title | Items |
|---|---|---|---|
| 2018-04-11 | purchase | Purchased New | "Toro TimeMaster 21200 purchased new" |
| 2023-01-01 | service | Major Service | "Replaced belts, blades, cables", "Transmission serviced" |
| 2026-04-09 | oil | Oil Change | "5W-30 Full synthetic", "Filter inspected" |
| 2026-05-09 | service | Full Restoration | "All belts, blades, spindles, pulleys replaced", "Deck painted, wheels, cables, pull cord replaced", "Fuel filter & shutoff replaced" |
| 2026-05-13 | ignition | Ignition Complete | "Aftermarket ignition coil installed", "Champion RJ19LM — 0.030 gap", "Spark plug boot replaced", "Hour meter — 1.1 hrs" |

Note the "2023-01-01 Major Service" entry — the much more detailed history that surfaced in the 06-21 app (§3.10) dates that same belts/blades/cables/transmission campaign to **February 2025**, with per-part receipts. The two records disagree; the later, receipt-level record is presumably the correction. The zip's "2026-04-09 Oil Change" entry likewise never reappears in the later history. The record is silent on which is right.

**Diagnostics defaults:** zero current issues, three notes: "Hour meter newly installed · 1.1 hrs logged", "Spark Plug: Champion RJ19LM · 0.030 gap", "Ignition coil installed — running strong".

#### 1.4 The 16-part parts database (`PARTS`, zip lines 136–153)

Every part has a status ("ok" across the board — the mower had just been rebuilt), a date, and a color-coded category (Cutting red, Drive blue, Chassis green, Controls amber, Engine violet, Fuel orange):

| Component | Part # | Date | Category |
|---|---|---|---|
| Blades | 133-8062 | 2026-05-09 | Cutting |
| Blade Spindles | 117-1196 | 2026-05-09 | Cutting |
| Pulleys | 106-9171 | 2026-05-09 | Drive |
| Blade Drive Belt | 121-5956 | 2026-05-09 | Drive |
| Trans. Drive Belt | 121-5957 | 2026-05-09 | Drive |
| Wheels | 117-5976 | 2026-05-09 | Chassis |
| Cables | 119-8891 | 2026-05-09 | Controls |
| Transmission | 117-5975 | 2026-05-09 | Drive |
| Deck Height Adj. | 117-5968 | 2026-05-09 | Chassis |
| Pull Cord | 117-9127 | 2026-05-09 | Engine |
| Air Filter | 110-0836 | 2026-05-09 | Engine |
| Fuel Filter | 125-5271 | 2026-05-09 | Fuel |
| Fuel Shutoff Valve | 125-4451 | 2026-05-09 | Fuel |
| Ignition Coil | (Aftermarket) | 2026-05-13 | Engine |
| Spark Plug | RJ19LM | 2026-05-13 | Engine |
| Spark Plug Boot | (OEM) | 2026-05-13 | Engine |

(Archivist's note: these Toro part numbers do not all match the ones used in the 06-21 app's parts catalog — e.g. blades are 133-8062 here but 120-9500 / 116-6358 there, belt 121-5956 here vs 121-5765 there. **INFERRED:** the lost month included a research pass that corrected/replaced the original part-number set.)

#### 1.5 The YouTube how-to video map (`VIDEOS`, zip lines 106–123)

Each part number mapped to a curated repair video with title and year — 16 entries:

| Part # | Video title | Year |
|---|---|---|
| 133-8062 | Blade Replacement Step-by-Step | 2024 |
| 117-1196 | Spindle, Shaft & Bearing Repair | 2022 |
| 106-9171 | Transmission Pulley Replacement | 2024 |
| 121-5956 | Belt Replacement — Save Half the Time | 2024 |
| 121-5957 | Sync Belt & PTO Belt Replacement | 2025 |
| 117-5976 | TimeMaster Full Tune-Up | 2023 |
| 119-8891 | Blade Engagement Cable Replacement | 2022 |
| 117-5975 | Transmission Replacement | 2024 |
| 117-5968 | TimeMaster Full Tune-Up | 2023 |
| 117-9127 | Pull Rope Replace & Rewind | 2021 |
| 110-0836 | Tune-Up: Oil, Plug & Air Filter | 2023 |
| 125-5271 | Oil Change & Air Filter | 2026 |
| 125-4451 | Fuel Shut-Off Valve Install | (no year) |
| (Aftermarket) | Ignition Coil Replacement Fix | 2021 |
| RJ19LM | Spark Plug & Gap Setting | 2024 |
| (OEM) | Spark Plug & Boot Replacement | 2024 |

Rendered as red "▶ '24 How-To" YouTube-styled buttons throughout the app.

#### 1.6 The six retailers (`RETS`, zip lines 125–132)

Each with brand color, OEM/aftermarket coverage tag, a one-line note, and a search-URL builder:

| Retailer | Type | Note |
|---|---|---|
| Amazon 🛒 | OEM+AFM | "Fastest ship" |
| eBay 🔖 | OEM+AFM | "Sort lowest price" (URL pre-sorted lowest price `_sop=15`) |
| eReplacementParts 🔩 | OEM | "OEM verified" |
| PartsTree 🌲 | OEM | "Exploded diagrams" |
| Jack's SE ⚙ | OEM+AFM | "Engine specialist" |
| ProvenPart ✅ | OEM+AFM | "Tune-up kits" |

A `BEST` map ranked which retailers to show first for each specific part number. The Shop tab assembled per-part comparison cards from this data. **There are no prices anywhere in the zip** — price ranges first appear in the 06-21 app.

#### 1.7 The maintenance schedule (`SCHED` + `ANNUAL`, zip lines 156–173)

Hour-based schedule (WARN window: 5 hrs before due):

| Task | Interval | Critical | Part | Detail (verbatim) |
|---|---|---|---|---|
| Engine Oil — Break-In | @ 5 hrs, one-time | yes | SAE 30/10W-30 | "Required after first 5 hrs" |
| Engine Oil — Change | / 50 hrs | yes | SAE 30/10W-30 | "Standard interval" |
| Air Filter — Clean | / 50 hrs | no | 110-0836 | "Tap or blow <30 psi" |
| Blade-Drive Belt — Inspect | / 50 hrs | no | 121-5956 | "Check tension & condition" |
| Spark Plug — Inspect | / 100 hrs | yes | RJ19LM | "Gap: 0.030\"" |
| Fasteners — Tighten | / 100 hrs | no | — | "Blade bolt: 60 ft-lb" |
| Air Filter — Replace | / 200 hrs | no | 110-0836 | "Full replacement" |

"Before Each Use" checklist (Maintain tab): Engine Oil Level ("Check & add — dipstick full"), Blade-Brake-Clutch ("Test — blades stop within 3 sec"), Cutting Blades ("Inspect for nicks & cracks"), Air Filter ("Check / tap clean"), Under Deck ("Washout port — run blades 1 min").

Annual / end-of-season checklist (per-year, 2024–2028 selectable): Engine Oil Change ("Drain and refill 0.53 L", critical), Air Filter Service, Blades — Sharpen/Replace ("Check cracks & balance", critical), Spark Plug — Service ("Inspect, gap 0.030\""), Fuel System — Drain ("Run dry before storage", critical), Deep Clean & Inspect ("Underside and deck"), All Fasteners — Tighten ("Blade bolt 60 ft-lb").

**Engine Specs card** (verbatim pairs): Engine "B&S 223cc OHV" · Oil Capacity "0.53 L (18 fl oz)" · Oil Type "SAE 30 or 10W-30" · Spark Plug "Champion RJ19LM" · Plug Gap "0.030\"" · Blade Bolt "60 ft-lb" · Fuel "Unleaded 87" · Coil Gap "0.010\"".

These numbers — **plug gap 0.030", coil gap 0.010", blade bolt 60 ft-lb, 18 fl oz oil** — are the project's oldest constants. They survive verbatim into every later version of the app.

#### 1.8 What the zip does *not* contain

Worth stating explicitly, because everything in this list was later assumed to have "always existed": **no weather, no irrigation, no GPS, no sensors, no ESP32, no fitness tracking, no spending tracker, no prices, no photos, no backup/export, no Cloudflare, no Home Assistant, no mention of electric start or a battery** (the zip's asset card lists only "Personal Pace Self-Propel" drive — the Mighty Max ML3-12 battery that the 06-21 app says was installed 2026-05-07, i.e. *twelve days before the zip's file date*, is entirely absent from the original app). The original app was a pure, offline, single-machine maintenance logbook.

---

### 2. The gap: 2026-05-20 → 2026-06-21 — no repo evidence exists

Stated plainly for the permanent record:

- The repo's entire history for this period is **one commit**: `09f02d4` "Add files via upload" (2026-05-20 08:35 -0500) — the zip landing on `main`.
- The next commit of any kind is `0e7e18d` on **2026-06-21 17:14 UTC** — thirty-two days later — on a new branch, `claude/time-master-project-liq1jw`, which became the project's real branch (636 commits by 2026-08-16).
- **The literal cloud-session transcripts from this month are not in git and, as far as the record shows, are not preserved anywhere.** Jeff worked with claude.ai sessions during this period (see the fossil evidence in §3), but nothing those sessions said, decided, argued about, or cost survives except what got frozen into the 06-21 code snapshot.
- The first CLAUDE.md (commit `e8f0312`, 2026-06-23) starts its session history at 2026-06-23. The file-based memory culture that eventually saved this project **begins after the gap**; nothing was contemporaneously written down during it.

This is the original instance of the problem this whole history file exists to fix. When `0e7e18d`'s commit message says the extraction is "the starting point for the Home Command Center build," and `0b76d4c` eight minutes of work later replaces it with a 4× larger app, the month of collaboration in between had already been reduced to a single artifact with no explanation attached.

Three fragments of hard evidence bracket the gap:

1. **The commit that opens the new era carries a session ID**: `0e7e18d` is signed `Co-Authored-By: Claude Sonnet 4.6` with `Claude-Session: https://claude.ai/code/session_01WuKnDJrDp2n6fHjhtahmLe`. That is the first Claude Code (repo-connected) session of the project. The cloud sessions before it left no such fingerprints.
2. **The 06-21 app calls same-origin `/api/...` endpoints that are not in the repo.** At `0b76d4c` — and still at `6649269`, the last commit of 06-21 — the repo tree contains only the zip, the extracted PWA files, and the rewritten `index.html`. No `functions/` directory. Yet the app fetches `/api/hours`, `/api/weather`, `/api/alerts`, `/api/irrigation`, `/api/irrigation/control`, with a code comment saying "The endpoint lives on this same site (Cloudflare Pages function at /api/hours)". **The backend existed somewhere — a Cloudflare Pages deployment stood up during the cloud era — but its code was not under version control.** The API functions first entered git on 2026-06-23 in commit `c8e729c`, whose title is telling: "Fix all 4 broken API endpoints + unified design layer."
3. **The app's own data is date-stamped.** The `RESTORATION` history and `DEFAULT_STATE` baked into `0b76d4c` contain entries dated 2026-05-20, 2026-05-31, and 2026-06-06 (detailed next section) — waypoints of a month that otherwise vanished.

---

### 3. The fossil record: what the lost month produced (diff `0e7e18d` → `0b76d4c`)

Commit `0b76d4c` (2026-06-21 20:31 UTC) replaces the zip's 576-line `index.html` with a 2,336-line file (+2,285 / −525; ~300 KB including an embedded 274 KB hero photo). The commit message:

> Add full live app source — B-Hyve, weather, GPS, ESP32 integrations
>
> Replaces the basic maintenance-only package with the complete live app
> including B-Hyve irrigation control, weather/NWS alerts, GPS mowing
> tracker, and ESP32 telemetry. Base for Home Command Center build.

"The complete live app" — meaning: this file was not written on 06-21. It is the **export of the app as it existed at the end of the cloud-session era**, pasted into git in one commit. Every feature below that is not in the zip is therefore a product of the lost month. **INFERRED (for all of §3): the features were built between 2026-05-20 and 2026-06-21 in an unknown number of claude.ai sessions; per-feature dates are unknown except where the code itself carries a date.**

#### 3.1 Total rewrite of the app's identity

Same title ("Toro TimeMaster 21200") but nothing else survives:

- **Design:** dark theme (`#000` base, later layered to `#0a0a0b` radial gradients), Google Fonts **Archivo** at weights 400–900, neon accent glows, tabular numerals, gauge-style hour meter displays styled like a physical LCD ("`box-shadow:inset 0 2px 6px rgba(0,0,0,.9)`").
- **Tabs:** the 6 bottom tabs became **7 top tabs**: DASHBOARD, SERVICES, HISTORY, PARTS, DIAGNOSTICS, UPGRADES, SPECS.
- **Header:** TORO badge + "TIMEMASTER® 21200 / MAINTENANCE RECORD & PARTS REFERENCE", a 6-cell spec strip (Model 21200 · Serial 401338948 · Engine **B&S 14D935** · Purchased 2018-04-11 · tappable Hour Meter · Condition 99%), an embedded full-width **mower photo** (274 KB base64 JPEG) captioned "30″ DUAL FORCE • PERSONAL PACE", and three action buttons: **🌿 LOG MOW · 🔧 LOG SERVICE · ⏱ UPDATE HOURS**.
- **Engine identification upgraded:** from the zip's generic "Briggs & Stratton 223cc OHV" to the exact spec **B&S 14D935-0111-F1** — precise enough to link the exact PartsTree engine diagram. (One frozen error worth recording: the Parts tab's Toro diagram button links the PartsTree model page for "SN 400000000-402081999" — which correctly contains Jeff's serial 401338948 — but the "eReplacementParts (alt)" button links the *402082000–403599999* serial-range page, which does **not** cover Jeff's mower. Nobody appears to have ever noticed.)
- **Storage key changed** from `toro-v2` to **`toro21200`** — a clean data break from the original app. The key `toro21200` remained the app's storage key permanently.
- **New footer** (verbatim, both lines):

> WELL MAINTAINED. WELL DOCUMENTED. **BUILT TO LAST.**
> KEEP IT CLEAN. KEEP IT SHARP. **MASTER THE MASTER.**

"MAINTAINED TO WIN" is gone; **"MASTER THE MASTER" appears here for the first time in the surviving record** — see §3.19.

- The page also carries `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">` — **INFERRED:** the cloud-era deployment was already fighting stale-cache problems, foreshadowing the service-worker cache wars of 06-23.

#### 3.2 The "Smart TimeMaster Digital Twin" — ESP32 telemetry package

The single biggest product of the lost month: Jeff's mower got a custom sensor computer. The app's fixed history (`RESTORATION.unshift`, all rows dated **2026-06-06**) documents the hardware, verbatim notes included:

| Entry (2026-06-06) | Part | Note (verbatim) |
|---|---|---|
| Smart TimeMaster Digital Twin sensor package documented | ESP32 / GPS / MPU6050 / Voltage | "Telemetry, diagnostics, GPS mowing sessions, battery warnings, RPM estimate, vibration health, and predictive maintenance direction locked." |
| ESP32 smart controller added | ESP32-C3 / ESP-WROOM-32 | "Central WiFi controller for sensor telemetry and Cloudflare app sync." |
| NEO-6M GPS module added | GY-NEO6MV2 | "Feeds miles walked, speed per mow, session map, and lifetime hidden distance totals." |
| MPU6050 motion/RPM sensor added | GY-521 MPU6050 | "Detects vibration, shock, slope, tip risk, and estimates engine/blade RPM after calibration." |
| Battery voltage sensor added | DC 0-25V Voltage Module | "Warns for weak battery, replace battery, and voltage too low to start electric start." |
| Sensor power protection added | LM2596 + inline fuse | "Regulated fused power feed for stable electronics operation." |
| Weatherproof sensor enclosure and harness added | ABS project box + Dupont wiring | "Protects electronics and organizes the sensor wiring harness." |
| GPS Fitness Feed Enabled | GPS distance tracking | "GPS distance now updates Fitness miles walked and GPS MPH automatically when synced." |
| Weather station linked | KTNWHITE21 / Ambient Weather WS-2902 | "Indian Ridge / jalo301 PWS at 36.477N, 86.66W (863 ft). Weather and radar coordinates aligned to the station; AMBWeatherV3.0.0." |

So the sensor package was assembled and its direction "locked" on/around **2026-06-06** — mid-gap. The UPGRADES tab lists all of it (ESP32 controller, NEO-6M, MPU6050, LM2596 buck converter, inline fuse holder, weatherproof ABS enclosures, Dupont jumper harness, WiFi Engine Hour Sensor "Cloudflare-connected", GPS Mowing Tracker, RPM Sensor Feed, Battery Voltage Monitor) as "✓ INSTALLED", each with the Amazon search URL it was presumably bought from. **No purchase prices for the sensor hardware are recorded anywhere in this era** — the record is silent on what the ESP32 package cost.

**The dashboard's "📡 Engine Hour Sensor Data" card** (cyan-coded) reads from `/api/hours` and displays: Battery Voltage, a battery alert banner, Battery Health %, Start Reliability, Engine RPM (peak / avg), GPS Distance (Total), GPS Distance (This Mow), GPS Speed, Last Location (lat/lon), plus a four-chip **Sensor Health strip** (MPU / GPS / BATT / WIFI, each OK/MISSING/SILENT/dBm), a "🔄 Sync From Sensor Now" button, and a status line. Card description, verbatim:

> Pulls engine hours, battery, RPM, GPS distance, and mowing speed from the WiFi/GPS sensor. GPS distance feeds the Fitness miles walked tracker automatically. Hours only ever move forward.

The sync code (`window.mowerSync`) contains two comments that preserve cloud-era decisions verbatim:

> // The endpoint lives on this same site (Cloudflare Pages function at /api/hours), so this is a same-origin call - no domain to set, no CORS.

> // Hours already on the mower the day you install the sensor. The sensor counts up from 0, so displayed hours = BASELINE + sensor hours. Set this to whatever this dashboard reads on install day (right now that's 5.4).

`MOWER_BASELINE = 5.4` — the mower had 5.4 hours on it the day the sensor was installed. Battery interpretation thresholds are hardcoded: ≥12.6 V "✓ Battery healthy" (100%), ≥12.3 V "⚠ Battery capacity declining" (82%), ≥12.0 V "⚠ Battery weak — replacement recommended" (65%), ≥11.8 V "🚨 Low starting voltage — recharge or replace" (35%), below that "🚨 Voltage too low to start — replace battery" (10%). Tip-over logic: max(|pitch|,|roll|) ≥25° "CRITICAL", ≥20° "RED", ≥15° "CAUTION".

**A fossil bug frozen in this commit:** the JS sets rows `sensorPitch`, `sensorRoll`, `sensorVibe`, `sensorShock`, `sensorTip`, `sensorWifi`, `sensorTemp` — and the CSS styles those IDs — but **no DOM elements with those IDs exist in the HTML**. The `setRow` helper silently no-ops, so pitch/roll/vibration/shock/tip/WiFi/temp data was computed and then displayed nowhere. This exact defect was fixed two days later in commit `4c52e85` (2026-06-23, "Fix missing CSS variables, card accent colors, and sensor panel DOM rows") — proof that the cloud-era export shipped with dangling wiring that only repo-based, testable sessions caught.

#### 3.3 GPS Yard Map

A `<canvas id="yardMap">` card ("🗺 Yard Map • GPS Mowing Track", teal-coded): renders the sensor's GPS `track[]` as a self-contained map — no tiles, no API keys — with equirectangular projection (longitude compressed by cos(latitude) "so shape isn't stretched"), north up, auto-fit with padding, green track line, blue start dot, red latest dot, and a live point count ("N GPS points · blue = start, red = latest"). Card copy, verbatim:

> Drawn from the WiFi sensor's GPS as you mow. Each pass adds to the map, so your yard's shape fills in over time. North is up.

Empty state: "No GPS track yet — it'll appear after your first mow with the sensor installed."

#### 3.4 Fitness — Miles Walked Mowing

A green-coded dashboard card treating mowing as exercise: Total Distance (miles), Calories Burned, Mows Tracked, Avg Mi/Mow, GPS MPH, ~Steps. The model, from code: **~95 kcal/mile pushing a mower × 1.20 slope factor** ("gentle ~5% grade: +20% calories"), **~2,100 steps/mile**, default 4.0 mi per full mow. Fine print verbatim: "10,000 sq ft yard · GPS sensor feeds miles + speed · 30″ swath · gentle slope (+20% cal)". The LOG MOW modal has a "🚶 Miles Walked (Apple Watch)" field, "Auto-filled to 4.0 mi for a full yard — edit for partial mows."

A design decision from the lost month is preserved as a code comment, verbatim:

> // Mower GPS distance is its OWN stat (the "Mower Distance" row below) — do NOT add it to "Miles Walked", which comes solely from your Apple Watch entry. Adding both would double-count the same physical distance once GPS is live.

So by the end of the gap the project had already litigated (and settled) the Apple-Watch-vs-GPS double-counting question. This is the first appearance of Jeff's **Apple Watch** in the record.

#### 3.5 Weather — "Mowing Conditions • White House, TN 37188"

The lost month located the project in the physical world: **White House, Tennessee, 37188 — 36.477° N, 86.66° W, 863 ft elevation**. The weather card assembles:

- **Open-Meteo forecast API** (free, keyless): temperature, humidity → derived dew point, rain probability, precipitation, soil temperature, WMO weather codes. Derived tiles: Temperature, Dew Point, Rain Risk, Soil Condition (FIRM/MOIST/WET), Soil Temp, Dew on Grass (DRY/LIGHT/WET), Soil Firmness, Rain 24-48h (probability + inches), Heat Stress (LOW <80°F / MODERATE <90 / HIGH <103 / EXTREME), Lightning (thunderstorm codes 95/96/99 in next 24h → RISK/NONE).
- A verdict banner: "✓ GOOD TO MOW" / "⚠ MOW WITH CAUTION" / "🚫 DO NOT MOW" (rain risk >55% or >0.35" → NO; >30% or >0.12" → CAUTION).
- **Jeff's own personal weather station**, proxied server-side via `/api/weather` (Weather Underground PWS API): station **KTNWHITE21**, name **"Indian Ridge / jalo301"**, hardware **Ambient Weather WS-2902**, software AMBWeatherV3.0.0. Live station readings override the forecast tiles, with a note line "📡 Live from your station KTNWHITE21 · …". A button opens the Wunderground station dashboard.
- **Embedded live rain radar**: a Windy.com iframe centered on 36.477,-86.66 (radar overlay, mph/°F units) plus an "Open Full Radar & Forecast" button.
- **NWS alerts** via `/api/alerts` feeding the readiness engine (below) and the burn card.

#### 3.6 The "Ready to Mow?" readiness engine

A combined go/no-go verdict fusing every data source the project had: official NWS watches/warnings (with per-type icons — freeze/frost, wind, heat, thunderstorm); a frost rule ("Frost/freeze — don't mow frosted grass; wait until it thaws & dries" when a freeze alert is active before 11 a.m.); a seasonal rule ("First freeze near — time to winterize / blow out your irrigation" for freeze alerts in September or later — the comment records "your season runs May–first freeze"); irrigation interlocks ("Irrigation running now (Zone N) — do not mow yet"; "Irrigation ran ~Nh ago — let the grass dry before mowing" within 8 hours); weather status; heavy-dew warning; overdue/due-soon services by name; and overall mower health. Verdict banner: 🚫 NOT READY / ⚠ MOW WITH CAUTION / ✓ GOOD TO MOW.

#### 3.7 B-Hyve irrigation — "Water Hog"

First appearance of the second major hardware system: Jeff's **Orbit B-hyve irrigation timer, device name "Water Hog"** (the card's fine print: "Live from your Orbit B-hyve • Water Hog"). Via a server-side proxy (`/api/irrigation`, again not in the repo yet):

- Device status (ONLINE/OFFLINE), run mode, rain-delay state; banner "💧 WATERING — Zone N" / "✓ All zones idle".
- Per-zone rows with the B-hyve zone photos, WATERING/IDLE state, "Smart watering" tag, and a ▶ run button.
- **Controls, PIN-gated**: start a zone for 1–60 minutes (prompt, default 10), "■ STOP ALL", rain delay 24h/48h, "☀️ CLEAR DELAY". Commands POST to `/api/irrigation/control` with a PIN the app stores in `localStorage["irr_pin"]`; wrong PIN clears it and re-prompts.
- **Water usage & cost model** — the project's first money-math feature, with constants that record real research from the lost month: zone flow rates `{Zone 1: 17.2 GPM, Zone 2: 14.3 GPM, Zone 5: 5.7 GPM}` from "Hunter MP flow @180°" charts ("MP3500 x6/x5, MP3000 x3") at "82 psi supply, no shortfall"; representative run times 20/18/8 min; 3 watering days/week; **White House Utility District 2026 rates: water $0.00908/gal + sewer $0.01136/gal**. It computes per-cycle, weekly, and monthly gallons and dollars, and includes this note, verbatim:

> WHUD 2026: water $0.00908 + sewer $0.01136/gal. 💡 **Irrigation water never enters the sewer** — ask WHUD about **seasonal sewer averaging** (or an irrigation meter) to drop the sewer half: water-only would be ~$X/mo. Flow est. from Hunter MP charts at 180°; your 82 psi confirms no pressure shortfall.

(That "irrigation water never enters the sewer" insight, first recorded here, is the seed of the sewer-overcharge investigation that shows up in the August 2026 docs — `docs/utilities/sewer_overcharge_verification_2026-08-05.md` in the tip tree.)

#### 3.8 Brush Burn Conditions

A fire-safety card scoring wind/gusts (from the PWS), humidity, recent rain ("fuels damp"/"fuels dry"), heat ≥95°F, and NWS fire-weather products (Red Flag Warning +4, Fire Weather Watch +2, Wind Advisory +2) into a four-flag verdict: 🟢 GREEN FLAG "Safe to burn" / 🟡 YELLOW FLAG "Burn with caution" / 🚩 RED FLAG "Burning not advised" / 🏴 BLACK FLAG "No burning — extreme fire danger". Footer: "Always check local burn bans/permits; keep water & a tool on hand." **INFERRED:** Jeff burns brush on his property; this card was built for a real recurring chore, like everything else in the app.

#### 3.9 The restoration history with prices — the money record

The HISTORY tab gained a fixed "Complete Maintenance History" table (`RESTORATION` array) that replaces the zip's 5-entry timeline with a 29-entry receipt-level record. This is the earliest surviving cost accounting in the project. In full:

| Date | Service / Repair | Part # | Cost | Note (verbatim) |
|---|---|---|---|---|
| 2026-05-20 | Mow #2 | — | — | "Full yard • 1.25 hrs" |
| 2026-05-14 | Mow #1 — First post-restoration | — | — | "Full yard • 1.25 hrs. Engine smooth." |
| 2026-05-13 | Ignition Coil & Plug Boot | 139-0720 / 399781 | **$25.97** | "RPM stable. No misfire." |
| 2026-05-13 | Spark Plug Replaced | Champion RJ19LM | **$3.99** | "Gap set 0.030\". Smooth idle." |
| 2026-05-11 | Blades Sharpened & Balanced | 120-9500 / 116-6358 | — | "Both blades at 60 ft-lb." |
| 2026-05-10 | Full Deck Strip, Sand & Repaint | — | — | "Toro red + clear coat. Rust-Oleum 302110." |
| 2026-05-10 | All 4 Wheels Refinished | 131-9665 / 131-9666 | — | "Gloss black. New bearings." |
| 2026-05-09 | Drive Belt & Transmission Service | 121-5765 / 120-9470 | — | "Belt verified. Pulley cleaned." |
| 2026-05-09 | Oil Change — Restoration Start | 100074 | **$15.00** | "Full Synthetic 5W-30. Hour meter at 0.0 hrs." |
| 2025-05-27 | Carburetor Replaced | HUFEWU 590944 | — | "Fits 21199/21200/20200 223cc. Fixed surging." |
| 2025-02-13 | Deck Restoration + Fluid Film | — | **$40.00** | "Rust protected" |
| 2025-02-13 | Fuel Shut-Off Valve Installed | — | **$16.00** | "Easy storage" |
| 2025-02-13 | Oil Change (SAE 10W-30) | — | **$9.00** | "Clean oil" |
| 2025-02-13 | Spark Plug Replaced | Champion RJ19LM | **$3.99** | "Smooth idle" |
| 2025-02-13 | Spark Plug Boot Replaced | 399781 | **$6.99** | "Strong spark" |
| 2025-02-13 | Ignition Coil Replaced | 130-0720 | **$18.97** | "No misfire" |
| 2025-02-13 | Fuel Filter Replaced | 691035 | **$6.97** | "Clean fuel" |
| 2025-02-13 | Air Filter Replaced | 593260 | **$7.98** | "Fresh air flow" |
| 2025-02-12 | Pull Cord Replaced | 590750 (WOTIAN 796497) | **$12.00** | "Starts easy" |
| 2025-02-11 | Front Wheel Adjuster Replaced | 131-9668 | **$12.00** | "Smooth adjust" |
| 2025-02-11 | Rear Deck Adjuster Replaced | 131-9667 | **$16.00** | "HOC accurate" |
| 2025-02-11 | Cables Replaced (Drive & BBC) | 121-9181 / 121-9182 | **$38.00** | "Controls crisp" |
| 2025-02-11 | Transmission Assembly Replaced | 130-9667 | **$162.00** | "No slipping" |
| 2025-02-11 | Transmission Drive Belt Replaced | 120-9470 | **$14.47** | "Strong traction" |
| 2025-02-10 | Blade Drive Belt Replaced | 121-5765 | **$18.97** | "Engages solid" |
| 2025-02-10 | Blade Pulleys Replaced (x2) | 120-5236 | **$40.00** | "Quiet operation" |
| 2025-02-10 | Blade Spindles Replaced (x2) | 120-5238 | **$134.00** | "No vibration" |
| 2025-02-10 | Blades Replaced (x2) | 120-9500 | **$31.98** | "Clean cut" |
| 2025-02-10 | Wheels Replaced (Front & Rear) | 131-9665 / 131-9666 | **$60.00** | "Smooth rolling" |

Archivist arithmetic on the recorded rows (not stated anywhere in the app itself): the February 2025 rebuild campaign's priced line items total **≈ $649.32**; the May 2026 restoration's priced items add **$44.96**; with the one logged 2026 purchase (below) the recorded parts spend on the mower through 06-21 is **≈ $726.13** — excluding paint, sensor electronics, battery, and anything never logged.

Note the timeline correction embedded here: the big belts/blades/spindles/transmission campaign the zip dated "2023-01-01" is here documented day-by-day across **2025-02-10 → 2025-02-13**, with receipts. Also new: the mower's carburetor was replaced 2025-05-27 with an aftermarket **HUFEWU 590944** kit ("Fixed surging"), and the May 2026 restoration started with the hour meter at 0.0 (the zip's "1.1 hrs / newly installed" reading of 2026-05-13 is consistent — 1.1 hours accumulated in the four days after the 05-09 oil change).

The HISTORY tab also gained a **"💰 Spending Tracker • Going Forward"** card — total spent, purchase count, per-year bars, and a "🛒 Log a Purchase" modal ("Part / Accessory", "💰 Price You Paid", date, note). One purchase is baked into `DEFAULT_STATE`: **"New Mulching Gator Blades" — $31.85 — 2026-05-31**.

#### 3.10 Jeff's usage during the gap, frozen in `DEFAULT_STATE`

`DEFAULT_STATE` (the state a fresh browser gets) is a snapshot of Jeff's real data at export time: `hours: 5.4`, `miles: 4`, and a 7-entry log all dated **2026-05-31 at 3.5 hrs**: Cable Inspection, Clear Coat Entire Mower, New Mulching Gator Blades, Battery Charge, Post-Mow Cleanup, Pre-Mow Safety Check (each "Service completed", "+5%"), and **"Mow #3 — Full yard · 1.0 hr · 4.0 mi"** with the walking miles logged. Together with the fixed history (Mow #1 on 05-14, Mow #2 on 05-20 — the same day he uploaded the zip), this documents that Jeff was actively mowing and logging all through the gap: 0.0 hrs on 05-09 → 1.1 on 05-13 → 3.5 on 05-31 → 5.4 by sensor-install day.

A second hour-reading fossil: the static HTML hardcodes **"2.5"** in the header and main meter (and "Total Mows 2"), while `DEFAULT_STATE` and `MOWER_BASELINE` say **5.4**. JS overwrites the static values at render, so users never saw the mismatch. **INFERRED:** the static HTML was generated at an earlier point in the cloud era (when the meter read 2.5, after Mow #2) and never regenerated as the state moved on — two different moments of the lost month frozen in one file.

#### 3.11 The 18 service rules and the health model

The zip's 7 schedule entries became 18 `RULES`, each with an interval and a curated YouTube search: Blade Sharpening /25h, Oil Change /50h, Air Filter /50h, Deck Coating /50h, Spark Plug /100h, Blade Drive Belt /200h, Fuel Filter /100h, Transmission Belt /100h, Carburetor Clean /100h, Wheel Bearing Check /50h, Cable Inspection /25h, Pre-Mow Safety Check /1h, Battery Charge /25h, Ignition Coil Gap Check /100h, Air Filter Replace /200h, Storage Prep / Fuel Drain /200h, Post-Mow Cleanup /1h, **Clear Coat Entire Mower /12h**. Status thresholds: OVERDUE at 0 remaining, DUE SOON within 30% of the interval. A "Service Countdown" panel shows progress bars "so every hour visibly moves a bar" (code comment). Logging a service resets its countdown and toasts '✓ Logged — "X" countdown reset to N hrs'; custom-titled services are keyword-matched to rules (`matchRuleFromText`).

`calcHealth()` derives six subsystem scores — ENGINE, DECK, BLADES, DRIVE computed from service status (floor 50), ELECTRICAL and FUEL **pinned at 98** — and an overall that the header displays (99% at export). The zip's user-slider condition scores were dropped; condition became computed.

#### 3.12 The 38-entry parts catalog with prices

The zip's 16-part status list became a 38-entry `PARTS` catalog, each with OEM part number and price range, an aftermarket alternative and its price range, and six outbound buttons (Amazon, Home Depot, Toro.com, eBay, Walmart, ▶ Video), plus an add-to-cart flow (cart FAB, "Shop All on Amazon" combined search, plain-text list export). Highlights with prices as recorded: Blade Drive Belt Toro 121-5765 $17–$35 (Stens 265-208 $12–$22) · Blade Set 120-9500/116-6358 $33–$55 (Oregon 91-631 $20–$32) · Spark Plug RJ19LM $3–$7 · Air Filter Briggs 593260 $8–$15 · 5W-30 Full-Syn oil $10–$18 · Ignition Coil 139-0720 $28–$55 (aftermarket $15–$28) · Fuel Filter 691035 $6–$12 · **Transmission Assembly 130-9667 $150–$180** (reman $90–$130) · Spindle 120-5238 $55–$70 · Carb HUFEWU 590944 $15–$28 · Pulleys 120-5236 $18–$28 · Trans belt 120-9470 $12–$20 · Front/Rear wheels 131-9665/9666 $22–$35/$28–$40 · BBC & Drive cables 121-9181/9182 $18–$28 each · **ML3-12 battery $18–$30** · Battery charger "Toro OEM (owned)" (alt: Battery Tender Jr $25–$35) · WOTIAN 796497 recoil $18–$30 · 40A fuse $3–$8 ("Spare on Hand") · spare ignition key $8–$15 · Loctite Blue 242 $7–$12 · Loctite Red 271 $8–$14 · locking-washer assortment $8–$15 · **Helicoil M6x1.0 kit (5521-6) $18–$30 · Helicoil M8x1.25 kit (5521-8) $18–$30 · bolt extractor set $20–$40** · M6/M8 grade-8.8 bolt assortments $5–$12 · Rust-Oleum 302110 clear $8–$14 · Fluid Film $12–$18 · silicone spray $6–$10 · deck height adjusters $12–$20 · pull cord $10–$20 · governor spring Briggs 691859 $5–$12 · valve cover gasket 690970 $6–$14 · head gasket 692236 $8–$18 · "TimeMaster Manual (Free PDF)".

The Helicoil/extractor/threadlocker cluster pairs with three new DIAGNOSTICS entries (below) — **INFERRED:** at some point during the rebuild or the gap, Jeff stripped or broke bolts and the fix became institutional knowledge.

#### 3.13 The 13-entry diagnostics table

The zip's freeform issues list became 13 curated symptom→fix entries, each with a video button (all advice verbatim in the code): Hard Starting ("Check spark plug gap (0.030\"). Ignition coil gap must be 0.010\"… Coil replaced May 2026."), Surging / Rough Idle ("HUFEWU 590944 carb installed May 2025…"), Poor Cut Quality ("…Blade bolt torque: 60 ft-lb."), Excessive Vibration (spindles 120-5238), Uneven Cut / Scalping ("Deck should be 1/8\" lower in front…"), Leaking Oil ("Check drain plug torque (150 in-lb)… No oil filter on this model."), Engine Knocking, Overheating, Self-Propel Not Working (cable 121-9182, belt 120-9470, wheel pawls), No Spark / Won't Start (coil 139-0720, gap 0.010"), **Stripped Engine Bolt** ("B&S engine bolts: M6x1.0 thread. Use Helicoil 5521-6…"), **Stripped Frame/Deck Bolt** ("Toro deck bolts: M8x1.25. Muffler bolts: M8x1.25. Use Helicoil 5521-8… Use Loctite Blue 242."), **Broken Bolt Extraction** ("left-handed drill bits… Irwin Bolt Grip extractor… then Helicoil").

#### 3.14 Upgrades, specs, and the electric-start reveal

**UPGRADES tab (21 entries):** hour-triggered recommendations (Bluetooth Hour Meter "RECOMMENDED NOW" $25–$45, High-Lift Blade Kit at 25h $35–$60, Mulching Kit at 10h $28–$45 — and indeed Gator mulching blades were bought 05-31, Deck Wash Port at 5h, LED Light Kit at 15h, STA-BIL at 40h, Heavy Duty Air Filter at 50h, Magnetic Blade Balancer at 20h, Synthetic Gear Oil at 100h) plus the 12 items tagged ✓ INSTALLED (fuel shut-off valve and the entire sensor package, §3.2).

**SPECS tab:** the full specification list reveals hardware the zip never mentioned — **"Start System: Electric Start + Recoil Backup (WOTIAN 796497)"** and **"Battery: Mighty Max ML3-12 • 12V 3AH SLA AGM • F1 Terminal • Installed May 7, 2026"** — plus Smart Controller ESP32-C3/ESP-WROOM-32, GPS GY-NEO6MV2, MPU6050, LM2596 sensor power, 40A plug-in fuse ("spare on hand"), height of cut 1.25"–4.25" (7 positions), oil "Full Synthetic 5W-30" (upgraded from the zip's "SAE 30 or 10W-30"), blade bolt "60 ft-lb (82 N·m)", plug gap "0.030\" (0.76mm)", coil gap "0.010\" (0.25mm)", "Restoration Date: May 9–13, 2026", "Hour Meter Start: 0.0 hrs at restoration". A "📄 Next Likely Future Items" card ranks the anticipated failures: 1 Engine Governor Spring, 2 Carburetor (installed 2025 ✓), 3 Recoil Starter (installed ✓), 4 Blade Brake (BBC) Cable, 5 Wheel Gear Pawls, 6 Valve Cover Gasket, 7 Head Gasket (Long Term).

**Data Backup & Restore:** export the full state as JSON (`toro21200-backup-YYYY-MM-DD.json`) via the iOS share sheet ("choose Save to Files") with download fallback; import with a REPLACE-all confirm. Card copy: "Your logs, hours, and miles are saved on this device only. Export a backup file to keep them safe or move to a new phone." (These backups later mattered: the 06-23 session restored Jeff's real hours "from 2026-06-22 backup" per CLAUDE.md.) Service logs support **photo attachments**, auto-shrunk to ≤900 px JPEG at 0.7 quality "so localStorage doesn't overflow", with a storage-full toast: "⚠ Storage full — export a backup & delete some photos". Log entries are editable and deletable (deleting a mow subtracts its miles).

#### 3.15 The layered CSS — archaeology of multiple polish sessions

The stylesheet of `0b76d4c` is not one design; it is **four designs stacked**, each appended below the last with its own banner comment, all preserved verbatim:

1. The base dark design.
2. `/* AUDIT PASS: readability only — no layout changes */`
3. `/* SMART TIMEMASTER DIGITAL TWIN VISUAL PASS — SAFE CSS ONLY */` (brighter red `#ff1f1f`, glass cards, glow shadows)
4. `/* COLOR-CODING + READABILITY PASS (final layer — wins cascade) */` — a 12-family accent system documented in the comment itself: "sensor/telemetry=cyan · status/alerts=red · health/fitness=green · service/cost=amber · weather=sky · gps=teal · parts=orange · upgrades=violet · history/activity=gold · specs=slate", with a color legend rendered on the dashboard.
5. `/* TYPOGRAPHY + DECLUTTER PASS (final layer — one font, clean flow) */` — "single family everywhere (redefine --font AND --mono = Archivo)… calm the noise: drop stacked glows, top stripes, busy shadows".

Two layers both call themselves "final layer." **INFERRED:** each pass is the residue of a separate cloud session's visual review with Jeff; nothing was ever refactored together because no session could see the whole history. The stacked-`!important` cascade this created is exactly the kind of fragility that broke modals during the 06-23 "big fix" session (per CLAUDE.md: CSS classes renamed in one layer but not another).

#### 3.16 Reconstructed timeline of the lost month

**INFERRED except where a date is written in the code itself:**

| Date | Event | Evidence class |
|---|---|---|
| 2026-05-07 | Mighty Max ML3-12 battery installed (electric start) | in-app spec text |
| 2026-05-09 → 05-13 | Full restoration; hour meter starts at 0.0; ignition finished 05-13 at 1.1 hrs | in-app history + zip data |
| 2026-05-14 | Mow #1, "Engine smooth." | in-app history |
| 2026-05-19 22:30 | Zip files written — snapshot of the original 6-tab app | file timestamps |
| 2026-05-20 08:35 | Jeff uploads the zip to GitHub `main` ("Add files via upload") | commit `09f02d4` |
| 2026-05-20 | Mow #2 (same day as the upload) | in-app history |
| between 05-20 and 05-31 | Complete rewrite to the dark 7-tab "live app"; hour tracking, mow/service logging live (static HTML frozen at 2.5 hrs) | fossil analysis |
| 2026-05-31 | Mow #3 (1.0 hr, 4.0 mi walked) + 6 services logged at 3.5 hrs; Gator mulching blades bought, $31.85 | `DEFAULT_STATE` |
| 2026-06-06 | "Smart TimeMaster Digital Twin" sensor package documented & direction "locked"; weather station KTNWHITE21 linked | in-app dated history rows |
| by 06-21 | Sensor installed with dashboard reading 5.4 hrs (`MOWER_BASELINE=5.4`); B-Hyve, burn card, readiness engine, spending tracker, backup/restore all built; a Cloudflare Pages deployment serving `/api/*` exists outside git | code comments + fossil analysis |
| 2026-06-21 17:14 | First Claude Code session (`session_01WuKnDJrDp2n6fHjhtahmLe`, Claude Sonnet 4.6) extracts the zip into the repo as "the starting point for the Home Command Center build" | commit `0e7e18d` |
| 2026-06-21 20:31 | The complete cloud-era app is committed over it | commit `0b76d4c` |

The ordering of feature construction within the gap (weather before B-Hyve? fitness before GPS?) is **unknown — the record is silent.**

#### 3.17 On the name "Master the Master"

The GitHub repo is `d4c2np9f69-afk/master-the-master-` (recorded in CLAUDE.md `90e556e`; the local checkout directory is `Master-the-Master-`). The phrase appears in-app only in the 06-21 footer ("KEEP IT CLEAN. KEEP IT SHARP. MASTER THE MASTER.") — the zip's footer said "MAINTAINED TO WIN." **INFERRED:** the slogan was coined during the cloud era (the repo, created 05-20 for the upload, already bears the name, suggesting the phrase existed by upload day even though the surviving zip predates its appearance in any app copy). The record is silent on who coined it — Jeff or Claude.

---

### 4. The birth of the Home Command Center (commit `eb342db`, 2026-06-21 20:39 UTC)

Eight minutes after committing the live app, the same session executed the pivot that renamed the whole project. Commit message in full:

> Transform Toro app into Home Command Center (HCC)
>
> Adds top-level 4-section navigation (YARD / SECURITY / HOME / SAFETY)
> over the existing app. YARD section wraps all existing Toro/B-Hyve/
> weather tabs untouched. Security adds Blink camera placeholder tiles
> and arm/disarm UI. Home lists all planned ESP32 modules with install
> guide for Home Assistant on Docker. Safety has the panic button,
> Apple Watch fall-detection status, and the life-safety callout.
> All JS section switching and panic handler wired.

**INFERRED:** the decision to expand from mower app to whole-home command center was made in conversation with Jeff during or just before this session; no transcript survives, but the amount of concrete household detail in the placeholder copy (his PC, his fiber, his cameras, Angela's watch) shows the plan was Jeff's, articulated to Claude, not invented by the code.

What the commit actually did:

- **Rebranding:** `<title>` → "Home Command Center"; Apple home-screen name → **"Home CMD"**; `application-name` → "Home Command Center"; theme color → dark navy `#0a0a14`; the red TORO header badge became a blue **HCC** badge; header title → "HOME COMMAND CENTER" with tagline **"MANAGE • MAINTAIN • MONITOR"**. (Fossil: the base64-inlined manifest still said "Toro TimeMaster 21200" — manifest branding wasn't fixed until `4f96d09` on 2026-06-23, so for two days the installed-PWA name disagreed with the page.)
- **The original 4-section concept**, a new top-level switcher above the old tabs: **🌿 YARD · 📷 SECURITY · 🏠 HOME · 🛡️ SAFETY**. The entire existing Toro app — all 7 tabs, sensor card, weather, irrigation, fitness — became the content of the YARD section, untouched.

**SECURITY section** (all placeholder, verbatim copy preserved): a "🔒 System Status" card — "Blink integration — coming next session. Home Assistant will connect your cameras automatically once the brain is set up on your PC." — with ARM ALL / DISARM ALL buttons rendered but disabled (opacity .4, `cursor:default`). Camera tiles: **Front Door**, **Back Yard**, **Garage**, each "NOT CONNECTED", plus an "Add Camera / TAP TO ADD" tile. Modules list: **Blink Camera Integration** [NEXT] ("Arm/disarm, live snapshots, motion events via Home Assistant"), **Gas & Smoke Sensors** [FUTURE] ("ESP32 sensors — early warning + certified backup units"), **Garage Door** [FUTURE] ("Open/close status + remote control via ESP32"). This is the first appearance of **Blink cameras** in the record — the integration that would consume enormous effort in later weeks (the 2FA fix installer `b86a37e` etc. belongs to a later section).

**HOME section:** six ESP32 device tiles, all "ESP32 — FUTURE": **Energy Monitor, Water Monitor, Thermostat, Lighting, Grill Controller, Garage Door** — the original wishlist from which the later CLIMATE/LUX thermostat, Kasa lighting, and SmartHub energy work all descend. Below it, "BRAIN STATUS":

> 🧠 Home Assistant — Not Set Up Yet
> Your PC (always-on, gigabit fiber) will run Home Assistant in Docker. Once installed, all ESP32 devices connect automatically via ESPHome. Alexa integration is built in.
>
> Install steps when ready: 1. Install Docker Desktop on your PC · 2. Run Home Assistant container · 3. Open HA on port 8123 · 4. Add Blink & ESPHome integrations

This is the first written record of the "brain" concept — Home Assistant on Jeff's always-on PC. (Within days the plan changed to a dedicated device named "Beehive," and the PC became "the beast" — later sections cover that; note that the Docker-on-PC plan recorded here was one of the re-litigated decisions.) Also first mentions of **Alexa** and **ESPHome** in the record, and the first written description of Jeff's infrastructure: an always-on PC with **gigabit fiber**.

**SAFETY section:** a full-width red **PANIC / EMERGENCY** button ("Tap to alert household"), whose handler is honest about being a stub — the confirm dialog reads, verbatim:

> EMERGENCY ALERT
>
> This will (once fully wired):
> • Flash smart lights
> • Send push notification to Jeff & Angela
> • Log event with timestamp
>
> Proceed?

…followed by `alert('⚠️ Panic logged at [time] — Full automation coming once Home Assistant is set up.')`. The modules list: **Apple Watch — Fall Detection** [LIVE] ("Already ON — calls 911 + contacts automatically. Keep this enabled."), **Apple Watch Panic Shortcut** [NEXT] ("Shortcut button on Angela's & Jeff's watches → alerts + siren"), **Gas & Smoke Detectors** [FUTURE] ("ESP32 sensors for trend monitoring. Keep UL-listed detectors as primary."). And the life-safety callout, verbatim:

> ⚠️ Life-Safety Note
> Apple Watch Fall Detection + Emergency SOS are your primary life-safety net — they call 911 automatically. This app adds convenience layers on top, never replaces certified safety systems.

This section is the record's first mention of **Angela** (**INFERRED:** Jeff's wife — the copy pairs "Angela's & Jeff's watches" and "Jeff & Angela" as the household). It also documents a safety-engineering posture — DIY sensors as convenience layers, certified UL-listed devices as primary — that was present from HCC's first hour.

---

### 5. The hero image (commit `6649269`, 2026-06-21 20:47 UTC)

The last commit of the era, eight minutes later. Message in full:

> Embed HCC hero image in app header
>
> Adds the Home Command Center hero photo (brick ranch at dusk) as a
> 190px full-width banner between the header and the section nav.
> Image is base64-embedded so the PWA is fully self-contained with no
> external dependencies. Gradient overlay + tagline text layered on top.

The diff adds an 11-line block: a 190 px banner with the base64-embedded photo of the house — **a brick ranch at dusk**, per the commit message; the first appearance of Jeff's actual house in the app — with a bottom gradient and two text layers, verbatim:

> MANAGE • MAINTAIN • MONITOR
> *Everything. In One Place.*

("Everything. In One Place." — in warm gold italic — became the HCC's enduring tagline.) The base64 embedding decision ("fully self-contained with no external dependencies") had a cost recorded two days later: the page ballooned to 2.1 MB and had to be slimmed by extracting the hero photos again (`739d004`, 2026-06-23, "Extract hero photos from HTML — drop from 2.1MB to 295KB") — an early example of a cloud-era-style decision being reversed once real-device performance was measurable.

---

### 6. State of the world at the close of 2026-06-21, and what this era cost

At the end of day 33, the repo tree on `claude/time-master-project-liq1jw` contained exactly: `Toro_TimeMaster_PWA_Package.zip`, `icons/icon-192.png`, `icons/icon-512.png`, `index.html` (the HCC app), `manifest.json` (still the zip's Toro manifest), and `service-worker.js` (still the zip's `toro-timemaster-v1` cache-first worker) — verified via `git ls-tree -r 6649269`. No functions, no CLAUDE.md, no docs, no deploy pipeline in git. The next morning (2026-06-22, commits `46be882` onward) began the Beehive/Home-Assistant era, which belongs to the next section.

**What the gap cost — the honest accounting.** The direct evidence of damage from the undocumented month is in what the next 72 hours had to do: rebuild the four `/api` endpoints inside the repo because the cloud-era backend wasn't in version control (`c8e729c` "Fix all 4 broken API endpoints"); fix the sensor panel rows that had never existed in the DOM (`4c52e85`); restore Jeff's real hour count from a backup file (`53eb7d4` "Restore Jeff's real hours — update default state and sensor baseline to 5.9h"); and untangle the stacked CSS layers whose renamed classes had silently broken every modal (`e904a5b`, `da1320c`). And it is in Jeff's own words, recorded verbatim into the first full CLAUDE.md (`90e556e`, 2026-06-24) — written three days after this era closed, about exactly the working pattern this era exemplified:

> "You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct. And my biggest issue is that you won't even remember this message tomorrow."

> "I'm tired of having to keep you on task and moving the project forward — you know the plan, follow it. Save this and remember it and read it before you do anything."

> "I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learning… but you are making it real hard for this to be enjoyable."

The lost month also produced genuinely remarkable output — a digital twin of a nine-year-old lawn mower with GPS, RPM, vibration, and battery telemetry; a hyperlocal weather and irrigation brain; a receipt-level restoration ledger — built by a man who is "almost 60 and learning," in collaboration with sessions that each woke up amnesiac. The whole subsequent architecture of this project — CLAUDE.md as mandatory memory, git as the single source of truth, "test before you say done" — exists because of what happened, and what was lost, between 2026-05-20 and 2026-06-21.

*End of section. The next section picks up at commit `46be882` (2026-06-22): the Beehive setup scripts and the Home Assistant era.*
