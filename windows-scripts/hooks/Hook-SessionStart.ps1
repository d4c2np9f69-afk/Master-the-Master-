<#
  HCC ENFORCEMENT HOOK - SessionStart

  Rule 15 says "read docs/SESSION_START.md in full at the start of every session."
  Rule 1 has said "READ THIS FILE FIRST" since 2026-06-24. The archive's own
  finding: "Rule-1 compliance leaves no trace. How many sessions never read
  CLAUDE.md at all is uncountable. Only breakage is visible."

  So this stops relying on a session choosing to read anything. It INJECTS the
  cost ledger, the killed-hardware list, and the real clock directly into context
  before the session can do anything. No discipline required.
#>
$ErrorActionPreference = 'SilentlyContinue'
$repo = 'C:\Users\jeffl\Documents\GitHub\master-the-master-'

$out = @()
$out += "================= HCC PROJECT - MANDATORY SESSION BRIEFING ================="
$out += "Injected automatically. You did not choose to read this; that is the point."
$out += ""
$out += "REAL TIME NOW: " + (Get-Date -Format 'dddd yyyy-MM-dd hh:mm tt') + " local"
$out += "  (Rule 14. Never infer the time from conversation - it has been broken twice.)"
$out += ""

# The bill - the whole reason the rules exist
$ledger = Join-Path $repo 'docs\COST_LEDGER.md'
if (Test-Path $ledger) {
  $out += "----- WHAT IGNORING THE RULES HAS ALREADY COST JEFF -----"
  $out += "  28.8 measured hours of error-fighting (~44 incl. pre-commit)"
  $out += "  128 incident-days | 95 of 636 commits (14.9%) were self-inflicted fixes"
  $out += "  ~`$234 of Claude Max burned + mower sensors he did not need to buy"
  $out += "  Worst single failure: hour meter dead 50 days across 5 real mows."
  $out += "  Read docs\COST_LEDGER.md. Full detail: MASTER-RECORD\CLOUD_SESSION\."
  $out += ""
}

$out += "----- NEVER RE-PROPOSE (Jeff killed these; re-pitching costs trust) -----"
$out += "  Inovelli Blue 2-1 (~`$120/pair) - 'I was not paying `$120 for a freaking"
$out += "  dimmer switch.' Also: Enbrighten 43080, Enbrighten Z-Wave, Shelly Pro"
$out += "  3EM-400, Orbit 51059, HomeKit Secure Video, myQ integration, Blink RTSP."
$out += "  CURRENT lighting plan = Kasa switches + cheap Zigbee PLUGS for the mesh."
$out += ""
$out += "----- THE FIVE RULES THAT KEEP BREAKING -----"
$out += "  1. LOOK IT UP. The record contains NO case where guessing beat the lookup."
$out += "  2. VERIFY THE FAR END. Component checks were green through every failure."
$out += "  3. WRITE JEFF'S DECISIONS INTO A FILE THE SAME SESSION. Not later."
$out += "  4. SEARCH BEFORE CLAIMING. Never say 'that isn't documented' un-searched."
$out += "  5. NEVER NAME A PART FROM MEMORY. Verify in-session or say 'let me check.'"
$out += ""
$out += "----- YOUR TOOLS (cheap, use them) -----"
$out += "  .\windows-scripts\Show-HCCNext.ps1        where we are / what's next (~600 tok)"
$out += "  .\windows-scripts\Search-HCC.ps1 `"topic`"  what happened / what was decided"
$out += ""
$out += "----- LIVE SAFETY GAP, STILL OPEN -----"
$out += "  A person in the back yard at night may still be undetectable. See"
$out += "  CLAUDE.md Pending Item 0b before touching the camera stack."
$out += "==========================================================================="

@{
  hookSpecificOutput = @{
    hookEventName     = 'SessionStart'
    additionalContext = ($out -join "`n")
  }
} | ConvertTo-Json -Depth 5 -Compress | Write-Output
exit 0
