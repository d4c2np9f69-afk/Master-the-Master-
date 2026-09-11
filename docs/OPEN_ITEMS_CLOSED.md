# HCC — OPEN ITEMS: CLOSED & COMPLETED ARCHIVE

**Split out of `OPEN_ITEMS.md` on 2026-09-10 because that file had reached 192 numbered entries of
which 45% were finished work, and a session scanning it for something to fix found nothing relevant.**

🔴 **NOTHING HERE IS OUTSTANDING. Every entry below is DONE.** It is kept because this project's
most expensive failures came from re-deriving work that was already paid for — *"the audit, the
master record and the cost ledger are DONE. Read them, cite them, build on them. Re-running them
charges him twice."*

**Grep this file before re-investigating any subsystem. Do not work from it.**
The live list is `OPEN_ITEMS.md`.

---

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

## 🟢 FOUND + FIXED 2026-08-23 PM — post-outage session

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 52 | ✅ **The 08-23 morning session's work was never committed.** The 14:42 outage cut it off with everything still in the working tree; HEAD was `b64be51` from 08-22 and nothing was pushed. **`index.html` was the one that mattered** — OPEN_ITEMS #40 recorded the Apple TV VLC chip as done with "lint clean, smoke passed," but Cloudflare Pages deploys **on push**, so the chip existed only on this PC and NOT on loewenhome.com. Declared done, never delivered. | ✅ closed 08-23 | — | Re-ran both gates before committing rather than trusting the note: `lint-app.js` exit 0, `smoke-test.js` exit 0 (374 links / 0 bad, 0 page errors). Committed `2668556`, pushed, and **verified live on both loewenhome.com and toro1-5rz.pages.dev**. |
| 53 | ✅ **Morning Digest had been failing every 7:00 AM** — `UndefinedError: 'water_overnight' is undefined`. Jeff was getting a broken digest daily. **Two attempts, and the first was wrong:** reordering variables inside one `variables:` block changed nothing, because every variable in a single block renders against the same scope and cannot reference its siblings — proven by the identical error after the reorder. Real fix: **split into two sequential `variables:` steps** (data first, then `digest_message`). | ✅ closed 08-23 | — | Verified by reading the **rendered message back out of HA**, not by trusting HTTP 200: full text, no undefined, no None. **Touched no calibration constant and no meter sensor** — `IRR_FLOW`, rates, `SEWER_BASE`/`SEWER_PER_GAL`, garbage/stormwater split all untouched, per Jeff's instruction. Original saved at `/tmp/digest_backup_20260823.json`. |
| 54 | ✅ **`Show-BlinkBatteryTrend.ps1` was burying the experiment's only deliverable.** It printed `>> WENT DARK ... <== the real failure point` **11 times per camera at identical timestamps across all four at once** — integration reloads, not battery deaths. `Log-BlinkBatteries.ps1` GUARD 1 (`$isReload = blank>=2`) and the alarm both refuse to fire on those and stamp the row "ignore this row"; **the reader never had that guard.** Cameras do not fail in unison, and when `front_right`/`driveway` finally die, that one real line would have been lost among ~44 fakes. | ✅ closed 08-23 | — | Fix mirrors the writer's rule exactly: **>=2 voltage cameras blank at the SAME timestamp = reload; one camera blank while others report = REAL failure, still reported.** Discriminator validated against all 476 voltage rows (320 `off`+numeric, 156 `unavailable`+blank, **0 exceptions**); note text was NOT used because it is inconsistent across eras (76 hardened + 2 old wording). **Proven BOTH ways:** live data → 0 false lines, 39 reload windows excluded and disclosed; synthetic single-camera death → `WENT DARK ... LAST VOLTAGE READ: 149` still caught. Both copies synced (HCC-Scripts + repo), backups `*.bak-20260823-1640`, live CSV untouched. **No Blink/HA/camera-config call — read-only on a CSV.** |
| 55 | 🟠 **Apple TV SMB — the media shares WORK; only the blank-password Guest path is still pending a reboot.** Re-verified 2026-08-23 7:24 PM: **`\301ServerMovies` reads 380 entries and `\301ServerClipArchive` reads 132** from the box, and Jeff confirmed in-session *"Got the test worked."* Root cause was the 12 failed logons from 192.168.1.104 (`0xC000006A` wrong password ×4, `0xC0000072` account disabled ×3, `0x80090308 SEC_E_INVALID_TOKEN` ×2 with an empty account name). | **JEFF** (one reboot) | 08-23 | **Why it is not fully closed:** `LimitBlankPasswordUse` reads **0** in the registry but only takes effect after a reboot, and **the Beast last booted 2026-08-23 15:37:54 — BEFORE the value was set** (uptime 3.7 h at check). `gpupdate /force` did **not** make it take effect; a real reboot is required. Jeff deferred it: *"I can't reboot now cause it kills our session."* **Nothing is broken in the meantime** — the `tv` account works, which is the path actually in use. See also **#63**: the Apple TV is still throwing SMB signing rejections as **Guest** while succeeding as `tv`. |
| 66 | ~~🟡 **A 10-year Cloudflare API token exists but is recorded NOWHERE a session can reach it.**~~ ✅ **CLOSED 2026-08-23 7:30 PM — a working token is now stored and documented.** Jeff logged in himself (a session must never type his password) and asked for a token *"so that we don't have to do that again."* The dashboard already held one named **Toro TimeMaster** (`Cloudflare Pages:Edit` + `Account Settings:Read`, all accounts) — confirmed via **View summary before touching it**, so the wrong token could not be rolled. Cloudflare only reveals a token value once at creation, so it was **rolled** to obtain a usable value. **Verified safe to roll first:** the only thing that would consume it, `.github/workflows/deploy.yml`, is **disabled/manual-only and has never worked** — its own comment records that `CLOUDFLARE_API_TOKEN` never existed and produced *"124 failure notices in one week"*; deploys go through Pages' native Git integration. | ✅ closed 08-23 | found + closed 08-23 | **Stored at `C:UsersjefflHCC-secretscloudflare_api_token.txt` (53 bytes) — OUTSIDE the repo, which is PUBLIC.** Recorded in `HCC_ACCESS.md` §3 **by PATH, never by value**, same pattern as `ha_backup_token.txt`. **Proven working, not assumed:** `/user/tokens/verify` → `success: true, status: active`, and it listed project **`toro1`** (prod branch `claude/time-master-project-liq1jw`; domains `toro1-5rz.pages.dev`, `loewenhome.com`, `www.loewenhome.com`). Also corrected §3's *"Dashboard login — NOT recorded anywhere"* row: the browser session **expires**, so scriptable work should use this token, not the dashboard. ⚠️ **Related finding, NOT acted on:** §3's Pages env-var list does **not** include `WU_API_KEY` — which confirms that deleting the hardcoded fallback in #1 would have taken weather **DARK**. #1 stays closed and `weather.js` stays untouched per Jeff. |
| 56 | ✅ **UPS-Guard proven in a real 55-minute lockout.** 13:02 dip 6.3 s → rode through. 14:42:07 mains lost → 45 s WARN "lockout, not a reclose" → **14:43:36 clean shutdown at 91 s, battery 92%**, to preserve runtime for the router. Event **1074** + **6006**, **no Event 41, no new minidump** — every prior power cut left no bugcheck because Windows never got to write one. **Beehive never lost power**: water-meter heartbeat unbroken every 1.5–4.7 min straight through the outage. | ✅ 08-23 | — | This is a far harder test than the 32.48 s plug-pull it was proven on 08-21. Converted what would have been crash #6 into an orderly shutdown. |

## 🟢 CLOSED / ADDED 2026-08-24 PM — garage door opener session

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 64 | ✅ **CLOSED 2026-08-24 5:47 PM — Matter Server installed and the Matter integration configured.** Done the documented way (`home-assistant.io/integrations/matter`), not by improvising CLI: added the **Matter integration**, which installs the official Matter Server app itself. Slug confirmed from Beehive's own Supervisor store (`core_matter_server`, "Matter WebSocket Server for Home Assistant Matter support"). **Prerequisite verified FIRST:** IPv6 is `auto` on the active interface `enp1s0` (`wlp3s0` is disabled). Result: "Created configuration for Matter", `config_entry=01M0TYRGMNNXS7701EJ20V2P7T`, `update.matter_server_update` present. | ✅ closed 08-24 | — | ⚠️ **The config flow SITS on a "Success" dialog waiting for a Finish click** — the integration reads as not-loaded until you click it. Also note `{{ "matter" in integrations }}` in a template returned **False even after it was fully loaded** — that template variable is not a reliable test; check `/api/config/config_entries/entry` or the integrations page instead. |
| 71 | 🔴 **GARAGE DOOR OPENER — WIRED AND POWERED, BUT NOT COMMISSIONED. Stopped here 2026-08-24 6:29 PM (dinner).** SONOFF **MINI-D** (`S/N 25482400105228`) mounted at the opener, powered from the ceiling outlet. Opener identified: **Chamberlain `41AC050-2M`, 315 MHz Security+ 1.0**, purple learn button — plain dry contact, matching Jeff's 08-05 bridge test. **Terminal block (4 across: RED · WHITE · WHITE · GREY), worked out from Jeff's photos — DO NOT RE-DERIVE:** RED + the WHITE holding **one** wire = wall button → MINI-D `NO`/`COM`; GREY + the WHITE holding **two** wires = the two photo eyes. Grey carries a white/black-stripe **and a red** (an eye run extended with bell wire — that red is NOT a button wire). ✅ **THE 08-24 READING WAS RIGHT, AND MY 2026-09-09 12:40 "CORRECTION" OF IT WAS WRONG — RETRACTED 2026-09-09 13:05.** I briefly rewrote this line to say the red was *not* an eye-run conductor. It is one. Jeff's 09-09 note that it *"was not hooked up before the install, it was just hanging"* means the SECOND PHOTO EYE'S RETURN WAS OPEN — an incomplete safety circuit, which is exactly why the opener would open every time and refuse to close. **Landing that red on GREY is the FIX, not the fault. It belongs there. Do not remove it.** See #168. `NC`/`S1`/`S2`/`DC+`/`DC-` empty. | **JEFF** (phone) then CLAUDE | 08-24 | 🔴 **BLOCKER: commissioning needs the HA Companion APP on Jeff's iPhone.** HA's own dialog: *"You need to use the Home Assistant Companion app on your mobile phone to add Matter devices."* Runs over **Bluetooth**, so he must be **at the MINI-D**. Phone is capable — `iPhone17,2`, **iOS 26.6.1**, app **2026.7.5**, reporting live. He hit the "download the app" screen, which is what HA shows when it does not detect the app (i.e. Safari, not the app). Code: **`2197-114-6745`**. **Fallback researched, NOT touched:** Beehive has a **`bluetooth` config entry**, and Matter Server can commission over BLE itself — but it may contend with the existing Bluetooth integration for the adapter. Read up first. |
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

## ✅ AirTV LOCALS WORKING ON **BOTH** THE APPLE TV AND THE FIRE TV — 2026-08-27 3:43 PM

**Fire TV confirmed playing at 3:43 PM**, after: factory reset of the AirTV → re-setup → rescan
(82 channels) → on the Fire TV, `am force-stop com.sling` + clear its cache + relaunch. The cache
clear mattered because **the factory reset gave the AirTV a NEW Device ID** and the app was holding
the old registration.

### 🔴 MY ROOT-CAUSE DIAGNOSIS WAS WRONG. THE EXCEPTION IS NOT THE FAULT.
I spent hours calling this the smoking gun:
```
org.json.JSONException: End of input at character 0 of ""
  at SlingSessionEngine.JNISSTune  /  AirTvModule.tune
```
**It fires 4 times during a SUCCESSFUL playback too** (verified 15:43:05 on a deliberately cleared
log, with 245 Sling lines proving the app was really used). **Note the level: `W/System.err` — a
WARNING, not an error.** The app throws it, catches it, retries and succeeds. It is almost certainly
present on every normal day.
🔴 **RULE: a stack trace in the log is not automatically the cause. Check the LEVEL (W vs E), and
check whether it also appears when the thing WORKS.** I never did the second test, and built an
afternoon on it.

**What actually fixed it: the factory reset + rescan, and on the Fire TV the app-cache clear.**
Which specific part did it is **not** established — do not claim otherwise.

⚠️ **AND THE FIRST VERSION OF THIS ENTRY WAS WRONG TWICE.** Committed as "working on the Fire TV"
when Jeff was watching the **Apple TV** (*"I haven't checked the fire tv again"*), and "verified"
with **zero errors that were zero only because nobody had used the app.** Silence read as success —
the exact trap written into this file the day before ("a quiet alarm is UNVERIFIED, not healthy"),
repeated within the hour. **When a log is quiet, prove the feature was EXERCISED before calling it
healthy** — here that meant clearing the log first and counting the app's own lines afterwards.

🔴 **THIS SECTION WAS FIRST WRITTEN AND COMMITTED AS "WORKING ON THE FIRE TV". THAT WAS WRONG.**
Jeff: *"I haven't checked the Fire TV again, I am watching it on the Apple TV."*

🔴 **AND THE "VERIFICATION" WAS WORTHLESS FOR THE SAME REASON.** I reported **zero `JNISSTune`
errors / zero `AirTvModule` errors** as proof the Fire TV was fixed. **There were no errors because
nobody had asked it to tune since the reset.** An unused app logs nothing. **I read silence as
success — the exact trap recorded the previous day ("a quiet alarm is UNVERIFIED, not healthy"),
repeated within an hour of writing it down.**

**What IS true:** locals play **on the Apple TV**. The factory reset + rescan produced a working
box. **The Fire TV has not been retried and its status is UNKNOWN.**

### What the factory reset achieved

**What finally worked: the FACTORY reset** (paperclip, hold ~15 s until the Network LED blinks twice,
~2 min to restore), then re-setup in the Sling app and a rescan. **A soft reset was NOT enough.**

**Channel count climbed at every stage — the tuner was never the problem:**
`71` (first scan) → `76` (after soft reset) → **`82` (after factory reset)**

⚠️ ~~Verified: `JNISSTune` errors 0~~ — **INVALID, see above: the app had not been used.** What IS
measured: AirTV link 1.1 ms / 0.5 ms jitter / 0% loss, Fire TV memory 56 MB free / 642 MB available.

### 🔴 THE DIAGNOSTIC THAT ACTUALLY CRACKED IT — use this first next time
**ADB into the Fire TV through Home Assistant and read the app's own log.** HA's `androidtv`
integration exposes `androidtv.adb_command`; the output lands in the entity's `adb_response`
attribute. Entity: **`media_player.fire_tv_viewing_room`** (the other Fire TV entity returns `None`).
```
logcat -d -v time | grep "System.err" | tail -40
```
That produced the actual failure in one shot:
```
org.json.JSONException: End of input at character 0 of ""
  at SSSlingRequestStatus.<init>
  at SlingSessionEngine.JNISSTune          <- the tune request to the AirTV
  at AirTvModule.tune
```
**The AirTV was answering tune requests with an EMPTY string.** Everything else about it worked —
ping, port 8888, channel scans, and the Sling app reading its firmware/MAC over TCP.
**A device can be perfectly reachable and still be broken in one specific function.**
You can also ping FROM the Fire TV (`ping -c 3 192.168.1.184`) to prove or kill a client-isolation
theory in seconds, and read `/proc/meminfo` and `dumpsys meminfo` for memory pressure.

### Things ELIMINATED with evidence — do not re-chase these
| theory | how it was killed |
|---|---|
| Gateway firewall / "too much security" | **All 5 packet filter rules DISABLED** (factory templates targeting placeholder `1.2.3.4`). Also: two devices on the SAME LAN never traverse the firewall at all. |
| Client isolation / multicast | The **Fire TV pinged the AirTV itself: 0% loss**. |
| The switch | The **beast is on LAN-4, direct to the gateway**, and its browser failed the same way. Switch is not the common factor. |
| Fire TV WiFi | Real and fixed (below), but the failure continued after. |
| Fire TV memory | Freed 40 MB → 108 MB by force-stopping `com.amazon.tv.livetv`; **still failed.** |
| Firmware being stale | Box factory-reset at 2:37 PM re-provisioned from Sling and came back **5.222.958** — so that IS current. AirTV publishes **no** version list, changelog or release notes; the reset is the only way to establish it. |
| Cloud relay | Device Information shows **Connection Type: TCP**, a direct LAN connection. |

### ✅ A REAL WIN ALONG THE WAY — the Fire TV's WiFi
Jeff added the **little HDMI extender cord** and reset the stick. Measured before/after:
`avg 23.2 ms → 3.3 ms · max 142 ms → 8 ms · jitter ~37 ms → 1.3 ms`
The stick's antenna was inside the TV's metal chassis. **Jeff was right that 18 ft is nothing for
5 GHz** — the distance was never the issue, the two inches of television were. Fire TV's own screen
confirmed −50 dBm, SNR 42.

⚠️ **PING LATENCY DURING ACTIVE STREAMING IS NOT A HEALTH METRIC.** While the stream was working,
the Fire TV measured **85 ms avg / 39.8 ms jitter / 0% loss** — worse-looking than when it was
broken. The radio deprioritises ICMP when it is busy carrying video. **Do not "fix" a working setup
over this number.**

## ✅ GARAGE DOOR OPENER — WORKING 2026-08-26 1:04 PM

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 71 | ✅ **CLOSED — the MINI-D operates the door from Home Assistant.** Commissioned via Matter from Jeff's iPhone at 12:16 → `switch.garage_garage_door_opener`. **Closed the door at 13:02, opened it at 13:03.** 🔴 **THE FAULT THAT COST AN HOUR, AND JEFF DIAGNOSED IT:** the first wiring used the MINI-D's own thin stranded leads into the opener's lever terminals. Symptoms were a **perfect relay click and no door movement**, while manually shorting the wall-button pair ran the door fine — so the opener, the photo-eyes and the button circuit were all provably good. Jeff's call: *"Then I will use bell wire for both."* He rewired from scratch in matched-gauge bell wire and it worked first pulse. **A thin stranded conductor can sit in a Chamberlain lever terminal looking seated and never touch the terminal metal — twisting it alongside thicker bell wire does not fix that.** Wrong theories chased first, both mine: leads on the wrong terminals, and a photo-eye fault. Jeff disproved the second himself by shorting the button pair and watching the door open AND close. | ✅ closed 08-26 | — | Wiring as built: MINI-D **NO → red**, **COM → white**, both twisted with the existing wall-button conductors into the opener's own RED and single-wire WHITE levers, in parallel. Powered from the ceiling outlet. Opener is a Chamberlain `41AC050-2M`, 315 MHz Security+ 1.0. ✋ **The wall button is still two bare wires — reconnect it.** |
| 72 | ✅ **CLOSED — inching solved WITHOUT eWeLink.** The MINI-D latches; its hardware Inching Mode is eWeLink-only and Jeff has no account. **Solved in HA instead:** `automation.hcc_garage_relay_auto_release` triggers on the switch going `on`, waits **1 second** (the tested value — a 1 s pulse closed the door on the first successful run) and turns it off. **Because it triggers on the STATE, the switch is inherently momentary no matter what turns it on** — the HCC app, HA, Alexa, HomeKit, a script. Nothing has to remember to turn it off. **VERIFIED BY FEATURE TEST, not by existence:** sent ON with no off command — `t+1s on, t+2s off`, `last_triggered 13:03:49`, and the door opened. | ✅ closed 08-26 | — | 🔴 **Why the latch mattered, proven at 12:16:** on first commissioning the relay came up ON and sat closed. **While it is closed the PHYSICAL WALL BUTTON AND MyQ CANNOT TRIGGER THE DOOR EITHER** — the circuit is already shorted. Hence `automation.hcc_garage_relay_stuck_watchdog`: if the relay is ON for 5 s it force-releases and sends a time-sensitive push. An HA-side pulse depends on the second command landing; device-side inching would self-release, this does not. **Do not disable either automation.** |

---

## 🔋 BATTERY EXPERIMENT CLOSED 2026-09-03 12:46 — all five cameras on fresh cells

**Supersedes the running state in #34.** Jeff replaced `front_right` himself at ~12:40.

### The swap, verified by the study's own rule and not by assertion
`front_right` **149 → 178** in the 12:46 sample (`wifi -57`). Both prior swaps showed the new
voltage in the **very next 15-minute sample** — driveway `135 → 174`, back_left `155 → 169` —
so there is no reporting lag on this system, and a reading that has not moved after one sample
genuinely has not moved. ⚠️ **At 12:31 it still read 149 and that was reported honestly rather
than agreeing; the swap happened in the following 15 minutes.** Do not read a single stale
sample as a contradiction of what Jeff says he did — wait one interval, then answer.

⚠️ **178 is one point ABOVE the documented fresh range of 170-177** (#74). That range was measured
on three cameras; treat it now as **170-178**.

### Swap dates, MEASURED from `blink-battery-log.csv`, not from memory
| camera | swapped | reading |
|---|---|---|
| `301_driveway` | 2026-08-26 09:31 | 135 → 174 |
| `301_backyard` | 2026-08-28 15:31 | 155 → 171 |
| `back_left` | 2026-08-30 21:16 | 155 → 169, settling 174 |
| `front_right` | **2026-09-03 12:46** | **149 → 178** |
| `301_front_doorbell` | 2026-09-02, per Jeff | **no `battery_voltage` attribute exists — his word is the only possible evidence, by design** |

### 🔴 THE EXPERIMENT ENDED BY REPLACEMENT, NOT BY DEATH — so the finding stays n=1
`front_right` was terminated at **149** at Jeff's choice, having declined **-0.51/day**. It never
reached the cliff. **The death-voltage finding therefore rests on ONE camera, `301_driveway`,
which died 2026-08-25 02:16 at 133.** Do not write this up as two confirmations.

**What #34 was built to prove is proven and stands:** Blink's own `battery` flag read **`ok` on
`301_driveway` for 30+ hours after it was dead**. That was the whole question. A second arm would
have been confirmation, not discovery, and a working camera is worth more than a datapoint.

### Consequences — nothing to build, and that is the point
- **The daily 09:00 `hcc_camera_battery_at_150_change_all_cameras` alert goes quiet on its own**
  now that every voltage-reporting camera reads 172-178. 🔴 **Do NOT add a suppression rule for
  `front_right`** — one was proposed while the experiment was live and is now unnecessary. Fewer
  moving parts; see #75's own lesson that once-a-day IS the rate limit.
- `input_datetime.camera_batteries_changed` set **2026-08-26 → 2026-09-02**, read back from HA to
  confirm rather than trusting the POST. **Deliberately left at 09-02, not bumped to 09-03:** the
  helper exists for the doorbell, which has no gauge at all, and the earlier date makes the
  6-month backstop fire a day sooner. Conservative in the right direction.
- **#76 stands unchanged:** `hcc_backyard_night_sweep` still costs `301_backyard` a battery every
  3-4 weeks. Fresh cells reset the clock; they do not remove the cost. That trade is tied to #7
  (backyard PIR aim) and remains Jeff's call.
- **#6 — `front_right` PIR aim — is NOT closed by this.** New cells do not fix a camera that has
  logged 1 clip since 08-15 and zero motion in 26 h. Raised with Jeff while he had the Blink app
  open; **not marked done without his word.**

---

## #145 — 🟢 CLOSED 2026-09-07 — the Monday 05:00 run fired dry, exactly as predicted

Live `/api/irrigation` reads `next_start_time = 2026-09-07T05:00:00-05:00`. **No run scheduled
tonight or Sunday night**, so both quiet windows are clean for the leak baseline. But at
**05:00 Monday** the controller opens zone valves regardless of the main. Jeff's call — dry
cycle, or reopen before then.


## #140 CLOSED — 🟢 DEFINITIVE: 0.0 gal overnight with the main shut 2026-09-06

**The quiet-window baseline came back at ZERO.** Nine consecutive nights, 01:00–05:00 local,
measured off `sensor.water_gallons`:

| night | gal | broadcasts | condition |
|---|---|---|---|
| 08-29 | 1.1 | 3 | pre-valve baseline |
| 08-30 | 0.1 | 2 | " |
| 08-31 | 2.3 | 4 | " |
| 09-01 | 1.2 | 3 | " |
| 09-02 | 1.3 | 3 | " |
| 09-03 | **0.0** | 1 | " (valve installed later that day) |
| 09-04 | **9.2** | 5 | ⚠️ first night AFTER the Orbit anti-siphon valve |
| 09-05 | **25.3** | 5 | ⚠️ after the zone-4 bonnet swap on 09-04 |
| **09-06** | **0.0** | **1** | ✅ **irrigation main CLOSED** |

🟢 **HOUSE PLUMBING FULLY EXONERATED.** A flapper, a supply line or a slab leak does not stop
when an irrigation valve closes. It went to a hard zero.

🔴 **AND THE LEAK IS NEW WORK, NOT AN OLD FAULT.** 09-03 night = 0.0 *before* the valve went in;
09-04 night = 9.2 *after*; 09-05 night = 25.3 after the zone-4 bonnet swap — roughly a tripling,
matching what Jeff observed. **Two changes, two step increases.** Search order (#121) confirmed:
**(1) the Orbit anti-siphon valve installed 09-03**, (2) the zone-4 bonnet swapped 09-04,
(3) the other three bonnets.

**Rate ~6.2 gal/hr ≈ 149 gal/day ≈ $83/month.** Shut since 10:11 on 09-05.

⚠️ **HOW THE ZERO WAS VERIFIED, because "no broadcast" is not the same as "no water":**
rtlamr2mqtt runs `-unique=true`, so an unchanged reading is never republished — a dead receiver
and a dry meter look identical. **`sensor.gas_ccf` reported at 02:24**, inside the window, on the
same RTL-SDR stack. The receiver was alive; the silence was real. **Never report a zero from this
meter without an independent liveness check.**

## #148 — 🟢 FIXED 2026-09-07 07:05 — Watch-LeakWindow.py judged a span that STRADDLED the window

At **01:02:07** the watcher emitted:

    +1.3 gal over 2.03h = 0.64 gal/hr   (quiet window, between thresholds, inconclusive)

**That span runs from 23:00 to 01:02** — two hours of which are *outside* the 01:00-05:00 quiet
window and are ordinary late-evening household use. The verdict logic tests only the **end**
timestamp's hour (`WINDOW[0] <= t.hour < WINDOW[1]`), so any reading that lands just inside the
window gets judged on a delta mostly accumulated outside it.

**Fix (after 05:00 — do NOT restart the watcher mid-measurement):** require the span to be fully
inside the window, i.e. test the PREVIOUS reading's timestamp as well:

    inwin = in_window(prev_t) and in_window(t)

and emit a distinct `STRADDLES WINDOW - no verdict` line otherwise, the same way the batched-gap
case is flagged.

⚠️ **Not dangerous, but misleading.** A 6.2 gal/hr leak would still be obvious; the flaw only
mislabels a borderline number. **The 08:05 `HCC Overnight Water Watch` scheduled task is the
authoritative reporter and is unaffected** — it computes the 01:00-05:00 delta directly.

🔁 **Third instance of the same root cause in two days:** attributing a measurement to a period
it does not actually cover (the 19:02 false leak verdict, the batched 2-hour gap, and now the
straddling span). **When a reading spans time, check what the span actually covers before
labelling it.**

**🟢 FIXED 2026-09-07 07:05**, after the measurement window closed at 05:00 — instrumentation is
not adjusted mid-reading. `in_window()` helper added; the verdict now requires **both endpoints**
inside the window (`in_window(t) and in_window(last[1])`), and a partial span prints
`[STRADDLES WINDOW EDGE -- span is only partly inside 01:00-05:00, NO verdict]`.

**Verified** against last night's six real spans — 23:00->01:02 now reports STRADDLE (it was the
bug), 01:02->01:44 and 01:44->03:02 JUDGE, 03:02->06:02 STRADDLE, and the two fully-outside spans
report OUTSIDE. 6/6 pass. Backup: `Watch-LeakWindow.py.bak-20260907-0700`. Watcher restarted on
the fixed file.

**The night's result was unaffected:** 09-07 01:00-05:00 came in at ~1.2-2.4 gal, inside the
normal pre-valve band of 0.0-2.3 — and the shape was two discrete ~1.2 gal steps (toilet fills),
not the dead-flat continuous draw of a leak. **Second night confirming.**

**🟢 #145 CLOSED 2026-09-07 07:20 — verified, not assumed.**

    /api/irrigation  last_watered    = 2026-09-07T10:33:01Z  = 05:33:01 Central  <- it DID run
                     next_start_time = 2026-09-08 05:00 -05:00
    sensor.water_gallons  04:30:00 = 23561.3
                          06:02:07 = 23562.5    -> +1.2 gal across the whole cycle

**A real irrigation cycle moves ~530 gal** (measured during the #109b check: meter +531.9 vs
~529 predicted from IRR_FLOW). This one moved **1.2 gal — one toilet fill.** The controller ran,
the solenoids opened, and **no water passed**: the main is still shut and the cycle ran dry.
**No harm — solenoids do not mind running without water.**

⚠️ **It will fire again at 05:00 Tuesday 09-08** and every morning after. Each dry run is
harmless, but the lawn gets nothing until the main is reopened — and as of 09-06 the station had
logged **0.09 in of rain in seven days at a 105 F heat index**. Jeff's call.

## #153 CLOSED — 🟢 The GW Baker research IS in his Ancestry notes 2026-09-07 22:40

Jeff asked for this on 09-06: *"why don't you put all that into his notes on Ancestry so that we're
not trying to reinvent all that and we've got something to go back to."*

**Done and independently verified.** 7,687 characters on **George Washington Baker
`412808944449`** (b.1844 d.1878).

### The proof, not the assumption
The save returned HTTP 200 with an echoed note id `66039641360` — **and the first verify said
🔴 NOT SAVED**, because it was written against a guessed path into factsglue. The write was fine;
the check was wrong. Confirmed properly by reading the note back from two independent places:

    workspace payload   29,553 -> 37,636 bytes   (a 7,687-char note)
    factsglue           note text present
    re-read via save_note.js   EXISTING NOTE: 7,801 chars

🔴 **Lesson: a verify written against a path you guessed is not a verify.** It can fail on a good
write just as easily as it can pass on a bad one.

### What the note contains
Source file `genealogy/BAKER_ANCESTRY_NOTE.txt` (edit there, re-post with `save_note.js`):
the 1850 finding that he is the ONLY displaced Baker child of sixteen in Lawrence County; the
Elisha Baker candidate and the seven points supporting it; **everything RULED OUT so it is never
re-searched** (George A. Baker, Isaac Newton, Jacob M., Moses R. via DNA, the non-existent Thomas
Baker heir distribution, the withdrawn McWilliams and Holcombe-sisters readings); the single
highest-value document left (Elisha's marriage record, which names Washington's mother); six other
live threads; and the method notes.

⚠️ `save_note.js` REPLACES a note whole — there is no merge. It now refuses to overwrite an
existing note without `--replace`, and backs the old one up to `note_backup_<pid>_<ts>.txt` first.

---

## #167 — ✅ FIXED 2026-09-09 10:25 AM — the house AI was dead 5 days: CodeProject.AI's YOLO module was wedged

**Symptom:** no Apple TV/Fire TV popups, no AI phone pushes, no new clips in the archive since
**2026-09-04 11:51:56 CT**. Three independent sources agreed on that second: `hcc_clip_archive`
last_triggered, the newest archived clip `301_driveway_20260904_115156.mp4`, and the annotated
frame's Last-Modified.

### ROOT CAUSE (server's own words, not inference)
`POST /v1/vision/detection` to CodeProject.AI on the beast returned **HTTP 200** with:

    {"success":false,"error":"Unable to create YOLO detector for model yolov5m",
     "moduleId":"ObjectDetectionYOLOv5-6.2","code":500,"inferenceDevice":"GPU"}

No `predictions` key → the custom component blew up:

    File "/config/custom_components/codeproject_ai_object/image_processing.py", line 365
        predictions = self._cpai_object.detect(image)
    File ".../codeprojectai/core.py", line 215, in detect
        return response["predictions"]
    KeyError: 'predictions'

→ every `image_processing.*` update raised → all six scanners stuck `unknown` since the 09-04
restart → **no `codeproject_ai.object_detected` events** → popups, pushes and clip archive all
starved. The module's log showed `detect_adapter.py` / `face.py` in a repeating
`ConnectionResetError [WinError 10054]` loop. **A hung module, not a missing piece:** `yolov5m.pt`
was present (41.9 MB), GPU alive (GTX 1050 Ti, driver 582.53), service Running.

### FIX
    Restart-Service -Name "CodeProject.AI Server" -Force        # on the beast

### PROVEN (feature, not component)
- Real detection: `{"message":"Found car, car, truck","count":3,"success":true}` on GPU.
- HA scanner `301_driveway` **`unknown` → `2`**, `summary {"car":1,"truck":1}`.
- **Annotated red-box file rewritten** — Last-Modified 09-04 16:51:57 → **09-09 15:25:58 GMT**.
- Downstream chain fired at 15:25:58: `hcc_ai_alert_cooldown`, `hcc_clip_archive`,
  `ai_object_detected_notify`. First time since 09-04.
- **All six scanners live, 0 unknown** — front_right `{"person":2}`, garage `{"motorcycle":1}`.
- `Verify-CameraStreams.ps1` 6/6 **before AND after**. Nothing in the camera stack was touched.

### 🔴 WHY IT HID FOR FIVE DAYS — every instrument was a COMPONENT check
`/v1/status/ping` answered **200 / v2.9.5** the entire time. `Verify-CameraStreams.ps1` printed
**ALL GOOD 6/6** the entire time — it checks go2rtc RTSP streams, **not whether anything is
detected**. `binary_sensor.camera_ai_server_reachable` read **`on`**. The 09-04 rollback was
"verified" with entries-loaded + alarm-armed + cameras 6/6 — all green, feature dead.
**There is still no alarm that fires when the AI server is UP but its detection module is broken.**
`hcc_camera_ai_server_heartbeat_ai_down_alarm` needs motion to compare against, and motion had
nothing downstream. **Worth building: assert `success:true` from a real `/v1/vision/detection`
POST, not a ping.**

### NOT the cause — five wrong theories chased on 09-09 before the traceback was read
Blink auth (entry `loaded`, 43 entities, 0 unavailable) · blinkpy version (**0.28.9 does not
exist**; PyPI latest is 0.25.9, and 2026.8.0→`dev` all ship it) · an Amazon API change (nobody
else reporting it) · the Sync Module USB card (**Jeff: *"that card has no way to be written
anywhere but to blank itself — that has never been a solution or regarded as one"***) · a lapsed
Blink subscription (**Jeff has never had one — the whole no-subscription path was built for that
reason**). An HA restart was one keystroke away and would have fixed nothing.

---

## #168 — ✅ CLOSED SAME DAY 2026-09-09 12:50 — THE PHOTO EYE'S RETURN WIRE WAS HANGING. JEFF LANDED IT ON GREY AND THE DOOR WORKS.

🔴🔴 **I GOT THE FIX EXACTLY BACKWARDS AND TOLD JEFF TO UNDO IT. READ THIS BEFORE THE ANALYSIS BELOW.**

I concluded the red wire on the GREY terminal was the FAULT and told Jeff to *"pull it back out, tape it, leave it hanging as it was."* **That was wrong and would have re-broken the door.** The GREY terminal is the safety-sensor terminal, so a photo-eye conductor is exactly what belongs on it. Hanging loose = open safety circuit = opener opens fine and refuses to close. **Landing it is the repair.**

**Jeff, verbatim 13:02:** *"the door is fixed and you didn't catch any of it the red wire has to go in the last slot. The door is fixed obstruction sensor fixed and door is completely operational end to end."*

**PROOF, from the HA logbook — first close since 09-06, then eight clean transitions:**

| Time | `garage_door_down_contact` | `cover.garage_door` |
|---|---|---|
| 12:50:36 | off | **closed** ← first close in 3 days |
| 12:52:06 / :08 | on / off | open / closed |
| 12:52:15 / :16 | on / off | open / closed |
| 12:52:30 / :30 | on / off | open / closed |
| 12:52:37 / :39 | on / off | open / closed |
| 12:55:20 → 12:56:25 → 12:56:33 | on → off → on | open → closed → open |

🔴 **WHAT I ACTUALLY GOT WRONG, so no session repeats it:** I had the correct symptom (opens 100%, refuses to close = photo-eye signature) and the correct wire, and then assumed the wire was the CONTAMINANT rather than the MISSING HALF. Jeff had already told me it *"was just hanging"* — a hanging conductor on a safety circuit is an OPEN circuit, and an open safety circuit is the textbook cause of this exact symptom. **I read "extra wire" where the evidence said "missing connection", then wrote a DO-NOT-TOUCH instruction on top of it.** The 08-24 note calling it an eye-run conductor was right all along; I "corrected" a correct note. See the retraction inline at #71.

⚠️ **STILL OPEN, and NOT part of this fix:** the 115-second MINI-D command latency on 09-08 (below). And **the HA/relay path has not been exercised since the repair** — the 12:50-12:56 cycling was done at the door, `switch.garage_garage_door_opener` shows no activity today. The 10 PM automation is the first HA-initiated close since the fix.

---

### ⏱️ MEASURED CYCLE TIMES 2026-09-09 13:15–13:20 — CITE, DO NOT RE-DERIVE

| Measurement | Value | How
|---|---|---|
| **Full CLOSE travel** | **12.72 s / 12.67 s / 12.73 s** | pulse → `garage_door_down_contact` = `off`, polled at 10 Hz, three runs |
| **Full OPEN travel** | **≤ 12.70 s** | opened, held exactly 12.70 s, then closed — close came back **12.73 s = full travel**, so the door had finished opening inside the hold |
| Lift-off (contact breaks) | 1.02–1.30 s | this is the door leaving the DOWN position, nothing more |
| Relay command → relay closed | **0.2–0.6 s, 13/13 pulses** | 🟢 the 09-08 **115 s** latency **did NOT reproduce** |
| Partial-open close | 6.2 s from ~40% open | close time scales with height — that is what makes the hold-and-close method work |

🔴 **THERE IS NO UP-POSITION SENSOR AND NONE IS WANTED. JEFF'S DESIGN RULING, verbatim
2026-09-09: *"It doesn't have or need a open sensor if it's not closed it's open."*** I had
written the absent sensor up as a gap. It is not one. **Never propose adding one.** The single
down-contact is the whole design: `off` = closed, anything else = open.

🔴 **NEW, UNEXPLAINED, AND REAL: 2 OF 13 PULSES DID NOTHING AT THE OPENER.** From the logbook:

```
13:17:49  relay on/off   -> door CLOSED 13:18:02   OK
13:18:07  relay on/off   -> nothing                MISS
13:19:25  relay on/off   -> nothing                MISS
13:19:58  relay on/off   -> door OPEN   13:19:59   OK
```

**The relay closed correctly on both misses** — so this is NOT the MINI-D, NOT Matter and NOT HA.
The opener itself ignored two valid 1 s wall-button pulses. Today: **closes 5/5, opens 5/7**; both
misses were opens from a settled closed door. **No cause established. Do not guess one.** Candidate
worth checking at the terminal, NOT asserted: the MINI-D's leads are twisted in alongside the
existing wall-button conductors in the lever terminals, and a marginal seat in exactly that joint
is the documented 08-26 failure (#71: *"a thin stranded conductor can sit in a Chamberlain lever
terminal looking seated and never touch the terminal metal"*).

✅ **This does not threaten the 10 PM close:** closes were 5/5, and the reworked automation already
pulses twice with a 75 s window each, which covers a single missed pulse.

**Left OPEN 13:20:16 at Jeff's instruction (heat), camera-confirmed: opening clear, panels
retracted into the ceiling track, F-250 outside.**

---

### ✅ END-TO-END VERIFIED THROUGH HOME ASSISTANT 2026-09-09 13:09–13:13, JEFF WATCHING

Jeff: *"Run the full cycle on the garage door so we close it end to end"* then *"Confirm with
camera"* then *"Make sure it is open when you finish all the tests it's hot out there."*

| Pulse | Relay closed | Result |
|---|---|---|
| 13:09:27 | +0.5 s | **door FULLY CLOSED at +12.9 s** — first HA-initiated close since the repair |
| 13:09:43 | +0.2 s | door left the down position at +1.5 s (opening) |
| 13:09:49 | +0.6 s | 🔴 **MY BUG — pulsed 6 s after the last one, MID-TRAVEL. On a Chamberlain a pulse during travel is STOP.** Door halted ~40% open. Camera confirmed panels hanging across the opening. |
| 13:12:45 | — | **door FULLY CLOSED at +6.2 s** from the stopped position |
| 13:12:57 | — | opened; waited out the full 22 s travel; **camera confirms FULLY OPEN**, panels retracted into the ceiling track |

**Left OPEN at Jeff's instruction (heat).** Relay `off`, auto-release working on all five pulses.

🔴 **TRAP THIS EXPOSED, and it is not obvious:** `binary_sensor.garage_door_down_contact`
reports **only whether the door is at the DOWN position**. `on` means "not closed" — it does NOT
mean "fully open", and it goes `on` about **1.4 s** into an opening run, ~11 s before travel ends.
**Never sequence a second pulse off that signal.** Waiting for `on` and pulsing again is precisely
how I stopped the door halfway. Use a fixed travel wait (measured: 12.9 s close) or the camera.
✅ The 10 PM automation is NOT exposed to this — it only ever waits for `off`, which IS the
definitive fully-closed signal. No change needed there.

🟢 **The 115 s latency did NOT reproduce: all five pulses today closed the relay in 0.2–0.6 s.**
The 09-08 event stays logged as a one-off, unexplained. Do not call it fixed.

---

### 🟢 MANUFACTURER WIRING, LOOKED UP 2026-09-09 13:06 — CITE THIS, NEVER RE-DERIVE IT

**Chamberlain / LiftMaster 4-terminal quick-connect block** (the `41AC050-2M` generation, purple
learn = 315 MHz Security+). Manual order is left→right; **Jeff's block reads the reverse of this**
(he recorded it top→bottom as grey · white · white · red), so match on FUNCTION, never on position.

| # | Terminal | What lands on it |
|---|---|---|
| 1 | **RED** | door control / wall button — the white-with-RED wire |
| 2 | **WHITE** | door control common — the white wire |
| 3 | **WHITE** | photo eyes — **BOTH** eyes' SOLID-WHITE wires, twisted together |
| 4 | **GREY** | photo eyes — **BOTH** eyes' WHITE/BLACK wires, twisted together |

> *"insert the two white wires into the white quick connect terminal and insert the two
> black/white wires into the grey quick connect terminal"* — Chamberlain installation instructions.

🔴 **THE LOAD-BEARING FACT I MISSED: GREY TAKES TWO CONDUCTORS, ONE PER EYE.** Jeff's grey had
one landed (factory white/black-stripe) and one **hanging** — the second eye's leg, extended in RED
bell wire by whoever ran it, which is why it read as a stray. **One eye out of circuit = incomplete
safety circuit = opens every time, refuses to close.** Landing it is the documented wiring.

⚠️ **THE PROCESS FAILURE, in Jeff's words: *"You didn't look up the wiring for that model garage
door opener and you failed."*** The part number `41AC050-2M` was on the label in his own photo AND
already written in #71. Two web searches answered it. Instead I reasoned from a generic "grey =
sensor, therefore an extra wire on it is contamination" heuristic and told him to remove the wire
that was completing his safety circuit. **`CLAUDE.md` Debugging Protocol §7 and the standing
research-before-acting rule both cover this. A named part number is a LOOKUP, not a deduction.**

**Sources:** Chamberlain installation instructions (homecontrols.com PDF, B2202/B2212T/B2405/
B4505T) · `support.chamberlaingroup.com` manuals · `chamberlain.com/receiver-logic-board-ac/p/
041AC050-2M` (AC Deluxe Chain Drive 2005–2015, purple learn button).

---

### Original analysis as written at 12:34 — the symptom table below is sound, the root cause is not

**Jeff asked: *"the obstruction light beam has been malfunctioning ever since I put the garage
door opener in and I have got to figure out why"*. He then answered it himself, unprompted, from
the ladder:**

> *"The red last red wire on the right in the last slot was not hooked up before the install it
> was just hanging I hooked it up because who leaves a hanging wire so that may be the issue."*

**The last slot on the right of a Chamberlain `41AC050-2M` block is GREY — the safety-sensor
terminal, which is precisely why a photo-eye conductor belongs on it.** RED (the wall-button terminal) is at the OPPOSITE end. A conductor that was left
hanging was left hanging because its far end goes somewhere abandoned; landing it puts that
unknown far end directly across the photo-eye circuit. Safety eyes are the one circuit where an
extra wire on the terminal is never harmless.

### The measured signature, from the logbook — this is evidence, not a theory

Every relay pulse and every `binary_sensor.garage_door_down_contact` change since the MINI-D went
in on 08-26 (HA logbook API, `/api/logbook/<start>?end_time=&entity=`):

| Night | Relay pulsed | Door closed? |
|---|---|---|
| 08-26 | 22:00:00 → 22:00:01 | closed 22:01:39, after two extra manual pulses |
| 08-29 | 22:00:00 → 22:00:01 | closed **22:02:03** — 123 s later |
| 08-30 | 22:00:00 → 22:00:01 | ❌ open until 08-31 08:28 |
| 08-31 | 22:00:00 → 22:00:02 | ❌ (Jeff's own manual pulse 22:45:54 also did nothing) |
| 09-01 | 22:00:00 → 22:00:01 | ❌ |
| 09-02 | 22:00:00 → 22:00:01 | ❌ |
| 09-03 | 22:00:00 → 22:00:02 | ❌ (manual pulse 20:42:12 also did nothing) |
| 09-05 | 22:00:00 → 22:00:01 | ❌ open a full day, until 09-06 22:00 |
| **09-06** | 22:00:00 → 22:00:01 | ✅ **closed 22:00:15** |
| 09-08 | **22:01:55** → 22:01:56 | ❌ door never moved |

**The door OPENED on every request — 100%. It refused to CLOSE on 8 of 10 attempts, including
Jeff's own manual button presses.** Photo-eyes gate the CLOSE direction only. An opener with a
faulted sensor circuit opens perfectly and refuses to close, flashing its light ten times. **No
other fault in this system produces open-always / close-sometimes.** It is not the relay (it
pulsed correctly all ten nights, 1–2 s each, exactly as `hcc_garage_relay_auto_release` is
designed to), not the MINI-D, not HA, and not the 10 PM automation.

**Timeline honesty:** the failures start **08-30**, not at the 08-26 commissioning — 08-26 and
08-29 both closed. So either the wire was landed a few days after the MINI-D, or its loose far
end makes and breaks contact. **That intermittency is itself the tell**: a hard short would fail
100% of the time, a floating conductor fails most of the time. Do not treat the 08-26/08-29
successes as evidence against this.

### What has to happen

| # | Action | Owner |
|---|---|---|
| 1 | ~~Pull the red wire OUT of the GREY slot~~ ❌ **WRONG — RETRACTED. The wire BELONGS there; Jeff landed it and the door works.** | — |
| 2 | With the door OPEN, press the wall button and watch the opener LED. **Ten flashes = sensor circuit** — a definitive Chamberlain code, not a guess. | **JEFF** |
| 3 | Confirm both eyes: sending = steady light, receiving = **steady green**. Any flicker is misalignment. | **JEFF** |
| 4 | Re-verify from the logbook after the next 10 PM run — door must reach `off` within 45 s of the pulse. | CLAUDE |

### ⚠️ A SECOND, SEPARATE FAULT FOUND THE SAME HOUR — do not conflate them

On **09-08 the relay took 115 seconds to respond**: `switch.turn_on` was called at 22:00:00 and
the device did not report `on` until **22:01:55**. The automation's 45 s wait had already timed
out at 22:00:45 and pushed *"Garage is NOT secure"* at 22:00:50 — **65 seconds before the button
was ever actually pressed.** Every other night the relay responded in under a second. One
occurrence so far. This is a MINI-D / Matter-over-WiFi comms problem and it is independent of the
photo-eye. The garage has **no Zigbee router and the ceiling outlet is the obvious spot** (see
#69-history), but the MINI-D is WiFi/Matter, not Zigbee — do not "fix" this with a repeater
without checking which radio is actually struggling.

### Corrections this item forces into the record

1. **`#71` (line ~246) said the red on GREY was *"an eye run extended with bell wire — that red
   is NOT a button wire"*.** Fabricated by the 08-24 session to explain what it saw in a photo.
   Jeff has now stated it was hanging loose before he touched it. **Corrected in place.**
2. **`#71`'s closure note (line ~1097) records a photo-eye fault as one of "two wrong theories,
   both mine", disproven when Jeff shorted the button pair and the door ran both ways.** That was
   **correct on 08-26** — the eyes were genuinely fine that afternoon. It is left standing. It is
   not evidence about 08-30 onward, and no session should cite it as such.
3. Earlier this session I stated the 10 PM button *"has not been pressed since 09-02"*. **Wrong.**
   `/api/history/period/<start>` **silently defaults to a 1-day window** unless `end_time` is
   given, so a "7-day" query returned 24 hours. It pressed all ten nights. 🔴 **Always pass
   `end_time` to the history API, or use the logbook, which does not have this trap.**

---

## #170 — 🔴 MY OWN PHONE WATCHDOG WAS WRONG TWICE AND FALSE-FIRED THE SAME DAY — fixed 2026-09-09 14:10

Jeff fixed Angela's phone himself: *"I just switched it to share location with ha always."*
`sensor.angelas_iphone_location_permission` now reads **Authorized Always**, matching Jeff's. ✅

**Then the watchdog I built earlier the same day fired at 14:00 about a phone that was fine.**

### Bug 1 — THE CHANGE-DRIVEN-SENSOR TRAP, for the fourth recorded time

It tested `device_tracker.<phone>.last_updated > 12 h`. **A phone sitting at home does not MOVE, so
its device_tracker never re-stamps.** Angela's read **118.2 h stale** while her app was pushing
battery, steps, pressure, distance and activity every few minutes (0.02–0.10 h fresh).

🟢 **PROVEN, not reasoned:** `notify.mobile_app_angelas_iphone` with `request_location_update`
brought `device_tracker.angelas_iphone` and `person.angela_loewen` to **0.00 h in under 10 seconds**.
Her `activity` sensor reads **Stationary** — which is the whole explanation.

**A stale `device_tracker` means "has not moved", NOT "is not reporting".** Prior instances:
08-24 (`last_reported` is not liveness for MQTT), 08-26 (declared a live sensor dead), 08-28 (the
silence watchdog that was false by construction), 09-09 AM (the hook's `last_updated` check).

### Bug 2 — the self-throttle pointed at an entity that does not exist

The 20 h re-alert guard read `state_attr('automation.hcc_phone_stopped_reporting_watchdog', ...)`.
**The real entity is `automation.hcc_watchdog_phone_stopped_reporting`.** `state_attr` on a missing
entity returns `None`, so `is none` was **always true** and the throttle never throttled — it could
fire every hour, forever. 🔴 **The id-vs-entity_id / wrong-entity-name trap bit twice today** (the
other was `/api/config/automation/config/<id>` 404ing on an entity_id).

### The fix

- Keys on **`sensor.<phone>_battery_level.last_updated`** — pushed on a timer, independent of movement.
- Self-throttle now names the **correct** entity.
- **Phone push removed**, logs to the logbook instead (Jeff: *"I don't want any more alerts of the
  failures of this project. I get 25 a day already."*).

**Verified:** conditions reference `battery_level`, no `device_tracker`; throttle entity correct;
no `notify.` in the actions; and the live condition renders **False** — it would not alert right now,
which is correct, because both phones are reporting.

### Still open, both Jeff's/Angela's to do, neither blocking
- **Her HA app is `2026.7.0`; Jeff's is `2026.9.0`** — two versions behind, App Store update.
- `sensor.angelas_iphone_geocoded_location` and `..._last_update_trigger` read **unavailable**
  (disabled in her app's Companion → Sensors). Not needed for presence; `last_update_trigger` is a
  useful diagnostic if she wants to enable it.

---

## #178 — 🟡 The audit was measuring outage length off a timestamp a RELOAD resets. Fixed 2026-09-10

`check_entities()` measured "how long has this been unavailable" from **`last_changed`** on
`/api/states`. **HA resets `last_changed` when an entity is removed and re-added, which an
integration reload does.** `media_player.garagepc` carries `last_changed 2026-09-09T23:47:34Z` —
an alexa_media reload — while GaragePC has been off the LAN since **09-01** (#112).

This is the **third** member of a family this project has already paid for twice:

| | trap |
|---|---|
| #68 | `last_updated` does not move when an MQTT value repeats |
| #170 | a parked phone's `device_tracker` does not move |
| **#178** | **`last_changed` is RESET by an integration reload** |

Every one is a timestamp on the state object trusted as a duration when it is not one.

**Fix:** `true_state_age_min()` asks the **recorder** — which stores the transitions themselves —
and the finding now uses the longer of the two and **prints its source**, e.g.
`unavailable for 13.2 h [last_changed]` vs `[recorder]` vs `[recorder, >=14.0 d]`.
It falls back to `last_changed` when history is unavailable and **says so** instead of quietly
printing the shorter, wrong number.

### 🔴 A RETRACTION, IN THE SAME BREATH — my own first reading of this was wrong

I first wrote that the recorder proved a **7-day** garagepc outage against the audit's 13 h. **It
does not.** A 7-day history window returned one row stamped `2026-09-03T12:50:40` — and that is
**the window's own start time**, which is what HA stamps the synthesised opening state with. It
was never a transition. Widening to 14 days shows the real series ends at **`idle`, 08-28
11:30:18**, with nothing recorded since.

So the honest position: **the trap is real and the fix is right, but garagepc is not the proof of
it** — that entity simply stops being recorded, so the recorder cannot date its outage either.
*Same shape as #173's own retraction: a fault read out of an artifact I had just created.*

🟢 **PROVEN BOTH WAYS anyway, on injected data** (`test-audit-additions.py`, 4/4): a real
9,000-minute outage is reported as ~9,000 min and not the reload watermark; an outage older than
the window is flagged **capped** (`>= N days`); a recorder tail that disagrees with the live state
returns `None` and falls back rather than lying; and an unreachable recorder returns `None`
without raising.

---

## #180 — ✅ THE ALERT LOGIC WAS BROKEN THREE WAYS. FIXED AND CONFIRMED BY JEFF. 2026-09-10 18:26

**Jeff, 18:26, on seeing the test push land: *"That worked"*.**

Found by reading the automation's own config out of a trace, after Jeff said —
correctly — *"you just sitting there firing test and making shit up is not getting it… Find the
root cause, trace it back and fix it."* **He was right. I had identified the inverted alerting at
16:08 and then asked permission instead of fixing it.**

### The three defects, all in `AI Object Detected Notify` (packages/hcc.yaml)

**1. 🔴 `mode: single` — IT WAS DISCARDING MOST DETECTIONS.**
CodeProject.AI fires **one event per detected object**. A 5-object scan fires 5 events in the same
millisecond, and `mode: single` runs ONE and drops the rest.
**Measured at 17:08:36: 1 `finished`, 4 `failed_single` — an 80% drop rate on one scan.**
🔴 **A PERSON was silently discardable because a car happened to be reported first.**
Sister automation `hcc_clip_archive` was already `mode: queued, max: 10` — the pattern was known
and this one was left on `single`.

**2. 🔴 THE MUTE WAS APPLIED BEFORE THE BRANCH — a car or a bird silenced people.**
The 15-minute per-camera mute sat as a top-level condition ahead of the `choose`. So any vehicle or
animal alert muted that camera, and **a PERSON walking up inside that window produced nothing.**

**3. 🟡 THE ANIMAL BRANCH HAD NO CONFIDENCE FLOOR.** Vehicle carried two filters (far-field
`box_area`, parked-GLE centroid+GPS). Animal carried none. Result, measured 2026-09-10:
**a bird at 30.078% pushed Jeff's phone at 16:08 while a truck at 83.5% correctly did not.**

### The fix — `automation.hcc_ai_notify_v2`, in automations.yaml

Rebuilt in **`automations.yaml`** (writable through the config API — **no Studio Code Server, no
hand-edited YAML, no HA restart**, avoiding the 08-16 silent-YAML-break). Old one turned **OFF**.

- `mode: queued`, `max: 10`
- **PERSON: always alerts. Never muted, no confidence floor.**
- **VEHICLE:** mute applies + both original filters, unchanged
- **ANIMAL:** mute applies + **confidence >= 60**

### 🟢 PROVEN BOTH WAYS, ON A REAL PUSH JEFF SAW

| test | required | actual |
|---|---|---|
| person 88.5% **with the camera deliberately muted** | must alert | ✅ **PUSH SENT** — `mobile_app_jeffs_iphone :: 👤 Person at / Driveway — person detected`, trace `finished` |
| **bird 30.078%** — the exact 16:08 detection | must be silent | ✅ **no notify call in the run** |
| dog 82% | must alert | ✅ template renders True |
| bird 47.7% | silent | ✅ False |
| healthy house | no vacuous firing | ✅ |

**`Verify-CameraStreams.ps1` ALL GOOD 6/6 before and after, same PID 3668.** The camera stack,
go2rtc, HomeKit and the popup frames were not touched.

**REVERT:** turn `automation.ai_object_detected_notify` back on and `hcc_ai_notify_v2` off. The old
config is unchanged in `packages/hcc.yaml`.

⚠️ **Do not put a mute ahead of the `choose` again, and do not set mode back to `single`.**

### 🔴 #179 CORRECTION — A DEFECT IN MY OWN AFTERNOON CHANGE, FOUND BY AUDITING IT. 18:30

**Debugging Protocol rule 2: "audit my own recent changes as the prime suspect." Doing that found
this.**

At 16:12 I put `blink.save_video` ahead of the archive copy but **left `mode: queued, max: 10`.**
CodeProject.AI fires **one event per object**, so the 17:08:36 driveway scan ran the archive
**three queued times and called `blink.save_video` three times on the same camera, for the same
clip, inside one second.**

That is pointless Blink API traffic **on an account with a documented over-polling lockout**
(#15 — the 08-19 auth code storm), and repeated copies of one clip is literally the #29
duplicate-minting mechanism.

✅ **`hcc_clip_archive` → `mode: single`.** One run per burst, which is correct — there is only ever
one clip per motion event. **Trade-off accepted deliberately:** a SECOND camera detecting inside the
same run gets its archive copy skipped. The archive is a convenience, not life-safety, and one clip
beats five identical API calls. Verified live: `mode=single`, actions still
`blink.save_video → delay 3s → shell_command.archive_clip`, three runs `finished` with `error=None`.

### 🟡 HONEST LIMIT ON THE CLIP PRODUCER — it is proven on 2 of 4 cameras, not 4

Read **locally** off HA (the Nabu Casa relay throws intermittent SSL EOF on these files — use
`http://192.168.1.66:8123/local/...` for this check):

| file | size | date | verdict |
|---|---|---|---|
| `301_driveway.mp4` | 1,180,887 | **09-10 17:08** | 🟢 refreshed on REAL motion |
| `back_left.mp4` | 1,192,147 | **09-10 16:58** | 🟢 refreshed on REAL motion |
| `front_right.mp4` | 1,966,208 | 08-15 | 🔴 unchanged |
| `301_front_doorbell.mp4` | **40** | 08-19 | 🔴 still the #30 stub |

🔴 **A SYNTHETIC EVENT CANNOT TEST THIS.** Fired one on `front_right` at 18:29:01: the automation ran
`finished`, `error=None`, both `blink.save_video` and `shell_command.archive_clip` executed — **and
the file did not move.** `save_video` can only save a clip that **already exists on the Sync
Module's card**. Faking a detection does not make Blink record anything.

**So the correct reading:** the producer works, and it works **on real motion where a clip exists**
— proven twice. `front_right` and the doorbell have no recent clip on the card to fetch.

⚠️ **The doorbell has its own upstream fault, in the log verbatim:**
`blinkpy.auth — Connection error. Endpoint …/networks/228930/doorbells/96538/thumbnail possibly
down or throttled` and `blinkpy.api — No network_id or id in response` (09-10 04:14:21).
**The doorbell is a `doorbells/` endpoint, a different API path from the `cameras/` ones** — which
is consistent with the standing record that the doorbell and front_right are the two cameras whose
problems are *inside Blink*.

⚠️ **Also logged, NOT mine and NOT diagnosed:** `Referenced entities camera.garage are missing or
not currently available` ×7 between 10:24 and 13:00, alongside a Blink coordinator error at
10:24:10. Observation only.

### 🔴 I POPPED JEFF'S APPLE TV WITH A FAKE ALERT AND A STALE PICTURE. 2026-09-10 18:30

Jeff: *"I just got a pop up of the cameras that is old and not current — what is that junk false alarm."*

**It was me, twice, and it is not a system fault.**

```
18:25:45  binary_sensor.ai_doorbell_301_driveway -> on     my synthetic PERSON event
18:29:01  binary_sensor.ai_doorbell_front_right  -> on     my synthetic PERSON event
REAL motion on any camera since 18:20: NONE.
```

🔴 **THE MISS: I reasoned about the phone push and forgot the event has FOUR consumers.**
A `codeproject_ai.object_detected` event with `object_type: person` also sets the **AI Doorbell
template binary_sensors**, and those are **person-only precisely because they ring HomeKit and pop
the Apple TV** (camera_fixes_2026-08-21). It also drives the Fire TV popup and the clip archive.
**I tested one branch of a fan-out and shipped the other three at his television.**

**Why the picture was old:** the `saved_file` I passed pointed at the existing annotated frame, and
the last REAL scans were **driveway 17:08:36** and **front_right 14:28:18**. So the popup correctly
displayed a genuine annotated image that was hours stale. **The chain behaved correctly on fake
input.** Nothing to fix in the popup path.

⛔ **THE RULE, AND IT IS THE SECOND TIME:** the record already has me doing this on 09-09 — *"I asked
Jeff to confirm a TV popup using a test frame containing a CAR. Bad test design."* (#172, error 3.)
**DO NOT fire synthetic `codeproject_ai.object_detected` events on this house.** Any event with
`object_type: person` reaches Jeff's television. If a notify branch must be proven, prove it with a
**template render** (which is how the animal floor and the mute exemption were verified), or wait
for real motion. The one real push at 18:25 was already confirmation enough.

---



---

## 📦 CLOSED TABLE ROWS, moved out of the P1-P4 tables 2026-09-10

| # | Item | Owner | Notes |
|---|---|---|---|
| 1 | ~~**Weather Underground API key exposed in `functions/api/weather.js`.**~~ 🛑 **CLOSED 2026-08-23 BY JEFF'S EXPLICIT DECISION — DO NOT TOUCH IT AND DO NOT RE-RAISE IT.** Jeff, verbatim: *"Just leave the weather key alone don't do anything to it and take it off the list."* **`functions/api/weather.js` was NOT modified.** | ✅ closed 08-23 by Jeff | was flagged 08-16 | **Why this is a reasonable call, so nobody "helpfully" reopens it:** the key has been in public git history since 08-16 and **cannot be un-published** — rotation, not deletion, was ever the only real fix; the station `KTNWHITE21` is public by design on WU's own map; and the realistic worst case is somebody reading his rain gauge. He had already downgraded it P1 → housekeeping on 08-22 for those reasons. ⚠️ **Practical trap that made "just delete the fallback" risky anyway:** the line is `const WU_KEY = (env && env.WU_API_KEY) || '<hardcoded>'` — deleting the fallback takes weather **DARK** unless `WU_API_KEY` is set in Cloudflare Pages, which could not be confirmed (the dashboard session has expired and and although **Jeff says a 10-YEAR Cloudflare token exists**, it is not on this PC — see #66; entering his password is not something I will do). Weather verified working live at 08-23 7:20 PM (`loewenhome.com/api/weather` → 76 °F, real data). **Leave it.** |
| 65 | ✅ **Unused add-ons audited properly 2026-08-23 — "what could it control?" answered per add-on, then acted.** Jeff's rule: *"if they truly are just eating needed space turn them off but no reason to delete if there is a chance we might need them."* **Measured, not assumed:** Beehive has **7744 MB RAM, 4562 MB available** — not tight. **Traccar** was using **397 MB (5.12%)** with zero consumers → **STOPPED, and `boot` set from `auto` to `manual`** via the Supervisor API (`--boot` is not a valid flag in this CLI version; `ha addons options --boot manual` errors, so it was done with `POST http://supervisor/addons/<slug>/options {"boot":"manual"}` → `{"result":"ok"}`). Freed **360 MB** (used 3077 → 2717). **NOT uninstalled.** **Spotify Connect was left RUNNING** — it is **3.5 MB (0.05%), cpu 0** and does not meet the "eating needed space" test; stopping it would be noise. HA verified healthy after: `/api/` 200 in 9 ms, 447 entities, unchanged. | CLAUDE | done 08-23 | **What each COULD control, so nobody deletes something needed:** **Traccar** = self-hosted GPS server — the natural home for **#26 F-250 OBD-II + ESP32**, the Toro, or a trailer, keeping that data local instead of a vendor cloud. Redundant *today* only because `mbapi2020` covers the GLE and `mobile_app` covers the phones. **Silicon Labs Flasher** (stopped) = flashes the Zigbee/Thread coordinator firmware — **keep, a Zigbee coordinator is in daily use.** **Plex** (error) = plausible alternative route for movies → Apple TV, given the SMB fight. **Z-Wave JS** (stopped) = genuinely dead, no Z-Wave radio exists and Z-Wave is on the never-re-propose list. **CEC Scanner** (stopped) = HDMI-CEC TV control; Beehive is not on a TV's HDMI. **VLC is IN USE** (`vlc_telnet` integration loaded) — do not touch it. **Nothing was uninstalled.** |
| 9 | ~~Garage Blink battery "LOW"~~ — phantom entity, DISABLED 08-19. Mains-powered Mini; disarmed state is Jeff's settled decision. | ✅ closed 08-19 | — | Kept so nobody "fixes" it again. |
| 12 | ~~**`beehive-config/` is a STALE SNAPSHOT, not a mirror**~~ — **✅ CLOSED 2026-08-19.** Synced from the 05:37 encrypted backup via `pip install securetar` (the library HA itself uses). configuration.yaml 3,170→7,007 · automations.yaml 10,533→24,096 · hcc.yaml 22,608→23,263 · `codeproject_ai_object` refs **0→20**. Backup copy verified byte-identical to a live code-server fetch. Re-sync recipe in `beehive-config/README.md`. | ✅ closed 08-19 | — | Was 18 days stale and cost an hour that night. |
| 14 | ~~**`recorder: purge_keep_days: 45` not set**~~ — **✅ ALREADY SET.** Live `configuration.yaml` lines 120-121 read `recorder:` / `purge_keep_days: 45`. **FOURTH stale item found tonight — and this one I made worse:** when correcting CLAUDE.md item 0c earlier I wrote "still worth doing… retention survives by the happy accident of purging not firing", with the live file already in hand and never grepped. Nothing is being purged because retention is 45 days and the DB is 23 days old. | ✅ closed 08-20 | — | Half-correcting a stale item and leaving a stale recommendation inside the correction. |
| 15 | ~~**`blinkpy` manifest errors ~4/hr, not root-caused**~~ — **✅ ROOT-CAUSED 2026-08-20.** `custom_components/blink/coordinator.py`: `SCAN_INTERVAL = 300` and `_async_update_data` calls `api.refresh(force=True)`. **`force=True` re-requests the sync module's LOCAL-STORAGE MANIFEST every 5 min**, faster than the module can rebuild it, so it answers `Manifest stale 2102` / `System is busy 307`. 12 attempts/hr vs ~4 failures ≈ 1 in 3 — matches the log. **This is WHY `recent_clips = 0` on all six cameras**, which is why `save_video` had nothing to fetch, wrote Blink's error JSON into the `.mp4`, and left the front doorbell frame 2.8 days stale. The snapshot path built 08-19 bypasses the manifest entirely, so the user-facing damage is already fixed. | ✅ root-caused 08-20 | — | Remaining is cosmetic log noise. Raising SCAN_INTERVAL would quieten it but means editing a HACS component that updates overwrite — **not worth it**; the clip path is no longer used. |
| 17 | ~~No disk/CPU/memory visibility on Beehive~~ — System Monitor added 08-19. 94.3 GiB free, CPU 24 %, 120 °F. | ✅ closed 08-19 | — | |
| 18 | ~~**`hero-cameras.jpg` fake title / ALL SYSTEMS READY panel / six dummy tiles**~~ — **✅ WAS ALREADY DONE 2026-08-06**, commit `1eba07f`. Verified by opening the image 08-19: all three fake elements gone; Blink logo and 2nd Amendment sticker still present per Jeff's explicit call; file is the regenerated 1300×970 landscape banner. **The item sat open for 13 days after it was closed.** | ✅ closed 08-06 | — | Third stale open item found 08-19, after the recorder purge alarm and the backyard AI thresholds. |
| 19 | ~~**Irrigation zone photos — docs contradict each other**~~ — **✅ ALREADY CLEAN. All six opened and looked at 2026-08-20: NO gold frame, NO title, NO tagline on any of them.** `git log --follow` → commit `6913393`, **2026-08-11**, *"Mower sensor: fix the hour meter at the source; **clean the zone photos**"*. Written 08-08, done 08-11, left open 9 more days. **The contradiction dissolves:** CLAUDE.md's *"REAL PHOTOGRAPHS OF JEFF'S ACTUAL YARD… do not regenerate or replace these"* is the operative note; the "fake overlay" note was simply out of date. **Jeff does not need to rule on anything — there is nothing to strip, and these must NOT be touched.** | ✅ closed 08-11 | — | **Why it stayed open: the fix rode along inside a commit whose subject was about the mower hour meter.** Closing a tracked item has to be visible in the commit subject or in this file, or it stays "open" forever. |
| 21 | ~~**Driveway `vehicle` reports Jeff's own parked car at 90.5 % every scan.**~~ ✅ **CLOSED 2026-08-23 — STALE ITEM, THE FILTER WAS ALREADY BUILT ON 08-21 and the list never caught up.** Read live from `/config/packages/hcc.yaml` **line 269**: `{{ obj_type == 'vehicle' and (box_area|float(0)) >= 0.005 and not (camera_key == '301_driveway' and (centroid.x|float(0)) >= 0.70 and (centroid.y|float(0)) >= 0.50 and (centroid.y|float(0)) <= 0.85 and states('device_tracker.gle_350_device_tracker') == 'home') }}`. That is exactly the described behaviour: a vehicle alert is suppressed if it is tiny/far-field (street traffic) **or** sitting in the parking spot **while the GLE's own GPS reports home** — and it **still alerts if the car is AWAY**, which is the stranger-in-the-driveway case. | ✅ closed 08-23 | was 08-14, unbuilt | Found during the 08-23 staleness audit Jeff asked for. The item sat marked "recorded, unbuilt / JEFF" for **9 days after it was actually built**. Cross-referenced with `CAMERA_POPUP_REBUILD_GUIDE.md`, which documents the same filter under "Other things built the same day". **Nothing to do.** |
| 24 | ~~Garage two-location switching~~ | ✅ closed 08-17 | — | Ecoeler YM2108T at $0. Kept so it is not reopened again. |
| 31 | ✅ **CLOSED 2026-08-23 7:35 PM — the "suspicion" was REAL, caught live, root-caused and FIXED.** #31 was logged 08-22 as *"suspicion, not a diagnosis"* after the mailbox missed a real delivery. Found it happening again during the staleness audit: **every Zigbee entity had been frozen for 5.5 hours** (all six devices last reported **19:05 UTC / 2:05 PM CT**, identical timestamps = one bulk event, not six silences). **Root cause, proven not guessed — HA had lost its `zigbee2mqtt/` subscriptions while the broker and HA's MQTT client stayed healthy:** (a) Z2M's **own bridge entities** were frozen 5.5 h too, so it was not device-side; (b) but `rtlamr2mqtt` meters on the **same Mosquitto broker** were live — `water_meter_last_seen` / `gas_meter_last_seen` **0 min ago** — so the broker and HA's MQTT client were fine; (c) **Z2M's own log proved it was publishing the whole time** — `19:30:15 z2m:mqtt: MQTT publish topic zigbee2mqtt/bridge/health … "connected":true,"published":1118`, uptime 208217 s, plus a real device message `18:59:10 topic 'zigbee2mqtt/Back Deck Door' {"battery":100,"contact":false,"linkquality":87,"voltage":2900}` that **HA never ingested**. **FIX:** reloaded the `mqtt` config entry (`homeassistant.reload_config_entry`). **Verified:** all six devices went from 5.5 h stale to **0 min** — contacts, all three leak sensors, and both voltage sensors. | ✅ closed 08-23 | found 08-22, fixed 08-23 | **Same subsystem as #44 and #37.** ⚠️ **Note Jeff's hardware correction:** the J45 has **two separate radios** — one SDR for the water/gas meters, one Zigbee coordinator for the sensors. They are independent, which is exactly why the meters stayed live while Zigbee went blind, and why "one dead means both dead" reasoning would have been wrong. **The alarm system Jeff is building runs on these sensors — 5.5 h blind is not cosmetic.** See #67. |
| 32 | ~~**back_deck_door_contact open 17.8 h**~~ **SUPERSEDED by #38** - that entry is more accurate (used last_CHANGED: open since 08-17 11:41 PM = 4d 14h, not last_updated). Either the door genuinely is open, or the sensor is stuck. | **JEFF** (one look) | found 08-22 | Ask before treating as a fault. |
| 36 | ~~**Water reading "looks stuck" AGAIN (Jeff, 08-22 ~1 PM)**~~ — **✅ CLOSED 2026-08-22 1:18 PM. PIT RADIO IS HEALTHY. NO WHUD CALL.** `Check-WaterMeter.ps1` was finally RUN (it never had been) and its checks independently re-pulled by hand. **Measured:** `sensor.water_meter_last_seen` 2.0 min old, and its 3 h history shows **82 consecutive RF catches, 15:20Z→18:15Z, every gap 0.5–4.7 min, none over 5 min** — the radio is transmitting continuously, the exact opposite of the 07-28 silence. Gas heartbeat 1.5 min old, so the shared dongle is fine. The reading itself **changed 13× in 24 h** (210483→210661); it had simply been flat for 77 min. **The earlier "sandbox blocked everything" claim was WRONG** — the block was tool-specific. The PowerShell tool refuses a nested `powershell` process; the **Bash tool runs the same script fine**, and Bash+`curl` reaches `192.168.1.66:8123` (one command per call — chained `;`/pipes trip the approval prompt). | ✅ closed 08-22 | — | **New measured fact:** all 13 value changes landed within ~2 min of the top of an hour while the heartbeat fires ~20×/hr, so **this meter batches HOURLY** — tighter than the 08-01 note's "~20 min to ~3 hr". A flat stretch up to ~1 h is the FLOOR of normal here, not a fault. Units: `water_meter_reading` = 0.1 gal. |
| 38b | ✅ **CLOSED same session — duplicate `go2rtc` startup task.** Two scheduled tasks launched the same exe: `HCC go2rtc camera streams` (boot, SYSTEM, the 08-21 keeper) and `HCC go2rtc Camera Feed` (logon, built 08-15, orphaned when the boot task replaced it). The loser could not bind 8554/1984 and squatted on TCP 8555. Orphan **disabled, not deleted**. Keeper PID 2880 held its original start time throughout — the stack never restarted. `Verify-CameraStreams.ps1` run before AND after: all 6 streams served real frames both times. | ✅ closed 08-23 | — | Also patched the health check, which printed `pid System.Object[]` and still said ALL GOOD with two instances fighting. It now counts instances and names the offending task. Write-up in `docs/incidents/camera_fixes_2026-08-21.md`. **Lesson: when a startup mechanism is replaced, disable the old one in the same session.** |
| 40 | ✅ **CLOSED 2026-08-23 11:53 AM — Apple TV can now reach the Beast.** VLC installed on the bedroom Apple TV; it auto-discovered `301SERVER` over SMB and Jeff logged in with the dedicated read-only `appletv` account. Shares proven before handover: login OK, real bytes streamed, writes denied, live add/delete/move all verified. Home Assistant now reports **34** apps including `VLC` (after an `apple_tv` config-entry reload — it was serving a stale 33). One-tap `VLC` chip added to `ATV_APPS` in `index.html`; lint clean, smoke passed 374 links / 0 bad / 0 page errors. **Connection details stay out of this public repo — `HCC-secrets/APPLETV_SHARE.md`.** | ✅ closed 08-23 | — | Home Sharing was a dead end and is not coming back: on Windows it exists only in iTunes, Apple dropped third-party DAAP, and 88 of the files are `.avi` which iTunes cannot play. The Apple TV "Computers" screen cannot be pointed at a share by any means. VLC **Favorites** is the shortcut instead. |
| 49 | ✅ **ROOT CAUSE FOUND (looked up, not guessed).** The 44 h Zigbee blackout was the **documented HA / Zigbee2MQTT startup race** — if HA finishes loading before the broker and Z2M settle, HA holds a connection that looks alive and never receives device messages. Reported repeatedly upstream (Koenkk/zigbee2mqtt #18170, #19654; hassio-zigbee2mqtt #83; HA community 646572): *"if the MQTT broker is restarted, all zigbee2mqtt devices disappear from HA."* Our evidence matches exactly — every entity froze at the HA restart timestamp while Z2M kept publishing. | ✅ 08-23 | — | **The 08-23 mqtt reload was RESTORATION, not prevention.** Prevention is #50. |
| 50 | ✅ **Two automations built to make this self-heal and self-report.** (1) `automation.hcc_mqtt_re_subscribe_after_ha_start_zigbee_race_fix` — on `homeassistant start`, waits 3 min, reloads the Mosquitto config entry, posts a notification. (2) `automation.hcc_sensor_silence_watchdog_reports_absence_not_events` — every 30 min, fires if any door/leak/meter sensor has said **nothing** for 6 h, pushes time-sensitive to Jeff's phone. | ✅ 08-23 | — | **VERIFIED:** both entities exist and are `on` (checked in `/api/states`, not trusted from the API's "ok"). Watchdog logic proven BOTH ways — 6 h threshold → False/empty on live data; 0 s threshold → True naming all 7 sensors. **NOT YET VERIFIED: the race-fix trigger, because that needs a real HA restart.** Confirm it at the next restart. |
| 51 | ✅ **SessionStart hook now injects LIVE FAULT STATE, not a pointer to a document.** `windows-scripts/hooks/Hook-SessionStart.ps1` queries HA on every session start and prints whether any critical door/leak/meter sensor has gone silent >6 h, plus any pending HA core update. **Proven both ways:** healthy path renders `door/leak/meter sensors all reporting - OK`; a throwaway copy with the threshold flipped printed `*** 7 CRITICAL SENSOR(S) SILENT ***` and named every one. Backup at `Hook-SessionStart.ps1.bak-20260823`. | ✅ 08-23 | — | **This is the fix for "nobody reads the notes."** A briefing that points at files depends on the session choosing to read them. Injected facts arrive whether it reads anything or not. Every watchdog before this waited for an EVENT; a dead sensor produces none. |
| 59 | ~~**"Camera AI is DOWN" fired again 2026-08-23 13:30 CT**~~ **CLOSED 2026-08-23 5:45 PM.** Built `/config/packages/hcc_ai_health.yaml` -> `binary_sensor.camera_ai_server_reachable`, and inserted gate condition 2 of 4 on `automation.hcc_camera_ai_server_heartbeat_ai_down_alarm`: `{{ states('binary_sensor.camera_ai_server_reachable') != 'on' }}`. **PROVEN, not assumed:** (a) official HA docs confirm the REST binary_sensor accepts `FALSE`/`TRUE` and `off`/`on` pairs, but the template was hardened to `{{ 'on' if value_json.success else 'off' }}` so it cannot depend on case-matching; (b) the AI server's REAL response bytes (`"success":true`, a genuine JSON boolean) were pushed through HA's own `/api/template` engine and rendered exactly `on`; (c) reachability verified FROM Beehive, not just the Beast (`HTTP 200 in 0.0077s`); (d) `ha core check` = "Command completed successfully"; (e) `rest.reload` brought the sensor live with **no HA restart** - it is the ONLY `platform: rest` entity in the whole config, so nothing else was touched; (f) sensor reads `on`, live gate renders `False` = false alarm suppressed; (g) **down-direction proven** with a throwaway sensor on a dead port (real AI service never touched): entity is not created and the gate renders `True`, so a genuine outage still alarms; (h) HA log shows `Platform rest not ready yet; Retrying in background in 30 seconds` - it self-heals when the AI returns, so there is no permanently-dead-sensor failure mode; (i) `Verify-CameraStreams.ps1` = **ALL GOOD, 6/6**, same PID 2804, before AND after. **Nothing in the camera pipeline was modified** - no go2rtc, HomeKit, scanner, doorbell sensor, popup path or camera entity. Only the notification logic. | CLAUDE | **CLOSED 08-23** | Snapshot committed to `beehive-config/hcc_ai_health.yaml`; the LIVE file on Beehive is authoritative. |
| 60 | ~~🟡 **Recurring `Login attempt failed` from localhost.**~~ **ROOT-CAUSED + CLOSED 2026-08-23 6:36 PM.** It is a **browser tab left open on an HA dashboard containing all six camera cards**, not a security event and not a camera fault. Evidence: the failures arrive in **bursts of six — one per camera, within 0.3 s** (`301_driveway`, `301_front_doorbell`, `front_right`, `back_left`, `301_backyard`, `garage`), on **clock boundaries** — 17:30:01, 18:00:00, 18:15:00, 18:30:01 — which is a refresh timer, not a person. The User-Agent on every one is `Mozilla/5.0 (Windows NT 10.0; Win64; x64) … Chrome/151.0.0.0`, i.e. **Chrome on a Windows PC**, and each URL carries an `?token=` signed camera token that has since expired. HA rejects the stale token and logs it. | CLAUDE | **CLOSED 08-23** | **No functional impact and nothing to fix in HA** — the card re-requests with a fresh token on the next full page load. Closing the tab (or reloading it) stops the log noise. **Deliberately did NOT touch the camera stack to "fix" this** — it is cosmetic and cameras are frozen. Honest limit: the exact tab was not identified (only the terminal tab was in my browser group), but the six-at-once-on-the-half-hour signature plus the Windows-Chrome UA is conclusive as to *kind*. The earlier "expired camera_proxy token being retried" reading was correct; the missing half was **what** was retrying it. Persistent notifications now number **0**, so the 13:00 notification theory is dead. |
| 37 | ✅ **CLOSED 2026-08-23 — the 08-21 meter flapping was the MQTT LAYER, not the meters, and it is the same subsystem as #44.** #37 was logged 08-22 as *"cause never investigated."* Investigated from history, not guessed. **Water and gas went `unavailable` at IDENTICAL timestamps to the microsecond** (e.g. `18:41:26.697366` vs `.697665`) — one publisher, so never an RF or pit-radio matter. Then the decisive check: **`binary_sensor.front_door_contact` (Zigbee→MQTT) flapped at the SAME events ~11 s EARLIER** every time — 18:41:14 vs 18:41:26, 19:03:46 vs 19:03:56, 19:19:41 vs 19:19:52, 19:26:07 vs 19:26:18. Zigbee and the meters share nothing except **MQTT**. So the MQTT integration/broker cycled ~9 times between 18:41Z and 20:45Z on 08-21, dropping every MQTT-sourced entity; the ~11 s offset is availability topics expiring at different rates per platform. | ✅ closed 08-23 | — | **This is the same subsystem as #44/#49.** The 10th and final flap is `22:39:58Z` — the exact HA restart at which HA stopped consuming Zigbee for 44 hours. 08-21 evening was MQTT misbehaving repeatedly and the blackout was its last act, which is worth knowing if it ever recurs. **Not a live fault:** rate collapsed to **1 flap on 08-22** (08:55Z) and **2 on 08-23**, and one of those two (`19:04:36Z` = 2:04 PM CT) is self-inflicted — the deliberate mqtt config-entry reload that fixed #44, which necessarily drops every MQTT sensor for a few seconds. **Nothing touched. No meter, no calibration, no constant** — read-only history queries only, per Jeff's instruction. And per the standing invariant, a meter reading `unavailable` is NOT a fault. |
| 69 | ✅ **CLOSED 2026-08-27 — THE PREMISE OF THIS ITEM IS DEAD. Router 0 → 3, Low LQI 6 → 0.** Jeff's USB repeaters landed and went in the same evening. Measured live: **Devices 13 · Router 3 · Low LQI 0 · coordinator children 9 → 4.** Mailbox **0 → 76**, Guest Bath Leak **18 → 80**, Garage Man Door **29 → 83**, Garage Door Down **25 → 83**, Kitchen Refrigerator Leak **25 → 83**, Kitchen Sink Leak **43 → 91**. Full evidence + the traps: `docs/zigbee/zigbee_mesh_routers_2026-08-27.md`. 🔴 **The mailbox was never a distance problem — it was ORPHANED.** It re-paired straight to the coordinator at LQI 170 while the repeater in the front bubble box had ZERO children. Jeff's 08-24 *"the mail box isn't going to work it is too far"* is retired by measurement. ⚠️ **The sensors are SONOFF SNZB-04 and HOBEIAN ZG-222Z — NOT the Excellux/Coolo/Tuya parts the 08-13 buildout doc guessed.** | ✅ closed 08-27 | — | Everything below is the pre-08-27 history, kept because the measurement rules in it are still valid. |
| 79 | ✅ **CLOSED 2026-08-26 — and it was worse than filed: THREE separate copies of the same broken filter.** Night Check, the Guardian hero cell, and (once built) the Doors card each had their own `*door*` substring match. All three counted the **5 `ai_doorbell_*` camera person-detection sensors** as doors — so Night Check would have reported *"5 doors open"* the moment people walked past the cameras — and all three **excluded the garage MAN DOOR**, a real exterior door, for containing "garage". **Fixed with ONE shared `hccDoorSensors()` used by all three, so they cannot disagree.** | **CLAUDE** | found + fixed 08-26 | Verified against live state via `scripts/doors-entity-test.js`: **4 real contacts** (front door, back deck, garage man door, mailbox), **0 ai_doorbell**, 0 battery flags, overhead door excluded (it has its own card and hero cell — counting it here would report one door twice). lint clean, smoke passed. |
| 80 | ✅ **CLOSED 2026-08-27 6:24 PM — THE GARAGE HAS A ROUTER AND IS BEHIND IT.** `Garage Repeater` (Tuya **TS0501B**, `0xa4c1386f3deff62d`) is mains-powered on one of Jeff's iPhone cubes, **$0 as planned**. Z2M reports it `Router · Mains (single phase)` — the 08-26 acceptance test PASSED. **It now carries FOUR children:** Kitchen Refrigerator Leak 124, Garage Man Door 103, Garage Door Down 97, Kitchen Sink Leak 69. Both garage door sensors took new network addresses (`0x59ED→0x8719`, `0xFDFB→0xE98E`), proving the re-pair. **Garage Man Door 29 → 83, Garage Door Down 25 → 83.** Repeater's own link back to the coordinator from the garage: **83**. | ✅ closed 08-27 | — | 🔴 **A battery end device does NOT move to a new router by itself — re-pair it or pull the battery.** SNZB-04 reset is a **5-second HOLD** until the LED flashes 3×, and press the button repeatedly DURING the interview. Detail: `docs/zigbee/zigbee_mesh_routers_2026-08-27.md`. |
| 74 | ✅ **THE NUMBERS, from HA attribute history — do NOT re-derive these.** **Fresh Blink cells read 170-177.** **Death is 133-134**, measured twice independently: `301_backyard` died **08-15 23:15 at 134**, `301_driveway` died **08-25 02:16 at 133**. `back_left` was swapped preemptively **08-18 at 142** and was still alive. Usable span ~40 points. **Service life on the original January cells: 7 to 7.5 months**, and all three landed within ten days of each other because they went in together. 🔴 **THE CURVE IS A PLATEAU THEN A CLIFF, NOT A SLOPE — never quote a days-remaining figure from current slope.** Backyard sat between 148 and 155 for two weeks, then fell **152 → 134 in NINE HOURS**. The knee is ~150. | ✅ settled 08-26 | — | Source: `/api/history/period` on `camera.*` **attributes** (`battery_voltage`), 07-28 → now, ~6000 rows/camera. ⚠️ **The HA history API defaults to ONE DAY unless you pass `end_time`** — that cost a wrong "there is no history" conclusion this session. ⚠️ Apparent voltage "jumps" of 15-20 points that fall back within hours are **lithium sagging under radio load**, not battery changes; only a jump that STAYS up is a real swap. |
| 75 | ✅ **Alerts built 2026-08-26 — voltage AND calendar, because one camera has no gauge.** (1) `automation.hcc_camera_battery_at_150_change_all_cameras` — checks every 6 h, fires when ANY of the four voltage-reporting cameras is **≤150**, message says change them ALL. Verified live: front_right at 149 → `would_fire = True`. (2) `automation.hcc_camera_battery_calendar_backstop_6_months` — fires at 09:00 when `input_datetime.camera_batteries_changed` is **180+ days** old. 🔴 **The calendar is NOT redundant: `301_front_doorbell` reports no `battery_voltage` attribute at all, so the date is the ONLY warning it will ever give.** | CLAUDE built / JEFF sets the date | 08-26 | ⚠️ **Deliberately separate from `hcc_low_battery_alert`**, which triggers on Blink's `binary_sensor.*_battery` flags. **Those flags are worthless and that is now proven: 30 days of history, ZERO low events across all five cameras — including on `301_driveway`, which had been dead 30 hours and still read `ok`.** Do not "consolidate" these two automations. |
| 77 | ✅ **CLIP ARCHIVE NOW PURGES — 2026-08-26. This removes ONE of Jeff's two reasons for killing the clip producer (#61).** Jeff, verbatim 08-26: *"I wasn't gonna fill up my drive D with thousands of Blink clips that weren't purging... if they keep them for the exact same time that Blink keeps the cloud but delete the old ones in 14 days and just record keep recording fresh ones then that may be workable."* Built `windows-scripts/Purge-ClipArchive.ps1` + scheduled task **"HCC Clip Archive Purge"** daily 04:30 SYSTEM. Rolling **14-day** window, and it also deletes the 40-byte stubs from **#30** (Blink's `{"message":"Media not found","code":700}` written into a .mp4). **Measured before/after: 156 files → 133, all 23 stubs removed.** Dry-run mode is `-WhatIf`. | ✅ CLAUDE done 08-26 | — | **Scale was never the risk, and the numbers say so:** archive was 218.5 MB with **825 GB free on D:**. At the record's ~2 MB/clip and ~50 events/day a 14-day window is ~1.5 GB — 0.2% of free space. Touches only `D:\HCC-Clip-Archive\*.mp4`, never recurses, never touches Beehive's live `/config/www/blink_clips`. ⚠️ **This cleans stubs AFTER the fact. The real fix is #30's guard in `archive_clip.sh` so a stub is never copied at all — that one is on Beehive and inside the camera freeze.** |
| 81 | 🔴✅ **THE ALARM WAS FALSE AND THE RE-ENABLE IS THE ROOT CAUSE. HA history, exact:** `08-26 17:45:13 → off` (the deliberate disable, documented in this file) and `08-27 20:06:02 → on`. The 08-27 session found it `off`, wrote *"Why it was off is NOT known — do not invent a cause"*, and re-armed it. **The reason was one file away, in this file, under the heading "MUST STAY OFF UNTIL REDESIGNED."** It then false-fired **every 30 min from 13:00 to 18:30 on 08-28**, and 04:30–06:00 that morning. Jeff restarted HA at **06:29** and again at **18:42** chasing it; each restart bought exactly 6 h of quiet, which is the tell. | ✅ CLAUDE fixed 08-28 | found+fixed 08-28 | 🔴 **THE LESSON IS NOT "read more." It is: an automation found in a non-default state is EVIDENCE, not a fault. Search this file for its name before changing it.** `Search-HCC.ps1 "silence watchdog"` returns the 08-26 decision in one command. |
| 82 | ✅ **ROOT CAUSE PROVEN LIVE, not inferred — #68 reproduced on the wire.** At **18:56:33** a `zigbee2mqtt/Back Deck Door` payload was captured off the broker: `{"battery":100,"battery_low":false,"contact":true,"linkquality":94,"voltage":2900}`. One second later HA read: `binary_sensor.back_deck_door_contact` **last_updated 18:47:21**, `..._battery` **18:47:21**, `..._voltage` **18:47:21** — and `linkquality` **18:56:33**. **Only the field whose VALUE changed moved.** `last_reported` was frozen too, so #68's warning that `last_reported` is not an escape hatch is confirmed. The 18:30 alert had claimed *"Mailbox, Guest Bath Leak, Kitchen Refrigerator Leak, Kitchen Sink Leak reported NOTHING for 11.9h"* — recorded linkquality shows Guest Bath transmitted at **18:11:37**, 19 minutes earlier. **11.9 h back from 18:30 is 06:34 = the MQTT reload, i.e. it was measuring HA's own restart.** | ✅ CLAUDE 08-28 | — | ⚠️ **The flagged set was exactly "sensors whose state did not change today."** front_door and back_deck were NOT flagged at 18:30 because those doors were actually opened. That pattern alone identifies this bug on sight. |
| 83 | ✅ **THE REAL FIX IS IN AND ARMED — Z2M per-device availability.** `availability.enabled` **false → true**, set through the Z2M UI and **verified in Z2M's own `bridge/info`**, not from the checkbox. Z2M restarted 19:30. **All 12 devices now publish `zigbee2mqtt/<name>/availability` = `online`** (verified by subscribing to `zigbee2mqtt/+/availability`, 12 of 12 retained). **HA is wired to it: 19 of 19 contact/leak discovery configs now carry the per-device availability topic with `availability_mode: all`** — before tonight the only source was `zigbee2mqtt/bridge/state`, which can never mark ONE device offline. Watchdog rebuilt on that signal, same automation id `hcc_sensor_silence_watchdog`, now aliased **"HCC - SENSOR OFFLINE WATCHDOG (Z2M availability, real signal)"**, state `on`. | ✅ CLAUDE 08-28 | — | **Tested BOTH ways before install:** healthy house + 30-min dwell → **False**; dwell forced to −1 s → **True** and it names the devices. Read back from the box after writing and re-rendered → **False**. 🔴 **THE 30-MINUTE DWELL IS LOAD-BEARING** — an HA restart or MQTT reload makes every Zigbee entity unavailable for ~60 s (seen twice on 08-28, 18:43:23 and 18:46:44). Without the dwell this becomes the same false-alarm machine on a different metric. **Do not remove it.** ⚠️ The water meter is deliberately still age-based: it is rtlamr2mqtt, has no availability topic, and its `last_seen` value genuinely changes every message. That inconsistency is correct — do not "tidy" it. |
| 87 | ✅ **CLOSED 2026-08-29 02:12 — VIZIO ENTRY DELETED ON JEFF'S INSTRUCTION.** Jeff, 02:11: *"That Vizio can speaker can be removed it's the sound bar for the tv and does nothing anyway. I don't even know why it's on there really serves no purpose."* <br><br>**WHAT IT WAS — the only auth error that genuinely recurred.** Fired on **every HA start**: 08-27 22:21:56, 08-27 22:23:58, 08-28 06:30:08, 08-28 18:43:20 — the restart timestamps exactly. Config entry was `state: setup_error`, `reason: auth token required for this endpoint but none configured`, **`source: zeroconf`** — HA AUTO-DISCOVERED it; Jeff never added it. `media_player.aud_d426` was `unavailable`, `device_class: speaker`. Vizio audio devices need a pairing PIN before they will issue an auth token; this one was never paired, so it retried and failed forever. 🔴 **The device WAS online — "auth token required for this endpoint" is a REPLY FROM THE SPEAKER, not a timeout.** | ✅ CLOSED 08-29 | opened + closed 08-29 | **Checked BEFORE deleting:** zero references to `aud_d426` in any of the 42 UI automations, in `index.html`, in `functions/`, or in `beehive-config/` — the only "Vizio" hits in the app are tooltip text about the 60″ TV itself. **Verified AFTER:** vizio entries **1 → 0**; config entries **not-loaded 1 → 0 of 62**; repair issues **2 → 1** (the `config_entry_reauth_vizio_…` error is gone; only the pre-existing `http yaml_still_present_after_migration` warning remains); `media_player.aud_d426` and `remote.aud_d426` both **HTTP 404**; **0 pending discovery flows.** ⚠️ **zeroconf CAN re-discover it and put a "discovered device" card back in Settings — that is NOT the fault returning.** The overnight watcher now checks `config_entries/flow/progress` for `handler == vizio`. **If it comes back, IGNORE the flow — do not delete again and do not try to pair it.** |
| 90 | ✅ **SMARTHUB — ONE event in ten days, self-recovered, and there is NO TOKEN TO FIX.** Jeff asked directly *"Do we need to tokens?"* — **no.** The config entry is `source: user`: it holds his CEMC login and **mints a short-lived token from those credentials on every poll**. Nothing is stored to renew or rotate. The 08-28 23:15:38 failure was the login call returning a body with **no token in it** — upstream at CEMC. Entity went `unavailable` 23:15:38 → 23:45:54 (**30 min**) and came back on its own; config entry `loaded`; integration already current (`update.smarthub_coop_energy_update` = `off`). | ✅ no action | 08-29 | **Part of a pattern of UPSTREAM flakiness, all in the log:** `08-27 18:07 No data received from SmartHub API … to populate historical Hourly stats` · `08-28 11:02 Maximum retries reached, data still PENDING` · `08-28 23:15 Authentication failed`. ⚠️ **CORRECTION to the old record: this sensor updates ~ONCE A DAY around 09:00, not the "~6h cadence" the 07-30 conversation claimed.** Measured 08-22→08-29: gaps of 8.8, 24.2, 23.7, 24.2, 25.4, 22.7, 24.0 h. **Building a fix for a once-in-ten-days self-healing upstream hiccup would be inventing work.** |
| 91 | ✅ **THE DEAD "NOAA RADIO" BUTTON IS GONE — and KIG79 has NO free stream anywhere.** The button pointed at `tunein.com/radio/NOAA-Weather-Radio-16255-s95242/`, which TuneIn moved behind their premium app. 🔴 **Do not "restore" a KIG79 link — this was checked exhaustively on 08-29 and it does not exist free:** `weatherusa.net` **lists** KIG79 but its Icecast server was queried directly and of **116 live mounts KIG79 is not one of them**; Radio Garden's KIG79 returns **403** to anything but a browser; `weatherradio.org` (GWES) has **no Tennessee stations at all**; `noaaweatherradio.org` has Chattanooga/Knoxville/Memphis but **no Nashville**. Of the TN callsigns only **WXK63 Beechgrove** actually streams (verified: 91 KB of real audio in 8 s; WXK47 Bristol returned 95 bytes of HTML = dead). | ✅ CLAUDE 08-29 | — | ⚠️ **WXK63 IS IN THE APP BUT DELIBERATELY LABELLED "NOT your counties".** Beechgrove is ~50 mi SE; it carries NWS Nashville forecasts but broadcasts warnings for **Coffee/Bedford**, not Robertson/Sumner. **Never relabel it as Jeff's weather radio.** weatherusa's own disclaimer also says their streams lag 10 s–2 min and must not be relied on for protection of life. |
| 92 | ✅ **THE ALERT PANEL IS NOW THE GO-TO — always visible, three states, county-correct.** It used to be `display:none` unless an alert was active, which is exactly why the section never felt like an emergency page. Now: **green ALL CLEAR** with a timestamp · **red/orange** with the alert · 🔴 **grey CHECK FAILED**. `/api/alerts` gained `description` + `instruction` (NWS's literal *"TAKE COVER NOW…"* wording — the part the radio reads aloud) and an **`ok` flag**. | ✅ CLAUDE 08-29 | — | 🔴 **THE `ok` FLAG IS THE POINT. Without it a failed NWS fetch renders identically to a calm sky** — the green-component/dead-feature trap. The grey state says *"This is NOT an all-clear"* in as many words. **Do not simplify it away.** Verified against `api.weather.gov/points/36.477,-86.66`: office **OHX**, county **TNC147 Robertson**, zone **TNZ007**, radar **KOHX**. Live sample of the national feed: 238 active alerts, 78 carrying `instruction` — hence the instruction→description fallback. |
| 93 | ✅ **17 EMERGENCY LINKS ADDED, IN FOUR GROUPS, ALL TESTED HTTP 200 ON 08-29.** *Is today dangerous?* SPC Day-1 outlook (the most useful single link for a Skywarn spotter — it says severe risk **before** anything is warned), NWS OHX, KOHX radar, NOAA flood/river. *Scanner traffic:* THP+TDOT District 3 **42114** (Jeff asked for this one by name; it is also the **only** feed Broadcastify files under Robertson County), Sumner Sheriff 34476, Sumner EMS 34511, Millersville PD 34573, Portland PD 34575. *Lifelines:* CEMC outage map, TDOT SmartWay, USGS quakes (New Madrid), TEMA. *Radio:* WXK63, WebSDR, SDR receiver map, Ready.gov. | ✅ CLAUDE 08-29 | — | 🔴 **SCANNERS ARE LINK-OUTS ON PURPOSE — DO NOT CONVERT THEM TO `<audio src>`.** Broadcastify's direct MP3 endpoints answer **`401 You need to authenticate`** (Icecast basic auth, Premium only). Embedding them would rebuild the exact paywall Jeff complained about. Their **web player pages are free** (all 5 returned 200, no account). OpenMHz was checked as a free alternative: **453 systems, none in the Nashville area.** |
| 95 | ✅ **FIXED — the watcher now checks EVERY entity against a documented baseline.** Anything unavailable that is not explicitly baselined is reported, grouped by device so 20 dead Sharky entities read as one fault rather than 20 lines. Baseline holds only genuinely-normal states, each with its reason: sleeping phones, the Alexa virtual groups from the 08-19 cleanup, the two PC Alexa apps, the Mercedes between trips, idle AI scanners, Blink wake-only sensors. **Verified: the fixed script immediately reports `FAULT sharky 20 entities unavailable (772 min)`** — i.e. it would have caught this on the first tick. | ✅ CLAUDE 08-29 | — | ⚠️ **The script is in the session scratchpad, not the repo — it dies with this session.** The DURABLE fix is HA-side: `automation.hcc_watchdog_integration_down_alert` currently watches only `media_player.fire_tv_viewing_room`, the Mercedes engine-light sensor and an Alexa entity. **`vacuum.sharky` is not in it, and neither is anything else that matters.** Adding to that list is the real repair — NOT YET DONE, needs Jeff's nod on which devices are worth a phone alert. |
| 96 | ✅ **EVERY BUTTON WORKS — the defect was that pressing one said NOTHING.** New `scripts/button-audit.js`: **258 onclick handlers across every section, ZERO dead**, 0 anchors without a real href. A click probe then proved each refresh genuinely re-fetches **when a token is present**: `loadWeather` **7** API calls · `loadIrrigation` 2 · `loadForecast` 1 · `loadGuardian`/`HomeStatus`/`Lights`/`Garage`/`Mail`/`Vacuum` 1 each. `refreshRadar` makes **0 fetches by design** — it blanks and restores the iframe `src`. **Fix = feedback, not wiring:** one delegated listener gives every refresh control `Refresh X → ⌛ Refreshing… → ✓ Refreshed 7:42 AM → back`. | ✅ CLAUDE 08-29 | — | Delegated on purpose — no markup churn, and a future refresh button inherits it free. ⚠️ **Wording is "Refreshed", never "Updated": the claim is that the refresh RAN, which is true. Whether the data came back good is the card's own banner to report — do not upgrade that wording.** 🔴 **Two harness bugs caught before they became false claims:** (a) the first audit reported **28 dead handlers**, all false — the regex counted `document.getElementById(` and `event.stopPropagation(` as missing globals; fixed with a negative lookbehind for `.`, real answer is zero. (b) the first refresh probe showed **all six Guardian buttons making 0 calls**, also false — every Guardian loader opens `if (!getHaToken()) return;` and the probe ran in guest mode. **I nearly reported six working buttons as broken.** Always give the probe a dummy token. |
| 97 | ⛔ **BRAVES HERE REMOVED — AND DO NOT ADD IT BACK. This is the second time it has been wrong.** Jeff 08-29 07:59: *"I pay for Braves Vision that comes through MLB. When I login and try and watch the Braves game it wants me to download the app."* Same complaint he made **2026-08-14**. 🔴 **The 08-27 restore note was factually wrong on both of its claims, verified 08-29:** (1) it said *"braves.tv is a WEB player, never an app install"* — braves.tv is not a player, it 301s to `mlb.com/live-stream-games/subscribe/braves`, a SUBSCRIBE page, with a byte-identical **1,191,829**-byte response to iPad and desktop UAs, so *Request Desktop Website* changes nothing; (2) **MLB deliberately blocks browser playback on iOS/iPadOS and redirects to the app — platform policy, no official workaround.** The iPad Air 2 on iPadOS 15 cannot install the MLB app. **Closed at both ends.** | ✅ CLAUDE 08-29 | fixed 08-29 | ✅ **`BRAVES TV` (Apple TV chip) STAYS and works** — verified 08-29: the Apple TV's `source_list` holds 35 entries including **`MLB`** and **`Sling`**, the exact strings those chips send, and it was `playing` with `app_name: Sling` at the time of checking. **The Braves are watchable — on the Apple TV, not that iPad.** |
| 98 | ✅ **SLING HERE STAYS — it is NOT the same case as Braves, do not lump them together.** `watch.sling.com` returns **200 with no redirect** to an iPad UA, and Jeff photo-confirmed it playing in that same iPad's Safari on **2026-08-05**. **Sling's web player works on iPadOS; MLB's does not.** The 08-14 removal generalised a genuine MLB app-install problem onto a Sling link that was working, and cost a paid feature 19 days. | ✅ verified 08-29 | — | 🔴 **The recurring error in this whole area is treating "Braves" and "Sling" as one decision. They are two different vendors with two different policies. Test each separately, every time.** |
| 99 | ✅ **`HCC-Audit.py` BUILT — whole-stack, and it PRINTS ITS OWN COVERAGE.** Lives at **`C:\Users\jeffl\HCC-Scripts\HCC-Audit.py`** — deliberately NOT in the repo, because it reads the HA token path and that repo is PUBLIC. ⚠️ **Therefore it is NOT version-controlled — back it up.** `python HCC-Audit.py --hours 24` (or `--brief` for loop use); exit 1 when there are findings. Covers: HA core+version, ALL entities vs a documented baseline, config entries, repairs, add-ons, updates, automations, meters, batteries, Z2M availability, the HA log, restarts, **all 11 app API endpoints**, and CodeProject.AI on the beast. | ✅ CLAUDE 08-29 | — | 🔴 **The COVERAGE block is the whole point and must never be dropped.** It exists because the 08-28 watcher printed ALL CLEAR over a dead vacuum for 10 h (#94). **A clean verdict is meaningless without the list of what was examined.** ⚠️ It also caught **two of its own false positives** during the build: Zigbee Pairing Mode being OFF is CORRECT (permit_join safety — an ON would be the finding), and 4 "errors" at 09:51 were **the audit's own log-reading**. Both are now baselined with the reason. |
| 100 | ✅ **TWO ADD-ONS REMOVED — they had NEVER worked and were crash-looping.** Jeff 10:31: *"I don't think I use ether Plex or the Advanced SSH it has never worked."* Root cause read from their own logs first: `a0d7b954_ssh` → *"FATAL: Please be sure to set at least an SSH password or at least one authorized key!"*; `a0d7b954_plex` → *"FATAL: Plex requires a claim code on the first run!"*. **Both unconfigured since install**, both `boot:auto` + `watchdog:true`, so they restarted and failed forever on a 1.5 GHz J4205. **Verified after: 15 → 13 add-ons, both gone, ZERO add-ons in error state.** | ✅ CLAUDE 08-29 | — | ✅ **`core_ssh` (Terminal & SSH) is a DIFFERENT add-on, was untouched, and is still `started`.** That is the terminal that works — do not confuse the two again. Nothing was lost by removing: being unconfigured is *why* they failed, so there was no config to keep. Both are store add-ons if ever wanted back. |
| 104 | ✅ **Water cost showed a CALENDAR month, not the WHUD billing cycle — fixed 2026-08-31.** `sensor.water_month` resets on the 1st; WHUD bills 22nd→22nd, so the app could never match the bill. The correct code existed but was bypassed. Fixed app-side (`WHUD_CYCLE_DAY=22`, cycle source reordered), HA untouched. Live-verified: $43.29 → $15.18. Detail: `docs/utilities/BILL_LEDGER.md`. Gas/electric cycle days still unknown — need a Spire and a CEMC bill. | me | 0d | |
| 110 | ✅ **Electric cycle rollover FAILED on 09-01 and corrupted a statistic; fixed the same morning.** Recorded in `electric_disaggregation_2026-08-31.md` (commits `c1ef5b7`, `e4c05fc`) — the cycle is now computed from long-term statistics instead of the resetting sensor. **Never appeared on this list.** | ✅ closed 09-01 | Cite it, do not re-derive it. |
| 111 | ✅ **The 09-01 dryer pre-registered test — RESOLVED 09-03, FAILED 4 of 5 criteria.** Its baseline assumption (0.9-1.3 kW pre-load) was wrong by ~4x: the house was at **4.90 kW at 06:00-06:15 before the load went in**, and elevation began **05:30**, an hour early, running past 10:00. **That falsifies the premise the test rested on** — that a September 06:30 has the A/C at near-zero duty, so any block "cannot be the A/C". Weather (+3.1 °F) explains ~5.3 of the +17.9 kWh. **Model still NOT validated.** | ✅ closed 09-03 | 🔴 **Do not run a fourth MORNING test.** The overnight run named in that file is the only clean one left. Full account and the measured CEMC API contract are in `electric_disaggregation_2026-08-31.md`. |
| 114 | 🟢 **A repeatable SmartHub 15-minute pull now exists — `HCC-Scripts/smarthub_pull.js`.** Drives an already-logged-in Chrome over CDP (`open_login_chrome.ps1`), so **no session ever types Jeff's password** and the login is reused rather than copied. **NOT in this repo — it reads a credential path and this repo is PUBLIC. Therefore NOT version-controlled: back it up.** | ✅ CLAUDE 09-03 | 🔴 Three traps measured — do not rediscover them: the API answers **`{"status":"PENDING"}` first** and returns data only on a re-POST; it **ignores the start epoch** and returns 96 points from **UTC** midnight (19:00 the prior evening → 18:45 CT, so a CT filter yields 76 — that is the window, not missing data); and **Playwright's bundled Chromium trips a browser-validation challenge** on CEMC and Ancestry where real Chrome plus `--remote-debugging-port` does not. |
| 117 | 🟠 **HALF FIXED 2026-09-03 — see the correction at the end of this row — the extension existed in ONE browser out of three, while the built-in manager was disabled in ALL three.** Measured from the registry: `ExtensionInstallForcelist` was set for **Brave only**; Chrome and Edge had **no forcelist policy at all**. Meanwhile `PasswordManagerEnabled = 0` on **Chrome, Edge AND Brave** — the 08-19 hardening deliberately disabled the browsers' own managers so they would not compete with the vault. **Net effect: in Chrome and Edge Jeff had NO password manager whatsoever.** That is the whole "some things but not all" symptom, and it depends only on which browser he happened to open. | ✅ CLAUDE 09-03 | **Fixed and FEATURE-VERIFIED, not registry-verified:** launched each browser and confirmed the extension directory actually appeared. Chrome + Edge both now carry Bitwarden **2026.8.0**. 🔴 **Edge needs its OWN store ID — the Chrome Web Store entry silently does nothing.** Chrome/Brave: `nngceckbapebfimnlniiiahkandclblb` via `clients2.google.com/service/update2/crx`. **Edge: `jbkfoedolllekgbhcbcoahefnbanhhlh` via `edge.microsoft.com/extensionwebstorebase/v1/crx`.** The first Edge attempt used the Chrome ID, installed nothing, and reported nothing — a silent no-op. Restore point taken first ("Before Bitwarden extension policy for Chrome/Edge") because a session's `secedit` policy edit boot-looped the GaragePC on 09-01. <br><br>🔴 **CORRECTION, SAME DAY, CAUGHT BY JEFF: INSTALLING THE EXTENSION IS NOT SIGNING INTO IT, AND I REPORTED THIS FIXED WHEN IT WAS HALF FIXED.** Jeff: *"See this is a perfect example of how my passwords did not come up in chrome with that Bitwarden."* **Measured from each profile's `Local Extension Settings\<id>` folder — Brave **3,924,456 bytes** (a real synced vault) vs Chrome **37,675 bytes**, the extension's empty factory state.** A policy force-install delivers the software and **no account**; the vault does not follow. **Remaining step is Jeff's hands only: sign into the extension once per browser** — his master password is a 5-word passphrase no session may ever see. 🔴 **THE LESSON: I feature-tested the wrong feature.** I verified the extension DIRECTORY appeared and called it done. The actual feature is *a password fills in a login box*, and that was never tested. Same green-component/dead-feature shape as the 08-21 camera check that printed ALL GOOD eleven minutes after the popups died. |
| 123 | ✅ **`HCC-AuditRun.py` ACKNOWLEDGED list corrected — it was wrong at both ends.** **(a) `mailbox` REMOVED.** It works: *"Mail has arrived — the mailbox door opened at 11:48 AM"* pushed to Jeff's phone 2026-09-04, and Z2M reports 12 devices / 0 offline. 🔴 **Leaving a working device acknowledged is worse than useless — a REAL future failure would be silently swallowed.** The script's own header says remove an entry the moment the fault is fixed; it had not been. **(b) `garagepc` ADDED.** Off the LAN since 09-01 13:18 (#112), unactionable until Jeff is physically at the machine, and it had been re-paging him for three days. **Remove it the moment it rejoins.** | ✅ CLAUDE 09-04 | Verified after: `5 actionable, 5 suppressed as already-known`, nothing new pushed. ⚠️ Script stays OUT of this repo — it reads the HA token path and this repo is PUBLIC, same rule as `HCC-Audit.py` (#99). **Not version-controlled: back it up.** |
| 126 | 🔴 **HA Core 2026.9.0b1 → 2026.9.0 installed at 13:41 without reading the release notes; Python 3.14 broke `blink` and `alexa_media` (`aiofiles.base.wrap` removed). Rolled back via `update.install` with `version: 2026.9.0b1` at 15:50; verified restored 15:55 — 62/62 entries, blink `armed_away`, automations 48/53 as baseline, cameras 6/6.** ~2h10m outage of two integrations. Three resurrected Alexa setting switches re-disabled (08-19 hygiene restored). Full account in `COST_LEDGER.md` 2026-09-04. | ✅ CLAUDE restored 09-04 | 🔴 **HARD STOP: do not retry 2026.9.0 until `blinkpy` and `alexapy` ship Python 3.14 builds.** Read release notes and name affected integrations first, per #48. A runtime change means enumerate `/config/custom_components/` before anything. **A backup is a rollback plan, not research.** |
| 128 | ✅ **Arthur Chester Loewen Sr worklist row is STALE.** WORKLIST said *"St. Bernard County, Louisiana"*; live tree reads **New Orleans, Orleans, Louisiana, USA**. Already fixed. Add to `WORKLIST_TRIAGE.md`'s dead-row count. | ✅ | Same class as the six Isabella rows. |
| 130 | ✅ **TONIGHT'S WATER TEST COULD MEASURE BUT COULD NOT SPEAK — fixed 2026-09-04 17:50.** The scheduled task ran at **06:15**, while the script's own quiet-hours guardrail is `8 <= now.hour < 21` (`Watch-OvernightWater.py:205`, added after the #103 sleep incident). **At 06:15 that gate evaluates False**, proven by evaluating the condition directly (hour 06 → `False`, hour 08 → `True`). So the scheduled run measured, logged, and **could never push**. 🔴 **The part this silently killed is the one Jeff explicitly asked for** — *"one drop leads to many gallons lost over time… make sure you can capture 100% if there's a drip"*. The single-night number is also pushed by `automation.hcc_overnight_water_check_5_am`, so he was never blind on that; **but the 14-night rolling-median DRIP CHECK exists only in the Python script, and its notification was the one being swallowed.** **FIX: task moved 06:15 → 08:05.** Verified `NextRunTime 2026-09-05 08:05:00`, action and `--notify` intact, `LastTaskResult 0`. 08:05 also guarantees the 05:00 hourly LTS bucket is compiled, which 06:15 did not. | ✅ CLAUDE 09-04 | **Same green-component/dead-feature shape as the 08-21 stream check.** The task existed, ran, returned 0, and wrote a log — every component green, and the feature (telling Jeff) was dead. ❓ **ONE OPEN QUESTION FOR JEFF:** the Python run will now also push on OVER THRESHOLD at 08:05 while HA already pushes at 05:00 — **two buzzes for the same night.** Offer: make the Python push **drip-only**, leaving the single-night alert to HA. Not done without his word — notification behaviour is the exact area that cost him a night's sleep (#103). |
| 132 | ✅ **#115 SETTLED, AND THE ANSWER REVERSES #125. THE MAILBOX IS NOT HEALTHY — Z2M's "12 devices / 0 offline" is an artifact of the 25 h timeout, not a clean bill.** #115 asked why Z2M reports 0 offline while #86 records a dead mailbox, and said *"do not claim either way until the log is read."* **Measured 2026-09-04 18:42 from `sensor.*_linkquality` history, 5 days (08-30 18:42 → 09-04 18:42)** — linkquality is used because it is the field whose VALUE changes on every message, so it is the only honest liveness signal on these devices (#68/#82):<br><br>`Mailbox 54 msgs · median LQI 3 · max gap 18.52 h`<br>`Front Door 110 · 58 · 4.01` — `Back Deck 277 · 87 · 4.00` — `Guest Bath 78 · 58 · 5.99`<br>`Kitchen Sink 91 · 54 · 3.00` — `Kitchen Fridge 97 · 58 · 6.01` — `Garage Man Door 132 · 61 · 4.01`<br>`Garage Door Down 98 · 58 · 4.02` — `Spare Contact 1 97 · 98 · 4.19`<br><br>**The mailbox is the only outlier and it is not close:** LQI min 0 / median 3 / max 25 against 54-98 for everything else, and **10.8 msgs/day against Back Deck's 55**. Z2M calls it "online" purely because 18.52 h fits under the 1500-min (25 h) passive timeout. | ✅ CLAUDE 09-04 | 🔴 **THE CONSEQUENCE, AND IT IS THE WHOLE POINT: #84's proposed 720-min (12 h) timeout would have marked the mailbox OFFLINE and pushed Jeff's phone.** 18.52 h > 12 h. #84 was left at the safe default on 08-28 for exactly this reason — *"the Mailbox at 8.05 h is the one that could false-fire"* — and it has since got **worse**, not better (8.05 h → 18.52 h). **#125 removed that blocker on a spot check and was wrong. #84 and #85 stay blocked until the repeater is installed.** ⚠️ **Gap verified NOT to be a restart artifact:** the 18.52 h window ran **09-02 22:27 → 09-03 16:58**, while today's HA restarts were 13:41 and 15:50 on 09-04. A second real gap of **9.90 h** ran 09-01 00:22 → 10:16. ✋ **DO NOT put `binary_sensor.mailbox_contact` back into `hcc_sensor_silence_watchdog` yet** (#86/#123 say "when the sensor works" — it does not). ✅ **Kitchen Fridge Leak at 6.01 h is NOT a concern** — change-driven device, and #84 measured it at 3.01 h; it is normal variance, not the 39.4 h claim retracted in #103. **Nothing was changed on Z2M, HA or any automation — read-only history queries.** |
| 89b | ✅ **#89 FIXED 2026-09-04 — `haFetch()` no longer fires an unauthenticated request when there is no token.** #89 root-caused it in the code and never fixed it: `index.html` `haFetch()` attached `Authorization` only `if (token)`, but **sent the request either way**, so the Pages Function relayed it to Beehive unauthenticated and HA logged `invalid authentication from <Cloudflare IP>` with a `(None)` user agent — **72 in 10 days**. The call could never have succeeded, so nothing is lost by not making it. **Fix:** `haFetch()` and `haStatsFetch()` now return a synthetic `401` `Response` immediately when `getHaToken()` is empty, so **all 58 call sites keep working unchanged** — `.ok`, `.status`, `.json()` and `.catch()` behave exactly as on a real 401. | ✅ CLAUDE 09-04 | 🔴 **PROVEN BOTH WAYS by a new test, `scripts/hafetch-token-guard-test.js`** — because `lint-app.js` and `smoke-test.js` both pass whether or not the bug is present (neither inspects outbound requests; that is the #94 trap). **guest (no token): 18 fetches, ZERO to `/api/ha`. logged in (token): 27 fetches, 13 to `/api/ha`, all 13 carrying `Authorization`.** So the noise stops and nothing regresses. ✋ **`hccPanic()` is unaffected** — it already refuses to run without a token by its own design, so the webhook path never reached `haFetch()` tokenless. The guard is deliberately universal **including `/api/webhook/*`** (which HA would accept unauthenticated); a future unauthenticated webhook caller needs an explicit exemption rather than silently getting a 401 — noted in the code comment. ⚠️ **My first harness reported this passing fix as FAILED** by counting the `file://` ServiceWorker registration error as a page error — it appears in BOTH runs and `smoke-test.js:116` already filters it for the same reason. **Fixed the harness, not the app** — the trap recorded in the weather-emergency work. Gates: `lint-app.js` clean, `smoke-test.js` passed 374 links / 0 bad / 0 page errors. |
| 113b | 🟢 **#113 PART ONE DONE — the GaragePC credential no longer needs Microsoft Word.** #113 flagged that `Document (6).docx` is the only copy of the GaragePC password, that it is a **Word file**, and that `FAMILY_RUNBOOK.md` routes Angela and Braxton through safe → five words → Bitwarden, **a path this credential is not on**. **Folded verbatim into `HCC_ACCESS.md` §5** — the map the runbook already points at — alongside the IP (`192.168.1.121`, also `.212` on 5G), the OS, and the account name **`Jeff Loewen Office 2`** (not `jeffl`, which is the detail that makes a bare browse fail as guest). Backup `HCC_ACCESS.md.bak-20260904-1856`. **Now readable in plain text with no Office install** — which matters for a succession document. | ✅ CLAUDE 09-04 | ✅ **Version anxiety resolved, measured not assumed:** three copies of the docx exist — `iCloudDrive\HCC-secrets\`, `OneDrive\Documents\`, and `iCloudDrive\` root. The two readable ones are **textually identical** (extracted-text sha256 `b4cd53fe4a8fe928`) despite different file md5s, which is just Office metadata. The third is an **undownloaded iCloud placeholder** and will not open — do not treat that as corruption. 🔴 **I WAS WRONG ABOUT A DANGLING POINTER AND SAID SO TO JEFF — corrected here.** `garagepc.txt` reads `see iCloudDrive\HCC-secrets\Document (6).docx`, which is **correct and resolves**; I misread my own credential-redaction output, whose regex had eaten the word `iCloudDrive`. **`garagepc.txt` was NOT modified.** Full account in `COST_LEDGER.md` 2026-09-04. ⏳ **STILL OPEN and still Jeff's call — the Bitwarden half.** This credential, plus the #135 class (B-Hyve, LUX, Blink, Amazon, SmartHub), is still not in the vault, and Jeff reported 09-03 that Bitwarden *"hasn't been working worth a shit."* **A plain-text copy in the safe beside the five words costs nothing and depends on no software** — that recommendation stands unchanged. |
| 133 | 🔴 **#62's EVIDENCE PLAN SILENTLY FAILED — the Security log cannot hold 12 days, so "no access" was never provable. Fixed 2026-09-04.** #62 (Everyone:Full on the `Users` and `OneDrive` SMB shares) was deliberately left unfixed on 08-23 with this plan: *"I turned File Share auditing ON so this becomes answerable instead of guessed — give it a few days and 5140 events will show whether anything ever touches them."* **Checked today, 12 days later: ZERO 5140 events.** 🔴 **That is NOT the all-clear it looks like.** Verified the instrument before trusting its silence: audit policy **File Share = Success** ✅ and `AuditSmb1Access = True` ✅ — both still on — **but the Security log is CIRCULAR at 20 MB and its OLDEST EVENT was 2026-09-03 10:55, i.e. about 32 HOURS of history, not 12 days.** The window the 08-23 session was banking on had already been overwritten. **Cause found: Event ID 5379 ("Credential Manager credentials were read") accounts for 22,435 of ~29,000 events in 24 h — 78% of the log**, roughly 15/minute, flushing everything else out. (5058/5061 key-file ops add ~5,500 more.) | ✅ CLAUDE 09-04 | **FIX APPLIED: Security log 20 MB → 256 MB** (`wevtutil sl Security /ms:268435456`), verified after: MaxSize 256 MB, Mode Circular. At the observed ~29,000 events/day that is **~15 days of retention** instead of ~1.2, which finally makes #62 answerable. C: has 55.4 GB free, so the space is immaterial. **UNDO:** `wevtutil sl Security /ms:20971520`. 🔴 **DO NOT decide #62 before ~2026-09-18** — re-run the 5140 query then, and only then does an empty result mean anything. ⚠️ **The 5379 flood is an observation, not a diagnosis** — `ProcessName` is blank on 5379 (normal for that event), so the source is NOT identified and I did not guess at it. Naming it would need process auditing or Sysmon. It is plausibly a password-manager/browser poll, which would tie to #117/#118. **The general lesson: enabling an audit is not the same as retaining its output — check the log's oldest event before reading anything into an empty result.** |
| 134 | ✅ **AUDIT FALSE POSITIVE FIXED — `HCC-Audit.py` was reporting two healthy Echo sensors as a FAIL.** Tonight's run flagged *"living - 2 entities unavailable for 251 min"* (`sensor.living_room_echo_dot_next_alarm`, `_next_timer`). **Proven not-a-fault before changing anything:** the SAME device's `sensor.living_room_echo_dot_next_reminder` carried a **live future value (2026-09-06T14:00Z)** and `media_player.living_room_echo_dot` read **`idle`** — so the Echo was demonstrably talking to HA. Those two sensors read `unknown` simply because **no alarm and no timer are set**, which is the normal state most of the time. The 251-minute age is the **15:51 rollback restart** resetting their timestamps — the #68 artifact, not a silence. | ✅ CLAUDE 09-04 | Added both to `BASELINE_EXACT` with the reason in-line; re-ran and the FAIL is gone, leaving only `garagepc` (#112, Jeff physical) and one transient CodeProject.AI ping timeout that had already self-healed (the coverage block shows the beast answering **HTTP 200**). 🔴 **SAFE, and here is why it is not just silencing an alarm:** `media_player.living_room_echo_dot` is deliberately **NOT** baselined, so a genuinely dead Echo still fails the audit through it. Only the two permanently empty sensors are excused. ⚠️ Every other `*_next_alarm`/`*_next_timer` in the house was already covered by the `sensor.all_devices_`, `sensor.jeffrey_s_` and `sensor.this_device_` prefixes — enumerated all 21 of them rather than assuming. **This matters because a standing false FAIL trains the eye to ignore the audit — the same alert-fatigue class as the two permanent add-on Error badges in #57.** Script is NOT version-controlled (#99); backup `HCC-Audit.py.bak-20260904-2004`. |
| 63b | ✅ **#63 CLOSED 2026-09-04 — THE SMB1 CLIENT IS THE FIRE TV, AND IT STOPPED SIX DAYS AGO.** #63 recorded SMB1 rejections whose *"client [is] not named in the event"* and guessed *"it is likely an old client on the LAN, not the Apple TV."* **The guess was right, and it is now identified.** `Set-SmbServerConfiguration -AuditSmb1Access $true` was enabled on 08-23 for exactly this, and unlike the Security log (#133) **the `Microsoft-Windows-SMBServer/Audit` log survived** — separate 8 MB log, oldest entry 2026-08-27 11:53. **Measured, all 204 events: `Client Address: 192.168.1.215`, ONE client, no others.** Identified two independent ways: the gateway device list returns hostname **`20BEB83A8C5D`** for `.215`, which is the exact hostname `NETWORK_MAP.md` records for the **Fire TV** under its fixed DHCP reservation. **Timeline: 168 events on 08-27, 36 on 08-29, and NOTHING since 2026-08-29 11:55** — six days silent. | ✅ closed 09-04 | 🟢 **No exposure, and nothing to fix.** `EnableSMB1Protocol` is **False**, so every one of these was a **rejected** attempt, not an SMB1 session. The burst dates line up with the 08-27 AirTV/Fire TV work (stick reset, HDMI extender) — the Fire TV probed SMB1, was refused, and fell back. **Leave SMB1 disabled.** ✋ **Audit deliberately LEFT ON** — it costs ~25 events/day in a log that holds 8 days of them comfortably, and it is the only visibility into SMB1 attempts. **UNDO if ever wanted:** `Set-SmbServerConfiguration -AuditSmb1Access $false`. ⚠️ **This does NOT close the Guest-signing half of #63** (Id 1004, Apple TV probing as `Guest` then succeeding as `tv`) — that behaviour was judged functionally OK on 08-23 and is unchanged; **do not "fix" it blind.** 🔑 **The contrast with #133 is the reusable lesson: two audits were enabled the same day for the same reason, and only one produced usable evidence — because the Security log is circular at 20 MB and rolled over in ~32 h while the SMBServer log did not. Always check the log's oldest event before reading anything into it.** |
| 136 | 🔴 **`active_station` WAS ALWAYS `null` — the card reported "not watering" through every single run, forever.** `functions/api/irrigation/index.js` read `status.watering_status.stations[0].station`. **That key does not exist.** Captured live 2026-09-05 05:56:20 with zone 2 physically running: `watering_status = { current_station: 2, group_watering:[{program:"e", stations:[{station:1,run_time:43},{station:2,run_time:14},{station:5,run_time:23}]}], water_event_queue:[{station:2,run_time_sec:840},{station:5,run_time_sec:1380}] }`. So `.stations` → undefined → `[]` → null. **The running zone is `current_station`; the station LIST is nested in `group_watering[0].stations`.** ⚠️ **Orbit ships two decoy keys — a HYPHENATED `watering-status` (null) and a plural `watering_statuses` (`[]`) — do not switch to either on the strength of the name.** | ✅ CLAUDE fixed 09-05 | **VERIFIED LIVE against the running controller**, not asserted: before `active_station=None`, after `active_station=5, is_watering=True, queue=[{station:5,run_time:23}]` while zone 5 was physically on. Also now exposes `is_watering`, `watering_queue`, `program_stations`. |
| 138 | 🔴 **`suggested_start_time` WAS NEVER SURFACED — and it is the field that explains the 5 AM start.** Orbit carries **BOTH** `next_start_time` (`2026-09-05T06:20`) **AND** `suggested_start_time` (`05:00`). **The 05:00 one is what actually fired.** The card only ever showed `next_start_time`, so it could not tell Jeff his watering was about to begin — **and I read `next_start_time: 06:20` as proof nothing was scheduled and told him irrigation was not running while it was.** Both are exposed now. 🔴 **NEVER treat `next_start_time` as "the next run" on its own.** | ✅ CLAUDE fixed 09-05 | Verified live: `suggested=05:00` now returned. |
| 139 | 🔴 **13 OF 27 DATA LOADERS RENDERED ONCE AT BOOT AND FROZE — the app looked live and was not.** Jeff, 2026-09-05: *"That is why the whole app is fake."* **Tested rather than argued with, and he is substantially right.** Swept every `load*` function in `index.html` for whether anything ever refetches it: **14 polled, 13 never did.** 🔴 **The worst was `loadIrrigation` — the ONE card whose state changes with nobody touching anything, because zones start and stop on a schedule — and it was the only live card in the app with NO polling at all.** It ran once at boot, and the section-switch handler was guarded by `!window._irrLoaded`, so re-opening the IRRIGATION tab showed the same frozen snapshot forever. Jeff stood watching his sprinklers run while the card said idle, because it had fetched before the zone started and never looked again. | ✅ CLAUDE fixed 09-05 | **FIXED:** `_irrLoaded` one-shot guard removed; irrigation polls **60 s**; and the four other genuinely-live cards now poll — **`loadLightning` 2 min** (storm cells on WEATHER *and* the hero — during a storm it showed whatever it saw at app open), `loadFire` 5 min, `loadAirQuality` 5 min, `loadWatering` 5 min, `loadHomeStatus` 60 s. All five verified read-only GET-and-render before polling them; all guarded on `document.hidden` so a backgrounded app costs nothing. ✅ **Correctly left one-shot, do NOT "fix" these:** `loadForecast`, `loadClips`, `loadFullSensorLog`, `loadDrought`, `loadElecProfile`, `loadElectricStats` — nothing about them changes minute to minute. `loadIrrigationDirect` / `loadIrrigationFromHA` are fallbacks invoked BY `loadIrrigation`, so they inherit its poll. ⚠️ **MY FIRST SWEEP WAS WRONG and I nearly reported it** — it listed `loadWeather` and `loadAlerts` as one-shot when `setInterval` calls for both are plainly in the file. Redone with balanced-paren parsing **plus a self-check on those two known-good cases before trusting any number.** 🔴 **Put a self-check on any audit before quoting its output — an audit that cannot detect a case you can see by eye is not evidence.** 🔴 **AND THE SERVICE WORKER MUST BE BUMPED ON EVERY `index.html` CHANGE** (`CLAUDE.md` says so; I skipped it on the first UI commit, so the fixes could not reach his installed PWA at all). Ended at **hcc-v104**. |
| 140 | ✅ **VALVE TEST PASSED — the leak is entirely downstream of the irrigation main, and the house is exonerated.** Jeff closed the irrigation main at **~10:11**. Two independent measurements, both clean:<br>**(a) The straddle hour.** Last broadcast before shutoff `10:00:25 = 23460.8`; `11:03 = 23462.0` → **+1.2 gal**. Predicted if irrigation-side: 6.1 gal/hr × the 11 min still open = **1.12 gal**. Predicted if house-side: **~6 gal** (a toilet does not care about an irrigation valve). **Measured 1.2 against a prediction of 1.12.**<br>**(b) The still hour.** `sensor.water_gallons` has read **23462.0 unchanged for 54+ minutes** — **ZERO gallons** — against 6.1 gal/hr immediately before. | ✅ closed 09-05 | **The rate, measured over four independent windows before shutoff:** 01:00-05:00 **6.2 gal/hr** (house asleep) · 08:01-09:02 **4.8** (includes morning household use) · 09:02-10:00 **6.1** · overnight total **24.8 gal**. ≈**144 gal/day**, ≈**$2.76/day / $83/month** at the bill-validated rates ($0.00908 water + $0.01011 sewer) — and all of it charged sewer on water that never reaches the sewer. 🔴 **WHERE TO LOOK, in the order the evidence puts it:** **(1) the Orbit anti-siphon valve installed 09-03** — ten nights with the supply off ran **0.0-1.3 gal**, and the leak appeared on the **first night it was pressurised** (8.8 gal); **(2) the zone-4 bonnet swapped 09-04** — the rate **tripled** to 6.2 gal/hr right after, which is exactly #119's warning that running pressure turns a weep into a split; **(3) the other three bonnets** from the same freeze (#121). Signature to look for: ~10 drips/second at static pressure — a patch that never dries or a damp ring at a bonnet seam, **not** a spray. ✋ **No rush to reopen:** the lawn took **1,231 gal** this morning and nothing is scheduled until **Monday 05:00**, so there are two clear days to fix it without losing water or watering. |
| 142 | ✅ **BURN CARD SCORED A MISSING WIND READING AS "✓ Wind calm" IN GREEN.** `renderBurn()` computed `Math.round(Number(STATION.windSpeed)||0)`, so a station that reported no wind produced **0 mph**, fell through every threshold, and printed the safest-looking line on the card — **on the card that advises Jeff whether it is safe to light a brush fire.** Wind is that card's own stated "#1 driver of ember spread". Same coercion as `rain_delay||0` (#137) and the `isConnected` bug, but with the worst possible consequence. **FIXED:** unknown is now UNKNOWN — `windKnown` is false only when BOTH `windSpeed` and `windGust` are absent/NaN, and it renders **"❗ Wind UNKNOWN — station not reporting. Do not treat as calm."** and **adds 2 to the risk score** rather than scoring zero. | ✅ CLAUDE 09-05 | Logged during the leak incident and deliberately not changed mid-incident; fixed once the valve test was resolved. Gates: lint clean, smoke-test passed 0 page errors, `doors-entity-test` and `garage-entity-test` both ALL CHECKS PASSED against a live `/api/states` dump. Service worker **hcc-v106**. |
| 79b | ✅ **THE 09-04 "8-ENTITY NIGHT CHECK BUCKET" THREAD IS CLOSED — verified against live HA, not assumed.** A session on 09-04 noticed `garage-entity-test.js` printing a **different 8-entity** Guardian Night Check bucket while the card's shared `hccDoorSensors()` correctly returned 4, and left it mid-investigation: *"Checking whether that's old code shown for comparison or a live path that never got the fix."* **Answer: the app was always right.** `guardianNightCheck()` (`index.html:10767`) calls the shared `hccDoorSensors(states)`, as do the hero cell (10562) and the Doors card (10705) — one helper, three callers, exactly as #79 intended. The 8-entity bucket was the **test's** stale inline copy, which the 09-04 session then fixed. | ✅ closed 09-05 | **Proven by running both tests against a LIVE `/api/states` dump** (the argument they require — invoking them bare and calling the crash a fault is the 09-04 mistake in `COST_LEDGER`): Night Check now reports **Doors (4)** = back deck, mailbox, front door, garage man door, and **Garage (1)** = `cover.garage_door`. Every exclusion asserted: no `ai_doorbell`, no battery flags, no spare contact, overhead door not double-counted. **ALL CHECKS PASSED** on both. |
| 1 | **Qualls six** on William Larkin Qualls | ✅ **REAL — detach** | ThruLines lists 8 children, ALL b.1863-1881. **None** of the six disputed (1836-1849) appear. Zero matches, zero descendants |
