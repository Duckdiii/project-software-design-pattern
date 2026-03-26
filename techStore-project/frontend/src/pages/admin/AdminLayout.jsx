import { Outlet } from 'react-router-dom'; // Outlet là nơi hiển thị các trang con của AdminLayout, ví dụ: trang quản lý sản phẩm, trang quản lý đơn hàng...

export default function AdminLayout() {
    return (
        <div style={{ display: 'flex' }}>
            {/* Cột bên trái là Sidebar */}
            <aside style={{ width: '250px', background: '#001529', color: 'white', minHeight: '100vh' }}>
                <h3>Trang Quản Trị</h3>
                <ul>
                    <li>Quản lý Sản phẩm</li>
                    <li>Quản lý Đơn hàng</li>
                </ul>
            </aside>

            {/* Cột bên phải là nội dung */}
            <main style={{ flex: 1, padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
}