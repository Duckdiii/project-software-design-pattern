# Cấu trúc project
TechStore-Project/
│
├── backend/                 # MÃ NGUỒN NODE.JS (API & DATABASE)
│   ├── src/
│   │   ├── config/          # Cấu hình hệ thống (Database, Socket.io, Cloudinary)
│   │   ├── controllers/     # Tiếp nhận Request từ Client & Trả về Response
│   │   ├── middlewares/     # Chặn và kiểm tra (Xác thực JWT Token, Phân quyền Admin)
│   │   ├── models/          # Khai báo Schema ánh xạ với 8 bảng CSDL chúng ta đã chốt
│   │   ├── routes/          # Định tuyến các API (vd: /api/products, /api/orders)
│   │   │
│   │   ├── patterns/        # "MỎ VÀNG" ĐIỂM SỐ CỦA ĐỒ ÁN
│   │   │   ├── creational/  
│   │   │   │   └── factory/ # Chứa IProductFactory, LaptopFactory, SmarthomeFactory
│   │   │   ├── structural/
│   │   │   │   └── decorator/# Chứa IOrderItem, ServiceDecorator, WarrantyDecorator
│   │   │   └── behavioral/
│   │   │       ├── strategy/# Chứa ITaxStrategy, MoMoPaymentStrategy, FlashSaleStrategy
│   │   │       ├── observer/# Chứa ISubject, IObserver, Inventory, AuditLogObserver
│   │   │       └── state/   # Chứa ICustomerState, SilverState, GoldState, DiamondState
│   │   │
│   │   ├── services/        # Nơi chứa Logic nghiệp vụ (Gọi qua gọi lại các thư mục Patterns)
│   │   └── utils/           # Các hàm hỗ trợ dùng chung (Format ngày tháng, Format tiền tệ)
│   │
│   ├── .env                 # File chứa biến môi trường (Bảo mật: Mật khẩu DB, Secret Key JWT)
│   ├── package.json         # Quản lý thư viện Backend
│   └── server.js            # File gốc khởi chạy Backend Node.js
│
└── frontend/                # MÃ NGUỒN REACT.JS (GIAO DIỆN)
    ├── src/
    │   ├── assets/          # Chứa hình ảnh tĩnh, logo, font chữ
    │   ├── components/      # Các UI dùng chung (Button, Header, ProductCard, Modal)
    │   ├── hooks/           # Các Custom Hook (vd: useWebSocket để lắng nghe Observer)
    │   ├── pages/           # Các màn hình chính ghép từ các component
    │   │   ├── admin/       # Dashboard, Quản lý sản phẩm (Form động của Factory)
    │   │   ├── client/      # Home, ProductDetail, Cart (Xử lý UI bọc Decorator)
    │   │   └── auth/        # Login, Register
    │   ├── services/        # Các file chứa hàm gọi API xuống Backend (dùng Axios)
    │   ├── store/           # Quản lý State toàn cục (Redux hoặc Context API)
    │   └── App.js           # File gốc cấu hình Router (Chuyển trang)
    │
    └── package.json         # Quản lý thư viện Frontend (Tailwind, React Router)