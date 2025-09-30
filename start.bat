@echo off
echo ============================================
echo Terra Interactive Globe - Quick Start
echo ============================================
echo.

:: Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Starting server with Python...
    echo.
    echo Open your browser to: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
    exit /b
)

:: Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python not found. Trying with Node.js...
    echo.
    echo Installing http-server...
    call npx -y http-server -p 8000 -c-1
    exit /b
)

:: Check if PHP is available
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python and Node.js not found. Trying with PHP...
    echo.
    echo Open your browser to: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    php -S localhost:8000
    exit /b
)

echo.
echo ERROR: No suitable web server found!
echo Please install one of the following:
echo   - Python (recommended): https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo   - PHP: https://www.php.net/downloads
echo.
pause
