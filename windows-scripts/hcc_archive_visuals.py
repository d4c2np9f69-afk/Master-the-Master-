#!/usr/bin/env python3
"""Archive every picture and diagram on the HCC project into the iCloud master record.

Jeff, 2026-08-16: "all the pictures all diagrams... it doesn't matter how big the file
is in iCloud."

Collects into MASTER-RECORD/VISUALS/:
  repo-images/   every jpg/png/pdf/svg in the repo (heroes, zone photos, icons, plans)
  repo-diagrams/ the HTML diagram documents (backflow layout, lighting plan, floorplan)
  photos/        iCloud HCC-Photos (camera verification shots, meter photos, hardware)
  historical/    every image version ever committed, recovered from git history

Writes VISUALS_INDEX.md listing everything with its source and date.
Deliberately EXCLUDES HCC-secrets and the 2 GB Beehive backup tarballs.
"""
import os, shutil, subprocess, datetime, hashlib, io

REPO = r"C:\Users\jeffl\Documents\GitHub\master-the-master-"
ICLOUD = r"C:\Users\jeffl\iCloudDrive"
OUT = os.path.join(ICLOUD, "HCC-Archive", "MASTER-RECORD", "VISUALS")
EXT = (".jpg", ".jpeg", ".png", ".pdf", ".svg", ".webp", ".gif", ".bmp", ".heic")

for sub in ("repo-images", "repo-diagrams", "photos", "historical"):
    os.makedirs(os.path.join(OUT, sub), exist_ok=True)

manifest = []

def copy_in(src, dest_dir, label):
    base = os.path.basename(src)
    dst = os.path.join(OUT, dest_dir, base)
    n = 1
    while os.path.exists(dst) and os.path.getsize(dst) != os.path.getsize(src):
        stem, ext = os.path.splitext(base)
        dst = os.path.join(OUT, dest_dir, f"{stem}__{n}{ext}")
        n += 1
    if not os.path.exists(dst):
        shutil.copy2(src, dst)
    manifest.append((label, os.path.relpath(dst, OUT), round(os.path.getsize(src) / 1024),
                     datetime.datetime.fromtimestamp(os.path.getmtime(src)).strftime("%Y-%m-%d")))

# ---- current repo images + PDFs
for root, dirs, files in os.walk(REPO):
    dirs[:] = [d for d in dirs if d not in (".git", "node_modules")]
    for fn in files:
        if fn.lower().endswith(EXT):
            copy_in(os.path.join(root, fn), "repo-images", "repo")

# ---- HTML diagram documents
for root, dirs, files in os.walk(os.path.join(REPO, "docs")):
    for fn in files:
        if fn.lower().endswith(".html"):
            copy_in(os.path.join(root, fn), "repo-diagrams", "diagram")

# ---- iCloud photos
photos = os.path.join(ICLOUD, "HCC-Photos")
if os.path.isdir(photos):
    for root, dirs, files in os.walk(photos):
        for fn in files:
            if fn.lower().endswith(EXT):
                copy_in(os.path.join(root, fn), "photos", "photo")

# ---- historical: every image blob ever committed, even if later deleted/replaced
print("recovering historical image versions from git ...")
seen = set()
log = subprocess.run(["git", "-C", REPO, "log", "--all", "--format=%H|%ad", "--date=short"],
                     capture_output=True, encoding="utf-8", errors="replace").stdout.split("\n")
for line in log:
    if "|" not in line:
        continue
    sha, date = line.split("|", 1)
    tree = subprocess.run(["git", "-C", REPO, "ls-tree", "-r", "--name-only", sha],
                          capture_output=True, encoding="utf-8", errors="replace").stdout.split("\n")
    for p in tree:
        if not p.lower().endswith(EXT):
            continue
        blob = subprocess.run(["git", "-C", REPO, "rev-parse", f"{sha}:{p}"],
                              capture_output=True, encoding="utf-8", errors="replace").stdout.strip()
        if not blob or blob in seen:
            continue
        seen.add(blob)
        data = subprocess.run(["git", "-C", REPO, "cat-file", "-p", blob],
                              capture_output=True).stdout
        stem, ext = os.path.splitext(os.path.basename(p))
        dst = os.path.join(OUT, "historical", f"{date}_{stem}_{blob[:7]}{ext}")
        if not os.path.exists(dst):
            with open(dst, "wb") as fh:
                fh.write(data)
            manifest.append(("historical", os.path.relpath(dst, OUT),
                             round(len(data) / 1024), date))

# ---- index
manifest.sort(key=lambda r: (r[0], r[3]))
with io.open(os.path.join(OUT, "VISUALS_INDEX.md"), "w", encoding="utf-8") as f:
    f.write(f"# HCC VISUALS — every picture and diagram\n\n"
            f"Generated {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')} · "
            f"**{len(manifest)} files**\n\n"
            f"`repo-images` current · `repo-diagrams` HTML plans · `photos` iCloud camera/meter/"
            f"hardware shots · `historical` every image version ever committed, including ones "
            f"later deleted or replaced (recovered from git objects).\n\n"
            f"Excluded on purpose: `HCC-secrets` (credentials) and the 2 GB Beehive backup "
            f"tarballs.\n\n| Source | File | KB | Date |\n|---|---|---|---|\n")
    for label, rel, kb, date in manifest:
        f.write(f"| {label} | `{rel}` | {kb} | {date} |\n")

total = sum(r[2] for r in manifest)
print(f"{len(manifest)} files, {total/1024:.1f} MB -> {OUT}")
