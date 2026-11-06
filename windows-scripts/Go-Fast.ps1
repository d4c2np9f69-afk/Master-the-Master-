# FAST MODE - full speed, everyday setting.
#   Drops the WARP tunnel and leaves WARP in DNS-only mode: DNS still resolves through
#   Cloudflare encrypted, so the "cannot find DNS server" failure that Proton once rescued
#   Jeff from cannot strand this machine again - but there is no tunnel, so no speed cost
#   (measured 428 vs 447 Mbit/s interleaved, i.e. inside the noise).
#   Real IP is visible in this mode. That is the trade for full speed.
#
#   Built 2026-08-19. See docs/incidents/beehive_false_offline_protonvpn_2026-08-19.md

$cli = "C:\Program Files\Cloudflare\Cloudflare WARP\warp-cli.exe"
function Get-PublicIP {
    try { return (Invoke-WebRequest 'https://api.ipify.org' -TimeoutSec 15 -UseBasicParsing).Content }
    catch { return 'lookup failed' }
}

Write-Host ""
Write-Host "  ====== FAST MODE ======" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Dropping the tunnel..." -ForegroundColor Yellow
& $cli --accept-tos mode doh | Out-Null
& $cli --accept-tos connect  | Out-Null
Start-Sleep 8
Write-Host ""
Write-Host "  Full speed restored." -ForegroundColor Green
Write-Host "  IP now    : $(Get-PublicIP)   (your real one - not hidden in this mode)" -ForegroundColor Green
Write-Host "  DNS       : still encrypted through Cloudflare" -ForegroundColor Green

$b = Test-NetConnection 192.168.1.66 -Port 8123 -WarningAction SilentlyContinue
if ($b.TcpTestSucceeded) { Write-Host "  Beehive on the LAN: reachable  [OK]" -ForegroundColor Green }
else                     { Write-Host "  Beehive on the LAN: NOT REACHABLE" -ForegroundColor Red }
Write-Host ""
Start-Sleep 8
