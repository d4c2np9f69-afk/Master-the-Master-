#!/usr/bin/env python3
"""Build the HCC MASTER RECORD â€” every word ever said on this project, verbatim.

Reads all Claude Code session transcripts on this PC and writes, to iCloud:
  HCC_MASTER_RECORD.md      every user + assistant message, verbatim, chronological
  HCC_ACTIONS_LOG.md        every tool action taken (command + outcome), chronological
  HCC_MASTER_INDEX.md       session list + keyword index so it is searchable fast
  HCC_DECISIONS_LEDGER.md   candidate decisions/rejections/prices pulled out for review

Re-runnable: safe to run any time, always rebuilds from source of truth.
"""
import json, os, re, glob, datetime, io, hashlib

SRC = r"C:\Users\jeffl\.claude\projects\C--Users-jeffl"
OUT = r"C:\Users\jeffl\iCloudDrive\HCC-Archive\MASTER-RECORD"
os.makedirs(OUT, exist_ok=True)

def flatten(content):
    """Return (text, tool_events) from a message content field."""
    text_parts, tools = [], []
    if isinstance(content, str):
        return content, tools
    if isinstance(content, list):
        for p in content:
            if not isinstance(p, dict):
                continue
            t = p.get("type")
            if t == "text":
                text_parts.append(p.get("text", ""))
            elif t == "thinking":
                pass  # internal reasoning, not "said"
            elif t == "tool_use":
                tools.append(("CALL", p.get("name", "?"), json.dumps(p.get("input", {}), ensure_ascii=False)))
            elif t == "tool_result":
                c = p.get("content")
                if isinstance(c, list):
                    c = " ".join(x.get("text", "") for x in c if isinstance(x, dict))
                tools.append(("RESULT", "", str(c)))
    return "\n".join(tp for tp in text_parts if tp), tools

records = []          # (timestamp, session, role, text)
actions  = []         # (timestamp, session, kind, name, payload)
session_meta = {}     # session -> dict

files = sorted(glob.glob(os.path.join(SRC, "*.jsonl")))
print(f"scanning {len(files)} transcripts ...")

for path in files:
    sid = os.path.basename(path).replace(".jsonl", "")
    size = os.path.getsize(path)
    if size == 0:
        continue
    first_ts = last_ts = None
    n_user = n_asst = 0
    with open(path, encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
            except Exception:
                continue
            ts = (rec.get("timestamp") or "")[:19]
            msg = rec.get("message") or {}
            role = msg.get("role") or rec.get("type") or ""
            if role not in ("user", "assistant"):
                continue
            text, tools = flatten(msg.get("content"))
            if ts:
                first_ts = first_ts or ts
                last_ts = ts
            if text and text.strip():
                # skip pure system-reminder noise injected into user turns
                stripped = text.strip()
                if not (stripped.startswith("<system-reminder>") and stripped.endswith("</system-reminder>")):
                    records.append((ts, sid, role, text))
                    if role == "user":
                        n_user += 1
                    else:
                        n_asst += 1
            for kind, name, payload in tools:
                actions.append((ts, sid, kind, name, payload))
    session_meta[sid] = {"file": os.path.basename(path), "mb": round(size / 1048576, 1),
                         "start": first_ts, "end": last_ts, "user_msgs": n_user, "asst_msgs": n_asst}

records.sort(key=lambda r: (r[0] or "", r[1]))
actions.sort(key=lambda r: (r[0] or "", r[1]))
print(f"  {len(records)} messages Â· {len(actions)} tool events")

STAMP = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

# ---------------------------------------------------------------- MASTER RECORD
def ct(ts):
    """UTC timestamp -> Central, which is what Jeff lives in."""
    if not ts:
        return "(no timestamp)"
    try:
        d = datetime.datetime.fromisoformat(ts)
        return (d - datetime.timedelta(hours=5)).strftime("%Y-%m-%d %I:%M:%S %p CT")
    except Exception:
        return ts

path = os.path.join(OUT, "HCC_MASTER_RECORD.md")
with io.open(path, "w", encoding="utf-8") as f:
    f.write(f"""# HCC MASTER RECORD â€” everything ever said on this project

Generated {STAMP} Â· {len(records)} messages from {len(session_meta)} sessions Â· **VERBATIM**

**Why this file exists.** Jeff, 2026-08-16, after a session re-proposed hardware he had killed
two days earlier: *"I can't keep doing this every time the session changes."* Decisions were being
made in conversation and never written to a file, so each new session read stale docs and confidently
told him the wrong thing. **This is the complete, unedited record so that can never be the excuse again.**

**It lives in iCloud, NOT in the repo and NOT in CLAUDE.md â€” it must never be auto-loaded.**
Search it, quote it, then act. Do not read it end to end.

**How to search it fast:**
```powershell
Select-String -Path "$env:USERPROFILE\\iCloudDrive\\HCC-Archive\\MASTER-RECORD\\HCC_MASTER_RECORD.md" `
  -Pattern "inovelli|dimmer" -Context 4,4
```

---

""")
    cur = None
    for ts, sid, role, text in records:
        if sid != cur:
            m = session_meta.get(sid, {})
            f.write(f"\n\n# â•â•â•â•â•â• SESSION {sid[:8]} â•â•â•â•â•â•\n")
            f.write(f"*{ct(m.get('start'))} â†’ {ct(m.get('end'))} Â· "
                    f"{m.get('user_msgs',0)} from Jeff, {m.get('asst_msgs',0)} replies*\n\n")
            cur = sid
        who = "ðŸ—£ï¸ **JEFF**" if role == "user" else "ðŸ¤– **CLAUDE**"
        f.write(f"\n### {who} â€” {ct(ts)}\n\n{text.rstrip()}\n")
print(f"  wrote {os.path.basename(path)} ({os.path.getsize(path)/1048576:.1f} MB)")

# ---------------------------------------------------------------- ACTIONS LOG
path = os.path.join(OUT, "HCC_ACTIONS_LOG.md")
with io.open(path, "w", encoding="utf-8") as f:
    f.write(f"# HCC ACTIONS LOG â€” every tool action taken\n\nGenerated {STAMP} Â· "
            f"{len(actions)} events. Companion to HCC_MASTER_RECORD.md (what was *said*).\n"
            f"Long outputs are truncated to 2000 chars; the transcripts in\n"
            f"`{SRC}` remain the ultimate source.\n\n---\n\n")
    cur = None
    for ts, sid, kind, name, payload in actions:
        if sid != cur:
            f.write(f"\n\n# â•â•â•â•â•â• SESSION {sid[:8]} â•â•â•â•â•â•\n\n")
            cur = sid
        if len(payload) > 2000:
            payload = payload[:2000] + f"\nâ€¦ [truncated, {len(payload)} chars total]"
        if kind == "CALL":
            f.write(f"\n**[{ct(ts)}] â†’ {name}**\n```\n{payload}\n```\n")
        else:
            f.write(f"<details><summary>result</summary>\n\n```\n{payload}\n```\n</details>\n")
print(f"  wrote {os.path.basename(path)} ({os.path.getsize(path)/1048576:.1f} MB)")

# ---------------------------------------------------------------- INDEX
TOPICS = {
    "lighting/dimmers": r"inovelli|kasa|hs220|hs200|dimmer|enbrighten|moes",
    "zigbee/mesh": r"zigbee|z2m|zigbee2mqtt|coordinator|dongle|router|mesh|thirdreality",
    "cameras/AI": r"blink|codeproject|camera|confidence|clipframe|annotated|popup",
    "water/leak/irrigation": r"leak|water meter|irrigation|b-hyve|bhyve|valve|anti-siphon|backflow|whud|sewer",
    "mower/sensor": r"mower|esp32|hours\.js|toro|hour meter|firmware",
    "guardian/alarm": r"guardian|panic|siren|smoke|alarm|intrusion",
    "network": r"router|bgw320|wifi|ssid|loewen301|network map|extender",
    "utilities/billing": r"gas|electric|smarthub|cemc|piedmont|bill|rate",
    "app/deploy": r"cloudflare|pages|index\.html|deploy|worker|kv ",
    "money/budget": r"\$\d|price|cost|budget|expensive|cheap|claude max",
}
path = os.path.join(OUT, "HCC_MASTER_INDEX.md")
with io.open(path, "w", encoding="utf-8") as f:
    f.write(f"# HCC MASTER INDEX\n\nGenerated {STAMP}. Use this to find *where* to look, "
            f"then grep `HCC_MASTER_RECORD.md`.\n\n## Sessions\n\n")
    f.write("| Session | Dates (CT) | Jeff | Claude | Size |\n|---|---|---|---|---|\n")
    for sid, m in sorted(session_meta.items(), key=lambda kv: kv[1].get("start") or ""):
        if not m.get("start"):
            continue
        f.write(f"| `{sid[:8]}` | {ct(m['start'])[:16]} â†’ {ct(m['end'])[:16]} | "
                f"{m['user_msgs']} | {m['asst_msgs']} | {m['mb']} MB |\n")
    f.write("\n## Topic â†’ dates discussed\n\n")
    for topic, pat in TOPICS.items():
        rx = re.compile(pat, re.I)
        days = sorted({ct(ts)[:10] for ts, sid, role, text in records if rx.search(text)})
        f.write(f"\n### {topic}\n{len(days)} days: " + ", ".join(days) + "\n")
print(f"  wrote {os.path.basename(path)}")


print("\nOUTPUT:", OUT)
for fn in sorted(os.listdir(OUT)):
    print(f"  {fn:<32} {os.path.getsize(os.path.join(OUT,fn))/1048576:8.2f} MB")

# ================= DECISIONS LEDGER (filtered) =================
#!/usr/bin/env python3
"""Rebuild the decisions ledger with the junk filtered out.

First pass caught session-continuation summaries and injected skill prompts, which
are not Jeff talking. Real decisions are short, first-person, and his own words.
"""
import json, os, re, glob, datetime, io

SRC = r"C:\Users\jeffl\.claude\projects\C--Users-jeffl"
OUT = r"C:\Users\jeffl\iCloudDrive\HCC-Archive\MASTER-RECORD"

NOISE = re.compile(
    r"^This session is being continued|^<system-reminder|^# |^You are helping|"
    r"^Caveat: The messages below|analysis tool|^<command-|^Your task is|"
    r"^Please continue the conversation|^\[Request interrupted", re.I)

DECIDE = re.compile(
    r"\b(i'?m not (?:going to |gonna )?(?:buy|pay|paying|spending)|not paying|won'?t (?:buy|pay)|"
    r"scrapped|scrap that|forget (?:the|that|about)|rejected|do not buy|don'?t buy|"
    r"we (?:are|is) not|no more|instead of|changed my mind|too expensive|"
    r"i (?:decided|want|need|would rather)|let'?s (?:go with|use|do)|"
    r"stick with|settled|that'?s the plan|use the .* instead)\b", re.I)

MONEY = re.compile(r"\$\s?\d")

def flatten(content):
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "\n".join(p.get("text", "") for p in content
                         if isinstance(p, dict) and p.get("type") == "text")
    return ""

def ct(ts):
    try:
        return (datetime.datetime.fromisoformat(ts) - datetime.timedelta(hours=5)
                ).strftime("%Y-%m-%d %I:%M %p CT")
    except Exception:
        return ts

rows = []
for path in sorted(glob.glob(os.path.join(SRC, "*.jsonl"))):
    if os.path.getsize(path) == 0:
        continue
    sid = os.path.basename(path)[:8]
    with open(path, encoding="utf-8", errors="replace") as f:
        for line in f:
            if '"role":"user"' not in line and '"role": "user"' not in line:
                continue
            try:
                rec = json.loads(line)
            except Exception:
                continue
            m = rec.get("message") or {}
            if m.get("role") != "user":
                continue
            t = flatten(m.get("content")).strip()
            if not t or NOISE.search(t):
                continue
            if len(t) > 1200:              # real decisions are short; long = pasted context
                continue
            if not DECIDE.search(t):
                continue
            rows.append(((rec.get("timestamp") or "")[:19], sid, re.sub(r"\s+", " ", t)))

rows.sort()
p = os.path.join(OUT, "HCC_DECISIONS_LEDGER.md")
with io.open(p, "w", encoding="utf-8") as f:
    f.write(f"""# HCC DECISIONS LEDGER â€” Jeff's own words

Rebuilt {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')} Â· **{len(rows)} entries**

Every line below is Jeff stating a decision, a rejection, a preference or a price limit.
Auto-extracted from the session transcripts, filtered to his short first-person messages
(continuation summaries and injected prompts removed). **Newest last.**

**Use this first** when about to recommend hardware or re-open a settled question.
Full context for any entry: search the timestamp in `HCC_MASTER_RECORD.md`.

---
""")
    for ts, sid, t in rows:
        flag = " ðŸ’²" if MONEY.search(t) else ""
        f.write(f"\n**[{ct(ts)}]**{flag} `{sid}`\n> {t}\n")

print(f"{len(rows)} decisions -> {p} ({os.path.getsize(p)/1024:.1f} KB)")
print("\nmost recent 6:\n")
for ts, sid, t in rows[-6:]:
    print(f"  [{ct(ts)}] {t[:150]}")

