# Gate history - moved out of SESSION_START.md 2026-11-02

**Gate extended 2026-10-20 9:2x PM: `weather-sentinel-gate-test.js` 6 → 18 checks.** **`HTTP 200` is not `the station is reporting`** — a fallback that only ran on a thrown fetch never fired, because the dead station answers 200 with an all-sentinel body. Same class as the `ALL GOOD` stream check. 🔑 **Count what the app RENDERS, not what is in the DOM** (105 "errors" were really 22; the rest were `display:none` cards). Full write-up: `docs/incidents/weather_array_dark_http200_2026-10-20.md`.
**New gate 2026-10-20: `audit-grouping-gate-test.js`** — the spoken house status said "9 errors", then "10". It was not nine problems: ONE offline Kidde read as THREE findings (grouped by the first word of the entity id: `smoke`/`kidde`/`hallway`), 7 never-pressed `button.*` entities counted as faults (a button's state IS its last-pressed timestamp), and a `SELF_HEALING` key that **never matched the real logger name** (`kasa` vs `homeassistant.components.tplink.coordinator`) so a measured 50/day allowance was dead code. **That third one is the dangerous class — a rule that looks present and documented while doing nothing.** Count 10 → 4. Proven RED on a fixture with all three bugs restored (6 of 13 checks fail). Point it at a fixture with `HCC_AUDIT=<path>`.
**New gate 2026-10-19: `weather-console-gate-test.js`** — the console and the outdoor array are two different radios; one dying must not blank the other. Two traps: **a sensor with a `device_class` + unit needs a NUMERIC state** (use `availability`, not `'unknown'`), and **`ws` is NOT installed here**. Why: the gate's header, OPEN_ITEMS #241.
**New gate 2026-10-15: `mower-hours-watchdog-gate-test.js`** — gates `Watch-MowerHours.ps1`, which shipped with a staleness branch reading `$d.date`, **a field that does not exist**, so it reported green forever (the `ALL GOOD` failure again). Fixture via `HCC_MOWER_WATCHDOG=<path>`, force stale with `HCC_MOWER_STALE_HOURS=0`. ⚠️ **Its own first draft had both rule-3b failure modes** — a gate written in a hurry needs the same adversarial pass as the code it gates. Detail: OPEN_ITEMS #237.

**New gate this session: `crash-watchdog-gate-test.js`** — asserts the crash watchdog can actually SEE a crash. It exists because on 10-14 a real `0xEF` bugcheck went unreported: the watchdog had its dump directory pinned to `C:\Windows\Minidump` while the dump destination had been moved to `D:\Minidump` on 10-06, so it logged *"no new crash"* and texted Jeff nothing (OPEN_ITEMS #238). **Proven RED against a fixture of the original bug — all 4 checks fail, including the one naming `d:\minidump` as uncovered — and green against the fixed script.** Point it at a fixture with `HCC_CRASH_WATCHDOG=<path>`; never edit the live watchdog to test it.
Live app proven end to end 06:3x: 6 sections open, 0 page errors, no credential in any URL.
⚠️ **This line read *"20/20, exit 0, 2026-09-16"* for 24 days** while the suite grew to 26 gates
and `package-gate-test.js` sat RED for a week (OPEN_ITEMS #220 caught it). **Re-stamp it with the
real number the same session you run the suite** — a stale green is how the 09-15 boot crash
walked through.

Nearly every gate exists because of one specific failure, named in that file's header. Two worth
knowing before you trust a green result:
- `smoke-test.js` ran **logged out** for its whole life, so every token-gated path — most of the
  house — was untested. That is exactly how the boot crash walked through it.
- `weather-tiles-test.js` asserted on a Blitzortung tier it had **locked itself out of** by never
  seeding a token, and had been failing 2 cases against a perfectly correct app.

**Both are fixed. The lesson is the same one: a test that cannot reach the code it names is worse
than no test, because it reports green.**

