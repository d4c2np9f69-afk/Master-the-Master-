# WHY THIS EXISTS
# The Acer froze again at 05:05-05:23 on 2026-09-19 and the exact minute is
# unknown, because the existing HCC-Heartbeat writes to C:\HCC\ on the ACER --
# a disk nobody can read while the machine is hung. A freeze that hangs the
# drive also kills the crash dump (that is the volmgr 161 signature), so the
# local machine cannot be trusted to record its own death.
#
# This writes the heartbeat OFF the machine, onto the Beast's share, every 60 s.
# The last line before the gap IS the freeze time, to the second, and it carries
# what the box was doing -- so the next freeze produces evidence instead of a
# 20-minute window.
#
# DEPLOY (run on the Beast once the Acer is reachable again):
#   scp windows-scripts\acer-network-heartbeat.ps1 jeffl@192.168.1.176:C:/HCC/heartbeat-net.ps1
#   then register the task below ON the Acer.
$ErrorActionPreference = 'SilentlyContinue'

$share = '\\192.168.1.194\OneDrive\HCC-Heartbeat'
if (-not (Test-Path $share)) { New-Item -ItemType Directory -Path $share -Force | Out-Null }
$log = Join-Path $share ("acer-{0}.csv" -f (Get-Date -Format 'yyyyMMdd'))

if (-not (Test-Path $log)) {
    'timestamp,uptime_min,cpu_pct,mem_free_mb,disk_queue,drive_temp_c,last_event' |
        Set-Content $log -Encoding ASCII
}

$os    = Get-CimInstance Win32_OperatingSystem
$up    = [math]::Round(((Get-Date) - $os.LastBootUpTime).TotalMinutes, 1)
$cpu   = (Get-CimInstance Win32_Processor).LoadPercentage
$free  = [math]::Round($os.FreePhysicalMemory / 1KB, 0)

# disk queue length is the interesting one: a Crucial/SATA hang shows as the
# queue climbing and never draining, in the samples just before the machine dies
$q = (Get-Counter '\PhysicalDisk(_Total)\Current Disk Queue Length' -EA SilentlyContinue).CounterSamples[0].CookedValue

$temp = ''
Get-PhysicalDisk | ForEach-Object {
    $r = Get-StorageReliabilityCounter -PhysicalDisk $_ -EA SilentlyContinue
    if ($r -and $r.Temperature) { $temp = $r.Temperature }
}

$lastEvt = (Get-WinEvent -LogName System -MaxEvents 1 -EA SilentlyContinue).ProviderName

'{0},{1},{2},{3},{4},{5},{6}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $up, $cpu, $free, $q, $temp, $lastEvt |
    Add-Content $log -Encoding ASCII

<#
REGISTER ON THE ACER (elevated), 60-second interval:

$a = New-ScheduledTaskAction -Execute 'powershell.exe' `
     -Argument '-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File C:\HCC\heartbeat-net.ps1'
$t = New-ScheduledTaskTrigger -Once -At (Get-Date) `
     -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration ([TimeSpan]::MaxValue)
$s = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
Register-ScheduledTask -TaskName 'HCC-NetHeartbeat' -Action $a -Trigger $t -Settings $s -RunLevel Highest -Force

READ IT AFTER THE NEXT FREEZE (on the Beast):
  Import-Csv "$env:USERPROFILE\OneDrive\HCC-Heartbeat\acer-<date>.csv" | Select-Object -Last 15
The last row before the gap is the freeze time. Watch disk_queue in the final rows.
#>
