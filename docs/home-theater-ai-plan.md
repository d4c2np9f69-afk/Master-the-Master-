# HCC — Camera AI + Home Theater Plan (living doc)

Jeff's goals (2026-07-09), **with a hard NO on subscriptions** (no Blink fee, no Zmodo
fee, no per-month anything — he already pays for Claude/Clyde, Nabu Casa, and the domain):

1. Cameras look premium in the app (mockup-style big tiles) — ✅ DONE.
2. Review saved Blink clips **inside the app**.
3. Alerts tell you **what** triggered them — person / car / animal / package.
4. Alert can **pop up on the TV**, glance, return to the show.
5. Whole thing feels like a **top-of-the-line home theater with HA driving it all** —
   seamless, no "cluster of shit," no constant resets.

## Hardware we're working with

- **Beehive (Beelink J45, `192.168.1.66`)** — weak Pentium, no GPU, runs the whole house.
  **Keep it PURE HA.** Do NOT put media/AI on it.
- **The beast (`301Server`, `192.168.1.194`)** — **the designated AI + media brain.**
  6-core CPU, ~2 TB storage + a 500 GB external SSD, **Nvidia GPU (model TBD — run
  `nvidia-smi`; Jeff thinks "T750")**, **runs 24/7**, sits in the viewing room, has
  unused partitions. Also runs Clyde (Claude Code).
- **Blink cameras** — snapshot/event only (no live RTSP), motion clips stored free on the
  Sync Module 2 USB. A **VLC media_player** is already set up in HA (Telnet).
- **Screens/AV:** Vizio TV + sound (hardwired, is the beast's monitor); Apple TV (bedroom);
  Fire TV Max (owned but "very slow"). Jeff says "everything in the same room" — **confirm
  which screen he actually watches in that room.**

## Emerging architecture (no subscriptions)

- **Detection (goal 3):** Blink motion → HA grabs the snapshot → **local vision AI on the
  beast** classifies person/car/package/animal → surfaced in the app + notifications.
  - If the GPU has enough VRAM → a local vision LLM (Ollama + LLM Vision HACS integration).
  - If VRAM is small (e.g., an old GTX 750 Ti ≈ 2 GB) → CPU object-detection (CodeProject.AI
    / a small YOLO) on the 6-core CPU is fine for occasional motion snapshots.
  - Ultra-simple fallback = free-tier **Google Gemini** API key via LLM Vision (still $0).
  - Heavier real-time route (only if needed): **blinkbridge** (Blink→RTSP) + **Frigate** on
    the beast. More setup, ~30s Blink delay — probably overkill.
- **Clips in app (goal 2):** clips saved via `blink.save_recent_clips` → `/media/blink/…`;
  Claude builds an **in-app clip list + player** via HA's media_source API; VLC player can
  also cast a clip to a screen.
- **TV pop-up (goal 4):** clean overlay needs Android TV / Fire TV / **Nvidia Shield**, OR
  the **beast driving the room's screen directly via HDMI + Kodi** (Kodi has a native HA
  integration that can pop a camera snapshot over playback). **Apple TV cannot do a clean
  overlay** (tvOS has no third-party overlay; Blink isn't proper HomeKit).
- **Theater (goal 5):** HA scenes ("Movie Night" → screen on, input, sound, lights), Vizio
  via the **SmartCast** integration, app launching. HA *orchestrates*; each streaming app
  still runs natively.

## Honest limits (tell Jeff, don't paper over)

- Premium DRM apps (HBO/Prime/Netflix) can be **resolution-capped on a PC** — a certified
  stick/Shield may still edge out the beast for pure 4K DRM streaming. Likely answer: beast =
  AI + media + local playback; add ONE small certified streamer only if a quality drop shows.
- Apple TV = no clean pop-up overlay.
- Blink = snapshot/event, not continuous; a small delay is inherent.

## Phased roadmap (so it's never a "cluster")

- **Phase 1 (free, start now):** local AI detection on the beast + in-app clip player.
  Works on any TV. Immediate win, zero hardware.
- **Phase 2:** confirm the theater brain — beast-drives-the-screen (preferred, free) or add a
  Shield — and wire the TV pop-up.
- **Phase 3:** full HA theater scenes + Vizio/sound orchestration.

## Division of labor

- **Claude (cloud):** app-side — the in-app clip player + wiring the "what did it see"
  text/snapshot into camera alerts. Owns all app code.
- **Clyde (beast) + Jeff:** beast-side — install the local vision AI (Ollama/CodeProject.AI),
  HACS LLM Vision, the HA automations, media/Kodi. Clyde treats app code as READ-ONLY.

## Open questions before finalizing

1. **`nvidia-smi`** on the beast → exact GPU + VRAM (sizes the local AI).
2. Which **screen** does Jeff watch in that room — the Vizio, or a separate TV?
3. Beast OS = Windows → run the AI via Docker/WSL, or use one of the unused partitions for a
   small Linux install dedicated to AI/media?
