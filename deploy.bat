@echo off
chcp 65001 > nul
echo ========================================================
echo   LopiX Web Sitesi - GitHub'a Yukleniyor...
echo ========================================================
echo.

cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"

pause
