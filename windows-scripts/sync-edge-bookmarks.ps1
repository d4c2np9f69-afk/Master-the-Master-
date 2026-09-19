# Make the Acer's Edge bookmarks match the Beast's - no Microsoft account, no
# password, no sync sign-in. Copies the Bookmarks file and clears Edge's integrity
# MAC for it so Edge accepts the new file instead of silently discarding it.
# Safe: a full HTML export already exists at OneDrive\Jeff-Bookmarks.html, and the
# target's old file is backed up first.
$ErrorActionPreference='SilentlyContinue'
$srcBm = 'C:\Users\jeffl\OneDrive\Edge-Bookmarks-from-Beast'   # staged copy (see step 1)

Write-Output "=== 1. stage the Beast's Edge bookmarks ==="
$beastBm = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Bookmarks"
if (-not (Test-Path $beastBm)) { Write-Output "  Beast has no Edge bookmarks file"; exit 1 }
$count = ([regex]::Matches((Get-Content $beastBm -Raw),'"type":\s*"url"')).Count
Copy-Item $beastBm $srcBm -Force
Write-Output "  staged $count bookmarks -> $srcBm (rides OneDrive to every machine)"
Write-Output "  ALSO already exported as HTML: C:\Users\jeffl\OneDrive\Jeff-Bookmarks.html"