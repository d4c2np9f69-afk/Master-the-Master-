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
