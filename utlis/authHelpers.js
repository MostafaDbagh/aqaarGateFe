import logger from './logger';

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  // Check for token in localStorage or cookies
  const token = localStorage.getItem('token') || 
                document.cookie
                  .split('; ')
                  .find(row => row.startsWith('token='))
                  ?.split('=')[1];
  
  return !!token;
};

/**
 * Get current user data from localStorage
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    logger.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Check if current user is an agent
 * @returns {boolean} True if user is an agent
 */
export const isAgent = () => {
  const user = getCurrentUser();
  return user?.role === 'agent';
};

/**
 * Check if user can access dashboard
 * @returns {boolean} True if user can access dashboard features
 */
export const canAccessDashboard = () => {
  return isAuthenticated() && isAgent();
};

/**
 * Get user display name
 * @returns {string} User's name or default
 */
export const getUserDisplayName = () => {
  const user = getCurrentUser();
  return user?.username || user?.name || 'Guest';
};

/**
 * Logout user
 */
export const logout = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Redirect to home
  window.location.href = '/';
};

