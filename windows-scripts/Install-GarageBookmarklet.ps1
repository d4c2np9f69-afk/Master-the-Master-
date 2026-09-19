# Adds a "SEND TO GARAGE" bookmarklet to Edge's bookmarks bar.
#
# One click while a video is playing:
#   - reads the <video> element's currentTime (works on YouTube and any site
#     with an HTML5 video, not just YouTube)
#   - rebuilds the URL with &t=<seconds>s
#   - posts it to the relay on the Beast
#   - the garage machine opens it within ~3 s at that exact second
#
# Installed on the ACER deliberately: Edge is signed in as
# jeff.loewen@comcast.net and SYNCS, so it propagates to the Beast on its own -
# no need to touch the Beast while Angela is watching the news on that screen.
#
# 🔴 Edge keeps an integrity MAC of the Bookmarks file in Local State. If the
# file is edited and that MAC is not cleared, Edge SILENTLY DISCARDS the whole
# file - which is how a previous session lost bookmarks. Clear the MAC entry and
# Edge re-signs it on next launch. Both files are backed up first.
$ErrorActionPreference = 'SilentlyContinue'
function L($a,$b){ Write-Output ("  {0,-34} {1}" -f $a,$b) }

$relay = 'http://192.168.1.194:8099/send?u='
# single-line bookmarklet; no double quotes inside so the JSON stays clean
# Handles three cases in one click:
#   video  -> append &t=<currentTime>s so it resumes at the exact second
#   pdf    -> keep #page=N if the viewer put one in the URL
#   other  -> send the page as-is
$js = "javascript:(function(){var u;var v=document.querySelector('video');if(v){u=location.href.split('&t=')[0].split('#')[0];u+=(u.indexOf('?')>-1?'&':'?')+'t='+Math.floor(v.currentTime)+'s';}else{u=location.href;}var w=window.open('$relay'+encodeURIComponent(u),'_blank','width=420,height=220');setTimeout(function(){if(w)w.close();},1500);})()"

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

$existing = @($bar.children | Where-Object { $_.name -eq 'SEND TO GARAGE' })
if ($existing.Count -gt 0) {
    foreach ($e in $existing) { $e.url = $js }
    L 'bookmarklet' 'already present - URL refreshed'
} else {
    # ids must be unique; take one past the current maximum
    $maxId = 0
    function Walk($n){ if ($n.id) { $i=[int]$n.id; if ($i -gt $script:maxId) { $script:maxId = $i } }; if ($n.children) { foreach ($c in $n.children) { Walk $c } } }
    foreach ($r in $json.roots.PSObject.Properties) { if ($r.Value.children) { Walk $r.Value } }
    $new = [pscustomobject]@{
        date_added    = ([DateTimeOffset]::UtcNow.ToUnixTimeSeconds() + 11644473600) * 1000000
        guid          = [guid]::NewGuid().ToString()
        id            = "$($maxId + 1)"
        name          = 'SEND TO GARAGE'
        type          = 'url'
        url           = $js
    }
    $bar.children = @($bar.children) + $new
    L 'bookmarklet' 'ADDED to the bookmarks bar'
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

$check = (Get-Content $bm -Raw | ConvertFrom-Json).roots.bookmark_bar.children | Where-Object { $_.name -eq 'SEND TO GARAGE' }
L 'verified in file' $(if($check){'yes'}else{'NO - something went wrong'})
L 'relay it posts to' $relay
Write-Output ""
Write-Output "  Edge must be RESTARTED for it to appear. It then syncs to the Beast on its own."
