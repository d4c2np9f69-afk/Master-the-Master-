#!/bin/bash
# KitchenPC touchscreen: is the nw-fermi kernel module built for the kernel it is filed under?
#
# Why it exists (2026-11-06): the touchscreen died at the 11-04 4:04 PM reboot. Unattended-upgrades
# installed kernel 7.0.0-42 on 11-03 06:09 while 7.0.0-38 was RUNNING; the driver's Makefile picks
# headers with $(shell uname -r) and dkms.conf never overrode it, so DKMS compiled against 38 and
# filed the result under 42 (vermagic 7.0.0-38 in /lib/modules/7.0.0-42-generic). On boot into 42 the
# kernel refused it ("nw_fermi: disagrees about version of symbol module_layout"), no input device,
# no daemon, no touch. DKMS reported "installed" the whole time. This repeats on EVERY kernel update
# unless dkms.conf passes KERNEL_SOURCE=$kernel_source_dir.
#
# Checks: (1) every installed nw-fermi module's vermagic matches its kernel directory,
#         (2) dkms.conf builds against the target kernel, not the running one,
#         (3) the running kernel has it loaded.
#         (4) the touch device exposes NO multitouch axes. 2026-11-06 1:00 PM: Jeff tapped 44 times, the
#             kernel saw every finger at the right place, X delivered 44 clicks and ZERO motion - the pointer
#             sat at x:212 y:169 while the last touch was at 157,210. The module reports a malformed type-A
#             MT stream (no slots); evdev hands it to mtdev and the pointer never moves. Fix: the
#             "#define MULTITOUCH" line in nw-fermi.c is commented out (kitchenpc-restore.sh does it), so
#             the module publishes only ABS_X/ABS_Y + BTN_LEFT.
# usage: bash check-nwfermi-kernel.sh      exit 0 = all pass
ok=0; fail=0
pass() { ok=$((ok+1)); echo "  ok    $*"; }
bad()  { fail=$((fail+1)); echo "  FAIL  $*"; }

found=0
for f in /lib/modules/*/updates/dkms/nw-fermi.ko*; do
  [ -e "$f" ] || continue; found=1
  k=$(echo "$f" | cut -d/ -f4)
  vm=$(modinfo -F vermagic "$f" 2>/dev/null | awk '{print $1}')
  if [ "$vm" = "$k" ]; then pass "$k: module built for $vm"
  else bad "$k: module built for '$vm' (kernel will refuse it)"; fi
done
[ $found = 1 ] || bad "no nw-fermi module installed for any kernel"

conf=/usr/src/nwfermi-0.7.0.1/dkms.conf
if grep -q 'KERNEL_SOURCE=' "$conf" 2>/dev/null; then pass "dkms.conf passes KERNEL_SOURCE (builds for the target kernel)"
else bad "dkms.conf lets the Makefile use 'uname -r' (builds for the RUNNING kernel)"; fi

if lsmod | grep -q '^nw_fermi'; then pass "loaded in running kernel $(uname -r)"
else bad "not loaded in running kernel $(uname -r)"; fi

abs=$(grep -A9 'Name="Nextwindow Fermi Touchscreen"' /proc/bus/input/devices | awk -F'ABS=' '/B: ABS=/{print $2}')
if [ -z "$abs" ]; then bad "no Nextwindow Fermi input device"
elif [ "$(python3 -c "import sys;w=sys.argv[1:];print((int(w[0]+''.join(x.zfill(16) for x in w[1:]),16)>>0x35)&1)" $abs)" = 0 ]; then pass "touch device is single-touch (no ABS_MT axes) - X moves the pointer"
else bad "touch device exposes ABS_MT axes - evdev takes the mtdev path and the pointer never moves"; fi

echo; echo "$ok passed, $fail failed"; [ $fail = 0 ]
