# 🎙️ Nguyễn Minh Quân VoiceCraft Studio - AI Text-to-Speech

> Hệ thống chuyển đổi văn bản thành giọng nói AI chất lượng cao, đa ngôn ngữ, hỗ trợ giọng tự nhiên tiếng Việt (Hoài My, Nam Minh), giao diện Web hiện đại, sẵn sàng triển khai Render / Docker / VPS.

---

## 🌟 Tính năng nổi bật
* **Không cần GPU nặng / Không cần API Key**: Sử dụng Microsoft Edge Neural TTS qua `edge-tts` với độ tự nhiên cao, phản hồi nhanh.
* **Hỗ trợ tiếng Việt tự nhiên**: Hoài My (Nữ truyền cảm), Nam Minh (Nam trầm ấm đĩnh đạc), cùng hơn 300+ giọng quốc tế.
* **Giao diện hiện đại**: Glassmorphism, Dark/Light Mode, Audio Visualizer, bộ lọc giọng, lưu lịch sử, tải file MP3.
* **Full-stack Monolith nhẹ gọn**: Backend FastAPI tích hợp serve toàn bộ giao diện tĩnh (HTML/CSS/JS) trên cùng 1 domain/cổng.

---

## 📁 Cấu trúc dự án
```text
nmq-voice-craft-studio/
├── backend/
│   ├── main.py            # FastAPI server, API endpoints & mount static frontend
│   ├── tts_service.py     # Xử lý tổng hợp âm thanh với edge-tts
│   └── voice_catalog.py   # Danh mục giọng đọc chọn lọc & dynamic fetch
├── frontend/              # Web UI tĩnh (được FastAPI phục vụ tại root "/")
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── render.yaml            # File cấu hình deploy tự động lên Render.com
├── requirements.txt       # Danh sách thư viện Python cần thiết
├── run.bat                # Script chạy tự động trên Windows (Local)
├── .env.example           # File mẫu biến môi trường (PORT, HOST)
├── .gitignore             # Bỏ qua file nhạy cảm, cache, venv
└── README.md
```

---

## 💻 Hướng dẫn chạy Local (Máy cá nhân)

### Cách 1: Chạy tự động (Windows)
Click đúp vào file `run.bat`. Script sẽ tự tạo `.venv`, cài đặt thư viện và mở trình duyệt tại `http://127.0.0.1:8000`.

### Cách 2: Chạy thủ công qua dòng lệnh
```bash
# 1. Tạo và kích hoạt môi trường ảo
python -m venv .venv
# Trên Windows:
.venv\Scripts\activate
# Trên Linux/macOS:
source .venv/bin/activate

# 2. Cài đặt thư viện
pip install -r requirements.txt

# 3. Khởi chạy server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Mở trình duyệt truy cập: `http://localhost:8000`

---

## ☁️ Hướng dẫn Deploy lên Render (Miễn phí có Domain công khai)

Dự án đã được đóng gói theo dạng **Unified Architecture** (Backend FastAPI serve trực tiếp Frontend tĩnh), nên bạn chỉ cần deploy **1 Web Service duy nhất** rất tiết kiệm và đơn giản:

### Các thông số cần nhập trên Render:
* **Environment**: `Python 3`
* **Region**: `Singapore` (để có tốc độ tốt nhất về Việt Nam)
* **Branch**: `main`
* **Build Command**: `pip install -r requirements.txt`
* **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
* **Plan**: `Free` (0$/tháng)

*(Hoặc sử dụng tính năng **Blueprints** trên Render và chọn file [render.yaml](file:///d:/nmq%20voice%20craft%20studio/render.yaml) để hệ thống tự động điền cấu hình)*.

---

## ⚠️ Lưu ý về Tài nguyên & GPU
* **Dự án này KHÔNG yêu cầu GPU**: Do ứng dụng giao tiếp với dịch vụ Neural Cloud TTS của Microsoft (`edge-tts`), toàn bộ quá trình render âm thanh được xử lý trên máy chủ đám mây.
* Gói miễn phí (Free Tier) của Render (512MB RAM, 0.1 CPU) chạy rất mượt mà cho ứng dụng này.
* Render Free Tier có cơ chế ngủ (spin down) sau 15 phút không có truy cập. Lần truy cập đầu tiên sau khi ngủ sẽ mất khoảng 30 - 50 giây để khởi động lại.
