// frontend/src/pages/Tracker.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Statistic, Progress, Empty, Tag, Space, Divider, Button } from 'antd';
import {
  EnvironmentOutlined,
  ShoppingOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { fetchEcoScore } from '../store/slices/userSlice';
import { getProducts } from '../store/slices/productSlice';
import { getEcoScoreColor, getMotivationalMessage, calculateCarbonSaved } from '../utils/ecoUtils';

const { Title, Text, Paragraph } = Typography;

const Tracker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, ecoScore, purchaseHistory } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchEcoScore(currentUser.id));
    }
    dispatch(getProducts({}));
  }, [dispatch, currentUser]);

  const totalItems = purchaseHistory?.reduce((sum, p) => sum + (p.quantity || 1), 0) || 0;
  const carbonSaved = calculateCarbonSaved(ecoScore, totalItems);
  const motivationalMessage = getMotivationalMessage(ecoScore);

  const getProductName = (productId) => {
    const product = products.find((p) => p._id === productId);
    return product ? product.name : 'Eco Product';
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <EnvironmentOutlined style={{ color: '#52c41a', marginRight: 8 }} />
        Eco Impact Tracker
      </Title>
      <Paragraph type="secondary">
        Track your sustainable purchases and see your environmental impact grow.
      </Paragraph>

      {/* Motivational Banner */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
          borderRadius: 12,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          {motivationalMessage}
        </Title>
      </Card>

      {/* Stats Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title="Eco Score"
              value={ecoScore}
              suffix="/100"
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: getEcoScoreColor(ecoScore) }}
            />
            <Progress
              percent={ecoScore}
              strokeColor={getEcoScoreColor(ecoScore)}
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title="Total Purchases"
              value={purchaseHistory?.length || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title="Items Tracked"
              value={totalItems}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title="CO2 Saved (est.)"
              value={carbonSaved}
              suffix="kg"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Purchase History */}
      <Card
        title={
          <Space>
            <ShoppingOutlined />
            <span>Purchase History</span>
          </Space>
        }
        style={{ borderRadius: 12 }}
      >
        {purchaseHistory && purchaseHistory.length > 0 ? (
          <div>
            {purchaseHistory.map((purchase, index) => (
              <Card
                key={index}
                size="small"
                style={{
                  marginBottom: 8,
                  borderRadius: 8,
                  background: '#fafafa',
                }}
              >
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>{getProductName(purchase.productId)}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {purchase.purchaseDate
                        ? new Date(purchase.purchaseDate).toLocaleDateString()
                        : 'Recently'}
                    </Text>
                  </Col>
                  <Col>
                    <Space>
                      <Tag color="blue">Qty: {purchase.quantity || 1}</Tag>
                      <Tag color="green">
                        <EnvironmentOutlined /> Tracked
                      </Tag>
                    </Space>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        ) : (
          <Empty
            description="No purchases tracked yet"
            style={{ padding: 48 }}
          >
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate('/products')}
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
            >
              Browse Eco Products
            </Button>
          </Empty>
        )}
      </Card>

      <Divider />

      {/* Eco Tips */}
      <Card
        style={{
          borderRadius: 12,
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%)',
        }}
      >
        <Title level={4}>
          <EnvironmentOutlined style={{ color: '#52c41a', marginRight: 8 }} />
          How to Improve Your Eco Score
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card size="small" style={{ borderRadius: 8 }}>
              <Text strong>Buy Sustainable Products</Text>
              <br />
              <Text type="secondary">
                Products with higher eco-scores boost your rating faster.
              </Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" style={{ borderRadius: 8 }}>
              <Text strong>Track Every Purchase</Text>
              <br />
              <Text type="secondary">
                Log all your eco-friendly purchases to build your history.
              </Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" style={{ borderRadius: 8 }}>
              <Text strong>Choose Recyclable</Text>
              <br />
              <Text type="secondary">
                Prioritize recyclable products to reduce waste impact.
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Tracker;
