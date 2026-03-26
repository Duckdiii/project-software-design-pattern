import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
    AppstoreOutlined,
    PieChartOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Badge, Layout, Menu, Typography } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const items = [
    {
        type: 'group',
        label: 'TONG QUAN',
        children: [{ key: 'dashboard', icon: <PieChartOutlined />, label: 'Dashboard' }],
    },
    {
        type: 'group',
        label: 'BAN HANG',
        children: [
            { key: 'orders', icon: <ShoppingCartOutlined />, label: 'Don hang' },
            { key: 'customers', icon: <UserOutlined />, label: 'Khach hang' },
        ],
    },
    {
        type: 'group',
        label: 'KHO HANG',
        children: [
            { key: 'products', icon: <AppstoreOutlined />, label: 'San pham' },
            {
                key: 'inventory',
                icon: <AppstoreOutlined />,
                label: (
                    <span>
                        Ton kho <Badge count={3} size="small" />
                    </span>
                ),
            },
        ],
    },
    {
        type: 'group',
        label: 'HE THONG',
        children: [
            { key: 'settings', icon: <ShoppingCartOutlined />, label: 'Cai dat' },
            { key: 'users', icon: <UserOutlined />, label: 'Nguoi dung' },
            { key: 'backup', icon: <UserOutlined />, label: 'Sao luu va khoi phuc' },
        ],
    },
];

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <Title level={4} style={{ margin: 0, color: '#fff', padding: '16px' }}>
                    TechStore
                </Title>
                <Menu theme="dark" mode="inline" items={items} />
            </Sider>

            <Layout>

                <Content style={{ margin: '16px' }}>
                    <Outlet />
                </Content>

                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
}
