#!/bin/bash
# Garage repair studio - LENOVO feature test (2026-11-08)
# Proves by doing: the mic records real sound, the external monitor is lit, Deskflow is running,
# Claude Code answers. Run ON the Lenovo (a terminal at its desk), not over SSH, for the mic part.
# usage: bash test-studio-lenovo.sh     exit 0 = all PASS
ok=0; bad=0
pass() { ok=$((ok+1)); echo "  PASS  $*"; }
fail() { bad=$((bad+1)); echo "  FAIL  $*"; }
out=~/Videos/studio-tests; mkdir -p "$out"; st=$(date +%Y%m%d-%H%M%S)

# --- MIC. 2026-11-10: the record claimed for two months that the Delam XLR mic "needs 48 V
# phantom power and an audio interface" and that there was no free path. That was WRONG. The
# capsule is a pre-charged electret wanting a few volts of BIAS, and THIS machine has a
# DEDICATED PINK MIC JACK that carries it - /proc/asound/card0/codec#0 node 0x18:
#     Pin Default 0x01a19820: [Jack] Mic at Ext Rear, Conn = 1/8, Color = Pink
# with a Mic Boost control holding ~30 dB in reserve that was sitting at 0 dB.
# So raise the gain BEFORE measuring, or a working electret reads as a dead mic.
CARD=0
echo "  jack this machine has: $(grep -A10 'Node 0x18' /proc/asound/card$CARD/codec#0 2>/dev/null \
  | sed -n 's/.*Pin Default[^:]*: *//p' | head -1)"
echo "  gain before: Capture $(amixer -c $CARD get Capture 2>/dev/null | sed -n 's/.*\[\([0-9]*%\)\].*/\1/p' | head -1), Mic Boost $(amixer -c $CARD get 'Mic Boost' 2>/dev/null | sed -n 's/.*\[\(-*[0-9.]*dB\)\].*/\1/p' | head -1)"
amixer -c $CARD -q sset Capture 75% cap 2>/dev/null
amixer -c $CARD -q sset 'Mic Boost' 3 2>/dev/null
echo "  gain raised for a quiet electret: Mic Boost -> $(amixer -c $CARD get 'Mic Boost' 2>/dev/null | sed -n 's/.*\[\(-*[0-9.]*dB\)\].*/\1/p' | head -1)"
echo "  ... recording 5 s - TALK NOW (into the EXTERNAL mic if one is plugged into the pink jack)"
if arecord -q -d 5 -f cd "$out/mic-$st.wav" 2>/dev/null; then
  mx=$(ffmpeg -hide_banner -i "$out/mic-$st.wav" -af volumedetect -f null - 2>&1 | awk -F': ' '/max_volume/{print $2+0}')
  if awk "BEGIN{exit !($mx > -1)}"; then
    fail "mic is CLIPPING (peak $mx dB) - drop Mic Boost to 2 and re-run"
  elif awk "BEGIN{exit !($mx > -40)}"; then
    pass "mic heard sound (peak $mx dB) - if the external mic is plugged in, the pink jack's plug-in power IS enough: nothing to buy"
  else
    fail "mic recorded near-silence (peak $mx dB). If the XLR mic is plugged in: (1) is the cable in the PINK jack, not the headphone jack? (2) DMM the pink jack ring-to-sleeve for DC - ~2-5 V = bias present, near 0 V = no plug-in power, use the kit's USB sound card. (3) These kits usually ship one; look in the box. (4) Only then is anything worth buying."
  fi
else fail "arecord could not record"; fi

# 2026-11-13: #298 moved the studio to the ACER ALONE, and it is already done in hardware -
# measured on the Acer: monitor TSB0206 (TOSHIBA-TV) parent = Intel UHD 620, VideoOutputTechnology
# DVI, i.e. the Acer's OWN HDMI; and the 32in (SZM) parent = "32in onn. Roku TV" over Miracast.
# So the Lenovo is the REFERENCE SCREEN on its own panel BY DESIGN - an empty HDMI/VGA here is
# not a fault, and failing it would send Jeff hunting for a cable that is deliberately unplugged.
ext=$(for f in /sys/class/drm/card*-HDMI*/status /sys/class/drm/card*-VGA*/status; do [ "$(cat $f 2>/dev/null)" = connected ] && echo "$f"; done)
if [ -n "$ext" ]; then
  pass "external monitor connected: $(echo $ext | sed 's#/sys/class/drm/##g; s#/status##g')"
else
  echo "  INFO  no external monitor on this box's HDMI/VGA - EXPECTED per #298 (studio = the Acer alone; this is the reference screen on its own panel). Not counted as a failure."
fi

# Deskflow: a RUNNING PROCESS IS NOT A CONNECTED CLIENT. On 2026-11-10 the Acer's
# matching check passed on `deskflow-daemon` alone while no server existed at all.
# So test the config, then the ESTABLISHED socket to the server - and say plainly
# that even an established socket is not the feature.
# 2026-11-13: this block hardcoded SRV=192.168.1.176 and FAILED when remoteHost differed.
# .176 is the Acer's *Wi-Fi* address. The Acer moved onto a USB gigabit Ethernet adapter
# (ASIX VID_0B95 PID_1790) at 192.168.1.159, .176 stopped answering, and the client sat in
# SYN-SENT forever - while this check reported "server down, or the TLS fingerprint was never
# accepted". BOTH WRONG: the server was listening the whole time, on the other address.
# An IP literal inside a test is a lie waiting to happen. DISCOVER what answers instead.
conf=~/.config/Deskflow/Deskflow.conf
answers24800() { timeout 3 bash -c "echo > /dev/tcp/$1/24800" 2>/dev/null; }
rh=''
[ -f "$conf" ] && rh=$(sed -n 's/^remoteHost=\(.*\)/\1/p' "$conf" | head -1)
SRV=''
for cand in "$rh" JEFFSLAPTOP 192.168.1.159 192.168.1.176; do
  [ -n "$cand" ] || continue
  if answers24800 "$cand"; then SRV="$cand"; break; fi
done
if [ -f "$conf" ]; then
  cm=$(sed -n 's/^coreMode=\([0-9]\).*/\1/p' "$conf" | head -1)
  pass "Deskflow config present (coreMode=${cm:-?}; 1=Client) server=${rh:-UNSET}"
  if [ -z "$SRV" ]; then
    fail "NOTHING answers on :24800 at remoteHost '${rh:-UNSET}', JEFFSLAPTOP, .159 or .176 - the Acer's Deskflow server is not running or not reachable"
  elif [ "$rh" != "$SRV" ]; then
    fail "remoteHost is '${rh:-UNSET}' but the server actually answers at $SRV - fix remoteHost in $conf (this exact drift caused a misdiagnosis on 11-13)"
  fi
else
  fail "Deskflow has NO config at $conf - it cannot be a client"
fi
srvip=$(getent hosts "$SRV" 2>/dev/null | awk '{print $1}' | head -1); [ -n "$srvip" ] || srvip="$SRV"
if [ -n "$srvip" ] && ss -tn state established 2>/dev/null | grep -q "$srvip:24800"; then
  pass "Deskflow client CONNECTED to $srvip:24800. NOT YET THE FEATURE - the feature is the mouse crossing over from the Acer"
else
  if pgrep -f deskflow-core >/dev/null; then
    fail "deskflow-core is running but has NO established connection to ${srvip:-the server}:24800. Check IN THIS ORDER: (1) does remoteHost match the address that answers, above; (2) is the socket stuck in SYN-SENT (ss -tnp | grep 24800) = wrong/unreachable address; (3) only THEN suspect the TLS fingerprint"
  else
    fail "no Deskflow client running (start it; server = ACER ${SRV:-192.168.1.159})"
  fi
fi
command -v claude >/dev/null && pass "Claude Code $(claude --version)" || fail "Claude Code missing"

echo; echo "$ok passed, $bad failed   (recordings: $out)"
[ $bad = 0 ]
