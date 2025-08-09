@echo off
setlocal

echo 🛠️ Setting up StudentHub Development Environment

:: Check for Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is required but not installed. Please install Node.js 18+
    pause
    exit /b 1
)

:: Check for npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is required but not installed.
    pause
    exit /b 1
)

echo [INFO] Node.js version:
node --version

echo [INFO] npm version:
npm --version

:: Setup environment files
echo [INFO] Setting up environment files...
if not exist "backend\.env" (
    echo [INFO] Creating backend\.env from template...
    copy ".env.example" "backend\.env"
    echo [WARN] Please update backend\.env with your production values
) else (
    echo [INFO] backend\.env already exists ✅
)

:: Install dependencies
echo [INFO] Installing dependencies...

echo [INFO] Installing backend dependencies...
cd backend
call npm install
cd ..

echo [INFO] Installing frontend dependencies...
cd frontend
call npm install
cd ..

:: Setup directories
echo [INFO] Setting up directories...
if not exist "backend\uploads\profiles" mkdir "backend\uploads\profiles"
if not exist "backend\uploads\posts" mkdir "backend\uploads\posts"
if not exist "backend\logs" mkdir "backend\logs"

:: Create root package.json
echo [INFO] Creating development scripts...
if not exist "package.json" (
    echo { > package.json
    echo   "name": "studenthub", >> package.json
    echo   "version": "1.0.0", >> package.json
    echo   "description": "StudentHub - Full Stack Student Network Platform", >> package.json
    echo   "scripts": { >> package.json
    echo     "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"", >> package.json
    echo     "dev:backend": "cd backend && npm run dev", >> package.json
    echo     "dev:frontend": "cd frontend && npm run dev", >> package.json
    echo     "build": "cd frontend && npm run build && move dist ..\\backend\\public", >> package.json
    echo     "start": "cd backend && npm start", >> package.json
    echo     "install:all": "npm install && cd backend && npm install && cd ..\\frontend && npm install" >> package.json
    echo   }, >> package.json
    echo   "devDependencies": { >> package.json
    echo     "concurrently": "^8.2.2" >> package.json
    echo   } >> package.json
    echo } >> package.json
    
    call npm install
    echo [INFO] Root package.json created ✅
)

:: Create start script
echo @echo off > start-dev.bat
echo echo 🚀 Starting StudentHub Development Environment >> start-dev.bat
echo echo Backend will run on: http://localhost:3000 >> start-dev.bat
echo echo Frontend will run on: http://localhost:5173 >> start-dev.bat
echo echo. >> start-dev.bat
echo echo Press Ctrl+C to stop both servers >> start-dev.bat
echo npm run dev >> start-dev.bat

echo.
echo [INFO] 🎉 Development environment setup complete!
echo.
echo [INFO] Next steps:
echo [INFO] 1. Update backend\.env with your database and API credentials
echo [INFO] 2. Start development servers:
echo [INFO]    start-dev.bat
echo [INFO]    OR
echo [INFO]    npm run dev
echo.
echo [INFO] Development URLs:
echo [INFO] • Backend API: http://localhost:3000
echo [INFO] • Frontend App: http://localhost:5173
echo [INFO] • Health Check: http://localhost:3000/health
echo.
echo [INFO] Useful commands:
echo [INFO] • npm run dev - Start both servers
echo [INFO] • npm run dev:backend - Start backend only
echo [INFO] • npm run dev:frontend - Start frontend only
echo [INFO] • npm run build - Build frontend for production
echo.
echo [INFO] Configuration files:
echo [INFO] • Backend config: backend\.env
echo [INFO] • Frontend config: frontend\vite.config.js

pause
