
#!/bin/bash

# Start the backend server
echo "Starting Python backend server..."
cd experteye-backend
python main.py &
BACKEND_PID=$!

# Start the frontend
echo "Starting React frontend..."
cd ..
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

# Keep script running
wait
