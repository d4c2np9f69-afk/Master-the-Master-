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
