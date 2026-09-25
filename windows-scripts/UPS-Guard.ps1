<#
.SYNOPSIS
    Watches the APC BN600U1R and shuts this PC down early in a real outage,
    so the AT&T router and switches keep the remaining battery.

.DESCRIPTION
    CEMC's line here shows classic RECLOSER behaviour: a fault trips the
    recloser open, it auto-closes 2-3 times over a few seconds to burn the
    fault clear, and either holds or locks out. Jeff describes it as
    "..--.-." - several interruptions in quick succession, 2+ times a week.

    Consequences for this design:
      * Each open/close is a separate hard cut. Sub-second events are common,
        so we poll fast (PowerStatus is a cheap API call, not WMI).
      * The shutdown decision must be TIME-based, not battery-percentage
        based. A percentage threshold can misfire during a transfer, which
        would mean a full shutdown twice a week - worse than the disease.
      * A whole reclose sequence that ends with power restored must be
        ridden through silently and simply logged.
      * Only a genuine lockout - mains absent for GraceSeconds continuously
        - triggers shutdown.

    The log doubles as a power-quality record of what CEMC delivers.

    Runs as SYSTEM from Scheduled Task "HCC UPS Guard" at boot.
#>

[CmdletBinding()]
param(
    # Mains must be continuously absent this long before we shut down.
    # Comfortably longer than any reclose sequence.
    [int]$GraceSeconds = 90,

    # Fast poll - reclose events are often well under a second.
    [double]$PollSeconds = 1,

    # Interruptions closer together than this are treated as one event.
    [int]$SequenceGapSeconds = 45,

    [string]$LogPath = 'C:\ProgramData\HCC\ups-guard.log'
)

$ErrorActionPreference = 'Stop'

function Write-Log {
    param([string]$Level, [string]$Message)
    try {
        $dir = Split-Path $LogPath -Parent
        if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
        if ((Test-Path $LogPath) -and ((Get-Item $LogPath).Length -gt 2MB)) {
            Move-Item $LogPath "$LogPath.old" -Force
        }
        $line = '{0}  {1,-9}  {2}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss.fff'), $Level, $Message
        Add-Content -Path $LogPath -Value $line -Encoding utf8
    } catch { }
}

Add-Type -AssemblyName System.Windows.Forms

function Get-MainsState {
    # $true = mains present, $false = on battery, $null = unreadable
    try {
        $s = [System.Windows.Forms.SystemInformation]::PowerStatus.PowerLineStatus
        switch ($s) {
            'Online'  { return $true }
            'Offline' { return $false }
            default   { return $null }   # Unknown
        }
    } catch { return $null }
}

function Get-Charge {
    try { (Get-CimInstance Win32_Battery -EA Stop | Select-Object -First 1).EstimatedChargeRemaining } catch { '?' }
}

Write-Log 'START' ("UPS Guard up. Grace={0}s Poll={1}s SeqGap={2}s" -f $GraceSeconds, $PollSeconds, $SequenceGapSeconds)

$outageStart   = $null   # start of the CURRENT continuous outage
$seqStart      = $null   # start of the current reclose SEQUENCE
$seqHits       = 0       # interruptions counted in this sequence
$seqOffTotal   = 0.0     # cumulative seconds of darkness in this sequence
$lastRestore   = $null
$warned        = $false

while ($true) {

    $mains = Get-MainsState
    $now   = Get-Date

    if ($mains -eq $false) {
        # ---------- on battery ----------
        if ($null -eq $outageStart) {
            $outageStart = $now
            $warned      = $false

            # new sequence, or another hit in the current one?
            if ($null -eq $seqStart -or ($null -ne $lastRestore -and ($now - $lastRestore).TotalSeconds -gt $SequenceGapSeconds)) {
                $seqStart    = $now
                $seqHits     = 1
                $seqOffTotal = 0.0
                Write-Log 'OUTAGE' ("Mains lost. Battery {0}%. Interruption #1 of this event." -f (Get-Charge))
            } else {
                $seqHits++
                Write-Log 'RECLOSE' ("Mains lost again - interruption #{0} of this event (recloser cycling). Battery {1}%." -f $seqHits, (Get-Charge))
            }
        }

        $elapsed = ($now - $outageStart).TotalSeconds

        if (-not $warned -and $elapsed -ge ($GraceSeconds / 2)) {
            $warned = $true
            $left = [int]($GraceSeconds - $elapsed)
            Write-Log 'WARN' ("Still dark after {0:N0}s - looks like a lockout, not a reclose." -f $elapsed)
            try { & msg.exe * /TIME:30 "Power is out. This PC shuts down in about $left seconds so the UPS can keep the network up." } catch { }
        }

        if ($elapsed -ge $GraceSeconds) {
            Write-Log 'SHUTDOWN' ("Mains gone {0:N0}s continuously ({1} interruption(s) this event). Battery {2}%. Shutting down to preserve UPS runtime for the router." -f $elapsed, $seqHits, (Get-Charge))
            Start-Sleep -Seconds 1
            & shutdown.exe /s /f /t 10 /c "UPS Guard: mains down $([int]$elapsed)s - shutting down to leave UPS runtime for the network."
            return
        }
    }
    elseif ($mains -eq $true) {
        # ---------- mains present ----------
        if ($null -ne $outageStart) {
            $dur = ($now - $outageStart).TotalSeconds
            $seqOffTotal += $dur
            $lastRestore  = $now
            Write-Log 'RIDE-THRU' ("Mains back after {0:N2}s. Event so far: {1} interruption(s), {2:N2}s total darkness. No shutdown." -f $dur, $seqHits, $seqOffTotal)
            $outageStart = $null
            $warned      = $false
        }
        elseif ($null -ne $seqStart -and $null -ne $lastRestore -and ($now - $lastRestore).TotalSeconds -gt $SequenceGapSeconds) {
            # sequence has gone quiet - close it out with a summary
            Write-Log 'EVENT-END' ("Power event over: {0} interruption(s), {1:N2}s total darkness, spanning {2:N1}s." -f $seqHits, $seqOffTotal, (($lastRestore - $seqStart).TotalSeconds))
            $seqStart = $null; $seqHits = 0; $seqOffTotal = 0.0; $lastRestore = $null
        }
    }
    else {
        # ---------- cannot read the UPS ----------
        if ($null -ne $outageStart) {
            Write-Log 'UNKNOWN' 'Lost contact with UPS mid-outage; clearing timer rather than risk a false shutdown.'
            $outageStart = $null
            $warned      = $false
        }
    }

    Start-Sleep -Seconds $PollSeconds
}
