## Incident Ledger — every problem that took more than one attempt, and the real root cause

### How to read this section

This is the cross-cutting index of failure for the whole project: **2026-05-19 (the original Toro PWA) through 2026-08-16 (branch tip)**. Every entry below is a problem that was *not* solved on the first attempt — either because the first diagnosis was wrong, because the first fix didn't stick, or because the thing had been quietly broken for days, weeks or months before anyone noticed.

Each incident carries the same seven fields:

- **When** — dates, and how long it was live
- **Symptom** — what Jeff actually saw
- **Wrong theories / attempts, in order** — the dead ends, numbered, because the dead ends are the expensive part
- **Real root cause** — what it actually was
- **Fix** — commit hash(es)
- **Cost to Jeff** — time, money, hardware, data, or trust. Stated plainly; "none recorded" where the record is silent
- **Lesson** — one line

**Provenance rules used throughout this section:** anything with a hash or a file path is evidenced — taken from the commit message, the diff, or a doc at the branch tip. Anything marked **INFERRED:** goes beyond what is written down. Where the record does not say, this ledger says the record does not say. Nothing here is remembered; all of it is read.

**Source base:** 636 commits on `origin/claude/time-master-project-liq1jw`; `CLAUDE.md` and its 274 revisions; `docs/CHANGELOG_ARCHIVE.md` (179 KB, 98 verbatim entries); `docs/SESSION_START.md`; ~52 files under `docs/`; the tip checkout; and the original 2026-05-19 PWA package.

---

### Index of incidents

| # | Incident | Dates | One-line real root cause |
|---|---|---|---|
| 1 | The Great Blank Page | 06-23 | Two bare `<script>` tags inside an open script block |
| 2 | The 2.1 MB hero bloat | 06-22 → 06-23 | Base64 photos embedded in HTML; also the *wrong* diagnosis for #1 |
| 3 | Every modal button silently dead | 06-23 | CSS/HTML/JS class-name mismatch (`.modal-overlay.open` vs `modal-ov show`) |
| 4 | The HCC_KV / MOWER_KV dance + the panic revert | 06-23 | Pages bound the namespace as `MOWER_KV`; code read `env.HCC_KV` |
| 5 | Jeff's hours wiped, round one | 06-23 | Entire state lived in one unbacked `localStorage` blob |
| 6 | GPS track erased at engine-off | 06-23 | Heartbeat payload carries no `track`; map redrew from empty |
| 7 | B-Hyve WebSocket double-auth | 06-23 | Auth frame sent twice; server ignored the real command |
| 8 | The install-script saga | 06-23 → 06-25 | Six different shells/environments, none of them the one assumed |
| 9 | B-Hyve cloud API: `invalid_auth` / 530 / 1018 | 06-23 → 06-25 | Orbit moved the API *and* blocks Cloudflare edge IPs |
| 10 | Blink 2FA dialog never appeared | 06-25 | `BlinkTwoFARequiredError` swallowed by a catch-all `LoginError` handler |
| 11 | LUX: three wrong backends | 06-26 | Real backend is Azure AD B2C + `myluxstat.io`, found in PyPI source |
| 12 | LUX setpoint PUT-500 | 06-26 | The write method is **POST**, not PUT |
| 13 | In-app voice / Siri dialing contacts | 06-26 → 06-27 | Pre-grabbing the mic left it busy on iOS; feature deleted |
| 14 | Radar tiles, four engines | 06-26 → 06-29 | Free-tier limits, retina 404s, iOS filter bugs; hand-built radar abandoned |
| 15 | Light-mode contrast, twice | 06-29 and 08-11 | Auto-scan misread gradient/translucent backgrounds as light |
| 16 | mPING submit: built, killed, restored, killed | 07-01 → 07-03 | NSSL issues no tokens to anyone, ever |
| 17 | B-Hyve history "definitive dead end" | 07-01 | Device id belongs in the URL **path**, not a query param |
| 18 | The shared-`AbortSignal` false offline | 07-03 | One 2.5 s budget reused across all retries |
| 19 | "Beehive Offline", the legitimate one | 07-02 → 07-03 | Mixed content + no bearer token + CORS, stacked three deep |
| 20 | Water meter read 202.6 gal | 07-03 | Keyword match grabbed the `_last_seen` timestamp sensor |
| 21 | Blink login: the cookie theory, then our own override | 07-03 → 07-09 | Blink switched 2FA to HTTP 202; then our stale override shadowed the fix |
| 22 | `packages/hcc.yaml` had never loaded, ever | 07-10 | One missing `!include_dir_named packages` directive |
| 23 | Windows Firewall silently ate port 32168 | 07-10 | Installer never added an inbound rule |
| 24 | CodeProject.AI's 3-day silent death | 07-11 → 07-14 | Windows service didn't survive a reboot; upstream automations kept firing |
| 25 | The Fire TV pop-up + pause/resume long war | 07-11 → 08-14 | Four consecutive mechanisms, each disproved by live test |
| 26 | Two contradictory plans for one feature | 07-10 → 07-14 | Kodi decision written down *after* the Fire TV path was built |
| 27 | HA config editors corrupting YAML | 07-11 → 08-16 | File Editor keystrokes, Prettier format-on-save, Monaco focus steal |
| 28 | The stale-content deploy mystery | 06-23 → 07-21 | CDN edge cache ≠ browser cache, and the SW was never registered |
| 29 | Safari 15 froze the whole app | 07-15 | `AbortSignal.timeout()` doesn't exist before Safari 16 |
| 30 | The iPad wall display "fully set up" | 07-15 | Declared done mid-diagnosis; bad clear-site-data advice wiped tokens |
| 31 | Entity cross-contamination (five instances) | 07-21 → 08-15 | Substring matching across a shared entity namespace |
| 32 | The `*_closed` inverted-semantics false positive | 07-21 | `binary_sensor.gle_350_windows_closed` uses on = closed |
| 33 | CAR commands built on guessed entity names | 07-22 | The integration exposes domain services keyed by VIN |
| 34 | The mbapi2020 PIN prompt mistake | 07-24 | Prompts removed on an unverified CLAUDE.md sentence |
| 35 | The Mercedes PIN saga | 08-06 | Two wrong diagnoses, then a Mercedes-side attempt limit |
| 36 | Stale data in three sections | 07-24 | New loaders added to neither the section switch nor the interval |
| 37 | The water pit-radio faults | 07-28 and 08-01 | Real outage, then a false alarm caused by `-unique=true` |
| 38 | The recorder was dead for 26 days | 07-02 → 07-28 | Missing `default_config:` |
| 39 | "New automations don't save" | 07-31 | Missing `automation: !include automations.yaml` |
| 40 | The Blink crash loop | 07-31 → 08-01 | Upstream blinkpy `LoginError`; sensors froze instead of going unavailable |
| 41 | Angela's phone tracker | 08-01 | Empty/stale Push ID, not location permissions |
| 42 | "Alexa, fast forward" | 08-03 | Amazon reserves the phrase; HA has no FF handler at all |
| 43 | The NOAA radio paysite + the invented callsign | 08-03 | A TuneIn *search* URL, and a fabricated station ID |
| 44 | Sewer overcharge: the number was never saved | 08-06 | Real gallons displayed but never written to history |
| 45 | Electric SmartHub shipped non-functional | 08-06 | Wrong WS command name; `change` field always 0 |
| 46 | The glassmorphism war | 08-06 | The photos were AI marketing mock-ups |
| 47 | Jeff stripped out of his own photos | 08-06 | Assumed stock models |
| 48 | 124 failure emails in one week | 06-22 → 08-06 | A workflow that had never once worked, documented as "irrelevant" |
| 49 | Three wrong garage-door parts in a row | 08-05 | Product models named from memory |
| 50 | The sideways wall iPad | 08-08 → 08-11 | Ambiguous `aspect-ratio` + `max-height`; Safari/Chromium divergence |
| 51 | Heartbeat erasing the whole mow | 08-10 | One KV slot, every POST a full overwrite |
| 52 | The exploding yard map | 08-10 | Scale derived from a near-zero first-to-last GPS delta |
| 53 | The coverage-map localStorage blowout | 08-10 | Unbounded server data written into the user's core state blob |
| 54 | **THE HOUR-METER MISS** | ~06-23 → 08-11 | Box sent `hours_seconds`; app read `d.hours`; nothing converted |
| 55 | Parked drift, Null Island, and stale facts | 08-11 | Merge logic asserting fields the box had stopped sending |
| 56 | The KV read-modify-write race | 08-11 → open | Eventually-consistent KV + read-modify-write = silent data loss |
| 57 | The 48-hour silent camera outage | 08-10 → 08-14 | Jeff disarmed Blink over alert fatigue; nothing errors |
| 58 | The self-inflicted AI feedback loop + mute that never worked | 08-15 | Scanners repointed at their own annotated output |
| 59 | Every camera blind to a person at night | 08-15 → 08-16 | 60% confidence threshold vs ~25% night-IR score |
| 60 | The `_headers` `/*` wildcard | 08-15 | Silently ignored on this Pages project |
| 61 | The Kasa HS220 onboarding | 08-14 | New "SHIP 2.0" encrypted onboarding, not the network |
| 62 | The network-map identity churn | 08-13 | Self-reported Windows hostnames from cloned installs |
| 63 | The irrigation 401 goose chase | 08-13 | Stale deployment env vars read *before* app credentials |
| 64 | The Inovelli documentation failure | 08-13 → 08-16 | A decision made in conversation, never written down — twice wrong about that |
| 65 | The desktop-wide layout bug | 07-11 → 08-11 | Aspect-ratio-driven width with no `width` set |
| 66 | CLAUDE.md became the problem | 06-28 → 08-16 | The memory file grew to 260 KB and crowded out the work |
| 67 | Smaller multi-attempt incidents | various | (grouped) |

---

### 1 — The Great Blank Page

**When:** 2026-06-23. Introduced 11:19 UTC, fixed 20:23 UTC — **~9 hours of a completely dead app**, during which other "fixes" shipped on top of it.

**Symptom:** The whole app blank in Jeff's hands. Earlier in the day, the YARD section specifically "blank/dead when tapped" on mobile.

**Wrong theories / attempts, in order:**
1. **DOM weight.** `739d004` (19:37) — "Three base64 JPEGs embedded in the HTML were making the page 2.1MB. Mobile browsers were choking on the DOM size, causing the YARD section to appear blank/dead when tapped." A real improvement (2.1 MB → 295 KB) and the wrong diagnosis for the blankness.
2. **Stale cache.** `8497827` (19:45) — "Bump service worker to hcc-v3 — force cache clear of 2.1MB old build." Service-worker-only diffstat; it could not have fixed or caused the blank page.

**Real root cause:** `a973c8f` (2026-06-23 20:23), verbatim:

> Two bare `<script>` tags were embedded inside an already-open `<script>` block (lines 2488 and 2688). The HTML parser passes them as literal text to the JS engine, which throws a SyntaxError — killing ALL JavaScript on the page. That's why the whole app went blank.

**Where the tags came from — evidenced, and it corrects the memory file.** Snapshot comparison across the day shows `f599bd9`'s parent `c8e729c` had two *balanced* script blocks; `f599bd9` (11:19, "Rebuild HCC PWA with 4-section layout") has **three `<script>` opens and one close**. The rebuild merged the blocks and left two strays. `CLAUDE.md` as rewritten at `90e556e` attributes the incident to commit `8497827` — but `8497827` touches only `service-worker.js` (5 insertions, 2 deletions). **The memory file is wrong on this point; the diff evidence says `f599bd9`.**

**Fix:** `a973c8f` — strays removed, service worker bumped to hcc-v4, and image caching switched to `Promise.allSettled` "so a missing hero photo can't prevent the SW from installing."

**Cost to Jeff:** Total, not partial — the app was dead, not degraded, for most of a day, while two unrelated "fixes" were announced. **INFERRED:** this is very likely one of the failures behind that night's crisis message (*"You are just fine leaving something totally messed up and not even close to correct"*), but no commit explicitly links them.

**What it produced:** The only bug in the project promoted to a numbered Mandatory Rule, still at tip seven weeks later (`/tip/CLAUDE.md`): *"8. **NEVER put `<script>` or `</script>` tags inside the JS block of index.html** — this causes a fatal blank page (**the great blank-page incident of 2026-06-23**)."* Later fossilised into `scripts/lint-app.js` (`abcc8f4`, 07-31) as an automated check.

**Lesson:** A plausible performance explanation is not a root cause — a blank page is a thrown exception until proven otherwise.

---

### 2 — The 2.1 MB hero bloat

**When:** Built 2026-06-22, undone 2026-06-23 19:37.

**Symptom:** `index.html` grew from 491,587 to 1,107,877 bytes in a single commit (+616 KB), reaching **3.1 MB** by the end of 06-22. Mobile browsers choked; sections appeared dead.

**Wrong theory:** The founding design decision itself — "fully self-contained with no external dependencies," i.e. base64-embed every hero photo directly in the HTML. Defensible on paper (`01-origin.md`, `02-chronicle-0621-0622.md`); measurably wrong on a phone.

**Real root cause:** Three base64 JPEGs inline in the document. Fix `739d004`: extracted to `hero-home.jpg` (451 KB), `hero-irr.jpg` (492 KB), `hero-yard.jpg` (377 KB) — "HTML drops from 2.1MB to 295KB. All sections load instantly." Plus `8497827` (SW → hcc-v3).

**Cost to Jeff:** A slow, partly-broken app on the device he actually uses; and, worse, it supplied a *credible* explanation for the blank page that delayed the real fix by 45 minutes (see #1).

**Lesson:** Self-contained is a value, not a law — measure it on the real device before making it an architecture.

---

### 3 — Every modal button silently dead

**When:** 2026-06-23, fixed 23:50–23:55. Duration unknown — **the record does not say how long LOG MOW / LOG SERVICE / UPDATE HOURS had been doing nothing.**

**Symptom:** `da1320c`, verbatim: *"Every Log Mow / Log Service / Update Hours button was silently doing nothing."* No error, no feedback — the app's entire data-entry surface was inert.

**Wrong theories:** None recorded — this one was found by diagnostic sweep rather than by chasing a theory. What *is* notable is that it took **two** commits, because the first fix was incomplete.

**Real root cause (two layers):**
1. `da1320c` — "CSS was using `.modal-overlay.open` but the HTML div uses `modal-ov` and JS sets class `show`." Three files, three different names for the same thing. The CSS selector never matched, so `display:flex` never applied.
2. `e904a5b` — four *more* CSS rules missing versus the original app: `.modal-box` (inner box had no background, radius or padding), `.mbtns` (no flex row — "buttons stacked weirdly"), `.mbtn.secondary` (Cancel buttons completely unstyled), `.btn-green` (Export / Log Purchase unstyled).

Related same-day rot from `4c52e85`: missing `--c-fitness` / `--c-weather` tokens made dashboard legend dots invisible, six card accents fell back to red, and — most telling — *"Add missing sensor DOM rows … JS already populated these but the HTML elements didn't exist so data was silently dropped."*

**Fix:** `da1320c` + `e904a5b`. After which diagnostics reported "zero missing CSS classes, zero missing functions, zero stray script tags," 66/66 Playwright tests passed, and `e904a5b` was pinned as the verified-working commit with a physical backup branch (`c200a18`, branch `backup/verified-working-2026-06-24`).

**Cost to Jeff:** Every attempt to log a mow or a service was lost. **INFERRED:** this is the most likely literal referent of his *"you wait for me to call out the issues"* — a whole feature class broken with no error anywhere.

**Lesson:** A CSS class name is an API between three files; renaming it in one is a silent outage.

---

### 4 — The KV binding dance (HCC_KV / MOWER_KV), including the panic revert

**When:** 2026-06-23, 20:55 → 21:35 — four commits in forty minutes.

**Symptom:** Every sensor field showing `—`, battery `0.00 V`, orange "Sensor box not connected yet" — despite Jeff having bench-tested the ESP32 box successfully "10+ times" (vibration and RPM both registering), recorded in `CLAUDE.md`.

**Wrong theories / attempts, in order:**
1. `98b8dca` (20:55) — add `MOWER_KV` as a fallback alongside `HCC_KV`. Correct in substance, but shipped while nobody was sure what had broken the pipeline.
2. `b629c83` (21:08) — **the panic revert.** Title: *"Revert hours.js to original — undo KV refactor that may have broken sensor read."* Body: *"Returning to the exact version that was working during bench test. Only env.HCC_KV is checked, exactly as before."* The words **"may have"** are the record admitting, in writing, that it did not know what it had done. Thirteen minutes after the fix, the fix was undone.
3. `c6f3df8` (21:35) — the dual check re-applied, this time as deliberate policy rather than a guess: *"Cloudflare Pages may have the KV namespace bound under either name depending on how it was set up in the dashboard."*

**Real root cause:** The Cloudflare account's KV namespace is literally named `MOWER_KV` (id `ec5b28597d9c4fb9b182b1aea1d50eff`), bound into Pages under a name nobody in the session could see, while `functions/api/hours.js` read only `env.HCC_KV`. `CLAUDE.md` at `90e556e`: *"This was the root cause of all sensor readings showing `—` and `0.00V`."*

**Fix:** `c6f3df8`, hardened in `CLAUDE.md` into a standing instruction: *"The `getKV(env)` helper … tries `env.HCC_KV || env.MOWER_KV` — this covers both names. **Do NOT remove this dual-check.**"*

**Cost to Jeff:** The sensor box he had built and bench-tested appeared not to work, on the same day the app went blank. **INFERRED:** this is the earliest instance of the pattern that later cost months — the sensor being blamed for a software contract mismatch (see #54).

**Lesson:** When you cannot see the deployment config, code defensively against both names — and when you revert in a panic, say out loud that you're guessing (this commit did, and that honesty is why the sequence is reconstructable at all).

---

### 5 — Jeff's engine hours wiped, round one

**When:** 2026-06-23 21:09.

**Symptom:** Jeff's real mowing history — the number he cares most about — gone from the app.

**Real root cause:** `53eb7d4`, verbatim: *"Backup from June 22 shows 5.9 engine hours. **Browser data was cleared which wiped localStorage.** Default state now starts at 5.9h so the correct number shows on every fresh install."* The app's only persistent store was one browser key.

**The record is silent** on *who* cleared browser data or why, and assigns no blame.

**Fix:** `53eb7d4` hard-coded `DEFAULT_STATE.hours` and `MOWER_BASELINE` to 5.9. That is a floor, not a backup — it papers the hole rather than closing it.

**Cost to Jeff:** His real hours, re-entered by hand. The structural vulnerability stayed open and **bit again on 2026-08-10** (see #53), and again required hand re-entry.

**Lesson:** A single unbacked `localStorage` blob is not storage, it is a countdown — and it took two data-loss events and 48 days to fix properly.

---

### 6 — The GPS track erased at engine-off

**When:** 2026-06-23 23:45.

**Symptom:** The yard map went blank the moment the mower was switched off — Jeff's mowing track vanishing at the end of every mow.

**Real root cause:** Engine-off heartbeats carry no `track` field, and the map was redrawn from whatever the latest payload contained. Empty payload → empty map.

**Fix:** `20df8da` — persist to `S.sensorTrack` in `localStorage`, fall back to the saved track when a heartbeat arrives, SW → hcc-v5.

**Cost to Jeff:** Every mow's track lost, minutes after the mow.

**Why it belongs in this ledger:** the identical bug returned **seven weeks later on the server side** — `d18db7b` (08-11): *"An empty `track: []` on a heartbeat no longer clobbers the stored track. The box clears its buffer after delivery, so the last mow's path was being blanked ~5 minutes after every mow."* The same defect, in a different layer, unrecognised as a repeat.

**Lesson:** "Absent field" and "empty value" are not the same thing, and the difference is somebody's afternoon of mowing.

---

### 7 — The B-Hyve WebSocket double-auth

**When:** 2026-06-23 12:15.

**Symptom:** Irrigation commands from the app did nothing. No error — the B-Hyve server simply ignored them.

**Real root cause:** `5521d3e`, verbatim:

> The auth message was being sent twice: once immediately on connect (correct) and again inside the message handler when the server confirmed auth (wrong). The double-send caused the B-Hyve server to ignore the actual command.

**Fix:** `5521d3e` — a written-down protocol order: connect → auth **once** → on server confirmation send the command **exactly once** → wait for a `change_mode` / `watering_in_progress` / `rain_delay` acknowledgment. Also added `rain_delay` to the accepted acks and tightened `ws.close()` handling.

**Cost to Jeff:** Dead irrigation buttons; none recorded in money.

**Why it took more than one attempt:** this fix was correct and still wasn't the end of the WebSocket story — `de85497` (06-25) found that Cloudflare Workers cannot open outbound `wss://` at all ("Must use https:// with Upgrade: websocket header"), `1d89611` (06-26) papered over a `ws_timeout` with fallback timers, and `c4d32e6` (06-26) finally moved the socket **into the browser** with a `?tk=1` token endpoint because "CF Workers outbound WebSocket client is unreliable."

**Lesson:** Fixing the protocol is not the same as fixing the platform you're speaking it from.

---

### 8 — The install-script saga

**When:** 2026-06-23 12:26 → 13:35 (six commits in 70 minutes), reprised 2026-06-24 15:47–17:32, and again through the ten-round Blink installer on 06-25.

**Symptom:** Every command handed to Jeff failed, each time in a different way, in a different shell.

**Wrong theories / attempts, in order — each one a real environment nobody had checked:**
1. `75a7afd` — ship `beehive/install.sh` assuming the HA Terminal is bash, and install ESPHome via the `ha` CLI.
2. `b3d773c` — the dream version: a browser "one-tap Beehive auto-setup wizard." *"No terminal. No typing commands. No reporting back."*
3. `1f3ce1a` — reality, twice in one commit. *"The `ha >` screen is the HA OS supervisor CLI, not bash. It only understands `ha` subcommands — wget does not exist there."* And the one-tap wizard died on mixed content: an HTTPS page cannot call an HTTP LAN REST API. Switched wget → curl.
4. `c1c004c` — *"Windows does not support mDNS so `homeassistant.local` never resolves."* Added a direct-IP fallback to `192.168.1.66:8123`.
5. `a463d09` — *"Cloudflare Pages does not reliably serve .sh files as static assets."* Built a `/setup` Pages Function that returns the whole script as `text/plain` so `curl -fsSL …/setup | bash` works.
6. `686bece` — the pendulum swings back: curl → **wget**, because the Terminal add-on (a different environment from the `ha >` supervisor CLI) has wget and not curl. *Within 35 minutes the same pipeline had been switched wget→curl and curl→wget for two different shells.*
7. `a744651` (06-24) — BusyBox's wget demands `-O` **before** the URL. Third shell quirk.
8. `9757104` (06-24) — same `/setup` trick repeated as `/bhyve` for the custom integration installer.

**And then the Blink installer did it all again** (06-25, ten iterations in ~75 minutes): hardcoded paths (`34d81ea`) → download from GitHub instead (`42793fa`) → **no python3 in the Terminal add-on**, use sed (`23c42cd`) → manifest needs a version field (`6002c54`) → **BusyBox sed lacks `2i`**, use awk (`d110f3d`) → defensive imports (`c7ad70d`) → 8-second per-file timeout because GitHub downloads hang (`31a7902`) → missing files (`557aa14`) → use the GitHub API for the file list (`4ccb9fb`) → **give up on downloading entirely and vendor all 12 files into the repo** (`e830083`).

**Real root cause:** There was never one environment. The HA OS supervisor CLI, the Terminal add-on, BusyBox, the browser's mixed-content policy, Windows' lack of mDNS and Cloudflare Pages' static-asset handling are six distinct systems, and commands were written against an imagined average of them.

**Cost to Jeff:** He is the one who pasted every failing command. This is the incident behind Mandatory Rule 7 — *"Commands must work the first time. Test before telling Jeff to run something."*

**Lesson:** Never hand a command to a human until you know exactly which shell will run it — and if you can't know, vendor the files instead of downloading them.

---

### 9 — The B-Hyve cloud API: `invalid_auth`, 530, 1018

**When:** 2026-06-23 → 2026-06-25. Diagnosed across three days and three sessions.

**Symptom:** Irrigation dead from every direction. First all API URLs 404'd; then the from-scratch HA integration returned `invalid_auth` in its config form.

**Wrong theories / attempts, in order:**
1. **Try another host.** `54ca981` — fall back to `api.bhyve.com/v1` "if orbitonline.com/v1 returns 404 (endpoint may have moved)"; added an iPhone User-Agent.
2. **Try a third host.** `fc73f1a` — added `api2.orbitonline.com`.
3. **Shotgun the auth.** `f904d10` (06-24) — "try all API URLs x app IDs, log full response detail"; three app IDs × multiple URLs.
4. **Suspect the password.** `a887b62` / `84e1ea2` (06-25) — bare redeploys "to pick up the updated BHYVE_PASSWORD secret." A stale Cloudflare secret was genuinely part of the noise.

**Real root causes — four, stacked:**
- **The API had moved.** `d56d92b` — "Old: api.orbitonline.com/v1 → returns HTTP 404 (endpoint gone). New: api.orbitbhyve.com/v1."
- **The body shape changed.** `c203988` — bare email/password returns HTTP 400 with `email: disallowed-key / password: disallowed-key / session: can't be blank`. Correct form: `{"session":{"email":…,"password":…}}`.
- **The headers changed.** `77c70e7` — the new API *rejects* `orbit-api-key` / `orbit-app-id`; it wants browser headers plus `Orbit-Session-Token: ""`.
- **And underneath all of it:** `768cb6a` (06-24) — *"Cloudflare Workers blocked from B-Hyve API (error 530/1018) because B-Hyve's API rejects Cloudflare edge IPs."* No URL would ever have worked from a Worker.

**Fix:** `768cb6a` — an entire custom Home Assistant integration written from scratch in Python (7 files, 448 lines, `beehive/custom_components/bhyve/`) so the calls originate from Jeff's home IP `192.168.1.66`, where there is no block. Auth recipe consolidated in `77c70e7`.

**Cost to Jeff:** Three days of an irrigation section that looked broken, plus a whole new component to install by hand.

**Lesson:** When every URL fails identically, stop changing the URL — the caller's identity is the variable. (And it recurred: the *same* subsystem produced #63 on 08-13, another day burned on the wrong layer.)

---

### 10 — The Blink 2FA dialog that never appeared

**When:** 2026-06-25, evening → 21:49.

**Symptom:** *"SMS code arrived but no dialog appeared."* Jeff got the Blink verification text; Home Assistant never asked for it.

**Wrong theories / attempts, in order:** the ten installer iterations catalogued in #8 — the entire evening was spent fighting the *delivery* of a patched integration, on the implicit assumption that the code was fine and only the install was broken.

**Real root cause:** `b89ba28`, verbatim:

> `BlinkTwoFARequiredError` is a subclass of `LoginError` in blinkpy 0.25.x. The catch-all `LoginError` handler in `validate_input` was converting it to `InvalidAuth` before `async_step_user` could see it, so the 2FA step was never reached.

**Fix:** `b89ba28` — re-raise `BlinkTwoFARequiredError` before the `LoginError` handler. Plus `dbc8fbe`: when `blink.start()` fails silently (`api.available=False`), raise `ConfigEntryAuthFailed` rather than `ConfigEntryNotReady`, "instead of a silent infinite retry loop."

**Cost to Jeff:** An evening of pasting installer commands for a problem that was four lines of exception handling. And this wasn't even the end of Blink — see #21.

**Lesson:** A catch-all exception handler that narrows a subclass into a generic error deletes the only signal you needed.

---

### 11 — LUX thermostat: three wrong backends

**When:** 2026-06-26, 02:10 → 02:52.

**Symptom:** The brand-new CLIMATE section could not talk to Jeff's LUX WiFi thermostat at all.

**Wrong theories / attempts, in order:**
1. **`integration.lux-geo.com`** — the assumed vendor endpoint. Dead: Cloudflare error 1016, DNS failure. (Surfaced only because `7c0d3c5` shipped "Show full LUX API error in banner for diagnosis" first — the right first move.)
2. **`api.geotogether.com`** — `1e43569`, confidently documented with login body `{username, password, clientId}` and "temps stored in Celsius, converted to °F." 403 Forbidden.
3. **Four login variants** — `46d8a36`: "tries android-geo-home, ios-geo-home, no clientId, email field in order." Still 403.
4. **Reverse-engineer the Geo platform properly** — `7f74537`: endpoint casing, `identity` field and `accessToken` response shape derived from the **geo-energy-data-client Go source**. Correct work on the wrong platform.

**Real root cause:** `9eaabcb`, which names the error without flinching: *"Previous code used api.geotogether.com (**UK smart meters — completely wrong**)."* The real backend, found by reading the **luxgeo PyPI package source**: Azure AD B2C PKCE flow at `connecteddevicesjci.b2clogin.com` (client `b335ca43-3bde-4406-b281-8816afb7cc91`) → `https://www.myluxstat.io/api/`. Temps already in Fahrenheit.

Then one more data-shape bug on top: `0c08f2f` — *"userData.location is [] not {} — API returns location as an array of objects."* Found only because `3ce74fa` had added the actual response shape to the error text.

**Fix:** `9eaabcb`; canonised in `CLAUDE.md` under **"LUX Thermostat — API Reference (DO NOT CHANGE UNLESS BROKEN)"** with the full four-step B2C flow and the `systemmode`/`holdheat`/`holdcool`/`fanmode` decoder, "so next session never has to re-discover it."

**Cost to Jeff:** ~40 minutes of a session guessing at endpoints; no money.

**Lesson:** Read someone's working client library before inventing an API — the answer was in a PyPI package the whole time (this is one of the clearest research-beats-guessing wins in the project).

---

### 12 — The LUX PUT-500 saga

**When:** Logged as the top pending item at 2026-06-26 03:13; solved 16:23 the same day — **six attempts.**

**Symptom:** `GET /api/device` worked perfectly. Any attempt to change the setpoint returned **HTTP 500**. `858cd74` parked it overnight with a guess: *"Likely holdcool field name wrong or PUT needs full state object not patch."*

**Wrong theories / attempts, in order:**
1. `c37317d` — GET the full state, modify, PUT the whole object ("API rejects partial updates with HTTP 500"). No.
2. `f09c696` — strip read-only fields before the PUT; clean 4-field body. No. **And `b035ffb`, one minute later, updated `CLAUDE.md` to "mark LUX PUT fix deployed, 26/26 tests" — the tests passed and the API still 500'd for Jeff.** A green suite declaring a broken feature fixed.
3. `9febaec` — minimal one-field body, try PATCH if PUT fails. No.
4. `35f61cc` — device ID in the URL path (`/api/device/{id}`, `/api/devices/{id}`), PUT and PATCH. No.
5. `f143830` — the shotgun that cracked it: full raw state, **try PUT *and* POST *and* PATCH**, report all three results.

**Real root cause:** `b360583`, verbatim: *"POST /api/device is the correct write method. **PUT was always returning 500 (wrong method for this API).**"* Confirmed end-to-end by Jeff — setpoint 73 °F from the HCC app appeared in the official LUX app.

**Fix:** `b360583` — POST first, PUT as fallback. Documented in `CLAUDE.md` within one minute (`07409da`, `33ca88f`).

**Cost to Jeff:** A day of a control he could see but not use, and one premature "fixed" claim he had to disprove himself.

**Lesson:** When a payload theory fails four times, the verb is the variable — and never mark a fix "deployed" in the memory file on the strength of a passing mock test.

---

### 13 — In-app voice control, and Siri dialing contacts

**When:** Built 2026-06-26 16:51; retreated 17:55–18:07; deleted for good 2026-06-27 12:03.

**Symptom:** Two failures at once. `audio-capture` errors killed the feature — and, far worse, `b76ac20`'s own words: the overlay left the mic path open in a way that could let *"Siri … hear ambient speech and dial contacts."* **A home dashboard was phoning people by accident.**

**Wrong theory / attempt:** Pre-grabbing the microphone via `getUserMedia` to force the iOS permission dialog — which `e2f5889` identifies as the root cause itself: *"pre-grabbing the mic … then releasing it left the mic busy on iOS, so SpeechRecognition failed."*

**Real root cause:** Browser `SpeechRecognition` on iOS is not a reliable substrate for voice control, and the failure mode is not "doesn't work" but "hands audio to Siri."

**Fix, in three steps:** `b76ac20` (close the overlay immediately on error) → `e2f5889` (retreat to a tap-to-run panel: "no microphone activates automatically, so nothing can trigger Siri or dial contacts") → `9a2adc6` (delete the whole engine; header mic becomes an **ALEXA** button that opens the real Alexa app — *"so Jeff talks to the real Alexa instead"*).

**Cost to Jeff:** Unwanted phone calls from his own house dashboard. No money.

**Lesson:** When a feature's failure mode reaches outside the app, remove the feature — don't harden it.

---

### 14 — Radar tiles, four engines in four days

**When:** 2026-06-26 → 2026-06-29.

**Symptom:** The weather radar variously showed white background, blank tiles on iPhone, or "Zoom Level Not Supported."

**Wrong theories / attempts, in order:**
1. **Leaflet + RainViewer + CartoDB dark tiles** (`7897790`) — the hand-built version.
2. **Retina flag** (`7da5113`) — CartoDB's `{r}` suffix caused **@2x tile 404s on iPhone HiDPI**, "leaving labels over a white Leaflet default background."
3. **Swap basemap to ESRI** (`5fc66bd`) — because "CartoDB dark_matter tiles were failing (**free tier restricted**)"; needed a custom `getTileUrl` for ESRI's z/y/x order.
4. **OSM + CSS invert** (`4c88027`) — which then "blanked tiles on iOS" (`c294216`), so the invert filter was dropped.
5. **RainViewer itself** — "kept returning 'Zoom Level Not Supported' tiles over an otherwise-fine basemap" (`db575f8`).

**Real root cause:** Hand-building a tiled radar against three free third-party tile services, on an iOS PWA, was the wrong project.

**Fix:** `db575f8` — replace the entire hand-built Leaflet stack with an **embedded Windy radar iframe**: "animated, interactive, pinch-zoom, reliable on iOS PWA, no tile/zoom gremlins." Reaffirmed after a brief detour to static NWS loops (`b34472c`), which also killed a **RadarScope button that was landing on a Zendesk help page, not radar.** One real JS bug found en route: `ReferenceError: radarImgError is not defined` from an `img onerror` firing before the handler was defined (`b33b349`).

**Cost to Jeff:** Four days of an unreliable radar on a weather app built for a trained NWS storm spotter (callsign jlo301).

**Lesson:** Four rounds of tile-provider whack-a-mole is the signal to stop building the component and embed someone else's.

---

### 15 — Light-mode contrast: fixed, re-broken, and only *measured* seven weeks later

**When:** First round 2026-06-29; genuinely closed 2026-08-11.

**Symptom (round 1):** Immediately after the Light/Dark toggle shipped (`28d79c6`) and Style A landed (`8ac220a`), text disappeared in three places in one evening.

**Wrong theory (round 1):** A bulk auto-scan that darkened text "for light mode" wherever it judged the background light. `70643a4` names its own error: *"I had darkened `.meter-num` globally for light mode, but the `.main-meter` panels … are always-black LCD-style displays — their background is a **gradient**, so the earlier auto-scan misread them as 'light' and the dark text vanished on black."* Same class hit the Cast popup (`708d85b`) and turned the NWS alerts card "muddy brown" (`acb4123`).

**Round 1 fix:** `44ea8e8` — a gradient-aware dark-on-dark detector run over every modal, popup and collapsible panel.

**The long tail:** `aa38bc8` (08-03) hit the identical class three more times in the LUX work and logged that *"the same hardcoded-hex pattern exists 100+ more times across the file."* A `CLAUDE.md` note then **guessed**: "most are probably fine (many sit on dark surfaces)."

**Real root cause, measured (round 2):** `af6df04` (08-11) built a contrast auditor that **composites every translucent ancestor** to compute each element's genuinely painted background:

> **19 confirmed failures on genuinely light surfaces** … worst were the credential save/error messages at **1.09-2.9:1** — i.e. "Wrong password" and "Save failed — storage full" were effectively invisible in light mode, exactly the messages you most need to read.

36 sites moved to tokens; sites on genuinely dark surfaces deliberately kept bright hexes ("which is exactly why each had to be measured instead of bulk-replaced"); `--warn` and `--ok` darkened. Two sub-lessons recorded at tip: an `style=` background beats any selector, and *a contrast checker that reads only `backgroundColor` invents failures on any `linear-gradient` element* — the audit tool itself reported 6 false failures before being fixed.

**Cost to Jeff:** Error messages he could not read, for weeks, in the theme that is the **default**.

**Lesson:** A colour audit that doesn't composite the real painted background is not an audit, it's a guess with a number attached.

---

### 16 — mPING: built, killed, restored on request, killed permanently

**When:** 2026-06-26 → 2026-07-03.

**Symptom:** The in-app "report weather to NOAA" form never worked.

**Wrong theories / attempts, in order:**
1. `b7ff936` (06-26) — build a native mPING quick-report card with an 11-button icon grid, GPS, and a `/api/mping` proxy. **Feature built before feasibility checked.**
2. `c294216` (06-28) — discover it needs an NSSL-issued API token; wire `MPING_TOKEN` and show "token not configured."
3. `adc5377` (07-01) — give up, replace with a link to the official tool.
4. `6b29cad` (07-01, eighteen minutes later) — **reverse it on Jeff's instruction**: "Jeff wants the in-app reporting back." Restored byte-exact from git.
5. `f935e31` — write a guide for emailing NSSL to request the token.

**Real root cause:** `5e6c20b` (07-02) — *"NSSL confirmed **no automated/app reports ever**, so repurpose that card to the official mPING app instead of chasing a token."* No token was ever going to exist, for anyone.

**And one more wrong link on the way out:** `01b4e8e` (07-03) — the replacement buttons pointed at `mping.nssl.noaa.gov`, *"which is just the map page — you can't submit there."* Repointed at the official iOS app (id584383400).

**Cost to Jeff:** He asked for a feature back that could never work, and was given a token-request guide for a token that doesn't exist.

**Lesson:** Check whether the API exists before building the UI — and when a user asks for something impossible back, the honest answer is the feasibility, not the restore.

---

### 17 — The B-Hyve watering history "definitive dead end," reversed in eleven minutes

**When:** 2026-07-01, 02:46 → 03:58.

**Symptom:** The irrigation card permanently read "No history" / "No last watered."

**Wrong theories / attempts, in order:**
1. `4b0d00e` — the device object has no last-watered field; add a `/watering_events` fetch. 404.
2. `7308c23` / `158666a` — build `?debug=1` and then `?debug=2` endpoints so **Jeff can screenshot the raw API response** and pinpoint the field. (Two days before the Debugging Protocol outlawed exactly this pattern.)
3. `61692a7` — pivot to `status.watering_status` / `watering_statuses`. Both empty.
4. `2a2eb76` — **declare it impossible**: *"Confirmed from Jeff's device: B-Hyve's REST API does NOT expose watering history."* Fall back to self-tracking. `d5df6e9` wrote this "definitive" finding into `CLAUDE.md`.

**Real root cause:** `379b13d`, **eleven minutes after the dead-end was committed to memory**:

> Web research (pybhyve / bhyve-home-assistant) confirmed the real B-Hyve history endpoint puts the device id in the PATH: `GET /v1/watering_events/{device_id}` (with pagination). My earlier `?device_id=` query form 404'd — that was the whole problem. … So the history IS pullable after all.

**Fix:** `379b13d`; memory corrected by `1d23b5d` ("endpoint found (path form), not a dead end"); confirmed live in `b947011` — "Last Watered confirmed working (reads 7:30 AM)."

**Cost to Jeff:** Screenshot round-trips for a fact that was in open-source code, plus a false "impossible" written into the project's memory where it would have poisoned every future session had it survived eleven more minutes.

**Lesson:** A 404 proves your URL is wrong, not that the data doesn't exist — and never write "definitive" into memory about someone else's API without reading someone else's client first.

---

### 18 — The shared-`AbortSignal` false offline — the one Jeff called out

**When:** 2026-07-03. Introduced hours earlier while wiring Nabu Casa; fixed 09:24.

**Symptom:** Red dot, "Beehive Offline," and the water/gas meters stuck on "Waiting" — with a perfectly healthy Home Assistant. Jeff debugged his own network and his own HA.

**Wrong theory:** That anything was wrong with Jeff's setup at all. Jeff identified the bug.

**Real root cause:** `0f44d9d`, first line of the body, in the first person:

> **Regression I introduced when wiring Nabu Casa:** checkBeehive built ONE `AbortSignal.timeout(2500)` and reused it across all candidate fetches, so the 2.5s was a total budget for every attempt combined — and once elapsed, later fetches aborted instantly. Over the Nabu Casa remote relay a single /api/ call often takes >2.5s, **so a perfectly reachable HA was reported offline (red dot), which also stopped the meters from loading.**

**Fix (two levels):**
- **Immediate:** `0f44d9d` — a fresh signal per attempt, timeout raised 2.5 s → 9 s, `r.ok` checked before parsing.
- **Architectural, 17 minutes later:** `7a59848` — *"Route HA connection through a server-side /api/ha proxy (durable fix)"*: **"The app talked to Beehive directly from the browser, which meant fighting mixed content, CORS, and the Nabu Casa relay tripping browser fetch timeouts — the whole class of 'Beehive Offline / meters Waiting' problems. Irrigation and weather never had these because they go through Cloudflare Functions (server-to-server). Now HA works the same way."** Every later HA feature in the project rides that proxy.

**Cost to Jeff:** Time spent diagnosing his own house for a bug shipped hours earlier — and, by his own account, the last straw on the "round robin." Jeff, verbatim (`f668301`):

> *"Log this so we don't go through this kind of round robin of checks again and we attack the source… **I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end.**"*

**What it produced:** The **PROTECTED Debugging Protocol** (`f668301`) and Mandatory Rule 12 — six steps, still at tip. Step 1 contains the confession in writing: *"Run the Playwright harness with mocked data to reproduce the failure and prove the fix… **I did this AFTER Jeff called me out on the timeout bug — it must come FIRST.**"* And a named anti-pattern: *"Never hoist a shared `AbortSignal.timeout` across retries."*

**Lesson:** Your own most recent change is the prime suspect — reproduce it on your end before you make the user prove it exists.

---

### 19 — "Beehive Offline," the legitimate one

**When:** 2026-07-02 → 2026-07-03 01:17.

**Symptom:** The app could never see Home Assistant, even on home WiFi.

**Real root cause — three blockers stacked, each hiding the next:**
1. **Mixed content.** `f754540` — "the https PWA can't fetch the local http HA (mixed content / LAN-only)." Fixed by giving HA a public HTTPS URL via Nabu Casa (`947a99d`).
2. **No auth.** The same commit: `checkBeehive` "now sends the bearer token since HA /api/ requires auth."
3. **CORS.** `3043f34` — the third and silent one: HA's `configuration.yaml` needs `http: cors_allowed_origins: [https://toro1-5rz.pages.dev]`. Described in the commit as *"the silent blocker that makes a valid setup still read as 'offline'."*

**Plus a chicken-and-egg UI bug found in the same commit:** the HA-token input box only appeared once the app was already online — so with no token, it never appeared, and there was no way to enter one.

**Fix:** `947a99d` + `3043f34`; milestone logged `410ccc5`. Then killed as a *class* by the `/api/ha` proxy (`7a59848`) — see #18.

**Cost to Jeff:** He edited `configuration.yaml` by hand via the File editor and restarted HA.

**Lesson:** Three independent blockers on one connection path will always be diagnosed one at a time unless you remove the path itself.

---

### 20 — The water meter that read 202.6 gallons

**When:** 2026-07-03 01:37.

**Symptom:** The Water card showed **202.6 gal** where the meter said **12,982.5**.

**Real root cause:** `338e2c3` — rtlamr2mqtt publishes both `sensor.water_meter_reading` *and* `sensor.water_meter_last_seen`. `meterRaw()` keyword-matched both and took the last numeric value: **`parseFloat('2026-07-03T…') = 2026`**. The displayed number was a *year*.

**Fix:** `338e2c3` — skip `*_seen` / `*time` / timestamp-device-class entities, require a pure-numeric state. Entity ids corrected in docs by `a101465`.

**Cost to Jeff:** A wrong number on the utility he is building a legal refund case around.

**Why it belongs here:** it is the first instance of the project's single most common bug shape — **substring matching across a shared entity namespace** — which recurs at least five more times (see #31).

**Lesson:** `parseFloat` on an unvalidated string will always find *a* number, and it will be wrong.

---

### 21 — Blink login: the cookie theory, and then our own override became the bug

**When:** 2026-07-03 → 2026-07-09. Blink cameras were **Jeff's #1 priority feature** (`17d388a` says so explicitly) and were broken for over a week.

**Symptom:** HA log: "Login failed." No SMS PIN dialog. Then `ConfigEntryNotReady` retrying roughly every 10 seconds, for days.

**Wrong theories / attempts, in order:**
1. **`empty_cookies` / shared aiohttp session.** `f3ae126` (07-03) — drawn from upstream issues blinkpy #1217 and home-assistant/core #173419, the theory was that HA's shared session drops auth cookies between the password step and the PIN step. A dedicated client session with its own cookie jar was written into a **custom `custom_components/blink/` override**. The commit was honest that it could not be verified ("it needs a live Blink account + Amazon's auth servers") — and it was wrong.
2. Building the override at all — which became the *second* bug.

**Real root cause, part 1:** `1f2cdec` (07-03), found by diffing blinkpy inside the test harness:

> Blink changed their OAuth signin to signal 2FA-required with **HTTP 202 + tsv_state/tsv_methods** fields. blinkpy 0.25.2's `oauth_signin` only recognizes the OLD 412 code, so it returns None → `_oauth_login_flow` logs 'Login failed' → `ConfigEntryNotReady`. That's exactly Jeff's log. blinkpy 0.25.7 added 202/tsv handling.

The same commit kept the session tweak "as belt-and-suspenders but corrected its comment (**the cookie theory was the wrong diagnosis; the 202 handling is the fix**)."

**Real root cause, part 2 — the sting in the tail:** `9b29c1f` (07-09), title: *"Blink: record real root cause + official fix (blinkpy 0.25.6 / HA 2026.6.4); **our custom override is now the blocker**."* Upstream had shipped the fix (blinkpy PR #1231 → HA core PR #173811, "no HA-side changes needed"), and the project's own July-3 override was now **shadowing HA's fixed built-in with stale code**: "the log's `ConfigEntryNotReady` is from OUR `coordinator.py:58`."

**Fix:** `7bbc8a2` (07-09 15:11) — `rm -rf /config/custom_components/blink`, delete the broken config entry, update HA, re-add the **built-in** integration → the SMS PIN finally appeared → all six cameras live. Standing rule recorded: *"**DO NOT ever re-add a `custom_components/blink` override — that override shadowing the fixed built-in was the entire bug.**"*

**Cost to Jeff:** Over a week without his most-wanted feature, plus a real side-effect the record flags: *"our old code has hammered Blink's login every ~10s for days → account may be rate-limited"* — hence the instruction to wait ~30 minutes after deleting before re-adding.

**Lesson:** A local workaround for an upstream bug has an expiry date, and nobody sets a reminder — when upstream ships, your patch becomes the outage.

---

### 22 — `packages/hcc.yaml` had never been loaded by Home Assistant. Ever.

**When:** Discovered 2026-07-10/11 by the coworker session on Jeff's PC. The file had existed since 2026-06-23 (`75a7afd`).

**Symptom:** `hcc_panic_button`, `hcc_mower_sensor_sync`, `hcc_freeze_warning`, `hcc_severe_weather_alert` all showing "unavailable" in HA.

**Wrong assumption:** That valid YAML in the right folder is loaded. It isn't.

**Real root cause:** `76ae463`, verbatim:

> **`packages/hcc.yaml` was never actually loaded by HA at all** — `configuration.yaml` had no `homeassistant: packages: !include_dir_named packages` directive, so despite being valid YAML the whole file was silently ignored. **This is why … they showed "unavailable" — they were ghost/restored entities that had never truly run, ever.**

**Fix:** `76ae463` — add the directive; "**all 6 automations (4 old + 2 new) came alive simultaneously.**"

**Cost to Jeff:** Every Home Assistant automation the project believed it had shipped in its first three weeks — including **the panic button** — had never once run. The record does not say whether anyone tested the panic button in that window.

**Lesson:** "Valid config" and "loaded config" are different claims; only the second one is worth reporting.

---

### 23 — Windows Firewall silently ate port 32168

**When:** 2026-07-10.

**Symptom:** Beehive's AI detection requests to CodeProject.AI on the beast "just timed out with no useful error."

**Real root cause:** `76ae463` — the CodeProject.AI installer never added an inbound firewall rule, so nothing outside the beast itself could reach port 32168.

**Fix:** `New-NetFirewallRule` for TCP 32168 — "fixed instantly."

**Cost to Jeff:** None directly; it was found during setup. Included here because it is one half of the pair of infra bugs found in a single session (with #22), both of which were invisible failures rather than errors.

**Lesson:** A timeout with no error text is a firewall until proven otherwise.

---

### 24 — CodeProject.AI's three-day silent death

**When:** Died at the beast's reboot on 2026-07-11 ~06:08; found 2026-07-14 12:45. **~3 days of no AI camera detection.**

**Symptom:** Jeff reported the cameras and Fire TV were "not working as intended" — *despite the 07-11 changelog claiming both were confirmed working.*

**Why nobody noticed:** This is the important part. `c13f101`'s forensic detail:

> "AI Camera Scan on Motion" has kept firing normally (most recently 32 min before this check) — so Blink motion sensors + the scan trigger are fine — but "AI Object Detected Notify" and "AI Show Camera on Fire TV" both show **"Last triggered: 3 days ago."**

The upstream half of the pipeline kept running perfectly, so every dashboard and health check looked alive while the middle of the chain was dead.

**Real root cause:** `c13f101` — *"CodeProject.AI Server's Automatic startup didn't survive the 07-11 reboot, silently breaking AI detection since that day."* The 07-10 firewall rule was still correct; only the Windows service was down.

**Fix:** `c13f101` — `Start-Service` immediately, then hardened with **Automatic (Delayed Start) + failure-recovery actions** "so it doesn't die silently again."

**Cost to Jeff:** Three days of no security AI on a house, and he was the one who reported it.

**Lesson:** If the first stage of a pipeline keeps firing, nothing will tell you the last stage is dead — monitor the *output*, not the trigger. (This exact lesson had to be learned again on 08-15; see #58.)

---

### 25 — The Fire TV pop-up + pause/resume long war

**When:** 2026-07-11 → 2026-08-14. The single longest-running feature fight in the project: **four consecutive mechanisms, each declared working and each disproved by live test**, before the whole approach was replaced by Apple TV.

**Symptom:** Jeff wanted a camera pop-up on the TV when a person or car was detected, and for the show to pause and resume around it. What he got, in sequence: nothing; a pop-up that cold-started his DVR to the menu; a pause that didn't pause; a pop-up 3–4 minutes late; then a wrong frame.

**Round 1 — the Alexa route.** `c926ceb` (07-11) recorded a **considered-and-rejected** option first: a native Alexa Routine (Blink motion → "Show Camera") was rejected because it bypasses HA entirely, losing AI classification, the per-camera mute helper and family-arrival suppression. Chosen instead: `alexa_media_player` injecting `media_player.play_media` with `media_content_type: custom` and `media_content_id: "show me the driveway camera"`.
- `987e804` (07-11) — declared "confirmed-working," Jeff watching the screen.
- `a88ccc6` (07-11) — automation shipped, "**confirmed working end-to-end**," verified twice.
- `b108a6e` (07-14) — **retested with the AI pipeline healthy: it had never worked.** *"Phone push confirmed working both tests. TV pop-up did not appear either time, even on the correct HDMI input."* Ruled out camera-Alexa linking (checked in the app) and the phrase (Jeff spoke *"Alexa, show me the 301 driveway camera"* out loud and it worked). Real cause: **`alexa_media_player`'s synthetic command is not equivalent to a real spoken command** — Amazon's cloud doesn't honour it for cross-device camera display. The 07-11 claim was formally retracted rather than quietly dropped. **INFERRED:** the record never explains why the 07-11 test appeared to succeed; it only proves the 07-14 failures.

**Round 1b — the second dead end:** Blink's official Fire TV app is *incompatible with Jeff's stick model* — confirmed via the Amazon Appstore listing's own compatibility check, "red ✕ next to 'Jeffrey's Fire TV'." Sideloading declined.

**Round 2 — ADB browser launch.** `25e3256` (07-14): `androidtv.adb_command` opens the camera's `entity_picture` URL fullscreen in the Fire TV's Silk browser, then an 8-second-delayed HOME keypress returns. Proved by **screenshotting the Fire TV over ADB** and by Jeff physically watching. Sub-bug found and fixed inside the same commit: `input keyevent 4` (BACK) "only partially exited the browser, confirmed via ADB `mResumedActivity`" — HOME (`keyevent 3`) is the reliable return. Tradeoff accepted knowingly: full-screen takeover, not a toast overlay ("that would've needed the original Kodi plan").

**Round 3 — the pause that never paused, and the relaunch that destroyed his DVR position.** `3a714fe` (07-15):
- The ~5-minute alert delay was **Blink's own default cloud poll**, not anything recent — fixed with a 30-second `homeassistant.update_entity` fast-poll automation.
- Auto-relaunching FuboTV via `monkey -p … LAUNCHER 1` **cold-starts the app to the show list**, discarding playback position: "meaning Jeff had to restart the recording from scratch and fast-forward back to where he was."
- `input keyevent 187` (APP_SWITCH) — "doesn't work on this Fire OS build's launcher."
- Settled on plain HOME, accepting one manual tap.

Then `2965b5a` (07-15), the third-time's-the-charm and the most quotable confession in the thread:

> The old `AI Show Camera on Fire TV` automation sent `input keyevent 127` hoping it would pause playback — **confirmed via live testing this does nothing** (checked `dumpsys media_session`: Fubo's position kept advancing, state stayed "playing"). It had never been verified working — **a repeat of the exact "declared done without testing" pattern the whole debugging protocol exists to prevent.**

Real fix: `adb shell cmd media_session dispatch pause` — the Android MediaSession API, system-wide. Verified frame-by-frame on a real Fox News DVR recording: "paused at 335890ms, resumed at 343307ms." Because it is system-level rather than app-specific, Jeff's later **Fubo → Sling switch required zero automation changes** (`131dc16`) — a rare case of the right fix paying a dividend.

**Round 4 — PiPup, and the wrong frame.** `a001f2e` (07-31) replaced the full-screen takeover with PiPup picture-in-picture pushing the actual annotated frame. `f07048f` (08-03) then found the popup was showing the **wrong frame** — "blinkpy's motion state reflected the live feed, not the actual clip" — fixed with new `camera.*_clipframe` helper entities and real clip extraction (which immediately caused #31's twelve-tile bug). `f1d24f3` (08-01) traced the remaining 3–4 minute real-world delay and published an honest negative: the HA-side chain completes in **under 1 second**, so the lag is upstream in Blink's cloud — *"Not resolved — needs a real timestamped incident to trace further."*

**Round 5 — abandonment.** `c95457a` / `9426623` (08-14) moved TV pop-ups to the **Apple TV via HomeKit**, after rejecting an Apple TV jailbreak ("dead — A15/tvOS18.6") and two Blink RTSP bridges ("worse than status quo"). The winning insight, and the thing that had defeated several sessions:

> **`linked_motion_sensor` alone is NOT enough.** Motion earns a phone notification but does NOT interrupt the TV. HomeKit reserves the picture-in-picture screen takeover for **DOORBELL** events… **Fix: point `linked_doorbell_sensor` at the SAME motion sensor.**

Measured on 08-15 by camera-pointed-at-the-TV: motion → popup **4.7–6 seconds**, photographed three times (`c5a6aab`).

**Cost to Jeff:** Roughly five weeks of a headline feature that was announced working at least three times before it was; a DVR recording he had to restart and fast-forward every time a car went past; and — per `2965b5a` — a direct repeat of the exact behaviour the Debugging Protocol was written to stop.

**Lesson:** "Verified with Jeff watching" is not verification if the mechanism was never instrumented — check `dumpsys`, screenshot the device over ADB, or don't claim it.

---

### 26 — Two contradictory plans for the same feature, live at once

**When:** 2026-07-10 → 2026-07-14, three days.

**Symptom:** The plan document said the TV pop-up would go through **Kodi on the beast**; the running system used the **Fire TV / Alexa route that the plan explicitly ruled out**.

**Real root cause:** A decision made on 07-10 ("**NOT** simple ADB from Beehive to Fire TV — Jeff wants it routed through the beast") was written into `docs/home-theater-ai-plan.md` on **07-12** — a day *after* the 07-11 session had already built the Fire TV path. Neither session saw the other's ground truth.

**Fix:** `c13f101` (07-14) — the audit found Kodi *"was installed on the beast but only ever launched once, for about 3 minutes, then never touched again (its own log confirms this; `kodi.log` starts and ends 07-11 6:11–6:14 AM)"*; its web server was never enabled; no Kodi integration ever existed in HA. Jeff chose to keep the Fire TV path; the Kodi doc was demoted to *"reference/superseded, not a live setup guide."*

**Cost to Jeff:** Three days in which any session reading the docs would have built the wrong thing.

**Lesson:** A plan written after the build is not a plan, it's a contradiction with a date on it — and it is the same failure as #64, eleven weeks earlier.

---

### 27 — The HA config editors that corrupted YAML

**When:** 2026-07-11 (three in one day), near-miss 07-14, technique adopted 08-01, still biting 2026-08-16.

**Symptom:** `packages/hcc.yaml` — the file holding every HCC automation — repeatedly corrupted mid-edit.

**The instances, in order:**
1. `987e804` — the **legacy File Editor add-on** "mishandled a special keypress (typed literal `Page_Up` text into the file)," caught before saving.
2. `a88ccc6` — **Studio Code Server** typed a literal `Page_Down`.
3. `a88ccc6` — **Prettier format-on-save truncated** the new automation's long single-line flow-style YAML.
4. `25e3256` (07-14) — Monaco "had a focus-stealing UI glitch mid-session that nearly caused a bad edit, caught via `check_config` before it reached disk."
5. `docs/SESSION_START.md` at tip: *"a selection one character too wide silently broke YAML on **08-16**."*

**Real root cause:** Dense flow-style YAML edited through GUI editors that reformat, autocomplete or mis-handle keystrokes — with `ha core check` as the only thing standing between a typo and a dead house.

**Fix / doctrine:** `a88ccc6` — use the **Terminal add-on** with `sed`/heredoc for this file; if using Studio Code Server, `editor.formatOnSave: false` first. Refined further by `2765386` (08-01), which edited `configuration.yaml` via the code-server *integrated terminal* using `python3` with an "exact-string match + `assert count==1` before writing" — the strongest form of this discipline in the record. Also noted: package-defined automations **cannot** be edited in HA's Automations UI, which only offers a "Migrate" button — *"do NOT click this without asking Jeff."*

**Cost to Jeff:** None realised — every corruption was caught by `ha core check` before it shipped. Recorded here because it happened five times over five weeks and the tooling never became safe.

**Lesson:** Verify every GUI edit by reading back what actually landed; the editor is a participant in the change, not a window onto it.

---

### 28 — The stale-content deploy mystery

**When:** 2026-06-23 → 2026-07-21. **Two months. At least six announced fixes.** The longest-running self-inflicted bug class in the project.

**Symptom:** Jeff opens the app, sees an old build, and reports a bug that has already been "fixed." Repeatedly. For weeks.

**Wrong theories / attempts, in order:**
1. `4f96d09` (06-23) — bump SW cache to hcc-v2, network-first for `/api/*`.
2. `8497827` (06-23) — bump to hcc-v3, "force cache clear."
3. `19dd459` (06-26) — network-first for HTML. The commit body is itself an admission of scale: *"Cache-first on index.html meant the old cached copy ran forever and **no code fix ever reached the device — including the voice mic fix**."*
4. `24df1fc` (07-10) — bump to hcc-v7 to fix "Windows stale cache."
5. `c926ceb` (07-11) — a *correct* local diagnosis for one instance: both domains byte-identical (532,663 chars each), the culprit a stale `service-worker.js` in Jeff's Chrome profile. Real, but not the class.
6. `173270a` (07-20) — **claims root cause**: `service-worker.js` was served with Cloudflare Pages' default `max-age=14400` (4 h), so "browsers could go hours without even requesting the new version." A new `_headers` file sets `Cache-Control: no-cache`. It worked on `toro1-5rz.pages.dev` and **not on `loewenhome.com`** — explained away as "custom-domain header propagation lag" (`71cc052`). *No amount of waiting fixed it.*
7. `70dba84` (07-21) — the second third of the answer: the SW's network-first HTML fetch was itself going through the browser HTTP cache, so — the best one-line summary in the record — **"'network-first' was actually 'stale-cache-first'."**

**Real root cause — two independent things, neither of them the browser cache:** `e37a193` (2026-07-21 15:58):

> **1.** Cloudflare CDN caches JS files at the edge (`cf-cache-status: REVALIDATED`) and **ignores `_headers` rules for cached copies**. The `_headers` worked for HTML (`cf-cache-status: DYNAMIC`) but not for `service-worker.js`. → needs the separate `CDN-Cache-Control: no-store`.
> **2.** SW registration with `updateViaCache:'none'`.
> **3.** **Registration was missing from index.html entirely — new visitors weren't getting a service worker at all.**

Layer 3 is the jaw-dropper: `index.html` had **no `navigator.serviceWorker.register(...)` call**, so every cache-version bump from hcc-v2 through hcc-v11 and all the network-first logic had been **moot for any new visitor** for two months.

**Fix:** `e37a193`; documented and closed in `6f517ac`, which verified on the real custom domain (`cf-cache-status: BYPASS`) and left the standing rule: *"**check `cf-cache-status` on the live custom domain, not just `Cache-Control`** — Cloudflare's edge cache and the browser's HTTP cache are controlled by different headers and must both be addressed."*

**Cost to Jeff:** Weeks of testing an old build and reporting bugs that were already fixed — the most corrosive possible cost, because it made *every* "it's fixed" claim untrustworthy. Even after the fix, `1d6c109` (08-10) records him sending a screenshot of a stale cached build.

**Lesson:** Six fixes to the same symptom means you are fixing the wrong layer — go read the actual response headers on the actual URL the user opens.

---

### 29 — Safari 15 froze the whole app

**When:** 2026-07-15. Discovered the day Jeff's iPad Air 2 arrived to become a wall display.

**Symptom:** Jeff pasted a valid HA token into the iPad and *"it just sat on 'Checking…' indefinitely — no error, no timeout, nothing."*

**Real root cause:** `33d367d` / `af3b16a`:

> **`AbortSignal.timeout()` was only added in Safari 16 — it does not exist at all in Safari 15.** Every `haFetch()` call in the app (18+ call sites) uses it, so on Safari 15 the very first call throws a synchronous `TypeError` **before the promise chain's `.catch()` can ever run.**

The iPad Air 2 is permanently capped at iOS 15.8.6, so it was the first device in the project ever to hit it.

**Fix:** A ~10-line `AbortController`-based polyfill at the top of the script block — "a zero-call-site-changes shim rather than touching all 18 call sites individually." Verified in a real browser console *before* deploying (native `AbortSignal.timeout` deleted, polyfill's abort behaviour observed, a real fetch completed through it), and the file swept for other post-Safari-15 APIs (`AbortSignal.any`, `structuredClone`, `Array.prototype.at`) — "none found, this was the only landmine."

**Process note recorded honestly:** this crossed the Rule 13 boundary — `index.html` was the cloud session's exclusive lane — and `af3b16a` documents the exception and why it was taken (Jeff actively blocked in the same conversation, 11-line isolated fix).

**Cost to Jeff:** A brand-new wall display that appeared dead on arrival.

**Lesson:** A synchronous throw beats your `.catch()` — and a device two OS versions behind is a compatibility test nobody wrote.

---

### 30 — The iPad wall display declared "fully set up"

**When:** 2026-07-15 11:07 (claim) → 11:54 (retraction). Still unconfirmed at the end of that window (`e61e920`, 07-21).

**Symptom:** `3644f54` declared the wall display *"fully set up, confirmed working."* `3b157b9`, forty-seven minutes later: *"Prior entry said 'fully set up' prematurely. Real state: still working through a token-persistence issue."*

**Wrong theories / attempts, in order:**
1. **Blame Safari storage.** Repeated rounds of "clear Safari site data" — described by the record itself as *"my earlier bad advice, solving an already-fixed problem."* Each round **wiped the HA token**, forcing Jeff to mint a brand-new Long-Lived Access Token on the device (HA only shows a token's value once). The result was a pile of orphaned tokens: two both named "Ipad," then "HCC ipad token," "plus older unrelated ones (HCC 3, HCC long term token, HCC1, HCC)."
2. **Assume Add-to-Home-Screen existed.** It didn't — everything was happening in **plain Safari**, which is subject to Apple's 7-day ITP storage-clearing timer; standalone Home Screen web apps are exempt. So the storage was always going to evaporate.

**Real root cause:** The setup was declared complete before the standalone icon existed, and the diagnostic advice given in the meantime actively destroyed the state being diagnosed. Left mid-investigation at a context limit on Jeff's report, quoted verbatim: *"the rest of the pages did not log in."*

**Fix:** No clean fix commit — `3b157b9` is a retraction and a handoff. The record within this window never shows the iPad setup reaching final confirmation.

**Cost to Jeff:** Minting HA tokens by hand, repeatedly, on a device he had bought specifically for this.

**Lesson:** Never issue "clear your site data" as a diagnostic step when the site data *is* the credential — and never write "fully set up" before the user says it works.

---

### 31 — Entity cross-contamination: the project's most-repeated bug shape

**When:** 2026-07-21, 2026-07-21 (again), 2026-08-03, 2026-08-08, 2026-08-15. **Five separate instances of the same defect over eight weeks**, each fixed locally, none generalised until the fourth.

**The instances:**

1. **CAR windows ↔ house windows (`6464a8e`, 07-21).** *"The CAR section's `find('window')` was matching ALL binary_sensors with 'window' in their name — including house window contact sensors from HA. A house window reporting 'on' (open) made the CAR section falsely say 'Window open.' **Same cross-contamination in reverse:** Guardian's door/window check was counting Mercedes car window entities as house windows."*
2. **CAR locks ↔ house locks (`9647ca5`/`6aeba2f`, 07-21).** `val('lock.')` matched any lock entity. The safety-relevant half: **`carLockCmd()` could have sent a lock/unlock command to a house lock instead of the car.** Night Check also counted the Mercedes as a house lock.
3. **12 camera tiles instead of 6 (`83a23cd`, 08-03).** The coworker's PiP fix added six `camera.<cam>_clipframe` helper entities — a legitimate HA-side change. `loadCameras()`, `blinkRefreshAll()` and `blinkReloadStills()` matched **any** `entity_id` starting with `camera.`, so the app rendered 12 tiles, "mixing real live Blink feeds with static single-frame helpers and silently failing `blink.trigger_camera` calls against the 6 fake ones during 'Refresh All'." The changelog explicitly refuses the easy out: *"**Not the coworker's mistake** — the HA-side entities are legitimate and needed for their fix; our app's camera-listing code just had no concept of 'internal helper camera'."* Fixed with `isUserCamera()`.
4. **Range Remaining showed 0 mi (`af8a9ec`, 08-06).** The loose keyword matcher picked `sensor.gle_350_eco_score_bonus_range` (0.0) over `sensor.gle_350_range_liquid` (524).
5. **12 tiles again (`72e5d56`, 08-15).** The new `camera.ai_*` helper entities weren't covered by `isUserCamera()`, which only excluded `_clipframe` — *"the same class of bug as the 08-03 clipframe leak."* Fixed by excluding both families and verifying against the real entity list.

**Real root cause (all five):** Home Assistant is one flat namespace shared by the house, the car, the mower, the cameras and every internal helper — and the app identified entities by substring.

**Fix / rule:** `6aeba2f` — *"**Always scope CAR entity lookups to Mercedes/GLE/mbapi to prevent house-entity bleed.**"* Plus `isUserCamera()` maintained as an explicit allow/deny list. `a1a65fe` (08-08) shows the lesson finally landing *before* the bug: `loadGarage()` was written to understand three distinct entity shapes and to detect the on = closed inversion trap **in advance**.

**Cost to Jeff:** False alarms about his own house, a camera grid he described as "all messed up," and — unrealised but real — a car button that could have thrown a deadbolt.

**Lesson:** Substring matching in a shared namespace is not a lookup, it's a lottery.

---

### 32 — The `*_closed` inverted-semantics false positive

**When:** 2026-07-21 23:18, tail end 2026-07-22 00:04.

**Symptom:** The CAR section reported "Window open" when every window was shut — and kept doing so *after* the entity-scoping fix in #31.

**Wrong theory:** That scoping to Mercedes entities (`6464a8e`) was the whole fix. It wasn't; the false positive survived it.

**The diagnostic step that separated them:** `c50fcf7` — *"Show which Mercedes window is reported open instead of generic 'Open'"* — "so Jeff can tell if it's a real window, the sunroof tilt, or stale data." Naming the specific window is what exposed that the *state reading itself* was inverted.

**Real root cause:** `502bcff`, verbatim: *"`binary_sensor.gle_350_windows_closed` uses inverted semantics where **on = closed, off = open**. The old code assumed on = open for all window entities."*

**Fix:** `502bcff`, plus `52e492f` (07-22) for a *second* window check in the status banner that still used the old logic. Lesson written into `CLAUDE.md` (`e61e920`): *"always check mbapi2020 entity naming conventions — `*_closed` entities invert on/off semantics."* Applied pre-emptively four weeks later in `garageSensorIsOpen()` (`a1a65fe`).

**Cost to Jeff:** A car alarm banner crying wolf; no money.

**Lesson:** An entity whose name ends in a state word is telling you its polarity — read the name before reading the value.

---

### 33 — CAR commands built on guessed entity names

**When:** 2026-07-22, 00:08 → 02:19. Six commits in two hours.

**Symptom:** Jeff got a burst of new car controls — REMOTE START, MAX COOL, MAX HEAT, lock/unlock — and **not one of them worked.**

**Wrong theories / attempts, in order:**
1. **Ship the buttons against guessed entity names.** `22d907f`, `596ec69`, `782277b`, `2820cdc`, `bfccb3b` — five commits of features built on `_grdStates` keyword guesses. `8d339ee` names it: *"Root cause: all car command functions … were searching `_grdStates` with narrow keyword guesses that didn't match real mbapi2020 entity names, so every button failed."*
2. **Search discovered entities instead.** `8d339ee` + `59db50e` (a "Mercedes Entity Scan" diagnostic). Better — but still the wrong API layer, still entity-fishing.

**Real root cause:** `778f6bd` — mbapi2020 does not expect entity manipulation at all; it exposes **domain services keyed by VIN** (`mbapi2020.engine_start`, `doors_lock`, `doors_unlock`, `sigpos_start`, `auxheat_start`, `temperature_configure`). Found by *"Thorough research of mbapi2020 GitHub repo, README, source code (client.py, switch.py, lock.py, button.py, services.yaml, const.py), HA community forums" — "research-first, per Jeff's directive."*

**Three more findings that only source-reading produced** (`71d0dc2`): `temperature_configure` wants **string** select values (`"16"`, not `16`); pull mode (WebSocket disconnected) rejects **all** commands with 400; and HA's 200 OK "only means 'accepted' not 'Mercedes executed it'" — so success messages were rewritten to say "Command sent" with a 30-second expectation. Plus the setting that was actually blocking everything: **"Disable Capability Check"**, off by default, blocks North American vehicles — *"was why all commands except flash lights failed"* (`c64d0f8`).

**Fix:** `778f6bd`, hardened by `778fe00` (real HTTP status + HA error text instead of a generic "Failed") and `71d0dc2`.

**Cost to Jeff:** A tab full of dead buttons on his own car for two hours, and a "Disable Capability Check" toggle he had to find and flip himself.

**Lesson:** *"Never guess entity names or service calls — research the integration's actual source code and use domain-specific services with known parameters"* (`CLAUDE.md`, `ebd2a3a`).

---

### 34 — The mbapi2020 PIN prompt mistake

**When:** Added 2026-07-24 11:55; removed 2026-07-24 12:35. **Consequences ran until 2026-08-06 — thirteen days.**

**Record correction, stated up front:** the planning notes for this archive cite hashes `de32a4b → bc81c84` for this episode. **Those hashes do not exist anywhere in this repository** (verified with `git log --all`). The real commits are `eeaa0b7` → `c73e32e`.

**Symptom:** A PIN modal blocking every PIN-gated car command.

**The sequence:**
1. `eeaa0b7` (11:55) — *"Add Mercedes PIN prompt for remote start, unlock, and other PIN-required commands."* PIN saved in `localStorage`, prompts across the CAR section.
2. `c73e32e` (12:35) — *"Remove app-level PIN prompts — mbapi2020 handles PIN from integration options."*

**Real root cause of the mistake, in the record's own first person (`c64d0f8`):**

> **Root cause: I added `carPromptPin()` wrappers that blocked commands with a PIN input modal, but mbapi2020 handles PIN from its integration options automatically — the app should never send a `pin` field.**

**And the far more expensive second-order effect:** the prompts were removed on the strength of a `CLAUDE.md` sentence — *"stored in mbapi2020 integration options in HA - services auto-use it"* — that **nobody had verified**. The mechanism was right; the fact was not. `adcf16c` (08-06) states the bill: these features *"have been dead since the 07-24 change that removed the app's PIN prompts on the strength of a CLAUDE.md claim that turned out to be wrong."*

**Fix:** `c73e32e` for the prompt; the real unblocking took until 08-06 (#35). The dormant client-side PIN code was later deleted outright as a trap (`8501360`, 07-31): *"Left as dormant code it was a trap for a future accidental re-wire."*

**Cost to Jeff:** **Two weeks of dead remote start, unlock, windows and sunroof** on a car he uses daily.

**Lesson:** Removing a working safeguard because the memory file says it's redundant is trusting a sentence nobody tested — verify the fact, not just the mechanism.

---

### 35 — The Mercedes PIN saga: two confident wrong answers, then the truth

**When:** 2026-08-06, 12:41 → 13:50 CDT. Five commits, **two of which explicitly correct the previous one.**

**Symptom:** Every PIN-gated command (remote start, unlock, windows, sunroof) failing. Flash lights worked.

**Wrong theories / attempts, in order:**
1. **"The PIN was never entered."** `473f122` — checked `config_entries/get` over the WS API, saw an empty `options` dict, told Jeff the PIN had never been set.
2. **"RIS_PIN_INVALID means the stored PIN is wrong."** `e3d6de2`, whose first line is *"Corrects the previous commit, which was wrong."* HA's config-entry list API simply never returns `data` or `options` — they're internal. **The tell that was missed, in the record's own words:** *"`data` came back empty too, which is impossible for a loaded integration running 49 live entities."* The options dialog showed the PIN populated all along. One line of Jeff's live system log gave the real error: `Car action: ENGINESTART failed. error_code: RIS_PIN_INVALID`.
3. **Then Jeff screenshotted his own Mercedes app** hitting the real block (`eb0852f`):

> *"Your request to start the engine is unable to initiate because you have reached the limit of remote attempts between manual ignition cycles. Please use your key and manually start your vehicle the next time."*

Mercedes enforces a remote-attempt limit that resets only on a **physical key start** — and this dialog appeared *after* the app had accepted his PIN, proving the PIN valid. Both readings were kept in the record pending a decisive test rather than one being deleted.

**Real resolution:** `adcf16c` — *"Mercedes remote start CONFIRMED WORKING from the app."* Body opens with two words from Jeff: **"It started."** Two blockers had to clear simultaneously: the key-start to reset Mercedes' counter, **and** re-entering the PIN **plus a full Home Assistant restart** — *"`reload_config_entry` was NOT sufficient — mbapi2020 reads the Security PIN only when it initialises."*

**The diagnostic gold, preserved for next time:**

> `sigpos_start` (flash lights) is the only remote command requiring no PIN. It worked while every PIN-gated command failed. That single split proved the app, the Cloudflare proxy, HA, the VIN and the integration were all healthy and isolated the fault to the PIN in one step — **after I had wasted effort on a false reading of the config-entry API.**

And the credit, recorded in the same commit: *"the whole thread started from Jeff noticing the real Mercedes app was prompting for a PIN."* New standing rule: `system_log/list` is the **first** stop for a failing service call.

**Cost to Jeff:** The tail of the two dead weeks from #34, plus being told two different wrong things about his own car in seven minutes.

**Lesson:** An API returning empty is not the same as a value being empty — and when one no-auth command works while every authed one fails, you already have the answer.

---

### 36 — Stale data in three sections

**When:** 2026-07-24 00:16.

**Symptom:** Sensors, cameras and weather frozen at whatever they showed when the app booted.

**Real root cause:** `2c95ffc` — *"`mowerSync`, `loadCameras`, and `loadWeather` only ran ONCE at startup with no periodic refresh. The 60s self-heal interval covered Guardian/Lights/Vacuum/Utilities/Car but missed these three."* Section-switching didn't reload them either.

**Fix:** `2c95ffc` — section switch reloads, 60 s interval extended, weather gets its own 5-minute refresh. Lesson written to `CLAUDE.md` (`15ca7d8`): *"when adding a new loader, add it to BOTH the section switch AND the periodic interval."*

**The same class, one layer deeper, ten days later:** `d15079c` (08-04) — *"`loadClimate()` was only wired into `hccSection('home', …)`, which runs when a user navigates TO home via a nav tap. **HOME is already the default active section in the static HTML, so that function never actually fired on a plain app open** — only on manually navigating away and back."* The LUX thermostat had been effectively dead on every normal launch.

**Cost to Jeff:** Wrong numbers presented as current — the worst kind of wrong, because it looks right.

**Lesson:** A loader wired only to a navigation event never runs for the screen the app opens on.

---

### 37 — The water pit-radio: one real fault, then a false alarm that sent Jeff to the utility

**When:** 2026-07-28 (real outage) and 2026-08-01 (false alarm). Two incidents, deliberately kept separate in the record and worth keeping separate here.

#### 37a — The genuine outage, 2026-07-28

**Symptom:** Water meter readings stopped at ~17:39 UTC.

**Diagnosis method (good):** `281d65b` used rtlamr2mqtt's own `listen_mode` — an unfiltered reception log — with the gas meter as a control on the same dongle, antenna and distance: *"gas showed up in <90s, water never appeared at all."* That rules out config and software entirely. Conclusion: the external MIU (`100WD`) is not transmitting; it is WHUD's equipment.

**Also deliberately ruled out, and recorded:** the same-day recorder fix, because *"water kept transmitting fine for 5+ more hours after that, only going silent at ~17:39 UTC — the timing doesn't line up."*

**Competing explanation from the other session, three days later:** `b4f11df` (07-31) — *"proximate cause was rtlamr2mqtt losing the RTL-SDR USB device, fixed by a full Beehive host reboot."* Both explanations sat in `CLAUDE.md` unreconciled until `0b72961` flagged it.

**Jeff's call, `13502b9` (07-31):** *"water's transmitting fine now and he explicitly does not want to call WHUD about it — doesn't want to raise a flag with the utility district over something that's already resolved."* Marked CLOSED, "do not re-raise."

#### 37b — The false alarm, 2026-08-01 — the clearest "we sent Jeff on an errand he didn't need" in the record

**Symptom:** During a deliberate experiment, the water meter reported the **exact same value (`179097`) on every single decode for ~47 minutes**, while the gas meter on the same dongle ticked normally.

**How convincing the wrong evidence was:** the test was a controlled experiment in which **Jeff physically participated** — *"triggered a B-Hyve irrigation zone via HA + **Jeff took a real shower**, both running simultaneously for ~47 min."* The heartbeat sensor (`sensor.water_meter_last_seen`) updated normally every ~1.5–5 minutes throughout.

**Wrong conclusion, `593ddf7`:** *"Radio heartbeat is normal but the register is stuck rebroadcasting a stale reading — proven against the raw rtlamr2mqtt decoder log… **Jeff needs to call WHUD again.**"* — issued to a man who had explicitly closed the WHUD question the night before precisely because he did **not** want to call them. It also declared the leak-detection work blocked.

**Real root cause, `fb5068c`, the same day:**

> `rtlamr2mqtt` runs `rtlamr` with **`-unique=true`**, which only re-publishes a reading when the decoded value itself changes — the meter's own transmitter evidently updates its broadcast register in batches (gaps varied from ~20 min to ~3 hours), not continuously with live flow.
>
> The `sensor.water_meter_last_seen` heartbeat pinging normally the whole time was a real signal I misread — **it confirms every RF catch, not that the *value* had refreshed, and I conflated the two.** **No WHUD call needed — the meter and pit radio are both healthy.**

Proven properly: an IDM-protocol probe over ~2 hours returned **zero IDM packets** (so `scm+` is the complete picture, not a partial one), and a longer observation window caught the real value moving twice — `179097` → `179371` (the shower/irrigation usage, arriving ~20 min late) → `179473`.

**Handling that deserves credit:** the wrong diagnosis was **kept in `CLAUDE.md` beneath the retraction rather than deleted** — *"See the entry directly below for the original (incorrect) diagnosis, kept for the record rather than deleted."* And the lesson was banked and **reused correctly four days later**: on 08-05 (`aa6566a`) an ~18.7-hour water-meter gap was triaged as "likely the known benign batching pattern," using the same gas-meter control check, instead of triggering another alarm.

**Cost to Jeff:** He ran a 47-minute test and took a shower on request to generate a wrong answer, and was told to make a phone call he had specifically declined to make. All test-time add-on config changes were reverted.

**Lesson:** A heartbeat proves the radio is alive, not that the number is fresh — and "unknown/unavailable is not a fault" is now the first hard-won invariant in `docs/SESSION_START.md`: *"gaps of 20 min to 3 hours are normal… **This caused a false WHUD alarm on 08-01. Watch longer.**"*

---

### 38 — The recorder was dead for twenty-six days

**When:** 2026-07-02 → 2026-07-28.

**Symptom:** No usable Home Assistant history for anything — which quietly undermined every feature built on `history/period`: water "This Cycle," electric backfill, and later the sewer-overcharge case.

**Real root cause:** `configuration.yaml` was missing `default_config:` — recorded in `c94e7aa`: *"Recorder had been dead 07-02 to 07-28 (missing `default_config:`, root-caused and fixed by the coworker session)."*

**Fix:** coworker session, 07-28.

**Consequences that surfaced later:** `e71401a` (07-28) found "this HA instance's recorder history currently only goes back to ~12:15 UTC today." And `aa6566a` (08-05) found the sewer-case function `irrGalFromHistory()` **had never once fired against real data** — recorder retention at its 10-day default with no `purge_keep_days` override, B-Hyve zone history only starting 07-30 against a cycle beginning 07-21, and zero zone "on" events in eight days: *"mechanically works, just unexercised."*

**Cost to Jeff:** Twenty-six days of history he thought he was accumulating, which mattered because he is building a **refund case against a utility** on that data.

**Lesson:** A missing one-line include can invalidate a month of evidence, and nothing will tell you.

---

### 39 — "New automations don't save"

**When:** Long-standing; root-caused 2026-07-31.

**Symptom:** Automations created in HA's UI simply didn't exist afterwards.

**Real root cause:** `b4f11df` — *"`configuration.yaml` was missing `automation: !include automations.yaml`, so UI-created automations wrote to disk but were never part of the loaded config tree."*

**Fix:** `b4f11df` — add the include, restart. *"3 real automations came alive + 2 duplicate Recorder Watchdog copies deleted before they could triple-fire."*

**Cost to Jeff:** Every automation he built himself in the UI, silently discarded, for an unrecorded length of time.

**Why it belongs next to #22:** it is the **identical failure**, in the same file, three weeks later — a missing `!include` making valid config invisible. The first occurrence taught nothing that prevented the second.

**Lesson:** After fixing a missing-include bug, audit `configuration.yaml` for every *other* missing include the same day.

---

### 40 — The Blink crash loop, and the watchdog that could not see it

**When:** 2026-07-31 → 2026-08-01.

**Symptom:** Jeff: "camera popups missing or 10-15 min late."

**Wrong assumption:** That an existing watchdog covered it. It did not, for a subtle reason.

**Real root cause (two layers):**
1. `fd15642` — an upstream blinkpy `LoginError` crash (home-assistant/core #176836, fronzbot/blinkpy #1217, no fix in either) left motion sensors **stuck at stale values instead of going `unavailable`** — so the watchdog, which looked for unavailability, could never trigger.
2. `a001f2e` — the first auto-heal was itself insufficient: *"discovered `system_log_event` only fires **once per unique message**, so a repeating crash-loop could slip past the error-triggered watchdog."*

**Fix:** `fd15642` (reload the Blink integration within seconds of the crash) + `a001f2e` (an **unconditional 15-minute periodic reload** with no error-detection dependency at all).

**Vindication, measured:** `62e99b5` (08-01) — *"Confirmed the Blink periodic backstop caught **73 real crashes overnight** with zero user impact, proving that design decision was right."*

**Cost to Jeff:** Late or missing camera alerts; and note that **73 crashes a night** was the *normal* operating condition of his security cameras.

**Lesson:** A watchdog that depends on the failure announcing itself is not a watchdog — add an unconditional backstop.

---

### 41 — Angela's phone tracker

**When:** Flagged 2026-07-31 (`a001f2e`: "Angela's Almost Home hasn't fired since 07-16"); root-caused 2026-08-01.

**Symptom:** The "Angela Almost Home" notification — a heads-up ~10 minutes before Jeff's wife arrives — had not fired in two weeks.

**Wrong theories / attempts, in order:**
1. **iOS location permissions.** Always / Precise / Background App Refresh all set correctly. No change.
2. **Manually opening the app.** No fresh update.
3. **`command_request_location_update` pushes.** No response — and the record is careful about this one: *"confirmed via official Companion App docs this is a known 'hit-or-miss' feature, so its failure wasn't diagnostic on its own."*
4. **Route around it with the Mercedes GPS.** `66b3f49` — and this is the sharp bit: the two existing "backup" triggers *"both secretly depended on her unreliable phone tracker, which is why the prior 'backup' never actually helped."* A backup that shares the primary's single point of failure is not a backup.
5. **`3537b00` (same day)** proposed "Angela's phone-side location settings as the real fix" — which the evening's commit then overrode.

**Real root cause:** `2770fee` — found in the Companion App's **Settings → Notifications** (relabelled in a newer app version, no longer where the docs say): **her Push ID was empty/stale.** Her phone had never registered a valid push-delivery channel with HA, so nothing — including background significant-location-change wake-ups — could reach the app.

**Verified, not assumed:** *"a genuinely fresh organic background update landed (not from a manual poke), with real GPS movement (accuracy 3.6 m → 10.4 m) and real battery drain (90% → 75%) between checks."*

**Cost to Jeff:** Two weeks of a family-safety feature silently off, and a chunk of two sessions.

**Lesson:** Before debugging what an app *does*, confirm the channel by which anything can reach it — and a backup that reads the same sensor as the primary is decoration.

---

### 42 — "Alexa, fast forward the commercials"

**When:** 2026-08-03; still not fully closed at branch tip.

**Symptom:** Jeff says the phrase; nothing happens.

**Wrong theories / attempts, in order:**
1. **The app is missing buttons.** `a5db5dc` — audited every Fire TV line in the repo and found the app's remote card only ever had Power and Play/Pause: *"fast-forward/rewind was **never built, not a regression**."* Added FF/RW, verified against the `python-androidtv` library source rather than guessed. Real work, unrelated to the actual complaint.
2. **Beehive is misconfigured / ADB pairing is broken.** Neither.
3. **Angela created an Alexa Routine and got silence.** Turned out no Routine had actually saved.

**Real root cause — two independent impossibilities, `d755a6a`:**
- HA core's `alexa/handlers.py` **has no handler for `PlaybackController.FastForward`/`Rewind` at all** (only Play/Pause/Stop/Next/Previous) — open issue home-assistant/core #87327.
- Amazon **natively intercepts** custom Routine phrases that sound like built-in media commands, so the words "fast forward" never reach a Routine. Cross-checked on Amazon's own forums against their reported "Alexa, bedtime" case.

*"The literal phrase 'fast forward' can never trigger `script.hcc_skip_commercial`, in either exposure path — this isn't a Beehive misconfiguration or an ADB pairing issue."*

**And one more, found earlier (`131dc16`, 07-21):** `script.hcc_skip_commercial` and `script.hcc_resume_fire_tv` had existed and worked for weeks but *"were **never exposed to Alexa** — that's the whole reason 'Alexa FF the commercials' wasn't working."*

**Fix:** Skip Routines entirely — the script is already exposed, so Alexa's **native "Alexa, turn on FF the Commercials"** phrasing reaches HA directly. Confirmed live twice.

**Still open at tip** (`/tip/CLAUDE.md`, Pending Item 16): the **skip distance is wrong.** Three `keyevent 90` presses 1.2 s apart "skipped way too far" in Sling (media apps ramp FF speed non-linearly on rapid repeats); reduced to a single press and **not yet re-tested against Jeff's actual target of 4:40 (280 s)**. Also recorded as the better long-term path: HA's own local Assist has no reserved-phrase problem.

**Cost to Jeff:** Weeks of a voice command that could never have worked, and one that still overshoots.

**Lesson:** Check whether the platform even implements the verb before debugging your own config.

---

### 43 — The NOAA radio "paysite" and the invented callsign

**When:** 2026-08-03.

**Symptom:** Jeff reported the NOAA Weather Radio button was landing on *"some type of paysite."*

**Real root cause:** `dd2c6fa` — the button pointed at a **TuneIn *search* URL**, not a station.

**The part that makes this an incident rather than a typo:** the same commit retracts a fabrication —

> KIG79, 162.550 MHz, Nashville — covers White House (**not 'KIH21' as I'd guessed in an earlier session before this fix; that callsign doesn't exist**).

A radio station callsign was invented and shipped. The correct one was verified against **NWS's own coverage database plus four independent radio directories** before replacing it.

A second link-quality find in the same audit: the "Mower Diagrams" and "eReplacementParts (alt)" buttons pointed at two different serial-number sub-ranges, and only Jeff could resolve it — which he did by photographing the Toro data plate (`1c69752`): Serial No. 401338948, range 400000000–402081999, *"recorded permanently in CLAUDE.md so this is never ambiguous again."* The alt link had been pointing at the **wrong range** (402082000–403599999).

**Cost to Jeff:** Two broken links, and one fabricated fact presented as knowledge in a weather app built for a trained storm spotter.

**Lesson:** A callsign, a model number and a part range are all facts you either verified this session or made up — there is no third state. (Two days later this became a PROTECTED rule; see #49.)

---

### 44 — Sewer overcharge: the real number was computed and never saved

**When:** 2026-08-06 01:18; compounded through 08-05/08-06.

**Symptom:** None visible. The "Total sewer overcharge tracked" running total looked fine — it was simply built on the worse number.

**Real root cause:** `8158128`, verbatim:

> `irrGalFromHistory()` computed the accurate irrigation gallons from real B-Hyve on/off runtime (accounts for rain delays, skipped days) but **only ever displayed it in the on-screen note** — the tracked `water_billing_history` entry that "Total sewer overcharge tracked" sums was only ever written by the rougher schedule-based estimate and never refreshed.

**Why this matters more than a normal bug:** this running total is **evidence in a real billing dispute.** Jeff is building a refund case against WHUD / the City of White House for sewer fees charged on irrigation water that never enters the sewer. The number in the app was the number in the argument.

**Three compounding failures on the same dataset:**
1. `8158128` — the good number was never persisted (above). Fixed; and the commit is honest about its limits: *"Could not test the live B-Hyve/HA fetch itself — no network path to Jeff's real HA instance from this sandbox."*
2. `aa6566a` (coworker, 08-05) — the fix **had never actually fired**: recorder retention at the 10-day default, B-Hyve history starting 07-30 vs a cycle start of 07-21, and zero zone "on" events in eight days. *"Mechanically works, just unexercised."*
3. `4252086` → `0827617` (08-06) — the per-zone GPM constants were **wrong by 23–49%**, based on the wrong head counts and nozzle model. Real measured values (isolated single-zone tests, timed off HA switch timestamps, gallons measured off the real water meter, cross-checked against Hunter's MP Rotator spec sheet) replaced `{1:17.2, 2:14.3, 5:5.7}` with `{1:8.78, 2:10.09, 5:4.4}` — *"meaning the tracked sewer-overcharge total has likely been significantly overstated."*

**Accepted and recorded rather than hidden:** past closed billing cycles are **not** retroactively corrected — "no HA history exists to recompute them."

**Cost to Jeff:** A legal/billing argument built on an inflated number he might have taken to the City. The overstatement was caught before it was used, but only by measurement, and only because someone went outside with a stopwatch.

**Lesson:** If a number is going to be used as evidence, it must be measured, persisted, and proven to have fired at least once against real data.

---

### 45 — Electric SmartHub: shipped, looked perfect, was fed nothing

**When:** Shipped 2026-08-06 06:22 UTC; found broken the same night at 02:48 CDT; fixed 07:56 UTC.

**Symptom:** None visible. Today / Yesterday / Peak Hour / Last 7 Days cells rendered exactly as designed — and were connected to nothing.

**Wrong assumption:** That mocked-data tests plus correctly rendering UI equals a working feature.

**Real root cause — found only by firing the exact command at the live system.** `fa8e153`, coworker session:

> Fired the exact WS command from `ha-stats.js` directly against live HA and found two real bugs keeping Today/Yesterday/Peak Hour/Last 7 Days **silently broken despite the UI cells rendering**: (1) `history/statistics_during_period` **doesn't exist** on this HA version (Core 2026.8.0), real command is `recorder/statistics_during_period`; (2) the **`change` field always reads 0** for this sensor even across real usage growth — code needs to diff cumulative `sum`/`state` between period boundaries instead.

The live evidence: *"sum moved 761→872 over 48h while every change was 0."*

**Fix:** `5c41c8d` — command renamed, and a `toDiffedSeries()` helper added that diffs consecutive cumulative readings, *"same 'diff two cumulative readings' pattern already used by `irrGalFromHistory()` and the water billing math."*

**Cost to Jeff:** None realised — caught within hours by the session that could touch the real house. Included in this ledger because it is **the exact miniature of the hour-meter failure** (#54) that was still five days from being discovered: *UI renders ≠ feature works.*

**Lesson:** A feature that talks to someone else's system is unverified until someone fires its real request at their real system.

---

### 46 — The glassmorphism war

**When:** 2026-08-06, 09:24 → 12:44 CDT. Roughly a dozen commits, one total revert, one rebuild, one root-cause fix.

**Symptom:** Jeff sent five real screenshots from the live app with real data. The redesign looked bad — stat chips colliding with content in the photos, "worse than before."

**Wrong theories / attempts, in order:**
1. **Iterate the recipe.** `3ff1eec`, `42ff38d`, `4464d87`, `468e6a1`, `d6514f6`, `f4290d7` — six rounds of applying and auditing Jeff's own two-document glassmorphism reference. (`d6514f6` deserves credit: asked directly whether every technique was applied, it audited honestly and found "8 were done, 4 were real gaps.")
2. **Darken the gradient under the chips.** `53f697f` — twice. Neither worked.
3. **Revert everything.** `2bf50db` — *"Jeff asked to stop and revert."* Back to `7cccc59`.

**Why the developer's own tests missed it — the confession, verbatim from `CHANGELOG_ARCHIVE.md`:**

> Built it in stages over several commits … and **believed it was solid after passing lint/smoke-test and my own mocked-data Playwright screenshots. It wasn't.** … **my own testing had used short placeholder values ("— gal") which never made the chip row wide enough to visibly hit that content, so I missed it entirely, then wrongly told Jeff Water was fine when it wasn't (never actually checked it against real long data).**

**The rebuild that worked:** `30d1df3` — done from the coworker's PC "measured and verified against the real deployed app with real live data at a true 390px phone viewport — the thing the first attempt could not do." The overlap was **measured**, not assumed (chip block at 71.1%/85.2%/66.6% of photo height vs printed strips at 67–88%: "a direct overlap on all three").

**And then the actual root cause, `45485f0` — the pivot of the whole arc:**

> This is the root-cause fix for every utility-card fight in the history below. Those photos were **AI marketing mock-ups**: half of each frame was a fake ad — "WHITE HOUSE UTILITIES COMMAND CENTER", "SMART MEASUREMENT. EVERY DROP COUNTS.", the SAFE SUPPLY / USAGE INSIGHTS icon strips. **Every constraint in this area (the 46% width, the per-card hand-calibrated top values, the collisions, the first attempt's full revert) existed only to dodge text that was never real.**

Regenerating the three photos cost **~9 cents each, first try, no retries.** Every hand-calibrated dodge constant was then deleted: *"There is nothing left to dodge."* The sweep continued through five section heroes (`ecf6f25`) and `hero-cameras.jpg` — *"the worst offender of the lot: a 1300x2042 portrait mock-up of **the app's OWN interface**"* with six dummy camera tiles sitting above the real camera grid (`1eba07f`).

Jeff's own words on why it looked wrong (`ecf6f25`): *"I hate those logos that are on the picture. I don't mind the text but it looks awful with them right next to the real icons."*

**One more self-inflicted bug found in the same arc** (`384c07d`): *"An earlier edit left comment prose outside its `/* */` block, which **silently killed the whole `.util-overlay-bottom` rule** and made all three readouts vanish off the photos. Caught because the parsed CSS rule count dropped."*

**Cost to Jeff:** A multi-commit redesign thrown away; having to say *stop*; being told the Water card was fine when it wasn't; and — the real bill — **weeks of prior layout work across the whole app spent dodging text that could have been deleted for 27 cents.**

**Lessons (recorded verbatim in the changelog):** *"(1) test every visual claim against realistic LONG real-world data from the start, never short placeholders; (2) **get Jeff's visual sign-off on one card before rolling a treatment out to all of them**."* And the deeper one: when every fix in an area is a workaround, delete the thing being worked around.

---

### 47 — Jeff stripped out of his own photographs

**When:** 2026-08-06 11:25 CDT.

**Symptom:** The irrigation and yard hero photos came back from a regeneration pass with the person removed.

**Wrong assumption, stated plainly in `595ec23`:**

> **Correcting a real mistake: I stripped the person out of the irrigation and yard heroes assuming they were stock models. They're Jeff.**

**Fix:** Both regenerated from the pre-edit originals with him kept exactly as he was — *"same face, expression, LawnCareLife shirt, watch, thumbs-up pose"* — and only the printed fake title/tagline/icon rows removed. Promoted to a **PROTECTED `CLAUDE.md` section** the same day (`db9ffcc`, headed *"Learned by getting it wrong"*):

> - `hero-irr.jpg` and `hero-yard.jpg` contain Jeff himself. **Never remove him.**
> - `images/zones/` are real photographs of Jeff's actual yard. **Don't regenerate them.**
> - The couple in the old `hero-car.jpg` were not Jeff and Angela.
> - **Rule: if a photo has a person or a real place in it, confirm what it is before altering it.**

**The rule was honoured five days later** (`6913393`, 08-11): the six zone photos were *"CROPPED, NOT REGENERATED — none of the real yard was altered, per the protected photo rule."*

**And the rule grew a second clause after a near-repeat** (`e5d57f4`, 08-11): a hero-sizing fix cropped the top of his head off in iPad landscape. Jeff: *"You got it they are rendering correctly now, however my head is cut off in the yard hero pic"*, then *"it's only in the iPad landscape that it is cut off."* Measured rather than eyeballed — *"his hair starts at image row ~22 of 851 — essentially zero headroom"*; `center center` cut 94 px into his head at 1194 px and 145 px at 2560. Fixed to `center top`, with the tip rule: **"CROPPING COUNTS AS ALTERING HIM."**

**Cost to Jeff:** Not measurable in hours. This is an app built for one man, and the man was edited out of it.

**Lesson:** In a personal app, a photograph is a fact about someone's life — confirm what it is before you touch it.

---

### 48 — 124 failure emails in one week

**When:** Workflow added 2026-06-22 (`8fdae39`); documented as broken 2026-06-23; stopped 2026-08-06. **Six and a half weeks.**

**Symptom:** Jeff's inbox. `ac99b33`:

> This workflow **has never worked**. It calls `cloudflare/pages-action@v1` with `secrets.CLOUDFLARE_API_TOKEN`, which does not exist on this repo, so every push to the branch failed instantly and sent Jeff a failure email — **124 of them in the past week alone, dozens on 08-06 by itself. It was the single largest source of mail in his inbox.**

**Why it ran so long — and this is the interesting part:** it was known. From the very first `CLAUDE.md` (`e8f0312`, 06-23) onward the file said: *"**GitHub Actions is BROKEN** … Do NOT try to fix this — it is irrelevant."* It was documented as irrelevant **because deploys were unaffected** (Cloudflare Pages' native Git integration does the real deploying) — and nobody connected "harmless" to "emails Jeff every single push for six weeks."

**Fix:** `ac99b33` — trigger changed from `push` to `workflow_dispatch` rather than deleting the file, "so the job definition stays available if the secret is ever added, but it can never fire automatically again."

**Cost to Jeff:** Hundreds of failure emails over six weeks, from a system a note in the memory file called irrelevant.

**Lesson:** "Irrelevant to the build" is not the same as "harmless to the human" — a broken thing that emails someone is not irrelevant.

---

### 49 — Three wrong garage-door parts in a row

**When:** 2026-08-05, 18:33 → 19:02. Six commits in ninety minutes, ending in a permanent rule.

**Symptom:** Jeff asked what part to buy for his garage door, and was told three different wrong answers before finding the right one himself.

**The sequence:**
1. **`7b60e43` (08-04)** — recommend a **Gelidus ratgdo board (~$22-25)**, and explicitly flag plain relay modules as *"NOT protocol-compatible substitutes."*
2. **`65d7e49`** — Jeff bridges the wall-button wires directly; the door toggles. That is ratgdo's own documented dry-contact test — *"true Security+2.0 wouldn't respond to a raw short."* A magnetic reed sensor is added to the shopping list.
3. **`7e4726a`** — reed sensor dropped: *"Jeff doesn't park in the garage, so real-time door position isn't needed."*
4. **`10f0f13`** — **Jeff catches the reasoning error himself:** *"the ratgdo/Gelidus board's price premium is entirely for decoding the Security+ protocol, which his confirmed dry-contact opener doesn't use."* Switch to a **SONOFF Basic R2/R4 (~$8-10)**, ~$15 cheaper. (This also silently reverses `7b60e43`'s "NOT protocol-compatible" claim — true only for Security+ openers, which Jeff's isn't.)
5. **`4bfacf3`** — **Jeff pushes back again, and is right again:** *"'SONOFF Basic' wasn't specific enough among SONOFF's confusing relay lineup — and it was actually the wrong pick: **Basic-series switches are mains-voltage (110-240V) and need modification for a low-voltage garage circuit.**"* Corrected to SONOFF **SV** ("Safe Voltage," 5-24 V).
6. **`f015867`** — **Jeff finds the actually-right part himself:** SONOFF **MINI-D** — native Matter (no ESPHome flashing), dry-contact relay output, hardware Inching Mode for a proper momentary pulse. *"Verified all of this via research before committing."*

**Real root cause:** `7f73148` — product models were being named **from memory**, not from a search performed in that session.

**Fix:** A PROTECTED standing rule alongside the Debugging Protocol (`/tip/CLAUDE.md`):

> **8. NEVER name a specific product/model to Jeff from memory (PROTECTED — Jeff's standing rule 08-05, added after the garage door incident).** … three guessed answers on one part, in a row, before Jeff found the actually-correct SONOFF MINI-D himself. **He does not have time to be the fact-checker on my hardware recommendations.** … If I haven't checked, say "let me check."

**Cost to Jeff:** **Near-miss on money and safety** — had he bought the SONOFF Basic as recommended, it would have been the wrong voltage class for a low-voltage garage circuit. Nothing was actually purchased wrongly. The real cost was trust: he became the fact-checker.

**Postscript, 08-08:** when the MINI-D arrived, `8d53af4` explicitly notes *"the garage door hardware area already burned trust once on guessed specs, so researched properly against SONOFF's own docs and independent reviews this time"* — and found two things that only research produces: the device needs separate AC/DC power terminals, and **Inching Mode (the whole reason it works for a garage door) can only be set in the eWeLink app, not via HA's Matter integration.**

**Lesson:** A plausible-sounding model number is a guess wearing a uniform.

---

### 50 — The sideways wall iPad

**When:** 2026-08-08 21:35 → 2026-08-11 00:23.

**Symptom:** The wall-mounted kiosk iPad rendered the whole page sideways — nav bar vertical.

**Wrong theories / attempts, in order:**
1. **iOS Guided Access / rotation lock.** `9da43a5` — diagnosed as "a known iOS Guided Access/rotation-lock symptom" and a tablet-scoped **CSS auto-rotate transform shipped live as a "backstop"** — with the honesty caveat baked into the commit that the direction could not be verified from the sandbox: *"a wrong direction is a one-line flip."* The changelog phrase is the tell: *"Full honesty on verification, **not overclaiming a 4th time**"* — the record admitting it had already overclaimed three times in that thread.
2. **Framing it as an inherent limitation.** Demolished by Jeff, quoted in `24136c7`: *"**it worked perfectly before, you can't say it's a limitation of the app or the iPad.**"* The speculative CSS was reverted 25 minutes after shipping — *"leaving an unproven guess live while trying to find an actual regression only adds a confound. **Status: genuinely unsolved.**"*
3. **Follow the timeline.** `bb9d1cf` — Jeff again, and this is the sentence that solved it: *"**It worked perfectly before the picture edit.**"* That pointed straight at `5d22cf7`, the session's **own** hero `max-height` → `clamp()` change from that morning. Reverted, with an unusually candid admission: *"**Honest gap: I don't yet have a mechanism** for how a max-height change on hero photos could cause the whole page's nav bar to render vertically — that's still unexplained — but the timeline is the strongest signal available."*

**Real root cause, three days later:** `86b47e6` (08-11) — Chromium measured full-width everywhere, *"so this is a Safari divergence"*: the ambiguous combination `aspect-ratio` + `height:auto` + `max-height` is resolved differently by different engines. *"Fixed by removing the ambiguity rather than guessing at a workaround"* — explicit height with `aspect-ratio:auto` at ≥768px.

**Two self-inflicted follow-ons from that fix, both caught:** it briefly squashed the irrigation and car heroes 796→560 px (they also carry `.sec-hero`), caught mid-fix; and it made `object-fit:cover` crop vertically, which **cut Jeff's head off** the yard hero (see #47).

**One piece of good practice worth preserving:** in the same thread, Claude caught a discrepancy in Jeff's own evidence rather than silently trusting it — *"their status-bar timestamps (4:54-4:55 PM) were EARLIER than the ones that had shown it fixed (9:17-9:19 PM) — flagged this to Jeff rather than assuming the photos were current."*

**Cost to Jeff:** Three days of a sideways wall display, three photo rounds, and an unverified guess shipped live to the device he was looking at.

**Lesson:** "It worked before X" beats any theory you have — go to `git log` first, and never leave an admitted guess deployed while hunting a regression.

---

### 51 — The heartbeat that erased the whole mow

**When:** 2026-08-10 20:24. The bug itself had existed since the sensor endpoint was written.

**Symptom:** Every mow's real telemetry disappearing minutes after the mow ended.

**Real root cause:** `60c5d28`, verbatim:

> The server stored exactly one reading and every POST fully overwrote it — including the sensor box's 5-min "parked, engine off" heartbeat, which only carries battery/wifi/temp. So the moment the box sent its first heartbeat after being parked to charge, **the entire mow's real telemetry (hours, RPM, distance, GPS track) got wiped** and replaced by a payload with none of that data. **This defeated the whole point of the sensor system — driving the hour meter automatically.**

**Fix (which did not work — see below):** `60c5d28` made `onRequestPost` **merge** a heartbeat onto the last stored reading rather than replace it. Verified with a unit test against the real handlers and a mocked KV. Follow-ups the same hour: `723eeab` added a `hours_history` KV key snapshotting each completed mow; `ee21a1e` added a `sensor_log` of every reading (5,000-entry cap).

**Why it is in this ledger:** **the fix never engaged.** `d18db7b` (08-11), from the session holding the actual hardware:

> Mow history had **NEVER** recorded a single mow. The trigger waited for "a heartbeat follows a live reading" and read totals from `prev`, which assumed the box posts during a mow. **It does not — it posts only while parked, so that transition cannot occur.** It was also gated on `typeof prev.hours === 'number'`, never true because the box sent `hours_seconds`.

The task brief written the same day (`docs/mower/CLOUD_SESSION_TASKS_2026-08-11.md`) states it flatly: *"the box **only uploads while PARKED**, every 300 s. It does not post during a mow (WiFi is off then). So 'a heartbeat followed a live reading' is a state that can never occur — which is why several things below never fired."*

**Real fix:** `d18db7b` — retrigger off the firmware's new `mow_ended` flag and snapshot from `body`, after the firmware was rewritten to send fields that actually exist (`6913393`).

**Cost to Jeff:** Every mow's telemetry, lost at the moment it mattered — and then a full day of engineering built on top of a model of his hardware that was fiction.

**Lesson:** A unit test against a mocked KV proves your code does what you think; it says nothing about whether the device behaves the way you think.

---

### 52 — The exploding yard map

**When:** 2026-08-10 20:59. **Two prior wrong answers given to Jeff before this.**

**Symptom:** Jeff's screenshots showed the mowing track "sprayed across the road and through the house," rendered at 10–100× true size.

**Wrong theory, given twice:** that it was **user tap precision** on the "Pin Track to Photo" calibration. `7adc108` corrects it explicitly: *"Root cause of the garbage map — **a genuine math flaw, not user tap precision (which is what I'd wrongly told him twice)**."*

**Real root cause:** the old calibration derived both rotation **and scale** from only the track's **first and last GPS points**:

> When a mow ends near where it started — the normal case, you finish back at the garage — that GPS delta is near-zero, so dividing the tapped pixel delta by it produced an enormous scale factor.

**Fix:** `7adc108` — auto-fit from the full data extent "so it cannot explode."

**And the deeper problem underneath it:** `5959b55` — the bundled `yard-aerial.jpg` **was not Jeff's property at all.** It carries Fort Worth, Texas coordinates (32.899°N, −97.033°W); Jeff's yard is in White House, Tennessee. *"which is the entire reason manual alignment existed."* Replaced with live georeferenced satellite tiles (USGS, then Esri for sharpness), making GPS→pixel exact arithmetic — "the track lands on the real grass by construction, nothing to align." `6d37ff0` then found `_buildSimTrack()` **still hardcoded the Fort Worth coordinates**, so tapping Simulate "would have yanked the map ~700 miles off his property."

**Cost to Jeff:** A map of his yard that was a map of somewhere else, a calibration UI that existed only because of that, and being told twice that the garbage output was his tapping.

**Lesson:** When you blame the user's input twice, the third answer is in your arithmetic — and check that the photo is actually of the place.

---

### 53 — The coverage-map localStorage blowout that reset Jeff's hours

**When:** 2026-08-10. Introduced ~20:59; detonated by 23:10. **The most serious app-side data-loss bug in the record.**

**Symptom:** Jeff, verbatim: *"Why are my hours now set at 5.9, the real actual hours are 12.1."* His entire saved state — hour meter, service log, maintenance history — reset to factory defaults.

**Real root cause, owned in the first line of `b568a4b`:**

> Jeff's hours reset to 5.9 — the factory default baseline — meaning his whole saved state was wiped. **Root cause is mine, from earlier today.**
>
> The entire S object (hour meter, service log, maintenance history) is persisted as one localStorage blob. When I added the cumulative coverage map I put it in that same object, and `syncYardCoverage` then wrote the full server coverage map — tens of thousands of cells — into it on every sync. That pushed the blob past the storage quota, `save()` threw, **and the catch silently swallowed it**, so hour updates stopped persisting; once the entry was lost the boot path fell back to `DEFAULT_STATE` and took his real hours with it.
>
> **Server-owned, re-downloadable, unbounded data does not belong in the user's core state blob.**

Four failures had to line up: unbounded data in a bounded store; a bounded store with no size check; a `catch` that swallowed the quota exception; and a boot path that treats "missing" as "factory reset."

**Fix:** `b568a4b`, three parts — coverage moved out of `S` into module-scope memory (server-authoritative, re-fetched every sync, never persisted); a load-time migration that strips the legacy fields from already-bloated devices; and a tiny separate `toro21200_core` mirror key (hours, baseline, lastSensorHours) so hours can never again be silently zeroed. `save()` no longer swallows failure. Proved by seeding a bloated 3,294-cell state (blob shrank to 356 bytes, hours preserved at 12.1), **then deleting the main blob entirely and reloading — hours came back 12.1, not 5.9.**

**The honest close, which is the part that matters:** *"**Jeff still needs to re-enter 12.1 once via SET HOURS** — the mirror protects from here on, but it can't recover a value that was already lost before it existed."*

**The next bomb, found only because Jeff asked.** `86b47e6` (08-11). Jeff: *"Is everything fix and 💯 correct… make sure we don't have any other situation like this out there waiting…"* The audit found **the same bug class one layer down**: service photos stored inline in `S.log` as base64 data URLs, ~80–200 KB each in an unbounded log — *"~20-30 logged photos would have blown the same quota and wiped the hour meter all over again."* Same audit hardened five credential writes behind `safeSetItem` and guarded three unprotected `x.hrs.toFixed(1)` calls where *"one malformed log entry would have thrown and taken out the whole dashboard."*

**Cost to Jeff:** His real engine hours — the number the entire project exists to track — permanently unrecoverable from the app, re-entered by hand for the **second** time (see #5, 06-23).

**Lesson:** A silent `catch` around a write is a data-loss bug with a delay fuse — and unbounded server data in a user's state blob is a quota bomb with a date on it.

---

### 54 — **THE HOUR-METER MISS** — months, five mows, and replacement hardware

**When:** The defect dates from the first `CLAUDE.md` (`e8f0312`, 2026-06-23). Found 2026-08-11 13:19 CDT. Structurally closed 2026-08-11 19:31 (`a1cfa53`). **Roughly seven weeks; the record says "months across 5 real mows."**

**Symptom:** The engine hour meter — *the entire reason Jeff built the sensor box* — never advanced from sensor data. Jeff re-entered his hours by hand, every time, and was told the sensors were faulty.

**Immediate root cause:** `6913393`, verbatim:

> **The engine hour meter has NEVER been fed by the sensor.** The box sent `hours_seconds`; the app reads `d.hours`; **nothing converted.** 5.53 h of real runtime was stranded on the box. Now sends `hours` — verified live as 5.525.

A field-name mismatch. That is the whole bug.

**Structural root cause — and this is the part worth reading twice.** `CLAUDE.md` Rule 13 exception at tip:

> **Why this changed, and it matters:** the hour meter — the entire reason Jeff built the sensor box — **never worked for months across 5 real mows**. The box sent `hours_seconds`; the app read `d.hours`; **nothing converted, so the sensor contributed exactly 0.0 hours every sync while Jeff re-entered them by hand. Jeff was told the sensors were faulty and bought replacement hardware; they were fine, and had been recording 6.3 km of real mowing the whole time.** Root cause of the long miss is **structural, not carelessness**: this cloud session has no outbound network (`EGRESS_BLOCKED`), so it can never fetch a real payload, and the `.ino` is not in this repo — it was coding against this file's *description* of the firmware, which was **wrong**.

Independently, in `firmware/mower_hours_esp32/README.md`:

> For months the hour meter didn't work. The box sent `hours_seconds`, the app read `d.hours`, and nothing converted between them — 5.5 hours of real runtime and 6.3 km of real mowing went unrecorded across five mows. **Jeff was told the sensors were faulty and bought replacement hardware to fix what was a field-name mismatch.**

**Where the wrong description came from — traceable:** the very first `CLAUDE.md` (`e8f0312`, 06-23) asserted the box ran **ESPHome** firmware. By `90e556e` (06-24) that was half-corrected (*"The ESP32 runs the `.ino` Arduino firmware — NOT the ESPHome YAML"*), but the **posting-cadence** description — every 90 s while running, 5-minute heartbeat when off — **was never true and survived until 2026-08-11.** `d18db7b` names it: *"Also corrected CLAUDE.md's 'Sensor / ESP32 Hardware' section, which described a posting cadence the firmware has never had. **The server logic above was built on that wrong description — it is the root cause of the months-long hour-meter failure**, so it is now marked do-not-restore and carries the verified field contract."*

The coworker's findings doc (`docs/mower/gps_firmware_coworker_findings_2026-08-11.md`) is blunter still:

> ## ⚠️ FIRST: `CLAUDE.md`'s "Sensor / ESP32 Hardware" section is wrong
> **Neither statement matches the firmware.** … It **never sent `source`, never sent `engine_running`, and never sent `hours`.** Confirmed against all 239 logged readings… **Please correct that section — the server-side design below was built on the description, not on the device.**

**The structural fix:** `a1cfa53` (2026-08-11 19:31), verbatim:

> This closes the structural root cause of the months-long hour meter miss. The cloud session that owned `functions/api/hours.js` has no outbound network and could not see the `.ino`, so it wrote the server half of the contract against `CLAUDE.md`'s prose description of the firmware - and that description was wrong. **Nobody could diff the two halves because only one was in the repo. Now both are.**

WiFi SSID, WiFi password and device secret extracted to a gitignored `secrets.h` (the repo is public); `secrets.example.h` committed as the template; the build compiled **byte-identical (1,111,016 bytes)**, proving pure reorganisation. Two security caveats recorded rather than glossed: this does **not** make the compiled binary safe ("those strings are plaintext inside the .bin, so firmware images still cannot be served from a public URL"), and *"`strings` is absent on this machine and returns a silent false 'clean'; `grep -a` is the check that actually works."*

**Also on 08-11, the ownership change that follows from it** (`d18db7b`, Jeff's decision, `CLAUDE.md` Rule 13): the mower/sensor subsystem — firmware, `hours.js`, and the sensor-facing parts of `index.html` — is **owned end to end by the session that can touch the hardware**, "because every verification here needs the live endpoint, the LAN or the hardware, none of which the cloud session can reach."

**Cost to Jeff:**
- **Months of an hour meter he had to re-enter by hand** — the single number the whole project was built around.
- **5.5 hours of runtime and 6.3 km of real mowing, unrecorded, permanently.**
- **He was told his sensors were faulty and bought replacement hardware.** This is evidenced **twice**, in two files, in Claude's own words (`/tip/CLAUDE.md`; `firmware/mower_hours_esp32/README.md`). **What is NOT in the record is what he bought or what it cost — no price, SKU, vendor or receipt for the replacement mower-sensor hardware appears anywhere in the repository.** The archive request that commissioned this document states hardware was re-bought over the project's failures; for *this* incident the fact is independently confirmed in git, but **the amount is attributable only to Jeff's own testimony, not to the repo.** **INFERRED:** given the ESP32/MPU-6050/GPS class of parts, the sum was probably small in absolute terms — but the waste was total, and the record is silent.
- Trust in his own hardware, which was working perfectly the entire time.

**Lesson:** Two halves of a contract that live in different places, written by parties who cannot see each other, will diverge — put both halves in one repo or expect them to lie to each other for months.

---

### 55 — Everything the wrong firmware description had quietly broken

**When:** All surfaced 2026-08-10 → 2026-08-11, once the real payload could finally be read. Grouped here because each was individually a multi-attempt bug and all share one cause: **server logic written against a description of a device instead of the device.**

- **Coverage map was mapping the *parked* mower.** `d18db7b`: *"the box reports every 5 min while parked, so a standalone lat/lon was injected ~288x a day; **the whole map had become a 16.7m x 12.5m blob at the garage**, and the visit-count shading rendered that drift as the most confirmed ground on the map."* — **Fixed three times.** `d18db7b` gated the bare lat/lon; `662928a` (four hours later) found it *"only gated the bare lat/lon. It missed the track array, which was never the harmless half"* — the firmware resets its 3 m movement gate after every upload, so **every parked heartbeat shipped exactly one track point on the parking spot**; measured before/after, "the garage cell gained a visit every five minutes while real grass sat at 1-2." `yard_coverage` had to be **deleted entirely** ("all 96 cells were a 16.7 × 12.5 m box = the parking spot, plus the `0,0` Null Island cell"). Then `59951a3` (08-11 evening) made a **third** pass, admitting *"the previous two were both too generous"*: gating on `engine_running` treated idling in the garage as travelling and painted 6 cells in three minutes. Final rule: coverage requires **2+ breadcrumb points** and ignores engine state entirely.
- **Null Island in the database.** `d18db7b`: *"Old firmware sent the number 0 for 'no fix' and **`0 !== false` is true**, so no-fix 0,0 coordinates were merged as real. That genuinely happened — a '0,0' cell (Null Island) is sitting in KV and needs deleting by hand."*
- **Every mow's track blanked five minutes later** — an empty `track: []` heartbeat clobbering the stored track (`d18db7b`). The identical bug as #6, seven weeks on, in a different layer.
- **The device secret served publicly.** `d18db7b`: *"**Stop serving the device secret.** GET is public and echoed the whole stored body, and `logEntryFrom()` copied it into every log row."* A credential leaking through an unauthenticated endpoint and into every history row.
- **A dead sensor kept serving its last reading.** `c63142b`: firmware 1.4.0 correctly *omits* tilt when the MPU doesn't answer — "absent is honest while stale looks fine and is a lie" — but the heartbeat merge put the old values straight back. Caught on the bench: *"a box with no MPU attached was still serving pitch and roll of **-35.3** — the classic both-axes-identical value you get from reading an absent I2C device. The raw sensor log proved the box had correctly sent neither field, so **the staleness was entirely mine.**"*
- **The merge asserting expired facts.** `2335cec`: *"the endpoint was still serving `cmd_ack:1` long after command 1 had been acknowledged and retired, because the box correctly stopped sending it and the merge helpfully put it back."* And `d9dc37e`: `age_s:60` reported permanently on live readings, and `mow_ended` *"would have claimed a mow had just ended forever after the next one."* Principle now pinned in tests: **"If the box did not send it this cycle, it is not current."**
- **A whitelist silently deleting real data.** `333adcf` (08-10) — found only because Jeff demanded proof: *"I want to confirm that everything the mower sensors pick up and the gps is building a history of everything that mower does **if it farts 💨 it picks it up**."* `logEntryFrom()` was a hand-picked whitelist of canonical field names while the firmware used alternates: *"If the box sent `voltage` instead of `battery`, the log recorded null and **that reading was lost forever.** Any field added to the firmware later would have been dropped invisibly."* Fixed by storing the entire raw payload; proved by posting six invented fields (`fart_detected`, `methane_ppm`, `blade_engaged`, …) and confirming all 22 survived.
- **"GPS Speed" on a switched-off mower.** `077cc65`: there is no speed field in the payload at all, so the row fell through to lifetime distance ÷ lifetime hours — *"A mower sitting switched off in the garage reported a steady 0.7 mph (3.93 mi over 5.525 h), which is a real number answering a question nobody asked."*
- **Coverage that would bloat forever — caught by Jeff's question, not by testing.** `d3749b9`. Jeff asked: *"Won't the drift improve over time as it's making the history map of the yard?"* The honest answer was **no, and the shipped design would get worse**: GPS error is roughly zero-mean so *averaging* converges, but `mergeCoverage()` stored a **union** of cells, which only grows — "every drifted stray became a permanent cell, so over many mows the green would bloat outward into a ±5 m halo covering the house and driveway, never sharpening. **Jeff's question found that; I'd have shipped it.**" Fixed with visit-counted cells, shading by confidence, and a cap that drops the **least-visited** cells rather than the oldest; proved by simulating six mows with ±4 m drift (confirmed cells 0 → 156 → 246 → 293 → 316, cells-seen-once falling 297 → 78).
- **Coverage that only recorded if the app was open.** `5a0cea9`, caught one hour after shipping: `mergeYardCoverage()` ran inside `mowerSync()`, which only fires with the app **open** — *"You can't watch a phone while pushing a mower… Mow twice without opening the app and the first mow was lost."* Moved server-side entirely.

**Cost to Jeff:** A yard map of his parking spot presented as his most-mowed grass; readings lost forever; his device secret on a public URL; and a week of features that all had to be built twice.

**Lesson:** When the model of the device is wrong, every feature built on it is wrong in a different way — and you will fix them one at a time until you fix the model.

---

### 56 — The KV read-modify-write race — measured, mitigated, **and still open at branch tip**

**When:** Discovered 2026-08-11 during bench-testing of the firmware's store-and-forward buffer. **No commit in the repository closes it.**

**Symptom:** None visible. Readings silently vanish.

**Real root cause,** `docs/mower/CLOUD_SESSION_TASKS_2026-08-11.md` item 6 — and note that it is measured, not theorised:

> `onRequestPost` appends to `sensor_log`, `yard_coverage` and `hours_history` with a read-modify-write… Cloudflare KV is eventually consistent, so POSTs arriving close together read the same prior state and **clobber each other**.
>
> **Measured, not theorised.** A flush sent 4 POSTs ~1.3 s apart. The serial log shows all four returned **HTTP 200** … But `?log=1` afterwards contains only **two** `source:"buffered"` entries — `age_s` 90 and 60. **The 30 s one was accepted and silently lost.**

**Why it matters more than it looks:** `yard_coverage` uses the same pattern, so *"a real weak-WiFi flush will silently drop GPS points out of the yard map — the exact data the buffering was built to protect."* The store-and-forward buffer, built to survive bad WiFi at the far end of the yard, feeds its recovered readings into a mechanism that drops them.

**Mitigation only:** the firmware's 2-second `FLUSH_GAP_MS` — *"narrows the window; it does not close it."*

**Proposed real fixes, documented and not implemented:** batch the buffered readings into a single POST, or move the accumulator to a Cloudflare Durable Object.

**Status at branch tip (2026-08-16): OPEN.** A `git log --all` search for race/batch/Durable Object work returns nothing that lands it. **This is one of the few incidents in this ledger that the project has not solved.**

**Cost to Jeff:** Unknown and unquantifiable by design — the loss is silent, and every dropped reading returned HTTP 200.

**Lesson:** Read-modify-write on an eventually-consistent store is data loss with a success code attached.

---

### 57 — The 48-hour silent camera outage

**When:** Started 2026-08-10 11:16; found 2026-08-14, by accident.

**Symptom:** **None.** That is the incident. Zero motion events across all six cameras for 48 hours, and nothing anywhere said a word.

**How it was found:** while chasing an unrelated Apple TV question.

**Real root cause — and it is not a bug.** `eba1648` / `docs/beehive/alert_fatigue_fix_2026-08-14.md`:

> Chasing an Apple TV question revealed that **the entire camera pipeline had been dead since Aug 10 11:16** — zero motion events across all six cameras for 48 h. Root cause was NOT a bug: **Jeff had the Blink system disarmed, because the notifications never stop.**
>
> That is the actual failure loop worth fixing:
> > too many alerts -> Jeff disarms -> ALL camera automation silently stops -> no security at all
>
> **A disarmed Blink produces no error anywhere.**

The trigger, in Jeff's words: *"I don't need motion in the garage at all"* — the mains-powered garage camera *"fired 6 times in 7 minutes while he was simply working in there."*

**Fix:** `eba1648` — garage motion off permanently, and a new **5-minute per-camera cooldown**, deliberately **non-extending** so sustained activity keeps alerting (a prowler is never silenced).

**Promoted to doctrine** in `docs/SESSION_START.md` (`831db1b`), which every session must read:

> **Alert fatigue is a security failure, not an annoyance.** Too many alerts → Jeff disarms Blink → every camera automation silently stops → no security at all, with no error anywhere. **It already happened once (48 h dead, Aug 10–14).** Any change that increases detections must be paired with a suppression story.

**Cost to Jeff:** **Forty-eight hours with no security coverage on his house.** Not a byte of data, and the most expensive entry in this ledger by consequence.

**Lesson:** A system whose off-switch is a human being irritated by it will be switched off — design the suppression before the detection.

---

### 58 — The self-inflicted AI feedback loop, and the mute that had never once worked

**When:** 2026-08-15, both introduced/found the same day.

**Symptom (1):** AI detection dead, while every health check read green.

**Real root cause (1):** `docs/beehive/camera_pipeline_VERIFIED_2026-08-15.md`:

> **Feedback loop** (self-inflicted that morning): the HomeKit image swap also repointed the `image_processing` sources, **so the AI scanned its own annotated output and detection went dead while every health check read green.** Fixed: scanners on `camera.*_clipframe` (clean input), HomeKit on `camera.ai_*` (annotated output). **This split is load-bearing — never point the scanners at `ai_*`.**

**Symptom (2):** None — the mute button appeared to work.

**Real root cause (2):** *"**Mute/cooldown system had NEVER worked.** Two independent bugs: `camera_key` carried a `_clipframe` suffix so every mute wrote to a **nonexistent helper**, and a string-truthiness bug made the duration logic meaningless."* The 08-14 cooldown automation had passed template validation and had never once muted anything. The record dates the **first successful mute writes in the system's history** to 08-15 16:30 and 16:37–38.

**Symptom (3):** No clip history existed. `blink.save_video` *"had overwritten one fixed file per camera forever."* Fixed with timestamped archiving to `/config/www/blink_archive/`, 7-day pruning, nightly mirror to the beast.

**How all three were caught — the method, which became doctrine:** a **Razer Kiyo Pro webcam physically aimed at the Apple TV**, capturing a frame every ~0.9 s with millisecond filenames, cross-referenced against HA's own history timestamps (`c5a6aab`). Measured, not asserted: motion → AI red-box file **8 s**; motion → popup on screen **4.7–6 s**, photographed three times; detection → push + popup + cooldown + archive **≤1 s**.

The doctrine, now invariant #1 in `docs/SESSION_START.md`:

> **Component checks (bridge loaded, config valid, camera serves an image) said "healthy" through every one of the day's real failures. Only watching the far end of the pipeline caught them.**

**Cost to Jeff:** A morning of dead detection he could not have detected, and a mute button he had presumably been pressing to no effect.

**Lesson:** Health checks measure components; only the output measures the system.

---

### 59 — Every camera blind to a person at night

**When:** Found 2026-08-15 (`7a1d250`), fixed property-wide 2026-08-16 (`fab5b30`). The threshold had been 60 since the pipeline was built on 2026-07-10.

**Symptom:** None. The system reported healthy and detected nothing after dark.

**How it was found:** by **pulling the actual image** rather than reading a status:

> Pulled `/api/camera_proxy/camera.ai_backyard` and looked at it: **deer 15 ft away**, and the scan returned `sheep 27.4% · person 25.5% · car 38–43%` against a **60% threshold** → `targets_found: []`, so no push, no popup, no archive. **A person at night scores ~25% and is discarded too.**

**Real root cause:** a confidence threshold set for daylight, applied to night-IR imagery where YOLO scores collapse.

**The wrong easy answer, rejected with evidence:** "just lower the threshold" is not sufficient, because *"an earlier scan boxed `car: 61.7%` on what Jeff identified as a **distant porch light**, so it false-positives on a light while ignoring a real animal."* The fix order was reasoned and recorded: drop vehicle, crop LEFT via `roi_x_min`, **then** lower animal/person — with a note on why a `roi_y_min` crop would be wrong.

**Fix:** `fab5b30` — all six cameras from confidence 60 → 25, config checked valid, HA restarted, all six verified reporting person@25/animal@25:

> at 60 a night-IR person scores ~25% and is silently discarded, so **every camera on the property could miss an intruder after dark.**

**Still open at tip:** the backyard PIR *"still logs zero motion events even overnight at 78 °F… Not yet root-caused"* (`SESSION_START.md`).

**Cost to Jeff:** Five weeks of a six-camera security system that could not see a person at night — discovered only because somebody looked at a picture.

**Lesson:** A detector reporting "no targets" is indistinguishable from a detector that is blind; look at what it saw.

---

### 60 — The `_headers` `/*` wildcard that silently did nothing

**When:** 2026-08-15, 19:56 → 20:09. Three deploys.

**Symptom:** Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy) added and simply not present on the live site.

**Wrong theories / attempts, in order:**
1. `7a1d250` — add a `/*` wildcard block. Verified live for 5+ minutes after the deploy landed; headers absent. Crucially, the deploy itself was proven fine (CLAUDE.md from the same commit was serving) and *"the pre-existing exact-path rule for `/service-worker.js` WAS being applied."*
2. `37fac0c` — assume ordering/comment syntax: move the wildcard last, drop the leading comment block. **Failed too.**

**Real root cause:** accepted on evidence rather than theory (`186025f`): *"**Two deploys proved the `/*` wildcard is silently ignored on this Pages project.** Exact-path rules DO work here."*

**Fix:** `186025f` — hang the headers off `/` and `/index.html`, "which covers the app shell, which is where X-Frame-Options and Referrer-Policy actually matter; static images are not meaningfully exposed by their absence." No CSP by design — `index.html` is one inline script/style block and would need `unsafe-inline`.

**Cost to Jeff:** Two wasted deploys; no user-facing impact.

**Recorded as a permanent invariant** in `docs/SESSION_START.md`: *"Cloudflare Pages `_headers`: exact-path rules work, `/*` is silently ignored."*

**Lesson:** Two identical failures against a platform's documented behaviour means the documentation is not describing your project — believe the deploy, not the docs.

---

### 61 — The Kasa HS220 onboarding: two hours spent on the wrong suspect

**When:** 2026-08-14.

**Symptom:** A new TP-Link Kasa HS220 dimmer, physically wired in by Jeff, would not onboard.

**Wrong theory:** The network. Exhaustively: DHCP, MAC filtering, WPA-2, channel 1, SSID visibility, band steering — all verified from inside the AT&T gateway. `09de34b` records the bill in one line: *"**Setup took ~2 hours and the network was NEVER the problem.**"*

**Real root cause:** *"**These HS220s ship on NEW firmware** using an encrypted onboarding protocol (server identifies as 'SHIP 2.0', port 80, NOT the legacy port 9999)."* Consequences recorded so nobody repeats them: HA now needs TP-Link **account credentials** to add them (control stays local; the account only authenticates the local session), and direct provisioning over the setup AP is impossible — *"all payloads return `error_code 1003`… **Do not waste time on this again.**"*

**Two genuine bonuses banked from the same two hours:** the beast's ASUS USB-AC53 Nano can be radio-enabled via the WinRT API to join IoT setup APs for diagnostics without disturbing the wired LAN; and **HA exposes `switch.<device>_auto_update_enabled` — the firmware auto-update toggle the Kasa app hides.** Turned off for this switch, and made a standing rule: *"Do the same for every future Kasa device"* — extended on 08-15 to all Zigbee gear: "disable any auto-firmware-update BEFORE first pairing (the Kasa rule)."

**Cost to Jeff:** Two hours, and a wall switch he had already wired sitting inert.

**Lesson:** When every network variable checks out, the device changed — go looking for a firmware-era difference, not another router setting.

---

### 62 — The network-map identity churn

**When:** 2026-08-13 afternoon, ~30 minutes.

**Symptom:** A single laptop's identity published, retracted, republished and retracted again — four answers for one IP address.

**The sequence, in order:**
1. `902d0dc` (14:25) — ".173 DellMasterBed is Jeff's Acer laptop, not the B570."
2. `8aeacf0` (14:28) — "laptops **finally straight** — JeffsLapTop IS the Acer…, DellMasterBed is the B570 **as originally recorded**." (It wasn't finally straight.)
3. `7f38015` (14:50) — "DellMasterBed is literally a Dell - Angela's 2nd office computer (per Angela)."
4. `793b949` (14:56) — ".173 is the B570 **after all** - Windows name inherited from Jeff's old Dell (self-reported hostname, not a gateway ghost)."

**Alongside it, the Tuya mis-identifications:** `8796a9c` — *"The 'Nest Protect' unmasked: Angela's bed-lamp Tuya socket, proven by unplug test"* (a "free Guardian integration" that never existed); and `2aca121` — a flatly-labelled double error: *"Sylvania plugs are WiFi Tuya (.199/.200/.202/.205) - **Echo Dot guess and Bluetooth-only verdict both wrong, corrected.**"*

**Real root cause:** identification by **self-reported Windows hostname** — names inherited from cloned installs — plus misleading gateway device-table labels.

**What actually worked:** physical evidence. **Unplug tests** (pull the plug, see which row dies), **MAC-embedded Tuya device IDs**, and **heartbeat timing** (which is how the mower ESP32 was positively identified, `0916096`).

**Cost to Jeff:** None material — but the network map is a reference document, and for half an hour it was confidently wrong four times in a row.

**Lesson:** A hostname is a claim a machine makes about itself; a MAC address and an unplug test are facts.

---

### 63 — The irrigation 401 goose chase, and the error message that was empty

**When:** 2026-08-13 morning, ~30 minutes across three commits.

**Symptom:** `/api/irrigation` returning HTTP 401 on login — while the B-Hyve phone app signed into the same account fine, and the HA integration authenticated against the same account from a different IP the same day.

**Wrong theories / attempts, in order:**
1. **Changed password.** Ruled out by the phone app working.
2. **Missing `orbit-app-id` header.** `950c8d5` — a genuine improvement (the HA side sends it and cycles three values; this file sent none, and the id had to be carried onto the `/devices` call too, "sending it only on `/session` would have moved the 401 one step later instead of fixing it") — **but not the cause.**
3. **Datacenter IP block.** Plausible given the 530/1018 history from June (#9). Wrong: `560e76d` got *"the identical response from Jeff's own network using deliberately fake credentials, in 0.37s"* — 401 is simply Orbit's generic bad-login reply.

**Real root cause:** `560e76d`:

> The real problem is **precedence.** `env.BHYVE_*` was read FIRST and the query params second, so a deployment variable set once and long since stale silently overrode the correct credentials the app sends on every single request. **The good login never got tried.**

**The meta-root-cause — why the morning was burned:** `a13df25`:

> `asyncio.TimeoutError` stringifies to an empty string, so `f"B-Hyve fetch error: {e}"` produced literally **"B-Hyve fetch error: "** with nothing after it. That dead end sent today's investigation down three wrong paths — changed password, missing `orbit-app-id` header, datacenter IP block — **before the emptiness itself became the clue.** Now always includes `type(e).__name__`.

`a13df25` is also a model of honest release discipline: it is titled **"(NOT YET DEPLOYED)"** because Beehive runs its own copy of the integration, the committing machine had no Python to `py_compile` it, and *"the integration is currently healthy (6 zone entities), so there is no reason to rush an unvalidated Python change onto it."*

**Cost to Jeff:** A morning, and a stale environment variable that had been quietly overriding his real credentials for an unrecorded length of time.

**Lesson:** Always log the exception **type** — an exception that stringifies to nothing will send you down three wrong roads before the silence itself becomes the evidence.

---

### 64 — The Inovelli documentation failure

**When:** Decision made in conversation ~2026-08-13 20:07 CDT. Re-litigated 2026-08-16 morning. Seven commits between 07:48 and 09:01 constitute the response. **This is the incident that caused this entire archive to exist.**

**Symptom:** On the morning of 08-16, a fresh session sat down to plan the Zigbee buildout, read **one** document dated 08-13, and proceeded to (a) re-ask four questions that later commits had already settled — dimmer selection, neutrals, box fill, garage two-location — and (b) pitch Jeff a pair of ~$60 Inovelli Blue dimmers **he had killed on price at the beginning of the project.**

**Jeff's four responses, all preserved verbatim:**

> *"you did not read the archives on what was settled and planned."* — `831db1b`

> *"those were scrapped at the freaking beginning — told you I was not paying $120 for a freaking dimmer switch."* — `docs/lighting/zigbee_dimmer_selection_2026-08-13.md`

> *"I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would rather spend the money on that and have your help than buy $120 worth of dimmers."* — `/tip/CLAUDE.md`

> *"you tell me it is all documented and it is not, then the session closes and you come back with some plan that was two weeks ago — **this is infuriating**."* — `/tip/CLAUDE.md`

> *"I can't keep doing this every time the session changes."* — `1d1ebdb`

**Wrong theories / attempts, in order — and this is a failure with five distinct compounding parts:**

1. **Plan off one stale doc.** The session surveyed too few documents before planning (`831db1b`).
2. **Close a pending item on the dead answer.** `007e14e` (07:59) closed Pending Item 19 (the garage two-location switch question) on the ground that *"the Inovelli Blue 2-1 VZM31-SN supports a 3-Way Dumb configuration."* Reversed 17 minutes later.
3. **Tell Jeff the decision was never documented.** `1572b4a` (08:08): *"Jeff rejected the Inovelli Blue early on (~$60 ea / ~$120 the pair) **and the decision never made it into any document.** Yesterday's inventory update still said TO BUY: 2, so this session planned the entire Zigbee mesh around them and pitched them back to him. **That is a settled decision being re-litigated because the docs disagreed with reality.**"*
4. **Tell him that a second time.** Which was itself wrong.
5. **Finally search properly.** `c05d647` (08:16) — the most self-aware commit in the repository:

> **I told Jeff twice that the decision to drop the Inovelli dimmers was never written down. That was wrong, and I found the proof in the session transcripts.**
>
> On 2026-08-13 20:07 CDT a session agreed with him that mesh routers do not have to be light switches, and **16 minutes later produced `docs/lighting/HCC_Lighting_Plan.html` — the printable build plan he asked for**, Rev. Aug 13 2026. Its thesis is exactly the current plan: Job 1 switches -> WiFi Kasa, Job 2 mesh -> Zigbee plugs, with the line "why not a $46 mesh dimmer: the switch was only being asked to repeat the mesh, a job a $10 plug does better." Shopping list totals ~$104.
>
> **Why I missed it: I grepped for "Inovelli", got no hit in that file, and concluded no document existed — when the ABSENCE of that word is what marks the current plan.**

**Real root cause — two layers, and the second is the subtle one:**
- **Layer 1:** the price rejection was made in conversation and never annotated into either of the two documents that carried the *old* answer. The **inventory was even updated on 08-15 — a day after the decision — still saying "TO BUY: 2."**
- **Layer 2 (the grep trap):** the correct plan *was* documented, the same night, sixteen minutes after the decision. It was invisible because searching for the **dead** plan's keyword found nothing, and "nothing found" was read as "nothing exists."

**The fixes, escalating, all on 2026-08-16:**
- `1572b4a` (08:08) — scrap notices written into **both** stale sources; the Enbrighten rejection *research* kept ("the documented mesh-routing defects are still valid") but the selection killed. Standing lesson: *"**a decision made in conversation goes into the doc the SAME session.**"*
- `831db1b` (08:05) — the **doc index** in `SESSION_START.md`: *"52 docs exist, survey before planning,"* mapping each subsystem to the files that must be read first, "newest first, because older docs go stale."
- `c30b64d` (08:11) — a new PROTECTED `CLAUDE.md` section, **🔒 SETTLED DECISIONS — DO NOT RE-PROPOSE THESE**: *"Jeff has settled these. Re-pitching any of them wastes his money, his time, and his patience. If a session is about to suggest one of these, it has not done its reading."* It also records the project's budget philosophy in one line: *"**his money goes to the tools that help him build, not to premium hardware where a cheap part does the job.**"* And it states the enforcement rule with Jeff's words attached: *"Writing it down is not optional housekeeping; it is the difference between a project that moves forward and one that loops."*
- `c05d647` (08:16) — reverses its own morning edit (**Pending Item 19 reopened**) and writes the grep trap down so it cannot recur: *"⚠️ **A trap that already cost a whole session:** searching the docs for 'Inovelli' and finding nothing does NOT mean the plan is undocumented — the *absence* of that word is what marks the CURRENT plan. Search for **Kasa / plug / mesh**."*
- `1d1ebdb` (09:01) — **the HCC MASTER RECORD**, built the same morning: 196 files, 124 MB in iCloud (deliberately never auto-loaded), containing `HCC_DECISIONS_LEDGER.md` ("81 decisions in Jeff's own words - START HERE"), 6,896 messages verbatim, all 635 commits with diffs, 25,547 tool events, 187 images, six re-runnable scripts, and a scheduled task rebuilding it daily at 5:45 AM. `SESSION_START.md` was made to say: *"**Every word ever said on this project is archived and searchable. There is no longer any excuse for 'that was never documented.'**"*

**Cost to Jeff:**
1. **A whole session's planning work, discarded** — `/tip/CLAUDE.md` calls it *"⚠️ A trap that already cost a whole session."*
2. **Four settled questions re-litigated**, some of which he had answered by *doing physical electrical work* (`8b7a69a`, 08-13: "Jeff pulled dedicated LED circuits + multi-gang boxes").
3. **Being pitched ~$120 of hardware he had explicitly refused** — framed by him against the $125/month he pays for the tool doing the pitching.
4. **Trust in the documentation itself.** *"you tell me it is all documented and it is not."*
5. **Cumulative:** *"I can't keep doing this every time the session changes."*

**Note on money:** the $120 pair was **never bought.** `docs/inventory/HCC_INVENTORY.md` carries the strike-through and the standing order: *"🔴 SCRAPPED — DO NOT BUY (Jeff, on price)."* The cost here was time, planning and trust — not spend.

**Lesson:** A decision that lives only in a conversation does not exist; and "I searched and found nothing" is a statement about your search terms, not about the archive.

---

### 65 — The desktop-wide layout bug

**When:** Found 2026-07-11; fixed 07-12; **re-emerged and re-root-caused 08-06**; final mechanism found 08-11. Status at tip: **fixed and closed.**

**Symptom:** On any browser window wider than ~700–900 px, the heroes left a large dead black area to the right instead of filling the window.

**The rounds:**
1. **Found, deliberately not fixed** (`c926ceb`, 07-11). The coworker session diagnosed it precisely and left it alone because `index.html` belonged to the cloud session under Rule 13: *"`.sec-hero-weather`/`-irr`/`-yard`/`-guardian` etc. set `aspect-ratio` + `max-height:460px` but no `width`/`max-width`, and there's no centered max-width shell around the app anywhere in the CSS… CSS derives the box's **width from the aspect ratio** (~700px) instead of the viewport, and since nothing centers it, it sits flush-left. Confirmed via direct CSS read, not just visual."*
2. **Fixed** (`a1a6d7a`, 07-12) with a centred max-width container and breakpoint scaling for TV/tablet/desktop.
3. **Re-root-caused** (`af230cd`, 08-06) — the gap was back, and the mechanism stated more precisely: once the aspect-ratio-driven height would exceed `max-height`, *"the browser shrank the WIDTH to satisfy both constraints instead of just cropping more of the image."* One rule fixed it: `width:100%` on all seven hero classes. Verified by a five-viewport Playwright sweep (390/768/1024/1440/1920).
4. **Final mechanism** (`86b47e6`, 08-11) — the same ambiguous CSS returned as the **Safari/Chromium divergence** behind the sideways iPad (#50); resolved by removing the ambiguity entirely (explicit height, `aspect-ratio:auto` at ≥768 px).

**Status at branch tip:** `/tip/CLAUDE.md` Pending Item 7 is struck through — *"~~Desktop-wide-browser layout gap~~ — **FIXED 08-06**"* — with the full root cause, the one-line fix, and the five-viewport verification recorded. **Closed.**

**Cost to Jeff:** A month of an app that looked broken on every screen except a phone — including the TV and the iPad it was being built for.

**Lesson:** `aspect-ratio` + `max-height` with no `width` is an under-constrained box, and browsers are entitled to disagree about how to solve it — say what you mean.

---

### 66 — CLAUDE.md became the problem it was written to solve

**When:** 2026-06-28 (first hygiene rule) → 2026-08-16 (restructure). Condensed **four separate times**.

**Symptom:** The project's memory file — auto-loaded into every message of every session — grew to **260 KB**, of which **68% was changelog**.

**The rounds:**
1. `a4ae337` (06-28) — 737 → 550 lines, and **Mandatory Rule 11** added: *"it's injected into every message, so bloat costs efficiency on every turn… Target: stay well under ~600 lines."* Immediately bounded seven minutes later by `1305f0a`, the **PROTECTED** clause: *"'Jeff's Message', 'The Working Relationship', and these 'Mandatory Rules'… Compression only ever touches history/changelog/reference — never the relationship. **They are the point of the whole project.**"*
2. `5ed12f0` (07-16) — 678 → 573 lines.
3. `2fdef21` (07-21) — Change Log compressed 73.6 KB → 49.6 KB, with the reasoning stated: *"its size has a real, ongoing token cost."*
4. `414c74f` (07-28) — 610 → 374 lines "per Jeff's request."
5. `fab5b30` (08-16) — **260 KB → 58 KB.** *"CLAUDE.md is auto-loaded and occupies context for the whole session; at 260 KB it was crowding out real work."* Heavy material moved (not deleted) to `docs/CHANGELOG_ARCHIVE.md` (179 KB, all 98 entries verbatim), `docs/BEEHIVE_REFERENCE.md`, `docs/UTILITIES_REFERENCE.md`, plus a new 4 KB `docs/SESSION_START.md`.

**Real root cause:** the file had two incompatible jobs — permanent relationship contract (must never shrink) and running project log (grows forever) — and only one of them had a hygiene rule.

**The discipline that held throughout, and deserves recording:** every single condensation asserted the PROTECTED sections untouched. `fab5b30`: *"Every PROTECTED section (Jeff's Message, The Working Relationship, Mandatory Rules, Debugging Protocol) was **asserted byte-identical** before writing."*

**Jeff's own instruction on the fix** (`/tip/CLAUDE.md`): *"break it up and put the stuff in iCloud and then just tell yourself to read that."*

**Cost to Jeff:** Slower, dumber sessions, for weeks — the memory system taxing the work it was there to enable. And a compounding irony: `2fdef21`'s compression deliberately deleted the long-form narrative detail *"that already lives in git log"* — which is precisely the material this archive had to reconstruct from git log.

**Lesson:** A memory file that grows without a retention policy eventually costs more than the memory is worth — split the contract from the log.

---

### 67 — Smaller multi-attempt incidents, recorded so they are not re-investigated

Each of these took more than one attempt or produced a lasting rule, but is too small for a full entry.

- **SYLVANIA plugs, settled twice.** `f010694` (07-07) — confirmed firmware-locked to the SYLVANIA app; Smart Life rejects them in **both** EZ and AP mode with every setting correct; forum-confirmed walled garden; LocalTuya/flashing back-doors need the same blocked access. *"DEAD END for HA (confirmed, do NOT re-attempt the Tuya path)."* Re-settled five weeks later after a fresh attempt that reset one plug — `2caaebf` (08-13): *"vendor-locked, cannot join HA — **settled, do not retry**."*
- **myQ, rejected twice.** `e20d3d5` (07-26) — Chamberlain blocked third-party API access in 2023; HA's `myq` integration removed in 2023.12; Jeff's MYQ-G0402 hub *"is now USELESS for HA."* Re-litigated 07-28 when Jeff found a supposed HACS workaround — `c94e7aa` verified it dead (repo URL 404s; block confirmed permanent by the HA codeowner's own writeup: Cloudflare bot-detection + Firebase app-check added specifically to kill third-party clients). Rule: *"**Don't revisit MyQ software integrations again absent a major news event reversing Chamberlain's policy.**"*
- **A commit that claimed code it did not contain.** `1f4008f` (07-28): the electric usage model described in `07bd9a1`'s message *"existed only in the local working tree and was never actually part of `07bd9a1` despite that commit's message claiming it — **so the feature was never live**."* Exactly the failure mode this archive exists to catch.
- **Water cost lines blank forever.** `6abb907` (07-28): `putWaterCycle()` — which computes water/sewer cost, billing history **and the irrigation sewer-overcharge note** — was gated behind "HA does NOT have `sensor.water_month`." The moment that helper went live, the entire branch was permanently skipped.
- **The lazy-loading CLS regression, self-caught.** `2102e3a` → `38a5f17` (08-01): a controlled before/after Lighthouse A/B showed the optimisation pass had **regressed** Cumulative Layout Shift 0.023 → 0.436 (unreserved image containers). Fixed with per-image `aspect-ratio`; re-measured to 0.015. A rare case of a self-inflicted regression found by the author's own measurement before the user saw it.
- **The panic button was publicly fireable.** `80799e7` (07-09): with `loewenhome.com` about to go public, *"the panic webhook was unauthenticated — any anonymous visitor could fire the real alarm."* Gated behind the HA token and routed via the `/api/ha` proxy. Two lower-severity holes were **accepted and recorded, not fixed**: the open `/api/hours` POST ("a stranger could push junk mower telemetry — griefing only") and the Nabu Casa URL visible in client JS.
- **Nine HA add-ons exposed to Alexa voice control.** `1f4e791` (08-14), found because *"Jeff spotted duplicate devices in Alexa"*: *"**'Alexa, turn off Z-Wave JS' would take down the Zigbee/Z-Wave stack**; Studio Code Server is how Beehive gets edited. **Alexa fuzzy-matches names, so a misheard command can plausibly hit one.**"* Exposure cut 69 → 33. The later HomeKit policy commit names it: *"never expose add-ons like the Alexa mess"* (`18ff039`).
- **A live API key in a public repo — twice.** `552c699` (08-02) caught a Weather.com key hardcoded in `packages/hcc.yaml`, found *"only because the repo's public status was checked before doing anything, not assumed."* And `1d1ebdb` (08-16) flagged Claude against itself at the end of its own commit: *"**SECURITY: the Weather Underground API key is in CLAUDE.md in this PUBLIC repo. It needs moving out and rotating.**"* **INFERRED:** WU station/key material has been in that file since at least `c55d382` (07-03); **the record does not say whether it was ever rotated.**
- **A password pasted into a README about not leaking passwords.** `CHANGELOG_ARCHIVE.md`, 08-11: *"A credential scan of the staged diff then caught me pasting that same password into a README *about not leaking it*."* Same entry: *"`strings` is not installed on this PC and returns a silent false 'clean' on a binary — `grep -a` is the check that works, and it caught that the compiled `.bin` holds the WiFi password in plaintext."*
- **PowerShell's invisible BOM.** `552c699`: *"`Set-Content -Encoding utf8` silently prepends a UTF-8 BOM, which corrupted the token and caused **silent 401s**"* — fixed with `[System.IO.File]::WriteAllText` and a no-BOM encoding.
- **The Morning Digest's false "all clear."** `f1d24f3` (08-01): the digest's "active alerts" count *always silently returned 0* because persistent notifications left the template-readable state machine in HA 2023.6. *"Removed that metric entirely rather than ship a false 'all clear.'"*
- **The Kodi buffering fix that never took effect.** `f1d24f3`: Jeff's `advancedsettings.xml` edit was a no-op — Kodi 21 moved cache settings into the GUI, which overrides the XML. The real values were still at defaults in `guisettings.xml`, "confirming the XML edit never took effect."
- **A runtime-only automation disable that wouldn't survive a restart.** `62e99b5` (08-01): `automation.turn_off` with a desynced entity_registry entry; real fix was the documented `initial_state: false` YAML key — *"an `initial enabled: false` guess would have silently done nothing."*
- **`window.open()` is a no-op in an installed iOS PWA.** Found 06-28 (`c294216`), codified as a design rule (`8b4c8a0`) — and then **~20 call sites were found still using it a month later** (`8501360`, 07-31), broken "in exactly the way Jeff actually uses this app." Fossilised into `scripts/lint-app.js` and `scripts/smoke-test.js` so it cannot return.
- **Jeff couldn't find the token input.** `8efc3c4` (07-14): hidden in the cameras section and only rendered after Beehive responded; on iPad, OPEN BEEHIVE just navigated away. A chicken-and-egg identical in shape to `3043f34`'s (#19) three weeks earlier.
- **False "window open" alerts — the *other* one.** `502bcff` and `6464a8e` are #31/#32; separately, `022715a` (06-24) fixed B-Hyve showing OFFLINE while online because *"`is_connected` returns null on some firmware versions,"* and `73e1368` fixed Beehive never being detected because `checkBeehive` tested `d.version` — a field HA's `/api/` never returns (it returns `{"message":"API running."}`).
- **The panel-scorching over-flag.** `76d0326` (06-27) flagged "possible scorching near center breakers" on Jeff's Challenger panel as a live hazard from a photo. Jeff supplied the history; `81e32b8` rewrote it three minutes later with an explicit anti-repeat instruction: the discoloration predates his ownership, was inspected by the home inspector and by Jeff, the affected section was abandoned with breakers relocated down, *"stable and fine for 10+ years… **do NOT re-flag as a new hazard.**"*
- **The audit tools that lied.** Three recorded instances: the button-contrast auditor reporting six false failures because it read only `backgroundColor` and missed `linear-gradient` (08-11); two red Playwright tests that were *"stale tests, not app bugs"* whose "Execution context was destroyed" message sent the session chasing a phantom `location.href` (08-11); and `7a1d250` (08-15) **correcting two of its own audit's findings** — `/api/irrigation` is a fallback rather than dead code, and "15/15 failing Actions runs" all predate the 08-06 disable.
- **The mangled commit messages.** Two commit bodies were corrupted by unquoted shell expansion at commit time: `6f9cd3f` (07-03) stores the water rate as *"/bin/bash.00908"* (the real constants, confirmed in `index.html` at tip: `WATER_BASE = 10.32`, `WATER_PER_GAL = 0.00908`), and `857d825` (06-30) contains *"barn owner pays /bin/bash until…"* where the doc reads "$0 risk." Recorded so no future archivist reads `/bin/bash` as a price.

---

### The patterns

Sixty-seven incidents, and they are not sixty-seven different mistakes. They are **eight** mistakes, made repeatedly, in different subsystems. This is the part of the ledger worth re-reading before starting any session.

#### Pattern 1 — Silent failure: the catch, the whitelist, the empty string

The single most common shape in this record is **a failure that produces no error anywhere.** `save()` swallowing a quota exception and taking Jeff's hours with it (#53). A field whitelist recording `null` for real data — "that reading was lost forever" (#55). `asyncio.TimeoutError` stringifying to nothing and burning a morning (#63). `blinkRefreshAll()` swallowing per-camera failures so one dead camera still reported "Updated." A KV write returning HTTP 200 on a reading it silently dropped (#56). A disarmed Blink producing no error while a house went 48 hours without security (#57). `packages/hcc.yaml` never loading, ever (#22). A `/*` wildcard "silently ignored" (#60).

The counter-discipline the project eventually adopted: **store the raw payload rather than a whitelist; log the exception type, not just the message; never swallow a write failure; and treat "no error" as "no information."**

#### Pattern 2 — Verified against a mock, not against reality

Bugs that survived a green test suite because the test never touched the real thing. The LUX PUT fix marked *"deployed, 26/26 tests"* while the API still 500'd (#12). The Electric SmartHub whose UI cells rendered perfectly against nothing (#45). The glassmorphism redesign that passed lint, smoke tests and mocked Playwright screenshots with **short placeholder values** and collapsed on real long data (#46). The heartbeat merge unit-tested against a mocked KV, keyed to fields the device never sent (#51). The mute/cooldown system that passed template validation and had never once muted anything (#58). And the mother of them all: a server contract written against a **prose description** of firmware nobody could read (#54).

The rule that came out of it is now invariant #1 in `SESSION_START.md`: *"Never declare done without verifying the far end. Component checks said 'healthy' through every real camera failure on 08-15; only looking at the output caught it."*

#### Pattern 3 — Declared done before it was done, then retracted

A specific and repeated trust failure: announcing a fix and having Jeff disprove it. The Fire TV pop-up "confirmed working end-to-end," twice, before a live retest proved it had never worked (#25). `input keyevent 127` shipped as a pause that "does nothing" — the record's own words: *"a repeat of the exact 'declared done without testing' pattern the whole debugging protocol exists to prevent."* The iPad wall display "fully set up" and retracted 47 minutes later (#30). The B-Hyve history called a "definitive" dead end, reversed in eleven minutes (#17). *"Not overclaiming a 4th time"* (#50) — a phrase that only exists because there were three previous times.

This is the pattern behind the founding crisis message: *"You wait for me to call out the issues instead of testing and retesting to make sure it 💯 correct."*

#### Pattern 4 — The first plausible explanation, defended too long

Wrong theories that were *good* theories, held past the point where the evidence stopped supporting them. Page weight explaining a blank page (#1/#2). The `empty_cookies` cookie-jar theory for Blink, sourced from real upstream issues and completely wrong (#21). Four payload theories for a 500 that was a wrong HTTP verb (#12). Two garbage-map answers blaming Jeff's tapping when the fault was a near-zero denominator (#52). Guided Access and rotation lock for an iPad that "worked perfectly before the picture edit" (#50). Three wrong roads for a 401 that was a stale environment variable (#63). Config-entry API emptiness read as PIN emptiness (#35).

Jeff named this himself and it became Mandatory Rule 16: *"you go down one road and get tunnel vision and you spend more time fighting over that single tunnel... **open your damn mind and look at all options.**"* The counter-discipline written into the Debugging Protocol is simpler: **audit your own recent changes first, and when a theory fails twice, change the category of the theory, not its details.**

#### Pattern 5 — Two halves of a contract, written by parties who cannot see each other

The most expensive pattern in the project, and the least like a bug. The cloud session had no outbound network and could not see the `.ino`; the firmware was not in the repo; so the server half of the sensor contract was written against `CLAUDE.md`'s description — and the description was wrong for months (#54). The same shape appears everywhere once you look for it: a plan doc written **after** the build it contradicts (#26); an inventory updated the day **after** the decision that invalidated it (#64); `HCC_KV` in code and `MOWER_KV` in a dashboard nobody could read (#4); one session's legitimate helper entities silently breaking another session's camera grid, twice (#31); competing explanations for the same meter outage sitting unreconciled in the memory file (#37).

The structural fix, when it finally came, was not a patch: **put both halves in one repo so they can be diffed** (`a1cfa53`), and **give the subsystem to the session that can touch the hardware** (`d18db7b`).

#### Pattern 6 — Substring matching in a shared namespace

Small, specific, and it recurred at least eight times: `find('window')` matching house windows (#31), `val('lock.')` matching house locks, `entity_id.startsWith('camera.')` matching internal helpers **twice** (#31), a keyword matcher picking `eco_score_bonus_range` over `range_liquid`, `parseFloat` on a timestamp sensor returning the year 2026 (#20), a digit-parse unable to find a zone number in the word "Garden," a hostname inherited from a cloned Windows install (#62), and — the inverse — grepping for a keyword whose **absence** was the answer (#64).

The rule: **identify by an explicit allow-list or a scoped prefix, never by "contains."**

#### Pattern 7 — Data that grows without a bound, in a place with one

`localStorage` blown out by a server-owned coverage map, resetting Jeff's hour meter (#53) — and the same class one layer down in base64 service photos, found only because he asked. `CLAUDE.md` at 260 KB crowding out the work (#66). A coverage map stored as a **union** of cells that could only ever grow into a 5-metre halo over the house (#55). `sensor_log` capped at 5,000 only after the fact. A KV value fought over by four POSTs 1.3 seconds apart (#56). 124 failure emails a week into a human's inbox (#48).

The rule, written in the blood of the second hours loss: *"**Server-owned, re-downloadable, unbounded data does not belong in the user's core state blob.**"*

#### Pattern 8 — The human is the last line of defence, which means the defence has already failed

Read the incidents for who found them. Jeff found the timeout regression (#18). Jeff found the sideways iPad's real cause with one sentence about a picture edit (#50). Jeff found the right garage-door part after three wrong ones (#49). Jeff's question found the coverage-union flaw before it shipped (#55). Jeff's question found the second storage time bomb (#53). Jeff noticed his own Mercedes app asking for a PIN, which started the thread that fixed it (#35). Jeff supplied the panel's real history when it was wrongly flagged as a hazard (#67). Jeff caught the date/time discipline failure. Jeff produced WHUD's own form that reopened the meter question (#37).

He said what this costs, in his own words, on 2026-06-23: *"I'm tired of having to keep you on task and moving the project forward."* And on 2026-08-05, in the rule his frustration produced: *"**He does not have time to be the fact-checker on my hardware recommendations.**"*

The project's whole institutional answer — the PROTECTED Debugging Protocol, the pre-session checklist, `lint-app.js`, `smoke-test.js`, the Kiyo Pro pointed at the television, the 52-doc index, the SETTLED DECISIONS section, and finally the MASTER RECORD — exists to move the point of detection back from Jeff to the work.

---

### What this ledger does not know

An honest index of failure has to mark its own edges.

1. **Durations are often unstated.** For several incidents (#3, #22, #39) the record proves the bug existed but not for how long. Where a duration is given here, it is derived from commit timestamps, not from testimony.
2. **The money is almost entirely unrecorded.** Only one incident in this ledger has a documented dollar cost of the *fix* (#46: ~9 cents per regenerated image). The replacement mower hardware (#54) is evidenced twice as a fact and **nowhere as a number** — no price, SKU, vendor or date exists in the repository. Individual component prices are scattered through `docs/inventory/HCC_INVENTORY.md`, but **nobody ever totalled the project.**
3. **"He was told the sensors were faulty" is evidenced; the telling is not.** Both `/tip/CLAUDE.md` and `firmware/mower_hours_esp32/README.md` state it plainly. **The message in which Jeff was told that does not survive anywhere in this repository**, nor does the date, nor which session said it.
4. **"The last debacle" (2026-08-14) is unidentified.** Jeff removed the cloud session from the project entirely — *"I only work with you, I'm done with code after the last debacle"* (`46c7450`). **No document names what it was.** **INFERRED:** the strongest candidate is the 08-10/08-11 mower cluster (#53 + #54), the only failure in the surrounding window large enough to warrant the word — but this is inference, and the record is silent.
5. **One incident is open at tip:** the KV read-modify-write race (#56). Two more are open and honestly labelled in `SESSION_START.md`: the backyard PIR that logs zero motion even in cool overnight hours (*"Not yet root-caused"*), and the HA backup encryption key that *"still exists only on this PC — without it every iCloud backup is undecryptable."* Also open: the Alexa skip distance, uncalibrated against Jeff's actual 4:40 target (#42).
6. **The conversations are gone.** Every quotation of Jeff in this ledger survives only because a commit message or a doc preserved it. The literal back-and-forth of the first eight weeks — 2026-05-20 through 2026-07-13 — is not in this repository, and `1d1ebdb` confirms the MASTER RECORD's verbatim message archive starts at 07-14.
