import Axios from '../axios';

// Category API functions
export const categoryAPI = {
  // Get category statistics (counts for each property type)
  getCategoryStats: async () => {
    try {
      const response = await Axios.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get detailed information for a specific property type
  getCategoryDetails: async (propertyType) => {
    try {
      const response = await Axios.get(`/categories/${propertyType}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all available property types
  getAllPropertyTypes: async () => {
    try {
      const response = await Axios.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default categoryAPI;

