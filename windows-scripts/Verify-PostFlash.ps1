<#
.SYNOPSIS
    Post-BIOS-flash verification for the Beast (ASUS PRIME B350M-A).

.DESCRIPTION
    Reads back every setting the CMOS reset wipes and compares it to the baseline
    captured 2026-08-21 while still on BIOS 4207. Run this first thing after the
    flash - it answers "did it take, and did anything get silently turned off".

    Baselines live in C:\Users\jeffl\HCC-Scripts\tools\.
    Full context: docs\BIOS_FLASH_B350M-A.md
#>

$tools = 'C:\Users\jeffl\HCC-Scripts\tools'
$pass = @(); $fail = @(); $info = @()

function Check($name, $actual, $expected, $note) {
    $ok = "$actual" -eq "$expected"
    $line = '{0,-34} {1,-22} (expected {2})' -f $name, $actual, $expected
    if ($ok) { $script:pass += $line } else { $script:fail += ($line + $(if($note){"  --> $note"})) }
}

Write-Host "`n=== POST-FLASH VERIFICATION - Beast / PRIME B350M-A ===" -ForegroundColor Cyan
Write-Host "    baseline: BIOS 4207, captured 2026-08-21`n"

$bios = Get-CimInstance Win32_BIOS
Write-Host ("BIOS VERSION NOW : {0}   (was 4207, target 6232)" -f $bios.SMBIOSBIOSVersion) -ForegroundColor Yellow
if ($bios.SMBIOSBIOSVersion -eq '4207') {
    Write-Host "  *** STILL 4207 - THE FLASH DID NOT TAKE ***" -ForegroundColor Red
}

# --- the settings the CMOS reset wipes ---
$cpu = Get-CimInstance Win32_Processor
Check 'BIOS SVM (virtualisation)' $cpu.VirtualizationFirmwareEnabled 'True' 'Advanced > CPU Configuration > SVM Mode > Enabled'

$hv = (Get-CimInstance Win32_ComputerSystem).HypervisorPresent
Check 'Hypervisor running' $hv 'True' 'follows from SVM being on'

$vmp = (Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -EA SilentlyContinue).State
Check 'Windows VirtualMachinePlatform' $vmp 'Enabled' 'Windows-side, should survive the flash untouched'

$mem = Get-CimInstance Win32_PhysicalMemory
$speed = ($mem | Select-Object -First 1).ConfiguredClockSpeed
Check 'RAM configured clock (MHz)' $speed '1467' 'DOCP off? Ai Tweaker > Ai Overclock Tuner > D.O.C.P. THEN pick the profile line'
Check 'RAM stick count' ($mem | Measure-Object).Count '2' ''
$slots = ($mem | ForEach-Object { $_.DeviceLocator }) -join ','
Check 'RAM slots' $slots 'DIMM_A2,DIMM_B2' 'dual-channel pair - must not move'

try { $t = Get-Tpm; Check 'fTPM enabled' $t.TpmEnabled 'True' 'Advanced > AMD fTPM configuration (or Trusted Computing)' } catch { $info += 'TPM: could not read (needs elevation)' }

Check 'Firmware mode' $env:firmware_type 'UEFI' ''

$bl = (Get-BitLockerVolume -MountPoint C: -EA SilentlyContinue).ProtectionStatus
Check 'BitLocker C: (must stay Off)' $bl 'Off' ''

$boot = Get-Disk | Where-Object { $_.IsBoot } | Select-Object -First 1
Check 'Boot disk' $boot.FriendlyName 'ADATA SU650' 'Boot > Boot Option #1'

# --- report ---
Write-Host "`n--- PASS ---" -ForegroundColor Green
$pass | ForEach-Object { Write-Host "  $_" -ForegroundColor Green }
if ($fail.Count) {
    Write-Host "`n--- NEEDS ATTENTION ---" -ForegroundColor Red
    $fail | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
} else {
    Write-Host "`n  Everything matches the pre-flash baseline." -ForegroundColor Green
}
$info | ForEach-Object { Write-Host "  $_" -ForegroundColor DarkGray }

Write-Host "`n--- NEXT: performance diff ---" -ForegroundColor Cyan
Write-Host "  winsat mem      : baseline 32654.09 MB/s"
Write-Host "  winsat cpuformal: baseline AES 9869.72 / LZW 788.35 MB/s"
Write-Host "  winsat disk -drive c : baseline seq read 305.25 / write 158.06 MB/s"
Write-Host "  RAM timings     : $tools\cpuz_x64.exe -txt=$tools\cpuz-AFTER"
Write-Host "                    baseline was CL16-17-17-35, CR 1T, 2926 MT/s"
Write-Host "`n  Reminder: Windows Hello PIN may be rejected (fTPM reset). Sign in with the"
Write-Host "  Microsoft ACCOUNT PASSWORD, then Settings > Accounts > Sign-in options > PIN.`n"
