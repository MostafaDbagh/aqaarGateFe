import Axios from '../axios';
import logger from '../utlis/logger';

// Favorite API functions
export const favoriteAPI = {
  // Add property to favorites
  addFavorite: async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await Axios.post('/favorites', { propertyId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      // Extract error message from response
      const errorData = error.response?.data;
      if (errorData?.message) {
        throw { message: errorData.message, error: errorData.error, response: error.response };
      }
      throw { message: error.message || 'Failed to add favorite', error: error.message, response: error.response };
    }
  },

  // Remove property from favorites
  removeFavorite: async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await Axios.delete(`/favorites/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      // Extract error message from response
      const errorData = error.response?.data;
      if (errorData?.message) {
        throw { message: errorData.message, error: errorData.error, response: error.response };
      }
      throw { message: error.message || 'Failed to remove favorite', error: error.message, response: error.response };
    }
  },

  // Get user's favorite properties
  getFavorites: async (params = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get('/favorites', {
        params, // Pass pagination parameters
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      // Extract error message from response
      const errorData = error.response?.data;
      if (errorData?.message) {
        throw { message: errorData.message, error: errorData.error, response: error.response };
      }
      throw { message: error.message || 'Failed to add favorite', error: error.message, response: error.response };
    }
  },

  // Check if property is favorited
  isFavorited: async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }
      
      const response = await Axios.get(`/favorites/check/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data?.isFavorited || false;
    } catch (error) {
      // Don't log error for unauthenticated users
      if (error.response?.status !== 401) {
        logger.error('Error checking if favorited:', error);
      }
      return false;
    }
  },

  // Toggle favorite status
  toggleFavorite: async (propertyId) => {
    try {
      const isFavorited = await favoriteAPI.isFavorited(propertyId);
      
      if (isFavorited) {
        return await favoriteAPI.removeFavorite(propertyId);
      } else {
        return await favoriteAPI.addFavorite(propertyId);
      }
    } catch (error) {
      // Extract error message from response
      const errorData = error.response?.data;
      if (errorData?.message) {
        throw { message: errorData.message, error: errorData.error, response: error.response };
      }
      throw { message: error.message || 'Failed to add favorite', error: error.message, response: error.response };
    }
  }
};

export default favoriteAPI;
