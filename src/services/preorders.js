import api from './api';

export const preorderService = {
  // Get all preorders with filters
  getPreorders: async (params = {}) => {
    const response = await api.get('/preorders', { params });
    return response.data;
  },

  // Get all preorders for admin
  getAdminPreorders: async (params = {}) => {
    const response = await api.get('/preorders/admin/all', { params });
    return response.data;
  },

  // Get single preorder
  getPreorder: async (id) => {
    const response = await api.get(`/preorders/${id}`);
    return response.data;
  },

  // Create new preorder
  createPreorder: async (preorderData) => {
    const response = await api.post('/preorders', preorderData);
    return response.data;
  },

  // Update preorder
  updatePreorder: async (id, preorderData) => {
    const response = await api.put(`/preorders/${id}`, preorderData);
    return response.data;
  },

  // Update preorder status
  updatePreorderStatus: async (id, status) => {
    const response = await api.put(`/preorders/${id}/status`, { status });
    return response.data;
  },

  // Cancel preorder
  cancelPreorder: async (id) => {
    const response = await api.put(`/preorders/${id}/cancel`);
    return response.data;
  },

  // Convert preorder to order
  convertToOrder: async (id) => {
    const response = await api.post(`/preorders/${id}/convert`);
    return response.data;
  },

  // Get preorder analytics
  getPreorderAnalytics: async (params = {}) => {
    const response = await api.get('/admin/preorders/analytics', { params });
    return response.data;
  },

  // Get preorders by customer
  getCustomerPreorders: async (customerId, params = {}) => {
    const response = await api.get(`/customers/${customerId}/preorders`, { params });
    return response.data;
  },

  // Get preorders by product
  getProductPreorders: async (productId, params = {}) => {
    const response = await api.get(`/products/${productId}/preorders`, { params });
    return response.data;
  },

  // Mark preorder as ready to ship
  markReadyToShip: async (id) => {
    const response = await api.put(`/preorders/${id}/ready`);
    return response.data;
  },

  // Bulk update preorders
  bulkUpdatePreorders: async (ids, updateData) => {
    const response = await api.put('/preorders/bulk-update', { ids, updateData });
    return response.data;
  },

  // Get preorder notifications
  getPreorderNotifications: async () => {
    const response = await api.get('/preorders/notifications');
    return response.data;
  },

  // Send preorder notification
  sendPreorderNotification: async (id, notificationType) => {
    const response = await api.post(`/preorders/${id}/notify`, { type: notificationType });
    return response.data;
  },
};