# Runs ON the Acer. Answers one question for Verify-Network.ps1: does this machine
# have Jeff's files? Prints exactly:  email|filecount|syncrunning
# Kept as a file because inline PowerShell over ssh breaks on quoting every time.
$a = Get-ItemProperty 'HKCU:\Software\Microsoft\OneDrive\Accounts\Personal' -ErrorAction SilentlyContinue
$n = 0
if ($a -and $a.UserFolder -and (Test-Path $a.UserFolder)) {
    $n = (Get-ChildItem $a.UserFolder -File -Recurse -Depth 1 -ErrorAction SilentlyContinue | Measure-Object).Count
}
$r = [bool](Get-Process OneDrive -ErrorAction SilentlyContinue)
Write-Output ("{0}|{1}|{2}" -f $a.UserEmail, $n, $r)
