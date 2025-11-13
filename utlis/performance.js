/**
 * Performance optimization utilities
 */

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoize expensive calculations
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Image lazy loading utility
export const lazyLoadImage = (imgRef, src) => {
  if (imgRef.current) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            imgRef.current.src = src;
            observer.unobserve(imgRef.current);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(imgRef.current);
  }
};

// Virtual scrolling utility for large lists
export const getVisibleItems = (items, scrollTop, itemHeight, containerHeight) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  return {
    items: items.slice(startIndex, endIndex),
    startIndex,
    endIndex,
    totalHeight: items.length * itemHeight,
    offsetY: startIndex * itemHeight
  };
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

// Bundle size optimization - dynamic imports
export const loadComponent = (importFn) => {
  return React.lazy(importFn);
};

// Memory cleanup utility
export const cleanup = (refs) => {
  refs.forEach(ref => {
    if (ref.current) {
      ref.current = null;
    }
  });
};

// Optimized array operations
export const optimizedFilter = (array, predicate) => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
};

export const optimizedMap = (array, mapper) => {
  const result = new Array(array.length);
  for (let i = 0; i < array.length; i++) {
    result[i] = mapper(array[i], i, array);
  }
  return result;
};

// React Query optimization defaults
export const queryDefaults = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: 1,
  retryDelay: 1000,
};

// Component optimization helpers
export const shouldComponentUpdate = (prevProps, nextProps, keys) => {
  return keys.some(key => prevProps[key] !== nextProps[key]);
};

// Image optimization
export const getOptimizedImageUrl = (url, width, height, quality = 80) => {
  if (!url) return '/images/placeholder.jpg';
  
  // If it's a Cloudinary URL, optimize it
  if (url.includes('cloudinary.com')) {
    const baseUrl = url.split('/upload/')[0];
    const imagePath = url.split('/upload/')[1];
    return `${baseUrl}/upload/w_${width},h_${height},q_${quality},f_auto/${imagePath}`;
  }
  
  return url;
};

// Bundle analyzer helper
export const analyzeBundle = () => {
  if (typeof window !== 'undefined' && window.__NEXT_DATA__) {
    console.log('Bundle analysis:', {
      buildId: window.__NEXT_DATA__.buildId,
      runtimeConfig: window.__NEXT_DATA__.runtimeConfig,
    });
  }
};
