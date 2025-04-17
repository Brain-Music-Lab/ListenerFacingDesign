#! /usr/bin/bash

# Save current directory
pushd .

# Go to current directory
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "$(pwd)" != "$script_dir" ]; then
    echo "This script must be run from the directory where it's located."
    exit 1
fi

# Check for production flag
IS_PROD=false
START_MSG="INFO: Running in DEVELOPMENT mode. To run in PRODUCTION mode, add the --prod flag."

if [ "$1" = "--prod" ]; then
    IS_PROD=true
    START_MSG="INFO: Running in PRODUCTION mode. To run in DEVELOPMENT mode, remove the --prod flag."
fi

# Read environment variables from .env
if [ -f .env ]; then
    source .env
else
    echo "ERROR: .env file not found"
    exit 1
fi

# Validate required environment variables
if [ -z "$NEXT_JS_PORT" ] || [ -z "$FASTAPI_PORT" ]; then
    echo "ERROR: Missing required environment variables in .env file. See .env.example for a reference."
    echo "Required variables:"
    echo "- NEXT_JS_PORT"
    echo "- FASTAPI_PORT"
    exit 1
fi

echo $START_MSG
sleep 1
echo "INFO: Application will start in 5 seconds..."
sleep 5

# Name the session
SESSION="BML"

# Start a new tmux session, detached
tmux new-session -d -s $SESSION

# Rename the window
tmux rename-window -t $SESSION 'Data Station'

# Set the commands based on environment
if [ "$IS_PROD" = true ]; then
    FRONTEND_CMD="npm run build && npm run start -- -p $NEXT_JS_PORT"
    BACKEND_CMD="uvicorn main:app --host localhost --port $FASTAPI_PORT"
else
    FRONTEND_CMD="npm run dev -- -p $NEXT_JS_PORT"
    BACKEND_CMD="uvicorn main:app --reload --host localhost --port $FASTAPI_PORT"
fi

# Run Next.js in first pane
tmux send-keys -t $SESSION "bash -c \"trap \\\"tmux kill-pane\\\" SIGINT; cd frontend && $FRONTEND_CMD\"" C-m

# Split window horizontally (creates a second pane)
tmux split-window -h -t $SESSION

# Run FastAPI in the second pane
tmux send-keys -t $SESSION "bash -c \"trap \\\"tmux kill-pane\\\" SIGINT; cd backend && . .venv/bin/activate && $BACKEND_CMD\"" C-m

# Select first pane by default (optional)
tmux select-pane -t 0

# Attach to the session
tmux attach -t $SESSION
