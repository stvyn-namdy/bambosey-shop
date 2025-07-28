import api from './api';

export const orderService = {
  // Get all orders
  getOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },

  // Get recent orders
  getRecentOrders: async (limit = 10) => {
    const response = await api.get('/admin/orders/recent', { 
      params: { limit } 
    });
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.put(`/admin/orders/${id}/cancel`);
    return response.data;
  },

  // Get order analytics
  getOrderAnalytics: async (params = {}) => {
    const response = await api.get('/admin/orders/analytics', { params });
    return response.data;
  },
};