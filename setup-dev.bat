@echo off
echo Setting up StudentHub for development...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed: 
node --version

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: npm is not available
    pause
    exit /b 1
)

echo npm is available:
npm --version

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
cd ..\frontend
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Go back to root directory
cd ..

echo.
echo Setup complete!
echo.
echo To run the application:
echo 1. Start backend: cd backend && npm run dev
echo 2. Start frontend: cd frontend && npm run dev
echo.
echo Or use Docker:
echo docker-compose up --build
echo.
echo Make sure to set up your environment variables in:
echo - backend/.env (copy from backend/.env.example)
echo.
pause
