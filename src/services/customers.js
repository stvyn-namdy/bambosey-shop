import api from './api';

export const customerService = {
  // Get all customers
  getCustomers: async (params = {}) => {
    const response = await api.get('/admin/customers', { params });
    return response.data;
  },

  // Get single customer
  getCustomer: async (id) => {
    const response = await api.get(`/admin/customers/${id}`);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/admin/customers/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    const response = await api.delete(`/admin/customers/${id}`);
    return response.data;
  },

  // Get customer orders
  getCustomerOrders: async (customerId, params = {}) => {
    const response = await api.get(`/admin/customers/${customerId}/orders`, { params });
    return response.data;
  },

  // Get customer analytics
  getCustomerAnalytics: async (params = {}) => {
    const response = await api.get('/admin/customers/analytics', { params });
    return response.data;
  },
};
