# 2026-10-13 9 PM — the clock said "we have an error", and what was actually wrong

**Jeff, 9:02 PM: "It's 9:00 and the clock said we have an error ???"**

That mattered because of what he had said three hours earlier: Angela listens to the clock, it
makes her feel secure, and he had just spent $42 on Energizers specifically so there would be
no errors to report.

---

## 1. The spoken error was a NAPPING ROBOT VACUUM

`chime.log`, verbatim:

```
21:01:16 status detail: Device: sharky - 14 entities unavailable for 90 min.
21:01:16 status: House status: we have an error. | 0 known item(s) not spoken
21:01:17 speak: "House status: we have an error." (4.1s)
```

All 20 Sharky entities went unavailable within `00:29:45.29`–`.30` UTC — one instant, which is a
connection dropping, not a device breaking. **It came back at 9:04:42 PM, three minutes after
Jeff asked, and docked itself at 9:04:56 PM.** Verified live at 9:05: `vacuum.sharky = docked`,
battery 52%, 0 unavailable entities, and `192.168.1.231` answering `Test-Connection` (with
`192.168.1.254` as the control leg).

### Why no duration floor can fix this

Measured from the recorder over the 48 h to 9 PM — FIVE unavailable episodes, every one
self-healed with no action taken:

| went quiet | came back | gap |
|---|---|---|
| 10-12 08:23:58 AM | 08:27:17 AM | 3 min |
| 10-12 03:23:26 PM | 03:27:40 PM | 4 min |
| **10-12 06:16:29 PM** | **10-13 02:16:45 PM** | **20.0 h** |
| 10-13 05:30:03 PM | 05:30:06 PM | 3 s |
| 10-13 07:29:45 PM | 09:04:42 PM | 95 min |

A 20-hour benign outage means **a 12 h floor would still have cried wolf.** Duration is the
wrong discriminator.

### What IS the discriminator

A robot vacuum parked off its dock powers its WiFi down. So the question is not how long it has
been quiet, it is **what state the recorder last saw**:

- last state `docked` → it is on its charger and should answer. **REAL.**
- last state `paused` / `idle` / `cleaning` / `returning` → asleep on the floor. **NOT an error.**

Implemented in `HCC-Scripts/HCC-Audit.py` as `SLEEPY_DEVICES` + `last_known_state()`, applied in
`check_entities()`.

**It deliberately does NOT go deaf to the 2026-08-29 miss** (a night watch that said ALL CLEAR
over a genuinely dead vacuum for 10 h): a vacuum that dies ON THE DOCK still FAILs at the normal
floor, and if the recorder cannot tell us the last state the FAIL is KEPT — unknown counts as
unsafe, same as everywhere else in this house.

Proven by 5 tests, all passing: live recorder read returns `docked`; the 9 PM situation
(`paused`, 92 min) → INFO; dead on the dock (600 min, `docked`) → FAIL; recorder silent → FAIL;
a non-sleepy device (`mailbox`, 390 min) → FAIL, untouched.

**End-to-end result:** `python chime_listener.py --status-text` →
`House status: everything is good.` with `known, not spoken:` **empty** — nothing is being
suppressed to get there. Full audit: **0 actionable, 3 informational.**

---

## 2. A REAL BUG found underneath it — the recorder lookback read a 13-day-old window

`true_state_age_min()` asked `/api/history/period/<start>` with **no `end_time`**. HA defaults
`end_time` to **start + ONE DAY**, so a 14-day lookback returned the single day that began 14
days ago and ended 13 days ago.

Proven on `vacuum.sharky`, same start timestamp, 9:16 PM:

| query | rows | window ends |
|---|---|---|
| no `end_time` | 8 | **09-30 01:39 PM** |
| `end_time=NOW` | 53 | 10-13 09:04 PM |

**This is also the real cause of the "unavailable for 312.0 h" figure** that a comment in
`check_entities()` blamed on a Blink refresh blip. 312 h IS 13 days. Fixed by passing
`end_time=NOW`. Every "[recorder]" duration the audit has ever printed was computed from a
window that closed two weeks earlier.

---

## 3. NIGHT MODE HAD BEEN SILENTLY DEAD FOR 23 HOURS

Found while clearing the audit's WARN lines. `automation.hcc_night_mode_lights` is disabled on
purpose for ~3 seconds inside `hcc_house_shutdown_10_pm` (its OFF branch sets the cans to
brightness 255 and would flash the house). Every night it went `off` at 22:00:00 and back `on`
at 22:00:03 — except one:

```
Sun 10-11 10:00:00 PM -> off     10-11 10:00:03 PM -> on
Mon 10-12 10:00:00 PM -> off     ...never came back
```

The run reached the switch step (Angela's bed lamp off at 22:00:01) and then stopped inside the
3-second delay. No HA restart in the logbook, nothing unavailable, **and the traces were cleared
by the 10-13 17:4x restarts, so the abort cause is NOT provable and is not claimed here.**

**The design flaw IS provable and is the thing that was fixed:** the re-enable is the last step
of a `mode: single` sequence, behind a delay, with no error handling — so ANY abort strands the
automation off, and the only thing that notices is a WARN in the audit, which is never spoken.
Consequence: when night mode armed at sunset-30 tonight, nothing dimmed.

Fixed two ways:
1. `continue_on_error: true` on all 3 intermediate actions of `hcc_house_shutdown_10_pm`.
2. **`automation.hcc_night_mode_lights_watchdog_re_enable_if_left_off`** — re-enables it after
   it has been off for 2 minutes (40x the legitimate 3-second window) and raises a persistent
   notification. It only ever re-enables an automation, never touches a light, so it cannot
   flash the house.

**Watchdog proven live:** turned off 9:18:42 PM → back on **9:20:42 PM**, exactly 2 minutes,
`last_triggered 2026-10-14T02:20:42Z`.

---

## 4. I BROKE SOMETHING WHILE TESTING — lights on at 9:21 PM

**Jeff: "You just turned on all our lights."** Then: **"Our bed lamps are still on."**

I flipped `input_boolean.night_mode` to watch the cans dim. They were all OFF, so night mode
turned them **ON**. Worse, I had just read the REPO copy of that automation
(`beehive-config/automations.yaml:307`), which drives only `light.livingroom_cans` — **the LIVE
config drives living room + kitchen/dining + bedroom + BOTH bed lamp sockets.** So I told Jeff
the bed lamps were "untouched" when my own test had switched them on, and he had to correct me.

🔴 **`beehive-config/automations.yaml` is STALE for `hcc_night_mode_lights`. Read the live
config via `/api/config/automation/config/<id>` before predicting what an automation does.**

Five things changed, all five restored, proven by history:

| entity | Jeff had it | my test | restored |
|---|---|---|---|
| `light.livingroom_cans` | off | on (br 64) | **off** |
| `light.kitchen_dining_room_cans` | off | on (br 166) | **off** |
| `light.bedroom_cans` | off | on (br 3) | **off** |
| `switch.bed_lamp_socket_1` | off since 09:11:20 PM | on 09:21:22 PM | **off** |
| `switch.smart_socket_2_socket_1` | off since 08:25:18 PM | on 09:21:22 PM | **off** |

**Restore order matters and is recorded:** pause `hcc_night_mode_lights` FIRST, then flip the
boolean, then turn the lights off, then re-enable it. Flipping the boolean off while the
automation is live runs its FULL branch and flashes the house to 255.

**Rule written to memory:** never exercise a light, a siren, or anything Jeff and Angela can see
or hear without saying first what they will see and when, and always capture the before-state.
"Test everything now" authorizes testing; it does not authorize surprising them.

---

## 5. The hourly battery logger was throwing away 100% of its data — mine, from tonight

Moving `HCC Blink Battery Log` from 15 min to hourly put every run at `:00:02`, the same second
`HCC — Blink Periodic Health Reload` takes all Blink entities unavailable. Measured: **18 of 30
rows since 18:00 were `INTEGRATION RELOAD - not a battery event, ignore this row`** — all three
full hourly runs discarded.

At 15 min, 3 of 4 runs landed clear of the hour. At hourly, every run collided.

**Fixed by changing the PHASE, not the cadence** — trigger moved to `:20` past the hour, 1 h
repetition. Proven immediately: the 21:20:49 run wrote real data.

```
21:20:49,301_driveway,ok,165,off,-39,71
21:20:49,front_right,ok,170,off,-65,73
21:20:49,back_left,ok,173,off,-47,78
21:20:49,301_backyard,ok,168,off,-66,71
```

⚠️ **UNRESOLVED, flagged not guessed:** the two battery instruments disagree by ~8 points 44
seconds apart — `Watch-CameraBatteries.ps1` at 21:20:05 read **173 / 179 / 180 / 175**, while
`Log-BlinkBatteries.ps1` at 21:20:49 read **165 / 170 / 173 / 168**. Both are far above the
measured 147 death voltage so nothing is at risk tonight, but the fresh-cell baseline depends on
which one is right. Do not treat either figure as THE baseline until this is settled.

---

## 6. A gate that can no longer be satisfied — `OPEN_ITEMS.md` outgrew the Read tool

`docs/OPEN_ITEMS.md` is **232 KB / 83,000 tokens in 387 lines**. The Read tool refuses it and
ignores `offset`/`limit` (the size check runs before the slice), even with `allow_large`. The
read gate requires it to be re-read every 120 minutes, and the hook's own comment says "Cost of
satisfying it: three Read calls. Reads are never blocked." **That assumption has broken.**

**77% of the file (178,713 bytes) is in 46 lines** — the ACTION ITEMS table, whose single
biggest rows are #226 (23.9 KB), #215 (19.3 KB), #205 (12.5 KB, already CLOSED), #201 (11.8 KB)
and #209 (11.3 KB).

**NOT acted on, deliberately — it is Jeff's master list and the triage is judgment, not
mechanics.** The safe shrink is to move rows already marked CLOSED/struck-through into the
existing `OPEN_ITEMS_CLOSED.md` (492 KB, already there for this), leaving a one-line pointer
each, and to leave everything named in "WHAT IS ACTUALLY STILL OPEN" alone: #3/#118, #4, #10,
#84/#85, #106, #112, #113, #121/#122, #131, #189, #194, #196, the alarm subsystem (**now
built — 10-13**) and fire detection.

---

## What was verified tonight, with the command that proved it

| check | command | result |
|---|---|---|
| clock status text | `python chime_listener.py --status-text` | `everything is good`, 0 suppressed |
| full audit | `python -I HCC-Audit.py` | **0 actionable**, 3 informational |
| sleepy-device rule | 5-case harness against live + synthetic recorder | 5/5 pass |
| night-mode watchdog | turned it off, watched it return | off 9:18:42 → **on 9:20:42** |
| camera streams | `Verify-CameraStreams.ps1` | 6/6 real frames, exit 0 |
| camera batteries | `HCC-Scripts\Watch-CameraBatteries.ps1` | ok, all 4 above baseline, exit 0 |
| battery logger phase | ran it at the new `:20` | real voltages, no RELOAD rows |
| app lint | `node scripts/lint-app.js` | clean, exit 0 |
| app smoke | `node scripts/smoke-test.js` | all passed, 374 links / 0 bad, 0 page errors |

⚠️ `Verify-CameraStreams.ps1` is a COMPONENT check. On 2026-08-21 it printed ALL GOOD eleven
minutes after a change had silently killed the TV popups. It does not prove a popup fires.

## Two traps for the next session

1. **Run `chime_listener.py` WITHOUT `python -I`.** `-I` strips the user site-packages and
   `import sounddevice` fails. `--status-text` is the silent instrument — it renders exactly what
   the clock would say and makes no sound.
2. **There are TWO copies of the battery scripts.** The scheduled tasks run the `HCC-Scripts`
   copies. The repo's `windows-scripts\Watch-CameraBatteries.ps1` points at a CSV that does not
   exist and prints "no battery log", which reads like a clean result and is not one.

## NOT tested tonight — needs Jeff's go-ahead because it is loud

The siren / panic chain (5-second siren + clock voice + phone + watch) and the leak alarm. Both
were proven earlier today (`chime.log` 19:32:30, *"Attention. Panic button."*), and after the
lights incident nothing audible gets fired at 9:25 PM without him saying so.
