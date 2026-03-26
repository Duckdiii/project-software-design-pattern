import { Card, Col, Layout, Row, Typography, Button, Flex } from 'antd';
import { NavLink, Outlet } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function AuthLayout() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content>
                <Row style={{ minHeight: '100vh' }}>
                    <Col xs={24} lg={12} style={{ background: '#ffffff' }}>
                        <div
                            style={{
                                minHeight: '100vh',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 24,
                            }}
                        >
                            <Title level={2} style={{ marginBottom: 24 }}>
                                TechStore
                            </Title>
                        </div>
                    </Col>

                    <Col xs={0} lg={12} style={{ background: '#f3f4f6' }}>
                        <div
                            style={{
                                minHeight: '100vh',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 24,
                            }}
                        >
                            <Title level={2} style={{ marginBottom: 8 }}>
                                Chào mừng bạn đến với TechStore
                            </Title>
                            <Text type="secondary">Đăng nhập để tiếp tục mua sắm và theo dõi đơn hàng</Text>
                            <Card style={{ width: '100%', maxWidth: 300, marginTop: 16 }}>
                                <Flex justify="space-between" align="center">
                                    <Button type="primary" href="/auth">
                                        Sign in
                                    </Button>
                                    <Button href="/auth/register">Sign up</Button>
                                </Flex>
                                <Content style={{ margin: '16px' }}>
                                    <Outlet />
                                </Content>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}
