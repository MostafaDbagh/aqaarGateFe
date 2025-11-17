import Axios from '../axios';

// City API functions
export const cityAPI = {
  // Get city statistics (counts for each city)
  getCityStats: async () => {
    try {
      const response = await Axios.get('/cities');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get detailed information for a specific city
  getCityDetails: async (cityName) => {
    try {
      const response = await Axios.get(`/cities/${cityName}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all available cities
  getAllCities: async () => {
    try {
      const response = await Axios.get('/cities');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default cityAPI;

