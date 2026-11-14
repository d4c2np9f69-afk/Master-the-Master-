#Requires -RunAsAdministrator
# One-button cleanup for Jeff's PC. Frees disk space, clears junk, and removes tracking
# cookies - WITHOUT ever touching saved passwords or autofill.
#
# 2026-08-19: added Brave (now the main browser) and step 4b, which deletes tracking
# cookies while protecting every site Jeff has bookmarked, so he never has to retype a
# password after cleaning. Rule: BOOKMARK IT -> YOU STAY LOGGED IN.
# Cookie databases are backed up to ~\Scripts\cookie-backups before any deletion.

$ErrorActionPreference = 'SilentlyContinue'
$Host.UI.RawUI.WindowTitle = "Clean Beast"
$logPath = "$env:USERPROFILE\Scripts\CleanBeast-Log.txt"

function Get-FreeGB { [math]::Round((Get-PSDrive C).Free / 1GB, 2) }

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  CLEAN BEAST - full system cleanup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$before = Get-FreeGB
Write-Host "Free space before: $before GB" -ForegroundColor Yellow

# --- Safety net: restore point before touching anything ---
Write-Host "`n[1/9] Creating System Restore point..." -ForegroundColor Cyan
try {
    Set-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore" `
        -Name "SystemRestorePointCreationFrequency" -Value 0 -ErrorAction Stop
} catch {}
Checkpoint-Computer -Description "Pre-CleanBeast run" -RestorePointType "MODIFY_SETTINGS"

# --- User + system temp files ---
Write-Host "[2/9] Clearing temp files..." -ForegroundColor Cyan
Remove-Item "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "C:\Windows\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "C:\Windows\Prefetch\*.pf" -Force -ErrorAction SilentlyContinue

# --- Windows Update leftovers (safe: Windows re-downloads what it needs) ---
Write-Host "[3/9] Clearing Windows Update cache..." -ForegroundColor Cyan
Stop-Service wuauserv -Force -ErrorAction SilentlyContinue
Remove-Item "C:\Windows\SoftwareDistribution\Download\*" -Recurse -Force -ErrorAction SilentlyContinue
Start-Service wuauserv -ErrorAction SilentlyContinue

# --- Browser CACHE. Login Data (saved passwords) and Web Data (autofill) are never
#     touched anywhere in this script. Cookies are handled separately in step 4b, which
#     protects bookmarked sites. Brave added 2026-08-19 - it is now the main browser. ---
Write-Host "[4/9] Clearing browser caches (saved passwords untouched)..." -ForegroundColor Cyan
$browserCachePaths = @(
    "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\User Data\Default\Cache",
    "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\User Data\Default\Code Cache",
    "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache",
    "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Code Cache",
    "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache",
    "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Code Cache",
    "$env:APPDATA\Mozilla\Firefox\Profiles\*\cache2"
)
foreach ($path in $browserCachePaths) {
    Get-Item $path -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item "$($_.FullName)\*" -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# --- 4b. TRACKING COOKIES. Everything a tracker uses to follow you between sites is
#     deleted, EXCEPT cookies belonging to sites you have bookmarked - so you stay
#     signed in to Amazon / Walmart / Kroger / eBay / PayPal and don't retype passwords.
#     The keep-list is read from your own Bookmarks, so the rule is simply:
#        BOOKMARK IT  ->  YOU STAY LOGGED IN.
#     Browsers must be closed to unlock their databases. Saved passwords are untouched
#     either way - worst case a site asks you to sign in and the browser fills it. ---
Write-Host "[4b/9] Clearing tracking cookies (bookmarked sites stay logged in)..." -ForegroundColor Cyan
$python = "C:\Users\jeffl\AppData\Local\Programs\Python\Python313\python.exe"
$purger = "$env:USERPROFILE\Scripts\Clean-BrowserTracking.py"
if ((Test-Path $python) -and (Test-Path $purger)) {
    $open = @(Get-Process brave, chrome, msedge -ErrorAction SilentlyContinue)
    if ($open.Count -gt 0) {
        $names = ($open | Select-Object -ExpandProperty ProcessName -Unique) -join ", "
        Write-Host "      Browsers open ($names). They must close to unlock the cookie files." -ForegroundColor Yellow
        $reply = Read-Host "      Close them now and clean tracking cookies? (y/N)"
        if ($reply -match '^(y|Y)') {
            Get-Process brave, chrome, msedge -ErrorAction SilentlyContinue | Stop-Process -Force
            Start-Sleep -Seconds 5
        } else {
            Write-Host "      Skipped - cookies left alone." -ForegroundColor Yellow
        }
    }
    if (@(Get-Process brave, chrome, msedge -ErrorAction SilentlyContinue).Count -eq 0) {
        & $python $purger
    }
} else {
    Write-Host "      Purger or Python not found - skipped." -ForegroundColor Yellow
}

# --- Thumbnail + icon cache (rebuilds automatically) ---
Write-Host "[5/9] Clearing thumbnail cache..." -ForegroundColor Cyan
Remove-Item "$env:LOCALAPPDATA\Microsoft\Windows\Explorer\thumbcache_*.db" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:LOCALAPPDATA\Microsoft\Windows\Explorer\iconcache_*.db" -Force -ErrorAction SilentlyContinue

# --- Recycle Bin ---
Write-Host "[6/9] Emptying Recycle Bin..." -ForegroundColor Cyan
Clear-RecycleBin -Force -ErrorAction SilentlyContinue

# --- Windows Error Reporting dumps/logs ---
Write-Host "[7/9] Clearing error report cache..." -ForegroundColor Cyan
Remove-Item "C:\ProgramData\Microsoft\Windows\WER\ReportQueue\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "C:\ProgramData\Microsoft\Windows\WER\ReportArchive\*" -Recurse -Force -ErrorAction SilentlyContinue

# --- Component store cleanup (safe, Microsoft-supported) ---
Write-Host "[8/9] Cleaning Windows component store (can take a few minutes)..." -ForegroundColor Cyan
Start-Process -FilePath "Dism.exe" -ArgumentList "/Online","/Cleanup-Image","/StartComponentCleanup","/Quiet" -Wait -NoNewWindow

# --- Registry: safe maintenance only, no blind "orphaned entry" deletion.
#     CCleaner-style registry cleaners are a known source of breakage on modern
#     Windows for negligible benefit -- deliberately skipped here. Restore point
#     above covers you if you ever want to add a more aggressive pass later. ---
Write-Host "[9/9] Registry: skipping aggressive cleanup (kept safe on purpose - see notes)..." -ForegroundColor Cyan

$after = Get-FreeGB
$freed = [math]::Round($after - $before, 2)

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "  DONE. Freed approximately $freed GB." -ForegroundColor Green
Write-Host "  Free space now: $after GB" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

"$(Get-Date) - Freed approximately $freed GB (before: $before GB, after: $after GB)" | Out-File $logPath -Append

Write-Host "`nPress Enter to close..."
Read-Host | Out-Null
