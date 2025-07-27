import api from './api';

export const colorService = {
  // Get all colors
  getColors: async () => {
    const response = await api.get('/colors');
    return response.data;
  },

  // Create color
  createColor: async (colorData) => {
    const response = await api.post('/colors', colorData);
    return response.data;
  },

  // Update color
  updateColor: async (id, colorData) => {
    const response = await api.put(`/colors/${id}`, colorData);
    return response.data;
  },

  // Delete color
  deleteColor: async (id) => {
    const response = await api.delete(`/colors/${id}`);
    return response.data;
  },
};
