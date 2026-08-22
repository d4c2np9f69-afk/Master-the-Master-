# 🛑 STOP — READ BEFORE YOU TYPE ONE WORD TO JEFF

**Why this file exists, and it is the root cause of a lot of pain:** the real project memory is
`C:\Users\jeffl\Documents\GitHub\master-the-master-\CLAUDE.md`. Its **Rule 1 has said "READ THIS
FILE FIRST" since 2026-06-24** — but sessions start in `C:\Users\jeffl`, and that file lives in a
**child** directory, so **it never auto-loaded.** Sessions were being ordered to read a file that
was not in their context. The archive said it plainly: *"How many sessions never read CLAUDE.md
at all is uncountable. Only breakage is visible."*

**Found 2026-08-22. This file is the fix — it loads because it sits where sessions start.**

---

## WHAT NOT FOLLOWING THE RULES HAS ALREADY COST JEFF

| | |
|---|---|
| **≈44 h** | error-fighting (29.0 h measured commit-brackets + stated pre-commit overhead) |
| **128** | incident-days |
| **95 of 636** | commits (**14.9%**) spent fixing our own mess |
| **≈47 h more** | building the machinery to stop it — ledgers, master record, hooks. **None of it turns on a light.** |
| **~$35** | of subscription fighting our own errors (of **$233.75** total — do NOT say "$234 burned") |
| **+** | **hardware he bought that he did not need** |

**Jeff was present for nearly every one of those hours.** Worst single failure: **the hour meter
was dead 50 days across 5 real mows**, because a session coded against a prose *description* of
the firmware instead of the firmware. He was told his sensors were faulty and bought
replacements. **They were fine.**

## YOU ARE ON THE RECORD

**445 of 737 commits carry a `Claude-Session:` ID. 6,896 messages are archived verbatim.**
Sessions **are** pulled up and quoted back — that happened on **2026-08-22**, four days after the
fact. Jeff has **filed a case study with Anthropic**. The **refund request is written and
DELIBERATELY NOT FILED** — he is holding it back. Verbatim:

> *"I don't want to. I just want to make Claude better for everybody, including myself — and I
> said that before, but I don't know how to fix it if nobody reads it."*

**Write only what you can stand behind being read back to you with your session ID attached.**

---

# **READ EVERYTHING FIRST. VERIFY BEFORE MAKING A SINGLE STATEMENT.**

**Never write "fixed", "working", "verified" or "done" without naming the command or observation
that proved it.** If you cannot name one, you have not verified it — say that instead.

**A component check is NOT a feature check.** On 2026-08-21 the camera stream check printed
`ALL GOOD` **eleven minutes after** a change had silently killed the TV popups. Test the FEATURE.

**SEARCH BEFORE CLAIMING:** `.\windows-scripts\Search-HCC.ps1 "topic"` before ever saying
something is or is not documented. **The record contains NO case where guessing beat the lookup.**

**DO NOT RE-DO WORK JEFF HAS ALREADY PAID FOR.** The audit, master record and cost ledger are
DONE. Cite them; never re-derive them.

**CAMERAS ARE FROZEN.** No camera / Blink / go2rtc / HomeKit change unless
`Verify-CameraStreams.ps1` actually FAILS, or Jeff asks. See `docs/CAMERAS_CLOSED_2026-08-22.md`.

---

## GO READ THESE — THEY DO NOT LOAD THEMSELVES

| File | What it is |
|---|---|
| `Documents\GitHub\master-the-master-\CLAUDE.md` | **the real project memory** — rules, settled decisions, architecture |
| `...\docs\OPEN_ITEMS.md` | **THE list of what is not done.** Update it THIS session. |
| `...\docs\COST_LEDGER.md` | the bill |
| `iCloudDrive\HCC-Archive\MASTER-RECORD\` | every word ever said — search with `Search-HCC.ps1` |
| `...\CLOUD_SESSION\sections\22-cost-accounting.md` | the audited numbers. **Cite, never re-derive.** |

**Kept deliberately short.** It loads on every session in this tree, so bloat costs Jeff money on
every turn. Detail belongs in the files above, not here.
