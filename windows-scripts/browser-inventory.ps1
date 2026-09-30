# What browsers does THIS Windows machine have, and do they hold bookmarks?
function Cnt($p){ if(Test-Path $p){ ([regex]::Matches((Get-Content $p -Raw),'"type":\s*"url"')).Count } else { '-' } }
Write-Output "host: $env:COMPUTERNAME"
Write-Output "  Edge installed    : $(Test-Path "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe")"
Write-Output "  Edge bookmarks    : $(Cnt "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Bookmarks")"
Write-Output "  Firefox installed : $((Test-Path "$env:ProgramFiles\Mozilla Firefox\firefox.exe") -or (Test-Path "${env:ProgramFiles(x86)}\Mozilla Firefox\firefox.exe"))"
$ff = Get-ChildItem "$env:APPDATA\Mozilla\Firefox\Profiles" -Directory -EA SilentlyContinue | Where-Object { Test-Path "$($_.FullName)\places.sqlite" }
foreach ($p in $ff) { $sz=[math]::Round((Get-Item "$($p.FullName)\places.sqlite").Length/1KB); Write-Output "  Firefox profile   : $($p.Name)  places.sqlite=$sz KB" }
if (-not $ff) { Write-Output "  Firefox profile   : none" }