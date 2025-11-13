import Axios from '../axios';

// User API functions
export const userAPI = {
  // Get user profile by ID
  getProfile: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get(`/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (userId, userData) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add all user data to FormData
      Object.keys(userData).forEach(key => {
        if (key === 'avatar' && userData[key] instanceof File) {
          formData.append('avatar', userData[key]);
        } else if (key === 'servicesAndExpertise' && Array.isArray(userData[key])) {
          // Handle array by joining with comma or appending each item
          userData[key].forEach(item => {
            formData.append('servicesAndExpertise', item);
          });
        } else if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });

      const response = await Axios.post(`/user/update/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change password
  changePassword: async (userId, oldPassword, newPassword) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.post(
        `/user/update/${userId}`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user account
  deleteAccount: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.delete(`/user/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user listings
  getUserListings: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get(`/user/${userId}/listings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userAPI;

