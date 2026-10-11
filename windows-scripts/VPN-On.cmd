@echo off
REM ============================================================================
REM  VPN ON  -  connect Windscribe, in the ONE order that works on this machine.
REM
REM  Jeff, 2026-09-16 01:29: "There is no icon to turn Windscribe on, it's
REM  worthless to me if I can't turn it on." The app was installed and running the
REM  whole time - as a TRAY app with its icon hidden in the overflow. This is a
REM  button instead of a hunt.
REM
REM  ORDER MATTERS AND IT IS NOT OBVIOUS:
REM  WARP's DNS-over-HTTPS resolvers routed inside a Windscribe tunnel make every
REM  lookup time out (ENOTFOUND). That is what killed the 2026-09-04 to 09-08
REM  session. WARP comes DOWN first, every time.
REM
REM  Free tier is 15 GB/month (Jeff, 2026-09-16) - fine for browsing, not for
REM  streaming or large downloads.
REM ============================================================================
setlocal
set WS="C:\Program Files\Windscribe\windscribe-cli.exe"

echo.
echo  [1/3] Taking WARP down first  (skip this and DNS dies)
warp-cli --accept-tos disconnect 2>nul
if errorlevel 1 echo        WARP was not connected - fine, carrying on.

echo.
echo  [2/3] Connecting Windscribe...
%WS% connect best
if errorlevel 1 (
  echo.
  echo  *** CONNECT FAILED. If it says "Logging in", open the Windscribe window
  echo  *** from the tray and sign in once, then run this again.
  pause
  exit /b 1
)

echo.
echo  [3/3] Verifying where the internet thinks you are...
echo        (checking ipinfo.io - never trust the app's own claim)
timeout /t 4 /nobreak >nul
powershell -NoProfile -Command "try{$r=Invoke-RestMethod ipinfo.io -TimeoutSec 15; Write-Host ''; Write-Host ('   Location : ' + $r.city + ', ' + $r.region + ', ' + $r.country); Write-Host ('   IP       : ' + $r.ip); Write-Host ('   Carrier  : ' + $r.org); Write-Host ''; if($r.region -eq 'Tennessee'){Write-Host '   *** STILL IN TENNESSEE - the tunnel did NOT take. ***'}else{Write-Host '   OK - you are no longer showing as Tennessee.'} }catch{Write-Host '   Could not reach ipinfo.io - check the connection.'}"

echo.
echo  Checking the house is still reachable...
powershell -NoProfile -Command "try{$null=Invoke-WebRequest 'http://192.168.1.66:8123' -TimeoutSec 8 -UseBasicParsing; Write-Host '   Home Assistant answers - the house is still reachable.'}catch{Write-Host '   *** HOME ASSISTANT DID NOT ANSWER. ***'; Write-Host '   *** Check Allow LAN Traffic is ON in Windscribe settings. ***'; Write-Host '   *** Do NOT turn the firewall off to fix it. ***'}"
echo.
pause
