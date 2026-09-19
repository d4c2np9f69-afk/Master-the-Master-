#!/bin/bash
# Deployed to the Lenovo and run by Audit-Mesh-Reality.ps1. A FILE, not an
# inline ssh command - inlining has failed repeatedly in this project and an
# empty result reads like a broken machine instead of a broken command.
beast=$(ls /mnt/beast/OneDrive 2>/dev/null | wc -l)
acer=$(ls /mnt/acer 2>/dev/null | wc -l)
wsdd=$(systemctl is-active wsdd-host 2>/dev/null)
nmbd=$(systemctl is-active nmbd 2>/dev/null)
smbd=$(systemctl is-active smbd 2>/dev/null)
ena=$(systemctl is-enabled wsdd-host nmbd smbd ssh 2>/dev/null | tr '\n' ',' | sed 's/,$//')
clock=$(date +%H:%M:%S)
up=$(awk '{printf "%d", $1/60}' /proc/uptime)
# beast|acer|wsdd|nmbd|smbd|enabled|clock|uptimeMin
echo "${beast}|${acer}|${wsdd}|${nmbd}|${smbd}|${ena}|${clock}|${up}"
