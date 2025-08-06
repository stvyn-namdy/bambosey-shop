import api from './api';

export const productService = {
  // Get all products (for admin)
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Products API error:', error);
      throw error;
    }
  },

  // Get all products for admin dashboard with full details
  getAdminProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Admin products API error:', error);
      throw error;
    }
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create product
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get product categories
  getProductCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get product variants
  getProductVariants: async (productId) => {
    const response = await api.get(`/products/${productId}/variants`);
    return response.data;
  },
};