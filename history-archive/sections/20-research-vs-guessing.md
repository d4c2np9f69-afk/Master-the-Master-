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
