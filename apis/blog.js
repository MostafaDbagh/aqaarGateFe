import Axios from '../axios';

/**
 * Public blog API (published blogs only from GET /api/blog)
 */
export const blogAPI = {
  getAllBlogs: async (params = {}) => {
    try {
      const { page = 1, limit = 50, tag, category, featured, sortBy, sortOrder, search } = params;
      const queryParams = { page, limit, status: 'published' };
      if (tag) queryParams.tag = tag;
      if (category) queryParams.category = category;
      if (featured !== undefined) queryParams.featured = featured;
      if (sortBy) queryParams.sortBy = sortBy;
      if (sortOrder) queryParams.sortOrder = sortOrder;
      if (search) queryParams.search = search;

      const response = await Axios.get('/blog', {
        params: queryParams,
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBlogById: async (id) => {
    try {
      const response = await Axios.get(`/blog/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default blogAPI;
