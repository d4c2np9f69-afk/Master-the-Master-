# Verify-GarageStick.ps1 - PROVE the KitchenPC install stick is ready, do not assert it.
#
# Jeff, 2026-09-23: "double and triple check the stick to make sure that when it loads the HP all
# this is already there to just integrate into the network ... I'm not gonna go through all this
# again with that computer."
#
# Run it any time the stick is plugged in. READ ONLY - it changes nothing.
# Every check here is earned by a real failure:
#   - a .sh with CRLF fails on Linux while Git-Bash's `bash -n` says it is fine, so COUNT BYTES
#   - `bash -n` does NOT look inside heredocs, so the embedded watcher is extracted and checked
#   - `shutdown: poweroff` is load-bearing: `reboot` + a USB-first BIOS re-wipes the machine it
#     just built (2026-09-01, Jeff ran a script twice and boot-looped this very box)
#   - the embedded SSH key must match THIS Beast, or Claude cannot finish the job remotely

$ErrorActionPreference = 'SilentlyContinue'
$script:pass = 0; $script:fail = 0; $script:skip = 0
function Say($t) { Write-Host ""; Write-Host "--- $t" -ForegroundColor Cyan }
function Result($name, $ok, $proof) {
    if ($ok -is [string]) { Write-Host ("  SKIP  {0,-46} {1}" -f $name, $proof) -ForegroundColor DarkGray; $script:skip++ }
    elseif ($ok)          { Write-Host ("  PASS  {0,-46} {1}" -f $name, $proof) -ForegroundColor Green;    $script:pass++ }
    else                  { Write-Host ("  FAIL  {0,-46} {1}" -f $name, $proof) -ForegroundColor Red;      $script:fail++ }
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ("  KITCHENPC STICK VERIFICATION   " + (Get-Date -Format 'ddd yyyy-MM-dd h:mm tt')) -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# find the stick by CONTENT, not by drive letter - letters move between sessions
$stick = $null
foreach ($d in (Get-PSDrive -PSProvider FileSystem).Root) {
    if ((Test-Path (Join-Path $d 'autoinstall.yaml')) -and (Test-Path (Join-Path $d 'casper'))) { $stick = $d; break }
}
if (-not $stick) {
    Say "STICK NOT FOUND"
    Result 'install stick present' 'skip' 'no drive has autoinstall.yaml + casper - plug it in'
    Write-Host ""
    Write-Host ("  {0} PASS   {1} FAIL   {2} SKIP" -f $script:pass, $script:fail, $script:skip) -ForegroundColor Yellow
    Write-Host "  A SKIP IS NOT A PASS. The stick was not checked." -ForegroundColor Yellow
    exit 0
}
Write-Host ("  stick found at {0}" -f $stick) -ForegroundColor Green

Say "1. AUTOINSTALL - it must build the right machine and then STOP"
$aiPath  = Join-Path $stick 'autoinstall.yaml'
$ai      = Get-Content $aiPath -Raw
$aiBytes = [IO.File]::ReadAllBytes($aiPath)
$crCount = @($aiBytes | Where-Object { $_ -eq 13 }).Count
Result 'autoinstall.yaml is LF (no CR)' ($crCount -eq 0) "CR bytes = $crCount (CRLF breaks cloud-init)"
Result 'hostname KitchenPC'  ($ai -match 'hostname:\s*KitchenPC') 'not GaragePC - the Lenovo is the garage machine'
Result 'creates user jeff'   ($ai -match 'username:\s*jeff')      'matches the rest of the house'
Result 'shutdown: poweroff'  ($ai -match 'shutdown:\s*poweroff')  'LOAD-BEARING: reboot + USB-first BIOS = re-wipe'
Result 'installs openssh-server' ($ai -match 'openssh-server')    'Claude finishes the job remotely'
Result 'copies GARAGE-SETUP to the new home' ($ai -match 'GARAGE-SETUP') 'the setup script lands on the box'

$keyOnStick = [regex]::Match($ai, 'ssh-ed25519 (\S+)').Groups[1].Value
$beastKey = ''
$pub = Join-Path $env:USERPROFILE '.ssh\id_ed25519.pub'
if (Test-Path $pub) { $beastKey = ((Get-Content $pub -Raw) -split '\s+')[1] }
Result 'embedded key matches THIS Beast' ($keyOnStick -and $keyOnStick -eq $beastKey) 'otherwise Claude cannot log in afterwards'

Say "2. BOOT MENU - this is the only screen Jeff ever touches"
$g = Get-Content (Join-Path $stick 'boot\grub\grub.cfg') -Raw
$entries = [regex]::Matches($g, 'menuentry\s+"([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
$autoEntries = @($entries | Where-Object { $_ -match 'AUTO' })
Result 'AUTO INSTALL entries exist' ($autoEntries.Count -ge 1) ("{0} found" -f $autoEntries.Count)
Result 'they are labelled KitchenPC' (-not ($autoEntries -match 'GaragePC')) 'a wrong label is how the wrong box gets wiped'
$blocks = $g -split 'menuentry\s+"'
$allAuto = $true
foreach ($b in $blocks[1..($blocks.Count-1)]) {
    $n = $b.Split('"')[0]
    if ($n -match 'AUTO') {
        $lin = ($b -split "`n") | Where-Object { $_.Trim().StartsWith('linux') }
        if (-not ($lin -match 'autoinstall')) { $allAuto = $false }
    }
}
Result 'every AUTO entry carries autoinstall' $allAuto 'without it the installer just sits there asking questions'
Result 'manual entries preserved' (@($entries | Where-Object { $_ -match 'original entry' }).Count -ge 1) 'the stick can never be made unbootable'

# 2026-09-23, EARNED THE HARD WAY - 2 hours and five boots. This is a DESKTOP ISO, so the installer
# that launches after the live session is GRAPHICAL. `nomodeset` disables the real display driver,
# which is right for a text installer on old hardware and exactly WRONG here: the live session boots
# fine, then the installer has nowhere to draw and sprays escape codes at the console. It failed at
# the identical line every single time. The previous verifier passed this stick 29/0/0 because it
# checked that the AUTO entries CARRY `autoinstall` - it never asked whether the entry could
# actually run the installer. Structure, not function.
$isDesktopIso = (Test-Path (Join-Path $stick 'casper\minimal.squashfs')) -or ((Get-Content (Join-Path $stick '.disk\info') -Raw -ErrorAction SilentlyContinue) -notmatch 'Server')
$defLine = [regex]::Match($g, '(?m)^\s*set\s+default=(\d+)')
$defIdx  = if ($defLine.Success) { [int]$defLine.Groups[1].Value } else { 0 }
$defName = if ($defIdx -lt $entries.Count) { $entries[$defIdx] } else { '(out of range)' }
$defBody = if ($defIdx -lt ($blocks.Count - 1)) { $blocks[$defIdx + 1] } else { '' }
$defKernel = (($defBody -split "`n") | Where-Object { $_.Trim().StartsWith('linux') }) -join ' '
Result 'default entry is an AUTO INSTALL one' ($defName -match 'AUTO') "default=$defIdx -> $defName"
if ($isDesktopIso) {
    Result 'default entry does NOT force nomodeset' ($defKernel -notmatch 'nomodeset') `
        $(if ($defKernel -match 'nomodeset') { 'FATAL on a DESKTOP ISO - the graphical installer gets no display driver' } else { 'graphical installer can start' })
} else {
    Result 'default entry nomodeset check' 'skip' 'not a desktop ISO - a text installer is fine with nomodeset'
}
Result 'grub braces balanced' ((([regex]::Matches($g,'{')).Count) -eq (([regex]::Matches($g,'}')).Count)) 'an unbalanced brace = no boot menu at all'

Say "3. SETUP SCRIPTS - LF endings, counted in BYTES"
foreach ($f in (Get-ChildItem (Join-Path $stick 'GARAGE-SETUP') -Filter *.sh)) {
    $b  = [IO.File]::ReadAllBytes($f.FullName)
    $cr = @($b | Where-Object { $_ -eq 13 }).Count
    Result ("LF endings: " + $f.Name) ($cr -eq 0) ("CR bytes = $cr  (Git-Bash grep lies about this)")
}

Say "4. IT MUST ARRIVE ALREADY PART OF THE HOUSE (Jeff: 'just integrate into the network')"
$hp = Get-Content (Join-Path $stick 'GARAGE-SETUP\garage-hp-setup.sh') -Raw
$want = [ordered]@{
  'joins the LOEWEN301 workgroup'       = 'workgroup = LOEWEN301'
  'shares its own files to guest'       = 'guest ok = yes'
  'samba signs (Win11 guest needs it)'  = 'server signing = required'
  'name resolution (netbios/nmbd)'      = 'disable netbios = no'
  'mounts the Beast, no password'       = '/mnt/beast'
  'mounts the Acer, no password'        = '/mnt/acer'
  'FENCES credential folders'           = 'veto files'
  'handoff watcher installed'           = 'handoff-watcher.sh'
  'handoff polls its own queue'         = 'for=kitchen'
  'handoff survives reboot (linger)'    = 'enable-linger'
  'installs the Beast SSH key first'    = 'authorized_keys'
  'self-verifies before Jeff walks off' = 'ALL CHECKS PASSED'
}
foreach ($k in $want.Keys) {
    Result $k ($hp -match [regex]::Escape($want[$k])) $want[$k]
}

Say "5. THE EMBEDDED WATCHER - bash -n does NOT look inside heredocs"
$m = [regex]::Match($hp, "(?s)<<'WATCH'`n(.*?)`nWATCH`n")
if ($m.Success) {
    $tmp = Join-Path $env:TEMP 'hcc-embedded-watcher.sh'
    [IO.File]::WriteAllText($tmp, $m.Groups[1].Value.Replace("`r`n","`n"))
    # Git Bash is installed here but is NOT on PowerShell's PATH, so Get-Command alone turned this
    # into a SKIP - and a skip is not a pass. Look in the known locations too.
    $bash = (Get-Command bash -ErrorAction SilentlyContinue).Source
    if (-not $bash) {
        foreach ($cand in 'C:\Program Files\Git\bin\bash.exe','C:\Program Files\Git\usr\bin\bash.exe','C:\Program Files (x86)\Git\bin\bash.exe') {
            if (Test-Path $cand) { $bash = $cand; break }
        }
    }
    if ($bash) {
        $out = & $bash -n $tmp 2>&1
        if ($LASTEXITCODE -eq 0) { Result 'embedded watcher is valid bash' $true 'bash -n clean' }
        else                     { Result 'embedded watcher is valid bash' $false "$out" }
    } else { Result 'embedded watcher is valid bash' 'skip' 'no bash on PATH to check with' }
    Remove-Item $tmp -ErrorAction SilentlyContinue
} else {
    Result 'embedded watcher present' $false 'WATCH heredoc not found - the HP would get no handoff'
}

Say "6. OFFLINE INSTALL - the HP may have no network while installing"
$deb = @(Get-ChildItem (Join-Path $stick 'pool') -Recurse -Filter 'openssh-server*.deb' -ErrorAction SilentlyContinue)
if ($deb.Count -ge 1) { Result 'openssh-server in the local pool' $true $deb[0].Name }
else                  { Result 'openssh-server in the local pool' $false 'MISSING - SSH would not survive an offline install' }

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
if ($script:fail) { $c = 'Yellow' } else { $c = 'Green' }
Write-Host ("  {0} PASS   {1} FAIL   {2} SKIP" -f $script:pass, $script:fail, $script:skip) -ForegroundColor $c
Write-Host "================================================================" -ForegroundColor Cyan
# 2026-09-23: THIS SCRIPT IS NO LONGER ALLOWED TO SAY "READY".
# It said exactly that at 29 PASS / 0 FAIL, one hour before the stick failed five boots in a row and
# cost Jeff half a day. Every check it runs is STRUCTURAL - the YAML parses, the entries carry the
# right flags, the files are LF. None of that is evidence an install can COMPLETE. A verifier
# written from the same assumptions as the thing it checks can only ever confirm those assumptions
# back to you. So the summary must state what it has never observed, out loud, every run, until a
# real install has actually happened and left the marker below.
$provenFile = Join-Path $stick 'GARAGE-SETUP\INSTALL-PROVEN.txt'
$proven = Test-Path $provenFile
if ($script:fail -eq 0 -and $proven) {
  Write-Host ("  STRUCTURALLY SOUND, and an install has been observed: " + ((Get-Content $provenFile -Raw).Trim())) -ForegroundColor Green
  Write-Host "  Boot: ESC -> F9 -> the USB device -> the default entry, then walk away." -ForegroundColor Green
} elseif ($script:fail -eq 0) {
  Write-Host "  STRUCTURALLY SOUND - but NEVER OBSERVED COMPLETING AN INSTALL." -ForegroundColor Yellow
  Write-Host ""
  Write-Host "  Every check above is about the SHAPE of the files, not whether this" -ForegroundColor Yellow
  Write-Host "  configuration can finish on that machine. Do not report this as 'ready'." -ForegroundColor Yellow
  Write-Host "  The honest sentence is: it looks right and has never been proven." -ForegroundColor Yellow
  Write-Host ""
  Write-Host "  When an install genuinely completes, record it so this stops nagging:" -ForegroundColor DarkGray
  Write-Host ("    Set-Content '" + $provenFile + "' " + '"installed OK <date> - <what came up>"') -ForegroundColor DarkGray
} else {
  Write-Host "  DO NOT BOOT IT YET - read the FAIL lines above." -ForegroundColor Yellow
}
Write-Host ""
