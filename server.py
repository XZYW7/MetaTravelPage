import http.server
import socketserver
import os
import json
import urllib.parse
import base64
import time
import uuid

PORT = 5000

# Paths relative to this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WWW_DIR = BASE_DIR
DIARIES_DIR = os.path.join(BASE_DIR, "diaries")
DATA_DIR = os.path.join(BASE_DIR, "data")
IMAGES_DIR = os.path.join(DATA_DIR, "images")

os.makedirs(DIARIES_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)


class MyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WWW_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # API: get all diary files list
        if path == "/api/diary-files":
            files = []
            if os.path.exists(DIARIES_DIR):
                for f in os.listdir(DIARIES_DIR):
                    if f.endswith(".md"):
                        files.append(f.replace(".md", ""))
            resp = json.dumps(
                {"ok": True, "files": sorted(files)}, ensure_ascii=False
            ).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            self.wfile.write(resp)
            return

        # API: get diary content
        elif path == "/api/diary":
            date = query.get("date", [None])[0]
            if date:
                filepath = os.path.join(DIARIES_DIR, f"{date}.md")
                if os.path.exists(filepath):
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()
                    resp = json.dumps(
                        {"ok": True, "content": content, "date": date},
                        ensure_ascii=False,
                    ).encode("utf-8")
                else:
                    resp = json.dumps(
                        {"ok": True, "content": "", "date": date}, ensure_ascii=False
                    ).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            else:
                files = []
                if os.path.exists(DIARIES_DIR):
                    for f in os.listdir(DIARIES_DIR):
                        if f.endswith(".md"):
                            files.append(f.replace(".md", ""))
                resp = json.dumps(
                    {"ok": True, "files": sorted(files)}, ensure_ascii=False
                ).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        # Serve images
        elif path.startswith("/images/"):
            filename = path[8:]
            filepath = os.path.join(IMAGES_DIR, filename)
            if os.path.exists(filepath):
                with open(filepath, "rb") as f:
                    content = f.read()
                
                ext = filename.split(".")[-1].lower()
                mime = "image/jpeg"
                if ext == "png": mime = "image/png"
                elif ext == "gif": mime = "image/gif"
                elif ext == "webp": mime = "image/webp"

                self.send_response(200)
                self.send_header("Content-type", mime)
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_response(404)
                self.send_header("Content-type", "text/plain")
                self.end_headers()
                self.wfile.write(b"Image not found")
            return

        # Serve static files
        elif path == "/" or path == "/index.html":
            self.path = "/index.html"
            return super().do_GET()
        elif path.startswith("/"):
            filepath = os.path.join(WWW_DIR, path[1:])
            if os.path.exists(filepath) and os.path.isfile(filepath):
                return super().do_GET()
            self.send_response(404)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(b"Not found")
        else:
            self.send_response(404)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(b"Not found")

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/diary":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length).decode("utf-8")
            data = json.loads(post_data)
            date = data.get("date", "")
            content = data.get("content", "")

            if not date:
                resp = json.dumps({"ok": False, "error": "No date"}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
                return

            filepath = os.path.join(DIARIES_DIR, f"{date}.md")
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)

            resp = json.dumps({"ok": True}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            self.wfile.write(resp)
            return

        elif path == "/api/upload":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length).decode("utf-8")
            try:
                data = json.loads(post_data)
                b64_data = data.get("image", "")
            except:
                b64_data = ""

            if not b64_data:
                resp = json.dumps({"ok": False, "error": "No image data"}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
                return

            if "," in b64_data:
                header, encoded = b64_data.split(",", 1)
            else:
                header = ""
                encoded = b64_data

            ext = "png"
            if "jpeg" in header or "jpg" in header: ext = "jpg"
            elif "gif" in header: ext = "gif"
            elif "webp" in header: ext = "webp"

            filename = f"{int(time.time())}_{uuid.uuid4().hex[:8]}.{ext}"
            filepath = os.path.join(IMAGES_DIR, filename)

            try:
                with open(filepath, "wb") as f:
                    f.write(base64.b64decode(encoded))
                resp = json.dumps({"ok": True, "url": f"/images/{filename}"}).encode("utf-8")
                self.send_response(200)
            except Exception as e:
                resp = json.dumps({"ok": False, "error": str(e)}).encode("utf-8")
                self.send_response(500)
            
            self.send_header("Content-type", "application/json")
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            self.wfile.write(resp)
            return

        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not found")

    def log_message(self, format, *args):
        pass


class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


print(f"Starting server on port {PORT}...")
print(f"BASE_DIR: {BASE_DIR}")
print(f"DIARIES_DIR: {DIARIES_DIR}")
with ThreadedTCPServer(("", PORT), MyHandler) as httpd:
    print(f"Serving at http://0.0.0.0:{PORT}")
    httpd.serve_forever()
