#!/usr/bin/env python3
"""Export the live state of every platform this project runs on, into the iCloud record.

GitHub · Cloudflare · Home Assistant (Beehive) · loewenhome.com / toro1-5rz.pages.dev

Writes HCC_PLATFORM_STATE.md - a point-in-time snapshot so a future session can see how
the whole system is wired without re-discovering it. Re-run any time; it overwrites.

NO SECRETS ARE WRITTEN HERE. Credentials live only in C:\\Users\\jeffl\\HCC-secrets\\.
"""
import json, os, ssl, subprocess, urllib.request, urllib.error, datetime, io

REPO = r"C:\Users\jeffl\Documents\GitHub\master-the-master-"
OUT = r"C:\Users\jeffl\iCloudDrive\HCC-Archive\MASTER-RECORD"
HA = "https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa"
TOK = open(r"C:\Users\jeffl\HCC-secrets\ha_backup_token.txt").read().strip()
CTX = ssl.create_default_context()
UA = {"User-Agent": "HCC-Archive/1.0"}

def get(url, headers=None, timeout=60):
    req = urllib.request.Request(url, headers={**UA, **(headers or {})})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as r:
            return r.status, r.read().decode("utf-8", "replace"), dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace"), dict(e.headers)
    except Exception as e:
        return None, f"{type(e).__name__}: {e}", {}

def git(*a):
    return subprocess.run(["git", "-C", REPO, *a], capture_output=True,
                          encoding="utf-8", errors="replace").stdout.strip()

out = io.StringIO()
w = out.write
w(f"# HCC PLATFORM STATE — GitHub · Cloudflare · Home Assistant · the live site\n\n"
  f"Snapshot {datetime.datetime.now().strftime('%Y-%m-%d %I:%M %p CT')}. Re-run "
  f"`windows-scripts\\hcc_platform_state.py` to refresh.\n\n"
  f"**No secrets in this file.** Access details live in `C:\\Users\\jeffl\\HCC-secrets\\HCC_ACCESS.md`.\n\n---\n")

# ---------------------------------------------------------------- GITHUB
w("\n## GitHub\n\n")
API = "https://api.github.com/repos/d4c2np9f69-afk/master-the-master-"
s, b, _ = get(API, {"Accept": "application/vnd.github+json"})
if s == 200:
    j = json.loads(b)
    w(f"- **Repo:** `{j['full_name']}` · **{j['visibility']}** ⚠️ public — never commit secrets\n")
    w(f"- Default branch `{j['default_branch']}` · **deploy branch `claude/time-master-project-liq1jw`**\n")
    w(f"- Size {j['size']} KB · open issues {j['open_issues_count']} · last push {j['pushed_at']}\n")
s, b, _ = get(API + "/branches?per_page=100", {"Accept": "application/vnd.github+json"})
if s == 200:
    w(f"- Branches: " + ", ".join(f"`{x['name']}`" for x in json.loads(b)) + "\n")
w(f"\n**Local clone:** `{REPO}`\n\n```\n{git('log','--oneline','-10')}\n```\n")
w(f"\n- total commits: **{git('rev-list','--count','HEAD')}** · first commit "
  f"**{git('log','--reverse','--format=%ad','--date=short').splitlines()[0] if git('log','--reverse','--format=%ad','--date=short') else '?'}**\n")
w(f"\n**Mirror repo (stale, archived):** `d4c2np9f69-afk/Toro-Timemaster-` — do not develop there.\n")

# ---------------------------------------------------------------- CLOUDFLARE
w("\n## Cloudflare\n\n")
w("- **Pages project:** `toro1` → https://toro1-5rz.pages.dev (also **loewenhome.com**)\n")
w("- Deploys via Pages' native Git integration on push to the deploy branch (~60 s). "
  "GitHub Actions is NOT the deploy path.\n")
w("- **KV namespace `MOWER_KV`** = `ec5b28597d9c4fb9b182b1aea1d50eff` · binding name `MOWER_KV`; "
  "`getKV(env)` checks `env.HCC_KV || env.MOWER_KV` — keep the dual check.\n")
w("- Key `hours_data` holds the latest ESP32 payload; `auth_hash`/`auth_ha_token` hold the family login.\n")
w("- ⚠️ `_headers`: exact-path rules work, `/*` wildcards are silently ignored on this project.\n")
w("\n### Live endpoint check\n\n| Endpoint | Status | Notes |\n|---|---|---|\n")
for p in ("/", "/api/hours", "/api/weather", "/api/forecast", "/api/mowconditions",
          "/api/drought", "/api/alerts", "/api/climate", "/api/ha", "/api/irrigation", "/setup"):
    s, b, _ = get("https://toro1-5rz.pages.dev" + p, timeout=40)
    note = ""
    try:
        j = json.loads(b)
        if isinstance(j, dict):
            note = j.get("error") or j.get("source") or ""
    except Exception:
        note = f"{len(b)} bytes"
    w(f"| `{p}` | {s} | {str(note)[:70]} |\n")
s, b, h = get("https://loewenhome.com", timeout=40)
w(f"\n**loewenhome.com** → HTTP {s} · server `{h.get('Server','?')}`\n")

# ---------------------------------------------------------------- HOME ASSISTANT
w("\n## Home Assistant — Beehive\n\n")
s, b, _ = get(HA + "/api/config", {"Authorization": "Bearer " + TOK})
if s == 200:
    c = json.loads(b)
    w(f"- **{c['version']}** · state `{c['state']}` · tz `{c['time_zone']}` · "
      f"{len(c['components'])} components loaded\n")
    w(f"- Local `http://192.168.1.66:8123` (homeassistant.local) · remote Nabu Casa\n")
s, b, _ = get(HA + "/api/states", {"Authorization": "Bearer " + TOK}, timeout=120)
if s == 200:
    S = json.loads(b)
    from collections import Counter
    dom = Counter(x["entity_id"].split(".")[0] for x in S)
    w(f"- **{len(S)} entities**: " + ", ".join(f"{d} {n}" for d, n in dom.most_common(14)) + "\n")
    bad = [x for x in S if x["state"] in ("unavailable", "unknown")]
    w(f"- unavailable/unknown: {len(bad)}\n")
    w("\n### Automations\n\n| Automation | State | Last triggered |\n|---|---|---|\n")
    for x in sorted(S, key=lambda z: z["entity_id"]):
        if x["entity_id"].startswith("automation."):
            a = x["attributes"]
            w(f"| {a.get('friendly_name', x['entity_id'])} | {x['state']} | "
              f"{a.get('last_triggered') or 'never'} |\n")
    w("\n### Cameras\n\n")
    for x in sorted(S, key=lambda z: z["entity_id"]):
        if x["entity_id"].startswith("camera."):
            w(f"- `{x['entity_id']}` = {x['state']}\n")
    w("\n### Add-on updates\n\n| Add-on | Installed | Latest |\n|---|---|---|\n")
    for x in sorted(S, key=lambda z: z["entity_id"]):
        if x["entity_id"].startswith("update."):
            a = x["attributes"]
            w(f"| {a.get('friendly_name')} | {a.get('installed_version')} | {a.get('latest_version')} |\n")

path = os.path.join(OUT, "HCC_PLATFORM_STATE.md")
with io.open(path, "w", encoding="utf-8") as f:
    f.write(out.getvalue())
print(f"wrote {path} ({os.path.getsize(path)/1024:.1f} KB)")
