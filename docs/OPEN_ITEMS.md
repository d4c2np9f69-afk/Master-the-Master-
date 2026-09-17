# ✅ HCC — THE TODO LIST

**Only things somebody is going to DO.** Findings, lessons, stop signs and finished work do not
live here — see the pointers at the bottom. Jeff, 2026-09-16: *"If it's not a direct action item
move it where it needs to go to be referenced if needed, but not in the damn todo list."*

**RULE: strike an item in the same commit that finishes it, with the command or observation that
proved it.** A list that disagrees with reality makes the next session confidently wrong.

---

## 🔨 ACTION ITEMS

**🟢 Nothing here is waiting on me.** Both rows were closed 2026-09-16 without asking Jeff
anything — one answered from the record, one by building the thing that was actually missing.

| # | What | Owner | State |
|---|---|---|---|
| ~~**#158**~~ | Contactor `3100A15Q152L` | — | ✅ **FULLY CLOSED 2026-09-16 01:35. The part was ALREADY REPLACED on the old unit** — Jeff, verbatim: *"That has already been replaced on the old unit."* Nothing to source, nothing to diagnose. The record had already identified it as a **Nordyne OEM** part matching his **Nordyne R4GD-030K072C**; what the record did NOT have was that the swap was done. Consistent with the live reading at 01:34 — relay **on**, automation **on**, indoor **72.5 °F**, **7 cycles / 8.2 h in 24 h**: the unit is running because it was *fixed*, not because the fault never existed. |
| ~~**#160**~~ | Location exposure | **JEFF's button** | ✅ **My half done.** The real blocker was never which VPN — he could not *start* the one he owns. Three desktop buttons now, WARP-first order baked in. Free tier **15 GB/month** → a per-session tool, not always-on. |

---

## 🔵 WAITING ON JEFF — **every row below RE-VERIFIED 2026-09-16 01:45, not taken on trust**

Jeff, 01:40: *"You can't get out of cleaning the list by pushing old stale shit to me so you don't
have to deal with it."* Correct. So each one was **measured** before being left here. One was
already stale, one is half-done, and one nearly produced a false report from me.

| row | claim | measured tonight | verdict |
|---|---|---|---|
| `#3 / #3b / #118` | needs one `bw unlock` | `bw status` → **`unauthenticated`** | ✅ **TRUE** — zero-knowledge vault, nothing substitutes for his master password |
| `#4` | Secure Boot BIOS trip | **Secure Boot = False**, TPM **present and ready** | ✅ **TRUE** — TPM is fine, Secure Boot is the only blocker, and it is a BIOS screen |
| ~~`#5`~~ | rotate the exposed Weather Underground key | — | 🗑️ **DELETED FROM THE LIST 2026-09-16 01:53 at Jeff's direct instruction** (*"Take 5 off"*, then *"I told you to delete #5"*). He rotated it weeks ago; nobody ever recorded that, which is the only reason the row survived. **The repo-side work was MINE and is now done** — the hardcoded key in `weather.js` is deleted. Measurement kept in `FINDINGS_AND_STOPS.md`, not here. |
| `#23` | live TV skip calibration to 4:40 | `script.hcc_skip_commercial` last fired **2026-09-11**, `media_player.fire_tv_viewing_room` **off** | ✅ **TRUE** — needs him watching live TV, cannot be simulated |
| `#26` | OBD box for the F-250 | a purchase | ✅ **TRUE**, and explicitly *not urgent* |
| `#112` | GaragePC is off the LAN | 🔴 **see the correction below** | ✅ **TRUE — and it is the best-evidenced row in the file** |
| `#113` | `Document (6).docx` → safe **+** `HCC_ACCESS.md` | `HCC_ACCESS.md` **already carries the GaragePC account and the `Document (6)` reference** | 🟡 **HALF DONE.** The credential half is finished. What is left is purely **physical: put the paper in the safe.** |
| `#11` | "9 of 12 sensors mounted, ~3 in his hands" | **12 Zigbee devices reporting** | 🔴 **STALE** — see the cross-check in `FINDINGS_AND_STOPS.md` |
| `#25` · `#58 / #58b` · `#119 / #121 / #122` | iPad tap · HomeKit codes · zone-4 bonnet | not measurable here (HomeKit is frozen this session; the bonnet is a wrench) | ✅ **TRUE** |

### 🔴🔴 #112 IS OUR DAMAGE, NOT A CHORE HE HAS BEEN PUTTING OFF. SAY SO.

**Jeff, 2026-09-16 01:43: *"The garage pc is still down and should be on the list — that is from
your fuck up. Read the record, you fucked that all up."*** He is right, and listing it under
*"waiting on Jeff"* without that sentence is how a session we broke becomes a task he looks lazy
for not doing.

**Both candidate causes in the record are ours:**
- **(b)** *"the **09-01 boot loop** caused by **a setup script of mine** re-applying the whole
  `USER_RIGHTS` policy block via `secedit`; **Jeff recovered it with System Restore**"* — and the
  record itself notes a restore can roll back a wireless profile.
- **(a)** the **08-13 extender retirement** that left it joined to the vanished `Loewen301_Ext`
  SSID. The gateway evidence points here as the *start* — it has not associated since before
  08-14 — but that does not make it his doing either.

**And the handling was wrong too, which the row already admits:** *"Jeff was told flatly it was the
SSID, before the 09-01 note — which was sitting UNCOMMITTED in the working tree — had been read."*
A confident wrong cause, given to him, from a file we had not committed.

**So the correct framing:** the machine is down because of work done on it here. The only remaining
step needs hands on the machine, which are his — **but it is a repair we owe, not a chore he is
behind on.** When it comes back: give it a DHCP reservation like Beehive's, because its recorded
addresses go stale every time.

### 🔴 MY NEAR-MISS ON #112 TONIGHT — the trap this row already warns about

I pinged **`192.168.1.215`**, got three replies, and was about to report **"GaragePC is back on the
network."** **It is not GaragePC.** `.215` is the **Fire TV** — the record has PiPup posting to
`http://192.168.1.215:7979/notify`. GaragePC's addresses are **`.121` and `.212`**, and the row
already proved both fail.

**What the record already established, and it is conclusive:** the BGW320's own device list shows
**56 devices, and the gateway retains powered-off clients for ~4 weeks** — `JeffsLapTop` sits in it
right now reading *Status: off, 17 days stale*. **GaragePC is absent in every state.** So it has
not touched this gateway since before 2026-08-14 — which points at the extender retirement, not
the 09-01 boot loop.

⚠️ **The lesson is the one in `ACCESS_MAP` about instruments that lie: a ping proves something
answers at an address, not WHICH something.** Confirm the identity before naming the machine.

**Fix is unchanged and genuinely his:** power it on, join it to `Loewen301`. Credentials are
already in `HCC_ACCESS.md` §5, so the beast can authenticate the moment it appears.

**His go / his decision** (one word each):
`#10` arm panic **and** disable the old one · `#39` + the alarm subsystem · `#28` URL rotation ·
`#84 / #85 / #127` **one Z2M restart**, held for the repeater still in shipping · `#106` the A/C job ·
`#131` after the proof run · `#27` Smart Stall *("do not start until Jeff says go")* ·
**`#183`** the utility-card half of the Cloudflare fix — written, tested, **shipped switched off**

---

## 🚨 THE ONE BIG THING GENUINELY NOT BUILT — THE ALARM SUBSYSTEM

**Jeff, 2026-09-10: *"Alarms not built !!!"*** He is right. It is one system, not four half-tasks:

**⚠️ Two numbers in this table were STALE and are corrected below — measured 2026-09-16 01:22.**

| piece | row | state — **re-measured 2026-09-16** |
|---|---|---|
| Door / window alerting | `#39` | 🔴 **the old "43 automations, not one triggers on a contact" is WRONG.** There are **62** automations and **three** are contact-driven: mailbox-opened (announces + pushes), mail evidence capture, and the 10 PM garage check. **The real gap is narrower and should be stated that way: the FRONT DOOR, BACK DECK DOOR and GARAGE MAN DOOR have no alerting.** |
| Panic button | `#10` | v2 built and disabled; the OLD one that reaches nobody is still armed. 🛑 Jeff, 09-10: *"Leave the panic button alone till the alarms are built."* |
| Sirens | — | not built; the TS0224 was judged too weak and reassigned to the leak alarm |
| Fire detection | — | not built at all — no smoke/CO sensors exist. **This is the biggest real hole in the house.** |
| Sensors it runs on | `#11` | 🟢 **DONE — the old "9 of 12" is stale. 12 Zigbee devices are on the mesh and reporting.** The fleet is not the blocker any more. |

🔴 **Build it as ONE subsystem, not as orphans — Jeff's own instruction.** It needs his go, and it
is the largest real piece of work left anywhere in this project.

---

## ⛔ FROZEN FOR THIS SESSION

Enforced by `windows-scripts/hooks/Hook-RequireRead.ps1`, listed in `.claude\session-freeze.txt` —
the gate blocks these, so it is not a matter of remembering.

- **Cameras** — Jeff, 2026-09-16: *"We said no cameras tonight."* Also `#181`'s remaining half.
- **Genealogy** — *"Genealogy is not the main priority here, the project is!"* → `docs/genealogy/OPEN_GENEALOGY.md`

---

## 📚 WHERE EVERYTHING ELSE WENT

| what | where |
| # | what | why it is still here |
|---|---|---|
| **155/156/157** | Ancestry: **279 duplicate people**, the DNA veto, and the sweep only seeing **58%** of the tree | genealogy, real work, needs a session with time |
| **187** | 🔴 **DEPLOY `hcc-v120` — the stale-build fix (`46ef4fe`).** Root cause of Jeff's *"internet went out and several things in the app are not working"*: v111/v112 on 09-15 moved credentials into the `x-hcc-creds` header **with no query-param fallback**, Functions deploy instantly, `index.html` waits on the service worker — so a device on a pre-v112 cached build breaks **exactly the A/C card and Irrigation** and nothing else. Now the app re-checks for a new worker on load *and* on every return to the foreground, with a reload that will not fire while an input is focused. **14/14 gates pass.** | **JEFF'S CALL** — it changes real app bytes and the deploy branch auto-publishes to loewenhome.com in 60 s. ⚠️ It cannot un-stick an ALREADY-stuck device (that device runs the old code): those need **one** full close-and-reopen of the PWA, once. |
| **188** | ~~CALL Covenant and Brown & Son~~ — ✅ **JEFF ALREADY CALLED BOTH ON 09-16.** 🔴 **I asked him to redo it because THE CALLS ARE IN NO RECORD.** Checked 09-17: nothing committed to the repo since `8daa9d9` (09-16 11:07), and a phone call leaves no trace in Gmail. This is the *"a decision made in conversation goes into a file THE SAME SESSION"* rule failing, and the cost was a redundant ask to the one person who should never have to repeat himself. **Written emails sent 09-17 15:1x instead:** Covenant `info@` + `office@`, and Brown & Son `Corey@` (the spelling that did NOT bounce). ⏳ **Still owed by JEFF, and only he has it: what did those two calls produce — a quote, a site visit, a working email address?** | **JEFF** — one line each, then this closes |
| **189** | 📄 **Daniels still owes the flex diameters IN WRITING.** The revised proposal deleted the *16" flex supply/return*, the *16"–14" reducer* and the *875 CFM* line. Logged **09-10** as *"THE ONLY THING STILL OWED BEFORE SIGNING"* — that connection work is the entire reason $9,000 counts as turnkey. | **JEFF** — 7 days open. Do not sign without it. |
| **190** | 🔴 **JEFF'S EMAIL — not bouncing, he cannot SEE it.** The **2026-08-19 Comcast password reset to 32 random chars** (recorded in `password_and_data_security_plan_2026-08-19.md` line 126) left every desktop mail client holding the OLD password. SMTP auth fails → **mail piles up unsent and blinks**; IMAP auth fails → **nothing new downloads**, so contractors' replies sit on Comcast's server unread. **Proof inbound is fine: all 13 bid emails CC'd the Comcast address on 09-16 and ZERO bounced.** Fix in `docs/EMAIL_FAULT_2026-09-17.md`: (1) read `connect.xfinity.com` webmail FIRST — quotes may be sitting there since 08-19; (2) tick **Settings → Security → Third Party Access Security**, off by default and it blocks every client; (3) new password + `imap.comcast.net:993 SSL` / `smtp.comcast.net:587 STARTTLS`, username = FULL address. | **JEFF** — I cannot see that PC |

**That is FOUR** — one genealogy job of mine, and three on Jeff that are each one action.
Everything else that was on this table has been verified and closed.
**Live bid board: `docs/hvac/BID_TRACKER.md`.**
