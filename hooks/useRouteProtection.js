import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import logger from '@/utlis/logger';

const useRouteProtection = (requiredRole = null) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attemptedUrl, setAttemptedUrl] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      try {
        // Check if we're in browser environment
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!storedUser || !token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        logger.error('Error parsing user data:', error);
        setUser(null);
        setIsLoading(false);
      }
    };

    checkUser();
    
    // Safety timeout - ensure loading state is cleared after max 2 seconds
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Also listen for storage changes
    const handleStorageChange = () => checkUser();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }
    
    return () => {
      clearTimeout(timeoutId);
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, []);

  const getUserRole = () => {
    if (!user) return 'guest';
    return user.role || 'user'; // Default to 'user' if no role specified
  };

  const isAuthorized = (requiredRole) => {
    const userRole = getUserRole();
    
    // Admin can access everything
    if (userRole === 'admin') return true;
    
    // Agent can access agent routes
    if (userRole === 'agent' && requiredRole !== 'admin') return true;
    
    // User can access user routes
    if (userRole === 'user' && requiredRole === 'user') return true;
    
    // Guest can only access public routes
    if (userRole === 'guest' && !requiredRole) return true;
    
    return false;
  };

  const checkRouteAccess = (pathname, requiredRole = null) => {
    const userRole = getUserRole();
    
    // usePathname from @/i18n/routing returns path WITHOUT locale prefix
    // But we need to handle both cases: with and without prefix
    let pathWithoutLocale = pathname || '';
    
    // Remove locale prefix if present (e.g., /en/future-buyer-interest -> /future-buyer-interest)
    if (pathWithoutLocale.startsWith('/en/') || pathWithoutLocale.startsWith('/ar/')) {
      pathWithoutLocale = pathWithoutLocale.replace(/^\/(en|ar)/, '');
    }
    
    // Ensure path starts with /
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale;
    }
    
    const normalizedPath = pathWithoutLocale === '/' ? '/' : pathWithoutLocale;
    
    // Define route categories
    const adminRoutes = [
      '/admin'
    ];
    
    const agentRoutes = [
      '/dashboard',
      '/add-property', 
      '/my-properties',
      '/my-property',
      '/messages',
      '/review'
    ];
    
    const userRoutes = [
      '/my-favorites',
      '/my-package', 
      '/my-profile',
      '/future-buyer-interest',
      '/property-rental-service'
    ];
    
    const guestBlockedRoutes = [
      '/add-property',
      '/my-properties', 
      '/my-property',
      '/dashboard',
      '/my-profile',
      '/my-favorites',
      '/messages',
      '/review',
      '/admin',
      '/future-buyer-interest',
      '/property-rental-service'
    ];

    // Check if current path is an admin route
    const isAdminRoute = adminRoutes.some(route => 
      normalizedPath.startsWith(route)
    );
    
    // Check if current path is an agent route
    const isAgentRoute = agentRoutes.some(route => 
      normalizedPath.startsWith(route)
    );
    
    // Check if current path is a user route
    const isUserRoute = userRoutes.some(route => 
      normalizedPath.startsWith(route)
    );
    
    // Check if current path is blocked for guests
    const isGuestBlocked = guestBlockedRoutes.some(route => 
      normalizedPath.startsWith(route)
    );

    // Determine access level needed
    // If requiredRole is passed (from RouteGuard), use it
    // Otherwise, determine from pathname
    let requiredAccess = requiredRole;
    if (!requiredAccess) {
      if (isAdminRoute) requiredAccess = 'admin';
      else if (isAgentRoute) requiredAccess = 'agent';
      else if (isUserRoute) requiredAccess = 'user';
      else if (isGuestBlocked) requiredAccess = 'user';
    }

    return {
      userRole,
      requiredAccess,
      isAuthorized: isAuthorized(requiredAccess),
      isAdminRoute,
      isAgentRoute,
      isUserRoute,
      isGuestBlocked
    };
  };

  const saveAttemptedUrl = (url) => {
    setAttemptedUrl(url);
    localStorage.setItem('attemptedUrl', url);
  };

  const getAttemptedUrl = () => {
    return attemptedUrl || localStorage.getItem('attemptedUrl');
  };

  const clearAttemptedUrl = () => {
    setAttemptedUrl(null);
    localStorage.removeItem('attemptedUrl');
  };

  return {
    user,
    isLoading,
    getUserRole,
    isAuthorized,
    checkRouteAccess,
    saveAttemptedUrl,
    getAttemptedUrl,
    clearAttemptedUrl,
    router
  };
};

export default useRouteProtection;
