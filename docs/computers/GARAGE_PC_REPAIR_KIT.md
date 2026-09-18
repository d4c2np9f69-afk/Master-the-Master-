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

## THE DECISION — ALREADY MADE, NOT A NEW PROPOSAL

**Jeff, 2026-09-01 01:31 PM CT, verbatim:**
> *"I put that stick in the Beast check it and make sure I have everything I need for the Garage
> computer on there and the tell me step-by-step what I need to do on the garage computer to get it
> switched over to the mint"*

So the target is **Linux Mint**, and it was decided over two weeks ago.

## 🔴 WHAT I FOUND WHEN I WENT LOOKING FOR THAT STICK — 2026-09-18 10:45 AM

**It does not exist.** Measured, not assumed:
- `Win32_LogicalDisk` shows only **C: (222 GB)** and **D: (1863 GB)**, both DriveType 3 = fixed
  disks. **No removable drive is plugged into the Beast.**
- **No Linux Mint ISO anywhere on C: or D:.** The only `.iso` on the machine is
  `Win11_25H2_English_x64_v2.iso`, dated 7/17/2026.
- **No USB-writing tool installed** (searched Program Files, Program Files (x86), Downloads and
  Desktop).

**So step one of a job Jeff asked for on 09-01 was never done.** That is the honest starting point.

---

## WHICH MINT — verified 2026-09-18, not from memory

**Linux Mint 22.x, the XFCE edition.**

| | Cinnamon | **XFCE** |
|---|---|---|
| RAM minimum | 2 GB | **1 GB** |
| RAM recommended | 4 GB | **2 GB** |

XFCE is the lighter desktop and the one recommended for older machines. Mint 22.x needs a **64-bit
processor** — the G620 is Sandy Bridge and 64-bit, so it qualifies. Mint 22.1 "Xia" is LTS,
**supported to 2029**.
⚠️ **Check how much RAM that machine actually has before ordering the edition** — the record does
not say, and I am not guessing at it.
Sources: [Linux Mint 22 specs](https://invgate.com/itdb/linux-mint-22) ·
[Mint 22.1 LTS to 2029](https://linuxsecurity.com/news/vendors-products/linux-mint-22-1-xia-stability-security) ·
[XFCE requirements thread](https://forums.linuxmint.com/viewtopic.php?t=265102)

---

# THE PROCEDURE

## STEP 0 — what you need in hand
- A **USB stick, 8 GB or bigger**, that can be wiped
- The **Mint XFCE ISO** — about 3 GB, downloaded on the Beast (**I can do this — just say go**)
- A **USB writer**. Mint's own installation guide says: *"Download Etcher, install it and run it.
  Click Select image and select your ISO file. Click Select drive and select your USB stick. Click
  Flash!"* Rufus is the other standard choice on Windows and works fine.
  [Mint's official "Create the bootable media"](https://linuxmint-installation-guide.readthedocs.io/en/latest/burn.html)

## STEP 1 — build the stick (on the Beast, ~20 minutes mostly waiting)
Download ISO → open the writer → select ISO → select the USB stick → Flash. That's it.
🔴 **It erases the stick completely.** Make sure there's nothing on it you want.

## STEP 2 — 🔴 RESCUE THE FILES *BEFORE* YOU INSTALL ANYTHING

**This is the step that cannot be undone if you skip it.** That drive has been in that machine since
roughly 2011. You think everything moved to the Beast during the file transfer — *think*, not know.
Once Mint installs, anything still on there is gone permanently.

1. Boot the garage PC from the USB
2. Pick **"Try Linux Mint"** — ⚠️ **NOT "Install"**. Live mode runs entirely off the stick and
   touches the hard drive not at all.
3. From that desktop, open the Windows drive and actually look in
   **`Users\Jeff Loewen Office 2\`** — Documents, Desktop, Pictures, Downloads
4. **Specifically hunt for genealogy files: `.rmgc`, `.rmtree`, `.ged`** — the RootsMagic file you
   went looking for on 09-01 and never found may be sitting right there
5. Also worth a look: scanned documents, tax files, old photos
6. Copy anything worth keeping **straight to the Beast over the network** — that direction works,
   and Mint mounts `\\301SERVER\OneDrive` natively

## STEP 3 — install
From the **same live session**, click **Install Linux Mint**. Same stick, same trip, five extra
minutes. You are not doing this twice.

## STEP 4 — put it back on the network
Join **`Loewen301`** (the household SSID — *not* the factory SSID on the gateway label, and **not**
`Loewen301_Ext`, which no longer exists and is what started this whole mess).

## STEP 5 — 🔑 GIVE ME A WAY IN, PERMANENTLY

Jeff, 2026-09-18: *"on the network it needs to be built so that you can go into all of them as
needed to work on them."*

On Mint this is two commands and it's built in — no extra software, no cost:

```bash
sudo apt install openssh-server
sudo systemctl enable --now ssh
```

That is the whole thing. From then on I can reach that machine from the Beast to work on it, the
way I reach everything else. **See `NETWORK_PLAN.md` for how this fits the other machines** and for
the key-based login that replaces typing a password.

## STEP 6 — stop the address going stale
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
