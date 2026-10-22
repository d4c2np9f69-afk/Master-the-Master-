#!/bin/bash
# Make the Lenovo come ALL the way back on its own after a reboot or power outage:
# WiFi auto-reconnects, SSH is up, the watchdog runs, it advertises on the network,
# and the Beast's share re-mounts. Checks each, fixes WiFi autoconnect if needed.
set -u
echo "=== WiFi: does it auto-reconnect? (the key one for a power outage) ==="
CON=$(nmcli -t -f NAME,TYPE connection show | grep -i wireless | head -1 | cut -d: -f1)
echo "  wifi connection: ${CON:-none}"
if [ -n "$CON" ]; then
  AUTO=$(nmcli -t -f connection.autoconnect connection show "$CON" | cut -d: -f2)
  echo "  autoconnect: $AUTO"
  if [ "$AUTO" != "yes" ]; then
    sudo nmcli connection modify "$CON" connection.autoconnect yes connection.autoconnect-priority 10
    echo "  -> set autoconnect yes"
  fi
  # make sure NetworkManager itself starts at boot
  echo "  NetworkManager: $(systemctl is-enabled NetworkManager 2>/dev/null)/$(systemctl is-active NetworkManager 2>/dev/null)"
fi

echo
echo "=== services that must come back at boot ==="
for u in ssh hcc-ssh-watchdog.timer wsdd-host; do
  printf "  %-24s enabled=%s active=%s\n" "$u" "$(systemctl is-enabled $u 2>/dev/null)" "$(systemctl is-active $u 2>/dev/null)"
done

echo
echo "=== the Beast share re-mounts at boot? (fstab nofail + automount) ==="
grep -q '/mnt/beast/OneDrive' /etc/fstab && echo "  fstab entry: present" || echo "  fstab entry: MISSING"
grep '/mnt/beast/OneDrive' /etc/fstab | grep -q nofail && echo "  nofail: yes (won't hang boot if Beast is off)" || echo "  nofail: NO"
mountpoint -q /mnt/beast/OneDrive && echo "  mounted now: yes" || echo "  mounted now: no (will auto-mount on first access)"

echo
echo "=== never sleeps on mains (so it stays reachable) ==="
grep -h '^HandleLidSwitchExternalPower' /etc/systemd/logind.conf /etc/systemd/logind.conf.d/*.conf 2>/dev/null | sed 's/^/  /'
echo "done"
