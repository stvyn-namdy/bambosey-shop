import api from './api';

export const orderService = {
  // Get all orders (Admin)
  getOrders: async (params = {}) => {
    console.log('🔍 [Orders Service] Making request to /admin/orders with params:', params);
    const response = await api.get('/admin/orders');
    console.log('📦 [Orders Service] Raw response from /admin/orders:', response);
    console.log('📋 [Orders Service] Response data:', response.data);
    
    let orders = response.data || [];
    
    // Client-side filtering since backend doesn't support it yet
    if (params.status && params.status !== '') {
      orders = orders.filter(order => 
        order.status.toLowerCase() === params.status.toLowerCase()
      );
    }
    
    if (params.search && params.search.trim()) {
      const searchTerm = params.search.toLowerCase();
      orders = orders.filter(order => 
        order.order_number?.toLowerCase().includes(searchTerm) ||
        order.orderNumber?.toLowerCase().includes(searchTerm) ||
        order.user?.email?.toLowerCase().includes(searchTerm) ||
        order.user?.firstName?.toLowerCase().includes(searchTerm) ||
        order.user?.lastName?.toLowerCase().includes(searchTerm)
      );
    }
    
    console.log('� [Orders Service] Filtered orders:', orders);
    console.log('📈 [Orders Service] Total orders count:', orders.length);
    
    // Log first order details if available
    if (orders && orders.length > 0) {
      console.log('🎯 [Orders Service] First order details:', orders[0]);
      console.log('💰 [Orders Service] First order totalAmount:', orders[0].totalAmount);
      console.log('📅 [Orders Service] First order createdAt:', orders[0].createdAt);
      console.log('📅 [Orders Service] First order updatedAt:', orders[0].updatedAt);
    }
    
    return orders;
  },

  // Get single order
  getOrder: async (id) => {
    console.log('🔍 [Orders Service] Making request to get single order ID:', id);
    const response = await api.get(`/admin/orders/${id}`);
    console.log('📦 [Orders Service] Single order response:', response.data);
    return response.data;
  },

  // Get recent orders
  getRecentOrders: async (limit = 10) => {
    console.log('🔍 [Orders Service] Making request for recent orders with limit:', limit);
    const response = await api.get('/admin/orders');
    console.log('📦 [Orders Service] Recent orders response:', response.data);
    
    // Since backend returns all orders, take the first N (most recent)
    const orders = response.data || [];
    return orders.slice(0, limit);
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
    const response = await api.get('/admin/analytics', { params });
    return response.data;
  },
};