@echo off
rem Double-click: asks for Administrator, then runs Allow-AnonymousBrowse.ps1 and keeps the window open.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell -Verb RunAs -ArgumentList '-NoProfile -ExecutionPolicy Bypass -NoExit -File \"%~dp0Allow-AnonymousBrowse.ps1\"'"
