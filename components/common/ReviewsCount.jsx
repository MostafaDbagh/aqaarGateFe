"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { useDashboardStats } from '@/apis/hooks';
import { useTranslations } from 'next-intl';

export default function ReviewsCount({ 
  showLabel = true, 
  className = '',
  icon = true,
  format = 'parentheses' // 'parentheses', 'badge', 'text'
}) {
  const t = useTranslations('agent.sidebar');
  const pathname = usePathname();
  // Only fetch dashboard stats if we're on a dashboard page
  const isDashboardPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/review') || pathname?.startsWith('/messages') || pathname?.startsWith('/my-property');
  const { data: dashboardStats, isLoading } = useDashboardStats(isDashboardPage);
  const reviewsCount = dashboardStats?.data?.totalReviews || 0;

  if (isLoading) {
    return (
      <span className={className}>
        {icon && (
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ marginRight: '8px' }}>
            <path d="M17.5 12.5C17.5 12.942 17.3244 13.366 17.0118 13.6785C16.6993 13.9911 16.2754 14.1667 15.8333 14.1667H5.83333L2.5 17.5V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V12.5Z" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.66797 9.99996C7.11 9.99996 7.53392 9.82436 7.84648 9.5118C8.15904 9.19924 8.33464 8.77532 8.33464 8.33329V6.66663H6.66797" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.668 9.99996C12.11 9.99996 12.5339 9.82436 12.8465 9.5118C13.159 9.19924 13.3346 8.77532 13.3346 8.33329V6.66663H11.668" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {showLabel && t('reviews')} <span>(...)</span>
      </span>
    );
  }

  const renderCount = () => {
    switch (format) {
      case 'badge':
        return (
          <span className={`badge ${reviewsCount > 0 ? 'bg-main' : 'bg-gray'}`}>
            {reviewsCount}
          </span>
        );
      case 'text':
        return <span>{reviewsCount} review{reviewsCount !== 1 ? 's' : ''}</span>;
      case 'parentheses':
      default:
        return <span>({reviewsCount})</span>;
    }
  };

  return (
    <span className={className}>
      {icon && (
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ marginRight: '8px' }}>
          <path d="M17.5 12.5C17.5 12.942 17.3244 13.366 17.0118 13.6785C16.6993 13.9911 16.2754 14.1667 15.8333 14.1667H5.83333L2.5 17.5V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V12.5Z" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.66797 9.99996C7.11 9.99996 7.53392 9.82436 7.84648 9.5118C8.15904 9.19924 8.33464 8.77532 8.33464 8.33329V6.66663H6.66797" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.668 9.99996C12.11 9.99996 12.5339 9.82436 12.8465 9.5118C13.159 9.19924 13.3346 8.77532 13.3346 8.33329V6.66663H11.668" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {showLabel && t('reviews')} {renderCount()}
    </span>
  );
}
