// frontend/src/components/TipCard.jsx
import React from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import { 
  BulbOutlined, 
  DeleteOutlined, 
  ShoppingOutlined, 
  CarOutlined,
  HomeOutlined 
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const getCategoryIcon = (category) => {
  const icons = {
    'waste': <DeleteOutlined />,
    'shopping': <ShoppingOutlined />,
    'transport': <CarOutlined />,
    'energy': <HomeOutlined />,
    default: <BulbOutlined />
  };
  return icons[category?.toLowerCase()] || icons.default;
};

const TipCard = ({ tip, index }) => {
  return (
    <Card 
      size="small" 
      style={{ 
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%)',
        borderRadius: 8,
        marginBottom: 8
      }}
    >
      <Space align="start">
        <div style={{ 
          background: '#52c41a20', 
          borderRadius: '50%', 
          padding: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {getCategoryIcon(tip.category)}
        </div>
        <div style={{ flex: 1 }}>
          <Paragraph style={{ margin: 0, fontWeight: 500 }}>
            💡 Tip #{index + 1}
          </Paragraph>
          <Text>{tip.tipText}</Text>
          <div style={{ marginTop: 4 }}>
            <Tag color="green" style={{ fontSize: 10 }}>
              {tip.category || 'Sustainability'}
            </Tag>
          </div>
        </div>
      </Space>
    </Card>
  );
};

export default TipCard;