import { Outlet, useNavigate } from 'react-router-dom';
import { Input, Layout, Menu } from 'antd';

const { Search } = Input;
const { Header, Footer } = Layout;

const items = [
    { key: '/home', label: 'Trang chinh' },
    { key: '/home/products/1', label: 'Danh muc san pham' },
    { key: '/home/cart', label: 'Gio hang' },
];

const onSearch = (value, _e, info) => {
    console.log(info?.source, value);
};

export default function ClientLayout() {
    const navigate = useNavigate();

    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                }}
            >
                <div className="demo-logo" />

                <Menu
                    theme="dark"
                    mode="horizontal"
                    items={items}
                    onClick={({ key }) => navigate(key)}
                    style={{ flex: 1, minWidth: 0 }}
                />

                <Search
                    placeholder="Tim kiem laptop, dien thoai, phu kien..."
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}
                    style={{ maxWidth: 420 }}
                />
            </Header>

            <Outlet />

            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
}
