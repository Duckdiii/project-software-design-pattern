import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#ececec' }}>
            {/* Khung form đăng nhập nằm giữa màn hình */}
            <div style={{ padding: '40px', background: 'white', borderRadius: '8px' }}>
                <Outlet />
            </div>
        </div>
    );
}