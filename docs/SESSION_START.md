# HCC — Session Start Briefing

**Read this in full at the start of every session, together with `CLAUDE.md`.** Jeff's rule,
2026-08-16. Between them they are the whole standing context; everything else is read on demand.

Mirror: `C:\Users\jeffl\iCloudDrive\HCC-Archive\SESSION_START.md`

---

## 0. 🔴 THE MASTER RECORD — search it BEFORE you answer

**Every word ever said on this project is archived and searchable. There is no longer any excuse
for "that was never documented."**

`C:\Users\jeffl\iCloudDrive\HCC-Archive\MASTER-RECORD\` — 6,896 messages verbatim, all 635 commits,
25,547 tool actions, 187 images, and **`HCC_DECISIONS_LEDGER.md`: 81 decisions in Jeff's own words.**
It is in iCloud deliberately — never auto-loaded, costs nothing per turn.

**MANDATORY: search it before replying, any time Jeff says "we discussed" / "I told you" /
"that was settled", or before recommending hardware or re-opening any question.**

```powershell
& "$env:USERPROFILE\Documents\GitHub\master-the-master-\windows-scripts\Search-HCC.ps1" "inovelli|dimmer"
```

**Read `MASTER-RECORD\README.md` for how to use it.** Access to every system (tokens, logins,
router, vendor clouds) is mapped in `C:\Users\jeffl\HCC-secrets\HCC_ACCESS.md` — never copy that
into the repo, it is public.

⚠️ **The trap that made this necessary:** searching for the *dead* plan and finding nothing does
not mean nothing is documented. Search for what the plan **is**, check file dates, newest wins.

## 1. First three things, every session

1. **Get the real date and time.** Never infer it from the conversation — it has been broken twice.
   `POST /api/template {"template":"{{ now().strftime('%A %Y-%m-%d %I:%M %p %Z') }}"}` against
   Beehive (authoritative, America/Chicago). Re-check before saying "today", "tonight", "still".
2. **`git pull`** in `~/Documents/GitHub/master-the-master-`.
3. **Read `CLAUDE.md`** — the relationship sections first. They are the point of the project.

## 2. Where things live (so you never load what you don't need)

| Need | File | Loaded? |
|---|---|---|
| Standing rules, relationship, current state | `CLAUDE.md` | auto, every session |
| This briefing | `docs/SESSION_START.md` | read at start |
| Why a past decision was made | `docs/CHANGELOG_ARCHIVE.md` (179 KB, 98 entries) | **grep on demand** |
| HA entity names, integration quirks | `docs/BEEHIVE_REFERENCE.md` | on demand |
| Meter serials, rates, sewer case | `docs/UTILITIES_REFERENCE.md` | on demand |
| Irrigation plumbing plan | `docs/utilities/backflow_layout.html` | on demand |
| Camera pipeline proof | `docs/beehive/camera_pipeline_VERIFIED_2026-08-15.md` | on demand |

All are mirrored to `iCloudDrive\HCC-Archive\`. **Grep the archive BEFORE re-investigating any
subsystem** — the answer is usually already in there, paid for in Jeff's time.

## 2b. 🔴 THE DOC INDEX — 52 files exist. Survey before you plan ANYTHING.

**This section exists because on 2026-08-16 a session planned the Zigbee buildout off ONE doc from
08-13 and re-asked four questions that later commits had already settled. Jeff, verbatim:
*"you did not read the archives on what was settled and planned."* Before planning any area, list
`docs/` sorted by date, and read every file touching it — newest first, because older docs go stale.**

| Area | Read these before touching it |
|---|---|
| **Zigbee / mesh** | `zigbee/zigbee_buildout_2026-08-13.md` (⚠️ superseded in parts), `lighting/zigbee_dimmer_selection_2026-08-13.md`, `beehive/zigbee-buy-now-checklist.md`, `inventory/HCC_INVENTORY.md` |
| **Guardian / alarm** | `beehive/safety_shopping_list.md` (**Jeff's philosophy lives here**), `beehive/panic_alarm_automation.md`, `beehive/alert_fatigue_fix_2026-08-14.md` |
| **Cameras / AI** | `beehive/camera_pipeline_VERIFIED_2026-08-15.md`, `beehive/alert_fatigue_fix_2026-08-14.md`, `beehive/camera-ai-setup.md`, `beehive/appletv_popup_SOLVED_2026-08-14.md` |
| **Lighting** | `lighting/HCC_Lighting_Plan.html`, `lighting/zigbee_dimmer_selection_2026-08-13.md`, `lighting/bedroom_wiring_plan_2026-08-06.md`, `lighting/HCC_Floorplan_DRAFT.html` |
| **Water / utilities** | `UTILITIES_REFERENCE.md`, `utilities/backflow_layout.html`, `utilities/sewer_overcharge_*`, `utilities/irrigation_gpm_calibration_2026-08-06.md` |
| **Mower** | `mower/CLOUD_SESSION_TASKS_2026-08-11.md`, `mower/gps_firmware_coworker_findings_2026-08-11.md` |
| **Network** | `inventory/NETWORK_MAP.md` |

**Two standing corrections a session must know before proposing Guardian work:**
- **Jeff wants *tons* of LIFE-SAFETY (smoke/CO/gas/leak/freeze) and LEAN intrusion** — key doors and
  a few motions only, NOT every window. Do not present door sensors as "the perimeter."
- **Alert fatigue is a security failure, not an annoyance.** Too many alerts → Jeff disarms Blink →
  every camera automation silently stops → no security at all, with no error anywhere. It already
  happened once (48 h dead, Aug 10–14). Any change that increases detections must be paired with a
  suppression story.

## 3. Hard-won invariants — violating these has cost real hours

- **Never declare done without verifying the far end.** Component checks said "healthy" through
  every real camera failure on 08-15; only looking at the output caught it.
- **A meter reading `unknown`/`unavailable` is NOT a fault.** The Itron ERT-SCM+ pit radio plus
  `rtlamr -unique=true` only republish when the value CHANGES — gaps of 20 min to 3 hours are
  normal, and it is worse after a restart. This caused a false WHUD alarm on 08-01. Watch longer.
  Both meters share one RTL-SDR, so a signal from either proves the whole chain.
- **Never default a `total_increasing` template sensor to 0** when its source is unknown — a
  `utility_meter` reads the 0→real jump as a month of usage. Use an `availability:` template.
- **`image_processing` is a legacy platform — it needs a FULL HA RESTART.** Reload does nothing.
- **`packages/hcc.yaml` automations are invisible to the config API**; `automations.yaml` ones are
  readable AND writable at `/api/config/automation/config/{id}`. Use that — it needs no browser.
- **Long-term statistics beat `history`.** Recorder keeps ~2 days; LTS keeps hourly for a year via
  `recorder/statistics_during_period` over the **WebSocket** API (NOT `history/...`).
- **Cloudflare Pages `_headers`:** exact-path rules work, `/*` is silently ignored. And a
  live-vs-local `index.html` byte gap is CRLF — compare `git show HEAD:index.html`.
- **Studio Code Server's editor works but is fiddly.** Verify every edit by zooming on the result;
  a selection one character too wide silently broke YAML on 08-16.

## 4. How to work (the two rules Jeff added on 08-16)

- **Don't tunnel.** Enumerate options before committing, including ones that make the current
  approach unnecessary. When Jeff pushes back, re-open the question instead of defending the road.
  Two real costs: an hour spent requesting file access when retrying a blocked keystroke worked
  first try; and going to `history` for leak data that was sitting in long-term statistics.
- **Don't hand Jeff a menu.** If an action is blocked, retry it, then find another route, then ask —
  in that order. He has said repeatedly he wants the work done, not the options explained.

## 5. Open items — check status, don't assume

- **Orbit anti-siphon valve** ordered 08-15, not yet installed. Daily 5 AM whole-house leak report
  runs until it is; **revert that automation to alert-only once the valve is in and proven.**
- **Backyard PIR still logs zero motion events** even overnight at 78 °F, while other cameras fire.
  Heat explains the daytime misses; it does not explain the cool hours. Not yet root-caused.
- **HA backup encryption key** still exists only on this PC — without it every iCloud backup is
  undecryptable. Jeff needs a durable copy somewhere independent.
- **Garage camera** reports no temperature or WiFi — likely unplugged, needs a physical look.
