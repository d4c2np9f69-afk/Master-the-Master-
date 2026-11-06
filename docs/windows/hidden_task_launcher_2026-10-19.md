# The console windows popping up on the Beast — fixed 2026-10-19

**Jeff, 10-19 10:50:** *"What is this terminal window that pops up all the time and what does it go
to"* → *"You fix it and there has to be a way to run it in the back ground so that it doesn't pop up
when I'm watching something or doing something on the beast."*

---

## What it was — two different things, and only one was actually "popping up"

**1. The window in his photo had been open since Friday's boot.** Windows Terminal PID 9376, started
`2026-10-16 09:16:03`, titled `C:\WINDOWS\System32\WindowsPowerShell\v1.0\powershell.exe`. It hosted
**`Handoff-Watcher.ps1 -For beast`** (PID 8528, started 09:16:02 — one second earlier).

That script is the receiver for the two-way handoff Jeff asked for on 2026-09-23 (*"I want it to go
both ways"*). It polls `http://192.168.1.194:8099/pending?for=beast` every 3 s and opens whatever the
other machine sent — a video at the exact second, a PDF at the page. It was **healthy, not hung**:
330 s of CPU over 3 days is exactly what 3-second polling looks like.

🔑 **It MUST run in his interactive logon session** — its own header says so, because it opens a
browser window he will look at. Same for `Map-NetworkNames.ps1`, because drive mappings are
per-session. **So "just set it to run whether the user is logged on or not" is NOT the fix** — that
lands in session 0, which has no desktop, no browser and no mapped drives. That is the #239
grandfather-clock trap in a new place.

**2. The flashing through the day** was the other interactive tasks each creating a console as they
ran — Machine Health every 5 min, the Lenovo drive-map every 15, several hourly, plus five daily ones
that had **no `-WindowStyle Hidden` at all** (04:00, 04:30, 05:45, 06:15 and 08:05).

## Root cause

`powershell.exe -WindowStyle Hidden` **is not enough on Windows 11.** PowerShell hides its own console
only *after* the console host has already created and painted it, and this machine's default host is
"Let Windows decide" — `HKCU\Console\%%Startup` has `DelegationConsole` and `DelegationTerminal` both
`{00000000-0000-0000-0000-000000000000}`, which on Win11 resolves to **Windows Terminal**. Terminal
paints first. Hidden never gets the chance.

🔑 **MEASURED, not assumed.** Same payload, two launch methods, 80 ms polling for a visible window:

| method | window? | did the script run? |
|---|---|---|
| `powershell.exe -WindowStyle Hidden` (the old way) | **`!! VISIBLE WINDOW: powershell 'Windows PowerShell'`** | yes |
| `wscript.exe Run-Hidden.vbs powershell.exe …` | **none over 3.5 s** | yes |

The bug reproduced and the fix proven in one run.

## The fix

**`C:\Users\jeffl\HCC-Scripts\Run-Hidden.vbs`** — `WshShell.Run(cmd, 0, True)`. The `0` means the
window is **never created visible in the first place**, so there is nothing to flash.

⚠️ **The `True` matters — do NOT change it to `False`.** `False` is fire-and-forget: wscript would
exit instantly and **every task would report success no matter what its script did**, destroying
`LastTaskResult` as a health signal — which `HCC Crash Watch` is read by. With `True` the launcher
waits and `WScript.Quit rc` hands the real exit code back. **Verified: 0 → 0, 7 → 7, 3 → 3, all MATCH.**

Every interactive HCC task now launches as:

```
wscript.exe "C:\Users\jeffl\HCC-Scripts\Run-Hidden.vbs" "<original exe>" <original arguments>
```

**21 converted. 1 deliberately skipped — `HCC Grandfather Clock`**, which runs `pythonw.exe` (no
console at all) and whose launch #239 says not to touch.

**Every definition exported to XML first:**
`C:\Users\jeffl\HCC-Scripts\backups\tasks-before-hidden-20261019\` — 22 files. Revert with
`Register-ScheduledTask -Xml`.

## Verified, not claimed

- `HCC Machine Health` — real scheduled run, **no window over a 12 s watch**, `LastTaskResult = 0`.
  (First read showed `267009` = `0x41301` = *currently running*, because the launcher now waits.
  Re-read after completion gave 0. **That code is not a failure** — do not chase it next time.)
- `HCC-Map-Lenovo-SMB` — `result=0`, no window, **SMB connections still live** — which is precisely
  what would have broken had this been "fixed" by moving it to session 0.
- `HCC Crash Watch` — `result=0`, no window.
- `HCC-HandoffWatcher` — old instance stopped, restarted hidden; its own log wrote
  `2026-10-19 11:03:28  watcher up on 301SERVER as 'beast'`. Jeff confirmed: *"It's off the screen now."*

⚠️ **Two tasks were converted but deliberately NOT manually triggered: the camera-battery logger and
the camera-battery watch.** They reach the frozen camera subsystem, and the record is explicit that
**aggressive polling is what caused the 2026-08-19 lockout**. They run on their own schedule.

## For next time

- 🔑 **`-WindowStyle Hidden` is not a guarantee on Win11.** If a task must be silent, launch it via
  `Run-Hidden.vbs`.
- 🔴 **Never silence a popup by making an interactive task run whether the user is logged on or not.**
  Ask what the script TOUCHES first.
- The other Windows Terminal on screen (PID 5996, *"Session restore"*) is **Claude Code's own host** —
  `claude.exe` → `powershell 6532` → `WindowsTerminal 5996`. Checked before touching anything, and
  Jeff confirmed: *"The other terminal is you and it's fine."*
