#!/bin/bash
# OSK feature test: does Onboard POP UP when a text box in Edge is tapped? exit 0 = yes.
# 2026-11-08 (Jeff: keyboard "wouldn't come up when I tryed to log in to sling"). Two checks:
#  1. every running Edge browser process carries --force-renderer-accessibility. This is the check that
#     matters: on Sling's sign-in page a flagless Edge gave NO keyboard while this simple page still did,
#     so check 2 alone passes on the broken setup (it did, once, the same morning).
#  2. tap a text box in a real Edge window; the full keyboard (>300 px wide) must appear within 3 s.
export DISPLAY=:0 XAUTHORITY=$HOME/.Xauthority
cat > /tmp/osk-test.html <<'H'
<html><head><title>HCC OSK TEST</title></head><body style="font:30px sans-serif">
<input id="t" style="position:fixed;left:5%;top:10%;width:90%;height:80%;font:40px sans-serif" placeholder="On-screen keyboard test - closes itself"></body></html>
H
ob_visible() { for w in $(xdotool search --onlyvisible --class onboard 2>/dev/null); do g=$(xdotool getwindowgeometry $w | awk '/Geometry/{print $2}'); [ "${g%x*}" -gt 300 ] && { echo "$w $g"; return 0; }; done; return 1; }
rc=0
for p in $(pgrep -x msedge); do
  c=$(tr '\0' ' ' < /proc/$p/cmdline 2>/dev/null); case "$c" in *--type=*|"") continue;; esac
  case "$c" in *--force-renderer-accessibility*) echo "  PASS  Edge pid $p has --force-renderer-accessibility";;
    *) echo "  FAIL  Edge pid $p runs WITHOUT --force-renderer-accessibility - Sling sign-in gets no keyboard. Start Edge via hcc-browser"; rc=1;; esac
done
# make sure the keyboard starts hidden
dbus-send --session --type=method_call --dest=org.onboard.Onboard /org/onboard/Onboard/Keyboard org.onboard.Onboard.Keyboard.Hide 2>/dev/null; sleep 1
ob_visible >/dev/null && echo "  note: keyboard was already visible before the test"
setsid /usr/local/bin/hcc-browser --new-window file:///tmp/osk-test.html >/dev/null 2>&1 &
for i in $(seq 1 20); do W=$(xdotool search --name "HCC OSK TEST" 2>/dev/null | tail -1); [ -n "$W" ] && break; sleep 1; done
[ -z "$W" ] && { echo "  FAIL  test window never opened"; exit 2; }
sleep 3; xdotool windowactivate --sync $W; sleep 1
eval $(xdotool getwindowgeometry --shell $W)
xdotool mousemove $((X+WIDTH/2)) $((Y+HEIGHT/2)) click 1   # the text box fills 90 % x 80 % of the page: the centre is always inside it
sleep 3
if V=$(ob_visible); then echo "  PASS  keyboard popped up on the tap ($V)"; else echo "  FAIL  tapped the text box - keyboard did NOT pop up"; rc=1; fi
xdotool windowactivate --sync $W key ctrl+w; sleep 1
dbus-send --session --type=method_call --dest=org.onboard.Onboard /org/onboard/Onboard/Keyboard org.onboard.Onboard.Keyboard.Hide 2>/dev/null
xdotool search --name "HCC OSK TEST" >/dev/null 2>&1 && echo "  note: test window still open"
exit $rc
