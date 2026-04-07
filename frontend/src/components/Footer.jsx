// frontend/src/components/Footer.jsx
import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { 
  EnvironmentOutlined, 
  HeartOutlined, 
  TeamOutlined,
  MailOutlined 
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ background: '#1a1a1a', color: '#fff', marginTop: 'auto' }}>
      <Row gutter={[32, 32]} justify="space-between">
        <Col xs={24} sm={8}>
          <Space direction="vertical" size="small">
            <EnvironmentOutlined style={{ fontSize: 24, color: '#52c41a' }} />
            <Text strong style={{ color: '#fff', fontSize: 18 }}>EcoLife</Text>
            <Text style={{ color: '#aaa' }}>Making sustainable living accessible to everyone</Text>
          </Space>
        </Col>
        <Col xs={24} sm={8}>
          <Space direction="vertical" size="small">
            <Text strong style={{ color: '#fff' }}>Quick Links</Text>
            <Link href="/products" style={{ color: '#aaa' }}>Eco Products</Link>
            <Link href="/tracker" style={{ color: '#aaa' }}>Track Your Impact</Link>
            <Link href="/tips" style={{ color: '#aaa' }}>Sustainability Tips</Link>
          </Space>
        </Col>
        <Col xs={24} sm={8}>
          <Space direction="vertical" size="small">
            <Text strong style={{ color: '#fff' }}>Connect</Text>
            <Space>
              <MailOutlined style={{ color: '#aaa' }} />
              <Text style={{ color: '#aaa' }}>hello@ecolife.com</Text>
            </Space>
            <Space>
              <TeamOutlined style={{ color: '#aaa' }} />
              <Text style={{ color: '#aaa' }}>Join our community</Text>
            </Space>
          </Space>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #333' }}>
        <Text style={{ color: '#aaa' }}>
          © 2024 EcoLife - Made with <HeartOutlined style={{ color: '#ff4d4f' }} /> for a sustainable future
        </Text>
      </Row>
    </AntFooter>
  );
};

export default Footer;