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
