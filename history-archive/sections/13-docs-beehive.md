## The Beehive Papers — every doc under docs/beehive and the top-level references

"Beehive" is Jeff's name for the Home Assistant instance that became the house's brain — first run precariously off a flaky external USB drive, then (2026-07-02) migrated onto the internal drive of a dedicated **Beelink J45 (Gemini) mini-PC** (Intel Pentium J4205, ~8GB RAM, ~128GB storage, 4× USB 3.0). The `docs/beehive/` folder is the operating manual, decision log, and scar-tissue record for everything Home-Assistant-side: the OS install, the meter radios, the camera AI pipeline, the Apple TV popups, the Alexa cleanup, the garage door, the Zigbee alarm plan, and the panic button. Two top-level files — `docs/BEEHIVE_REFERENCE.md` and `docs/UTILITIES_REFERENCE.md` — are verbatim extractions of the corresponding CLAUDE.md sections, moved out on 2026-08-16 07:46 when CLAUDE.md was slimmed from 260KB to 58KB (commit `fab5b30`, 2026-08-16, "Restructure CLAUDE.md 260KB -> 58KB; all six cameras to confidence 25").

Recurring cast, so the docs below make sense:

- **Beehive** — Home Assistant OS on the J45. Local URLs `http://homeassistant.local:8123` / `http://192.168.1.66:8123`; remote via Nabu Casa `https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa`.
- **The beast** — Jeff's main Windows PC at `192.168.1.194` with a GTX 1050 Ti; runs CodeProject.AI for camera object detection.
- **Clyde / "the coworker"** — the local Claude Code session running on the beast, which (unlike the cloud session) has real LAN access to Beehive. The cloud session writes exact instructions; Clyde or Jeff executes them.
- The `docs/beehive` PDF (`Alexa_Command_Card.pdf`) is the print twin of `alexa_command_card.html`; the HTML was read as the source of record here.

All 19 files under `docs/beehive/` (18 readable + the PDF twin) plus both top-level references are covered below, each with its git provenance.

---

### Foundation: the J45, the meters, and the helper layer

#### `docs/beehive/HA_OS_setup_J45.md` — the OS migration walkthrough (SUPERSEDED — completed 2026-07-02)

Added in commit `9a9da77` (2026-07-01, "Beehive: confirm J45 dedicated + add HA OS install guide; note working model"), progress-stamped in `98b9fd9` (2026-07-01, "docs: J45 progress — backup done, Ubuntu 26.04 boot stick made").

What it records: the complete, hand-holding, step-by-step plan to get HA OS off the flaky external USB drive and onto the J45's internal ~128GB drive — written deliberately slow-paced ("Budget ~45–60 min. Go slow; every step is simple. Stuck on one → screenshot it, send it."). Key facts and decisions preserved in it:

- The J45 was a **drawer-era Windows 10 machine**; the doc explicitly authorizes wiping it ("nothing on it matters").
- **Step 0 backup first** — HA backup named `before-reinstall`, downloaded off-box before anything else.
- The stuck point that cost real time: the boot stick's "stuck protected partition," fixed via `diskpart clean` before Rufus would work. Boot stick ended up 16GB, **Ubuntu 26.04 desktop**.
- Single-stick path: download the HA OS `.img.xz` + Balena Etcher *inside* the live Ubuntu session (ethernet), so one stick suffices.
- Safety property called out explicitly: "the external HA drive is never touched, so an interrupted install can't leave Jeff worse than he is now."
- Beelink boot-menu key is usually **F7** (sometimes DEL/ESC/F12); Secure Boot may need to be turned off; internal target is usually `/dev/mmcblk0`.
- The stated payoff: "That 'it just comes back' reliability is the whole point of doing this," and freeing **both USB ports** for the RTL-SDR.
- Closing sequencing rule: "**Then, and only then:** RTL-SDR in → rtl_433 add-on → gas meter reads → water meter → Water/Gas cards in the HCC app. Foundation first."

Status: **historical/completed.** The migration finished 2026-07-02 (commit `f39b125`, "docs: J45 migrated to internal drive + RTL-SDR meter setup guide (no drivers)"); BEEHIVE_REFERENCE confirms "running HA OS off its **internal SSD** (migrated off a flaky external USB drive 2026-07-02 — external is retired, don't reintroduce it)." A future session should never suggest the external drive again. Note the doc's "2 USB ports" framing was later corrected — Jeff confirmed 08-05 the J45 has **4× USB 3.0 ports** (BEEHIVE_REFERENCE).

#### `docs/beehive/rtl_sdr_meter_setup.md` — water + gas meters over radio (CURRENT for facts; setup complete)

Created `f39b125` (2026-07-02), updated same day with live results (`0f94198` "water + gas meters LIVE via rtlamr2mqtt (confirmed IDs + protocols)", `86c1990` "confirm meter calibration vs physical dials (water /10 gal, gas /100 ccf)"), entity-name fix `a101465` (2026-07-03, "correct meter entity ids to *_reading").

What it records — the load-bearing meter facts a future session must not re-derive:

- **Water meter:** Itron `100WD` MIU, ERT-SCM, endpoint/ERT ID **`79453337`**, **unencrypted**; protocol is **`scm+`** — "NOT plain scm — that's the key." Raw reading `129105` at go-live.
- **Gas meter:** Itron 100G ERT, ID **`33393066`**, protocol **`scm`** ("barcode on the Itron 100G matched exactly"), raw `883384`. Physical meter is an Elster AC-250.
- **Calibration, verified against the physical dials 2026-07-02:** water raw **÷ 10 = gallons** (raw `129105` → 12,910.5 gal vs LCD 12,914.94 — gap explained by usage between reads and 0.1-gal SDR resolution vs 0.01 LCD); gas raw **÷ 100 = CCF** (8,833.84 vs dials ~8833). "1 CCF ≈ 1.037 therm for Piedmont $."
- The **working rtlamr2mqtt config** is pasted in full (sleep 60s, both meters, listen_mode off). Discovery tip preserved: `listen_mode: true` + `meters: []` logs every neighborhood meter — "That's how we found the protocols/IDs." Reception "excellent (SDR hears ~20 neighborhood meters). rtlamr center 912.6 MHz."
- **Entity-name trap (fixed 07-03):** rtlamr2mqtt creates both `sensor.water_meter_reading` and `sensor.water_meter_last_seen`. "⚠️ Read the `_reading` entity, NOT `_last_seen` — a timestamp parseFloats to 2026 and showed 202.6 gal (fixed 07-03 in `meterRaw`: skip `*_seen`/timestamp entities, require a pure number)." This was a real shipped bug.
- **Driver rule, in bold:** "Do NOT download Zadig / SDR# / WinUSB." Those are Windows-only; the add-on ships the Linux driver, "Nothing to install, nothing to download."
- Sequencing: install Mosquitto broker first (add-on store, start-on-boot + watchdog, MQTT user), then rtlamr2mqtt from repo `https://github.com/allangood/rtlamr2mqtt`.
- Gotchas: Kamstrup-side timestamps are **European** — convert to `America/Chicago`; meters are cumulative odometers, so today/month/flow come from HA utility_meter/derivative helpers; "the water gallons here feed the City-of-White-House sewer-overpayment numbers."
- Fallback decoder if rtlamr2mqtt fails: rtl_433 (`-R 149` SCM, `-R 151` SCM+).

Status: **live and current** — the IDs, protocols, and calibration divisors are permanent facts. The "STILL TO DO (app polish)" list (app-side ÷10/÷100, helpers, `UTIL_ENTITIES`) was subsequently completed (see `ha_helpers_and_alexa.md` and UTILITIES_REFERENCE below).

#### `docs/beehive/ha_helpers_and_alexa.md` — helper recipes + first Alexa hookup (PARTIALLY SUPERSEDED)

Created `e1d29b0` (2026-07-03, "Utilities helper tiles + HA helpers/Alexa/weather guide"), fixed same day (`338e2c3` timestamp-sensor fix; `0b3de03` "Weather guide: HA has no built-in WU integration; use REST sensor on our /api/weather").

What it records: click-by-click HA instructions Jeff followed on his phone, with a hard rule up front — the HCC app reads these helpers **by exact name**: "**name them EXACTLY as written** and the app's tiles light up on the next refresh."

- **PART 1 — unit conversion templates:** `Water Gallons` (`sensor.water_gallons`, raw ÷10, device class Water, state class Total increasing) and `Gas CCF` (`sensor.gas_ccf`, raw ÷100).
- **PART 2 — Utility Meter helpers:** `Water Month` / `Gas Month` (monthly reset; the app reads `sensor.water_month` / `sensor.gas_month`).
- **PART 3 — Derivative helper:** `Water Flow` (`sensor.water_flow`), input `sensor.water_gallons`, **5-minute time window**, unit minutes. This 5-minute smoothing window later mattered: UTILITIES_REFERENCE records the 07-31 "0.2 gpm with nothing running" investigation concluding **NOT a bug** — a toilet flush averaged over the window, "Working as documented."
- **PART 4 — `Gas Cost` template** using a Piedmont $/CCF placeholder of **$1.05** ("replace `1.05` with your real number"; the validated all-in rate later became $1.235/therm — see UTILITIES_REFERENCE). Optional `Water Cost` "feeds the sewer-refund case."
- **PART 6 — Alexa:** (A) Nabu Casa cloud → Alexa skill → **Expose** tab, with the advice "Start small — a few lights + the thermostat" (advice that was NOT followed — the exposure list bloated to 67 entities and had to be cleaned up 08-14, below); (B) announcements via either Alexa Routines with virtual toggle flags (`Alexa Panic Flag` pattern — "rock-solid, best for a few fixed alerts") or the HACS Alexa Media Player integration ("occasionally needs a re-login, so use B1 for the critical panic alert").
- **PART 7 — the weather-station fix:** Jeff's complaint that Alexa's weather is "never right" is explained — Amazon uses its own regional provider and "That built-in answer can't be replaced (Amazon owns it)." The fix: a REST sensor pointed at the project's own `https://toro1-5rz.pages.dev/api/weather` (Jeff's real **KTNWHITE21** station with Open-Meteo backup), creating `sensor.backyard_temperature` / `_feels_like` / `_humidity` / `_wind`, exposed to Alexa so "Alexa, what's the backyard temperature?" reads the real value. Important negative finding preserved: "current HA has **no built-in Weather Underground integration** (removed years ago when WU locked down their API — it won't appear in Add Integration)." A WU API key is recorded in the doc as an alternative HACS path: `0e87ee079c0147a787ee079c01d7a75d`, station `KTNWHITE21`.

Status: helpers built and live (the Water Flow helper is cross-referenced as real in UTILITIES_REFERENCE). The Alexa Part 6A guidance is **superseded in spirit** by the 08-14 exposure-cleanup discipline; the Backyard sensors survived the cleanup and are on the 08-15 command card and in HomeKit.

---

### The camera / AI / TV-popup chain

#### `docs/beehive/camera-ai-setup.md` — the original CodeProject.AI plan (SUPERSEDED as procedure; architecture stands)

Created `4cd8184` (2026-07-10, "Docs: staged CodeProject.AI smart-camera detection setup for the beast (Clyde-ready)"), notify target confirmed same day (`65e029b`, "use confirmed notify target notify.mobile_app_jeffs_iphone").

What it records: the staged plan that became the camera AI pipeline. "Goal: turn Blink 'motion' alerts into **'Person / Car / Animal at [camera]'** using local AI on the beast's **GTX 1050 Ti**. No Blink fee, no cloud." Architecture: Blink motion → Beehive grabs a snapshot → CodeProject.AI on the beast (`192.168.1.194:32168`, GPU) → HA smart notification. "Beehive stays light; the beast does the AI."

- Process rule embedded in the doc: "Do this in STAGES and verify each one before the next (**Jeff hates big-bangs that break**)."
- Stage 1: install CodeProject.AI on Windows, enable Object Detection (YOLO) in GPU/CUDA mode, verify with `nvidia-smi`; fallback to an older YOLO module or CPU if the Pascal card is refused. Stage 2: open TCP 32168 in Windows Firewall, `curl .../v1/status/ping`. Stage 3: HACS `codeproject_ai_object` `image_processing` platform, `scan_interval: 604800` ("effectively 'never auto-scan'; we scan on demand"), targets person/car/truck/dog/cat. Stage 4: the per-camera automation — `blink.trigger_camera` → 7s delay ("Blink upload lag") → `image_processing.scan` → templated notify. Stage 5: expand to Driveway, Front Right, Back Left, Backyard, Garage.
- Honest caveats preserved: default YOLO **doesn't know "package"** (community package model or LLM Vision later); "**Battery:** … don't add aggressive periodic scanning (drains camera batteries)"; config keys version-dependent — "Clyde: verify against its README and adjust; don't assume."
- Division of labor: Clyde + Jeff do the HA/beast stages ("Clyde treats app code as READ-ONLY"); the cloud session does app-side "last seen" surfacing.

Status: **the architecture shipped and is verified** (see `camera_pipeline_VERIFIED_2026-08-15.md`), but the doc's entity names were placeholders and its automation shape evolved substantially (mute helpers, cooldowns, annotated-image archive, template doorbell sensors). Use the 08-15 verification record, not this plan, for how the pipeline actually works today.

#### `docs/beehive/alert_fatigue_fix_2026-08-14.md` — the failure loop that killed the cameras (CURRENT, with one 08-15 correction)

Commit `eba1648` (2026-08-14, "Beehive: alert fatigue fix - garage motion off, new 5-min per-camera cooldown automation; root cause was Blink disarmed (silent total outage since 08-10)").

What it records — arguably the single most important behavioral finding in the folder. While chasing an Apple TV question, the session discovered "**the entire camera pipeline had been dead since Aug 10 11:16** — zero motion events across all six cameras for 48 h. Root cause was NOT a bug: **Jeff had the Blink system disarmed**, because the notifications never stop." The failure loop, verbatim:

> too many alerts -> Jeff disarms -> ALL camera automation silently stops -> no security at all

"A disarmed Blink produces no error anywhere. `alarm_control_panel.blink_loewen301` is the only place it shows." The doc flags surfacing that state in the app's Guardian section so "why did the popups stop?" is answerable at a glance.

Fixes applied 08-14:

1. **Garage motion detection turned OFF permanently** (`switch.garage_camera_motion_detection`). Jeff's verbatim words: **"I don't need motion in the garage at all"** — the camera is mains-powered so it ran constantly and "fired 6 times in 7 minutes while he was simply working in there."
2. **New automation `automation.hcc_ai_alert_cooldown`**: triggers on `codeproject_ai.object_detected`, waits 5 s (deliberate — lets the notify/popup automations finish their own mute check first, "avoids a race where the cooldown suppresses the very alert that caused it"), then, only if the camera isn't already muted, sets `input_datetime.hcc_ai_mute_<camera>` to now + 5 minutes. Design decision recorded: it "**Deliberately does NOT extend an existing mute**, so sustained activity yields **one alert every 5 minutes** rather than silence — a prowler still generates repeat alerts." It rides the existing mute plumbing (hcc.yaml lines 200 and 371 gate both phone notify and Fire TV popup).
3. Tuning knob: the single `timedelta(minutes=5)` in that automation.

Still open at writing: presence-based suppression ("the biggest remaining reduction, not yet built") and per-camera object rules ("driveway VEHICLE at 2 AM matters; back yard PERSON at 8 PM is Angela").

**Correction a future session must know:** `camera_pipeline_VERIFIED_2026-08-15.md` later found the **mute/cooldown system "had NEVER worked"** — two bugs (a `_clipframe` suffix in `camera_key` writing mutes to nonexistent helpers, and a string-truthiness bug) meant the mechanism this doc describes only actually functioned from 2026-08-15 16:30 onward. The 08-14 doc records the design; the 08-15 doc records the first time it really ran.

#### `docs/beehive/camera_pipeline_VERIFIED_2026-08-15.md` — the permanent verification record (CURRENT — the authority)

Commits `c5a6aab` (2026-08-15, "Camera pipeline verification record 2026-08-15 — measured, photographed, per-camera status") and `dea7e75` (2026-08-15, "Option B shipped: popups fire on confirmed AI detections via template doorbell sensors").

This doc was written *specifically for future sessions like this archive*: "**This is the permanent record.** Every claim below is backed by a timestamp from HA's own history API or a photograph of the physical Apple TV screen … **If a future session doubts whether this was ever set up and proven: it was, on this date, as follows.**" Evidence photos (Jeff appears in them, so they're kept **out of the public repo**) live at `iCloudDrive/HCC-Photos/camera-verification-2026-08-15/` — five named files including `annotated_person_94.7pct_doorbell.jpg`.

Measured performance (real events): motion → AI red-box file written **8 seconds** (5+ events, 4 cameras); motion → popup visible on the Apple TV **4.7–6 s** (3 events photographed); detection → phone push + Fire TV popup + cooldown + archive **≤1 second**; Blink cloud round-trip via `trigger_camera`, for contrast, **67 s**.

Per-camera status: 301 Front Doorbell and 301 Driveway fully live-verified and photographed; Front Right and Back Left live-verified (popup mechanism proven, not photographed); **301 Backyard is the one exception** — "chain configured identically, **PIR never fired on either walk** … Not a config fault — the sensor did not see Jeff's path twice. Fix = aim/sensitivity in the Blink app. Weakest WiFi too (−65 dBm)." Garage: "motion OFF by Jeff's choice … camera reports no temp/wifi — may be unplugged."

The four fixes of 2026-08-15, each a trap for future sessions:

1. **The self-inflicted feedback loop:** that morning's HomeKit image swap also repointed the `image_processing` sources, so "the AI scanned its own annotated output and detection went dead while every health check read green." The fix and standing rule: "scanners on `camera.*_clipframe` (clean input), HomeKit on `camera.ai_*` (annotated output). **This split is load-bearing — never point the scanners at `ai_*`.**"
2. **"Mute/cooldown system had NEVER worked"** — the two bugs above, fixed in `packages/hcc.yaml` and the cooldown automation. "First successful mute writes in the system's history: 16:30 (manual test, 5 min) and 16:37–38 (walk: back_left 30 min because someone home + back camera; front cameras 5 min) — the differentiated behavior working exactly as designed."
3. **Clip archive:** `blink.save_video` "had overwritten one fixed file per camera forever." Now every detection copies its clip to `/config/www/blink_archive/<cam>_<timestamp>.mp4` (+ manifest.txt), pruned to 7 days at 03:30 on Beehive, mirrored nightly at 04:00 to `D:\HCC-Clip-Archive` on the beast via `Pull-ClipArchive.ps1` (scheduled task). "First six clips — Jeff's verification walk — archived and mirrored the same minute."
4. **Watchdogs:** pipeline-stall watchdog (motion with no scan in 2 min → "names the sync-module/USB cause"), overnight water check (1 AM baseline → 5 AM alert over 3.5 gal — thresholds derived from the "flush=1.2 gal / ice=0.1 gal signature work"), spring valve reminder.

The verification method itself is a Jeff-mandated project standard: a **Razer Kiyo Pro** on the beast aimed at the Apple TV, capturing a frame every ~0.9 s with millisecond filenames, cross-referenced against HA history. "**Component checks (bridge loaded, config valid, camera serves an image) said 'healthy' through every one of the day's real failures. Only watching the far end of the pipeline caught them.** This rig is the project's regression test; **Jeff's rule.**"

Also recorded: the popup-lag decision — "**DECIDED AND SHIPPED same evening: Option B.** Popups now ride trigger-based template sensors (binary_sensor.ai_doorbell_*) fired by the AI detection event, so the annotated image exists BEFORE the ring and false motion never pops the TV." Jeff's verbatim reason: **"'What good is an old picture?' — Jeff**. Open items so the doc "never overclaims": backyard PIR aim, driveway road-mask, Blink app notifications off (Jeff's phone); optional back-camera popup photos; and a `pyhap` `SecuritySystemState value=0 invalid` warning on the Apple Home alarm tile ("unexpose the alarm from the HCC Home bridge if it misbehaves").

---

### The Apple TV / HomeKit arc (all 2026-08-14/15)

#### `docs/beehive/appletv_switchover_2026-08-14.md` — research + test plan (SUPERSEDED by the SOLVED doc, but full of do-not-repeat research)

Four commits on 2026-08-14: `c95457a` (research + HomeKit Bridge test rig), `0e9a2e4` (annotated-image requirement), `3fd9988` ("restore file paths mangled by shell quoting" — a small self-inflicted doc corruption, fixed), `05df625` (fixed-filename discovery).

Why: "Fire TV Stick is slow, needs constant cache clearing / app offloading, and freezes. Jeff wants his Apple TV 4K back as the living-room box. **Only 3 HDMI ports** (ARC/soundbar, the beast, Fire TV) so it is a straight SWAP — cannot run both." Clarified requirement: "NOT live video. A **single still image** of whatever triggered the motion is fine."

Dead ends researched and killed — do not re-litigate:

- **Jailbreak — DEAD, do not pursue.** The device is an "Apple TV 4K (gen 3), tvOS 18.6" = A15 chip; checkra1n/palera1n depend on the `checkm8` bootrom exploit which only reaches Apple TV HD and 4K gen 1. "And no PiPup-equivalent overlay app exists for tvOS anyway — a jailbreak would give a shell, not the feature."
- **Blink RTSP bridges — NOT WORTH IT.** `roger-/blinkbridge` (~30 s added latency, documented) and `femmeXFMR/blink-rtsp-mqtt-bridge` (5-minute refresh) both fake a stream by looping a still, "ON TOP of Blink's existing cloud delay, so popups would get SLOWER." Both hobby projects (16 commits/11 open issues; 4 stars/10 commits), both want the Blink password in a config file, one warns of server bans.
- **HomeKit snapshot route — PLAUSIBLE, being tested** — with the honest unknown stated: "**UNPROVEN:** whether tvOS renders its picture-in-picture popup for a snapshot-only camera … Nobody online answers this specifically. Must be tested."

Setup done 08-14: HomeKit Bridge entry `01M009BBVWASB0YGP61S7Z4XXF` ("HASS Bridge:21064"), **scoped deliberately narrow** to only `camera.301_driveway_clipframe` — "(Avoids an Alexa-style flood into the Home app.)"

The **annotated-image requirement**, flagged in caps mid-doc: "⚠️ ANNOTATED IMAGE REQUIREMENT (Jeff, 08-14) — READ BEFORE FINISHING. Jeff confirmed what he actually likes about the current popup: **it fires essentially at the same time as the trigger, and it shows a RED BOX around the detected object with the confidence %.**" The clipframe is the RAW frame fed *into* the AI — staging it for HomeKit would lose the box. Resolved same day via the Studio Code Server terminal: "the annotated file HAS a fixed name — `/config/www/ai_snapshots/codeproject_ai_object_<camera>_clipframe_latest.jpg`, overwritten on each detection … Verified by listing the folder and pulling back_left_clipframe_latest.jpg (467 KB, red box, 'person: 79.7%'). **No copy step needed.**"

Jeff's actual complaint, quoted so nobody "fixes" the wrong thing: "Jeff says the popup timing is already good — his complaint is RELIABILITY (**'half the time it doesn't come through'**), not latency. Do not 'fix' the timing."

The zero-cost test plan used the **bedroom** Apple TV ("Main Bedroom (2)") before touching the living room — pairing code **937-37-048** (accessory `301_driveway_clipframe:21069`). The doc also pre-recorded the timing caveat that Blink motion fires ~8 s before frame extraction, so linking raw motion would pop the *previous* frame — the eventual Option B template-sensor fix (08-15) is exactly the "helper the AI automation pulses after extraction" foreshadowed here. Rollback plan: delete the config entry + remove the accessory; "the Fire TV setup is completely unaffected and keeps working throughout."

#### `docs/beehive/appletv_popup_SOLVED_2026-08-14.md` — the doorbell trick (CURRENT — the key mechanism)

Commit `9426623` (2026-08-14, "SOLVED: Apple TV camera popups - linked_doorbell_sensor is the key (motion alone never interrupts the screen)").

The insight, verbatim: "**`linked_motion_sensor` alone is NOT enough.** Motion earns a phone notification but does NOT interrupt the TV. HomeKit reserves the picture-in-picture screen takeover for **DOORBELL** events … **Fix: point `linked_doorbell_sensor` at the SAME motion sensor.** Motion then 'rings the doorbell' and tvOS renders the popup." Working YAML is pasted (bridge `HCC Cameras`, port **21081**, `linked_doorbell_sensor: binary_sensor.301_driveway_motion` annotated "# <-- THE ONE THAT MATTERS"). Requires **full HA restart** — "YAML homekit does not hot-reload."

Diagnostic for success before testing: the Home app accessory shows **two services** (doorbell + motion icons) and Apple starts offering a "Single Press" automation, "which only exists for doorbells." Other verified requirements: Apple TV as Home Hub; per-camera Activity Notifications on (Time=Any, People=Off); "Show on this Apple TV = On"; the Apple TV should be **playing** something ("a popup overlays content").

"Traps hit along the way (do not repeat)": (1) creating the bridge in the **UI** made 13 separate config entries — deleting "the bridge" left 12 orphans still advertising, "Home app offered a dozen pairing codes. Delete every `homekit` config entry, not just the bridge." (2) `ha core reload` does NOT reload automations in packages and does NOT load YAML homekit — use `automation.reload` / `ha core restart`. (3) Each rebuild generates a NEW pairing code. (4) "Cameras with no linked motion sensor show **no 'Activity Notifications' option at all** — that absence is the diagnostic."

The "Still to do" list (other 5 cameras, annotated image, notification split) was completed 08-15 per the verification record and `homekit_tracker.md`.

#### `docs/beehive/homekit_capabilities_plan_2026-08-14.md` — what HomeKit is for here (CURRENT — policy doc)

Commit `18ff039` (2026-08-14, "HomeKit capability research + exposure policy (CarPlay garage door is the standout; never expose add-ons like the Alexa mess)").

The governing lesson, "learned the hard way, on Alexa, today": HA had been allowed to expose 67 entities including nine Supervisor add-ons. "**Do not let HomeKit become the same.** **Rule: expose to HomeKit ONLY things a human would say out loud or tap on a watch.** Never add-ons, never diagnostic sensors, never anything already well served in HA."

Division of labour: "**Home Assistant = the brain** … **HomeKit = the Apple-side face.** TV popups, Siri, Apple Watch, CarPlay, lock screen. HomeKit is not a competitor here; it is a display and voice layer over HA's thinking."

Ranked wins for this house: (1) **CarPlay garage door — the standout** ("a garage door button on the dashboard automatically as you approach home … the single most useful HomeKit feature available to Jeff," given the SONOFF MINI-D project); (2) Apple Watch control (both Jeff and Angela have Watches); (3) Siri as a second voice path — cross-reference to the 08-03 Alexa reserved-word problem ("Alexa **reserves** phrases like 'fast forward', which is why the commercial-skip script needed the awkward 'turn on FF the Commercials' workaround"); (4) local execution on the Apple TV hub; (5) Apple presence as a cross-check ("Angela's tracker going stale, 08-01").

Explicit rejections: **HomeKit Secure Video** ("needs iCloud+ AND cameras that actually stream. Blink does neither"); duplicating HA's phone notifications ("Otherwise the Alexa double-alert problem returns in a new outfit" — keep HA's AI-filtered/cooled/annotated alerts, HomeKit does the TV popup only); video clips in HomeKit ("researched, rejected: HA's ffmpeg camera on local MP4 is documented as hanging/freezing. Jeff is happy with stills anyway"). The expose table ends with the standing line: add-ons/diagnostics/meters → "**NEVER** — the Alexa hazard."

#### `docs/beehive/homekit_tracker.md` — the living HomeKit↔HA ledger (CURRENT — a standing process obligation)

Created in `72e5d56` (2026-08-15) and updated in `5de10eb` (2026-08-15 evening batch). Opens with Jeff's standing rule, verbatim:

> **Standing rule (Jeff, 2026-08-14):** *"Let's keep adding as much as we can to HomeKit and HA. I want them to work together and share now that we have the Apple TV back. Help me track that and let's check every time we add something if we can add it to HomeKit."*

Followed by the process rule: "**every time a new device or entity is added to HA, check it against this file and decide — in, out, or blocked — and record the answer here.** Never leave a new device unassessed." A future session that adds a device to HA without touching this file is violating a standing instruction.

The three bridges (all loaded 2026-08-15): **HCC Cameras** (port 21081, YAML, the 6 Blink clipframe cameras); **HCC Home** (port 21064, UI entry, everything else); **GLE 350 Lock** (port 21065, accessory mode — "HA auto-splits locks into their own accessory"). Cameras are separate deliberately ("HomeKit warns that cameras degrade a shared bridge … **Do not merge them.**"), with the 13-config-entry UI disaster re-recorded as the reason YAML is "the known-good shape for cameras." The doorbell trick is restated as load-bearing: "Do not remove those links."

In HomeKit now: `light.livingroom_cans` (Kasa HS220); `input_boolean.night_mode`; `scene.turn_on_sharky`; scripts `hcc_good_night` / `hcc_skip_commercial` / `hcc_open_sling` / `hcc_resume_fire_tv`; six irrigation switches (`z1_front_right` … `z5_right_side_drive`, `switch.garden`); car (`lock.gle_350_lock`, `switch.gle_350_auxiliary_heating`, `switch.gle_350_pre_entry_climate_control`); `alarm_control_panel.blink_loewen301`; `sensor.backyard_temperature`/`_humidity`; all 6 cameras.

Deliberately OUT: HA add-ons, camera motion-detection switches ("turning one off silently kills the alert pipeline. That is exactly how the cameras went dead 10–14 Aug"), "the other ~148 sensors," Echo speakers.

**Known risks Jeff accepted (2026-08-14)** — important because a future session might flag them as bugs: "**Car unlock in HomeKit.** Anyone with access to the Apple Home can unlock the Mercedes. Offered a lock-only option; **Jeff chose full control.**" And "**Blink arm/disarm in HomeKit.** An accidental disarm kills every camera automation. **Jeff chose to add it.**"

Blocked list (hardware/integration gaps): **LUX thermostat** — "Biggest single miss. LUX has **no HA `climate` entity** — it reaches the app through its own Azure B2C cloud API"; garage door (MINI-D bought, not wired — "the standout win — a garage door tile in CarPlay"); door/window contacts and Zigbee plugs/siren/leak/smoke (waiting on the coordinator); kitchen/dining + garage lights (second HS220 not installed; "garage still needs the HS210 2-location decision"); F-250 telemetry (needs the OBD-II + ESP32 build). Procedural gold at the bottom: the options-flow API sequence for adding entities to a bridge, and the warning "**The initial create flow gives no entity control** — it takes whole domains, so always narrow via options immediately afterward." Footer: "Last reviewed 2026-08-15 evening — all six cameras on annotated images; mute system verified live (30-min back / 5-min front); clip archive running."

---

### The Alexa cleanup (2026-08-14/15)

#### `docs/beehive/alexa_exposure_cleanup_2026-08-14.md` — the audit (CURRENT record of what was removed and why)

Commit `1f4e791` (2026-08-14, "Beehive: Alexa exposure audit - 9 HA add-ons are voice-controllable (fix first), Tuya duplicates mapped; expose WRITE command absent on 2026.8.1, UI only").

Trigger: "Jeff spotted duplicate devices in Alexa." API finding preserved for future automation attempts: `homeassistant/expose_entity/list` over WebSocket **works**, but "the matching `expose_entity/expose` WRITE command does NOT exist on HA 2026.8.1, and neither does `cloud/alexa/entities/update`. Cleanup must be done in the UI: **Settings → Voice assistants → Expose**, ⊗ button."

Findings on the 67 exposed entities:

1. **Nine Supervisor add-ons were voice-controllable** (listed by entity: `switch.z_wave_js`, `studio_code_server`, `silicon_labs_flasher`, `plex_media_server`, `spotify_connect`, `traccar`, `vlc`, `cec_scanner`, `blink_liveview_proxy`). "'Alexa, turn off Z-Wave JS' would take down the Zigbee/Z-Wave stack; Studio Code Server is how Beehive gets edited. Alexa fuzzy-matches names, so a misheard command can plausibly hit one. **Un-expose all nine.**"
2. **Every Tuya device appeared twice** — HA's copy (with a "Socket 1" suffix) and Smart Life's skill copy. Mapping table preserved (Garage fan, Hot Water Circulation Pump, Jeff's Bed lamp, Angela's Bed Lamp, Sharky Shark→Sharky). Rule: "**Remove HA's copies, not Smart Life's** … **un-exposing from Alexa does NOT affect Home Assistant**."
3. Lower-priority junk: `switch.all_devices_shuffle`/`_repeat`/`_do_not_disturb`, `media_player.all_devices`/`this_device` ("Circular"), plus `media_player.dellmasterbed` and `person.mqtt` — "NOT confirmed as unwanted — ask before removing."

The Sylvania note matters most for future sessions: "**They are NOT in HA (vendor-locked, settled 08-13)** but ARE in Alexa via Sylvania's own skill, grouped as 'Living Room Lights' (a favourite). One showed **Unresponsive** on 08-14 — that was the plug reset during the failed Smart Life experiment; Jeff re-paired it in the Sylvania app." This directly supersedes the July assumption (in `lighting_tuya_setup.md`, below) that the Sylvania plugs would import into HA via the Tuya integration — a settled question; don't reopen it.

#### `docs/beehive/alexa_command_card.html` + `Alexa_Command_Card.pdf` — the household-facing card (CURRENT deliverable)

Both added in `72e5d56` (2026-08-15, "Fix camera grid leak + add Apple TV annotated images, Alexa card, backflow layout"). A polished, print-styled, theme-aware HTML card (the PDF is its print twin) written for the humans in the house, titled "What you can ask Alexa." Header: "Alexa was cleaned up on August 14 — she went from **69 things down to 33**, and everything left on this card is something a person would actually say out loud." (Note: the audit doc counted **67** exposed entities; the card says 69 → 33 with "Thirty-six things were removed" — a small internal discrepancy; the record is silent on which count is exact.)

What it documents as live:

- The universal pattern ("Alexa, turn on/off *[name]*") and the standard fix: "say 'Alexa, discover devices' and wait about thirty seconds. That's the fix for nearly every 'I don't know that one' answer."
- **Lights:** Night Mode ("Drops the cans to 10% over a two-second fade — the level you set yourself"), living room lights on/percent/dim — the Kasa dimmer. Offer embedded in the card: "Set the cans where you like them … tell me, and I'll re-point Night Mode at it."
- **TV:** "Skip the Commercials," "Resume Show," "Sling" (Fire TV); "pause the Bedroom TV" (Apple TV).
- **Around the house:** "Good Night" ("Turns off *every* light in the house and logs the time"), "Vacuum the House" / "stop the Vacuum" (Sharky).
- **Irrigation:** Zones One–Five + Garden Zone "by plain number instead of their old codes," with the safety note: "**Say turn off when you're done.** A zone started by voice isn't running a scheduled program, so don't count on it stopping itself."
- **The Mercedes:** Car Heater, Car Climate — and the deliberate omission: "Remote *start* is deliberately not on Alexa — it needs the PIN and has Mercedes' own attempt limit behind it. That one stays in the app."
- **Backyard weather:** "what's the Backyard Temperature?" — "Straight off the station behind the house," with the honesty note that Alexa answers temperature far more reliably than humidity/wind/feels-like.
- **"What she can no longer touch"** — the removal summary: 9 add-ons, 6 camera motion-detection switches ("exactly how the cameras went quiet for four days earlier this month"), 4 duplicate Tuya plugs, 11 Echo speakers, 6 odds and ends. Footer: "33 devices exposed. Anything not on this card, Alexa simply cannot reach."

---

### Garage door, safety layer, Zigbee shopping

#### `docs/beehive/garage_door_sonoff_mini_dry_setup_2026-08-06.md` — the final garage-door plan (CURRENT — awaiting install)

Three commits on 2026-08-08: `8d53af4` ("Research + write the SONOFF MINI DRY garage door setup plan"), `feee336` ("Resolve garage door install placement, MyQ coexistence, power source"), `f84f8d8` ("Log MyQ sale decision, research + recommend a Zigbee position sensor"). (The doc is dated 08-06; committed 08-08.)

Opens by anchoring the hardware decision: "Part arrived: **SONOFF MINI DRY** (Matter, dry-contact relay, box says 'MINI Dry' — same part as the 'MINI-D' researched earlier). This is the final hardware call from 08-05 — confirmed correct, **not a repeat of the earlier ratgdo/SONOFF-Basic/SONOFF-SV guessing mistakes**." Terminals documented from the physical unit: NO/COM/NC relay out, N/L mains in (100–240V), S1/S2 external switch (unused), DC+/DC− (12–48V alternative). "Everything below is sourced from SONOFF's own docs/help center and independent reviews … not guessed" — 10 source links at the bottom.

Jeff's three practical questions, each resolved 08-06 with reasoning:

- **Install at the opener, not the wall switch** — direct short run to the low-voltage wall-console terminals; the wall-switch box likely can't fit the module ("same box-depth concern already flagged for the Kasa lighting switches"); outlet access equal at both spots so it isn't the decider.
- **Coexistence with MyQ + wall button — no conflict.** MyQ connects to the same wall-console terminals as the button; the Sonoff becomes "a **third** independent trigger onto one shared low-voltage sense circuit … the same pattern keypads and extra remotes already use."
- **Power via a plain 2-conductor AC cord** with a molded plug landed on N/L ("a 'lamp cord' … or repurpose a spare extension cord by cutting off the female end") — no splicing into the opener's internals.

Critical install-order finding: "**the 'Inching' (momentary pulse) setting can only be configured through the eWeLink app — Home Assistant's Matter integration does not expose this setting at all.**" So: pair to eWeLink first, enable Inching (~0.5–1 s), *then* Matter-commission into HA. The setting is stored **on the device** — set once. Expected HA result: "a **plain on/off `switch.*` entity** … not a `cover` entity like ratgdo would have given. That's expected and fine."

Division of labor decision: rather than have Jeff build HA template-cover YAML to fake a `cover`, "**I'll adjust the app itself** to recognize a plain garage switch entity and show a simple 'OPEN/CLOSE' trigger button — no open/closed *state* display, since there's no position sensor yet." (BEEHIVE_REFERENCE notes the app's `loadGarage()`/`loadGuardian()` gained `switch.*garage*` + `binary_sensor.*garage*` auto-detection on 08-08.)

The 08-06 scope change: "**Jeff has both parts of the MyQ (hub + sensor) and plans to sell it** rather than keep opening a separate app just to check open/closed status — reasonable, since the whole point of this project is one app for everything." That promoted the position sensor from "future, not needed" to **active**: recommendation is a **Zigbee contact sensor** (SONOFF **SNZB-04P** — same ecosystem as the coordinator; or Aqara Door/Window), mounted door-bottom-panel + floor/frame, explicitly *not* a tilt sensor by default ("a stuck/dusty tilt ball can misreport. Contact sensors are the simpler, cheaper default"). Needs the Zigbee coordinator paired first. Testing checklist: wall button still works (parallel wiring intact), eWeLink toggle works, HA toggle works, pulse is momentary not held ("if it stays on … the Inching Setting wasn't saved correctly").

Status: **current and pending** — as of the 08-15 homekit_tracker the MINI-D is "bought but not wired." The full ratgdo→MINI-D decision saga (including Jeff catching Claude's reasoning error) lives in BEEHIVE_REFERENCE, below.

#### `docs/beehive/safety_shopping_list.md` — the DIY alarm layer, priced (CURRENT plan; partially purchased)

Commit `6837d2d` (2026-07-01, "docs: add Beehive safety/alarm shopping list + myQ (ratgdo) notes").

Jeff's philosophy, recorded as his ask: "*tons* of **life-safety** coverage (smoke/CO/leak/gas/freeze), but **lean on intrusion** (only key doors + a few motions — not every window)." All Zigbee, one coordinator stick in the J45, "no wiring, all local in Beehive." Sequencing rule in a blockquote: "**Order of operations:** J45 set up → RTL-SDR (meters) → THEN this alarm layer. Don't buy ahead of the J45 being solid."

The itemized list with prices (all approximate, from the doc):

- **Brain:** Sonoff Zigbee 3.0 Dongle Plus, model "P" (~$20) + USB extension cable (~$6) — "Move the Zigbee stick away from the J45/RTL-SDR to avoid USB-3 interference (real issue)." *(Note: the doc labels the "P" as EFR32MG21 — that chip is actually the "E" model's; the P is CC2652P, as the later buy-now checklist correctly states. Chip-label error in this doc.)*
- **Alarm output:** Zigbee indoor siren/strobe (HEIMAN HS2WD-E, Frient/Develco, or Neo, ~$30–40); optional outdoor ~$40.
- **Life-safety ⭐ (the priority):** smoke detectors 2–3 @ ~$35; CO detectors 1–2 @ ~$40 ("natural gas house, so CO matters"); natural-gas/methane detector ~$30; water-leak sensors 4–6 @ ~$12 (water heater, sinks, washer, meter pit); freeze/temp sensors 2 @ ~$12 (plus the planned DS18B20 in the breaker panel).
- **Water-main auto-shutoff:** motorized ball valve ~$50–90 — "Turns 'leak alert' into 'leak stopped.'"
- **Intrusion — "keep it lean (Jeff: don't go crazy)":** contact sensors ONLY on key doors (front, back, garage↔house) 3–4 @ ~$10–13; interior motions 2–3 @ ~$12; optional window contacts; keypad/button ~$25.
- **Garage:** ratgdo board ~$30 (with the note that Chamberlain blocked HA cloud → go local), or all-Zigbee alternative (dry-contact relay + tilt sensor, ~$25). "NEED FROM JEFF: opener brand + model, and wall-button learn-button color" — this section is **superseded** by the 08-05/08-06 dry-contact finding and MINI-D purchase.
- **Notifications (free, required):** HA Companion app on Jeff's, Angela's, and Braxton's iPhones for Critical alerts that "override silent/DND."
- **Already have / don't re-buy:** Blink cameras, RTL-SDR, DS18B20.

Closes with the cross-device automations the hardware unlocks: leak → close main + Critical alert; smoke/CO/gas → siren + alert (+ optional HVAC-off); garage-open-after-dark; away scene ("arm motions/contacts, confirm garage closed, rain-delay B-Hyve"); panic → siren + strobe + Critical push ("already wired").

#### `docs/beehive/zigbee-buy-now-checklist.md` — the verified shopping trip (CURRENT; hardware arriving)

Commit `a00842c` (2026-07-31, "Add Zigbee buy-now checklist, verified against the existing safety plan"). Written because Jeff was actively eBay-shopping for the dongle + door sensors; every prior pick was re-verified "against real, current search results so you don't buy the wrong version" — 11 dated sources listed, "checked today, not from memory." It re-quotes Jeff's rule: "your own rule: 'tons of life-safety coverage, but lean on intrusion — only key doors, not every window'."

Verification table: ZBDongle-**P** (CC2652P) still the reference coordinator; HEIMAN HS2WD-E still right "with one honest caveat" (integration is better under Zigbee2MQTT than ZHA — "ZHA only exposes the battery cleanly; the siren trigger itself works but is more limited … Z2M gives you more control (volume/duration)"); Frient HESZB-120 a repeat top pick; SONOFF SNZB-05P is the current leak sensor ("optional extension probe cable worth getting for spots like under the water heater"); **Aqara Valve Controller T1** named as the specific water-main valve ("retrofits onto your existing shutoff handle (no plumbing cut) — fits 1/2\", 3/4\", 1\" pipe").

Buy-first specifics: search `SONOFF Zigbee 3.0 USB Dongle Plus ZBDongle-P` (~$20) plus a USB extension — "This isn't optional — USB 3.0 ports throw off interference in the exact 2.4GHz band Zigbee uses … Skipping this is the #1 cause of 'my Zigbee devices keep dropping.'" Door sensors: `SONOFF SNZB-04P` ("note the **P** — the newer version; the plain 'SNZB-04' … has weaker tamper detection and shorter battery life"), ~$10–13 each, buy 3–4. "**Total for both of these today: roughly $65–75.**" Phase-2 search terms listed (HEIMAN smoke/CO, SNZB-05P, SNZB-02P, Aqara T1, HS2WD-E). Setup order: dongle on the extension → ZHA integration auto-finds the serial port → pair sensors (hold button ~5 s) → then the panic automation doc "has the ready-to-paste automation — just swap in the real entity IDs."

Status: **INFERRED:** hardware was purchased and began arriving by 2026-08-15 — commit `5de10eb` (2026-08-15) is titled in part "Zigbee arrival inventory," and the 08-15 homekit_tracker still lists Zigbee items as "waiting on the coordinator dongle," so as of the branch tip the coordinator was not yet paired. The record inside `docs/beehive/` itself is silent on exactly what arrived.

**Contradiction to resolve before pairing:** this checklist (07-31) and the safety list both specify the ZBDongle-**P**, but BEEHIVE_REFERENCE (extracted from CLAUDE.md, 08-16) says "Zigbee coordinator (SONOFF **ZBDongle-E**, planned)." The record does not say which was actually bought. A future session should check the physical stick before assuming either.

#### `docs/beehive/panic_alarm_automation.md` — the EMERGENCY bar's other half (CURRENT design; NOT yet buildable)

Commit `7a5e984` (2026-07-01, "feat(panic): redefine panic → sirens + lights + alert family (no 911 auto-dial)").

What it records: the app's red EMERGENCY bar POSTs (after confirm) to Beehive webhook `hcc-panic-button` with `{"action":"panic","siren":true,"lights":true,"notify":["jeff","angela","braxton"],"triggered":"<time>","source":"HCC App"}`. Everything that *happens* is HA-side, and the doc is blunt about preconditions: "**Nothing here works until (a) the J45 is set up, (b) the alarm system is integrated into HA, and (c) the HA Companion app is installed on Jeff's, Angela's, and Braxton's phones.**" And the scope rule in a blockquote: "**Jeff will call 911 himself — this automation does NOT dial 911.**"

Open inputs it still needs: the siren integration path (hardwired panel via Envisalink/Konnected, Zigbee/Z-Wave siren via the coordinator, or a relay-driven siren — the Zigbee siren path is the one the shopping list chose), the strobe light entities, and the phone-alert method. Alert options weighed: **recommended** HA Companion Critical push (free, overrides silent/DND — "what most home-alarm HA setups use"); optional real phone call or SMS via **Twilio** (paid, "More setup + small cost. Can be added later").

Full ready-to-paste YAML is included: webhook trigger (`local_only: false` with a note to set true if home-Wi-Fi-only), `siren.turn_on` on placeholder `siren.house_alarm`, `light.turn_on` with `flash: long`, three Critical push notifies (`critical: 1`, `volume: 1.0`), commented-out Twilio call block — every action wrapped in `continue_on_error: true` so it "keeps working even if one piece is missing." Planned follow-up: a second `hcc-panic-clear` webhook → "Cancel alarm" button. Test plan: fire the webhook manually via curl first, then the app on home Wi-Fi, then confirm the off-network failure path shows the app's "Could not reach Beehive — call 911" message "(so you're never falsely reassured the alarm fired when it didn't)."

Status: **current design, blocked on the Zigbee siren** (still in the Phase-2 shopping list as of tip). The webhook and app side exist; the HA automation does not yet.

---

### Lighting and media (the July layer)

#### `docs/beehive/lighting_tuya_setup.md` — Tuya plugs into Beehive (PARTIALLY SUPERSEDED — Sylvania plugs settled as vendor-locked)

Commit `83f0240` (2026-07-04, "Add Tuya plug setup + HA-lighting-automation guide (docs/beehive)").

What it records: the plan to bring Jeff's smart plugs into HA so the app's GUARDIAN → Lights & Plugs card controls them and HA runs the sunset-on/9pm-off schedule. Key facts: "Jeff's 'SYLVANIA Smart WiFi' plugs are **Tuya** devices. **Confirmed 07-04 (Jeff's screenshot IMG_0852): his plugs already live in the Tuya app directly** (home '301'; plugs: Giraffe plug, Lamp Couch, Lamp chair, Lamp foyer, + more rooms)." The modern Tuya integration path is documented (User Code + QR scan, "no developer/cloud project"), plus two UI automations (sunset −15 min on; 21:00 off) with YAML alternatives, Part C ("Make HA the sole brain" — delete the old Tuya-app 9pm rule, keep Alexa voice via expose), and the payoff paragraph: HA-side plugs tie into Away Mode, the future alarm ("flash-on if it trips"), "none of which the Tuya app or Alexa can do alone."

Status: **partially superseded.** Some Tuya devices did land in HA (the 08-14 Alexa audit lists HA-side Tuya entities: garage fan, hot-water circulation pump, bed lamps, Sharky). But the *Sylvania* plugs specifically never made it: the 08-14 audit records "They are NOT in HA (**vendor-locked, settled 08-13**)" and references a "failed Smart Life experiment" that reset a plug. A future session reading only this July doc would wrongly retry importing the Sylvania plugs — that question is closed. **INFERRED:** the living-room lighting role this doc served was overtaken by the Kasa HS220 dimmer install (`light.livingroom_cans`, in HomeKit by 08-15); the detailed 08-13 Sylvania session record is outside `docs/beehive/` and not covered here.

#### `docs/beehive/media-center-setup.md` — the Kodi plan (SUPERSEDED / never verified as built)

Commit `05dc1db` (2026-07-12, "Splash landing screen + media center docs").

What it records: a staged plan for the beast (192.168.1.194, GTX 1050 Ti, viewing room) to drive the TV via **Kodi**, with HA popping camera/AI alerts *over* playback via `kodi.call_method` → `GUI.ShowNotification` — "Angela sees 'Person at Front Doorbell' on the TV, glances, it fades, show continues." Details: Kodi HTTP control on port 8080, username `kodi`, example password `hcc2026`; HA Kodi integration → `media_player.kodi`; a full per-camera automation combining `blink.trigger_camera` (7 s delay) → `image_processing.scan` (3 s) → Kodi toast (8 s) + phone push, with a 60 s template debounce. Stage 5 polish ideas: camera-snapshot screensaver, HCC dashboard on the TV via a Kodi web-browser add-on pointed at `https://loewenhome.com`, local media, a "Movie Night" scene, TTS to the TV. Honest DRM note: premium apps cap at **720p** on a PC browser (Widevine L3) — "beast = media center + AI + alerts + local content + HCC dashboard; Fire TV Stick = second HDMI input for … pristine 4K streaming." Division of labor: Clyde does HDMI/Kodi/firewall, Jeff adds Kodi to HA, "Claude (cloud): wrote this plan; owns the app-side alert UI."

Status: **superseded in practice.** The TV-overlay role this doc designed was actually delivered by a different chain — Fire TV + PiPup (referenced throughout the August docs as "the existing notify/popup automations" and `hcc.yaml`'s Fire TV popup), and then the Apple TV HomeKit popups (08-14/15). No later doc or commit in this folder confirms Kodi was ever installed or that `media_player.kodi` exists; **the record here is silent on whether any of this plan was executed.** A future session should not assume a Kodi integration is present.

---

### The top-level references (extracted from CLAUDE.md, 2026-08-16)

Both files carry the same header: "Moved out of `CLAUDE.md` on 2026-08-16 07:46 to keep that file small — it is auto-loaded and occupies context for the entire session. **This is the full, unedited section.**" Both are mirrored to `C:\Users\jeffl\iCloudDrive\HCC-Archive\` (`BEEHIVE_REFERENCE.md` / `UTILITIES_REFERENCE.md`). Commit for both: `fab5b30` (2026-08-16). They are dense accumulations of dated findings — the closest thing the repo has to institutional memory outside the changelog.

#### `docs/BEEHIVE_REFERENCE.md` — the full "Beehive / Home Assistant Integration" section (CURRENT)

Everything in it, by topic:

- **Hardware:** the J45 (specs above); internal-SSD migration 2026-07-02, "external is retired, don't reintroduce it." **4× USB 3.0 ports** ("confirmed by Jeff 08-05, corrects the earlier '2 free ports' assumption"); one yellow (likely always-on). Allocation: RTL-SDR = 1 (live); Zigbee coordinator ("SONOFF ZBDongle-E, planned" — see the P/E contradiction flagged above) on its own extension = 1; HDMI capture card (planned) = 1; **1 spare**. Jeff's "cakitte" USB-C hub exists but isn't needed.
- **Architecture:** three connection classes — USB sticks in the J45 (radios only), Wi-Fi/LAN (ESP32/ESPHome, Shelly, local cameras), cloud (Blink, B-Hyve, LUX, SmartHub/CEMC).
- **How Claude works:** "this cloud session has NO network access to Jeff's home LAN … it writes exact instructions for Jeff or the local 'coworker' session to execute. The coworker session (Claude Code on the beast) DOES have that access — see Mandatory Rule 13."
- **URLs and auth:** HA base URL + fallback + Nabu Casa; "the beast itself sometimes can't reach `192.168.1.66:8123` (VPN/AV blocking local IP) — use the phone if that happens." HA long-lived token entered once via HOME → "OPEN BEEHIVE ↗", stored in `localStorage.ha_token`.
- **Camera + irrigation app plumbing:** camera section falls back to Blink 2FA PIN entry (`blinkSendPin()` → `POST /api/services/blink/send_pin`); irrigation tries `loadIrrigationFromHA()` (B-Hyve switch filtering) then `loadIrrigationDirect()` (direct B-Hyve cloud).
- **The Mercedes GLE 350 (mbapi2020)** — the largest block, and the folder's best debugging war story:
  - VIN `4JGFB4KB0MA478988` (hardcoded `CAR_VIN`); helper `carMbSvc()`. Gas-vehicle service list (engine_start/stop, doors_lock/unlock, auxheat, temperature_configure "send as strings not numbers," preconditioning seats, sigpos_start, windows, sunroof) vs. EV-only services to avoid (`preheat_start`, battery/charge configs).
  - **PIN rule:** stored in the integration options in HA; "app must never prompt for or send a `pin` field." Confirmed present 08-06 (entry_id `01KY38Z7C90J2WE6S9R987JQZ4`, "Disable capabilities check" ticked).
  - **✅ RESOLVED 08-06 — remote start confirmed working, two independent blockers:** (1) **Mercedes' remote-attempt limit** — the car refuses further remote starts until physically key-started; Jeff key-started it, resetting the counter. (2) **The PIN needed re-entering AND a full HA restart** — "`homeassistant.reload_config_entry` was NOT enough — mbapi2020 reads the Security PIN only when it initialises."
  - **The diagnostic that cracked it, preserved as a first-move for next time:** "`sigpos_start` (flash lights) is the ONLY remote command needing no PIN. It worked while every PIN-gated command failed — that split proved the app, Cloudflare proxy, HA, VIN and integration were all fine and isolated the fault to the PIN in one step. **Use that test first next time.**"
  - **The Mercedes hard limit, with the app's verbatim message** (Jeff's screenshot): *"Your request to start the engine is unable to initiate because you have reached the limit of remote attempts between manual ignition cycles. Please use your key and manually start your vehicle the next time."* The doc notes this appeared **after** the PIN was accepted — "This is very likely what the `RIS_PIN_INVALID` below actually was: Mercedes handing a vague/wrong error code to a third-party integration where its own app gave the real message. **Before chasing a 'broken' remote start: confirm the car has been key-started since the last remote attempt.**"
  - **⚠️ DIAGNOSTIC TRAP (coworker, 08-06), recorded as a confession:** reading the config entry via `config_entries/get` over WS returned empty `options`, and the coworker told Jeff the PIN was missing — "**That was wrong.** HA's config-entry list API does not return `data` or `options` at all — they're internal … **'Field absent from the API response' ≠ 'field is empty.'** … **go to `system_log/list` first**."
  - Entity semantics trap: `binary_sensor.gle_350_windows_closed` is inverted ("`on`=closed — code must detect `*_closed` and flip logic"); always scope CAR lookups to Mercedes/GLE/mbapi entities ("house entities can bleed in otherwise (fixed 07-21)").
- **Ford F-250** (2001, VIN `3FTNX21FX1MA23431`, 7.3L Power Stroke, 4WD, crew cab): "no connected-car features (pre-dates FordPass Connect)." Vehicle switcher persists in `localStorage.hcc_vehicle`. Future: Veepeak OBDCheck BLE+ (~$30) + ESP32/ESPHome, optional NEO-6M GPS.
- **The garage-door decision history, in full** — the folder's best example of Jeff correcting Claude:
  - Chamberlain MyQ "permanently useless for HA (Chamberlain blocked all 3rd-party API access 2023 … confirmed dead 07-28, don't revisit absent a major policy reversal)."
  - Model-number correction 08-06: "MYQ-G0402" previously recorded as the hub is actually the *add-on door sensor* SKU.
  - ratgdo research 08-04: official kit $45 (ratcloud.llc); **Gelidus Research RATGDO Alternate Board, USB-C v2, ~$22–25** (pre-assembled, pre-flashed, full parity) as the cheapest correct option; DIY `rat-ratgdo` ~$15–20 in parts; "**Avoid** cheap ~$19 'ESPHome garage door' relay modules (e.g. Athom) — plain relay+reed-switch, NOT Security+ protocol-aware."
  - Protocol test 08-05: "Jeff bridged the wall-button wires directly and the door toggled" → dry-contact, not Security+ 2.0.
  - **"CORRECTED 08-05 — Jeff caught a real mistake in the reasoning, ratgdo/Gelidus board dropped entirely.** Jeff pushed back: if it's confirmed dry-contact (no Security+ protocol), why pay $22-25 for a board whose whole value is decoding that protocol? He's right — the ratgdo/Gelidus premium over a plain relay is 100% for Security+ signal decoding, which his opener doesn't use."
  - "Corrected again 08-05 — exact model matters, 'SONOFF Basic' was too vague/wrong" (Basic is mains-voltage); SONOFF SV considered; then "**Jeff found a better match: SONOFF MINI-D (~$15-20, Amazon)** … **This is now the final part.**" (Matter-native, dry-contact NO/COM/NC, hardware Inching Mode.)
  - MyQ hub + sensor to be **sold on eBay** (08-06); the SNZB-04P position-sensor recommendation restated.
- **GaragePC** (HP TouchSmart 520-1020 all-in-one, researched 08-05): 23" 1080p touchscreen, Pentium G620 (Sandy Bridge, **no AVX**), 8GB, 500GB HDD, webcam/mic/Beats speakers. Plan: wipe to **Linux Mint + Chromium kiosk** for the app. "⚠️ Touchscreen is NextWindow Voltron — does NOT work out of the box on Linux; needs the community `nwfermi` DKMS driver … **This kills ChromeOS Flex as an option.**" Six planned roles (kiosk, Garage Cam via go2rtc, TTS speaker, Wyoming voice satellite, Glances/WoL/SSH, Samba second-backup target). "**Ruled out (CPU too weak / no AVX — don't revisit):** OBS/Sling restream host, CodeProject.AI or any AI workload." Optional ~$25 SSD swap.
- **Spare hardware inventory (08-05):** KESU 500GB USB drive (→ AirTV 2 DVR; "Single 2.5\" spinning drive — never the sole copy of anything important"); **Lenovo B570** laptop (model 1068, 2012, S/N WB06276882; CPU confirmed Pentium B960, no AVX — "heavy encode … and AI officially ruled out"; Windows name is "**DellMasterBed**" — "hand-me-down name — don't go hunting for a mystery Dell on the network"); Delam BM-800-class condenser mic (→ GaragePC intercom, may need ~$10 USB audio dongle); WD Scorpio Blue 320GB (WD3200BPVT, 2012 — risk-free Mint test drive for the B570; "never a backup target"); HDMI-005 "AnyCast"-class Miracast stick (mirroring only — DRM/Sling "typically blocks"); an **HDMI→USB capture stick** identified 08-05 "via Camera-app test on the beast: shows up as a camera = capture device confirmed" — assigned to the Kitchen TV chain, "replacing the planned AXHDCAP purchase entirely."
- **Kitchen TV:** solved **08-05 at $0** — the wall-mounted iPad Air 2 (iPadOS 15) plays `watch.sling.com` in Safari, "photo-confirmed, Fox News live." The capture chain (Roku → **EZCOO EZ118K** HDCP-*bypass* extractor, ~$20–25, "most 'HDCP compliant' extractors do NOT strip, e.g. OREI HDA-912 confirmed doesn't work" → capture stick → J45 → go2rtc) is **on hold pending the AirTV 2** (which has "NO open API … not a Plex/Channels/HDHomeRun substitute" but injects antenna locals into Sling's Roku guide).
- **Smart Lighting Project (08-06):** Jeff sent a finished 2-PDF electrical plan (saved verbatim under `docs/lighting/`). Kasa **HS220** (dimmer) / **HS200** (garage), local via `python-kasa`, no hub — "Picked over MOES (100W/gang limit — doesn't fit the 108W bedroom/kitchen loads …) and Shelly Dimmer Gen3 (2x the cost, more config)." The bedroom trick: feed reversed so the door box is the power origin and each redundant toggle becomes an independent dumb receptacle switch — "every existing switch keeps a real job, no blank plates." Verified 08-06: 108W loads have real headroom under HS220's 150W-LED max. **Unresolved flag:** the garage's 2-location circuit needs the **HS210 kit** (a lone HS200 "leaves the OTHER physical switch non-functional") — "needs Jeff's call before ordering."

#### `docs/UTILITIES_REFERENCE.md` — the full "Water + Gas + Electric Meter Integration" section (CURRENT)

Status line: "Water + Gas LIVE via RTL-SDR + rtlamr2mqtt on the J45. Electric 'This Month' LIVE via the SmartHub (CEMC) cloud integration — a real ATM90E32 CT-clamp build is still the future path for true instant Now/Today."

**💧 WATER — WHUD · Kamstrup flowIQ 2100:**

- Meter S/N `25394131`, billing cycle ~21st. Rates validated: **Base $10.32 + $0.00908/gal.** Sewer (City of White House, mirrors the WHUD meter): **Base $23.42 + $0.01011/gal** — rate increase confirmed 08-05 from the 5/7–6/6/26 bill (was $22.74 + $0.00982/gal, both up ~3%, "exact match to the bill's $92.56 base+consumption").
- **Known gap, awaiting Jeff's call:** Sanitation Services (**$24.00** flat) + Stormwater (**$8.99** flat) are on the city bill but NOT in "Est. Sewer."
- 08-06: `IRR_FLOW` (irrigation GPM constants feeding the sewer-overcharge waste calc) **recalibrated to real measured data** — "The old spec-sheet-guess constants were 23-49% too high depending on zone, meaning the 'Total sewer overcharge tracked' running total has likely been overstated for any already-closed cycle. Self-corrects going forward … past cycles are not retroactively fixed."
- 08-05 tracking bug, found because "Jeff asked me to confirm the 'Total sewer overcharge tracked' accumulation is correct **before he starts sending bills to cross-check it**": `irrGalFromHistory()` (real B-Hyve runtimes) only updated the on-screen note while the stored `water_billing_history` totals kept the rougher schedule estimate "forever." Fixed; verified in isolation; "**could not test the live B-Hyve/HA fetch itself, this sandbox has no network path to Jeff's real HA instance.**"
- 08-05 design decision — **the sewer case's data hygiene:** "Jeff's goal: he's building a case with WHUD/City of WH to get money back for irrigation water that never enters the sewer but still gets charged sewer rates — needs clean, uncontaminated usage-based data." Garbage/stormwater added as separate line items (`GARBAGE_FLAT`/`STORMWATER_FLAT`), folded into `Combined` only; `sewerEst`/`sewerWaste`/history fields "untouched, still pure usage-based, still the exact dataset the overcharge case needs." Verified "reproducing the real bill to the penny ($92.56 sewer-only, $125.55 full city total)."
- Read path "confirmed by WHUD supervisor": external MIU `100WD`, ERT `79453337`, unencrypted, `scm+`, 915–930 MHz, ~1 SCM/min, no AES key. European timestamps → Central. Raw ÷10 = gallons.
- **The pit-radio incident (CLOSED, do not re-raise):** the MIU went silent 07-28 ~17:39 UTC and self-recovered. "**Jeff's explicit call (07-31): water is transmitting fine now, and he does NOT want to call WHUD about it** — reporting it would draw utility-district attention/scrutiny he doesn't want … Leave this alone unless water goes silent again; if it does, that's a fresh incident, not a continuation of this one." Timing was checked to clear the same-day recorder fix of blame ("water kept transmitting fine for 5+ more hours after that").

**🔥 GAS — Piedmont/Spire · Itron 100G ERT:**

- "Piedmont Natural Gas, transitioning to Spire (billing continues under Piedmont during transition). Account `6100 0546 4779`. Meter Elster AC-250, Piedmont# `T821986`. Billing cycle ~5th."
- ERT FCC ID `EO9100GDLA`, unencrypted, 900–920 MHz; same RTL-SDR reads both. Raw ÷100 = CCF.
- Rates validated against 3 bills: "Base $13.44 + Distribution $0.61809/therm + PGA $0.61691/therm = $1.235/therm all-in. Heat factor 1.068 (CCF→therms). 5% local franchise fee. `(13.44 + round(CCF × 1.068) × 1.235) × 1.05`."

**⚡ ELECTRIC — Cumberland Electric (CEMC):**

- This Month + Cost live via SmartHub, entity `sensor.electric_smarthub_energy_monthly_usage_4501007001`; poll fixed 08-06 from HA's 6h default to 30 min ("the practical ceiling since SmartHub's own backend only refreshes every 15-60 min").
- The 08-06 statistics upgrade with two real bugs found by live coworker verification: the WS command is `recorder/statistics_during_period` ("NOT `history/statistics_during_period` — that name doesn't exist on Jeff's HA Core 2026.8.0, confirmed live, returns `unknown_command`"); it's WebSocket-only, so `functions/api/ha-stats.js` opens a one-shot outbound WS to the allow-listed Nabu Casa host. Per-period usage must diff consecutive cumulative `sum`/`state` readings — "**not** the `change` field, which the coworker confirmed always reads `0` for this sensor even across real usage growth." Design rule: "**NOW is deliberately left blank (—), never estimated** — SmartHub's finest real grain is hourly; genuine 'Now' only comes from the future CT-clamp build."
- Not built (checked, unavailable as attributes): Bill Due / Last Payment / vs-Last-Year — "next session (or the coworker) should pull the real entity's full attributes dict first."
- Account `4501007001`, meter `145590962` ("Landis+Gyr Gridstream — not Itron, can't radio-read directly"). 200A service, Challenger panel.
- Rates validated against the 07/30/2026 bill (2,120 kWh billed): "Base $39.00 + Energy $0.08657/kWh + TVA Fuel $0.02847/kWh = $0.11504/kWh all-in. TVA fuel is a pass-through surcharge that shifts most cycles — re-derive from each new bill photo."
- **Future build:** 6-channel CircuitSetup ATM90E32 (2 chips) + ESPHome — CT1+2 = 200A mains, CT3–6 = range/dryer/AC/well pump, ~$90–110 DIY. And the standing rule in bold: "**Jeff wired his own house — never suggest hiring an electrician.**"
- Two "confirmed NOT a bug" investigations preserved so they don't get re-chased: "**⚠️ '$94 seems low'** — checked and confirmed NOT a bug (07-31)" (fresh billing cycle starting ~23rd; $94 ≈ 478 kWh ÷ 8 days ≈ 60 kWh/day, in range; "first check whether it's climbing before assuming a bug"); and the Water Flow tile's brief 0.2 gpm readings (the 5-minute derivative window averaging a flush — "Working as documented").

---

### Cross-file contradictions and traps a future session must not fall into

1. **ZBDongle P vs E:** `zigbee-buy-now-checklist.md` and `safety_shopping_list.md` specify the ZBDongle-**P**; `BEEHIVE_REFERENCE.md` says ZBDongle-**E** "planned." Additionally, `safety_shopping_list.md` mislabels the P's chip as EFR32MG21 (that's the E's chip; the P is CC2652P per the checklist). **The record does not resolve which stick was bought.** Check the physical hardware before pairing — Z2M/ZHA config differs by chip.
2. **Alexa entity count:** the audit says 67 exposed; the command card says "69 things down to 33" and "Thirty-six things were removed." The record is silent on which count is exact.
3. **The mute/cooldown timeline:** designed 08-14 (`alert_fatigue_fix`), but per the 08-15 verification record it "had NEVER worked" until fixed that day — the first successful mute writes in system history are 2026-08-15 16:30/16:37.
4. **Scanner/HomeKit image split is load-bearing:** AI scanners read `camera.*_clipframe` (raw); HomeKit serves `camera.ai_*` (annotated). Crossing them created a silent self-scanning feedback loop on 08-15 while every health check read green.
5. **`linked_doorbell_sensor` is the popup mechanism.** Removing it (or "simplifying" to `linked_motion_sensor` only) silently downgrades Apple TV popups to phone notifications.
6. **Sylvania plugs are settled (08-13): vendor-locked, not in HA.** Do not retry the July `lighting_tuya_setup.md` import path for them.
7. **MyQ/Chamberlain is dead for HA (confirmed 07-28)** and the ratgdo class of boards was deliberately dropped after Jeff's 08-05 pushback. The garage part is the SONOFF MINI-D, Inching configured in eWeLink only, arriving in HA as a plain `switch.*`.
8. **The Blink-disarm failure mode has no error surface** except `alarm_control_panel.blink_loewen301` — check it first when "the cameras went quiet."
9. **The pit-radio silence of 07-28 is closed by Jeff's explicit instruction** — do not suggest calling WHUD about it.
10. **Rates are dated, validated numbers, not guesses** — water/sewer/gas/electric rates above were each reconciled to real bills (to the penny for the 08-05 city bill). Re-derive TVA fuel each bill; don't treat it as fixed.
11. **`media-center-setup.md` (Kodi) was a plan, not a build** — no evidence it was executed; the TV-alert role went to Fire TV PiPup and then Apple TV HomeKit.
12. **The J45's external USB drive is retired** — never reintroduce it; HA OS lives on the internal drive since 2026-07-02.
