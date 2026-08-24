# 🛑 STOP. READ THIS BEFORE YOU TYPE ONE WORD TO JEFF.

**Written 2026-08-23 7:45 PM as Jeff closed the day. His words:**

> *"you gotta tell the next session to read the shit before they start in so I don't have to go
> through everything I did with you. Lord have mercy if I've got to do that again tomorrow."*

**He is not being dramatic. On 2026-08-23 a session — me — burned roughly half his afternoon on
things that were already written down.** Not missing information. Written down, in this repo, in
files I opened *after* acting instead of before.

---

## HOW DEEP THIS GOES — read this part twice

**Since 2026-05-20: 782 commits. 230 files. 87 documents. 132 MB of archived record.
A live house running 447 entities, 61 integrations, 6 cameras, 2 radios, 12 sensors, an
11,203-line app — wired by Jeff himself.**

**You cannot infer this system. You can only read it.**

Every decision here has a history, and most of them are already settled — bought, rejected,
measured, or paid for. What looks to you like an obvious improvement is usually something that
was tried, cost real money or real hours, and got closed on purpose.

**A session that guesses instead of reading does not lose an hour. It loses Jeff a day** — his day,
re-checking by hand everything that session told him, because one wrong confident answer makes all
the others suspect. That has happened enough times to be measured: **~44 hours.**

**Reading first costs 60 seconds. Not reading has never once come out ahead.**

---

## WHAT TO READ, AND WHY EACH ONE MATTERS

Read these **in this order, before touching anything.** The "why" column is what it stops you
doing — this is not a reading list for its own sake.

| # | Read this | Why — what it prevents |
|---|---|---|
| 1 | `C:\Users\jeffl\CLAUDE.md` | The always-loaded rules and the cost of breaking them. **Read it, do not skim it.** Jeff had to say "don't just skim it read it damn it" three times on 08-23. |
| 2 | `Documents\GitHub\master-the-master-\CLAUDE.md` | Real project memory + **SETTLED DECISIONS**. Stops you re-proposing things already bought, rejected, or paid for. |
| 3 | **`docs\OPEN_ITEMS.md`** | **THE list — the single source of truth for what is not done.** 29 closed / 4 parked / 34 open. Stops you "discovering" work already finished, and stops you handing work off in prose where it dies. |
| 4 | **`docs\CAMERAS_CLOSED_2026-08-22.md`** | **61 lines. The stop sign.** Lists what is *deliberately not being worked* and forbids camera-automation changes unless the verify script FAILS. **Read it before any camera thought.** |
| 5 | `iCloudDrive\HCC-Archive\CAMERA_POPUP_REBUILD_GUIDE.md` | How the popup chain actually works (snapshot → AI → annotated JPEG → go2rtc → HomeKit). Stops you "fixing" a working chain or believing clips feed the TV. They do not. |
| 6 | `docs\COST_LEDGER.md` | What the failures actually cost. Read it once so the rules stop feeling arbitrary. |
| — | `windows-scripts\Search-HCC.ps1 "topic"` | **Run this before claiming anything is or is not documented.** No case exists in this project's history where guessing beat the lookup. |

**Access to everything — HA, Cloudflare, GitHub, network, vendors — is in
`C:\Users\jeffl\HCC-secrets\HCC_ACCESS.md`.** Reference paths from it; **never copy a value into
this repo, it is PUBLIC.** "Blocked by one tool" ≠ impossible — try another route first.

---

## WHY THIS FILE LEADS WITH READING — the 08-23 receipts

| what I did | what would have stopped it | cost |
|---|---|---|
| Proposed *and made* a camera-automation change | `CAMERAS_CLOSED_2026-08-22.md` lists that exact item under *"deliberately NOT being worked"* | I read it **last**. Jeff had to catch it. |
| Said "the panic automation waits on Zigbee hardware" | The automation itself — it is webhook-triggered and references no Zigbee at all | The note had been **wrong since 07-31** |
| Said HA 2026.8.3 "fixes nothing you'd notice" | `/api/config/config_entries/entry` — `vizio`, `dlna_dmr`, `go2rtc` are all installed | I searched entity **names** instead of config entries |
| Asserted a registry setting was the cause | Testing it | Jeff: *"tell me you didn't read the files"* |
| Said the terminal add-on was blocked | It was **Running**, with an "Open Web UI" button | Jeff: *"why can't you get into the terminal add on?"* |
| Chased the water-meter delay | The utility docs describe the pit-radio lag ~100 times | Jeff: *"You're chasing ghost because you're not reading"* |

**The pattern is always the same: a plausible local note that was stale, trusted instead of
checked.** See memory `feedback_local_note_beats_unrun_search`.

### Verify before you claim — the specific traps here

- **A component check is NOT a feature check.** `Verify-CameraStreams.ps1` printed ALL GOOD eleven
  minutes *after* the popups were dead. `Test-CameraFeature.ps1` tests the feature — **tell Jeff
  first, it pops his TV and his phone.**
- **Check config entries, not entity names**, before saying an integration is not installed.
- **Check `last_reported`, not `last_changed`.** HA holds a stale state forever and it looks fine.
- **Re-measure line numbers.** They drift.

---

## 🔴 DO NOT TOUCH — settled; re-litigating spends money already spent

- **CAMERAS.** Frozen. No camera / Blink / go2rtc / HomeKit / camera-automation change unless
  `Verify-CameraStreams.ps1` **FAILS** or Jeff asks. It passes.
- **The weather key (#1).** 🛑 **CLOSED 08-23 by Jeff: *"leave the weather key alone don't do
  anything to it and take it off the list."*** `functions/api/weather.js` is not to be modified.
  It also cannot safely be "tidied": `WU_API_KEY` is **not** among the Pages env vars, so deleting
  the fallback takes weather **dark**.
- **The Blink battery experiment.** `front_right` (151) and `301_driveway` (145, dropping
  ~0.75/day) are on original cells **on purpose**. Never advise replacing them.
- **The Mercedes is unlocked on purpose.** Never flag it. Never raise low fuel.
- **RTSP cameras** deferred on cost. **Z-Wave, Inovelli, Enbrighten, myQ, HomeKit Secure Video** —
  never re-propose.
- **The audits** — already paid for. Cite, never re-derive.

---

## WHAT CHANGED 2026-08-23 (so you don't rediscover it)

- **🔑 Cloudflare access now works without Jeff at the keyboard.** A scoped token is stored in
  `HCC-secrets\` and documented in `HCC_ACCESS.md` §3 **by path, never by value.**
- **The "Camera AI is DOWN" false alarm is fixed at the root** (#47/#59). A new REST sensor asks
  the AI host directly instead of inferring failure from silence. Proven in **both** directions —
  it still fires on a genuine outage.
- **#31 was real and is fixed.** HA had silently stopped ingesting the `zigbee2mqtt/` topic tree
  for ~5 hours while the SDR meters kept flowing on the same broker. Fix:
  `homeassistant.reload_config_entry` on the `mqtt` entry. **If Zigbee looks frozen, compare
  `last_reported` against `sensor.water_meter_last_seen` — the J45 has two independent radios
  (SDR for meters, Zigbee coordinator for sensors), so the meters are a perfect control signal.**
- **Traccar stopped** (397 MB, zero consumers) and pinned `boot: manual`. **Not uninstalled** —
  Jeff: *"no reason to delete if there is a chance we might need them."* It is the natural home for
  the #26 F-250 OBD-II build.
- **Stale items cleared:** #21 was **already built** 9 days earlier. #11 is **half done**. #55's
  shares **work**. #45 superseded. #37 and #39 were each **listed twice**.

---

## JOB 1 — Mount the remaining Zigbee sensors

**6 of 12 are already mounted and reporting** (3 door/window, 3 leak) — corrected 08-23 by live
count. Roughly **4 door/window + 2 leak** remain. Count what is physically left before planning.

- **Use `automation.hcc_zigbee_pairing_mode`.** It holds permit-join open by re-enabling it
  whenever Z2M's 254-second window expires. **Switch it ON for the job, OFF after.** Currently off,
  which is correct. **Do not delete it** — #16.
- **Z2M verified ready 08-23:** bridge `connection_state` on, v2.13.0, `permit_join` off.
- 🔴 **Before pairing anything: disable automatic firmware updates in the vendor app FIRST.** Newer
  firmware can demand cloud credentials for what used to be local. **Not reversible.** It already
  bit the Kasa devices.
- **Mounting:** VHB 5952, and **prep is 90% of the bond** — alcohol both surfaces, dry fully, press
  hard 30 seconds. A sensor that falls off in August gets re-done in January.
- ✋ **`back_deck_door_contact` reads OPEN and JEFF ALREADY KNOWS** (*"it will be fixed when we fix
  the sensors"*). Part of this job. **Do not raise it again.**

## JOB 2 — SONOFF MINI-D garage door opener

🔴 **BLOCKED — READ #64 FIRST.** The 08-06 plan ends in *"Matter-commission"*, but **Matter is not
set up in HA at all**: no `matter` domain, 0 Matter entities, **no Matter Server add-on
installed.** Wire it without fixing that and Jeff comes down the ladder to nothing to commission
to. **Install the Matter Server add-on + Matter integration FIRST**, with his go-ahead.

Then: **wire → power → eWeLink-pair in INCHING MODE → Matter-commission.** Inching mode is what
makes it a momentary door button instead of a latching switch.

The plan is already researched — `docs\beehive\garage_door_sonoff_mini_dry_setup_2026-08-06.md`,
sourced from SONOFF's own docs. **Cite it, do not re-derive it.** NO+COM in **parallel** with the
existing wall button, **do not use S1/S2**, MyQ coexists fine.

**Jeff wired this house himself — on electrical he is your expert peer.** Give him wiring facts,
not a safety lecture, and never suggest an electrician. **Never name a part or price from memory**;
three wrong part numbers on this exact job made him the fact-checker.

---

## THE BIG ONE COMING — the alarm subsystem

Jeff, 2026-08-23: *"we still got all the alarms stuff to do we got all of the sensors door sensors
the panic buttons alarm sirens the entire fire detection system still a ton left that will be
added."*

**Build it as ONE subsystem, not four one-offs** — shared triggers, shared notification targets,
shared siren output. Treating these as orphans is how #10 and #39 ended up stranded.

- **#10 — the panic button alerts NOBODY.** It flashes lights and writes a notification *inside HA*.
  No `notify.mobile_app_*` call exists anywhere in it. The fix is written and ready. **Two things
  need Jeff's answer first:** it cannot be tested without firing real critical alerts at both
  phones, and its webhook is `local_only: false` (internet-reachable) while critical alerts bypass
  Do Not Disturb.
- **#39 — nothing alerts on a door opening.** The old "may be deliberate" caveat is **retired**;
  Jeff confirmed the alarm system simply is not built yet.
- **#67 — a staleness watchdog** for the MQTT ingest failure. 🟢 **Design note, do NOT build yet.**
  Jeff: *"the sensors have to be up first before we can call [it] broken."*

---

## STILL WAITING ON JEFF — do not do these for him, do not nag

1. **HA backup encryption key → Bitwarden** (#2). Verified present in `HCC-secrets\`, and it is the
   **only copy**. The box has had 5 crashes and a 55-minute lockout this month, and the drive is
   **not encrypted** (#4). Genuinely load-bearing.
2. **Two HomeKit bridges are UNPAIRED** (#58/#58b) — proven from `paired_clients` in HA's own
   storage, still empty at 08-23 7:30 PM. Needs his iPhone. **Codes are in OPEN_ITEMS #58/#58b.**
3. **One reboot** closes #55's last piece. Nothing is broken meanwhile — the `tv` account works.
4. **HA Core 2026.8.2 → 2026.8.3** (#48) — patch only, no breaking changes, and it fixes a real
   Vizio crash path on live hardware here. **Run `Verify-CameraStreams.ps1` immediately after** —
   it touches go2rtc, and an HA restart is the documented way the 08-21 camera work gets silently
   undone.

---

**Last thing.** Jeff acts on what you tell him and usually cannot verify it himself. So *"I checked
X, here is the proof"* and *"I could NOT check X"* are **both useful**. A confident claim you did
not verify is the only truly destructive answer — it is indistinguishable from a true one until it
fails, and then he re-checks everything by hand. That re-checking is what ~44 hours of this project
actually went on.
