@echo off

echo ==================================
echo Starting Hybrid Search Application
echo ==================================

echo Starting Backend...

start cmd /k "cd backend && call venv\Scripts\activate.bat && python -m uvicorn main:app --reload"

timeout /t 3 > nul

echo Starting Frontend...

start cmd /k "cd frontend && npm run dev"

echo Application Started
pause