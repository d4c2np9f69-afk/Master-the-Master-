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

## After the flash

- CMOS resets to defaults. Enter BIOS, **Load Optimized Defaults**, then re-apply:
  boot order, fan curves, and anything else custom.
- **Leave DOCP/XMP OFF at first.** RAM will drop from 2933 to JEDEC default. This is a
  free test of the one remaining untested crash suspect — XMP at 2933. Run a few days.
  If the machine is clean, XMP was never the problem and it can go back on; if it was
  already clean because of the UPS, that is the answer instead.
- Re-check: `Get-CimInstance Win32_BIOS` should report the new version.

## If it goes wrong

The PRIME B350M-A has **no BIOS Flashback button** and no dual BIOS. A failed flash means
the chip needs external reprogramming or an RMA. That is precisely why the UPS goes first
and why the flash happens once, to the newest version, on a charged battery.
