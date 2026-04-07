// frontend/src/store/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductById, fetchTips } from '../../services/productService';

export const getProducts = createAsyncThunk('products/getAll', async (filters) => {
  const response = await fetchProducts(filters);
  return response;
});

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        state.loading = false;
      })
      .addCase(getTips.fulfilled, (state, action) => {
        state.tips = action.payload;
      });
  },
});

export default productSlice.reducer;