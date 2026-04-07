// frontend/src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, signupUser, addPurchase, getUserEcoScore } from '../../services/productService';

// Helper to load persisted user from localStorage
const loadUserFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      return JSON.parse(userData);
    }
  } catch (e) {
    // Ignore parse errors
  }
  return null;
};

const persistedUser = loadUserFromStorage();

// Async thunks for user actions
export const login = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUser(credentials);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed. Please try again.');
  }
});

export const signup = createAsyncThunk('user/signup', async (userData, { rejectWithValue }) => {
  try {
    const response = await signupUser(userData);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Signup failed. Please try again.');
  }
});

export const purchaseProduct = createAsyncThunk('user/purchase', async ({ userId, productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await addPurchase(userId, productId, quantity);
    // Update persisted user data with new eco score and purchases
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      user.ecoScore = response.ecoScore;
      user.purchasedProducts = response.purchasedProducts;
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Purchase failed. Please try again.');
  }
});

export const fetchEcoScore = createAsyncThunk('user/fetchEcoScore', async (userId, { rejectWithValue }) => {
  try {
    const response = await getUserEcoScore(userId);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch eco score.');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: persistedUser,
    isAuthenticated: !!persistedUser,
    ecoScore: persistedUser?.ecoScore || 0,
    purchaseHistory: persistedUser?.purchasedProducts || [],
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.ecoScore = 0;
      state.purchaseHistory = [];
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.ecoScore = action.payload.ecoScore;
        state.purchaseHistory = action.payload.purchasedProducts || [];
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.ecoScore = action.payload.ecoScore || 0;
        state.purchaseHistory = action.payload.purchasedProducts || [];
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Purchase
      .addCase(purchaseProduct.fulfilled, (state, action) => {
        state.ecoScore = action.payload.ecoScore;
        state.purchaseHistory = action.payload.purchasedProducts;
      })
      // Eco Score
      .addCase(fetchEcoScore.fulfilled, (state, action) => {
        state.ecoScore = action.payload.ecoScore;
        state.purchaseHistory = action.payload.purchaseHistory;
      });
  },
});

export const { logout, setUser, clearError } = userSlice.actions;
export default userSlice.reducer;
