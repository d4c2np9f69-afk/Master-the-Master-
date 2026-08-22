# 2026-08-22 — fixing what the 08-21 session broke

Jeff opened the session with *"fix all the shit you did yesterday that broke last night."*
He named two things: **TV camera popups** and **the screen looks wrong**. Both were mine.
Written the same session, per Rule 3.

---

## 1. The 60" Vizio — TWO regressions, both mine, both fixed

The 08-21 display work stripped settings it should have preserved. Measured, not guessed:

| | Jeff's setting (BEFORE backup) | What I left it as | Now |
|---|---|---|---|
| Colour profile | `HDR Calibrated Profile 3-3-2026 14426.icc` | **unlinked from the display** | restored |
| `DpiValue` | `0xFFFFFFFF` (125%) | `0` (150%) | restored |
| Usable desktop | **1536 x 864** | **1280 x 720** | **1536 x 864** |

The 1536px width is Jeff's documented working viewport — the 08-21 change silently cost him
256px of desktop and his calibrated colour, which is exactly "the screen looks wrong."
The `.icc` file was never deleted, only unlinked, so the fix was a re-association.

**How it was fixed:** `reg import` of the 08-21 BEFORE backups
(`HCC-Scripts\display-color-backup-20260821\HKCU_ICM.reg` + `HKCU_PerMonitorDPI.reg`),
then `SystemParametersInfo(SPI_SETLOGICALDPIOVERRIDE, -1)` to apply the scaling **live**
so Jeff did not have to sign out, then the `Calibration Loader` scheduled task to reload
the colour profile. Verified: bounds read back 1536x864 and the profile re-reads correctly.

**Undo point:** the pre-restore state was exported first to
`HCC-Scripts\display-color-backup-20260821\UNDO-state-before-restore-20260822\`.

---

## 2. The TV popups — I did NOT break the template. I filtered it to death.

**The wrong theory, discarded:** that the person-only condition added at ~4 PM on 08-21 was a
broken template referencing a non-existent field. It is not. `trigger.event.data.object_type`
is real and `obj_type == 'person'` is the **identical idiom** the working phone-notification
automation uses (`packages/hcc.yaml` lines 230/271/305). The condition was correct.

**What actually happened:** person-only reduced the popup to almost nothing, the same evening
it was added. The only detections after the change were:

| Time | Camera | Detected | Result |
|---|---|---|---|
| 19:33 | Driveway | `car x3` | correctly suppressed |
| 19:34 | Back left | `bird x1` | correctly suppressed |
| after | — | **nothing at all** | — |

Before 4 PM the popup fired on vehicles and animals — the evening activity Jeff actually sees.
So from his chair the TV went dead the night I changed it. He was right to call it broken.

**Jeff's decision (08-22): Fire TV goes back to PERSON + VEHICLE + ANIMAL.**
The person-only condition was removed. The parked-GLE and far-field-street-traffic filters are
**kept** and are now the only conditions, so the parked GLE and passing street traffic still do
not pop. **Apple TV / HomeKit was NOT touched and stays person-only** — the AI Doorbell sensors
that drive it were never edited, because Jeff had just asked to kill "somebody's at the door"
for every cat.

**Phone notifications were never affected** and still cover person + vehicle + animal — they are
a different automation (`AI Object Detected Notify`, in `packages/hcc.yaml`), not the Fire TV
popup in `automations.yaml`. Confirmed `state: on` after the change.

**Backup:** `HCC-Scripts\popup-automation-backup-20260822.json` (full pre-change config).
`Verify-CameraStreams.ps1` run BEFORE (09:31) and AFTER (09:48) per the standing rule —
all 6 streams OK both times.

---

## 3. What was NOT last night's damage — do not re-blame the 08-21 session

Overnight camera blindness is **pre-existing**, not a new regression. Measured across three
nights (22:00–06:00 Central), motion sensors flap to `unavailable` and never once reach `on`:

| Night | motion `unavailable` | motion `on` | AI detections |
|---|---|---|---|
| 08-19 → 20 | 198 | **0** | **0** |
| 08-20 → 21 | 186 | **0** | **0** |
| 08-21 → 22 (last night) | 162 | **0** | **0** |

Last night was marginally the *best* of the three. This is the already-documented live safety
gap (CLAUDE.md Pending Item 0b), not something the 08-21 session caused.

**Still open, and the real remaining problem:** 4 of the 6 scanners
(`301_front_doorbell`, `front_right`, `301_backyard`, `garage`) have not run a scan since the
17:39 restart on 08-21 — they sit at `unknown`. They only scan on motion, and motion never
fires overnight. Fixing the popup filter does nothing for this; a popup cannot fire on a
detection that never happens.

---

# The night gap — what was built, and the real root cause

Jeff chose "freeze, but fix the night gap once first."

## BUILT: `HCC - Backyard Night Sweep (Blink wake + AI scan)`

Entity `automation.hcc_backyard_night_sweep_blink_wake_ai_scan`, live and `on`.
Every 20 min, 22:00–06:00: `blink.trigger_camera` → 45 s → `update_entity` → 5 s →
`camera.snapshot` → `image_processing.scan`. Alerts are deliberately NOT special-cased at
night — Jeff chose "everything alerts, same as daytime." Repeat spam is bounded by the existing
`HCC - AI Alert Cooldown` (30 min mute on 301_backyard when someone is home).

**Jeff originally asked for 60-second sweeps. That was NOT built, and here is the proof it must
not be:** HA ships `camera.snapshot` *and* a separate `blink.trigger_camera`. That second service
only needs to exist because **`camera.snapshot` does not take a new picture** — it returns the
last thumbnail Blink already had. A 60 s sweep on `camera.snapshot` would rescan a stale frame
480×/night (this is how a week-old deer stayed on the HomeKit tile). Forcing a real capture needs
`trigger_camera`, which wakes a **battery** camera through Blink's cloud — at 60 s intervals that
means dead batteries in days and a repeat of the 08-19 Blink auth code-storm. 20 min = 24 wakes
a night. **Do not shorten without Jeff's explicit say-so.**

## The Angela test, 2026-08-22 10:56 — the system was right

Jeff: *"Angela just left for the Barn and nothing fired on the Apple TV… she had to be seen to
get in the car."*

Traced live. Driveway motion fired, the scan ran at 10:56:09, and the annotated frame came back
with `car 90.6%` (the parked GLE) plus two far-field street cars — **and no person anywhere in
the frame.** Apple TV is person-only, so it correctly stayed silent; the Fire TV also correctly
stayed silent because the parked-GLE and far-field filters caught all three cars. Every component
did exactly the right thing.

**She was never in the picture.** Blink delivers ONE still per trigger, chosen by Blink, out of a
multi-second clip. She walked through the seconds that still does not cover. This is the single
biggest limitation of the whole stack and no HA-side tuning changes it.

## Root cause of the recurring "cameras are broken" cycle

The pipeline (motion → snapshot → AI → red boxes → popup → phone) is **healthy** and was proven
end-to-end twice today. What is lossy is everything upstream of it, in Blink:

| Fault | Evidence | Fixable in HA? |
|---|---|---|
| One still per event, chosen by Blink | the 10:56 Angela frame | **No** |
| Front doorbell offline | temp + Wi-Fi `unknown` since ~04:40, 0 motion in 25 h | **No** — physical/Blink app |
| Front right never reports motion to HA | 0 motion events in 25 h, **yet Blink recorded clips at 12:19, 13:51, 15:25** | **No** — Blink→HA is lossy |
| Backyard PIR aimed wrong | 0 motion in 25 h (known since 08-15) | **No** — physical aim |
| Overnight blindness | 3 nights measured: 0 motion `on`, 0 detections, every night | partially — the sweep above |

**Blink records motion that HA never sees.** `front_right` produced real clips on 08-21 while its
HA `binary_sensor` never once went `on` — the 30 s poll misses events that open and close between
polls. Chasing this in automations is why the cameras "never stay fixed."

## Also found today, NOT fixed, not urgent

- **Clip archive saves duplicates.** The 4 newest `301_driveway` clips are byte-identical
  (`md5 5761BC25CFCD`, 1,984,293 bytes each) under 4 different event timestamps. The archive
  stores the most recent clip for every event, so it cannot be trusted forensically.
- **`back_left` 08-21 clips are 40-byte stubs** (30 files) — truncated downloads. Older
  `back_left` clips are real video, so this started recently.

## The standing rule from here

See `feedback_camera_freeze_rule` in memory. **No camera/Blink/go2rtc/HomeKit/automation change
unless `Verify-CameraStreams.ps1` actually fails, or Jeff asks.** "It could be better" is not a
reason. The measured evidence is that the changes, not the cameras, are what break this house.
