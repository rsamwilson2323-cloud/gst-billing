@echo off
title GST Billing Software
color 0A

echo ========================================
echo   GST Billing Software - Setup ^& Run
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo   https://nodejs.org
    echo.
    echo Then run this file again.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js version:
node --version
echo.

:: Install packages
echo [1/2] Installing packages... please wait...
echo.
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Package installation failed!
    echo.
    pause
    exit /b 1
)

echo.
echo [OK] Packages installed successfully!
echo.

:: Force port 5000 regardless of system environment
set PORT=5000
set NODE_ENV=development

:: Get local IP address
echo ========================================
echo   Starting GST Billing Software...
echo ========================================
echo.
echo   Local:    http://localhost:5000
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "169.254"') do (
    set IP=%%a
    goto :found_ip
)
:found_ip
set IP=%IP: =%
echo   Network:  http://%IP%:5000
echo.
echo   Press Ctrl+C to stop the server.
echo ========================================
echo.

:: Open browser after 4 seconds
start /b cmd /c "timeout /t 4 >nul && start http://localhost:5000"

:: Run the app
npx tsx server/index.ts

echo.
echo [INFO] Server stopped.
pause
