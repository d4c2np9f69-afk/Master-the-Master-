# Repo cleanup — two quick GitHub housekeeping tasks (2026-08-06)

**For the coworker to do directly on GitHub.com — nothing local, nothing touches Beehive.**
Follow-up to `docs/repo_deploy_mystery_coworker_ask_2026-08-06.md` (the two-repo Cloudflare
deploy confusion from earlier tonight, now resolved). This closes it out for good so it can't
happen again.

---

## 1. Delete two old backup branches (verified safe — zero unique content)

These are point-in-time backup branches from the initial build-out on 2026-06-23/24. Checked via
git: both are pure ancestors of the real, current work — deleting them loses nothing at all, they
contain no commit that isn't already on the real branch.

- Go to: `https://github.com/d4c2np9f69-afk/Master-the-Master-/branches`
  Find **`backup/verified-working-2026-06-24`** → click the trash-can icon next to it → confirm.
- Go to: `https://github.com/d4c2np9f69-afk/Toro-Timemaster-/branches`
  Find **`backup-verified-working`** → trash-can icon → confirm.

## 2. Archive `Toro-Timemaster-` (the actual fix)

This is the real root cause from tonight: two GitHub repos existed for the same project with no
automatic sync between them, and Cloudflare Pages only deploys from one (`Master-the-Master-`,
confirmed live). `Toro-Timemaster-` diverged and went stale after 2026-07-24 — see the full
evidence trail in `docs/repo_deploy_mystery_coworker_ask_2026-08-06.md` if you want the details.

**Archiving (not deleting) is the move** — makes the repo permanently read-only with a clear
"This repository has been archived" banner, but keeps every bit of its history if it's ever
needed again. Nothing breaks, nothing gets deleted, and no future session — mine or yours — can
accidentally develop or deploy from the wrong repo again.

- Go to: `https://github.com/d4c2np9f69-afk/Toro-Timemaster-/settings`
- Scroll to the bottom, red **"Danger Zone"** box
- Click **"Archive this repository"**
- Type `Toro-Timemaster-` when GitHub asks you to confirm, then confirm

## Left alone on purpose (not part of this cleanup)

- **`main` branch** in both repos — already flagged in `CLAUDE.md` as unused (contains only the
  original zip upload), low risk, not causing confusion, not worth touching.
- **`claude/electric-smarthub-real-data-dv0pxe`** in both repos — the branch this cloud session
  was originally told to develop on. It's redundant now (identical to the real deploy branch) but
  wasn't deleted since it's task-assigned infrastructure, not something to remove unilaterally.
  Jeff can say the word if he wants these gone too — nothing blocking either way.

## Why the cloud session couldn't do steps 1-2 itself

Tried both directly first. Branch deletion (`git push origin --delete <branch>`) returned a real
403 — the git credentials in that session can push commits but don't have branch-deletion
permission (confirmed nothing was touched, branches are untouched). Repo archiving has no
corresponding tool at all in that session's GitHub connector. Both are pure GitHub-account-level
actions, hence this handoff.
