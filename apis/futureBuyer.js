import Axios from '../axios';

// Future Buyer API functions
export const futureBuyerAPI = {
  // Create a new future buyer interest
  createFutureBuyer: async (buyerData) => {
    try {
      const response = await Axios.post('/future-buyers', buyerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all future buyers (admin only)
  getFutureBuyers: async (params = {}) => {
    try {
      const response = await Axios.get('/future-buyers', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get future buyer by ID (admin only)
  getFutureBuyer: async (id) => {
    try {
      const response = await Axios.get(`/future-buyers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete future buyer (admin only)
  deleteFutureBuyer: async (id) => {
    try {
      const response = await Axios.delete(`/future-buyers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Recalculate matches for a future buyer (admin only)
  recalculateMatches: async (id) => {
    try {
      const response = await Axios.post(`/future-buyers/${id}/recalculate-matches`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default futureBuyerAPI;

