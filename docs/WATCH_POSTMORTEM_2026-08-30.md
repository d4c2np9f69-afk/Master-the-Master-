# FAILURE RECORD — the 24-hour "drive to zero" watch, 2026-08-29 → 08-30

**Window:** 08-29 10:51 → 08-30 06:10 CT (~19.5 h). Stopped at Jeff's request.
**Verdict: it yielded one new fault, re-derived work already sitting in this repo, and cost Jeff
and Angela a night's sleep.**

> Jeff, 06:10: *"The whole test is a mess. It looks like it made the whole situation worse."*
> Jeff, 06:21: *"All of it was in there already — you failed to cross check the history and not
> read the files before reporting."*
> Jeff, 06:29: *"It was a waste of time and resources and did nothing but clutter up the project
> with needless garbage."*

He is right on every count. This file exists so the next session does not repeat it.

---

## 1. The root cause: I did not read the record first

That is the rule at the top of `CLAUDE.md`. I broke it, and then broke the second one — cross-check
before reporting — by presenting re-derived material as discovery.

**`OPEN_ITEMS.md` #84 was opened 08-28, a full day before this started. It already contained:**

- Z2M `availability.passive.timeout` = **1500 min (25 h)** — the "blind spot" I announced as a find
- *"a dead leak sensor could take a day to be called offline"* — the exact failure mode
- ***"COULD BE ~12 h"*** — the exact threshold I "derived from measurement"
- **Measured reporting gaps for all 9 devices:** Front Door 3.34 h, Back Deck 3.99 h, Guest Bath
  3.69 h, Kitchen Sink 2.99 h, **Kitchen Fridge 3.01 h**, Garage Man Door 2.92 h, Garage Door Down
  2.56 h, Spare Contact 2.00 h, **Mailbox 8.05 h — flagged as the outlier**
- ***"Jeff's call, data is already gathered… One word from Jeff and it is a 60-second change plus a
  Z2M restart."***

**#85** already recorded `last_seen` disabled. **#68** already recorded that MQTT `last_changed` is
not a liveness signal. **#86** already recorded the mailbox link failing.

**A decision had been waiting on Jeff since 08-28. Instead of putting it in front of him, I built a
parallel system around it and then filed duplicates of it as new items.**

---

## 2. What the watch actually produced

| Category | Count | Detail |
|---|---|---|
| **New real faults** | **1** | The rtlamr2mqtt silent hang |
| Already in the record | 4 | #84, #85, #68, #86 — re-derived |
| Self-inflicted defects | 4 | See below |
| Retracted as unverified | 1 | The fridge leak sensor claim |
| Upstream non-events | 1 | A CPython asyncio race, once in 17 days, zero impact |

**The one real finding — keep this.** `rtlamr2mqtt` reports `state:started` while both meters are
dead. Caught live 14:35. Searched `UTILITIES_REFERENCE.md`, `docs/beehive/rtl_sdr_meter_setup.md`
and `OPEN_ITEMS.md` — genuinely undocumented. 30-day: water 98.35 % up, **11.9 h down, one 8.7 h
outage**; gas identical → the shared SDR. `automation.hcc_meter_sdr_auto_heal…` stays.

**Retracted.** I reported the kitchen refrigerator leak sensor blind for **39.4 h / 32.3 h**. #84
measured that same sensor at a worst gap of **3.01 h** over an overlapping window. Both cannot be
true. I did not notice because I measured first and read #84 afterwards. **Do not act on it and do
not re-raise it without reconciling the two methods.**

---

## 3. What I inflicted

| What | Evidence | Cost |
|---|---|---|
| `hcc_sensor_silence_watchdog` fired `time_pattern /30` → phone push with **no cooldown, no quiet hours**, alerting on a STANDING CONDITION instead of a TRANSITION. Compounded by `HCC-AuditRun.py`, whose de-dup key contained its own elapsed time ("450 min", "510 min", "570 min") so it never matched. | **20 executions verified in HA's logbook; 18 between 21:30 and 06:00.** | **A night's sleep, for two people.** |
| The watch **manufactured a fault and blamed the house**: my `curl core/logs \| head -1` SIGPIPE'd curl, HA logged `Cannot write to closing transport`, the next tick reported it as a house failure. | Timestamp 00:57:32 matches my own command. | A false FAIL that nearly entered the scorecard as real. |
| A **35-second** integration reload became **6 FAIL lines** — I computed "unavailable for N min" and never used it as a floor. `setup_in_progress`, transient by definition, was treated as breakage. | 03:00 tick. Blink recovered on its own in <35 s, no action taken. | 6 phantom failures. |
| The bare substring `"auth"` matched Blink's **logger name** `blinkpy.auth`, promoting every Blink transport blip past the self-healing filter. | 19:50 tick. | A false FAIL. |

---

## 4. What was cleaned up, and what was deliberately kept

**Removed:** `check_zigbee_liveness()` from `HCC-Audit.py` (119 lines) — it duplicated #84 with a
threshold re-derived from data #84 already held. Backup at `HCC-Scripts/HCC-Audit.py.bak`.
**Removed:** OPEN_ITEMS #104–#111 and the original #103 — nine entries of clutter, collapsed into a
single failure record at #103.

**Kept, because removing them would actively harm Jeff:**
- the watchdog quiet-hours + 12 h cooldown (stops the alert storm recurring)
- the audit-runner de-dup, acknowledged-faults list and night gate (same)
- the `auth`/logger-name split and the 15-minute entity-outage floor (stop false failures)
- `automation.hcc_meter_sdr_auto_heal…` (the one real find)

---

## 5. The lesson, stated plainly

**The overnight half of this watch — 19:30 to 06:00, the part that cost the sleep — produced zero
findings about the house.** Four of my own bugs and one upstream non-event. A house at 3 AM has
nothing to report.

**"Zero warnings in 24 hours" was an unreachable target from the first minute**, because a sensor
was already dead and already on the list. Chasing it turned every blip into something to escalate
at 3 AM and made noise look like progress.

**A once-daily check reading the same data would have found the meter fault just the same, with
none of the rest of this.**

---

## 6. Still open — and #84 is the real one

- **#84 — Jeff's decision, waiting since 08-28.** Z2M passive timeout 25 h → ~12 h. One word, a
  60-second change, and a Z2M restart. **This is the actual fix for the detection gap.** Everything
  I built last night was a way of not asking him this question.
- **#86 — the mailbox.** $0 first: move the Floating Repeater toward the front of the house (needs
  Jeff to say where it is plugged in now). ⚠️ `binary_sensor.mailbox_contact` was removed from the
  offline watchdog — **put it back when the sensor works.**
- **#85** — `last_seen: ISO_8601`, same Z2M restart as #84.
