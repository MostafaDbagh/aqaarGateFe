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

  getPropertiesByAdmin: async (filters = {}) => {
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
      const url = `/admin/properties-by-admin${queryString ? `?${queryString}` : ''}`;
      const response = await Axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  exportAdminProperties: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get('/admin/properties-by-admin/export', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Important for file downloads
      });
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
      const errorData = error.response?.data;
      if (errorData?.message) {
        throw new Error(errorData.message);
      }
      throw error.response?.data || error.message;
    }
  },

  deleteProperty: async (id, deletedReason = '') => {
    try {
      const response = await Axios.delete(`/admin/properties/${id}`, {
        data: { deletedReason }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Sold Properties
  getSoldProperties: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.city) params.append('city', filters.city);
      if (filters.agentId) params.append('agentId', filters.agentId);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const queryString = params.toString();
      const url = `/admin/sold-properties${queryString ? `?${queryString}` : ''}`;
      const response = await Axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateSoldPropertyCharges: async (id, soldCharges) => {
    try {
      const response = await Axios.put(`/admin/sold-properties/${id}/charges`, {
        soldCharges
      });
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.message) {
        throw new Error(errorData.message);
      }
      throw error.response?.data || error.message;
    }
  },

  // Deleted Properties
  getDeletedProperties: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.city) params.append('city', filters.city);
      if (filters.agentId) params.append('agentId', filters.agentId);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const queryString = params.toString();
      const url = `/admin/deleted-properties${queryString ? `?${queryString}` : ''}`;
      const response = await Axios.get(url);
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

  // Users
  getAllUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.isBlocked !== undefined && filters.isBlocked !== '') {
        params.append('isBlocked', filters.isBlocked);
      }
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const queryString = params.toString();
      const url = `/admin/users${queryString ? `?${queryString}` : ''}`;
      const response = await Axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await Axios.delete(`/admin/users/${id}`);
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
  },

  deleteAgent: async (id) => {
    try {
      const response = await Axios.delete(`/admin/agents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Careers
  getAllCareers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const queryString = params.toString();
      const url = `/admin/careers${queryString ? `?${queryString}` : ''}`;
      const response = await Axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createCareer: async (careerData) => {
    try {
      const response = await Axios.post('/admin/careers', careerData);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.message) {
        throw new Error(errorData.message);
      }
      throw error.response?.data || error.message;
    }
  },

  updateCareer: async (id, careerData) => {
    try {
      const response = await Axios.put(`/admin/careers/${id}`, careerData);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.message) {
        throw new Error(errorData.message);
      }
      throw error.response?.data || error.message;
    }
  },

  deleteCareer: async (id) => {
    try {
      const response = await Axios.delete(`/admin/careers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default adminAPI;
