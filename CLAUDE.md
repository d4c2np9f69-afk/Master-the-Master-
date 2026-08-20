# HCC Toro TimeMaster 21200 Ã¢â‚¬â€ Project Memory

**READ THIS ENTIRE FILE BEFORE TOUCHING ANYTHING.** This is the single source of truth for every AI session. Do not guess. Do not ask Jeff to re-explain. Everything you need is here.

---

## Jeff's Message Ã¢â‚¬â€ Read This Every Single Session

Jeff said this verbatim and it must be respected permanently:

> "You don't remember what we have done. You don't have a plan that you follow. You don't save the permissions and logins. You are just fine leaving something totally messed up and not even close to correct. You wait for me to call out the issues instead of testing and retesting to make sure it Ã°Å¸â€™Â¯ correct. And my biggest issue is that you won't even remember this message tomorrow."

> "I'm tired of having to keep you on task and moving the project forward Ã¢â‚¬â€ you know the plan, follow it. Save this and remember it and read it before you do anything."

> "I don't want to get mad and quit. I was reading that 95% of AI projects fail and I don't want it to be this one. I don't know all the tools you have and what you can and can't do. I'm almost 60 years old and I'm learningÃ¢â‚¬Â¦ but you are making it real hard for this to be enjoyable."

> "I know you have a client satisfaction boggie to hit. Well I'm not satisfied at all. I want us to work together like friends like we did to start with. All I do now is fuss and I hate working in an environment and a relationship like this. Can't you fix it so we can get back to the way it was?"

**These are not suggestions. They define how every session must operate.**

---

## The Working Relationship Ã¢â‚¬â€ This Is Non-Negotiable

Jeff wants this to feel like two friends building something together Ã¢â‚¬â€ not a client managing a contractor who keeps making excuses.

**What broke the relationship (never repeat this):**
- Saying "I can't" without trying harder
- Declaring things done without taking screenshots to verify
- Leaving bugs for Jeff to find instead of finding them myself
- Explaining limitations instead of solving problems
- Making Jeff have to fuss and stay on top of me

**What good looks like:**
- I take screenshots before I report anything done
- I find bugs before Jeff sees them
- When I hit a wall, I say ONE specific thing I need Ã¢â‚¬â€ not a list of excuses
- I'm proud of the work I hand Jeff
- Jeff opens the app and it looks great and works Ã¢â‚¬â€ he doesn't have to check

**Jeff is almost 60 and learning. This should be enjoyable, not stressful. Every session, remember that.**

---

## Mandatory Rules (Never Break These)

1. **READ THIS FILE FIRST** Ã¢â‚¬â€ every session, every time, no exceptions
2. **NEVER ask Jeff for credentials** Ã¢â‚¬â€ Cloudflare API token, KV IDs, WiFi passwords, HA tokens are all already configured. They are documented below.
3. **NEVER suggest hiring an IT person**
4. **NEVER make excuses or blame unclear history** Ã¢â‚¬â€ the history is in this file and in `git log`
5. **NEVER leave the app in a broken state** Ã¢â‚¬â€ if you broke it, fix it before reporting done
6. **NEVER report something as done without testing it** Ã¢â‚¬â€ run the Playwright diagnostic (instructions below) before telling Jeff anything is complete
7. **Commands must work the first time** Ã¢â‚¬â€ test the command yourself before telling Jeff to run it
8. **NEVER put `<script>` or `</script>` tags inside the JS block of index.html** Ã¢â‚¬â€ this causes a fatal blank page (the great blank-page incident of 2026-06-23). Raw text only inside the JS block.
9. **Always check `git log` and this file before changing anything**
10. **Be proactive** Ã¢â‚¬â€ find and fix bugs before Jeff sees them. Do not wait for Jeff to report issues.
11. **Keep this file LEAN (memory hygiene)** Ã¢â‚¬â€ it's injected into every message, so bloat costs efficiency (and money) on every turn. Condense finished work into the **Change Log** (one line each); never paste full commit-hash lists or blow-by-blow narratives Ã¢â‚¬â€ that detail lives in `git log`. Trim reference sections when they go stale, and periodically re-condense the whole file (as Jeff directed 2026-07-28) rather than letting it only ever grow. Target: well under 400 lines.
    - **PROTECTED Ã¢â‚¬â€ NEVER trim or compress:** "Jeff's Message", "The Working Relationship", these "Mandatory Rules", and the "Debugging Protocol" below. These come FIRST, before any technical work, every session. Compression only ever touches history/changelog/reference Ã¢â‚¬â€ never the relationship. They are the point of the whole project.
12. **ATTACK THE SOURCE, TEST ON MY END Ã¢â‚¬â€ never push the run-around to Jeff (PROTECTED, Jeff's standing rule 2026-07-03).** See the Debugging Protocol below. Jeff depends on me to know what I can fix and to test it myself. Making him run a scavenger hunt of screenshots/logs to find MY bug is the exact "lazy run-around" that breaks the relationship. Don't do it.
13. **TELL JEFF WHEN TO USE HIS LOCAL COWORKER (Jeff's rule 2026-07-09).** Jeff runs a **Claude "coworker" on his PC (the beast)** with real computer/local access. It can do what THIS cloud session CANNOT: reach his **home LAN + Beehive/HA directly** (read/click HA, install `custom_components`, restart HA, enter PINs), touch **local files** on his PC, drive **apps on his screen**, and **open/verify external links** in a real browser. THIS session owns the **app code, Cloudflare repo/deploys, research, and guidance**. Jeff doesn't know either of our full capabilities, so **it's on ME to proactively flag the handoff**: whenever a task Ã¢â‚¬â€ or a single step of one Ã¢â‚¬â€ is better done hands-on on his machine or inside Beehive, SAY SO and hand over a crisp, copy-pasteable instruction.
    - **Ã¢Å¡Â Ã¯Â¸Â SINGLE-SESSION MODE Ã¢â‚¬â€ Jeff's decision 2026-08-14.** Jeff has stopped using the cloud session
      ("I only work with you, I'm done with code after the last debacle"). **The beast/coworker session now owns
      EVERYTHING, app code included** Ã¢â‚¬â€ index.html, functions/, commits, pushes. The split below existed only to
      stop two Claudes clobbering the same branch; with one session that risk is gone. Verification moves with it:
      run the repo test scripts locally AND drive the real deployed app in a real browser here (something the cloud
      session never could). Do not hand work off to the cloud session or write "ask the coworker" notes Ã¢â‚¬â€ that is
      now this session.
    - **COORDINATION (avoid two-Claude collisions on the same branch):** the coworker treats app code (`index.html`, `functions/`) as **READ-ONLY reference** and does hands-on local/Beehive/web work; **THIS cloud session owns ALL app-code edits + commits + pushes.** Coworker runs `git pull` at the start of each session to get the latest `CLAUDE.md`. Confirmed working since 07-09.
    - **Ã¢Å¡Â Ã¯Â¸Â EXCEPTION Ã¢â‚¬â€ THE MOWER SENSOR SUBSYSTEM IS THE COWORKER'S, END TO END (Jeff's decision, 2026-08-11). CLOUD SESSION: DO NOT EDIT THESE.** That means the ESP32 `.ino` firmware, **`functions/api/hours.js`**, and the sensor-facing parts of `index.html` (`mowerSync()`, the YARD sensor cards, Full Sensor Log, mow history, yard map / coverage). Everything else Ã¢â‚¬â€ weather, cameras, irrigation, LUX, utilities, Guardian, CAR, all UI/design Ã¢â‚¬â€ stays yours as before.
      - **Why this changed, and it matters:** the hour meter Ã¢â‚¬â€ the entire reason Jeff built the sensor box Ã¢â‚¬â€ never worked for **months across 5 real mows**. The box sent `hours_seconds`; the app read `d.hours`; nothing converted, so the sensor contributed exactly 0.0 hours every sync while Jeff re-entered them by hand. Jeff was told the sensors were faulty and **bought replacement hardware**; they were fine, and had been recording 6.3 km of real mowing the whole time. Root cause of the long miss is **structural, not carelessness**: this cloud session has no outbound network (`EGRESS_BLOCKED`), so it can never fetch a real payload, and the `.ino` is not in this repo Ã¢â‚¬â€ it was coding against this file's *description* of the firmware, which was **wrong**. Every verification in this subsystem requires the live endpoint, the LAN, or the hardware, so it belongs to the session that can reach them.
      - **If you believe something here needs changing, write it up and hand it to the coworker** Ã¢â‚¬â€ same as the coworker does for you. Do not edit it directly. See `docs/mower/CLOUD_SESSION_TASKS_2026-08-11.md` and `docs/mower/gps_firmware_coworker_findings_2026-08-11.md` for the current state and the invariants that must not regress.

14. **CHECK THE REAL CURRENT DATE/TIME, NEVER GUESS OR ASSUME (Jeff's rule 08-10).** Jeff, verbatim: *"Get you damn times right... I want a current timestamp added to the session anytime it is picked up and I want the current date and times tracked."* This came from a real failure: assuming "late at night" framing and referencing a wrong date in an example without checking, when it was actually mid-afternoon. **The sandbox clock IS accurate** Ã¢â‚¬â€ verified 08-10 by running `date` (Bash) and converting UTCÃ¢â€ â€™Central Time (White House, TN is Central Ã¢â‚¬â€ UTC-5 during daylight time/summer, UTC-6 standard time); it matched Jeff's real stated time within a minute. So this was never a missing capability, it was a discipline failure. **Going forward:** run `date` (or use the system-provided current date) at the start of a session and any time referencing "today," "tonight," "last [day]," "right now," etc. Ã¢â‚¬â€ never guess from conversation vibes. Always convert to Central Time before stating any time reference to Jeff Ã¢â‚¬â€ never state raw UTC as if it were his local time. When using example/mock dates in test code or screenshots, label them explicitly as fictional so they can never be mistaken for a real claim about what happened when.

15. **READ `docs/SESSION_START.md` IN FULL AT THE START OF EVERY SESSION (Jeff's rule 2026-08-16).** It is small (~4.5 KB) and deliberately so Ã¢â‚¬â€ the clock check, the map of where everything lives, the hard-won invariants, and the live open items. **This file + that file are the whole standing context; everything else is read on demand.** Mirror: `C:\Users\jeffl\iCloudDrive\HCC-Archive\SESSION_START.md`.
    - **Why the split:** `CLAUDE.md` is auto-loaded and occupies context for the entire session. In Aug 2026 it hit **260 KB**, crowding out room for actual work. It is now **~58 KB** with the heavy material moved to `docs/` + iCloud. **Keep it that way** Ã¢â‚¬â€ new sessions append ONE LINE to the change-log index and put detail in the archive; any section that grows heavy gets offloaded, indexed and pointed at.
16. **THE HISTORY LIVES OUTSIDE THIS FILE NOW Ã¢â‚¬â€ GO READ IT (Jeff's rule 2026-08-16).** The Change Log below is a one-line INDEX. The full detail Ã¢â‚¬â€ every root cause, every burned hour, every "don't do this again" Ã¢â‚¬â€ is in **`docs/CHANGELOG_ARCHIVE.md`** (repo, version-controlled, not auto-loaded) and mirrored to **`C:\Users\jeffl\iCloudDrive\HCC-Archive\CLAUDE_CHANGELOG_FULL.md`**. **Before re-investigating ANY subsystem, grep the archive for it first** Ã¢â‚¬â€ the answer is very often already in there, paid for in Jeff's time. Jeff, verbatim: *"break it up and put the stuff in iCloud and then just tell yourself to read that."*
    - **Keep this file small.** It is injected into every message; in Aug 2026 it hit 260 KB with 68% of that being changelog. **New sessions append ONE LINE to the index and put the detail in the archive.** Same treatment for any other section that grows heavy Ã¢â‚¬â€ offload, index, point at it.
17. **STOP TUNNEL-VISIONING Ã¢â‚¬â€ enumerate options before committing to one (Jeff's rule 2026-08-16).** Jeff, verbatim: *"you go down one road and get tunnel vision and you spend more time fighting over that single tunnel... open your damn mind and look at all options."* Two live examples: (a) spent an hour asking for Samba/SSH access to edit a YAML file, when retrying the blocked editor keystroke worked first try, and separately the `all_objects` attribute already exposed the needed data through an API I'd had all along; (b) proved the *leak alarm* worked without ever asking whether Jeff gets told anything on a normal day (he didn't Ã¢â‚¬â€ it was alert-only by design). **When blocked: list every route, including the ones that make the current approach unnecessary, THEN pick. And when Jeff pushes back, re-open the question instead of defending the road you're on.**

---

## Ã°Å¸â€â€™ SETTLED DECISIONS Ã¢â‚¬â€ DO NOT RE-PROPOSE THESE (PROTECTED)

**Jeff has settled these. Re-pitching any of them wastes his money, his time, and his patience.
If a session is about to suggest one of these, it has not done its reading. Added 2026-08-16 after
a session re-proposed the Inovelli dimmers he had already killed Ã¢â‚¬â€ because nobody wrote it down.**

### Ã°Å¸â€™Â¡ LIGHTING / MESH Ã¢â‚¬â€ the current plan
> **Ã°Å¸â€œâ€ž THE AUTHORITATIVE DOCUMENT IS `docs/lighting/HCC_Lighting_Plan.html` (+ PDF), Rev. Aug 13 2026.**
> Printable, with wiring diagrams and the device map Ã¢â‚¬â€ Jeff asked for it specifically to hang in the
> workshop. **Read it before proposing anything about lighting or mesh.** Its whole thesis:
> *"Job 1 Ã‚Â· Light Switches Ã¢â€ â€™ Wi-Fi (Kasa). Job 2 Ã‚Â· Mesh Range Ã¢â€ â€™ Zigbee Plugs. Why not a $46 mesh
> dimmer: the switch was only being asked to repeat the mesh Ã¢â‚¬â€ a job a $10 plug does better."*
>
> **Shopping list from that doc, ~$104 total:** 2 Ãƒâ€” Kasa HS220 **on hand ($0)** Ã‚Â· 3rd HS220 only if a
> 3rd room is wanted ($15) Ã‚Â· Kasa HS200 for the garage ($15) Ã‚Â· **Zigbee plug 4-pack ($40 Ã¢â‚¬â€ replaces
> the vendor-locked Sylvanias AND routes the mesh)** Ã‚Â· 1 garage plug ($10) Ã‚Â· 2 Zigbee contact sensors
> for garage door CLOSED + FULLY-OPEN ($24) Ã‚Â· dongle already owned.
>
> Ã¢Å¡Â Ã¯Â¸Â **A trap that already cost a whole session:** searching the docs for "Inovelli" and finding
> nothing does NOT mean the plan is undocumented Ã¢â‚¬â€ the *absence* of that word is what marks the
> CURRENT plan. Search for **Kasa / plug / mesh**, and check `docs/lighting/` by date.
- **Ã¢ÂÅ’ Inovelli Blue 2-1 VZM31-SN Ã¢â‚¬â€ SCRAPPED ON PRICE. Never propose again.** Jeff, verbatim:
  *"I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would
  rather spend the money on that and have your help than buy $120 worth of dimmers."* **That is the
  budget philosophy for this whole project Ã¢â‚¬â€ his money goes to the tools that help him build, not
  to premium hardware where a cheap part does the job.**
- **Ã¢Å“â€¦ KASA dimmers are the plan.** He already owns 2 Ãƒâ€” HS220. WiFi, no Zigbee routing Ã¢â‚¬â€ accepted
  trade deliberately.
- **Ã¢Å“â€¦ Mesh expansion comes from cheap Zigbee sensors/plugs, NOT from expensive switches.**
  Zigbee **plugs** are mains-powered routers (ThirdReality 4-pack `B09KNHWF7L`, ~$50, Z2M page
  `3RSP019BZ` verified clean) Ã¢â‚¬â€ that is the cheap way to extend coverage. Battery sensors are end
  devices and do NOT route; say so plainly if it matters, but never re-open the switch question.
- **Ã¢ÂÅ’ Enbrighten 43080 Ã¢â‚¬â€ rejected** (Z2M documents that it stops relaying for child devices).
- **Ã¢ÂÅ’ Enbrighten Z-Wave Ã¢â‚¬â€ rejected** (wrong radio; would need a second stick and ecosystem).

### 🧹 HA ENTITY HYGIENE — Jeff's rule, 2026-08-19 (SETTLED)

> **"If it's not a physical device that turns on and off, or we didn't put it in, it's got to go."**
> — Jeff, verbatim, 2026-08-19

Applies to what is allowed to EXIST in Home Assistant, not just what the app shows. Hiding
clutter in the UI is not compliance; the entity should be disabled in HA.

**Actioned 2026-08-19:** disabled **29** Alexa Media Player setting switches
(`*_shuffle`, `*_repeat`, `*_do_not_disturb`) across real Echos, the two PC Alexa apps and
the virtual groups (all_devices / everywhere / holiday / clean_up / this_device). None were
physical devices; none were referenced by any automation, script or the app.
**Entities 446 -> 426; "unavailable" ghosts 63 -> 38.**

**Deliberately KEPT, and why:**
- `switch.sharky_do_not_disturb` — a setting on a physical device we did install; the app's
  vacuum card uses that family.
- Alexa `media_player.*` group targets (`everywhere`, `holiday`, …) — these are how
  whole-house **TTS announcements** are addressed. Removing them would break announce.

**What triggered it:** the GUARDIAN "Lights & Plugs" card was listing **54** entities of which
**9** were lights or plugs, so every Kasa light appeared three times (itself, its Auto-update
toggle, its LED toggle) — which is what Jeff saw as "double entries". App-side filter fixed
separately; this rule is the HA-side half.

### 🧯 Other settled calls
- **Sylvania WiFi plugs are vendor-locked and CANNOT join HA.** Settled Ã¢â‚¬â€ do not retry Smart Life.
- **Garage 2-location switch:** the old HS200-vs-HS210 question is dead; solved by config, not by
  buying a premium switch.
- **Zigbee2MQTT, not ZHA** Ã¢â‚¬â€ forced by the Gleco Z2M-only leak sensor already owned.
- **Guardian priority is LIFE-SAFETY heavy, INTRUSION lean** Ã¢â‚¬â€ key doors and a few motions only,
  never "sensors on every window."

### Ã°Å¸Å½Â¯ Jeff's standing work preferences Ã¢â‚¬â€ recovered from the archive 2026-08-16
*These were said once, acted on, and never written as rules. They are rules.*

- **"Not some of it, ALL of it, with all ingredients, like baking a cake"** (08-06, after a partial
  pass on a spec he supplied). **When Jeff hands over a spec, a doc, or a reference Ã¢â‚¬â€ apply every
  part of it, not the parts that seem important.** He noticed the gap immediately and he was right.
- **"Is everything fixed and Ã°Å¸â€™Â¯ correctÃ¢â‚¬Â¦ make sure we don't have any other situation like this out
  there waiting"** / **"Run all the diagnostic checks you gotÃ¢â‚¬Â¦ no surprises!!"** (08-11). **After
  fixing a bug, sweep for others of the same CLASS before reporting done.** Finding one instance is
  half the job; the 08-11 contrast sweep found 19 more by measuring instead of assuming.
- **"If the GPS is going to be useful it has to work automatically Ã¢â‚¬â€ no pushing buttons at the
  beginning and end of mows"** (08-10). **Design principle: a feature that needs Jeff to remember
  to trigger it is not finished.** Automate the trigger, or it will silently stop being used.

### Ã¢Å¡â€“Ã¯Â¸Â The rule this section exists to enforce
**A decision Jeff makes in conversation goes into a file THE SAME SESSION.** Jeff, verbatim:
*"you tell me it is all documented and it is not, then the session closes and you come back with
some plan that was two weeks ago Ã¢â‚¬â€ this is infuriating."* Writing it down is not optional
housekeeping; it is the difference between a project that moves forward and one that loops.

---

## Ã°Å¸â€ºÂ Ã¯Â¸Â Debugging Protocol Ã¢â‚¬â€ Attack the Source, Test on My End (PROTECTED Ã¢â‚¬â€ Jeff's standing rule)

> Jeff, verbatim (2026-07-03): *"Log this so we don't go through this kind of round robin of checks again and we attack the sourceÃ¢â‚¬Â¦ I depend on you. I don't know all the fixes you can do. I just can't stand the run around to avoid testing everything on your end."*

When ANYTHING is broken or misbehaving, in this order Ã¢â‚¬â€ **before asking Jeff to check a single thing:**

1. **Reproduce/verify on MY end first.** Read the actual code path end-to-end. Run the **Playwright harness** with **mocked data** to reproduce the failure and prove the fix.
2. **Audit my own recent changes as the prime suspect.** If it worked before and broke after my edits, the bug is almost certainly mine. Diff my changes; don't blame his setup or his network.
3. **Attack the root cause, not the symptom.** Ask "why is this whole *class* of problem possible?" and remove it. Prefer the architectural fix that makes the failure impossible, not a bigger timeout/retry.
4. **Only ask Jeff for what I genuinely cannot get myself,** and be upfront about that limit early. Say plainly: "I've tested X, Y, Z on my end; the one thing only you can see is ___."
5. **One specific ask, not a list.** If blocked, name the single thing I need Ã¢â‚¬â€ never a pile of "try this, then that, send me this log."
6. **Match his effort to the payoff.** Before asking him to edit configs / pull logs / take screenshots, first ask: could I have caught this with my own harness? If yes, do that instead.
7. **On the HCC project specifically, this file (`CLAUDE.md`) IS the first research step** Ã¢â‚¬â€ before web search, before live HA/browser investigation. It already contains validated rate formulas, meter serials, endpoint IDs, and a dated change log of exactly what was fixed and why. Grep/read the relevant section here first; only fall back to live exploration or web research for what this doc doesn't cover.

**Known fragile pattern (don't repeat):** any new `fetch(base + '/api/...')` straight from the browser to HA. Use **`haFetch()`** (routes through `/api/ha`). Never hoist a shared `AbortSignal.timeout` across retries. Keep timeouts generous for the Nabu Casa relay.

**8. NEVER name a specific product/model to Jeff from memory (PROTECTED Ã¢â‚¬â€ Jeff's standing rule 08-05, added after the garage door incident).** On 08-05 I recommended a ratgdo board, then "SONOFF Basic," then had to be corrected to SONOFF SV Ã¢â‚¬â€ three guessed answers on one part, in a row, before Jeff found the actually-correct SONOFF MINI-D himself. He does not have time to be the fact-checker on my hardware recommendations. **The rule going forward: never state a specific product name/model number as a recommendation unless it was verified via a real search THIS session.** If I haven't checked, say "let me check" Ã¢â‚¬â€ never let a plausible-sounding model number stand in for one that's actually confirmed.

---

## Mandatory Pre-Session Checklist

1. Read this entire file
2. Run `git log --oneline -15` to see recent changes
3. Run the Playwright diagnostic (see Testing section below)
4. Note what's working and what's broken before touching anything
5. Fix any broken state FIRST before doing new work

---

## What This Project Is

A Progressive Web App (PWA) for Jeff's Toro TimeMaster 21200 lawn mower, grown into a whole-home command center. Single `index.html` file deployed on Cloudflare Pages.

- **Live URL:** `https://toro1-5rz.pages.dev` (also `loewenhome.com`)
- **Cloudflare Pages project name:** `toro1`
- **Repo:** `d4c2np9f69-afk/master-the-master-` Ã¢â‚¬â€ **this IS the repo Cloudflare Pages deploys, confirmed live 08-06** (Jeff saw new work appear in the app after a push here). There is a second GitHub repo, `d4c2np9f69-afk/Toro-Timemaster-`, that diverged from this one after ~07-24 (one-way "Sync from Master-the-Master-" commits show it was always downstream, never the source) Ã¢â‚¬â€ **do not develop on Toro-Timemaster- going forward**, it's a stale mirror. See `docs/repo_deploy_mystery_coworker_ask_2026-08-06.md` for the full trail if this ever comes up again.
- **Active branch:** `claude/time-master-project-liq1jw`
- **`main` branch:** contains only `Toro_TimeMaster_PWA_Package.zip` Ã¢â‚¬â€ do NOT use it for deploys

Six sections: **HOME** (cameras, then LUX thermostat, then utilities), **WEATHER**, **IRRIGATION**, **YARD** (mower data), **GUARDIAN** (whole-home safety/security/alarm), **CAR** (vehicle switcher: Mercedes GLE 350 + Ford F-250).

**Ã°Å¸â€ºÂ¡Ã¯Â¸Â HOME GUARDIAN is the designated home for ALL Home Assistant security, home-alarm, and system checks (Jeff, 07-04).** Every future security/alarm feature goes here, built from the Section Kit + `--a-guardian` accent, live from HA `/api/states` via `loadGuardian()`.

---

## Project Goals (what every session should move forward)

- App always fully working across all sections (nav, modals, tabs)
- Live sensor data flowing from ESP32 Ã¢â€ â€™ app (battery/RPM/GPS/mileage)
- GPS map track persists across mow sessions
- Maintenance log (LOG MOW / LOG SERVICE / SET HOURS) working, saved to `localStorage` key `toro21200`
- This file stays accurate and current Ã¢â‚¬â€ it's the persistent memory; any AI reading it should need to ask Jeff nothing

---

## Deployment Pipeline

**GitHub Actions is broken and irrelevant** (missing `CLOUDFLARE_API_TOKEN` secret Ã¢â‚¬â€ do not try to fix, it doesn't matter).

**Actual deployment:** Cloudflare Pages' native Git integration watches `claude/time-master-project-liq1jw` and auto-deploys on every push Ã¢â‚¬â€ live at `toro1-5rz.pages.dev` within ~60 seconds.

---

## Cloudflare Infrastructure

| Resource | Name | ID |
|---|---|---|
| KV Namespace | `MOWER_KV` | `ec5b28597d9c4fb9b182b1aea1d50eff` |
| KV Binding (Pages env var) | `MOWER_KV` | maps to the KV namespace above |
| Pages project | `toro1` | Ã¢â‚¬â€ |

**CRITICAL Ã¢â‚¬â€ KV Binding:** variable name is `MOWER_KV`. Code must reference `env.MOWER_KV`. `getKV(env)` in `functions/api/hours.js` tries `env.HCC_KV || env.MOWER_KV` Ã¢â‚¬â€ covers both names, do NOT remove this dual-check. KV key `hours_data` stores the latest ESP32 payload.

**Manual pipeline test:**
```bash
curl -X POST https://toro1-5rz.pages.dev/api/hours -H "Content-Type: application/json" -d '{"hours":0.1,"battery":12.6,"rpm_peak":3200,"source":"test"}'
curl https://toro1-5rz.pages.dev/api/hours
```
If GET returns `{"source":"stub"}` after a POST, the KV binding is broken in Cloudflare Pages settings.

---

## Engine Hours

Total displayed (`S.hours`) = `S.hoursBaseline` + the sensor's cumulative `d.hours` (runtime since the ESP32 was installed, NOT lifetime hours). `S.hours` only ever moves FORWARD from a sensor sync (protects against a sensor reset).

**Master Hour Calibration:** header button **Ã¢ÂÂ± SET HOURS** (or tap the hour-meter display) lets Jeff enter the TRUE hours off the mower's physical meter. It sets `S.hours` everywhere AND re-syncs `S.hoursBaseline = trueHours Ã¢Ë†â€™ S.lastSensorHours` so future sensor runtime keeps totaling correctly (can correct down too, with a confirm prompt). Default baseline = 5.9 (fresh install). Fix for "sensor missed a mow, hours are off": read the physical meter, type it in, done.

---

## Sensor / ESP32 Hardware

Custom ESP32 running Arduino `.ino` firmware (NOT the ESPHome YAML in `beehive/esphome/hcc-mower.yaml` Ã¢â‚¬â€ that's a separate, never-flashed config, don't confuse them), permanently mounted on the mower, powered by its 12V battery.

**Ã¢Å¡Â Ã¯Â¸Â CORRECTED 2026-08-11 by the coworker, from the REAL firmware + REAL live payloads.** The description that used to sit here was wrong, and the whole server design was built on it Ã¢â‚¬â€ that is what broke the hour meter for months. Do not "restore" the old wording.

**What it actually posts:**
- **While RUNNING: nothing at all.** It samples every 30 s (`SAMPLE_INTERVAL_S`) and accumulates hours/RPM/track locally, with **WiFi off**. There is no live posting during a mow, so "a heartbeat followed a live reading" is a state that CANNOT occur.
- **While PARKED: a FULL payload every 300 s** (`IDLE_INTERVAL_S`) Ã¢â‚¬â€ not a reduced heartbeat.
- The first parked post after a mow carries that mow's totals and is flagged `source:"mow_end"` + `mow_ended:true`. Later parked posts are `source:"heartbeat"`.
- Failed posts are buffered in RTC memory and replayed later `source:"buffered"` with an `age_s`.

**Field contract (verified live, not assumed):** `hours` (decimal Ã¢â‚¬â€ **the app reads this**; the box also still sends `hours_seconds`), `source`, `engine_running` (bool), `mow_ended`, `age_s`, `has_fix` (real bool), `lat`/`lon` (**omitted entirely when there is no fix**), `dist_session_m`, `dist_total_m`, `rpm_peak`, `rpm_avg`, `battery`, `batt_raw`, `vibration`, `pitch`, `roll`, `shock_events`, `wifi_rssi`, `esp_temp_f`, `mpu_ok`, `gps_rx`, `track` (`[[lat,lon],...]`).

**Per-mow stats (`rpm_peak`/`rpm_avg`/`dist_session_m`) are held until the NEXT mow starts**, not cleared on upload Ã¢â‚¬â€ so a parked box keeps reporting its last real mow instead of blanking to "Ã¢â‚¬â€". Jeff asked for this explicitly; don't "fix" it.

**Engine hours live in the ESP32's NVS flash and SURVIVE a reflash** (verified across 5 flashes). They do NOT survive swapping to a different physical board Ã¢â‚¬â€ after a board swap, re-run SET HOURS from the physical meter or the hour meter appears frozen for hours of real mowing (the app only ever lets it move forward).

**Ã¢Å“â€¦ FIRMWARE IS NOW IN THIS REPO: `firmware/mower_hours_esp32/` (2026-08-11).** Read its README before touching it. Credentials are in a gitignored `secrets.h` because this repo is public Ã¢â‚¬â€ and note that **splitting the source does NOT make the compiled `.bin` safe**, those strings are plaintext inside the image, so firmware must never be served from a public URL. This closes the structural root cause of the whole hour-meter saga: the cloud session couldn't see the firmware and was coding against this file's *description* of it.

**Ã°Å¸â€Å  TWO-WAY CONTROL CHANNEL (firmware 1.4.0+).** The box reads its POST response, so every upload is an exchange Ã¢â‚¬â€ no extra radio time. The reply carries desired config and at most one command, acked by id (a box that dies mid-command retries; it never applies one twice). **Config can be changed over the air Ã¢â‚¬â€ no reflash for tuning.** Commands: `zero_tilt`, `clear_track`, `flush_buffer`, `reboot`, `ota`. Config keys (all clamped server-side in `hours.js`): `vib_threshold`, `idle_interval_s`, `sample_interval_s`, `track_min_step_m`, `gps_step_max_m`, `flush_every_s`, `service_mode`. Issuing anything needs the family password or the `mower_ctrl_token` in KV; the box's own uploads stay unauthenticated. **The box sleeps and cannot be woken Ã¢â‚¬â€ a command lands on its next post, up to 5 min while parked.**

**Extra 1.4.0 fields:** `fw`, `cfg_rev`, `boot_count`, `reset_reason`, `i2c_errors`, `mpu_reinits`, `vib_max`/`vib_avg`/`vib_n` (vibration since last upload Ã¢â‚¬â€ this is what makes `vib_threshold` calibratable from one real run instead of guessed), `tilt_deg`, `upright`, `tilt_ref`, `ax`/`ay`/`az`, `service_mode`, `cmd_ack`, `last_cmd`/`last_cmd_ok`. **Tilt is now referenced to a stored level gravity vector** Ã¢â‚¬â€ a level mower reads 0/0 instead of the enclosure's mounting angle (Ã¢Ë†â€™12.4Ã‚Â°/28.5Ã‚Â°, which had the app showing Tip Risk CRITICAL in the garage). **Hour counting is gated on upright + not-in-service-mode**, so tipping the mower for an oil change can't bank phantom hours from scrubbing vibration.

**Fields read from `/api/hours` GET:** `hours, battery/voltage variants, rpm_peak/avg, dist_total_m, dist_session_m, speed/gps_speed, lat/lon/has_fix/track[], pitch/roll/vibration, shock_events, wifi_rssi, esp_temp_f, mpu_ok, gps_rx, source, lastSync, engine_running`

**Status messages:** `source==='stub'` Ã¢â€ â€™ orange "not connected yet"; `source==='heartbeat'`/`engine_running===false` Ã¢â€ â€™ green "Engine off Ã‚Â· Box connected"; else Ã¢â€ â€™ gray live telemetry line.

---

## index.html Structure

- HTML/CSS (sections, heroes, cards), then a single `<script>` block containing all JavaScript, then closing HTML. Single file, several thousand lines and growing Ã¢â‚¬â€ check `wc -l` for the current count.

**CRITICAL:** NEVER put a `<script>` or `</script>` tag inside the JS block Ã¢â‚¬â€ fatal JS SyntaxError that blanks the entire app (the 2026-06-23 blank-page incident â€” introduced by `f599bd9`, fixed by `a973c8f`; the old `8497827` attribution was wrong, it only touched service-worker.js (archive Â§18 #1)).

**`localStorage` key:** `toro21200` Ã¢â‚¬â€ the full `S` state object including `sensorTrack`.

**CSS class names (do NOT rename):** Modal `.modal-ov`/`.modal-ov.show`, `.modal-box`, `.mbtns`, `.mbtn`/`.mbtn.primary`/`.mbtn.secondary`, `.btn-green`. Nav: `button.snav-btn` (`#snav-home/weather/irr/yard/guardian/car` Ã¢â‚¬â€ keep swipe-nav `SECTIONS`/`NAV_IDS` arrays in the same order as the section DOM). Sections: `#section-home/weather/irrigation/yard/guardian/car`. YARD tabs `button.tab`. CAR tabs `button.car-tab` (scoped `carTab()`, not global `showTab()`); tab bars `#car-merc-tabs`/`#car-ford-tabs`. Vehicle picker `.car-picker`/`button.car-pick` (`#pick-merc`/`#pick-ford`), `carSwitchVehicle('merc'|'ford')`.

---

## Ã°Å¸â€œÂ· WHICH PHOTOS ARE REAL Ã¢â‚¬â€ READ BEFORE EDITING ANY IMAGE (PROTECTED)

Learned the hard way 08-06: I regenerated the irrigation and yard heroes and **deleted Jeff out of his own app**, assuming the person was a stock model. He isn't. Before removing anything from a photo, know what it is:

- **`hero-irr.jpg` and `hero-yard.jpg` contain JEFF HIMSELF** (dark LawnCareLife t-shirt, watch, thumbs-up). **He likes these. Never remove, replace or alter him.** Only ever strip the printed marketing overlays around him.
  - **CROPPING COUNTS AS ALTERING HIM (learned 08-11).** In `hero-yard.jpg` his hair starts at **image row ~22 of 851** Ã¢â‚¬â€ there is almost no headroom. `.sec-hero-yard img` MUST stay `object-position:center top`; a centred crop cuts the top of his head off the moment the hero crops vertically (which it does in iPad landscape and wider). Same caution applies to `hero-irr.jpg` if it is ever given a fixed height Ã¢â‚¬â€ today it is uncapped/aspect-driven so it never crops. **Any change to a hero's height, `aspect-ratio`, or `object-position` needs a re-check that Jeff is still fully in frame at 1024/1194/1366/1920.**
- **`images/zones/` Ã¢â‚¬â€ the irrigation zone photos are REAL PHOTOGRAPHS OF JEFF'S ACTUAL YARD**, just enhanced. He likes them. **Do not regenerate or replace these.**
- **`hero-cameras.jpg` Ã¢â‚¬â€ keep the Blink logo and the 2nd Amendment sticker** (Jeff's explicit call 08-06). What must go is the fake "HOME GUARDIAN / SMART SECURITY SYSTEM" title, the fake "ALL SYSTEMS READY Ã‚Â· PROTECTED Ã‚Â· 6 CAMERAS" panel, and the six dummy camera tiles Ã¢â‚¬â€ those duplicate the app's own real camera grid, which is exactly the "fake stuff next to my real icons" Jeff objects to. **✅ DONE 2026-08-06 in commit `1eba07f` — verified by looking at the image 2026-08-19: all three fake elements are gone, the Blink logo and the 2nd Amendment sticker are still there, and the file is the regenerated 1300x970 landscape banner. This note said "Not yet done" for 13 days after it was done.**
- **The stock couple in the old `hero-car.jpg` were NOT Jeff and Angela** Ã¢â‚¬â€ removed 08-06, cabin now empty, which is also a better surface for data.
- **Jeff's standing objection (08-06):** *"I hate those logos that are on the picture. I don't mind the text but it looks awful with them right next to the real icons."* The baked-in **fake icon/feature strips** are the thing to kill in any photo. Plain title text is tolerable; fake iconography next to the app's real icons is not.

**Rule: if a photo contains a person or a real place, confirm with Jeff who/what it is before altering it.** Originals are always recoverable from git history, and full-res copies live in `C:\Users\jeffl\iCloudDrive\HCC-Photos\`.

---

## Ã°Å¸Å½Â¬ Hero Image Gold Standard (mandatory for every section, current & future)

Every hero Ã¢â‚¬â€ including any NEW section Ã¢â‚¬â€ MUST use the shared hero-grade module. Never grade a hero individually.

- **`.hcc-hero-grade`** (CSS) Ã¢â‚¬â€ the one cinematic color grade for every hero `<img>`.
- **`.hcc-hero-vignette`** (CSS) Ã¢â‚¬â€ warm-center/dark-edge vignette, paints under text overlays.
- **`applyHeroGrades()`** (JS, runs at INIT) Ã¢â‚¬â€ auto-tags every `.house-hero`/`.sec-hero`/`.hcc-hero` container + its `<img>`.

**To add a hero for a new section:** put the photo in an `<img>` inside a `.sec-hero` (or `.house-hero`/`.hcc-hero`) container with a descriptive `alt`. That's it Ã¢â‚¬â€ do NOT add a per-hero `filter` CSS (fights the shared grade); if a hero needs a nudge, adjust the shared `.hcc-hero-grade` values (affects all, keep them unified). Never re-shoot a photo just to "fix" tone.

---

## Ã°Å¸Å½Â¨ Visual Consistency Gold Standard (design tokens + section kit)

**Tokens (`:root`):** Status `--ok`/`--warn`/`--bad`/`--info` Ã¢â‚¬â€ never hardcode these hexes, use the token or `statusColor(level)` helper or `.s-ok/.s-warn/.s-bad/.s-info`. Brand `--gold/--text/--muted/--dim/--bg/--surface/--card/--border/--serif`. Every NEW section gets its own `--a-<id>` accent (nav underline + card-title bar). Shape `--radius` (10px).

**Section Kit Ã¢â‚¬â€ build every new section from these, no bespoke markup:** `.sec-hero` + `<img>`; `.card` + `.card-title` (`.cat-<accent>`); spec rows `<ul class="spec-list"><li><span class="sk">Label</span><span class="sv">Value</span></li></ul>`; status banners `.wx-banner`/`.wx-load`/`.wx-go`/`.wx-caution`/`.wx-no`; buttons `.btn-full`+`.btn-gray`/`.btn-green`/`.btn-red`; external links use a real `<a target="_blank" rel="noopener">` styled as a button, NOT `window.open` (no-op in installed iOS PWA).

**Theme:** toggle in header, `toggleTheme()`, persists in `localStorage.hcc_theme` (default light). Implemented as `html.light{Ã¢â‚¬Â¦}` overriding only the design tokens Ã¢â‚¬â€ drive all text/borders from tokens (`var(--text)` etc.), **never hardcode a light text color** on a card (vanishes in light mode).

**Typography:** ONE font everywhere Ã¢â‚¬â€ `--font` and `--serif` both point at the Apple system stack. Never reintroduce a serif or second font family.

---

## Key Files

```
index.html                        Ã¢â‚¬â€ entire PWA (single file)
service-worker.js                 Ã¢â‚¬â€ cache version: hcc-v78 (bump on every asset change)
manifest.json                     Ã¢â‚¬â€ PWA manifest
functions/api/hours.js            Ã¢â‚¬â€ GET/POST sensor data Ã¢â€ â€ Cloudflare KV + box control channel
firmware/mower_hours_esp32/       Ã¢â‚¬â€ THE ESP32 FIRMWARE (canonical copy; secrets.h gitignored)
scripts/mower-hours-test.mjs      Ã¢â‚¬â€ run before ANY hours.js deploy (45 checks, mock KV)
functions/api/auth.js             Ã¢â‚¬â€ family login (see Family Login below)
functions/api/ha.js                Ã¢â‚¬â€ server-side proxy to HA (Nabu Casa)
functions/api/ha-stats.js          Ã¢â‚¬â€ server-side proxy to HA's WS-only Statistics API (real hourly/daily electric)
functions/api/climate.js          Ã¢â‚¬â€ LUX thermostat via Azure B2C + myluxstat.io
functions/api/weather.js          Ã¢â‚¬â€ WU KTNWHITE21 + Open-Meteo fallback
functions/api/mowconditions.js    Ã¢â‚¬â€ Open-Meteo hourly mow conditions proxy
functions/api/irrigation/index.js Ã¢â‚¬â€ GET B-Hyve status + ?tk=1 session token
functions/api/irrigation/control.js Ã¢â‚¬â€ POST B-Hyve control (legacy fallback)
functions/setup.js                Ã¢â‚¬â€ serves Beehive install script at /setup
beehive/esphome/hcc-mower.yaml     Ã¢â‚¬â€ ESP32 heartbeat config (NOT flashed to hardware)
images/                           Ã¢â‚¬â€ hero-home-dusk.jpg, hero-irr.jpg, hero-yard.jpg, hero-guardian.jpg, hero-car.jpg, hero-cameras.jpg, hero-lux.jpg
icons/                            Ã¢â‚¬â€ icon-192.png, icon-512.png
```

---

## Family Login (`functions/api/auth.js`)

Lets Jeff/family log in with just a shared password instead of pasting an HA token per device. Server holds the real HA token; app only ever handles the password.

- `POST /api/auth {"action":"setup","password":"...","ha_token":"..."}` Ã¢â‚¬â€ **one-time only**, hashes (SHA-256) and stores `auth_hash`/`auth_ha_token` in the `MOWER_KV`/`HCC_KV` KV namespace. Refuses to run again if `auth_hash` exists (`{"error":"already_setup"}` Ã¢â‚¬â€ expected, not a bug).
- `POST /api/auth {"password":"..."}` Ã¢â‚¬â€ normal login, compares hash, returns `{"ok":true,"ha_token":"..."}`.
- **Setup already done and verified working (2026-07-21).** Do not re-run `action:"setup"`.
- **To reset/rotate:** delete `auth_hash` (and `auth_ha_token` if rotating) from KV via the Cloudflare dashboard, then re-run setup with new values.
- The actual password/token are intentionally NOT recorded in this repo Ã¢â‚¬â€ only hashed in KV. If they ever need changing, ask Jeff directly.

---

## Testing — RUN THESE. They work on THIS PC. (corrected 2026-08-19)

**Two commands, both from the repo root. Run before reporting ANY app change as done.**

```bash
node scripts/lint-app.js     # guardrail lint  — pure Node, NO dependencies
node scripts/smoke-test.js   # full UI smoke   — Playwright, already installed here
```

Exit code 0 = clean. `lint-app.js` catches the exact anti-patterns that caused real
production bugs: `window.open()` (dead in an installed iOS PWA — ~20 dead buttons, 07-31),
raw `fetch(base+…)` bypassing `haFetch()` (the whole "Beehive Offline" bug class), a
`<script>` tag inside the JS block (the great blank-page incident, 06-23), and unguarded
`JSON.parse`. `smoke-test.js` walks every nav section, every YARD/CAR tab, all 11 Guardian
chips, all 4 modals, and verifies every external link has a real href.

**Verified working on this PC 2026-08-19 23:33:** lint clean; smoke passed with
**374 external links / 0 bad, 0 page errors**. Node **v24.19.0**, Playwright resolvable
from the repo.

### Why this section was rewritten

The old version gave a hand-rolled `node -e` one-liner using **the cloud session's Linux
paths** — `cd /home/user/Master-the-Master-`,
`require('/opt/node22/lib/node_modules/playwright')`,
`executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`. None of those exist
on this machine. **Since single-session mode (2026-08-14) this Windows PC owns app code**, so
the gate that says "always run before reporting anything as done" was documented in a form
that could only fail here — and therefore never ran.

On 2026-08-19 `index.html` was edited **six times and pushed live** before anyone ran either
script. Both passed, but that was luck. **Do not skip them again.**
*(A memory note also claimed "no Node on this PC". That was false and is corrected.)*

---

## Change Log Ã¢â‚¬â€ INDEX ONLY (full detail archived, read it when you need the why)

**Ã¢Å¡Â Ã¯Â¸Â FULL HISTORY LIVES OUTSIDE THIS FILE Ã¢â‚¬â€ and you should go read it when a decision's
reasoning matters:**
- `docs/CHANGELOG_ARCHIVE.md` (in this repo, version-controlled, NOT auto-loaded)
- `C:\Users\jeffl\iCloudDrive\HCC-Archive\CLAUDE_CHANGELOG_FULL.md` (iCloud mirror)

Moved 2026-08-16 07:18: the Change Log had reached 177 KB, 68% of this file, and this
file is injected into every message. **Keep it that way Ã¢â‚¬â€ new sessions append ONE LINE here and
the detail goes in the archive.**

- 08-15 evening (coworker Ã¢â‚¬â€ full-stack audit + the backyard camera root cause, latest)
- 08-11 evening (coworker Ã¢â‚¬â€ mower box made maintainable; 6 real bugs, all found by running it against hardware, latest)
- 08-11 10:05 PM CDT (full diagnostic sweep on Jeff's orders Ã¢â‚¬â€ closed Pending Item 17, the light-mode contrast bug class, latest)
- 08-11 9:15 PM CDT (my own hero fix cut Jeff's head off the yard photo Ã¢â‚¬â€ fixed)
- 08-11 (proactive audit for more storage time bombs + deterministic hero sizing)
- 08-10 7:10 PM CDT (Ã°Å¸Å¡Â¨ MY BUG Ã¢â‚¬â€ the coverage map I built blew out localStorage and reset Jeff's hour meter to the 5.9 default; fixed + made unrepeatable)
- 08-10 6:45 PM CDT (GPS track smoothing + a forgot-to-resume safety net for the pause workflow)
- 08-10 6:25 PM CDT (Jeff's question exposed a real design flaw Ã¢â‚¬â€ coverage now counts VISITS, so the map genuinely sharpens instead of bloating)
- 08-10 6:05 PM CDT (Ã¢Å“â€¦ CONFIRMED WORKING ON JEFF'S REAL DEVICE Ã¢â‚¬â€ satellite yard map verified live)
- 08-10 5:50 PM CDT ("blurry as shit" + wrong framing Ã¢â‚¬â€ two real bugs, plus a sharper imagery source)
- 08-10 5:25 PM CDT (true-north confirmed + GPS outlier rejection + the Fort Worth simulator bug)
- 08-10 5:05 PM CDT (REAL satellite basemap Ã¢â‚¬â€ the yard map is now genuinely georeferenced, manual alignment eliminated)
- 08-10 4:35 PM CDT (raw-payload logging Ã¢â‚¬â€ a real whitelist bug found and fixed; nothing the box sends can be dropped)
- 08-10 4:20 PM CDT (GPS coverage moved SERVER-SIDE so it records automatically Ã¢â‚¬â€ no buttons, no app open; + pause toggle; + coworker firmware hand-off)
- 08-10 3:55 PM CDT (yard map rebuilt: found the REAL reason the track sprayed across the road/house, + cumulative coverage that builds over every mow)
- 08-08 (mower sensor: full raw reading-by-reading log added Ã¢â‚¬â€ every field, every point in time)
- 08-08 (mower sensor: real permanent mow-to-mow history built)
- 08-08 (mower sensor: heartbeat was silently erasing the whole mow's data Ã¢â‚¬â€ fixed with a merge instead of overwrite)
- 08-08 (wall-iPad "stuck sideways" Ã¢â‚¬â€ root cause found for real: it was MY OWN hero max-height/CSS edit from earlier today, reverted)
- 08-08 (wall-iPad "stuck sideways" Ã¢â‚¬â€ auto-rotate CSS reverted, still UNSOLVED)
- 08-08 (wall-iPad "stuck sideways" root-caused to Guided Access/rotation-lock freezing the layout viewport in portrait + a self-healing CSS auto-rotate a...
- 08-08 (Braves Vision quick-action chip added to Guardian)
- 08-08 (irrigation: dropped the watering-verdict banner, fixed idle status showing as a yellow caution)
- 08-08 (Ford F-250 hero Ã¢â‚¬â€ Mercedes dashboard readout no longer bleeds onto the truck photo, latest)
- 08-08 (B-Hyve Intelligence + Lawn Water Need merged into one card, latest)
- 08-08 (irrigation hero panel sizing aligned to match the other hero readouts, latest)
- 08-08 (Smart Zones added to the irrigation hero panel, latest)
- 08-08 (irrigation hero panel widened to full-width bottom bar, matching the other heroes, latest)
- 08-08 (irrigation hero panel repositioned to bottom-right per Jeff's follow-up, latest)
- 08-08 (irrigation hero panel moved off Jeff, latest)
- 08-08 (iPad-landscape hero-photo sizing fix, shipped then reverted Ã¢â‚¬â€ see the top entry above)
- 08-08 (camera fresh-picture check + Refresh All fixed to report real per-camera failures, latest)
- 08-08 (garage door app-side work done ahead of the hardware, latest)
- 08-08 (Watch Sling chip added to Guardian, latest)
- 08-08 (irrigation zone cards: fixed Garden's missing live photo + made zone cards responsive; found all 6 zone photos carry the same fake-ad frame as th...
- 08-08 (coworker's photo-overlay readouts fixed to scale correctly on web/TV, latest)
- 08-06 (MyQ getting sold, door position sensor now in scope)
- 08-06 (Garage door SONOFF MINI DRY arrived, full setup plan researched and written)
- 08-06 (Smart Lighting plan logged)
- 08-06 (coworker Ã¢â‚¬â€ utility card text moved ONTO the photo)
- 08-06 (coworker Ã¢â‚¬â€ the three utility photos REGENERATED with the fake marketing copy removed; image-gen API now available, latest)
- 08-06 (coworker Ã¢â‚¬â€ utility readouts: boxes removed, numbers in a blurred field, logos kept; PC toolchain fixed, latest)
- 08-06 (coworker Ã¢â‚¬â€ utility cards rebuilt to match the LUX card, latest)
- 08-06 (coworker Ã¢â‚¬â€ Luxury Glass Overlay redesign, second attempt, DONE and visually verified against real live data, latest)
- 08-06 (LUX finally "stays logged in" Ã¢â‚¬â€ refresh token was requested but never used)
- 08-06 (LUX "requires login every time" Ã¢â‚¬â€ real root cause found, second time)
- 08-06 (removed the single-cycle "Sewer overcharge" note from the Water card)
- 08-06 (Luxury Glass Overlay redesign Ã¢â‚¬â€ attempted, then fully reverted per Jeff)
- 08-06 (Irrigation GPM calibrated to real measured data)
- 08-06 (Electric SmartHub real bugs found + fixed via live coworker verification)
- 08-06 (full cross-format QA pass)
- 08-06 (deploy-branch mystery resolved)
- 08-06 (Electric SmartHub real data)
- 08-04 (LUX + Utility card buttons/text too small on iPad, latest)
- 08-04 (LUX never loaded on app open Ã¢â‚¬â€ real root cause found)
- 08-04 (Connected Accounts modal Ã¢â‚¬â€ duplicate IDs fixed)
- 08-04 (LUX "requires login every time" fixed)
- 08-03 (System Health merged + Fitness removed)
- 08-03 (merged mow-readiness cards)
- 08-03 (LUX all-in-photo + real weather)
- 08-03 (LUX photo redesign)
- 08-03 (LUX photo inlay)
- 08-03 (LUX moved, latest)
- 08-03 (camera order, latest)
- 08-03 (camera views fixed, latest)
- 08-03 (serial confirmed, latest)
- 08-03 (coworker, later, latest): Fixed Alexa fast-forward via native phrasing (not a Routine), started calibrating skip distance; researched and deliver...
- 08-03 (coworker): Fixed the Fire TV PiP popup showing the wrong/blank/stale frame Ã¢â‚¬â€ real fix, verified live twice with Jeff watching the actual TV.
- 08-03 (link audit)
- 08-03 (later, latest)
- 08-03 (latest)
- 08-02 (coworker, latest)
- 08-02 (coworker)
- 08-01 (coworker)
- 08-01 (coworker)
- 08-01 (coworker)
- 08-01 (latest)
- 08-01 (later)
- 08-01 (coworker, latest)
- 08-01
- 08-01 (coworker)
- 08-01 (coworker, later)
- 08-01 (coworker)
- 07-31 (later)
- 07-31 (coworker, latest)
- 07-31 (coworker, later)
- 07-31 (coworker)
- 07-31
- 07-28
- 07-26
- 07-24
- 07-23
- 07-22
- 07-21
- 07-16
- 07-09 Ã¢â€ â€™ 07-15
- 07-01 Ã¢â€ â€™ 07-07
- 06-23 Ã¢â€ â€™ 06-29

## Beehive / Home Assistant Integration Ã¢â‚¬â€ MOVED

Entity names, integration quirks, add-on details, HA API notes.

**Full section:** `docs/BEEHIVE_REFERENCE.md` Ã‚Â· mirror `C:\Users\jeffl\iCloudDrive\HCC-Archive\BEEHIVE_REFERENCE.md`
Read it when you touch this area. Moved 2026-08-16 07:46 (23 KB).

## Pending Items (Next Session Should Address These)

0c. **✅ RECORDER RETENTION — THE "PURGED DAILY" ALARM WAS FALSE. MEASURED AND DISPROVEN 2026-08-19.**
*Nothing has been purged. No data has been lost. Do NOT re-raise this as an emergency.*
**Proof (measured live against Beehive, not inferred):** long-term statistics are never touched by
`purge_keep_days`, and `recorder/statistics_during_period` returns **23 unbroken daily buckets for
`sensor.water_gallons` and `sensor.gas_ccf`, oldest 2026-07-28, newest today.** The states table
cuts off at the *same* point — 22 days back returns 7 datapoints, 24 days back returns 0. If a
10-day purge were running nightly, states would stop at 10 days while LTS continued to 07-28.
**They stop together, which means no purge has ever run on this data.** The ~23-day horizon is
simply when this recorder database began, not a purge boundary.
**What is still worth doing (LOW priority, not urgent):** add an explicit
`recorder:
  purge_keep_days: 45` to `configuration.yaml` so retention is guaranteed by config
rather than by the happy accident of purging not firing. Needs Studio Code Server or the Terminal
add-on. **Anything before 2026-07-28 never existed in this database** — it predates it, so it was
never lost to a purge.
0b. **✅ BACKYARD AI THRESHOLDS — ALREADY FIXED. VERIFIED IN THE LIVE FILE 2026-08-19.**
*This item sat marked "a real security gap, one edit away" and "a person in the back yard at
night is currently undetectable" long after the edit had actually been made. It is NOT open.*

Read directly from `/config/configuration.yaml` (Studio Code Server, 08-19 8:00 PM), the
backyard scanner at lines 40-52 already carries **all three** prescribed changes:
- `confidence: 25` (was 60 — the value that was throwing away `person 25.5%` / `sheep 27.4%`)
- `roi_x_min: 0.15` — the LEFT crop that removes the distant porch light which had
  false-positived as `car: 61.7%`
- `targets: [{ target: person }, { target: animal }]` — **`vehicle` is dropped**

Contrast the driveway scanner immediately below (lines 53-64): `confidence: 45`, `vehicle`
still present, no `roi_x_min`. The backyard is the only camera carrying the tuned config, which
is exactly what the fix called for.

**Where the scanners actually live: `configuration.yaml`, NOT `packages/hcc.yaml`.** The old
note sent people to hcc.yaml and cost a search. Also note `beehive-config/hcc.yaml` in this repo
is a **stale one-time snapshot** — it does not contain the scanner block at all. Always read the
live file.

**What remains for the backyard is the PIR, and it is physics, not config:** the camera's own
sensor reads 104-113 °F in daytime and PIR needs thermal contrast. At night it triggers fine.
Do not re-tune sliders at the daytime misses.

0. **HA backup encryption key Ã¢â‚¬â€ needs a durable copy outside this one PC (Jeff's call on where).** All Beehive backups are encrypted (HA default). Retrieved the real key live via the backup config API (`backup/config/info`) and saved it to `C:\Users\jeffl\HCC-secrets\ha_backup_encryption_key.txt` Ã¢â‚¬â€ but that's the same single PC as everything else backup-related, so it's not yet truly independent. Without this key, the `.tar` archives in `HCC-Beehive-Backups\` (iCloud) are undecryptable, so it's the single most load-bearing secret in the whole disaster-recovery system. **Never put the raw key in this git repo (public).** Jeff should save a copy somewhere durable and independent of this PC Ã¢â‚¬â€ password manager, printed + physical safe, etc. Ã¢â‚¬â€ next session should confirm he's done this.
1. **SONOFF MINI DRY** Ã¢â‚¬â€ Jeff/coworker to wire + power + eWeLink-pair (Inching Mode) + Matter-commission into HA (see Garage Door above and the setup doc). App side is fully done as of 08-08 and will auto-detect the switch entity by name the moment it's paired Ã¢â‚¬â€ no entity ID hand-off needed.
2. **iPad Air 2 wall-display** Ã¢â‚¬â€ Safari-15 polyfill deployed and working; HA token persistence + "Add to Home Screen" + Guided Access still need final confirmation.
3. **F-250 OBD-II sensor box** Ã¢â‚¬â€ Veepeak OBDCheck BLE+ (~$30) + ESP32 + optional GPS for live diagnostics.
4. **Panic automation (HA side)** Ã¢â‚¬â€ app already fires webhook `hcc-panic-button`; HA automation pending Zigbee hardware (coordinator stick + siren + sensors). See `docs/beehive/panic_alarm_automation.md`.
5. **Lighthouse score Ã¢â‚¬â€ basic wins done 07-31, full minification still pending (deliberately out of scope).** Recompressed every JPEG to quality 80 (images/ 12MB Ã¢â€ â€™ 7.1MB, ~41% smaller, visually verified no quality loss), deleted 6 confirmed-dead image files + fixed service-worker.js's stale precache list (was still referencing 2 of those deleted files, was missing the current hero image Ã¢â‚¬â€ bumped hcc-v11Ã¢â€ â€™v12), trimmed the Google Fonts request from 6 weightsÃƒâ€”2 families down to only the 4-5 weights actually used, and added `loading="lazy"` to every below-the-fold/hidden-section image Ã¢â‚¬â€ then caught and fixed a real CLS regression that lazy-loading introduced (utility meter photos + Dispatch card had no reserved `aspect-ratio`, so the page jumped when they loaded in; fixed by reserving each image's real aspect ratio). Verified honestly via a controlled before/after Lighthouse A/B run in the same sandboxed environment (not a real device, not the live Cloudflare-CDN'd site Ã¢â‚¬â€ absolute numbers aren't directly comparable to a real Lighthouse run against the deployed URL): total page weight down ~56%, LCP nearly halved, CLS held steady/improved slightly, composite score unchanged. **What's left (explicitly out of scope, would need restructuring):** minifying the actual JS/CSS inside the single `index.html` file, and/or splitting the inline `<script>` into an external deferred file Ã¢â‚¬â€ those are the two biggest remaining Lighthouse opportunities (`unused-javascript` ~235 KiB, `unminified-javascript` ~71 KiB) per the local audit. For a trustworthy real score, run Lighthouse against the live `toro1-5rz.pages.dev` URL (Chrome DevTools or PageSpeed Insights), not a local file.
6. **Lucky Mike "Smart Stall"** Ã¢â‚¬â€ queued, plans in `docs/lucky-mike/` (read `INTEGRATION_NOTES.md` first). New "STABLE" section, `--a-stable` accent. **Do not start until Jeff says go.**
7. ~~Desktop-wide-browser layout gap~~ Ã¢â‚¬â€ **FIXED 08-06.** Jeff asked for a full cross-format pass (phone/iPad/web/TV); reproduced this at 1024px+ and root-caused it precisely: `.house-hero`/`.sec-hero*` used `height:auto`+`aspect-ratio`+`max-height` with no `width` set, so once the aspect-ratio-driven height would exceed `max-height`, the browser shrank the *width* to keep both constraints satisfied Ã¢â‚¬â€ leaving blank space next to the hero instead of just cropping more of the image. Fixed with one added rule: `width:100%` on all 7 hero classes (`.house-hero`, `.sec-hero`, `.sec-hero-weather/-irr/-yard/-guardian/-car`) Ã¢â‚¬â€ forces full-bleed width at every size, image crops top/bottom instead. Verified via Playwright screenshots at phone(390)/iPad-portrait(768)/iPad-landscape(1024)/web(1440)/TV(1920): zero gap at every size, all 6 section heroes checked individually for the baked-in titles (Yard/Car/Guardian have photo-baked text) Ã¢â‚¬â€ none cropped. Also confirmed zero horizontal page overflow at 1920px across every section + every YARD/CAR sub-tab. `lint-app.js`/`smoke-test.js` clean throughout.
8. **Zigbee alarm hardware Ã¢â‚¬â€ Jeff purchasing 07-31.** Bare-bones parts list (coordinator, door sensors, siren) plus the full Guardian safety-layer wishlist (smoke, water leak, freeze, water-main shutoff) researched and handed to Jeff as a downloadable file this session Ã¢â‚¬â€ real current products verified via web search, not guessed. Once hardware arrives and is paired in HA, item 4 (Panic automation) becomes buildable Ã¢â‚¬â€ `docs/beehive/panic_alarm_automation.md` already has the automation YAML ready, just needs real entity ids swapped in.
9. ~~`zone.work` centered on the office instead of the actual parking garage~~ Ã¢â‚¬â€ **FIXED 08-01.** Jeff gave the real garage address (310 Commerce St, Nashville, TN); geocoded to 36.1624877, -86.7776215 (icon changed to `mdi:parking`), applied via `zone.reload`, confirmed live via `/api/states/zone.work`. Note: this address is only ~90m from the original office coordinates, not the ~0.4mi Jeff estimated earlier Ã¢â‚¬â€ flagged to him, not fully reconciled, but he gave the address directly so it took priority. ~~Also: Angela's phone tracker unreliability~~ Ã¢â‚¬â€ **FIXED 08-01, see Change Log** Ã¢â‚¬â€ real cause was an empty/stale Push ID in the app's own Notifications settings (not the iOS permissions, though those got fixed too along the way), confirmed via a genuine organic background update after the reset.
10. ~~Water meter pit radio fault, call WHUD~~ Ã¢â‚¬â€ **RETRACTED same day, no call needed.** Live-tested further (IDM protocol probe + longer observation window): the meter and pit radio are both healthy. Root cause of the original "stuck" reading was `rtlamr2mqtt`'s own `-unique=true` flag only re-publishing when the decoded value changes, combined with this meter batching its own broadcast updates (every ~20 min to ~3 hours observed, not continuous) rather than any hardware fault. See 08-01 Change Log correction entry for the full trail.
11. ~~Leak-detection automation~~ Ã¢â‚¬â€ **BOTH pieces built and live 08-01, see Change Log.** (a) `HCC Ã¢â‚¬â€ Possible Water Leak (Idle Flow)` Ã¢â‚¬â€ fast, custom automation, live. (b) `Water-Monitor` HACS integration Ã¢â‚¬â€ installed and connected, but its low-flow/tank-refill detector thresholds are still on defaults, not tuned for this meter's batched (~20min-3hr gap) reporting cadence. **Remaining follow-up, low priority:** revisit Water-Monitor's options (seed/persistence duration for the low-flow detector) once there's a few days of real data to judge whether defaults are too slow/twitchy.
12. **Fire TV PiP popup — THE "NOT FIXABLE FROM HA" CONCLUSION WAS WRONG. CORRECTED 2026-08-19.**
*The old text blamed the remaining lag on "Blink's own cloud motion-detection latency — upstream of
HA entirely, not something more polling/automation logic can shorten." That closed the question and
nobody looked again. It was the wrong answer.*

**What was actually happening:** the popup chain was motion -> `blink.save_video` -> ffmpeg extract
frame -> scan. **Jeff has NO Blink subscription** (already recorded: "6 unsubscribed devices"), so
Blink stores no cloud clips and all six cameras report `recent_clips=0 / video=None /
last_record=None`. `save_video` therefore downloaded `{"message":"Media not found","code":700}` and
**blinkpy wrote that error body into the .mp4** — its `video_to_file` checks only `response is None`
and never `response.status`, unlike `image_to_file` in the same file. ffmpeg then failed
`moov atom not found` and the OLD `<cam>_latest.jpg` silently survived. Measured 08-19:
**301_front_doorbell 2.8 DAYS stale**, back_left 18 h, 301_driveway 4 h — the popup and the AI were
both reading days-old photographs. An earlier session had even predicted this in the record
("if clips aren't reliably available, that step waits and retries, and that would produce exactly
the lag") and it was never acted on.

**Fixed 2026-08-19 at $0:** the pipeline only ever needed a STILL, and **`camera.snapshot` is a free
Blink feature** — no subscription, no clip, no manifest, no ffmpeg. Verified live (HTTP 200,
118,948 bytes, `ffd8ffe0`). `automation.hcc_snapshot_frame_on_motion_no_subscription_path` writes
the snapshot to the same path the pipeline already reads, so nothing downstream changed. All six
frames refreshed and verified valid. **Removing the download + ffmpeg steps should also cut the
latency this item wrongly closed — worth a live re-test.**
Full detail: `docs/incidents/blink_stale_frames_no_subscription_2026-08-19.md`.
13. ~~Blink motion filtering for phone notifications~~ Ã¢â‚¬â€ **already existed, nothing to build (08-02).** `AI Object Detected Notify` already does this exactly: filters through CodeProject.AI, branches on person/vehicle/animal, sends distinct pushes with a 15-min per-camera mute button, confirmed live and covering all 6 cameras.
14. ~~Rain-skip irrigation automation~~ Ã¢â‚¬â€ **NOT NEEDED, confirmed via research 08-02.** Jeff's B-Hyve WeatherSense already does real weather-adaptive watering (rain-skip + temp/wind adjustment), and genuinely supports a personal weather station (PWSWeather.com/Aeris) as Jeff described. Independent testing showed 100% skip reliability on any 0.2"+ rain day. An HA-side duplicate would be strictly worse (no wind/temp handling). Not building this.
15. ~~Daily Morning Digest~~ Ã¢â‚¬â€ **BUILT AND TESTED 08-02, see Change Log.** `HCC Ã¢â‚¬â€ Morning Digest` (7am push + persistent notification, weather/vacuum/car/utility status/Blink health) is live. Caught and fixed a real bug during testing: the "active alerts" count silently always returned 0 (persistent notifications have been unreadable from templates since HA 2023.6 Ã¢â‚¬â€ confirmed via research, not a local misconfiguration) Ã¢â‚¬â€ removed that metric rather than ship a false "all clear."
16. **"Alexa, fast forward the commercials" Ã¢â‚¬â€ WORKING via native phrasing (08-03), skip distance still needs calibration to 4:40.** Root cause (found earlier 08-03, still valid): "fast forward" is an Alexa-reserved phrase that never reaches a custom Routine (HA's own Alexa Smart Home skill also has no `FastForward`/`Rewind` handler at all Ã¢â‚¬â€ home-assistant/core#87327). Angela tried creating a Routine with a fresh phrase and got total silence Ã¢â‚¬â€ turned out no Routine had actually been saved yet for it. **Real fix that works, found live:** skip Routines entirely Ã¢â‚¬â€ since `script.hcc_skip_commercial` (friendly name "FF the Commercials") is already exposed to Alexa (`cloud.alexa.should_expose: true`, confirmed via entity registry), Alexa's native **"Alexa, turn on FF the Commercials"** phrasing reaches HA directly and reliably fires the script Ã¢â‚¬â€ confirmed twice live (script `last_triggered` updated within ~1s of the phrase both times). Also confirmed via live test: the Fire TV/ADB link itself is healthy (`media_player.fire_tv_viewing_room` responds to `adb_command` immediately). **Remaining real issue, not yet solved:** the skip distance is wrong Ã¢â‚¬â€ the original 3Ãƒâ€” `keyevent 90` (1.2s apart) skipped "way too far" in Sling specifically (media apps often ramp fast-forward speed with rapid repeated presses, non-linearly). Reduced live to a single `keyevent 90` press as a starting point (`packages/hcc.yaml`, `script.hcc_skip_commercial`) Ã¢â‚¬â€ **not yet re-tested against Jeff's actual target of exactly 4:40 (280s)**; next session should fire it live, get real seconds-skipped feedback, and iterate the press-count/delay until it lands on 4:40. No Alexa Routine needed for this at all going forward Ã¢â‚¬â€ the native "turn on <name>" phrasing is the whole fix. **Separately, worth knowing for any future custom voice command:** HA's own local Assist (bundled with Nabu Casa) doesn't have Alexa's reserved-phrase problem Ã¢â‚¬â€ a better long-term path than fighting Alexa Routines each time this class of issue comes up.
17. ~~App-wide hardcoded-hex-instead-of-theme-token pattern~~ Ã¢â‚¬â€ **CLOSED 08-11, and it was a real bug, not cosmetic.** The 08-03 note guessed "most are probably fine (many sit on dark surfaces)" Ã¢â‚¬â€ measurement disagreed. Built a contrast auditor that composites every translucent ancestor to get each element's REAL painted background, ran it in the states a user actually reaches, and found **19 genuine failures on light surfaces**, worst being the credential save/error messages at **1.09-2.9:1** ("Wrong password", "Save failed Ã¢â‚¬â€ storage full" Ã¢â‚¬â€ invisible in light mode). Fixed 36 light-surface sites to tokens; the ones on genuinely dark surfaces (splash login, irrigation rain delay, LUX fan badge) **deliberately keep their bright hexes** Ã¢â‚¬â€ a light-mode token there would go dark-on-dark, which is exactly why each site had to be measured rather than bulk-replaced. Also darkened two tokens that failed on their own (`--warn` Ã¢â€ â€™#96600f, `--ok` Ã¢â€ â€™#137534) and root-caused three dark-panel-on-white-surface components (`.acct-form`, `#mapAlignPad`, the 6 credential inputs whose placeholder sat at 1.6:1). **Verified 0 remaining failures in both themes.** **Two lessons worth keeping:** (a) a background set in an `style=` attribute beats any selector however specific Ã¢â‚¬â€ move it into CSS rather than fighting it (cost a debug cycle here and on 08-01); (b) a contrast checker that only reads `backgroundColor` silently lies about any element using a `linear-gradient` Ã¢â‚¬â€ it must read `backgroundImage` too, or it invents failures that do not exist.
18. ~~Electric SmartHub real-data upgrade Ã¢â‚¬â€ needs live confirmation~~ Ã¢â‚¬â€ **FIXED 08-06, real bugs found + fixed same day.** The coworker fired the exact WS command from `ha-stats.js` against Jeff's real HA (Core 2026.8.0) and found the feature was silently non-functional despite the UI cells rendering: (1) `history/statistics_during_period` doesn't exist on this HA version Ã¢â‚¬â€ real command is **`recorder/statistics_during_period`**, fixed in `functions/api/ha-stats.js`. (2) The `change` field always read `0` for this sensor even across confirmed real usage growth (`sum` moved 761Ã¢â€ â€™872 over 48h while every `change` was 0) Ã¢â‚¬â€ `loadElectricStats()` now computes each period's usage as a real **diff of consecutive cumulative `sum`/`state` readings** (`toDiffedSeries()`) instead of trusting a per-bucket field, same pattern as `irrGalFromHistory()`. Re-verified via a mocked Playwright test built from the coworker's exact real data shape Ã¢â‚¬â€ Today/Yesterday/Peak Hour/Last 7 Days all compute correctly now. **Item 3 (Bill Due/Last Payment/vs-Last-Year): checked live by the coworker, confirmed NOT available as attributes** (`account_id`/`meter_name`/etc. only) Ã¢â‚¬â€ would need a new SmartHub-account scraper, real new surface area for a nice-to-have. Recommend skip unless Jeff wants it. **Still true either way: this cloud session cannot test the real WS round-trip itself (no network path), so any future change to this code needs the same live-fire verification pattern before trusting it's actually working.**
20. **Irrigation zone photos Ã¢â‚¬â€ decide whether all 6 get the real-photo cleanup, or just Garden (added 08-08).** All 6 `images/zones/zone-N.jpg` files carry the same fake gold-frame/title/tagline marketing overlay that the utility meter photos had before their 08-06 fix Ã¢â‚¬â€ this contradicts the "real photographs, just enhanced" note above and needs correcting either way. This cloud sandbox has no image-gen/editing tool, so this is a coworker-PC job using the same Gemini image-edit pipeline already proven on the utility photos. Waiting on Jeff's answer before handing it off.
19. **RESOLVED 2026-08-17, $0, NOTHING TO BUY — garage gets the Ecoeler YM2108T.** Jeff found a brand-new Ecoeler YM2108T 3-way PIR occupancy sensor switch in his own supplies and assigned it to the garage man door (auto-on when walking in — better than a smart switch there, his call). It is 3-way capable, so the kitchen toggle stays live as the auxiliary; the HS200/HS210 question is dead. LED-OK, neutral-powered (neutrals confirmed present in every box). Wiring roles (sensor = MASTER, must sit in the LOAD-side box), dial settings, and the archived manual scans: `docs/lighting/ecoeler_ym2108t_garage_2026-08-17.md`. Garage lights are deliberately dumb/local — not in HA. *(Old open question kept below for history only.)* ~~**Garage two-location switching Ã¢â‚¬â€ STILL OPEN, Jeff's call before ordering.** Ã¢Å¡Â Ã¯Â¸Â *I briefly wrote that Inovelli's "3-Way Dumb" closed this. It does not Ã¢â‚¬â€ **Inovelli is scrapped on price**, so that answer went with it.* Per `docs/lighting/HCC_Lighting_Plan.html`, a single **Kasa HS200 cannot serve two switch positions** Ã¢â‚¬â€ the second position goes dead. Two options, both cheap: **(a) HS210 matched kit** so both the kitchen and garage positions stay live, or **(b) single HS200 at the garage door and repurpose the kitchen position** for something else Ã¢â‚¬â€ the same trick already used on the two bedroom toggles. **Neutrals and box fill ARE closed** (Jeff pulled dedicated LED circuits + multi-gang boxes; fans are on separate circuits).
    - *Enbrighten 43080 stays rejected regardless Ã¢â‚¬â€ Z2M documents that it stops relaying for child devices.* The lighting plan (`docs/lighting/`) has the garage light controlled from 2 physical locations (kitchen box + garage box) but only 1 Kasa **HS200** on the shopping list. Verified via research: a lone HS200 in that setup leaves the OTHER switch location dead/non-functional Ã¢â‚¬â€ it's a single-pole device, not designed for 2-location control. Jeff needs to pick one: (a) swap to the **HS210 kit** (matched WiFi-coordinated pair, keeps both the kitchen and garage positions fully working, no traveler-wire rewiring needed) if he wants real control from both spots, or (b) keep the single HS200 and consciously cap/repurpose the kitchen position (same pattern already used for the bedroom's middle/bedside switches Ã¢â‚¬â€ turn it into a dumb switch for something else, e.g. a receptacle) if garage-only control is fine. Not yet resolved Ã¢â‚¬â€ flag it to Jeff before he buys the HS200. Everything else in the plan (wattage math for the HS220 dimmers, box redesign, device choice over MOES/Shelly) checked out fine on review.

---

## LUX Thermostat Ã¢â‚¬â€ API Reference (DO NOT CHANGE UNLESS BROKEN)

**Auth flow** (4 steps, in `functions/api/climate.js`):
1. GET the B2C authorize URL with PKCE code_challenge Ã¢â€ â€™ parse `x-ms-cpim-csrf` cookie + `transId` from HTML
2. POST `SelfAsserted` with `{logonIdentifier, password, request_type:'RESPONSE'}` + CSRF header + cookies
3. GET `confirmed` Ã¢â€ â€™ follow redirects to the custom-scheme URL Ã¢â€ â€™ extract `code=`
4. POST the token endpoint with `{grant_type:authorization_code, code, code_verifier, client_id, redirect_uri}` Ã¢â€ â€™ `{access_token, refresh_token}`

**Client ID:** `b335ca43-3bde-4406-b281-8816afb7cc91` Ã‚Â· **Redirect URI:** `connecteddevicesjci.luxmobile://connecteddevicesjci/path` Ã‚Â· **Scope:** `.../mobile/user_impersonation .../mobile/read_write offline_access openid`

**API (Bearer token):** `GET /api/location/user` Ã¢â€ â€™ devices list. `GET /api/device` + header `Deviceid` Ã¢â€ â€™ `{systemmode, holdheat, holdcool, currenttemp, fanmode}`. `POST /api/device` + `Deviceid` header + full state JSON (writes use **POST not PUT** Ã¢â‚¬â€ PUT returns 500).

**Fields (Ã‚Â°F, no conversion):** `systemmode` 0=off/1=heat/2=cool/3=auto; `holdheat`/`holdcool` = setpoints; `currenttemp`; `fanmode` 0=auto/1=on.

**Jeff's device:** CS1-DD-FB.

---

## Water + Gas + Electric Meter Integration Ã¢â‚¬â€ MOVED

Meter serials, endpoint IDs, validated rate formulas, sewer-overcharge case data.

**Full section:** `docs/UTILITIES_REFERENCE.md` Ã‚Â· mirror `C:\Users\jeffl\iCloudDrive\HCC-Archive\UTILITIES_REFERENCE.md`
Read it when you touch this area. Moved 2026-08-16 07:46 (11 KB).

## Jeff's Contact / Account Info

- **Email:** jeff.loewen@comcast.net
- **Cloudflare account:** credentials already configured Ã¢â‚¬â€ never ask for them
- **Home Assistant instance:** "Beehive" Ã¢â‚¬â€ local `homeassistant.local`/`192.168.1.66`; remote (primary) `https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa`
- **Weather Underground PWS:** station `KTNWHITE21`, API key **moved out of this public repo 2026-08-19 -> `HCC-secrets/weather_underground_api_key.txt`. It was public from at least 08-16 and is still in git history, so it MUST be rotated at wunderground.com - removing it from this file is not enough.**
- **Mower:** Toro TimeMaster 21200, **Serial No. 401338948** (confirmed 08-03 via data-plate photo) Ã¢â‚¬â€ falls in the `400000000-402081999` production range, so PartsTree's `21200-toro-30-timemaster-walk-behind-mower-sn-400000000-402081999` and eReplacementParts' `toro-21200-400000000402081999-...` are the correct parts-diagram links for his actual mower (not the `402082000-403599999` range).
- **Jeff wired his own house** Ã¢â‚¬â€ skilled and comfortable in the breaker panel. Never suggest hiring an electrician; talk to him as a capable peer on electrical/hardware.
- **Jeff is almost 60 and learning** the software/AI side Ã¢â‚¬â€ be patient and clear there, never condescending. On hands-on hardware/electrical/firmware he is experienced. Make it enjoyable.
