import { Outlet } from "react-router-dom";

export default function ClientLayout() {
    return (
        <div>
            <header style={{ background: '#d82626', padding: '20px' }}>
                <h2>TechStore - Header Khách hàng</h2>
            </header>

            {/* <Outlet /> chính là nơi hiển thị trang chủ, trang chi tiết, giỏ hàng... */}
            <main style={{ minHeight: '80vh', padding: '20px' }}>
                <Outlet />
            </main>

            <footer style={{ background: '#333', color: '#fff', padding: '20px' }}>
                <p>TechStore Footer</p>
            </footer>
        </div>
    );
}