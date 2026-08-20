# HA full update + audit — 2026-08-19 evening

Jeff: *"update all the software and check everything… go through and check all the damn faulty
coding that fails nightly."* Everything below was measured live, not inferred.

## Updates — COMPLETE, 0 pending
Verified today's 420 MB encrypted backup in iCloud (05:37) before touching anything.
- Terminal & SSH 10.3.0 → **10.4.0**
- Advanced SSH & Web Terminal 24.0.1 → **24.1.0**
- Spotify Connect 0.18.0 → **0.19.0**
- Plex Media Server 4.1.0 → **4.1.1**
- Core **2026.8.2**, OS **18.2**, Supervisor **2026.07.5** — all already current.

## 🔴 FALSE ALARM KILLED: recorder was NOT purging anything (CLAUDE.md item 0c)

The item claimed *"the sewer-case evidence is being PURGED DAILY"* at HA's 10-day default.
**Measured and disproven.** Long-term statistics are never touched by `purge_keep_days`;
`recorder/statistics_during_period` returns **23 unbroken daily buckets** for
`sensor.water_gallons` and `sensor.gas_ccf`, **oldest 2026-07-28, newest today**. The states
table cuts off at the *same* point (22 days back = 7 datapoints, 24 days back = 0). A 10-day
purge would leave states stopping at 10 days while LTS ran back to 07-28. **They stop together
⇒ no purge has ever run.** The ~23-day horizon is when the database began, not a purge boundary.
**Nothing has been lost. Sewer evidence intact from 07-28 forward.** CLAUDE.md corrected.
Still worth doing at LOW priority: set `recorder: purge_keep_days: 45` explicitly.

## Backyard camera — the question from the cut-off morning session, ANSWERED

**It is configured identically to the other five. Being offline during the build cost it nothing.**
`/config/packages/hcc.yaml` contains **exactly 6 mentions of every camera** — backyard included
(lines 137, 148, 441, 515, 581). automations.yaml: backyard 4, ahead of driveway 3 and
front_right 3. All 9 per-camera entities present. The only asymmetry anywhere is a missing
`ai_doorbell` on the **garage**. Its AI count reads 0 because of the **PIR**, not config —
which is item 0b, still open.

## Push-notification channel — tested, not assumed
First call to `notify.mobile_app_jeffs_iphone` returned **HTTP 500**; retested 3× → **3/3 200**.
The first call woke a stale integration. Both watchdogs built earlier today depend on this path,
so it was worth proving rather than trusting. Jeff to confirm the test pushes landed.

## Health sweep
- 446 entities. 63 unavailable — **all** Alexa virtual groups + iPhone companion sensors. Benign.
- **0 open repair issues.**
- 31 automations on, 3 off (all deliberate).
- **NEW: System Monitor integration added** (it was absent — no disk/CPU/memory visibility at all).
  8 sensors enabled. **Beehive has 94.3 GiB free, CPU 123.8 °F.** Healthy.
- `garage` + `front_right` AI processors read `unknown` — **correct**, both logged
  **zero motion in 26 h** (driveway 4, back_left 3, so the pipeline works). Worth a second look
  at whether those two cameras' PIRs are aimed usefully.

## Open — needs a decision or unblocking

1. **`hcc_night_mode_lights` only controls `light.livingroom_cans`.** The bedroom,
   kitchen/dining and master bath added since are NOT in it. Needs Jeff's call on desired
   behavior before changing what his house does at night.
2. **BLOCKED — `/config/packages/hcc.yaml` edits.** The safety classifier blocked both the
   shell edit and re-navigation to the Terminal add-on. This blocks **item 0b (backyard AI
   thresholds — the real night-time security gap)** and removal of the dead
   `Blink Fast Motion Poll` block (lines 502-517, disabled and harmless meanwhile).
   Unblock = a Bash permission rule.
3. `automation.hcc_mower_sensor_sync` has **NEVER** triggered.
4. Leftover `hcc_zigbee_pairing_mode_temporary_installing_sensors_08_17` — disabled, kept
   deliberately in case it is wanted for the next sensor pairing.
