import Axios from '../axios';

// Property Rental API functions
export const propertyRentalAPI = {
  // Create a new property rental service request
  createPropertyRentalRequest: async (requestData) => {
    try {
      const response = await Axios.post('/property-rental', requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all property rental requests (with optional filters and pagination)
  getAllPropertyRentalRequests: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.ownerEmail) params.append('ownerEmail', filters.ownerEmail);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const queryString = params.toString();
      const url = `/property-rental${queryString ? `?${queryString}` : ''}`;
      const response = await Axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single property rental request by ID
  getPropertyRentalRequestById: async (id) => {
    try {
      const response = await Axios.get(`/property-rental/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a property rental request
  updatePropertyRentalRequest: async (id, updateData) => {
    try {
      const response = await Axios.put(`/property-rental/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a property rental request
  deletePropertyRentalRequest: async (id) => {
    try {
      const response = await Axios.delete(`/property-rental/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default propertyRentalAPI;

