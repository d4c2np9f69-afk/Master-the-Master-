# "SEND TO <MACHINE>" - hand what you are looking at to ANY other machine in the house,
# at the exact second / page you left off.
#
# Jeff, 2026-09-19 09:47: "I'm watching a utube video on the beast or acer and i need to go to
# the garage to actually do something that is on that video - how can we make that video come up
# out there without me having to find it and start it over out there?"
# Jeff, 2026-09-23 07:44: "Btw I want it to go both ways."
#
# WHY NOT YOUTUBE'S OWN FEATURE: YouTube does have cross-device "Continue watching" (same Google
# account, Web & App Activity on). Verified 2026-09-19. But it is documented as NOT rolling out
# uniformly, only appearing for some videos, and not resuming a nearly-complete video. That is a
# maybe, and Jeff asked for a will.
#
# THIS runs on the Beast as a tiny HTTP relay with ONE QUEUE PER TARGET:
#     /send?to=<target>&u=<url>   a bookmarklet posts the current URL + timestamp
#     /pending?for=<target>       that machine polls this; returns its item ONCE
#     /status                     human-readable, every queue
# Targets: garage (Lenovo), beast, acer, kitchen (the HP).  Omitting to=/for= means "garage", which keeps the
# original 2026-09-19 bookmarklet and the Lenovo watcher working unchanged.
#
# No file sharing involved, so it works from the Acer too and needs no mount on the garage side.
#
# PERMANENCE - the bug that killed it, found 2026-09-23: the task had a BOOT trigger but
# LogonType=Interactive, so after the 09-20 reboot it could never start (nobody is logged in at
# boot). It last ran 09-19 and the relay was dead for four days while looking "Ready".
# It now runs as SYSTEM with restart-on-failure. Install-Handoff.ps1 sets that up.
param([int]$Port = 8099)
$ErrorActionPreference = 'Stop'

$valid = @('garage','beast','acer','kitchen')   # kitchen = the HP once the stick has built it
$q = [hashtable]::Synchronized(@{})
foreach ($t in $valid) { $q[$t] = [pscustomobject]@{ Url=''; Sent=$null; Consumed=$true } }

$logDir = 'C:\HCC-Heartbeat'
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:$Port/")
try { $listener.Start() } catch {
    Write-Output "Could not bind port $Port. Run once as admin:"
    Write-Output "  netsh http add urlacl url=http://+:$Port/ user=Everyone"
    exit 1
}
Write-Output "Handoff relay listening on port $Port - targets: $($valid -join ', ')"

function Get-Target([string]$v) {
    if ([string]::IsNullOrWhiteSpace($v)) { return 'garage' }
    $v = $v.ToLower().Trim()
    # friendly aliases so a bookmarklet can say what Jeff would say
    switch ($v) {
        'lenovo'       { return 'garage' }
        'garagelaptop' { return 'garage' }
        'bench'        { return 'garage' }
        '301server'    { return 'beast' }
        'house'        { return 'beast' }
        'jeffslaptop'  { return 'acer' }
        'laptop'       { return 'acer' }
        'kitchenpc'    { return 'kitchen' }
        'hp'           { return 'kitchen' }
        default        { return $v }
    }
}

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response
        $res.Headers.Add('Access-Control-Allow-Origin', '*')
        $path = $req.Url.AbsolutePath.ToLower()
        $body = ''

        switch -Wildcard ($path) {
            '/send' {
                $u  = $req.QueryString['u']
                $to = Get-Target $req.QueryString['to']
                if (-not $u) {
                    $body = 'no url'
                } elseif ($valid -notcontains $to) {
                    $body = "unknown target '$to' - use: $($valid -join ', ')"
                } else {
                    $q[$to].Url = $u
                    $q[$to].Sent = Get-Date
                    $q[$to].Consumed = $false
                    Add-Content (Join-Path $logDir 'handoff.log') ("{0}`tTO {1}`t{2}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $to.ToUpper(), $u) -EA SilentlyContinue
                    $name = $to.ToUpper()
                    $body = "<html><body style='font:28px system-ui;background:#111;color:#0f0;text-align:center;padding-top:20vh'>SENT TO $name<br><span style='font-size:16px;color:#888'>you can close this tab</span></body></html>"
                }
            }
            '/pending' {
                $for = Get-Target $req.QueryString['for']
                if ($valid -contains $for) {
                    $item = $q[$for]
                    if (-not $item.Consumed -and $item.Url) {
                        $body = $item.Url
                        $item.Consumed = $true     # hand it over exactly once
                    } else { $body = '' }
                } else { $body = '' }
            }
            '/status' {
                $lines = @("relay alive on $($env:COMPUTERNAME), port $Port", "")
                foreach ($t in $valid) {
                    $i = $q[$t]
                    $lines += ("{0,-8} last: {1}" -f $t, $(if ($i.Url) { $i.Url } else { '(nothing yet)' }))
                    $lines += ("{0,-8} sent: {1}  consumed: {2}" -f '', $i.Sent, $i.Consumed)
                }
                $body = $lines -join "`n"
            }
            default { $body = 'handoff relay: /send?to=<garage|beast|acer>&u=<url>  /pending?for=<target>  /status' }
        }

        $bytes = [Text.Encoding]::UTF8.GetBytes($body)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        $res.Close()
    } catch { Start-Sleep -Milliseconds 200 }
}
