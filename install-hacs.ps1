# ============================================================
# HCC - HACS + B-Hyve Auto Installer
# Run this on the Beast to install HACS on the Beehive
# ============================================================

$HA_IP = "192.168.1.66"
$HA    = "http://${HA_IP}:8123"

Write-Host ""
Write-Host "  HCC - Installing HACS on the Beehive" -ForegroundColor Cyan
Write-Host "  ======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Fix firewall so Beast can reach Beehive
Write-Host "  Fixing firewall..." -ForegroundColor Yellow
$rule = Get-NetFirewallRule -DisplayName "Home Assistant HCC" -ErrorAction SilentlyContinue
if (-not $rule) {
    New-NetFirewallRule -DisplayName "Home Assistant HCC" `
        -Direction Outbound -Protocol TCP `
        -RemoteAddress $HA_IP -RemotePort 8123 `
        -Action Allow -Profile Any | Out-Null
    Write-Host "  Firewall rule added." -ForegroundColor Green
} else {
    Write-Host "  Firewall rule already exists." -ForegroundColor Green
}

# Step 2: Get HA token
Write-Host ""
Write-Host "  You need a Home Assistant token." -ForegroundColor Yellow
Write-Host "  In HA on your phone:" -ForegroundColor White
Write-Host "  1. Tap your name (bottom left)" -ForegroundColor White
Write-Host "  2. Scroll to the bottom" -ForegroundColor White
Write-Host "  3. Tap 'Create Token' - name it 'HACS'" -ForegroundColor White
Write-Host "  4. Copy the token" -ForegroundColor White
Write-Host ""
$Token = Read-Host "  Paste your HA token here and press Enter"

if (-not $Token -or $Token.Length -lt 10) {
    Write-Host "  No token entered. Exiting." -ForegroundColor Red
    exit
}

$H = @{ Authorization = "Bearer $Token"; "Content-Type" = "application/json" }

# Step 3: Test connection
Write-Host ""
Write-Host "  Connecting to Beehive at $HA..." -ForegroundColor Cyan
try {
    $info = Invoke-RestMethod -Uri "$HA/api/" -Headers $H -TimeoutSec 10
    Write-Host "  Connected! Home Assistant $($info.version)" -ForegroundColor Green
} catch {
    Write-Host "  Cannot reach Beehive. Check it is powered on." -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    exit
}

# Step 4: Install Terminal & SSH addon (needed to run HACS script)
Write-Host ""
Write-Host "  Installing Terminal & SSH addon..." -ForegroundColor Cyan
$addon = @{ slug = "core_ssh" }
try {
    Invoke-RestMethod -Uri "$HA/api/hassio/addons/core_ssh/install" `
        -Method POST -Headers $H -TimeoutSec 60 | Out-Null
    Write-Host "  Terminal addon installed." -ForegroundColor Green
} catch {
    Write-Host "  Terminal addon: $($_.Exception.Message)" -ForegroundColor DarkYellow
}

# Step 5: Start Terminal addon
try {
    Invoke-RestMethod -Uri "$HA/api/hassio/addons/core_ssh/start" `
        -Method POST -Headers $H -TimeoutSec 30 | Out-Null
    Write-Host "  Terminal addon started." -ForegroundColor Green
} catch {
    Write-Host "  Start: $($_.Exception.Message)" -ForegroundColor DarkYellow
}

# Step 6: Run HACS installer via addon stdin API
Write-Host ""
Write-Host "  Running HACS installer on Beehive..." -ForegroundColor Cyan
$cmd = @{ command = "wget -O - https://get.hacs.xyz | bash -" } | ConvertTo-Json
try {
    $r = Invoke-RestMethod -Uri "$HA/api/hassio/addons/core_ssh/stdin" `
        -Method POST -Headers $H -Body $cmd -TimeoutSec 120
    Write-Host "  HACS installer ran!" -ForegroundColor Green
} catch {
    Write-Host "  HACS install: $($_.Exception.Message)" -ForegroundColor DarkYellow
}

# Step 7: Restart HA
Write-Host ""
Write-Host "  Restarting Home Assistant..." -ForegroundColor Cyan
try {
    Invoke-RestMethod -Uri "$HA/api/core/restart" -Method POST -Headers $H -TimeoutSec 10 | Out-Null
    Write-Host "  Restarting... wait 60 seconds then open HA." -ForegroundColor Green
} catch {
    Write-Host "  Restart: $($_.Exception.Message)" -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host "  Done! Next steps:" -ForegroundColor Green
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Wait 60 seconds for HA to restart" -ForegroundColor White
Write-Host "  2. Open HA on your phone" -ForegroundColor White
Write-Host "  3. Settings > Devices & Services > Add Integration > HACS" -ForegroundColor White
Write-Host "  4. Authorize with GitHub" -ForegroundColor White
Write-Host "  5. HACS sidebar appears - search B-Hyve - install it" -ForegroundColor White
Write-Host ""
