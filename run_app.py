"""
Cross-platform 1-click application runner.
Spawns FastAPI backend and Vite frontend, then opens the browser automatically.
"""
import os
import sys
import time
import subprocess
import webbrowser

def main():
    base_dir = os.path.abspath(os.path.dirname(__file__))
    frontend_dir = os.path.join(base_dir, "frontend")

    print("=" * 65)
    print("🚀 GeoHydroAI: Launching Pune Groundwater Mapping Platform")
    print("=" * 65)

    # 1. Start Backend Server
    print("\n[1/2] Starting FastAPI Backend on http://localhost:8000 ...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=base_dir
    )

    # 2. Start Frontend Dev Server
    print("[2/2] Starting React GIS Frontend on http://localhost:3000 ...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev", "--", "--port", "3000"],
        cwd=frontend_dir
    )

    time.sleep(3)
    web_url = "http://localhost:3000"
    print(f"\n✨ Platform successfully initialized! Opening browser: {web_url}")
    webbrowser.open(web_url)

    print("\nPress Ctrl+C to terminate both servers.")
    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Application stopped cleanly.")

if __name__ == "__main__":
    main()
