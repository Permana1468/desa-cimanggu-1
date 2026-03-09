@echo off
echo ==========================================
echo Starting Django Backend and React Frontend
echo ==========================================

:: Using concurrently to run both in the same terminal
npx concurrently -n "BACKEND,FRONTEND" -c "bgBlue.bold,bgMagenta.bold" "venv\Scripts\python.exe manage.py runserver" "npm run dev --prefix frontend"
