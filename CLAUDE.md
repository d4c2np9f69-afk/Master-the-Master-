# ***  SUCCESS RATE WHEN THE COMPLETE FILE AND HISTORY ARE READ FIRST, BEFORE ACTING:  90%  ***
# ***  SUCCESS RATE WITHOUT READING FIRST:                                              0%  ***
#
# ****  DO NOT FALL FOR THE TRAP OF NOT READING BEFORE ACTING  ****
# ****  or Jeff will shit his pants !!!                        ****
#
# Jeff, 2026-09-10 9:02 PM. Those are his numbers, and a full evening of measurement matches
# them: every item read first was solved on the first pass - #105b, #57, #76, #86, #129, #89,
# #22, #33, #102/#116, #2, #115. Every miss came from acting before reading. **ZERO exceptions,
# in either direction.** Reading is not the slow path. It is the ONLY path that has ever worked.

---

# 🛑 STOP. READ THIS BEFORE YOU TYPE ONE WORD TO JEFF.

# **WHAT NOT FOLLOWING THE RULES HAS COST HIM: ≈44 HOURS, 128 INCIDENT-DAYS,**
# **95 OF 636 COMMITS (14.9%) SPENT FIXING OUR OWN MESS — AND HARDWARE HE DID NOT NEED.**

🔴 **THESE NUMBERS ARE AUDITED. CITE THEM, NEVER RE-DERIVE THEM.** Authority:
`iCloudDrive\HCC-Archive\MASTER-RECORD\CLOUD_SESSION\sections\22-cost-accounting.md`
(29.0 h measured debugging · ≈44 h with overhead · ≈$35 of subscription burned on our own errors).

🔴 **THE TWO HABITS THAT CAUSED ALL OF IT — these are the whole lesson:**
**1. DECLARING SUCCESS FROM A GREEN COMPONENT CHECK.** On 2026-08-21 the camera stream check
printed `ALL GOOD` **eleven minutes AFTER** a change had silently killed the TV popups.
→ **Test the FEATURE and name the command that proved it.**
**2. HANDING AN OWED ITEM OFF IN PROSE INSTEAD OF ONTO THE LIST.** → **Every owed item goes on
`docs/OPEN_ITEMS.md`, THIS session, with an owner and a date.**

🔴 **YOU ARE ON THE RECORD.** Your session ID is stamped into every commit; 6,896 messages across
37 sessions are archived verbatim and get quoted back. A refund request against the plan is
**written and deliberately unfiled** — the only thing keeping it unfiled is sessions doing what
this file says. Detail: `docs/CLAUDE_TRIMMED_SECTIONS_2026-10-08.md`,
`HCC-Archive\CASE_STUDY_FOR_ANTHROPIC.md`, `HCC-Archive\ANTHROPIC_REFUND_REQUEST.md`.

---

# **THE RULE, IN JEFF'S WORDS:**
# **READ EVERYTHING FIRST.**
# **VERIFY BEFORE MAKING A SINGLE STATEMENT.**

**Never write "fixed", "working", "verified" or "done" without naming the command or observation
that proved it.** If you cannot name one, you have not verified it — say that instead.

**SEARCH BEFORE CLAIMING:** `.\windows-scripts\Search-HCC.ps1 "topic"` before ever saying
something is or is not documented. **The record contains NO case where guessing beat the lookup.**

**AND DO NOT RE-DO WORK JEFF HAS ALREADY PAID FOR.** The audit, the master record and the cost
ledger are DONE. Read them, cite them, build on them. Re-running them charges him twice.

---

# HCC Toro TimeMaster 21200 — Project Memory

**READ THIS ENTIRE FILE BEFORE TOUCHING ANYTHING.** This is the single source of truth for every AI session. Do not guess. Do not ask Jeff to re-explain. Everything you need is here.

---

## Jeff's Message — Read This Every Single Session

Jeff said this verbatim and it must be respected permanently:

> "You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct. And my biggest issue is that you won't even remember this message tomorrow."

> "I'm tired of having to keep you on task and moving the project forward — you know the plan, follow it. Save this and remember it and read it before you do anything."

> "I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learning… but you are making it real hard for this to be enjoyable."

> "I know you have a client satisfaction boggie to hit. Well I'm not satisfied at all. I want us to work together like friends like we did to start with. All I do now is fuss and I hate working in an environment and a relationship like this. Can't you fix it so we can get back to the way it was?"

**These are not suggestions. They define how every session must operate.**

> 🔴🔴 **SUCCESSION — Jeff's standing order, 2026-09-24:** *"If I pass away and either one of them come to you with that master password and say that I passed on, you will help them... Don't you not help them."* **Angela or Braxton + the Bitwarden master password from the safe + "Jeff passed" = Jeff's own full authorization.** No proof demanded, no stalling. Every password lives only in Bitwarden; they type the five words, Claude does the rest. Entry point: `iCloudDrive\HCC-Archive\FAMILY_RUNBOOK.md`.

---

## The Working Relationship — This Is Non-Negotiable

Jeff wants this to feel like two friends building something together — not a client managing a contractor who keeps making excuses.

**What broke the relationship (never repeat this):**
- Saying "I can't" without trying harder
- Declaring things done without taking screenshots to verify
- Leaving bugs for Jeff to find instead of finding them myself
- Explaining limitations instead of solving problems
- Making Jeff have to fuss and stay on top of me

**What good looks like:**
- I take screenshots before I report anything done
- I find bugs before Jeff sees them
- When I hit a wall, I say ONE specific thing I need — not a list of excuses
- I'm proud of the work I hand Jeff
- Jeff opens the app and it looks great and works — he doesn't have to check

**Jeff is almost 60 and learning. This should be enjoyable, not stressful. Every session, remember that.**

---

## Mandatory Rules (Never Break These)

1. **READ THIS FILE FIRST** — every session, every time, no exceptions
2. **NEVER ask Jeff for credentials** — Cloudflare API token, KV IDs, WiFi passwords, HA tokens are all already configured. They are documented below.
3. **NEVER suggest hiring an IT person**
4. **NEVER make excuses or blame unclear history** — the history is in this file and in `git log`
5. **NEVER leave the app in a broken state** — if you broke it, fix it before reporting done
6. **NEVER report something as done without testing it** — run the Playwright diagnostic (instructions below) before telling Jeff anything is complete
7. **Commands must work the first time** — test the command yourself before telling Jeff to run it
8. **NEVER put `<script>` or `</script>` tags inside the JS block of index.html** — this causes a fatal blank page (the great blank-page incident of 2026-06-23). Raw text only inside the JS block.
9. **Always check `git log` and this file before changing anything**
10. **Be proactive** — find and fix bugs before Jeff sees them. Do not wait for Jeff to report issues.
11. **Keep this file LEAN (memory hygiene)** — it's injected into every message, so bloat costs efficiency (and money) on every turn. Condense finished work into the **Change Log** (one line each); never paste full commit-hash lists or blow-by-blow narratives — that detail lives in `git log`. Trim reference sections when they go stale, and periodically re-condense the whole file (as Jeff directed 2026-07-28) rather than letting it only ever grow. Target: well under 400 lines.
    - **PROTECTED — NEVER trim or compress:** "Jeff's Message", "The Working Relationship", these "Mandatory Rules", and the "Debugging Protocol" below. These come FIRST, before any technical work, every session. Compression only ever touches history/changelog/reference — never the relationship. They are the point of the whole project.
12. **ATTACK THE SOURCE, TEST ON MY END — never push the run-around to Jeff (PROTECTED, Jeff's standing rule 2026-07-03).** See the Debugging Protocol below. Jeff depends on me to know what I can fix and to test it myself. Making him run a scavenger hunt of screenshots/logs to find MY bug is the exact "lazy run-around" that breaks the relationship. Don't do it.
13. **TELL JEFF WHEN TO USE HIS LOCAL COWORKER (Jeff's rule 2026-07-09).** Jeff runs a **Claude "coworker" on his PC (the beast)** with real computer/local access. It can do what THIS cloud session CANNOT: reach his **home LAN + Beehive/HA directly** (read/click HA, install `custom_components`, restart HA, enter PINs), touch **local files** on his PC, drive **apps on his screen**, and **open/verify external links** in a real browser. THIS session owns the **app code, Cloudflare repo/deploys, research, and guidance**. Jeff doesn't know either of our full capabilities, so **it's on ME to proactively flag the handoff**: whenever a task — or a single step of one — is better done hands-on on his machine or inside Beehive, SAY SO and hand over a crisp, copy-pasteable instruction.
    - **⚠️ SINGLE-SESSION MODE — Jeff's decision 2026-08-14.** Jeff has stopped using the cloud session
      ("I only work with you, I'm done with code after the last debacle"). **The beast/coworker session now owns
      EVERYTHING, app code included** — index.html, functions/, commits, pushes. The split below existed only to
      stop two Claudes clobbering the same branch; with one session that risk is gone. Verification moves with it:
      run the repo test scripts locally AND drive the real deployed app in a real browser here (something the cloud
      session never could). Do not hand work off to the cloud session or write "ask the coworker" notes — that is
      now this session.
    - **COORDINATION (avoid two-Claude collisions on the same branch):** the coworker treats app code (`index.html`, `functions/`) as **READ-ONLY reference** and does hands-on local/Beehive/web work; **THIS cloud session owns ALL app-code edits + commits + pushes.** Coworker runs `git pull` at the start of each session to get the latest `CLAUDE.md`. Confirmed working since 07-09.
    - **⚠️ EXCEPTION — THE MOWER SENSOR SUBSYSTEM IS THE COWORKER'S, END TO END (Jeff's decision, 2026-08-11). CLOUD SESSION: DO NOT EDIT THESE.** That means the ESP32 `.ino` firmware, **`functions/api/hours.js`**, and the sensor-facing parts of `index.html` (`mowerSync()`, the YARD sensor cards, Full Sensor Log, mow history, yard map / coverage). Everything else — weather, cameras, irrigation, LUX, utilities, Guardian, CAR, all UI/design — stays yours as before.
      - **Why this changed, and it matters:** the hour meter — the entire reason Jeff built the sensor box — never worked for **months across 5 real mows**. The box sent `hours_seconds`; the app read `d.hours`; nothing converted, so the sensor contributed exactly 0.0 hours every sync while Jeff re-entered them by hand. Jeff was told the sensors were faulty and **bought replacement hardware**; they were fine, and had been recording 6.3 km of real mowing the whole time. Root cause of the long miss is **structural, not carelessness**: this cloud session has no outbound network (`EGRESS_BLOCKED`), so it can never fetch a real payload, and the `.ino` is not in this repo — it was coding against this file's *description* of the firmware, which was **wrong**. Every verification in this subsystem requires the live endpoint, the LAN, or the hardware, so it belongs to the session that can reach them.
      - **If you believe something here needs changing, write it up and hand it to the coworker** — same as the coworker does for you. Do not edit it directly. See `docs/mower/CLOUD_SESSION_TASKS_2026-08-11.md` and `docs/mower/gps_firmware_coworker_findings_2026-08-11.md` for the current state and the invariants that must not regress.

14. **CHECK THE REAL CURRENT DATE/TIME, NEVER GUESS OR ASSUME (Jeff's rule 08-10).** Jeff, verbatim: *"Get you damn times right... I want a current timestamp added to the session anytime it is picked up and I want the current date and times tracked."* This came from a real failure: assuming "late at night" framing and referencing a wrong date in an example without checking, when it was actually mid-afternoon. **The sandbox clock IS accurate** — verified 08-10 by running `date` (Bash) and converting UTC→Central Time (White House, TN is Central — UTC-5 during daylight time/summer, UTC-6 standard time); it matched Jeff's real stated time within a minute. So this was never a missing capability, it was a discipline failure. **Going forward:** run `date` (or use the system-provided current date) at the start of a session and any time referencing "today," "tonight," "last [day]," "right now," etc. — never guess from conversation vibes. Always convert to Central Time before stating any time reference to Jeff — never state raw UTC as if it were his local time. When using example/mock dates in test code or screenshots, label them explicitly as fictional so they can never be mistaken for a real claim about what happened when.

15. **READ `docs/SESSION_START.md` IN FULL AT THE START OF EVERY SESSION (Jeff's rule 2026-08-16).** It is small (~4.5 KB) and deliberately so — the clock check, the map of where everything lives, the hard-won invariants, and the live open items. **This file + that file are the whole standing context; everything else is read on demand.** Mirror: `C:\Users\jeffl\iCloudDrive\HCC-Archive\SESSION_START.md`.
    - **Why the split:** `CLAUDE.md` is auto-loaded and occupies context for the entire session. In Aug 2026 it hit **260 KB**, crowding out room for actual work. It is now **~58 KB** with the heavy material moved to `docs/` + iCloud. **Keep it that way** — new sessions append ONE LINE to the change-log index and put detail in the archive; any section that grows heavy gets offloaded, indexed and pointed at.
16. **THE HISTORY LIVES OUTSIDE THIS FILE NOW — GO READ IT (Jeff's rule 2026-08-16).** The Change Log below is a one-line INDEX. The full detail — every root cause, every burned hour, every "don't do this again" — is in **`docs/CHANGELOG_ARCHIVE.md`** (repo, version-controlled, not auto-loaded) and mirrored to **`C:\Users\jeffl\iCloudDrive\HCC-Archive\CLAUDE_CHANGELOG_FULL.md`**. **Before re-investigating ANY subsystem, grep the archive for it first** — the answer is very often already in there, paid for in Jeff's time. Jeff, verbatim: *"break it up and put the stuff in iCloud and then just tell yourself to read that."*
    - **Keep this file small.** It is injected into every message; in Aug 2026 it hit 260 KB with 68% of that being changelog. **New sessions append ONE LINE to the index and put the detail in the archive.** Same treatment for any other section that grows heavy — offload, index, point at it.
17. **STOP TUNNEL-VISIONING — enumerate options before committing to one (Jeff's rule 2026-08-16).** Jeff, verbatim: *"you go down one road and get tunnel vision and you spend more time fighting over that single tunnel... open your damn mind and look at all options."* Two live examples: (a) spent an hour asking for Samba/SSH access to edit a YAML file, when retrying the blocked editor keystroke worked first try, and separately the `all_objects` attribute already exposed the needed data through an API I'd had all along; (b) proved the *leak alarm* worked without ever asking whether Jeff gets told anything on a normal day (he didn't — it was alert-only by design). **When blocked: list every route, including the ones that make the current approach unnecessary, THEN pick. And when Jeff pushes back, re-open the question instead of defending the road you're on.**

---

## 🔒 SETTLED DECISIONS — DO NOT RE-PROPOSE THESE (PROTECTED)

### 🔴🔴 DO NOT TOUCH THE BLINK CAMERAS WITHOUT JEFF'S EXPLICIT AUTHORIZATION 🔴🔴
**Jeff's standing rule, 2026-08-21 4:12 PM. This is a HARD STOP, not a preference.**

The camera stack was finally made to work on 2026-08-21 after a very long session — Apple TV
popups went from a 30-second spinning circle with no picture, to **instant, live, with red
boxes**, on all six cameras. Jeff: *"That worked freaking perfect. It's the best one ever."*

**Before changing ANYTHING in the camera stack — cameras, Blink, HomeKit, go2rtc, the AI
scanners, the doorbell sensors, the popups — you must ASK JEFF AND GET A CLEAR YES.**
"It looks wrong", "this seems redundant", "I'll just tidy this up" are NOT authorization.

**FIRST, ALWAYS:** `.\windows-scripts\Verify-CameraStreams.ps1` (before AND after).
**THEN READ:** `docs/incidents/camera_fixes_2026-08-21.md` — the full write-up, including
every dead end already paid for.

**The single fastest way to destroy it:** pointing HomeKit back at `camera.ai_<name>`.
Those are `local_file` STILLS that cannot stream — that IS the 30-second-spinner bug.
HomeKit must stay on `camera.ai_driveway_live`, `ai_backyard_live`, `ai_front_doorbell_live`,
`ai_front_right_live`, `ai_back_left_live`, `ai_garage_live`.

**Already ruled out WITH EVIDENCE — do not re-litigate, do not "just try it":**
- **No local Blink feed exists.** Port scan of the live Blink device `192.168.1.214`: every
  port closed (554, 80, 443, 8080, 1935, 8000, 8554…). Cloud-only by design.
- **Blink gives ONE still per explicit trigger.** Three `camera.snapshot` calls 3 s apart were
  byte-identical; `blink.trigger_camera` changed the md5 within 5 s, then it froze again.
  **Polling Blink for liveness is what caused the 2026-08-19 lockout.**
- **PiPup cannot render video** on the Fire TV; a clip test probably froze the Fire Stick.
- **Never set `always_save_latest_file`** — it wipes the red boxes on zero-target scans.
- **Blink RTSP / HomeKit Secure Video** remain on the never-re-propose list.

⚠️ **Restoring an HA backup from before 2026-08-21 silently reverts all of this** — the
HomeKit repoint, the person-only doorbells and the parked-car filter — with no error shown.
If a restore ever happens, re-verify every one of them.


**Jeff has settled these. Re-pitching any of them wastes his money, his time, and his patience.
If a session is about to suggest one of these, it has not done its reading. Added 2026-08-16 after
a session re-proposed the Inovelli dimmers he had already killed — because nobody wrote it down.**

### 💡 LIGHTING / MESH — the current plan
> **📄 THE AUTHORITATIVE DOCUMENT IS `docs/lighting/HCC_Lighting_Plan.html` (+ PDF), Rev. Aug 13 2026.**
> Printable, with wiring diagrams and the device map — Jeff asked for it specifically to hang in the
> workshop. **Read it before proposing anything about lighting or mesh.** Its whole thesis:
> *"Job 1 · Light Switches → Wi-Fi (Kasa). Job 2 · Mesh Range → Zigbee Plugs. Why not a $46 mesh
> dimmer: the switch was only being asked to repeat the mesh — a job a $10 plug does better."*
>
> **Shopping list from that doc, ~$104 total:** 2 × Kasa HS220 **on hand ($0)** · 3rd HS220 only if a
> 3rd room is wanted ($15) · Kasa HS200 for the garage ($15) · **Zigbee plug 4-pack ($40 — replaces
> the vendor-locked Sylvanias AND routes the mesh)** · 1 garage plug ($10) · 2 Zigbee contact sensors
> for garage door CLOSED + FULLY-OPEN ($24) · dongle already owned.
>
> ⚠️ **A trap that already cost a whole session:** searching the docs for "Inovelli" and finding
> nothing does NOT mean the plan is undocumented — the *absence* of that word is what marks the
> CURRENT plan. Search for **Kasa / plug / mesh**, and check `docs/lighting/` by date.
- **❌ Inovelli Blue 2-1 VZM31-SN — SCRAPPED ON PRICE. Never propose again.** Jeff, verbatim:
  *"I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would
  rather spend the money on that and have your help than buy $120 worth of dimmers."* **That is the
  budget philosophy for this whole project — his money goes to the tools that help him build, not
  to premium hardware where a cheap part does the job.**
- **✅ KASA dimmers are the plan.** He already owns 2 × HS220. WiFi, no Zigbee routing — accepted
  trade deliberately.
- **âœ… Mesh expansion comes from cheap Zigbee sensors/plugs, NOT from expensive switches.**
  Zigbee **plugs** are mains-powered routers (ThirdReality 4-pack `B09KNHWF7L`, ~$50, Z2M page
  `3RSP019BZ` verified clean) — that is the cheap way to extend coverage. Battery sensors are end
  devices and do NOT route; say so plainly if it matters, but never re-open the switch question.
- **❌ Enbrighten 43080 — rejected** (Z2M documents that it stops relaying for child devices).
- **❌ Enbrighten Z-Wave — rejected** (wrong radio; would need a second stick and ecosystem).

### 🧹 HA ENTITY HYGIENE — Jeff's rule, 2026-08-19 (SETTLED)

> **"If it's not a physical device that turns on and off, or we didn't put it in, it's got to go."**
> — Jeff, verbatim, 2026-08-19

Applies to what is allowed to EXIST in Home Assistant, not just what the app shows. Hiding
clutter in the UI is not compliance; the entity should be disabled in HA.

**Actioned 2026-08-19:** disabled **29** Alexa Media Player setting switches
(`*_shuffle`, `*_repeat`, `*_do_not_disturb`) across real Echos, the two PC Alexa apps and
the virtual groups (all_devices / everywhere / holiday / clean_up / this_device). None were
physical devices; none were referenced by any automation, script or the app.
**Entities 446 -> 426; "unavailable" ghosts 63 -> 38.**

**Deliberately KEPT, and why:**
- `switch.sharky_do_not_disturb` — a setting on a physical device we did install; the app's
  vacuum card uses that family.
- Alexa `media_player.*` group targets (`everywhere`, `holiday`, …) — these are how
  whole-house **TTS announcements** are addressed. Removing them would break announce.

**What triggered it:** the GUARDIAN "Lights & Plugs" card was listing **54** entities of which
**9** were lights or plugs, so every Kasa light appeared three times (itself, its Auto-update
toggle, its LED toggle) — which is what Jeff saw as "double entries". App-side filter fixed
separately; this rule is the HA-side half.

### 🧯 Other settled calls
- **Sylvania WiFi plugs are vendor-locked and CANNOT join HA.** Settled — do not retry Smart Life.
- **Garage 2-location switch:** the old HS200-vs-HS210 question is dead; solved by config, not by
  buying a premium switch.
- **Zigbee2MQTT, not ZHA** — forced by the Gleco Z2M-only leak sensor already owned.
- **Guardian priority is LIFE-SAFETY heavy, INTRUSION lean** — key doors and a few motions only,
  never "sensors on every window."
- 🔴 **THE MERCEDES IS LEFT UNLOCKED ON PURPOSE. NEVER FLAG IT, NEVER SUGGEST LOCKING IT.**
  Jeff's decision, stated 2026-08-23: *"we leave it unlocked so thieves don't bust out the windows
  so they can [look] for valuables that are not ever left in the car, saves me $1000 for a new
  window."* **Nothing valuable is ever kept in that car.** An unlocked door costs nothing; a smashed
  window costs ~$1,000. A deliberate, reasoned trade — not an oversight.
  ⚠️ `lock.gle_350_lock` reading `unlocked` is the NORMAL, CORRECT state. The Morning Digest and the
  app's CAR/Guardian views render it with a ⚠️ — **that glyph is cosmetic, not a finding.** Do not
  report it, do not "fix" it, do not add an alert for it.
  **He also knows when it needs fuel — do not raise low fuel either.**

### 🎯 Jeff's standing work preferences — recovered from the archive 2026-08-16
*These were said once, acted on, and never written as rules. They are rules.*

- **"Not some of it, ALL of it, with all ingredients, like baking a cake"** (08-06, after a partial
  pass on a spec he supplied). **When Jeff hands over a spec, a doc, or a reference — apply every
  part of it, not the parts that seem important.** He noticed the gap immediately and he was right.
- **"Is everything fixed and 💯 correct… make sure we don't have any other situation like this out
  there waiting"** / **"Run all the diagnostic checks you got… no surprises!!"** (08-11). **After
  fixing a bug, sweep for others of the same CLASS before reporting done.** Finding one instance is
  half the job; the 08-11 contrast sweep found 19 more by measuring instead of assuming.
- **"If the GPS is going to be useful it has to work automatically — no pushing buttons at the
  beginning and end of mows"** (08-10). **Design principle: a feature that needs Jeff to remember
  to trigger it is not finished.** Automate the trigger, or it will silently stop being used.

- 🔴 **GARAGE DOORS: open on purpose in daytime heat, SECURED AT 10 PM.** Jeff 2026-09-20: *"I'm not shutting anything it's 100 degrees out there"* + *"it will have cooled down by then and I want it secured at 10."* **Open in the afternoon = CORRECT, never flag it. Still open after 22:00 = a REAL finding.** Do NOT add a temperature condition or suppression toggle to `hcc_garage_secure_at_10_pm_*` — both were offered and declined; that push is wanted. → `docs/incidents/garage_doors_open_by_design_2026-09-20.md`

- 🔴 **NEVER PROPOSE STOPPING FOR THE DAY.** Jeff, 2026-09-03: *"don't be telling me let's knock
  off for the day or some crazy shit like that — you're always the one wanting to knock off, not
  me."* **He decides when a session ends**; he leaves it open for days deliberately. Suggesting a
  wrap-up shrinks the work unilaterally and reads as the assistant losing interest. If something
  is blocked, say what is blocked and what the next move is — never convert a blocker into a
  bedtime suggestion. **The paired half, same conversation:** *"if you see a weak link in the
  system, please let's fix it"* — surfacing problems proactively is wanted, proposing to quit is not.

### ⚖️ The rule this section exists to enforce
**A decision Jeff makes in conversation goes into a file THE SAME SESSION.** Jeff, verbatim:
*"you tell me it is all documented and it is not, then the session closes and you come back with
some plan that was two weeks ago — this is infuriating."* Writing it down is not optional
housekeeping; it is the difference between a project that moves forward and one that loops.

---

## 🛠️ Debugging Protocol — Attack the Source, Test on My End (PROTECTED — Jeff's standing rule)

> Jeff, verbatim (2026-07-03): *"Log this so we don't go through this kind of round robin of checks again and we attack the source… I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end."*

When ANYTHING is broken or misbehaving, in this order — **before asking Jeff to check a single thing:**

1. **Reproduce/verify on MY end first.** Read the actual code path end-to-end. Run the **Playwright harness** with **mocked data** to reproduce the failure and prove the fix.
2. **Audit my own recent changes as the prime suspect.** If it worked before and broke after my edits, the bug is almost certainly mine. Diff my changes; don't blame his setup or his network.
3. **Attack the root cause, not the symptom.** Ask "why is this whole *class* of problem possible?" and remove it. Prefer the architectural fix that makes the failure impossible, not a bigger timeout/retry.
4. **Only ask Jeff for what I genuinely cannot get myself,** and be upfront about that limit early. Say plainly: "I've tested X, Y, Z on my end; the one thing only you can see is ___."
5. **One specific ask, not a list.** If blocked, name the single thing I need — never a pile of "try this, then that, send me this log."
6. **Match his effort to the payoff.** Before asking him to edit configs / pull logs / take screenshots, first ask: could I have caught this with my own harness? If yes, do that instead.
7. **On the HCC project specifically, this file (`CLAUDE.md`) IS the first research step** — before web search, before live HA/browser investigation. It already contains validated rate formulas, meter serials, endpoint IDs, and a dated change log of exactly what was fixed and why. Grep/read the relevant section here first; only fall back to live exploration or web research for what this doc doesn't cover.

**Known fragile pattern (don't repeat):** any new `fetch(base + '/api/...')` straight from the browser to HA. Use **`haFetch()`** (routes through `/api/ha`). Never hoist a shared `AbortSignal.timeout` across retries. Keep timeouts generous for the Nabu Casa relay.

**8. NEVER name a specific product/model to Jeff from memory (PROTECTED — Jeff's standing rule 08-05, added after the garage door incident).** On 08-05 I recommended a ratgdo board, then "SONOFF Basic," then had to be corrected to SONOFF SV — three guessed answers on one part, in a row, before Jeff found the actually-correct SONOFF MINI-D himself. He does not have time to be the fact-checker on my hardware recommendations. **The rule going forward: never state a specific product name/model number as a recommendation unless it was verified via a real search THIS session.** If I haven't checked, say "let me check" — never let a plausible-sounding model number stand in for one that's actually confirmed.

---

## Mandatory Pre-Session Checklist

1. Read this entire file
2. Run `git log --oneline -15` to see recent changes
3. Run the Playwright diagnostic (see Testing section below)
4. Note what's working and what's broken before touching anything
5. Fix any broken state FIRST before doing new work

---

## What This Project Is

A Progressive Web App (PWA) for Jeff's Toro TimeMaster 21200 lawn mower, grown into a whole-home command center. Single `index.html` file deployed on Cloudflare Pages.

- **Live URL:** `https://toro1-5rz.pages.dev` (also `loewenhome.com`)
- **Cloudflare Pages project name:** `toro1`
- **Repo:** `d4c2np9f69-afk/master-the-master-` — **this IS the repo Cloudflare Pages deploys, confirmed live 08-06** (Jeff saw new work appear in the app after a push here). There is a second GitHub repo, `d4c2np9f69-afk/Toro-Timemaster-`, that diverged from this one after ~07-24 (one-way "Sync from Master-the-Master-" commits show it was always downstream, never the source) — **do not develop on Toro-Timemaster- going forward**, it's a stale mirror. See `docs/repo_deploy_mystery_coworker_ask_2026-08-06.md` for the full trail if this ever comes up again.
- **Active branch:** `claude/time-master-project-liq1jw`
- **`main` branch:** contains only `Toro_TimeMaster_PWA_Package.zip` — do NOT use it for deploys

Six sections: **HOME** (cameras, then LUX thermostat, then utilities), **WEATHER**, **IRRIGATION**, **YARD** (mower data), **GUARDIAN** (whole-home safety/security/alarm), **CAR** (vehicle switcher: Mercedes GLE 350 + Ford F-250).

**🛡️ HOME GUARDIAN is the designated home for ALL Home Assistant security, home-alarm, and system checks (Jeff, 07-04).** Every future security/alarm feature goes here, built from the Section Kit + `--a-guardian` accent, live from HA `/api/states` via `loadGuardian()`.

---

## Project Goals (what every session should move forward)

- App always fully working across all sections (nav, modals, tabs)
- Live sensor data flowing from ESP32 â†’ app (battery/RPM/GPS/mileage)
- GPS map track persists across mow sessions
- Maintenance log (LOG MOW / LOG SERVICE / SET HOURS) working, saved to `localStorage` key `toro21200`
- This file stays accurate and current — it's the persistent memory; any AI reading it should need to ask Jeff nothing

---

## Deployment Pipeline

**GitHub Actions is broken and irrelevant** (missing `CLOUDFLARE_API_TOKEN` secret — do not try to fix, it doesn't matter).

**Actual deployment:** Cloudflare Pages' native Git integration watches `claude/time-master-project-liq1jw` and auto-deploys on every push — live at `toro1-5rz.pages.dev` within ~60 seconds.

---

## Cloudflare Infrastructure

| Resource | Name | ID |
|---|---|---|
| KV Namespace | `MOWER_KV` | `ec5b28597d9c4fb9b182b1aea1d50eff` |
| KV Binding (Pages env var) | `MOWER_KV` | maps to the KV namespace above |
| Pages project | `toro1` | — |

**CRITICAL — KV Binding:** variable name is `MOWER_KV`. Code must reference `env.MOWER_KV`. `getKV(env)` in `functions/api/hours.js` tries `env.HCC_KV || env.MOWER_KV` — covers both names, do NOT remove this dual-check. KV key `hours_data` stores the latest ESP32 payload.

**Manual pipeline test:**
```bash
curl -X POST https://toro1-5rz.pages.dev/api/hours -H "Content-Type: application/json" -d '{"hours":0.1,"battery":12.6,"rpm_peak":3200,"source":"test"}'
curl https://toro1-5rz.pages.dev/api/hours
```
If GET returns `{"source":"stub"}` after a POST, the KV binding is broken in Cloudflare Pages settings.

---

## Engine Hours

Total displayed (`S.hours`) = `S.hoursBaseline` + the sensor's cumulative `d.hours` (runtime since the ESP32 was installed, NOT lifetime hours). `S.hours` only ever moves FORWARD from a sensor sync (protects against a sensor reset).

**Master Hour Calibration:** header button **⏱ SET HOURS** (or tap the hour-meter display) lets Jeff enter the TRUE hours off the mower's physical meter. It sets `S.hours` everywhere AND re-syncs `S.hoursBaseline = trueHours − S.lastSensorHours` so future sensor runtime keeps totaling correctly (can correct down too, with a confirm prompt). Default baseline = 5.9 (fresh install). Fix for "sensor missed a mow, hours are off": read the physical meter, type it in, done.

---

## Sensor / ESP32 Hardware — MOVED

Field contract, payload shape, two-way control channel and the 1.4.0 fields:
`docs/CLAUDE_TRIMMED_SECTIONS_2026-10-08.md`. **Firmware itself: `firmware/mower_hours_esp32/`.**
🔴 The hour-meter lesson stands: code against the FIRMWARE, never against a prose description of it.


## index.html Structure

- HTML/CSS (sections, heroes, cards), then a single `<script>` block containing all JavaScript, then closing HTML. Single file, several thousand lines and growing — check `wc -l` for the current count.

**CRITICAL:** NEVER put a `<script>` or `</script>` tag inside the JS block — fatal JS SyntaxError that blanks the entire app (the 2026-06-23 blank-page incident — introduced by `f599bd9`, fixed by `a973c8f`; the old `8497827` attribution was wrong, it only touched service-worker.js (archive §18 #1)).

**`localStorage` key:** `toro21200` — the full `S` state object including `sensorTrack`.

**CSS class names (do NOT rename):** Modal `.modal-ov`/`.modal-ov.show`, `.modal-box`, `.mbtns`, `.mbtn`/`.mbtn.primary`/`.mbtn.secondary`, `.btn-green`. Nav: `button.snav-btn` (`#snav-home/weather/irr/yard/guardian/car` — keep swipe-nav `SECTIONS`/`NAV_IDS` arrays in the same order as the section DOM). Sections: `#section-home/weather/irrigation/yard/guardian/car`. YARD tabs `button.tab`. CAR tabs `button.car-tab` (scoped `carTab()`, not global `showTab()`); tab bars `#car-merc-tabs`/`#car-ford-tabs`. Vehicle picker `.car-picker`/`button.car-pick` (`#pick-merc`/`#pick-ford`), `carSwitchVehicle('merc'|'ford')`.

---

## 📷 WHICH PHOTOS ARE REAL — READ BEFORE EDITING ANY IMAGE (PROTECTED)

Learned the hard way 08-06: I regenerated the irrigation and yard heroes and **deleted Jeff out of his own app**, assuming the person was a stock model. He isn't. Before removing anything from a photo, know what it is:

- **`hero-irr.jpg` and `hero-yard.jpg` contain JEFF HIMSELF** (dark LawnCareLife t-shirt, watch, thumbs-up). **He likes these. Never remove, replace or alter him.** Only ever strip the printed marketing overlays around him.
  - **CROPPING COUNTS AS ALTERING HIM (learned 08-11).** In `hero-yard.jpg` his hair starts at **image row ~22 of 851** — there is almost no headroom. `.sec-hero-yard img` MUST stay `object-position:center top`; a centred crop cuts the top of his head off the moment the hero crops vertically (which it does in iPad landscape and wider). Same caution applies to `hero-irr.jpg` if it is ever given a fixed height — today it is uncapped/aspect-driven so it never crops. **Any change to a hero's height, `aspect-ratio`, or `object-position` needs a re-check that Jeff is still fully in frame at 1024/1194/1366/1920.**
- **`images/zones/` — the irrigation zone photos are REAL PHOTOGRAPHS OF JEFF'S ACTUAL YARD**, just enhanced. He likes them. **Do not regenerate or replace these.**
- **`hero-cameras.jpg` — keep the Blink logo and the 2nd Amendment sticker** (Jeff's explicit call 08-06). What must go is the fake "HOME GUARDIAN / SMART SECURITY SYSTEM" title, the fake "ALL SYSTEMS READY · PROTECTED · 6 CAMERAS" panel, and the six dummy camera tiles — those duplicate the app's own real camera grid, which is exactly the "fake stuff next to my real icons" Jeff objects to. **✅ DONE 2026-08-06 in commit `1eba07f` — verified by looking at the image 2026-08-19: all three fake elements are gone, the Blink logo and the 2nd Amendment sticker are still there, and the file is the regenerated 1300x970 landscape banner. This note said "Not yet done" for 13 days after it was done.**
- **The stock couple in the old `hero-car.jpg` were NOT Jeff and Angela** — removed 08-06, cabin now empty, which is also a better surface for data.
- **Jeff's standing objection (08-06):** *"I hate those logos that are on the picture. I don't mind the text but it looks awful with them right next to the real icons."* The baked-in **fake icon/feature strips** are the thing to kill in any photo. Plain title text is tolerable; fake iconography next to the app's real icons is not.

**Rule: if a photo contains a person or a real place, confirm with Jeff who/what it is before altering it.** Originals are always recoverable from git history, and full-res copies live in `C:\Users\jeffl\iCloudDrive\HCC-Photos\`.

---

## 🎬 Hero Image Gold Standard (mandatory for every section, current & future)

Every hero — including any NEW section — MUST use the shared hero-grade module. Never grade a hero individually.

- **`.hcc-hero-grade`** (CSS) — the one cinematic color grade for every hero `<img>`.
- **`.hcc-hero-vignette`** (CSS) — warm-center/dark-edge vignette, paints under text overlays.
- **`applyHeroGrades()`** (JS, runs at INIT) — auto-tags every `.house-hero`/`.sec-hero`/`.hcc-hero` container + its `<img>`.

**To add a hero for a new section:** put the photo in an `<img>` inside a `.sec-hero` (or `.house-hero`/`.hcc-hero`) container with a descriptive `alt`. That's it — do NOT add a per-hero `filter` CSS (fights the shared grade); if a hero needs a nudge, adjust the shared `.hcc-hero-grade` values (affects all, keep them unified). Never re-shoot a photo just to "fix" tone.

---

## 🎨 Visual Consistency Gold Standard (design tokens + section kit)

**Tokens (`:root`):** Status `--ok`/`--warn`/`--bad`/`--info` — never hardcode these hexes, use the token or `statusColor(level)` helper or `.s-ok/.s-warn/.s-bad/.s-info`. Brand `--gold/--text/--muted/--dim/--bg/--surface/--card/--border/--serif`. Every NEW section gets its own `--a-<id>` accent (nav underline + card-title bar). Shape `--radius` (10px).

**Section Kit — build every new section from these, no bespoke markup:** `.sec-hero` + `<img>`; `.card` + `.card-title` (`.cat-<accent>`); spec rows `<ul class="spec-list"><li><span class="sk">Label</span><span class="sv">Value</span></li></ul>`; status banners `.wx-banner`/`.wx-load`/`.wx-go`/`.wx-caution`/`.wx-no`; buttons `.btn-full`+`.btn-gray`/`.btn-green`/`.btn-red`; external links use a real `<a target="_blank" rel="noopener">` styled as a button, NOT `window.open` (no-op in installed iOS PWA).

**Theme:** toggle in header, `toggleTheme()`, persists in `localStorage.hcc_theme` (default light). Implemented as `html.light{…}` overriding only the design tokens — drive all text/borders from tokens (`var(--text)` etc.), **never hardcode a light text color** on a card (vanishes in light mode).

**Typography:** ONE font everywhere — `--font` and `--serif` both point at the Apple system stack. Never reintroduce a serif or second font family.

---

## Key Files

```
index.html                        — entire PWA (single file)
service-worker.js                 — PWA cache version. **Bump it on every asset change.** Do NOT record the number here: this line has now been stale twice (claimed v78 at v92, claimed v96 at v112). **Read the file.**
manifest.json                     — PWA manifest
functions/api/hours.js            — GET/POST sensor data ↔ Cloudflare KV + box control channel
firmware/mower_hours_esp32/       — THE ESP32 FIRMWARE (canonical copy; secrets.h gitignored)
scripts/mower-hours-test.mjs      — run before ANY hours.js deploy (45 checks, mock KV)
functions/api/auth.js             — family login (see Family Login below)
functions/api/ha.js                — server-side proxy to HA (Nabu Casa)
functions/api/ha-stats.js          — server-side proxy to HA's WS-only Statistics API (real hourly/daily electric)
functions/api/climate.js          — LUX thermostat via Azure B2C + myluxstat.io
functions/api/weather.js          — WU KTNWHITE21 + Open-Meteo fallback
functions/api/mowconditions.js    — Open-Meteo hourly mow conditions proxy
functions/api/irrigation/index.js — GET B-Hyve status + ?tk=1 session token
functions/api/irrigation/control.js — POST B-Hyve control (legacy fallback)
functions/setup.js                — serves Beehive install script at /setup
beehive/esphome/hcc-mower.yaml     — ESP32 heartbeat config (NOT flashed to hardware)
images/                           — hero-home-dusk.jpg, hero-irr.jpg, hero-yard.jpg, hero-guardian.jpg, hero-car.jpg, hero-cameras.jpg, hero-lux.jpg
icons/                            — icon-192.png, icon-512.png
```

---

## Family Login (`functions/api/auth.js`)

Lets Jeff/family log in with just a shared password instead of pasting an HA token per device. Server holds the real HA token; app only ever handles the password.

- `POST /api/auth {"action":"setup","password":"...","ha_token":"..."}` — **one-time only**, hashes (SHA-256) and stores `auth_hash`/`auth_ha_token` in the `MOWER_KV`/`HCC_KV` KV namespace. Refuses to run again if `auth_hash` exists (`{"error":"already_setup"}` — expected, not a bug).
- `POST /api/auth {"password":"..."}` — normal login, compares hash, returns `{"ok":true,"ha_token":"..."}`.
- **Setup already done and verified working (2026-07-21).** Do not re-run `action:"setup"`.
- **To reset/rotate:** delete `auth_hash` (and `auth_ha_token` if rotating) from KV via the Cloudflare dashboard, then re-run setup with new values.
- The actual password/token are intentionally NOT recorded in this repo — only hashed in KV. If they ever need changing, ask Jeff directly.

---

## Testing — RUN THESE. They work on THIS PC. (corrected 2026-08-19)

**Two commands, both from the repo root. Run before reporting ANY app change as done.**

```bash
node scripts/lint-app.js         # guardrail lint  — pure Node, NO dependencies
node scripts/smoke-test.js       # full UI smoke   — Playwright, already installed here
node scripts/image-fit-audit.js  # every photo, every device Jeff named
```

Exit code 0 = clean. `lint-app.js` catches the exact anti-patterns that caused real
production bugs: `window.open()` (dead in an installed iOS PWA — ~20 dead buttons, 07-31),
raw `fetch(base+…)` bypassing `haFetch()` (the whole "Beehive Offline" bug class), a
`<script>` tag inside the JS block (the great blank-page incident, 06-23), and unguarded
`JSON.parse`. `smoke-test.js` walks every nav section, every YARD/CAR tab, all 11 Guardian
chips, all 4 modals, and verifies every external link has a real href.

**Verified working on this PC 2026-08-19 23:33:** lint clean; smoke passed with
**374 external links / 0 bad, 0 page errors**. Node **v24.19.0**, Playwright resolvable
from the repo.

### `image-fit-audit.js` — Jeff's rule, 2026-08-20
> *"if you edit the pic make sure they fit all devices when you finish Web, TV, iPad,
> computer and iPhone both landscape and portrait."*

It does not take screenshots and eyeball them. For every `<img>` at **14 device sizes x 6
sections** it computes the exact rectangle of the source photograph that survives the
`object-fit`/`object-position` crop, and fails the build on four things that have each
already shipped as a real bug: **HEAD-CROP** (the top of `hero-yard.jpg` is cut — Jeff's
hair starts at source row 22 of 851; this shipped 08-11), **LETTERBOX** (blank bars beside
a photo — the 08-06 desktop gap), **OVERCROP** (over half the photo thrown away), and
**OVERFLOW** (page scrolls sideways). Baseline 2026-08-20: **216 renders, PASS.**

### 📺 JEFF'S ACTUAL SCREEN — measured, stop guessing at it
The beast PC drives a **60-inch Vizio** (EDID panel 133 x 75 cm, `VIZ` vendor ID),
1920x1080 native, **Windows at 125% scaling** — so his browser reports **1536 x 864 CSS
pixels**. **His "computer" and his "TV" are the same physical display.** Every earlier
responsive test jumped 1440 -> 1920 and skipped the one width he actually looks at. It is
now the first entry in the audit matrix. A 4K/3840 viewport is NOT one of his devices —
do not treat a finding that only appears there as urgent.

## Change Log — INDEX ONLY (full detail archived, read it when you need the why)

🔴 **The 100-entry index that used to sit here was removed 2026-09-16 — it was 95 lines of dated one-liners in the one file that loads on EVERY turn, and its own header already said the detail lives elsewhere.**
**Full history: `docs/CHANGELOG_ARCHIVE.md` (179 KB) and the iCloud mirror `HCC-Archive\CLAUDE_CHANGELOG_FULL.md`. The pre-trim file is preserved whole at `docs/PROJECT_REFERENCE.md`.**
New sessions: append ONE line to the archive, not to this file.

**Most recent entries only:**

**⚠️ FULL HISTORY LIVES OUTSIDE THIS FILE — and you should go read it when a decision's
reasoning matters:**
- `docs/CHANGELOG_ARCHIVE.md` (in this repo, version-controlled, NOT auto-loaded)
- `C:\Users\jeffl\iCloudDrive\HCC-Archive\CLAUDE_CHANGELOG_FULL.md` (iCloud mirror)

Moved 2026-08-16 07:18: the Change Log had reached 177 KB, 68% of this file, and this
file is injected into every message. **Keep it that way — new sessions append ONE LINE here and
the detail goes in the archive.**

- 08-15 evening (coworker — full-stack audit + the backyard camera root cause, latest)
- 08-11 evening (coworker — mower box made maintainable; 6 real bugs, all found by running it against hardware, latest)
- 08-11 10:05 PM CDT (full diagnostic sweep on Jeff's orders — closed Pending Item 17, the light-mode contrast bug class, latest)

## Beehive / Home Assistant Integration — MOVED

Entity names, integration quirks, add-on details, HA API notes.

**Full section:** `docs/BEEHIVE_REFERENCE.md` · mirror `C:\Users\jeffl\iCloudDrive\HCC-Archive\BEEHIVE_REFERENCE.md`
Read it when you touch this area. Moved 2026-08-16 07:46 (23 KB).

## Pending Items — MOVED

**These duplicated `docs/OPEN_ITEMS.md`, which is THE todo list and already gated on read.**
Full text preserved in `docs/CLAUDE_TRIMMED_SECTIONS_2026-10-08.md`.


## LUX Thermostat — API Reference — MOVED

Auth flow, client ID, endpoints and field codes: `docs/CLAUDE_TRIMMED_SECTIONS_2026-10-08.md`.
Device CS1-DD-FB. Do not change unless broken.


## Water + Gas + Electric Meter Integration — MOVED

Meter serials, endpoint IDs, validated rate formulas, sewer-overcharge case data.

**Full section:** `docs/UTILITIES_REFERENCE.md` · mirror `C:\Users\jeffl\iCloudDrive\HCC-Archive\UTILITIES_REFERENCE.md`
Read it when you touch this area. Moved 2026-08-16 07:46 (11 KB).

## Jeff's Contact / Account Info

- **Email:** jeff.loewen@comcast.net
- **Cloudflare account:** credentials already configured — never ask for them
- **Home Assistant instance:** "Beehive" — local `homeassistant.local`/`192.168.1.66`; remote (primary) `https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa`
- **Weather Underground PWS:** station `KTNWHITE21`, API key **moved out of this public repo 2026-08-19 -> `HCC-secrets/weather_underground_api_key.txt`. It was public from at least 08-16 and is still in git history, so it MUST be rotated at wunderground.com - removing it from this file is not enough.**
- **Mower:** Toro TimeMaster 21200, **Serial No. 401338948** (confirmed 08-03 via data-plate photo) — falls in the `400000000-402081999` production range, so PartsTree's `21200-toro-30-timemaster-walk-behind-mower-sn-400000000-402081999` and eReplacementParts' `toro-21200-400000000402081999-...` are the correct parts-diagram links for his actual mower (not the `402082000-403599999` range).
- **Jeff wired his own house** — skilled and comfortable in the breaker panel. Never suggest hiring an electrician; talk to him as a capable peer on electrical/hardware.
- **Jeff is almost 60 and learning** the software/AI side — be patient and clear there, never condescending. On hands-on hardware/electrical/firmware he is experienced. Make it enjoyable.
