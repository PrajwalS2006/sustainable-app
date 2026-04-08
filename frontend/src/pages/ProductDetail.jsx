// frontend/src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Row, Col, Card, Button, Typography, Tag, Space, InputNumber, 
  message, Descriptions, Divider, Spin, Alert, Modal 
} from 'antd';
import { 
  ShoppingCartOutlined, 
  EnvironmentOutlined as LeafOutlined, 
  DropboxOutlined, 
  ThunderboltOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { getProductById } from '../store/slices/productSlice';
import { purchaseProduct } from '../store/slices/userSlice';
import EcoScoreBadge from '../components/EcoScoreBadge';
import TipCard from '../components/TipCard';
import { getProductImage } from '../assets/products';

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct, loading, tips } = useSelector((state) => state.products);
  const { isAuthenticated, currentUser } = useSelector((state) => state.user);
  
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);
  
  const handlePurchase = async () => {
    if (!isAuthenticated) {
      Modal.confirm({
        title: 'Login Required',
        content: 'Please login to track your purchase and earn eco-score points.',
        okText: 'Login',
        cancelText: 'Cancel',
        onOk: () => navigate('/login'),
      });
      return;
    }
    
    setPurchasing(true);
    try {
      await dispatch(purchaseProduct({
        userId: currentUser.id,
        productId: id,
        quantity: quantity
      })).unwrap();
      
      message.success({
        content: `Successfully added ${quantity} item(s) to your tracker! Your eco-score has been updated.`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        duration: 3,
      });
      
      // Navigate to tracker to show updated score
      setTimeout(() => {
        navigate('/tracker');
      }, 1500);
      
    } catch (error) {
      message.error('Failed to add purchase. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (!currentProduct) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Alert
          message="Product Not Found"
          description="The product you're looking for doesn't exist or has been removed."
          type="error"
          showIcon
        />
        <Button 
          type="primary" 
          onClick={() => navigate('/products')} 
          style={{ marginTop: 24 }}
        >
          Browse Products
        </Button>
      </div>
    );
  }
  
  const getEcoScoreDescription = (score) => {
    if (score >= 80) return { text: 'Excellent choice! This product has minimal environmental impact.', color: '#52c41a' };
    if (score >= 60) return { text: 'Good choice. This product has low environmental impact.', color: '#73d13d' };
    if (score >= 40) return { text: 'Fair. Consider looking for more sustainable alternatives.', color: '#faad14' };
    return { text: 'Poor environmental impact. Try to find a greener alternative.', color: '#ff4d4f' };
  };
  
  const ecoDescription = getEcoScoreDescription(currentProduct.ecoScore);
  
  // Related tips based on product category
  const relatedTips = tips.filter(tip => 
    tip.category?.toLowerCase() === currentProduct.category?.toLowerCase()
  ).slice(0, 3);
  
  return (
    <div style={{ padding: '24px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/products')}
        style={{ marginBottom: 24 }}
      >
        Back to Products
      </Button>
      
      <Row gutter={[32, 32]}>
        {/* Product Image */}
        <Col xs={24} md={10}>
          <Card 
            cover={
              <img 
                alt={currentProduct.name} 
                src={getProductImage(currentProduct.name) || currentProduct.imageUrl || 'https://via.placeholder.com/500x400?text=Eco+Product'}
                style={{ borderRadius: '12px 12px 0 0' }}
              />
            }
            style={{ borderRadius: 12, overflow: 'hidden' }}
          >
            <div style={{ textAlign: 'center' }}>
              <EcoScoreBadge score={currentProduct.ecoScore} size="large" />
              <div style={{ marginTop: 8 }}>
                <Tag color={ecoDescription.color} style={{ fontSize: 14, padding: '4px 12px' }}>
                  {ecoDescription.text.split('.')[0]}
                </Tag>
              </div>
            </div>
          </Card>
        </Col>
        
        {/* Product Details */}
        <Col xs={24} md={14}>
          <div>
            <Tag color="green" style={{ marginBottom: 12 }}>
              {currentProduct.category || 'Eco-Friendly'}
            </Tag>
            <Title level={2} style={{ marginTop: 0 }}>{currentProduct.name}</Title>
            <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
              {currentProduct.description}
            </Paragraph>
            
            <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Price">
                <Text strong style={{ fontSize: 24, color: '#52c41a' }}>
                  ${currentProduct.price}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Eco Score">
                <Text strong style={{ color: ecoDescription.color }}>
                  {currentProduct.ecoScore}/100
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Carbon Footprint">
                <Space>
                  <ThunderboltOutlined />
                  {currentProduct.carbonFootprint} kg CO₂
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Water Usage">
                <Space>
                  <DropboxOutlined />
                  {currentProduct.waterUsage} liters
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Recyclable" span={2}>
                {currentProduct.recyclable ? (
                  <Tag color="green">Yes</Tag>
                ) : (
                  <Tag color="red">No</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 24 }}>
              <Space align="center">
                <LeafOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                <Text>
                  <strong>Environmental Impact:</strong> {ecoDescription.text}
                </Text>
              </Space>
            </div>
            
            <Space size="large" wrap>
              <Space>
                <Text>Quantity:</Text>
                <InputNumber 
                  min={1} 
                  max={99} 
                  value={quantity} 
                  onChange={setQuantity}
                  size="large"
                />
              </Space>
              <Button 
                type="primary" 
                size="large" 
                icon={<ShoppingCartOutlined />}
                onClick={handlePurchase}
                loading={purchasing}
                style={{ background: '#52c41a', borderColor: '#52c41a' }}
              >
                Track This Purchase
              </Button>
            </Space>
            
            <Divider />
            
            <Text type="secondary">
              By purchasing this product, you'll earn eco-score points that contribute to 
              your overall sustainability rating. Track all your purchases in your profile.
            </Text>
          </div>
        </Col>
      </Row>
      
      {/* Related Tips Section */}
      {relatedTips.length > 0 && (
        <>
          <Divider orientation="left">
            <Space>
              <LeafOutlined />
              Related Sustainability Tips
            </Space>
          </Divider>
          <Row gutter={[16, 16]}>
            {relatedTips.map((tip, index) => (
              <Col xs={24} md={8} key={tip._id}>
                <TipCard tip={tip} index={index} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default ProductDetail;
