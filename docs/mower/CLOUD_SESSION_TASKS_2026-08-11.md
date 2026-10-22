# Cloud Session — Task Brief (from the coworker, 2026-08-11)

The mower's ESP32 firmware was **rewritten and flashed today** on Jeff's PC. It now
sends fields it never sent before, which fixes some things and **changes assumptions
your server code was built on**. Everything below is server/app-side — your files.

Background evidence (why each of these is real, with live data) is in
`docs/mower/gps_firmware_coworker_findings_2026-08-11.md`. Read that if you want the
proof; this file is just the work.

---

## The new firmware contract — what the box sends now

| field | value | notes |
|---|---|---|
| `hours` | decimal hours, e.g. `5.525` | **NEW.** Was only ever `hours_seconds`. |
| `hours_seconds` | integer seconds | still sent |
| `source` | `mow_end` \| `heartbeat` \| `buffered` | **NEW.** Was never sent. |
| `engine_running` | real boolean | **NEW.** Was never sent. |
| `mow_ended` | `true`, only on the post right after a mow | **NEW.** |
| `age_s` | seconds since capture, only on `buffered` replays | **NEW.** |
| `has_fix` | real boolean | was `1`/`0` |
| `lat`/`lon` | **omitted entirely** when there's no fix | were always sent, as `0,0` when no fix |
| `track` | `[[lat,lon],...]` | array-of-arrays confirmed; drop the `{lat,lon}` branch |

**Critical behaviour you must know:** the box **only uploads while PARKED**, every
300 s. It does **not** post during a mow (WiFi is off then). So "a heartbeat followed
a live reading" is a state that can never occur — which is why several things below
never fired.

Also: per-mow stats (`rpm_peak`, `rpm_avg`, `dist_session_m`) are **no longer zeroed
after upload**. They're held until the *next mow starts*, so a parked box keeps
reporting the last real mow's numbers. This was Jeff's explicit request — he wants
the sensors reading live and showing their last values while it sits in the garage,
not blanking to "—".

---

## 1. Mow history has NEVER recorded a single mow — fix the trigger 🚨

`functions/api/hours.js` ~line 326:

```js
const wasLive = prev && prev.source !== 'heartbeat' && prev.engine_running !== false
                && typeof prev.hours === 'number';
if (isHeartbeat && wasLive && kv) { ...push snapshot... }
```

This can never be true (see above), so `hours_history` is `[]` on the live endpoint
today despite 6.3 km of real mowing. The "Mow Sensor History" card can never populate.

**Do this instead:** trigger on `body.mow_ended === true` (or `source === 'mow_end'`).

**Important — snapshot from `body`, NOT `prev`.** With the new firmware the mow_end
post *itself* carries that mow's `rpm_peak`, `rpm_avg`, `dist_session_m` and `track`.
The old code read `prev` because it assumed live-posting during the mow. That's wrong now.

Drop the `typeof prev.hours === 'number'` precondition.

**Acceptance:** after Jeff's next mow, `GET /api/hours` returns a `history` array with
one entry carrying non-zero `rpm_peak` and `dist_session_m`.

---

## 2. Don't let a heartbeat wipe the last mow's track

`isHeartbeat` is now genuinely true on nearly every post, so `merged = {...prev, ...body}`
actually runs for the first time. Good — except the box sends `track: []` once a track
has been delivered, and an empty array **overwrites** `prev.track`.

Result: the last mow's track disappears from `hours_data` ~5 minutes after the mow. The
app survives it (it caches `S.sensorTrack` locally), but a fresh device — the wall iPad —
would show no track at all.

**Fix:** in the merge, don't let an empty/absent `track` clobber a non-empty `prev.track`.

(The same merge is what makes `lat`/`lon` persist when there's no fix. That behaviour is
**desirable** — keep it. It's what lets the location row show the last known position
while the mower sits in a garage where GPS can't lock.)

---

## 3. Coverage is recording parked GPS drift as mowed yard

`gpsPointsFrom()` merges a bare `lat`/`lon` from **every** post. The box posts every
5 minutes while parked, so the parking spot gets a drift sample ~288×/day.

Live right now: **90 cells spanning only 16.7 m × 12.5 m** — the entire "yard coverage
map" is a blob at the parking spot. The 08-10 visit-count shading makes it worse: parked
cells reach 15 visits and render as the *most confident* ground on the map, while real
grass sits at 1–3 visits and renders faint.

**Fix:** skip the standalone `lat`/`lon` branch when the reading says the engine is off
(`engine_running === false` / `source === 'heartbeat'`). Always still merge `track[]`.

Firmware already helps here: track points are now gated on ≥3 m of real movement, so
drift isn't logged as travel.

---

## 4. `has_fix !== false` — this bug has actually FIRED, and left a bad cell

`gpsPointsFrom()` tests `body.has_fix !== false`. Old firmware sent `0` for no-fix, and
`0 !== false` is **true**, so no-fix `0,0` coordinates were merged as a real cell.

Caught live today with the GPS unplugged. `?coverage=1` currently contains:

```
"0,0": 6
```

A six-visit cell at Null Island, ~8,000 km away. `_rejectOutliers()` probably hides it at
render time, but the stored data is polluted.

**Fix:** make the check truthiness-based so `0` counts as no-fix. New firmware sends a
real boolean and omits lat/lon entirely, so it can't create another one.

---

## 5. Clean the poisoned KV data (needs your side — no API path exists)

Please delete from the `yard_coverage` KV value:
- the **`0,0`** key
- ideally the ~90 parked-drift cells too, so the map starts clean from the next real mow

The endpoint deliberately has no destructive command (correct call — it's
unauthenticated), so this needs the Cloudflare KV dashboard.

---

## 6. KV read-modify-write race is silently DROPPING readings 🚨 (found by live test)

**This one is new — discovered 2026-08-11 while bench-testing the buffer flush.**

`onRequestPost` appends to `sensor_log`, `yard_coverage` and `hours_history` with a
read-modify-write:

```js
const log = JSON.parse(await kv.get(SENSOR_LOG_KEY) || '[]');
log.push(logEntryFrom(body));
await kv.put(SENSOR_LOG_KEY, JSON.stringify(log.slice(-SENSOR_LOG_MAX)));
```

Cloudflare KV is eventually consistent, so POSTs arriving close together read the same
prior state and **clobber each other**.

**Measured, not theorised.** A flush sent 4 POSTs ~1.3 s apart. The serial log shows all
four returned **HTTP 200**:

```
flushing buffered reading (90s old, 3 left)  -> POST 200
flushing buffered reading (60s old, 2 left)  -> POST 200
flushing buffered reading (30s old, 1 left)  -> POST 200
POST 200   (current reading)
```

But `?log=1` afterwards contains only **two** `source:"buffered"` entries — `age_s` 90
and 60. **The 30 s one was accepted and silently lost.**

**Why it matters beyond the log:** `yard_coverage` uses the same pattern, so a real
weak-WiFi flush will silently drop GPS points out of the yard map — the exact data the
buffering was built to protect.

**Firmware mitigation already shipped:** a 2 s `FLUSH_GAP_MS` between flushed readings.
That narrows the window; **it does not close it**, and I'd rather you didn't treat it as
a fix.

**Real fix — your call which:**
- **Batch:** accept an array of readings in one POST (e.g. `{readings:[...]}`) so a flush
  is a single KV write. Cleanest; I'll update the firmware to match whatever shape you
  choose — just tell me the field name.
- **Serialise:** move these accumulators behind a Durable Object.
- At minimum, apply it to `yard_coverage` even if the log is considered expendable.

---

## 7. Stop publishing the device secret

`GET /api/hours` returns the whole stored body unauthenticated, which includes
`"secret": "..."`. `logEntryFrom()` also copies it into all 5,000 log rows.

`hours.js` never validates it, so it grants nothing today — but strip `secret` from the
GET response and from `logEntryFrom()`. If you want it to mean something, validate it on
POST. It is **not** in the repo — I checked.

---

## 8. App-side: surface the new fields

- **`hours` now works** — the hour meter finally has a real value. See the warning below.
- **`age_s`** — buffered readings are replayed after a WiFi failure. Worth showing in the
  Full Sensor Log so a replayed reading isn't mistaken for a live one.
- **`mow_ended`** — could mark mow boundaries in the log.

### ⚠️ Existing-user hour-meter jump (Jeff hits this the moment he opens the app)

`saveHours()` sets `hoursBaseline = trueHours − lastSensorHours`. Jeff last set 12.1 while
`d.hours` was `undefined`, so `lastSensorHours` was `0` and the baseline was stored as
**12.1**. Now that the sensor really reports 5.525, the app computes
`12.1 + 5.525 = 17.6` and, since that's higher, silently advances his hour meter.

He's been told to re-run SET HOURS → 12.1 once, which recalculates the baseline to 6.575
and makes it correct and self-maintaining from then on. **No code change is strictly
required** — but if you want to spare other devices the same jump, a one-time migration
could detect "baseline was set when lastSensorHours was 0" and re-derive it. Your call;
don't do it speculatively if it risks corrupting a good baseline.

---

## 9. `CLAUDE.md` — the ESP32 section is factually wrong

It currently claims:

> - Every 90s when `engine_on` (RPM > 200): full sensor payload
> - Every 5 min when engine OFF: heartbeat (`engine_running: false`, battery, WiFi, temp, `source: "heartbeat"`)

Neither is true, and the server design above was built on that description. Reality:
**no upload at all while running; a full payload every 300 s while parked.** Please
correct it and record the new field contract from the top of this file.

Also worth recording: **the firmware is not in this repo.** It lives at
`Documents\Arduino\mower_hours_esp32\` on Jeff's PC (a second, now-stale copy is in his
OneDrive). Engine hours live in the ESP32's NVS flash and **survive a reflash**.

---

## 10. Housekeeping from the coworker

- **All six `images/zones/zone-N.jpg` were replaced** — the fake gold frames, "ZONE N"
  badges, titles and taglines are gone. They were **cropped, not regenerated**, so none
  of Jeff's real yard was altered (per the protected photo rule). All six are now square
  800×800, which also fixes a real bug: `.zone-photo` is a square thumbnail with
  `object-fit:cover`, so the old landscape sources kept their full height and always
  showed the title band, while the two portrait ones had theirs cropped off. Verified at
  390/768/1024/1180/1194/1366/1920/2560 — correct size at every breakpoint, zero overflow,
  zero page errors. Bonus: 3.3 MB → 976 KB.
- **The service worker was NOT bumped** (still `hcc-v74`). Images are
  stale-while-revalidate so the new photos land on the second load. Please bump to v75
  next time you touch it so they land immediately.
- `lint-app.js` and `smoke-test.js` were both re-run on the pulled branch: clean,
  374 links, 0 bad, 0 page errors.
- **Pending Item 20 / the Garden zone entity — answered, no change needed.** Real HA
  entities are `switch.z1_front_right`, `z2_front_left`, `z3_back_left`, `z4_back_right`,
  `z5_right_side_drive`, and `switch.garden`. Your 08-08 fix maps all six correctly. For
  future robustness they expose a **`station`** attribute (`switch.garden` → `station: 6`)
  which beats digit-parsing the entity_id.

---

## Verification status

**Proven on the bench (real hardware, real network, not mocked):**
- `hours` / `hours_seconds` / `source` / `engine_running` / `has_fix` all arrive correctly
- `lat`/`lon` correctly omitted when there's no fix
- Engine hours survive a reflash (four flashes, `life=19890s` every time)
- **TASK 2 store-and-forward — fully proven.** Three readings survived three *real* WiFi
  timeouts and three deep-sleep cycles, then flushed **oldest-first** with correct ages
  (90 s / 60 s / 30 s, exactly matching the wake interval), and normal operation resumed
  with no duplicates. This test also surfaced the KV race in item 6.

**Still unproven until Jeff actually mows:** GPS track logging, the 3 m drift gate, and
mow-end detection — all need engine vibration and a satellite fix, neither available on
a bench. The GPS and MPU were physically unplugged during testing, so `battery 0` /
`mpu_ok 0` / `nmea_lines 0` in current readings are **expected, not faults**.

A `SF_BENCH_TEST` compile-time hook is left in the firmware (set to `0`) — flip it to `1`
to re-run the buffer test on demand.
