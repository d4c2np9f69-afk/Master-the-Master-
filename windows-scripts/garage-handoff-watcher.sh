#!/bin/bash
# Runs on the GARAGE machine. Polls the Beast's handoff relay and, the moment
# Jeff clicks "SEND TO GARAGE" on the Beast or Acer, opens that thing out here -
# a YouTube video at the exact second he left off, or a PDF manual at the page
# he was on.
#
# Deliberately polls HTTP rather than watching a shared file, because the Acer
# cannot write to the Beast's read-only OneDrive share, and this needs no mount
# on the garage side. /pending hands each item over exactly ONCE.
#
# PATH TRANSLATION, which is the whole trick for local files:
# a PDF on the Beast is file:///C:/Users/jeffl/OneDrive/x.pdf, which means
# nothing out here. But that same folder is already mounted at
# /mnt/beast/OneDrive by the mesh, so rewriting the prefix makes it openable.
# Anything NOT under OneDrive cannot be reached and is reported rather than
# silently opening a blank window.
set -u
RELAY="http://192.168.1.194:8099/pending"
POLL=3

BROWSER=""
for b in google-chrome chromium-browser chromium microsoft-edge firefox; do
    command -v "$b" >/dev/null 2>&1 && { BROWSER="$b"; break; }
done
[ -z "$BROWSER" ] && { echo "no browser found on $(hostname)"; exit 1; }
echo "$(date '+%H:%M:%S') garage handoff watcher up on $(hostname), browser=$BROWSER"

translate() {
    local u="$1"
    case "$u" in
        file:///[Cc]:/Users/jeffl/OneDrive/*)
            # the Beast's OneDrive -> the garage's view of it
            local rest="${u#file:///[Cc]:/Users/jeffl/OneDrive/}"
            rest=$(printf '%b' "${rest//%/\\x}")          # undo percent-encoding
            if [ -e "/mnt/beast/OneDrive/$rest" ]; then
                echo "file:///mnt/beast/OneDrive/$rest"
            else
                echo "MISSING:/mnt/beast/OneDrive/$rest"
            fi
            ;;
        file://*)
            echo "UNREACHABLE:$u"
            ;;
        *)
            echo "$u"
            ;;
    esac
}

while true; do
    url=$(curl -fsS --max-time 5 "$RELAY" 2>/dev/null)
    if [ -n "$url" ]; then
        out=$(translate "$url")
        case "$out" in
            MISSING:*)
                echo "$(date '+%H:%M:%S') CANNOT OPEN - not synced to the garage yet: ${out#MISSING:}"
                ;;
            UNREACHABLE:*)
                echo "$(date '+%H:%M:%S') CANNOT OPEN - local file outside OneDrive, the garage cannot see it: ${out#UNREACHABLE:}"
                ;;
            *)
                echo "$(date '+%H:%M:%S') OPENING: $out"
                DISPLAY=${DISPLAY:-:0} nohup "$BROWSER" --new-window "$out" >/dev/null 2>&1 &
                ;;
        esac
    fi
    sleep "$POLL"
done
