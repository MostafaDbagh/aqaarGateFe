import Axios from '../axios';

// Public career API (published careers only)
export const careerAPI = {
  getAllCareers: async (params = {}) => {
    try {
      const { _: _cacheBuster, ...queryParams } = params;
      const response = await Axios.get('/career', {
        params: queryParams,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCareerById: async (id) => {
    try {
      const response = await Axios.get(`/career/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default careerAPI;
