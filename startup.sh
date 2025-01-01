#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

if [ -f ".env" ]; then
  while IFS='=' read -r key value; do
    if [[ -n "$key" ]]; then
      export "$key"="$value"
    fi
  done < .env
fi

log_info() {
  date +"%Y-%m-%d %H:%M:%S" "$@"
}

log_error() {
  date +"%Y-%m-%d %H:%M:%S" "$@" >&2
}

cleanup() {
  log_info "Cleaning up..."
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null
  fi
   if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null
  fi
    if [ -n "$COMMANDS_PID" ]; then
    kill "$COMMANDS_PID" 2>/dev/null
  fi
}

check_dependencies() {
    if ! command -v npm &> /dev/null; then
         log_error "Error: npm is not installed."
      exit 1
    fi
     if ! command -v jq &> /dev/null; then
        log_info "Warning: jq is not installed, skipping commands.json"
    fi
}

trap cleanup EXIT ERR

check_dependencies

if [ -f "commands.json" ] && command -v jq &> /dev/null; then
    log_info "Executing commands from commands.json"
    COMMANDS_PID=$(bash -c "jq -r '.startup[]' commands.json | while read -r cmd; do bash -c \"\$cmd\" ; done > commands.log 2>&1 & echo \$!" )
    log_info "Commands execution started in background with PID: $COMMANDS_PID, see commands.log for details"
fi

log_info "Starting backend server"
bash -c "npm run start:backend > backend.log 2>&1 & echo $!" | read BACKEND_PID
log_info "Backend server started with PID: $BACKEND_PID, see backend.log for details"

log_info "Starting frontend development server"
bash -c "npm run start:frontend > frontend.log 2>&1 & echo $!" | read FRONTEND_PID
log_info "Frontend development server started with PID: $FRONTEND_PID, see frontend.log for details"

log_info "Application started successfully"