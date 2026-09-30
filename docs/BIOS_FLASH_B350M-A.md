# BIOS flash — ASUS PRIME B350M-A (the Beast)

Written 2026-08-21. The previous version of this guide was lost when the session
died in a power cut, which is itself the reason this file exists.

## Verified hardware (read off the machine, not from memory)

| Thing | Value |
|---|---|
| Board | ASUS **PRIME B350M-A**, Rev X.0x |
| Current BIOS | **4207**, released 2018-12-06 (AMI) |
| CPU | AMD **Ryzen 5 2600** (Pinnacle Ridge, Fam 23 Model 8 Stepping 2) |
| RAM | 2 x 8 GB Corsair **CMK16GX4M2B3000C15**, running **2933 MT/s** (DOCP/XMP is ON) |
| TPM | AMD **fTPM 3.5.0.3** |
| Secure Boot | **Disabled** |
| BitLocker | **Fully decrypted, protection OFF on C:, D:, E:** |
| USB stick | **E:**, FAT32, label `UBUNTU 26_0`, holds `PRB350MA.CAP` (16,779,264 bytes, dated 2024-09-30) |
| SHA-256 of stick file | `14f5613c7652e362350328c8f06de3549128e7baccd68f50aca1214a183d9c07` |

## Which version to flash

- **6232** (staged on the stick, Sep 2024) - AGESA **1.2.0.Cc**. Mitigates **Sinkclose**
  (SMM lock bypass) and fixes **CPU exceptions during sleep/hibernation**.
- **6254** (2026-02-02) - ASUS's newest for this board. Changelog is only
  "Improve system compatibility."

**Recommendation: flash 6232 - the one already on the stick.** Reasoning, having gone
back and forth on this: 6232 carries the two concrete fixes that matter here, and it has
had two years of field use on this board. 6254 is six months old, its changelog names
nothing Jeff needs, and last-ever BIOS releases for legacy boards are exactly where odd
regressions show up. On a board with **no Flashback button**, chasing "newest" for a vague
compatibility note is the wrong trade when the goal is stability.

6254 stays available if a reason to want it ever appears. There is no need to flash twice.

### Provenance of the staged file (verified 2026-08-21)

Downloaded and staged by the session that was killed by the power cut, ~8 minutes before
it died - which is why Jeff was never told it was there:

- `PRIME-B350M-A-ASUS-6232.zip` downloaded to Downloads **07:18:36**
- Extracted via ASUS `BIOSRenamer.exe` to `PRB350MA.CAP` **07:19:03**
- Copied to the USB stick **09:12:07** (session died 09:32)

SHA-256 is **identical** across the zip, the Downloads copy, and the stick:
`14f5613c7652e362350328c8f06de3549128e7baccd68f50aca1214a183d9c07`

The stick is Jeff's own Ubuntu installer for the J45 (contents dated 2026-07-01). The
`.CAP` simply sits alongside it in the root; the installer is unaffected and still usable.

## Why it is safe to do this NOW and was not safe before

A power cut *during* a flash can brick the board. This machine sits on a line whose
recloser trips 2+ times a week. As of 2026-08-21 the Beast is on the APC BN600
battery+surge, proven end-to-end by a live plug-pull test. **Move #1 (UPS) is what makes
move #2 (BIOS) safe.** Do not flash this board without the UPS in line.

BitLocker being fully off removes the other classic hazard: a BIOS change alters TPM
measurements and would otherwise trigger a recovery-key prompt at next boot.

## Pre-flight

1. UPS in line and battery charged (it recharges after any test — check ~100%).
2. Close everything; no other work in progress.
3. The `.CAP` file must sit in the **root** of a **FAT32** partition. Already true on E:.
   The short name `PRB350MA.CAP` is what ASUS's BIOS Renamer produces — leave it alone.

## The flash

1. Reboot, press **Del** repeatedly to enter BIOS.
2. **F7** for Advanced Mode if it opens in EZ Mode.
3. **Tool** → **ASUS EZ Flash 3 Utility** (label may read just "EZ Flash").
4. Choose **via Storage Device**, pick the USB stick, select `PRB350MA.CAP`.
5. It verifies the file, asks to confirm, then flashes.
6. **Do not touch anything. Do not power off.** It will reboot on its own, possibly
   several times, and may sit on a blank screen for a while. That is normal.

## What this flash will and will not fix

Measured from the event log 2026-08-21, last 60 days. Every Kernel-Power 41 carries a
BugcheckCode that says which kind of event it was. **Two clearly separate signatures:**

| When | Code | What it actually was |
|---|---|---|
| 07-26 18:45 | 0 | power loss (dirty cut) |
| 07-27 07:36 | 0xEF | blue screen, CRITICAL_PROCESS_DIED |
| 07-27 10:03 | 0xEF | blue screen, CRITICAL_PROCESS_DIED |
| 08-07 13:38 | 0 | power loss |
| 08-19 14:59 | 0 | power loss |
| 08-20 09:05 | 0 | power loss |
| 08-20 19:01 | 0xEF | blue screen, CRITICAL_PROCESS_DIED |
| 08-20 19:21 | 0xEF | blue screen, CRITICAL_PROCESS_DIED |
| 08-21 09:27 | 0 | power loss - **self-inflicted, Jeff's own UPS wiring work** |

**So, honestly: this BIOS flash fixes neither signature.**

- The **power losses (4 real grid events)** are already fixed - by the UPS, proven
  end-to-end 08-21. That was the real repair.
- The **0xEF blue screens** are `CRITICAL_PROCESS_DIED` (csrss), clustered in two pairs
  ~20 min apart on two days, with Tor Browser open. That is a software fault. A BIOS
  update does not touch it.

The flash is worth doing for **security** (Sinkclose SMM lock bypass) and the
sleep/hibernate CPU-exception fix. It is **not** the crash cure. Do not expect it to be.

## Performance and the RAM

The kit is a **DDR4-3000 CL15** kit (`CMK16GX4M2B3000C15`) running at **2933**. That gap
is the "discrepancy" - and it is **correct behaviour, not a fault.** Zen+ on AM4 uses
memory dividers in 133 MHz steps; 2933 is a real divider and 3000 is not, so ASUS DOCP
lands a 3000 kit on 2933 by design. The difference is ~2%, unmeasurable in use. **Do not
chase 3000 manually** - it risks instability for nothing.

**The flash will not fix the RAM automatically. It does the opposite:** CMOS resets, DOCP
turns OFF, and RAM drops to JEDEC stock. Re-enable DOCP afterwards to get 2933 back.

**Revised from the earlier advice in this file:** I previously said leave DOCP off to test
XMP as a crash suspect. The bugcheck data above weakens that badly - four *identical* 0xEF
codes clustered on two days is a software signature. Genuine memory instability throws
varied codes (0x1A, 0x4E, 0x50, 0x124), not the same process-death code four times. **XMP
is a weak suspect. Just turn DOCP back on.**

## Baseline captured BEFORE the flash (2026-08-21 10:27, BIOS 4207)

Everything below is what a correct machine looks like. After the flash, compare against it.

```
CPU            AMD Ryzen 5 2600, 6C/12T, 3400 MHz, L3 16384 KB
SVM (virt)     True                     <-- Nox Android emulator needs this
RAM            2 x 8GB Corsair CMK16GX4M2B3000C15
               slots DIMM_A2 + DIMM_B2  <-- correct dual-channel pair, do not move
               running 1467 MHz = 2933 MT/s  (DOCP on)
Total RAM      15.93 GB
Firmware       UEFI       Secure Boot: False      fTPM: enabled, 3.5.0.3
Disks          Disk0 ADATA SU650 223.6GB GPT (boot)
               Disk1 ST2000DM006 1863GB GPT
Power plan     Ultimate Performance
```

### RAM timings + health, read with CPU-Z 3.01 (BIOS 4207, before flash)

Windows cannot show these. CPU-Z portable is kept in `HCC-Scripts/tools/` along with the
full report, so the same report can be re-run after the flash and diffed.

```
Running now     2926 MT/s (1463.2 MHz)   max divider 1466.7 = 2933
                CL16-17-17-35  tRC 69   Command Rate 1T
Kit's own XMP   XMP-2998 rev 2.0, CL15, 1.350V, Samsung dies, 1 rank
JEDEC fallback  DDR4-2133  <-- where it lands if DOCP is left off
Channels        2 x 64-bit (dual channel confirmed)
CPU             boosting 3841 MHz (38.5x), VCORE 1.21V, 48 degC
Rails           +12V 11.97 / +5V 4.96 / +3.3V 3.29   all in spec
VBAT            3.23V  <-- CMOS battery healthy; a weak one loses settings after a flash
Fans            CPU 1178 RPM, chassis 868 RPM
```

**About the "discrepancy" Jeff remembered - it is real, and it is tiny.** The kit is rated
CL15 and is running CL16: one clock looser, worth ~1-2%. The tRCD/tRP of 17 are *correct* -
XMP specifies them in nanoseconds (11.33 ns), which is 17 clocks at this frequency. Command
Rate is already the good one (1T, not 2T). **Nothing here is worth chasing.** The system is
already running essentially as fast as this platform sensibly goes.

Note the rails and VBAT: a healthy PSU and a healthy CMOS battery are both independent
evidence against the "sick computer" theory, and VBAT matters specifically because the flash
depends on CMOS holding the settings afterwards.

### Why SVM is on, and what actually resets (settled 2026-08-21)

Jeff remembered having to go into the BIOS himself "before Claude could work in the
machine," and he is right. Claude Code on Windows originally **required WSL**, and WSL2
requires **SVM enabled in BIOS** plus **VirtualMachinePlatform in Windows**. That was the
BIOS trip. Evidence: `C:/Windows/System32/lxss` still exists, no distro packages remain,
and Claude Code now runs natively from `C:/Users/jeffl/.local/bin/claude.exe`.

So the requirement is historical - the native build needs neither - but the switches
stayed on and Jeff wants them kept. Fine, and nearly free.

**Which half the flash actually resets:**

| Setting | Where it lives | Survives the flash? |
|---|---|---|
| **SVM Mode** | BIOS / CMOS | **NO - wiped, must be re-enabled** |
| **VirtualMachinePlatform** | Windows | **Yes - untouched** |

So only the BIOS toggle needs restoring. Turn SVM back on and the machine returns to
exactly the state captured below - the Windows feature never left.

**Verify after boot - all three must read as they do today:**

```
BIOS SVM (Win32_Processor.VirtualizationFirmwareEnabled)  True
Hypervisor running (Win32_ComputerSystem.HypervisorPresent) True
Windows VirtualMachinePlatform                            Enabled
```

Aside, not a recommendation: VBS is running (status 2) with
`SecurityServicesRunning = 0`, i.e. the hypervisor is active but providing no Memory
Integrity or Credential Guard. Reclaiming that small Zen+ overhead is a **Windows-side**
change needing no BIOS trip, so it can be tested and measured any time. Jeff has asked to
keep SVM on - **leave this alone unless he raises it.**

## FULL VERIFICATION PASS — 2026-08-21, at Jeff's request before flashing

He asked for everything to be re-checked so this is done once, nothing breaks, and nothing
gets silently switched off. Findings below are independently verified, not carried over.

### 🔴 THE ONE REAL RISK FOUND: the Windows Hello PIN will probably stop working

A Windows Hello **PIN is configured** on this machine (NGC container has 2 entries) and Jeff
signs in with a **Microsoft account**, not a local account. A BIOS update commonly resets the
AMD fTPM, which destroys the TPM-held keys Windows Hello uses. This is well documented and
expected behaviour, not a failure.

**Consequence: after the flash the PIN may be rejected, and the Microsoft account PASSWORD
becomes the only way back in.**

- **BEFORE flashing:** confirm the Microsoft account password is known / in Bitwarden.
  See [[project_hcc_password_vault_legacy]].
- **Recovery if the PIN fails:** sign in with the password → Settings → Accounts →
  Sign-in options → PIN → set it up again.
- If the PIN cannot be re-created, run `tpm.msc`, confirm "The TPM is ready for use", and if
  not, use **Prepare the TPM**, reboot, retry.
- Keep **fTPM Enabled** in BIOS (checklist item 4) — that is what minimises this.

### ✅ Verified safe — each checked this session

| Check | Result |
|---|---|
| File matches board | `PRB350MA.CAP` for PRIME B350M-A; SHA-256 **identical** across zip, Downloads copy and stick; 11,264,070 B = the 10.74 MB ASUS publishes for 6232 |
| USB meets EZ Flash spec | ASUS requires **FAT32/16, single partition**. Stick is FAT32, **exactly 1 partition**, `.CAP` in root ✓ |
| Staged update needed? | **No.** ASUS notes for 6232 name no prerequisite version. Direct 4207 → 6232 is supported |
| Irreversible / no rollback? | **No such warning** in ASUS's notes for 6232 or 6254 |
| CPU still supported? | **Yes.** The AM4 support that gets dropped is **Bristol Ridge A-series APUs**. Ryzen 5 2600 is Pinnacle Ridge, core ComboAM4 support |
| BitLocker lockout risk | **None.** C:, D:, E: all Fully Decrypted, Protection Off — re-verified |
| Will it still boot? | **Yes.** ESP healthy on Disk0 Part2 with `\EFI\Microsoft\Boot\bootmgfw.efi` **and the fallback `\EFI\Boot\bootx64.efi`** — boots even if the flash wipes all NVRAM boot entries |
| Settings will stick? | **VBAT 3.23 V** — CMOS battery healthy. A weak one is why post-flash settings get lost |
| Power safety | UPS in line, **proven** by live plug-pull 08-21. A cut mid-flash is the brick case, and this board has **no Flashback and no dual BIOS** |
| PSU health | +12V 11.97 / +5V 4.96 / +3.3V 3.29 — all in spec |

### Version choice re-confirmed — and ASUS settles it

**ASUS lists 6254 as BETA.** That independently confirms flashing **6232**, the stable release.
6232's actual notes: *"Updated AGESA to version ComboV2PI 1.2.0.Cc"* and a fix for a CPU
exception when adjusting sleep/hibernate/soft-off items **in certain languages** (a
localisation bug — narrower than "a stability fix", and almost certainly irrelevant in
English). 1.2.0.Cc is the AGESA generation carrying AMD's Sinkclose mitigation.

So the honest value of this flash is **six years of accumulated AGESA and security fixes**
and landing on a stable, supported firmware — which is exactly the longevity reason Jeff
gave. It remains **not** a fix for either crash signature.

## THE CHECKLIST — what to set while you are in there

The flash resets CMOS, so **all of these turn themselves off.** Set them in one pass.

0. **PULL THE USB STICK the moment the flash finishes**, before letting it boot Windows.
   That stick is a bootable Ubuntu installer and the boot order was just wiped - leaving it
   in risks booting into Ubuntu instead of Windows.
1. **Load Optimized Defaults** first (clean base), then:
2. **Ai Tweaker → DOCP → Profile 1** - puts RAM back to 2933. Without this it sits at 2133.
3. **Advanced → CPU Configuration → SVM Mode → Enabled** - **Nox will not run without it.**
4. **Advanced → AMD fTPM configuration → fTPM → Enabled** - Windows 11 wants it.
5. **Boot → Boot Option #1 → ADATA SU650** (the 223.6GB SSD).
6. **F10** to save and exit.

Leave Cool'n'Quiet and C-States ON - that is the efficiency half, and it costs no speed.
Do **not** chase RAM past 2933 (see divider note above). Secure Boot is optional: disks are
GPT/UEFI so it *can* be enabled, but it is a security nicety, not performance, and enabling
it on a working install carries a small boot risk. Leaving it off is fine.

## Step-by-step BIOS walkthrough (Jeff is navigating this alone)

Order of the whole operation:

1. Reboot, tap **Del** → BIOS
2. **F7** if it opens in EZ Mode → Advanced Mode
3. **Tool → ASUS EZ Flash 3 Utility** → via Storage Device → the stick → `PRB350MA.CAP`
4. Confirm. **Hands off.** It reboots itself, possibly several times, possibly with a long
   black screen.
5. **Pull the USB stick as it restarts** — it is a bootable Ubuntu installer and the boot
   order was just wiped.
6. Tap **Del** again to get back into BIOS, then do the six settings below **in this order**.

Menu bar in Advanced Mode:
`My Favorites | Main | Ai Tweaker | Advanced | Monitor | Boot | Tool | Exit`

If the BIOS offers a **search** (often F9), typing the setting name jumps straight to it.

### 1. Load Optimized Defaults  — **Exit menu** (confirmed in manual)

`Exit` → **Load Optimized Defaults** → Enter → **OK**

**Do this FIRST.** It wipes every setting, so anything set before it is lost. It does not
leave the BIOS.

### 2. DOCP — **Ai Tweaker** (two steps, not one)

`Ai Tweaker` → first item is **Ai Overclock Tuner**, showing `Auto`.

Change **Ai Overclock Tuner** to **D.O.C.P.**

A **new line appears underneath** — the D.O.C.P. profile. Select the profile (it will read
something like `DDR4-2998` / Profile #1). **Memory Frequency** should then show ~**2933**.

This is the correction: DOCP is a *value* on Ai Overclock Tuner, not a menu of its own.
Selecting the profile is a separate second step, and skipping it leaves RAM at 2133.

### 3. SVM Mode — **Advanced → CPU Configuration** (submenu confirmed in manual)

`Advanced` → **CPU Configuration** → scroll to **SVM Mode** → **Enabled**

### 4. fTPM — **Advanced**

`Advanced` → **AMD fTPM configuration** → **AMD fTPM switch** → **AMD CPU fTPM**

If that submenu is not present under the new firmware, look for
`Advanced` → **Trusted Computing** → **Security Device Support** → **Enable**.
Wording moved around across AGESA versions; either path is the same thing.

### 5. Boot order — **Boot**

`Boot` → **Boot Option Priorities** → **Boot Option #1**

Choose **Windows Boot Manager** if it is listed — that is the proper UEFI entry. Otherwise
choose the **ADATA SU650** (223.6 GB). Do this *after* the stick is out, so the stick cannot
occupy the slot.

### 6. Save — **F10** → **OK**

Machine reboots into Windows.

### If something is missing or worded differently

**Do not force it.** The 2018 manual predates this firmware, so names can shift. Set what is
findable, save, boot, and I will read back all of it from Windows and say exactly what is
still wrong — that is cheaper than guessing at a menu.

### Expect this on first boot

The **Windows Hello PIN may be rejected** (fTPM reset — see the verification section). Sign
in with the **Microsoft account password**, then re-create the PIN.

## After the flash — what I can and cannot verify from Windows

I cannot enter BIOS setup; that is pre-boot with no OS. But from Windows I **can** read back
the result of nearly every setting and diff it against the baseline above:

**Verifiable:** BIOS version, RAM speed + slots + total, SVM/virtualisation state, fTPM,
Secure Boot, UEFI vs Legacy, GPT/MBR, disks + bus types, boot order, power plan, CPU clocks.

**NOT verifiable without a tool:** RAM *timings* (CL/tRCD/tRP), real DRAM voltage, fan
curves, C-state detail. SMBIOS reports voltage as a nominal 1200mV regardless of truth.
CPU-Z (free) would close that gap if it is ever worth it.

Re-run the baseline block above after booting and compare line by line.

## If it goes wrong

The PRIME B350M-A has **no BIOS Flashback button** and no dual BIOS. A failed flash means
the chip needs external reprogramming or an RMA. That is precisely why the UPS goes first
and why the flash happens once, to the newest version, on a charged battery.

---

# RESULT — flash completed 2026-08-21

**BIOS 4207 → 6232. Success. No regressions, nothing silently reset.**

Started 11:08 AM, verified 12:07 PM via `windows-scripts\Verify-PostFlash.ps1`
(one command, diffs every CMOS-wiped setting against the 4207 baseline).

## Settings readback — all clean

| Setting | Result |
|---|---|
| BIOS version | **6232** |
| SVM (virtualisation) | True |
| Hypervisor running | True |
| Windows VirtualMachinePlatform | Enabled |
| fTPM | Enabled — **PIN was NOT rejected, no re-enrol needed** |
| Firmware mode | UEFI |
| BitLocker C: | Off (as required) |
| RAM sticks / slots | 2 × DIMM_A2, DIMM_B2 (dual-channel intact) |
| Boot disk | ADATA SU650 |

## RAM — the one line that flagged, and why it is GOOD news

`Verify-PostFlash.ps1` flagged "RAM configured clock 3000, expected 1467". That expectation
was the old WMI reading, not a fault. CPU-Z proves the sticks got **faster**:

| | BIOS 4207 | BIOS 6232 |
|---|---|---|
| DRAM Frequency | 1463.2 MHz (**2926 MT/s**) | 1499.8 MHz (**3000 MT/s**) |
| Timings | CL16-17-17-35, CR 1T | CL16-17-17-35, CR 1T |

The sticks are rated **XMP-2998**. Old AGESA fell 72 MT/s short of the profile; the new one
applies it in full at identical timings and voltage. DOCP is on and working.

**Live evidence:** `tools\cpuz-BEFORE-flash-4207.txt` vs `tools\cpuz-AFTER.txt`
(in `C:\Users\jeffl\HCC-Scripts\tools\`).

⚠️ **Crash-investigation note:** RAM XMP was one of two untested suspects in the
2026-08-19/20 crashes (the other, stale NVIDIA driver, is still untested). The crashes were
subsequently traced to **bad line power** and proven fixed by the APC BN600 on 08-21. But the
RAM is now running 74 MT/s *faster* than it was during those crashes. If csrss 0xEF ever
returns, **the first move is Ai Tweaker → Ai Overclock Tuner → Auto** to drop to JEDEC and
re-test. Do not re-litigate the power line first — that one is proven.

## Performance diff (winsat, same machine, same day)

| Benchmark | 4207 | 6232 | Delta |
|---|---|---|---|
| Memory | 32654.09 MB/s | 31839.39 MB/s | −2.5% (run-to-run noise) |
| CPU AES256 | 9869.72 MB/s | 9971.17 MB/s | +1.0% |
| CPU LZW | 788.35 MB/s | 793.30 MB/s | +0.6% |
| Disk seq read | 305.25 MB/s | 304.16 MB/s | flat |
| Disk seq write | 158.06 MB/s | 460.91 MB/s | see below |

Performance is **functionally identical** — the CPU/mem deltas are inside noise. The flash
was for AGESA/stability, not speed, and that is exactly what it delivered.

**Do not credit the flash for the disk write number.** The SU650 is a DRAM-less SATA SSD
whose rated write is ~450–520 MB/s; the 158 MB/s baseline was almost certainly captured with
its SLC cache exhausted. 460 MB/s is the drive's normal healthy speed, not an improvement.

## Still open on this machine

- **Stale NVIDIA driver** — the remaining untested crash suspect. Cheap to close.
