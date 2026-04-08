// frontend/src/services/productService.js
import axios from 'axios';
import { getApiBaseUrl } from '../config/apiBaseUrl';

const API_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function toQueryString(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.append(key, String(value));
  });
  return params.toString();
}

// Product services
export const fetchProducts = async (filters = {}) => {
  const qs = toQueryString(filters);
  const response = await api.get(`/products${qs ? `?${qs}` : ''}`);
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Auth services
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

// User purchase services
export const addPurchase = async (userId, productId, quantity) => {
  const response = await api.post('/products/purchase', { userId, productId, quantity });
  return response.data;
};

export const getUserEcoScore = async (userId) => {
  const response = await api.get(`/products/user/${userId}/eco-score`);
  return response.data;
};

// Tips services
export const fetchTips = async () => {
  const response = await api.get('/products/tips/all');
  return response.data;
};
