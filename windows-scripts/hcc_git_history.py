#!/usr/bin/env python3
"""Export the COMPLETE git history to the iCloud master record.

Covers the era the transcripts cannot: the project's first commit is 2026-05-20
(original Toro TimeMaster upload) but the earliest session transcript on this PC is
2026-07-14. Everything before that was cloud sessions whose transcripts are gone.
The commit history is what survives - and on this project commit messages are
paragraphs, so they are a real record of what was done and why.

Writes HCC_GIT_HISTORY.md: every commit, full message, file stats, and full diffs
for docs/config/scripts (index.html diffs are omitted by size - it is a single
770 KB file changed hundreds of times; its full evolution lives in git itself).
"""
import os, subprocess, datetime, io

REPO = r"C:\Users\jeffl\Documents\GitHub\master-the-master-"
OUT = r"C:\Users\jeffl\iCloudDrive\HCC-Archive\MASTER-RECORD"
os.makedirs(OUT, exist_ok=True)
SEP = "\x1e"

def git(*args):
    return subprocess.run(["git", "-C", REPO, *args], capture_output=True,
                          encoding="utf-8", errors="replace").stdout

shas = git("log", "--reverse", "--format=%H").split()
print(f"{len(shas)} commits")

path = os.path.join(OUT, "HCC_GIT_HISTORY.md")
with io.open(path, "w", encoding="utf-8") as f:
    f.write(f"""# HCC COMPLETE GIT HISTORY — every commit since day one

Generated {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')} · **{len(shas)} commits**

**This covers the era the transcripts cannot.** The project's first commit is
**2026-05-20** (the original Toro TimeMaster upload); the earliest session transcript on
this PC is 2026-07-14. Everything before that was cloud sessions whose conversations are
not recoverable — but the commit messages on this project are detailed paragraphs, so this
is a genuine record of what was built and why.

Full diffs are included for docs, config, scripts and firmware. Diffs for `index.html` are
omitted **by size only** — it is one 770 KB file changed hundreds of times; its complete
evolution is in git itself (`git log -p index.html`).

---
""")
    for i, sha in enumerate(shas, 1):
        meta = git("show", "-s", "--format=%ad%n%an%n%B", "--date=iso", sha).split("\n", 2)
        date = meta[0] if meta else "?"
        author = meta[1] if len(meta) > 1 else "?"
        body = meta[2].rstrip() if len(meta) > 2 else ""
        stat = git("show", "--stat", "--format=", sha).rstrip()
        f.write(f"\n\n## [{i}/{len(shas)}] `{sha[:8]}` — {date}\n**{author}**\n\n```\n{body}\n```\n")
        if stat:
            f.write(f"\n<details><summary>files changed</summary>\n\n```\n{stat}\n```\n</details>\n")
        diff = git("show", "--format=", "--", "docs/", "*.yaml", "*.yml", "*.json",
                   "scripts/", "windows-scripts/", "firmware/", "functions/",
                   "_headers", "CLAUDE.md", sha)
        if diff.strip():
            if len(diff) > 200000:
                diff = diff[:200000] + f"\n… [diff truncated at 200 KB of {len(diff)}]"
            f.write(f"\n<details><summary>diff (docs/config/code)</summary>\n\n```diff\n{diff}\n```\n</details>\n")
        if i % 100 == 0:
            print(f"  {i}/{len(shas)}")

print(f"wrote {path} ({os.path.getsize(path)/1048576:.1f} MB)")
