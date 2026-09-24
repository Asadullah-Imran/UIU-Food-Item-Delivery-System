#!/bin/bash

echo "Starting Server and Client..."

# Start the server in the background
(cd server && npm run dev) &
SERVER_PID=$!

# Start the client in the background
(cd client && npm run dev) &
CLIENT_PID=$!

# Handle shutdown cleanly on Ctrl+C
trap "echo 'Shutting down...'; kill $SERVER_PID $CLIENT_PID; exit" SIGINT SIGTERM

# Wait for processes
wait $SERVER_PID $CLIENT_PID
