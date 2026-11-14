#!/bin/bash
# Make the Lenovo appear in Windows 11's "Network" folder like the old days.
# Win11 dropped the NetBIOS workgroup browser (it rode on the removed SMBv1), and
# replaced it with WS-Discovery. Linux needs a WSD responder for that; 'wsdd' is it.
# This is the real, documented way a Samba/Linux box shows up in Win11 Network.
set -u
echo "=== 1. try the packaged wsdd ==="
sudo add-apt-repository -y universe >/dev/null 2>&1
sudo DEBIAN_FRONTEND=noninteractive apt-get update -q >/dev/null 2>&1
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q wsdd >/dev/null 2>&1
HAVE=0
if dpkg -l wsdd 2>/dev/null | grep -q '^ii'; then HAVE=1; echo "  installed from apt"; fi

if [ "$HAVE" = "0" ]; then
  echo "=== 2. apt didn't have it - install the standalone script ==="
  # christgau/wsdd is a single dependency-free python3 file
  if command -v curl >/dev/null 2>&1; then
    sudo curl -fsSL https://raw.githubusercontent.com/christgau/wsdd/master/src/wsdd.py -o /usr/local/bin/wsdd 2>/dev/null
  else
    sudo wget -q https://raw.githubusercontent.com/christgau/wsdd/master/src/wsdd.py -O /usr/local/bin/wsdd 2>/dev/null
  fi
  if [ -s /usr/local/bin/wsdd ]; then
    sudo chmod +x /usr/local/bin/wsdd
    # a systemd unit that advertises this host in workgroup LOEWEN301
    sudo tee /etc/systemd/system/wsdd.service >/dev/null <<'UNIT'
[Unit]
Description=Web Services Dynamic Discovery host daemon
After=network-online.target
Wants=network-online.target
[Service]
ExecStart=/usr/bin/python3 /usr/local/bin/wsdd -w LOEWEN301 -n GarageLaptop
Restart=always
[Install]
WantedBy=multi-user.target
UNIT
    sudo systemctl daemon-reload
    HAVE=1
    echo "  installed standalone + systemd unit"
  else
    echo "  FAILED to fetch wsdd (no internet on the Lenovo right now?)"
  fi
fi

if [ "$HAVE" = "1" ]; then
  echo
  echo "=== 3. point the packaged wsdd at the workgroup (Ubuntu uses /etc/default/wsdd) ==="
  for CF in /etc/default/wsdd /etc/wsdd.conf; do
    if [ -f "$CF" ]; then
      if grep -q '^WSDD_PARAMS=' "$CF"; then
        sudo sed -i 's#^WSDD_PARAMS=.*#WSDD_PARAMS="-w LOEWEN301 -n GarageLaptop"#' "$CF"
      else
        echo 'WSDD_PARAMS="-w LOEWEN301 -n GarageLaptop"' | sudo tee -a "$CF" >/dev/null
      fi
      echo "  set $CF"
    fi
  done
  echo
  echo "=== 4. enable + start ==="
  sudo systemctl enable --now wsdd >/dev/null 2>&1
  sleep 2
  echo "  wsdd: $(systemctl is-active wsdd) / $(systemctl is-enabled wsdd)"
  echo
  echo "=== 5. PROVE it is listening on the WSD port (UDP 3702) ==="
  sudo ss -ulnp 2>/dev/null | grep 3702 | sed 's/^/  /' || echo "  (port not shown - check status below)"
  systemctl status wsdd --no-pager -l 2>/dev/null | grep -E 'Active:|python3' | sed 's/^/  /'
fi
echo "done"
