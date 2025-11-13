import Axios from '../axios';

export const newsletterAPI = {
  // Subscribe to newsletter
  subscribe: async (email, source = 'website', preferences = {}) => {
    const response = await Axios.post('/newsletter/subscribe', {
      email,
      source,
      preferences
    });
    return response.data;
  },

  // Unsubscribe from newsletter
  unsubscribe: async (email) => {
    const response = await Axios.post('/newsletter/unsubscribe', {
      email
    });
    return response.data;
  },

  // Update subscription preferences
  updatePreferences: async (email, preferences) => {
    const response = await Axios.put('/newsletter/preferences', {
      email,
      preferences
    });
    return response.data;
  },

  // Get all subscribers (admin only)
  getSubscribers: async (params = {}) => {
    const response = await Axios.get('/newsletter/subscribers', { params });
    return response.data;
  },

  // Get subscription statistics (admin only)
  getStats: async () => {
    const response = await Axios.get('/newsletter/stats');
    return response.data;
  }
};
