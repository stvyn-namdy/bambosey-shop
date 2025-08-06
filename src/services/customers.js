import api from './api';

export const customerService = {
  // Get all customers
  getCustomers: async (params = {}) => {
    console.log('🔍 [Customers Service] Making request to /admin/users with params:', params);
    const response = await api.get('/admin/users', { params });
    console.log('📦 [Customers Service] Raw response from /admin/users:', response);
    console.log('📋 [Customers Service] Response data:', response.data);
    if (response.data.users && response.data.users.length > 0) {
      console.log('👤 [Customers Service] First customer details:', response.data.users[0]);
      console.log('📊 [Customers Service] First customer totalOrders:', response.data.users[0].totalOrders);
      console.log('💰 [Customers Service] First customer totalSpent:', response.data.users[0].totalSpent);
    }
    return response.data;
  },

  // Get single customer
  getCustomer: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/admin/users/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Get customer orders
  getCustomerOrders: async (customerId, params = {}) => {
    const response = await api.get(`/admin/users/${customerId}/orders`, { params });
    return response.data;
  },

  // Get customer analytics
  getCustomerAnalytics: async (params = {}) => {
    const response = await api.get('/admin/customers/analytics', { params });
    return response.data;
  },
};
