#!/bin/bash
echo "host: GarageLaptop"
if command -v firefox >/dev/null; then echo "  Firefox installed : yes ($(firefox --version 2>/dev/null))"; else echo "  Firefox installed : no"; fi
snap list firefox >/dev/null 2>&1 && echo "  Firefox is a snap : yes"
if command -v microsoft-edge >/dev/null; then echo "  Edge installed    : yes"; else echo "  Edge installed    : no"; fi
P=$(ls ~/snap/firefox/common/.mozilla/firefox/*.default*/places.sqlite ~/.mozilla/firefox/*.default*/places.sqlite 2>/dev/null | head -1)
if [ -n "$P" ]; then echo "  Firefox profile   : $(du -h "$P" | cut -f1) places.sqlite"; else echo "  Firefox profile   : none yet"; fi
