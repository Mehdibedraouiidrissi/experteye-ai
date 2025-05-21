
@echo off
echo Starting ExpertEye development environment...

:: Check if Python is installed
python --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Python is not installed. Please install Python 3.x to run the backend.
  exit /b 1
)

:: Check if pip is installed
pip --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: pip is not installed. Please install pip to install Python dependencies.
  exit /b 1
)

:: Install Python requirements
echo Installing Python dependencies...
cd experteye-backend

:: Try to upgrade pip first
echo Attempting to upgrade pip...
python -m pip install --upgrade pip

echo Installing required packages...
python -m pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Failed to install Python dependencies. Please check the error message above.
  exit /b 1
)

:: Start the backend server
echo Starting Python backend server...
start cmd /k python main.py

:: Return to the root directory and start the frontend
cd ..
echo Starting React frontend...
echo Installing any needed npm packages...
npm install
echo Running update-browserslist script...
call update-browserslist.sh
start cmd /k npm run dev

echo Both servers are now running!
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:8080
echo.
echo If you encounter any issues connecting to the backend:
echo 1. Check that you can access http://localhost:5000/api/healthcheck in your browser
echo 2. Ensure no other application is using port 5000
echo 3. Try restarting both servers
