@echo off
rem Runs on the ACER at logon (task HCC-MapBeastAtLogon -> C:\HCC-SETUP\map-beast.cmd).
rem O: = the Beast's OneDrive (since 2026-09-18). B: = EVERYTHING in Jeff's Beast profile (2026-09-22,
rem Jeff: "pull up everything on the beast ... no passwords"). Guest, empty password, persistent.
net use O: /delete /y >nul 2>&1
net use O: \\192.168.1.194\OneDrive /user:Guest "" /persistent:yes
net use B: /delete /y >nul 2>&1
net use B: \\192.168.1.194\Users\jeffl /user:Guest "" /persistent:yes
net use C: >nul 2>&1
net use
