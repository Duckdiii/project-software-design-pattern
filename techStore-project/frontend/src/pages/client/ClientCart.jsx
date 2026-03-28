import {
    Avatar,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Flex,
    Layout,
    Row,
    Space,
    Tag,
    Typography,
} from 'antd';
import { EnvironmentOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

const MOCK_CUSTOMER_INFO = {
    fullName: 'Nguyen Van A',
    phone: '0901234567',
    email: 'nguyenvana@gmail.com',
    address: '123 Le Loi, Quan 1, Ho Chi Minh City',
    note: 'Giao hang gio hanh chinh',
};

const MOCK_CART_ITEMS = [
    {
        id: 'P001',
        name: 'iPhone 16 Pro 256GB',
        category: 'Phone',
        color: 'Black Titanium',
        price: 31990000,
        quantity: 1,
        image: 'https://dummyimage.com/120x120/e5e7eb/111827&text=iPhone+16+Pro',
    },
    {
        id: 'P002',
        name: 'AirPods Pro 2',
        category: 'Accessory',
        color: 'White',
        price: 5890000,
        quantity: 1,
        image: 'https://dummyimage.com/120x120/e5e7eb/111827&text=AirPods+Pro+2',
    },
    {
        id: 'P003',
        name: 'Magic Mouse',
        category: 'Accessory',
        color: 'Silver',
        price: 1890000,
        quantity: 2,
        image: 'https://dummyimage.com/120x120/e5e7eb/111827&text=Magic+Mouse',
    },
];

const MOCK_SHIPPING_METHODS = [
    { id: 'standard', label: 'Giao tieu chuan (2-4 ngay)', fee: 30000 },
    { id: 'express', label: 'Giao nhanh (trong ngay)', fee: 80000 },
    { id: 'pickup', label: 'Nhan tai cua hang', fee: 0 },
];

const MOCK_PAYMENT_METHODS = [
    { id: 'cod', label: 'Thanh toan khi nhan hang' },
    { id: 'momo', label: 'Vi MoMo' },
    { id: 'bank', label: 'Chuyen khoan ngan hang' },
    { id: 'card', label: 'The tin dung/ghi no' },
];

const MOCK_ORDER_SUMMARY = {
    subtotal: 41560000,
    shippingFee: 30000,
    discount: 1000000,
    tax: 0,
    total: 40590000,
    couponCode: 'FLASHSALE50',
};

export default function ClientCart() {
    const { Title, Text } = Typography;
    const selectedShipping = MOCK_SHIPPING_METHODS[0];
    const selectedPayment = MOCK_PAYMENT_METHODS[0];


    return (
        <Layout style={{ minHeight: '100vh', padding: 24 }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Card title="Thong tin ca nhan" extra={<Button type="link">Chinh sua</Button>}>
                        <Flex align="center" justify="space-between" wrap="wrap" gap="middle">
                            <Flex align="center" gap="middle">
                                <Avatar size={56} icon={<UserOutlined />} />
                                <Space direction="vertical" size={0}>
                                    <Title level={5} style={{ margin: 0 }}>
                                        {MOCK_CUSTOMER_INFO.fullName}
                                    </Title>
                                    <Text type="secondary">
                                        Khach hang thanh vien <Tag color="blue">Silver</Tag>
                                    </Text>
                                </Space>
                            </Flex>
                            <Tag color="green">Da xac minh</Tag>
                        </Flex>

                        <Divider style={{ margin: '16px 0' }} />

                        <Descriptions
                            size="small"
                            column={{ xs: 1, sm: 1, md: 2 }}
                            items={[
                                {
                                    key: 'phone',
                                    label: (
                                        <Space size={6}>
                                            <PhoneOutlined />
                                            So dien thoai
                                        </Space>
                                    ),
                                    children: MOCK_CUSTOMER_INFO.phone,
                                },
                                {
                                    key: 'email',
                                    label: (
                                        <Space size={6}>
                                            <MailOutlined />
                                            Email
                                        </Space>
                                    ),
                                    children: MOCK_CUSTOMER_INFO.email,
                                },
                                {
                                    key: 'address',
                                    label: (
                                        <Space size={6}>
                                            <EnvironmentOutlined />
                                            Dia chi nhan hang
                                        </Space>
                                    ),
                                    children: MOCK_CUSTOMER_INFO.address,
                                    span: 2,
                                },
                                {
                                    key: 'shipping',
                                    label: 'Hinh thuc giao hang',
                                    children: `${selectedShipping.label} - ${selectedShipping.fee.toLocaleString('vi-VN')} VND`,
                                },
                                {
                                    key: 'payment',
                                    label: 'Thanh toan',
                                    children: selectedPayment.label,
                                },
                                {
                                    key: 'note',
                                    label: 'Ghi chu',
                                    children: MOCK_CUSTOMER_INFO.note,
                                    span: 2,
                                },
                            ]}
                        />
                    </Card>
                    
                    <Card title="Chi tiet don hang" extra={<a href="#">More</a>}>
                        <Flex align="center" justify="space-between" wrap="wrap" gap="middle">
                            {MOCK_CART_ITEMS.map((item) => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center',width: '100%'}}>
                                    <Flex align="center" gap="middle">
                                        <Avatar size={56} icon={<UserOutlined />} />
                                        <Space direction="vertical" size={0}>
                                            <Title level={5} style={{ margin: 0 }}>
                                                {item.name}
                                            </Title>
                                            <Text type="secondary">
                                                {item.description}
                                            </Text>
                                            <Text type="secondary">
                                                {item.price.toLocaleString('vi-VN')} VND x {item.quantity}
                                            </Text>
                                            <Text>
                                                Tong: {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                                            </Text>
                                        </Space>
                                    </Flex>
                                    <Tag color="green">Da xac minh</Tag>
                                </div>
                            ))}

                        </Flex>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Hoa don" extra={<Tag color="blue">{MOCK_ORDER_SUMMARY.couponCode}</Tag>}>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Flex justify="space-between">
                                <Text type="secondary">So san pham</Text>
                                <Text>{MOCK_CART_ITEMS.length}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text type="secondary">Tam tinh</Text>
                                <Text>{MOCK_ORDER_SUMMARY.subtotal.toLocaleString('vi-VN')} VND</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text type="secondary">Phi van chuyen</Text>
                                <Text>{MOCK_ORDER_SUMMARY.shippingFee.toLocaleString('vi-VN')} VND</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text type="secondary">Giam gia</Text>
                                <Text style={{ color: '#52c41a' }}>
                                    -{MOCK_ORDER_SUMMARY.discount.toLocaleString('vi-VN')} VND
                                </Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text type="secondary">Phuong thuc thanh toan</Text>
                                <Text>{selectedPayment.label}</Text>
                            </Flex>
                            <Divider style={{ margin: '10px 0' }} />
                            <Flex justify="space-between" align="center">
                                <Title level={5} style={{ margin: 0 }}>
                                    Tong thanh toan
                                </Title>
                                <Title level={4} style={{ margin: 0, color: '#1677ff' }}>
                                    {MOCK_ORDER_SUMMARY.total.toLocaleString('vi-VN')} VND
                                </Title>
                            </Flex>
                            <Button type="primary" size="large" block>
                                Dat hang
                            </Button>
                            <Button block>Quay lai gio hang</Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
}
