# Mower Sensor — Coworker Findings & Hand-Back

**Written 2026-08-11 (coworker session, Jeff's PC).**
Answers `docs/mower/gps_firmware_handoff_2026-08-10.md` and reports four real bugs
found by reading the **live** endpoint and the **real** `.ino` firmware — neither of
which the cloud session can reach.

Evidence throughout is from `GET /api/hours`, `GET /api/hours?log=1` (239 real
readings), `GET /api/hours?coverage=1`, and
`C:\Users\jeffl\Documents\Arduino\mower_hours_esp32\mower_hours_esp32.ino`.

---

## ⚠️ FIRST: `CLAUDE.md`'s "Sensor / ESP32 Hardware" section is wrong

It currently says:

> - Every 90s when `engine_on` (RPM > 200): full sensor payload
> - Every 5 min when engine OFF: heartbeat (`engine_running: false`, battery, WiFi, temp, `source: "heartbeat"`)

**Neither statement matches the firmware.** What it actually did before today:

- **While running:** samples every **30 s**, accumulates hours/RPM/track, and
  **never uploads at all** — WiFi is deliberately off during a mow.
- **While parked:** wakes every **300 s** and uploads the **complete payload**
  (not a reduced heartbeat).
- It **never sent `source`, never sent `engine_running`, and never sent `hours`.**

Confirmed against all 239 logged readings: `source` was `"live"` on every row (a
value *the server itself synthesised* in `logEntryFrom()`), and `engine_running`
was non-null **zero** times. Please correct that section — the server-side design
below was built on the description, not on the device.

---

## BUG 1 — The engine hour meter has never been fed by the sensor 🚨

The firmware sent **`hours_seconds`** (an integer count of seconds).
The app reads **`d.hours`** (decimal hours) at `index.html:6216` and `:6247`:

```js
var sensorHrs = (typeof d.hours === 'number') ? d.hours : 0;   // always 0
```

`hours.js` stores the raw body and never maps between the two, so `d.hours` has
always been `undefined` → `sensorHrs` always `0`.

**Impact:** `S.hours = S.hoursBaseline + <sensor hours>` has only ever been the
baseline. The box is currently holding **19,890 s = 5.53 h** of real runtime that
has never reached the app. This is the actual reason Jeff's hour meter kept
drifting from the physical meter and had to be re-entered by hand.

**Fixed in firmware today** — it now sends `hours` *and* keeps `hours_seconds`.
No app change needed, but note `hours` is **runtime since the box was installed**,
which is exactly what `hoursBaseline` expects.

---

## BUG 2 — The 08-08 "heartbeat erases the mow" fix never engages

`functions/api/hours.js:282`:

```js
const isHeartbeat = body.source === 'heartbeat' || body.engine_running === false;
```

The box sent **neither field**, so `isHeartbeat` was **always false**. Consequences,
all confirmed live:

- The merge-instead-of-overwrite never ran. The single post-mow upload that
  carries `rpm_peak` / `dist_session_m` / `track[]` is **overwritten ~5 minutes
  later** by the next parked upload, which reports zeros. Live `hours_data` right
  now: `rpm_peak: 0`, `rpm_avg: 0`, `dist_session_m: 0`, `track: []` — despite
  `dist_total_m: 6326` proving 6.3 km of real mowing has happened.
- `wasLive` (line 326) additionally requires `typeof prev.hours === 'number'`,
  which BUG 1 guaranteed was false.
- **Net: `hours_history` has never recorded a single mow.** `history` comes back
  `[]` from the live endpoint. The "Mow Sensor History" card can never populate.

**Firmware now sends an explicit, unambiguous contract:**

| field | when | meaning |
|---|---|---|
| `source: "mow_end"` + `mow_ended: true` | first upload after the engine stops | **this payload carries a completed mow's totals** |
| `source: "heartbeat"` | every later parked upload | idle report, merge don't overwrite |
| `source: "buffered"` + `age_s` | replayed after a WiFi failure | captured `age_s` seconds ago |
| `engine_running` | always | real boolean |

**Server change needed (your file, not mine):** record the mow-history snapshot on
`body.mow_ended === true` (or `source === 'mow_end'`) rather than on the
heartbeat-follows-live transition, and drop the `typeof prev.hours === 'number'`
precondition. Because the box never posts mid-mow, "a heartbeat followed a live
reading" is a state that cannot occur.

---

## BUG 3 — Coverage is recording the parked mower's GPS drift as mowed yard

`gpsPointsFrom()` merges `body.lat`/`lon` from **every** POST. The box posts every
5 minutes while parked, so the parking spot gets a GPS-drift sample injected 288
times a day.

Measured from live `?coverage=1` today:

```
88 cells · lat span 16.7 m · lon span 12.5 m
max visits 15 · 25 cells already at 3+ visits ("confirmed")
```

The entire "yard coverage map" is a **16.7 × 12.5 m blob at the parking spot.**
Worse, the visit-count shading added on 08-10 makes it actively misleading: parked
cells accumulate hundreds of visits and render as the **most confident** ground on
the map, while genuinely mown grass sits at 1–3 visits and renders faint.

**Firmware side (done):** track points are now gated on ≥ 3 m of real movement, so
drift is not logged as travel.

**Server side (please add):** don't merge a bare `lat`/`lon` into coverage when the
reading says the engine is off — i.e. skip the standalone-point branch when
`engine_running === false` / `source === 'heartbeat'`. The `track[]` array should
still always be merged. Suggest also clearing the existing 88 poisoned cells.

**Also fix while you're there — this one is no longer theoretical, it has FIRED.**
`gpsPointsFrom()` tests `body.has_fix !== false`. The box used to send **`0`** for
"no fix", and `0 !== false` is **true**, so a no-fix reading's `0,0` coordinates got
merged as a real coverage cell.

Caught live on 2026-08-11 while the box was on the bench with its GPS unplugged: it
posted `has_fix: 0, lat: 0, lon: 0`, and `?coverage=1` now contains a literal

```
"0,0": 6
```

— a six-visit cell at Null Island, ~8,000 km off West Africa. `_rejectOutliers()`
should still discard it at render time, so the map itself likely looks fine, but
the stored data is genuinely polluted and it will keep happening on any no-fix
reading from un-updated firmware.

**Please delete the `0,0` key from the `yard_coverage` KV value** (and ideally the
~90 parked-drift cells alongside it — see above). There is no API path to do this
from here: the endpoint deliberately has no destructive command, which is the right
call, so it needs the Cloudflare KV dashboard or a one-off admin action on your side.

Firmware now sends a real JSON boolean and omits `lat`/`lon` entirely when there is
no fix, so it cannot create another one.

---

## BUG 4 — The device secret is published to the internet

`GET https://toro1-5rz.pages.dev/api/hours` returns, unauthenticated:

```json
{"secret":"<the real DEVICE_SECRET, in plaintext>", ...}
```

(Deliberately not reproduced here — **this repo is public**, which is the whole
point. The value is in the firmware's `CONFIG` block on Jeff's PC.)

The GET echoes the whole stored body, and `logEntryFrom()` now copies the raw
payload, so it is also stored in all 239 `?log=1` rows.

Note `hours.js` **never validates** this secret — the POST endpoint is wide open,
so the string currently buys nothing while leaking. (The firmware comment claiming
a mismatch returns 401 is stale.)

Not urgent — it grants no access today. But please strip `secret` from the GET
response and from `logEntryFrom()`. If you want it to actually mean something,
validate it on POST. It is **not** in the public repo — I checked.

---

## TASK 4 — real field shapes, answered

Captured from the live endpoint, not inferred:

- **`track[]` is `[[lat,lon], ...]`** (array-of-arrays). You can drop the
  `{lat,lon}` object branch.
- **`has_fix` was `1`/`0`, not a boolean.** Now a real `true`/`false`.
- **`rpm_peak` / `rpm_avg` are per-mow**, reset after a successful upload.
- **`dist_session_m` is per-mow**; `dist_total_m` is lifetime, persisted to flash.
- Every field the box sends today:
  `secret, source, engine_running, mow_ended, age_s, hours, hours_seconds,
  battery, rpm_peak, rpm_avg, has_fix, lat, lon, dist_session_m, dist_total_m,
  mpu_ok, gps_rx, vibration, wifi_rssi, batt_raw, pitch, roll, shock_events,
  esp_temp_f, track`.

New fields you may want to surface: **`age_s`** (buffered replay) and
**`mow_ended`**.

---

## TASK 1 & 2 — done in firmware, compiled, awaiting flash

- **TASK 1:** track logging moved out of the `if(running)` branch — it now records
  on any GPS fix, gated on ≥ 3 m movement (`TRACK_MIN_STEP_M`). `lat`/`lon` were
  already in every payload, so nothing further is needed server-side.
- **TASK 2:** store-and-forward ring buffer (`SF_MAX 20`) in RTC memory, surviving
  deep sleep. Failed POSTs are held and flushed **oldest-first** on reconnect, each
  carrying its own `age_s`. Stored as a 64-byte packed struct rather than the
  ~450-byte JSON so a useful backlog fits in RTC RAM beside the 1.2 KB track buffer.

### ✅ FLASHED AND VERIFIED LIVE — 2026-08-11

Jeff pulled the box off the mower and it was flashed on his PC (COM3, CP210x,
`esp32:esp32:esp32`, core 3.3.10, hash verified). Confirmed from real serial output
and the real endpoint, not assumed:

```
vib=0.0000 running=0 Fs=1002 rpm=-- life=19890s
GPS: nmea_lines=0 fix=0 lat=0.000000 lon=0.000000
WiFi: connected OK
POST 200  resp={"ok":true}
uploaded / sleeping 300s
```

- **`life=19890s` survived the reflash** — engine hours live in NVS, not RTC, and no
  erase-all was used. Re-flashing this firmware does **not** cost Jeff his hours.
- The reading that reached the server:
  `"source":"heartbeat", "engine_running":false, "hours":5.525, "has_fix":false`,
  **with no `lat`/`lon` keys at all.** All four fixes confirmed working end to end.
- **`hours` is now populated for the first time — 5.525.** The app's hour meter has a
  real value to read.

⚠️ **One consequence for you:** now that `source:"heartbeat"` actually arrives,
`isHeartbeat` is finally true, so the merge branch runs — which is why the current
`hours_data` still shows `lat: 0, lon: 0` carried over from the last pre-update
posts. It will self-correct on the first real GPS fix. Nothing to fix in firmware.

**Still untested in the field:** GPS track logging, the 3 m movement gate, mow-end
detection, and the store-and-forward flush — all need a real mow. The GPS and MPU
were physically unplugged during bench testing (hence `battery 0`, `mpu_ok 0`,
`nmea_lines=0`), so those readings are expected, not faults.

---

## TASK 3 — closed, agreed

Confirmed closed by Jeff's own screenshot on 08-10. Nothing further.

---

## Also verified for you (all good)

- `lint-app.js` and `smoke-test.js` both re-run on this PC against the pulled
  branch: **clean** — 374 external links, 0 bad, 0 page errors.
- Deployed `service-worker.js` is **hcc-v74**, matching the repo. The 08-11
  contrast work is genuinely live.
- **Pending Item 20 / the Garden zone entity ID — answered.** The real B-Hyve
  entities in HA are `switch.z1_front_right`, `switch.z2_front_left`,
  `switch.z3_back_left`, `switch.z4_back_right`, `switch.z5_right_side_drive`,
  and **`switch.garden`**. Your 08-08 fix at `index.html:5470` maps all six
  correctly (garden → 6 by name; z1–z5 → 1–5 by digit-parse), and the filter
  catches them via `at.zone_name != null`. **Verified, no change needed.**
  For future robustness: these entities already expose a **`station`** attribute
  (`switch.garden` → `station: 6`), which is the authoritative value and removes
  the digit-parsing guesswork entirely.
