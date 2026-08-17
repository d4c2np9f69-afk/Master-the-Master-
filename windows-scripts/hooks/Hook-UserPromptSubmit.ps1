<#
  HCC ENFORCEMENT HOOK - UserPromptSubmit

  THE FULL STOP for the single most expensive failure in this project's history:
  a session telling Jeff something "was never documented" when it was, or
  re-proposing something he already killed.

  When Jeff's message contains a phrase that means "we already settled this,"
  this hook injects a MANDATORY instruction into the model's context before it
  can answer. It cannot be skipped, forgotten, or reasoned around.

  Built 2026-08-17 after the archive documented 20 rule violations, 67 incidents,
  and ~44 hours of error-fighting. Jeff: "I want something in my place that 100%
  is a full stop for any infraction."
#>
$ErrorActionPreference = 'SilentlyContinue'

$raw = [Console]::In.ReadToEnd()
try { $j = $raw | ConvertFrom-Json } catch { $j = $null }
$prompt = "$($j.prompt)"
if (-not $prompt) { $prompt = $raw }

# Phrases that mean: Jeff is telling you something was already decided.
$claimPast = 'we (already )?(discussed|decided|talked about|settled|went over|covered)|' +
             'i (already )?told you|you (already )?told me|you said|that was settled|' +
             "didn'?t we|remember (when|that)|we agreed|i asked for|i wanted|" +
             'we had (this|that) (conversation|discussion)|like i said|as i said|' +
             'i have said|scrapped|already (asked|said|covered)'

# Phrases that mean: money or hardware is about to be discussed.
$spend = 'buy|purchase|order|cost|price|\$\d|cheaper|expensive|shop|cart|spend'

$fire = @()
if ($prompt -imatch $claimPast) { $fire += 'PAST' }
if ($prompt -imatch $spend)     { $fire += 'SPEND' }

# ALWAYS inject the real clock (Rule 14, broken 3 times as prose - now mechanical).
# Any day/date/time written in a reply must come from THIS stamp, never from narrative flow.
$clock = Get-Date -Format 'dddd yyyy-MM-dd h:mm tt'
$clockLine = "REAL CLOCK RIGHT NOW: $clock Central. Any 'today/tonight/[weekday]' in your reply MUST match this stamp."

if ($fire.Count -eq 0) {
  $out = @{
    hookSpecificOutput = @{
      hookEventName    = 'UserPromptSubmit'
      additionalContext = $clockLine
    }
  } | ConvertTo-Json -Depth 5 -Compress
  Write-Output $out
  exit 0
}

$msg = @()
$msg += $clockLine
$msg += "=========================================================================="
$msg += " HCC ENFORCEMENT HOOK FIRED - THIS IS A HARD STOP, NOT A SUGGESTION"
$msg += "=========================================================================="

if ($fire -contains 'PAST') {
  $msg += ""
  $msg += "Jeff's message asserts something was ALREADY DECIDED or ALREADY SAID."
  $msg += ""
  $msg += "YOU MUST, BEFORE WRITING ONE WORD OF YOUR REPLY:"
  $msg += "  1. RUN:  .\windows-scripts\Search-HCC.ps1 `"<the topic>`""
  $msg += "  2. QUOTE what it returns, with the date, in your reply."
  $msg += ""
  $msg += "  If the search finds NOTHING, the ONLY permitted sentence is:"
  $msg += "     'I can't find it written anywhere - tell me and I'll put it in the"
  $msg += "      file right now.'"
  $msg += "  You are FORBIDDEN from saying 'that was never documented.' Saying it"
  $msg += "  wrongly is what nearly ended this project on 2026-08-16 (twice in one"
  $msg += "  morning). The plan WAS documented; the search term was wrong."
  $msg += ""
  $msg += "  TRAP: an empty grep is NOT evidence of absence. Searching for the DEAD"
  $msg += "  plan and finding nothing is what the ABSENCE of that word looks like."
  $msg += "  Search for what the plan IS. Check file dates. Newest wins."
  $msg += ""
  $msg += "  JEFF IS A PRIMARY SOURCE. He was there. If he says it was decided and"
  $msg += "  the doc disagrees, THE DOC IS STALE - annotate it this session."
}

if ($fire -contains 'SPEND') {
  $msg += ""
  $msg += "Money or hardware is in play. BEFORE recommending ANYTHING:"
  $msg += "  1. CHECK CLAUDE.md 'SETTLED DECISIONS' - never re-pitch a killed item."
  $msg += "     ALREADY KILLED: Inovelli Blue (~`$120/pair) - Jeff: 'I was not paying"
  $msg += "     `$120 for a freaking dimmer switch.' Enbrighten 43080. Enbrighten"
  $msg += "     Z-Wave. Shelly Pro 3EM-400. Orbit 51059. HomeKit Secure Video."
  $msg += "  2. LEAD WITH THE `$0 OPTION - what Jeff already owns."
  $msg += "  3. NEVER name a product/model from memory. Verify by real search THIS"
  $msg += "     session or say 'let me check.' Three wrong models in a row on the"
  $msg += "     garage part made Jeff the fact-checker. He does not have time."
}

$msg += ""
$msg += "Cost of ignoring this: 28.8 measured hours, 128 incident-days, 95 of 636"
$msg += "commits, and hardware Jeff bought that he did not need. See COST_LEDGER.md."
$msg += "=========================================================================="

$out = @{
  hookSpecificOutput = @{
    hookEventName    = 'UserPromptSubmit'
    additionalContext = ($msg -join "`n")
  }
  systemMessage = "HCC guard: " + ($fire -join '+') + " - search required before replying"
} | ConvertTo-Json -Depth 5 -Compress

Write-Output $out
exit 0
