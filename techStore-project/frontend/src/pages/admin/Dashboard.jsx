import { Card, Col, Flex, Progress, Row, Space, Table, Tag, Typography, Layout } from 'antd';

const { Text } = Typography;
const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;

const stats = [
    { key: 'revenue', title: 'Revenue', value: '120,000,000 VND' },
    { key: 'orders', title: 'Orders', value: '245' },
    { key: 'products', title: 'Products', value: '1,280' },
    { key: 'customers', title: 'Customers', value: '530' },
];

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: (_, { tags }) => (
            <Flex gap="small" align="center" wrap>
                {tags.map((tag) => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'kawaii') color = 'volcano';

                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </Flex>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['kawaii'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];

const stockItems = [
    { id: 1, name: 'Magic Mouse', qty: 0, max: 30 },
    { id: 2, name: 'MacBook Air M3', qty: 3, max: 30 },
    { id: 3, name: 'AirPods Pro 2', qty: 4, max: 30 },
    { id: 4, name: 'iPhone 16 PM', qty: 12, max: 30 },
    { id: 5, name: 'Samsung S25U', qty: 25, max: 30 },
];

const getColor = (qty) => (qty <= 5 ? '#ff4d4f' : qty <= 12 ? '#faad14' : '#52c41a');
const getPercent = (qty, max) => Math.round((qty / max) * 100);

export default function Dashboard() {
    return (
        
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
            <Header style={{ background: '#fff', padding: '0 16px' }}>
                    <Title level={4} style={{ margin: 0, lineHeight: '64px' }}>
                        Tổng quan hệ thống
                    </Title>
                </Header>
            <Row gutter={[16, 16]}>
                {stats.map((stat) => (
                    <Col key={stat.key} xs={24} sm={12} lg={6}>
                        <Card size="small" title={stat.title}>
                            <Text strong>{stat.value}</Text>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Đơn hàng gần đây">
                        <Table columns={columns} dataSource={data} />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Canh bao ton kho">
                        <Space direction="vertical" size={12} style={{ width: '100%' }}>
                            {stockItems.map((item) => (
                                <div key={item.id}>
                                    <Flex justify="space-between" align="center">
                                        <Text>{item.name}</Text>
                                        <Text strong style={{ color: getColor(item.qty) }}>
                                            {item.qty}
                                        </Text>
                                    </Flex>

                                    <Progress
                                        percent={getPercent(item.qty, item.max)}
                                        showInfo={false}
                                        strokeColor={getColor(item.qty)}
                                    />
                                </div>
                            ))}
                        </Space>
                    </Card>
                </Col>
            </Row>
        </Space>
    );
}
