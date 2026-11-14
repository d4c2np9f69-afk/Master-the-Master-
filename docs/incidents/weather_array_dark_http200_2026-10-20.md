# The WEATHER tab went blank behind an HTTP 200 — 2026-10-20 9:2x PM

**Jeff, 9:10 PM:** *"Everything is not 100% error free and working. I can see numerous errors
in the app."* He was right, and the earlier sweep that night had not found it because it was
run against the audit and the API, not against **the app, tab by tab, counting only what is
actually rendered.**

## What he was seeing

Measured by walking every tab in the live app and collecting only leaf elements with a real
box (`offsetParent !== null`, non-zero rect):

| Tab | Visible blank / error cells |
|---|---|
| ⛅ WEATHER | **15** (`wxTemp`, `wxHumidity`, `wxDew`, `wxWindSpd`, `wxWindDir`, `wxUV`, `wxHeroGust`, rain cells, solar) |
| 🚗 CAR (on all 7 vehicle sub-tabs) | **5** (`carOil`, `carInteriorTemp`, `carExteriorTemp`, `carAC`, `carRearClimate`) |
| 🛡️ GUARDIAN | **2** (detector banner, vacuum banner) |
| 🏠 HOME · IRRIGATION · YARD | 0 |

⚠️ **A first pass counted 105 and that number was wrong.** It included elements inside cards
that are deliberately `display:none` — the mailbox card hides itself when
`binary_sensor.mailbox_contact` is absent (#196, Jeff deleted that sensor 2026-09-24), and the
LUX card is never drawn because `LUX_RETIRED = true` routes every caller to the A/C relay card.
**Scan for what is rendered, or you will report hidden markup as a fault.**

## Root cause — `HTTP 200` is not "the station is reporting"

Earlier the same day, `/api/weather` was fixed to stop passing the station's `-32768` sentinel
through as real data. That fix was correct and it was **half the bug.**

`functions/api/weather.js` has carried an Open-Meteo fallback for months. It lived in the
`catch` block, so it only ran when the Weather Underground fetch **threw**. With the outdoor
array dark, WU does not fail — it answers **HTTP 200** with a complete-looking observation whose
every outdoor field is the sentinel. The sentinel guard dutifully turned each one into `null`,
and the function returned a perfectly successful `200` carrying:

```
temp:null  dewpt:null  humidity:null  windSpeed:null  windGust:null
winddir:null  windDirCard:null  uv:null  solarRadiation:null
pressure:29.94   <- the INDOOR console's barometer, still healthy
```

So the fallback never fired, and the tab went blank with a free, key-less data source one call
away. This is the same failure class as the 2026-08-21 stream check that printed `ALL GOOD`
eleven minutes after the popups died, and the crash watchdog that logged *"no new crash"* while
pointed at the wrong directory: **a healthy-looking success code over an absent measurement.**

## The fix

- Falls through when `temp`, `humidity`, `windSpeed` and `dewpt` are **all** null.
- **`pressure` is deliberately excluded from that test.** The indoor console carries the
  barometer and reported a healthy 29.94 all day with the array dead — including it would mask
  exactly the failure being caught.
- Keeps the console's own pressure and Jeff's 7-day rain gauge; labels the source
  `"KTNWHITE21 array dark - Open-Meteo"` and sets `stationDark: true`.
- `openMeteo()` throws on a body with no finite temperature. Without that,
  `Math.round(undefined)` is `NaN`, `JSON.stringify` turns `NaN` into `null`, and **a broken
  fallback would be indistinguishable from the dead station it is supposed to rescue.**
- Both the array-dark path and the WU-unreachable path now call the same helper, so they can
  never drift apart again.

## Three hero cells had no writer at all

Found only after the fallback went live and gust + direction filled while **speed stayed `--`
between them**. `wxWindSpd`, `wxHeroHeat` and `wxRainRate` were set *only* in `stRender()`,
which runs exclusively when the console's own outdoor feed is live — so whenever the station
was dark they were blank for no reason, with the values sitting unused in the payload. Added
to the `/api/weather` path and to `STATION_CELLS`, so the real console still wins when it is
back. `solarRadiation` now comes from Open-Meteo's `shortwave_radiation` (same unit, W/m²).

## Still `--` on purpose, until the batteries go in

`wxRainMonth`, `wxRainLife`, `wxLastRain`, `wxLux` — cumulative totals from **Jeff's own rain
gauge and light sensor**. No model can substitute for "how much rain has this gauge measured
this month". The card's banner says `OUTDOOR ARRAY NOT REPORTING`, and they refill by
themselves the moment the array transmits again.

## The gate

`weather-sentinel-gate-test.js`, **6 → 18 checks**, proven RED (8 failures) against the pre-fix
file before being believed.

🔑 **The gate's own first version would have passed the broken fallback.** It mocked one
`fetch` for every URL, so the new Open-Meteo call silently re-read the WU body. It now routes
by URL, gives each upstream its own payload, and **throws on an unexpected URL**. Three paths
are covered: array dark with the fallback reachable, array dark with it unreachable (honest
nulls, never a sentinel, never an invented direction), and a healthy station passing through
untouched and **not** flagged dark.

## Related

- `docs/OPEN_ITEMS.md` #244 — the physical half: lithium AAs + clean the solar panel.
- The identical measurement rule: `reference_change_driven_sensor_not_a_heartbeat` in memory.
