@echo off
title GeoHydroAI - Pune Groundwater AI Platform Launcher
color 0b
echo =====================================================================
echo    GeoHydroAI: Pune Groundwater Potential Mapping Platform
echo =====================================================================
echo.
echo Starting Python FastAPI Backend Server on port 8000...
start "GeoHydroAI Backend" cmd /k "cd /d %~dp0 && python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Vite React GIS Frontend on port 3000...
start "GeoHydroAI Frontend" cmd /k "cd /d %~dp0frontend && npm run dev -- --port 3000"

echo.
echo Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:3000...
start http://localhost:3000

echo.
echo =====================================================================
echo  Application is running!
echo  - Frontend Web GIS: http://localhost:3000
echo  - Backend API Docs: http://localhost:8000/api/v1/docs
echo =====================================================================
