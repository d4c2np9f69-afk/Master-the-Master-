# Runs ON the Acer. Reports OneDrive health as plain labelled lines - no nested
# quoting to break over ssh. Answers: is sync running, how many files, did the
# Beast's probe arrive here.
$r = [bool](Get-Process OneDrive -ErrorAction SilentlyContinue)
$n = (Get-ChildItem 'C:\Users\jeffl\OneDrive' -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count
$fromBeast = 'C:\Users\jeffl\OneDrive\.hcc-sync-probe-from-beast.txt'
$got = if (Test-Path $fromBeast) { (Get-Content $fromBeast -Raw).Trim() } else { 'NOT HERE YET' }
Write-Output "onedrive_running : $r"
Write-Output "file_count       : $n"
Write-Output "beast_probe      : $got"
