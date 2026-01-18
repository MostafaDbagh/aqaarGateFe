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
  },

  /**
   * Get conversion rates (views → inquiries → contacts)
   * @param {string} period - Time period (7d, 30d, 90d, 1y)
   * @returns {Promise<Object>} Conversion rates data
   */
  getConversionRates: async (period = '30d') => {
    try {
      const response = await axios.get(`/dashboard/conversion-rates?period=${period}`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching conversion rates:', error);
      throw error;
    }
  },

  /**
   * Get top performing properties
   * @param {number} limit - Number of properties to return
   * @param {string} sortBy - Sort by: visits, inquiries, conversion
   * @returns {Promise<Object>} Top performing properties data
   */
  getTopPerformingProperties: async (limit = 5, sortBy = 'visits') => {
    try {
      const response = await axios.get(`/dashboard/top-properties?limit=${limit}&sortBy=${sortBy}`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching top performing properties:', error);
      throw error;
    }
  },

  /**
   * Get stats comparison (current vs previous period)
   * @param {string} period - Time period (7d, 30d, 90d, 1y)
   * @returns {Promise<Object>} Stats comparison data
   */
  getStatsComparison: async (period = '30d') => {
    try {
      const response = await axios.get(`/dashboard/stats-comparison?period=${period}`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching stats comparison:', error);
      throw error;
    }
  },

  /**
   * Get health scores for listings
   * @param {number} limit - Number of listings to return
   * @returns {Promise<Object>} Health scores data
   */
  getHealthScores: async (limit = 10) => {
    try {
      const response = await axios.get(`/dashboard/health-scores?limit=${limit}`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching health scores:', error);
      throw error;
    }
  },

  /**
   * Get lead pipeline statistics
   * @param {string} period - Time period (7d, 30d, 90d, 1y)
   * @returns {Promise<Object>} Lead pipeline data
   */
  getLeadPipeline: async (period = '30d') => {
    try {
      const response = await axios.get(`/dashboard/lead-pipeline?period=${period}`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching lead pipeline:', error);
      throw error;
    }
  }
};

export default dashboardAPI;
