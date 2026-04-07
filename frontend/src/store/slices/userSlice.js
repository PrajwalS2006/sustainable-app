// frontend/src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, signupUser, addPurchase, getUserEcoScore } from '../../services/productService';

// Async thunks for user actions
export const login = createAsyncThunk('user/login', async (credentials) => {
  const response = await loginUser(credentials);
  localStorage.setItem('token', response.token);
  return response.user;
});

export const signup = createAsyncThunk('user/signup', async (userData) => {
  const response = await signupUser(userData);
  localStorage.setItem('token', response.token);
  return response.user;
});

export const purchaseProduct = createAsyncThunk('user/purchase', async ({ userId, productId, quantity }) => {
  const response = await addPurchase(userId, productId, quantity);
  return response;
});

export const fetchEcoScore = createAsyncThunk('user/fetchEcoScore', async (userId) => {
  const response = await getUserEcoScore(userId);
  return response;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    isAuthenticated: false,
    ecoScore: 0,
    purchaseHistory: [],
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.ecoScore = 0;
      state.purchaseHistory = [];
      localStorage.removeItem('token');
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.ecoScore = action.payload.ecoScore;
        state.loading = false;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(purchaseProduct.fulfilled, (state, action) => {
        state.ecoScore = action.payload.ecoScore;
        state.purchaseHistory = action.payload.purchasedProducts;
      })
      .addCase(fetchEcoScore.fulfilled, (state, action) => {
        state.ecoScore = action.payload.ecoScore;
        state.purchaseHistory = action.payload.purchaseHistory;
      });
  },
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;