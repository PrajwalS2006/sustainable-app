// frontend/src/components/Navbar.jsx
import React from 'react';
import { Layout, Menu, Button, Avatar, Badge } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  HomeOutlined, 
  ShoppingOutlined, 
  LineChartOutlined, 
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  EnvironmentOutlined 
} from '@ant-design/icons';
import { logout } from '../store/slices/userSlice';

const { Header } = Layout;

const Navbar = () => {
  const { isAuthenticated, currentUser, ecoScore } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const menuItems = [
    { key: 'home', icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
    { key: 'products', icon: <ShoppingOutlined />, label: <Link to="/products">Products</Link> },
    { key: 'tracker', icon: <LineChartOutlined />, label: <Link to="/tracker">Tracker</Link> },
  ];

  const rightMenuItems = isAuthenticated
    ? [
        { 
          key: 'eco-score', 
          label: (
            <Badge 
              count={ecoScore} 
              style={{ backgroundColor: '#52c41a' }}
              title="Your Eco Score"
            >
              <EnvironmentOutlined style={{ fontSize: 18 }} />
            </Badge>
          ),
        },
        { key: 'profile', icon: <UserOutlined />, label: <Link to="/profile">{currentUser?.username}</Link> },
        { key: 'logout', icon: <LogoutOutlined />, label: <Button type="link" onClick={handleLogout}>Logout</Button> },
      ]
    : [
        { key: 'login', icon: <LoginOutlined />, label: <Link to="/login">Login</Link> },
      ];

  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
        <EnvironmentOutlined style={{ fontSize: 24, color: '#52c41a', marginRight: 8 }} />
        <span style={{ fontSize: 18, fontWeight: 'bold', color: '#2e7d32' }}>EcoLife</span>
      </div>
      <Menu mode="horizontal" items={menuItems} style={{ flex: 1, justifyContent: 'center', border: 'none' }} />
      <Menu mode="horizontal" items={rightMenuItems} style={{ border: 'none' }} />
    </Header>
  );
};

export default Navbar;