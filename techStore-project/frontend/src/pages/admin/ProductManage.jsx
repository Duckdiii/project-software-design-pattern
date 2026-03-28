import { useMemo, useState } from 'react';
import {
    Button,
    Card,
    Cascader,
    Flex,
    Form,
    Input,
    Modal,
    Select,
    Space,
    Table,
    Tag,
    Typography,
} from 'antd';

const { Title, Text } = Typography;

const initialData = [
    {
        key: '1',
        name: 'MacBook Air M3',
        category: 'Laptop',
        price: '28,990,000 VND',
        stock: 12,
        status: 'active',
    },
    {
        key: '2',
        name: 'iPhone 16 Pro',
        category: 'Phone',
        price: '31,990,000 VND',
        stock: 4,
        status: 'active',
    },
    {
        key: '3',
        name: 'Magic Mouse',
        category: 'Accessory',
        price: '1,890,000 VND',
        stock: 0,
        status: 'inactive',
    },
];

const categoryOptions = [
    { value: 'all', label: 'All categories' },
    { value: 'Laptop', label: 'Laptop' },
    { value: 'Phone', label: 'Phone' },
    { value: 'Accessory', label: 'Accessory' },
];

const statusOptions = [
    { value: 'all', label: 'All status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

const stockOptions = [
    { value: 'all', label: 'All stock' },
    { value: 'out', label: 'Out of stock' },
    { value: 'low', label: 'Low stock' },
    { value: 'ok', label: 'In stock' },
];

const nameSortOptions = [
    { value: 'none', label: 'Name: none' },
    { value: 'asc', label: 'Name: A-Z' },
    { value: 'desc', label: 'Name: Z-A' },
];

const stockSortOptions = [
    { value: 'none', label: 'Stock: none' },
    { value: 'asc', label: 'Stock: low-high' },
    { value: 'desc', label: 'Stock: high-low' },
];

export default function ProductManage() {
    const [products, setProducts] = useState(initialData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState(['all']);
    const [status, setStatus] = useState(['all']);
    const [stock, setStock] = useState(['all']);
    const [nameSort, setNameSort] = useState(['none']);
    const [stockSort, setStockSort] = useState(['none']);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();

    const hasSelected = selectedRowKeys.length > 0;

    const openEditModal = (record) => {
        setEditingProduct(record);
        form.setFieldsValue(record); //record là dữ liệu của nguyên dòng bạn vừa bấm Edit trong Table
        setIsEditOpen(true);
    };

    const handleSaveEdit = async () => {
        const values = await form.validateFields();
        setProducts((prev) =>
            prev.map((p) => (p.key === editingProduct.key ? { ...p, ...values } : p))
        );
        setIsEditOpen(false);
        setEditingProduct(null);
        form.resetFields();
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const clearSelection = () => {
        setLoading(true);
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 500);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const columns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (value) => {
                const color = value <= 5 ? 'red' : value <= 20 ? 'gold' : 'green';
                return <Tag color={color}>{value}</Tag>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (cellStatus) => {
                const color = cellStatus === 'active' ? 'green' : 'default';
                return <Tag color={color}>{cellStatus.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => <a onClick={() => openEditModal(record)}>Edit</a>,
        },
    ];

    const filteredData = useMemo(() => {
        const selectedCategory = category[0] || 'all';
        const selectedStatus = status[0] || 'all';
        const selectedStock = stock[0] || 'all';
        const selectedNameSort = nameSort[0] || 'none';
        const selectedStockSort = stockSort[0] || 'none';

        const result = products.filter((item) => {
            const matchKeyword = item.name.toLowerCase().includes(keyword.trim().toLowerCase());
            const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;

            let matchStock = true;
            if (selectedStock === 'out') matchStock = item.stock === 0;
            if (selectedStock === 'low') matchStock = item.stock > 0 && item.stock <= 5;
            if (selectedStock === 'ok') matchStock = item.stock > 5;

            return matchKeyword && matchCategory && matchStatus && matchStock;
        });

        if (selectedNameSort === 'asc') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (selectedNameSort === 'desc') {
            result.sort((a, b) => b.name.localeCompare(a.name));
        }

        if (selectedStockSort === 'asc') {
            result.sort((a, b) => a.stock - b.stock);
        } else if (selectedStockSort === 'desc') {
            result.sort((a, b) => b.stock - a.stock);
        }

        return result;
    }, [products, keyword, category, status, stock, nameSort, stockSort]);

    return (
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
            <Flex justify="space-between" align="center" wrap="wrap" gap="small">
                <Title level={4} style={{ margin: 0 }}>
                    Product Management
                </Title>

                <Space>
                    <Button>Import</Button>
                    <Button>Export</Button>
                    <Button type="primary">Edit Product</Button>
                </Space>
            </Flex>

            <Card title="Thanh cong cu loc">
                <Flex wrap="wrap" gap="small">
                    <Input
                        placeholder="Search product"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <Cascader
                        options={categoryOptions}
                        value={category}
                        onChange={setCategory}
                        placeholder="Category"
                    />
                    <Cascader
                        options={statusOptions}
                        value={status}
                        onChange={setStatus}
                        placeholder="Status"
                    />
                    <Cascader options={stockOptions} value={stock} onChange={setStock} placeholder="Stock" />
                    <Cascader
                        options={nameSortOptions}
                        value={nameSort}
                        onChange={setNameSort}
                        placeholder="Sort name"
                    />
                    <Cascader
                        options={stockSortOptions}
                        value={stockSort}
                        onChange={setStockSort}
                        placeholder="Sort stock"
                    />
                </Flex>
            </Card>

            <Card>
                <Flex align="center" gap="middle" style={{ marginBottom: 12 }}>
                    <Button onClick={clearSelection} disabled={!hasSelected} loading={loading}>
                        Clear selected
                    </Button>
                    <Text type="secondary">
                        {hasSelected ? `Selected ${selectedRowKeys.length} item(s)` : 'No item selected'}
                    </Text>
                </Flex>

                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{ pageSize: 5 }}
                />
            </Card>

            <Modal
                title="Edit Product"
                open={isEditOpen}
                onCancel={() => setIsEditOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Product Name"
                        rules={[{ required: true, message: 'Please input product name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select category!' }]}
                    >
                        <Select
                            options={[
                                { value: 'Laptop', label: 'Laptop' },
                                { value: 'Phone', label: 'Phone' },
                                { value: 'Accessory', label: 'Accessory' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, message: 'Please input price!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="stock"
                        label="Stock"
                        rules={[{ required: true, message: 'Please input stock!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select status!' }]}
                    >
                        <Select
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={handleSaveEdit} style={{ marginRight: 8 }}>
                            Save
                        </Button>
                        <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
}
