# ANONYMOUS MODE - Tor Browser, as fast as Tor can honestly be made.
#
#   Tor is slow BY DESIGN: every request is relayed through three volunteer-run nodes chosen
#   from around the world. That indirection IS the anonymity. Nothing makes it fast.
#
#   What this script does to avoid making it slower than it has to be:
#     * Turns the WARP full tunnel OFF first. Running Tor inside a VPN stacks a fourth hop
#       under Tor's three and slows it noticeably. Tor already hides the IP by itself, so the
#       tunnel adds latency without adding meaningful anonymity.
#     * Leaves WARP in DNS-only mode, so DNS stays encrypted and an AT&T DNS outage still
#       can't strand the machine.
#   Trade-off of not tunnelling: AT&T can see that Tor is being used, though not what for.
#
#   Built 2026-08-19. See docs/incidents/beehive_false_offline_protonvpn_2026-08-19.md

$cli = "C:\Program Files\Cloudflare\Cloudflare WARP\warp-cli.exe"
$tor = "C:\Users\jeffl\TorBrowser\Browser\firefox.exe"

Write-Host ""
Write-Host "  ====== ANONYMOUS MODE (Tor) ======" -ForegroundColor Magenta
Write-Host ""

if (Test-Path $cli) {
    Write-Host "  Dropping the VPN tunnel so Tor isn't slowed by an extra hop..." -ForegroundColor Yellow
    & $cli --accept-tos mode doh | Out-Null
    & $cli --accept-tos connect  | Out-Null
    Start-Sleep 7
    Write-Host "  Tunnel off, encrypted DNS still on." -ForegroundColor Green
}

if (Test-Path $tor) {
    Write-Host "  Starting Tor Browser..." -ForegroundColor Yellow
    Start-Process -FilePath $tor
    Write-Host ""
    Write-Host "  Browse ONLY in the Tor window - Chrome is not anonymous." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  If a page is crawling:" -ForegroundColor DarkYellow
    Write-Host "    * Ctrl+Shift+L  = new circuit for this site (often lands a faster route)" -ForegroundColor DarkYellow
    Write-Host "    * Keep the security level on Standard (the shield icon)" -ForegroundColor DarkYellow
    Write-Host "    * Don't stream video over Tor - it will never keep up" -ForegroundColor DarkYellow
    Write-Host "    * Do NOT maximise the window - the size is part of your fingerprint" -ForegroundColor DarkYellow
} else {
    Write-Host "  Tor Browser not found at $tor" -ForegroundColor Red
}

Write-Host ""
Write-Host "  Click 'Fast Mode' when you're done." -ForegroundColor DarkYellow
Write-Host ""
Start-Sleep 14
