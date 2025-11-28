"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useReviewsByAgent, useHideReviewFromDashboard, useHideReviewFromListing } from "@/apis/hooks";
import { reviewAPI } from "@/apis/review";
import { listingAPI } from "@/apis/listing";
import { useQueryClient } from "@tanstack/react-query";
import LocationLoader from "../common/LocationLoader";
import Toast from "../common/Toast";
import DashboardFooter from "../common/DashboardFooter";
import styles from "../dashboard/Review.module.css";

/**
 * AdminReviews Component
 * 
 * Displays reviews for properties added by admin (agent = 'admin@aqaargate.com')
 * Uses the same design and style as the agent Review component
 */
export default function AdminReviews() {
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

  // Add classes to remove padding-left and padding-top for admin reviews page
  useEffect(() => {
    const mainContent = document.querySelector('.page-layout .main-content');
    const mainContentInner = document.querySelector('.page-layout .main-content-inner');
    
    if (mainContent) {
      mainContent.classList.add('admin-reviews-page');
    }
    if (mainContentInner) {
      mainContentInner.classList.add('admin-reviews-page-inner');
    }
    
    return () => {
      if (mainContent) {
        mainContent.classList.remove('admin-reviews-page');
      }
      if (mainContentInner) {
        mainContentInner.classList.remove('admin-reviews-page-inner');
      }
    };
  }, []);

  // Fetch admin's property reviews with pagination
  // Filter: only reviews for properties where agent = 'admin@aqaargate.com'
  const { data: reviewsData, isLoading, isError } = useReviewsByAgent(
    user?._id,
    { page: currentPage, limit: itemsPerPage }
  );

  // Filter reviews to only show those for admin properties
  // Use useMemo to prevent unnecessary re-renders
  const allReviews = useMemo(() => reviewsData?.data || [], [reviewsData?.data]);
  
  // Filter reviews for admin properties only (agent = 'admin@aqaargate.com')
  // We need to fetch property details to check agent field
  const [adminReviews, setAdminReviews] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const lastProcessedDataRef = useRef(null);

  useEffect(() => {
    // Skip if data hasn't changed
    const currentData = reviewsData?.data;
    if (lastProcessedDataRef.current === currentData) {
      return;
    }

    const filterAdminReviews = async () => {
      if (!allReviews || allReviews.length === 0) {
        setAdminReviews([]);
        setFiltering(false);
        lastProcessedDataRef.current = currentData;
        return;
      }

      try {
        setFiltering(true);
        // Fetch property details for each review to check agent
        const filteredReviews = [];
        
        for (const review of allReviews) {
          if (review.propertyId?._id) {
            try {
              const property = await listingAPI.getListingById(review.propertyId._id);
              // Check if property agent matches admin email
              if (property?.agent === 'admin@aqaargate.com' || property?.agentEmail === 'admin@aqaargate.com') {
                filteredReviews.push(review);
              }
            } catch (err) {
              // If property fetch fails, skip this review
            }
          }
        }
        
        setAdminReviews(filteredReviews);
        lastProcessedDataRef.current = currentData;
      } catch (error) {
        setAdminReviews(allReviews); // Fallback to all reviews
        lastProcessedDataRef.current = currentData;
      } finally {
        setFiltering(false);
      }
    };

    filterAdminReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewsData?.data]);

  const reviews = adminReviews;

  const stats = reviewsData?.stats || { totalReviews: 0, averageRating: 0, totalProperties: 0 };
  const pagination = reviewsData?.pagination || {};

  // Initialize hidden sets from review data
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
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
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
    return '/images/avatar/avt-png13.png'; // Default avatar
  };

  // Get reviewer name
  const getReviewerName = (review) => {
    if (review.userId?.username) return review.userId.username;
    return review.name || 'Anonymous';
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
    try {
      await hideFromDashboardMutation.mutateAsync({ reviewId, hidden: true });
      setHiddenFromDashboard(prev => new Set(prev).add(reviewId));
      showToast('Review hidden from dashboard');
    } catch (error) {
      showToast('Failed to hide review', 'error');
    }
  };

  // Handle hide review from listing
  const handleHideFromListing = async (reviewId) => {
    try {
      await hideFromListingMutation.mutateAsync({ reviewId, hidden: true });
      setHiddenFromListing(prev => new Set(prev).add(reviewId));
      showToast('Review hidden from listing');
    } catch (error) {
      showToast('Failed to hide review', 'error');
    }
  };

  return (
    <div className="main-content w-100">
      <div className="main-content-inner style-3">
        <div className="button-show-hide show-mb">
          <span className="body-1">Show Dashboard</span>
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
                  <p className={`mb-0 ${styles.statLabel}`}>Total Reviews</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`card border-0 shadow-sm ${styles.statCard}`}>
                <div className={`card-body ${styles.statCardBody}`}>
                  <h3 className={`mb-2 ${styles.statNumberYellow}`}>
                    {stats.averageRating.toFixed(1)} <i className={`icon-star ${styles.starIcon}`} />
                  </h3>
                  <p className={`mb-0 ${styles.statLabel}`}>Average Rating</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`card border-0 shadow-sm ${styles.statCard}`}>
                <div className={`card-body ${styles.statCardBody}`}>
                  <h3 className={`mb-2 ${styles.statNumberGreen}`}>
                    {stats.totalProperties}
                  </h3>
                  <p className={`mb-0 ${styles.statLabel}`}>Properties with Reviews</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="widget-box-2 mess-box">
          <h3 className="title">
            Admin Property Reviews
            {pagination.totalReviews > 0 && (
              <span className={styles.titleBadge}>
                ({pagination.totalReviews} total reviews)
              </span>
            )}
          </h3>

          {(isLoading || filtering) && (
            <div className={styles.loadingContainer}>
              <LocationLoader 
                size="large" 
                message={isLoading ? "Loading property reviews..." : "Filtering admin reviews..."}
              />
            </div>
          )}

          {isError && (
            <div className={styles.errorContainer}>
              <p>Failed to load reviews. Please try again later.</p>
            </div>
          )}

          {!isLoading && !isError && reviews.length === 0 && (
            <div className={styles.emptyContainer}>
              <p>No reviews found for admin properties.</p>
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
                      <div className={styles.propertyInfoContainer}>
                        Property: <strong>{review.propertyId.propertyKeyword || 'N/A'}</strong>
                        <br />
                        <a 
                          href={`/property-detail/${review.propertyId._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.propertyLink}
                        >
                          View Property Details (ID: {review.propertyId._id})
                        </a>
                      </div>
                    )}
                    <div className="ratings">
                      {renderStars(review.rating || 5)}
                    </div>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => handleHideFromDashboard(review._id)}
                        disabled={hiddenFromDashboard.has(review._id) || review.hiddenFromDashboard || hideFromDashboardMutation.isPending}
                        className={styles.hideButtonDashboard}
                        title={(hiddenFromDashboard.has(review._id) || review.hiddenFromDashboard) ? 'Already hidden' : 'Hide from Dashboard'}
                      >
                        {hideFromDashboardMutation.isPending && !hiddenFromDashboard.has(review._id) && !review.hiddenFromDashboard ? 'Hiding...' : 
                         (hiddenFromDashboard.has(review._id) || review.hiddenFromDashboard) ? 'Hidden' : 'Hide from Dashboard'}
                      </button>
                      <button
                        onClick={() => handleHideFromListing(review._id)}
                        disabled={hiddenFromListing.has(review._id) || review.hiddenFromListing || hideFromListingMutation.isPending}
                        className={styles.hideButtonListing}
                        title={(hiddenFromListing.has(review._id) || review.hiddenFromListing) ? 'Already hidden' : 'Hide from Listing'}
                      >
                        {hideFromListingMutation.isPending && !hiddenFromListing.has(review._id) && !review.hiddenFromListing ? 'Hiding...' : 
                         (hiddenFromListing.has(review._id) || review.hiddenFromListing) ? 'Hidden' : 'Hide from Listing'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className={styles.paginationContainer}>
                  <button
                    onClick={handlePrevPage}
                    disabled={!pagination.hasPreviousPage}
                    className={styles.paginationNavButton}
                  >
                    « Previous
                  </button>

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

                  <button
                    onClick={handleNextPage}
                    disabled={!pagination.hasNextPage}
                    className={styles.paginationNavButton}
                  >
                    Next »
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <DashboardFooter />
          
          </ul>
        </div>
      </div>
      <div className="overlay-dashboard" />
      
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

