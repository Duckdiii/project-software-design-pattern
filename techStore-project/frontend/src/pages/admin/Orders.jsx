import { useMemo, useState } from 'react';
import { Card, Flex, Input, Select, Space, Table, Tag, Typography, Row, Col } from 'antd';
import { Column, Pie } from '@ant-design/plots';


const { Title, Text } = Typography;

const orders = [
    {
        key: '1',
        id: 'OD-001',
        customerName: 'Nguyen Van A',
        phone: '0901234567',
        address: 'Ho Chi Minh City',
        email: 'a@gmail.com',
        total: '2,450,000 VND',
        status: 'Pending',
    },
    {
        key: '2',
        id: 'OD-002',
        customerName: 'Tran Thi B',
        phone: '0912345678',
        address: 'Ha Noi',
        email: 'b@gmail.com',
        total: '5,190,000 VND',
        status: 'Shipping',
    },
    {
        key: '3',
        id: 'OD-003',
        customerName: 'Le Van C',
        phone: '0987654321',
        address: 'Da Nang',
        email: 'c@gmail.com',
        total: '1,890,000 VND',
        status: 'Completed',
    },
];

const statusOptions = [
    { value: 'all', label: 'All status' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Shipping', label: 'Shipping' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
];

const getStatusColor = (status) => {
    if (status === 'Pending') return 'gold';
    if (status === 'Shipping') return 'blue';
    if (status === 'Completed') return 'green';
    if (status === 'Cancelled') return 'red';
    return 'default';
};

const columns = [
    {
        title: 'Order ID',
        dataIndex: 'id',
        key: 'id',
        render: (value) => <Tag color="geekblue">{value}</Tag>,
    },
    {
        title: 'Customer',
        dataIndex: 'customerName',
        key: 'customerName',
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (value) => <Tag color={getStatusColor(value)}>{value}</Tag>,
    },
];
const monthlyOrders = [
    { month: 'Jan', orders: 32 },
    { month: 'Feb', orders: 45 },
    { month: 'Mar', orders: 51 },
    { month: 'Apr', orders: 38 },
    { month: 'May', orders: 60 },
    { month: 'Jun', orders: 55 },
    { month: 'Jul', orders: 70 },
    { month: 'Aug', orders: 64 },
    { month: 'Sep', orders: 58 },
    { month: 'Oct', orders: 73 },
    { month: 'Nov', orders: 69 },
    { month: 'Dec', orders: 80 },
];

export default function Orders() {
    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState('all');

    const filteredOrders = useMemo(() => {
        const q = keyword.trim().toLowerCase();

        return orders.filter((item) => {
            const matchKeyword =
                item.id.toLowerCase().includes(q) ||
                item.customerName.toLowerCase().includes(q) ||
                item.phone.toLowerCase().includes(q) ||
                item.email.toLowerCase().includes(q);

            const matchStatus = status === 'all' || item.status === status;
            return matchKeyword && matchStatus;
        });
    }, [keyword, status]);

    //chart
    const config_bar = {
        data: monthlyOrders,
        xField: 'month',
        yField: 'orders',
        axis: {
            x: { title: 'Month' },
            y: { title: 'Number of Orders' },
        },
        label: {
            text: 'orders',
            position: 'top',
        },
        style: {
            radiusTopLeft: 8,
            radiusTopRight: 8,
        },
    };
    const config_pie = {
        data: [
            { type: 'Pending', value: 27 },
            { type: 'Shipping', value: 25 },
            { type: 'Completed', value: 18 },
            { type: 'Cancelled', value: 15 },
        ],
        angleField: 'value',
        colorField: 'type',
        label: {
            text: 'value',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
    };




    return (
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
            <Flex justify="space-between" align="center" wrap="wrap" gap="small">
                <Title level={4} style={{ margin: 0 }}>
                    Orders
                </Title>
                <Text type="secondary">Total orders: {filteredOrders.length}</Text>
            </Flex>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Doanh thu theo tháng">
                        <Column {...config_bar} />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Tỷ lệ đơn hàng theo trạng thái">
                        <Pie {...config_pie} />
                    </Card>
                </Col>

            </Row>

            <Card title="Order Filters">
                <Flex wrap="wrap" gap="small">
                    <Input
                        placeholder="Search by order ID, customer, phone, email"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={{ width: 360 }}
                    />
                    <Select
                        value={status}
                        onChange={setStatus}
                        options={statusOptions}
                        style={{ width: 220 }}
                    />
                </Flex>
            </Card>

            <Card>
                <Table columns={columns} dataSource={filteredOrders} pagination={{ pageSize: 8 }} />
            </Card>
        </Space>

    );
};
