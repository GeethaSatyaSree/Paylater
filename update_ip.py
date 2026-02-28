#!/usr/bin/env python3
"""
Auto-detects the local network IP and updates frontend/.env
Run this whenever your IP changes: python update_ip.py
"""

import socket
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
FRONTEND_ENV = ROOT / "frontend" / ".env"


def get_local_ip() -> str:
    """Get the local network IP (192.168.x.x or 10.x.x.x)."""
    try:
        # Connect to an external address (doesn't actually send data)
        # This forces the OS to choose the correct outbound interface
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "localhost"


def update_env(ip: str, port: int = 8000) -> None:
    """Update VITE_API_URL in frontend/.env"""
    new_url = f"http://{ip}:{port}"
    new_line = f"VITE_API_URL={new_url}\n"

    if not FRONTEND_ENV.exists():
        FRONTEND_ENV.write_text(new_line)
        print(f"Created {FRONTEND_ENV}")
    else:
        content = FRONTEND_ENV.read_text()
        if re.search(r"^VITE_API_URL=.*$", content, re.MULTILINE):
            content = re.sub(
                r"^VITE_API_URL=.*$",
                f"VITE_API_URL={new_url}",
                content,
                flags=re.MULTILINE,
            )
        else:
            content += new_line
        FRONTEND_ENV.write_text(content)

    print(f"✅ Updated frontend/.env → VITE_API_URL={new_url}")


if __name__ == "__main__":
    ip = get_local_ip()
    print(f"🌐 Detected local IP: {ip}")
    update_env(ip)
    print()
    print("Run your servers:")
    print(
        f"  Backend:  python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    )
    print(f"  Frontend: npm run dev -- --host (in frontend/ folder)")
    print()
    print(f"Access from phone/tablet: http://{ip}:5173")
