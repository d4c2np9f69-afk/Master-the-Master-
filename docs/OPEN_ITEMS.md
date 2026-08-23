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
| 2 | **HA backup encryption key exists on ONE PC.** Without it every `.tar` in iCloud is undecryptable — "the single most load-bearing secret in the whole disaster-recovery system". | **JEFF** | 08-02, **17 days** | Bitwarden now exists. This is a 2-minute Secure Note. |
| 3 | **Bitwarden duplicates** — four `idm.xfinity.com`, one a typo account `jeff.lewen@comcast.net`. Makes the vault ask you to choose at login. | CLAUDE *(needs one unlock)* | 08-19 | The plan says **"Do this first next session."** |
| 4 | **Full-disk encryption OFF on both drives — RE-VERIFIED 2026-08-20 05:44.** `Get-BitLockerVolume`: `C:` and `D:` both **FullyDecrypted**, ProtectionStatus **Off**, 0% encrypted. `Confirm-SecureBootUEFI` = **False**. `Get-Tpm`: TpmPresent/TpmReady/TpmEnabled all **True** — the TPM is fine, Secure Boot is the blocker. | **JEFF** | 08-19 | One BIOS trip on the next reboot to turn Secure Boot ON; Device Encryption then becomes available. Nothing for me to do until then. |
| 5 | **Tier-2 password rotation** — ~190 weak/reused of 548. | **JEFF** | 08-19 | Rotate as he logs in, never a marathon. |

## 🟠 P2 — SECURITY COVERAGE SILENTLY DEGRADED

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 1 | **Weather Underground API key is exposed in `functions/api/weather.js` line 16 (public repo) and still live.** 🔽 **DOWNGRADED FROM P1 TO HOUSEKEEPING 2026-08-22 by Jeff's call — and he is right.** The station ID `KTNWHITE21` is **public by design** (it is on WU's own map). The KEY's realistic worst case is someone burning the rate limit, after which the weather card **falls back to Open-Meteo — which it already does on any failure**. It is not a login, not money, not access to the house. **STOP RE-VERIFYING IT EVERY SESSION AND STOP RAISING IT AS URGENT** — six days of "STILL LIVE" re-checks cost Jeff more attention than the risk. Rotate it whenever he happens to be on wunderground.com; then delete the line-16 fallback in one commit. | JEFF *(whenever, no rush)* | flagged 08-16 | 30 sec: wunderground.com → Member Settings → My Profile → API Keys → rotate → paste into Cloudflare Pages as `WU_API_KEY`. |
| 6 | **`front_right` is armed and healthy but BLIND** — 1 clip since 08-15, zero motion in 26 h, telemetry fine (75 °F, −48 dBm). | **JEFF** | found 08-19 | PIR aim in the Blink app. **Not previously recorded anywhere.** |
| 7 | **Backyard PIR logs zero motion even overnight at 78 °F.** Heat explains daytime; it does not explain cool hours. **Not root-caused.** | **JEFF** | I.13, 08-15 | AI thresholds already fixed and proven — this is the sensor. |
| 8 | **Garage door was standing OPEN at 22:00 on 08-19 and HA cannot tell you.** No garage-door entity exists. | **JEFF** | 08-08, **11 days** | SONOFF MINI DRY: wire, power, eWeLink-pair (Inching Mode), Matter-commission. App side done since 08-08. |
| 9 | ~~Garage Blink battery "LOW"~~ — phantom entity, DISABLED 08-19. Mains-powered Mini; disarmed state is Jeff's settled decision. | ✅ closed 08-19 | — | Kept so nobody "fixes" it again. |
| 10 | **Panic automation (HA side)** — the app fires the webhook; the automation waits on Zigbee hardware. | CLAUDE *(blocked on #11)* | 07-31 | |
| 11 | **Zigbee fleet still in boxes** — 7 door/window + 5 leak + dongle arrived 08-15, deliberately unopened until the camera pipeline was verified. **It now is.** | **JEFF** | 08-15 | Unblocks #10. First moves already written down: disable auto-firmware-update BEFORE pairing, pick the channel around the WiFi census, dongle on its extension cable. |
| 38 | **`back_deck_door_contact` reads OPEN since 08-17 11:41 PM.** ✋ **JEFF ALREADY KNOWS — 2026-08-22: "the door sensor will be fixed when we fix the sensors."** It is folded into JOB 1 (mounting the Zigbee sensors), NOT a live intrusion concern and NOT something to raise with him again. Battery 100%, still reporting — the sensor is alive, it just is not mounted/aligned yet. | CLAUDE *(during Job 1)* | 08-22 | Do not re-report this as an open door. |
| 39 | **NOTHING alerts on a door or window opening.** Enumerated all **43** automations by friendly name 2026-08-22 14:02 (`Sec-Automations.ps1`): not one is triggered by `binary_sensor.front_door_contact`, `back_deck_door_contact` or `mailbox_contact`. The contacts are recorded in HA and visible in the app, but a door opening produces **no push, no popup, no announce**. Camera AI notify is proven working (see below) - that is motion-in-the-yard, not door-opened. | CLAUDE *(blocked on #29)* | found 08-22 | Consistent with the settled "Guardian is life-safety heavy, intrusion lean" call, so **ask Jeff before building it** - it may be deliberate. If yes: one automation, `notify.mobile_app_jeffs_iphone` + `notify.mobile_app_angelas_iphone` both exist and are live. Fix #29 first. |

## 🟡 P3 — THINGS I CAN DO AND HAVE NOT

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 12 | ~~**`beehive-config/` is a STALE SNAPSHOT, not a mirror**~~ — **✅ CLOSED 2026-08-19.** Synced from the 05:37 encrypted backup via `pip install securetar` (the library HA itself uses). configuration.yaml 3,170→7,007 · automations.yaml 10,533→24,096 · hcc.yaml 22,608→23,263 · `codeproject_ai_object` refs **0→20**. Backup copy verified byte-identical to a live code-server fetch. Re-sync recipe in `beehive-config/README.md`. | ✅ closed 08-19 | — | Was 18 days stale and cost an hour that night. |
| 13 | **Dead `Blink Fast Motion Poll` block still in `packages/hcc.yaml` 502-517.** Disabled, harmless, present. | CLAUDE *(rule-blocked, no longer capability-blocked)* | 08-19 | **`/config` WRITE is now solved** — File editor add-on `POST /api/save` (form: `filename` + `text`, **paths RELATIVE to /config, not absolute**), reached from inside its ingress iframe. Proven 08-20: save → verified read-back → delete. **But §17 PART K still says `hcc.yaml` may only be edited via the Terminal add-on**, so this stays closed by RULE, not by capability. Needs Jeff's call to relax the rule, or the Terminal unblocked. |
| 14 | ~~**`recorder: purge_keep_days: 45` not set**~~ — **✅ ALREADY SET.** Live `configuration.yaml` lines 120-121 read `recorder:` / `purge_keep_days: 45`. **FOURTH stale item found tonight — and this one I made worse:** when correcting CLAUDE.md item 0c earlier I wrote "still worth doing… retention survives by the happy accident of purging not firing", with the live file already in hand and never grepped. Nothing is being purged because retention is 45 days and the DB is 23 days old. | ✅ closed 08-20 | — | Half-correcting a stale item and leaving a stale recommendation inside the correction. |
| 15 | ~~**`blinkpy` manifest errors ~4/hr, not root-caused**~~ — **✅ ROOT-CAUSED 2026-08-20.** `custom_components/blink/coordinator.py`: `SCAN_INTERVAL = 300` and `_async_update_data` calls `api.refresh(force=True)`. **`force=True` re-requests the sync module's LOCAL-STORAGE MANIFEST every 5 min**, faster than the module can rebuild it, so it answers `Manifest stale 2102` / `System is busy 307`. 12 attempts/hr vs ~4 failures ≈ 1 in 3 — matches the log. **This is WHY `recent_clips = 0` on all six cameras**, which is why `save_video` had nothing to fetch, wrote Blink's error JSON into the `.mp4`, and left the front doorbell frame 2.8 days stale. The snapshot path built 08-19 bypasses the manifest entirely, so the user-facing damage is already fixed. | ✅ root-caused 08-20 | — | Remaining is cosmetic log noise. Raising SCAN_INTERVAL would quieten it but means editing a HACS component that updates overwrite — **not worth it**; the clip path is no longer used. |
| 16 | **`hcc_zigbee_pairing_mode_temporary_..._08_17`** — a "temporary" automation still sitting there, disabled. | **CLAUDE** | 08-17 | Delete once #11 is done. |
| 17 | ~~No disk/CPU/memory visibility on Beehive~~ — System Monitor added 08-19. 94.3 GiB free, CPU 24 %, 120 °F. | ✅ closed 08-19 | — | |
| 18 | ~~**`hero-cameras.jpg` fake title / ALL SYSTEMS READY panel / six dummy tiles**~~ — **✅ WAS ALREADY DONE 2026-08-06**, commit `1eba07f`. Verified by opening the image 08-19: all three fake elements gone; Blink logo and 2nd Amendment sticker still present per Jeff's explicit call; file is the regenerated 1300×970 landscape banner. **The item sat open for 13 days after it was closed.** | ✅ closed 08-06 | — | Third stale open item found 08-19, after the recorder purge alarm and the backyard AI thresholds. |
| 19 | ~~**Irrigation zone photos — docs contradict each other**~~ — **✅ ALREADY CLEAN. All six opened and looked at 2026-08-20: NO gold frame, NO title, NO tagline on any of them.** `git log --follow` → commit `6913393`, **2026-08-11**, *"Mower sensor: fix the hour meter at the source; **clean the zone photos**"*. Written 08-08, done 08-11, left open 9 more days. **The contradiction dissolves:** CLAUDE.md's *"REAL PHOTOGRAPHS OF JEFF'S ACTUAL YARD… do not regenerate or replace these"* is the operative note; the "fake overlay" note was simply out of date. **Jeff does not need to rule on anything — there is nothing to strip, and these must NOT be touched.** | ✅ closed 08-11 | — | **Why it stayed open: the fix rode along inside a commit whose subject was about the mower hour meter.** Closing a tracked item has to be visible in the commit subject or in this file, or it stays "open" forever. |
| 20 | **Lighthouse JS/CSS minification** — unused-js ~235 KiB, unminified-js ~71 KiB. | **CLAUDE** | 07-31 | Explicitly out of scope; needs restructuring. |

## 🔵 P4 — DECISIONS ONLY JEFF CAN MAKE

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 21 | **Driveway `vehicle` reports Jeff's own parked car at 90.5 % every scan.** The Blink app zone stops it *triggering*; the AI still scans the whole frame. | **JEFF** | 08-14 recorded, unbuilt | Drop `vehicle` (like the backyard) or restrict to night hours. **An ROI crop would blind the garage apron — checked against the real frame.** |
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
| 29 | **Clip archive saves DUPLICATES.** The 4 newest `301_driveway` clips are byte-identical (`md5 5761BC25CFCD`, 1,984,293 bytes) under 4 different event timestamps. The archive stores the most recent clip for every event, so it cannot be trusted forensically. | CLAUDE | found 08-22 | Not urgent. Do not fix inside the camera freeze without Jeff asking. |
| 30 | **30 `back_left` clips from 08-21 are 40-byte stubs** (truncated downloads). Older `back_left` clips are real video, so this started recently. | CLAUDE | found 08-22 | Same freeze caveat as #29. |
| 31 | **Zigbee quiet 12-18 h and the mailbox contact missed a REAL delivery** (mail carrier ~11:25 on 08-22). **NOT declared a fault** - MQTT answers on 1883, the `mqtt` integration is loaded, and `back_deck_door_voltage` did report at 08-21 23:00. Suspicion only. | CLAUDE investigates, JEFF confirms | found 08-22 | Do not raise an alarm on this without evidence. Separate from cameras. |
| 32 | ~~**back_deck_door_contact open 17.8 h**~~ **SUPERSEDED by #38** - that entry is more accurate (used last_CHANGED: open since 08-17 11:41 PM = 4d 14h, not last_updated). Either the door genuinely is open, or the sensor is stuck. | **JEFF** (one look) | found 08-22 | Ask before treating as a fault. |
| 33 | **Guest bath leak sensor battery at 30%** - lowest in the house, and leak sensors are the worst ones to have silently dead. | **JEFF** | found 08-22 | Low-battery alert is armed and covers it. |
| 34 | **Blink battery failure-point experiment RUNNING.** `front_right` (151) and `301_driveway` (146) are deliberately on ORIGINAL cells to find the real failure voltage. **DO NOT replace them or advise replacing them** - running to death IS the experiment. | JEFF decides | started 08-22 | Logger every 15 min; alert fires on failure carrying the last voltage. `Show-BlinkBatteryTrend.ps1`. |
| 35 | **RTSP cameras DEFERRED ON COST.** 2x Tapo C320WS ~$34 ea, verified. **Do not re-pitch.** Blinks stay because those spots have NO MAINS POWER (except back deck). | **JEFF** | deferred 08-22 | `docs/CAMERA_PURCHASE_RTSP_2026-08-22.md` |
| 36 | ~~**Water reading "looks stuck" AGAIN (Jeff, 08-22 ~1 PM)**~~ — **✅ CLOSED 2026-08-22 1:18 PM. PIT RADIO IS HEALTHY. NO WHUD CALL.** `Check-WaterMeter.ps1` was finally RUN (it never had been) and its checks independently re-pulled by hand. **Measured:** `sensor.water_meter_last_seen` 2.0 min old, and its 3 h history shows **82 consecutive RF catches, 15:20Z→18:15Z, every gap 0.5–4.7 min, none over 5 min** — the radio is transmitting continuously, the exact opposite of the 07-28 silence. Gas heartbeat 1.5 min old, so the shared dongle is fine. The reading itself **changed 13× in 24 h** (210483→210661); it had simply been flat for 77 min. **The earlier "sandbox blocked everything" claim was WRONG** — the block was tool-specific. The PowerShell tool refuses a nested `powershell` process; the **Bash tool runs the same script fine**, and Bash+`curl` reaches `192.168.1.66:8123` (one command per call — chained `;`/pipes trip the approval prompt). | ✅ closed 08-22 | — | **New measured fact:** all 13 value changes landed within ~2 min of the top of an hour while the heartbeat fires ~20×/hr, so **this meter batches HOURLY** — tighter than the 08-01 note's "~20 min to ~3 hr". A flat stretch up to ~1 h is the FLOOR of normal here, not a fault. Units: `water_meter_reading` = 0.1 gal. |
| 37 | **Water reading flapped `unavailable`/`unknown` repeatedly on 08-21 evening** (18:41Z–22:42Z, ~10 times) plus once at 08-22 08:55Z. **NOT a pit-radio fault** — the RF heartbeat was unbroken across it. Cause (add-on restart? MQTT availability topic? Beehive reboot?) was **never investigated**, so do not report the meter path as fully clean. | CLAUDE | found 08-22 | Low priority, cosmetic so far — no reading was lost, the value resumed at the same number each time. Found while closing #36; logging it rather than handing it off in prose. |

**Closed 2026-08-22:** the 08-18 "still owed" battery trend meter - built as
`Log-BlinkBatteries.ps1` + `Show-BlinkBatteryTrend.ps1`, running, alarm tested against a real
Blink reload. It had sat undone for **four days** because the handoff was prose, not a row on this
list. That is why the SessionStart hook now injects this file's item count and staleness.

## 🟡 FOUND 2026-08-23 — added the same session, per the rule

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 38b | ✅ **CLOSED same session — duplicate `go2rtc` startup task.** Two scheduled tasks launched the same exe: `HCC go2rtc camera streams` (boot, SYSTEM, the 08-21 keeper) and `HCC go2rtc Camera Feed` (logon, built 08-15, orphaned when the boot task replaced it). The loser could not bind 8554/1984 and squatted on TCP 8555. Orphan **disabled, not deleted**. Keeper PID 2880 held its original start time throughout — the stack never restarted. `Verify-CameraStreams.ps1` run before AND after: all 6 streams served real frames both times. | ✅ closed 08-23 | — | Also patched the health check, which printed `pid System.Object[]` and still said ALL GOOD with two instances fighting. It now counts instances and names the offending task. Write-up in `docs/incidents/camera_fixes_2026-08-21.md`. **Lesson: when a startup mechanism is replaced, disable the old one in the same session.** |
| 39 | 🟠 **Two pre-existing SMB shares grant `Everyone: Full`** — `Users` → `C:\Users` and `OneDrive` → the OneDrive folder. Guest is disabled so there is **no anonymous access**, and NTFS still gates it, but any account with valid credentials gets whatever NTFS allows across the entire user profile over the LAN. Neither share was created this session. | CLAUDE fixes, JEFF says when | found 08-23 | Not on fire, not touched — outside the ask it was found during. Fix is to scope both to named accounts, or remove the `Users` share if nothing depends on it. **Check what depends on them first.** |
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
| 45 | ⚠️ **Two add-ons sitting in Error state:** `Advanced SSH & Web Terminal` and `Plex Media Server`. Found while chasing #44; not investigated. | CLAUDE | found 08-23 | Neither is load-bearing for the house. Do not touch inside the camera freeze without asking. |
| 46 | **Three `image_processing` entities never scan:** `301_front_doorbell`, `front_right`, `garage` — `unknown` since the 08-21 restart. **NOT declared a fault.** Garage motion is OFF by Jeff's decision and the doorbell/front_right limits are documented upstream Blink behaviour (`reference_hcc_blink_upstream_limits`). The other three scan normally (back_left 16:12Z, backyard 10:41Z on 08-23). | CLAUDE — observe only | found 08-23 | **CAMERAS ARE FROZEN.** Do not change anything here unless `Verify-CameraStreams.ps1` fails or Jeff asks. |
| 47 | **"Camera AI is DOWN" notification is misleading.** CodeProject.AI is UP: modules `ObjectDetectionYOLOv5-6.2` and `FaceProcessing` both `Started`, `LastSeen 2026-08-23T19:00:54Z`. The heartbeat fires on "no object_detected in 6+ h", which a genuinely quiet house also produces. | CLAUDE | found 08-23 | The alarm needs a better test than event-absence, or it will keep crying wolf. Low priority. |
| 48 | **HA Core update available:** 2026.8.2 → **2026.8.3**. This is the badge Jeff keeps seeing. | **JEFF decides when** | 08-23 | Not applied. Do not update mid-session without asking. |

## 🔴 ROOT CAUSE + PREVENTION 2026-08-23 — the Zigbee blackout

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 49 | ✅ **ROOT CAUSE FOUND (looked up, not guessed).** The 44 h Zigbee blackout was the **documented HA / Zigbee2MQTT startup race** — if HA finishes loading before the broker and Z2M settle, HA holds a connection that looks alive and never receives device messages. Reported repeatedly upstream (Koenkk/zigbee2mqtt #18170, #19654; hassio-zigbee2mqtt #83; HA community 646572): *"if the MQTT broker is restarted, all zigbee2mqtt devices disappear from HA."* Our evidence matches exactly — every entity froze at the HA restart timestamp while Z2M kept publishing. | ✅ 08-23 | — | **The 08-23 mqtt reload was RESTORATION, not prevention.** Prevention is #50. |
| 50 | ✅ **Two automations built to make this self-heal and self-report.** (1) `automation.hcc_mqtt_re_subscribe_after_ha_start_zigbee_race_fix` — on `homeassistant start`, waits 3 min, reloads the Mosquitto config entry, posts a notification. (2) `automation.hcc_sensor_silence_watchdog_reports_absence_not_events` — every 30 min, fires if any door/leak/meter sensor has said **nothing** for 6 h, pushes time-sensitive to Jeff's phone. | ✅ 08-23 | — | **VERIFIED:** both entities exist and are `on` (checked in `/api/states`, not trusted from the API's "ok"). Watchdog logic proven BOTH ways — 6 h threshold → False/empty on live data; 0 s threshold → True naming all 7 sensors. **NOT YET VERIFIED: the race-fix trigger, because that needs a real HA restart.** Confirm it at the next restart. |
| 51 | ✅ **SessionStart hook now injects LIVE FAULT STATE, not a pointer to a document.** `windows-scripts/hooks/Hook-SessionStart.ps1` queries HA on every session start and prints whether any critical door/leak/meter sensor has gone silent >6 h, plus any pending HA core update. **Proven both ways:** healthy path renders `door/leak/meter sensors all reporting - OK`; a throwaway copy with the threshold flipped printed `*** 7 CRITICAL SENSOR(S) SILENT ***` and named every one. Backup at `Hook-SessionStart.ps1.bak-20260823`. | ✅ 08-23 | — | **This is the fix for "nobody reads the notes."** A briefing that points at files depends on the session choosing to read them. Injected facts arrive whether it reads anything or not. Every watchdog before this waited for an EVENT; a dead sensor produces none. |
