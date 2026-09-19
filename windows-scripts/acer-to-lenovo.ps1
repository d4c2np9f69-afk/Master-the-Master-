# Runs on the Acer. Why can't it reach the Lenovo (192.168.1.173)?
$L='192.168.1.173'
Write-Output "host: $env:COMPUTERNAME  ->  Lenovo $L"
Write-Output "  ping            : $(Test-Connection $L -Count 2 -Quiet)"
foreach ($p in 445,139,5357,22) {
    $c=New-Object System.Net.Sockets.TcpClient
    try{$a=$c.BeginConnect($L,$p,$null,$null);$ok=$a.AsyncWaitHandle.WaitOne(2000);if($ok){$c.EndConnect($a)}}catch{$ok=$false}finally{$c.Close()}
    $what=switch($p){445{'SMB files'}139{'SMB legacy'}5357{'WSD/discovery'}22{'ssh'}}
    Write-Output ("  tcp/{0,-5} {1,-14}: {2}" -f $p,$what,$ok)
}
Write-Output "  -- can it list shares? --"
$v = net view \\$L 2>&1
$v | Select-Object -First 6 | ForEach-Object { Write-Output "    $_" }