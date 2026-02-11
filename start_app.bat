@echo off
echo Starting Mental Health Virtual Companion...

echo Starting Backend (FastAPI)...
start "Mental Health Backend" cmd /k "uvicorn backend.main:app --reload --port 8000"

echo Starting Frontend (React)...
cd frontend
start "Mental Health Frontend" cmd /k "npm run dev"

echo App is launching!
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
pause
