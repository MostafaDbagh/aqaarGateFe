"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import LineChart from "./Chart";
import Link from "next/link";
import Image from "next/image";
import { useMessagesByAgent, useReviewsByAgent, useMostVisitedListings, useDashboardStats, useDashboardAnalytics, useDashboardNotifications } from "@/apis/hooks";
import LocationLoader from "@/components/common/LocationLoader";
import logger from "@/utlis/logger";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      logger.debug('Dashboard userData loaded:', parsedData);
    } else {
      // Fallback: try to get user ID from token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const fallbackUserData = { id: payload.id };
          setUserData(fallbackUserData);
          logger.debug('Dashboard fallback userData:', fallbackUserData);
        } catch (error) {
          logger.error('Error parsing token:', error);
        }
      }
    }
  }, []);

  // Fetch recent messages (last 5)
  const { 
    data: messagesData, 
    isLoading: messagesLoading, 
    error: messagesError 
  } = useMessagesByAgent(userData?.id, { limit: 5 });

  // Fetch recent reviews (last 5)
  const { 
    data: reviewsData, 
    isLoading: reviewsLoading, 
    error: reviewsError 
  } = useReviewsByAgent(userData?.id, { limit: 5 });

  // Fetch most visited listings (last 5)
  // Use userData?.id or userData?._id or userData?.agentId
  const agentId = userData?.id || userData?._id || userData?.agentId || '68ef776e8cd8a7ccd23eedbd';
  const { 
    data: mostVisitedData, 
    isLoading: mostVisitedLoading, 
    error: mostVisitedError 
  } = useMostVisitedListings(agentId, { limit: 5 });

  // Fetch dashboard stats from API
  const { 
    data: dashboardStats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useDashboardStats();

  // Fetch dashboard analytics
  const { 
    data: dashboardAnalytics, 
    isLoading: analyticsLoading, 
    error: analyticsError 
  } = useDashboardAnalytics('30d');

  // Fetch dashboard notifications
  const { 
    data: dashboardNotifications, 
    isLoading: notificationsLoading, 
    error: notificationsError 
  } = useDashboardNotifications();

  const recentMessages = messagesData?.data || [];
  const recentReviews = reviewsData?.data || [];
  const mostVisitedListings = Array.isArray(mostVisitedData) ? mostVisitedData : (mostVisitedData?.data || []);
  
  // Memoize dashboard data to prevent unnecessary re-renders
  const stats = useMemo(() => dashboardStats?.data || {}, [dashboardStats?.data]);
  const analytics = useMemo(() => dashboardAnalytics?.data || {}, [dashboardAnalytics?.data]);
  const notifications = useMemo(() => dashboardNotifications?.data || {}, [dashboardNotifications?.data]);

  // Memoize utility functions to prevent recreation on every render
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  }, []);

  const truncateText = useCallback((text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }, []);
  return (
    <div className="main-content w-100">
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
      <div className="main-content-inner">
        <div className="button-show-hide show-mb">
          <span className="body-1">Show Dashboard</span>
        </div>
        
        {/* Error handling for dashboard stats */}
        {statsError && (
          <div className="alert alert-danger" style={{ marginBottom: '20px', borderRadius: '8px' }}>
            <strong>Error loading dashboard data:</strong> {statsError.message || 'Failed to load dashboard statistics'}
          </div>
        )}
        {/* First Row - 3 Cards */}
        <div className="row" style={{ marginBottom: '24px' }}>
          <div className="col-lg-4 col-md-6 mb-3">
        <div className="counter-box" style={{ 
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: '16px',
          padding: '28px 24px',
          color: 'white',
          boxShadow: '0 10px 30px rgba(99, 102, 241, 0.2)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
              <div className="box-icon" style={{ marginBottom: '16px' }}>
                <span className="icon">
                  <svg width={40}
                    height={40}
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                   aria-hidden="true">
                    <path
                      d="M18 3L21.09 12.26L30 15L21.09 17.74L18 27L14.91 17.74L6 15L14.91 12.26L18 3Z"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18 9V15L21 16.5"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="18" cy="18" r="15" stroke="white" strokeWidth={2} fill="none"/>
                  </svg>
                </span>
              </div>
              <div className="content-box">
                <div className="title-count" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>Balance</div>
                <div className="box-count d-flex align-items-end">
                  {statsLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="number" style={{ color: 'white', fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
                        ${stats.balance?.toLocaleString() || '0'}
                      </div>
                      <span className="text" style={{ color: 'rgba(255,255,255,0.8)', marginLeft: '10px', fontSize: '14px', marginBottom: '4px' }}>Available</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-3">
        <div className="counter-box" style={{ 
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          borderRadius: '16px',
          padding: '28px 24px',
          color: 'white',
          boxShadow: '0 10px 30px rgba(6, 182, 212, 0.2)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
              <div className="box-icon" style={{ marginBottom: '16px' }}>
              <span className="icon">
                <svg width={40}
                    height={40}
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                 aria-hidden="true">
                  <path
                    d="M22.5 3H9C8.20435 3 7.44129 3.31607 6.87868 3.87868C6.31607 4.44129 6 5.20435 6 6V30C6 30.7956 6.31607 31.5587 6.87868 32.1213C7.44129 32.6839 8.20435 33 9 33H27C27.7956 33 28.5587 32.6839 29.1213 32.1213C29.6839 31.5587 30 30.7956 30 30V10.5L22.5 3Z"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 3V9C21 9.79565 21.3161 10.5587 21.8787 11.1213C22.4413 11.6839 23.2044 12 24 12H30"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 19.5H15"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 19.5H24"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 25.5H15"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 25.5H24"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div className="content-box">
                <div className="title-count" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>Your listing</div>
              <div className="box-count d-flex align-items-end">
                  {statsLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="number" style={{ color: 'white', fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
                        {stats.totalListings || 0}
                      </div>
                      <span className="text" style={{ color: 'rgba(255,255,255,0.8)', marginLeft: '10px', fontSize: '14px', marginBottom: '4px' }}>
                        /{stats.listingLimit || 50} remaining
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-3">
        <div className="counter-box" style={{ 
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderRadius: '16px',
          padding: '28px 24px',
          color: 'white',
          boxShadow: '0 10px 30px rgba(245, 158, 11, 0.2)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
              <div className="box-icon" style={{ marginBottom: '16px' }}>
              <span className="icon">
                <svg width={40}
                    height={40}
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                 aria-hidden="true">
                  <path
                    d="M18.5061 32.991C15.4409 33.0945 12.4177 32.2559 9.84374 30.5882C7.26982 28.9206 5.26894 26.504 4.11073 23.6642C2.95253 20.8243 2.69265 17.6977 3.36614 14.7056C4.03962 11.7135 5.61409 8.9998 7.87737 6.9301C10.1407 4.86039 12.984 3.5342 16.0242 3.13022C19.0644 2.72624 22.1554 3.2639 24.8807 4.67074C27.6059 6.07757 29.8344 8.28598 31.2659 10.9984C32.6974 13.7107 33.263 16.7967 32.8866 19.8405"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18 9V18L21 19.5"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 27L27 33L33 27"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M27 21V33"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div className="content-box">
                <div className="title-count" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>Pending</div>
              <div className="box-count d-flex align-items-end">
                  {statsLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Loading...</span>
                    </div>
                  ) : (
                    <div className="number" style={{ color: 'white', fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
                      {String(stats.pendingListings || 0).padStart(2, '0')}
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>

        {/* Second Row - 3 Cards */}
        <div className="row" style={{ marginBottom: '24px' }}>
          <div className="col-lg-4 col-md-6 mb-3">
        <div className="counter-box" style={{ 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '16px',
          padding: '28px 24px',
          color: 'white',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
              <div className="box-icon" style={{ marginBottom: '16px' }}>
              <span className="icon">
                <svg width={40}
                    height={40}
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                 aria-hidden="true">
                  <path
                    d="M6 33H27C27.7956 33 28.5587 32.6839 29.1213 32.1213C29.6839 31.5587 30 30.7956 30 30V10.5L22.5 3H9C8.20435 3 7.44129 3.31607 6.87868 3.87868C6.31607 4.44129 6 5.20435 6 6V9"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 3V9C21 9.79565 21.3161 10.5587 21.8787 11.1213C22.4413 11.6839 23.2044 12 24 12H30"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.4348 16.05C14.9224 15.5384 14.2692 15.191 13.5586 15.0521C12.848 14.9132 12.1121 14.989 11.4448 15.27C11.0098 15.45 10.6048 15.72 10.2748 16.065L9.74976 16.575L9.22476 16.065C8.71531 15.5539 8.0656 15.2055 7.35797 15.064C6.65033 14.9225 5.9166 14.9942 5.24976 15.27C4.79976 15.45 4.40976 15.72 4.06476 16.065C2.63976 17.475 2.56476 19.86 4.36476 21.675L9.74976 27L15.1498 21.675C16.9498 19.86 16.8598 17.475 15.4348 16.065V16.05Z"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div className="content-box">
                <div className="title-count" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>Favorites</div>
              <div className="d-flex align-items-end">
                  {statsLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Loading...</span>
                    </div>
                  ) : (
                    <div className="number" style={{ color: 'white', fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
                      {String(stats.totalFavorites || 0).padStart(2, '0')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-3">
        <div className="counter-box" style={{ 
          background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
          borderRadius: '16px',
          padding: '28px 24px',
          color: 'white',
          boxShadow: '0 10px 30px rgba(236, 72, 153, 0.2)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
              <div className="box-icon" style={{ marginBottom: '16px' }}>
              <span className="icon">
                <svg width={40}
                    height={40}
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                 aria-hidden="true">
                  <path
                    d="M31.5 22.5C31.5 23.2956 31.1839 24.0587 30.6213 24.6213C30.0587 25.1839 29.2956 25.5 28.5 25.5H10.5L4.5 31.5V7.5C4.5 6.70435 4.81607 5.94129 5.37868 5.37868C5.94129 4.81607 6.70435 4.5 7.5 4.5H28.5C29.2956 4.5 30.0587 4.81607 30.6213 5.37868C31.1839 5.94129 31.5 6.70435 31.5 7.5V22.5Z"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 18C12.7956 18 13.5587 17.6839 14.1213 17.1213C14.6839 16.5587 15 15.7956 15 15V12H12"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 18C21.7956 18 22.5587 17.6839 23.1213 17.1213C23.6839 16.5587 24 15.7956 24 15V12H21"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="content-box">
                <div className="title-count" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>Reviews</div>
                <div className="d-flex align-items-end">
                  {statsLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Loading...</span>
                    </div>
                  ) : (
                    <div className="number" style={{ color: 'white', fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
                      {stats.totalReviews ? stats.totalReviews.toFixed(3) : '0.000'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-3">
        <div className="counter-box" style={{ 
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderRadius: '16px',
          padding: '28px 24px',
          color: 'white',
          boxShadow: '0 10px 30px rgba(139, 92, 246, 0.2)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
              <div className="box-icon" style={{ marginBottom: '16px' }}>
                <span className="icon">
                  <svg width={40}
                    height={40}
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                   aria-hidden="true">
                    <path
                      d="M31.5 13.5C31.5 14.2956 31.1839 15.0587 30.6213 15.6213C30.0587 16.1839 29.2956 16.5 28.5 16.5H10.5L4.5 22.5V4.5C4.5 3.70435 4.81607 2.94129 5.37868 2.37868C5.94129 1.81607 6.70435 1.5 7.5 1.5H28.5C29.2956 1.5 30.0587 1.81607 30.6213 2.37868C31.1839 2.94129 31.5 3.70435 31.5 4.5V13.5Z"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 9C12.7956 9 13.5587 8.68393 14.1213 8.12132C14.6839 7.55871 15 6.79565 15 6V3H12"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 9C21.7956 9 22.5587 8.68393 23.1213 8.12132C23.6839 7.55871 24 6.79565 24 6V3H21"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18 27L21 30L27 24"
                      stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div className="content-box">
                <div className="title-count" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>Messages</div>
              <div className="d-flex align-items-end">
                  {statsLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="number" style={{ color: 'white', fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>
                        {stats.totalMessages || 0}
                      </div>
                      {stats.unreadMessages > 0 && (
                        <span className="text" style={{ color: 'rgba(255,255,255,0.8)', marginLeft: '10px', fontSize: '14px', marginBottom: '4px' }}>
                          {stats.unreadMessages} New
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-9">
            <div className="widget-box-2 wd-listing mb-24">
              <h3 className="title">Most Visited Listings</h3>
              <div className="wrap-table">
                {mostVisitedLoading ? (
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <LocationLoader 
                      size="medium" 
                      message="Loading most visited listings..."
                    />
                  </div>
                ) : mostVisitedError ? (
                  <div className="text-center p-4" style={{ color: '#dc3545' }}>
                    Error loading most visited listings
                  </div>
                ) : mostVisitedListings.length === 0 ? (
                  <div className="text-center p-4" style={{ color: '#6c757d' }}>
                    No visited listings yet
                  </div>
                ) : (
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Listing</th>
                          <th>Visits</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                        {mostVisitedListings.slice(0, 5).map((listing) => (
                          <tr key={listing._id} className="file-delete">
                          <td>
                            <div className="listing-box">
                              <div className="images">
                                <Image
                                  alt={listing.propertyKeyword || listing.propertyTitle || "Property listing"}
                                  width={615}
                                  height={405}
                                    src={listing.images?.[0]?.url || "/images/section/box-house-2.jpg"}
                                />
                              </div>
                              <div className="content">
                                <div className="title">
                                  <Link
                                      href={`/property-detail/${listing._id}`}
                                    className="link"
                                  >
                                      {listing.propertyKeyword || 'Property Listing'}
                                  </Link>
                                </div>
                                <div className="text-date">
                                    Posted: {formatDate(listing.createdAt)}
                                </div>
                                <div className="text-btn text-color-primary">
                                    ${listing.propertyPrice?.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                justifyContent: 'center'
                              }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#F1913D"/>
                                </svg>
                                <span style={{ fontWeight: '600', color: '#F1913D' }}>
                                  {listing.visitCount || 0} views
                                </span>
                            </div>
                          </td>
                          <td>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: listing.approvalStatus === 'approved' ? '#d4edda' : '#fff3cd',
                                color: listing.approvalStatus === 'approved' ? '#155724' : '#856404'
                              }}>
                                {listing.approvalStatus || 'Pending'}
                              </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            </div>
            <div className="widget-box-2 wd-chart">
              <h5 className="title">Property Analytics</h5>
              <div className="wd-filter-date">
                <div className="left">
                  <div className="dates active">Overview</div>
                </div>
                <div className="right">
                  <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '500' }}>
                    Last 30 days
                  </div>
                </div>
              </div>
              <div className="chart-box">
                <div style={{ padding: '20px', minHeight: '300px' }}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        borderRadius: '12px',
                        padding: '20px',
                        color: 'white',
                        textAlign: 'center'
                      }}>
                        <h6 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Total Views</h6>
                        <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '5px' }}>
                          {mostVisitedListings.reduce((total, listing) => total + (listing.visitCount || 0), 0)}
              </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>All Properties</div>
          </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '12px',
                        padding: '20px',
                        color: 'white',
                        textAlign: 'center'
                      }}>
                        <h6 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Avg. Views</h6>
                        <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '5px' }}>
                          {mostVisitedListings.length > 0 
                            ? Math.round(mostVisitedListings.reduce((total, listing) => total + (listing.visitCount || 0), 0) / mostVisitedListings.length)
                            : 0}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Per Property</div>
              </div>
            </div>
          </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div style={{
                        background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                        borderRadius: '12px',
                        padding: '20px',
                        color: 'white',
                        textAlign: 'center'
                      }}>
                        <h6 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Approved</h6>
                        <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '5px' }}>
                          {mostVisitedListings.filter(listing => listing.approvalStatus === 'approved').length}
                    </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Properties</div>
                    </div>
                  </div>
                    <div className="col-md-6 mb-4">
                      <div style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: '12px',
                        padding: '20px',
                        color: 'white',
                        textAlign: 'center'
                      }}>
                        <h6 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Pending</h6>
                        <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '5px' }}>
                          {mostVisitedListings.filter(listing => listing.approvalStatus === 'pending').length}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Properties</div>
                    </div>
                    </div>
                  </div>

                  {mostVisitedListings.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                      <h6 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                        Top Performing Properties
                      </h6>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {mostVisitedListings.slice(0, 3).map((listing, index) => (
                          <div key={listing._id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 0',
                            borderBottom: index < 2 ? '1px solid #eee' : 'none'
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                                {listing.propertyKeyword || 'Property Listing'}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                ${listing.propertyPrice?.toLocaleString()}
                              </div>
                    </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: '#f8f9fa',
                              padding: '6px 12px',
                              borderRadius: '20px'
                            }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#F1913D"/>
                              </svg>
                              <span style={{ fontSize: '14px', fontWeight: '600', color: '#F1913D' }}>
                                {listing.visitCount || 0} views
                      </span>
                    </div>
                  </div>
                        ))}
                    </div>
                  </div>
                  )}
            </div>
                    </div>
                    </div>
                  </div>
          <div className="col-xl-3">
            <div className="widget-box-2 mess-box mb-20">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="title mb-0">Recent Messages</h5>
                <Link href="/messages" className="btn-view-all" style={{ 
                  fontSize: '12px', 
                  color: '#F1913D', 
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  View All →
                </Link>
                  </div>
              
              {messagesLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <LocationLoader 
                    size="small" 
                    message="Loading messages..."
                      />
                    </div>
              ) : messagesError ? (
                <div className="text-center p-3" style={{ color: '#dc3545' }}>
                  Error loading messages
                    </div>
              ) : recentMessages.length === 0 ? (
                <div className="text-center p-3" style={{ color: '#6c757d' }}>
                  No recent messages
                  </div>
              ) : (
                <ul className="list-mess">
                  {recentMessages.slice(0, 5).map((message, index) => (
                    <li key={message._id || index} className="mess-item">
                  <div className="user-box">
                    <div className="avatar">
                          <div style={{
                            width: '51px',
                            height: '51px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '18px'
                          }}>
                            {message.senderName?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                    </div>
                    <div className="content">
                          <div className="name fw-6">{message.senderName || 'Unknown User'}</div>
                      <span className="caption-2 text-variant-3">
                            {formatDate(message.createdAt)}
                      </span>
                    </div>
                  </div>
                      <p>{truncateText(message.messageContent || 'No content')}</p>
                </li>
                  ))}
                </ul>
              )}
                    </div>
            <div className="widget-box-2 mess-box">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="title mb-0">Recent Reviews</h5>
                <Link href="/reviews" className="btn-view-all" style={{ 
                  fontSize: '12px', 
                  color: '#F1913D', 
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  View All →
                </Link>
                  </div>
              
              {reviewsLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <LocationLoader 
                    size="small" 
                    message="Loading reviews..."
                      />
                    </div>
              ) : reviewsError ? (
                <div className="text-center p-3" style={{ color: '#dc3545' }}>
                  Error loading reviews
                    </div>
              ) : recentReviews.length === 0 ? (
                <div className="text-center p-3" style={{ color: '#6c757d' }}>
                  No recent reviews
                  </div>
              ) : (
                <ul className="list-mess">
                  {recentReviews.slice(0, 5).map((review, index) => (
                    <li key={review._id || index} className="mess-item">
                  <div className="user-box">
                    <div className="avatar">
                          <div style={{
                            width: '51px',
                            height: '51px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '18px'
                          }}>
                            {review.reviewerName?.charAt(0)?.toUpperCase() || 'R'}
                          </div>
                    </div>
                    <div className="content">
                          <div className="name fw-6">{review.reviewerName || 'Anonymous'}</div>
                      <span className="caption-2 text-variant-3">
                            {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                      <p>{truncateText(review.reviewText || 'No review text')}</p>
                  <div className="ratings">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i}
                            className={`icon-star ${i < (review.rating || 5) ? 'active' : ''}`}
                            style={{ 
                              color: i < (review.rating || 5) ? '#FFD700' : '#ddd',
                              fontSize: '14px'
                            }}
                          />
                        ))}
                  </div>
                </li>
                  ))}
              </ul>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-9">
            {/* .footer-dashboard */}
            <div className="footer-dashboard">
              <p>Copyright © {new Date().getFullYear()} Popty</p>
              <ul className="list">
                <li>
                  <a href="#">Privacy</a>
                </li>
                <li>
                  <a href="#">Terms</a>
                </li>
                <li>
                  <a href="#">Support</a>
                </li>
              </ul>
            </div>
            {/* .footer-dashboard */}
          </div>
        </div>
      </div>
      <div className="overlay-dashboard" />
    </div>
  );
}
