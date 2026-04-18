# VinFast AI Assistant

Một trợ lý AI điều khiển xe ô tô giả lập, được xây dựng với frontend React/Vite và backend FastAPI. Dự án mô phỏng tính năng trợ lý người lái có thể điều khiển điều hoà, đèn, cửa, kiểm tra áp suất lốp và tìm kiếm thông tin online.

## Tổng quan

- `backend/`: API FastAPI và agent AI dựa trên `langgraph`, `langchain`, `ChatOpenAI`.
- `frontend/`: Giao diện React/Vite cho phép người dùng chat với trợ lý và hiển thị trạng thái xe.
- `workflow.md`: Sơ đồ kiến trúc luồng hoạt động của hệ thống.

## Tính năng chính

- Điều khiển điều hoà: bật/tắt, đặt nhiệt độ.
- Kiểm tra trạng thái lốp xe.
- Bật/tắt đèn xe.
- Khoá/mở khoá cửa xe.
- Tìm kiếm thông tin trên Internet (`web_search`) để trả lời các câu hỏi thời tiết, tin tức hoặc kiến thức thực tế.
- Lưu ngữ cảnh chat bằng `MemorySaver` và agent react để phản hồi đa nhiệm.
- Cá nhân hoá trợ lý dựa trên `user_preferences.md`.

## Công nghệ

- Backend: Python, FastAPI, Uvicorn, langchain, langgraph, pydantic, duckduckgo-search.
- Frontend: React, Vite, Zustand, Axios, Tailwind CSS.

## Cài đặt

### 1. Backend

1. Tạo môi trường ảo Python:

```bash
cd d:\incar_ai_assistant\backend
python -m venv venv
```

2. Kích hoạt môi trường ảo:

```bash
venv\Scripts\activate
```

3. Cài đặt dependency:

```bash
pip install -r requirements.txt
```

4. Tạo file `.env` trong `backend/` và đặt:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Frontend

1. Chuyển vào thư mục frontend:

```bash
cd d:\incar_ai_assistant\frontend
```

2. Cài đặt package:

```bash
npm install
```

## Chạy ứng dụng

### 1. Chạy backend

```bash
cd d:\incar_ai_assistant\backend
venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API backend sẽ chạy tại:

- `http://localhost:8000`
- `http://localhost:8000/api/chat`
- `http://localhost:8000/api/car/state`

### 2. Chạy frontend

```bash
cd d:\incar_ai_assistant\frontend
npm run dev
```

Sau khi chạy, mở trình duyệt theo địa chỉ hiển thị trong terminal (mặc định `http://localhost:5173`).

## Endpoint API

- `POST /api/chat` - gửi tin nhắn tới AI và nhận phản hồi.
- `GET /api/car/state` - lấy trạng thái hiện tại của xe.
- `POST /api/car/ac/on` - bật điều hoà.
- `POST /api/car/ac/off` - tắt điều hoà.
- `POST /api/car/ac/set-temperature` - đặt nhiệt độ điều hoà.
- `GET /api/car/tires` - lấy thông tin áp suất lốp.
- `POST /api/car/tires/mock-update` - cập nhật dữ liệu áp suất lốp mẫu.
- `POST /api/car/lights/on` - bật đèn.
- `POST /api/car/lights/off` - tắt đèn.
- `POST /api/car/doors/lock` - khoá cửa.
- `POST /api/car/doors/unlock` - mở khoá cửa.

## Cấu trúc dự án

- `backend/main.py`: API FastAPI.
- `backend/agent.py`: định nghĩa tool và agent AI.
- `backend/car_state.py`: mô phỏng trạng thái xe.
- `backend/models.py`: mô hình dữ liệu Pydantic.
- `backend/user_preferences.md`: dữ liệu cá nhân hoá trợ lý.
- `frontend/src/`: mã React cho giao diện người dùng.

## Gợi ý sử dụng

- Hỏi trợ lý bằng tiếng Việt.
- Để trợ lý kiểm soát xe, dùng các câu lệnh như: `Bật điều hoà`, `Tắt đèn`, `Khoá cửa`, `Kiểm tra áp suất lốp`.
- Để hỏi thông tin thực tế, thử hỏi: `Thời tiết hôm nay`, `Tin tức`, hoặc `Thông tin về ...`.

## Ghi chú

- Dự án hiện là bản mô phỏng; các lệnh điều khiển xe chỉ cập nhật trạng thái nội bộ chứ không điều khiển phần cứng thực.
- Nếu dùng OpenAI mới, hãy đảm bảo biến môi trường `OPENAI_API_KEY` hợp lệ.
- Nếu cần mở rộng, có thể thêm tool mới và endpoint tương ứng để tích hợp thêm chức năng xe.
