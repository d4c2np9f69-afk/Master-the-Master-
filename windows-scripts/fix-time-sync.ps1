# The Acer reported: Source = "Local CMOS Clock", Last Successful Sync = "unspecified".
# It is not syncing time with anything. It happens to be within 1 second of the
# Beast today, but a free-running CMOS clock drifts - and the ENTIRE freeze
# investigation is built on event-log timestamps (Kernel-Power 41, volmgr 161).
# A drifting clock would quietly corrupt that evidence.
#
# Run ON the target machine, elevated.
$ErrorActionPreference = 'Continue'
function L($a,$b){ Write-Output ("  {0,-34} {1}" -f $a,$b) }

Write-Output "=== before ==="
(w32tm /query /status 2>&1) | Where-Object { $_ -match 'Source|Last Successful' } | ForEach-Object { Write-Output "  $_" }

Write-Output ""
Write-Output "=== make sure the time service runs automatically ==="
Set-Service -Name w32time -StartupType Automatic -EA SilentlyContinue
Start-Service -Name w32time -EA SilentlyContinue
$svc = Get-Service w32time -EA SilentlyContinue
L 'w32time' "$($svc.Status) / $((Get-CimInstance Win32_Service -Filter "Name='w32time'").StartMode)"

Write-Output ""
Write-Output "=== point it at real NTP servers and resync ==="
w32tm /config /manualpeerlist:"time.windows.com,0x9 pool.ntp.org,0x9" /syncfromflags:manual /reliable:no /update 2>&1 | ForEach-Object { Write-Output "  $_" }
w32tm /resync /force 2>&1 | ForEach-Object { Write-Output "  $_" }

Write-Output ""
Write-Output "=== after ==="
Start-Sleep -Seconds 3
(w32tm /query /status 2>&1) | Where-Object { $_ -match 'Source|Last Successful|Phase Offset' } | ForEach-Object { Write-Output "  $_" }
L 'local time now' (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
