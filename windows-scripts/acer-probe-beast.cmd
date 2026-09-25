@echo off
rem Runs ON the Acer (over SSH). Proves the Acer can open the Beast and the Lenovo with no password.
net use \\192.168.1.194\Users /user:Guest "" >nul 2>&1
echo --- Beast \\192.168.1.194\Users\jeffl
dir /b \\192.168.1.194\Users\jeffl 2>&1
echo --- Beast Documents count
dir /b \\192.168.1.194\Users\jeffl\Documents 2>&1 | find /c /v ""
net use \\192.168.1.173\GarageFiles /user:Guest "" >nul 2>&1
echo --- Lenovo \\192.168.1.173\GarageFiles
dir /b \\192.168.1.173\GarageFiles 2>&1 | find /c /v ""
