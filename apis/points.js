import Axios from '../axios';

// Point API functions
export const pointAPI = {
  // Get user's point balance and recent transactions
  getPointBalance: async () => {
    try {
      const response = await Axios.get('/points/balance');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Charge points (purchase points)
  chargePoints: async (chargeData) => {
    try {
      const response = await Axios.post('/points/charge', chargeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Deduct points (for listing publication)
  deductPoints: async (deductData) => {
    try {
      const response = await Axios.post('/points/deduct', deductData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get transaction history with pagination
  getTransactionHistory: async (params = {}) => {
    try {
      const response = await Axios.get('/points/transactions', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Calculate points needed for a listing
  calculateListingCost: async (listingData) => {
    try {
      const response = await Axios.post('/points/calculate-cost', listingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Refund points (for deleted listings)
  refundPoints: async (refundData) => {
    try {
      const response = await Axios.post('/points/refund', refundData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default pointAPI;
