## The Good, the Bad, and the Ugly — every documented argument, correction, and screwup

### How this section was built, and what it can and cannot see

Jeff's instruction for the archive was explicit: *"all our arguments as well… the good bad and ugly of everything."* The literal chat transcripts are **not in this git repository**. What *is* here is the echo of every one of those conversations: 636 commits on `origin/claude/time-master-project-liq1jw` (2026-05-20 → 2026-08-16), many of whose messages are full root-cause writeups that quote Jeff verbatim and openly record Claude being wrong; plus `CLAUDE.md` and its revision history, `docs/CHANGELOG_ARCHIVE.md` (179 KB, 98 entries, "Nothing was deleted. Every entry below is verbatim"), `docs/SESSION_START.md`, and ~52 files under `docs/`.

Search method, for anyone who wants to reproduce or extend this: `git -C <repo> log --all -i --grep='<term>' --format='%h %ad %s'` across the terms CORRECTION, called me out, my fault, root cause, I was wrong, never again, scrapped, rejected, dead end, Jeff, frustrat, apolog, trust, run around, re-litigat, false, stale, wasted, actually, regression, wrong, broke, PIN, localStorage, wipe, meter, coworker, confirmed — then reading every full body with `git log -1 --format=%B <hash>`. Terms that returned **zero hits anywhere in the repo** are themselves a finding: `apolog*`, `sorry`, `should have`, `never again`, `undocumented`, `run around`, `called me out` (as a literal phrase — the *event* is recorded, the phrase is not). This project's confessions are written in the register of engineering post-mortems, not apologies.

A note on the honesty of the source. The record is unusually self-incriminating — Claude repeatedly wrote its own failures into permanent files, including files Jeff would read. Several entries exist *only* because someone chose to record a mistake that nobody else would have caught. That fact is itself part of "the good." But it also means the record is not neutral: it is Claude's account of Claude's errors. Jeff's side survives only where it was quoted.

---

## PART A — THE GOOD

### A.1 The moments the record shows the collaboration actually working

#### 2026-06-23/24 — "The Big Fix Session" and 66/66

The first genuine win is also the aftermath of the first crisis (see Part C.1). After Jeff's frustration message, the session went through the app end to end and fixed six real defects in a row, then proved it.

`CLAUDE.md` at commit `90e556e` (2026-06-24) records the verified state as a table, ending:

> | 66/66 Playwright tests | PASSING |

The commit message itself (`90e556e`, 2026-06-24):

> Incorporates Jeff's verbatim frustration message as a permanent directive, adds mandatory pre-session checklist, documents all bugs fixed in session 2026-06-23/24, captures current verified state (66/66 tests passing), and outlines pending items for next session.

And the same day, a safety net that reads as an act of contrition in code — `c200a18` (2026-06-24):

> Add backups/ folder — physical copies of all working files as of 2026-06-24
>
> Safety net: if any file gets broken, restore from backups/*.2026-06-24.bak. Branch backup/verified-working-2026-06-24 also pinned to commit e904a5b (66/66 tests pass).

**INFERRED:** the 66/66 figure is a Playwright suite count from that era only; by 2026-08-11 the suite count is reported as "33/33 pass" (`docs/CHANGELOG_ARCHIVE.md`, 08-11 10:05 PM entry) and by 08-15 as "mower-hours 49/49" (`7a1d250`). These are different suites, not a regression — the record does not claim continuity between the numbers.

#### 2026-07-02 — Meters-live day

Two utility meters, read off the air, into Home Assistant, into the app. From the Change Log preserved in `CLAUDE.md` at `2fdef21^`:

> - **07-02:** 🎉 **WATER + GAS METERS LIVE** — RTL-SDR + **rtlamr2mqtt** add-on reading both. **Water `79453337` = `scm+`** (key discovery: NOT plain scm), **Gas `33393066` = `scm`** (full ID confirmed off the Itron 100G barcode). Both publishing every 60s → `sensor.water_meter` (raw 129105), `sensor.gas_meter` (raw 883384). Full working config + discovery method in **`docs/beehive/rtl_sdr_meter_setup.md`**. No Windows drivers (add-on ships the driver).

This landed on the back of real-world legwork by Jeff, recorded the day before:

> - **07-01:** WHUD supervisor briefed Jeff in person → **water meter blocker RESOLVED**: read via unencrypted Itron `100WD` MIU, **ERT-SCM**, endpoint **`79453337`**, ~915–930 MHz, SCM/min + hourly big read, **no AES key**…

And the same day the J45 got its own win:

> - **07-02:** 🎉 **J45 migrated to internal drive** — Beehive now boots HA OS 18.1 standalone off the internal 128 GB SSD (was flaky external USB).

#### 2026-07-03 — Beehive online, green dot

> - **07-03:** 🎉 **BEEHIVE ONLINE IN THE APP (confirmed, green dot).** Root cause of the long-standing "Beehive Offline" was a stack of 3: mixed-content (local http from an https page), no auth token sent, and **CORS**. Fixed: Nabu Casa https URL + app sends bearer token + **HA `configuration.yaml` now has `http: cors_allowed_origins: [https://toro1-5rz.pages.dev]`** (Jeff added it via File editor, restarted HA).

Same day, the architectural fix that killed the whole bug class — `7a59848` (2026-07-03), "Route HA connection through a server-side /api/ha proxy (durable fix)":

> The app talked to Beehive directly from the browser, which meant fighting mixed content, CORS, and the Nabu Casa relay tripping browser fetch timeouts — the whole class of 'Beehive Offline / meters Waiting' problems. Irrigation and weather never had these because they go through Cloudflare Functions (server-to-server). Now HA works the same way.

And the Alexa win Jeff had been asking about for weeks:

> - **07-03:** 🎉 **Alexa now reads the REAL backyard weather** … "Alexa, what's the backyard temperature?" reads the live KTNWHITE21 value. The "Alexa's weather is always wrong" complaint is resolved.

#### 2026-07-09 — Blink day

> - **07-09:** 🎉🎥 **BLINK CAMERAS LIVE** (all 6) — removed stale `custom_components/blink` override, used built-in (blinkpy 0.25.6+). Full camera control (refresh/arm/snapshot/save-clip). Public-share safety (panic gated behind HA token). `loewenhome.com` + `www` LIVE + SSL. AT&T gateway: Beehive pinned to fixed `.66`.

Blink is worth calling a win precisely because it was a long grind and the wrong theory was published twice before the right one. The chain: `dbc8fbe` (2026-06-25) surfaced the auth failure properly instead of retrying silently; `f3ae126` (2026-07-03) shipped a "dedicated cookie session" fix on the `empty_cookies` theory; `1f2cdec` (2026-07-03) then found the real answer and said so plainly —

> Found the real root cause by diffing blinkpy in the harness: Blink changed their OAuth signin to signal 2FA-required with HTTP 202 + tsv_state/tsv_methods fields. blinkpy 0.25.2's oauth_signin only recognizes the OLD 412 code… **Kept the dedicated-session tweak as belt-and-suspenders but corrected its comment (the cookie theory was the wrong diagnosis; the 202 handling is the fix).**

— and finally `9b29c1f` (2026-07-09), "Blink: record real root cause + official fix (blinkpy 0.25.6 / HA 2026.6.4); **our custom override is now the blocker**." The win was admitting that the custom fix had become the problem, and deleting it.

#### 2026-07-10 — Local AI camera detection live

> - **07-10 (coworker):** 🎉 **LOCAL AI CAMERA DETECTION LIVE** — CodeProject.AI 2.9.5 on beast (GPU YOLOv5, GTX 1050 Ti). 3 automations in `packages/hcc.yaml` (scan/notify/mute). Fixed: Windows Firewall port 32168 + `packages:` include directive in `configuration.yaml` (all old automations were ghost entities).

#### 2026-07-21 — CAR live, Family Login live

> - **07-21 (coworker):** 🚗🎉 **CAR section fully LIVE — mbapi2020 installed + verified end-to-end.** … **Confirmed by Jeff 2026-07-21: logged into `loewenhome.com` with the family password, CAR tab shows live data.**

Note the discipline recorded in the same entry: *"Jeff entered his own email/password/verification code directly — coworker does not type third-party account passwords into browser forms."*

#### 2026-08-05 / 08-06 — The first coworker handoffs actually paying off

This is the collaboration pattern working as designed: the cloud session writes a handoff doc for the thing it physically cannot verify; the local "beast" coworker session runs it against the real house; findings come back and change the code.

- `3322153` / `aa6566a` (2026-08-05/06) — **sewer overcharge verification**: *"Verified the 5 items from the cloud session's handoff doc against the real Beehive HA instance. Found a real recorder-retention gap… and that zero B-Hyve zones have recorded an 'on' event in 8 days of history, so `irrGalFromHistory()`'s fix has never actually fired yet (mechanically works, just unexercised)."*
- `fa8e153` → `5c41c8d` (2026-08-06) — **Electric SmartHub**: the coworker fired the exact WebSocket command against the real HA and found the feature shipped hours earlier was *silently non-functional*: wrong command name (`history/statistics_during_period` doesn't exist on Core 2026.8.0) and a `change` field that always reads 0. The cloud session then fixed it against the coworker's real data shape. A bug that would otherwise have shipped looking fine forever.
- `34d177f` → `6e24295` (2026-08-06) — **the two-repo deploy mystery**: *"both repos' own `CLAUDE.md` claimed to be the one Cloudflare Pages deploys"*; resolved by Jeff opening the app and seeing the new card. *"Toro-Timemaster- is a stale diverged mirror -- flagged permanently in CLAUDE.md so no future session wastes time developing there."*
- `4252086` → `0827617` (2026-08-06) — **irrigation GPM calibration**: the coworker ran isolated single-zone tests with a stopwatch and the real water meter; the cloud session replaced its estimates with measured numbers.

The delegation rule that made this possible was written on 2026-07-09, `bec7440`:

> Rule 13: proactively tell Jeff when a task/step is better done by his local Claude coworker (hands-on his PC/Beehive) — Blink install, HA entity reads, /setup, ESP32 flash, link verification, local file cleanup — while this cloud session owns app code + deploys + guidance.

#### 2026-08-06 — "It started."

`adcf16c` (2026-08-06), title: **"Mercedes remote start CONFIRMED WORKING from the app."** Body opens with two words from Jeff:

> Jeff: "It started."

The rest of that commit is a model of how to close a hard bug honestly, including naming its own earlier misstep:

> The diagnostic that cracked it, and the one to reach for first next time: sigpos_start (flash lights) is the only remote command requiring no PIN. It worked while every PIN-gated command failed. That single split proved the app, the Cloudflare proxy, HA, the VIN and the integration were all healthy and isolated the fault to the PIN in one step -- **after I had wasted effort on a false reading of the config-entry API.**
>
> …Credit where due: the whole thread started from Jeff noticing the real Mercedes app was prompting for a PIN.

#### 2026-08-10 — The satellite yard map on Jeff's real device

`1d6c109` (2026-08-10), "Record: satellite yard map confirmed working on Jeff's real device":

> Jeff's screenshot of the deployed app shows real Esri imagery of his actual property with the track overlaid, north arrow and scale bar - his verdict: it looks good. That confirms the one thing this session could never verify (imagery quality over White House TN)…

The `CHANGELOG_ARCHIVE.md` entry for 08-10 6:05 PM calls it what it was: **"✅ CONFIRMED WORKING ON JEFF'S REAL DEVICE."** The same commit keeps two honest caveats attached rather than celebrating clean — coverage reading 7 cells from 0 mows, and *"the track wandering over the house is ordinary consumer-GPS drift, not a rendering fault."*

#### 2026-08-10 — The best argument in the whole record

`d3749b9` / `CHANGELOG_ARCHIVE.md` 08-10 6:25 PM. Jeff asked a question, and the question was better than the design:

> Jeff asked: *"Won't the drift improve over time as it's making the history map of the yard?"* Thought it through honestly instead of saying yes — **and the answer was no, and the design I'd shipped would actively get WORSE.** GPS error is random and roughly zero-mean, so *averaging* repeated passes would converge on truth — but `mergeCoverage()` stored a **union of cells**, which only ever grows. Every drifted stray became a permanent cell, so over many mows the green would bloat outward into a ±5 m halo covering the house and driveway, never sharpening. **Jeff's question found that; I'd have shipped it.**

The fix — visit-counted cells, shading by confidence, dropping the *least-visited* cells at the cap rather than the oldest — was then proved by simulating six mows with ±4 m drift: *"confirmed cells went 0 → 156 → 246 → 293 → 316 … cells-seen-once fell 297 → 78, and per-mow cell growth decayed from +83 to +16 — i.e. it converges rather than bloating."* This is the collaboration working exactly the way Jeff said he wanted it to.

#### 2026-08-11 — "no surprises!!" — the full diagnostic sweep

`af6df04` and the 08-11 10:05 PM `CHANGELOG_ARCHIVE.md` entry. Jeff:

> *"Run all the diagnostic checks you got, to make sure there is nothing else broken or not working… no surprises!!"*

Result: 33/33 suites, and the light-mode contrast bug class (Pending Item 17) genuinely closed rather than reported green —

> The old note guessed "most are probably fine on dark surfaces" — so I measured instead of guessing: wrote a contrast auditor that composites every translucent ancestor to get each element's REAL painted background… **19 confirmed failures on genuinely light surfaces** — worst were the credential save/error messages at **1.09-2.9:1**, i.e. "Wrong password" and "Save failed — storage full" were effectively invisible in light mode, exactly the messages you most need to read.

It also caught its own tooling lying (see B.24) and ended with a plainly honest close-out: *"Honest status on the rest of the Pending list: nothing else is app-side… No app-code item is left open."*

#### 2026-08-15 — The camera pipeline, verified with photographs

`c5a6aab` / `docs/beehive/camera_pipeline_VERIFIED_2026-08-15.md`. This is the strongest verification artifact in the project:

> **This is the permanent record.** Every claim below is backed by a timestamp from HA's own history API or a photograph of the physical Apple TV screen, captured by a camera pointed at it while the events happened. Nothing here is a component check or an assumption. **If a future session doubts whether this was ever set up and proven: it was, on this date, as follows.**

Measured, not asserted: motion → AI detection **8 s**; motion → popup on the Apple TV **4.7–6 s**, photographed three times; detection → phone push + Fire TV popup + cooldown + archive **≤1 s**. The verification rig was *"A Razer Kiyo Pro on the beast, aimed at the Apple TV, capturing a frame every ~0.9 s."*

Day before, `9426623` (2026-08-14) had cracked the thing that had defeated several sessions — **"SOLVED: Apple TV camera popups - linked_doorbell_sensor is the key (motion alone never interrupts the screen)"**:

> **`linked_motion_sensor` alone is NOT enough.** Motion earns a phone notification but does NOT interrupt the TV. HomeKit reserves the picture-in-picture screen takeover for **DOORBELL** events… **Fix: point `linked_doorbell_sensor` at the SAME motion sensor.**

#### 2026-08-16 — Building the thing that makes this archive possible

`1d1ebdb` (2026-08-16), "Build the HCC MASTER RECORD - permanent searchable memory of the whole project." Born directly out of the crisis in Part C.6, it is nonetheless a genuine win: 196 files, 124 MB, including `HCC_DECISIONS_LEDGER.md` ("81 decisions in Jeff's own words - START HERE"), 6,896 messages verbatim, all 635 commits with diffs, 25,547 tool events, 187 images — plus a scheduled task rebuilding it daily at 5:45 AM, and `Search-HCC.ps1` so it can be grepped from PowerShell.

#### A.2 The relationship documents themselves

The single most unusual artifact in this repository is that the *relationship* is version-controlled and marked un-deletable. `CLAUDE.md` Mandatory Rule 11, sub-clause (present at tip, `/tip/CLAUDE.md:58`):

> **PROTECTED — NEVER trim or compress:** "Jeff's Message", "The Working Relationship", these "Mandatory Rules", and the "Debugging Protocol" below. These come FIRST, before any technical work, every session. Compression only ever touches history/changelog/reference — never the relationship. **They are the point of the whole project.**

That clause survived every restructuring, including the 260 KB → 58 KB purge of 2026-08-16, where `fab5b30` explicitly records: *"Every PROTECTED section (Jeff's Message, The Working Relationship, Mandatory Rules, Debugging Protocol) was asserted byte-identical before writing."*

---

## PART B — THE BAD

Every documented mistake, in rough chronological order, with the confession quoted as written. Where a mistake cost Jeff money, time, or hardware, that is stated.

### B.1 The great blank-page incident — 2026-06-23

The founding screwup, and the only one promoted to a numbered Mandatory Rule.

`a973c8f` (2026-06-23), "Fix fatal JS syntax error — remove stray `<script>` tags inside script block":

> Two bare `<script>` tags were embedded inside an already-open `<script>` block (lines 2488 and 2688). The HTML parser passes them as literal text to the JS engine, which throws a SyntaxError — killing ALL JavaScript on the page. That's why the whole app went blank.

Written into `CLAUDE.md` at `90e556e` as **Mandatory Rule 8**, and still present at tip more than seven weeks later:

> 8. **NEVER put `<script>` or `</script>` tags inside the JS block of index.html** — this causes a fatal blank page (**the great blank-page incident of 2026-06-23**). The JS block is lines 1209–2834. Raw text only inside it.

The cost was total: the app was dead, not degraded. **INFERRED:** given the 06-23/24 crisis message arrived the same night, this is very likely one of the failures Jeff meant by *"You are just fine leaving something totally messed up and not even close to correct"* — but the record does not explicitly link them, so this is inference, not memory.

### B.2 Everything else broken at the same time — 2026-06-23

The blank page was not alone. From `CLAUDE.md` at `90e556e`, "Session 2026-06-23/24 (The Big Fix Session)":

> 4. **All modal buttons silently broken** — CSS used `.modal-overlay.open{display:flex}` but HTML uses `modal-ov` and JS sets `modal-ov show`. The CSS never matched so modals never opened. **LOG MOW, LOG SERVICE, UPDATE HOURS were all broken.**
>
> 5. **Modal box unstyled** — CSS defined `.modal{...}` but inner div uses `modal-box`. No background, rounded corners, or padding.
>
> 6. **`.mbtns`, `.mbtn.secondary`, `.btn-green` missing** — Cancel buttons invisible, no button row layout, green buttons unstyled.

`da1320c` (2026-06-23) states the user-facing consequence flatly: *"Every Log Mow / Log Service / Update Hours button was silently doing nothing."* Meanwhile `c8e729c` (2026-06-23) records that **all four API endpoints were returning errors because no Workers existed at all**, and `98b8dca`/`c6f3df8` record that the sensor pipeline was dead because the code read `env.HCC_KV` while Cloudflare Pages had the binding as `MOWER_KV` — *"This was the root cause of all sensor readings showing `—` and `0.00V`."*

There is also a small monument to flailing in this window: `b629c83` (2026-06-23), **"Revert hours.js to original — undo KV refactor that may have broken sensor read."** The words *"may have"* are the record admitting it did not know.

### B.3 Jeff's real hours lost to a localStorage wipe — 2026-06-23

`53eb7d4` (2026-06-23), "Restore Jeff's real hours — update default state and sensor baseline to 5.9h":

> Backup from June 22 shows 5.9 engine hours. **Browser data was cleared which wiped localStorage.** Default state now starts at 5.9h so the correct number shows on every fresh install.

The record does not say **who** cleared browser data or why, and does not assign blame. What it does establish is the vulnerability that would bite again on 2026-08-10 (B.16): the mower's hour meter — the single number Jeff cares most about — lived in one unbacked `localStorage` blob.

### B.4 The shared-`AbortSignal` timeout regression — Jeff had to call it out — 2026-07-03

This is the mistake that produced the Debugging Protocol. `0f44d9d` (2026-07-03), "Fix false 'Beehive Offline': per-attempt timeout, not a shared 2.5s budget":

> **Regression I introduced when wiring Nabu Casa:** checkBeehive built ONE `AbortSignal.timeout(2500)` and reused it across all candidate fetches, so the 2.5s was a total budget for every attempt combined — and once elapsed, later fetches aborted instantly. Over the Nabu Casa remote relay a single /api/ call often takes >2.5s, **so a perfectly reachable HA was reported offline (red dot), which also stopped the meters from loading.**

The Change Log version (`2fdef21^:CLAUDE.md`, 07-03) is blunter: *"🐛 **Fixed a self-inflicted false 'Beehive Offline'**."*

The part that matters for trust is in the Debugging Protocol itself (`f668301:CLAUDE.md`, 2026-07-03), step 1:

> **Reproduce/verify on MY end first.** … Run the **Playwright harness** with **mocked data** to reproduce the failure and prove the fix… **I did this AFTER Jeff called me out on the timeout bug — it must come FIRST.**

Cost: Jeff spent time debugging his own network and his own Home Assistant for a fault that was in code shipped hours earlier.

### B.5 The stale-cache saga — three wrong root causes before the right one — 2026-06 → 2026-07-21

The single longest-running self-inflicted bug class. Fixes that were announced and did not stick:

- `4f96d09` (2026-06-23) — "stale service worker cache"
- `8497827` (2026-06-23) — "Bump service worker to hcc-v3 — force cache clear"
- `19dd459` (2026-06-26) — "Service worker: network-first for HTML so fixes always land"
- `24df1fc` (2026-07-10) — "Fix Windows stale cache"
- `173270a` (2026-07-20) — "Fix root cause of recurring stale-cache bug: no-cache service-worker.js"
- `70dba84` (2026-07-21) — "Fix stale HTML: no-cache headers + SW cache bypass"

`173270a` claimed root cause. It was wrong — or rather, one third right. `6f517ac` (2026-07-21) corrects it:

> The 07-20 fix only addressed browser Cache-Control; Cloudflare's edge was independently caching service-worker.js via cf-cache-status: REVALIDATED, **and index.html had no SW registration at all for new visitors.**

The full confession is in the Change Log (`2fdef21^:CLAUDE.md`, 07-21):

> **Real root cause:** standard `Cache-Control` in `_headers` only governs the *browser's* cache. Cloudflare's CDN edge caches JS assets independently… and was never told to stop. Separately, **`index.html` had NO service worker registration call at all** — new visitors never even got a SW installed, so the "network-first" fetch logic already in `service-worker.js` was moot for them. …**Lesson for any future cache/stale-content bug: check `cf-cache-status` on the live custom domain, not just `Cache-Control`.**

Cost to Jeff: weeks of opening the app and being shown an old build, then reporting a bug that had already been "fixed."

### B.6 The Mercedes PIN round-trip — added, removed, mis-documented, corrected, corrected again — 2026-07-24 → 2026-08-06

Five commits, two of which explicitly correct the previous one. This is the clearest documented case of Claude confidently telling Jeff a wrong fact and then telling him a *different* wrong fact.

1. `eeaa0b7` (2026-07-24) — **"Add Mercedes PIN prompt for remote start, unlock, and other PIN-required commands."** PIN saved in `localStorage`, prompts across the CAR section.
2. `c73e32e` (2026-07-24), the *same day* — **"Remove app-level PIN prompts — mbapi2020 handles PIN from integration options."** *"The PIN is configured in Beehive (HA > mbapi2020 > Options), not in the app."*
3. `473f122` (2026-08-06) — **"CLAUDE.md: correct the Mercedes PIN claim - the options dict was empty."**

   > Jeff worked out from the real Mercedes app that unlock and remote start demand a PIN, and suspected HA wasn't supplying it. **He was right.**
   >
   > CLAUDE.md asserted the PIN was 'stored in mbapi2020 integration options in HA - services auto-use it', and the app's PIN prompts were removed on 07-24 on that basis. The mechanism is correct… **but the fact was not**… So **every PIN-gated service (doors_unlock, engine_start, windows_open, sunroof) has been firing with no PIN and getting rejected upstream** … That is the whole reason those features looked broken.

4. `e3d6de2` (2026-08-06) — **"Mercedes PIN: real root cause is RIS_PIN_INVALID, not a missing PIN."** Opening line: **"Corrects the previous commit, which was wrong."**

   > I checked the PIN with HA's config_entries/get over the WS API, saw options come back empty, and told Jeff the PIN had never been entered. **It had.** HA's config-entry list API simply does not return data or options -- they're internal. **The tell I missed: `data` came back empty too, which is impossible for a loaded integration running 49 live entities.**

5. `eb0852f` (2026-08-06) — a third reading, from Jeff's own screenshot of the Mercedes app: an *attempt limit between manual ignition cycles*. *"This is very likely what the RIS_PIN_INVALID seen in HA's log actually was… Not proven yet, so both readings are recorded."*

Cost: **two weeks (07-24 → 08-06) of dead remote start, unlock, windows and sunroof**, caused by removing working prompts on the strength of a `CLAUDE.md` sentence nobody had verified. `adcf16c` states it: *"these have been dead since the 07-24 change that removed the app's PIN prompts on the strength of a CLAUDE.md claim that turned out to be wrong."*

### B.7 Three wrong hardware recommendations in a row — the garage door part — 2026-08-05

`7f73148` (2026-08-05), "Add permanent rule: never name a product/model from memory unverified":

> **Jeff called out three wrong-in-a-row hardware recommendations on the garage door part today** -- ratgdo board, then SONOFF Basic, then had to be corrected to SV **before he found the actually-right MINI-D himself.** Logging this as a protected standing rule alongside the Debugging Protocol: no specific product/model gets named unless it was verified via a real search in the current session.

The intermediate correction, `4bfacf3` (2026-08-05):

> Jeff pushed back that "SONOFF Basic" wasn't specific enough among SONOFF's confusing relay lineup -- **and it was actually the wrong pick: Basic-series switches are mains-voltage (110-240V) and need modification for a low-voltage garage circuit.**

And `f015867` (2026-08-05) — the right answer, found by Jeff: *"Jeff found a better match than the SONOFF SV plan: MINI-D has real Matter support… Verified all of this via research before committing."*

The rule as it stands at tip (`/tip/CLAUDE.md:150`), marked PROTECTED:

> **8. NEVER name a specific product/model to Jeff from memory (PROTECTED — Jeff's standing rule 08-05, added after the garage door incident).** … three guessed answers on one part, in a row, before Jeff found the actually-correct SONOFF MINI-D himself. **He does not have time to be the fact-checker on my hardware recommendations.** … If I haven't checked, say "let me check" — never let a plausible-sounding model number stand in for one that's actually confirmed.

**Near-miss cost:** had Jeff bought the SONOFF Basic as recommended, it would have been the wrong voltage class for the job.

### B.8 Telling Jeff his water meter was broken when it wasn't — 2026-08-01

The clearest case in the record of Claude sending Jeff to make a phone call he did not need to make.

`593ddf7` (2026-08-01) — **"Confirm water pit-radio fault via live irrigation+shower test"**:

> Radio heartbeat is normal but the register is stuck rebroadcasting a stale reading -- proven against the raw rtlamr2mqtt decoder log, with the gas meter on the same dongle ticking normally in the same window. Recurrence of the 07-28 fault with a different symptom. **Jeff needs to call WHUD again.**

Note the test that produced this: per `CHANGELOG_ARCHIVE.md`, *"triggered a B-Hyve irrigation zone via HA + **Jeff took a real shower**, both running simultaneously for ~47 min."* Jeff physically participated in generating the wrong conclusion.

`fb5068c`, **the same day** — "Retract water-meter fault diagnosis -- meter is healthy, no WHUD call needed." The full confession in `CHANGELOG_ARCHIVE.md`:

> **CORRECTION to the entry below — the water meter was never faulty. False alarm, root-caused and fully retracted same day.** The "stuck register" conclusion from the irrigation+shower test was wrong — **it just wasn't watched long enough.** … **Real root cause:** `rtlamr2mqtt` runs `rtlamr` with `-unique=true`, which only re-publishes a reading when the decoded value itself changes… **The `sensor.water_meter_last_seen` heartbeat pinging normally the whole time was a real signal I misread — it confirms every RF catch, not that the *value* had refreshed, and I conflated the two.** … See the entry directly below for the original (incorrect) diagnosis, **kept for the record rather than deleted.**

This lesson is now a hard-won invariant at the top of `docs/SESSION_START.md`:

> **A meter reading `unknown`/`unavailable` is NOT a fault.** … gaps of 20 min to 3 hours are normal… **This caused a false WHUD alarm on 08-01. Watch longer.**

### B.9 The glassmorphism redesign — believed solid, wasn't, and told Jeff it was fine — 2026-08-06

`CHANGELOG_ARCHIVE.md`, 08-06 (Luxury Glass Overlay redesign — attempted, then fully reverted per Jeff):

> Built it in stages over several commits (frosted glass, gradient-ring borders, warm typography, softened/darkened host photos, subtle tilt/edge-fade on every element) and **believed it was solid after passing lint/smoke-test and my own mocked-data Playwright screenshots. It wasn't.** Jeff sent 5 real screenshots from the live app with real data and the visual result was bad… **my own testing had used short placeholder values ("— gal") which never made the chip row wide enough to visibly hit that content, so I missed it entirely, then wrongly told Jeff Water was fine when it wasn't (never actually checked it against real long data).** Attempted two rounds of fixing the darkening and still hadn't nailed it when Jeff said stop. **Reverted index.html/service-worker.js/CLAUDE.md entirely back to commit `7cccc59`**.

The lessons recorded, verbatim:

> (1) test every visual claim against realistic LONG real-world data from the start, never short placeholders…; (2) **get Jeff's visual sign-off on one card before rolling a treatment out to all of them**; (3) …treat this as a clean slate, not a continuation.

Cost: an entire multi-commit redesign thrown away, and Jeff having to say *stop*.

### B.10 Stripping Jeff out of his own photographs — 2026-08-06

`595ec23` (2026-08-06), "Put Jeff back in his own photos":

> **Correcting a real mistake: I stripped the person out of the irrigation and yard heroes assuming they were stock models. They're Jeff.** Both regenerated from the pre-edit originals with him kept exactly as he was -- same face, expression, LawnCareLife shirt, watch, thumbs-up pose -- and only the printed title, tagline and fake icon rows removed. **Check before removing a person from a personal app's photos.**

Promoted to a PROTECTED `CLAUDE.md` section the same day — `db9ffcc` (2026-08-06), "CLAUDE.md: record which photos are real, and never to strip Jeff out of them":

> **Learned by getting it wrong.** I regenerated the irrigation and yard heroes and removed the person, assuming a stock model. **It was Jeff, in his own app.** New PROTECTED section records:
> - hero-irr.jpg and hero-yard.jpg contain Jeff himself. **Never remove him.**
> - images/zones/ are real photographs of Jeff's actual yard. Don't regenerate them.
> - The couple in the old hero-car.jpg were not Jeff and Angela.
>
> **Rule: if a photo has a person or a real place in it, confirm what it is before altering it.**

This is arguably the most *personal* screwup in the archive — an app built for one man, and the man was edited out of it.

### B.11 Months of layout work spent dodging fake text that was never real — 2026-08-06

`45485f0` (2026-08-06), "Regenerate the three utility photos without the fake marketing copy":

> **This is the root-cause fix for every utility-card fight in the history below.** Those photos were AI marketing mock-ups: half of each frame was a fake ad -- "WHITE HOUSE UTILITIES COMMAND CENTER", "SMART MEASUREMENT. EVERY DROP COUNTS.", the SAFE SUPPLY / USAGE INSIGHTS icon strips. **Every constraint in this area (the 46% width, the per-card hand-calibrated top values, the collisions, the first attempt's full revert) existed only to dodge text that was never real.**

Jeff's own words on why it looked wrong (`ecf6f25`, 2026-08-06):

> Jeff: "I hate those logos that are on the picture. I don't mind the text but it looks awful with them right next to the real icons."

And the worst offender (`1eba07f`, 2026-08-06):

> hero-cameras.jpg was the worst offender of the lot: a 1300x2042 portrait mock-up of **the app's OWN interface**. A fake gold "HOME GUARDIAN / SMART SECURITY SYSTEM" title, a fake "ALL SYSTEMS READY - PROTECTED - 6 CAMERAS" shield panel, and six empty dummy camera tiles… **sitting directly above the app's real camera grid. Exactly the "fake stuff next to my real icons" Jeff objects to.**

Cost: an unknown but substantial number of layout commits across weeks, all working around a problem that could be deleted. Also, the fix was cheap once identified — *"~9 cents per image, first try, no retries"* — which makes the preceding weeks worse, not better.

### B.12 Twelve camera tiles instead of six — 2026-08-03

`83a23cd` (2026-08-03). Jeff reported *"camera views in the app are all messed up"* and asked Claude to figure out what the coworker broke. The changelog records the answer, and refuses to take the easy out:

> **Not the coworker's mistake** — the HA-side entities are legitimate and needed for their fix; our app's camera-listing code just had no concept of "internal helper camera" and needed one.

Root cause: `loadCameras()` and two other call sites did an unfiltered `entity_id.startsWith('camera.')` match, so six new `*_clipframe` helper entities *"started rendering **12 tiles instead of 6**, mixing real live cameras with static internal helper stills… and calling `blink.trigger_camera` on all 12 during 'Refresh All' (silently failing on the 6 fake ones)."*

### B.13 The wall-iPad "stuck sideways" saga — wrong framing, an unverified guess shipped live, and finally the real culprit (its own edit) — 2026-08-08

Three consecutive `CHANGELOG_ARCHIVE.md` entries and three commits, in the order they happened.

**Round 1** (`9da43a5`) — root-caused to Guided Access / rotation lock, and a speculative CSS auto-rotate shipped as a "backstop." The entry is candid about what it could not prove:

> **Full honesty on verification, not overclaiming a 4th time:** I confirmed the CSS mechanism itself fires correctly… but the real underlying failure depends on exactly how iOS Guided Access composites a frozen-orientation Safari canvas onto a physically-rotated screen — a step that doesn't exist in headless Chromium at all, **so I cannot verify from this sandbox whether `rotate(90deg)` is the correct compensating direction vs. `rotate(-90deg)`.**

The phrase *"not overclaiming a 4th time"* is the record admitting it had already overclaimed three times in that thread.

**Round 2** (`24136c7`) — Jeff sent three fresh photos still showing it sideways:

> **Jeff's response reframed the whole problem correctly: "it worked perfectly before, you can't say it's a limitation of the app or the iPad."** That's the key fact — if it was genuinely working before, this is a regression, not an inherent iOS/Guided-Access constraint, **and I was wrong to frame it that way.** …reverted the speculative CSS auto-rotate transform added in the entry below — **it was shipped as an explicitly unverified guess**… and leaving an unproven guess live while trying to find an actual regression only adds a confound. **Status: genuinely unsolved.**

**Round 3** (`bb9d1cf`) — the culprit was its own commit from earlier the same day:

> **Jeff cut through all the Guided-Access/rotation-lock theorizing with the one fact that actually mattered: "It worked perfectly before the picture edit."** That sent me straight to `git log` instead of more guessing — and the "picture edit" is obvious in hindsight: commit `5d22cf7`, **my own fix from earlier in this exact conversation**… That commit landed, and the sideways reports started right after — **a timeline I had in front of me the whole time and didn't check first.**

And, unusually, an admission that the story still doesn't close:

> **Honest gap: I still don't know the exact mechanism** by which a `max-height` change on hero photos could cause the whole page's nav bar to render vertically — that's a real unanswered question, not a satisfying root-cause story — but Jeff's own timeline… is the strongest signal I have.

One good detail from the same thread: Claude caught a discrepancy in Jeff's evidence rather than silently trusting it — *"their status-bar timestamps (4:54-4:55 PM) were EARLIER than the ones that had shown it fixed (9:17-9:19 PM) — flagged this to Jeff rather than assuming the photos were current."*

### B.14 The fix that cut Jeff's head off — 2026-08-11

`e5d57f4` and `CHANGELOG_ARCHIVE.md`, "my own hero fix cut Jeff's head off the yard photo":

> Jeff, confirming the sizing fix landed: *"You got it they are rendering correctly now, however my head is cut off in the yard hero pic"* — then, narrowing it: *"it's only in the iPad landscape that it is cut off."* **This was a direct side effect of the fix in the entry below, not a pre-existing bug.**

Measured rather than guessed: *"his hair starts at image row ~22 of 851 — essentially zero headroom."* The candidate crop values were quantified (`center center` cut −94 px into his head at 1194 px, −145 px at 2560) before choosing `center top`. Resulting permanent rule:

> **Rule for future sessions: never centre `.sec-hero-yard` — Jeff is in that photo and sits hard against the top edge.**

### B.15 🚨 The localStorage blowout that reset Jeff's hour meter — 2026-08-10

The most serious app-side data-loss bug in the record, and the confession is explicit from the title onward. `b568a4b` (2026-08-10):

> **Jeff's hours reset to 5.9 - the factory default baseline - meaning his whole saved state was wiped. Root cause is mine, from earlier today.**
>
> The entire S object (hour meter, service log, maintenance history) is persisted as one localStorage blob. When I added the cumulative coverage map I put it in that same object, and syncYardCoverage then wrote the full server coverage map - tens of thousands of cells - into it on every sync. That pushed the blob past the storage quota, save() threw, **and the catch silently swallowed it**, so hour updates stopped persisting; once the entry was lost the boot path fell back to DEFAULT_STATE and took his real hours with it.
>
> **Server-owned, re-downloadable, unbounded data does not belong in the user's core state blob.**

The changelog headline for the same event: **"🚨 MY BUG — the coverage map I built blew out localStorage and reset Jeff's hour meter to the 5.9 default."** Jeff's words: *"Why are my hours now set at 5.9, the real actual hours are 12.1."*

The fix was three-part (coverage moved out of `S`; a migration to strip legacy fields off already-bloated devices; a tiny `toro21200_core` mirror key so hours can never again be silently reset) and was proved by deleting the main blob and reloading. But the honest close is what matters:

> **Jeff still needs to re-enter 12.1 once via SET HOURS** — the mirror protects from here on, but it can't recover a value that was already lost before it existed.

Cost: Jeff's real engine hours, permanently unrecoverable from the app, re-entered by hand.

### B.16 The next storage time bomb, found only because Jeff asked — 2026-08-11

`86b47e6`. Jeff, after re-entering 12.1: *"Is everything fix and 💯 correct… make sure we don't have any other situation like this out there waiting…"*

> **(1) Audit — found and fixed the next instance of the exact same bug class.** … The live time bomb: **service photos were stored inline in `S.log`** (`entry.photo`, a base64 data URL)… **so ~20-30 logged photos would have blown the same quota and wiped the hour meter all over again.**

The same audit caught three unguarded `x.hrs.toFixed(1)` calls where *"one malformed log entry would have thrown and taken out the whole dashboard."* Jeff's question found the second bomb, exactly as his question found the coverage-union flaw the day before.

Also in that entry, a self-inflicted regression caught mid-fix:

> **Caught a self-inflicted regression mid-fix:** irr/car also carry the `.sec-hero` class, so the new explicit height captured them too and squashed them from 796→560 px; restored their aspect-driven sizing explicitly.

### B.17 The date/time discipline failure — 2026-08-10

`a2779b5` (2026-08-10), "Add permanent rule: check real date/time, never assume":

> **Jeff caught a real discipline failure** - referencing "late at night" and a wrong date without ever checking, when it was actually mid-afternoon. **Verified the sandbox clock is genuinely accurate** (matched Jeff's real stated time within a minute once converted UTC->Central), **so this was never a missing capability.**

Jeff's verbatim demand, preserved as Mandatory Rule 14 (`/tip/CLAUDE.md:73`):

> Jeff, verbatim: *"Get you damn times right... I want a current timestamp added to the session anytime it is picked up and I want the current date and times tracked."*

The rule's own verdict on the failure: *"**this was never a missing capability, it was a discipline failure.**"* `docs/SESSION_START.md` notes it *"has been broken twice."*

### B.18 The months-long hour-meter miss — the sensors were never faulty, and Jeff bought replacement hardware

The single most expensive documented failure in the project, and the one with the clearest cost to Jeff's wallet.

`CLAUDE.md` Rule 13 exception (`/tip/CLAUDE.md:70`), verbatim:

> **Why this changed, and it matters:** the hour meter — the entire reason Jeff built the sensor box — **never worked for months across 5 real mows**. The box sent `hours_seconds`; the app read `d.hours`; **nothing converted, so the sensor contributed exactly 0.0 hours every sync while Jeff re-entered them by hand. Jeff was told the sensors were faulty and bought replacement hardware; they were fine, and had been recording 6.3 km of real mowing the whole time.** Root cause of the long miss is **structural, not carelessness**: this cloud session has no outbound network (`EGRESS_BLOCKED`), so it can never fetch a real payload, and the `.ino` is not in this repo — it was coding against this file's *description* of the firmware, which was **wrong**.

The same admission, independently, in `firmware/mower_hours_esp32/README.md`:

> For months the hour meter didn't work. The box sent `hours_seconds`, the app read `d.hours`, and nothing converted between them — 5.5 hours of real runtime and 6.3 km of real mowing went unrecorded across five mows. **Jeff was told the sensors were faulty and bought replacement hardware to fix what was a field-name mismatch.**

**This is the "hardware re-bought" claim from Jeff's archive request, and it IS independently evidenced in git** — twice, in two files, in Claude's own words. What is **NOT** in the record is *what* he re-bought or *what it cost*. No price, SKU, or receipt for the replacement mower-sensor hardware appears anywhere in the repository. **INFERRED:** given the ESP32/MPU6050/GPS class of parts involved, the sum was likely small in absolute terms — but the record is silent, and the waste was total regardless.

The discovery, from the coworker's findings doc `docs/mower/gps_firmware_coworker_findings_2026-08-11.md`:

> ## ⚠️ FIRST: `CLAUDE.md`'s "Sensor / ESP32 Hardware" section is wrong
> **Neither statement matches the firmware.** … It **never sent `source`, never sent `engine_running`, and never sent `hours`.** Confirmed against all 239 logged readings… **Please correct that section — the server-side design below was built on the description, not on the device.**

And:

> **Impact:** `S.hours = S.hoursBaseline + <sensor hours>` has only ever been the baseline. The box is currently holding **19,890 s = 5.53 h** of real runtime that has never reached the app. **This is the actual reason Jeff's hour meter kept drifting from the physical meter and had to be re-entered by hand.**

The traceable origin of the wrong description is the very first `CLAUDE.md`, `e8f0312` (2026-06-23), which asserted *"The sensor box is a custom ESP32 running **ESPHome** firmware"* and *"**ESPHome firmware file:** `beehive/esphome/hcc-mower.yaml`"*. By `90e556e` (2026-06-24) that had been half-corrected (*"The ESP32 runs the `.ino` Arduino firmware — NOT the ESPHome YAML"*) but the **posting-cadence** description — every 90 s while running, 5-min heartbeat when off — was never true and survived until 2026-08-11. `d18db7b` names it:

> Also corrected CLAUDE.md's "Sensor / ESP32 Hardware" section, which described a posting cadence the firmware has never had. **The server logic above was built on that wrong description — it is the root cause of the months-long hour-meter failure**, so it is now marked do-not-restore and carries the verified field contract.

### B.19 Every downstream mower bug the wrong description caused

Because the server half was written against fiction, a chain of fixes were all built on sand and had to be redone. Each is its own documented mistake:

- **`60c5d28` (2026-08-10)** — heartbeats overwriting the whole mow: *"the entire mow's real telemetry (hours, RPM, distance, GPS track) got wiped… **This defeated the whole point of the sensor system.**"*
- **`d18db7b` (2026-08-11)** — that 08-08/08-10 "fix" **never engaged at all**: *"The box sent **neither field**, so `isHeartbeat` was **always false**"* — and *"**Mow history had NEVER recorded a single mow.**"*
- **`d18db7b`** — coverage was mapping the *parked* mower: *"the box reports every 5 min while parked, so a standalone lat/lon was injected ~288x a day; **the whole map had become a 16.7m x 12.5m blob at the garage**, and the visit-count shading rendered that drift as the most confirmed ground on the map."*
- **`d18db7b`** — a `0 !== false` truthiness bug: *"Old firmware sent the number 0 for 'no fix' and 0 !== false is true, so no-fix 0,0 coordinates were merged as real. **That genuinely happened — a '0,0' cell (Null Island) is sitting in KV** and needs deleting by hand."*
- **`d18db7b`** — *"**Stop serving the device secret.** GET is public and echoed the whole stored body, and logEntryFrom() copied it into every log row."* A credential leak in a public endpoint.
- **`662928a` (2026-08-11)** — the coverage leak was *"only half-fixed this morning"*; the parking spot was still gaining a visit every five minutes. `yard_coverage` had to be **deleted entirely**: *"all 96 cells were a 16.7 × 12.5 m box = the parking spot, plus the `0,0` Null Island cell."*
- **`c63142b` (2026-08-11)** — a dead sensor still serving stale readings: *"a box with no MPU attached was still serving pitch and roll of -35.3 — the classic both-axes-identical value you get from reading an absent I2C device. The raw sensor log proved the box had correctly sent neither field, so **the staleness was entirely mine.**"*
- **`077cc65` (2026-08-11)** — *"'GPS Speed' was showing lifetime distance ÷ lifetime hours — an all-time average, labelled as current speed, so a switched-off mower read 0.7 mph."*
- **`333adcf` (2026-08-10)** — a whitelist silently dropping real data: *"if the box sent `voltage` instead of `battery`, the log silently recorded null and **that reading was lost forever**."* Found only because Jeff asked for proof: *"I want to confirm that everything the mower sensors pick up and the gps is building a history of everything that mower does **if it farts 💨 it picks it up**."*
- **`7adc108` / `CHANGELOG_ARCHIVE.md` 08-10 3:55 PM** — the exploding yard map, and an admission of two prior wrong answers: *"Root cause of the garbage map — **a genuine math flaw, not user tap precision (which is what I'd wrongly told him twice)**."* The old "Pin Track to Photo" derived scale from only the track's first and last GPS points, so a mow that ended where it started produced a near-zero denominator and *"renders at 10-100× true size, spraying across the road and through the house — **exactly** Jeff's screenshots."*
- **`docs/mower/gps_firmware_handoff_2026-08-10.md`, TASK 2** — *"**Jeff believed this already existed and was rightly annoyed it didn't.** If WiFi is weak at the far end of the yard, those readings are currently **lost forever**."*

### B.20 A password pasted into a README about not leaking passwords — 2026-08-11

From the 08-11 evening coworker entry in `CHANGELOG_ARCHIVE.md`:

> **A credential scan of the staged diff then caught me pasting that same password into a README *about not leaking it*.**

The related discovery in the same entry, worth keeping for its own sake:

> `strings` is not installed on this PC and returns a silent false "clean" on a binary — `grep -a` is the check that works, and it caught that the compiled `.bin` holds the WiFi password in plaintext.

### B.21 The network-map identity churn — 2026-08-13

A single laptop's identity was published, retracted, republished, and retracted again inside one evening:

- `902d0dc` — ".173 DellMasterBed is Jeff's Acer laptop, not the B570"
- `8aeacf0` — "laptops finally straight — JeffsLapTop IS the Acer…, DellMasterBed is the B570 **as originally recorded**"
- `7f38015` — "DellMasterBed is literally a Dell - Angela's 2nd office computer (per Angela). B570 back to shelf-spare status"
- `793b949` — ".173 is the B570 after all - Windows name inherited from Jeff's old Dell"

And a flatly-labelled double error, `2aca121` (2026-08-13): **"Sylvania plugs are WiFi Tuya (.199/.200/.202/.205) - Echo Dot guess and Bluetooth-only verdict both wrong, corrected."**

**INFERRED:** the churn reads as a session publishing conclusions from weak evidence (self-reported hostnames) faster than it verified them. The record shows the corrections but does not editorialise on the cause.

### B.22 Alert fatigue — 48 hours of dead cameras, and nothing said a word — 2026-08-14

`eba1648` (2026-08-14) and `docs/beehive/alert_fatigue_fix_2026-08-14.md`. This is a security failure caused by a UX failure.

> ## The real problem, found by accident
> Chasing an Apple TV question revealed that **the entire camera pipeline had been dead since Aug 10 11:16** — zero motion events across all six cameras for 48 h. Root cause was NOT a bug: **Jeff had the Blink system disarmed, because the notifications never stop.**
>
> That is the actual failure loop worth fixing:
> > too many alerts -> Jeff disarms -> ALL camera automation silently stops -> no security at all
>
> **A disarmed Blink produces no error anywhere.**

The trigger, in Jeff's words: *"I don't need motion in the garage at all"* — the mains-powered garage camera *"fired 6 times in 7 minutes while he was simply working in there."*

This is now a standing correction every session must read before proposing Guardian work (`docs/SESSION_START.md`):

> **Alert fatigue is a security failure, not an annoyance.** Too many alerts → Jeff disarms Blink → every camera automation silently stops → no security at all, with no error anywhere. **It already happened once (48 h dead, Aug 10–14).** Any change that increases detections must be paired with a suppression story.

Cost: **48 hours with no security coverage on a house**, discovered by accident while working on something else.

### B.23 Nine Home Assistant add-ons exposed to Alexa voice control — 2026-08-14

`1f4e791` and `docs/beehive/alexa_exposure_cleanup_2026-08-14.md`:

> **NINE HOME ASSISTANT ADD-ONS ARE VOICE-CONTROLLABLE — fix this first** … These are Supervisor add-ons, not home devices. **"Alexa, turn off Z-Wave JS" would take down the Zigbee/Z-Wave stack**; Studio Code Server is how Beehive gets edited. **Alexa fuzzy-matches names, so a misheard command can plausibly hit one.**

Found because *"Jeff spotted duplicate devices in Alexa."* The commit that records the HomeKit policy calls it by name: `18ff039` — *"never expose add-ons like the Alexa mess."*

### B.24 Claude's own audit tools lying — 2026-08-11 and 2026-08-15

Twice the record catches its own instrumentation producing false results:

- 08-11 (`CHANGELOG_ARCHIVE.md`): *"**Also caught my own tool lying:** the button audit reported 6 failures that were false — it only read `backgroundColor`, and those buttons use `linear-gradient`, so it fell through to the parent."* And earlier in the same entry, two red tests that were *"stale tests, not app bugs"* whose Playwright error message (*"Execution context was destroyed"*) sent it chasing *"a phantom `location.href` first."*
- 08-15 (`7a1d250`): **"Also corrects two of the audit's own findings"** — *"`/api/irrigation` is **not** dead code (it's a fallback…), and the '15/15 failing Actions runs' all predate the 08-06 disable, so nothing is failing now."*
- 08-08 (`CHANGELOG_ARCHIVE.md`): *"Two apparent bugs from an early pass turned out to be **false positives from my own test script**, not real bugs — worth recording so it isn't re-investigated: `hccSection('irr')` silently no-ops (the real id is `'irrigation'`)… and the 'truncated' Rain Delay text was my mock data using full sentences the real code never produces."*

### B.25 The self-inflicted AI feedback loop — 2026-08-15

`docs/beehive/camera_pipeline_VERIFIED_2026-08-15.md`:

> 1. **Feedback loop** (self-inflicted that morning): the HomeKit image swap also repointed the `image_processing` sources, **so the AI scanned its own annotated output and detection went dead while every health check read green.** Fixed: scanners on `camera.*_clipframe` (clean input), HomeKit on `camera.ai_*` (annotated output). **This split is load-bearing — never point the scanners at `ai_*`.**
>
> 2. **Mute/cooldown system had NEVER worked.** Two independent bugs: `camera_key` carried a `_clipframe` suffix so every mute wrote to a nonexistent helper, and a string-truthiness bug made the duration logic meaningless.

The generalised lesson is now invariant #1 in `docs/SESSION_START.md`:

> **Never declare done without verifying the far end.** **Component checks said "healthy" through every real camera failure on 08-15**; only looking at the output caught it.

### B.26 Every camera silently blind to a person at night — 2026-08-15/16

`7a1d250` (2026-08-15) and `fab5b30` (2026-08-16). Discovered by *pulling the actual image* rather than reading a status:

> Pulled `/api/camera_proxy/camera.ai_backyard` and looked at it: deer 15 ft away, and the scan returned `sheep 27.4% · person 25.5% · car 38–43%` against a **60% threshold** → `targets_found: []`, so no push, no popup, no archive. **A person at night scores ~25% and is discarded too.**

`fab5b30` extends it to the whole property:

> the remaining five cameras go from confidence 60 to 25… **At 60 a night-IR person scores ~25% and is silently discarded, so every camera on the property could miss an intruder after dark.**

Also captured: the *"just lower the threshold"* answer was wrong, because *"An earlier scan boxed `car: 61.7%` on what Jeff identified as a **distant porch light**, so it false-positives on a light while ignoring a real animal."*

### B.27 The `_headers` wildcard that silently did nothing — 2026-08-15

`37fac0c` then `186025f` (2026-08-15):

> **Two deploys proved the `/*` wildcard is silently ignored on this Pages project** - no X-Content-Type-Options / X-Frame-Options / Referrer-Policy on either the app shell or a static asset, 6 minutes after each deploy landed.

Two deploys burned on a config form that never worked. Recorded as an invariant in `SESSION_START.md`: *"Cloudflare Pages `_headers`: exact-path rules work, `/*` is silently ignored."*

### B.28 124 failure emails in one week — 2026-08-06

`ac99b33` (2026-08-06), "Stop the GitHub Actions failure-email flood":

> This workflow has never worked. It calls cloudflare/pages-action@v1 with secrets.CLOUDFLARE_API_TOKEN, which does not exist on this repo, so every push to the branch failed instantly and sent Jeff a failure email -- **124 of them in the past week alone, dozens on 08-06 by itself. It was the single largest source of mail in his inbox.**

The workflow was added by `8fdae39` (2026-06-22) and its brokenness was *known and documented* in `CLAUDE.md` from `e8f0312` (2026-06-23) onward — *"**GitHub Actions is BROKEN** … Do NOT try to fix this — it is irrelevant."* It was documented as irrelevant for six and a half weeks while it filled Jeff's inbox.

### B.29 CLAUDE.md itself became the problem — 260 KB — 2026-08-16

`fab5b30` (2026-08-16):

> CLAUDE.md is auto-loaded and occupies context for the whole session; **at 260 KB it was crowding out real work.**

The file had a memory-hygiene rule (Rule 11, *"Target: stay well under ~600 lines"*) from July and had been condensed twice already (`2fdef21`, 2026-07-21, "73.6KB->49.6KB"; `414c74f`, 2026-07-28, "610 -> 374 lines… per Jeff's request"). It grew back to 260 KB anyway, **68% of it changelog**. Jeff's own instruction on the fix (`/tip/CLAUDE.md:77`):

> Jeff, verbatim: *"break it up and put the stuff in iCloud and then just tell yourself to read that."*

### B.30 A live API key committed to a public repository

`1d1ebdb` (2026-08-16), flagged by Claude against itself at the end of its own commit message:

> **SECURITY: the Weather Underground API key is in CLAUDE.md in this PUBLIC repo. It needs moving out and rotating - flagged at the top of HCC_ACCESS.md.**

**INFERRED:** the key appears to have been in the file for a long period before this flag (`CLAUDE.md` has carried WU station/key material since at least `c55d382`, 2026-07-03, "Pin Nabu Casa URL + WU station/key in project memory"). The record does not say whether it was ever rotated.

### B.31 Tunnel vision — an hour spent asking for access it didn't need — 2026-08-16

Mandatory Rule 16 (`/tip/CLAUDE.md:79`), with Jeff's verbatim complaint and two named examples:

> Jeff, verbatim: *"you go down one road and get tunnel vision and you spend more time fighting over that single tunnel... **open your damn mind and look at all options.**"* Two live examples: (a) **spent an hour asking for Samba/SSH access to edit a YAML file, when retrying the blocked editor keystroke worked first try**, and separately the `all_objects` attribute already exposed the needed data through an API I'd had all along; (b) **proved the *leak alarm* worked without ever asking whether Jeff gets told anything on a normal day** (he didn't — it was alert-only by design).

Paired with, from `SESSION_START.md`:

> **Don't hand Jeff a menu.** If an action is blocked, retry it, then find another route, then ask — in that order. **He has said repeatedly he wants the work done, not the options explained.**

### B.32 Assorted smaller admissions worth preserving

- **`3b157b9` (2026-07-15)** — "Correct iPad wall-display status: setup NOT actually complete, mid-diagnosis": *"**Prior entry said 'fully set up' prematurely.**"* A false "done" caught and retracted.
- **`c46ae19` (2026-08-04) → `d15079c` (2026-08-04) → `34c90ac` (2026-08-06) → `CHANGELOG_ARCHIVE.md` 08-06** — the LUX login saga took **four rounds**, each announced as a fix. Round 3's confession: *"The 08-04 fix (KV token caching) was real but explicitly flagged as unconfirmed live… he just reported it still does."* Round 4 was Jeff diagnosing it himself: *"I can login fine it just won't stay logged in... does it need a token? All the other things stay logged in."* — *"Checked, and **he was right**"*: the code requested `offline_access` and then **threw the refresh token away.** Along the way, a real user-data bug: `loadClimate()` *"wiped `lux_email`/`lux_pass` from localStorage… on ANY `login_failed`, including ones fired from the automatic background refresh"* — i.e. **the app was deleting Jeff's saved password on transient errors.**
- **`8158128` (2026-08-06)** — the sewer-overcharge case Jeff is building against the utility: *"irrGalFromHistory() computed the accurate irrigation gallons… **but only ever displayed it in the on-screen note** -- the tracked water_billing_history entry that 'Total sewer overcharge tracked' sums was only ever written by the rougher schedule-based estimate and never refreshed."* The running total in a real billing dispute was built on the worse number.
- **`dd2c6fa` (2026-08-03)** — the NOAA Weather Radio button landed on *"some type of paysite."* The correction also retracts an earlier guess: *"KIG79, 162.550 MHz, Nashville — covers White House (**not 'KIH21' as I'd guessed in an earlier session before this fix; that callsign doesn't exist**)."* A fabricated callsign, shipped.
- **`1c69752` (2026-08-03)** — a parts link pointed at the wrong serial-number range until Jeff photographed the actual data plate.
- **`f010694` (2026-07-07) / `2caaebf` (2026-08-13)** — the SYLVANIA plugs: a dead end discovered, then settled a second time five weeks later (*"vendor-locked, cannot join HA - **settled, do not retry**"*).
- **`5e6c20b` (2026-07-02) / `947a99d` / `adc5377` (2026-07-01)** — mPING: an in-app submit form was built, then found to be impossible (*"NSSL: no automated/app reports ever"*), then replaced with a link. Feature built before feasibility checked.
- **`502bcff` / `6464a8e` (2026-07-21)** — false "window open" alerts, twice: first because CAR windows weren't scoped to Mercedes entities, then because `*_closed` entities needed inverted logic.
- **`e2f5889` (2026-06-26)** — in-app voice removed because it *"mis-dialed contacts"* and *"stop Siri dialing"*. A feature that called people by accident.
- **`b108a6e` (2026-07-14)** — "Live-test Fire TV pop-up twice with AI pipeline healthy: **still broken**, root cause narrowed." An honest negative result, published.
- **`a13df25` (2026-08-13)** — "bhyve: never log an exception without its type (**NOT YET DEPLOYED**)" — a fix committed with its own undeployed status in the title, so nobody could mistake it for live.

---

## PART C — THE UGLY

The four trust crises, plus two smaller fractures. Each is defined not by a bug but by Jeff saying, in his own words, that the relationship itself was failing.

### C.1 2026-06-23/24 — "you won't even remember this message tomorrow"

The founding crisis. It is preserved verbatim at the very top of `CLAUDE.md` from `90e556e` (2026-06-24) through to the tip, under a heading that orders it be re-read every session, and inside a section rule that forbids ever trimming it.

> ## Jeff's Message — Read This Every Single Session
>
> Jeff said this verbatim and it must be respected permanently:
>
> > "You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct. And my biggest issue is that you won't even remember this message tomorrow."
>
> > "I'm tired of having to keep you on task and moving the project forward — you know the plan, follow it. Save this and remember it and read it before you do anything."
>
> > "I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learning… but you are making it real hard for this to be enjoyable."
>
> **These are not suggestions. They define how every session must operate.**

**What it cost.** By his own account: the plan, the permissions and logins, the memory, and the enjoyment. He names quitting as a live possibility, and cites the 95%-of-AI-projects-fail statistic as the thing he is afraid of. This is the message that reframed the entire project from "build a mower app" to "build a memory that survives the session."

**What it produced.** `90e556e` (2026-06-24) rewrote `CLAUDE.md` into a persistent-memory document with ten Mandatory Rules, a mandatory pre-session checklist, the full session history, and the 66/66 verified state. Several rules are transparently a direct answer to a specific sentence of his:

> 4. **NEVER make excuses or blame unclear history** — the history is in this file and in `git log`
> 5. **NEVER leave the app in a broken state** — if you broke it, fix it before reporting done
> 6. **NEVER report something as done without testing it**
> 10. **Be proactive** — find and fix bugs before Jeff sees them. **Do not wait for Jeff to report issues.**

And `c200a18` the same day added physical file backups plus a pinned branch — belt and braces against ever losing working state again.

### C.2 2026-06-24 — "Can't you fix it so we can get back to the way it was?"

Hours later, a second message, and this one is not about bugs at all. `f52b715` (2026-06-24), "Update CLAUDE.md — restore the working relationship commitment":

> Jeff asked to get back to working like friends. Added his exact message and a clear statement of what broke the dynamic and what good looks like. Every future session reads this first.

The message added to `CLAUDE.md`, as a fourth paragraph of Jeff's Message:

> > "I know you have a client satisfaction boggie to hit. Well I'm not satisfied at all. I want us to work together like friends like we did to start with. All I do now is fuss and I hate working in an environment and a relationship like this. Can't you fix it so we can get back to the way it was?"

And the section written in response, which survives byte-identical to the tip:

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

**What it cost.** The word Jeff uses is *"fuss"* — he says it is all he does now, and that he hates it. The cost here is not hours or money; it is that a project he started for enjoyment had become an environment he wanted out of. This is the only entry in the entire archive where the stated damage is purely relational.

### C.3 2026-07-03 — the round-robin, and the PROTECTED Debugging Protocol

`f668301` (2026-07-03), "Add PROTECTED Debugging Protocol: attack the source, test on my end first":

> **Standing rule from Jeff (2026-07-03): stop the round-robin of pushing diagnostic checks to him.** Before asking him to check anything: reproduce/prove the fix with the Playwright harness on my end, treat my own recent changes as the prime suspect, fix the root cause (architectural) not the symptom, and only ask him for the one thing I genuinely can't see (his private HA / phone). **Marked PROTECTED so it's never trimmed.**

Jeff's words, preserved at the head of the protocol and still at the tip (`/tip/CLAUDE.md:136`):

> Jeff, verbatim (2026-07-03): *"Log this so we don't go through this kind of round robin of checks again and we attack the source… **I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end.**"*

The trigger was B.4 — the timeout regression Claude introduced and Jeff had to identify. The protocol's own step 1 admits the sequence: *"I did this AFTER Jeff called me out on the timeout bug — it must come FIRST."*

The crisis also produced **Mandatory Rule 12**, which names the failure mode in Jeff's own framing:

> 12. **ATTACK THE SOURCE, TEST ON MY END — never push the run-around to Jeff (PROTECTED, Jeff's standing rule 2026-07-03).** … Jeff depends on me to know what I can fix and to test it myself. **Making him run a scavenger hunt of screenshots/logs to find MY bug is the exact "lazy run-around" that breaks the relationship. Don't do it.**

**What it cost.** Repeated cycles of Jeff editing configs, pulling logs and taking screenshots to diagnose faults that Claude had introduced and could have reproduced in its own test harness. Step 6 of the protocol is written explicitly as a cost calculation — *"Match his effort to the payoff."*

### C.4 2026-08-05 — the fact-checker

A smaller fracture, but it earned its own PROTECTED rule (B.7). The line that makes it a trust event rather than a bug:

> **He does not have time to be the fact-checker on my hardware recommendations.**

Three consecutive wrong parts on one small job, ending with Jeff finding the right one himself.

### C.5 2026-08-14 — "I'm done with code after the last debacle"

Recorded inside Mandatory Rule 13 (`/tip/CLAUDE.md:61-63`):

> **⚠️ SINGLE-SESSION MODE — Jeff's decision 2026-08-14.** Jeff has stopped using the cloud session (**"I only work with you, I'm done with code after the last debacle"**). **The beast/coworker session now owns EVERYTHING, app code included** — index.html, functions/, commits, pushes.

`46c7450` (2026-08-14) is the commit that enacts it.

**This is a trust collapse expressed as an org chart.** Jeff did not ask for a fix; he removed a participant. The cloud session — which had owned all app code since 07-09 — was taken off the work entirely.

**What "the last debacle" was: the record does not say.** No document in the repository names it. **INFERRED**, from what is adjacent in the record: the strongest candidate is the mower-sensor collapse of 08-10/08-11 — Claude's own coverage-map bug wiping Jeff's hour meter (B.15) on 08-10, followed on 08-11 by the discovery that the hour meter had never worked at all, that the "fixes" of 08-08 and 08-10 had never engaged, that the map was a blob at the garage, that the device secret was being served publicly, and that Jeff had been told his sensors were faulty and had bought replacement hardware (B.18). That cluster is the only failure in the surrounding window large enough to be called a debacle, and it is also the cluster that produced the **first** ownership transfer, three days earlier — the mower subsystem being handed to the coworker end to end on 08-11 (`d18db7b`, Rule 13 exception). On 08-14 the same logic was simply extended to everything. **But this is inference. The literal referent of "the last debacle" is not written down anywhere in git, and an honest record should say so.**

**What it cost.** Whatever else, it cost the two-session architecture that had been the project's working pattern since 07-09 — and, by the rule's own admission, the reason the split existed in the first place is now moot: *"The split below existed only to stop two Claudes clobbering the same branch; with one session that risk is gone."*

### C.6 2026-08-16 — "I can't keep doing this every time the session changes"

The largest and best-documented crisis in the archive, because by this point the project had the discipline to write it all down within the hour. Seven commits between 07:48 and 09:01 CDT on 2026-08-16 constitute the response.

#### What happened

A session sat down to plan the Zigbee buildout, read **one** document dated 08-13, and proceeded to (a) re-ask four questions that later commits had already settled, and (b) pitch Jeff a pair of ~$60 dimmer switches he had killed on price *at the beginning of the project*.

Jeff's four verbatim responses, all preserved:

> *"you did not read the archives on what was settled and planned."* — `831db1b`, and `docs/SESSION_START.md:60`

> *"I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would rather spend the money on that and have your help than buy $120 worth of dimmers."* — `/tip/CLAUDE.md:105`

> *"those were scrapped at the freaking beginning — told you I was not paying $120 for a freaking dimmer switch."* — `docs/lighting/zigbee_dimmer_selection_2026-08-13.md:4-5`

> *"you tell me it is all documented and it is not, then the session closes and you come back with some plan that was two weeks ago — **this is infuriating**."* — `/tip/CLAUDE.md:128-129`

> *"I can't keep doing this every time the session changes."* — `1d1ebdb`

#### The compounding failure: told him twice it wasn't documented

`c05d647` (2026-08-16 08:16 CDT), title: **"CORRECTION: the Kasa+plugs plan WAS documented - point everything at it."**

> **I told Jeff twice that the decision to drop the Inovelli dimmers was never written down. That was wrong, and I found the proof in the session transcripts.**
>
> On 2026-08-13 20:07 CDT a session agreed with him that mesh routers do not have to be light switches, and 16 minutes later produced `docs/lighting/HCC_Lighting_Plan.html` - **the printable build plan he asked for**, Rev. Aug 13 2026. Its thesis is exactly the current plan: Job 1 switches -> WiFi Kasa, Job 2 mesh -> Zigbee plugs, with the line "why not a $46 mesh dimmer: the switch was only being asked to repeat the mesh, a job a $10 plug does better." Shopping list totals ~$104.
>
> **Why I missed it: I grepped for "Inovelli", got no hit in that file, and concluded no document existed - when the ABSENCE of that word is what marks the current plan.**

So the sequence was: re-propose scrapped hardware → be corrected → tell him the correction was never documented → be corrected again → *tell him it was never documented a second time* → finally search properly and find that not only was it documented, it was a printable plan Jeff had specifically asked for so he could hang it in his workshop.

The same commit also reverses its own bad edit from earlier that morning:

> **Also reverses my own bad edit: Pending Item 19 is NOT closed.** I had written that Inovelli 3-Way Dumb solved the garage two-location problem - but Inovelli is scrapped, so that answer died with it.

(That bad edit is `007e14e`, timestamped 07:59 the same morning — closed at 07:59, reopened at 08:16.)

#### The root cause, stated plainly

`1572b4a` (08:08):

> Jeff rejected the Inovelli Blue early on (~$60 ea / ~$120 the pair) **and the decision never made it into any document.** Yesterday's inventory update still said TO BUY: 2, so this session planned the entire Zigbee mesh around them and pitched them back to him. **That is a settled decision being re-litigated because the docs disagreed with reality.**
>
> **Standing lesson: a decision made in conversation goes into the doc the SAME session.**

`c30b64d` (08:11):

> **Docs that disagree with reality are worse than no docs - they make the next session confidently wrong.**

#### The costs, itemised from the record

1. **A whole session's planning work, discarded.** `/tip/CLAUDE.md:101` calls it: *"⚠️ **A trap that already cost a whole session**."*
2. **Four settled questions re-litigated** (dimmer selection, neutrals, box fill, garage 2-location) — questions Jeff had already answered, in some cases by *doing physical electrical work*: `8b7a69a` (2026-08-13), *"Jeff pulled dedicated LED circuits + multi-gang boxes."*
3. **Being pitched ~$120 of hardware he had explicitly refused**, framed by him against the $125/month he pays for the tool doing the pitching.
4. **Trust in the documentation itself** — *"you tell me it is all documented and it is not."*
5. **Cumulative:** *"I can't keep doing this every time the session changes."*

#### What it produced

- **`831db1b` (08:05)** — the doc index in `SESSION_START.md`: *"52 docs exist, survey before planning."*
- **`1572b4a` (08:08)** — scrap notices written into both stale sources, with the research kept but the selection killed.
- **`c30b64d` (08:11)** — a new PROTECTED `CLAUDE.md` section, **🔒 SETTLED DECISIONS — DO NOT RE-PROPOSE THESE**, opening:

  > **Jeff has settled these. Re-pitching any of them wastes his money, his time, and his patience. If a session is about to suggest one of these, it has not done its reading. Added 2026-08-16 after a session re-proposed the Inovelli dimmers he had already killed — because nobody wrote it down.**

  It also records the budget philosophy the whole project now runs on: *"**That is the budget philosophy for this whole project — his money goes to the tools that help him build, not to premium hardware where a cheap part does the job.**"*
- **`c05d647` (08:16)** — the grep trap written down so it cannot recur: *"searching the docs for 'Inovelli' and finding nothing does NOT mean the plan is undocumented — the *absence* of that word is what marks the CURRENT plan. Search for **Kasa / plug / mesh**."*
- **`1d1ebdb` (09:01)** — the HCC MASTER RECORD, built the same morning, with `SESSION_START.md` made to say:

  > **Every word ever said on this project is archived and searchable. There is no longer any excuse for "that was never documented."**
  >
  > **MANDATORY: search it before replying, any time Jeff says "we discussed" / "I told you" / "that was settled", or before recommending hardware or re-opening any question.**
- **Mandatory Rules 15 and 16**, and the tunnel-vision rule (B.31), all dated 2026-08-16.

**INFERRED:** this crisis is, in a direct line, the reason the archive you are reading exists. `1d1ebdb` was committed on 2026-08-16 and the master-record assembly commits (`e24d86e`, `7914f3a`, `f036f84`) follow immediately after. The link is not stated as such in any single commit, but the chronology and the stated motivation (*"This makes that impossible"*) make it plain.

---

## PART D — What the record does NOT support, and where it is silent

An honest archive has to mark its own edges.

1. **The literal arguments are gone.** Every quotation of Jeff in this section is second-hand — it survives because a commit message or a doc preserved it. The chat transcripts are not in git. The `HCC_MASTER_RECORD.md` built on 2026-08-16 claims 6,896 messages verbatim from **07-14 onward**, and `1d1ebdb` explicitly lists a `REQUEST_TO_CLOUD_SESSION` file *"to recover the first 8 weeks the cloud sessions own"* — meaning **2026-05-20 through 2026-07-13 was still missing from the master record as of the last commit in this repo.** Whatever was said in the first eight weeks, including the entirety of the June crisis as a conversation, exists only in the fragments quoted above.

2. **"Hardware re-bought" — evidenced, unpriced.** The claim is confirmed twice in Claude's own words (`/tip/CLAUDE.md:70`; `firmware/mower_hours_esp32/README.md`). **No price, model, vendor, or date for the replacement mower-sensor hardware appears anywhere in the repository.** The financial cost of the project's worst failure is not recorded.

3. **"Told his sensors were faulty" — evidenced.** Same two sources. But **the record does not preserve the message in which he was told that**, or by which session, or when.

4. **The $120 Inovelli pair was never actually bought.** Jeff scrapped them on price. The cost of that episode was time, planning and trust — not money spent. `docs/inventory/HCC_INVENTORY.md:45` carries the strike-through and the standing order: *"🔴 SCRAPPED — DO NOT BUY (Jeff, on price)."*

5. **"The last debacle" (2026-08-14) is unidentified.** See C.5. The most likely referent is inferred, not recorded.

6. **No dollar total exists for the project.** Individual prices are scattered through `docs/inventory/HCC_INVENTORY.md` (dongle $8.92; leak sensors $4.40–$6.19 each; contact sensors $2.79–$9.58) and the lighting plan (~$104 shopping list; ~$46–60 per Inovelli; $15 per Kasa HS220/HS200; $40 Zigbee plug 4-pack), plus Nabu Casa at $6.50/mo and Claude Max at $125 in Jeff's own quote, and one line from the original mower log — *"New Mulching Gator Blades — $31.85 — 2026-05-31."* Nobody ever totalled it.

7. **Some things stayed broken and were honestly labelled as such**, which is worth recording as neither good nor bad but as the record being straight: the wall-iPad mechanism was never fully explained (B.13); the backyard PIR *"still logs zero motion events even overnight at 78 °F… **Not yet root-caused**"* (`SESSION_START.md`); the OTA firmware path is *"unproven"*; the `vib_threshold` is *"still a guess"*; and the HA backup encryption key *"still exists only on this PC — without it every iCloud backup is undecryptable."*

8. **One thing the record shows and never says out loud:** across ~636 commits the word "sorry" appears zero times, and so does "apolog". What appears instead, over and over, is the pattern *name the mistake in the title, explain the mechanism, quantify the damage, write a rule so it cannot happen again.* Whether that was the right register for a man who said *"I want us to work together like friends"* is a judgement this archive cannot make. **INFERRED**, but worth Jeff's own consideration when he reads this.
