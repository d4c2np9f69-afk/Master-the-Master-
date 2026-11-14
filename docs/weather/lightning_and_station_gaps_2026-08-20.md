# Lightning, and everything KTNWHITE21 cannot measure

**2026-08-20.** Written because the app's Lightning card read **NONE** at 05:59 while
thunder and lightning were over the house. Jeff: *"this has got to be tied to a reliable
source… search the web for the best source data for lightning and all of the weather that
my weather station does not account for."*

Every source below was **tested live from this machine**, not read about. Prices verified
this session, cheapest first, $0 option always stated.

---

## The station

`KTNWHITE21`, **Ambient Weather** (`softwareType: AMBWeatherV3.0.0`), at 36.4767 / −86.6600.

**Measures:** temp · dewpoint · heat index · humidity · pressure · wind speed/direction/gust ·
rain rate · rain total · solar radiation · UV.

**Cannot measure:** lightning · soil · air quality · pollen · hail · cloud/ceiling ·
visibility.

⚠️ **It is not in Home Assistant at all.** Of Beehive's 36 integrations, none is Ambient.
The station's data reaches the app only through Weather Underground's public API — which is
also why the WU key exposure (open item #1) matters more than it looks.

---

## 1. Lightning — SOLVED, $0

### What was wrong
The card never held lightning data. It read Open-Meteo's hourly `weathercode` and showed
RISK only if 95/96/99 appeared **in the forecast**. At 05:59 the model had 53/63/61 —
drizzle, rain, light rain — so it computed NONE and was "correct" by its own design.
**A model was being rendered as an observation.** NWS had a Severe Thunderstorm Watch out
since 00:08 and the card ignored it.

### Now, in priority order

| Tier | Source | Resolution | Cost | Status |
|---|---|---|---|---|
| 1 | **Blitzortung.org** via Beehive | Individual strikes geolocated — **distance + azimuth from the house**, few seconds' delay | **$0** | ✅ installed |
| 2 | **NOAA/FAA METAR** (`aviationweather.gov`) | Area-level; nearest field reporting TS is 25 mi | **$0**, no key | ✅ `/api/lightning` |
| 3 | Open-Meteo forecast | Model only — now labelled `FCST:` | $0 | fallback only |

**Tier 1 proven live during the 08-20 storm:** `sensor.home_lightning_distance` 50.08 mi,
`azimuth` 266°, `counter` 48, plus per-strike entities with real lat/lon. That is the
empirical coverage test — the network sees strikes here.

⚠️ **`sensor.home_lightning_distance` holds its last value forever** — it only changes when
a new strike lands. Read naively, a week-old strike looks live. The app gates on
`last_changed` with a 45-minute cutoff.

⚠️ **Recorder:** this integration emits a `geo_location` entity **per strike** and its own
docs warn it floods the database. Mitigated by tuning (`time_window` 120→60,
`max_tracked_lightnings` 100→50). **The proper fix is still owed** — exclude the
`geo_location` domain in `configuration.yaml`'s recorder block. Four lines; the write was
refused by the permission classifier and needs Jeff's go.

### The hardware option, if ever wanted
**Ambient Weather WH31L Lightning Detector — $73.99** (verified July 2026 pricing),
25-mile range, 79-second refresh, needs a WS-2000 / WS-4000 / WS-5000 / WS-1965 /
WS-1551-IP / WS-5050 console. **Not recommended right now:** Blitzortung already gives
finer distance for $0, and Jeff's console model is unconfirmed.

---

## 2. Soil — free, and the app is currently guessing

The app derives "soil firmness" from **air** temperature. Real soil data is free and keyless
from Open-Meteo. Tested live 2026-08-20 06:00:

```
soil_temperature_0cm      70.7 °F      soil_moisture_0_to_1cm   0.314 m³/m³
soil_temperature_6cm      72.8 °F      soil_moisture_3_to_9cm   0.173 m³/m³
```

**Highest-value remaining upgrade** — it feeds mow readiness *and* irrigation, the two
things this app exists for. **$0.**

## 3. Air quality — free, working

`us_aqi 33 · pm2_5 4.9 · pm10 5.1 · ozone 52` (Open-Meteo Air Quality API, no key).
Worth a card: mowing throws particulates, and wildfire smoke days are real.

## 4. Rain in the next 90 minutes — free, working

Open-Meteo `minutely_15`. Tested: `06:15 0.051" (81%) → 06:30 0.0" (73%) → 07:00 0.004" (57%)`.
Directly answers "can I mow right now," which hourly data cannot.

## 5. Hail — already covered, $0

`/api/lightning` parses `GR`/`GS` from METAR present weather and returns a `hail` flag.
Not surfaced in the UI yet. This is the one that costs money — vehicles.

## 6. Pollen — the one real gap, no clean $0 answer

- **Open-Meteo pollen is Europe-only.** Tested for White House: returns `None`. Confirmed, not assumed.
- **Google Pollen API** — requires billing enabled; the $200/mo Maps credit **expired**.
- **Ambee** — 30 days free, then paid.

**Recommendation: skip it.** No free US source worth wiring, and it is comfort data, not
safety data.

---

## Recommended order

1. **Recorder exclusion** for `geo_location` — protects the DB from what was just installed. *(needs Jeff's go)*
2. **Soil temp + moisture** — replaces a guess with a measurement, $0.
3. **Rain-next-90-min** — $0, answers the actual mowing question.
4. **Air quality** — $0.
5. **Surface the hail flag** — already computed, just not shown.
6. ~~Pollen~~ — skip.
7. ~~WH31L~~ — skip; $73.99 buys worse resolution than the free option already running.

**Also worth doing on its own merits:** add the Ambient Weather integration to Beehive so the
station's data arrives directly instead of via WU's public API.
