@echo off
rem Runs on the BEAST at logon (task HCC-Map-Lenovo-SMB).
rem Despite the historical name this maps the WHOLE network - a 4th logon task would have duplicated
rem the three that already exist (OPEN_ITEMS #195: duplicating existing machinery is how time gets lost).
rem
rem ---- 2026-09-23: THE FIX FOR "Network -> <PC> asks for a password" ----
rem Explorer's Network node connects BY NAME (\\JEFFSLAPTOP). To the SMB redirector that is a DIFFERENT
rem server identity than \\192.168.1.176, so a drive mapped by IP does NOT cover it. With no session of
rem its own Windows offers Jeff's MICROSOFT ACCOUNT (MicrosoftAccount\jeff.loewen@comcast.net), the far
rem end answers 0xC0000064 "user name does not exist", and Explorer shows the credential box.
rem ForceGuest CANNOT fix it - that only demotes LOCAL accounts to Guest, and an MSA logon is not local.
rem IPC$ sessions cannot be /persistent, which is exactly why this belongs in a logon task.
rem
rem TWO FILE TRAPS THIS SCRIPT WAS BITTEN BY, BOTH ON 2026-09-23 - keep them in mind before editing:
rem   1. it MUST be CRLF; written LF-only every line failed
rem   2. a bash heredoc COLLAPSES \\ to \, which produced "System error 67 network name not found"
rem      on every line while the identical command typed by hand worked. ACCESS_MAP documents this.
set LOG=C:\Users\jeffl\map-network.log
echo ==== %DATE% %TIME% ==== > "%LOG%"
net use L: /delete /y >nul 2>&1
net use L: \\192.168.1.173\GarageFiles /user:Guest "" /persistent:yes >> "%LOG%" 2>&1
net use A: /delete /y >nul 2>&1
net use A: \\192.168.1.176\Users\jeffl /user:Guest "" /persistent:yes >> "%LOG%" 2>&1
echo -- IPC$ Guest sessions BY NAME (this is what fixes the Network double-click) >> "%LOG%"
net use \\JEFFSLAPTOP\IPC$ /user:Guest "" >> "%LOG%" 2>&1
net use \\GARAGELAPTOP\IPC$ /user:Guest "" >> "%LOG%" 2>&1
echo -- PROOF: share enumeration BY NAME >> "%LOG%"
net view \\JEFFSLAPTOP >> "%LOG%" 2>&1
net view \\GARAGELAPTOP >> "%LOG%" 2>&1
net use >> "%LOG%" 2>&1
