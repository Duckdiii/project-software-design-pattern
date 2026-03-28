import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManage from './pages/admin/ProductManage';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Orders';
import CustomerManagement from './pages/admin/Customer';

import AuthLayout from './pages/auth/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import ClientLayout from './pages/client/ClientLayout';
import ClientHome from './pages/client/ClientHome';
import ProductDetail from './pages/client/ProductDetail';
import ClientCart from './pages/client/ClientCart';
import Customers from './pages/admin/Customer';

const Placeholder = ({ title }) => <h1>{title}</h1>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<ClientLayout />}>
          <Route index element={<ClientHome />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<ClientCart />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManage />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="settings" element={<Placeholder title="Settings Page" />} />
          <Route path="users" element={<Placeholder title="Users Page" />} />
          <Route path="backup" element={<Placeholder title="Backup Page" />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
