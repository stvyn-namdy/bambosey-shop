import api from './api';

export const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },

  // Create product
  createProduct: async (productData) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Get product categories
  getProductCategories: async () => {
    const response = await api.get('/admin/products/categories');
    return response.data;
  },

  // Get product variants
  getProductVariants: async (productId) => {
    const response = await api.get(`/admin/products/${productId}/variants`);
    return response.data;
  },
};