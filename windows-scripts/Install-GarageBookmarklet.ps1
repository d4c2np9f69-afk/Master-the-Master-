# Adds a "SEND TO <MACHINE>" bookmarklet to Edge's bookmarks bar - one per target.
#
# Jeff, 2026-09-19 09:47 (the garage video) and 2026-09-23 07:44: "I want it to go both ways."
#
# One click while a video is playing:
#   - reads the <video> element's currentTime (any HTML5 video, not just YouTube)
#   - rebuilds the URL with &t=<seconds>s
#   - posts it to the relay on the Beast with the chosen target
#   - that machine opens it within ~3 s at that exact second
#
# Edge is signed in as jeff.loewen@comcast.net and SYNCS, so installing on either Windows machine
# propagates to the other. The script is idempotent - it refreshes a bookmarklet it already added.
#
# The Lenovo runs Chrome, not Edge, so it gets the same three as a Chrome bookmarks-bar entry via
# lenovo-install-handoff-watcher.sh. Its send side also works from a terminal with curl.
#
# 🔴 Edge keeps an integrity MAC of the Bookmarks file in Local State. If the file is edited and
# that MAC is not cleared, Edge SILENTLY DISCARDS the whole file - which is how a previous session
# lost bookmarks. Clear the MAC entry and Edge re-signs it on next launch. Both files backed up.
$ErrorActionPreference = 'SilentlyContinue'
function L($a,$b){ Write-Output ("  {0,-34} {1}" -f $a,$b) }

$relayBase = 'http://192.168.1.194:8099/send'

# Which buttons to create. "garage" = the Lenovo at the bench.
$targets = @(
    @{ Name = 'SEND TO GARAGE'; To = 'garage' },
    @{ Name = 'SEND TO BEAST';  To = 'beast'  },
    @{ Name = 'SEND TO ACER';   To = 'acer'   }
)

# single-line bookmarklet; no double quotes inside so the JSON stays clean.
# Handles three cases in one click:
#   video  -> append &t=<currentTime>s so it resumes at the exact second
#   pdf    -> keep #page=N if the viewer put one in the URL
#   other  -> send the page as-is
function New-Bookmarklet([string]$to) {
    $relay = "$relayBase" + "?to=$to&u="
    return "javascript:(function(){var u;var v=document.querySelector('video');if(v){u=location.href.split('&t=')[0].split('#')[0];u+=(u.indexOf('?')>-1?'&':'?')+'t='+Math.floor(v.currentTime)+'s';}else{u=location.href;}var w=window.open('$relay'+encodeURIComponent(u),'_blank','width=420,height=220');setTimeout(function(){if(w)w.close();},1500);})()"
}

$prof = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default"
$bm   = "$prof\Bookmarks"
$ls   = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Local State"
if (-not (Test-Path $bm)) { Write-Output "  no Edge bookmarks file at $bm"; exit 1 }

$stamp = Get-Date -Format 'yyyyMMdd-HHmm'
Copy-Item $bm "$bm.backup-$stamp" -Force
Copy-Item $ls "$ls.backup-$stamp" -Force
L 'backed up' "Bookmarks + Local State ($stamp)"

$json = Get-Content $bm -Raw | ConvertFrom-Json
$bar  = $json.roots.bookmark_bar

# ids must be unique; take one past the current maximum
$script:maxId = 0
function Walk($n){ if ($n.id) { $i=[int]$n.id; if ($i -gt $script:maxId) { $script:maxId = $i } }; if ($n.children) { foreach ($c in $n.children) { Walk $c } } }
foreach ($r in $json.roots.PSObject.Properties) { if ($r.Value.children) { Walk $r.Value } }

# Do not offer to send to the machine you are sitting at - it would just reopen the same page.
$me = $env:COMPUTERNAME.ToUpper()
$selfTarget = switch ($me) { '301SERVER' { 'beast' } 'JEFFSLAPTOP' { 'acer' } default { '' } }

foreach ($t in $targets) {
    $js = New-Bookmarklet $t.To
    $existing = @($bar.children | Where-Object { $_.name -eq $t.Name })
    if ($t.To -eq $selfTarget) {
        # still install it - Edge SYNCS, so this bar is shared with the other machine where it IS useful
        L $t.Name 'installed (no-op on this machine, useful on the other via sync)'
    }
    if ($existing.Count -gt 0) {
        foreach ($e in $existing) { $e.url = $js }
        L $t.Name 'already present - URL refreshed'
    } else {
        $script:maxId++
        $new = [pscustomobject]@{
            date_added = ([DateTimeOffset]::UtcNow.ToUnixTimeSeconds() + 11644473600) * 1000000
            guid       = [guid]::NewGuid().ToString()
            id         = "$script:maxId"
            name       = $t.Name
            type       = 'url'
            url        = $js
        }
        $bar.children = @($bar.children) + $new
        L $t.Name 'ADDED to the bookmarks bar'
    }
}

$json | ConvertTo-Json -Depth 100 -Compress | Set-Content $bm -Encoding UTF8
Remove-Item "$prof\Bookmarks.bak" -Force -EA SilentlyContinue

# clear the integrity MAC or Edge throws the file away without a word
$lsj = Get-Content $ls -Raw | ConvertFrom-Json
if ($lsj.protection.macs.bookmarks) {
    $lsj.protection.macs.PSObject.Properties.Remove('bookmarks')
    $lsj | ConvertTo-Json -Depth 100 -Compress | Set-Content $ls -Encoding UTF8
    L 'integrity MAC' 'cleared (Edge re-signs on next launch)'
} else { L 'integrity MAC' 'none present' }

$barNow = (Get-Content $bm -Raw | ConvertFrom-Json).roots.bookmark_bar.children
foreach ($t in $targets) {
    $found = @($barNow | Where-Object { $_.name -eq $t.Name }).Count -gt 0
    L ("verified: " + $t.Name) $(if($found){'yes'}else{'NO - something went wrong'})
}
L 'relay they post to' $relayBase
Write-Output ""
Write-Output "  Edge must be RESTARTED for them to appear. They then sync to the other machine on their own."
