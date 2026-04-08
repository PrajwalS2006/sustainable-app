// frontend/src/pages/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Input, Select, Slider, Button, Card, Space, Typography, Spin, Empty, Alert } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { getProducts, clearError } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minEcoScore: 0,
    sortBy: 'ecoScore',
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Categories for filter
  const categories = ['All', 'Home & Living', 'Transport', 'Waste Reduction', 'Energy', 'Food', 'Fashion'];
  
  useEffect(() => {
    const queryFilters = {};
    if (filters.search) queryFilters.search = filters.search;
    if (filters.category && filters.category !== 'All') queryFilters.category = filters.category;
    if (filters.minEcoScore > 0) queryFilters.minEcoScore = filters.minEcoScore;
    dispatch(getProducts(queryFilters));
  }, [dispatch, filters.search, filters.category, filters.minEcoScore]);
  
  // Filter and sort products
  const filteredProducts = [...products]
    .filter(product => product.ecoScore >= filters.minEcoScore)
    .sort((a, b) => {
      if (filters.sortBy === 'ecoScore') return b.ecoScore - a.ecoScore;
      if (filters.sortBy === 'priceAsc') return a.price - b.price;
      if (filters.sortBy === 'priceDesc') return b.price - a.price;
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  
  const handleSearch = (value) => {
    setFilters({ ...filters, search: value });
    setSearchParams({ search: value });
  };
  
  const handleCategoryChange = (value) => {
    setFilters({ ...filters, category: value });
    if (value && value !== 'All') {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };
  
  const handleEcoScoreChange = (value) => {
    setFilters({ ...filters, minEcoScore: value });
  };
  
  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      minEcoScore: 0,
      sortBy: 'ecoScore',
    });
    setSearchParams({});
  };
  
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Eco-Friendly Products</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Discover products that help reduce your environmental impact
      </Text>

      {error && (
        <Alert
          type="error"
          showIcon
          message="Could not load products"
          description={error}
          style={{ marginBottom: 24 }}
          closable
          onClose={() => dispatch(clearError())}
        />
      )}
      
      {/* Search and Filter Bar */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search
              placeholder="Search products..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              defaultValue={filters.search}
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              placeholder="Sort by"
              size="large"
              style={{ width: '100%' }}
              value={filters.sortBy}
              onChange={(value) => setFilters({ ...filters, sortBy: value })}
            >
              <Option value="ecoScore">Eco Score (High to Low)</Option>
              <Option value="priceAsc">Price (Low to High)</Option>
              <Option value="priceDesc">Price (High to Low)</Option>
              <Option value="name">Name</Option>
            </Select>
          </Col>
          <Col xs={12} md={4}>
            <Button 
              size="large" 
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              style={{ width: '100%' }}
            >
              Filters
            </Button>
          </Col>
          <Col xs={24} md={8}>
            <Button 
              size="large" 
              icon={<ReloadOutlined />}
              onClick={resetFilters}
              style={{ width: '100%' }}
            >
              Reset Filters
            </Button>
          </Col>
        </Row>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Text strong>Category</Text>
                <Select
                  placeholder="Select category"
                  size="large"
                  style={{ width: '100%', marginTop: 8 }}
                  value={filters.category || 'All'}
                  onChange={handleCategoryChange}
                >
                  {categories.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={12}>
                <Text strong>Minimum Eco Score: {filters.minEcoScore}</Text>
                <Slider
                  min={0}
                  max={100}
                  value={filters.minEcoScore}
                  onChange={handleEcoScoreChange}
                  marks={{ 0: '0', 50: '50', 100: '100' }}
                  style={{ marginTop: 8 }}
                />
              </Col>
            </Row>
          </div>
        )}
      </Card>
      
      {/* Results Count */}
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          Showing {filteredProducts.length} of {products.length} products
        </Text>
      </div>
      
      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Empty
          description={
            error
              ? 'Fix the issue above and refresh the page.'
              : products.length === 0
                ? 'No products in the database yet. From the project root, run: npm run seed'
                : 'No products found matching your criteria'
          }
          style={{ padding: 48 }}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredProducts.map((product) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={product._id}>
              <ProductCard 
                product={product} 
                onPurchase={(id) => {
                  if (isAuthenticated) {
                    // Will handle in ProductDetail
                    window.location.href = `/product/${id}`;
                  } else {
                    window.location.href = '/login';
                  }
                }}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ProductList;