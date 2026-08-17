## The Memory File — every version of CLAUDE.md and every word of Jeff it preserves

`CLAUDE.md` is the project's answer to the problem that nearly killed it: Claude forgetting everything between sessions. It was revised **274 times** on `origin/claude/time-master-project-liq1jw` between 2026-06-23 and 2026-08-16 (evidence: `git log --follow -- CLAUDE.md` on that branch returns 274 commits). This section walks that whole history: how the file was born, every Mandatory Rule as it was added, the PROTECTED mechanism, the Debugging Protocol, the coworker split and its collapse into single-session mode, the memory-hygiene compressions, the SETTLED DECISIONS section, the pick-up-here pointers — and, most importantly, **every verbatim sentence of Jeff's that any revision of the file ever preserved**, including words that were later edited or moved out of the file.

Method note: every claim below is cited to a commit hash + date (verifiable with `git -C <repo> show <hash>:CLAUDE.md`) or to a file path in the 2026-08-16 branch-tip checkout. Anything not directly evidenced is marked **INFERRED:**.

---

### 1. Birth of the file — 2026-06-23, commit `e8f0312`

> Commit subject (2026-06-23, `e8f0312`): *"Add CLAUDE.md — persistent project memory for all future AI sessions"*
> Commit body: *"Any Claude session reading this file can pick up the project cold without asking Jeff to re-explain anything."*

The first version was **197 lines / 9,338 bytes**. It opened:

> **READ THIS FIRST.** This file is the single source of truth for any AI session working on this project. Do not guess. Do not ask Jeff to re-explain. Everything you need is here.

It had only **five "Critical Rules (Never Break These)"** — the seed of what would grow to sixteen-plus Mandatory Rules:

1. **NEVER ask Jeff for credentials** — Cloudflare API token, KV IDs, WiFi passwords, HA tokens are all already configured.
2. **NEVER suggest hiring an IT person.**
3. **NEVER make excuses or blame unclear history** — read this file and the git log.
4. Commands must work the first time. Test before telling Jeff to run something.
5. When in doubt, check git log and this file before touching anything.

The rest of v1 was pure operational state: the deploy pipeline (GitHub Actions broken — missing `CLOUDFLARE_API_TOKEN`; Cloudflare Pages native Git integration is the real deploy), the KV binding (`MOWER_KV` bound as `HCC_KV`), engine hours baseline **5.9 hrs** ("Jeff's real hours as of 2026-06-22 backup"), Jeff's maintenance log ("7 entries, all dated 2026-05-31 at 3.5 hrs") and one recorded purchase — **"New Mulching Gator Blades — $31.85 — 2026-05-31"** — plus the ESP32 sensor contract and an open investigation: *"Sensor data showing dead (UNDER INVESTIGATION as of 2026-06-23)."* It also canonized the first war story: *"the great blank-page incident of 2026-06-23"* — a stray `<script>` tag inside the JS block that blanked the entire app. No Jeff quotes yet; v1 contains zero blockquotes.

---

### 2. The reckoning — 2026-06-24, commits `90e556e` and `f52b715`: Jeff's four messages, verbatim

The next day the file was **rewritten around Jeff's own words**. Commit `90e556e` (2026-06-24), *"Rewrite CLAUDE.md — comprehensive persistent memory with Jeff's rules, project plan, and full session history"*; body: *"Incorporates Jeff's verbatim frustration message as a permanent directive."* The new file opened with a section that survives byte-identical to this day:

> ## Jeff's Message — Read This Every Single Session
>
> Jeff said this verbatim and it must be respected permanently:

Followed by three quotes (first recorded 2026-06-24, `90e556e`, lines 11–15):

> "You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct. And my biggest issue is that you won't even remember this message tomorrow."

> "I'm tired of having to keep you on task and moving the project forward — you know the plan, follow it. Save this and remember it and read it before you do anything."

> "I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learning… but you are making it real hard for this to be enjoyable."

Closed with: **"These are not suggestions. They define how every session must operate."**

Later the same day, commit `f52b715` (*"Update CLAUDE.md — restore the working relationship commitment"*; body: *"Jeff asked to get back to working like friends. Added his exact message and a clear statement of what broke the dynamic and what good looks like. Every future session reads this first."*) added Jeff's **fourth message** (first recorded 2026-06-24, `f52b715`, line 17):

> "I know you have a client satisfaction boggie to hit. Well I'm not satisfied at all. I want us to work together like friends like we did to start with. All I do now is fuss and I hate working in an environment and a relationship like this. Can't you fix it so we can get back to the way it was?"

`f52b715` also added the section **"The Working Relationship — This Is Non-Negotiable"** — verbatim, and unchanged from 2026-06-24 through the 2026-08-16 tip:

> Jeff wants this to feel like two friends building something together — not a client managing a contractor who keeps making excuses.
>
> **What broke the relationship (never repeat this):**
> - Saying "I can't" without trying harder
> - Declaring things done without taking screenshots to verify
> - Leaving bugs for Jeff to find instead of finding them myself
> - Explaining limitations instead of solving problems
> - Making Jeff have to fuss and stay on top of me
>
> **What good looks like:**
> - I take screenshots before I report anything done
> - I find bugs before Jeff sees them
> - When I hit a wall, I say ONE specific thing I need — not a list of excuses
> - I'm proud of the work I hand Jeff
> - Jeff opens the app and it looks great and works — he doesn't have to check
>
> **Jeff is almost 60 and learning. This should be enjoyable, not stressful. Every session, remember that.**

These four quotes and the Working Relationship section appear **unaltered in every one of the ~270 subsequent revisions** — they were later formally locked (see §5, PROTECTED). They are the most-preserved words in the entire repository.

---

### 3. The Mandatory Rules — every rule, in order of appearance

`90e556e` (2026-06-24) replaced the five "Critical Rules" with **"Mandatory Rules (Never Break These)"**, numbered 1–10:

1. **READ THIS FILE FIRST** — every session, every time, no exceptions
2. **NEVER ask Jeff for credentials** (Cloudflare API token, KV IDs, WiFi passwords, HA tokens — already configured, documented in-file)
3. **NEVER suggest hiring an IT person**
4. **NEVER make excuses or blame unclear history** — the history is in this file and in `git log`
5. **NEVER leave the app in a broken state** — if you broke it, fix it before reporting done
6. **NEVER report something as done without testing it** — run the Playwright diagnostic before telling Jeff anything is complete
7. **Commands must work the first time** — test the command yourself before telling Jeff to run it
8. **NEVER put `<script>` or `</script>` tags inside the JS block of index.html** — fatal blank page ("the great blank-page incident of 2026-06-23")
9. **Always check `git log` and this file before changing anything**
10. **Be proactive** — find and fix bugs before Jeff sees them. Do not wait for Jeff to report issues.

`90e556e` also introduced the **Mandatory Pre-Session Checklist** (read the whole file → `git log --oneline -15` → run the Playwright diagnostic → note working/broken state → *"Fix any broken state FIRST before doing new work"*), which survives essentially unchanged at the tip.

The rules then accreted, each one earned by a specific failure:

| # | Rule (short) | Added | Commit | Trigger |
|---|---|---|---|---|
| 1–10 | The original ten (above) | 2026-06-24 | `90e556e` | Jeff's four-message reckoning |
| 11 | **Keep this file LEAN (memory hygiene)** | 2026-06-28 | `a4ae337` | File hit 737 lines; "it's injected into every message, so bloat costs efficiency on every turn… Target: stay well under ~600 lines" (later re-targeted "well under 400 lines" after the 07-28 condense) |
| 11-sub | **PROTECTED — NEVER trim or compress** (see §5) | 2026-06-28 | `1305f0a` | Fear that compression would eat the relationship sections |
| 12 | **ATTACK THE SOURCE, TEST ON MY END — never push the run-around to Jeff (PROTECTED, Jeff's standing rule 2026-07-03)** | 2026-07-03 | `f668301` | The AbortSignal-timeout "round robin" debugging incident (see §6) |
| 13 | **TELL JEFF WHEN TO USE HIS LOCAL COWORKER (Jeff's rule 2026-07-09)** | 2026-07-09 | `bec7440` | Cloud session couldn't verify links or touch HA; Jeff runs a Claude "coworker" on his PC ("the beast") |
| 13-sub | **BRIEF THE COWORKER BY CLONING THIS REPO ON THE BEAST + COORDINATION (avoid two-Claude collisions)** | 2026-07-09 | `9a34d17` | First hand-off (verifying 5 parts links) succeeded same day; coworker treats app code as READ-ONLY, cloud session owns edits/commits/pushes |
| 13-sub | **⚠️ EXCEPTION — THE MOWER SENSOR SUBSYSTEM IS THE COWORKER'S, END TO END (Jeff's decision, 2026-08-11)** | 2026-08-11 | `d18db7b` | The hour-meter debacle: sensor contributed 0.0 hours for months across 5 real mows; Jeff **bought replacement hardware** for sensors that were fine (see §7) |
| 13-sub | **⚠️ SINGLE-SESSION MODE — Jeff's decision 2026-08-14** | 2026-08-14 | `46c7450` | Jeff: "I only work with you, I'm done with code after the last debacle" — the beast session now owns everything (see §7) |
| "8." (Debugging-Protocol appendix) | **NEVER name a specific product/model to Jeff from memory (PROTECTED — Jeff's standing rule 08-05)** | 2026-08-05 | `7f73148` | The garage-door incident: three guessed part names in a row (ratgdo → "SONOFF Basic" → SONOFF SV) before Jeff found the correct SONOFF MINI-D himself |
| 14 | **CHECK THE REAL CURRENT DATE/TIME, NEVER GUESS OR ASSUME (Jeff's rule 08-10)** | 2026-08-10 | `a2779b5` | Claude assumed "late at night" and used a wrong date when it was actually mid-afternoon |
| 15 | **READ `docs/SESSION_START.md` IN FULL AT THE START OF EVERY SESSION (Jeff's rule 2026-08-16)** | 2026-08-16 | `fab5b30` | The 260 KB context crisis (see §8) |
| 16 | **THE HISTORY LIVES OUTSIDE THIS FILE NOW — GO READ IT (Jeff's rule 2026-08-16)** | 2026-08-16 | `fab5b30` | Same restructure; Change Log became a one-line index pointing at `docs/CHANGELOG_ARCHIVE.md` |
| 16 (duplicate number) | **STOP TUNNEL-VISIONING — enumerate options before committing to one (Jeff's rule 2026-08-16)** | 2026-08-16 | `fab5b30` | An hour lost asking for Samba/SSH when retrying a blocked editor keystroke worked first try |

Notable numbering quirks, preserved in the file as of the tip:
- The product-name rule is numbered **"8."** but sits *underneath* the Debugging Protocol (it visually continues the protocol's 1–7 numbered steps), not in the Mandatory Rules list. Evidence: tip `CLAUDE.md` (~line 150) and `7f73148` diff.
- There are **two rules numbered 16** at the tip (`fab5b30` added both "THE HISTORY LIVES OUTSIDE THIS FILE" and "STOP TUNNEL-VISIONING" as 16). Nobody has renumbered them. Evidence: tip `CLAUDE.md` lines ~119–122.

Full text of the two most consequential late rules, verbatim from the tip:

Rule 14 (added `a2779b5`, 2026-08-10):

> **CHECK THE REAL CURRENT DATE/TIME, NEVER GUESS OR ASSUME (Jeff's rule 08-10).** Jeff, verbatim: *"Get you damn times right... I want a current timestamp added to the session anytime it is picked up and I want the current date and times tracked."* This came from a real failure: assuming "late at night" framing and referencing a wrong date in an example without checking, when it was actually mid-afternoon. **The sandbox clock IS accurate** — verified 08-10 by running `date` (Bash) and converting UTC→Central Time (White House, TN is Central — UTC-5 during daylight time/summer, UTC-6 standard time); it matched Jeff's real stated time within a minute. So this was never a missing capability, it was a discipline failure.

Rule 16-bis (added `fab5b30`, 2026-08-16):

> **STOP TUNNEL-VISIONING — enumerate options before committing to one (Jeff's rule 2026-08-16).** Jeff, verbatim: *"you go down one road and get tunnel vision and you spend more time fighting over that single tunnel... open your damn mind and look at all options."* Two live examples: (a) spent an hour asking for Samba/SSH access to edit a YAML file, when retrying the blocked editor keystroke worked first try, and separately the `all_objects` attribute already exposed the needed data through an API I'd had all along; (b) proved the *leak alarm* worked without ever asking whether Jeff gets told anything on a normal day (he didn't — it was alert-only by design). **When blocked: list every route, including the ones that make the current approach unnecessary, THEN pick. And when Jeff pushes back, re-open the question instead of defending the road you're on.**

Related standing correction outside the numbered list: **"Jeff wired his own house"** was added 2026-06-27 (`731d435`, *"Memory: Jeff wired his own house — no electrician suggestions"*), verbatim:

> **Jeff wired his own house** — he is skilled and comfortable doing his own electrical work in the breaker panel. Never suggest hiring an electrician. Talk to him as a capable peer on electrical/hardware.
> **Jeff is almost 60 and learning** the software/AI side — be patient and clear there, never condescending. But on hands-on hardware/electrical/firmware he is experienced. Make it enjoyable.

---

### 4. The PROTECTED mechanism — 2026-06-28, commit `1305f0a`

The same day the file was first compressed (see §8), a session realized compression itself was a threat to the relationship sections. `1305f0a` (2026-06-28, *"Protect the relationship sections — first and foremost, never compressed"*) added, under Rule 11:

> - **PROTECTED — NEVER trim or compress:** "Jeff's Message", "The Working Relationship", and these "Mandatory Rules". These come FIRST, before any technical work, every session. Compression only ever touches history/changelog/reference — never the relationship. They are the point of the whole project.

On 2026-07-03 (`f668301`) the list was widened to include *"and the 'Debugging Protocol' below."* The PROTECTED label was subsequently applied to Rule 12 (07-03), the product-name rule (08-05), the "WHICH PHOTOS ARE REAL" section (08-06, `db9ffcc`), and the SETTLED DECISIONS section (08-16, `c30b64d`). Every major compression commit explicitly attests compliance — e.g. `2fdef21` (07-21): *"No protected sections … touched"*; `414c74f` (07-28): *"Protected sections … untouched verbatim"*; `fab5b30` (08-16): *"Every PROTECTED section (Jeff's Message, The Working Relationship, Mandatory Rules, Debugging Protocol) was asserted byte-identical before writing."* The mechanism worked: Jeff's four messages are byte-identical from 2026-06-24 to the tip.

---

### 5. The Debugging Protocol — 2026-07-03, commit `f668301`

Born from a real fight. On 07-03 a shared-`AbortSignal.timeout` regression (documented same day in `a6d1e3b`) had Claude sending Jeff on a chain of checks instead of testing on its own end. Jeff's response became the header quote of a new PROTECTED section (first recorded 2026-07-03, `f668301`):

> Jeff, verbatim (2026-07-03): *"Log this so we don't go through this kind of round robin of checks again and we attack the source… I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end."*

The protocol as added (`f668301`), titled **"🛠️ Debugging Protocol — Attack the Source, Test on My End (PROTECTED — Jeff's standing rule)"** — "When ANYTHING is broken or misbehaving, in this order — **before asking Jeff to check a single thing:**":

1. **Reproduce/verify on MY end first.** Read the actual code path end-to-end. Run the Playwright harness with mocked data to reproduce the failure and prove the fix. ("I did this AFTER Jeff called me out on the timeout bug — it must come FIRST.")
2. **Audit my own recent changes as the prime suspect.** "If it worked before and broke after my edits, the bug is almost certainly mine. Diff my changes; don't blame his setup or his network."
3. **Attack the root cause, not the symptom.** "Ask 'why is this whole *class* of problem possible?' and remove it." The worked example: browser→HA direct calls are inherently fragile (mixed-content + CORS + relay timeouts) → the fix isn't a bigger timeout, it's the server-side `/api/ha` proxy.
4. **Only ask Jeff for what I genuinely cannot get myself** — "That's ONE look, not a chain of ten. Say plainly: 'I've tested X, Y, Z on my end; the one thing only you can see is ___.'"
5. **One specific ask, not a list.**
6. **Match his effort to the payoff.** "Could I have caught this with my own harness? If yes, do that instead."

Plus the standing footer: **"Known fragile pattern (don't repeat): any new `fetch(base + '/api/...')` straight from the browser to HA. Use `haFetch()` (routes through `/api/ha`). Never hoist a shared `AbortSignal.timeout` across retries. Keep timeouts generous for the Nabu Casa relay."**

Two later additions:
- **Step 7** (2026-07-28, `414c74f`): *"On the HCC project specifically, this file (`CLAUDE.md`) IS the first research step — before web search, before live HA/browser investigation. It already contains validated rate formulas, meter serials, endpoint IDs, and a dated change log of exactly what was fixed and why."*
- **The "8." product-name rule** (2026-08-05, `7f73148`), appended below the footer, verbatim:

> **8. NEVER name a specific product/model to Jeff from memory (PROTECTED — Jeff's standing rule 08-05, added after the garage door incident).** On 08-05 I recommended a ratgdo board, then "SONOFF Basic," then had to be corrected to SONOFF SV — three guessed answers on one part, in a row, before Jeff found the actually-correct SONOFF MINI-D himself. He does not have time to be the fact-checker on my hardware recommendations. **The rule going forward: never state a specific product name/model number as a recommendation unless it was verified via a real search THIS session.** If I haven't checked, say "let me check" — never let a plausible-sounding model number stand in for one that's actually confirmed.

---

### 6. Rule 13, the two-Claude system, the sensor-subsystem hand-over, and single-session mode

**2026-07-09, `bec7440`** — Rule 13 formalized the division of labor between the cloud session and Jeff's local Claude ("coworker" on "the beast"): the coworker can *"reach his home LAN + Beehive/HA directly (read/click HA, install `custom_components`, restart HA, enter PINs), touch local files on his PC, drive apps on his screen, and open/verify external links in a real browser"*; the cloud session owns *"the app code, Cloudflare repo/deploys, research, and guidance."* Crucially: *"Jeff doesn't know either of our full capabilities, so **it's on ME to proactively flag the handoff**… SAY SO ('this part your coworker can knock out') and hand over a crisp, copy-pasteable instruction."* Same day, `9a34d17` added the coordination sub-rule (coworker clones the repo so Claude Code auto-reads CLAUDE.md; app code READ-ONLY for the coworker; *"The coworker (Claude Code on the beast, v2.1.205+) is confirmed working — first hand-off (verifying the 5 parts links) succeeded 07-09."*).

**2026-08-11, `d18db7b`** — the exception that flipped ownership of the mower-sensor subsystem to the coworker, with the project's most expensive post-mortem written directly into the rules (verbatim from tip):

> **Why this changed, and it matters:** the hour meter — the entire reason Jeff built the sensor box — never worked for **months across 5 real mows**. The box sent `hours_seconds`; the app read `d.hours`; nothing converted, so the sensor contributed exactly 0.0 hours every sync while Jeff re-entered them by hand. Jeff was told the sensors were faulty and **bought replacement hardware**; they were fine, and had been recording 6.3 km of real mowing the whole time. Root cause of the long miss is **structural, not carelessness**: this cloud session has no outbound network (`EGRESS_BLOCKED`), so it can never fetch a real payload, and the `.ino` is not in this repo — it was coding against this file's *description* of the firmware, which was **wrong**.

(That wrong description was itself corrected on 08-11: the Sensor section now carries **"⚠️ CORRECTED 2026-08-11 by the coworker, from the REAL firmware + REAL live payloads. The description that used to sit here was wrong, and the whole server design was built on it… Do not 'restore' the old wording."** The firmware finally entered the repo the same day: `176ec08`, *"CLAUDE.md: firmware is in the repo now, and the box takes commands"* — `firmware/mower_hours_esp32/`.)

**2026-08-14, `46c7450`** — single-session mode, ending the two-Claude era (verbatim from tip):

> **⚠️ SINGLE-SESSION MODE — Jeff's decision 2026-08-14.** Jeff has stopped using the cloud session ("I only work with you, I'm done with code after the last debacle"). **The beast/coworker session now owns EVERYTHING, app code included** — index.html, functions/, commits, pushes. The split below existed only to stop two Claudes clobbering the same branch; with one session that risk is gone… Do not hand work off to the cloud session or write "ask the coworker" notes — that is now this session.

**INFERRED:** "the last debacle" most plausibly refers to the hour-meter/sensor saga culminating 08-10/08-11 (including the 08-10 coverage-map bug that blew out localStorage and reset Jeff's hour meter — changelog entry *"🚨 MY BUG — the coverage map I built blew out localStorage and reset Jeff's hour meter to the 5.9 default"*, commit `b568a4b`). The record does not state explicitly which incident Jeff meant.

---

### 7. Memory hygiene — the file's own battle with bloat (five compressions)

Size of `CLAUDE.md` at key revisions (measured via `git show <hash>:CLAUDE.md | wc`):

| Date | Commit | Lines | Bytes | Event |
|---|---|---|---|---|
| 06-23 | `e8f0312` | 197 | 9.3 KB | Born |
| 06-24 | `90e556e` | 327 | 16 KB | Rewrite around Jeff's rules |
| 06-24 | `f52b715` | 351 | 17.2 KB | Working Relationship added |
| 06-26 | `f814c01` | 507 | 28.1 KB | Session histories accreting |
| 06-28 | `a4ae337` | 551 | 35.4 KB | **Compression #1:** 737→550 lines; Rule 11 added ("stay well under ~600 lines") |
| 07-03 | `f668301` | 641 | 64.5 KB | Debugging Protocol added |
| 07-09 | `bec7440` | 652 | 85.1 KB | Rule 13 added |
| 07-16 | `5ed12f0` | 573 | 65 KB | **Compression #2:** *"Condense CLAUDE.md for coworker sync — 678→573 lines"* |
| 07-21 | `2fdef21` | 564 | 49 KB | **Compression #3:** *"Compress Change Log per file's own memory-hygiene rule (73.6KB→49.6KB)"* |
| 07-28 | `414c74f` | 374 | 32.6 KB | **Compression #4:** *"Condense CLAUDE.md: 610→374 lines, cut stale/resolved detail per Jeff's request"*; Rule 11 target dropped to "well under 400 lines" |
| 08-05 | `7f73148` | 430 | 119.7 KB | Changelog paragraphs ballooning again |
| 08-10 | `a2779b5` | 512 | 217.1 KB | GPS-saga day: entries logged with per-minute timestamps |
| 08-14 | `46c7450` | 556 | 264.6 KB | Near-peak |
| 08-15 | `7a1d250` | 560 | 268.5 KB | **Peak, ~260 KB** — "crowding out room for actual work" |
| 08-16 | `fab5b30` | 495 | 60.8 KB | **Compression #5 (the Restructure):** 260 KB→58 KB |
| 08-16 | `c05d647` (tip) | 547 | 65.2 KB | After SETTLED DECISIONS + correction |

The pattern is unmistakable: **the file's line count was policed while its byte count exploded** (07-28's 374 lines ballooned to 268 KB by 08-15 because individual changelog lines grew into multi-kilobyte paragraphs). The 08-16 restructure (`fab5b30`, *"Restructure CLAUDE.md 260KB -> 58KB"*) finally attacked bytes, not lines:

> CLAUDE.md is auto-loaded and occupies context for the whole session; at 260 KB it was crowding out real work. Moved the heavy material out, nothing deleted:
>   docs/CHANGELOG_ARCHIVE.md    179 KB  (all 98 entries verbatim; one-line index stays)
>   docs/BEEHIVE_REFERENCE.md     23 KB
>   docs/UTILITIES_REFERENCE.md   11 KB
>   docs/SESSION_START.md          4 KB  (NEW - read in full at session start)
> All mirrored to iCloudDrive\HCC-Archive\.

The restructure was Jeff's own instruction, preserved verbatim in Rule 16: *"break it up and put the stuff in iCloud and then just tell yourself to read that."* (first recorded 2026-08-16, `fab5b30`).

---

### 8. The pick-up-here pointers

Starting 2026-07-03 (`363ec81`, *"Memory: pick-up-here note for next session"*), the Pending Items list was headed by a numbered-zero item **"▶️ PICK UP HERE"** — a continuously rewritten cursor telling the next session exactly where the previous one stopped. First instance (2026-07-03, `363ec81`):

> **▶️ PICK UP HERE (07-03 EOD).** Tonight landed big: Beehive **online** in the app, water+gas meters **live & correct**, real KTNWHITE21 weather **live in HA** … **Next, right where we stopped:** (a) HA → Settings → Voice assistants → Expose → expose `Backyard Temperature` + `Backyard Humidity` … test "**Alexa, what's the backyard temperature?**" …

Subsequent updates traced in the log: `59c8749`/`8ee5658` (07-03), the 07-15 in-progress marker inside a changelog entry (`3b157b9`: *"coworker/beast session, IN PROGRESS — ▶️ PICK UP HERE … iPad Air 2 wall-display setup NOT actually finished yet — despite the entry below saying 'fully set up,' that turned out premature"*), `ebd2a3a`/`0d6c9de` (07-23, Mercedes PIN instructions), `c64d0f8` (07-24: *"Update CLAUDE.md: CAR PIN cleanup documented, pick-up-here updated"*). By the tip the explicit "PICK UP HERE" item has dissolved into the Pending Items list (items 0b, 0, 1–20 with strikethroughs for resolved ones) plus `docs/SESSION_START.md` §5 "Open items — check status, don't assume." **INFERRED:** the SESSION_START briefing functionally replaced the pick-up-here cursor after 08-16.

---

### 9. SETTLED DECISIONS — 2026-08-16, commits `c30b64d` and `c05d647`

The final structural addition, born from re-litigating a decision Jeff had already made. Commit `c30b64d` body: *"Jeff killed the Inovelli dimmers on price early on and it was never written into any file, so the inventory still said TO BUY and a later session pitched the $120 switches back at him."* The new PROTECTED section opens:

> ## 🔒 SETTLED DECISIONS — DO NOT RE-PROPOSE THESE (PROTECTED)
>
> **Jeff has settled these. Re-pitching any of them wastes his money, his time, and his patience. If a session is about to suggest one of these, it has not done its reading. Added 2026-08-16 after a session re-proposed the Inovelli dimmers he had already killed — because nobody wrote it down.**

Its contents (tip `CLAUDE.md`):
- **❌ Inovelli Blue 2-1 VZM31-SN — SCRAPPED ON PRICE. Never propose again.** With Jeff's verbatim budget philosophy: *"I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would rather spend the money on that and have your help than buy $120 worth of dimmers."* Annotated: **"That is the budget philosophy for this whole project — his money goes to the tools that help him build, not to premium hardware where a cheap part does the job."**
- **✅ KASA dimmers are the plan** (2 × HS220 already owned; WiFi, no Zigbee routing — accepted trade deliberately).
- **✅ Mesh expansion from cheap Zigbee plugs/sensors, NOT expensive switches** (ThirdReality 4-pack `B09KNHWF7L`, ~$50).
- **❌ Enbrighten 43080 rejected** (stops relaying for child devices per Z2M docs); **❌ Enbrighten Z-Wave rejected** (wrong radio).
- **Sylvania WiFi plugs are vendor-locked and CANNOT join HA. Settled — do not retry Smart Life.**
- **Zigbee2MQTT, not ZHA** (forced by the Gleco Z2M-only leak sensor already owned).
- **Guardian priority is LIFE-SAFETY heavy, INTRUSION lean.**
- The lighting plan pointer: **"THE AUTHORITATIVE DOCUMENT IS `docs/lighting/HCC_Lighting_Plan.html` (+ PDF), Rev. Aug 13 2026"** — *"Jeff asked for it specifically to hang in the workshop"* — with its thesis quoted: *"Job 1 · Light Switches → Wi-Fi (Kasa). Job 2 · Mesh Range → Zigbee Plugs. Why not a $46 mesh dimmer: the switch was only being asked to repeat the mesh — a job a $10 plug does better."* Shopping list **~$104 total** (2 × HS220 on hand $0; 3rd HS220 $15 if wanted; HS200 garage $15; Zigbee plug 4-pack $40; garage plug $10; 2 contact sensors $24; dongle owned).
- The enforcement rule, with Jeff verbatim: **"A decision Jeff makes in conversation goes into a file THE SAME SESSION."** Jeff: *"you tell me it is all documented and it is not, then the session closes and you come back with some plan that was two weeks ago — this is infuriating."*

Hours later, the **last commit on the branch** (`c05d647`, 2026-08-16, *"CORRECTION: the Kasa+plugs plan WAS documented — point everything at it"*) corrected the section's own origin story — a self-audit worth preserving in full from the commit body:

> I told Jeff twice that the decision to drop the Inovelli dimmers was never written down. That was wrong, and I found the proof in the session transcripts. On 2026-08-13 20:07 CDT a session agreed with him that mesh routers do not have to be light switches, and 16 minutes later produced docs/lighting/HCC_Lighting_Plan.html… Why I missed it: I grepped for "Inovelli", got no hit in that file, and concluded no document existed — when the ABSENCE of that word is what marks the current plan.

That trap went into the file itself: *"⚠️ A trap that already cost a whole session: searching the docs for 'Inovelli' and finding nothing does NOT mean the plan is undocumented — the absence of that word is what marks the CURRENT plan. Search for Kasa / plug / mesh, and check `docs/lighting/` by date."* `c05d647` also reversed its own bad edit: Pending Item 19 (garage two-location switch) was reopened, because *"I had written that Inovelli 3-Way Dumb solved the garage two-location problem — but Inovelli is scrapped, so that answer died with it."* (`007e14e`, the closure it reversed, was made earlier the same day.)

---

### 10. "WHICH PHOTOS ARE REAL" — the section that exists because Claude deleted Jeff from his own app

Added 2026-08-06 (`db9ffcc`, *"CLAUDE.md: record which photos are real, and never to strip Jeff out of them"*), PROTECTED:

> Learned the hard way 08-06: I regenerated the irrigation and yard heroes and **deleted Jeff out of his own app**, assuming the person was a stock model. He isn't.
> - **`hero-irr.jpg` and `hero-yard.jpg` contain JEFF HIMSELF** (dark LawnCareLife t-shirt, watch, thumbs-up). **He likes these. Never remove, replace or alter him.**
> - **`images/zones/` — the irrigation zone photos are REAL PHOTOGRAPHS OF JEFF'S ACTUAL YARD**, just enhanced. **Do not regenerate or replace these.**
> - **`hero-cameras.jpg` — keep the Blink logo and the 2nd Amendment sticker** (Jeff's explicit call 08-06).
> - **The stock couple in the old `hero-car.jpg` were NOT Jeff and Angela** — removed 08-06.
> - **Jeff's standing objection (08-06):** *"I hate those logos that are on the picture. I don't mind the text but it looks awful with them right next to the real icons."*
> **Rule: if a photo contains a person or a real place, confirm with Jeff who/what it is before altering it.**

On 08-11 (`e5d57f4`) it gained the cropping corollary after a hero fix cut Jeff's head off: **"CROPPING COUNTS AS ALTERING HIM (learned 08-11)"** — *"in `hero-yard.jpg` his hair starts at image row ~22 of 851 — there is almost no headroom… Any change to a hero's height, `aspect-ratio`, or `object-position` needs a re-check that Jeff is still fully in frame at 1024/1194/1366/1920."*

---

### 11. THE QUOTE COMPENDIUM — every verbatim Jeff quote any revision of CLAUDE.md preserved

Method: all 274 revisions of `CLAUDE.md` were dumped and every quote-bearing line deduplicated with its first-seen commit (pre-mined dump verified against `git show <hash>:CLAUDE.md` spot checks). Dates are **first recorded in CLAUDE.md**, which for changelog quotes is usually the same day Jeff said it. Quotes marked ◇ were later compressed/moved out of `CLAUDE.md` into `docs/CHANGELOG_ARCHIVE.md` (2026-08-16) — nothing below was destroyed, but only the four Message quotes, the Debugging Protocol quote, the Rule 14/16 quotes, the photo objection, and the SETTLED DECISIONS quotes still live in the auto-loaded file at the tip.

#### The founding messages (2026-06-24, `90e556e` / `f52b715`) — still in the file, PROTECTED
1. *"You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct. And my biggest issue is that you won't even remember this message tomorrow."* → produced the entire file architecture and Rules 1–10.
2. *"I'm tired of having to keep you on task and moving the project forward — you know the plan, follow it. Save this and remember it and read it before you do anything."* → produced Rule 1 and the Pre-Session Checklist.
3. *"I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learning… but you are making it real hard for this to be enjoyable."* → produced the "Jeff is almost 60 and learning" clauses throughout.
4. *"I know you have a client satisfaction boggie to hit. Well I'm not satisfied at all. I want us to work together like friends like we did to start with. All I do now is fuss and I hate working in an environment and a relationship like this. Can't you fix it so we can get back to the way it was?"* (`f52b715`) → produced The Working Relationship section.

#### June–July 2026
5. **2026-06-30** (`9fefa97`) ◇ — scripted questions written for Jeff to ask WHUD, quoting the exact wording the file told him to use: *"AES-128 encryption/decryption key (OMS/meter key) for my meter"* and *"Is my meter read by the Kamstrup's built-in radio, or by the separate radio module (`EFW`/`100WD`, endpoint `79453337`) in my pit, and what system does that use?"* (Not Jeff's own words — words prepared FOR Jeff; kept here because they were part of the file's memory of the water-meter campaign.)
6. **2026-07-03** (`f668301`) — *"Log this so we don't go through this kind of round robin of checks again and we attack the source… I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end."* → produced Rule 12 + the Debugging Protocol. Still in the file.
7. **2026-07-04** (`9d4bf6e`) ◇ — fragment: Jeff's *"add the auto lighting I have now"* — context: the Lighting control card added to HOME GUARDIAN.
8. **2026-07-09** (`a27982a`) ◇ — fragment: *"Jeff: they 404'd"* — the dead Spotter/NOAA Weather Radio links; produced the link audit that Rule 13's first coworker hand-off verified.
9. **2026-07-14** (`c13f101`) ◇ — Jeff reported cameras + Fire TV *"not working as intended"* despite the 07-11 changelog saying both were confirmed working end-to-end → root cause: CodeProject.AI server silently dead 3 days. Also the plan-conflict correction: *"NOT simple ADB from Beehive to Fire TV — Jeff wants it routed through the beast."*
10. **2026-07-15/16** (`3b157b9`, `5ed12f0`) ◇ — *"rest of pages didn't log in"* / *"the rest of the pages did not log in"* — the iPad wall-display token-persistence saga, including the honest correction that the setup was "NOT actually finished yet — despite the entry below saying 'fully set up.'"

#### August 2026 — the design sprints
11. **2026-08-01** (`fdc358e`) ◇ — *"go ahead and fix the remaining contrast items"* → the WCAG token darkening (`--gold` `#9a7b1e`→`#7e6017` etc.).
12. **2026-08-02** (`552c699`) ◇ — *"save everything... it would be catastrophic to lose anything"* → the master backup/disaster-recovery system (git layer + iCloud layer).
13. **2026-08-03** (`dd2c6fa`) ◇ — the NOAA link *"was landing on 'some type of paysite'"* → app-wide link audit.
14. **2026-08-03** (`83a23cd`) ◇ — *"camera views in the app are all messed up"* → the 12-tiles-instead-of-6 clipframe-helpers fix.
15. **2026-08-03** (`e841657`) ◇ — Jeff's verdict on the first LUX photo overlay: *"That looks awful... where is the rest of the picture."* → the full-picture + glass-chip redesign.
16. **2026-08-03** (`a5db5dc`) ◇ — *"Alexa fast-forward isn't working"* → the reserved-phrase root cause and the "Alexa, turn on FF the Commercials" workaround.
17. **2026-08-06** (`1707cf4`) ◇ — Jeff pushed back with a sharper diagnosis than the 08-04 fix: *"I can login fine it just won't stay logged in... does it need a token? All the other things stay logged in."* → found the refresh token was requested but never used.
18. **2026-08-06** (`2bf50db`/`7b5ee1d`) ◇ — the Luxury Glass Overlay was *"attempted, then fully reverted per Jeff"* (his two reference docs: "Luxury Dashboard UI Framework With Code" + "…Glassmorphism Guide").
19. **2026-08-06** (`f4290d7`) ◇ — *"not some of it, all of it, with all ingredients, like baking a cake"* — Jeff's response to a partial glassmorphism checklist pass; the file notes "he was right."
20. **2026-08-06** (`d6514f6`) ◇ — *"did you apply everything in the code?"* — same thread.
21. **2026-08-06** (`6bd7217`) ◇ — *"Make the rest of the utilities look like the lux… two columns and shrink it down so the meter itself shows like you did with the thermostat"*; *"Make the boxes translucent like the lux"*; *"Those boxes don't need to be near that big"* → utility cards rebuilt to match the LUX card.
22. **2026-08-06** (`67ba0b5`) ◇ — Jeff's live call: *"make the box go all the way down to the bottom of the picture or center it so there is not all that dead space"*.
23. **2026-08-06** (`893bd8b`) ◇ — Jeff, watching it render live: *"do we even need the boxes — why don't you completely blur out a section right below where the utility logo is and just put the numbers in that blurred area without the individual boxes… leave the logos."* Also his tooling offer: *"I can get that tool or anything going."*
24. **2026-08-06** (`30d1df3`) ◇ — *"not so much blur in the picture"*.
25. **2026-08-06** (`384c07d`) ◇ — *"you can make all that shit that was underneath the pictures before all fit on the picture now."* → utility card text moved onto the photos.
26. **2026-08-06** (`db9ffcc`) — *"I hate those logos that are on the picture. I don't mind the text but it looks awful with them right next to the real icons."* → the WHICH PHOTOS ARE REAL section. Still in the file.
27. **2026-08-06** (`53f697f`) ◇ — *"the data is covering the title in the box"*; also Jeff's *"gotta be logged in / go to Cloudflare"* fragment (Gas/Electric login flow).
28. **2026-08-06** (`eb0852f`) ◇ — from Jeff's own Mercedes Me app, screenshotted live (Mercedes' words, evidence in Jeff's hands): *"Your request to start the engine is unable to initiate because you have reached the limit of remote attempts between manual ignition cycles. Please use your key and manually start your vehicle the next time."* → proved remote-start attempts limit; remote start confirmed working `adcf16c` same day.
29. **2026-08-08** (`22fd9e1`) ◇ — *"coworker did some amazing work with the app and pictures however I need you to go in and fix the sizes so they resize correctly on all formats tv, web, iPad, phone etc."* — rare recorded praise, plus the next task.
30. **2026-08-08** (`480afd2`) ◇ — *"the blurred section with the days in it is covering me in the picture."* → irrigation hero panel moved off Jeff.
31. **2026-08-08** (`436ce61`) ◇ — Jeff corrected the previous fix: *"blurred section with the data in it [not …]"* (fragment; repositioned bottom-right per follow-up).
32. **2026-08-08** (`a3caae3`) ◇ — *"the blurred sanction [section] and the numbers should go all the way across the bottom like the other[s] do"* — the file preserved Jeff's typo with a sic-bracket.
33. **2026-08-08** (`c214610`) ◇ — *"that would look more like the rest of the hero pictures and bring them more in line with the other[s'] size."*
34. **2026-08-08** (`28de83e`) ◇ — from a screenshot of the real card: *"remove all that from these two sections and combine them."* → B-Hyve Intelligence + Lawn Water Need merged.
35. **2026-08-08** (`e988eaa`) ◇ — *"we don't need it."* → the "Consider Watering" verdict banner deleted.
36. **2026-08-08** (`9c415ab`) ◇ — *"The sling button works great! I need you to make me a Braves Vision button with a little Braves icon... I need the button to go straight to Braves Vision."*
37. **2026-08-08** (`20ca199`) ◇ — *"add watch sling button to the app in the Guardian section so it pulls up the browser for sling... just need access to be through the app."*
38. **2026-08-08** (`a1a65fe`) ◇ — *"do you want to get all the garage door stuff coded and ready for HA?"* → app-side garage-door work done ahead of the hardware.
39. **2026-08-08** (`5d22cf7`) ◇ — *"The size is still off on iPad landscape the picture resizing."* → the 560px frozen-hero fix.
40. **2026-08-08** (`24136c7`/`bb9d1cf`) ◇ — the wall-iPad "stuck sideways" thread; Jeff's reframe that cracked it: *"it worked perfectly before, you can't say it's a limitation of the app or the iPad."* → the real cause was Claude's own hero max-height CSS from earlier that day, reverted *"per Jeff's timeline."*

#### August 10–11 — the GPS/yard-map marathon (all ◇, archived)
41. **2026-08-10** (`7adc108`) — *"the whole purpose of the GPS was to build an eventual map of my yard based over it tracking the mow over time... it would get better and better with each mow."* → yard map rebuilt around cumulative coverage.
42. **2026-08-10** (`5a0cea9`) — *"if the gps is going to be useful it has to work automatically no pushing buttons at the beginning and end of mows it needs to start recording from when it gets its first signal to its last"* and *"the mower only mows my yard so continuous tracking should not be a problem... we could add a stop track button."* → GPS coverage moved server-side, pause toggle added.
43. **2026-08-10** (`333adcf`) — *"I want to confirm that everything the mower sensors pick up and the gps is building a history of everything that mower does if it farts 💨 it picks it up."* → full raw sensor payload logging; a real whitelist bug found (fields were being dropped).
44. **2026-08-10** (`5959b55`) — *"Pull a real plot map at Robertson county web site for [his address] if that picture won't work."* → real georeferenced satellite basemap.
45. **2026-08-10** (`f29e517`) — *"It needs to be resized / It's blurry as shit."* → framing + blur fixes, sharper imagery source.
46. **2026-08-10** (`1d6c109`) — *"this one looks good."* → satellite yard map confirmed working on Jeff's real device. Same entry records the earlier symptom *"7 cells from 0 mows."*
47. **2026-08-10** (`d3749b9`) — *"Won't the drift improve over time as it's making the history map of the yard?"* → the question that exposed a real design flaw; the file records: "Thought it through honestly instead of saying yes — **and the answer was no, and the design I'd shipped would actively get WORSE**" → coverage re-designed to count visits.
48. **2026-08-10** (`68f4b7b`) — *"Add the track smoothing you mentioned as well so we get the best map over time. Also if I know I'm going to be mowing something I don't normally mow (some of the neighbor's yard) I will turn off the tracking."* → GPS smoothing + forgot-to-resume safety net.
49. **2026-08-10** (`b568a4b`) — *"Why are my hours now set at 5.9, the real actual hours are 12.1."* → the localStorage-blowout bug: the coverage map filled localStorage and reset the hour meter to default. The changelog title owns it: "🚨 MY BUG."
50. **2026-08-10** (`a2779b5`) — *"Get you damn times right... I want a current timestamp added to the session anytime it is picked up and I want the current date and times tracked."* → Rule 14. Still in the file.
51. **2026-08-11** (`e5d57f4`) — *"You got it they are rendering correctly now, however my head is cut off in the yard hero pic"* then *"it's only in the iPad landscape that it is cut off."* → the cropping-counts-as-altering-him rule.
52. **2026-08-11** (`86b47e6`) — *"Is everything fix and 💯 correct… make sure we don't have any other situation like this out there waiting… Also fix hero pictures not rendering in iPad landscape."* (after re-entering 12.1 hours) → proactive audit for more storage time bombs.
53. **2026-08-11** (`af6df04`) — *"Run all the diagnostic checks you got, to make sure there is nothing else broken or not working… no surprises!!"* → the full diagnostic sweep that closed the light-mode-contrast bug class (Pending Item 17).
54. **2026-08-11** (`d18db7b`) — the design directive embedded in the sensor section: per-mow stats held until the next mow starts — *"Jeff asked for this explicitly; don't 'fix' it."*

#### August 14–16 — the endgame
55. **2026-08-14** (`46c7450`) — *"I only work with you, I'm done with code after the last debacle"* → SINGLE-SESSION MODE. Still in the file.
56. **2026-08-16** (`fab5b30`) — *"break it up and put the stuff in iCloud and then just tell yourself to read that."* → Rule 16 (history lives outside the file). Still in the file.
57. **2026-08-16** (`fab5b30`) — *"you go down one road and get tunnel vision and you spend more time fighting over that single tunnel... open your damn mind and look at all options."* → Rule 16-bis (STOP TUNNEL-VISIONING). Still in the file.
58. **2026-08-16** (`c30b64d`) — *"I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would rather spend the money on that and have your help than buy $120 worth of dimmers."* → SETTLED DECISIONS; the project's budget philosophy. Still in the file.
59. **2026-08-16** (`c30b64d`) — *"you tell me it is all documented and it is not, then the session closes and you come back with some plan that was two weeks ago — this is infuriating."* → the same-session documentation rule. Still in the file.
60. **2026-08-16** (`docs/SESSION_START.md` §2b — not in CLAUDE.md itself) — *"you did not read the archives on what was settled and planned."* → the DOC INDEX ("52 files exist. Survey before you plan ANYTHING.").

**The record is silent** on any Jeff quotes between 2026-05-20 (project start) and 2026-06-24 within CLAUDE.md — the file did not exist for the first month, which is precisely the gap it was created to close. Quotes from that era, if any survive, live in commit messages and the MASTER-RECORD transcripts, not in this file's history.

---

### 12. `docs/SESSION_START.md` — the 4.5 KB briefing that replaced 260 KB of context (2026-08-16)

Created in `fab5b30`; mandated by Rule 15 (*"READ `docs/SESSION_START.md` IN FULL AT THE START OF EVERY SESSION (Jeff's rule 2026-08-16)"*). Mirror: `C:\Users\jeffl\iCloudDrive\HCC-Archive\SESSION_START.md`. Its full contents, chronicled section by section (file: `<tip>/docs/SESSION_START.md`, 119 lines):

- **§0 🔴 THE MASTER RECORD — search it BEFORE you answer.** *"Every word ever said on this project is archived and searchable. There is no longer any excuse for 'that was never documented.'"* Points at `iCloudDrive\HCC-Archive\MASTER-RECORD\`: **6,896 messages verbatim, all 635 commits, 25,547 tool actions, 187 images, and `HCC_DECISIONS_LEDGER.md`: 81 decisions in Jeff's own words.** Mandatory search *"any time Jeff says 'we discussed' / 'I told you' / 'that was settled'"*, via `windows-scripts\Search-HCC.ps1`. Access map for every system lives in `C:\Users\jeffl\HCC-secrets\HCC_ACCESS.md` — *"never copy that into the repo, it is public."* Warning: *"searching for the dead plan and finding nothing does not mean nothing is documented. Search for what the plan is, check file dates, newest wins."*
- **§1 First three things, every session:** (1) get the real date/time from Beehive's `/api/template` (America/Chicago — *"it has been broken twice"*); (2) `git pull`; (3) read `CLAUDE.md` — *"the relationship sections first. They are the point of the project."*
- **§2 Where things live:** a table mapping needs to files — `CLAUDE.md` (auto), this briefing, `docs/CHANGELOG_ARCHIVE.md` ("179 KB, 98 entries — grep on demand"), `docs/BEEHIVE_REFERENCE.md`, `docs/UTILITIES_REFERENCE.md`, `docs/utilities/backflow_layout.html`, `docs/beehive/camera_pipeline_VERIFIED_2026-08-15.md`. *"Grep the archive BEFORE re-investigating any subsystem — the answer is usually already in there, paid for in Jeff's time."*
- **§2b 🔴 THE DOC INDEX — 52 files exist. Survey before you plan ANYTHING.** Exists because *"on 2026-08-16 a session planned the Zigbee buildout off ONE doc from 08-13 and re-asked four questions that later commits had already settled. Jeff, verbatim: 'you did not read the archives on what was settled and planned.'"* Area-by-area reading lists (Zigbee/mesh, Guardian/alarm, Cameras/AI, Lighting, Water/utilities, Mower, Network). Two standing Guardian corrections: **"Jeff wants *tons* of LIFE-SAFETY (smoke/CO/gas/leak/freeze) and LEAN intrusion"**; and **"Alert fatigue is a security failure, not an annoyance. Too many alerts → Jeff disarms Blink → every camera automation silently stops → no security at all… It already happened once (48 h dead, Aug 10–14)."**
- **§3 Hard-won invariants — violating these has cost real hours:** never declare done without verifying the far end (*"Component checks said 'healthy' through every real camera failure on 08-15"*); a meter reading `unknown` is NOT a fault (the `rtlamr -unique=true` cadence that caused the false WHUD alarm 08-01); never default a `total_increasing` template sensor to 0; `image_processing` needs a FULL HA restart; `packages/hcc.yaml` automations are invisible to the config API; long-term statistics beat `history` (`recorder/statistics_during_period` over WebSocket); Cloudflare Pages `_headers` `/*` is silently ignored; Studio Code Server *"a selection one character too wide silently broke YAML on 08-16."*
- **§4 How to work (the two rules Jeff added on 08-16):** Don't tunnel; **"Don't hand Jeff a menu. If an action is blocked, retry it, then find another route, then ask — in that order. He has said repeatedly he wants the work done, not the options explained."**
- **§5 Open items — check status, don't assume:** Orbit anti-siphon valve ordered 08-15 not yet installed (daily 5 AM leak report runs until then); backyard PIR logs zero motion even at cool hours (not yet root-caused); **HA backup encryption key still exists only on this one PC** ("without it every iCloud backup is undecryptable"); garage camera reports no temperature/WiFi — "likely unplugged, needs a physical look."

---

### 13. `docs/CHANGELOG_ARCHIVE.md` — the compressed history, surfaced

Created in `fab5b30` (2026-08-16 07:18) — 183 KB, **98 entries**, header: *"Extracted from `CLAUDE.md` … because the Change Log had grown to 177 KB — 68% of a file that is injected into every single message. **Nothing was deleted.** Every entry below is verbatim."* Mirrored to `iCloudDrive\HCC-Archive\CLAUDE_CHANGELOG_FULL.md`. It is the project's full working memory, newest first. What it holds, era by era:

**The condensed early eras** (each one line, already compressed by the July hygiene passes before archiving):
- **06-23 → 06-29:** "Initial build-out — nav/modals, GPS persistence + calibration, LUX/CLIMATE integration, light/dark theme, hero-grade + design-token system, font unification."
- **07-01 → 07-07:** HA calls moved behind the `/api/ha` server proxy — "fixes the whole 'Beehive Offline' class of bug"; the shared-`AbortSignal.timeout` root cause ("never hoist one out of a retry loop"); water+gas meters live via RTL-SDR; first HA devices (Tuya plug, Sharky vacuum).
- **07-09 → 07-15:** Blink cameras live ("removed a stale `custom_components/blink` override — never re-add it"), CodeProject.AI local camera detection, Fire TV via ADB, iPad Safari-15 polyfill.
- **07-16:** CAR section (Mercedes GLE 350). **07-21:** CAR + Blink + Family Login live; the Cloudflare CDN-edge-cache root cause ("check `cf-cache-status` on the custom domain, not just `Cache-Control`"). **07-22:** "lesson: never guess entity/service names for an integration, read its actual source first." **07-23:** sewer billing calibrated; `water_billing_history` (24 cycles). **07-24:** F-250 vehicle switcher; "app must never send a `pin` field"; Fire TV pause via `media_session dispatch`, "not the no-op `keyevent 127`." **07-26:** garage-door card built app-side; myQ "permanently API-blocked by Chamberlain, no software fix exists." **07-28:** utility tiles validated against Jeff's real bills; "Recorder was dead 07-02→07-28 (missing `default_config:`)."

**The fully-detailed eras (07-31 → 08-15), 90 entries** — multi-kilobyte paragraphs each, preserving root causes, Jeff's words (see compendium above), and honest self-indictments. Highlights of what only the archive now holds:
- **07-31 (5 entries):** stability audit; automation-save root cause; RTL-SDR reboot; Fire TV/Blink popup fix + "Blink Auto-Heal" automation; PiPup picture-in-picture; water pit-radio item closed "per Jeff's decision"; Zigbee list delivered.
- **08-01 (12 entries):** 24h health check; **Angela's barn-arrival tracking "using her real drive as live validation"** and work-arrival tracking; Vizio soundbar `setup_retry` fixed via power-cycle "researched not guessed"; Lighthouse pass with "honest results" (images 12MB→7.1MB, "composite score unchanged"); the 27-element WCAG contrast finding and token darkening; **the water-meter false alarm and same-day retraction** ("Confirm water pit-radio fault via live irrigation+shower test" → "Retract water-meter fault diagnosis — meter is healthy, no WHUD call needed"); `zone.work` moved to the real parking garage (310 Commerce St — "only ~90m from the original office coordinates, not the ~0.4mi Jeff estimated — flagged to him"); leak-detection automations; Morning Digest built (and the removed always-zero "active alerts" metric — "removed that metric rather than ship a false 'all clear'").
- **08-02 (2):** the master disaster-recovery system Jeff asked for (*"save everything... it would be catastrophic to lose anything"*) — git layer confirmed-public check "caught a real live Weather.com API key hardcoded in `packages/hcc.yaml`'s `rest:` block, fixed by moving it to `secrets.yaml`"; HA backup encryption key flagged.
- **08-03 (12):** Fire TV Rewind/FF buttons; the real "Alexa fast-forward" root cause via HA source + Amazon forums (reserved phrase, GitHub issue home-assistant/core#87327); NOAA "paysite" link fix under a fully-blocked-egress sandbox; mower serial confirmed (wrong-serial-range eReplacementParts link fixed); camera 12-tiles fix; fixed camera display order ("front doorbell right under driveway"); LUX card moved to HOME and rebuilt as photo-overlay through three Jeff-driven iterations; YARD's two ready-to-mow cards merged; System Health folded in, Fitness removed ("he doesn't need the app to tell him that").
- **08-04 (4):** LUX login bugs (full 4-step Azure B2C flow was running on every call); duplicate account-form IDs; LUX never loading on normal open; iPad button scaling.
- **08-05 (12+):** hardware-inventory day (GaragePC TouchSmart 520-1020, Kitchen TV at $0 via Sling web on the wall iPad, KESU 500GB, Lenovo B570 "Pentium B960, encode/AI ruled out", Delam mic, WD 320GB, cast stick, mystery dongle = HDMI-to-USB capture stick, J45 has 4 USB ports not 2); the garage-door protocol test (dry-contact confirmed, not Security+ 2.0) and the part-selection walk ratgdo → Gelidus → SONOFF SV → **SONOFF MINI-D ("native Matter, no flashing")** that produced the never-name-products rule.
- **08-06 (17):** sewer-overcharge tracking bug (real B-Hyve data never saved to history); Electric SmartHub real data + the `recorder/statistics_during_period` and diff-of-sums fixes; **the deploy-branch mystery** (second repo `Toro-Timemaster-` — both repos' CLAUDE.md claimed to be the deployed one; settled live: Master-the-Master- is it, "do not develop on Toro-Timemaster-"); LUX refresh-token fix; the Luxury Glass Overlay revert-then-redo saga with all of Jeff's live art direction; utility photos regenerated without fake marketing copy; WHICH PHOTOS ARE REAL; Mercedes PIN correction chain (`473f122` options dict empty → `e3d6de2` RIS_PIN_INVALID → `eb0852f` attempt limit → `adcf16c` **remote start CONFIRMED WORKING from the app**).
- **08-08 (17):** smart-lighting plan logged (Kasa HS220/HS200 from Jeff's 2 PDFs "saved verbatim"); SONOFF MINI DRY setup researched ("Researched (not guessed) rather than repeat the 08-05 mistake pattern"); MyQ sale decision + Zigbee position sensor; the irrigation-hero-panel five-iteration repositioning thread; camera Refresh All silent-failure fix; the 560px frozen hero; the wall-iPad sideways saga ending in "it was MY OWN hero max-height/CSS edit from earlier today, reverted"; mower sensor heartbeat-erasing-mow-data fix → mow-to-mow history → **full raw reading log after Jeff "pushed back hard"** on the summary-only version.
- **08-10 (10 time-stamped entries, 3:55 PM → 7:10 PM CDT)** — the GPS marathon, minute by minute: yard map rebuilt (real explode bug), server-side coverage, raw-payload whitelist bug, real georeferenced satellite basemap, true-north + Fort Worth simulator bug, "blurry as shit" fixes, **"✅ CONFIRMED WORKING ON JEFF'S REAL DEVICE"**, the visits-not-accumulation redesign from Jeff's drift question, track smoothing, and **"🚨 MY BUG — the coverage map I built blew out localStorage and reset Jeff's hour meter to the 5.9 default; fixed + made unrepeatable."**
- **08-11 (4):** storage-time-bomb audit + deterministic hero sizing; head-cut-off fix; the full diagnostic sweep closing the light-mode contrast class (19 genuine failures, worst 1.09:1, "invisible in light mode"); **the coworker's hardware session: "mower box made maintainable; 6 real bugs, all found by running it against hardware."**
- **08-15 (1):** "coworker — full-stack audit + the backyard camera root cause" — the 60% AI confidence threshold silently discarding a night-IR person at 25.5% (**"A person in the back yard at night is currently undetectable"** — fixed branch-wide to confidence 25 in `fab5b30`).

---

### 14. What the memory file proves

Read end to end, the 274 revisions are a record of an AI being taught — rule by rule, failure by failure — by a nearly-60-year-old man who refused to let the project die. Every structural feature of the file maps to a specific wound: the Mandatory Rules to the 06-24 reckoning; the Debugging Protocol to the 07-03 run-around; Rule 13 to the capability gap; the sensor exception to re-bought hardware that was never broken; Rule 14 to a wrong timestamp; SETTLED DECISIONS to a $120 dimmer pitched twice; the archive split to 260 KB of memory crowding out the ability to think. And through all of it, the four messages from 2026-06-24 sit at the top of the file, byte-identical, under a rule that forbids ever compressing them — because, as the file itself says, *"They are the point of the whole project."*

---

### Appendix — complete revision ledger of CLAUDE.md (274 commits, oldest first)

Evidence: `git -C /home/user/Master-the-Master- log --reverse --format='%h %ad %s' --date=short origin/claude/time-master-project-liq1jw -- CLAUDE.md`

```
e8f0312 2026-06-23 Add CLAUDE.md — persistent project memory for all future AI sessions
90e556e 2026-06-24 Rewrite CLAUDE.md — comprehensive persistent memory with Jeff's rules, project plan, and full session history
f52b715 2026-06-24 Update CLAUDE.md — restore the working relationship commitment
6b7cd5d 2026-06-24 Update CLAUDE.md — document session 2026-06-24 full history
d404a92 2026-06-25 Update CLAUDE.md — session 2026-06-25 history, GPS sim, hero fix, B-Hyve debug
f814c01 2026-06-26 Update CLAUDE.md: session 2026-06-26 history, new sections, corrected state
94e2b34 2026-06-26 CLAUDE.md: mark LUX thermostat WORKING — live confirmed 2026-06-26
c72c8a8 2026-06-26 CLAUDE.md: full end-of-session save — LUX API docs, verified state, commit log
858cd74 2026-06-26 CLAUDE.md: log LUX set_sp 500 error as top pending item for next session
b035ffb 2026-06-26 CLAUDE.md: update session history, mark LUX PUT fix deployed, 26/26 tests
07409da 2026-06-26 CLAUDE.md: document LUX POST fix — POST /api/device is the write method
33ca88f 2026-06-26 CLAUDE.md: LUX setpoint control confirmed working — 72F set from HCC app
394217f 2026-06-27 Memory: log Jeff's Kamstrup 621 water meter project
9ced08f 2026-06-27 Memory: log whole-home utilities monitoring plan
731d435 2026-06-27 Memory: Jeff wired his own house — no electrician suggestions
2c91e09 2026-06-27 Memory: correct electric monitor spec to Shelly Pro 3EM-400
739e715 2026-06-27 Memory: DIY ATM90E32 energy meter build + bake-in hardware + automations
b243228 2026-06-27 Memory: Jeff's actual loads + monitor/control verdict
76d0326 2026-06-27 Memory: corrections from meter/panel photos
81e32b8 2026-06-27 Memory: panel scorching is a resolved pre-purchase issue, not active
43520a5 2026-06-28 Memory: hero-grade module is the gold standard for all sections
8b4c8a0 2026-06-28 Consistency Lock: semantic status tokens + statusColor() + design rules
a4ae337 2026-06-28 Memory hygiene: compress CLAUDE.md (737→550 lines) + add lean rule
1305f0a 2026-06-28 Protect the relationship sections — first and foremost, never compressed
28d79c6 2026-06-29 Add Light/Dark theme toggle (default light) for readability
8ac220a 2026-06-29 Redesign to Style A (Apple Clean): one font, white top-to-bottom
44ea8e8 2026-06-29 Light-mode sweep: white-ify all modals, popups & dark holdouts
c8ca302 2026-06-30 Archive Lucky Mike Smart Stall plan + technical review (queued, not built)
e50c9a4 2026-06-30 Lucky Mike: save optimized BOM + pricing/business plan (planning docs)
9fefa97 2026-06-30 Memory: confirm meter data + log critical water-pit radio finding
719638f 2026-06-30 Memory: confirm gas = Itron 100G ERT; clarify gas-vs-water radio attribution
42e84f3 2026-06-30 Memory: add reader-box placement + remaining-hardware notes
5102f14 2026-06-30 Memory: clarify Beehive/HA needs a radio; RTL-SDR-into-HA-host option
eec485a 2026-06-30 Memory: store Beehive hardware = Beelink J45 (Gemini) x86 mini-PC
ae337d4 2026-06-30 Memory: log the shopping answer — one RTL-SDR dongle (~$40) is the only new buy
711bad8 2026-06-30 Memory: add J45-as-brains architecture map + flag HA setup as foundational TODO
9a9da77 2026-07-01 Beehive: confirm J45 dedicated + add HA OS install guide; note working model
d5df6e9 2026-07-01 Memory: record definitive B-Hyve no-history finding + HA path
1d23b5d 2026-07-01 Memory: correct irrigation history — endpoint found (path form), not a dead end
b947011 2026-07-01 Memory: irrigation Last Watered confirmed working (reads 7:30 AM)
75c1a27 2026-07-01 docs: record AES meter-key storage decision (Apple Passwords, not Cloudflare)
5034f26 2026-07-01 docs: water meter blocker RESOLVED - unencrypted Itron ERT-SCM, no key needed
3b8b61a 2026-07-01 feat(home): add Utilities strip - Water / Gas / Electric branded cards
7a5e984 2026-07-01 feat(panic): redefine panic → sirens + lights + alert family (no 911 auto-dial)
4c9cf03 2026-07-01 docs: clarify alarm = DIY Zigbee build (not a commercial panel, not bought yet)
ac3abdb 2026-07-01 fix(home): utility banners show full image (no crop) + safety module refs
9100fcc 2026-07-02 docs: RTL-SDR needs no Windows drivers for HA (rtl_433 add-on has the driver)
4e75b37 2026-07-02 assets: save Security section hero art + note it as the build blueprint
f39b125 2026-07-02 docs: J45 migrated to internal drive + RTL-SDR meter setup guide (no drivers)
0f94198 2026-07-02 docs: water + gas meters LIVE via rtlamr2mqtt (confirmed IDs + protocols)
746ae94 2026-07-02 docs: log app meter wiring + weather hero/heat fixes
5e6c20b 2026-07-02 docs: Nabu Casa connectivity in progress + mPING is a dead end
947a99d 2026-07-03 mPING: direct link to official app; wire app to Nabu Casa remote URL
e1d29b0 2026-07-03 Utilities helper tiles + HA helpers/Alexa/weather guide
c55d382 2026-07-03 Pin Nabu Casa URL + WU station/key in project memory
b1bd4f1 2026-07-03 Note Beehive /setup completion in project memory
410ccc5 2026-07-03 Log Beehive-online milestone (CORS fix confirmed) in project memory
5c7aadc 2026-07-03 Log: real KTNWHITE21 weather live in HA via REST sensor (79F confirmed)
363ec81 2026-07-03 Memory: pick-up-here note for next session (Alexa expose + helper tiles)
a6d1e3b 2026-07-03 Memory: record the shared-AbortSignal timeout regression + fix
d6ba617 2026-07-03 Memory: document the /api/ha server-side proxy architecture
f668301 2026-07-03 Add PROTECTED Debugging Protocol: attack the source, test on my end first
586bf83 2026-07-03 Memory: Alexa reads real weather (goal complete); refresh next-steps
17d388a 2026-07-03 Memory: mark cameras (Blink) as Jeff's #1 priority; capture cookie fix + fallback
59c8749 2026-07-03 Memory: record real Blink root cause (blinkpy 202 2FA -> 0.25.7 bump)
74c88f3 2026-07-03 Memory: capture WHUD water bill reference (rates, cycle, meter) + reading mismatch
8a8803a 2026-07-03 Memory: log section restructure + batch of fixes
2a8a8a0 2026-07-03 Memory: water reading question resolved (transmitted reading authoritative; cost validated to bill)
8ee5658 2026-07-03 Memory: gas billing sync parked until Jeff's first Spire bill
5a8320c 2026-07-04 Add HOME GUARDIAN section — whole-home safety/security watch
ad3be81 2026-07-04 Fold LUX thermostat into HOME GUARDIAN; remove CLIMATE tab; new Guardian hero
9d4bf6e 2026-07-04 Add Lighting control card to HOME GUARDIAN
20ce92e 2026-07-04 Lights & Plugs card: control switch.* (SYLVANIA plugs), exclude irrigation
83f0240 2026-07-04 Add Tuya plug setup + HA-lighting-automation guide (docs/beehive)
3d33efa 2026-07-06 GPS map: one/two-tap 'Pin Track to Photo' (no coordinate entry) + MPU offline note
408fc96 2026-07-06 Master Hour Calibration (override + baseline re-sync) + pre-mow reset reminder
f0a9199 2026-07-06 Show 'set [date]' under the hour meter when hours are hand-calibrated
f010694 2026-07-07 Note: SYLVANIA plugs are locked to their app — dead end for HA (use Kasa/Zigbee)
e7d9ef9 2026-07-07 Add Robot Vacuum (Sharky) card + keep vacuum switches out of Lights & Plugs
a27982a 2026-07-09 Guardian banner explains ATTENTION/ALERT + calmer thresholds; fix 2 dead Weather links
bec7440 2026-07-09 Add Mandatory Rule 13 (coworker delegation) + record 404-risk link audit
fc62533 2026-07-09 Link audit closed: parts/manual deep-links verified live via coworker (no fix)
9a34d17 2026-07-09 Link audit closed (parts links verified live) + coworker context/coordination rule
9b29c1f 2026-07-09 Blink: record real root cause + official fix (blinkpy 0.25.6 / HA 2026.6.4); our custom override is now the blocker
7bbc8a2 2026-07-09 Blink cameras LIVE in the app (Jeff's #1 feature) — all 6 cameras confirmed; mark Pending #4 resolved
5ddac8a 2026-07-09 Camera full-control in app: Refresh All, per-camera snapshot/save-clip/arm panel; stills via signed entity_picture URL
80799e7 2026-07-09 Safety: gate panic alarm behind Beehive token so public visitors can't trigger it; route via /api/ha proxy
f474d9b 2026-07-09 Domain live: loewenhome.com + www Active/SSL, serving app (HTTP 200 worldwide)
9785381 2026-07-09 Memory: record Beehive fixed-IP on AT&T gateway + LAN inventory; correct wrong 5GHz-off notes
d2337b9 2026-07-10 Memory: AT&T ActiveArmor check done - nothing paused/blocked
dfaa88f 2026-07-10 Docs: capture camera-AI + home-theater plan (beast as AI/media brain, no subscriptions)
76ae463 2026-07-11 Log CodeProject.AI camera detection completion in change log
c926ceb 2026-07-11 Log Fire TV/HA pairing, alexa_media_player setup, loewenhome.com audit, and a found (unfixed) desktop layout bug
987e804 2026-07-11 Log confirmed-working Fire TV camera pop-up mechanism + File Editor add-on fragility
a88ccc6 2026-07-11 Fire TV motion pop-up alerts: built, deployed, and confirmed working end-to-end
049ad6d 2026-07-11 Add arrival-suppression automation, Angela's HA account, and an "almost home" alert
4b19147 2026-07-11 Expand AI camera detection from 3 to all 6 Blink cameras, confirmed working
6c26465 2026-07-11 Fix Siri Announce Notifications not reading AI camera alerts aloud
c13f101 2026-07-14 Audit: root-cause camera/Fire TV alert outage (CodeProject.AI service down 3 days), resolve TV-alert plan conflict
b108a6e 2026-07-14 Live-test Fire TV pop-up twice with AI pipeline healthy: still broken, root cause narrowed
25e3256 2026-07-14 Fire TV pop-up actually fixed: ADB browser launch instead of Alexa
3a714fe 2026-07-15 Fire TV pop-up: fix 5min Blink delay + fix relaunch resetting DVR playback
2965b5a 2026-07-15 Document real fix for Fire TV pause/resume: media_session dispatch, not keyevent
af3b16a 2026-07-15 Document the AbortSignal.timeout Safari-15 fix and why it crossed the app-code boundary
3644f54 2026-07-15 Document iPad wall-display setup and onn Roku TV investigation
3b157b9 2026-07-15 Correct iPad wall-display status: setup NOT actually complete, mid-diagnosis
5ed12f0 2026-07-16 Condense CLAUDE.md for coworker sync — 678→573 lines
d84ff94 2026-07-17 Update CLAUDE.md: CAR wired to live Mercedes data via mbapi2020
71cc052 2026-07-20 CLAUDE.md: log the service-worker cache-header fix + custom-domain follow-up
4fabef8 2026-07-21 CLAUDE.md: document Family Login setup + confirm it's verified working
6f517ac 2026-07-21 CLAUDE.md: correct root cause + mark stale-cache bug resolved
4e9445d 2026-07-21 CLAUDE.md: mbapi2020 install verified end-to-end, CAR section fully live
2fdef21 2026-07-21 Compress Change Log per file's own memory-hygiene rule (73.6KB->49.6KB)
e61e920 2026-07-21 Update CLAUDE.md — log window fix, hero fix, entity naming lesson
131dc16 2026-07-21 CLAUDE.md: log Sling switch handling + Alexa ad-skip wiring (coworker)
6aeba2f 2026-07-21 Update CLAUDE.md — log CAR lock cross-contamination fix
778f6bd 2026-07-22 Rewrite CAR commands with proper mbapi2020 domain services (researched from source)
ebd2a3a 2026-07-23 Update CLAUDE.md: water+sewer bill validation complete
5e6d616 2026-07-23 Update CLAUDE.md: billing history tracking added to changelog
8a9df3b 2026-07-23 Calibrate electric rates from CEMC bill, add Est. Cost tile
0d6c9de 2026-07-23 Calibrate gas rates from 3 Piedmont bills, replace rough estimate
15ca7d8 2026-07-24 Update CLAUDE.md: auto-refresh fix documented in changelog
c64d0f8 2026-07-24 Update CLAUDE.md: CAR PIN cleanup documented, pick-up-here updated
42b6c72 2026-07-24 Update CLAUDE.md: F-250 vehicle switcher documented
e20d3d5 2026-07-26 Update CLAUDE.md: garage door integration documented + ratgdo path
c94e7aa 2026-07-28 Document 07-28 utility fix, Energy Dashboard wiring, and MyQ dead-end
1f4008f 2026-07-28 Finish electric usage-pattern model (was documented but never committed in 07bd9a1)
1657df0 2026-07-28 Update CLAUDE.md: electric SmartHub integration documented, stale utility pending item closed
414c74f 2026-07-28 Condense CLAUDE.md: 610 -> 374 lines, cut stale/resolved detail per Jeff's request
281d65b 2026-07-28 Document water pit-radio hardware failure diagnosis (07-28)
d74c8e1 2026-07-30 Add pending item: wire real B-Hyve runtime into sewer-overcharge estimate
d4dd400 2026-07-31 Update electric rate constant — CEMC TVA fuel surcharge changed (07/30/2026 bill)
3f2808f 2026-07-31 Log 07-31 stability audit in Change Log
b4f11df 2026-07-31 Document 07-31 coworker fixes: automation-save root cause, RTL-SDR reboot, freeze warning removed
fd15642 2026-07-31 Document Fire TV/Blink camera-popup fix: root cause + Blink Auto-Heal automation
0b72961 2026-07-31 Audit note: clarify WHUD pit-radio status is unconfirmed vs the 07-31 RTL-SDR fix
a001f2e 2026-07-31 Document PiPup picture-in-picture integration + Blink watchdog hardening
13502b9 2026-07-31 Close out water pit-radio item per Jeff's decision, fix Pending Items numbering
a6a3f92 2026-07-31 Log 07-31 later-session work, close irrigation pending item, note Zigbee list delivered
98b47bf 2026-07-31 Log electric/water-flow data-accuracy checks — both confirmed working as designed
62e99b5 2026-08-01 24h health check + real fix for the old Fire TV automation + Mercedes GPS validated
66b3f49 2026-08-01 Build Angela's barn-arrival tracking using her real drive as live validation
762e714 2026-08-01 Fix Vizio soundbar setup_retry via power-cycle, researched not guessed
1596fc2 2026-08-01 Log Lighthouse work in Change Log, close out Pending Item 5 with honest results
2765386 2026-08-01 Build Angela's work-arrival tracking, mirroring the barn pattern
efd1be5 2026-08-01 Merge remote Lighthouse work with local Angela work-zone handoff note
b81474a 2026-08-01 Log 08-01 quality-tooling pass + contrast fixes, add remaining-gap pending item
bc3df2b 2026-08-01 Note zone.work radius gap: Angela parks ~0.4mi from the office address
0dc54d2 2026-08-01 Merge remote contrast-fix work with local zone.work pending-item note
fdc358e 2026-08-01 Darken --gold/--muted/--bad light-mode tokens to clear remaining WCAG contrast fails
593ddf7 2026-08-01 Confirm water pit-radio fault via live irrigation+shower test
fb5068c 2026-08-01 Retract water-meter fault diagnosis -- meter is healthy, no WHUD call needed
3537b00 2026-08-01 Fix zone.work to the real parking garage address, not the office
2770fee 2026-08-01 Close out leak-detection, Angela's tracker, and zone.work threads
f1d24f3 2026-08-01 Investigate PiP delay, confirm Blink notify + rain-skip already covered, build Morning Digest
552c699 2026-08-02 Document master backup/disaster-recovery system in CLAUDE.md
03e688b 2026-08-02 Flag HA backup encryption key as needing a durable off-PC copy
a5db5dc 2026-08-03 Add Fire TV Rewind/Fast Fwd remote buttons; audit Fire TV+HA code end to end
5bcbc6d 2026-08-03 Merge coworker backup/disaster-recovery work with Fire TV remote fix
d755a6a 2026-08-03 Document real root cause of "Alexa fast-forward" via HA source + Amazon forums
dd2c6fa 2026-08-03 Fix NOAA Weather Radio link (was a TuneIn search page); audit all app links
f07048f 2026-08-03 Document Fire TV PiP popup wrong-frame fix, verified live twice
d998302 2026-08-03 Document Alexa fast-forward fix and zero-cost feature brainstorm
1c69752 2026-08-03 Confirm mower serial number, fix wrong-serial-range eReplacementParts link
79b1d44 2026-08-03 Merge coworker Fire TV PiP fix docs with serial-number/link-audit fixes
83a23cd 2026-08-03 Fix camera views showing 12 tiles instead of 6 (clipframe helpers leaking in)
58d294a 2026-08-03 Add fixed camera display order, front doorbell right under driveway
87d2459 2026-08-03 Move LUX Thermostat card to HOME, right under cameras
aa38bc8 2026-08-03 Overlay live LUX thermostat data onto the device photo
e841657 2026-08-03 Redesign LUX photo overlay: full picture + proven glass-chip pattern
70d16f2 2026-08-03 Move all LUX controls into the fireplace area, add real outside temp/feels-like
f3ca8b6 2026-08-03 Merge YARD's two redundant "ready to mow" cards into one
ffa6b4b 2026-08-03 Fold real System Health into Ready to Mow, remove Fitness + pre-mow reminder
c46ae19 2026-08-04 Fix LUX thermostat requiring login repeatedly
a0936d6 2026-08-04 Fix duplicate account-form IDs in the Connected Accounts modal
d15079c 2026-08-04 Fix LUX never loading on a normal app open
7b60e43 2026-08-04 Note cheapest ratgdo-compatible garage door option in project memory
bcb6bf6 2026-08-05 Scale LUX + Utility card buttons/text with screen size (fixes tiny UI on iPad)
35553b4 2026-08-05 Correct J45 USB port count in project memory (4 ports, not 2)
19f80be 2026-08-05 Record GaragePC (TouchSmart 520-1020) plan and Kitchen TV feed decisions
8abb561 2026-08-05 Add KESU 500GB drive and Lenovo B570 laptop to hardware inventory
1400370 2026-08-05 Pin kitchen iPad as iPad Air 2 in project memory
b1525f7 2026-08-05 Kitchen TV solved at $0 — Sling web confirmed playing on the wall iPad
b4910c5 2026-08-05 Add Delam condenser mic and WD 320GB bare drive to hardware inventory
5ac9211 2026-08-05 Add cast stick and unidentified HDMI/USB dongle to hardware inventory
19a404c 2026-08-05 Confirm B570 CPU: Pentium B960, encode/AI ruled out, light roles fine
9eef792 2026-08-05 Mystery dongle identified as HDMI-to-USB capture stick
65d7e49 2026-08-05 Record garage door protocol test: dry-contact confirmed, not Security+2.0
7e4726a 2026-08-05 Simplify garage door purchase back to just the Gelidus board
10f0f13 2026-08-05 Correct garage door plan: drop ratgdo board, use cheap ESPHome relay
4bfacf3 2026-08-05 Correct garage door part to exact model: SONOFF SV, not Basic
f015867 2026-08-05 Switch garage door part to SONOFF MINI-D -- native Matter, no flashing
7f73148 2026-08-05 Add permanent rule: never name a product/model from memory unverified
7eebfd3 2026-08-06 Update sewer rate to match confirmed City of White House increase
330c74a 2026-08-06 Add Garbage/Stormwater as separate line items, keep sewer math pure
8158128 2026-08-06 Fix sewer-overcharge tracking: real B-Hyve data was never saved to history
3322153 2026-08-06 Write coworker handoff doc for sewer overcharge tracking verification
46ab304 2026-08-06 Electric SmartHub: real Today/Yesterday/Peak Hour + Last 7 Days panel
a82f0ce 2026-08-06 Update CLAUDE.md: Electric card layout/contrast fix documented in changelog
6e24295 2026-08-06 Close out deploy-branch mystery: Master-the-Master- confirmed live 08-06
af230cd 2026-08-06 Fix desktop/TV hero gap (Pending Item 7) + full cross-format QA pass
5c41c8d 2026-08-06 Fix real Electric SmartHub bugs found by coworker's live HA verification
0827617 2026-08-06 Irrigation: apply real measured GPM calibration from coworker (zones 1/2/5)
7cccc59 2026-08-06 Note zones 1/2/5 are the front yard (what matters); 3/4/6 back yard genuinely low priority
3ff1eec 2026-08-06 Utility stat chips: blend into the photo, size bump
42ff38d 2026-08-06 Match LUX fireplace-panel styling to utility card chip edges
4464d87 2026-08-06 Add photo-overlay bevel so data panels sit naturally on the photo
468e6a1 2026-08-06 Apply luxury glassmorphism framework to LUX + utility photo overlays
d6514f6 2026-08-06 Fill in the 4 missing steps from the Glassmorphism Guide checklist
f4290d7 2026-08-06 Apply every glassmorphism ingredient to every overlay element
53f697f 2026-08-06 Fix Gas/Electric photos: baked-in icon row colliding with stat chips
2bf50db 2026-08-06 Revert Luxury Glass Overlay redesign back to original photos
7b5ee1d 2026-08-06 Remove the single-cycle "Sewer overcharge" note from the Water card
34c90ac 2026-08-06 Stop wiping saved LUX credentials on transient login errors
1707cf4 2026-08-06 Use the LUX refresh token instead of re-logging-in from scratch
30d1df3 2026-08-06 Luxury Glass Overlay: rebuild LUX + utility photo overlays
67ba0b5 2026-08-06 CLAUDE.md: correct the LUX panel description to the shipped values
6bd7217 2026-08-06 Utility cards: rebuild to match the LUX card
893bd8b 2026-08-06 Utility readouts: drop the boxes, blur the field, keep the logos
45485f0 2026-08-06 Regenerate the three utility photos without the fake marketing copy
384c07d 2026-08-06 Move the utility card text onto the photo
db9ffcc 2026-08-06 CLAUDE.md: record which photos are real, and never to strip Jeff out of them
473f122 2026-08-06 CLAUDE.md: correct the Mercedes PIN claim - the options dict was empty
e3d6de2 2026-08-06 Mercedes PIN: real root cause is RIS_PIN_INVALID, not a missing PIN
eb0852f 2026-08-06 Mercedes remote start: Mercedes enforces an attempt limit between key starts
adcf16c 2026-08-06 Mercedes remote start CONFIRMED WORKING from the app
ac38933 2026-08-08 Log Jeff's smart lighting plan, flag one real issue before ordering
f099165 2026-08-08 Merge parallel-session work (Mercedes/car/weather/irrigation photo overlays, glass redesign) with lighting-plan doc commit
8d53af4 2026-08-08 Research + write the SONOFF MINI DRY garage door setup plan
feee336 2026-08-08 Resolve garage door install placement, MyQ coexistence, power source
f84f8d8 2026-08-08 Log MyQ sale decision, research + recommend a Zigbee position sensor
22fd9e1 2026-08-08 Fix photo-overlay readouts to scale correctly on web/TV widths
4c3380e 2026-08-08 Fix Garden zone's missing live photo, make zone cards responsive
20ca199 2026-08-08 Add Watch Sling chip to Guardian's Quick Actions
a1a65fe 2026-08-08 Wire garage door app-side for the SONOFF MINI DRY relay + future sensor
c997266 2026-08-08 Verify camera fresh-picture refresh; fix silent Refresh All failures
5d22cf7 2026-08-08 Fix hero photo frozen at 560px across nearly the whole iPad-landscape range
480afd2 2026-08-08 Move irrigation hero panel off Jeff onto the clear bottom strip
436ce61 2026-08-08 Reposition irrigation hero panel to bottom-right per follow-up
a3caae3 2026-08-08 Widen irrigation hero panel to full-width bottom bar
f70a23f 2026-08-08 Add Smart Zones to the irrigation hero panel
c214610 2026-08-08 Align irrigation hero panel sizing with the other hero readouts
28de83e 2026-08-08 Merge B-Hyve Intelligence + Lawn Water Need into one card
dcfa39b 2026-08-08 Fix Mercedes dashboard readout bleeding onto the F-250 truck photo
e988eaa 2026-08-08 Drop watering-verdict banner, fix idle status showing as a warning
9c415ab 2026-08-08 Add Braves Vision quick-action chip to Guardian
9da43a5 2026-08-08 Add self-healing CSS auto-rotate for wall-mounted iPad kiosk
24136c7 2026-08-08 Revert speculative auto-rotate CSS for wall iPad
bb9d1cf 2026-08-08 Revert hero max-height clamp() - regression per Jeff's timeline
60c5d28 2026-08-10 Fix mower sensor heartbeat erasing the whole mow's data
723eeab 2026-08-10 Add real mow-to-mow sensor history, not just a preserved snapshot
ee21a1e 2026-08-10 Add full raw sensor reading log - every field, every reading
a2779b5 2026-08-10 Add permanent rule: check real date/time, never assume
7adc108 2026-08-10 Rebuild yard map: fix the real explode bug + cumulative coverage
5a0cea9 2026-08-10 Move GPS coverage server-side so it records automatically
333adcf 2026-08-10 Log the full raw sensor payload - fix whitelist dropping real data
5959b55 2026-08-10 Real georeferenced satellite basemap - alignment eliminated
6d37ff0 2026-08-10 True-north confirmed, GPS outlier rejection, fix Fort Worth sim bug
f29e517 2026-08-10 Fix yard map framing and blur; add sharper imagery source
1d6c109 2026-08-10 Record: satellite yard map confirmed working on Jeff's real device
d3749b9 2026-08-10 Coverage counts visits, so the map sharpens instead of bloating
68f4b7b 2026-08-10 Add GPS track smoothing and a forgot-to-resume pause safety net
b568a4b 2026-08-10 Fix: coverage map blew out localStorage and reset the hour meter
86b47e6 2026-08-11 Audit out the next storage time bomb; deterministic hero sizing
e5d57f4 2026-08-11 Keep Jeff's head in frame on the yard hero
af6df04 2026-08-11 Close the light-mode contrast bug class (pending item 17)
d18db7b 2026-08-11 hours.js: make the mow history actually record, and stop mapping parked drift
176ec08 2026-08-11 CLAUDE.md: firmware is in the repo now, and the box takes commands
46c7450 2026-08-14 CLAUDE.md: single-session mode - beast/coworker session now owns app code too (Jeff's call 08-14)
7a1d250 2026-08-15 Audit 2026-08-15: security headers, backyard AI threshold finding, doc corrections
fab5b30 2026-08-16 Restructure CLAUDE.md 260KB -> 58KB; all six cameras to confidence 25
007e14e 2026-08-16 ﻿CLAUDE.md: close stale Pending Item 19 (garage switch) - superseded by Inovelli
c30b64d 2026-08-16 ﻿CLAUDE.md: add SETTLED DECISIONS section - the current lighting/mesh plan
c05d647 2026-08-16 ﻿CORRECTION: the Kasa+plugs plan WAS documented - point everything at it
```
