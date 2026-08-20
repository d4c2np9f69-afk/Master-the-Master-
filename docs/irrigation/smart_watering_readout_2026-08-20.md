# Smart Watering readout — Jeff's spec, 2026-08-20

**This is a DECISION RECORD. Written the same session it was decided, per the standing rule.**
Endpoint: `functions/api/watering.js` · tests: `scripts/watering-test.mjs` · card: `#irrSmartCard`.

---

## What Jeff asked for, verbatim (2026-08-20, ~9:33 AM CT)

> "my grass requires between 1 inch and 1.5 inches of water per week so what we wanted to do
> was similar to the smart watering — we wanted to show the numbers in the app. In other words
> if we got like today 1.7 inches it would show that as zero watering needed. If we only got a
> half an inch then we would need to take that half inch and tell each zone how long it needs
> to run. **Not that it would actually run the sprinkler**, but I could look on there and say
> OK I need to put down half inch of water, I need to run each zone X amount of time."

And earlier, 2026-08-20 ~8:1x AM:

> "now that we have the irrigation data you could put in how long I need to run each zone to
> hit the 1 to 1.5 number like smart watering right in the app... Comparing the rain we got to
> the irrigation time needed to hit the target number."

## SETTLED — do not re-open these

1. **The target is 1.0–1.5 in/week. It is Jeff's number for his grass, not a derived one.**
2. **It is a READOUT. It does not water anything.** B-Hyve keeps the schedule. The app exists to
   tell Jeff the number so *he* can decide.
3. **We are deliberately NOT re-implementing B-Hyve's full Smart Watering model.** Jeff was shown
   Orbit's own factor list (vegetation type, soil type, slope, sun exposure, head type, head
   count, flow, rain history, evaporation tables) and said: **"not all of it."**
   That is the correct call — every one of those needs a per-zone value nobody here has measured,
   and a guessed input makes the answer *worse*. B-Hyve already runs that model with the values
   Jeff entered into its app.
   *(B-Hyve's real algorithm is researched and sourced: `MASTER-RECORD/HCC_MASTER_RECORD.md`,
   2026-08-05 — ETo × KL, soil field capacity/MAD bucket, slope, sun, cycle-and-soak.)*
4. **ET does not replace the band, it picks the point inside it.** ET0 × Kc says what the turf
   actually lost this week; the result is clamped to [1.0, 1.5]. Hot week → 1.5. Mild week → 1.0.

## Jeff's second catch, same morning — and it was a real bug

> "the rolling number is good but we could look at it as the amount needed in the next 7 days
> to catch up? Along with the rolling number — because sometimes the rain comes all at once
> like today, and then if I get used to that I would be putting down too much. Is the numbers
> catch wrong due to timing?"

**Yes, they were.** He found two separate errors in one sentence:

**(a) A lump-sum storm was being treated identically to the same rain spread over a week.**
1.70 in in one afternoon and 1.70 in across seven days produced the same answer. They are not
the same. A rain gauge measures what fell out of the sky; the grass only gets what the ROOT
ZONE can hold. **Loam holds ~1.5 in of available water per foot**
([UMN Extension](https://extension.umn.edu/irrigation/basics-irrigation-scheduling)) and
cool-season turf works the top 6-8 in, so the root zone banks roughly **1 inch**. Rain past
that in a single day drains below the roots or runs off.
**Fix: `ROOT_ZONE_IN = 1.0`, applied per day, with the overflow REPORTED as run-off, not
silently dropped.** 1.0 is the generous end of the 0.75-1.0 range — when uncertain, credit
more rain and water less.

**(b) No forward view, so the app could tell him to water the day before a storm.**
**Fix: a second window.** `past_days=7&forecast_days=7` gives 14 daily values; `[0..6]` is the
seven completed days behind, `[7..13]` is today plus the next six.

```
BEHIND (last 7 completed days)
  target   = clamp(ET0_past x Kc, 1.0, 1.5)
  rain     = SUM min(day, 1.0)            <- root-zone cap, per day
  deficit  = max(0, target - rain)

AHEAD (today + next 6, from forecast)
  fwdTarget    = clamp(ET0_fwd x Kc, 1.0, 1.5)
  fwdRain      = SUM min(day, 1.0)        <- same cap on forecast rain
  putDownIn    = max(0, deficit + fwdTarget - fwdRain)   <- THE ACTIONABLE NUMBER

  minutes = putDownIn / (PR_zone x DU) x 60   per zone, split over 3 watering days
```

**Run times are driven by `putDownIn`, not by the backward deficit.** If enough rain is
forecast, the card reads NO WATERING NEEDED and says *"let the sky do it"* even while he is
technically behind.

### ⚠️ Consequence Jeff must know about

**This changes the answer to his own original example.** He said 1.7 in of rain "would show
that as zero watering needed." With the cap it shows **0.17 in still short**, because only
1.00 in of that storm was available to the grass. That is the physically honest answer and it
is the direct result of the problem he himself identified — but it contradicts his first
spec, so **he gets to overrule it.** Reverting is one constant: set `ROOT_ZONE_IN` high
(e.g. 99) and the cap disappears. Do not change it without him saying so.

### Still deliberately NOT built

No soil-moisture carry-over balance, no MAD tracking, no per-zone soil type, slope or sun
exposure, no cycle-and-soak. **"Not all of it" still stands.** One honest cap on one day's
credit is not a soil bucket.

## Precipitation rate — the number that turns inches into minutes

**Verified 2026-08-20 from Hunter's own MP Rotator Design Guide (LIT-461), performance tables
extracted from the PDF.** Not recalled. The first draft of this endpoint assumed a flat 0.4 in/hr
for every zone; that was replaced.

Hunter, 40 PSI, square spacing:

| Nozzle | Arc | GPM | Precip in/hr |
|---|---|---|---|
| MP3500 | 90° | 1.28 | 0.40 |
| MP3500 | 180° | 2.86 | 0.45 |
| MP3000 | 90° | 0.86 | 0.37 |
| MP3000 | 180° | 1.82 | 0.39 |

Each zone's rate = flow-weighted average over its **real** arcs, scaled by
`measured GPM / spec GPM` from Jeff's isolated-zone test
(`docs/utilities/irrigation_gpm_calibration_2026-08-06.md`). Real flow through a fixed area **is**
the precipitation rate, so his measurement wins wherever it disagrees with the spec sheet.

| Zone | Heads (real) | Spec GPM | **Measured GPM** | **Rate used** | Implied area |
|---|---|---|---|---|---|
| 1 Front Right | 4× MP3500 — 2×90°, 2×180° | 8.28 | **8.78** | **0.461 in/hr** | ~1,835 sq ft |
| 2 Front Left | 5× MP3500 — 2×90°, 3×180° | 11.14 | **10.09** | **0.397 in/hr** | ~2,446 sq ft |
| 5 Side Bed | 3× MP3000 — 2×90°, 1×180° | 3.54 | **4.40** | **0.473 in/hr** | ~896 sq ft |

**The cross-check that makes this trustworthy:** three zones, two nozzle models, three different
head counts — and the rates land within 0.08 in/hr of each other. Matched precipitation rate,
which is the entire design premise of MP Rotators, is holding up in Jeff's actual yard. Had one
zone come out at 0.1 or 1.2 in/hr, the model would be wrong and it would have shown up right here.

**Zones 3, 4, 6 report "not calibrated" and never guess.** Zone 3 has a known bad head; 4 and 6
have never been flow-tested; **zone 6 is a raised vegetable garden, not grass** — the 1–1.5 in
target does not apply to it even once its flow is measured.

## ⚠️ What the water meter can and cannot give us

Jeff, 2026-08-20: *"all of the data you need is in water information from the meter and the water
flow to each zone. It's all in there, it just needs a little algorithm."*

**He is right about the hard half, and that half is done** — the meter is exactly how the per-zone
GPM above was measured, and it is real measured data, not a spec guess.

**The one thing the meter cannot measure is AREA.** Gallons become inches only through square
feet: *1 inch of water over 1 sq ft = 0.623 gallons.* A meter reading 100 gallons cannot say
whether that was 0.5 in on a small zone or 0.1 in on a big one.

**This is not a question for Jeff and nobody needs a tape measure.** The Hunter matched-rate spec
supplies in/hr directly, and his measured GPM scales it — which is what the table above does. The
"implied area" column is that math run backwards, and it is the free sanity check: if those three
numbers look roughly right for his front yard split in two plus the side bed, the model is sound.

**The one thing that would make it exact is a catch-cup test** — cans around a zone, run 15 min,
average the depths, × 4. Gives in/hr directly, no spec sheet and no area. ~20 min per zone.
Until then every runtime is flagged `estimated: true` in the payload and on the card.

## Reality check Jeff should see before the card shows it to him

At these rates, **1 inch of water takes roughly 2.5–3.5 hours per zone**, per week:

| Zone | Minutes for 1.00 in | Split over 3 days |
|---|---|---|
| 1 | ~174 min | ~58 min/day |
| 2 | ~201 min | ~67 min/day |
| 5 | ~169 min | ~56 min/day |

That is normal for MP Rotators — deliberately low precipitation rate, so long runs. But it is far
more than the 20/18/8 min representative times recorded in `docs/utilities/irrigation_gallons_model.md`.
**Not yet checked against what B-Hyve actually runs.** Do not tell Jeff he is under-watering until
the real run history has been summed — the app already has it via `irrGalFromHistory()`.

## Known open item

`functions/api/watering.js` reads `env.WU_API_KEY` with **no fallback**, unlike `weather.js` which
still carries an exposed literal key. If `WU_API_KEY` is not set in Cloudflare Pages, the card
falls back to *modelled* rain instead of Jeff's own gauge — which is the left-hand side of his
whole equation. The card says which source it used, out loud. **Confirm by reading `rainSource`
from the live endpoint after deploy.** Setting `WU_API_KEY` in Cloudflare also closes the
documented "rotate the public key" item in `CLAUDE.md`.
