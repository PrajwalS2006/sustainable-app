// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Tabs, message, Typography, Space, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { login, signup } from '../store/slices/userSlice';

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  const onFinishLogin = async (values) => {
    setLoading(true);
    try {
      await dispatch(login(values)).unwrap();
      message.success('Login successful! Welcome back!');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const onFinishSignup = async (values) => {
    setLoading(true);
    try {
      await dispatch(signup(values)).unwrap();
      message.success('Account created successfully! Welcome to EcoLife!');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      padding: '24px'
    }}>
      <Card style={{ width: 450, borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <EnvironmentOutlined style={{ fontSize: 48, color: '#52c41a' }} />
          <Title level={2} style={{ marginTop: 8, marginBottom: 4 }}>Welcome to EcoLife</Title>
          <Text type="secondary">Join the sustainable living community</Text>
        </div>
        
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          size="large"
          items={[
            {
              key: 'login',
              label: 'Login',
              children: (
                <Form
                  name="login"
                  onFinish={onFinishLogin}
                  layout="vertical"
                  size="large"
                >
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                  </Form.Item>
                  
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      block 
                      loading={loading}
                      style={{ background: '#52c41a', borderColor: '#52c41a' }}
                    >
                      Login
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'signup',
              label: 'Sign Up',
              children: (
                <Form
                  name="signup"
                  onFinish={onFinishSignup}
                  layout="vertical"
                  size="large"
                >
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: 'Please enter a username' },
                      { min: 3, message: 'Username must be at least 3 characters' }
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                  </Form.Item>
                  
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                  </Form.Item>
                  
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: 'Please enter a password' },
                      { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                  </Form.Item>
                  
                  <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm your password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      block 
                      loading={loading}
                      style={{ background: '#52c41a', borderColor: '#52c41a' }}
                    >
                      Create Account
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
        
        <Alert
          message="Demo Credentials"
          description="Email: demo@ecolife.com | Password: demo123"
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
        
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">
            By joining, you agree to track your eco-friendly purchases and help the planet!
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
