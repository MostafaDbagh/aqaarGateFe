"use client";
import { useEffect } from 'react';
import { usePathname } from '@/i18n/routing';
import useRouteProtection from '@/hooks/useRouteProtection';
import { useGlobalModal } from '@/components/contexts/GlobalModalContext';
import LocationLoader from '@/components/common/LocationLoader';

const RouteGuard = ({ children, requiredRole = null }) => {
  const pathname = usePathname();
  const { 
    user, 
    isLoading, 
    checkRouteAccess, 
    saveAttemptedUrl, 
    router 
  } = useRouteProtection(requiredRole);
  
  const { showModal } = useGlobalModal();

  useEffect(() => {
    if (isLoading) return;

    const routeCheck = checkRouteAccess(pathname, requiredRole);
    const { userRole, requiredAccess, isAuthorized, isAdminRoute, isAgentRoute, isUserRoute, isGuestBlocked } = routeCheck;

    // Helper function to redirect
    const redirectToHome = () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    };

    // If user is authorized, allow access
    // For admin routes, check if user is admin
    if (requiredRole === 'admin') {
      if (userRole === 'admin') {
        return; // Admin is authorized
      } else {
        // Not admin, redirect to home
        redirectToHome();
        return;
      }
    }
    
    // For user routes, check if user is logged in as regular user (not guest or agent)
    if (requiredRole === 'user') {
      if (userRole === 'guest') {
        // Guest trying to access user route
        // Check if we're already on home page - if so, just show login modal without redirect
        const isOnHomePage = pathname === '/' || pathname === '/en' || pathname === '/ar' || 
                           pathname === '/en/' || pathname === '/ar/' ||
                           pathname?.replace(/^\/(en|ar)/, '') === '/' ||
                           pathname?.replace(/^\/(en|ar)/, '') === '';
        
        if (!isOnHomePage) {
          // Not on home page, redirect to home first
          redirectToHome();
          setTimeout(() => {
            showModal('login');
          }, 100);
        } else {
          // Already on home page, just show login modal
          showModal('login');
        }
        return;
      } else if (userRole === 'agent') {
        // Agent trying to access user-only route, redirect to home
        redirectToHome();
        return;
      } else if (userRole === 'user' || userRole === 'admin') {
        // User or admin can access user routes - allow access
        return;
      }
      // If we reach here, something is wrong, but don't redirect
      return;
    }
    
    // If requiredRole is not specified, use the route check logic
    if (isAuthorized) {
      return;
    }

    // Save the attempted URL for redirect after login/registration
    saveAttemptedUrl(pathname);

    // Handle unauthorized access
    if (userRole === 'guest') {
      if (isGuestBlocked) {
        // Redirect to home and show register modal
        redirectToHome();
        setTimeout(() => {
          showModal('register');
        }, 100);
        return;
      }
    } else if (userRole === 'user') {
      if (isAgentRoute || isAdminRoute) {
        // Redirect to home and show become agent modal
        redirectToHome();
        setTimeout(() => {
          showModal('becomeAgent');
        }, 100);
        return;
      }
    } else if (userRole === 'agent') {
      if (isAdminRoute) {
        // Agent trying to access admin routes
        redirectToHome();
        return;
      }
    }

    // Only redirect if user is not authorized and route is blocked
    if (!isAuthorized && isGuestBlocked) {
      redirectToHome();
    }
  }, [isLoading, pathname, user, showModal, checkRouteAccess, saveAttemptedUrl, requiredRole]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <LocationLoader 
          size="large" 
          message="Checking access permissions..." 
        />
      </div>
    );
  }

  // Check if user has access to current route
  const routeCheck = checkRouteAccess(pathname, requiredRole);
  
  // Special handling for admin routes
  if (requiredRole === 'admin') {
    if (routeCheck.userRole !== 'admin') {
      return null; // Not admin, will redirect
    }
    // Admin is authorized, show children
    return children;
  }
  
  // Special handling for user routes (only regular users, not guests or agents)
  if (requiredRole === 'user') {
    if (routeCheck.userRole === 'guest') {
      return null; // Guest, will redirect
    }
    if (routeCheck.userRole === 'agent') {
      return null; // Agent, will redirect
    }
    // User or admin can access user routes
    return children;
  }
  
  if (!routeCheck.isAuthorized) {
    return null; // Component will redirect, so return null
  }

  return children;
};

export default RouteGuard;
