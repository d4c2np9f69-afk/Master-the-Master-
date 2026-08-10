# Mower GPS / Sensor — Coworker Hand-Off
**Written 2026-08-10, ~4:15 PM CDT (cloud session)**

Everything in this file is work the **cloud session cannot do** — it needs either
physical access to the mower's ESP32 box, a USB cable + Arduino IDE, or hands-on
access to Jeff's LAN. The app-side and server-side work is already done and
deployed (see the Change Log in `CLAUDE.md` for 08-10).

---

## What's already DONE (no action needed — for context only)

- Coverage/telemetry is now accumulated **server-side** in Cloudflare KV
  (`functions/api/hours.js`). It records on every POST the box makes, with **no
  app open and no buttons** — this was Jeff's hard requirement.
- Full raw sensor log (every field, every reading, capped 5,000) — `?log=1`.
- Per-mow summaries + each mow's own GPS track — `hours_history` KV key.
- Cumulative yard coverage map, ~1 m grid, deduplicated — `yard_coverage` KV key,
  served via `?coverage=1`.
- A **Pause/Resume GPS tracking** toggle in YARD → Yard Map (posts
  `{__cmd:'pause_tracking', value:true|false}`), stored in KV so it applies
  server-side regardless of which device toggled it.
- The old 2-point "Pin Track to Photo" calibration was **deleted** — it derived
  scale from only the track's first/last GPS point and exploded whenever a mow
  ended near where it started. Replaced with a bounded auto-fit + manual
  rotate/zoom/pan pad.

---

## TASK 1 — ESP32 firmware: record from first GPS fix to last (HIGH PRIORITY)

**Why:** Jeff, verbatim: *"if the gps is going to be useful it has to work
automatically no pushing buttons at the beginning and end of mows it needs to
start recording from when it gets its first signal to its last."*

**Current behaviour** (per `CLAUDE.md` → Sensor / ESP32 Hardware):
- Posts a full payload **every 90 s only while `engine_on` (RPM > 200)**
- Posts a heartbeat every 5 min when the engine is off (battery/WiFi/temp only —
  **no GPS**)

**The gap:** GPS logging is gated on engine RPM. If RPM sense drops out, or Jeff
is moving the mower with the engine idling below the threshold, those GPS points
are never sent. It should be gated on **having a GPS fix**, not on engine RPM.

**Change needed in the `.ino` firmware:**
1. Start appending to the track buffer as soon as `has_fix` is true — regardless
   of RPM/engine state.
2. Keep `engine_running` as its own independent reported field (the app and
   server still use it for mow-start/mow-end detection and the heartbeat merge —
   **do not remove or repurpose it**).
3. Include `lat`/`lon`/`has_fix` in the **heartbeat** payload too, not just the
   live one. The server already merges any GPS it receives from any payload type,
   so this alone meaningfully improves coverage with zero server changes.

**Server side is already ready for all of this** — `gpsPointsFrom()` in
`functions/api/hours.js` reads both `track[]` and a bare `lat`/`lon`, so whatever
the firmware sends gets merged automatically.

---

## TASK 2 — ESP32 firmware: store-and-forward buffering (HIGH PRIORITY)

**Why:** Jeff believed this already existed and was rightly annoyed it didn't.
If WiFi is weak at the far end of the yard, those readings are currently **lost
forever** — the box posts, the post fails, and nothing retries.

**Change needed:**
1. Keep a local ring buffer (SPIFFS/LittleFS or a RAM array) of readings that
   failed to POST.
2. On a successful reconnect, flush the backlog **oldest-first**.
3. Each buffered reading must carry its **own captured timestamp** (or seconds-ago
   offset) so the server doesn't stamp them all with the flush time.

**Server side:** already tolerant — every POST is merged/appended independently,
duplicates are deduplicated by grid cell, so a flush of 50 buffered readings is
safe. If you add a per-reading timestamp field, tell the cloud session the field
name and it'll be wired into the log/history display.

---

## TASK 3 — Real aerial photo of Jeff's actual property (MEDIUM)

**Why the map needs manual alignment today:** `images/yard-aerial.jpg` is **not
Jeff's property**. It has `32.899480 N, 97.033920 W` baked into the image as text
— that's Fort Worth, TX. Jeff's real coords are ~`36.4766, -86.6601` (White
House, TN). The GPS simulation code even hardcodes those Texas coords.

Because the photo isn't georeferenced to the real yard, the app cannot
auto-align — hence the rotate/zoom/pan pad.

**What would fix it permanently:**
1. Grab a real satellite/aerial image of 301 (Jeff's address) — Google Earth Pro
   can export with known bounds, or any GIS/county parcel viewer.
2. Record the **exact lat/lon of the image's NW and SE corners**.
3. Hand the cloud session the image + those two corner coordinates. It can then
   georeference the map properly and the alignment pad becomes unnecessary —
   the track would land on the real grass automatically, first time, forever.

---

## TASK 4 — Confirm the box's real field names (LOW, but removes guesswork)

The cloud session has **no network path to the live endpoint** (verified: the
sandbox proxy blocks it, 403). It cannot see a real payload.

Please capture one real live POST body from the box (serial monitor is easiest)
and paste it back. Specifically confirm:
- Is `track[]` sent as `[[lat,lon],...]` or `[{lat,lon},...]`? (server handles
  both, but confirming lets us drop the dead branch)
- Is `has_fix` a boolean?
- Are `rpm_peak`/`rpm_avg` reset per-mow or cumulative?
- Does `dist_session_m` reset per-mow?

---

## Coordination note

Per `CLAUDE.md` Mandatory Rule 13: the coworker treats `index.html` and
`functions/` as **read-only reference**. The `.ino` firmware is **not** in this
repo, so Tasks 1 & 2 don't collide with the cloud session at all. Task 3 & 4 are
hand-back-the-data tasks. `git pull` first to get the latest `CLAUDE.md`.
