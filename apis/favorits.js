// services/favoriteApi.js
import { Axios } from './AxiosInstance'; // Update the path if needed

// Add a property to favorites
export const addFavorite = async (data) => {
  const response = await Axios.post('favorite', data);
  return response.data;
};

// Remove a property from favorites by propertyId
export const removeFavorite = async (propertyId) => {
  const response = await Axios.delete(`favorite/${propertyId}`);
  return response.data;
};

// Get all favorites for the logged-in user
export const getFavorites = async () => {
  const response = await Axios.get('favorite');
  return response.data;
};
