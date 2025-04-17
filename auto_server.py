import http.server
import socketserver
import os
import sys
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
import threading

PORT = 8000
server_process = None

class MyHandler(FileSystemEventHandler):
    def __init__(self):
        self.restart_server()
    
    def restart_server(self):
        global server_process
        if server_process:
            server_process.terminate()
            server_process.wait()
        
        print("\nStarting server...")
        server_process = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT)])
    
    def on_modified(self, event):
        if event.src_path.endswith(('.html', '.css', '.js', '.png', '.jpg', '.jpeg')):
            print(f"\nFile changed: {event.src_path}")
            self.restart_server()

def run_server():
    event_handler = MyHandler()
    observer = Observer()
    observer.schedule(event_handler, path='.', recursive=False)
    observer.start()
    
    print(f"Watching for file changes... Server running at http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        if server_process:
            server_process.terminate()
    observer.join()

if __name__ == "__main__":
    run_server() 