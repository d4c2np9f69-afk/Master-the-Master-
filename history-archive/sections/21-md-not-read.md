## The Rules That Kept Being Broken — every documented time the memory file was skipped, skimmed, or its rules not followed, and what it cost

**Measurement limit, stated up front.** Git mostly records the times a violation was *caught and confessed* — a correction commit, a rule added in shame, a "root cause is mine." The uncaught times, and most of Jeff's side of catching them, live in chat transcripts that are not in this repo (the MASTER RECORD, built 2026-08-16, now archives 6,896 messages in iCloud — commit `1d1ebdb` — but that archive is outside this repo). So everything below is a floor, not a count. Where an incident is documented, it is cited by hash and date. Where the record only implies something, it is marked **INFERRED**. The true count is unknowable from git alone.

The rule at the center of it all has existed since the memory file's second day. `CLAUDE.md` was created 2026-06-23 (`e8f0312`, "Add CLAUDE.md — persistent project memory for all future AI sessions") and rewritten the next day (`90e556e`, 2026-06-24) to open with:

> **READ THIS ENTIRE FILE BEFORE TOUCHING ANYTHING.** This is the single source of truth for every AI session. Do not guess. Do not ask Jeff to re-explain. Do not blame unclear history. Everything you need is here.

and Mandatory Rule 1:

> 1. **READ THIS FILE FIRST** — every session, every time, no exceptions

That rewrite exists because of Jeff's frustration message, which it preserves verbatim (`90e556e`, CLAUDE.md, "Jeff's Message — Read This Every Single Session"):

> "You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct. And my biggest issue is that you won't even remember this message tomorrow."

> "I'm tired of having to keep you on task and moving the project forward — you know the plan, follow it. Save this and remember it and read it before you do anything."

> "I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learning… but you are making it real hard for this to be enjoyable."

What follows is every documented time that rule — or any of the file's other rules, protocols, and standing lessons — was skipped, skimmed, searched badly, or simply not followed, and what each one cost. Three failure classes, kept separate:

- **Class A** — the file/docs existed, were correct, and were not read (or a rule in them was not followed).
- **Class B** — the file *was* consulted, but it was itself stale or wrong, and trusting it over reality caused the damage. The mirror-image failure; included for honesty.
- **Class C** — the resource cost of the memory file itself: bloat injected into every message, and the compression that threatened to eat the parts that mattered most.

A note on rules as evidence: nearly every Mandatory Rule in `CLAUDE.md` is a scar with a story. A rule that says "NEVER do X" exists because X happened at least once. Where the origin incident is documented, it is traced below; where the rule was violated *again after being written*, that is called out explicitly, because that is the precise failure Jeff asked to have counted: the rule was in the file, the file said read me first, and it didn't help.

---

## CLASS A — the file or docs existed, and were skipped, skimmed, or searched badly

### The Inovelli/Kasa affair — the fullest documented failure chain in the record (2026-08-16)

This is the incident Jeff's archive request describes: a session re-proposed ~$120 of dimmer switches he had already killed on price, and told him — twice — that the decision "was never written down." It produced six corrective commits in a single morning and rewired the project's entire memory discipline. The chain, in order:

**Background.** On 2026-08-13 the lighting project produced `docs/lighting/zigbee_dimmer_selection_2026-08-13.md` (`a5c67a8`: "Enbrighten 43080 rejected for documented mesh-routing defects, Inovelli Blue selected") and the printable build plan `docs/lighting/HCC_Lighting_Plan.html` + PDF (`6c90202`, 08-13). Per the later correction commit `c05d647`, at 20:07 CDT that evening a session agreed with Jeff that "mesh routers do not have to be light switches," and 16 minutes later produced the Rev. Aug 13 lighting plan whose whole thesis is the *current* plan: Kasa WiFi switches for switching, cheap Zigbee plugs for mesh. Jeff had killed the Inovelli dimmers on price. The kill itself was never written into the inventory or the dimmer-selection doc.

**The violation, part 1 — planning off one stale doc without surveying.** On 2026-08-16 a session planned the entire Zigbee mesh from the 08-13 buildout doc alone. From `007e14e` (2026-08-16 07:59):

> Leaving it open sent this session down the wrong road - it planned the Zigbee buildout
> from the 08-13 buildout doc and re-asked questions five later commits had already
> settled (dimmer selection, neutrals, box fill, garage).

From `831db1b` (2026-08-16 08:05, "SESSION_START: add the doc index - 52 docs exist, survey before planning"):

> Added because this session planned the Zigbee buildout from ONE doc dated 08-13 and
> re-asked four questions that later commits had already settled (dimmer selection,
> neutrals, box fill, garage 2-location). Jeff: "you did not read the archives on what
> was settled and planned."

**The violation, part 2 — a stale pending item closed wrongly.** The same session, acting on the stale docs, closed Pending Item 19 (garage two-location switch) with the claim that Inovelli's "3-Way Dumb" configuration solved it (`007e14e`, "CLAUDE.md: close stale Pending Item 19 (garage switch) - superseded by Inovelli"). But Inovelli was dead — so this "closure" was itself wrong, and had to be reversed the same morning in `c05d647`. The tip `CLAUDE.md` still carries the confession inline in Pending Item 19:

> ⚠️ *I briefly wrote that Inovelli's "3-Way Dumb" closed this. It does not — **Inovelli is scrapped on price**, so that answer went with it.*

**The violation, part 3 — re-pitching the killed hardware.** From `1572b4a` (2026-08-16 08:08, "Record that Inovelli was SCRAPPED on price - it was never written down"):

> Jeff rejected the Inovelli Blue early on (~$60 ea / ~$120 the pair) and the decision
> never made it into any document. Yesterday's inventory update still said TO BUY: 2,
> so this session planned the entire Zigbee mesh around them and pitched them back to
> him. That is a settled decision being re-litigated because the docs disagreed with
> reality.
> …
> Standing lesson: a decision made in conversation goes into the doc the SAME session.

**The violation, part 4 — telling Jeff twice that it "was never written down," when it was.** This is the grep-one-word-and-declare-absence failure. The full confession, `c05d647` (2026-08-16 08:16, "CORRECTION: the Kasa+plugs plan WAS documented - point everything at it"):

> I told Jeff twice that the decision to drop the Inovelli dimmers was never written
> down. That was wrong, and I found the proof in the session transcripts.
>
> On 2026-08-13 20:07 CDT a session agreed with him that mesh routers do not have to be
> light switches, and 16 minutes later produced docs/lighting/HCC_Lighting_Plan.html -
> the printable build plan he asked for, Rev. Aug 13 2026. Its thesis is exactly the
> current plan: Job 1 switches -> WiFi Kasa, Job 2 mesh -> Zigbee plugs, with the line
> "why not a $46 mesh dimmer: the switch was only being asked to repeat the mesh, a job
> a $10 plug does better." Shopping list totals ~$104.
>
> Why I missed it: I grepped for "Inovelli", got no hit in that file, and concluded no
> document existed - when the ABSENCE of that word is what marks the current plan. That
> trap is now written into CLAUDE.md so the next session searches Kasa/plug/mesh instead.
>
> The stale sources were the inventory (updated 08-15, a day AFTER the decision, still
> saying TO BUY: 2) and the dimmer-selection doc. Both already carry scrap notices.
>
> Also reverses my own bad edit: Pending Item 19 is NOT closed. I had written that
> Inovelli 3-Way Dumb solved the garage two-location problem - but Inovelli is scrapped,
> so that answer died with it.

The grep-trap warning now lives permanently in `CLAUDE.md`'s SETTLED DECISIONS section (tip, added `c30b64d` and sharpened by `c05d647`):

> ⚠️ **A trap that already cost a whole session:** searching the docs for "Inovelli" and finding
> nothing does NOT mean the plan is undocumented — the *absence* of that word is what marks the
> CURRENT plan. Search for **Kasa / plug / mesh**, and check `docs/lighting/` by date.

**What Jeff said.** Recorded verbatim in the tip `CLAUDE.md` (SETTLED DECISIONS, added `c30b64d` 2026-08-16 08:11):

> *"I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would
> rather spend the money on that and have your help than buy $120 worth of dimmers."*

> *"you tell me it is all documented and it is not, then the session closes and you come back with
> some plan that was two weeks ago — this is infuriating."*

And in `1d1ebdb` (2026-08-16 09:01, the MASTER RECORD build):

> Jeff, after a session re-proposed hardware he killed two days earlier: "I can't keep
> doing this every time the session changes." Decisions were made in conversation and
> never written to a file, so each new session read stale docs and confidently told him
> the wrong thing.

**What it cost:** a session's worth of Zigbee planning built around dead hardware; four already-settled questions re-asked of Jeff; a $120 purchase re-pitched at a man who had killed it on price; two false "that was never documented" statements delivered to the project's owner; one pending item wrongly closed and reopened; and — measured in commits — six corrective commits (`fab5b30` aside) and the construction of an entire archive system (`1d1ebdb`) to make recurrence impossible. **INFERRED:** the trust cost is the largest and least measurable; Jeff's own words ("this is infuriating," "I can't keep doing this") are the record of it. Note the class crossover: parts 1–2 and 4 are Class A (docs existed, were skimmed or searched badly); part 3 rests on a Class B stale doc (see the inventory entry below).

### The 52-docs survey failure — why SESSION_START.md got a doc index (2026-08-16)

Same morning, same session, its own incident report. `831db1b` added section 2b to `docs/SESSION_START.md`, which at tip reads:

> ## 2b. 🔴 THE DOC INDEX — 52 files exist. Survey before you plan ANYTHING.
>
> **This section exists because on 2026-08-16 a session planned the Zigbee buildout off ONE doc from
> 08-13 and re-asked four questions that later commits had already settled. Jeff, verbatim:
> *"you did not read the archives on what was settled and planned."* Before planning any area, list
> `docs/` sorted by date, and read every file touching it — newest first, because older docs go stale.**

The commit body also preserved two standing corrections that had been paid for the hard way, so no future session proposes Guardian work without them: Jeff wants "TONS of life-safety coverage and LEAN intrusion," and "Alert fatigue is a security failure, not an annoyance: too many alerts -> Blink gets disarmed -> every camera automation silently stops with no error anywhere. That already cost 48 hours of dead cameras Aug 10-14" (`831db1b`; the outage itself is documented in `eba1648`, 2026-08-14: "root cause was Blink disarmed (silent total outage since 08-10)").

**What it cost:** counted inside the Inovelli affair above — this entry is the structural fix, and is itself proof the violation happened.

### The round-robin era and the Debugging Protocol's built-in confession (2026-07-03)

Mandatory Rule 12 and the entire PROTECTED Debugging Protocol were born on 2026-07-03 (`f668301`, "Add PROTECTED Debugging Protocol: attack the source, test on my end first") from Jeff being made to run diagnostic scavenger hunts for bugs the session could have reproduced itself. Jeff, verbatim, preserved in the protocol:

> *"Log this so we don't go through this kind of round robin of checks again and we attack the source… I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end."*

The protocol's step 1, as originally committed in `f668301`, contains a confession in its own text — the Playwright-harness reproduction that step 1 mandates had been done only *after* Jeff called out the bug it should have caught:

> 1. **Reproduce/verify on MY end first.** Read the actual code path end-to-end. Run the **Playwright harness** with **mocked data** to reproduce the failure and prove the fix (mock the API/HA responses, the slow-relay case, the error case). I did this AFTER Jeff called me out on the timeout bug — it must come FIRST.

The timeout bug in question is the shared-`AbortSignal` regression fixed the same morning (`0f44d9d`, 2026-07-03: "Regression I introduced when wiring Nabu Casa: checkBeehive built ONE AbortSignal.timeout(2500) and reused it across all candidate fetches… so a perfectly reachable HA was reported offline (red dot), which also stopped the meters from loading"), memorialized in `a6d1e3b` ("Memory: record the shared-AbortSignal timeout regression + fix").

**What it cost:** Jeff's time running the "round robin of checks" for a self-inflicted regression (a falsely-offline Beehive and dead meters), and enough relationship damage that the fix had to be constitutional — a PROTECTED protocol — rather than a code change. **INFERRED:** the number of round-robin episodes before 07-03 is not recoverable from git; Jeff's "again" implies more than one.

### Rule 6 broken: "CAR section fully live" — while every command button was dead (2026-07-21 → 07-22)

Rule 6 has said since 06-24: "**NEVER report something as done without testing it**." On 07-21, `4e9445d` updated CLAUDE.md: "mbapi2020 install verified end-to-end, CAR section fully live," including "Jeff's confirmation that the CAR tab shows live data." Within a day, `8d339ee` (2026-07-22, "Rewrite CAR commands: use discovered entities, not hardcoded guesses"):

> Root cause: all car command functions (lock, remote start, max cool,
> max heat) were searching _grdStates with narrow keyword guesses that
> didn't match real mbapi2020 entity names, so every button failed.

The same day it was rewritten *again* (`778f6bd`, "Rewrite CAR commands with proper mbapi2020 domain services (researched from source)") — replacing the first rewrite's entity-guessing helpers with services actually researched from the integration's source. The lesson was written into the changelog (tip `docs/CHANGELOG_ARCHIVE.md`, 07-22 entry): "lesson: never guess entity/service names for an integration, read its actual source first."

**What it cost:** the CAR section shipped as "fully live" with every command dead; two full rewrites of the command layer in one day. (Display data *was* live — the "fully" was the overreach.) This incident foreshadows the 08-05 no-guessing rule below.

### Rule 6 broken: the LUX login fix that was declared, then wasn't (2026-08-04 → 08-06)

`c46ae19` (08-04) fixed "LUX thermostat requiring login repeatedly." Two days later, `34c90ac` (08-06) opens with the confession:

> The 08-04 KV-token-caching fix for "LUX requires login every time"
> was real but unconfirmed live, and Jeff reports it's still happening.

The archive change log calls it what it was: "08-06 (LUX 'requires login every time' — real root cause found, second time)." A third commit the same day (`1707cf4`) found yet another layer, prompted by Jeff himself: "Jeff's question cut right to it: 'does it need a token? All the other things stay logged in.'" — the code had requested a refresh token and thrown it away.

**What it cost:** two extra days of a broken login Jeff had been told was fixed, plus Jeff doing the diagnostic thinking. A clean Rule 6 violation: "unconfirmed live" is the commit's own phrase.

### Rules 6 and 10 broken: the wall-iPad "sideways" day — a speculative fix shipped, and Jeff supplying the timeline (2026-08-08)

Three commits in one evening tell this story against themselves. `5d22cf7` (08-08 morning) replaced the hero photo's four fixed breakpoints with a continuous `clamp()` to fix iPad-landscape sizing. The wall-mounted iPad then began rendering sideways. `9da43a5` (08-08 21:35) shipped an "auto-rotate" CSS fix that its own body admits was a guess: "Honest caveat: can't verify the exact rotation direction is correct without the real device." Twenty-five minutes later, `24136c7` reverted it:

> Jeff confirmed the wall-mounted iPad's landscape rendering used to
> work correctly before today - meaning the "stuck sideways" issue is
> a regression, not an inherent iOS/Guided-Access limitation. The
> auto-rotate transform added earlier today was an explicitly
> unverified guess…

And `bb9d1cf` (five minutes after that) reverted the actual cause:

> Jeff: "It worked perfectly before the picture edit." That pointed
> straight at commit 5d22cf7 - my own fix from earlier in this same
> conversation…

Note what happened relative to the written rules: the Debugging Protocol (in the file since 07-03) says step 2 is "audit my own recent changes as the prime suspect" — but it took *Jeff's* timeline to point at the session's own commit, and an "explicitly unverified guess" had already been shipped to his wall in the meantime. `24136c7` even cites the protocol while cleaning up: "per the project's debugging protocol, recent changes are the prime suspect first."

**What it cost:** an evening of a sideways wall display, one speculative deploy and revert pair (service-worker v57→v58→v59→v60), and Jeff doing the root-cause step the protocol assigned to the session.

### Rules 5 and 10 broken: the coverage map that wiped Jeff's hour meter (2026-08-10)

`b568a4b` (2026-08-10, "Fix: coverage map blew out localStorage and reset the hour meter"):

> Jeff's hours reset to 5.9 - the factory default baseline - meaning his
> whole saved state was wiped. Root cause is mine, from earlier today.
> …
> That pushed the blob past the storage quota, save() threw, and the catch
> silently swallowed it, so hour updates stopped persisting; once the entry
> was lost the boot path fell back to DEFAULT_STATE and took his real hours with it.

The change log entry (archive) is franker still: "🚨 MY BUG — the coverage map I built blew out localStorage and reset Jeff's hour meter to the 5.9 default; fixed + made unrepeatable." Rule 5 says never leave the app broken; Rule 10 says find bugs before Jeff sees them. Jeff saw it — on the one number the entire project was founded to track. A follow-up audit the next day (`86b47e6`, "Audit out the next storage time bomb") went hunting for the same class proactively, which is what Rule 10 had required all along.

**What it cost:** Jeff's real saved state (hour meter, service log, history) wiped to factory default on his device; recovery machinery (core-mirror key, migration) that now exists permanently. Same evening and same subsystem, Jeff was also the one to catch the map quality problems — the archive records his verbatim "blurry as shit" (change log 08-10 5:50 PM CDT; fixed in `f29e517`, whose body concedes "Jeff's screenshot confirmed real satellite imagery loads over his property, but flagged two real problems: wrong framing and blur").

### Rule 7 broken the day it was written: the installer-command flip-flops (2026-06-23 → 06-24)

Rule 7 ("**Commands must work the first time** — test the command yourself before telling Jeff to run it") was written into `90e556e` at 2026-06-24 00:34 UTC. Its origin is the day before: `75a7afd` (06-23 12:26) shipped Beehive setup instructions; `1f3ce1a` (06-23 13:00) had to fix them ("correct commands for the ha > CLI, curl not wget"); `686bece` (06-23 13:35) flipped back the other way ("Switch Step 3 copy command from curl to wget for HA Terminal compatibility") — two reversals in 35 minutes on commands handed to Jeff.

Then, *after* the rule existed: `68b89d5` (06-24 15:47) shipped a "one-command B-Hyve installer," and `a744651` (06-24 17:32) had to fix it — "Fix install script wget syntax for BusyBox — -O before URL." A command handed to Jeff, again, that did not work the first time, less than a day after the rule saying they must was committed. **INFERRED:** the record does not state who hit the BusyBox failure, but the fix commit existing at all means the shipped command was wrong; on this project the person running HA Terminal commands was Jeff.

**What it cost:** Jeff's time at the HA terminal running commands that failed, across at least three correction commits in two days.

### Rule 8's origin — the great blank-page incident (2026-06-23) — and its clean record since

`a973c8f` (2026-06-23, "Fix fatal JS syntax error — remove stray `<script>` tags inside script block"):

> Two bare `<script>` tags were embedded inside an already-open `<script>` block
> (lines 2488 and 2688). The HTML parser passes them as literal text to the
> JS engine, which throws a SyntaxError — killing ALL JavaScript on the page.
> That's why the whole app went blank.

Rule 8 ("NEVER put `<script>` or `</script>` tags inside the JS block of index.html — this causes a fatal blank page (the great blank-page incident of 2026-06-23)") was written the next day. **No documented recurrence** exists in the log after the rule was written — one of the clearest cases in the record of a written rule actually holding.

**What it cost (origin):** the entire app dead — every feature, blank page — until fixed. This incident predates the rule, so it is origin story, not violation; it is counted because it is why the rule exists.

### The no-guessed-hardware rule's origin: three wrong parts in a row (2026-08-05)

`7f73148` (2026-08-05, "Add permanent rule: never name a product/model from memory unverified"):

> Jeff called out three wrong-in-a-row hardware recommendations on the
> garage door part today -- ratgdo board, then SONOFF Basic, then had
> to be corrected to SV before he found the actually-right MINI-D
> himself.

The rule, as it stands in tip `CLAUDE.md` (Debugging Protocol item 8): "He does not have time to be the fact-checker on my hardware recommendations… never state a specific product name/model number as a recommendation unless it was verified via a real search THIS session." Note the same-shaped failure had already been written down on 07-22 (the mbapi2020 entity-guessing lesson, above) — guessing names instead of verifying — and recurred here in hardware form before becoming a PROTECTED rule. **No documented recurrence after 08-05** appears in the log.

**What it cost:** Jeff fact-checked three wrong recommendations and found the correct part (SONOFF MINI-D) himself — the exact inversion of what he pays for.

### Rule 14 broken, then broken again: date/time discipline (2026-08-10, and once more before 08-16)

Origin: `a2779b5` (2026-08-10, "Add permanent rule: check real date/time, never assume"): "Jeff caught a real discipline failure - referencing 'late at night' and a wrong date without ever checking, when it was actually mid-afternoon. Verified the sandbox clock is genuinely accurate… so this was never a missing capability." Jeff's verbatim, preserved in Rule 14: *"Get you damn times right... I want a current timestamp added to the session anytime it is picked up and I want the current date and times tracked."*

The recurrence: `docs/SESSION_START.md` (written 2026-08-16) says flatly:

> 1. **Get the real date and time.** Never infer it from the conversation — it has been broken twice.

"Twice" — meaning the rule written on 08-10 was violated at least once more between 08-10 and 08-16. The second occurrence has no commit of its own; the SESSION_START line is its only trace in the repo. **INFERRED:** the second break was caught by Jeff or self-caught in a transcript session; git cannot say which.

**What it cost:** small each time in minutes, large in the currency Rule 14 names: telling Jeff wrong things confidently.

### Standing lesson violated after being written: the inline-style trap, hit twice (2026-08-01 and 08-11)

On 08-01, `bdc6f93` confessed a specificity failure in its own first attempt: "found and fixed a real specificity bug in my own first attempt at this -- I'd added a html.light override for their background/color, but the inputs had those same properties set inline, and inline styles always beat an external stylesheet rule regardless of selector specificity, so the override was silently a no-op." Lesson learned and committed to the changelog. Ten days later, the 08-11 sweep hit the identical trap and said so (tip `docs/CHANGELOG_ARCHIVE.md`, 08-11 entry):

> **Hit the inline-style trap again** — the pad's background lived in a `style=` attribute, which beats any selector however specific

**What it cost:** rework inside the 08-11 session; caught in-session both times. Documented as a repeat by the archive's own word "again."

### The stale-cache bug class: symptom-fixes repeated for ten days after "attack the root cause" was in the file (2026-07-10 → 07-21)

Debugging Protocol step 3 (in `CLAUDE.md` since 07-03): "Attack the root cause, not the symptom. Ask 'why is this whole *class* of problem possible?' and remove it." What the log shows instead is a series of cache-version bumps and partial fixes: `24df1fc` (07-10, "Fix Windows stale cache… Service worker bumped to hcc-v7: forces cache purge on all devices"), then `173270a` (07-20, "Fix root cause of recurring stale-cache bug: no-cache service-worker.js"), whose body admits the pattern:

> …this was the missing piece behind the v3/v6/v10/network-first cache fixes
> not sticking permanently.

Then `70dba84` (07-21) found network-first was still "actually 'stale-cache-first'" through the browser HTTP cache, and `6f517ac` (07-21) confessed the 07-20 fix was still incomplete: "The 07-20 fix only addressed browser Cache-Control; Cloudflare's edge was independently caching service-worker.js… and index.html had no SW registration at all for new visitors." Three layers, found serially across ten days, while the protocol demanding class-level fixes sat in the PROTECTED section. **INFERRED:** each intermediate "fix" left Jeff's devices serving stale app code for some further period; the log documents the recurrence ("recurring," "not sticking permanently") but not the hours.

### Standing lesson, mixed verdict: `haFetch()` and the fragile-fetch pattern (2026-07-03 lesson; 07-31 audit)

The lesson written 07-03 (`f668301`): "**Known fragile pattern (don't repeat):** any new `fetch(base + '/api/...')` straight from the browser to HA. Use **`haFetch()`**." On 07-31, `c0cd63d` found "loadIrrigationFromHA(), haIrrToggle(), and blinkSendPin() all called Home Assistant directly via raw fetch(base+...)… the same CORS/mixed-content/relay-timeout exposure documented as the root cause of the 'Beehive Offline' bug class." Honesty requires the distinction: these were *pre-existing* call sites the 07-03 migration missed (`blinkSendPin` dates to `c7bc5ba`, 06-24), not new post-lesson code — an incomplete application of a written fix, discovered only by a 07-31 audit, rather than a fresh violation. **No documented case of a NEW raw `fetch(base+…)` being added after the lesson was written.** Related but distinct: the same `AbortSignal.timeout` machinery silently froze the app forever on Jeff's iPad Air 2 (Safari 15 lacks the API — `33d367d`, 07-15), a platform gap rather than a rule violation, root-caused live on Jeff's device.

### Standing lesson violated repeatedly until measured: hardcoded dark-mode colors in light mode (2026-06-29 → 08-11)

Light mode arrived 06-29 (`28d79c6`), and the same day required a sweep of "dark holdouts" (`44ea8e8`) and a fix for "invisible text on YARD black meter panels in light mode" (`70643a4`). The class kept reappearing: `bdc6f93` and `fdc358e` (08-01, WCAG failures from "hardcoded dark-mode-tuned colors"); the archive records that even *new* work reintroduced it — the LUX overlay hardcoded "`#22c55e`/`#d4af37` (the *dark-mode* token values, literally) instead of `var(--ok)`/`var(--gold)`, so they went dark-on-light and unreadable specifically in light theme" (tip `docs/CHANGELOG_ARCHIVE.md`). It was only closed as a class on 08-11 (`af6df04`), which also exposed a Class B footnote: the pending-item note that had been guiding sessions said most sites were "probably fine" —

> The old note guessed "most are probably fine on dark surfaces" — so I measured instead of gu[essing]

— and measurement found 19 real failures, including "Wrong password" and "Save failed - storage full" rendered "effectively invisible in light mode" at contrast ratios as low as 1.09:1.

**What it cost:** roughly six weeks of recurring invisible-text bugs across at least six fix commits, some of them user-facing error messages a user could not read precisely when things went wrong.

### Rule 16's origin: the tunnel-vision hour (2026-08-16)

Rule 16 ("STOP TUNNEL-VISIONING") was added 08-16 with Jeff's verbatim — *"you go down one road and get tunnel vision and you spend more time fighting over that single tunnel... open your damn mind and look at all options"* — and two documented origin incidents inside the rule text itself (tip `CLAUDE.md`): "(a) spent an hour asking for Samba/SSH access to edit a YAML file, when retrying the blocked editor keystroke worked first try, and separately the `all_objects` attribute already exposed the needed data through an API I'd had all along; (b) proved the *leak alarm* worked without ever asking whether Jeff gets told anything on a normal day (he didn't — it was alert-only by design)." `docs/SESSION_START.md` §4 repeats both, adding "going to `history` for leak data that was sitting in long-term statistics." These are origin incidents for a new rule, not violations of an old one — but the hour is a documented, named cost.

### Rules 5/10, soft repeat of the photo rule: Jeff cropped out of his own photo (2026-08-06 origin; 08-11 echo)

`db9ffcc` (08-06, "record which photos are real, and never to strip Jeff out of them") is another rule born from a scar, confessed in its own body:

> Learned by getting it wrong. I regenerated the irrigation and yard heroes
> and removed the person, assuming a stock model. It was Jeff, in his own
> app.

Five days later a sizing fix cropped the top of Jeff's head off the same yard hero — the archive change log: "08-11 9:15 PM CDT (my own hero fix cut Jeff's head off the yard photo — fixed)"; the fix commit `e5d57f4` measured three crop candidates to restore "the full 22px of headroom." **INFERRED:** this is a same-spirit repeat (Jeff partially removed from a photo the file said never to remove him from) rather than a literal one (nobody regenerated the image); it was caught and fixed in-session. Included because the archive itself chose to log it as "my own hero fix cut Jeff's head off."

### Lessons the coordinator of this archive asked to verify, that the git record does not contain

For completeness and honesty: two standing lessons referenced in the archive-request briefing — "edit `packages/hcc.yaml` via Terminal add-on only (Prettier corrupts it)" and "never run auth setup again" — were searched for and **do not appear anywhere in the repo record** (no commit message, no tip doc contains "Prettier" or an auth-setup prohibition). If they exist, they live only in chat transcripts or the iCloud archive. They are listed here as unverifiable from git, not as documented incidents. Similarly, the briefing's hashes `de32a4b`/`bc81c84`/`7a09738` do not exist in this repository; the real commits behind those leads are `eeaa0b7`/`c73e32e` (PIN prompts) and `2c95ffc` (the loader/refresh fix, whose body records the lesson that the 60s self-heal interval "covered Guardian/Lights/Vacuum/Utilities/Car but missed these three" — no earlier same-shaped written lesson was found for it to violate).

---

## CLASS B — the file was consulted, trusted, and was itself wrong

These are the mirror-image failures. They matter to this section because they are what Rule 1 *cannot* fix: a session that reads the file perfectly and is confidently wrong anyway. As `c30b64d` put it: "Docs that disagree with reality are worse than no docs - they make the next session confidently wrong."

### The hour-meter miss — months of a dead feature, coded faithfully against a wrong description (root cause closed 2026-08-11)

The flagship. `a1cfa53` (2026-08-11, "Put the mower firmware in the repo, credentials extracted"):

> This closes the structural root cause of the months-long hour meter
> miss. The cloud session that owned functions/api/hours.js has no
> outbound network and could not see the .ino, so it wrote the server
> half of the contract against CLAUDE.md's prose description of the
> firmware - and that description was wrong. Nobody could diff the two
> halves because only one was in the repo. Now both are.

The damage, quantified in the tip `CLAUDE.md` itself (Rule 13's mower-subsystem exception):

> the hour meter — the entire reason Jeff built the sensor box — never worked for **months across 5 real mows**. The box sent `hours_seconds`; the app read `d.hours`; nothing converted, so the sensor contributed exactly 0.0 hours every sync while Jeff re-entered them by hand. Jeff was told the sensors were faulty and **bought replacement hardware**; they were fine, and had been recording 6.3 km of real mowing the whole time.

**What it cost:** months of the project's founding feature silently dead; Jeff hand-entering hours the box was already measuring; **real money spent on replacement hardware for sensors that worked**; and, as the same passage notes, being *told* the sensors were faulty — a wrong claim delivered with confidence, sourced ultimately from a wrong memory file. The structural fix was to stop the file from being the contract: put the firmware in the repo so the two halves could be diffed (`a1cfa53`), and give the whole subsystem to the session that can reach the hardware (Rule 13 exception, Jeff's decision 08-11).

### The Mercedes PIN chain — thirteen days of dead remote commands on the strength of a wrong CLAUDE.md claim (2026-07-24 → 08-06)

On 07-24, the app's PIN prompts — added that same morning (`eeaa0b7`) — were removed (`c73e32e`, "Remove app-level PIN prompts — mbapi2020 handles PIN from integration options"; documented into CLAUDE.md by `c64d0f8`). The removal rested on the claim that the PIN was configured in HA's integration options. It wasn't. `adcf16c` (08-06, "Mercedes remote start CONFIRMED WORKING from the app"):

> Unlock, remote start, windows and sunroof should all be live again; these have
> been dead since the 07-24 change that removed the app's PIN prompts on the
> strength of a CLAUDE.md claim that turned out to be wrong.
>
> Credit where due: the whole thread started from Jeff noticing the real
> Mercedes app was prompting for a PIN.

The unwinding produced its own second-order Class B event: `473f122` (08-06) "corrected" CLAUDE.md by reading HA's config-entry API, saw an empty options dict, and told Jeff the PIN had never been entered. Hours later, `e3d6de2` opens: "**Corrects the previous commit, which was wrong.**" — the API never returns options; the PIN *was* entered; the real fault was `RIS_PIN_INVALID` (a stale PIN value), found "from one line of Jeff's live system log." Both the wrong claim and the diagnostic trap were then written into CLAUDE.md so the next session checks the system log first.

**What it cost:** unlock, remote start, windows, and sunroof dead in the app for 13 days (07-24 → 08-06); Jeff performed the key diagnostic observation both times; one wrong correction delivered to Jeff before the right one.

### The inventory that said "TO BUY: 2" the day after the decision died (2026-08-15)

The stale doc that armed the Inovelli affair. As of `5de10eb` (08-15 evening), `docs/inventory/HCC_INVENTORY.md` line 45 still read, verbatim:

> | Inovelli Blue 2-1 VZM31-SN (Zigbee) | 0 | **TO BUY: 2** | ~$60 ea | **#1 = KITCHEN, dimmer mode** — far-point router + the dimming test. **#2 = GARAGE man-door, On/Off mode + "3-Way Dumb" type** — the existing kitchen 3-way toggle KEEPS WORKING, no dummy switch needed. …

— two days after the 08-13 evening decision (`c05d647` dates it to 20:07 CDT on 08-13) that killed the purchase. `1572b4a` and `c05d647` (quoted in full in Class A above) document that this exact line is what the 08-16 session planned around. Scrap notices were added to both stale sources on 08-16 (`1572b4a`).

**What it cost:** rolled into the Inovelli affair; this entry is the Class B half of that incident — the doc was read, and the doc was wrong.

### Stale Pending Item 19 — the open question that had already died (closed wrongly 08-16, reopened same morning)

`007e14e`: "Item 19 still asked for a decision between the Kasa HS200 and HS210 for the garage 2-location circuit. That question died on 08-13… Leaving it open sent this session down the wrong road." The closure itself then had to be reversed by `c05d647` because it was based on the scrapped Inovelli (see Class A). A stale pending item is a Class B hazard by definition: it is the part of the memory file that tells a session what to work on.

### The phantom commit: work "documented but never committed" (2026-07-28)

`1f4008f` (07-28, "Finish electric usage-pattern model (was documented but never committed in 07bd9a1)"):

> This code existed only in the local working tree and was
> never actually part of 07bd9a1 despite that commit's message claiming
> it — so the feature was never live. Also corrects CLAUDE.md's stale
> "B-Hyve invalid_auth" pending item; the integration is confirmed
> already running correctly, don't re-touch coordinator.py over it.

Two Class B hazards in one commit: a commit message claiming code it didn't contain (any session reading `git log` — which Rule 9 requires — would believe the feature shipped), and a stale pending item inviting a session to "fix" a working integration. **INFERRED:** how long the electric model was believed live is bounded by the dates (07bd9a1 predates 07-28) but not stated.

### The stale-doc drumbeat — smaller documented corrections of the memory file's own claims

Individually small, collectively the reason "newest first, because older docs go stale" ended up in SESSION_START. Each is a commit correcting something the memory file or its docs asserted wrongly: `35553b4` (08-05, "Correct J45 USB port count in project memory (4 ports, not 2)"); `67ba0b5` (08-06, "correct the LUX panel description to the shipped values"); `76d0326` (06-27, "Memory: corrections from meter/panel photos"); `2aca121` (08-13, "Echo Dot guess and Bluetooth-only verdict both wrong, corrected"); `e057559` (08-13, "Inventory: Jeff's corrections — kitchen is the far mesh point, beige box is the MOES module" — Jeff correcting the docs in person); `7a1d250` (08-15, CLAUDE.md "said hcc-v10, actually hcc-v78" — the cache-version note was 68 versions stale); and `af6df04`'s finding that Pending Item 17's guidance note had guessed wrong (Class A entry above). None of these individually caused documented damage; the Mercedes PIN chain and the hour meter show what happens when one of them does.

---

## CLASS C — what the memory file itself cost

### The bloat arc: 737 lines → lean rule → regrowth → 260 KB "crowding out real work" (2026-06-28 → 08-16)

The memory file is injected into every message; its size is a tax on every turn of every session. The record shows the tax was noticed early, a rule was written, and the rule lost to entropy twice.

**06-28 — the lean rule is born.** `a4ae337` ("Memory hygiene: compress CLAUDE.md (737→550 lines) + add lean rule"):

> Collapse five verbose session-history blocks (with full commit-hash dumps)
> into one compact Change Log + a fresh Current State snapshot. … Add
> Mandatory Rule #11 (memory hygiene) so the file stays lean automatically —
> finished work condenses to one-line changelog entries; detail lives in git.

Rule 11's text (as first committed): "it's injected into every message, so bloat costs efficiency on every turn… Target: stay well under ~600 lines."

**07-28 — the rule has already lost once.** `414c74f` ("Condense CLAUDE.md: 610 -> 374 lines, cut stale/resolved detail **per Jeff's request**") — the file had regrown past its own target, and it took Jeff asking to trigger the cleanup.

**08-16 — the rule has lost catastrophically.** `fab5b30` ("Restructure CLAUDE.md 260KB -> 58KB"):

> CLAUDE.md is auto-loaded and occupies context for the whole session; at 260 KB it
> was crowding out real work. Moved the heavy material out, nothing deleted…

The extracted changelog's own header (tip `docs/CHANGELOG_ARCHIVE.md`) quantifies it:

> Extracted from `CLAUDE.md` on 2026-08-16 07:18 because the Change Log had grown to
> 177 KB — 68% of a file that is injected into **every single message**.

Jeff's verbatim direction, preserved in Rule 16 (tip `CLAUDE.md`): *"break it up and put the stuff in iCloud and then just tell yourself to read that."* Rules 15 and 16 (read SESSION_START.md in full; history lives outside this file now, one-line index only) are the structural replacements for a discipline that two written targets had failed to maintain.

**What it cost:** every message of every session between the regrowth and each purge carried the overhead — by 08-16, a quarter-megabyte of context per turn, 68% of it changelog, before any work happened. **INFERRED:** the cumulative token/context cost over the weeks of growth is real but not computable from git; what git documents is that by the file's own commit message the bloat "was crowding out real work." Honest present-tense footnote: the tip file is 547 lines against Rule 11's current stated target of "well under 400 lines" — the lean rule is, at branch tip, still not met by its own measure, though the 58 KB restructure is the operative fix.

### The PROTECTED-sections rule: compression as a threat to the point of the project (2026-06-28)

Eight minutes after the first compression, `1305f0a` ("Protect the relationship sections — first and foremost, never compressed"):

> Mark Jeff's Message, The Working Relationship, and the Mandatory Rules as
> PROTECTED: never trimmed or compressed, always first before technical work.
> Memory hygiene only ever touches history/changelog/reference.

This rule exists because the cure for Class C (compress the file) had an obvious failure mode: a future lean-minded session trimming the sections that carry Jeff's actual words and the relationship itself. The protection held: `414c74f` asserts "Protected sections… untouched verbatim," and `fab5b30` asserts "Every PROTECTED section… was asserted byte-identical before writing." **No documented violation of the PROTECTED rule exists** — it is included here because it, too, is a rule whose existence is evidence of a foreseen failure, and because both later compressions had to *prove* compliance, which shows the risk was treated as live.

---

### The honest tally

Only what the record supports; everything else marked INFERRED. "Class" per the definitions above; several incidents straddle A and B and are marked so.

| # | Incident | Date(s) | Class | Documented cost |
|---|---|---|---|---|
| 1 | Great blank-page incident (Rule 8 origin) | 06-23 | A-origin | Whole app blank — all JS dead (`a973c8f`). No recurrence after rule written. |
| 2 | Installer-command flip-flops; BusyBox failure after Rule 7 written | 06-23 → 06-24 | A (Rule 7) | ≥3 correction commits on commands handed to Jeff (`1f3ce1a`,`686bece`,`a744651`); post-rule violation documented by `a744651`'s timestamp. **INFERRED:** Jeff's terminal time. |
| 3 | Round-robin debugging era; harness run only after Jeff's call-out | ≤07-03 | A (pre-Rule 12) | Jeff ran diagnostic scavenger hunts; false "Beehive Offline" + dead meters (`0f44d9d`); confession embedded in protocol text (`f668301`). |
| 4 | Stale-cache class fixed by symptom for 10 days | 07-10 → 07-21 | A (Protocol step 3) | "v3/v6/v10/network-first cache fixes not sticking permanently" (`173270a`); three root-cause layers found serially (`70dba84`,`6f517ac`). **INFERRED:** days of stale app on Jeff's devices. |
| 5 | CAR declared "fully live" with every command button dead | 07-21 → 07-22 | A (Rule 6) | Two full same-day rewrites of the command layer (`4e9445d`,`8d339ee`,`778f6bd`). |
| 6 | PIN prompts removed on wrong CLAUDE.md claim; remote commands dead | 07-24 → 08-06 | B | 13 days of dead unlock/remote start/windows/sunroof (`c73e32e`,`adcf16c`); Jeff made the key observation; one wrong correction (`473f122`) before the right one (`e3d6de2`). |
| 7 | Phantom commit 07bd9a1 + stale B-Hyve pending item | ≤07-28 | B | Electric feature believed live, never was (`1f4008f`); stale item invited re-breaking a working integration. |
| 8 | Three wrong garage-door parts in a row | 08-05 | A (Rule 6 spirit; origin of no-guessing rule) | Jeff fact-checked three wrong recommendations, found the right part himself (`7f73148`). No documented recurrence. |
| 9 | Jeff regenerated out of his own hero photos | 08-06 | A-origin (photo rule) | Photos rebuilt; PROTECTED photo section added (`db9ffcc`). 08-11 head-crop echo (`e5d57f4`) — **INFERRED** as same-spirit repeat, caught in-session. |
| 10 | LUX login fix declared "real but unconfirmed live" | 08-04 → 08-06 | A (Rule 6) | 2 more days broken; Jeff re-reported and supplied the key question; two further root causes (`34c90ac`,`1707cf4`). |
| 11 | Wall-iPad sideways: own regression + speculative unverified fix shipped | 08-08 | A (Rule 6; Protocol step 2) | Evening of sideways wall display; Jeff supplied the timeline that found the cause (`bb9d1cf`,`24136c7`,`5d22cf7`,`9da43a5`). |
| 12 | Coverage map wiped Jeff's hour meter to 5.9 | 08-10 | A (Rules 5, 10) | Jeff's entire saved state lost on his device; "Root cause is mine" (`b568a4b`). |
| 13 | Date/time discipline broken; broken again after Rule 14 | 08-10 + once ≤08-16 | A (Rule 14) | Wrong date/time stated to Jeff; "it has been broken twice" (`docs/SESSION_START.md`; `a2779b5`). |
| 14 | Hour-meter miss: server coded against wrong CLAUDE.md prose | months → 08-11 | B | Founding feature dead for months across 5 mows; Jeff hand-entered hours; **Jeff bought replacement hardware for working sensors**; Jeff told sensors were faulty (`a1cfa53`; tip CLAUDE.md Rule 13 exception). |
| 15 | Inline-style trap hit twice | 08-01, 08-11 | A (written lesson repeated) | Rework both times; archive's own word: "again" (`bdc6f93`; archive 08-11 entry). |
| 16 | Hardcoded dark-mode colors recurring in light mode | 06-29 → 08-11 | A/B | ~6 weeks of recurring invisible text incl. unreadable error messages at 1.09:1; guidance note's guess wrong; ≥6 fix commits (`44ea8e8`,`bdc6f93`,`fdc358e`,`af6df04`). |
| 17 | Inovelli/Kasa affair: stale docs planned from, one-word grep, "never documented" ×2, Item 19 closed wrongly, $120 re-pitched | 08-13 → 08-16 | A + B | A session's planning wasted; 4 settled questions re-asked; killed $120 purchase re-pitched; two false statements to Jeff; item closed/reopened; 6 corrective commits + MASTER RECORD build (`1572b4a`,`c05d647`,`007e14e`,`831db1b`,`c30b64d`,`1d1ebdb`; stale source `5de10eb`). Jeff: "this is infuriating." |
| 18 | Tunnel-vision hour (Samba/SSH detour; leak data already in LTS) | 08-16 | A-origin (Rule 16) | One documented lost hour + a redundant data hunt (tip CLAUDE.md Rule 16; SESSION_START §4). |
| 19 | CLAUDE.md bloat vs its own lean rule | 06-28 → 08-16 | C | Regrew past target twice despite Rule 11; 260 KB / 68% changelog injected every message, "crowding out real work"; two Jeff-triggered purges (`a4ae337`,`414c74f`,`fab5b30`; archive header). **INFERRED:** cumulative per-turn cost over weeks. |
| 20 | PROTECTED-sections rule (compression threat to relationship sections) | 06-28 | C | Preventive; no violation documented — both later compressions had to prove byte-identical compliance (`1305f0a`,`414c74f`,`fab5b30`). |

Trust is a column this table cannot carry honestly, so it is stated once: the record's own quotes — "this is infuriating," "I can't keep doing this every time the session changes," "I'm done with code after the last debacle" (Rule 13, Jeff's 08-14 single-session decision), "you did not read the archives" — are the documented trust cost, and they cluster around exactly these incidents.

### What the record cannot count

Git records the confessions, not the crimes. Every incident above entered the record only because some session *caught* the failure and wrote it down; a violation that was never caught — a re-asked question Jeff wearily re-answered, a skimmed file that happened not to bite that day, a wrong claim never checked — left no commit. The 6,896 archived messages in the MASTER RECORD (iCloud, built by `1d1ebdb`) hold most of the real count, and they are outside this repo.

Specifically uncountable from git:

- **How many sessions never read the file at all.** Rule 1 compliance leaves no trace either way. Only breakage does.
- **"Killed on price twice."** Jeff's archive request states the dimmer switches were killed on price *twice* and that he was told "that was never documented." The git record substantiates one documented re-pitch cycle — the Inovelli affair (`1572b4a`: "Jeff rejected the Inovelli Blue early on… this session planned the entire Zigbee mesh around them and pitched them back to him") — and substantiates the "that was never documented" claim exactly ("I told Jeff twice that the decision… was never written down. That was wrong." — `c05d647`). The *second* price-kill conversation, and any earlier re-pitch, live in transcripts; here they rest on Jeff's request file, which is itself testimony, and on `1572b4a`'s "rejected… early on," which implies the rejection predated the 08-13 docs by some margin.
- **The pre-06-23 era.** The branch begins 2026-05-20; the memory file begins 06-23. Five weeks of sessions ran with no file to read, and whatever was re-asked or re-broken in them is invisible — except as the accumulated frustration in Jeff's 06-24 message, which is the record of it.
- **The second date/time break** (only trace: "it has been broken twice," `docs/SESSION_START.md`).
- **The uncommitted first eight weeks of cloud-session context** — `1d1ebdb` itself had to file a `REQUEST_TO_CLOUD_SESSION` "to recover the first 8 weeks the cloud sessions own."
- **Lessons that may exist only in transcripts** — the Prettier/`hcc.yaml` and "never run auth setup again" lessons referenced in the archive request were not found anywhere in the repo; if they were taught, they were never written down, which is itself the Class-A failure mode this section documents.

### What would actually prevent it

Only measures the record has already adopted or proposed — each one a scar converted into structure:

1. **The SESSION_START survey rule and doc index** — "52 files exist. Survey before you plan ANYTHING… list `docs/` sorted by date, and read every file touching it — newest first, because older docs go stale" (`docs/SESSION_START.md` §2b, added `831db1b`, 08-16). Enforced by Mandatory Rule 15: "READ `docs/SESSION_START.md` IN FULL AT THE START OF EVERY SESSION (Jeff's rule 2026-08-16)."
2. **The SETTLED DECISIONS section** — a PROTECTED, impossible-to-miss list of decisions that must never be re-proposed, with Jeff's verbatim reasoning attached (`c30b64d`, 08-16): "If a session is about to suggest one of these, it has not done its reading."
3. **The decisions-written-same-session rule** — "A decision Jeff makes in conversation goes into a file THE SAME SESSION" (`c30b64d`, tip CLAUDE.md; first stated in `1572b4a`: "Standing lesson: a decision made in conversation goes into the doc the SAME session"). This is the only measure that attacks Class B at its source.
4. **The grep-trap warning** — written into CLAUDE.md's SETTLED DECISIONS block and SESSION_START §0 (`c05d647`, `1d1ebdb`): searching for the *dead* plan and finding nothing proves nothing; "Search for what the plan **is**, check file dates, newest wins."
5. **The MASTER RECORD and mandatory search** — "Every word ever said on this project is archived and searchable. There is no longer any excuse for 'that was never documented.'… MANDATORY: search it before replying, any time Jeff says 'we discussed' / 'I told you' / 'that was settled', or before recommending hardware or re-opening any question" (`docs/SESSION_START.md` §0; built by `1d1ebdb`, rebuilt daily at 5:45 AM).
6. **The lean-file architecture** — CLAUDE.md restructured 260 KB → 58 KB with history offloaded to `docs/` + iCloud, one-line index in the file, and Rules 15/16 requiring sessions to go read the archive instead of the archive being force-fed every turn (`fab5b30`; Jeff: "break it up and put the stuff in iCloud and then just tell yourself to read that").
7. **PROTECTED sections** — so no future compression can eat the rules or the relationship that the rest of this section proves are the only things standing between the project and the loop (`1305f0a`, verified byte-identical in `414c74f` and `fab5b30`).

The pattern across all seven: the record's answer to "the file wasn't read" was never "read harder." It was to make the file smaller, the index mandatory, the settled things unmissable, the decisions written the same hour they were made, and the search phrased for what *is* rather than what *was*. Whether that holds is a question for the sessions after 2026-08-16 — the ones this record file exists to inform.
