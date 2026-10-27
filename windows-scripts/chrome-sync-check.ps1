# Is Chrome signed in and syncing on this machine? Reads only the account email +
# sync flags from Chrome's Preferences - never tokens or passwords.
$ErrorActionPreference='SilentlyContinue'
$pref = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Preferences"
if (-not (Test-Path $pref)) { Write-Output "  Chrome profile not found on $env:COMPUTERNAME"; return }
$j = Get-Content $pref -Raw | ConvertFrom-Json
$emails = @($j.account_info | ForEach-Object { $_.email }) -join ', '
Write-Output "host            : $env:COMPUTERNAME"
Write-Output "signed-in acct  : $(if($emails){$emails}else{'(none - not signed in)'})"
Write-Output "sync requested  : $($j.sync.requested)"
Write-Output "sync first-setup: $($j.sync.has_setup_completed)"
# bookmarks count as a rough 'are they the same' signal
$bm = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Bookmarks"
if (Test-Path $bm) {
    $bj = Get-Content $bm -Raw | ConvertFrom-Json
    $count = ([regex]::Matches((Get-Content $bm -Raw),'"type":\s*"url"')).Count
    Write-Output "bookmarks       : $count urls"
} else { Write-Output "bookmarks       : none yet" }
$v = (Get-Item "$env:ProgramFiles\Google\Chrome\Application\chrome.exe" -EA SilentlyContinue).VersionInfo.ProductVersion
Write-Output "chrome version  : $v"