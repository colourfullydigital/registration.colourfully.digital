#!/bin/bash

# Check if node index.js is already running
pid=$( ps aux | grep "node index.js" | grep -v grep | awk '{ print $2 }' )

if [ -n "$pid" ]; then
  echo "Found running process with PID: $pid"
  # Kill the running process
  kill $pid
  echo "Killed process with PID: $pid"
else
  echo "No running process found."
fi

# Start node index.js in the background
echo "Starting node app.js in the background..."
node app.js &
echo "Node app started in the background."
