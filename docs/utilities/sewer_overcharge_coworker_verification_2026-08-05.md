# Sewer overcharge tracking — coworker verification results (2026-08-05)

Checked the 5 items from `sewer_overcharge_verification_2026-08-05.md` against the real Beehive
HA instance (local API, read-only GET calls only — no config or state changes made). One finding
below (recorder retention) is significant enough that it should get fixed before more billing
cycles pass.

## 1. HA recorder retention — real gap found, needs a config fix

Checked actual history depth (ground truth, not just the configured setting) by querying
`/api/history/period` across a wide date range for several long-lived entities:

- **General sensors** (`sensor.water_meter_reading`, `sensor.gas_meter_reading`,
  `sensor.water_flow`, electric SmartHub sensor): earliest recorded point is
  **2026-07-28T12:15 UTC** — matches CLAUDE.md's note that the recorder was dead 07-02→07-28 and
  fixed that day. Makes sense, that's just when continuous recording resumed.
- **B-Hyve zone switches** (`switch.z1_front_right` etc.): earliest recorded point is
  **2026-07-30T23:05 UTC** — all 6 zones (z1-z5 + garden) started existing in the recorder within
  the same second, meaning the B-Hyve/Orbit integration entities themselves weren't present/tracked
  until 2 days after the general recorder fix.
- **Configured retention**: `beehive-config/configuration.yaml` only has `default_config:`, no
  explicit `recorder:` block — meaning **`purge_keep_days` is still HA's default of 10 days.**

**Why this matters for the case:** `irrGalFromHistory()` computes `cycleStart` as the 21st of the
billing month (today: **2026-07-21**). But real B-Hyve history only exists from **2026-07-30**
onward — a **9-day blind spot at the start of the current open cycle** that the fetch can never
see, regardless of purge settings. On top of that, once the recorder has been alive 10+ days
(around 2026-08-07), the default purge will start dropping data older than 10 days on a rolling
basis — meaning by the time this cycle closes (~08-21), early-August B-Hyve data will already be
gone unless retention is extended. **Old, already-closed cycles (anything before 07-21) cannot be
retroactively corrected at all — there's no HA history for them and never will be, independent of
this fix.**

**Recommended fix (not yet applied, needs your OK since it's a live Beehive config edit):** add an
explicit override to `configuration.yaml`:
```yaml
recorder:
  purge_keep_days: 45
```
45 days covers a full ~30-day billing cycle plus buffer. Needs an HA restart (or
`recorder.reload`-equivalent — recorder purge_keep_days typically needs a restart) to take effect.
Say the word and I'll make this edit + restart directly.

## 2. B-Hyve history fetch — mechanically works, but unproven — zero real "on" events recorded

Reproduced the app's exact query pattern (`GET /api/history/period/<cycleStart>?filter_entity_id=switch.z*`)
directly against HA: **all calls returned HTTP 200 with real state-change arrays**, not 401/timeout.
The fetch mechanism itself is healthy.

Also confirmed the `station` attribute the code filters on (`at.station != null && IRR_FLOW[at.station] != null`)
is present and correct: `switch.z1_front_right`→station 1, `z2_front_left`→2, `z5_right_side_drive`→5 —
exactly matching `IRR_FLOW`'s keys `{1,2,5}`. Zones 3/4/6 (`z3_back_left`, `z4_back_right`, `garden`)
have `station` 3/4/6 but **no GPM configured in `IRR_FLOW`**, so any real watering on those 3 zones
is silently excluded from the gallons total — worth knowing (makes the tracked overcharge number
conservative/an undercount, not an overcount, which is fine for the case but you should know it's
there).

**Real finding: not one of the 6 zones has recorded a single "on" state anywhere in the entire
recorder history (07-30 through today, 08-05)** — every single history point for every zone is
"off" (with brief "unavailable" blips from routine connectivity hiccups). Because of that, the
code's own guard at the bottom of `irrGalFromHistory()` —
```js
if (totalGal <= 0) return; // no real watering events found yet this cycle
```
— means **the fix has never actually fired yet.** `water_billing_history`'s current-cycle
`irrGal`/`waste` fields are still sitting on the old schedule estimate, not because the fetch is
broken, but because there's no real "on" event yet for it to compute from.

Cross-checked against the raw water meter (`sensor.water_gallons`) for the same window — no jump
in cumulative reading anywhere close to the size of a real zone run (~46-344 gal depending on
zone/duration); all deltas look like normal household use (showers/kitchen/etc.), spread through
the day, not the early-morning pattern typical of an irrigation schedule. Also checked current
weather — clear, 76°F, no rain in progress — so this isn't obviously explained by 8 straight days
of rain-delay either (`rain_delay: 0` on all zones right now, i.e. not currently in a delay).

**Can't fully close this item — need your read of the B-Hyve app directly:** open the B-Hyve app
and check each zone's "Water History" / last-run timestamp. Either (a) WeatherSense has genuinely
skipped every scheduled run for over a week (possible but worth confirming), or (b) something else
is preventing scheduled runs from actually firing, or (c) — less likely, since B-Hyve's HA
integration normally mirrors real valve state from the cloud regardless of trigger source — the
switch entities aren't reflecting autonomous schedule runs at all. This is the one thing I
genuinely can't determine from HA's side alone.

## 3. Per-zone GPM sanity check — could not run yet, no real run in the data

Wanted to cross-check `IRR_FLOW` (`{1:17.2, 2:14.3, 5:5.7}`) against `meter_gallons_during_run /
run_minutes` for an isolated single-zone run. Since item 2 found **zero recorded "on" events for
any zone in the whole window**, there's no real run to calibrate against yet. Nothing wrong found,
just nothing to check — revisit this once a real watering event lands in history (should be
straightforward once item 2 above is resolved and a normal watering cycle happens).

## 4. Water meter gaps — one real gap found, likely benign/self-recovered (matches known pattern)

Scanned `sensor.water_meter_last_seen` heartbeat across the recorder's full alive window
(07-28→08-05, 3304 points). Most gaps are 1-5 hours, consistent with the meter's already-documented
batched-broadcast behavior (see CLAUDE.md's 08-01 entries — not a fault, the meter itself only
transmits on a threshold/delta basis, not continuously).

One gap stands out as longer than anything previously documented: **2026-07-29 19:21 UTC →
2026-07-30 14:03 UTC, ~18.7 hours.** Cross-checked the gas meter (same RTL-SDR dongle) for the same
window: **gas kept reporting normally the whole time (33 readings, roughly continuous)** — this
rules out a shared dongle/software-level outage, same diagnostic pattern used in the 08-01
water-meter investigation. Points to the water pit radio/meter specifically, not the capture chain.
Given the project's standing conclusion that this meter's own batching cadence is irregular and it
has self-recovered every time so far (and Jeff's explicit 07-31 call not to escalate to WHUD over
this), I'm treating this as the same known-benign pattern, just a longer stretch of it than
previously seen — not flagging as a new incident, but noting it in case a similar or longer gap
recurs. No usage data appears permanently lost (the meter's cumulative register catches up on its
next transmission), so this shouldn't understate any cycle's `gal` total on its own.

## 5. Live `localStorage.water_billing_history` check — needs you, but I can predict the answer

Can't reach your phone's browser storage directly. Given item 2's finding (zero real "on" events
recorded anywhere in history since the fix shipped), the current cycle's `irrGal`/`waste` fields in
your `water_billing_history` almost certainly **still show the old schedule-based estimate** — not
because the fix is broken, but because the code correctly declines to overwrite good data with a
computed zero when no real watering has been observed yet. Once a real watering event happens (or
once you confirm via the B-Hyve app whether/why nothing's run), open the app, let it sit on HOME for
a few seconds, then check `localStorage.water_billing_history` in dev tools — the current cycle's
`ts` field will be fresh and `irrGal` should visibly differ from the flat schedule number if the fix
fired for real.

## Bottom line — two things worth your call

1. **Recorder retention fix** (add `recorder: purge_keep_days: 45`) — recommend doing this soon,
   before the default 10-day window starts actively deleting data the case needs. I can make this
   edit + restart HA directly if you say go.
2. **Check the B-Hyve app for why no zone has run in 8+ days** — this is blocking real verification
   of items 2, 3, and 5, and is worth knowing about for its own sake (a dead irrigation schedule is
   a bigger problem than the sewer billing question).
