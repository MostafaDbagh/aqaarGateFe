"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
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

    // If user is authorized, allow access
    // For admin routes, check if user is admin
    if (requiredRole === 'admin') {
      if (userRole === 'admin') {
        return; // Admin is authorized
      } else {
        // Not admin, redirect to home
        router.push('/');
        return;
      }
    }
    
    if (isAuthorized) {
      return;
    }

    // Save the attempted URL for redirect after login/registration
    saveAttemptedUrl(pathname);

    // Handle unauthorized access
    if (userRole === 'guest') {
      if (isGuestBlocked) {
        // Redirect to home and show register modal
        router.push('/');
        setTimeout(() => {
          showModal('register');
        }, 100);
        return;
      }
    } else if (userRole === 'user') {
      if (isAgentRoute || isAdminRoute) {
        // Redirect to home and show become agent modal
        router.push('/');
        setTimeout(() => {
          showModal('becomeAgent');
        }, 100);
        return;
      }
    } else if (userRole === 'agent') {
      if (isAdminRoute) {
        // Agent trying to access admin routes
        router.push('/');
        return;
      }
    }

    // If no specific case matches, redirect to home
    router.push('/');
  }, [isLoading, pathname, user, showModal, router, checkRouteAccess, saveAttemptedUrl]);

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
  
  if (!routeCheck.isAuthorized) {
    return null; // Component will redirect, so return null
  }

  return children;
};

export default RouteGuard;
