import axios from 'axios'
const localhost = 'http://localhost:5500/api'
const heroku = 'https://proty-api-mostafa-56627d8ca9aa.herokuapp.com/api'

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return localhost;
    }
  }

  return process.env.NEXT_PUBLIC_API_URL || heroku;
};

export const Axios = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // Request timeout in milliseconds (increased to 30 seconds)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
Axios.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const token = localStorage.getItem('token') || 
                  document.cookie
                    .split('; ')
                    .find(row => row.startsWith('token='))
                    ?.split('=')[1];
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If sending FormData, remove Content-Type header to let axios set it automatically with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only redirect to login for specific authentication endpoints
    // Don't redirect for listing operations to avoid disrupting user workflow
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      
      // Only redirect to login for auth-related endpoints
      if (url.includes('/auth/') || url.includes('/login') || url.includes('/register')) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Redirect to home page
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default Axios;

