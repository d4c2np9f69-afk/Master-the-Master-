#!/bin/bash
# The wsdd package is installed but the only running instance is GVFS's CLIENT
# (--no-host --discovery) - that lets the Lenovo BROWSE the network but does NOT
# advertise the Lenovo TO Windows. To appear in Windows' Network folder we need a
# HOST-mode wsdd running as a system service. Set that up cleanly.
set -u
WSDD=/usr/bin/wsdd

echo "=== packaged systemd unit, if any ==="
UNIT=$(dpkg -L wsdd 2>/dev/null | grep -E '\.service$' | head -1)
echo "  packaged unit: ${UNIT:-none}"

echo
echo "=== create a host-mode system service ==="
# host mode is the default (no --no-host). -w sets the workgroup grouping,
# -n the name Windows shows.
sudo tee /etc/systemd/system/wsdd-host.service >/dev/null <<UNIT
[Unit]
Description=wsdd host-mode advertiser (makes this box appear in Windows Network)
After=network-online.target
Wants=network-online.target
[Service]
Type=simple
ExecStart=$WSDD -w LOEWEN301 -n GarageLaptop
Restart=always
RestartSec=5
[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl daemon-reload
sudo systemctl enable --now wsdd-host.service
sleep 3

echo
echo "=== verify ==="
echo "  active : $(systemctl is-active wsdd-host)"
echo "  enabled: $(systemctl is-enabled wsdd-host)"
echo "  host-mode process (should NOT say --no-host):"
ps aux | grep '[w]sdd' | sed 's/^/    /'
echo
echo "  listening on WSD port 3702:"
sudo ss -ulnp 2>/dev/null | grep 3702 | sed 's/^/    /'
echo "done"
