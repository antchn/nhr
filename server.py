import json
import os
import http.server
import socketserver
from urllib.parse import urlparse

PORT = 8000
DB_FILE = 'database.json'

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/data':
            # Phục vụ file database.json
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store, must-revalidate')
            self.end_headers()
            
            try:
                with open(DB_FILE, 'r', encoding='utf-8') as f:
                    data = f.read()
                self.wfile.write(data.encode('utf-8'))
            except Exception as e:
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            # Chạy file tĩnh bình thường
            # Mặc định index.html nếu request /
            if self.path == '/':
                self.path = '/index.html'
            return super().do_GET()

    def do_POST(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/data':
            # Nhận dữ liệu để cập nhật database.json
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                # Kiểm tra xem dữ liệu gửi lên có phải JSON hợp lệ không
                parsed_json = json.loads(post_data.decode('utf-8'))
                
                # Ghi đè file database.json
                with open(DB_FILE, 'w', encoding='utf-8') as f:
                    json.dump(parsed_json, f, ensure_ascii=False, indent=2)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Dữ liệu đã được lưu thành công!"}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Dữ liệu gửi lên không đúng định dạng JSON.", "error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Trang web đang chạy tại http://localhost:{PORT}")
    print("Vui lòng truy cập đường link trên bằng trình duyệt của bạn (giữ nguyên cửa sổ đen này).")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    print("Đang đóng server...")
