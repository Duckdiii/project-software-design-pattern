import { useMemo, useState } from 'react';
import { Button, Card, Cascader, Flex, Input, Space, Table, Tag, Typography, Modal, Form, Select} from 'antd';

const { Title, Text } = Typography;

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
        render: (status) => {
            const color = status === 'active' ? 'green' : 'default';
            return <Tag color={color}>{status.toUpperCase()}</Tag>;
        },
    },
    {
        title: 'SKU Code',
        dataIndex: 'sku',
        key: 'sku',
    },
];

const data = [
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

export default function Inventory() {

    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // dùng để lưu id của những dòng đã được chọn (checkbox) trong table
    const [loading, setLoading] = useState(false);

    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState(['all']);
    const [status, setStatus] = useState(['all']);
    const [stock, setStock] = useState(['all']);
    const [nameSort, setNameSort] = useState(['none']);
    const [stockSort, setStockSort] = useState(['none']);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [form] = Form.useForm(); // form nhập liệu của ant D



    const hasSelected = selectedRowKeys.length > 0;

    const onSelectChange = (newSelectedRowKeys) => { // Khi checkbox của table bị thay đổi (được check hoặc uncheck) thì sẽ gọi hàm này với newSelectedRowKeys là mảng id mới đã được chọn
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const clearSelection = () => { // Xóa selection đã chọn
        setLoading(true);
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 500);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange, //hàm được gọi mỗi khi user tick/bỏ tick checkbox ở bảng, để cập nhật lại
    };

    const filteredData = useMemo(() => {
        const selectedCategory = category[0] || 'all';
        const selectedStatus = status[0] || 'all';
        const selectedStock = stock[0] || 'all';
        const selectedNameSort = nameSort[0] || 'none';
        const selectedStockSort = stockSort[0] || 'none';

        const result = data.filter((item) => {
            const matchKeyword = item.name.toLowerCase().includes(keyword.trim().toLowerCase());

            const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;

            let matchStock = true;
            if (selectedStock === 'out') matchStock = item.stock === 0;
            if (selectedStock === 'low') matchStock = item.stock > 0 && item.stock <= 5;
            if (selectedStock === 'ok') matchStock = item.stock > 5;

            return matchKeyword && matchCategory && matchStatus && matchStock;
        });
        // Sắp xếp theo name
        if (selectedNameSort === 'asc') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (selectedNameSort === 'desc') {
            result.sort((a, b) => b.name.localeCompare(a.name));
        }
        // Sắp xếp theo stock
        if (selectedStockSort === 'asc') {
            result.sort((a, b) => a.stock - b.stock);
        } else if (selectedStockSort === 'desc') {
            result.sort((a, b) => b.stock - a.stock);
        }

        return result;
    }, [keyword, category, status, stock, nameSort, stockSort]);

    return (
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
            <Flex justify="space-between" align="center" wrap="wrap" gap="small">
                <Title level={4} style={{ margin: 0 }}>
                    Product Management
                </Title>

                <Space>
                    <Button>Import</Button>
                    <Button>Export</Button>
                    <Button type="primary" onClick={() => setIsAddOpen(true)}>
                        Add Product
                    </Button>
                </Space>
            </Flex>

            <Card title="Thanh công cụ lọc sản phẩm">
                <Flex wrap="wrap" gap="small">
                    <Input placeholder="Search product" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                    <Cascader options={categoryOptions} value={category} onChange={setCategory} placeholder="Category" />
                    <Cascader options={statusOptions} value={status} onChange={setStatus} placeholder="Status" />
                    <Cascader options={stockOptions} value={stock} onChange={setStock} placeholder="Stock" />
                    <Cascader options={nameSortOptions} value={nameSort} onChange={setNameSort} placeholder="Sort name" />
                    <Cascader options={stockSortOptions} value={stockSort} onChange={setStockSort} placeholder="Sort stock" />
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
                title="Basic Modal"
                open={isAddOpen}
                onCancel={() => setIsAddOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Product Name" name="name" rules={[{ required: true, message: 'Please input the product name!' }]}>
                        <Input placeholder="Enter product name" />
                    </Form.Item>
                    <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select a category!' }]}>
                        <Select placeholder="Select category">
                            <Select.Option value="Laptop">Laptop</Select.Option>
                            <Select.Option value="Phone">Phone</Select.Option>
                            <Select.Option value="Accessory">Accessory</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
                        <Input placeholder="Enter price" prefix="$" />
                    </Form.Item>
                    <Form.Item label="Stock" name="stock" rules={[{ required: true, message: 'Please input the stock quantity!' }]}>
                        <Input placeholder="Enter stock quantity" />
                    </Form.Item>
                </Form>
                
            </Modal>
        </Space>
    );
}
