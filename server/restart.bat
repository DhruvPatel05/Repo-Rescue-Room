@echo off
echo Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Starting server...
cd /d "%~dp0"
start cmd /k "npm start"
echo Server restarted!

@REM Made with Bob
