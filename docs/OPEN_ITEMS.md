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
| 12 | **`beehive-config/` is a STALE SNAPSHOT, not a mirror.** Cost an hour on 08-19 — grepping it for the AI scanner returned nothing, because the scanners live in `configuration.yaml`. | **CLAUDE** | 08-01, **18 days** | Re-pull from live HA. Every session that greps it gets lied to. |
| 13 | **Dead `Blink Fast Motion Poll` block still in `packages/hcc.yaml` 502-517.** Disabled, harmless, present. | CLAUDE *(classifier-blocked)* | 08-19 | §17 PART K: hcc.yaml only via the Terminal add-on, and that path is blocked. |
| 14 | **`recorder: purge_keep_days: 45` not set.** Nothing is being purged today (measured) but that is luck, not configuration. | **CLAUDE** | 08-19 | `configuration.yaml`. |
| 15 | **`blinkpy` manifest errors ~4/hr** (`Manifest stale 2102` / `System is busy 307`). **Not root-caused.** | **CLAUDE** | 08-18 | Rate fell 15→4/hr on 08-19 but the drop preceded my change — do not claim credit. |
| 16 | **`hcc_zigbee_pairing_mode_temporary_..._08_17`** — a "temporary" automation still sitting there, disabled. | **CLAUDE** | 08-17 | Delete once #11 is done. |
| 17 | ~~No disk/CPU/memory visibility on Beehive~~ — System Monitor added 08-19. 94.3 GiB free, CPU 24 %, 120 °F. | ✅ closed 08-19 | — | |
| 18 | **`hero-cameras.jpg`** still has a fake title, a fake "ALL SYSTEMS READY" panel and six dummy tiles. | **CLAUDE** | I.11 | Needs the image pipeline on this PC. |
| 19 | **Irrigation zone photos** — all 6 carry the same fake gold-frame overlay, contradicting the "real photographs" rule. | **JEFF decides**, CLAUDE does | 08-08, **11 days** | All six, or just Garden? |
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

## Honest scoreboard — 2026-08-19 23:20

**27 tracked · 4 closed · 23 open.**

Of the 23 open: **11 are Jeff's** (hands, credentials, purchases, decisions) and **7 are mine with
nothing blocking them** — #12, #14, #15, #16, #18, #20, plus #13 pending a permission rule.

**Oldest open item: 29 days.**

**Those seven are the real answer to "why does shit sit."** Not blocked. Not waiting on Jeff.
Never picked up — because each session optimised for closing whatever was in front of it and then
writing a summary.
