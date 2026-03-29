import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import 3 cái khung vừa tạo
import ClientLayout from './pages/client/ClientLayout';
import AdminLayout from './pages/admin/AdminLayout';
import AuthLayout from './pages/auth/AuthLayout';

// Import pages con của từng khung
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Dashboard from './pages/admin/Dashboard';
import ProductManage from './pages/admin/ProductManage';

import ClientHome from './pages/client/ClientHome';
import Cart from './pages/client/Cart';
import ProductDetail from './pages/client/ProductDetail';
import CheckoutPage from './pages/CheckoutPage';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* NHÓM 1: Đường dẫn dành cho Khách hàng (Sài ClientLayout) */}
        <Route path="/home" element={<ClientLayout />}>
          <Route index element={<ClientHome />} /> {/* Mặc định vào "/" sẽ thấy HomePage */}
          <Route path="products/:id" element={<ProductDetail />} /> {/* Trang chi tiết sản phẩm */}
          <Route path="cart" element={<Cart />} /> {/* Trang giỏ hàng */}
        </Route>

        {/* NHÓM 2: Đường dẫn dành cho Xác thực (Sài AuthLayout) */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* NHÓM 3: Đường dẫn dành cho Admin (Sài AdminLayout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManage />} />
        </Route>

        {/* Checkout Page với QR Code */}
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}