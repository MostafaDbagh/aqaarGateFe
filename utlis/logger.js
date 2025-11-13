// Frontend logger utility
// Only logs in development, never in production

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = {
  info: (...args) => { if (isDevelopment) { console.log(...args); } },
  debug: (...args) => { if (isDevelopment) { console.log('[DEBUG]', ...args); } },
  error: (...args) => { console.error('[ERROR]', ...args); }, // Always log errors
  warn: (...args) => { if (isDevelopment) { console.warn('[WARN]', ...args); } },
  success: (...args) => { if (isDevelopment) { console.log('✅', ...args); } },
};

export default logger;

