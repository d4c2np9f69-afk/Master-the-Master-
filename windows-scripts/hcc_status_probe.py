#!/usr/bin/env python3
"""Live Beehive health for Show-HCCNext.ps1. Deliberately terse - a few lines only."""
import json, ssl, urllib.request, datetime

HA = "https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa"
CTX = ssl.create_default_context()
try:
    tok = open(r"C:\Users\jeffl\HCC-secrets\ha_backup_token.txt").read().strip()
except Exception:
    print("  (no HA token)"); raise SystemExit

def ha(p, t=45):
    r = urllib.request.Request(HA + p, headers={"Authorization": "Bearer " + tok})
    with urllib.request.urlopen(r, timeout=t, context=CTX) as x:
        return json.loads(x.read().decode())

try:
    cfg = ha("/api/config")
    S = ha("/api/states", 90)
except Exception as e:
    print(f"  UNREACHABLE: {type(e).__name__}"); raise SystemExit

ups = [s for s in S if s["entity_id"].startswith("update.") and s["state"] == "on"]
cams = [s for s in S if s["entity_id"].startswith("camera.")]
dead_cams = [s for s in cams if s["state"] in ("unavailable", "unknown")]
autos = [s for s in S if s["entity_id"].startswith("automation.")]
off = [a for a in autos if a["state"] != "on"]
bad = [s for s in S if s["state"] in ("unavailable", "unknown")]

print(f"  HA {cfg['version']} {cfg['state']} | {len(S)} entities | "
      f"{len(cams)} cameras ({len(dead_cams)} dead) | {len(autos)} automations ({len(off)} off)")
print(f"  updates pending: {len(ups)}" + (" -> " + ", ".join(
    u["attributes"].get("friendly_name", "?") for u in ups[:3]) if ups else ""))
print(f"  unavailable/unknown entities: {len(bad)}")

# the things that actually matter day to day
watch = {
    "sensor.water_gallons": "water",
    "sensor.gas_ccf": "gas",
    "binary_sensor.301_backyard_motion": "backyard PIR",
    "alarm_control_panel.blink_loewen301": "blink",
}
by = {s["entity_id"]: s for s in S}
bits = []
for e, label in watch.items():
    v = by.get(e)
    bits.append(f"{label}={v['state'] if v else 'MISSING'}")
print("  " + " | ".join(bits))

# anything that should fire daily but hasn't in 36h.
# NOTE 2026-08-21: name-matching alone is WRONG - it flagged "HCC - Clip Archive"
# (event-driven on codeproject_ai.object_detected) as a missed DAILY job for hours.
# A stale candidate is only reported as "daily" if it really has a time trigger.
now = datetime.datetime.now(datetime.timezone.utc)
def is_scheduled(auto_id):
    """True only if the automation actually has a time/sun trigger."""
    try:
        cfg = ha("/api/config/automation/config/" + auto_id, 20)
    except Exception:
        return True  # can't tell - report it rather than hide it
    trigs = cfg.get("triggers") or cfg.get("trigger") or []
    if isinstance(trigs, dict):
        trigs = [trigs]
    sched = ("time", "time_pattern", "sun", "calendar")
    return any((t.get("trigger") or t.get("platform")) in sched for t in trigs if isinstance(t, dict))

stale, quiet = [], []
for a in autos:
    lt = a["attributes"].get("last_triggered")
    fn = a["attributes"].get("friendly_name", "")
    aid = a["attributes"].get("id")
    if not any(k in fn.lower() for k in ("digest", "overnight", "archive", "daily")):
        continue
    if not lt:
        (stale if (aid and is_scheduled(aid)) else quiet).append(fn + " (NEVER)")
        continue
    age = (now - datetime.datetime.fromisoformat(lt.replace("Z", "+00:00"))).total_seconds() / 3600
    if age > 36:
        (stale if (aid and is_scheduled(aid)) else quiet).append(f"{fn} ({age:.0f}h ago)")
if stale:
    print("  DAILY AUTOMATIONS NOT FIRING: " + "; ".join(stale[:4]))
if quiet:
    print("  event-driven, no events (not necessarily a fault): " + "; ".join(quiet[:4]))

# CodeProject.AI runs on THIS PC (301Server/.194). Every beast reboot or crash takes
# the whole house's camera AI down silently - that is exactly what the 38h detection
# gap on 2026-08-21 turned out to be. Cheap local check, so always do it.
try:
    import urllib.request as _u
    with _u.urlopen("http://127.0.0.1:32168/v1/status/ping", timeout=5) as _r:
        if json.loads(_r.read().decode()).get("success"):
            print("  CodeProject.AI: UP on this PC")
        else:
            print("  *** CodeProject.AI answered but not OK - camera AI is DOWN ***")
except Exception:
    print("  *** CodeProject.AI DOWN on this PC - no camera detections will fire ***")
