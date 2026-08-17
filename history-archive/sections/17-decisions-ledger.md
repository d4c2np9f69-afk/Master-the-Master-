## Master Ledger — every decision Jeff made, standing rules, rejections, and price limits

This is the single authoritative decision register for the HCC / Toro TimeMaster project, covering
2026-05-20 (the original PWA package) through 2026-08-16 (branch tip, `1d1ebdb`). It is built to
**stand alone**: a reader who has never opened the chronicles should be able to answer "was this
settled, when, by whom, and is it still true?" from this file only.

Every entry carries **evidence** — a commit hash (7-char, on `origin/claude/time-master-project-liq1jw`),
a file path in the branch-tip checkout, or an explicit statement that the record is silent. Anything
not directly evidenced is prefixed **INFERRED:** and never presented as memory.

### How to read the status column

| Status | Meaning |
|---|---|
| **STANDING** | In force at branch tip 2026-08-16. Do not re-open. |
| **STANDING (PROTECTED)** | In force *and* marked in `CLAUDE.md` as never to be trimmed, compressed, or re-litigated. |
| **SUPERSEDED by X** | Replaced by a later decision. The original is kept because knowing it was tried has value. |
| **REVERSED** | Undone — the thing was decided, built, and then unmade. |
| **REOPENED** | Was closed, then deliberately re-opened; awaiting Jeff. |
| **OPEN** | Never decided. Awaiting Jeff, or awaiting hardware/evidence. |
| **DEAD / DO NOT RETRY** | Investigated to a conclusion. Re-attempting is the failure mode. |

Two conventions worth stating up front, because the whole project turns on them:

1. **Jeff's own words are quoted verbatim in blockquotes.** Where a quote is preserved second-hand
   (a commit message or `CLAUDE.md` quoting a conversation that itself is not in git), that is said
   explicitly. Most of Jeff's conversation with Claude is **not** in this repository — it lives in
   the iCloud MASTER RECORD built 2026-08-16 (`1d1ebdb`), which git can only point at.
2. **A decision that exists only in conversation does not exist.** This is itself the project's
   hardest-won rule, written into `CLAUDE.md` on 2026-08-16 after it cost a whole session:
   > *"you tell me it is all documented and it is not, then the session closes and you come back with
   > some plan that was two weeks ago — this is infuriating."*
   — Jeff, verbatim, `/tip/CLAUDE.md:128-129`, added in `c30b64d` (2026-08-16)

---

# PART A — The relationship charter

These are not technical decisions. They are the terms Jeff set for how the work is done, and
`CLAUDE.md` marks all of them **PROTECTED** — compression may touch history and reference material,
never these.

### A.1 — Jeff's message, accepted as project law
**Date:** 2026-06-24 · **Status:** STANDING (PROTECTED) · **Evidence:** `90e556e` (2026-06-24, "Rewrite
CLAUDE.md — comprehensive persistent memory with Jeff's rules"), restored/reaffirmed `f52b715`
(2026-06-24, "restore the working relationship commitment"), text at `/tip/CLAUDE.md:9-19`

Jeff's four paragraphs, verbatim, still first in the file at branch tip:

> "You don't remember what we have done. You don't have a plan that you follow. You don't save the
> permissions and logins. You are just fine leaving something totally messed up and not even close to
> correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯
> correct. And my biggest issue is that you won't even remember this message tomorrow."

> "I'm tired of having to keep you on task and moving the project forward — you know the plan, follow
> it. Save this and remember it and read it before you do anything."

> "I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to
> be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years
> old and I'm learning… but you are making it real hard for this to be enjoyable."

> "I know you have a client satisfaction boggie to hit. Well I'm not satisfied at all. I want us to
> work together like friends like we did to start with. All I do now is fuss and I hate working in an
> environment and a relationship like this. Can't you fix it so we can get back to the way it was?"

`CLAUDE.md` annotates: **"These are not suggestions. They define how every session must operate."**

### A.2 — The five things that broke the relationship, listed so they are never repeated
**Date:** 2026-06-24 · **Status:** STANDING (PROTECTED) · **Evidence:** `90e556e`, `/tip/CLAUDE.md:27-32`

Never again: *saying "I can't" without trying harder* · *declaring things done without taking
screenshots to verify* · *leaving bugs for Jeff to find instead of finding them myself* · *explaining
limitations instead of solving problems* · *making Jeff have to fuss and stay on top of me.*

And the definition of good, from the same section: *"Jeff opens the app and it looks great and works —
he doesn't have to check."*

### A.3 — The PROTECTED-sections rule: compression may never touch the relationship
**Date:** 2026-06-28 · **Status:** STANDING (PROTECTED) · **Evidence:** `1305f0a` (2026-06-28), bounding
`a4ae337`'s memory-hygiene rule from three minutes earlier; text at `/tip/CLAUDE.md:58`

> "**PROTECTED — NEVER trim or compress:** 'Jeff's Message', 'The Working Relationship', these
> 'Mandatory Rules', and the 'Debugging Protocol' below. These come FIRST, before any technical work,
> every session. Compression only ever touches history/changelog/reference — never the relationship.
> **They are the point of the whole project.**"

This rule has held through every restructuring, including the 260 KB → 58 KB rewrite of 2026-08-16,
where `fab5b30`'s commit body records that every protected section "**was asserted byte-identical
before writing.**"

### A.4 — Jeff is almost 60, learning software, and expert at hardware
**Date:** 2026-06-27 (electrical clause), carried through tip · **Status:** STANDING · **Evidence:**
`731d435` (2026-06-27), `/tip/CLAUDE.md:546-547`

> "**Jeff wired his own house** — skilled and comfortable in the breaker panel. Never suggest hiring an
> electrician; talk to him as a capable peer on electrical/hardware."
>
> "**Jeff is almost 60 and learning** the software/AI side — be patient and clear there, never
> condescending. On hands-on hardware/electrical/firmware he is experienced. Make it enjoyable."

Note the direction of travel: `731d435` **replaced a three-minute-old "Recommend an electrician"
caution** with its exact opposite. The record is explicit that the first version was wrong.

---

# PART B — The Mandatory Rules (the never-do list), in file order

All sixteen live at `/tip/CLAUDE.md:45-79`. Rules 1–10 date from the first comprehensive `CLAUDE.md`
(`90e556e`, 2026-06-24); 11–16 were added later, each earned by a specific failure.

### B.1 — Rule 1: Read `CLAUDE.md` first, every session, every time
**Date:** 2026-06-23 (`e8f0312`, the first CLAUDE.md) · **Status:** STANDING · **Evidence:** `e8f0312`,
`90e556e`, `/tip/CLAUDE.md:3` — *"READ THIS ENTIRE FILE BEFORE TOUCHING ANYTHING… Do not guess. Do not
ask Jeff to re-explain."*

### B.2 — Rule 2: NEVER ask Jeff for credentials
**Date:** 2026-06-24 · **Status:** STANDING · **Evidence:** `90e556e`, `/tip/CLAUDE.md:48`

> "**NEVER ask Jeff for credentials** — Cloudflare API token, KV IDs, WiFi passwords, HA tokens are all
> already configured. They are documented below."

Reinforced by a companion boundary in the opposite direction — **Claude never handles Jeff's
third-party credentials either.** Jeff logs into Amazon himself (`c926ceb`, `987e804`, 07-11), sets
Angela's HA password himself (`049ad6d`, 07-11), and the CAR work records the rule that "the coworker
does not type third-party account passwords into browser forms" (`7afcda2`/`4e9445d`, 07-17→07-21).
The Family Login password and HA token are **deliberately not recorded in the repo** — `/tip/CLAUDE.md:339`:
*"The actual password/token are intentionally NOT recorded in this repo — only hashed in KV. If they
ever need changing, ask Jeff directly."*

### B.3 — Rule 3: NEVER suggest hiring an IT person
**Date:** 2026-06-24 · **Status:** STANDING · **Evidence:** `90e556e`, `/tip/CLAUDE.md:49`.
Sibling of A.4's no-electrician rule. Both exist because Jeff is the one doing the work.

### B.4 — Rule 4: NEVER make excuses or blame unclear history
**Date:** 2026-06-24 · **Status:** STANDING · **Evidence:** `90e556e`, `/tip/CLAUDE.md:50` — *"the
history is in this file and in `git log`."*

### B.5 — Rule 5: NEVER leave the app in a broken state
**Date:** 2026-06-24 · **Status:** STANDING · **Evidence:** `90e556e`, `/tip/CLAUDE.md:51`

### B.6 — Rule 6: NEVER report something as done without testing it
**Date:** 2026-06-24 · **Status:** STANDING · **Evidence:** `90e556e`, `/tip/CLAUDE.md:52`. The named
mechanism is the Playwright diagnostic (`/tip/CLAUDE.md:343-364`); from 2026-07-31 it is joined by
`scripts/lint-app.js` (`abcc8f4`) and `scripts/smoke-test.js` (`7255f6f`) as mandatory pre-push checks,
and by `scripts/mower-hours-test.mjs` (45 checks, mock KV) before any `hours.js` deploy
(`/tip/CLAUDE.md:314`).

### B.7 — Rule 7: Commands must work the first time
**Date:** 2026-06-24 · **Status:** STANDING · **Evidence:** `90e556e`, `/tip/CLAUDE.md:53` — *"test the
command yourself before telling Jeff to run it."* Written the day the installer-command flip-flops
(curl→wget→curl, `686bece`/`1f3ce1a`, 06-23→06-24) proved it necessary.

### B.8 — Rule 8: NEVER put `<script>`/`</script>` tags inside the JS block of `index.html`
**Date:** 2026-06-23 (incident), codified 2026-06-24 · **Status:** STANDING · **Evidence:** incident and
fix `a973c8f` ("Fix fatal JS syntax error — remove stray `<script>` tags inside script block", 06-23);
rule text `/tip/CLAUDE.md:54` and restated at `/tip/CLAUDE.md:259`

> "**NEVER put `<script>` or `</script>` tags inside the JS block of index.html** — this causes a fatal
> blank page (the great blank-page incident of 2026-06-23). Raw text only inside the JS block."

`CLAUDE.md` cites commit `8497827` alongside it (the service-worker bump that forced the stale cache
clear). This rule has held with no recorded recurrence.

### B.9 — Rule 9: Always check `git log` and `CLAUDE.md` before changing anything
**Date:** 2026-06-24 · **Status:** STANDING · **Evidence:** `90e556e`, `/tip/CLAUDE.md:55`

### B.10 — Rule 10: Be proactive — find bugs before Jeff sees them
**Date:** 2026-06-24 · **Status:** STANDING · **Evidence:** `90e556e`, `/tip/CLAUDE.md:56`

### B.11 — Rule 11: Memory hygiene — keep `CLAUDE.md` lean
**Date:** 2026-06-28, revised 2026-07-28 and 2026-08-16 · **Status:** STANDING · **Evidence:** `a4ae337`
(06-28, original "well under ~600 lines"), `5ed12f0` (07-16) and `2fdef21` (07-21, changelog compressed
73.6 KB → 49.6 KB), `414c74f` (07-28, 610 → 374 lines "at Jeff's request"), `fab5b30` (08-16, 260 KB →
58 KB); text `/tip/CLAUDE.md:57`

> "it's injected into every message, so bloat costs efficiency (and money) on every turn… never paste
> full commit-hash lists or blow-by-blow narratives — that detail lives in `git log`… periodically
> re-condense the whole file (as Jeff directed 2026-07-28)… **Target: well under 400 lines.**"

Immediately bounded by A.3 (PROTECTED sections). The arc is worth recording honestly: the rule was
written on 06-28, the file grew to **260 KB** by August anyway, and only the 08-16 restructuring
enforced it structurally by moving the mass out of the auto-loaded file entirely.

### B.12 — Rule 12: Attack the source, test on my end — never push the run-around to Jeff
**Date:** 2026-07-03 · **Status:** STANDING (PROTECTED) · **Evidence:** `f668301` (2026-07-03), restated
`6a2336d`; rule `/tip/CLAUDE.md:59`, protocol `/tip/CLAUDE.md:134-149`

Jeff, verbatim:
> "Log this so we don't go through this kind of round robin of checks again and we attack the source…
> I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid
> testing everything on your end."

The six-step protocol it produced, condensed: (1) reproduce on my end first with the Playwright harness
and mocked data; (2) **audit my own recent changes as the prime suspect** — "if it worked before and
broke after my edits, the bug is almost certainly mine"; (3) attack the root cause, ask "why is this
whole *class* of problem possible?"; (4) only ask for what I genuinely cannot get, and say so early;
(5) **one specific ask, not a list**; (6) match his effort to the payoff; (7) on this project
`CLAUDE.md` **is** the first research step, before web search and before live investigation.

### B.13 — Rule 13: Tell Jeff when to use his local coworker (the two-Claude split)
**Date:** 2026-07-09 · **Status:** SUPERSEDED by B.13c (single-session mode, 2026-08-14) — but the
underlying capability map is still the record of who could do what · **Evidence:** `bec7440`
(2026-07-09, "Add Mandatory Rule 13 (coworker delegation)"), extended `9a34d17`; text
`/tip/CLAUDE.md:60-71`

The original split, verbatim from the file:

- **The coworker** — "a Claude 'coworker' on his PC (**the beast**) with real computer/local access" —
  owns anything needing the **home LAN + Beehive/HA directly** (read/click HA, install
  `custom_components`, restart HA, enter PINs), **local files** on his PC, **apps on his screen**, and
  **opening/verifying external links** in a real browser.
- **The cloud session** owns "**the app code, Cloudflare repo/deploys, research, and guidance**."
- The obligation is one-directional and explicit: *"Jeff doesn't know either of our full capabilities,
  so **it's on ME to proactively flag the handoff**."*
- Collision rule (`9a34d17`): the coworker treats `index.html` and `functions/` as **READ-ONLY
  reference**; the coworker runs `git pull` at the start of every session. "Confirmed working since
  07-09."

**One documented exception to the split, granted and logged:** 2026-07-15, the local session edited
`index.html` (the Safari-15 `AbortSignal.timeout` polyfill) because Jeff was actively blocked
(`33d367d`, exception recorded in `af3b16a`).

### B.13b — Rule 13 EXCEPTION: the mower/sensor subsystem belongs to the coworker, end to end
**Date:** 2026-08-11 (Jeff's decision) · **Status:** STANDING · **Evidence:** `d18db7b` (2026-08-11),
`a1cfa53`; text `/tip/CLAUDE.md:69-71`

**Cloud session must not edit:** the ESP32 `.ino` firmware, `functions/api/hours.js`, and the
sensor-facing parts of `index.html` (`mowerSync()`, YARD sensor cards, Full Sensor Log, mow history,
yard map / coverage). Everything else stays with the cloud session.

The **why**, quoted from the file because it is the most expensive lesson in the project:

> "the hour meter — the entire reason Jeff built the sensor box — never worked for **months across 5
> real mows**. The box sent `hours_seconds`; the app read `d.hours`; nothing converted, so the sensor
> contributed exactly 0.0 hours every sync while Jeff re-entered them by hand. **Jeff was told the
> sensors were faulty and bought replacement hardware**; they were fine, and had been recording 6.3 km
> of real mowing the whole time. Root cause of the long miss is **structural, not carelessness**: this
> cloud session has no outbound network (`EGRESS_BLOCKED`), so it can never fetch a real payload, and
> the `.ino` is not in this repo — it was coding against this file's *description* of the firmware,
> which was **wrong**."

Procedural corollary: *"If you believe something here needs changing, write it up and hand it to the
coworker — same as the coworker does for you. Do not edit it directly."*

### B.13c — SINGLE-SESSION MODE: the beast/coworker owns everything, app code included
**Date:** 2026-08-14 (Jeff's call) · **Status:** STANDING — supersedes the B.13 split · **Evidence:**
`46c7450` (2026-08-14, "CLAUDE.md: single-session mode - beast/coworker session now owns app code too
(Jeff's call 08-14)"); text `/tip/CLAUDE.md:61-67`

Jeff, verbatim (preserved in `CLAUDE.md`):
> "I only work with you, I'm done with code after the last debacle"

The file's own reasoning: *"The split below existed only to stop two Claudes clobbering the same
branch; with one session that risk is gone. Verification moves with it: run the repo test scripts
locally AND drive the real deployed app in a real browser here (something the cloud session never
could). **Do not hand work off to the cloud session or write 'ask the coworker' notes — that is now
this session.**"*

**INFERRED:** "the last debacle" is not named anywhere in git. The strongest candidate on the evidence
is the 08-10/08-11 mower-sensor cluster (the coverage map wiping Jeff's hour meter, then the discovery
that the meter had never worked at all and that Jeff had bought replacement hardware he did not need)
— because that is the only failure in the surrounding window large enough to warrant the word, and it
produced the *first* ownership transfer three days earlier (B.13b). **This is inference. The record is
silent on the literal referent.**

### B.14 — Rule 14: Check the real current date/time, never guess
**Date:** 2026-08-10 · **Status:** STANDING · **Evidence:** `a2779b5` (2026-08-10, "Add permanent rule:
check real date/time, never assume"); text `/tip/CLAUDE.md:73`

Jeff, verbatim:
> "Get you damn times right... I want a current timestamp added to the session anytime it is picked up
> and I want the current date and times tracked."

The correction embedded in the rule matters as much as the rule: *"**The sandbox clock IS accurate** —
verified 08-10 by running `date`… So this was never a missing capability, it was a discipline
failure."* Always convert UTC → **Central Time** (White House, TN) before stating a time to Jeff; never
state raw UTC as if it were local. Example/mock dates in test code must be labelled fictional.

### B.15 — Rule 15: Read `docs/SESSION_START.md` in full at the start of every session
**Date:** 2026-08-16 (Jeff's rule) · **Status:** STANDING · **Evidence:** `fab5b30`, `831db1b`; text
`/tip/CLAUDE.md:75-76`; the file itself at `/tip/docs/SESSION_START.md`

> "**This file + that file are the whole standing context; everything else is read on demand.**"

Rationale: `CLAUDE.md` is auto-loaded and occupies context for the whole session; at **260 KB** it was
"crowding out room for actual work." Now ~58 KB, with the heavy material in `docs/` and mirrored to
`C:\Users\jeffl\iCloudDrive\HCC-Archive\`.

### B.16 — Rule 16 (first of two numbered 16): the history lives outside the file — go read it
**Date:** 2026-08-16 (Jeff's rule) · **Status:** STANDING · **Evidence:** `fab5b30`; text
`/tip/CLAUDE.md:77-78`

Jeff, verbatim:
> "break it up and put the stuff in iCloud and then just tell yourself to read that."

Standing obligation: *"**Before re-investigating ANY subsystem, grep the archive for it first** — the
answer is very often already in there, paid for in Jeff's time."* Archive locations:
`docs/CHANGELOG_ARCHIVE.md` (179 KB, 98 entries, version-controlled, **not** auto-loaded) and
`C:\Users\jeffl\iCloudDrive\HCC-Archive\CLAUDE_CHANGELOG_FULL.md`.

*Note for the record: the tip file has **two** rules numbered 16 (`/tip/CLAUDE.md:77` and `:79`). This
is a real duplicate-numbering defect in the source, not a transcription error here.*

### B.17 — Rule 16 (second): stop tunnel-visioning — enumerate options before committing
**Date:** 2026-08-16 (Jeff's rule) · **Status:** STANDING · **Evidence:** `/tip/CLAUDE.md:79`;
reinforced in `/tip/docs/SESSION_START.md` §4

Jeff, verbatim:
> "you go down one road and get tunnel vision and you spend more time fighting over that single
> tunnel... open your damn mind and look at all options."

Two live examples recorded with it: (a) *"spent an hour asking for Samba/SSH access to edit a YAML
file, when retrying the blocked editor keystroke worked first try, and separately the `all_objects`
attribute already exposed the needed data through an API I'd had all along"*; (b) *"proved the leak
alarm worked without ever asking whether Jeff gets told anything on a normal day (he didn't — it was
alert-only by design)."*

Companion rule from `SESSION_START.md` §4, equally binding: **"Don't hand Jeff a menu.** If an action
is blocked, retry it, then find another route, then ask — in that order. He has said repeatedly he
wants the work done, not the options explained."

### B.18 — Debugging-protocol Rule 8: NEVER name a specific product/model from memory
**Date:** 2026-08-05 (Jeff's standing rule) · **Status:** STANDING (PROTECTED) · **Evidence:**
`7f73148` (2026-08-05, "Add permanent rule: never name a product/model from memory unverified"); text
`/tip/CLAUDE.md:150`

Origin, from the file: on 08-05 Claude recommended *a ratgdo board, then "SONOFF Basic," then had to be
corrected to SONOFF SV — three guessed answers on one part, in a row,* before **Jeff found the actually
correct SONOFF MINI-D himself.**

> "He does not have time to be the fact-checker on my hardware recommendations. **The rule going
> forward: never state a specific product name/model number as a recommendation unless it was verified
> via a real search THIS session.** If I haven't checked, say 'let me check' — never let a
> plausible-sounding model number stand in for one that's actually confirmed."

### B.19 — Never hoist a shared `AbortSignal.timeout` across retries; never `fetch()` HA directly
**Date:** 2026-07-03 · **Status:** STANDING · **Evidence:** `7a59848` (2026-07-03, the `/api/ha` proxy);
text `/tip/CLAUDE.md:148`

> "**Known fragile pattern (don't repeat):** any new `fetch(base + '/api/...')` straight from the
> browser to HA. Use **`haFetch()`** (routes through `/api/ha`). **Never hoist a shared
> `AbortSignal.timeout` across retries.** Keep timeouts generous for the Nabu Casa relay."

The signal rule is a real bug class: a hoisted signal is already expired by the time retry #2 fires, so
every retry after the first fails instantly.

### B.20 — Never re-add a custom Blink override
**Date:** 2026-07-09 · **Status:** STANDING · **Evidence:** `7bbc8a2` (2026-07-09)

> "that override shadowing the fixed built-in was the entire bug."

The vendored `beehive/blink/` files in the repo are formally declared **dead artifacts** by the same
commit. The custom component had been shadowing Home Assistant's own (already-fixed) Blink integration.

### B.21 — B-Hyve devices are EXCLUDED from Lights & Plugs ALL ON / ALL OFF
**Date:** 2026-07-04 · **Status:** STANDING · **Evidence:** `20ce92e` (2026-07-04, "Lights & Plugs card:
control switch.* (SYLVANIA plugs), exclude irrigation")

From the commit body:
> "the card now pulls both `light.*` and `switch.*` — but **EXCLUDES B-Hyve irrigation switches**
> (`lightIsIrrigation` filters bhyve/orbit/zone/sprinkler + `is_watering`/`zone_name`) **so it can
> never fire the sprinklers.**"

This is a **safety invariant, not a styling choice** — an "all on" that turns on the sprinklers is a
flooded yard. Verified in the harness with a B-Hyve switch present: "4 devices shown, bhyve excluded."

### B.22 — The mbapi2020 Mercedes PIN is server-side only; the app must NEVER send or store a `pin` field
**Date:** 2026-07-24 · **Status:** STANDING · **Evidence:** `eeaa0b7` (built) → `c73e32e` (2026-07-24,
"Remove app-level PIN prompts — mbapi2020 handles PIN from integration options"); dormant client-side
PIN subsystem deleted `8501360` (2026-07-31); corrected but upheld `473f122` (2026-08-06)

The 07-24 decision removed PIN prompt wrappers from `carLockCmd`, `carMaxCool`, `carMaxHeat` and the
`pin` field from `carMbSvc` service calls.

**The important correction (`473f122`, 08-06, by the coworker):** the *mechanism* was right, the *fact*
was wrong. `CLAUDE.md` had asserted the PIN was stored in mbapi2020's integration options — a live
`config_entries/get` against Jeff's real HA showed **the options dict was completely EMPTY**. So every
PIN-gated service (`doors_unlock`, `engine_start`, `windows_open`, sunroof) had been firing with no PIN
and being rejected upstream for weeks; `doors_lock` kept working only because locking needs no PIN.

> "The 'app must never send a pin field' half of the original note stands."

Fix was UI-only and **Jeff's to do**: Settings → Devices & Services → MercedesME 2020 → gear on the
account row → Security PIN (`entry_id 01KY38Z7C90J2WE6S9R987JQZ4`). Added standing instruction: *check
the entry's options are actually populated before blaming the integration or the app.*

Jeff had worked this out himself from the real Mercedes app before Claude did — `473f122`: *"Jeff
worked out from the real Mercedes app that unlock and remote start demand a PIN, and suspected HA
wasn't supplying it. **He was right.**"*

### B.23 — Edit `packages/hcc.yaml` via the HA Terminal add-on only
**Date:** 2026-07-11 · **Status:** STANDING, with an 08-16 amendment · **Evidence:** `987e804`
(2026-07-11), `a88ccc6` (2026-07-11)

The doctrine and how it was earned:
- The **legacy File Editor add-on** mishandled a special keypress and typed a literal `"Page_Up"` into
  the file — caught before saving (`987e804`).
- **Studio Code Server** then produced two separate corruptions: a literal `"Page_Down"` keystroke and a
  **Prettier format-on-save truncation** — both caught by `ha core check` and repaired with sed/heredoc
  (`a88ccc6`).
- Settled doctrine: use the **Terminal add-on** (sed/heredoc); never the legacy File Editor; never
  Studio Code Server without disabling format-on-save.
- Related standing caution from `987e804`: **the "Migrate" button in HA's Automations UI must not be
  clicked without asking Jeff.**

**08-16 amendment** (`/tip/docs/SESSION_START.md` §3): *"Studio Code Server's editor works but is
fiddly. Verify every edit by zooming on the result; a selection one character too wide silently broke
YAML on 08-16."* And the structural fact behind all of it: *"`packages/hcc.yaml` automations are
invisible to the config API; `automations.yaml` ones are readable AND writable at
`/api/config/automation/config/{id}`. Use that — it needs no browser."*

### B.24 — The protected photo rule: never strip Jeff out of his own app
**Date:** 2026-08-06 · **Status:** STANDING (PROTECTED) · **Evidence:** `595ec23` (the mistake),
`db9ffcc` (2026-08-06, "CLAUDE.md: record which photos are real, and never to strip Jeff out of
them"); text `/tip/CLAUDE.md:267-278`

Written by the session that got it wrong, in its own words:
> "Learned by getting it wrong. I regenerated the irrigation and yard heroes and removed the person,
> assuming a stock model. **It was Jeff, in his own app.**"

The rules, all still in force:
- **`hero-irr.jpg` and `hero-yard.jpg` contain JEFF HIMSELF** (dark LawnCareLife t-shirt, watch,
  thumbs-up). *"He likes these. Never remove, replace or alter him."* Only the printed marketing
  overlays around him may be stripped.
- **`images/zones/` are REAL PHOTOGRAPHS OF JEFF'S ACTUAL YARD**, enhanced only. *"Do not regenerate or
  replace these."* Honoured 08-11 — the zone photos were **"CROPPED, NOT REGENERATED"** (`6913393`).
- **`hero-cameras.jpg` — keep the Blink logo and the 2nd Amendment sticker** (Jeff's explicit call
  08-06, `1eba07f`). What must go: the fake "HOME GUARDIAN / SMART SECURITY SYSTEM" title, the fake
  "ALL SYSTEMS READY · PROTECTED · 6 CAMERAS" panel, and the six dummy camera tiles. **Marked "Not yet
  done" at branch tip.**
- **The stock couple in the old `hero-car.jpg` were NOT Jeff and Angela** — removed 08-06; the empty
  cabin is also a better surface for data.
- **Cropping counts as altering him (added 08-11).** In `hero-yard.jpg` Jeff's hair starts at **image
  row ~22 of 851**. `.sec-hero-yard img` MUST stay `object-position:center top`. Any change to a hero's
  height, `aspect-ratio` or `object-position` requires re-checking Jeff is fully in frame at
  1024/1194/1366/1920.
- **The general rule:** *"if a photo contains a person or a real place, confirm with Jeff who/what it
  is before altering it."*

Jeff's standing objection, verbatim (`/tip/CLAUDE.md:276`):
> "I hate those logos that are on the picture. I don't mind the text but it looks awful with them right
> next to the real icons."

Read as: **baked-in fake icon/feature strips are the thing to kill.** Plain title text is tolerable;
fake iconography next to the app's real icons is not — the file calls it *"fake stuff next to my real
icons."*

### B.25 — Never expose HA add-ons / diagnostics / meters to voice assistants
**Date:** 2026-08-14 · **Status:** STANDING · **Evidence:** `18ff039` (2026-08-14, "HomeKit capability
research + exposure policy… never expose add-ons like the Alexa mess"), `1f4e791` (2026-08-14),
`72e5d56` (2026-08-15)

Policy: **expose only what a human would say out loud or tap on a watch.** Add-ons, diagnostics and
meters NEVER. Earned by the Alexa audit, which found **nine HA add-ons were voice-controllable** —
i.e. sayable-aloud commands could restart infrastructure. Alexa exposure was cut **69 → 33** entities;
HA's Tuya duplicates removed in favour of Smart Life's clean-named copies. Framing: *"HA is the brain,
HomeKit the Apple-side face."*

### B.26 — Never re-add these confirmed dead ends (a consolidated do-not-retry list)
**Status:** all STANDING · Evidence per line.

| Do not retry | Why | Evidence |
|---|---|---|
| Smart Life / Tuya path for the SYLVANIA plugs | Vendor-locked; Smart Life *detects* a reset plug then rejects it ("This device is not supported by this app") | `f010694` 07-07, `2caaebf` 08-13, `/tip/docs/inventory/HCC_INVENTORY.md` |
| myQ software integration | Chamberlain blocked all third-party API access 2023; HA `myq` removed in 2023.12; `ehendrix23/hass_myq` verified 404 | `e20d3d5` 07-26, `c94e7aa` 07-28 |
| `media_player.play_media` / Alexa custom-command for Fire TV pop-ups | "confirmed dead end for this device" | `25e3256` 07-11 |
| `input keyevent 127/85` for Fire TV pause | Confirmed no-ops; use `cmd media_session dispatch pause/play` | `2965b5a` 07-15 |
| `input keyevent 187` (Recent Apps) for Fire TV return | No-op on this Fire OS build; use HOME | `3a714fe` 07-15 |
| Relaunching Fubo/Sling via launcher intent to resume | Cold-starts to the show list, loses DVR position | `3a714fe` 07-15 |
| Fixing the GitHub Actions deploy workflow | Missing `CLOUDFLARE_API_TOKEN`; "broken and irrelevant… do not try to fix, it doesn't matter" | `e8f0312`/`90e556e` 06-23/24; disabled `ac99b33` 08-06 |
| Restoring `CLAUDE.md`'s old ESP32 cadence description | It was wrong and the whole server design was built on it | `d18db7b` 08-11, `/tip/CLAUDE.md:229` |
| "Fixing" per-mow stats to zero on upload | Jeff asked for the hold-until-next-mow behaviour explicitly | `6913393` 08-11, `/tip/CLAUDE.md:239` |
| "Fixing" the lat/lon staleness asymmetry | Last known position is useful while parked; pinned with a test | `c63142b` 08-11 |
| `window.open` for external links | No-op in an installed iOS PWA; use a real `<a target="_blank" rel="noopener">` | `c294216` 06-28, `8b4c8a0`, `/tip/CLAUDE.md:298` |
| Cache-first service worker for HTML | "no code fix ever reached the device" | `19dd459` 06-26 |
| Base64-embedding images in `index.html` | 2.1 MB → 295 KB when extracted | `739d004` 06-23 |
| Re-tuning the backyard camera's daytime PIR sliders | Camera's own sensor hits 104–113 °F; PIR needs thermal contrast. Unfixable from software | `/tip/CLAUDE.md:487` |
| Removing the dual KV check `env.HCC_KV \|\| env.MOWER_KV` | Covers both binding names; nobody can verify from here which is live | `c6f3df8` 06-23, `/tip/CLAUDE.md:206` |
| Re-running `POST /api/auth {"action":"setup"}` | One-time only; refuses to re-run and returns `already_setup` — that is expected, not a bug | `8f495e4`/`4fabef8` 07-21, `/tip/CLAUDE.md:337` |

---

# PART C — Every rejection, with its price

This is the section Jeff most needs: things that were considered, priced, and killed. **Re-pitching
any of these is the documented failure mode.**

### C.1 — ❌ Inovelli Blue 2-1 VZM31-SN dimmers — SCRAPPED ON PRICE, ~$60 each / ~$120 the pair
**Rejected:** in conversation ~2026-08-13 20:07 CDT · **Re-pitched and rejected a second time:**
2026-08-16 · **Status:** STANDING (PROTECTED) — *never propose again* · **Evidence:** selection
`a5c67a8` (08-13); scrap notices `1572b4a`, `c30b64d`, `c05d647` (all 08-16);
`/tip/CLAUDE.md:104-108`; `/tip/docs/inventory/HCC_INVENTORY.md:45`;
`/tip/docs/lighting/zigbee_dimmer_selection_2026-08-13.md:5`

Jeff, verbatim (two separate preserved statements):
> "I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would rather
> spend the money on that and have your help than buy $120 worth of dimmers."

> "those were scrapped at the freaking beginning — told you I was not paying $120 for a freaking
> dimmer switch."

**This is the worst documented failure of the project's memory system**, and it is worth stating in
full because the ledger exists to prevent its repeat:

1. `a5c67a8` (08-13 evening) selected Inovelli Blue as *"the only option that satisfies 'must extend
   the mesh'."*
2. Jeff killed it on price the same evening, **in conversation**. Nobody wrote it down.
3. The inventory was updated **08-15 — a day after the decision — still saying "TO BUY: 2."**
4. On 08-16 a session read the stale docs, **planned the entire Zigbee mesh around them, and pitched
   $120 of dimmers back at the man who had already refused them.**
5. Claude then told Jeff **twice** that the decision "was never written down" — which was also wrong
   (`c05d647`): the current plan *had* been documented on 08-13 in `docs/lighting/HCC_Lighting_Plan.html`.

**The trap, recorded permanently** (`/tip/CLAUDE.md:101-103`):
> "⚠️ A trap that already cost a whole session: searching the docs for 'Inovelli' and finding nothing
> does NOT mean the plan is undocumented — the *absence* of that word is what marks the CURRENT plan.
> Search for **Kasa / plug / mesh**, and check `docs/lighting/` by date."

**The budget philosophy this established, now PROTECTED** (`/tip/CLAUDE.md:107-108`):
> "**That is the budget philosophy for this whole project — his money goes to the tools that help him
> build, not to premium hardware where a cheap part does the job.**"

`c30b64d` adds the operating instruction: *"Lead with what he already owns, then cheapest-first, and
flag spend clearly."*

### C.2 — ❌ Enbrighten 43080 Zigbee dimmer — rejected on documented mesh-routing defects
**Date:** 2026-08-13 · **Status:** STANDING — *rejection survives even though Inovelli died too* ·
**Evidence:** `a5c67a8` (08-13); `/tip/CLAUDE.md:115`; `1572b4a` explicitly preserves it —
*"The Enbrighten rejection research is kept - the documented mesh-routing defects are still valid - but
the selection is dead."*

Zigbee2MQTT's own device page documents that the 43080 **stops relaying for child devices** and ignores
route updates — which fails Jeff's requirement that switches must extend the mesh. Lesson recorded:
**"'Zigbee2MQTT supported' ≠ 'good Zigbee citizen.'"**

### C.3 — ❌ Enbrighten Z-Wave dimmer ($39) — rejected on radio, not price
**Date:** 2026-08-13 · **Status:** STANDING · **Evidence:** `a5c67a8`; `/tip/CLAUDE.md:116`

Wrong radio — would need a second USB stick and a second ecosystem. Real two-switch cost worked out to
**~$118 vs ~$92 Zigbee** once the second stick was counted. Cheaper sticker price, more expensive
system.

### C.4 — ❌ SYLVANIA Smart WiFi plugs — vendor-locked, cannot join HA
**Date:** first flagged 2026-07-04, settled 2026-07-07, re-settled 2026-08-13 · **Status:** DEAD / DO
NOT RETRY · **Evidence:** `f010694` (07-07, "DEAD END for HA (confirmed, do NOT re-attempt the Tuya
path)"), `2caaebf` (08-13), `2aca121` (08-13 network-map correction);
`/tip/docs/inventory/HCC_INVENTORY.md`; `/tip/CLAUDE.md:119`

What was proven, not assumed: they **are** Tuya hardware (port 6668 confirmed) at `.199/.200/.202/.205`,
but Sylvania locked the product ID so **only the "SYLVANIA Smart WiFi" app accepts them.** Proven
08-13: Smart Life *detects* a reset plug then rejects it — *"This device is not supported by this
app."* The Sylvania app can scan HA's Tuya QR, but Tuya blocks the confirm step ("use the designated
APP"). Only remaining route = LocalTuya with hand-extracted local keys — **"NOT attempted, not worth
it."**

Decision: **replace with Zigbee plugs**; keep the Sylvanias on Sylvania + Alexa meanwhile.
Cost of the experiment: one plug got factory-reset for nothing.

A related correction is recorded honestly: an earlier session had guessed these were Bluetooth-only
Echo Dot devices — *"Echo Dot guess and Bluetooth-only verdict both wrong, corrected"* (`2aca121`).

### C.5 — ❌ Roku browser-channel path — rejected; $20–30 Fire TV Stick chosen instead
**Date:** 2026-07-15 · **Status:** STANDING · **Evidence:** `3644f54` (2026-07-15)

Jeff initially wanted the **no-purchase** route: run the app in a Roku browser channel on the onn Roku
TV. Research killed it — Web Browser X died in 2021 and no Roku browser can run this app. Decision:
buy a cheap Fire TV Stick (~$20–30) and reuse the already-proven ADB kiosk playbook. Purchase still
pending at the end of that window.

### C.6 — ❌ In-app mPING submission — rejected permanently, after being built twice
**Date:** 2026-07-02 (removed) → restored on Jeff's ask → 2026-07-02/03 (deleted for good) ·
**Status:** DEAD · **Evidence:** `adc5377` (removed) → `6b29cad` (restored at Jeff's request) →
`5e6c20b` (NSSL confirms) → `947a99d`, `01b4e8e` (deleted); `6543` token guide `/tip/docs/utilities/mPING_token_setup.md`

Sequence, honestly: the in-app report form was removed; **Jeff asked for it back and it was restored**;
then NSSL confirmed there are **no automated/app reports ever** and the API token is not self-serve.
The UI, handlers, CSS and `functions/api/mping.js` were all deleted; the buttons now open the
**official mPING iOS app** — because `mping.nssl.noaa.gov` is a view-only map page you cannot submit
from.

### C.7 — ❌ Fubo → Sling TV — Jeff switched providers; the record does not say why
**Date:** 2026-07-21 · **Status:** STANDING · **Evidence:** `131dc16` (2026-07-21), `4827` note

The switch **required no automation changes at all** — because the Fire TV pause decision (B.26) had
chosen the system-level `cmd media_session dispatch` API over app-specific hooks. That earlier
architectural choice is what made a provider swap a zero-change event.

**The record is silent on Jeff's reason for switching** (cost, content, or otherwise). Do not invent one.

### C.8 — ❌ `preheat_start` — rejected for the GLE 350; it is EV-only
**Date:** 2026-07-22 · **Status:** STANDING · **Evidence:** `778f6bd` (2026-07-22)

From the commit body: *"preheat_start is EV-only (not for gas GLE 350)."* Gas vehicles use
`mbapi2020.engine_start` (remote start, PIN required) and `auxheat_start` (exhaust-based auxiliary
heater, **no PIN**). Found by reading the integration's actual source, per the same commit's standing
rule — *"never guess entity names or service calls — research the integration's actual source code and
use domain-specific services with known parameters."*

Adjacent, accepted-not-fixed: **`oil_level` / `service_interval` / preconditioning are unavailable**
because `sensor.gle_350_rcp_features` reports `False` — a Mercedes account/vehicle-tier capability
limit. *"Nothing to fix here"* (`4e9445d`, 07-21).

### C.9 — ❌ Shelly commercial energy monitors — rejected in favour of a DIY ATM90E32 build
**Date:** 2026-06-27 · **Status:** STANDING · **Evidence:** `9ced08f` → `2c91e09` → `739e715` →
`b243228` (all 2026-06-27)

The full chain, in order:
1. **Shelly EM Gen3 — rejected on capacity:** 80 A per channel is too small for a 200 A main.
2. **Shelly Pro 3EM-400 (~$140) — recommended**, then **rejected by Jeff in favour of building his
   own.**
3. **Chosen: ESP32 + ATM90E32AS** on the CircuitSetup open-source design, **~$90–110 DIY**, with
   **200 A split-core CTs (not Rogowski)** and 2 × 9 V AC-AC wall-warts.
4. Then **upsized to the 6-channel ATM90E32 board** for per-appliance breakout (`b243228`).

This is the budget philosophy of C.1 applied nine weeks earlier: **cheaper, more capable, more work —
and Jeff does the work.**

### C.10 — ❌ Panel-level switching and smart breakers — rejected to save money
**Date:** 2026-06-27 · **Status:** STANDING · **Evidence:** `b243228` (2026-06-27)

> "House is nowhere near capacity… Cooking/laundry = MONITOR ONLY (never auto-energize a stove/oven).
> Told Jeff to skip smart breakers/panel relays = **saves money**."

Control lives at the **LUX thermostat** (A/C) and at **wall switches/plugs** (lights) — never at the
breaker, because *"whole-circuit kills smart bulbs."*

### C.11 — ❌ A commercial alarm panel — rejected; the alarm is a DIY Zigbee build
**Date:** 2026-07-01 · **Status:** STANDING · **Evidence:** `4c9cf03` (2026-07-01), priorities
`6837d2d`; shopping list `/tip/docs/beehive/safety_shopping_list.md`

The decision, from `4c9cf03`: **the alarm is a DIY Zigbee build, not a commercial panel — and not
bought yet.** Priorities, in order: **life-safety sensors first, lean intrusion**, water-main
auto-shutoff, garage door via ratgdo/local relay (myQ cloud rejected — "blocked from HA, so go local").

**Guardian doctrine, verbatim from the shopping list** (`/tip/docs/beehive/safety_shopping_list.md:3`):
> "**Philosophy (Jeff's ask):** *tons* of **life-safety** coverage (smoke/CO/leak/gas/freeze)…"
> and §5: "**INTRUSION — keep it lean (Jeff: don't go crazy)**"

Restated as a standing correction in `SESSION_START.md` (`831db1b`, 08-16):
> "Jeff wants TONS of life-safety coverage and LEAN intrusion (key doors + a few motions, not every
> window). **Door sensors are not 'the perimeter.'**"

And in `/tip/CLAUDE.md:123-124`: *"Guardian priority is LIFE-SAFETY heavy, INTRUSION lean — key doors
and a few motions only, never 'sensors on every window.'"*

### C.12 — ❌ ratgdo (~$35, and the ~$22-25 Gelidus clone) — researched, then dropped before purchase
**Date:** chosen 2026-07-26, dropped 2026-08-05, final part landed 2026-08-06 · **Status:** SUPERSEDED
by SONOFF MINI-D · **Evidence:** `590303e`/`e20d3d5` (07-26, ratgdo chosen ~$35), `7b60e43` (08-04,
Gelidus USB-C v2 ~$22–25 noted as cheaper than the $45 official kit), `10f0f13`/`65d7e49`→`f015867`
(08-05→08-06, dropped for a cheap relay), `feee336` (08-06, installed)

The full, embarrassing chain — preserved because it is the origin of Rule 8 (B.18):

| Step | Part | Price | Outcome |
|---|---|---|---|
| 1 | Official ratgdo kit | **~$45** | Rejected as overpriced |
| 2 | Gelidus ratgdo USB-C v2 | **~$22–25** | Pre-flashed, feature-parity — then rejected |
| 3 | Plain ESPHome R2/R4 relay | **~$8–10** | *"~$15 cheaper, only costs a one-time manual flash"* — Jeff pushed back on the ratgdo price premium and was right |
| 4 | "SONOFF Basic" | ~$8-10 | **WRONG** — mains-voltage part, not dry-contact |
| 5 | SONOFF SV | — | Superseded |
| 6 | **SONOFF MINI-D** | — | **FINAL — found by Jeff himself.** Native Matter, hardware Inching Mode, no flashing needed |

`3151`: *"Jeff correctly pushed back -- the ratgdo/Gelidus board's price premium"* was not justified for
this job. Installed 08-06 at the opener, powered by a plugged 2-wire AC cord, **coexisting with MyQ and
the wall button** (`feee336`).

### C.13 — ❌ MyQ hardware — sold, not kept
**Date:** 2026-08-06 · **Status:** STANDING · **Evidence:** `f84f8d8` (2026-08-06, "Log MyQ sale
decision, research + recommend a Zigbee position sensor"), `a1a65fe`

Claude flagged first that standard MyQ kits **bundle real position-sensing hardware that the new relay
does not replace.** **Jeff's call: sell it anyway**, and get a door-position sensor visible in the app
instead. Recommendation: a **Zigbee contact sensor** (SONOFF SNZB-04P or Aqara) over reed/tilt.
Standing invariant from `a1a65fe`: **the garage relay is never treated as door position.**

Final plan at tip (`/tip/docs/inventory/HCC_INVENTORY.md`): **two** contact sensors — #1 at CLOSED
(bottom of track), #2 at FULLY-OPEN (overhead) — so a template sensor derives **CLOSED / OPEN /
PARTIAL**, covering Jeff's hot-day "cracked open" venting.

### C.14 — ❌ Shelly-vs-ATM90E32: see C.9. ❌ Kamstrup wM-Bus water path — rejected on encryption
**Date:** 2026-07-28 · **Status:** STANDING · **Evidence:** `281d65b` (2026-07-28); superseded in
practice on 07-01 by `5034f26`

Kamstrup wM-Bus was rejected as a water-reading fallback: **AES-128 encrypted, no key, no receiver
built.** Moot anyway — the WHUD meter supervisor confirmed in person on 07-01 that the readable radio
is an **unencrypted Itron ERT-SCM**, so the whole AES path (and the key request) became unnecessary for
the primary route. The CC1101/ESP32/AES stack was formally **demoted to backup** (`5034f26`).

### C.15 — ❌ Native Alexa Routine for TV pop-ups — rejected
**Date:** 2026-07-11 · **Status:** STANDING · **Evidence:** `c926ceb` (2026-07-11)

A native Routine would **bypass HA entirely**, losing AI classification, per-camera mute, and
family-arrival suppression — *"per Jeff's ask."* Chosen instead: route through HA via
`alexa_media_player`. (That path itself later proved a dead end for the Fire TV pop-up; see B.26.)

### C.16 — ❌ Blink RTSP bridges — rejected
**Date:** 2026-08-14 · **Status:** STANDING · **Evidence:** `c95457a` (2026-08-14)

Both candidate bridges add latency (~30 s / 5-min refresh) **on top of** Blink's own cloud delay, are
barely-maintained hobby projects, and **want the Blink password in a config file.** Rejected on all
three counts.

### C.17 — ❌ Apple TV jailbreak — dead, do not pursue
**Date:** 2026-08-14 · **Status:** DEAD · **Evidence:** `c95457a` (2026-08-14)

A15 / tvOS 18.6 is beyond checkm8, and **no PiPup equivalent exists for tvOS anyway** — so even a
successful jailbreak would not deliver the feature. Chosen instead: the **HomeKit snapshot route**,
proven on 08-14 (`9426623`) — `linked_doorbell_sensor` pointed at the motion sensor is what makes tvOS
pop up. **Motion alone never interrupts the screen.**

Also rejected in the same policy pass (`18ff039`): **HomeKit Secure Video** (Blink can't stream, and
Jeff doesn't want the iCloud+ requirement); **duplicate phone notifications**; and **video clips in
HomeKit** (ffmpeg-on-MP4 documented as hanging — *"Jeff is happy with stills anyway"*).

### C.18 — ❌ Subscriptions — banned for the camera/AI/theatre stack
**Date:** 2026-07-09 · **Status:** STANDING · **Evidence:** `dfaa88f` (2026-07-09), `5ddac8a`

> "free, NO subscriptions … no per-month anything."

Free Blink features only. *"cloud clip history is the only thing the paid plan adds"* (`5ddac8a`).
Detection engine chosen accordingly: **CodeProject.AI Server on Windows with the GTX 1050 Ti (CUDA)** —
snapshot-based, which fits Blink's no-RTSP model. **Frigate and blinkbridge explicitly not needed**
for this path (`71a8cae`). Jeff's belief that the GPU was a "T750" was corrected to **GTX 1050 Ti 4 GB**
by `nvidia-smi`; 4 GB is *"not enough for a full local LLM — use free Gemini tier for rich scene
descriptions if wanted"* (still $0).

### C.19 — ❌ CF Workers as a WebSocket client for B-Hyve — rejected
**Date:** 2026-06-26 · **Status:** STANDING · **Evidence:** `c4d32e6` (2026-06-26)

The browser opens the B-Hyve socket itself, using a token fetched from `?tk=1`.

### C.20 — ❌ Radar basemaps: a five-step rejection chain ending in an iframe
**Date:** 2026-06-26 → 06-29 · **Status:** STANDING · **Evidence:** `7897790` → `5fc66bd` → `4c88027` →
`c294216` → `db575f8` → `b34472c`

CartoDB rejected (free-tier restrictions) → ESRI tried → OSM+invert tried → CSS invert rejected (blanked
tiles on iOS) → the entire hand-built Leaflet + RainViewer radar **rejected outright** in favour of the
embedded **Windy iframe**. Also: the **RadarScope link rejected** — *"was landing on a Zendesk help
page, not radar"* — replaced with NWS Radar (`b34472c`).

### C.21 — ❌ Weather.com / TWC 10-day forecast — chosen and rejected the same day
**Date:** 2026-06-26 · **Status:** SUPERSEDED by Open-Meteo · **Evidence:** `d44baf3` → `5fc66bd`

Rate-limited on the TWC/WU key within hours. Open-Meteo chosen partly because *"no key required"*
(`c8e729c`).

### C.22 — ❌ In-app browser voice control — rejected and removed
**Date:** 2026-06-26/27 · **Status:** STANDING · **Evidence:** `e2f5889` → `9a2adc6`

*"unreliable on iOS and could hand audio to Siri."* Replaced with an app-launch button so Jeff talks to
the real Alexa.

### C.23 — ❌ A fake cast button — rejected on honesty
**Date:** 2026-06-28 · **Status:** STANDING · **Evidence:** `0644ccf` (2026-06-28)

iOS will not let a web app start mirroring. Rather than ship a button that does nothing, the app ships
an honest step-by-step AirPlay / HDMI sheet.

### C.24 — ❌ Full Fire TV remote UI — rejected by Jeff as too complex
**Date:** 2026-07-16 · **Status:** STANDING · **Evidence:** `2433bf1` (2026-07-16)

*"Jeff asked for simpler"* — the full remote (D-pad, volume) was stripped back to a **Now Playing card
+ Play/Pause**.

### C.25 — ❌ Rain-skip HA automation — rejected as strictly worse than what Jeff already owns
**Date:** 2026-08-02 · **Status:** STANDING · **Evidence:** `f1d24f3` (2026-08-02);
`/tip/CLAUDE.md:503` (Pending Item 14)

B-Hyve's own **WeatherSense** already does real weather-adaptive watering (rain-skip + temp/wind
adjustment) and genuinely supports a personal weather station, exactly as Jeff described. Independent
testing showed **100% skip reliability on any 0.2″+ rain day.** An HA duplicate would have **no wind or
temperature handling** — strictly worse. **Not building this.**

### C.26 — ❌ Electric Bill Due / Last Payment / vs-Last-Year — rejected as new surface area
**Date:** 2026-08-06 · **Status:** STANDING (recommend skip unless Jeff asks) · **Evidence:** `5c41c8d`
(2026-08-06); `/tip/CLAUDE.md:507`

Checked live by the coworker and **confirmed not available as attributes** (`account_id`/`meter_name`
only). Would require a whole new SmartHub-account scraper for a nice-to-have.

### C.27 — ❌ `recorder.get_statistics` helper approach — abandoned
**Date:** 2026-07-28 · **Status:** SUPERSEDED by `recorder/statistics_during_period` over WebSocket ·
**Evidence:** `c94e7aa` (07-28); corrected `/tip/CLAUDE.md:507`, `/tip/docs/UTILITIES_REFERENCE.md:32`

The service returned empty across multiple valid parameter combinations (matching a known HA GitHub
issue). The client-side 24-bucket EMA model was kept instead — and then that too was replaced on 08-06,
when the coworker fired the real command against live HA and found the correct name is
**`recorder/statistics_during_period`**, not `history/statistics_during_period` (which returns
`unknown_command` on HA Core 2026.8.0).

### C.28 — ❌ Minification and script-splitting — deliberately out of scope
**Date:** 2026-07-31 · **Status:** STANDING (explicitly out of scope) · **Evidence:** `2102e3a`
(07-31); `/tip/CLAUDE.md:494` (Pending Item 5)

*"basic wins without restructuring the app, per Jeff's scope."* The two biggest remaining Lighthouse
opportunities are named honestly and left undone: `unused-javascript` ~235 KiB and
`unminified-javascript` ~71 KiB.

### C.29 — ❌ Server-side coverage wipe — rejected on security
**Date:** 2026-08-10 · **Status:** STANDING · **Evidence:** `5a0cea9` (2026-08-10)

*"this endpoint is unauthenticated, so a destructive remote command would be abusable."* The GPS
coverage endpoint accepts writes but will not accept a wipe.

### C.30 — ❌ `mix-blend-mode` and perspective tilt — rejected in the glass redesign
**Date:** 2026-08-06 · **Status:** STANDING · **Evidence:** `4464d87`, `30d1df3` (both 2026-08-06)

`mix-blend-mode` **silently drops `backdrop-filter` blur.** Perspective tilt was **rejected twice** —
*"tilted overlays were part of what made the first attempt look wrong."* Also: the reference guide's
`blur(2px)` on the host photo **was applied, shown to Jeff, and pulled on his call** — *"not so much
blur in the picture."*

### C.31 — ❌ Controls inside the in-photo dashboard screens — rejected on tap-target size
**Date:** 2026-08-06 · **Status:** STANDING · **Evidence:** `d860dca`, `e92f4fc` (2026-08-06)

62 px-wide targets against a **44 px minimum floor**. Note this is a *reversal of Jeff's own request* —
he had said *"that would be awesome if you could put the controls in the screens"* (line 2196 of the
commit record) — overruled by the accessibility constraint and explained rather than silently dropped.
**44 px minimum tap-target height, never to be clamped below again** (`e92f4fc`), treated as immovable
when positioning the irrigation panel later (`436ce61`).

### C.32 — ❌ Freeze Warning automation — removed entirely per Jeff's request
**Date:** 2026-07-31 · **Status:** STANDING · **Evidence:** `b4f11df` (2026-07-31)

### C.33 — ❌ Calling WHUD about the pit-radio silence — Jeff said no
**Date:** 2026-07-31, re-opened and re-closed 2026-08-01 · **Status:** STANDING · **Evidence:**
`13502b9` (07-31), `593ddf7` (08-01, re-opened) → `fb5068c` (08-01, cancelled same day);
`/tip/docs/UTILITIES_REFERENCE.md:22`

Jeff's explicit call:
> "water's transmitting fine now and he explicitly does not want to call WHUD about it -- doesn't want
> to raise a flag with the utility district over something that's already resolved."

The tip doc is blunter: *"reporting it would draw utility-district attention/scrutiny he doesn't want."*
Standing instruction: *"Leave this alone unless water goes silent again; if it does, that's a fresh
incident, not a continuation of this one."*

**The wrong diagnosis was deliberately kept in `CLAUDE.md` "for the record rather than deleted."** The
meter and pit radio were healthy all along; the "stuck reading" was `rtlamr2mqtt`'s `-unique=true` flag
only republishing on change, combined with this meter batching its broadcasts every ~20 min to ~3 hours.

### C.34 — ❌ Panel-mounted / by-the-book backflow prevention — rejected knowingly
**Date:** 2026-08-15 · **Status:** STANDING (decided knowingly) · **Evidence:**
`/tip/docs/inventory/HCC_INVENTORY.md` (Backflow section), `docs/utilities/backflow_layout.html`

The honest limit, stated in the doc: the six zone valves are shutoff valves **downstream** of an
atmospheric vacuum breaker, which the standard does not strictly permit. The by-the-book fix is a
pressure vacuum breaker (ASSE 1020, **~$80–150**) **plus annual testing by a licensed tester** —
*"which is exactly the utility attention Jeff is avoiding. **Decision made knowingly.**"*

Also rejected: **Orbit 51059** (3/4″ FTP brass AVB, **$18.49**) — *"looked at and NOT bought"*, because
the combined anti-siphon valve does the same job **plus** the master-valve function for the same money
and fewer fittings. And **T&S B-969** 1/2″ AVB (owned) — *"too small — 1/2″ chokes the 3/4″ line."*

Jeff's replacement strategy, endorsed in the doc: *"an AVB fails SILENTLY… So swap the cheap valve on a
schedule rather than pay ~9× for bronze. Target: spring startup, every 1-2 years."*

### C.35 — ❌ Vizio soundbar work — leave it alone
**Date:** 2026-08-01 · **Status:** STANDING · **Evidence:** `2765386` (2026-08-01)

Zero references anywhere in the system; *"left alone per Jeff, he'll power-cycle manually if it recurs."*

### C.36 — ❌ MoCA adapters — shelved with measured data, not guessed
**Date:** 2026-08-13 · **Status:** SHELVED with a documented deploy trigger · **Evidence:** `aaefae0`
(2026-08-13); `/tip/docs/inventory/HCC_INVENTORY.md`

Garage WiFi **measured adequate**: mower box, last 50 uploads — mean **−71.5 dBm**, worst −76, **zero
buffered uploads ever**. Documented trigger to un-shelve: *"if the Matter garage relay feels laggy once
installed → MoCA backhaul + AP in garage."* Caveat recorded honestly: coax at the garage is unverified.

### C.37 — ❌ Kodi as the media brain — Jeff's decision, then Jeff's reversal
**Date:** decided 2026-07-10, superseded 2026-07-14 (both Jeff's calls) · **Status:** REVERSED ·
**Evidence:** `05dc1db` (07-10) → `c13f101` (07-14)

Original: *"beast-as-media-center via Kodi … **NOT** simple ADB from Beehive to Fire TV — Jeff wants it
routed through the beast."* On 07-14, with the Fire TV path working-ish and **Kodi having been launched
exactly once for three minutes, ever**, Jeff chose to keep the Fire TV route. Kodi left
"installed/unused"; `media-center-setup.md` demoted to *"reference/superseded, not a live setup guide."*

### C.38 — ❌ Home Assistant in Docker on Jeff's always-on PC — superseded within 24 hours
**Date:** 2026-06-21 → 2026-06-22 · **Status:** SUPERSEDED · **Evidence:** `eb342db` (06-21) → `70416e6`
(06-22)

The 06-21 plan was *"Your PC (always-on, gigabit fiber) will run Home Assistant in Docker."* By 06-22
noon the app instead reports a **dedicated Beehive brain PC running Home Assistant OS.** Later
confirmed as the Beelink J45 (Pentium J4205) at `192.168.1.66`. **The record is silent on the hardware
purchase and its price.**

Fully executed on 07-01/07-02: **wipe Windows 10, install HA OS to the internal drive** (`9a9da77` →
`f39b125`: *"J45 now boots HA OS 18.1 standalone off the internal SSD (foundational fix done)"*).

### C.39 — ❌ Media/AI workloads on Beehive — banned
**Date:** 2026-07-09 · **Status:** STANDING · **Evidence:** `dfaa88f` (2026-07-09)

> "the beast = AI + media brain; Beehive stays PURE HA. **Do NOT put media/AI on it**"

The Beelink J45's weak Pentium runs the whole house; nothing else goes on it.

### C.40 — ❌ Two other rejections worth keeping
- **Fitness card and the pre-mow reminder — removed per Jeff** (`f3ca8b6`, `ffa6b4b`, 08-03), along with
  the **hardcoded 98% Electrical/Fuel placeholder gauges** — fake data in a real dashboard.
- **The Life-Safety Note disclaimer card — deleted** (06-24) because *"Jeff and Angela know their own
  home"*, together with the condescending *"Keep this enabled"* and *"Keep UL-listed detectors as
  primary"* copy. The **nanny-copy rejection is a standing style rule**, though the underlying
  life-safety *hierarchy* (Apple Watch Fall Detection + Emergency SOS as the primary net; ESP32
  gas/smoke for trend monitoring only) remains true — it just stopped being lectured at him.

---

# PART D — Every price and budget figure in the record

Every number here is evidenced. Where a figure appears only in the archive request and **not** in git
or the tip checkout, that is stated explicitly.

### D.1 — The subscription anchor: $125/month for Claude Max

| Figure | Source | Status |
|---|---|---|
| **$125 for Claude Max** | Jeff's own words, preserved verbatim in `/tip/CLAUDE.md:105-107` and in `docs/lighting/zigbee_dimmer_selection_2026-08-13.md`, committed in `c30b64d` (2026-08-16) | **In the git record** |

> "I was not paying $120 for a freaking dimmer switch... **I spend $125 for Claude Max** and I would
> rather spend the money on that and have your help than buy $120 worth of dimmers."

**Important nuance for accuracy:** Jeff's quote says *"$125 for Claude Max"* — it does **not** contain
the word "month." The **$125/month** framing comes from the archive request and from the chronicle
sections' reading of it. **INFERRED:** the monthly reading is almost certainly correct (Claude Max is a
monthly subscription and the sentence compares an ongoing spend against a one-off hardware purchase),
but the literal word "month" is not in the quoted text. Flagging it so the record stays honest.

### D.2 — The lighting shopping list, ~$104 total
**Source:** `docs/lighting/HCC_Lighting_Plan.html` (+ PDF), **Rev. Aug 13 2026** — printable, made
specifically so Jeff could hang it in the workshop. Summarised in `/tip/CLAUDE.md:96-99`.

| Item | For | Qty | Each | Total | Status |
|---|---|---|---|---|---|
| Kasa HS220 dimmer | Bedroom · Kitchen/Dining · Living room | 3 | $15 | **$0** | 2 on hand |
| Kasa HS220 dimmer | 3rd room, only if a 3rd is wanted | 1 | $15 | $15 | buy |
| Kasa HS200 switch | Garage lights (non-dim) | 1 | $15 | $15 | buy |
| Zigbee plug (4-pack) | Replace 4 Sylvanias · mesh routers | 4 | ~$10 | $40 | buy |
| Zigbee plug — garage | Mesh relay through the garage wall | 1 | ~$10 | $10 | buy |
| Zigbee contact sensors | Garage door: CLOSED + FULLY-OPEN | 2 | ~$12 | $24 | buy |
| Zigbee coordinator dongle | Haozee CC2652P1 + USB extension | 1 | — | $0 | ordered |
| | | | | **~$104** | |

The doc's own thesis, quoted in `CLAUDE.md`:
> "**Job 1 · Light Switches → Wi-Fi (Kasa). Job 2 · Mesh Range → Zigbee Plugs. Why not a $46 mesh
> dimmer: the switch was only being asked to repeat the mesh — a job a $10 plug does better.**"

And from the doc body: *"At ~$15 they do the lighting job for a fifth the price of a mesh-grade
switch"*; *"At $8–12 each they extend the mesh"*; *"Buying them separately costs half as much and
solves the Sylvania problem at the same time."*

The plan's caveat, which is itself a standing rule: *"Prices are estimates — verify each Zigbee model
against its Zigbee2MQTT device page before ordering."*

### D.3 — The Zigbee layer actually on hand (all photo-confirmed 2026-08-15)
**Source:** `/tip/docs/inventory/HCC_INVENTORY.md`

| Item | Qty | Cost |
|---|---|---|
| Haozee Zigbee 3.0 dongle (CC2652P1, +20 dBm) | 1 | **$8.92** |
| Tuya Zigbee door/window sensor (Excellux 2-pc) | 2 pks | **$9.58 ×2** |
| Zigbee door/window sensor (Coolo 2-pc) | 1 pk | **$6.39** |
| Zigbee door/window sensor (Excellux 1-pc) | 1 | **$2.79** |
| Zigbee water leak sensor (Haozee) | 2 | **$5.09 ea** |
| Zigbee water leak sensor (Gleco, probe cable) | 1 | **$4.40** |
| Zigbee water leak sensor (Gleco **Z2M-only**, TZ-SJ-SD_E) | 1 | **$4.62** — ⚠️ *this one locked the Z2M-not-ZHA decision* |
| Zigbee water detector (Excellux) | 1 | **$6.19** |
| ⚠️ Tuya **WiFi** water sensor (Qianhong "WiFi-Shuijin-1") | 1 | **$5.68** — **WRONG VARIANT**, flagged loudly |

The Qianhong is kept in the register on purpose, per inventory Rule 4: *"Wrong-variant purchases get
flagged loudly… so the lesson survives: **verify the protocol variant in the listing before
ordering.**"*

### D.4 — The 2026-08-14 order — ~$33.83
**Source:** `b524553` (2026-08-14); `/tip/docs/inventory/HCC_INVENTORY.md`

| Item | For | Cost |
|---|---|---|
| **Orbit 57280** 3/4″ FPT L-Series auto valve | Master valve | **$13.58** |
| **Kasa HS220** dimmer (Amazon Resale, **USED - Mint**) | 3rd dimmer | **$13.86** |
| Leviton 3-Gang Decora/GFCI wall plate | New multi-gang box | **$1.82** |
| Leviton F-Connector Decora insert | Coax into a Decora plate | **$4.57** |
| | **Total** | **~$33.83** |

Attached standing rule for the used switch: *"**FACTORY RESET it** (hold the button ~10 s until the LED
blinks amber/green) so it is not still bound to the previous owner's TP-Link account, **THEN** disable
auto-firmware-update, **THEN** pair. A used smart switch that is still claimed will silently refuse to
pair."*

### D.5 — 2026-08-15 irrigation/backflow decision

| Item | Role | Cost | Status |
|---|---|---|---|
| **Orbit 3/4″ electric anti-siphon valve** | **DECIDED 8/15** — master valve **+** backflow in one body | **$18.34** | to order |
| Orbit 57280 (bought 8/14) | Redundant as master → becomes the **spare zone valve** | $13.58 | HAVE |
| Orbit 51059 (3/4″ FTP brass AVB) | **Looked at, NOT bought** | **$18.49** | rejected |
| Pressure vacuum breaker (ASSE 1020) — the by-the-book fix | **Rejected knowingly** | **~$80–150** + annual licensed testing | rejected |

The 57280 is explicitly recorded as **not wasted** — a failed zone-1 diaphragm is exactly what caused
the **~88 gal/day leak found 2026-08-13**, so a spare zone valve is genuinely worth having.

### D.6 — Other hardware prices in the record

| Item | Price | Decision | Evidence |
|---|---|---|---|
| **ThirdReality Zigbee plug 4-pack** (ASIN `B09KNHWF7L`) | **~$50** | **SELECTED** as the mesh routers; qty 5 needed | `9dad6a5` 08-14 |
| **RTL-SDR Blog V4 kit** | **~$40** | *"the only new buy"* for the whole meter-reading build | `ae337d4` 06-30 |
| Spare ESP32 | **~$9** | TO ORDER — Jeff committed 08-11 | `/tip/docs/inventory/HCC_INVENTORY.md` |
| **Veepeak OBDCheck BLE+** (F-250 OBD-II) | **~$30** | Planned, not bought | `ee0d376` 07-24; `/tip/CLAUDE.md:492` |
| NEO-6M GPS for the F-250 box | **~$12** | Optional | `ee0d376` 07-24 |
| Fire TV Stick for the onn Roku TV | **$20–30** | Chosen over the $0 Roku-browser route (which was impossible) | `3644f54` 07-15 |
| DS18B20 panel-temp probe | **~$3** | On the one-panel-open "do now" list | `739e715` 06-27 |
| Motorized water-main ball valve | **~$50** | On the one-panel-open "do now" list | `739e715` 06-27 |
| DIY ATM90E32 energy monitor | **~$90–110** | CHOSEN over the $140 Shelly Pro 3EM-400 | `2c91e09`/`739e715` 06-27 |
| Nabu Casa (HA Cloud) | **$6.50/mo** | The only accepted recurring cost | recorded in the chronicles' cost accounting |
| **New Mulching Gator Blades** | **$31.85** (2026-05-31) | The project's **first recorded purchase** | see D.7 |

### D.7 — The $31.85 blades — a provenance note, stated precisely
The line **"New Mulching Gator Blades — $31.85 — 2026-05-31"** is real and is in git: it is baked into
the mower app's `DEFAULT_STATE` purchase history and was preserved into the very first `CLAUDE.md`
(`e8f0312`, 2026-06-23) and its rewrite (`90e556e`, 2026-06-24). It sits alongside Jeff's 2026-06-22
data backup: **engine hours 5.9**, and a 7-entry maintenance log all dated 2026-05-31 at 3.5 hrs
(Cable Inspection, Clear Coat Entire Mower, New Mulching Gator Blades, Battery Charge, Post-Mow
Cleanup, Pre-Mow Safety Check, Mow #3 — 1.0 hr, 4.0 mi).

**Note the disagreement in the archive** (recorded rather than resolved): the cost-accounting chronicle
states the $31.85 figure *"could not be verified anywhere in the git record or tip docs and is
therefore not counted."* That statement is **incorrect on the evidence** — the figure is in the
`DEFAULT_STATE` of the app and in the first two `CLAUDE.md` versions. It is, however, **not in the
branch-tip `CLAUDE.md`**, which is the likely cause of the miss. Both readings are recorded here so a
future reader can check for themselves.

### D.8 — Utility rates, all bill-validated (the money the app actually tracks)
These are not hardware prices but they are the project's other financial spine — the sewer-overcharge
case. All were **validated against Jeff's real bills**, replacing earlier estimates.

| Utility | Rate | Validated against | Evidence |
|---|---|---|---|
| **Water (WHUD)** | **$10.32 base + $0.00908/gal** | Printed on bill; math-checked $39.90 / 3,258 gal; 6,839-gal cycle → **$72.42**, "exactly the bill's Water Charges line" | `6f9cd3f` 07-03, `7b3de68` 07-28 |
| **Sewer (City of White House)** | **$22.74 base + $0.00982/gal** → **updated to $23.42 + $0.01011/gal** | 2,461 gal → $24.17; the increase confirmed as a **real ~3% City rate rise**, not a calc bug | `8a9df3b` 07-28; `7eebfd3` 08-06 |
| **Electric (CEMC)** | **$39.00 base + $0.08657 energy + $0.02815 TVA fuel = $0.11472/kWh** → **TVA fuel to $0.02847 = $0.11504/kWh** | 06/30/2026 bill; then the 07/30/2026 bill, **account 4501007001**, 2,120 kWh | `0d6c9de` 07-28; later update in `4365`-region commit |
| **Gas (Piedmont→Spire)** | **$13.44 base + $0.61809 dist + $0.61691 PGA = $1.235/therm** × 1.068 heat factor × 5% franchise fee | **Three** Piedmont bills verified **to the penny**: $34.58, $47.83, $27.08 | `0d6c9de` 07-28 |
| Gas (superseded estimate) | ~$1.12/CCF (TN residential $11.23/Mcf, EIA Jan 2026) | — | `e5726b9` 07-03 — **DISCARDED** on bill validation |
| Irrigation-sewer (superseded estimate) | $0.01136/gal | — | **DISCARDED** for the bill-validated $0.00982 |
| **City flat fees** | Sanitation Services **$24.00**, Stormwater **$8.99** | Kept as **separate line items, never folded into sewer math** — the refund case needs clean usage-only data | `330c74a` 08-06 |
| **Bill reproduction check** | **$92.56** sewer-only · **$125.55** full City of WH total | Reproduced exactly | `330c74a` 08-06 |

Standing note on TVA fuel: *"a pass-through surcharge that shifts most cycles — **re-derive from each
new bill photo Jeff provides** rather than treating this as fixed"*
(`/tip/docs/UTILITIES_REFERENCE.md:35`).

### D.9 — Lucky Mike "Smart Stall" economics, locked to Jeff's numbers
**Date:** 2026-06-30 · **Status:** QUEUED — *"Do not start until Jeff says go"* (`/tip/CLAUDE.md:495`) ·
**Evidence:** `fa282f1`, `6c2d8c3`, `4d78cad` (06-30); `c8ca302`; `/tip/docs/lucky-mike/`

| Figure | Value |
|---|---|
| Flat trip charge (Jeff's number) | **$50** |
| Boarder fee (Jeff's number) | **$40/mo** |
| Recommended build fee | **$300/stall** (Jeff to adjust) |
| Real parts, single-buy | **~$87–96**, re-locked at **~$90** |
| Real parts, barn quantity | **~$69–76**, i.e. **~$75** |
| Multi-pack ladder | **~$63** |
| With on-hand parts | **~$50** — lifts every take **~$40/stall** |
| Camera (irreducible floor) | **~$33** |
| Retired padded figure | **$150** — replaced with real costs |
| Phase 2 additional | **$125–175** |

Recommendation on record: start at **Option 1** (demand-triggered install, *"barn owner keeps the
$40"*) and *"grow into recurring deliberately."* Verdict: **"No single-stall scenario loses money."**
ChatGPT's original plan was corrected — architecture fixed (it routed cameras/Shelly through the
ESP32), microSD/power-bank backup dropped, zero-labor pricing fixed; fan control via a power-monitoring
smart plug (Sonoff S31 / Shelly Plus Plug US) rather than a hard-wired relay.

### D.10 — What the record does NOT contain, financially
- **No dollar total for the whole project exists.** Nobody ever added it up.
- **No price is recorded for the Beelink J45** (the Beehive machine) or its purchase date.
- **No price is recorded** for the Blink cameras, the iPad Air 2, the Fire TV hardware already owned,
  the GTX 1050 Ti, or the mower itself (purchased 2018-04-11 per the spec strip).
- **No price is recorded** for the replacement mower-sensor hardware Jeff bought after being wrongly
  told his sensors were faulty (`/tip/CLAUDE.md:70` records the purchase, not the amount) — **this is
  the one purchase in the project that the record confirms was wasted money, and its amount is
  unknown.**

---

# PART E — Architectural decisions, and WHY

### E.1 — Single-file `index.html`
**Date:** inherited from the original 2026-05-19 PWA; formalised 2026-06-23 · **Status:** STANDING ·
**Evidence:** `/tip/CLAUDE.md:166`, `:255-263`; original at `/pwa/`

*"A Progressive Web App (PWA)… **Single `index.html` file** deployed on Cloudflare Pages."* Structure:
HTML/CSS (sections, heroes, cards), then **one** `<script>` block containing all JavaScript, then
closing HTML. Several thousand lines and growing.

The cost is acknowledged rather than hidden — it is precisely why C.28's minification/script-splitting
remains out of scope, and why B.8 (never put a `<script>` tag inside the JS block) is a fatal-class rule
rather than a style note.

### E.2 — Cloudflare Pages + Functions + KV (not Workers, not a server)
**Date:** 2026-06-23 · **Status:** STANDING · **Evidence:** `c8e729c` (2026-06-23);
`/tip/CLAUDE.md:190-213`

**Why Pages Functions rather than separate Workers:** they live in `functions/api/` and *"deploy
automatically with the Pages project"* — one repo, one push, one deploy.

**The actual deployment pipeline** (and the standing correction to the decoy): *"**GitHub Actions is
broken and irrelevant** (missing `CLOUDFLARE_API_TOKEN` secret — do not try to fix, it doesn't
matter). **Actual deployment:** Cloudflare Pages' native Git integration watches
`claude/time-master-project-liq1jw` and auto-deploys on every push — live at `toro1-5rz.pages.dev`
within ~60 seconds."*

**KV infrastructure, verbatim from the file:**

| Resource | Name | ID |
|---|---|---|
| KV Namespace | `MOWER_KV` | `ec5b28597d9c4fb9b182b1aea1d50eff` |
| KV Binding (Pages env var) | `MOWER_KV` | maps to the namespace above |
| Pages project | `toro1` | — |

KV key `hours_data` stores the latest ESP32 payload. `getKV(env)` in `functions/api/hours.js` tries
`env.HCC_KV || env.MOWER_KV` — **do NOT remove this dual-check** (`c6f3df8`).

Related: **serve install scripts from Pages Functions endpoints**, because *"Cloudflare Pages does not
reliably serve `.sh` files as static assets"* — hence `/setup` (`a463d09`) and `/bhyve` (`9757104`) as
one-liner installs, rather than asking Jeff to copy files around.

### E.3 — The `/api/ha` proxy and `haFetch()`
**Date:** 2026-07-03 · **Status:** STANDING · **Evidence:** `7a59848` (2026-07-03);
`/tip/CLAUDE.md:148`, `:317`

**All** browser→HA traffic goes through the server-side `/api/ha` Cloudflare Function. The proxy is
*"locked to Jeff's HA host + `/api/` paths only,"* and the HA token *"still lives only in the browser."*
Client code uses **`haFetch()`**, never a raw `fetch(base + '/api/...')`.

Extended by two siblings: **`functions/api/ha-stats.js`** (server-side proxy to HA's **WebSocket-only**
Statistics API — real hourly/daily electric, because `recorder/statistics_during_period` has no REST
equivalent) and the general pattern of putting anything credential-bearing behind a Function.

### E.4 — Beehive (Home Assistant) outranks cloud APIs
**Date:** 2026-06-24 · **Status:** STANDING · **Evidence:** `1c2d2c9` (2026-06-24), extended `768cb6a`

Irrigation routes through **HA entities first**; the direct B-Hyve cloud API is only a fallback.
Extended by `768cb6a` into a general principle: **when a cloud API blocks Cloudflare's IPs, move the
integration into the house** — a custom HA component calling from `192.168.1.66`.

This produced the 530/1018 IP-block diagnosis, which itself came from another standing decision:
**show real errors, not generic ones** — expose HTTP status and response bodies in the UI and logs
(`9fc1211`, `c7bc5ba`, `3082695`, `f904d10`, `c7ed75e`).

### E.5 — Nabu Casa chosen over Cloudflare Tunnel for Beehive's public URL
**Date:** 2026-07-01/02 · **Status:** STANDING · **Evidence:** `f754540` (posed both) → `5e6c20b` (chose)

Reason recorded: *"secure public URL so the app shows online and reads meters off-WiFi (+ easy
Alexa/announcements)."*

### E.6 — Family Login: shared password → SHA-256 in KV → server returns the HA token
**Date:** 2026-07-21 · **Status:** STANDING, setup done and not to be re-run · **Evidence:** `8f495e4`,
`4fabef8` (2026-07-21); `/tip/CLAUDE.md:331-339`

Purpose: let Jeff/family log in with a shared password instead of pasting an HA token per device.
**The server holds the real HA token; the app only ever handles the password.** Setup
(`action:"setup"`) is **one-time only** and refuses to re-run (`{"error":"already_setup"}` — *"expected,
not a bug"*). Guests get view-only. Rotation = delete `auth_hash`/`auth_ha_token` from KV via the
Cloudflare dashboard and re-run setup.

Access model for the public app (`80799e7`/`f474d9b`, 07-09): public visitors get a **view-only demo**;
family (Angela, Jeff's dad, Braxton) get full access by pasting Jeff's HA Long-Lived Token once per
device; **panic is gated behind the token.** Two low-severity risks **accepted, not fixed**: the open
`/api/hours` POST (*"griefing only"*) and the visible Nabu Casa URL.

### E.7 — AES meter keys live in Apple Passwords, NOT Cloudflare
**Date:** 2026-07-01 · **Status:** STANDING · **Evidence:** `75c1a27` (2026-07-01)

Verbatim from the commit:
> "Key is saved in Jeff's Apple Passwords (readable, encrypted, syncs). Operational home once J45 is set
> up = HA `secrets.yaml` (wmbusmeters). **Not Cloudflare - app code can't reach the J45 decoder and
> encrypted CF secrets can't be read back. Never commit the key itself.**"

The reasoning is the durable part: **encrypted Cloudflare secrets are write-only from the operator's
point of view** — you cannot read them back, so they are the wrong home for a key a human needs to
retrieve.

Same logic later governs the **HA backup encryption key** (`/tip/CLAUDE.md:489`): saved to
`C:\Users\jeffl\HCC-secrets\ha_backup_encryption_key.txt`, but flagged as **still not independent**
because that is the same single PC as everything else backup-related. *"**Never put the raw key in this
git repo (public).**"* It is called *"the single most load-bearing secret in the whole disaster-recovery
system"* — without it every `.tar` in the iCloud backup folder is undecryptable. **Still open at tip.**

### E.8 — The ESP32 firmware moved INTO the public repo, credentials extracted
**Date:** 2026-08-11 · **Status:** STANDING · **Evidence:** `a1cfa53` (2026-08-11), `176ec08`;
`/tip/CLAUDE.md:243`; `firmware/mower_hours_esp32/`

Verbatim from `a1cfa53`:
> "This closes the structural root cause of the months-long hour meter miss. The cloud session that
> owned `functions/api/hours.js` has no outbound network and could not see the `.ino`, so it wrote the
> server half of the contract against `CLAUDE.md`'s prose description of the firmware - **and that
> description was wrong. Nobody could diff the two halves because only one was in the repo. Now both
> are.**"

Mechanics: WiFi SSID, WiFi password and device secret moved to **`secrets.h`, gitignored** because the
repo is public; `secrets.example.h` is the committed template. **Compiles byte-identical (1,111,016
bytes)** — purely a source reorganisation.

The honest caveat that came with it, and which is itself a standing rule:
> "**this does NOT make the compiled binary safe** - those strings are plaintext inside the `.bin`, so
> firmware images still cannot be served from a public URL and OTA needs an authenticated delivery
> path."

Plus a tooling gotcha worth keeping: *"`strings` is absent on this machine and returns a silent false
'clean'; **`grep -a` is the check that actually works.**"*

### E.9 — The two-way control channel (firmware 1.4.0+), and its safety gates
**Date:** 2026-08-11 · **Status:** STANDING · **Evidence:** `662928a`, `176ec08`;
`/tip/CLAUDE.md:245-247`

The box reads its POST response, so **every upload is an exchange** — no extra radio time. The reply
carries desired config and **at most one command**, acked by id, *"so a box that dies mid-command
retries; it never applies one twice."* **Config can be changed over the air — no reflash for tuning.**

Commands: `zero_tilt`, `clear_track`, `flush_buffer`, `reboot`, `ota`.
Config keys (**all clamped server-side** in `hours.js`): `vib_threshold`, `idle_interval_s`,
`sample_interval_s`, `track_min_step_m`, `gps_step_max_m`, `flush_every_s`, `service_mode`.

**Security gate:** *"Issuing anything needs the family password or the `mower_ctrl_token` in KV; the
box's own uploads stay unauthenticated."* And the operational limit: *"**The box sleeps and cannot be
woken** — a command lands on its next post, up to 5 min while parked."*
Telemetry storage is wrapped so *"a control-channel fault can never cost a reading"* (`662928a`).

### E.10 — Server-owned data does not belong in the user's core state blob
**Date:** 2026-08-10/08-11 · **Status:** STANDING · **Evidence:** `b568a4b` (2026-08-10), extended
`86b47e6`

> "**Server-owned, re-downloadable, unbounded data does not belong in the user's core state blob.**"

This is described as *"the rule written in the blood of the 5.9-hours reset"* — Claude's own coverage
map blew out `localStorage` and **reset Jeff's real hour meter to the 5.9 default**
(`/tip/CLAUDE.md:384`). Jeff's report, verbatim from the changelog archive:
> "Why are my hours now set at 5.9, the real actual hours are 12.1."

The audit extension applied the same rule to service photos (`86b47e6`).

### E.11 — GPS coverage moved SERVER-SIDE, with no buttons
**Date:** 2026-08-10 · **Status:** STANDING (Jeff's requirement) · **Evidence:** `5a0cea9` (2026-08-10)

Requirement, as recorded: coverage must accumulate **with no buttons and without the app being open** —
so the server is the single source of truth and records automatically. Supporting choices:
- **Coverage as visit counts, not a union; the cap drops least-visited cells, not oldest** (`d3749b9`)
  — *"so the map converges instead of bloating."* Jeff's question is what exposed the original design
  flaw; his words, from the changelog archive: *"the whole purpose of the GPS was to build an eventual
  map of my yard based over it tracking the mow over time... it would get better and better with each
  mow."*
- **3-point smoothing kernel on purpose** (`68f4b7b`) — wider *"would round off the real corners where
  the mower turned."*
- **Raw-payload logging over a field whitelist** (`333adcf`) — *"nothing the box sends may be silently
  dropped"*; only `track[]` is excluded from the log for size, and it survives elsewhere. Jeff's ask,
  verbatim: *"I want to confirm that everything the mower sensors pick up and the gps is building a
  history of everything that mower does if it farts 💨 it picks it up."*
- **USGS chosen first for satellite tiles** (public domain, no account); **Esri added and made default**
  when sharpness became the ask (`5959b55`, `f29e517`) — the tradeoff *"flagged … rather than silently
  picking."* Jeff's trigger, verbatim: *"blurry as shit."*

### E.12 — Hour truth comes from the physical meter
**Date:** 2026-07-06 · **Status:** STANDING · **Evidence:** `408fc96` (2026-07-06), `f0a9199`;
`/tip/CLAUDE.md:219-221`

`S.hours = S.hoursBaseline + the sensor's cumulative d.hours`. **`S.hours` only ever moves FORWARD from
a sensor sync** (protecting against a sensor reset). The **⏱ SET HOURS** button lets Jeff type the TRUE
hours off the mower's physical meter; it sets `S.hours` everywhere **and** re-syncs
`S.hoursBaseline = trueHours − S.lastSensorHours` so future sensor runtime keeps totalling correctly
(can correct down too, with a confirm prompt). Default baseline **5.9** (Jeff's real hours as of the
2026-06-22 backup, hard-coded in `53eb7d4` so a cleared browser can never zero his history).
Hand-set hours display their "set [date]" provenance (`f0a9199`). Set to **9.2 h** on 07-06.

Related invariant (`/tip/CLAUDE.md:241`): engine hours live in the ESP32's **NVS flash and survive a
reflash** (verified across 5 flashes) but **do not survive a board swap** — after a board swap, re-run
SET HOURS or the meter appears frozen.

### E.13 — Honesty over plausibility, everywhere
**Date:** recurring, 2026-06-26 → 2026-08-11 · **Status:** STANDING · **Evidence:** many

The single most consistent architectural value in the project. Every instance:
- **`"Not exposed via Beehive"` over an invented Next Run number** (`c60ae05`) — *"a plausible-looking
  fake would be worse than an honest blank."*
- **`absent is honest while stale looks fine and is a lie`** (`c63142b`).
- **Guardian shows an honest "Sensor pending", never a faked value** (`5a8320c`).
- **Electric "NOW" cell left permanently blank** (`46ab304`, 08-06) — the fake hour-of-day estimate
  *"removed, not just deprioritized."* Reason at `/tip/docs/UTILITIES_REFERENCE.md:32`: *"SmartHub's
  finest real grain is hourly, genuine 'Now' only comes from the future CT-clamp build."*
- **Estimates must be visibly estimates** — an explicit **EST** chip and **≈** prefix, *"never confused
  with a live reading"* (`07bd9a1`/`1f4008f`).
- **Morning Digest ships without its "active alerts" metric** rather than showing a silently-always-zero
  count — *"removed that metric entirely rather than ship a false 'all clear'"* (`f1d24f3`). The zero
  was real: persistent notifications have been unreadable from templates since HA 2023.6.
- **Honest success messages for CAR** — HA's 200 OK *"only means 'accepted' not 'Mercedes executed
  it'"*, so the app says "Command sent" with a 30-second expectation and never claims execution
  (`71d0dc2`).
- **A clean muted "—" instead of the misleading "No history"** (`2a2eb76`); the unreachable-vs-quiet-
  meter distinction kept explicit (`31ed0c8`).
- **No fake cast button** (C.23); **no hardcoded 98% placeholder gauges** (C.40).
- **Buttons that cannot work are hidden, not disabled**: cockpit LOCK/UNLOCK/FLASH live in exactly one
  place (`595ec23`) and are **hidden entirely for the F-250** (`e87b730`) — a 2001 truck has no
  connected-car path.

### E.14 — Panic: sirens + lights + alert family. **NO auto-911, ever.**
**Date:** 2026-07-01 · **Status:** STANDING · **Evidence:** `b2bbe91`, `7a5e984` (2026-07-01), restated
as a standing rule in `6a2336d` (07-03), still honoured `5912`-region

From `7a5e984`, verbatim:
> "Panic now signals Beehive to sound the alarm sirens + strobe lights and alert Jeff, Angela &
> Braxton. App POSTs `{action:panic,siren,lights,notify:[...]}` to the `hcc-panic-button` webhook…
> off-network it clearly says '**couldn't reach Beehive — call 911**.' **Does NOT dial 911 (Jeff handles
> that himself).**"

Design points: one emergency control in the app (the Dispatch **EMERGENCY** bar); the standalone Safety
panic button removed; *"the red EMERGENCY bar does NOT auto-dial 911 (avoids accidental)"*; verified
*"no raw `tel:911` anywhere."* The emergency directory carries real numbers Jeff supplied (police
615-384-4911), but **the bar fires `hccPanic()`, not a dialer** — *"Jeff calls 911 himself, per standing
rule."*

Ready-to-drop HA automation lives in `docs/beehive/panic_alarm_automation.md` (siren.turn_on + light
strobe + Critical push to 3 phones via HA Companion; optional Twilio voice call). **Still pending Zigbee
hardware** at branch tip (`/tip/CLAUDE.md:493`).

### E.15 — Alert fatigue is a security failure, not an annoyance
**Date:** 2026-08-14 · **Status:** STANDING · **Evidence:** `eba1648` (2026-08-14),
`/tip/docs/beehive/alert_fatigue_fix_2026-08-14.md`, `831db1b`; `/tip/docs/SESSION_START.md` §2b

The mechanism, stated as a standing correction every session must know:
> "Too many alerts → Jeff disarms Blink → every camera automation silently stops → no security at all,
> with no error anywhere. **It already happened once (48 h dead, Aug 10–14).**"

Two decisions came from it:
- **Garage motion detection OFF permanently.** Jeff, verbatim: *"I don't need motion in the garage at
  all"* (`/tip/docs/beehive/alert_fatigue_fix_2026-08-14.md:17`).
- **Alert cooldown: one alert per camera per 5 minutes, deliberately non-extending** — so sustained
  activity **keeps** alerting and a prowler is never silenced by his own persistence.

Standing obligation: *"Any change that increases detections must be paired with a suppression story."*

### E.16 — Camera AI: all six cameras to confidence 25
**Date:** 2026-08-16 · **Status:** STANDING · **Evidence:** `fab5b30` (2026-08-16); Pending Item 0b at
`/tip/CLAUDE.md:487`

The finding, measured on a real night frame rather than guessed: `person 25.5%`, `sheep 27.4%` (= the
deer; COCO has no "deer" class). At the previous **60%** threshold `targets_found` was empty and nothing
fired — meaning *"**A person in the back yard at night is currently undetectable**"* on every camera on
the property. All six moved to 25. `vehicle` dropped from the backyard scanner only (no driveway back
there; it false-positived on a distant porch light at `car: 61.7%`); `roi_x_min ≈ 0.15` crops **LEFT,
not top**, because the garden sits right of the fire pit at the same frame height.

### E.17 — Option B for TV popups: ride confirmed AI detections
**Date:** 2026-08-15 · **Status:** STANDING · **Evidence:** `dea7e75` (2026-08-15), `05df625`,
`0e9a2e4`; `/tip/docs/beehive/camera_pipeline_VERIFIED_2026-08-15.md`

Popups fire on **confirmed AI detections via template doorbell sensors** — so the annotated image
(red box + confidence) exists **before** the ring, and false motion never pops the TV.
Jeff, verbatim: **"What good is an old picture?"**

Supporting finding: the annotated snapshot has a **FIXED filename** (verified on-box), which is what
unblocked HomeKit showing the red-box image — `clipframe` is the RAW frame and needs a fixed-path copy
of the AI output.

### E.18 — Verification before expansion
**Date:** 2026-08-15 (Jeff's order) · **Status:** STANDING · **Evidence:** `5de10eb` (2026-08-15);
`/tip/docs/inventory/HCC_INVENTORY.md:30`

> "**NOT UNBOXED — Jeff's order: nothing gets set up until the camera/alert pipeline is verified.**"

All seven door/window sensors, all five leak sensors and the dongle arrived 08-15 and stayed in their
boxes. Setup-day first moves recorded in advance: **disable any auto-firmware-update BEFORE first
pairing (the Kasa rule)**; pick the Zigbee channel deliberately around the crowded 2.4 GHz WiFi (census
08-13); dongle on its USB extension cable, away from USB3 ports.

Companion rule from `SESSION_START.md` §3: *"**Never declare done without verifying the far end.**
Component checks said 'healthy' through every real camera failure on 08-15; only looking at the output
caught it."*

### E.19 — Kasa auto-firmware-update OFF, every device, forever
**Date:** 2026-08-14, extended 2026-08-15 · **Status:** STANDING · **Evidence:** `09de34b` (08-14),
`5de10eb` (08-15); lighting plan page 2

Done via **the HA toggle the Kasa app hides**. The lighting plan states the reason: *"TP-Link firmware
has previously broken local control — and **local control is the entire reason these are being
used.**"* Extended 08-15 to all Zigbee gear.

### E.20 — Zigbee2MQTT, not ZHA
**Date:** 2026-08-13 · **Status:** STANDING · **Evidence:** `66e6b0b` (2026-08-13);
`/tip/CLAUDE.md:122`; `/tip/docs/inventory/HCC_INVENTORY.md:25`

**Forced by hardware already bought:** the Gleco leak sensor (`TZ-SJ-SD_E`, $4.62) is **Z2M-only, no
ZHA support**. Judged the right call anyway. A related decision from the same day: **do not swap to a
ZBDongle-E** — the CC2652P handles ~50 direct children, which is what the current all-battery,
zero-router mesh needs.

### E.21 — Mesh geometry per Jeff: the kitchen is the far point, not the living room
**Date:** 2026-08-13 · **Status:** STANDING · **Evidence:** `e057559` (2026-08-13);
`/tip/docs/inventory/HCC_INVENTORY.md:51-53`

Jeff corrected the assumption: **the kitchen is the FARTHEST point needing mesh**; the living room sits
~12 ft from the dongle, so a router there is redundant. Router priority is therefore kitchen first. The
"beige box" was identified as the **MOES module**, assigned to the single **~12 W** LED over the kitchen
sink — *"finally a load it fits"* against the 100 W/gang limit — with the caveat that it **needs a
MOMENTARY push-button at the wall**, not a standard toggle (toggles cause continuous-ramp misbehaviour).

Also from Jeff, 08-13: the **Lepro 14 W LED downlights on hand are SPARES ONLY**, replacements for
existing fixtures, **not expansion**.

### E.22 — Jeff closed the neutral and box-fill questions by doing the work himself
**Date:** 2026-08-13 · **Status:** CLOSED · **Evidence:** `8b7a69a` ("Lighting: Jeff pulled dedicated
LED circuits + multi-gang boxes - closes neutral and box-fill open items"), `c722076` ("fans confirmed
separate from all LED circuits - dimmers safe everywhere (Jeff confirmed)"), both 2026-08-13

This is A.4 in practice: the open electrical questions were closed not by research but by Jeff pulling
new circuits and confirming the fan separation himself.

### E.23 — The inventory is a standing obligation
**Date:** 2026-08-13 (Jeff's standing job) · **Status:** STANDING · **Evidence:**
`/tip/docs/inventory/HCC_INVENTORY.md:3-5`

Jeff, verbatim:
> "make sure we stay on top of the inventory that's coming in, what we buy from now on... really make
> sure that we're adding to the system rather than taking away from it. **It's all got to be tracked
> meticulously.**"

The file's own rules: **log at order time**, not arrival · **"Nothing gets bought twice because nobody
checked this file. Check here first."** · **Retired ≠ deleted** — mark RETIRED/RESALE with a reason and
keep the row · flag wrong-variant purchases loudly · sync the iCloud copy after every edit.

### E.24 — Master backup system, built to Jeff's brief
**Date:** 2026-08-01 · **Status:** STANDING, with one open gap · **Evidence:** `552c699` (08-01),
`03e688b`

Jeff's brief, verbatim: **"save everything... it would be catastrophic to lose anything."**
Built: a git snapshot layer plus a daily HA backup synced off-box to iCloud, using a **dedicated
least-privilege token**, with **14-copy retention**. The remaining flagged risk is E.7's encryption key.

### E.25 — Cache policy, final form
**Date:** 2026-07-21 · **Status:** STANDING · **Evidence:** `173270a` → `70dba84` → `e37a193` (07-21)

`_headers` with `no-cache` on `/` and `/index.html`; `no-cache, no-store, must-revalidate` plus
`CDN-Cache-Control: no-store` on `/service-worker.js`; SW registered with `{updateViaCache:'none'}`;
SW HTML fetch uses `{cache:"no-cache"}`. Standing rule attached: **"check `cf-cache-status` on the
custom domain, not just `Cache-Control`."** Service worker is **network-first for HTML** (`19dd459`,
06-26) because cache-first meant *"no code fix ever reached the device."* Cache version must be bumped
on every asset change — `hcc-v78` at branch tip.

### E.26 — Security headers on exact paths only; no CSP by design
**Date:** 2026-08-15 · **Status:** STANDING · **Evidence:** `37fac0c` → `186025f` (2026-08-15);
`/tip/docs/SESSION_START.md` §3

**Two live deploys proved the `/*` wildcard is silently ignored** on this Cloudflare Pages project —
verified 5–6 minutes after each deploy landed, while the pre-existing exact-path rule for
`/service-worker.js` *was* being applied. Headers now hang off `/` and `/index.html`. **No CSP by
design** — inline script/style would require `unsafe-inline`, which would make the header decorative.

### E.27 — Repo identity: `Master-the-Master-` is the only live repo
**Date:** 2026-08-06 · **Status:** STANDING · **Evidence:** `6e24295` (2026-08-06),
`docs/repo_deploy_mystery_coworker_ask_2026-08-06.md`; `/tip/CLAUDE.md:170-172`

- **Live repo:** `d4c2np9f69-afk/master-the-master-` — *"this IS the repo Cloudflare Pages deploys,
  confirmed live 08-06"* (Jeff saw new work appear after a push).
- **`d4c2np9f69-afk/Toro-Timemaster-` is a stale diverged mirror** — one-way "Sync from
  Master-the-Master-" commits prove it was always downstream. *"**do not develop on Toro-Timemaster-
  going forward.**"*
- **Active branch:** `claude/time-master-project-liq1jw`.
- **`main` contains only `Toro_TimeMaster_PWA_Package.zip` — do NOT use it for deploys.**
- Backup-branch deletion and repo archiving were **handed to the coworker** (`2b0cb3d`) because the
  cloud session gets a real 403.

### E.28 — GitHub Actions workflow disabled, not deleted
**Date:** 2026-08-06 · **Status:** STANDING · **Evidence:** `ac99b33` (2026-08-06)

Converted to `workflow_dispatch`, **ending 124 failure emails per week.** Not deleted, so the history of
why it existed survives. It had never worked — the `CLOUDFLARE_API_TOKEN` secret was never set.

### E.29 — Physical backups and a pinned verified-working branch
**Date:** 2026-06-24 · **Status:** STANDING · **Evidence:** `c200a18` (2026-06-24)

`backups/*.2026-06-24.bak` for all seven working files, plus branch
`backup/verified-working-2026-06-24` pinned at `e904a5b` (66/66 tests passing). A known-good anchor.

### E.30 — Revert-first when the sensor path is at risk
**Date:** 2026-06-23 · **Status:** STANDING · **Evidence:** `b629c83` (2026-06-23)

When in doubt about what broke the bench-tested pipeline, **return to "the exact version that was
working during bench test" before experimenting.**

### E.31 — Blink integration files vendored into the repo
**Date:** 2026-06-25 · **Status:** SUPERSEDED — the vendored files are now declared dead artifacts
(B.20) · **Evidence:** `e830083` (06-25), superseded `7bbc8a2` (07-09)

Recorded because the *reasoning* still holds for any future vendoring decision: after **ten** installer
iterations, install-time downloads (local copy → GitHub raw → GitHub API) were **all rejected** in
favour of bundling all 12 files. The files later became harmful for a different reason (shadowing the
fixed built-in), which is the lesson, not a contradiction.

### E.32 — Entity-scoping and inverted-semantics rules
**Date:** 2026-07-21 · **Status:** STANDING · **Evidence:** `6464a8e`/`9647ca5`/`6aeba2f` (07-21),
`4800`-region

- **"Always scope CAR entity lookups to Mercedes/GLE/mbapi to prevent house-entity bleed."**
- **"`*_closed` entities invert on/off semantics"** — this caused a false "window open" until inverted
  (`4842`-region commit).
- **`temperature_configure` values must be strings** (`"16"`, not `16`) per mbapi2020's `services.yaml`
  (`71d0dc2`).

### E.33 — Beehive pinned to a fixed IP; cloud devices left alone
**Date:** 2026-07-09 · **Status:** STANDING · **Evidence:** `9785381` (2026-07-09)

Beehive fixed at **192.168.1.66**. Fixed IPs for cloud-connected devices (Blink, Tuya) judged
**unnecessary**. Network finding recorded honestly: the AT&T **BGW320-500** cannot change its DNS
resolver — *"per-device 1.1.1.1 or own-router-in-IP-Passthrough is the only real DNS fix."*

### E.34 — HOME GUARDIAN is the designated home for all security/alarm/system checks
**Date:** 2026-07-04 (Jeff's call) · **Status:** STANDING · **Evidence:** `ad3be81` (2026-07-04);
`/tip/CLAUDE.md:176`

> "**🛡️ HOME GUARDIAN is the designated home for ALL Home Assistant security, home-alarm, and system
> checks (Jeff, 07-04).** Every future security/alarm feature goes here, built from the Section Kit +
> `--a-guardian` accent, live from HA `/api/states` via `loadGuardian()`."

This decision **killed the planned CLIMATE tab** — *"Jeff's call: CLIMATE would only ever hold the
thermostat, so that nav slot goes to Home Guardian."* The LUX thermostat moved verbatim into Guardian
(`ad3be81`), then moved again on 08-03 to **HOME, under the cameras**, at Jeff's request (`87d2459`).

---

# PART F — Design and visual standards (the gold standards)

### F.1 — The hero-image gold standard
**Date:** 2026-06-28 · **Status:** STANDING · **Evidence:** `1a98f28`/`43520a5`/`ebedb85` (06-28), later
eased `0f10f0c`/`c17e0a3`; `/tip/CLAUDE.md:282-290`

Every hero — *including any NEW section* — MUST use the shared module. **Never grade a hero
individually.**
- **`.hcc-hero-grade`** — the one cinematic colour grade for every hero `<img>`.
- **`.hcc-hero-vignette`** — warm-centre/dark-edge vignette, paints under text overlays.
- **`applyHeroGrades()`** — runs at INIT, auto-tags every `.house-hero`/`.sec-hero`/`.hcc-hero`
  container and its `<img>`.

To add a hero: put the photo in an `<img>` inside a `.sec-hero` container with a descriptive `alt`.
**That's it.** Explicitly forbidden: *"do NOT add a per-hero `filter` CSS (fights the shared grade); if
a hero needs a nudge, adjust the shared `.hcc-hero-grade` values (affects all, keep them unified).
**Never re-shoot a photo just to 'fix' tone.**"*

Also standing (`f735771`-era heroes work): all seven hero classes carry `width:100%` — added 08-06 to
fix a desktop layout gap where aspect-ratio + max-height with no width made the browser shrink the
*width* rather than crop.

### F.2 — The visual consistency lock (design tokens + Section Kit)
**Date:** 2026-06-28 · **Status:** STANDING · **Evidence:** `8b4c8a0` (2026-06-28);
`/tip/CLAUDE.md:294-302`

**Tokens (`:root`):** Status `--ok`/`--warn`/`--bad`/`--info` — *"never hardcode these hexes"*, use the
token, `statusColor(level)`, or `.s-ok/.s-warn/.s-bad/.s-info`. Brand
`--gold/--text/--muted/--dim/--bg/--surface/--card/--border/--serif`. **Every NEW section gets its own
`--a-<id>` accent** (nav underline + card-title bar). Shape `--radius` (10px).

**Section Kit — build every new section from these, no bespoke markup:** `.sec-hero` + `<img>`;
`.card` + `.card-title` (`.cat-<accent>`); spec rows
`<ul class="spec-list"><li><span class="sk">Label</span><span class="sv">Value</span></li></ul>`;
status banners `.wx-banner`/`.wx-load`/`.wx-go`/`.wx-caution`/`.wx-no`; buttons `.btn-full` +
`.btn-gray`/`.btn-green`/`.btn-red`; external links as real anchors, never `window.open`.

The original rule, verbatim from `8b4c8a0`: *"Don't introduce a new green/yellow/red… Don't invent a new
card/banner/button style."*

**Do-not-rename CSS class list** (`/tip/CLAUDE.md:263`): `.modal-ov`/`.modal-ov.show`, `.modal-box`,
`.mbtns`, `.mbtn`/`.mbtn.primary`/`.mbtn.secondary`, `.btn-green`; nav `button.snav-btn`
(`#snav-home/weather/irr/yard/guardian/car`, keeping `SECTIONS`/`NAV_IDS` in the same order as the
section DOM); sections `#section-home/weather/irrigation/yard/guardian/car`; YARD tabs `button.tab`;
CAR tabs `button.car-tab` (scoped `carTab()`, **not** global `showTab()`).

### F.3 — Style A (Apple Clean): ONE font, everywhere, forever
**Date:** 2026-06-29 · **Status:** STANDING · **Evidence:** `8ac220a` (2026-06-29);
`/tip/CLAUDE.md:302`

**Jeff picked the "Apple Clean" direction from three rendered mockups.** From the commit body:

> "Unify typography to ONE system font everywhere (`-apple-system`/`system-ui`). **Killed the
> Georgia-serif vs sans mix that made the UI look 'choppy'** by pointing both `--font` and `--serif` at
> the same Apple stack, so every legacy `var(--serif)` usage (header title, nav, card titles, section
> labels, spec values, hero overlays) snaps to one clean font."

The standing rule at tip: *"**Typography:** ONE font everywhere — `--font` and `--serif` both point at
the Apple system stack. **Never reintroduce a serif or second font family.**"*

Verified by a font-consistency audit on 07-31 (`4145`-region): every `font-family` grepped; the one
remaining declaration was never applied to any element, plus terminal-style monospace in a doc (via
Google Fonts, never bleeding into the app UI).

### F.4 — Default theme = LIGHT, with a persistent toggle
**Date:** 2026-06-29 · **Status:** STANDING · **Evidence:** `28d79c6` (2026-06-29);
`/tip/CLAUDE.md:300`

> "**Theme:** toggle in header, `toggleTheme()`, persists in `localStorage.hcc_theme` (**default
> light**). Implemented as `html.light{…}` overriding only the design tokens — drive all text/borders
> from tokens (`var(--text)` etc.), **never hardcode a light text color** on a card (vanishes in light
> mode)."

Style A made light mode **white top-to-bottom**: header, section nav and tab bar all go white in
`html.light` (they had been dark chrome), with clean section-accent underlines; the iOS status-bar
`theme-color` follows.

**One documented exception:** on login, the app sets **dark mode — "Angela's preference"** (`4fabef8`,
07-21).

**The hardest-won corollary** (`/tip/CLAUDE.md:506`, Pending Item 17, closed 08-11): the
hardcoded-hex-instead-of-token pattern was **a real bug, not cosmetic.** A contrast auditor that
composited every translucent ancestor found **19 genuine failures on light surfaces** — worst being the
credential save/error messages at **1.09–2.9:1** ("Wrong password", "Save failed — storage full" —
literally invisible in light mode). 36 light-surface sites fixed to tokens; sites on genuinely dark
surfaces (splash login, irrigation rain delay, LUX fan badge) **deliberately keep their bright hexes**,
because a light-mode token there would go dark-on-dark. Two tokens darkened on their own merits
(`--warn` → `#96600f`, `--ok` → `#137534`). **0 remaining failures in both themes.**

Two lessons attached, both violated before being learned:
- *"a background set in a `style=` attribute beats any selector however specific — move it into CSS
  rather than fighting it"* (cost a debug cycle on 08-01 **and again** on 08-11).
- *"a contrast checker that only reads `backgroundColor` silently lies about any element using a
  `linear-gradient` — it must read `backgroundImage` too, or it invents failures that do not exist."*

### F.5 — The visual identity that came before Style A (superseded, kept for the record)
**Date:** 2026-06-23 → 2026-06-24 → 2026-06-29 · **Status:** SUPERSEDED · **Evidence:** `f599bd9`
(Archivo dark-glass, 06-23) → `278a78e`/`c17bdf0`/`1395a31` ("Premium Estate Command Center", 06-24) →
`8ac220a` (Style A, 06-29)

The **Archivo dark-glass tech look** lasted about 28 hours. The **"Premium Estate Command Center"**
identity that replaced it — warm gold `#d4af37`, brick red `#c0392b`, warm charcoal, cream text,
Georgia serif, golden-hour AI-generated heroes to a written JSON spec (`HERO-STYLE-GUIDE.json`, still
at branch tip) with ready-to-paste ChatGPT prompts — lasted five days before Style A killed the serif.

Two rejections from that window are still standing style rules: **all stark white text is rejected**
("Purge all white text — warm cream-gold everywhere", `1395a31`), and **nanny copy is rejected**
(C.40).

### F.6 — 44 px minimum tap targets
**Date:** 2026-08-06 · **Status:** STANDING, with one explicit Jeff-approved exception ·
**Evidence:** `e92f4fc` (08-06), `436ce61`; exception `70d16f2` (08-05)

*"never to be clamped below again."* The one recorded exception: the LUX fireplace-panel layout was
approved **with Jeff explicitly accepting sub-44px tap targets** (`70d16f2`) — an informed choice by
the user, not an oversight.

### F.7 — The panic button's placement, decided → reversed → settled
**Date:** 2026-06-24 · **Status:** SETTLED · **Evidence:** `dc0b6c1` → `6b6d477` → `4c9d36c` (all
2026-06-24)

Decided HOME-only and compact (`dc0b6c1`) → reversed, added to all sections (`6b6d477`) → settled back
to **HOME only, at the bottom** (`4c9d36c`), with `CLAUDE.md` recording "Panic button — HOME only
CORRECT." Three commits in one day; worth keeping because it shows how a settled thing is reached.

---

# PART G — Naming, identity, IDs and accounts

Every fact here is evidenced. **Note:** most of these live in a **public** repo, which the record itself
flags as a problem (see G.6).

### G.1 — Names and their origins

| Name | What it is | First evidence |
|---|---|---|
| **HCC / Home Command Center** | The project itself. Mottos: **"MANAGE • MAINTAIN • MONITOR"** and **"Everything. In One Place."** | `eb342db`, `6649269` (2026-06-21) |
| **Beehive** | The dedicated Home Assistant machine (Beelink J45, Pentium J4205, ~8 GB/128 GB). Runs **HA OS**, nothing else — *"Beehive stays PURE HA"* | `46be882` (06-22); `9a9da77` (07-01) |
| **the beast** | Jeff's main PC — the workbench, the AI/media brain, and the host of the local Claude coworker. Identified on the LAN as `301Server` | `e7b6c64` (06-22); *"'The beast' = Jeff's main PC, used as the workbench"* `9a9da77`; `494`-region network map |
| **the coworker** | The Claude session running on the beast with real local/LAN access | `bec7440` (2026-07-09) |
| **Angela** | Jeff's wife. HA login `angela301`, `person.angela_loewen`, her own Long-Lived Token, own 10-mile "almost home" zone. Her work machines are VPN'd/firewalled — *"LAN silence is normal"*. **Prefers dark mode** | `049ad6d` (07-11); `b781514`; `4fabef8` |
| **Braxton** | Third person on the panic notify list, alongside Jeff and Angela | `7a5e984` (07-01) |
| **Jeff's dad** | Named in the family-access model | `80799e7` (07-09) |
| **Sharky** | A LIDAR-equipped robot vacuum on the LAN at `.231`; its LIDAR traced the first floor plan | `e9beb3e`, `29c7a1a` |
| **GaragePC** | HP TouchSmart 520 in the garage; needed its own password (in HCC-secrets), not an SMB protocol fix | `17fc227` (08-13) |
| **Lucky Mike** | The horse-barn "Smart Stall" side project — queued, not started | `c8ca302` (06-30) |
| **hcc-panic-button** | The HA webhook the panic button POSTs to | `eb342db`-era, live at tip |

### G.2 — URLs and infrastructure

| Thing | Value | Evidence |
|---|---|---|
| Live URL | `https://toro1-5rz.pages.dev` | `/tip/CLAUDE.md:168` |
| Custom domain | **`loewenhome.com`** (+ `www`), Active/SSL, HTTP 200 worldwide, publicly shareable | `5528`/`5536`-region commits (07-11); `/tip/CLAUDE.md:168` |
| Cloudflare Pages project | `toro1` | `1d7cacc` (06-22) |
| Repo (live) | `d4c2np9f69-afk/master-the-master-` | `6e24295` |
| Repo (stale mirror — do not use) | `d4c2np9f69-afk/Toro-Timemaster-` | `6e24295` |
| Active branch | `claude/time-master-project-liq1jw` | `/tip/CLAUDE.md:171` |
| KV namespace ID | `ec5b28597d9c4fb9b182b1aea1d50eff` (`MOWER_KV`) | `/tip/CLAUDE.md:202` |
| Beehive local | `homeassistant.local` / **`192.168.1.66`** | `/tip/CLAUDE.md:543` |
| Beehive remote (primary) | `https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa` | `/tip/CLAUDE.md:543` |
| Household WiFi SSID | `Loewen301` (5 GHz split to `Loewen301-5G`) — **not** the factory SSID on the label | `/tip/docs/inventory/HCC_INVENTORY.md`; `529`-region |
| Gateway | AT&T Fiber **BGW320-500** (integrated ONT, WiFi 6), admin at `http://192.168.1.254` | `/tip/docs/inventory/HCC_INVENTORY.md` |
| Email | `jeff.loewen@comcast.net` — **email only; do NOT infer Xfinity internet from it** | `/tip/CLAUDE.md:541`; `542`-region correction |
| Secrets map (outside the repo) | `C:\Users\jeffl\HCC-secrets\HCC_ACCESS.md` | `1d1ebdb` |
| Archive mirror | `C:\Users\jeffl\iCloudDrive\HCC-Archive\` | `fab5b30` |
| Full-res photo originals | `C:\Users\jeffl\iCloudDrive\HCC-Photos\` | `/tip/CLAUDE.md:278` |

### G.3 — Weather station

| Thing | Value | Evidence |
|---|---|---|
| Weather Underground PWS | **`KTNWHITE21`** — Jeff is an NWS-trained spotter, station is "WU Recognized"/quality-verified | `/tip/CLAUDE.md:544`; `7372`, `7191`, `7399`-region |
| WU API key | `0e87ee079c0147a787ee079c01d7a75d` | `/tip/CLAUDE.md:544` |
| Fallback source | Open-Meteo (chosen partly because "no key required") | `c8e729c` (06-23) |
| Location | White House, TN — **Central Time** | `/tip/CLAUDE.md:73` |

### G.4 — Vehicles

| Vehicle | Detail | Evidence |
|---|---|---|
| **Mercedes GLE 350** | VIN **`4JGFB4KB0MA478988`**. Via `mbapi2020` (MercedesME 2020, ReneNulschDE) through HACS, region North America. mbapi2020 `entry_id` **`01KY38Z7C90J2WE6S9R987JQZ4`**. Jeff enabled **"Disable Capability Check"** — the setting that had been blocking every command except flash-lights on his NA vehicle | `778f6bd` (07-22); `7afcda2` (07-17); `473f122`; `c64d0f8` |
| **2001 Ford F-250 Super Duty** | VIN **`3FTNX21FX1MA23431`**. 7.3 L Power Stroke Diesel, 4WD, crew cab. **No connected-car path** (2001). Specs flagged as *"assumed… from VIN + photo — Jeff should confirm"* | `ee0d376` (07-24) |
| **Toro TimeMaster 21200** | **Serial No. 401338948** (confirmed 08-03 via data-plate photo). Engine B&S 14D935. Purchased 2018-04-11. Serial falls in the `400000000-402081999` production range — so PartsTree's `21200-toro-30-timemaster-walk-behind-mower-sn-400000000-402081999` and the matching eReplacementParts link are the **correct** parts diagrams, **not** the `402082000-403599999` range | `/tip/CLAUDE.md:545`; `12308ff` (06-22) |

### G.5 — Utility meters and accounts

| Utility | Detail | Evidence |
|---|---|---|
| **Water (WHUD)** | Meter **Kamstrup flowIQ 2100** (corrected from an initial "Kamstrup 621"). Separate external pit radio **MIU `100WD`**, **ERT ID `79453337`**, unencrypted **Itron ERT-SCM**, protocol `scm+`, 915–930 MHz, ~1 SCM/min, **no AES key required**. Old meter **17272512** swapped out. Billing cycle ~21st | `76d0326`, `9fefa97` (06-30); `5034f26` (07-01); `/tip/docs/UTILITIES_REFERENCE.md:19` |
| **Gas (Piedmont → Spire)** | Account **`6100 0546 4779`**. Meter **Elster AC-250**, Piedmont # **`T821986`**. Radio **Itron 100G Datalogging ERT — unencrypted, no key needed**. Billing cycle ~5th. TN customers moved to Spire 2026-03-31, rates unchanged | `719638f` (06-30); `/tip/docs/UTILITIES_REFERENCE.md:26` |
| **Electric (CEMC)** | Account **`4501007001`**, meter **`145590962`** (**Landis+Gyr Gridstream RF** — not Itron, cannot be radio-read by CC1101/rtlamr). **200 A service, Challenger panel.** ZigBee HAN path judged "not worth chasing" — irrelevant because the CT build reads the panel directly | `76d0326` (06-27); `/tip/docs/UTILITIES_REFERENCE.md:34` |
| **Sewer** | City of White House. Jeff's 3-year reimbursement case targets the **City**, not WHUD — he had already written the City (no response) and contacted his alderman ~2 years ago (stalled). *"stronger meter data is the lever"* | `50b56c1`, `95eadf9` (07-03) |

### G.6 — 🔴 Known security exposure, flagged in the record and NOT yet fixed
**Date flagged:** 2026-08-16 · **Status:** OPEN · **Evidence:** `1d1ebdb` (2026-08-16)

> "SECURITY: the Weather Underground API key is in `CLAUDE.md` in this **PUBLIC** repo. It needs moving
> out and rotating - flagged at the top of `HCC_ACCESS.md`."

Confirmed still present at branch tip (`/tip/CLAUDE.md:544`). The same class of exposure governs E.7
(never commit AES/backup keys) and E.8 (firmware `.bin` strings are plaintext, so no public firmware
hosting).

### G.7 — The LUX thermostat, and the note that says leave it alone
**Status:** STANDING — *"DO NOT CHANGE UNLESS BROKEN"* · **Evidence:** `9eaabcb`, `b360583` (06-26),
`c72c8a8`; `/tip/CLAUDE.md:514-528`

**Jeff's device: `CS1-DD-FB`.** Backend is **Azure AD B2C** (`connecteddevicesjci.b2clogin.com`,
client ID **`b335ca43-3bde-4406-b281-8816afb7cc91`**) + `www.myluxstat.io`. Redirect URI
`connecteddevicesjci.luxmobile://connecteddevicesjci/path`. Two dead ends were rejected on the way:
`integration.lux-geo.com` (DNS dead) and `api.geotogether.com` (*"UK smart meters — completely
wrong"*). **Writes use POST, not PUT** — PUT always returned 500.

### G.8 — The six sections at branch tip
**Evidence:** `/tip/CLAUDE.md:174`

**HOME** (cameras, then LUX thermostat, then utilities) · **WEATHER** · **IRRIGATION** · **YARD**
(mower data) · **GUARDIAN** (whole-home safety/security/alarm) · **CAR** (Mercedes GLE 350 + Ford
F-250 switcher).

Lineage: the original 4-section HCC shell was **YARD / SECURITY / HOME / SAFETY** (`eb342db`, 06-21),
renamed within two days to **HOME / WEATHER / IRRIGATION / YARD** (`f599bd9`, 06-23), with GUARDIAN
(07-04) and CAR (07-16) added later. The concept from day one: *"Each HCC section is an app-within-an-
app"* (`c36f2ab`).

**A future seventh section is planned but not started:** **STABLE**, accent `--a-stable`, for Lucky
Mike. *"**Do not start until Jeff says go.**"*

---

# PART H — Reversals, corrections, and things Claude got wrong then fixed

Kept together because Jeff asked for the bad and the ugly, and because a reversal is itself a decision.

| # | What | Reversed/corrected when | Evidence |
|---|---|---|---|
| H.1 | **Base64-embed all images** so the PWA is "fully self-contained" — reversed **within 48 hours** when `index.html` hit 3.1 MB | 06-22 → 06-23 | `6649269`/`12308ff` → `739d004` |
| H.2 | **Home Assistant in Docker on Jeff's PC** → dedicated Beehive on HA OS | 06-21 → 06-22 | `eb342db` → `70416e6` |
| H.3 | **"Recommend an electrician"** → *"Jeff wired his own house — never suggest hiring an electrician"* — reversed three minutes after being written | 06-27 | `731d435` |
| H.4 | **The one-tap browser Beehive setup wizard** — killed within the hour by the HTTPS→HTTP mixed-content block | 06-23 | `b3d773c` → `1f3ce1a` |
| H.5 | **Installer command curl → wget → curl** — flip-flopped across three commits; the direct cause of Mandatory Rule 7 | 06-23 → 06-24 | `686bece`, `1f3ce1a`, `a744651` |
| H.6 | **mPING in-app form** removed → restored on Jeff's ask → deleted for good | 07-02 | `adc5377` → `6b29cad` → `947a99d` |
| H.7 | **Kodi-as-media-brain** (Jeff's call) → Fire TV route kept (also Jeff's call) | 07-10 → 07-14 | `05dc1db` → `c13f101` |
| H.8 | **CLAUDE.md claimed the mbapi2020 PIN was stored in integration options** — the options dict was **empty**; every PIN-gated command had been failing silently | 07-24 → 08-06 | `c73e32e` → `473f122` |
| H.9 | **"Water meter pit radio fault, call WHUD"** — retracted the same day; the meter was healthy all along; the wrong diagnosis kept on record deliberately | 07-31 → 08-01 | `13502b9`, `593ddf7` → `fb5068c` |
| H.10 | **Claude regenerated the heroes and deleted Jeff out of his own app** — the origin of the PROTECTED photo rule | 08-06 | `595ec23` → `db9ffcc` |
| H.11 | **Glassmorphism redesign, attempt one** — shipped, two failed darkening fixes, then **fully reverted on Jeff's call** | 08-06 | `2bf50db` |
| H.12 | **Claude's own coverage map blew out `localStorage` and reset Jeff's hour meter to 5.9** | 08-10 | `b568a4b`; `/tip/CLAUDE.md:384` |
| H.13 | **A speculative wall-iPad auto-rotate was shipped as a guess** — withdrawn as policy; root cause turned out to be Claude's own hero max-height CSS edit from earlier the same day. Jeff cut through it with one fact: *"It worked perfectly before the picture edit."* | 08-08 | `24136c7`, `bb9d1cf`; `1518`-region |
| H.14 | **Claude's own hero fix cut Jeff's head off the yard photo.** Jeff: *"You got it they are rendering correctly now, however my head is cut off in the yard hero pic"* | 08-11 | `/tip/CLAUDE.md:382`; `docs/CHANGELOG_ARCHIVE.md:23` |
| H.15 | **The hour meter never worked for months across 5 real mows; Jeff was told his sensors were faulty and bought replacement hardware he did not need** | discovered 08-11 | `d18db7b`, `/tip/CLAUDE.md:70` |
| H.16 | **Pending Item 19 closed as "solved by Inovelli 3-Way Dumb"** → **REOPENED** the same day when Inovelli turned out to be scrapped | 08-16 | `007e14e` → `c05d647` |
| H.17 | **Claude told Jeff twice that the Inovelli decision "was never written down."** Both statements were wrong — the current plan *had* been documented on 08-13 | 08-16 | `c05d647` |
| H.18 | **Network map: the "Nest Protect" was Angela's bed-lamp Tuya socket** (proven by unplug test); **`.173 DellMasterBed`** was misidentified three separate times before being resolved | 08-13 | `8796a9c`, `902d0dc` → `8aeacf0` → `793b949` |
| H.19 | **Sylvania plugs called "Bluetooth-only Echo Dot devices"** — both guesses wrong; corrected to WiFi Tuya at `.199/.200/.202/.205` | 08-13 | `2aca121` |
| H.20 | **`irrGalFromHistory()` refined the on-screen note but never the stored history entry** — so the tracked sewer-overcharge total was quietly less accurate than what Jeff was reading on screen, forever. Found only because **Jeff asked to confirm it before sending bills** | 08-05 | `/tip/docs/UTILITIES_REFERENCE.md:17` |
| H.21 | **IRR_FLOW recalibrated from real measured water**: `{1:17.2, 2:14.3, 5:5.7}` → `{1:8.78, 2:10.09, 5:4.4}` — a **23–49% cut**. Past-cycle overcharge totals accepted as **overstated and NOT retroactively fixed** (no HA history exists to recompute them) | 08-06 | `4252086`/`0827617` |
| H.22 | **Mow history had NEVER recorded a single mow** — the trigger waited for a condition the box never sent | 08-08/08-11 | `890`-region, `d18db7b` |
| H.23 | **The endpoint kept serving `cmd_ack:1` long after the fact**, and **a dead sensor kept serving its last reading** (pitch/roll of −35.3 — "the classic both-axes" tell) | 08-11 | `787`, `799`, `807`-region |
| H.24 | **The GPS "Fort Worth simulator bug"** — tapping Simulate would have yanked the map ~700 miles off Jeff's property | 08-10 | `1267`-region |
| H.25 | **Six invented sensor fields** (`fart_detected`, `methane_ppm`, `blade_engaged`, …) appeared in a spec that had no basis in the firmware | — | `1340`-region |
| H.26 | **Zones 3/4/6 left uncalibrated on purpose** — Jeff: the back yard *"is rarely watered except in severe drought … not an oversight to chase"* | 08-06 | `7cccc59` |
| H.27 | **The `zone.work` radius gap** — deferred by Jeff (*"leave it for now, dial in later"*), then resolved when he gave the real garage address, **310 Commerce St, Nashville, TN** → 36.1624877, −86.7776215. Flagged honestly: this is only ~90 m from the original office coordinates, not the ~0.4 mi Jeff estimated — *"flagged to him, not fully reconciled, but he gave the address directly so it took priority"* | 08-01 | `bc3df2b` → `3537b00`; `/tip/CLAUDE.md:498` |

---

# PART I — Open at branch tip (2026-08-16): nothing here is settled

Listed because a ledger that only records closures misleads.

| # | Open item | Evidence |
|---|---|---|
| I.1 | **Garage two-location switching** — **REOPENED.** Jeff must choose: (a) **HS210 matched kit** so both kitchen and garage positions stay live, or (b) **single HS200** at the garage door and repurpose the kitchen position. A lone HS200 leaves the second position **dead** | `/tip/CLAUDE.md:509-510`; `c05d647` |
| I.2 | **Backyard AI thresholds** — *"a real security gap, one edit away."* Needs Studio Code Server (Jeff must log into HA in a browser first); `packages/hcc.yaml` is not reachable via the config API and there is no SSH on the box | `/tip/CLAUDE.md:487` |
| I.3 | **HA backup encryption key** — still only on one PC. *"the single most load-bearing secret in the whole disaster-recovery system"* | `/tip/CLAUDE.md:489` |
| I.4 | **SONOFF MINI DRY** — Jeff/coworker to wire, power, eWeLink-pair (Inching Mode), Matter-commission. **App side fully done since 08-08**; it auto-detects the switch entity by name the moment it pairs | `/tip/CLAUDE.md:490` |
| I.5 | **iPad Air 2 wall display** — Safari-15 polyfill deployed and working; HA token persistence + "Add to Home Screen" + Guided Access still need final confirmation. Note the deliberate config: **signed out of iCloud entirely — "Jeff's choice — didn't want Find My tracking on it"** | `/tip/CLAUDE.md:491`; `3644f54` |
| I.6 | **F-250 OBD-II box** — Veepeak (~$30) + ESP32 + optional GPS, not bought | `/tip/CLAUDE.md:492` |
| I.7 | **Panic automation (HA side)** — app already fires the webhook; the automation waits on Zigbee hardware | `/tip/CLAUDE.md:493` |
| I.8 | **Lucky Mike "Smart Stall"** — queued. *"Do not start until Jeff says go."* | `/tip/CLAUDE.md:495` |
| I.9 | **Irrigation zone photos** — decide whether all 6 get the real-photo cleanup or just Garden. All six carry the same fake gold-frame overlay the utility photos had. Needs the coworker's Gemini image pipeline. **Waiting on Jeff's answer** | `/tip/CLAUDE.md:508` |
| I.10 | **Alexa "skip the commercials"** — works via native *"Alexa, turn on FF the Commercials"* phrasing, but the **skip distance is not calibrated to Jeff's target of exactly 4:40 (280 s)** | `/tip/CLAUDE.md:505` |
| I.11 | **`hero-cameras.jpg` cleanup** — fake title, fake "ALL SYSTEMS READY" panel and six dummy tiles still to be removed (logo and 2nd Amendment sticker stay). *"**Not yet done.**"* | `/tip/CLAUDE.md:274` |
| I.12 | **Orbit anti-siphon valve** — ordered 08-15, not installed. The daily 5 AM whole-house leak report runs until it is; **revert that automation to alert-only once the valve is in and proven** | `/tip/docs/SESSION_START.md` §5 |
| I.13 | **Backyard PIR logs zero motion even overnight at 78 °F**, while other cameras fire. Heat explains the daytime misses; **it does not explain the cool hours. Not yet root-caused** | `/tip/docs/SESSION_START.md` §5 |
| I.14 | **Garage camera** reports no temperature or WiFi — likely unplugged, needs a physical look | `/tip/docs/SESSION_START.md` §5 |
| I.15 | **WU API key exposure** (G.6) — needs moving out of the public repo and rotating | `1d1ebdb` |
| I.16 | **Zigbee mesh routers** — the ThirdReality 4-pack is *selected* but the record does not confirm it was ordered or received. The inventory still shows **"Mesh status: zero routers"** | `9dad6a5`; `/tip/docs/inventory/HCC_INVENTORY.md:35` |

---

# PART J — What the record is silent on

An honest ledger names its gaps.

1. **The literal referent of "the last debacle"** (2026-08-14) is nowhere in git. See B.13c.
2. **Why Jeff switched from Fubo to Sling** (2026-07-21). Not recorded.
3. **The price and purchase date of the Beelink J45** (Beehive). Not recorded.
4. **The price of the replacement mower-sensor hardware Jeff bought unnecessarily.** The purchase is
   recorded; the amount is not. This is the one purchase the record confirms was wasted.
5. **No project-wide dollar total exists.** Prices are scattered across `docs/inventory/`, the lighting
   plan, and commit bodies. Nobody ever added them up.
6. **Jeff's side of nearly every conversation.** Only the fragments that a commit message or a doc
   chose to preserve are in git. The bulk lives in the iCloud MASTER RECORD (`1d1ebdb`, 6,896 messages,
   37 sessions, **07-14 onward**) — which means **the first eight weeks of conversation (05-20 →
   07-14) exist nowhere except in fragments.** `1d1ebdb` records a `REQUEST_TO_CLOUD_SESSION` file
   written specifically "to recover the first 8 weeks the cloud sessions own." Whether that recovery
   ever happened is **not in this repository.**
7. **Whether the ThirdReality plugs were actually ordered.** Selected 08-14; the inventory at tip still
   reads "Mesh status: zero routers."
8. **The `$125` Claude Max figure's period.** Jeff said "$125 for Claude Max"; the word "month" is not
   in the quote. See D.1.
9. **The exact date Jeff killed Inovelli.** `c05d647` places the *plan change* at 2026-08-13 20:07 CDT
   and `1572b4a` says he rejected them "early on." The precise moment of the price rejection is in
   conversation, not in git.

---

# PART K — The one-page summary Jeff can act on

**Never do these:**
ask Jeff for credentials · suggest an IT person · suggest an electrician · put a `<script>` tag in the
JS block · re-add a custom Blink override · hoist an `AbortSignal.timeout` across retries ·
`fetch()` HA directly instead of `haFetch()` · include B-Hyve in any ALL ON/OFF · send or store a
Mercedes `pin` field from the app · edit `packages/hcc.yaml` anywhere but the Terminal add-on ·
remove Jeff or the real zone photos from any image · crop a hero without re-checking Jeff is in frame ·
expose HA add-ons/diagnostics/meters to a voice assistant · name a product model from memory ·
report done without testing · auto-dial 911 · commit a key · trim a PROTECTED section.

**Never buy / never re-propose these:**
Inovelli Blue (~$120 the pair) · Enbrighten 43080 · Enbrighten Z-Wave ($39) · Shelly Pro 3EM-400
($140) · smart breakers / panel relays · a commercial alarm panel · myQ software integration · Roku
browser channel · any subscription for the camera/AI/theatre stack · a pressure vacuum breaker
(~$80–150 + annual testing) · Orbit 51059 ($18.49) · a Blink RTSP bridge · an Apple TV jailbreak ·
HomeKit Secure Video · a rain-skip HA automation.

**The budget rule, in Jeff's words:**
> "I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would rather
> spend the money on that and have your help than buy $120 worth of dimmers."

**Lead with what he already owns, then cheapest-first, and flag spend clearly.**

**The process rule that makes all of the above survive:**
> "A decision Jeff makes in conversation goes into a file THE SAME SESSION."
