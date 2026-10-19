' Run-Hidden.vbs - launch a console command with NO window, ever, and PRESERVE its exit code.
'
' Why this exists (2026-10-19): "powershell.exe -WindowStyle Hidden" is NOT enough on Windows 11.
' PowerShell hides its own console only AFTER the console host has already created and painted it,
' and this machine's default host is "Let Windows decide" (DelegationConsole/DelegationTerminal are
' both all-zero GUIDs) = Windows Terminal. So every scheduled run flashed a window on Jeff's screen.
' MEASURED: the -WindowStyle Hidden launch produced "VISIBLE WINDOW: powershell 'Windows PowerShell'";
' this launcher produced none, with the payload still running. Run(cmd, 0, True): 0 = window never
' created visible, True = WAIT, so the real exit code still reaches Task Scheduler's LastTaskResult.
' Do NOT change True to False - that would make every task report success no matter what it did.
Set sh = CreateObject("WScript.Shell")
cmd = ""
For i = 0 To WScript.Arguments.Count - 1
  a = WScript.Arguments(i)
  If InStr(a, " ") > 0 And Left(a, 1) <> """" Then a = """" & a & """"
  cmd = cmd & a & " "
Next
rc = sh.Run(Trim(cmd), 0, True)
WScript.Quit rc
