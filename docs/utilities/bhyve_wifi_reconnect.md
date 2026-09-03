# B-hyve "Water Hog" — how to put it back on Wi-Fi

**Written 2026-09-03. This was NOT documented anywhere** — `Search-HCC.ps1 "b-hyve|bhyve|Water Hog"`
returns 367 conversation hits and every one is about the *Home Assistant integration* breaking, not
about the timer's own Wi-Fi. Jeff asked to be walked through it, so it is written down now.

Sources, fetched and verified 2026-09-03 (not recalled from memory):
- [Update Wi-Fi Settings / reconnect](https://support.orbitonline.com/en/b-hyve-smart-indoor-outdoor-irrigation-controller/How-To-Use-OrbitAssist-2730)
- [Put each device into Pairing Mode](https://support.orbitonline.com/en/b-hyve-smart-indoor-outdoor-irrigation-controller/How-To-Put-each-device-into-Pairing-Mode-5467)
- [Timer disconnects frequently](https://support.orbitonline.com/en/b-hyve-xr-smart-indoor-outdoor-sprinkler-timer/Timer-disconnects-frequently-c4ec)

---

## 🔴 THE TRAP — DO NOT PUT IT IN PAIRING MODE

Orbit's own words: **"putting the device in pairing mode will also Factory Reset the device."**
The reset is *press and hold the reset button 10-12 seconds* behind the front door and swing panel.

**That would wipe all six zone programs.** Those programs are load-bearing here — `IRR_FLOW`
(`{1:8.78, 2:10.09, 5:4.4}` gal/min) was derived from isolated single-zone runs on 08-06 and the
whole irrigation-gallons model depends on the zones behaving as configured. **Do not press it.**

## ✅ THE RIGHT PATH — "Update Wi-Fi Settings"

Orbit, verbatim: *"If you have already set up your timer in the B-hyve App and are only trying to
reconnect it to your Wi-Fi network, **do not go back through the setup process**. Simply go to the
'My B-hyve' Tab, tap 'Devices', select the desired device, and tap 'Update Wi-Fi Settings'."*

1. Open the **B-hyve app** on the phone, Bluetooth ON, standing at the timer.
2. **My B-hyve** tab → **Devices** → select **Water Hog**.
3. **Update Wi-Fi Settings**.
4. Choose **`Loewen301`** — **NOT** `Loewen301-5G`. B-hyve timers are 2.4 GHz.
5. Password: **`Bison3017790`** (recorded in `HCC-secrets/HCC_ACCESS.md` §5).
6. Let it finish. It keeps every program — that is the point of using this path.

## Why it fell off in the first place (the working theory, 2026-09-03)

`last_connected` = **2026-08-13T18:30:52Z**, which is the same day the old extenders were retired.
The GaragePC failed identically and the record names the cause verbatim: *"GaragePC is the extender
casualty. Its WiFi was joined to `Loewen301_Ext` — the network name the old extender itself
broadcast, which vanished when you unplugged it."* A scan of the air on 2026-09-03 lists
`Loewen301`, `Loewen301-5G`, `LoewenGuest` and neighbours — **no `Loewen301_Ext` exists**.

⚠️ **NOT PROVEN.** The timer's stored SSID has never been read; only the B-hyve app can show it.
If the app reports it is already set to `Loewen301`, this theory is wrong and the next suspect is
the timer's own radio.

## The extender is NOT the problem — measured 2026-09-03, do not re-investigate

| check | result |
|---|---|
| mode | **Access Point** (`opMode 0`), not a repeater |
| backhaul | **Ethernet LAN-1, 1000 Mbps full duplex** |
| 2.4 GHz | ssid `Loewen301`, **channel 6**, enabled, not hidden |
| 5 GHz | ssid `Loewen301-5G`, enabled |
| PSK | `Bison3017790` — **identical to the gateway's**, verified independently from the beast's stored profile (`netsh wlan show profile key=clear`) |
| clients | **5 attached**, incl. the office printer at `.208` |

Same SSID *and* same key on both radios is a correct roaming setup. RE200 is `192.168.1.196`,
admin password in `HCC_ACCESS.md` §5. ⚠️ `admin` is NOT the password and was tested — the device
allows **10 attempts before lockout** and 2 are already used.

## If it still will not connect

Orbit's own troubleshooting, in their order:
- Move the timer **within 50 ft line-of-sight** of the AP while pairing.
- **MAC filtering** on the router will block it (BGW320: not enabled here as of 08-13 census).
- High firewall settings can block the B-hyve server.
- They recommend Google DNS **8.8.8.8 / 8.8.4.4**.

## After it connects — do NOT skip this

Go straight to **OPEN_ITEMS #109b**, the verify-after-valve checklist. In short: B-hyve history must
show the run, **the water meter must show a matching delta in the same window** (that is the only
proof water actually moved), and `water_billing_history` must drop the phantom **5,098**.
🔴 **Do not change any irrigation/sewer code before working through it** — Jeff's explicit hold,
08-31 (#109).
