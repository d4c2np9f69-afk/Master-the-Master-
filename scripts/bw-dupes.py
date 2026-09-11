"""BITWARDEN DUPLICATE REPORT — READ ONLY. Writes nothing to the vault.

OPEN_ITEMS #3 / #118. Jeff, 2026-09-03: "it comes up on some things but not all and
I don't know if it's changing passwords on me". #118's finding: nothing is changing
his passwords - the vault holds 584 items from TWO imports (310 Edge / 279 iPhone),
and where a site came in twice with DIFFERENT passwords, Bitwarden offers a choice at
login and the stale one fails.

This enumerates that, so the NEWER copy is kept ON EVIDENCE instead of by guessing.

🔴 IT NEVER SEES THE MASTER PASSWORD. Jeff runs, in his OWN shell:
      bw login          (once)
      bw unlock         -> prints a BW_SESSION key
   then hands over ONLY that session key, which is temporary and revocable with
   `bw lock`. That is the whole point of this route - see #118.

   set BW_SESSION=<key>          (cmd)      or   $env:BW_SESSION="<key>"   (PowerShell)
   python bw-dupes.py

🔴 NO PASSWORD VALUE IS EVER PRINTED. Passwords are compared by SHA-256 prefix only,
   so the report can be read aloud or pasted safely.
"""
import subprocess, json, os, sys, hashlib, collections

def die(m):
    print(m); sys.exit(1)

sess = os.environ.get("BW_SESSION")
if not sess:
    die("BW_SESSION is not set.\n"
        "  Jeff runs `bw unlock` himself and passes the printed session key.\n"
        "  Nothing here needs, wants, or accepts the master password.")

BW = "bw.cmd" if os.name == "nt" else "bw"
try:
    raw = subprocess.run([BW, "list", "items", "--session", sess],
                         capture_output=True, text=True, timeout=180)
except FileNotFoundError:
    die("bw CLI not found on PATH. Install: npm install -g @bitwarden/cli")
if raw.returncode != 0:
    die("bw failed (%d): %s" % (raw.returncode, (raw.stderr or "").strip()[:300]))

items = json.loads(raw.stdout)
logins = [i for i in items if i.get("type") == 1 and i.get("login")]
print("vault items: %d   logins: %d\n" % (len(items), len(logins)))

def host(u):
    if not u: return ""
    u = u.split("//")[-1].split("/")[0].lower()
    return u[4:] if u.startswith("www.") else u

def key(i):
    lg = i.get("login") or {}
    uris = lg.get("uris") or []
    h = host(uris[0].get("uri")) if uris else ""
    return (h or (i.get("name") or "").strip().lower(), (lg.get("username") or "").strip().lower())

def ph(i):
    p = (i.get("login") or {}).get("password") or ""
    return hashlib.sha256(p.encode()).hexdigest()[:10] if p else "(none)"

groups = collections.defaultdict(list)
for i in logins:
    groups[key(i)].append(i)
dupes = {k: v for k, v in groups.items() if len(v) > 1}

same_pw, diff_pw = [], []
for k, v in dupes.items():
    (diff_pw if len({ph(x) for x in v}) > 1 else same_pw).append((k, v))

print("=" * 82)
print("DUPLICATE GROUPS: %d   (%d differ by password, %d are exact duplicates)"
      % (len(dupes), len(diff_pw), len(same_pw)))
print("=" * 82)

print("\n### 🔴 THESE ARE THE ONES CAUSING THE 'IS IT CHANGING MY PASSWORD' SYMPTOM")
print("### Same site + same username, DIFFERENT passwords. Keep the NEWEST; delete the rest.\n")
for k, v in sorted(diff_pw, key=lambda x: -len(x[1])):
    v.sort(key=lambda i: i.get("revisionDate") or "", reverse=True)
    print("  %s   (user: %s)   %d copies" % (k[0] or "(no uri)", k[1] or "(no username)", len(v)))
    for n, i in enumerate(v):
        print("      %s revised %s   pw#%s   id %s"
              % ("KEEP  " if n == 0 else "delete", (i.get("revisionDate") or "?")[:10], ph(i), i.get("id")))
    print()

print("\n### Exact duplicates (identical password) — safe to delete all but one\n")
for k, v in sorted(same_pw, key=lambda x: -len(x[1]))[:40]:
    print("  %-42s user %-28s x%d" % ((k[0] or "(no uri)")[:42], (k[1] or "-")[:28], len(v)))

print("\n" + "-" * 82)
print("READ-ONLY. Nothing was modified. Deleting is a separate, deliberate step:")
print("  bw delete item <id> --session $BW_SESSION")
print("Lock the vault when finished:  bw lock")
