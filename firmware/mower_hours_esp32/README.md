# Mower sensor firmware (ESP32)

**This is the canonical copy.** It lives in the repo deliberately.

## Why it's here

For months the hour meter didn't work. The box sent `hours_seconds`, the app read
`d.hours`, and nothing converted between them — 5.5 hours of real runtime and
6.3 km of real mowing went unrecorded across five mows. Jeff was told the sensors
were faulty and bought replacement hardware to fix what was a field-name mismatch.

The reason it went unnoticed so long is structural, not carelessness: the cloud
session that owned the server code has **no outbound network** and **could not see
this file**. It was writing `functions/api/hours.js` against `CLAUDE.md`'s prose
*description* of the firmware, and that description was wrong. Nobody could diff
the two halves of the contract because only one half was in the repo.

Now both halves are here.

## Credentials — read before touching anything

**This repo is public.** WiFi SSID, WiFi password and the device secret live in
`secrets.h`, which is gitignored. Copy `secrets.example.h` to `secrets.h` and fill
it in.

**Splitting the source does NOT make the binary safe.** Those strings are compiled
into the `.bin` as plaintext. Verified on 2026-08-11 by grepping a real build for
each value from `secrets.h` — the SSID, the WiFi password and the device secret
were all present, in the clear, in the compiled image.

Reproduce it yourself before trusting any hosting decision (and note `strings` is
not installed on Jeff's PC — `grep -a` on the binary is the check that actually
works; using `strings` returns a silent false "clean"):

```
grep -qaF "$(sed -n 's/.*HCC_WIFI_PASS *"\(.*\)"/\1/p' secrets.h)" build/*.bin && echo LEAKS
```

So a firmware image **must never be served from a public URL**, including this
project's own Pages site. OTA delivery has to be authenticated. That is a hosting
problem, separate from source layout, and it is why OTA is written but not yet
enabled.

## Building and flashing

```
arduino-cli compile --fqbn esp32:esp32:esp32 .
arduino-cli upload -p COM<n> --fqbn esp32:esp32:esp32 .
```

`arduino-cli` on Jeff's PC:
`%LOCALAPPDATA%\Programs\arduino-ide\resources\app\lib\backend\resources\arduino-cli.exe`

**Auto-reset does not work on this board.** Jeff must hold the BOOT button down
through the *entire* upload or it fails with `Wrong boot mode detected (0x13)`.
Kill the Arduino IDE's `serial-monitor` helper process first if it holds the port
— just that process, not the IDE, which may have unsaved work.

**Engine hours survive a reflash** (NVS via `Preferences`) as long as nothing does
an erase-all. Verified across five flashes. They do NOT survive swapping to a
different physical board — see "Board swap" below.

## What the box actually does

- **Running: posts nothing.** Samples every `SAMPLE_INTERVAL_S` with WiFi off.
  "A heartbeat followed a live reading" is a state that cannot occur — the server
  was once built on the assumption it could, and mow history silently never
  recorded a single mow because of it.
- **Parked: full payload every `IDLE_INTERVAL_S`.**
- The first parked post after a mow carries that mow's totals, flagged
  `source:"mow_end"` + `mow_ended:true`. Later ones are `heartbeat`.
- Failed posts buffer in RTC memory and replay later as `source:"buffered"`.

## Two-way control channel (1.4.0+)

`postJson()` keeps the POST response, so every upload is an exchange. The reply
carries desired config and at most one command, acked by id so a box that dies
mid-command retries and never applies one twice.

Commands: `zero_tilt`, `clear_track`, `flush_buffer`, `reboot`, `ota`.
Config: `vib_threshold`, `idle_interval_s`, `sample_interval_s`,
`track_min_step_m`, `gps_step_max_m`, `flush_every_s`, `service_mode` — all
clamped server-side in `functions/api/hours.js`.

Issuing anything requires the family password or the maintenance token. The box's
own uploads stay unauthenticated because it has nowhere safe to keep a secret.

**The box sleeps between uploads and cannot be woken**, so a command lands on its
next post — up to 5 minutes while parked. That is the hardware, not a bug.

## Tilt

Raw pitch/roll describe the *enclosure*, which is bolted in at an angle — a level
mower read −12.4° / 28.5° and the app's tip-risk warning read CRITICAL in a garage.
`zero_tilt` captures the gravity vector once while level; everything after is
measured relative to it, which is exact at any attitude rather than a fixed offset
that cross-couples on real slopes.

Honest limit: one captured vector fixes which way is *down*, not which way is
*forward*. Total tilt is exact; the fore/aft vs side-to-side split is relative to
how the box sits in its mount.

## Board swap

Config restores itself — a fresh board reports `cfg_rev: 0`, the server sees it's
behind and pushes everything on the first upload.

**Engine hours, lifetime distance and the tilt reference do not.** They live only
in that chip's flash. After a swap: re-run SET HOURS from the physical meter (or
the hour meter appears frozen for hours of real mowing, since the app only ever
lets it move forward), and send `zero_tilt`.

## Before changing anything here

`node scripts/mower-hours-test.mjs` covers the server half. The invariants that
must not regress are listed in `docs/mower/`. This subsystem is the local
coworker session's, end to end — see `CLAUDE.md` Rule 13.
