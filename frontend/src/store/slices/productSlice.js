// frontend/src/store/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductById, fetchTips } from '../../services/productService';

export const getProducts = createAsyncThunk(
  'products/getAll',
  async (filters, { rejectWithValue }) => {
    try {
      const data = await fetchProducts(filters);
      if (!Array.isArray(data)) {
        return rejectWithValue('Invalid response from server');
      }
      return data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Could not load products. Check that the backend is running (port 5000) and MongoDB is connected.';
      return rejectWithValue(typeof msg === 'string' ? msg : 'Failed to load products');
    }
  }
);

export const getProductById = createAsyncThunk('products/getById', async (id) => {
  const response = await fetchProductById(id);
  return response;
});

export const getTips = createAsyncThunk('products/getTips', async () => {
  const response = await fetchTips();
  return response;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    currentProduct: null,
    tips: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload && String(action.payload)) ||
          action.error?.message ||
          'Failed to load products';
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load product';
      })
      .addCase(getTips.fulfilled, (state, action) => {
        state.tips = action.payload;
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;