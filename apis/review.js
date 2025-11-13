import Axios from '../axios';

// Review API functions
export const reviewAPI = {
  // Create a new review
  createReview: async (reviewData) => {
    try {
      const response = await Axios.post('/review', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all reviews
  getReviews: async (params = {}) => {
    try {
      const response = await Axios.get('/review', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get reviews by property ID
  getReviewsByProperty: async (propertyId) => {
    try {
      const response = await Axios.get(`/review/property/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get reviews by agent ID
  getReviewsByAgent: async (agentId, params = {}) => {
    try {
      const response = await Axios.get(`/review/agent/${agentId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Like a review
  likeReview: async (reviewId) => {
    try {
      const response = await Axios.post('/review/like', { reviewId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Dislike a review
  dislikeReview: async (reviewId) => {
    try {
      const response = await Axios.post('/review/dislike', { reviewId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Hide review from dashboard
  hideReviewFromDashboard: async (reviewId, hidden = true) => {
    try {
      const response = await Axios.patch(`/review/${reviewId}/hide-dashboard`, { hidden });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Hide review from listing
  hideReviewFromListing: async (reviewId, hidden = true) => {
    try {
      const response = await Axios.patch(`/review/${reviewId}/hide-listing`, { hidden });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default reviewAPI;