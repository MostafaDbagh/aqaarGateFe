/**
 * Security Utilities
 * Protection against XSS, CSRF, and input validation
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes dangerous HTML tags and attributes
 */
export const sanitizeHTML = (html) => {
  if (!html || typeof html !== 'string') return '';
  
  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:text\/html/gi, '') // Remove data URIs
    .trim();
};

/**
 * Sanitize user input (text fields)
 * Removes potentially dangerous characters
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

/**
 * Escape HTML entities to prevent XSS
 */
export const escapeHTML = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return str.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate URL format
 */
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * Generate CSRF token
 */
export const generateCSRFToken = () => {
  if (typeof window === 'undefined') return null;
  
  // Generate random token
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  
  // Store in sessionStorage (cleared when tab closes)
  sessionStorage.setItem('csrf-token', token);
  return token;
};

/**
 * Get CSRF token from sessionStorage
 */
export const getCSRFToken = () => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('csrf-token');
};

/**
 * Validate CSRF token
 */
export const validateCSRFToken = (token) => {
  if (typeof window === 'undefined') return false;
  const storedToken = sessionStorage.getItem('csrf-token');
  return storedToken && storedToken === token;
};

/**
 * Rate limiting helper (client-side)
 * Note: Real rate limiting should be implemented on the backend
 */
export const rateLimiter = {
  requests: new Map(),
  
  check(identifier, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const key = identifier;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    const record = this.requests.get(key);
    
    // Reset if window expired
    if (now > record.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    // Check if limit exceeded
    if (record.count >= maxRequests) {
      return false;
    }
    
    // Increment count
    record.count++;
    return true;
  },
  
  reset(identifier) {
    this.requests.delete(identifier);
  },
  
  // Clean up old entries periodically
  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
};

// Cleanup old rate limit entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    rateLimiter.cleanup();
  }, 5 * 60 * 1000);
}

/**
 * Validate file upload
 */
export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxFiles = 10
  } = options;
  
  if (!file) return { valid: false, error: 'No file provided' };
  
  // Check file size
  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not allowed` };
  }
  
  // Check file name for dangerous characters
  if (/[<>:"/\\|?*]/.test(file.name)) {
    return { valid: false, error: 'Invalid file name' };
  }
  
  return { valid: true };
};

/**
 * Sanitize object recursively
 */
export const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      // Sanitize key
      const safeKey = sanitizeInput(key);
      // Sanitize value
      sanitized[safeKey] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
};

