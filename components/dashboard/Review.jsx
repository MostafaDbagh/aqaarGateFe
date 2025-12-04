"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useReviewsByAgent, useHideReviewFromDashboard, useHideReviewFromListing } from "@/apis/hooks";
import { reviewAPI } from "@/apis/review";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import LocationLoader from "../common/LocationLoader";
import Toast from "../common/Toast";
import DashboardFooter from "../common/DashboardFooter";
import styles from "./Review.module.css";

export default function Review() {
  const t = useTranslations('agent.review');
  const locale = useLocale();
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });
  
  // Track which reviews have been successfully hidden
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState(new Set());
  const [hiddenFromListing, setHiddenFromListing] = useState(new Set());

  const queryClient = useQueryClient();
  const hideFromDashboardMutation = useHideReviewFromDashboard();
  const hideFromListingMutation = useHideReviewFromListing();

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => {
      setToast({ isVisible: false, message: '', type: 'success' });
    }, 3000);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  // Check if agent is blocked
  const isAgentBlocked = user?.isBlocked === true;

  // Fetch agent's property reviews with pagination
  const { data: reviewsData, isLoading, isError } = useReviewsByAgent(
    user?._id,
    { page: currentPage, limit: itemsPerPage }
  );

  const reviews = reviewsData?.data || [];
  const stats = reviewsData?.stats || { totalReviews: 0, averageRating: 0, totalProperties: 0 };
  const pagination = reviewsData?.pagination || {};

  // Initialize hidden sets from review data (for reviews already hidden)
  useEffect(() => {
    if (reviews.length > 0) {
      const dashboardHidden = new Set();
      const listingHidden = new Set();
      
      reviews.forEach(review => {
        if (review.hiddenFromDashboard) {
          dashboardHidden.add(review._id);
        }
        if (review.hiddenFromListing) {
          listingHidden.add(review._id);
        }
      });
      
      setHiddenFromDashboard(prev => {
        const merged = new Set(prev);
        dashboardHidden.forEach(id => merged.add(id));
        return merged;
      });
      
      setHiddenFromListing(prev => {
        const merged = new Set(prev);
        listingHidden.forEach(id => merged.add(id));
        return merged;
      });
    }
  }, [reviews]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return t('recently');
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t('today');
    if (diffDays === 1) return `1 ${t('dayAgo')}`;
    if (diffDays < 7) return `${diffDays} ${t('daysAgo')}`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${t('weeksAgo')}`;
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render stars
  const renderStars = (rating = 5) => {
    return Array(rating).fill(0).map((_, index) => (
      <i key={index} className="icon-star" />
    ));
  };

  // Get avatar
  const getAvatar = (review) => {
    if (review.userId?.avatar) return review.userId.avatar;
    return '/images/default-avatar.svg'; // Default avatar
  };

  // Get reviewer name
  const getReviewerName = (review) => {
    if (review.userId?.username) return review.userId.username;
    return review.name || t('anonymous');
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (pagination.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages || 1;
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  // Handle hide review from dashboard
  const handleHideFromDashboard = async (reviewId) => {
    // Check if agent is blocked
    if (isAgentBlocked) {
      showToast(t('accountBlocked'), 'error');
      return;
    }

    try {
      await hideFromDashboardMutation.mutateAsync({ reviewId, hidden: true });
      // Mark this review as hidden from dashboard
      setHiddenFromDashboard(prev => new Set(prev).add(reviewId));
      showToast(t('reviewHiddenFromDashboard'));
    } catch (error) {
      showToast(t('failedToHide'), 'error');
    }
  };

  // Handle hide review from listing
  const handleHideFromListing = async (reviewId) => {
    // Check if agent is blocked
    if (isAgentBlocked) {
      showToast(t('accountBlocked'), 'error');
      return;
    }

    try {
      await hideFromListingMutation.mutateAsync({ reviewId, hidden: true });
      // Mark this review as hidden from listing
      setHiddenFromListing(prev => new Set(prev).add(reviewId));
      showToast(t('reviewHiddenFromListing'));
    } catch (error) {
      showToast(t('failedToHide'), 'error');
    }
  };

  const isRTL = locale === 'ar';

  return (
    <div className="main-content w-100" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="main-content-inner style-3">
        <div className="button-show-hide show-mb">
          <span className="body-1">{t('showDashboard')}</span>
        </div>

        {/* Statistics Cards */}
        {!isLoading && stats.totalReviews > 0 && (
          <div className="row mb-4">
            <div className="col-md-4">
              <div className={`card border-0 shadow-sm ${styles.statCard}`}>
                <div className={`card-body ${styles.statCardBody}`}>
                  <h3 className={`mb-2 ${styles.statNumber}`}>
                    {stats.totalReviews}
                  </h3>
                  <p className={`mb-0 ${styles.statLabel}`} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('totalReviews')}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`card border-0 shadow-sm ${styles.statCard}`}>
                <div className={`card-body ${styles.statCardBody}`}>
                  <h3 className={`mb-2 ${styles.statNumberYellow}`}>
                    {stats.averageRating.toFixed(1)} <i className={`icon-star ${styles.starIcon}`} />
                  </h3>
                  <p className={`mb-0 ${styles.statLabel}`} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('averageRating')}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`card border-0 shadow-sm ${styles.statCard}`}>
                <div className={`card-body ${styles.statCardBody}`}>
                  <h3 className={`mb-2 ${styles.statNumberGreen}`}>
                    {stats.totalProperties}
                  </h3>
                  <p className={`mb-0 ${styles.statLabel}`} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('propertiesWithReviews')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="widget-box-2 mess-box">
          <h3 className="title" style={{ textAlign: isRTL ? 'right' : 'left' }}>
            {t('myPropertyReviews')}
            {pagination.totalReviews > 0 && (
              <span className={styles.titleBadge}>
                ({pagination.totalReviews} {t('totalReviewsCount')})
              </span>
            )}
          </h3>

          {isLoading && (
            <div className={styles.loadingContainer}>
              <LocationLoader 
                size="large" 
                message={t('loadingPropertyReviews')}
              />
            </div>
          )}

          {isError && (
            <div className={styles.errorContainer} style={{ textAlign: isRTL ? 'right' : 'left' }}>
              <p>{t('failedToLoadReviews')}</p>
            </div>
          )}

          {!isLoading && !isError && reviews.length === 0 && (
            <div className={styles.emptyContainer} style={{ textAlign: isRTL ? 'right' : 'left' }}>
              <p>{t('noReviews')}</p>
            </div>
          )}

          {!isLoading && !isError && reviews.length > 0 && (
            <>
              <ul className="list-mess">
                {reviews.map((review) => (
                  <li key={review._id} className="mess-item">
                    <div className="user-box">
                      <div className="avatar">
                        <Image
                          src={getAvatar(review)}
                          alt={getReviewerName(review)}
                          width={50}
                          height={50}
                          className="rounded-circle"
                          style={{ 
                            objectFit: 'cover',
                            filter: 'brightness(0)',
                            backgroundColor: '#000'
                          }}
                          onError={(e) => {
                            e.target.src = '/images/default-avatar.svg';
                            e.target.style.filter = 'brightness(0)';
                            e.target.style.backgroundColor = '#000';
                          }}
                        />
                      </div>
                      <div className="content justify-content-start">
                        <div className="name fw-6">{getReviewerName(review)}</div>
                        <span className="caption-2 text-variant-3">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p>{review.review}</p>
                    {review.propertyId && (
                      <div className={styles.propertyInfoContainer} style={{ textAlign: isRTL ? 'right' : 'left' }}>
                        {t('property')}: <strong>{review.propertyId.propertyKeyword || 'N/A'}</strong>
                        <br />
                        <a 
                          href={`/property-detail/${review.propertyId._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.propertyLink}
                        >
                          {t('viewPropertyDetails')} ({t('propertyId')}: {review.propertyId._id})
                        </a>
                      </div>
                    )}
                    <div className="ratings">
                      {renderStars(review.rating || 5)}
                    </div>
                    <div className={styles.actionButtons} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                      <button
                        onClick={() => handleHideFromDashboard(review._id)}
                        disabled={isAgentBlocked || hiddenFromDashboard.has(review._id) || review.hiddenFromDashboard || hideFromDashboardMutation.isPending}
                        className={styles.hideButtonDashboard}
                        title={isAgentBlocked ? t('accountBlocked') : ((hiddenFromDashboard.has(review._id) || review.hiddenFromDashboard) ? t('alreadyHidden') : t('hideFromDashboard'))}
                        style={isAgentBlocked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        {hideFromDashboardMutation.isPending && !hiddenFromDashboard.has(review._id) && !review.hiddenFromDashboard ? t('hiding') : 
                         (hiddenFromDashboard.has(review._id) || review.hiddenFromDashboard) ? t('hidden') : t('hideFromDashboard')}
                      </button>
                      <button
                        onClick={() => handleHideFromListing(review._id)}
                        disabled={isAgentBlocked || hiddenFromListing.has(review._id) || review.hiddenFromListing || hideFromListingMutation.isPending}
                        className={styles.hideButtonListing}
                        title={isAgentBlocked ? t('accountBlocked') : ((hiddenFromListing.has(review._id) || review.hiddenFromListing) ? t('alreadyHidden') : t('hideFromListing'))}
                        style={isAgentBlocked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        {hideFromListingMutation.isPending && !hiddenFromListing.has(review._id) && !review.hiddenFromListing ? t('hiding') : 
                         (hiddenFromListing.has(review._id) || review.hiddenFromListing) ? t('hidden') : t('hideFromListing')}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className={styles.paginationContainer} style={{ direction: 'ltr' }}>
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevPage}
                    disabled={!pagination.hasPreviousPage}
                    className={styles.paginationNavButton}
                  >
                    « {t('previous')}
                  </button>

                  {/* Page Numbers */}
                  <div className={styles.paginationPageNumbers}>
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className={styles.paginationEllipsis}>
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageClick(page)}
                          className={`${styles.paginationPageButton} ${currentPage === page ? styles.paginationPageButtonActive : ''}`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={!pagination.hasNextPage}
                    className={styles.paginationNavButton}
                  >
                    {t('next')} »
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {/* .footer-dashboard */}
        <DashboardFooter />
        {/* .footer-dashboard */}
      </div>
      <div className="overlay-dashboard" />
      
      {/* Toast */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
}
