## The Repos and Branches — where the history actually lives

*This section was written directly by the assembling session from first-hand inspection of the
live GitHub remotes on 2026-08-16, not by a mining agent. Every fact below was verified by
running the command shown.*

This is the single most operationally important section in this record. **The history everyone
thought was lost was never lost — it was on a branch nobody looked at.** A session that clones
this project and looks only at the default branch sees one commit and concludes there is no
history. That mistake is what produced the archive request this document answers.

### The topology, verified

**Repo `d4c2np9f69-afk/Master-the-Master-`** — the live project.

| Ref | Commits | Span | What it is |
|---|---|---|---|
| `main` | **1** | 2026-05-20 only | Contains ONLY `Toro_TimeMaster_PWA_Package.zip`. A trap. |
| `claude/time-master-project-liq1jw` | **636** | 2026-05-20 → 2026-08-16 | **THE REAL HISTORY.** Cloudflare Pages deploys from this branch. |
| `claude/electric-smarthub-real-data-dv0pxe` | **559** | 2026-05-20 → 2026-08-11 | Parallel branch; ends 5 days earlier. |
| `refs/pull/1/head` | = liq1jw tip | — | PR #1, opened from the work branch. |

Verified by:
```
git ls-remote origin
git rev-list --count origin/claude/time-master-project-liq1jw   # 636
```

**The trap, stated plainly:** a plain `git clone` of this repo checks out `main`, which has a
single commit — `09f02d4`, "Add files via upload", the original PWA zip. Nothing else. `git log`
shows one line. A session that stops there will conclude the project has no history and will
either ask Jeff to re-explain everything or invent an answer. CLAUDE.md has warned about this
since 2026-06-24 — *"`main` branch: contains only `Toro_TimeMaster_PWA_Package.zip` — do NOT use
it for deploys"* — but the warning is in a file that lives on the branch you have to already
have found.

**Worse: the work branches are not fetched by a shallow or default clone in every environment.**
In this very session, the first clone showed only `main` and the task branch. The work branches
only appeared after an explicit:
```
git fetch origin 'refs/heads/claude/*:refs/remotes/origin/claude/*'
```
That single command is the difference between "the history is gone" and 636 commits of it.

### The two claude/ branches

`claude/time-master-project-liq1jw` (636 commits) and
`claude/electric-smarthub-real-data-dv0pxe` (559 commits) share the same root commit and diverge.
The liq1jw branch is the authoritative one: it is the deploy branch named in CLAUDE.md, it runs
5 days later, and it carries the tip commit `1d1ebdb` ("Build the HCC MASTER RECORD"). 

**INFERRED:** the electric-smarthub branch is a Claude-Code-created working branch from a session
whose task was the electric-monitoring work, which then accumulated general project commits
alongside it. A dedicated agent was assigned to enumerate any commits unique to it and was
interrupted by the usage limit before reporting; **that enumeration is an open item** — see the
Honest Gaps section. Until it is done, treat `electric-smarthub-real-data-dv0pxe` as *possibly*
holding a small number of commits not present on liq1jw.

### Repo `d4c2np9f69-afk/Toro-Timemaster-` — the archived predecessor

Archived on GitHub (read-only), last push 2026-08-06.

| Ref | Commits | Span |
|---|---|---|
| `main` | 41 | 2026-05-20 → 2026-06-24 |
| its two `claude/*` branches | 60 each | 2026-05-20 → 2026-07-26 |

Its `main` holds the June era in clean form and ends at `c200a18` (2026-06-24), *"Add backups/
folder — physical copies of all working files as of 2026-06-24"* — the safety-net commit whose
message also records a branch `backup/verified-working-2026-06-24` pinned to `e904a5b` (the
66/66-tests-passing state). Its `claude/*` branches carry commits titled *"Sync from
Master-the-Master-"* through 2026-07-26, then stop.

**The relationship:** work moved to `Master-the-Master-` and this repo was kept as a mirror,
synced by hand, until the syncing stopped in late July. **It is an incomplete mirror** — its tip
does not contain `functions/api/ha.js`, `auth.js`, `climate.js`, or `mowconditions.js`, all of
which CLAUDE.md lists as key files. Do not treat it as a backup of the current app. Its real
value is the `backups/*.2026-06-24.bak` files: literal copies of the working June 24 app.

### What a future session must do — the four commands

```bash
git clone https://github.com/d4c2np9f69-afk/Master-the-Master-
cd Master-the-Master-
git fetch origin 'refs/heads/claude/*:refs/remotes/origin/claude/*'
git checkout claude/time-master-project-liq1jw
```
Only after the third command does the project exist. Then read `CLAUDE.md` and
`docs/SESSION_START.md` at that branch tip.

### The archival risk, stated for the record

As of 2026-08-16 the entire live application — `index.html` (~7,400 lines), every Cloudflare
Function, every doc, and 636 commits of history — exists in exactly **two** places: this GitHub
branch, and Jeff's PC. It is not on `main`. It is not fully in the archived mirror. If the work
branch were deleted, GitHub's default view of this repository would show a single zip file and
nothing else. **Recommendation: merge the work branch into `main`, or set `main` to point at it,
so the default view of the repository is the project rather than a decoy.**
