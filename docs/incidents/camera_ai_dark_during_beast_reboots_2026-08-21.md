# The camera AI goes dark every time the beast reboots — and nothing says so

**Found 2026-08-21 12:10 PM Central, while closing out the BIOS flash.**
Status board said *"DAILY AUTOMATIONS NOT FIRING: HCC - Clip Archive (38h ago)"*.
Two separate problems were hiding behind that one line.

## Problem 1 — the alarm was mislabeled (a bad artifact, now fixed)

`HCC - Clip Archive` is **not a daily automation**. Its only trigger is
`event: codeproject_ai.object_detected`. `hcc_status_probe.py` was matching on the
*friendly name* containing "archive" and calling anything stale a missed daily job.

An event-driven automation that hasn't fired means *no events happened* — which may be
perfectly normal. Reporting that as a failed daily job is the kind of convenient-but-wrong
local note that has cost this project real hours before.

**Fixed in place:** the probe now reads each stale candidate's actual triggers via
`/api/config/automation/config/<id>` and only calls it a missed daily job if it genuinely
has a `time` / `time_pattern` / `sun` / `calendar` trigger. Event-driven ones print under
*"event-driven, no events (not necessarily a fault)"*. If the config can't be read it still
reports — never hide a real failure to look tidy.

## Problem 2 — the real one: CodeProject.AI lives on the beast

**`CodeProject.AI` runs as a Windows service on THIS PC (301Server, 192.168.1.194).**
Home Assistant is on separate hardware and stays up. So:

> **Every time the beast crashes, reboots, or gets worked on, the entire house's camera AI
> detection goes dark — and nothing anywhere announces it.**

That is exactly what the 38-hour gap was. The window 08-19 22:00 → 08-21 12:05 Central
covers the four crashes, the UPS install, and this morning's BIOS flash. Last detection
before the gap: `2026-08-20T02:59Z`. The AI service came back up at **12:04:59 PM** today
with the post-flash boot.

**Proof it was down, not broken:** the `Instant AI Frame on Motion` automation ran at
16:26 UTC (11:26 AM local) with **all four steps executed and no error** — snapshot fired,
scan fired — yet the scanner entity stayed `unknown`. That run happened during the reboot,
**38 minutes before the AI server process started.** The scan had nothing to talk to.

## The pipeline itself is healthy — verified, not assumed (2026-08-21 12:17-12:19 PM)

Server: **v2.9.5**, reachable on both `127.0.0.1:32168` and `192.168.1.194:32168`.
Running modules: `ObjectDetectionYOLOv5-6.2` v1.10.0, `FaceProcessing` v1.12.3.

Reproduced the automation's exact sequence (`camera.snapshot` → 400 ms → `image_processing.scan`)
— **it works; there is no race.** All six cameras then scanned clean:

| Camera | Result |
|---|---|
| 301_driveway | 2 cars + truck, up to **89.9%** |
| front_right | **person 27.9%** |
| back_left | 2 targets |
| 301_backyard | scans fine (cars/chairs, no person/animal present) |
| garage | scans fine |
| 301_front_doorbell | scans fine, empty frame |

Downstream fired correctly off a real detection — `hcc_clip_archive`,
`ai_object_detected_notify`, and `hcc_ai_camera_popup_on_fire_tv` all triggered within the
same second. **Nothing in the camera stack needs repair.**

## What is still genuinely open

**No alarm exists for "the AI server is down."** The existing `HCC - Clip Pipeline Watchdog`
does not cover this case well: it only evaluates *after* a motion event, waits 2 minutes,
and then rate-limits itself to **one notification per 6 hours**. A multi-day outage can
therefore produce a single easily-missed push — or none, if no motion happened to land in
the right window.

**Interim mitigation shipped today:** `Show-HCCNext.ps1` now prints
`CodeProject.AI: UP on this PC` (or a loud DOWN line) on every run, so any session sees it
immediately. That covers *me*, not Jeff.

**Worth building next, Jeff's call:** a real HA-side heartbeat — if no
`codeproject_ai.object_detected` event has occurred in N hours *while motion is still being
seen*, notify. That distinguishes "quiet house" from "AI is dead", which is the distinction
the current watchdog cannot make.

⚠️ **This matters for the standing back-yard safety gap.** The tuned backyard thresholds
(confidence 25, person+animal) are worthless while the AI host is powered off. Any future
"is the backyard covered?" answer must check that the beast is up first.
