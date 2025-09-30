#!/bin/bash

echo "============================================"
echo "Terra Interactive Globe - Quick Start"
echo "============================================"
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Starting server with Python..."
    echo ""
    echo "Open your browser to: http://localhost:8000"
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
    exit 0
elif command -v python &> /dev/null; then
    echo "Starting server with Python..."
    echo ""
    echo "Open your browser to: http://localhost:8000"
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m http.server 8000
    exit 0
fi

# Check if Node.js is available
if command -v node &> /dev/null; then
    echo "Python not found. Trying with Node.js..."
    echo ""
    npx -y http-server -p 8000 -c-1
    exit 0
fi

# Check if PHP is available
if command -v php &> /dev/null; then
    echo "Python and Node.js not found. Trying with PHP..."
    echo ""
    echo "Open your browser to: http://localhost:8000"
    echo "Press Ctrl+C to stop the server"
    echo ""
    php -S localhost:8000
    exit 0
fi

echo ""
echo "ERROR: No suitable web server found!"
echo "Please install one of the following:"
echo "  - Python (recommended): https://www.python.org/downloads/"
echo "  - Node.js: https://nodejs.org/"
echo "  - PHP: https://www.php.net/downloads"
echo ""
