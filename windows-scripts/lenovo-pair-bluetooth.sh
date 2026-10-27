#!/bin/bash
# RUN THIS WHEN THE DONGLE ARRIVES. Jeff, 2026-09-19 10:17: "But I don't need
# more cables on my work bench I will get the dongal."
#
# He plugs the dongle into the garage Lenovo and walks away. Claude runs this
# from the Beast over SSH - no menus, no bluetoothctl fiddling in the garage.
#
# Everything this needs is ALREADY on that machine, verified 2026-09-19:
#   kernel 7.0.0-31 / Ubuntu 26.04.1 LTS   (btrtl needs 5.8+)
#   modules btusb, btrtl, btbcm, btintel
#   firmware /lib/firmware/rtl_bt/ - 46 files incl. rtl8761b_fw.bin,
#            rtl8761bu_fw.bin, rtl8761cu_fw.bin  <- the thing forum posts lack
#   bluez 5.85 + libspa-0.2-bluetooth (A2DP), pipewire + wireplumber active
#
# Usage:
#   bash lenovo-pair-bluetooth.sh              # scan and LIST what it can see
#   bash lenovo-pair-bluetooth.sh AA:BB:CC:..  # pair+trust+connect that address
set -u
MAC="${1:-}"
export XDG_RUNTIME_DIR="/run/user/$(id -u)"
export DBUS_SESSION_BUS_ADDRESS="unix:path=$XDG_RUNTIME_DIR/bus"

echo "=== 1. did the dongle actually enumerate? ==="
n=$(ls /sys/class/bluetooth 2>/dev/null | wc -l)
echo "  /sys/class/bluetooth entries: $n"
if [ "$n" -eq 0 ]; then
    echo "  NO CONTROLLER. The dongle is not seen by the kernel."
    echo "  Check: is it seated? Try the other USB port. Then:"
    lsusb 2>/dev/null | tail -4 | sed 's/^/      /'
    echo "  (a working RTL8761B shows as 0bda:8771 Realtek)"
    exit 1
fi
lsusb 2>/dev/null | grep -iE '0bda:|8087:0a2|0a12:|blue' | sed 's/^/  USB: /'
dmesg 2>/dev/null | grep -i 'bluetooth' | tail -4 | sed 's/^/  /'

echo ""
echo "=== 2. bring the service and controller up ==="
sudo systemctl enable --now bluetooth >/dev/null 2>&1
sleep 2
echo "  service: $(systemctl is-active bluetooth) / $(systemctl is-enabled bluetooth)"
sudo rfkill unblock bluetooth 2>/dev/null
bluetoothctl power on >/dev/null 2>&1
sleep 1
bluetoothctl show 2>/dev/null | grep -E 'Name:|Powered:|Discoverable:|Alias:' | sed 's/^/  /'

if [ -z "$MAC" ]; then
    echo ""
    echo "=== 3. SCANNING 15s - put the speakers in pairing mode NOW ==="
    bluetoothctl --timeout 15 scan on >/dev/null 2>&1
    echo "  --- everything found ---"
    bluetoothctl devices 2>/dev/null | sed 's/^/  /'
    echo ""
    echo "  Re-run with the speaker's address to finish, e.g.:"
    echo "     bash lenovo-pair-bluetooth.sh AA:BB:CC:DD:EE:FF"
    exit 0
fi

echo ""
echo "=== 3. pair + trust + connect $MAC ==="
bluetoothctl --timeout 12 scan on >/dev/null 2>&1
for cmd in "pair $MAC" "trust $MAC" "connect $MAC"; do
    out=$(bluetoothctl $cmd 2>&1 | tail -1)
    echo "  $cmd -> $out"
    sleep 2
done
# trust matters: without it the speakers will not reconnect on their own later
echo "  paired : $(bluetoothctl info $MAC 2>/dev/null | grep -c 'Paired: yes')"
echo "  trusted: $(bluetoothctl info $MAC 2>/dev/null | grep -c 'Trusted: yes')"

echo ""
echo "=== 4. make it the DEFAULT sink so video sound goes there automatically ==="
sleep 3
sink=$(pactl list short sinks 2>/dev/null | grep -i bluez | awk '{print $2}' | head -1)
if [ -n "$sink" ]; then
    pactl set-default-sink "$sink"
    pactl set-sink-mute "$sink" 0
    pactl set-sink-volume "$sink" 60%
    echo "  default sink: $sink"
    echo ""
    echo "=== 5. PROVE it - a tone should play through the speakers now ==="
    timeout 6 speaker-test -t sine -f 440 -l 1 >/dev/null 2>&1 && echo "  tone played" || echo "  tone failed"
else
    echo "  NO bluez sink appeared. Connected but not offering audio -"
    echo "  check the speakers are in A2DP mode, not a phone/headset profile."
    pactl list short sinks 2>/dev/null | sed 's/^/    /'
fi
