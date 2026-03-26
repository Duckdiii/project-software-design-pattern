import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import 3 cái khung vừa tạo
import ClientLayout from './pages/client/ClientLayout';
import AdminLayout from './pages/admin/AdminLayout';
import AuthLayout from './pages/auth/AuthLayout';

// Tạo vài component ảo (Dummy) để test thử xem Router chạy đúng không
const HomePage = () => <h1>Đây là Trang Chủ (Khách mua hàng)</h1>;
const LoginPage = () => <h1>Đây là Form Đăng Nhập</h1>;
const Dashboard = () => <h1>Đây là Bảng điều khiển Admin</h1>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* NHÓM 1: Đường dẫn dành cho Khách hàng (Sài ClientLayout) */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} /> {/* Mặc định vào "/" sẽ thấy HomePage */}
          {/* Mốt bạn chèn thêm <Route path="cart" element={<CartPage />} /> vào đây */}
        </Route>

        {/* NHÓM 2: Đường dẫn dành cho Xác thực (Sài AuthLayout) */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          {/* Mốt chèn thêm <Route path="register" element={<RegisterPage />} /> */}
        </Route>

        {/* NHÓM 3: Đường dẫn dành cho Admin (Sài AdminLayout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          {/* Mốt chèn thêm <Route path="products" element={<ProductManage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}