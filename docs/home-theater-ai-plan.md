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
  6-core CPU, ~2 TB storage + a 500 GB external SSD, **Nvidia GeForce GTX 1050 Ti, 4 GB
  VRAM (confirmed via `nvidia-smi` 07-09)**, **runs 24/7**, sits in the viewing room, has
  unused partitions, **OS = Windows**. Also runs Clyde (Claude Code).
  → Detection plan settled: **CodeProject.AI Server on Windows (uses the 1050 Ti CUDA)**
  does snapshot object-detection (person/car/animal — no RTSP needed, fits Blink); add
  **LLM Vision** (small local model on the 1050 Ti, or free Gemini tier) for package +
  rich scene descriptions. Frigate/blinkbridge NOT needed for this path.
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
- **Phase 2 — DECIDED (07-10, Jeff's call): beast-as-media-center via Kodi.**
  Beast runs **Kodi** (free media center) → HDMI → Vizio TV. HA sends camera alerts to
  Kodi via `kodi.call_method` → `GUI.ShowNotification` → toast overlay on the TV screen,
  fades after 8s. Fire TV Stick stays as secondary HDMI input for 4K DRM streaming.
  **NOT** simple ADB from Beehive to Fire TV — Jeff wants it routed through the beast.
  Full setup guide: **`docs/beehive/media-center-setup.md`**.
- **Phase 3:** full HA theater scenes + Vizio/sound orchestration + TTS announcements.

## Division of labor

- **Claude (cloud):** app-side — the in-app clip player + AI detection badge display on
  camera tiles (✅ DONE 07-10). Owns all app code.
- **Clyde (beast) + Jeff:** beast-side — install Kodi + CodeProject.AI, wire HA automations.
  Clyde treats app code as READ-ONLY.

## Answered questions (from prior sessions)

1. **GPU:** GTX 1050 Ti, 4 GB VRAM (confirmed `nvidia-smi` 07-09). Enough for CodeProject.AI
   YOLO + small vision model. Not enough for a full local LLM — use free Gemini tier for
   rich scene descriptions if wanted.
2. **Screen:** Vizio TV in the viewing room = beast's monitor (hardwired HDMI).
3. **OS:** Windows. Kodi + CodeProject.AI both run native on Windows — no Docker/WSL/Linux
   partition needed.
