import http.server
import socketserver
import os
import time
from datetime import datetime

PORT = 8000

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {self.path}")
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

def run_server():
    handler = MyHttpRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server() 