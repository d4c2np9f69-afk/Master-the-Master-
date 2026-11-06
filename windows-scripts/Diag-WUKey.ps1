<#
  Diag-WUKey.ps1  - 2026-08-22
  The key in HCC-secrets returned 401 while the live app still serves real
  station data. Work out WHICH key is good without ever printing a key.
  Prints only: length, first 4 / last 4 chars, and the HTTP result.
#>
$ErrorActionPreference = 'Continue'
$station = 'KTNWHITE21'

function Show-Key($label, $k) {
    if ([string]::IsNullOrWhiteSpace($k)) { Write-Output ("{0,-22} : (empty)" -f $label); return }
    $head = $k.Substring(0, [math]::Min(4, $k.Length))
    $tail = $k.Substring([math]::Max(0, $k.Length - 4))
    Write-Output ("{0,-22} : len {1}  {2}...{3}" -f $label, $k.Length, $head, $tail)
}

function Test-Key($label, $k) {
    if ([string]::IsNullOrWhiteSpace($k)) { Write-Output ("  {0,-22} -> skipped (empty)" -f $label); return }
    $u = "https://api.weather.com/v2/pws/observations/current?stationId=$station&format=json&units=e&apiKey=$k"
    try {
        $r = Invoke-RestMethod -Uri $u -TimeoutSec 25
        Write-Output ("  {0,-22} -> HTTP 200  LIVE  (obs {1})" -f $label, $r.observations[0].obsTimeLocal)
    } catch {
        $code = 'ERR'
        if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode }
        Write-Output ("  {0,-22} -> HTTP {1}  DEAD" -f $label, $code)
    }
}

# --- candidate A: the secrets file, raw-trimmed ---
$fileRaw = Get-Content 'C:\Users\jeffl\HCC-secrets\weather_underground_api_key.txt' -Raw
$kFile = $fileRaw.Trim()

# --- candidate B: any 20+ char hex/alnum token found in that file ---
$mFile = [regex]::Matches($fileRaw, '[A-Za-z0-9]{25,}')
$kFileTok = $null
if ($mFile.Count -gt 0) { $kFileTok = $mFile[$mFile.Count - 1].Value }

# --- candidate C: the fallback still sitting in public repo code ---
$wj = Get-Content 'C:\Users\jeffl\Documents\GitHub\master-the-master-\functions\api\weather.js' -Raw
$mCode = [regex]::Matches($wj, "'[A-Za-z0-9]{25,}'")
$kCode = $null
if ($mCode.Count -gt 0) { $kCode = $mCode[0].Value.Trim("'") }

Write-Output "=== WU KEY DIAGNOSTIC (no key is printed) ==="
Write-Output ("secrets file bytes    : " + $fileRaw.Length + "  lines " + ($fileRaw -split "`n").Count)
Show-Key 'A secrets-file trimmed' $kFile
Show-Key 'B token from file'      $kFileTok
Show-Key 'C fallback in code'     $kCode
if ($kFileTok -and $kCode) {
    if ($kFileTok -eq $kCode) { Write-Output "B and C are the SAME key" } else { Write-Output "B and C are DIFFERENT keys" }
}
Write-Output ""
Write-Output "--- live test against api.weather.com ---"
Test-Key 'A secrets-file trimmed' $kFile
Test-Key 'B token from file'      $kFileTok
Test-Key 'C fallback in code'     $kCode
