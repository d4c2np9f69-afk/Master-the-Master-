# Jeff, 2026-09-19 16:44: "find out if the acer has any data that tells us why
# it's doing so great now."
#
# The fixes landed TOGETHER (display-never at ~07:45, 15/15 devices blocked from
# powering down at ~07:47, Green Ethernet/EEE off at ~07:50), so the experiment
# is confounded by design. But the machine keeps its own logs, and if some
# device was cycling power BEFORE and stopped AFTER, that un-confounds it.
#
# Compares the SAME event classes across two windows:
#   BEFORE : 2026-09-18 11:26  ->  2026-09-19 07:12   (the seven-freeze period)
#   AFTER  : 2026-09-19 07:50  ->  now                (since the fixes)
# Rates are per hour, because the windows are different lengths and raw counts
# would lie.
$ErrorActionPreference = 'SilentlyContinue'
function L($a,$b){ Write-Output ("  {0,-46} {1}" -f $a,$b) }

$fixT   = Get-Date '2026-09-19 07:50'
$beforeS= Get-Date '2026-09-18 11:26'
$beforeE= Get-Date '2026-09-19 07:12'
$now    = Get-Date
$hB = ($beforeE - $beforeS).TotalHours
$hA = ($now - $fixT).TotalHours
Write-Output "================================================================"
Write-Output ("  WHY IS IT STABLE?  before={0:N1}h (7 freezes)   after={1:N1}h (0 freezes)" -f $hB,$hA)
Write-Output "================================================================"

function Rate($name, $filter) {
    $b = @(Get-WinEvent -FilterHashtable ($filter + @{StartTime=$beforeS; EndTime=$beforeE}) -EA SilentlyContinue).Count
    $a = @(Get-WinEvent -FilterHashtable ($filter + @{StartTime=$fixT}) -EA SilentlyContinue).Count
    $rb = if ($hB -gt 0) { $b/$hB } else { 0 }
    $ra = if ($hA -gt 0) { $a/$hA } else { 0 }
    $verdict = if ($rb -gt 0 -and $ra -eq 0) { '  <<< STOPPED COMPLETELY' }
               elseif ($rb -gt 0 -and $ra -lt ($rb*0.34)) { '  <<< dropped sharply' }
               elseif ($rb -eq 0 -and $ra -eq 0) { '' }
               else { '' }
    Write-Output ("  {0,-42} before {1,7:N2}/h   after {2,7:N2}/h{3}" -f $name, $rb, $ra, $verdict)
}

Write-Output ""
Write-Output "--- DEVICE / POWER TRANSITIONS (the thing that was changed) ---"
Rate 'Kernel-Power (all)'        @{LogName='System'; ProviderName='Microsoft-Windows-Kernel-Power'}
Rate 'Kernel-Processor-Power'    @{LogName='System'; ProviderName='Microsoft-Windows-Kernel-Processor-Power'}
Rate 'Kernel-PnP'                @{LogName='System'; ProviderName='Microsoft-Windows-Kernel-PnP'}
Rate 'UserModePowerService'      @{LogName='System'; ProviderName='Microsoft-Windows-UserModePowerService'}

Write-Output ""
Write-Output "--- NETWORK CONTROLLERS (my prime suspect: a NIC sleeping at idle) ---"
Rate 'Realtek Ethernet (rt640x64/Netwtw)' @{LogName='System'; ProviderName='rt640x64'}
Rate 'NDIS (link up/down)'       @{LogName='System'; ProviderName='Microsoft-Windows-NDIS'}
Rate 'WLAN-AutoConfig'           @{LogName='System'; ProviderName='Microsoft-Windows-WLAN-AutoConfig'}
Rate 'Dhcp-Client'               @{LogName='System'; ProviderName='Microsoft-Windows-Dhcp-Client'}

Write-Output ""
Write-Output "--- STORAGE (already ruled out, but prove it stayed ruled out) ---"
Rate 'disk'                      @{LogName='System'; ProviderName='disk'}
Rate 'volmgr'                    @{LogName='System'; ProviderName='volmgr'}
Rate 'Ntfs'                      @{LogName='System'; ProviderName='Microsoft-Windows-Ntfs'}
Rate 'storahci'                  @{LogName='System'; ProviderName='storahci'}

Write-Output ""
Write-Output "--- ERRORS + WARNINGS overall ---"
Rate 'System log: Errors'        @{LogName='System'; Level=2}
Rate 'System log: Warnings'      @{LogName='System'; Level=3}

Write-Output ""
Write-Output "--- WHAT WAS LOGGED IN THE 10 MIN BEFORE EACH FREEZE ---"
Write-Output "    (freeze = the unclean boot that followed it)"
foreach ($b in @('2026-09-18 15:54:46','2026-09-18 21:03:33','2026-09-18 23:21:48','2026-09-19 07:12:55')) {
    $bt = [datetime]$b
    $ev = Get-WinEvent -FilterHashtable @{LogName='System'; StartTime=$bt.AddMinutes(-10); EndTime=$bt.AddSeconds(-5)} -EA SilentlyContinue
    Write-Output "  --- before $b : $(@($ev).Count) events ---"
    if ($ev) {
        $ev | Group-Object ProviderName | Sort-Object Count -Descending | Select-Object -First 4 |
            ForEach-Object { Write-Output ("      {0,-44} {1}" -f $_.Name, $_.Count) }
        $ev | Sort-Object TimeCreated -Descending | Select-Object -First 2 |
            ForEach-Object { Write-Output ("      LAST: {0} [{1}] {2}" -f $_.TimeCreated.ToString('HH:mm:ss'), $_.Id, $_.ProviderName) }
    }
}

Write-Output ""
Write-Output "--- IS THE MACHINE ACTUALLY IDLE NOW, or just busy? ---"
$os = Get-CimInstance Win32_OperatingSystem
L 'uptime (h)' ([math]::Round(((Get-Date)-$os.LastBootUpTime).TotalHours,2))
L 'CPU load %' (Get-CimInstance Win32_Processor).LoadPercentage
L 'logged-on sessions' (@(Get-CimInstance Win32_LogonSession | Where-Object { $_.LogonType -in 2,10 }).Count)
L 'devices still allowed to sleep' (@((Get-CimInstance -Namespace root\wmi -ClassName MSPower_DeviceEnable) | Where-Object { $_.Enable -eq $true }).Count)
