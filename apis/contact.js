import Axios from '../axios';

// Contact API functions
export const contactAPI = {
  // Create a new contact
  createContact: async (contactData) => {
    try {
      const response = await Axios.post('/contacts/contact', contactData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all contacts
  getContacts: async (params = {}) => {
    try {
      const response = await Axios.get('/contacts', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get contact by ID
  getContact: async (id) => {
    try {
      const response = await Axios.get(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete contact
  deleteContact: async (id) => {
    try {
      const response = await Axios.delete(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default contactAPI;