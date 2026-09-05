# PRIVATE MODE - fast privacy, no Tor.
#   Turns Cloudflare WARP's full tunnel ON. Websites see a Cloudflare IP instead of Jeff's,
#   and AT&T can no longer see which sites he visits.
#   Speed cost ~35-40% (~276 vs ~447 Mbit/s measured 2026-08-19) - still far faster than
#   anything he does needs. Beehive on the LAN keeps working. NOT anonymous: accounts he is
#   signed into still identify him. For real anonymity use the ANONYMOUS button (Tor).
#
#   Built 2026-08-19. See docs/incidents/beehive_false_offline_protonvpn_2026-08-19.md

$cli = "C:\Program Files\Cloudflare\Cloudflare WARP\warp-cli.exe"
function Get-PublicIP {
    try { return (Invoke-WebRequest 'https://api.ipify.org' -TimeoutSec 15 -UseBasicParsing).Content }
    catch { return 'lookup failed' }
}

Write-Host ""
Write-Host "  ====== PRIVATE MODE ======" -ForegroundColor Magenta
Write-Host ""
Write-Host "  IP before : $(Get-PublicIP)" -ForegroundColor Gray
Write-Host "  Turning the Cloudflare tunnel on..." -ForegroundColor Yellow
& $cli --accept-tos mode warp | Out-Null
& $cli --accept-tos connect   | Out-Null
Start-Sleep 9
Write-Host ""
Write-Host "  IP now    : $(Get-PublicIP)" -ForegroundColor Green
Write-Host "  -> Websites and AT&T see Cloudflare, not you." -ForegroundColor Green
Write-Host "  -> Speed drops by roughly a third. Still plenty for streaming." -ForegroundColor Green

$b = Test-NetConnection 192.168.1.66 -Port 8123 -WarningAction SilentlyContinue
if ($b.TcpTestSucceeded) { Write-Host "  Beehive on the LAN: still reachable  [OK]" -ForegroundColor Green }
else                     { Write-Host "  Beehive on the LAN: NOT REACHABLE" -ForegroundColor Red }

Write-Host ""
Write-Host "  This is PRIVATE, not ANONYMOUS. Signing into Google/Amazon still identifies you." -ForegroundColor DarkYellow
Write-Host ""
Start-Sleep 10
