@echo off
rem Double-click wrapper for Open-HomeSharing.ps1 - asks for Administrator, then runs the script and keeps the window open.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell -Verb RunAs -ArgumentList '-NoProfile -ExecutionPolicy Bypass -NoExit -File \"%~dp0Open-HomeSharing.ps1\"'"
