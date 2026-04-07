// frontend/src/pages/Home.jsx (COMPLETE)
import React, { useEffect } from 'react';
import { Row, Col, Typography, Button, Carousel, Card, Space, Statistic, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProducts, getTips } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import TipCard from '../components/TipCard';
import EcoScoreBadge from '../components/EcoScoreBadge';
import { 
  EnvironmentOutlined, 
  ThunderboltOutlined, 
  TeamOutlined,
  ArrowRightOutlined,
  ShoppingOutlined,
  DeleteOutlined,
  CarOutlined,
  HomeOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, tips } = useSelector((state) => state.products);
  const { isAuthenticated, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getProducts({}));
    dispatch(getTips());
  }, [dispatch]);

  // Get featured products (top 4 by eco-score)
  const featuredProducts = products.slice(0, 4);

  // Hero carousel content
  const heroSlides = [
    {
      title: "Make Sustainable Choices",
      subtitle: "Track your carbon footprint and earn eco-scores",
      bgColor: "#2e7d32",
      icon: <EnvironmentOutlined style={{ fontSize: 48, color: '#fff' }} />
    },
    {
      title: "Shop Eco-Friendly Products",
      subtitle: "Discover products that are good for you and the planet",
      bgColor: "#1b5e20",
      icon: <ShoppingOutlined style={{ fontSize: 48, color: '#fff' }} />
    },
    {
      title: "Reduce Waste Today",
      subtitle: "Join our community of eco-conscious consumers",
      bgColor: "#4caf50",
      icon: <DeleteOutlined style={{ fontSize: 48, color: '#fff' }} />
    }
  ];

  // Statistics data
  const stats = [
    { 
      title: "Active Users", 
      value: "10K+", 
      icon: <TeamOutlined />, 
      color: "#52c41a",
      prefix: ""
    },
    { 
      title: "CO₂ Saved", 
      value: "500", 
      suffix: "tons", 
      icon: <EnvironmentOutlined />, 
      color: "#1890ff",
      prefix: ""
    },
    { 
      title: "Eco Products", 
      value: "200+", 
      icon: <ShoppingOutlined />, 
      color: "#faad14",
      prefix: ""
    },
    { 
      title: "Waste Reduced", 
      value: "50", 
      suffix: "tons", 
      icon: <DeleteOutlined />, 
      color: "#ff7a45",
      prefix: ""
    }
  ];

  // Categories for quick navigation
  const categories = [
    { name: "Home & Living", icon: <HomeOutlined />, color: "#52c41a" },
    { name: "Transport", icon: <CarOutlined />, color: "#1890ff" },
    { name: "Waste Reduction", icon: <DeleteOutlined />, color: "#faad14" },
    { name: "Energy", icon: <ThunderboltOutlined />, color: "#ff7a45" }
  ];

  return (
    <div>
      {/* Hero Carousel Section */}
      <Carousel autoplay effect="fade" style={{ marginBottom: 48 }}>
        {heroSlides.map((slide, index) => (
          <div key={index}>
            <div style={{ 
              background: slide.bgColor, 
              padding: '80px 40px', 
              borderRadius: 12,
              textAlign: 'center',
              color: '#fff'
            }}>
              <div style={{ marginBottom: 24 }}>{slide.icon}</div>
              <Title level={1} style={{ color: '#fff', marginBottom: 16 }}>
                {slide.title}
              </Title>
              <Paragraph style={{ color: '#fff', fontSize: 18, marginBottom: 24 }}>
                {slide.subtitle}
              </Paragraph>
              {!isAuthenticated && (
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={() => navigate('/login')}
                  style={{ background: '#fff', color: slide.bgColor, border: 'none' }}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        ))}
      </Carousel>

      {/* Welcome Section */}
      <div style={{ textAlign: 'center', marginBottom: 48, padding: '0 24px' }}>
        <Title level={2}>
          Welcome to EcoLife {isAuthenticated && currentUser ? `, ${currentUser.username}` : ''}
        </Title>
        <Paragraph style={{ fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
          Your journey towards sustainable living starts here. Track your eco-impact, 
          discover green products, and join a community committed to reducing waste.
        </Paragraph>
      </div>

      {/* Statistics Section */}
      <div style={{ background: '#f5f5f5', padding: '48px 24px', marginBottom: 48, borderRadius: 12 }}>
        <Row gutter={[24, 24]} justify="center">
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card style={{ textAlign: 'center', borderRadius: 12 }}>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.icon}
                  valueStyle={{ color: stat.color, fontSize: 28 }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Categories Section */}
      <div style={{ marginBottom: 48, padding: '0 24px' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          Shop by Category
        </Title>
        <Row gutter={[24, 24]} justify="center">
          {categories.map((category, index) => (
            <Col xs={12} sm={6} key={index}>
              <Card 
                hoverable 
                style={{ textAlign: 'center', borderRadius: 12, cursor: 'pointer' }}
                onClick={() => navigate(`/products?category=${category.name.toLowerCase()}`)}
              >
                <div style={{ fontSize: 32, color: category.color, marginBottom: 12 }}>
                  {category.icon}
                </div>
                <Text strong>{category.name}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Featured Products Section */}
      <div style={{ marginBottom: 48, padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>Featured Eco-Friendly Products</Title>
          <Button 
            type="link" 
            onClick={() => navigate('/products')}
            style={{ color: '#52c41a' }}
          >
            View All <ArrowRightOutlined />
          </Button>
        </div>
        <Row gutter={[24, 24]}>
          {featuredProducts.map((product) => (
            <Col xs={24} sm={12} lg={6} key={product._id}>
              <ProductCard 
                product={product} 
                onPurchase={(id) => {
                  if (isAuthenticated) {
                    navigate(`/product/${id}`);
                  } else {
                    navigate('/login');
                  }
                }}
              />
            </Col>
          ))}
        </Row>
        {featuredProducts.length === 0 && (
          <Card style={{ textAlign: 'center', padding: 48 }}>
            <Text type="secondary">Loading products...</Text>
          </Card>
        )}
      </div>

      {/* Tips Section */}
      <div style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', padding: '48px 24px', borderRadius: 12, marginBottom: 48 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          💡 Daily Sustainability Tips
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            {tips.slice(0, 3).map((tip, index) => (
              <TipCard key={tip._id} tip={tip} index={index} />
            ))}
          </Col>
          <Col xs={24} md={12}>
            {tips.slice(3, 6).map((tip, index) => (
              <TipCard key={tip._id} tip={tip} index={index + 3} />
            ))}
          </Col>
        </Row>
      </div>

      {/* Call to Action Section */}
      {!isAuthenticated && (
        <div style={{ 
          background: 'linear-gradient(135deg, #1a5f1a 0%, #2e7d32 100%)', 
          padding: '60px 40px', 
          borderRadius: 12, 
          textAlign: 'center',
          color: '#fff'
        }}>
          <Title level={2} style={{ color: '#fff' }}>Ready to Make a Difference?</Title>
          <Paragraph style={{ color: '#fff', fontSize: 16, marginBottom: 24 }}>
            Join thousands of users who are already tracking their eco-impact
          </Paragraph>
          <Space size="large">
            <Button size="large" onClick={() => navigate('/login')} style={{ background: '#fff', color: '#2e7d32', border: 'none' }}>
              Login
            </Button>
            <Button size="large" onClick={() => navigate('/login')} style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}>
              Sign Up
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
};

export default Home;