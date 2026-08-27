# HCC — THE ONE OPEN-ITEMS LIST

**Created 2026-08-19 23:20 CT because Jeff asked "Do you not have a list of all this shit that
never gets done?" There were FIVE lists and nobody ever merged them:**
`CLAUDE.md` Pending Items · §17 PART I · `HCC-secrets/HCC_ACCESS.md` open items ·
`docs/password_and_data_security_plan_2026-08-19.md` "Still open" · every `docs/incidents/*`
"Still owed". **That is why things sit for weeks — each session opens one file, fixes what is in
front of it, and never sees the other four.**

> **RULE: this file is the single source of truth for what is not done.**
> Every session updates it. Closing an item means striking it here with the date and the proof,
> not just fixing the thing.

**OWNER is the whole point.** `CLAUDE` = nothing is stopping me; it sits because I did not do it.
`JEFF` = physically or legally cannot be done by me — hands on hardware, credentials, purchases,
decisions about his own house.

---

## 🔴 P1 — SECURITY / DATA LOSS

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 28 | 🔴 **A camera-pipeline exposure was found and verified 2026-08-20. Details are deliberately NOT in this public repo.** The write-up lives at `HCC-secrets/SECURITY_camera_stills_public_2026-08-20.md`, outside the repo, because this repo is **public** and the finding is still unpatched — publishing the method would make it worse. Read that file before touching the camera pipeline. | **CLAUDE fixes, JEFF decides when** | found 08-20 | Two halves: one config change I can make (with a documented trap that would break the 08-15-verified pipeline if rushed), and one rotation only Jeff can do. **Do not paste the details back into this repo.** |
| 2 | **HA backup encryption key exists on ONE PC.** ✅ **Presence re-verified 2026-08-23 7:24 PM: `C:UsersjefflHCC-secretsha_backup_encryption_key.txt`, 34 bytes, last modified 2026-08-02.** It is real, it is there, and it is the only copy. Without it every `.tar` in iCloud is undecryptable — *"the single most load-bearing secret in the whole disaster-recovery system"*. | **JEFF** | 08-02, **21 days** | Still a 2-minute Bitwarden Secure Note. **The risk is not theoretical:** this PC has had 5 crashes and a 55-minute power lockout this month, and #4 confirms the drive is NOT encrypted, so the file is also readable by anyone with the box. One paste into Bitwarden closes it. |
| 3 | **Bitwarden duplicates** — four `idm.xfinity.com`, one a typo account `jeff.lewen@comcast.net`. Makes the vault ask you to choose at login. | CLAUDE *(needs one unlock)* | 08-19 | The plan says **"Do this first next session."** |
| 4 | **Full-disk encryption OFF on both drives — RE-VERIFIED 2026-08-20 05:44.** `Get-BitLockerVolume`: `C:` and `D:` both **FullyDecrypted**, ProtectionStatus **Off**, 0% encrypted. `Confirm-SecureBootUEFI` = **False**. `Get-Tpm`: TpmPresent/TpmReady/TpmEnabled all **True** — the TPM is fine, Secure Boot is the blocker. | **JEFF** | 08-19 | One BIOS trip on the next reboot to turn Secure Boot ON; Device Encryption then becomes available. Nothing for me to do until then. |
| 5 | **Tier-2 password rotation** — ~190 weak/reused of 548. | **JEFF** | 08-19 | Rotate as he logs in, never a marathon. |

## 🟠 P2 — SECURITY COVERAGE SILENTLY DEGRADED

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 1 | ~~**Weather Underground API key exposed in `functions/api/weather.js`.**~~ 🛑 **CLOSED 2026-08-23 BY JEFF'S EXPLICIT DECISION — DO NOT TOUCH IT AND DO NOT RE-RAISE IT.** Jeff, verbatim: *"Just leave the weather key alone don't do anything to it and take it off the list."* **`functions/api/weather.js` was NOT modified.** | ✅ closed 08-23 by Jeff | was flagged 08-16 | **Why this is a reasonable call, so nobody "helpfully" reopens it:** the key has been in public git history since 08-16 and **cannot be un-published** — rotation, not deletion, was ever the only real fix; the station `KTNWHITE21` is public by design on WU's own map; and the realistic worst case is somebody reading his rain gauge. He had already downgraded it P1 → housekeeping on 08-22 for those reasons. ⚠️ **Practical trap that made "just delete the fallback" risky anyway:** the line is `const WU_KEY = (env && env.WU_API_KEY) || '<hardcoded>'` — deleting the fallback takes weather **DARK** unless `WU_API_KEY` is set in Cloudflare Pages, which could not be confirmed (the dashboard session has expired and and although **Jeff says a 10-YEAR Cloudflare token exists**, it is not on this PC — see #66; entering his password is not something I will do). Weather verified working live at 08-23 7:20 PM (`loewenhome.com/api/weather` → 76 °F, real data). **Leave it.** |
| 6 | **`front_right` is armed and healthy but BLIND** — 1 clip since 08-15, zero motion in 26 h, telemetry fine (75 °F, −48 dBm). | **JEFF** | found 08-19 | PIR aim in the Blink app. **Not previously recorded anywhere.** |
| 7 | **Backyard PIR logs zero motion even overnight at 78 °F.** Heat explains daytime; it does not explain cool hours. **Not root-caused.** | **JEFF** | I.13, 08-15 | AI thresholds already fixed and proven — this is the sensor. |
| 8 | **Garage door was standing OPEN at 22:00 on 08-19 and HA cannot tell you.** No garage-door entity exists — re-verified 2026-08-23: **0 `cover.*` entities, 0 garage-door entities** in HA. | **JEFF** (wiring) | 08-19 | Plan already researched and written: `docs/beehive/garage_door_sonoff_mini_dry_setup_2026-08-06.md` (sourced from SONOFF's own docs — **do not re-derive it**). Wire NO+COM in **parallel** with the existing wall button, do NOT use S1/S2, MyQ coexists fine. ⚠️ **BLOCKED ON #64 — read that first, it will stop you halfway up the ladder.** |
| 64 | 🔴 **JOB 2 WILL STALL: Matter is not set up in HA at all.** The 08-06 SONOFF MINI DRY plan ends in *"eWeLink-pair (Inching Mode), **Matter-commission**"* — but checked live 2026-08-23 6:46 PM: **no `matter` domain in `/api/services`, 0 Matter/eWeLink/SONOFF entities, and NO "Matter Server" add-on installed.** Installed add-ons are only: Terminal & SSH, Mosquitto, rtlamr2mqtt, Advanced SSH (error), File editor, VLC, CEC Scanner (stopped), Studio Code Server, Z-Wave JS (stopped), Silicon Labs Flasher (stopped), Traccar, Spotify Connect, Plex (error), Zigbee2MQTT. **So the current plan cannot complete** — Jeff would wire the opener, come down the ladder, and only then find there is nothing to commission to. | **CLAUDE installs, JEFF says go** | found 08-23 | **Do this BEFORE JOB 2, not during:** install the **Matter Server** add-on, then add the **Matter** integration. Matter is the right path here (local, no vendor cloud) — the Sylvania vendor-lock lesson is exactly why not to settle for the eWeLink cloud path. **Not installed tonight without Jeff's go**: it adds a permanently-running service to a modest Beelink J45, which is a resourcing decision, and he was done for the day. See #65 — there is easy room to make. |
| 65 | ✅ **Unused add-ons audited properly 2026-08-23 — "what could it control?" answered per add-on, then acted.** Jeff's rule: *"if they truly are just eating needed space turn them off but no reason to delete if there is a chance we might need them."* **Measured, not assumed:** Beehive has **7744 MB RAM, 4562 MB available** — not tight. **Traccar** was using **397 MB (5.12%)** with zero consumers → **STOPPED, and `boot` set from `auto` to `manual`** via the Supervisor API (`--boot` is not a valid flag in this CLI version; `ha addons options --boot manual` errors, so it was done with `POST http://supervisor/addons/<slug>/options {"boot":"manual"}` → `{"result":"ok"}`). Freed **360 MB** (used 3077 → 2717). **NOT uninstalled.** **Spotify Connect was left RUNNING** — it is **3.5 MB (0.05%), cpu 0** and does not meet the "eating needed space" test; stopping it would be noise. HA verified healthy after: `/api/` 200 in 9 ms, 447 entities, unchanged. | CLAUDE | done 08-23 | **What each COULD control, so nobody deletes something needed:** **Traccar** = self-hosted GPS server — the natural home for **#26 F-250 OBD-II + ESP32**, the Toro, or a trailer, keeping that data local instead of a vendor cloud. Redundant *today* only because `mbapi2020` covers the GLE and `mobile_app` covers the phones. **Silicon Labs Flasher** (stopped) = flashes the Zigbee/Thread coordinator firmware — **keep, a Zigbee coordinator is in daily use.** **Plex** (error) = plausible alternative route for movies → Apple TV, given the SMB fight. **Z-Wave JS** (stopped) = genuinely dead, no Z-Wave radio exists and Z-Wave is on the never-re-propose list. **CEC Scanner** (stopped) = HDMI-CEC TV control; Beehive is not on a TV's HDMI. **VLC is IN USE** (`vlc_telnet` integration loaded) — do not touch it. **Nothing was uninstalled.** |
| 9 | ~~Garage Blink battery "LOW"~~ — phantom entity, DISABLED 08-19. Mains-powered Mini; disarmed state is Jeff's settled decision. | ✅ closed 08-19 | — | Kept so nobody "fixes" it again. |
| 10 | 🔴 **PANIC BUTTON DOES NOT ALERT ANYONE'S PHONE.** The old note ("the app fires the webhook; the automation waits on Zigbee hardware") is **WRONG and was never verified** — read live 2026-08-23 6:38 PM from `packages/hcc.yaml:63-84`. `automation.hcc_panic_button` is **ON**, webhook-triggered (`webhook_id: hcc-panic-button`), references **no Zigbee entity at all**, and runs fine today. What it actually does: turn on `input_boolean.hcc_panic_active` → `light.turn_on` all with `flash: long` → **`persistent_notification.create`** → 30 s delay → boolean off. **There is no `notify.mobile_app_*` call anywhere in it.** So a panic press flashes the lights (useless if nobody is home) and writes a notice **inside HA that nobody sees unless they open the app**. No push, no announce, no siren. On the one feature where reaching a person is the entire point, it reaches nobody. | **CLAUDE builds, JEFF says go** | mis-stated since 07-31, corrected 08-23 | **Both targets exist and are live** (verified against `/api/services`): `notify.mobile_app_jeffs_iphone`, `notify.mobile_app_angelas_iphone`, plus `notify.alexa_media_everywhere`. **Fix is ready to paste** — insert after the `notification_id: hcc_panic` line at 4-space list indent (file is clean LF, no CRLF): a `notify.mobile_app_jeffs_iphone` and `notify.mobile_app_angelas_iphone` call each with `data: push: sound: {name: default, critical: 1, volume: 1.0}` — syntax confirmed against companion.home-assistant.io critical-notifications doc, **not from memory**. ⚠️ **TWO REASONS I DID NOT APPLY IT TONIGHT:** (1) it cannot be feature-tested without firing REAL critical alerts at both phones, and shipping an untested life-safety change is the exact failure this project keeps paying for; (2) the webhook is **`local_only: false`** — internet-reachable — and critical alerts bypass Do Not Disturb, so anyone who learns the webhook ID could ring both phones at 3 AM. **Jeff should decide (a) go/no-go, and (b) whether that webhook should stay `local_only: false`.** Backup of `hcc.yaml` NOT yet taken — the edit was not started. |
| 11 | **Zigbee fleet — HALF IS MOUNTED, not "still in boxes".** ⚠️ **Corrected 2026-08-23 by live count.** The item read *"7 door/window + 5 leak + dongle arrived 08-15, deliberately unopened"*. Actually paired and reporting right now: **3 door/window** (`front_door_contact`, `back_deck_door_contact`, `mailbox_contact` — with `front_door_voltage` 3000, `mailbox_voltage` 3000, `back_deck_door_voltage` 2900) and **3 leak** (`guest_bath_leak`, `kitchen_refrigerator_leak`, `kitchen_sink_leak`, each with battery + tamper + water_leak entities). **UPDATE 2026-08-24 2:50 PM — `Garage Man Door` PAIRED AND NAMED** (`0xa4c138a359d762a5`, DS01 contact). Joined 14:46:20 with Jeff at the door; interviewed OK; first configure attempt failed on a `genPowerCfg` bind timeout and the **retry succeeded** (`Successfully configured`). Battery 100 / 3000 mV, **LQI 65-105** — a healthier link than the front door. HA created the entity_ids from the raw address, so they were **renamed to convention and verified live**: `binary_sensor.garage_man_door_contact`, `sensor.garage_man_door_battery`, `sensor.garage_man_door_voltage`, `binary_sensor.garage_man_door_battery_low`. **Two more paired 2026-08-24 2:52-2:53 PM:** `Garage Door Down` (`0xa4c138efcd1e7c3d`) and `Garage Door Up` (`0xa4c13864378427d2`), both battery 100 / 3000 mV, 🔴 **their join-time LQI (87-116 and 69-94, and Garage Man Door's 65-105) is MEANINGLESS — Jeff confirmed all three were paired sitting right next to the coordinator antenna, unmounted. Those are bench readings at ~zero distance, NOT coverage. Re-measure every one AFTER it is mounted, before the VHB sets.** both `Successfully configured`, all eight entity_ids renamed to convention and verified live. ⚠️ **`Garage Door Down` had a messy join** — it *left the network*, rejoined, and failed interview twice (`DatabaseEntry with ID '9' does not exist`, then `AREQ - ZDO - simpleDescRsp after 10000ms`) before configuring cleanly; both report `definition v0.0.0`. Watch for missing reporting config; a clean re-pair is the fix if it misbehaves. 🔴 **UP vs DOWN was assigned from the ORDER JEFF STATED, not proven by observation — verify by moving the real door and watching which entity flips before anything is automated on them.** So **9 of 12 are in service**; roughly **1 door/window and 2 leak remain** to mount. | **JEFF** (mounting) | 08-15, corrected 08-23 | This IS `docs/NEXT_SESSION.md` **JOB 1**. Use `automation.hcc_zigbee_pairing_mode` (#16) to hold permit-join open instead of racing Z2M's 254 s window — **switch it ON for the job, OFF after.** Z2M verified ready 08-23: bridge `connection_state` on, v2.13.0, `permit_join` off. Mounting the remaining door sensors is also what closes **#38** (`back_deck_door_contact` reading open). |
| 38 | **`back_deck_door_contact` reads OPEN since 08-17 11:41 PM.** ✋ **JEFF ALREADY KNOWS — 2026-08-22: "the door sensor will be fixed when we fix the sensors."** It is folded into JOB 1 (mounting the Zigbee sensors), NOT a live intrusion concern and NOT something to raise with him again. Battery 100%, still reporting — the sensor is alive, it just is not mounted/aligned yet. | CLAUDE *(during Job 1)* | 08-22 | Do not re-report this as an open door. |
| 39 | **NOTHING alerts on a door or window opening.** All 43 automations enumerated by friendly name 2026-08-22: not one is triggered by `binary_sensor.front_door_contact`, `back_deck_door_contact` or `mailbox_contact`. Doors are recorded and visible in the app, but opening one produces **no push, no popup, no announce**. | CLAUDE builds, JEFF says go | found 08-22 | ✅ **THE OPEN QUESTION IS ANSWERED — Jeff, 2026-08-23:** *"we still got all the alarms stuff to do we got all of the sensors door sensors the panic buttons alarm sirens the entire fire detection system still a ton left that will be added."* So this is **NOT** the deliberate "Guardian is life-safety heavy, intrusion lean" call — **the alarm system simply is not built yet, and it IS coming.** The old "ask Jeff before building, it may be deliberate" caveat is retired. ⚠️ The old "Fix #29 first" dependency was **wrong and is dropped** — #29 is clip-archive duplicates and has nothing to do with door alerts. **Build it as part of the alarm subsystem, not as a one-off**, alongside #10 (panic), the sirens and fire detection. `notify.mobile_app_jeffs_iphone` and `notify.mobile_app_angelas_iphone` both exist and are live. |

## 🟡 P3 — THINGS I CAN DO AND HAVE NOT

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 12 | ~~**`beehive-config/` is a STALE SNAPSHOT, not a mirror**~~ — **✅ CLOSED 2026-08-19.** Synced from the 05:37 encrypted backup via `pip install securetar` (the library HA itself uses). configuration.yaml 3,170→7,007 · automations.yaml 10,533→24,096 · hcc.yaml 22,608→23,263 · `codeproject_ai_object` refs **0→20**. Backup copy verified byte-identical to a live code-server fetch. Re-sync recipe in `beehive-config/README.md`. | ✅ closed 08-19 | — | Was 18 days stale and cost an hour that night. |
| 13 | **Dead `Blink Fast Motion Poll` block still in `packages/hcc.yaml`.** Verified still present 2026-08-23 6:41 PM at **line 500** (the old note said 502-517 — the line numbers had drifted, which is why they were re-measured rather than trusted). Disabled, harmless, present. | CLAUDE | 08-19 | **Blocker status changed 08-23 and the note was stale:** it said *"needs Jeff's call to relax the rule, or the Terminal unblocked"* — **the Terminal add-on IS unblocked** and was used throughout the 08-23 session, so §17 PART K is satisfied and this is no longer rule-blocked. **It is now CAMERA-FREEZE-blocked instead**: `Blink Fast Motion Poll` is a camera automation, and `docs/CAMERAS_CLOSED_2026-08-22.md` says *"Do NOT re-enable it"* and permits no camera-automation change unless `Verify-CameraStreams.ps1` FAILS or Jeff asks. It passes. **Deleting dead code is not worth touching a frozen, working stack — leave it.** |
| 14 | ~~**`recorder: purge_keep_days: 45` not set**~~ — **✅ ALREADY SET.** Live `configuration.yaml` lines 120-121 read `recorder:` / `purge_keep_days: 45`. **FOURTH stale item found tonight — and this one I made worse:** when correcting CLAUDE.md item 0c earlier I wrote "still worth doing… retention survives by the happy accident of purging not firing", with the live file already in hand and never grepped. Nothing is being purged because retention is 45 days and the DB is 23 days old. | ✅ closed 08-20 | — | Half-correcting a stale item and leaving a stale recommendation inside the correction. |
| 15 | ~~**`blinkpy` manifest errors ~4/hr, not root-caused**~~ — **✅ ROOT-CAUSED 2026-08-20.** `custom_components/blink/coordinator.py`: `SCAN_INTERVAL = 300` and `_async_update_data` calls `api.refresh(force=True)`. **`force=True` re-requests the sync module's LOCAL-STORAGE MANIFEST every 5 min**, faster than the module can rebuild it, so it answers `Manifest stale 2102` / `System is busy 307`. 12 attempts/hr vs ~4 failures ≈ 1 in 3 — matches the log. **This is WHY `recent_clips = 0` on all six cameras**, which is why `save_video` had nothing to fetch, wrote Blink's error JSON into the `.mp4`, and left the front doorbell frame 2.8 days stale. The snapshot path built 08-19 bypasses the manifest entirely, so the user-facing damage is already fixed. | ✅ root-caused 08-20 | — | Remaining is cosmetic log noise. Raising SCAN_INTERVAL would quieten it but means editing a HACS component that updates overwrite — **not worth it**; the clip path is no longer used. |
| 16 | ✋ **`hcc_zigbee_pairing_mode` — do NOT delete this yet; it is the tool JOB 1 needs.** Re-read live 2026-08-23 6:41 PM. It is **not in `packages/hcc.yaml`** as implied — it is `/config/automations.yaml:546-562`, `id: hcc_zigbee_pairing_mode`. What it does: triggers on `switch.zigbee2mqtt_bridge_permit_join` going `off` for 5 s and turns it straight back on — i.e. it **holds Zigbee permit-join open** instead of making you race Z2M's 254-second window. Currently `off`, which is correct. **`docs/NEXT_SESSION.md` JOB 1 is "mount the remaining Zigbee sensors"** — so this automation should be **switched ON for that job and OFF after**, not deleted beforehand. | CLAUDE | 08-17 | Delete only once #11 is genuinely finished and Jeff says the fleet is fully paired. Its own description already says it: *"DISABLE when sensor installation is done - do not leave the network permanently joinable."* **JOB 1 readiness checked at the same time:** Z2M bridge `connection_state` **on**, version **2.13.0**, `permit_join` **off** — pairing path is ready to go. |
| 17 | ~~No disk/CPU/memory visibility on Beehive~~ — System Monitor added 08-19. 94.3 GiB free, CPU 24 %, 120 °F. | ✅ closed 08-19 | — | |
| 18 | ~~**`hero-cameras.jpg` fake title / ALL SYSTEMS READY panel / six dummy tiles**~~ — **✅ WAS ALREADY DONE 2026-08-06**, commit `1eba07f`. Verified by opening the image 08-19: all three fake elements gone; Blink logo and 2nd Amendment sticker still present per Jeff's explicit call; file is the regenerated 1300×970 landscape banner. **The item sat open for 13 days after it was closed.** | ✅ closed 08-06 | — | Third stale open item found 08-19, after the recorder purge alarm and the backyard AI thresholds. |
| 19 | ~~**Irrigation zone photos — docs contradict each other**~~ — **✅ ALREADY CLEAN. All six opened and looked at 2026-08-20: NO gold frame, NO title, NO tagline on any of them.** `git log --follow` → commit `6913393`, **2026-08-11**, *"Mower sensor: fix the hour meter at the source; **clean the zone photos**"*. Written 08-08, done 08-11, left open 9 more days. **The contradiction dissolves:** CLAUDE.md's *"REAL PHOTOGRAPHS OF JEFF'S ACTUAL YARD… do not regenerate or replace these"* is the operative note; the "fake overlay" note was simply out of date. **Jeff does not need to rule on anything — there is nothing to strip, and these must NOT be touched.** | ✅ closed 08-11 | — | **Why it stayed open: the fix rode along inside a commit whose subject was about the mower hour meter.** Closing a tracked item has to be visible in the commit subject or in this file, or it stays "open" forever. |
| 20 | **Lighthouse JS/CSS minification** — unused-js ~235 KiB, unminified-js ~71 KiB. | **CLAUDE** | 07-31 | Explicitly out of scope; needs restructuring. |

## 🔵 P4 — DECISIONS ONLY JEFF CAN MAKE

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 21 | ~~**Driveway `vehicle` reports Jeff's own parked car at 90.5 % every scan.**~~ ✅ **CLOSED 2026-08-23 — STALE ITEM, THE FILTER WAS ALREADY BUILT ON 08-21 and the list never caught up.** Read live from `/config/packages/hcc.yaml` **line 269**: `{{ obj_type == 'vehicle' and (box_area|float(0)) >= 0.005 and not (camera_key == '301_driveway' and (centroid.x|float(0)) >= 0.70 and (centroid.y|float(0)) >= 0.50 and (centroid.y|float(0)) <= 0.85 and states('device_tracker.gle_350_device_tracker') == 'home') }}`. That is exactly the described behaviour: a vehicle alert is suppressed if it is tiny/far-field (street traffic) **or** sitting in the parking spot **while the GLE's own GPS reports home** — and it **still alerts if the car is AWAY**, which is the stranger-in-the-driveway case. | ✅ closed 08-23 | was 08-14, unbuilt | Found during the 08-23 staleness audit Jeff asked for. The item sat marked "recorded, unbuilt / JEFF" for **9 days after it was actually built**. Cross-referenced with `CAMERA_POPUP_REBUILD_GUIDE.md`, which documents the same filter under "Other things built the same day". **Nothing to do.** |
| 22 | **Night Mode only dims `light.livingroom_cans`.** Bedroom, kitchen/dining and master bath are not in it. | **JEFF decides**, CLAUDE does | 08-14 | All four at ~10 %, or leave the bedroom out? |
| 23 | **Alexa "FF the Commercials" skip distance** not calibrated to 4:40; reduced to one `keyevent 90` and never re-tested live. | **JEFF** (live TV test) | 08-03, **16 days** | |
| 24 | ~~Garage two-location switching~~ | ✅ closed 08-17 | — | Ecoeler YM2108T at $0. Kept so it is not reopened again. |
| 25 | **iPad Air 2 wall display** — polyfill works; HA token persistence + Add to Home Screen + Guided Access unconfirmed. | **JEFF** | 07-21, **29 days** | |
| 26 | **F-250 OBD-II box** (~$30 Veepeak + ESP32) — not bought. | **JEFF** | — | Not urgent. |
| 27 | **Lucky Mike "Smart Stall"** — queued. **"Do not start until Jeff says go."** | **JEFF** | — | |

## Credentials still recorded nowhere (`HCC_ACCESS.md`)

Family app password (only the hash is stored) · HA account · **TP-Link / Kasa — this blocked the
bedroom dimmer for an hour on 08-19** · B-Hyve · LUX · Blink · Amazon · SmartHub.
**Bitwarden now exists. Each is a 30-second Secure Note.**

---

## Honest scoreboard — 2026-08-20 00:22

**28 tracked · 9 closed · 19 open.** *(#28 found tonight — a P1 nobody had ever looked for.)*

Of the 18 open: **11 are Jeff's** (hands, credentials, purchases, decisions) and **2 are mine with
nothing blocking them** — #16 (waits on #11) and #20 (minification, explicitly out of scope).
#13 is blocked by a RULE, not a capability.

## 🔎 FIVE of tonight's "open" items were ALREADY DONE

| item | actually done | sat open |
|---|---|---|
| recorder "purged daily" alarm (0c) | never a problem — measured | weeks, as an EMERGENCY |
| backyard AI thresholds (0b) | before 08-19 | flagged as a live safety gap |
| `hero-cameras.jpg` (#18) | 08-06, commit `1eba07f` | 13 days |
| `recorder: purge_keep_days` (#14) | already in `configuration.yaml` | + I re-recommended it hours earlier |
| irrigation zone photos (#19) | 08-11, commit `6913393` | 9 days |

**That is the real answer to "why does shit sit."** Not blocked, not waiting on Jeff — *already
fixed and never struck off*. Two of the five were closed inside commits whose subject line was
about something else entirely, which is exactly how they stayed invisible.
**Checking before working was worth more than working tonight.**

**Oldest open item: 29 days.**

**Those seven are the real answer to "why does shit sit."** Not blocked. Not waiting on Jeff.
Never picked up — because each session optimised for closing whatever was in front of it and then
writing a summary.

---

## 🚿 IRRIGATION CONTROLLER IS UNPLUGGED — added 2026-08-20

**The Water Hog has been offline since 2026-08-13** (`last_connected_at`
2026-08-13T18:30:52Z, confirmed live from Orbit). Jeff pulled it because of the irrigation
leak, pending the **Orbit anti-siphon valve ordered 08-15 and still not installed**.

**Nothing is broken about B-Hyve control.** Commands cannot land because there is no
controller listening; Orbit's cloud accepts them and has nowhere to send them. Verified:
a `rain_delay` command updated `rain_delay_overridden_at` on the CLOUD record while the
device state never moved. HA's own maintained B-Hyve integration fails the same way, for
the same reason — **do not read that as evidence the API is broken.**

⚠️ **Do NOT re-investigate the B-Hyve WebSocket.** On 2026-08-20 it was tested from the
browser, from Cloudflare, and from a raw Node client with app headers, across three URL
variants — all silent, all because the controller is unplugged. That is expected behaviour.

**Closed the same day — the app was hiding it.** `functions/api/irrigation/index.js`
computed `isConnected = !!( ... || timer.hardware_version )`, and every device record has a
hardware_version, so it could never be false. The card printed "● ONLINE" for the whole
week. Now it shows "● OFFLINE since Aug 13", refuses commands with a reason instead of a
ten-second hang, and `scripts/irr-offline-test.js` (12 checks) keeps it honest.

**Still open, and they unblock each other:**
- [ ] **Install the Orbit anti-siphon valve** (Jeff — hardware, ordered 08-15).
- [ ] **Plug the controller back in** once the leak is stopped, then confirm
      `/api/irrigation` reports `connected: true`.
- [ ] **Then, and only then:** verify a real zone command end to end, and build the
      back-to-back zone queue Jeff asked for on 08-20 ("run zone 1 40min, zone 2 30min,
      zone 5 15min... they run back to back"). B-Hyve's own `change_mode` takes an ARRAY
      of `{station, run_time}`, so the CONTROLLER sequences them — the app does not need to
      stay open. Design is settled; it is not built because shipping control buttons that
      cannot be tested against hardware is exactly what Jeff asked us to stop doing.
- [ ] The per-zone duration prompt **already exists** (1-60 min, defaults to 10). It looked
      broken only because the command behind it never landed.

---

## 🟡 FOUND 2026-08-22 — added the same session, per the rule

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 29 | **Clip archive saves DUPLICATES — ROOT-CAUSED 2026-08-23, and it is worse than recorded.** Not 4 duplicates: **53 of 131 files** are byte-identical copies, incl. **33 consecutive `301_driveway` clips** (1,984,293 B) spanning 08-21 12:16 → 08-22 16:22. Cause is NOT the Blink subscription. `/config/archive_clip.sh` is `cp /config/www/blink_clips/$1.mp4 /config/www/blink_archive/$1_$(date ...).mp4` — it copies a **fixed-name** file under a fresh timestamp on every `codeproject_ai.object_detected`, and **never checks whether the source was refreshed**. Source mtimes prove it: `301_driveway.mp4` frozen **Aug 21 11:26** (exactly the duplicated size), `front_right.mp4` Aug 15, `garage.mp4` Aug 14. | CLAUDE | root-caused 08-23 | Real fix is #61 (restore a clip producer). Independently, `archive_clip.sh` should refuse to copy a source it already copied — that is a 2-line guard outside the camera pipeline. 🛑 **PARKED — `docs/CAMERAS_CLOSED_2026-08-22.md` lists this under "Known-open, deliberately NOT being worked". Jeff closed cameras 08-22: *"you gotta get this thing zipped up… the hours are astronomical."* The rule there is NO camera-automation change unless `Verify-CameraStreams.ps1` FAILS or Jeff asks — it PASSES. This row is REFERENCE ONLY: it records the mechanism so nobody re-derives it. DO NOT ACT ON IT.** |
| 30 | **40-byte `back_left` "clips" — ROOT-CAUSED 2026-08-23.** 14 stubs, not 30, and not only `back_left` (also `301_driveway`, `301_front_doorbell`). All 14 byte-identical: they contain `{"message":"Media not found","code":700}` — Blink's API **error body written into a .mp4**. Mechanism was already documented 08-19: `blinkpy.camera.video_to_file` checks only `response is None` and never `response.status`, unlike `image_to_file` in the same file. The archiver then copies that 40-byte file forward. Source files `back_left.mp4` and `301_front_doorbell.mp4` are **still 40 bytes right now**, frozen Aug 21 12:23 / Aug 19 13:29. | CLAUDE | root-caused 08-23 | Same fix path as #29/#61. A size/`ftyp`-header check in `archive_clip.sh` stops error JSON entering the archive at all. 🛑 **PARKED — `docs/CAMERAS_CLOSED_2026-08-22.md` lists this under "Known-open, deliberately NOT being worked". Jeff closed cameras 08-22: *"you gotta get this thing zipped up… the hours are astronomical."* The rule there is NO camera-automation change unless `Verify-CameraStreams.ps1` FAILS or Jeff asks — it PASSES. This row is REFERENCE ONLY: it records the mechanism so nobody re-derives it. DO NOT ACT ON IT.** |
| 61 | 🔴 **THE VIDEO ARCHIVE HAS RECORDED NOTHING SINCE 2026-08-21 11:26 — and it looks like it is still working.** `automation.ai_camera_scan_on_motion` (the ONLY caller of `blink.save_video`, i.e. the only thing that ever refreshed `/config/www/blink_clips/<cam>.mp4`) was turned **OFF 08-21 12:43** as a "legacy duplicate" of `hcc_snapshot_frame_on_motion`. **It was a duplicate for STILLS, not for VIDEO.** Verified 08-23: the replacement calls only `camera.snapshot` + `image_processing.scan` and writes `blink_clip_frames/<cam>_latest.jpg` — a different path; it never writes `blink_clips/<cam>.mp4`. Meanwhile `automation.hcc_clip_archive` is **still ON** (last fired 08-23 5:37 PM CT) and keeps minting timestamped copies of the frozen files, so the archive **grew by 42 files on 08-21 of which only 4 were distinct**. D: is the ONLY long-term video record (Jeff: *"that is why the clips are in the beast so it can pull them"*) — so there is **no video of the house since 08-21 midday**. | **JEFF decides, CLAUDE fixes** | found 08-23 | Inside the camera freeze — needs Jeff's clear yes. Option A: re-enable `ai_camera_scan_on_motion` (the 08-21 doc says *"Turning it back on breaks nothing"* and that its disable rested on a hypothesis that *"proved WRONG"*). Caveat I found: its wait-loop is `state_attr(cam,'last_record') == last_record_before`, and `last_record` is **null on every camera**, so `null == null` never breaks — it spins all 10 iterations (~30 s) per detection before saving. Option B: add a `blink.save_video` step to the snapshot automation on real motion only, avoiding the legacy chain. **Not changed pending Jeff.** 🛑 **PARKED — `docs/CAMERAS_CLOSED_2026-08-22.md` lists this under "Known-open, deliberately NOT being worked". Jeff closed cameras 08-22: *"you gotta get this thing zipped up… the hours are astronomical."* The rule there is NO camera-automation change unless `Verify-CameraStreams.ps1` FAILS or Jeff asks — it PASSES. This row is REFERENCE ONLY: it records the mechanism so nobody re-derives it. DO NOT ACT ON IT.** |
| 61b | 🔴 **DO NOT simply re-enable `ai_camera_scan_on_motion` — it would re-break the popup frames.** Found 2026-08-23 *after* enabling it (Jeff approved; it never fired, was reverted in 6 min, all 6 `blink_clips` md5s identical to baseline, `Verify-CameraStreams.ps1` ALL GOOD before and after). The automation runs `shell_command.extract_clip_frame`, which is `ffmpeg -i /config/www/blink_clips/{{cam}}.mp4 ... /config/www/blink_clip_frames/{{cam}}_latest.jpg` (configuration.yaml:39) — **the exact same file `camera.snapshot` writes in `hcc_snapshot_frame_on_motion`.** With a STALE clip in `blink_clips`, ffmpeg would overwrite a fresh snapshot with a stale frame, go2rtc would stream that, and the 08-19 "2.8-DAYS-stale doorbell frame" bug returns — now visible on the Apple TV. **Also settled and NOT to be re-litigated:** HomeKit needs a live *stream*, not a clip; that is solved by go2rtc looping the ANNOTATED JPEG into H264 RTSP (08-21, verified live). `docs/beehive/homekit_capabilities_plan_2026-08-14.md:48` explicitly **researched and REJECTED** video clips in HomeKit — *"HA's ffmpeg camera on local MP4 is documented as hanging/freezing."* | **JEFF decides** | found 08-23 | Safe path if the D: video archive is wanted: a clip-capture automation that calls ONLY `blink.save_video` + the archive copy and **never** `extract_clip_frame`, so it cannot touch the frames the popups use. 🛑 **PARKED — `docs/CAMERAS_CLOSED_2026-08-22.md` lists this under "Known-open, deliberately NOT being worked". Jeff closed cameras 08-22: *"you gotta get this thing zipped up… the hours are astronomical."* The rule there is NO camera-automation change unless `Verify-CameraStreams.ps1` FAILS or Jeff asks — it PASSES. This row is REFERENCE ONLY: it records the mechanism so nobody re-derives it. DO NOT ACT ON IT.** |
| 31 | ✅ **CLOSED 2026-08-23 7:35 PM — the "suspicion" was REAL, caught live, root-caused and FIXED.** #31 was logged 08-22 as *"suspicion, not a diagnosis"* after the mailbox missed a real delivery. Found it happening again during the staleness audit: **every Zigbee entity had been frozen for 5.5 hours** (all six devices last reported **19:05 UTC / 2:05 PM CT**, identical timestamps = one bulk event, not six silences). **Root cause, proven not guessed — HA had lost its `zigbee2mqtt/` subscriptions while the broker and HA's MQTT client stayed healthy:** (a) Z2M's **own bridge entities** were frozen 5.5 h too, so it was not device-side; (b) but `rtlamr2mqtt` meters on the **same Mosquitto broker** were live — `water_meter_last_seen` / `gas_meter_last_seen` **0 min ago** — so the broker and HA's MQTT client were fine; (c) **Z2M's own log proved it was publishing the whole time** — `19:30:15 z2m:mqtt: MQTT publish topic zigbee2mqtt/bridge/health … "connected":true,"published":1118`, uptime 208217 s, plus a real device message `18:59:10 topic 'zigbee2mqtt/Back Deck Door' {"battery":100,"contact":false,"linkquality":87,"voltage":2900}` that **HA never ingested**. **FIX:** reloaded the `mqtt` config entry (`homeassistant.reload_config_entry`). **Verified:** all six devices went from 5.5 h stale to **0 min** — contacts, all three leak sensors, and both voltage sensors. | ✅ closed 08-23 | found 08-22, fixed 08-23 | **Same subsystem as #44 and #37.** ⚠️ **Note Jeff's hardware correction:** the J45 has **two separate radios** — one SDR for the water/gas meters, one Zigbee coordinator for the sensors. They are independent, which is exactly why the meters stayed live while Zigbee went blind, and why "one dead means both dead" reasoning would have been wrong. **The alarm system Jeff is building runs on these sensors — 5.5 h blind is not cosmetic.** See #67. |
| 67 | 🟢 **DESIGN NOTE for when the alarm subsystem is built — NOT a fault, and not to be worked yet.** ⚠️ **Reframed 2026-08-23 at Jeff's correction: *"the sensors have to be up first before we can call [it] broken."* He is right and my first draft of this row was wrong** — it called the watchdog broken for not covering a system that does not exist yet. **Only 6 of 12 Zigbee sensors are mounted (#11), and the alarm subsystem — door/window alerts, panic, sirens, fire detection — is not built.** You cannot fault a watchdog for failing to guard something unbuilt. **The observed fact, and only that:** during the 08-23 event `automation.hcc_mqtt_re_subscribe_after_ha_start_zigbee_race_fix` read `last_triggered: never`, because it fires on **HA start** and that event happened 5+ hours into stable uptime with no restart. | **JEFF says when — build with the alarm subsystem** | noted 08-23 | **Keep for the design stage, do not build now.** When the alarm subsystem IS built, a **staleness** watchdog (not a start-time one) would fit: if no `zigbee2mqtt` entity has reported in N minutes **while** `sensor.water_meter_last_seen` is fresh, the Zigbee topic tree specifically is dead. Jeff's two-radio hardware split is what makes that work — the SDR meters are an independent control signal proving the broker and HA's MQTT client are alive. **Interim fix is manual and proven:** `homeassistant.reload_config_entry` on the `mqtt` entry restored all six devices from 5.5 h stale to 0 min on 08-23. Belongs with #10, #39 and the rest of the alarm work, not as a standalone task. |
| 32 | ~~**back_deck_door_contact open 17.8 h**~~ **SUPERSEDED by #38** - that entry is more accurate (used last_CHANGED: open since 08-17 11:41 PM = 4d 14h, not last_updated). Either the door genuinely is open, or the sensor is stuck. | **JEFF** (one look) | found 08-22 | Ask before treating as a fault. |
| 33 | **Guest bath leak sensor battery at 30%** - lowest in the house, and leak sensors are the worst ones to have silently dead. | **JEFF** | found 08-22 | Low-battery alert is armed and covers it. |
| 34 | **Blink battery failure-point experiment RUNNING.** `front_right` (151) and `301_driveway` (146) are deliberately on ORIGINAL cells to find the real failure voltage. **DO NOT replace them or advise replacing them** - running to death IS the experiment. ✅ **RESULT IN — `301_driveway` DIED 2026-08-25 02:16:01 AT 133.** Measured from `blink-battery-log.csv`, not inferred: last live row `02:01:01 v=133 wifi=-45 temp=66`; at `02:16:01` wifi jumped to the **-255 not-reporting sentinel** with a `-100` temp garbage spike, and voltage has been pinned at exactly **135** with temp exactly **66** for 37+ consecutive samples since. Live cameras never hold identical values that long (front_right/back_left/backyard all move), so **the 135 is a frozen corpse value, not a reading.** Decline over its last 2.6 days: **146 → 133, -4.98/day**, accelerating at the end (137 at 23:16 on 08-24 → 133 at 02:01 on 08-25). 🔴 **Blink's own flag reads `ok` on this camera RIGHT NOW, 30+ hours after it died — which is the exact claim this experiment was built to test, now proven with timestamps.** ⚠️ **Note the sequence, cause NOT established:** driveway went silent 02:16, and the whole Blink integration collapsed to `setup_error` 8 hours later at 10:30 (see #71/COST_LEDGER). A dead camera that the integration keeps polling is a plausible trigger; that is an observation, not a diagnosis. **`front_right` (149, -0.51/day) is still running and stays on its original cell.** ⚠️ **`301_backyard` is now falling at -2.82/day (166 → 155) and was never part of the experiment — watch it.** | JEFF decides | started 08-22 | Logger every 15 min; alert fires on failure carrying the last voltage. `Show-BlinkBatteryTrend.ps1`. |
| 35 | **RTSP cameras DEFERRED ON COST.** 2x Tapo C320WS ~$34 ea, verified. **Do not re-pitch.** Blinks stay because those spots have NO MAINS POWER (except back deck). | **JEFF** | deferred 08-22 | `docs/CAMERA_PURCHASE_RTSP_2026-08-22.md` |
| 36 | ~~**Water reading "looks stuck" AGAIN (Jeff, 08-22 ~1 PM)**~~ — **✅ CLOSED 2026-08-22 1:18 PM. PIT RADIO IS HEALTHY. NO WHUD CALL.** `Check-WaterMeter.ps1` was finally RUN (it never had been) and its checks independently re-pulled by hand. **Measured:** `sensor.water_meter_last_seen` 2.0 min old, and its 3 h history shows **82 consecutive RF catches, 15:20Z→18:15Z, every gap 0.5–4.7 min, none over 5 min** — the radio is transmitting continuously, the exact opposite of the 07-28 silence. Gas heartbeat 1.5 min old, so the shared dongle is fine. The reading itself **changed 13× in 24 h** (210483→210661); it had simply been flat for 77 min. **The earlier "sandbox blocked everything" claim was WRONG** — the block was tool-specific. The PowerShell tool refuses a nested `powershell` process; the **Bash tool runs the same script fine**, and Bash+`curl` reaches `192.168.1.66:8123` (one command per call — chained `;`/pipes trip the approval prompt). | ✅ closed 08-22 | — | **New measured fact:** all 13 value changes landed within ~2 min of the top of an hour while the heartbeat fires ~20×/hr, so **this meter batches HOURLY** — tighter than the 08-01 note's "~20 min to ~3 hr". A flat stretch up to ~1 h is the FLOOR of normal here, not a fault. Units: `water_meter_reading` = 0.1 gal. |

**Closed 2026-08-22:** the 08-18 "still owed" battery trend meter - built as
`Log-BlinkBatteries.ps1` + `Show-BlinkBatteryTrend.ps1`, running, alarm tested against a real
Blink reload. It had sat undone for **four days** because the handoff was prose, not a row on this
list. That is why the SessionStart hook now injects this file's item count and staleness.

## 🟡 FOUND 2026-08-23 — added the same session, per the rule

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 38b | ✅ **CLOSED same session — duplicate `go2rtc` startup task.** Two scheduled tasks launched the same exe: `HCC go2rtc camera streams` (boot, SYSTEM, the 08-21 keeper) and `HCC go2rtc Camera Feed` (logon, built 08-15, orphaned when the boot task replaced it). The loser could not bind 8554/1984 and squatted on TCP 8555. Orphan **disabled, not deleted**. Keeper PID 2880 held its original start time throughout — the stack never restarted. `Verify-CameraStreams.ps1` run before AND after: all 6 streams served real frames both times. | ✅ closed 08-23 | — | Also patched the health check, which printed `pid System.Object[]` and still said ALL GOOD with two instances fighting. It now counts instances and names the offending task. Write-up in `docs/incidents/camera_fixes_2026-08-21.md`. **Lesson: when a startup mechanism is replaced, disable the old one in the same session.** |
| 62 | 🟠 **Two pre-existing SMB shares grant `Everyone: Full`** — `Users` → `C:Users` and `OneDrive` → `C:UsersjefflOneDrive`. **RENUMBERED from #39 on 2026-08-23 — the list had TWO rows both numbered 39**, which breaks the "single source of truth" rule. Guest / ANONYMOUS LOGON / `tv` are all `Deny Full` on both, so there is no anonymous path; the exposure is that any account with valid credentials gets whatever NTFS allows across the whole user profile over the LAN. **DEPENDENCY CHECK DONE 2026-08-23 6:35 PM** (the note said to do this first): `Get-SmbSession` **none**, `Get-SmbOpenFile` **none**, `Get-SmbMapping` **none**, and **no script, task or config anywhere in HCC-Scripts / the repo / HCC-secrets references `\301ServerUsers` or `\301ServerOneDrive`** — the only mention is the secrets doc describing them as blocked. The Apple TV uses the **separate** `Movies` + `ClipArchive` shares, so scoping these two cannot affect it. | CLAUDE fixes, **JEFF says when** | found 08-23 | ⚠️ **Honest limit: `File Share` auditing was OFF, so absence of history proves NOTHING.** I turned it ON (`auditpol /set /subcategory:"File Share" /success:enable`) so this becomes answerable instead of guessed — give it a few days and 5140 events will show whether anything ever touches them. **Undo:** `auditpol /set /subcategory:"File Share" /success:disable`. **Then the fix** (one line, reversible): `Revoke-SmbShareAccess -Name Users -AccountName Everyone -Force` and the same for `OneDrive`, then `Grant-SmbShareAccess -Name <n> -AccountName 301Serverjeffl -AccessRight Full -Force`. Not run — this is yours to time. |
| 63 | 🟡 **The Apple TV is STILL being rejected on SMB signing, tonight, after the #55 fix.** `Microsoft-Windows-SMBServer/Operational` Id **1004** *"The server rejected an incorrectly signed message"* — **Client 192.168.1.104 (the Apple TV), User `301ServerGuest`**, at 14:06:54, 17:39:02 and 17:39:29 on 08-23. Also Id **1001** *"client attempted to access the server using SMB1 and was rejected"* at 11:52 and 17:20 — **client not named in the event**. | CLAUDE | found 08-23 | **Not config drift — config verified matching the record:** `RequireSecuritySignature False`, `EnableSecuritySignature False`, `EnableSMB1Protocol False`, `everyoneincludesanonymous 1`, `LimitBlankPasswordUse 0`, `RestrictNullSessAccess 0`, Guest enabled + passwordless. Reading: tvOS probes **Guest** with a signed request, that fails, and it then succeeds on the `tv` account — which is why Jeff's test worked. **Functionally OK, so do NOT "fix" it blind.** Enabled `Set-SmbServerConfiguration -AuditSmb1Access $true` so the next SMB1 attempt names the device (**undo:** same with `$false`). Worth knowing which device still speaks SMB1 — it is likely an old client on the LAN, not the Apple TV. |
| 40 | ✅ **CLOSED 2026-08-23 11:53 AM — Apple TV can now reach the Beast.** VLC installed on the bedroom Apple TV; it auto-discovered `301SERVER` over SMB and Jeff logged in with the dedicated read-only `appletv` account. Shares proven before handover: login OK, real bytes streamed, writes denied, live add/delete/move all verified. Home Assistant now reports **34** apps including `VLC` (after an `apple_tv` config-entry reload — it was serving a stale 33). One-tap `VLC` chip added to `ATV_APPS` in `index.html`; lint clean, smoke passed 374 links / 0 bad / 0 page errors. **Connection details stay out of this public repo — `HCC-secrets/APPLETV_SHARE.md`.** | ✅ closed 08-23 | — | Home Sharing was a dead end and is not coming back: on Windows it exists only in iTunes, Apple dropped third-party DAAP, and 88 of the files are `.avi` which iTunes cannot play. The Apple TV "Computers" screen cannot be pointed at a share by any means. VLC **Favorites** is the shortcut instead. |

## 🟢 CLOSED 2026-08-23 — guest network re-enabled, LAN media opened

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 41 | ✅ **`LoewenGuest` re-enabled on the BGW320.** It had been disabled 08-14 (`f735771`, *"Jeff confirmed nobody uses it"*). Jeff's plan 08-23: put every guest device on the isolated SSID so `Loewen301` carries only him and Angela, then open file sharing behind that boundary. **Only one field changed** — Guest SSID Enable Off→On. Everything else was already correct: `LoewenGuest`, WPA-2 (not WPA3), Internet Only, `192.168.2.0/24`, max 10 clients, password already set. | ✅ closed 08-23 | — | **Trap avoided:** the Basic Options Wi-Fi page warns it applies the 5 GHz settings to ALL radios on save — that would have collapsed the `Loewen301`/`Loewen301-5G` split and resurrected band steering. Used **Advanced Options** instead. Verified after: 2.4 still `Loewen301` ch1 B/G/N, 5 GHz still `Loewen301-5G`, gateway + Beehive 0% loss, HA http 200. |
| 42 | ✅ **LAN media shares opened with no password**, at Jeff's explicit and repeated instruction, with the guest-SSID isolation above as the compensating control. Guest account enabled (blank password), `RequireSecuritySignature` false (guest SMB sessions cannot be signed), `everyoneincludesanonymous=1`, `RestrictNullSessAccess=0`, `Everyone:Read` on `Movies` + `ClipArchive` only. | ✅ closed 08-23 | — | **`Users`, `OneDrive`, `C$`, `D$`, `ADMIN$` are DENY FULL for Guest, ANONYMOUS LOGON and `tv`** — verified a guest read of the `Users` share returns nothing. Shares are **read-only**, so no device on the LAN can delete anything. Full detail + the exact undo commands: `HCC-secrets/APPLETV_SHARE.md` (**not** in this public repo). |
| 43 | **GaragePC is still closed.** Same treatment needs running on that machine if Jeff wants no-password sharing there too — it can't be done from the Beast. | **JEFF decides** | 08-23 | Not started. Only raise it if he asks. |

## 🔴 FOUND + FIXED 2026-08-23 PM — HA was discarding every Zigbee message for 44 hours

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 44 | 🔴✅ **HA stopped consuming Zigbee2MQTT at the 08-21 17:39 CT restart. Leak, door and mailbox sensors were dark for ~44 h.** Every Zigbee entity froze at `2026-08-21T22:39–22:40Z`, the exact HA restart timestamp. **Zigbee2MQTT was never at fault** — its log showed `MQTT publish: topic 'zigbee2mqtt/Front Door' {"battery":100,"contact":true,"linkquality":98}` at 13:48:59 on 08-23 while HA's `binary_sensor.front_door_contact` still read `last_updated 2026-08-21T22:40:35Z`. Published and thrown away. **Fixed by reloading the `mqtt` config entry** (`01KWJEQSGTVYKZ5Q1H47497MZF`). | ✅ closed 08-23 | — | **Verified live at 2:05 PM CT:** front_door off, mailbox off, back_deck_door **on**, all three leak sensors off, front_door battery 100, guest_bath battery 30 — all timestamped `19:05:13Z`. **This supersedes #31** ("Zigbee quiet 12-18h... suspicion only") — it was real, it was HA's MQTT subscription, and it had already been flagged once and not chased. |
| 45 | ~~⚠️ **Two add-ons sitting in Error state:** `Advanced SSH & Web Terminal` and `Plex Media Server`.~~ **CLOSED 2026-08-23 — superseded by #57 and #65, which investigated them.** Neither has EVER been configured and neither has ever run, so neither controls anything. Confirmed again 08-23 against `/api/config/config_entries/entry`: **no `plex` integration and no `ssh` integration exists** among the 61 configured. `Advanced SSH & Web Terminal` is also **redundant** — the separate `Terminal & SSH` add-on (`core_ssh`, v10.4.0) is Running and was used throughout this session. | ✅ closed 08-23 | — | **Left INSTALLED on purpose** per Jeff 2026-08-23: *"no reason to delete if there is a chance we might need them."* Plex remains a plausible future route for movies → Apple TV (see #65). Nothing to do unless Jeff wants Plex configured or the redundant SSH add-on removed. |
| 46 | **Three `image_processing` entities never scan:** `301_front_doorbell`, `front_right`, `garage` — `unknown` since the 08-21 restart. **NOT declared a fault.** Garage motion is OFF by Jeff's decision and the doorbell/front_right limits are documented upstream Blink behaviour (`reference_hcc_blink_upstream_limits`). The other three scan normally (back_left 16:12Z, backyard 10:41Z on 08-23). | CLAUDE — observe only | found 08-23 | **CAMERAS ARE FROZEN.** Do not change anything here unless `Verify-CameraStreams.ps1` fails or Jeff asks. |
| 47 | ~~**"Camera AI is DOWN" notification is misleading.**~~ **CLOSED 2026-08-23.** Root cause: the alarm inferred "AI is dead" from the ABSENCE of detections, which a quiet house also produces. Fixed by asking the AI host directly - new `binary_sensor.camera_ai_server_reachable` (REST poll of `192.168.1.194:32168/v1/status/ping`, 5-min interval) plus a new gate condition on the automation. | CLAUDE | **CLOSED 08-23** | See #59 for the full proof chain. |
| 48 | **HA Core update 2026.8.2 → 2026.8.3 — researched 08-23, then CORRECTED the same evening.** Patch release (Aug 21): **bug fixes only, no breaking changes, no user action required** ([GitHub release](https://github.com/home-assistant/core/releases/tag/2026.8.3), [changelog](https://www.home-assistant.io/changelogs/core-2026.8/)). It touches 27 integrations. 🔴 **MY FIRST PASS SAID "26 of 27 do not apply here." THAT WAS WRONG** — I searched *entity names* for "vizio", found none, and concluded it was not installed. The authoritative source is **`/api/config/config_entries/entry`**, and it shows **61 configured integrations including `vizio` (1x loaded), `dlna_dmr` (2x loaded) and `go2rtc` (1x loaded)** — all three are in this release's fix list. **`vizio` drives `media_player.aud_d426`, a Vizio SOUNDBAR (`device_class: speaker`), which was ON when checked** — and the fix is literally *"Fix Vizio media player crash when volume is missing from audio settings."* So this release **does** fix something on live hardware here. | **JEFF decides when** | badge since 08-21 | **Revised recommendation: worth installing** — it fixes a real crash path on the soundbar, plus dlna_dmr and go2rtc. Still no urgency and still no breaking changes. ⚠️ **Run `Verify-CameraStreams.ps1` IMMEDIATELY after**: go2rtc is load-bearing for the frozen camera pipeline, and an HA restart is the documented way the 08-21 camera work gets silently undone (`CAMERA_POPUP_REBUILD_GUIDE.md`). **Lesson for the next session: check config entries, not entity names, before saying an integration is not installed.** |

## 🔴 ROOT CAUSE + PREVENTION 2026-08-23 — the Zigbee blackout

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 49 | ✅ **ROOT CAUSE FOUND (looked up, not guessed).** The 44 h Zigbee blackout was the **documented HA / Zigbee2MQTT startup race** — if HA finishes loading before the broker and Z2M settle, HA holds a connection that looks alive and never receives device messages. Reported repeatedly upstream (Koenkk/zigbee2mqtt #18170, #19654; hassio-zigbee2mqtt #83; HA community 646572): *"if the MQTT broker is restarted, all zigbee2mqtt devices disappear from HA."* Our evidence matches exactly — every entity froze at the HA restart timestamp while Z2M kept publishing. | ✅ 08-23 | — | **The 08-23 mqtt reload was RESTORATION, not prevention.** Prevention is #50. |
| 50 | ✅ **Two automations built to make this self-heal and self-report.** (1) `automation.hcc_mqtt_re_subscribe_after_ha_start_zigbee_race_fix` — on `homeassistant start`, waits 3 min, reloads the Mosquitto config entry, posts a notification. (2) `automation.hcc_sensor_silence_watchdog_reports_absence_not_events` — every 30 min, fires if any door/leak/meter sensor has said **nothing** for 6 h, pushes time-sensitive to Jeff's phone. | ✅ 08-23 | — | **VERIFIED:** both entities exist and are `on` (checked in `/api/states`, not trusted from the API's "ok"). Watchdog logic proven BOTH ways — 6 h threshold → False/empty on live data; 0 s threshold → True naming all 7 sensors. **NOT YET VERIFIED: the race-fix trigger, because that needs a real HA restart.** Confirm it at the next restart. |
| 51 | ✅ **SessionStart hook now injects LIVE FAULT STATE, not a pointer to a document.** `windows-scripts/hooks/Hook-SessionStart.ps1` queries HA on every session start and prints whether any critical door/leak/meter sensor has gone silent >6 h, plus any pending HA core update. **Proven both ways:** healthy path renders `door/leak/meter sensors all reporting - OK`; a throwaway copy with the threshold flipped printed `*** 7 CRITICAL SENSOR(S) SILENT ***` and named every one. Backup at `Hook-SessionStart.ps1.bak-20260823`. | ✅ 08-23 | — | **This is the fix for "nobody reads the notes."** A briefing that points at files depends on the session choosing to read them. Injected facts arrive whether it reads anything or not. Every watchdog before this waited for an EVENT; a dead sensor produces none. |

## 🟢 FOUND + FIXED 2026-08-23 PM — post-outage session

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 52 | ✅ **The 08-23 morning session's work was never committed.** The 14:42 outage cut it off with everything still in the working tree; HEAD was `b64be51` from 08-22 and nothing was pushed. **`index.html` was the one that mattered** — OPEN_ITEMS #40 recorded the Apple TV VLC chip as done with "lint clean, smoke passed," but Cloudflare Pages deploys **on push**, so the chip existed only on this PC and NOT on loewenhome.com. Declared done, never delivered. | ✅ closed 08-23 | — | Re-ran both gates before committing rather than trusting the note: `lint-app.js` exit 0, `smoke-test.js` exit 0 (374 links / 0 bad, 0 page errors). Committed `2668556`, pushed, and **verified live on both loewenhome.com and toro1-5rz.pages.dev**. |
| 53 | ✅ **Morning Digest had been failing every 7:00 AM** — `UndefinedError: 'water_overnight' is undefined`. Jeff was getting a broken digest daily. **Two attempts, and the first was wrong:** reordering variables inside one `variables:` block changed nothing, because every variable in a single block renders against the same scope and cannot reference its siblings — proven by the identical error after the reorder. Real fix: **split into two sequential `variables:` steps** (data first, then `digest_message`). | ✅ closed 08-23 | — | Verified by reading the **rendered message back out of HA**, not by trusting HTTP 200: full text, no undefined, no None. **Touched no calibration constant and no meter sensor** — `IRR_FLOW`, rates, `SEWER_BASE`/`SEWER_PER_GAL`, garbage/stormwater split all untouched, per Jeff's instruction. Original saved at `/tmp/digest_backup_20260823.json`. |
| 54 | ✅ **`Show-BlinkBatteryTrend.ps1` was burying the experiment's only deliverable.** It printed `>> WENT DARK ... <== the real failure point` **11 times per camera at identical timestamps across all four at once** — integration reloads, not battery deaths. `Log-BlinkBatteries.ps1` GUARD 1 (`$isReload = blank>=2`) and the alarm both refuse to fire on those and stamp the row "ignore this row"; **the reader never had that guard.** Cameras do not fail in unison, and when `front_right`/`driveway` finally die, that one real line would have been lost among ~44 fakes. | ✅ closed 08-23 | — | Fix mirrors the writer's rule exactly: **>=2 voltage cameras blank at the SAME timestamp = reload; one camera blank while others report = REAL failure, still reported.** Discriminator validated against all 476 voltage rows (320 `off`+numeric, 156 `unavailable`+blank, **0 exceptions**); note text was NOT used because it is inconsistent across eras (76 hardened + 2 old wording). **Proven BOTH ways:** live data → 0 false lines, 39 reload windows excluded and disclosed; synthetic single-camera death → `WENT DARK ... LAST VOLTAGE READ: 149` still caught. Both copies synced (HCC-Scripts + repo), backups `*.bak-20260823-1640`, live CSV untouched. **No Blink/HA/camera-config call — read-only on a CSV.** |
| 55 | 🟠 **Apple TV SMB — the media shares WORK; only the blank-password Guest path is still pending a reboot.** Re-verified 2026-08-23 7:24 PM: **`\301ServerMovies` reads 380 entries and `\301ServerClipArchive` reads 132** from the box, and Jeff confirmed in-session *"Got the test worked."* Root cause was the 12 failed logons from 192.168.1.104 (`0xC000006A` wrong password ×4, `0xC0000072` account disabled ×3, `0x80090308 SEC_E_INVALID_TOKEN` ×2 with an empty account name). | **JEFF** (one reboot) | 08-23 | **Why it is not fully closed:** `LimitBlankPasswordUse` reads **0** in the registry but only takes effect after a reboot, and **the Beast last booted 2026-08-23 15:37:54 — BEFORE the value was set** (uptime 3.7 h at check). `gpupdate /force` did **not** make it take effect; a real reboot is required. Jeff deferred it: *"I can't reboot now cause it kills our session."* **Nothing is broken in the meantime** — the `tv` account works, which is the path actually in use. See also **#63**: the Apple TV is still throwing SMB signing rejections as **Guest** while succeeding as `tv`. |
| 66 | ~~🟡 **A 10-year Cloudflare API token exists but is recorded NOWHERE a session can reach it.**~~ ✅ **CLOSED 2026-08-23 7:30 PM — a working token is now stored and documented.** Jeff logged in himself (a session must never type his password) and asked for a token *"so that we don't have to do that again."* The dashboard already held one named **Toro TimeMaster** (`Cloudflare Pages:Edit` + `Account Settings:Read`, all accounts) — confirmed via **View summary before touching it**, so the wrong token could not be rolled. Cloudflare only reveals a token value once at creation, so it was **rolled** to obtain a usable value. **Verified safe to roll first:** the only thing that would consume it, `.github/workflows/deploy.yml`, is **disabled/manual-only and has never worked** — its own comment records that `CLOUDFLARE_API_TOKEN` never existed and produced *"124 failure notices in one week"*; deploys go through Pages' native Git integration. | ✅ closed 08-23 | found + closed 08-23 | **Stored at `C:UsersjefflHCC-secretscloudflare_api_token.txt` (53 bytes) — OUTSIDE the repo, which is PUBLIC.** Recorded in `HCC_ACCESS.md` §3 **by PATH, never by value**, same pattern as `ha_backup_token.txt`. **Proven working, not assumed:** `/user/tokens/verify` → `success: true, status: active`, and it listed project **`toro1`** (prod branch `claude/time-master-project-liq1jw`; domains `toro1-5rz.pages.dev`, `loewenhome.com`, `www.loewenhome.com`). Also corrected §3's *"Dashboard login — NOT recorded anywhere"* row: the browser session **expires**, so scriptable work should use this token, not the dashboard. ⚠️ **Related finding, NOT acted on:** §3's Pages env-var list does **not** include `WU_API_KEY` — which confirms that deleting the hardcoded fallback in #1 would have taken weather **DARK**. #1 stays closed and `weather.js` stays untouched per Jeff. |
| 56 | ✅ **UPS-Guard proven in a real 55-minute lockout.** 13:02 dip 6.3 s → rode through. 14:42:07 mains lost → 45 s WARN "lockout, not a reclose" → **14:43:36 clean shutdown at 91 s, battery 92%**, to preserve runtime for the router. Event **1074** + **6006**, **no Event 41, no new minidump** — every prior power cut left no bugcheck because Windows never got to write one. **Beehive never lost power**: water-meter heartbeat unbroken every 1.5–4.7 min straight through the outage. | ✅ 08-23 | — | This is a far harder test than the 32.48 s plug-pull it was proven on 08-21. Converted what would have been crash #6 into an orderly shutdown. |

## 🔎 DUG UP 2026-08-23 PM — went looking instead of asking Jeff what was broken

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 57 | 🔴 **BOTH "Error" add-ons were never configured — neither has EVER run.** OPEN_ITEMS #45 logged them on 08-23 as "not investigated." Read their own logs: **Advanced SSH & Web Terminal** → `FATAL: Configuration of this app is incomplete. Please be sure to set at least an SSH password or at least one authorized key!` → `fatal: stopping the container.` **Plex Media Server** → `FATAL: Plex requires a claim code on the first run!` → `s6-rc: warning: unable to start service init-plex: command exited 1`. Identical class: installed, never finished, dies at every boot. Both have **Start-on-boot + Watchdog ON**, so they retry and FATAL on every single restart. | **JEFF decides** | found 08-23 | **The real cost is not the add-ons — it is that two permanent false Error badges train the eye to ignore the Error indicator**, so a failure that matters looks identical. Same alert-fatigue class that got Blink disarmed for 48 h. Three options, all cheap: (a) finish config — SSH needs a password/key, Plex needs a claim code from plex.tv/claim + Jeff's Plex login; (b) **uninstall** — neither is load-bearing (#45), and **Terminal & SSH is already Running**, making the Advanced one redundant; (c) turn OFF start-on-boot so they stop throwing FATAL every restart. **Not touched — needs Jeff's call, and the SSH one is a credential.** |
| 58 | 🟠 **Two HomeKit bridges appear UNPAIRED since the 2026-08-21 restart, and nobody noticed.** Two `HomeKit Pairing` notifications have sat unread since **2026-08-21T22:40:00Z** — the exact restart that also started the 44 h Zigbee blackout (#44). **GLE 350 Lock:21065** → code **[code moved to `HCC-secrets/HCC_ACCESS.md` 08-23 — was exposed in this PUBLIC repo]**; **HCC Home (HASS Bridge)** → code **[code moved to `HCC-secrets/HCC_ACCESS.md` 08-23 — was exposed in this PUBLIC repo]**. HA only posts a pairing prompt for a bridge with no paired controller. Tellingly, **HCC Cameras:21081 has NO such notification and demonstrably works** (feature test PASS + Jeff confirmed the popup 08-23), which is exactly the pattern you would expect if those two lost pairing and Cameras did not. | **JEFF** (needs his iPhone) | found 08-23 | If unpaired, Apple Home / Siri / Watch / CarPlay have had **no** access since Friday to: `lock.gle_350_lock`, `light.livingroom_cans`, `input_boolean.night_mode`, the six irrigation switches, `scene.turn_on_sharky`, the HCC scripts, `alarm_control_panel.blink_loewen301`, backyard temp/humidity. **All 3 bridges report `state=loaded` and NO integration is in a failed state** — `loaded` means the integration started, NOT that a controller is paired, which is exactly why this stayed invisible. ⚠️ **CAMERA FREEZE: not touched.** Re-pairing is Jeff's hands in the Home app. Verify against `docs/beehive/homekit_tracker.md` before any change. |
| 59 | ~~**"Camera AI is DOWN" fired again 2026-08-23 13:30 CT**~~ **CLOSED 2026-08-23 5:45 PM.** Built `/config/packages/hcc_ai_health.yaml` -> `binary_sensor.camera_ai_server_reachable`, and inserted gate condition 2 of 4 on `automation.hcc_camera_ai_server_heartbeat_ai_down_alarm`: `{{ states('binary_sensor.camera_ai_server_reachable') != 'on' }}`. **PROVEN, not assumed:** (a) official HA docs confirm the REST binary_sensor accepts `FALSE`/`TRUE` and `off`/`on` pairs, but the template was hardened to `{{ 'on' if value_json.success else 'off' }}` so it cannot depend on case-matching; (b) the AI server's REAL response bytes (`"success":true`, a genuine JSON boolean) were pushed through HA's own `/api/template` engine and rendered exactly `on`; (c) reachability verified FROM Beehive, not just the Beast (`HTTP 200 in 0.0077s`); (d) `ha core check` = "Command completed successfully"; (e) `rest.reload` brought the sensor live with **no HA restart** - it is the ONLY `platform: rest` entity in the whole config, so nothing else was touched; (f) sensor reads `on`, live gate renders `False` = false alarm suppressed; (g) **down-direction proven** with a throwaway sensor on a dead port (real AI service never touched): entity is not created and the gate renders `True`, so a genuine outage still alarms; (h) HA log shows `Platform rest not ready yet; Retrying in background in 30 seconds` - it self-heals when the AI returns, so there is no permanently-dead-sensor failure mode; (i) `Verify-CameraStreams.ps1` = **ALL GOOD, 6/6**, same PID 2804, before AND after. **Nothing in the camera pipeline was modified** - no go2rtc, HomeKit, scanner, doorbell sensor, popup path or camera entity. Only the notification logic. | CLAUDE | **CLOSED 08-23** | Snapshot committed to `beehive-config/hcc_ai_health.yaml`; the LIVE file on Beehive is authoritative. |
| 60 | ~~🟡 **Recurring `Login attempt failed` from localhost.**~~ **ROOT-CAUSED + CLOSED 2026-08-23 6:36 PM.** It is a **browser tab left open on an HA dashboard containing all six camera cards**, not a security event and not a camera fault. Evidence: the failures arrive in **bursts of six — one per camera, within 0.3 s** (`301_driveway`, `301_front_doorbell`, `front_right`, `back_left`, `301_backyard`, `garage`), on **clock boundaries** — 17:30:01, 18:00:00, 18:15:00, 18:30:01 — which is a refresh timer, not a person. The User-Agent on every one is `Mozilla/5.0 (Windows NT 10.0; Win64; x64) … Chrome/151.0.0.0`, i.e. **Chrome on a Windows PC**, and each URL carries an `?token=` signed camera token that has since expired. HA rejects the stale token and logs it. | CLAUDE | **CLOSED 08-23** | **No functional impact and nothing to fix in HA** — the card re-requests with a fresh token on the next full page load. Closing the tab (or reloading it) stops the log noise. **Deliberately did NOT touch the camera stack to "fix" this** — it is cosmetic and cameras are frozen. Honest limit: the exact tab was not identified (only the terminal tab was in my browser group), but the six-at-once-on-the-half-hour signature plus the Windows-Chrome UA is conclusive as to *kind*. The earlier "expired camera_proxy token being retried" reading was correct; the missing half was **what** was retrying it. Persistent notifications now number **0**, so the 13:00 notification theory is dead. |

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 37 | ✅ **CLOSED 2026-08-23 — the 08-21 meter flapping was the MQTT LAYER, not the meters, and it is the same subsystem as #44.** #37 was logged 08-22 as *"cause never investigated."* Investigated from history, not guessed. **Water and gas went `unavailable` at IDENTICAL timestamps to the microsecond** (e.g. `18:41:26.697366` vs `.697665`) — one publisher, so never an RF or pit-radio matter. Then the decisive check: **`binary_sensor.front_door_contact` (Zigbee→MQTT) flapped at the SAME events ~11 s EARLIER** every time — 18:41:14 vs 18:41:26, 19:03:46 vs 19:03:56, 19:19:41 vs 19:19:52, 19:26:07 vs 19:26:18. Zigbee and the meters share nothing except **MQTT**. So the MQTT integration/broker cycled ~9 times between 18:41Z and 20:45Z on 08-21, dropping every MQTT-sourced entity; the ~11 s offset is availability topics expiring at different rates per platform. | ✅ closed 08-23 | — | **This is the same subsystem as #44/#49.** The 10th and final flap is `22:39:58Z` — the exact HA restart at which HA stopped consuming Zigbee for 44 hours. 08-21 evening was MQTT misbehaving repeatedly and the blackout was its last act, which is worth knowing if it ever recurs. **Not a live fault:** rate collapsed to **1 flap on 08-22** (08:55Z) and **2 on 08-23**, and one of those two (`19:04:36Z` = 2:04 PM CT) is self-inflicted — the deliberate mqtt config-entry reload that fixed #44, which necessarily drops every MQTT sensor for a few seconds. **Nothing touched. No meter, no calibration, no constant** — read-only history queries only, per Jeff's instruction. And per the standing invariant, a meter reading `unavailable` is NOT a fault. |

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 58b | 🔴 **PROVEN 2026-08-23 — two of the three HomeKit bridges are genuinely UNPAIRED.** #58 inferred this from pairing notifications; now read straight out of HA's own storage via the Terminal add-on. The key is `paired_clients` in `/config/.storage/homekit.<entry_id>.state`:<br>`HCC Cameras 01M00H3KVKSQZMFWQ4QT7600CK` → `"paired_clients": {"93b4f1c4-2123-4d1f-9d90-0397281ca7e7": "6eb81aa6dd…"}` → **PAIRED** (this is why the Apple TV popup works — feature test PASS + Jeff confirmed 08-23).<br>`HCC Home 01M02ZS35DG2EG8QE57HJEW2ZR` → `"paired_clients": {}` → **NOT PAIRED**.<br>`GLE 350 Lock 01M02ZS359DGQEAZPWEMN8N61S` → `"paired_clients": {}` → **NOT PAIRED**. | **JEFF** (needs his iPhone) | proven 08-23 | **Lost since 2026-08-21T22:40:00Z** — the same restart as the #44 Zigbee blackout. Gone from Apple Home / Siri / Watch / CarPlay: `lock.gle_350_lock`, `light.livingroom_cans`, `input_boolean.night_mode`, `scene.turn_on_sharky`, `script.hcc_good_night`/`hcc_skip_commercial`/`hcc_open_sling`/`hcc_resume_fire_tv`, all six irrigation switches, `switch.gle_350_auxiliary_heating`, `switch.gle_350_pre_entry_climate_control`, `alarm_control_panel.blink_loewen301`, `sensor.backyard_temperature`/`_humidity`. **All three bridges report `state=loaded` and no integration is failed — `loaded` means the integration started, NOT that a controller is paired. That is exactly why this stayed invisible for two days.** **FIX (Jeff's iPhone — HomeKit pairing requires the controller to initiate; it cannot be done from a shell):** Apple Home → **+** → Add Accessory → *More options…* → pick the bridge → enter the code. **GLE 350 Lock = **[code moved to `HCC-secrets/HCC_ACCESS.md` 08-23 — was exposed in this PUBLIC repo]**** · **HCC Home = **[code moved to `HCC-secrets/HCC_ACCESS.md` 08-23 — was exposed in this PUBLIC repo]****. Both codes are live in HA's own pending notifications. ⚠️ Do NOT touch the Cameras bridge — it is paired and working. |

## 🟡 FOUND 2026-08-24 — added the same session, per the rule

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 68 | 🔴 **`last_reported` IS NOT A LIVENESS SIGNAL FOR MQTT ENTITIES — the "6 CRITICAL SENSORS SILENT" alarm is false by construction.** Verified in HA's own source (`homeassistant/components/mqtt/entity.py`): `_message_callback` snapshots tracked attributes and calls `write_state_request` **only** `if attributes is not None and self._attrs_have_changed(attrs_snapshot)`. No changed value → no state write → `last_reported` never moves. **Proven live on this box, not just read:** the 14:12 Front Door message carried `contact`, `battery`, `battery_low` and `voltage` on one topic; only `contact` had changed, and only `binary_sensor.front_door_contact` updated while the other three stayed frozen at 1122 min. Same again at 14:19 — `sensor.guest_bath_leak_battery` updated while `binary_sensor.guest_bath_leak_water_leak` (still dry, unchanged) did not. Control: Blink entities show `reported 0.1m / changed 1.2m`, so `last_reported` works normally for non-MQTT platforms. ⚠️ The water meter is **not** a valid control here — `rtlamr2mqtt` runs `-unique=true` and only republishes on change. | CLAUDE | found 08-24 | **What this invalidates:** (a) the SessionStart hook's silent-sensor banner — it fires whenever the house is quiet, which is most of the time; (b) **#50's `hcc_sensor_silence_watchdog`**, built 08-23 on the same metric — flipping its threshold proved the plumbing, not the signal; (c) **#31 and #44 are NOT disproven but are NOT proven** — their key evidence (a `Back Deck Door` publish at 18:59:10 with `contact:false` that "HA never ingested") is exactly what this artifact produces, since that sensor already read open. **Do not re-close #31/#44 as settled without a metric that survives this.** **Real fix available:** Z2M runs `last_seen: "disable"`, so payloads carry no timestamp; setting `last_seen: 'ISO_8601'` puts a changing value in every message and makes staleness genuinely measurable. Not changed — Jeff's call. |
| 69 | 🔴 **ZERO ZIGBEE ROUTERS — 4 of 6 devices below Z2M's own Low-LQI threshold, and 2 sensors are unreachable.** Read straight off the Z2M dashboard 2026-08-24: **Devices 6 · Router 0 · End device 6 · Low LQI 4 (<50)**. Every sensor is a battery `EndDevice` with a direct link to the coordinator (TI `ZStack3x0`, ch 25, PAN 42284) — there is nothing to relay through. Measured LQI: Guest Bath Leak **163**, Back Deck Door **109→61** (dropped when moved), Front Door **0→65** (was delivering at LQI 0), Kitchen Refrigerator Leak **47**, Kitchen Sink Leak **14**, Mailbox **0**. **Silent since 08-23 19:34:18 — which is the cached-republish timestamp, not a real transmission: `Mailbox` (Z2M has received 2 real messages from it in 3 days) and `Kitchen Sink Leak` (zero).** Both are joined and known-good on battery (100% / 90%); they simply cannot be heard. | **JEFF** (placement/hardware) | found 08-24 | **This blocks JOB 1 from succeeding, not from starting:** mounting the remaining sensors into this network just adds more devices at LQI 0. The signal falls off front-to-back, consistent with the coordinator sitting toward the rear of the house. The fix is already budgeted in `docs/lighting/HCC_Lighting_Plan.html` — **mains-powered Zigbee plugs are routers**; that is the documented reason they are on the list ("the switch was only being asked to repeat the mesh — a job a $10 plug does better"). ⚠️ **Never name a part or price from memory — verify in-session.** Kitchen Sink at 14 vs Kitchen Refrigerator at 47 a few feet apart is worth a physical look (cabinet/metal in the path) before buying anything. 🔴 **SUPERSEDED 2026-08-26 — DO NOT PITCH ZIGBEE PLUGS. Jeff already solved the power side himself:** *"I changed the need for the plugs. I have several of the USB zigbee extenders ordered and I have a ton of the old iPhone charger cubes so I can put those in anywhere I have a plug."* **USB Zigbee repeaters + iPhone cubes he already owns = $0 for power**, versus $30.99 for the ThirdReality 4-pack. An old iPhone cube is 5 V 1 A and a Zigbee repeater draws roughly a watt, so they are hugely over-specified. ⚠️ **ACCEPTANCE TEST WHEN THEY ARRIVE, because cheap Tuya repeaters have a mixed record for dropping child devices (the same fault that killed Enbrighten 43080 off the list):** pair ONE, then check the Z2M dashboard — **Router count must go 0 → 1.** If it still reads Router 0 it is an end device and the wrong part. Then place it between the coordinator and the garage and watch whether `Garage Door Down` comes off LQI 0. 🔴 **I WROTE THAT THE MAILBOX COULD NOT BE FIXED. JEFF CORRECTED ME THE SAME HOUR AND HE IS RIGHT — CORRECTED IN PLACE 2026-08-26 11:45 AM.** My reasoning was about DISTANCE and ignored MATERIAL. Jeff: *"if I put a extender outside it 35 ft to the mail box and I think it will pick it up if it doesn't have to go through the brick house."* **Brick is one of the worst materials for 2.4 GHz** (worse still when damp); the mailbox link has been fighting the brick wall, not the distance. **35 ft of open air is trivial for Zigbee** — outdoor line-of-sight is well over 100 ft. Going AROUND the wall instead of THROUGH it is a different problem. ✅ **And the last practical objection is gone too: Jeff already has a bubble-cover outdoor outlet on the FRONT of the house**, so the repeater and cube stay dry. **THE SEQUENCE, in order:** (1) repeater + iPhone cube into the covered front outlet, confirm Z2M **Router 0 → 1**; (2) **re-pair the mailbox** with permit_join on, standing at the mailbox — it has been silent since 08-23 19:34 at LQI 0, so it is almost certainly ORPHANED, and a battery end device does not go shopping for a better parent on its own; (3) read its LQI — off 0 means the link exists, above 50 means it will hold. A strong node at the front may help `front_door` as well. **The garage still needs its own repeater — that is a separate placement.** ✅ **JEFF'S CALL, 2026-08-24 3:05 PM — TWO OF THESE ARE EXPLAINED AND ACCEPTED, DO NOT RE-RAISE THEM AS FAULTS:** *"the mail box isn't going to work it is too far; the front door is on a steel door so that's probably what's causing that. I'm not worried about it as long as it's picking up the rest of them."* **Mailbox = distance, accepted.** 🔴🔴 **BUT THE FRONT DOOR HALF OF THIS WAS BUILT ON A MEASUREMENT ARTIFACT — CORRECTED 2026-08-24 3:30 PM.** Z2M's own log shows `Front Door` running at **LQI 94-98 every periodic report all night** (01:49, 03:49, 05:48, 07:48, 09:48, 11:48) and **83 at 13:48**. The `LQI 10` and `LQI 0` this session was built on are the **two readings taken at 14:12:15 and 14:12:17 — the exact moment Jeff opened the door.** A swinging steel slab through the RF path, sampled mid-swing and reported as the sensor's link quality. **So "the closest sensor has the worst link in the house" was never true — it was among the best,** and the steel-door explanation was explaining data that did not need explaining. ⚠️ **Consequence: the claimed "6x improvement from remounting" is ALSO invalid** — it compared an open-door sample against post-remount samples. Undisturbed baseline was 94-98; post-remount readings are 47-76, so **the remount may have made the front door WORSE.** **RULE THIS PROVES: every LQI reading taken while Jeff is standing at the door working it is depressed and must not be used as a baseline. Only quiet periodic reports (roughly hourly, nobody touching the door) are valid.** ⚠️ **An earlier reading in this session inferred the coordinator sat at the BACK of the house from the LQI gradient — WRONG. Jeff confirmed the antenna is at the J45 and the Front Door is the CLOSEST sensor to it.** A session-generated RTL-SDR/USB-noise hypothesis was raised and then **dropped** — the steel door explains the data without it. Do not resurrect it unless new evidence appears. **THE PLAN JEFF SET:** mount the remaining sensors in their real spots, then measure which ones report from where they actually live. *"If they come back like the mailbox, I'll know that the plugs are next."* So the router-plug purchase is **conditional on that result** and must not be pitched before it. |
| 70 | ✋ **PERMIT JOIN IS CURRENTLY ON — switch it OFF when the mounting job is done.** Enabled 2026-08-24 2:47 PM at Jeff's request, together with `automation.hcc_zigbee_pairing_mode_temporary_installing_sensors_08_17`, which re-opens the window each time Z2M's 254 s timer expires. That means it stays open indefinitely until deliberately turned off. | CLAUDE | 08-24 | ⚠️ **#16 records this automation by its YAML `id` (`hcc_zigbee_pairing_mode`), which is NOT its entity_id.** The real entity is `automation.hcc_zigbee_pairing_mode_temporary_installing_sensors_08_17`; calling the `id` silently does nothing and HA still returns HTTP 200. Its own description: *"DISABLE when sensor installation is done - do not leave the network permanently joinable."* |

## 🟢 CLOSED / ADDED 2026-08-24 PM — garage door opener session

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 64 | ✅ **CLOSED 2026-08-24 5:47 PM — Matter Server installed and the Matter integration configured.** Done the documented way (`home-assistant.io/integrations/matter`), not by improvising CLI: added the **Matter integration**, which installs the official Matter Server app itself. Slug confirmed from Beehive's own Supervisor store (`core_matter_server`, "Matter WebSocket Server for Home Assistant Matter support"). **Prerequisite verified FIRST:** IPv6 is `auto` on the active interface `enp1s0` (`wlp3s0` is disabled). Result: "Created configuration for Matter", `config_entry=01M0TYRGMNNXS7701EJ20V2P7T`, `update.matter_server_update` present. | ✅ closed 08-24 | — | ⚠️ **The config flow SITS on a "Success" dialog waiting for a Finish click** — the integration reads as not-loaded until you click it. Also note `{{ "matter" in integrations }}` in a template returned **False even after it was fully loaded** — that template variable is not a reliable test; check `/api/config/config_entries/entry` or the integrations page instead. |
| 71 | 🔴 **GARAGE DOOR OPENER — WIRED AND POWERED, BUT NOT COMMISSIONED. Stopped here 2026-08-24 6:29 PM (dinner).** SONOFF **MINI-D** (`S/N 25482400105228`) mounted at the opener, powered from the ceiling outlet. Opener identified: **Chamberlain `41AC050-2M`, 315 MHz Security+ 1.0**, purple learn button — plain dry contact, matching Jeff's 08-05 bridge test. **Terminal block (4 across: RED · WHITE · WHITE · GREY), worked out from Jeff's photos — DO NOT RE-DERIVE:** RED + the WHITE holding **one** wire = wall button → MINI-D `NO`/`COM`; GREY + the WHITE holding **two** wires = the two photo eyes. Grey carries a white/black-stripe **and a red** (an eye run extended with bell wire — that red is NOT a button wire). `NC`/`S1`/`S2`/`DC+`/`DC-` empty. | **JEFF** (phone) then CLAUDE | 08-24 | 🔴 **BLOCKER: commissioning needs the HA Companion APP on Jeff's iPhone.** HA's own dialog: *"You need to use the Home Assistant Companion app on your mobile phone to add Matter devices."* Runs over **Bluetooth**, so he must be **at the MINI-D**. Phone is capable — `iPhone17,2`, **iOS 26.6.1**, app **2026.7.5**, reporting live. He hit the "download the app" screen, which is what HA shows when it does not detect the app (i.e. Safari, not the app). Code: **`2197-114-6745`**. **Fallback researched, NOT touched:** Beehive has a **`bluetooth` config entry**, and Matter Server can commission over BLE itself — but it may contend with the existing Bluetooth integration for the adapter. Read up first. |
| 72 | 🔴 **INCHING IS UNSOLVED AND IT IS REQUIRED — Jeff has no eWeLink.** The MINI-D's momentary-pulse setting is **eWeLink-only** (`8d53af4`, re-confirmed by `Search-HCC.ps1 "inching"` on 08-24); HA's Matter integration does not expose it. Without it the relay **latches** instead of pulsing, which reads to the opener as the wall button held down and would block the button and MyQ until released. | CLAUDE builds | 08-24 | **Agreed plan, NOT built:** do the pulse in HA — script turns the switch on, waits ~0.5 s, turns it off — **plus a watchdog automation that force-offs the switch if it has been on more than 2 s**, since an HA-side pulse depends on the second command landing where device-side inching self-releases. Keeps the device fully local, no vendor cloud, which suits the Sylvania lesson. |
| 73 | ✅ **FIXED AND LIVE 2026-08-26 2:14 PM — commit `f635e0d`.** **The bug was real and running, not theoretical.** Measured against live Beehive at 14:03, the app's own selectors returned `switch.*garage*`[0] = **`switch.garage_camera_motion_detection`** (the Blink camera's motion toggle — that was the garage BUTTON) and `binary_sensor.*garage*`[0] = **`binary_sensor.garage_man_door_contact`** (the person door, which was standing open — so the app would have read OPEN with the overhead door shut). Guardian Night Check had two more of the same class: `gar` matched `binary_sensor.garage_motion`, so **a car passing the garage camera would report THE GARAGE DOOR AS OPEN**; and `doors` excluded everything containing `garage`, throwing the **man door out of the Doors row entirely**. **Fix:** exact id first (`switch.garage_garage_door_opener` / `binary_sensor.garage_door_down_contact`), filtered pattern only as fallback; `garageIsOverheadDoor()` rejects battery/motion/camera/tamper/spare/linkquality/man_door/lock/update however renamed. | **CLAUDE** | found 08-24, fixed 08-26 | **Verified:** `scripts/garage-entity-test.js` extracts these functions **out of index.html** and runs them against a live `/api/states` dump — **16/16 pass**, camera + both battery flags + man door all rejected. `lint-app.js` clean. `smoke-test.js` passed, 374 links / 0 bad / 0 page errors. Live string check: 4 occurrences at `https://toro1-5rz.pages.dev/` **and** `loewenhome.com`; Cloudflare reports `f635e0d` deploy success. ⚠️ **NOT yet verified: the rendered card in a logged-in browser** — that needs Jeff's eyes or his family password, which a session must not type. **Jeff: open the app's garage card and confirm it reads CLOSED.** 🔎 Gotcha for the next session: checking `…pages.dev/index.html` returns content WITHOUT the new code; the deployed page is served at `/`. I briefly called a successful deploy a failure because of it. |

## ✅ GARAGE DOOR — FULL LOOP PROVEN 2026-08-26 2:04 PM, AND ONE SENSOR IS THE DESIGN

**This is the first time the door's real position has ever been readable in Home Assistant.**
MyQ never gave it locally — it is the capability Jeff was buying when he replaced it.

**The test, both directions, commanded from HA and watched on the sensor (not inferred):**

| | before | command | sensor |
|---|---|---|---|
| open  | `down_contact = off` (CLOSED) | one `switch.turn_on` | **`on` (OPEN) at t+3s**, held through t+21s |
| close | `on` (OPEN) | one `switch.turn_on` | **`off` (CLOSED) at t+15s**, held through t+25s |

Relay read `off` at every sample in both runs — `automation.hcc_garage_relay_auto_release`
released it before the first poll each time. Jeff confirmed the physical door at both ends:
*"Okay door is completely open"*, then *"Great close it and that'll complete the loop"*.

### 🔴 ONE POSITION SENSOR IS DELIBERATE — DO NOT PROPOSE A SECOND ONE
Jeff, verbatim 2026-08-26: *"We don't need another sensor. It would be wasted because if the
door sensor is not down and closed, then it's open — doesn't matter at what stage it's open.
It's still open, so the one sensor should be plenty."*

**Binary by design: `binary_sensor.garage_door_down_contact` `off` = CLOSED, anything else = OPEN.**
Partial-open positions are intentionally not distinguished. The former `Garage Door Up` sensor was
**renamed `Spare Contact 1`** in Z2M the same session (all four entity_ids updated, each returned
`success=true`) specifically so an unmounted device can never be picked up by a `*garage*` pattern.
It is unmounted and Jeff is redeploying it elsewhere.

### Verified against physical reality — the caveat #73 carried since 08-24 is closed
Jeff, verbatim: *"1 yes the garage door is down/closed. the man door is open."* At that moment
`garage_door_down_contact` = `off` and `garage_man_door_contact` = `on`. Both correct. Naming was
previously assigned from the order Jeff stated and never observed; it has now been observed both
statically and through a full door cycle.

### ✅ ALL FOUR CONTROLS WORKING — Jeff, 2026-08-26 2:12 PM
*"I also have reinstall the push button, garage door opener and the outside dial pad opener all
working correctly, with new battery in the 9 Volt outside dial pad."*

The door circuit now has **four independent controls in parallel** — the Chamberlain Security+
wall console, the outside keypad, the handheld remotes, and the MINI-D via HA. Losing any one of
them does not lose the door. The wall button being two bare wires is **closed**.

🔴 **KNOW THIS BEFORE DIAGNOSING A "DEAD KEYPAD".** The wall console has a **LOCK** button
(Security+ vacation lock). Engaging it disables the **radio** controls — keypad and remotes —
while the **wall button and the MINI-D keep working**, because both are wired to the button
terminals, not the receiver. So "the keypad quit but the app still works" is the SIGNATURE OF THE
LOCK BUTTON, not of anything in this install. Check the console before touching the MINI-D.

### Still owed here
- 🟠 **`garage_door_down` sits at LQI 43**, below Z2M's 50 threshold, and `garage_man_door` at 7.
  It works and just proved it, but the garage still has **no Zigbee router**. The ceiling outlet
  that powers the MINI-D is confirmed live and is the obvious spot for a USB repeater — Jeff
  has the charger cubes; the **repeaters are still in transit from AliExpress** (Jeff, 08-26 3:10 PM) — $0, but NOT yet actionable.

## ✅ GARAGE 10 PM SECURE + ALEXA "CHECK GARAGE" — BUILT AND VOICE-VERIFIED 2026-08-26 2:25 PM

Jeff's request, verbatim: *"set an automation for 10 PM that closes the door and turns off the
garage fan and check the main door to make sure it's closed and have it set up to where I tell
Alexa to check garage to make sure it's all closed"* + *"make sure that I can ask Alexa in several
ways and she'll answer correctly — Alexa is the garage secure / Alexa are the garage doors closed
/ Alexa is the garage fan off."*

### The entities, all confirmed live — do not guess at these again
| role | entity | proof |
|---|---|---|
| overhead door position | `binary_sensor.garage_door_down_contact` | `off` = CLOSED. Watched through a full open+close cycle 08-26. |
| person door | `binary_sensor.garage_man_door_contact` | `on` = OPEN, confirmed against the physical door. |
| relay | `switch.garage_garage_door_opener` | self-releases via `hcc_garage_relay_auto_release`. |
| **garage fan** | **`switch.mini_smart_socket11_2_socket_1`** | friendly name *"Garage fan Socket 1"*. **Commands PROVEN**, not assumed: off at 19:20:10 → on at 19:20:14, `last_changed` actually moved, **and Jeff watched the fan stop and restart**. This matters because this house has plugs that report state correctly and ignore commands entirely (the Sylvanias). |

### `automation.hcc_garage_secure_at_10_pm_door_fan_man_door`
🔴 **THE GUARD IS THE POINT: it pulses the opener ONLY when the door reads OPEN.** The relay is a
momentary toggle, not an open/close command — an unconditional 10 PM pulse would **OPEN a closed
garage door every night** and leave it open until morning. Then: fan off, wait up to 45 s for the
contact to confirm, and push **only if something is still not secure**. A silent night means it
worked. The man door has no actuator and can only be reported.

### `automation.hcc_alexa_check_garage` + `input_boolean.check_garage`
✅ **ALL THREE ANSWER BRANCHES ARE VOICE-VERIFIED — Alexa spoke each one aloud and Jeff confirmed
the words.** Each was fired against a real physical state Jeff had actually created, never a mock:

| # | house state at the time | what she said | confirmed |
|---|---|---|---|
| 1 | man door open, fan on | *"the man door is open and the fan is still running"* | 2:25 PM |
| 2 | both doors closed, fan on | *"Both garage doors are closed, but the fan is still running."* | 2:37 PM |
| 3 | all secure | *"The garage is secure. Both doors are closed and the fan is off."* | 4:50 PM |

🔴 **This is a FEATURE test, not a component test** — the distinction this project has paid for
repeatedly (the 08-21 stream check printed ALL GOOD eleven minutes after the popups were dead).
The automation firing and resetting its helper proves nothing; **audible speech, with the right
words, matching live state, is the proof.** In fact branch 1 initially fired, reset cleanly and
logged zero errors while saying **nothing at all** — see the `last_called` gotcha above.

**ONE answer covers all three of Jeff's questions**, deliberately — so two phrasings can never
give conflicting answers. Aliases on the helper: **Garage Secure · Garage Status · Garage Check ·
Garage Doors · Garage Fan Check**.

🔴 **TWO GOTCHAS MEASURED THE HARD WAY THIS SESSION — both would fail silently:**
1. **`notify.alexa_media_last_called` ANNOUNCES TO NOTHING when no one has spoken to an Echo
   recently.** Measured 08-26: every Echo read `last_called=False`, the automation fired, reset its
   helper, logged **zero errors** — and nothing was ever spoken. A textbook green-component /
   dead-feature. Now a templated target with an `or ['media_player.everywhere']` fallback.
2. **`input_boolean` is NOT in `alexa_default_expose`** (that list is climate, cover, fan,
   humidifier, light, lock, scene, script, sensor, switch, vacuum, water_heater). A helper is
   invisible to Alexa until explicitly exposed.

**How to expose an entity to Alexa from a session (the working command — two obvious ones do NOT
exist on this HA):** `homeassistant/expose_entity/expose` → `unknown_command`.
`cloud/alexa/entities/update` → `unknown_command`. **What works:**
`config/entity_registry/update` with `options_domain: "cloud.alexa"`, `options: {should_expose: true}`.
Aliases go on the same command as `aliases: [...]`. Read back with `homeassistant/expose_entity/list`.

### ⚠️ ALEXA WILL NOT ROUTE QUESTION-FORM PHRASES — this is Amazon's wall, not a config miss
*"Alexa, is the garage secure"* never reaches HA. Same reserved-phrase behaviour that defeated
*"Alexa, fast forward"* on 08-03. Native phrasing is **"Alexa, turn on Check Garage"** (or any
alias). Arbitrary wording requires an Alexa **Routine**, which is created in the phone app and
**cannot be created from HA — there is no API for it.** Point each Routine's action at
`Check Garage → Turn On`.

### Owed by Jeff (small)
- [ ] **"Alexa, discover devices"** — the helper is brand new to her.
- [ ] Three Routines if he wants the natural wording: *is the garage secure* / *are the garage
      doors closed* / *is the garage fan off*, each action = **Smart Home → Check Garage → Turn On**.
- [ ] Watch the first 10 PM run.

## ✅ REAL GARAGE-DOOR *COVER* — "ALEXA, OPEN/CLOSE THE GARAGE DOOR" 2026-08-26 2:30 PM

Jeff: *"The only thing she's not responding to — if I say Alexa open garage door she said she
couldn't find a device named garage door."*

**Cause:** `switch.garage_garage_door_opener` was exposed to **`conversation` only, never to
`cloud.alexa`** — Alexa genuinely had no such device.

🔴 **THE FIX WAS DELIBERATELY *NOT* "EXPOSE THE SWITCH".** A plain switch exposed to Alexa has
**no voice-PIN protection** — anyone within earshot of an Echo, including through an open window,
could say "turn on garage door opener" and the garage opens. A `cover` with
`device_class: garage` makes Alexa **require a spoken PIN to OPEN** (closing needs none). Same
convenience, real protection.

**Built:** `cover.garage_door`, a **template cover** created through the config-flow API — no
`configuration.yaml` edit and no Studio Code Server needed.
✅ **This HA offers template helpers for cover, lock, fan, light, vacuum, alarm_control_panel and
more via `POST /api/config/config_entries/flow` with `handler: "template"`.** Worth remembering —
the old assumption that template entities require a YAML include is wrong on this version.

| | |
|---|---|
| state | `{{ 'open' if is_state('binary_sensor.garage_door_down_contact','on') else 'closed' }}` |
| open_cover | pulses the relay **only if the contact reads CLOSED** |
| close_cover | pulses the relay **only if the contact reads OPEN** |
| aliases | Garage · Garage Door · Overhead Door · Big Garage Door |

🔴 **WHY BOTH DIRECTIONS ARE GUARDED — do not "simplify" this.** The relay is a **momentary
toggle, not an open/close command**. An unguarded `close_cover` on an already-closed door would
**OPEN it**. Alexa and the app both send absolute commands, so the guard is what makes them safe.

**VERIFIED — all three, with Jeff watching the physical door** (*"The garage door opened and
closed"*):
1. `close_cover` on a **closed** door → **did not move.** ← the guard, and the important one
2. `open_cover` → OPEN at t+5s
3. `close_cover` → CLOSED at t+15s

**App side:** `garagePick()` prefers `cover` over `switch`, so the HCC app now gets real
OPEN/CLOSE buttons instead of a single trigger — no app change was needed for that. But Guardian
Night Check then counted **the same door twice** (the contact *and* the cover derived from it);
now it prefers the cover and falls back to the contact. `scripts/garage-entity-test.js`: all pass.

## 🟡 FOUND 2026-08-26 — added the same session, per the rule

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 79 | ✅ **CLOSED 2026-08-26 — and it was worse than filed: THREE separate copies of the same broken filter.** Night Check, the Guardian hero cell, and (once built) the Doors card each had their own `*door*` substring match. All three counted the **5 `ai_doorbell_*` camera person-detection sensors** as doors — so Night Check would have reported *"5 doors open"* the moment people walked past the cameras — and all three **excluded the garage MAN DOOR**, a real exterior door, for containing "garage". **Fixed with ONE shared `hccDoorSensors()` used by all three, so they cannot disagree.** | **CLAUDE** | found + fixed 08-26 | Verified against live state via `scripts/doors-entity-test.js`: **4 real contacts** (front door, back deck, garage man door, mailbox), **0 ai_doorbell**, 0 battery flags, overhead door excluded (it has its own card and hero cell — counting it here would report one door twice). lint clean, smoke passed. |

## 🟠 GARAGE MAN DOOR — ALIVE, BUT ON THE THINNEST LINK IN THE HOUSE (2026-08-26 2:36 PM)

🔴 **DO NOT RECORD THIS SENSOR AS FAULTY. IT IS NOT.** I said in-session that it was not
delivering. **Wrong** — Jeff cycled the door and it reported in **under a second**. See
`docs/COST_LEDGER.md`, 2026-08-26.

**Why it looked dead, and why that reasoning was invalid:** all four of its entities carried the
single timestamp `13:53:22` (the HA 2026.8.3 restart republishing cached values) and nothing had
arrived in 5 h 40 m. But **these sensors only transmit on a CHANGE**, and the door was genuinely
open for those 5 h 40 m. An absence of messages proves nothing about a change-driven device.

**What IS real:** Jeff reported the door closed at **2:33 PM** and the state did not follow; a
fresh cycle at **2:35 PM** registered instantly. At **LQI 7 — the weakest device on the mesh —
one message was almost certainly lost.** Marginal, not dead.

**Three-way agreement once it did report:** Jeff, the garage camera frame, and the sensor all read
CLOSED. The camera is a genuinely independent witness for this door and is worth using again —
`GET /api/camera_proxy/camera.garage`, a pure read that touches no camera config.

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 80 | 🟠 **The garage has NO Zigbee router — man door LQI 7, overhead door LQI 43 (Z2M's threshold is 50).** Both work today and both have proven it. But one message on the man door was already lost once, on the one sensor that reports whether an exterior door is standing open. 🔴 **BLOCKED, NOT ACTIONABLE YET — DO NOT TELL JEFF TO GO PLUG ONE IN.** Corrected 2026-08-26 3:10 PM, Jeff verbatim: *"I don't have those Zigbee repeaters yet, they're still on their way from AliExpress."* He owns the **iPhone charger cubes**; the **repeaters are IN TRANSIT** and AliExpress shipping is typically **weeks**. Still $0 when they land. The garage ceiling outlet is confirmed live (it powers the MINI-D). This is Jeff's own stated trigger: *"if they come back like the mailbox, I'll know that the plugs are next."* | **JEFF** (when the parts land) | opened 08-26 · **waiting on shipping** | Never re-propose the ThirdReality plugs — the power side is already solved, see the 08-26 supersede note. After the repeater is in, **re-pair the mailbox sensor** (orphaned since 08-23 19:34) and re-read both LQIs **quietly** — a reading taken mid-door-swing is garbage, see the 08-24 entry. |

## 🔒 SETTLED 2026-08-26 — THE GARAGE / ALEXA PIN STAYS AS IT IS

**Jeff set an Alexa "Open by Voice" PIN and it is the same code as the outdoor keypad and
Mercedes Me.** A session raised the overheard-aloud risk once. **Jeff closed it, and his reasoning
is stronger than the objection:**

> *"When you're as old as I am, it's better to leave it like it is, because remembering another
> PIN is just something else I'll forget."* — and *"nobody can hear me, the only people here are
> Angela and I."*

🔴 **THE FAILURE MODES ARE NOT SYMMETRIC, AND THAT IS THE POINT.** A forgotten PIN locks Jeff out
of his own garage. A shared PIN only matters if a stranger is in the driveway to overhear it, and
there isn't one. **And this house is being built so Angela and his sons can run it if he is gone —
one code the family can remember beats three they cannot.** Unifying these codes is a deliberate
usability-and-succession decision. **It is NOT an oversight and must never be written up as one.**

🔴 **NEVER RE-PROPOSE SPLITTING THESE CODES.** Do not flag it, do not build an alert for it, do not
list it as a finding in a future security pass. **The value itself lives ONLY in
`HCC-secrets\HCC_ACCESS.md` section 8 — never in this repo, which is PUBLIC.** Reference the path,
never the value.

✅ **Checked 2026-08-26, not assumed:** grepped the whole repo for that code. Every hit was a
**false positive** — the mower serial *range* `402082000` and the HTML chart entity `&#128200;`.
**No credential leak.** Worth re-running that check rather than assuming, but also worth knowing
those two hits are benign so the next session does not re-investigate them.

## ✅ APP: GARAGE CARD FIXED + "DOORS & CONTACTS" ADDED — 2026-08-26 4:24 PM

Jeff: *"In the app the garage door section needs to be fixed, the connection is wrong and says 0%,
don't know what that means. Also there is nowhere in the Guardian section that shows the door
sensors, that needs to be added."*

### Both garage-card complaints were real bugs
| shown | why it was wrong |
|---|---|
| **Position: 0%** | HA's **blind position**. A template garage cover with no position template still reports `current_position` 0 when closed / 100 when open, and the card printed it raw. **A garage door is not a window shade — "0%" reads like a fault or a dead battery.** Now shows **Open / Closed**, and only ever appends a percentage if the cover genuinely supports `SET_POSITION` (CoverEntityFeature 4), which a garage opener does not. |
| **Connection: Local (ratgdo / ESPHome)** | **Hardcoded** back when ratgdo was the assumed hardware. **It never was ratgdo** — it is a SONOFF MINI-D relay plus a Zigbee contact. 🔴 **Root lesson: the app cannot see an integration/protocol from `/api/states`, so stating one was always a guess — which is exactly how a wrong string survived unnoticed.** Now describes the **topology**, which IS verifiable from the entities in hand: *"Local · relay + door contact"*. |

### New card: 🚪 Doors & Contacts (Guardian section)
The hero cell only ever showed a **count** — "SECURE" or "2 OPEN". That cannot tell Jeff **which**
door, how its battery is doing, or how long it has been open. The card lists every real contact,
**open ones sorted to the top**, with battery % (red + ⚠️ when its `battery_low` flag is on) and a
compact age since last change.

**Live right now:** back deck · mailbox · front door · garage man door — 4 contacts, all closed, all 100%.

🔴 **Why `hccDoorSensors()` is ONE function and must stay that way:** the same broken `*door*`
substring match existed in **three** places, and they had already drifted. See #79.

## 🔴 HA HEALTH SWEEP 2026-08-26 5:40 PM — THE WATER LEAK ALARM WAS DEAD

Jeff: *"There is a watchdog error in HA that needs to be repaired, can you take a look and check
for any other problems."* The watchdog he saw was the visible corner of a bigger fault.

### 🔴 THREE automations called `notify.jeffs_iphone`, WHICH DOES NOT EXIST
The real service is **`notify.mobile_app_jeffs_iphone`**.

| automation | what was actually broken |
|---|---|
| `hcc_water_leak_alarm_all_zigbee_leak_sensors` | 🔴 **LIFE/PROPERTY SAFETY. Completely dead.** |
| `hcc_sensor_silence_watchdog` | the error Jeff spotted in the UI |
| `hcc_low_battery_alert_all_cameras_zigbee_sensors` | battery warnings, dead |

🔴 **AND IT WAS WORSE THAN A MISSING PUSH.** In HA a `service_not_found` error **ABORTS the
automation**, so every action *after* the bad call never runs either. The leak alarm's second
action was `persistent_notification.create` — **so a wet leak sensor produced NO push AND NO record
in HA. Both channels, silently.**

**Repaired:** service name fixed in all three, **and the local `persistent_notification` moved to
FIRST** so a push failure can never abort the record again. Re-scanned all 41 UI automations from
scratch afterwards: **zero remaining calls to nonexistent services.** A real push was fired through
the repaired service and delivered.

⚠️ **NOT VERIFIED — 5 YAML automations could not be scanned:** `hcc_panic_button`,
`hcc_mower_sensor_sync`, `hcc_severe_weather_alert`, `ai_camera_scan_on_motion`,
`ai_object_detected_notify`. The config API serves **only UI-created** automations, so a 404 there
is expected and is not itself a fault — but **do not claim those five are clean.** They live in
`packages/hcc.yaml` and need a file-level read.

### 🔴 THE SENSOR SILENCE WATCHDOG IS NOW DISABLED — AND MUST STAY OFF UNTIL REDESIGNED
**Repairing its notification would have turned a silently-dead automation into a phone-spamming
false-alarm machine.** Measured at 17:44, its condition was **already TRUE**, and all four
"silent" sensors were behaving **correctly**:

```
front_door_contact            8.9h   nobody opened the front door
guest_bath_leak_water_leak    8.9h   it is DRY
kitchen_refrigerator_leak     8.9h   DRY
kitchen_sink_leak             8.9h   DRY
```

It triggers `time_pattern /30`, **time-sensitive**, so that is a false alarm every 30 minutes all
night. It last fired at **17:30** (erroring on the dead service); the fix landed 17:43 and the next
run at **18:00 would have been its first *successful* false alarm.** Disabled at 17:45.

🔴 **IT CANNOT BE FIXED BY TUNING THE THRESHOLD.** It measures `last_updated`, and **these are
change-driven sensors — a quiet house genuinely reports nothing.** There is currently **no valid
liveness signal**: `linkquality` entities = **0**, and per-device `last_seen` exists only for the
water and gas meters. **The correct fix is Z2M's `availability` feature** (publishes real
available/unavailable per device) — a Z2M config change, no cameras involved. **Until then a
silence watchdog is not buildable, and pretending otherwise is worse than having none.**
*This is the same blind spot already recorded against #50 and in the 08-24 session note.*

### Everything else in the log — checked, and benign
| seen | verdict |
|---|---|
| **12 x `blinkpy` "System is busy" code 307** | **Blink's cloud throttling us.** 🔴 Cameras are FROZEN — reported, not touched. |
| **60 x "Update of `binary_sensor.301_driveway_motion` taking over 10 seconds"** | Same cause. ⚠️ **I theorised a dead camera and TESTED it before saying so — wrong.** Driveway reads -67 dBm and **168 volts, a fresh cell — Jeff changed that battery.** Causation runs the other way: Blink throttling makes the polls slow. |
| **3 x `http.ban` "invalid authentication"** | **Not an intrusion.** Expired `camera_proxy` signed tokens from a dashboard tab left open (Safari 15.6.8 = the wall iPad). Benign. |
| **2 x template `'value_json' is undefined`** | **Mine**, at 14:02:59 — the empty retained MQTT payload from my own `Garage Door Up -> Spare Contact 1` rename at 2:03 PM. One-off. |
| **34 unavailable entities** | Phones asleep + the two PC Alexa apps + `dellmasterbed`. Normal. |

### 🔴 `/api/error_log` IS GONE ON THIS HA — IT RETURNS 404
**Use `/api/hassio/core/logs`.** ⚠️ **Earlier this same session I ran `/api/error_log`, grepped the
404 body, found no matches and told Jeff "no errors."** I read a clean bill of health off a dead
endpoint — the same green-component/dead-feature trap as the 08-21 camera check. **Any log check
must assert the response is real before drawing a conclusion from its emptiness.**

### Heads-up, not a fault
`front_right` is at **149**, under the 150 threshold, so `hcc_camera_battery_at_150` fires at the
next `/6h` boundary (**18:00**). `last_triggered` was `None` only because 12:00 passed before the
automation existed. `input_datetime.camera_batteries_changed` = **2026-08-26**.

## 🔴 THE 150 BATTERY ALERT NEVER FIRED — MY TRIGGER WAS BROKEN (2026-08-26 7:55 PM)

**Jeff caught it the only way it could be caught: he did not get the alert.** *"I didn't get the
6:00 pm battery alert."*

**The alert was correct in every part except the trigger.** `front_right` sat at **149** across the
entire 18:00 boundary (logged 149 at 18:01:02), and both conditions evaluate **TRUE** — verified
step by step through the filter pipeline. Yet `last_triggered` stayed **None**. The automation
never ran.

🔴 **CAUSE: `time_pattern` with `hours: "/6"` and NO `minutes` / `seconds`.** HA's own
documentation **does not state** what unspecified time_pattern fields do — checked, it is simply
undocumented. **So never rely on the default: always set hours, minutes AND seconds explicitly.**

**Fixed:** `hours: "/6", minutes: 0, seconds: 0`, **plus a `template` trigger** so a crossing is
caught the moment it happens instead of waiting up to six hours for a boundary. Then fired with
`skip_condition: false` so the real conditions were evaluated — `last_triggered` set, action path
proven.

⚠️ **THE LESSON IS THE TEST I DID NOT DO.** When this was built earlier the same day it was
verified by evaluating the CONDITION (`would_fire = True`). **That proves the condition, not the
automation.** A trigger that never fires makes a perfect condition worthless — the same
green-component/dead-feature shape as the 08-21 camera check and the `/api/error_log` 404 earlier
today. **An alert is only verified when it has actually ARRIVED.**

## ✅ MOWER PRE-MOW CHECK 2026-08-26 7:50 PM — CLEAR TO MOW

Jeff mows 2026-08-27 and asked whether hours and GPS are ready. Read live from `/api/hours`:

| check | reading | why it matters |
|---|---|---|
| `tracking_paused` | **False** | 🔴 if true, GPS coverage records NOTHING and the day is lost silently |
| `service_mode` | **False** | 🔴 if true, HOURS DO NOT COUNT |
| hour meter | `hours_seconds 20070 / 3600 = 5.575` = reported `hours` | ✅ the 08-11 bug (box sent `hours_seconds`, app read `hours`, 50 days / 5 mows lost) is genuinely fixed |
| GPS | `has_fix: True`, `gps_rx: 4` | locked |
| tilt | `tilt_ref: True`, `upright: True`, `0.5°` | calibrated — no phantom Tip Risk CRITICAL |
| MPU | `i2c_errors 0`, `mpu_reinits 0` | clean |
| last sync | **3 min ago** (parked interval is 300 s) | box is live |
| coverage | `coverage_n: 202` | map intact |
| 12 V battery | 13.16 V | healthy |
| firmware | `fw 1.4.0`, `cfg_rev 2`, `boot_count 12`, `reset_reason 8` (deep sleep, normal) | |

**Non-blocking:** `wifi_rssi -77` where it parks — posts fine now, but that is the margin where a
failed post gets buffered to RTC and replayed, so a late sync is not a fault. `history` has ONE
entry (2026-08-12) — that is simply the last mow; history itself works.

⚠️ **Mid-mow silence is BY DESIGN — do not diagnose it as a fault.** The box runs with **WiFi off**
and posts **nothing** while mowing. It banks locally and dumps totals on the first parked post
afterwards, flagged `mow_ended`.

## 🔒 SETTLED 2026-08-26 — THE 5 AM OVERNIGHT WATER CHECK KEEPS RUNNING. DO NOT DISABLE IT.

**A future session WILL be tempted to switch this off** — the irrigation water is shut off at the
main until the Orbit valve is installed, so the nightly report currently finds nothing, night after
night. **That is not noise. Turning it off would destroy the thing it is collecting.**

**Jeff, 2026-08-26:** *"Just leave it going, because after I put the valve in I will want to test it
a couple of nights to make sure we are all good."*

🔴 **THE WATER-OFF NIGHTS ARE THE CONTROL DATA.** They establish what a genuinely leak-free night
looks like on this meter. When the valve goes in, the post-install nights get compared against a
**continuous** baseline instead of a cold restart. Stopping and restarting the report would leave a
hole exactly where the comparison has to be made.

**Also do not re-open the leak investigation itself.** Jeff, same conversation: *"that was the
reason we did all of the water tests, to make sure the house had no leaks and that the irrigation
valve was the only source. It was all confirmed down to the drop."* The house is CLEARED — see
`reference_hcc_water_signatures` (1.28 gal toilet fill, two icemakers) and the LTS proof
(6-15 gal/night → 1.3 after shutoff). **Cite it; never re-derive it.**

**Still running and verified 2026-08-26 8:05 PM:** `hcc_overnight_water_baseline_1_am` (ran 1:00 AM),
`hcc_overnight_water_check_5_am` (ran 5:00 AM), `hcc_possible_water_leak_idle_flow`, meter live
(`sensor.water_gallons` updated 5 min ago).

### 🔴 WHY THE DEAD LEAK ALARM HID — the most useful thing learned tonight
`hcc_water_leak_alarm` had `last_triggered: None`. **Nothing was lost** — there was no leak, so the
broken service was never exercised by a real event, and all three point sensors read dry.

**But that is exactly why it stayed broken: AN ALARM THAT NEVER FIRES NEVER REVEALS ITS OWN
BREAKAGE.** The only reason tonight's fault surfaced at all is that the *silence watchdog* runs
`time_pattern /30`, so it hit the dead service constantly and raised a repair card. The leak alarm —
sitting quietly, looking perfectly healthy — would have stayed dead indefinitely and shown itself
only on the night it actually mattered.

🔴 **RULE: a quiet alarm is UNVERIFIED, not healthy.** Do not infer that an alert works because it
has never complained. Exercise the notification path deliberately, or say plainly that it is
untested. This is the same family as the 08-21 camera check, the `/api/error_log` 404, and the 150
battery alert whose CONDITION was verified while its TRIGGER never fired — all four in one day.

## 🔴 I SPAMMED JEFF'S PHONE 6 TIMES IN 30 MINUTES — 2026-08-26 8:46 PM

Jeff: *"Man the battery warning is wearing me out, that 6 in 30 min."*

**Cause: a `template` trigger I added at 7:55 PM the same evening**, while fixing the opposite
problem (the alert never firing at all). I fixed a silent alarm into a screaming one in under an hour.

🔴 **DO NOT PUT A TEMPLATE TRIGGER ON A CAMERA ATTRIBUTE.** The voltages were **rock stable** —
149/168/169/155 at every 15-minute sample, zero dropouts — so **it was not the readings moving.**
A template trigger fires on every **false→true transition**, and the **Blink integration rebuilds
these camera entities on its ~5-minute poll cycle**, so `state_attr(...,'battery_voltage')` briefly
returns `none` and the template flips back and forth. **It was re-firing on the POLLING.** 6 pushes
in 30 minutes ≈ one per poll.

**Now:** `time_pattern` only (hours/minutes/seconds all explicit), plus a **hard 12-hour
self-throttle** and a **waking-hours window (08:00–21:00)**. `mode: single`, `max_exceeded: silent`.

🔴 **THE RULE THIS SHOULD HAVE BEEN BUILT WITH:** *an alert whose condition can stay TRUE for days
needs a rate limit BUILT IN.* A low battery is not a one-shot event — `front_right` will sit at 149
until Jeff physically changes it. A trigger that assumes "the condition becomes true once" is wrong
for every threshold alert of this kind. **And a low battery is never a 2 a.m. problem:** the cliff
from 150 takes DAYS (backyard held 148–155 for two weeks before falling to 134 in nine hours).

## 🎯 DESIGN PRINCIPLE FROM JEFF — MAKE THE ALERT RIDE ALONG WITH A JOB HE IS ALREADY DOING

**Jeff, 2026-08-26 8:52 PM, on why once-a-day-at-9-AM is right:** *"That will remind me to put the
new batteries in my pocket, so as I pass each one while mowing I will put the new ones in."*

**He is not using it as a task alert. He is using it as a PACKING LIST.** 9 AM lands before he
goes out, so the useful content is **what to carry**, not an explanation of the discharge curve.
The message was rewritten to match: *"Put batteries in your pocket before you head out. Five to do:
driveway, front right, back left, backyard, and the front doorbell — swap each one as you pass
it."* plus the live readings. The physics stays in #74 where it belongs.

🔴 **THIS IS A GENERAL RULE, NOT A ONE-OFF.** An alert that asks Jeff to make a **special trip**
competes with his day and eventually gets ignored. An alert timed so the work **folds into
something he is already doing** costs him nothing. Same family as his own standing rule that *"if
the GPS is going to be useful it has to work automatically — no pushing buttons"*: **a feature that
depends on him remembering, or on him going out of his way, is not finished.**
**When building any future reminder, ask WHEN he will already be in the right place, and fire it
just before that — not when the condition first becomes true.**

## ✅ RESOLVED THE SAME NIGHT — ONCE A DAY, 9 AM. Jeff's call, and it beat both of my designs.

**Jeff, 2026-08-26 8:49 PM: *"Just set it to 1 time a day."*** Trigger is now
`time: "09:00:00"`, conditions unchanged, automation **ON**.

🔴 **DO NOT "IMPROVE" THIS BACK INTO A TIME PATTERN OR A TEMPLATE TRIGGER.** One fixed daily time
is immune to **both** failures I shipped in one evening — a `/6h` pattern that never fired because
minutes/seconds were unspecified, and a template trigger that fired on Blink's ~5-minute poll
cycle. It also made the 12-hour self-throttle and the waking-hours window redundant, so both were
deleted: **once a day IS the rate limit.** Fewer moving parts, and nothing left to get subtly wrong.

**Why it is the RIGHT resolution, not just the quiet one:** a low battery is a **slow fact, not an
event.** `front_right` sits at 149 until it is physically changed, and the fall from 150 to the
133–134 death takes **days**. One reminder a morning matches the physics of the thing being
measured. *(The superseded plan below is kept only so nobody re-derives it.)*

⏸️ ~~**LEFT DISABLED ON PURPOSE — re-arm it only AFTER Jeff changes the batteries**~~ (he is doing all
four cameras + the doorbell on 2026-08-27 while mowing). Re-enabling tonight would fire once more
at noon tomorrow to report something he already knows and is already acting on. **Re-enable, then
set `input_datetime.camera_batteries_changed`, so the 6-month backstop restarts clean.**

### The pattern across today, stated plainly
Four times today I reported something healthy that was not, and once I made a quiet failure loud:
`/api/error_log` 404 read as "no errors" · a successful deploy called a failure · this alert's
CONDITION verified while its TRIGGER never fired · a live sensor declared dead · and then this
trigger spamming on a poll cycle. **Every one is the same root: checking a proxy for the thing
instead of the thing.** The only two caught from the outside were caught by Jeff — *"I didn't get
the 6:00 pm battery alert"* and *"that 6 in 30 min."*

## 📺 AirTV **ANYWHERE** ARRIVED 2026-08-27 — NOT the AirTV 2 that was ordered

Jeff: *"I think because they took so long to get it here that they may have given me the TV
Anywhere instead of the AirTV 2, isn't that nice?"* **He is right, and it is a straight upgrade.**

| | AirTV 2 (ordered, and what every old note assumes) | **AirTV Anywhere (what he actually has)** |
|---|---|---|
| tuners | 2 | **4** |
| DVR | none — you supply a USB drive | **1 TB built in** (~150 h) |
| external drive | required | 🔴 **NOT SUPPORTED AT ALL** — the rear USB port is a decoy |
| WiFi | — | 802.11ac 2×2 dual-band |
| fee | — | none; a free Sling account unlocks locals |

**Label, recorded so nobody re-photographs it:** P/N **219739** · FCC ID **DKN-ATV3** ·
SN **R5KWRG00731L** · **MAC `88:B6:EE:C7:06:E5`** · Made in India.

### 🔴 A PART WAS FREED — the KESU 500 GB is no longer the DVR drive
Every old note says *"KESU 500GB assigned to the AirTV 2 as its DVR recording drive."* **That plan
is dead** — the Anywhere takes no external drive. **The KESU's documented fallback role becomes the
live one: extra storage on the GaragePC.** Corrected in `BEEHIVE_REFERENCE.md` and
`HCC_INVENTORY.md` the same session, so nobody goes looking for a drive that is spoken for.

### 🔴 `.166` IS NOT THE AirTV — a guess that sat in the network map since August
`NETWORK_MAP.md` listed `.166 / dp-730602E4` as *"possibly the AirTV 2 (?)"*. **Disproven by MAC:**
`.166` is `00-fc-8b-23-64-87`; the AirTV's label reads `88:B6:EE:C7:06:E5`. Different OUI entirely,
and the AirTV **has never joined the LAN** (not in ARP, verified 08-27 8:24 AM). **`.166` remains
UNIDENTIFIED. Do not re-guess it as the AirTV.**

### 🔴 SETTLED 2026-08-27 — THE OTA SCAN CANNOT BE DONE FROM A BROWSER. PHONE ONLY.
Jeff asked *"can't you do it on the beast."* **Checked properly, both signed OUT and signed IN as
his real JEFF profile.** `watch.sling.com` ▸ Settings ▸ **Local Channels** is **informational text
only** — no scan button, no device pairing, no tuner controls — and the page says so in Sling's own
words: ***"Already have AirTV? You can breeze through setup using your smartphone."***
The signed-in view is **word-for-word identical** to the signed-out one. **Do not re-try this from
a browser.** ✅ Side benefit: the beast's Chrome is now signed into Sling, so `watch.sling.com`
works on the 60" Vizio.

⚠️ **Two browser-automation gotchas on watch.sling.com, worth keeping:** (1) **deep links do not
work** — navigating straight to `/dashboard/settings/sub_screen/local_channels` bounces back to the
profile picker every time; you must click through in-app. (2) The **"Who's Watching?" profile
picker** intercepts the first navigation after sign-in, and clicking the avatar CIRCLE did nothing —
clicking the **name label underneath** is what registered.

### Setup — antenna is the only hard prerequisite, and Jeff HAS one
*"I have a nice outdoor antenna."* Sequence, from AirTV/Sling's own docs:
**antenna → coax in → power → Sling app (signed in) → phone on home WiFi →
Settings ▸ Over-the-Air Channels → Scan.** Locals then appear inside Sling on phone, Fire TV,
Roku and the wall iPad.

**Expected-channel reference pinned to Jeff's real coordinates** (`36.476658, -86.660133`, read
from the mower GPS box in his garage) — pull this BEFORE scanning so a short channel list can be
told apart from a bad aim:
`rabbitears.info/searchmap.php?request=result&q=36.476658%2C-86.660133`

### ✅ ON THE NETWORK 2026-08-27 9:08 AM — found via the ROUTER'S device list, not ARP
```
MAC     88:b6:ee:c7:06:e4      <- label reads ...e5; wired and wireless get sequential MACs
IP      192.168.1.184
Name    AirTV3                  <- matches FCC ID DKN-ATV3
Link    Ethernet LAN-1, 1000Mbps full duplex   (through Jeff's switch)
```
**Coax was already run to the Vizio** (which is also the beast's monitor), so the AirTV sits in that
room and Jeff moved the cable over. ⚠️ **Consequence stated up front: the Vizio's own tuner goes
dark.** A 2-way splitter restores both if he ever wants it — try the free move first.

🔴 **HOW TO FIND A DEVICE LIKE THIS — do NOT ping-sweep from the beast.** Two sweeps here produced
nothing and one took >7 minutes; PowerShell **5.1 has no `ForEach-Object -Parallel`**, and devices
that ignore ICMP never land in ARP anyway. **The BGW320-500's Device List at
`http://192.168.1.254/cgi-bin/devices.ha` reads WITHOUT the access code** and lists every client
with MAC, IP, name, link type and speed. That is the authoritative answer in one page load.

⚠️ **I twice printed "FOUND" when the device was NOT present** — a `Select-String ... && echo FOUND`
shell pattern fired on an exit code, and once the grep matched **my own script's echo line**. Both
caught before misleading Jeff, but **never conclude presence from an exit code; print the matched
line itself.**

### 🔎 IT DOES LISTEN LOCALLY — the AirTV 2 "no open API" verdict does NOT transfer
Port scan of `192.168.1.184`: **49152 open** (a real HTTP server — answers, but returns 500 on
`/`, `/description.xml`, `/api`, `/status`) and **8888 open** (accepts TCP, never speaks HTTP —
some non-HTTP protocol). **So the old blanket conclusion is wrong for this generation.** Not chased
further — Jeff wanted to watch TV, not do API archaeology, and he was mowing that day.
**Worth revisiting** if a Home Assistant / Channels-style integration is ever wanted.

**Open questions blocking placement:** where the antenna coax comes inside (the AirTV needs coax
AND network in the same spot), and whether the line has a preamp/power injector that must stay
powered.

⚠️ **The 'closed ecosystem, no open API, cannot feed HA' finding was verified against the AirTV 2 —
treat it as UNVERIFIED for the Anywhere** until this box is actually probed. Different hardware,
different generation; do not carry that conclusion across on the strength of the brand name.

## 📺 "SLING HERE" CHIP — watch Sling ON the device, added 2026-08-27

Jeff: *"I have Apple TV on the Vizio and that has the Sling app on it, which should show all the
locals. What I would like is in the app have the Sling app to where I can open it and watch it from
the app on the kitchen iPad."*

🔴 **I HAD THIS TANGLED AND HE CORRECTED ME.** I had been trying to make Sling's **web** player reach
the AirTV on the beast, and had started suggesting Roku/Fire TV for the 60". **The 60" was never the
problem — the Apple TV's native Sling app already covers it.** The actual gap was the kitchen iPad.

### What existed vs what was missing
The app's `SLING` chip calls `appleTvApp('Sling')` — that is a **REMOTE**: it tells the Apple TV to
open Sling on the big screen. **Nothing opened Sling on the device in your hand.**

🔴 **AND THE CODE COMMENT EXPLAINING WHY WAS STALE.** It reads: *"The wall iPad can no longer install
apps (iPadOS 15 is past what MLB/Sling ship for), so instead of opening an app HERE, we tell the
Apple TV to open it THERE."* **True about the APP, wrong as a conclusion** — Jeff photo-confirmed
`watch.sling.com` playing live TV in that iPad's Safari on **2026-08-05** ("Kitchen TV solved at
$0"). You cannot install the app; **the web player works fine.** Nobody went back and added the
button.

### Built
New **`SLING HERE`** chip beside the existing one, which is now labelled **`SLING TV`** so the two
are not confused (one casts to the TV, one plays here).

🔴 **IT IS AN `<a href target="_blank">`, NOT AN onclick — DO NOT "TIDY" IT INTO ONE.** The wall iPad
runs this app as an **installed PWA**, where **`window.open()` is a silent no-op** — that is the
2026-07-31 incident that left **~20 dead buttons**. This is the **first anchor-based chip** in the
app, so `a.hive-chip{text-decoration:none;color:inherit}` was added to make it match the buttons.

**Verified:** `lint-app.js` clean; `smoke-test.js` passed. ⚠️ Its external-link count stayed at
**374 — that is CORRECT, not a miss**: the smoke test only counts anchors inside `#section-yard`,
and this chip is on HOME. Checked rather than assumed.

### ⚠️ HONEST LIMIT — this gives Sling, but probably NOT the AirTV locals
Sling's **subscription** channels play in the iPad's Safari (proven 08-05). **The OTA locals are a
different matter:** the web player must reach the AirTV **on the LAN**, and browsers refuse to hand
out local IPs — measured on the beast this morning as `localIps: []`, which sent Sling to its
EchoStar relay and produced *"Connection to AirTV was lost [16-31]"*. **Safari has the same
restriction and no flag to change it, so locals-in-browser on the iPad is unlikely.** Not asserted
either way — **Jeff can settle it in 30 seconds: open the chip, Guide ▸ LOCALS, tap a channel.**
The locals unquestionably work on the **Apple TV, phone, Fire TV and Roku** — native apps can see
the LAN.

## 🔴 A FEATURE JEFF PAID FOR WAS DELETED BY MISTAKE — RESTORED 2026-08-27

Jeff: *"I bought the Braves Vision package."* He asked whether MLB could be watched on the iPad the
same way as Sling. **It already could. The button was built, then quietly removed.**

| | |
|---|---|
| `9c415ab` **2026-08-08** | **ADDED** a Braves Vision chip → `https://www.braves.tv`, real anchor, PWA-safe. Commit: *"Jeff bought the MLB Braves Vision package and wanted a one-tap button to it."* |
| `9a2dc3d` **2026-08-14** | **REMOVED** it. Reason given: *"Braves/Sling now open on the Apple TV instead of asking the iPad to install apps it cannot get."* |
| **2026-08-27** | **RESTORED** as `BRAVES HERE`, alongside the Apple TV remote (now `BRAVES TV`). |

🔴 **THE REMOVAL REASONING WAS WRONG, AND THE WRONGNESS IS THE LESSON.** `braves.tv` is a **web
player** — it was never an app install. The genuine problem (MLB.com pushing iPadOS users to the App
Store, which Jeff hit on 08-14) was **generalised onto a link that was working**. A paid-for feature
disappeared for **19 days** and Jeff only found out by asking for it again.

**The two chips are NOT substitutes.** `BRAVES TV` is a **remote** — it tells the Apple TV to open
MLB on the 60". `BRAVES HERE` **plays on the device in your hand.** Replacing one with the other
silently removed the only way to watch on the kitchen iPad. Same now applies to `SLING TV` vs
`SLING HERE`.

🔴 **RULE: when consolidating features, a REMOTE is not a replacement for a LOCAL PLAYER.** Before
deleting a link because "the TV can do it", ask whether the deleted thing served a device the
replacement cannot reach.

⚠️ **Never independently verified, either in 2026-08 or now:** `braves.tv` could not be loaded from
the sandbox in August ("flagged to Jeff to confirm on his device") and cannot be loaded from this
session either. **The chip is proven to produce a correct anchor; whether braves.tv plays on
iPadOS 15 Safari is Jeff's to confirm.** If it pushes an app install, try **ᴀA ▸ Request Desktop
Website** first.

✅ **MLB.com proper is a different story and is NOT restored:** Jeff, 2026-08-14 — *"the Braves
button now asks me to download the app from MLB."* MLB funnels iOS/iPadOS to its native app. That is
why the Apple TV remote exists, and it stays.

**Verified:** `lint-app.js` clean, `smoke-test.js` passed.

## ⌨️ WALL iPAD: "THE KEYBOARD WON'T COME UP" = A BLUETOOTH KEYBOARD IS CONNECTED

**Confirmed by Jeff, 2026-08-27 10:29 AM — it was the keyboard, not Guided Access.**

**Symptom:** tap a text field on the wall iPad, **the cursor appears and blinks**, and **no on-screen
keyboard ever comes up.** Looks like the page or the iPad is broken.

🔴 **CAUSE: iOS suppresses the on-screen keyboard whenever it believes a PHYSICAL keyboard is
attached** — even one that is asleep, flat, or in another room, as long as it is paired and
connected.

🔎 **THE TELL THAT RULES OUT EVERYTHING ELSE: the caret is visible.** A blinking cursor means the
field **has focus**. iOS *always* raises the keyboard for a focused field — the ONLY common
exception is a connected hardware keyboard. **If you can see the cursor, stop suspecting the page,
Safari, or the app.**

**Fix:** Settings ▸ Bluetooth ▸ ⓘ ▸ **Forget This Device**. ⚠️ **Disconnect alone is not enough** —
it re-pairs the moment the keyboard wakes near the iPad and the symptom returns with no obvious
cause. Alternative if the keyboard is to hand: most have an **eject / keyboard key** that toggles
the on-screen keyboard back.

**Ruled out and worth not re-chasing:** Guided Access was the first suspect (it is in use on this
iPad and caused the 08-08 "stuck sideways" bug) — **not the cause here.** AssistiveTouch is enabled
on this iPad and its Device ▸ More ▸ Keyboard can force the keyboard up as a workaround.

## ✅ MLB.TV / BRAVES VISION LOADS AND LOGS IN ON THE WALL iPAD — 2026-08-27 10:28 AM

**Photo-confirmed by Jeff.** The `BRAVES HERE` chip → `braves.tv` → **MLB.com's browser sign-in**
(*not* an App Store push) → signed in, **MLB.TV's full site rendering in iPadOS 15 Safari** with the
account icon present and "Today's Lineup" populated.

🔴 **THIS DISPROVES THE 2026-08-14 CONCLUSION** that the iPad could not reach MLB and therefore
needed the Apple TV remote. Jeff then: *"the Braves button now asks me to download the app from
MLB."* **Going in via `braves.tv` reaches a WEB login instead.** The 19-day-old removal of the
Braves Vision chip was built on that wrong conclusion — see the restoration entry above.

### ✅ VIDEO PLAYS. PROVEN 2026-08-27 10:31 AM. THE QUESTION IS CLOSED.
Jeff sent a 5.6 s 4K video of the wall iPad. **Two frames extracted 3 seconds apart show the stream
ADVANCING**, which is what separates playback from a frozen poster image:

| frame | what is on screen |
|---|---|
| **t = 0 s** | Melton rounding the bases · score bug `TB 2-6` · `P:89` |
| **t = 3 s** | Hicks #34 in the dugout, TIGERS.COM signage · score bug `3-0` · `P:69` |

Different play, different score bug, **pitch count advancing**. `NOW PLAYING` on the sidebar,
`mlb.com` in the address bar, on the **iPad Air 2 running iPadOS 15**.

🔴 **THIS CLOSES A FLAG OPEN SINCE 2026-08-08.** That session added the chip, could not load
`braves.tv` from its sandbox, and wrote *"flagged to Jeff to confirm on his device."* **Nobody ever
confirmed it. Six days later the chip was DELETED on the assumption it could not work.** The
assumption was wrong, and an unverified flag is what let it be deleted.
**RULE: an unconfirmed flag is not permission to remove the thing later.**

✅ **HOW A VIDEO FROM JEFF GETS VERIFIED — reusable.** A `.mov` cannot be viewed directly, but
**ffmpeg ships with go2rtc at `C:\Users\jeffl\HCC-Scripts\go2rtc\ffmpeg.exe`** (not on PATH).
`ffmpeg -i clip.mov -vf "fps=1/3,scale=1000:-1" -q:v 3 out_%02d.jpg` gives frames that CAN be read.
**Extract at least TWO frames and compare them** — one frame proves a picture, two prove motion.

⚠️ ~~**STILL UNPROVEN: whether VIDEO plays.**~~ *(superseded above, kept so the sequence is legible)* Rendering a page is not playing a stream, and iPadOS 15
Safari is the open question. **Test suggested and not yet reported: the free "Watch Now" on Recap
Rundown** — a 45-minute video that proves playback without waiting for first pitch.
**Braves vs Dodgers tonight, `LAD @ ATL` 7:15 PM EDT = 6:15 PM Central.**
**Fallbacks if video fails:** (1) ᴀA ▸ Request Desktop Website; (2) the capture chain whose parts
Jeff already owns — Apple TV → HDMI capture stick → go2rtc → a card in the app, which is
indifferent to what Safari supports.

## 🔋 CAMERA BATTERY MODEL — SETTLED 2026-08-26 (measured, three cameras)

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 74 | ✅ **THE NUMBERS, from HA attribute history — do NOT re-derive these.** **Fresh Blink cells read 170-177.** **Death is 133-134**, measured twice independently: `301_backyard` died **08-15 23:15 at 134**, `301_driveway` died **08-25 02:16 at 133**. `back_left` was swapped preemptively **08-18 at 142** and was still alive. Usable span ~40 points. **Service life on the original January cells: 7 to 7.5 months**, and all three landed within ten days of each other because they went in together. 🔴 **THE CURVE IS A PLATEAU THEN A CLIFF, NOT A SLOPE — never quote a days-remaining figure from current slope.** Backyard sat between 148 and 155 for two weeks, then fell **152 → 134 in NINE HOURS**. The knee is ~150. | ✅ settled 08-26 | — | Source: `/api/history/period` on `camera.*` **attributes** (`battery_voltage`), 07-28 → now, ~6000 rows/camera. ⚠️ **The HA history API defaults to ONE DAY unless you pass `end_time`** — that cost a wrong "there is no history" conclusion this session. ⚠️ Apparent voltage "jumps" of 15-20 points that fall back within hours are **lithium sagging under radio load**, not battery changes; only a jump that STAYS up is a real swap. |
| 75 | ✅ **Alerts built 2026-08-26 — voltage AND calendar, because one camera has no gauge.** (1) `automation.hcc_camera_battery_at_150_change_all_cameras` — checks every 6 h, fires when ANY of the four voltage-reporting cameras is **≤150**, message says change them ALL. Verified live: front_right at 149 → `would_fire = True`. (2) `automation.hcc_camera_battery_calendar_backstop_6_months` — fires at 09:00 when `input_datetime.camera_batteries_changed` is **180+ days** old. 🔴 **The calendar is NOT redundant: `301_front_doorbell` reports no `battery_voltage` attribute at all, so the date is the ONLY warning it will ever give.** | CLAUDE built / JEFF sets the date | 08-26 | ⚠️ **Deliberately separate from `hcc_low_battery_alert`**, which triggers on Blink's `binary_sensor.*_battery` flags. **Those flags are worthless and that is now proven: 30 days of history, ZERO low events across all five cameras — including on `301_driveway`, which had been dead 30 hours and still read `ok`.** Do not "consolidate" these two automations. |
| 76 | 🟠 **THE BACKYARD NIGHT SWEEP COSTS A BATTERY EVERY 3-4 WEEKS — measured, not estimated.** `automation.hcc_backyard_night_sweep` (built 08-22) fires `blink.trigger_camera` every 20 min from 22:00-06:00 = **24 forced wake-ups a night** on a battery camera. Backyard's drain tripled the same day it went live: **08-18→08-22 = -1.0/day; 08-22→08-26 = -2.75/day.** At that rate it goes from a fresh 170 to death in ~3-4 weeks instead of 7 months. | **JEFF decides** | found 08-26 | **NOT re-opening the 08-22 decision** — it exists because the backyard PIR is aimed wrong and produced zero motion events in 25 h, and no software can fix a detection that never happened. This is just the price tag, now that there is one. If the PIR ever gets re-aimed (#7), the sweep can go and the battery cost with it. The voltage alert, not the calendar, is what will catch this camera. |

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 77 | ✅ **CLIP ARCHIVE NOW PURGES — 2026-08-26. This removes ONE of Jeff's two reasons for killing the clip producer (#61).** Jeff, verbatim 08-26: *"I wasn't gonna fill up my drive D with thousands of Blink clips that weren't purging... if they keep them for the exact same time that Blink keeps the cloud but delete the old ones in 14 days and just record keep recording fresh ones then that may be workable."* Built `windows-scripts/Purge-ClipArchive.ps1` + scheduled task **"HCC Clip Archive Purge"** daily 04:30 SYSTEM. Rolling **14-day** window, and it also deletes the 40-byte stubs from **#30** (Blink's `{"message":"Media not found","code":700}` written into a .mp4). **Measured before/after: 156 files → 133, all 23 stubs removed.** Dry-run mode is `-WhatIf`. | ✅ CLAUDE done 08-26 | — | **Scale was never the risk, and the numbers say so:** archive was 218.5 MB with **825 GB free on D:**. At the record's ~2 MB/clip and ~50 events/day a 14-day window is ~1.5 GB — 0.2% of free space. Touches only `D:\HCC-Clip-Archive\*.mp4`, never recurses, never touches Beehive's live `/config/www/blink_clips`. ⚠️ **This cleans stubs AFTER the fact. The real fix is #30's guard in `archive_clip.sh` so a stub is never copied at all — that one is on Beehive and inside the camera freeze.** |
| 78 | 🔴 **JEFF'S SECOND OBJECTION TO #61 IS STILL UNSOLVED — clips arrived blank and slow.** Verbatim 08-26: *"they weren't gonna produce them for 10 minutes and by the time I got them, they were blank."* Both halves are documented: the **blanks** are #30 (`blinkpy.video_to_file` checks only `response is None`, never `response.status`, so Blink's error body lands in the .mp4); the **10-minute lag** is in `ai_camera_scan_on_motion`, whose wait-loop condition is `state_attr(cam,'last_record') == last_record_before` while `last_record` is **null on every camera**, so `null == null` never breaks and it spins all 10 iterations per detection before saving. | **JEFF decides, CLAUDE builds** | 08-26 | ⚠️ **Do NOT re-enable `ai_camera_scan_on_motion` to fix this** — see #61b: it runs `shell_command.extract_clip_frame`, which writes the SAME file `camera.snapshot` writes, so a stale clip would overwrite live popup frames and resurrect the 2.8-day-stale doorbell bug on the Apple TV. The safe shape is a NEW automation calling **only** `blink.save_video` + the archive copy, never `extract_clip_frame`. **Unknown until tested: whether clips now arrive at all** — `local_storage` on the sync module reads **`active`** (proven from blinkpy source: `status = mod["local_storage_status"] == "active"`), so the card is recording; whether `save_video` can retrieve reliably is the open question. |

## ✅ GARAGE DOOR OPENER — WORKING 2026-08-26 1:04 PM

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 71 | ✅ **CLOSED — the MINI-D operates the door from Home Assistant.** Commissioned via Matter from Jeff's iPhone at 12:16 → `switch.garage_garage_door_opener`. **Closed the door at 13:02, opened it at 13:03.** 🔴 **THE FAULT THAT COST AN HOUR, AND JEFF DIAGNOSED IT:** the first wiring used the MINI-D's own thin stranded leads into the opener's lever terminals. Symptoms were a **perfect relay click and no door movement**, while manually shorting the wall-button pair ran the door fine — so the opener, the photo-eyes and the button circuit were all provably good. Jeff's call: *"Then I will use bell wire for both."* He rewired from scratch in matched-gauge bell wire and it worked first pulse. **A thin stranded conductor can sit in a Chamberlain lever terminal looking seated and never touch the terminal metal — twisting it alongside thicker bell wire does not fix that.** Wrong theories chased first, both mine: leads on the wrong terminals, and a photo-eye fault. Jeff disproved the second himself by shorting the button pair and watching the door open AND close. | ✅ closed 08-26 | — | Wiring as built: MINI-D **NO → red**, **COM → white**, both twisted with the existing wall-button conductors into the opener's own RED and single-wire WHITE levers, in parallel. Powered from the ceiling outlet. Opener is a Chamberlain `41AC050-2M`, 315 MHz Security+ 1.0. ✋ **The wall button is still two bare wires — reconnect it.** |
| 72 | ✅ **CLOSED — inching solved WITHOUT eWeLink.** The MINI-D latches; its hardware Inching Mode is eWeLink-only and Jeff has no account. **Solved in HA instead:** `automation.hcc_garage_relay_auto_release` triggers on the switch going `on`, waits **1 second** (the tested value — a 1 s pulse closed the door on the first successful run) and turns it off. **Because it triggers on the STATE, the switch is inherently momentary no matter what turns it on** — the HCC app, HA, Alexa, HomeKit, a script. Nothing has to remember to turn it off. **VERIFIED BY FEATURE TEST, not by existence:** sent ON with no off command — `t+1s on, t+2s off`, `last_triggered 13:03:49`, and the door opened. | ✅ closed 08-26 | — | 🔴 **Why the latch mattered, proven at 12:16:** on first commissioning the relay came up ON and sat closed. **While it is closed the PHYSICAL WALL BUTTON AND MyQ CANNOT TRIGGER THE DOOR EITHER** — the circuit is already shorted. Hence `automation.hcc_garage_relay_stuck_watchdog`: if the relay is ON for 5 s it force-releases and sends a time-sensitive push. An HA-side pulse depends on the second command landing; device-side inching would self-release, this does not. **Do not disable either automation.** |
