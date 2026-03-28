import { Card, Col, Layout, Row, Typography, theme } from 'antd';
import laptopImage from '../../assets/laptop.webp';

const { Content } = Layout;
const { Title } = Typography;

export default function ClientHome() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Content style={{ padding: '0 48px' }}>
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
                            FLASH SALE - GIAM GIA DEN 50% CHO LAPTOP, DIEN THOAI VA PHU KIEN
                        </Title>
                        <Title level={4} type="secondary">
                            Mua ngay de khong bo lo co hoi so huu nhung san pham cong nghe hang dau voi gia cuc soc.
                        </Title>
                        <Title level={5} type="secondary">
                            So luong co han, uu dai chi ap dung cho mot so san pham nhat dinh.
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
                        <img
                            src={laptopImage}
                            alt="Laptop"
                            style={{ width: '100%', maxWidth: 560, height: 'auto', objectFit: 'contain' }}
                        />
                    </div>
                </Col>
            </Row>

            <div
                style={{
                    padding: 24,
                    minHeight: 380,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Card title="Dien thoai" extra={<a href="#">More</a>}>
                    <p>Card content</p>
                    <p>Card content</p>
                    <p>Card content</p>
                </Card>
                <Card title="Laptop" extra={<a href="#">More</a>}>
                    <p>Card content</p>
                    <p>Card content</p>
                    <p>Card content</p>
                </Card>
                <Card title="Phu kien" extra={<a href="#">More</a>}>
                    <p>Card content</p>
                    <p>Card content</p>
                    <p>Card content</p>
                </Card>
            </div>
        </Content>
    );
}
