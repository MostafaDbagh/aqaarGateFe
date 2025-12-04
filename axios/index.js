import axios from 'axios'
import { getCSRFToken, generateCSRFToken, rateLimiter } from '@/utils/security'
import logger from '@/utlis/logger'

const localhost = 'http://localhost:5500/api'
const render ='https://aqaargatebe2.onrender.com/api'

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return localhost;
    }
  }

  return process.env.NEXT_PUBLIC_API_URL || render;
};

export const Axios = axios.create({
  baseURL: '/api', // Will be overridden by interceptor
  timeout: 30000, // Request timeout in milliseconds (increased to 30 seconds)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials (cookies) in CORS requests
})

// Request interceptor to set baseURL dynamically and add auth token
Axios.interceptors.request.use(
  (config) => {
    // Set baseURL dynamically based on environment
    config.baseURL = getBaseURL();
    
    // Get current locale - check sessionStorage first (set by LanguageSwitcher), then pathname
    if (typeof window !== 'undefined') {
      let locale = 'en'; // Default to 'en'
      
      // First, check sessionStorage (set immediately when language changes)
      let storedLocale = sessionStorage.getItem('currentLocale');
      
      // If no stored locale, read from pathname and store it
      if (!storedLocale || (storedLocale !== 'ar' && storedLocale !== 'en')) {
        const pathname = window.location.pathname;
        
        // Check pathname - must check /ar/ FIRST before /en/ to avoid false matches
        if (pathname.startsWith('/ar/') || pathname === '/ar') {
          locale = 'ar';
          sessionStorage.setItem('currentLocale', 'ar');
        } else if (pathname.startsWith('/en/') || pathname === '/en') {
          locale = 'en';
          sessionStorage.setItem('currentLocale', 'en');
        } else {
          // No locale in pathname, default to 'en'
          sessionStorage.setItem('currentLocale', 'en');
        }
      } else {
        // Use stored locale
        locale = storedLocale;
        
        // Verify it matches pathname (in case user navigated directly)
        const pathname = window.location.pathname;
        const pathLocale = pathname.startsWith('/ar/') || pathname === '/ar' ? 'ar' : 
                          pathname.startsWith('/en/') || pathname === '/en' ? 'en' : null;
        
        // If pathname has a different locale, update sessionStorage
        if (pathLocale && pathLocale !== locale) {
          locale = pathLocale;
          sessionStorage.setItem('currentLocale', pathLocale);
        }
      }
      
      // Add Accept-Language header for i18n backend support
      config.headers['Accept-Language'] = locale;
    } else {
      // Server-side: default to English
      config.headers['Accept-Language'] = 'en';
    }
    
    // Rate limiting check (client-side protection)
    if (typeof window !== 'undefined') {
      const userIdentifier = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user')).email || 'anonymous'
        : 'anonymous';
      
      if (!rateLimiter.check(userIdentifier, 30, 60000)) { // 30 requests per minute
        return Promise.reject(new Error('Too many requests. Please try again later.'));
      }
    }
    
    // Get token from localStorage or cookies
    const token = localStorage.getItem('token') || 
                  document.cookie
                    .split('; ')
                    .find(row => row.startsWith('token='))
                    ?.split('=')[1];
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method?.toUpperCase())) {
      let csrfToken = getCSRFToken();
      if (!csrfToken) {
        csrfToken = generateCSRFToken();
      }
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
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

// Response interceptor to handle auth errors and CORS issues
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle CORS errors
    if (!error.response && error.message && (
      error.message.includes('Network Error') || 
      error.message.includes('CORS') ||
      error.message.includes('Failed to fetch')
    )) {
      logger.error('[CORS Error]', {
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method
      });
      
      // Return a more descriptive error
      return Promise.reject({
        ...error,
        isCorsError: true,
        message: 'Network error: Unable to connect to the server. Please check your internet connection and try again.',
      });
    }
    
    // Only redirect to login for specific authentication endpoints
    // Don't redirect for listing operations to avoid disrupting user workflow
    // IMPORTANT: Don't redirect on 401 for /auth/signin - let the Login modal handle the error
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      
      // Only redirect to login for auth-related endpoints EXCEPT signin
      // Signin errors should be handled by the Login modal component
      if ((url.includes('/auth/') || url.includes('/login') || url.includes('/register')) 
          && !url.includes('/auth/signin')) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Redirect to home page
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    }
    
    // Handle CORS-related status codes
    if (error.response?.status === 0 || error.response?.status === 403) {
      const url = error.config?.url || '';
      if (url && !url.includes('/auth/')) {
        logger.warn('[CORS Warning]', {
          status: error.response?.status,
          url: error.config?.url,
          origin: typeof window !== 'undefined' ? window.location.origin : 'unknown'
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default Axios;

