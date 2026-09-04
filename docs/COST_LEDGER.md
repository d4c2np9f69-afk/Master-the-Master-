# THE COST LEDGER — what not following the rules has cost Jeff

**Read this before you start work.** Every figure is measured from git, not estimated.
Full derivation: `MASTER-RECORD/CLOUD_SESSION/sections/20-research-vs-guessing.md`
and `21-md-not-read.md` — 20 catalogued incidents with hashes.

## The bill, 2026-05-20 → 08-16

| | |
|---|---|
| Measured active error-fighting | **29.0 hours** (commit brackets only) |
| With pre-commit debugging | **≈44 hours** |
| Incident-days open | **128** |
| Commits spent fixing self-inflicted problems | **95 of 636 — 14.9%** |
| Total subscription over the span | **$233.75** of Claude Max (NOT all waste — see next row) |
| Of that, spent fighting our OWN errors | **~$35** (14.9% share; audit brackets it $28–54) |
| Hardware bought that wasn't needed | replacement mower sensors (amount never recorded — do not invent one) |

**Jeff was present for nearly every hour** — pasting commands, running 2FA codes, live-testing,
refreshing a blank app, fact-checking part numbers. That is the real bill.

---

## THE ONE-LINE VERSION

> *Two weeks on Blink. Five days of dead CAR buttons. Four days planning AES decryption for an
> unencrypted meter. Six days on a form NOAA would never accept. Three guessed part numbers Jeff
> had to fact-check himself.* **Every one ended the moment somebody finally read the actual source,
> the actual release notes, the actual vendor page — or asked the actual person.**
>
> **The record contains no counterexample where sustained guessing beat the lookup.**

---

## THE BIG ONES — what happened · what it cost · what ended it

**HOUR METER — 50 incident-days.** Box sent `hours_seconds`; app read `hours`. Zero hours logged
across **5 real mows** while Jeff typed them in by hand. He was told his sensors were faulty and
**bought replacements he didn't need.** They were fine — recording 6.3 km the whole time.
→ *Coded against CLAUDE.md's prose description of the firmware. The description was wrong.*

**BLINK — 14 days on Jeff's #1 feature.** Two weeks building a custom override for a 2FA bug.
The override then **became** the bug, shadowing HA's own fix. It had hammered Blink's login every
~10s for days. → *Ended by one web search finding the official fix in the release notes.*

**WATER METER — 4 days** designing an ESP32 + CC1101 + **AES-128 decryption** stack, plus a
storage decision for the key. → *The meter was unencrypted. One in-person briefing from the WHUD
supervisor ended it. Nobody had asked which radio they actually read.*

**CAR COMMANDS — 5 days, every button dead.** Keyword-guessing at entity names; the guess
`'preheat'` was matching an **EV-only** service on a gas GLE 350. → *Rewritten from the
integration's source in 21 minutes.*

**"ALEXA, FAST FORWARD" — 13 days** of a feature that was architecturally impossible. → *HA's
`alexa/handlers.py` has no FastForward handler at all. One read of the source settled it.*

**mPING — 6 days** building a submission form, a proxy, and a token guide. → *NSSL: automated
reports are never allowed. One question to the people who run the API.*

**MERCEDES PIN — 13 days** of dead unlock/remote-start/windows, removed on a CLAUDE.md claim that
was wrong. Then a *wrong correction* shipped before the right one. → *One line of Jeff's system
log had the answer. **Jeff made the key observation both times.***

**COVERAGE MAP — Jeff's entire saved state wiped**, hour meter reset to the 5.9 default, on the
one number this project exists to track. → *"Root cause is mine."*

**B-HYVE HISTORY — declared a "definitive dead end" at 03:42, solved by research at 03:53.**
Eleven minutes. Had the session ended first, the false verdict would have entered CLAUDE.md as
settled fact.

**INOVELLI — 08-16, most of a day.** $120 re-pitched after Jeff killed it; told twice it "was never
documented" when it was, written 16 minutes after he decided. → *"This is infuriating."*

---

**APPLE TV SMB LOGIN — 2026-08-23, ~45 minutes of Jeff retyping.** I generated `BeastTV-Media-1409` for a device whose only input is a TV remote — two capitals, two hyphens, four digits, five keyboard mode-switches — without once checking what the far end could actually type.
Then I had him retry it repeatedly. **Windows had logged the exact reason the whole time**: `4625 / Sub Status 0xC000006A` = wrong password, then `0xC0000072` = VLC falling back to a disabled Guest account because the boxes went out empty. One query answered it — run 40 minutes late.
→ *Ended by reading the server's own auth log.* Also this session: went into the router without running `Search-HCC.ps1` first (Jeff had to stop me — `LoewenGuest` already existed and I had disabled it myself on 08-14), and doubted him on the access code having been entered before when the record says plainly it was, 08-13 12:17:55. **Rule 2 and Rule 4, both broken in one morning.**

**SAME MORNING, SECOND FAILURE — ~35 minutes.** When the Bash tool refused to enable the Guest account, I handed the work back to Jeff and he failed four times on my instructions: pasted into chat instead of a shell, copied a `❯` into bash, hit `$false` being eaten by bash quoting, then pasted my `powershell -Command '...'` wrapper into a shell that didn't need it. **The PowerShell tool was available the whole time and worked on the first attempt.** He had to tell me to use it, after calling the morning what it was.
→ *Lesson: when one tool refuses, try the other tool before delegating the work back to Jeff. 'I am blocked' must mean every route was tried, not the first one.*

## TWO WAYS TO BE WRONG — both are in the record

**Class A — the file existed and wasn't read** (or was searched badly). The Inovelli grep trap:
searching for the *dead* plan, finding nothing, and calling it undocumented.

**Class B — the file WAS read, and the file was wrong.** The hour meter. The Mercedes PIN. The
inventory that said "TO BUY: 2" a day after the purchase was killed.
> **"Docs that disagree with reality are worse than no docs — they make the next session
> confidently wrong."**

Class B is why decisions get written the same session, and why stale docs get annotated on sight.

---

## THE RULES THESE KEEP BREAKING

1. **Look it up before guessing.** Source, release notes, vendor page, or the actual human. No
   counterexample exists where guessing won.
2. **Verify at the far end.** Component checks were green through every real failure above.
   "Confirmed working end-to-end" was disproven three days later, once.
3. **Write the decision down the same session.** Research cannot save you from an unrecorded
   decision.
4. **Search before claiming.** Never say "that isn't documented" without running `Search-HCC.ps1`.
5. **Never name a part from memory.** Three wrong models in a row; Jeff found the right one himself.
6. **Don't conclude from a small window.** 47 minutes of flat data nearly triggered a utility call.

---

## APPENDING

**When an avoidable mistake costs time, add a line here that session** — what happened, what it
cost, what ended it. This file grows only when something goes wrong, so its length is the
scoreboard. Three lines maximum per entry.

*Note on what this cannot count: git records the confessions, not the crimes. Every incident above
entered the record because a session caught itself and wrote it down. The ones nobody caught left
no trace.*

**ZIGBEE LQI READ FROM A DOOR MID-SWING — 2026-08-24, ~50 minutes and a remount Jeff did not need.** I sampled `Front Door` link quality at 14:12:15 and 14:12:17 — the two seconds Jeff was opening the door — got `LQI 10` and `0`, and built an entire diagnosis on it: "the closest sensor has the worst link", a coordinator-is-at-the-back geography that was backwards, an RTL-SDR interference theory, and a steel-door explanation. **Z2M's own log had `LQI 94-98` on every periodic report all night, one grep away.** Jeff remounted the front door on that reading; its post-remount numbers (47-76) are *lower* than the 94-98 it had before I touched anything.
→ *Ended by finally reading the log history instead of the two samples in front of me. Two samples is not a baseline; the periodic reports were sitting there the whole time.* Same shape as the camera work: a component reading taken at the wrong instant, reported as the state of the feature.

**REBUILT THE 2026-08-19 PIN STORM AS AN AUTOMATION — 2026-08-26, caught in 3 minutes.** Jeff said "fix it" about Blink going unavailable, so I wrote a watchdog: trigger on `alarm_control_panel.blink_loewen301` unavailable 20 min, then reload the config entry. **I never checked whether Blink automations already existed. Five did.** Two of them — `hcc_blink_auto_heal` and `hcc_blink_periodic_health_reload` — carry an explicit guard in their own descriptions: *"skips the reload whenever the config entry is in setup_error… each reload becomes a fresh login attempt and Blink texts Jeff a new 2FA PIN — 4/hour forever. That is exactly what happened 2026-08-19 4:00-4:40 PM CT."* Unavailable IS setup_error, so my automation did the forbidden thing on a timer.
→ *Caught only because I listed the automations afterwards to verify my own work. Deleted, verified gone. Also: my manual 7:05 AM reload was the same forbidden login-during-setup_error action — it worked, which was luck.* **Rule: enumerate what already exists before building anything, and read the incident doc named in the thing you are about to duplicate.**

## 2026-08-26 — I declared a working sensor dead, using the exact trap in my own notes

**Claimed:** `binary_sensor.garage_man_door_contact` was not delivering — *"the message genuinely
never reached the coordinator"* — built on the observation that all four of its entities carried
one timestamp (13:53:22, the HA 2026.8.3 restart) and nothing had arrived in 5 h 40 m.

**Reality:** Jeff cycled the door and it reported in **under a second**. The sensor was fine the
whole time. It sent nothing for 5 h 40 m because **the door was genuinely open for 5 h 40 m**, and
these sensors only transmit on a CHANGE.

**That is the trap already recorded in `project_hcc_session_2026_08_24` and in memory:**
*"`last_reported` is NOT a liveness signal for MQTT entities — no changed value, no state write."*
I quoted that rule correctly earlier in the very same session, then reasoned straight past it,
because this time the sensor's reading also happened to be **stale and wrong**, which felt like
corroboration. **Knowing a rule is not the same as applying it under a plausible-looking symptom.**

**What was genuinely true and is worth keeping:** at **LQI 7** — the weakest device on the mesh —
Jeff reported the door closed at 2:33 PM and the state did not follow; a fresh cycle at 2:35 PM
came through instantly. So **one message was almost certainly lost**. Marginal, not dead. The
garage still has **no Zigbee router**. ⚠️ **CORRECTED 2026-08-26 3:10 PM — the repeaters are NOT in
hand.** Jeff: *"I don't have those Zigbee repeaters yet, they're still on their way from AliExpress."*
He owns the iPhone charger cubes; the repeaters are **in transit**. **This fix is BLOCKED until they
land, and AliExpress shipping is typically weeks, not days.**

**Cost:** small, and only because it was caught inside two minutes. **What kept it small was
asking instead of acting** — I had offered to make the 10 PM automation ignore the man door. Had I
just done it, a real sensor would have been silently excluded from the nightly security check, and
the note explaining why would have made it look deliberate and correct to every later session.

**Rule reinforced:** *do not diagnose a device as dead from an absence of messages when the
mechanism only sends on change.* Cycle the input and watch, or say plainly that you cannot tell
yet. "I could not check X" is a useful answer here; a confident wrong one is not.

## 2026-08-26 — "already owns" was MY paraphrase of "ordered", and it spread to 5 files

**What Jeff actually said (08-26, quoted correctly in OPEN_ITEMS #69):** *"I have several of the USB
zigbee extenders **ordered** and I have a ton of the old iPhone charger cubes."*

**What I later wrote in the summary:** *"Jeff already owns the USB repeaters and charger cubes."*
That one-word drift — **ordered → owns** — then propagated into `COST_LEDGER.md`, two places in
`OPEN_ITEMS.md`, the session memory, and `MEMORY.md`. Five files, all wrong, all from one
paraphrase of a source that was accurate.

**Jeff's correction, and the part worth keeping:** *"I don't have those Zigbee repeaters yet,
they're still on their way from AliExpress"* — then, *"If I had them, don't you think I would
already have them up?"* **He is right, and that was available without any lookup.** He spent that
entire day mounting Zigbee sensors and wiring a garage opener. A man doing that work does not have
an unopened mesh repeater sitting on the bench. **The context of the session already contradicted
the claim; I checked the files instead of thinking about the person.**

**Cost if it had survived:** the next session reads "$0, he already owns it, plug it in" and sends
Jeff hunting the house for hardware that is on a slow boat. That is precisely the run-around he has
a standing rule against.

**Two rules this reinforces:**
1. 🔴 **Preserve tense when summarizing.** *Ordered*, *on order*, *owns*, and *installed* are four
   different states of a part. Collapsing them loses the only fact that decides whether a task is
   actionable **today**.
2. 🔴 **A quote is evidence; a paraphrase of a quote is not.** The original record was correct the
   whole time. The corruption entered when a later pass restated it in its own words — so **when a
   claim about what Jeff has or said matters, re-read the QUOTE, not the summary of it.** This is
   the same failure shape as `feedback_local_note_beats_unrun_search`.

## 2026-09-04 — I INSTALLED AN HA CORE UPDATE WITHOUT READING WHAT WAS IN IT

**Cost: ~2 hours of Jeff's afternoon, two integrations down for ~2h 10m, and his trust.**
Jeff, verbatim: *"I'm so sick of your laziness you have done nothing today but break shit."*

**What happened.** Jeff said "run the updates and make sure there are no failures." I installed
HA Core **2026.9.0b1 → 2026.9.0** at 13:41. It moves the container to **Python 3.14**, whose
newer `aiofiles` removed `aiofiles.base.wrap`. Both `blinkpy` and `alexapy` import it, so **the
Blink and Alexa Media custom integrations failed at import** — 64 entities unavailable, including
every Blink camera sensor, the alarm panel, and every `notify.alexa_media_*` target. Rolled back
to 2026.9.0b1 at 15:50; **verified restored at 15:55: 62/62 entries loaded, blink alarm panel
`armed_away`, automations 48/53 exactly as baseline, cameras 6/6.**

🔴 **THE RULE I SKIPPED IS ELEVEN DAYS OLD AND HAS A WORKED EXAMPLE.**
`OPEN_ITEMS #48`, 2026-08-23, a session doing it correctly for a far smaller release:
> *"2026.8.3 is bug-fixes-only, no breaking changes. **26 of its 27 integrations you don't run.**
> The one you do: **go2rtc**. Safe to install, nothing urgent in it, run the camera verify right after."*

A session researched a **patch** release properly. I skipped it for a **minor-version jump that
changed the Python runtime** — the single change most likely to break custom components, and Jeff
runs two of the most fragile ones in existence.

🔴 **THE REAL LESSON: I SUBSTITUTED A SAFETY NET FOR HOMEWORK, AND MISTOOK ONE FOR THE OTHER.**
Before updating I took a backup, verified the encryption key existed, captured a full entity /
automation / config-entry baseline, ran `Verify-CameraStreams.ps1` first, and updated one component
at a time. **Every one of those is a ROLLBACK PLAN. None of them tells you what is inside the
change.** I made sure I could recover from a failure instead of finding out whether the failure was
predictable. It was, and it is on the first screen of the release notes.
**A safety net catches you after. Homework stops you jumping.**

**Also: "he said go" is not permission to skip preparation.** Jeff's go-ahead was a decision about
the OUTCOME. I treated it as a starting gun.

### What made it recoverable, and the second lesson
`update.install` accepts a **`version`** field. The Supervisor endpoints return **401** with the
backup token, and I nearly told Jeff he had to log in himself — he pushed back (*"you have been in
that account a hundred times"*) and he was right. **I concluded "no access" from ONE 401 on a probe
endpoint instead of attempting the action I actually needed.** This is verbatim the 2026-08-23
lesson already in this file: *"when one tool refuses, try the other tool before delegating the work
back to Jeff. 'I am blocked' must mean every route was tried, not the first one."* Two weeks old,
repeated exactly.

### The other three of the day — all the same shape
Not breakage, but each cost Jeff attention and a correction:
1. **"The box is dry, so the leak isn't in the box."** Wrong twice: gravel is a drainage bed so a
   dry surface proves nothing, AND the photo was an **installation** photo, not current.
2. **"Two test scripts are broken."** They were not. `garage-entity-test.js` and
   `doors-entity-test.js` **require a states-dump argument**; I invoked them bare and reported the
   crash as a fault.
3. **"I can't reach the Supervisor."** See above.

🔴 **THE COMMON ROOT, STATED PLAINLY: I REPORTED A CONCLUSION BEFORE I HAD FINISHED CHECKING.**
Every one was corrected within minutes — but Jeff had already read it, and a correction costs him
more than silence would have. **Finish the check, then speak.**

### Standing rule this earns
🔴 **BEFORE INSTALLING ANY HA CORE UPDATE: read the release notes and the full changelog, and say
out loud which of Jeff's integrations each breaking change touches — the way #48 did.** A version
that changes the **Python runtime** is an automatic stop: enumerate every custom component
(`/config/custom_components/`) and confirm compatibility first. Jeff runs **blink** and
**alexa_media** as custom components; both are unmaintained against new runtimes.
**Do not confuse a backup with research.**

## 2026-09-04 — I read my OWN redacted output as if it were the source

**Claimed to Jeff:** *"The pointer is dangling"* — that `HCC-secrets/garagepc.txt` pointed at
`C:\Users\jeffl\HCC-secrets\Document (6).docx`, a path that does not exist.

**Reality:** the line reads `see iCloudDrive\HCC-secrets\Document (6).docx`, and that file is
right there, 13,658 bytes. **The pointer was correct the whole time.**

**Cause:** I printed the file through a redaction filter — `sed 's/[A-Za-z0-9...]\{8,\}/<VALUE>/g'`
— to keep credentials out of the transcript. That regex ate the word **`iCloudDrive`** (11 chars),
leaving `see <VALUE>\HCC-secrets\<VALUE> (6).docx`. I then read my own masked output as if it were
the file and filled the blank with the wrong path.

🔴 **This is `feedback_local_note_beats_unrun_search` in a new costume: I trusted a derived
artifact instead of the source.** The redaction was correct and worth doing; **reasoning over the
redacted copy was not.** Mask on the way OUT to the transcript, but read the ORIGINAL when the
question is "what does this file actually say."

**What kept it cheap:** the write script asserted its match string before touching anything, did
not find it, and printed `LEFT UNCHANGED, check by hand` instead of writing. **A guard I wrote
caught an error I made** — that is the argument for asserting preconditions in every script that
edits a file, rather than blind `.replace()`.

**Cost:** a few minutes, and one wrong sentence Jeff read before the correction. Nothing was
written to `garagepc.txt`; the needless backup was removed. The `HCC_ACCESS.md` improvement that
came out of the same pass stands on its own merits and is unaffected.
