import Axios from '../axios';

const normalizeId = (value) => {
  if (!value) return value;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (typeof value._id === 'string') {
      return value._id;
    }
    if (Array.isArray(value)) {
      return value[0]?._id || value[0] || value;
    }
  }
  return value;
};

export const messageAPI = {
  // Get messages for a specific agent with filtering and pagination
  getMessagesByAgent: async (agentId, params = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get(`/message/agent/${agentId}`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single message by ID
  getMessageById: async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get(`/message/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new message (for contact forms)
  createMessage: async (messageData) => {
    try {
      const payload = {
        ...messageData,
        agentId: normalizeId(messageData.agentId),
        propertyId: normalizeId(messageData.propertyId),
      };

      const response = await Axios.post('/message/', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.patch(`/message/${messageId}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reply to a message
  replyToMessage: async (messageId, response) => {
    try {
      const token = localStorage.getItem('token');
      const responseData = await Axios.patch(`/message/${messageId}/reply`, { response }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return responseData.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Archive a message
  archiveMessage: async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.patch(`/message/${messageId}/archive`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.delete(`/message/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
