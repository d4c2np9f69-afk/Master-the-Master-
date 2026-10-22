#!/bin/bash
# Split the public-domain Westminster recording into its sections and encode
# each to Alexa's STRICT <audio> spec.
#
# Source: archive.org "Westminster Chimes" (1960, 78rpm transfer, public domain),
# 177.6 s, 48 kHz stereo. A shellac transfer has surface noise well above true
# silence, so sections are found at -30dB with a 0.5 s minimum gap - that yields
# ~10 boundaries (section level). At -25dB you get 84, which are the gaps
# BETWEEN INDIVIDUAL BELL NOTES, not between phrases.
#
# Alexa <audio> requirements (Amazon's SSML reference, verified 2026-09-19) -
# these are the spec, not preferences. Anything else is silently rejected:
#   MP3 MPEG version 2 | bit rate EXACTLY 48 kbps | sample rate 22050/24000/16000
#   <= 240 s | served over HTTPS with a valid trusted certificate
set -u
D=~/chimes
SRC="$D/westminster-source.mp3"
OUT="$D/out"
mkdir -p "$OUT"
rm -f "$OUT"/*.mp3

echo "=== section boundaries (-30dB, gaps >= 0.5s) ==="
ffmpeg -hide_banner -nostats -i "$SRC" -af "silencedetect=noise=-30dB:d=0.5" -f null - 2>&1 \
  | grep -E 'silence_(start|end)' \
  | sed -E 's/.*silence_start: ([0-9.]+).*/START \1/; s/.*silence_end: ([0-9.]+).*/END \1/' \
  > /tmp/gaps.txt
cat /tmp/gaps.txt | sed 's/^/  /'

echo ""
echo "=== cutting sections between the gaps ==="
# build a list of (start,end) for AUDIO segments: audio runs from each silence_end
# to the next silence_start.
prev_end=0
i=0
while read -r kind t; do
    if [ "$kind" = "START" ]; then
        dur=$(awk -v a="$t" -v b="$prev_end" 'BEGIN{printf "%.2f", a-b}')
        # ignore slivers - a real chime phrase is at least 3 seconds
        if awk -v d="$dur" 'BEGIN{exit !(d>3)}'; then
            i=$((i+1))
            f=$(printf '%s/section%02d.mp3' "$OUT" "$i")
            ffmpeg -hide_banner -loglevel error -y -ss "$prev_end" -t "$dur" -i "$SRC" \
                -ac 1 -ar 24000 -b:a 48k -codec:a libmp3lame -write_xing 0 "$f"
            printf '  section%02d  start %7.2fs  dur %6.2fs  -> %s\n' "$i" "$prev_end" "$dur" "$(basename $f)"
        fi
    else
        prev_end="$t"
    fi
done < /tmp/gaps.txt

# tail end after the last gap
total=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$SRC")
dur=$(awk -v a="$total" -v b="$prev_end" 'BEGIN{printf "%.2f", a-b}')
if awk -v d="$dur" 'BEGIN{exit !(d>3)}'; then
    i=$((i+1))
    f=$(printf '%s/section%02d.mp3' "$OUT" "$i")
    ffmpeg -hide_banner -loglevel error -y -ss "$prev_end" -t "$dur" -i "$SRC" \
        -ac 1 -ar 24000 -b:a 48k -codec:a libmp3lame -write_xing 0 "$f"
    printf '  section%02d  start %7.2fs  dur %6.2fs  -> %s\n' "$i" "$prev_end" "$dur" "$(basename $f)"
fi

echo ""
echo "=== VERIFY each file against Alexa's spec ==="
for f in "$OUT"/*.mp3; do
    [ -e "$f" ] || continue
    info=$(ffprobe -v error -show_entries stream=codec_name,sample_rate,channels:format=duration,bit_rate -of default=nw=1 "$f" 2>/dev/null | tr '\n' ' ')
    sz=$(stat -c%s "$f")
    printf '  %-16s %6s KB  %s\n' "$(basename $f)" "$((sz/1024))" "$info"
done
echo ""
echo "  Alexa needs: mp3 / 24000 Hz / ~48000 bit_rate / <=240s"
