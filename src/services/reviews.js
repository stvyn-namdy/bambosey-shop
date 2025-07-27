// services/reviews.js (Complete review service)
import api from './api';

export const reviewService = {
  // Get all reviews (admin)
  getReviews: async (params = {}) => {
    const response = await api.get('/admin/reviews', { params });
    return response.data;
  },

  // Get single review
  getReview: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  // Get product reviews
  getProductReviews: async (productId, params = {}) => {
    const response = await api.get(`/reviews/product/${productId}`, { params });
    return response.data;
  },

  // Get customer reviews
  getCustomerReviews: async (customerId, params = {}) => {
    const response = await api.get(`/customers/${customerId}/reviews`, { params });
    return response.data;
  },

  // Create review (customer)
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Update review status (admin)
  updateReviewStatus: async (id, status) => {
    const response = await api.put(`/admin/reviews/${id}/status`, { status });
    return response.data;
  },

  // Update review (customer - if editing is allowed)
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  // Delete review (admin)
  deleteReview: async (id) => {
    const response = await api.delete(`/admin/reviews/${id}`);
    return response.data;
  },

  // Bulk update review status
  bulkUpdateReviewStatus: async (ids, status) => {
    const response = await api.put('/admin/reviews/bulk-status', { ids, status });
    return response.data;
  },

  // Get review analytics
  getReviewAnalytics: async (params = {}) => {
    const response = await api.get('/admin/reviews/analytics', { params });
    return response.data;
  },

  // Flag review as inappropriate
  flagReview: async (id, reason) => {
    const response = await api.post(`/reviews/${id}/flag`, { reason });
    return response.data;
  },

  // Get flagged reviews
  getFlaggedReviews: async (params = {}) => {
    const response = await api.get('/admin/reviews/flagged', { params });
    return response.data;
  },

  // Reply to review (admin/business owner)
  replyToReview: async (id, replyData) => {
    const response = await api.post(`/reviews/${id}/reply`, replyData);
    return response.data;
  },

  // Get review statistics
  getReviewStats: async (params = {}) => {
    const response = await api.get('/admin/reviews/stats', { params });
    return response.data;
  },
};