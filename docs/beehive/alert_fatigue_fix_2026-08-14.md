# Alert fatigue — root cause and fix (2026-08-14)

## The real problem, found by accident
Chasing an Apple TV question revealed that **the entire camera pipeline had been dead since
Aug 10 11:16** — zero motion events across all six cameras for 48 h. Root cause was NOT a bug:
**Jeff had the Blink system disarmed**, because the notifications never stop.

That is the actual failure loop worth fixing:
> too many alerts -> Jeff disarms -> ALL camera automation silently stops -> no security at all

A disarmed Blink produces no error anywhere. `alarm_control_panel.blink_loewen301` is the only
place it shows. **Worth surfacing in the app's Guardian section** so "why did the popups stop?"
is answerable at a glance.

## Fixes applied
1. **Garage motion detection turned OFF permanently** (`switch.garage_camera_motion_detection`).
   Jeff: "I don't need motion in the garage at all" — it is mains-powered so it ran constantly,
   and it fired 6 times in 7 minutes while he was simply working in there.
2. **New automation `automation.hcc_ai_alert_cooldown`** (created via API, id `hcc_ai_alert_cooldown`):
   - triggers on `codeproject_ai.object_detected`
   - waits 5 s (so the existing notify/popup automations finish their own mute check first —
     avoids a race where the cooldown suppresses the very alert that caused it)
   - **only if that camera is not already muted**, sets `input_datetime.hcc_ai_mute_<camera>`
     to now + 5 minutes
   - Deliberately does NOT extend an existing mute, so sustained activity yields **one alert
     every 5 minutes** rather than silence — a prowler still generates repeat alerts.
   - Works with the EXISTING mute plumbing: hcc.yaml lines 200 and 371 already gate both the
     phone notify and the Fire TV popup on these helpers.
   - Templates validated against live entities (camera_key derivation, muted/not-muted both
     directions, timestamp format) without firing a test alert.

## Tuning
5 minutes is a starting point. Raise it if the deck-at-night case is still noisy; the interval
lives in the single `timedelta(minutes=5)` in that automation.

## Still open
- Presence-based suppression (do not alert interior/near cameras while `person.jeff_loewen` is
  home) — the biggest remaining reduction, not yet built.
- Per-camera object rules (driveway VEHICLE at 2 AM matters; back yard PERSON at 8 PM is Angela).
