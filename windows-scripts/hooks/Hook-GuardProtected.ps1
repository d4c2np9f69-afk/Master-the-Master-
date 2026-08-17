<#
  HCC ENFORCEMENT HOOK - PreToolUse on Edit|Write

  Two hard blocks, both mechanical (no judgement, no discipline required):

  1. CLAUDE.md's PROTECTED sections cannot be removed. Jeff's Message, The
     Working Relationship, the Mandatory Rules, the Debugging Protocol and
     SETTLED DECISIONS are the point of the project. Every past compression had
     to PROVE it left them byte-identical; this makes proving unnecessary.

  2. No secret may be written into the repo. The repo is PUBLIC. A Weather
     Underground API key has been sitting in CLAUDE.md in the clear.

  Exit 0 + permissionDecision 'deny' = the edit does not happen.
#>
$ErrorActionPreference = 'SilentlyContinue'

$raw = [Console]::In.ReadToEnd()
try { $j = $raw | ConvertFrom-Json } catch { exit 0 }

$path = "$($j.tool_input.file_path)"
if (-not $path) { exit 0 }

function Deny($reason) {
  @{
    hookSpecificOutput = @{
      hookEventName            = 'PreToolUse'
      permissionDecision       = 'deny'
      permissionDecisionReason = $reason
    }
    systemMessage = "HCC GUARD BLOCKED THIS EDIT"
  } | ConvertTo-Json -Depth 5 -Compress | Write-Output
  exit 0
}

# ---------- Guard 1: PROTECTED sections in CLAUDE.md ----------
if ($path -match 'CLAUDE\.md$') {
  $PROTECTED = @(
    "## Jeff's Message",
    '## The Working Relationship',
    '## Mandatory Rules',
    'Debugging Protocol',
    'SETTLED DECISIONS'
  )
  # Reconstruct what the file will look like after this edit.
  $after = $null
  if ($j.tool_input.content) {
    $after = "$($j.tool_input.content)"                       # Write = whole file
  } elseif ($j.tool_input.old_string -and (Test-Path $path)) {
    $cur = Get-Content $path -Raw
    $after = $cur.Replace("$($j.tool_input.old_string)", "$($j.tool_input.new_string)")
  }
  if ($after) {
    $lost = @()
    foreach ($p in $PROTECTED) { if ($after -notmatch [regex]::Escape($p)) { $lost += $p } }
    if ($lost.Count -gt 0) {
      Deny ("BLOCKED: this edit removes PROTECTED section(s) from CLAUDE.md: " +
            ($lost -join '; ') + ". These carry Jeff's own words and the rules the " +
            "project runs on. Rule 11 states they are NEVER trimmed or compressed - " +
            "compression only ever touches history/changelog/reference. Rewrite the " +
            "edit so every PROTECTED heading survives.")
    }
  }
}

# ---------- Guard 2: no secrets into the public repo ----------
if ($path -match 'master-the-master-' -and $path -notmatch 'HCC-secrets') {
  $body = "$($j.tool_input.content)$($j.tool_input.new_string)"
  if ($body) {
    $patterns = @{
      'Weather Underground / generic 32-hex API key' = '\b[0-9a-f]{32}\b'
      'Bearer/JWT token'                             = 'eyJ[A-Za-z0-9_\-]{10,}\.eyJ[A-Za-z0-9_\-]{10,}'
      'GitHub token'                                 = '\bgh[pousr]_[A-Za-z0-9]{30,}\b'
      'AWS access key'                               = '\bAKIA[0-9A-Z]{16}\b'
      'Private key block'                            = '-----BEGIN [A-Z ]*PRIVATE KEY-----'
      'HA long-lived token file content'             = 'ha_backup_token|ha_backup_encryption_key'
    }
    foreach ($name in $patterns.Keys) {
      if ($body -match $patterns[$name]) {
        Deny ("BLOCKED: this edit would write what looks like a SECRET ($name) into " +
              "$path. That repo is PUBLIC. Secrets live ONLY in " +
              "C:\Users\jeffl\HCC-secrets\ and are referenced, never copied. If this " +
              "is a false positive, put the value in HCC-secrets and reference it.")
      }
    }
  }
}

exit 0
