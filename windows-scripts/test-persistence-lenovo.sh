#!/bin/bash
# REBOOT-SURVIVAL CHECK for the Lenovo. Jeff, 2026-09-19 09:31: "I want it
# triple checked!!! No bugs and it all survives a reboot on all computers."
#
# Same discipline as the Windows version: every check asks "will this come
# BACK", not "is it on now". A unit can be active but not enabled. A mount can
# be mounted but absent from fstab. Both look fine until the power blips.
PASS=0; FAIL=0
chk(){ if [ "$2" = "ok" ]; then PASS=$((PASS+1)); printf '  PASS  %-42s %s\n' "$1" "$3"; else FAIL=$((FAIL+1)); printf '  FAIL  %-42s %s\n' "$1" "$3"; fi; }
sec(){ echo ""; echo "--- $1"; }

echo "================================================================"
echo "  REBOOT-SURVIVAL CHECK - $(hostname)  $(date +%H:%M:%S)"
echo "================================================================"

sec 'SERVICES - active is NOT enough, must be ENABLED'
for s in ssh smbd nmbd wsdd-host chrony; do
    if systemctl list-unit-files 2>/dev/null | grep -q "^$s\."; then
        a=$(systemctl is-active $s 2>/dev/null); e=$(systemctl is-enabled $s 2>/dev/null)
        if [ "$a" = "active" ] && [ "$e" = "enabled" ]; then chk "$s" ok "$a / $e"; else chk "$s" no "$a / $e"; fi
    else
        printf '  ----  %-42s not installed\n' "$s"
    fi
done

sec 'wsdd-host must not be CRASH-LOOPING (Restart=always hides it)'
n=$(systemctl show wsdd-host -p NRestarts --value 2>/dev/null)
if [ "${n:-99}" -le 2 ]; then chk 'wsdd-host stable' ok "NRestarts=$n"; else chk 'wsdd-host stable' no "NRestarts=$n - CRASH LOOPING"; fi

sec 'SAMBA CONFIG - the setting that broke name resolution for two days'
nb=$(testparm -s 2>/dev/null | grep -ci 'disable netbios *= *yes')
if [ "$nb" -eq 0 ]; then chk 'netbios NOT disabled' ok 'ok'; else chk 'netbios NOT disabled' no 'disable netbios = Yes - nmbd will refuse to start'; fi
wg=$(testparm -s 2>/dev/null | grep -i 'workgroup' | head -1 | tr -d '\t ')
[ "$wg" = "workgroup=LOEWEN301" ] && chk 'workgroup' ok "$wg" || chk 'workgroup' no "$wg"
testparm -s >/dev/null 2>&1 && chk 'smb.conf parses' ok 'testparm clean' || chk 'smb.conf parses' no 'TESTPARM FAILS - samba will not start'

sec 'NAME REGISTRATION - what Windows uses when the machine is clicked'
if nmblookup -A 127.0.0.1 2>/dev/null | grep -qi '<20>'; then
    chk 'registers <20> file-server name' ok "$(nmblookup -A 127.0.0.1 2>/dev/null | grep -i '<20>' | head -1 | tr -s ' ')"
else
    chk 'registers <20> file-server name' no 'NOT registered - \\name will not resolve'
fi

sec 'MOUNTS - mounted is NOT enough, must be in fstab'
# NOTE: the Beast mount point is /mnt/beast/OneDrive, NOT /mnt/beast. Testing the
# parent reported "not mounted, will NOT come back" on a machine where it was
# mounted and correctly in fstab - the 7th check of mine to fail a healthy box.
for m in /mnt/beast/OneDrive /mnt/acer; do
    inf=$(grep -c " $m " /etc/fstab 2>/dev/null)
    if mountpoint -q "$m" 2>/dev/null; then live="mounted, $(ls $m 2>/dev/null | wc -l) items"; else live="NOT mounted"; fi
    if [ "$inf" -ge 1 ]; then chk "$m in fstab" ok "$live"; else chk "$m in fstab" no "$live - will NOT come back"; fi
done
grep -q '^user_allow_other' /etc/fuse.conf 2>/dev/null && chk 'fuse user_allow_other' ok 'set' || chk 'fuse user_allow_other' no 'MISSING - sshfs automount fails at boot'

sec 'SSH KEYS - both directions must work unattended'
grep -q 'claude-on-301server' ~/.ssh/authorized_keys 2>/dev/null && chk 'Beast key trusted here' ok 'present' || chk 'Beast key trusted here' no 'MISSING'
[ -f /home/jeffloewen/.ssh/id_ed25519 ] && chk 'own key for reaching the Acer' ok 'present' || chk 'own key for reaching the Acer' no 'MISSING'

sec 'POWER / LID - must stay awake on mains'
lid=$(grep -h '^HandleLidSwitchExternalPower' /etc/systemd/logind.conf /etc/systemd/logind.conf.d/*.conf 2>/dev/null | tail -1)
[ -n "$lid" ] && chk 'lid ignored on AC' ok "$lid" || chk 'lid ignored on AC' no 'not set - closing the lid may suspend it'

sec 'CLOCK'
s=$(timedatectl show -p NTPSynchronized --value 2>/dev/null)
[ "$s" = "yes" ] && chk 'time synchronised' ok "$(date +%H:%M:%S)" || chk 'time synchronised' no "$s"

echo ""
echo "================================================================"
printf '  %s  -  %d PASS   %d FAIL\n' "$(hostname)" "$PASS" "$FAIL"
echo "================================================================"
