@echo off
REM ============================================================================
REM  VPN OFF  -  drop the Windscribe tunnel and confirm the internet still works.
REM
REM  Deliberately does NOT re-enable WARP. WARP's mode has been misquoted from
REM  memory before; if it is wanted back, check `warp-cli --accept-tos settings`
REM  first and turn it on knowingly.
REM ============================================================================
setlocal
set WS="C:\Program Files\Windscribe\windscribe-cli.exe"

echo.
echo  Disconnecting Windscribe...
%WS% disconnect

echo.
echo  Where does the internet think you are now?
timeout /t 3 /nobreak >nul
powershell -NoProfile -Command "try{$r=Invoke-RestMethod ipinfo.io -TimeoutSec 15; Write-Host ''; Write-Host ('   Location : ' + $r.city + ', ' + $r.region); Write-Host ('   IP       : ' + $r.ip); Write-Host ''}catch{Write-Host '   Could not reach ipinfo.io.'}"

powershell -NoProfile -Command "try{$null=Invoke-WebRequest 'http://192.168.1.66:8123' -TimeoutSec 8 -UseBasicParsing; Write-Host '   Home Assistant answers - the house is reachable.'}catch{Write-Host '   *** HOME ASSISTANT DID NOT ANSWER - check the firewall state. ***'}"
echo.
echo  NOTE: WARP was NOT turned back on. Run 'warp-cli --accept-tos settings' to
echo        see its real mode before deciding - never quote it from memory.
echo.
pause
