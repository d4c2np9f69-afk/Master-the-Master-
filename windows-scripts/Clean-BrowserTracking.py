"""
Selective browser tracking purge for Jeff's PC.

Deletes every cookie EXCEPT those belonging to sites he has bookmarked, so trackers lose
their grip but he stays logged into Amazon / Walmart / Kroger / eBay / PayPal etc.

The keep-list is derived from the browser's own Bookmarks file, which makes the rule
self-maintaining and easy to remember:

    BOOKMARK A SITE  ->  YOU STAY LOGGED INTO IT.
    NOT BOOKMARKED   ->  ITS COOKIES GET WIPED.

Saved passwords ("Login Data") are NEVER touched by this script. Even when a cookie is
removed, the password is still saved - the site just asks you to sign in again and the
browser fills it for you.

Called by Clean-Beast.ps1. Requires the browsers to be closed (their databases are locked
while running). Built 2026-08-19.
"""

import json
import os
import shutil
import sqlite3
import sys
from datetime import datetime
from urllib.parse import urlparse

# Profiles to clean: (label, profile directory)
PROFILES = [
    ("Brave",  os.path.expandvars(r"%LOCALAPPDATA%\BraveSoftware\Brave-Browser\User Data\Default")),
    ("Chrome", os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\User Data\Default")),
    ("Edge",   os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Edge\User Data\Default")),
]

# Suffixes that need three labels to identify the real site (amazon.co.uk, not just co.uk).
TWO_PART_SUFFIXES = {
    "co.uk", "com.au", "co.nz", "co.jp", "com.br", "co.za", "com.mx",
    "co.in", "com.sg", "org.uk", "net.au", "ac.uk", "gov.uk",
}


def registrable(host: str) -> str:
    """Reduce a hostname to the domain a human would call 'the site'."""
    host = host.lstrip(".").lower().strip()
    if not host or host.replace(".", "").isdigit():
        return host  # bare IP address (e.g. the router) - keep as-is
    parts = host.split(".")
    if len(parts) <= 2:
        return host
    if ".".join(parts[-2:]) in TWO_PART_SUFFIXES:
        return ".".join(parts[-3:])
    return ".".join(parts[-2:])


def bookmark_domains(profile_dir: str) -> set:
    """Every domain the user has bookmarked in this profile."""
    path = os.path.join(profile_dir, "Bookmarks")
    if not os.path.exists(path):
        return set()
    with open(path, "r", encoding="utf-8") as fh:
        data = json.load(fh)

    found = set()

    def walk(node):
        if not isinstance(node, dict):
            return
        if node.get("type") == "url":
            host = urlparse(node.get("url", "")).hostname
            if host:
                found.add(registrable(host))
        for child in node.get("children", []) or []:
            walk(child)

    for root in (data.get("roots") or {}).values():
        walk(root)
    return found


def purge(label: str, profile_dir: str, keep: set, dry_run: bool):
    db = os.path.join(profile_dir, "Network", "Cookies")
    if not os.path.exists(db):
        print(f"  {label:<7} no cookie database yet - skipped")
        return 0, 0

    # A DRY RUN must never disturb a live browser, so it reads a throwaway copy.
    # A REAL purge must never race a live browser, so it refuses while one is open.
    if dry_run:
        import tempfile
        work = os.path.join(tempfile.gettempdir(), f"{label}-cookies-preview.db")
        try:
            shutil.copy2(db, work)
        except (PermissionError, OSError):
            print(f"  {label:<7} is OPEN - close {label} to preview or clean it.")
            return 0, 0
    else:
        work = db
        stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        backup_dir = os.path.expandvars(r"%USERPROFILE%\Scripts\cookie-backups")
        os.makedirs(backup_dir, exist_ok=True)
        try:
            shutil.copy2(db, os.path.join(backup_dir, f"{label}-Cookies-{stamp}.db"))
        except (PermissionError, OSError):
            print(f"  {label:<7} STILL RUNNING - close {label} and run again. Nothing changed.")
            return 0, 0

    try:
        con = sqlite3.connect(work)
        cur = con.cursor()
        cur.execute("SELECT rowid, host_key FROM cookies")
        rows = cur.fetchall()
    except sqlite3.OperationalError as exc:
        print(f"  {label:<7} could not read ({exc}) - close {label} and run again.")
        try:
            con.close()
        except Exception:
            pass
        return 0, 0

    doomed = [rid for rid, host in rows if registrable(host) not in keep]

    if dry_run:
        print(f"  {label:<7} would delete {len(doomed)} of {len(rows)} cookies "
              f"(keeping {len(rows) - len(doomed)} for bookmarked sites)")
        con.close()
        try:
            os.remove(work)
        except OSError:
            pass
        return len(doomed), len(rows)

    cur.executemany("DELETE FROM cookies WHERE rowid = ?", [(r,) for r in doomed])
    con.commit()
    try:
        con.execute("VACUUM")
    except sqlite3.OperationalError:
        pass
    con.close()
    print(f"  {label:<7} deleted {len(doomed)} tracking cookies, "
          f"kept {len(rows) - len(doomed)} for your bookmarked sites")
    return len(doomed), len(rows)


def main():
    dry_run = "--dry-run" in sys.argv
    print("  " + ("DRY RUN - nothing will be deleted" if dry_run else "Purging tracking cookies"))

    # Build one shared keep-list from every browser's bookmarks, so a site bookmarked
    # in Brave also stays logged in elsewhere.
    keep = set()
    for label, prof in PROFILES:
        found = bookmark_domains(prof)
        if found:
            print(f"  {label:<7} contributed {len(found)} bookmarked domains")
        keep |= found

    if not keep:
        print("  No bookmarks found in any browser - ABORTING rather than wipe everything.")
        return 1

    print(f"  Protecting {len(keep)} bookmarked domains from the purge.")
    total_del = total_all = 0
    for label, prof in PROFILES:
        if not os.path.isdir(prof):
            continue
        d, a = purge(label, prof, keep, dry_run)
        total_del += d
        total_all += a

    if total_all:
        verb = "would remove" if dry_run else "removed"
        print(f"  TOTAL: {verb} {total_del} of {total_all} cookies "
              f"({total_all - total_del} kept so you stay signed in).")
    if not dry_run:
        print("  Saved passwords were not touched.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
