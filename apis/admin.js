import Axios from '../axios';

export const adminAPI = {
  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const response = await Axios.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Properties
  getAllProperties: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.approvalStatus) params.append('approvalStatus', filters.approvalStatus);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.city) params.append('city', filters.city);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const queryString = params.toString();
      const url = `/admin/properties${queryString ? `?${queryString}` : ''}`;
      const response = await Axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updatePropertyApproval: async (id, approvalStatus, notes) => {
    try {
      const response = await Axios.put(`/admin/properties/${id}/approval`, {
        approvalStatus,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteProperty: async (id) => {
    try {
      const response = await Axios.delete(`/admin/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Contacts
  getAllContacts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.interest) params.append('interest', filters.interest);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const queryString = params.toString();
      const url = `/admin/contacts${queryString ? `?${queryString}` : ''}`;
      const response = await Axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteContact: async (id) => {
    try {
      const response = await Axios.delete(`/admin/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Rental Services
  getAllRentalServices: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.ownerEmail) params.append('ownerEmail', filters.ownerEmail);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const queryString = params.toString();
      const url = `/admin/rental-services${queryString ? `?${queryString}` : ''}`;
      const response = await Axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateRentalService: async (id, updateData) => {
    try {
      const response = await Axios.put(`/admin/rental-services/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteRentalService: async (id) => {
    try {
      const response = await Axios.delete(`/admin/rental-services/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Agents
  getAllAgents: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.isBlocked !== undefined && filters.isBlocked !== '') {
        params.append('isBlocked', filters.isBlocked);
      }
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const queryString = params.toString();
      const url = `/admin/agents${queryString ? `?${queryString}` : ''}`;
      const response = await Axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  blockAgent: async (id, reason) => {
    try {
      const response = await Axios.put(`/admin/agents/${id}/block`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  unblockAgent: async (id) => {
    try {
      const response = await Axios.put(`/admin/agents/${id}/unblock`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default adminAPI;
