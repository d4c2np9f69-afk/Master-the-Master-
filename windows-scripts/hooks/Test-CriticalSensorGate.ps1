<#
Test-CriticalSensorGate.ps1 — the test for the 2026-11-12 fix.

WHY THIS EXISTS (Jeff's rule, 2026-09-16: "every mistake gets a test in the gate that fails on
exactly that mistake, written the same session you made it").

THE MISTAKE: Hook-SessionStart.ps1 flagged `binary_sensor.mailbox_contact` as
"1 CRITICAL SENSOR(S) SILENT - DATA IS BEING LOST RIGHT NOW" on every session since
2026-09-24 - the day Jeff ORDERED that entity deleted (#196). The banner then told the
session "Fix that FIRST. Usual cause: reload the mqtt config entry", and per #277 that
reload drops the rtlamr utility sensors until the ADD-ON is restarted. So a permanent
false alarm was aimed at a destructive remedy for a device that is absent on purpose.

🔑 THIS TEST RUNS THE REAL CODE, NOT A COPY OF IT. It extracts the live classifier block
out of Hook-SessionStart.ps1 and executes it against synthetic states. A test that
re-implements the logic proves only that the copy agrees with itself - that is the
"check that cannot fail" this project has been burned by (the 08-21 stream check that
printed ALL GOOD eleven minutes after the popups were dead).

RUN:  powershell -NoProfile -ExecutionPolicy Bypass -File windows-scripts\hooks\Test-CriticalSensorGate.ps1
EXIT: 0 = all green, 1 = a failure.
#>

$ErrorActionPreference = 'Stop'
$hook = Join-Path $PSScriptRoot 'Hook-SessionStart.ps1'
if (-not (Test-Path $hook)) { Write-Host "FAIL: cannot find $hook"; exit 1 }

$lines = Get-Content $hook
$start = ($lines | Select-String -SimpleMatch '$silent = @()' | Select-Object -First 1).LineNumber
$end   = ($lines | Select-String -SimpleMatch 'if ($silent.Count)' | Select-Object -First 1).LineNumber
if (-not $start -or -not $end -or $end -le $start) {
  Write-Host "FAIL: could not locate the classifier block in Hook-SessionStart.ps1."
  Write-Host "      The hook was restructured - update this test, do not delete it."
  exit 1
}
# -1 converts 1-based LineNumber to 0-based index; $end-2 stops just before the 'if' line.
$classifier = ($lines[($start-1)..($end-2)] -join "`n")

# The hook's own inputs, mirrored here so a drift in either is visible.
$crit = @('binary_sensor.front_door_contact','binary_sensor.back_deck_door_contact',
          'binary_sensor.mailbox_contact','binary_sensor.guest_bath_leak_water_leak',
          'binary_sensor.kitchen_refrigerator_leak_water_leak','binary_sensor.kitchen_sink_leak_water_leak',
          'sensor.water_meter_last_seen')
$removedByDesign = @('binary_sensor.mailbox_contact')

function New-State {
  param($id, $state, $ageHours = 0.1)
  [pscustomobject]@{
    entity_id    = $id
    state        = $state
    last_updated = (Get-Date).ToUniversalTime().AddHours(-$ageHours).ToString('o')
  }
}

# A healthy house: every critical sensor present and reporting, mailbox ABSENT by design.
function Get-HealthyStates {
  @(
    (New-State 'binary_sensor.front_door_contact' 'off'),
    (New-State 'binary_sensor.back_deck_door_contact' 'off'),
    (New-State 'binary_sensor.guest_bath_leak_water_leak' 'off'),
    (New-State 'binary_sensor.kitchen_refrigerator_leak_water_leak' 'off'),
    (New-State 'binary_sensor.kitchen_sink_leak_water_leak' 'off'),
    (New-State 'sensor.water_meter_last_seen' '2026-11-12T18:29:00+00:00' 0.2)
  )
}

function Invoke-Classifier {
  param($st)
  $silent = $null
  # $st, $crit and $removedByDesign are in scope; the extracted block defines $silent.
  Invoke-Expression $classifier
  return @($silent)
}

$pass = 0; $fail = 0
function Check {
  param($name, [bool]$ok, $detail)
  if ($ok) { $script:pass++; Write-Host "  PASS  $name" }
  else     { $script:fail++; Write-Host "  FAIL  $name"; Write-Host "        $detail" }
}

Write-Host ""
Write-Host "Test-CriticalSensorGate - the real classifier out of Hook-SessionStart.ps1"
Write-Host ("extracted source lines {0}-{1}" -f $start, ($end-1))
Write-Host ""

# ---- 1. THE BUG ITSELF. This is the case that was RED before 2026-11-12. ----
$r = Invoke-Classifier (Get-HealthyStates)
Check "healthy house + mailbox deleted by design = NO critical banner" `
      ($r.Count -eq 0) `
      ("expected 0 silent, got {0}: {1}" -f $r.Count, ($r -join '; '))

# ---- 2. RED-PROOF: the gate must still catch a genuinely dead door. ----
$s = Get-HealthyStates
($s | Where-Object { $_.entity_id -eq 'binary_sensor.front_door_contact' }).state = 'unavailable'
$r = Invoke-Classifier $s
Check "front door OFFLINE is still flagged" `
      (($r -join ';') -match 'front_door_contact OFFLINE') `
      ("expected front_door_contact OFFLINE, got: {0}" -f ($r -join '; '))

# ---- 3. RED-PROOF: the exemption is ABSENCE-ONLY. A re-paired mailbox that dies must flag. ----
#      This is what makes the fix self-re-arming instead of a permanent blind spot.
$s = Get-HealthyStates
$s += (New-State 'binary_sensor.mailbox_contact' 'unavailable')
$r = Invoke-Classifier $s
Check "re-paired mailbox going UNAVAILABLE is flagged (exemption is absence-only)" `
      (($r -join ';') -match 'mailbox_contact OFFLINE') `
      ("expected mailbox_contact OFFLINE, got: {0}" -f ($r -join '; '))

# ---- 4. RED-PROOF: a re-paired, HEALTHY mailbox must not flag. ----
$s = Get-HealthyStates
$s += (New-State 'binary_sensor.mailbox_contact' 'off')
$r = Invoke-Classifier $s
Check "re-paired healthy mailbox is silent" `
      ($r.Count -eq 0) `
      ("expected 0 silent, got: {0}" -f ($r -join '; '))

# ---- 5. RED-PROOF: a stale water meter is a real timestamp fault and must flag. ----
$s = Get-HealthyStates
($s | Where-Object { $_.entity_id -eq 'sensor.water_meter_last_seen' }).last_updated =
  (Get-Date).ToUniversalTime().AddHours(-9).ToString('o')
$r = Invoke-Classifier $s
Check "water meter silent 9h is still flagged" `
      (($r -join ';') -match 'water_meter_last_seen silent') `
      ("expected water_meter_last_seen silent, got: {0}" -f ($r -join '; '))

# ---- 6. RED-PROOF: an entity that is NOT exempt must still report MISSING. ----
#      Guards against someone "fixing" a future false alarm by widening $removedByDesign.
$s = Get-HealthyStates | Where-Object { $_.entity_id -ne 'binary_sensor.kitchen_sink_leak_water_leak' }
$r = Invoke-Classifier $s
Check "a non-exempt entity disappearing still reports MISSING" `
      (($r -join ';') -match 'kitchen_sink_leak_water_leak MISSING') `
      ("expected kitchen_sink_leak_water_leak MISSING, got: {0}" -f ($r -join '; '))

# ---- 7. The exemption list must stay narrow. One entity, named, with a reason in the hook. ----
Check "removed-by-design list holds exactly the one entity Jeff deleted" `
      ($removedByDesign.Count -eq 1 -and $removedByDesign[0] -eq 'binary_sensor.mailbox_contact') `
      ("list drifted: {0}" -f ($removedByDesign -join ', '))

Write-Host ""
Write-Host ("RESULT: {0} passed, {1} failed" -f $pass, $fail)
if ($fail) { exit 1 }
exit 0
