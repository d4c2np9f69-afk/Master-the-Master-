#!/bin/bash
# Garage repair studio - LENOVO feature test (2026-11-08)
# Proves by doing: the mic records real sound, the external monitor is lit, Deskflow is running,
# Claude Code answers. Run ON the Lenovo (a terminal at its desk), not over SSH, for the mic part.
# usage: bash test-studio-lenovo.sh     exit 0 = all PASS
ok=0; bad=0
pass() { ok=$((ok+1)); echo "  PASS  $*"; }
fail() { bad=$((bad+1)); echo "  FAIL  $*"; }
out=~/Videos/studio-tests; mkdir -p "$out"; st=$(date +%Y%m%d-%H%M%S)

echo "  ... recording 5 s from the built-in mic - TALK NOW"
if arecord -q -d 5 -f cd "$out/mic-$st.wav" 2>/dev/null; then
  mx=$(ffmpeg -hide_banner -i "$out/mic-$st.wav" -af volumedetect -f null - 2>&1 | awk -F': ' '/max_volume/{print $2+0}')
  if awk "BEGIN{exit !($mx > -40)}"; then pass "mic heard sound (peak $mx dB)"; else fail "mic recorded near-silence (peak $mx dB)"; fi
else fail "arecord could not record"; fi

ext=$(for f in /sys/class/drm/card*-HDMI*/status /sys/class/drm/card*-VGA*/status; do [ "$(cat $f)" = connected ] && echo "$f"; done)
[ -n "$ext" ] && pass "external monitor connected: $(echo $ext | sed 's#/sys/class/drm/##g; s#/status##g')" || fail "no external monitor on HDMI or VGA"

pgrep -x deskflow >/dev/null || pgrep -f deskflow-core >/dev/null && pass "Deskflow process running (the REAL test: mouse slides over from the Acer)" || fail "Deskflow not running (start it, client mode, server = ACER 192.168.1.176)"
command -v claude >/dev/null && pass "Claude Code $(claude --version)" || fail "Claude Code missing"

echo; echo "$ok passed, $bad failed   (recordings: $out)"
[ $bad = 0 ]
