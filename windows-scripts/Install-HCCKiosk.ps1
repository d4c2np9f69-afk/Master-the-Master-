<#
.SYNOPSIS
    Installs the HCC kiosk: a desktop shortcut plus the idle watcher at logon.

.DESCRIPTION
    One command, and it verifies every piece afterwards instead of assuming. Creates:

      1. Desktop shortcut "HCC Dashboard" - opens the kiosk on demand.
      2. Scheduled task "HCC Kiosk Watcher" - starts the idle watcher at logon, hidden,
         so the dashboard comes up on its own after the PC has been idle.

    Both point at the scripts in this repo folder, so `git pull` updates them and there is
    no second copy to drift out of date.

    Re-running is safe: it replaces what it made.

.PARAMETER IdleMinutes
    Idle minutes before the dashboard appears. Default 10.

.PARAMETER RotateSeconds
    Seconds per section. Default 60.

.PARAMETER Uninstall
    Remove the shortcut and the scheduled task, and stop the watcher.

.EXAMPLE
    .\Install-HCCKiosk.ps1
    .\Install-HCCKiosk.ps1 -IdleMinutes 5 -RotateSeconds 45
    .\Install-HCCKiosk.ps1 -Uninstall
#>
[CmdletBinding()]
param(
    [ValidateRange(1, 240)] [int] $IdleMinutes = 10,
    [ValidateRange(5, 3600)] [int] $RotateSeconds = 60,
    [switch] $Uninstall
)

$ErrorActionPreference = 'Stop'
$here      = Split-Path -Parent $MyInvocation.MyCommand.Path
$starter   = Join-Path $here 'Start-HCCKiosk.ps1'
$watcher   = Join-Path $here 'HCCKioskWatcher.ps1'
$taskName  = 'HCC Kiosk Watcher'
$shortcut  = Join-Path ([Environment]::GetFolderPath('Desktop')) 'HCC Dashboard.lnk'

function Stop-Watcher {
    # The watcher runs inside a powershell.exe host, so find it by command line.
    Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -and $_.CommandLine -like '*HCCKioskWatcher.ps1*' } |
        ForEach-Object {
            try { Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop; Write-Output "  stopped watcher PID $($_.ProcessId)" }
            catch { Write-Warning "  could not stop PID $($_.ProcessId): $($_.Exception.Message)" }
        }
}

if ($Uninstall) {
    Write-Output 'Removing the HCC kiosk...'
    Stop-Watcher
    try { Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction Stop; Write-Output "  removed task '$taskName'" }
    catch { Write-Output "  no scheduled task to remove" }
    if (Test-Path $shortcut) { Remove-Item $shortcut -Force; Write-Output '  removed desktop shortcut' }
    Write-Output 'Done. Nothing of the kiosk is left running.'
    exit 0
}

foreach ($f in @($starter, $watcher)) {
    if (-not (Test-Path $f)) { Write-Error "Missing required script: $f"; exit 1 }
}

Write-Output "Installing the HCC kiosk (idle ${IdleMinutes}m, rotate ${RotateSeconds}s)"
Write-Output ''

# ── 1. Desktop shortcut ────────────────────────────────────────────────────────────
# Uses powershell.exe -WindowStyle Hidden so no console box flashes up on the TV.
$w = New-Object -ComObject WScript.Shell
$lnk = $w.CreateShortcut($shortcut)
$lnk.TargetPath       = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
$lnk.Arguments        = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$starter`" -RotateSeconds $RotateSeconds"
$lnk.WorkingDirectory = $here
$lnk.WindowStyle      = 7          # minimised host window
$lnk.Description      = 'Open the Loewen Home dashboard full screen'
$chromeIcon = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
if (Test-Path $chromeIcon) { $lnk.IconLocation = "$chromeIcon,0" }
$lnk.Save()
Write-Output "  [1/2] desktop shortcut -> $shortcut"

# ── 2. Scheduled task: start the watcher at logon ──────────────────────────────────
Stop-Watcher
try { Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction Stop } catch { }

$action = New-ScheduledTaskAction `
    -Execute "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$watcher`" -IdleMinutes $IdleMinutes -RotateSeconds $RotateSeconds" `
    -WorkingDirectory $here
$trigger  = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited
# ExecutionTimeLimit 0 = never kill it; this task is meant to run all day.
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) `
    -StartWhenAvailable
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger `
    -Principal $principal -Settings $settings -Description 'Opens the Loewen Home dashboard when the PC goes idle.' | Out-Null
Write-Output "  [2/2] scheduled task  -> '$taskName' (at logon, hidden)"

# ── Verify, do not assume ──────────────────────────────────────────────────────────
Write-Output ''
Write-Output 'Verifying:'
$ok = $true
if (Test-Path $shortcut) { Write-Output '  OK  desktop shortcut exists' } else { Write-Output '  FAIL desktop shortcut missing'; $ok = $false }
$t = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($t) { Write-Output "  OK  scheduled task registered (state: $($t.State))" } else { Write-Output '  FAIL scheduled task missing'; $ok = $false }

# Prove the watcher itself runs, rather than trusting that it will at next logon.
$probe = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $watcher -Once -IdleMinutes $IdleMinutes -RotateSeconds $RotateSeconds 2>&1
if ($LASTEXITCODE -eq 0 -and ($probe -join ' ') -match 'single check done') { Write-Output '  OK  watcher runs and reads idle time' }
else { Write-Output '  FAIL watcher probe did not complete'; Write-Output ($probe -join "`n"); $ok = $false }

# Start it now so he does not have to log off and back on.
Start-Process -FilePath "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe" `
    -ArgumentList "-NoProfile","-ExecutionPolicy","Bypass","-WindowStyle","Hidden","-File","`"$watcher`"","-IdleMinutes",$IdleMinutes,"-RotateSeconds",$RotateSeconds `
    -WindowStyle Hidden
Start-Sleep -Seconds 2
$running = Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
           Where-Object { $_.CommandLine -and $_.CommandLine -like '*HCCKioskWatcher.ps1*' -and $_.CommandLine -notlike '*-Once*' }
if ($running) { Write-Output "  OK  watcher is running now (PID $($running.ProcessId -join ', '))" }
else { Write-Output '  FAIL watcher did not stay running'; $ok = $false }

Write-Output ''
if ($ok) {
    Write-Output "INSTALLED. The dashboard opens by itself after $IdleMinutes minutes idle,"
    Write-Output 'or any time from the "HCC Dashboard" shortcut on the desktop.'
    Write-Output 'Close it with the X in the top-right corner.'
    Write-Output "Log: $env:LOCALAPPDATA\HCC\kiosk-watcher.log"
    exit 0
} else {
    Write-Error 'Install finished with failures - see above.'
    exit 1
}
