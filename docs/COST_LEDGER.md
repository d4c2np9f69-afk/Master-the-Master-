# THE COST LEDGER — what not following the rules has cost Jeff

**Read this before you start work. It is short on purpose.**
Every figure is measured from git, not estimated. Full derivation:
`MASTER-RECORD/CLOUD_SESSION/sections/22-cost-accounting.md`.

## The running total, 2026-05-20 → 08-16

| | |
|---|---|
| Measured active error-fighting | **28.8 hours** (commit brackets only) |
| With pre-commit debugging | **≈44 hours** (stated 0.5 h/burst assumption) |
| Incident-days open | **128** |
| Commits spent fixing self-inflicted problems | **95 of 636 — 14.9%** |
| Subscription burned over the span | **~$234** of Claude Max |
| Hardware bought that wasn't needed | replacement mower sensors |

**Jeff was present for essentially every hour of it** — pasting commands, running 2FA codes, live-testing, refreshing a blank app. That is the real bill.

## The incidents — what happened · what it cost · which rule was skipped

**THE HOUR-METER MISS — 50 incident-days, the worst one.**
The box sent `hours_seconds`; the app read `hours`. Nothing converted. The sensor contributed exactly 0.0 hours across **5 real mows** while Jeff re-entered them by hand. He was told the sensors were faulty and **bought replacement hardware he did not need.**
→ *Coded against a written description of the firmware instead of reading the firmware.*

**THE GREAT BLANK PAGE — 4 h 17 m, one evening, 11 commits.**
A stray `</script>` inside the JS block blanked the entire app. Jeff spent the evening refreshing and reporting each new breakage.
→ *Shipped without loading the page once.*

**THE PIT-RADIO FALSE ALARM — 5 commits, nearly a call to the utility.**
Declared the water meter's radio dead from 47 minutes of flat readings. It was healthy — `rtlamr -unique=true` only republishes when the value changes.
→ *Concluded from too small a window, then reported it as fact.*

**BLINK DISARMED — 4 days, zero cameras, no error anywhere.**
Alert fatigue made Jeff disarm the system. Every camera automation silently stopped. Found by accident.
→ *Never asked what the alert volume was doing to him.*

**THE SHARED ABORTSIGNAL — Jeff diagnosed it himself.**
The app reported his gear offline when it was online. A reused `AbortSignal.timeout` across retries.
→ *He had to find my bug. A PROTECTED protocol had to be written to stop the pattern.*

**THE INOVELLI AFFAIR — 2026-08-16, most of a day, nearly the project.**
$120 of dimmers re-pitched after he killed them on price. Then told twice it "was never documented" — it was, in `HCC_Lighting_Plan.html`, written 16 minutes after he decided.
→ *A decision made in conversation never written to a file; then a search for the DEAD plan whose absence was mistaken for absence of any plan.*
→ Jeff: *"I can't keep doing this every time the session changes."*

## The four rules these keep breaking

1. **Verify at the far end.** Component checks were green through every real failure above.
2. **Write the decision down the same session.** Not "I'll remember." A file, before the session ends.
3. **Search before claiming.** Never say "that isn't documented" without running `Search-HCC.ps1` first.
4. **Don't conclude from a small window.** Watch longer, or say the data is inconclusive.

## Appending to this file

**When an avoidable mistake costs time, add a line here that session** — what happened, what it cost, which rule was skipped. This file grows only when something goes wrong, so its length is the scoreboard. Keep entries to three lines.
