# Runs ON the Acer, called over SSH by Watch-Acer.ps1 on the Beast.
# Emits ONE csv fragment: uptime_min,cpu_pct,mem_free_mb,disk_queue,drive_temp_c
$ErrorActionPreference='SilentlyContinue'
$os = Get-CimInstance Win32_OperatingSystem
$up = [math]::Round(((Get-Date) - $os.LastBootUpTime).TotalMinutes, 1)
$cpu = (Get-CimInstance Win32_Processor).LoadPercentage
$free = [math]::Round($os.FreePhysicalMemory / 1KB, 0)
$q = (Get-Counter '\PhysicalDisk(_Total)\Current Disk Queue Length' -EA SilentlyContinue).CounterSamples[0].CookedValue
$t = ''
Get-PhysicalDisk | ForEach-Object {
    $r = Get-StorageReliabilityCounter -PhysicalDisk $_ -EA SilentlyContinue
    if ($r -and $r.Temperature) { $t = $r.Temperature }
}
'{0},{1},{2},{3},{4}' -f $up, $cpu, $free, $q, $t
