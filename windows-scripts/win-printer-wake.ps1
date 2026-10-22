# Make print jobs WAKE the printer instead of showing "offline". Forum-verified fix
# (HP community): WSD ports don't reliably wake a sleeping wireless printer; a
# Standard TCP/IP (raw 9100) port sends the job straight to the printer's IP, which
# wakes it. Repoint the OfficeJet print queues from WSD to a fixed IP port.
$ErrorActionPreference = 'Continue'
$IP = '192.168.1.208'
$PORT = "IP_$IP"

Write-Output "host: $env:COMPUTERNAME"

Write-Output "=== ensure a Standard TCP/IP port to the printer (raw 9100) ==="
if (-not (Get-PrinterPort -Name $PORT -EA SilentlyContinue)) {
    Add-PrinterPort -Name $PORT -PrinterHostAddress $IP
    Write-Output "  created $PORT -> $IP"
} else { Write-Output "  $PORT already exists" }

Write-Output ""
Write-Output "=== repoint the OfficeJet PRINT queues (leave Fax alone) ==="
$queues = Get-Printer | Where-Object { $_.Name -match 'OfficeJet 4650|HP444BD6' -and $_.Name -notmatch 'Fax' -and $_.PortName -match 'WSD' }
if (-not $queues) { Write-Output "  none on a WSD port (already on IP, or not present)" }
foreach ($q in $queues) {
    $old = $q.PortName
    Set-Printer -Name $q.Name -PortName $PORT -EA SilentlyContinue
    $now = (Get-Printer -Name $q.Name).PortName
    Write-Output ("  {0}: {1} -> {2}" -f $q.Name, $old, $now)
}

Write-Output ""
Write-Output "=== final state ==="
Get-Printer | Where-Object { $_.Name -match 'OfficeJet 4650|HP444BD6' } | ForEach-Object {
    Write-Output ("  {0}  [{1}]  status={2}" -f $_.Name, $_.PortName, $_.PrinterStatus)
}
Write-Output ""
Write-Output "  (a raw-9100 job to $IP wakes the printer from sleep - the WSD 'offline' stall is gone)"