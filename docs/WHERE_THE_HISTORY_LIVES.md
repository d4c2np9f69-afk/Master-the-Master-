# Where the project history lives

**Deliberately NOT on this branch.** Cloudflare Pages deploys `claude/time-master-project-liq1jw`,
so anything here gets published to loewenhome.com on every push. The history archive is 2 MB of
markdown that would be republished forever for zero benefit â€” the search tool reads iCloud, not
the repo. Keeping it off this branch is the decision, not an oversight.

## The three copies

| Where | What | Use it for |
|---|---|---|
| **iCloud** â€” `HCC-Archive\MASTER-RECORD\` | 219 files, 126 MB: 6,896 verbatim messages, 81 decisions in Jeff's words, all 635 commits, 187 images, the full 05-20â†’08-16 chronicle | **Searching.** This is what the tools read. |
| **Git** â€” branch `claude/task-completion-4a4wmo`, commit `f036f84` | `history-archive/` â€” the 23 reconstructed history files, verified **byte-identical** to the iCloud copy | Durability. Recoverable forever, even if iCloud is lost. |
| **Jeff's zip** | the original handoff package | Cold backup. |

## Getting the git copy back if iCloud is ever lost

```bash
git fetch origin 'refs/heads/claude/*:refs/remotes/origin/claude/*'
git checkout origin/claude/task-completion-4a4wmo -- history-archive/
```

**Do not merge that branch into this one.** It would add 2 MB to every Pages deploy.

## The two tools that read all this

```powershell
.\windows-scripts\Search-HCC.ps1 "<topic>"     # what happened / what was decided
.\windows-scripts\Show-HCCNext.ps1             # where we are / what to do next
```

Both are capped for cost â€” a search is ~2.5k tokens, a status briefing ~600. Neither is ever
auto-loaded.

