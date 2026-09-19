# Blink cameras down + repeating 2FA code texts — 2026-08-19

**Opened 4:20 PM CT** by Jeff: "cameras are down and Blink keeps sending me a 2FA code."

## What is actually broken

Blink config entry `01KY0MYHR8VN4646FQDSXA7VDC` is in **`setup_error`**,
reason **"Required Blink re-authentication"**. All 6 cameras + the
`alarm_control_panel.blink_loewen301` went `unavailable` at
**2026-08-19 21:00:00Z = 4:00 PM CT**, ~20 min before Jeff asked.

A reauth flow is already open and parked at step `reauth_confirm`
(flow_id `01M0DY187XSZA66J6CHE66E532`). Only Jeff can finish it — it needs
the account password, which I do not handle.

## Why the codes keep coming — SELF-INFLICTED

`automation.hcc_blink_periodic_health_reload` reloads the Blink config entry
**every 15 minutes, unconditionally** (`time_pattern minutes: /15`, no condition).
That is harmless while auth is good — history shows a clean 9–15 s blip on every
:00/:15/:30/:45 boundary going back days. But once Blink rejected the token, each
reload became a **fresh login attempt, and every login attempt makes Blink send a
new PIN**. 4 codes/hour, forever, with nothing to stop it.

Corroboration: the log warning "could not authenticate: Required Blink
re-authentication" has **count=2** — exactly the two reloads at 21:00 and 21:15.

**Action taken 4:22–4:25 PM CT — all three Blink automations turned OFF:**
- `automation.hcc_blink_periodic_health_reload` (the code machine gun)
- `automation.hcc_blink_auto_heal` (error-triggered, would also reload)
- `automation.blink_fast_motion_poll` (see below)

## Probable root cause of the lockout — ALSO SELF-INFLICTED

`beehive-config/hcc.yaml:484` "Blink Fast Motion Poll":

    description: "...every 30s..."
    trigger: time_pattern, seconds: "/10"     # <-- actually every 10 SECONDS

Description says 30 s; the code says 10 s. It force-refreshes **6 Blink motion
sensors every 10 seconds** — roughly **52,000 cloud calls/day**. It is `mode: single`
and cannot even finish inside its own interval: 40 × "Blink Fast Motion Poll:
Already running" in the log.

Blink is visibly throttling us: **147 errors** from `blinkpy.sync_module` —
`{'message': 'System is busy, please wait', 'code': 307}` and
`{'message': 'Manifest stale, please rerequest', 'code': 2102}`.

Over-polling at this rate is the most likely reason Blink invalidated the session
and demanded re-auth. NOT PROVEN — Blink does not publish its rate limits — but the
throttle responses are direct evidence we are past them.

## What Jeff has to do (one time, one code)

1. Open Beehive: http://192.168.1.66:8123/config/integrations/integration/blink
2. The Blink entry shows an error / "Reconfigure" — click it, Submit.
3. Blink sends **one** new PIN. Ignore every code received before this step —
   they are stale. Enter the new one.
4. Cameras come back. Tell me and I re-enable the automations, fixed.

## RESOLVED 4:40 PM CT — and the watchdog gap Jeff caught

Jeff re-authenticated at **4:40 PM CT**. Verified at the far end: entry `state=loaded`,
0 pending Blink flows, **25/25 entities available**, alarm panel `armed_away`.
Total outage 4:00–4:40 PM = **40 minutes**.

### Jeff's question: "I thought you had a watchdog on that Blink set up?"

He did — **three of them — and the watchdog is what was texting him.** They were built
to heal a *crash* (blinkpy LoginError, core#176836). They had no concept of an *auth
failure*, so they kept doing the only thing they knew — reload — which in that state
means "attempt login," which means "send Jeff a PIN."

**The real gap was not healing, it was ESCALATION.** No watchdog could tell Jeff
"I can't fix this one, only you can." Blink sat dead 40 minutes and the sole signal he
got was a stream of codes with no explanation.

### Changes made (all live + verified 2026-08-19)

| Automation | Change |
|---|---|
| `hcc_blink_periodic_health_reload` | Added condition `config_entry_attr(entry,'state') != 'setup_error'`. Cannot spam codes again. **ON** |
| `hcc_blink_auto_heal` | Same guard added as a second condition. **ON** |
| `hcc_blink_needs_re_auth_alert` | **NEW.** Cameras unavailable 5 min AND entry in `setup_error` → time-sensitive push to Jeff's iPhone + persistent notification, with the fix steps and a deep link. 5 min > the ~15 s reload blip so routine reloads never fire it. **ON** |
| `hcc_blink_motion_poll_30s` | **NEW.** Replaces the runaway `/10` poll at the intended `/30`, plus `max_exceeded: silent` and a condition that it only polls while the entry is `loaded`. **ON**, confirmed triggering. |
| `blink_fast_motion_poll` (hcc.yaml) | **OFF** — superseded. |

`config_entry_attr()` was verified live against HA 2026.8.2 before use, not assumed.

## Still owed

- [ ] **Delete `Blink Fast Motion Poll` from `beehive-config/hcc.yaml:484`.** It is only
      turned off, not removed. **No SSH (22) and no Samba (445) on Beehive** — both
      confirmed closed — so this needs Studio Code Server in the browser.
- [ ] The four automation changes above live in HA's `automations.yaml` via the API. Pull
      them back into the repo's `beehive-config/` snapshot (it does not auto-sync).
- [ ] Watch for fresh `code 307 / 2102` throttle errors. If they persist at 30 s, back off
      to 60 s.
- [ ] `sensor.blink_301_front_doorbell_*` and `sensor.blink_garage_*` read `unknown` after
      recovery (others report fine). Re-check; likely just a first-poll gap.

## Not an outside attack

Timing matched our own 15-minute reload cadence exactly, and the failing login was HA's.

---

# SEPARATE FAULT, SAME DAY: Tuya also needs re-auth

Raised by Jeff 4:47 PM CT. **Unrelated to Blink — different integration, different cause,
and this one does NOT send codes.**

Entry `01KWZ9MB49B6ZR9G3AYG6KC6N2` (`ap-000895.1644247c...`) is in **`setup_error`**,
reason **"Authentication failed. Please re-authenticate."** A reauth flow is parked at
step **`scan`**.

**Down since 2026-08-18 23:04:41Z = 6:04 PM CT Tuesday — ~22.5 hours**, which is an HA
restart boundary. The cloud token did not survive the restart. Nothing alerted anyone.

**6 devices / 25 entities dead the whole time:**
Sharky (BL20 Pro robot vacuum), Jeff's Bed Lamp, Angela's Bed Lamp, Hot Water Circulation
Pump, Garage Fan, and the "Turn on Sharky" scene.

**Fix — SMART LIFE app, not Sylvania:**

> ⚠️ **I got this wrong first and Jeff caught it.** I initially told him to scan from the
> **SYLVANIA Smart WiFi** app, because `HCC-secrets/tuya_ha_usercode.txt` said so. That file
> was wrong. **The Sylvania app is the one app that provably cannot do this** — it can scan
> HA's QR but Tuya blocks the confirm step with *"use the designated APP"* (proven 2026-08-13,
> `docs/inventory/HCC_INVENTORY.md`). The 4 Sylvania lamp plugs are vendor-locked and are
> **not in HA at all** — they have nothing to do with this integration.
>
> **Cause of the error: I trusted a local note instead of searching the record.** Rule 1 and
> Rule 4 exist for exactly this. The record had the right answer the whole time.
> `HCC-secrets/tuya_ha_usercode.txt` has been corrected (old copy kept as `.bak-2026-08-19`).

The Tuya link was established 2026-07-07 via **Smart Life** with a generic JH-G01U
"Mini Smart Socket" (Shenzhen Jiuheng). Correct procedure:

1. **Smart Life app** → Me → Settings → Account and Security → **User Code**.
   Read it fresh — the code previously in the secrets file (`BbVvzAdMxN`) was recorded from
   the *Sylvania* app and is NOT verified as the Smart Life account's code.
2. Beehive → Devices & Services → **Tuya → Reconfigure** → enter User Code → Submit → QR appears.
3. **Smart Life's own in-app scanner** (scan icon, top of the Me screen) → scan → blue
   **Confirm login**. NOT the iPhone camera (that just opens a website). NOT Sylvania.

**The QR is ONE-TIME-USE and expires.** Fresh QR, scan once, Confirm login fast.
*"already been used"* = a spent QR — cancel the flow and restart. The flow that was parked at
step `scan` had been sitting for hours, so it was dead on arrival.

## Tuya escalation — BUILT 2026-08-19

`automation.hcc_tuya_needs_re_auth_alert` (**ON**). Tuya had no watchdog and no alert of any
kind, which is why it died silently for 22 hours. Triggers on the hot-water-pump plug being
unavailable 10 min **or** on HA restart (exactly how it died), conditioned on the entry being
in `setup_error`, re-checked after a 3-minute settle. Sends a time-sensitive push plus a
persistent notification carrying the *correct* Smart Life instructions.

It cannot self-heal — a Tuya auth failure needs a QR scanned by the phone app that owns the
account. That is a vendor boundary, not a gap in the automation.

## Stale docs found while correcting this

- `docs/beehive/lighting_tuya_setup.md` (07-04) still says *"Use the Tuya app he already has;
  no Smart Life install / account-crossover needed"* and lists plug names
  (`switch.giraffe_plug`, `switch.lamp_couch`…) that never existed. It predates the 07-07
  Sylvania dead-end and the working Smart Life pairing. **Needs a correction header.**
