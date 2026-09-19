# Freeze watcher for the Acer. RUNS ON THE BEAST, polling outward.
#
# Why this shape: the first attempt had the ACER push a heartbeat onto a Beast
# share. That fought SMB the whole way - the OneDrive share is Everyone:READ, a
# new writable share still came back "Access is denied" because the Acer's
# session to the Beast is not a Guest session, and Windows allows only one
# credential set per server per session. None of that is necessary. The Beast is
# the always-on machine and already has passwordless SSH to the Acer, so it can
# simply poll. No share, no guest auth, no permissions to maintain.
#
# The last successful sample before a gap IS the freeze time, to the minute.
# disk_queue is the interesting column: a SATA/Crucial hang shows as the queue
# climbing and never draining in the samples just before death.
#
# Run: powershell -File Watch-Acer.ps1            (foreground, Ctrl+C to stop)
#      or register it as a task - see the bottom of this file.
param(
    [string]$Target   = '192.168.1.176',
    [string]$User     = 'jeffl',
    [int]   $EverySec = 60,
    [string]$LogDir   = 'C:\HCC-Heartbeat'
)
$ErrorActionPreference = 'SilentlyContinue'

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
$log = Join-Path $LogDir ("acer-watch-{0}.csv" -f (Get-Date -Format 'yyyyMMdd'))
if (-not (Test-Path $log)) {
    'timestamp,reachable,uptime_min,cpu_pct,mem_free_mb,disk_queue,drive_temp_c' | Set-Content $log -Encoding ASCII
}

# one-line probe run on the Acer; kept quote-free so nothing gets mangled over ssh
$probe = 'powershell -NoProfile -ExecutionPolicy Bypass -File C:\HCC\probe.ps1'

Write-Output "watching $Target every ${EverySec}s -> $log"
Write-Output "the last row before a gap is the freeze time. Ctrl+C to stop."

while ($true) {
    $now  = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $ping = Test-Connection -ComputerName $Target -Count 1 -Quiet -EA SilentlyContinue

    if ($ping) {
        $out = & ssh -o ConnectTimeout=10 -o BatchMode=yes "$User@$Target" $probe 2>$null
        if ($out) { "$now,1,$out" | Add-Content $log -Encoding ASCII }
        else      { "$now,1,,,,," | Add-Content $log -Encoding ASCII }   # pings but no shell
    } else {
        "$now,0,,,,," | Add-Content $log -Encoding ASCII
        Write-Output "  $now  UNREACHABLE  <-- freeze window starts here"
    }
    Start-Sleep -Seconds $EverySec
}

<#
THE PROBE, deployed to the Acer at C:\HCC\probe.ps1 - emits one CSV fragment:
    $os=Get-CimInstance Win32_OperatingSystem
    $q=(Get-Counter '\PhysicalDisk(_Total)\Current Disk Queue Length').CounterSamples[0].CookedValue
    $t=''; Get-PhysicalDisk | %{ $r=Get-StorageReliabilityCounter -PhysicalDisk $_; if($r.Temperature){$t=$r.Temperature} }
    '{0},{1},{2},{3},{4}' -f [math]::Round(((Get-Date)-$os.LastBootUpTime).TotalMinutes,1),
        (Get-CimInstance Win32_Processor).LoadPercentage,
        [math]::Round($os.FreePhysicalMemory/1KB,0), $q, $t

REGISTER ON THE BEAST so it survives a reboot:
  $a = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File C:\Users\jeffl\Documents\GitHub\master-the-master-\windows-scripts\Watch-Acer.ps1'
  $t = New-ScheduledTaskTrigger -AtStartup
  Register-ScheduledTask -TaskName 'HCC-WatchAcer' -Action $a -Trigger $t -RunLevel Highest -Force

READ AFTER A FREEZE:
  Import-Csv C:\HCC-Heartbeat\acer-watch-<date>.csv | Select-Object -Last 20
#>
