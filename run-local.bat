@echo off
title ARQOVA - local dev server
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js is not installed. Download the LTS version from https://nodejs.org, install it, then run this file again.
  echo.
  pause
  exit /b 1
)

echo Node version:
node -v
echo.

if not exist node_modules (
  echo Installing packages - first run only, takes about a minute...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. See the messages above.
    pause
    exit /b 1
  )
)

echo.
echo Starting ARQOVA at http://localhost:5173  (close this window to stop)
echo.
call npm run dev -- --open --port 5173
pause
