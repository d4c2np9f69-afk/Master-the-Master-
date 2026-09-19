# The HP OfficeJet 4650 CANNOT be set to never auto-off - proven by PUTting every
# value to /DevMgmt/ProductConfigDyn.xml (only "2hours" returns 200; never/off/
# disabled/8hours all 400). So instead, keep its 2-hour inactivity timer from ever
# expiring: send a harmless PJL status query to the print port every so often. PJL
# INFO STATUS is processed by the printer's formatter (counts as activity) and
# prints NO page. Runs from the always-on Beast.
$IP = '192.168.1.208'; $PORT = 9100
try {
    $c = New-Object System.Net.Sockets.TcpClient
    $c.Connect($IP, $PORT)                 # a raw-9100 connect alone already wakes/touches it
    $s = $c.GetStream()
    # UEL + PJL status query + UEL. No PostScript/PCL job body => nothing prints.
    $pjl = "`e%-12345X@PJL INFO STATUS`r`n`e%-12345X"
    $bytes = [Text.Encoding]::ASCII.GetBytes($pjl)
    $s.Write($bytes, 0, $bytes.Length)
    $s.Flush()
    Start-Sleep -Milliseconds 300
    $c.Close()
    "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  keepalive sent OK" | Out-File 'C:\HCC-SETUP\printer-keepalive.log' -Append -Encoding ascii
    exit 0
} catch {
    "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  keepalive FAILED: $($_.Exception.Message)" | Out-File 'C:\HCC-SETUP\printer-keepalive.log' -Append -Encoding ascii
    exit 1
}