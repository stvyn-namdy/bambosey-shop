import api from './api';

export const inventoryService = {
  // Get inventory data
  getInventory: async (params = {}) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  },

  // Update inventory
  updateInventory: async (variantId, data) => {
    const response = await api.put(`/inventory/${variantId}`, data);
    return response.data;
  },

  // Get low stock alerts
  getLowStockAlerts: async () => {
    const response = await api.get('/inventory/alerts');
    return response.data;
  },

  // Get inventory analytics
  getInventoryAnalytics: async (params = {}) => {
    const response = await api.get('/admin/inventory/analytics', { params });
    return response.data;
  },

  // Bulk update inventory
  bulkUpdateInventory: async (updates) => {
    const response = await api.post('/inventory/bulk-update', { updates });
    return response.data;
  },
};