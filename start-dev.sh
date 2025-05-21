
#!/bin/bash

echo "Starting ExpertEye development environment..."

# Install Python requirements
echo "Installing Python dependencies..."
cd experteye-backend
pip install -r requirements.txt
cd ..

# Start the backend server
echo "Starting Python backend server..."
cd experteye-backend
python main.py &
BACKEND_PID=$!
cd ..

# Start the frontend
echo "Starting React frontend..."
npm run dev &
FRONTEND_PID=$!

# Function to handle termination
function cleanup {
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Catch interrupt signal (Ctrl+C)
trap cleanup SIGINT

# Wait for both processes to finish (which should be never unless ctrl+c is pressed)
wait $BACKEND_PID $FRONTEND_PID
