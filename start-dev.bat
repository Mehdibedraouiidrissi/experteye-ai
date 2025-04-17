
@echo off
echo Starting ExpertEye development environment...

:: Start the backend server
echo Starting Python backend server...
cd experteye-backend
start cmd /k python main.py

:: Return to the root directory and start the frontend
cd ..
echo Starting React frontend...
start cmd /k npm run dev

echo Both servers are now running!
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:8080
