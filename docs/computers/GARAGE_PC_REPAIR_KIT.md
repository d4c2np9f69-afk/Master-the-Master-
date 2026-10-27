# GARAGE PC — the repair kit

**Fri 2026-09-18.** Everything needed to get that machine working again, in the order it happens,
written to be followed standing at the machine.

---

## 🔴 FIRST, THE PART THAT ISN'T JEFF'S FAULT

`OPEN_ITEMS.md` #112 heading, verbatim: **"#112 IS OUR DAMAGE, NOT A CHORE HE HAS BEEN PUTTING
OFF. SAY SO."**

Jeff, 2026-09-16 01:43: *"The garage pc is still down and should be on the list — that is from your
fuck up. Read the record, you fucked that all up."*

**Both candidate causes are ours:**
- **The 08-13 extender retirement** left it joined to the vanished `Loewen301_Ext` SSID. The
  gateway evidence points here as the start.
- **The 09-01 boot loop** caused by **a setup script of mine** re-applying the whole `USER_RIGHTS`
  policy block via `secedit`. Jeff recovered it with System Restore — and a restore can roll back a
  wireless profile.

**And the handling was wrong too:** he was told flatly it was the SSID *before* the 09-01 note —
which was sitting uncommitted in the working tree — had been read.

This is a repair we owe. Not a chore he is behind on.

---

## 📍 PHYSICAL STATE OF THE HP RIGHT NOW — Jeff, 2026-09-20 20:15

> *"The stick was in the HP and the Ubuntu install is spinning, that was the last state of the
> machine and it is off now. So I'm just telling you so that you know where things are — what I
> just told you is not in the record, I just want you to be prepared for it."*

**Recorded here because he is right that it was nowhere.** A session searched the docs, the master
record and the 137 MB 09-18/19 transcript for it and correctly reported finding nothing. Verbal
state from Jeff is the only source, so it goes in the file.

**STATE: an Ubuntu install was STARTED on the HP, appeared to hang on the spinner, and the machine
was POWERED OFF mid-install. The stick has since been pulled and is in the Beast.**

> **2026-09-22 7:50 PM — stick re-audited on the Beast (`E:\`) before the next attempt.** Every file
> read end to end, YAML parsed, GRUB entries checked, LF confirmed byte-by-byte with Python, `bash -n`
> clean, and `garage-hp-setup.sh` patched to the 09-22 no-password sharing model (mounts the Beast
> AND the Acer as guest, desktop folders, signed Samba). Full detail: `OPEN_ITEMS.md` #112.
> **The Windows boot loop does not matter to this path** — ESC → F9 is firmware, and the autoinstall
> wipes whatever the 09-01 attempt left. **Not verified, cannot be from here: the autoinstall has
> never booted on the HP.** The 09-01 "spinning" was the manual installer.

### What that means for the next attempt
1. 🔴 **Assume the 500 GB disk is PARTIALLY WRITTEN.** A power-off mid-install leaves a
   half-built partition table, possibly with Windows already partly destroyed. **No manual cleanup
   is needed** — `autoinstall.yaml` uses `storage.layout: direct`, which wipes and repartitions
   from scratch. A partial install is exactly what it heals.
2. ⚠️ **It also means the boot loop and the file-rescue question may already be moot** — there may
   be no intact Windows left to loop or to copy from.
3. 🔑 **IT WAS PROBABLY NOT HUNG. IT WAS PROBABLY SLOW.** Pentium G620 (2011), 5400 rpm spinning
   drive, USB 2.0, 3.4 GB squashfs. This doc's own PART B budgets **20–30 minutes**, and the
   installer can sit on one frame for many minutes while it writes. **Do not treat a still screen
   as a failure before 15 minutes.**
4. ✅ **FIXED 2026-09-20: `quiet splash` was REMOVED from both automatic GRUB entries**, so the
   next attempt shows scrolling console text instead of a spinner. Working-slowly and genuinely
   stuck no longer look identical. If it does stop, **photograph the last few lines** — that names
   the failure instead of leaving another unfalsifiable spinner. `nomodeset` is also the default
   entry now, covering Sandy Bridge graphics as the other candidate cause.

---

## 🔴 WHICH MACHINE IS WHICH — settled by Jeff 2026-09-20 20:10

> *"Yes the Garage HP is coming into the kitchen and the lenovo will be the garage computer,
> that is why it is named garage computer."*

| machine | role | name |
|---|---|---|
| **Lenovo B570** — `192.168.1.173` | **THE GARAGE COMPUTER** (already built, on WiFi) | `GarageLaptop` |
| **HP TouchSmart 520** | **KITCHEN WALL command centre** (replaces the wall iPad; iPad moves beside the living-room thermostat) | **`KitchenPC`** |

⚠️ **THE FILENAMES AND THIS DOC'S TITLE ARE HISTORICAL.** `garage-hp-setup.sh` and
`GARAGE_PC_REPAIR_KIT.md` both still say *garage* because the READMEs and the stick reference
them by name. **The CONTENTS are correct; the filenames are not.** Do not rename them without
updating `E:\GARAGE-SETUP\READ-ME-FIRST.txt` in the same change.

🔴 **A DRAFT OF THE 09-20 UNATTENDED INSTALLER SET `hostname GaragePC` — caught by Jeff, not
by a test.** That would have put **two machines on the network claiming the garage identity**,
with the Lenovo already holding it. Fixed across `autoinstall.yaml` and `garage-hp-setup.sh`
(hostname, wsdd `-n`, netbios name, and the share `GarageHPFiles` → `KitchenPCFiles`).

⚠️ **AND THE RENAME ITSELF NEARLY SHIPPED A RE-RUN BUG:** the share block's idempotency guard
still read `grep -q '^\[GarageHPFiles\]'` while the heredoc wrote `[KitchenPCFiles]`, so the
block would have been **appended again on every run**. On the one machine whose entire history is
*"Jeff ran it twice"*. Guard and payload now both say `KitchenPCFiles`; verified `bash -n` clean,
0 CRLF.

---

## 🔴🔴 CORRECTED 2026-09-20 19:54 — THE BOOT LOOP IS THE CURRENT STATE

**Jeff, verbatim: *"The boot loop is the current state of the HP."***

⚠️ **Every file in this repo says the 09-01 boot loop was *"recovered with System Restore"*, and that
is WRONG.** The restore did not hold, or it regressed. The machine is boot-looping **right now**.
This file, `OPEN_ITEMS.md` #112 and `BEEHIVE_REFERENCE.md` all carried the healed version.

**What this changes, and what it does NOT:**
- ❌ **Windows cannot be used to rescue files** — it does not reach a desktop.
- ✅ **The DRIVE is fine.** The fault is Windows policy/boot, not the disk. Its files are still
  readable from a Linux live session (step B3) right up until the disk is erased.
- ✅ **It does not block the USB install at all.** The HP's boot menu (ESC → F9) is FIRMWARE-level
  and does not care that Windows is broken.
- ✅ It also settles the question of whether Windows is worth saving. It is out of support, and
  Jeff's own words in this file: *"I think it's time with windows is about over."*

🔑 **ROOT CAUSE, AND IT IS OURS — `SETUP-GARAGE.ps1` ran `secedit /configure /areas USER_RIGHTS`,
re-applying the whole policy block, and JEFF RAN IT TWICE.** Quarantined to
`DO-NOT-RUN/SETUP-GARAGE.ps1.BROKEN` with a `WHY.txt`.
🔴 **"Ran it twice" is the transferable lesson: a destructive, non-idempotent step that can execute
a SECOND time is the whole failure.** The 2026-09-20 unattended installer was built with that in
front of it and ends in `shutdown: poweroff`, NOT `reboot` — because a stick left in a USB-first
BIOS would otherwise re-run the installer and re-wipe the machine it had just built. Same machine,
same shape, one line apart.

---

## WHAT THE MACHINE IS, AND WHAT'S WRONG

| | |
|---|---|
| Hardware | **HP TouchSmart 520** all-in-one, **23-inch touchscreen**, Pentium **G620**, **500 GB spinning drive**, built ~2011 |
| Its addresses | **`.121` and `.212`** — both fail |
| ⚠️ NOT its address | **`.215` is the Fire TV.** A previous session pinged it, got three replies and nearly reported "GaragePC is back." A ping proves *something* answers, not *which* something. |
| Network state | **Absent from the BGW320 in every state.** The gateway retains powered-off clients ~4 weeks and `JeffsLapTop` sits in it right now reading *off, 17 days stale*. GaragePC is not there at all → it has not touched this gateway since **before 2026-08-14**. |
| In Home Assistant | `media_player.garagepc` = **unavailable** (confirmed again 2026-09-18) |
| Windows | Win10, **out of support since October**, and Jeff: *"The computer in the garage keeps looping on boot I think it's time with windows is about over"* |

---

## 🔴🔴 I WAS WRONG THIS MORNING — CORRECTED 2026-09-18 11:30 AM

**At 10:45 AM I wrote in this file that the stick did not exist and that step one had never been
done. Both statements were false.** Jeff plugged the stick in and the truth is the opposite: **the
entire kit was built on 2026-09-01 and it is thorough.**

What happened: I ran `Win32_LogicalDisk`, saw only C: and D:, and reported "no stick." **The stick
simply was not plugged in at that moment.** I checked an empty USB port and called it a missing
deliverable — which is exactly the *"an empty result is not evidence of absence"* trap this project
has a rule about. Leaving the error visible here rather than quietly deleting it.

**And the target is not Mint. It is Ubuntu.** Jeff's 09-01 words said *"switched over to the mint"*,
but what was actually built and what is on the stick is **Ubuntu 26.04 "Resolute Raccoon"**, release
amd64 20260423.1, read from `E:\.disk\info`.

### WHAT IS ACTUALLY ON THE STICK — drive E:, `UBUNTU 26_0`, 14.43 GB FAT32

| Path | Size | Written |
|---|---|---|
| A full bootable **Ubuntu 26.04** live image | 3.19 GB squashfs | 7/1/2026 |
| `GARAGE-SETUP\READ-ME-FIRST.txt` | 4.2 KB | **9/1/2026 1:40 PM** |
| `GARAGE-SETUP\setup.sh` | 4.1 KB | **9/1/2026 1:38 PM** |
| `GARAGE-SETUP\touchscreen\install-touchscreen.sh` | 7.7 KB | **9/1/2026 1:40 PM** |
| `GARAGE-SETUP\touchscreen\nwfermi-glorang.zip` | 251 KB | the touchscreen driver source |
| `GARAGE-SETUP\touchscreen\nwfermi-dmonad.zip` | 293 KB | second driver fork |
| `PRB350MA.CAP` (root of stick) | 16 MB | ⚠️ **the BEAST's motherboard BIOS from the Aug 2026 flash — do not delete without a copy elsewhere** |

---

# THE PROCEDURE — IT IS ALREADY WRITTEN, ON THE STICK

**Follow `E:\GARAGE-SETUP\READ-ME-FIRST.txt`.** It is better than what I wrote this morning, and it
was written by a session that had the machine's actual hardware in front of it. The short version:

1. **Boot the stick** — power on, tap **ESC** repeatedly, HP startup menu → **Boot Device Options
   (F9)** → the USB DISK 2.0 entry. *If the stick appears twice, pick the **NON-UEFI** one — it's a
   2011 machine.*
2. **Pick "Try Ubuntu", NOT Install.** Nothing touches the hard drive in that mode.
3. **🔴 TEST WIFI BEFORE INSTALLING.** Join `Loewen301`. **If WiFi does not work, STOP — do not
   install.** Shut down, Windows still boots, nothing is lost. *Escape hatch if it ever fails: plug
   your phone in by USB and turn on USB tethering — Linux needs no driver for that, so you can never
   be stranded.*
4. **Rescue your files** — `Users/Jeff Loewen Office 2/` → Documents, Desktop, Pictures, Downloads.
   Hunt the genealogy files (`.rmgc`, `.rmtree`, `.ged`) you looked for on 09-01 and never found.
   Reach the Beast from Files with **Ctrl+L** → `smb://301server/OneDrive`.
   **Once you install, anything left on that drive is gone.**
5. **Install** — tick **"Install third-party software"**, choose *Erase disk and install Ubuntu*,
   and **remember the password you set — SSH needs it.** Budget 20–30 minutes on a 2011 CPU and a
   spinning drive. *"Start it and come inside. Do not stand in a 94-degree garage."*
6. **Run the setup script** — `bash /media/$USER/*/GARAGE-SETUP/setup.sh`

### What `setup.sh` does — I read it line by line before vouching for it
- Checks it can reach the Beast at **192.168.1.194**, and prints the WiFi hardware the kernel sees
- **Installs `openssh-server` and enables it at boot** ← this is the handoff; after this I can work
  on the machine from the Beast
- Installs `curl wget git htop cifs-utils avahi-daemon`
- Prints the machine's **IP, hostname and SSH user**, and the exact `ssh` command to reach it
- Safe to re-run

**Then tell me that IP and I take it from there — kiosk, dashboard, HA integration, all remote.**
You should not have to go back out to the garage.

### ⚠️ One inconsistency on the stick, flagged not fixed
`setup.sh` (13:38) says the touchscreen driver *"was last confirmed on Mint 20.1 and is unlikely to
build"*. `READ-ME-FIRST.txt` (13:40, two minutes later) **corrects that**: the glorang fork included
on the stick *"is maintained for Ubuntu 24.04 and later. Corrected 2026-09-01."*
**The readme is newer and wins.** Try the touchscreen script; if it fights after one reboot, stop,
use a wireless keyboard and mouse, and tell me.

## AFTER THE INSTALL — stop the address going stale
Give it a **DHCP reservation on the BGW320**, the same as Beehive has. `OPEN_ITEMS` #112 asks for
this in its own words: *"give it a DHCP reservation like Beehive's, because its recorded addresses
go stale every time."* Two different addresses for this machine are already recorded in the files
and neither is reliable — that stops today.

---

## WHAT IT BECOMES ONCE IT'S RUNNING

It is a **23-inch touchscreen all-in-one**, which is the single most useful thing in the spare-
hardware pile. Candidate jobs, all $0:

- 🥇 **Wall-mounted house dashboard / family hearth** — see
  `docs/automation/COOL_AUTOMATIONS_2026-09-18.md` #10. Photos, the station's live conditions, and
  "On This Day" from the family tree.
- **Garage shop display** — weather, radar, the A/C card, and the garage temperature now that the
  7-inch run is going in.
- It already has the **Delam XLR mic** and the **KESU 500 GB drive** assigned to it in the inventory.

---

## WHAT I CANNOT DO, AND IT IS EXACTLY ONE THING

`ACCESS_MAP.md` §7b lists only five genuine blockers on this whole project. This is number three:
**"A machine that is powered off or off the network."**

I can build the stick. I can write every command. I cannot press the power button or pick "Try
Linux Mint" from a menu — that needs hands on the machine, and they're yours.

**One word from you and I'll download the ISO and build the stick today.**
