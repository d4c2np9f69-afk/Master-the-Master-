# HCC MASTER RECORD — read me first

**For: Jeff, and the local Claude coworker on the beast.**

This folder is the complete written history of the HCC / Toro TimeMaster project, rebuilt on
2026-08-16 from the repository itself. It is split into numbered files because the assembled
single file is ~1 MB and many editors will not open it.

## The one thing to know before anything else

**The project history is NOT on the `main` branch.** `main` has exactly one commit (the original
PWA zip). The real history — **636 commits, 2026-05-20 to 2026-08-16** — is on
`claude/time-master-project-liq1jw`, and a default clone may not even fetch it.

```bash
git clone https://github.com/d4c2np9f69-afk/Master-the-Master-
cd Master-the-Master-
git fetch origin 'refs/heads/claude/*:refs/remotes/origin/claude/*'
git checkout claude/time-master-project-liq1jw
```

Until that third command runs, the project looks like it has no history. That mistake is what
this whole archive exists to prevent.

## What this is — and what it is not

This was NOT written from a session's memory. **Claude sessions do not retain memory between
sessions**, so no session can be asked what it "remembers" about May. Everything here was rebuilt
from commit messages, 274 revisions of CLAUDE.md, and 50+ docs — all cited.

Provenance markers used throughout:
- Plain statements with a hash or file path = **evidenced**, straight from the record.
- **INFERRED:** = reasoning beyond what is written down. Weigh accordingly.
- Where the record is silent, the text says so instead of guessing.

## Reading order

| # | File | What it holds |
|---|---|---|
| 00 | `00-preamble.md` | **Start here.** What this is, the memory question answered straight, the index. |
| 01 | `01-origin.md` | Day one — the original 2026-05-19 Toro app read line by line, and the lost month reconstructed. |
| 02–11 | `0X-chronicle-*.md` | Every day from 2026-06-21 to 2026-08-16, commit by commit. |
| 12 | `12-claude-md-evolution.md` | All 274 CLAUDE.md revisions + **every verbatim Jeff quote**, including ones later edited out. |
| 13–14 | `13-docs-beehive.md`, `14-docs-other.md` | Every document in the repo, summarized with its decisions and prices. |
| 15 | `15-branches.md` | The repo/branch map. **Read this before touching git.** |
| 20 | `20-research-vs-guessing.md` | Every time a forum/source-code lookup ended a guessing spiral. |
| 21 | `21-md-not-read.md` | Every time a CLAUDE.md rule wasn't followed and it cost something. |
| 22 | `22-cost-accounting.md` | The bill: 28.8 measured debugging hours, 128 incident-days, 14.9% of commits. |

Sections 16–19 (the arguments; consolidated decision and incident ledgers; gaps and guidance)
were still compiling when this package was cut. Their substance is already told inside the
chronicles above.

## The key incidents, and where they're told in full

| Incident | Where |
|---|---|
| The Great Blank Page (stray `<script>` tags) | 03 |
| Jeff's 06-24 message, and the rules it created | 03, 12 |
| The KV binding dance (`HCC_KV` vs `MOWER_KV`) | 03 |
| The `/api/ha` proxy — the durable fix for "Beehive Offline" | 05 |
| The shared-`AbortSignal` bug Jeff had to call out | 05, 21 |
| Blink cameras — two weeks, ended by release notes | 06, 20 |
| The Fire TV war | 06, 07, 20 |
| The stale-cache deploy mystery (CDN edge, not browser) | 07 |
| **The hour-meter miss** — `hours_seconds` vs `hours`, months long | 10, 22 |
| The localStorage blowout that reset the hours to 5.9 | 10 |
| The Inovelli affair — rejected on price, then re-pitched | 11, 21 |

## For the coworker specifically

The cleanest handoff is not this zip — it's `git pull` on the branch above, where these files live
at `history-archive/sections/` alongside the live `CLAUDE.md` and `docs/`. Pull first, then read
`CLAUDE.md` and `docs/SESSION_START.md` at that branch tip; this archive is the deep background
behind both.

**The standing lesson this archive exists to enforce, in the project's own words:**
> A decision made in conversation goes into the doc the SAME session.
