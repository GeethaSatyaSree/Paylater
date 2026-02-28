#!/usr/bin/env bash
# ─────────────────────────────────────────────────────
# start.sh — Launch the full PayLater dev environment
# Usage (from project root in Git Bash): bash start.sh
# ─────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║      PayLater Dev Launcher 🚀        ║"
echo "╚══════════════════════════════════════╝"
echo ""

# 1. Auto-detect and update IP
echo "📡 Detecting local IP..."
python update_ip.py
echo ""

# 2. Activate virtual environment if it exists
if [ -f "myenv/Scripts/activate" ]; then
    echo "🐍 Activating virtual environment (myenv)..."
    source myenv/Scripts/activate
fi

# 3. Start backend in background
echo "⚙️  Starting backend (FastAPI)..."
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..
echo "   Backend PID: $BACKEND_PID"

# 4. Wait a moment for backend to be ready
sleep 3

# 5. Start frontend
echo ""
echo "🎨 Starting frontend (Vite)..."
cd frontend
npm run dev -- --host &
FRONTEND_PID=$!
cd ..
echo "   Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Both servers started!"
echo ""
echo "   Local:   http://localhost:5173"

# Read the IP from frontend/.env
API_URL=$(grep VITE_API_URL frontend/.env | cut -d'=' -f2)
IP=$(echo "$API_URL" | sed 's/http:\/\///' | cut -d':' -f1)
echo "   Network: http://${IP}:5173  (phone/tablet)"
echo "   Backend API: http://${IP}:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."
echo ""

# Keep script alive and handle Ctrl+C
trap "echo ''; echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM
wait
