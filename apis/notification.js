import axios from '../axios';
import logger from '../utlis/logger';

const notificationAPI = {
  /**
   * Get all notifications for authenticated user
   * @param {Object} params - Query parameters (page, limit, type, isRead, priority)
   * @returns {Promise<Object>} Notifications with pagination
   */
  getNotifications: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`/notifications?${queryString}`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Get unread notification count
   * @returns {Promise<Object>} Unread count
   */
  getUnreadCount: async () => {
    try {
      const response = await axios.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      logger.error('Error fetching unread count:', error);
      throw error;
    }
  },

  /**
   * Mark a notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Updated notification
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await axios.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>} Update result
   */
  markAllAsRead: async () => {
    try {
      const response = await axios.patch('/notifications/read-all');
      return response.data;
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Success message
   */
  deleteNotification: async (notificationId) => {
    try {
      const response = await axios.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      logger.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Delete all read notifications
   * @returns {Promise<Object>} Delete result
   */
  deleteAllRead: async () => {
    try {
      const response = await axios.delete('/notifications/read-all');
      return response.data;
    } catch (error) {
      logger.error('Error deleting all read notifications:', error);
      throw error;
    }
  }
};

export default notificationAPI;

