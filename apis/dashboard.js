import axios from '../axios';
import logger from '../utlis/logger';

const dashboardAPI = {
  /**
   * Get comprehensive dashboard statistics
   * @returns {Promise<Object>} Dashboard stats including balance, listings, favorites, reviews, messages
   */
  getDashboardStats: async () => {
    try {
      const response = await axios.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      logger.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get detailed dashboard analytics with charts data
   * @param {string} period - Time period for analytics (7d, 30d, 90d, 1y)
   * @returns {Promise<Object>} Analytics data with charts, trends, and performance metrics
   */
  getDashboardAnalytics: async (period = '30d') => {
    try {
      const response = await axios.get(`/dashboard/analytics?period=${period}`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  },

  /**
   * Get dashboard notifications and alerts
   * @returns {Promise<Object>} Notifications including unread messages, pending listings, alerts
   */
  getDashboardNotifications: async () => {
    try {
      const response = await axios.get('/dashboard/notifications');
      return response.data;
    } catch (error) {
      logger.error('Error fetching dashboard notifications:', error);
      throw error;
    }
  },

  /**
   * Get dashboard health status
   * @returns {Promise<Object>} Health status of dashboard services
   */
  getDashboardHealth: async () => {
    try {
      const response = await axios.get('/dashboard/health');
      return response.data;
    } catch (error) {
      logger.error('Error fetching dashboard health:', error);
      throw error;
    }
  }
};

export default dashboardAPI;
