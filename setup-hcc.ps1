# ============================================================
# HCC BEEHIVE SETUP SCRIPT
# Run this on the Beast to configure Home Assistant
# ============================================================

Write-Host ""
Write-Host "  HOME COMMAND CENTER - Beehive Setup" -ForegroundColor Cyan
Write-Host "  =====" -ForegroundColor Cyan
Write-Host ""

# --- STEP 1: Get token ---
Write-Host "  STEP 1: You need a Home Assistant token." -ForegroundColor Yellow
Write-Host ""
Write-Host "  On your phone in HA:" -ForegroundColor White
Write-Host "  1. Tap your name (bottom left of HA)" -ForegroundColor White
Write-Host "  2. Scroll to the very bottom" -ForegroundColor White
Write-Host "  3. Tap 'Create Token' under Long-Lived Access Tokens" -ForegroundColor White
Write-Host "  4. Name it 'HCC' and tap OK" -ForegroundColor White
Write-Host "  5. Copy the long string it shows you" -ForegroundColor White
Write-Host ""
$Token = Read-Host "  Paste your HA token here and press Enter"

if (-not $Token -or $Token.Length -lt 10) {
    Write-Host "  No token entered. Exiting." -ForegroundColor Red
    exit
}

$HA = "http://homeassistant.local:8123"
$H  = @{ Authorization = "Bearer $Token"; "Content-Type" = "application/json" }

# --- STEP 2: Test connection ---
Write-Host ""
Write-Host "  Connecting to Beehive..." -ForegroundColor Cyan
try {
    $info = Invoke-RestMethod -Uri "$HA/api/" -Headers $H -TimeoutSec 10
    Write-Host "  Connected! Home Assistant $($info.version)" -ForegroundColor Green
} catch {
    Write-Host "  Cannot reach homeassistant.local. Make sure:" -ForegroundColor Red
    Write-Host "  - The Beehive is powered on" -ForegroundColor Red
    Write-Host "  - This PC is on the same WiFi/network" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    exit
}

# --- STEP 3: Create HCC areas ---
Write-Host ""
Write-Host "  Setting up HCC areas..." -ForegroundColor Cyan

$areas = @("Yard", "Security", "Home", "Safety")
foreach ($area in $areas) {
    try {
        $body = @{ name = $area } | ConvertTo-Json
        Invoke-RestMethod -Uri "$HA/api/config/area_registry" -Method POST -Headers $H -Body $body -ErrorAction SilentlyContinue | Out-Null
        Write-Host "  Area created: $area" -ForegroundColor Green
    } catch {
        Write-Host "  Area '$area' already exists or skipped" -ForegroundColor DarkGray
    }
}

# --- STEP 4: Panic button automation ---
Write-Host ""
Write-Host "  Creating panic button automation..." -ForegroundColor Cyan

$panic = @{
    alias       = "HCC Panic Button"
    description = "Emergency alert - flashes lights and notifies Jeff and Angela"
    mode        = "single"
    trigger     = @(@{ platform = "webhook"; webhook_id = "hcc-panic-button" })
    action      = @(
        @{
            service = "light.turn_on"
            target  = @{ entity_id = "all" }
            data    = @{ flash = "long" }
        },
        @{
            service = "persistent_notification.create"
            data    = @{
                title   = "EMERGENCY ALERT"
                message = "Panic button activated at {{ now().strftime('%I:%M %p') }}"
                notification_id = "hcc_panic"
            }
        }
    )
} | ConvertTo-Json -Depth 10

try {
    Invoke-RestMethod -Uri "$HA/api/config/automation/config/hcc_panic_button" -Method POST -Headers $H -Body $panic | Out-Null
    Write-Host "  Panic button automation created!" -ForegroundColor Green
} catch {
    Write-Host "  Panic button: $($_.Exception.Message)" -ForegroundColor DarkYellow
}

# --- STEP 5: Weather alert automation ---
Write-Host ""
Write-Host "  Creating weather alert automation..." -ForegroundColor Cyan

$weather = @{
    alias       = "HCC Weather Alert"
    description = "Notify when severe weather is detected"
    mode        = "single"
    trigger     = @(@{
        platform   = "state"
        entity_id  = "weather.home"
        to         = @("lightning", "lightning-rainy", "exceptional")
    })
    action      = @(@{
        service = "persistent_notification.create"
        data    = @{
            title   = "Weather Alert"
            message = "Severe weather detected: {{ states('weather.home') }}"
            notification_id = "hcc_weather"
        }
    })
} | ConvertTo-Json -Depth 10

try {
    Invoke-RestMethod -Uri "$HA/api/config/automation/config/hcc_weather_alert" -Method POST -Headers $H -Body $weather | Out-Null
    Write-Host "  Weather alert automation created!" -ForegroundColor Green
} catch {
    Write-Host "  Weather alert: $($_.Exception.Message)" -ForegroundColor DarkYellow
}

# --- STEP 6: B-Hyve integration ---
Write-Host ""
Write-Host "  Starting B-Hyve irrigation setup..." -ForegroundColor Cyan
try {
    $flow = @{ handler = "bhyve" } | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$HA/api/config/config_entries/flow" -Method POST -Headers $H -Body $flow
    Write-Host "  B-Hyve setup started (flow: $($r.flow_id))" -ForegroundColor Green
    Write-Host "  -> Open HA on your phone, go to Settings > Devices & Services" -ForegroundColor Yellow
    Write-Host "     and finish entering your B-Hyve credentials there." -ForegroundColor Yellow
} catch {
    Write-Host "  B-Hyve flow: $($_.Exception.Message)" -ForegroundColor DarkYellow
}

# --- STEP 7: ESPHome integration ---
Write-Host ""
Write-Host "  Starting ESPHome setup..." -ForegroundColor Cyan
try {
    $flow = @{ handler = "esphome" } | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$HA/api/config/config_entries/flow" -Method POST -Headers $H -Body $flow
    Write-Host "  ESPHome setup started (flow: $($r.flow_id))" -ForegroundColor Green
    Write-Host "  -> Finish in HA under Settings > Devices & Services" -ForegroundColor Yellow
} catch {
    Write-Host "  ESPHome flow: $($_.Exception.Message)" -ForegroundColor DarkYellow
}

# --- DONE ---
Write-Host ""
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host "  HCC Beehive setup complete!" -ForegroundColor Green
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Areas created:      YARD / SECURITY / HOME / SAFETY" -ForegroundColor White
Write-Host "  Panic button:       Ready (webhook: hcc-panic-button)" -ForegroundColor White
Write-Host "  Weather alerts:     Active" -ForegroundColor White
Write-Host "  B-Hyve:             Finish credentials in HA app" -ForegroundColor White
Write-Host "  ESPHome:            Finish in HA app" -ForegroundColor White
Write-Host ""
Write-Host "  Open HA on your phone to see everything." -ForegroundColor Cyan
Write-Host ""
