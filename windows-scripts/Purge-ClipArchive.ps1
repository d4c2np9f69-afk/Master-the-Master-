<#
  Purge-ClipArchive.ps1  -  built 2026-08-26

  WHY THIS EXISTS - Jeff's own words, 2026-08-26:
    "I wasn't gonna fill up my drive D with thousands of Blink clips that weren't purging...
     if they keep them for the exact same time that Blink keeps the cloud but delete the old
     ones in 14 days and just record keep recording fresh ones then that may be workable."

  That was a fair refusal. The clip producer (OPEN_ITEMS #61) was switched off on 08-21 partly
  because the archive grew forever with no prune. This removes that objection: a rolling window,
  enforced daily, so the archive can never become the reason to turn recording off again.

  IT ALSO REMOVES THE STUBS. OPEN_ITEMS #30: 40-byte files that are not video at all - they are
  Blink's error body, {"message":"Media not found","code":700}, written into a .mp4 because
  blinkpy's video_to_file checks only `response is None` and never `response.status`. The
  archiver then copies that garbage forward. Measured 2026-08-26: 23 of 157 files were stubs.

  SIZING, measured not guessed (2026-08-26): 157 files = 218.5 MB, D: had 825 GB free.
  At the record's ~2 MB per Outdoor 4 clip and ~50 events/day, a 14-day window is ~1.5 GB.

  SAFE BY DESIGN: only ever touches $ArchiveDir, only *.mp4, never recurses, and -WhatIf shows
  exactly what would go without deleting anything. It does NOT touch /config/www/blink_clips on
  Beehive (the live working files) - only the timestamped archive copies on the beast.
#>

param(
    [string] $ArchiveDir = 'D:\HCC-Clip-Archive',
    [int]    $KeepDays   = 14,
    [int]    $StubBytes  = 1024,          # anything this small is not a real clip
    [switch] $WhatIf
)

if (-not (Test-Path $ArchiveDir)) { Write-Host "Archive not found: $ArchiveDir"; exit 1 }

$cutoff = (Get-Date).AddDays(-$KeepDays)
$all    = Get-ChildItem -LiteralPath $ArchiveDir -File -Filter *.mp4 -ErrorAction SilentlyContinue

$old   = @($all | Where-Object { $_.LastWriteTime -lt $cutoff })
$stubs = @($all | Where-Object { $_.Length -le $StubBytes -and $_.LastWriteTime -ge $cutoff })
$doomed = @($old + $stubs | Sort-Object FullName -Unique)

Write-Host ""
Write-Host "=== HCC CLIP ARCHIVE PURGE ===" -ForegroundColor Cyan
Write-Host ("    {0}   |   keep {1} days (cutoff {2:yyyy-MM-dd HH:mm})" -f (Get-Date -Format 'dddd yyyy-MM-dd h:mm tt'), $KeepDays, $cutoff)
Write-Host ""
Write-Host ("before : {0} files, {1:N1} MB" -f $all.Count, (($all | Measure-Object Length -Sum).Sum / 1MB))
Write-Host ("older than {0}d : {1}" -f $KeepDays, $old.Count)
Write-Host ("stubs <= {0} bytes (not video - Blink error JSON, see OPEN_ITEMS #30) : {1}" -f $StubBytes, $stubs.Count)

if ($doomed.Count -eq 0) {
    Write-Host "nothing to remove." -ForegroundColor Green
} elseif ($WhatIf) {
    Write-Host ("WHATIF - would remove {0} files, freeing {1:N1} MB" -f $doomed.Count, (($doomed | Measure-Object Length -Sum).Sum / 1MB)) -ForegroundColor Yellow
    $doomed | Select-Object -First 15 | ForEach-Object { Write-Host ("   would delete  {0}  ({1} bytes, {2:yyyy-MM-dd})" -f $_.Name, $_.Length, $_.LastWriteTime) -ForegroundColor DarkGray }
} else {
    $freed = ($doomed | Measure-Object Length -Sum).Sum
    $doomed | Remove-Item -Force -ErrorAction SilentlyContinue
    Write-Host ("removed {0} files, freed {1:N1} MB" -f $doomed.Count, ($freed / 1MB)) -ForegroundColor Green
}

$after = Get-ChildItem -LiteralPath $ArchiveDir -File -Filter *.mp4 -ErrorAction SilentlyContinue
Write-Host ("after  : {0} files, {1:N1} MB   |   D: free {2:N0} GB" -f $after.Count, (($after | Measure-Object Length -Sum).Sum / 1MB), ((Get-PSDrive D).Free / 1GB))
Write-Host ""
