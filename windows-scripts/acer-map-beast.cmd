@echo off
rem Runs on the ACER at logon (task HCC-MapBeastAtLogon -> C:\HCC-SETUP\map-beast.cmd).
rem O: = the Beast's OneDrive. B: = EVERYTHING in Jeff's Beast profile. Guest, empty password.
rem
rem ---- 2026-09-23: THE FIX FOR "Network -> 301SERVER asks for a password" ----
rem Explorer's Network node connects BY NAME (\\301SERVER). To the SMB redirector that is a DIFFERENT
rem server identity than \\192.168.1.194, so the drive mappings below do NOT cover it. With no session
rem of its own Windows offers Jeff's MICROSOFT ACCOUNT (MicrosoftAccount\jeff.loewen@comcast.net), the
rem Beast answers 0xC0000064 "user name does not exist", and Explorer shows the credential box.
rem ForceGuest CANNOT fix it - that only demotes LOCAL accounts to Guest, and an MSA logon is not local.
rem IPC$ sessions cannot be /persistent, which is exactly why this belongs in a logon task.
rem MUST be CRLF, and never write \\ through a bash heredoc - it collapses to \ (error 67).
set LOG=C:\Users\jeffl\map-network.log
echo ==== %DATE% %TIME% ==== > "%LOG%"
net use O: /delete /y >nul 2>&1
net use O: \\192.168.1.194\OneDrive /user:Guest "" /persistent:yes >> "%LOG%" 2>&1
net use B: /delete /y >nul 2>&1
net use B: \\192.168.1.194\Users\jeffl /user:Guest "" /persistent:yes >> "%LOG%" 2>&1
echo -- IPC$ Guest sessions BY NAME (this is what fixes the Network double-click) >> "%LOG%"
net use \\301SERVER\IPC$ /user:Guest "" >> "%LOG%" 2>&1
net use \\GARAGELAPTOP\IPC$ /user:Guest "" >> "%LOG%" 2>&1
echo -- PROOF: share enumeration BY NAME >> "%LOG%"
net view \\301SERVER >> "%LOG%" 2>&1
net use >> "%LOG%" 2>&1
