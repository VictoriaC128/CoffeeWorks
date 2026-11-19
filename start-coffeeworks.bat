@echo off
title CoffeeWorks App
cd /d "%~dp0"
echo ===================================================
echo   Starting CoffeeWorks - Dial-in & Recipe Vault
echo   Opening in your browser: http://localhost:3000
echo ===================================================
timeout /t 2 /nobreak >nul
start http://localhost:3000
npm.cmd run dev
pause
