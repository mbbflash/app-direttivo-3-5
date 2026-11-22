#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

pkill -f "python3 server.py" 2>/dev/null || true
pkill -f "python3 .*/server.py" 2>/dev/null || true

python3 server.py &
SERVER_PID=$!
sleep 2

if kill -0 "$SERVER_PID" 2>/dev/null; then
  echo "Server attivo su http://localhost:8000/gestione-soci-associazione.html (PID: $SERVER_PID)"
  echo "Premi CTRL+C qui per fermare il server quando hai finito."
  wait "$SERVER_PID"
else
  echo "Errore: il server non si e' avviato."
  exit 1
fi
