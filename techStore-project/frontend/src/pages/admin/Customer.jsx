import { useMemo, useState } from 'react';
import { Card, Col, Flex, Input, Row, Select, Space, Table, Tag, Typography } from 'antd';
import { Column, Pie } from '@ant-design/plots';

const { Title, Text } = Typography;

const customers = [
    {
        key: 'C001',
        customerId: 'C001',
        customerName: 'Nguyen Van A',
        phone: '0901234567',
        email: 'nguyenvana@gmail.com',
        address: 'Quan 1, Ho Chi Minh City',
        ageGroup: '25-34',
        region: 'South',
        status: 'Active',
        totalSpent: '12,500,000 VND',
    },
    {
        key: 'C002',
        customerId: 'C002',
        customerName: 'Tran Thi B',
        phone: '0912345678',
        email: 'tranthib@gmail.com',
        address: 'Cau Giay, Ha Noi',
        ageGroup: '18-24',
        region: 'North',
        status: 'Active',
        totalSpent: '8,200,000 VND',
    },
    {
        key: 'C003',
        customerId: 'C003',
        customerName: 'Le Van C',
        phone: '0987654321',
        email: 'levanc@gmail.com',
        address: 'Hai Chau, Da Nang',
        ageGroup: '35-44',
        region: 'Central',
        status: 'Inactive',
        totalSpent: '3,100,000 VND',
    },
    {
        key: 'C004',
        customerId: 'C004',
        customerName: 'Pham Thi D',
        phone: '0934567890',
        email: 'phamthid@gmail.com',
        address: 'Thu Duc, Ho Chi Minh City',
        ageGroup: '25-34',
        region: 'South',
        status: 'Active',
        totalSpent: '17,300,000 VND',
    },
    {
        key: 'C005',
        customerId: 'C005',
        customerName: 'Hoang Van E',
        phone: '0971234567',
        email: 'hoangvane@gmail.com',
        address: 'Nam Tu Liem, Ha Noi',
        ageGroup: '45-54',
        region: 'North',
        status: 'Blocked',
        totalSpent: '1,200,000 VND',
    },
    {
        key: 'C006',
        customerId: 'C006',
        customerName: 'Vo Thi F',
        phone: '0945678901',
        email: 'vothif@gmail.com',
        address: 'Thanh Khe, Da Nang',
        ageGroup: '35-44',
        region: 'Central',
        status: 'Active',
        totalSpent: '6,900,000 VND',
    },
];

const statusOptions = [
    { value: 'all', label: 'All status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Blocked', label: 'Blocked' },
];

const getStatusColor = (status) => {
    if (status === 'Active') return 'green';
    if (status === 'Inactive') return 'gold';
    if (status === 'Blocked') return 'red';
    return 'default';
};

const columns = [
    {
        title: 'Customer ID',
        dataIndex: 'customerId',
        key: 'customerId',
        render: (value) => <Tag color="blue">{value}</Tag>,
    },
    {
        title: 'Name',
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
        title: 'Total Spent',
        dataIndex: 'totalSpent',
        key: 'totalSpent',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (value) => <Tag color={getStatusColor(value)}>{value}</Tag>,
    },
];

const ageGroupChartData = [
    { ageGroup: '18-24', total: 18 },
    { ageGroup: '25-34', total: 42 },
    { ageGroup: '35-44', total: 27 },
    { ageGroup: '45-54', total: 12 },
    { ageGroup: '55+', total: 5 },
];

const regionChartData = [
    { type: 'North', value: 38 },
    { type: 'Central', value: 22 },
    { type: 'South', value: 40 },
];

export default function CustomerManagement() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('all');

    const filteredCustomer = useMemo(() => {
        return customers.filter((item) => {
            const matchName = item.customerName.toLowerCase().includes(name.trim().toLowerCase());
            const matchPhone = item.phone.toLowerCase().includes(phone.trim().toLowerCase());
            const matchEmail = item.email.toLowerCase().includes(email.trim().toLowerCase());
            const matchAddress = item.address.toLowerCase().includes(address.trim().toLowerCase());
            const matchStatus = status === 'all' || item.status === status;

            return matchName && matchPhone && matchEmail && matchAddress && matchStatus;
        });
    }, [name, phone, email, address, status]);

    const configBar = {
        data: ageGroupChartData,
        xField: 'ageGroup',
        yField: 'total',
        axis: {
            x: { title: 'Age Group' },
            y: { title: 'Number of Customers' },
        },
        label: {
            text: 'total',
            position: 'top',
        },
        style: {
            radiusTopLeft: 8,
            radiusTopRight: 8,
        },
    };

    const configPie = {
        data: regionChartData,
        angleField: 'value',
        colorField: 'type',
        label: {
            text: 'value',
            style: { fontWeight: 'bold' },
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
                    Customer
                </Title>
                <Text type="secondary">Total customers: {filteredCustomer.length}</Text>
            </Flex>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Khach hang theo do tuoi">
                        <Column {...configBar} />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Khu vuc khach hang">
                        <Pie {...configPie} />
                    </Card>
                </Col>
            </Row>

            <Card title="Customer Filters">
                <Flex wrap="wrap" gap="small">
                    <Input
                        placeholder="Search by customer name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Input
                        placeholder="Search by phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ width: 220 }}
                    />
                    <Input
                        placeholder="Search by email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: 240 }}
                    />
                    <Input
                        placeholder="Search by address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ width: 240 }}
                    />
                    <Select
                        value={status}
                        onChange={setStatus}
                        options={statusOptions}
                        style={{ width: 180 }}
                    />
                </Flex>
            </Card>

            <Card>
                <Table columns={columns} dataSource={filteredCustomer} pagination={{ pageSize: 8 }} />
            </Card>
        </Space>
    );
}
