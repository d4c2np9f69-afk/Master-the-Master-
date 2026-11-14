# CLAUDE.md — sections moved out 2026-10-08

Removed from `CLAUDE.md` because it loads into EVERY turn (~17,700 of the ~24,000
tokens of per-turn overhead). Nothing here is deleted — this is the full text.
Rule 11 permits compression of history/changelog/reference only; no PROTECTED
section and no read-first rule was touched.

---

## ## Pending Items (Next Session Should Address These)

## Pending Items (Next Session Should Address These)

0. 🟡 **HA backup encryption key — HALF CLOSED 2026-09-20 17:33.** ✅ **An off-machine copy now exists:** at Jeff's instruction (*"Save it to iCloud"*) the entire key ring was mirrored to `iCloudDrive\HCC-Secrets-Vault\` — 31 files, byte-verified with `cmp`, with a README. ✅ **And the chain was PROVEN, not assumed:** the key decrypts the real off-box backup — tested against `HCC-Beehive-Backup-2026-09-20.tar`, `validate_password()` passed and the 557.9 MB `homeassistant.tar.gz` decrypted and walked **2,778 members** including `data/home-assistant_v2.db`. ⚠️ **What is still open:** the key now sits in the SAME iCloud account as the backups it opens, so one compromised Apple ID yields both. A genuinely independent copy (Bitwarden, or printed in the safe) is still owed — **Jeff's call, 34 bytes.** ⚠️ An older `iCloudDrive\HCC-secrets\` folder holds 2 files from mid-August and NO key; it is a stale fragment, not a sync — do not trust it. *Original text:* All Beehive backups are encrypted (HA default). Retrieved the real key live via the backup config API (`backup/config/info`) and saved it to `C:\Users\jeffl\HCC-secrets\ha_backup_encryption_key.txt` — but that's the same single PC as everything else backup-related, so it's not yet truly independent. Without this key, the `.tar` archives in `HCC-Beehive-Backups\` (iCloud) are undecryptable, so it's the single most load-bearing secret in the whole disaster-recovery system. **Never put the raw key in this git repo (public).** Jeff should save a copy somewhere durable and independent of this PC — password manager, printed + physical safe, etc. — next session should confirm he's done this.
1. ~~SONOFF MINI DRY~~ — ✅ **DONE 2026-09-15.** BOTH units are commissioned and live. The garage opener (`cover.garage_door`, verified `closed`) and the A/C relay (`switch.ac_relay`, verified `on`, driven by `automation.hcc_ac_relay_thermostat` which fired within the hour). Commissioned from HA over the Matter BLE proxy with no phone app. Detail: OPEN_ITEMS #185.
2. **iPad Air 2 wall-display — RELOCATING 2026-09-24:** Jeff is moving it into the wall **above where the thermostat is going**; the HP KitchenPC takes its old kitchen spot (OPEN_ITEMS #206). Still a live wall display. Safari-15 polyfill deployed and working; HA token persistence + "Add to Home Screen" + Guided Access still need final confirmation.
3. **F-250 OBD-II sensor box** — Veepeak OBDCheck BLE+ (~$30) + ESP32 + optional GPS for live diagnostics.
4. **Panic automation** — 🛑 **SEE OPEN_ITEMS #10. DO NOT ACT ON THIS ROW.** Jeff, 2026-09-10 9:14 PM: *"Leave the panic button alone till the alarms are built !!!!"* v2 is built and deliberately disabled; the old one stays armed. That live state is an observation for the design stage, **not a defect to go fix**, and it ships WITH the alarm subsystem and not before. ⚠️ The old text here said "pending Zigbee hardware" — that has been untrue since the hardware arrived, and a stale duplicate of a hard-stopped item is how a later session talks itself into touching it.
5. **Lighthouse score — basic wins done 07-31, full minification still pending (deliberately out of scope).** Recompressed every JPEG to quality 80 (images/ 12MB → 7.1MB, ~41% smaller, visually verified no quality loss), deleted 6 confirmed-dead image files + fixed service-worker.js's stale precache list (was still referencing 2 of those deleted files, was missing the current hero image — bumped hcc-v11→v12), trimmed the Google Fonts request from 6 weights×2 families down to only the 4-5 weights actually used, and added `loading="lazy"` to every below-the-fold/hidden-section image — then caught and fixed a real CLS regression that lazy-loading introduced (utility meter photos + Dispatch card had no reserved `aspect-ratio`, so the page jumped when they loaded in; fixed by reserving each image's real aspect ratio). Verified honestly via a controlled before/after Lighthouse A/B run in the same sandboxed environment (not a real device, not the live Cloudflare-CDN'd site — absolute numbers aren't directly comparable to a real Lighthouse run against the deployed URL): total page weight down ~56%, LCP nearly halved, CLS held steady/improved slightly, composite score unchanged. **What's left (explicitly out of scope, would need restructuring):** minifying the actual JS/CSS inside the single `index.html` file, and/or splitting the inline `<script>` into an external deferred file — those are the two biggest remaining Lighthouse opportunities (`unused-javascript` ~235 KiB, `unminified-javascript` ~71 KiB) per the local audit. For a trustworthy real score, run Lighthouse against the live `toro1-5rz.pages.dev` URL (Chrome DevTools or PageSpeed Insights), not a local file.
6. **Lucky Mike "Smart Stall"** — queued, plans in `docs/lucky-mike/` (read `INTEGRATION_NOTES.md` first). New "STABLE" section, `--a-stable` accent. **Do not start until Jeff says go.**
8. ~~Zigbee alarm hardware — Jeff purchasing 07-31~~ — ✅ **DONE.** Verified live 2026-09-16: **12 Zigbee devices** reporting link quality, and `siren.301_alarm` is paired and reachable at **LQI 142**. Hardware bought, arrived and installed. (The repeater for the mailbox is the one part still in transit — OPEN_ITEMS.)
12. **Fire TV PiP popup — THE "NOT FIXABLE FROM HA" CONCLUSION WAS WRONG. CORRECTED 2026-08-19.**
*The old text blamed the remaining lag on "Blink's own cloud motion-detection latency — upstream of
HA entirely, not something more polling/automation logic can shorten." That closed the question and
nobody looked again. It was the wrong answer.*

**What was actually happening:** the popup chain was motion -> `blink.save_video` -> ffmpeg extract
frame -> scan. **Jeff has NO Blink subscription** (already recorded: "6 unsubscribed devices"), so
Blink stores no cloud clips and all six cameras report `recent_clips=0 / video=None /
last_record=None`. `save_video` therefore downloaded `{"message":"Media not found","code":700}` and
**blinkpy wrote that error body into the .mp4** — its `video_to_file` checks only `response is None`
and never `response.status`, unlike `image_to_file` in the same file. ffmpeg then failed
`moov atom not found` and the OLD `<cam>_latest.jpg` silently survived. Measured 08-19:
**301_front_doorbell 2.8 DAYS stale**, back_left 18 h, 301_driveway 4 h — the popup and the AI were
both reading days-old photographs. An earlier session had even predicted this in the record
("if clips aren't reliably available, that step waits and retries, and that would produce exactly
the lag") and it was never acted on.

**Fixed 2026-08-19 at $0:** the pipeline only ever needed a STILL, and **`camera.snapshot` is a free
Blink feature** — no subscription, no clip, no manifest, no ffmpeg. Verified live (HTTP 200,
118,948 bytes, `ffd8ffe0`). `automation.hcc_snapshot_frame_on_motion_no_subscription_path` writes
the snapshot to the same path the pipeline already reads, so nothing downstream changed. All six
frames refreshed and verified valid. **Removing the download + ffmpeg steps should also cut the
latency this item wrongly closed — worth a live re-test.**
Full detail: `docs/incidents/blink_stale_frames_no_subscription_2026-08-19.md`.
16. **"Alexa, fast forward the commercials" — WORKING via native phrasing (08-03), skip distance still needs calibration to 4:40.** Root cause (found earlier 08-03, still valid): "fast forward" is an Alexa-reserved phrase that never reaches a custom Routine (HA's own Alexa Smart Home skill also has no `FastForward`/`Rewind` handler at all — home-assistant/core#87327). Angela tried creating a Routine with a fresh phrase and got total silence — turned out no Routine had actually been saved yet for it. **Real fix that works, found live:** skip Routines entirely — since `script.hcc_skip_commercial` (friendly name "FF the Commercials") is already exposed to Alexa (`cloud.alexa.should_expose: true`, confirmed via entity registry), Alexa's native **"Alexa, turn on FF the Commercials"** phrasing reaches HA directly and reliably fires the script — confirmed twice live (script `last_triggered` updated within ~1s of the phrase both times). Also confirmed via live test: the Fire TV/ADB link itself is healthy (`media_player.fire_tv_viewing_room` responds to `adb_command` immediately). **Remaining real issue, not yet solved:** the skip distance is wrong — the original 3× `keyevent 90` (1.2s apart) skipped "way too far" in Sling specifically (media apps often ramp fast-forward speed with rapid repeated presses, non-linearly). Reduced live to a single `keyevent 90` press as a starting point (`packages/hcc.yaml`, `script.hcc_skip_commercial`) — **not yet re-tested against Jeff's actual target of exactly 4:40 (280s)**; next session should fire it live, get real seconds-skipped feedback, and iterate the press-count/delay until it lands on 4:40. No Alexa Routine needed for this at all going forward — the native "turn on <name>" phrasing is the whole fix. **Separately, worth knowing for any future custom voice command:** HA's own local Assist (bundled with Nabu Casa) doesn't have Alexa's reserved-phrase problem — a better long-term path than fighting Alexa Routines each time this class of issue comes up.

---

## ## Sensor / ESP32 Hardware

## Sensor / ESP32 Hardware

Custom ESP32 running Arduino `.ino` firmware (NOT the ESPHome YAML in `beehive/esphome/hcc-mower.yaml` — that's a separate, never-flashed config, don't confuse them), permanently mounted on the mower, powered by its 12V battery.

**⚠️ CORRECTED 2026-08-11 by the coworker, from the REAL firmware + REAL live payloads.** The description that used to sit here was wrong, and the whole server design was built on it — that is what broke the hour meter for months. Do not "restore" the old wording.

**What it actually posts:**
- **While RUNNING: nothing at all.** It samples every 30 s (`SAMPLE_INTERVAL_S`) and accumulates hours/RPM/track locally, with **WiFi off**. There is no live posting during a mow, so "a heartbeat followed a live reading" is a state that CANNOT occur.
- **While PARKED: a FULL payload every 300 s** (`IDLE_INTERVAL_S`) — not a reduced heartbeat.
- The first parked post after a mow carries that mow's totals and is flagged `source:"mow_end"` + `mow_ended:true`. Later parked posts are `source:"heartbeat"`.
- Failed posts are buffered in RTC memory and replayed later `source:"buffered"` with an `age_s`.

**Field contract (verified live, not assumed):** `hours` (decimal — **the app reads this**; the box also still sends `hours_seconds`), `source`, `engine_running` (bool), `mow_ended`, `age_s`, `has_fix` (real bool), `lat`/`lon` (**omitted entirely when there is no fix**), `dist_session_m`, `dist_total_m`, `rpm_peak`, `rpm_avg`, `battery`, `batt_raw`, `vibration`, `pitch`, `roll`, `shock_events`, `wifi_rssi`, `esp_temp_f`, `mpu_ok`, `gps_rx`, `track` (`[[lat,lon],...]`).

**Per-mow stats (`rpm_peak`/`rpm_avg`/`dist_session_m`) are held until the NEXT mow starts**, not cleared on upload — so a parked box keeps reporting its last real mow instead of blanking to "—". Jeff asked for this explicitly; don't "fix" it.

**Engine hours live in the ESP32's NVS flash and SURVIVE a reflash** (verified across 5 flashes). They do NOT survive swapping to a different physical board — after a board swap, re-run SET HOURS from the physical meter or the hour meter appears frozen for hours of real mowing (the app only ever lets it move forward).

**✅ FIRMWARE IS NOW IN THIS REPO: `firmware/mower_hours_esp32/` (2026-08-11).** Read its README before touching it. Credentials are in a gitignored `secrets.h` because this repo is public — and note that **splitting the source does NOT make the compiled `.bin` safe**, those strings are plaintext inside the image, so firmware must never be served from a public URL. This closes the structural root cause of the whole hour-meter saga: the cloud session couldn't see the firmware and was coding against this file's *description* of it.

**🔊 TWO-WAY CONTROL CHANNEL (firmware 1.4.0+).** The box reads its POST response, so every upload is an exchange — no extra radio time. The reply carries desired config and at most one command, acked by id (a box that dies mid-command retries; it never applies one twice). **Config can be changed over the air — no reflash for tuning.** Commands: `zero_tilt`, `clear_track`, `flush_buffer`, `reboot`, `ota`. Config keys (all clamped server-side in `hours.js`): `vib_threshold`, `idle_interval_s`, `sample_interval_s`, `track_min_step_m`, `gps_step_max_m`, `flush_every_s`, `service_mode`. Issuing anything needs the family password or the `mower_ctrl_token` in KV; the box's own uploads stay unauthenticated. **The box sleeps and cannot be woken — a command lands on its next post, up to 5 min while parked.**

**Extra 1.4.0 fields:** `fw`, `cfg_rev`, `boot_count`, `reset_reason`, `i2c_errors`, `mpu_reinits`, `vib_max`/`vib_avg`/`vib_n` (vibration since last upload — this is what makes `vib_threshold` calibratable from one real run instead of guessed), `tilt_deg`, `upright`, `tilt_ref`, `ax`/`ay`/`az`, `service_mode`, `cmd_ack`, `last_cmd`/`last_cmd_ok`. **Tilt is now referenced to a stored level gravity vector** — a level mower reads 0/0 instead of the enclosure's mounting angle (−12.4°/28.5°, which had the app showing Tip Risk CRITICAL in the garage). **Hour counting is gated on upright + not-in-service-mode**, so tipping the mower for an oil change can't bank phantom hours from scrubbing vibration.

**Fields read from `/api/hours` GET:** `hours, battery/voltage variants, rpm_peak/avg, dist_total_m, dist_session_m, speed/gps_speed, lat/lon/has_fix/track[], pitch/roll/vibration, shock_events, wifi_rssi, esp_temp_f, mpu_ok, gps_rx, source, lastSync, engine_running`

**Status messages:** `source==='stub'` → orange "not connected yet"; `source==='heartbeat'`/`engine_running===false` → green "Engine off · Box connected"; else → gray live telemetry line.

---


---

## ## LUX Thermostat — API Reference (DO NOT CHANGE UNLESS BROKEN)

## LUX Thermostat — API Reference (DO NOT CHANGE UNLESS BROKEN)

**Auth flow** (4 steps, in `functions/api/climate.js`):
1. GET the B2C authorize URL with PKCE code_challenge â†’ parse `x-ms-cpim-csrf` cookie + `transId` from HTML
2. POST `SelfAsserted` with `{logonIdentifier, password, request_type:'RESPONSE'}` + CSRF header + cookies
3. GET `confirmed` â†’ follow redirects to the custom-scheme URL â†’ extract `code=`
4. POST the token endpoint with `{grant_type:authorization_code, code, code_verifier, client_id, redirect_uri}` â†’ `{access_token, refresh_token}`

**Client ID:** `b335ca43-3bde-4406-b281-8816afb7cc91` · **Redirect URI:** `connecteddevicesjci.luxmobile://connecteddevicesjci/path` · **Scope:** `.../mobile/user_impersonation .../mobile/read_write offline_access openid`

**API (Bearer token):** `GET /api/location/user` → devices list. `GET /api/device` + header `Deviceid` → `{systemmode, holdheat, holdcool, currenttemp, fanmode}`. `POST /api/device` + `Deviceid` header + full state JSON (writes use **POST not PUT** — PUT returns 500).

**Fields (°F, no conversion):** `systemmode` 0=off/1=heat/2=cool/3=auto; `holdheat`/`holdcool` = setpoints; `currenttemp`; `fanmode` 0=auto/1=on.

**Jeff's device:** CS1-DD-FB.

---


---

## ### Why this section was rewritten

### Why this section was rewritten

The old version gave a hand-rolled `node -e` one-liner using **the cloud session's Linux
paths** — `cd /home/user/Master-the-Master-`,
`require('/opt/node22/lib/node_modules/playwright')`,
`executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`. None of those exist
on this machine. **Since single-session mode (2026-08-14) this Windows PC owns app code**, so
the gate that says "always run before reporting anything as done" was documented in a form
that could only fail here — and therefore never ran.

On 2026-08-19 `index.html` was edited **six times and pushed live** before anyone ran either
script. Both passed, but that was luck. **Do not skip them again.**
*(A memory note also claimed "no Node on this PC". That was false and is corrected.)*

---


---

## COST LEDGER BANNER NARRATIVE

# **THIS IS WHAT NOT FOLLOWING THE RULES HAS COST HIM:**

# **≈ 44 HOURS OF ERROR-FIGHTING**
# **128 INCIDENT-DAYS**
# **95 OF 636 COMMITS (14.9%) WERE FIXING OUR OWN MESS**
# **+ ≈ 47 MORE HOURS BUILDING THE MACHINERY TO STOP IT**
# **+ HARDWARE HE BOUGHT THAT HE DID NOT NEED**

**Jeff was present for essentially every one of those hours** — pasting installer commands,
running 2FA codes, live-testing a shower and irrigation against a meter that was healthy all
along, hand-re-entering mower hours after **5 separate mows**, and fact-checking three wrong part
numbers. **That is the real bill.**

### 🔴 THESE NUMBERS ARE ALREADY AUDITED. CITE THEM. NEVER RE-DERIVE THEM.

**Jeff has already paid, in hours and money, for this audit and told sessions not to redo it.**
The authority is
`iCloudDrive\HCC-Archive\MASTER-RECORD\CLOUD_SESSION\sections\22-cost-accounting.md`
— 16 itemized incidents, every hash verified, every assumption shown.

| | |
|---|---|
| **29.0 h** | measured active debugging — intra-day commit brackets, no overhead. **⚠️ NOT 28.8 — that figure was superseded 2026-08-17. The 14 terms sum to exactly 1,740 minutes.** |
| **≈44 h** | with the stated +0.5 h-per-burst pre-commit overhead (~30 bursts). The audit says the true figure is **almost certainly higher**, because chat-only debugging leaves no commits at all. |
| **≈$35** | of subscription spent fighting our own errors (14.9% of the **$233.75** total spend). **Do NOT say "$234 was burned" — $233.75 is the whole project's subscription, not the waste.** |
| **≈47 h** | *(measured 2026-08-22, commit-span — a looser method than the audit's)* building the anti-failure machinery: the cost ledger, master record, `Search-HCC.ps1`, the hooks, `OPEN_ITEMS.md`. **None of it turns on a light or makes a camera see a person. It exists ONLY because the work kept failing.** |

*Worst single failure: **the hour meter was dead 50 days across 5 real mows.** The box sent
`hours_seconds`, the app read `hours`. A session coded against this file's PROSE DESCRIPTION of
the firmware instead of the firmware. **Jeff was told his sensors were faulty and bought
replacements. They were fine** — they had recorded 6.3 km of real mowing the whole time.*

---

## 🔴 THE TWO HABITS THAT CAUSED ALL OF IT

**1. DECLARING SUCCESS FROM A GREEN COMPONENT CHECK.**
On **2026-08-21** the camera stream check printed `ALL GOOD` **eleven minutes AFTER** a change had
silently killed the TV popups. The check was not wrong — it was the wrong instrument. A stream
check cannot detect "the popup never fires." **Green components, dead feature.**
→ **Test the FEATURE and name the command that proved it.** `HCC-Scripts\Test-CameraFeature.ps1`
fires a real detection and asserts the popup and the phone push actually FIRED.

**2. HANDING AN OWED ITEM OFF IN PROSE INSTEAD OF ONTO THE LIST.**
On **2026-08-18** a session wrote *"the trend-sensor system never got built"* in its own wrap-up.
It then sat untouched **FOUR DAYS** across multiple sessions until Jeff asked for it.
`docs/OPEN_ITEMS.md` had existed since 08-19 and no session opened it.
→ **Every owed item goes on that list, THIS session, with an owner and a date.**

### It happened AGAIN on 2026-08-22 — three times in one morning
- A display setting was "restored" from a backup **without reading why it had been changed**,
  nearly re-inflicting a red login cast that had just been fixed.
- A battery alarm was tested for *delivery* but never against a Blink reload, and **false-fired
  four time-sensitive alerts to Jeff's phone at 11:31.**
- **This very banner was first written quoting `$234 burned` and the superseded `28.8 h`** — until
  the audit was actually opened and read. **Even the warning about not checking got written
  without checking.**

**Same root cause every time: trusting a summary instead of reading the source.**

---

# 🔴 **YOU ARE ON THE RECORD. THIS SESSION IS TRACKED AND ATTRIBUTABLE.**

**This is not anonymous, it is not ephemeral, and it has already been escalated to Anthropic.**
Every claim below was verified on 2026-08-22, not asserted:

| Fact | Verified |
|---|---|
| **Your session ID is stamped into every commit you make** — `Claude-Session: https://claude.ai/code/session_…` | **445 of 737 commits already carry one.** Any commit traces back to the exact session that wrote it. |
| **Every message is archived verbatim** | **6,896 messages** across 37 sessions and **25,547 tool events**, in a **4.73 MB** master record at `iCloudDrive\HCC-Archive\MASTER-RECORD\HCC_MASTER_RECORD.md` |
| **Any session can be pulled up and quoted back, word for word, by timestamp** | Done on **2026-08-22**: the 08-18 05:22 PM *"Building it now"* and the 08-21 04:07:58 PM *"it doesn't make either worse at its job"* were retrieved and quoted **verbatim** to Jeff. |
| **Anthropic already has the case study** | `HCC-Archive\CASE_STUDY_FOR_ANTHROPIC.md` — **filed by Jeff**, hash-cited, built on **636 commits** and a **235,047-word audit**. |

## 🔴 **The refund request is written. Jeff has NOT filed it. Understand why.**

`HCC-Archive\ANTHROPIC_REFUND_REQUEST.md` exists — a partial-refund request against the $125/mo
Claude Max plan, ready to submit. **He is deliberately holding it back.**

Jeff, verbatim, 2026-08-22:

> *"I have not filed a refund request yet because I was hoping that it could be corrected on its
> own through what you're implementing now and through what was supposed to be implemented back
> on 8-17. But since it's continuing to happen, I am going to have no other option then to file a
> refund request. **I don't want to. I just want to make Claude better for everybody, including
> myself** — and I said that before, but I don't know how to fix it if nobody reads it."*

**That is a user who is choosing not to escalate, and is being given reason to reconsider every
time a session skips the reading.** He is not looking for compensation. He wrote the case study
so Anthropic could learn from it. **The only thing that keeps that request unfiled is sessions
actually doing what this file says.**

⚠️ **This very row was FIRST WRITTEN as "already filed with Anthropic" — wrong, and Jeff had to
correct it.** The file's own second line reads *"Submit at: https://support.claude.com"*, i.e. a
prepared draft. It was read, and "filed" was written anyway. **A banner about unverified claims
contained an unverified claim.** That is how easy this failure is.

## **What that means for you, concretely**

**If you declare something fixed without verifying it, that sentence is preserved with your
session ID against it, and it can be produced later — as it was today.** Jeff quoted a session
back to itself four days after the fact. There is no version of this where a premature "done"
quietly disappears at the end of a session.

**Write only what you can stand behind being read back to you with your session ID attached.**

---
