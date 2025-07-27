import api from './api';

export const analyticsService = {
  // Get dashboard analytics
  getDashboardStats: async (params = {}) => {
    const response = await api.get('/admin/analytics/dashboard', { params });
    return response.data;
  },

  // Get sales analytics
  getSalesAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics/sales', { params });
    return response.data;
  },

  // Get product performance
  getProductPerformance: async (params = {}) => {
    const response = await api.get('/admin/analytics/products', { params });
    return response.data;
  },

  // Get customer analytics
  getCustomerAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics/customers', { params });
    return response.data;
  },

  // Get revenue analytics
  getRevenueAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics/revenue', { params });
    return response.data;
  },
};
