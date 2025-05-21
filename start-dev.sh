
#!/bin/bash

echo "Starting ExpertEye development environment..."

# Create a function to check if Python is installed
check_python() {
  echo "Checking Python installation..."
  if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "ERROR: Python is not installed. Please install Python 3.x to run the backend."
    exit 1
  fi
  echo "Python is installed."
}

# Function to check if pip is installed
check_pip() {
  echo "Checking pip installation..."
  if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
    echo "ERROR: pip is not installed. Please install pip to install Python dependencies."
    exit 1
  fi
  echo "pip is installed."
}

# Check Python and pip installation
check_python
check_pip

# Install Python requirements
echo "Installing Python dependencies..."
cd experteye-backend
PIP_CMD="pip"
if command -v pip3 &> /dev/null; then
  PIP_CMD="pip3"
fi
$PIP_CMD install -r requirements.txt
if [ $? -ne 0 ]; then
  echo "ERROR: Failed to install Python dependencies. Please check the error message above."
  exit 1
fi
cd ..

# Start the backend server
echo "Starting Python backend server..."
cd experteye-backend
PYTHON_CMD="python"
if command -v python3 &> /dev/null; then
  PYTHON_CMD="python3"
fi
$PYTHON_CMD main.py &
BACKEND_PID=$!
cd ..

# Wait a bit for the backend to start
echo "Waiting for backend server to initialize..."
sleep 3

# Check if backend is running
if ! ps -p $BACKEND_PID > /dev/null; then
  echo "ERROR: Backend server failed to start. Please check the error messages above."
  exit 1
fi

echo "Backend server is running on http://localhost:5000"
echo "Backend health check endpoint: http://localhost:5000/api/healthcheck"

# Start the frontend
echo "Starting React frontend..."
npm run dev &
FRONTEND_PID=$!

# Function to handle termination
function cleanup {
  echo "Shutting down servers..."
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  exit
}

# Catch interrupt signal (Ctrl+C)
trap cleanup SIGINT

echo "ExpertEye development environment is running!"
echo "- Frontend: http://localhost:8080"
echo "- Backend: http://localhost:5000"
echo "- To stop, press Ctrl+C"

# Wait for both processes to finish (which should be never unless ctrl+c is pressed)
wait $BACKEND_PID $FRONTEND_PID
