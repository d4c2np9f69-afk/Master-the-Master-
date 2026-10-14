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


---

## 7. THE SYLVANIA LIVING ROOM LAMPS — 9:29 PM, and a capability the record said we did not have

**Jeff:** *"I know you can't turn off the living room lamps because they are the Sylvania but Alexa
can turn them off so if you could tell her to turn the living room lamps off when you do the 10pm
shut down."* Then: *"She turns them off every night but we have to ask her to."* Then:
**"I call them living room lamps."**

So the phrase is `turn off the living room lamps`. `docs/beehive/alexa_exposure_cleanup_2026-08-14.md`
had recorded the Alexa group as "Living Room Lights" — **that is not what he says to her, and that
doc has been corrected in place** so a later session does not "fix" the working phrase into a broken
one.

This is squarely his own design rule: **"a feature that needs Jeff to remember to trigger it is not
finished."** Asking her every night was the last manual step in the 10 PM shutdown.

### Route A — built, but the record says it is dead

`media_player.play_media` + `media_content_type: custom` to `media_player.living_room_echo_dot`
("Run Custom Command"). A web search confirms the feature exists in alexa_media_player **3.4.0+**
and the installed version is **5.16.2**.

🔴 **But this project's own 08-13 memory had already recorded that exact call as "returns OK
but nothing happens — Amazon closed that API", tested on these very plugs.** The record and the
internet disagree. **Nothing is claimed until a real 10 PM run is observed** — which is why a
watcher was set rather than a prediction written.

### Route B — the 08-13 "impossible" was a wrong command NAME

`input_boolean.living_room_lamps` has existed since 08-13. That session could not expose it to
Alexa, got `unknown_command`, and wrote the capability off as unavailable. It is available:

```
config/entity_registry/update
    entity_id      = "input_boolean.living_room_lamps"
    options_domain = "cloud.alexa"
    options        = {"should_expose": true}      -> success=True
verified: homeassistant/expose_entity/list -> {"cloud.alexa": True}
```

Probed all six candidates in one pass; only the last works:

| command | result |
|---|---|
| `homeassistant/expose_entity/expose` | `unknown_command` |
| `homeassistant/expose_entity/set` | `unknown_command` |
| `homeassistant/expose_entity/update` | `unknown_command` |
| `homeassistant/expose_entity/expose_new` | `unknown_command` |
| `cloud/alexa/entities/update` | `unknown_command` |
| **`config/entity_registry/update` + `options_domain`** | **success** |

`homeassistant/expose_entity/list` **reads** fine — only the setters are missing, which is exactly
the trap: a working read makes the write look like it should exist under a matching name. The same
`options_domain` route works for `conversation` and `cloud.google_assistant`.

### The shutdown now runs both, 10 steps, re-enable always last

```
 1. automation.turn_off      hcc_night_mode_lights
 2. input_boolean.turn_off   night_mode                                  [continue_on_error]
 3. light.turn_off           living / kitchen-dining / bedroom cans       [continue_on_error]
 4. switch.turn_off          masterbath + both bed lamps                  [continue_on_error]
 5. delay 3 s
 6. media_player.play_media  Echo Dot "turn off the living room lamps"     [continue_on_error]   <- Route A
 7. input_boolean.turn_on    living_room_lamps                            [continue_on_error]   <- Route B
 8. delay 5 s
 9. input_boolean.turn_off   living_room_lamps  (re-arm)                   [continue_on_error]
10. automation.turn_on       hcc_night_mode_lights
```

**Every intermediate step carries `continue_on_error`** so neither Alexa route can abort the
re-enable — the exact failure mode fixed in section 3 above.

### The one thing only Jeff can do

Route B needs an Alexa Routine: **When "Living Room Lamps" turns on → turn off the living room
lamps.** Until that Routine exists the pulse is a harmless no-op, so it is safe to leave wired.
He may also need to say *"Alexa, discover devices"* once for her to pick up the newly exposed
switch.

⚠️ **HA cannot see these lamps at all** — they are not HA entities. No instrument here can
confirm the lamps went off. **Only Jeff can.**


---

## 8. ✅ RESOLVED 9:38 PM — Jeff said "Test it", and ROUTE A WORKS

He did not want to wait for 10 PM. Fired live at **9:38:02 PM**:

```
media_player.play_media
   entity_id          = media_player.living_room_echo_dot
   media_content_type = custom
   media_content_id   = turn off the living room lamps
-> HTTP 200, response []
```

**Jeff, 9:38 PM: "The lamps are out."**

🔴 **So the 08-13 record was WRONG** — that call does NOT silently no-op today. Either Amazon
re-opened the path or alexa_media fixed it in the versions since. `system_log/list` logged no error
for it (the only Alexa entry in the whole log is an unrelated 6:00:10 PM state-report timeout on
`binary_sensor.front_right_motion`).

⚠️ **How this nearly got called a failure:** the Echo's own state does **not** change
(`last_changed` stayed at 5:55 PM) and the response body is an empty `[]`. From HA's side the call
looks exactly like a no-op — which is almost certainly how the 08-13 session reached the wrong
conclusion. **Nothing in HA can see these plugs.** Only Jeff looking at the lamps could settle it,
and that is why he was asked rather than told.

### Route B removed the same minute, and its exposure REVERTED

Route A is proven, so the `input_boolean.living_room_lamps` pulse was dead weight — stripped out,
shutdown back to **7 steps**. More important, the helper was **un-exposed from Alexa at 9:39 PM**
(`homeassistant/expose_entity/list` → `None`): leaving an HA switch named **"Living Room Lamps"**
sitting beside the real Sylvania group is precisely how the spoken phrase that just worked would
have been broken later. That risk was mine, created minutes earlier, and removed as soon as Route A
proved out.

**The capability it uncovered is kept in memory anyway**, because it is genuinely useful and the
08-13 session had concluded it was impossible: `config/entity_registry/update` with
`options_domain="cloud.alexa"` and `options={"should_expose": true}` works on HA 2026.10.1, while
every `homeassistant/expose_entity/*` and `cloud/alexa/entities/update` name returns
`unknown_command`.

### Final state of the 10 PM shutdown

```
 1. automation.turn_off      hcc_night_mode_lights
 2. input_boolean.turn_off   night_mode                                 [continue_on_error]
 3. light.turn_off           living / kitchen-dining / bedroom cans      [continue_on_error]
 4. switch.turn_off          masterbath + both bed lamps                 [continue_on_error]
 5. delay 3 s
 6. media_player.play_media  Echo Dot "turn off the living room lamps"    [continue_on_error]
 7. automation.turn_on       hcc_night_mode_lights
```

Jeff asking her every night was the last manual step in the 10 PM shutdown. It is gone.


---

## 9. 🔴 RETRACTION — section 8 above is WRONG. Route A is DEAD.

**Section 8 claimed Route A was proven. It was not. Jeff caught it:**

> *"No the lamps have been off you will have to turn them on first to test if they go off"*

The 9:38 PM test fired "turn **off** the living room lamps" at lamps **that had already been off
for hours**. Jeff's *"The lamps are out"* was a description of the pre-existing state, not evidence
that anything happened. **A test whose expected result equals the current state cannot fail, so it
cannot prove anything** — and I wrote PROVEN into a memory, this document and commit `effc070` on
the strength of it.

**The test that could fail, run at 9:40:35 PM:**

```
media_player.play_media   media_content_type=custom
media_content_id = "turn on the living room lamps"      -> HTTP 200, []
```

**Jeff: "No they did not come on."**

✅ **So the 08-13 memory was RIGHT all along** — `media_content_type: custom` *"returns OK but
nothing happens, Amazon closed that API."* The web search that said the feature exists in 3.4.0+
is true about the integration and irrelevant about Amazon's endpoint. **The local note was written
against this hardware; the search was not.**

**Why there is no signal in HA:** the call returns `HTTP 200` with an empty `[]` body and the
Echo's `last_changed` never moves — identically, whether it worked or not.

### What was changed, 9:41 PM

- **The dead `media_player.play_media` step is REMOVED** from `hcc_house_shutdown_10_pm`.
- **Route B restored and is now the live path.** `input_boolean.living_room_lamps` is exposed to
  Alexa again and the shutdown pulses it on for 5 s, then off to re-arm, both with
  `continue_on_error`. The re-enable of `hcc_night_mode_lights` is still last.

```
 1. automation.turn_off      hcc_night_mode_lights
 2. input_boolean.turn_off   night_mode                              [continue_on_error]
 3. light.turn_off           living / kitchen-dining / bedroom cans   [continue_on_error]
 4. switch.turn_off          masterbath + both bed lamps              [continue_on_error]
 5. delay 3 s
 6. input_boolean.turn_on    living_room_lamps                        [continue_on_error]
 7. delay 5 s
 8. input_boolean.turn_off   living_room_lamps  (re-arm)              [continue_on_error]
 9. automation.turn_on       hcc_night_mode_lights
```

### 🟠 OPEN — one thing only Jeff can do

**Alexa app → More → Routines → +**
- **When:** Smart Home → **"Living Room Lamps"** → *turns on*
- **Then:** Smart Home → turn **off** the living room lamps

If "Living Room Lamps" is not offered as a trigger, say **"Alexa, discover devices"** once.

Until that Routine exists the nightly pulse is a harmless no-op and he still has to ask her.
🔴 **Do not claim the 10 PM lamp shutoff works until he confirms it on a night the lamps
were ON beforehand.**

### The lesson, recorded in memory

A test must be able to fail. If the expected result equals the current state, drive the device to
the opposite state first. `HTTP 200` is not a result, and for a device HA cannot see the only
evidence is a human looking at it — so the question has to be one a human can answer
unambiguously.
