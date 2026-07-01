# Beehive Setup — Install Home Assistant OS on the Beelink J45 (the dedicated brain)

**Goal:** Get Beehive OFF the flaky external USB drive and installed on the J45's
**internal drive**, so it boots on its own, runs reliably, and frees both USB ports
for the RTL-SDR. The J45 is dedicated to Beehive, so we wipe the old Windows 10.

**Heads-up / cautions**
- This **erases the Beelink's internal drive** (the drawer-era Windows 10). That's
  fine — nothing on it matters. Everything Beehive-related is saved by Step 0.
- Do **Step 0 (backup) first** so your current setup (Blink attempts, etc.) carries over.
- Budget ~45–60 min. Go slow; every step is simple. Stuck on one → screenshot it, send it.

**You'll need**
- The **Beelink J45** + a keyboard, mouse, and monitor (HDMI) for it, and ideally an
  **ethernet cable** to your router during setup.
- **2 USB flash drives** (8 GB+). One becomes the Ubuntu "live" stick; one carries the
  HA OS image + your backup. (A single 16 GB+ works if you'd rather use one.)
- **"The beast"** (your main PC) to download files and make the USB sticks.

---

### STEP 0 — Back up your current Beehive (5 min)
1. Boot the J45 the way you do now (HA from the external drive). Open
   **homeassistant.local:8123** (or **192.168.1.66:8123**).
2. **Settings → System → Backups → Create backup** (name it `before-reinstall`).
3. When it's done, click it → **Download**. Save it to a USB stick or your phone. Keep it safe.

### STEP 1 — On the beast: download 3 things (10 min)
1. **Balena Etcher** (free flashing tool): balena.io/etcher
2. **Ubuntu Desktop** ISO (any recent LTS): ubuntu.com/download/desktop
3. **Home Assistant OS for x86-64** — the file named like `haos_generic-x86-64-XX.X.img.xz`
   from the Home Assistant site (Installation → Generic x86-64). Save it to a USB stick.

### STEP 2 — On the beast: make the Ubuntu "live" USB (10 min)
1. Plug in USB #1. Open Balena Etcher → **Flash from file** → pick the **Ubuntu ISO** →
   **Select** USB #1 → **Flash**. (This erases that stick.)
2. Make sure the **HA OS `.img.xz`** file is on USB #2 (so the J45 can reach it later).

### STEP 3 — Boot the J45 from the Ubuntu USB (5 min)
1. Plug keyboard/mouse/monitor + ethernet into the J45. Insert the **Ubuntu USB**.
2. Power on and tap the **boot-menu key** (Beelink is usually **F7**, sometimes DEL/ESC/F12)
   → choose the USB stick.
   - Won't boot it? Enter **BIOS** (DEL), turn **Secure Boot OFF**, save, retry.
3. Choose **"Try Ubuntu"** — do **NOT** click *Install Ubuntu*. You'll get a live desktop.

### STEP 4 — Flash HA OS onto the J45's internal drive (10 min) — wipes Windows
1. In the live Ubuntu, open **Balena Etcher** (download the Linux AppImage from
   balena.io/etcher on the live desktop if needed). Insert **USB #2** with the HA OS image.
2. Etcher → **Flash from file** → the `haos_generic-x86-64…img.xz` → **Select target =
   the INTERNAL drive** (usually `/dev/mmcblk0`, ~**128 GB** — NOT your USB sticks) → **Flash**.
   ⚠️ **Pick the right target.** The internal eMMC is ~128 GB; your USB sticks are a
   different size/name. This erases whatever you choose.
3. When it finishes: **shut down, remove BOTH USB sticks.**

### STEP 5 — First boot of HA OS + boot order (10 min)
1. Power on. If it doesn't go straight into HA, enter **BIOS** (DEL) → **Boot order** →
   put the **internal drive first** → save.
2. HA OS boots to a text console and configures itself (a few minutes). It's headless
   after this — you won't need the monitor.
3. From your phone/PC, open **homeassistant.local:8123** (give it 5–10 min the first time).

### STEP 6 — Restore your Beehive (10 min)
1. On the HA welcome screen, choose **"Restore from backup"** → upload the file from Step 0.
2. It rebuilds your users, dashboards, and integrations. Done.

### STEP 7 — Confirm it's solid
- Beehive now boots **on its own from the internal drive** — the external drive can retire.
- **Both USB ports are free** → the **RTL-SDR** goes here next.
- Pull the power, plug back in, and confirm it comes back up at homeassistant.local by
  itself. That "it just comes back" reliability is the whole point of doing this.

---

**Then, and only then:** RTL-SDR in → rtl_433 add-on → gas meter reads → water meter →
Water/Gas cards in the HCC app. Foundation first.
