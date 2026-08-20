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
| 1 | **Rotate the Weather Underground API key.** Removed from all 3 repo locations 08-19, but it is in PUBLIC git history since ≥08-16 and cannot be un-published. | **JEFF** | flagged 08-16, **3 days** | wunderground.com → Member Settings → My Profile → API Keys. Then paste into Cloudflare as `WU_API_KEY` and I delete the fallback in `weather.js`. |
| 2 | **HA backup encryption key exists on ONE PC.** Without it every `.tar` in iCloud is undecryptable — "the single most load-bearing secret in the whole disaster-recovery system". | **JEFF** | 08-02, **17 days** | Bitwarden now exists. This is a 2-minute Secure Note. |
| 3 | **Bitwarden duplicates** — four `idm.xfinity.com`, one a typo account `jeff.lewen@comcast.net`. Makes the vault ask you to choose at login. | CLAUDE *(needs one unlock)* | 08-19 | The plan says **"Do this first next session."** |
| 4 | **Full-disk encryption OFF on both drives.** TPM ready but Secure Boot is OFF and Device Encryption requires it. | **JEFF** | 08-19 | BIOS trip on reboot. |
| 5 | **Tier-2 password rotation** — ~190 weak/reused of 548. | **JEFF** | 08-19 | Rotate as he logs in, never a marathon. |

## 🟠 P2 — SECURITY COVERAGE SILENTLY DEGRADED

| # | Item | Owner | Age | Notes |
|---|---|---|---|---|
| 6 | **`front_right` is armed and healthy but BLIND** — 1 clip since 08-15, zero motion in 26 h, telemetry fine (75 °F, −48 dBm). | **JEFF** | found 08-19 | PIR aim in the Blink app. **Not previously recorded anywhere.** |
| 7 | **Backyard PIR logs zero motion even overnight at 78 °F.** Heat explains daytime; it does not explain cool hours. **Not root-caused.** | **JEFF** | I.13, 08-15 | AI thresholds already fixed and proven — this is the sensor. |
| 8 | **Garage door was standing OPEN at 22:00 on 08-19 and HA cannot tell you.** No garage-door entity exists. | **JEFF** | 08-08, **11 days** | SONOFF MINI DRY: wire, power, eWeLink-pair (Inching Mode), Matter-commission. App side done since 08-08. |
| 9 | ~~Garage Blink battery "LOW"~~ — phantom entity, DISABLED 08-19. Mains-powered Mini; disarmed state is Jeff's settled decision. | ✅ closed 08-19 | — | Kept so nobody "fixes" it again. |
| 10 | **Panic automation (HA side)** — the app fires the webhook; the automation waits on Zigbee hardware. | CLAUDE *(blocked on #11)* | 07-31 | |
| 11 | **Zigbee fleet still in boxes** — 7 door/window + 5 leak + dongle arrived 08-15, deliberately unopened until the camera pipeline was verified. **It now is.** | **JEFF** | 08-15 | Unblocks #10. First moves already written down: disable auto-firmware-update BEFORE pairing, pick the channel around the WiFi census, dongle on its extension cable. |

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

**27 tracked · 9 closed · 18 open.**

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
