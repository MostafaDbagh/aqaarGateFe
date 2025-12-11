"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { favoriteAPI } from '@/apis/favorites';
import { useFavorites } from '@/components/contexts/FavoritesContext';
import { useGlobalModal } from '@/components/contexts/GlobalModalContext';
import logger from '@/utlis/logger';
import Toast from './Toast';

export default function FavoriteButton({ 
  propertyId, 
  initialIsFavorited = false,
  showLabel = true,
  className = '',
  iconClassName = 'icon-heart-1',
  onToggle = null // Callback for when favorite status changes
}) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [toast, setToast] = useState(null);
  const { showLoginModal } = useGlobalModal();
  const { incrementFavoritesCount, decrementFavoritesCount } = useFavorites();

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const pathname = usePathname();
  
  // Check if we're on a dashboard or favorites page
  const isDashboardOrFavoritesPage = pathname?.startsWith('/dashboard') || 
                                      pathname?.startsWith('/my-favorites') || 
                                      pathname?.startsWith('/my-property') ||
                                      pathname?.startsWith('/review') ||
                                      pathname?.startsWith('/messages') ||
                                      pathname?.startsWith('/property-detail');

  // Check if user is logged in and if property is favorited
  // Only check on dashboard/favorites pages or property detail pages
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      // Only check favorite status on dashboard/favorites pages or property detail pages
      // Skip on home page to avoid unnecessary API calls
      if (!isDashboardOrFavoritesPage) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const favorited = await favoriteAPI.isFavorited(propertyId);
        setIsFavorited(favorited);
      } catch (error) {
        logger.error('Error checking favorite status:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkFavoriteStatus();
  }, [propertyId, isDashboardOrFavoritesPage]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Show login modal instead of redirecting
      showLoginModal();
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await favoriteAPI.removeFavorite(propertyId);
        setIsFavorited(false);
        decrementFavoritesCount(); // Update global count
        
        // Show success message
        const message = response?.message || 'Property removed from favorites successfully!';
        showToast(message, 'success');
        
        // Call callback if provided
        if (onToggle) {
          onToggle(false);
        }
      } else {
        // Add to favorites
        const response = await favoriteAPI.addFavorite(propertyId);
        setIsFavorited(true);
        incrementFavoritesCount(); // Update global count
        
        // Show success message
        const message = response?.message || 'Property added to favorites successfully!';
        showToast(message, 'success');
        
        // Call callback if provided
        if (onToggle) {
          onToggle(true);
        }
      }
    } catch (error) {
      logger.error('Error toggling favorite:', error);
      
      // Show error message
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to update favorites. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        style={{ background: 'transparent' }}
        onClick={handleToggleFavorite}
        disabled={isLoading || isCheckingAuth}
        className={`${className || "btn-icon save hover-tooltip"} favorite-button`}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        
      >
        <svg
          className={`${iconClassName} favorite-icon ${isFavorited ? 'favorite-icon-favorited' : ''}`}
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
            stroke={isFavorited ? 'none' : '#ffffff'}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={isFavorited ? '#f1913d' : 'none'}
          />
        </svg>
        {showLabel && (
          <span className="tooltip">
            {isLoading ? 'Loading...' : isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
          </span>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <span className="favorite-loading-overlay">
            <span className="favorite-loading-spinner" />
          </span>
        )}
      </button>
      {/* Toast Notification - Rendered at root level using Portal */}
      {toast && typeof window !== 'undefined' && createPortal(
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />,
        document.body
      )}
    </>
  );
}

