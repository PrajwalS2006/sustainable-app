// frontend/src/components/ProductCard.jsx
import React from 'react';
import { Card, Button, Typography, Space, Tooltip } from 'antd';
import { ShoppingCartOutlined, StarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import EcoScoreBadge from './EcoScoreBadge';
import { getProductImage } from '../assets/products';

const { Text, Paragraph } = Typography;

const ProductCard = ({ product, onPurchase }) => {
  const navigate = useNavigate();

  const getEcoScoreColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <Card
      hoverable
      cover={
        <img
          alt={product.name}
          src={getProductImage(product.name) || product.imageUrl || 'https://via.placeholder.com/300x200?text=Eco+Product'}
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
      actions={[
        <Tooltip title="View Details">
          <Button type="link" onClick={() => navigate(`/product/${product._id}`)}>
            Details
          </Button>
        </Tooltip>,
        <Tooltip title="Add to Tracker">
          <Button 
            type="primary" 
            icon={<ShoppingCartOutlined />} 
            onClick={() => onPurchase(product._id)}
            style={{ background: '#52c41a' }}
          >
            Track Purchase
          </Button>
        </Tooltip>,
      ]}
      style={{ borderRadius: 12, overflow: 'hidden' }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong style={{ fontSize: 16 }}>{product.name}</Text>
          <EcoScoreBadge score={product.ecoScore} />
        </div>
        
        <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: 12, margin: 0 }}>
          {product.description}
        </Paragraph>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <Space size="small">
            <EnvironmentOutlined style={{ color: getEcoScoreColor(product.ecoScore) }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Carbon: {product.carbonFootprint}kg CO₂
            </Text>
          </Space>
          <Text strong style={{ color: '#52c41a', fontSize: 18 }}>
            ${product.price}
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default ProductCard;
