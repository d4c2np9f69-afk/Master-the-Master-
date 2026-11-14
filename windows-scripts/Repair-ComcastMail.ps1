<#
  Repair-ComcastMail.ps1
  Jeff's Comcast mail: find out what is ACTUALLY broken, on the machine, in one run.

  Jeff, 2026-09-17: "You fucking broke it you fix it. I'm not - you built it you fix."
  He is right. The cloud session cannot reach this PC or his Xfinity login, so it wrote
  the repair instead of writing him a to-do list. This runs on the beast.

  WHY THIS EXISTS. On 2026-08-19 the Comcast password was reset to 32 random characters
  (docs/password_and_data_security_plan_2026-08-19.md line 126). Every mail client on this
  PC still holds the OLD one. Since that day:
      outgoing (SMTP) auth fails -> mail never leaves -> the Outbox fills and blinks
      incoming (IMAP) auth fails -> nothing downloads -> replies sit on Comcast unread
  From the chair that looks exactly like "my email is bouncing." It is not. Measured
  2026-09-17: all 13 bid emails CC'd jeff.loewen@comcast.net and NOT ONE bounced.

  TESTS THE FEATURE, NOT A COMPONENT. A ping proves nothing. This opens a real TLS socket
  to Comcast and performs a real LOGIN / AUTH, because that is the thing that is failing.

  THE PASSWORD IS NEVER PRINTED, NEVER WRITTEN, NEVER LOGGED. It is read as a SecureString
  in your own shell and converted in memory only at the instant of the AUTH command.

  USAGE
      powershell -NoProfile -ExecutionPolicy Bypass -File .\windows-scripts\Repair-ComcastMail.ps1
      ...            -SendTest      also sends ONE test message to himself to prove sending works

  COMPATIBILITY: written to the Windows PowerShell 5.1 / PowerShell 7 INTERSECTION, because
  `powershell.exe` (5.1) is what the HCC hooks invoke. No ternary, no ?? , no try-as-expression.

  EXIT 0 = both IMAP and SMTP authenticated. Anything else = the verdict block says what to do.
#>
param(
  [string] $Address  = 'jeff.loewen@comcast.net',
  [switch] $SendTest
)

$ErrorActionPreference = 'Continue'
$fail = 0
function Say($s) { Write-Output $s }
function Head($s) { Write-Output ""; Write-Output ("=== " + $s + " ===") }

Say "=== COMCAST MAIL REPAIR - $Address ==="
Say ("run at: " + (Get-Date).ToString('yyyy-MM-dd HH:mm:ss') + " local")
Say "The password is never printed, stored or logged by this script."

# ---------------------------------------------------------------- 1. WHICH CLIENTS EXIST
Head "1. MAIL CLIENTS ON THIS PC"
$found = @()
$probe = @(
  @{ n='Outlook (desktop)'; p='HKCU:\Software\Microsoft\Office\16.0\Outlook' },
  @{ n='Outlook (classic)'; p='HKCU:\Software\Microsoft\Office\15.0\Outlook' },
  @{ n='Windows Mail';      p='HKCU:\Software\Microsoft\Windows\CurrentVersion\Mail' }
)
foreach ($x in $probe) { if (Test-Path $x.p) { $found += $x.n; Say ("  FOUND  " + $x.n) } }
foreach ($d in @(
    @{ n='Thunderbird'; p="$env:APPDATA\Thunderbird\Profiles" },
    @{ n='eM Client';   p="$env:APPDATA\eM Client" },
    @{ n='Mailbird';    p="$env:LOCALAPPDATA\Mailbird" })) {
  if (Test-Path $d.p) { $found += $d.n; Say ("  FOUND  " + $d.n + "   (" + $d.p + ")") }
}
if (-not $found.Count) {
  Say "  none of the usual clients found by registry/profile probe."
  Say "  If something IS blinking, note its window title - that names the client."
}

# ---------------------------------------------------------------- 2. STUCK OUTBOX
Head "2. IS ANYTHING STUCK IN AN OUTBOX"
$outboxSeen = $false
try {
  $ol = New-Object -ComObject Outlook.Application -ErrorAction Stop
  $ns = $ol.GetNamespace('MAPI')
  $ob = $ns.GetDefaultFolder(4)          # olFolderOutbox
  $n  = $ob.Items.Count
  $outboxSeen = $true
  if ($n -gt 0) {
    $fail++
    Say ("  *** OUTLOOK OUTBOX HOLDS $n UNSENT MESSAGE(S) - this is the blinking ***")
    $i = 0
    foreach ($m in $ob.Items) {
      $i++; if ($i -gt 10) { Say "      ... (more)"; break }
      # SentOn throws on an item that has never actually been sent - which is every item
      # in an Outbox. Fall back to CreationTime, which is what we actually want anyway.
      # NOTE: written the long way ON PURPOSE. `$x = try {} catch {}` is PowerShell 7 ONLY
      # and is a hard SYNTAX ERROR on Windows PowerShell 5.1 - which is what `powershell.exe`
      # is, and what every hook in windows-config/claude-settings.json invokes. The whole
      # script would have failed to parse on the one machine it was written for.
      $when = '(no date)'
      try { $when = $m.CreationTime.ToString('yyyy-MM-dd HH:mm') } catch { }
      Say ("      " + $when + "  to " + $m.To + "  |  " + $m.Subject)
    }
    Say "      ^ the OLDEST date here should be on or after 2026-08-19 if the password is the cause."
  } else { Say "  Outlook Outbox is empty." }
} catch { Say "  (Outlook COM not available - skipping; that is not a fault by itself)" }
foreach ($tb in @(Get-ChildItem "$env:APPDATA\Thunderbird\Profiles" -Directory -ErrorAction SilentlyContinue)) {
  $u = Join-Path $tb.FullName 'Mail\Local Folders\Unsent Messages'
  if (Test-Path $u) {
    $sz = (Get-Item $u).Length; $outboxSeen = $true
    if ($sz -gt 0) { $fail++; Say ("  *** THUNDERBIRD Unsent Messages = $sz bytes in " + $tb.Name + " ***") }
    else { Say ("  Thunderbird Unsent Messages empty (" + $tb.Name + ")") }
  }
}
if (-not $outboxSeen) { Say "  No readable Outbox found. If a client is blinking, say which one." }

# ---------------------------------------------------------------- 3. THE PASSWORD
Head "3. CREDENTIAL"
Say "  Paste the CURRENT 32-char Comcast password (from Bitwarden). It is masked,"
Say "  used only for the two live AUTH tests below, and never stored."
$sec = Read-Host -Prompt '  Comcast password' -AsSecureString
if (-not $sec -or $sec.Length -eq 0) { Say "  no password entered - cannot run the live tests."; exit 2 }
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
$plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)

# ---------------------------------------------------------------- 4. LIVE IMAP
Head "4. LIVE IMAP TEST - imap.comcast.net:993 (can it RECEIVE)"
$imapOK = $false
try {
  $c = New-Object Net.Sockets.TcpClient('imap.comcast.net', 993)
  $ssl = New-Object Net.Security.SslStream($c.GetStream(), $false)
  $ssl.AuthenticateAsClient('imap.comcast.net')
  $rd = New-Object IO.StreamReader($ssl)
  $wr = New-Object IO.StreamWriter($ssl); $wr.AutoFlush = $true
  $greet = $rd.ReadLine(); Say ("  server: " + $greet)
  # Use SASL AUTHENTICATE PLAIN, not LOGIN with quoted strings.
  # WHY: a 32-char generated password can contain a double-quote or a backslash, and IMAP
  # quoted strings (RFC 3501 4.3) would need both escaped. Getting that escaping wrong makes
  # the command malformed and the server answers NO - so the script would report
  # "AUTH REJECTED" for a password that is perfectly correct, and send Jeff off changing
  # settings that were never wrong. Base64 removes the whole class: nothing needs escaping.
  $sasl = [Convert]::ToBase64String(
            [Text.Encoding]::UTF8.GetBytes(([char]0) + $Address + ([char]0) + $plain))
  $wr.WriteLine('a1 AUTHENTICATE PLAIN')
  $cont = $rd.ReadLine()                      # server answers "+" to ask for the payload
  if ($cont -notmatch '^\+') { Say ("  note: server did not prompt as expected: " + $cont) }
  $wr.WriteLine($sasl)
  $line = ''; $resp = ''
  while (($line = $rd.ReadLine()) -ne $null) { $resp = $line; if ($line -match '^a1 ') { break } }
  if ($resp -match '^a1 OK') {
    $imapOK = $true; Say "  OK  IMAP AUTHENTICATED - incoming mail works with this password."
    $wr.WriteLine('a2 STATUS INBOX (MESSAGES UNSEEN)')
    while (($line = $rd.ReadLine()) -ne $null) {
      if ($line -match 'STATUS') { Say ("  INBOX: " + $line.Trim()) }
      if ($line -match '^a2 ') { break }
    }
    Say "  ^ if UNSEEN is large, that is the mail you have not been able to see since 08-19."
    $wr.WriteLine('a3 LOGOUT')
  } else { $fail++; Say ("  FAIL  IMAP AUTH REJECTED: " + $resp) }
  $c.Close()
} catch { $fail++; Say ("  FAIL  IMAP could not connect: " + $_.Exception.Message) }

# ---------------------------------------------------------------- 5. LIVE SMTP
Head "5. LIVE SMTP TEST - smtp.comcast.net:587 STARTTLS (can it SEND)"
$smtpOK = $false
try {
  $c = New-Object Net.Sockets.TcpClient('smtp.comcast.net', 587)
  $ns2 = $c.GetStream()
  $rd = New-Object IO.StreamReader($ns2); $wr = New-Object IO.StreamWriter($ns2); $wr.AutoFlush = $true
  Say ("  server: " + $rd.ReadLine())
  $wr.WriteLine('EHLO hcc.local'); while (($l = $rd.ReadLine()) -ne $null) { if ($l -match '^250 ') { break } }
  $wr.WriteLine('STARTTLS'); Say ("  starttls: " + $rd.ReadLine())
  $ssl = New-Object Net.Security.SslStream($ns2, $false)
  $ssl.AuthenticateAsClient('smtp.comcast.net')
  $rd = New-Object IO.StreamReader($ssl); $wr = New-Object IO.StreamWriter($ssl); $wr.AutoFlush = $true
  $wr.WriteLine('EHLO hcc.local'); while (($l = $rd.ReadLine()) -ne $null) { if ($l -match '^250 ') { break } }
  $b64u = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($Address))
  $b64p = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($plain))
  $wr.WriteLine('AUTH LOGIN'); $rd.ReadLine() | Out-Null
  $wr.WriteLine($b64u);        $rd.ReadLine() | Out-Null
  $wr.WriteLine($b64p)
  $res = $rd.ReadLine()
  if ($res -match '^235') {
    $smtpOK = $true; Say "  OK  SMTP AUTHENTICATED - outgoing mail works with this password."
    if ($SendTest) {
      $wr.WriteLine("MAIL FROM:<$Address>");  $rd.ReadLine() | Out-Null
      $wr.WriteLine("RCPT TO:<$Address>");    $rd.ReadLine() | Out-Null
      $wr.WriteLine('DATA');                  $rd.ReadLine() | Out-Null
      $wr.WriteLine("Subject: HCC mail test " + (Get-Date).ToString('HH:mm:ss'))
      $wr.WriteLine("From: $Address"); $wr.WriteLine("To: $Address"); $wr.WriteLine("")
      $wr.WriteLine("Sent by Repair-ComcastMail.ps1. If you can read this, sending works.")
      $wr.WriteLine(".")
      Say ("  test send: " + $rd.ReadLine())
    }
  } else { $fail++; Say ("  FAIL  SMTP AUTH REJECTED: " + $res) }
  $wr.WriteLine('QUIT'); $c.Close()
} catch { $fail++; Say ("  FAIL  SMTP could not connect: " + $_.Exception.Message) }

# wipe the credential from memory the moment the two tests are done
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
$plain = $null; $sasl = $null; $b64p = $null
[GC]::Collect()

# ---------------------------------------------------------------- 6. VERDICT
Head "6. VERDICT"
if ($imapOK -and $smtpOK) {
  Say "  BOTH AUTHENTICATED. The password is good and Comcast is not blocking this machine."
  Say "  => The fault is the SAVED password inside the mail client, nothing else."
  Say "     Open the client's account settings and replace the stored password with the one"
  Say "     you just typed. Servers must read:"
  Say "       IMAP  imap.comcast.net  993  SSL/TLS"
  Say "       SMTP  smtp.comcast.net  587  STARTTLS"
  Say "       username = the FULL address, $Address  (not just the part before the @)"
  Say "     The Outbox drains itself once it authenticates."
} else {
  Say "  AT LEAST ONE AUTH FAILED. In this order:"
  Say "   a) THIRD PARTY ACCESS SECURITY is OFF. It is off by default and it refuses EVERY"
  Say "      desktop client no matter how correct the password is. Turn it on:"
  Say "        connect.xfinity.com -> Gear -> Settings -> Security -> tick Third Party Access"
  Say "      Then re-run this script. This is the single most likely cause."
  Say "   b) Wrong password - re-copy it from Bitwarden, it is 32 characters."
  Say "   c) Comcast 2FA (recorded ON, codes to 615-315-1844) may require an app-specific"
  Say "      password for mail clients. If (a) and (b) are clean and it still fails, that is next."
}
Say ""
Say "  Whatever the result: everything that failed to download since 2026-08-19 is readable"
Say "  RIGHT NOW at connect.xfinity.com. Contractor quotes may be sitting there. Check Spam too."
Say ""
if ($imapOK -and $smtpOK) { exit 0 } else { exit 1 }
