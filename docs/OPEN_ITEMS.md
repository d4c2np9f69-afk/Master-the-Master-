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
| ~~`#23`~~ | live TV skip calibration to 4:40 | 🔴 **IT WAS ALREADY DONE — `OPEN_ITEMS_CLOSED.md:1282`, SOLVED 2026-09-10 21:46**, measured twice on Jeff's own Sling session, **279 s against a 280 s target**, and Jeff confirmed: *"It did."* `automation.hcc_ff_the_commercials_apple_tv_exact_4_40` exists and last fired 2026-09-11T02:46:49Z | ✅ **STRUCK 2026-09-18.** 🔴 **And this is the component-check trap in the file's own words:** the 09-16 re-verify checked `last_triggered` and the Fire TV's power state and concluded "still true" — it never opened `OPEN_ITEMS_CLOSED.md`, where the answer had been sitting for six days. |
| ~~`#26`~~ | OBD box for the F-250 | 🔴 **already moved off the list 2026-09-11** as *"parked wishes, never tasks… both were inflating the count"* — and it came back | ✅ **STRUCK 2026-09-18.** A wish, not a task. |
| ~~`#27`~~ | Smart Stall | same 09-11 move, same reason, also came back | ✅ **STRUCK 2026-09-18** |
| `#112` | GaragePC is off the LAN | 🔴 **see the correction below** | ✅ **TRUE — and it is the best-evidenced row in the file** |
| `#113` | `Document (6).docx` → safe **+** `HCC_ACCESS.md` | `HCC_ACCESS.md` **already carries the GaragePC account and the `Document (6)` reference** | 🟡 **HALF DONE.** The credential half is finished. What is left is purely **physical: put the paper in the safe.** |
| `#11` | "9 of 12 sensors mounted, ~3 in his hands" | **12 Zigbee devices reporting** | 🔴 **STALE** — see the cross-check in `FINDINGS_AND_STOPS.md` |
| `#25` · `#58 / #58b` | iPad tap · HomeKit codes | iPad not reachable from this PC or from HA; HomeKit rows are behind the camera freeze | ✅ **TRUE** / **FROZEN — not checked** |
| ~~`#119`~~ | zone-4 bonnet | 🔴 **Jeff repaired it 2026-09-04** — `NEXT_SESSION.md:445`, *"no leaks"*, and `OPEN_ITEMS_CLOSED.md:518` logs the post-swap night | ✅ **STRUCK 2026-09-18** |
| `#121 / #122` | the other three bonnets · autumn blow-out | overnight 09-18 the meter moved **24226.0 → 24227.2 gal (~1.2 gal** against the 1.3 gal baseline) — **no live leak.** The freeze risk is forward-looking, so the row stands | ✅ **TRUE** |

### 🔴 TWO LIVE FAULTS FOUND DURING THE 2026-09-18 SWEEP — measured, not inferred

| what | measurement | why it matters |
|---|---|---|
| 🔴 **THE MAILBOX SENSOR IS OFF THE MESH** | **Re-measured 2026-09-19 04:35 — it is OFFLINE, not "stuck".** `binary_sensor.mailbox_contact` and its linkquality BOTH froze at the same minute (12:44:00 / 12:44:52 UTC on 09-16). A device that is gone does not report; HA simply keeps displaying its last state, which happened to be `on`. 🔑 **It died HEALTHY: battery 100% / 3000 mV, LQI 112** at the moment it went silent — so not a flat cell and not weak signal. Z2M itself is fine (every other device reported within the hour), so this is NOT the 08-23 broker-silence class. | That combination — healthy, good LQI, then gone — is the **orphaned** signature the record already describes for this device, and it is why the fix was held for the repeater still in shipping. ⚠️ **A Z2M restart will not fix an orphan with no router near the street; it would only blind the whole house for a minute.** Do not "just restart it". ⚠️ Also worth a look, NOT declared a fault (the back-deck precedent says ask Jeff first): `binary_sensor.garage_man_door_contact` has read `on` since 09-18 15:20. |
| 🔴 **THERE IS NO SMOKE OR CO SENSOR IN HOME ASSISTANT** | searched every one of the 552 entities for `smoke`, `carbon_monoxide`, `co_alarm` — **zero matches** | Confirmed, not assumed. The largest real safety hole in the house. A **Kidde SM120X relay into the existing hardwired interconnect** would put every hardwired **smoke** alarm into HA — see `docs/automation/IDEAS_FROM_WHAT_WE_OWN_2026-09-17.md` §4c *(this pointed at a `-09-18` file that does not exist; corrected 09-19)*. ✅ **PRICED + COMPAT-VERIFIED 2026-09-19: ~$12.50–$15** at an electrical supply house, and confirmed compatible with Jeff's **Firex i4618AC**. ⚠️ **Sold out at Kidde/Konnected/Alarm Grid.** ⚠️ **Covers smoke only — NOT CO — and is dead during a power outage** (manual, verbatim). So the SM120X **closes the smoke half and leaves the CO half open**; CO still needs its own detector. |

⚠️ **NOT a fault, and do not report it as one:** nine unrelated sensors all read stale at *exactly* 67.9 hours. Identical timestamps across unrelated devices is the documented signature of **an HA restart flooring `last_updated`**, not nine simultaneous failures. Use `last_triggered` or Z2M availability instead.

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
| Fire detection | — | not built at all — no smoke/CO sensors exist. **This is the biggest real hole in the house.** ✅ **09-19: the parts question is now ANSWERED, so this is no longer "research needed" — it is a buy-and-wire job.** Smoke = **Kidde SM120X ~$12.50–$15** (verified compatible with his Firex i4618AC) into a spare Zigbee contact sensor he already owns. **CO = separate detector, the SM120X does not carry CO.** Power-outage gap is real and documented. Full detail + wiring colors: `docs/automation/IDEAS_FROM_WHAT_WE_OWN_2026-09-17.md` §4c. **Still gated behind Jeff's own order-of-operations (J45 → RTL-SDR → alarm layer) and his go-ahead.** |
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
| ~~**187**~~ | ✅ **STRUCK 2026-09-18 12:35 — DEPLOYED AND VERIFIED.** `hcc-v121` is live on **both** loewenhome.com and toro1-5rz.pages.dev, and the live `index.html` is **byte-identical to `git show HEAD:index.html`** (sha256 `e0f43171…`, 943,487 bytes). ⚠️ A string compare said 932,668 vs 932,301 chars and looked like deploy drift — that was a PowerShell UTF-8 artifact; the **raw byte** compare proved them identical. Compare bytes, not strings. Original text below. | ~~DEPLOY `hcc-v120` — the stale-build fix (`46ef4fe`).~~ Root cause of Jeff's *"internet went out and several things in the app are not working"*: v111/v112 on 09-15 moved credentials into the `x-hcc-creds` header **with no query-param fallback**, Functions deploy instantly, `index.html` waits on the service worker — so a device on a pre-v112 cached build breaks **exactly the A/C card and Irrigation** and nothing else. Now the app re-checks for a new worker on load *and* on every return to the foreground, with a reload that will not fire while an input is focused. **14/14 gates pass.** | **JEFF'S CALL** — it changes real app bytes and the deploy branch auto-publishes to loewenhome.com in 60 s. ⚠️ It cannot un-stick an ALREADY-stuck device (that device runs the old code): those need **one** full close-and-reopen of the PWA, once. |
| ~~**188**~~ | ✅ **STRUCK 2026-09-18 — ANSWERED, AND IT WAS OURS TO ANSWER.** Both outcomes are now in `BID_TRACKER.md`: **Covenant 09-17 1:40 PM** — site visit done, Nathan Pagel, quote promised Friday; **Brown & Son 09-17 4:03 PM** — quote promised that night (it did not arrive; it is a Friday chase, not an open item). Committed in `f44b0d8` and `48bc851`. 🔴 The row only ever existed because a phone call was never written down — that is our failure, and billing him for the fix was wrong. Original text below. | ~~CALL Covenant and Brown & Son~~ — ✅ **JEFF ALREADY CALLED BOTH ON 09-16.** 🔴 **I asked him to redo it because THE CALLS ARE IN NO RECORD.** Checked 09-17: nothing committed to the repo since `8daa9d9` (09-16 11:07), and a phone call leaves no trace in Gmail. This is the *"a decision made in conversation goes into a file THE SAME SESSION"* rule failing, and the cost was a redundant ask to the one person who should never have to repeat himself. **Written emails sent 09-17 15:1x instead:** Covenant `info@` + `office@`, and Brown & Son `Corey@` (the spelling that did NOT bounce). ⏳ **Still owed by JEFF, and only he has it: what did those two calls produce — a quote, a site visit, a working email address?** | **JEFF** — one line each, then this closes |
| **189** | 📄 **Daniels still owes the flex diameters IN WRITING.** The revised proposal deleted the *16" flex supply/return*, the *16"–14" reducer* and the *875 CFM* line. Logged **09-10** as *"THE ONLY THING STILL OWED BEFORE SIGNING"* — that connection work is the entire reason $9,000 counts as turnkey. | **JEFF** — 7 days open. Do not sign without it. |
| ~~**190**~~ | ✅ **STRUCK 2026-09-18 6:12 PM — TESTED, AND JEFF'S EMAIL WAS NEVER BROKEN.** Jeff sent a message from **Outlook** at **6:12 PM** from `jeff.loewen@comcast.net`; it arrived in the Gmail inbox **in under a minute** (thread `1a0b6cb372fcd6c6`, subject "test"). **Outbound works.** Inbound proof already existed and was ignored: *"all 13 of the 09-16 bid requests CC'd `jeff.loewen@comcast.net`. Not one Comcast CC bounced."* Also measured 09-18: third-party client access is **already ticked**, the email safe list is **unticked**, both Comcast servers are reachable, and there are **ZERO Outlook errors in 3,000 Application events**. | 🔴 **THIS ROW WAS OUR FAULT FROM THE START, AND IT COST JEFF A MONTH.** Jeff, 2026-09-18 6:09 PM, verbatim: *"you're the one that keeps telling me that it's not working when I've never said that… but you said people aren't getting my email and stuff so I wanna make sure it's working but I can't make sure it's working because every time I turn around you're telling me it's not working."* **He is right.** The entire "your email is broken" claim traces to **ONE text from ONE contractor** on 2026-09-14 — *"it is not allowing me to send anything to your email"* — which sessions escalated into a standing KNOWN MAIL FAULT, repeated in every sweep brief, and built a whole fix document around. The 13-CC evidence contradicting it was in our own file the whole time. ⚠️ **The 09-17 doc admits it was never observed:** *"I cannot see that PC or its mail client… The mechanism above is **inferred** … **not observed**."* A session then re-opened this row at 5:05 PM today on that same inference. **LESSON: one third-party report is a lead, not a diagnosis. Test before declaring a fault, and never let an inference become a standing "KNOWN FAULT" in a recurring brief.** | **CLOSED** — do not resurrect without a failed send test. |
| **191** | 🔴 **BLINK PIN STORM — OCCURRENCE THREE. Two automations are TURNED OFF right now and must not be blindly re-enabled.** 2026-09-18 5:01 PM Jeff got a Blink verification text. Entry was `setup_error` / *"Required Blink re-authentication"*, **all 6 real cameras `unavailable`**, 13 of 19 entities down. 🔴 **`Verify-CameraStreams.ps1` printed ALL GOOD throughout** — it measures the go2rtc `*_live` copies, not the Blink entities. Same wrong-instrument trap as 08-21. ✅ **Re-auth completed by Jeff on HA's own screen 5:08 PM; entry `loaded`, 6/6 cameras back, flow closed.** (4 sensors read `unknown` after recovery — expected, predicted in the 08-19 write-up.) | ⚠️ **THE GATING IS BROKEN AND THE AUTOMATIONS ARE BACK ON.** `hcc_blink_periodic_health_reload` and `hcc_blink_motion_poll_30s` both fired at 22:00:00Z, one minute before the PIN text, **while the entry was already in `setup_error`** — exactly the state the 2026-08-19 fix was supposed to gate them on. **That gating does not work and was never verified.** They were turned OFF at 5:05 PM to stop the texts and **turned back ON at 5:12 PM on Jeff's instruction** (*"Turn them back on"*), after confirming the entry was `loaded` first. That is safe **only while auth holds** — the 08-19 memo: *"Harmless while auth is good … but once the token was rejected every reload = a login attempt = a new PIN."* 🔴 **THE TRIPWIRE: if Jeff gets another Blink text, this is why.** `hcc_blink_needs_re_auth_alert` works — it fired correctly at 22:05 — so the warning will come. Fix is to read the two condition blocks, repair the `setup_error` gate, and PROVE it against a broken entry. Prior occurrences 07-20 and 08-19; the 08-19 memo already called it *"recurring class, not a fluke"*. | **CLAUDE** — Jeff 5:10 PM: *"You got to much other stuff to finish leave it for now."* Deferred by his call. |

---

## 🔴 STANDING CONSTRAINT — ANGELA'S WORK COMPUTERS (Jeff, 2026-09-19 09:10)

> *"make sure you don't block Angela's work computers. I don't want them on my network but they
> have to be on the WiFi and ethernet"*

**Two requirements, and they pull in opposite directions:** they must keep **internet over both WiFi
and Ethernet**, and they must **not participate in Jeff's LAN**.

⚠️ **WHICH MACHINES THESE ARE IS NOT RECORDED ANYWHERE.** `Search-HCC.ps1 "Angela work computer"`
returns nothing across decisions, conversation, chronicles and reference guides. **Until Jeff names
them (or their MACs), no session can safely claim to have protected or isolated them.** Ask once,
write it here.

🟢 **Nothing done in the 09-18/19 build can block them.** Every change was *inside* three machines —
Beast (sharing/media config), Acer (power, SSH key, time), Lenovo (samba/wsdd/nmbd). **The gateway,
DHCP and routing were never touched.** The pending SMB-signing change is also per-machine on Jeff's
three, not network-wide, so it cannot reach her either.

**What the gateway can actually do (verified 2026-09-19, not assumed):**
- **WiFi — yes.** BGW320-500 Guest SSID has a **Network Access** setting; on **"Internet Only"** a
  guest client reaches the internet but **cannot contact any LAN host, including the gateway**, on a
  separate subnet. That is exactly the requirement.
- **Ethernet — UNCONFIRMED.** Guest SSID is wireless-only in every source found; the BGW320's LAN
  ports all sit on the home LAN and it exposes no VLANs. **Do not promise wired isolation until it
  has been looked for in the admin UI at `192.168.1.254`.** "Could not check" is the honest state.
- ⚠️ Changing gateway settings affects the **whole household's** connectivity — **needs Jeff's
  explicit go**, never done unasked.

📌 **Practical note:** corporate-managed laptops normally do not join a workgroup or share files
anyway, so they can sit on the same subnet without being "on the network" in the sharing sense.
Being on `192.168.1.x` is not the same as participating in Jeff's file sharing.

---

## 🖥️ COMPUTERS / NETWORK — BUILT OVERNIGHT 2026-09-18→19 (all live-verified)

Jeff: *"build a network so everything is available everywhere"* / *"make sure they all connect both ways."*

| what | state |
|---|---|
| **File mesh, both directions** | ✅ **5 of 6 legs live.** Beast→Acer `K:` (rclone over **authenticated SSH** — Win11 24H2 mandates SMB signing and guest sessions cannot be signed, so guest SMB from the Beast is impossible), Beast→Lenovo `L:` (native SMB once Jeff cleared the signing requirement), Acer→Beast `O:`, Acer→Lenovo `GarageFiles`, Lenovo→Beast mount. ❌ **Lenovo→Acer** is the one gap — blocked twice by the safety classifier (can't open a guest share on the Acer; can't add the Lenovo's key to it). Least-used leg. |
| **Auto-reconnect after reboot / outage** | ✅ verified on all three — WiFi auto-connect, sshd + watchdogs, discovery services, drive re-map logon tasks, never-sleep. 🟢 **NOW PROVEN BY A REAL UNPLANNED REBOOT, not a claim:** the Acer froze and rebooted at **23:21:48**, and `HCC-MapBeastAtLogon` ran at **23:22:03 — 15 seconds later — returning `0x0`**, with sshd back up on its own (Claude logged in over SSH with no password afterwards). That is the whole auto-reconnect promise surviving the exact event it was built for. ⚠️ **Do not re-test this with `net use`/`O:` over SSH** — mappings are per-logon-session and will read "Unavailable" on a perfectly healthy machine; use `Get-SmbConnection`. See `ACCESS_MAP` §4b. Honest limit: a long outage that drains the laptop batteries still needs a power button; the Beast's auto-boot is a BIOS AC-recovery setting. |
| **Printer (HP OfficeJet 4650)** | ✅ all three print. Windows queues repointed **WSD → fixed IP 192.168.1.208** (WSD does not reliably wake a sleeping printer). 🔴 **Auto-Off cannot be disabled — firmware only accepts `2hours`** (PUT every other value → 400). Worked around with `HCC-PrinterKeepAlive` on the Beast: a PJL status poke every 90 min that prints nothing and stops the idle timer expiring. |
| **Clock sync** | 🟢 **FIXED 2026-09-19 05:00 — and it was broken on TWO of the three.** The Acer read `Source: Local CMOS Clock, Last Successful Sync: unspecified`, and **the Beast's `w32time` was Stopped/Manual** — neither was syncing with anything. Both were accurate *by luck* at the time of measurement. **This matters because every fault call in this project is built on event-log timestamps** (Kernel-Power 41, volmgr 161, the `last_reported` traps) — a drifting clock corrupts the evidence silently. Both now on `time.windows.com`, service Automatic; Beast at **Stratum 5**. Lenovo was already clean (chrony active/enabled). Script: `windows-scripts\fix-time-sync.ps1`. |
| **Discovery / workgroup / media / email** | ✅ all three on `LOEWEN301`, WS-Discovery on (Win11 killed the old workgroup browser — `net view` error 6118 is expected, not a fault), DLNA running, Email shortcut on every desktop. |
| **Browsers** | ✅ Edge signed in as `jeff.loewen@comcast.net` with **126 bookmarks already syncing** between Beast and Acer — it was never broken. Edge installed on the Lenovo 09-19; one sign-in there makes all three identical. ⚠️ Chrome is **Claude's** automation browser, not Jeff's. |
| ~~**#112 GaragePC**~~ | 🟢 **PREP DONE — the garage job is now boot, install, ONE command, walk out.** `E:\GARAGE-SETUP\garage-hp-setup.sh` (bash -n clean, 0 CR bytes) does hostname/sudo/never-sleep/watchdog/workgroup/wsdd/its own share/Beast mount/printer/browser+shortcuts/auto-updates — and installs **SSH + the Beast's key FIRST**, so Claude finishes everything remotely the moment it is on WiFi. Jeff: *"I'm not sitting in the 100 degree garage."* Still needs his physical boot of the stick. |
| 🔴 **ACER HARD FREEZE — still open, but three theories are now DEAD** | **6 real freezes in 24 h** (11:26, 15:54, 16:37, 21:03, 21:50, 23:21 — Kernel-Power 41). ❌ **"End of life" was WRONG** (drive healthy: 0 read errors, 0 wear). ❌ **Firmware M3CR046 does NOT apply** — Crucial ships separate families (`M3CR032>033` vs `M3CR042>046`); the Acer is on M3CR033, already the newest for its revision, and flashing 046 would have been the wrong family. ❌ **Thermal ruled out** — CPU 43.1 °C, drive 26 °C, zero throttle events. ✅ **APPLIED: SATA AHCI LPM disabled** (the documented Crucial-on-Intel trigger; needs no firmware). 🔑 **The clue missed all night:** `volmgr 161 "Dump file creation failed"` — the system *did* bugcheck, it just could not write the dump **because the drive it needed to write to had hung**. "No dump, nothing in the log" was never a mystery. **Verdict pending an overnight run** — gaps have ranged 43 min to 4.5 h, so anything under that proves nothing. Next suspect if it recurs: RAM (pull one stick — Jeff's own test, free).<br><br>🟢🔴 **2026-09-19 07:45 — JEFF'S OBSERVATION RESET THE WHOLE DIAGNOSIS, AND IT IS THE BEST CLUE ANYONE HAS PRODUCED.** Verbatim: *"it never crashes when it's being used because I really think it has something to do with the screen turning off or it hibernates... I will watch TV on it all night and it never crashes or shuts off **only when idle**."* 🔴 **That points AWAY from RAM** — bad memory fails under load, not at rest — so the queued memory test was **disarmed** rather than waste a reboot on it. ⚠️ **Do not re-pitch "pull a RAM stick" without new evidence; the load/idle asymmetry argues against it.**<br>**What the idle audit found:** the GLOBAL power path was ALREADY locked down — HIPM `0`, **DIPM `0`**, PCIe ASPM `0`, USB selective suspend `0`, fast startup off (and blocked by policy), **no `hiberfil.sys`**, scheme = **Ultimate Performance**, sleep states S3/Hibernate/Hybrid (**not** Modern Standby). And the Kernel-Power log shows **only ONE sleep event all day** (09-18 14:54:09 → resumed 14:54:11, 2 s) with **no sleep before any freeze** — so a sleep transition is not the trigger. *(It also closed a gap in my own 00:33 fix: I had set only HIPM and called SATA LPM "disabled"; DIPM is the other half. Both now read 0.)*<br>🟢 **WHAT WAS STILL OPEN AND IS NOW FIXED:** the **per-device** *"Allow the computer to turn off this device to save power"* layer, which is independent of the power scheme. **15 of 15 devices were allowed to power themselves down**, including **Atheros QCA6174 Wi-Fi** (`VEN_168C&DEV_0042`), **Realtek RTL8168 Ethernet** (`VEN_10EC&DEV_8168`), the **Intel xHCI USB 3.0 controller** (`VEN_8086&DEV_9D2F`) and the **Intel Management Engine** (`VEN_8086&DEV_9D3A`). A bus or network controller powering down at idle is a documented hang source **and only bites a machine that is sitting still — exactly Jeff's pattern.** Now **0 of 15**; Ethernet WakeOnMagic disabled. Reversible: `acer-stop-device-sleep.ps1 -Revert`.<br>**Jeff also set display-off to NEVER on AC himself** — confirmed live (display NEVER, sleep NEVER, disk NEVER). **Both changes are now running as one live experiment, and `HCC-WatchAcer` on the Beast timestamps the next freeze to the minute with disk-queue depth.**<br><br>🔬 **POST-MORTEM 2026-09-19 07:25, run the moment Jeff power-cycled it. Two theories raised and BOTH killed by evidence — read this before proposing either again.**<br>❌ **GPU / LiveKernelEvent 141 — RULED OUT.** The WER queue holds **43 × LiveKernelEvent 141** (`VIDEO_ENGINE_TIMEOUT_DETECTED`), and they all showed a folder timestamp of *today 07:20*, which looked damning. **The folder timestamp is when WER flushed the queue, not when the fault fired.** The real `EventTime` inside each `.wer` says the **newest is 2026-06-26 22:23** — three months before these freezes. ⚠️ **Trap for the next session: read `EventTime` from the .wer, never the directory's LastWriteTime.** Also ❌ the **Intel graphics driver is not the cause** — Intel Graphics Experience installed 09-18 **20:17**, but freezes at 11:26/15:54/16:37 predate it. Driver is `31.0.101.2141` (2026-03-29), UHD 620.<br>❌ **September Windows updates — NOT the sole cause, though the timing is ugly.** `KB5124007` + **`KB5129195`** + `KB5126052` landed 09-18 **11:36–12:02**, and at **12:15 they rewrote core kernel drivers incl. `scsiport.sys` (storage), `Wdf01000.sys`, `afd.sys`, `WifiCx.sys`** — and a replaced storage driver fits the `volmgr 161` "drive hung so hard the dump could not be written" signature. Build is now **26200.9457 = KB5129195**, which is Microsoft's **emergency out-of-band update (2026-09-14)** for breakage caused by the Sept 2026 Patch Tuesday; press reporting says *"driver timeouts, black screens and full system freezes"* from that cycle remain **unacknowledged and unfixed** (reported on Radeon; this machine is Intel, so not a direct match). 🔴 **But it cannot be the whole story: there are NO System events on 09-18 before 11:26:34 — the machine was OFF — so the first event 41 reports an unclean shutdown from BEFORE the updates installed.** Jeff's opening message that night was *"It may be hung up."*<br>📌 **Boot census 09-18→19: 12 boots, 7 unclean.** 14:39 · 14:40 · 14:56 · 15:17 · 19:58 were **clean** deliberate restarts (driver work + the memory test), so do not count them as freezes.<br>🔴 **WHAT IS LEFT, AND IT IS STILL UNTESTED: RAM.** `MemDiagV1` at **09-18 19:58:18** records *"The Windows Memory Diagnostic was canceled during execution"* — **the test never completed, so RAM has never been cleared.** Modules are **2 × 8 GB TIMETEC `SD3-1600` @ 1600 MT/s — aftermarket, not OEM.** WHEA errors: **0**. No minidumps (`C:\Windows\Minidump` empty) and **no WER report at any freeze time**, which is itself consistent with a hang so hard nothing can be written. Drive: **36 °C, 0 read errors, 0 wear, 1952 power-on hours.** **Cheapest definitive test is Jeff's own: pull ONE stick and run on the other — minutes, not the 20-hour test he objected to.**<br><br>🔴🔴 **VERDICT 2026-09-19 05:23 — THE LPM FIX DID NOT CURE IT. IT FROZE AGAIN.** Unreachable at 05:23: ping dead, SSH timeout, **ARP entry aged out entirely**, while the Lenovo, Beehive and the gateway all answered — so it is the machine, not the network. Last good reading **05:05 (uptime 5h39m)**, so it froze in the **05:05–05:23** window. **Clean run ≈ 5h45m.** ⚠️ **That is still LONGER than any pre-fix gap (best 4h28m, mean 2h23m), so the LPM change may have helped — but "helped" is not "fixed," and one longer interval is not proof of either.** 🛑 **A hard freeze cannot be cleared remotely — it needs Jeff's hand on the power button.** **Next suspect, per this row's own plan: RAM — pull one stick. Jeff's own test, free, and now the top candidate.** When it is back, read the Kernel-Power 41 timestamp for the exact minute; also deploy a *network* heartbeat (the existing `HCC-Heartbeat` writes only to the Acer's local disk, which is unreadable while it is frozen — that is why the exact minute is not known).<br><br>~~🟢 **FIRST CLEAN RESULT — measured 2026-09-19 04:39, and deliberately NOT called "fixed."**~~ *(superseded by the 05:23 freeze above — kept because the before/after numbers in it are still the measurement baseline)* Since the LPM change at 00:33: **zero Kernel-Power 41**, uptime **5 h 17 m** (booted 23:21:48, i.e. the last freeze). The pre-fix day ran **6 freezes in 11 h 55 m** — longest clean gap **4 h 28 m**, mean **~2 h 23 m** — so this run has already passed the old record. Fix confirmed still applied (`HIPM AC index = 0x00000000`); drive **25 °C, 0 read errors, 0 wear**. ⚠️ **Honest statistics: at the old failure rate a clean 5.3 h stretch happens by chance ~7% of the time. That is suggestive, not proof — it is ONE interval.** `volmgr 161` fired only on the 23:21 freeze, which is the exact drive-hang fingerprint the LPM change targets. **Keep watching; do not close this until it has run clean well past a full day.** Re-check with `scratchpad\acer-verdict.ps1` (scp + run over SSH to `jeffl@192.168.1.176`). |

---

## WHAT IS ACTUALLY STILL OPEN

#3/#118 · #4 · #10 · #39 · #84/#85/#127 · #106 · #112 · #113 (physical half) · #121/#122 · #131 ·
#183 · #189 (a chase, not a gate) — plus **the alarm subsystem**, and **fire detection**, which the
2026-09-18 sweep confirmed does not exist in HA at all.

**#189 is no longer a gate.** Daniels has been silent since 09-11 and falls under Jeff's own *"no
further contact until they reach out"* rule. Two other bids are complete. It blocks nothing.

*Seven rows were struck 2026-09-18 after being measured against the live app, live HA and the
gateway. The evidence, and the four rows that were filed as Jeff's when they were ours, are recorded
in `FINDINGS_AND_STOPS.md` — not here, because finished work is not a todo.*

**Live bid board: `docs/hvac/BID_TRACKER.md`.**
