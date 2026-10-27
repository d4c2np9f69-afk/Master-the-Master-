#!/bin/bash
# Does the Lenovo B570 have Bluetooth, and is it on? Timeout-guarded so nothing hangs.
echo "-- rfkill (is BT blocked?) --"
rfkill list 2>/dev/null || echo "rfkill n/a"
echo
echo "-- USB Bluetooth device? --"
lsusb 2>/dev/null | grep -i blue || echo "no USB BT module"
echo
echo "-- kernel mentions of bluetooth --"
sudo dmesg 2>/dev/null | grep -i bluetooth | tail -4 || echo "none"
echo
echo "-- bluetooth service --"
echo "enabled=$(systemctl is-enabled bluetooth 2>/dev/null) active=$(systemctl is-active bluetooth 2>/dev/null)"
echo
echo "-- controller (5s timeout) --"
timeout 5 bluetoothctl show 2>/dev/null | head -6 || echo "no controller found (B570 may have no BT hardware)"
