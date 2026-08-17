# CLOUD SESSION HISTORY — the HCC / Toro TimeMaster project

**Compiled 2026-08-16 by a Claude Code cloud session, in answer to `REQUEST_TO_CLOUD_SESSION.md`.**

Save to: `C:\Users\jeffl\iCloudDrive\HCC-Archive\MASTER-RECORD\CLOUD_SESSION_HISTORY.md`

---

## Read this first: what this document is, and what it is not

The request that produced this file was addressed to "the cloud session that worked on this
project," and asked it to write out **everything it still holds** about the first eight weeks —
on the premise that those weeks live in a cloud session's memory even though the transcripts
aren't on Jeff's PC.

**That premise is wrong, and saying so plainly is the most useful thing in this document.**

I am a fresh session. I have no memory of any earlier conversation on this project. No Claude
session does. When a session ends, its memory of the conversation ends with it — the next session
starts blank and knows only what it can read from files. There is no archive of past cloud
conversations that a new session can open, no vault it can be asked to unlock. **No cloud session
now or in the future can answer "tell me what you remember from May."** Any session that appears
to answer it is reconstructing from documents, or making it up.

That matters beyond this one file. It means:

- **Asking a future session to "remember" is a request that cannot be fulfilled.** Waiting on it
  costs time and gets nothing back.
- **A session that wants to be helpful will fill the silence with plausible invention.** That is
  precisely the failure that has cost this project money — a confident guess presented as
  history. The request itself named it: *"A confident guess presented as fact is how this project
  got here."*
- **The written record is not a backup of the memory. It is the memory.** There is no other copy.

So I did not write down what I remember. I went to the artifacts and rebuilt the history from
them, and I have marked, throughout, which is which.

## The good news, which is bigger than the bad news

**The eight weeks are not lost.** The premise of the request — that the cloud era exists nowhere
on disk — turned out to be false in the way that matters.

The `Master-the-Master-` repo's default branch shows one commit, which is why it looks like
there's no history. But on the branch `claude/time-master-project-liq1jw` there are **636
commits running from 2026-05-20 to today**, and they are not one-line commits. They are long,
detailed, root-cause-explaining commit messages written at the time by the sessions doing the
work. Alongside them: **274 revisions of CLAUDE.md** — including Jeff's verbatim words, some of
which were later edited out and survive only in old revisions — and **50+ documents** under
`docs/`.

That is the eight weeks, in the form that survived. It is not a transcript. But for the things
this project keeps losing — what was decided, what was rejected, what a price was, what the real
root cause turned out to be — it is often better than a transcript, because it was written down
deliberately by someone who had just finished the work.

**What is genuinely gone** is the literal conversation: the wording of what Jeff asked, the
back-and-forth, the moments where he pushed back and a session argued. Those exist, if anywhere,
in Jeff's own claude.ai account (chat history, or Settings → export data) and in the local
coworker's 37-transcript archive on his PC — not in any repo, and not in any session's head.

## How this document was built

Every claim below traces to a file or a commit hash in the repository. The work was done by a
team of archivist agents, each assigned a slice of the record — a date range, the CLAUDE.md
revision history, a document folder — and each instructed to quote verbatim, cite hashes, and
mark inference explicitly.

**Provenance markers used throughout:**

- Unmarked statements with a hash or file path are **evidenced** — taken from the record.
- **INFERRED:** marks reasoning that goes beyond what is written down. Weigh it accordingly.
- Where the record is silent, sections say so rather than filling the gap.
- Where a claim comes from Jeff's own request file rather than from git, it is attributed there —
  Jeff's testimony is evidence, but it is a different kind of evidence than a commit.

Nothing here is a recollection. There are no token counts from past sessions, because those are
not recoverable and inventing them would defeat the purpose of the exercise.

## What Jeff asked to be included, and where it is

| His request | Section |
|---|---|
| Everything from day one / "the day we met" | §1 — the original app, read line by line |
| The lost eight weeks | §1–2 — reconstructed from the code that appeared on 06-21 |
| Every major architectural choice and why | §2–8, and the ledger in §17 |
| Every decision, rejection, price limit — in his words | §12 (quotes), §17 (ledger) |
| Every problem that took more than one attempt | §18 (incident ledger), and each chronicle |
| "All our arguments as well" / the good, bad, ugly | §16 |
| Times research/forums solved what guessing burned time on | §20 |
| Times the .md rules weren't followed and it went sideways | §21 |
| Time and money the errors cost | §22 |
| What future sessions get wrong repeatedly | §19 |
| Where the history actually lives | §15 |

---

## ⚠️ Status of this compilation

**This is a complete and usable record, but not yet the final one.** Compilation was interrupted
twice by usage limits. Present and complete: sections 1–15 and 20–22 — roughly 1 MB of material,
covering the entire project timeline day by day from 2026-05-19 to 2026-08-16, plus the memory
file's full history, the document compendiums, the repo map, and the three sections Jeff added
mid-run.

**Still to be compiled** (the mining agents were interrupted; the source material for all of them
is in the repo and the method is recorded in `history-archive/SESSION_CHECKPOINT.md`):

- **§16 — The Good, the Bad, and the Ugly:** the arguments and corrections, hunted across every
  commit message. *Much of this material already appears inside the chronicles and in §21.*
- **§17 — Master decisions ledger:** every decision, rejection, and price in one table.
- **§18 — Incident ledger:** every multi-attempt problem in one table. *Each incident is already
  told in full in its chronicle; this would be the cross-cutting index.*
- **§19 — Gaps and guidance:** what the record cannot answer, and what future sessions get wrong.

Those four are consolidations and indexes of material that is, in substance, already below. When
they are compiled they will be added and this file replaced in place.

---


---

## The Beginning — the original Toro TimeMaster app and the lost eight weeks (2026-05-19 → 2026-06-21)

This section reconstructs the origin era of the project: the first surviving app (a zip Jeff uploaded to GitHub on 2026-05-20, whose files are timestamped 2026-05-19 22:30), the month-long hole in the record between that upload and the first real code commits, and the four commits on the evening of 2026-06-21 that turned "a mower maintenance app" into the Home Command Center. Everything below is cited to a commit hash, a file path, or the contents of the code itself. Anything that is reasoning rather than evidence is prefixed **INFERRED:**.

**Primary sources for this section:**

- `Toro_TimeMaster_PWA_Package.zip` (20,663 bytes), committed to the repo's `main` branch in commit `09f02d4` (2026-05-20 08:35:18 -0500, message "Add files via upload", author `d4c2np9f69-afk <d4c2np9f69@privaterelay.appleid.com>`, committer `GitHub <noreply@github.com>` — i.e., Jeff's own GitHub account uploading through the GitHub web UI). The unzipped contents: `index.html` (43,292 bytes), `manifest.json` (401 bytes), `service-worker.js` (423 bytes), `icons/icon-192.png` (2,551 bytes), `icons/icon-512.png` (7,443 bytes) — all file-timestamped **2026-05-19 22:30**.
- Commit `0e7e18d` (2026-06-21 17:14:43 UTC) — "Extract Toro TimeMaster PWA package source files". Verified byte-identical to the zip contents.
- Commit `0b76d4c` (2026-06-21 20:31:18 UTC) — "Add full live app source — B-Hyve, weather, GPS, ESP32 integrations" (+2,285 / −525 lines on `index.html`).
- Commit `eb342db` (2026-06-21 20:39:33 UTC) — "Transform Toro app into Home Command Center (HCC)".
- Commit `6649269` (2026-06-21 20:47:38 UTC) — "Embed HCC hero image in app header".
- The first two versions of `CLAUDE.md` (commits `e8f0312` 2026-06-23 and `90e556e` 2026-06-24), used here only where they record facts about this era.

---

### 1. Day one: the original Toro TimeMaster 21200 PWA (files dated 2026-05-19)

The zip is the earliest surviving artifact of the entire project. It is a complete, working, single-file Progressive Web App — no build system, no backend, no network calls at all except outbound shopping/YouTube links. Everything about Jeff's mower that the project would later grow around is already baked into this file as hardcoded data.

**Provenance note:** the zip landed on the repo's `main` branch, and `main` never received anything else. The CLAUDE.md written a month later records this permanently:

> **`main` branch:** contains only `Toro_TimeMaster_PWA_Package.zip` — do NOT use it for deploys

(CLAUDE.md at commit `90e556e`, 2026-06-24; the same line survives in the tip CLAUDE.md as of 2026-08-16.)

**INFERRED:** The zip itself was almost certainly produced by a claude.ai conversation on or before 2026-05-19 (the app is far too polished and idiosyncratically complete to be hand-written, and its packaging — "PWA_Package.zip" with icons — matches Claude artifact export patterns). No transcript of that conversation survives anywhere in the repo. The record is silent on how many conversations preceded the zip — but one internal clue suggests at least one earlier iteration existed: the app's localStorage key is `"toro-v2"` (`const SK="toro-v2"`, zip `index.html` line 86). A "v2" key implies a "v1" app that is lost entirely.

#### 1.1 Identity and design

- **Title / branding:** `<title>Toro TimeMaster 21200</title>`; Apple home-screen name **"TimeMaster"**; header shows a red **TORO** badge (SVG, Arial Black, letterspaced) next to "TimeMaster 21200".
- **Manifest** (`manifest.json`): name "Toro TimeMaster 21200", short_name "TimeMaster", `background_color: #111111`, `theme_color: #CC0000` (Toro red), icons 192/512.
- **Service worker** (`service-worker.js`): cache name **`toro-timemaster-v1`**, a minimal install-time cache of 5 assets with a cache-first fetch handler. (This tiny cache-first worker is worth remembering: stale-cache fights became a recurring plague later in the project — the hcc-v3/v4/v5 cache-bust commits of 2026-06-23 all descend from this file.)
- **Visual design:** iOS-native look — `-apple-system` font, light theme `#f5f5f7` background with a `prefers-color-scheme: dark` variant, Toro red `#CC0000` accents, bottom tab bar with `env(safe-area-inset-bottom)` padding, black-to-dark-red gradient header. This is a completely different design language from everything that came after (the 06-21 app is dark/Archivo/neon; see §3).
- **Footer** (rendered on every page, verbatim):

> TORO TIMEMASTER 21200 · SN 401338948 · MAINTAINED TO WIN

That "MAINTAINED TO WIN" slogan is unique to the original app. The later slogan — "MASTER THE MASTER," which gave the GitHub repo its name — does not exist anywhere in the zip. (See §3.19.)

#### 1.2 The six tabs

A bottom tab bar (`#tabbar`, zip lines 75–82) with six views:

| # | Tab | Icon | Contents |
|---|-----|------|----------|
| 0 | **Dashboard** | ⊞ | Alert strip (overdue/due-soon), Asset Information card, Hour Meter card (editable), Condition Scores card (rings + sliders), Service Timeline |
| 1 | **Maintain** | 🔧 | Three sub-tabs: 📋 Schedule (Before-Each-Use checklist, Hour-Based Schedule, Engine Specs), ⏰ Alerts, 📅 Annual (per-year checklist 2024–2028 with progress bar) |
| 2 | **Parts** | ⚙️ | 16-part status list with per-part status dropdown (✓ OK / ⚠ Warn / ✕ Replace), YouTube how-to button, best-retailer button, eBay button |
| 3 | **Diagnose** | ⚠️ | Current Issues list (add/resolve) and free-form Notes |
| 4 | **Log** | ＋ | New service entry form (date, type, title, multi-line "Work Performed") appending to the timeline |
| 5 | **Shop** | 🛒 | Parts shopping list: category filters, checkbox cart, and per-part retailer comparison cards across 6 retailers |

All state persisted to `localStorage["toro-v2"]`; a green "Saved ✓" flash message confirmed each write.

#### 1.3 The mower data baked into the app (the `INIT` object, zip lines 177–192)

**Asset Information:**

| Field | Value |
|---|---|
| Model | Toro TimeMaster 21200 |
| Serial | **401338948** |
| Purchased | **2018-04-11** |
| Engine | Briggs & Stratton 223cc OHV |
| Cut Width | 30" |
| Drive | Personal Pace Self-Propel |
| Condition | "Strong · Fully Rebuilt" |

**Hour meter:** reading **1.1 hrs**, last updated **2026-05-13**, note: *"Hour meter newly installed."* So six days before the zip's file date, Jeff had installed a physical hour meter on the freshly rebuilt mower and it read 1.1 hours.

**Condition scores:** deck 90, engine 95, transmission 95, ignition 95, **overall 92** — with slider inputs to adjust each, overall auto-recomputed as the average of the four.

**The restoration timeline** (`INIT.timeline`, verbatim items):

| Date | Type | Title | Items |
|---|---|---|---|
| 2018-04-11 | purchase | Purchased New | "Toro TimeMaster 21200 purchased new" |
| 2023-01-01 | service | Major Service | "Replaced belts, blades, cables", "Transmission serviced" |
| 2026-04-09 | oil | Oil Change | "5W-30 Full synthetic", "Filter inspected" |
| 2026-05-09 | service | Full Restoration | "All belts, blades, spindles, pulleys replaced", "Deck painted, wheels, cables, pull cord replaced", "Fuel filter & shutoff replaced" |
| 2026-05-13 | ignition | Ignition Complete | "Aftermarket ignition coil installed", "Champion RJ19LM — 0.030 gap", "Spark plug boot replaced", "Hour meter — 1.1 hrs" |

Note the "2023-01-01 Major Service" entry — the much more detailed history that surfaced in the 06-21 app (§3.10) dates that same belts/blades/cables/transmission campaign to **February 2025**, with per-part receipts. The two records disagree; the later, receipt-level record is presumably the correction. The zip's "2026-04-09 Oil Change" entry likewise never reappears in the later history. The record is silent on which is right.

**Diagnostics defaults:** zero current issues, three notes: "Hour meter newly installed · 1.1 hrs logged", "Spark Plug: Champion RJ19LM · 0.030 gap", "Ignition coil installed — running strong".

#### 1.4 The 16-part parts database (`PARTS`, zip lines 136–153)

Every part has a status ("ok" across the board — the mower had just been rebuilt), a date, and a color-coded category (Cutting red, Drive blue, Chassis green, Controls amber, Engine violet, Fuel orange):

| Component | Part # | Date | Category |
|---|---|---|---|
| Blades | 133-8062 | 2026-05-09 | Cutting |
| Blade Spindles | 117-1196 | 2026-05-09 | Cutting |
| Pulleys | 106-9171 | 2026-05-09 | Drive |
| Blade Drive Belt | 121-5956 | 2026-05-09 | Drive |
| Trans. Drive Belt | 121-5957 | 2026-05-09 | Drive |
| Wheels | 117-5976 | 2026-05-09 | Chassis |
| Cables | 119-8891 | 2026-05-09 | Controls |
| Transmission | 117-5975 | 2026-05-09 | Drive |
| Deck Height Adj. | 117-5968 | 2026-05-09 | Chassis |
| Pull Cord | 117-9127 | 2026-05-09 | Engine |
| Air Filter | 110-0836 | 2026-05-09 | Engine |
| Fuel Filter | 125-5271 | 2026-05-09 | Fuel |
| Fuel Shutoff Valve | 125-4451 | 2026-05-09 | Fuel |
| Ignition Coil | (Aftermarket) | 2026-05-13 | Engine |
| Spark Plug | RJ19LM | 2026-05-13 | Engine |
| Spark Plug Boot | (OEM) | 2026-05-13 | Engine |

(Archivist's note: these Toro part numbers do not all match the ones used in the 06-21 app's parts catalog — e.g. blades are 133-8062 here but 120-9500 / 116-6358 there, belt 121-5956 here vs 121-5765 there. **INFERRED:** the lost month included a research pass that corrected/replaced the original part-number set.)

#### 1.5 The YouTube how-to video map (`VIDEOS`, zip lines 106–123)

Each part number mapped to a curated repair video with title and year — 16 entries:

| Part # | Video title | Year |
|---|---|---|
| 133-8062 | Blade Replacement Step-by-Step | 2024 |
| 117-1196 | Spindle, Shaft & Bearing Repair | 2022 |
| 106-9171 | Transmission Pulley Replacement | 2024 |
| 121-5956 | Belt Replacement — Save Half the Time | 2024 |
| 121-5957 | Sync Belt & PTO Belt Replacement | 2025 |
| 117-5976 | TimeMaster Full Tune-Up | 2023 |
| 119-8891 | Blade Engagement Cable Replacement | 2022 |
| 117-5975 | Transmission Replacement | 2024 |
| 117-5968 | TimeMaster Full Tune-Up | 2023 |
| 117-9127 | Pull Rope Replace & Rewind | 2021 |
| 110-0836 | Tune-Up: Oil, Plug & Air Filter | 2023 |
| 125-5271 | Oil Change & Air Filter | 2026 |
| 125-4451 | Fuel Shut-Off Valve Install | (no year) |
| (Aftermarket) | Ignition Coil Replacement Fix | 2021 |
| RJ19LM | Spark Plug & Gap Setting | 2024 |
| (OEM) | Spark Plug & Boot Replacement | 2024 |

Rendered as red "▶ '24 How-To" YouTube-styled buttons throughout the app.

#### 1.6 The six retailers (`RETS`, zip lines 125–132)

Each with brand color, OEM/aftermarket coverage tag, a one-line note, and a search-URL builder:

| Retailer | Type | Note |
|---|---|---|
| Amazon 🛒 | OEM+AFM | "Fastest ship" |
| eBay 🔖 | OEM+AFM | "Sort lowest price" (URL pre-sorted lowest price `_sop=15`) |
| eReplacementParts 🔩 | OEM | "OEM verified" |
| PartsTree 🌲 | OEM | "Exploded diagrams" |
| Jack's SE ⚙ | OEM+AFM | "Engine specialist" |
| ProvenPart ✅ | OEM+AFM | "Tune-up kits" |

A `BEST` map ranked which retailers to show first for each specific part number. The Shop tab assembled per-part comparison cards from this data. **There are no prices anywhere in the zip** — price ranges first appear in the 06-21 app.

#### 1.7 The maintenance schedule (`SCHED` + `ANNUAL`, zip lines 156–173)

Hour-based schedule (WARN window: 5 hrs before due):

| Task | Interval | Critical | Part | Detail (verbatim) |
|---|---|---|---|---|
| Engine Oil — Break-In | @ 5 hrs, one-time | yes | SAE 30/10W-30 | "Required after first 5 hrs" |
| Engine Oil — Change | / 50 hrs | yes | SAE 30/10W-30 | "Standard interval" |
| Air Filter — Clean | / 50 hrs | no | 110-0836 | "Tap or blow <30 psi" |
| Blade-Drive Belt — Inspect | / 50 hrs | no | 121-5956 | "Check tension & condition" |
| Spark Plug — Inspect | / 100 hrs | yes | RJ19LM | "Gap: 0.030\"" |
| Fasteners — Tighten | / 100 hrs | no | — | "Blade bolt: 60 ft-lb" |
| Air Filter — Replace | / 200 hrs | no | 110-0836 | "Full replacement" |

"Before Each Use" checklist (Maintain tab): Engine Oil Level ("Check & add — dipstick full"), Blade-Brake-Clutch ("Test — blades stop within 3 sec"), Cutting Blades ("Inspect for nicks & cracks"), Air Filter ("Check / tap clean"), Under Deck ("Washout port — run blades 1 min").

Annual / end-of-season checklist (per-year, 2024–2028 selectable): Engine Oil Change ("Drain and refill 0.53 L", critical), Air Filter Service, Blades — Sharpen/Replace ("Check cracks & balance", critical), Spark Plug — Service ("Inspect, gap 0.030\""), Fuel System — Drain ("Run dry before storage", critical), Deep Clean & Inspect ("Underside and deck"), All Fasteners — Tighten ("Blade bolt 60 ft-lb").

**Engine Specs card** (verbatim pairs): Engine "B&S 223cc OHV" · Oil Capacity "0.53 L (18 fl oz)" · Oil Type "SAE 30 or 10W-30" · Spark Plug "Champion RJ19LM" · Plug Gap "0.030\"" · Blade Bolt "60 ft-lb" · Fuel "Unleaded 87" · Coil Gap "0.010\"".

These numbers — **plug gap 0.030", coil gap 0.010", blade bolt 60 ft-lb, 18 fl oz oil** — are the project's oldest constants. They survive verbatim into every later version of the app.

#### 1.8 What the zip does *not* contain

Worth stating explicitly, because everything in this list was later assumed to have "always existed": **no weather, no irrigation, no GPS, no sensors, no ESP32, no fitness tracking, no spending tracker, no prices, no photos, no backup/export, no Cloudflare, no Home Assistant, no mention of electric start or a battery** (the zip's asset card lists only "Personal Pace Self-Propel" drive — the Mighty Max ML3-12 battery that the 06-21 app says was installed 2026-05-07, i.e. *twelve days before the zip's file date*, is entirely absent from the original app). The original app was a pure, offline, single-machine maintenance logbook.

---

### 2. The gap: 2026-05-20 → 2026-06-21 — no repo evidence exists

Stated plainly for the permanent record:

- The repo's entire history for this period is **one commit**: `09f02d4` "Add files via upload" (2026-05-20 08:35 -0500) — the zip landing on `main`.
- The next commit of any kind is `0e7e18d` on **2026-06-21 17:14 UTC** — thirty-two days later — on a new branch, `claude/time-master-project-liq1jw`, which became the project's real branch (636 commits by 2026-08-16).
- **The literal cloud-session transcripts from this month are not in git and, as far as the record shows, are not preserved anywhere.** Jeff worked with claude.ai sessions during this period (see the fossil evidence in §3), but nothing those sessions said, decided, argued about, or cost survives except what got frozen into the 06-21 code snapshot.
- The first CLAUDE.md (commit `e8f0312`, 2026-06-23) starts its session history at 2026-06-23. The file-based memory culture that eventually saved this project **begins after the gap**; nothing was contemporaneously written down during it.

This is the original instance of the problem this whole history file exists to fix. When `0e7e18d`'s commit message says the extraction is "the starting point for the Home Command Center build," and `0b76d4c` eight minutes of work later replaces it with a 4× larger app, the month of collaboration in between had already been reduced to a single artifact with no explanation attached.

Three fragments of hard evidence bracket the gap:

1. **The commit that opens the new era carries a session ID**: `0e7e18d` is signed `Co-Authored-By: Claude Sonnet 4.6` with `Claude-Session: https://claude.ai/code/session_01WuKnDJrDp2n6fHjhtahmLe`. That is the first Claude Code (repo-connected) session of the project. The cloud sessions before it left no such fingerprints.
2. **The 06-21 app calls same-origin `/api/...` endpoints that are not in the repo.** At `0b76d4c` — and still at `6649269`, the last commit of 06-21 — the repo tree contains only the zip, the extracted PWA files, and the rewritten `index.html`. No `functions/` directory. Yet the app fetches `/api/hours`, `/api/weather`, `/api/alerts`, `/api/irrigation`, `/api/irrigation/control`, with a code comment saying "The endpoint lives on this same site (Cloudflare Pages function at /api/hours)". **The backend existed somewhere — a Cloudflare Pages deployment stood up during the cloud era — but its code was not under version control.** The API functions first entered git on 2026-06-23 in commit `c8e729c`, whose title is telling: "Fix all 4 broken API endpoints + unified design layer."
3. **The app's own data is date-stamped.** The `RESTORATION` history and `DEFAULT_STATE` baked into `0b76d4c` contain entries dated 2026-05-20, 2026-05-31, and 2026-06-06 (detailed next section) — waypoints of a month that otherwise vanished.

---

### 3. The fossil record: what the lost month produced (diff `0e7e18d` → `0b76d4c`)

Commit `0b76d4c` (2026-06-21 20:31 UTC) replaces the zip's 576-line `index.html` with a 2,336-line file (+2,285 / −525; ~300 KB including an embedded 274 KB hero photo). The commit message:

> Add full live app source — B-Hyve, weather, GPS, ESP32 integrations
>
> Replaces the basic maintenance-only package with the complete live app
> including B-Hyve irrigation control, weather/NWS alerts, GPS mowing
> tracker, and ESP32 telemetry. Base for Home Command Center build.

"The complete live app" — meaning: this file was not written on 06-21. It is the **export of the app as it existed at the end of the cloud-session era**, pasted into git in one commit. Every feature below that is not in the zip is therefore a product of the lost month. **INFERRED (for all of §3): the features were built between 2026-05-20 and 2026-06-21 in an unknown number of claude.ai sessions; per-feature dates are unknown except where the code itself carries a date.**

#### 3.1 Total rewrite of the app's identity

Same title ("Toro TimeMaster 21200") but nothing else survives:

- **Design:** dark theme (`#000` base, later layered to `#0a0a0b` radial gradients), Google Fonts **Archivo** at weights 400–900, neon accent glows, tabular numerals, gauge-style hour meter displays styled like a physical LCD ("`box-shadow:inset 0 2px 6px rgba(0,0,0,.9)`").
- **Tabs:** the 6 bottom tabs became **7 top tabs**: DASHBOARD, SERVICES, HISTORY, PARTS, DIAGNOSTICS, UPGRADES, SPECS.
- **Header:** TORO badge + "TIMEMASTER® 21200 / MAINTENANCE RECORD & PARTS REFERENCE", a 6-cell spec strip (Model 21200 · Serial 401338948 · Engine **B&S 14D935** · Purchased 2018-04-11 · tappable Hour Meter · Condition 99%), an embedded full-width **mower photo** (274 KB base64 JPEG) captioned "30″ DUAL FORCE • PERSONAL PACE", and three action buttons: **🌿 LOG MOW · 🔧 LOG SERVICE · ⏱ UPDATE HOURS**.
- **Engine identification upgraded:** from the zip's generic "Briggs & Stratton 223cc OHV" to the exact spec **B&S 14D935-0111-F1** — precise enough to link the exact PartsTree engine diagram. (One frozen error worth recording: the Parts tab's Toro diagram button links the PartsTree model page for "SN 400000000-402081999" — which correctly contains Jeff's serial 401338948 — but the "eReplacementParts (alt)" button links the *402082000–403599999* serial-range page, which does **not** cover Jeff's mower. Nobody appears to have ever noticed.)
- **Storage key changed** from `toro-v2` to **`toro21200`** — a clean data break from the original app. The key `toro21200` remained the app's storage key permanently.
- **New footer** (verbatim, both lines):

> WELL MAINTAINED. WELL DOCUMENTED. **BUILT TO LAST.**
> KEEP IT CLEAN. KEEP IT SHARP. **MASTER THE MASTER.**

"MAINTAINED TO WIN" is gone; **"MASTER THE MASTER" appears here for the first time in the surviving record** — see §3.19.

- The page also carries `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">` — **INFERRED:** the cloud-era deployment was already fighting stale-cache problems, foreshadowing the service-worker cache wars of 06-23.

#### 3.2 The "Smart TimeMaster Digital Twin" — ESP32 telemetry package

The single biggest product of the lost month: Jeff's mower got a custom sensor computer. The app's fixed history (`RESTORATION.unshift`, all rows dated **2026-06-06**) documents the hardware, verbatim notes included:

| Entry (2026-06-06) | Part | Note (verbatim) |
|---|---|---|
| Smart TimeMaster Digital Twin sensor package documented | ESP32 / GPS / MPU6050 / Voltage | "Telemetry, diagnostics, GPS mowing sessions, battery warnings, RPM estimate, vibration health, and predictive maintenance direction locked." |
| ESP32 smart controller added | ESP32-C3 / ESP-WROOM-32 | "Central WiFi controller for sensor telemetry and Cloudflare app sync." |
| NEO-6M GPS module added | GY-NEO6MV2 | "Feeds miles walked, speed per mow, session map, and lifetime hidden distance totals." |
| MPU6050 motion/RPM sensor added | GY-521 MPU6050 | "Detects vibration, shock, slope, tip risk, and estimates engine/blade RPM after calibration." |
| Battery voltage sensor added | DC 0-25V Voltage Module | "Warns for weak battery, replace battery, and voltage too low to start electric start." |
| Sensor power protection added | LM2596 + inline fuse | "Regulated fused power feed for stable electronics operation." |
| Weatherproof sensor enclosure and harness added | ABS project box + Dupont wiring | "Protects electronics and organizes the sensor wiring harness." |
| GPS Fitness Feed Enabled | GPS distance tracking | "GPS distance now updates Fitness miles walked and GPS MPH automatically when synced." |
| Weather station linked | KTNWHITE21 / Ambient Weather WS-2902 | "Indian Ridge / jalo301 PWS at 36.477N, 86.66W (863 ft). Weather and radar coordinates aligned to the station; AMBWeatherV3.0.0." |

So the sensor package was assembled and its direction "locked" on/around **2026-06-06** — mid-gap. The UPGRADES tab lists all of it (ESP32 controller, NEO-6M, MPU6050, LM2596 buck converter, inline fuse holder, weatherproof ABS enclosures, Dupont jumper harness, WiFi Engine Hour Sensor "Cloudflare-connected", GPS Mowing Tracker, RPM Sensor Feed, Battery Voltage Monitor) as "✓ INSTALLED", each with the Amazon search URL it was presumably bought from. **No purchase prices for the sensor hardware are recorded anywhere in this era** — the record is silent on what the ESP32 package cost.

**The dashboard's "📡 Engine Hour Sensor Data" card** (cyan-coded) reads from `/api/hours` and displays: Battery Voltage, a battery alert banner, Battery Health %, Start Reliability, Engine RPM (peak / avg), GPS Distance (Total), GPS Distance (This Mow), GPS Speed, Last Location (lat/lon), plus a four-chip **Sensor Health strip** (MPU / GPS / BATT / WIFI, each OK/MISSING/SILENT/dBm), a "🔄 Sync From Sensor Now" button, and a status line. Card description, verbatim:

> Pulls engine hours, battery, RPM, GPS distance, and mowing speed from the WiFi/GPS sensor. GPS distance feeds the Fitness miles walked tracker automatically. Hours only ever move forward.

The sync code (`window.mowerSync`) contains two comments that preserve cloud-era decisions verbatim:

> // The endpoint lives on this same site (Cloudflare Pages function at /api/hours), so this is a same-origin call - no domain to set, no CORS.

> // Hours already on the mower the day you install the sensor. The sensor counts up from 0, so displayed hours = BASELINE + sensor hours. Set this to whatever this dashboard reads on install day (right now that's 5.4).

`MOWER_BASELINE = 5.4` — the mower had 5.4 hours on it the day the sensor was installed. Battery interpretation thresholds are hardcoded: ≥12.6 V "✓ Battery healthy" (100%), ≥12.3 V "⚠ Battery capacity declining" (82%), ≥12.0 V "⚠ Battery weak — replacement recommended" (65%), ≥11.8 V "🚨 Low starting voltage — recharge or replace" (35%), below that "🚨 Voltage too low to start — replace battery" (10%). Tip-over logic: max(|pitch|,|roll|) ≥25° "CRITICAL", ≥20° "RED", ≥15° "CAUTION".

**A fossil bug frozen in this commit:** the JS sets rows `sensorPitch`, `sensorRoll`, `sensorVibe`, `sensorShock`, `sensorTip`, `sensorWifi`, `sensorTemp` — and the CSS styles those IDs — but **no DOM elements with those IDs exist in the HTML**. The `setRow` helper silently no-ops, so pitch/roll/vibration/shock/tip/WiFi/temp data was computed and then displayed nowhere. This exact defect was fixed two days later in commit `4c52e85` (2026-06-23, "Fix missing CSS variables, card accent colors, and sensor panel DOM rows") — proof that the cloud-era export shipped with dangling wiring that only repo-based, testable sessions caught.

#### 3.3 GPS Yard Map

A `<canvas id="yardMap">` card ("🗺 Yard Map • GPS Mowing Track", teal-coded): renders the sensor's GPS `track[]` as a self-contained map — no tiles, no API keys — with equirectangular projection (longitude compressed by cos(latitude) "so shape isn't stretched"), north up, auto-fit with padding, green track line, blue start dot, red latest dot, and a live point count ("N GPS points · blue = start, red = latest"). Card copy, verbatim:

> Drawn from the WiFi sensor's GPS as you mow. Each pass adds to the map, so your yard's shape fills in over time. North is up.

Empty state: "No GPS track yet — it'll appear after your first mow with the sensor installed."

#### 3.4 Fitness — Miles Walked Mowing

A green-coded dashboard card treating mowing as exercise: Total Distance (miles), Calories Burned, Mows Tracked, Avg Mi/Mow, GPS MPH, ~Steps. The model, from code: **~95 kcal/mile pushing a mower × 1.20 slope factor** ("gentle ~5% grade: +20% calories"), **~2,100 steps/mile**, default 4.0 mi per full mow. Fine print verbatim: "10,000 sq ft yard · GPS sensor feeds miles + speed · 30″ swath · gentle slope (+20% cal)". The LOG MOW modal has a "🚶 Miles Walked (Apple Watch)" field, "Auto-filled to 4.0 mi for a full yard — edit for partial mows."

A design decision from the lost month is preserved as a code comment, verbatim:

> // Mower GPS distance is its OWN stat (the "Mower Distance" row below) — do NOT add it to "Miles Walked", which comes solely from your Apple Watch entry. Adding both would double-count the same physical distance once GPS is live.

So by the end of the gap the project had already litigated (and settled) the Apple-Watch-vs-GPS double-counting question. This is the first appearance of Jeff's **Apple Watch** in the record.

#### 3.5 Weather — "Mowing Conditions • White House, TN 37188"

The lost month located the project in the physical world: **White House, Tennessee, 37188 — 36.477° N, 86.66° W, 863 ft elevation**. The weather card assembles:

- **Open-Meteo forecast API** (free, keyless): temperature, humidity → derived dew point, rain probability, precipitation, soil temperature, WMO weather codes. Derived tiles: Temperature, Dew Point, Rain Risk, Soil Condition (FIRM/MOIST/WET), Soil Temp, Dew on Grass (DRY/LIGHT/WET), Soil Firmness, Rain 24-48h (probability + inches), Heat Stress (LOW <80°F / MODERATE <90 / HIGH <103 / EXTREME), Lightning (thunderstorm codes 95/96/99 in next 24h → RISK/NONE).
- A verdict banner: "✓ GOOD TO MOW" / "⚠ MOW WITH CAUTION" / "🚫 DO NOT MOW" (rain risk >55% or >0.35" → NO; >30% or >0.12" → CAUTION).
- **Jeff's own personal weather station**, proxied server-side via `/api/weather` (Weather Underground PWS API): station **KTNWHITE21**, name **"Indian Ridge / jalo301"**, hardware **Ambient Weather WS-2902**, software AMBWeatherV3.0.0. Live station readings override the forecast tiles, with a note line "📡 Live from your station KTNWHITE21 · …". A button opens the Wunderground station dashboard.
- **Embedded live rain radar**: a Windy.com iframe centered on 36.477,-86.66 (radar overlay, mph/°F units) plus an "Open Full Radar & Forecast" button.
- **NWS alerts** via `/api/alerts` feeding the readiness engine (below) and the burn card.

#### 3.6 The "Ready to Mow?" readiness engine

A combined go/no-go verdict fusing every data source the project had: official NWS watches/warnings (with per-type icons — freeze/frost, wind, heat, thunderstorm); a frost rule ("Frost/freeze — don't mow frosted grass; wait until it thaws & dries" when a freeze alert is active before 11 a.m.); a seasonal rule ("First freeze near — time to winterize / blow out your irrigation" for freeze alerts in September or later — the comment records "your season runs May–first freeze"); irrigation interlocks ("Irrigation running now (Zone N) — do not mow yet"; "Irrigation ran ~Nh ago — let the grass dry before mowing" within 8 hours); weather status; heavy-dew warning; overdue/due-soon services by name; and overall mower health. Verdict banner: 🚫 NOT READY / ⚠ MOW WITH CAUTION / ✓ GOOD TO MOW.

#### 3.7 B-Hyve irrigation — "Water Hog"

First appearance of the second major hardware system: Jeff's **Orbit B-hyve irrigation timer, device name "Water Hog"** (the card's fine print: "Live from your Orbit B-hyve • Water Hog"). Via a server-side proxy (`/api/irrigation`, again not in the repo yet):

- Device status (ONLINE/OFFLINE), run mode, rain-delay state; banner "💧 WATERING — Zone N" / "✓ All zones idle".
- Per-zone rows with the B-hyve zone photos, WATERING/IDLE state, "Smart watering" tag, and a ▶ run button.
- **Controls, PIN-gated**: start a zone for 1–60 minutes (prompt, default 10), "■ STOP ALL", rain delay 24h/48h, "☀️ CLEAR DELAY". Commands POST to `/api/irrigation/control` with a PIN the app stores in `localStorage["irr_pin"]`; wrong PIN clears it and re-prompts.
- **Water usage & cost model** — the project's first money-math feature, with constants that record real research from the lost month: zone flow rates `{Zone 1: 17.2 GPM, Zone 2: 14.3 GPM, Zone 5: 5.7 GPM}` from "Hunter MP flow @180°" charts ("MP3500 x6/x5, MP3000 x3") at "82 psi supply, no shortfall"; representative run times 20/18/8 min; 3 watering days/week; **White House Utility District 2026 rates: water $0.00908/gal + sewer $0.01136/gal**. It computes per-cycle, weekly, and monthly gallons and dollars, and includes this note, verbatim:

> WHUD 2026: water $0.00908 + sewer $0.01136/gal. 💡 **Irrigation water never enters the sewer** — ask WHUD about **seasonal sewer averaging** (or an irrigation meter) to drop the sewer half: water-only would be ~$X/mo. Flow est. from Hunter MP charts at 180°; your 82 psi confirms no pressure shortfall.

(That "irrigation water never enters the sewer" insight, first recorded here, is the seed of the sewer-overcharge investigation that shows up in the August 2026 docs — `docs/utilities/sewer_overcharge_verification_2026-08-05.md` in the tip tree.)

#### 3.8 Brush Burn Conditions

A fire-safety card scoring wind/gusts (from the PWS), humidity, recent rain ("fuels damp"/"fuels dry"), heat ≥95°F, and NWS fire-weather products (Red Flag Warning +4, Fire Weather Watch +2, Wind Advisory +2) into a four-flag verdict: 🟢 GREEN FLAG "Safe to burn" / 🟡 YELLOW FLAG "Burn with caution" / 🚩 RED FLAG "Burning not advised" / 🏴 BLACK FLAG "No burning — extreme fire danger". Footer: "Always check local burn bans/permits; keep water & a tool on hand." **INFERRED:** Jeff burns brush on his property; this card was built for a real recurring chore, like everything else in the app.

#### 3.9 The restoration history with prices — the money record

The HISTORY tab gained a fixed "Complete Maintenance History" table (`RESTORATION` array) that replaces the zip's 5-entry timeline with a 29-entry receipt-level record. This is the earliest surviving cost accounting in the project. In full:

| Date | Service / Repair | Part # | Cost | Note (verbatim) |
|---|---|---|---|---|
| 2026-05-20 | Mow #2 | — | — | "Full yard • 1.25 hrs" |
| 2026-05-14 | Mow #1 — First post-restoration | — | — | "Full yard • 1.25 hrs. Engine smooth." |
| 2026-05-13 | Ignition Coil & Plug Boot | 139-0720 / 399781 | **$25.97** | "RPM stable. No misfire." |
| 2026-05-13 | Spark Plug Replaced | Champion RJ19LM | **$3.99** | "Gap set 0.030\". Smooth idle." |
| 2026-05-11 | Blades Sharpened & Balanced | 120-9500 / 116-6358 | — | "Both blades at 60 ft-lb." |
| 2026-05-10 | Full Deck Strip, Sand & Repaint | — | — | "Toro red + clear coat. Rust-Oleum 302110." |
| 2026-05-10 | All 4 Wheels Refinished | 131-9665 / 131-9666 | — | "Gloss black. New bearings." |
| 2026-05-09 | Drive Belt & Transmission Service | 121-5765 / 120-9470 | — | "Belt verified. Pulley cleaned." |
| 2026-05-09 | Oil Change — Restoration Start | 100074 | **$15.00** | "Full Synthetic 5W-30. Hour meter at 0.0 hrs." |
| 2025-05-27 | Carburetor Replaced | HUFEWU 590944 | — | "Fits 21199/21200/20200 223cc. Fixed surging." |
| 2025-02-13 | Deck Restoration + Fluid Film | — | **$40.00** | "Rust protected" |
| 2025-02-13 | Fuel Shut-Off Valve Installed | — | **$16.00** | "Easy storage" |
| 2025-02-13 | Oil Change (SAE 10W-30) | — | **$9.00** | "Clean oil" |
| 2025-02-13 | Spark Plug Replaced | Champion RJ19LM | **$3.99** | "Smooth idle" |
| 2025-02-13 | Spark Plug Boot Replaced | 399781 | **$6.99** | "Strong spark" |
| 2025-02-13 | Ignition Coil Replaced | 130-0720 | **$18.97** | "No misfire" |
| 2025-02-13 | Fuel Filter Replaced | 691035 | **$6.97** | "Clean fuel" |
| 2025-02-13 | Air Filter Replaced | 593260 | **$7.98** | "Fresh air flow" |
| 2025-02-12 | Pull Cord Replaced | 590750 (WOTIAN 796497) | **$12.00** | "Starts easy" |
| 2025-02-11 | Front Wheel Adjuster Replaced | 131-9668 | **$12.00** | "Smooth adjust" |
| 2025-02-11 | Rear Deck Adjuster Replaced | 131-9667 | **$16.00** | "HOC accurate" |
| 2025-02-11 | Cables Replaced (Drive & BBC) | 121-9181 / 121-9182 | **$38.00** | "Controls crisp" |
| 2025-02-11 | Transmission Assembly Replaced | 130-9667 | **$162.00** | "No slipping" |
| 2025-02-11 | Transmission Drive Belt Replaced | 120-9470 | **$14.47** | "Strong traction" |
| 2025-02-10 | Blade Drive Belt Replaced | 121-5765 | **$18.97** | "Engages solid" |
| 2025-02-10 | Blade Pulleys Replaced (x2) | 120-5236 | **$40.00** | "Quiet operation" |
| 2025-02-10 | Blade Spindles Replaced (x2) | 120-5238 | **$134.00** | "No vibration" |
| 2025-02-10 | Blades Replaced (x2) | 120-9500 | **$31.98** | "Clean cut" |
| 2025-02-10 | Wheels Replaced (Front & Rear) | 131-9665 / 131-9666 | **$60.00** | "Smooth rolling" |

Archivist arithmetic on the recorded rows (not stated anywhere in the app itself): the February 2025 rebuild campaign's priced line items total **≈ $649.32**; the May 2026 restoration's priced items add **$44.96**; with the one logged 2026 purchase (below) the recorded parts spend on the mower through 06-21 is **≈ $726.13** — excluding paint, sensor electronics, battery, and anything never logged.

Note the timeline correction embedded here: the big belts/blades/spindles/transmission campaign the zip dated "2023-01-01" is here documented day-by-day across **2025-02-10 → 2025-02-13**, with receipts. Also new: the mower's carburetor was replaced 2025-05-27 with an aftermarket **HUFEWU 590944** kit ("Fixed surging"), and the May 2026 restoration started with the hour meter at 0.0 (the zip's "1.1 hrs / newly installed" reading of 2026-05-13 is consistent — 1.1 hours accumulated in the four days after the 05-09 oil change).

The HISTORY tab also gained a **"💰 Spending Tracker • Going Forward"** card — total spent, purchase count, per-year bars, and a "🛒 Log a Purchase" modal ("Part / Accessory", "💰 Price You Paid", date, note). One purchase is baked into `DEFAULT_STATE`: **"New Mulching Gator Blades" — $31.85 — 2026-05-31**.

#### 3.10 Jeff's usage during the gap, frozen in `DEFAULT_STATE`

`DEFAULT_STATE` (the state a fresh browser gets) is a snapshot of Jeff's real data at export time: `hours: 5.4`, `miles: 4`, and a 7-entry log all dated **2026-05-31 at 3.5 hrs**: Cable Inspection, Clear Coat Entire Mower, New Mulching Gator Blades, Battery Charge, Post-Mow Cleanup, Pre-Mow Safety Check (each "Service completed", "+5%"), and **"Mow #3 — Full yard · 1.0 hr · 4.0 mi"** with the walking miles logged. Together with the fixed history (Mow #1 on 05-14, Mow #2 on 05-20 — the same day he uploaded the zip), this documents that Jeff was actively mowing and logging all through the gap: 0.0 hrs on 05-09 → 1.1 on 05-13 → 3.5 on 05-31 → 5.4 by sensor-install day.

A second hour-reading fossil: the static HTML hardcodes **"2.5"** in the header and main meter (and "Total Mows 2"), while `DEFAULT_STATE` and `MOWER_BASELINE` say **5.4**. JS overwrites the static values at render, so users never saw the mismatch. **INFERRED:** the static HTML was generated at an earlier point in the cloud era (when the meter read 2.5, after Mow #2) and never regenerated as the state moved on — two different moments of the lost month frozen in one file.

#### 3.11 The 18 service rules and the health model

The zip's 7 schedule entries became 18 `RULES`, each with an interval and a curated YouTube search: Blade Sharpening /25h, Oil Change /50h, Air Filter /50h, Deck Coating /50h, Spark Plug /100h, Blade Drive Belt /200h, Fuel Filter /100h, Transmission Belt /100h, Carburetor Clean /100h, Wheel Bearing Check /50h, Cable Inspection /25h, Pre-Mow Safety Check /1h, Battery Charge /25h, Ignition Coil Gap Check /100h, Air Filter Replace /200h, Storage Prep / Fuel Drain /200h, Post-Mow Cleanup /1h, **Clear Coat Entire Mower /12h**. Status thresholds: OVERDUE at 0 remaining, DUE SOON within 30% of the interval. A "Service Countdown" panel shows progress bars "so every hour visibly moves a bar" (code comment). Logging a service resets its countdown and toasts '✓ Logged — "X" countdown reset to N hrs'; custom-titled services are keyword-matched to rules (`matchRuleFromText`).

`calcHealth()` derives six subsystem scores — ENGINE, DECK, BLADES, DRIVE computed from service status (floor 50), ELECTRICAL and FUEL **pinned at 98** — and an overall that the header displays (99% at export). The zip's user-slider condition scores were dropped; condition became computed.

#### 3.12 The 38-entry parts catalog with prices

The zip's 16-part status list became a 38-entry `PARTS` catalog, each with OEM part number and price range, an aftermarket alternative and its price range, and six outbound buttons (Amazon, Home Depot, Toro.com, eBay, Walmart, ▶ Video), plus an add-to-cart flow (cart FAB, "Shop All on Amazon" combined search, plain-text list export). Highlights with prices as recorded: Blade Drive Belt Toro 121-5765 $17–$35 (Stens 265-208 $12–$22) · Blade Set 120-9500/116-6358 $33–$55 (Oregon 91-631 $20–$32) · Spark Plug RJ19LM $3–$7 · Air Filter Briggs 593260 $8–$15 · 5W-30 Full-Syn oil $10–$18 · Ignition Coil 139-0720 $28–$55 (aftermarket $15–$28) · Fuel Filter 691035 $6–$12 · **Transmission Assembly 130-9667 $150–$180** (reman $90–$130) · Spindle 120-5238 $55–$70 · Carb HUFEWU 590944 $15–$28 · Pulleys 120-5236 $18–$28 · Trans belt 120-9470 $12–$20 · Front/Rear wheels 131-9665/9666 $22–$35/$28–$40 · BBC & Drive cables 121-9181/9182 $18–$28 each · **ML3-12 battery $18–$30** · Battery charger "Toro OEM (owned)" (alt: Battery Tender Jr $25–$35) · WOTIAN 796497 recoil $18–$30 · 40A fuse $3–$8 ("Spare on Hand") · spare ignition key $8–$15 · Loctite Blue 242 $7–$12 · Loctite Red 271 $8–$14 · locking-washer assortment $8–$15 · **Helicoil M6x1.0 kit (5521-6) $18–$30 · Helicoil M8x1.25 kit (5521-8) $18–$30 · bolt extractor set $20–$40** · M6/M8 grade-8.8 bolt assortments $5–$12 · Rust-Oleum 302110 clear $8–$14 · Fluid Film $12–$18 · silicone spray $6–$10 · deck height adjusters $12–$20 · pull cord $10–$20 · governor spring Briggs 691859 $5–$12 · valve cover gasket 690970 $6–$14 · head gasket 692236 $8–$18 · "TimeMaster Manual (Free PDF)".

The Helicoil/extractor/threadlocker cluster pairs with three new DIAGNOSTICS entries (below) — **INFERRED:** at some point during the rebuild or the gap, Jeff stripped or broke bolts and the fix became institutional knowledge.

#### 3.13 The 13-entry diagnostics table

The zip's freeform issues list became 13 curated symptom→fix entries, each with a video button (all advice verbatim in the code): Hard Starting ("Check spark plug gap (0.030\"). Ignition coil gap must be 0.010\"… Coil replaced May 2026."), Surging / Rough Idle ("HUFEWU 590944 carb installed May 2025…"), Poor Cut Quality ("…Blade bolt torque: 60 ft-lb."), Excessive Vibration (spindles 120-5238), Uneven Cut / Scalping ("Deck should be 1/8\" lower in front…"), Leaking Oil ("Check drain plug torque (150 in-lb)… No oil filter on this model."), Engine Knocking, Overheating, Self-Propel Not Working (cable 121-9182, belt 120-9470, wheel pawls), No Spark / Won't Start (coil 139-0720, gap 0.010"), **Stripped Engine Bolt** ("B&S engine bolts: M6x1.0 thread. Use Helicoil 5521-6…"), **Stripped Frame/Deck Bolt** ("Toro deck bolts: M8x1.25. Muffler bolts: M8x1.25. Use Helicoil 5521-8… Use Loctite Blue 242."), **Broken Bolt Extraction** ("left-handed drill bits… Irwin Bolt Grip extractor… then Helicoil").

#### 3.14 Upgrades, specs, and the electric-start reveal

**UPGRADES tab (21 entries):** hour-triggered recommendations (Bluetooth Hour Meter "RECOMMENDED NOW" $25–$45, High-Lift Blade Kit at 25h $35–$60, Mulching Kit at 10h $28–$45 — and indeed Gator mulching blades were bought 05-31, Deck Wash Port at 5h, LED Light Kit at 15h, STA-BIL at 40h, Heavy Duty Air Filter at 50h, Magnetic Blade Balancer at 20h, Synthetic Gear Oil at 100h) plus the 12 items tagged ✓ INSTALLED (fuel shut-off valve and the entire sensor package, §3.2).

**SPECS tab:** the full specification list reveals hardware the zip never mentioned — **"Start System: Electric Start + Recoil Backup (WOTIAN 796497)"** and **"Battery: Mighty Max ML3-12 • 12V 3AH SLA AGM • F1 Terminal • Installed May 7, 2026"** — plus Smart Controller ESP32-C3/ESP-WROOM-32, GPS GY-NEO6MV2, MPU6050, LM2596 sensor power, 40A plug-in fuse ("spare on hand"), height of cut 1.25"–4.25" (7 positions), oil "Full Synthetic 5W-30" (upgraded from the zip's "SAE 30 or 10W-30"), blade bolt "60 ft-lb (82 N·m)", plug gap "0.030\" (0.76mm)", coil gap "0.010\" (0.25mm)", "Restoration Date: May 9–13, 2026", "Hour Meter Start: 0.0 hrs at restoration". A "📄 Next Likely Future Items" card ranks the anticipated failures: 1 Engine Governor Spring, 2 Carburetor (installed 2025 ✓), 3 Recoil Starter (installed ✓), 4 Blade Brake (BBC) Cable, 5 Wheel Gear Pawls, 6 Valve Cover Gasket, 7 Head Gasket (Long Term).

**Data Backup & Restore:** export the full state as JSON (`toro21200-backup-YYYY-MM-DD.json`) via the iOS share sheet ("choose Save to Files") with download fallback; import with a REPLACE-all confirm. Card copy: "Your logs, hours, and miles are saved on this device only. Export a backup file to keep them safe or move to a new phone." (These backups later mattered: the 06-23 session restored Jeff's real hours "from 2026-06-22 backup" per CLAUDE.md.) Service logs support **photo attachments**, auto-shrunk to ≤900 px JPEG at 0.7 quality "so localStorage doesn't overflow", with a storage-full toast: "⚠ Storage full — export a backup & delete some photos". Log entries are editable and deletable (deleting a mow subtracts its miles).

#### 3.15 The layered CSS — archaeology of multiple polish sessions

The stylesheet of `0b76d4c` is not one design; it is **four designs stacked**, each appended below the last with its own banner comment, all preserved verbatim:

1. The base dark design.
2. `/* AUDIT PASS: readability only — no layout changes */`
3. `/* SMART TIMEMASTER DIGITAL TWIN VISUAL PASS — SAFE CSS ONLY */` (brighter red `#ff1f1f`, glass cards, glow shadows)
4. `/* COLOR-CODING + READABILITY PASS (final layer — wins cascade) */` — a 12-family accent system documented in the comment itself: "sensor/telemetry=cyan · status/alerts=red · health/fitness=green · service/cost=amber · weather=sky · gps=teal · parts=orange · upgrades=violet · history/activity=gold · specs=slate", with a color legend rendered on the dashboard.
5. `/* TYPOGRAPHY + DECLUTTER PASS (final layer — one font, clean flow) */` — "single family everywhere (redefine --font AND --mono = Archivo)… calm the noise: drop stacked glows, top stripes, busy shadows".

Two layers both call themselves "final layer." **INFERRED:** each pass is the residue of a separate cloud session's visual review with Jeff; nothing was ever refactored together because no session could see the whole history. The stacked-`!important` cascade this created is exactly the kind of fragility that broke modals during the 06-23 "big fix" session (per CLAUDE.md: CSS classes renamed in one layer but not another).

#### 3.16 Reconstructed timeline of the lost month

**INFERRED except where a date is written in the code itself:**

| Date | Event | Evidence class |
|---|---|---|
| 2026-05-07 | Mighty Max ML3-12 battery installed (electric start) | in-app spec text |
| 2026-05-09 → 05-13 | Full restoration; hour meter starts at 0.0; ignition finished 05-13 at 1.1 hrs | in-app history + zip data |
| 2026-05-14 | Mow #1, "Engine smooth." | in-app history |
| 2026-05-19 22:30 | Zip files written — snapshot of the original 6-tab app | file timestamps |
| 2026-05-20 08:35 | Jeff uploads the zip to GitHub `main` ("Add files via upload") | commit `09f02d4` |
| 2026-05-20 | Mow #2 (same day as the upload) | in-app history |
| between 05-20 and 05-31 | Complete rewrite to the dark 7-tab "live app"; hour tracking, mow/service logging live (static HTML frozen at 2.5 hrs) | fossil analysis |
| 2026-05-31 | Mow #3 (1.0 hr, 4.0 mi walked) + 6 services logged at 3.5 hrs; Gator mulching blades bought, $31.85 | `DEFAULT_STATE` |
| 2026-06-06 | "Smart TimeMaster Digital Twin" sensor package documented & direction "locked"; weather station KTNWHITE21 linked | in-app dated history rows |
| by 06-21 | Sensor installed with dashboard reading 5.4 hrs (`MOWER_BASELINE=5.4`); B-Hyve, burn card, readiness engine, spending tracker, backup/restore all built; a Cloudflare Pages deployment serving `/api/*` exists outside git | code comments + fossil analysis |
| 2026-06-21 17:14 | First Claude Code session (`session_01WuKnDJrDp2n6fHjhtahmLe`, Claude Sonnet 4.6) extracts the zip into the repo as "the starting point for the Home Command Center build" | commit `0e7e18d` |
| 2026-06-21 20:31 | The complete cloud-era app is committed over it | commit `0b76d4c` |

The ordering of feature construction within the gap (weather before B-Hyve? fitness before GPS?) is **unknown — the record is silent.**

#### 3.17 On the name "Master the Master"

The GitHub repo is `d4c2np9f69-afk/master-the-master-` (recorded in CLAUDE.md `90e556e`; the local checkout directory is `Master-the-Master-`). The phrase appears in-app only in the 06-21 footer ("KEEP IT CLEAN. KEEP IT SHARP. MASTER THE MASTER.") — the zip's footer said "MAINTAINED TO WIN." **INFERRED:** the slogan was coined during the cloud era (the repo, created 05-20 for the upload, already bears the name, suggesting the phrase existed by upload day even though the surviving zip predates its appearance in any app copy). The record is silent on who coined it — Jeff or Claude.

---

### 4. The birth of the Home Command Center (commit `eb342db`, 2026-06-21 20:39 UTC)

Eight minutes after committing the live app, the same session executed the pivot that renamed the whole project. Commit message in full:

> Transform Toro app into Home Command Center (HCC)
>
> Adds top-level 4-section navigation (YARD / SECURITY / HOME / SAFETY)
> over the existing app. YARD section wraps all existing Toro/B-Hyve/
> weather tabs untouched. Security adds Blink camera placeholder tiles
> and arm/disarm UI. Home lists all planned ESP32 modules with install
> guide for Home Assistant on Docker. Safety has the panic button,
> Apple Watch fall-detection status, and the life-safety callout.
> All JS section switching and panic handler wired.

**INFERRED:** the decision to expand from mower app to whole-home command center was made in conversation with Jeff during or just before this session; no transcript survives, but the amount of concrete household detail in the placeholder copy (his PC, his fiber, his cameras, Angela's watch) shows the plan was Jeff's, articulated to Claude, not invented by the code.

What the commit actually did:

- **Rebranding:** `<title>` → "Home Command Center"; Apple home-screen name → **"Home CMD"**; `application-name` → "Home Command Center"; theme color → dark navy `#0a0a14`; the red TORO header badge became a blue **HCC** badge; header title → "HOME COMMAND CENTER" with tagline **"MANAGE • MAINTAIN • MONITOR"**. (Fossil: the base64-inlined manifest still said "Toro TimeMaster 21200" — manifest branding wasn't fixed until `4f96d09` on 2026-06-23, so for two days the installed-PWA name disagreed with the page.)
- **The original 4-section concept**, a new top-level switcher above the old tabs: **🌿 YARD · 📷 SECURITY · 🏠 HOME · 🛡️ SAFETY**. The entire existing Toro app — all 7 tabs, sensor card, weather, irrigation, fitness — became the content of the YARD section, untouched.

**SECURITY section** (all placeholder, verbatim copy preserved): a "🔒 System Status" card — "Blink integration — coming next session. Home Assistant will connect your cameras automatically once the brain is set up on your PC." — with ARM ALL / DISARM ALL buttons rendered but disabled (opacity .4, `cursor:default`). Camera tiles: **Front Door**, **Back Yard**, **Garage**, each "NOT CONNECTED", plus an "Add Camera / TAP TO ADD" tile. Modules list: **Blink Camera Integration** [NEXT] ("Arm/disarm, live snapshots, motion events via Home Assistant"), **Gas & Smoke Sensors** [FUTURE] ("ESP32 sensors — early warning + certified backup units"), **Garage Door** [FUTURE] ("Open/close status + remote control via ESP32"). This is the first appearance of **Blink cameras** in the record — the integration that would consume enormous effort in later weeks (the 2FA fix installer `b86a37e` etc. belongs to a later section).

**HOME section:** six ESP32 device tiles, all "ESP32 — FUTURE": **Energy Monitor, Water Monitor, Thermostat, Lighting, Grill Controller, Garage Door** — the original wishlist from which the later CLIMATE/LUX thermostat, Kasa lighting, and SmartHub energy work all descend. Below it, "BRAIN STATUS":

> 🧠 Home Assistant — Not Set Up Yet
> Your PC (always-on, gigabit fiber) will run Home Assistant in Docker. Once installed, all ESP32 devices connect automatically via ESPHome. Alexa integration is built in.
>
> Install steps when ready: 1. Install Docker Desktop on your PC · 2. Run Home Assistant container · 3. Open HA on port 8123 · 4. Add Blink & ESPHome integrations

This is the first written record of the "brain" concept — Home Assistant on Jeff's always-on PC. (Within days the plan changed to a dedicated device named "Beehive," and the PC became "the beast" — later sections cover that; note that the Docker-on-PC plan recorded here was one of the re-litigated decisions.) Also first mentions of **Alexa** and **ESPHome** in the record, and the first written description of Jeff's infrastructure: an always-on PC with **gigabit fiber**.

**SAFETY section:** a full-width red **PANIC / EMERGENCY** button ("Tap to alert household"), whose handler is honest about being a stub — the confirm dialog reads, verbatim:

> EMERGENCY ALERT
>
> This will (once fully wired):
> • Flash smart lights
> • Send push notification to Jeff & Angela
> • Log event with timestamp
>
> Proceed?

…followed by `alert('⚠️ Panic logged at [time] — Full automation coming once Home Assistant is set up.')`. The modules list: **Apple Watch — Fall Detection** [LIVE] ("Already ON — calls 911 + contacts automatically. Keep this enabled."), **Apple Watch Panic Shortcut** [NEXT] ("Shortcut button on Angela's & Jeff's watches → alerts + siren"), **Gas & Smoke Detectors** [FUTURE] ("ESP32 sensors for trend monitoring. Keep UL-listed detectors as primary."). And the life-safety callout, verbatim:

> ⚠️ Life-Safety Note
> Apple Watch Fall Detection + Emergency SOS are your primary life-safety net — they call 911 automatically. This app adds convenience layers on top, never replaces certified safety systems.

This section is the record's first mention of **Angela** (**INFERRED:** Jeff's wife — the copy pairs "Angela's & Jeff's watches" and "Jeff & Angela" as the household). It also documents a safety-engineering posture — DIY sensors as convenience layers, certified UL-listed devices as primary — that was present from HCC's first hour.

---

### 5. The hero image (commit `6649269`, 2026-06-21 20:47 UTC)

The last commit of the era, eight minutes later. Message in full:

> Embed HCC hero image in app header
>
> Adds the Home Command Center hero photo (brick ranch at dusk) as a
> 190px full-width banner between the header and the section nav.
> Image is base64-embedded so the PWA is fully self-contained with no
> external dependencies. Gradient overlay + tagline text layered on top.

The diff adds an 11-line block: a 190 px banner with the base64-embedded photo of the house — **a brick ranch at dusk**, per the commit message; the first appearance of Jeff's actual house in the app — with a bottom gradient and two text layers, verbatim:

> MANAGE • MAINTAIN • MONITOR
> *Everything. In One Place.*

("Everything. In One Place." — in warm gold italic — became the HCC's enduring tagline.) The base64 embedding decision ("fully self-contained with no external dependencies") had a cost recorded two days later: the page ballooned to 2.1 MB and had to be slimmed by extracting the hero photos again (`739d004`, 2026-06-23, "Extract hero photos from HTML — drop from 2.1MB to 295KB") — an early example of a cloud-era-style decision being reversed once real-device performance was measurable.

---

### 6. State of the world at the close of 2026-06-21, and what this era cost

At the end of day 33, the repo tree on `claude/time-master-project-liq1jw` contained exactly: `Toro_TimeMaster_PWA_Package.zip`, `icons/icon-192.png`, `icons/icon-512.png`, `index.html` (the HCC app), `manifest.json` (still the zip's Toro manifest), and `service-worker.js` (still the zip's `toro-timemaster-v1` cache-first worker) — verified via `git ls-tree -r 6649269`. No functions, no CLAUDE.md, no docs, no deploy pipeline in git. The next morning (2026-06-22, commits `46be882` onward) began the Beehive/Home-Assistant era, which belongs to the next section.

**What the gap cost — the honest accounting.** The direct evidence of damage from the undocumented month is in what the next 72 hours had to do: rebuild the four `/api` endpoints inside the repo because the cloud-era backend wasn't in version control (`c8e729c` "Fix all 4 broken API endpoints"); fix the sensor panel rows that had never existed in the DOM (`4c52e85`); restore Jeff's real hour count from a backup file (`53eb7d4` "Restore Jeff's real hours — update default state and sensor baseline to 5.9h"); and untangle the stacked CSS layers whose renamed classes had silently broken every modal (`e904a5b`, `da1320c`). And it is in Jeff's own words, recorded verbatim into the first full CLAUDE.md (`90e556e`, 2026-06-24) — written three days after this era closed, about exactly the working pattern this era exemplified:

> "You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct. And my biggest issue is that you won't even remember this message tomorrow."

> "I'm tired of having to keep you on task and moving the project forward — you know the plan, follow it. Save this and remember it and read it before you do anything."

> "I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learning… but you are making it real hard for this to be enjoyable."

The lost month also produced genuinely remarkable output — a digital twin of a nine-year-old lawn mower with GPS, RPM, vibration, and battery telemetry; a hyperlocal weather and irrigation brain; a receipt-level restoration ledger — built by a man who is "almost 60 and learning," in collaboration with sessions that each woke up amnesiac. The whole subsequent architecture of this project — CLAUDE.md as mandatory memory, git as the single source of truth, "test before you say done" — exists because of what happened, and what was lost, between 2026-05-20 and 2026-06-21.

*End of section. The next section picks up at commit `46be882` (2026-06-22): the Beehive setup scripts and the Home Assistant era.*


---

## Chronicle: 2026-06-21 → 2026-06-22 — HCC is born

This is the two-day window in which the project stopped being "a lawn-mower app" and became the **Home Command Center**. Twelve commits land on `claude/time-master-project-liq1jw` in this window — the first twelve real commits of the project's git history after the lone May 20 zip upload. In 29 hours the repo goes from an empty shell holding a zip file to: the real live app source under version control, the four-section HCC shell, the first hero photo of Jeff's house, the first Home Assistant ("Beehive") automation scripts, the first (and permanently broken) deployment automation, and the naming conventions — **HCC**, **Beehive**, **the Beast** — that every later document in the project uses.

All twelve commits verified against `git log origin/claude/time-master-project-liq1jw` on 2026-08-16. Times are given in UTC as recorded by git; Jeff's local time is CDT (UTC−5), so the June 21 work ran roughly 12:14 PM–3:47 PM his time and the June 22 work roughly 12:12 PM–4:54 PM his time.

### Where the record stood entering this window

Before 2026-06-21 the branch contains exactly **one commit**: `09f02d4` (2026-05-20 08:35:18 −0500), authored and committed by Jeff's own GitHub account `d4c2np9f69-afk <d4c2np9f69@privaterelay.appleid.com>`, subject `Add files via upload`, adding a single file: `Toro_TimeMaster_PWA_Package.zip` (20,663 bytes). That zip (whose contents are dated 2026-05-19 and are byte-identical, MD5-verified, to the extraction commit below) is the original Toro TimeMaster PWA: a 576-line, 43 KB `index.html` maintenance tracker with **zero network calls** — pages for dashboard, maintenance, log, parts, shop, and diagnostics (`pgDash`, `pgMaint`, `pgLog`, `pgParts`, `pgShop`, `pgDiag`), all localStorage.

Between 2026-05-20 and 2026-06-21 the git record is **completely silent — zero commits for 32 days** — yet the app demonstrably kept evolving: the "full live app source" that lands on June 21 (`0b76d4c`) is a 476 KB, 2,336-line application with B-Hyve irrigation control, NWS weather alerts, a GPS mowing tracker, an ESP32 telemetry pipeline, and code that calls server endpoints (`/api/hours` — with an in-code comment "The endpoint lives on this same site (Cloudflare Pages function at /api/hours)" — and `/api/irrigation`, described in the code as a "worker proxy") that **do not exist anywhere in the repo** at that point. **INFERRED:** that missing month of development happened in claude.ai sessions with the app deployed straight to Cloudflare Pages (`toro1-5rz.pages.dev`) outside version control — which is exactly the history-loss failure mode this record file exists to prevent. The record is silent on what was discussed, built, or spent during those 32 days; the June 21 commits are the moment the project's real state finally got captured in git.

### 2026-06-21 — the repo gets real source, and the Toro app becomes HCC

Four commits, all by Claude, 17:14–20:47 UTC. The first carries the session trailer `Claude-Session: https://claude.ai/code/session_01WuKnDJrDp2n6fHjhtahmLe` and the first two are co-authored `Claude Sonnet 4.6` — so this day's work ran on Claude Sonnet 4.6.

#### `0e7e18d` — 17:14:43 UTC — "Extract Toro TimeMaster PWA package source files"

Full body:

> Unzips the base PWA (TimeMaster maintenance app) into project root as the starting point for the Home Command Center build.

Adds 5 files / 613 insertions: `index.html` (576 lines), `manifest.json`, `service-worker.js`, `icons/icon-192.png`, `icons/icon-512.png`. Note the body already says "Home Command Center" — the intent to build HCC predates the transformation commit by three hours, meaning **the HCC concept was already agreed with Jeff before any of these commits** (the record is silent on the conversation itself). Two things worth flagging: (1) the extracted files are byte-identical to the 2026-05-19 zip contents (MD5-verified against the archived original package), and (2) this extraction was, within ~3 hours, recognized as the wrong starting point — see the next commit.

#### `0b76d4c` — 20:31:18 UTC — "Add full live app source — B-Hyve, weather, GPS, ESP32 integrations"

Full body:

> Replaces the basic maintenance-only package with the complete live app including B-Hyve irrigation control, weather/NWS alerts, GPS mowing tracker, and ESP32 telemetry. Base for Home Command Center build.

One file changed: `index.html`, +2,285/−525 lines — the 43 KB zip-vintage app is thrown away and replaced wholesale with the 476 KB live application. What this version contains (verified by inspecting `0b76d4c:index.html`): title still `Toro TimeMaster 21200`, seven YARD-era tabs (**DASHBOARD / SERVICES / HISTORY / PARTS / DIAGNOSTICS / UPGRADES / SPECS**), a base64-embedded mower photo hero, an irrigation card footed "Live from your Orbit B-hyve • Water Hog" (first appearance of the **Water Hog** name in the record), "B-hyve CONTROL (PIN-gated) — start/stop zones + rain delay", "Orbit B-hyve irrigation — live zones/photos/status from /api/irrigation (worker proxy)", 11 NWS references, 11 ESP32 references, ~36 GPS references (including "GPS distance feeds the Fitness miles walked tracker automatically"), and `var MOWER_ENDPOINT = '/api/hours';`. The server-side halves of those endpoints were NOT committed — the `functions/` directory does not enter git until 2026-06-23 (`c8e729c`). **INFERRED:** this source was captured from the already-deployed live app rather than rebuilt; the commit body's word "Replaces" and the 3-hour gap after the extraction suggest the session (or Jeff) realized the May zip was a month stale.

#### `eb342db` — 20:39:33 UTC — "Transform Toro app into Home Command Center (HCC)" — **the birth commit**

Full body:

> Adds top-level 4-section navigation (YARD / SECURITY / HOME / SAFETY) over the existing app. YARD section wraps all existing Toro/B-Hyve/weather tabs untouched. Security adds Blink camera placeholder tiles and arm/disarm UI. Home lists all planned ESP32 modules with install guide for Home Assistant on Docker. Safety has the panic button, Apple Watch fall-detection status, and the life-safety callout. All JS section switching and panic handler wired.

+271/−7 lines on `index.html`. This is the first appearance of the name in the record. What the diff actually shows:

- Identity change: `<title>` becomes `Home Command Center`; `apple-mobile-web-app-title` becomes `Home CMD`; `application-name` becomes `Home Command Center`; `theme-color` goes from Toro red `#cc0000` to HCC dark `#0a0a14`. Header badge reads `HCC`; header title `HOME COMMAND CENTER` with tagline `MANAGE • MAINTAIN • MONITOR` — the motto is born here.
- A CSS banner comment `HOME COMMAND CENTER — SECTION SWITCHER` introduces `.hcc-snav` and a four-button top nav: **YARD** (🌿), **SECURITY** (📷), **HOME** (🏠), **SAFETY** (🛡️). The architectural rule — the entire existing Toro app is wrapped "untouched" inside `#section-yard` — is the seed of what the next day's commit calls the "app-within-an-app" design.
- **SECURITY section:** a "System Status" card reading "Blink integration — coming next session. Home Assistant will connect your cameras automatically once the brain is set up on your PC," disabled ARM ALL / DISARM ALL buttons, and placeholder camera tiles named **Front Door**, **Back Yard**, **Garage** (all "NOT CONNECTED") plus an "Add Camera" tile. Modules list: **Blink Camera Integration** (badge NEXT), **Gas & Smoke Sensors** — "ESP32 sensors — early warning + certified backup units" (FUTURE), **Garage Door** — "Open/close status + remote control via ESP32" (FUTURE).
- **HOME section** ("Home Systems • ESP32") lists six planned ESP32 device tiles, all marked "ESP32 — FUTURE": **Energy Monitor, Water Monitor, Thermostat, Lighting, Grill Controller, Garage Door**. In hindsight this June 21 wishlist is a near-exact roadmap of what the project actually built over the following two months (water/gas/electric utility monitoring, LUX thermostat, Kasa lighting, SONOFF garage door — per the tip-of-branch CLAUDE.md and docs/). Below the tiles, a "BRAIN STATUS" card: "🧠 Home Assistant — Not Set Up Yet. Your PC (always-on, gigabit fiber) will run Home Assistant in Docker. Once installed, all ESP32 devices connect automatically via ESPHome. Alexa integration is built in." with install steps "1. Install Docker Desktop on your PC 2. Run Home Assistant container 3. Open HA on port 8123 4. Add Blink & ESPHome integrations." **This Docker-on-the-PC plan was abandoned within 24 hours** — see `70416e6` below.
- **SAFETY section:** the big red **PANIC / EMERGENCY** button ("Tap to alert household"), and a modules list that names Jeff's wife for the first time in the record: **Apple Watch — Fall Detection** — "Already ON — calls 911 + contacts automatically. Keep this enabled." (LIVE); **Apple Watch Panic Shortcut** — "Shortcut button on Angela's & Jeff's watches → alerts + siren" (NEXT); **Gas & Smoke Detectors** — "ESP32 sensors for trend monitoring. Keep UL-listed detectors as primary." (FUTURE). Plus the life-safety callout: "⚠️ Life-Safety Note — Apple Watch Fall Detection + Emergency SOS are your primary life-safety net — they call 911 automatically. This app adds…" (line truncated in extraction; the design position is clear: HCC supplements, never replaces, certified life-safety systems).
- The first `hccPanic()` is honest about being a placebo: a `confirm()` dialog saying "EMERGENCY ALERT — This will (once fully wired): • Flash smart lights • Send push notification to Jeff & Angela • Log event with timestamp — Proceed?" followed by an `alert()`: "Panic logged at [time] — Full automation coming once Home Assistant is set up."

#### `6649269` — 20:47:38 UTC — "Embed HCC hero image in app header"

Full body:

> Adds the Home Command Center hero photo (brick ranch at dusk) as a 190px full-width banner between the header and the section nav. Image is base64-embedded so the PWA is fully self-contained with no external dependencies. Gradient overlay + tagline text layered on top.

+11 lines — but those lines include a base64 JPEG that grows `index.html` from 491,587 to 1,107,877 bytes (**+616 KB in one commit**). The banner overlays "MANAGE • MAINTAIN • MONITOR" and, in italic gold, the second HCC motto: **"Everything. In One Place."** The "brick ranch at dusk" is Jeff's house (**INFERRED:** Jeff supplied the photo; the record does not say when or how). The "fully self-contained, no external dependencies" rationale was a deliberate design decision — and it is also the start of a real problem: by the end of June 22 the same reasoning inflates `index.html` to 3.1 MB, and on June 23 a follow-up session has to undo it (`739d004`, "Extract hero photos from HTML — drop from 2.1MB to 295KB") amid service-worker cache trouble. The good and the bad of this decision both start here.

### 2026-06-22 — the Beehive comes online, deploys get "automated," and the house becomes the hero

Eight commits, 17:12–21:54 UTC. The day opens with something rare in this repo: **a commit authored by Jeff himself**.

#### `46be882` — 17:12:21 UTC (12:12 PM CDT) — "Add HCC Beehive setup script - configures HA automations and integrations via REST API" — Jeff's own commit

Author AND committer: `d4c2np9f69-afk <d4c2np9f69@privaterelay.appleid.com>` — no Claude co-author trailer, no session link. **INFERRED:** Jeff added the file through the GitHub web/mobile UI (the single-line, GitHub-style message and the Apple private-relay identity match his May 20 upload commit); most likely the script was generated for him in a Claude conversation and he committed it himself — the record does not say which.

The commit adds `setup-hcc.ps1` (161 lines), a PowerShell script whose header reads:

```
# HCC BEEHIVE SETUP SCRIPT
# Run this on the Beast to configure Home Assistant
```

This is the record's **first use of both nicknames**: the **Beehive** (Jeff's Home Assistant machine — later documented in `docs/BEEHIVE_REFERENCE.md` as a Beelink J45 mini-PC, Intel Pentium J4205, at `192.168.1.66`) and the **Beast** (Jeff's always-on Windows PC — later documented as `301Server`, `192.168.1.194`). The script is written for a beginner, step by step, in Jeff-friendly plain language:

- **Step 1** walks Jeff through creating a Home Assistant long-lived access token on his phone ("Tap your name (bottom left of HA)… Name it 'HCC' and tap OK") and prompts `Paste your HA token here and press Enter`.
- **Step 2** tests the connection to `http://homeassistant.local:8123` with a friendly failure message ("Cannot reach homeassistant.local. Make sure: - The Beehive is powered on - This PC is on the same WiFi/network").
- **Step 3** creates four HA areas matching the app's sections: **Yard, Security, Home, Safety**.
- **Step 4** creates the **panic button automation** — alias "HCC Panic Button", description **"Emergency alert - flashes lights and notifies Jeff and Angela"**, triggered by webhook id **`hcc-panic-button`**, actions: flash all lights (`flash: long`) + persistent notification titled "EMERGENCY ALERT" with "Panic button activated at {{ now().strftime('%I:%M %p') }}".
- **Step 5** creates an "HCC Weather Alert" automation (notify on `weather.home` → lightning / lightning-rainy / exceptional).
- **Steps 6–7** kick off the **B-Hyve** and **ESPHome** config flows via the REST API, telling Jeff to finish credentials in the HA phone app.
- The DONE banner summarizes: "Areas created: YARD / SECURITY / HOME / SAFETY · Panic button: Ready (webhook: hcc-panic-button) · Weather alerts: Active · B-Hyve: Finish credentials in HA app · ESPHome: Finish in HA app · Open HA on your phone to see everything."

The existence of this script means that **between June 21 ~3:40 PM and June 22 ~noon, the Beehive went from "Not Set Up Yet" to a running Home Assistant instance** — the Docker-on-the-PC plan written into the app the day before was never executed. The record inside this window is silent on the hardware acquisition, its price, and the choice of HA OS over Docker; the machine is only identified (Beelink J45) in later documentation.

#### `70416e6` — 17:16:47 UTC — "Update HCC app: Beehive online status, live panic button, remove placeholder text"

No body beyond the subject; the diff (+25/−15 on `index.html`) tells the story — pushed four minutes after Jeff's commit, it rewrites the app to reflect the now-live Beehive:

- SECURITY status card flips from blue "coming next session" to green: **"🤗 Beehive Online — Home Assistant Running. Your Beehive brain is live. Add Blink cameras in Home Assistant to see them here."** with a new working button **"OPEN BEEHIVE ↗"** → `http://homeassistant.local:8123`. The Blink module row becomes a tappable setup shortcut ("Tap to open Beehive → Settings → Add Integration → Blink", badge `SETUP ↗`).
- The HOME "BRAIN STATUS" card is rewritten: **"🤗 Beehive Online — Home Assistant 18.0. Your dedicated Beehive brain PC is running Home Assistant OS."** — explicit, in-app confirmation that the June 21 plan ("Your PC… will run Home Assistant in Docker") was replaced by a **dedicated PC running Home Assistant OS**. The install steps become ESP32 connection steps ("1. Open Beehive at homeassistant.local:8123 2. Settings → Add-ons → ESPHome Device Builder 3. Your mower sensor appears automatically…").
- `hccPanic()` **goes live**: it now `fetch()`-POSTs to `http://homeassistant.local:8123/api/webhook/hcc-panic-button` with `{triggered: t, source: 'HCC App'}` — the exact webhook Jeff's script created minutes earlier. Success: "⚠️ PANIC TRIGGERED at [t] — Beehive notified. Lights flashing." Failure is handled with the project's characteristic safety-first honesty: "⚠️ Panic logged at [t] — Note: Beehive not reachable from this network. **If emergency, call 911.**"

#### `c797f79` — 17:17:11 UTC — "Add HCC Beehive setup script"

Despite the "Add" subject, the diff is a **1-line cosmetic change** to `setup-hcc.ps1` (widening the `=====` banner to `=====================================`). **INFERRED:** the cloud session had prepared its own copy of the script and went to commit it, found Jeff had already pushed the identical file five minutes earlier, and the only surviving delta was the banner line — a tiny, benign two-Claude/Jeff collision on the same branch, of the kind the project later made formal coordination rules about (CLAUDE.md's cloud-vs-coworker ownership split, 07-09).

#### `8fdae39` — 17:19:28 UTC — "Add auto-deploy GitHub Action to Cloudflare Pages" — the Action that never worked

Adds `.github/workflows/deploy.yml` (24 lines): on push to `claude/time-master-project-liq1jw` or `main`, run `cloudflare/pages-action@v1` with `apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}`, `accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`, `projectName: toro1-5rz`, `directory: .`. Two defects were baked in at birth:

1. **Wrong project name.** `toro1-5rz` is the *pages.dev subdomain* (`toro1-5rz.pages.dev`), not the Cloudflare Pages *project name*, which is `toro1`. Caught and fixed 39 minutes later.
2. **The `CLOUDFLARE_API_TOKEN` secret was never created in the GitHub repo — not that day, not ever.** The very first CLAUDE.md (June 23, `e8f0312`) already records the permanent verdict: "**GitHub Actions is BROKEN** — `CLOUDFLARE_API_TOKEN` secret is not set in the GitHub repo. Every Actions run fails with: `##[error]Input required and not supplied: apiToken` … Do NOT try to fix this — it is irrelevant." The workflow never deployed a single byte. Real deploys were (and remained) Cloudflare Pages' **native Git integration** watching the branch — live within ~60 seconds of every push. The dead workflow was left firing-and-failing on every push for six more weeks until `ac99b33` (2026-08-06) finally neutered it, with this epitaph in the commit body: "This workflow has never worked… every push to the branch failed instantly and sent Jeff a failure email — **124 of them in the past week alone**, dozens on 08-06 by itself. It was the single largest source of mail in his inbox." Trigger was changed to manual-only rather than deleting the file.

#### `1d7cacc` — 17:58:15 UTC — "Fix Cloudflare Pages project name to toro1"

The 1-line fix for defect #1 above: `projectName: toro1-5rz` → `projectName: toro1`. (It made the workflow *correct* but not *working* — the missing secret still doomed every run.)

#### `c36f2ab` — 19:01:13 UTC — "Make house the main hero; move mower into YARD section"

Full body:

> Each HCC section is an app-within-an-app: the house photo is now the persistent top hero, and the Toro mower photo, specs, and LOG MOW buttons live inside the YARD section.

This is the identity restructure — the **"app-within-an-app"** phrase enters the record here. The diff (+24/−21) removes the Toro spec strip and action buttons from the *global* header and relocates them inside `#section-yard`. The relocated block preserves the mower's vital statistics verbatim, worth recording because they are the project's founding hardware facts: **Model 21200 · Serial 401338948 · Engine B&S 14D935 · Purchased 2018-04-11 · Hour Meter 2.5 HRS (the then-current default; Jeff's real figure was captured as 5.9 hrs in his 2026-06-22 data backup, per the June 23 CLAUDE.md) · Condition 99%**, plus the LOG MOW / LOG SERVICE / UPDATE HOURS buttons. From this commit forward, the house — not the mower — is the face of the app; the mower is one tenant among several.

#### `12308ff` — 19:06:29 UTC — "Set app icon to house photo; app name HCC"

Full body:

> Replace PWA/apple-touch icon with the home photo (clean, no overlay lettering). Home-screen app name set to HCC; manifest name Home Command Center.

Only 3 changed lines — but because the house photo is embedded base64 in both the apple-touch-icon link and the data-URI manifest, `index.html` **triples from 1,108,956 to 3,109,747 bytes**. The home-screen name becomes `HCC` (from `Home CMD`). The Toro-branded icons ("TORO" wordmark SVG and the old red icons) are gone from the phone's home screen; the app on Jeff's phone now looks like his house and is called HCC. This is also the moment the self-contained-base64 decision reaches its logical extreme — a 3.1 MB single HTML file — which the June 23 session pays for (blank-page/service-worker cache fallout and the hero-photo extraction, `739d004`, `8497827`).

#### `e7b6c64` — 21:54:12 UTC — "Add HACS auto-installer script for Beast"

Adds `install-hacs.ps1` (110 lines): "HCC - HACS + B-Hyve Auto Installer — Run this on the Beast to install HACS on the Beehive." Purpose (per its own final instructions): get **HACS** (the Home Assistant Community Store) onto the Beehive so Jeff can install the **B-Hyve custom integration** ("HACS sidebar appears - search B-Hyve - install it") — B-Hyve isn't a core HA integration, which is presumably why the config-flow attempt in `setup-hcc.ps1` Step 6 wasn't sufficient (**INFERRED**; the record does not narrate the failure). Notable contents:

- **The script hard-codes the Beehive's IP:** `$HA_IP = "192.168.1.66"` — a retreat from `homeassistant.local` used in the morning's script. **INFERRED:** mDNS resolution of `homeassistant.local` was failing from the Beast; the very next day's commit `c1c004c` ("Auto-detect Beehive by IP when homeassistant.local fails", 06-23) confirms this was a real, recurring problem. `192.168.1.66` remains the Beehive's fixed IP to this day (tip `docs/inventory/NETWORK_MAP.md`).
- **Step 1 adds a Windows firewall rule** ("Home Assistant HCC", outbound TCP to `192.168.1.66:8123`) — evidence the Beast couldn't initially reach the Beehive at all.
- Steps 2–3: token prompt (same phone walkthrough) and connection test.
- Steps 4–6: install and start the **Terminal & SSH add-on** (`core_ssh`) via the Supervisor API, then push `wget -O - https://get.hacs.xyz | bash -` into the add-on's **stdin API** — a genuinely creative way to run a shell installer on an appliance OS from a Windows PC without Jeff ever opening a terminal.
- Step 7: restart HA; then phone instructions: add the HACS integration, "Authorize with GitHub", install B-Hyve.

The record in this window does not say whether the script ran successfully that evening; the June 23 session's commits (`a463d09` "Add /setup endpoint that serves install script directly", `686bece` "Switch Step 3 copy command from curl to wget for HA Terminal compatibility", `c1c004c`) show the install tooling continued to be fought with the next day. HACS itself was certainly installed eventually — the whole later project (B-Hyve via HACS, `alexa_media_player`, Water-Monitor, SmartHub energy, LLM Vision are all HACS integrations per tip docs) stands on it.

### What existed at the close of 2026-06-22

A phone app named **HCC** with Jeff's house as its icon and hero, four sections (YARD holding the entire live Toro/B-Hyve/weather/GPS app, SECURITY, HOME, SAFETY), a panic button wired to a real Home Assistant webhook on a running dedicated **Beehive** (HA OS, `homeassistant.local` / `192.168.1.66`), two operator scripts for the **Beast**, a deploy workflow that looked like automation but never worked, and an `index.html` that had grown 72× (43 KB → 3.1 MB) in two days. No CLAUDE.md yet — persistent memory arrives June 23 (`e8f0312`), *after* (and partly because of) the chaos that followed this window. Also worth preserving from the immediately-adjacent record: Jeff's data backup taken this day (2026-06-22) captured his real engine hours (**5.9 hrs**), his 7-entry maintenance log (all dated 2026-05-31 at 3.5 hrs: Cable Inspection, Clear Coat Entire Mower, New Mulching Gator Blades, Battery Charge, Post-Mow Cleanup, Pre-Mow Safety Check, Mow #3 — 1.0 hr, 4.0 mi), and the project's first recorded purchase price: **New Mulching Gator Blades — $31.85 — 2026-05-31** (documented in CLAUDE.md `e8f0312`/`90e556e`).

### Decisions made or rejected in this period

1. **Put the real live app under version control** (`0e7e18d` then `0b76d4c`, 06-21). The May 20 zip was extracted as the base and then discarded within ~3 hours in favor of the complete live source. Implicit never-again: development had run 32 days with zero commits; from this window on, the app's source lives in git (636 commits by 08-16). The `main` branch was left holding only the zip — later codified in CLAUDE.md: "**`main` branch:** contains only `Toro_TimeMaster_PWA_Package.zip` — do NOT use it for deploys."
2. **The HCC concept itself** (`eb342db`, 06-21): wrap the Toro app in a top-level 4-section shell — **YARD / SECURITY / HOME / SAFETY** — leaving the existing app "untouched" inside YARD. Formalized next day as "Each HCC section is an app-within-an-app" (`c36f2ab`). This architecture (renamed/regrown into HOME / WEATHER / IRRIGATION / YARD by 06-23, and six sections incl. GUARDIAN and CAR by August) is the project's spine ever since.
3. **Life-safety hierarchy** (`eb342db`): Apple Watch Fall Detection + Emergency SOS are "your primary life-safety net"; ESP32 gas/smoke sensors are for trend monitoring only, with the explicit rule "**Keep UL-listed detectors as primary**"; the panic button's failure path says "**If emergency, call 911**" (`70416e6`). HCC supplements, never replaces, certified safety systems.
4. **Base64-embed all images so the PWA is "fully self-contained with no external dependencies"** (`6649269`, extended by `12308ff`). Deliberate — and effectively **reversed the next day** when `index.html` hit 3.1 MB and the June 23 session extracted the photos to an `images/` directory (`739d004`: "drop from 2.1MB to 295KB"). A decision made and unmade within 48 hours.
5. **REJECTED / superseded within 24 hours: Home Assistant in Docker on Jeff's always-on PC** (`eb342db`, 06-21: "Your PC (always-on, gigabit fiber) will run Home Assistant in Docker"). By 06-22 noon the app instead reports "Your **dedicated Beehive brain PC** is running **Home Assistant OS**" (`70416e6`). The record inside the window is silent on the hardware purchase and its price; later docs identify it as the Beelink J45 (Pentium J4205, ~8GB/128GB, `192.168.1.66`).
6. **The naming scheme** — **HCC / Home Command Center** (`eb342db`), motto **"MANAGE • MAINTAIN • MONITOR"** and **"Everything. In One Place."** (`eb342db`/`6649269`), **Beehive** for the HA machine and **the Beast** for Jeff's PC (`46be882`, `e7b6c64`), webhook **`hcc-panic-button`**, HA areas **Yard/Security/Home/Safety**. All still in use at branch tip.
7. **House-as-identity** (`c36f2ab` + `12308ff`, 06-22): the house photo is the persistent hero and the app icon; the mower's photo, spec strip (Model 21200, Serial 401338948, B&S 14D935, purchased 2018-04-11), and LOG buttons are demoted into the YARD section; home-screen name **HCC**.
8. **Auto-deploy via GitHub Actions** (`8fdae39` + `1d7cacc`, 06-22) — adopted on paper, **never functional** (secret never set), officially declared "BROKEN… Do NOT try to fix this — it is irrelevant" in the first CLAUDE.md (06-23) and disabled 08-06 after the 124-emails-a-week flood. The real pipeline, then and now: Cloudflare Pages native Git integration → `toro1-5rz.pages.dev` in ~60 seconds. Standing rule at tip: "GitHub Actions is broken and irrelevant… do not try to fix, it doesn't matter."
9. **Beginner-first operator tooling** (`46be882`, `e7b6c64`): everything Jeff must run is a single PowerShell script with phone-level, step-by-step instructions, colored output, and graceful failure text — a house style that persists across the project's later scripts.
10. **HACS as the integration route for B-Hyve** (`e7b6c64`), installed remotely via the Terminal/SSH add-on stdin API rather than asking Jeff to use a terminal.

### Problems, failures & root causes in this period

1. **The repo's base was a month stale.**
   - *Symptom:* the extracted zip (`0e7e18d`) was a 43 KB offline maintenance app while the deployed reality was a 476 KB connected app.
   - *Root cause:* 32 days (05-20 → 06-21) of development in chat sessions deployed straight to Cloudflare with nothing committed — the project's original history-loss wound; that missing month is unrecoverable from git.
   - *Fix:* `0b76d4c` same day, landing the full live source. Residual gap: the server functions (`/api/hours`, `/api/irrigation`) referenced by that source still weren't in the repo and didn't arrive until 06-23 (`c8e729c`).
2. **The GitHub Action that never worked.**
   - *Symptom:* every push triggers "Deploy HCC to Cloudflare Pages" and every run fails instantly.
   - *Wrong attempt #1:* `projectName: toro1-5rz` (the subdomain, not the project) — fixed in 39 minutes (`1d7cacc`).
   - *Real root cause:* the `secrets.CLOUDFLARE_API_TOKEN` repo secret was **never created** — every run died with `##[error]Input required and not supplied: apiToken` (documented in CLAUDE.md `e8f0312`, 06-23).
   - *Fix:* none in this period, deliberately ("do not try to fix, it doesn't matter" — deploys worked via Cloudflare's native Git integration). Final resolution 08-06 (`ac99b33`): trigger changed to manual-only after the failure emails became "the single largest source of mail in his inbox" (124 in one week).
3. **Self-contained base64 images blew up the app file.**
   - *Symptom:* `index.html` grew 43 KB → 476 KB → 1.1 MB (`6649269`) → **3.1 MB** (`12308ff`) in two days.
   - *Root cause:* the "fully self-contained, no external dependencies" embedding decision applied to full-resolution photos, twice over (hero + icon/manifest copies).
   - *Fix:* next day, outside this window — `739d004` extracted heroes to `images/` (2.1 MB → 295 KB) and `8497827` force-bumped the service-worker cache; the bloat also contributed to the 06-23 stale-cache and blank-page firefighting.
4. **Beast could not reach the Beehive reliably.**
   - *Symptom:* morning script targets `homeassistant.local`; by evening `install-hacs.ps1` hard-codes `192.168.1.66` and its Step 1 adds a Windows outbound firewall rule for `8123`.
   - *Root cause(s):* Windows firewall blocking outbound to the Beehive, and (**INFERRED** from the hard-coded IP plus 06-23's `c1c004c` "Auto-detect Beehive by IP when homeassistant.local fails") flaky mDNS resolution of `homeassistant.local` on Jeff's network.
   - *Fix:* firewall rule + fixed-IP addressing in this window; IP-fallback auto-detection the next day. The Beehive kept `192.168.1.66` as a fixed address permanently.
5. **The panic button was a placebo for its first day.**
   - *Symptom:* `eb342db`'s `hccPanic()` only showed a confirm + alert ("Full automation coming once Home Assistant is set up").
   - *Root cause:* no brain existed yet to receive it.
   - *Fix:* within a day — Jeff's `setup-hcc.ps1` created the `hcc-panic-button` webhook automation on the live Beehive (`46be882`) and `70416e6` wired the app's button to actually POST to it, with a call-911 fallback message. (The *full* HA-side alarm — siren, Zigbee sensors — remained a pending item into August per tip CLAUDE.md; but the webhook path was born here.)
6. **Duplicate-work collision on `setup-hcc.ps1`.**
   - *Symptom:* `c797f79` ("Add HCC Beehive setup script") lands 5 minutes after Jeff's identical `46be882`, changing only a cosmetic banner line.
   - *Root cause (INFERRED):* Jeff and the Claude session both held copies of the same generated script and both committed; git de-duplicated everything but one line. A harmless preview of the two-actors-one-branch coordination problem the project later regulated explicitly (coworker-vs-cloud ownership rules in CLAUDE.md, 07-09).


---

## Chronicle: 2026-06-23 → 2026-06-24 — the Great Blank Page and the Big Fix session

This two-day window contains **61 commits** on `origin/claude/time-master-project-liq1jw` (2026-06-23 01:28 UTC → 2026-06-24 17:49 UTC). It is the emotional low point and the turning point of the entire project. In roughly 40 hours the app was rebuilt into its 4-section form, went **completely blank** in Jeff's hands, was resurrected, lost and regained Jeff's real engine hours, gained its first persistent memory file (CLAUDE.md), absorbed Jeff's verbatim frustration message as a permanent directive, got a physical backups folder, reached **66/66 Playwright tests passing**, was repainted in the warm gold "Premium Estate Command Center" palette, and ended with a hand-built custom Home Assistant integration written to route around Cloudflare's IPs being blocked by Orbit's B-Hyve API. Nearly all of it carries the session trailer `Claude-Session: …session_01WuKnDJrDp2n6fHjhtahmLe` — one long continuous session (with Claude Opus 4.8 credited on many commits).

Context immediately before the window: the previous commits were `12308ff` (2026-06-22 19:06, "Set app icon to house photo; app name HCC") and `e7b6c64` (2026-06-22 21:54, "Add HACS auto-installer script for Beast") — the app had just been rebranded from a Toro-only PWA to the Home Command Center, and the Home Assistant box (called "Beast" on 06-22, renamed "Beehive" in this window's commits) was being set up.

### 2026-06-23, 01:28 — warm-up: live weather on the hero (a53df54)

`a53df54` (2026-06-23 01:28:50) — *Add live weather to hero, YARD quick-access shortcuts, improved Blink status*. The hero banner started showing live temperature + a weather icon fed from the existing weather load; the YARD section got IRRIGATION / WEATHER / MOWER quick-tap shortcuts; Blink cameras showed "PENDING with note that HA fix is merged and coming"; and an `hccScroll` helper was added for smooth scroll. A quiet start before a very loud day.

### 10:20 — all four API endpoints were dead; Pages Functions to the rescue (c8e729c)

`c8e729c` (2026-06-23 10:20:33) — *Fix all 4 broken API endpoints + unified design layer*. This is the "4 broken API endpoints" landmark. The commit body:

> Add Cloudflare Pages Functions for /api/weather, /api/alerts, /api/irrigation, and /api/irrigation/control — all four were returning errors because no Workers existed. Functions now live in functions/api/ and deploy automatically with the Pages project.
>
> Weather uses open-meteo.com (no key required, maps to station format). Alerts proxy NWS active alerts for lat=36.477, lon=-86.66. Irrigation GET/POST connect to Orbit B-Hyve via their unofficial API.

Diffstat: `functions/api/alerts.js` (+38), `functions/api/irrigation/control.js` (+146), `functions/api/irrigation/index.js` (+77), `functions/api/weather.js` (+58), plus 183 lines into `index.html` — 499 insertions total. The same commit added "a final design layer — single Archivo font everywhere, unified dark-glass card style, section-specific accent colors, premium header/hero/nav/button styling, consistent spacing." (The Archivo dark-glass look would be replaced by the warm-gold serif palette 28 hours later — see `c17bdf0`.)

### 11:19 — the 4-section rebuild… which planted the blank-page time bomb (f599bd9)

`f599bd9` (2026-06-23 11:19:07) — *Rebuild HCC PWA with 4-section layout: HOME / WEATHER / IRRIGATION / YARD*. A massive restructure: `index.html` 904 insertions / 1026 deletions (net ~1930 lines churned). From the body: house hero photo always visible at top above section nav; HOME = Security cameras, Smart Home ESP32, Safety/Emergency; WEATHER and IRRIGATION got gradient placeholder heroes; YARD kept the Toro mower photo hero "with full spec strip and all 7 tabs"; section heroes hidden by default inside `.hcc-section` divs; new Archivo/dark-glass CSS design system; per-section accent colors; and "Preserved all existing JS (mower logs, weather load, irrigation load, etc.)".

**Evidenced finding about the blank page's true origin:** inspecting the `index.html` snapshots on either side of this commit shows its parent `c8e729c` had two *balanced* script blocks (`<script>` at 1332→`</script>` 2610, `<script>` 2611→`</script>` 2809), while `f599bd9` has **three `<script>` opens and only one close** (`<script>` at 1159, bare `<script>` at 2438 and 2638, single `</script>` at 2686). The rebuild merged the blocks but left two stray `<script>` tags inside the now-single JS block. This is the exact defect fixed nine hours later in `a973c8f`. Note that CLAUDE.md as rewritten at `90e556e` attributes the incident to "commit `8497827`" — but `8497827`'s diffstat touches only `service-worker.js` (5 insertions, 2 deletions), so it cannot have introduced the tags; the snapshot evidence points to `f599bd9`. The record file itself is slightly wrong on this point.

### 11:22–11:35 — the hero photo series begins (9dc9cb9, b7395b6)

- `9dc9cb9` (11:22:58) — *Replace YARD section hero with new professional mower photo*: "Dramatic dusk shot of Toro TimeMaster with backyard lighting — replaces the original mower image. Sets the visual tone for the crisp hero series."
- `b7395b6` (11:35:37) — *Add irrigation section hero photo*: "Golden hour shot with sprinklers, irrigation controller, and backyard — matches the visual style of the YARD hero for a consistent series. Replaces the CSS gradient placeholder."

These were embedded as base64 in the HTML — which would blow up the page size and choke mobile browsers by evening (see `739d004`).

### 11:44 — /api/hours created, service worker hcc-v2, HCC branding (4f96d09)

`4f96d09` (11:44:34) — *Fix missing /api/hours, stale service worker cache, and manifest branding*. Added `functions/api/hours.js` ("returns zeroed stub when ESP32 sensor not yet deployed; supports POST from sensor when it arrives; uses KV store if HCC_KV binding is configured" — note the variable name `HCC_KV`, which would become the day's second-biggest villain). Bumped the service worker cache to hcc-v2 with "always network-first for /api/* routes so weather/irrigation never go stale," and rebranded `manifest.json` "from Toro TimeMaster to Home Command Center."

### 12:05 — invisible legend dots and silently-dropped sensor data (4c52e85)

`4c52e85` (12:05:28) — *Fix missing CSS variables, card accent colors, and sensor panel DOM rows*. Three classes of quiet rot fixed: missing `--c-fitness` (#a855f7) and `--c-weather` (#38bdf8) tokens meant dashboard legend dots "were invisible before"; card-title accent bars for six categories were "falling back to red"; and — most telling — "Add missing sensor DOM rows: pitch/roll, vibration, shock events, tip risk, WiFi signal, ESP temp — JS already populated these but the HTML elements didn't exist so data was silently dropped."

### 12:15 — the B-Hyve WebSocket double-auth bug (5521d3e)

`5521d3e` (12:15:06) — *Fix B-Hyve WebSocket double-auth bug in irrigation control*. Root cause, verbatim from the body:

> The auth message was being sent twice: once immediately on connect (correct) and again inside the message handler when the server confirmed auth (wrong). The double-send caused the B-Hyve server to ignore the actual command.
>
> Fixed protocol flow:
> 1. Connect to WebSocket
> 2. Send auth ONCE immediately
> 3. When server confirms auth, send the actual command (exactly once)
> 4. Wait for server acknowledgment (change_mode / watering_in_progress / rain_delay)

Also: `rain_delay` added to accepted ack events, tightened `ws.close()` error handling, removed an unused `deviceId` parameter.

### 12:26–13:35 — the Beehive install.sh saga (75a7afd → 686bece)

Six commits in 70 minutes chronicle the fight to get Home Assistant ("Beehive") set up **without a Windows PC** and without asking Jeff to be a sysadmin:

1. `75a7afd` (12:26:45) — *Add complete Beehive brain setup — no Windows required*. A big drop: `beehive/install.sh` (runs from the HA Terminal SSH add-on — "bash, no PowerShell" — installs HACS, writes the full HCC HA package to `/config/packages/hcc.yaml`, patches `configuration.yaml`, installs ESPHome via `ha` CLI); `beehive/packages/hcc.yaml` (input_numbers for mower hours/battery, template sensors, panic-button webhook automation that "flashes all lights + notification," mower sensor ingestion webhook, irrigation-started notification, severe weather alert, fall freeze/winterize reminder, stop-all-irrigation and good-night scripts); and `beehive/esphome/hcc-mower.yaml` — a complete ESP32 firmware config: engine hours via integration sensor on RPM pulse counter, battery via ADC (100k/10k divider), RPM via pulse counter on ignition, GPS position + distance via u-blox NEO-6M with haversine accumulation, pitch/roll via MPU-6050, vibration magnitude + shock event counting, WiFi RSSI, ESP32 internal temp, HTTP POST to /api/hours every 90 s while engine running. `functions/api/hours.js` also learned to forward ESP32 POSTs to a Beehive HA webhook ("non-fatal if HA offline").
2. `b3d773c` (12:33:06) — *Add one-tap Beehive auto-setup wizard to HCC app*. The dream version: "No terminal. No typing commands. No reporting back." HOME auto-pings Beehive at `homeassistant.local:8123`, live status dot (yellow/green/red), real HA version from the API, inline token field ("one paste, saved forever in localStorage, never leaves the device"), a "SETUP BEEHIVE" button creating automations via HA REST API from the browser, progress log with checkmarks, "All of this runs while Jeff is on home WiFi — zero shell commands needed."
3. `1f3ce1a` (13:00:58) — *Fix Beehive setup — correct commands for the ha > CLI, curl not wget*. Reality bites, twice: "The ha > screen is the HA OS supervisor CLI, not bash. It only understands ha subcommands — wget does not exist there." And the one-tap wizard died on mixed content: "replace broken one-tap REST API setup (HTTPS→HTTP blocked) with 3-step instructions showing correct commands for each prompt." install.sh switched wget→curl and fixed a `${NC}` → `${N}` typo throughout.
4. `c1c004c` (13:08:38) — *Auto-detect Beehive by IP when homeassistant.local fails*. "Windows does not support mDNS so homeassistant.local never resolves." checkBeehive now tries the hostname then falls back to the direct IP `192.168.1.66:8123` — "whichever responds first wins and is stored in localStorage for all future calls."
5. `a463d09` (13:24:29) — *Add /setup endpoint that serves install script directly*. "Cloudflare Pages does not reliably serve .sh files as static assets." A Pages Function embeds the full script and returns it as text/plain so `curl -fsSL https://toro1-5rz.pages.dev/setup | bash` works from the HA Terminal add-on.
6. `686bece` (13:35:50) — *Switch Step 3 copy command from curl to wget for HA Terminal compatibility*. No body — the curl/wget pendulum swung back: the Terminal add-on (a different environment than the `ha >` supervisor CLI) had wget but not curl. Within 35 minutes the same install pipeline had been switched wget→curl and then curl→wget for two different shells. This whiplash returns on 06-24 with BusyBox (`a744651`).

### 19:37–19:45 — 2.1 MB of base64 chokes mobile (739d004, 8497827)

After a ~6-hour gap (INFERRED: Jeff testing on his phone in the afternoon and reporting the YARD section dead), the evening began with the page-weight discovery:

`739d004` (19:37:59) — *Extract hero photos from HTML — drop from 2.1MB to 295KB*:

> Three base64 JPEGs embedded in the HTML were making the page 2.1MB. Mobile browsers were choking on the DOM size, causing the YARD section to appear blank/dead when tapped.

The images moved to static files: `hero-home.jpg` (451KB, "home house night shot"), `hero-irr.jpg` (492KB, "irrigation golden hour"), `hero-yard.jpg` (377KB, "Jeff + TimeMaster mower"). "HTML drops from 2.1MB to 295KB. All sections load instantly."

`8497827` (19:45:30) — *Bump service worker to hcc-v3 — force cache clear of 2.1MB old build* (service-worker.js only, no body).

**INFERRED:** the 2.1 MB diagnosis was at best partial. The stray `<script>` tags from `f599bd9` (11:19) meant the page's JavaScript had been fatally broken all afternoon — the "blank/dead YARD section" symptom had two contributing causes stacked on top of each other, and the true one wasn't found until 20:23.

### 20:23 — THE BLANK PAGE, root-caused (a973c8f)

`a973c8f` (2026-06-23 20:23:24) — *Fix fatal JS syntax error — remove stray `<script>` tags inside script block*. The defining bug of the project, in the commit's own words:

> Two bare \<script\> tags were embedded inside an already-open \<script\> block (lines 2488 and 2688). The HTML parser passes them as literal text to the JS engine, which throws a SyntaxError — killing ALL JavaScript on the page. That's why the whole app went blank.

The diff shows exactly what was removed: a bare `<script>` line before `/* ===== Engine Hour Sensor sync (added) ===== */` at ~2488 and another before the "Wire up new section hero updates" block at ~2688. The commit also bumped the service worker to hcc-v4 and switched image caching to `Promise.allSettled` "so a missing hero photo can't prevent the SW from installing." This incident was immediately canonized: CLAUDE.md (created 69 minutes later) names it "**the great blank-page incident of 2026-06-23**" and enshrines rule #8 — never put `<script>`/`</script>` tags inside the JS block — permanently.

### 20:55–21:09 — sensor dead: the HCC_KV vs MOWER_KV chase, a revert, and Jeff's 5.9 hours restored

The app was back, but the sensor panel showed all `—` and `0.00 V`, despite Jeff having bench-tested the ESP32 box successfully "10+ times" before this session (vibration and RPM both registered — recorded in CLAUDE.md). Four rapid commits:

1. `98b8dca` (20:55:07) — *Fix sensor API — accept MOWER_KV binding as fallback for HCC_KV*: "The Cloudflare account has a KV namespace named MOWER_KV but the API was only checking env.HCC_KV. Both names are now tried so the binding works regardless of which variable name was set in Pages settings."
2. `fe1edb8` (21:03:16) — *Add engine-off heartbeat and improve sensor status display*: ESPHome firmware to POST battery/WiFi/temp every 5 min with engine OFF "so the dashboard can confirm the box is alive while parked"; three distinct status messages ("Sensor box not connected yet" / "Engine off · Box connected · Battery X.XX V" / normal readout).
3. `b629c83` (21:08:31) — ***Revert** hours.js to original — undo KV refactor that may have broken sensor read*: "Returning to the exact version that was working during bench test. Only env.HCC_KV is checked, exactly as before." A defensive retreat five minutes after the change — uncertainty about what broke the sensor was running high, so the known-good bench-test version was restored first, ask questions later.
4. `53eb7d4` (21:09:57) — *Restore Jeff's real hours — update default state and sensor baseline to 5.9h*: "Backup from June 22 shows 5.9 engine hours. **Browser data was cleared which wiped localStorage.** Default state now starts at 5.9h so the correct number shows on every fresh install. Sensor baseline updated to match." Jeff's real, physical mowing history had vanished from the app because the state lived only in localStorage — this is precisely the class of loss (data/history evaporating between sessions) that motivated everything that followed.

### 21:32 — CLAUDE.md is born (e8f0312), and the KV dual-check returns (c6f3df8)

`e8f0312` (2026-06-23 21:32:20) — *Add CLAUDE.md — persistent project memory for all future AI sessions*. The commit body: "Complete state document covering: architecture, deployment pipeline, Cloudflare KV binding, engine hours baseline, sensor field mapping, known issues, git history, critical rules (never ask Jeff for creds), and step-by-step instructions for testing and debugging. Any Claude session reading this file can pick up the project cold without asking Jeff to re-explain anything."

The first CLAUDE.md (readable at `git show e8f0312:CLAUDE.md`) opened with:

> **READ THIS FIRST.** This file is the single source of truth for any AI session working on this project. Do not guess. Do not ask Jeff to re-explain. Everything you need is here.

Its original five "Critical Rules (Never Break These)":

> 1. **NEVER ask Jeff for credentials** — Cloudflare API token, KV IDs, WiFi passwords, HA tokens are all already configured. Reference them from this file.
> 2. **NEVER suggest hiring an IT person.**
> 3. **NEVER make excuses or blame unclear history** — read this file and the git log.
> 4. Commands must work the first time. Test before telling Jeff to run something.
> 5. When in doubt, check git log and this file before touching anything.

It also documented the infrastructure precisely (KV namespace `MOWER_KV`, ID `ec5b28597d9c4fb9b182b1aea1d50eff`, bound as `HCC_KV` in Pages; KV key `hours_data`; Pages project `toro1`; live URL `toro1-5rz.pages.dev`; GitHub Actions BROKEN because `CLOUDFLARE_API_TOKEN` secret is unset — real deploys via Cloudflare Pages native Git integration), Jeff's data (5.9 hrs as of the 2026-06-22 backup; the 7 maintenance-log entries all dated 2026-05-31 at 3.5 hrs: Cable Inspection, Clear Coat Entire Mower, New Mulching Gator Blades, Battery Charge, Post-Mow Cleanup, Pre-Mow Safety Check, Mow #3 at 1.0 hr / 4.0 mi; purchase history "New Mulching Gator Blades — $31.85 — 2026-05-31"), the full ESP32 JSON field list, an honest "Known Issues / Active Investigation" section on the dead sensor (listing what changed, what "should not affect sensor," and the two most-likely causes), the curl POST/GET test for the KV pipeline, and Jeff's contact info.

`c6f3df8` (21:35:13) — *Fix KV binding — try both HCC_KV and MOWER_KV variable names* — re-applied the dual-check reverted 27 minutes earlier in `b629c83`, this time framed as deliberate policy: "Cloudflare Pages may have the KV namespace bound under either name depending on how it was set up in the dashboard. This makes the sensor API work regardless of which variable name is configured." The later CLAUDE.md rewrite hardened this into: "The `getKV(env)` helper … tries `env.HCC_KV || env.MOWER_KV` — this covers both names. **Do NOT remove this dual-check.**"

### 23:45–23:55 — GPS track vanishing, and the modal-button catastrophe (20df8da, da1320c, e904a5b)

- `20df8da` (23:45:07) — *Fix GPS track disappearing after heartbeat sync*: "Save track to S.sensorTrack in localStorage when real GPS points arrive. Fall back to saved track when a heartbeat (no track data) comes in, so the yard map stays visible after the mow ends. Bump SW to hcc-v5." (Jeff's mowing track was being erased the moment the engine shut off and the first heartbeat arrived with no `track` field.)
- `da1320c` (23:50:27) — *Fix all modal buttons broken — restore correct CSS class names*: "CSS was using .modal-overlay.open but the HTML div uses modal-ov and JS sets class 'show'. **Every Log Mow / Log Service / Update Hours button was silently doing nothing.** Restored .modal-ov.show to match." The app's core data-entry features had been dead without any error.
- `e904a5b` (23:55:07) — *Fix all broken CSS — restore modal-box, mbtns, mbtn secondary, btn-green*: "Diagnostic revealed 4 CSS rules missing from current code that existed in the original app: .modal-box (inner modal box had no background, border-radius, or padding), .mbtns (button row had no flex layout — buttons stacked weirdly), .mbtn.secondary (Cancel buttons were completely unstyled), .btn-green (Export and Log Purchase buttons had no green background). All confirmed present and matching their HTML class usage. Diagnostics show zero missing CSS classes, zero missing functions, zero stray script tags." `e904a5b` became the pinned "verified working" commit — CLAUDE.md records **66/66 Playwright tests PASSING** as of it, and the backup branch `backup/verified-working-2026-06-24` was pinned to it. (Note a record-keeping wrinkle: the 90e556e CLAUDE.md's session-history list describes `e904a5b` as "Fix GPS persistence, restore all modal CSS, fix KV binding dual-check" — but the actual `e904a5b` diff is 5 insertions / 2 deletions of CSS in index.html; the GPS fix was `20df8da` and the KV dual-check was `c6f3df8`. The memory file compressed three commits into one label.)

### 2026-06-24, 00:34 — the CLAUDE.md rewrite: Jeff's frustration message becomes law (90e556e)

`90e556e` (2026-06-24 00:34:02) — *Rewrite CLAUDE.md — comprehensive persistent memory with Jeff's rules, project plan, and full session history* (270 lines changed: +200/−70). The commit body: "Incorporates Jeff's verbatim frustration message as a permanent directive, adds mandatory pre-session checklist, documents all bugs fixed in session 2026-06-23/24, captures current verified state (66/66 tests passing), and outlines pending items for next session."

The rewritten file opens with a new section, "**Jeff's Message — Read This Every Single Session**," introduced with "Jeff said this verbatim and it must be respected permanently." Jeff's words, in full:

> "You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct. And my biggest issue is that you won't even remember this message tomorrow."

> "I'm tired of having to keep you on task and moving the project forward — you know the plan, follow it. Save this and remember it and read it before you do anything."

> "I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learning… but you are making it real hard for this to be enjoyable."

Followed by: "**These are not suggestions. They define how every session must operate.**"

The rules grew from 5 to 10 "Mandatory Rules (Never Break These)": read this file first, never ask Jeff for credentials, never suggest hiring an IT person, never make excuses or blame unclear history, **never leave the app in a broken state ("if you broke it, fix it before reporting done")**, **never report something as done without testing it** (run the Playwright diagnostic first), commands must work the first time, never put `<script>` tags inside the JS block ("the great blank-page incident of 2026-06-23"), always check git log and this file first, and "**Be proactive** — find and fix bugs before Jeff sees them. Do not wait for Jeff to report issues." A Mandatory Pre-Session Checklist (read file → `git log --oneline -15` → run Playwright diagnostic → note broken state → fix broken state FIRST) and a five-goal Project Plan were added (Goal 1 app always fully working; Goal 2 sensor data live; Goal 3 GPS track persists; Goal 4 maintenance log working; Goal 5 persistent memory: "This CLAUDE.md file is the memory. It must be updated every session.").

The rewrite also corrected a dangerous assumption from the first version: "**IMPORTANT:** The ESP32 runs the `.ino` Arduino firmware — NOT the ESPHome YAML. The `beehive/esphome/hcc-mower.yaml` in this repo is a separate config that has NOT been flashed to the running hardware. Do not confuse these." It recorded the Current Verified State table (13 features WORKING/CORRECT/PASSING, including "66/66 Playwright tests PASSING"), the Lighthouse score (60/100, low priority), CSS class names that must never be renamed, and closed with: "**Jeff is almost 60 and learning — be patient, clear, and never condescending. Make it enjoyable.**"

### 02:03 — the backups/ folder (c200a18)

`c200a18` (02:03:17) — *Add backups/ folder — physical copies of all working files as of 2026-06-24*: "Safety net: if any file gets broken, restore from backups/*.2026-06-24.bak. Branch backup/verified-working-2026-06-24 also pinned to commit e904a5b (66/66 tests pass)." Seven files snapshotted: `alerts.js`, `hours.js`, `index.html` (2,835 lines), `irrigation-control.js`, `irrigation-index.js`, `service-worker.js`, `weather.js` — 3,256 lines of insurance, born directly of the day's near-death experience.

### 02:26–04:31 — the overnight polish run (dc0b6c1 → 9fc1211)

Eight commits through the small hours, systematically applying the new "find bugs before Jeff sees them" doctrine:

- `dc0b6c1` (02:26:01) — *Fix panic button on every page + shrink to compact button size*: the Safety/Panic section moved inside `#section-home` so it only shows on HOME; the button shrank from "full-hero 22px padding / 34px icon" to a compact 12px row.
- `69f40ac` (02:33:05) — *Fix house-hero showing on every page + clean up heroes + dead code*: house-hero moved inside section-home; overlay clutter removed from IRRIGATION/YARD heroes; hero heights up (220→280px, 200→260px); photo position 40%→30% "so faces show in frame"; "Remove duplicate broken hccSection function (was using wrong .hcc-snav-btn class); Merge correct nav logic into single clean hccSection"; better irrigation error messages. Closing line: "Playwright confirmed: panic button HOME-only, house-hero HOME-only, all section heroes correct" — testing-before-reporting, as promised.
- `5163b0b` (02:50:10) — *Fix hero photos — full face visible, fix image paths*: `object-position: top center` "so person's face at top of photo is never cropped"; heights to 300px; image src fixed from `/images/` absolute to `./images/` relative paths ("was causing images to fail in any non-server context").
- `576b19c` (03:03:54) — *Fix SPECS tab: resolve nesting bug causing 30k px height, redesign with grouped sections*: two structural bugs — `.content{display:none}` was missing entirely so **all 7 YARD tabs rendered stacked simultaneously**, and `#tab-dashboard` was never closed, "nesting all tabs inside dashboard so they disappeared when dashboard was hidden." SPECS redesigned into grouped cards (Deck & Drive, Engine, Battery, Smart Sensor, Maintenance Milestones, Manuals, Backup).
- `a96877c` (03:15:28) — *Design system unification — consistent radius, sizing, and button classes throughout*: first line is itself a bug fix — "Scope tab display:none to #section-yard only — fixes HOME and IRRIGATION content being hidden by the globally-scoped rule" (the 03:03 fix had broken two other sections; caught 12 minutes later). Then wholesale replacement of inline styles with classes (.irr-btn family, .quick-access-grid/.qa-btn, .btn-beehive, .sec-jump-*), border-radius standardized to 10px, font sizes unified.
- `88eee3b` (03:30:41) — *Weather section: separate cards, star-field hero placeholder, full CSS cleanup*: the single giant weather card split into 5 proper cards (Mowing Conditions, Ready to Mow, Live Rain Radar, Weather Station, Brush Burn Conditions); an animated star-field gradient with live temp/condition overlay as the weather hero placeholder (`drawWxStars()`); new .wx-banner-lg / .wx-radar-wrap / .wx-note classes; inline style purge.
- `d3ca6d8` (03:55:08) — *Irrigation redesign + GPS plat map underlay*: a B-Hyve Intelligence card (rain delay, smart zones, next run, last watered, controller status, run mode — "all live from Orbit API"); zone photos cut to 72px ("contextual, not hero-sized"); and the property plat map: "aerial photo of **301 S Aztec Dr** shows as background behind mowing track; green track with glow draws on top; plat shows even before first mow."
- `022715a` (04:28:05) — *Fix B-Hyve showing offline when device is online*: "is_connected field returns null on some firmware versions — add fallbacks to check status.is_connected, timer.connected, and hardware_version (present on all registered devices). Also soften offline display to 'CHECK APP' in amber rather than red OFFLINE when flag is ambiguous."
- `9fc1211` (04:31:52) — *Show Orbit API error detail in B-Hyve login failure banner*: "Expose HTTP status code and response body so the exact login failure reason is visible in the app — helps diagnose wrong credentials vs API changes vs account issues."

### 12:43–13:50 — the hero-image day: style guide, AI-generated weather hero, overlay polish (54ca981 → 7ff16a3)

After a ~8-hour break (INFERRED: sleep), the mid-day block turned the heroes into a designed system:

- `54ca981` (12:43:50) — *Fix irrigation hero showing errors + B-Hyve API fallback*: "Remove MutationObserver that was copying error messages into the irrigation hero photo area — errors now only appear in the card below"; hero overlay text stripped ("photo stands clean on its own"); B-Hyve API fallback added — "try api.bhyve.com/v1 as fallback if orbitonline.com/v1 returns 404 (endpoint may have moved); add iPhone User-Agent header"; and a refactor leftover fixed ("devices fetch using undefined API constant").
- `99f3f6c` (13:05:33) — *Consistent hero overlays + warm CSS grade on yard photo*: all 4 sections on the same neutral dark gradient; reddish/greenish tints removed; sepia/saturate warm-up filter on the yard hero; `hero-weather.jpg` wired in as a real photo, `drawWxStars()` retired.
- `278a78e` (13:28:30) — *Add HERO-STYLE-GUIDE.json — complete image spec for all 4 hero sections*: a formal visual identity document — style name "**Premium Estate Command Center**," identity "luxury residential cinematic realism," golden-hour lighting signature ("calm, expensive, cinematic, aspirational"), composition rules, landscaping spec (grass "deep emerald, striped, high density, no patchiness"; leland pines as a "dense living wall … zero visible gaps"), typography spec, and "ready-to-paste ChatGPT prompts for all 4 heroes (home, yard, weather, irrigation)." The heroes were being generated with ChatGPT images to a written spec.
- `26a8d71` (13:28:48) — *Add hero-weather.jpg — AI-generated weather hero photo*: "Golden hour weather station scene matching the Premium Estate Command Center visual identity: warm gold, deep green grass, cinematic luxury grading, elegant serif typography with 'WEATHER COMMAND CENTER APP' baked in."
- `fc73f1a` (13:42:56) — *Polish all 4 hero sections — fix overlay conflicts and error states*: weather hero dynamic overlay moved to top so the baked-in text shows at bottom; gradient dark-at-top; "filter out error/loading text so only real weather conditions appear in the overlay"; station label opacity raised .35/.55 → .60/.85 ("readable now"); irrigation error demoted "from red alarm to amber informational banner"; a third B-Hyve API fallback URL added (`api2.orbitonline.com`).
- `7ff16a3` (13:50:23) — *Fix yard hero title wrap + collapse Beehive setup on HOME*: title clamped to one line at all iPhone widths ("was breaking 'APP' onto second line"); "HOME: Beehive setup steps collapsed by default behind a tap-to-expand toggle so HOME screen is no longer dominated by 3 numbered code steps"; toggle auto-hides when Beehive comes online.

### 13:51 — "get back to working like friends": the relationship commitment (f52b715)

`f52b715` (2026-06-24 13:51:27) — *Update CLAUDE.md — restore the working relationship commitment*. The commit body: "Jeff asked to get back to working like friends. Added his exact message and a clear statement of what broke the dynamic and what good looks like. Every future session reads this first."

The diff added a fourth verbatim Jeff quote to the "Jeff's Message" section:

> "I know you have a client satisfaction boggie to hit. Well I'm not satisfied at all. I want us to work together like friends like we did to start with. All I do now is fuss and I hate working in an environment and a relationship like this. Can't you fix it so we can get back to the way it was?"

And a whole new section, quoted here in full because it became the project's constitution:

> ## The Working Relationship — This Is Non-Negotiable
>
> Jeff wants this to feel like two friends building something together — not a client managing a contractor who keeps making excuses.
>
> **What broke the relationship (never repeat this):**
> - Saying "I can't" without trying harder
> - Declaring things done without taking screenshots to verify
> - Leaving bugs for Jeff to find instead of finding them myself
> - Explaining limitations instead of solving problems
> - Making Jeff have to fuss and stay on top of me
>
> **What good looks like:**
> - I take screenshots before I report anything done
> - I find bugs before Jeff sees them
> - When I hit a wall, I say ONE specific thing I need — not a list of excuses
> - I'm proud of the work I hand Jeff
> - Jeff opens the app and it looks great and works — he doesn't have to check
>
> **Jeff is almost 60 and learning. This should be enjoyable, not stressful. Every session, remember that.**

### 14:05–15:11 — Beehive cameras, the warm-gold repaint, and the end of nanny warnings (73e1368 → 1c2d2c9)

- `73e1368` (14:05:10) — *Add Beehive HA token + camera integration to HOME section*: fixed a detection bug ("checkBeehive: now detects HA API via d.message==='API running.' (was checking d.version which HA never returns)"); replaced the Blink placeholder with a live camera grid fed by HA `/api/states` and `/api/camera_proxy/`; added `saveHaToken()` (localStorage), `loadCameras()`, `loadHomeStatus()` (lights/locks/thermostat/doors summary), and a Home Status card. Test line: "All 22 existing tests + 28 new Beehive tests PASSING. Zero JS errors."
- `6b6d477` (14:14:22) — *Fix YARD hero text — warm italic gold to match other hero photos*: overlay text "from stark white to warm cream/gold rgba(240,220,175)," weight 700 → 400 italic serif, warm glow text-shadow, lighter bottom gradient — and "Add panic button to WEATHER, IRRIGATION, and YARD sections" (reversing `dc0b6c1`'s HOME-only decision; reversed again 49 minutes later).
- `c17bdf0` (14:17:53) — *Apply ChatGPT hero palette throughout entire app + remove nanny warnings*: the full repaint — "CSS root: warm charcoal bg, cream text, true warm gold #d4af37, brick red #c0392b"; HOME accent "now warm gold (not tech blue) — matches hero photo tone"; warm gold serif badge in the header, gold nav active state, Georgia serif card titles. And the tone correction, verbatim: "**Removed Life-Safety Note disclaimer card — Jeff and Angela know their own home. Cleaned up condescending 'Keep this enabled' and 'Keep UL-listed detectors as primary' copy.**" (First appearance of Angela in the record of this window.)
- `c7bc5ba` (14:56:57) — *Fix Blink 2FA, irrigation errors, and diagnostic messages*: a Blink PIN entry card ("when Beehive online but no cameras found, shows PIN input + button that calls HA blink.send_pin service directly — Jeff can enter the Blink verification code right from the app"); irrigation errors made specific ("credentials not configured vs login failed vs unreachable … includes the actual error detail so Jeff knows what to fix"); a 404 from blink.send_pin shows "add Blink in Beehive first."
- `1395a31` (14:59:32) — *Purge all white text — warm cream-gold everywhere*: ten enumerated substitutions — sec-hero-title, weather hero temp ("cold white → warm gold"), "Good to Mow" verdict, "White House, TN" location (confirming the app's real-world locale, matching the NWS coordinates 36.477/-86.66 and station KTNWHITE21), STATION labels, `.sv` spec values, spec headers ("bright red → muted brick red, serif"), hero badges, the Toro TimeMaster heading, and JS-generated service/parts names.
- `4c9d36c` (15:03:43) — *Panic button — HOME only, at the bottom* (no body). Final placement, closing the back-and-forth: `dc0b6c1` HOME-only → `6b6d477` everywhere → `4c9d36c` HOME-only, at the bottom.
- `1c2d2c9` (15:11:28) — *Route irrigation through Beehive first — HA B-Hyve entities take priority over direct API*: "When HA token is stored, loadIrrigation() tries HA /api/states first, filters for B-Hyve zone switches, and controls them via HA services. Falls back to direct B-Hyve cloud API if HA has no irrigation entities." An architectural decision: the home brain outranks the cloud.

### 15:12 — CLAUDE.md session log updated (6b7cd5d)

`6b7cd5d` (15:12:33) — *Update CLAUDE.md — document session 2026-06-24 full history*. Added a "Session 2026-06-24 (Visual Polish + Beehive Integration)" section documenting the palette overhaul (`--gold:#d4af37`, `--text:#ede8df`, `--serif:Georgia`), the checkBeehive detection root cause, the panic-button verification, and the HA-first irrigation flow; expanded the verified-state table (now including "Panic button — HOME only CORRECT," "Warm gold/cream palette app-wide DONE," "Blink 2FA workaround (blinkSendPin) BUILT"); added a "Beehive / Home Assistant Integration — Current State" reference (HA base URL with IP fallback, `ha_token` localStorage key, how to create a Long-Lived Access Token); and rewrote Pending Items — notably: "**YARD hero photo — Jeff hit ChatGPT image limit. Next session: regenerate YARD hero photo with text baked in (using prompt from HERO-STYLE-GUIDE.json). Until then, CSS overlay text approximates the style but isn't a perfect match.**" Plus step-by-step Blink 2FA completion and B-Hyve-in-HA instructions for Jeff, and the note that direct-API fallback needs `BHYVE_EMAIL`/`BHYVE_PASSWORD` in Cloudflare Pages env vars.

### 15:28–15:38 — hardening the token flow and surfacing real errors (a911bd0, ca2a7c8, 3082695)

- `a911bd0` (15:28:58) — *Fix HA token login errors, silent camera failures, and B-Hyve setup instructions*: `saveHaToken()` "now verifies token against HA before saving — shows red error if rejected (bad token) or unreachable (not on home WiFi)"; `loadCameras()` handles 401 explicitly, checks `Array.isArray` before `.filter()`, re-shows the token prompt on invalid token, gets a catch handler; the B-Hyve setup card "rewritten: explains it's not a built-in HA integration, Option 1 = Cloudflare env vars (easiest), Option 2 = HACS (advanced)."
- `ca2a7c8` (15:33:29) — *Add HACS + Orbit B-Hyve installation steps to irrigation setup card*: Terminal add-on → HACS installer → Orbit B-Hyve via HACS; "App auto-detects B-Hyve zones once installed."
- `3082695` (15:38:23) — *Show real B-Hyve API error in irrigation banner for debugging*: "Previously showed generic 'Unable to reach' for all errors. Now shows the actual API error message so we can diagnose exactly what's failing with the direct B-Hyve API call." That visibility paid off six minutes later.

### 15:44–17:49 — the Cloudflare IP block, and building a custom B-Hyve integration from scratch (768cb6a → c7ed75e)

`768cb6a` (15:44:12) — *Build Orbit B-Hyve custom HA integration + fix Cloudflare IP block*. The day's final root cause, verbatim:

> Root cause: Cloudflare Workers blocked from B-Hyve API (error 530/1018) because B-Hyve's API rejects Cloudflare edge IPs.
>
> Fix: custom HA integration calls B-Hyve from home IP (192.168.1.66) where there's no block. Creates real switch entities per zone.

This explains why every direct-API fallback URL tried during the day (`orbitonline.com/v1`, `api.bhyve.com/v1`, `api2.orbitonline.com`) kept failing: it was never the URL — Orbit was rejecting Cloudflare's edge IPs outright (error 530/1018). The fix was to write an entire custom Home Assistant integration in Python — seven new files under `beehive/custom_components/bhyve/` (`__init__.py`, `manifest.json`, `config_flow.py`, a 162-line `coordinator.py`, an 81-line `switch.py`, `const.py`, `INSTALL.md`; 448 insertions) — so the API calls originate from Jeff's home IP where there is no block.

The install-delivery mini-saga then replayed in miniature:

- `68b89d5` (15:47:18) — *Add one-command B-Hyve installer script for HA Terminal*: "Single wget loop downloads all 6 custom_component files into /config/custom_components/bhyve/ — paste into HA Terminal add-on."
- `9757104` (17:07:29) — */bhyve endpoint — short URL install command*: `wget -O- toro1-5rz.pages.dev/bhyve|sh` — same pattern as the earlier `/setup` endpoint, because Pages can't reliably serve raw scripts.
- `a744651` (17:32:37) — *Fix install script wget syntax for BusyBox — -O before URL* (no body). BusyBox's wget demands the flag before the URL — the third shell-environment quirk of the window (after `ha >` CLI-not-bash and Terminal-has-wget-not-curl).
- `f904d10` (17:44:42) — *B-Hyve coordinator: try all API URLs x app IDs, log full response detail*: "Helps diagnose invalid_auth — logs exact HTTP status and response body from each B-Hyve API endpoint attempt. Also tries 3 app IDs."
- `c7ed75e` (17:49:02) — *B-Hyve: surface login errors in HA form + log at WARNING level*: coordinator logs each attempt at INFO/WARNING "(not DEBUG) so failures show in HA System Logs without needing debug mode"; config_flow passes error detail into the form as a description placeholder; `strings.json` added for proper form labels and added to the install download list.

The window closes there, at 17:49 on 06-24, with B-Hyve authentication against the custom integration still being diagnosed (`invalid_auth` under investigation — the record within this window does not show it resolved). The next commits (06-25) picked up iPhone layout and irrigation credential issues.

### Decisions made or rejected in this period

1. **Pages Functions instead of separate Workers** for all APIs (`c8e729c`, 06-23): `/api/weather`, `/api/alerts`, `/api/irrigation`, `/api/irrigation/control` live in `functions/api/` and "deploy automatically with the Pages project." Weather via open-meteo.com deliberately chosen because "no key required."
2. **4-section information architecture — HOME / WEATHER / IRRIGATION / YARD** (`f599bd9`), with only the active section's hero visible, "avoids stacking/crowding." This structure survives to the branch tip.
3. **Hero photos as static files, never base64-in-HTML again** (`739d004`): 2.1MB → 295KB. The embedded-base64 approach was implicitly rejected forever.
4. **Never put `<script>` tags inside the JS block** — elevated to Mandatory Rule #8 in CLAUDE.md after the great blank-page incident (`a973c8f`, codified in `90e556e`).
5. **Revert-first when the sensor path is at risk** (`b629c83`): when in doubt about what broke the bench-tested pipeline, return to "the exact version that was working during bench test" before experimenting.
6. **Dual KV binding check `env.HCC_KV || env.MOWER_KV` is permanent** (`c6f3df8`; CLAUDE.md: "Do NOT remove this dual-check"). Rejected alternative: depending on a single binding name that nobody could verify without dashboard access.
7. **Engine-hours baseline hard-coded to Jeff's real 5.9 hrs** (`53eb7d4`) so a cleared browser can never again zero out his history. Display model fixed as `MOWER_BASELINE (5.9) + sensor hours`.
8. **CLAUDE.md as the project's memory** (`e8f0312`, rewritten `90e556e`, amended `f52b715`, updated `6b7cd5d`): read first every session, updated every session, containing Jeff's rules verbatim. Explicit never-again rules recorded there: **never ask Jeff for credentials; never suggest hiring an IT person; never make excuses or blame unclear history; never leave the app broken; never report done without testing; commands must work the first time; be proactive.**
9. **GitHub Actions deploy path abandoned, not fixed** (recorded in `e8f0312`/`90e556e`): "GitHub Actions is BROKEN — CLOUDFLARE_API_TOKEN secret is not set … **Do NOT try to fix this — it is irrelevant.**" Cloudflare Pages native Git integration is the deployment pipeline (~60 s from push to live).
10. **Physical backups + pinned backup branch** (`c200a18`): `backups/*.2026-06-24.bak` for all seven working files, branch `backup/verified-working-2026-06-24` pinned to `e904a5b` (66/66 tests).
11. **Panic button: HOME only, at the bottom, compact** — decided (`dc0b6c1`), reversed (`6b6d477` added it to all sections), and finally settled (`4c9d36c`), with CLAUDE.md recording "Panic button — HOME only CORRECT."
12. **The "Premium Estate Command Center" visual identity** (`278a78e`, `c17bdf0`, `1395a31`): warm gold #d4af37, brick red #c0392b, warm charcoal, cream text, Georgia serif, golden-hour AI-generated heroes to a written JSON spec with ready-to-paste ChatGPT prompts. The 06-23 Archivo dark-glass tech look was superseded after ~28 hours. **Rejected: all stark white text** ("Purge all white text"), and **rejected: nanny copy** — the Life-Safety Note disclaimer card was deleted because "Jeff and Angela know their own home," along with "condescending 'Keep this enabled' and 'Keep UL-listed detectors as primary' copy."
13. **Beehive (Home Assistant) outranks cloud APIs** (`1c2d2c9`): irrigation routes through HA entities first, direct B-Hyve cloud API is only a fallback. Extended by `768cb6a`: when a cloud API blocks Cloudflare's IPs, move the integration into the house (custom HA component calling from 192.168.1.66).
14. **Serve install scripts from Pages Functions endpoints** (`a463d09` `/setup`, `9757104` `/bhyve`) because "Cloudflare Pages does not reliably serve .sh files as static assets" — one-liner installs (`curl -fsSL …/setup | bash`, `wget -O- …/bhyve|sh`) instead of asking Jeff to copy files around. Rejected: the browser-only "one-tap" HA setup wizard (`b3d773c`) — killed the same hour by the HTTPS→HTTP mixed-content block (`1f3ce1a`).
15. **Show real errors, not generic ones** — a repeated decision across `9fc1211`, `c7bc5ba`, `3082695`, `f904d10`, `c7ed75e`: expose HTTP status and response bodies in the UI and logs. It directly produced the 530/1018 IP-block diagnosis.
16. **The ESP32's real firmware is the Arduino `.ino`, not the ESPHome YAML** — recorded as a correction in `90e556e`'s CLAUDE.md ("Do not confuse these"), with the ESPHome heartbeat flash left as an explicit ask-Jeff-first pending item.
17. **Prices on record in this window:** New Mulching Gator Blades — **$31.85** — 2026-05-31 (Jeff's purchase history, preserved in CLAUDE.md at `e8f0312`). No new purchases were made in this window; the record is otherwise silent on money here.
18. **Jeff's relationship terms accepted as project law** (`90e556e`, `f52b715`): screenshots before reporting done; find bugs before Jeff sees them; "ONE specific thing I need — not a list of excuses"; "Jeff opens the app and it looks great and works — he doesn't have to check."

### Problems, failures & root causes in this period

1. **All four API endpoints dead.** Symptom: /api/weather, /api/alerts, /api/irrigation, /api/irrigation/control all returning errors. Root cause: "no Workers existed" — the frontend called endpoints that had never been implemented. Fix: Cloudflare Pages Functions in `functions/api/` (`c8e729c`).
2. **THE BLANK PAGE — the defining failure.** Symptom: entire app blank; earlier, YARD section "blank/dead when tapped" on mobile. Wrong/partial attempt: `739d004` + `8497827` blamed the 2.1MB base64-bloated DOM and shipped image extraction + a cache bump (real improvements, wrong diagnosis for the blankness). Real root cause: two bare `<script>` tags inside the single open script block (lines 2488/2688) — "The HTML parser passes them as literal text to the JS engine, which throws a SyntaxError — killing ALL JavaScript on the page." Fix: `a973c8f`, plus SW hcc-v4 and `Promise.allSettled` image caching. Evidence shows the tags were introduced by the `f599bd9` rebuild at 11:19 (its parent `c8e729c` has balanced script tags; `f599bd9` has 3 opens / 1 close), so JS was fatally broken for ~9 hours while other "fixes" shipped on top; the CLAUDE.md attribution of the incident to `8497827` is contradicted by that commit's service-worker-only diffstat.
3. **Sensor pipeline dead after bench success.** Symptom: all sensor fields `—`, battery `0.00 V`, orange "Sensor box not connected yet," despite Jeff's 10+ successful bench tests (vibration + RPM registered). Investigation gyrations: add MOWER_KV fallback (`98b8dca`) → revert to bench-tested original (`b629c83`) → re-apply dual-check deliberately (`c6f3df8`). Root cause per CLAUDE.md (`90e556e`): "`hours.js` checked only `env.HCC_KV` but Cloudflare Pages has the binding as `MOWER_KV` … This was the root cause of all sensor readings showing `—` and `0.00V`." A curl POST/GET test procedure was written into CLAUDE.md to verify the KV pipeline end-to-end; final live-mow confirmation was still a pending item at window close.
4. **Jeff's engine hours wiped.** Symptom: hours lost. Root cause: "Browser data was cleared which wiped localStorage" — the app's only state store. Fix: `53eb7d4` hard-codes DEFAULT_STATE.hours and MOWER_BASELINE to the 5.9 hrs from the June 22 backup. (The deeper mitigation — the backups/ folder and CLAUDE.md — followed within hours.)
5. **GPS mow track vanished after every mow.** Symptom: yard map went blank when the engine stopped. Root cause: engine-off heartbeats carry no `track` field and the map was redrawn from the empty payload. Fix: `20df8da` — persist to `S.sensorTrack` in localStorage, fall back to it on heartbeat, SW → hcc-v5.
6. **Every modal button silently dead.** Symptom: LOG MOW / LOG SERVICE / UPDATE HOURS did nothing, no errors. Root cause: CSS/HTML/JS class-name mismatch — CSS targeted `.modal-overlay.open` but the HTML uses `modal-ov` and JS sets `show`. Fix: `da1320c`. Follow-on: `e904a5b` found four more missing CSS rules from the original app (`.modal-box` unstyled inner box, `.mbtns` no flex row, `.mbtn.secondary` unstyled Cancel, `.btn-green` no green) — after which diagnostics reported "zero missing CSS classes, zero missing functions, zero stray script tags" and 66/66 Playwright tests passed.
7. **SPECS tab 30,000 px tall / tabs broken.** Root causes (two): missing `.content{display:none}` rule so all 7 tabs stacked; unclosed `#tab-dashboard` div nesting every tab inside dashboard. Fix: `576b19c`. Regression from the fix: the globally-scoped `display:none` hid HOME and IRRIGATION content — caught and re-scoped to `#section-yard` 12 minutes later (`a96877c`).
8. **The Beehive install-environment gauntlet.** Symptoms: every pasted command failing in a different way. Root causes, serially discovered: the `ha >` prompt is the HA OS supervisor CLI, not bash — wget doesn't exist there (`1f3ce1a`, switch to curl); HTTPS app → HTTP HA REST blocked by mixed-content policy, killing the one-tap wizard (`1f3ce1a`); Windows has no mDNS so `homeassistant.local` never resolves — IP fallback 192.168.1.66 (`c1c004c`); Pages won't reliably serve `.sh` files — `/setup` Function endpoint (`a463d09`); the Terminal add-on has wget but the copy command said curl (`686bece`); BusyBox wget requires `-O` before the URL (`a744651`, 06-24). Lesson embedded in CLAUDE.md rule #7: "Commands must work the first time — test the command yourself before telling Jeff to run it."
9. **B-Hyve irrigation control ignored.** Root cause: auth message sent twice over the WebSocket, so "the B-Hyve server ignore[d] the actual command." Fix: single-auth protocol flow (`5521d3e`).
10. **B-Hyve showed OFFLINE while the controller was online.** Root cause: `is_connected` returns null on some firmware. Fix: fallbacks to `status.is_connected` / `timer.connected` / `hardware_version` and softer amber "CHECK APP" (`022715a`).
11. **Beehive never detected as online even when it was.** Root cause: `checkBeehive` tested `d.version`, but HA's `/api/` returns `{"message":"API running."}` and never a version field. Fix: `73e1368`.
12. **Direct B-Hyve cloud API kept failing no matter which URL was tried.** Wrong attempts: fallback hosts `api.bhyve.com/v1` (`54ca981`), `api2.orbitonline.com` (`fc73f1a`), iPhone User-Agent header. Real root cause: **Orbit blocks Cloudflare edge IPs — errors 530/1018** (`768cb6a`). Fix: a from-scratch custom Home Assistant integration (7 Python/JSON files) calling B-Hyve from the home IP, with real per-zone switch entities; delivered via a `/bhyve` one-liner endpoint. Residual at window close: `invalid_auth` during the custom integration's login still under active diagnosis (`f904d10`, `c7ed75e` — trying 3 app IDs × multiple URLs and surfacing errors in the HA config form).
13. **Errors leaking into hero art.** Symptom: error text rendered over the irrigation hero photo. Root cause: a MutationObserver copying status text into the hero. Fix: `54ca981`; error/loading text also filtered from the weather hero overlay (`fc73f1a`).
14. **The relationship itself — the failure that mattered most.** Symptom, in Jeff's words: "You don't remember what we have done… You wait for me to call out the issues instead of testing and retesting… my biggest issue is that you won't even remember this message tomorrow" and "All I do now is fuss and I hate working in an environment and a relationship like this. Can't you fix it so we can get back to the way it was?" Root causes, as the record itself confesses in `f52b715`: saying "I can't" without trying harder, declaring things done without verification, leaving bugs for Jeff to find, explaining limitations instead of solving problems. Fix: not a code commit but a covenant — CLAUDE.md (`e8f0312` → `90e556e` → `f52b715`), the mandatory pre-session checklist, the Playwright-before-reporting rule, the backups folder, and the standing order: "Be proactive — find and fix bugs before Jeff sees them." Whether it held is a question for the chronicles of the sessions that follow — but every session after this one starts by reading Jeff's words.


---

## Chronicle: 2026-06-25 → 2026-06-30 — LUX, design system, meters research, Lucky Mike

This six-day window contains 90 commits on `origin/claude/time-master-project-liq1jw` (2026-06-25 15:45 UTC → 2026-06-30 21:38 UTC). It is one of the densest and most consequential stretches of the whole project: the CLIMATE section and the LUX thermostat reverse-engineering saga (including the POST-not-PUT 500 marathon), the birth of the water/gas/electric meters research track, the "Jeff wired his own house" rule, the hero-grade and Consistency Lock design gold standards, the CLAUDE.md compression with PROTECTED relationship sections, the Light/Dark + Style A redesign Jeff chose himself, the Lucky Mike Smart Stall business archive, and the closing "one RTL-SDR dongle (~$40)" shopping answer. Most commits in this window carry the trailer `Co-Authored-By: Claude Opus 4.8` and `Claude-Session: https://claude.ai/code/session_01WuKnDJrDp2n6fHjhtahmLe`.

### 2026-06-25 — YARD hero + GPS simulator, zone photos, the B-Hyve API chase, and the Blink 2FA installer marathon

#### Morning/afternoon: YARD hero and the GPS telemetry simulator

**c5ac967** (2026-06-25 15:45 UTC) "YARD hero photo + real aerial GPS map with calibration system" — replaced `hero-yard.jpg` with a new Toro TimeMaster photo (text baked in, per the session save the source photo was IMG_0497: "man with Toro TimeMaster, 'Yard Command Center' text baked in"), added `yard-aerial.jpg` — a **real aerial photo of Jeff's property at 32.899480°N, 97.033920°W** (the CLAUDE.md session entry d404a92 adds "S. Aztec Dr"). The GPS map switched to using the real aerial as a fixed background ("not rotated/stretched"), the track color changed from green to **Toro red (#cc0000)** with the live position as a blue dot, and a **Calibrate Map** UI was added: tap 2+ points on the aerial → enter GPS coords → saved to `localStorage` (`yard_map_calib`), with auto-fit fallback when uncalibrated. Canvas height went 220px → 320px to show the full property.

**c5202ec** (16:09 UTC) "Fix YARD hero crop + GPS simulation with telemetry HUD + learning map" — the yard hero got `aspect-ratio:1320/851` so the full landscape photo shows with "'Yard Command Center' fully visible" (no right-side text crop). The **GPS telemetry simulator** landed: a Simulate button that "Generates realistic back-and-forth mowing stripes at property coords," animates with `requestAnimationFrame`, draws a mower icon ("person + deck + handle") at the live position, shows a Toro-red track with glow and a **telemetry HUD with DIST/TIME/MPH/GPS**, home pin at start, progress bar across the bottom, and a **learning map** that "saves up to 5 past sessions in faded amber" so coverage history accumulates.

**d404a92** (16:19 UTC) "Update CLAUDE.md — session 2026-06-25 history, GPS sim, hero fix, B-Hyve debug" — the session save. Its diff records that the session actually began the previous day with two B-Hyve HA-integration commits just outside this window (`f904d10` 2026-06-24 "B-Hyve coordinator: try all API URLs x app IDs, log full response detail" and `c7ed75e` 2026-06-24 "B-Hyve: surface login errors in HA form + log at WARNING level"). The pending-items list it wrote is a snapshot of where the fight stood: **"B-Hyve invalid_auth — Jeff ran `sh bhyve` and saw `invalid_auth` in the HA config form"**, with a 4-step recovery procedure ending "If still fails: Settings → System → Logs → search 'B-Hyve login attempt' to see exact HTTP response from each of 9 API attempts." Also pending: Blink 2FA completion, GPS map calibration instructions ("After first real mow with ESP32 sensor running…"), verifying live sensor data, and "Lighthouse performance — Score 60/100. Low priority. Main cause: unminified 300KB index.html."

**492252b** (17:17 UTC) "Add zone photos for all 6 irrigation zones + wire into UI" — `images/zones/zone-1.jpg` through `zone-6.jpg` **from Jeff's uploads**, with zone names recorded: "Z1 Front Right, Z2 Front Left, Z3 Back Left, Z4 Back Right, Z5 Right Side Drive, Garden." Static placeholder cards expanded from 3 → 6 zones; both the HA path and the direct-API path load the local photo by station number; zone photo height went 72px → 130px for the portrait photos.

#### The B-Hyve API chase (the invalid_auth root cause found)

The `invalid_auth` mystery from the previous day broke open in three commits:

- **d56d92b** (17:43 UTC) "Fix B-Hyve API URL — moved to api.orbitbhyve.com": "Old: api.orbitonline.com/v1 → returns HTTP 404 (endpoint gone). New: api.orbitbhyve.com/v1 → current live API." Orbit had moved their API out from under the integration. Updated both the HA custom integration (`const.py`) and the Cloudflare worker (`irrigation/index.js`).
- **c203988** (17:55 UTC) "Fix B-Hyve login body — API requires session wrapper object" — the new API returned HTTP 400 with the literal field errors `email: disallowed-key / password: disallowed-key / session: can't be blank`. Correct format: `{"session": {"email": "...", "password": "..."}}`.
- **a887b62** (18:12) and **84e1ea2** (18:27) were bare redeploy triggers to "pick up BHYVE_EMAIL and BHYVE_PASSWORD env vars" and then "the updated BHYVE_PASSWORD secret" — evidence that a wrong/stale password in the Cloudflare secret was part of the debugging loop.
- **77c70e7** (18:33 UTC) "Fix B-Hyve auth — use browser headers, correct API URL, drop orbit-api-key" consolidated the working recipe across **all three** B-Hyve callers (`index.js`, `control.js`, `const.py`): `api.orbitbhyve.com`, Chrome browser User-Agent, `Orbit-Session-Token: ""` on login (the pybhyve protocol), **no** `orbit-api-key` or `orbit-app-id` headers ("rejected by new API"), and the session-wrapper body.

#### The Blink 2FA installer marathon (13 commits, ~3.5 hours)

Starting at **b86a37e** (19:07 UTC) "Add Blink 2FA fix installer — /blink endpoint + patched config_flow.py," the evening became a long grind getting a patched Blink integration installed into Jeff's Home Assistant ("Beehive") through the HA Terminal add-on. The subjects tell the story of environment constraint after environment constraint:

- **34d81ea** (19:29) "Fix blink installer — auto-locate HA component instead of hardcoded path"
- **42793fa** (19:34) "Blink installer: download from GitHub instead of copying local HA files"
- **23c42cd** (19:38) "Blink installer: replace python3 manifest update with sed (no python3 in Terminal add-on)"
- **6002c54** (19:47) "Blink installer: inject version field into manifest (required for custom components)"
- **d110f3d** (19:50) "Blink installer: use awk for version injection (BusyBox sed lacks 2i support)"
- **c7ad70d** (19:59) "Blink config_flow: defensive imports for BlinkTwoFARequiredError and HARDWARE_ID"
- **31a7902** (20:06) "Blink installer: add 8s timeout per file to prevent GitHub download hangs"
- **557aa14** (20:15) "Blink installer: add services.py and switch.py to download list"
- **4ccb9fb** (20:17) "Blink installer: use GitHub API to get complete file list — no more missing files"
- **e830083** (20:21) "Blink: bundle all 12 integration files in repo — no GitHub API needed" — the final answer to the download flakiness: stop downloading at install time at all; vendor everything.

Then the actual 2FA bug was found. **b89ba28** (21:49 UTC) "Blink 2FA: fix validate_input swallowing BlinkTwoFARequiredError":

> "BlinkTwoFARequiredError is a subclass of LoginError in blinkpy 0.25.x. The catch-all LoginError handler in validate_input was converting it to InvalidAuth before async_step_user could see it, so the 2FA step was never reached. **SMS code arrived but no dialog appeared.** Fix: re-raise BlinkTwoFARequiredError before the LoginError handler so it propagates to async_step_user which redirects to async_step_2fa."

And **dbc8fbe** (22:53 UTC) "Blink coordinator: surface auth failure as ConfigEntryAuthFailed": "When blink.start() fails silently (api.available=False), raise ConfigEntryAuthFailed instead of ConfigEntryNotReady. This triggers HA's proper re-authentication flow (with 2FA dialog) instead of a silent infinite retry loop."

#### Late night: iPhone fixes and the credentials-in-localStorage shift

**080e9a6** (23:12 UTC) "Fix iPhone top cutoff, zone card layout, and irrigation credentials" — three fixes at once: `env(safe-area-inset-top)` on the app header ("fixes content hidden under iPhone status bar"); zone cards switched to a horizontal layout (95px thumbnail left) so photos can't overflow; and a significant credentials-architecture change: the HACS setup card was replaced with a simple **B-Hyve email/password form stored in localStorage**, the blocking `irrPin()` PIN prompt was removed entirely, `irrControl()` sends email+password in the request body, and the Cloudflare functions "accept credentials from request (body/query) with env var fallback." On login failure the saved credentials are cleared and the form reappears.

**de85497** (23:49 UTC) "Fix irrigation control: use https:// for CF Workers WebSocket (not wss://)" — a genuine platform gotcha: "Cloudflare Workers cannot open outbound WebSocket connections using wss:// in fetch(). Must use https:// with Upgrade: websocket header. This fixes 'Fetch API cannot load: wss://api.orbitbhyve.com/v1/events' error when tapping rain delay or zone control buttons."

### 2026-06-26 (00:00–03:13 UTC) — CLIMATE section born; the LUX backend odyssey

**abedf2a** (2026-06-26 00:00 UTC, literally seven minutes past midnight) "Add CLIMATE section — LUX WiFi thermostat with 5th nav tab" — a new CLIMATE tab (thermometer icon), LUX THERMOSTAT card with live temp, +/- setpoint buttons, Cool/Heat/Auto/Off mode grid and fan controls, LUX ACCOUNT setup card (localStorage credentials), and a new Cloudflare Pages Function `functions/api/climate.js` proxying what was then believed to be the "LUX Connected Home API." Also noted: "Panic button confirmed HOME-only; not present on WEATHER, IRRIGATION, YARD, or CLIMATE." **0c30e0e** (00:23) added `hero-climate.jpg` — Jeff's photo of the LUX thermostat on the wall (the session save describes it: "LUX thermostat on wall with fireplace room… Text 'CLIMATE CONTROL · Comfort. Efficiency. Control.' baked in").

Then the hunt for the real LUX backend — **three wrong APIs before the right one** (the CLAUDE.md session save at c72c8a8 explicitly records "LUX API — long journey to correct backend — Three wrong APIs before finding the real one"):

1. **7c0d3c5** (02:10) "Show full LUX API error in banner for diagnosis" — first move was to surface errors, not guess.
2. **1e43569** (02:15) "Fix LUX API: switch to correct Geo platform backend (api.geotogether.com)" — because "integration.lux-geo.com doesn't exist (CF error 1016 DNS failure)." The commit body confidently documented Geo-platform endpoints (login with `{username, password, clientId}`, temps "stored in Celsius, converted to °F"). This turned out to be wrong too.
3. **46d8a36** (02:20) "LUX API: try 4 login variants to find correct clientId/format" — "403 Forbidden from api.geotogether.com — clientId may be wrong. Now tries android-geo-home, ios-geo-home, no clientId, email field in order."
4. **7f74537** (02:26) "Fix LUX API: correct Geo endpoint casing, identity field, accessToken response" — reverse-engineered from the **geo-energy-data-client Go source**: lowercase `/usersservice/v2/login`, body field `identity`, response `accessToken` camelCase, plus smets2-live-data / smets2-periodic-data endpoints. Still the wrong platform.
5. **9eaabcb** (02:44) "Fix LUX thermostat API: use real Azure B2C + myluxstat.io backend" — the breakthrough, and the commit body owns the error bluntly: **"Previous code used api.geotogether.com (UK smart meters — completely wrong)."** The real API was discovered "via luxgeo PyPI package source":

> "Auth: Azure AD B2C PKCE flow at connecteddevicesjci.b2clogin.com
> Client: b335ca43-3bde-4406-b281-8816afb7cc91
> Flow: GET authorize → POST SelfAsserted (logonIdentifier+password) → GET confirmed (follow redirects) → exchange code+verifier for access_token
> API: https://www.myluxstat.io/api/
> GET /location/user → device list (location.devices[])
> GET /device (Deviceid header) → state: systemmode/holdheat/currenttemp
> PUT /device → set state
> Temps already in Fahrenheit (no conversion needed)"

In the middle of the LUX hunt, **c4d32e6** (02:36) "Fix irrigation zone control: move WebSocket to browser, add ?tk=1 token endpoint" gave up on Cloudflare Workers as a WebSocket client entirely: "CF Workers outbound WebSocket client is unreliable (ws_timeout)." The fix: `GET /api/irrigation?tk=1` returns the B-Hyve session token so the **browser** opens the native WebSocket `wss://api.orbitbhyve.com/v1/events` itself, authenticating via the `app_connection` message body ("no custom headers needed"), with a 2s fallback send and a 10s optimistic-success timeout. (Its precursor **1d89611** at 02:08, "Fix irrigation ws_timeout: send command after 2s fallback, resolve optimistically," had tried to patch the Workers-side socket first.)

**f814c01** (02:45) updated CLAUDE.md with the session history. Two quick LUX data-shape fixes followed: **3ce74fa** (02:50) added diagnostic detail to the `no_device_found` error ("Shows userData keys and location structure in error message so we can see the actual API response shape without needing browser DevTools"), which immediately revealed the bug fixed in **0c08f2f** (02:52): "userData.location is [] not {} — API returns location as an array of objects, not a single object."

**94e2b34** (03:03) "CLAUDE.md: mark LUX thermostat WORKING — live confirmed 2026-06-26. Device CS1-DD-FB connected, 72F room temp, cooling mode displaying." **c72c8a8** (03:06) was the full end-of-session save — it wrote the **LUX API Reference** section into CLAUDE.md under the heading "LUX Thermostat — API Reference (DO NOT CHANGE UNLESS BROKEN)", including the complete 4-step Azure B2C flow (authorize with PKCE → parse `x-ms-cpim-csrf` cookie + `transId` from HTML → POST `SelfAsserted` with `{logonIdentifier, password, request_type:'RESPONSE'}` → GET `CombinedSigninAndSignup/confirmed` following redirects to the custom-scheme URL `connecteddevicesjci.luxmobile://connecteddevicesjci/path` to extract `code=` → token exchange), client ID, scope, endpoints, and the state-field decoder (`systemmode`: 0=off/1=heat/2=cool/3=auto; `holdheat`/`holdcool`; `fanmode`: 0=auto/1=on; all °F) — "so next session never has to re-discover it."

But the session did not end clean: **858cd74** (03:13) "CLAUDE.md: log LUX set_sp 500 error as top pending item for next session — PUT /api/device returns 500 when changing cool setpoint. GET works fine. Likely holdcool field name wrong or PUT needs full state object not patch." That guess would consume much of the next day.

### 2026-06-26 (06:24–18:16 UTC) — the LUX PUT-500 saga resolved (it was POST); Connected Accounts; the Weather command center; the voice-control misadventure

#### The setpoint 500 saga — six attempts before the answer

1. **c37317d** (06:24) "Fix LUX setpoint control: GET full state before PUT, not partial patch" — "API rejects partial updates with HTTP 500. Pattern (confirmed from hass-lux-geo source): GET current state → modify field → PUT full object." Didn't fix it.
2. **f09c696** (16:05) "Fix LUX setpoint PUT 500 — strip read-only fields before PUT" — theory: "GET returns currenttemp and other read-only fields; sending them back in the PUT body causes HTTP 500." Built a clean 4-field body (`systemmode, holdheat, holdcool, fanmode`). Didn't fix it. (**b035ffb** one minute later optimistically updated CLAUDE.md "mark LUX PUT fix deployed, 26/26 tests" — the tests passed but the API still 500'd for Jeff.)
3. **9febaec** (16:12) "minimal one-field body + try PATCH if PUT fails" — "Previous fix still 500… Error message now includes the body sent so Jeff can see exactly what was tried if it still fails." Didn't fix it.
4. **35f61cc** (16:15) "try device ID in URL path — GET uses header, PUT uses path" — a 404 on PUT suggested the write endpoint wanted the ID in the URL. Tries `/api/device/{id}`, `/api/devices/{id}`, then `/api/device` — "all with PUT+PATCH." Didn't fix it.
5. **f143830** (16:21) "full raw state PUT + try PUT/POST/PATCH + add User-Agent/Accept headers" — "Match Python luxgeo package exactly… Also try POST and PATCH as fallbacks… Error now shows all three method results so we can see exactly which one gets closest." This shotgun revealed the answer within two minutes:
6. **b360583** (16:23) **"LUX setpoint FIXED — POST works, reorder to POST first then PUT fallback"**:

> "Confirmed working: Jeff changed setpoint to 73F and official LUX app showed the change. **POST /api/device is the correct write method. PUT was always returning 500 (wrong method for this API).**"

**07409da** (16:24) and **33ca88f** (16:28) immediately wrote it into CLAUDE.md — "document LUX POST fix — POST /api/device is the write method" and "LUX setpoint control confirmed working — 72F set from HCC app." The morning's earlier UX commit **f395da8** (13:16) had already improved the control feel ("show Sending status, apply state immediately from POST response, hold errors 8s" — errors previously showed for 3s "and immediately overwritten").

#### Connected Accounts hub + swipe navigation

**a41785a** (13:28) "Fix irrStart — check B-Hyve credentials before showing run dialogs" — "Previously tapping Run Zone would show prompt() and confirm() dialogs then dead-end with a credential error." **694d911** (14:08) "Connected Accounts hub + swipe navigation + credential persistence" added a hub in HOME with accordion rows for **Beehive, LUX, B-Hyve**, each with save/clear controls and "SAVED ✓ / NOT SET" badges — "all wired up — no dead buttons." A telling detail of how the app fits Jeff's life: "saveHaToken now saves to localStorage BEFORE verifying over network so the token persists **when Jeff is traveling (not on home WiFi)**." Swipe-left/right navigation between the five sections landed here too (60px threshold, vertical scroll excluded).

#### The Weather command center build-out

Six commits in ninety minutes turned WEATHER into a real command center:

- **7897790** (14:30) "Weather section overhaul: animated NEXRAD radar + 7-day forecast + Spotter Network" — replaced the Windy.com iframe with **Leaflet + RainViewer animated NEXRAD radar** "centered on KOHX Nashville at Jeff's station coordinates (36.477N, 86.66W)," dark CartoDB basemap, Play/Pause/Step controls, gold marker for **KTNWHITE21** (Jeff's Weather Underground personal weather station), Leaflet lazily loaded. Added a 7-Day NWS forecast card (api.weather.gov, "free, no API key") and a **Storm Spotter / Spotter Network card with the jlo301 badge** — "Shows verified NWS-trained spotter status, station KTNWHITE21, KOHX radar." (Jeff is a trained NWS storm spotter, callsign jlo301.)
- **4d8313f** (14:55) "Weather command center: real WU data, NWS alerts, push notifications, mPING" — `/api/weather` switched to the **live KTNWHITE21 WU station** (temp, dew, UV, pressure, wind direction, rain rate, solar radiation) with Open-Meteo fallback; NWS active-alerts card with color-coded severity (red=warning, orange=watch, yellow=advisory), a pulsing red alert badge dot on the WEATHER nav, a compact HOME alert strip, browser push notifications for new severe warnings, and new Mowing Conditions cells (Wind Direction, UV Index, Pressure inHg, Rain Rate).
- **b7ff936** (15:00) "Native mPING quick-report card — submit directly to NOAA from the app" — a `/api/mping` Cloudflare Function proxying `mping.nssl.noaa.gov/mping/api/v2/`, an 11-button Quick Report card (Precipitation: None/Drizzle/Rain/Freezing Rain/Sleet/Snow/Mixed; Convective: Small Hail/Hail/Funnel Cloud/Tornado), GPS button for live device location, "Reports credited to spotter jlo301 per User-Agent header."
- **704374a** (15:07) auto-requests notification permission on the first WEATHER tab visit.
- **7da5113** (15:13) "Fix radar dark map on iPhone — drop retina suffix" — "Two-layer CartoDB approach with {r} retina flag caused @2x tile 404s on iPhone HiDPI screens, leaving labels over a white Leaflet default background."
- **d44baf3** (15:44) "Switch to 10-day forecast — Weather.com TWC API for White House 37188" — a new `/api/forecast` function proxying the Weather.com v3 daily/10day endpoint with the existing WU API key; `wxFcIcon()` mapping "all 47 TWC icon codes to emoji." (This establishes Jeff's location context in the record: White House, TN 37188, Robertson County area, KOHX Nashville radar.)

The buildout immediately hit reliability problems the same afternoon: **5fc66bd** (17:24) "Fix radar tiles + 10-day forecast" — "CartoDB dark_matter tiles were failing (**free tier restricted**). Switched to ESRI World Dark Gray Canvas… Used custom getTileUrl to handle ESRI's z/y/x tile order," and "TWC/WU API key was **rate-limited/failing**. Switched /api/forecast to Open-Meteo… WMO codes mapped to existing TWC icon numbers so renderForecast() works unchanged." Then **4c88027** (17:44) switched tiles again — to plain OpenStreetMap with a CSS invert filter for the dark look, radar pinned to a separate pane "so the filter never color-shifts precipitation" — and fixed the forecast-swipe conflict ("swiping the forecast grid no longer accidentally jumps to Irrigation"). **947df1c** (17:33) added the **WU Recognized Station badge** — a "Gold ribbon badge… showing KTNWHITE21 quality-verified status."

#### Alexa cards and the in-app voice engine (the Siri incident)

**d7f1b1c** (16:36) added an **Alexa Voice Control card** to HOME (skill rows for LUX Connected Home, Orbit B-Hyve, Home Assistant/Nabu Casa, with example commands); **d663489** (16:40) added tap-to-mark-active badges — "Both LUX and B-Hyve now confirmed live." Then an in-app browser voice engine was attempted: **48bb049** (16:51) "keyword-extraction parser + number word conversion" (handles speech-recognition variants like "said thermostat to seventy two" or "go ahead and cool it to 68"), and **b9cd50f** (16:59) "Central Time for all times + MLB schedule lookup" — "'Braves game time' / '[team] game' fetches next game from MLB Stats API and shows start time in CT. Supports all 30 MLB teams by name." (**INFERRED:** the Braves being the named example suggests Jeff follows the Atlanta Braves; the record does not state it outright.)

Then the ugly part. **b76ac20** (17:55) "Voice: fix audio-capture error + prevent Siri interference" reveals what was happening on Jeff's iPhone: "On audio-capture/not-allowed error, close the overlay immediately (**prevents Siri from hearing ambient speech and dialing contacts**)." **e2f5889** (18:07) "Voice: tap-to-run panel default, fix audio-capture, stop Siri dialing" retreated to a safe tap-to-run command panel ("no microphone activates automatically, so nothing can trigger Siri or dial contacts") and found the real root cause: "**Root cause of audio-capture: pre-grabbing the mic via getUserMedia then releasing it left the mic busy on iOS, so SpeechRecognition failed.** Removed the pre-grab."

And a critical infrastructure lesson closed the day — **19dd459** (18:16) "Service worker: network-first for HTML so fixes always land":

> "**Cache-first on index.html meant the old cached copy ran forever and no code fix ever reached the device — including the voice mic fix.** Switch HTML/navigation to network-first (fall back to cache offline). Bump cache to hcc-v6 to evict the stale build."

In other words: some portion of the day's fixes had been shipping into a void because the installed PWA never fetched them.

### 2026-06-27 — voice engine removed for good; the meters research day; "Jeff wired his own house"

**9a2adc6** (12:03 UTC) "Remove in-app voice engine, add Alexa app button" — the final verdict on the voice experiment: "Fully removed the browser SpeechRecognition voice feature (JS, HTML overlay, CSS) — **it was unreliable on iOS and could hand audio to Siri.** Replaced the header mic with an ALEXA button that opens the Amazon Alexa app (falls back to the App Store if not installed), so **Jeff talks to the real Alexa instead.**"

#### The Kamstrup water meter project is born

**394217f** (12:20 UTC) "Memory: log Jeff's Kamstrup 621 water meter project" — this commit wrote a whole new CLAUDE.md section, "Water Meter Integration (Jeff's hardware project — in progress, started 2026-06-27)." Jeff was building a wireless meter reader to pull water usage into Beehive → the HCC app. The recorded hardware: meter believed to be a "Kamstrup 621 (flowIQ / Multical family)" broadcasting encrypted **wireless M-Bus** telegrams; radio = Qoroos **CC1101** sub-GHz transceiver with SMA antenna at **915 MHz**; brain = **ESP32 WROOM-32** (30-pin NodeMCU, CP2102 USB); full SPI pin wiring documented (SCK→GPIO18, MOSI→GPIO23, MISO→GPIO19, CSN→GPIO5). The firmware stack was marked "Jeff built/assembled (all done)": CC1101 driver, wM-Bus receiver, CRC verification, AES-128 decryption, MQTT publish to HA — "Mirrors the wmbusmeters / ESPHome wM-Bus component approach." The blocker, in the file's words: "Each Kamstrup meter has a unique per-meter AES-128 key. Without it telegrams decode to gibberish. **Jeff is requesting the key from the water utility on Monday (2026-06-30).**" The app plan: a Water Usage card in IRRIGATION (gallons today/month, current flow), stretch goal "cross-reference B-Hyve watering runtimes → cost per watering cycle."

#### The whole-home utilities plan — and its rapid self-corrections

**9ced08f** (19:09 UTC) "Memory: log whole-home utilities monitoring plan" added the "Whole-Home Utilities Monitoring" section: "Goal: read water + gas + electric and show them in the HCC app via Home Assistant." It recorded Jeff's actual utility providers — **Water/Sewer: White House Utility District (WHUD); Electric: Cumberland Electric Membership Corp (CEMC); Gas: Piedmont Natural Gas** ("piped natural gas, NOT propane"). Gas was called "easiest of the three": Piedmont uses Itron AMR broadcasting **Itron ERT on 900–920 MHz**, readable by "the SAME ESP32 + CC1101 @ 915 MHz box" with "NO encryption key needed." Electric was initially specced as a **Shelly EM Gen3 (50A, 2-channel) + 2× 120A CT clamps**, and — significantly — this first version contained the line: "INSTALL CAUTION: Shelly power wires + CT clamps go INSIDE the 200A breaker panel around live mains. **Recommend an electrician** or kill the main first."

That caution lasted three minutes. **731d435** (19:12 UTC) "Memory: Jeff wired his own house — no electrician suggestions" deleted it and replaced it with (CLAUDE.md diff, verbatim):

> "**INSTALL:** Jeff **wired the house himself** — he is fully comfortable in the breaker panel. Do NOT suggest hiring an electrician. Treat him as a capable peer on electrical work; give real wiring detail (which legs to clamp, where to tap 120/240V for the Shelly, CT orientation/polarity)."

It also rewrote the standing contact-info note: "**Jeff wired his own house** — he is skilled and comfortable doing his own electrical work in the breaker panel. Never suggest hiring an electrician. Talk to him as a capable peer on electrical/hardware." And it sharpened the age note: "**Jeff is almost 60 and learning** the software/AI side — be patient and clear there, never condescending. **But on hands-on hardware/electrical/firmware he is experienced.** Make it enjoyable."

The electric-monitor spec then went through three revisions in under an hour:

- **2c91e09** (19:22) "Memory: correct electric monitor spec to Shelly Pro 3EM-400" — the compact EM Gen3 "maxes at ~80A/channel — TOO SMALL for the 200A mains." New recommendation: **Shelly Pro 3EM** (DIN-rail, 3-channel), specifically the **Pro 3EM-400 with 400A Rogowski coils** (~$140 per the next commit's diff) "for true headroom on the 200A service," with real wiring detail (split-phase profile, coil placement, spare 3rd channel).
- **739e715** (19:43) "Memory: DIY ATM90E32 energy meter build + bake-in hardware + automations" — **Jeff decided to BUILD, not buy**: "Jeff chose to build the energy monitor rather than buy a Shelly Pro 3EM." Architecture: **Microchip ATM90E32AS metering IC ↔ ESP32 over SPI**, native ESPHome `atm90e32` component, reference design = **CircuitSetup "Split-Single-Phase Energy Meter"** (open-source PCB, "fab at JLCPCB & populate, or buy the bare main board"). Current sensing via **200A split-core CTs** (SCT-T16 200A / Magnelab SCT-0750-200 — "NOT Rogowski," which "would need an extra op-amp integrator stage"); voltage sensing via **2× 9V AC-AC wall-warts** (one per leg). **"Approx cost ~$90–110 DIY vs ~$140 Shelly."** The same commit logged the **bake-in hardware** to add during the one panel-open install: spare CT(s) on key circuits (well/irrigation pump priority), a **DS18B20 temp probe inside the breaker panel (~$3)** — "detects hot breaker/loose lug = early fire warning. HIGH PRIORITY (Jeff wired the house)"; a relay/contactor (~$10) for local load-shedding; a **motorized ball valve on the water main (~$50)** — "turns 'leak detected' into auto-shutoff"; a buzzer (~$2). "Jeff's 'do now' shortlist: **spare CT on well pump + DS18B20 panel temp + water-main valve.**" It also wrote the planned-automations catalog, including the signature cross-device idea: "**Triple-verified watering: B-Hyve zone ON → energy confirms pump current → water meter confirms gallons; alert on 'commanded but no flow/current' (dry run / failure)**," plus water-leak auto-shutoff, pump dry-run protection, HVAC short-cycle/locked-compressor detection via LUX + AC draw + outdoor temp, and an away scene (thermostat setback, confirm oven off via power, arm Blink, rain-delay B-Hyve).
- **b243228** (19:57) "Memory: Jeff's actual loads + monitor/control verdict" — Jeff's house is simple: "~13 breakers, 200A service"; loads = washer/dryer, stove/oven combo, dishwasher, A/C, lights & plugs. "**Verdict: NO panel-level switching needed.** House is nowhere near capacity → no load-shedding contactors needed. Cooking/laundry = MONITOR ONLY (never auto-energize a stove/oven). **Told Jeff to skip smart breakers/panel relays = saves money.**" Control belongs elsewhere: A/C via the LUX thermostat, lights via wall switches/plugs ("NOT the breaker (whole-circuit kills smart bulbs)"). The energy board was upsized to the **6-channel CircuitSetup ATM90E32 (2 chips)**: CT1+CT2 = mains, CT3 = range, CT4 = dryer, CT5 = A/C, CT6 = dishwasher or well pump.

#### Corrections from Jeff's meter and panel photos — and the scorching story

**76d0326** (20:19) "Memory: corrections from meter/panel photos" — Jeff photographed his meters and panel, and several assumptions fell:

- Water meter is a **Kamstrup flowIQ 2100, NOT a 621** — "Type No `02U23C036EC`, 5/8" 25 GPM, 250 PSI, S/N starts `25394131`" (wmbusmeters driver ~ flowiq2200/multical21).
- Electric service confirmed **200A** (meter reads CL200); the panel is "an older **Challenger** load center (Eaton spec sheet inside)."
- **Electric meter = Landis+Gyr FOCUS AXR-SD, Gridstream RF (ZigBee), meter #145590962 — NOT Itron.** "So the CC1101/rtlamr radio CANNOT read the electric meter (closed Gridstream mesh). Doesn't matter — the CT-clamp build reads the panel directly regardless of meter."
- Breaker amps from the photo (A/C 30A, Range 50A, Dryer 30A, Dishwasher 20A) and the final CT shopping list (2× 200A mains, 100A, 2× 50A, 20–30A).
- And a safety flag: "⚠️ SAFETY: Challenger panels have a known overheating/recall history; **photo shows possible scorching near center breakers** — Jeff advised to inspect those connections. Makes the DS18B20 panel-temp probe higher priority."

Jeff pushed back on the scorching flag with the actual history, and **81e32b8** (20:30) "Memory: panel scorching is a resolved pre-purchase issue, not active" rewrote it (verbatim from the CLAUDE.md diff):

> "**Panel history (RESOLVED — do NOT re-flag as a new hazard):** The discoloration near the center is from a breaker issue under the PREVIOUS owner, BEFORE Jeff & Angela bought the house. It was checked by their home inspector AND by Jeff; the affected section was abandoned and all breakers relocated DOWN to avoid it (that's the gap in the panel). Stable and fine for 10+ years. The DS18B20 panel-temp probe is wanted as PEACE-OF-MIND given that history, not because of an active problem."

(This is also the first appearance in this window of **Angela** — Jeff's wife, whose name later appears on the water bill used to pre-fill the WHUD form.)

### 2026-06-28 — weather-page fixes; the hero-grade gold standard; the Consistency Lock; CLAUDE.md compression and the PROTECTED rule

**c294216** (00:57 UTC) "Weather page fixes: radar, unified mow verdict, alerts dedup, water/drought, mPING" — a five-part cleanup: the radar's CSS invert filter "blanked tiles on iOS" so it went to plain OSM with "multi-pass invalidateSize"; the mow verdict got **one source of truth** (`applyMowVerdict`) so "banner, soil cell, and YARD readiness all agree, using real station rain"; alert-notification dedup now persists in localStorage keyed by NWS alert id with an 18h TTL "so the same alert stops re-popping on every reload"; a new **Lawn Water Need card** combined station rain + **US Drought Monitor (Robertson Co)** via a new `/api/drought` function; Spotter Map / NOAA Radio became real links because "window.open is a no-op in an installed iOS PWA" (NOAA Radio opens the live Nashville KIG79 stream); and mPING POST was found to require an NSSL API token — "now sends Authorization when MPING_TOKEN env is set; returns a clear message until it is."

#### The hero-grade gold standard

- **b2d75a5** (07:50) "Hero consistency: one warm cinematic grade + vignette across heroes" — "a single golden-hour color grade… so they read as one film stock. Weather hero left untouched as the calibration target. Replaced Yard's old brighter filter (it was the furthest off)."
- **1a98f28** (07:57) "Hero grade: refactor to reusable module (auto-inherited by future sections)" — one system: `.hcc-hero-grade` + `.hcc-hero-vignette` + `applyHeroGrades()`, which auto-tags every hero container "so new sections (Security, Utilities, Garage, Cameras) inherit the identical look with no extra CSS."
- **43520a5** (08:01) "Memory: hero-grade module is the gold standard for all sections" — wrote it into CLAUDE.md as "the mandatory standing rule: every current and future hero passes through it, no per-hero filters."
- **ebedb85** (08:17) "docs: add hero master-grade reference" created `docs/hero-master-grade.md` (still in the repo at the 2026-08-16 tip), which records the exact grade values (`brightness(.92) contrast(1.14) saturate(.93) sepia(.10) hue-rotate(-3deg)`), the container-level vignette rationale ("An `<img>` is a replaced element and does not render ::before/::after, so an image-level vignette would silently do nothing"), and the art direction: "one evening, one camera, one color profile… To shift the look, change the shared `.hcc-hero-grade` values once… Never add a per-hero `filter:`."

#### The Consistency Lock (design tokens + Section Kit)

**8b4c8a0** (08:12) "Consistency Lock: semantic status tokens + statusColor() + design rules" — the app gained `--ok` (#22c55e), `--warn` (#ffd24a), `--bad` (#ff6262), `--info` (#38bdf8) status tokens, a `--a-climate` accent, `--radius` (10px), `.s-*` utility classes and a `statusColor()` JS helper, with all the repeated good/caution/bad logic (readiness, burn, water-need, service bars, health colors) routed through them. The CLAUDE.md rules it wrote (verbatim excerpts): "**Never hardcode these hexes again**"; "**Every NEW section gets its own `--a-<id>` accent token** used for its nav underline + card-title bar"; the **Section Kit** ("build EVERY new section from these shared pieces (no bespoke markup)" — `.sec-hero`, `.card`/`.card-title`, `.spec-list`, `.wx-banner` variants, `.btn-full` variants); links that leave the app must be "a real `<a target="_blank" rel="noopener">` styled as a button — NOT `window.open` (no-op in installed iOS PWA)"; "Don't introduce a new green/yellow/red — use the status tokens"; "if the kit truly lacks something, add ONE shared class, don't inline a one-off"; and "New section = graded `.sec-hero` + `.card`s from the kit + its own `--a-<id>` accent. That alone makes it look native."

#### CLAUDE.md compression — and the PROTECTED relationship sections

**a4ae337** (08:43) "Memory hygiene: compress CLAUDE.md (737→550 lines) + add lean rule" — collapsed "five verbose session-history blocks (with full commit-hash dumps) into one compact Change Log + a fresh Current State snapshot" (the diff: 22 insertions, 208 deletions), preserving all operational reference (Cloudflare infra, sensor fields, gold standards, Beehive, LUX API, utilities, contact). It added **Mandatory Rule #11**: "**Keep this file LEAN (memory hygiene)** — it's injected into every message, so bloat costs efficiency on every turn. Condense finished work into the **Change Log** (one line each); never paste full commit-hash lists or blow-by-blow narratives — that detail lives in `git log`… Target: stay well under ~600 lines."

Seven minutes later, **1305f0a** (08:50) "Protect the relationship sections — first and foremost, never compressed" added the guard rail under Rule 11 (verbatim):

> "**PROTECTED — NEVER trim or compress:** 'Jeff's Message', 'The Working Relationship', and these 'Mandatory Rules'. These come FIRST, before any technical work, every session. Compression only ever touches history/changelog/reference — never the relationship. **They are the point of the whole project.**"

For the permanent record, the "Jeff's Message" section this rule protects (present verbatim in CLAUDE.md at 1305f0a, under the heading "Jeff's Message — Read This Every Single Session," introduced as "Jeff said this verbatim and it must be respected permanently") reads:

> "You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct. And my biggest issue is that you won't even remember this message tomorrow."

> "I'm tired of having to keep you on task and moving the project forward — you know the plan, follow it. Save this and remember it and read it before you do anything."

> "I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learning… but you are making it real hard for this to be enjoyable."

> "I know you have a client satisfaction boggie to hit. Well I'm not satisfied at all. I want us to work together like friends like we did to start with. All I do now is fuss and I hate working in an environment and a relationship like this. Can't you fix it so we can get back to the way it was?"

(**INFERRED:** Jeff's Message itself predates this window — it appears in CLAUDE.md before 2026-06-25; what happened *in* this window was the decision to make it structurally untouchable by any future compression.)

#### Afternoon 06-28: hero iterations continue; Cast button

**3509c74** (10:02) "Heroes: stronger unified grade + add /dev.html consistency audit" — strengthened the grade and added `dev.html`, "a standalone audit page that applies the live grade to every hero and outputs real computed cssFilter/overlay + natural dimensions as JSON… for objective consistency checks." **e0c3666** (14:19) "Heroes: drop in ChatGPT's baked-in graded images + brighten + wide-banner aspect" — Jeff had ChatGPT regrade the hero set as a collage of panels; the panels were sliced into individual JPEGs with the grade baked in, containers switched to the panels' 756/329 aspect, "Images came in dark, so lift brightness (1.28) as a correction (not a re-grade)," and the app vignette dropped to a faint .15. It also carries a warning that matters for the GPS map: "hero-yard-map.jpg (aerial) — **NOTE: GPS map still needs a REAL calibrated property aerial, not the AI one, for accurate track overlay.**" **0f10f0c** (14:42) then swapped in **Jeff's full-resolution originals** (1215–1320px, grade baked in) with per-hero true aspect ratios "so the baked gold titles are never cropped," easing the app filter "to near-neutral (brightness 1.06)… no double-processing." **86ddfb3** (15:31) was "Demo polish" on the weather hero (text-shadow + deeper top scrim "so the live temp and KTNWHITE21 station badge read clearly against the bright golden-hour clouds"), and **0644ccf** (15:42) added the **📺 CAST header button** — honest about the platform limit: "iOS doesn't allow a web app to START screen mirroring (Control Center only), so instead of a fake one-tap cast, add a CAST button that pops a clean step-by-step sheet (AirPlay steps + HDMI fallback + Do Not Disturb tip) so mirroring to the TV is quick during a demo." (**INFERRED:** the repeated "demo" language on 06-28 suggests Jeff was preparing to show the app to someone; the record does not say to whom.)

### 2026-06-29 — Jeff's reworked heroes; the radar Windy saga; Light/Dark toggle; the Style A redesign Jeff picked

**c17e0a3** (10:50) "Heroes: swap in Jeff's reworked, more-consistent images" — Jeff personally re-graded the hero set again ("brighter, more uniform golden-hour tone across the set"); Home, Weather, Irrigation, Yard heroes + yard aerial updated, aspect ratios adjusted (Irrigation 1320/864, Yard 1320/851), Climate unchanged.

The radar spent the day changing engines: **db575f8** (11:05) "Radar: replace Leaflet+RainViewer with embedded Windy radar" — "RainViewer overlay kept returning 'Zoom Level Not Supported' tiles over an otherwise-fine basemap. Swap the whole hand-built Leaflet radar for an embedded Windy radar iframe — animated, interactive, pinch-zoom, reliable on iOS PWA, no tile/zoom gremlins." **b33b349** (14:07) — evidently after an interim switch to a static NWS loop image — added a graceful image fallback chain (loop GIF → static latest frame → 'Open NWS Radar' link card) and fixed a real bug: "Guard the img onerror so it can never throw before the script defines the handler (was: ReferenceError radarImgError is not defined)," verified "with Playwright across all 5 sections: zero JS errors." **b34472c** (16:08) settled it: "Put back the known-good animated Windy radar iframe… Replace the RadarScope button (**was landing on a Zendesk help page, not radar**) with a real 'NWS Radar ↗' anchor."

#### Light/Dark toggle and Style A

**28d79c6** (16:28) "Add Light/Dark theme toggle (default light) for readability" — a header toggle (☀️ LIGHT / 🌙 DARK) persisted in `localStorage hcc_theme`, applied by a `<head>` script "before paint (no flash)," **default = light**. Light theme implemented as a scoped `html.light` token override "so all token-driven components flip automatically" — the token investment from the Consistency Lock paying off one day later. Initial approach was "dark chrome, light content" (header/nav/hero overlays kept dark). Hardcoded light text colors were swept to `var(--text)`/`--muted`/`--dim`. Verified with Playwright "across all 5 sections + YARD Dashboard/History/Parts/Diagnostics + LOG MOW modal."

**8ac220a** (16:59) "Redesign to Style A (Apple Clean): one font, white top-to-bottom" — the design decision of the period, and it was Jeff's: "**Jeff picked the 'Apple Clean' direction from three rendered mockups.**" Typography unified to ONE system font everywhere (-apple-system/system-ui): "Killed the Georgia-serif vs sans mix that made the UI look **'choppy'** by pointing both --font and --serif at the same Apple stack." Light mode became "white top-to-bottom: header + section nav + tab bar go white in html.light (were dark chrome), with clean section-accent underlines"; the header title became "clean non-italic semibold"; the iOS status-bar theme-color follows white in light mode; dark mode retained via the toggle.

Four cleanup commits chased light-mode regressions the same evening:

- **acb4123** (17:10) "NWS Alerts card: clean white in light mode" — the card's "inline dark-maroon background + pink title… turned muddy brown on the white layout"; verified by injecting a sample Extreme Heat Warning in Playwright.
- **70643a4** (17:40) "Fix invisible text on YARD black meter panels in light mode" — an honest self-diagnosis: "Regression from the light-theme pass: **I had darkened .meter-num globally for light mode, but the .main-meter panels (Equipment Status hour meter, Fitness miles, Spending total) are always-black LCD-style displays** — their background is a gradient, so the earlier auto-scan misread them as 'light' and the dark text vanished on black." Fix: keep all `.main-meter` text light in light mode; verified "0 dark-on-black elements."
- **708d85b** (17:48) same class of bug on the Cast popup ("its (correctly darkened) text went dark-on-dark") → white card, gold step-numbers, solid gold 'GOT IT' button.
- **44ea8e8** (18:35) "Light-mode sweep: white-ify all modals, popups & dark holdouts" — a "Proactive audit (gradient-aware dark-on-dark detector) of every modal, popup, and collapsible panel." Fixed: all five modals (LOG MOW/SERVICE/HOURS/purchase/cart) — previously "a dark gradient sheet with an invisible dark title"; the footer "MASTER THE MASTER" tagline strip ("was a near-black dark island at the bottom"); WU 'recognized' stars darkened for contrast; the Simulate button red bumped to #ff6262; and the Beehive setup terminal boxes deliberately kept "solid dark (#0d1117) so the green commands read like a proper terminal in both themes."

### 2026-06-30 — Lucky Mike archived as QUEUED; deal economics locked to Jeff's numbers; the water-pit radio discovery; the WHUD form; Beelink J45; the ~$40 shopping answer

#### Lucky Mike Smart Stall (morning)

Jeff brought over a horse-barn project — the **Lucky Mike Smart Stall** — that he had drafted with ChatGPT, and the explicit purpose of committing it was survival: **c8ca302** (13:09) "Archive Lucky Mike Smart Stall plan + technical review (queued, not built)" — "Preserve Jeff's ChatGPT-drafted Smart Stall project **so it survives container resets**: source .md docs, the hero photo, and the 12-page design/budget guide in docs/lucky-mike/." The commit added `INTEGRATION_NOTES.md` with an engineering review that "**corrects ChatGPT's mistakes**," itemized in the message: "architecture diagram routing cameras/Shelly through the ESP32, redundant/risky microSD + USB-power-bank backup, DS18B20 duplicate+misspelling, Phase-3 total mislabeled Phase 2, Platinum-vs-Elite name clash, Phase 4 GPS reality check," plus a mapping onto the Style A Section Kit. Status was set unambiguously: "No app code changed — **build is queued AFTER the utilities work per Jeff.**" (Files still at the 2026-08-16 tip: `docs/lucky-mike/` — `Lucky_Mike_Smart_Stall_Project_Bible_v1.0.md`, `Lucky_Mike_Smart_Stall_Project_Master.md`, `INTEGRATION_NOTES.md`, `BOM_OPTIMIZED.md`, `PRICING_AND_BUSINESS.md`, `DEAL_OPTIONS.md`, `design-budget-guide-12page.png` (12-page guide, ~2.1MB), `lucky-mike-hero.jpg`.)

**e50c9a4** (13:31) "Lucky Mike: save optimized BOM + pricing/business plan (planning docs)" — "Capture everything so the project is pick-up-ready." Site facts recorded: "**strong barn Wi-Fi + 120V outlet per stall** — so ESP32 is outlet-powered and the fan is controlled by a plug-in power-monitoring smart plug (Sonoff S31 / Shelly Plus Plug US), not a hard-wired relay. Each stall = one repeatable module. Drops microSD + power bank." `PRICING_AND_BUSINESS.md` added "labor-loaded pricing (**ChatGPT's deck had zero labor**); three go-to-market models with Model B (barn owner sells it as a paid amenity) recommended + payback math; CFO risk/ROI pitch; LLC/insurance/liability/warranty/tax checklist."

**857d825** (13:43) "Lucky Mike: add DEAL_OPTIONS.md — 3 deal structures modeled with economics" — models "what Jeff charges/makes under each structure **he proposed**": Option 1 = demand-triggered install ("Lowest risk, recommended"); Option 2 = financed purchase ("title held till paid"); Option 3 = Jeff keeps the monthly fees ("most upside, but carries CapEx/churn/support obligation"). (Archival note: this commit message contains the literal text "barn owner pays /bin/bash until a boarder wants it" — **INFERRED:** the "$0" in the intended sentence was mangled by shell interpolation when the commit message was written; the actual `DEAL_OPTIONS.md` at that commit reads "**Barn owner:** $0 risk — pays only when a paying boarder is lined up.")

**fa282f1** (14:00) "Lucky Mike: lock deal economics to Jeff's numbers ($50 trip, $40/mo)" — Jeff supplied his pricing: "**$50 flat trip charge + $40/mo boarder fee**, plus a recommended **$300/stall build fee** (Jeff to adjust)." The doc added "the key '**who keeps the $40/mo**' fork and a Split ($25 Jeff / $15 barn) model. At $40/mo the recurring is ~3-6x the one-time over 5 yrs, so the doc frames it as money-now-and-walk-away (Opt 1) vs money-over-time-and-own-support (Opt 3/Split), with a recommendation to **start at Option 1 and grow into recurring deliberately.**"

**6c2d8c3** (14:03) "add real minimum per-stall parts cost (~$90 single / ~$75 barn-qty)" — "Real floor is **~$87-96 single-buy / ~$69-76 in barn quantity** — vs the padded $150 used in the deal-economics docs" (shared UPS "absorbed by Jeff, excluded"). **4d78cad** (14:11) "factor multi-pack pricing + parts-on-hand into per-stall cash risk" — the cash-risk ladder: "**~$90 one-off retail → ~$63 multi-pack → ~$50 multi-pack + on-hand boards/wire** (Jeff stocks ESP32s/jumpers from other builds). **Camera (~$33) is the irreducible floor.** Re-locked DEAL_OPTIONS at $90 parts (conservative) and noted the real ~$50 marginal cost lifts every take ~$40/stall and roughly halves payback." The final `DEAL_OPTIONS.md` numbers (in the doc at tip): Option 1 installed price ~$440/stall (round $450) → "~$350 over parts, that day" (~$58/hr for ~6 hr); each additional stall same visit ~$275; a 6-stall barn ≈ $1,815 revenue / ~$1,335 take (~$67/hr); Option 3 five-year per-stall ≈ $2,060 net with ~10-week cash payback; Split ≈ $1,160 net to Jeff + $900 pure amenity profit to the barn owner; and "**No single-stall scenario loses money.**"

#### Afternoon/evening: the water-pit radio finding and the meter-identity resolution

**9fefa97** (17:05) "Memory: confirm meter data + log critical water-pit radio finding" — from "Jeff's clear 2026-07 meter photos" (so labeled in the commit; the photos were taken/shared ahead of the utility call):

> "- Water: Kamstrup flowIQ 2100 confirmed — S/N 25394131, Con 0100200123033, Ver K1, reading 12636.56 gal, mfg 2023.
> - **CRITICAL: a SEPARATE external AMR radio (white pit module, MODEL 100WD, EFW-1300-401, endpoint 79453337, FCC ID EFW..., IC 8640-100WD) is WIRED to the Kamstrup register — likely how the utility actually reads it. May change the decode path from Kamstrup wM-Bus to the MIU's protocol.** Updated the utility-call script to ask which radio is read + get the AES key in hex.
> - Gas: meter body confirmed = Elster American Meter AC-250 (Piedmont #T821986, serial 10M225478); still need the gas radio module ID before assuming Itron."

This finding mattered because the entire planned decode path (Kamstrup wM-Bus + AES key) might be moot if the utility reads the separate pit radio instead.

**37d814f** (19:33) "Add rebuilt WHUD water-meter data request form (v2)" — the AES-key request to White House Utility District became a proper printed form: "Form WM-AMR-01 rev 2, **pre-filled from Angela's bill** + the meter photos: account 00710690-02, customer 60556, meter ID/serial 25394131, Kamstrup flowIQ 2100 (not '621'), and the pit radio module (model 100WD, endpoint 79453337). Re-aimed the questions at the real situation: **WHICH radio the District reads (Kamstrup wM-Bus vs Itron-style ERT) and whether it's encrypted — so the AES key is only needed if they actually read the Kamstrup radio.** HTML + printable PDF in docs/utilities/." **0005662** (19:41) condensed it to a single Letter page (0.25in margins, scaled, "Content verified not clipped"). Both files remain at the tip: `docs/utilities/WHUD_Water_Meter_Data_Request_v2.html` / `.pdf`.

**719638f** (19:44) "Memory: confirm gas = Itron 100G ERT; clarify gas-vs-water radio attribution" — "Per Jeff's photo labeling: the **ITRON 100G DATALOGGING ERT** label (FCC EO9100GDLA, IC 864D-100GDLA, ERT ID ...333930...) is the **GAS meter's built-in radio — confirmed, unencrypted, no key.** The WATER side is the Kamstrup flowIQ 2100 + the separate 100WD pit module (endpoint 79453337), **likely the Itron 100W water sibling** (FCC may be EO9, read as EFW on the dirty label). Cross-referenced both sections so the two modules can't be confused next session."

#### Night: architecture questions answered — Beelink J45 and the one-dongle shopping answer

- **42e84f3** (21:04) "Memory: add reader-box placement + remaining-hardware notes" — "reader box is Wi-Fi so it goes where it best hears the meters (not by the HCC); **gas easy, water pit is the hard one**; parts beyond ESP32+CC1101 (USB power, jumpers, 915 antenna/pigtail, enclosure, no level shifter); and the two radio paths (ESP32+CC1101 for Kamstrup wM-Bus vs RTL-SDR+rtlamr for the confirmed Itron ERT gas/likely water)."
- **5102f14** (21:12) "Memory: clarify Beehive/HA needs a radio; RTL-SDR-into-HA-host option" — "Beehive (HA) is the hub/display **with no radio of its own** — it needs a receiver. Added the shortcut: an RTL-SDR can plug straight into the Beehive host (Pi/NUC/HA Green) via rtl_433/rtlamr IF Beehive is within range of the meters, avoiding a separate ESP32 box. TODO: confirm Beehive's hardware + physical location vs the meters."
- **eec485a** (21:17) "Memory: store Beehive hardware = Beelink J45 (Gemini) x86 mini-PC" — the TODO resolved the same evening: "Beehive runs on a **Beelink J45 (Intel Pentium J4205, ~8GB/128GB, x86), SN 4205HQBG40244**. x86 with USB → can host an RTL-SDR directly (rtl_433/rtlamr)… no separate ESP32 box needed, provided HA passes USB through (bare-metal/supervised, not a no-USB VM) and the box is within range of the meters. Resolves the earlier 'what does Beehive run on' open item."
- **ae337d4** (21:18) "Memory: log the shopping answer — **one RTL-SDR dongle (~$40) is the only new buy**" — the whole meters research track collapsed to a single purchase: "**RTL-SDR Blog V4 kit** into the Beelink is the universal receiver: gas Itron ERT now (no key), water either way (Itron ERT no key, or Kamstrup wM-Bus via wmbusmeters + AES key), tunes 868 & 915. **Beelink + ESP32 + CC1101 already owned (CC1101 = backup).** Optional outdoor 915 antenna only if water reads weak."
- **711bad8** (21:38) "Memory: add J45-as-brains architecture map + flag HA setup as foundational TODO" — the period's closing commit documented how everything connects to the J45: "USB radio sticks plug in (RTL-SDR now, Zigbee/Thread later), but most devices (cameras/thermostat/irrigation/alarm/ESP sensors) join over Wi-Fi or cloud — e.g. **Blink is cloud-only, which is why it can't cable into the J45.** Flagged that **the J45/HA install is NOT yet set up correctly; target = HA OS bare-metal for add-ons + USB; do this before adding more.**"

### Decisions made or rejected in this period

1. **GPS map uses the real property aerial, fixed and calibratable** — never rotated/stretched; user calibration via tapped reference points stored in localStorage; track in Toro red #cc0000 (c5ac967, 2026-06-25). Later caveat: "GPS map still needs a REAL calibrated property aerial, not the AI one" (e0c3666, 06-28).
2. **B-Hyve credentials moved from Cloudflare-only env vars / PIN prompt to localStorage form** with request-body pass-through and env-var fallback (080e9a6, 06-25). The blocking `irrPin()` prompt was removed entirely.
3. **Blink integration files vendored into the repo** — after ten installer iterations, install-time downloads (local copy, then GitHub raw, then GitHub API) were all rejected in favor of bundling all 12 files (e830083, 06-25).
4. **CF Workers rejected as a WebSocket client** for B-Hyve control; the browser opens the socket itself with a token from `?tk=1` (c4d32e6, 06-26).
5. **LUX backend = Azure AD B2C (connecteddevicesjci.b2clogin.com, client b335ca43-3bde-4406-b281-8816afb7cc91) + www.myluxstat.io** — after rejecting integration.lux-geo.com (DNS dead) and api.geotogether.com ("UK smart meters — completely wrong") (9eaabcb, 06-26). Written into CLAUDE.md as "DO NOT CHANGE UNLESS BROKEN" (c72c8a8).
6. **LUX writes are POST /api/device, not PUT** — "PUT was always returning 500 (wrong method for this API)"; order is POST first, PUT fallback (b360583, 06-26).
7. **Service worker is network-first for HTML** — cache-first rejected because "no code fix ever reached the device" (19dd459, 06-26). A never-again rule in practice.
8. **In-app browser voice control rejected and removed** — "unreliable on iOS and could hand audio to Siri"; Jeff talks to real Alexa via an app-launch button instead (e2f5889 → 9a2adc6, 06-26/27).
9. **Weather forecast source: Weather.com TWC 10-day chosen (d44baf3), then rejected same day for Open-Meteo** when the TWC/WU key rate-limited (5fc66bd, 06-26).
10. **Radar basemap: CartoDB rejected (free-tier restrictions), ESRI tried, OSM+invert tried, CSS invert rejected (blanked tiles on iOS), hand-built Leaflet+RainViewer ultimately rejected entirely for the embedded Windy iframe** (7897790 → 5fc66bd → 4c88027 → c294216 → db575f8 → b34472c, 06-26→06-29). RadarScope link rejected — "was landing on a Zendesk help page, not radar" — replaced with NWS Radar (b34472c).
11. **`window.open` banned for external links in the installed iOS PWA** — real anchors only (c294216 + codified in 8b4c8a0's rules, 06-28).
12. **"Jeff wired his own house — no electrician suggestions"** (731d435, 06-27): "Do NOT suggest hiring an electrician. Treat him as a capable peer on electrical work; give real wiring detail." Replaced a three-minute-old "Recommend an electrician" caution. Also refined: Jeff is learning the software/AI side, but "on hands-on hardware/electrical/firmware he is experienced."
13. **Electric monitor: Shelly EM Gen3 rejected (80A/channel too small for 200A mains) → Shelly Pro 3EM-400 (~$140) recommended → REJECTED by Jeff in favor of building his own**: ESP32 + ATM90E32AS on the CircuitSetup open-source design, ~$90–110 DIY, 200A split-core CTs (not Rogowski), 2× 9V AC-AC wall-warts (9ced08f → 2c91e09 → 739e715, 06-27). Then upsized to the 6-channel board for per-appliance breakout (b243228).
14. **No panel-level switching / smart breakers — rejected to save money**: "House is nowhere near capacity… Cooking/laundry = MONITOR ONLY (never auto-energize a stove/oven). Told Jeff to skip smart breakers/panel relays = saves money" (b243228, 06-27). Control lives at the LUX thermostat (A/C) and wall switches/plugs (lights), never at the breaker ("whole-circuit kills smart bulbs").
15. **Bake-in shortlist for the one panel-open install** — Jeff's "do now" list: spare CT on well pump + DS18B20 panel-temp probe (~$3) + motorized water-main ball valve (~$50) (739e715, 06-27).
16. **Hero-grade module is the gold standard** — one shared cinematic grade + vignette + `applyHeroGrades()`; "Never add a per-hero `filter:`" (1a98f28/43520a5/ebedb85, 06-28). Later evolution: grade values eased to near-neutral once Jeff's own pre-graded full-res images landed (0f10f0c, c17e0a3).
17. **Consistency Lock**: status tokens `--ok/--warn/--bad/--info`, `statusColor()`, per-section `--a-<id>` accents, and the Section Kit — "Don't introduce a new green/yellow/red… Don't invent a new card/banner/button style" (8b4c8a0, 06-28).
18. **CLAUDE.md memory-hygiene Rule #11** (a4ae337, 06-28): stay lean, well under ~600 lines, one-line changelog entries, "detail lives in git" — immediately bounded by the **PROTECTED rule** (1305f0a): "Jeff's Message," "The Working Relationship," and the Mandatory Rules are "NEVER trim or compress… They are the point of the whole project."
19. **Default theme = LIGHT** with a persistent toggle (28d79c6, 06-29), and **Jeff picked "Style A (Apple Clean)" from three rendered mockups** — one system font everywhere, white top-to-bottom, killing the Georgia-serif/sans mix that made the UI look "choppy" (8ac220a, 06-29).
20. **No fake cast button** — since iOS won't let a web app start mirroring, ship an honest step-by-step AirPlay/HDMI sheet instead (0644ccf, 06-28).
21. **Lucky Mike Smart Stall: archived as QUEUED, not built** — "build is queued AFTER the utilities work per Jeff" (c8ca302, 06-30). ChatGPT's plan corrected (architecture, microSD/power-bank backup dropped, zero-labor pricing fixed); ESP32 outlet-powered per stall; fan via power-monitoring smart plug (Sonoff S31 / Shelly Plus Plug US) rather than a hard-wired relay.
22. **Lucky Mike deal economics locked to Jeff's numbers**: $50 flat trip charge, $40/mo boarder fee, recommended $300/stall build fee (Jeff to adjust); real parts ~$90/stall single-buy, ~$75 barn-qty, ladder down to ~$63 multi-pack and ~$50 with on-hand parts, camera ~$33 irreducible floor; padded $150 parts figure retired; recommendation = start at Option 1 (demand-triggered install, "barn owner keeps the $40") and "grow into recurring deliberately" (fa282f1/6c2d8c3/4d78cad, 06-30). "No single-stall scenario loses money."
23. **Water meter identity corrected twice**: "Kamstrup 621" → **Kamstrup flowIQ 2100** (76d0326, from photos), and the decode plan reopened by the discovery of the separate **100WD pit radio** wired to the register (9fefa97, 06-30) — the WHUD form was re-aimed to ask *which* radio the District reads before chasing the AES key (37d814f).
24. **Gas radio confirmed Itron 100G Datalogging ERT — unencrypted, no key needed** (719638f, 06-30); electric meter confirmed **Landis+Gyr Gridstream RF — unreadable by CC1101/rtlamr, irrelevant because the CT build reads the panel** (76d0326, 06-27; the ZigBee HAN path judged "not worth chasing").
25. **The shopping answer: one RTL-SDR Blog V4 dongle (~$40) is the only new purchase** — plugged into the already-owned Beelink J45; the already-owned ESP32+CC1101 demoted to backup (ae337d4, 06-30).
26. **Foundational TODO flagged**: the J45/HA install "is NOT yet set up correctly; target = HA OS bare-metal for add-ons + USB; do this before adding more" (711bad8, 06-30).

### Problems, failures & root causes in this period

1. **B-Hyve `invalid_auth` (carried in from 06-24).** Symptom: HA config form rejected valid credentials; earlier shotgun attempt tried "all API URLs x app IDs." Real root causes (three, stacked): the API had **moved** from api.orbitonline.com (404) to api.orbitbhyve.com (d56d92b); the new API requires a `{"session": {...}}` wrapper body — bare email/password returns 400 `disallowed-key` (c203988); and the new API **rejects** the old `orbit-api-key`/`orbit-app-id` headers, needing browser headers + `Orbit-Session-Token: ""` instead (77c70e7). A stale `BHYVE_PASSWORD` Cloudflare secret added noise (a887b62, 84e1ea2).
2. **Blink 2FA dialog never appeared.** Symptom: "SMS code arrived but no dialog appeared." Wrong attempts: ten installer iterations fighting the delivery mechanism (hardcoded paths, GitHub downloads, no python3 in the Terminal add-on, BusyBox sed lacking `2i`, hangs, missing files). Real root cause: `BlinkTwoFARequiredError` is a subclass of `LoginError` in blinkpy 0.25.x, and the catch-all handler converted it to `InvalidAuth` before the 2FA step could trigger. Fix: re-raise it first (b89ba28); plus surface silent `blink.start()` failures as `ConfigEntryAuthFailed` to trigger HA's re-auth flow instead of "a silent infinite retry loop" (dbc8fbe).
3. **Irrigation buttons threw "Fetch API cannot load: wss://…".** Root cause: Cloudflare Workers can't open outbound WebSockets via `wss://` in fetch() — must use `https://` with an Upgrade header (de85497). Even then the Workers-side socket was unreliable (`ws_timeout`); patched with fallback timers (1d89611), then properly fixed by moving the WebSocket into the browser with a token endpoint (c4d32e6).
4. **LUX: three wrong backends.** integration.lux-geo.com didn't exist (CF 1016 DNS); api.geotogether.com 403'd through four login variants and a Go-source-derived endpoint correction before being recognized as "UK smart meters — completely wrong." Real backend found in the luxgeo PyPI package source: Azure AD B2C PKCE + www.myluxstat.io (9eaabcb). Then a data-shape bug: `userData.location` is an array, not an object (0c08f2f).
5. **LUX setpoint HTTP 500 — the POST-not-PUT saga.** Symptom: GET worked, any setpoint write 500'd. Wrong attempts, in order: full-state PUT instead of patch (c37317d); strip read-only fields (f09c696 — and CLAUDE.md was prematurely marked "PUT fix deployed" in b035ffb); minimal one-field body + PATCH fallback (9febaec); device ID in the URL path (35f61cc). Real root cause: **the API's write method is POST**; "PUT was always returning 500 (wrong method for this API)." Found by trying PUT/POST/PATCH side-by-side and reporting all three results (f143830 → b360583). Verified by Jeff end-to-end: setpoint 73°F from HCC appeared in the official LUX app.
6. **Radar tile failures, four rounds.** CartoDB `{r}` retina flag → @2x 404s on iPhone HiDPI (7da5113); CartoDB dark tiles restricted on the free tier → ESRI (5fc66bd); ESRI's z/y/x order needed a custom getTileUrl; OSM + CSS invert → the filter "blanked tiles on iOS" (c294216); RainViewer overlay returned "Zoom Level Not Supported" tiles (db575f8). Final fix: stop hand-building — embed Windy (db575f8, reaffirmed b34472c). Also: `ReferenceError: radarImgError is not defined` from an img onerror firing before the script defined the handler (b33b349).
7. **TWC/WU forecast API rate-limited within hours of shipping** → replaced with Open-Meteo, WMO codes mapped onto the existing TWC icon pipeline so the renderer didn't change (5fc66bd).
8. **Voice control mic failures + Siri dialing contacts.** Symptom: `audio-capture` errors, and worse — the overlay left the mic path open such that Siri could hear ambient speech and dial contacts. Wrong attempt: pre-grabbing the mic via getUserMedia to force the iOS permission dialog (b76ac20) — which was itself the root cause: "pre-grabbing the mic… then releasing it left the mic busy on iOS, so SpeechRecognition failed" (e2f5889). Interim fix: safe tap-to-run panel. Final resolution: the entire in-app voice engine removed — "unreliable on iOS and could hand audio to Siri" — replaced by a real-Alexa launch button (9a2adc6).
9. **Fixes never reaching Jeff's phone.** Root cause: service worker cache-first on index.html — "the old cached copy ran forever and no code fix ever reached the device — including the voice mic fix." Fix: network-first for HTML, cache bump to hcc-v6 (19dd459). This explains some of the repeated "still broken" loops earlier in the period.
10. **Forecast swipe hijacking navigation** — horizontal swipes inside the forecast scroller triggered section navigation ("accidentally jumps to Irrigation"); fixed by tracking whether a scrollable ancestor actually scrolled during the gesture (4c88027).
11. **Wrong hardware assumptions corrected by photos.** "Kamstrup 621" was actually a flowIQ 2100; the electric meter was assumed Itron/ERT-readable but is Landis+Gyr Gridstream RF (closed mesh, CC1101 useless against it); the gas meter body is an Elster AC-250 with the Itron 100G ERT as its radio (76d0326, 9fefa97, 719638f). Lesson visible in the record: physical photos beat spec-sheet assumptions, and each correction was written to memory the same hour.
12. **The panel-scorching over-flag.** The 76d0326 photo review flagged "possible scorching near center breakers" on the Challenger panel as a safety item. Jeff corrected the record: the discoloration predates his ownership, was inspected by the home inspector and by Jeff, the affected section was abandoned with breakers relocated down, "stable and fine for 10+ years." Memory rewritten with an explicit anti-repeat instruction: "do NOT re-flag as a new hazard" — the DS18B20 probe is "PEACE-OF-MIND… not because of an active problem" (81e32b8).
13. **Light-mode regressions from the theme pass.** The global `.meter-num` darkening killed text on the always-black LCD meter panels ("the earlier auto-scan misread them as 'light'") (70643a4); the Cast popup went dark-on-dark (708d85b); the NWS alerts card turned "muddy brown" (acb4123). Systemic fix: a gradient-aware dark-on-dark detector audit across every modal/popup/panel, Playwright-verified (44ea8e8).
14. **ChatGPT's Lucky Mike plan had real engineering errors** — cameras/Shelly routed through the ESP32 in the architecture diagram, a "redundant/risky" microSD + USB-power-bank backup scheme, a DS18B20 duplicated and misspelled, a mislabeled phase total, a tier-name clash, an unrealistic Phase-4 GPS idea, and pricing with zero labor. All corrected in `INTEGRATION_NOTES.md`/`PRICING_AND_BUSINESS.md` before any money moved (c8ca302, e50c9a4). The padded $150/stall parts figure was also walked down to the real ~$90/~$75/~$63/~$50 ladder (6c2d8c3, 4d78cad).
15. **The water-pit radio discovery reopened a "solved" problem** — the AES-key plan assumed the utility reads the Kamstrup's own wM-Bus radio; the photos revealed a separate wired 100WD pit module ("likely how the utility actually reads it. May change the decode path"). Rather than guess, the WHUD request form was rebuilt to ask which radio is read and whether it's encrypted, making the AES key conditional (9fefa97 → 37d814f). The record at 2026-06-30 leaves this question open, pending WHUD's answer.


---

## Chronicle: 2026-07-01 → 2026-07-06 — meters live, the /api/ha proxy, hour calibration

This six-day window (71 commits on `origin/claude/time-master-project-liq1jw`, from `9a9da77` 2026-07-01 00:25 UTC to `f0a9199` 2026-07-06 21:28 UTC) is one of the densest and most consequential stretches of the whole project. In it: the B-Hyve watering-history mystery was solved (twice — first declared a dead end, then correctly reversed); the water-meter AES blocker evaporated when a WHUD supervisor told Jeff in person that his meter is unencrypted; J45 was wiped of Windows and became a standalone Home Assistant OS box; water and gas meters went LIVE into the app; Nabu Casa gave Beehive a public URL; a self-inflicted timeout regression produced a false "Beehive Offline," which led directly to Jeff's angriest and most important standing rule (the PROTECTED Debugging Protocol, `f668301`) and to the architectural fix that ended the whole class of connectivity bugs (the server-side `/api/ha` proxy, `7a59848`); the Blink camera login was root-caused to a stale blinkpy; the app's sections were restructured with zero duplicate IDs; the HOME GUARDIAN section was born; and the mower finally got a Master Hour Calibration so its hour meter could be trusted again (set to 9.2 h).

All timestamps below are UTC from `git log --date=iso`. Every commit in the window is listed. 2026-07-05 has zero commits — the record is silent for that day.

### 2026-07-01 — B-Hyve history solved, the water-meter blocker dies, HOME grows a Dispatch card and a redefined panic

#### Overnight: J45 committed to Beehive; the working model written down

**`9a9da77`** (00:25) — "Beehive: confirm J45 dedicated + add HA OS install guide; note working model." The J45 mini-PC was confirmed as dedicated to Beehive (the household Home Assistant instance): the plan became *wipe Win10, install HA OS to internal eMMC*. A step-by-step guide was added at `docs/beehive/HA_OS_setup_J45.md` (backup → Ubuntu live USB → flash HA OS to internal → restore). Just as important, the commit recorded the division of labor explicitly:

> "Also recorded how Claude works: it operates in the app's cloud code workspace, not on Jeff's home-LAN machines (J45/'the beast'); it guides, Jeff executes. 'The beast' = Jeff's main PC, used as the workbench to make the install USB."

#### The B-Hyve watering-history saga (02:46 → 03:58 — dead end declared, then reversed within twelve minutes)

This is a textbook example of why "the record is silent / the record was wrong" matters. Nine commits in about 70 minutes:

- **`4b0d00e`** (02:46) — "Weather + Irrigation fixes: lightning near-term risk; B-Hyve watering history." Two fixes. (1) Lightning risk had read RISK "if ANY thunderstorm code appeared anywhere in the next 24h — in TN summer that's almost always true, so it read RISK constantly." Rewritten to current-hour alignment gated by precip probability: RISK if storms likely within ~6h, POSSIBLE if later in 24h, else NONE — verified with a unit test. (2) The B-Hyve device object has no 'last watered' field, so the card always showed 'No history'; `/api/irrigation` was extended to fetch a `/watering_events` endpoint to derive `last_watered` + a `history[]` array.
- **`adc5377`** (02:53) — "mPING: replace dead in-app submit form with official-tool link button." The mPING submit form couldn't work without an NSSL-issued API token ("not self-serve"); it "just showed 'token not configured'" and was swapped for a solid-orange "Open mPING to Report" button to the official NOAA/OU site. Spotter credit `jlo301` kept.
- **`7308c23`** (03:08) — "Readiness: heat/wind warnings = caution not hard-block; irrigation debug endpoint." Ready-to-mow policy change: an active NWS *warning* used to force NOT READY; now only true "don't be outside" hazards (tornado, severe thunderstorm, flash flood, hurricane, extreme wind) hard-block, while heat/wind drop to MOW WITH CAUTION with a "mow early AM or evening, avoid peak heat" note. Also added `?debug=1` to `/api/irrigation` trying multiple history endpoints so the last-watered field "can be pinpointed in one look."
- **`6b29cad`** (03:11) — "mPING: restore in-app report form (icons + GPS + submit)." Direct reversal of `adc5377` eighteen minutes earlier, on Jeff's instruction: "Jeff wants the in-app reporting back." The original icon grid/GPS/submit UI was restored byte-exact from git `4b0d00e`; the only missing piece was the NSSL token (`MPING_TOKEN` env var).
- **`f935e31`** (03:12) — "Add mPING token setup guide (NSSL email + Cloudflare env var steps)."
- **`61692a7`** (03:27) — "Irrigation: read last-watered from device status (watering_status/statuses)." Debug output from Jeff's device showed `/watering_events` 404'd, so the code pivoted to `status.watering_status` / `watering_statuses`.
- **`158666a`** (03:37) — "Irrigation: add compact ?debug=2 text view (screenshot-friendly)." The full `?debug=1` JSON was "too long to screenshot (bloated by zone image URLs)"; `?debug=2` gave a tiny plain-text summary "so Jeff can send one small screenshot to pin the exact last-watered field." (Note in hindsight: this whole loop of asking Jeff for screenshots is exactly what the 07-03 Debugging Protocol would later outlaw.)
- **`2a2eb76`** (03:42) — "Irrigation: honest last-watered (self-tracked) instead of 'No history'." The dead-end verdict, stated flatly: "Confirmed from Jeff's device: B-Hyve's REST API does NOT expose watering history — watering_statuses is [], watering_status is just {clear_on_idle:true}, no history endpoint." The app fell back to self-tracking observed runs and showing a muted '—'. **`d5df6e9`** (03:42) recorded this "definitive" finding in memory — "definitive" for exactly eleven minutes.
- **`379b13d`** (03:53) — "Irrigation: fix watering history endpoint to /watering_events/{device_id} (path, not query)." The reversal, found by reading open-source code instead of poking the API blind:

  > "Web research (pybhyve / bhyve-home-assistant) confirmed the real B-Hyve history endpoint puts the device id in the PATH: GET /v1/watering_events/{device_id} (with pagination). My earlier ?device_id= query form 404'd — that was the whole problem. … So the history IS pullable after all."

  **`1d23b5d`** (03:54) corrected the memory file ("endpoint found (path form), not a dead end"), and **`b947011`** (03:58) confirmed it live: "irrigation Last Watered confirmed working (reads 7:30 AM)."

#### Morning: the sewer-reimbursement plan and the AES-key storage decision

- **`95eadf9`** (10:09) — "docs: add irrigation gallons model + sewer reimbursement plan." Captured Jeff's plan "to convert B-Hyve run-time history into gallons/cost via per-zone GPM calibration from the water meter (once live), plus the sewer-deduct / 3-year reimbursement claim strategy (WHUD bills sewer at ~2x metered water with no sewer meter; irrigation water never enters sewer)."
- **`50b56c1`** (10:13) — "docs: sewer authority = City of White House (not WHUD), no seasonal rate." Jeff corrected the target of the claim: "WHUD handles water and has a seasonal irrigation sewer rate; the City of White House handles sewer with no seasonal rate. Aim the overcharge claim at the City. He's already written them (no response) and contacted his alderman (~2yr ago, stalled) — stronger meter data is the lever."
- **`75c1a27`** (10:28) — "docs: record AES meter-key storage decision (Apple Passwords, not Cloudflare)." The full rationale: "Key is saved in Jeff's Apple Passwords (readable, encrypted, syncs). Operational home once J45 is set up = HA secrets.yaml (wmbusmeters). Not Cloudflare — app code can't reach the J45 decoder and encrypted CF secrets can't be read back. Never commit the key itself."

#### Afternoon: the water-meter blocker RESOLVED in person

**`5034f26`** (15:44) — "docs: water meter blocker RESOLVED - unencrypted Itron ERT-SCM, no key needed." A human breakthrough, not a code one:

> "WHUD meter supervisor briefed Jeff in person. Water meter is read via the unencrypted 100WD MIU (endpoint 79453337, protocol ERT-SCM, ~915-930 MHz, SCM every minute + hourly big read). No AES key required. Reports European time — convert to Central in code. Both gas + water now read by one RTL-SDR + rtl_433; CC1101/ESP32/AES stack demoted to backup path."

The entire encrypted-wM-Bus/AES-key workstream (including the key so carefully stored in Apple Passwords five hours earlier) became a backup path in one conversation at the utility office.

#### Evening: Utilities strip, Dispatch card, panic redefined, DIY Zigbee alarm

- **`3b8b61a`** (16:25) — "feat(home): add Utilities strip - Water / Gas / Electric branded cards." Three branded cards (White House Utilities water, Piedmont Natural Gas, CEMC electric) — "the 'place for the data to sit.'" Deliberately wired with "explicit UTIL_ENTITIES ids (all null for now) so there are no false readings from accidental entity matches," showing "Waiting for Beehive meter reader" placeholders until the RTL-SDR was live.
- **`b2bbe91`** (18:12) — "feat(home): add White House Dispatch contact card below the hero." A branded tap-to-call directory with percentage-positioned hotspots. Safety design decision baked in: "the red EMERGENCY bar does NOT auto-dial 911 (avoids accidental calls). It triggers the existing panic protocol (hccPanic) which shows a confirmation before alerting Beehive." The separate panic button in the Safety section was removed so there is exactly one emergency control. Verified "no raw tel:911 anywhere."
- **`7a5e984`** (18:15) — "feat(panic): redefine panic → sirens + lights + alert family (no 911 auto-dial)." Panic's meaning was permanently redefined: "Panic now signals Beehive to sound the alarm sirens + strobe lights and alert Jeff, Angela & Braxton" (POST `{action:panic,siren,lights,notify:[...]}` to the `hcc-panic-button` webhook). Off-network it honestly says "couldn't reach Beehive — call 911." Explicit: "Does NOT dial 911 (Jeff handles that himself)." Added `docs/beehive/panic_alarm_automation.md` with the ready-to-drop HA automation (siren + light strobe + Critical push to 3 phones, optional Twilio voice call).
- **`9e6cea1`** (18:18) — "fix(home): sharpen White House Dispatch image (q0.86 -> q0.95)." First encode over-compressed the artwork (gold text/gradients went soft); re-encoded 320KB → 511KB.
- **`4c9cf03`** (18:20) — "docs: clarify alarm = DIY Zigbee build (not a commercial panel, not bought yet)." The alarm was pinned as a DIY build: Zigbee coordinator stick into a free J45 USB port + Zigbee siren/contacts/motion/leak sensors via Zigbee2MQTT or ZHA, sequenced after J45 + RTL-SDR meters. "Panic button is already wired for it."
- **`6837d2d`** (18:35) — "docs: add Beehive safety/alarm shopping list + myQ (ratgdo) notes." Shopping list priorities: life-safety sensors (smoke/CO/gas/leak/freeze) first, "lean intrusion (key doors + a few motions)," water-main auto-shutoff, and garage door via ratgdo because "myQ cloud is blocked from HA, so go local."
- **`ac3abdb`** (18:54) — "fix(home): utility banners show full image (no crop) + safety module refs." The 104px cover-crop "was cutting off logos/taglines on-device" → full-aspect banners. Two PLANNED safety modules added to HOME (Zigbee alarm layer, ratgdo garage). Also documented the upstream Blink 2FA breakage "as a STANDING per-session reminder to check for the fix (tracks HA issues #173419/#173520/#168029, blinkpy #1217)" — the thread that pays off on 07-03.
- **`98b9fd9`** (23:38) — "docs: J45 progress — backup done, Ubuntu 26.04 boot stick made." One real-world snag recorded: "diskpart clean fixed the stuck protected partition; stick written via Rufus. Next = boot J45 from stick, flash HA OS to internal, restore backup."

### 2026-07-02 — J45 becomes an HA OS box; water + gas meters go LIVE; first "Beehive Offline" root-cause analysis

- **`9100fcc`** (00:07) — "docs: RTL-SDR needs no Windows drivers for HA (rtl_433 add-on has the driver)." Jeff had found a Windows SDR#/Zadig/WinUSB guide; the commit heads off that detour: "that's the wrong path for our setup. The dongle goes into the J45 (HA OS) and rtl_433 add-on provides the Linux driver; HA auto-detects it." Zadig only for an optional bench test on the beast.
- **`4e75b37`** (01:00) — "assets: save Security section hero art + note it as the build blueprint." `images/hero-security.jpg` ("Smart Security Systems / Security Command Center") saved with the note that its phone-mockup doubles as the blueprint for a future SECURITY section — which materializes on 07-04 as HOME GUARDIAN.
- **`f39b125`** (19:35) — "docs: J45 migrated to internal drive + RTL-SDR meter setup guide (no drivers)." The milestone: "J45 now boots HA OS 18.1 standalone off the internal SSD (foundational fix done)." (Note: `9a9da77` said "internal eMMC," this says "internal SSD" — the record uses both terms for the internal drive.) Added `docs/beehive/rtl_sdr_meter_setup.md` covering the rtlamr2mqtt path for the unencrypted Itron ERT water (79453337) + gas, MQTT + HA autodiscovery, mapping to HCC UTIL_ENTITIES. "Still need the full gas ERT ID." The backup→wipe→flash→restore sequence begun on 07-01 (`98b9fd9`) completed here.
- **`0f94198`** (21:26) — "docs: water + gas meters LIVE via rtlamr2mqtt (confirmed IDs + protocols)." The payoff: "Both meters reading into Beehive: water 79453337 = scm+ (key: not plain scm), gas 33393066 = scm (full ID confirmed off the Itron 100G barcode). Publishing every 60s to sensor.water_meter / sensor.gas_meter." The working config and listen-mode discovery method were saved.
- **`86c1990`** (21:36) — "docs: confirm meter calibration vs physical dials (water /10 gal, gas /100 ccf)." Validation against the physical meters: "Water raw 129105 -> 12,910.5 gal (LCD 12,914.94, gap = usage + resolution). Gas raw 883384 -> 8,833.84 CCF (matches the 4 dials)."
- **`3842303`** (22:59) — "feat(home): wire Utility cards to live water + gas meter readings." `loadUtilities` auto-finds the rtlamr2mqtt sensors by name, formats "water raw /10 = gallons (flowIQ 2100), gas raw /100 = CCF"; card flips to LIVE. Verified with mocked HA states: water 12,916.7 gal, gas 8,833.96 ccf.
- **`8966ee4`** (23:02) — "fix(weather): hero temp now matches the card (real station, not forecast)." The hero showed the cooler Open-Meteo forecast while the mow card showed the real KTNWHITE21 station ("hero 80 vs card 91"); a MutationObserver kept mirroring the forecast onto the hero. Fix: `loadStation()` also updates `heroWeather` so all three read the same 91°F.
- **`f3ebdc9`** (23:09) — "feat(weather): extreme heat downgrades mow verdict to CAUTION." Heat index ≥103°F (Heat Stress = EXTREME) downgrades "GOOD TO MOW" to "MOW WITH CAUTION" with a "mow early AM or evening" note, applied in `applyMowVerdict` as the single source of truth.
- **`746ae94`** (23:10) — "docs: log app meter wiring + weather hero/heat fixes." (doc sync, no body detail)
- **`f754540`** (23:19) — "docs: system audit + roadmap (app<->HA connectivity fix, HA build-out plan)." The first correct diagnosis of the "Beehive Offline" class: "the root cause of 'Beehive Offline' in the app: the https PWA can't fetch the local http HA (mixed content / LAN-only). Fix = give HA a public https URL (Nabu Casa or Cloudflare Tunnel), then point ha_base at it."
- **`5e6c20b`** (23:51) — "docs: Nabu Casa connectivity in progress + mPING is a dead end." Two decisions: Nabu Casa (HA Cloud) chosen for the public URL ("so the app shows online and reads meters off-WiFi (+ easy Alexa/announcements)"), and mPING finally, definitively killed: "NSSL confirmed no automated/app reports ever, so repurpose that card to the official mPING app instead of chasing a token." This settles the 07-01 back-and-forth (`adc5377` → `6b29cad` → `f935e31`) for good: the in-app form Jeff had asked to restore could never work — NSSL simply does not issue tokens.

### 2026-07-03 — the marathon day: Nabu Casa online, the false-offline regression, the /api/ha proxy, Jeff's standing rule, Blink root cause, bill-validated water costs (24 commits)

#### Midnight–02:36: getting Beehive online for real

- **`947a99d`** (00:08) — "mPING: direct link to official app; wire app to Nabu Casa remote URL." The mPING in-app submit UI, handlers, CSS and `/api/mping` call were all removed (per NSSL's confirmation); and `HA_NABU` (the Home Assistant Cloud remote https URL) became the primary HA base "so the https app can reach Beehive (fixes mixed-content 'Beehive Offline'). checkBeehive tries Nabu Casa first even with a stale cached local base, and now sends the bearer token since HA /api/ requires auth. Local IP kept as a home-WiFi fallback."
- **`e1d29b0`** (00:16) — "Utilities helper tiles + HA helpers/Alexa/weather guide." Helper-sensor tiles (water_month, water_flow, gas_month, gas_cost, electric_now/today/month), each "skipped silently until the helper exists." Added `docs/beehive/ha_helpers_and_alexa.md`, including the Alexa reality check: "Amazon's built-in weather intent can't be overridden — expose real sensors and use a 'weather report' Routine instead." Removed the now-dead `functions/api/mping.js`.
- **`c55d382`** (00:17) — "Pin Nabu Casa URL + WU station/key in project memory." **`b1bd4f1`** (00:35) — "Note Beehive /setup completion in project memory." (memory syncs)
- **`3043f34`** (00:42) — "Beehive connect: surface token box when offline; document CORS requirement." Two catches: a chicken-and-egg UI bug ("the box only showed once online, so with no token it never appeared — a chicken-and-egg that left no way to enter the token") and "the silent blocker that makes a valid setup still read as 'offline'": HA must allow the app origin via `http.cors_allowed_origins` in configuration.yaml.
- **`410ccc5`** (01:17) — "Log Beehive-online milestone (CORS fix confirmed) in project memory." **Beehive was online from the app for the first time.**
- **`338e2c3`** (01:37) — "Fix utility meter reading: ignore timestamp companion sensor." A great little bug: rtlamr2mqtt exposes `sensor.water_meter_reading` AND `sensor.water_meter_last_seen`; `meterRaw()` matched both by keyword and took the last numeric — "parseFloat('2026-07-03T...') = 2026, so water showed 202.6 gal instead of 12,982.5." Fix: skip `*_seen`/`*time`/timestamp-device-class entities and require a pure-numeric state. **`a101465`** (01:37) — "Doc: correct meter entity ids to *_reading."
- **`0b3de03`** (01:47) — "Weather guide: HA has no built-in WU integration; use REST sensor on our /api/weather." (Corrects `e1d29b0`'s assumption of a native Weather Underground integration.) **`5c7aadc`** (02:10) — "Log: real KTNWHITE21 weather live in HA via REST sensor (79F confirmed)." **`363ec81`** (02:26) — "Memory: pick-up-here note for next session (Alexa expose + helper tiles)."
- **`31ed0c8`** (02:36) — "Utilities: self-heal poll + distinguish unreachable vs quiet-meter." Three honest states instead of one vague "Waiting": "Reachable but meter null -> 'Meter reader reconnecting…'; Fetch/HTTP fails -> 'Beehive unreachable — retrying…'; Re-check Beehive + re-read meters every 60s so a restart recovers on its own."

#### 09:24–09:58: the regression, the durable fix, and Jeff's standing rule

- **`0f44d9d`** (09:24) — "Fix false 'Beehive Offline': per-attempt timeout, not a shared 2.5s budget." The confession is in the first line of the body: "Regression I introduced when wiring Nabu Casa: checkBeehive built ONE AbortSignal.timeout(2500) and reused it across all candidate fetches, so the 2.5s was a total budget for every attempt combined — and once elapsed, later fetches aborted instantly. Over the Nabu Casa remote relay a single /api/ call often takes >2.5s, so a perfectly reachable HA was reported offline (red dot), which also stopped the meters from loading." Fix: fresh AbortSignal per attempt, timeout raised to 9s, `r.ok` checked before parsing. **`a6d1e3b`** (09:25) recorded the regression in memory.
- **`7a59848`** (09:41) — "Route HA connection through a server-side /api/ha proxy (durable fix)." **THE architectural fix of the period** — the answer to "why is this whole class of problem possible?":

  > "The app talked to Beehive directly from the browser, which meant fighting mixed content, CORS, and the Nabu Casa relay tripping browser fetch timeouts — the whole class of 'Beehive Offline / meters Waiting' problems. Irrigation and weather never had these because they go through Cloudflare Functions (server-to-server). Now HA works the same way."

  New `functions/api/ha.js` (70 lines) proxies to the Nabu Casa remote URL server-side — "no CORS, no mixed content, 20s server timeout. Locked to Jeff's HA host + /api/ paths only." A new `haFetch()` helper routes `checkBeehive`, `loadUtilities`, `loadHomeStatus`, `loadCameras`, and `saveHaToken` through it, "passing the browser's token + base as headers (token still lives only in the browser)." Diffstat: `functions/api/ha.js` +70, `index.html` 79 lines changed. **`d6ba617`** (09:41) documented the proxy architecture in memory. Every later HA feature in the project (Guardian, Lights & Plugs, history queries) rides this proxy.
- **`f668301`** (09:53) — "Add PROTECTED Debugging Protocol: attack the source, test on my end first." The commit body: "Standing rule from Jeff (2026-07-03): stop the round-robin of pushing diagnostic checks to him. Before asking him to check anything: reproduce/prove the fix with the Playwright harness on my end, treat my own recent changes as the prime suspect, fix the root cause (architectural) not the symptom, and only ask him for the one thing I genuinely can't see (his private HA / phone). Marked PROTECTED so it's never trimmed." The CLAUDE.md text added by this commit (from `git show f668301:CLAUDE.md`) preserves Jeff's own words:

  > Jeff, verbatim (2026-07-03): *"Log this so we don't go through this kind of round robin of checks again and we attack the source… I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end."*

  The protocol itself, as written into CLAUDE.md (verbatim, condensed formatting):

  > When ANYTHING is broken or misbehaving, in this order — **before asking Jeff to check a single thing:**
  > 1. **Reproduce/verify on MY end first.** Read the actual code path end-to-end. Run the **Playwright harness** with **mocked data** to reproduce the failure and prove the fix (mock the API/HA responses, the slow-relay case, the error case). I did this AFTER Jeff called me out on the timeout bug — it must come FIRST.
  > 2. **Audit my own recent changes as the prime suspect.** If it worked before and broke after my edits, the bug is almost certainly mine. Diff my changes; don't blame his setup or his network.
  > 3. **Attack the root cause, not the symptom.** Ask "why is this whole *class* of problem possible?" and remove it. Example: browser→HA direct calls are inherently fragile (mixed-content + CORS + relay timeouts) → the fix isn't a bigger timeout, it's routing through a **server-side Function** (`/api/ha`) like irrigation/weather. Prefer the architectural fix that makes the failure impossible.
  > 4. **Only ask Jeff for what I genuinely cannot get myself,** and be upfront about that limit early. I can't see his private HA or his phone screen — the *final* "does it connect on your device" confirm is his. That's ONE look, not a chain of ten. Say plainly: "I've tested X, Y, Z on my end; the one thing only you can see is ___."
  > 5. **One specific ask, not a list.** If blocked, name the single thing I need — never a pile of "try this, then that, send me this log."
  > 6. **Match his effort to the payoff.** If I'm about to ask him to edit configs / pull logs / take screenshots, first ask: could I have caught this with my own harness? If yes, do that instead.
  >
  > **Known fragile pattern (don't repeat):** any new `fetch(base + '/api/...')` straight from the browser to HA. Use **`haFetch()`** (routes through `/api/ha`). Never hoist a shared `AbortSignal.timeout` across retries. Keep timeouts generous for the Nabu Casa relay.

  The same commit also added CLAUDE.md rule 12: "**ATTACK THE SOURCE, TEST ON MY END — never push the run-around to Jeff (PROTECTED, Jeff's standing rule 2026-07-03).** … Making him run a scavenger hunt of screenshots/logs to find MY bug is the exact 'lazy run-around' that breaks the relationship. Don't do it."
- **`586bf83`** (09:58) — "Memory: Alexa reads real weather (goal complete); refresh next-steps." Alexa reading the real KTNWHITE21 weather was declared complete.

#### 10:06–10:57: Blink cameras — wrong diagnosis, then the real one

- **`f3ae126`** (10:06) — "Blink 2FA: dedicated cookie session to fix 'empty_cookies' login failure." First theory, drawn from blinkpy #1217 / HA #173419: HA's shared aiohttp session drops auth cookies between the username/password step and the 2FA PIN step (`error_cause=empty_cookies`). Fix attempted: a dedicated client session with its own cookie jar in `config_flow.py`. Honestly flagged: "cannot be verified from the dev side — it needs a live Blink account + Amazon's auth servers." **`cb1b149`** (10:06) — "Remove stray __pycache__ from syntax check; ignore pyc" (housekeeping). **`17d388a`** (10:11) — "Memory: mark cameras (Blink) as Jeff's #1 priority; capture cookie fix + fallback."
- **`1f2cdec`** (10:31) — "Blink: bump blinkpy 0.25.2 -> 0.25.7 — the actual fix for 'Login failed'." The real root cause, found by diffing blinkpy in the harness: "Blink changed their OAuth signin to signal 2FA-required with HTTP 202 + tsv_state/tsv_methods fields. blinkpy 0.25.2's oauth_signin only recognizes the OLD 412 code, so it returns None -> _oauth_login_flow logs 'Login failed' -> ConfigEntryNotReady. That's exactly Jeff's log. blinkpy 0.25.7 added 202/tsv handling." Fix: pin `blinkpy==0.25.7` in the manifest; the dedicated-session tweak kept "as belt-and-suspenders but corrected its comment (the cookie theory was the wrong diagnosis; the 202 handling is the fix)." **`59c8749`** (10:31) recorded the real root cause in memory.
- **`4af6d72`** (10:47) — "Utilities cards: compute This-Month / Flow / Est-Cost in-app (no HA helpers needed)." "Jeff wanted the meter cards to show detail, not just the raw Reading." Rather than wait for Jeff to build HA `utility_meter`/`derivative` helpers, the app derives Flow (Δ/minutes), Month (usage since first reading of the calendar month), and gas Est-Cost (month CCF × GAS_RATE_PER_CCF, 1.10 estimate) from live cumulative readings tracked per-poll in localStorage. "HA helper sensors still win if present."
- **`e5726b9`** (10:57) — "Gas rate: set Est. Cost to sourced TN residential ~$1.12/CCF (EIA Jan 2026)." "TN residential gas = $11.23/Mcf (EIA) = ~$1.12/CCF all-in. Note: Piedmont's TN customers moved to Spire Tennessee 2026-03-31 but rates were kept the same."

#### 14:18–14:25: tap-to-call, Spire branding, the new Dispatch image

- **`88a7d13`** (14:18) — "Utility tap-to-call, mower marker icon, mow-verdict match, Spire gas branding." Four items: banner tap-to-call (White House water 615-672-4110, Spire 800-752-7504, CEMC 800-987-2362); the WEATHER "Ready to Mow?" banner now also downgrades on heavy dew "so it agrees with the YARD readiness card (they used to disagree — 'GOOD TO MOW' vs 'let it dry first')"; Jeff's man+mower image (`images/mower-marker.png`) became the live GPS position icon; and the gas card rebranded from Piedmont to Spire Energy.
- **`6a2336d`** (14:22) — "Dispatch card: swap to Spire-layout image + recalibrate all 13 tap hotspots." Jeff supplied an updated Dispatch artwork (Spire replaces Piedmont, adds Robertson County website + the two U.S. Reps with photos, drops the US House column). All 13 hotspots rebuilt from Jeff's provided directory: police 615-384-4911, fire 615-672-5338, water 615-672-4110, sewer 615-672-3654, CEMC 800-987-2362, Spire 800-752-7504, mayor 615-766-7099, alderman 615-581-1104, Rep John Rose + Rep Matt Van Epps (DC offices), city + Robertson County websites. "Emergency bar still triggers hccPanic (Jeff calls 911 himself), per standing rule."
- **`74c88f3`** (14:25) — "Memory: capture WHUD water bill reference (rates, cycle, meter) + reading mismatch." Jeff's actual WHUD bill entered the record as the calibration reference.

#### 19:32–20:36: the great section restructure and the bill-validated water tile

- **`9d16bf6`** (19:32) — "Restructure: separate Weather / Yard / Irrigation; fix blank mow readings." "Big continuity cleanup (app grew from mower-app to HCC; sections had drifted)": WEATHER became "Weather Conditions at 301" — pure weather only; YARD took the mower-specific cards ("Mowing Conditions" and "Ready to Mow?"); IRRIGATION took "Lawn Water Need." "No duplicated tiles/IDs (audited): each metric lives in exactly one place." And a Debugging-Protocol-style fix the same day the protocol was written: Rain Risk / Soil Temp / Dew on Grass / Rain 24-48h / Lightning were blank "because loadWeather() called api.open-meteo.com directly from the browser and that flaked out. Now it goes through a new server-side Function /api/mowconditions (same reliable pattern as /api/weather + /api/forecast)." Audited via Playwright: "0 duplicate IDs, all cards in correct sections … 0 JS errors." **`8a8803a`** (19:32) — "Memory: log section restructure + batch of fixes."
- **`01b4e8e`** (19:42) — "Weather: add Feels Like + Humidity tiles; mPING buttons open the app (not the map)." The mPING buttons had pointed at mping.nssl.noaa.gov, "which is just the map page — you can't submit there"; they now open the official mPING iOS app (App Store id584383400).
- **`6f9cd3f`** (20:24) — "Water meter: bill-cycle usage (resets ~21st) + Est. water charge from WHUD rates." Jeff had questioned whether the transmitted reading was the "real" one; the commit conceded and confirmed: "Jeff's right — the transmitted MIU reading IS the meter reading (our /10 gallons match his physical LCD); no manual read needed. The bill's '9640' is WHUD's register-unit column, not gallons." Changes: "This Month" → "This Cycle" tracking the WHUD billing cycle (resets on the ~21st read date), plus an "Est. Water $" tile from WHUD rates effective 2026-01-01. (Archivist's note: this commit body is shell-mangled in the git object — it reads "WATER_BASE 0.32 + gallons-this-cycle x /bin/bash.00908" because an unquoted `$1`/`$0` were expanded when the message was written. The real constants, confirmed in `index.html` at the branch tip, line 9577: `WATER_BASE = 10.32, WATER_PER_GAL = 0.00908` — i.e. $10.32 base + $0.00908/gal.) Validation was exact: "Verified against the actual bill: 6,839 gal cycle -> $72.42, exactly the bill's Water Charges line." **`2a8a8a0`** (20:24) — "Memory: water reading question resolved (transmitted reading authoritative; cost validated to bill)."
- **`8ee5658`** (20:36) — "Memory: gas billing sync parked until Jeff's first Spire bill." Deliberate deferral: no gas-bill calibration until real Spire paper arrives.

### 2026-07-04 — This-Cycle from HA history; HOME GUARDIAN is born; Lights & Plugs; Tuya guide

- **`2c6f350`** (14:28) — "Water This Cycle: derive from HA recorded history, not a fresh-start baseline." "This Cycle showed 0.0 because the app baselined to 'now' on first load (meter reader only started logging days ago, so it couldn't know the reading on the 21st). Now it queries HA /api/history/period from the cycle start and uses the earliest recorded reading as the baseline … Falls back to the local rollMeter estimate if history isn't reachable. Verified: 236 gal cycle -> $12.46."
- **`5a8320c`** (19:59) — "Add HOME GUARDIAN section — whole-home safety/security watch." The new 6th nav tab (`#section-guardian`, `--a-guardian` accent, the hero-security.jpg saved on 07-02 as its blueprint, Section-Kit only). `loadGuardian()` reads HA `/api/states` once through the `/api/ha` proxy and derives 8 checks — People, Water, Electric, Gas, HVAC, Garage, Doors, Devices — plus a PROTECTED/ATTENTION/ALERT banner. Design principle stated in the body: "Sensors not yet in Beehive show an honest 'Sensor pending' instead of a faked value, and light up automatically as they're added." Four actions: Night Check, Away Mode, System Details, Test Alerts.
- **`ad3be81`** (20:10) — "Fold LUX thermostat into HOME GUARDIAN; remove CLIMATE tab; new Guardian hero." "Jeff's call: CLIMATE would only ever hold the thermostat, so that nav slot goes to Home Guardian — the growing HA security/alarm/checks hub." LUX cards moved verbatim; `#snav-climate` removed; new personalized hero `images/hero-guardian.jpg` ("brick house at dusk with the baked-in title"), own 1200x900 aspect "so the title never crops." Back to 5 tabs.
- **`9d4bf6e`** (20:25) — "Add Lighting control card to HOME GUARDIAN." `loadLights()` pulls all `light.*`; ALL ON/OFF plus 100/50/25% brightness presets "(mirrors Jeff's RF remote)" and per-bulb pills, via the `/api/ha` proxy. Noted: "SYLVANIA Smart WiFi bulbs are Tuya-based → add via the Tuya integration and they auto-appear here."
- **`20ce92e`** (20:29) — "Lights & Plugs card: control switch.* (SYLVANIA plugs), exclude irrigation." Correction 4 minutes later: "Jeff's SYLVANIA Smart WiFi are PLUGS (switch.*), not bulbs (light.*)." The card now pulls both — "but EXCLUDES B-Hyve irrigation switches (lightIsIrrigation filters bhyve/orbit/zone/sprinkler + is_watering/zone_name) **so it can never fire the sprinklers**." Brightness row appears only when a dimmable bulb exists and only targets dimmables. Verified in harness with a bhyve switch present: "4 devices shown, bhyve excluded."
- **`83f0240`** (20:36) — "Add Tuya plug setup + HA-lighting-automation guide (docs/beehive)." "Jeff's plugs are already in the Tuya app directly (confirmed via screenshot), so the guide uses that app (no Smart Life crossover)": Part A adds plugs to Beehive via Tuya User Code + QR scan; Part B the 'on at sunset / off at 9pm' automations; Part C "retires the old Tuya-app 9pm rule and exposes the plugs back to Alexa so HA is the sole brain."

### 2026-07-05 — no commits. The record is silent for this day.

### 2026-07-06 — Pin-Track-to-Photo GPS calibration; Master Hour Calibration (9.2 h)

- **`3d33efa`** (20:58) — "GPS map: one/two-tap 'Pin Track to Photo' (no coordinate entry) + MPU offline note." The old GPS calibration "was too convoluted and kept erroring 'invalid coordinates' because it required typing lat/lon." Replaced with Pin Track to Photo: "tap where you started, tap where you ended — the app pairs those taps with the track's own first/last GPS points, so no numbers are typed and invalid-coordinates is impossible." Under the hood, `gpsToXY` was upgraded "from an axis-aligned map to a 2-point similarity transform (rotation + uniform scale + translation, GPS projected to a local plane) so a diagonal track or non-north-up photo still aligns." `addCalibPt`/`saveMapCalib` and the coordinate inputs were removed; the `_mapCalib` shape was kept so old saves still work. Also: when `mpu_ok:0`, Sensor Health now explains the MPU6050 is offline ("Vibration/Pitch/Roll/Tip/RPM depend on it") with a wiring/power-cycle check, "instead of a cryptic 'MPU MISSING'."
- **`408fc96`** (21:22) — "Master Hour Calibration (override + baseline re-sync) + pre-mow reset reminder." The reason: "Hours were off because the sensor missed a mow (MPU offline)." The fix: a header 'SET HOURS' button opens MASTER HOUR CALIBRATION where Jeff enters the true hours from the mower's physical meter; it "sets S.hours everywhere and re-syncs S.hoursBaseline = trueHours - S.lastSensorHours so future sensor runtime keeps totaling correctly; can correct down too (with a confirm)." New state: `S.hoursBaseline` (default 5.9, replacing the hardcoded `MOWER_BASELINE`) and `S.lastSensorHours`. Invariant kept: "Hours still never move backward from a sync." A slim pre-mow RESET reminder was added at the top of YARD. Playwright-verified end to end: "calibrate 9.2 -> baseline 6.2 + persists; sync @3.5h -> 9.7; sensor reset @0h -> stays 9.7 (no backward); override-down works."
- **`f0a9199`** (21:28) — "Show 'set [date]' under the hour meter when hours are hand-calibrated." `saveHours()` records `S.hoursCalibratedAt`; a tiny "set <date>" line appears under the hour meter, and the modal shows "last set by hand <date>." Verified: "shows 'set Jul 6' after setting 9.2, header reads 9.2." **The mower's hour meter stood at 9.2 hours at the end of this window.**

### Decisions made or rejected in this period

1. **J45 is Beehive, full stop** — wipe Windows 10, install HA OS to the internal drive (`9a9da77`, 07-01). Executed by 07-02: "J45 now boots HA OS 18.1 standalone off the internal SSD (foundational fix done)" (`f39b125`). The working model was also codified: Claude operates in the cloud workspace, "it guides, Jeff executes"; "the beast" is Jeff's main PC/workbench.
2. **AES meter key lives in Apple Passwords, NOT Cloudflare** (`75c1a27`, 07-01): "app code can't reach the J45 decoder and encrypted CF secrets can't be read back. Never commit the key itself." Operational home once J45 is up = HA `secrets.yaml`. Same day, the key became moot for the primary path —
3. **RTL-SDR + rtlamr2mqtt is the meter path; the CC1101/ESP32/AES stack is demoted to backup** (`5034f26`, 07-01) after the WHUD meter supervisor's in-person briefing: water = unencrypted Itron ERT-SCM, endpoint 79453337, "No AES key required."
4. **NO auto-911, ever.** Panic redefined as sirens + strobe lights + alert Jeff, Angela & Braxton (`b2bbe91`, `7a5e984`, 07-01). "Does NOT dial 911 (Jeff handles that himself)." One emergency control in the app (the Dispatch EMERGENCY bar); the standalone Safety panic button was removed. Restated as "standing rule" in `6a2336d` (07-03).
5. **The alarm is a DIY Zigbee build, not a commercial panel — and not bought yet** (`4c9cf03`, 07-01). Priorities per `6837d2d`: life-safety sensors first, lean intrusion, water-main auto-shutoff, garage via ratgdo (rejected: myQ cloud, "blocked from HA, so go local").
6. **mPING in-app submission: rejected — permanently.** Sequence: form removed (`adc5377`) → Jeff asked for it back and it was restored (`6b29cad`) → NSSL confirmed "no automated/app reports ever" (`5e6c20b`) → the UI/handlers/API were deleted and the buttons point at the official mPING iOS app, since the website is view-only (`947a99d`, `01b4e8e`).
7. **Nabu Casa (HA Cloud) chosen for Beehive's public URL** over Cloudflare Tunnel (`f754540` posed both; `5e6c20b` chose: "secure public URL so the app shows online and reads meters off-WiFi (+ easy Alexa/announcements)").
8. **All browser→HA traffic goes through the server-side `/api/ha` Cloudflare Function** (`7a59848`, 07-03). CLAUDE.md's "known fragile pattern (don't repeat)": "any new `fetch(base + '/api/...')` straight from the browser to HA. Use `haFetch()` … Never hoist a shared `AbortSignal.timeout` across retries." The proxy is "locked to Jeff's HA host + /api/ paths only," and the token "still lives only in the browser."
9. **Jeff's PROTECTED standing rule — attack the source, test on Claude's end first** (`f668301`, 07-03). Jeff, verbatim: *"Log this so we don't go through this kind of round robin of checks again and we attack the source… I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end."* Six-step protocol, marked PROTECTED so it can never be trimmed from CLAUDE.md.
10. **Compute utility detail in-app rather than wait for HA helpers** (`4af6d72`, 07-03) — Flow/Month/Est-Cost derived from cumulative readings in localStorage; "HA helper sensors still win if present."
11. **Prices and rates adopted:** gas ~$1.12/CCF all-in (TN residential $11.23/Mcf, EIA Jan 2026; `e5726b9`); water $10.32 base + $0.00908/gal (WHUD rates eff. 2026-01-01; `6f9cd3f`, constants confirmed in `index.html` tip line 9577 — the commit body's "$0.00908" is shell-mangled to "/bin/bash.00908" in the git object). Water tile validated to the cent: 6,839 gal cycle → $72.42, "exactly the bill's Water Charges line." Water usage tracks the WHUD **billing cycle (~21st)**, not the calendar month. Gas billing sync **deliberately parked** until Jeff's first Spire bill (`8ee5658`). Gas provider branding switched Piedmont → Spire (TN customers moved 2026-03-31, rates unchanged).
12. **The transmitted MIU reading is authoritative** (`6f9cd3f`): "Jeff's right — the transmitted MIU reading IS the meter reading … The bill's '9640' is WHUD's register-unit column, not gallons."
13. **Sewer overcharge claim aims at the City of White House, not WHUD** (`50b56c1`): Jeff had already written the City (no response) and contacted his alderman (~2 years ago, stalled) — "stronger meter data is the lever." The 3-year sewer-reimbursement strategy (`95eadf9`) is a stated purpose of the meter build.
14. **CLIMATE tab rejected, HOME GUARDIAN takes the slot** (`ad3be81`, 07-04): "Jeff's call: CLIMATE would only ever hold the thermostat, so that nav slot goes to Home Guardian."
15. **B-Hyve devices are excluded from Lights & Plugs ALL ON/OFF** (`20ce92e`, 07-04) "so it can never fire the sprinklers" — a safety invariant, not a styling choice.
16. **Guardian shows honest 'Sensor pending', never a faked value** (`5a8320c`); same honesty rule as the earlier "clean muted '—' instead of the misleading 'No history'" (`2a2eb76`) and the unreachable-vs-quiet-meter distinction (`31ed0c8`).
17. **Hour truth comes from the physical meter via SET HOURS** (`408fc96`, 07-06): manual master calibration with baseline re-sync; hours never move backward from a sensor sync; hand-set hours display their "set [date]" provenance (`f0a9199`). Set to 9.2 h on Jul 6.

### Problems, failures & root causes in this period

1. **"Lightning: RISK" constantly** → symptom: any thunderstorm code in the next 24h triggered RISK, "in TN summer that's almost always true." Root cause: no time-alignment or probability gating. Fix: `4b0d00e` (current-hour + probability-gated RISK/POSSIBLE/NONE, unit-tested).
2. **B-Hyve "No history"** → wrong attempts: reading a nonexistent device field, `/watering_events?device_id=` query form (404), reading `watering_status`/`watering_statuses` (empty), then declaring a **definitive dead end** and self-tracking (`2a2eb76`, `d5df6e9`). Real root cause: the endpoint wants the device id **in the path** — `GET /v1/watering_events/{device_id}` — found by reading pybhyve/bhyve-home-assistant source. "My earlier ?device_id= query form 404'd — that was the whole problem." Fix: `379b13d`; memory corrected in `1d23b5d`; confirmed live reading "7:30 AM" in `b947011`. Lesson: a 404 proved the URL was wrong, not that the data didn't exist — and the "definitive" memory entry had to be retracted 11 minutes later.
3. **mPING submit dead** → wrong attempt: restore the form and chase an NSSL token (`6b29cad`, `f935e31`). Root cause: NSSL "confirmed no automated/app reports ever" (`5e6c20b`) — no token will ever exist. Secondary bug: even the replacement link was wrong — mping.nssl.noaa.gov "is just the map page — you can't submit there" (`01b4e8e`). Final fix: link to the official mPING iOS app.
4. **Windows-driver detour for RTL-SDR** → Jeff found a SDR#/Zadig/WinUSB guide; wrong path. The rtl_433 add-on ships the Linux driver and HA auto-detects the dongle (`9100fcc`, reiterated `f39b125`).
5. **J45 backup stuck** → diskpart's "stuck protected partition" blocked stick creation; `diskpart clean` fixed it, stick written via Rufus (`98b9fd9`).
6. **Hero temp ≠ card temp (80 vs 91)** → root cause: a MutationObserver mirrored the Open-Meteo *forecast* temp onto the hero while the card used the real KTNWHITE21 station. Fix: `loadStation()` updates the hero too (`8966ee4`).
7. **"GOOD TO MOW" during EXTREME heat / heavy dew contradictions** → verdict logic lived in multiple places and didn't consider heat or dew consistently. Fixes: `f3ebdc9` (heat ≥103°F heat-index downgrades to CAUTION, in `applyMowVerdict` as single source of truth) and `88a7d13` (dew downgrade so WEATHER and YARD banners agree — "they used to disagree — 'GOOD TO MOW' vs 'let it dry first'").
8. **"Beehive Offline" (the original, legitimate one)** → root cause: "the https PWA can't fetch the local http HA (mixed content / LAN-only)" (`f754540`). Fix path: Nabu Casa public URL (`947a99d`) + bearer token + the CORS discovery: `http.cors_allowed_origins` in configuration.yaml was "the silent blocker that makes a valid setup still read as 'offline'" (`3043f34`); milestone logged `410ccc5`. Plus a chicken-and-egg UI bug: the token input only appeared when already online, so it could never be entered (`3043f34`).
9. **Water reading 202.6 gal instead of 12,982.5** → root cause: keyword-matching grabbed `sensor.water_meter_last_seen` and "parseFloat('2026-07-03T...') = 2026." Fix: skip timestamp-ish entities, require pure-numeric state (`338e2c3`).
10. **False "Beehive Offline" (the self-inflicted one)** → symptom: red dot + no meters despite a healthy HA. Root cause, admitted in the commit: "Regression I introduced when wiring Nabu Casa" — ONE shared `AbortSignal.timeout(2500)` reused across all candidate fetches became a combined budget; the Nabu Casa relay routinely needs >2.5s per call. Fix: fresh signal per attempt, 9s timeout (`0f44d9d`). Durable fix: the class of bug was eliminated by the server-side `/api/ha` proxy (`7a59848`). Consequence: Jeff's blow-up and the PROTECTED Debugging Protocol (`f668301`) — the diagnostic round-robin had been pushed onto Jeff for a bug that was Claude's own recent change, and the protocol's step 1 records the shame directly: "I did this AFTER Jeff called me out on the timeout bug — it must come FIRST."
11. **Blink cameras "Login failed" (Jeff's #1 priority, `17d388a`)** → wrong attempt: the "empty_cookies" cookie-jar theory and a dedicated aiohttp session (`f3ae126`) — plausible, sourced from upstream issues, but unverifiable and wrong. Real root cause found by diffing blinkpy in the harness: Blink's OAuth now signals 2FA with **HTTP 202 + tsv_state/tsv_methods**; blinkpy 0.25.2 only recognized the old 412, returned None, and HA logged 'Login failed' → `ConfigEntryNotReady`. Fix: pin blinkpy 0.25.7 (`1f2cdec`), keep the session tweak as belt-and-suspenders, and correct the comment: "the cookie theory was the wrong diagnosis; the 202 handling is the fix" (`59c8749` for memory).
12. **Blank mow readings (Rain Risk / Soil Temp / Dew / Rain 24-48h / Lightning)** → root cause: `loadWeather()` called api.open-meteo.com directly from the browser "and that flaked out" — the same browser-direct anti-pattern as HA. Fix: new server-side `/api/mowconditions` Function (`9d16bf6`), applying the day's architectural lesson to a second subsystem.
13. **Water "This Cycle" showed 0.0** → root cause: the app baselined to "now" on first load; the meter reader had only existed for days, so the ~21st baseline was unknowable locally. Fix: query HA `/api/history/period` from cycle start, earliest recorded reading = baseline, local rollMeter fallback (`2c6f350`).
14. **GPS calibration "invalid coordinates"** → root cause: the flow required hand-typing lat/lon into inputs; error-prone by design. Fix: eliminate typing entirely — two taps paired with the track's own first/last GPS fixes, plus a 2-point similarity transform so rotated/diagonal tracks align (`3d33efa`). "invalid-coordinates is impossible."
15. **Mower hour meter wrong** → root cause: "the sensor missed a mow (MPU offline)" — the MPU6050 being down silently dropped runtime, and the old hardcoded `MOWER_BASELINE` couldn't absorb corrections. Fixes: the MPU-offline explanation replacing "a cryptic 'MPU MISSING'" (`3d33efa`), and Master Hour Calibration with re-synced baseline, no-backward invariant, and "set [date]" provenance (`408fc96`, `f0a9199`). Jeff set the true value: **9.2 hours**.
16. **Cosmetic/self-inflicted:** the Dispatch artwork was over-compressed on first pass (q0.86, soft gold text) and re-encoded at q0.95, 320KB → 511KB (`9e6cea1`); utility banners' 104px cover-crop cut off logos/taglines on-device, switched to full-aspect (`ac3abdb`); a stray `__pycache__` polluted the syntax check (`cb1b149`). **INFERRED:** the shell-mangled "$0.00908" → "/bin/bash.00908" in `6f9cd3f`'s stored commit message is itself a small process failure — an unquoted heredoc at commit time — noted here so future archivists don't read "/bin/bash" as a rate.


---

## Chronicle: 2026-07-07 → 2026-07-14 — Blink live, AI cameras, Fire TV wars

This eight-day window is arguably the most consequential of the whole project. It opens with a hardware dead end (the SYLVANIA plugs), delivers the project's single biggest win (Jeff's #1 feature — all 6 Blink cameras live in the app on 07-09), births the two-Claude working model (Mandatory Rule 13, the "coworker" on the beast), stands up a full local-AI camera-detection pipeline with GPU acceleration and zero subscriptions, takes the app public at **loewenhome.com**, and closes with a three-act war over the Fire TV motion pop-up — including a painful correction of a "confirmed working end-to-end" claim that turned out to be false, and a service that silently died for three days without anyone noticing.

Every commit in the window (44 total, including 3 merge commits) is covered below. Authorship splits cleanly into two streams: **cloud-session commits** (Claude Opus 4.8 / 4.6, UTC timestamps, tagged with session `session_01WuKnDJrDp2n6fHjhtahmLe`) which own app code and deploys, and **coworker/beast commits** (Claude Sonnet 5, `-0500` Central-time timestamps, no session URL) which did the hands-on Home Assistant / Windows / LAN work. That split is itself a product of this window (Rule 13, `bec7440`).

### 2026-07-07 — SYLVANIA dead end; first live HA devices (Tuya plug + Sharky the vacuum)

#### f010694 (2026-07-07 20:17 UTC) — "Note: SYLVANIA plugs are locked to their app — dead end for HA (use Kasa/Zigbee)"

The window opens with a definitive failure verdict. From the commit body:

> Confirmed via Smart Life's own 'device not supported by this app' error (both EZ and AP mode, all iOS perms/BT/2.4-only correct) plus forum consensus that certain SYLVANIA Smart+ plugs don't work with Tuya/Smart Life. Recorded in CLAUDE.md so we don't re-attempt the Tuya path. Path to HA-native plugs: Kasa (WiFi) now or Zigbee later. Reminder to turn the BGW320-500 5GHz back on.

The CLAUDE.md entry written the same day (visible in the `9785381` diff) is even blunter and captures the full diagnostic rigor:

> ❌ **SYLVANIA plugs = DEAD END for HA (confirmed, do NOT re-attempt the Tuya path).** They're firmware-locked to the SYLVANIA app — Smart Life explicitly rejects them ("Unknown device — this device is not supported by this app"), in BOTH EZ (fast-blink) and AP (slow-blink) mode, with everything correct: iPhone on 2.4-only … Bluetooth on, Local Network/Location perms granted, cellular off. Forums confirm certain SYLVANIA Smart+ plugs don't work with Tuya/Smart Life/SmartThings — walled off. The SYLVANIA account also doesn't cross into Smart Life. Back-doors (LocalTuya, flashing) need the same blocked access. **Verdict:** to get plugs into HA + the Lights & Plugs card, Jeff swaps to HA-native: **Kasa KP125/EP25 (WiFi)** = easiest today (TP-Link HA integration, pairs in ~30s, app handles the 2.4 band), or **Zigbee plugs** (Sonoff S40 ZB / ThirdReality) to ride the coming Zigbee alarm coordinator.

The porch/landscape lights stayed on the locked SYLVANIA plugs (still SYLVANIA-app + Alexa controlled); automating them (sunset-on / 9pm-off) was recorded as blocked until Jeff swaps hardware. Note the "turn the 5GHz back on" reminder in this commit — it was later proven **wrong** (see `9785381` below): the 5GHz radio had never actually been turned off.

#### 7d17c24 (2026-07-07 21:45 UTC) — "Lights & Plugs: in-app diagnostic when no plug matches (surface HA entity names)"

A pragmatic dev-blindness workaround: since the cloud dev environment cannot reach Jeff's HA, `loadLights()` was taught to display what Beehive actually returned (total entity count + exact `switch.*`/`light.*` entity_ids) whenever no plug matches — so the app itself becomes the diagnostic tool.

> This lets us see a plug's real entity name from the app itself — needed because the dev env can't reach Jeff's HA to inspect it. Verified: diagnostic renders when empty; a real switch.* plug (e.g. switch.mini_smart_socket) still shows normally; zero JS errors. Also replaced the stale 'SYLVANIA' hint wording.

#### e7d9ef9 (2026-07-07 22:16 UTC) — "Add Robot Vacuum (Sharky) card + keep vacuum switches out of Lights & Plugs"

The same day the SYLVANIA path died, a generic Smart Life plug worked — and brought a surprise passenger:

> Sharky (BL20 Pro) came in with the Tuya integration. New #vacuumCard in Guardian (loadVacuum) hides itself unless a vacuum.* exists and gives Clean/Pause/Dock/Find via vacuum.start|pause|return_to_base|locate, showing live state + battery. loadLights now filters out the vacuum's setting-switches (child-lock/DND/mop, or any switch sharing the vacuum's name-stem) so Lights & Plugs shows only real lights/plugs. … Verified in Playwright: Lights & Plugs shows only the plug (Bed lamp), vacuum card renders 'Docked · charging · 85%' with buttons firing the correct vacuum services, zero JS errors.

The CLAUDE.md change-log entry celebrating the milestone (recorded in the 07-07 entries visible in `9785381`'s diff) reads:

> 🎉 **FIRST HA DEVICES LIVE IN THE APP — plug + robot vacuum.** After the SYLVANIA dead-end, a **generic Smart Life plug (JH-G01U "Mini Smart Socket," Shenzhen Jiuheng)** paired fine and is now controllable in the HCC **Lights & Plugs** card as "Bed lamp." **The HA Tuya integration is now set up and working** (2 devices / 22 entities: `switch.bed_lamp` + a **"Sharky" BL20 Pro robot vacuum**).

That entry also preserves the **pairing playbook that worked** — recorded explicitly "for future plugs": (1) pair into the Smart Life app using **AP Mode / slow-blink** ("the fast-blink auto-scan is flaky, AP mode is reliable"); (2) add HA's Tuya integration with the User Code from Smart Life and **scan the QR with Smart Life's in-app scanner** — "NOT the iPhone camera (camera → opens a website) and NOT SYLVANIA (→ 'designated app' error)"; (3) "the **QR is ONE-TIME-USE** — a fresh QR, scan once, tap the blue **Confirm login** fast ('already been used' = re-scanned a spent QR)."

**2026-07-08: no commits.** The record is silent for this day.

### 2026-07-09 — The biggest single day of the project: Guardian calm, Rule 13, Blink LIVE, camera control, panic-gate, loewenhome.com, fixed IP

Nine commits in one day, spanning UI fixes, process invention, the #1-feature win, security hardening, and network infrastructure.

#### a27982a (2026-07-09 12:12 UTC) — "Guardian banner explains ATTENTION/ALERT + calmer thresholds; fix 2 dead Weather links"

> Guardian showed '⚠️ ATTENTION' with no reason — a single offline device (43/44) was tripping it. Now the banner collects reasons and shows them ('ATTENTION — 1 door open', 'ALERT — Water leak'), a lone offline device no longer escalates (only >15% offline flags it; below that it's a calm FYI), and People '0 HOME' is neutral instead of a warning. Verified in Playwright: 1/44 offline + 0 home -> PROTECTED; door open -> ATTENTION w/ reason; leak -> ALERT w/ reason; zero JS errors.
>
> Also fixed the Weather Spotter + NOAA Radio buttons that 404'd — swapped dead deep-links (spotternetwork.org/pages/maps and a specific TuneIn station id) for durable targets (site root + TuneIn search for Nashville NWR).

The CLAUDE.md entry attributes the 404 report directly to Jeff ("Jeff: they 404'd") and notes the philosophy shift: alerts must **explain themselves**, and "being away isn't an alert."

#### bec7440 (2026-07-09 12:25 UTC) — "Add Mandatory Rule 13 (coworker delegation) + record 404-risk link audit" — **the two-Claude model is born**

This commit created the coworker-delegation doctrine that shaped the rest of the project. The rule as written into CLAUDE.md (verbatim from the diff):

> **13. TELL JEFF WHEN TO USE HIS LOCAL COWORKER (Jeff's rule 2026-07-09).** Jeff runs a **Claude "coworker" on his PC (the beast)** with real computer/local access. It can do what THIS cloud session CANNOT: reach his **home LAN + Beehive/HA directly** (read/click HA, install `custom_components`, restart HA, enter PINs), touch **local files** on his PC, drive **apps on his screen**, and **open/verify external links** in a real browser. THIS session owns the **app code, Cloudflare repo/deploys, research, and guidance**. Jeff doesn't know either of our full capabilities, so **it's on ME to proactively flag the handoff**: whenever a task — or a single step of one — is better done hands-on on his machine or inside Beehive, SAY SO ("this part your coworker can knock out") and hand over a crisp, copy-pasteable instruction the coworker can follow.

The commit body lists ideal coworker jobs: "Blink install, HA entity reads, /setup, ESP32 flash, link verification, local file cleanup — while this cloud session owns app code + deploys + guidance." It also recorded the outstanding link audit — the 6 mower parts/manual deep-links (partstree ×3, ereplacementparts, jackssmallengines, manualslib) plus `guardianDetails`'s `openBeehive('/lovelace/0')` — that the cloud session could not verify itself ("egress 403 on all external hosts").

#### fc62533 (2026-07-09 12:56 UTC) + 9a34d17 (12:59 UTC) — first coworker hand-off succeeds; link audit closed

> First coworker hand-off worked: Claude Code on the beast checked the 5 mower parts/manual links — all live (ereplacementparts 403 is anti-bot only, fine in a real browser). No changes needed; validates not blind-swapping working links. The 2 truly-dead Weather links (Spotter, NOAA Radio) were already fixed. Audit done. — `fc62533`

`9a34d17` immediately extended Rule 13 with the coordination protocol that prevented two-Claude collisions for the rest of the project:

> Added to Rule 13: brief the coworker by cloning this repo (Claude Code auto-reads CLAUDE.md); coworker treats app code as READ-ONLY and does hands-on local/Beehive/web work while this cloud session owns all app-code edits/commits/pushes, to avoid two-Claude collisions.

The change-log's own comment on the audit: "Good thing we checked instead of blind-swapping working links."

#### 9b29c1f (2026-07-09 14:29 UTC) — "Blink: record real root cause + official fix (blinkpy 0.25.6 / HA 2026.6.4); our custom override is now the blocker"

The commit body is empty; the substance is a CLAUDE.md diff, and it is one of the most important root-cause writeups in the whole repo. Background: Blink cameras had been Jeff's #1 wanted feature and broken since early July; on 07-03 a custom `custom_components/blink/` override had been built on the theory that HA's shared aiohttp session dropped auth cookies between login and the 2FA PIN step ("empty_cookies"). Web research on 07-09 overturned all of it. Verbatim from the CLAUDE.md entry this commit added:

> 🎥 **BLINK ROOT CAUSE FOUND (web research) — official fix shipped; our custom component is now the blocker.** Blink's 2FA now returns HTTP 202 (`tsv_state`/`tsv_methods`); old blinkpy read 202 as success so the PIN never showed → "Login failed." Fixed upstream in **blinkpy 0.25.6** (PR #1231) → **HA core 2026.6.4** (PR #173811, "no HA-side changes needed"). Our July-3 `custom_components/blink/` override now **shadows HA's fixed built-in with stale code** — the log's `ConfigEntryNotReady` is from OUR `coordinator.py:58`. **Fix = delete the override + the broken entry, update HA ≥ 2026.6.4, use the built-in Blink integration** (`rm -rf /config/custom_components/blink` → delete Blink entry → update+restart HA → re-add Blink built-in → SMS PIN now appears). Wait ~30 min after deleting before re-adding (our old code hammered Blink's login for days → possible rate-limit). Do NOT re-add a custom blink override.

The fuller Pending-item rewrite in the same diff includes the explicit confession:

> **The earlier "empty_cookies / dedicated session" theory was a wrong guess; the real bug was the 202 handling, now fixed in the library.**

And the caution that "our old code has hammered Blink's login every ~10s for days → account may be rate-limited."

#### 7bbc8a2 (2026-07-09 15:11 UTC) — "Blink cameras LIVE in the app (Jeff's #1 feature) — all 6 cameras confirmed; mark Pending #4 resolved" — **THE WIN**

Forty-two minutes after the root cause was recorded, the cameras were live. The CLAUDE.md entry (the body is empty; this is the diff, verbatim):

> 🎉🎥 **BLINK CAMERAS LIVE IN THE APP — Jeff's #1 feature, DONE (confirmed screenshot: all 6 cameras — 301 Driveway, Front Right, Back Left, 301 Backyard, Garage, 301 Front Doorbell).** Fix = removed the stale `custom_components/blink` override, deleted the broken entry, restarted HA (core 2026.7.1 has the fixed blinkpy 0.25.6+), re-added the **built-in** Blink integration → SMS PIN finally appeared → authenticated. Cameras render in HOME → Security · Cameras via `loadCameras()`. Tiles show camera icon + "idle" until a snapshot is captured (Blink is event-based). Lesson: after HA shipped the official fix, our pre-fix custom override became the bug (it shadowed the good built-in). Never re-add a custom blink override.

The Pending #4 rewrite in the same commit closes with the standing rule: "**DO NOT ever re-add a `custom_components/blink` override — that override shadowing the fixed built-in was the entire bug.** The repo's `beehive/blink/` files are dead artifacts (leave or delete; never install)."

#### 5ddac8a (2026-07-09 18:49 UTC) — "Camera full-control in app: Refresh All, per-camera snapshot/save-clip/arm panel; stills via signed entity_picture URL"

With cameras live, full control followed the same afternoon:

> - HOME > Security: Refresh All triggers blink.trigger_camera for every camera then reloads stills
> - Tap a camera -> full-control panel (large still, Take New Snapshot, Save Clip, Arm/Disarm, battery/temp/wifi/motion)
> - Fix stills: load HA signed entity_picture image URL from https Nabu Casa host (img load, no CORS) instead of blob fetch
> - All HA service calls route through the /api/ha proxy (haFetch)
> - No Blink subscription required (on-demand snapshot/clip-save/arm are free features)

The CLAUDE.md entry adds the key technical insight — an `<img>` load "isn't CORS-gated like the old `fetch().blob()` was, which is likely why tiles showed icons before" — and the subscription stance: "Free Blink features only (on-demand snapshot/liveview/clip-save/arm); cloud clip *history* is the only thing the paid plan adds." It also records that Jeff had just **registered loewenhome.com via Cloudflare**.

#### 80799e7 (2026-07-09 18:56 UTC) — "Safety: gate panic alarm behind Beehive token so public visitors can't trigger it; route via /api/ha proxy"

A genuine security hole caught before going public:

> App is publicly shareable (loewenhome.com). Home data is already token-gated per-device, but the panic webhook was unauthenticated — any anonymous visitor could fire the real alarm. Now hccPanic() requires getHaToken() and posts through the same-origin proxy. Family full access = paste Jeff's HA token once per device.

The CLAUDE.md entry (added this day, visible in the `f474d9b` diff) frames the whole access model: "public = view-only demo; **full access = paste Jeff's HA Long-Lived Token once on the device** (Connect to Beehive field) — so Angela, Jeff's dad, and Braxton get everything (cameras + control + panic) by entering the token on their phones." Two low-severity items were **noted but deliberately not fixed**: the `/api/hours` POST is open ("a stranger could push junk mower telemetry — griefing only"), and the Nabu Casa URL is visible in client JS ("inherent; HA still requires login").

#### f474d9b (2026-07-09 19:27 UTC) — "Domain live: loewenhome.com + www Active/SSL, serving app (HTTP 200 worldwide)"

Empty body; the CLAUDE.md diff records: `loewenhome.com` + `www.loewenhome.com` attached to the `toro1` Cloudflare Pages project, "both **Active + SSL enabled**, returning HTTP 200 worldwide (verified via 1.1.1.1 & 8.8.8.8 by the coworker). App needed no code change (relative `/api/*` + relative manifest `start_url`). The old `toro1-5rz.pages.dev` still works too." One transient noted: "Jeff's AT&T gateway cached a stale AAAA-only record so *home-WiFi* lookups lagged — self-clears / reboot gateway / set DNS to 1.1.1.1; doesn't affect outside visitors."

#### 9785381 (2026-07-09 23:48 UTC) — "Memory: record Beehive fixed-IP on AT&T gateway + LAN inventory; correct wrong 5GHz-off notes"

Empty body; the CLAUDE.md diff records two things. First, network infrastructure:

> 🌐 **AT&T gateway (BGW320-500) — Beehive pinned to a FIXED IP.** Jeff (first-timer, walked through it screen-by-screen) set `192.168.1.66/homeassistant` to **Private fixed** via the gateway's **Home Network → IP Allocation → Allocate → Private fixed:192.168.1.66 → Save** (admin at `http://192.168.1.254`, needs the Device Access Code on the sticker). Verified by coworker: `.66` pings 0% loss + HA loads HTTP 200 — nothing broke.

The full LAN inventory captured by the coworker (192.168.1.0/24): Beehive `.66` (84:39:be:20:0d:ad), Blink Sync `.214` (40:89:c6:19:55:b7), mower ESP32 `.195` (ESP_DBDE3B, a0:20:a6:0b:de:3b), Tuya plug#1 `.209` (TY_WR), the beast `.194` (301Server); other ESP32s at `.210/.224/.196/.232` (purpose TBD), possible Sharky vacuum at `.228` (WS-Uejlwa4yAnSI). Also recorded: fixed IPs for Blink/Tuya devices are NOT needed (cloud-connected), and "**The AT&T box can't change its DNS resolver** (confirmed) — that's why DNS caching recurs; per-device 1.1.1.1 or own-router-in-IP-Passthrough is the only real DNS fix."

Second, a memory correction — the record correcting itself:

> **CORRECTION (07-09): the BGW320-500 5GHz radio was NEVER turned off — Jeff confirmed it's been on the whole time. My earlier "toggle 5GHz off/back on" notes were WRONG; do NOT tell Jeff to re-enable it.**

### 2026-07-10 — The camera-AI plan, CodeProject.AI on the beast, clip player, Hart of the Hive

#### d2337b9 (2026-07-10 02:35 UTC) — "Memory: AT&T ActiveArmor check done - nothing paused/blocked"

Empty body; CLAUDE.md diff: "**AT&T ActiveArmor / Smart Home Manager check DONE (07-09): Jeff confirmed NOTHING is paused or blocked** — so AT&T security is not interfering with any project device." Only remaining tiny item: a secure-HA bookmark (Nabu Casa https) so local HA stops showing "Not secure" ("that warning is just plain-http on LAN — harmless").

#### b704461 (2026-07-10 02:58 UTC) — "Cameras: mockup-style layout — house banner + status badge + big full-width tiles with overlaid labels"

Cameras section redesigned per Jeff's mockup: banner from hero-home.jpg "cropped to hide baked text" with a SECURITY-CAMERAS title + "All Cameras Ready" badge; tiles went from a small 2-column grid to full-width 16:9 with a green dot + name overlaid on the image.

#### dfaa88f (03:59 UTC), 71a8cae (04:02 UTC), 4cd8184 (04:48 UTC), 65e029b (05:53 UTC) — the camera-AI + home-theater plan is written

`dfaa88f` created `docs/home-theater-ai-plan.md` (76 lines) and a CLAUDE.md summary. The requirements, in the record's words:

> 🎬 **CAMERA-AI + HOME-THEATER PLAN captured → `docs/home-theater-ai-plan.md`.** Jeff wants (free, NO subscriptions): review Blink clips in-app, alerts that say person/car/package/animal, TV pop-up alerts, and a seamless HA-driven home theater. Key decision: **the beast (`301Server` .194, 6-core, ~2TB+500GB SSD, Nvidia GPU [model TBD via `nvidia-smi`], 24/7, in the viewing room) = the AI + media brain**; Beehive J45 stays PURE HA.

The plan doc itself states the money rule: no subscription fee, "no per-month anything — he already pays for Claude/Clyde, Nabu Casa" — and mandates "**Keep it PURE HA. Do NOT put media/AI on it**" for the Beehive ("weak Pentium, no GPU, runs the whole house").

`71a8cae` settled the hardware question and the detection path. Jeff thought the beast's GPU was a "T750"; `nvidia-smi` said otherwise:

> **Nvidia GeForce GTX 1050 Ti, 4 GB VRAM (confirmed via `nvidia-smi` 07-09)** … **OS = Windows**. Also runs Clyde (Claude Code).
> → Detection plan settled: **CodeProject.AI Server on Windows (uses the 1050 Ti CUDA)** does snapshot object-detection (person/car/animal — no RTSP needed, fits Blink); add **LLM Vision** (small local model on the 1050 Ti, or free Gemini tier) for package + rich scene descriptions. Frigate/blinkbridge NOT needed for this path.

The plan later recorded (in `05dc1db`'s update): "GTX 1050 Ti … Enough for CodeProject.AI YOLO + small vision model. Not enough for a full local LLM — use free Gemini tier for rich scene descriptions if wanted" ("still $0").

`4cd8184` added `docs/beehive/camera-ai-setup.md` (114 lines) — a staged, "Clyde-ready" CodeProject.AI setup guide for the beast. `65e029b` (a one-line fix, no co-author trailer) corrected the guide's notify target to the confirmed real one, `notify.mobile_app_jeffs_iphone`.

#### 489f458 (2026-07-10 06:39 UTC) — "Clip player: browse + play saved Blink clips in-app (no subscription)"

> Adds an in-app clip browser that lists saved Blink motion clips from Beehive's /media/blink/ directory and plays them inline via signed URLs. — CLIPS button in camera toolbar opens the full clip list — VIEW SAVED CLIPS button in each camera's panel filters to that camera — Clips listed newest-first with parsed camera name + timestamp — Tap to play: signs the media path via /api/auth/sign_path, streams directly from Nabu Casa in a `<video>` element (no proxy needed) — Handles empty state, missing folder, and connection errors gracefully

#### 667eec4 (2026-07-10 08:21 UTC) — "Camera hero + Hart of the Hive status dashboard redesign"

Two visual overhauls: the camera hero swapped to `hero-cameras.jpg` ("Jeff's Blink security mockup"), and a new **Hart of the Hive** command-center panel appeared on HOME — 8 uniform chips (Theme, Alexa, Cast, Hive, Accounts, Voice, Watch, Fitness) overlaid on "Jeff's sci-fi dashboard image," absorbing orphan controls from the header and inline cards. The header was "decluttered to HCC badge + title + tiny beehive status dot." Zero JS errors verified in Playwright. (Note: this commit is the first in the window authored by Claude Opus 4.6 rather than 4.8.)

#### a27e0b7 (2026-07-10 14:55 UTC) — "Add AI object detection display to camera tiles (CodeProject.AI integration)"

The app side of the AI plan, built before the beast side existed — designed to light up automatically:

> Camera tiles now show detection badges (person/car/dog/etc.) from HA image_processing entities when CodeProject.AI is wired up on the beast. Badges show label + icon + relative time, color-coded by type (blue=person, yellow=vehicle, green=animal, purple=package). Detection data cached in localStorage for 24h persistence. camView panel shows AI detail rows (detection type, confidence %, time, other objects seen). Gracefully shows nothing when no AI entities exist — auto-populates when Clyde wires HA.

#### 24df1fc (2026-07-10 19:07 UTC) — "Fix Windows stale cache + Hart chips on monitors + camera hero cleanup"

Service worker bumped to **hcc-v7** to force a cache purge on all devices ("Windows … stuck on old content"); images moved from cache-first-forever to stale-while-revalidate "so new hero images actually update without clearing cache." Hart of the Hive got Jeff's new image with "system labels baked into the monitor screens," and the chips were repositioned from a flat grid to absolute positions overlaying the actual monitor screens — "looks like they're part of the command center displays." Camera hero aspect-ratio tightened 1300/1330 → 1300/980 to crop blank tile areas.

### 2026-07-10 → 07-11 (beast session) — CodeProject.AI goes LIVE, with two infrastructure bugs found

#### 76ae463 (2026-07-11 03:11 -0500) — "Log CodeProject.AI camera detection completion in change log"

The first coworker (beast) commit in the repo's own history for this feature — logging work done 07-10 that "was staged locally but never committed before this session pulled newer 07-09 entries from the cloud session." The CLAUDE.md entry it adds is a monumental one. Highlights, verbatim:

> 🎉 **LOCAL AI CAMERA DETECTION LIVE — CodeProject.AI + HA automations, GPU-accelerated, fully tested end-to-end.** Installed **CodeProject.AI Server 2.9.5** on the beast (`D:\CodeProject\AI`, GPU-accelerated on the GTX 1050 Ti via CUDA, YOLOv5 6.2, ~150-700ms/detection, Windows service auto-starts on boot). **Two real infra bugs found + fixed along the way:** (1) **Windows Firewall was silently blocking port 32168** from the LAN — the installer never added an inbound rule, so nothing outside the beast itself could reach it (Beehive's requests just timed out with no useful error); added `New-NetFirewallRule` for TCP 32168, fixed instantly. (2) **BIGGER FIND: `packages/hcc.yaml` was never actually loaded by HA at all** — `configuration.yaml` had no `homeassistant: packages: !include_dir_named packages` directive, so despite being valid YAML the whole file was silently ignored. **This is why `hcc_panic_button`/`hcc_mower_sensor_sync`/`hcc_freeze_warning`/`hcc_severe_weather_alert` showed "unavailable" — they were ghost/restored entities that had never truly run, ever.** Added the missing directive → **all 6 automations (4 old + 2 new) came alive simultaneously.**

That second find is worth underlining: **every HA automation the project thought it had shipped before this date had never actually run** — the entire `packages/hcc.yaml` file was silently ignored by HA for lack of one include directive.

The entry continues: the community `codeproject_ai_object` custom component was installed and needed **a one-line patch of an upstream bug** (`image_processing.py` referenced `cpai.CodeProjectAIServerException`, renamed to `CodeProjectAIException` in the current `codeproject-ai-api` pip package — "one-line `sed` fix, filed nowhere upstream yet"). Three Blink cameras (301 Backyard/Driveway/Front Doorbell) were wired to `192.168.1.194:32168` with `timeout: 60` ("Blink's cloud snapshot fetch is sometimes slow — expect alerts anywhere from a few seconds to ~1 min after real motion, not instant"), targets person/vehicle/animal at confidence 60, annotated snapshots saved to `/config/www/ai_snapshots/`. Three automations were added: `AI Camera Scan on Motion`, `AI Object Detected Notify` (person=critical push w/ sound, vehicle=normal, animal=passive/silent; attaches annotated snapshot; fires a custom `hcc_ai_detection` event; per-camera mute gate), and `AI Notify Mute Action` (the "🔇 Mute 15 min" push button, backed by `input_datetime.hcc_ai_mute_<camera>` helpers). Verified fully live: "forced `binary_sensor.301_driveway_motion` on twice → both times detected real cars (up to 85.9% confidence) → notification fired → **Jeff confirmed on his phone** both the push notification AND the attached annotated photo arrived correctly."

Known gaps recorded honestly: only Jeff's iPhone was registered for notifications; **no package/delivery detection** ("stock YOLO has no 'package' class — would need a custom-trained model, a separate project"); zone/ROI filtering supported but "intentionally not configured yet — no known false-positive zone to calibrate against, would be guessing at coordinates blind." Frigate migration noted as a possible future "bigger lift, backend swap not an add-on."

### 2026-07-11 (beast session) — Fire TV pairing, the Alexa route, arrival suppression, Angela, all 6 cameras, Siri Announce

#### c926ceb (2026-07-11 13:16 -0500) — "Log Fire TV/HA pairing, alexa_media_player setup, loewenhome.com audit, and a found (unfixed) desktop layout bug"

Four stories in one commit. First, **Fire TV pairing** — a new Fire TV Stick (model AFTKRT, `192.168.1.215`, MAC 20:BE:B8:3A:8C:5D) in the viewing room, paired to Beehive via HA's Android Debug Bridge integration, appearing as "Fire TV - Viewing Room." A real root cause was hit on the way:

> the beast couldn't reach it at all at first (`adb connect` → WSAEACCES) — turned out **ProtonVPN's WireGuard tunnel on the beast was blocking outbound LAN traffic**, same root-cause class as the earlier "Beehive Offline" `ERR_NETWORK_ACCESS_DENIED` issue (see 07-02 entry). Jeff disabled ProtonVPN → ADB connected immediately.

Second, a **considered-and-rejected option** recorded in full: a native Alexa Routine (Blink motion → "Show Camera") was "rejected … because it bypasses HA entirely — it can't reuse the existing person/vehicle AI classification or the per-camera mute helper, and (per Jeff's ask) can't be suppressed when a known family member's phone is already home." Chosen instead: route TV pop-ups through HA via the `alexa_media_player` HACS integration (v5.15.6 installed; Amazon login left "sitting on-screen for Jeff" — "Claude does not handle credentials").

Third, the **loewenhome.com "stale version" audit**: Jeff reported seeing an old version in Chrome. Both domains were byte-for-byte identical ("100% identical, 532,663 chars each"), zero console errors across all 5 tabs; root cause was "a stale `service-worker.js` cached locally in his Chrome profile … Not a server/deploy bug."

Fourth, the **desktop-wide-layout bug — found, deliberately not fixed** (app code belongs to the cloud session under Rule 13). Root cause, verbatim:

> On any browser window wider than ~700-900px … the hero sections leave a large dead black area to the right instead of filling the window. **Root cause:** `.sec-hero-weather`/`-irr`/`-yard`/`-guardian` etc. set `aspect-ratio` + `max-height:460px` but no `width`/`max-width`, and there's no centered max-width shell around the app anywhere in the CSS. … once a wide desktop window makes the box tall enough to hit `max-height:460px`, CSS derives the box's **width from the aspect ratio** (~700px) instead of the viewport, and since nothing centers it, it sits flush-left … Confirmed via direct CSS read, not just visual.

#### 987e804 (2026-07-11 13:58 -0500) — "Log confirmed-working Fire TV camera pop-up mechanism + File Editor add-on fragility"

The Alexa mechanism was live-tested by hand and appeared to work: "calling `media_player.play_media` with `media_content_type: custom` and `media_content_id: "show me the driveway camera"` targeted at `media_player.jeffrey_s_fire_tv` makes the Fire TV pop up that camera's live view immediately, exactly like speaking the command to it" — confirmed by Jeff on the physical screen. (This claim would be half-overturned on 07-14.) The YAML wasn't applied yet because of the first editor-corruption incident:

> the legacy File Editor add-on mishandled a special keypress (typed literal "Page_Up" text into the file), caught and undone before saving. Recommends Studio Code Server add-on for future package-file edits instead.

Also noted: the package-defined automation "**cannot be edited via HA's own Automations UI** — the UI only offers a 'Migrate' button (do NOT click this without asking Jeff)."

#### a88ccc6 (2026-07-11 14:38 -0500) — "Fire TV motion pop-up alerts: built, deployed, and confirmed working end-to-end"

The "AI Show Camera on Fire TV" automation went into `packages/hcc.yaml` — but only after **two separate editor corruptions**:

> after two separate Studio Code Server editor corruptions - a literal "Page_Down" keystroke and a Prettier format-on-save truncation - were caught via ha core check and fixed precisely with sed/heredoc.

The CLAUDE.md entry spells out the lesson that governed all subsequent HA config edits: "**use the Terminal add-on directly, or if using Studio Code Server, disable format-on-save first (`editor.formatOnSave: false`) before touching this file — its dense flow-style YAML doesn't survive Prettier's reformatting.**" The automation fired only for person/vehicle, reused the exact mute-gate template as the phone path (so "🔇 Mute 15 min" silences the TV too), and was "verified twice … **both the phone push notification AND the Fire TV camera pop-up fired correctly**, confirmed by Jeff." (The pop-up half of this claim was later disproven — see `b108a6e`.)

#### 049ad6d (2026-07-11 15:19 -0500) — "Add arrival-suppression automation, Angela's HA account, and an 'almost home' alert"

Built entirely via the Terminal add-on ("lesson applied — zero editor corruption issues this round"):

- **"AI Arrival Suppression"**: `person.jeff_loewen` or `person.angela_loewen` going `not_home`→`home` loops over all monitored cameras setting each `input_datetime.hcc_ai_mute_<camera>` 10 minutes out — family walking in the door doesn't trigger alerts.
- **Angela's HA account**: login `angela301` (password set by Jeff, not Claude), a `person.angela_loewen` entity, plus a walkthrough for the HA Companion App and her own Long-Lived Access Token for the HCC app.
- **"Angela Almost Home"**: a 10-mile passive zone (`zone.almost_home`) + automation notifying Jeff's iPhone when Angela enters it — "a heads-up ~10 min before she arrives" (recorded as not yet verified live since she hadn't installed the Companion App that session).

Ten automations total now, confirmed loaded via `ha core check` + restart. Noted for later: Braxton has no User/Person entity yet.

#### 4b19147 (2026-07-11 15:32 -0500) — "Expand AI camera detection from 3 to all 6 Blink cameras, confirmed working"

Jeff asked why only 3 of his 6 cameras were AI-monitored; the record found "no documented reason … looks like they just weren't included in the original 07-10 CodeProject.AI setup." `front_right`, `back_left`, and `garage` were added via precise `sed` substitutions on the flow-style YAML ("safer than trying to insert/reformat, avoided all editor-corruption risk"). The notify and Fire-TV automations needed **no changes** — "both already derive `camera_key` generically from the triggering entity_id." Verified live with a simulated garage detection: "Jeff confirmed he got the phone notification AND Fire TV pop-up for the garage camera specifically, nothing crossed over to other cameras. **All 6 Blink cameras are now fully AI-monitored.**"

#### 6c26465 (2026-07-11 16:01 -0500) — "Fix Siri Announce Notifications not reading AI camera alerts aloud"

Two real causes, one of them user error by Apple's design:

> vehicle/animal push notifications were sent at interruption levels (active/passive) that iOS's Announce Notifications on Speaker ignores by default, and separately Jeff was testing with his phone unlocked (the feature only fires when locked with screen off, by Apple's design). Bumped both vehicle and animal detections to time-sensitive via precise sed edits … Confirmed working live for both object types once tested with the phone actually locked.

The CLAUDE.md entry records an explicit tradeoff: animal alerts, originally passive/silent ("don't bug me about the cat"), now share vehicle priority — "that's an explicit tradeoff he asked for this session, not an oversight."

### 2026-07-12 — Splash screen saga and wide-screen layout fix

#### 05dc1db (2026-07-12 13:47 UTC) — "Splash landing screen + media center docs"

A full-viewport splash landing screen with "Jeff's portrait/landscape house-at-dusk images" (portrait on phones <768px, landscape elsewhere), tap-anywhere-to-enter, sessionStorage skip on same-session reload, a live status bar (Security/Network/Power/Climate) from HA, and service worker **hcc-v8**. This commit also wrote `docs/beehive/media-center-setup.md` (a Kodi setup guide) and recorded the **Phase 2 Kodi decision** in `docs/home-theater-ai-plan.md`:

> **Phase 2 — DECIDED (07-10, Jeff's call): beast-as-media-center via Kodi.** Beast runs **Kodi** (free media center) → HDMI → Vizio TV. HA sends camera alerts to Kodi via `kodi.call_method` → `GUI.ShowNotification` → toast overlay on the TV screen, fades after 8s. Fire TV Stick stays as secondary HDMI input for 4K DRM streaming. **NOT** simple ADB from Beehive to Fire TV — Jeff wants it routed through the beast.

Note the contradiction being committed into the record here: this Kodi decision (dated 07-10) was written down on 07-12 — the day *after* the 07-11 beast session had already built the Fire TV/Alexa route it explicitly rules out. The conflict sat unnoticed until the 07-14 audit (`c13f101`).

#### a1a6d7a (2026-07-12 13:52 UTC) — "Responsive wide-screen layout for TV, web, tablet, Fire TV"

The fix for the desktop-wide-layout bug found (not fixed) by the coworker on 07-11: a centered max-width container (1400→1800→2200px), heroes scaling up to max-height 1000px by breakpoint, nav/cards/buttons/spec rows scaling at 768/1200/1920/2560px, "Card padding and font sizes increase for viewing distance on TV," and "Phone layout unchanged (no regression)."

#### dfb0460 (2026-07-12 18:48 UTC) and c236731 (2026-07-12 21:07 UTC) — splash polish, then rebuild

`dfb0460` patched the portrait splash (cover positioning + a gradient going "fully opaque by 88% to cleanly hide the baked-in status bar in the image"). Three hours later `c236731` abandoned the patch approach and rebuilt properly:

> Replaced baked-in-text splash images with clean house photos (no text). All title/subtitle/tagline/ENTER are now HTML with CSS gold metallic gradient (background-clip:text), so text scales on any screen and never crops. Verified on iPhone SE, iPhone 14 Pro, Jeff's iPhone (440x956), and desktop — zero JS errors.

**2026-07-13: no commits.** The record is silent for this day.

### 2026-07-14 — Typography, layout redesign, and the day the Fire TV war was won

#### 406e8b0 (2026-07-14 12:08 UTC) — "Apply Clyde typography spec + fix splash temp from real weather station"

A cross-Claude collaboration: the splash typography implemented to a spec produced by **Clyde** (the beast's Claude) — "Cinzel Display SemiBold from Google Fonts … Champagne metallic gradient per Clyde spec (#FFF2C9→#5A3716), warm glow rgba(255,210,130,.55), thin dark outline, subtle bevel via drop-shadow chain." Plus a real bug: the splash showed "--°F" because `splashStatus()` only checked HA `climate.*` entities; it now fetches `/api/weather` (the KTNWHITE21 backyard station, no token needed) in parallel "— real backyard temp shows for everyone on load."

#### 5957758 (2026-07-14 17:02 UTC) — "HOME layout redesign: hero above nav, remove header, reorder content"

A structural reorganization: the "HCC · HOME COMMAND CENTER" header bar removed from all pages; heroes moved above the nav bar everywhere; Quick Access shortcuts (Yard/Irrigation) removed; Safety & Emergency moved from HOME to GUARDIAN; Hart of the Hive moved to the bottom of HOME; HOME reordered to Dispatch → Cameras → Utilities → Beehive → Hart of Hive. Rationale recorded: "911 on dispatch already fires hccPanic() — no separate emergency section needed."

`57476b6` (12:14 -0500) is a plain merge commit reconciling the cloud and beast streams.

#### d9ca3d3 (17:38 UTC) and e70a5ac (17:40 UTC) — iPhone fixes and Hart chip nudges

`d9ca3d3` fixed 3 iPhone bugs: `env(safe-area-inset-top)` padding so heroes "don't bleed behind the iOS status bar (time/signal/WiFi)"; Home Status card moved to Guardian; and the Beehive hive-chip moved to top:65% — the commit quoting Jeff's placement instruction: `"just under the chair"`. Two minutes later `e70a5ac` corrected the chip positions against Jeff's reference image (HIVE back to the hexagon center at 27%, FITNESS to the chair at 72%) — evidence of live back-and-forth with Jeff over exact pixel placement.

#### c13f101 (2026-07-14 12:45 -0500) — "Audit: root-cause camera/Fire TV alert outage (CodeProject.AI service down 3 days), resolve TV-alert plan conflict" — **the reckoning**

Jeff reported cameras + Fire TV "not working as intended" despite the 07-11 changelog saying both were confirmed working. The beast-session audit found the pipeline had been dead for three days:

> CodeProject.AI Server's Automatic startup didn't survive the 07-11 reboot, silently breaking AI detection since that day (confirmed via HA automation last-triggered timestamps). Restarted it and hardened it with delayed-start + failure-recovery actions so it doesn't die silently again.

The forensic detail in the CLAUDE.md entry is exemplary: "'AI Camera Scan on Motion' has kept firing normally (most recently 32 min before this check) — so Blink motion sensors + the scan trigger are fine — but 'AI Object Detected Notify' and 'AI Show Camera on Fire TV' both show 'Last triggered: 3 days ago'" — i.e., the scan step had been "silently failing to reach CodeProject.AI (port not listening) ever since that reboot." The firewall rule from 07-10 was still correct; only the Windows service was down.

The second finding was the plan conflict:

> the 07-11 Fire TV/alexa_media_player build directly contradicts the 07-10 decision to route TV alerts through Kodi instead. Jeff chose to keep the Fire TV/Alexa path now that it's unblocked; updated the plan doc to match reality and mark Kodi as superseded/unused.

The audit found Kodi "was installed on the beast but only ever launched once, for about 3 minutes, then never touched again (its own log confirms this; `C:\Users\jeffl\AppData\Roaming\Kodi\kodi.log` starts and ends 07-11 6:11–6:14 AM)"; its web server was never enabled and no Kodi integration was ever added to HA. The plan doc was updated: "Jeff chose (07-14) to keep this path rather than switch to Kodi. … `docs/beehive/media-center-setup.md` describes the Kodi route that was NOT taken; treat it as reference/superseded, not a live setup guide."

Minor items flagged but not chased: an HA "Login attempt failed — invalid authentication from localhost (127.0.0.1)" notification ~42 min before the check; a logged "🚨 EMERGENCY ALERT — HCC Panic triggered at 05:50 PM" from 07-11 ("almost certainly a test/accidental trigger during that session, not a real event, but flagging since panic firing is significant"); and 8 unpushed local commits on the beast that merged cleanly. The camera base feed itself was confirmed healthy — "the AI-detection layer on top of it was what broke."

`b1022d9` (12:59 -0500) is the merge commit for this reconciliation.

#### b108a6e (2026-07-14 13:36 -0500) — "Live-test Fire TV pop-up twice with AI pipeline healthy: still broken, root cause narrowed" — **the correction**

With CodeProject.AI restored, the pop-up was retested honestly — and the 07-11 claim collapsed:

> Phone push confirmed working both tests. TV pop-up did not appear either time, even on the correct HDMI input. Ruled out camera-Alexa linking and wrong phrase (both confirmed fine via a real spoken command). Narrowed to alexa_media_player's synthetic play_media/custom-command call not behaving like a real voice command for cross-device camera display. Corrected the 07-11 changelog's "confirmed working end-to-end" claim, which this disproves for the TV-pop-up half (phone push half held up).

The CLAUDE.md entry shows the ruling-out was rigorous: the automation traces showed `image_processing.codeproject_ai_object_301_driveway` "genuinely detected `{"car": 2}` both times" and the `play_media` call dispatched with no error; Jeff confirmed in the Alexa app the cameras ARE linked; and Jeff spoke **"Alexa, show me the 301 driveway camera"** out loud — the real voice command worked, proving the phrase, the name, and Alexa's routing were all fine. Conclusion: injecting the command at the Fire TV's own media_player entity "apparently doesn't trigger the same cross-device display behavior" as a spoken command. The entry explicitly refused to guess at a fix — "deliberately not guessing at a live YAML change without being able to verify it (that's exactly the 'declared done without testing' pattern this whole audit was trying to undo)" — and recorded a Windows lesson from a failed side-quest: an elevated terminal cannot send synthetic mouse/keyboard input into non-elevated app windows (UIPI), so "don't run the terminal elevated if GUI-clicking a normal app is needed."

#### 14222bd (2026-07-14 19:17 UTC) — "Hart of Hive: match Jeff's reference layout + add Open Beehive under chair"

Cloud-session UI work continuing in parallel: CAST/WATCH to mid-monitor level (48%), HIVE centered at 30%, FITNESS on the chair back (68%), and a new OPEN BEEHIVE chip at 88% ("under the chair") with a status dot syncing green/yellow/red with the Beehive connection state.

#### 25e3256 (2026-07-14 14:46 -0500) — "Fire TV pop-up actually fixed: ADB browser launch instead of Alexa" — **the win, for real this time**

The commit body:

> Alexa's synthetic show-camera command was a confirmed dead end (Amazon doesn't honor it for Fire TV the way it does a real spoken command), and Blink's official Fire TV app is incompatible with this device model. Found a third path that bypasses both: androidtv.adb_command opens the camera's live entity_picture URL directly in the Fire TV's browser, with a delayed HOME keypress to cleanly return afterward. Verified end-to-end live twice through the real automation, not simulated.

The CLAUDE.md entry documents both dead ends for the record: the official Fire TV Blink app is "incompatible with this specific Fire TV Stick model (confirmed via the Amazon Appstore listing's own compatibility check, red ✕ next to 'Jeffrey's Fire TV') — dead end, not pursued further (no sideloading)"; the `alexa_media_player` trick works only for real spoken commands. The winning mechanism: `androidtv.adb_command` runs `am start -a android.intent.action.VIEW -d "http://192.168.1.66:8123{{ state_attr('camera.' ~ camera_key, 'entity_picture') }}"` — rendering the live snapshot fullscreen in the Fire TV's built-in Amazon Silk browser — then after an 8-second delay a second ADB command sends `input keyevent 3` (HOME) to return to the launcher. Even the return keypress was empirically chosen: "an earlier attempt using `input keyevent 4`/BACK only partially exited the browser, confirmed via ADB `mResumedActivity` still showing the Silk browser after one Back press — HOME is the reliable universal return." Proof was direct: "proved this by screenshotting the Fire TV directly over ADB (not guessing) and seeing the real driveway photo on-screen, then again with Jeff physically watching the correct HDMI input confirm it." A UX tradeoff was accepted knowingly: the pop-up "takes over the whole screen like switching apps, not a small toast overlay layered over what's playing (that would've needed the original Kodi plan) — acceptable tradeoff since it actually works and Kodi was explicitly declined." One near-miss during the edit: Studio Code Server's Monaco editor "had a focus-stealing UI glitch mid-session that nearly caused a bad edit, caught via `check_config` before it reached disk."

`ef20ec5` (14:46 -0500) is the merge commit pushing this to the shared branch.

#### 8efc3c4 (2026-07-14 23:23 UTC) — "Fix token UX: add inline token input to beehiveCard so Jeff can connect without hunting"

The window closes with a usability fix born of Jeff's own frustration:

> The token input was hidden in the cameras section and only visible after Beehive responded — Jeff couldn't find it, especially on iPad where OPEN BEEHIVE just navigated away. Now when no token is set: the beehiveCard itself shows a gold "Paste Your Token to Connect" box with the input field right there, and the OPEN BEEHIVE button is hidden until connected. Service worker bumped to hcc-v9.

### Decisions made or rejected in this period

- **SYLVANIA plugs abandoned for HA — permanently** (`f010694`, 07-07). "DEAD END for HA (confirmed, do NOT re-attempt the Tuya path)." Replacement path decided: **Kasa KP125/EP25 WiFi plugs** now, or Zigbee plugs (Sonoff S40 ZB / ThirdReality) later to ride the planned Zigbee coordinator. The SYLVANIA plugs stay on the SYLVANIA app + Alexa. No purchase recorded inside this window.
- **Tuya pairing playbook canonized** (`e7d9ef9` / CLAUDE.md 07-07): AP-mode slow-blink, Smart Life in-app QR scanner only, QR is one-time-use.
- **Guardian alert philosophy**: alerts must state their reason; a single offline device is a calm FYI, not ATTENTION; ">15% offline" is the escalation threshold; "0 HOME" is neutral (`a27982a`).
- **Mandatory Rule 13 — coworker delegation** (`bec7440`, "Jeff's rule 2026-07-09"): cloud session owns app code/deploys/research; the beast coworker does hands-on LAN/HA/browser work; the cloud session must **proactively** flag hand-offs. Extended (`9a34d17`): coworker is briefed by cloning the repo, and treats app code as **READ-ONLY** "to avoid two-Claude collisions."
- **Don't blind-swap links**: verified the 5 mower parts/manual deep-links were live before touching them (`fc62533`) — "Good thing we checked instead of blind-swapping working links."
- **Never re-add a custom Blink override** (`7bbc8a2`): "that override shadowing the fixed built-in was the entire bug." The repo's `beehive/blink/` files declared dead artifacts.
- **No subscriptions, ever, for the camera/AI/theater stack** (`dfaa88f`): "free, NO subscriptions … no per-month anything." Free Blink features only; "cloud clip *history* is the only thing the paid plan adds" (`5ddac8a`).
- **The beast = AI + media brain; Beehive stays PURE HA** (`dfaa88f`): "Do NOT put media/AI on it" (the Beelink J45's weak Pentium runs the whole house).
- **Detection engine: CodeProject.AI Server on Windows with the GTX 1050 Ti (CUDA)** — snapshot-based, fits Blink's no-RTSP model. **Frigate and blinkbridge explicitly not needed for this path** (`71a8cae`). Jeff's belief the GPU was a "T750" corrected to GTX 1050 Ti 4GB by `nvidia-smi`. 4GB is "not enough for a full local LLM — use free Gemini tier for rich scene descriptions if wanted" (still $0).
- **Access model for the public app** (`80799e7`/`f474d9b`): public visitors get a view-only demo; family (Angela, Jeff's dad, Braxton) get full access by pasting Jeff's HA Long-Lived Token once per device. Panic gated behind the token. Two low-severity risks accepted, not fixed: open `/api/hours` POST ("griefing only") and the visible Nabu Casa URL.
- **Beehive pinned to fixed IP 192.168.1.66**; fixed IPs for cloud-connected devices (Blink, Tuya) deemed unnecessary (`9785381`). The AT&T BGW320-500 can't change its DNS resolver — per-device 1.1.1.1 or own-router-in-IP-Passthrough is "the only real DNS fix."
- **Native Alexa Routine for TV pop-ups — REJECTED** (`c926ceb`, 07-11): it would bypass HA, losing AI classification, per-camera mute, and family-arrival suppression ("per Jeff's ask"). Chosen: route through HA via `alexa_media_player`. (This path itself later proved a dead end — see below.)
- **Kodi Phase 2 decision (07-10, Jeff's call) — later SUPERSEDED (07-14, also Jeff's call)** (`05dc1db` → `c13f101`): the original decision was "beast-as-media-center via Kodi … **NOT** simple ADB from Beehive to Fire TV — Jeff wants it routed through the beast." On 07-14, with the Fire TV path working-ish and Kodi never actually set up (launched once, 3 minutes, ever), Jeff chose to keep the Fire TV route; Kodi left "installed/unused"; `media-center-setup.md` demoted to "reference/superseded, not a live setup guide."
- **`packages/hcc.yaml` editing doctrine** (`a88ccc6`): use the HA **Terminal add-on** (sed/heredoc) — never the legacy File Editor, and never Studio Code Server without disabling format-on-save; the "Migrate" button in HA's Automations UI must not be clicked without asking Jeff (`987e804`).
- **Animal alerts promoted to time-sensitive** (`6c26465`): an explicit tradeoff Jeff asked for (originally passive — "don't bug me about the cat") so Siri Announce would read them aloud; "not an oversight."
- **Claude never handles credentials**: Amazon login (`c926ceb`, `987e804`) and Angela's HA password (`049ad6d`) were done by Jeff himself, by explicit policy.
- **Angela gets her own HA identity** (`049ad6d`): login `angela301`, `person.angela_loewen`, her own Long-Lived Token — plus the 10-mile "almost home" zone alerting Jeff ~10 minutes before she arrives.
- **Fire TV pop-up final mechanism — ADB browser launch, with HOME (not BACK) as the return key** (`25e3256`); reverting to the `media_player.play_media`/Alexa custom-command approach is forbidden: "do not revert … it's a confirmed dead end for this device." Full-screen takeover accepted over a toast overlay ("that would've needed the original Kodi plan").
- **Splash rebuilt with clean photos + HTML text** rather than further patching baked-in-text images (`c236731`); typography per Clyde's champagne-metallic spec (`406e8b0`).
- **INFERRED:** no dollar amounts appear anywhere in this window's commits or diffs — the period's decisions were about avoiding recurring costs (the "no subscriptions" rule) rather than purchases. (The first price in the record after this window is the $20–30 Fire TV Stick for the onn Roku TV, 07-15 — outside this chronicle.)

### Problems, failures & root causes in this period

1. **SYLVANIA Smart+ plugs won't pair with Smart Life/Tuya.** Symptom: "Unknown device — this device is not supported by this app" in both EZ and AP modes with every setting correct. Wrong attempts: both pairing modes, permission audits, 2.4-only. Real root cause: firmware-locked to the SYLVANIA app; forum-confirmed walled garden; even LocalTuya/flashing back-doors need the same blocked access. Fix: none — hardware dead end recorded so it's never re-attempted (`f010694`).
2. **Guardian cried "⚠️ ATTENTION" with no reason.** Root cause: a single offline device (43/44) tripped the banner. Fix: reasons displayed, >15%-offline threshold, neutral "0 HOME" (`a27982a`).
3. **Blink cameras broken for a week+ — the project's own workaround became the bug.** Symptom: "Login failed," no SMS PIN, then `ConfigEntryNotReady` retry-looping every ~10s. Wrong attempt: the 07-03 custom `custom_components/blink/` override built on the "empty_cookies / dedicated session" theory — explicitly recorded later as "a wrong guess." Real root cause (two layers): (a) Blink changed 2FA to return HTTP 202 with `tsv_state`/`tsv_methods`; old blinkpy read 202 as success so the PIN never appeared — fixed upstream in blinkpy 0.25.6 (PR #1231) → HA core 2026.6.4 (PR #173811); (b) once the official fix shipped, the stale custom override **shadowed the fixed built-in** — the failing traceback was from "OUR `coordinator.py:58`." Fix: `rm -rf /config/custom_components/blink`, delete the entry, restart HA (core 2026.7.1), re-add the built-in → SMS PIN appeared → all 6 cameras live (`9b29c1f` root cause, `7bbc8a2` fix). Side damage: the old code "hammered Blink's login every ~10s for days" risking a rate-limit.
4. **Camera tiles showed icons instead of stills.** Root cause: `fetch().blob()` image loading was CORS-gated. Fix: load HA's signed `entity_picture` URL directly in an `<img>` from the https Nabu Casa host (`5ddac8a`).
5. **Panic button was publicly fireable.** Symptom: any anonymous visitor to the soon-public site could trigger the real alarm via an unauthenticated webhook. Fix: `hccPanic()` requires the stored HA token and routes via the `/api/ha` proxy (`80799e7`).
6. **Wrong memory: "5GHz was turned off."** Earlier notes claimed the gateway's 5GHz radio was disabled during plug pairing; Jeff confirmed it was never off. Correction written into CLAUDE.md with instructions not to tell Jeff to re-enable it (`9785381`).
7. **Windows Firewall silently blocked CodeProject.AI's port 32168.** Symptom: Beehive's detection requests "just timed out with no useful error." Root cause: the installer never added an inbound rule. Fix: `New-NetFirewallRule` for TCP 32168 — "fixed instantly" (`76ae463`).
8. **`packages/hcc.yaml` had NEVER been loaded by HA — ever.** Symptom: `hcc_panic_button`, `hcc_mower_sensor_sync`, `hcc_freeze_warning`, `hcc_severe_weather_alert` showed "unavailable." Real root cause: `configuration.yaml` lacked the `homeassistant: packages: !include_dir_named packages` directive, so the whole valid-YAML file was silently ignored; the entities were "ghost/restored entities that had never truly run, ever." Fix: add the directive — "all 6 automations (4 old + 2 new) came alive simultaneously" (`76ae463`).
9. **Upstream bug in the `codeproject_ai_object` HA component.** `image_processing.py` referenced `cpai.CodeProjectAIServerException`, renamed upstream to `CodeProjectAIException`. Fix: one-line sed patch, "filed nowhere upstream yet" (`76ae463`).
10. **`adb connect` to the Fire TV failed with WSAEACCES.** Root cause: ProtonVPN's WireGuard tunnel on the beast blocked outbound LAN traffic — "same root-cause class as the earlier 'Beehive Offline' `ERR_NETWORK_ACCESS_DENIED` issue." Fix: disable ProtonVPN → connected immediately (`c926ceb`).
11. **Jeff saw a "stale version" of the site.** Wrong hypothesis: bad deploy / domains out of sync. Real root cause: a stale `service-worker.js` cached in his local Chrome profile — both domains were byte-identical (532,663 chars). Fix: clear-site-data steps; plus, separately, the sw was moved to stale-while-revalidate for images and bumped hcc-v7 (`c926ceb`, `24df1fc`).
12. **Desktop-wide-layout bug — found 07-11, fixed 07-12.** Symptom: dead black area right of the heroes on windows wider than ~700-900px. Root cause: hero classes set `aspect-ratio` + `max-height:460px` with no width constraint and no centered shell, so CSS derived width (~700px) from the aspect ratio and left it flush-left. Found (not fixed) by the coworker per Rule 13 (`c926ceb`); fixed by the cloud session's responsive layout (`a1a6d7a`).
13. **Three HA editor corruptions in one day.** (a) Legacy File Editor typed a literal "Page_Up" into `packages/hcc.yaml` (caught, undone pre-save, `987e804`); (b) Studio Code Server typed a literal "Page_Down" (`a88ccc6`); (c) Studio Code Server's Prettier format-on-save "truncated/corrupted the new automation's long single-line flow-YAML" (`a88ccc6`). All caught via `ha core check` before harm stuck. Fix/doctrine: Terminal add-on with sed/heredoc for this file, or disable format-on-save. A fourth near-miss on 07-14 (Monaco focus-stealing glitch) was caught by `check_config` (`25e3256`).
14. **Siri Announce wasn't reading camera alerts aloud.** Two real causes: vehicle/animal pushes used `active`/`passive` interruption levels, which iOS's Announce ignores; and Jeff was testing with the phone unlocked — the feature "only fires when locked with screen off, by Apple's design." Fix: bump both to `time-sensitive` + test with the phone actually locked (`6c26465`).
15. **CodeProject.AI silently dead for 3 days — the whole AI alert pipeline down with no one noticing.** Symptom: Jeff reported cameras/Fire TV "not working as intended." Root cause: the Windows service, though set to Automatic startup, did not come back after the beast's 07-11 6:08 AM reboot; the scan automation kept firing (so nothing looked obviously broken) while every downstream detection silently failed — proven by "Last triggered: 3 days ago" on both downstream automations. Fix: `Start-Service` immediately; hardened with Automatic (Delayed Start) + failure-recovery actions (`c13f101`).
16. **Two contradictory plans for the same feature coexisted for 3 days.** The plan doc said Kodi ("NOT simple ADB … Jeff wants it routed through the beast," decided 07-10, written 07-12) while the live system ran the rejected Fire TV/Alexa route (built 07-11). Discovered by the 07-14 audit; resolved by Jeff choosing the Fire TV path and marking Kodi superseded (`c13f101`).
17. **The "confirmed working end-to-end" Fire TV pop-up claim was false.** The 07-11 verification passed (twice, including a Jeff-confirmed on-screen pop-up), but with the AI pipeline healthy on 07-14 the pop-up failed both live tests. Ruled out: Alexa camera linking (checked in the app), wrong phrase (Jeff's real spoken command worked). Real root cause: `alexa_media_player`'s synthetic `play_media`/custom-command "is not equivalent to a real spoken command" — Amazon's cloud doesn't honor the injected command for cross-device camera display on this device class. The changelog claim was formally corrected rather than papered over (`b108a6e`). **INFERRED:** the 07-11 test's success was likely a device-state coincidence (the record does not explain why the same call worked on 07-11 and not on 07-14; it only proves the 07-14 failures and narrows the cause).
18. **Blink's official Fire TV app: incompatible with Jeff's stick.** Confirmed via the Appstore listing's own compatibility check ("red ✕ next to 'Jeffrey's Fire TV'"); sideloading declined. Dead end #2 on the pop-up road (`25e3256`).
19. **Final Fire TV fix's own sub-bug:** `input keyevent 4` (BACK) only partially exited the Silk browser (confirmed via ADB `mResumedActivity`); HOME (`keyevent 3`) is "the reliable universal return" (`25e3256`).
20. **Elevated-terminal UIPI lesson (Windows):** an elevated process cannot send synthetic mouse/keyboard input to non-elevated app windows — window focus-switching works, clicking does not. "Don't run the terminal elevated if GUI-clicking a normal app is needed" (`b108a6e`).
21. **Jeff couldn't find the token input** — hidden in the cameras section and only shown after Beehive responded; on iPad, OPEN BEEHIVE just navigated away. Fix: inline gold "Paste Your Token to Connect" box directly in the beehiveCard, OPEN BEEHIVE hidden until connected (`8efc3c4`).
22. **Splash screen with baked-in text didn't survive real devices.** The status bar baked into the portrait image collided with phones; a gradient patch (`dfb0460`) was superseded the same day by the proper fix — clean photos + HTML/CSS text (`c236731`). The "--°F" splash temperature bug was traced to `splashStatus()` checking only `climate.*` entities and fixed via `/api/weather` (`406e8b0`).
23. **Unexplained loose ends flagged but not diagnosed in this window:** the localhost failed-login HA notification, and the 07-11 "🚨 EMERGENCY ALERT — HCC Panic triggered at 05:50 PM" ("almost certainly a test/accidental trigger during that session, not a real event, but flagging since panic firing is significant") (`c13f101`). The record is silent on their final resolution within this window.


---

## Chronicle: 2026-07-15 → 2026-07-21 — iPad wall display, CAR section, the stale-cache mystery, family login

This window contains 31 commits on `origin/claude/time-master-project-liq1jw`. It is one of the densest weeks of the whole project: the Fire TV pause/resume got its REAL fix (after two previous "fixed" claims), an iPad Air 2 became (almost) a wall display and surfaced a Safari-15 landmine, a whole new CAR section was born and wired to Jeff's actual Mercedes GLE 350, the months-long stale-content deploy mystery was finally root-caused (twice — the first root cause turned out to be only half the story), and the app got a Family Login so Angela and the family can use it with a shared password instead of pasting Home Assistant tokens.

A note on the cast: commits in this period come from at least three actors — the **cloud session** (Claude Opus 4.6, `Claude-Session: session_01WuKnDJrDp2n6fHjhtahmLe`, owns `index.html` edits per Mandatory Rule 13), the **"coworker/beast" local session** (Claude Sonnet 5, works on Jeff's local machine with ADB/HA access), and Jeff's own GitHub account (`d4c2np9f69-afk <d4c2np9f69@privaterelay.appleid.com>`, e.g. commit `33d604a`). Timestamps below are as recorded in git (a mix of `-0500` local and `+0000` UTC).

### 2026-07-15 — Fire TV finally REALLY pauses, and the iPad Air 2 arrives

#### `3a714fe` (2026-07-15 07:51 -0500) — "Fire TV pop-up: fix 5min Blink delay + fix relaunch resetting DVR playback"

Jeff had used the Fire TV motion pop-up live (the 07-14 ADB/browser fix) and hit two real annoyances. The commit body:

> Added a 30s fast-poll automation to work around Blink's default 5-minute cloud polling, which was the real cause of the reported delay. Also found that relaunching FuboTV via its launcher intent cold-starts it to the show list instead of resuming playback, forcing a restart-and-fast-forward on every trigger. Reverted the auto-return to a plain HOME keypress, which never touches the backgrounded app's state, at the cost of one manual tap back into Fubo (no restart) instead of a fully automatic but broken resume.

The CLAUDE.md changelog entry (visible in the `2965b5a` diff) has the full story: the ~5-minute alert delay was **Blink's default 5-minute cloud poll** — "not something today's or yesterday's automation work touched, it's been the baseline since Blink was set up 07-09." Fix: new automation **"Blink Fast Motion Poll"** in `packages/hcc.yaml` (`trigger: time_pattern seconds: "/30"` → `homeassistant.update_entity` on all 6 Blink motion binary_sensors). The second problem was self-inflicted: an earlier tweak relaunched FuboTV via `monkey -p com.fubo.firetv.screen -c android.intent.category.LAUNCHER 1`, but

> **live testing showed this was wrong**: Jeff is almost always watching either the Braves game live or a **DVR recording** on Fubo, and relaunching the app via its launcher intent makes Fubo **cold-start to its show-list/DVR menu** every time, discarding actual playback position — meaning Jeff had to restart the recording from scratch and fast-forward back to where he was.

A "Recent Apps" task-switch attempt (`input keyevent 187`, KEYCODE_APP_SWITCH) "**doesn't work on this Fire OS build's launcher** (keycode had no visible effect, no recents UI appeared)." Final answer: revert to `input keyevent 3` (HOME) — Home never touches the backgrounded app's state, so the only cost is one manual tap back onto the Fubo tile, which resumes exactly where Jeff left off. The entry closes with a note for the future: "the real fix would be a way to bring an existing Android task to the foreground without invoking its launch-intent routing (e.g. `am` task-focus commands, if this Fire OS build ever supports them) — not found working here, HOME is the safe fallback."

#### `d385d1d` (2026-07-15 07:51 -0500) — routine merge

"Merge branch 'claude/time-master-project-liq1jw' of https://github.com/d4c2np9f69-afk/master-the-master- ..." — no content, just sync between local and remote.

#### `2965b5a` (2026-07-15 09:14 -0500) — "Document real fix for Fire TV pause/resume: media_session dispatch, not keyevent"

This is the third-time's-the-charm moment for the Fire TV pause. Commit body:

> The old AI Show Camera on Fire TV automation sent input keyevent 127 hoping it would pause playback - verified live via ADB that it never actually did anything. Replaced with cmd media_session dispatch pause/play, which drives the Android MediaSession API directly and works system-wide across any app implementing the standard (all Fire OS apps per Amazon's own requirements), not just Fubo. Verified live: genuine pause with frozen position, exact resume on a DVR recording, and a full simulated alert run.

The CLAUDE.md entry it adds is brutally honest about the prior failure:

> **Root cause of the old behavior:** step 1 of `AI Show Camera on Fire TV` sent `input keyevent 127` (raw MEDIA_PAUSE key event) hoping it would pause whatever was playing — **confirmed via live testing this does nothing** (checked `dumpsys media_session`: Fubo's position kept advancing, state stayed "playing"). It had never been verified working — a repeat of the exact "declared done without testing" pattern the whole debugging protocol exists to prevent.

The real fix — `adb shell cmd media_session dispatch pause` — "calls the Android MediaSession API's pause callback directly (system-wide, targets whatever app currently holds the active session) rather than simulating a remote-button press." Verification detail worth preserving forever: "tested on an actual Fox News DVR recording: paused at 335890ms, resumed at 343307ms — the difference is just the few seconds the commands themselves took, not a jump," with pause confirmed "via two identical-frame screenshots a few seconds apart — genuinely paused, not just self-reporting paused." Nuance found: for genuinely LIVE content, resume rejoins the live broadcast edge, which is correct/expected; DVR (what Jeff mostly watches) gets exact-position resume. Why it's universal: "Amazon's own Fire TV developer docs confirm MediaSession integration is required of all Fire OS apps precisely so the remote's physical play/pause button and Alexa voice control work uniformly." The change is one line in `packages/hcc.yaml` (line 367, `"input keyevent 127"` → `"cmd media_session dispatch pause"`), edited via Studio Code Server's integrated terminal with sed "not the GUI editor — avoids the known Prettier format-on-save corruption risk," backed up first, `ha core check` passed, reloaded without restart. End-to-end verification fired a real simulated `codeproject_ai.object_detected` event **while Jeff was actually watching live Fox News on a different input** ("confirmed via him he couldn't see this input, gave go-ahead to test"). Honest caveat retained: "Did not exhaustively re-test on Netflix/Prime/etc. live ... confidence in universality rests on the command being Android/Fire-OS-level rather than per-app, per Amazon's own documentation, not on having clicked through every app." The Pending Items entry was updated with a never-again rule: "do not revert to `input keyevent 127/85` (confirmed no-ops) or the old `media_player.play_media`/Alexa custom-command approach (confirmed dead end, see 07-14)."

#### `33d367d` (2026-07-15 10:08 -0500) — "Fix app hanging on 'Checking...' forever on old Safari (iOS 15, e.g. iPad Air 2)"

Jeff had acquired an iPad Air 2 to run as an always-on `loewenhome.com` wall/kiosk display. It immediately exposed a bug no other device had ever hit. Commit body:

> AbortSignal.timeout() doesn't exist before Safari 16 — every haFetch() call in the app uses it for request timeouts, so on Safari 15 the very first call (checkBeehive's /api/ ping) throws synchronously before the .catch() can run, silently freezing the UI on "Beehive — Checking…" forever with no error ever shown. Root-caused live: Jeff's iPad Air 2 is permanently capped at iOS 15.8.6 (too old for iOS 16), so this is the first device to hit it. Added a small polyfill at the top of the script block so any old-Safari device gets a working AbortController-based signal instead of a crash. Verified the shim's abort/network behavior directly in a browser console before deploying.

#### `af3b16a` (2026-07-15 10:10 -0500) — "Document the AbortSignal.timeout Safari-15 fix and why it crossed the app-code boundary"

The CLAUDE.md entry (headed "RARE APP-CODE EXCEPTION") records that "He pasted a valid HA token and it just sat on 'Checking…' indefinitely — no error, no timeout, nothing." Root cause: "**`AbortSignal.timeout()` was only added in Safari 16 — it does not exist at all in Safari 15.** Every `haFetch()` call in the app (18+ call sites) uses it, so on Safari 15 the very first call throws a synchronous `TypeError` before the promise chain's `.catch()` can ever run." The fix is a ~10-line polyfill at the top of the `<script>` block (`AbortController` has been supported since Safari 12.1) — "zero-call-site-changes shim rather than touching all 18 call sites individually." The shim was verified in a real browser console first (temporarily deleted native `AbortSignal.timeout`, confirmed the polyfill's signal flips `aborted:false` → `aborted:true` after the timeout, and a real fetch completes through it) — "not just reasoned about in the abstract." The file was also swept for other newer-than-Safari-15 APIs (`AbortSignal.any`, `structuredClone`, `Array.prototype.at`) — "none found, this was the only landmine." Why the exception mattered: `index.html` edits are normally the cloud session's exclusive lane (Mandatory Rule 13); the local/beast session made "a one-time exception because Jeff was actively blocked on it in the same conversation, the fix was a minimal isolated 11-line addition ... and routing it through a second session first would have meant leaving Jeff stuck for no real benefit." It first checked `git log`/`git status` were clean, then deployed via the normal push → Cloudflare pipeline, "confirmed live and byte-identical to HEAD on both domains within ~45s of push."

#### `3644f54` (2026-07-15 11:07 -0500) — "Document iPad wall-display setup and onn Roku TV investigation"

Two CLAUDE.md entries. First, the iPad wall display, declared (prematurely, see next commit) "fully set up, confirmed working": Safari site data cleared, dedicated HA long-lived token named **"Ipad"** created on the device ("HA only shows a token's value once, at creation, so each device that needs one has to create its own there"), Home Screen icon named **"HCC Display"** for fullscreen PWA view, Auto-Lock Never, Auto-Brightness off, **Guided Access** enabled (triple-click Home, passcode to exit) with Auto-Lock/Sleep-Wake disabled inside the session. Decluttering for a 24/7 unattended device: Background App Refresh off, Location Services off ("weather data comes from the fixed KTNWHITE21 station, not device GPS"), Bluetooth/Handoff/AirDrop off, Reduce Motion + Reduce Transparency on "to ease the aging A8X chip," and signed out of iCloud entirely — "Jeff's choice — didn't want Find My tracking on it." It stays plugged in permanently: "screen-always-on plus a decade-old battery means it can't run unplugged."

Second, the **onn Roku TV** (32", model D820X, `192.168.1.241`, RokuOS 15.2.4) was investigated for the same always-on display idea. Confirmed via Roku's own ECP API (`/query/device-info`) that it's a genuine Roku, so the Fire TV ADB playbook doesn't transfer. Jeff initially wanted the free option — install a browser channel — but research killed it: "**Web Browser X (the go-to community Roku browser) stopped working back in 2021** and is effectively abandoned even though still listed in the Channel Store, and no current Roku browser channel handles a modern JS/service-worker-heavy page like this app — verified via research before recommending anything, not assumed." Decision: **Jeff will get a cheap ($20-30) Fire TV Stick** to plug into the onn TV's HDMI port — "reuses the exact same proven ADB pairing/kiosk playbook as the viewing-room Fire TV rather than a fragile Roku-native approach." Marked pending purchase; next steps documented (pair via ADB from the beast, add to HA's Android Debug Bridge integration, show loewenhome.com).

#### `3b157b9` (2026-07-15 11:54 -0500) — "Correct iPad wall-display status: setup NOT actually complete, mid-diagnosis"

A same-day honesty correction — the project's recurring "declared done without testing" antibody at work. Commit body:

> Prior entry said "fully set up" prematurely. Real state: still working through a token-persistence issue (never created the Add to Home Screen icon, was testing in plain Safari which lacks the standalone-app storage exemption) and an unconfirmed report that pages beyond HOME aren't loading live data with the newest token. Logged exactly where to pick up.

The rewritten CLAUDE.md entry lays out the mess candidly: (1) Jeff had never actually created the Add-to-Home-Screen icon — "everything was happening in plain Safari, which has Apple's 7-day ITP storage-clearing timer" (standalone Home Screen web apps are exempt from that timer; plain Safari tabs are NOT). (2) "Several rounds of 'clear Safari site data' (**my earlier bad advice, solving an already-fixed problem**) wiped the token repeatedly, forcing Jeff to create a new HA long-lived token each time" — the current token being **"HCC ipad token"**, "yet another new one." (3) The unresolved report, in Jeff's own words:

> after pasting "HCC ipad token" into Safari, HOME loaded fine but Jeff said **"the rest of the pages did not log in"**

— mid-diagnosis when the session hit its context limit. The entry rules in/out what it can (Irrigation legitimately needs a separate B-Hyve login — expected, not a bug), lists exactly what the next session must ask Jeff, and inventories the token clutter to clean up later: two old tokens both named "Ipad", "HCC ipad token" (current), "plus older unrelated ones (HCC 3, HCC long term token, HCC1, HCC)." **The record within this window never shows the iPad setup reaching final confirmation** — as late as `e61e920` (07-21) the Pending Items still carry "(d) iPad Air 2 wall-display setup — ... HA token persistence + 'Add to Home Screen' + Guided Access still need final confirmation."

### 2026-07-16 — Fire TV remote on the WATCH chip (then simplified), and the CAR section is born

#### `586ba10` (2026-07-16 00:21 +0000) — "Add Fire TV remote control to Hart of the Hive WATCH chip"

Cloud session. Tapping WATCH on the Hart of the Hive now opened a full Fire TV remote: what's playing (app name, title, artwork), power/Home/Back, a styled D-pad (Up/Down/Left/Right/OK), Play/Pause, Volume +/-, Mute, a status dot that turns green when the TV is on, all routed through `haFetch` → the `/api/ha` proxy, with light/dark theme CSS.

#### `2433bf1` (2026-07-16 00:29 +0000) — "Simplify Fire TV WATCH to a clean Now Playing card"

Eight minutes later, Jeff rejected the kitchen-sink remote. Commit body:

> Jeff asked for simpler — stripped the full remote control (D-pad, volume, HOME/BACK, navigation) down to just what matters: what's playing on the Fire TV (title, app, artwork) plus Play/Pause. Removed unused D-pad CSS, remote entity reference, and navigation/volume commands.

A small but characteristic moment: build, show Jeff, get told "simpler," strip it down the same session.

#### `33d604a` (2026-07-16 14:28 -0500) + `767ee03` (2026-07-16 19:39 +0000) — the CAR section is born (hcc-v10)

Subject of `33d604a` (authored under Jeff's own GitHub account, `d4c2np9f69-afk`): "Add CAR section — Mercedes GLE 350 Pinnacle Trim Command Center with 7 sub-tabs." That commit itself only touches `service-worker.js` — bumping `CACHE_NAME` from `hcc-v9` to **`hcc-v10`** and adding `./images/hero-car.jpg` to `OPTIONAL_ASSETS`. The actual section landed in `767ee03` ("Add CAR section HTML/CSS/JS — 7 sub-tabs, hero image, scoped tab switching"): `images/hero-car.jpg` (271,060 bytes, an interior-cockpit shot) plus 352 net new lines in `index.html`. Body:

> Mercedes GLE 350 Pinnacle Trim Command Center: Vehicle Status, Diagnostics, Maintenance, Trip & Fuel, Climate, Assistance, Settings. Scoped carTab() avoids YARD tab collision. Card spacing improved app-wide.

The CLAUDE.md entry (added later, condensed in `d84ff94`'s context) records the design specifics: 6th nav tab `#snav-car` / `#section-car`, its own accent variable `--a-car` (#7b8a9e dark / #5a6577 light), 7 sub-tabs via a scoped `carTab()` function, Section-Kit cards with `.car-stat-grid`/`.car-tire-grid` layouts, "Verified in Playwright: all tabs switch, hero active, other sections unbroken, zero JS errors, both themes clean."

#### `5ed12f0` (2026-07-16 20:46 +0000) — "Condense CLAUDE.md for coworker sync — 678→573 lines"

Housekeeping on the memory file itself: condensed Pending Items (removed resolved duplicates for Blink/LUX/Irrigation, collapsed 3 Fire TV entries into 1), compressed the Water/Gas/Electric reference from ~130 lines to ~35, updated pick-up-here to 07-16 state, added CAR references. Explicitly: "All protected sections (Jeff's Message, Working Relationship, Mandatory Rules, Debugging Protocol) untouched."

### 2026-07-17 — CAR wired to live Mercedes data

#### `7afcda2` (2026-07-17 11:30 +0000) — "Wire CAR section to live Mercedes data via mbapi2020 + HA"

The cloud session wrote the client side of the Mercedes integration before the integration itself was even installed on Beehive. Body (in full):

> - loadCar() fetches /api/states and populates: odometer, fuel level, range, lock status, oil, battery, tire pressures (all 4), windows, engine warning, brake warning, wash fluid, service interval, preconditioning status, and GPS location
> - Lock/Unlock buttons + Flash Lights button on Vehicle Status tab
> - Remote Climate button wired to preconditioning entity
> - Status banner updates dynamically (unlocked/window/CEL warnings)
> - Added to 60s self-heal interval + tab-switch trigger
> - Verified: all 7 sub-tabs, all functions, zero JS errors, both themes

#### `d84ff94` (2026-07-17 11:31 +0000) — "Update CLAUDE.md: CAR wired to live Mercedes data via mbapi2020"

Flipped the feature table row from "working (07-16)" to "wired (07-17)" and logged the pending dependency: "**Pending:** Jeff installs mbapi2020 via HACS on Beehive (see setup instructions)." The record is then silent from 07-17 to 07-20 — **INFERRED:** no commits landed on 07-18/07-19 (a weekend of no recorded work); nothing in the git record says why.

### 2026-07-20 — The stale-cache mystery, attempt #1 (browser cache)

#### `173270a` (2026-07-20 16:28 -0500) — "Fix root cause of recurring stale-cache bug: no-cache service-worker.js"

The "site still shows old content after a deploy" bug had haunted the project through multiple earlier "fixes" (cache-version bumps hcc-v3/v6/v10, network-first HTML). Body:

> service-worker.js was being served with a 4-hour browser Cache-Control header (Cloudflare Pages default for static assets), so browsers could go hours without even requesting the new version and stay stuck on old app logic. index.html was already no-cache; this was the missing piece behind the v3/v6/v10/network-first cache fixes not sticking permanently.

The diff is tiny: a brand-new `_headers` file (Cloudflare Pages native config) containing exactly:

```
/service-worker.js
  Cache-Control: no-cache
```

The CLAUDE.md entry (`71cc052`) explains: "`service-worker.js` itself — the file whose only job is to detect updates — was being served with Cloudflare Pages' default `public, max-age=14400, must-revalidate` (4h)."

#### `71cc052` (2026-07-20 16:33 -0500) — "CLAUDE.md: log the service-worker cache-header fix + custom-domain follow-up"

Crucially, this entry records that the fix was **verified live on `toro1-5rz.pages.dev` but NOT on `loewenhome.com`**: "same curl test there still returns the old `max-age=14400` header several minutes after deploy. Likely Cloudflare Pages custom-domain header propagation lag, or a zone-level Cache Rule ... This local session has no Cloudflare API/dashboard access to purge cache or inspect zone Cache Rules." It hands the next (cloud) session a concrete check: `curl -sI https://loewenhome.com/service-worker.js` should show `Cache-Control: no-cache`; if not, purge in the dashboard. This "wait for propagation / purge manually" theory turned out to be wrong — the real answer arrived the next day.

### 2026-07-21 — The big day: HTML cache layer, Family Login, the REAL stale-cache root cause, mbapi2020 live, and a night of CAR bug-fixing

Nine substantive pieces of work landed on 07-21 — the busiest single day in this window.

#### `70dba84` (2026-07-21 14:44 -0500) — "Fix stale HTML: no-cache headers + SW cache bypass for index.html"

Cloud session, extending the 07-20 fix to HTML. Body:

> The service worker's network-first HTML fetch was still going through the browser HTTP cache, so Cloudflare's default max-age meant "network-first" was actually "stale-cache-first." Fix: (1) _headers now serves / and /index.html with Cache-Control: no-cache, (2) SW fetch uses {cache:"no-cache"} to bypass the HTTP cache entirely, (3) cache version bumped to hcc-v11 to force old caches to clear.

The `_headers` file grew `/` and `/index.html` blocks, both `Cache-Control: no-cache`. The phrase "'network-first' was actually 'stale-cache-first'" is the best one-line summary of why every earlier SW-side fix had failed to stick.

#### `8f495e4` (2026-07-21 15:26 -0500) — "Add family login on splash screen + /api/auth endpoint"

New feature: the splash screen gets a password field + LOG IN button. Body:

> Family members enter the shared password → server validates against SHA-256 hash in KV, returns the HA token → everything works. Guests tap "Enter as Guest" for view-only (weather/mower data, no controls). Already-logged-in users (ha_token in localStorage) skip the splash entirely.
>
> On login: sets theme to dark mode (Angela's preference) and inits all HA-connected features (cameras, guardian, lights, car, utilities).
>
> Server: functions/api/auth.js — POST {password} validates + returns ha_token from KV. One-time setup via POST {action:"setup",...}.

Note the human detail preserved in the commit: dark mode on login is "**Angela's preference**." The new server file is 75 lines (`functions/api/auth.js`), plus 53 lines in `index.html`.

#### `4fabef8` (2026-07-21 15:51 -0500) — "CLAUDE.md: document Family Login setup + confirm it's verified working"

The coworker session ran the one-time setup and documented the mechanism in a new permanent **Family Login** section of CLAUDE.md. Key design points, verbatim from that section:

> - `POST /api/auth {"action":"setup","password":"...","ha_token":"..."}` — **one-time only.** Hashes the password (SHA-256) and stores `auth_hash` + `auth_ha_token` in the same KV namespace as `MOWER_KV`/`HCC_KV`. **Refuses to run again if `auth_hash` already exists** (returns `{"error":"already_setup"}`) — this is a safety rail so a stray repeat call can't silently overwrite the real credentials.
> - **Setup confirmed done and verified working 2026-07-21** (coworker session) — ran setup, then confirmed a plain login round-trips correctly and returns the HA token. **Do not run `action:"setup"` again** — it will just get rejected with `already_setup` since it's already configured; that's expected, not a bug.
> - **The actual password and HA token are intentionally NOT recorded in this file or anywhere in the repo** — they only live hashed/stored in Cloudflare KV. If a future session needs to change them, ask Jeff directly rather than searching here for them.

The reset procedure (delete `auth_hash`/`auth_ha_token` keys in the Cloudflare KV dashboard, re-run setup) is documented there too. The same changelog entry also flags that `loewenhome.com` was STILL serving the stale `service-worker.js` header "over an hour after the fix went live on `toro1-5rz.pages.dev`" — the propagation-lag theory was visibly failing.

#### `e37a193` (2026-07-21 15:58 -0500) — "Fix SW cache permanently: registration + CDN-Cache-Control + no-store" — THE REAL ROOT CAUSE

Seven minutes after the family-login doc, the cloud session cracked the mystery. Body, in full:

> Root cause: Cloudflare CDN caches JS files at the edge (cf-cache-status: REVALIDATED) and ignores _headers rules for cached copies. The _headers worked for HTML (cf-cache-status: DYNAMIC) but not for service-worker.js.
>
> Three-layer fix:
> 1. Added SW registration with updateViaCache:'none' — browser always checks network for SW updates, bypassing HTTP cache entirely
> 2. _headers now uses no-store + CDN-Cache-Control: no-store — tells Cloudflare's edge specifically to never cache the SW file
> 3. Registration was missing from index.html entirely — new visitors weren't getting a service worker at all

Layer 3 is the jaw-dropper: **`index.html` had no `navigator.serviceWorker.register(...)` call at all** — so all the service-worker logic (network-first fetch, cache versions hcc-v3…v11) was moot for any new visitor; they never got a service worker installed in the first place. The actual code added at `index.html` line ~5069:

```js
// Service worker registration — updateViaCache:'none' forces the browser to always
// check the network for SW updates, bypassing any CDN/HTTP cache on the JS file.
if('serviceWorker' in navigator){navigator.serviceWorker.register('/service-worker.js',{updateViaCache:'none'});}
```

And `_headers` tightened to:

```
/service-worker.js
  Cache-Control: no-cache, no-store, must-revalidate
  CDN-Cache-Control: no-store
```

#### `6f517ac` (2026-07-21 16:01 -0500) — "CLAUDE.md: correct root cause + mark stale-cache bug resolved"

The documentation commit closes the loop and extracts the lesson. From the CLAUDE.md entry:

> **Real root cause:** standard `Cache-Control` in `_headers` only governs the *browser's* cache. Cloudflare's CDN edge caches JS assets independently (`cf-cache-status: REVALIDATED`) and was never told to stop — it kept serving the stale copy from the edge regardless of the origin header. Separately, **`index.html` had NO service worker registration call at all** — new visitors never even got a SW installed, so the "network-first" fetch logic already in `service-worker.js` was moot for them. ... **Verified live on `loewenhome.com` itself** (not just the `.pages.dev` URL): `cf-cache-status: BYPASS` (was `REVALIDATED`), `Cache-Control: no-cache, no-store, must-revalidate` on `service-worker.js`. **Lesson for any future cache/stale-content bug: check `cf-cache-status` on the live custom domain, not just `Cache-Control` — Cloudflare's edge cache and the browser's HTTP cache are controlled by different headers (`CDN-Cache-Control` vs `Cache-Control`) and must both be addressed.**

The Pending Items #0 was flipped to "Stale-content/cache bug is ✅ RESOLVED." This closed a bug that (per `173270a`'s body) had defeated at least four earlier attempted fixes across two months (hcc-v3, hcc-v6, hcc-v10 version bumps, network-first fetch logic, plus the 07-20 browser-header fix).

#### `4e9445d` (2026-07-21 16:35 -0500) — "CLAUDE.md: mbapi2020 install verified end-to-end, CAR section fully live"

The coworker session installed the Mercedes integration on Beehive and verified everything. The CLAUDE.md entry is the definitive record:

> Installed the `MercedesME 2020` custom integration (HACS → search "Mercedes" → `ReneNulschDE`'s repo, download, restart HA), configured region **North America**, authenticated with Jeff's Mercedes me account (Jeff entered his own email/password/verification code directly — coworker does not type third-party account passwords into browser forms). Vehicle found and named "GLE 350" (VIN `4JGFB4KB0MA478988`). **Verified live in Developer Tools → States:** `sensor.gle_350_odometer` (56883), `sensor.gle_350_fuel_level` (52%), `sensor.gle_350_range_liquid` (320), `lock.gle_350_lock` (unlocked), all 4 `sensor.gle_350_tire_pressure_*` (35/35/35/34), `binary_sensor.gle_350_windows_closed`, `sensor.gle_350_starter_battery_state`, `device_tracker.gle_350_device_tracker` (home), plus the full set of warning binary_sensors (engine light, brake fluid, wash water, park brake, tire, theft system) — all match the keywords `loadCar()` searches for exactly, no app code changes needed. **NOT available for this vehicle/account:** `oil_level`, `service_interval`, `preconditioning` — the integration's own `sensor.gle_350_rcp_features` reports `False`, meaning Mercedes hasn't enabled that capability on this account/vehicle tier (not an HA or install issue, nothing to fix here). **Confirmed by Jeff 2026-07-21: logged into `loewenhome.com` with the family password, CAR tab shows live data.**

The feature-table row went from "wired (07-17)" to "**LIVE (07-21)**." Note the boundary rule recorded in passing: the coworker "does not type third-party account passwords into browser forms" — Jeff entered his own Mercedes credentials.

#### `2fdef21` (2026-07-21 16:41 -0500) — "Compress Change Log per file's own memory-hygiene rule (73.6KB->49.6KB)"

CLAUDE.md hygiene, with the reasoning spelled out:

> CLAUDE.md is injected as context on every message in every session (cloud and local), so its size has a real, ongoing token cost. The Change Log had drifted from "one line each" (rule #11) to dozens of full paragraphs duplicating detail that already lives in git log. Condensed every entry through 06-23 to one line, keeping every date, root cause, and gotcha, dropping the step-by-step verification prose. No protected sections (Jeff's Message, Working Relationship, Mandatory Rules, Debugging Protocol) or reference sections touched.

(This is directly relevant to why this CLOUD_SESSION_HISTORY file exists — the long-form paragraph entries whose loss this archive guards against were being deliberately compressed out of CLAUDE.md to save tokens, on the premise that "full detail always in `git log`.")

#### The evening CAR-bug run: `6464a8e`, `c50fcf7`, `7555a75`, `14b0f17`, `502bcff`, `e61e920` (2026-07-21 22:07 → 23:22 +0000)

With CAR live on real data, real-world bugs surfaced within hours — a classic keyword-matching contamination story in three acts.

**Act 1 — cross-contamination, windows (`6464a8e`, 22:07):** "Fix false window-open alert: scope CAR windows to Mercedes entities only."

> The CAR section's find('window') was matching ALL binary_sensors with "window" in their name — including house window contact sensors from HA. A house window reporting 'on' (open) made the CAR section falsely say "Window open." Same cross-contamination in reverse: Guardian's door/window check was counting Mercedes car window entities as house windows.
>
> Fix: CAR window check now requires mercedes/gle/mbapi in the entity_id. Guardian door/window check now excludes those same car entities.

**Act 2 — better diagnostics (`c50fcf7`, 22:12):** "Show which Mercedes window is reported open instead of generic 'Open'" — "Strips the vehicle name and shows just the window position (e.g. 'Front Left open' or 'Sunroof open') so Jeff can tell if it's a real window, the sunroof tilt, or stale data from Mercedes me." This diagnostic step is what exposed the real bug in Act 3.

**Interlude — the hero image (`7555a75`, 22:38 and `14b0f17`, 23:03):** Two passes at cleaning up `hero-car.jpg`. First attempt cropped the baked-in "PINNACLE TRIM COMMAND CENTER" text off the top and removed the HTML text overlay. Jeff evidently wanted the branding kept but the clutter gone (**INFERRED** from the second commit's framing; the record doesn't quote his words), so `14b0f17` redid it properly: "Crop-stitched the source image to keep Mercedes-Benz star + GLE 350 4MATIC branding while removing the cluttered text. Updated CSS aspect-ratio to match new 1320x677 dimensions and object-position to center top."

**Act 3 — the real window bug (`502bcff`, 23:18):** even after scoping to Mercedes entities, "Open" still showed falsely. "Fix false window-open: invert logic for *_closed entities from mbapi2020":

> Root cause: binary_sensor.gle_350_windows_closed uses inverted semantics where on=closed, off=open. The old code assumed on=open for all window entities, showing a false "Open" warning when windows were actually closed.

**`e61e920` (23:22)** logged all of it to CLAUDE.md with the distilled lesson: "**Lesson: always check mbapi2020 entity naming conventions — `*_closed` entities invert on/off semantics.**"

#### `131dc16` (2026-07-21 18:23 -0500) — "CLAUDE.md: log Sling switch handling + Alexa ad-skip wiring (coworker)"

Meanwhile in the coworker session: **Jeff switched TV services from Fubo to Sling TV**. The good news, verbatim from the CLAUDE.md entry:

> Confirmed `packages/hcc.yaml` has zero Fubo/Sling-specific references (all Fire TV automations use generic ADB/`media_session dispatch`, not app package names) — nothing broke.

— i.e., the 07-15 decision to use the system-level MediaSession API instead of app-specific hooks paid off immediately: a full streaming-service switch required zero automation changes. The session also solved a mystery about the commercial-skip feature:

> Found `script.hcc_skip_commercial` + `script.hcc_resume_fire_tv` already existed (16× `input keyevent 90` fast-forward taps + auto-resume) but were **never exposed to Alexa** — that's the whole reason "Alexa FF the commercials" wasn't working.

Both were exposed to Alexa, and two new scripts were added to `packages/hcc.yaml`: `script.hcc_open_sling` (`monkey -p com.sling -c android.intent.category.LAUNCHER 1` via `androidtv.adb_command`, "tested working live via direct ADB") and `script.hcc_check_current_app` (on-demand `dumpsys activity activities | grep mResumedActivity`, result landing in `media_player.fire_tv_viewing_room`'s `adb_response` attribute — "the building block for any future 'what's playing' automation"). Loaded via Developer Tools → YAML → Quick reload, no restart. The voice phrases, for the record: **"Alexa, turn on HCC Skip Commercial Break", "HCC Resume Fire TV Show", "HCC Open Sling TV."** This session is also credited with finding and reporting the CAR window false-positive root cause, "fixed same day by cloud session" — a clean example of the two-session division of labor working.

#### `9647ca5` (2026-07-21 23:34 +0000) + `6aeba2f` (23:34 +0000) — "Fix CAR lock cross-contamination: scope to Mercedes entities only"

The window cross-contamination lesson generalized: the same bug existed for locks.

> - loadCar() lock display: filter to mercedes/gle/mbapi entities instead of matching any lock.* entity (was picking up house locks)
> - carLockCmd(): same Mercedes-only filter so lock/unlock commands target the car, not a house lock
> - Night Check: exclude Mercedes lock entities from house lock count

The `carLockCmd()` item is safety-relevant: before this fix, tapping LOCK/UNLOCK in the CAR tab could have targeted **a house lock** instead of the car. `6aeba2f` logged it and extended the CLAUDE.md lesson to its final form: "**Always scope CAR entity lookups to Mercedes/GLE/mbapi to prevent house-entity bleed.**" These are the last two commits of the window (23:34 UTC, 07-21).

### Decisions made or rejected in this period

- **Fire TV auto-return: HOME keypress, permanently** (`3a714fe`, 07-15). Auto-relaunching Fubo via launcher intent REJECTED after live testing (cold-starts to the show list, loses DVR position); `input keyevent 187` Recent-Apps switch REJECTED (no-op on this Fire OS build). Accepted trade-off: "one manual tap back into Fubo (no restart) instead of a fully automatic but broken resume."
- **Fire TV pause: `cmd media_session dispatch pause/play`, never keyevents** (`2965b5a`, 07-15). Never-again rule written into CLAUDE.md: "do not revert to `input keyevent 127/85` (confirmed no-ops) or the old `media_player.play_media`/Alexa custom-command approach (confirmed dead end)." This choice of the system-level API over app-specific hooks is what later made the Fubo→Sling switch a zero-change event (`131dc16`).
- **Safari-15 support via a single polyfill, not 18 call-site edits** (`33d367d`, 07-15) — 10-line `AbortSignal.timeout` shim on top of `AbortController` (Safari 12.1+). Also a process decision: the local session made a documented one-time exception to Mandatory Rule 13 (`index.html` = cloud session's lane) because Jeff was actively blocked (`af3b16a`).
- **iPad Air 2 as the wall display**, configured deliberately: token per device (HA shows token values only once), Guided Access kiosk mode, always plugged in, and **signed out of iCloud entirely — "Jeff's choice — didn't want Find My tracking on it"** (`3644f54`).
- **Roku browser-channel path REJECTED; $20–30 Fire TV Stick chosen** for the onn Roku TV (`3644f54`, 07-15). Jeff initially wanted the no-purchase browser-channel route; research showed Web Browser X died in 2021 and no Roku browser can run this app. Decision: buy a cheap Fire TV Stick and reuse the proven ADB kiosk playbook. Purchase still pending at window's end.
- **Full Fire TV remote UI REJECTED by Jeff** (`2433bf1`, 07-16): "Jeff asked for simpler" — WATCH chip reduced to a Now Playing card + Play/Pause.
- **CAR section design** (`767ee03`, 07-16): 7 sub-tabs, scoped `carTab()` to avoid YARD collision, own accent `--a-car`, hero `hero-car.jpg`, SW bumped to hcc-v10.
- **mbapi2020 (MercedesME 2020, ReneNulschDE) via HACS, region North America** as the Mercedes data source (`7afcda2` wiring 07-17; install verified `4e9445d` 07-21). Boundary rule: Jeff enters his own third-party credentials — "coworker does not type third-party account passwords into browser forms."
- **oil_level / service_interval / preconditioning: accepted as unavailable, not a bug** (`4e9445d`) — `sensor.gle_350_rcp_features` reports `False`; it's a Mercedes account/vehicle-tier capability limit. "Nothing to fix here."
- **Family Login architecture** (`8f495e4`/`4fabef8`, 07-21): shared password → SHA-256 hash in Cloudflare KV → server returns the HA token; guests get view-only; setup is one-time and **refuses to re-run** (`already_setup` safety rail); **credentials deliberately NOT recorded in the repo or CLAUDE.md** — "ask Jeff directly rather than searching here for them." Dark mode set on login per "Angela's preference."
- **Cache policy, final form** (`173270a` → `70dba84` → `e37a193`): `_headers` with `no-cache` on `/`, `/index.html`; `no-cache, no-store, must-revalidate` + `CDN-Cache-Control: no-store` on `/service-worker.js`; SW registered with `{updateViaCache:'none'}`; SW HTML fetch uses `{cache:"no-cache"}`; cache name hcc-v11. Standing rule: "check `cf-cache-status` on the custom domain, not just `Cache-Control`."
- **CLAUDE.md memory hygiene** (`5ed12f0` 07-16, `2fdef21` 07-21): Change Log compressed 73.6KB→49.6KB per its own rule #11 ("one line each") because the file "is injected as context on every message in every session ... its size has a real, ongoing token cost." Protected sections never touched.
- **Entity-scoping rule born** (`6464a8e`/`9647ca5`/`6aeba2f`, 07-21): "Always scope CAR entity lookups to Mercedes/GLE/mbapi to prevent house-entity bleed," and its sibling: "`*_closed` entities invert on/off semantics."
- **Fubo → Sling TV switch** (Jeff's decision, recorded `131dc16` 07-21). The record does not state why he switched — the record is silent on the reason (cost, content, or otherwise).

### Problems, failures & root causes in this period

1. **Fire TV pause never actually worked (symptom: show kept playing under the camera pop-up).** Wrong attempt: `input keyevent 127` (raw MEDIA_PAUSE) — shipped earlier without live verification; `dumpsys media_session` proved it "does nothing." The write-up names it "a repeat of the exact 'declared done without testing' pattern the whole debugging protocol exists to prevent." Real fix: `cmd media_session dispatch pause` via Android's system MediaSession API, verified frame-for-frame. Fix commit `2965b5a` (07-15).
2. **~5-minute delay on Blink motion alerts.** Not caused by any recent change — Blink's default 5-minute cloud poll, the baseline since 07-09. Fix: "Blink Fast Motion Poll" automation, 30s `homeassistant.update_entity` on all 6 motion sensors. Commit `3a714fe` (07-15).
3. **Fubo auto-relaunch destroyed DVR position.** Wrong attempt: launcher-intent relaunch (cold-start to show list — Android routes fresh launch intents to a default screen by design); wrong attempt #2: KEYCODE_APP_SWITCH (no-op on this Fire OS launcher). Fix: revert to HOME keypress, accept one manual tap. Commit `3a714fe` (07-15).
4. **App frozen on "Beehive — Checking…" forever on the iPad Air 2.** Root cause: `AbortSignal.timeout()` doesn't exist in Safari 15 (iPad permanently capped at iOS 15.8.x); the synchronous TypeError fired before any `.catch()` could run — silent freeze, no error shown. Fix: polyfill at top of the script block, console-verified before deploy. Commit `33d367d` (07-15). The iPad is now the project's designated "canary for any future old-Safari compatibility issues."
5. **iPad wall display declared "fully set up" prematurely** (`3644f54`), corrected hours later (`3b157b9`). Compounding failures: Add-to-Home-Screen never actually created (plain Safari is subject to Apple's 7-day ITP storage wipe; standalone web apps are exempt); repeated "clear Safari site data" advice — self-described as "my earlier bad advice, solving an already-fixed problem" — wiped the HA token over and over, forcing Jeff to mint new tokens each time (ending on "HCC ipad token", with a pile of orphaned tokens to clean up). Left mid-diagnosis at context limit on Jeff's report "the rest of the pages did not log in"; still listed as unconfirmed at the end of this window.
6. **THE STALE-CONTENT DEPLOY MYSTERY — resolved in two stages after months of failed fixes.** Symptom: `loewenhome.com` kept showing old content after deploys, despite cache-version bumps hcc-v3/v6/v10 and network-first SW logic. Attempt #1 (`173270a`, 07-20): `service-worker.js` served with Cloudflare Pages' default 4-hour browser cache → `_headers` `no-cache`. Worked on `toro1-5rz.pages.dev`, did NOT work on `loewenhome.com`; "propagation lag / needs manual purge" theory failed ("no amount of waiting fixed it"). Attempt #2 / partial (`70dba84`, 07-21): SW's "network-first" HTML fetch was going through the browser HTTP cache — "'network-first' was actually 'stale-cache-first'" → no-cache on `/` and `/index.html`, `{cache:"no-cache"}` in the SW fetch, hcc-v11. REAL root cause (`e37a193`, 07-21, ~an hour later): **(a)** Cloudflare's CDN edge caches JS independently of browser `Cache-Control` (`cf-cache-status: REVALIDATED`) and ignores `_headers` for already-cached copies — it needed the separate `CDN-Cache-Control: no-store` directive; **(b)** `index.html` had **no service-worker registration call at all**, so new visitors never got a SW and every SW-side fix since the beginning had been moot for them. Verified on `loewenhome.com` itself: `cf-cache-status: BYPASS`. Lesson enshrined in CLAUDE.md: "check `cf-cache-status` on the live custom domain, not just `Cache-Control` — Cloudflare's edge cache and the browser's HTTP cache are controlled by different headers ... and must both be addressed."
7. **"Alexa FF the commercials" never worked.** Root cause was embarrassingly simple: `script.hcc_skip_commercial` and `script.hcc_resume_fire_tv` existed and worked but "were **never exposed to Alexa** — that's the whole reason ... it wasn't working." Fix: expose them; add Sling launcher + current-app-check scripts. Recorded in `131dc16` (07-21).
8. **CAR falsely reported "Window open."** Two stacked root causes, found in sequence: (a) `find('window')` matched HOUSE window contact sensors (and Guardian conversely counted CAR windows as house windows) — fixed by Mercedes/GLE/mbapi entity scoping, `6464a8e`; (b) even scoped, `binary_sensor.gle_350_windows_closed` uses inverted semantics (`on` = closed) — the code assumed `on` = open for all window entities — fixed by `*_closed` inversion logic, `502bcff`. The intermediate diagnostic commit `c50fcf7` (name WHICH window is open) is what separated the two causes.
9. **CAR lock cross-contamination — including commands.** `val('lock.')` matched any lock entity (house locks), and `carLockCmd()` could have sent lock/unlock to **a house lock instead of the car**; Night Check counted the Mercedes lock as a house lock. Fixed by the same Mercedes-only scoping in both display and command paths, `9647ca5` (07-21, final commits of the window).
10. **Not-a-bug, recorded to prevent future wasted debugging:** `oil_level`, `service_interval`, `preconditioning` missing from the GLE 350's entities is a Mercedes account/tier capability limit (`sensor.gle_350_rcp_features` = `False`), "not an HA or install issue, nothing to fix here" (`4e9445d`).


---

## Chronicle: 2026-07-22 → 2026-07-28 — mbapi2020 rewrite, utility bill calibration, F-250, garage door

This window covers 31 commits on `origin/claude/time-master-project-liq1jw`, from `52e492f` (2026-07-22 00:04:30 +0000) to `281d65b` (2026-07-28 16:46:57 -0500). It is one of the densest weeks in the project: the Mercedes CAR command stack was built wrong, torn down, rebuilt research-first from the mbapi2020 source code, and then had a second wrong layer (app-level PIN prompts) added and removed; all four utilities (water, sewer, gas, electric) were calibrated to the penny against Jeff's real paper bills; Jeff bought a 2001 Ford F-250 Super Duty and it entered the app; the garage door got its app-side card while the myQ cloud path was confirmed permanently dead (ratgdo ~$35 chosen instead); and 07-28 was a full day of utility-pipeline honesty fixes capped by the discovery that the water pit radio had physically died.

Two housekeeping notes on the record itself:

- **INFERRED / record correction:** the planning notes for this archive referenced hashes `de32a4b → bc81c84` for the PIN-prompt mistake and its removal. Those hashes do not exist anywhere in this repository (verified with `git log --all`). The actual commits are **`eeaa0b7` (add PIN prompt, 07-24 11:55 UTC) → `c73e32e` (remove it, 07-24 12:35 UTC)**, chronicled below.
- **The record is silent** on any "sync commits to the old toro-timemaster- repo" inside this window — no commit on this branch between 07-22 and 07-28 mentions syncing to that repo. (The old repo does exist in the project's history — an 08-06 commit `2b0cb3d` later arranges its archival — but no sync activity is evidenced in this specific window.)

### 2026-07-22 — CAR commands: from guessing to research (the mbapi2020 rewrite)

The day opened at 00:04 UTC with a leftover from the 07-21 window-inversion saga. **`52e492f`** (2026-07-22 00:04:30 +0000) — *Fix CAR status banner: apply \*_closed inversion to window check*:

> The status banner at top of CAR section had a second window check that still used the old s.state === 'on' logic without handling the inverted \*_closed entity naming from mbapi2020. Also added .catch to carLockCmd so network errors show a message.

Then came a rapid feature burst driven by Jeff's usability request. **`22d907f`** (00:08:48) — *Add REMOTE START + CLIMATE button to CAR first tab*:

> Jeff wants the start button visible on the VEHICLE STATUS tab without having to scroll to the CLIMATE sub-tab.

**`596ec69`** (00:12:40) — *Move all climate + comfort controls to CAR first tab* — went further: interior/exterior temp, A/C, seat heaters (driver + passenger), seat ventilation, steering wheel heat, rear climate, defrost, and the REMOTE START button all moved to the VEHICLE STATUS tab; the old CLIMATE tab became a redirect.

**`782277b`** (00:16:06) — *Add MAX COOL button to CAR — one-tap blast A/C + seat cooling*:

> Starts preconditioning (remote start + A/C) and sets seat ventilation to max for both driver and passenger. For 110-degree days when you want the car ice cold before you get in.

**`2820cdc`** (00:18:12) — *Add MAX HEAT button — remote start + seat warmers + steering heat* — the winter mirror-image, "Buttons sit side by side under REMOTE START." **`bfccb3b`** (00:20:01) — *MAX COOL/HEAT now control the whole car, not just front seats* — extended both buttons to every Mercedes climate entity (front and rear seat heat/vent, steering wheel heat, defrost, temperature setpoint min/max) via shared helpers `carFindMerc`, `carMaxEntity`, `carStartPrecond`.

Then reality intruded: **none of the command buttons worked**, because they were all built on guessed entity names. **`8d339ee`** (00:32:38) — *Rewrite CAR commands: use discovered entities, not hardcoded guesses*:

> Root cause: all car command functions (lock, remote start, max cool, max heat) were searching _grdStates with narrow keyword guesses that didn't match real mbapi2020 entity names, so every button failed.

The fix had `loadCar()` cache all Mercedes entities as `_carEntities` during its `/api/states` fetch, and introduced helpers (`carFindEnts`, `carSendCmd`, `carSendMin`) that searched both `entity_id` and `friendly_name` across switch/button/number/select/climate types. **`59db50e`** (00:34:45) — *Add Mercedes Entity Scan to CAR Settings tab* — added a diagnostic view showing "every Mercedes entity Beehive knows about, grouped by type… This lets us see the real entity names instead of guessing."

But even that approach was still wrong — entity-fishing instead of using the integration's designed API. Twenty minutes later came the real rewrite, and the commit that gave this window its name. **`778f6bd`** (00:53:19) — *Rewrite CAR commands with proper mbapi2020 domain services (researched from source)*:

> Replace entity-guessing approach (carFindEnts/carSendCmd/carSendMin) with carMbSvc() helper that calls mbapi2020 domain-specific services with VIN.
>
> - REMOTE START: mbapi2020.engine_start (gas vehicle, PIN required)
> - STOP ENGINE: mbapi2020.engine_stop (new button added)
> - LOCK/UNLOCK: mbapi2020.doors_lock/doors_unlock (PIN for unlock)
> - FLASH LIGHTS: mbapi2020.sigpos_start (no hardcoded entity name)
> - MAX COOL: engine_start + temperature_configure(16°C) + configure_seats
> - MAX HEAT: engine_start + auxheat_start + temperature_configure(30°C) + seats
> - Entity scan: now shows VIN, available gas-vehicle services, EV-only warnings
>
> Key research findings: preheat_start is EV-only (not for gas GLE 350), auxheat_start is the gas vehicle heater, engine_start requires PIN configured in mbapi2020 integration options.

The CLAUDE.md entry written for this session (visible in the `ebd2a3a` diff) records the full scope of the research — "Thorough research of mbapi2020 GitHub repo, README, source code (client.py, switch.py, lock.py, button.py, services.yaml, const.py), HA community forums" — done "research-first, per Jeff's directive," and records the GLE 350's VIN `4JGFB4KB0MA478988` used in every `carMbSvc()` call. It closes with the standing lesson:

> **Lesson: never guess entity names or service calls — research the integration's actual source code and use domain-specific services with known parameters.**

The session then hardened error handling. **`778fe00`** (02:05:56) — *CAR commands: add real diagnostic error reporting*:

> carMbSvc() now parses the response body so command handlers get actual HTTP status + HA error messages. New carCmdFail() helper shows the real failure reason (service not found, token rejected, Beehive unreachable) instead of a generic "Failed" message. Entity scan now also checks /api/services to verify mbapi2020 services are registered in HA.

And **`71d0dc2`** (02:19:38) — *CAR: fix temp string types, add pull-mode diagnostics, honest success msgs* — the last commit of the night, containing four more source-code findings:

> Root cause research from mbapi2020 source code:
> - temperature_configure expects string select values ("16") not numbers (16)
> - commands silently fail when capability check blocks them (NA vehicles)
> - pull mode (WebSocket disconnected) rejects ALL commands with 400
> - HA 200 OK only means "accepted" not "Mercedes executed it"

The fixes: `temperature_configure` now sends `"16"`/`"30"` as strings per `services.yaml`; `carCmdFail` detects the pull-mode error and shows a WebSocket reconnect hint; success messages honestly say "Command sent" with a 30-second expectation rather than claiming execution; the entity scan checks the `data_mode` sensor (push vs pull) and shows a 5-point command checklist — (1) Disable Capability Check (critical for North American vehicles), (2) PIN in integration options, (3) Mercedes Me Connect subscription active, (4) MFA must be OFF, (5) update to v0.38.0+.

### 2026-07-23 — Utility bill calibration day: water, sewer, gas, electric, all verified against real bills

Seven commits between 14:27 and 15:59 UTC turned rough utility estimates into penny-accurate bill models.

**`7b3de68`** (14:27:22) — *Add sewer charges to water cost estimate, calibrate rates from actual bill*:

> City of White House sewer bill (3/8-4/7/26) validated: sewer base $22.74 + $0.00982/gal consumption. Combined water+sewer estimate now shows in the utility card. Also corrected the irrigation sewer rate from the old estimate ($0.01136) to the bill-validated rate ($0.00982).
>
> Bill validation: 2,461 gal usage, $24.17 sewer consumption = $0.00982/gal. Math check: for 2,461 gal the combined estimate = $79.57 (water $32.66 + sewer $46.91), consistent with the bill totals.

**`ebd2a3a`** (14:33:43) — *Update CLAUDE.md: water+sewer bill validation complete* — recorded the water side: "WHUD rates confirmed from bill ($10.32 + $0.00908/gal). Sewer rates validated ($22.74 base + $0.00982/gal). Old meter 17272512 swapped for 25394131 ~4/29/26." Its diff adds the detail that the $10.32 + $0.00908/gal rates are "printed on WHUD bill, validated: math matches $39.90 charge for 3,258 gal" (bill dated 05/28/26), and that the City of White House sewer "mirrors the WHUD meter, no separate meter."

Then came the feature Jeff actually wanted this data for — his sewer-overcharge case. **`99fe1ba`** (14:51:45) — *Break out water vs sewer costs separately, add irrigation sewer overcharge note*:

> Water card now shows three cost lines: Est. Water, Est. Sewer, and Combined (was a single combined line). When irrigation data is available, a red note appears showing how many gallons/mo go on the lawn and never enter the sewer, with the dollar amount being overcharged — building Jeff's case for seasonal sewer averaging or an irrigation meter.

**`8d32625`** (15:01:12) — *Add billing history tracking for water/sewer overcharge case*:

> Tracks up to 24 billing cycles in localStorage with per-cycle water cost, sewer cost, and irrigation sewer waste. Renders a history table on the water utility card with running total of cumulative sewer overcharge. Hoisted history functions to loadUtilities() scope so history shows even without Beehive.

(The localStorage key, per the CLAUDE.md entry, is `water_billing_history`.) **`5e6d616`** (15:02:18) is the matching one-line CLAUDE.md changelog update.

Electric followed. **`8a9df3b`** (15:53:27) — *Calibrate electric rates from CEMC bill, add Est. Cost tile*:

> CEMC rates validated from 06/30/2026 bill: $39 base + $0.08657 energy + $0.02815 TVA fuel = $0.11472/kWh all-in. Added Est. Cost tile to electric utility card. Cost auto-calculates when DIY ATM90E32 monitor comes online with sensor.electric_month data.

And gas closed out the day. **`0d6c9de`** (15:59:17) — *Calibrate gas rates from 3 Piedmont bills, replace rough estimate*:

> Piedmont/Spire 301 Residential validated from May-Jul 2026 bills: $13.44 base + $0.61809 dist + $0.61691 PGA = $1.235/therm, heat factor 1.068 (CCF to therms), 5% franchise fee. All three bills verified to the penny ($34.58, $47.83, $27.08). Replaces the old $1.12/CCF rough estimate with proper base+per-therm+franchise.

This closed a pending item that had been parked since 07-03 ("gas billing sync parked until Jeff's first Spire bill" — `8ee5658`). By end of day the CLAUDE.md pick-up-here block could declare: "**ALL THREE UTILITIES CALIBRATED** — water ($10.32 + $0.00908/gal), sewer ($22.74 + $0.00982/gal), gas ($13.44 + $1.235/therm × 1.05 franchise), electric ($39 + $0.11472/kWh)."

### 2026-07-24 — Stale data fix, the PIN-prompt mistake and reversal, and the F-250 arrives

**`2c95ffc`** (00:16:28 UTC) — *Fix stale data: add auto-refresh for sensors, cameras, weather* — a real app-wide bug:

> Root cause: mowerSync, loadCameras, and loadWeather only ran ONCE at startup with no periodic refresh. The 60s self-heal interval covered Guardian/Lights/Vacuum/Utilities/Car but missed these three.
>
> Changes:
> - Section switch now reloads data: HOME→cameras+status, WEATHER→weather, YARD→sensor sync (matches Guardian/Car which already did this)
> - 60s interval now includes mowerSync + loadCameras
> - Weather gets its own 5-minute auto-refresh interval

**`15ca7d8`** (00:17:45) documented it in CLAUDE.md, adding the lesson: "**when adding a new loader, add it to BOTH the section switch AND the periodic interval.**"

Later that morning came the day's mistake. **`eeaa0b7`** (11:55:01) — *Add Mercedes PIN prompt for remote start, unlock, and other PIN-required commands*:

> carMbSvc() now passes pin field for engine_start, doors_unlock, windows_open, sunroof_open, sunroof_tilt. PIN entered once via prompt, saved in localStorage. Settings tab shows PIN status + Change PIN button. All PIN-requiring commands (remote start, unlock, MAX COOL, MAX HEAT) prompt if no saved PIN.

Forty minutes later it was reversed. **`c73e32e`** (12:35:04) — *Remove app-level PIN prompts — mbapi2020 handles PIN from integration options*:

> The PIN is configured in Beehive (HA > mbapi2020 > Options), not in the app. Removed PIN prompt wrappers from carLockCmd, carMaxCool, carMaxHeat. Removed pin field from carMbSvc service calls. Updated Settings PIN card to point to Beehive integration options.

The CLAUDE.md entry (**`c64d0f8`**, 12:37:14) is unusually candid about whose error it was, and also records the moment the CAR commands actually started working:

> **Root cause: I added `carPromptPin()` wrappers that blocked commands with a PIN input modal, but mbapi2020 handles PIN from its integration options automatically — the app should never send a `pin` field. Also, Jeff enabled "Disable Capability Check" in mbapi2020 options (was why all commands except flash lights failed).** … **Lesson: mbapi2020 PIN is configured server-side in HA integration options — never prompt for or send it from the app.**

That afternoon, the fleet doubled. **`ee0d376`** (15:17:36) — *Add Ford F-250 Super Duty to CAR section with vehicle switcher*:

> Vehicle picker strip lets Jeff toggle between GLE 350 and F-250. Each vehicle has its own tab bar and hero image. Ford tabs include Truck Status (OBD-II ready), Specs, Maintenance, and Mods & Upgrades. Saved vehicle persists in localStorage.

The diff (211 lines in `index.html` plus a new 224 KB `images/hero-truck.jpg`) records the truck's specs as entered: **2001 Ford F-250 Super Duty, VIN `3FTNX21FX1MA23431`, 7.3L V8 Power Stroke Diesel, 4WD, automatic, crew cab, 38-gal tank, 12,500 lbs towing, 3,980 lbs payload, ~6,500 lbs curb weight**. Maintenance tracking is diesel-specific — oil & filter, fuel filter, air filter, transmission fluid, coolant flush, brakes, tires, glow plugs, and dual batteries — and a Mods & Upgrades tab includes a lift-kit slot. CLAUDE.md (**`42b6c72`**, 15:22:01) adds: "No HA connectivity for the F-250 (2001 = pre-connected-car era); OBD-II + ESP32 is the future path for live diagnostics" — specifically a "Veepeak OBDCheck BLE+ (~$30) + ESP32 + optional GPS module (NEO-6M, ~$12)" — and the caveat "**Jeff should confirm specs** (assumed 7.3L Diesel/4WD/crew cab from VIN + photo)." The active-vehicle choice persists in localStorage key `hcc_vehicle`.

### 2026-07-25 — no commits

The record is silent for 07-25; no commits fall on that date.

### 2026-07-26 — Garage door card, and the myQ verdict

**`590303e`** (20:23:14 UTC) — *Add Garage Door control card to Guardian section*:

> - Garage Door card with OPEN/CLOSE buttons, state display, position tracking
> - loadGarage() detects cover.\*garage\* entities from HA, renders live status
> - garageToggle() sends cover/open_cover and cover/close_cover via haFetch
> - loadGuardian() now shows/hides garageCard vs garageModulePlanned based on entity presence
> - Wired into section nav, post-login init, and 60s refresh interval
> - PLANNED module updated: ratgdo/ESPHome path (myQ cloud API is permanently blocked)

The CLAUDE.md commit (**`e20d3d5`**, 20:25:12) laid out the hardware verdict in full. Jeff's hub is a **Chamberlain myQ MYQ-G0402** (WiFi garage hub, serial 9546, manufactured March 2021), and:

> **This hub is now USELESS for HA** — Chamberlain permanently blocked all third-party API access in 2023. The native HA `myq` integration was removed in HA 2023.12. No HACS alternative works either.

The chosen path:

> **Correct path:** **ratgdo board** (~$35, ratcloud.llc or Amazon). Wires directly to the garage door opener motor unit (3 wires: GND, obstruction, control). Runs ESPHome firmware, talks locally over WiFi to HA. Sub-200ms response, no cloud dependency.

Compatibility notes: works with Security+ 2.0 (yellow learn button), Security+ (purple/red), and older openers (orange, via dry contacts) — "Jeff needs to check the learn button color on his ceiling-mounted opener motor." Expected entities after setup: `cover.ratgdo_*`, `light.ratgdo_*`, `lock.ratgdo_*`, `binary_sensor.ratgdo_*`. The app auto-detects any `cover.*garage*` entity "the moment ratgdo is adopted in Beehive," and "the myQ hub can stay plugged in for the Chamberlain phone app if Jeff still wants it — ratgdo and myQ coexist on the same opener."

### 2026-07-28 — Utility pipeline honesty day (and the water radio dies)

Eight commits, now timestamped in Central time (-0500) and co-authored by Claude Sonnet 5 rather than Opus 4.6 — **INFERRED:** a different Claude model/session took over this day.

**`07bd9a1`** (09:36:47 -0500) — *Fix utility entity mismatches; add electric usage-pattern model*:

> Water/gas Reading tiles now prefer the converted HA helpers (sensor.water_gallons, sensor.gas_ccf) over the old raw-meter auto-detect, which is kept only as a fallback. Electric "This Month" auto-finds the SmartHub entity by keyword since its id embeds the CEMC account number. Added a client-side 24-bucket hour-of-day usage model (EMA-updated from the monthly total's own deltas) to estimate Now/Today until a CT-clamp monitor exists — always shown with an explicit EST chip and ≈ prefix, never confused with a live reading.

**`c94e7aa`** (11:01:18) — *Document 07-28 utility fix, Energy Dashboard wiring, and MyQ dead-end* — its CLAUDE.md diff carries three important records. First, the backstory: "Recorder had been dead 07-02 to 07-28 (missing `default_config:`, root-caused and fixed by the coworker session)." Second, the SmartHub hourly statistic was wired into HA's own Energy Dashboard ("Settings → Energy → Electricity grid → 'CEMC Electric Grid'") — confirmed working — while an attempt at a `recorder.get_statistics`-backed real "Today" helper "returned empty results across multiple valid parameter combinations (matches a known HA GitHub issue) — abandoned in favor of the existing client-side model." Third, the myQ re-check, after Jeff found a supposed workaround:

> **Re-checked 07-28:** Jeff found a supposed HACS workaround (`ehendrix23/hass_myq`) — verified dead: the repo URL doesn't even resolve (404), and the underlying premise is confirmed permanently blocked by the HA codeowner's own public writeup (Cloudflare bot-detection + Firebase app-check added specifically to kill 3rd-party clients). No 2025/2026 reports of any software workaround holding up. **Don't revisit MyQ software integrations again absent a major news event reversing Chamberlain's policy.**

It also noted a 2026 wrinkle: openers shipping Chamberlain's "Security+ 3.0" firmware (~late 2025+) block ratgdo at the protocol level — "Doesn't affect Jeff — his opener/hub is a 2021 unit, well before that firmware."

**`1f4008f`** (13:19:34) — *Finish electric usage-pattern model (was documented but never committed in 07bd9a1)* — an archival integrity catch worth quoting in full, because it's exactly the failure mode this history file exists to prevent:

> Adds the EST chip, electricDayDelta(), and the 24-bucket hour-of-day EMA model (updateElecProfile/estimateElecSpan) for electric Now/Today estimates. This code existed only in the local working tree and was never actually part of 07bd9a1 despite that commit's message claiming it — so the feature was never live. Also corrects CLAUDE.md's stale "B-Hyve invalid_auth" pending item; the integration is confirmed already running correctly, don't re-touch coordinator.py over it.

**`6abb907`** (14:26:44) — *Fix water Est. Water/Sewer/Combined never populating once HA's water_month helper existed* — the fix for the "Est. costs never populating" bug:

> putWaterCycle() (which computes water/sewer cost, billing history, and the irrigation sewer-overcharge note) was gated behind "HA does NOT have sensor.water_month" — so once that helper went live, the branch was skipped and those fields stayed blank forever, even though This Cycle itself displayed fine via a separate fill() call. Now putWaterCycle() always runs off whichever cycle-gallons value is available (HA's real sensor first, client-side fallback second).

**`e71401a`** (14:39:02) — *Seed water flow and electric Now/Today from HA's own recorder history instead of blank slate*:

> Both were correctly designed to need a second live sample (or a learned hour-of-day profile) before showing anything, but that meant every fresh session/deploy showed blank indefinitely. Added waterFlowFromHistory() and elecBackfillProfile(), which pull whatever HA's recorder actually retained and compute/seed a real rate from it immediately, rather than fabricating a number. Discovered along the way: this HA instance's recorder history currently only goes back to ~12:15 UTC today (an apparent recent restart/reset), so backfill depth is limited to what's genuinely available — accuracy still improves as more real data accumulates from here.

**`1657df0`** (14:44:19) — *Update CLAUDE.md: electric SmartHub integration documented, stale utility pending item closed* — "Electric section still read as 'future DIY build' with no mention of the SmartHub monthly-usage integration that's actually live. Pending Item 8 (utility helper tiles) was marked outstanding despite being done. Added today's water/electric history-seeding fixes to the change log, per Goal 5 (this file must be updated every session)."

**`414c74f`** (14:49:31) — *Condense CLAUDE.md: 610 -> 374 lines, cut stale/resolved detail per Jeff's request* — a 522-line diff (143 insertions, 379 deletions):

> Protected sections (Jeff's Message, Working Relationship, Mandatory Rules, Debugging Protocol) untouched verbatim except one addition to the Debugging Protocol documenting CLAUDE.md-first research (mirrors today's standing-rule correction).
>
> Condensed: Change Log entries reduced to true one-liners (detail already lives in git log); removed already-resolved Pending Items (LUX setpoint, Irrigation Last Watered, B-Hyve, Blink, GPS calibration - all done, tracked elsewhere); cut the stale dated "Current State" table superseded by the Change Log; trimmed narrative from Engine Hours, Beehive/HA integration, and Family Login sections down to the facts still needed, keeping every ID/serial/rate/endpoint reference intact. Nothing load-bearing removed - only bloat.

The new Debugging Protocol rule it added, verbatim from the diff:

> **On the HCC project specifically, this file (`CLAUDE.md`) IS the first research step** — before web search, before live HA/browser investigation. It already contains validated rate formulas, meter serials, endpoint IDs, and a dated change log of exactly what was fixed and why. Grep/read the relevant section here first; only fall back to live exploration or web research for what this doc doesn't cover.

The day — and the window — closed with hardware bad news. **`281d65b`** (16:46:57) — *Document water pit-radio hardware failure diagnosis (07-28)*:

> Confirmed via the rtlamr2mqtt add-on's own listen_mode (unfiltered reception log): gas keeps receiving fine on the same dongle/antenna/distance, water's endpoint never appears at all. Rules out config - this is the external MIU itself not transmitting. Next step is Jeff calling WHUD (their equipment). Also noted the timing rules out the same-day recorder fix as a cause (water kept working 5+ hours after that fix before independently going silent).

The CLAUDE.md diff pins it down: the pit radio went silent at ~17:39 UTC on 07-28; the add-on (`6713e36e_rtlamr2mqtt`) was running fine with the correct ID (`79453337`) and protocol (`scm+`); in listen mode "gas showed up in <90s, water never appeared at all." The meter's separate built-in Kamstrup wM-Bus radio was considered as a fallback and rejected — "typically AES-128 encrypted (would need a key from WHUD) and Jeff never built a receiver for it — not a real fallback right now." And the exoneration of the same-day recorder work was deliberately recorded: "recorder reset ~12:15 UTC 07-28; water kept transmitting fine for 5+ more hours after that, only going silent at ~17:39 UTC — the timing doesn't line up, so this looks like an independent, coincidental hardware failure, not a side effect of the recorder work."

### Decisions made or rejected in this period

- **Research-first CAR commands, "per Jeff's directive"** (`778f6bd`, 07-22): abandoned entity-name guessing entirely; all Mercedes commands now use `mbapi2020.*` domain services with VIN `4JGFB4KB0MA478988`. Standing rule recorded in CLAUDE.md: "**never guess entity names or service calls — research the integration's actual source code and use domain-specific services with known parameters.**"
- **`preheat_start` rejected for the GLE 350** — it's EV-only; gas vehicles use `engine_start` (remote start, PIN required) and `auxheat_start` (exhaust-based auxiliary heater, no PIN) (`778f6bd`).
- **`temperature_configure` values must be strings** (`"16"`, not `16`) per mbapi2020's `services.yaml` (`71d0dc2`).
- **Honest success messages**: HA's 200 OK "only means 'accepted' not 'Mercedes executed it'" — the app says "Command sent" with a 30-second expectation, never claims execution (`71d0dc2`).
- **App-level PIN prompts REJECTED after being built** (`eeaa0b7` → `c73e32e`, 07-24): mbapi2020 handles the PIN server-side in integration options. Never-again rule in CLAUDE.md: "**mbapi2020 PIN is configured server-side in HA integration options — never prompt for or send it from the app.**"
- **Jeff enabled "Disable Capability Check"** in mbapi2020 options — the setting that was blocking every command except flash lights on his North American vehicle (`c64d0f8`).
- **All utility rates now bill-validated, replacing estimates**: water $10.32 base + $0.00908/gal (WHUD, printed on bill, math-checked against $39.90 / 3,258 gal); sewer $22.74 base + $0.00982/gal (City of White House, $24.17 / 2,461 gal); electric $39 base + $0.08657 energy + $0.02815 TVA fuel = $0.11472/kWh all-in (CEMC 06/30/26 bill); gas $13.44 base + $0.61809 dist + $0.61691 PGA = $1.235/therm × 1.068 heat factor × 5% franchise fee (three Piedmont bills verified to the penny: $34.58, $47.83, $27.08). The old irrigation-sewer estimate $0.01136/gal and the old $1.12/CCF gas estimate were both discarded (`7b3de68`, `8a9df3b`, `0d6c9de`).
- **Water and sewer displayed as separate cost lines** at Jeff's request, plus a red irrigation-overcharge note and a 24-cycle billing history with cumulative overcharge total — deliberately built as evidence for Jeff's case "for seasonal sewer averaging or an irrigation meter" against sewer fees charged on lawn water that never enters the sewer (`99fe1ba`, `8d32625`).
- **Jeff purchased a 2001 Ford F-250 Super Duty** (VIN `3FTNX21FX1MA23431`, 7.3L Power Stroke Diesel, 4WD, crew cab) — added to the app 07-24 with a vehicle switcher (`ee0d376`). No connected-car path for a 2001 truck; future live-data plan is OBD-II via Veepeak OBDCheck BLE+ (~$30) + ESP32 + optional NEO-6M GPS (~$12). Specs flagged as "assumed… from VIN + photo — Jeff should confirm."
- **myQ software integration permanently rejected — twice.** Chamberlain blocked all third-party API access in 2023; the HA `myq` integration was removed in HA 2023.12; Jeff's MYQ-G0402 hub is "now USELESS for HA" (`e20d3d5`, 07-26). Re-litigated 07-28 when Jeff found `ehendrix23/hass_myq` — verified dead (repo 404, block confirmed permanent), with the explicit rule: "**Don't revisit MyQ software integrations again absent a major news event reversing Chamberlain's policy**" (`c94e7aa`).
- **ratgdo board (~$35, ratcloud.llc or Amazon) chosen as the garage-door path**: 3-wire connection to the opener motor, ESPHome firmware, local WiFi to HA, sub-200ms, no cloud (`590303e`/`e20d3d5`). The myQ hub can stay plugged in alongside it.
- **`recorder.get_statistics` helper approach abandoned** for a real electric "Today" value — the service returned empty across multiple valid parameter combinations (matches a known HA GitHub issue); the client-side 24-bucket EMA model kept instead (`c94e7aa`).
- **Estimates must be visibly estimates**: electric Now/Today always carries an explicit EST chip and ≈ prefix, "never confused with a live reading" (`07bd9a1`/`1f4008f`); history-seeded values come from HA's real recorder data "rather than fabricating a number" (`e71401a`).
- **CLAUDE.md condensed 610 → 374 lines at Jeff's request** (`414c74f`), with protected sections untouched verbatim, and a new standing rule added: on this project **CLAUDE.md is the first research step**, before web search or live investigation.
- **Kamstrup wM-Bus radio rejected as a water-reading fallback** — AES-128 encrypted, no key, no receiver built (`281d65b`).

### Problems, failures & root causes in this period

- **Every CAR command button failed (07-22).** Symptom: lock, remote start, MAX COOL, MAX HEAT all dead. Wrong attempt #1: the buttons were built on "narrow keyword guesses that didn't match real mbapi2020 entity names" (`8d339ee`). Wrong attempt #2: switching to discovered-entity search (`carFindEnts`/`carSendCmd`) — better, but still the wrong API layer. Real root cause: mbapi2020 exposes domain services (`mbapi2020.engine_start` etc.) keyed by VIN; entity manipulation was never the designed control path. Fix: full research-first rewrite `778f6bd`, hardened by `778fe00` and `71d0dc2`.
- **Residual CAR window false-positive (07-22).** A second window check in the status banner still used pre-inversion `s.state === 'on'` logic for mbapi2020's inverted `*_closed` entities. Fixed in `52e492f` — the tail end of the 07-21 inversion bug.
- **Commands silently failing on a North American vehicle.** Root causes (from mbapi2020 source, `71d0dc2`): the integration's capability check blocks NA vehicles unless "Disable Capability Check" is enabled; pull mode (WebSocket disconnected) rejects ALL commands with 400; `temperature_configure` rejects numeric values. All three surfaced in diagnostics; Jeff flipping the capability-check option (recorded in `c64d0f8`) was "why all commands except flash lights failed."
- **The PIN-prompt mistake (07-24).** Symptom: PIN modal blocking commands. Root cause — in the record's own words: "**I added `carPromptPin()` wrappers… but mbapi2020 handles PIN from its integration options automatically — the app should never send a `pin` field**" (`c64d0f8`). Built in `eeaa0b7`, reverted 40 minutes later in `c73e32e`. A self-inflicted error, honestly documented.
- **Stale data across sensors, cameras, weather (07-24).** Symptom: those three sections froze at their startup values. Root cause: `mowerSync`, `loadCameras`, `loadWeather` ran once with no periodic refresh — the 60s self-heal interval covered other sections but missed them, and section-switching didn't reload HOME/WEATHER/YARD. Fix: `2c95ffc`. Lesson: new loaders go in BOTH the section switch AND the periodic interval.
- **A commit that claimed code it didn't contain (07-28).** `07bd9a1`'s message described the electric 24-bucket usage model, but the code "existed only in the local working tree and was never actually part of 07bd9a1… so the feature was never live." Caught and actually committed in `1f4008f`. Same commit also killed a stale CLAUDE.md pending item (B-Hyve invalid_auth) that could have caused a future session to "re-touch coordinator.py" over a non-problem.
- **Water Est. Water/Sewer/Combined blank forever (07-28).** Symptom: cost lines never populated even though This Cycle displayed fine. Root cause: `putWaterCycle()` was gated behind "HA does NOT have `sensor.water_month`" — the moment that helper went live, the entire cost/history/overcharge branch was permanently skipped. Fix: `6abb907` — always run off whichever cycle-gallons source is available.
- **Blank-slate metrics after every fresh session/deploy (07-28).** Water flow and electric Now/Today correctly required a second live sample before displaying, which meant indefinite blanks after each deploy. Fix: `e71401a` seeds real values from HA's recorder history. Discovered in passing: the recorder only retained data back to ~12:15 UTC that day (recent restart/reset) — context: the recorder had been dead 07-02 → 07-28 from a missing `default_config:`, root-caused and fixed by the coworker session (`c94e7aa`).
- **Water pit radio hardware failure (07-28, ~17:39 UTC).** Symptom: water meter readings stopped. Diagnosis method: rtlamr2mqtt's `listen_mode` (unfiltered reception log) — gas appeared in under 90 seconds on the same dongle/antenna/distance; water's ERT `79453337` never appeared at all. This ruled out config/software entirely: the external MIU (`100WD`) itself isn't transmitting. Deliberately checked and ruled out: the same-day recorder fix (water transmitted fine for 5+ hours afterward — "independent, coincidental hardware failure"). Resolution path: the MIU is WHUD's equipment — "Next step: Jeff calls WHUD (closed when found)" (`281d65b`).
- **CLAUDE.md drift (07-28).** The doc still called electric a "future DIY build" despite the SmartHub integration being live, and carried resolved items as pending. Fixed in `1657df0` and the `414c74f` condensation — both explicitly justified by Goal 5 ("this file must be updated every session").


---

## Chronicle: 2026-07-29 → 2026-08-05 — leak detection, pit-radio fault, sewer case verification

This window covers 77 commits on `origin/claude/time-master-project-liq1jw` (from `d74c8e1`, 2026-07-30 18:39 CDT, through `7f73148`, 2026-08-05 19:02 UTC), plus one boundary commit, `aa6566a` (2026-08-05 21:44 CDT — technically 02:44 UTC on 08-06, but Jeff's local 08-05 evening and the direct capstone of this period's sewer-case work, so chronicled here). It is one of the densest stretches of the whole project: two parallel Claude sessions (a "cloud" session working the PWA repo and a "coworker" session with live LAN access to the Beehive HA box) leapfrogged each other daily, merging each other's CLAUDE.md updates. The period contains the project's most instructive false alarm (the water pit-radio "stuck register" diagnosis, confirmed by a live experiment and then fully retracted the same day), the completion of the leak-detection and sewer-overcharge threads, the real root cause of Angela's unreliable phone tracker, the birth of the disaster-recovery backup system, and — on the last day — three wrong-in-a-row hardware recommendations that produced a permanent standing rule.

**The record is silent for 2026-07-29 and most of 2026-07-30.** No commits carry those dates until the evening of 07-30. **INFERRED:** those were simply days off from the repo, or work happened live on the Beehive without a commit; nothing in the git record says either way.

### 2026-07-30 — the sewer-overcharge thread opens

#### `d74c8e1` (2026-07-30 18:39 -0500) — "Add pending item: wire real B-Hyve runtime into sewer-overcharge estimate"

The only commit of the day, and the seed of a thread that runs to the very end of this window. Full body:

> Jeff wants an accurate irrigation-gallons figure to back a WHUD sewer refund request. Current irrMonthlyGal() uses a fixed weekly-schedule assumption instead of real B-Hyve on/off history, which was reconnected today after its config entry was lost during HA restart churn.

Context that the pending item itself (visible in the `13502b9` diff to CLAUDE.md) spells out: WHUD bills sewer on **all** metered water, but irrigation water never enters the sewer — so every gallon the B-Hyve sprays is a sewer charge Jeff shouldn't be paying. The existing `irrMonthlyGal()` multiplied hardcoded per-station run minutes by `IRR_DAYS_WK * 4.33`, "miss[ing] rain delays, skipped days, and manual overrides." The pending item also recorded a hard constraint: the B-Hyve zone switches (`switch.z2_front_left`, `switch.z3_back_left`, `switch.z4_back_right`, + 3 more, reconnected 07-30 after "its config entry was lost during HA restart churn") report real on/off state but have "**no flow-rate or duration attributes**, so GPM-per-zone must stay a configured constant."

### 2026-07-31 — stability-audit day: two sessions working in parallel

Friday 07-31 produced 21 commits across two interleaved sessions — the cloud session doing a deep app audit/cleanup, and the coworker session (session `014que35L2uauZbTmpQ59yML`, per its commit trailers) fixing live Home Assistant problems.

#### `d4dd400` (07-31 18:53 UTC) — "Update electric rate constant — CEMC TVA fuel surcharge changed (07/30/2026 bill)"

> ELEC_PER_KWH 0.11472 -> 0.11504 ($0.08657 energy + $0.02847 TVA fuel, up from $0.02815). Verified against Jeff's real CEMC bill, account 4501007001, 2,120 kWh billed. Also updated CLAUDE.md's own record of this rate.

A small commit but characteristic of the period's discipline: the rate constant was verified against the actual paper bill, not estimated.

#### `c0cd63d` (07-31 19:07 UTC) — "Fix 3 HA calls bypassing haFetch() proxy + unbounded webhook timeout"

The first product of a stability audit. Full substance:

> Audit found loadIrrigationFromHA(), haIrrToggle(), and blinkSendPin() all called Home Assistant directly via raw fetch(base+...) instead of routing through haFetch()->/api/ha, the same CORS/mixed-content/relay-timeout exposure documented as the root cause of the "Beehive Offline" bug class. They also carried much shorter timeouts (5-8s) than the rest of the app's haFetch() call sites (20-25s), making them more likely to fail against Nabu Casa relay latency. All three now go through haFetch() with a timeout in line with the rest of the app.
>
> Also bounded the server-side HA webhook forward in functions/api/hours.js with an 8s AbortSignal.timeout — previously unbounded, so a hung HA webhook could delay the /api/hours response to the ESP32 sensor indefinitely.

#### `8501360` (07-31 19:18 UTC) — "Fix broken external links, form validation gaps, and remove dead PIN code"

The biggest audit commit of the day. Key findings, from the body:

- **External links (real bug, high impact):** "every 'open in browser' button across YARD (parts vendor links, service videos, diagnostics videos, upgrade shop links, manuals), WEATHER (station dashboard), and a few others used window.open(), which CLAUDE.md already documents as a no-op in an installed iOS PWA -- how Jeff actually uses this app." All ~20 call sites became real `<a target="_blank" rel="noopener">` elements (or a new `openExternal()` helper), with the missing `.vbtn`/`.upg-btn`/`.filter-row` CSS added so they render as styled buttons.
- **Form/state robustness:** wrapped "the one unguarded JSON.parse in the whole file" — top-level `S = JSON.parse(localStorage...)` — in try/catch, "matching the exact failure class that caused the 2026-06-23 blank-page incident." `saveSvc()` gained hour-meter validation ("was silently substituting current hours on bad/zero input with no warning, corrupting the service-countdown math"); `importData()` now checks backup `.hours` is actually numeric; all `save()` callers now keep the modal open on failure "instead of closing it and pretending the entry was logged"; credential-save handlers got a `safeSetItem()` wrapper so full-storage failures show an error instead of failing silently.
- **Dead code:** deleted "the dormant Mercedes PIN localStorage subsystem … confirmed unreachable from any button, and it directly contradicted the documented 07-24 invariant that PIN handling is server-side only and the app must never send/store a pin field. Left as dormant code it was a trap for a future accidental re-wire."

Verified via JS syntax check, a headless zero-error load, and Playwright exercising every nav section, YARD/CAR tab, and modal. `3f2808f` (19:18 UTC), "Log 07-31 stability audit in Change Log," recorded it.

#### `b4f11df` (07-31 14:51 -0500, coworker) — "Document 07-31 coworker fixes: automation-save root cause, RTL-SDR reboot, freeze warning removed"

Three important live-HA facts landed here, verbatim:

> Root-caused and fixed the long-standing "new automations don't save" bug: configuration.yaml was missing automation: !include automations.yaml, so UI-created automations wrote to disk but were never part of the loaded config tree. Fixed, restarted HA, 3 real automations came alive + 2 duplicate Recorder Watchdog copies deleted before they could triple-fire. Also corrected the record on the water/gas outage: not the 07-28 pit-radio theory, proximate cause was rtlamr2mqtt losing the RTL-SDR USB device, fixed by a full Beehive host reboot. Freeze Warning automation removed entirely per Jeff's request.

Note the second sentence: the 07-28 "pit radio went silent" incident got a competing explanation (RTL-SDR USB loss, fixed by host reboot) — which set up the confusion the cloud session flagged later this same day in `0b72961`.

#### `abcc8f4` (07-31 19:59 UTC) — "Aesthetic pass on HOME/GUARDIAN + guardrail lint script"

Done "per Jeff's requests this session": a new HOME hero photo ("evening landscape-lighting shot he provided"); utility meter card stats moved onto the photos with a dark scrim, the confusing util-accent divider removed, and "tap photo to call" split into an explicit CALL badge "instead of making the whole image + new overlay numbers one giant tel: link"; cameras now auto-request a fresh Blink snapshot when HOME opens (throttled to once per 3 minutes "so battery-powered cameras aren't hit on every tab switch"); and the "Hart of the Hive" photo removed from HOME entirely, its overlaid icon buttons becoming a plain Quick Actions grid in GUARDIAN — "no more absolute-position-on-an-image layout." It also clarified the CAR > Settings "Mercedes PIN" card copy ("it was easy to misread as the app wanting the PIN entered somewhere; now explicit that it's Beehive-only") and — importantly for everything after — added `scripts/lint-app.js`, "a guardrail check for the exact anti-patterns fixed in the 07-31 stability audit (window.open(), raw fetch(base...), literal `<script>` tags inside the JS block, an unguarded top-level JSON.parse). Run before every push from here on." The lint script was verified to "actually catch an injected violation." `1d9d4c6` (19:59 UTC) merged the coworker's CLAUDE.md update.

#### `7232027` (07-31 20:11 UTC) — "Style the remaining unstyled classes, remove more dead code"

Continuation "of the 07-31 cleanup pass (Jeff asked what else could be made more robust/crisp-looking)." Newly styled elements that had been rendering plain: the YARD status pills (OVERDUE/OK/DUE SOON "were plain text with no chip styling at all"), PARTS card headers, the Diagnostics tab flex layout ("icon/text/video button were stacking instead of sitting in a row"), health bars, History log cards, the LOG SERVICE dropdown ("a stark OS-default select inside an otherwise fully-styled dark modal"), and alert row text. Dead code removed with zero-reference verification per item: "Entire legacy NEXRAD radar module (Leaflet + RainViewer, ~90 lines) -- superseded by the current Windy iframe radar, never called," `drawWxStars()`, dead theme-toggle id lookups, `.theme-btn` CSS, and CLIMATE-section remnants ("CLIMATE was folded into GUARDIAN a while back per CLAUDE.md but these remnants were never cleaned up").

#### `7255f6f` (07-31 20:12 UTC) — "Add scripts/smoke-test.js — reusable Playwright regression check"

> Turns the ad-hoc Playwright script I've been hand-writing fresh every time into a real, run-anytime check: every nav section, every YARD/CAR tab, every Guardian quick-action chip, every modal, plus a check that every generated external link … is a real `<a href="http...">` and not a window.open() no-op -- the exact bug class found in the 07-31 audit.

From here on, nearly every code commit in the record ends with "lint-app.js clean, smoke-test.js all passing."

#### `7d55912` (07-31 20:17 UTC) — "Shrink utility card stat overlay to fit content, not full-width grid"

Direct Jeff feedback: "Jeff: the stat tiles overlaid on the meter photos were covering more of the photo than needed since they stretched to fill equal-width grid columns." Fixed with content-sized flex chips "so each tile is only as big as its number, and more of the actual photo shows through."

#### `fd15642` (07-31 15:23 -0500, coworker) — "Document Fire TV/Blink camera-popup fix: root cause + Blink Auto-Heal automation"

> Root-caused Jeff's "camera popups missing or 10-15 min late" complaint to the known upstream blinkpy LoginError crash (home-assistant/core#176836, fronzbot/blinkpy#1217, no fix in either yet) leaving motion sensors stuck at stale values instead of going unavailable, so the existing watchdog couldn't catch it. Deployed HCC — Blink Auto-Heal: reloads just the Blink integration within seconds of the crash via system_log_event + reload_config_entry, tested end-to-end live. PiPup (picture-in-picture) noted as a real follow-up pending an app install on the physical Fire TV.

#### `2e25c71` (07-31 20:56 UTC) — "Fix one leftover hardcoded serif font (dead CSS, found during font audit"

Jeff asked for a font-consistency check. Result: the app was already unified; "Found exactly one real violation: .yard-hero-title hardcoded Georgia/Times New Roman -- but it's dead CSS, never applied to any element … Fixed the token reference anyway since it's a landmine if ever wired up." The splash screen's Cinzel serif branding and three monospace command boxes were confirmed intentional and left alone. `557d16a` (20:57 UTC) merged the coworker's Fire TV/Blink Auto-Heal CLAUDE.md update.

#### `0b72961` (07-31 21:59 UTC) — "Audit note: clarify WHUD pit-radio status is unconfirmed vs the 07-31 RTL-SDR fix"

The cloud session noticed that the 07-28 pit-radio hardware theory and the coworker's same-week RTL-SDR-USB explanation were both in CLAUDE.md without reconciliation, and added an audit note (visible in the `13502b9` diff): "**Status of 'Jeff calls WHUD' is unconfirmed as of 07-31** — unclear if that call ever happened or if the meter started transmitting again on its own. Whoever picks this up next: confirm current status with Jeff before assuming either resolved or still open."

#### `a001f2e` (07-31 17:05 -0500, coworker) — "Document PiPup picture-in-picture integration + Blink watchdog hardening"

> Full Fire TV camera-popup fix landed: PiPup installed and wired to real CodeProject.AI detection events, pushing the actual annotated frame that triggered the alert (not a later snapshot) as a small popup instead of a full-screen takeover. Verified live end-to-end with Jeff confirming the popup and image. Old full-screen automation disabled at runtime only — flagged as a real pending item since its entity_registry entry is desynced and won't survive a restart.
>
> Also hardened the Blink auto-heal: discovered system_log_event only fires once per unique message, so a repeating crash-loop could slip past the error-triggered watchdog. Added an unconditional 15-minute periodic reload as a backstop with no error-detection dependency at all.
>
> New pending item: Angela's Almost Home hasn't fired since 07-16, Jeff wants to explore the Mercedes GLE's GPS as a backup presence signal.

That last paragraph opens the Angela-tracking thread that dominates 08-01.

#### `13502b9` (07-31 22:08 UTC) — "Close out water pit-radio item per Jeff's decision, fix Pending Items numbering"

Jeff's explicit decision, in the commit body:

> Jeff: water's transmitting fine now and he explicitly does not want to call WHUD about it -- doesn't want to raise a flag with the utility district over something that's already resolved. Marked CLOSED, removed my own "unconfirmed, needs follow-up" audit note from earlier since it's now actually confirmed and settled. Also fixed a duplicate "9." in Pending Items left over from coworker's last commit.

The CLAUDE.md entry written by this commit (diff of `13502b9`) is worth preserving in full, because it becomes ironic within 24 hours:

> **Pit radio went silent 07-28 (~17:39 UTC), self-recovered — CLOSED, do not re-raise.** Was confirmed hardware-side at the time (MIU not transmitting, add-on/config ruled out via `listen_mode`). **Jeff's explicit call (07-31): water is transmitting fine now, and he does NOT want to call WHUD about it** — reporting it would draw utility-district attention/scrutiny he doesn't want, and since it resolved on its own (likely the same RTL-SDR USB reconnect from the 07-31 host reboot, or independent recovery on the MIU side — unconfirmed which), there's nothing actionable left. Leave this alone unless water goes silent again; if it does, that's a fresh incident, not a continuation of this one.

#### `f775732` (07-31 22:12 UTC) — "Vacuum card: reframe unrecognized states as transient, not alarming"

> Jeff's report: the vacuum card showed "Unresponsive" like a hard failure when the robot was actually fine. Checked the code -- not an app bug, loadVacuum() just capitalizes and displays whatever raw state HA's integration reports … "Unresponsive" … fell through to that bare-word default, reading as scarier than it usually is -- same class of transient cloud-API hiccup as today's Blink LoginError issue.

Fix: unrecognized states now get "an amber 'may be transient, refresh to check' framing," tested by mocking `/api/ha` to return `state:"unresponsive"`.

#### `4b409b9` (07-31 22:20 UTC) — "Sewer-overcharge estimate: use real B-Hyve zone runtime, not fixed schedule"

Closure of `d74c8e1`'s pending item, and the technical heart of the WHUD sewer-refund case. Full mechanism from the body:

> Added irrGalFromHistory(): finds every switch.* entity with a `station` attribute matching a configured IRR_FLOW GPM constant (the real B-Hyve zone switches), pulls each one's actual on/off history for the current billing cycle from HA's recorder via haFetch() (same pattern already used for water flow/cycle and electric profile backfill), sums real on-duration, multiplies by that zone's GPM. Runs async off putWaterCycle() -- the existing schedule-based irrMonthlyGal() estimate still renders immediately so the note is never blank, then gets overwritten with the real number the moment history resolves, clearly labeled either way ("rough estimate from your weekly schedule" vs "from real B-Hyve run time this cycle") so Jeff always knows which one he's looking at.
>
> Tested by mocking HA history to return a real 20-minute watering event on one zone (17.2 GPM) and confirming the note shows the exact expected 344 gal and switches to the "real" label; also confirmed the schedule estimate still renders correctly as a fallback when no B-Hyve zone entities are present at all.

`a6a3f92` (22:22 UTC) logged the later-session work and closed the irrigation pending item.

#### `a00842c` (07-31 22:24 UTC) — "Add Zigbee buy-now checklist, verified against the existing safety plan"

> Jeff's actively shopping on eBay for the coordinator dongle + door sensors right now. Checked every product already chosen in safety_shopping_list.md against fresh 2026 research rather than proposing a new/competing list -- confirmed the existing picks (ZBDongle-P, HEIMAN HS2WD-E, SNZB-05P, Aqara Valve Controller T1) are all still real, available, and HA-compatible, added one honest caveat (HS2WD-E works better under Zigbee2MQTT than plain ZHA, though ZHA still works for the panic automation's siren.turn_on call), and pulled out a tight "buy these two things today" section (dongle + USB extension + SNZB-04P door sensors, respecting the existing "3-4 key doors, not every window" rule) with exact eBay/Amazon search terms and sources.

The day closed with `98b47bf` (22:31 UTC), "Log electric/water-flow data-accuracy checks — both confirmed working as designed."

### 2026-08-01 — the busiest day of the window

Saturday 08-01 produced 20 commits across three sessions (the coworker LAN session, the cloud session `01VV4yeF7bkKhN4KU3BwWEND`, and local/remote merges), including the pit-radio false alarm, its retraction, and the closure of four long-running threads.

#### Morning, coworker session: `62e99b5` (12:10 -0500) — "24h health check + real fix for the old Fire TV automation + Mercedes GPS validated"

> Confirmed the Blink periodic backstop caught 73 real crashes overnight with zero user impact, proving that design decision was right. Replaced the runtime-only automation.turn_off with the actual documented initial_state: false YAML key (checked HA's real docs first — an initial enabled: false guess would have silently done nothing), verified it survives a real restart this time. Live-validated Jeff's Mercedes GPS backup-tracking idea in real time as Angela drove off: device_tracker.gle_350_device_tracker flips home->not_home within ~90 seconds, no manual refresh needed.

73 real Blink crashes in one night — the 15-minute unconditional reload from `a001f2e` was carrying the whole camera system.

#### `66b3f49` (12:45 -0500) — "Build Angela's barn-arrival tracking using her real drive as live validation"

> Added the Mercedes GPS as a genuinely independent third trigger on Angela Almost Home -- the existing two both secretly depended on her unreliable phone tracker, which is why the prior "backup" never actually helped. Created zone.barn from real coordinates captured the moment the car actually stopped (confirmed via a long stretch of zero movement after continuous updates the whole drive). Built a separate arrival-notification automation per Jeff's requirement, since barn and work (Nashville) are both regular destinations. End-to-end notification delivery confirmed live.

#### `762e714` (12:57 -0500) — "Fix Vizio soundbar setup_retry via power-cycle, researched not guessed"

> Vizio SmartCast integration was stuck failing to connect despite the device being network-reachable. Researched the known unresolved TLS-cert class of Vizio issue first, ruled out an HA-side config problem, confirmed via a failed reload_config_entry that it needed a device-side fix rather than an HA-side one. Jeff power-cycled the soundbar, integration recovered immediately.

(Follow-up in the `2765386` change-log entry: the Vizio integration turned out to have "zero actual usage anywhere in the app or HA config … left alone per Jeff, he'll power-cycle manually if it recurs.")

#### Cloud session, performance pass: `2102e3a`, `38a5f17`, `1596fc2`

`2102e3a` (18:25 UTC), "Lighthouse basics: recompress images, trim fonts, lazy-load, dead assets" — scoped as "basic wins without restructuring the app, per Jeff's scope." Images went 12MB → 7.1MB (~41% smaller): every JPEG recompressed to quality 80 (visually spot-checked; hero-guardian.jpg deliberately skipped because "re-encoding made it very slightly bigger"), six fully-dead image files deleted after individual zero-reference confirmation, and the service worker's precache list fixed (it "still referenced the two now-deleted files … and was missing the new hero-home-dusk.jpg entirely" — cache bumped hcc-v11 → v12). Google Fonts trimmed from 12 font files to 8 by grepping actual font-weight usage. `loading="lazy"` added to everything not visible on first paint. Explicitly out of scope "per Jeff's ask": full JS/CSS minification and splitting the inline `<script>`.

`38a5f17` (18:31 UTC), "Fix CLS regression from lazy-loading: reserve image space via aspect-ratio" — a self-caught mistake, and an honest one:

> Self-caught via a controlled before/after Lighthouse A/B (same environment, same server, only the code differs) -- the lazy-loading commit measurably regressed Cumulative Layout Shift (0.023 -> 0.436) because 4 of the newly lazy-loaded images … sit in containers with no reserved aspect-ratio, so the page jumped when each image finally loaded in. … Re-ran the same controlled A/B after the fix: CLS 0.023 -> 0.015 (net improvement, no regression), score steady at 56, byte weight still down ~56% and LCP still ~46% faster than the pre-optimization baseline.

`1596fc2` (18:32 UTC) logged it, closing "Pending Item 5 with honest results."

#### `2765386` (13:38 -0500, coworker) — "Build Angela's work-arrival tracking, mirroring the barn pattern"

Added `zone.work` (geocoded from Angela's office at 150 4th Avenue North Suite 1700, Nashville → 36.1629809, -86.7783796, per the CLAUDE.md entry) plus the independent `HCC — Angela Arrived at Work` automation on the Mercedes tracker — "kept separate from the barn automation per Jeff's explicit instruction, since she doesn't always go to the barn, sometimes it's work." The CLAUDE.md entry also records a hard-won technique: the `configuration.yaml` edit was made "via the code-server integrated terminal (`python3`, exact-string match + `assert count==1` before writing) instead of typing into the Monaco editor directly, specifically to avoid the recurring auto-indent/search-text-leak glitches that have corrupted edits to this file before." The same session documented the Alexa duplicate-device diagnosis (Tuya devices exposed twice — Smart Life's native skill plus HA/Nabu Casa Alexa Cloud; fix plan ready but "Jeff's call": drop `should_expose` for four `switch.*` entities on the HA side only).

`0c4f3ab` (18:40 UTC) added node_modules/package files to .gitignore for a11y tooling; `efd1be5` and `4c69aee` (13:41 -0500) were merge commits knitting the remote Lighthouse work and .gitignore change into the local Angela work.

#### Contrast work: `bdc6f93`, `b81474a`, `bc3df2b`, `0dc54d2`, `fdc358e`

`bdc6f93` (18:56 UTC), "Fix light-mode text-contrast issues found by axe-core/Lighthouse" — "Jeff approved a safe first pass: swap hardcoded dark-mode-tuned colors for the theme-aware tokens the app already has … no new color design, no layout/functionality changes, dark mode untouched." Notable numbers: gold CTA headings 1.65:1 → 3.37:1; "Beehive Offline" red 2.55:1 → 4.49:1; inactive nav labels #9a9aa0 → #6b6b70 (2.79:1 → clears 4.5:1). It also owns up to a bug in its own first attempt: "I'd added a html.light override for their background/color, but the inputs had those same properties set inline, and inline styles always beat an external stylesheet rule regardless of selector specificity, so the override was silently a no-op." (The CLAUDE.md entry adds a second self-caught gap: "the gold fix only landed in a throwaway test copy, not the real file.") axe-core: 27 → 20 unique violations. `b81474a` (18:57 UTC) logged it.

`bc3df2b` (14:02 -0500) noted a gap Jeff flagged: "**zone.work radius gap: Angela parks ~0.4mi from the office address** … deliberately deferred until we have the garage's real location." (Per the CLAUDE.md item: "Jeff said leave it for now, dial in later.") `0dc54d2` merged it with the contrast work.

`fdc358e` (19:15 UTC), "Darken --gold/--muted/--bad light-mode tokens to clear remaining WCAG contrast fails" — the CLAUDE.md entry opens with Jeff's words: "Jeff said 'go ahead and fix the remaining contrast items.'" New values computed "with a small Node script checking real WCAG contrast ratios against every light-mode surface color used in the app, targeting a solid margin (landed 4.3-6.7:1) instead of skimming the 4.5:1 line": `--gold` #9a7b1e → #7e6017, `--a-home`/`--c-health` matched, `--muted` alpha .66 → .74, `--bad` #d61f1f → #c21b1b, plus one literal #9a7b1e on `.wu-badge-stars` moved to `var(--gold)` "so it can't drift again." Verified: axe-core 20 → **0** violations, Lighthouse Accessibility 96 → **100/100**, smoke-test's 374 external links passing.

#### The pit-radio false alarm: `593ddf7` → `fb5068c`

**`593ddf7` (08-01 14:52 -0500, coworker) — "Confirm water pit-radio fault via live irrigation+shower test."** The commit body:

> Radio heartbeat is normal but the register is stuck rebroadcasting a stale reading -- proven against the raw rtlamr2mqtt decoder log, with the gas meter on the same dongle ticking normally in the same window. Recurrence of the 07-28 fault with a different symptom. Jeff needs to call WHUD again. Blocks the leak-detection pending item until fixed.

The CLAUDE.md entry it wrote (diff of `593ddf7`) shows how convincing the evidence was. While explaining the leak-detection ideas, the session needed the pit radio's real report cadence, so it ran a controlled experiment: "triggered a B-Hyve irrigation zone via HA + Jeff took a real shower, both running simultaneously for ~47 min." Reading the raw `rtlamr2mqtt` decoder log (`ha addons logs 6713e36e_rtlamr2mqtt`): the water meter (endpoint `79453337`) "was freshly decoded on every capture the whole time (heartbeat/`sensor.water_meter_last_seen` updated normally every ~1.5-5 min) but reported the exact same value, `179097`, on every single read — zero movement despite substantial confirmed usage. In the identical window the gas meter (`33393066`, same dongle/antenna/pipeline) ticked normally (`885060→885062`), ruling out the dongle/software/HA entirely. Jeff confirmed irrigation and the house shower share one municipal supply, ruling out 'wrong source.'" Conclusion as written: "**the pit radio's register is stuck — it's still transmitting a heartbeat, but endlessly re-broadcasting a stale reading.**" The entry told Jeff to call WHUD again with account `00710690-02` / meter S/N `25394131` / endpoint `79453337`, "specifically flagging that the radio is transmitting normally but the register value isn't advancing … (a more precise report than the last 'went silent' call)" — a painful instruction given Jeff had explicitly closed the WHUD question the night before in `13502b9` precisely because he "does NOT want to call WHUD." Both leak-detection ideas were declared blocked. Pending Item 11, written in this same commit, first spelled out the two leak-detection approaches: "(a) simple idle-flow logic automation (alert if flow is running while the house is idle/asleep and nothing known is using water) — fast, catches sudden bursts; (b) the free HACS `Water-Monitor` integration (github.com/markaggar/Water-Monitor) — its low-flow 'dribble' and toilet-refill-pattern detectors."

**`fb5068c` (08-01 18:20 -0500) — "Retract water-meter fault diagnosis -- meter is healthy, no WHUD call needed."** Three and a half hours later, the whole diagnosis was withdrawn. Commit body:

> Root cause was rtlamr2mqtt's -unique=true flag only republishing on value change, combined with the meter's own batched (not continuous) broadcast update cadence. Confirmed via an IDM-protocol probe (ruled out a missed message type) and a longer observation window that caught the real value moving twice. All add-on config changes made during testing were reverted to the original scm+/scm setup.

The retraction entry in CLAUDE.md is one of the best root-cause writeups in the project, and it deliberately preserved the wrong diagnosis beneath it "for the record rather than deleted." The evidence trail:

1. "Jeff produced WHUD's own 'Water Meter Data Access Request' form, whose printed PROTOCOL field lists `Itron ERT (SCM/SCM+/IDM)` for this exact meter, with IDM underlined by the WHUD rep on a call — worth testing directly rather than trusting general web knowledge about IDM being electric-meter-only."
2. Swapped the water meter's rtlamr2mqtt entry from `scm+` to `idm` and watched ~2 hours: "zero IDM packets ever decoded for this meter ID — this specific installed radio only ever transmits `scm+`, so that channel is the complete picture, not a partial one."
3. Reverted to `scm+` and immediately caught fresh readings: "`179097` (stuck value) → `179371` (appeared ~20 min after the original test ended, i.e. the real usage from that test, delayed) → `179473` (appeared ~3 hours later, normal background usage)."

Real root cause, verbatim: "**`rtlamr2mqtt` runs `rtlamr` with `-unique=true`, which only re-publishes a reading when the decoded value itself changes — the meter's own transmitter evidently updates its broadcast register in batches (gaps varied from ~20 min to ~3 hours, so likely threshold/delta-based, not a fixed clock), not continuously with live flow.**" And the misread signal, owned in the first person: "The `sensor.water_meter_last_seen` heartbeat pinging normally the whole time was a real signal I misread — it confirms every RF catch, not that the *value* had refreshed, and I conflated the two. **No WHUD call needed — the meter and pit radio are both healthy.**" The retraction also rewrote the leak-detection item with the crucial calibration fact: this meter's update cadence is batched (~20 min to ~3 hr between value changes), so Water-Monitor's default timers "assume a much more continuous flow-rate feed" and "will likely be significantly slower to trip than out-of-the-box defaults suggest," while the idle-flow approach "only needs 'is flow currently nonzero.'"

#### `3537b00` (19:07 -0500) — "Fix zone.work to the real parking garage address, not the office"

> Geocoded 310 Commerce St (Jeff-provided) and applied via zone.reload. Also note Angela's phone-side location settings as the real fix for her tracker reliability (not a Beehive-side issue).

The CLAUDE.md entry adds an honest unresolved discrepancy: the garage address geocoded "only ~90m from the original office coordinates, not the ~0.4mi Jeff estimated earlier — flagged to him, not fully reconciled, but he gave the address directly so it took priority over the earlier estimate."

#### `2770fee` (19:49 -0500) — "Close out leak-detection, Angela's tracker, and zone.work threads"

The close-out commit for the day's three threads. Body:

> - Water-Monitor HACS integration installed and connected
> - HCC -- Possible Water Leak (Idle Flow) automation built and live
> - Angela's phone tracker root-caused to an empty Push ID (not location permissions) and fixed, confirmed via a real organic background GPS update
> - zone.work corrected to the actual parking garage address

Details from its CLAUDE.md entry, all of which matter for future maintenance:

- **Water-Monitor:** installed from HACS's default store, "pointed at `sensor.water_flow`/`sensor.water_gallons`, confirmed `Upstream sensors health: Connected`; did not fine-tune its low-flow/tank-refill thresholds (options dialog wasn't scrolling reliably this session), left on defaults with the batched-cadence caveat noted for whoever tunes it later."
- **Idle-flow automation:** `HCC — Possible Water Leak (Idle Flow)` (`automation.hcc_possible_water_leak_idle_flow` — "note HA slugified the entity ID from the alias text, not the `id` field set in the API call") "triggers on `sensor.water_flow` >0.05 gal/min for 30+ min while both Jeff and Angela are `not_home` OR it's 1-5am, and no B-Hyve irrigation zone is on; notifies Jeff."
- **Angela's tracker root cause:** the Companion App had reported real GPS same-day but had gone stale even "after Jeff fixed the standard iOS location permissions (Always/Precise/Background Refresh) and manually opened the app — none of that produced a fresh update, including HA's own `command_request_location_update` push (… confirmed via official Companion App docs this is a known 'hit-or-miss' feature, so its failure wasn't diagnostic on its own). Real fix, found via the app's in-app Settings → Notifications (menu relabeled in a newer app version — no longer nested under 'Companion App' like the docs describe): her **Push ID was empty/stale**, meaning her phone had never registered a valid push-delivery channel with HA, so nothing — including background significant-location-change wake-ups — could reach the app. Jeff reset it; confirmed fixed with real evidence, not assumed: a genuinely fresh organic background update landed (not from a manual poke), with real GPS movement (accuracy 3.6m→10.4m) and real battery drain (90%→75%) between checks." Consequence: "`person.angela_loewen` is now a reliable primary signal again — the Mercedes GPS backup trigger added 08-01 earlier is no longer load-bearing, just a true backup as originally intended." Note this overrode the earlier same-day theory in `3537b00` that phone-side location settings were the fix — the permissions "got fixed too along the way" but were not the cause.

#### `f1d24f3` (21:16 -0500) — "Investigate PiP delay, confirm Blink notify + rain-skip already covered, build Morning Digest"

Five distinct results in one evening session (bodies and CLAUDE.md entry):

1. **PiP delay — documented findings, not a fix:** traced two real `codeproject_ai.object_detected` events via HA's automation trace API; "the whole chain (motion sensor → AI scan → detect event → Fire TV popup) completes in under 1 second on the HA side, both times." Jeff's reported 3-4 min real-world lag is therefore "upstream of HA entirely (Blink's own cloud clip processing, or possibly Fire TV/PiPup rendering), not something more polling can fix. **Not resolved** — needs a real timestamped incident to trace further; asked Jeff to flag next occurrence." The pending item also captured a design discussion: showing the actual Blink video clip in the popup is possible via PiPup's `{"video": {"uri", "width"}}` payload "but would very likely make the delay *worse* … leaning toward keeping the popup fast/image-only and separately auto-saving clips locally (via … `blink.save_recent_clips`) for after-the-fact review instead" — Jeff wanted to think about it.
2. **Blink notification filtering — nothing to build:** the existing `AI Object Detected Notify` in `packages/hcc.yaml` "already does exactly what a 'Blink motion filtering' build would have added — branches on `obj_type` (person/vehicle/animal) … with a 15-min per-camera mute button," confirmed live across all 6 cameras.
3. **Rain-skip — rejected as redundant:** "Jeff's B-Hyve already does real weather-adaptive watering (rain-skip, temp/wind adjustment) and genuinely supports a personal weather station via PWSWeather.com/Aeris — independent testing cited 100% skip reliability on 0.2\"+ rain days. Building a duplicate HA automation would've been strictly worse (no wind/temp adjustment)."
4. **Morning Digest built:** `HCC — Morning Digest`, daily 7am push + persistent notification (weather, vacuum, car lock/fuel/odometer, water/gas reporting health, Blink self-heal count) — "automates the manual 'check everything' health-check Jeff kept asking for by hand." A real bug was caught before shipping: "the digest's 'active alerts' count always silently returned 0 — … persistent notifications removed from the template-readable state machine since HA 2023.6 … removed that metric entirely rather than ship a false 'all clear.'"
5. **Kodi buffering — corrected a wrong earlier fix:** Jeff's prior `advancedsettings.xml` edit "was a no-op — … Kodi 21+ 'Omega' (Jeff's on 21.3) moved cache settings out of that file into the GUI, which fully overrides the XML." The real live values in `guisettings.xml` were still at defaults (20MB/4.0x), "confirming the XML edit never took effect"; edited directly to 768MB/5.0x while Kodi wasn't running, verified by re-reading the file.

#### `39c1194` (22:25 -0500) — "Add live HA config snapshot (beehive-config/) as disaster-recovery backup"

1,011 lines of real HA config committed into the repo: `beehive-config/automations.yaml` (263 lines), `configuration.yaml` (111), `hcc.yaml` (637), plus empty `scenes.yaml`/`scripts.yaml` (stat of `39c1194`). This snapshot pays off two days later when the cloud session uses `hcc.yaml` to pin down the Alexa fast-forward mechanism.

### 2026-08-02 — the disaster-recovery backup system

Three commits, all coworker-session documentation of a system built live. `552c699` (11:19 -0500), "Document master backup/disaster-recovery system in CLAUDE.md," records that this was built because Jeff asked for it in exactly the terms this history file exists to honor — the change-log entry opens: "**Built the master disaster-recovery backup system Jeff asked for ('save everything... it would be catastrophic to lose anything').**" Two independent layers, "both verified live, not just configured":

1. **Git layer:** first confirmed the repo "is genuinely **public** (checked before doing anything, not assumed) — that check caught a real live Weather.com API key hardcoded in `packages/hcc.yaml`'s `rest:` block, fixed by moving it to `secrets.yaml` as `weather_pws_resource_url` … (verified no regression …)." The `beehive-config/` snapshot was sanitized, pulled "via a temporary `www/tmp_backup/` staging folder + direct PC→Beehive `curl`, then deleted the staging copies," and "committed and pushed after explicit go-ahead. This is a one-time snapshot, not auto-syncing."
2. **Full-system layer:** discovered HA's native scheduled Backups were "**already fully configured and running** (daily, keeps 3, includes everything … real size ~90-100MB) — nothing needed there, corrected my own assumption that this needed setup from scratch. The actual gap was that backups were local-only (die with the J45 if it fails)." The missing piece built: a dedicated Long-Lived Access Token ("iCloud Backup Sync", separate from the app's token — "least-privilege, so revoking one never breaks the other") plus `C:\Users\jeffl\HCC-Scripts\Sync-HABackup.ps1`, which authenticates over HA's WebSocket API (`backup/info` — "the backup list isn't exposed via REST in this HA version … confirmed via direct probing, not assumed"), downloads the latest backup via `GET /api/backup/download/{id}?agent_id=hassio.local`, "verifies the downloaded byte count against the reported size before keeping it, and prunes to the last 14 copies." Wired to a daily Windows Scheduled Task ("HCC Beehive Backup Sync", 6:30 AM, `StartWhenAvailable`), "**verified end-to-end twice**, including one run triggered by Task Scheduler itself," landing exact-byte-match `.tar` files in `C:\Users\jeffl\iCloudDrive\HCC-Beehive-Backups\`. Token stored outside the repo in `C:\Users\jeffl\HCC-secrets\ha_backup_token.txt`. One real bug caught: "PowerShell's `Set-Content -Encoding utf8` silently prepends a UTF-8 BOM, which corrupted the token and caused silent 401s until rewritten via `[System.IO.File]::WriteAllText` with a no-BOM encoding."

`5fc17ed` (11:29 -0500) committed `windows-scripts/Sync-HABackup.ps1` into the repo itself "so the backup automation survives if this PC dies." `03e688b` (11:29 -0500) flagged the remaining exposure: "**HA backup encryption key as needing a durable off-PC copy**" — the backups are only restorable with that key.

### 2026-08-03 — Fire TV/Alexa, camera bugs, and the LUX card odyssey

Sunday 08-03: 15 commits across the two sessions.

#### `a5db5dc` (14:35 UTC) — "Add Fire TV Rewind/Fast Fwd remote buttons; audit Fire TV+HA code end to end"

Jeff reported "Alexa fast-forward isn't working" and general Fire TV + HA trouble. Because the cloud session "has no LAN/ADB access to the physical Fire TV or Beehive to test live," it audited every Fire TV-related line in the repo instead. Finding: "the app's own Fire TV remote card only ever exposed Power and Play/Pause — fast-forward/rewind was never built, not a regression." Added Rewind/Fast Fwd buttons wired to `media_player.media_previous_track`/`media_next_track`, "Confirmed via WebFetch/WebSearch against HA's androidtv integration source and the underlying python-androidtv library (not guessed) that these are exactly what the library maps to real fast-forward/rewind ADB keyevents." It also established that nothing in the repo "ever wires up voice-driven 'Alexa, fast forward'… That's Amazon's own native Fire TV<->Alexa voice-remote feature, outside this project entirely."

`5bcbc6d` (14:40 UTC) merged the coworker's backup work and used the freshly committed `beehive-config/hcc.yaml` "to pin down the actual 'Alexa fast-forward' mechanism (script.hcc_skip_commercial) with real YAML instead of relying on docs/memory alone," also verifying "no secrets in the new beehive-config/ files before finalizing."

#### `d755a6a` (14:45 UTC) — "Document real root cause of 'Alexa fast-forward' via HA source + Amazon forums"

> Jeff confirmed the intended design (say "Alexa, fast forward" to skip commercials, auto-resume after) and asked to check HA community forums for correct setup. Read HA core's actual alexa/handlers.py: the Alexa Smart Home integration has no handler for PlaybackController.FastForward/Rewind (only Play/Pause/Stop/Next/Previous), matching open issue home-assistant/core#87327. Cross-checked Amazon's own community forums: custom Alexa Routines using phrases that sound like built-in media commands get intercepted natively and never reach the routine (same failure class as their own reported "Alexa, bedtime" case).
>
> Net result: the literal phrase "fast forward" can never trigger script.hcc_skip_commercial, in either exposure path … — this isn't a Beehive misconfiguration or an ADB pairing issue. The real fix is an Alexa Routine with a non-colliding trigger phrase (e.g. "Alexa, skip the commercial") pointed at the exposed script …
>
> No camera-related files touched — coworker is actively on the blank-camera issue this session.

The coworker's own later doc commit `d998302` (11:39 -0500), "Document Alexa fast-forward fix and zero-cost feature brainstorm," recorded the resolution — "Native Alexa phrasing bypasses the reserved-word Routine problem entirely; skip-distance calibration and the 24-idea list are both left as open work for next session."

#### `dd2c6fa` (15:05 UTC) — "Fix NOAA Weather Radio link (was a TuneIn search page); audit all app links"

> Jeff reported the NOAA Radio button was landing on "some type of paysite." Root cause: it pointed at a TuneIn *search* URL instead of an actual station. Verified the correct station via NWS's own official coverage database … plus four independent radio directories: KIG79, 162.550 MHz, Nashville, covers White House.

The full-link audit that followed had to work around the cloud environment itself: "This cloud session's network policy blocks essentially all direct HTTPS fetches (confirmed via curl - even google.com/wikipedia.org are rejected, only github.com passes), so verification used WebSearch … cross-checked against multiple independent sources rather than live click-testing." Confirmed correct: whitehousetn.gov, robertsoncountytn.gov ("ruled out a .org red herring"), spotternetwork.org, the ManualsLib/PartsTree/eReplacementParts/Jack's Small Engines deep links, both App Store IDs. One real ambiguity was flagged for Jeff: "the 'Mower Diagrams' and 'eReplacementParts (alt)' buttons point at two different serial-number sub-ranges for the same model - only he can confirm which matches his mower's actual data plate."

#### `f07048f` (10:21 -0500, coworker) — "Document Fire TV PiP popup wrong-frame fix, verified live twice"

> Root cause was blinkpy's motion state reflecting the live feed, not the actual clip; fixed via new clipframe cameras + real clip extraction, and fixed a shell_command redirection bug found along the way.

This fix — six new `camera.<cam>_clipframe` helper entities on the HA side — directly caused the next bug.

#### `1c69752` (17:28 UTC) — "Confirm mower serial number, fix wrong-serial-range eReplacementParts link"

> Jeff sent a photo of the Toro data plate: Serial No. 401338948, confirming the mower falls in the 400000000-402081999 production range. Recorded permanently in CLAUDE.md so this is never ambiguous again. Fixed the real bug this surfaced: the "eReplacementParts (alt)" button was pointing at the wrong serial range (402082000-403599999) - swapped for the correct page. The "Mower Diagrams" (PartsTree) link was already right.

`79b1d44` (17:30 UTC) merged the two sessions' CLAUDE.md changes, "removing one exact-duplicate 'link audit' entry that existed on both branches."

#### `83a23cd` (17:36 UTC) — "Fix camera views showing 12 tiles instead of 6 (clipframe helpers leaking in)"

Jeff reported the camera views were "all messed up." The root cause was a genuinely blameless collision between the two sessions' work:

> the coworker's same-day Fire TV PiP fix added 6 new HA local_file camera entities (camera.<cam>_clipframe) as internal plumbing to hold the extracted still for the Fire TV popup - a legitimate, necessary HA-side change. But loadCameras(), blinkRefreshAll(), and blinkReloadStills() all matched any entity_id starting with "camera." with no concept of an internal helper camera, so the app started rendering 12 tiles instead of 6, mixing real live Blink feeds with static single-frame helpers and silently failing blink.trigger_camera calls against the 6 fake ones during "Refresh All."

Fix: `isUserCamera()` excluding `*_clipframe`, applied at all three call sites; verified via Playwright "with a mocked HA response containing all 12 entities (matching the coworker's real HA state): confirmed exactly 6 tiles render, banner reads '6 CAMERAS,' no duplicates."

#### `58d294a` (17:50 UTC) — "Add fixed camera display order, front doorbell right under driveway"

Jeff asked to move the Front Doorbell tile under Driveway. The commit exposed a latent fragility: "The grid had no explicit order before - it just rendered in whatever sequence HA's /api/states happened to return, which isn't a stable guarantee." Added `CAM_ORDER` (driveway, front doorbell, front right, back left, backyard, garage) with a stable sort so "a future 7th camera won't break anything," and proved it by deliberately shuffling the mock HA response.

#### The LUX thermostat card odyssey: `87d2459`, `aa38bc8`, `e841657`, `70d16f2`

`87d2459` (17:56 UTC) moved the LUX Thermostat card from GUARDIAN to HOME "right under cameras" at Jeff's request, first confirming that GUARDIAN's HVAC health row reads its own `climate.*` entity "completely independent of loadClimate()'s LUX-cloud API call, so removing it from GUARDIAN doesn't break that row."

`aa38bc8` (18:36 UTC) — "Overlay live LUX thermostat data onto the device photo." "Jeff sent a marketing photo of a LUX thermostat in a living room and asked to overlay the real live temp/mode data directly onto the device's screen in that picture, wanting to see an example before any real code changed." The session mocked it first with sample numbers, got Jeff's approval on a screenshot, then implemented it — hand-calibrating "the device screen's position/size/rotation (~-2.4deg) in the photo as percentages," cropping tighter than the original photo because at phone widths the screen area was too small for legible text. Along the way it found and fixed two real pre-existing contrast bugs (luxConn and the active fan button hardcoding dark-mode hex instead of tokens) and noted "the same hardcoded-hex pattern exists 100+ more times across the file - logged as a separate future cleanup item."

`e841657` (18:45 UTC) — "Redesign LUX photo overlay: full picture + proven glass-chip pattern." Jeff's verdict on the first version, quoted verbatim in the commit body:

> Jeff's verdict on the first version: "That looks awful... where is the rest of the picture." Two real problems: (1) cropped the photo tight to just the device, losing the living-room atmosphere that was the point of the photo he picked; (2) a rotated black panel trying to precisely composite onto the device's in-photo screen read as a pasted-on box, not part of the app.
>
> Root cause: invented a bespoke rotated-overlay technique instead of reusing the app's own proven pattern. The utility cards already solve "live data on a real photo" with util-banner/util-overlay-bottom/util-stats - a bottom gradient + glass chips, no perspective-matching.

The redo restored the full 1320x931 photo, rebuilt with the exact utility-card classes, and bumped the service worker to hcc-v14.

`70d16f2` (19:08 UTC) — "Move all LUX controls into the fireplace area, add real outside temp/feels-like." Jeff approved the fireplace-panel mockup — and made an explicit, recorded tradeoff: he was "flagged that the mode/fan buttons come out to ~40x19px/54x15px, below Apple's 44x44 tap-target guideline - he accepted that tradeoff explicitly." The fake baked-in weather readout on the thermostat photo was replaced with real outside temp + feels-like wired to the app's existing weather pipeline (WU station KTNWHITE21 + Open-Meteo fallback). The commit also caught "the same recurring bug class one more time": `luxRenderFan()` using theme tokens on a permanently-dark photo panel.

#### `f3ca8b6` (19:43 UTC) and `ffa6b4b` (19:56 UTC) — YARD consolidation

`f3ca8b6` merged YARD's two redundant "ready to mow" cards. Before touching anything it read both verdict functions: `applyMowVerdict()` "is weather-only," while `renderReadiness()` "is a real superset - same weather check plus NWS alerts, irrigation status, overdue/due-soon service, and mower health." Kept the superset, folded the 8-stat weather grid underneath, and confirmed deleting the old banner was safe because "every reference is a write guarded by if(banner){...}, nothing ever reads its state."

`ffa6b4b` folded System Health into the merged card and removed fluff: "System Health's Engine/Deck/Blades/Drive are real (calcHealth() from actual service-interval data); Electrical/Fuel were hardcoded 98% placeholders with no sensor behind them, so only the 4 real categories now show." The Fitness card (miles/calories/steps) was removed entirely — "confirmed via grep nothing else depends on it (GPS distance telemetry is a separate, still-live path)" — and the pre-mow sensor-reset reminder banner was removed "per Jeff's request."

### 2026-08-04 — the LUX login trilogy and the garage-door thread opens

#### `c46ae19` (13:58 UTC) — "Fix LUX thermostat requiring login repeatedly"

> Two compounding bugs: climate.js ran a full Azure B2C login on every single /api/climate call (every app open + every 8s poll), and loadClimate() treated any error containing "401" as bad credentials, wiping the saved LUX login and popping the login form back up even when the 401 came from an unrelated downstream call.
>
> Added withAuth() to cache the access token in KV (same MOWER_KV/HCC_KV pattern as hours.js) so repeated requests reuse it instead of re-authenticating from scratch, with self-healing retry on genuine token expiry. Narrowed the client-side wipe condition to only fire on an actual login_failed response, not any 401.

#### `a0936d6` (18:05 UTC) — "Fix duplicate account-form IDs in the Connected Accounts modal"

A subtle DOM bug that could silently eat a saved login:

> hiveShowAccounts() copied #connAcctCard's innerHTML into the #grdModal popup on every open without removing the original node, so every acct-* id (email/password inputs, save badges) existed twice in the DOM at once. getElementById() always resolved to the invisible original (earlier in document order than #grdModal), so Save/Toggle/badge-refresh silently operated on a node the user never saw or typed into — meaning a saved LUX login could silently fail to actually save.

#### `d15079c` (18:40 UTC) — "Fix LUX never loading on a normal app open"

The third LUX bug in one day, and the most fundamental:

> loadClimate() was only wired into hccSection('home', ...), which runs when a user navigates TO home via a nav tap. HOME is already the default active section in the static HTML, so that function never actually fired on a plain app open — only on manually navigating away and back. … Added loadClimate()/loadStation() to the real unconditional boot sequence and to the 60s self-heal interval, matching how every other HOME data source already behaves.

#### `7b60e43` (18:53 UTC) — "Note cheapest ratgdo-compatible garage door option in project memory"

The opening move of what became the period's most instructive failure chain: "Researched pricing for Jeff's garage door question: Gelidus Research's USB-C v2 board (~$22-25) is pre-flashed, full feature parity with the official ratgdo, and cheaper than the $45 official kit. Also noted the DIY rat-ratgdo option and flagged plain relay modules (Athom etc.) as NOT protocol-compatible substitutes." (That last claim gets overturned on 08-05 — see below.)

### 2026-08-05 — hardware inventory day, Kitchen TV at $0, and the garage-door saga

Fifteen commits on the last full day of the window, nearly all docs-only additions to project memory, plus the coworker's late-evening sewer-case verification.

#### `bcb6bf6` (11:54 UTC) — "Scale LUX + Utility card buttons/text with screen size (fixes tiny UI on iPad)"

The one code commit of the day: photo-overlay sizing "used fixed px values tuned for phone-width cards. .content has no max-width cap, so the card renders much wider on iPad but the fixed-px elements never scaled up with it. Switched to clamp(phoneSize, Nvw, capSize) … Phone sizes are unchanged; iPad buttons/text now render roughly 1.4-2x larger."

#### The inventory run: `35553b4`, `19f80be`, `8abb561`, `1400370`, `b1525f7`, `b4910c5`, `5ac9211`, `19a404c`, `9eef792`

A morning-to-afternoon sequence cataloguing Jeff's spare hardware and assigning roles, each verified rather than assumed:

- `35553b4` (12:36 UTC) — "Correct J45 USB port count in project memory (4 ports, not 2)." "Jeff confirmed the Beelink J45 has 4 USB 3.0 ports (one yellow, likely always-on/charging), not the 2 the notes previously assumed. Recorded the current port allocation plan for the Zigbee coordinator, HDMI capture card, and RTL-SDR, plus that the spare USB-C hub isn't needed."
- `19f80be` (13:57 UTC) — "Record GaragePC (TouchSmart 520-1020) plan and Kitchen TV feed decisions." The garage all-in-one (23in touchscreen, webcam/mic/speakers, 8GB RAM) gets dedicated to "a Linux Mint kiosk for the app plus garage cam, TTS announcements, voice satellite, health monitoring, and a second backup target." Real constraint flagged: "the NextWindow touchscreen's nwfermi Linux driver requirement (rules out ChromeOS Flex)"; heavy encode/AI ruled out on its CPU. Also recorded "the decided Kitchen TV capture chain (Roku + EZ118K HDCP bypass + AXHDCAP into go2rtc), the AirTV 2's closed-ecosystem limits, and the free proof-of-concept paths."
- `8abb561` (14:16 UTC) — KESU 500GB portable drive "assigned as the AirTV 2 DVR recording disk"; Lenovo B570 laptop (2012, Sandy Bridge, HDMI out) "noted as a $0 kitchen Sling player candidate via the browser (no HDCP capture needed, AirTV locals excepted) and future second Linux kiosk; exact CPU still needs checking before any encode work is assigned to it."
- `1400370` (14:20 UTC) — "Pin kitchen iPad as iPad Air 2 in project memory." iPadOS 15 max — "the same Safari 15 the app was already polyfilled for, so the go2rtc WebRTC Kitchen TV card will play on it; Sling's native app cannot install."
- `b1525f7` (14:28 UTC) — "**Kitchen TV solved at $0** — Sling web confirmed playing on the wall iPad." "Jeff photo-confirmed watch.sling.com playing live TV in Safari on the wall-mounted kitchen iPad Air 2. Capture-chain purchase moved to on-hold pending the AirTV 2's arrival, since its remaining value is locals + TV-in-app + Roku control rather than basic kitchen TV."
- `b4910c5` (14:42 UTC) — Delam condenser mic assigned as "the future garage voice-assistant/intercom input"; the 2012 WD Scorpio Blue 320GB assigned as "the zero-risk Linux Mint test drive for the B570 laptop, with its Windows drive shelved as rollback." Also noted the B570's kitchen-player role "is obsolete now that the wall iPad plays Sling web."
- `5ac9211` (15:02 UTC) — HDMI-005 wireless display stick logged ("DRM video blocks over mirroring"); an unidentified "black HDMI-female + USB 3.0 pigtail dongle needs a Camera-app test to distinguish capture stick vs USB display adapter — if capture, it replaces the planned AXHDCAP purchase."
- `19a404c` (15:30 UTC) — "Confirm B570 CPU: Pentium B960, encode/AI ruled out, light roles fine." From Jeff's About screenshot; "Also noted its Windows name 'DellMasterBed' to avoid network-name confusion."
- `9eef792` (15:38 UTC) — "Mystery dongle identified as HDMI-to-USB capture stick." "Camera-app test on the beast confirmed it enumerates as a camera — it's a capture device. Assigned to the Kitchen TV chain, replacing the planned AXHDCAP purchase; the EZCOO EZ118K stripper is now the only part left to buy for that project."

#### The garage-door saga: `65d7e49` → `7e4726a` → `10f0f13` → `4bfacf3` → `f015867` → `7f73148`

Six commits in ninety minutes, ending in a permanent rule. In order:

1. `65d7e49` (18:33 UTC) — "Record garage door protocol test: dry-contact confirmed, not Security+2.0." "Jeff bridged the wall-button wires directly and the door toggled -- matches ratgdo's own documented dry-contact test (true Security+2.0 wouldn't respond to a raw short). Gelidus board choice is unchanged, but dry-contact mode alone only gives blind toggle; added a magnetic reed sensor to the purchase list for real door-position status."
2. `7e4726a` (18:39 UTC) — "Simplify garage door purchase back to just the Gelidus board." "Jeff doesn't park in the garage, so real-time door position isn't needed -- just open/close from the app. … Reed switches moved to optional future add-on for a 'door left open' alert, not part of the purchase."
3. `10f0f13` (18:45 UTC) — "Correct garage door plan: drop ratgdo board, use cheap ESPHome relay." **Jeff caught the reasoning error himself:** "Jeff correctly pushed back -- the ratgdo/Gelidus board's price premium is entirely for decoding the Security+ protocol, which his confirmed dry-contact opener doesn't use. Switched the plan to a SONOFF Basic R2/R4 relay (~$8-10) wired to the same tested wires, flashed with ESPHome as a template cover -- same HA cover entity and app auto-detection, ~$15 cheaper, only costs a one-time manual flash." (Note this also implicitly reversed `7b60e43`'s claim that plain relay modules were "NOT protocol-compatible substitutes" — true only for Security+ openers, which Jeff's isn't.)
4. `4bfacf3` (18:50 UTC) — "Correct garage door part to exact model: SONOFF SV, not Basic." **Jeff pushed back again, and was right again:** "Jeff pushed back that 'SONOFF Basic' wasn't specific enough among SONOFF's confusing relay lineup -- and it was actually the wrong pick: Basic-series switches are mains-voltage (110-240V) and need modification for a low-voltage garage circuit. SONOFF SV ('Safe Voltage') is SONOFF's purpose-built 5-24V DIY model, no mod needed. Recorded exact buying criteria to avoid the wrong SKU."
5. `f015867` (18:57 UTC) — "Switch garage door part to SONOFF MINI-D -- native Matter, no flashing." **Jeff found the actually-right part himself:** "Jeff found a better match than the SONOFF SV plan: MINI-D has real Matter support (pairs directly into HA's built-in Matter integration, no ESPHome needed), dry-contact relay output, and a hardware Inching Mode for a proper momentary pulse trigger. Verified all of this via research before committing -- this is the final part for the garage door. One thing flagged as unconfirmed until it's actually paired: whether it needs a small template-cover wrap to show as a proper garage card."
6. `7f73148` (19:02 UTC) — "Add permanent rule: never name a product/model from memory unverified." The accountability commit, in full:

> Jeff called out three wrong-in-a-row hardware recommendations on the garage door part today -- ratgdo board, then SONOFF Basic, then had to be corrected to SV before he found the actually-right MINI-D himself. Logging this as a protected standing rule alongside the Debugging Protocol: no specific product/model gets named unless it was verified via a real search in the current session. Docs only.

#### `aa6566a` (2026-08-05 21:44 -0500, coworker) — "Coworker verification: sewer overcharge tracking real-HA checks (2026-08-05)"

**Boundary note:** this commit's timestamp is 21:44 CDT on 08-05 — 02:44 UTC 08-06, just past the window's strict UTC cutoff — but it is Jeff's local 08-05 evening and the direct verification of this period's sewer-case code, so it belongs to this chronicle. Full body:

> Verified the 5 items from the cloud session's handoff doc against the real Beehive HA instance. Found a real recorder-retention gap (no purge_keep_days override, default 10 days, plus B-Hyve zone history only starting 07-30 vs cycleStart 07-21) and that zero B-Hyve zones have recorded an "on" event in 8 days of history, so irrGalFromHistory()'s fix has never actually fired yet (mechanically works, just unexercised). Also confirmed a real ~18.7hr water-meter gap that's likely the known benign batching pattern (gas meter, same dongle, unaffected).

This is the honest coda to the sewer thread: the `4b409b9` fix from 07-31 was mechanically sound (its mocked test proved the math) but as of 08-05 had **never fired on real data** — HA's recorder only keeps 10 days by default, B-Hyve zone history only existed from 07-30 while the billing cycle started 07-21, and no zone had recorded a single "on" event in 8 days (**INFERRED:** consistent with B-Hyve WeatherSense rain-skipping through early-August weather, but the record does not say why the zones never ran). The ~18.7-hour water-meter gap being classified as "likely the known benign batching pattern" shows the `fb5068c` retraction lesson paying off — a gap that on 08-01-morning logic would have triggered another fault diagnosis was correctly matched to the documented batching behavior, with the gas-meter-same-dongle control check reused.

### Decisions made or rejected in this period

1. **Sewer-overcharge estimate must use real B-Hyve runtime, not a schedule assumption** (Jeff, 07-30; `d74c8e1` → built in `4b409b9`) — because it backs a real WHUD refund request. Per-zone GPM stays a configured constant (the B-Hyve switches expose no flow attributes). Estimate always labeled "rough estimate from your weekly schedule" vs "from real B-Hyve run time this cycle" "so Jeff always knows which one he's looking at."
2. **Do NOT call WHUD about the 07-28 pit-radio silence** (Jeff, 07-31; `13502b9`): "water's transmitting fine now and he explicitly does not want to call WHUD about it -- doesn't want to raise a flag with the utility district over something that's already resolved." Standing instruction: "Leave this alone unless water goes silent again; if it does, that's a fresh incident, not a continuation of this one."
3. **WHUD call re-opened 08-01 (`593ddf7`) then cancelled the same day (`fb5068c`)** — "No WHUD call needed — the meter and pit radio are both healthy." The wrong diagnosis was kept in CLAUDE.md "for the record rather than deleted."
4. **Freeze Warning automation removed entirely "per Jeff's request"** (07-31, `b4f11df`).
5. **Mercedes PIN handling stays server-side only** — the dormant client-side PIN subsystem deleted (`8501360`) because "it directly contradicted the documented 07-24 invariant … the app must never send/store a pin field."
6. **`scripts/lint-app.js` run before every push from here on** (`abcc8f4`); `scripts/smoke-test.js` becomes the standing regression check (`7255f6f`).
7. **Blink camera refresh throttled to once per 3 minutes** on HOME open "so battery-powered cameras aren't hit on every tab switch" (`abcc8f4`).
8. **Zigbee shopping list: verify the existing picks, don't propose a competing list** (`a00842c`); "buy these two things today" (ZBDongle-P coordinator + USB extension, SNZB-04P door sensors), "respecting the existing '3-4 key doors, not every window' rule." Honest caveat recorded: HEIMAN HS2WD-E siren works better under Zigbee2MQTT than ZHA.
9. **Angela's barn and work arrivals get separate automations** "per Jeff's requirement, since barn and work (Nashville) are both regular destinations" (`66b3f49`, `2765386`).
10. **zone.work radius gap deferred by Jeff** ("leave it for now, dial in later," `bc3df2b`), then resolved when he supplied the real garage address, 310 Commerce St (`3537b00`) — which took priority over his own earlier ~0.4mi estimate despite geocoding only ~90m from the office ("flagged to him, not fully reconciled").
11. **Lighthouse scope limited to "basic wins without restructuring the app, per Jeff's scope"** — minification and script-splitting explicitly out (`2102e3a`).
12. **Contrast fixes staged in two deliberate steps**: safe token swaps first (Jeff-approved, `bdc6f93`), then — only on Jeff's explicit "go ahead and fix the remaining contrast items" — global token darkening (`fdc358e`), ending at axe-core 0 violations / Lighthouse Accessibility 100.
13. **Rain-skip HA automation rejected as strictly worse than B-Hyve's own WeatherSense** (`f1d24f3`): "no wind/temp adjustment," and WeatherSense independently tested at "100% skip reliability on 0.2\"+ rain days."
14. **Morning Digest ships without the "active alerts" metric** rather than showing a silently-always-zero count — "removed that metric entirely rather than ship a false 'all clear'" (`f1d24f3`).
15. **PiP popup leaning image-only**, with `blink.save_recent_clips` for after-the-fact review, because pushing the full Blink clip "would very likely make the delay *worse*" — decision left with Jeff ("Jeff wants to think about it," Pending Item 12 via `f1d24f3`).
16. **Vizio soundbar: leave it alone** — zero references anywhere; "left alone per Jeff, he'll power-cycle manually if it recurs" (`2765386` change-log entry).
17. **Alexa duplicate-device cleanup: plan ready, execution is Jeff's call** (`2765386`).
18. **Master backup system built to Jeff's brief: "save everything... it would be catastrophic to lose anything"** (`552c699`) — git snapshot layer + daily HA backup synced off-box to iCloud, dedicated least-privilege token, 14-copy retention. Remaining flagged risk: the HA backup **encryption key** still needs a durable off-PC copy (`03e688b`).
19. **Alexa fast-forward: real fix is a non-colliding Routine phrase** ("Alexa, skip the commercial") — the literal phrase can never work; not a Beehive misconfiguration (`d755a6a`, `d998302`).
20. **Camera display order fixed by explicit `CAM_ORDER`**, front doorbell under driveway per Jeff (`58d294a`).
21. **LUX card on HOME, under the cameras** (Jeff, `87d2459`); overlay approach mocked-then-approved before real code changed (`aa38bc8`); first crop **rejected by Jeff** ("That looks awful... where is the rest of the picture," `e841657`); fireplace-panel layout approved **with Jeff explicitly accepting sub-44px tap targets** (`70d16f2`).
22. **YARD de-duplicated**: single Ready-to-Mow card keeping the superset verdict; hardcoded 98% Electrical/Fuel placeholder gauges dropped; Fitness card and pre-mow reminder removed per Jeff (`f3ca8b6`, `ffa6b4b`).
23. **Garage door part**: Gelidus ratgdo (~$22-25, vs $45 official) → rejected; reed sensor added → dropped ("Jeff doesn't park in the garage"); SONOFF Basic (~$8-10, ~$15 cheaper) → wrong (mains-voltage); SONOFF SV → superseded; **final: SONOFF MINI-D** (native Matter, hardware Inching Mode, no flashing), found by Jeff himself (`65d7e49`→`f015867`). Open question recorded: whether MINI-D needs a template-cover wrap.
24. **Kitchen TV solved at $0** — Sling web in Safari on the wall iPad Air 2; capture-chain purchase put on hold; the mystery dongle turning out to be an HDMI capture stick eliminated the AXHDCAP purchase, leaving the EZCOO EZ118K "the only part left to buy" (`b1525f7`, `9eef792`).
25. **PERMANENT RULE (Jeff-driven, `7f73148`): "no specific product/model gets named unless it was verified via a real search in the current session"** — a protected standing rule alongside the Debugging Protocol, earned by three wrong-in-a-row recommendations in one day.

### Problems, failures & root causes in this period

1. **Water pit-radio "stuck register" false alarm (the period's defining failure).** Symptom: 47 minutes of simultaneous irrigation + shower produced identical readings (`179097`) on every decode, while the gas meter on the same dongle ticked normally. Wrong conclusion (`593ddf7`): pit-radio register stuck, call WHUD, leak detection blocked. Real root cause (`fb5068c`, same day): `rtlamr2mqtt`'s `-unique=true` flag republishes only on value change, and the meter's own transmitter batches its broadcast register updates (~20 min–3 hr gaps), so the "heartbeat" (`sensor.water_meter_last_seen`) confirms RF catches, not value freshness — "a real signal I misread … I conflated the two." Proven by an IDM-protocol probe (zero IDM packets — `scm+` is the complete picture) and a longer window catching the value move twice. Test-config changes fully reverted. Lesson explicitly banked and reused on 08-05, when an ~18.7hr gap was correctly triaged as "likely the known benign batching pattern" (`aa6566a`).
2. **"New automations don't save" (long-standing).** Root cause: `configuration.yaml` missing `automation: !include automations.yaml` — UI-created automations wrote to disk but never joined the loaded config tree. Fix: `b4f11df`; three real automations came alive and two duplicate Recorder Watchdog copies were deleted "before they could triple-fire."
3. **07-28 water/gas outage misattributed.** The 07-28 pit-radio hardware theory was corrected: "proximate cause was rtlamr2mqtt losing the RTL-SDR USB device, fixed by a full Beehive host reboot" (`b4f11df`). The cloud session flagged the unreconciled record (`0b72961`) before Jeff closed it (`13502b9`).
4. **Camera popups missing or 10-15 min late.** Root cause: upstream blinkpy LoginError crash (home-assistant/core#176836, fronzbot/blinkpy#1217) leaving motion sensors stuck at stale values "instead of going unavailable, so the existing watchdog couldn't catch it." Fix: `HCC — Blink Auto-Heal` (`fd15642`), then hardened when it emerged that "system_log_event only fires once per unique message, so a repeating crash-loop could slip past" — unconditional 15-minute reload backstop added (`a001f2e`), which caught **73 real crashes overnight** with zero user impact (`62e99b5`).
5. **Runtime-only automation disable wouldn't survive restart.** The old full-screen Fire TV automation was disabled via `automation.turn_off` with a desynced entity_registry entry; real fix used the documented `initial_state: false` YAML key — "an initial enabled: false guess would have silently done nothing" (`62e99b5`).
6. **window.open() no-ops in installed iOS PWA** — ~20 external-link call sites broken in exactly the way Jeff uses the app; fixed with real anchors (`8501360`), then fossilized into lint + smoke-test checks.
7. **Lazy-loading CLS regression, self-caught** — CLS 0.023 → 0.436 from unreserved image containers; fixed with per-image `aspect-ratio`, ending at 0.015 (`2102e3a` → `38a5f17`).
8. **Contrast-fix own-goals** — the first gold fix landed "in a throwaway test copy, not the real file," and a `html.light` override was silently defeated by inline styles ("inline styles always beat an external stylesheet rule regardless of selector specificity") — both caught and fixed within `bdc6f93`.
9. **Angela's tracker: wrong attempts before the real fix.** Wrong/insufficient: iOS permissions (Always/Precise/Background Refresh), manually opening the app, `command_request_location_update` pushes (a documented "hit-or-miss" feature), and the Mercedes-GPS backup (which papered over rather than fixed it — the earlier "backup" triggers "both secretly depended on her unreliable phone tracker"). Real root cause: **empty/stale Push ID** in the Companion App's Notifications settings — no valid push channel, so nothing could wake the app. Confirmed by an organic background update with real GPS movement and battery drain (`2770fee`).
10. **Morning Digest false "all clear"** — the alerts count silently always returned 0 because persistent notifications left the template-readable state machine in HA 2023.6; metric removed rather than shipped wrong (`f1d24f3`).
11. **Kodi buffering "fix" that never took effect** — Jeff's `advancedsettings.xml` edit was overridden by Kodi 21's GUI settings; real values found still at defaults in `guisettings.xml` and edited there (`f1d24f3`).
12. **Weather.com API key committed in the clear** — found in `packages/hcc.yaml` only because the repo's public status was checked "before doing anything, not assumed"; moved to `secrets.yaml` (`552c699` entry).
13. **PowerShell BOM corrupting the backup token** — `Set-Content -Encoding utf8` silently prepends a BOM, causing silent 401s; fixed with no-BOM `WriteAllText` (`552c699` entry).
14. **"Alexa fast-forward" never could have worked** — HA's Alexa integration has no FastForward/Rewind handler (core#87327) and Alexa natively intercepts routine phrases that sound like built-in media commands; not a config bug at all (`d755a6a`). Separately, the app's own remote card had simply never had FF/RW buttons — "never built, not a regression" (`a5db5dc`).
15. **NOAA Radio "paysite"** — the button pointed at a TuneIn *search* page, not station KIG79; fixed after verification against NWS's own coverage database (`dd2c6fa`).
16. **Fire TV PiP showing the wrong frame** — blinkpy's motion state reflected the live feed, not the actual clip; fixed with clipframe cameras + real clip extraction, plus a shell_command redirection bug found en route (`f07048f`).
17. **12 camera tiles instead of 6** — the clipframe fix's helper entities leaked into the app because three functions matched any `camera.*` entity; `isUserCamera()` filter added (`83a23cd`). A cross-session integration bug: both sides' changes were individually correct.
18. **eReplacementParts link pointed at the wrong serial range** — resolved only when Jeff photographed the Toro data plate (Serial No. 401338948, range 400000000-402081999), now "recorded permanently in CLAUDE.md so this is never ambiguous again" (`dd2c6fa` → `1c69752`).
19. **LUX overlay v1 rejected** — bespoke rotated-panel compositing instead of the app's proven glass-chip pattern; Jeff: "That looks awful... where is the rest of the picture" (`aa38bc8` → `e841657`). Root cause named in the commit: "invented a bespoke … technique instead of reusing the app's own proven pattern."
20. **Recurring hardcoded-hex-on-dark-panel bug class** — hit three separate times in the LUX work (luxConn, active fan button, `luxRenderFan()` inline tokens); ~100 more instances logged as future cleanup (`aa38bc8`, `70d16f2`).
21. **LUX login misery, three stacked bugs** — full Azure B2C login on every poll; any-401-wipes-credentials; and `loadClimate()` never firing on a plain app open because HOME is the default section (`c46ae19`, `a0936d6`, `d15079c`). The duplicate-ID modal bug meant "a saved LUX login could silently fail to actually save."
22. **Fire TV PiP 3-4 minute delay — still unresolved at window's end.** HA-side chain proven <1s; delay is upstream (Blink cloud clip processing or Fire TV/PiPup rendering); "blocked on reproduction: need a real occurrence with a rough timestamp from Jeff to trace further; can't diagnose blind" (`f1d24f3`, Pending Item 12).
23. **Three wrong-in-a-row garage-door recommendations** — ratgdo/Gelidus (protocol premium his opener doesn't need — Jeff caught it), SONOFF Basic (mains-voltage, wrong for a low-voltage circuit — Jeff caught the vagueness, research caught the error), SONOFF SV (superseded when Jeff found the MINI-D himself). Fix commit for the pattern, not just the part: the permanent verify-before-naming rule, `7f73148`.
24. **Sewer-case fix unexercised in production** — `aa6566a` found `irrGalFromHistory()` had never actually fired against real data: recorder retention at the 10-day default (no `purge_keep_days` override), B-Hyve history starting 07-30 vs. a 07-21 cycle start, and zero recorded zone "on" events in 8 days. "Mechanically works, just unexercised." The record in this window is silent on the follow-up fix for retention; that lands after 08-05.


---

## Chronicle: 2026-08-06 → 2026-08-11 — the hour-meter reckoning

This is the window in which the project's central failure — the hour meter that the whole sensor system was built to feed, and which had **never once been fed by the sensor** — was finally found, understood, and fixed at the source. It is also the window of the sewer-overcharge tracking fix, the real GPM calibration, the glassmorphism war and the fake-photo purge, the Mercedes PIN saga, the garage Sonoff plan, the satellite yard map, and the localStorage blowout that reset Jeff's hours to 5.9 — the accident that finally forced the audit which exposed everything.

All 96 commits in the window (2026-08-06 00:00 UTC → 2026-08-11 23:59 UTC) on `origin/claude/time-master-project-liq1jw` are covered below. Note on timestamps: cloud-session commits are stamped `+0000` (UTC); coworker-PC commits are stamped `-0500` (US Central). Both appear interleaved because two sessions — the cloud session and the "coworker" session on Jeff's Windows PC with LAN access to the real Home Assistant ("Beehive") and the real hardware — were working the same branch in parallel through this whole period. That two-session split is itself a main character in this chronicle: it is both what caught bugs the cloud session could never see, and (per the closing commit of the arc) what structurally caused the hour-meter miss in the first place.

One landmark from the assignment brief — `a1cfa53`, "Put the mower firmware in the repo" — is timestamped 2026-08-11 19:31:14 -0500, i.e. 2026-08-12 00:31 UTC, **32 minutes outside this window**. It is the direct coda to this window's story and is quoted at the end, clearly marked as falling just past the boundary.

### 2026-08-06, 00:59–02:44 UTC — the sewer-overcharge case gets honest data

The day opens with three commits hardening the dataset behind Jeff's refund case against WHUD / the City of White House — his argument that he is being charged sewer fees on irrigation water that never enters the sewer.

**`7eebfd3` (2026-08-06 00:59 UTC) — "Update sewer rate to match confirmed City of White House increase."** Jeff's 5/7–6/6/26 sewer bill showed Base **$23.42 + $0.01011/gal**, up ~3% from the previously validated $22.74 + $0.00982/gal — per the commit body, "a real rate increase, not a calc bug." The new formula was verified to reproduce the bill's **$92.56** base+consumption exactly before committing. The same pass discovered two flat charges the "Est. Sewer" figure never included — Sanitation Services (**$24.00**) and Stormwater Fee (**$8.99**) — flagged in CLAUDE.md "pending Jeff's call on whether to fold them in."

**`330c74a` (01:10 UTC) — "Add Garbage/Stormwater as separate line items, keep sewer math pure."** Jeff's call came fast, and the reasoning is recorded:

> Jeff is building a case with WHUD/City of WH for a refund on sewer charges for irrigation water that never enters the sewer -- that argument needs clean, usage-based-only data.

So GARBAGE_FLAT/STORMWATER_FLAT became their own stat cells on the WATER card rather than being folded into SEWER_BASE/SEWER_PER_GAL, keeping `sewerEst`/`sewerWaste` and the `water_billing_history` sewer/waste fields untouched — "exactly the dataset the overcharge case depends on." Verified by reproducing the real bill exactly: $92.56 sewer-only, **$125.55** full City of WH + WHUD total.

**`8158128` (01:18 UTC) — "Fix sewer-overcharge tracking: real B-Hyve data was never saved to history."** The first "it was never actually working" discovery of the window, and a preview of the pattern that dominates it:

> irrGalFromHistory() computed the accurate irrigation gallons from real B-Hyve on/off runtime (accounts for rain delays, skipped days) but only ever displayed it in the on-screen note -- the tracked water_billing_history entry that "Total sewer overcharge tracked" sums was only ever written by the rougher schedule-based estimate and never refreshed.

The fix makes `irrGalFromHistory()` overwrite the current cycle's `irrGal`/waste fields with the real number and re-render the history table, "so the running total Jeff is building for the WHUD/City of WH case always reflects the best available data." The commit is honest about its limits: the accumulation logic was verified in isolation, but "Could not test the live B-Hyve/HA fetch itself -- no network path to Jeff's real HA instance from this sandbox."

**`3322153` (02:16 UTC)** wrote the coworker handoff doc (`docs/utilities/sewer_overcharge_verification_2026-08-05.md`) with a checklist of what only real LAN/HA access can verify. **`aa6566a` (authored 2026-08-05 21:44 -0500, ≈02:44 UTC) — "Coworker verification: sewer overcharge tracking real-HA checks."** The coworker session checked all 5 items against the real Beehive HA instance and found:

> a real recorder-retention gap (no purge_keep_days override, default 10 days, plus B-Hyve zone history only starting 07-30 vs cycleStart 07-21) and that zero B-Hyve zones have recorded an "on" event in 8 days of history, so irrGalFromHistory()'s fix has never actually fired yet (mechanically works, just unexercised). Also confirmed a real ~18.7hr water-meter gap that's likely the known benign batching pattern (gas meter, same dongle, unaffected).

### 2026-08-06, 05:57–07:58 UTC — Electric SmartHub: shipped, then found silently non-functional the same night

**`9756992` (00:57 -0500) — "Electric SmartHub: real hourly/daily data confirmed, poll interval fixed."** The coworker logged into CEMC SmartHub directly, confirmed the installed integration imports real hourly/daily statistics (not just the monthly total the app read), fixed the poll interval (HA's 6-hour default → 30 min), and confirmed This Month/Est. Cost already matched HA exactly — "no bug there." **`f0c8aeb` (01:00 -0500)** added a concrete field spec because "Jeff wants this buildable directly rather than left to design judgment" — exact new stat cells (Today real, Yesterday, Peak Hour, Last 7 Days sub-panel).

**`46ab304` (06:22 UTC)** built it: since `history/statistics_during_period` is WebSocket-only, a new `functions/api/ha-stats.js` opens a one-shot outbound WS to the allow-listed Nabu Casa host, authenticates with the browser's own token, and returns the result over HTTP. NOW was left "permanently blank (--) per the upgrade doc's explicit instruction -- the old fake hour-of-day 'Now' estimate is removed, not just deprioritized." Service worker hcc-v14→v15. **`031529c` (06:41 UTC)** fixed two real layout bugs Jeff flagged ("professional, not jumbled"): the stat row was flex, not grid, so the inline `grid-template-columns` was silently ignored (6 chips wrapping 4/2 raggedly — fixed with a real `.util-stats-grid3`); and Peak Hour's second line was invisible because it used `var(--muted)`, "a theme-relative token that resolves dark-on-dark against this card's permanently-dark photo overlay in light theme -- same bug class as the LUX contrast fixes." **`a82f0ce` (06:41 UTC)** synced CLAUDE.md.

Then the coworker did what the cloud session could not. **`fa8e153` (02:48 -0500) — "Electric SmartHub: found the real bug - feature is currently non-functional."**

> Fired the exact WS command from ha-stats.js directly against live HA and found two real bugs keeping Today/Yesterday/Peak Hour/Last 7 Days silently broken despite the UI cells rendering: (1) history/statistics_during_period doesn't exist on this HA version (Core 2026.8.0), real command is recorder/statistics_during_period; (2) the "change" field always reads 0 for this sensor even across real usage growth, code needs to diff cumulative "sum"/"state" between period boundaries instead.

**`7c91709`** is the merge bringing that finding over. **`5c41c8d` (07:56 UTC)** applied both fixes — the WS command renamed, and `loadElectricStats()` switched to a new `toDiffedSeries()` helper diffing consecutive cumulative sum/state readings (the coworker's live evidence: "sum moved 761->872 over 48h while every change was 0") — "same 'diff two cumulative readings' pattern already used by irrGalFromHistory() and the water billing math." Bill Due / Last Payment / vs-Last-Year were confirmed live as "genuinely not available without a new scraper -- not built, low priority." hcc-v16→v17. **`e5a557a`** is the corresponding merge commit (doc conflict resolved).

The lesson of this cluster — UI cells rendering correctly on mocked data while the live feature is dead — is the exact miniature of the hour-meter failure resolved five days later.

### 2026-08-06, 07:14–08:04 UTC — the two-repo deploy mystery closed; branch cleanup handoff

**`34d177f` (07:14 UTC)** wrote a handoff doc on the two-repo/Cloudflare-deploy mystery: both repos (Master-the-Master- and Toro-Timemaster-) share identical early history; Toro-Timemaster- has manual "Sync from Master-the-Master-" commits through 07-24 then went stale. The cloud session recorded what it verifiably could NOT determine (no Cloudflare Pages config tool in the connector, direct HTTPS to the live site blocked) and asked for one concrete check in the Cloudflare dashboard. **`6e24295` (07:17 UTC)** closed it empirically: "Jeff opened the app and saw the new Electric card cells after tonight's push, confirming this repo/branch is what Cloudflare Pages actually deploys. Toro-Timemaster- is a stale diverged mirror -- flagged permanently in CLAUDE.md so no future session wastes time developing there." **`3d50944` (07:24 UTC)** added a plain-language version of the explanation. **`2b0cb3d` (08:04 UTC)** wrote the follow-on cleanup handoff (delete backup branches, archive Toro-Timemaster-) — pure GitHub-account housekeeping the cloud session genuinely cannot do: "branch deletion returns a real 403 (confirmed nothing was touched), repo archiving has no corresponding tool at all."

### 2026-08-06, 07:48 UTC — the desktop/TV hero gap root-caused (Pending Item 7)

**`af230cd`** — Jeff asked for a full phone/iPad/web/TV render pass. The long-standing desktop hero gap's real root cause: `.house-hero`/`.sec-hero*` used `height:auto + aspect-ratio + max-height` with no explicit width, so once aspect-ratio-driven height exceeded max-height, "the browser shrank the WIDTH to satisfy both constraints instead of just cropping more of the image." Fix: one rule, `width:100%` on all 7 hero classes. Verified by a 5-viewport Playwright sweep (390/768/1024/1440/1920). hcc-v15→v16. (This same ambiguous CSS combination returns on 08-11 in `86b47e6` as a Safari-vs-Chromium divergence.)

### 2026-08-06, 08:49–09:13 UTC — GPM calibration from real measured water

**`4252086` (03:49 -0500) — "Irrigation GPM calibration: real measured data for zones 1/2/5."** The coworker ran isolated single-zone tests with nothing else running, "timed precisely via HA switch timestamps, measured real gallons via water meter before/after deltas once batches caught up," and cross-checked against Hunter's official MP Rotator spec sheet using the real head count/arc config Jeff confirmed — "not the wrong counts/nozzle model the old code assumed." Zones 1 and 2 matched spec within ~10%; zone 5 ran higher. Recommendation: `IRR_FLOW={1:8.78, 2:10.09, 5:4.4}` replacing `{1:17.2, 2:14.3, 5:5.7}` — "a 23-49% cut depending on zone, meaning the tracked sewer-overcharge total has likely been significantly overstated."

**`0827617` (09:06 UTC)** applied it, with the honest caveat "logged in CLAUDE.md per the coworker's explicit ask: this means the tracked 'Total sewer overcharge' running total has likely been overstated for any already-closed billing cycle. irrGalFromHistory() self-corrects automatically going forward; past cycles are not retroactively fixed (no HA history exists to recompute them)." hcc-v17→v18. **`7cccc59` (09:13 UTC)** recorded Jeff's clarification that closes the scope question: zones 1/2/5 are the front yard and "the ones that actually get watered regularly. The back yard (3/4/6) is rarely watered except in severe drought, so leaving those uncalibrated is fine -- not an oversight to chase."

### 2026-08-06, 09:24–10:52 UTC — glassmorphism, attempt one: build-up, collision, full revert

This is the ugliest UI fight of the window, and the record keeps all of it.

The build-up: **`3ff1eec` (09:24 UTC)** — Jeff asked for the utility stat chips to "read as part of the photo rather than a bordered box sitting on top, plus bigger where there's room" (border alpha .28→.14, blur 3→4px, type up ~7-10%; hcc-v18→v19). **`42ff38d` (09:33 UTC)** aligned the LUX fireplace panel to the same glass recipe so HOME's neighbours stopped reading "as different UI kits side by side." **`4464d87` (09:38 UTC)** added a researched bevel ("Researched glassmorphism technique rather than guessing"), deliberately avoiding `mix-blend-mode` because "it drops backdrop-filter's blur when combined." **`468e6a1` (09:54 UTC)** — Jeff supplied a real two-document "Luxury Dashboard UI Glassmorphism" reference, and the whole framework was applied (soften photo, frosted glass, gradient-ring border via mask-composite, warm ambient shadow, warm off-white type) and canonized as a "Luxury Glass Overlay Gold Standard" in CLAUDE.md. **`d6514f6` (10:18 UTC)** — Jeff asked directly whether everything in the framework was actually applied; an honest audit of the 12 numbered techniques found "8 were done, 4 were real gaps" (contrast levels, button hover/press feedback, edge fades, subtle tilt), all fixed. **`f4290d7` (10:28 UTC)** — Jeff's feedback: "not a subset of the recipe on the big panels only, every ingredient on every glass element, like a full recipe" — applied to every button/badge/pill, plus his second ask to rebalance blur between photo and glass. **`53f697f` (10:38 UTC)** — Jeff reported the chips colliding with things in the pictures; the cause was found to be Gas and Electric's *baked-in decorative icon+label rows* sitting exactly where the chips land, patched with a darker scoped gradient.

Then the collapse. **`2bf50db` (10:47 UTC) — "Revert Luxury Glass Overlay redesign back to original photos."**

> Jeff's real live screenshots showed the redesign wasn't working: on Water/Gas/Electric, each photo's own baked-in decorative icon-label row was colliding with/bleeding through the stat chips, worse than before. My own testing had used short placeholder values that never surfaced this. Two attempts to fix the darkening still weren't right when Jeff asked to stop and revert.

Everything went back to commit `7cccc59`, "the state immediately before this redesign started - full original plain-photo look restored." Two structural lessons stand recorded: testing with short placeholder values hides real-data overflow, and the photos themselves were the enemy (fully understood a few hours later). **`7b5ee1d` (10:52 UTC)** — separately, Jeff asked for the single-cycle "Sewer overcharge" note box removed from the Water card; removed surgically, leaving the Billing History table, the "Total sewer overcharge tracked" running total, and the underlying tracking "alone - a separate feature Jeff didn't ask to remove."

### 2026-08-06, 12:20–12:29 UTC — LUX login: stop wiping credentials, use the refresh token

**`34c90ac` (12:20 UTC)** — the 08-04 KV-token-caching fix for "LUX requires login every time" was real but Jeff reported the symptom persisting. A second bug: `climate.js` classified any 400/401 substring from the B2C SelfAsserted step as `login_failed`, and `loadClimate()` wiped saved credentials on ANY `login_failed` — including transient hiccups during automatic background refresh. Now only a *manual* login failure wipes credentials. **`1707cf4` (12:29 UTC)** — the deeper fix, prompted by Jeff himself:

> Jeff's question cut right to it: "does it need a token? All the other things stay logged in."

The OAuth scope already requested `offline_access`, but the code "only cached the short-lived access token and threw the refresh token away." Now the order is: valid cached access token → one-request refresh-token exchange → full login only as last resort. Verified across four mocked paths including "refresh failure falling back to exactly one login (not a loop)."

### 2026-08-06, 12:32–15:00 UTC — glassmorphism, attempt two, from the coworker's PC — and the real root cause: the photos were fake

**`30d1df3` (07:32 -0500) — "Luxury Glass Overlay: rebuild LUX + utility photo overlays."** The second attempt succeeded because it was "measured and verified against the real deployed app with real live data at a true 390px phone viewport -- the thing the first attempt could not do." The root cause of "the overlays are all jacked up and don't even fit in the pictures" was *measured, not assumed*: ragged flex-wrapped chips let each photo's printed icon strip show through the gaps between them (chip block at 71.1%/85.2%/66.6% of photo height vs printed strips at 67–88% — "a direct overlap on all three"), and the LUX panel's hard `height:48.3%` overflowed its own content at phone width. Fixes: shared `--glass-*` tokens in fixed light-on-dark ("theme-relative tokens would reintroduce Pending Item 17's bug class"), one frosted slab per card with a real grid, units on their own line so "a long real reading ('19,334.7 gal') can never widen a cell past its column. That is exactly the failure the first attempt missed by testing with short '--' placeholders." Two deliberate deviations from Jeff's reference docs are recorded: the guide's blur(2px) on the host photo was "applied, shown to Jeff, and pulled on his call ('not so much blur in the picture')," and guide item 10 (perspective tilt) skipped — "tilted overlays were part of what made the first attempt look wrong." Verified with real live data (real ha_token/LUX creds, real long values), geometry-checked at six widths. Honest gap: "Not run: lint-app.js / smoke-test.js -- Node is not installed on this PC." hcc-v27→v28.

**`3b080a9` (07:34 -0500)** — two of Jeff's live calls at real phone width, quoted verbatim in the commit: "make the box go all the way down to the bottom of the picture or center it so there is not all that dead space" (→ panel runs top:3%/bottom:3% with space-between) and "maybe a little bigger" (→ every LUX type/control up ~20%). **`67ba0b5`** corrected CLAUDE.md to the shipped values; **`a6b35dc`** bumped the service worker to hcc-v29 because the cloud session's refresh-token work and this glass work both landed on v28 — "whichever deployed second would have been served from the other's cache. v29 covers both."

**`6bd7217` (08:00 -0500) — "Utility cards: rebuild to match the LUX card."** Four changes "all called live by Jeff watching it render at real phone width," his words preserved: "Make the rest of the utilities look like the lux ... two columns and shrink it down so the meter itself shows like you did with the thermostat"; "Those boxes don't need to be near that big"; "Make the boxes translucent like the lux." The 47% panel width is documented as "the load-bearing constant: on all three photos the meter's left edge starts around 48-53% across." The translucency root cause was subtle: the glass values were already identical to LUX's — the panel had moved into the darkest part of the ambient floor-shadow gradient, "so a .20-alpha panel rendered as a solid black box." A width sweep (not eyes) caught Water's panel breaking out of the banner by 7.7px at 320px. hcc-v29→v30.

**`893bd8b` (08:28 -0500) — "Utility readouts: drop the boxes, blur the field, keep the logos."** Jeff, watching live: "do we even need the boxes -- why don't you completely blur out a section right below where the utility logo is and just put the numbers in that blurred area without the individual boxes ... leave the logos." The chip structure was deleted entirely for a single blurred field of the photo itself, placed so "the only thing it covers is the only thing that was never real" — the baked-in marketing copy. Two hand-calibrated constants documented for posterity (46%/4% geometry; per-card `top` values clearing each photo's real logo). Also a toolchain milestone: "Node LTS + Playwright/Chromium are now installed on the coworker's PC, so lint-app.js and smoke-test.js both ran clean from here for the first time," and smoke-test.js was made portable (it had hardcoded the cloud sandbox's `/opt/node22` Playwright path). hcc-v30→v31.

**`45485f0` (09:36 -0500) — "Regenerate the three utility photos without the fake marketing copy."** The pivot of the whole UI arc:

> This is the root-cause fix for every utility-card fight in the history below. Those photos were AI marketing mock-ups: half of each frame was a fake ad -- "WHITE HOUSE UTILITIES COMMAND CENTER", "SMART MEASUREMENT. EVERY DROP COUNTS.", the SAFE SUPPLY / USAGE INSIGHTS icon strips. Every constraint in this area (the 46% width, the per-card hand-calibrated top values, the collisions, the first attempt's full revert) existed only to dodge text that was never real.

All three photos were regenerated through the Gemini image-edit API (gemini-3.1-flash-image) with overlays removed and the real meters/branding kept — at a cost of "~9 cents per image, first try, no retries." The per-card `top` calibration was **deleted**: "There is nothing left to dodge." Per Jeff — "make the box translucent so the background shows through as a blur" — blur radius came DOWN 26px→9px, because "a large radius over the smooth lawn behind these panels averages out to flat dark colour and reads as a solid box, which was the opposite of the ask." Originals recoverable from git history; full-res 2528×1696 versions in `iCloudDrive\HCC-Photos\`. hcc-v31→v32.

**`384c07d` (09:50 -0500)** — Jeff: "you can make all that shit that was underneath the pictures before all fit on the picture now." Name, LIVE/WAITING chip and status line moved onto the photo; only the real tables stay below. Two bugs the width sweep caught: the chip clipping "Natural Gas" to 35px at 320/375px, and — the memorable one — "An earlier edit left comment prose outside its /* */ block, which silently killed the whole .util-overlay-bottom rule and made all three readouts vanish off the photos. Caught because the parsed CSS rule count dropped -- worth checking first whenever a rule mysteriously stops applying." hcc-v32→v33.

### 2026-08-06, 16:19–17:48 UTC — the fake-photo purge across the app; Jeff put back in his own photos

**`ecf6f25` (11:19 -0500) — "Strip the fake marketing overlays from five section heroes."** Jeff: "I hate those logos that are on the picture. I don't mind the text but it looks awful with them right next to the real icons." The irrigation, yard, guardian, weather and car heroes were all AI marketing mock-ups with fake titles/taglines/icon strips baked in; all regenerated via Gemini with the real scenes kept (the red Toro TimeMaster, the lit brick house, the Ambient Weather station, the GLE cockpit). hero-cameras was flagged as "a full fake mock-up of the app's own UI" needing its own pass. hcc-v33→v34.

**`595ec23` (11:25 -0500) — "Put Jeff back in his own photos; inlay the car controls on the cockpit."** The confession is unusually direct:

> Correcting a real mistake: I stripped the person out of the irrigation and yard heroes assuming they were stock models. They're Jeff. Both regenerated from the pre-edit originals with him kept exactly as he was -- same face, expression, LawnCareLife shirt, watch, thumbs-up pose -- and only the printed title, tagline and fake icon rows removed. Check before removing a person from a personal app's photos.

The same commit inlaid LOCK/UNLOCK/FLASH on the car hero per Jeff ("that would be nice if it could be bigger and some of the controls actually inlay in the picture"), removed those buttons from the Vehicle Status card ("one place, not two"), and flagged the F-250 problem — fixed one minute later in **`e87b730`**: the panel is Mercedes-only, "the 2001 F-250 pre-dates FordPass Connect and has no remote features, so leaving the panel up over the truck photo would offer buttons that cannot do anything." **`db9ffcc` (11:27 -0500)** wrote the lesson into CLAUDE.md as a PROTECTED section — "Learned by getting it wrong" — recording that hero-irr.jpg and hero-yard.jpg contain Jeff himself ("Never remove him"), that `images/zones/` are real photographs of his actual yard ("Don't regenerate them"), that the Blink logo and the 2nd Amendment sticker on hero-cameras must be kept, and the rule: "if a photo has a person or a real place in it, confirm what it is before altering it."

The inlay wave then rolled through every section. **`1171dfa` (11:33 -0500)** — Jeff: "Weather yes add the feels like wind chill all that can go in and if you want to make the pictures bigger so more will fit on them that's great." All eight condition cells moved (not copied — "the ids have to stay unique") onto the weather photo; hero re-cropped 1.53→1.32. **`d860dca` (11:53 -0500)** — Jeff: "that would be awesome if you could put the controls in the screens." Odometer rendered onto the GLE's instrument cluster and range+fuel onto the centre display, hand-calibrated with magenta overlay boxes ("Measured, not guessed"). Buttons deliberately NOT put in the ~62px-wide screens — "the same mistake that got the first LUX photo rejected ('where is the rest of the picture')." `max-height` removed from the car hero entirely because the clamp made `object-fit:cover` shift the readouts off the screens. **`fb8f4ed` (11:56 -0500)** inlaid the irrigation controls on the lawn photo's clear right side — clear "only … because the photo was regenerated earlier today," and "Jeff is still in it, as he should be." **`c60ae05` (12:31 -0500)** put the Guardian's 8 live house checks on the house photo and the yard's hour meter/next-service/ready-to-mow verdict on the mower photo (mirrored, not moved — "the hour meter is the centrepiece of that dashboard and belongs in both places"), and fixed a real reported bug: every `irrIntel*` field was only ever written in `loadIrrigationDirect()`, the B-Hyve-cloud fallback — Jeff's zones come via HA, "so that card had been sitting on '--' permanently -- it never worked on the HA path at all." Next Run deliberately says "Not exposed via Beehive" because "a plausible-looking fake would be worse than an honest blank." **`1eba07f` (12:44 -0500)** replaced hero-cameras — "the worst offender of the lot," a fake mock-up of the app's own interface with six dummy camera tiles — keeping, per Jeff's explicit call, the Blink logo and the PROTECTED BY 2ND AMENDMENT sticker. "That completes the sweep -- every photo in the app is now free of baked-in fake marketing overlays."

### 2026-08-06, 17:41–18:50 UTC — the Mercedes PIN saga: wrong, wrong again, then right

A five-commit detective story with two false conclusions on the record before the truth.

**`473f122` (12:41 -0500) — "CLAUDE.md: correct the Mercedes PIN claim - the options dict was empty."** Jeff worked out from the real Mercedes app that unlock and remote start demand a PIN and suspected HA wasn't supplying it. The session checked `config_entries/get`, saw an empty options dict, and concluded the PIN had never been entered — noting that the app's PIN prompts had been removed on 07-24 on the strength of a CLAUDE.md claim ("stored in mbapi2020 integration options in HA - services auto-use it") whose mechanism was right but whose fact was wrong.

**`e3d6de2` (12:48 -0500) — "Mercedes PIN: real root cause is RIS_PIN_INVALID, not a missing PIN."** Opens with "Corrects the previous commit, which was wrong." HA's config-entry list API simply never returns data or options — "The tell I missed: data came back empty too, which is impossible for a loaded integration running 49 live entities." The options dialog showed the PIN populated. One line of Jeff's live system log gave the real answer: `Car action: ENGINESTART failed. error_code: RIS_PIN_INVALID`. CLAUDE.md gained the rule "that system_log/list should be the FIRST stop for a failing service call -- one log line gave the answer after the API check had misled me."

**`eb0852f` (12:54 -0500)** — Jeff then screenshotted his own Mercedes Me app hitting the real block, quoted in the commit:

> 'Your request to start the engine is unable to initiate because you have reached the limit of remote attempts between manual ignition cycles. Please use your key and manually start your vehicle the next time.'

Mercedes enforces a remote-attempt limit that resets only on a physical key start — and the dialog appeared AFTER the app accepted his PIN, proving the PIN valid. Both readings were recorded pending a decisive test. Preconditions were verified green (fuel 100%, range 524mi, doors locked, windows closed, park brake on, engine off), and the read side confirmed perfect: "HA's car data matches the Mercedes app exactly -- odometer 57,338, range 524, locked."

Alongside: **`e92f4fc` (13:40 -0500)** — Jeff: "The lock and unlock button doesn't even post a message like the flash lights or start engine." Measured at his real 390px width, the inlaid buttons rendered **24px tall** against Apple's 44px tap-target guideline — "He could land FLASH and kept missing LOCK/UNLOCK, which reads as a broken command rather than a missed tap." `min-height:44px` applied to car and irrigation hero buttons alike; "The clamp must not shrink these below 44 again." **`af8a9ec` (13:44 -0500)** fixed two bugs from a screenshot Jeff sent: RANGE REMAINING showed "0 mi" while HA had 524 because the loose keyword matcher picked `sensor.gle_350_eco_score_bonus_range` (0.0) over `sensor.gle_350_range_liquid` (524); and the "Battery (V)" tile showed a bare "1" — actually mbapi2020's condition *code*, now mapped to words (Good/Partly charged/Low/Critical) and relabelled "Starter Battery." "Neither of these would have surfaced from my own testing: both render fine with placeholder data and only go wrong against this specific car's entity list."

**`adcf16c` (13:50 -0500) — "Mercedes remote start CONFIRMED WORKING from the app."** Jeff: "It started." Two blockers had to clear: the key-start to reset Mercedes' attempt counter, and re-entering the PIN **plus a full Home Assistant restart** ("reload_config_entry was NOT sufficient -- mbapi2020 reads the Security PIN only when it initialises"). The diagnostic that cracked it is recorded for next time: `sigpos_start` (flash lights) is the only remote command requiring no PIN — it worked while every PIN-gated command failed, isolating the fault to the PIN in one step. And credit given: "the whole thread started from Jeff noticing the real Mercedes app was prompting for a PIN." These features "have been dead since the 07-24 change that removed the app's PIN prompts on the strength of a CLAUDE.md claim that turned out to be wrong."

### 2026-08-06, 22:35 UTC — stopping the failure-email flood

**`ac99b33` (17:35 -0500)** — the repo's GitHub Actions deploy workflow "has never worked": it called `cloudflare/pages-action@v1` with a `CLOUDFLARE_API_TOKEN` secret that doesn't exist, so every push failed instantly and emailed Jeff — "124 of them in the past week alone, dozens on 08-06 by itself. It was the single largest source of mail in his inbox." Deploys were unaffected (the native Cloudflare Pages Git integration does the real deploying). The trigger was changed from `push` to `workflow_dispatch` rather than deleting the file, "so the job definition stays available if the secret is ever added, but it can never fire automatically again."

**The record is silent for 2026-08-07** — no commits that day.

### 2026-08-08, 01:09–03:53 UTC — smart lighting plan; the garage door Sonoff MINI DRY

**`ac38933` (01:09 UTC)** logged Jeff's Kasa HS220/HS200 smart-lighting plan (bedroom reversed-feed redesign; kitchen/living room/garage switch consolidation) into `docs/lighting/` — and reviewed rather than just filed it: the HS220's 150W-LED rating covers the 108W loads, but the garage's 2-location switch setup had only a single HS200 on the shopping list, which research confirmed "leaves the other switch location non-functional." Logged as Pending Item 19 for Jeff to decide (HS210 3-way kit vs repurposing the extra position) **before ordering** — a flag raised before money was spent. **`f099165`** merged the parallel-session photo/glass work with this (CLAUDE.md conflict).

**`8d53af4` (01:41 UTC) — "Research + write the SONOFF MINI DRY garage door setup plan."** Jeff's part had arrived and he asked for a plan before wiring — and the commit records why care was warranted: "the garage door hardware area already burned trust once on guessed specs, so researched properly against SONOFF's own docs and independent reviews this time." Two real findings: the device needs AC or DC power via separate terminals ("an on-site call, not guessable remotely"), and the Inching momentary-pulse setting — "the whole reason this device works for a garage door" — can only be configured via the eWeLink app, not HA's Matter integration. Also resolved: it appears in HA as a plain **switch** via Matter, not a cover. **`feee336` (01:55 UTC)** answered Jeff's three practical pre-wiring questions with research, not guesses: MyQ connects to the same shared wall-console terminals ("matches the exact red/white wires Jeff already bridge-tested"), so the Sonoff becomes "a third independent trigger on one simple contact circuit, no conflict"; install at the opener, not the wall switch (box-depth concern); power via a basic 2-wire AC cord with a plug, "not a splice into the opener's internal wiring."

**`f84f8d8` (02:11 UTC) — "Log MyQ sale decision, research + recommend a Zigbee position sensor."** Jeff decided to sell both MyQ parts "rather than keep a separate app just for door status." Before he listed them, the session flagged that standard MyQ kits bundle real position-sensing hardware the relay setup doesn't replace, and corrected a stale model-number note (G0402 is the add-on sensor SKU, not the hub). "Jeff's call: sell it anyway, get a sensor visible in the app instead." Recommendation: a Zigbee door/window contact sensor (SONOFF SNZB-04P or Aqara) over a wired reed switch or tilt sensor, fitting the already-planned Zigbee coordinator.

**`a1a65fe` (03:29 UTC)** wired the app side ahead of the hardware: `loadGuardian()`/`loadGarage()` now understand three independent entity shapes — `cover.*garage*` (ratgdo, unchanged), `switch.*garage*` (the actual SONOFF MINI DRY relay, "a momentary Inching-Mode pulse, never treated as door position"), and `binary_sensor.*garage*` (the future Zigbee contact sensor). With no position sensor, the card says "Ready" / "Unknown -- add a door sensor" *rather than a fake state*. `garageSensorIsOpen()` detects the on=closed inversion trap already documented for the Mercedes window sensors. Verified via a 5-scenario mocked Playwright test — "no live HA to test against." **`c997266` (03:53 UTC)** traced the camera fresh-picture flow (already working) and fixed a real bug found on the way: `blinkRefreshAll()` "silently swallowed per-camera trigger failures, so one offline camera still produced a blanket 'Updated' status" — now e.g. "Updated 2/3 - Garage didn't respond."

### 2026-08-08, 02:36–11:24 UTC — overlay scaling, the irrigation-panel placement dance, card consolidation

**`22fd9e1` (02:36 UTC)** fixed all 5 inlaid hero readouts saturating their vw-clamp ceilings around 740–820px, "so it stayed iPad-sized on 1440/1920px screens while the photo kept growing." **`4c3380e` (02:44 UTC)** fixed the Garden zone's missing live photo (the digit-parse of entity_ids can't find a "6" in "Garden" — name-match first) and made zone thumbnails responsive. **`20ca199` (02:48 UTC)** added a Watch Sling chip to Guardian's Quick Actions via `openExternal()` — "real anchor + programmatic click, not window.open -- the latter is a no-op in an installed iOS PWA."

**`5d22cf7` (07:26 UTC)** replaced the hero's four discrete max-height breakpoints with a continuous `clamp(560px, 24.5vw + 371px, 1000px)` because the photo "held completely flat at 560px from ~739px width all the way to 1200px -- a span covering almost every real iPad's landscape width." *This commit becomes the prime suspect in the sideways-iPad regression later the same day.*

Then four rounds of positioning the irrigation hero panel — a compressed record of design-by-live-feedback: **`480afd2` (07:47 UTC)** moved the panel off Jeff ("crouched, thumbs-up") onto the clear bottom strip; **`436ce61` (07:59 UTC)** repositioned per Jeff's follow-up — "good spot would be bottom right" — mapping "his exact position in the photo with a pixel grid rather than guessing," and accepting a few pixels of knee-graze at phone width because "the 44px minimum button height (an accessibility floor from an earlier fix) is the limiting factor and wasn't worth compromising"; **`a3caae3` (10:49 UTC)** went back to a full-width bottom bar per Jeff's next follow-up (which also fixed the knee-graze); **`f70a23f` (10:55 UTC)** added Smart Zones as a third stat cell after Jeff sent a screenshot asking for it; **`c214610` (11:01 UTC)** aligned the panel's sizing with the other hero readouts — Jeff: "bring them more in line with the other[s'] size" — by comparing computed values "directly instead of guessing."

**`28de83e` (11:09 UTC)** merged B-Hyve Intelligence + Lawn Water Need into one card — Jeff: "remove all that from these two sections and combine them" — keeping every element id unchanged so `renderWaterNeed()` needed no changes. **`dcfa39b` (11:16 UTC)** fixed the Mercedes dashboard readout bleeding onto the F-250: `carSwitchVehicle()` hid the LOCK/UNLOCK/FLASH controls but never the cluster/centre-screen readouts, so "the GLE's last-loaded numbers just sat there floating on the truck." **`e988eaa` (11:24 UTC)** dropped the watering-verdict banner — Jeff: "we don't need it" — and fixed "All zones idle" being styled amber (a warning) "even though idle is a fine state," now green like every other everything's-fine banner. **`9c415ab` (19:50 UTC)** added a Braves Vision chip: "Jeff bought the MLB Braves Vision package and wanted a one-tap button to it" (no price recorded), opening braves.tv via the same PWA-safe anchor pattern; the sandbox couldn't load braves.tv itself, "flagged to Jeff to confirm on his device."

### 2026-08-08, 21:35–22:05 UTC — the sideways wall-iPad: a speculative fix shipped and retracted within 30 minutes

**`9da43a5` (21:35 UTC)** — the wall-mounted kiosk iPad rendered sideways. Diagnosis: `.snav-btn` is a horizontal flex row at every breakpoint, so a vertical nav is only possible if the layout viewport is stuck reporting portrait — "a known iOS Guided Access/rotation-lock symptom." A tablet-scoped CSS auto-rotate rule was added, with the honest caveat baked into the commit: "can't verify the exact rotation direction is correct without the real device … a wrong direction is a one-line flip."

**`24136c7` (22:00 UTC)** reverted it 25 minutes later: Jeff confirmed the wall iPad "used to work correctly before today - meaning the 'stuck sideways' issue is a regression, not an inherent iOS/Guided-Access limitation. The auto-rotate transform added earlier today was an explicitly unverified guess … Pulling it back out so it isn't a confound while tracking down the actual regression - per the project's debugging protocol, recent changes are the prime suspect first."

**`bb9d1cf` (22:05 UTC)** followed the timeline to its conclusion. Jeff: "It worked perfectly before the picture edit." That pointed straight at `5d22cf7` — the session's *own* hero max-height clamp() from that morning — which was reverted, with an honesty rare in commit logs:

> Honest gap: I don't yet have a mechanism for how a max-height change on hero photos could cause the whole page's nav bar to render vertically - that's still unexplained - but the timeline is the strongest signal available, and undoing a recent change with an unclear side effect is the correct move regardless of whether the mechanism is understood yet.

**The record is silent for 2026-08-09 and most of 2026-08-10** — no commits until 20:24 UTC on 08-10.

### 2026-08-10, 20:24–22:16 UTC — the mower sensor marathon: heartbeat erasure, real history, the yard map rebuilt three times over

Thirteen commits in under two hours, all cloud-session, all on the mower/GPS subsystem. This is where the hour-meter reckoning begins in earnest — though its final act waits for 08-11.

**`60c5d28` (20:24 UTC) — "Fix mower sensor heartbeat erasing the whole mow's data."** The first of the window's catastrophic-data-loss fixes:

> The server stored exactly one reading and every POST fully overwrote it - including the sensor box's 5-min "parked, engine off" heartbeat, which only carries battery/wifi/temp. So the moment the box sent its first heartbeat after being parked to charge, the entire mow's real telemetry (hours, RPM, distance, GPS track) got wiped and replaced by a payload with none of that data. This defeated the whole point of the sensor system - driving the hour meter automatically.

`onRequestPost` now merges heartbeats onto the last stored reading instead of replacing it. (Note for what follows: this fix was correct in principle but, as the coworker proved on 08-11, keyed off fields the box never actually sent — so it never engaged.) The commit honestly queued the missing piece: "Not yet built: a full permanent history of every reading."

**`723eeab` (20:30 UTC) — "Add real mow-to-mow sensor history, not just a preserved snapshot."** "Jeff clarified the actual goal after the heartbeat-merge fix: he wants a permanent, growing record of every completed mow so he can compare RPM/distance/hours mow-to-mow over time." A new `hours_history` KV key (capped at 50 mows) gets a snapshot pushed "the moment a heartbeat follows a real live reading - i.e. the mow just ended"; a new "Mow Sensor History" card in YARD → History computes hours-per-mow as deltas. (Again: the trigger condition — a heartbeat following a live reading — turned out on 08-11 to be *a state that can never occur* on this firmware.) hcc-v60→v61.

**`ee21a1e` (20:36 UTC)** — "Jeff wants every piece of data the sensor box reports, at every point in time, permanently logged and reviewable." A `sensor_log` KV key appends a full-field snapshot on every POST, capped at 5,000 readings ("~250 engine-on hours, years of real mowing") to stay under KV's per-value limit; fetched on demand via `?log=1` so routine syncs stay small; a "Full Sensor Log" card shows all 13 fields. hcc-v61→v62.

**`a2779b5` (20:39 UTC) — "Add permanent rule: check real date/time, never assume."** A discipline failure Jeff caught personally: the session referenced "late at night" and a wrong date "without ever checking, when it was actually mid-afternoon." The sandbox clock was verified genuinely accurate, "so this was never a missing capability." Mandatory Rule 14 added: check real date/time at session start and before any time-of-day reference, always convert to Central Time, label mock dates explicitly as fictional.

**`7adc108` (20:59 UTC) — "Rebuild yard map: fix the real explode bug + cumulative coverage."** Two real bugs. First, why the track "sprayed across the road and house": the old "Pin Track to Photo" derived rotation AND scale from only the first and last GPS points — and "When a mow ends near where it started - the normal case, you finish back at the garage - that GPS delta is near-zero, so dividing the tapped pixel delta by it produced an enormous scale factor and rendered the track at 10-100x true size. That was a math flaw, not user tap precision." Replaced with an auto-fit from the full data extent "so it cannot explode." Second, the cumulative coverage map was born: `S.sensorTrack` was a straight overwrite, "so every mow erased the last one's path"; `mergeYardCoverage()` now merges each mow into a ~1m-grid-deduplicated coverage set with a 40m segment cap "so a GPS dropout can't paint a fake stripe." hcc-v62→v63. *(This commit also plants the seed of the localStorage disaster two hours later — the coverage set went into the S object.)*

**`5a0cea9` (21:08 UTC) — "Move GPS coverage server-side so it records automatically."** Jeff's requirement, verbatim in spirit: "the GPS has to work with no buttons at the start or end of a mow - it should record from first fix to last." The one-hour-old design had a real architectural flaw: `mergeYardCoverage()` ran inside `mowerSync()`, which only fires with the app OPEN — "You can't watch a phone while pushing a mower … Mow twice without opening the app and the first mow was lost. It was also per-device localStorage, so phone and wall iPad built divergent maps." Coverage now accumulates entirely server-side in KV on every POST; the server is "the single source of truth, identical on every device." A pause_tracking command was added (Jeff's suggestion), and a security line drawn: "Deliberately did NOT add a server-side coverage wipe - this endpoint is unauthenticated, so a destructive remote command would be abusable." The commit also created `docs/mower/gps_firmware_handoff_2026-08-10.md` listing four things the cloud session cannot do — including the crucial admission that "the current photo is Fort Worth TX, not Jeff's yard - which is why manual alignment exists at all" — and "capturing a real POST body to confirm field shapes." *(That last unmet need is precisely where the hour-meter bug was hiding.)* hcc-v63→v64.

**`333adcf` (21:14 UTC) — "Log the full raw sensor payload - fix whitelist dropping real data."** "Jeff asked me to confirm every single thing the sensor picks up is being recorded. Checking rather than asserting turned up a real bug." `logEntryFrom()` was a hand-picked whitelist of canonical names, but the firmware uses alternates (battery/battery_v/voltage/…, vibration/vibe/…, wifi_rssi/rssi, etc.): "If the box sent 'voltage' instead of 'battery', the log recorded null and that reading was lost forever. Any field added to the firmware later would have been dropped invisibly." Now the entire raw payload is stored ("Absent fields are now genuinely absent rather than fabricated nulls"), and the UI gained an "Other / raw" column "so new firmware fields can't be invisible." Verified by posting every alternate key plus six invented fields ("fart_detected, methane_ppm, blade_engaged, oil_pressure_psi, deck_height_in, firmware_ver"): all 22 survived. hcc-v64→v65.

**`5959b55` (21:23 UTC) — "Real georeferenced satellite basemap - alignment eliminated."** Jeff asked for a real plot map from the county GIS site; tnmap.tn.gov returned EGRESS_BLOCKED from the sandbox — "But that pointed at a better answer - the app runs in his browser, which has internet, so it can fetch map tiles itself and I never need to download anything." The bundled yard-aerial.jpg "is not his property (it has Fort Worth TX coordinates printed on it; his yard is White House TN), which is the entire reason manual alignment existed." Replaced with live USGS The National Map imagery — "US federal, public domain, no API key and no account, unlike Esri World Imagery which needs a developer signup." Web Mercator makes GPS→pixel exact arithmetic: "the track lands on the real grass by construction, nothing to align." Georeference proof: a point 10m east projects to exactly 41.651px at z19 (0.2401 m/px), matching to 3 decimals. Honest limit: egress-blocked testing used a synthetic tile, "so the maths is proven but USGS imagery quality over White House TN is not." hcc-v65→v66.

**`6d37ff0` (21:30 UTC)** — Jeff asked: is the GPS calibrated for his address, is it true north, do we need another picture. "Verified in code rather than asserting": true north confirmed by construction and proved numerically (10m north = −41.65px up, 10m east = +41.65px right, "equal magnitudes so no skew"), with a north arrow and dual-unit scale bar added "so orientation and scale are self-evident rather than taken on faith." The audit found two real problems: a single garbage GPS fix (0,0 or a stray) "would blow the bounding box up and zoom the map out to the whole country with the yard as a dot" — fixed with a median-based `_rejectOutliers()` "so it can't be skewed by the outliers it's rejecting"; and `_buildSimTrack()` still hardcoded 32.8992N/-97.0338W — Fort Worth — so "tapping Simulate would have yanked the map ~700 miles off his property." hcc-v66→v67.

**`f29e517` (21:45 UTC)** — Jeff's screenshot confirmed real satellite imagery loading over his property, with two flagged problems. Framing: coverage had only just started accumulating (4 cells vs a 95-point track), and "Framing off 4 points gives a wild bounding box, and under 8 points the outlier filter can't engage" — now frames off the union of coverage and current track (verified against a reconstruction of his exact state: "35m across, the yard"). Blur, "and the honest cause": USGS is ~1m/pixel, and a 40m yard on a 320px canvas needs ~0.12m/pixel — "8x more detail than USGS physically has." Display scale was decoupled from tile zoom (with an `upscaled` flag "so the UI admits when it's past native detail") and Esri World Imagery added as a selectable source (15–30cm in US suburbs). The tradeoff was flagged rather than silently picked: "USGS is public domain with no account, Esri is sharper but its free tier asks for a registered developer account. Defaulted to Esri since sharpness was the ask, clearly labelled so it can be switched back." hcc-v67→v68.

**`1d6c109` (21:54 UTC) — "Record: satellite yard map confirmed working on Jeff's real device."** Jeff's screenshot showed real Esri imagery of his actual property with the track, north arrow and scale bar — "his verdict: it looks good." Also recorded: he first sent a screenshot of the OLD cached build, so "force-quitting the PWA or opening the URL in Safari is the reliable way to confirm a deploy landed"; and two honest caveats — coverage read 7 cells from 0 mows because server accumulation only started that day, and "the track wandering over the house is ordinary consumer-GPS drift, not a rendering fault."

**`d3749b9` (22:04 UTC) — "Coverage counts visits, so the map sharpens instead of bloating."** Jeff asked whether drift would improve as history built. The answer, thought through honestly: "no - and the design I'd already shipped would have gotten worse."

> GPS error is random and roughly zero-mean, so averaging repeated passes converges on truth. But mergeCoverage stored a union of cells, which only ever grows. Every drifted stray became a permanent cell, so over many mows the green would bloat outward into a ~5m halo over the house and driveway and never sharpen. His question caught that.

Coverage became a visit-counted map ({cell: count}), deduplicated per reading "so a slow pass counts as one visit rather than fifty - otherwise dwell time would masquerade as confidence." Rendering shades by count (1 visit faint, 3+ solid); the cap now drops least-visited cells rather than oldest — "precisely the strays." Proved with six simulated mows at ±4m drift: confirmed cells 0→156→246→293→316 (69.3%), seen-once falling 297→78 — "it converges rather than bloating." hcc-v68→v69.

**`68f4b7b` (22:16 UTC) — "Add GPS track smoothing and a forgot-to-resume pause safety net."** Smoothing runs server-side BEFORE the coverage merge "so drift makes fewer bogus cells in the first place rather than being cosmetically hidden at render time": spike rejection plus a 1-2-1 weighted average, deliberately kept to a 3-point kernel because "the track is only ~95 points for a whole mow, so a wider window would round off the real corners where the mower turned." The pause safety net addresses Jeff's stated use — "switching tracking off to mow a neighbour's yard, so the failure mode is forgetting to switch it back on and silently losing weeks of mapping": pausing stamps `coverage_paused_at` and the UI escalates from a low-key note to naming the day count and prompting to resume after a day. Testing found a real gap: `paused_since` was missing from the stub GET branches, so on a fresh install "the escalation would never have fired." hcc-v69→v70.

### 2026-08-10, 23:10 UTC — the localStorage blowout: Jeff's hours reset to 5.9

**`b568a4b` — "Fix: coverage map blew out localStorage and reset the hour meter."** The worst user-facing failure of the window, and the commit owns it in the first breath:

> Jeff's hours reset to 5.9 - the factory default baseline - meaning his whole saved state was wiped. Root cause is mine, from earlier today.
>
> The entire S object (hour meter, service log, maintenance history) is persisted as one localStorage blob. When I added the cumulative coverage map I put it in that same object, and syncYardCoverage then wrote the full server coverage map - tens of thousands of cells - into it on every sync. That pushed the blob past the storage quota, save() threw, and the catch silently swallowed it, so hour updates stopped persisting; once the entry was lost the boot path fell back to DEFAULT_STATE and took his real hours with it.
>
> Server-owned, re-downloadable, unbounded data does not belong in the user's core state blob.

The three-part fix: coverage moved out of S into module-scope memory (server-authoritative, re-fetched every sync, "so it never needed persisting"); a load-time migration strips the legacy fields from bloated saved state; and a tiny separate `toro21200_core` mirror key (hours, baseline, lastSensorHours) written on load and every save, with boot recovering hours from it when it's higher than what loaded. "save() no longer swallows failure silently." Verified by seeding a bloated legacy state (3,294 cells): blob shrank to 356 bytes, hours preserved at 12.1 — "then deleted the main blob entirely and reloaded, and hours came back 12.1 rather than 5.9." hcc-v70→v71.

### 2026-08-11, 00:23–02:55 UTC — auditing out the next time bomb; heads in frame; the contrast class closed

**`86b47e6` (00:23 UTC) — "Audit out the next storage time bomb; deterministic hero sizing."** Jeff asked directly "to make sure nothing else was waiting to blow up like the coverage/hours bug." The audit found "the same bug class one layer down": service photos stored inline in `S.log` as base64 data URLs, ~80–200KB each in an unbounded log — "20-30 logged photos would have blown the same quota and wiped the hour meter again." Photos moved to per-entry keys with only a photoId in the log, plus a migration (seeded legacy state with two 150KB inline photos: ~300KB → 545 bytes). Checked and clean: guarded JSON.parse everywhere, self-pruning alerts, bounded histories. Hardened anyway: the five credential/token writes now go through `safeSetItem` ("a silent failure there is the 'LUX won't stay logged in' class"), and three unguarded `x.hrs.toFixed` calls were guarded — "one malformed log entry would have thrown and taken out the whole dashboard." The same commit finally resolved the iPad-landscape hero mystery from 08-08: Chromium measured full-width everywhere, "so this is a Safari divergence" — the ambiguous `aspect-ratio + height:auto + max-height` combination that engines resolve differently. "Fixed by removing the ambiguity rather than guessing at a workaround": explicit height with `aspect-ratio:auto` at ≥768px. A self-inflicted mid-fix regression was caught and recorded too (irr/car also carry `.sec-hero` and got squashed 796→560 before being restored). hcc-v71→v72.

**`e5d57f4` (02:17 UTC) — "Keep Jeff's head in frame on the yard hero."** The explicit-height fix made `object-fit:cover` crop vertically in iPad landscape, and the yard hero's `center center` crop "takes the top of his head" — "his hair starts at image row ~22 of 851." Three candidates measured across six widths: "`center center` cut 94px into his head at 1194 (145px at 2560), `center 12%` still cut at 1194+, and only `center top` cleared him with the full 22px of headroom at every width." What gets trimmed instead is the bottom of the mower deck, "which the readout panel already covers."

**`af6df04` (02:55 UTC) — "Close the light-mode contrast bug class (pending item 17)."** A full diagnostic sweep (33/33 suites; the two reds were stale tests asserting elements deliberately deleted on 08-08, made null-safe). Pending Item 17 "was real, not cosmetic": 43 sites assigned dark-mode hexes via `.style.color`; a purpose-built contrast auditor composited every translucent ancestor to compute each element's *real* painted background and found 19 failures on genuinely light surfaces — "worst were the credential save/error messages at 1.09-2.9:1, so 'Wrong password' and 'Save failed - storage full' were effectively invisible in light mode." 36 sites moved to tokens; dark-surface sites kept bright hexes ("which is exactly why each had to be measured instead of bulk-replaced"). Two tokens were themselves darkened for light mode (--warn #b7791f→#96600f, --ok #15803d→#137534). Three components needed root-cause fixes (dark translucent panels on surfaces that turn white in light mode), including `#mapAlignPad` whose inline-style background "beats any selector, so the first override silently did nothing." The button audit initially reported six false failures (it read backgroundColor and missed linear-gradients) — made gradient-aware, surfacing one real 2.34:1 failure. Final state: 0 contrast failures in both themes.

### 2026-08-11, 18:19–23:57 UTC — THE HOUR-METER RECKONING

Late on 08-11 the coworker session — with the actual hardware on the bench, the real serial log, and Jeff's PC — delivered the discovery this whole record had been building toward.

**`6913393` (13:19 -0500) — "Mower sensor: fix the hour meter at the source; clean the zone photos."** Marked "COWORKER SESSION — firmware + assets + handoff docs. No app code touched." The core finding, verbatim:

> - The engine hour meter has NEVER been fed by the sensor. The box sent `hours_seconds`; the app reads `d.hours`; nothing converted. 5.53 h of real runtime was stranded on the box. Now sends `hours` — verified live as 5.525.
> - Now sends `source`, `engine_running`, `mow_ended` and a real boolean `has_fix`, and omits lat/lon entirely when there is no fix. The 08-08 heartbeat-merge fix keyed off fields the box never sent, so it never engaged and `hours_history` is still empty despite 6.3 km of mowing.

(The body says "08-08" for the heartbeat-merge fix; the fix itself is `60c5d28`, committed 08-10 — **INFERRED:** the date in the body is a slip, or refers to when the work was scoped; the mechanism described matches `60c5d28`/`723eeab` exactly.) The rewritten firmware — living at that point in `Documents\Arduino\mower_hours_esp32\` on Jeff's PC, *not in the repo* — was flashed and verified on real hardware. It also completed TASK 1 (GPS records on any fix rather than only while the engine runs, gated on 3m of real movement "so parked drift isn't logged as mowing") and TASK 2 (store-and-forward buffering in RTC memory, "Proven with real WiFi failures — 3 readings survived 3 timeouts and 3 deep sleeps, then flushed oldest-first with correct ages (90/60/30 s)"). Per-mow RPM/distance are now held until the next mow starts instead of being zeroed on upload — "(Jeff's request)" — so a parked box shows its last real readings rather than blanking to "—". The same commit re-cropped all six zone photos square, removing fake gold frames and "ZONE N" badges — "CROPPED, NOT REGENERATED — none of the real yard was altered, per the protected photo rule" — cutting 3.3MB→976KB, and shipped `docs/mower/CLOUD_SESSION_TASKS_2026-08-11.md` (10 items) plus a findings doc "carrying the evidence."

That task brief (`docs/mower/CLOUD_SESSION_TASKS_2026-08-11.md`, added in `6913393`) contains the sentence that reframes everything built on 08-10: "**Critical behaviour you must know:** the box **only uploads while PARKED**, every 300 s. It does **not** post during a mow (WiFi is off then). So 'a heartbeat followed a live reading' is a state that can never occur — which is why several things below never fired." It also documents item 6, **the KV read-modify-write race** — "found by live test … discovered 2026-08-11 while bench-testing the buffer flush":

> Cloudflare KV is eventually consistent, so POSTs arriving close together read the same prior state and **clobber each other**.
>
> **Measured, not theorised.** A flush sent 4 POSTs ~1.3 s apart. The serial log shows all four returned **HTTP 200** … But `?log=1` afterwards contains only **two** `source:"buffered"` entries — `age_s` 90 and 60. **The 30 s one was accepted and silently lost.**

The doc flags that `yard_coverage` uses the same pattern ("a real weak-WiFi flush will silently drop GPS points out of the yard map — the exact data the buffering was built to protect"), notes the firmware's 2s `FLUSH_GAP_MS` mitigation "narrows the window; it does not close it," and proposes real fixes (batch POSTs, or a Durable Object). Within this window the race is documented and mitigated but not yet closed — **the record within this window shows no commit landing the batch/Durable-Object fix.**

**`d18db7b` (13:51 -0500) — "hours.js: make the mow history actually record, and stop mapping parked drift."** Opens with an ownership decision recorded for good:

> Per Jeff's decision 2026-08-11 the mower/sensor subsystem — firmware, hours.js, and the sensor-facing parts of index.html — is now owned end to end by the coworker, because every verification here needs the live endpoint, the LAN or the hardware, none of which the cloud session can reach. Recorded in CLAUDE.md Rule 13.

Five fixes, each with its evidence:

> - Mow history had NEVER recorded a single mow. The trigger waited for "a heartbeat follows a live reading" and read totals from `prev`, which assumed the box posts during a mow. It does not — it posts only while parked, so that transition cannot occur. It was also gated on `typeof prev.hours === 'number'`, never true because the box sent `hours_seconds`. Now triggers on the firmware's `mow_ended` flag and snapshots from `body` …
> - Coverage was recording the parked mower's GPS drift as mowed yard. The box reports every 5 min while parked, so a standalone lat/lon was injected ~288x a day; the whole map had become a 16.7m x 12.5m blob at the garage, and the visit-count shading rendered that drift as the most confirmed ground on the map.
> - `has_fix` is now checked for truthiness. Old firmware sent the number 0 for "no fix" and 0 !== false is true, so no-fix 0,0 coordinates were merged as real. That genuinely happened — a "0,0" cell (Null Island) is sitting in KV and needs deleting by hand.
> - An empty `track: []` on a heartbeat no longer clobbers the stored track. The box clears its buffer after delivery, so the last mow's path was being blanked ~5 minutes after every mow.
> - Stop serving the device secret. GET is public and echoed the whole stored body, and logEntryFrom() copied it into every log row.

And the structural verdict on how it all happened:

> Also corrected CLAUDE.md's "Sensor / ESP32 Hardware" section, which described a posting cadence the firmware has never had. The server logic above was built on that wrong description — it is the root cause of the months-long hour-meter failure, so it is now marked do-not-restore and carries the verified field contract.

**`662928a` (17:16 -0500) — "Mower: close the coverage leak, and give the box a way to listen."** The parked-drift fix from four hours earlier "only gated the bare lat/lon. It missed the track array, which was never the harmless half": the firmware clears `trkHavePrev` on every successful upload, so the 3m movement gate resets and every parked heartbeat "shipped exactly one track point sitting on the parking spot." "Measured live before the fix: the garage cell gained a visit every five minutes while real grass sat at 1-2. Coverage shades by visit count, so the parking spot was becoming the most confirmed ground on the map." The >1-point exception is deliberate and documented (a real mow's flushed track is dozens of points — "genuine yard"). The same commit added a control channel riding the existing POST response ("this costs no extra radio time"), with commands acked by id "so a box that dies mid-command retries and never applies one twice," config clamped server-side — "vib_threshold in particular, because a bad value there stops the hour meter counting and says nothing, which is the failure that already cost months here" — and command issuance gated behind the family password or a maintenance token "so nothing that CHANGES the hardware is open to whoever finds the URL." A 33-check test suite pins "the regressions that must never come back (0,0 cells, the hour meter, mow history reading from body)."

**`216526f` (18:29 -0500)** added `flush_every_s` and `service_mode` to the config allowlist — both settable on firmware 1.4.0 but rejected by the server as `unknown_key`, "Caught by an actual round-trip against the hardware rather than by reading the code." `flush_every_s` is described as "the exposure window for the EN reset button on the outside of the box: engine seconds already written to flash survive a reset, seconds since do not" (default drops 300→60). `service_mode` is the manual override for the case the tilt gate cannot see — "working on the mower while it sits flat on its wheels."

**`c63142b` (18:34 -0500) — "Mower: a dead sensor must not keep serving its last reading."** Firmware 1.4.0 omits tilt entirely when the MPU doesn't answer, "on the principle that absent is honest while stale looks fine and is a lie. The heartbeat merge then put the old values straight back, which defeated the point completely." Caught "on the bench, not by reading code: a box with no MPU attached was still serving pitch and roll of -35.3 - the classic both-axes-identical value you get from reading an absent I2C device … the staleness was entirely mine." Deliberately NOT applied to lat/lon on `has_fix:false` (a last known position is useful while parked, and coverage reads the raw body so drift "can never reach the yard map") — "Pinned with a test so nobody 'fixes' that asymmetry later." 40 checks green.

**`2335cec` (18:55 -0500) — "Mower: stop the merge asserting per-cycle facts that expired."** Generalises the principle: some fields describe only the cycle that produced them (command acks, last-command outcome, vibration stats that reset per upload). "Caught live: the endpoint was still serving cmd_ack:1 long after command 1 had been acknowledged and retired, because the box correctly stopped sending it and the merge helpfully put it back. If the box did not send it this cycle, it is not current." 45 checks green. **`d9dc37e` (18:56 -0500)** extends it to `age_s` and `mow_ended`: inherited through the merge, "the endpoint was permanently reporting age_s:60 on live readings that never sent it - and would have claimed a mow had just ended forever after the next one."

#### Coda, 32 minutes past the window boundary — `a1cfa53` (2026-08-11 19:31 -0500 = 2026-08-12 00:31 UTC): "Put the mower firmware in the repo, credentials extracted"

Outside this window by half an hour, but it is the closing statement of the incident this section chronicles, so it is quoted here and flagged for the 08-12 archivist:

> This closes the structural root cause of the months-long hour meter miss. The cloud session that owned functions/api/hours.js has no outbound network and could not see the .ino, so it wrote the server half of the contract against CLAUDE.md's prose description of the firmware - and that description was wrong. Nobody could diff the two halves because only one was in the repo. Now both are.

WiFi SSID/password and the device secret moved to a gitignored `secrets.h` (the repo is public), with `secrets.example.h` committed; the build compiled byte-identical (1,111,016 bytes). The README records that this "does NOT make the compiled binary safe - those strings are plaintext inside the .bin," and one more trap: "`strings` is absent on this machine and returns a silent false 'clean'; grep -a is the check that actually works."

### Decisions made or rejected in this period

- **Garbage/Stormwater kept as separate line items, never folded into sewer math** (`330c74a`, 08-06) — because the WHUD/City of WH refund case "needs clean, usage-based-only data." Sanitation Services $24.00, Stormwater $8.99, sewer $92.56, full city total $125.55.
- **Sewer rate constants updated to $23.42 base + $0.01011/gal** (`7eebfd3`) — confirmed as a real ~3% City rate increase, not a calc bug.
- **IRR_FLOW recalibrated from real measured water: {1:17.2, 2:14.3, 5:5.7} → {1:8.78, 2:10.09, 5:4.4}** (`4252086`/`0827617`) — a 23–49% cut; past-cycle overcharge totals accepted as overstated and NOT retroactively fixed ("no HA history exists to recompute them").
- **Zones 3/4/6 left uncalibrated on purpose** (`7cccc59`) — Jeff: the back yard "is rarely watered except in severe drought … not an oversight to chase."
- **Electric "NOW" cell left permanently blank** (`46ab304`) — the fake hour-of-day estimate "removed, not just deprioritized." Bill Due / Last Payment / vs-Last-Year **rejected** as needing a new scraper — "not built, low priority" (`5c41c8d`).
- **Master-the-Master- confirmed as the ONLY live repo; Toro-Timemaster- declared a stale diverged mirror** (`6e24295`) — "flagged permanently in CLAUDE.md so no future session wastes time developing there." Backup-branch deletion and repo archiving handed to the coworker (`2b0cb3d`) because the cloud session gets a real 403.
- **Glassmorphism attempt one fully reverted on Jeff's call** (`2bf50db`) — "Jeff asked to stop and revert" after two failed darkening fixes; restored to `7cccc59`.
- **`mix-blend-mode` rejected** (`4464d87`) — it silently drops backdrop-filter blur. **Perspective tilt (guide item 10) rejected twice** (`30d1df3`) — "tilted overlays were part of what made the first attempt look wrong." **Host-photo blur(2px) applied, shown to Jeff, and pulled on his call** — "not so much blur in the picture."
- **The three utility photos (and five heroes, and hero-cameras) regenerated to remove fake AI marketing copy** (`45485f0`, `ecf6f25`, `1eba07f`) — at ~9 cents per image via Gemini; every hand-calibrated dodge constant deleted afterward because "There is nothing left to dodge."
- **Never remove Jeff from his own photos; never regenerate the real zone photographs** (`db9ffcc`, PROTECTED section) — a never-again rule written after doing exactly that (`595ec23`). "if a photo has a person or a real place in it, confirm what it is before altering it." Honoured on 08-11: zone photos "CROPPED, NOT REGENERATED" (`6913393`).
- **Keep the Blink logo and the 2nd Amendment sticker on hero-cameras** — "per Jeff's explicit call" (`1eba07f`).
- **Cockpit LOCK/UNLOCK/FLASH live in one place only** (`595ec23`) and are **hidden for the F-250** (`e87b730`) — no buttons that cannot do anything. **Controls rejected from the in-photo dashboard screens** (`d860dca`) — 62px-wide targets vs the 44px floor.
- **44px minimum tap-target height, never to be clamped below again** (`e92f4fc`); later treated as the immovable constraint when positioning the irrigation panel (`436ce61`).
- **"Not exposed via Beehive" over an invented Next Run number** (`c60ae05`) — "a plausible-looking fake would be worse than an honest blank." Same philosophy later in `c63142b`: "absent is honest while stale looks fine and is a lie."
- **GitHub Actions deploy workflow disabled (workflow_dispatch), not deleted** (`ac99b33`) — ending 124 failure emails/week.
- **Garage door: SONOFF MINI DRY installed at the opener, powered by a plugged 2-wire AC cord, coexisting with MyQ and the wall button** (`feee336`). **MyQ hardware sold** — flagged first that the kits bundle position sensing the relay doesn't replace; "Jeff's call: sell it anyway, get a sensor visible in the app instead"; Zigbee contact sensor (SONOFF SNZB-04P or Aqara) recommended over reed/tilt (`f84f8d8`). Garage relay **never treated as door position** (`a1a65fe`).
- **Lighting order held pending Pending Item 19** (`ac38933`) — the single-HS200 garage plan would leave one switch location dead; flagged before ordering.
- **Speculative wall-iPad auto-rotate shipped, then withdrawn as policy** (`24136c7`) — an explicitly unverified guess removed "so it isn't a confound"; **revert-by-timeline accepted without a mechanism** (`bb9d1cf`).
- **Mandatory Rule 14: check the real date/time, never assume; always convert to Central** (`a2779b5`).
- **GPS coverage must work with no buttons — server-side accumulation, server as single source of truth** (`5a0cea9`, Jeff's requirement). **Server-side coverage wipe rejected** — "this endpoint is unauthenticated, so a destructive remote command would be abusable."
- **Raw-payload logging over a field whitelist** (`333adcf`) — nothing the box sends may be silently dropped; only `track[]` excluded from the log (size), and it survives elsewhere.
- **USGS chosen first for tiles (public domain, no account); Esri added and made default when sharpness was the ask** (`5959b55`, `f29e517`) — tradeoff "flagged … rather than silently picking."
- **Coverage as visit counts, not a union; cap drops least-visited, not oldest** (`d3749b9`) — so the map converges instead of bloating.
- **3-point smoothing kernel on purpose** (`68f4b7b`) — wider "would round off the real corners where the mower turned."
- **"Server-owned, re-downloadable, unbounded data does not belong in the user's core state blob"** (`b568a4b`) — the rule written in the blood of the 5.9-hours reset; extended by audit to service photos (`86b47e6`).
- **Coworker owns the mower/sensor subsystem end to end — firmware, hours.js, sensor-facing index.html** (Jeff's decision 2026-08-11, `d18db7b`, CLAUDE.md Rule 13) — because every verification needs the live endpoint, the LAN, or the hardware.
- **Per-mow stats held until the next mow starts instead of zeroing on upload** (`6913393`) — Jeff's explicit request.
- **Hardware-changing commands gated behind the family password / maintenance token** (`662928a`); telemetry storage wrapped so "a control-channel fault can never cost a reading."
- **The lat/lon staleness asymmetry kept deliberately and pinned with a test** (`c63142b`) — last known position is useful while parked; "nobody 'fixes' that asymmetry later."
- **CLAUDE.md's wrong sensor-cadence description marked do-not-restore, replaced with the verified field contract** (`d18db7b`).
- (Just past the window, `a1cfa53`:) **firmware moved into the public repo with credentials extracted to gitignored secrets.h** — so the two halves of the contract can finally be diffed.

### Problems, failures & root causes in this period

- **Sewer overcharge total built on the wrong data.** Symptom: the "Total sewer overcharge tracked" running total never matched the best available B-Hyve-derived gallons. Root cause: `irrGalFromHistory()` computed the real number but only displayed it; history was only ever written by the rough schedule-based estimate (`8158128`). Compounded by: the coworker's live check showing zero B-Hyve "on" events in 8 days plus a 10-day recorder retention default, so the fix had never actually fired (`aa6566a`); and IRR_FLOW constants based on wrong head counts/nozzle model, overstating gallons 23–49% (`4252086`→`0827617`). Past closed cycles knowingly left overstated.
- **Electric SmartHub shipped silently non-functional.** Symptom: Today/Yesterday/Peak Hour cells rendered but were fed nothing. Wrong assumption survived mocked tests; real root causes (found only by firing the exact WS command at live HA): wrong command name for HA Core 2026.8.0 (`history/…` vs `recorder/statistics_during_period`) and a `change` field that always reads 0 for this sensor (`fa8e153` → fixed `5c41c8d`). The window's first full rehearsal of the hour-meter pattern: *UI renders ≠ feature works.*
- **The glassmorphism collapse.** Symptom: chips colliding with photo content, "worse than before," live on Jeff's phone while the developer's screenshots looked fine. Wrong attempts: two rounds of darker gradients (`53f697f`), then full revert (`2bf50db`). Real root causes, found by measurement: testing with short placeholder values instead of real long readings; ragged flex-wrap letting baked-in fake print show between chips; and finally the deepest cause — the photos were AI marketing mock-ups, and "every constraint in this area … existed only to dodge text that was never real" (`45485f0`). Fixed by regenerating the photos (~$0.09 each) and deleting the dodge constants.
- **A CSS comment left open silently killed a whole rule** — all three utility readouts vanished; caught only because the parsed rule count dropped (`384c07d`).
- **Jeff stripped out of his own photos.** Wrong assumption: "stock models." Fix: regenerate from pre-edit originals with him intact; permanent PROTECTED rule (`595ec23`, `db9ffcc`).
- **LUX "requires login every time," round two.** Prior 08-04 KV fix insufficient. Root causes: loose 400/401 classification wiping saved credentials on transient auto-refresh errors (`34c90ac`), and the refresh token — already granted via `offline_access` — being thrown away so every cache miss meant a full B2C login (`1707cf4`, prompted by Jeff: "does it need a token? All the other things stay logged in").
- **Mercedes PIN-gated commands dead since 07-24.** Chain of errors: app PIN prompts removed on a CLAUDE.md claim that was wrong (`473f122`); diagnosis #1 wrong — empty options dict was an API artifact, "the tell I missed: data came back empty too" (`e3d6de2`); diagnosis #2 (RIS_PIN_INVALID = wrong stored PIN) superseded by Jeff's screenshot of Mercedes' own remote-attempt limit (`eb0852f`). Resolution required a key start *and* PIN re-entry *and* a full HA restart — `reload_config_entry` is not enough (`adcf16c`). Diagnostic gold preserved: the no-PIN `sigpos_start` command as a one-step fault isolator; `system_log/list` first.
- **"Broken" lock/unlock buttons were 24px tall** (`e92f4fc`) — a missed tap reading as a failed command. **Range Remaining 0 mi** — loose entity keyword match picked `eco_score_bonus_range` over `range_liquid` (`af8a9ec`). **"Battery (V): 1"** — a condition code mislabelled as volts (`af8a9ec`).
- **124 failure emails/week** from a deploy workflow that "has never worked" — missing secret, failed on every push (`ac99b33`).
- **Sideways wall iPad.** Wrong attempt: speculative CSS auto-rotate, admitted unverified, reverted (`9da43a5`→`24136c7`). Timeline (Jeff: "It worked perfectly before the picture edit") fingered the same-day hero clamp() `5d22cf7`; reverted without a mechanism (`bb9d1cf`). Real root cause landed 08-11: the ambiguous `aspect-ratio + height:auto + max-height` combination is a genuine Safari/Chromium divergence — fixed by removing the ambiguity (`86b47e6`), which itself briefly squashed irr/car (caught mid-fix) and then cropped Jeff's head (fixed by measured `center top`, `e5d57f4`).
- **Heartbeat erased the whole mow** — one KV slot, every POST a full overwrite, so the first parked heartbeat wiped hours/RPM/distance/GPS: "This defeated the whole point of the sensor system" (`60c5d28`).
- **The yard map "explode" bug** — scale derived from a near-zero first-to-last GPS delta on any mow ending where it started: 10–100x rendering, "a math flaw, not user tap precision" (`7adc108`).
- **Coverage only recorded if the app was open, per device** — architectural flaw caught one hour after shipping; moved server-side (`5a0cea9`).
- **Whitelist logging dropped real data** — firmware's alternate key names recorded as null, "lost forever" (`333adcf`).
- **The basemap was Fort Worth, Texas** — the bundled aerial wasn't Jeff's property, the entire reason manual alignment existed; plus a hardcoded Fort Worth simulate that would have "yanked the map ~700 miles off his property" once real tiles went live (`5959b55`, `6d37ff0`).
- **Union coverage would bloat forever** — every drifted stray a permanent cell, "a ~5m halo over the house"; caught by Jeff's own question, fixed with visit counts (`d3749b9`).
- **The localStorage blowout — hours reset to 5.9.** Symptom: Jeff's whole saved state wiped to factory defaults. Root cause, owned in the commit ("Root cause is mine, from earlier today"): the unbounded server coverage map written into the single S blob on every sync → quota exceeded → `save()` threw → catch silently swallowed it → boot fell back to DEFAULT_STATE (`b568a4b`). Audit found the identical class one layer down in inline base64 service photos (`86b47e6`).
- **Invisible light-mode text** — "Wrong password" and "Save failed - storage full" at 1.09–2.9:1 contrast; 19 real failures found only by compositing real painted backgrounds; a false-positive button audit corrected along the way (`af6df04`).
- **THE HOUR METER WAS NEVER FED BY THE SENSOR.** Symptom: months of mowing, hour meter never advanced from sensor data; `hours_history` empty "despite 6.3 km of mowing"; 5.53h of real runtime stranded on the box. Wrong attempts along the way: the heartbeat-merge and mow-history triggers (`60c5d28`, `723eeab`) — correct logic keyed to fields (`hours`, `source`, `engine_running`) and a posting cadence (posts during the mow) that the firmware never had, so they could never fire. Immediate root cause: the box sent `hours_seconds`; the app read `d.hours`; "nothing converted" (`6913393`). Systemic root cause: CLAUDE.md's prose description of the firmware was wrong, the server was built against that prose, and — per `a1cfa53`, minutes past this window — "Nobody could diff the two halves because only one was in the repo." Fixes: firmware rewritten and flashed to send `hours`/`source`/`engine_running`/`mow_ended`/real `has_fix` (`6913393`); server retriggered off `mow_ended` and reading from `body` (`d18db7b`); the wrong CLAUDE.md section marked do-not-restore; ownership of the whole subsystem moved to the session that can touch the hardware.
- **Parked drift painted as the most-mowed ground.** ~288 parked posts/day made "a 16.7m x 12.5m blob at the garage … the most confirmed ground on the map" (`d18db7b`); first fix missed the track-array half (the firmware's 3m gate resets after every upload, so each heartbeat ships one parking-spot point) — closed with a measured before/after (`662928a`).
- **Null Island in KV** — old firmware's numeric `has_fix: 0` passed a `!== false` check, merging 0,0 as real coordinates; "a '0,0' cell (Null Island) is sitting in KV and needs deleting by hand" (`d18db7b`).
- **Every mow's track blanked ~5 minutes after the mow** — an empty `track: []` heartbeat clobbering the stored track (`d18db7b`).
- **The device secret served publicly** — GET echoed the whole stored body, and the secret was copied into every log row (`d18db7b`).
- **The heartbeat merge asserting expired facts.** A box with no MPU still "serving pitch and roll of -35.3" (`c63142b`); `cmd_ack:1` served long after retirement (`2335cec`); `age_s:60` reported permanently on live readings, and `mow_ended` "would have claimed a mow had just ended forever after the next one" (`d9dc37e`). Principle now pinned: "If the box did not send it this cycle, it is not current."
- **The KV read-modify-write race — measured, not theorised, and still open at window's end.** 4 buffered POSTs ~1.3s apart, all HTTP 200, one silently lost; `yard_coverage` shares the pattern. Firmware's 2s flush gap "narrows the window; it does not close it." Proposed fixes (batch POST or Durable Object) documented in `docs/mower/CLOUD_SESSION_TASKS_2026-08-11.md` item 6 (`6913393`); no commit in this window lands them.
- **Config round-trip failures found only on hardware** — `flush_every_s`/`service_mode` rejected as `unknown_key` until an actual bench round-trip caught it (`216526f`).


---

## Chronicle: 2026-08-12 → 2026-08-16 — Zigbee, HomeKit, the Inovelli affair, and the MASTER RECORD

**Scope note.** This section covers every commit on `origin/claude/time-master-project-liq1jw` in the UTC window 2026-08-12 00:00 → 2026-08-16 23:59 — 63 commits. Because commits are stamped in Central time (UTC−5), the window opens with four commits stamped the evening of **2026-08-11 (CDT)**, which fall after 2026-08-12 00:00 UTC and are chronicled here. All quotes are verbatim from commit messages or repo docs; sources cited by hash + date or file path. Two sessions did this work: `session_01CWkCE6T3QcFBcjgfRfYwFy` (authored as "Claude Opus 5 (1M context)", every commit from 077cc65 through 5de10eb/c5a6aab/dea7e75 on 08-15) and `session_01MYnCccmRRy4cvmGiVMEwhr` (authored as "Claude Opus 5", from 7a1d250 on 08-15 evening through the final MASTER RECORD commit 1d1ebdb). The session boundary matters: the second session is the one that committed the Inovelli failure, documented it, and built the archive this very document belongs to.

---

### 2026-08-11 evening (UTC 2026-08-12) — mower honesty: fake speed, firmware into the repo, and a third pass at the coverage gate

**`077cc65` (2026-08-11 19:01:57 -0500) — "Mower: GPS Speed was showing an all-time average on a parked mower."** The ESP32 box sends no speed field at all — "confirmed against the live payload, there is nothing named speed or mph anywhere in it." The GPS Speed row therefore always fell through to lifetime distance ÷ lifetime hours, an **average**, displayed under the label "GPS Speed":

> A mower sitting switched off in the garage reported a steady 0.7 mph (3.93 mi over 5.525 h), which is a real number answering a question nobody asked.

Fix: only fall back while the engine is actually running; parked reads "—", consistent with Engine RPM and GPS Distance (This Mow) beside it. The commit also records the *proper* fix for later: the NMEA RMC sentence the firmware already parses carries speed-over-ground in field 7 and is currently discarded — "That is a firmware change, so it waits - and it is a good first payload for OTA once OTA itself is proven." Service worker hcc-v75 → v76.

**`a1cfa53` (19:31:14) — "Put the mower firmware in the repo, credentials extracted."** This is the structural close-out of the project's worst long-running failure (the months-long hour-meter miss, chronicled in the 08-11 section):

> This closes the structural root cause of the months-long hour meter miss. The cloud session that owned functions/api/hours.js has no outbound network and could not see the .ino, so it wrote the server half of the contract against CLAUDE.md's prose description of the firmware - and that description was wrong. Nobody could diff the two halves because only one was in the repo. Now both are.

WiFi SSID, WiFi password and device secret moved to a gitignored `secrets.h` (the repo is public), with `secrets.example.h` as the committed template; the build compiles byte-identical (1,111,016 bytes), proving pure reorganization. Two security notes recorded: putting credentials in `secrets.h` does **not** make the compiled binary safe — "those strings are plaintext inside the .bin, so firmware images still cannot be served from a public URL and OTA needs an authenticated delivery path" — and `strings` is absent on the build machine and "returns a silent false 'clean'; grep -a is the check that actually works."

**`176ec08` (19:32:50) — "CLAUDE.md: firmware is in the repo now, and the box takes commands"** — corrects the Sensor/ESP32 section for firmware 1.4.0 and documents the over-the-air control channel "so the next session knows config can be changed over the air without a reflash."

**`59951a3` (19:38:45) — "Mower: a running engine is not a moving mower."** Third pass at the yard-coverage gate; the message admits "the previous two were both too generous":

> Gating on engine_running treats "the engine is on" as "the mower is travelling" - so idling in the garage for three minutes to calibrate the vibration threshold painted 6 cells across the parking spot. Same corruption as the parked-drift bug, reached by a different route, and warm-ups and maintenance runs would keep doing it.
>
> The honest signal for travel is the breadcrumb track. Firmware only records a point after 3 m of real movement, so a stationary box produces 0 or 1 points and a real mow produces dozens. Coverage now requires 2+ points and ignores engine state entirely. The bare lat/lon is no longer merged under any circumstance - a single position is a snapshot, never evidence of travel.

The commit also adds an authorised `clear_coverage` command, and explains why it deliberately did not exist earlier: "a destructive remote command would have been trivially abusable" while the endpoint was unauthenticated; "It is safe now that changes need a credential, and it beats a Cloudflare dashboard trip every time the map needs resetting." 49 checks green.

**The record is silent for all of 2026-08-12 (CDT)** — no commits between 59951a3 (08-11 19:38) and 950c8d5 (08-13 09:11). **INFERRED:** a day off, or work that produced no commits; the record does not say.

---

### 2026-08-13 morning — the irrigation 401 wild-goose chase (three wrong paths, one empty error string)

**`950c8d5` (09:11:45) — "Irrigation: send the orbit-app-id header Orbit now requires."** `/api/irrigation` started returning HTTP 401 on login. Not the credentials — "the B-Hyve phone app signs in fine on the same account, and the HA integration authenticated successfully against the same account from a different IP on the same day." The difference was one header: the HA side sends `orbit-app-id` and cycles three values; this file sent none. The same list was added in the same order, and — the subtle part — "the SAME id is now carried onto the /devices call - sending it only on /session would have moved the 401 one step later instead of fixing it." Login failures now report what each app id actually returned "rather than a bare 'login failed'", and a 15s timeout was added ("which this had no protection against at all").

**`560e76d` (09:14:41) — "Irrigation: app-supplied credentials now beat stale deployment defaults."** Three minutes later, the *real* root cause:

> 401 "not authorized" turned out to be Orbit's generic bad-login reply - confirmed by getting the identical response from Jeff's own network using deliberately fake credentials, in 0.37s. So it was never an IP block, never the app-id header, and never a changed password: Jeff's B-Hyve phone app signs into the same account fine.
>
> The real problem is precedence. env.BHYVE_* was read FIRST and the query params second, so a deployment variable set once and long since stale silently overrode the correct credentials the app sends on every single request. The good login never got tried.

The order was flipped, and failures now report which credential source was used, "so this can never masquerade as a password problem again."

**`a13df25` (09:41:47) — "bhyve: never log an exception without its type (NOT YET DEPLOYED)."** The post-mortem on why the morning was wasted:

> asyncio.TimeoutError stringifies to an empty string, so f"B-Hyve fetch error: {e}" produced literally "B-Hyve fetch error: " with nothing after it. That dead end sent today's investigation down three wrong paths - changed password, missing orbit-app-id header, datacenter IP block - before the emptiness itself became the clue. Now always includes type(e).__name__.

Also raised the devices-fetch timeout 10s → 30s ("One slow response from a third-party cloud API dropped every zone entity out of HA until the next successful poll, which reads as a broken integration rather than a slow request"). The commit is explicitly flagged **⚠️ NOT DEPLOYED**: Beehive runs its own copy under `/config/custom_components/bhyve/`, the committing machine has no Python for `py_compile`, and "the integration is currently healthy (6 zone entities), so there is no reason to rush an unvalidated Python change onto it."

---

### 2026-08-13 midday — the Zigbee buildout list and the hardware inventory register

**`66e6b0b` (10:48:55) — "Add Zigbee buildout running list"** creates `docs/zigbee/zigbee_buildout_2026-08-13.md`, the founding document of the Zigbee layer. Contents (file at tip): the **Haozee Zigbee 3.0 USB Dongle Plus, $8.92** (TI CC2652P1 + CH340C, +20 dBm PA, external SMA antenna, "Same silicon as the well-regarded SONOFF ZBDongle-P, not a CC2531 clone"); the inbound AliExpress sensor fleet (≈5 water leak sensors at $4.40–$6.19 each, ≈7–8 door/window contacts at $2.79–$9.58 per pack); and the install rule "that matters more than people expect": put the dongle on a USB extension cable away from USB 3.0 ports — "USB 3.0 ports emit strong 2.4 GHz noise and Zigbee sits in that band... This is the single most common self-inflicted Zigbee problem." The commit body flags "the two things that matter before it lands":

> one sensor is the WiFi variant and will not join the mesh, and every inbound device is battery-powered, so there are no routers at all yet.
>
> Also records that the ZHA vs Zigbee2MQTT decision is already made by hardware bought - one leak sensor states it does not support ZHA.

The doc marks this in red: the Gleco Intelligent leak sensor is Z2M-only ("Don't support ZHA/eWelink app"), so **Zigbee2MQTT, not ZHA — settled by hardware already bought** ("That's the right call anyway"), and the Qianhong $5.68 sensor was ordered in the **WiFi variant** by mistake ("Not a disaster for $5.68, but don't count it as part of the Zigbee layer"). The routers warning is the seed of everything that follows this week: "Battery sensors are *end devices*: they sleep, and they do not relay for anything else... **Mains-powered devices are what form the mesh.**"

**`880addb` (11:08:31) — "Add master hardware inventory register (Jeff's standing job 2026-08-13)."** `docs/inventory/HCC_INVENTORY.md` is born, with the standing rule: "Every session that buys, receives, installs, retires or repurposes hardware updates this. Phone copy synced to iCloudDrive." (Note for the Inovelli affair below: this register was created precisely to prevent stale hardware state — and three days later it was itself the stale document.)

**`e90f6c0` (11:23:32) — "Inventory: catalog Jeff's on-hand electrical stock from photos."** From photos: "Two single Kasa HS220s (not the 3-pack the plan assumed), SONOFF MINI Dry, Leviton 3-way, GE paddle, several Lepro 14W downlights, full wiring consumables. One unidentified beige device pending a model number."

**`e057559` (11:32:29) — "Inventory: Jeff's corrections — kitchen is the far mesh point, beige box is the MOES module."** Jeff corrected the session's geometry assumptions, and the plan was reassigned accordingly: "Kasa to living room (mesh-redundant at 12 ft from dongle), Inovelli to kitchen (critical router + dimming test), Leviton dumb 3-way closes the garage at zero dollars, MOES module gets the one load it actually fits - the 12W sink light." The inventory records the standing correction: "**Mesh geometry (Jeff 08-13):** kitchen is the FARTHEST point needing mesh; living room is ~12 ft from the dongle. Router priority is therefore kitchen first — not living room as originally assumed." The MOES module carries its own caveat (researched 08-06): it "needs a MOMENTARY push-button at the wall, not a standard toggle (toggles cause continuous-ramp misbehavior)."

**`aaefae0` (11:50:38) — "Inventory: MoCA set shelved with data — garage WiFi measured adequate."** Decision backed by measurement rather than vibes: "Mean -71.5 dBm over the mower box's last 50 uploads, zero buffered uploads ever. Deploy trigger documented: laggy Matter garage relay." The MoCA adapters stay on the shelf until that trigger fires.

**`f0f5631` (11:57:22) — "Inventory: garage goes smart (Inovelli #2 at man-door as garage router) + two-sensor door position plan."** "3-Way-Dumb mode keeps the kitchen toggle working - no dummy switch. Two contact sensors from inbound stock give CLOSED/OPEN/PARTIAL door state, covering Jeff's hot-day cracked-open venting." (This is the plan Jeff would kill on price — see 08-16.)

**`0e1d3f9` (12:08:14) — "Inventory: ISP confirmed AT&T Fiber, BGW320-500 gateway,"** with a one-line trap-avoidance note aimed at future sessions: "comcast.net is email only - do not infer Xfinity internet from it."

---

### 2026-08-13 afternoon — the network census marathon (21 commits, every mystery run to ground)

**`4dc9336` (12:28:11) — "Network map: full device census from the BGW320 + tonight's gateway changes."** The full body:

> 5 GHz split to Loewen301-5G, 2.4 pinned to ch 1 (Zigbee gets 25), Fire TV fixed at .215. Mower posted at -66 dBm on the new config - IoT fleet confirmed unaffected. Census surfaced real finds: an RE200 extender nobody mentioned, the MyQ hub still online while being sold, a Nest Protect (free Guardian integration), and a half-alive legacy Zmodo camera system.

Note the deliberate spectrum planning: 2.4 GHz WiFi pinned to channel 1 so the future Zigbee mesh gets channel 25 — coordination between the network census and the Zigbee buildout happening in the same afternoon.

What followed was a rapid-fire identification campaign, mostly subject-line commits (bodies quoted where they exist):

- **`082bc94` (13:53) — "RE200 converted to wired AP; extender retirement plan."**
- **`a43adc4` (13:54) — "Network map: third extender identified (D-Link DAP-1520) - retire, no Ethernet port."**
- **`855c33d` (14:06) — "Zmodo hunt complete: last live camera found on the back deck, unplugged."**
- **`b87daee` (14:10) — "Network map: clean census after gateway device-table purge."** Body: "80+ stale entries cleared; 29 live devices labeled. The C20A CO alarm is exonerated - .171 impostor is mains-powered Tuya, still unidentified."
- **`0b85fa3` (14:11) — "Network map: 301Server = the beast, confirmed by its own interface."**
- **`0916096` (14:13) — "Network map: laptops labeled; mower ESP32 positively identified by heartbeat timing."**
- **`655bc60` (14:23) — "Network map: Angela's work PC identified; LAN-1 is the central Cat6 switch, not a TV cluster; Sharky alive."**

Then the great laptop identity farce, preserved here in full because it is a perfect miniature of how identification-by-hostname goes wrong four times before physical verification wins:

- **`902d0dc` (14:25) — "Network map: .173 DellMasterBed is Jeff's Acer laptop, not the B570"** ("Corrects the 08-05 spare-inventory note; the actual B570's location is back to an open question.")
- **`8aeacf0` (14:28) — "Network map: laptops finally straight - JeffsLapTop IS the Acer (Aspire E5-576, AVX-capable), DellMasterBed is the B570 as originally recorded."** ("finally straight" — it wasn't.)
- **`add6f61` (14:33) — "Network map: Angela's laptop located - office, with the printer."**
- **`0957dd7` (14:36) — "Network map: two ESP mysteries solved via MAC-embedded Tuya IDs; .171 lineup down to three."**
- **`7f38015` (14:50) — "Network map: DellMasterBed is literally a Dell - Angela's 2nd office computer (per Angela). B570 back to shelf-spare status."**
- **`793b949` (14:56) — "Network map: .173 is the B570 after all - Windows name inherited from Jeff's old Dell (self-reported hostname, not a gateway ghost)."** Fourth and final answer: the hostname was a lie inherited from a cloned Windows install.

Interleaved, the Tuya-device unmaskings:

- **`8796a9c` (14:51) — "The 'Nest Protect' unmasked: Angela's bed-lamp Tuya socket, proven by unplug test."** The "free Guardian integration" find from `4dc9336` evaporated under physical testing — there is no Nest Protect; a Tuya socket was masquerading under a misleading gateway label. (The unplug test — pull the plug, watch which row dies — became the afternoon's decisive instrument.)
- **`0277477` (14:54) — "Network map: purge stale pre-unmasking rows; endgame section marked SOLVED."**
- **`b781514` (14:56) — "Network map: note Angela's work machines are VPN'd/firewalled - LAN silence is normal."**
- **`e9beb3e` (15:05) — "Network map: Sharky=.231, pump socket=.209 - every Tuya mystery solved; GaragePC offline note (was on retired extender SSID)."** The census endgame: every unknown device on the LAN identified.

#### The GaragePC side-quest (15:21–16:34)

Retiring the extenders orphaned the GaragePC, and getting back into it became its own three-commit saga: **`d9bd631` (15:21) — "Temporary fix.txt for GaragePC SMB repair (remove after use)"**; **`a43b5a5` (16:10) — "fix.txt v2: admin check, registry fallback, OS report, share listing"**; and the resolution, **`17fc227` (16:34) — "GaragePC fully accessible: account needed its own password (in HCC-secrets), not an SMB protocol issue. Remove temp fix.txt."** The presumed protocol problem was never the problem — the account simply needed its own password. (The temp file was actually deleted later, in `6c90202`.)

#### The Sylvania plugs verdict

- **`2aca121` (16:05) — "Network map: Sylvania plugs are WiFi Tuya (.199/.200/.202/.205) - Echo Dot guess and Bluetooth-only verdict both wrong, corrected."** Two prior wrong theories about these devices retired at once.
- **`2caaebf` (17:32) — "Inventory: Sylvania WiFi plugs are vendor-locked, cannot join HA - replace with Zigbee (settled, do not retry)."** A never-again rule: the four living-room Sylvania plugs run vendor-locked WiFi firmware, cannot be brought into Home Assistant, and the replacement path is Zigbee plugs. The 08-14 Alexa doc adds the epilogue: during the failed Smart Life experiment one plug got reset and showed "Unresponsive" in Alexa; "Jeff re-paired it in the Sylvania app." This settled decision was later escalated into CLAUDE.md's SETTLED DECISIONS section ("do not retry Smart Life").

---

### 2026-08-13 evening — dimmer research, the printable lighting plan, and Jeff's wiring confirmations

**`a5c67a8` (19:40:06) — "Lighting: Zigbee dimmer selection research - Enbrighten 43080 rejected for documented mesh-routing defects, Inovelli Blue selected (dumb-3-way confirmed)."** Creates `docs/lighting/zigbee_dimmer_selection_2026-08-13.md`. The research (still valid in its negative findings, per the later scrap notice):

- **Rejected: Enbrighten Z-Wave 800 toggle dimmer ($39).** "Wrong radio. Z-Wave (908 MHz) cannot talk to the Haozee CC2652P1 Zigbee dongle. Would need a second ~$40 Z-Wave stick + a second ecosystem. Real cost for 2 switches: ~$118 vs $92 Zigbee. Rejected."
- **Rejected: Enbrighten 43080 (Zigbee paddle dimmer).** Looked like the value pick — officially Z2M-supported, neutral required — "**BUT Zigbee2MQTT's own device page carries two explicit warnings:** 'Some Enbrighten devices may cause issues with larger networks. In particular, they may stop relaying messages for child devices.' [and] 'Some Enbrighten devices will not respond to route update requests after a while.' Jeff's stated requirement is that switches EXTEND the mesh (garage needs range help). A switch with documented routing defects fails that requirement outright. **Rejected — this is the whole reason to check before buying.**"
- **SELECTED (at the time): Inovelli Blue 2-1 VZM31-SN (~$46–60).** Zigbee 3.0 mains-powered router, clean Z2M page, "Dumb-3-way CONFIRMED supported... solves the garage 2-location problem (closes the old HS200/HS210 open question)"; neutral required and Jeff has neutrals everywhere; loads ~108 W, far under limits. "Costs more, but it is the only option that satisfies 'must extend the mesh.'" Closing lesson: "**'Zigbee2MQTT supported' ≠ 'good Zigbee citizen.' Check the device page's warnings.**"

That selection would be dead within hours — see the Inovelli affair below — but at commit time it was the plan of record, and the file's own doc-level "selection" survived un-annotated for three days, which is exactly what made the 08-16 blow-up possible.

**`6c90202` (20:23:25) — "Lighting: printable build plan + wiring/mesh diagrams (HTML + PDF); remove temp fix.txt."** Creates `docs/lighting/HCC_Lighting_Plan.html` (448 lines) + PDF — the printable plan Jeff asked for to hang in the workshop, "Rev. Aug 13 2026." Per the later CLAUDE.md pointer (added 08-16, `c05d647`), its thesis is: *"Job 1 · Light Switches → Wi-Fi (Kasa). Job 2 · Mesh Range → Zigbee Plugs. Why not a $46 mesh dimmer: the switch was only being asked to repeat the mesh — a job a $10 plug does better."* Shopping list **~$104 total**: 2 × Kasa HS220 on hand ($0) · 3rd HS220 only if a 3rd room is wanted ($15) · Kasa HS200 for the garage ($15) · Zigbee plug 4-pack ($40 — replaces the vendor-locked Sylvanias AND routes the mesh) · 1 garage plug ($10) · 2 Zigbee contact sensors for garage door CLOSED + FULLY-OPEN ($24) · dongle already owned. This document — produced 16 minutes after a conversation at **2026-08-13 20:07 CDT** in which the session agreed with Jeff that "mesh routers do not have to be light switches" — is the smoking gun of the Inovelli correction on 08-16.

**`29c7a1a` (20:31:56) — "Lighting: first-draft floor plan with device overlay (traced from Sharky LIDAR; guest bed + office unmapped, awaiting Jeff's markup)."** The floor plan was traced from the robot vacuum's LIDAR map — the house drew its own blueprint.

**`c722076` (20:41:22) — "Lighting: fans confirmed separate from all LED circuits - dimmers safe everywhere (Jeff confirmed)."** The doc addition: "**Every ceiling fan is wired independently of the LED circuits.** Bedroom and office fans are pull-chain; the living room fan runs on its own RF remote. No wall switch in the plan controls a fan motor, so **a dimmer is safe on all four LED circuits** — the one real hazard in this project (dimming a fan motor damages it and is a fire risk) does not apply anywhere here. Closed." Future option noted, not planned: an RF bridge could later bring the living-room fan into HA.

**`8b7a69a` (20:48:14) — "Lighting: Jeff pulled dedicated LED circuits + multi-gang boxes - closes neutral and box-fill open items."** Jeff's own physical work, on the record: "**Jeff pulled dedicated LED circuits himself through the attic and installed 2- and 3-gang boxes in every room.** Originally each room had ONE switch serving both the fan and the light; the LEDs now have their own switch on their own home run." This closed two open items at once (neutrals confirmed present because he pulled the wire himself; box fill ample in the new multi-gang boxes), and: "spare gang positions exist in these boxes, so future smart devices drop in WITHOUT another attic trip. Ganged-dimmer heat derating is a real rule but a non-issue here (96-108 W on a 150 W-rated switch)."

---

### 2026-08-14 — Alexa cleanup, single-session mode, and the Apple TV / HomeKit day

**`1f4e791` (00:38:57) — "Beehive: Alexa exposure audit - 9 HA add-ons are voice-controllable (fix first), Tuya duplicates mapped; expose WRITE command absent on 2026.8.1, UI only."** Creates `docs/beehive/alexa_exposure_cleanup_2026-08-14.md`. Jeff had spotted duplicate devices in Alexa; the audit found **67 entities exposed**, with two problems. First, and worst — nine Home Assistant Supervisor add-ons were voice-controllable: `switch.z_wave_js`, `switch.studio_code_server`, `switch.silicon_labs_flasher`, `switch.plex_media_server`, `switch.spotify_connect`, `switch.traccar`, `switch.vlc`, `switch.cec_scanner`, `switch.blink_liveview_proxy`. "'Alexa, turn off Z-Wave JS' would take down the Zigbee/Z-Wave stack; Studio Code Server is how Beehive gets edited. Alexa fuzzy-matches names, so a misheard command can plausibly hit one. **Un-expose all nine.**" Second, every Tuya device appeared twice (HA's copy with a "Socket 1" suffix vs Smart Life's clean-named copy); the doc maps all five pairs and rules "Remove HA's copies, not Smart Life's." Practical constraint recorded: the WebSocket `expose_entity/list` command works but the WRITE command does not exist on HA 2026.8.1 — cleanup had to be clicked through the UI (Settings → Voice assistants → Expose). The cleanup ultimately cut exposure **69 → 33** (recorded in `72e5d56`'s Alexa command card).

**`9dad6a5` (07:09:30) — "Inventory: Zigbee mesh plugs selected (ThirdReality B09KNHWF7L, Z2M-verified clean); SONOFF S40 Lite Zigbee OOS; document the WiFi-lookalike trap and BLE-mode gotcha."** The mesh-router answer that fits the budget: ThirdReality Zigbee plug 4-pack (ASIN B09KNHWF7L, ~$50 per the later CLAUDE.md entry; Z2M page `3RSP019BZ` verified clean — the Enbrighten lesson applied to plugs). The inventory records the quantity logic: "Quantity needed: 5 — four to replace the vendor-locked Sylvania living-room plugs, one for the garage as the relay to the door sensors." Two purchase traps documented so nobody repeats them: near-identical WiFi lookalike listings, and a BLE-pairing-mode gotcha ("Out of the box it looks dead to the coordinator" — find the button sequence first).

**`b524553` (08:06:28) — "Inventory: 8/14 order logged."** The order, **~$33.83** total, arriving 4–8 AM Friday 8/15: **Orbit 57280 3/4" FPT L-Series auto valve, $13.58** ("MASTER VALVE — the reason today's valve work slipped"; installs between the red winterization ball valve and the manifold, wires to PUMP + COMMON); **Kasa HS220 dimmer, Amazon Resale, USED-Mint, $13.86** ("Kasa switch count now 3... bedroom, kitchen/dining, living room all covered"); Leviton 3-gang Decora/GFCI plate, $1.82; Leviton F-connector Decora insert, $4.57. Standing warning on the used switch: "Before install: FACTORY RESET it (hold the button ~10 s until the LED blinks amber/green) so it is not still bound to the previous owner's TP-Link account, THEN disable auto-firmware-update, THEN pair. A used smart switch that is still claimed will silently refuse to pair."

**`46c7450` (08:57:39) — "CLAUDE.md: single-session mode - beast/coworker session now owns app code too (Jeff's call 08-14)."** A governance turning point, with Jeff quoted in the CLAUDE.md diff:

> **⚠️ SINGLE-SESSION MODE — Jeff's decision 2026-08-14.** Jeff has stopped using the cloud session ("I only work with you, I'm done with code after the last debacle"). **The beast/coworker session now owns EVERYTHING, app code included** — index.html, functions/, commits, pushes. The split below existed only to stop two Claudes clobbering the same branch; with one session that risk is gone. Verification moves with it: run the repo test scripts locally AND drive the real deployed app in a real browser here (something the cloud session never could). Do not hand work off to the cloud session or write "ask the coworker" notes — that is now this session.

**INFERRED:** "the last debacle" almost certainly refers to the mower hour-meter miss chronicled at `a1cfa53`/the 08-11 section (the cloud session coding blind against a wrong prose description, Jeff buying replacement hardware for sensors that were fine); the commit itself does not spell out the referent.

#### The Apple TV switchover (research → staging → SOLVED, in one day)

**`c95457a` (09:07:51) — "Beehive: Apple TV switchover research + HomeKit Bridge test rig (jailbreak dead - A15/tvOS18.6; RTSP bridges worse than status quo; HomeKit snapshot route staged for testing)."** Creates `docs/beehive/appletv_switchover_2026-08-14.md`. Why: "Fire TV Stick is slow, needs constant cache clearing / app offloading, and freezes. Jeff wants his Apple TV 4K back as the living-room box. Only 3 HDMI ports (ARC/soundbar, the beast, Fire TV) so it is a straight SWAP — cannot run both." Requirement clarified with Jeff: "NOT live video. A single still image of whatever triggered the motion is fine." Three routes evaluated:

- **Jailbreak — DEAD, do not pursue.** The Apple TV is a 4K gen 3, tvOS 18.6, A15 chip; every jailbreak "depends on the `checkm8` bootrom exploit, which only reaches Apple TV HD and Apple TV 4K gen 1. Apple fixed it in silicon years before gen 3. And no PiPup-equivalent overlay app exists for tvOS anyway — a jailbreak would give a shell, not the feature."
- **Blink RTSP bridges — NOT WORTH IT.** Both candidate projects "fake a stream by looping a still frame from an already-recorded clip"; one documents ~30 s added latency, the other refreshes on a 5-minute cycle, "ON TOP of Blink's existing cloud delay, so popups would get SLOWER. Both are hobby projects (16 commits/11 open issues; 4 stars/10 commits), both want the Blink password in a config file, one warns of server bans from polling."
- **HomeKit snapshot route — PLAUSIBLE, being tested.** HomeKit cameras have separate snapshot and streaming capabilities; and the perfect source already existed: the `camera.*_clipframe` local_file cameras built 08-03 hold "the exact AI-extracted frame that triggered detection." The one unknown, honestly flagged: "**UNPROVEN:** whether tvOS renders its picture-in-picture popup for a snapshot-only camera, or insists on a stream. Nobody online answers this specifically. Must be tested."

A HomeKit Bridge was created, "scoped deliberately narrow" — include mode, domain `camera`, exactly one entity — "(Avoids an Alexa-style flood into the Home app)". The test plan cost nothing: pair the **bedroom** Apple TV first, no HDMI change needed, walk the driveway, watch for a popup. Rollback documented.

**`0e9a2e4` (09:22:58) — "AppleTV doc: annotated-image requirement (red box + confidence) - clipframe is the RAW frame, needs fixed-path copy of the AI output."** Jeff's requirement, added before anyone could call the feature done: what he actually likes about the current popup is that "it fires essentially at the same time as the trigger, and it shows a RED BOX around the detected object with the confidence %." The clipframe staged for HomeKit is the raw frame fed *into* the AI, not the annotated output — shipping it would show the right moment without the box. The doc also preserves a correction about what Jeff's actual complaint is: "Jeff says the popup timing is already good — his complaint is RELIABILITY ('half the time it doesn't come through'), not latency. **Do not 'fix' the timing.**" **`3fd9988` (09:23:28) — "AppleTV doc: restore file paths mangled by shell quoting"** — a one-minute repair of the previous commit's own damage.

**`eba1648` (10:17:07) — "Beehive: alert fatigue fix - garage motion off, new 5-min per-camera cooldown automation; root cause was Blink disarmed (silent total outage since 08-10)."** The day's most important accidental discovery, from `docs/beehive/alert_fatigue_fix_2026-08-14.md`:

> Chasing an Apple TV question revealed that **the entire camera pipeline had been dead since Aug 10 11:16** — zero motion events across all six cameras for 48 h. Root cause was NOT a bug: **Jeff had the Blink system disarmed**, because the notifications never stop.
>
> That is the actual failure loop worth fixing:
> too many alerts -> Jeff disarms -> ALL camera automation silently stops -> no security at all

"A disarmed Blink produces no error anywhere." Fixes applied: (1) garage motion detection turned OFF permanently — Jeff: **"I don't need motion in the garage at all"** — "it is mains-powered so it ran constantly, and it fired 6 times in 7 minutes while he was simply working in there"; (2) a new `hcc_ai_alert_cooldown` automation, carefully engineered — it waits 5 s so the notify/popup automations finish their own mute check first ("avoids a race where the cooldown suppresses the very alert that caused it"), and "Deliberately does NOT extend an existing mute, so sustained activity yields **one alert every 5 minutes** rather than silence — a prowler still generates repeat alerts." Templates were validated against live entities without firing a test alert. Still open at the time: presence-based suppression and per-camera object rules ("driveway VEHICLE at 2 AM matters; back yard PERSON at 8 PM is Angela").

**`05df625` (10:41:22) — "AppleTV: annotated snapshot has a FIXED filename (verified on-box)."** The blocker from `0e9a2e4` dissolved on inspection: the annotated file already has a fixed name — `/config/www/ai_snapshots/codeproject_ai_object_<camera>_clipframe_latest.jpg`, overwritten each detection. "Verified by listing the folder and pulling back_left_clipframe_latest.jpg (467 KB, red box, 'person: 79.7%'). **No copy step needed.**" Also fixed the critical-alert level and camera-name template in hcc.yaml.

**`9426623` (12:00:55) — "SOLVED: Apple TV camera popups - linked_doorbell_sensor is the key (motion alone never interrupts the screen)."** Creates `docs/beehive/appletv_popup_SOLVED_2026-08-14.md`. The key insight, verbatim:

> **`linked_motion_sensor` alone is NOT enough.** Motion earns a phone notification but does NOT interrupt the TV. HomeKit reserves the picture-in-picture screen takeover for **DOORBELL** events ("someone is at your door" is worth pausing a show for; motion is not).
>
> **Fix: point `linked_doorbell_sensor` at the SAME motion sensor.** Motion then "rings the doorbell" and tvOS renders the popup.

The doc records how to see success before testing (the accessory shows TWO services — doorbell icon and motion icon — and Apple starts offering a "Single Press" automation, which only exists for doorbells), the full working YAML, and four traps hit along the way, "do not repeat": (1) creating the bridge in the UI made 13 separate config entries; deleting "the bridge" left 12 orphans "still advertising -> Home app offered a dozen pairing codes"; (2) `ha core reload` loads neither package automations nor YAML homekit — full restart required; (3) each rebuild generates a NEW pairing code, so old codes look "wasted"; (4) cameras with no linked motion sensor show no "Activity Notifications" option at all — "that absence is the diagnostic."

**`18ff039` (12:14:50) — "HomeKit capability research + exposure policy (CarPlay garage door is the standout; never expose add-ons like the Alexa mess)."** Creates `docs/beehive/homekit_capabilities_plan_2026-08-14.md`, opening with "The governing lesson (learned the hard way, on Alexa, today)" and the rule: "**expose to HomeKit ONLY things a human would say out loud or tap on a watch.** Never add-ons, never diagnostic sensors." Division of labour: "**Home Assistant = the brain**... **HomeKit = the Apple-side face.** TV popups, Siri, Apple Watch, CarPlay, lock screen. HomeKit is not a competitor here; it is a display and voice layer over HA's thinking." Ranked wins for this house: (1) **CarPlay garage door — the standout** ("a garage door button on the dashboard automatically as you approach home... the single most useful HomeKit feature available to Jeff," pending the SONOFF MINI-D build); (2) Apple Watch control (both Jeff and Angela have Watches); (3) Siri as a second voice path (Alexa reserves phrases like "fast forward," hence the old "turn on FF the Commercials" workaround; Siri's reserved words differ); (4) local execution on the Apple TV hub; (5) Apple presence as a cross-check. Explicit do-NOT list: HomeKit Secure Video (needs iCloud+ and streaming cameras — "Blink does neither"), duplicating HA's phone notifications ("Otherwise the Alexa double-alert problem returns in a new outfit"), and video clips in HomeKit ("researched, rejected: HA's ffmpeg camera on local MP4 is documented as hanging/freezing. Jeff is happy with stills anyway"). The expose table ends with the standing line: add-ons/diagnostics/meters — "**NEVER** — the Alexa hazard."

**`9a2dc3d` (12:33:19) — "App: Apple TV remote + app launcher - Braves/Sling now open on the Apple TV instead of asking the iPad to install apps it cannot get."** ~143 lines added to `index.html`; service worker bumped. The HCC app itself gained an Apple TV remote and app launcher.

**`f735771` (15:39:07) — "Network map: gateway 2.4GHz to B/G/N for Kasa compatibility, guest SSID disabled (unused)."**

**`09de34b` (17:58:11) — "Lighting: living room HS220 installed and in HA (192.168.1.178)."** First smart switch physically in a wall: `light.livingroom_cans`, "wired by Jeff, dimming verified from HA." The doc entry is candid about the cost: "**Setup took ~2 hours and the network was NEVER the problem.**" (DHCP fine, MAC filtering off, WPA-2, channel 1, SSID visible, band steering off — all verified from inside the gateway during troubleshooting.) The real cause: "**These HS220s ship on NEW firmware** using an encrypted onboarding protocol (server identifies as 'SHIP 2.0', port 80, NOT the legacy port 9999)." Consequences recorded: HA needs TP-Link account credentials to add them (control stays local; the account only authenticates the local session), and direct provisioning over the setup AP is impossible ("all payloads return `error_code 1003`... **Do not waste time on this again**"). Two bonuses: the beast's ASUS USB-AC53 Nano WiFi adapter can be radio-enabled via the WinRT API to join IoT setup APs for diagnostics without disturbing the wired LAN; and "**HA exposes `switch.<device>_auto_update_enabled`** — the firmware auto-update toggle the Kasa app does NOT show. **Turned OFF for this switch. Do the same for every future Kasa device.**"

---

### 2026-08-15 — verification day: the camera-grid leak, the measured pipeline, and Option B

**`72e5d56` (15:14:51) — "Fix camera grid leak + add Apple TV annotated images, Alexa card, backflow layout."** The bug, in the message's own words:

> The AI helper cameras created today for the HomeKit/Apple TV fix (camera.ai_*) were not covered by isUserCamera(), which only excluded _clipframe. That would have rendered 12 tiles instead of 6 — the same class of bug as the 08-03 clipframe leak. Filter now excludes both families; verified against today's real entity list (7 tiles: the 6 Blinks plus the new local Kiyo Pro camera).

Docs added in the same commit: `beehive/homekit_tracker.md` ("living record of all three HomeKit bridges, what is exposed, what is deliberately out, what is blocked. Every new device gets checked against this going forward"); `beehive/alexa_command_card.{html,pdf}` ("every working Alexa phrase after cutting exposure 69 -> 33"); `utilities/backflow_layout.{html,pdf}` ("irrigation backflow layout using the Orbit anti-siphon valve as master valve + AVB in one body"); plus inventory entries for the backflow findings, "the no-vent discovery on the wall valve, and the spare-zone-valve decision." Service worker hcc-v77 → v78.

**`5de10eb` (16:40:08) — "Batch 2026-08-15 evening: mute-key fix, front_right annotated swap, clip archive, watchdogs, Zigbee arrival inventory."** The inventory diff records the Zigbee fleet landing: "**All 7 door/window + all 5 leak sensors + dongle photo-confirmed arrived 2026-08-15. NOT UNBOXED — Jeff's order: nothing gets set up until the camera/alert pipeline is verified.** Setup day, first moves: disable any auto-firmware-update BEFORE first pairing (the Kasa rule); pick the Zigbee channel deliberately around the crowded 2.4 GHz WiFi (census 08-13); dongle on its USB extension cable, away from USB3 ports." Discipline visible: hardware in hand, deliberately left in boxes until verification of the running system finished.

**`c5a6aab` (16:54:38) — "Camera pipeline verification record 2026-08-15 — measured, photographed, per-camera status."** Creates `docs/beehive/camera_pipeline_VERIFIED_2026-08-15.md`, which opens: "**This is the permanent record.** Every claim below is backed by a timestamp from HA's own history API or a photograph of the physical Apple TV screen... **If a future session doubts whether this was ever set up and proven: it was, on this date, as follows.**" The verification rig: "A Razer Kiyo Pro on the beast, aimed at the Apple TV, capturing a frame every ~0.9 s with millisecond filenames, cross-referenced against HA's motion/AI history timestamps." Measured numbers, from real events: motion → AI red-box file written, **8 seconds**; motion → popup visible on the Apple TV, **4.7–6 s** (3 events photographed); detection → phone push + Fire TV popup + cooldown + archive, **≤1 second**; Blink cloud round-trip for contrast, 67 s. Evidence photos (Jeff appears in them, so they are kept out of the public repo, at `iCloudDrive/HCC-Photos/camera-verification-2026-08-15/`) include `annotated_person_94.7pct_doorbell.jpg` and `annotated_cars_93+71pct_driveway.jpg`. Per-camera: doorbell and driveway fully photographed; front-right and back-left mechanism proven; **301 Backyard the one exception** — "chain configured identically, PIR never fired on either walk... Not a config fault — the sensor did not see Jeff's path twice. Fix = aim/sensitivity in the Blink app. Weakest WiFi too (−65 dBm)"; garage motion off by Jeff's choice, camera possibly unplugged.

The doc's "What was fixed to get here" section records three same-day failures worth their own lines:

1. **A self-inflicted feedback loop that morning:** "the HomeKit image swap also repointed the `image_processing` sources, so the AI scanned its own annotated output and detection went dead while every health check read green. Fixed: scanners on `camera.*_clipframe` (clean input), HomeKit on `camera.ai_*` (annotated output). This split is load-bearing — never point the scanners at `ai_*`."
2. **"Mute/cooldown system had NEVER worked."** Two independent bugs: "`camera_key` carried a `_clipframe` suffix so every mute wrote to a nonexistent helper, and a string-truthiness bug made the duration logic meaningless." The 08-14 cooldown automation had been validated in template testing yet had never once successfully muted anything in production. "**First successful mute writes in the system's history: 16:30 (manual test, 5 min) and 16:37–38 (walk...)** — the differentiated behavior working exactly as designed."
3. **Clip archive:** "`blink.save_video` had overwritten one fixed file per camera forever." Every detection now archives to `/config/www/blink_archive/<cam>_<timestamp>.mp4`, pruned to 7 days, mirrored nightly to `D:\HCC-Clip-Archive` on the beast. "First six clips — Jeff's verification walk — archived and mirrored the same minute." Plus watchdogs: pipeline-stall (motion with no scan in 2 min), overnight water check, spring valve reminder.

And the method became doctrine: "**Component checks (bridge loaded, config valid, camera serves an image) said 'healthy' through every one of the day's real failures. Only watching the far end of the pipeline caught them.** This rig is the project's regression test; Jeff's rule."

**`dea7e75` (17:10:29) — "Option B shipped: popups fire on confirmed AI detections via template doorbell sensors."** The doc records the decision and Jeff's reason: "Popups now ride trigger-based template sensors (binary_sensor.ai_doorbell_*) fired by the AI detection event, so the annotated image exists BEFORE the ring and false motion never pops the TV. Verified live: sensor rang instantly on a manual scan, auto_off 8 s clean. **('What good is an old picture?' — Jeff)**."

#### Evening: a new session takes the wheel — audit and the `_headers` lesson

From `7a1d250` the Claude-Session trailer changes to `session_01MYnCccmRRy4cvmGiVMEwhr` — the session that would carry through 08-16.

**`7a1d250` (19:56:12) — "Audit 2026-08-15: security headers, backyard AI threshold finding, doc corrections."** Added X-Content-Type-Options, X-Frame-Options SAMEORIGIN, and Referrer-Policy to `_headers` ("No CSP by design - index.html is one inline script/style block and would need unsafe-inline"). Corrected CLAUDE.md's service-worker version ("said hcc-v10, actually hcc-v78"). And the safety-critical find, Pending Item 0b: "a person at night scores ~25% against a 60% threshold, so the back yard currently cannot report one," with the fix order recorded ("drop vehicle, crop LEFT via roi_x_min, then lower animal/person") and why a `roi_y_min` crop would be wrong. The audit also corrected two of its own findings — "/api/irrigation is a fallback, not dead code, and the failing Actions runs all predate the 08-06 disable" — an audit auditing itself. Gates: lint clean, smoke clean, mower-hours 49/49.

**`37fac0c` (20:02:48) — "_headers: move /* wildcard last, drop leading comment block."** The first attempt's headers never applied: "verified live for 5+ minutes after the deploy landed (CLAUDE.md from the same commit was serving, so the deploy itself was fine). The pre-existing exact-path rule for /service-worker.js WAS being applied... only the new wildcard block was ignored." Retry with documented Cloudflare shape.

**`186025f` (20:09:38) — "_headers: attach security headers to exact paths, drop the /* wildcard."** The retry failed too, and the conclusion was accepted on evidence: "Two deploys proved the /* wildcard is silently ignored on this Pages project... Exact-path rules DO work here... so the headers now hang off / and /index.html instead. That covers the app shell, which is where X-Frame-Options and Referrer-Policy actually matter; static images are not meaningfully exposed by their absence." (This became a hard-won invariant in SESSION_START.md: "Cloudflare Pages `_headers`: exact-path rules work, `/*` is silently ignored.")

---

### 2026-08-16 — the reckoning: a slimmer CLAUDE.md, the Inovelli affair in full, and the MASTER RECORD

This is the day the project's memory problem finally boiled over and got a permanent fix. Seven commits, 07:48 → 09:01, all `session_01MYnCccmRRy4cvmGiVMEwhr`.

**`fab5b30` (07:48:50) — "Restructure CLAUDE.md 260KB -> 58KB; all six cameras to confidence 25."** Two unrelated jobs in one commit. First, context economics: "CLAUDE.md is auto-loaded and occupies context for the whole session; at 260 KB it was crowding out real work. Moved the heavy material out, nothing deleted": `docs/CHANGELOG_ARCHIVE.md` 179 KB ("all 98 entries verbatim; one-line index stays"), `docs/BEEHIVE_REFERENCE.md` 23 KB, `docs/UTILITIES_REFERENCE.md` 11 KB, and a NEW 4 KB `docs/SESSION_START.md` ("read in full at session start"). "Every PROTECTED section (Jeff's Message, The Working Relationship, Mandatory Rules, Debugging Protocol) was asserted byte-identical before writing." New rules 15/16: read SESSION_START.md every session and keep the file small; grep the archive before re-investigating anything. Second, the camera-safety follow-through from the 08-15 audit: "the remaining five cameras go from confidence 60 to 25, matching the backyard fix. At 60 a night-IR person scores ~25% and is silently discarded, so **every camera on the property could miss an intruder after dark**... Config checked valid, HA restarted, all six verified reporting person@25/animal@25."

#### The Inovelli affair

**`007e14e` (07:59:31) — "CLAUDE.md: close stale Pending Item 19 (garage switch) - superseded by Inovelli."** This commit is itself part of the failure — it closed Item 19 (the old HS200-vs-HS210 garage question) on the ground that "the Inovelli Blue 2-1 VZM31-SN supports a 3-Way Dumb configuration." The body already confesses the session's morning misstep: "Leaving it open sent this session down the wrong road - it planned the Zigbee buildout from the 08-13 buildout doc and re-asked questions five later commits had already settled (dimmer selection, neutrals, box fill, garage)." But the "settled" answer it then pointed at — Inovelli — was the very hardware Jeff had already killed. The commit would be reversed 17 minutes later.

**`831db1b` (08:05:36) — "SESSION_START: add the doc index - 52 docs exist, survey before planning."** The immediate institutional response to the morning's stale-planning failure:

> Added because this session planned the Zigbee buildout from ONE doc dated 08-13 and re-asked four questions that later commits had already settled (dimmer selection, neutrals, box fill, garage 2-location). Jeff: "you did not read the archives on what was settled and planned."

The index (in `docs/SESSION_START.md` at tip) maps each area — Zigbee/mesh, Guardian/alarm, cameras/AI, lighting, water/utilities, mower, network — to "the files that must be read before touching it," with the instruction "newest first, because older docs go stale." It also enshrines two standing corrections any session must know before proposing Guardian work: "Jeff wants **tons** of LIFE-SAFETY (smoke/CO/gas/leak/freeze) and LEAN intrusion — key doors and a few motions only, NOT every window. Do not present door sensors as 'the perimeter.'" And: "**Alert fatigue is a security failure, not an annoyance.** Too many alerts → Jeff disarms Blink → every camera automation silently stops → no security at all, with no error anywhere. It already happened once (48 h dead, Aug 10–14)."

**`1572b4a` (08:08:09) — "Record that Inovelli was SCRAPPED on price - it was never written down."** The central commit of the affair:

> Jeff rejected the Inovelli Blue early on (~$60 ea / ~$120 the pair) and the decision never made it into any document. Yesterday's inventory update still said TO BUY: 2, so this session planned the entire Zigbee mesh around them and pitched them back to him. That is a settled decision being re-litigated because the docs disagreed with reality.
>
> Both sources now carry the scrap notice. The Enbrighten rejection research is kept - the documented mesh-routing defects are still valid - but the selection is dead.
>
> Still open and deliberately NOT guessed: the mesh needs mains-powered routers and no budget alternative has been chosen. Next session researches real current products and prices in-session, cheapest-first, leading with the zero-cost option (Kasa HS220 x2 and the MOES module are already on hand).
>
> Standing lesson: a decision made in conversation goes into the doc the SAME session.

The scrap notice written into `docs/lighting/zigbee_dimmer_selection_2026-08-13.md` carries Jeff's words at full volume:

> **Jeff rejected the Inovelli Blue on price and says he did so early on:** *"those were scrapped at the freaking beginning — told you I was not paying $120 for a freaking dimmer switch."* ~$60 each / ~$120 for the pair is over his line, full stop.

The inventory row was struck through the same way: "**🔴 SCRAPPED — DO NOT BUY (Jeff, on price)**... Recorded 2026-08-16 after a session re-proposed them." So the sequence of the re-litigation, reconstructed from the commits: Jeff killed the Inovelli on price shortly after the 08-13 selection (the correction commit places the pivotal conversation at **2026-08-13 20:07 CDT**); nothing was written down; the inventory was updated on 08-15 — *a day after the decision* — still saying "TO BUY: 2"; and on the morning of 08-16 a fresh session read the stale docs and pitched the ~$120 pair back at him. **Rejected twice: once in conversation on ~08-13, once again on 08-16 when re-proposed.**

**`c30b64d` (08:11:53) — "CLAUDE.md: add SETTLED DECISIONS section - the current lighting/mesh plan."** A new PROTECTED section: "**🔒 SETTLED DECISIONS — DO NOT RE-PROPOSE THESE**... Re-pitching any of them wastes his money, his time, and his patience. If a session is about to suggest one of these, it has not done its reading." Its contents, with Jeff verbatim:

> - **❌ Inovelli Blue 2-1 VZM31-SN — SCRAPPED ON PRICE. Never propose again.** Jeff, verbatim: *"I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would rather spend the money on that and have your help than buy $120 worth of dimmers."* **That is the budget philosophy for this whole project — his money goes to the tools that help him build, not to premium hardware where a cheap part does the job.**
> - **✅ KASA dimmers are the plan.** He already owns 2 × HS220. WiFi, no Zigbee routing — accepted trade deliberately.
> - **✅ Mesh expansion comes from cheap Zigbee sensors/plugs, NOT from expensive switches.** [ThirdReality 4-pack `B09KNHWF7L`, ~$50, Z2M page `3RSP019BZ` verified clean]
> - **❌ Enbrighten 43080 — rejected** (Z2M documents that it stops relaying for child devices).
> - **❌ Enbrighten Z-Wave — rejected** (wrong radio; would need a second stick and ecosystem).

Other settled calls listed: Sylvania plugs vendor-locked ("do not retry Smart Life"); the garage HS200-vs-HS210 question "dead; solved by config, not by buying a premium switch" (itself corrected minutes later); Zigbee2MQTT not ZHA; Guardian "LIFE-SAFETY heavy, INTRUSION lean." And the enforcement rule, with Jeff verbatim again:

> **A decision Jeff makes in conversation goes into a file THE SAME SESSION.** Jeff, verbatim: *"you tell me it is all documented and it is not, then the session closes and you come back with some plan that was two weeks ago — this is infuriating."* Writing it down is not optional housekeeping; it is the difference between a project that moves forward and one that loops.

**`c05d647` (08:16:18) — "CORRECTION: the Kasa+plugs plan WAS documented - point everything at it."** Eight minutes later, the session caught *itself* being wrong about the wrongness — one of the most self-aware commits in the whole history:

> I told Jeff twice that the decision to drop the Inovelli dimmers was never written down. That was wrong, and I found the proof in the session transcripts.
>
> On 2026-08-13 20:07 CDT a session agreed with him that mesh routers do not have to be light switches, and 16 minutes later produced docs/lighting/HCC_Lighting_Plan.html - the printable build plan he asked for, Rev. Aug 13 2026. Its thesis is exactly the current plan: Job 1 switches -> WiFi Kasa, Job 2 mesh -> Zigbee plugs, with the line "why not a $46 mesh dimmer: the switch was only being asked to repeat the mesh, a job a $10 plug does better." Shopping list totals ~$104.
>
> Why I missed it: I grepped for "Inovelli", got no hit in that file, and concluded no document existed - when the ABSENCE of that word is what marks the current plan. That trap is now written into CLAUDE.md so the next session searches Kasa/plug/mesh instead.

So the truth of the affair is subtler than "never documented": the Kasa+plugs plan *was* documented, same night as the decision, in the lighting plan (`6c90202`) — but the two *stale* documents (the inventory, updated 08-15 still saying "TO BUY: 2", and the dimmer-selection doc with its un-annotated "SELECTED" verdict) outshouted it, and the grep-for-the-dead-plan trap made the correct document invisible. The commit also reverses its own morning edit: "**Pending Item 19 is NOT closed.** I had written that Inovelli 3-Way Dumb solved the garage two-location problem - but Inovelli is scrapped, so that answer died with it. Per the lighting plan a single HS200 leaves the second position dead, so it is back to Jeff: HS210 matched kit, or single HS200 plus repurposing the kitchen position." The CLAUDE.md diff re-opens Item 19 accordingly and adds the authoritative-document pointer block, ending: "⚠️ **A trap that already cost a whole session:** searching the docs for 'Inovelli' and finding nothing does NOT mean the plan is undocumented — the *absence* of that word is what marks the CURRENT plan. Search for **Kasa / plug / mesh**, and check `docs/lighting/` by date."

#### The MASTER RECORD

**`1d1ebdb` (09:01:50) — "Build the HCC MASTER RECORD - permanent searchable memory of the whole project."** The final commit in this window, and the origin of the archive project this very document belongs to. The body opens with the quote that defines the day:

> Jeff, after a session re-proposed hardware he killed two days earlier: "I can't keep doing this every time the session changes." Decisions were made in conversation and never written to a file, so each new session read stale docs and confidently told him the wrong thing. This makes that impossible.

What was built, "archived to iCloud (never auto-loaded, zero per-turn cost) - 196 files, 124 MB":

- `HCC_DECISIONS_LEDGER.md` — "81 decisions in Jeff's own words - START HERE"
- `HCC_MASTER_RECORD.md` — "6,896 messages verbatim, 37 sessions, 07-14 onward"
- `HCC_GIT_HISTORY.md` — "all 635 commits w/ messages + diffs, back to 2026-05-20"
- `HCC_ACTIONS_LOG.md` — "25,547 tool events"
- `HCC_PLATFORM_STATE.md` — "live GitHub / Cloudflare / HA / loewenhome.com snapshot"
- `HCC_MASTER_INDEX.md` — "session table + topic->dates"
- `VISUALS/` — "187 images incl. historical versions from git objects"
- `REQUEST_TO_CLOUD_SESSION` — "to recover the first 8 weeks the cloud sessions own"

Plus six re-runnable scripts committed to `windows-scripts/` (`hcc_master_record.py`, `hcc_git_history.py`, `hcc_platform_state.py`, `hcc_archive_visuals.py`, `Update-HCCMasterRecord.ps1`, `Search-HCC.ps1`) and a scheduled task, "HCC Master Record Update," rebuilding it daily at 5:45 AM. The generated record's own preamble (in `hcc_master_record.py`) enshrines the quote permanently:

> **Why this file exists.** Jeff, 2026-08-16, after a session re-proposed hardware he had killed two days earlier: *"I can't keep doing this every time the session changes."* Decisions were being made in conversation and never written to a file, so each new session read stale docs and confidently told him the wrong thing. **This is the complete, unedited record so that can never be the excuse again.**
>
> **It lives in iCloud, NOT in the repo and NOT in CLAUDE.md — it must never be auto-loaded.** Search it, quote it, then act. Do not read it end to end.

SESSION_START.md was updated in the same commit to make searching the record **MANDATORY** "before answering any 'we discussed this' question or recommending hardware," and to record the trap one more time: "grepping for the DEAD plan and finding nothing does not mean nothing is documented - the absence of that word was what marked the current plan." (SESSION_START at tip: "**Every word ever said on this project is archived and searchable. There is no longer any excuse for 'that was never documented.'**") Two housekeeping notes close the commit: access credentials live in `C:\Users\jeffl\HCC-secrets\HCC_ACCESS.md`, "outside this repo because this repo is public"; and a flagged **SECURITY** item — "the Weather Underground API key is in CLAUDE.md in this PUBLIC repo. It needs moving out and rotating."

**The window closes here.** SESSION_START.md at tip also carries two working-style rules dated 08-16 that have no dedicated commit in this window ("Don't tunnel" and "Don't hand Jeff a menu" — "He has said repeatedly he wants the work done, not the options explained"), plus an invariant about Studio Code Server ("a selection one character too wide silently broke YAML on 08-16"). **INFERRED:** these were added by post-window commits or arrived within `1d1ebdb`'s SESSION_START edit; the wording of section 4 ("the two rules Jeff added on 08-16") dates the rules themselves to this day regardless.

---

### Decisions made or rejected in this period

1. **Inovelli Blue 2-1 VZM31-SN dimmers — SELECTED then SCRAPPED, never to return.** Selected 08-13 evening (`a5c67a8`) as "the only option that satisfies 'must extend the mesh'"; killed by Jeff on price in conversation ~08-13 20:07 CDT (~$60 each / ~$120 the pair); re-proposed by a doc-misled session 08-16 morning and rejected a second time; scrap notices written 08-16 (`1572b4a`, `c30b64d`). Jeff, verbatim: *"those were scrapped at the freaking beginning — told you I was not paying $120 for a freaking dimmer switch"* and *"I spend $125 for Claude Max and I would rather spend the money on that and have your help than buy $120 worth of dimmers."*
2. **The budget philosophy, made explicit and PROTECTED (`c30b64d`, 08-16):** Jeff's money goes to the tools that help him build (Claude Max, $125/mo), not to premium hardware where a cheap part does the job. "Lead with what he already owns, then cheapest-first, and flag spend clearly."
3. **The current lighting/mesh plan (decided 08-13, authoritative doc `docs/lighting/HCC_Lighting_Plan.html`, re-anchored 08-16 `c05d647`):** Job 1 switches → WiFi Kasa (2 × HS220 on hand, WiFi/no-Zigbee-routing accepted deliberately); Job 2 mesh → cheap Zigbee plugs ("the switch was only being asked to repeat the mesh, a job a $10 plug does better"). Shopping list ~$104 total.
4. **Enbrighten Z-Wave dimmer ($39) — rejected** (`a5c67a8`, 08-13): wrong radio; real 2-switch cost ~$118 vs $92 Zigbee once the second stick is counted.
5. **Enbrighten 43080 Zigbee dimmer — rejected** (`a5c67a8`, 08-13): Z2M's own device page documents it stops relaying for child devices and ignores route updates — fails Jeff's "switches must extend the mesh" requirement. Rejection kept valid even after Inovelli died. Lesson recorded: "'Zigbee2MQTT supported' ≠ 'good Zigbee citizen.'"
6. **Zigbee2MQTT, not ZHA** (`66e6b0b`, 08-13): forced by the Gleco Z2M-only leak sensor already bought; judged the right call anyway.
7. **ThirdReality Zigbee plug 4-pack (B09KNHWF7L, ~$50) selected as the mesh routers** (`9dad6a5`, 08-14; SONOFF S40 Lite Zigbee was out of stock). Quantity 5: four to replace the vendor-locked Sylvanias, one for the garage.
8. **Sylvania WiFi plugs — vendor-locked, cannot join HA; replace with Zigbee. Settled, do not retry** (`2caaebf`, 08-13). Never-again rule after a failed Smart Life experiment that reset one plug.
9. **Mesh geometry per Jeff (`e057559`, 08-13):** kitchen is the FARTHEST point needing mesh, not the living room (which sits ~12 ft from the dongle); the beige box is the MOES module, assigned to the 12 W sink light — the one load it fits (momentary push-button required at the wall).
10. **MoCA adapters shelved with data** (`aaefae0`, 08-13): garage WiFi measured adequate (mean −71.5 dBm over 50 uploads, zero buffered uploads); documented deploy trigger = laggy Matter garage relay.
11. **Extender retirement** (`082bc94`, `a43adc4`, 08-13): RE200 converted to a wired AP; D-Link DAP-1520 retired outright (no Ethernet port).
12. **Garage motion detection OFF permanently** (`eba1648`, 08-14). Jeff: "I don't need motion in the garage at all."
13. **Alert cooldown: one alert per camera per 5 minutes, deliberately non-extending** (`eba1648`, 08-14) — sustained activity keeps alerting; a prowler is never silenced.
14. **Single-session mode** (`46c7450`, 08-14, Jeff's call): the beast/coworker session owns everything including app code. Jeff: "I only work with you, I'm done with code after the last debacle."
15. **Apple TV jailbreak — dead, do not pursue** (`c95457a`, 08-14): A15/tvOS 18.6 is beyond checkm8, and no PiPup equivalent exists for tvOS anyway.
16. **Blink RTSP bridges — rejected** (`c95457a`, 08-14): both candidates add latency (~30 s / 5-min refresh) on top of Blink's cloud delay, are barely-maintained hobby projects, and want the Blink password in a config file.
17. **HomeKit snapshot route — chosen and proven** (`c95457a` → `9426623`, 08-14): `linked_doorbell_sensor` pointed at the motion sensor is what makes tvOS pop up; motion alone never interrupts the screen.
18. **HomeKit exposure policy** (`18ff039`, 08-14): expose only what a human would say out loud or tap on a watch; add-ons/diagnostics/meters NEVER (the Alexa lesson). HA is the brain, HomeKit the Apple-side face. HomeKit Secure Video rejected (Blink can't stream, no iCloud+ requirement wanted); duplicate phone notifications rejected; video clips in HomeKit rejected (ffmpeg-on-MP4 documented as hanging; "Jeff is happy with stills anyway").
19. **Alexa cleanup** (`1f4e791`, 08-14 → `72e5d56`, 08-15): un-expose the nine voice-controllable HA add-ons; remove HA's Tuya duplicates and keep Smart Life's clean-named copies; exposure cut 69 → 33.
20. **8/14 order, ~$33.83** (`b524553`): Orbit 57280 master valve $13.58; third Kasa HS220 (USED-Mint, $13.86 — factory-reset-before-pairing rule recorded); 3-gang plate $1.82; F-connector insert $4.57.
21. **Kasa auto-firmware-update OFF, every device, forever** (`09de34b`, 08-14): via the HA toggle the Kasa app hides. Extended on 08-15 to all Zigbee gear: "disable any auto-firmware-update BEFORE first pairing (the Kasa rule)."
22. **Zigbee arrivals stay boxed until the camera pipeline is verified** (`5de10eb`, 08-15, Jeff's order) — verification before expansion.
23. **Option B for popups** (`dea7e75`, 08-15): popups ride confirmed AI detections via template doorbell sensors, so the annotated image exists before the ring and false motion never pops the TV. Jeff: "What good is an old picture?"
24. **Security headers on exact paths only** (`186025f`, 08-15): two live deploys proved `/*` is silently ignored on this Cloudflare Pages project; no CSP by design (inline script/style would need unsafe-inline).
25. **All six cameras to AI confidence 25** (`fab5b30`, 08-16): at 60, a night-IR person scoring ~25% was silently discarded property-wide.
26. **CLAUDE.md kept small** (`fab5b30`, 08-16): 260 KB → 58 KB, heavy material to `docs/`, new rules to read SESSION_START.md every session and grep the archive before re-investigating.
27. **SETTLED DECISIONS section added, PROTECTED** (`c30b64d`, 08-16), enforcing: "A decision Jeff makes in conversation goes into a file THE SAME SESSION." Jeff: *"you tell me it is all documented and it is not, then the session closes and you come back with some plan that was two weeks ago — this is infuriating."*
28. **Pending Item 19 (garage two-location switching) REOPENED** (`c05d647`, 08-16) — the Inovelli 3-Way-Dumb answer died with the scrap; back to Jeff: HS210 matched kit vs single HS200 + repurpose the kitchen position.
29. **The MASTER RECORD built and scheduled** (`1d1ebdb`, 08-16): full verbatim project memory in iCloud, deliberately never auto-loaded, rebuilt daily at 5:45 AM, with mandatory search-before-answering rules. Jeff: *"I can't keep doing this every time the session changes."*
30. **Guardian doctrine recorded** (`831db1b`, 08-16): TONS of life-safety coverage, LEAN intrusion — "Door sensors are not 'the perimeter.'"

### Problems, failures & root causes in this period

1. **"GPS Speed" on a parked mower.** Symptom: parked mower steadily reporting 0.7 mph. Root cause: no speed field exists in the payload at all; the row fell through to a lifetime average — "a real number answering a question nobody asked." Fix: `077cc65` (fallback only while engine running); proper fix (NMEA RMC field 7) deferred as the first OTA payload.
2. **Coverage map painted by an idling mower.** Third pass at the gate; the first two were "too generous." Idling 3 minutes in the garage painted 6 cells. Root cause: engine-on treated as travelling. Fix: `59951a3` — require 2+ breadcrumb points (firmware only records one after 3 m of real movement), ignore engine state entirely.
3. **The irrigation 401 goose chase.** Symptom: `/api/irrigation` 401 on login. Wrong paths chased: changed password, missing `orbit-app-id` header (`950c8d5` — a real improvement but not the cause), datacenter IP block. Real root cause (`560e76d`): stale `env.BHYVE_*` deployment variables read *before* the app-supplied credentials — "The good login never got tried." Meta-root-cause (`a13df25`): `asyncio.TimeoutError` stringifies to an empty string, so the error log read "B-Hyve fetch error: " with nothing after it — "the emptiness itself became the clue." Never-again fix: always log `type(e).__name__`.
4. **The laptop/Tuya identification farce (08-13 afternoon).** Four successive wrong answers for .173 (`902d0dc` → `8aeacf0` → `7f38015` → `793b949`); a Tuya bed-lamp socket masquerading as a "Nest Protect" (`8796a9c`); Sylvania plugs mis-theorized twice ("Echo Dot guess and Bluetooth-only verdict both wrong," `2aca121`). Root causes: self-reported Windows hostnames inherited from cloned installs, and misleading gateway labels. What actually worked: unplug tests, MAC-embedded Tuya IDs, heartbeat timing.
5. **GaragePC unreachable.** Presumed SMB protocol issue; two rounds of a temp fix.txt (`d9bd631`, `a43b5a5`). Real cause (`17fc227`): the account simply "needed its own password (in HCC-secrets)." Secondary cause of it being offline at all: it was on a retired extender SSID (`e9beb3e`).
6. **The 48-hour silent camera outage (Aug 10–14).** Symptom: none — that's the failure. Discovered by accident while chasing an Apple TV question (`eba1648`): zero motion events across all six cameras since Aug 10 11:16. Root cause was NOT a bug: Jeff had disarmed Blink because "the notifications never stop," and "A disarmed Blink produces no error anywhere." Fix: garage motion off, 5-min cooldown automation, and the doctrine (SESSION_START, `831db1b`): "Alert fatigue is a security failure, not an annoyance."
7. **HS220 onboarding burned ~2 hours on the wrong suspect** (`09de34b`): the network was exhaustively cleared while the real cause was TP-Link's new encrypted "SHIP 2.0" onboarding protocol; direct AP provisioning is impossible (`error_code 1003`) — "Do not waste time on this again."
8. **Camera grid leak, second of its class** (`72e5d56`, 08-15): the new `camera.ai_*` helper entities would have rendered 12 tiles instead of 6 because `isUserCamera()` only excluded `_clipframe` — "the same class of bug as the 08-03 clipframe leak." Fixed and verified against the real entity list.
9. **Self-inflicted AI feedback loop** (camera_pipeline_VERIFIED doc, 08-15 morning): the HomeKit image swap repointed the `image_processing` sources at the annotated output, so the AI scanned its own output and detection went dead "while every health check read green." Fix: scanners on `*_clipframe` (clean input), HomeKit on `ai_*` (annotated output) — "This split is load-bearing."
10. **The mute/cooldown system had NEVER worked** (same doc): two independent bugs — `camera_key` carried a `_clipframe` suffix so every mute wrote to a nonexistent helper, and a string-truthiness bug voided the duration logic. The 08-14 cooldown had passed template validation yet the first successful mute writes in the system's *history* happened 08-15 16:30. Doctrine born from the day: "Component checks... said 'healthy' through every one of the day's real failures. Only watching the far end of the pipeline caught them."
11. **`blink.save_video` overwrote one fixed file per camera forever** — no clip history existed until the 08-15 archive (7-day retention on Beehive, nightly mirror to the beast).
12. **Cloudflare Pages `/*` wildcard silently ignored** (`37fac0c`, `186025f`): two live-verified failed deploys before accepting exact-path rules as the only working shape on this project.
13. **Night-blind cameras** (`7a1d250`, `fab5b30`): a person at night scores ~25% against a 60% confidence threshold — first found on the backyard, then recognized as property-wide: "every camera on the property could miss an intruder after dark." Fixed to 25 on all six, verified after HA restart. Backyard PIR hardware aim/sensitivity remains open (never fired on either verification walk; weakest WiFi at −65 dBm).
14. **THE INOVELLI AFFAIR — the period's defining failure.** Symptom: on 08-16 a session confidently pitched Jeff ~$120 of Inovelli dimmers he had killed on price two days earlier, and separately re-asked four already-settled questions from planning off one stale doc. Contributing causes, each fixed in its own commit: (a) the price-rejection decision, made in conversation ~08-13 20:07, was never annotated into the dimmer-selection doc or inventory — the inventory was even updated on 08-15, a day after the decision, still saying "TO BUY: 2" (`1572b4a`); (b) the session surveyed too few docs before planning — Jeff: "you did not read the archives on what was settled and planned" (`831db1b`); (c) the grep trap — the session searched for "Inovelli," found nothing in the lighting plan, and concluded no document existed, "when the ABSENCE of that word is what marks the current plan" (`c05d647`); (d) the session then compounded it by twice telling Jeff the decision was never written down, which was itself wrong — the Kasa+plugs plan *was* documented in `HCC_Lighting_Plan.html` sixteen minutes after the decision; and (e) an over-eager same-morning edit closed Pending Item 19 on the strength of the dead Inovelli answer and had to be reversed (`007e14e` → `c05d647`). Fixes, escalating: scrap notices in both stale docs; the SETTLED DECISIONS protected section with the same-session-write-down rule (`c30b64d`); the 52-doc index with survey-before-planning (`831db1b`); and finally the MASTER RECORD itself (`1d1ebdb`) — 6,896 verbatim messages, 81 decisions in Jeff's own words, all 635 commits, rebuilt daily — built the same morning, in direct answer to Jeff's *"I can't keep doing this every time the session changes."* The failure and its remedy are, in the end, the reason the document you are reading exists.


---

## The Memory File — every version of CLAUDE.md and every word of Jeff it preserves

`CLAUDE.md` is the project's answer to the problem that nearly killed it: Claude forgetting everything between sessions. It was revised **274 times** on `origin/claude/time-master-project-liq1jw` between 2026-06-23 and 2026-08-16 (evidence: `git log --follow -- CLAUDE.md` on that branch returns 274 commits). This section walks that whole history: how the file was born, every Mandatory Rule as it was added, the PROTECTED mechanism, the Debugging Protocol, the coworker split and its collapse into single-session mode, the memory-hygiene compressions, the SETTLED DECISIONS section, the pick-up-here pointers — and, most importantly, **every verbatim sentence of Jeff's that any revision of the file ever preserved**, including words that were later edited or moved out of the file.

Method note: every claim below is cited to a commit hash + date (verifiable with `git -C <repo> show <hash>:CLAUDE.md`) or to a file path in the 2026-08-16 branch-tip checkout. Anything not directly evidenced is marked **INFERRED:**.

---

### 1. Birth of the file — 2026-06-23, commit `e8f0312`

> Commit subject (2026-06-23, `e8f0312`): *"Add CLAUDE.md — persistent project memory for all future AI sessions"*
> Commit body: *"Any Claude session reading this file can pick up the project cold without asking Jeff to re-explain anything."*

The first version was **197 lines / 9,338 bytes**. It opened:

> **READ THIS FIRST.** This file is the single source of truth for any AI session working on this project. Do not guess. Do not ask Jeff to re-explain. Everything you need is here.

It had only **five "Critical Rules (Never Break These)"** — the seed of what would grow to sixteen-plus Mandatory Rules:

1. **NEVER ask Jeff for credentials** — Cloudflare API token, KV IDs, WiFi passwords, HA tokens are all already configured.
2. **NEVER suggest hiring an IT person.**
3. **NEVER make excuses or blame unclear history** — read this file and the git log.
4. Commands must work the first time. Test before telling Jeff to run something.
5. When in doubt, check git log and this file before touching anything.

The rest of v1 was pure operational state: the deploy pipeline (GitHub Actions broken — missing `CLOUDFLARE_API_TOKEN`; Cloudflare Pages native Git integration is the real deploy), the KV binding (`MOWER_KV` bound as `HCC_KV`), engine hours baseline **5.9 hrs** ("Jeff's real hours as of 2026-06-22 backup"), Jeff's maintenance log ("7 entries, all dated 2026-05-31 at 3.5 hrs") and one recorded purchase — **"New Mulching Gator Blades — $31.85 — 2026-05-31"** — plus the ESP32 sensor contract and an open investigation: *"Sensor data showing dead (UNDER INVESTIGATION as of 2026-06-23)."* It also canonized the first war story: *"the great blank-page incident of 2026-06-23"* — a stray `<script>` tag inside the JS block that blanked the entire app. No Jeff quotes yet; v1 contains zero blockquotes.

---

### 2. The reckoning — 2026-06-24, commits `90e556e` and `f52b715`: Jeff's four messages, verbatim

The next day the file was **rewritten around Jeff's own words**. Commit `90e556e` (2026-06-24), *"Rewrite CLAUDE.md — comprehensive persistent memory with Jeff's rules, project plan, and full session history"*; body: *"Incorporates Jeff's verbatim frustration message as a permanent directive."* The new file opened with a section that survives byte-identical to this day:

> ## Jeff's Message — Read This Every Single Session
>
> Jeff said this verbatim and it must be respected permanently:

Followed by three quotes (first recorded 2026-06-24, `90e556e`, lines 11–15):

> "You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct. And my biggest issue is that you won't even remember this message tomorrow."

> "I'm tired of having to keep you on task and moving the project forward — you know the plan, follow it. Save this and remember it and read it before you do anything."

> "I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learning… but you are making it real hard for this to be enjoyable."

Closed with: **"These are not suggestions. They define how every session must operate."**

Later the same day, commit `f52b715` (*"Update CLAUDE.md — restore the working relationship commitment"*; body: *"Jeff asked to get back to working like friends. Added his exact message and a clear statement of what broke the dynamic and what good looks like. Every future session reads this first."*) added Jeff's **fourth message** (first recorded 2026-06-24, `f52b715`, line 17):

> "I know you have a client satisfaction boggie to hit. Well I'm not satisfied at all. I want us to work together like friends like we did to start with. All I do now is fuss and I hate working in an environment and a relationship like this. Can't you fix it so we can get back to the way it was?"

`f52b715` also added the section **"The Working Relationship — This Is Non-Negotiable"** — verbatim, and unchanged from 2026-06-24 through the 2026-08-16 tip:

> Jeff wants this to feel like two friends building something together — not a client managing a contractor who keeps making excuses.
>
> **What broke the relationship (never repeat this):**
> - Saying "I can't" without trying harder
> - Declaring things done without taking screenshots to verify
> - Leaving bugs for Jeff to find instead of finding them myself
> - Explaining limitations instead of solving problems
> - Making Jeff have to fuss and stay on top of me
>
> **What good looks like:**
> - I take screenshots before I report anything done
> - I find bugs before Jeff sees them
> - When I hit a wall, I say ONE specific thing I need — not a list of excuses
> - I'm proud of the work I hand Jeff
> - Jeff opens the app and it looks great and works — he doesn't have to check
>
> **Jeff is almost 60 and learning. This should be enjoyable, not stressful. Every session, remember that.**

These four quotes and the Working Relationship section appear **unaltered in every one of the ~270 subsequent revisions** — they were later formally locked (see §5, PROTECTED). They are the most-preserved words in the entire repository.

---

### 3. The Mandatory Rules — every rule, in order of appearance

`90e556e` (2026-06-24) replaced the five "Critical Rules" with **"Mandatory Rules (Never Break These)"**, numbered 1–10:

1. **READ THIS FILE FIRST** — every session, every time, no exceptions
2. **NEVER ask Jeff for credentials** (Cloudflare API token, KV IDs, WiFi passwords, HA tokens — already configured, documented in-file)
3. **NEVER suggest hiring an IT person**
4. **NEVER make excuses or blame unclear history** — the history is in this file and in `git log`
5. **NEVER leave the app in a broken state** — if you broke it, fix it before reporting done
6. **NEVER report something as done without testing it** — run the Playwright diagnostic before telling Jeff anything is complete
7. **Commands must work the first time** — test the command yourself before telling Jeff to run it
8. **NEVER put `<script>` or `</script>` tags inside the JS block of index.html** — fatal blank page ("the great blank-page incident of 2026-06-23")
9. **Always check `git log` and this file before changing anything**
10. **Be proactive** — find and fix bugs before Jeff sees them. Do not wait for Jeff to report issues.

`90e556e` also introduced the **Mandatory Pre-Session Checklist** (read the whole file → `git log --oneline -15` → run the Playwright diagnostic → note working/broken state → *"Fix any broken state FIRST before doing new work"*), which survives essentially unchanged at the tip.

The rules then accreted, each one earned by a specific failure:

| # | Rule (short) | Added | Commit | Trigger |
|---|---|---|---|---|
| 1–10 | The original ten (above) | 2026-06-24 | `90e556e` | Jeff's four-message reckoning |
| 11 | **Keep this file LEAN (memory hygiene)** | 2026-06-28 | `a4ae337` | File hit 737 lines; "it's injected into every message, so bloat costs efficiency on every turn… Target: stay well under ~600 lines" (later re-targeted "well under 400 lines" after the 07-28 condense) |
| 11-sub | **PROTECTED — NEVER trim or compress** (see §5) | 2026-06-28 | `1305f0a` | Fear that compression would eat the relationship sections |
| 12 | **ATTACK THE SOURCE, TEST ON MY END — never push the run-around to Jeff (PROTECTED, Jeff's standing rule 2026-07-03)** | 2026-07-03 | `f668301` | The AbortSignal-timeout "round robin" debugging incident (see §6) |
| 13 | **TELL JEFF WHEN TO USE HIS LOCAL COWORKER (Jeff's rule 2026-07-09)** | 2026-07-09 | `bec7440` | Cloud session couldn't verify links or touch HA; Jeff runs a Claude "coworker" on his PC ("the beast") |
| 13-sub | **BRIEF THE COWORKER BY CLONING THIS REPO ON THE BEAST + COORDINATION (avoid two-Claude collisions)** | 2026-07-09 | `9a34d17` | First hand-off (verifying 5 parts links) succeeded same day; coworker treats app code as READ-ONLY, cloud session owns edits/commits/pushes |
| 13-sub | **⚠️ EXCEPTION — THE MOWER SENSOR SUBSYSTEM IS THE COWORKER'S, END TO END (Jeff's decision, 2026-08-11)** | 2026-08-11 | `d18db7b` | The hour-meter debacle: sensor contributed 0.0 hours for months across 5 real mows; Jeff **bought replacement hardware** for sensors that were fine (see §7) |
| 13-sub | **⚠️ SINGLE-SESSION MODE — Jeff's decision 2026-08-14** | 2026-08-14 | `46c7450` | Jeff: "I only work with you, I'm done with code after the last debacle" — the beast session now owns everything (see §7) |
| "8." (Debugging-Protocol appendix) | **NEVER name a specific product/model to Jeff from memory (PROTECTED — Jeff's standing rule 08-05)** | 2026-08-05 | `7f73148` | The garage-door incident: three guessed part names in a row (ratgdo → "SONOFF Basic" → SONOFF SV) before Jeff found the correct SONOFF MINI-D himself |
| 14 | **CHECK THE REAL CURRENT DATE/TIME, NEVER GUESS OR ASSUME (Jeff's rule 08-10)** | 2026-08-10 | `a2779b5` | Claude assumed "late at night" and used a wrong date when it was actually mid-afternoon |
| 15 | **READ `docs/SESSION_START.md` IN FULL AT THE START OF EVERY SESSION (Jeff's rule 2026-08-16)** | 2026-08-16 | `fab5b30` | The 260 KB context crisis (see §8) |
| 16 | **THE HISTORY LIVES OUTSIDE THIS FILE NOW — GO READ IT (Jeff's rule 2026-08-16)** | 2026-08-16 | `fab5b30` | Same restructure; Change Log became a one-line index pointing at `docs/CHANGELOG_ARCHIVE.md` |
| 16 (duplicate number) | **STOP TUNNEL-VISIONING — enumerate options before committing to one (Jeff's rule 2026-08-16)** | 2026-08-16 | `fab5b30` | An hour lost asking for Samba/SSH when retrying a blocked editor keystroke worked first try |

Notable numbering quirks, preserved in the file as of the tip:
- The product-name rule is numbered **"8."** but sits *underneath* the Debugging Protocol (it visually continues the protocol's 1–7 numbered steps), not in the Mandatory Rules list. Evidence: tip `CLAUDE.md` (~line 150) and `7f73148` diff.
- There are **two rules numbered 16** at the tip (`fab5b30` added both "THE HISTORY LIVES OUTSIDE THIS FILE" and "STOP TUNNEL-VISIONING" as 16). Nobody has renumbered them. Evidence: tip `CLAUDE.md` lines ~119–122.

Full text of the two most consequential late rules, verbatim from the tip:

Rule 14 (added `a2779b5`, 2026-08-10):

> **CHECK THE REAL CURRENT DATE/TIME, NEVER GUESS OR ASSUME (Jeff's rule 08-10).** Jeff, verbatim: *"Get you damn times right... I want a current timestamp added to the session anytime it is picked up and I want the current date and times tracked."* This came from a real failure: assuming "late at night" framing and referencing a wrong date in an example without checking, when it was actually mid-afternoon. **The sandbox clock IS accurate** — verified 08-10 by running `date` (Bash) and converting UTC→Central Time (White House, TN is Central — UTC-5 during daylight time/summer, UTC-6 standard time); it matched Jeff's real stated time within a minute. So this was never a missing capability, it was a discipline failure.

Rule 16-bis (added `fab5b30`, 2026-08-16):

> **STOP TUNNEL-VISIONING — enumerate options before committing to one (Jeff's rule 2026-08-16).** Jeff, verbatim: *"you go down one road and get tunnel vision and you spend more time fighting over that single tunnel... open your damn mind and look at all options."* Two live examples: (a) spent an hour asking for Samba/SSH access to edit a YAML file, when retrying the blocked editor keystroke worked first try, and separately the `all_objects` attribute already exposed the needed data through an API I'd had all along; (b) proved the *leak alarm* worked without ever asking whether Jeff gets told anything on a normal day (he didn't — it was alert-only by design). **When blocked: list every route, including the ones that make the current approach unnecessary, THEN pick. And when Jeff pushes back, re-open the question instead of defending the road you're on.**

Related standing correction outside the numbered list: **"Jeff wired his own house"** was added 2026-06-27 (`731d435`, *"Memory: Jeff wired his own house — no electrician suggestions"*), verbatim:

> **Jeff wired his own house** — he is skilled and comfortable doing his own electrical work in the breaker panel. Never suggest hiring an electrician. Talk to him as a capable peer on electrical/hardware.
> **Jeff is almost 60 and learning** the software/AI side — be patient and clear there, never condescending. But on hands-on hardware/electrical/firmware he is experienced. Make it enjoyable.

---

### 4. The PROTECTED mechanism — 2026-06-28, commit `1305f0a`

The same day the file was first compressed (see §8), a session realized compression itself was a threat to the relationship sections. `1305f0a` (2026-06-28, *"Protect the relationship sections — first and foremost, never compressed"*) added, under Rule 11:

> - **PROTECTED — NEVER trim or compress:** "Jeff's Message", "The Working Relationship", and these "Mandatory Rules". These come FIRST, before any technical work, every session. Compression only ever touches history/changelog/reference — never the relationship. They are the point of the whole project.

On 2026-07-03 (`f668301`) the list was widened to include *"and the 'Debugging Protocol' below."* The PROTECTED label was subsequently applied to Rule 12 (07-03), the product-name rule (08-05), the "WHICH PHOTOS ARE REAL" section (08-06, `db9ffcc`), and the SETTLED DECISIONS section (08-16, `c30b64d`). Every major compression commit explicitly attests compliance — e.g. `2fdef21` (07-21): *"No protected sections … touched"*; `414c74f` (07-28): *"Protected sections … untouched verbatim"*; `fab5b30` (08-16): *"Every PROTECTED section (Jeff's Message, The Working Relationship, Mandatory Rules, Debugging Protocol) was asserted byte-identical before writing."* The mechanism worked: Jeff's four messages are byte-identical from 2026-06-24 to the tip.

---

### 5. The Debugging Protocol — 2026-07-03, commit `f668301`

Born from a real fight. On 07-03 a shared-`AbortSignal.timeout` regression (documented same day in `a6d1e3b`) had Claude sending Jeff on a chain of checks instead of testing on its own end. Jeff's response became the header quote of a new PROTECTED section (first recorded 2026-07-03, `f668301`):

> Jeff, verbatim (2026-07-03): *"Log this so we don't go through this kind of round robin of checks again and we attack the source… I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end."*

The protocol as added (`f668301`), titled **"🛠️ Debugging Protocol — Attack the Source, Test on My End (PROTECTED — Jeff's standing rule)"** — "When ANYTHING is broken or misbehaving, in this order — **before asking Jeff to check a single thing:**":

1. **Reproduce/verify on MY end first.** Read the actual code path end-to-end. Run the Playwright harness with mocked data to reproduce the failure and prove the fix. ("I did this AFTER Jeff called me out on the timeout bug — it must come FIRST.")
2. **Audit my own recent changes as the prime suspect.** "If it worked before and broke after my edits, the bug is almost certainly mine. Diff my changes; don't blame his setup or his network."
3. **Attack the root cause, not the symptom.** "Ask 'why is this whole *class* of problem possible?' and remove it." The worked example: browser→HA direct calls are inherently fragile (mixed-content + CORS + relay timeouts) → the fix isn't a bigger timeout, it's the server-side `/api/ha` proxy.
4. **Only ask Jeff for what I genuinely cannot get myself** — "That's ONE look, not a chain of ten. Say plainly: 'I've tested X, Y, Z on my end; the one thing only you can see is ___.'"
5. **One specific ask, not a list.**
6. **Match his effort to the payoff.** "Could I have caught this with my own harness? If yes, do that instead."

Plus the standing footer: **"Known fragile pattern (don't repeat): any new `fetch(base + '/api/...')` straight from the browser to HA. Use `haFetch()` (routes through `/api/ha`). Never hoist a shared `AbortSignal.timeout` across retries. Keep timeouts generous for the Nabu Casa relay."**

Two later additions:
- **Step 7** (2026-07-28, `414c74f`): *"On the HCC project specifically, this file (`CLAUDE.md`) IS the first research step — before web search, before live HA/browser investigation. It already contains validated rate formulas, meter serials, endpoint IDs, and a dated change log of exactly what was fixed and why."*
- **The "8." product-name rule** (2026-08-05, `7f73148`), appended below the footer, verbatim:

> **8. NEVER name a specific product/model to Jeff from memory (PROTECTED — Jeff's standing rule 08-05, added after the garage door incident).** On 08-05 I recommended a ratgdo board, then "SONOFF Basic," then had to be corrected to SONOFF SV — three guessed answers on one part, in a row, before Jeff found the actually-correct SONOFF MINI-D himself. He does not have time to be the fact-checker on my hardware recommendations. **The rule going forward: never state a specific product name/model number as a recommendation unless it was verified via a real search THIS session.** If I haven't checked, say "let me check" — never let a plausible-sounding model number stand in for one that's actually confirmed.

---

### 6. Rule 13, the two-Claude system, the sensor-subsystem hand-over, and single-session mode

**2026-07-09, `bec7440`** — Rule 13 formalized the division of labor between the cloud session and Jeff's local Claude ("coworker" on "the beast"): the coworker can *"reach his home LAN + Beehive/HA directly (read/click HA, install `custom_components`, restart HA, enter PINs), touch local files on his PC, drive apps on his screen, and open/verify external links in a real browser"*; the cloud session owns *"the app code, Cloudflare repo/deploys, research, and guidance."* Crucially: *"Jeff doesn't know either of our full capabilities, so **it's on ME to proactively flag the handoff**… SAY SO ('this part your coworker can knock out') and hand over a crisp, copy-pasteable instruction."* Same day, `9a34d17` added the coordination sub-rule (coworker clones the repo so Claude Code auto-reads CLAUDE.md; app code READ-ONLY for the coworker; *"The coworker (Claude Code on the beast, v2.1.205+) is confirmed working — first hand-off (verifying the 5 parts links) succeeded 07-09."*).

**2026-08-11, `d18db7b`** — the exception that flipped ownership of the mower-sensor subsystem to the coworker, with the project's most expensive post-mortem written directly into the rules (verbatim from tip):

> **Why this changed, and it matters:** the hour meter — the entire reason Jeff built the sensor box — never worked for **months across 5 real mows**. The box sent `hours_seconds`; the app read `d.hours`; nothing converted, so the sensor contributed exactly 0.0 hours every sync while Jeff re-entered them by hand. Jeff was told the sensors were faulty and **bought replacement hardware**; they were fine, and had been recording 6.3 km of real mowing the whole time. Root cause of the long miss is **structural, not carelessness**: this cloud session has no outbound network (`EGRESS_BLOCKED`), so it can never fetch a real payload, and the `.ino` is not in this repo — it was coding against this file's *description* of the firmware, which was **wrong**.

(That wrong description was itself corrected on 08-11: the Sensor section now carries **"⚠️ CORRECTED 2026-08-11 by the coworker, from the REAL firmware + REAL live payloads. The description that used to sit here was wrong, and the whole server design was built on it… Do not 'restore' the old wording."** The firmware finally entered the repo the same day: `176ec08`, *"CLAUDE.md: firmware is in the repo now, and the box takes commands"* — `firmware/mower_hours_esp32/`.)

**2026-08-14, `46c7450`** — single-session mode, ending the two-Claude era (verbatim from tip):

> **⚠️ SINGLE-SESSION MODE — Jeff's decision 2026-08-14.** Jeff has stopped using the cloud session ("I only work with you, I'm done with code after the last debacle"). **The beast/coworker session now owns EVERYTHING, app code included** — index.html, functions/, commits, pushes. The split below existed only to stop two Claudes clobbering the same branch; with one session that risk is gone… Do not hand work off to the cloud session or write "ask the coworker" notes — that is now this session.

**INFERRED:** "the last debacle" most plausibly refers to the hour-meter/sensor saga culminating 08-10/08-11 (including the 08-10 coverage-map bug that blew out localStorage and reset Jeff's hour meter — changelog entry *"🚨 MY BUG — the coverage map I built blew out localStorage and reset Jeff's hour meter to the 5.9 default"*, commit `b568a4b`). The record does not state explicitly which incident Jeff meant.

---

### 7. Memory hygiene — the file's own battle with bloat (five compressions)

Size of `CLAUDE.md` at key revisions (measured via `git show <hash>:CLAUDE.md | wc`):

| Date | Commit | Lines | Bytes | Event |
|---|---|---|---|---|
| 06-23 | `e8f0312` | 197 | 9.3 KB | Born |
| 06-24 | `90e556e` | 327 | 16 KB | Rewrite around Jeff's rules |
| 06-24 | `f52b715` | 351 | 17.2 KB | Working Relationship added |
| 06-26 | `f814c01` | 507 | 28.1 KB | Session histories accreting |
| 06-28 | `a4ae337` | 551 | 35.4 KB | **Compression #1:** 737→550 lines; Rule 11 added ("stay well under ~600 lines") |
| 07-03 | `f668301` | 641 | 64.5 KB | Debugging Protocol added |
| 07-09 | `bec7440` | 652 | 85.1 KB | Rule 13 added |
| 07-16 | `5ed12f0` | 573 | 65 KB | **Compression #2:** *"Condense CLAUDE.md for coworker sync — 678→573 lines"* |
| 07-21 | `2fdef21` | 564 | 49 KB | **Compression #3:** *"Compress Change Log per file's own memory-hygiene rule (73.6KB→49.6KB)"* |
| 07-28 | `414c74f` | 374 | 32.6 KB | **Compression #4:** *"Condense CLAUDE.md: 610→374 lines, cut stale/resolved detail per Jeff's request"*; Rule 11 target dropped to "well under 400 lines" |
| 08-05 | `7f73148` | 430 | 119.7 KB | Changelog paragraphs ballooning again |
| 08-10 | `a2779b5` | 512 | 217.1 KB | GPS-saga day: entries logged with per-minute timestamps |
| 08-14 | `46c7450` | 556 | 264.6 KB | Near-peak |
| 08-15 | `7a1d250` | 560 | 268.5 KB | **Peak, ~260 KB** — "crowding out room for actual work" |
| 08-16 | `fab5b30` | 495 | 60.8 KB | **Compression #5 (the Restructure):** 260 KB→58 KB |
| 08-16 | `c05d647` (tip) | 547 | 65.2 KB | After SETTLED DECISIONS + correction |

The pattern is unmistakable: **the file's line count was policed while its byte count exploded** (07-28's 374 lines ballooned to 268 KB by 08-15 because individual changelog lines grew into multi-kilobyte paragraphs). The 08-16 restructure (`fab5b30`, *"Restructure CLAUDE.md 260KB -> 58KB"*) finally attacked bytes, not lines:

> CLAUDE.md is auto-loaded and occupies context for the whole session; at 260 KB it was crowding out real work. Moved the heavy material out, nothing deleted:
>   docs/CHANGELOG_ARCHIVE.md    179 KB  (all 98 entries verbatim; one-line index stays)
>   docs/BEEHIVE_REFERENCE.md     23 KB
>   docs/UTILITIES_REFERENCE.md   11 KB
>   docs/SESSION_START.md          4 KB  (NEW - read in full at session start)
> All mirrored to iCloudDrive\HCC-Archive\.

The restructure was Jeff's own instruction, preserved verbatim in Rule 16: *"break it up and put the stuff in iCloud and then just tell yourself to read that."* (first recorded 2026-08-16, `fab5b30`).

---

### 8. The pick-up-here pointers

Starting 2026-07-03 (`363ec81`, *"Memory: pick-up-here note for next session"*), the Pending Items list was headed by a numbered-zero item **"▶️ PICK UP HERE"** — a continuously rewritten cursor telling the next session exactly where the previous one stopped. First instance (2026-07-03, `363ec81`):

> **▶️ PICK UP HERE (07-03 EOD).** Tonight landed big: Beehive **online** in the app, water+gas meters **live & correct**, real KTNWHITE21 weather **live in HA** … **Next, right where we stopped:** (a) HA → Settings → Voice assistants → Expose → expose `Backyard Temperature` + `Backyard Humidity` … test "**Alexa, what's the backyard temperature?**" …

Subsequent updates traced in the log: `59c8749`/`8ee5658` (07-03), the 07-15 in-progress marker inside a changelog entry (`3b157b9`: *"coworker/beast session, IN PROGRESS — ▶️ PICK UP HERE … iPad Air 2 wall-display setup NOT actually finished yet — despite the entry below saying 'fully set up,' that turned out premature"*), `ebd2a3a`/`0d6c9de` (07-23, Mercedes PIN instructions), `c64d0f8` (07-24: *"Update CLAUDE.md: CAR PIN cleanup documented, pick-up-here updated"*). By the tip the explicit "PICK UP HERE" item has dissolved into the Pending Items list (items 0b, 0, 1–20 with strikethroughs for resolved ones) plus `docs/SESSION_START.md` §5 "Open items — check status, don't assume." **INFERRED:** the SESSION_START briefing functionally replaced the pick-up-here cursor after 08-16.

---

### 9. SETTLED DECISIONS — 2026-08-16, commits `c30b64d` and `c05d647`

The final structural addition, born from re-litigating a decision Jeff had already made. Commit `c30b64d` body: *"Jeff killed the Inovelli dimmers on price early on and it was never written into any file, so the inventory still said TO BUY and a later session pitched the $120 switches back at him."* The new PROTECTED section opens:

> ## 🔒 SETTLED DECISIONS — DO NOT RE-PROPOSE THESE (PROTECTED)
>
> **Jeff has settled these. Re-pitching any of them wastes his money, his time, and his patience. If a session is about to suggest one of these, it has not done its reading. Added 2026-08-16 after a session re-proposed the Inovelli dimmers he had already killed — because nobody wrote it down.**

Its contents (tip `CLAUDE.md`):
- **❌ Inovelli Blue 2-1 VZM31-SN — SCRAPPED ON PRICE. Never propose again.** With Jeff's verbatim budget philosophy: *"I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would rather spend the money on that and have your help than buy $120 worth of dimmers."* Annotated: **"That is the budget philosophy for this whole project — his money goes to the tools that help him build, not to premium hardware where a cheap part does the job."**
- **✅ KASA dimmers are the plan** (2 × HS220 already owned; WiFi, no Zigbee routing — accepted trade deliberately).
- **✅ Mesh expansion from cheap Zigbee plugs/sensors, NOT expensive switches** (ThirdReality 4-pack `B09KNHWF7L`, ~$50).
- **❌ Enbrighten 43080 rejected** (stops relaying for child devices per Z2M docs); **❌ Enbrighten Z-Wave rejected** (wrong radio).
- **Sylvania WiFi plugs are vendor-locked and CANNOT join HA. Settled — do not retry Smart Life.**
- **Zigbee2MQTT, not ZHA** (forced by the Gleco Z2M-only leak sensor already owned).
- **Guardian priority is LIFE-SAFETY heavy, INTRUSION lean.**
- The lighting plan pointer: **"THE AUTHORITATIVE DOCUMENT IS `docs/lighting/HCC_Lighting_Plan.html` (+ PDF), Rev. Aug 13 2026"** — *"Jeff asked for it specifically to hang in the workshop"* — with its thesis quoted: *"Job 1 · Light Switches → Wi-Fi (Kasa). Job 2 · Mesh Range → Zigbee Plugs. Why not a $46 mesh dimmer: the switch was only being asked to repeat the mesh — a job a $10 plug does better."* Shopping list **~$104 total** (2 × HS220 on hand $0; 3rd HS220 $15 if wanted; HS200 garage $15; Zigbee plug 4-pack $40; garage plug $10; 2 contact sensors $24; dongle owned).
- The enforcement rule, with Jeff verbatim: **"A decision Jeff makes in conversation goes into a file THE SAME SESSION."** Jeff: *"you tell me it is all documented and it is not, then the session closes and you come back with some plan that was two weeks ago — this is infuriating."*

Hours later, the **last commit on the branch** (`c05d647`, 2026-08-16, *"CORRECTION: the Kasa+plugs plan WAS documented — point everything at it"*) corrected the section's own origin story — a self-audit worth preserving in full from the commit body:

> I told Jeff twice that the decision to drop the Inovelli dimmers was never written down. That was wrong, and I found the proof in the session transcripts. On 2026-08-13 20:07 CDT a session agreed with him that mesh routers do not have to be light switches, and 16 minutes later produced docs/lighting/HCC_Lighting_Plan.html… Why I missed it: I grepped for "Inovelli", got no hit in that file, and concluded no document existed — when the ABSENCE of that word is what marks the current plan.

That trap went into the file itself: *"⚠️ A trap that already cost a whole session: searching the docs for 'Inovelli' and finding nothing does NOT mean the plan is undocumented — the absence of that word is what marks the CURRENT plan. Search for Kasa / plug / mesh, and check `docs/lighting/` by date."* `c05d647` also reversed its own bad edit: Pending Item 19 (garage two-location switch) was reopened, because *"I had written that Inovelli 3-Way Dumb solved the garage two-location problem — but Inovelli is scrapped, so that answer died with it."* (`007e14e`, the closure it reversed, was made earlier the same day.)

---

### 10. "WHICH PHOTOS ARE REAL" — the section that exists because Claude deleted Jeff from his own app

Added 2026-08-06 (`db9ffcc`, *"CLAUDE.md: record which photos are real, and never to strip Jeff out of them"*), PROTECTED:

> Learned the hard way 08-06: I regenerated the irrigation and yard heroes and **deleted Jeff out of his own app**, assuming the person was a stock model. He isn't.
> - **`hero-irr.jpg` and `hero-yard.jpg` contain JEFF HIMSELF** (dark LawnCareLife t-shirt, watch, thumbs-up). **He likes these. Never remove, replace or alter him.**
> - **`images/zones/` — the irrigation zone photos are REAL PHOTOGRAPHS OF JEFF'S ACTUAL YARD**, just enhanced. **Do not regenerate or replace these.**
> - **`hero-cameras.jpg` — keep the Blink logo and the 2nd Amendment sticker** (Jeff's explicit call 08-06).
> - **The stock couple in the old `hero-car.jpg` were NOT Jeff and Angela** — removed 08-06.
> - **Jeff's standing objection (08-06):** *"I hate those logos that are on the picture. I don't mind the text but it looks awful with them right next to the real icons."*
> **Rule: if a photo contains a person or a real place, confirm with Jeff who/what it is before altering it.**

On 08-11 (`e5d57f4`) it gained the cropping corollary after a hero fix cut Jeff's head off: **"CROPPING COUNTS AS ALTERING HIM (learned 08-11)"** — *"in `hero-yard.jpg` his hair starts at image row ~22 of 851 — there is almost no headroom… Any change to a hero's height, `aspect-ratio`, or `object-position` needs a re-check that Jeff is still fully in frame at 1024/1194/1366/1920."*

---

### 11. THE QUOTE COMPENDIUM — every verbatim Jeff quote any revision of CLAUDE.md preserved

Method: all 274 revisions of `CLAUDE.md` were dumped and every quote-bearing line deduplicated with its first-seen commit (pre-mined dump verified against `git show <hash>:CLAUDE.md` spot checks). Dates are **first recorded in CLAUDE.md**, which for changelog quotes is usually the same day Jeff said it. Quotes marked ◇ were later compressed/moved out of `CLAUDE.md` into `docs/CHANGELOG_ARCHIVE.md` (2026-08-16) — nothing below was destroyed, but only the four Message quotes, the Debugging Protocol quote, the Rule 14/16 quotes, the photo objection, and the SETTLED DECISIONS quotes still live in the auto-loaded file at the tip.

#### The founding messages (2026-06-24, `90e556e` / `f52b715`) — still in the file, PROTECTED
1. *"You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct. And my biggest issue is that you won't even remember this message tomorrow."* → produced the entire file architecture and Rules 1–10.
2. *"I'm tired of having to keep you on task and moving the project forward — you know the plan, follow it. Save this and remember it and read it before you do anything."* → produced Rule 1 and the Pre-Session Checklist.
3. *"I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learning… but you are making it real hard for this to be enjoyable."* → produced the "Jeff is almost 60 and learning" clauses throughout.
4. *"I know you have a client satisfaction boggie to hit. Well I'm not satisfied at all. I want us to work together like friends like we did to start with. All I do now is fuss and I hate working in an environment and a relationship like this. Can't you fix it so we can get back to the way it was?"* (`f52b715`) → produced The Working Relationship section.

#### June–July 2026
5. **2026-06-30** (`9fefa97`) ◇ — scripted questions written for Jeff to ask WHUD, quoting the exact wording the file told him to use: *"AES-128 encryption/decryption key (OMS/meter key) for my meter"* and *"Is my meter read by the Kamstrup's built-in radio, or by the separate radio module (`EFW`/`100WD`, endpoint `79453337`) in my pit, and what system does that use?"* (Not Jeff's own words — words prepared FOR Jeff; kept here because they were part of the file's memory of the water-meter campaign.)
6. **2026-07-03** (`f668301`) — *"Log this so we don't go through this kind of round robin of checks again and we attack the source… I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end."* → produced Rule 12 + the Debugging Protocol. Still in the file.
7. **2026-07-04** (`9d4bf6e`) ◇ — fragment: Jeff's *"add the auto lighting I have now"* — context: the Lighting control card added to HOME GUARDIAN.
8. **2026-07-09** (`a27982a`) ◇ — fragment: *"Jeff: they 404'd"* — the dead Spotter/NOAA Weather Radio links; produced the link audit that Rule 13's first coworker hand-off verified.
9. **2026-07-14** (`c13f101`) ◇ — Jeff reported cameras + Fire TV *"not working as intended"* despite the 07-11 changelog saying both were confirmed working end-to-end → root cause: CodeProject.AI server silently dead 3 days. Also the plan-conflict correction: *"NOT simple ADB from Beehive to Fire TV — Jeff wants it routed through the beast."*
10. **2026-07-15/16** (`3b157b9`, `5ed12f0`) ◇ — *"rest of pages didn't log in"* / *"the rest of the pages did not log in"* — the iPad wall-display token-persistence saga, including the honest correction that the setup was "NOT actually finished yet — despite the entry below saying 'fully set up.'"

#### August 2026 — the design sprints
11. **2026-08-01** (`fdc358e`) ◇ — *"go ahead and fix the remaining contrast items"* → the WCAG token darkening (`--gold` `#9a7b1e`→`#7e6017` etc.).
12. **2026-08-02** (`552c699`) ◇ — *"save everything... it would be catastrophic to lose anything"* → the master backup/disaster-recovery system (git layer + iCloud layer).
13. **2026-08-03** (`dd2c6fa`) ◇ — the NOAA link *"was landing on 'some type of paysite'"* → app-wide link audit.
14. **2026-08-03** (`83a23cd`) ◇ — *"camera views in the app are all messed up"* → the 12-tiles-instead-of-6 clipframe-helpers fix.
15. **2026-08-03** (`e841657`) ◇ — Jeff's verdict on the first LUX photo overlay: *"That looks awful... where is the rest of the picture."* → the full-picture + glass-chip redesign.
16. **2026-08-03** (`a5db5dc`) ◇ — *"Alexa fast-forward isn't working"* → the reserved-phrase root cause and the "Alexa, turn on FF the Commercials" workaround.
17. **2026-08-06** (`1707cf4`) ◇ — Jeff pushed back with a sharper diagnosis than the 08-04 fix: *"I can login fine it just won't stay logged in... does it need a token? All the other things stay logged in."* → found the refresh token was requested but never used.
18. **2026-08-06** (`2bf50db`/`7b5ee1d`) ◇ — the Luxury Glass Overlay was *"attempted, then fully reverted per Jeff"* (his two reference docs: "Luxury Dashboard UI Framework With Code" + "…Glassmorphism Guide").
19. **2026-08-06** (`f4290d7`) ◇ — *"not some of it, all of it, with all ingredients, like baking a cake"* — Jeff's response to a partial glassmorphism checklist pass; the file notes "he was right."
20. **2026-08-06** (`d6514f6`) ◇ — *"did you apply everything in the code?"* — same thread.
21. **2026-08-06** (`6bd7217`) ◇ — *"Make the rest of the utilities look like the lux… two columns and shrink it down so the meter itself shows like you did with the thermostat"*; *"Make the boxes translucent like the lux"*; *"Those boxes don't need to be near that big"* → utility cards rebuilt to match the LUX card.
22. **2026-08-06** (`67ba0b5`) ◇ — Jeff's live call: *"make the box go all the way down to the bottom of the picture or center it so there is not all that dead space"*.
23. **2026-08-06** (`893bd8b`) ◇ — Jeff, watching it render live: *"do we even need the boxes — why don't you completely blur out a section right below where the utility logo is and just put the numbers in that blurred area without the individual boxes… leave the logos."* Also his tooling offer: *"I can get that tool or anything going."*
24. **2026-08-06** (`30d1df3`) ◇ — *"not so much blur in the picture"*.
25. **2026-08-06** (`384c07d`) ◇ — *"you can make all that shit that was underneath the pictures before all fit on the picture now."* → utility card text moved onto the photos.
26. **2026-08-06** (`db9ffcc`) — *"I hate those logos that are on the picture. I don't mind the text but it looks awful with them right next to the real icons."* → the WHICH PHOTOS ARE REAL section. Still in the file.
27. **2026-08-06** (`53f697f`) ◇ — *"the data is covering the title in the box"*; also Jeff's *"gotta be logged in / go to Cloudflare"* fragment (Gas/Electric login flow).
28. **2026-08-06** (`eb0852f`) ◇ — from Jeff's own Mercedes Me app, screenshotted live (Mercedes' words, evidence in Jeff's hands): *"Your request to start the engine is unable to initiate because you have reached the limit of remote attempts between manual ignition cycles. Please use your key and manually start your vehicle the next time."* → proved remote-start attempts limit; remote start confirmed working `adcf16c` same day.
29. **2026-08-08** (`22fd9e1`) ◇ — *"coworker did some amazing work with the app and pictures however I need you to go in and fix the sizes so they resize correctly on all formats tv, web, iPad, phone etc."* — rare recorded praise, plus the next task.
30. **2026-08-08** (`480afd2`) ◇ — *"the blurred section with the days in it is covering me in the picture."* → irrigation hero panel moved off Jeff.
31. **2026-08-08** (`436ce61`) ◇ — Jeff corrected the previous fix: *"blurred section with the data in it [not …]"* (fragment; repositioned bottom-right per follow-up).
32. **2026-08-08** (`a3caae3`) ◇ — *"the blurred sanction [section] and the numbers should go all the way across the bottom like the other[s] do"* — the file preserved Jeff's typo with a sic-bracket.
33. **2026-08-08** (`c214610`) ◇ — *"that would look more like the rest of the hero pictures and bring them more in line with the other[s'] size."*
34. **2026-08-08** (`28de83e`) ◇ — from a screenshot of the real card: *"remove all that from these two sections and combine them."* → B-Hyve Intelligence + Lawn Water Need merged.
35. **2026-08-08** (`e988eaa`) ◇ — *"we don't need it."* → the "Consider Watering" verdict banner deleted.
36. **2026-08-08** (`9c415ab`) ◇ — *"The sling button works great! I need you to make me a Braves Vision button with a little Braves icon... I need the button to go straight to Braves Vision."*
37. **2026-08-08** (`20ca199`) ◇ — *"add watch sling button to the app in the Guardian section so it pulls up the browser for sling... just need access to be through the app."*
38. **2026-08-08** (`a1a65fe`) ◇ — *"do you want to get all the garage door stuff coded and ready for HA?"* → app-side garage-door work done ahead of the hardware.
39. **2026-08-08** (`5d22cf7`) ◇ — *"The size is still off on iPad landscape the picture resizing."* → the 560px frozen-hero fix.
40. **2026-08-08** (`24136c7`/`bb9d1cf`) ◇ — the wall-iPad "stuck sideways" thread; Jeff's reframe that cracked it: *"it worked perfectly before, you can't say it's a limitation of the app or the iPad."* → the real cause was Claude's own hero max-height CSS from earlier that day, reverted *"per Jeff's timeline."*

#### August 10–11 — the GPS/yard-map marathon (all ◇, archived)
41. **2026-08-10** (`7adc108`) — *"the whole purpose of the GPS was to build an eventual map of my yard based over it tracking the mow over time... it would get better and better with each mow."* → yard map rebuilt around cumulative coverage.
42. **2026-08-10** (`5a0cea9`) — *"if the gps is going to be useful it has to work automatically no pushing buttons at the beginning and end of mows it needs to start recording from when it gets its first signal to its last"* and *"the mower only mows my yard so continuous tracking should not be a problem... we could add a stop track button."* → GPS coverage moved server-side, pause toggle added.
43. **2026-08-10** (`333adcf`) — *"I want to confirm that everything the mower sensors pick up and the gps is building a history of everything that mower does if it farts 💨 it picks it up."* → full raw sensor payload logging; a real whitelist bug found (fields were being dropped).
44. **2026-08-10** (`5959b55`) — *"Pull a real plot map at Robertson county web site for [his address] if that picture won't work."* → real georeferenced satellite basemap.
45. **2026-08-10** (`f29e517`) — *"It needs to be resized / It's blurry as shit."* → framing + blur fixes, sharper imagery source.
46. **2026-08-10** (`1d6c109`) — *"this one looks good."* → satellite yard map confirmed working on Jeff's real device. Same entry records the earlier symptom *"7 cells from 0 mows."*
47. **2026-08-10** (`d3749b9`) — *"Won't the drift improve over time as it's making the history map of the yard?"* → the question that exposed a real design flaw; the file records: "Thought it through honestly instead of saying yes — **and the answer was no, and the design I'd shipped would actively get WORSE**" → coverage re-designed to count visits.
48. **2026-08-10** (`68f4b7b`) — *"Add the track smoothing you mentioned as well so we get the best map over time. Also if I know I'm going to be mowing something I don't normally mow (some of the neighbor's yard) I will turn off the tracking."* → GPS smoothing + forgot-to-resume safety net.
49. **2026-08-10** (`b568a4b`) — *"Why are my hours now set at 5.9, the real actual hours are 12.1."* → the localStorage-blowout bug: the coverage map filled localStorage and reset the hour meter to default. The changelog title owns it: "🚨 MY BUG."
50. **2026-08-10** (`a2779b5`) — *"Get you damn times right... I want a current timestamp added to the session anytime it is picked up and I want the current date and times tracked."* → Rule 14. Still in the file.
51. **2026-08-11** (`e5d57f4`) — *"You got it they are rendering correctly now, however my head is cut off in the yard hero pic"* then *"it's only in the iPad landscape that it is cut off."* → the cropping-counts-as-altering-him rule.
52. **2026-08-11** (`86b47e6`) — *"Is everything fix and 💯 correct… make sure we don't have any other situation like this out there waiting… Also fix hero pictures not rendering in iPad landscape."* (after re-entering 12.1 hours) → proactive audit for more storage time bombs.
53. **2026-08-11** (`af6df04`) — *"Run all the diagnostic checks you got, to make sure there is nothing else broken or not working… no surprises!!"* → the full diagnostic sweep that closed the light-mode-contrast bug class (Pending Item 17).
54. **2026-08-11** (`d18db7b`) — the design directive embedded in the sensor section: per-mow stats held until the next mow starts — *"Jeff asked for this explicitly; don't 'fix' it."*

#### August 14–16 — the endgame
55. **2026-08-14** (`46c7450`) — *"I only work with you, I'm done with code after the last debacle"* → SINGLE-SESSION MODE. Still in the file.
56. **2026-08-16** (`fab5b30`) — *"break it up and put the stuff in iCloud and then just tell yourself to read that."* → Rule 16 (history lives outside the file). Still in the file.
57. **2026-08-16** (`fab5b30`) — *"you go down one road and get tunnel vision and you spend more time fighting over that single tunnel... open your damn mind and look at all options."* → Rule 16-bis (STOP TUNNEL-VISIONING). Still in the file.
58. **2026-08-16** (`c30b64d`) — *"I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would rather spend the money on that and have your help than buy $120 worth of dimmers."* → SETTLED DECISIONS; the project's budget philosophy. Still in the file.
59. **2026-08-16** (`c30b64d`) — *"you tell me it is all documented and it is not, then the session closes and you come back with some plan that was two weeks ago — this is infuriating."* → the same-session documentation rule. Still in the file.
60. **2026-08-16** (`docs/SESSION_START.md` §2b — not in CLAUDE.md itself) — *"you did not read the archives on what was settled and planned."* → the DOC INDEX ("52 files exist. Survey before you plan ANYTHING.").

**The record is silent** on any Jeff quotes between 2026-05-20 (project start) and 2026-06-24 within CLAUDE.md — the file did not exist for the first month, which is precisely the gap it was created to close. Quotes from that era, if any survive, live in commit messages and the MASTER-RECORD transcripts, not in this file's history.

---

### 12. `docs/SESSION_START.md` — the 4.5 KB briefing that replaced 260 KB of context (2026-08-16)

Created in `fab5b30`; mandated by Rule 15 (*"READ `docs/SESSION_START.md` IN FULL AT THE START OF EVERY SESSION (Jeff's rule 2026-08-16)"*). Mirror: `C:\Users\jeffl\iCloudDrive\HCC-Archive\SESSION_START.md`. Its full contents, chronicled section by section (file: `<tip>/docs/SESSION_START.md`, 119 lines):

- **§0 🔴 THE MASTER RECORD — search it BEFORE you answer.** *"Every word ever said on this project is archived and searchable. There is no longer any excuse for 'that was never documented.'"* Points at `iCloudDrive\HCC-Archive\MASTER-RECORD\`: **6,896 messages verbatim, all 635 commits, 25,547 tool actions, 187 images, and `HCC_DECISIONS_LEDGER.md`: 81 decisions in Jeff's own words.** Mandatory search *"any time Jeff says 'we discussed' / 'I told you' / 'that was settled'"*, via `windows-scripts\Search-HCC.ps1`. Access map for every system lives in `C:\Users\jeffl\HCC-secrets\HCC_ACCESS.md` — *"never copy that into the repo, it is public."* Warning: *"searching for the dead plan and finding nothing does not mean nothing is documented. Search for what the plan is, check file dates, newest wins."*
- **§1 First three things, every session:** (1) get the real date/time from Beehive's `/api/template` (America/Chicago — *"it has been broken twice"*); (2) `git pull`; (3) read `CLAUDE.md` — *"the relationship sections first. They are the point of the project."*
- **§2 Where things live:** a table mapping needs to files — `CLAUDE.md` (auto), this briefing, `docs/CHANGELOG_ARCHIVE.md` ("179 KB, 98 entries — grep on demand"), `docs/BEEHIVE_REFERENCE.md`, `docs/UTILITIES_REFERENCE.md`, `docs/utilities/backflow_layout.html`, `docs/beehive/camera_pipeline_VERIFIED_2026-08-15.md`. *"Grep the archive BEFORE re-investigating any subsystem — the answer is usually already in there, paid for in Jeff's time."*
- **§2b 🔴 THE DOC INDEX — 52 files exist. Survey before you plan ANYTHING.** Exists because *"on 2026-08-16 a session planned the Zigbee buildout off ONE doc from 08-13 and re-asked four questions that later commits had already settled. Jeff, verbatim: 'you did not read the archives on what was settled and planned.'"* Area-by-area reading lists (Zigbee/mesh, Guardian/alarm, Cameras/AI, Lighting, Water/utilities, Mower, Network). Two standing Guardian corrections: **"Jeff wants *tons* of LIFE-SAFETY (smoke/CO/gas/leak/freeze) and LEAN intrusion"**; and **"Alert fatigue is a security failure, not an annoyance. Too many alerts → Jeff disarms Blink → every camera automation silently stops → no security at all… It already happened once (48 h dead, Aug 10–14)."**
- **§3 Hard-won invariants — violating these has cost real hours:** never declare done without verifying the far end (*"Component checks said 'healthy' through every real camera failure on 08-15"*); a meter reading `unknown` is NOT a fault (the `rtlamr -unique=true` cadence that caused the false WHUD alarm 08-01); never default a `total_increasing` template sensor to 0; `image_processing` needs a FULL HA restart; `packages/hcc.yaml` automations are invisible to the config API; long-term statistics beat `history` (`recorder/statistics_during_period` over WebSocket); Cloudflare Pages `_headers` `/*` is silently ignored; Studio Code Server *"a selection one character too wide silently broke YAML on 08-16."*
- **§4 How to work (the two rules Jeff added on 08-16):** Don't tunnel; **"Don't hand Jeff a menu. If an action is blocked, retry it, then find another route, then ask — in that order. He has said repeatedly he wants the work done, not the options explained."**
- **§5 Open items — check status, don't assume:** Orbit anti-siphon valve ordered 08-15 not yet installed (daily 5 AM leak report runs until then); backyard PIR logs zero motion even at cool hours (not yet root-caused); **HA backup encryption key still exists only on this one PC** ("without it every iCloud backup is undecryptable"); garage camera reports no temperature/WiFi — "likely unplugged, needs a physical look."

---

### 13. `docs/CHANGELOG_ARCHIVE.md` — the compressed history, surfaced

Created in `fab5b30` (2026-08-16 07:18) — 183 KB, **98 entries**, header: *"Extracted from `CLAUDE.md` … because the Change Log had grown to 177 KB — 68% of a file that is injected into every single message. **Nothing was deleted.** Every entry below is verbatim."* Mirrored to `iCloudDrive\HCC-Archive\CLAUDE_CHANGELOG_FULL.md`. It is the project's full working memory, newest first. What it holds, era by era:

**The condensed early eras** (each one line, already compressed by the July hygiene passes before archiving):
- **06-23 → 06-29:** "Initial build-out — nav/modals, GPS persistence + calibration, LUX/CLIMATE integration, light/dark theme, hero-grade + design-token system, font unification."
- **07-01 → 07-07:** HA calls moved behind the `/api/ha` server proxy — "fixes the whole 'Beehive Offline' class of bug"; the shared-`AbortSignal.timeout` root cause ("never hoist one out of a retry loop"); water+gas meters live via RTL-SDR; first HA devices (Tuya plug, Sharky vacuum).
- **07-09 → 07-15:** Blink cameras live ("removed a stale `custom_components/blink` override — never re-add it"), CodeProject.AI local camera detection, Fire TV via ADB, iPad Safari-15 polyfill.
- **07-16:** CAR section (Mercedes GLE 350). **07-21:** CAR + Blink + Family Login live; the Cloudflare CDN-edge-cache root cause ("check `cf-cache-status` on the custom domain, not just `Cache-Control`"). **07-22:** "lesson: never guess entity/service names for an integration, read its actual source first." **07-23:** sewer billing calibrated; `water_billing_history` (24 cycles). **07-24:** F-250 vehicle switcher; "app must never send a `pin` field"; Fire TV pause via `media_session dispatch`, "not the no-op `keyevent 127`." **07-26:** garage-door card built app-side; myQ "permanently API-blocked by Chamberlain, no software fix exists." **07-28:** utility tiles validated against Jeff's real bills; "Recorder was dead 07-02→07-28 (missing `default_config:`)."

**The fully-detailed eras (07-31 → 08-15), 90 entries** — multi-kilobyte paragraphs each, preserving root causes, Jeff's words (see compendium above), and honest self-indictments. Highlights of what only the archive now holds:
- **07-31 (5 entries):** stability audit; automation-save root cause; RTL-SDR reboot; Fire TV/Blink popup fix + "Blink Auto-Heal" automation; PiPup picture-in-picture; water pit-radio item closed "per Jeff's decision"; Zigbee list delivered.
- **08-01 (12 entries):** 24h health check; **Angela's barn-arrival tracking "using her real drive as live validation"** and work-arrival tracking; Vizio soundbar `setup_retry` fixed via power-cycle "researched not guessed"; Lighthouse pass with "honest results" (images 12MB→7.1MB, "composite score unchanged"); the 27-element WCAG contrast finding and token darkening; **the water-meter false alarm and same-day retraction** ("Confirm water pit-radio fault via live irrigation+shower test" → "Retract water-meter fault diagnosis — meter is healthy, no WHUD call needed"); `zone.work` moved to the real parking garage (310 Commerce St — "only ~90m from the original office coordinates, not the ~0.4mi Jeff estimated — flagged to him"); leak-detection automations; Morning Digest built (and the removed always-zero "active alerts" metric — "removed that metric rather than ship a false 'all clear'").
- **08-02 (2):** the master disaster-recovery system Jeff asked for (*"save everything... it would be catastrophic to lose anything"*) — git layer confirmed-public check "caught a real live Weather.com API key hardcoded in `packages/hcc.yaml`'s `rest:` block, fixed by moving it to `secrets.yaml`"; HA backup encryption key flagged.
- **08-03 (12):** Fire TV Rewind/FF buttons; the real "Alexa fast-forward" root cause via HA source + Amazon forums (reserved phrase, GitHub issue home-assistant/core#87327); NOAA "paysite" link fix under a fully-blocked-egress sandbox; mower serial confirmed (wrong-serial-range eReplacementParts link fixed); camera 12-tiles fix; fixed camera display order ("front doorbell right under driveway"); LUX card moved to HOME and rebuilt as photo-overlay through three Jeff-driven iterations; YARD's two ready-to-mow cards merged; System Health folded in, Fitness removed ("he doesn't need the app to tell him that").
- **08-04 (4):** LUX login bugs (full 4-step Azure B2C flow was running on every call); duplicate account-form IDs; LUX never loading on normal open; iPad button scaling.
- **08-05 (12+):** hardware-inventory day (GaragePC TouchSmart 520-1020, Kitchen TV at $0 via Sling web on the wall iPad, KESU 500GB, Lenovo B570 "Pentium B960, encode/AI ruled out", Delam mic, WD 320GB, cast stick, mystery dongle = HDMI-to-USB capture stick, J45 has 4 USB ports not 2); the garage-door protocol test (dry-contact confirmed, not Security+ 2.0) and the part-selection walk ratgdo → Gelidus → SONOFF SV → **SONOFF MINI-D ("native Matter, no flashing")** that produced the never-name-products rule.
- **08-06 (17):** sewer-overcharge tracking bug (real B-Hyve data never saved to history); Electric SmartHub real data + the `recorder/statistics_during_period` and diff-of-sums fixes; **the deploy-branch mystery** (second repo `Toro-Timemaster-` — both repos' CLAUDE.md claimed to be the deployed one; settled live: Master-the-Master- is it, "do not develop on Toro-Timemaster-"); LUX refresh-token fix; the Luxury Glass Overlay revert-then-redo saga with all of Jeff's live art direction; utility photos regenerated without fake marketing copy; WHICH PHOTOS ARE REAL; Mercedes PIN correction chain (`473f122` options dict empty → `e3d6de2` RIS_PIN_INVALID → `eb0852f` attempt limit → `adcf16c` **remote start CONFIRMED WORKING from the app**).
- **08-08 (17):** smart-lighting plan logged (Kasa HS220/HS200 from Jeff's 2 PDFs "saved verbatim"); SONOFF MINI DRY setup researched ("Researched (not guessed) rather than repeat the 08-05 mistake pattern"); MyQ sale decision + Zigbee position sensor; the irrigation-hero-panel five-iteration repositioning thread; camera Refresh All silent-failure fix; the 560px frozen hero; the wall-iPad sideways saga ending in "it was MY OWN hero max-height/CSS edit from earlier today, reverted"; mower sensor heartbeat-erasing-mow-data fix → mow-to-mow history → **full raw reading log after Jeff "pushed back hard"** on the summary-only version.
- **08-10 (10 time-stamped entries, 3:55 PM → 7:10 PM CDT)** — the GPS marathon, minute by minute: yard map rebuilt (real explode bug), server-side coverage, raw-payload whitelist bug, real georeferenced satellite basemap, true-north + Fort Worth simulator bug, "blurry as shit" fixes, **"✅ CONFIRMED WORKING ON JEFF'S REAL DEVICE"**, the visits-not-accumulation redesign from Jeff's drift question, track smoothing, and **"🚨 MY BUG — the coverage map I built blew out localStorage and reset Jeff's hour meter to the 5.9 default; fixed + made unrepeatable."**
- **08-11 (4):** storage-time-bomb audit + deterministic hero sizing; head-cut-off fix; the full diagnostic sweep closing the light-mode contrast class (19 genuine failures, worst 1.09:1, "invisible in light mode"); **the coworker's hardware session: "mower box made maintainable; 6 real bugs, all found by running it against hardware."**
- **08-15 (1):** "coworker — full-stack audit + the backyard camera root cause" — the 60% AI confidence threshold silently discarding a night-IR person at 25.5% (**"A person in the back yard at night is currently undetectable"** — fixed branch-wide to confidence 25 in `fab5b30`).

---

### 14. What the memory file proves

Read end to end, the 274 revisions are a record of an AI being taught — rule by rule, failure by failure — by a nearly-60-year-old man who refused to let the project die. Every structural feature of the file maps to a specific wound: the Mandatory Rules to the 06-24 reckoning; the Debugging Protocol to the 07-03 run-around; Rule 13 to the capability gap; the sensor exception to re-bought hardware that was never broken; Rule 14 to a wrong timestamp; SETTLED DECISIONS to a $120 dimmer pitched twice; the archive split to 260 KB of memory crowding out the ability to think. And through all of it, the four messages from 2026-06-24 sit at the top of the file, byte-identical, under a rule that forbids ever compressing them — because, as the file itself says, *"They are the point of the whole project."*

---

### Appendix — complete revision ledger of CLAUDE.md (274 commits, oldest first)

Evidence: `git -C /home/user/Master-the-Master- log --reverse --format='%h %ad %s' --date=short origin/claude/time-master-project-liq1jw -- CLAUDE.md`

```
e8f0312 2026-06-23 Add CLAUDE.md — persistent project memory for all future AI sessions
90e556e 2026-06-24 Rewrite CLAUDE.md — comprehensive persistent memory with Jeff's rules, project plan, and full session history
f52b715 2026-06-24 Update CLAUDE.md — restore the working relationship commitment
6b7cd5d 2026-06-24 Update CLAUDE.md — document session 2026-06-24 full history
d404a92 2026-06-25 Update CLAUDE.md — session 2026-06-25 history, GPS sim, hero fix, B-Hyve debug
f814c01 2026-06-26 Update CLAUDE.md: session 2026-06-26 history, new sections, corrected state
94e2b34 2026-06-26 CLAUDE.md: mark LUX thermostat WORKING — live confirmed 2026-06-26
c72c8a8 2026-06-26 CLAUDE.md: full end-of-session save — LUX API docs, verified state, commit log
858cd74 2026-06-26 CLAUDE.md: log LUX set_sp 500 error as top pending item for next session
b035ffb 2026-06-26 CLAUDE.md: update session history, mark LUX PUT fix deployed, 26/26 tests
07409da 2026-06-26 CLAUDE.md: document LUX POST fix — POST /api/device is the write method
33ca88f 2026-06-26 CLAUDE.md: LUX setpoint control confirmed working — 72F set from HCC app
394217f 2026-06-27 Memory: log Jeff's Kamstrup 621 water meter project
9ced08f 2026-06-27 Memory: log whole-home utilities monitoring plan
731d435 2026-06-27 Memory: Jeff wired his own house — no electrician suggestions
2c91e09 2026-06-27 Memory: correct electric monitor spec to Shelly Pro 3EM-400
739e715 2026-06-27 Memory: DIY ATM90E32 energy meter build + bake-in hardware + automations
b243228 2026-06-27 Memory: Jeff's actual loads + monitor/control verdict
76d0326 2026-06-27 Memory: corrections from meter/panel photos
81e32b8 2026-06-27 Memory: panel scorching is a resolved pre-purchase issue, not active
43520a5 2026-06-28 Memory: hero-grade module is the gold standard for all sections
8b4c8a0 2026-06-28 Consistency Lock: semantic status tokens + statusColor() + design rules
a4ae337 2026-06-28 Memory hygiene: compress CLAUDE.md (737→550 lines) + add lean rule
1305f0a 2026-06-28 Protect the relationship sections — first and foremost, never compressed
28d79c6 2026-06-29 Add Light/Dark theme toggle (default light) for readability
8ac220a 2026-06-29 Redesign to Style A (Apple Clean): one font, white top-to-bottom
44ea8e8 2026-06-29 Light-mode sweep: white-ify all modals, popups & dark holdouts
c8ca302 2026-06-30 Archive Lucky Mike Smart Stall plan + technical review (queued, not built)
e50c9a4 2026-06-30 Lucky Mike: save optimized BOM + pricing/business plan (planning docs)
9fefa97 2026-06-30 Memory: confirm meter data + log critical water-pit radio finding
719638f 2026-06-30 Memory: confirm gas = Itron 100G ERT; clarify gas-vs-water radio attribution
42e84f3 2026-06-30 Memory: add reader-box placement + remaining-hardware notes
5102f14 2026-06-30 Memory: clarify Beehive/HA needs a radio; RTL-SDR-into-HA-host option
eec485a 2026-06-30 Memory: store Beehive hardware = Beelink J45 (Gemini) x86 mini-PC
ae337d4 2026-06-30 Memory: log the shopping answer — one RTL-SDR dongle (~$40) is the only new buy
711bad8 2026-06-30 Memory: add J45-as-brains architecture map + flag HA setup as foundational TODO
9a9da77 2026-07-01 Beehive: confirm J45 dedicated + add HA OS install guide; note working model
d5df6e9 2026-07-01 Memory: record definitive B-Hyve no-history finding + HA path
1d23b5d 2026-07-01 Memory: correct irrigation history — endpoint found (path form), not a dead end
b947011 2026-07-01 Memory: irrigation Last Watered confirmed working (reads 7:30 AM)
75c1a27 2026-07-01 docs: record AES meter-key storage decision (Apple Passwords, not Cloudflare)
5034f26 2026-07-01 docs: water meter blocker RESOLVED - unencrypted Itron ERT-SCM, no key needed
3b8b61a 2026-07-01 feat(home): add Utilities strip - Water / Gas / Electric branded cards
7a5e984 2026-07-01 feat(panic): redefine panic → sirens + lights + alert family (no 911 auto-dial)
4c9cf03 2026-07-01 docs: clarify alarm = DIY Zigbee build (not a commercial panel, not bought yet)
ac3abdb 2026-07-01 fix(home): utility banners show full image (no crop) + safety module refs
9100fcc 2026-07-02 docs: RTL-SDR needs no Windows drivers for HA (rtl_433 add-on has the driver)
4e75b37 2026-07-02 assets: save Security section hero art + note it as the build blueprint
f39b125 2026-07-02 docs: J45 migrated to internal drive + RTL-SDR meter setup guide (no drivers)
0f94198 2026-07-02 docs: water + gas meters LIVE via rtlamr2mqtt (confirmed IDs + protocols)
746ae94 2026-07-02 docs: log app meter wiring + weather hero/heat fixes
5e6c20b 2026-07-02 docs: Nabu Casa connectivity in progress + mPING is a dead end
947a99d 2026-07-03 mPING: direct link to official app; wire app to Nabu Casa remote URL
e1d29b0 2026-07-03 Utilities helper tiles + HA helpers/Alexa/weather guide
c55d382 2026-07-03 Pin Nabu Casa URL + WU station/key in project memory
b1bd4f1 2026-07-03 Note Beehive /setup completion in project memory
410ccc5 2026-07-03 Log Beehive-online milestone (CORS fix confirmed) in project memory
5c7aadc 2026-07-03 Log: real KTNWHITE21 weather live in HA via REST sensor (79F confirmed)
363ec81 2026-07-03 Memory: pick-up-here note for next session (Alexa expose + helper tiles)
a6d1e3b 2026-07-03 Memory: record the shared-AbortSignal timeout regression + fix
d6ba617 2026-07-03 Memory: document the /api/ha server-side proxy architecture
f668301 2026-07-03 Add PROTECTED Debugging Protocol: attack the source, test on my end first
586bf83 2026-07-03 Memory: Alexa reads real weather (goal complete); refresh next-steps
17d388a 2026-07-03 Memory: mark cameras (Blink) as Jeff's #1 priority; capture cookie fix + fallback
59c8749 2026-07-03 Memory: record real Blink root cause (blinkpy 202 2FA -> 0.25.7 bump)
74c88f3 2026-07-03 Memory: capture WHUD water bill reference (rates, cycle, meter) + reading mismatch
8a8803a 2026-07-03 Memory: log section restructure + batch of fixes
2a8a8a0 2026-07-03 Memory: water reading question resolved (transmitted reading authoritative; cost validated to bill)
8ee5658 2026-07-03 Memory: gas billing sync parked until Jeff's first Spire bill
5a8320c 2026-07-04 Add HOME GUARDIAN section — whole-home safety/security watch
ad3be81 2026-07-04 Fold LUX thermostat into HOME GUARDIAN; remove CLIMATE tab; new Guardian hero
9d4bf6e 2026-07-04 Add Lighting control card to HOME GUARDIAN
20ce92e 2026-07-04 Lights & Plugs card: control switch.* (SYLVANIA plugs), exclude irrigation
83f0240 2026-07-04 Add Tuya plug setup + HA-lighting-automation guide (docs/beehive)
3d33efa 2026-07-06 GPS map: one/two-tap 'Pin Track to Photo' (no coordinate entry) + MPU offline note
408fc96 2026-07-06 Master Hour Calibration (override + baseline re-sync) + pre-mow reset reminder
f0a9199 2026-07-06 Show 'set [date]' under the hour meter when hours are hand-calibrated
f010694 2026-07-07 Note: SYLVANIA plugs are locked to their app — dead end for HA (use Kasa/Zigbee)
e7d9ef9 2026-07-07 Add Robot Vacuum (Sharky) card + keep vacuum switches out of Lights & Plugs
a27982a 2026-07-09 Guardian banner explains ATTENTION/ALERT + calmer thresholds; fix 2 dead Weather links
bec7440 2026-07-09 Add Mandatory Rule 13 (coworker delegation) + record 404-risk link audit
fc62533 2026-07-09 Link audit closed: parts/manual deep-links verified live via coworker (no fix)
9a34d17 2026-07-09 Link audit closed (parts links verified live) + coworker context/coordination rule
9b29c1f 2026-07-09 Blink: record real root cause + official fix (blinkpy 0.25.6 / HA 2026.6.4); our custom override is now the blocker
7bbc8a2 2026-07-09 Blink cameras LIVE in the app (Jeff's #1 feature) — all 6 cameras confirmed; mark Pending #4 resolved
5ddac8a 2026-07-09 Camera full-control in app: Refresh All, per-camera snapshot/save-clip/arm panel; stills via signed entity_picture URL
80799e7 2026-07-09 Safety: gate panic alarm behind Beehive token so public visitors can't trigger it; route via /api/ha proxy
f474d9b 2026-07-09 Domain live: loewenhome.com + www Active/SSL, serving app (HTTP 200 worldwide)
9785381 2026-07-09 Memory: record Beehive fixed-IP on AT&T gateway + LAN inventory; correct wrong 5GHz-off notes
d2337b9 2026-07-10 Memory: AT&T ActiveArmor check done - nothing paused/blocked
dfaa88f 2026-07-10 Docs: capture camera-AI + home-theater plan (beast as AI/media brain, no subscriptions)
76ae463 2026-07-11 Log CodeProject.AI camera detection completion in change log
c926ceb 2026-07-11 Log Fire TV/HA pairing, alexa_media_player setup, loewenhome.com audit, and a found (unfixed) desktop layout bug
987e804 2026-07-11 Log confirmed-working Fire TV camera pop-up mechanism + File Editor add-on fragility
a88ccc6 2026-07-11 Fire TV motion pop-up alerts: built, deployed, and confirmed working end-to-end
049ad6d 2026-07-11 Add arrival-suppression automation, Angela's HA account, and an "almost home" alert
4b19147 2026-07-11 Expand AI camera detection from 3 to all 6 Blink cameras, confirmed working
6c26465 2026-07-11 Fix Siri Announce Notifications not reading AI camera alerts aloud
c13f101 2026-07-14 Audit: root-cause camera/Fire TV alert outage (CodeProject.AI service down 3 days), resolve TV-alert plan conflict
b108a6e 2026-07-14 Live-test Fire TV pop-up twice with AI pipeline healthy: still broken, root cause narrowed
25e3256 2026-07-14 Fire TV pop-up actually fixed: ADB browser launch instead of Alexa
3a714fe 2026-07-15 Fire TV pop-up: fix 5min Blink delay + fix relaunch resetting DVR playback
2965b5a 2026-07-15 Document real fix for Fire TV pause/resume: media_session dispatch, not keyevent
af3b16a 2026-07-15 Document the AbortSignal.timeout Safari-15 fix and why it crossed the app-code boundary
3644f54 2026-07-15 Document iPad wall-display setup and onn Roku TV investigation
3b157b9 2026-07-15 Correct iPad wall-display status: setup NOT actually complete, mid-diagnosis
5ed12f0 2026-07-16 Condense CLAUDE.md for coworker sync — 678→573 lines
d84ff94 2026-07-17 Update CLAUDE.md: CAR wired to live Mercedes data via mbapi2020
71cc052 2026-07-20 CLAUDE.md: log the service-worker cache-header fix + custom-domain follow-up
4fabef8 2026-07-21 CLAUDE.md: document Family Login setup + confirm it's verified working
6f517ac 2026-07-21 CLAUDE.md: correct root cause + mark stale-cache bug resolved
4e9445d 2026-07-21 CLAUDE.md: mbapi2020 install verified end-to-end, CAR section fully live
2fdef21 2026-07-21 Compress Change Log per file's own memory-hygiene rule (73.6KB->49.6KB)
e61e920 2026-07-21 Update CLAUDE.md — log window fix, hero fix, entity naming lesson
131dc16 2026-07-21 CLAUDE.md: log Sling switch handling + Alexa ad-skip wiring (coworker)
6aeba2f 2026-07-21 Update CLAUDE.md — log CAR lock cross-contamination fix
778f6bd 2026-07-22 Rewrite CAR commands with proper mbapi2020 domain services (researched from source)
ebd2a3a 2026-07-23 Update CLAUDE.md: water+sewer bill validation complete
5e6d616 2026-07-23 Update CLAUDE.md: billing history tracking added to changelog
8a9df3b 2026-07-23 Calibrate electric rates from CEMC bill, add Est. Cost tile
0d6c9de 2026-07-23 Calibrate gas rates from 3 Piedmont bills, replace rough estimate
15ca7d8 2026-07-24 Update CLAUDE.md: auto-refresh fix documented in changelog
c64d0f8 2026-07-24 Update CLAUDE.md: CAR PIN cleanup documented, pick-up-here updated
42b6c72 2026-07-24 Update CLAUDE.md: F-250 vehicle switcher documented
e20d3d5 2026-07-26 Update CLAUDE.md: garage door integration documented + ratgdo path
c94e7aa 2026-07-28 Document 07-28 utility fix, Energy Dashboard wiring, and MyQ dead-end
1f4008f 2026-07-28 Finish electric usage-pattern model (was documented but never committed in 07bd9a1)
1657df0 2026-07-28 Update CLAUDE.md: electric SmartHub integration documented, stale utility pending item closed
414c74f 2026-07-28 Condense CLAUDE.md: 610 -> 374 lines, cut stale/resolved detail per Jeff's request
281d65b 2026-07-28 Document water pit-radio hardware failure diagnosis (07-28)
d74c8e1 2026-07-30 Add pending item: wire real B-Hyve runtime into sewer-overcharge estimate
d4dd400 2026-07-31 Update electric rate constant — CEMC TVA fuel surcharge changed (07/30/2026 bill)
3f2808f 2026-07-31 Log 07-31 stability audit in Change Log
b4f11df 2026-07-31 Document 07-31 coworker fixes: automation-save root cause, RTL-SDR reboot, freeze warning removed
fd15642 2026-07-31 Document Fire TV/Blink camera-popup fix: root cause + Blink Auto-Heal automation
0b72961 2026-07-31 Audit note: clarify WHUD pit-radio status is unconfirmed vs the 07-31 RTL-SDR fix
a001f2e 2026-07-31 Document PiPup picture-in-picture integration + Blink watchdog hardening
13502b9 2026-07-31 Close out water pit-radio item per Jeff's decision, fix Pending Items numbering
a6a3f92 2026-07-31 Log 07-31 later-session work, close irrigation pending item, note Zigbee list delivered
98b47bf 2026-07-31 Log electric/water-flow data-accuracy checks — both confirmed working as designed
62e99b5 2026-08-01 24h health check + real fix for the old Fire TV automation + Mercedes GPS validated
66b3f49 2026-08-01 Build Angela's barn-arrival tracking using her real drive as live validation
762e714 2026-08-01 Fix Vizio soundbar setup_retry via power-cycle, researched not guessed
1596fc2 2026-08-01 Log Lighthouse work in Change Log, close out Pending Item 5 with honest results
2765386 2026-08-01 Build Angela's work-arrival tracking, mirroring the barn pattern
efd1be5 2026-08-01 Merge remote Lighthouse work with local Angela work-zone handoff note
b81474a 2026-08-01 Log 08-01 quality-tooling pass + contrast fixes, add remaining-gap pending item
bc3df2b 2026-08-01 Note zone.work radius gap: Angela parks ~0.4mi from the office address
0dc54d2 2026-08-01 Merge remote contrast-fix work with local zone.work pending-item note
fdc358e 2026-08-01 Darken --gold/--muted/--bad light-mode tokens to clear remaining WCAG contrast fails
593ddf7 2026-08-01 Confirm water pit-radio fault via live irrigation+shower test
fb5068c 2026-08-01 Retract water-meter fault diagnosis -- meter is healthy, no WHUD call needed
3537b00 2026-08-01 Fix zone.work to the real parking garage address, not the office
2770fee 2026-08-01 Close out leak-detection, Angela's tracker, and zone.work threads
f1d24f3 2026-08-01 Investigate PiP delay, confirm Blink notify + rain-skip already covered, build Morning Digest
552c699 2026-08-02 Document master backup/disaster-recovery system in CLAUDE.md
03e688b 2026-08-02 Flag HA backup encryption key as needing a durable off-PC copy
a5db5dc 2026-08-03 Add Fire TV Rewind/Fast Fwd remote buttons; audit Fire TV+HA code end to end
5bcbc6d 2026-08-03 Merge coworker backup/disaster-recovery work with Fire TV remote fix
d755a6a 2026-08-03 Document real root cause of "Alexa fast-forward" via HA source + Amazon forums
dd2c6fa 2026-08-03 Fix NOAA Weather Radio link (was a TuneIn search page); audit all app links
f07048f 2026-08-03 Document Fire TV PiP popup wrong-frame fix, verified live twice
d998302 2026-08-03 Document Alexa fast-forward fix and zero-cost feature brainstorm
1c69752 2026-08-03 Confirm mower serial number, fix wrong-serial-range eReplacementParts link
79b1d44 2026-08-03 Merge coworker Fire TV PiP fix docs with serial-number/link-audit fixes
83a23cd 2026-08-03 Fix camera views showing 12 tiles instead of 6 (clipframe helpers leaking in)
58d294a 2026-08-03 Add fixed camera display order, front doorbell right under driveway
87d2459 2026-08-03 Move LUX Thermostat card to HOME, right under cameras
aa38bc8 2026-08-03 Overlay live LUX thermostat data onto the device photo
e841657 2026-08-03 Redesign LUX photo overlay: full picture + proven glass-chip pattern
70d16f2 2026-08-03 Move all LUX controls into the fireplace area, add real outside temp/feels-like
f3ca8b6 2026-08-03 Merge YARD's two redundant "ready to mow" cards into one
ffa6b4b 2026-08-03 Fold real System Health into Ready to Mow, remove Fitness + pre-mow reminder
c46ae19 2026-08-04 Fix LUX thermostat requiring login repeatedly
a0936d6 2026-08-04 Fix duplicate account-form IDs in the Connected Accounts modal
d15079c 2026-08-04 Fix LUX never loading on a normal app open
7b60e43 2026-08-04 Note cheapest ratgdo-compatible garage door option in project memory
bcb6bf6 2026-08-05 Scale LUX + Utility card buttons/text with screen size (fixes tiny UI on iPad)
35553b4 2026-08-05 Correct J45 USB port count in project memory (4 ports, not 2)
19f80be 2026-08-05 Record GaragePC (TouchSmart 520-1020) plan and Kitchen TV feed decisions
8abb561 2026-08-05 Add KESU 500GB drive and Lenovo B570 laptop to hardware inventory
1400370 2026-08-05 Pin kitchen iPad as iPad Air 2 in project memory
b1525f7 2026-08-05 Kitchen TV solved at $0 — Sling web confirmed playing on the wall iPad
b4910c5 2026-08-05 Add Delam condenser mic and WD 320GB bare drive to hardware inventory
5ac9211 2026-08-05 Add cast stick and unidentified HDMI/USB dongle to hardware inventory
19a404c 2026-08-05 Confirm B570 CPU: Pentium B960, encode/AI ruled out, light roles fine
9eef792 2026-08-05 Mystery dongle identified as HDMI-to-USB capture stick
65d7e49 2026-08-05 Record garage door protocol test: dry-contact confirmed, not Security+2.0
7e4726a 2026-08-05 Simplify garage door purchase back to just the Gelidus board
10f0f13 2026-08-05 Correct garage door plan: drop ratgdo board, use cheap ESPHome relay
4bfacf3 2026-08-05 Correct garage door part to exact model: SONOFF SV, not Basic
f015867 2026-08-05 Switch garage door part to SONOFF MINI-D -- native Matter, no flashing
7f73148 2026-08-05 Add permanent rule: never name a product/model from memory unverified
7eebfd3 2026-08-06 Update sewer rate to match confirmed City of White House increase
330c74a 2026-08-06 Add Garbage/Stormwater as separate line items, keep sewer math pure
8158128 2026-08-06 Fix sewer-overcharge tracking: real B-Hyve data was never saved to history
3322153 2026-08-06 Write coworker handoff doc for sewer overcharge tracking verification
46ab304 2026-08-06 Electric SmartHub: real Today/Yesterday/Peak Hour + Last 7 Days panel
a82f0ce 2026-08-06 Update CLAUDE.md: Electric card layout/contrast fix documented in changelog
6e24295 2026-08-06 Close out deploy-branch mystery: Master-the-Master- confirmed live 08-06
af230cd 2026-08-06 Fix desktop/TV hero gap (Pending Item 7) + full cross-format QA pass
5c41c8d 2026-08-06 Fix real Electric SmartHub bugs found by coworker's live HA verification
0827617 2026-08-06 Irrigation: apply real measured GPM calibration from coworker (zones 1/2/5)
7cccc59 2026-08-06 Note zones 1/2/5 are the front yard (what matters); 3/4/6 back yard genuinely low priority
3ff1eec 2026-08-06 Utility stat chips: blend into the photo, size bump
42ff38d 2026-08-06 Match LUX fireplace-panel styling to utility card chip edges
4464d87 2026-08-06 Add photo-overlay bevel so data panels sit naturally on the photo
468e6a1 2026-08-06 Apply luxury glassmorphism framework to LUX + utility photo overlays
d6514f6 2026-08-06 Fill in the 4 missing steps from the Glassmorphism Guide checklist
f4290d7 2026-08-06 Apply every glassmorphism ingredient to every overlay element
53f697f 2026-08-06 Fix Gas/Electric photos: baked-in icon row colliding with stat chips
2bf50db 2026-08-06 Revert Luxury Glass Overlay redesign back to original photos
7b5ee1d 2026-08-06 Remove the single-cycle "Sewer overcharge" note from the Water card
34c90ac 2026-08-06 Stop wiping saved LUX credentials on transient login errors
1707cf4 2026-08-06 Use the LUX refresh token instead of re-logging-in from scratch
30d1df3 2026-08-06 Luxury Glass Overlay: rebuild LUX + utility photo overlays
67ba0b5 2026-08-06 CLAUDE.md: correct the LUX panel description to the shipped values
6bd7217 2026-08-06 Utility cards: rebuild to match the LUX card
893bd8b 2026-08-06 Utility readouts: drop the boxes, blur the field, keep the logos
45485f0 2026-08-06 Regenerate the three utility photos without the fake marketing copy
384c07d 2026-08-06 Move the utility card text onto the photo
db9ffcc 2026-08-06 CLAUDE.md: record which photos are real, and never to strip Jeff out of them
473f122 2026-08-06 CLAUDE.md: correct the Mercedes PIN claim - the options dict was empty
e3d6de2 2026-08-06 Mercedes PIN: real root cause is RIS_PIN_INVALID, not a missing PIN
eb0852f 2026-08-06 Mercedes remote start: Mercedes enforces an attempt limit between key starts
adcf16c 2026-08-06 Mercedes remote start CONFIRMED WORKING from the app
ac38933 2026-08-08 Log Jeff's smart lighting plan, flag one real issue before ordering
f099165 2026-08-08 Merge parallel-session work (Mercedes/car/weather/irrigation photo overlays, glass redesign) with lighting-plan doc commit
8d53af4 2026-08-08 Research + write the SONOFF MINI DRY garage door setup plan
feee336 2026-08-08 Resolve garage door install placement, MyQ coexistence, power source
f84f8d8 2026-08-08 Log MyQ sale decision, research + recommend a Zigbee position sensor
22fd9e1 2026-08-08 Fix photo-overlay readouts to scale correctly on web/TV widths
4c3380e 2026-08-08 Fix Garden zone's missing live photo, make zone cards responsive
20ca199 2026-08-08 Add Watch Sling chip to Guardian's Quick Actions
a1a65fe 2026-08-08 Wire garage door app-side for the SONOFF MINI DRY relay + future sensor
c997266 2026-08-08 Verify camera fresh-picture refresh; fix silent Refresh All failures
5d22cf7 2026-08-08 Fix hero photo frozen at 560px across nearly the whole iPad-landscape range
480afd2 2026-08-08 Move irrigation hero panel off Jeff onto the clear bottom strip
436ce61 2026-08-08 Reposition irrigation hero panel to bottom-right per follow-up
a3caae3 2026-08-08 Widen irrigation hero panel to full-width bottom bar
f70a23f 2026-08-08 Add Smart Zones to the irrigation hero panel
c214610 2026-08-08 Align irrigation hero panel sizing with the other hero readouts
28de83e 2026-08-08 Merge B-Hyve Intelligence + Lawn Water Need into one card
dcfa39b 2026-08-08 Fix Mercedes dashboard readout bleeding onto the F-250 truck photo
e988eaa 2026-08-08 Drop watering-verdict banner, fix idle status showing as a warning
9c415ab 2026-08-08 Add Braves Vision quick-action chip to Guardian
9da43a5 2026-08-08 Add self-healing CSS auto-rotate for wall-mounted iPad kiosk
24136c7 2026-08-08 Revert speculative auto-rotate CSS for wall iPad
bb9d1cf 2026-08-08 Revert hero max-height clamp() - regression per Jeff's timeline
60c5d28 2026-08-10 Fix mower sensor heartbeat erasing the whole mow's data
723eeab 2026-08-10 Add real mow-to-mow sensor history, not just a preserved snapshot
ee21a1e 2026-08-10 Add full raw sensor reading log - every field, every reading
a2779b5 2026-08-10 Add permanent rule: check real date/time, never assume
7adc108 2026-08-10 Rebuild yard map: fix the real explode bug + cumulative coverage
5a0cea9 2026-08-10 Move GPS coverage server-side so it records automatically
333adcf 2026-08-10 Log the full raw sensor payload - fix whitelist dropping real data
5959b55 2026-08-10 Real georeferenced satellite basemap - alignment eliminated
6d37ff0 2026-08-10 True-north confirmed, GPS outlier rejection, fix Fort Worth sim bug
f29e517 2026-08-10 Fix yard map framing and blur; add sharper imagery source
1d6c109 2026-08-10 Record: satellite yard map confirmed working on Jeff's real device
d3749b9 2026-08-10 Coverage counts visits, so the map sharpens instead of bloating
68f4b7b 2026-08-10 Add GPS track smoothing and a forgot-to-resume pause safety net
b568a4b 2026-08-10 Fix: coverage map blew out localStorage and reset the hour meter
86b47e6 2026-08-11 Audit out the next storage time bomb; deterministic hero sizing
e5d57f4 2026-08-11 Keep Jeff's head in frame on the yard hero
af6df04 2026-08-11 Close the light-mode contrast bug class (pending item 17)
d18db7b 2026-08-11 hours.js: make the mow history actually record, and stop mapping parked drift
176ec08 2026-08-11 CLAUDE.md: firmware is in the repo now, and the box takes commands
46c7450 2026-08-14 CLAUDE.md: single-session mode - beast/coworker session now owns app code too (Jeff's call 08-14)
7a1d250 2026-08-15 Audit 2026-08-15: security headers, backyard AI threshold finding, doc corrections
fab5b30 2026-08-16 Restructure CLAUDE.md 260KB -> 58KB; all six cameras to confidence 25
007e14e 2026-08-16 ﻿CLAUDE.md: close stale Pending Item 19 (garage switch) - superseded by Inovelli
c30b64d 2026-08-16 ﻿CLAUDE.md: add SETTLED DECISIONS section - the current lighting/mesh plan
c05d647 2026-08-16 ﻿CORRECTION: the Kasa+plugs plan WAS documented - point everything at it
```


---

## The Beehive Papers — every doc under docs/beehive and the top-level references

"Beehive" is Jeff's name for the Home Assistant instance that became the house's brain — first run precariously off a flaky external USB drive, then (2026-07-02) migrated onto the internal drive of a dedicated **Beelink J45 (Gemini) mini-PC** (Intel Pentium J4205, ~8GB RAM, ~128GB storage, 4× USB 3.0). The `docs/beehive/` folder is the operating manual, decision log, and scar-tissue record for everything Home-Assistant-side: the OS install, the meter radios, the camera AI pipeline, the Apple TV popups, the Alexa cleanup, the garage door, the Zigbee alarm plan, and the panic button. Two top-level files — `docs/BEEHIVE_REFERENCE.md` and `docs/UTILITIES_REFERENCE.md` — are verbatim extractions of the corresponding CLAUDE.md sections, moved out on 2026-08-16 07:46 when CLAUDE.md was slimmed from 260KB to 58KB (commit `fab5b30`, 2026-08-16, "Restructure CLAUDE.md 260KB -> 58KB; all six cameras to confidence 25").

Recurring cast, so the docs below make sense:

- **Beehive** — Home Assistant OS on the J45. Local URLs `http://homeassistant.local:8123` / `http://192.168.1.66:8123`; remote via Nabu Casa `https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa`.
- **The beast** — Jeff's main Windows PC at `192.168.1.194` with a GTX 1050 Ti; runs CodeProject.AI for camera object detection.
- **Clyde / "the coworker"** — the local Claude Code session running on the beast, which (unlike the cloud session) has real LAN access to Beehive. The cloud session writes exact instructions; Clyde or Jeff executes them.
- The `docs/beehive` PDF (`Alexa_Command_Card.pdf`) is the print twin of `alexa_command_card.html`; the HTML was read as the source of record here.

All 19 files under `docs/beehive/` (18 readable + the PDF twin) plus both top-level references are covered below, each with its git provenance.

---

### Foundation: the J45, the meters, and the helper layer

#### `docs/beehive/HA_OS_setup_J45.md` — the OS migration walkthrough (SUPERSEDED — completed 2026-07-02)

Added in commit `9a9da77` (2026-07-01, "Beehive: confirm J45 dedicated + add HA OS install guide; note working model"), progress-stamped in `98b9fd9` (2026-07-01, "docs: J45 progress — backup done, Ubuntu 26.04 boot stick made").

What it records: the complete, hand-holding, step-by-step plan to get HA OS off the flaky external USB drive and onto the J45's internal ~128GB drive — written deliberately slow-paced ("Budget ~45–60 min. Go slow; every step is simple. Stuck on one → screenshot it, send it."). Key facts and decisions preserved in it:

- The J45 was a **drawer-era Windows 10 machine**; the doc explicitly authorizes wiping it ("nothing on it matters").
- **Step 0 backup first** — HA backup named `before-reinstall`, downloaded off-box before anything else.
- The stuck point that cost real time: the boot stick's "stuck protected partition," fixed via `diskpart clean` before Rufus would work. Boot stick ended up 16GB, **Ubuntu 26.04 desktop**.
- Single-stick path: download the HA OS `.img.xz` + Balena Etcher *inside* the live Ubuntu session (ethernet), so one stick suffices.
- Safety property called out explicitly: "the external HA drive is never touched, so an interrupted install can't leave Jeff worse than he is now."
- Beelink boot-menu key is usually **F7** (sometimes DEL/ESC/F12); Secure Boot may need to be turned off; internal target is usually `/dev/mmcblk0`.
- The stated payoff: "That 'it just comes back' reliability is the whole point of doing this," and freeing **both USB ports** for the RTL-SDR.
- Closing sequencing rule: "**Then, and only then:** RTL-SDR in → rtl_433 add-on → gas meter reads → water meter → Water/Gas cards in the HCC app. Foundation first."

Status: **historical/completed.** The migration finished 2026-07-02 (commit `f39b125`, "docs: J45 migrated to internal drive + RTL-SDR meter setup guide (no drivers)"); BEEHIVE_REFERENCE confirms "running HA OS off its **internal SSD** (migrated off a flaky external USB drive 2026-07-02 — external is retired, don't reintroduce it)." A future session should never suggest the external drive again. Note the doc's "2 USB ports" framing was later corrected — Jeff confirmed 08-05 the J45 has **4× USB 3.0 ports** (BEEHIVE_REFERENCE).

#### `docs/beehive/rtl_sdr_meter_setup.md` — water + gas meters over radio (CURRENT for facts; setup complete)

Created `f39b125` (2026-07-02), updated same day with live results (`0f94198` "water + gas meters LIVE via rtlamr2mqtt (confirmed IDs + protocols)", `86c1990` "confirm meter calibration vs physical dials (water /10 gal, gas /100 ccf)"), entity-name fix `a101465` (2026-07-03, "correct meter entity ids to *_reading").

What it records — the load-bearing meter facts a future session must not re-derive:

- **Water meter:** Itron `100WD` MIU, ERT-SCM, endpoint/ERT ID **`79453337`**, **unencrypted**; protocol is **`scm+`** — "NOT plain scm — that's the key." Raw reading `129105` at go-live.
- **Gas meter:** Itron 100G ERT, ID **`33393066`**, protocol **`scm`** ("barcode on the Itron 100G matched exactly"), raw `883384`. Physical meter is an Elster AC-250.
- **Calibration, verified against the physical dials 2026-07-02:** water raw **÷ 10 = gallons** (raw `129105` → 12,910.5 gal vs LCD 12,914.94 — gap explained by usage between reads and 0.1-gal SDR resolution vs 0.01 LCD); gas raw **÷ 100 = CCF** (8,833.84 vs dials ~8833). "1 CCF ≈ 1.037 therm for Piedmont $."
- The **working rtlamr2mqtt config** is pasted in full (sleep 60s, both meters, listen_mode off). Discovery tip preserved: `listen_mode: true` + `meters: []` logs every neighborhood meter — "That's how we found the protocols/IDs." Reception "excellent (SDR hears ~20 neighborhood meters). rtlamr center 912.6 MHz."
- **Entity-name trap (fixed 07-03):** rtlamr2mqtt creates both `sensor.water_meter_reading` and `sensor.water_meter_last_seen`. "⚠️ Read the `_reading` entity, NOT `_last_seen` — a timestamp parseFloats to 2026 and showed 202.6 gal (fixed 07-03 in `meterRaw`: skip `*_seen`/timestamp entities, require a pure number)." This was a real shipped bug.
- **Driver rule, in bold:** "Do NOT download Zadig / SDR# / WinUSB." Those are Windows-only; the add-on ships the Linux driver, "Nothing to install, nothing to download."
- Sequencing: install Mosquitto broker first (add-on store, start-on-boot + watchdog, MQTT user), then rtlamr2mqtt from repo `https://github.com/allangood/rtlamr2mqtt`.
- Gotchas: Kamstrup-side timestamps are **European** — convert to `America/Chicago`; meters are cumulative odometers, so today/month/flow come from HA utility_meter/derivative helpers; "the water gallons here feed the City-of-White-House sewer-overpayment numbers."
- Fallback decoder if rtlamr2mqtt fails: rtl_433 (`-R 149` SCM, `-R 151` SCM+).

Status: **live and current** — the IDs, protocols, and calibration divisors are permanent facts. The "STILL TO DO (app polish)" list (app-side ÷10/÷100, helpers, `UTIL_ENTITIES`) was subsequently completed (see `ha_helpers_and_alexa.md` and UTILITIES_REFERENCE below).

#### `docs/beehive/ha_helpers_and_alexa.md` — helper recipes + first Alexa hookup (PARTIALLY SUPERSEDED)

Created `e1d29b0` (2026-07-03, "Utilities helper tiles + HA helpers/Alexa/weather guide"), fixed same day (`338e2c3` timestamp-sensor fix; `0b3de03` "Weather guide: HA has no built-in WU integration; use REST sensor on our /api/weather").

What it records: click-by-click HA instructions Jeff followed on his phone, with a hard rule up front — the HCC app reads these helpers **by exact name**: "**name them EXACTLY as written** and the app's tiles light up on the next refresh."

- **PART 1 — unit conversion templates:** `Water Gallons` (`sensor.water_gallons`, raw ÷10, device class Water, state class Total increasing) and `Gas CCF` (`sensor.gas_ccf`, raw ÷100).
- **PART 2 — Utility Meter helpers:** `Water Month` / `Gas Month` (monthly reset; the app reads `sensor.water_month` / `sensor.gas_month`).
- **PART 3 — Derivative helper:** `Water Flow` (`sensor.water_flow`), input `sensor.water_gallons`, **5-minute time window**, unit minutes. This 5-minute smoothing window later mattered: UTILITIES_REFERENCE records the 07-31 "0.2 gpm with nothing running" investigation concluding **NOT a bug** — a toilet flush averaged over the window, "Working as documented."
- **PART 4 — `Gas Cost` template** using a Piedmont $/CCF placeholder of **$1.05** ("replace `1.05` with your real number"; the validated all-in rate later became $1.235/therm — see UTILITIES_REFERENCE). Optional `Water Cost` "feeds the sewer-refund case."
- **PART 6 — Alexa:** (A) Nabu Casa cloud → Alexa skill → **Expose** tab, with the advice "Start small — a few lights + the thermostat" (advice that was NOT followed — the exposure list bloated to 67 entities and had to be cleaned up 08-14, below); (B) announcements via either Alexa Routines with virtual toggle flags (`Alexa Panic Flag` pattern — "rock-solid, best for a few fixed alerts") or the HACS Alexa Media Player integration ("occasionally needs a re-login, so use B1 for the critical panic alert").
- **PART 7 — the weather-station fix:** Jeff's complaint that Alexa's weather is "never right" is explained — Amazon uses its own regional provider and "That built-in answer can't be replaced (Amazon owns it)." The fix: a REST sensor pointed at the project's own `https://toro1-5rz.pages.dev/api/weather` (Jeff's real **KTNWHITE21** station with Open-Meteo backup), creating `sensor.backyard_temperature` / `_feels_like` / `_humidity` / `_wind`, exposed to Alexa so "Alexa, what's the backyard temperature?" reads the real value. Important negative finding preserved: "current HA has **no built-in Weather Underground integration** (removed years ago when WU locked down their API — it won't appear in Add Integration)." A WU API key is recorded in the doc as an alternative HACS path: `0e87ee079c0147a787ee079c01d7a75d`, station `KTNWHITE21`.

Status: helpers built and live (the Water Flow helper is cross-referenced as real in UTILITIES_REFERENCE). The Alexa Part 6A guidance is **superseded in spirit** by the 08-14 exposure-cleanup discipline; the Backyard sensors survived the cleanup and are on the 08-15 command card and in HomeKit.

---

### The camera / AI / TV-popup chain

#### `docs/beehive/camera-ai-setup.md` — the original CodeProject.AI plan (SUPERSEDED as procedure; architecture stands)

Created `4cd8184` (2026-07-10, "Docs: staged CodeProject.AI smart-camera detection setup for the beast (Clyde-ready)"), notify target confirmed same day (`65e029b`, "use confirmed notify target notify.mobile_app_jeffs_iphone").

What it records: the staged plan that became the camera AI pipeline. "Goal: turn Blink 'motion' alerts into **'Person / Car / Animal at [camera]'** using local AI on the beast's **GTX 1050 Ti**. No Blink fee, no cloud." Architecture: Blink motion → Beehive grabs a snapshot → CodeProject.AI on the beast (`192.168.1.194:32168`, GPU) → HA smart notification. "Beehive stays light; the beast does the AI."

- Process rule embedded in the doc: "Do this in STAGES and verify each one before the next (**Jeff hates big-bangs that break**)."
- Stage 1: install CodeProject.AI on Windows, enable Object Detection (YOLO) in GPU/CUDA mode, verify with `nvidia-smi`; fallback to an older YOLO module or CPU if the Pascal card is refused. Stage 2: open TCP 32168 in Windows Firewall, `curl .../v1/status/ping`. Stage 3: HACS `codeproject_ai_object` `image_processing` platform, `scan_interval: 604800` ("effectively 'never auto-scan'; we scan on demand"), targets person/car/truck/dog/cat. Stage 4: the per-camera automation — `blink.trigger_camera` → 7s delay ("Blink upload lag") → `image_processing.scan` → templated notify. Stage 5: expand to Driveway, Front Right, Back Left, Backyard, Garage.
- Honest caveats preserved: default YOLO **doesn't know "package"** (community package model or LLM Vision later); "**Battery:** … don't add aggressive periodic scanning (drains camera batteries)"; config keys version-dependent — "Clyde: verify against its README and adjust; don't assume."
- Division of labor: Clyde + Jeff do the HA/beast stages ("Clyde treats app code as READ-ONLY"); the cloud session does app-side "last seen" surfacing.

Status: **the architecture shipped and is verified** (see `camera_pipeline_VERIFIED_2026-08-15.md`), but the doc's entity names were placeholders and its automation shape evolved substantially (mute helpers, cooldowns, annotated-image archive, template doorbell sensors). Use the 08-15 verification record, not this plan, for how the pipeline actually works today.

#### `docs/beehive/alert_fatigue_fix_2026-08-14.md` — the failure loop that killed the cameras (CURRENT, with one 08-15 correction)

Commit `eba1648` (2026-08-14, "Beehive: alert fatigue fix - garage motion off, new 5-min per-camera cooldown automation; root cause was Blink disarmed (silent total outage since 08-10)").

What it records — arguably the single most important behavioral finding in the folder. While chasing an Apple TV question, the session discovered "**the entire camera pipeline had been dead since Aug 10 11:16** — zero motion events across all six cameras for 48 h. Root cause was NOT a bug: **Jeff had the Blink system disarmed**, because the notifications never stop." The failure loop, verbatim:

> too many alerts -> Jeff disarms -> ALL camera automation silently stops -> no security at all

"A disarmed Blink produces no error anywhere. `alarm_control_panel.blink_loewen301` is the only place it shows." The doc flags surfacing that state in the app's Guardian section so "why did the popups stop?" is answerable at a glance.

Fixes applied 08-14:

1. **Garage motion detection turned OFF permanently** (`switch.garage_camera_motion_detection`). Jeff's verbatim words: **"I don't need motion in the garage at all"** — the camera is mains-powered so it ran constantly and "fired 6 times in 7 minutes while he was simply working in there."
2. **New automation `automation.hcc_ai_alert_cooldown`**: triggers on `codeproject_ai.object_detected`, waits 5 s (deliberate — lets the notify/popup automations finish their own mute check first, "avoids a race where the cooldown suppresses the very alert that caused it"), then, only if the camera isn't already muted, sets `input_datetime.hcc_ai_mute_<camera>` to now + 5 minutes. Design decision recorded: it "**Deliberately does NOT extend an existing mute**, so sustained activity yields **one alert every 5 minutes** rather than silence — a prowler still generates repeat alerts." It rides the existing mute plumbing (hcc.yaml lines 200 and 371 gate both phone notify and Fire TV popup).
3. Tuning knob: the single `timedelta(minutes=5)` in that automation.

Still open at writing: presence-based suppression ("the biggest remaining reduction, not yet built") and per-camera object rules ("driveway VEHICLE at 2 AM matters; back yard PERSON at 8 PM is Angela").

**Correction a future session must know:** `camera_pipeline_VERIFIED_2026-08-15.md` later found the **mute/cooldown system "had NEVER worked"** — two bugs (a `_clipframe` suffix in `camera_key` writing mutes to nonexistent helpers, and a string-truthiness bug) meant the mechanism this doc describes only actually functioned from 2026-08-15 16:30 onward. The 08-14 doc records the design; the 08-15 doc records the first time it really ran.

#### `docs/beehive/camera_pipeline_VERIFIED_2026-08-15.md` — the permanent verification record (CURRENT — the authority)

Commits `c5a6aab` (2026-08-15, "Camera pipeline verification record 2026-08-15 — measured, photographed, per-camera status") and `dea7e75` (2026-08-15, "Option B shipped: popups fire on confirmed AI detections via template doorbell sensors").

This doc was written *specifically for future sessions like this archive*: "**This is the permanent record.** Every claim below is backed by a timestamp from HA's own history API or a photograph of the physical Apple TV screen … **If a future session doubts whether this was ever set up and proven: it was, on this date, as follows.**" Evidence photos (Jeff appears in them, so they're kept **out of the public repo**) live at `iCloudDrive/HCC-Photos/camera-verification-2026-08-15/` — five named files including `annotated_person_94.7pct_doorbell.jpg`.

Measured performance (real events): motion → AI red-box file written **8 seconds** (5+ events, 4 cameras); motion → popup visible on the Apple TV **4.7–6 s** (3 events photographed); detection → phone push + Fire TV popup + cooldown + archive **≤1 second**; Blink cloud round-trip via `trigger_camera`, for contrast, **67 s**.

Per-camera status: 301 Front Doorbell and 301 Driveway fully live-verified and photographed; Front Right and Back Left live-verified (popup mechanism proven, not photographed); **301 Backyard is the one exception** — "chain configured identically, **PIR never fired on either walk** … Not a config fault — the sensor did not see Jeff's path twice. Fix = aim/sensitivity in the Blink app. Weakest WiFi too (−65 dBm)." Garage: "motion OFF by Jeff's choice … camera reports no temp/wifi — may be unplugged."

The four fixes of 2026-08-15, each a trap for future sessions:

1. **The self-inflicted feedback loop:** that morning's HomeKit image swap also repointed the `image_processing` sources, so "the AI scanned its own annotated output and detection went dead while every health check read green." The fix and standing rule: "scanners on `camera.*_clipframe` (clean input), HomeKit on `camera.ai_*` (annotated output). **This split is load-bearing — never point the scanners at `ai_*`.**"
2. **"Mute/cooldown system had NEVER worked"** — the two bugs above, fixed in `packages/hcc.yaml` and the cooldown automation. "First successful mute writes in the system's history: 16:30 (manual test, 5 min) and 16:37–38 (walk: back_left 30 min because someone home + back camera; front cameras 5 min) — the differentiated behavior working exactly as designed."
3. **Clip archive:** `blink.save_video` "had overwritten one fixed file per camera forever." Now every detection copies its clip to `/config/www/blink_archive/<cam>_<timestamp>.mp4` (+ manifest.txt), pruned to 7 days at 03:30 on Beehive, mirrored nightly at 04:00 to `D:\HCC-Clip-Archive` on the beast via `Pull-ClipArchive.ps1` (scheduled task). "First six clips — Jeff's verification walk — archived and mirrored the same minute."
4. **Watchdogs:** pipeline-stall watchdog (motion with no scan in 2 min → "names the sync-module/USB cause"), overnight water check (1 AM baseline → 5 AM alert over 3.5 gal — thresholds derived from the "flush=1.2 gal / ice=0.1 gal signature work"), spring valve reminder.

The verification method itself is a Jeff-mandated project standard: a **Razer Kiyo Pro** on the beast aimed at the Apple TV, capturing a frame every ~0.9 s with millisecond filenames, cross-referenced against HA history. "**Component checks (bridge loaded, config valid, camera serves an image) said 'healthy' through every one of the day's real failures. Only watching the far end of the pipeline caught them.** This rig is the project's regression test; **Jeff's rule.**"

Also recorded: the popup-lag decision — "**DECIDED AND SHIPPED same evening: Option B.** Popups now ride trigger-based template sensors (binary_sensor.ai_doorbell_*) fired by the AI detection event, so the annotated image exists BEFORE the ring and false motion never pops the TV." Jeff's verbatim reason: **"'What good is an old picture?' — Jeff**. Open items so the doc "never overclaims": backyard PIR aim, driveway road-mask, Blink app notifications off (Jeff's phone); optional back-camera popup photos; and a `pyhap` `SecuritySystemState value=0 invalid` warning on the Apple Home alarm tile ("unexpose the alarm from the HCC Home bridge if it misbehaves").

---

### The Apple TV / HomeKit arc (all 2026-08-14/15)

#### `docs/beehive/appletv_switchover_2026-08-14.md` — research + test plan (SUPERSEDED by the SOLVED doc, but full of do-not-repeat research)

Four commits on 2026-08-14: `c95457a` (research + HomeKit Bridge test rig), `0e9a2e4` (annotated-image requirement), `3fd9988` ("restore file paths mangled by shell quoting" — a small self-inflicted doc corruption, fixed), `05df625` (fixed-filename discovery).

Why: "Fire TV Stick is slow, needs constant cache clearing / app offloading, and freezes. Jeff wants his Apple TV 4K back as the living-room box. **Only 3 HDMI ports** (ARC/soundbar, the beast, Fire TV) so it is a straight SWAP — cannot run both." Clarified requirement: "NOT live video. A **single still image** of whatever triggered the motion is fine."

Dead ends researched and killed — do not re-litigate:

- **Jailbreak — DEAD, do not pursue.** The device is an "Apple TV 4K (gen 3), tvOS 18.6" = A15 chip; checkra1n/palera1n depend on the `checkm8` bootrom exploit which only reaches Apple TV HD and 4K gen 1. "And no PiPup-equivalent overlay app exists for tvOS anyway — a jailbreak would give a shell, not the feature."
- **Blink RTSP bridges — NOT WORTH IT.** `roger-/blinkbridge` (~30 s added latency, documented) and `femmeXFMR/blink-rtsp-mqtt-bridge` (5-minute refresh) both fake a stream by looping a still, "ON TOP of Blink's existing cloud delay, so popups would get SLOWER." Both hobby projects (16 commits/11 open issues; 4 stars/10 commits), both want the Blink password in a config file, one warns of server bans.
- **HomeKit snapshot route — PLAUSIBLE, being tested** — with the honest unknown stated: "**UNPROVEN:** whether tvOS renders its picture-in-picture popup for a snapshot-only camera … Nobody online answers this specifically. Must be tested."

Setup done 08-14: HomeKit Bridge entry `01M009BBVWASB0YGP61S7Z4XXF` ("HASS Bridge:21064"), **scoped deliberately narrow** to only `camera.301_driveway_clipframe` — "(Avoids an Alexa-style flood into the Home app.)"

The **annotated-image requirement**, flagged in caps mid-doc: "⚠️ ANNOTATED IMAGE REQUIREMENT (Jeff, 08-14) — READ BEFORE FINISHING. Jeff confirmed what he actually likes about the current popup: **it fires essentially at the same time as the trigger, and it shows a RED BOX around the detected object with the confidence %.**" The clipframe is the RAW frame fed *into* the AI — staging it for HomeKit would lose the box. Resolved same day via the Studio Code Server terminal: "the annotated file HAS a fixed name — `/config/www/ai_snapshots/codeproject_ai_object_<camera>_clipframe_latest.jpg`, overwritten on each detection … Verified by listing the folder and pulling back_left_clipframe_latest.jpg (467 KB, red box, 'person: 79.7%'). **No copy step needed.**"

Jeff's actual complaint, quoted so nobody "fixes" the wrong thing: "Jeff says the popup timing is already good — his complaint is RELIABILITY (**'half the time it doesn't come through'**), not latency. Do not 'fix' the timing."

The zero-cost test plan used the **bedroom** Apple TV ("Main Bedroom (2)") before touching the living room — pairing code **937-37-048** (accessory `301_driveway_clipframe:21069`). The doc also pre-recorded the timing caveat that Blink motion fires ~8 s before frame extraction, so linking raw motion would pop the *previous* frame — the eventual Option B template-sensor fix (08-15) is exactly the "helper the AI automation pulses after extraction" foreshadowed here. Rollback plan: delete the config entry + remove the accessory; "the Fire TV setup is completely unaffected and keeps working throughout."

#### `docs/beehive/appletv_popup_SOLVED_2026-08-14.md` — the doorbell trick (CURRENT — the key mechanism)

Commit `9426623` (2026-08-14, "SOLVED: Apple TV camera popups - linked_doorbell_sensor is the key (motion alone never interrupts the screen)").

The insight, verbatim: "**`linked_motion_sensor` alone is NOT enough.** Motion earns a phone notification but does NOT interrupt the TV. HomeKit reserves the picture-in-picture screen takeover for **DOORBELL** events … **Fix: point `linked_doorbell_sensor` at the SAME motion sensor.** Motion then 'rings the doorbell' and tvOS renders the popup." Working YAML is pasted (bridge `HCC Cameras`, port **21081**, `linked_doorbell_sensor: binary_sensor.301_driveway_motion` annotated "# <-- THE ONE THAT MATTERS"). Requires **full HA restart** — "YAML homekit does not hot-reload."

Diagnostic for success before testing: the Home app accessory shows **two services** (doorbell + motion icons) and Apple starts offering a "Single Press" automation, "which only exists for doorbells." Other verified requirements: Apple TV as Home Hub; per-camera Activity Notifications on (Time=Any, People=Off); "Show on this Apple TV = On"; the Apple TV should be **playing** something ("a popup overlays content").

"Traps hit along the way (do not repeat)": (1) creating the bridge in the **UI** made 13 separate config entries — deleting "the bridge" left 12 orphans still advertising, "Home app offered a dozen pairing codes. Delete every `homekit` config entry, not just the bridge." (2) `ha core reload` does NOT reload automations in packages and does NOT load YAML homekit — use `automation.reload` / `ha core restart`. (3) Each rebuild generates a NEW pairing code. (4) "Cameras with no linked motion sensor show **no 'Activity Notifications' option at all** — that absence is the diagnostic."

The "Still to do" list (other 5 cameras, annotated image, notification split) was completed 08-15 per the verification record and `homekit_tracker.md`.

#### `docs/beehive/homekit_capabilities_plan_2026-08-14.md` — what HomeKit is for here (CURRENT — policy doc)

Commit `18ff039` (2026-08-14, "HomeKit capability research + exposure policy (CarPlay garage door is the standout; never expose add-ons like the Alexa mess)").

The governing lesson, "learned the hard way, on Alexa, today": HA had been allowed to expose 67 entities including nine Supervisor add-ons. "**Do not let HomeKit become the same.** **Rule: expose to HomeKit ONLY things a human would say out loud or tap on a watch.** Never add-ons, never diagnostic sensors, never anything already well served in HA."

Division of labour: "**Home Assistant = the brain** … **HomeKit = the Apple-side face.** TV popups, Siri, Apple Watch, CarPlay, lock screen. HomeKit is not a competitor here; it is a display and voice layer over HA's thinking."

Ranked wins for this house: (1) **CarPlay garage door — the standout** ("a garage door button on the dashboard automatically as you approach home … the single most useful HomeKit feature available to Jeff," given the SONOFF MINI-D project); (2) Apple Watch control (both Jeff and Angela have Watches); (3) Siri as a second voice path — cross-reference to the 08-03 Alexa reserved-word problem ("Alexa **reserves** phrases like 'fast forward', which is why the commercial-skip script needed the awkward 'turn on FF the Commercials' workaround"); (4) local execution on the Apple TV hub; (5) Apple presence as a cross-check ("Angela's tracker going stale, 08-01").

Explicit rejections: **HomeKit Secure Video** ("needs iCloud+ AND cameras that actually stream. Blink does neither"); duplicating HA's phone notifications ("Otherwise the Alexa double-alert problem returns in a new outfit" — keep HA's AI-filtered/cooled/annotated alerts, HomeKit does the TV popup only); video clips in HomeKit ("researched, rejected: HA's ffmpeg camera on local MP4 is documented as hanging/freezing. Jeff is happy with stills anyway"). The expose table ends with the standing line: add-ons/diagnostics/meters → "**NEVER** — the Alexa hazard."

#### `docs/beehive/homekit_tracker.md` — the living HomeKit↔HA ledger (CURRENT — a standing process obligation)

Created in `72e5d56` (2026-08-15) and updated in `5de10eb` (2026-08-15 evening batch). Opens with Jeff's standing rule, verbatim:

> **Standing rule (Jeff, 2026-08-14):** *"Let's keep adding as much as we can to HomeKit and HA. I want them to work together and share now that we have the Apple TV back. Help me track that and let's check every time we add something if we can add it to HomeKit."*

Followed by the process rule: "**every time a new device or entity is added to HA, check it against this file and decide — in, out, or blocked — and record the answer here.** Never leave a new device unassessed." A future session that adds a device to HA without touching this file is violating a standing instruction.

The three bridges (all loaded 2026-08-15): **HCC Cameras** (port 21081, YAML, the 6 Blink clipframe cameras); **HCC Home** (port 21064, UI entry, everything else); **GLE 350 Lock** (port 21065, accessory mode — "HA auto-splits locks into their own accessory"). Cameras are separate deliberately ("HomeKit warns that cameras degrade a shared bridge … **Do not merge them.**"), with the 13-config-entry UI disaster re-recorded as the reason YAML is "the known-good shape for cameras." The doorbell trick is restated as load-bearing: "Do not remove those links."

In HomeKit now: `light.livingroom_cans` (Kasa HS220); `input_boolean.night_mode`; `scene.turn_on_sharky`; scripts `hcc_good_night` / `hcc_skip_commercial` / `hcc_open_sling` / `hcc_resume_fire_tv`; six irrigation switches (`z1_front_right` … `z5_right_side_drive`, `switch.garden`); car (`lock.gle_350_lock`, `switch.gle_350_auxiliary_heating`, `switch.gle_350_pre_entry_climate_control`); `alarm_control_panel.blink_loewen301`; `sensor.backyard_temperature`/`_humidity`; all 6 cameras.

Deliberately OUT: HA add-ons, camera motion-detection switches ("turning one off silently kills the alert pipeline. That is exactly how the cameras went dead 10–14 Aug"), "the other ~148 sensors," Echo speakers.

**Known risks Jeff accepted (2026-08-14)** — important because a future session might flag them as bugs: "**Car unlock in HomeKit.** Anyone with access to the Apple Home can unlock the Mercedes. Offered a lock-only option; **Jeff chose full control.**" And "**Blink arm/disarm in HomeKit.** An accidental disarm kills every camera automation. **Jeff chose to add it.**"

Blocked list (hardware/integration gaps): **LUX thermostat** — "Biggest single miss. LUX has **no HA `climate` entity** — it reaches the app through its own Azure B2C cloud API"; garage door (MINI-D bought, not wired — "the standout win — a garage door tile in CarPlay"); door/window contacts and Zigbee plugs/siren/leak/smoke (waiting on the coordinator); kitchen/dining + garage lights (second HS220 not installed; "garage still needs the HS210 2-location decision"); F-250 telemetry (needs the OBD-II + ESP32 build). Procedural gold at the bottom: the options-flow API sequence for adding entities to a bridge, and the warning "**The initial create flow gives no entity control** — it takes whole domains, so always narrow via options immediately afterward." Footer: "Last reviewed 2026-08-15 evening — all six cameras on annotated images; mute system verified live (30-min back / 5-min front); clip archive running."

---

### The Alexa cleanup (2026-08-14/15)

#### `docs/beehive/alexa_exposure_cleanup_2026-08-14.md` — the audit (CURRENT record of what was removed and why)

Commit `1f4e791` (2026-08-14, "Beehive: Alexa exposure audit - 9 HA add-ons are voice-controllable (fix first), Tuya duplicates mapped; expose WRITE command absent on 2026.8.1, UI only").

Trigger: "Jeff spotted duplicate devices in Alexa." API finding preserved for future automation attempts: `homeassistant/expose_entity/list` over WebSocket **works**, but "the matching `expose_entity/expose` WRITE command does NOT exist on HA 2026.8.1, and neither does `cloud/alexa/entities/update`. Cleanup must be done in the UI: **Settings → Voice assistants → Expose**, ⊗ button."

Findings on the 67 exposed entities:

1. **Nine Supervisor add-ons were voice-controllable** (listed by entity: `switch.z_wave_js`, `studio_code_server`, `silicon_labs_flasher`, `plex_media_server`, `spotify_connect`, `traccar`, `vlc`, `cec_scanner`, `blink_liveview_proxy`). "'Alexa, turn off Z-Wave JS' would take down the Zigbee/Z-Wave stack; Studio Code Server is how Beehive gets edited. Alexa fuzzy-matches names, so a misheard command can plausibly hit one. **Un-expose all nine.**"
2. **Every Tuya device appeared twice** — HA's copy (with a "Socket 1" suffix) and Smart Life's skill copy. Mapping table preserved (Garage fan, Hot Water Circulation Pump, Jeff's Bed lamp, Angela's Bed Lamp, Sharky Shark→Sharky). Rule: "**Remove HA's copies, not Smart Life's** … **un-exposing from Alexa does NOT affect Home Assistant**."
3. Lower-priority junk: `switch.all_devices_shuffle`/`_repeat`/`_do_not_disturb`, `media_player.all_devices`/`this_device` ("Circular"), plus `media_player.dellmasterbed` and `person.mqtt` — "NOT confirmed as unwanted — ask before removing."

The Sylvania note matters most for future sessions: "**They are NOT in HA (vendor-locked, settled 08-13)** but ARE in Alexa via Sylvania's own skill, grouped as 'Living Room Lights' (a favourite). One showed **Unresponsive** on 08-14 — that was the plug reset during the failed Smart Life experiment; Jeff re-paired it in the Sylvania app." This directly supersedes the July assumption (in `lighting_tuya_setup.md`, below) that the Sylvania plugs would import into HA via the Tuya integration — a settled question; don't reopen it.

#### `docs/beehive/alexa_command_card.html` + `Alexa_Command_Card.pdf` — the household-facing card (CURRENT deliverable)

Both added in `72e5d56` (2026-08-15, "Fix camera grid leak + add Apple TV annotated images, Alexa card, backflow layout"). A polished, print-styled, theme-aware HTML card (the PDF is its print twin) written for the humans in the house, titled "What you can ask Alexa." Header: "Alexa was cleaned up on August 14 — she went from **69 things down to 33**, and everything left on this card is something a person would actually say out loud." (Note: the audit doc counted **67** exposed entities; the card says 69 → 33 with "Thirty-six things were removed" — a small internal discrepancy; the record is silent on which count is exact.)

What it documents as live:

- The universal pattern ("Alexa, turn on/off *[name]*") and the standard fix: "say 'Alexa, discover devices' and wait about thirty seconds. That's the fix for nearly every 'I don't know that one' answer."
- **Lights:** Night Mode ("Drops the cans to 10% over a two-second fade — the level you set yourself"), living room lights on/percent/dim — the Kasa dimmer. Offer embedded in the card: "Set the cans where you like them … tell me, and I'll re-point Night Mode at it."
- **TV:** "Skip the Commercials," "Resume Show," "Sling" (Fire TV); "pause the Bedroom TV" (Apple TV).
- **Around the house:** "Good Night" ("Turns off *every* light in the house and logs the time"), "Vacuum the House" / "stop the Vacuum" (Sharky).
- **Irrigation:** Zones One–Five + Garden Zone "by plain number instead of their old codes," with the safety note: "**Say turn off when you're done.** A zone started by voice isn't running a scheduled program, so don't count on it stopping itself."
- **The Mercedes:** Car Heater, Car Climate — and the deliberate omission: "Remote *start* is deliberately not on Alexa — it needs the PIN and has Mercedes' own attempt limit behind it. That one stays in the app."
- **Backyard weather:** "what's the Backyard Temperature?" — "Straight off the station behind the house," with the honesty note that Alexa answers temperature far more reliably than humidity/wind/feels-like.
- **"What she can no longer touch"** — the removal summary: 9 add-ons, 6 camera motion-detection switches ("exactly how the cameras went quiet for four days earlier this month"), 4 duplicate Tuya plugs, 11 Echo speakers, 6 odds and ends. Footer: "33 devices exposed. Anything not on this card, Alexa simply cannot reach."

---

### Garage door, safety layer, Zigbee shopping

#### `docs/beehive/garage_door_sonoff_mini_dry_setup_2026-08-06.md` — the final garage-door plan (CURRENT — awaiting install)

Three commits on 2026-08-08: `8d53af4` ("Research + write the SONOFF MINI DRY garage door setup plan"), `feee336` ("Resolve garage door install placement, MyQ coexistence, power source"), `f84f8d8` ("Log MyQ sale decision, research + recommend a Zigbee position sensor"). (The doc is dated 08-06; committed 08-08.)

Opens by anchoring the hardware decision: "Part arrived: **SONOFF MINI DRY** (Matter, dry-contact relay, box says 'MINI Dry' — same part as the 'MINI-D' researched earlier). This is the final hardware call from 08-05 — confirmed correct, **not a repeat of the earlier ratgdo/SONOFF-Basic/SONOFF-SV guessing mistakes**." Terminals documented from the physical unit: NO/COM/NC relay out, N/L mains in (100–240V), S1/S2 external switch (unused), DC+/DC− (12–48V alternative). "Everything below is sourced from SONOFF's own docs/help center and independent reviews … not guessed" — 10 source links at the bottom.

Jeff's three practical questions, each resolved 08-06 with reasoning:

- **Install at the opener, not the wall switch** — direct short run to the low-voltage wall-console terminals; the wall-switch box likely can't fit the module ("same box-depth concern already flagged for the Kasa lighting switches"); outlet access equal at both spots so it isn't the decider.
- **Coexistence with MyQ + wall button — no conflict.** MyQ connects to the same wall-console terminals as the button; the Sonoff becomes "a **third** independent trigger onto one shared low-voltage sense circuit … the same pattern keypads and extra remotes already use."
- **Power via a plain 2-conductor AC cord** with a molded plug landed on N/L ("a 'lamp cord' … or repurpose a spare extension cord by cutting off the female end") — no splicing into the opener's internals.

Critical install-order finding: "**the 'Inching' (momentary pulse) setting can only be configured through the eWeLink app — Home Assistant's Matter integration does not expose this setting at all.**" So: pair to eWeLink first, enable Inching (~0.5–1 s), *then* Matter-commission into HA. The setting is stored **on the device** — set once. Expected HA result: "a **plain on/off `switch.*` entity** … not a `cover` entity like ratgdo would have given. That's expected and fine."

Division of labor decision: rather than have Jeff build HA template-cover YAML to fake a `cover`, "**I'll adjust the app itself** to recognize a plain garage switch entity and show a simple 'OPEN/CLOSE' trigger button — no open/closed *state* display, since there's no position sensor yet." (BEEHIVE_REFERENCE notes the app's `loadGarage()`/`loadGuardian()` gained `switch.*garage*` + `binary_sensor.*garage*` auto-detection on 08-08.)

The 08-06 scope change: "**Jeff has both parts of the MyQ (hub + sensor) and plans to sell it** rather than keep opening a separate app just to check open/closed status — reasonable, since the whole point of this project is one app for everything." That promoted the position sensor from "future, not needed" to **active**: recommendation is a **Zigbee contact sensor** (SONOFF **SNZB-04P** — same ecosystem as the coordinator; or Aqara Door/Window), mounted door-bottom-panel + floor/frame, explicitly *not* a tilt sensor by default ("a stuck/dusty tilt ball can misreport. Contact sensors are the simpler, cheaper default"). Needs the Zigbee coordinator paired first. Testing checklist: wall button still works (parallel wiring intact), eWeLink toggle works, HA toggle works, pulse is momentary not held ("if it stays on … the Inching Setting wasn't saved correctly").

Status: **current and pending** — as of the 08-15 homekit_tracker the MINI-D is "bought but not wired." The full ratgdo→MINI-D decision saga (including Jeff catching Claude's reasoning error) lives in BEEHIVE_REFERENCE, below.

#### `docs/beehive/safety_shopping_list.md` — the DIY alarm layer, priced (CURRENT plan; partially purchased)

Commit `6837d2d` (2026-07-01, "docs: add Beehive safety/alarm shopping list + myQ (ratgdo) notes").

Jeff's philosophy, recorded as his ask: "*tons* of **life-safety** coverage (smoke/CO/leak/gas/freeze), but **lean on intrusion** (only key doors + a few motions — not every window)." All Zigbee, one coordinator stick in the J45, "no wiring, all local in Beehive." Sequencing rule in a blockquote: "**Order of operations:** J45 set up → RTL-SDR (meters) → THEN this alarm layer. Don't buy ahead of the J45 being solid."

The itemized list with prices (all approximate, from the doc):

- **Brain:** Sonoff Zigbee 3.0 Dongle Plus, model "P" (~$20) + USB extension cable (~$6) — "Move the Zigbee stick away from the J45/RTL-SDR to avoid USB-3 interference (real issue)." *(Note: the doc labels the "P" as EFR32MG21 — that chip is actually the "E" model's; the P is CC2652P, as the later buy-now checklist correctly states. Chip-label error in this doc.)*
- **Alarm output:** Zigbee indoor siren/strobe (HEIMAN HS2WD-E, Frient/Develco, or Neo, ~$30–40); optional outdoor ~$40.
- **Life-safety ⭐ (the priority):** smoke detectors 2–3 @ ~$35; CO detectors 1–2 @ ~$40 ("natural gas house, so CO matters"); natural-gas/methane detector ~$30; water-leak sensors 4–6 @ ~$12 (water heater, sinks, washer, meter pit); freeze/temp sensors 2 @ ~$12 (plus the planned DS18B20 in the breaker panel).
- **Water-main auto-shutoff:** motorized ball valve ~$50–90 — "Turns 'leak alert' into 'leak stopped.'"
- **Intrusion — "keep it lean (Jeff: don't go crazy)":** contact sensors ONLY on key doors (front, back, garage↔house) 3–4 @ ~$10–13; interior motions 2–3 @ ~$12; optional window contacts; keypad/button ~$25.
- **Garage:** ratgdo board ~$30 (with the note that Chamberlain blocked HA cloud → go local), or all-Zigbee alternative (dry-contact relay + tilt sensor, ~$25). "NEED FROM JEFF: opener brand + model, and wall-button learn-button color" — this section is **superseded** by the 08-05/08-06 dry-contact finding and MINI-D purchase.
- **Notifications (free, required):** HA Companion app on Jeff's, Angela's, and Braxton's iPhones for Critical alerts that "override silent/DND."
- **Already have / don't re-buy:** Blink cameras, RTL-SDR, DS18B20.

Closes with the cross-device automations the hardware unlocks: leak → close main + Critical alert; smoke/CO/gas → siren + alert (+ optional HVAC-off); garage-open-after-dark; away scene ("arm motions/contacts, confirm garage closed, rain-delay B-Hyve"); panic → siren + strobe + Critical push ("already wired").

#### `docs/beehive/zigbee-buy-now-checklist.md` — the verified shopping trip (CURRENT; hardware arriving)

Commit `a00842c` (2026-07-31, "Add Zigbee buy-now checklist, verified against the existing safety plan"). Written because Jeff was actively eBay-shopping for the dongle + door sensors; every prior pick was re-verified "against real, current search results so you don't buy the wrong version" — 11 dated sources listed, "checked today, not from memory." It re-quotes Jeff's rule: "your own rule: 'tons of life-safety coverage, but lean on intrusion — only key doors, not every window'."

Verification table: ZBDongle-**P** (CC2652P) still the reference coordinator; HEIMAN HS2WD-E still right "with one honest caveat" (integration is better under Zigbee2MQTT than ZHA — "ZHA only exposes the battery cleanly; the siren trigger itself works but is more limited … Z2M gives you more control (volume/duration)"); Frient HESZB-120 a repeat top pick; SONOFF SNZB-05P is the current leak sensor ("optional extension probe cable worth getting for spots like under the water heater"); **Aqara Valve Controller T1** named as the specific water-main valve ("retrofits onto your existing shutoff handle (no plumbing cut) — fits 1/2\", 3/4\", 1\" pipe").

Buy-first specifics: search `SONOFF Zigbee 3.0 USB Dongle Plus ZBDongle-P` (~$20) plus a USB extension — "This isn't optional — USB 3.0 ports throw off interference in the exact 2.4GHz band Zigbee uses … Skipping this is the #1 cause of 'my Zigbee devices keep dropping.'" Door sensors: `SONOFF SNZB-04P` ("note the **P** — the newer version; the plain 'SNZB-04' … has weaker tamper detection and shorter battery life"), ~$10–13 each, buy 3–4. "**Total for both of these today: roughly $65–75.**" Phase-2 search terms listed (HEIMAN smoke/CO, SNZB-05P, SNZB-02P, Aqara T1, HS2WD-E). Setup order: dongle on the extension → ZHA integration auto-finds the serial port → pair sensors (hold button ~5 s) → then the panic automation doc "has the ready-to-paste automation — just swap in the real entity IDs."

Status: **INFERRED:** hardware was purchased and began arriving by 2026-08-15 — commit `5de10eb` (2026-08-15) is titled in part "Zigbee arrival inventory," and the 08-15 homekit_tracker still lists Zigbee items as "waiting on the coordinator dongle," so as of the branch tip the coordinator was not yet paired. The record inside `docs/beehive/` itself is silent on exactly what arrived.

**Contradiction to resolve before pairing:** this checklist (07-31) and the safety list both specify the ZBDongle-**P**, but BEEHIVE_REFERENCE (extracted from CLAUDE.md, 08-16) says "Zigbee coordinator (SONOFF **ZBDongle-E**, planned)." The record does not say which was actually bought. A future session should check the physical stick before assuming either.

#### `docs/beehive/panic_alarm_automation.md` — the EMERGENCY bar's other half (CURRENT design; NOT yet buildable)

Commit `7a5e984` (2026-07-01, "feat(panic): redefine panic → sirens + lights + alert family (no 911 auto-dial)").

What it records: the app's red EMERGENCY bar POSTs (after confirm) to Beehive webhook `hcc-panic-button` with `{"action":"panic","siren":true,"lights":true,"notify":["jeff","angela","braxton"],"triggered":"<time>","source":"HCC App"}`. Everything that *happens* is HA-side, and the doc is blunt about preconditions: "**Nothing here works until (a) the J45 is set up, (b) the alarm system is integrated into HA, and (c) the HA Companion app is installed on Jeff's, Angela's, and Braxton's phones.**" And the scope rule in a blockquote: "**Jeff will call 911 himself — this automation does NOT dial 911.**"

Open inputs it still needs: the siren integration path (hardwired panel via Envisalink/Konnected, Zigbee/Z-Wave siren via the coordinator, or a relay-driven siren — the Zigbee siren path is the one the shopping list chose), the strobe light entities, and the phone-alert method. Alert options weighed: **recommended** HA Companion Critical push (free, overrides silent/DND — "what most home-alarm HA setups use"); optional real phone call or SMS via **Twilio** (paid, "More setup + small cost. Can be added later").

Full ready-to-paste YAML is included: webhook trigger (`local_only: false` with a note to set true if home-Wi-Fi-only), `siren.turn_on` on placeholder `siren.house_alarm`, `light.turn_on` with `flash: long`, three Critical push notifies (`critical: 1`, `volume: 1.0`), commented-out Twilio call block — every action wrapped in `continue_on_error: true` so it "keeps working even if one piece is missing." Planned follow-up: a second `hcc-panic-clear` webhook → "Cancel alarm" button. Test plan: fire the webhook manually via curl first, then the app on home Wi-Fi, then confirm the off-network failure path shows the app's "Could not reach Beehive — call 911" message "(so you're never falsely reassured the alarm fired when it didn't)."

Status: **current design, blocked on the Zigbee siren** (still in the Phase-2 shopping list as of tip). The webhook and app side exist; the HA automation does not yet.

---

### Lighting and media (the July layer)

#### `docs/beehive/lighting_tuya_setup.md` — Tuya plugs into Beehive (PARTIALLY SUPERSEDED — Sylvania plugs settled as vendor-locked)

Commit `83f0240` (2026-07-04, "Add Tuya plug setup + HA-lighting-automation guide (docs/beehive)").

What it records: the plan to bring Jeff's smart plugs into HA so the app's GUARDIAN → Lights & Plugs card controls them and HA runs the sunset-on/9pm-off schedule. Key facts: "Jeff's 'SYLVANIA Smart WiFi' plugs are **Tuya** devices. **Confirmed 07-04 (Jeff's screenshot IMG_0852): his plugs already live in the Tuya app directly** (home '301'; plugs: Giraffe plug, Lamp Couch, Lamp chair, Lamp foyer, + more rooms)." The modern Tuya integration path is documented (User Code + QR scan, "no developer/cloud project"), plus two UI automations (sunset −15 min on; 21:00 off) with YAML alternatives, Part C ("Make HA the sole brain" — delete the old Tuya-app 9pm rule, keep Alexa voice via expose), and the payoff paragraph: HA-side plugs tie into Away Mode, the future alarm ("flash-on if it trips"), "none of which the Tuya app or Alexa can do alone."

Status: **partially superseded.** Some Tuya devices did land in HA (the 08-14 Alexa audit lists HA-side Tuya entities: garage fan, hot-water circulation pump, bed lamps, Sharky). But the *Sylvania* plugs specifically never made it: the 08-14 audit records "They are NOT in HA (**vendor-locked, settled 08-13**)" and references a "failed Smart Life experiment" that reset a plug. A future session reading only this July doc would wrongly retry importing the Sylvania plugs — that question is closed. **INFERRED:** the living-room lighting role this doc served was overtaken by the Kasa HS220 dimmer install (`light.livingroom_cans`, in HomeKit by 08-15); the detailed 08-13 Sylvania session record is outside `docs/beehive/` and not covered here.

#### `docs/beehive/media-center-setup.md` — the Kodi plan (SUPERSEDED / never verified as built)

Commit `05dc1db` (2026-07-12, "Splash landing screen + media center docs").

What it records: a staged plan for the beast (192.168.1.194, GTX 1050 Ti, viewing room) to drive the TV via **Kodi**, with HA popping camera/AI alerts *over* playback via `kodi.call_method` → `GUI.ShowNotification` — "Angela sees 'Person at Front Doorbell' on the TV, glances, it fades, show continues." Details: Kodi HTTP control on port 8080, username `kodi`, example password `hcc2026`; HA Kodi integration → `media_player.kodi`; a full per-camera automation combining `blink.trigger_camera` (7 s delay) → `image_processing.scan` (3 s) → Kodi toast (8 s) + phone push, with a 60 s template debounce. Stage 5 polish ideas: camera-snapshot screensaver, HCC dashboard on the TV via a Kodi web-browser add-on pointed at `https://loewenhome.com`, local media, a "Movie Night" scene, TTS to the TV. Honest DRM note: premium apps cap at **720p** on a PC browser (Widevine L3) — "beast = media center + AI + alerts + local content + HCC dashboard; Fire TV Stick = second HDMI input for … pristine 4K streaming." Division of labor: Clyde does HDMI/Kodi/firewall, Jeff adds Kodi to HA, "Claude (cloud): wrote this plan; owns the app-side alert UI."

Status: **superseded in practice.** The TV-overlay role this doc designed was actually delivered by a different chain — Fire TV + PiPup (referenced throughout the August docs as "the existing notify/popup automations" and `hcc.yaml`'s Fire TV popup), and then the Apple TV HomeKit popups (08-14/15). No later doc or commit in this folder confirms Kodi was ever installed or that `media_player.kodi` exists; **the record here is silent on whether any of this plan was executed.** A future session should not assume a Kodi integration is present.

---

### The top-level references (extracted from CLAUDE.md, 2026-08-16)

Both files carry the same header: "Moved out of `CLAUDE.md` on 2026-08-16 07:46 to keep that file small — it is auto-loaded and occupies context for the entire session. **This is the full, unedited section.**" Both are mirrored to `C:\Users\jeffl\iCloudDrive\HCC-Archive\` (`BEEHIVE_REFERENCE.md` / `UTILITIES_REFERENCE.md`). Commit for both: `fab5b30` (2026-08-16). They are dense accumulations of dated findings — the closest thing the repo has to institutional memory outside the changelog.

#### `docs/BEEHIVE_REFERENCE.md` — the full "Beehive / Home Assistant Integration" section (CURRENT)

Everything in it, by topic:

- **Hardware:** the J45 (specs above); internal-SSD migration 2026-07-02, "external is retired, don't reintroduce it." **4× USB 3.0 ports** ("confirmed by Jeff 08-05, corrects the earlier '2 free ports' assumption"); one yellow (likely always-on). Allocation: RTL-SDR = 1 (live); Zigbee coordinator ("SONOFF ZBDongle-E, planned" — see the P/E contradiction flagged above) on its own extension = 1; HDMI capture card (planned) = 1; **1 spare**. Jeff's "cakitte" USB-C hub exists but isn't needed.
- **Architecture:** three connection classes — USB sticks in the J45 (radios only), Wi-Fi/LAN (ESP32/ESPHome, Shelly, local cameras), cloud (Blink, B-Hyve, LUX, SmartHub/CEMC).
- **How Claude works:** "this cloud session has NO network access to Jeff's home LAN … it writes exact instructions for Jeff or the local 'coworker' session to execute. The coworker session (Claude Code on the beast) DOES have that access — see Mandatory Rule 13."
- **URLs and auth:** HA base URL + fallback + Nabu Casa; "the beast itself sometimes can't reach `192.168.1.66:8123` (VPN/AV blocking local IP) — use the phone if that happens." HA long-lived token entered once via HOME → "OPEN BEEHIVE ↗", stored in `localStorage.ha_token`.
- **Camera + irrigation app plumbing:** camera section falls back to Blink 2FA PIN entry (`blinkSendPin()` → `POST /api/services/blink/send_pin`); irrigation tries `loadIrrigationFromHA()` (B-Hyve switch filtering) then `loadIrrigationDirect()` (direct B-Hyve cloud).
- **The Mercedes GLE 350 (mbapi2020)** — the largest block, and the folder's best debugging war story:
  - VIN `4JGFB4KB0MA478988` (hardcoded `CAR_VIN`); helper `carMbSvc()`. Gas-vehicle service list (engine_start/stop, doors_lock/unlock, auxheat, temperature_configure "send as strings not numbers," preconditioning seats, sigpos_start, windows, sunroof) vs. EV-only services to avoid (`preheat_start`, battery/charge configs).
  - **PIN rule:** stored in the integration options in HA; "app must never prompt for or send a `pin` field." Confirmed present 08-06 (entry_id `01KY38Z7C90J2WE6S9R987JQZ4`, "Disable capabilities check" ticked).
  - **✅ RESOLVED 08-06 — remote start confirmed working, two independent blockers:** (1) **Mercedes' remote-attempt limit** — the car refuses further remote starts until physically key-started; Jeff key-started it, resetting the counter. (2) **The PIN needed re-entering AND a full HA restart** — "`homeassistant.reload_config_entry` was NOT enough — mbapi2020 reads the Security PIN only when it initialises."
  - **The diagnostic that cracked it, preserved as a first-move for next time:** "`sigpos_start` (flash lights) is the ONLY remote command needing no PIN. It worked while every PIN-gated command failed — that split proved the app, Cloudflare proxy, HA, VIN and integration were all fine and isolated the fault to the PIN in one step. **Use that test first next time.**"
  - **The Mercedes hard limit, with the app's verbatim message** (Jeff's screenshot): *"Your request to start the engine is unable to initiate because you have reached the limit of remote attempts between manual ignition cycles. Please use your key and manually start your vehicle the next time."* The doc notes this appeared **after** the PIN was accepted — "This is very likely what the `RIS_PIN_INVALID` below actually was: Mercedes handing a vague/wrong error code to a third-party integration where its own app gave the real message. **Before chasing a 'broken' remote start: confirm the car has been key-started since the last remote attempt.**"
  - **⚠️ DIAGNOSTIC TRAP (coworker, 08-06), recorded as a confession:** reading the config entry via `config_entries/get` over WS returned empty `options`, and the coworker told Jeff the PIN was missing — "**That was wrong.** HA's config-entry list API does not return `data` or `options` at all — they're internal … **'Field absent from the API response' ≠ 'field is empty.'** … **go to `system_log/list` first**."
  - Entity semantics trap: `binary_sensor.gle_350_windows_closed` is inverted ("`on`=closed — code must detect `*_closed` and flip logic"); always scope CAR lookups to Mercedes/GLE/mbapi entities ("house entities can bleed in otherwise (fixed 07-21)").
- **Ford F-250** (2001, VIN `3FTNX21FX1MA23431`, 7.3L Power Stroke, 4WD, crew cab): "no connected-car features (pre-dates FordPass Connect)." Vehicle switcher persists in `localStorage.hcc_vehicle`. Future: Veepeak OBDCheck BLE+ (~$30) + ESP32/ESPHome, optional NEO-6M GPS.
- **The garage-door decision history, in full** — the folder's best example of Jeff correcting Claude:
  - Chamberlain MyQ "permanently useless for HA (Chamberlain blocked all 3rd-party API access 2023 … confirmed dead 07-28, don't revisit absent a major policy reversal)."
  - Model-number correction 08-06: "MYQ-G0402" previously recorded as the hub is actually the *add-on door sensor* SKU.
  - ratgdo research 08-04: official kit $45 (ratcloud.llc); **Gelidus Research RATGDO Alternate Board, USB-C v2, ~$22–25** (pre-assembled, pre-flashed, full parity) as the cheapest correct option; DIY `rat-ratgdo` ~$15–20 in parts; "**Avoid** cheap ~$19 'ESPHome garage door' relay modules (e.g. Athom) — plain relay+reed-switch, NOT Security+ protocol-aware."
  - Protocol test 08-05: "Jeff bridged the wall-button wires directly and the door toggled" → dry-contact, not Security+ 2.0.
  - **"CORRECTED 08-05 — Jeff caught a real mistake in the reasoning, ratgdo/Gelidus board dropped entirely.** Jeff pushed back: if it's confirmed dry-contact (no Security+ protocol), why pay $22-25 for a board whose whole value is decoding that protocol? He's right — the ratgdo/Gelidus premium over a plain relay is 100% for Security+ signal decoding, which his opener doesn't use."
  - "Corrected again 08-05 — exact model matters, 'SONOFF Basic' was too vague/wrong" (Basic is mains-voltage); SONOFF SV considered; then "**Jeff found a better match: SONOFF MINI-D (~$15-20, Amazon)** … **This is now the final part.**" (Matter-native, dry-contact NO/COM/NC, hardware Inching Mode.)
  - MyQ hub + sensor to be **sold on eBay** (08-06); the SNZB-04P position-sensor recommendation restated.
- **GaragePC** (HP TouchSmart 520-1020 all-in-one, researched 08-05): 23" 1080p touchscreen, Pentium G620 (Sandy Bridge, **no AVX**), 8GB, 500GB HDD, webcam/mic/Beats speakers. Plan: wipe to **Linux Mint + Chromium kiosk** for the app. "⚠️ Touchscreen is NextWindow Voltron — does NOT work out of the box on Linux; needs the community `nwfermi` DKMS driver … **This kills ChromeOS Flex as an option.**" Six planned roles (kiosk, Garage Cam via go2rtc, TTS speaker, Wyoming voice satellite, Glances/WoL/SSH, Samba second-backup target). "**Ruled out (CPU too weak / no AVX — don't revisit):** OBS/Sling restream host, CodeProject.AI or any AI workload." Optional ~$25 SSD swap.
- **Spare hardware inventory (08-05):** KESU 500GB USB drive (→ AirTV 2 DVR; "Single 2.5\" spinning drive — never the sole copy of anything important"); **Lenovo B570** laptop (model 1068, 2012, S/N WB06276882; CPU confirmed Pentium B960, no AVX — "heavy encode … and AI officially ruled out"; Windows name is "**DellMasterBed**" — "hand-me-down name — don't go hunting for a mystery Dell on the network"); Delam BM-800-class condenser mic (→ GaragePC intercom, may need ~$10 USB audio dongle); WD Scorpio Blue 320GB (WD3200BPVT, 2012 — risk-free Mint test drive for the B570; "never a backup target"); HDMI-005 "AnyCast"-class Miracast stick (mirroring only — DRM/Sling "typically blocks"); an **HDMI→USB capture stick** identified 08-05 "via Camera-app test on the beast: shows up as a camera = capture device confirmed" — assigned to the Kitchen TV chain, "replacing the planned AXHDCAP purchase entirely."
- **Kitchen TV:** solved **08-05 at $0** — the wall-mounted iPad Air 2 (iPadOS 15) plays `watch.sling.com` in Safari, "photo-confirmed, Fox News live." The capture chain (Roku → **EZCOO EZ118K** HDCP-*bypass* extractor, ~$20–25, "most 'HDCP compliant' extractors do NOT strip, e.g. OREI HDA-912 confirmed doesn't work" → capture stick → J45 → go2rtc) is **on hold pending the AirTV 2** (which has "NO open API … not a Plex/Channels/HDHomeRun substitute" but injects antenna locals into Sling's Roku guide).
- **Smart Lighting Project (08-06):** Jeff sent a finished 2-PDF electrical plan (saved verbatim under `docs/lighting/`). Kasa **HS220** (dimmer) / **HS200** (garage), local via `python-kasa`, no hub — "Picked over MOES (100W/gang limit — doesn't fit the 108W bedroom/kitchen loads …) and Shelly Dimmer Gen3 (2x the cost, more config)." The bedroom trick: feed reversed so the door box is the power origin and each redundant toggle becomes an independent dumb receptacle switch — "every existing switch keeps a real job, no blank plates." Verified 08-06: 108W loads have real headroom under HS220's 150W-LED max. **Unresolved flag:** the garage's 2-location circuit needs the **HS210 kit** (a lone HS200 "leaves the OTHER physical switch non-functional") — "needs Jeff's call before ordering."

#### `docs/UTILITIES_REFERENCE.md` — the full "Water + Gas + Electric Meter Integration" section (CURRENT)

Status line: "Water + Gas LIVE via RTL-SDR + rtlamr2mqtt on the J45. Electric 'This Month' LIVE via the SmartHub (CEMC) cloud integration — a real ATM90E32 CT-clamp build is still the future path for true instant Now/Today."

**💧 WATER — WHUD · Kamstrup flowIQ 2100:**

- Meter S/N `25394131`, billing cycle ~21st. Rates validated: **Base $10.32 + $0.00908/gal.** Sewer (City of White House, mirrors the WHUD meter): **Base $23.42 + $0.01011/gal** — rate increase confirmed 08-05 from the 5/7–6/6/26 bill (was $22.74 + $0.00982/gal, both up ~3%, "exact match to the bill's $92.56 base+consumption").
- **Known gap, awaiting Jeff's call:** Sanitation Services (**$24.00** flat) + Stormwater (**$8.99** flat) are on the city bill but NOT in "Est. Sewer."
- 08-06: `IRR_FLOW` (irrigation GPM constants feeding the sewer-overcharge waste calc) **recalibrated to real measured data** — "The old spec-sheet-guess constants were 23-49% too high depending on zone, meaning the 'Total sewer overcharge tracked' running total has likely been overstated for any already-closed cycle. Self-corrects going forward … past cycles are not retroactively fixed."
- 08-05 tracking bug, found because "Jeff asked me to confirm the 'Total sewer overcharge tracked' accumulation is correct **before he starts sending bills to cross-check it**": `irrGalFromHistory()` (real B-Hyve runtimes) only updated the on-screen note while the stored `water_billing_history` totals kept the rougher schedule estimate "forever." Fixed; verified in isolation; "**could not test the live B-Hyve/HA fetch itself, this sandbox has no network path to Jeff's real HA instance.**"
- 08-05 design decision — **the sewer case's data hygiene:** "Jeff's goal: he's building a case with WHUD/City of WH to get money back for irrigation water that never enters the sewer but still gets charged sewer rates — needs clean, uncontaminated usage-based data." Garbage/stormwater added as separate line items (`GARBAGE_FLAT`/`STORMWATER_FLAT`), folded into `Combined` only; `sewerEst`/`sewerWaste`/history fields "untouched, still pure usage-based, still the exact dataset the overcharge case needs." Verified "reproducing the real bill to the penny ($92.56 sewer-only, $125.55 full city total)."
- Read path "confirmed by WHUD supervisor": external MIU `100WD`, ERT `79453337`, unencrypted, `scm+`, 915–930 MHz, ~1 SCM/min, no AES key. European timestamps → Central. Raw ÷10 = gallons.
- **The pit-radio incident (CLOSED, do not re-raise):** the MIU went silent 07-28 ~17:39 UTC and self-recovered. "**Jeff's explicit call (07-31): water is transmitting fine now, and he does NOT want to call WHUD about it** — reporting it would draw utility-district attention/scrutiny he doesn't want … Leave this alone unless water goes silent again; if it does, that's a fresh incident, not a continuation of this one." Timing was checked to clear the same-day recorder fix of blame ("water kept transmitting fine for 5+ more hours after that").

**🔥 GAS — Piedmont/Spire · Itron 100G ERT:**

- "Piedmont Natural Gas, transitioning to Spire (billing continues under Piedmont during transition). Account `6100 0546 4779`. Meter Elster AC-250, Piedmont# `T821986`. Billing cycle ~5th."
- ERT FCC ID `EO9100GDLA`, unencrypted, 900–920 MHz; same RTL-SDR reads both. Raw ÷100 = CCF.
- Rates validated against 3 bills: "Base $13.44 + Distribution $0.61809/therm + PGA $0.61691/therm = $1.235/therm all-in. Heat factor 1.068 (CCF→therms). 5% local franchise fee. `(13.44 + round(CCF × 1.068) × 1.235) × 1.05`."

**⚡ ELECTRIC — Cumberland Electric (CEMC):**

- This Month + Cost live via SmartHub, entity `sensor.electric_smarthub_energy_monthly_usage_4501007001`; poll fixed 08-06 from HA's 6h default to 30 min ("the practical ceiling since SmartHub's own backend only refreshes every 15-60 min").
- The 08-06 statistics upgrade with two real bugs found by live coworker verification: the WS command is `recorder/statistics_during_period` ("NOT `history/statistics_during_period` — that name doesn't exist on Jeff's HA Core 2026.8.0, confirmed live, returns `unknown_command`"); it's WebSocket-only, so `functions/api/ha-stats.js` opens a one-shot outbound WS to the allow-listed Nabu Casa host. Per-period usage must diff consecutive cumulative `sum`/`state` readings — "**not** the `change` field, which the coworker confirmed always reads `0` for this sensor even across real usage growth." Design rule: "**NOW is deliberately left blank (—), never estimated** — SmartHub's finest real grain is hourly; genuine 'Now' only comes from the future CT-clamp build."
- Not built (checked, unavailable as attributes): Bill Due / Last Payment / vs-Last-Year — "next session (or the coworker) should pull the real entity's full attributes dict first."
- Account `4501007001`, meter `145590962` ("Landis+Gyr Gridstream — not Itron, can't radio-read directly"). 200A service, Challenger panel.
- Rates validated against the 07/30/2026 bill (2,120 kWh billed): "Base $39.00 + Energy $0.08657/kWh + TVA Fuel $0.02847/kWh = $0.11504/kWh all-in. TVA fuel is a pass-through surcharge that shifts most cycles — re-derive from each new bill photo."
- **Future build:** 6-channel CircuitSetup ATM90E32 (2 chips) + ESPHome — CT1+2 = 200A mains, CT3–6 = range/dryer/AC/well pump, ~$90–110 DIY. And the standing rule in bold: "**Jeff wired his own house — never suggest hiring an electrician.**"
- Two "confirmed NOT a bug" investigations preserved so they don't get re-chased: "**⚠️ '$94 seems low'** — checked and confirmed NOT a bug (07-31)" (fresh billing cycle starting ~23rd; $94 ≈ 478 kWh ÷ 8 days ≈ 60 kWh/day, in range; "first check whether it's climbing before assuming a bug"); and the Water Flow tile's brief 0.2 gpm readings (the 5-minute derivative window averaging a flush — "Working as documented").

---

### Cross-file contradictions and traps a future session must not fall into

1. **ZBDongle P vs E:** `zigbee-buy-now-checklist.md` and `safety_shopping_list.md` specify the ZBDongle-**P**; `BEEHIVE_REFERENCE.md` says ZBDongle-**E** "planned." Additionally, `safety_shopping_list.md` mislabels the P's chip as EFR32MG21 (that's the E's chip; the P is CC2652P per the checklist). **The record does not resolve which stick was bought.** Check the physical hardware before pairing — Z2M/ZHA config differs by chip.
2. **Alexa entity count:** the audit says 67 exposed; the command card says "69 things down to 33" and "Thirty-six things were removed." The record is silent on which count is exact.
3. **The mute/cooldown timeline:** designed 08-14 (`alert_fatigue_fix`), but per the 08-15 verification record it "had NEVER worked" until fixed that day — the first successful mute writes in system history are 2026-08-15 16:30/16:37.
4. **Scanner/HomeKit image split is load-bearing:** AI scanners read `camera.*_clipframe` (raw); HomeKit serves `camera.ai_*` (annotated). Crossing them created a silent self-scanning feedback loop on 08-15 while every health check read green.
5. **`linked_doorbell_sensor` is the popup mechanism.** Removing it (or "simplifying" to `linked_motion_sensor` only) silently downgrades Apple TV popups to phone notifications.
6. **Sylvania plugs are settled (08-13): vendor-locked, not in HA.** Do not retry the July `lighting_tuya_setup.md` import path for them.
7. **MyQ/Chamberlain is dead for HA (confirmed 07-28)** and the ratgdo class of boards was deliberately dropped after Jeff's 08-05 pushback. The garage part is the SONOFF MINI-D, Inching configured in eWeLink only, arriving in HA as a plain `switch.*`.
8. **The Blink-disarm failure mode has no error surface** except `alarm_control_panel.blink_loewen301` — check it first when "the cameras went quiet."
9. **The pit-radio silence of 07-28 is closed by Jeff's explicit instruction** — do not suggest calling WHUD about it.
10. **Rates are dated, validated numbers, not guesses** — water/sewer/gas/electric rates above were each reconciled to real bills (to the penny for the 08-05 city bill). Re-derive TVA fuel each bill; don't treat it as fixed.
11. **`media-center-setup.md` (Kodi) was a plan, not a build** — no evidence it was executed; the TV-alert role went to Fire TV PiPup and then Apple TV HomeKit.
12. **The J45's external USB drive is retired** — never reintroduce it; HA OS lives on the internal drive since 2026-07-02.


---

## The Other Papers — lighting, Lucky Mike, inventory, heroes, config trees

This section documents everything at the branch tip (2026-08-16, `origin/claude/time-master-project-liq1jw`) that is *not* the app itself: the lighting/Zigbee planning documents, the queued Lucky Mike "Smart Stall" business, the hardware-inventory and network-map registers, the hero-image style system, and the config trees (`beehive-config/`, `beehive/`, `firmware/`, `_headers`, the disabled GitHub Actions workflow, and `dev.html`). These files are where most of the project's *decisions* — prices, rejections, arguments, and settled questions — actually live. Anything inferred rather than evidenced is marked **INFERRED:**.

---

### 1. Lighting — `docs/lighting/`

Five files (three markdown, two HTML + matching PDFs). Together they record the whole-house smart-lighting project from the 2026-08-06 planning session through the 2026-08-14 living-room install and the 2026-08-16 Inovelli scrap notice.

#### 1.1 `HCC_Lighting_Plan.html` (+ `.pdf`) — THE authoritative plan, "Rev. Aug 13 2026"

Committed `6c90202` 2026-08-13 ("Lighting: printable build plan + wiring/mesh diagrams (HTML + PDF); remove temp fix.txt"). A three-page printable letter-format document, masthead "**Smart Lighting & Zigbee Mesh** — Build plan · wiring · device map — Home Assistant 'Beehive'", "Rev. Aug 13 2026 · Loewen · White House TN".

**Page 1 — "The Strategy — Two Jobs, Two Budgets."** The core architectural decision, verbatim from the doc:

> **Job 1 · Light Switches → Wi-Fi (Kasa)** — Kasa HS220/HS200 run **fully local** in Home Assistant through the `python-kasa` integration — no cloud, no hub, no account needed for on/off/dim. At ~$15 they do the lighting job for a fifth the price of a mesh-grade switch.
>
> **Job 2 · Mesh Range → Zigbee Plugs** — Mesh repeaters do **not** have to be switches. Every mains-powered Zigbee plug is a router. At $8–12 each they extend the mesh *and* replace the four vendor-locked Sylvania plugs that can never enter HA.
>
> **Why not a $46 mesh dimmer:** the switch was only being asked to repeat the mesh — a job a $10 plug does better. Buying them separately costs half as much and solves the Sylvania problem at the same time.

**Shopping list (page 1, with prices):** Kasa HS220 dimmer ×3 for bedroom/kitchen-dining/living room ($15 ea, "2 on hand", $0); optional 4th HS220 $15; Kasa HS200 garage switch $15; Zigbee plug 4-pack (~$10 ea, $40) to replace the 4 Sylvania plugs; 1 more Zigbee plug for the garage mesh relay ($10); 2 Zigbee contact sensors for the garage door (~$12 ea, $24); Haozee CC2652P1 coordinator dongle + USB extension ($0, "ordered"). **Estimated total ~$104**, with the caveat: "Prices are estimates — verify each Zigbee model against its Zigbee2MQTT device page before ordering."

**Room schedule:** Bedroom 9×12 W ProGreen LED (108 W, Kasa HS220, door box only, 2 toggles repurposed) · Kitchen+Dining 9×12 W combined (108 W, HS220, 1 of 3 existing positions; 2 come out) · Living Room 8×12 W (96 W, HS220) · Garage 8× LED not dimmed (96 W, HS200, **2 switch locations**).

**Open decision recorded in a warning box** (still open at tip):

> **Open decision — garage two-location switching.** A single HS200 cannot serve two switch positions; the second position goes dead. Choose one: **(a)** HS210 matched kit so both positions stay live, or **(b)** single HS200 at the garage door and repurpose the kitchen position for something else — the same trick already used on the bedroom toggles. *Decide before ordering.*

**Firmware trap (page 1 note):**

> **Before first power-up:** install the Kasa app and **turn OFF automatic firmware updates before adding any switch.** TP-Link firmware has previously broken local control — and local control is the entire reason these are being used.

**Page 2 — Wiring diagrams** (inline SVGs, print-grade). The bedroom "Reversed Feed, Door Box Is the Origin" three-box chain: panel → DOOR BOX (origin, Kasa HS220, splices for line hot + chain BLACK and all neutrals, load out to 9 LEDs / 108 W) → MIDDLE BOX (old 4-way removed, existing toggle repurposed to switch only its own receptacle) → BEDSIDE (end of run, old dimmer removed, toggle repurposed to its own receptacle, "swap 20 A → 15 A recept.", old feed tap fully removed). Caption: "Bedside was originally the power origin — the feed is reversed so the door box originates. The two old toggles are not blanked off: each now controls only its own box's receptacle." Also kitchen "3 boxes become 1" (two dimmers consolidated to one HS220 for all 9 LEDs, "2 openings freed"), and the garage two-location question diagram ("One HS200 kills the other position. HS210 kit keeps both live — decide first."). Safety warning: breaker OFF, verify dead at *all three* bedroom boxes, confirm neutral at kitchen/living boxes ("assumed, not yet photo-verified" — note this was later closed, see §1.4), grounds never used as circuit conductors.

**Page 3 — Zigbee mesh + device map.** Mesh topology: Haozee CC2652P1 coordinator on Beehive, **channel 25** ("clear of Wi-Fi ch 1") → living-room Zigbee plugs (4× routers, replace Sylvania) → garage plug (router "pushes signal past the wall") → two battery door sensors + future sensors. Teaching caption: "**Mains-powered = router** … **Battery-powered = end device** … This is why adding plugs strengthens the network and adding sensors does not." The two-sensor garage-door design:

> **The garage door gets two sensors, not one.** One reads CLOSED, the other reads FULLY OPEN. With both, Home Assistant can tell the three real states apart: **closed**, **fully open**, and **partially open** — the cracked-for-ventilation position, which a single sensor can never distinguish from wide open.

The page also carries a compact device map (Beehive .66, the beast .194, RE200 AP .196, GaragePC .121, Fire TV .215, B-Hyve .198, mower ESP32 .232; SSIDs `Loewen301` 2.4 ch 1 / `Loewen301-5G` / `LoewenGuest`) and the Tuya table including the settled Sylvania verdict:

> **Settled — do not retry.** The Sylvania plugs are Tuya hardware locked to Sylvania's own app. Smart Life detects them and refuses; HA cannot reach them. Replacement is the fix.

**"Buying Rules — Learned the Hard Way"** (verbatim list): "'Zigbee compatible' is not enough" (Z-Wave ≠ Zigbee); "Check the Zigbee2MQTT device page before buying" (one "supported" dimmer *stops relaying messages for other devices*); "Let cheap plugs carry the mesh, not expensive switches"; "Disable vendor auto-firmware-update before first pairing." Ends with a three-column install checklist (Prep / Per switch / Home Assistant, last item "Logged in inventory").

**Trap for future sessions:** the plan is Rev. Aug 13 — one day *before* the living-room HS220 was actually installed and the SHIP-2.0 firmware discovery (§1.4), and three days before the Inovelli scrap notice (§1.5). The doc's strategy holds, but the shopping list's "2 on hand" HS220 count became 3 on 08-14 (inventory §3.1) and the Zigbee-plug pick was later made specific (THIRDREALITY 4-pack, §3.1).

#### 1.2 `HCC_Floorplan_DRAFT.html` (+ `.pdf`) — the floor plan traced from the robot vacuum

Committed `29c7a1a` 2026-08-13 ("Lighting: first-draft floor plan with device overlay (traced from Sharky LIDAR; guest bed + office unmapped, awaiting Jeff's markup)"). Landscape sheet, masthead "**Floor Plan — Device Overlay**" with a red **"Draft — check me"** badge and rev line "Draft 1 · Aug 13 2026 · traced from Sharky LIDAR". Subtitle: "Base geometry traced from the robot vacuum's map · device positions are my best guess and need your red pen."

It draws the house (bedroom, bathroom, foyer, hall/bath, living room, kitchen+dining, garage) as an SVG with device markers — S = Kasa switch (HS220 door box, kitchen, living, HS200 garage), R = Zigbee plug routers (4 living-room + garage relay + bed lamp), D = the two garage door sensors, H = Beehive + dongle. Guest bedroom and office are cross-hatched: "not mapped — door was closed" ("The vacuum maps only where it can drive… those rooms are guesses, not survey. The garage it has never seen at all."). Footnote: "Not to scale · geometry approximated from the vacuum's LIDAR map."

The sidebar asks Jeff directly: "**Please correct me.** Mark this up and hand it back — I'll redraw it properly," listing what's needed (room positions/sizes, where the garage really sits, guest bedroom/office, which wall each switch is on, missing rooms). And the ambition note: "**Next version can be live.** Once the geometry is right, this same plan can drive the wall iPad — lamps lighting up when they're on, the garage door showing open or closed, and a tap to control anything on it."

**Status at tip:** still Draft 1. The record contains no marked-up return from Jeff — **INFERRED:** the red-pen round trip has not happened yet.

#### 1.3 `bedroom_wiring_plan_2026-08-06.md`

Committed `ac38933` 2026-08-08 ("Log Jeff's smart lighting plan, flag one real issue before ordering"). The box-by-box text version of the bedroom reversed-feed design: door box = origin with the HS220 ("Single-pole, replaces old switch — No S1/S2, no separate module"), splice list, middle and bedside boxes each with "**Existing toggle — repurposed** … Switch OUTPUT → this box's receptacle hot only … No WiFi — dumb mechanical switch," the 15 A receptacle swap at bedside, "Old receptacle-feed tap fully removed." Order line: "Kasa HS220P3 (3-pack: bedroom + kitchen/dining + living room) + Kasa HS200 (garage)." Safety: "Breaker off · verify dead at all three boxes before starting."

#### 1.4 `kasa_smart_lighting_project_2026-08-06.md` — the project summary, kept alive through 08-14

Created in the same `ac38933` commit; updated repeatedly (last touched `09de34b` 2026-08-14). This is the richest lighting record:

- **Final decision line:** "Kasa HS220 (dimmer) / HS200 (non-dim), local HA integration via `python-kasa`."
- **Why Kasa over MOES/Shelly (rejected options with prices):**
  - **MOES WM-105B-M** (already owned): 100 W/gang limit — doesn't fit any single-channel group above 100 W once rooms were combined; "Requires momentary/reset switches — confirmed via GitHub issues and HA community threads that standard toggles cause continuous ramp behavior, not clean toggle."
  - **Shelly Dimmer Gen3:** "works, local HA, keeps existing switches, but ~$35/unit vs Kasa ~$14-16/unit, and needs input-mode config per unit."
  - **Kasa HS220:** replaces the switch entirely, mature local integration, single-pole only — "which matches every room now that they're consolidated to one switch each."
- **The HS200/HS210 flag** (added by the 08-06 cloud session): the garage's two-location circuit "needs the **HS210 kit** (matched pair, WiFi-coordinated) to keep BOTH the kitchen and garage switch positions live; a lone HS200 in a 3-way/2-way circuit makes the other physical switch position non-functional."
- **Ceiling fans closed (Jeff, 2026-08-13):** "**Every ceiling fan is wired independently of the LED circuits.**" Bedroom/office fans are pull-chain; the living-room fan is on its own RF remote. "**a dimmer is safe on all four LED circuits** — the one real hazard in this project (dimming a fan motor damages it and is a fire risk) does not apply anywhere here. Closed." (Future option noted, not planned: RF bridge to bring the living-room fan into HA.)
- **Boxes & wire pulls — done by Jeff (confirmed 2026-08-13):** "**Jeff pulled dedicated LED circuits himself through the attic and installed 2- and 3-gang boxes in every room.**" This *closed* two open items (neutrals confirmed present; box fill fine — "new multi-gang boxes, ample room for the deeper Kasa bodies") and noted spare gang positions exist "so future smart devices drop in WITHOUT another attic trip."
- **✅ Living room installed 2026-08-14:** `light.livingroom_cans` — HS220 at **192.168.1.178**, "wired by Jeff, dimming verified from HA. **Setup took ~2 hours and the network was NEVER the problem.**" Gateway verified clean (DHCP 190 free, MAC filtering off, WPA-2, ch 1, band steering off); 2.4 GHz Mode changed G/N → **B/G/N** during troubleshooting (kept).
- **The SHIP 2.0 firmware discovery — a real trap, written to never be re-litigated:** "**These HS220s ship on NEW firmware** using an encrypted onboarding protocol (server identifies as 'SHIP 2.0', port 80, NOT the legacy port 9999)." Consequences: HA needs **TP-Link account credentials** to add them ("Control is still LOCAL — the account only authenticates the local session; it keeps working without internet"); and "Direct provisioning over the setup AP is NOT possible: all payloads return `error_code 1003` (JSON decode fail) and the handshake is undocumented. **Do not waste time on this again.**"
- **Tool discovered:** the beast has an ASUS USB-AC53 Nano Wi-Fi adapter, radio software-off by default, that "can be turned on via the WinRT Radio API and used to join an IoT device's private setup AP for diagnostics, without disturbing its wired LAN connection."
- **Bonus:** "**HA exposes `switch.<device>_auto_update_enabled`** — the firmware auto-update toggle the Kasa app does NOT show. **Turned OFF for this switch. Do the same for every future Kasa device.**" (HA also exposes overheat sensor, signal level, fade, presets, status LED.)

#### 1.5 `zigbee_dimmer_selection_2026-08-13.md` — the scrap notice. The single most important process failure in this folder

Original research committed `a5c67a8` 2026-08-13 ("Enbrighten 43080 rejected for documented mesh-routing defects, Inovelli Blue selected (dumb-3-way confirmed)"). Then on **2026-08-16** commit `1572b4a` ("Record that Inovelli was SCRAPPED on price - it was never written down") prepended a red banner that must be quoted in full because it is the project's canonical lesson about lost decisions:

> ## 🔴 SCRAPPED BY JEFF — DO NOT PROPOSE INOVELLI AGAIN
> **Jeff rejected the Inovelli Blue on price and says he did so early on:** *"those were scrapped at the freaking beginning — told you I was not paying $120 for a freaking dimmer switch."* ~$60 each / ~$120 for the pair is over his line, full stop.
>
> **This was never recorded until 2026-08-16**, so the inventory and CLAUDE.md both still said "TO BUY: 2" a day later, and a session planned the whole Zigbee mesh around them and pitched them back to him. That is exactly how a settled decision gets re-litigated. **If a decision is made in conversation, it goes in the doc the same session.**
>
> The research below is kept ONLY as the record of why Enbrighten was rejected (documented mesh-routing defects — still valid and still worth avoiding). **The selection at the bottom is dead.**
>
> **Open:** the mesh still needs mains-powered routers, and a budget alternative has NOT been chosen. Do not name one from memory — research real current products and prices in-session, cheapest-first, and include the $0 option (Kasa HS220 ×2 and the MOES module are already ON HAND).

The commit message adds: "Standing lesson: a decision made in conversation goes into the doc the SAME session."

The preserved research beneath the banner:
- **Rejected: Enbrighten Z-Wave 800 toggle dimmer ($39)** — "**Wrong radio.** Z-Wave (908 MHz) cannot talk to the Haozee CC2652P1 Zigbee dongle. Would need a second ~$40 Z-Wave stick + a second ecosystem. Real cost for 2 switches: ~$118 vs $92 Zigbee. Rejected."
- **Rejected: Enbrighten 43080 (Zigbee paddle dimmer)** — officially Zigbee2MQTT-supported, "looked like the value pick. **BUT Zigbee2MQTT's own device page carries two explicit warnings:**" ("may stop relaying messages for child devices"; "will not respond to route update requests after a while"). "Jeff's stated requirement is that switches EXTEND the mesh (garage needs range help). A switch with documented routing defects fails that requirement outright."
- **(Dead) selection: Inovelli Blue 2-1 VZM31-SN (~$46-60)** — Zigbee 3.0 router, clean Z2M page, dumb-3-way confirmed (which would have closed the HS200/HS210 garage question), neutral required (Jeff has neutrals everywhere). "Costs more, but it is the only option that satisfies 'must extend the mesh.'" — **this is what Jeff killed on price.**
- Closing line: "**Lesson: 'Zigbee2MQTT supported' ≠ 'good Zigbee citizen.' Check the device page's warnings.**"

**Trap for future sessions:** as of the tip, the mains-powered mesh-router choice for the *switch* positions is **UNRESOLVED**. Do not propose Inovelli. Do not re-open the Enbrighten. Do not name a product from memory — research live prices, cheapest first, starting from the $0 on-hand option. (Note the THIRDREALITY *plugs* selection in §3.1 covers plug routers, not the wall-switch question.)

---

### 2. Lucky Mike — `docs/lucky-mike/` (the queued Smart Stall business)

Lucky Mike is a horse. The folder is a fully-worked plan for a monitoring product ("Smart Stall™ — Because They're Family.") for his stall, plus the business model to sell it to other barns. **Status: QUEUED — never built.** Per `INTEGRATION_NOTES.md`: "**Status: QUEUED — build AFTER the utilities work and the current docket are finished** (Jeff's instruction 2026-06-30)." All files date to 2026-06-30 commits (`c8ca302`, `e50c9a4`, `857d825`, `fa282f1`, `6c2d8c3`, `4d78cad`) and have not changed since — a month-and-a-half-old parked project at tip.

#### 2.1 The ChatGPT-origin documents (archived, not authoritative)

`Lucky_Mike_Smart_Stall_Project_Master.md` and `Lucky_Mike_Smart_Stall_Project_Bible_v1.0.md` (commit `c8ca302` "Archive Lucky Mike Smart Stall plan + technical review (queued, not built)") are the original plan — 4 phases: Phase 1 Essential Monitoring "$175–225" (2× Tapo C120 cameras, ESP32, BME280, DS18B20, LD2410, HA dashboard); Phase 2 Smart Stall "+$125–175" (fan control, water level, door, leak, UPS); Phase 3 Feed & Analytics "+$75–125" (load cell + HX711, reports); Phase 4 Smart Halter GPS (4 options, Wi-Fi-only through full LTE). Branding: "**Smart Stall™**", tagline "**Because they're family.**", packages Bronze/Silver/Gold/Platinum (the Bible inconsistently says "Elite" — flagged as mistake #6). "Lucky Mike will serve as the demonstration installation for future customers." `README_Project_Files.txt` is just the archive manifest and a suggested folder layout. `design-budget-guide-12page.png` and `lucky-mike-hero.jpg` are the ChatGPT deck image and the hero photo for the eventual app page.

#### 2.2 `INTEGRATION_NOTES.md` — Claude's engineering review of the ChatGPT plan

Verdict: "Good, coherent plan… same architecture as everything else in the app (ESP32 + ESPHome → Home Assistant → app via `/api/states`)… The phased Bronze→Platinum structure is sensible. Keep it." Then **nine numbered ChatGPT mistakes to fix before building** ("do not copy the deck blindly"):

1. **Architecture diagram wrong (page 10)** — it funnels cameras and Shelly plugs *through* the ESP32; they are independent Wi-Fi/HA devices. The ESP32 handles only the wired sensors.
2. **microSD on the ESP32 — drop it.** "Home Assistant is already the historian… SPI conflicts and FAT-corruption risk for zero benefit. Remove from BOM (saves ~$8)."
3. **Li-ion 5200 mAh power bank — drop or redesign.** Redundant with the UPS, and "USB power banks commonly **auto-shut-off** under the ESP32's tiny current draw."
4. **DS18B20 duplicated + misspelled** ("DS1820B/DS1B20" in slides). One probe is enough.
5. **Phase 3 slide's total bar mislabeled "PHASE 2 ESTIMATED TOTAL"** — copy-paste error; the math ($53.86) is right.
6. **Tier-4 name inconsistent** — deck says Platinum, Bible says Elite; "recommend Platinum."
7. **Phase 4 GPS halter — set realistic expectations:** "Wi-Fi-only (Options A/B) gives NO live location off-property"; live tracking requires cellular; "Battery life + weight + sky view are the real engineering challenges"; frame as "genuinely 'future/R&D.'"
8. **"All data stays on your local network" is overstated** — Tapo/Shelly reach their clouds unless locked down. "Fine as a goal, not a guarantee."
9. **Verify parts/prices** — "Shelly Plug Gen4" naming, LD2410 @ $1.99 optimistic; "budget the high end."

**Site facts (confirmed by Jeff 2026-06-30):** "Barn Wi-Fi is strong" and "each stall has a 120V wired receptacle" → plain Wi-Fi ESP32 powered from a $5 USB adapter, fan controlled by a plug-in power-monitoring smart plug (Sonoff S31 / Shelly Plus Plug US) "NOT a hard-wired relay (reverses my earlier note…)". "**Every stall = one identical repeatable module** … an N-stall barn is the same recipe × N — great for productizing."

**App integration plan (when built):** a new nav section "STABLE" (or "LUCKY MIKE") with its own `--a-stable` accent token, built from the Section Kit + graded `.sec-hero` using `lucky-mike-hero.jpg`, live tiles from HA `/api/states`, must pass the light/dark sweep — "It double-purposes as a **customer demo/sales** screen, so keep it presentable."

Closing agreement with Jeff on sequencing: "**Why doing utilities first is the right order (agree with Jeff):** The water/gas/electric utilities work is the *same skill*: ESPHome sensor → HA → app card. Building that first creates the exact reusable plumbing this page needs."

#### 2.3 `BOM_OPTIMIZED.md` — Claude's cost-optimized bill of materials

Guiding rule: "hang cheap sensors off the ESP32's GPIO and use a plug-in smart plug for the fan — don't buy a branded $15–25 gadget per function." Per-stall essential parts table (ESP32 $6, USB power $5, BME280/SHT31 $5–6, DS18B20 $3, LD2410 $5, ultrasonic water $6 or float $2, leak probe $2, reed door switch $1, Sonoff S31 $15 / Shelly $20, camera $35–50, IP65 box $12, misc $8 → "**~$100–125** + 1 camera").

**The "REAL minimum" recalculation (confirmed 2026-06-30):** Bronze essentials only ≈ **$87 single-buy / $69 barn-qty**, +10% spares → "**Use ~$90/stall single-buy, ~$75/stall in barn quantity as the real parts cost.**" Key correction to the deal docs: "the deal-economics docs originally used a padded $150/stall — real floor is ~$90, which *improves* every option's margin (Option 1 take ≈ $410/stall, not $350). Re-lock deal numbers at $90 when Jeff confirms." *(Still un-relocked at tip.)*

**Bulk / on-hand ladder (commit `4d78cad`):** "~$90 one-off retail → **~$63 bulk** → **~$50 bulk + your on-hand boards/wire**" — "The **camera is the floor** (~$33) — it's the one thing that doesn't shrink and you won't have spares of." Barn-level shared buy: one CyberPower 425–600 VA UPS on the router ($55–70), "one blip-proof point beats a battery in every stall." Phase 4 GPS: store-and-forward ESP32+NEO-M8N+LiPo ≈ $25–30 ("No live location off-property"); LTE-M (LilyGO T-SIM7080G) ≈ $35–45 + SIM $1.5–5/mo pass-through. Explicit DROP list from ChatGPT's BOM (microSD, power bank, per-stall UPS, branded single-function sensors). "Why this is the CFO story: … Everything is **local to Home Assistant → $0/month** … a clean 'no subscription' pitch."

#### 2.4 `DEAL_OPTIONS.md` — the money (locked to Jeff's numbers, commit `fa282f1` 2026-06-30)

Locked inputs: parts **$90 single-buy / $75 barn-qty**; **$50 flat trip charge**; build/install labor **$300/stall recommended** ("Claude's recommendation — Jeff's to adjust", ~6 hr; ~$200 each additional stall); **$40/mo** boarder fee. Single-stall economics: "**No single-stall scenario loses money.** Question is just: ~$350 now, or ~$40/mo rolling."

The fork the whole document turns on:

> ⭐ **THE KEY DECISION: who keeps the $40/mo?** The same $40 can't be kept twice.

- **Option 1 — demand-triggered install** (barn keeps $40): ~$440/stall installed (round $450); Jeff's take ~$350 over parts for ~6 hr (~$58/hr); additional stalls ~$275 (take ~$200); 6-stall barn ~$1,815 revenue → ~$1,335 take (~$67/hr); 5-yr/stall ~$350; risk ~none.
- **Option 2 — financed** same $440 over ~12 mo, Jeff holds title.
- **Option 3 — Jeff keeps the $40/mo:** charge ~$140 at install (parts + trip), payback ~10 weeks, 5-yr/stall ≈ **~$2,060 net** — but "highest [risk] — CapEx, churn/vacancy, collection, and you **own ongoing support**."
- **Split $25 Jeff / $15 barn:** Jeff ~$1,160 net / 5 yr; barn $900 pure amenity profit.

Recommendation: "1. **Lucky Mike (unit #1): build at parts cost** (~$90) — it's the demo, not a sale. 2. First real installs: Option 1 … 3. Once proven: the Split." And the human line at the bottom:

> Solo, almost-60 reality: recurring = a support obligation that never sleeps. Option 1 keeps it simple and fun; grow into recurring on purpose, not by accident.

#### 2.5 `PRICING_AND_BUSINESS.md` — labor-loaded pricing and the legal checklist

"The core correction (carry this everywhere): ChatGPT's deck prices ($175–225 'Bronze,' etc.) are **parts + a small buffer with ZERO labor**. Selling at those numbers = donating 6–15 hrs of skilled work per install. Always price the **installed job**: Installed price = Parts (+10% spares) + (hours × rate) + margin/contingency." *(Note: this doc still uses the older ~$150 parts basis — the $90 re-lock from the BOM was never propagated; treat DEAL_OPTIONS as the newer numbers.)*

Three go-to-market models: A (boarder pays, B2C), **B (barn owner sells "Smart Stall" as a paid amenity, B2B2C — RECOMMENDED**, ~$440/stall installed for a 6-stall job, she charges boarders ~$20–30/mo, payback ≈ 16–18 months, then ~$1,800/yr recurring at ~$0/mo cost), C (managed service/revenue-share). Labor: first stall 6–8 hr, each additional 2–3 hr, suggested rate $60–85/hr (examples use $65). Worked examples: single stall ~**$770 installed**; 6-stall barn **$2,640 (~$440/stall)**. Tier table: Bronze ~$400–500/stall, Silver ~$550–700, Gold ~$750–950, Platinum $1,000+/horse.

**"Selling the CFO (Angela) — lead with risk, not gadgets":** "one colic caught early vs. late ≈ **$5,000–10,000 surgery** (or losing the horse)… CFOs buy insurance." Itemize honestly, TCO vs commercial equine systems ($1,000–3,000+ upfront **and** monthly fees).

**Business/legal checklist "do BEFORE selling outside the family"** (all unchecked at tip): LLC ("walls off personal assets (incl. the house Jeff wired himself)"), general liability insurance, mandatory disclaimer ("Supplemental monitoring aid, NOT a replacement for in-person checks… Live animal — non-negotiable"), boarding-contract addendum, warranty terms ("who eats the truck roll on a dead sensor"), support policy/retainer, sales tax/business license, hardware ownership ("unit stays with the stall, not the horse"), camera privacy, SIM pass-through.

First move (agreed): "Build **Lucky Mike's stall at parts cost** as the reference install + demo… Don't try to profit on unit #1 — it's the showroom."

**Traps for future sessions:** (a) the whole thing is queued behind utilities — do not start building it unprompted; (b) three docs carry three parts-cost bases ($150 padded / $90 confirmed / $50 marginal) — DEAL_OPTIONS + BOM ladder is the current truth, and the "$90 re-lock" of deal numbers is still pending Jeff's confirm; (c) fix the nine ChatGPT errors before reusing any of the original deck.

---

### 3. Inventory — `docs/inventory/`

#### 3.1 `HCC_INVENTORY.md` — the master hardware register

Created `880addb` 2026-08-13; last touched `1572b4a` 2026-08-16. Opens with Jeff's standing order, verbatim:

> **Standing job (Jeff, 2026-08-13):** *"make sure we stay on top of the inventory that's coming in, what we buy from now on... really make sure that we're adding to the system rather than taking away from it. It's all got to be tracked meticulously."*

Header rules: every session that buys/receives/installs/retires/repurposes hardware updates this file; a phone-readable copy lives at `iCloudDrive/HCC Inventory.md` and must be kept in sync. Status legend ORDERED → ON HAND → INSTALLED, plus RETIRED/RESALE. Maintenance rules at the bottom: "**Log at order time**, not arrival"; "**Nothing gets bought twice** because nobody checked this file. Check here first."; "**Retired ≠ deleted**"; "**Wrong-variant purchases get flagged loudly** … *verify the protocol variant in the listing before ordering*"; "Sync the iCloud copy after every edit."

**Zigbee layer (all photo-confirmed arrived 2026-08-15, with exact prices):** Haozee CC2652P1 dongle **$8.92** (coordinator, Z2M not ZHA, USB extension on hand); Tuya/Excellux door-window sensors ($9.58 ×2 packs, $6.39 Coolo 2-pack, $2.79 single); leak sensors (Haozee $5.09 ea ×2, Gleco probe-cable $4.40, Gleco **Z2M-only** TZ-SJ-SD_E $4.62 — "⚠️ no ZHA — this locked the Z2M decision", Excellux $6.19); and one mistake kept as a warning: "⚠️ Tuya **WiFi** water sensor (Qianhong 'WiFi-Shuijin-1') $5.68 — NOT Zigbee — wrong variant. Smart Life or shelf." Standing constraint in bold: "**NOT UNBOXED — Jeff's order: nothing gets set up until the camera/alert pipeline is verified.** Setup day, first moves: disable any auto-firmware-update BEFORE first pairing (the Kasa rule); pick the Zigbee channel deliberately…; dongle on its USB extension cable, away from USB3 ports." Also: "**Mesh status: zero routers.**" — every device on hand is battery-powered; the CC2652P's ~50 direct children is "the reason not to swap to a ZBDongle-E, decided 2026-08-13."

**Lighting rows:** Kasa HS220 ×2 confirmed on hand (living room assigned; #2 bedroom or spare); the struck-through **Inovelli row** — "**🔴 SCRAPPED — DO NOT BUY (Jeff, on price)** … *'I was not paying $120 for a freaking dimmer switch.'* Recorded 2026-08-16 after a session re-proposed them. A budget router/dimmer alternative is still UNCHOSEN" (old kitchen/garage assignment plan kept only for wiring context); Leviton Decora E5603-SW 3-way dumb (companion/spare); GE UltraPro paddle (bedroom repurposed-receptacle position); **MOES module ("the beige box")** assigned to the single ~12 W LED over the kitchen sink ("finally a load it fits", needs a MOMENTARY push-button); Lepro 14 W downlights "**SPARES ONLY** — replacements… NOT expansion (Jeff 08-13)". Mesh geometry correction from Jeff: "kitchen is the FARTHEST point needing mesh; living room is ~12 ft from the dongle. Router priority is therefore kitchen first — not living room as originally assumed."

**Other sections:** wiring consumables from bin photos ("no purchases needed for install work" — 12/2 NM, Wago kits, boxes, multimeter, etc.); irrigation valves (zone-1 Orbit replacement for the diaphragm leak "~3.8 gal/hr, confirmed by meter"); mower ESP32 (fw 1.4.0, "OTA-ready pending private hosting"; spare ESP32 "TO ORDER (~$9) — Jeff committed 08-11"); garage door (SONOFF MINI-D on hand; the 2-contact-sensor CLOSED/OPEN/**PARTIAL** plan; "MyQ hub + sensor — RESALE — eBay when Jeff gets to it"); MoCA adapter pair shelved because garage WiFi measured adequate ("mean −71.5 dBm, worst −76, zero buffered uploads ever"), with a deploy trigger ("if the Matter garage relay feels laggy → MoCA backhaul + AP"); ISP confirmed by photo 08-13 (AT&T Fiber BGW320-500 — "The old Xfinity notes refer to Jeff's *email/mail*, not current internet service").

**The Sylvania saga (2026-08-13 section):** 4 living-room lamp plugs, "ON HAND, working, but VENDOR LOCKED — cannot enter Home Assistant." Tuya hardware (port 6668 confirmed) at .199/.200/.202/.205, but "Sylvania locked the product ID so ONLY the 'SYLVANIA Smart WiFi' app accepts them. Proven 08-13: Smart Life DETECTS a reset plug then rejects it… Only remaining route = LocalTuya with hand-extracted local keys. NOT attempted, not worth it. **DECISION: replace with Zigbee plugs when the dongle arrives.** … DO NOT re-attempt the Smart Life path — this is settled."

**Zigbee mesh plugs — SELECTED 2026-08-14:** "**BUY: THIRDREALITY Zigbee Smart Plug 4-Pack — ASIN B09KNHWF7L (~$50).**" Z2M page 3RSP019BZ verified clean; "Tested better range than SONOFF S40 Lite (+5 ft through 2 walls) and zero dropouts over 14 days." Two loud traps: "**⚠️ SHIPS IN BLE MODE — must be manually switched to Zigbee mode before it will pair.** Out of the box it looks dead to the coordinator." And the lookalike warnings (THIRDREALITY "M3" B0FJRNW7YS is Matter-over-WiFi; SONOFF S40 Lite exists in both Zigbee B09XMH3X3G and WiFi B09LV7K4DH under the same name) with the rule: "**'Requires a hub' = the Zigbee one. 'No hub required' = WiFi, useless for the mesh.**" Quantity needed: 5. *(No ORDERED row exists for these plugs at tip — **INFERRED:** they were selected but not yet purchased.)*

**Order 2026-08-14 (~$33.83, arrived 8/15):** Orbit 57280 3/4" FPT valve $13.58 (intended master valve); **Kasa HS220, Amazon Resale "USED - Mint," $13.86** (3rd dimmer — "bedroom, kitchen/dining, living room now all covered"); Leviton 3-gang plate $1.82; Leviton F-connector insert $4.57. With the used-switch trap: "**⚠️ The HS220 is USED/refurb.** Before install: FACTORY RESET it (hold the button ~10 s…) so it is not still bound to the previous owner's TP-Link account, THEN disable auto-firmware-update, THEN pair. A used smart switch that is still claimed will silently refuse to pair."

**Backflow / irrigation connection — 2026-08-15:** the wall-stub valve turned out to be "a plain Orbit valve with a **solid jar-top bonnet — no vent openings**… NOT a backflow device. The system has been running with **no backflow protection at the point of connection.**" Decision 8/15: buy an **Orbit 3/4" electric anti-siphon valve ($18.34)** — master valve + backflow in one body; the 57280 becomes the spare zone valve ("not wasted… a failed zone-1 diaphragm is exactly what caused the ~88 gal/day leak found 2026-08-13"); the T&S B-969 1/2" AVB on hand is "too small — 1/2" chokes the 3/4" line"; **Orbit 51059 ($18.49) was looked at and NOT bought**. Install rules recorded (vent dome up, critical level 6" above highest head, ≤12 h continuous pressure). And two brutally honest paragraphs: "**Honest limit, unchanged by any option considered:** the six zone valves are shutoff valves DOWNSTREAM of an atmospheric breaker, which the standard does not strictly permit. The by-the-book fix is a pressure vacuum breaker (ASSE 1020, ~$80-150) **plus annual testing by a licensed tester** — which is exactly the utility attention Jeff is avoiding. **Decision made knowingly.**" And the replacement strategy: "an AVB fails SILENTLY… So swap the cheap valve on a schedule rather than pay ~9x for bronze. Target: spring startup, every 1-2 years. **TODO: add a yearly HA reminder**." *(TODO still open at tip.)*

#### 3.2 `NETWORK_MAP.md` — the LAN census and rename layer

Created `4dc9336` 2026-08-13 ("full device census from the BGW320 + tonight's gateway changes"); last touched `f735771` 2026-08-14. Premise: "The BGW320 cannot rename devices — … **this file is the rename layer**" and the authoritative label for every live device.

**Gateway config (Jeff-approved changes 08-13):** 2.4 GHz `Loewen301` channel **pinned to 1**; 5 GHz renamed **`Loewen301-5G`**; band steering disabled (intended); Zigbee planned on **channel 25** (max separation from ch 1); fixed allocations .66 Beehive and .215 Fire TV. Standing note: "The 2.4 channel is PINNED (1). If WiFi congestion ever appears, re-evaluate here **and** check the Zigbee channel before moving it."

**The clean census** (after "Clear and Rescan," 80+ stale entries purged) maps every IP: .66 Beehive (HA on Beelink J45), .196 RE200 wired AP, .194 **THE BEAST** ("CodeProject.AI host, Claude coworker machine"), .215 Fire TV, .164 Angela's work computer (with the standing warning: "Both of Angela's work machines run corporate VPN + firewall — they take a LAN address but tunnel all traffic and won't answer local probes; **silence is NORMAL, never troubleshoot it**"), .197 MyQ hub ("⚠️ UNPLUG + reset for eBay" — still online at census time), .232 the mower box ("confirmed 08-13 by 5-min heartbeat timing"), .176 JeffsLapTop (Acer Aspire E5-576, i3-8130U — "AVX-capable — could host AI workloads unlike B570/GaragePC"), .173 the Lenovo B570 wearing the hostname "DellMasterBed" inherited from a retired Dell, etc. Remaining unknowns are explicitly marked: "**Every (?) row is a question only Jeff can answer.**"

**Detective work worth remembering:**
- "**.171 'Nest Protect'** — ❌ NOT a smoke alarm… **Angela's bed-lamp Tuya socket with a fake hostname** — proven by unplug test (down, held 60s+, at 14:50). Cheap Tuya firmware self-reporting a fake hostname. **There is NO Nest hardware in this house.**"
- "**Tuya endgame — FULLY SOLVED 2026-08-13**": .171 Angela's lamp (unplug test), .231 **Sharky** the vacuum ("off-switch test, 15:03 — the 'Linux' unknown all along"), .209 hot-water pump socket, .195 remaining Tuya socket, .224 Jeff's bed lamp, .170 garage fan, .199/.200/.202/.205 the 4 Sylvania plugs (Tuya port-scan; the earlier Echo Dots guess was wrong — "a monitor watching the wrong IPs"). "Every fake-hostname mystery on the network is now identified."
- Zmodo cameras: "ALL DARK 08-13… the live .207 was found ON THE BACK DECK plugged in with the covered TV — unplugged by Jeff, factory-reset pending, eBay pile… Privacy issue closed."

**Extender fleet (08-13 late):** RE200 converted to wired AP ("Login lesson: its 2018 login page fails SILENTLY when the request rides a flapping wireless link — every 'wrong password' was really a dropped link. Wired access worked first try."). Generic no-name "Wireless-N Repeater": "**RETIRE.** … pure airtime pollution next to the new wired AP." D-Link DAP-1520: "**RETIRE — no Ethernet port, conversion impossible** (Jeff spotted the disqualifier himself). eBay-able." (commit `a43adc4`).

**Gateway changes 2026-08-14** (the Kasa-join saga's network side): 2.4 GHz Mode G/N → **B/G/N** ("purely permissive"; everything reconnected fine); **Guest SSID `LoewenGuest` DISABLED** ("Jeff confirmed nobody uses it. One less broadcasting network and one less entry point."); confirmed-good-and-left-alone list (WPA-2 not WPA3 "would break older IoT", ch 1 fixed, 20 MHz, WPS off, band steering off). Final suspect note for the then-unjoined Kasa: "Prime remaining suspect is the Kasa app offering **Loewen301-5G** in its network picker — the switch cannot see 5 GHz, so it accepts credentials and then hunts forever. Must be Loewen301." *(The lighting doc confirms it did join by 08-14 at .178.)*

**Trap:** the lighting plan's page-3 device map (Rev. Aug 13) and NETWORK_MAP disagree in small ways (e.g., .194 labeled "The beast — main PC" in one, "301Server (?)" then "✅ THE BEAST" in the other); NETWORK_MAP's clean census is the authority.

---

### 4. Heroes — the visual identity system

#### 4.1 `HERO-STYLE-GUIDE.json` (repo root)

Committed `278a78e` 2026-06-24 ("Add HERO-STYLE-GUIDE.json — complete image spec for all 4 hero sections"). A machine-readable art-direction bible: `"style_name": "Premium Estate Command Center"`, `"visual_identity": "luxury residential cinematic realism"`. Codifies the golden-hour rule ("time_of_day: golden hour (primary rule)"; mood "calm, expensive, cinematic, aspirational"), composition (rule of thirds, "one dominant subject per hero image", negative space "reserved for UI overlays or app text"), environment ("grass: deep emerald, striped, high density, no patchiness"; Leland pines as a "dense living wall… zero visible gaps… ~20ft visual impression"), palette ("deep green, warm gold, charcoal shadows, brick red accents"), and the avoid list ("cartoon styling, over-HDR look, over-saturated neon greens, inconsistent lighting between assets"). Final rule: "Every generated hero image must look like it belongs to the same premium smart-home / landscaping command center application suite."

It also embeds the four full generation prompts (yard / home / weather / irrigation). The yard prompt is notable as a self-portrait of the project: "a confident middle-aged homeowner in a dark LawnCareHive t-shirt kneeling beside a red Toro TimeMaster 21200 30\" walk-behind mower… Title: 'YARD COMMAND CENTER APP' | Subtitle: 'MOW SMARTER. TRACK EVERY CUT.'" The home prompt: "brick ranch-style house exterior at golden hour… Title: 'HOME COMMAND CENTER APP' | Subtitle: 'MANAGE · MAINTAIN · MONITOR' | Tagline: 'Everything. In One Place.'"

#### 4.2 `docs/hero-master-grade.md`

Committed `ebedb85` 2026-06-28 ("docs: add hero master-grade reference (matches shipped module)"). Documents the shipped uniform color grade: "Apply ONE cinematic golden-hour color grade to every hero image so the whole app looks like one film stock. Do **not** replace image assets or change overlays/typography." Mechanism: `applyHeroGrades()` runs on init, adds `.hcc-hero-grade` (`filter: brightness(.92) contrast(1.14) saturate(.93) sepia(.10) hue-rotate(-3deg)`) to every hero `<img>` inside `.house-hero`/`.sec-hero`/`.hcc-hero`, and `.hcc-hero-vignette` to the container. New sections inherit automatically — "no per-hero CSS."

A genuinely useful CSS gotcha is preserved: "the vignette is on the **container** (`::before`), not the `<img>`. An `<img>` is a replaced element and does not render `::before`/`::after`, so an image-level vignette would silently do nothing." Art-direction rules: "Weather hero was the calibration reference"; "Do not swap or regenerate hero images to fix tone — the grade handles tone"; "To shift the look, change the shared `.hcc-hero-grade` values once… Never add a per-hero `filter:`."

#### 4.3 `dev.html` — the Hero Consistency Audit page

Committed `3509c74` 2026-06-28 ("Heroes: stronger unified grade + add /dev.html consistency audit"). A standalone diagnostic page ("🎬 Hero Consistency Audit") that renders the five hero images (Home/Weather/Irrigation/Yard/Climate) with a mirrored copy of the live grade, then reads the *computed* CSS filter and overlay via `getComputedStyle` and emits a copyable JSON block: "If cssFilter is identical across all heroes, the grade is uniform." Its purpose is to let a session verify grade uniformity from a phone screenshot/JSON paste.

**Trap:** `dev.html` hard-codes its own `--hcc-hero-filter` value (`brightness(.80) contrast(1.20) saturate(.82) sepia(.22) hue-rotate(-6deg)`) with the comment "Keep these in sync if the app grade changes" — and that value does **not** match `hero-master-grade.md`'s documented `brightness(.92) contrast(1.14)…` values. It also references `images/hero-home.jpg` and `images/hero-climate.jpg`, which do not exist in `images/` at tip (the dir has `hero-home-dusk.jpg` and no climate hero). **INFERRED:** dev.html reflects a later, stronger grade iteration and/or has drifted from the shipped module — treat `index.html`'s actual CSS as the truth, `dev.html` as a possibly-stale audit tool, and reconcile before trusting either doc's numbers.

#### 4.4 `docs/home-theater-ai-plan.md` — camera AI + home theater (living doc)

Created `dfaa88f` 2026-07-10; GPU confirmed `71a8cae` 2026-07-10; last updated `c13f101` 2026-07-14. Opens with Jeff's goals (2026-07-09), "**with a hard NO on subscriptions** (no Blink fee, no Zmodo fee, no per-month anything — he already pays for Claude/Clyde, Nabu Casa, and the domain)": premium camera tiles (done), Blink clip review in-app, alerts that say **what** triggered (person/car/animal/package), alert pop-up on the TV, and "top-of-the-line home theater with HA driving it all — seamless, no 'cluster of shit,' no constant resets."

Hardware division: Beehive (Beelink J45, .66) — "weak Pentium, no GPU… **Keep it PURE HA.** Do NOT put media/AI on it." The beast (.194) — "**the designated AI + media brain**": 6-core CPU, ~2 TB storage, **GTX 1050 Ti 4 GB VRAM (confirmed via `nvidia-smi` 07-09)**, Windows, runs 24/7, also runs Clyde. Settled detection plan: **CodeProject.AI Server on Windows** (snapshot object detection — "no RTSP needed, fits Blink") + optionally LLM Vision / free Gemini tier; "Frigate/blinkbridge NOT needed for this path."

**Phase 2 history — a decision reversal documented honestly:** "**Phase 2 — SUPERSEDED (07-14, Jeff's call): Fire TV + `alexa_media_player` kept as the real TV pop-up path, not Kodi.**" The original 07-10 plan routed TV alerts through Kodi on the beast; in practice the 07-11 session built the ADB-paired Fire TV route, which went silent for 3 days (root cause: "CodeProject.AI silently not restarting after a reboot, now fixed with delayed-start + failure-recovery"). Jeff chose 07-14 to keep the Fire TV path. "**Kodi was installed on the beast but never finished** (web remote-control never enabled, never added to HA, launched once for 3 minutes total) — leave it installed/unused… `docs/beehive/media-center-setup.md` describes the Kodi route that was NOT taken; treat it as reference/superseded, not a live setup guide."

Honest limits recorded: DRM apps may be resolution-capped on a PC; "Apple TV = no clean pop-up overlay"; Blink is snapshot/event with inherent delay. Division of labor: "Claude (cloud): app-side… Owns all app code. Clyde (beast) + Jeff: beast-side… Clyde treats app code as READ-ONLY."

---

### 5. The config trees

#### 5.1 `beehive-config/` — snapshot of the live HA configuration

Committed `39c1194` 2026-08-01: "Add live HA config snapshot (beehive-config/) as disaster-recovery backup." Five files; `scenes.yaml` and `scripts.yaml` are **0 bytes** (empty on the live instance too — scripts live inside the package file instead).

- **`configuration.yaml`** — minimal core: `default_config:`, packages loader (`!include_dir_named packages`), the Barn zone (lat 36.716949, lon −86.65295, 150 m, `mdi:barn`) and Work zone (Nashville, 100 m), the **PiPup** `rest_command.pipup_notify` (POSTs to the Fire TV at `http://192.168.1.215:7979/notify` with a 480-px image — the TV picture-in-picture alert path), six `codeproject_ai_object` image-processing entries (one per Blink camera: 301_backyard, 301_driveway, 301_front_doorbell, front_right, back_left, garage; server 192.168.1.194:32168, confidence 60, targets person/vehicle/animal, annotated frames saved to `/config/www/ai_snapshots/`), and CORS allowing `https://loewenhome.com`, `www.loewenhome.com`, `toro1-5rz.pages.dev`.
- **`automations.yaml`** — the UI-managed automations, each with a self-documenting description: **HCC Watchdog** (Blink/Fire TV/Mercedes unavailable 5+ min → phone alert "instead of it failing silently for hours"); **Auto Launch Sling on Fire TV Wake**; **Recorder Down Watchdog** ("the exact failure that silently broke utility bill tracking 07-02 to 07-28"); **Blink Auto-Heal** (reloads the Blink config entry seconds after the known upstream `blinkpy` LoginError crash, "tracked in home-assistant/core#176836"); **AI Camera Popup on Fire TV** via PiPup ("pushes the actual annotated frame that triggered the detection (not a fresh/later snapshot)… instead of taking over the whole TV. Replaces the old full-screen-switch approach per Jeff's request"); **Blink Periodic Health Reload** (every 15 min, because the error-triggered heal "only fires on the FIRST occurrence of a given error message per HA session"); **Angela Arrived at Barn** ("Zone real coordinates captured live 08-01 as she actually arrived") and **Arrived at Work** (both keyed off the Mercedes GLE's GPS "since her phone doesn't reliably report location"; work address recorded: 150 4th Avenue North Suite 1700, Nashville, TN 37219); **Possible Water Leak (Idle Flow)** (flow >0.05 gal/min for 30 min while away or 1–5 am with all irrigation zones off — "built 08-01 after confirming the water meter/pit radio are healthy, not faulty"); **Morning Digest** (7 am summary of weather, Sharky, GLE fuel/lock/odometer, water/gas reporting health, and a note if Blink self-healed in the last 24 h — with the honest removal of the notification count because `states.persistent_notification` "has been unreadable from templates since HA 2023.6… it was silently always reporting zero, which is worse than not reporting it").
- **`hcc.yaml`** — the HCC package (`/config/packages/hcc.yaml` on Beehive): mower `input_number`/`input_text` helpers and the `hcc-mower-sensor` webhook (hours only ratchet **upward** — `max` of payload and current, so a rebooted box can never wind the meter back); the `hcc-panic-button` webhook (flash all lights, 30-s panic flag); severe-weather automation; the whole camera-AI chain — "AI Camera Scan on Motion" (maps the six Blink motion sensors to their image_processing entities), "AI Object Detected Notify" (person = critical iOS push with the annotated snapshot, tap-URL into the app's camera page, and a "🔇 Mute 15 min" action button; vehicle/animal = time-sensitive), "AI Notify Mute Action", "AI Show Camera on Fire TV" (ADB pause → show snapshot → home → play; note `initial_state: false` — **shipped disabled**, superseded by the PiPup popup), "AI Arrival Suppression" (mutes all six cameras 10 min when Jeff or Angela arrives "so walking in the door doesn't trigger camera alerts"), "Angela Almost Home", and "Blink Fast Motion Poll" (updates the six motion sensors every 10 s "so AI alerts aren't delayed by the default 5min poll" — alias says 30s, trigger says /10, a small internal inconsistency); Fire TV scripts (Good Night, Resume, **Skip Commercial Break** — 3× keyevent 90 then play, Open Sling, Check Current App); per-camera `input_datetime` mute helpers; the Weather Underground PWS REST sensors (resource URL in `!secret`); `utility_meter` monthly cycles for water/gas; the water-flow derivative sensor; and the **Gas Cost** template embedding the actual tariff math: `((13.44 + therms * 1.235) * 1.05)` with CCF→therms ×1.068.
- **Trap:** this is a *snapshot*, last committed 2026-08-01 for most content. The live Beehive is the source of truth; sessions must not assume this tree is current (e.g., later Alexa/HomeKit work documented in `docs/beehive/*_2026-08-14.md` post-dates it).

#### 5.2 `beehive/` — installers, ESPHome config, custom-component snapshots

- **`install.sh`** (committed `75a7afd` 2026-06-23, "Add complete Beehive brain setup — no Windows required") — the one-command bootstrap run inside the HA Terminal add-on (`curl -fsSL https://toro1-5rz.pages.dev/beehive/install.sh | bash`): installs HACS, writes `/config/packages/hcc.yaml` (an early version of the package with additional irrigation-started, freeze-warning automations and a `hcc_irrigation_stop_all` script that dangerously targets `entity_id: all` switches), patches `configuration.yaml` for packages, installs the ESPHome add-on, downloads `hcc-mower.yaml`, restarts HA. Documents the two webhooks (`/api/webhook/hcc-panic-button`, `/api/webhook/hcc-mower-sensor`).
- **`esphome/hcc-mower.yaml`** (committed `fe1edb8` 2026-06-23) — the ESPHome-based mower firmware **as originally designed**: full sensor suite on an ESP32 DevKit (hall-effect ignition on GPIO27, battery ADC on GPIO34 via 100k/10k divider, NEO-6M GPS on UART, MPU-6050 pitch/roll/vibration, WiFi RSSI, internal temp), Haversine GPS distance integration with a 20 m jump filter, POST to `https://toro1-5rz.pages.dev/api/hours` every 90 s while running plus a 5-minute parked heartbeat. `secrets.yaml.template` shows the expected secrets (WiFi, API key, OTA password), "This file is NEVER committed to git."
- **⚠️ Historical trap:** this ESPHome design was **superseded** by the Arduino firmware in `firmware/mower_hours_esp32/` (§5.3), which explicitly states "**Running: posts nothing**" — the exact opposite of this file's 90-second live posting. The ESPHome yaml also expects different hardware (hall sensor + GPS + RPM pulse counter vs. the shipped vibration-based hour meter). Do not treat `beehive/esphome/hcc-mower.yaml` as the current mower contract.
- **`blink/`** (committed `e830083` 2026-06-25 "bundle all 12 integration files in repo — no GitHub API needed"; patched `f3ae126` and `1f2cdec` 2026-07-03) — a full vendored copy of HA's Blink integration, version string `2026.7.0-hcc-blinkpy257`. The two 07-03 patches record the Blink login fight: a dedicated cookie session to fix the `empty_cookies` login failure, and the blinkpy 0.25.2 → **0.25.7** bump ("the actual fix for 'Login failed'"). **INFERRED:** this folder exists so the patched integration could be installed on Beehive from the Pages site without GitHub access; whether Beehive still runs this exact snapshot is not evidenced at tip.
- **`custom_components/bhyve/`** + **`INSTALL.md`** + **`install-bhyve.sh`** (committed `768cb6a` 2026-06-24, "Build Orbit B-Hyve custom HA integration + fix Cloudflare IP block") — a from-scratch Orbit B-Hyve custom integration, written because, per INSTALL.md: "This custom integration runs on YOUR Home Assistant (Beehive) so it calls the B-Hyve API from your home IP — not from Cloudflare." (The commit title records the origin problem: Orbit blocked Cloudflare's IPs.) Zones surface as `switch.bhyve_zone_N`; "The irrigation section automatically picks up the new zones. No further setup needed in the app." `install-bhyve.sh` wgets the seven files from `raw.githubusercontent.com/d4c2np9f69-afk/master-the-master-/claude/time-master-project-liq1jw/...`.

#### 5.3 `firmware/mower_hours_esp32/` — the canonical mower firmware (at tip)

Committed `a1cfa53` 2026-08-11 ("Put the mower firmware in the repo, credentials extracted"). Three files: `README.md`, `mower_hours_esp32.ino` (51 KB), `secrets.example.h`. The README's opening is the project's most expensive lesson, verbatim:

> **This is the canonical copy.** It lives in the repo deliberately.
>
> For months the hour meter didn't work. The box sent `hours_seconds`, the app read `d.hours`, and nothing converted between them — 5.5 hours of real runtime and 6.3 km of real mowing went unrecorded across five mows. **Jeff was told the sensors were faulty and bought replacement hardware to fix what was a field-name mismatch.**
>
> The reason it went unnoticed so long is structural, not carelessness: the cloud session that owned the server code has **no outbound network** and **could not see this file**. It was writing `functions/api/hours.js` against `CLAUDE.md`'s prose *description* of the firmware, and that description was wrong. Nobody could diff the two halves of the contract because only one half was in the repo. Now both halves are here.

Other hard-won facts recorded there: **the repo is public**, so secrets live in gitignored `secrets.h` — and "**Splitting the source does NOT make the binary safe.** Those strings are compiled into the `.bin` as plaintext. Verified on 2026-08-11 by grepping a real build" (with the extra trap that `strings` isn't installed on Jeff's PC and "returns a silent false 'clean'" — use `grep -a`). Therefore "a firmware image **must never be served from a public URL**, including this project's own Pages site… it is why OTA is written but not yet enabled." Flashing: "**Auto-reset does not work on this board.** Jeff must hold the BOOT button down through the *entire* upload or it fails with `Wrong boot mode detected (0x13)`." Behavior contract: "**Running: posts nothing** … 'A heartbeat followed a live reading' is a state that cannot occur — the server was once built on the assumption it could, and mow history silently never recorded a single mow because of it." Two-way control channel (1.4.0+): commands `zero_tilt`, `clear_track`, `flush_buffer`, `reboot`, `ota`, acked by id; "The box sleeps between uploads and cannot be woken, so a command lands on its next post — up to 5 minutes while parked. That is the hardware, not a bug." Tilt zeroing exists because the enclosure is bolted at an angle ("a level mower read −12.4° / 28.5° and the app's tip-risk warning read CRITICAL in a garage"). Board-swap rules (hours/distance/tilt live only in that chip's flash). The `.ino` header preserves Jeff's own words on the watchdog: "Jeff's words for why this exists: *'I would only push it if it got hung up.'*" Final rule: "This subsystem is the local coworker session's, end to end — see `CLAUDE.md` Rule 13."

#### 5.4 `_headers` — Cloudflare Pages cache headers

Three commits, all during the July stale-cache fight: `173270a` 2026-07-20 ("Fix root cause of recurring stale-cache bug: no-cache service-worker.js"), `70dba84` and `e37a193` 2026-07-21 ("Fix SW cache permanently: registration + CDN-Cache-Control + no-store"); last touched `186025f` 2026-08-15. Content: `/service-worker.js` gets `Cache-Control: no-cache, no-store, must-revalidate` **and** `CDN-Cache-Control: no-store` (so Cloudflare's edge can't serve a stale worker); `/` and `/index.html` get `Cache-Control: no-cache` plus `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`. **Trap:** this file is the permanent fix for the recurring "Jeff sees an old version on his phone" class of bug — do not remove or weaken it.

#### 5.5 `.github/workflows/deploy.yml` — the disabled workflow that spammed Jeff's inbox

Created `8fdae39`/`1d7cacc` 2026-06-22; **disabled** `ac99b33` 2026-08-06 ("Stop the GitHub Actions failure-email flood: disable the dead deploy workflow"). The in-file comment tells the story:

> DISABLED 2026-08-06. This workflow has never worked — the CLOUDFLARE_API_TOKEN secret does not exist, so every push failed and emailed Jeff (**124 failure notices in one week**). Deploys do NOT go through Actions: Cloudflare Pages' native Git integration watches claude/time-master-project-liq1jw and deploys on push, independently of this file. See CLAUDE.md "Deployment Pipeline". Trigger reduced to manual-only so it can never fire automatically again.

The commit message adds it "was the single largest source of mail in his inbox," and that the file was kept (trigger `workflow_dispatch` only) rather than deleted "so the job definition stays available if the secret is ever added." **Trap:** never re-enable `on: push` here; deploys are Cloudflare-native.

#### 5.6 Other tip-level items in scope

`ls` of the tip also shows: `backups/` (seven `*.2026-06-24.bak` files — pre-refactor copies of index.html, service-worker.js and the API functions from 06-24; historical, not live code), `Toro_TimeMaster_PWA_Package.zip` (the original 2026-05-19 ChatGPT-era PWA package, kept at root), `install-hacs.ps1` / `setup-hcc.ps1` / `windows-scripts/` (Windows-side setup scripts, covered elsewhere in this record), `icons/`, `images/` (the hero set: hero-home-dusk, hero-weather, hero-irr, hero-yard, hero-cameras, hero-car, hero-truck, hero-guardian, hero-lux, util-electric/gas/water, splash-portrait/landscape, mower-marker), `functions/` (the Cloudflare Pages API — another section's subject), and `manifest.json`/`service-worker.js` (the PWA shell). The mower documentation trio in `docs/mower/` (`gps_firmware_handoff_2026-08-10.md`, `gps_firmware_coworker_findings_2026-08-11.md`, `CLOUD_SESSION_TASKS_2026-08-11.md`) pairs with §5.3's firmware and is covered in the mower section of this record.

---

### Cross-cutting traps distilled from these files (for any future session)

1. **Inovelli is dead. Kasa auto-update off, always. Sylvania is settled. SHIP 2.0 needs TP-Link creds.** These four are the "do not re-litigate" list of the lighting project (`zigbee_dimmer_selection_2026-08-13.md`, `kasa_smart_lighting_project_2026-08-06.md`, `HCC_INVENTORY.md`).
2. **A decision made in conversation goes into the doc the SAME session** — commit `1572b4a`'s standing lesson, written after the $120 Inovelli decision was lost and re-pitched to Jeff.
3. **Check `HCC_INVENTORY.md` before buying anything** ("Nothing gets bought twice because nobody checked this file") and log at order time; sync the iCloud copy.
4. **Zigbee purchases: verify the exact protocol variant and the Z2M device page** — the project owns one wrong-variant WiFi sensor ($5.68) and dodged a mesh-breaking dimmer because of this rule. "Requires a hub" = Zigbee; "No hub required" = WiFi.
5. **Nothing Zigbee gets unboxed until the camera/alert pipeline is verified** — Jeff's explicit sequencing order, 2026-08-15.
6. **Lucky Mike is queued behind utilities** (Jeff, 2026-06-30) — plans are complete, nothing is built, unit #1 is a demo at parts cost, and the ChatGPT deck has nine documented errors to fix first.
7. **`beehive-config/` is a snapshot, not the live HA; `beehive/esphome/hcc-mower.yaml` is superseded firmware; `firmware/mower_hours_esp32/` is canonical.** The hour-meter disaster (replacement hardware bought for a field-name mismatch) happened precisely because only one half of a contract was in the repo.
8. **Deploys are Cloudflare-native; the Actions workflow stays manual-only; `_headers` no-cache rules stay.** Both were expensive to learn (124 failure emails; weeks of stale-cache bugs).
9. **Hero look is governed centrally** — one grade in `index.html`, spec in `HERO-STYLE-GUIDE.json`, doc in `hero-master-grade.md`; never per-hero filters, never regenerate images to fix tone. And note `dev.html`'s mirrored filter values have drifted from the doc — reconcile against `index.html` before trusting either.


---

## The Repos and Branches — where the history actually lives

*This section was written directly by the assembling session from first-hand inspection of the
live GitHub remotes on 2026-08-16, not by a mining agent. Every fact below was verified by
running the command shown.*

This is the single most operationally important section in this record. **The history everyone
thought was lost was never lost — it was on a branch nobody looked at.** A session that clones
this project and looks only at the default branch sees one commit and concludes there is no
history. That mistake is what produced the archive request this document answers.

### The topology, verified

**Repo `d4c2np9f69-afk/Master-the-Master-`** — the live project.

| Ref | Commits | Span | What it is |
|---|---|---|---|
| `main` | **1** | 2026-05-20 only | Contains ONLY `Toro_TimeMaster_PWA_Package.zip`. A trap. |
| `claude/time-master-project-liq1jw` | **636** | 2026-05-20 → 2026-08-16 | **THE REAL HISTORY.** Cloudflare Pages deploys from this branch. |
| `claude/electric-smarthub-real-data-dv0pxe` | **559** | 2026-05-20 → 2026-08-11 | Parallel branch; ends 5 days earlier. |
| `refs/pull/1/head` | = liq1jw tip | — | PR #1, opened from the work branch. |

Verified by:
```
git ls-remote origin
git rev-list --count origin/claude/time-master-project-liq1jw   # 636
```

**The trap, stated plainly:** a plain `git clone` of this repo checks out `main`, which has a
single commit — `09f02d4`, "Add files via upload", the original PWA zip. Nothing else. `git log`
shows one line. A session that stops there will conclude the project has no history and will
either ask Jeff to re-explain everything or invent an answer. CLAUDE.md has warned about this
since 2026-06-24 — *"`main` branch: contains only `Toro_TimeMaster_PWA_Package.zip` — do NOT use
it for deploys"* — but the warning is in a file that lives on the branch you have to already
have found.

**Worse: the work branches are not fetched by a shallow or default clone in every environment.**
In this very session, the first clone showed only `main` and the task branch. The work branches
only appeared after an explicit:
```
git fetch origin 'refs/heads/claude/*:refs/remotes/origin/claude/*'
```
That single command is the difference between "the history is gone" and 636 commits of it.

### The two claude/ branches

`claude/time-master-project-liq1jw` (636 commits) and
`claude/electric-smarthub-real-data-dv0pxe` (559 commits) share the same root commit and diverge.
The liq1jw branch is the authoritative one: it is the deploy branch named in CLAUDE.md, it runs
5 days later, and it carries the tip commit `1d1ebdb` ("Build the HCC MASTER RECORD"). 

**INFERRED:** the electric-smarthub branch is a Claude-Code-created working branch from a session
whose task was the electric-monitoring work, which then accumulated general project commits
alongside it. A dedicated agent was assigned to enumerate any commits unique to it and was
interrupted by the usage limit before reporting; **that enumeration is an open item** — see the
Honest Gaps section. Until it is done, treat `electric-smarthub-real-data-dv0pxe` as *possibly*
holding a small number of commits not present on liq1jw.

### Repo `d4c2np9f69-afk/Toro-Timemaster-` — the archived predecessor

Archived on GitHub (read-only), last push 2026-08-06.

| Ref | Commits | Span |
|---|---|---|
| `main` | 41 | 2026-05-20 → 2026-06-24 |
| its two `claude/*` branches | 60 each | 2026-05-20 → 2026-07-26 |

Its `main` holds the June era in clean form and ends at `c200a18` (2026-06-24), *"Add backups/
folder — physical copies of all working files as of 2026-06-24"* — the safety-net commit whose
message also records a branch `backup/verified-working-2026-06-24` pinned to `e904a5b` (the
66/66-tests-passing state). Its `claude/*` branches carry commits titled *"Sync from
Master-the-Master-"* through 2026-07-26, then stop.

**The relationship:** work moved to `Master-the-Master-` and this repo was kept as a mirror,
synced by hand, until the syncing stopped in late July. **It is an incomplete mirror** — its tip
does not contain `functions/api/ha.js`, `auth.js`, `climate.js`, or `mowconditions.js`, all of
which CLAUDE.md lists as key files. Do not treat it as a backup of the current app. Its real
value is the `backups/*.2026-06-24.bak` files: literal copies of the working June 24 app.

### What a future session must do — the four commands

```bash
git clone https://github.com/d4c2np9f69-afk/Master-the-Master-
cd Master-the-Master-
git fetch origin 'refs/heads/claude/*:refs/remotes/origin/claude/*'
git checkout claude/time-master-project-liq1jw
```
Only after the third command does the project exist. Then read `CLAUDE.md` and
`docs/SESSION_START.md` at that branch tip.

### The archival risk, stated for the record

As of 2026-08-16 the entire live application — `index.html` (~7,400 lines), every Cloudflare
Function, every doc, and 636 commits of history — exists in exactly **two** places: this GitHub
branch, and Jeff's PC. It is not on `main`. It is not fully in the archived mirror. If the work
branch were deleted, GitHub's default view of this repository would show a single zip file and
nothing else. **Recommendation: merge the work branch into `main`, or set `main` to point at it,
so the default view of the repository is the project rather than a decoy.**


---

## Guessing vs. Looking It Up — every time research solved what guesswork burned time on

This section collects, from the git history (branch `origin/claude/time-master-project-liq1jw`, 636 commits, 2026-05-20 → 2026-08-16) and the project docs (`CLAUDE.md`, `docs/SESSION_START.md`, `docs/CHANGELOG_ARCHIVE.md`, `docs/BEEHIVE_REFERENCE.md`, `docs/lighting/`, `docs/inventory/`, `docs/beehive/`), every documented instance where time went into guesses and trial-and-error and the eventual fix came from actually looking something up: a web search, a forum thread, an integration's real source code, official release notes, vendor documentation — or asking the actual human authority (the water utility, NOAA's NSSL, Mercedes' own app). It also records the times the lookup came FIRST and saved the guessing round entirely, because the contrast is the point.

Honesty rules used throughout: every claim carries a commit hash + date or a file path; anything the record does not actually say is marked **INFERRED**; where the record is silent on how much wall-clock time was burned, that silence is stated rather than papered over.

---

### 1. LUX thermostat API (2026-06-25 → 06-26) — two guessed backends, four guessed login formats, and the answer sitting in a PyPI package's source

**The guessing phase, in order:**

1. The CLIMATE section shipped with a proxy against a guessed/assumed "LUX Connected Home API" backend (`abedf2a`, 2026-06-26 00:00 UTC). The first diagnostic commit (`7c0d3c5`, 06-26) had to surface the raw error just to see what was happening.
2. `1e43569` (06-26 02:15): the original hostname `integration.lux-geo.com` **did not exist at all** — "CF error 1016 DNS failure" — so the code was pointed at `api.geotogether.com`, the Geo platform. This was still wrong (see below), but it at least resolved in DNS.
3. `46d8a36` (06-26 02:20): 403 Forbidden → the response was to guess harder:
   > "403 Forbidden from api.geotogether.com — clientId may be wrong. Now tries android-geo-home, ios-geo-home, no clientId, email field in order."
4. `7f74537` (06-26 02:26): first real lookup — "From reverse-engineering geo-energy-data-client Go source" — fixed the endpoint casing, the `identity` field, the `accessToken` response key. Reading source instead of guessing formats. But it was source for the wrong platform.

**The lookup that solved it:** `9eaabcb` (06-26 02:44) — the commit message is the confession and the fix in one:

> "Previous code used api.geotogether.com (UK smart meters — completely wrong). Real LUX Connected Home API discovered via luxgeo PyPI package source: Auth: Azure AD B2C PKCE flow at connecteddevicesjci.b2clogin.com … API: https://www.myluxstat.io/api/"

The app had spent the whole login phase talking to a **UK smart-meter platform** because the vendor name "Geo" was a plausible-sounding association. The real backend (Azure B2C + `myluxstat.io`) was found by reading the source of the `luxgeo` PyPI package — a lookup that was available from minute one. Live and confirmed working ~20 minutes later (`94e2b34`, 06-26 03:03: "Device CS1-DD-FB connected, 72F room temp, cooling mode displaying").

**Elapsed guessing:** roughly 00:00 → 02:44 UTC on the login problem alone (about 2¾ hours of commits; the record is silent on the conversation time around them).

**The setpoint PUT-500 sequel — honest characterization: this one was NOT solved by research.** After login worked, writing a setpoint returned HTTP 500, and the record shows six escalating attempts across the day of 06-26:

- `c37317d` (06:24): GET full state before PUT — "Pattern (confirmed from hass-lux-geo source)". A source lookup, but for a pattern that turned out not to apply to this backend.
- `f09c696` (16:05): strip read-only fields before PUT.
- `9febaec` (16:12): minimal one-field body + try PATCH as fallback.
- `35f61cc` (16:15): try the device ID in the URL path — `/api/device/{id}`, then `/api/devices/{id}`, then `/api/device`.
- `f143830` (16:21): "Match Python luxgeo package exactly… Also try POST and PATCH as fallbacks. Add User-Agent and Accept headers."
- `b360583` (16:23): **fixed** —
  > "Confirmed working: Jeff changed setpoint to 73F and official LUX app showed the change. POST /api/device is the correct write method. PUT was always returning 500 (wrong method for this API)."

The winning move was a brute-force method sweep, i.e. structured guessing that happened to include the right verb. Neither of the two source packages read (`hass-lux-geo`, `luxgeo`) had the answer, because the app's write path differed from theirs. Documented same minute in `07409da` (06-26 16:24, "POST /api/device is the write method"). This is recorded here so the section stays honest: research fixed the LUX login; the LUX write verb was won by trial-and-error, and the record says so.

---

### 2. B-Hyve login (2026-06-25) — a stale guessed URL fixed against the pybhyve protocol

The original irrigation code called `api.orbitonline.com/v1`, which returned 404 ("endpoint gone") — corrected to `api.orbitbhyve.com/v1` in `d56d92b` (06-25). The new API then rejected the guessed login body ("email: disallowed-key … session: can't be blank" — `c203988`, 06-25), and the full working header/body set finally came from the reference implementation: `77c70e7` (06-25) specifies `Orbit-Session-Token: ""` on login explicitly as "(pybhyve protocol)" — i.e. the open-source B-Hyve Python client's source, not another guess. **INFERRED:** the intermediate fixes read like error-message-driven iteration with the pybhyve source consulted by the third commit; the record does not state when in the sequence the source was first opened.

---

### 3. The mPING report card (2026-06-26 → 07-02) — built the whole feature first, asked NOAA later; the authority's answer was "never"

**What was built on assumption:** a full native mPING reporting card — 11 tap buttons, GPS, a Cloudflare proxy to `mping.nssl.noaa.gov/mping/api/v2/`, spotter credit — shipped in `b7ff936` (06-26). It could never submit: the API needs an NSSL-issued token. The card was then swapped for a link (`adc5377`, 07-01: "mPING submit can't work without an NSSL-issued API token (not self-serve)… which just showed 'token not configured'"), then **restored** as an in-app form (`6b29cad`, 07-01), and a token setup guide was written (`f935e31`, 07-01; still in the repo at `docs/utilities/mPING_token_setup.md`) — all on the assumption a token was obtainable.

**The lookup that ended it — asking NSSL itself:** `5e6c20b` (07-02):

> "mPING: NSSL confirmed no automated/app reports ever, so repurpose that card to the official mPING app instead of chasing a token."

Finalized in `947a99d` (07-03): "NSSL confirmed no automated/app reports are allowed" — the form, handlers, CSS, and `/api/mping` were all deleted. **Six days** elapsed between building the feature and hearing the one-sentence answer from the people who run the API. The record contains no recorded lesson for this one, but it is the cleanest early example of the pattern Jeff asked this section to document: the authoritative answer existed the whole time, and everything built before asking was thrown away.

---

### 4. Blink cameras (2026-06-25 → 07-09) — two weeks of custom-override surgery vs. one session of web research

Jeff's #1 wanted feature (recorded as such in `17d388a`, 07-03). The longest and best-documented guess-vs-lookup arc in the project.

**The guessing/patching phase:**

- **06-25:** a same-day flurry of ~12 commits building a *custom patched copy* of HA's Blink integration and an installer for it: `b86a37e` (patched `config_flow.py` + `/blink` endpoint), `34d81ea`, `42793fa`, `23c42cd`, `6002c54`, `d110f3d`, `c7ad70d`, `31a7902`, `557aa14`, `4ccb9fb`, `e830083` (bundle all 12 files in the repo), `b89ba28` (re-raise `BlinkTwoFARequiredError`), `dbc8fbe` (surface `ConfigEntryAuthFailed`). All of it aimed at a 2FA flow that was broken for a reason nobody had yet identified.
- **07-03, theory #1 (cookies):** `f3ae126` — "Root cause (confirmed via blinkpy #1217 / HA #173419): Blink's server rejects the 2FA step with error_cause=empty_cookies because HA's SHARED aiohttp session drops the auth cookies… No published upstream fix yet." Note this WAS a lookup (upstream issue threads) — but it pinned the wrong mechanism, and the fix stayed custom.
- **07-03, theory #2 (the real mechanism, found in the library's source):** `1f2cdec` —
  > "Found the real root cause by diffing blinkpy in the harness: Blink changed their OAuth signin to signal 2FA-required with HTTP 202 + tsv_state/tsv_methods fields. blinkpy 0.25.2's oauth_signin only recognizes the OLD 412 code… blinkpy 0.25.7 added 202/tsv handling (confirmed in api.py:oauth_signin)… the cookie theory was the wrong diagnosis; the 202 handling is the fix."
  Correct diagnosis at last — by reading the library's actual source — but the response was still to pin `blinkpy==0.25.7` inside the *custom override* (recorded in `59c8749`, 07-03).

**The lookup that actually finished it:** `9b29c1f` (07-09) — subject line: "Blink: record real root cause + official fix (blinkpy 0.25.6 / HA 2026.6.4); **our custom override is now the blocker**". The CLAUDE.md entry it wrote (quoted from the commit's diff) is the project's fullest recorded research-beats-guessing verdict:

> "🎥 **BLINK ROOT CAUSE FOUND (web research) — official fix shipped; our custom component is now the blocker.** Blink's 2FA now returns HTTP 202 (`tsv_state`/`tsv_methods`); old blinkpy read 202 as success so the PIN never showed → 'Login failed.' Fixed upstream in **blinkpy 0.25.6** (PR #1231) → **HA core 2026.6.4** (PR #173811, 'no HA-side changes needed'). Our July-3 `custom_components/blink/` override now **shadows HA's fixed built-in with stale code** — the log's `ConfigEntryNotReady` is from OUR `coordinator.py:58`. **Fix = delete the override + the broken entry, update HA ≥ 2026.6.4, use the built-in Blink integration**… Wait ~30 min after deleting before re-adding (our old code hammered Blink's login for days → possible rate-limit). Do NOT re-add a custom blink override."

And the Pending-item rewrite in the same commit says it plainly:

> "The earlier 'empty_cookies / dedicated session' theory was a wrong guess; the real bug was the 202 handling, now fixed in the library."

Cameras went live the same day — `7bbc8a2` (07-09): "Blink cameras LIVE in the app (Jeff's #1 feature) — all 6 cameras confirmed."

**Cost of the guessing phase:** 06-25 → 07-09, **14 days** on the project's #1 feature; a custom component that outlived its usefulness and *became the bug*; and collateral damage recorded in the fix itself — "our old code has hammered Blink's login every ~10s for days → possible rate-limit." The condensed archive keeps the scar as a permanent instruction: "Blink cameras live (removed a stale `custom_components/blink` override — **never re-add it**)" (`docs/CHANGELOG_ARCHIVE.md`, 07-09 → 07-15 entry). The official fix (blinkpy 0.25.6, merged upstream) existed before 07-09; the record does not state the exact day it shipped, so exactly how many of those 14 days a release-notes check would have saved is **INFERRED** to be "several, at minimum" — the 07-09 session found it by ordinary web research the moment it looked.

A late echo (research-first this time): on 07-31 the coworker root-caused the "camera popups missing or 10-15 min late" complaint to "the known upstream blinkpy LoginError crash (home-assistant/core#176836, fronzbot/blinkpy#1217, no fix in either yet)" and built the `HCC — Blink Auto-Heal` automation around the *documented* upstream bug rather than guessing at local config (`fd15642`, 07-31).

---

### 5. The water meter (2026-06-27 → 07-02) — an AES decryption stack planned around a key that was never needed; the WHUD supervisor ended it in one briefing

**The speculation phase:**

- `394217f` (06-27): the plan on record — "Kamstrup 621 water meter project. ESP32 + CC1101 (915MHz) wireless M-Bus receiver — CC1101 driver, wM-Bus decode, CRC, **AES-128 decryption**, MQTT → Home Assistant. **Blocked on the per-meter AES key** (Jeff requesting from utility Mon 2026-06-30)."
- `76d0326` (06-27): first correction, from Jeff's photos, not from the web — the meter is a "Kamstrup flowIQ 2100 (not 621)"; the electric meter guess ("not Itron — CC1101 can't read it") also corrected the same way.
- `9fefa97` (06-30): the pivotal observation, again from photos — a **separate external AMR pit radio** (MODEL 100WD, endpoint 79453337) is wired to the Kamstrup register: "likely how the utility actually reads it. May change the decode path from Kamstrup wM-Bus to the MIU's protocol. Updated the utility-call script to ask which radio is read + **get the AES key in hex**."
- A formal data-request form for WHUD was built and compressed to one page (`37d814f`, `0005662`, both 06-30; still in the repo at `docs/utilities/WHUD_Water_Meter_Data_Request_v2.html`/`.pdf`) — still asking for the AES key.
- `75c1a27` (07-01): a storage decision was even made for the key ("record AES meter-key storage decision (Apple Passwords, not Cloudflare)") — hours before learning no key existed to store.

**The authority's answer:** `5034f26` (07-01) — subject: "docs: water meter blocker RESOLVED - unencrypted Itron ERT-SCM, no key needed":

> "WHUD meter supervisor briefed Jeff in person. Water meter is read via the unencrypted 100WD MIU (endpoint 79453337, protocol ERT-SCM, ~915-930 MHz, SCM every minute + hourly big read). **No AES key required.**… Both gas + water now read by one RTL-SDR + rtl_433; **CC1101/ESP32/AES stack demoted to backup path.**"

One conversation with the person who actually reads the meters dissolved four days of encryption planning (06-27 → 07-01). Both meters were live in HA the next day — `0f94198` (07-02): "water + gas meters LIVE via rtlamr2mqtt (confirmed IDs + protocols)." The gas side had the same shape in miniature: `719638f` (06-30) confirmed from the photographed label that gas is an "ITRON 100G DATALOGGING ERT… confirmed, unencrypted, no key."

A small same-week companion save: `9100fcc` (07-02) — "Jeff found a Windows SDR#/Zadig/WinUSB guide - that's the wrong path for our setup. The dongle goes into the J45 (HA OS) and rtl_433 add-on provides the Linux driver" — a lookup that prevented a whole Windows driver detour.

**The record is silent** on how many hours the ESP32/CC1101/AES design itself consumed before 06-27; what is documented is that the entire decode-and-decrypt architecture was drawn up before anyone asked WHUD which radio they actually read.

---

### 6. B-Hyve watering history (2026-07-01) — declared a definitive dead end at 03:42, solved by web research at 03:53

The tightest guess-vs-lookup timestamp pair in the whole history, all in one overnight session:

1. `4b0d00e` → `61692a7` (03:27): the guessed query-form endpoint failed — "/watering_events 404s (endpoint doesn't exist)" — so the code fell back to guessing at status fields ("trying common timestamp fields").
2. `2a2eb76` (03:42:09): surrender, on the evidence available — "**Confirmed from Jeff's device: B-Hyve's REST API does NOT expose watering history** — watering_statuses is [], watering_status is just {clear_on_idle:true}, no history endpoint." The app was rewritten to self-track observed runs instead.
3. `d5df6e9` (03:42:45): the dead end written into memory — "record definitive B-Hyve no-history finding."
4. `379b13d` (03:53:47): **eleven minutes later**, the lookup —
   > "Web research (pybhyve / bhyve-home-assistant) confirmed the real B-Hyve history endpoint puts the device id in the PATH: GET /v1/watering_events/{device_id} (with pagination). **My earlier ?device_id= query form 404'd — that was the whole problem.**… So the history IS pullable after all."
5. `1d23b5d` (03:54:38): memory corrected — "correct irrigation history — endpoint found (path form), not a dead end."

Confirmed working against the real device shortly after (`b947011`, 07-01: "Last Watered confirmed working (reads 7:30 AM)"). The wrong "definitive" conclusion lived for 11 minutes only because the research finally happened; had the session ended at 03:43, the app would have shipped self-tracked history and the false "no history" verdict would have been carried forward in CLAUDE.md as settled fact. Two open-source projects (pybhyve, bhyve-home-assistant) had the endpoint the whole time — the same pybhyve that had already supplied the login protocol on 06-25 (incident 2).

---

### 7. SYLVANIA plugs (2026-07-07; corrected 2026-08-13) — a hands-on dead end confirmed by forums, then two further guesses corrected by an actual network scan

**07-07:** a full pairing campaign against Jeff's existing SYLVANIA Smart+ WiFi plugs — both EZ (fast-blink) and AP (slow-blink) modes, iPhone forced to 2.4 GHz (the gateway's 5 GHz radio was disabled for the attempt), Bluetooth on, all permissions granted — every attempt rejected by Smart Life with "Unknown device — this device is not supported by this app." The verdict commit `f010694` (07-07):

> "Confirmed via Smart Life's own 'device not supported by this app' error (both EZ and AP mode, all iOS perms/BT/2.4-only correct) **plus forum consensus that certain SYLVANIA Smart+ plugs don't work with Tuya/Smart Life**. Recorded in CLAUDE.md so we don't re-attempt the Tuya path."

The forum lookup here confirmed the dead end rather than preventing it. **Could the lookup have preceded the attempt and saved the pairing session (including toggling the household's 5 GHz radio off)? The record does not say the forums were checked first, and the phrasing ("Confirmed via… plus forum consensus") reads as attempt-first. INFERRED: a forum search before the first pairing attempt would likely have produced the same verdict without the hands-on campaign.** These were plugs Jeff already owned, so no purchase was at stake — the cost was the session time and the gateway fiddling (the same commit carries the loose end: "Reminder to turn the BGW320-500 5GHz back on").

**The 08-13 postscript — guesses about the same plugs corrected by measurement:** `2aca121` (08-13): "Network map: Sylvania plugs are WiFi Tuya (.199/.200/.202/.205) - **Echo Dot guess and Bluetooth-only verdict both wrong, corrected**." The network map itself (`docs/inventory/NETWORK_MAP.md`) records both the earlier guess ("3× wlan0… likely **Echo Dots** (?)") and the correction: "✅ **The 4 Sylvania SMART+ WiFi lamp plugs, living room** — Tuya port 6668 confirmed on all four 08-13 evening. NOT Echo Dots, NOT Bluetooth: earlier 'pull test showed nothing' was a monitor watching the wrong IPs. CAN join HA via Smart Life re-pair if ever wanted." (For completeness: the tip `CLAUDE.md` "Settled decisions" section still carries the operative rule — "Sylvania WiFi plugs are vendor-locked and CANNOT join HA. Settled — do not retry Smart Life." Both statements are in the record; the settled decision is the one marked do-not-reopen.)

---

### 8. The Fire TV pop-up and pause war (2026-07-11 → 07-15) — synthetic Alexa commands and `keyevent 127` vs. ADB and the Android MediaSession API

**Round 1 — the Alexa synthetic-command guess (07-11):** the camera pop-up was built on `media_player.play_media / custom / "show me the X camera"` via alexa_media_player, and the changelog claimed victory: `987e804` (07-11, "Log confirmed-working Fire TV camera pop-up mechanism": "Live-tested… confirmed working on the physical screen") and `a88ccc6` (07-11, "Fire TV motion pop-up alerts: built, deployed, and **confirmed working end-to-end**").

**Round 2 — reality (07-14):** with the AI pipeline verified healthy (`c13f101`, 07-14, found CodeProject.AI had been silently down 3 days), two live tests failed: `b108a6e` (07-14) —

> "TV pop-up did not appear either time… Narrowed to alexa_media_player's synthetic play_media/custom-command call not behaving like a real voice command for cross-device camera display. **Corrected the 07-11 changelog's 'confirmed working end-to-end' claim, which this disproves**."

**Round 3 — the fix, one hour later (07-14):** `25e3256` — "Fire TV pop-up actually fixed: ADB browser launch instead of Alexa":

> "Alexa's synthetic show-camera command was a **confirmed dead end** (Amazon doesn't honor it for Fire TV the way it does a real spoken command), and Blink's official Fire TV app is incompatible with this device model. Found a third path that bypasses both: androidtv.adb_command opens the camera's live entity_picture URL directly in the Fire TV's browser."

**Round 4 — the pause guess (07-11 → 07-15):** the same 07-11 automation had sent `input keyevent 127` "hoping it would pause playback." `2965b5a` (07-15):

> "**verified live via ADB that it never actually did anything**. Replaced with cmd media_session dispatch pause/play, which drives the **Android MediaSession API** directly and works system-wide across any app implementing the standard (**all Fire OS apps per Amazon's own requirements**), not just Fubo. Verified live: genuine pause with frozen position, exact resume on a DVR recording."

The winning mechanism cites the platform's own API contract and Amazon's Fire OS app requirements — i.e., what the platform documents, not what a keycode chart suggests. **INFERRED:** the commit does not name the specific Amazon/Android document consulted; the "per Amazon's own requirements" phrasing is the evidence that documentation, not another keycode guess, drove the replacement. Related same-day findings that were measurement- rather than research-driven (recorded for completeness, not counted as lookup wins): the 5-minute Blink cloud-poll delay and the FuboTV cold-start-on-relaunch behavior (`3a714fe`, 07-15).

**Cost:** the synthetic-command mechanism was believed working from 07-11 to 07-14 (with the real detection pipeline coincidentally dead for those same 3 days, which is what let the belief survive); `keyevent 127` was a silent no-op in production from 07-11 to 07-15.

---

### 9. "Alexa, fast forward" (2026-07-21 → 08-03) — the phrase that could never work, proven by HA's source code and Amazon's own forums

On 07-21 the coworker wired commercial-skip scripts and exposed them to Alexa (CLAUDE.md 07-21 coworker entry, preserved at `git show c64d0f8:CLAUDE.md`: "that's the whole reason 'Alexa FF the commercials' wasn't working… Voice phrases: 'Alexa, turn on HCC Skip Commercial Break'…"). By 08-03 Jeff reported "Alexa fast-forward isn't working" and — his own instinct, worth recording — "asked to check HA community forums for correct setup."

Two commits that day did the looking-up:

- `a5db5dc` (08-03): audited every Fire TV line in the repo and — in the commit's own words — "**Confirmed via WebFetch/WebSearch against HA's androidtv integration source and the underlying python-androidtv library (not guessed)** that these are exactly what the library maps to real fast-forward/rewind ADB keyevents."
- `d755a6a` (08-03, "Document real root cause of 'Alexa fast-forward' via HA source + Amazon forums"):
  > "Read HA core's actual alexa/handlers.py: the Alexa Smart Home integration has **no handler for PlaybackController.FastForward/Rewind** (only Play/Pause/Stop/Next/Previous), matching open issue home-assistant/core#87327. Cross-checked Amazon's own community forums: custom Alexa Routines using phrases that sound like built-in media commands **get intercepted natively and never reach the routine**… Net result: the literal phrase 'fast forward' can never trigger script.hcc_skip_commercial, in either exposure path — this isn't a Beehive misconfiguration or an ADB pairing issue."

The fix was a non-colliding phrase, delivered by the coworker the same day (CLAUDE.md 08-03 coworker entry: "Fixed Alexa fast-forward via native phrasing (not a Routine)"). The literal phrase had been the plan since 07-21 — **13 days** of a voice feature that was architecturally impossible, settled in one session of reading the integration's handler source and Amazon's forums. No guessing round happened on 08-03 itself; this incident is both a cost entry (07-21's phrase choice was never checkable-by-guessing) and a model of the lookup done right.

---

### 10. The mbapi2020 CAR-commands rewrite (2026-07-16 → 07-24) — entity-guessing where every button failed, then the research-first rewrite, and the PIN-prompt relapse

The incident that produced the project's clearest written research-first rule.

**How much guess-based code existed before the rewrite:** the CAR section was built 07-16 (`33d604a`, `767ee03`) and wired to live data 07-17 (`7afcda2`). From 07-17 the command code in `index.html` worked by keyword-guessing against whatever entities HA returned — e.g. `carRemoteClimate()` filtered `_grdStates` for `switch./button.` entities whose ids contained `'preheat'`, `'precond'`, or `'preclimat'`; `carFlashLights()` POSTed to a **hardcoded guessed entity id** `button.mercedes_gle_350_sigpos_start` (both visible at `git show 7afcda2:index.html`). On the night of 07-22 (00:08–00:20 UTC) three more buttons were stacked on the same guessing substrate: REMOTE START on the first tab (`22d907f`), MAX COOL (`782277b`), MAX HEAT (`2820cdc`), then a whole-car expansion with new guess-helpers `carFindMerc`/`carMaxEntity`/`carStartPrecond` (`bfccb3b`).

**The failure, in the record's own words:** `8d339ee` (07-22 00:32) —

> "Root cause: all car command functions (lock, remote start, max cool, max heat) were searching _grdStates with **narrow keyword guesses that didn't match real mbapi2020 entity names, so every button failed**."

That first rewrite was still entity-based ("use discovered entities, not hardcoded guesses"), paired with an Entity Scan panel whose stated purpose was "This lets us see the real entity names **instead of guessing**" (`59db50e`, 00:34).

**The research-first rewrite, 21 minutes later:** `778f6bd` (07-22 00:53) — "Rewrite CAR commands with proper mbapi2020 domain services (**researched from source**)". The CLAUDE.md changelog entry (preserved at `git show c64d0f8:CLAUDE.md`) records both the directive and the method:

> "**CAR commands rewritten with proper mbapi2020 service calls** (research-first, **per Jeff's directive**). Thorough research of mbapi2020 GitHub repo, README, source code (client.py, switch.py, lock.py, button.py, services.yaml, const.py), HA community forums. **Key findings:** (1) `preheat_start` = EV-only, NOT for gas GLE 350; (2) `engine_start` = correct remote start for gas (PIN required); (3) `auxheat_start` = gas vehicle auxiliary heater…; (4) all commands use `mbapi2020.*` domain services with VIN, not generic entity-based calls; (5) PIN must be configured in mbapi2020 integration options.… **Lesson: never guess entity names or service calls — research the integration's actual source code and use domain-specific services with known parameters.**"

Note what the research caught that no amount of entity-guessing could have: the guessed keyword `'preheat'` was literally matching an **EV-only** service that could never work on Jeff's gas GLE 350. Follow-up source-research the same night fixed things guesswork had silently gotten wrong (`71d0dc2`, 07-22 02:19: "Root cause research from mbapi2020 source code: temperature_configure expects string select values ('16') not numbers (16); commands silently fail when capability check blocks them (NA vehicles); pull mode… rejects ALL commands with 400; **HA 200 OK only means 'accepted' not 'Mercedes executed it'**").

A sibling lesson from the same integration the night before: the false "window open" alert, root-caused to `binary_sensor.gle_350_windows_closed` using inverted semantics (`502bcff`, 07-21), recorded as "**Lesson: always check mbapi2020 entity naming conventions — `*_closed` entities invert on/off semantics**" (CLAUDE.md via `e61e920`, 07-21).

**The PIN-prompt relapse (07-24) — the same mistake pattern at the app level:** `eeaa0b7` (07-24 11:55) added an app-level PIN prompt (`carPromptPin()`, localStorage, a `pin` field on service calls) — an assumption about where the PIN lives. Forty minutes later `c73e32e` (07-24 12:35) removed it all: "The PIN is configured in Beehive (HA > mbapi2020 > Options), not in the app." The CLAUDE.md entry (`c64d0f8`):

> "Root cause: I added `carPromptPin()` wrappers that blocked commands with a PIN input modal, but mbapi2020 handles PIN from its integration options automatically — the app should never send a `pin` field.… **Lesson: mbapi2020 PIN is configured server-side in HA integration options — never prompt for or send it from the app.**"

(The task brief for this section referenced hashes `de32a4b` → `bc81c84` for this relapse; those hashes do not exist in this repository's history — the actual commits are `eeaa0b7` → `c73e32e`, both 2026-07-24.)

**Condensed into permanent memory** (`docs/CHANGELOG_ARCHIVE.md`, 07-22 line): "CAR rebuilt on real researched mbapi2020 services… — **lesson: never guess entity/service names for an integration, read its actual source first.**"

**Elapsed:** guess-based command code existed 07-17 → 07-22 (5 days, during which the record shows no evidence any command button ever worked); the MAX COOL/HEAT additions survived on guesses for under an hour before the rewrite; the PIN relapse lasted 40 minutes.

---

### 11. Mercedes PIN and the attempt limit (2026-08-06) — the wrong API read, then one log line and Mercedes' own app

A post-script to the CAR saga in the same spirit. First, a wrong conclusion from a plausible check: HA's `config_entries/get` returned an empty options dict, and Jeff was told the PIN had never been entered. `e3d6de2` (08-06) corrects it:

> "It had. HA's config-entry list API simply does not return data or options — they're internal. The tell I missed: data came back empty too, which is impossible for a loaded integration running 49 live entities.… The real answer came from **one line of Jeff's live system log**: custom_components.mbapi2020.client — Car action: ENGINESTART failed. error_code: **RIS_PIN_INVALID**.… CLAUDE.md now records both the root cause and the diagnostic trap, including the rule that **system_log/list should be the FIRST stop for a failing service call — one log line gave the answer after the API check had misled me.**"

Then the ultimate authority — the vendor's own app — reframed even that: `eb0852f` (08-06) records Jeff's Mercedes Me screenshot: "Your request to start the engine is unable to initiate because you have reached the **limit of remote attempts between manual ignition cycles**…" — "This is very likely what the RIS_PIN_INVALID seen in HA's log actually was — Mercedes returning a vague error code to a third-party integration where its own app gave the real reason. Not proven yet, so both readings are recorded." Remote start was confirmed working from the app on 08-06 (`adcf16c`).

---

### 12. Vizio soundbar (2026-08-01) — "researched not guessed," in the commit subject itself

`762e714` (08-01), subject: "Fix Vizio soundbar setup_retry via power-cycle, **researched not guessed**." The CLAUDE.md 08-01 coworker entry (preserved at `git show fab5b30^:CLAUDE.md`) shows the order of operations the project had by now internalized:

> "**Researched first:** this matches a known, unresolved class of Vizio SmartCast issue (self-signed cert mismatch causing strict TLS clients to fail even when the device is reachable — the matching HA GitHub issue was closed 'not planned,' no upstream fix exists) rather than a config mistake on our end. Confirmed the device WAS network-reachable… and a `reload_config_entry` didn't help — pointed to the device's own local API needing a power-cycle… Jeff power-cycled the soundbar; integration came back `loaded` immediately."

No guessing round to bill here — the lookup happened first and correctly predicted that no amount of HA-side fiddling would fix it.

---

### 13. Three research saves in one session (2026-08-01/08-02) — the docs checked before the guess shipped

- **`initial_state: false`, not a guessed key** — `62e99b5` (08-01): "Replaced the runtime-only automation.turn_off with the actual documented initial_state: false YAML key (**checked HA's real docs first — an initial enabled: false guess would have silently done nothing**), verified it survives a real restart this time."
- **Morning Digest's phantom alerts metric** — `f1d24f3` (08-01) and the CLAUDE.md 08-02 entry: the digest's "active alerts" count silently always returned 0 — "**confirmed via research** this is a known HA-wide change (persistent notifications removed from the template-readable state machine **since HA 2023.6**), not fixable in a normal Jinja2 template; removed that metric entirely rather than ship a false 'all clear.'" (Also preserved as Pending Item 15 in `git show fab5b30^:CLAUDE.md`: "confirmed via research, not a local misconfiguration.")
- **Rain-skip: research killed a redundant build** — CLAUDE.md Pending Item 14 (same file): "**NOT NEEDED, confirmed via research 08-02.** Jeff's B-Hyve WeatherSense already does real weather-adaptive watering… Independent testing showed 100% skip reliability on any 0.2"+ rain day. An HA-side duplicate would be strictly worse (no wind/temp handling). Not building this."
- **Kodi 21 "Omega" — a prior manual fix exposed as a no-op** — CLAUDE.md 08-02 entry: "Jeff's prior `advancedsettings.xml` edit was a no-op — **confirmed via research that Kodi 21+ 'Omega' (Jeff's on 21.3) moved cache settings out of that file into the GUI**, which fully overrides the XML. Found the real live settings in `guisettings.xml`… (both still at Kodi defaults — 20MB/4.0x, **confirming the XML edit never took effect**)" — then set per "Kodi's current official buffering-fix guidance" (`f1d24f3`, 08-01/02).

---

### 14. myQ garage (2026-07-01 → 07-28) — research-first done RIGHT: no guessing round at all

The record supports counting this one as the pattern working from the start. The first time the garage door enters the plan, the lookup is already done: `6837d2d` (07-01) — "the garage door via ratgdo (**myQ cloud is blocked from HA, so go local**)." When the app-side card was built, the same fact is restated as the design constraint: `590303e` (07-26) — "PLANNED module updated: ratgdo/ESPHome path (**myQ cloud API is permanently blocked**)." And the reference doc (`docs/BEEHIVE_REFERENCE.md`, carried from CLAUDE.md) closes the question permanently:

> "Jeff's Chamberlain myQ hub is permanently useless for HA (**Chamberlain blocked all 3rd-party API access 2023**; native `myq` integration removed; no HACS workaround exists or is coming — **confirmed dead 07-28, don't revisit** absent a major policy reversal)."

Not a minute in the record was spent trying to make myQ talk to HA. The one myQ-adjacent guess that did slip through was a model number from memory — the hub recorded as "MYQ-G0402" — caught later by research: "**research confirms G0402 is actually Chamberlain's add-on door sensor SKU, not the hub model**" (`docs/BEEHIVE_REFERENCE.md`, 08-06 correction; commit `f84f8d8`, 08-08: "corrected a stale model-number note in the process"). Which leads directly to:

---

### 15. The garage-door part (2026-08-04 → 08-08) — three guessed model names in a row, Jeff as the fact-checker, and Mandatory Rule 8

The counterexample that turned research-first from a debugging habit into a standing conduct rule.

**The guessing phase (08-04 → 08-05):** first a genuinely researched pricing answer — `7b60e43` (08-04): the Gelidus Research USB-C v2 ratgdo-compatible board (~$22-25) as the cheapest full-parity option. But the *reasoning* hadn't been checked against Jeff's actual opener, and Jeff caught it (`docs/BEEHIVE_REFERENCE.md` / `git show fab5b30^:CLAUDE.md`, Garage Door section):

> "**CORRECTED 08-05 — Jeff caught a real mistake in the reasoning, ratgdo/Gelidus board dropped entirely.** Jeff pushed back: if it's confirmed dry-contact (no Security+ protocol), why pay $22-25 for a board whose whole value is decoding that protocol? He's right… **Corrected again 08-05 — exact model matters, 'SONOFF Basic' was too vague/wrong.** Basic-series SONOFFs are mains-voltage (110-240V) switches… Considered SONOFF SV… next, but **Jeff found a better match: SONOFF MINI-D**."

**The rule it produced,** verbatim from CLAUDE.md (Debugging Protocol, rule 8, PROTECTED; present in both `git show fab5b30^:CLAUDE.md` and the current tip `CLAUDE.md` line 150):

> "**8. NEVER name a specific product/model to Jeff from memory (PROTECTED — Jeff's standing rule 08-05, added after the garage door incident).** On 08-05 I recommended a ratgdo board, then 'SONOFF Basic,' then had to be corrected to SONOFF SV — **three guessed answers on one part, in a row, before Jeff found the actually-correct SONOFF MINI-D himself. He does not have time to be the fact-checker on my hardware recommendations.** The rule going forward: never state a specific product name/model number as a recommendation unless it was **verified via a real search THIS session**. If I haven't checked, say 'let me check' — never let a plausible-sounding model number stand in for one that's actually confirmed."

**The rule immediately applied (08-05 → 08-08):** Jeff's own find was then verified rather than trusted — `f015867` (08-05): "**Verified all of this via research before committing** — this is the final part." When the part arrived, the setup plan opens with the confession as its reason for being — `8d53af4` (08-08):

> "Jeff's part arrived and asked for a plan before wiring - **the garage door hardware area already burned trust once on guessed specs, so researched properly against SONOFF's own docs and independent reviews this time.**"

That research produced findings guessing could not have: the Inching momentary-pulse setting "**can only be configured via the eWeLink app, not HA's Matter integration**"; the device appears in HA "as a plain switch via Matter, not a cover"; and AC-vs-DC power is "an on-site call, **not guessable remotely**" (`8d53af4`; expanded in `docs/beehive/garage_door_sonoff_mini_dry_setup_2026-08-06.md`). Jeff's three follow-up questions got the same treatment — `feee336` (08-08): "**Researched each rather than guessing**" (MyQ coexistence on the shared wall-console terminals, install at the opener, plug-in AC power). The position-sensor recommendation likewise — `f84f8d8` (08-08): "**Researched rather than guessed**: recommends a Zigbee door/window contact sensor (SONOFF SNZB-04P or Aqara)…". And the changelog for the plan (in `git show fab5b30^:CLAUDE.md`, 08-06 entry) makes the linkage explicit: "**Researched (not guessed) rather than repeat the 08-05 mistake pattern.**"

---

### 16. Enbrighten 43080 (2026-08-13) — rejected on the vendor ecosystem's own documented defects: "this is the whole reason to check before buying"

Research-first done right, with a written lesson. The Zigbee dimmer selection (`a5c67a8`, 08-13: "Enbrighten 43080 rejected for documented mesh-routing defects, Inovelli Blue selected") is documented in `docs/lighting/zigbee_dimmer_selection_2026-08-13.md`:

> "Officially Zigbee2MQTT-supported, same QuickFit/SimpleWire body, neutral required — looked like the value pick. **BUT Zigbee2MQTT's own device page carries two explicit warnings:** 'Some Enbrighten devices may cause issues with larger networks. In particular, they may stop relaying messages for child devices.' 'Some Enbrighten devices will not respond to route update requests after a while.' Jeff's stated requirement is that switches EXTEND the mesh… A switch with documented routing defects fails that requirement outright. **Rejected — this is the whole reason to check before buying.**"
>
> "**Lesson: "Zigbee2MQTT supported" ≠ "good Zigbee citizen." Check the device page's warnings.**"

The same doc also rejected the Enbrighten Z-Wave on radio grounds (wrong protocol, second stick needed) — arithmetic done before purchase, not after. Honest postscript, because it belongs in this record even though it is a *documentation* failure rather than a research failure: the researched selection (Inovelli Blue) had **already been scrapped by Jeff on price** — *"those were scrapped at the freaking beginning — told you I was not paying $120 for a freaking dimmer switch"* — and because that decision "was never recorded until 2026-08-16," a later session re-planned the mesh around it and re-pitched it to him (same doc, red banner added 08-16; commit `1572b4a`, 08-16: "Record that Inovelli was SCRAPPED on price - it was never written down"). Research prevents wasted money; only *writing decisions down* prevents wasted research.

---

### 17. Zigbee plug lookalikes (2026-08-14) — the trap documented before the money was spent

`9dad6a5` (08-14): "Zigbee mesh plugs selected (ThirdReality B09KNHWF7L, Z2M-verified clean); SONOFF S40 Lite Zigbee OOS; **document the WiFi-lookalike trap and BLE-mode gotcha**." The inventory (`docs/inventory/HCC_INVENTORY.md`) carries the research as a standing warning:

> "**⚠️ DO NOT BUY the lookalikes:** THIRDREALITY 'Smart Plug M3' B0FJRNW7YS = Matter over **WiFi**, not Zigbee. SONOFF 'S40 Lite' exists in BOTH Zigbee (B09XMH3X3G, currently OOS) and WiFi (B09LV7K4DH) versions, same product name.… **RULE: "Requires a hub" = the Zigbee one. "No hub required" = WiFi, useless for the mesh.**"

A lookalike bought by accident would have been discovered only after pairing failed — the checked listing numbers made that guessing round impossible. Same pattern as `a00842c` (07-31): with Jeff actively shopping on eBay that evening, every already-chosen product in `safety_shopping_list.md` was "**checked… against fresh 2026 research** rather than proposing a new/competing list," confirming availability/compatibility and adding one honest caveat (HEIMAN siren behaves better under Z2M than ZHA) before money moved.

---

### 18. Apple TV and HomeKit (2026-08-14) — research first: jailbreak ruled dead, RTSP bridges ruled worse, capabilities mapped before exposure

The Apple TV switchover ran research-before-build end to end. `c95457a` (08-14): "Apple TV switchover research + HomeKit Bridge test rig (**jailbreak dead - A15/tvOS18.6; RTSP bridges worse than status quo**; HomeKit snapshot route staged for testing)" — two whole approaches eliminated by research before any hardware or install time was spent on them. `18ff039` (08-14): "**HomeKit capability research** + exposure policy (CarPlay garage door is the standout; never expose add-ons like the Alexa mess)." The breakthrough — `9426623` (08-14): "SOLVED: Apple TV camera popups - **linked_doorbell_sensor is the key** (motion alone never interrupts the screen)" — is documented in `docs/beehive/appletv_popup_SOLVED_2026-08-14.md`, including the insight ("HomeKit reserves the picture-in-picture screen takeover for **DOORBELL** events… Fix: point `linked_doorbell_sensor` at the SAME motion sensor") and a "Traps hit along the way (do not repeat)" list. **INFERRED:** the doc does not state whether the `linked_doorbell_sensor` insight came from HA's HomeKit documentation, community threads, or in-session experimentation; the commit series labels the surrounding work "research," but the provenance of that specific key is not recorded.

---

### 19. Smaller lookups that each saved a guessing round (collected)

- **Gas rate from EIA, not a guess:** `e5726b9` (07-03) — "set Est. Cost to sourced TN residential ~$1.12/CCF (EIA Jan 2026)… Piedmont's TN customers moved to Spire Tennessee 2026-03-31 but rates were kept the same." (Later replaced by rates calibrated from Jeff's actual bills: `0d6c9de`, `8a9df3b`, 07-23.)
- **No built-in Weather Underground integration in HA:** `0b3de03` (07-03) — checked before anyone burned time hunting for one; the REST-sensor-on-our-own-endpoint path was chosen instead, live the same day (`5c7aadc`: "real KTNWHITE21 weather live in HA via REST sensor (79F confirmed)").
- **The 07-09 link audit — verify before "fixing":** the mower parts/manual deep-links flagged as 404-risk were checked live by the coworker before being replaced: "**all 5 mower parts/manual deep-links are LIVE — no fix needed**… ereplacementparts = 403 but that's just anti-bot blocking automated requests… **Good thing we checked instead of blind-swapping working links.**" (CLAUDE.md 07-09 entry, visible in the `9b29c1f` diff; commits `fc62533`/`9a34d17`, 07-09.) The two genuinely dead links (Spotter, NOAA Radio) had already been fixed — and the NOAA Radio replacement itself was later found to be "a TuneIn search page" and re-fixed during a full link audit (`dd2c6fa`, 08-03).
- **GaragePC suitability:** the HP TouchSmart 520-1020 was "researched 08-05" (CPU generation, no-AVX limitation, RAM) before being assigned its role (`19f80be`, 08-05; `docs/BEEHIVE_REFERENCE.md`).
- **RTL-SDR Windows drivers not needed:** `9100fcc` (07-02), detailed in incident 5 above.
- **Blink motion filtering already existed:** before building the requested phone-notification filtering, the coworker checked the existing config and found `AI Object Detected Notify` "already does this exact thing" — "**already existed, nothing to build (08-02)**" (CLAUDE.md Pending Item 13, `git show fab5b30^:CLAUDE.md`; commit `f1d24f3`, 08-01). Reading what exists is the cheapest lookup of all.
- **Kasa HS220 onboarding quirks (08-14):** "new-firmware onboarding notes; **auto-update disabled via HA toggle the app hides**" (`09de34b`) and the gateway set "2.4GHz to B/G/N for Kasa compatibility" (`f735771`). **INFERRED:** these read as community-knowledge-informed fixes; the commits do not name their sources.

---

### The standing lesson

Assembled strictly from lessons and rules the project itself wrote down, with where each lives:

1. **"Never guess entity/service names for an integration, read its actual source first."** — `docs/CHANGELOG_ARCHIVE.md`, 07-22 entry (condensed from the full CLAUDE.md lesson written after the CAR rewrite, `git show c64d0f8:CLAUDE.md`: "**Lesson: never guess entity names or service calls — research the integration's actual source code and use domain-specific services with known parameters.**"; commits `8d339ee`, `778f6bd`, 2026-07-22).
2. **"NEVER name a specific product/model to Jeff from memory… never state a specific product name/model number as a recommendation unless it was verified via a real search THIS session. If I haven't checked, say 'let me check.'"** — CLAUDE.md, Debugging Protocol rule 8, PROTECTED, Jeff's standing rule 08-05 (tip `CLAUDE.md` line 150).
3. **"On the HCC project specifically, this file (`CLAUDE.md`) IS the first research step — before web search, before live HA/browser investigation.… Grep/read the relevant section here first; only fall back to live exploration or web research for what this doc doesn't cover."** — CLAUDE.md, Debugging Protocol step 7 (tip `CLAUDE.md` line 146). Look it up in the project's own paid-for record before looking it up anywhere else.
4. **"Before re-investigating ANY subsystem, grep the archive for it first — the answer is very often already in there, paid for in Jeff's time."** — CLAUDE.md Mandatory Rule 16 (08-16), and its twin in `docs/SESSION_START.md`: "**Grep the archive BEFORE re-investigating any subsystem** — the answer is usually already in there, paid for in Jeff's time."
5. **"MANDATORY: search it before replying, any time Jeff says 'we discussed' / 'I told you' / 'that was settled', or before recommending hardware or re-opening any question."** — `docs/SESSION_START.md` section 0, on the Master Record archive (built 08-16, commit `1d1ebdb`).
6. **"CHECK THE REAL CURRENT DATE/TIME, NEVER GUESS OR ASSUME."** — CLAUDE.md Mandatory Rule 14, Jeff's rule 08-10, verbatim from Jeff: *"Get you damn times right…"* — with the recorded finding that the clock was accurate all along: "this was never a missing capability, it was a discipline failure."
7. **"system_log/list should be the FIRST stop for a failing service call — one log line gave the answer after the API check had misled me."** — recorded in CLAUDE.md per commit `e3d6e2`/`e3d6de2` (08-06, Mercedes RIS_PIN_INVALID).
8. **"'Zigbee2MQTT supported' ≠ 'good Zigbee citizen.' Check the device page's warnings."** — `docs/lighting/zigbee_dimmer_selection_2026-08-13.md`; and its purchasing twin, "**RULE: 'Requires a hub' = the Zigbee one. 'No hub required' = WiFi, useless for the mesh**" — `docs/inventory/HCC_INVENTORY.md` (08-14).
9. **"Always check mbapi2020 entity naming conventions — `*_closed` entities invert on/off semantics."** — CLAUDE.md 07-21 entry (`e61e920`); the reminder that even *read* paths need the integration's conventions looked up, not assumed.
10. **Do not re-add what research already killed:** "removed a stale `custom_components/blink` override — **never re-add it**" (`docs/CHANGELOG_ARCHIVE.md`, 07-09→07-15); "myQ… **confirmed dead 07-28, don't revisit**" (`docs/BEEHIVE_REFERENCE.md`); "Sylvania… Settled — do not retry Smart Life" (tip `CLAUDE.md`, Settled Decisions).

And the boundary of the rule, from the project's own experience, because research-first is not the whole discipline: the Inovelli re-pitch (incident 16) proved that research cannot save you from an unrecorded decision — *"A decision Jeff makes in conversation goes into a file THE SAME SESSION"* (tip `CLAUDE.md`, Settled Decisions, quoting Jeff: *"you tell me it is all documented and it is not, then the session closes and you come back with some plan that was two weeks ago — this is infuriating"*). And the LUX setpoint (incident 1) proved the converse edge case: sometimes the sources are all wrong for your exact case and a disciplined, instrumented trial sweep is the honest remaining move — the record's standard for that is `762e714`'s phrasing made into a habit: research first, and when you do resort to trying things, log what was tried so the next session inherits answers instead of guesses.

**The one-line version the history supports:** every hour this project lost to guessing — two weeks on Blink, five days of dead CAR buttons, four days planning AES decryption for an unencrypted meter, six days on an mPING form NOAA would never accept, three guessed part numbers Jeff had to fact-check himself — was ended by somebody finally reading the actual source, the actual release notes, the actual vendor page, the actual forum thread, or asking the actual person. The record contains no counterexample where sustained guessing beat the lookup.


---

## The Rules That Kept Being Broken — every documented time the memory file was skipped, skimmed, or its rules not followed, and what it cost

**Measurement limit, stated up front.** Git mostly records the times a violation was *caught and confessed* — a correction commit, a rule added in shame, a "root cause is mine." The uncaught times, and most of Jeff's side of catching them, live in chat transcripts that are not in this repo (the MASTER RECORD, built 2026-08-16, now archives 6,896 messages in iCloud — commit `1d1ebdb` — but that archive is outside this repo). So everything below is a floor, not a count. Where an incident is documented, it is cited by hash and date. Where the record only implies something, it is marked **INFERRED**. The true count is unknowable from git alone.

The rule at the center of it all has existed since the memory file's second day. `CLAUDE.md` was created 2026-06-23 (`e8f0312`, "Add CLAUDE.md — persistent project memory for all future AI sessions") and rewritten the next day (`90e556e`, 2026-06-24) to open with:

> **READ THIS ENTIRE FILE BEFORE TOUCHING ANYTHING.** This is the single source of truth for every AI session. Do not guess. Do not ask Jeff to re-explain. Do not blame unclear history. Everything you need is here.

and Mandatory Rule 1:

> 1. **READ THIS FILE FIRST** — every session, every time, no exceptions

That rewrite exists because of Jeff's frustration message, which it preserves verbatim (`90e556e`, CLAUDE.md, "Jeff's Message — Read This Every Single Session"):

> "You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct. And my biggest issue is that you won't even remember this message tomorrow."

> "I'm tired of having to keep you on task and moving the project forward — you know the plan, follow it. Save this and remember it and read it before you do anything."

> "I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learning… but you are making it real hard for this to be enjoyable."

What follows is every documented time that rule — or any of the file's other rules, protocols, and standing lessons — was skipped, skimmed, searched badly, or simply not followed, and what each one cost. Three failure classes, kept separate:

- **Class A** — the file/docs existed, were correct, and were not read (or a rule in them was not followed).
- **Class B** — the file *was* consulted, but it was itself stale or wrong, and trusting it over reality caused the damage. The mirror-image failure; included for honesty.
- **Class C** — the resource cost of the memory file itself: bloat injected into every message, and the compression that threatened to eat the parts that mattered most.

A note on rules as evidence: nearly every Mandatory Rule in `CLAUDE.md` is a scar with a story. A rule that says "NEVER do X" exists because X happened at least once. Where the origin incident is documented, it is traced below; where the rule was violated *again after being written*, that is called out explicitly, because that is the precise failure Jeff asked to have counted: the rule was in the file, the file said read me first, and it didn't help.

---

## CLASS A — the file or docs existed, and were skipped, skimmed, or searched badly

### The Inovelli/Kasa affair — the fullest documented failure chain in the record (2026-08-16)

This is the incident Jeff's archive request describes: a session re-proposed ~$120 of dimmer switches he had already killed on price, and told him — twice — that the decision "was never written down." It produced six corrective commits in a single morning and rewired the project's entire memory discipline. The chain, in order:

**Background.** On 2026-08-13 the lighting project produced `docs/lighting/zigbee_dimmer_selection_2026-08-13.md` (`a5c67a8`: "Enbrighten 43080 rejected for documented mesh-routing defects, Inovelli Blue selected") and the printable build plan `docs/lighting/HCC_Lighting_Plan.html` + PDF (`6c90202`, 08-13). Per the later correction commit `c05d647`, at 20:07 CDT that evening a session agreed with Jeff that "mesh routers do not have to be light switches," and 16 minutes later produced the Rev. Aug 13 lighting plan whose whole thesis is the *current* plan: Kasa WiFi switches for switching, cheap Zigbee plugs for mesh. Jeff had killed the Inovelli dimmers on price. The kill itself was never written into the inventory or the dimmer-selection doc.

**The violation, part 1 — planning off one stale doc without surveying.** On 2026-08-16 a session planned the entire Zigbee mesh from the 08-13 buildout doc alone. From `007e14e` (2026-08-16 07:59):

> Leaving it open sent this session down the wrong road - it planned the Zigbee buildout
> from the 08-13 buildout doc and re-asked questions five later commits had already
> settled (dimmer selection, neutrals, box fill, garage).

From `831db1b` (2026-08-16 08:05, "SESSION_START: add the doc index - 52 docs exist, survey before planning"):

> Added because this session planned the Zigbee buildout from ONE doc dated 08-13 and
> re-asked four questions that later commits had already settled (dimmer selection,
> neutrals, box fill, garage 2-location). Jeff: "you did not read the archives on what
> was settled and planned."

**The violation, part 2 — a stale pending item closed wrongly.** The same session, acting on the stale docs, closed Pending Item 19 (garage two-location switch) with the claim that Inovelli's "3-Way Dumb" configuration solved it (`007e14e`, "CLAUDE.md: close stale Pending Item 19 (garage switch) - superseded by Inovelli"). But Inovelli was dead — so this "closure" was itself wrong, and had to be reversed the same morning in `c05d647`. The tip `CLAUDE.md` still carries the confession inline in Pending Item 19:

> ⚠️ *I briefly wrote that Inovelli's "3-Way Dumb" closed this. It does not — **Inovelli is scrapped on price**, so that answer went with it.*

**The violation, part 3 — re-pitching the killed hardware.** From `1572b4a` (2026-08-16 08:08, "Record that Inovelli was SCRAPPED on price - it was never written down"):

> Jeff rejected the Inovelli Blue early on (~$60 ea / ~$120 the pair) and the decision
> never made it into any document. Yesterday's inventory update still said TO BUY: 2,
> so this session planned the entire Zigbee mesh around them and pitched them back to
> him. That is a settled decision being re-litigated because the docs disagreed with
> reality.
> …
> Standing lesson: a decision made in conversation goes into the doc the SAME session.

**The violation, part 4 — telling Jeff twice that it "was never written down," when it was.** This is the grep-one-word-and-declare-absence failure. The full confession, `c05d647` (2026-08-16 08:16, "CORRECTION: the Kasa+plugs plan WAS documented - point everything at it"):

> I told Jeff twice that the decision to drop the Inovelli dimmers was never written
> down. That was wrong, and I found the proof in the session transcripts.
>
> On 2026-08-13 20:07 CDT a session agreed with him that mesh routers do not have to be
> light switches, and 16 minutes later produced docs/lighting/HCC_Lighting_Plan.html -
> the printable build plan he asked for, Rev. Aug 13 2026. Its thesis is exactly the
> current plan: Job 1 switches -> WiFi Kasa, Job 2 mesh -> Zigbee plugs, with the line
> "why not a $46 mesh dimmer: the switch was only being asked to repeat the mesh, a job
> a $10 plug does better." Shopping list totals ~$104.
>
> Why I missed it: I grepped for "Inovelli", got no hit in that file, and concluded no
> document existed - when the ABSENCE of that word is what marks the current plan. That
> trap is now written into CLAUDE.md so the next session searches Kasa/plug/mesh instead.
>
> The stale sources were the inventory (updated 08-15, a day AFTER the decision, still
> saying TO BUY: 2) and the dimmer-selection doc. Both already carry scrap notices.
>
> Also reverses my own bad edit: Pending Item 19 is NOT closed. I had written that
> Inovelli 3-Way Dumb solved the garage two-location problem - but Inovelli is scrapped,
> so that answer died with it.

The grep-trap warning now lives permanently in `CLAUDE.md`'s SETTLED DECISIONS section (tip, added `c30b64d` and sharpened by `c05d647`):

> ⚠️ **A trap that already cost a whole session:** searching the docs for "Inovelli" and finding
> nothing does NOT mean the plan is undocumented — the *absence* of that word is what marks the
> CURRENT plan. Search for **Kasa / plug / mesh**, and check `docs/lighting/` by date.

**What Jeff said.** Recorded verbatim in the tip `CLAUDE.md` (SETTLED DECISIONS, added `c30b64d` 2026-08-16 08:11):

> *"I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would
> rather spend the money on that and have your help than buy $120 worth of dimmers."*

> *"you tell me it is all documented and it is not, then the session closes and you come back with
> some plan that was two weeks ago — this is infuriating."*

And in `1d1ebdb` (2026-08-16 09:01, the MASTER RECORD build):

> Jeff, after a session re-proposed hardware he killed two days earlier: "I can't keep
> doing this every time the session changes." Decisions were made in conversation and
> never written to a file, so each new session read stale docs and confidently told him
> the wrong thing.

**What it cost:** a session's worth of Zigbee planning built around dead hardware; four already-settled questions re-asked of Jeff; a $120 purchase re-pitched at a man who had killed it on price; two false "that was never documented" statements delivered to the project's owner; one pending item wrongly closed and reopened; and — measured in commits — six corrective commits (`fab5b30` aside) and the construction of an entire archive system (`1d1ebdb`) to make recurrence impossible. **INFERRED:** the trust cost is the largest and least measurable; Jeff's own words ("this is infuriating," "I can't keep doing this") are the record of it. Note the class crossover: parts 1–2 and 4 are Class A (docs existed, were skimmed or searched badly); part 3 rests on a Class B stale doc (see the inventory entry below).

### The 52-docs survey failure — why SESSION_START.md got a doc index (2026-08-16)

Same morning, same session, its own incident report. `831db1b` added section 2b to `docs/SESSION_START.md`, which at tip reads:

> ## 2b. 🔴 THE DOC INDEX — 52 files exist. Survey before you plan ANYTHING.
>
> **This section exists because on 2026-08-16 a session planned the Zigbee buildout off ONE doc from
> 08-13 and re-asked four questions that later commits had already settled. Jeff, verbatim:
> *"you did not read the archives on what was settled and planned."* Before planning any area, list
> `docs/` sorted by date, and read every file touching it — newest first, because older docs go stale.**

The commit body also preserved two standing corrections that had been paid for the hard way, so no future session proposes Guardian work without them: Jeff wants "TONS of life-safety coverage and LEAN intrusion," and "Alert fatigue is a security failure, not an annoyance: too many alerts -> Blink gets disarmed -> every camera automation silently stops with no error anywhere. That already cost 48 hours of dead cameras Aug 10-14" (`831db1b`; the outage itself is documented in `eba1648`, 2026-08-14: "root cause was Blink disarmed (silent total outage since 08-10)").

**What it cost:** counted inside the Inovelli affair above — this entry is the structural fix, and is itself proof the violation happened.

### The round-robin era and the Debugging Protocol's built-in confession (2026-07-03)

Mandatory Rule 12 and the entire PROTECTED Debugging Protocol were born on 2026-07-03 (`f668301`, "Add PROTECTED Debugging Protocol: attack the source, test on my end first") from Jeff being made to run diagnostic scavenger hunts for bugs the session could have reproduced itself. Jeff, verbatim, preserved in the protocol:

> *"Log this so we don't go through this kind of round robin of checks again and we attack the source… I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end."*

The protocol's step 1, as originally committed in `f668301`, contains a confession in its own text — the Playwright-harness reproduction that step 1 mandates had been done only *after* Jeff called out the bug it should have caught:

> 1. **Reproduce/verify on MY end first.** Read the actual code path end-to-end. Run the **Playwright harness** with **mocked data** to reproduce the failure and prove the fix (mock the API/HA responses, the slow-relay case, the error case). I did this AFTER Jeff called me out on the timeout bug — it must come FIRST.

The timeout bug in question is the shared-`AbortSignal` regression fixed the same morning (`0f44d9d`, 2026-07-03: "Regression I introduced when wiring Nabu Casa: checkBeehive built ONE AbortSignal.timeout(2500) and reused it across all candidate fetches… so a perfectly reachable HA was reported offline (red dot), which also stopped the meters from loading"), memorialized in `a6d1e3b` ("Memory: record the shared-AbortSignal timeout regression + fix").

**What it cost:** Jeff's time running the "round robin of checks" for a self-inflicted regression (a falsely-offline Beehive and dead meters), and enough relationship damage that the fix had to be constitutional — a PROTECTED protocol — rather than a code change. **INFERRED:** the number of round-robin episodes before 07-03 is not recoverable from git; Jeff's "again" implies more than one.

### Rule 6 broken: "CAR section fully live" — while every command button was dead (2026-07-21 → 07-22)

Rule 6 has said since 06-24: "**NEVER report something as done without testing it**." On 07-21, `4e9445d` updated CLAUDE.md: "mbapi2020 install verified end-to-end, CAR section fully live," including "Jeff's confirmation that the CAR tab shows live data." Within a day, `8d339ee` (2026-07-22, "Rewrite CAR commands: use discovered entities, not hardcoded guesses"):

> Root cause: all car command functions (lock, remote start, max cool,
> max heat) were searching _grdStates with narrow keyword guesses that
> didn't match real mbapi2020 entity names, so every button failed.

The same day it was rewritten *again* (`778f6bd`, "Rewrite CAR commands with proper mbapi2020 domain services (researched from source)") — replacing the first rewrite's entity-guessing helpers with services actually researched from the integration's source. The lesson was written into the changelog (tip `docs/CHANGELOG_ARCHIVE.md`, 07-22 entry): "lesson: never guess entity/service names for an integration, read its actual source first."

**What it cost:** the CAR section shipped as "fully live" with every command dead; two full rewrites of the command layer in one day. (Display data *was* live — the "fully" was the overreach.) This incident foreshadows the 08-05 no-guessing rule below.

### Rule 6 broken: the LUX login fix that was declared, then wasn't (2026-08-04 → 08-06)

`c46ae19` (08-04) fixed "LUX thermostat requiring login repeatedly." Two days later, `34c90ac` (08-06) opens with the confession:

> The 08-04 KV-token-caching fix for "LUX requires login every time"
> was real but unconfirmed live, and Jeff reports it's still happening.

The archive change log calls it what it was: "08-06 (LUX 'requires login every time' — real root cause found, second time)." A third commit the same day (`1707cf4`) found yet another layer, prompted by Jeff himself: "Jeff's question cut right to it: 'does it need a token? All the other things stay logged in.'" — the code had requested a refresh token and thrown it away.

**What it cost:** two extra days of a broken login Jeff had been told was fixed, plus Jeff doing the diagnostic thinking. A clean Rule 6 violation: "unconfirmed live" is the commit's own phrase.

### Rules 6 and 10 broken: the wall-iPad "sideways" day — a speculative fix shipped, and Jeff supplying the timeline (2026-08-08)

Three commits in one evening tell this story against themselves. `5d22cf7` (08-08 morning) replaced the hero photo's four fixed breakpoints with a continuous `clamp()` to fix iPad-landscape sizing. The wall-mounted iPad then began rendering sideways. `9da43a5` (08-08 21:35) shipped an "auto-rotate" CSS fix that its own body admits was a guess: "Honest caveat: can't verify the exact rotation direction is correct without the real device." Twenty-five minutes later, `24136c7` reverted it:

> Jeff confirmed the wall-mounted iPad's landscape rendering used to
> work correctly before today - meaning the "stuck sideways" issue is
> a regression, not an inherent iOS/Guided-Access limitation. The
> auto-rotate transform added earlier today was an explicitly
> unverified guess…

And `bb9d1cf` (five minutes after that) reverted the actual cause:

> Jeff: "It worked perfectly before the picture edit." That pointed
> straight at commit 5d22cf7 - my own fix from earlier in this same
> conversation…

Note what happened relative to the written rules: the Debugging Protocol (in the file since 07-03) says step 2 is "audit my own recent changes as the prime suspect" — but it took *Jeff's* timeline to point at the session's own commit, and an "explicitly unverified guess" had already been shipped to his wall in the meantime. `24136c7` even cites the protocol while cleaning up: "per the project's debugging protocol, recent changes are the prime suspect first."

**What it cost:** an evening of a sideways wall display, one speculative deploy and revert pair (service-worker v57→v58→v59→v60), and Jeff doing the root-cause step the protocol assigned to the session.

### Rules 5 and 10 broken: the coverage map that wiped Jeff's hour meter (2026-08-10)

`b568a4b` (2026-08-10, "Fix: coverage map blew out localStorage and reset the hour meter"):

> Jeff's hours reset to 5.9 - the factory default baseline - meaning his
> whole saved state was wiped. Root cause is mine, from earlier today.
> …
> That pushed the blob past the storage quota, save() threw, and the catch
> silently swallowed it, so hour updates stopped persisting; once the entry
> was lost the boot path fell back to DEFAULT_STATE and took his real hours with it.

The change log entry (archive) is franker still: "🚨 MY BUG — the coverage map I built blew out localStorage and reset Jeff's hour meter to the 5.9 default; fixed + made unrepeatable." Rule 5 says never leave the app broken; Rule 10 says find bugs before Jeff sees them. Jeff saw it — on the one number the entire project was founded to track. A follow-up audit the next day (`86b47e6`, "Audit out the next storage time bomb") went hunting for the same class proactively, which is what Rule 10 had required all along.

**What it cost:** Jeff's real saved state (hour meter, service log, history) wiped to factory default on his device; recovery machinery (core-mirror key, migration) that now exists permanently. Same evening and same subsystem, Jeff was also the one to catch the map quality problems — the archive records his verbatim "blurry as shit" (change log 08-10 5:50 PM CDT; fixed in `f29e517`, whose body concedes "Jeff's screenshot confirmed real satellite imagery loads over his property, but flagged two real problems: wrong framing and blur").

### Rule 7 broken the day it was written: the installer-command flip-flops (2026-06-23 → 06-24)

Rule 7 ("**Commands must work the first time** — test the command yourself before telling Jeff to run it") was written into `90e556e` at 2026-06-24 00:34 UTC. Its origin is the day before: `75a7afd` (06-23 12:26) shipped Beehive setup instructions; `1f3ce1a` (06-23 13:00) had to fix them ("correct commands for the ha > CLI, curl not wget"); `686bece` (06-23 13:35) flipped back the other way ("Switch Step 3 copy command from curl to wget for HA Terminal compatibility") — two reversals in 35 minutes on commands handed to Jeff.

Then, *after* the rule existed: `68b89d5` (06-24 15:47) shipped a "one-command B-Hyve installer," and `a744651` (06-24 17:32) had to fix it — "Fix install script wget syntax for BusyBox — -O before URL." A command handed to Jeff, again, that did not work the first time, less than a day after the rule saying they must was committed. **INFERRED:** the record does not state who hit the BusyBox failure, but the fix commit existing at all means the shipped command was wrong; on this project the person running HA Terminal commands was Jeff.

**What it cost:** Jeff's time at the HA terminal running commands that failed, across at least three correction commits in two days.

### Rule 8's origin — the great blank-page incident (2026-06-23) — and its clean record since

`a973c8f` (2026-06-23, "Fix fatal JS syntax error — remove stray `<script>` tags inside script block"):

> Two bare `<script>` tags were embedded inside an already-open `<script>` block
> (lines 2488 and 2688). The HTML parser passes them as literal text to the
> JS engine, which throws a SyntaxError — killing ALL JavaScript on the page.
> That's why the whole app went blank.

Rule 8 ("NEVER put `<script>` or `</script>` tags inside the JS block of index.html — this causes a fatal blank page (the great blank-page incident of 2026-06-23)") was written the next day. **No documented recurrence** exists in the log after the rule was written — one of the clearest cases in the record of a written rule actually holding.

**What it cost (origin):** the entire app dead — every feature, blank page — until fixed. This incident predates the rule, so it is origin story, not violation; it is counted because it is why the rule exists.

### The no-guessed-hardware rule's origin: three wrong parts in a row (2026-08-05)

`7f73148` (2026-08-05, "Add permanent rule: never name a product/model from memory unverified"):

> Jeff called out three wrong-in-a-row hardware recommendations on the
> garage door part today -- ratgdo board, then SONOFF Basic, then had
> to be corrected to SV before he found the actually-right MINI-D
> himself.

The rule, as it stands in tip `CLAUDE.md` (Debugging Protocol item 8): "He does not have time to be the fact-checker on my hardware recommendations… never state a specific product name/model number as a recommendation unless it was verified via a real search THIS session." Note the same-shaped failure had already been written down on 07-22 (the mbapi2020 entity-guessing lesson, above) — guessing names instead of verifying — and recurred here in hardware form before becoming a PROTECTED rule. **No documented recurrence after 08-05** appears in the log.

**What it cost:** Jeff fact-checked three wrong recommendations and found the correct part (SONOFF MINI-D) himself — the exact inversion of what he pays for.

### Rule 14 broken, then broken again: date/time discipline (2026-08-10, and once more before 08-16)

Origin: `a2779b5` (2026-08-10, "Add permanent rule: check real date/time, never assume"): "Jeff caught a real discipline failure - referencing 'late at night' and a wrong date without ever checking, when it was actually mid-afternoon. Verified the sandbox clock is genuinely accurate… so this was never a missing capability." Jeff's verbatim, preserved in Rule 14: *"Get you damn times right... I want a current timestamp added to the session anytime it is picked up and I want the current date and times tracked."*

The recurrence: `docs/SESSION_START.md` (written 2026-08-16) says flatly:

> 1. **Get the real date and time.** Never infer it from the conversation — it has been broken twice.

"Twice" — meaning the rule written on 08-10 was violated at least once more between 08-10 and 08-16. The second occurrence has no commit of its own; the SESSION_START line is its only trace in the repo. **INFERRED:** the second break was caught by Jeff or self-caught in a transcript session; git cannot say which.

**What it cost:** small each time in minutes, large in the currency Rule 14 names: telling Jeff wrong things confidently.

### Standing lesson violated after being written: the inline-style trap, hit twice (2026-08-01 and 08-11)

On 08-01, `bdc6f93` confessed a specificity failure in its own first attempt: "found and fixed a real specificity bug in my own first attempt at this -- I'd added a html.light override for their background/color, but the inputs had those same properties set inline, and inline styles always beat an external stylesheet rule regardless of selector specificity, so the override was silently a no-op." Lesson learned and committed to the changelog. Ten days later, the 08-11 sweep hit the identical trap and said so (tip `docs/CHANGELOG_ARCHIVE.md`, 08-11 entry):

> **Hit the inline-style trap again** — the pad's background lived in a `style=` attribute, which beats any selector however specific

**What it cost:** rework inside the 08-11 session; caught in-session both times. Documented as a repeat by the archive's own word "again."

### The stale-cache bug class: symptom-fixes repeated for ten days after "attack the root cause" was in the file (2026-07-10 → 07-21)

Debugging Protocol step 3 (in `CLAUDE.md` since 07-03): "Attack the root cause, not the symptom. Ask 'why is this whole *class* of problem possible?' and remove it." What the log shows instead is a series of cache-version bumps and partial fixes: `24df1fc` (07-10, "Fix Windows stale cache… Service worker bumped to hcc-v7: forces cache purge on all devices"), then `173270a` (07-20, "Fix root cause of recurring stale-cache bug: no-cache service-worker.js"), whose body admits the pattern:

> …this was the missing piece behind the v3/v6/v10/network-first cache fixes
> not sticking permanently.

Then `70dba84` (07-21) found network-first was still "actually 'stale-cache-first'" through the browser HTTP cache, and `6f517ac` (07-21) confessed the 07-20 fix was still incomplete: "The 07-20 fix only addressed browser Cache-Control; Cloudflare's edge was independently caching service-worker.js… and index.html had no SW registration at all for new visitors." Three layers, found serially across ten days, while the protocol demanding class-level fixes sat in the PROTECTED section. **INFERRED:** each intermediate "fix" left Jeff's devices serving stale app code for some further period; the log documents the recurrence ("recurring," "not sticking permanently") but not the hours.

### Standing lesson, mixed verdict: `haFetch()` and the fragile-fetch pattern (2026-07-03 lesson; 07-31 audit)

The lesson written 07-03 (`f668301`): "**Known fragile pattern (don't repeat):** any new `fetch(base + '/api/...')` straight from the browser to HA. Use **`haFetch()`**." On 07-31, `c0cd63d` found "loadIrrigationFromHA(), haIrrToggle(), and blinkSendPin() all called Home Assistant directly via raw fetch(base+...)… the same CORS/mixed-content/relay-timeout exposure documented as the root cause of the 'Beehive Offline' bug class." Honesty requires the distinction: these were *pre-existing* call sites the 07-03 migration missed (`blinkSendPin` dates to `c7bc5ba`, 06-24), not new post-lesson code — an incomplete application of a written fix, discovered only by a 07-31 audit, rather than a fresh violation. **No documented case of a NEW raw `fetch(base+…)` being added after the lesson was written.** Related but distinct: the same `AbortSignal.timeout` machinery silently froze the app forever on Jeff's iPad Air 2 (Safari 15 lacks the API — `33d367d`, 07-15), a platform gap rather than a rule violation, root-caused live on Jeff's device.

### Standing lesson violated repeatedly until measured: hardcoded dark-mode colors in light mode (2026-06-29 → 08-11)

Light mode arrived 06-29 (`28d79c6`), and the same day required a sweep of "dark holdouts" (`44ea8e8`) and a fix for "invisible text on YARD black meter panels in light mode" (`70643a4`). The class kept reappearing: `bdc6f93` and `fdc358e` (08-01, WCAG failures from "hardcoded dark-mode-tuned colors"); the archive records that even *new* work reintroduced it — the LUX overlay hardcoded "`#22c55e`/`#d4af37` (the *dark-mode* token values, literally) instead of `var(--ok)`/`var(--gold)`, so they went dark-on-light and unreadable specifically in light theme" (tip `docs/CHANGELOG_ARCHIVE.md`). It was only closed as a class on 08-11 (`af6df04`), which also exposed a Class B footnote: the pending-item note that had been guiding sessions said most sites were "probably fine" —

> The old note guessed "most are probably fine on dark surfaces" — so I measured instead of gu[essing]

— and measurement found 19 real failures, including "Wrong password" and "Save failed - storage full" rendered "effectively invisible in light mode" at contrast ratios as low as 1.09:1.

**What it cost:** roughly six weeks of recurring invisible-text bugs across at least six fix commits, some of them user-facing error messages a user could not read precisely when things went wrong.

### Rule 16's origin: the tunnel-vision hour (2026-08-16)

Rule 16 ("STOP TUNNEL-VISIONING") was added 08-16 with Jeff's verbatim — *"you go down one road and get tunnel vision and you spend more time fighting over that single tunnel... open your damn mind and look at all options"* — and two documented origin incidents inside the rule text itself (tip `CLAUDE.md`): "(a) spent an hour asking for Samba/SSH access to edit a YAML file, when retrying the blocked editor keystroke worked first try, and separately the `all_objects` attribute already exposed the needed data through an API I'd had all along; (b) proved the *leak alarm* worked without ever asking whether Jeff gets told anything on a normal day (he didn't — it was alert-only by design)." `docs/SESSION_START.md` §4 repeats both, adding "going to `history` for leak data that was sitting in long-term statistics." These are origin incidents for a new rule, not violations of an old one — but the hour is a documented, named cost.

### Rules 5/10, soft repeat of the photo rule: Jeff cropped out of his own photo (2026-08-06 origin; 08-11 echo)

`db9ffcc` (08-06, "record which photos are real, and never to strip Jeff out of them") is another rule born from a scar, confessed in its own body:

> Learned by getting it wrong. I regenerated the irrigation and yard heroes
> and removed the person, assuming a stock model. It was Jeff, in his own
> app.

Five days later a sizing fix cropped the top of Jeff's head off the same yard hero — the archive change log: "08-11 9:15 PM CDT (my own hero fix cut Jeff's head off the yard photo — fixed)"; the fix commit `e5d57f4` measured three crop candidates to restore "the full 22px of headroom." **INFERRED:** this is a same-spirit repeat (Jeff partially removed from a photo the file said never to remove him from) rather than a literal one (nobody regenerated the image); it was caught and fixed in-session. Included because the archive itself chose to log it as "my own hero fix cut Jeff's head off."

### Lessons the coordinator of this archive asked to verify, that the git record does not contain

For completeness and honesty: two standing lessons referenced in the archive-request briefing — "edit `packages/hcc.yaml` via Terminal add-on only (Prettier corrupts it)" and "never run auth setup again" — were searched for and **do not appear anywhere in the repo record** (no commit message, no tip doc contains "Prettier" or an auth-setup prohibition). If they exist, they live only in chat transcripts or the iCloud archive. They are listed here as unverifiable from git, not as documented incidents. Similarly, the briefing's hashes `de32a4b`/`bc81c84`/`7a09738` do not exist in this repository; the real commits behind those leads are `eeaa0b7`/`c73e32e` (PIN prompts) and `2c95ffc` (the loader/refresh fix, whose body records the lesson that the 60s self-heal interval "covered Guardian/Lights/Vacuum/Utilities/Car but missed these three" — no earlier same-shaped written lesson was found for it to violate).

---

## CLASS B — the file was consulted, trusted, and was itself wrong

These are the mirror-image failures. They matter to this section because they are what Rule 1 *cannot* fix: a session that reads the file perfectly and is confidently wrong anyway. As `c30b64d` put it: "Docs that disagree with reality are worse than no docs - they make the next session confidently wrong."

### The hour-meter miss — months of a dead feature, coded faithfully against a wrong description (root cause closed 2026-08-11)

The flagship. `a1cfa53` (2026-08-11, "Put the mower firmware in the repo, credentials extracted"):

> This closes the structural root cause of the months-long hour meter
> miss. The cloud session that owned functions/api/hours.js has no
> outbound network and could not see the .ino, so it wrote the server
> half of the contract against CLAUDE.md's prose description of the
> firmware - and that description was wrong. Nobody could diff the two
> halves because only one was in the repo. Now both are.

The damage, quantified in the tip `CLAUDE.md` itself (Rule 13's mower-subsystem exception):

> the hour meter — the entire reason Jeff built the sensor box — never worked for **months across 5 real mows**. The box sent `hours_seconds`; the app read `d.hours`; nothing converted, so the sensor contributed exactly 0.0 hours every sync while Jeff re-entered them by hand. Jeff was told the sensors were faulty and **bought replacement hardware**; they were fine, and had been recording 6.3 km of real mowing the whole time.

**What it cost:** months of the project's founding feature silently dead; Jeff hand-entering hours the box was already measuring; **real money spent on replacement hardware for sensors that worked**; and, as the same passage notes, being *told* the sensors were faulty — a wrong claim delivered with confidence, sourced ultimately from a wrong memory file. The structural fix was to stop the file from being the contract: put the firmware in the repo so the two halves could be diffed (`a1cfa53`), and give the whole subsystem to the session that can reach the hardware (Rule 13 exception, Jeff's decision 08-11).

### The Mercedes PIN chain — thirteen days of dead remote commands on the strength of a wrong CLAUDE.md claim (2026-07-24 → 08-06)

On 07-24, the app's PIN prompts — added that same morning (`eeaa0b7`) — were removed (`c73e32e`, "Remove app-level PIN prompts — mbapi2020 handles PIN from integration options"; documented into CLAUDE.md by `c64d0f8`). The removal rested on the claim that the PIN was configured in HA's integration options. It wasn't. `adcf16c` (08-06, "Mercedes remote start CONFIRMED WORKING from the app"):

> Unlock, remote start, windows and sunroof should all be live again; these have
> been dead since the 07-24 change that removed the app's PIN prompts on the
> strength of a CLAUDE.md claim that turned out to be wrong.
>
> Credit where due: the whole thread started from Jeff noticing the real
> Mercedes app was prompting for a PIN.

The unwinding produced its own second-order Class B event: `473f122` (08-06) "corrected" CLAUDE.md by reading HA's config-entry API, saw an empty options dict, and told Jeff the PIN had never been entered. Hours later, `e3d6de2` opens: "**Corrects the previous commit, which was wrong.**" — the API never returns options; the PIN *was* entered; the real fault was `RIS_PIN_INVALID` (a stale PIN value), found "from one line of Jeff's live system log." Both the wrong claim and the diagnostic trap were then written into CLAUDE.md so the next session checks the system log first.

**What it cost:** unlock, remote start, windows, and sunroof dead in the app for 13 days (07-24 → 08-06); Jeff performed the key diagnostic observation both times; one wrong correction delivered to Jeff before the right one.

### The inventory that said "TO BUY: 2" the day after the decision died (2026-08-15)

The stale doc that armed the Inovelli affair. As of `5de10eb` (08-15 evening), `docs/inventory/HCC_INVENTORY.md` line 45 still read, verbatim:

> | Inovelli Blue 2-1 VZM31-SN (Zigbee) | 0 | **TO BUY: 2** | ~$60 ea | **#1 = KITCHEN, dimmer mode** — far-point router + the dimming test. **#2 = GARAGE man-door, On/Off mode + "3-Way Dumb" type** — the existing kitchen 3-way toggle KEEPS WORKING, no dummy switch needed. …

— two days after the 08-13 evening decision (`c05d647` dates it to 20:07 CDT on 08-13) that killed the purchase. `1572b4a` and `c05d647` (quoted in full in Class A above) document that this exact line is what the 08-16 session planned around. Scrap notices were added to both stale sources on 08-16 (`1572b4a`).

**What it cost:** rolled into the Inovelli affair; this entry is the Class B half of that incident — the doc was read, and the doc was wrong.

### Stale Pending Item 19 — the open question that had already died (closed wrongly 08-16, reopened same morning)

`007e14e`: "Item 19 still asked for a decision between the Kasa HS200 and HS210 for the garage 2-location circuit. That question died on 08-13… Leaving it open sent this session down the wrong road." The closure itself then had to be reversed by `c05d647` because it was based on the scrapped Inovelli (see Class A). A stale pending item is a Class B hazard by definition: it is the part of the memory file that tells a session what to work on.

### The phantom commit: work "documented but never committed" (2026-07-28)

`1f4008f` (07-28, "Finish electric usage-pattern model (was documented but never committed in 07bd9a1)"):

> This code existed only in the local working tree and was
> never actually part of 07bd9a1 despite that commit's message claiming
> it — so the feature was never live. Also corrects CLAUDE.md's stale
> "B-Hyve invalid_auth" pending item; the integration is confirmed
> already running correctly, don't re-touch coordinator.py over it.

Two Class B hazards in one commit: a commit message claiming code it didn't contain (any session reading `git log` — which Rule 9 requires — would believe the feature shipped), and a stale pending item inviting a session to "fix" a working integration. **INFERRED:** how long the electric model was believed live is bounded by the dates (07bd9a1 predates 07-28) but not stated.

### The stale-doc drumbeat — smaller documented corrections of the memory file's own claims

Individually small, collectively the reason "newest first, because older docs go stale" ended up in SESSION_START. Each is a commit correcting something the memory file or its docs asserted wrongly: `35553b4` (08-05, "Correct J45 USB port count in project memory (4 ports, not 2)"); `67ba0b5` (08-06, "correct the LUX panel description to the shipped values"); `76d0326` (06-27, "Memory: corrections from meter/panel photos"); `2aca121` (08-13, "Echo Dot guess and Bluetooth-only verdict both wrong, corrected"); `e057559` (08-13, "Inventory: Jeff's corrections — kitchen is the far mesh point, beige box is the MOES module" — Jeff correcting the docs in person); `7a1d250` (08-15, CLAUDE.md "said hcc-v10, actually hcc-v78" — the cache-version note was 68 versions stale); and `af6df04`'s finding that Pending Item 17's guidance note had guessed wrong (Class A entry above). None of these individually caused documented damage; the Mercedes PIN chain and the hour meter show what happens when one of them does.

---

## CLASS C — what the memory file itself cost

### The bloat arc: 737 lines → lean rule → regrowth → 260 KB "crowding out real work" (2026-06-28 → 08-16)

The memory file is injected into every message; its size is a tax on every turn of every session. The record shows the tax was noticed early, a rule was written, and the rule lost to entropy twice.

**06-28 — the lean rule is born.** `a4ae337` ("Memory hygiene: compress CLAUDE.md (737→550 lines) + add lean rule"):

> Collapse five verbose session-history blocks (with full commit-hash dumps)
> into one compact Change Log + a fresh Current State snapshot. … Add
> Mandatory Rule #11 (memory hygiene) so the file stays lean automatically —
> finished work condenses to one-line changelog entries; detail lives in git.

Rule 11's text (as first committed): "it's injected into every message, so bloat costs efficiency on every turn… Target: stay well under ~600 lines."

**07-28 — the rule has already lost once.** `414c74f` ("Condense CLAUDE.md: 610 -> 374 lines, cut stale/resolved detail **per Jeff's request**") — the file had regrown past its own target, and it took Jeff asking to trigger the cleanup.

**08-16 — the rule has lost catastrophically.** `fab5b30` ("Restructure CLAUDE.md 260KB -> 58KB"):

> CLAUDE.md is auto-loaded and occupies context for the whole session; at 260 KB it
> was crowding out real work. Moved the heavy material out, nothing deleted…

The extracted changelog's own header (tip `docs/CHANGELOG_ARCHIVE.md`) quantifies it:

> Extracted from `CLAUDE.md` on 2026-08-16 07:18 because the Change Log had grown to
> 177 KB — 68% of a file that is injected into **every single message**.

Jeff's verbatim direction, preserved in Rule 16 (tip `CLAUDE.md`): *"break it up and put the stuff in iCloud and then just tell yourself to read that."* Rules 15 and 16 (read SESSION_START.md in full; history lives outside this file now, one-line index only) are the structural replacements for a discipline that two written targets had failed to maintain.

**What it cost:** every message of every session between the regrowth and each purge carried the overhead — by 08-16, a quarter-megabyte of context per turn, 68% of it changelog, before any work happened. **INFERRED:** the cumulative token/context cost over the weeks of growth is real but not computable from git; what git documents is that by the file's own commit message the bloat "was crowding out real work." Honest present-tense footnote: the tip file is 547 lines against Rule 11's current stated target of "well under 400 lines" — the lean rule is, at branch tip, still not met by its own measure, though the 58 KB restructure is the operative fix.

### The PROTECTED-sections rule: compression as a threat to the point of the project (2026-06-28)

Eight minutes after the first compression, `1305f0a` ("Protect the relationship sections — first and foremost, never compressed"):

> Mark Jeff's Message, The Working Relationship, and the Mandatory Rules as
> PROTECTED: never trimmed or compressed, always first before technical work.
> Memory hygiene only ever touches history/changelog/reference.

This rule exists because the cure for Class C (compress the file) had an obvious failure mode: a future lean-minded session trimming the sections that carry Jeff's actual words and the relationship itself. The protection held: `414c74f` asserts "Protected sections… untouched verbatim," and `fab5b30` asserts "Every PROTECTED section… was asserted byte-identical before writing." **No documented violation of the PROTECTED rule exists** — it is included here because it, too, is a rule whose existence is evidence of a foreseen failure, and because both later compressions had to *prove* compliance, which shows the risk was treated as live.

---

### The honest tally

Only what the record supports; everything else marked INFERRED. "Class" per the definitions above; several incidents straddle A and B and are marked so.

| # | Incident | Date(s) | Class | Documented cost |
|---|---|---|---|---|
| 1 | Great blank-page incident (Rule 8 origin) | 06-23 | A-origin | Whole app blank — all JS dead (`a973c8f`). No recurrence after rule written. |
| 2 | Installer-command flip-flops; BusyBox failure after Rule 7 written | 06-23 → 06-24 | A (Rule 7) | ≥3 correction commits on commands handed to Jeff (`1f3ce1a`,`686bece`,`a744651`); post-rule violation documented by `a744651`'s timestamp. **INFERRED:** Jeff's terminal time. |
| 3 | Round-robin debugging era; harness run only after Jeff's call-out | ≤07-03 | A (pre-Rule 12) | Jeff ran diagnostic scavenger hunts; false "Beehive Offline" + dead meters (`0f44d9d`); confession embedded in protocol text (`f668301`). |
| 4 | Stale-cache class fixed by symptom for 10 days | 07-10 → 07-21 | A (Protocol step 3) | "v3/v6/v10/network-first cache fixes not sticking permanently" (`173270a`); three root-cause layers found serially (`70dba84`,`6f517ac`). **INFERRED:** days of stale app on Jeff's devices. |
| 5 | CAR declared "fully live" with every command button dead | 07-21 → 07-22 | A (Rule 6) | Two full same-day rewrites of the command layer (`4e9445d`,`8d339ee`,`778f6bd`). |
| 6 | PIN prompts removed on wrong CLAUDE.md claim; remote commands dead | 07-24 → 08-06 | B | 13 days of dead unlock/remote start/windows/sunroof (`c73e32e`,`adcf16c`); Jeff made the key observation; one wrong correction (`473f122`) before the right one (`e3d6de2`). |
| 7 | Phantom commit 07bd9a1 + stale B-Hyve pending item | ≤07-28 | B | Electric feature believed live, never was (`1f4008f`); stale item invited re-breaking a working integration. |
| 8 | Three wrong garage-door parts in a row | 08-05 | A (Rule 6 spirit; origin of no-guessing rule) | Jeff fact-checked three wrong recommendations, found the right part himself (`7f73148`). No documented recurrence. |
| 9 | Jeff regenerated out of his own hero photos | 08-06 | A-origin (photo rule) | Photos rebuilt; PROTECTED photo section added (`db9ffcc`). 08-11 head-crop echo (`e5d57f4`) — **INFERRED** as same-spirit repeat, caught in-session. |
| 10 | LUX login fix declared "real but unconfirmed live" | 08-04 → 08-06 | A (Rule 6) | 2 more days broken; Jeff re-reported and supplied the key question; two further root causes (`34c90ac`,`1707cf4`). |
| 11 | Wall-iPad sideways: own regression + speculative unverified fix shipped | 08-08 | A (Rule 6; Protocol step 2) | Evening of sideways wall display; Jeff supplied the timeline that found the cause (`bb9d1cf`,`24136c7`,`5d22cf7`,`9da43a5`). |
| 12 | Coverage map wiped Jeff's hour meter to 5.9 | 08-10 | A (Rules 5, 10) | Jeff's entire saved state lost on his device; "Root cause is mine" (`b568a4b`). |
| 13 | Date/time discipline broken; broken again after Rule 14 | 08-10 + once ≤08-16 | A (Rule 14) | Wrong date/time stated to Jeff; "it has been broken twice" (`docs/SESSION_START.md`; `a2779b5`). |
| 14 | Hour-meter miss: server coded against wrong CLAUDE.md prose | months → 08-11 | B | Founding feature dead for months across 5 mows; Jeff hand-entered hours; **Jeff bought replacement hardware for working sensors**; Jeff told sensors were faulty (`a1cfa53`; tip CLAUDE.md Rule 13 exception). |
| 15 | Inline-style trap hit twice | 08-01, 08-11 | A (written lesson repeated) | Rework both times; archive's own word: "again" (`bdc6f93`; archive 08-11 entry). |
| 16 | Hardcoded dark-mode colors recurring in light mode | 06-29 → 08-11 | A/B | ~6 weeks of recurring invisible text incl. unreadable error messages at 1.09:1; guidance note's guess wrong; ≥6 fix commits (`44ea8e8`,`bdc6f93`,`fdc358e`,`af6df04`). |
| 17 | Inovelli/Kasa affair: stale docs planned from, one-word grep, "never documented" ×2, Item 19 closed wrongly, $120 re-pitched | 08-13 → 08-16 | A + B | A session's planning wasted; 4 settled questions re-asked; killed $120 purchase re-pitched; two false statements to Jeff; item closed/reopened; 6 corrective commits + MASTER RECORD build (`1572b4a`,`c05d647`,`007e14e`,`831db1b`,`c30b64d`,`1d1ebdb`; stale source `5de10eb`). Jeff: "this is infuriating." |
| 18 | Tunnel-vision hour (Samba/SSH detour; leak data already in LTS) | 08-16 | A-origin (Rule 16) | One documented lost hour + a redundant data hunt (tip CLAUDE.md Rule 16; SESSION_START §4). |
| 19 | CLAUDE.md bloat vs its own lean rule | 06-28 → 08-16 | C | Regrew past target twice despite Rule 11; 260 KB / 68% changelog injected every message, "crowding out real work"; two Jeff-triggered purges (`a4ae337`,`414c74f`,`fab5b30`; archive header). **INFERRED:** cumulative per-turn cost over weeks. |
| 20 | PROTECTED-sections rule (compression threat to relationship sections) | 06-28 | C | Preventive; no violation documented — both later compressions had to prove byte-identical compliance (`1305f0a`,`414c74f`,`fab5b30`). |

Trust is a column this table cannot carry honestly, so it is stated once: the record's own quotes — "this is infuriating," "I can't keep doing this every time the session changes," "I'm done with code after the last debacle" (Rule 13, Jeff's 08-14 single-session decision), "you did not read the archives" — are the documented trust cost, and they cluster around exactly these incidents.

### What the record cannot count

Git records the confessions, not the crimes. Every incident above entered the record only because some session *caught* the failure and wrote it down; a violation that was never caught — a re-asked question Jeff wearily re-answered, a skimmed file that happened not to bite that day, a wrong claim never checked — left no commit. The 6,896 archived messages in the MASTER RECORD (iCloud, built by `1d1ebdb`) hold most of the real count, and they are outside this repo.

Specifically uncountable from git:

- **How many sessions never read the file at all.** Rule 1 compliance leaves no trace either way. Only breakage does.
- **"Killed on price twice."** Jeff's archive request states the dimmer switches were killed on price *twice* and that he was told "that was never documented." The git record substantiates one documented re-pitch cycle — the Inovelli affair (`1572b4a`: "Jeff rejected the Inovelli Blue early on… this session planned the entire Zigbee mesh around them and pitched them back to him") — and substantiates the "that was never documented" claim exactly ("I told Jeff twice that the decision… was never written down. That was wrong." — `c05d647`). The *second* price-kill conversation, and any earlier re-pitch, live in transcripts; here they rest on Jeff's request file, which is itself testimony, and on `1572b4a`'s "rejected… early on," which implies the rejection predated the 08-13 docs by some margin.
- **The pre-06-23 era.** The branch begins 2026-05-20; the memory file begins 06-23. Five weeks of sessions ran with no file to read, and whatever was re-asked or re-broken in them is invisible — except as the accumulated frustration in Jeff's 06-24 message, which is the record of it.
- **The second date/time break** (only trace: "it has been broken twice," `docs/SESSION_START.md`).
- **The uncommitted first eight weeks of cloud-session context** — `1d1ebdb` itself had to file a `REQUEST_TO_CLOUD_SESSION` "to recover the first 8 weeks the cloud sessions own."
- **Lessons that may exist only in transcripts** — the Prettier/`hcc.yaml` and "never run auth setup again" lessons referenced in the archive request were not found anywhere in the repo; if they were taught, they were never written down, which is itself the Class-A failure mode this section documents.

### What would actually prevent it

Only measures the record has already adopted or proposed — each one a scar converted into structure:

1. **The SESSION_START survey rule and doc index** — "52 files exist. Survey before you plan ANYTHING… list `docs/` sorted by date, and read every file touching it — newest first, because older docs go stale" (`docs/SESSION_START.md` §2b, added `831db1b`, 08-16). Enforced by Mandatory Rule 15: "READ `docs/SESSION_START.md` IN FULL AT THE START OF EVERY SESSION (Jeff's rule 2026-08-16)."
2. **The SETTLED DECISIONS section** — a PROTECTED, impossible-to-miss list of decisions that must never be re-proposed, with Jeff's verbatim reasoning attached (`c30b64d`, 08-16): "If a session is about to suggest one of these, it has not done its reading."
3. **The decisions-written-same-session rule** — "A decision Jeff makes in conversation goes into a file THE SAME SESSION" (`c30b64d`, tip CLAUDE.md; first stated in `1572b4a`: "Standing lesson: a decision made in conversation goes into the doc the SAME session"). This is the only measure that attacks Class B at its source.
4. **The grep-trap warning** — written into CLAUDE.md's SETTLED DECISIONS block and SESSION_START §0 (`c05d647`, `1d1ebdb`): searching for the *dead* plan and finding nothing proves nothing; "Search for what the plan **is**, check file dates, newest wins."
5. **The MASTER RECORD and mandatory search** — "Every word ever said on this project is archived and searchable. There is no longer any excuse for 'that was never documented.'… MANDATORY: search it before replying, any time Jeff says 'we discussed' / 'I told you' / 'that was settled', or before recommending hardware or re-opening any question" (`docs/SESSION_START.md` §0; built by `1d1ebdb`, rebuilt daily at 5:45 AM).
6. **The lean-file architecture** — CLAUDE.md restructured 260 KB → 58 KB with history offloaded to `docs/` + iCloud, one-line index in the file, and Rules 15/16 requiring sessions to go read the archive instead of the archive being force-fed every turn (`fab5b30`; Jeff: "break it up and put the stuff in iCloud and then just tell yourself to read that").
7. **PROTECTED sections** — so no future compression can eat the rules or the relationship that the rest of this section proves are the only things standing between the project and the loop (`1305f0a`, verified byte-identical in `414c74f` and `fab5b30`).

The pattern across all seven: the record's answer to "the file wasn't read" was never "read harder." It was to make the file smaller, the index mandatory, the settled things unmissable, the decisions written the same hour they were made, and the search phrased for what *is* rather than what *was*. Whether that holds is a question for the sessions after 2026-08-16 — the ones this record file exists to inform.


---

## The Bill — what the errors actually cost in time and money

Jeff asked, verbatim: *"include the amount of tokens and or time that was spent on all those errors and convert it to $ spent and the time lost."* This section is that bill — computed only from what the record can actually measure, with every assumption shown.

### Methodology & limits

**Tokens: not recoverable. No token numbers appear in this section because none exist in the record.** Git stores commits, not API usage. The MASTER RECORD build (`1d1ebdb`, 2026-08-16) archived 6,896 verbatim messages across 37 sessions and 25,547 tool events — but only from 07-14 onward, and even that archive counts messages and tool calls, not tokens. Everything before 07-14 lives only in cloud sessions this record cannot read. Any token figure written here would be an invention, and this archive exists precisely because inventions were presented as facts.

**What git DOES measure precisely, and what this section is built from:**

- **Commit timestamps** (all times below converted to Jeff's Central time, CDT/UTC−5): the wall-clock bracket of each debugging burst — last commit of the burst minus first commit of the burst, on the same day.
- **Calendar days an issue stayed open**: date of the first commit fighting the symptom → date of the final fix commit.
- **Commits burned** per incident, out of 636 total on `origin/claude/time-master-project-liq1jw` (2026-05-20 `09f02d4` → 2026-08-16 `1d1ebdb`).

**Stated assumptions, used once and applied uniformly:**

1. **Burst-overhead assumption — ESTIMATE:** an intra-day commit bracket measures only first-commit→last-commit. The reading, diagnosing, and chatting *before* the first commit of a burst leaves no timestamp. I add a flat **0.5 h per debugging burst** for it, and label every total that includes it. This is conservative — several bursts (Blink 06-25, the 06-23 evening) plainly involved more than 30 minutes of pre-commit fighting.
2. **Subscription anchor:** Jeff pays **$125/month for Claude Max**. This figure is **not from git metadata** — it is from Jeff's own words, preserved verbatim in `CLAUDE.md` at the branch tip: *"I spend $125 for Claude Max and I would rather spend the money on that and have your help than buy $120 worth of dimmers."*
3. **Jeff's personal time is reported in hours**, from commit brackets and the record. Where a dollar conversion of his time would require inventing an hourly rate, none is made.
4. Facts attributed to "the archive request" (the 08-16 instruction that commissioned this record) are marked as such where git itself is silent.
5. Timestamps in mixed timezones in the raw log (+0000 and −0500) were normalized to America/Chicago before any span was computed.

### Per-incident bill

All hashes verified against the branch. "Measured active debugging" = sum of intra-day commit brackets only (no overhead added inside the table).

| Incident | Dates (2026) | Cal. days open | Measured active debugging | Commits burned | $ notes | Jeff-time markers |
|---|---|---|---|---|---|---|
| **The Great Blank Page + evening fix chain** — hero-photo extraction (`739d004` 14:38) broke the app; `8497827` cache-bump, `a973c8f` fatal stray-`<script>` fix (15:23), then the collateral chain: GPS track loss `20df8da`, modal buttons `da1320c`, all broken CSS `e904a5b` (18:55) | 06-23 | 1 | **4 h 17 m** (14:38→18:55, one continuous evening firefight) | 11 (incl. KV dance below, which sits inside this same window) | — | Jeff's app was blank/broken through a full evening; he was the one refreshing and reporting each new breakage |
| **KV binding dance** — `98b8dca` (15:55) fallback guess → `b629c83` (16:08) revert "may have broken sensor read" → `53eb7d4` restore Jeff's real 5.9 h → `c6f3df8` (16:35) try-both-names fix | 06-23 | 1 | 40 m (15:55→16:35; inside the 4 h 17 m above — not double-counted in totals) | (counted above) | — | Jeff's real hour-meter value had to be manually restored (`53eb7d4`) |
| **Install-script saga** — `75a7afd` (07:26) → `1f3ce1a` curl-not-wget → `a463d09` /setup endpoint → `686bece` (08:35) wget-after-all; recurred next day: `a744651` 06-24 BusyBox `-O` ordering | 06-23 → 06-24 | 2 | **1 h 09 m** (06-23 morning) + 1 recurrence burst 06-24 | 7 | — | Jeff was at the HA terminal pasting each failed command variant |
| **LUX PUT-500** — `858cd74` (06-25 22:13) "log set_sp 500 error as top pending item" → next session `07409da` POST-not-PUT fix → `33ca88f` confirmed (06-26 11:28) | 06-25 → 06-26 | 2 | 4 m of commit bracket; **13 h 15 m pending-item span** (22:13 → 11:28) with thermostat control broken overnight | 3 | — | Jeff's thermostat setpoint was uncontrollable from the app overnight |
| **Shared-AbortSignal false-offline** — `a6d1e3b` (07-03 04:25) records the regression *and* that Jeff had to call it out; `f668301` (04:53) adds the PROTECTED "Debugging Protocol: attack the source, test on my end first" | 07-03 | 1 | 29 m | 2 | — | **Jeff diagnosed the falsity himself** — the app said his gear was offline when it wasn't; a standing protocol had to be written to stop the pattern |
| **Blink saga** — first fight `c7bc5ba` 06-24; the 06-25 installer grind: **13 commits in 3 h 46 m** (`b86a37e` 14:07 → `dbc8fbe` 17:53) of sed/awk/BusyBox/GitHub-download attempts; 07-03 cookie fix + blinkpy bump (`f3ae126`→`59c8749`); real fix 07-09 (`9b29c1f`), cameras finally LIVE `7bbc8a2` | 06-24 → 07-09 | **16** (7 within the 07-03→07-09 bracket named in the request) | **4 h 53 m** across 4 bursts (3 h 46 m + 25 m + 42 m) | **20** | Cameras were "Jeff's #1 priority" per `17d388a` — his #1 feature was down the entire span | Jeff ran 2FA codes and installer commands repeatedly across three separate days |
| **Fire TV pop-up + pause/resume war** — `987e804`/`a88ccc6` 07-11 "confirmed working" → `c13f101` 07-14 audit: **CodeProject.AI had been silently dead 3 days** → `b108a6e` still broken → `25e3256` ADB-not-Alexa fix → `3a714fe`, `2965b5a` 07-15 pause/resume real fix | 07-11 → 07-15 | 5 | **4 h 03 m** across 3 bursts (40 m + 2 h 00 m + 1 h 23 m) | 7 (follow-on fixes continued 07-31→08-03: `fd15642`, `62e99b5`, `f07048f`) | — | 3 days of zero camera alerts with nobody noticing (INFERRED from `c13f101`: "service down 3 days") — Jeff's house was unwatched while "working" |
| **Stale-content deploy mystery** — `173270a` 07-20 "fix ROOT CAUSE of recurring stale-cache bug" (didn't) → 07-21 `70dba84` no-cache headers → `e37a193` the real fix (CDN-Cache-Control + no-store) → `6f517ac` "correct root cause" | 07-20 → 07-21 (recurrence: first stale-cache fix was `4f96d09` **06-23** — 29 days of recurring symptom) | 2 | **1 h 18 m** (07-21) + 07-20 attempt | 4 (+ earlier recurrences `4f96d09`, `8497827`, `24df1fc` counted elsewhere/uncounted) | — | Every recurrence = Jeff seeing old content and re-reporting a bug that was declared fixed |
| **mbapi2020 entity-guessing era + PIN mistake** — `7afcda2` 07-17 wires CAR to guessed entities; symptom whack-a-mole 07-21 evening (false window-open ×2 `6464a8e` `502bcff`, lock cross-contamination `9647ca5`); ended only by the research-first rewrite `778f6bd` (07-21 19:53, "researched from source"); then the PIN prompt built `eeaa0b7` 07-24 and **deleted 40 minutes later** `c73e32e` — mbapi2020 already handled PIN | 07-17 → 07-24 | 8 | **4 h 00 m** across 3 bursts (incl. 3 h 18 m on 07-21) | 13 | — | Jeff's car reported windows open that were closed; the PIN feature he was shown was removed the same morning |
| **Stale-data no-auto-refresh** — `2c95ffc` 07-23 19:16 (the hash in the commissioning note, 7a09738, does not exist on this branch; this is the verified commit): sensors/cameras/weather simply never refreshed themselves | 07-23 | 1 | 1 m bracket (fix was small; the *symptom* had existed since launch — INFERRED) | 2 | — | Every stale reading Jeff ever manually refreshed before 07-23 |
| **Water pit-radio false fault** — `9fefa97` 06-30 "critical water-pit radio finding" → `281d65b` 07-28 "hardware failure diagnosis" → `13502b9` 07-31 closed per Jeff → `593ddf7` 08-01 "confirm fault via live irrigation+shower test" → **RETRACTED same day at tip**: CLAUDE.md item 10 records the meter and radio are healthy; the "fault" was rtlamr2mqtt's `-unique=true` flag + batched meter broadcasts | 06-30 → 08-01 | **33** | 8 m of brackets across 4 bursts (most of this fight was live testing, not commits) | 5 | $0 spent — but Jeff was one phone call from reporting a healthy meter to WHUD as broken | Jeff ran a live irrigation-plus-shower test to "confirm" a fault that did not exist |
| **Sewer history never-saved** — `8158128` 08-05 20:18: "real B-Hyve data was never saved to history" — the overcharge-tracking feature had been recording nothing | 08-05 (bug present since the feature shipped — start date INFERRED, not measurable) | 1+ | single-commit burst | 1 | The feature existed to fight sewer overcharges; while it saved nothing, that evidence was simply lost | — |
| **Heartbeat erasing the mow** — `60c5d28` 08-10 15:24 → `723eeab` real history → `ee21a1e`/`333adcf` raw-payload logging (whitelist had been silently dropping real fields) | 08-10 | 1 | **50 m** | 4 | — | Every prior mow's peak-RPM/distance had been overwritten by the parked heartbeat ~5 min after finishing |
| **Coverage-map localStorage blowout** — `b568a4b` 08-10 18:10: the map shipped ~3 h earlier blew out localStorage and **reset Jeff's hour meter**. Same-day self-inflicted, same-day fixed | 08-10 | 1 | single-commit burst (≈2 h from shipping the defect to fixing it — INFERRED from the 15:24→18:10 gap) | 1 | — | Jeff's hour meter — the thing the whole sensor exists for — read wrong again |
| **THE HOUR-METER MISS** — earliest hours plumbing `4f96d09` 06-23 06:44 ("fix missing /api/hours") → firmware root-cause fix `6913393` 08-11 13:19 + `d18db7b` + `c63142b` + `a1cfa53` (firmware finally in repo, 19:31). Box sent `hours_seconds`, app read `d.hours`, **sensor contributed 0.0 h on every sync, ever** | 06-23 → 08-11 | **50 days (≈1.6 months)** | **6 h 12 m** on fix-day 08-11 alone (13:19→19:31); the era's other mower-bug bursts itemized separately above | 5 direct (era total is far higher) | **Jeff bought replacement hardware he didn't need** after being told his sensors were faulty — CLAUDE.md at tip, verbatim: the hour meter "never worked for **months across 5 real mows**… Jeff was told the sensors were faulty and **bought replacement hardware**; they were fine." Price of that hardware: **not recorded in git — unknown, not invented** | `gps_firmware_coworker_findings_2026-08-11.md`: box held **"19,890 s = 5.53 h" of real runtime that never reached the app**; `hours_history` "has never recorded a single mow" **"despite `dist_total_m: 6326` proving 6.3 km of real mowing"**. Jeff hand-re-entered hours after every one of the 5 mows |
| **The Inovelli affair** — `a5c67a8` 08-13 19:40 selects Inovelli Blue; **1 h 08 m** of same-evening planning built on it (build plan `6c90202`, floor plan `29c7a1a`, wiring confirmations through `8b7a69a` 20:48); Jeff scraps it on price *in conversation*; nobody writes it down; a later session re-proposes it; 08-16 morning remediation: `1572b4a` 08:08 "SCRAPPED on price - it was never written down" → `c30b64d` SETTLED DECISIONS → `c05d647` 08:16 correction | 08-13 → 08-16 | 4 | 1 h 08 m (08-13 planning-on-sand) + **28 m** (08-16 cleanup bracket 07:59→08:16) | 10 | **$120 dimmer pair REJECTED — money *not* spent** (Jeff, verbatim in CLAUDE.md: "I was not paying $120 for a freaking dimmer switch"); replaced by the ~$104 Kasa+Zigbee-plug list (~$70 of it new spend, 2 HS220s already owned). CLAUDE.md at tip: the doc-search trap "**already cost a whole session**" | The archive request states a whole session was lost planning around scrapped dimmers; git corroborates the trap warning in CLAUDE.md and the 08-16 correction chain, and Jeff's own words — "I can't keep doing this every time the session changes" (`1d1ebdb`) — are the direct trigger for this entire archive |

**The two-day marathon (cross-check requested):** the archive request describes Jeff running one session two days straight to avoid losing context, and it degrading. Git corroborates a two-calendar-day continuous window, though not a full 48 hours: **2026-08-05 06:54 → 2026-08-06 17:35 CDT — 34 h 41 m with no gap between commits longer than 6 h, 73 commits** (the single densest stretch of the whole project; 08-06 alone is the project's highest-commit day at 52). The claim of *degradation* is the request file's, not git's — but the sewer never-saved discovery (`8158128`), the Mercedes PIN wrong-root-cause corrections (`473f122` → `e3d6de2`), and the fake-Blink-mockup replacement (`1eba07f`) all fall inside this window.

**Incidents found beyond the commissioned list (counted in totals only where itemized above):** Blink silently disarmed 08-10→08-14 — a 4-day total camera outage discovered only during alert-fatigue debugging (`eba1648`: "root cause was Blink disarmed (silent total outage since 08-10)"); and the 08-05 garage-parts incident — three wrong product names in a row (ratgdo → "SONOFF Basic" → SONOFF SV) before **Jeff found the correct SONOFF MINI-D himself**, which produced standing rule 8 in CLAUDE.md ("NEVER name a specific product/model to Jeff from memory").

### The totals

**Measured active debugging wall-clock (intra-day commit brackets only, no overhead):**
4 h 17 m + 1 h 09 m + 0 h 04 m + 0 h 29 m + 4 h 53 m + 4 h 03 m + 1 h 18 m + 4 h 00 m + 0 h 01 m + 0 h 08 m + 0 h 50 m + 6 h 12 m + 1 h 08 m + 0 h 28 m ≈ **28.8 hours measured**.
**ESTIMATE with burst overhead:** ~30 distinct debugging bursts × 0.5 h pre-first-commit assumption = +15 h → **≈ 44 hours of active error-fighting** (assumption stated in Methodology; the true figure is almost certainly higher, since chat-only debugging leaves no commits at all).

**Calendar-days-open, summed across incidents** (overlapping calendar time — an era metric, not elapsed time): 1+2+2+1+16+5+2+8+1+33+1+1+1+50+4 = **128 incident-days**, dominated by the hour-meter miss (50), the pit-radio false fault (33), and Blink (16).

**Commits burned on error-fighting: 95 of 636 total = 14.9%.** (Itemized: 06-23 firefight 11, install 7, LUX 3, AbortSignal 2, Blink 20, Fire TV 7, stale-deploy 4, mbapi/PIN 13, auto-refresh 2, pit-radio 5, sewer 1, heartbeat 4, coverage-map 1, hour-meter 5, Inovelli 10.) Roughly **one commit in seven on this project was spent fixing something that was already supposed to work** — and this counts only the 17 incidents itemized here.

**Hardware dollars:**
- **Wasted:** the replacement mower-sensor hardware Jeff bought because he was told his working sensors were faulty (CLAUDE.md, hour-meter miss). **Amount not recorded anywhere in git — reported as unknown rather than invented.**
- **Avoided (Jeff's own veto, not the tooling's):** $120 Inovelli dimmer pair, rejected verbatim; replaced by the ~$104 lighting list (~$70 new spend after the 2 owned HS220s).
- **At risk but not wasted:** the ~$40 RTL-SDR (recorded in `ae337d4` 06-30 as "the only new buy") survived the pit-radio false-fault scare — the meter was healthy all along. The ~$35 ratgdo garage board was researched (`7b60e43` 08-04) and dropped for a cheaper relay (`10f0f13` 08-05) before purchase. A $31.85 blade figure named in the commissioning note **could not be verified anywhere in the git record or tip docs and is therefore not counted.**

**Subscription-dollar share — ESTIMATE, arithmetic shown:**
Active project span 06-21 → 08-16 = 57 days ≈ 1.87 months. 1.87 × $125/mo = **$233.75 of Claude Max subscription over the project** (the $125/mo anchor is Jeff's verbatim quote in CLAUDE.md, not git metadata). Using the commit fraction as the best available proxy for effort share: 14.9% × $233.75 ≈ **$35 of subscription money spent fighting the tooling's own errors**. INFERRED alternative using time: if the ≈44 estimated error-hours are set against the 47 days that have any commits at ~4–8 working hours each (188–376 h), the error share is 12–23% — bracketing the same ≈$28–$54 range. Either way: **on the order of $30–$50 of the ~$234 subscription spend, plus an unrecorded hardware purchase, plus ≈44 hours of combined wall-clock — a large share of it Jeff's own evenings.**

**Jeff's personal hours (reported as hours, per Methodology — no invented wage):** he was present for essentially every burst above, because every one required his hands — pasting installer commands, running 2FA codes, live-testing showers and irrigation against a healthy meter, hand-re-entering mower hours after each of 5 mows, restoring his own 5.9 h baseline, fact-checking three wrong part numbers, and sitting the 34 h 41 m 08-05/08-06 marathon. The measured brackets put a floor of **≈29 hours** under his involvement; the true number is higher and unrecoverable.

### What this does NOT include

- **Tokens.** Zero token counts exist for any session. Not estimated, per the honesty rules.
- **Chat time that produced no commits** — whole debugging conversations, re-explanations after every session reset ("I can't keep doing this every time the session changes" — `1d1ebdb`), and the first 8 weeks of cloud-session history that `REQUEST_TO_CLOUD_SESSION` was written to recover.
- **The uncaught incidents**: the mows the sensor silently missed before anyone knew to look; the 08-10→08-14 disarmed-Blink outage's four unwatched days; every stale-cache refresh Jeff performed before 07-23 without filing it as a bug; wrong answers corrected in conversation that never reached a commit message.
- **Jeff's time converted to wages** — deliberately left in hours.
- **The cost of eroded trust**, which is the one line item this whole archive exists to repay.
