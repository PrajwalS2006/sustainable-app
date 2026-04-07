// frontend/src/pages/Profile.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Avatar, Row, Col, Button, Modal, Form, Input, message, Tag, Space, Divider, Statistic, Progress } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  EditOutlined, 
  LogoutOutlined, 
  EnvironmentOutlined,
  TrophyOutlined,
  ShoppingOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { logout } from '../store/slices/userSlice';

const { Title, Text } = Typography;

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, ecoScore, purchaseHistory } = useSelector((state) => state.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  const handleLogout = () => {
    Modal.confirm({
      title: 'Logout',
      content: 'Are you sure you want to logout?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        dispatch(logout());
        message.success('Logged out successfully');
      },
    });
  };
  
  const handleUpdateProfile = (values) => {
    // In a real app, you would dispatch an update action
    message.success('Profile updated successfully!');
    setIsModalVisible(false);
  };
  
  const getMemberSince = () => {
    if (currentUser?.createdAt) {
      return new Date(currentUser.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
    return 'Recently';
  };
  
  const totalItems = purchaseHistory?.reduce((sum, p) => sum + (p.quantity || 1), 0) || 0;
  
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>My Profile</Title>
      
      <Row gutter={[24, 24]}>
        {/* Profile Card */}
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Avatar 
              size={100} 
              icon={<UserOutlined />} 
              style={{ backgroundColor: '#52c41a', marginBottom: 16 }}
            />
            <Title level={3} style={{ marginBottom: 4 }}>{currentUser?.username}</Title>
            <Text type="secondary">
              <MailOutlined /> {currentUser?.email}
            </Text>
            <Divider />
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div>
                <CalendarOutlined /> Member since {getMemberSince()}
              </div>
              <div>
                <ShoppingOutlined /> Total items: {totalItems}
              </div>
              <div>
                <TrophyOutlined /> Eco Score: {ecoScore}/100
              </div>
            </Space>
            <Divider />
            <Space>
              <Button 
                icon={<EditOutlined />} 
                onClick={() => setIsModalVisible(true)}
              >
                Edit Profile
              </Button>
              <Button 
                danger 
                icon={<LogoutOutlined />} 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Space>
          </Card>
        </Col>
        
        {/* Stats Cards */}
        <Col xs={24} md={16}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="Current Eco Score"
                  value={ecoScore}
                  suffix="/100"
                  prefix={<EnvironmentOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
                <Progress 
                  percent={ecoScore} 
                  strokeColor="#52c41a" 
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="Total Purchases"
                  value={purchaseHistory?.length || 0}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Achievements" style={{ borderRadius: 12 }}>
                <Space wrap>
                  {ecoScore >= 80 && (
                    <Tag color="gold" icon={<TrophyOutlined />}>Eco Warrior</Tag>
                  )}
                  {ecoScore >= 60 && ecoScore < 80 && (
                    <Tag color="green" icon={<EnvironmentOutlined />}>Eco Champion</Tag>
                  )}
                  {ecoScore >= 40 && ecoScore < 60 && (
                    <Tag color="lime" icon={<EnvironmentOutlined />}>Eco Beginner</Tag>
                  )}
                  {totalItems >= 10 && (
                    <Tag color="blue">10+ Purchases</Tag>
                  )}
                  {totalItems >= 25 && (
                    <Tag color="purple">25+ Purchases</Tag>
                  )}
                  {totalItems >= 50 && (
                    <Tag color="red">50+ Purchases</Tag>
                  )}
                  {purchaseHistory?.length === 0 && (
                    <Text type="secondary">No achievements yet. Start shopping eco-friendly products!</Text>
                  )}
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      
      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
          initialValues={{
            username: currentUser?.username,
            email: currentUser?.email,
          }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item
            name="password"
            label="New Password (optional)"
          >
            <Input.Password placeholder="Leave blank to keep current password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
