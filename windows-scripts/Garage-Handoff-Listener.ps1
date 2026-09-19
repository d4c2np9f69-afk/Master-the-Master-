# "SEND TO GARAGE" - hand the video you are watching to the garage machine at the
# EXACT second you left off.
#
# Jeff, 2026-09-19 09:47: "I'm watching a utube video on the beast or acer and i
# need to go to the garage to actually do something that is on that video - how
# can we make that video come up out there without me having to find it and
# start it over out there?"
#
# WHY NOT YOUTUBE'S OWN FEATURE: YouTube does have cross-device "Continue
# watching" (same Google account, Web & App Activity enabled, card appears
# 30-90 s after you stop). Verified 2026-09-19. But it is documented as NOT
# rolling out uniformly, only appearing for some videos, and not resuming a
# video that is nearly complete. That is a maybe, and Jeff asked for a will.
#
# THIS runs on the Beast as a tiny HTTP relay:
#     /send?u=<url>   a browser bookmarklet posts the current video URL + time
#     /pending        the garage machine polls this; returns the URL ONCE
#     /status         human-readable, for checking it is alive
# No file sharing involved, so it works from the Acer too (which cannot write to
# the Beast's read-only OneDrive share) and needs no mount on the garage side.
param([int]$Port = 8099)
$ErrorActionPreference = 'Stop'

$state = [hashtable]::Synchronized(@{ Url = ''; Sent = $null; Consumed = $true })

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:$Port/")
try { $listener.Start() } catch {
    Write-Output "Could not bind port $Port. Run once as admin:"
    Write-Output "  netsh http add urlacl url=http://+:$Port/ user=Everyone"
    exit 1
}
Write-Output "Garage handoff relay listening on port $Port"

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
                $u = $req.QueryString['u']
                if ($u) {
                    $state.Url = $u
                    $state.Sent = Get-Date
                    $state.Consumed = $false
                    Add-Content 'C:\HCC-Heartbeat\garage-handoff.log' ("{0}`t{1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $u) -EA SilentlyContinue
                    $body = '<html><body style="font:28px system-ui;background:#111;color:#0f0;text-align:center;padding-top:20vh">SENT TO THE GARAGE<br><span style="font-size:16px;color:#888">you can close this tab</span></body></html>'
                } else { $body = 'no url' }
            }
            '/pending' {
                if (-not $state.Consumed -and $state.Url) {
                    $body = $state.Url
                    $state.Consumed = $true      # hand it over exactly once
                } else { $body = '' }
            }
            '/status' {
                $body = "relay alive`nlast url : $($state.Url)`nsent at  : $($state.Sent)`nconsumed : $($state.Consumed)"
            }
            default { $body = 'garage relay: /send?u=  /pending  /status' }
        }

        $bytes = [Text.Encoding]::UTF8.GetBytes($body)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        $res.Close()
    } catch { Start-Sleep -Milliseconds 200 }
}
