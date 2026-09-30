# ARM the Windows Memory Diagnostic on the Acer - no GUI, no stick-pulling, and
# NO reboot issued from here. It runs at the next restart, whenever that happens.
#
# WHY: RAM is the last suspect for the hard freezes. LPM, firmware, thermal,
# GPU/LiveKernelEvent 141 and "end of life" are all eliminated with evidence, and
# RAM has never actually been tested - the 09-18 19:58 run reads "canceled
# during execution".
#
# THE REAL FIND: {memdiag} testmix was set to EXTENDED, the exhaustive mix.
# That is where Jeff's "there is no other way to check the ram other then a
# 20 hour test?" came from. STANDARD covers the same modules in a fraction of
# the time. The 20 hours was a SETTING, not a fact about memory testing.
#
# /bootsequence is ONE-SHOT: it applies to the next boot only and does not
# permanently change what the machine boots into. After the test, Windows starts
# normally and writes the verdict to the System log as MemoryDiagnostics-Results.
# Esc aborts the test at the console.
$ErrorActionPreference = 'Continue'
function L($a,$b){ Write-Output ("  {0,-34} {1}" -f $a,$b) }

Write-Output "=== before ==="
bcdedit /enum '{memdiag}' 2>$null | Where-Object { $_ -match 'testmix|passcount|badmemory' } | ForEach-Object { Write-Output "    $($_.Trim())" }

Write-Output ""
Write-Output "=== set the test mix to STANDARD (was Extended = the 20-hour run) ==="
bcdedit /set '{memdiag}' testmix Standard 2>&1 | ForEach-Object { Write-Output "  $_" }
bcdedit /set '{memdiag}' passcount 2       2>&1 | ForEach-Object { Write-Output "  $_" }

Write-Output ""
Write-Output "=== after ==="
bcdedit /enum '{memdiag}' 2>$null | Where-Object { $_ -match 'testmix|passcount|badmemory' } | ForEach-Object { Write-Output "    $($_.Trim())" }

Write-Output ""
Write-Output "=== arm it for the NEXT boot (one-shot) ==="
bcdedit /bootsequence '{memdiag}' 2>&1 | ForEach-Object { Write-Output "  $_" }
$seq = bcdedit /enum '{bootmgr}' 2>$null | Select-String 'bootsequence'
L 'bootsequence now' $(if($seq){$seq.Line.Trim()}else{'NOT SET - arming failed'})

Write-Output ""
Write-Output "ARMED. The memory test runs at the next restart - no reboot was issued from here."
Write-Output "To disarm:  bcdedit /deletevalue {bootmgr} bootsequence"
