import Axios from '../axios';

// Listing API functions
export const listingAPI = {
  // Get all listings (using search endpoint)
  getListings: async (params = {}) => {
    try {
      const response = await Axios.get('/listing/search', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search/filter listings
  searchListings: async (searchParams) => {
    try {
      // Convert amenities array to comma-separated string for GET request
      const params = { ...searchParams };
      if (params.amenities && Array.isArray(params.amenities) && params.amenities.length > 0) {
        params.amenities = params.amenities.join(',');
      }
      
      const response = await Axios.get('/listing/search', { params });
      // Handle both old format (array) and new format (object with data and pagination)
      if (response.data && Array.isArray(response.data)) {
        // Old format - return as is for backward compatibility
        return response.data;
      } else if (response.data && response.data.data) {
        // New format with pagination
        return response.data;
      } else {
        // Fallback
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new listing
  createListing: async (listingData) => {
    try {
      const formData = new FormData();
      
      // Add all listing data to FormData
      Object.keys(listingData).forEach(key => {
        const value = listingData[key];
        
        // Skip null or undefined values
        if (value === null || value === undefined) {
          return;
        }
        
        if (key === 'images' && Array.isArray(value)) {
          // Handle multiple image files - only append File objects
          value.forEach((image) => {
            if (image instanceof File) {
              formData.append('images', image);
            }
          });
        } else if (key === 'imageNames' && Array.isArray(value)) {
          // Handle image names
          value.forEach((name) => {
            formData.append('imageNames', name);
          });
        } else if (key === 'amenities' && Array.isArray(value)) {
          // Handle amenities array - append each item
          value.forEach((amenity) => {
            formData.append('amenities', amenity);
          });
        } else if (Array.isArray(value)) {
          // Handle other arrays
          value.forEach((item) => {
            formData.append(key, item);
          });
        } else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
          // Handle objects - stringify them
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'boolean') {
          // Handle booleans - convert to string
          formData.append(key, value.toString());
        } else {
          // Handle primitives (string, number)
          formData.append(key, value);
        }
      });

      // Don't set Content-Type header - let axios set it automatically with boundary
      const response = await Axios.post('/listing/create', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get listing by ID
  getListingById: async (id) => {
    try {
      const response = await Axios.get(`/listing/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get listing images
  getListingImages: async (id) => {
    try {
      const response = await Axios.get(`/listing/${id}/images`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update listing
  updateListing: async (id, listingData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.post(`/listing/update/${id}`, listingData, {
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

  // Update listing images (add new and/or delete existing)
  updateListingImages: async (id, formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.post(`/listing/update/${id}/images`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete listing (soft delete with reason)
  deleteListing: async (id, deletedReason = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.delete(`/listing/delete/${id}`, {
        data: { deletedReason },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      // Preserve the full error object so the caller can access response, status, etc.
      if (error.response) {
        // If it's an HTTP error response, throw the full error
        throw error;
      } else {
        // If it's a network error or other error, create a structured error
        const customError = new Error(error.message || 'Failed to delete property');
        customError.originalError = error;
        throw customError;
      }
    }
  },

  // Get listings by agent with pagination and filtering
  getListingsByAgent: async (agentId, params = {}) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Only add Authorization header if token exists (for authenticated requests)
      // Public pages (like agents-details) should work without token
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await Axios.get(`/listing/agent/${agentId}`, {
        params,
        headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get state count statistics
  getStateCount: async () => {
    try {
      const response = await Axios.get('/listing/stateCount');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Increment visit count for a listing
  incrementVisitCount: async (id) => {
    try {
      const response = await Axios.post(`/listing/${id}/visit`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get most visited listings by agent
  getMostVisitedListings: async (agentId, params = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get(`/listing/agent/${agentId}/mostVisited`, {
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

  // AI-powered natural language search
  aiSearchProperties: async (query, params = {}) => {
    try {
      const response = await Axios.post('/listing/ai-search', 
        { query },
        { 
          params: {
            page: params.page || 1,
            limit: params.limit || 12
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Export properties to CSV
   * @returns {Promise<Blob>} CSV file blob
   */
  exportProperties: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get('/listing/export', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Important for file downloads
        validateStatus: (status) => status < 500 // Accept 4xx as errors to parse JSON
      });
      
      // Check if response is successful (200-299)
      if (response.status >= 200 && response.status < 300) {
        // Check if it's actually a blob
        if (response.data instanceof Blob) {
          return response.data;
        }
      }
      
      // If status is error (4xx), try to parse error message from blob
      if (response.status >= 400) {
        try {
          const text = await new Response(response.data).text();
          const errorData = JSON.parse(text);
          throw errorData;
        } catch (parseError) {
          throw { message: 'Failed to export properties', error: 'Export failed' };
        }
      }
      
      return response.data;
    } catch (error) {
      // Handle axios errors
      if (error.response) {
        // Try to parse blob error response
        if (error.response.data instanceof Blob) {
          try {
            const text = await new Response(error.response.data).text();
            const errorData = JSON.parse(text);
            throw errorData;
          } catch (parseError) {
            throw { 
              message: error.response.statusText || 'Export failed', 
              error: 'Failed to export properties' 
            };
          }
        }
        // If already JSON error
        throw error.response.data || { 
          message: error.response.statusText || 'Export failed', 
          error: 'Failed to export properties' 
        };
      }
      // Network or other errors
      throw { 
        message: error.message || 'Export failed', 
        error: 'Failed to export properties' 
      };
    }
  },

  /**
   * Import properties from CSV file
   * @param {File} file - CSV file to import
   * @returns {Promise<Object>} Import results
   */
  importProperties: async (file) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await Axios.post('/listing/import', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default listingAPI;