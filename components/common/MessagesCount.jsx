"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { useDashboardStats } from '@/apis/hooks';

export default function MessagesCount({ 
  showLabel = true, 
  className = '',
  icon = true,
  format = 'parentheses' // 'parentheses', 'badge', 'text'
}) {
  const pathname = usePathname();
  // Only fetch dashboard stats if we're on a dashboard page
  const isDashboardPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/review') || pathname?.startsWith('/messages') || pathname?.startsWith('/my-property');
  const { data: dashboardStats, isLoading } = useDashboardStats(isDashboardPage);
  const messagesCount = dashboardStats?.data?.totalMessages || 0;

  if (isLoading) {
    return (
      <span className={className}>
        {icon && (
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ marginRight: '8px' }}>
            <path d="M17.5 4.16667H2.5C2.05833 4.16667 1.63441 4.34226 1.32185 4.65482C1.00929 4.96738 0.833694 5.3913 0.833694 5.83333V14.1667C0.833694 14.6087 1.00929 15.0326 1.32185 15.3452C1.63441 15.6577 2.05833 15.8333 2.5 15.8333H17.5C17.9417 15.8333 18.3656 15.6577 18.6782 15.3452C18.9907 15.0326 19.1663 14.6087 19.1663 14.1667V5.83333C19.1663 5.3913 18.9907 4.96738 18.6782 4.65482C18.3656 4.34226 17.9417 4.16667 17.5 4.16667Z" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.83331 8.33333H14.1666" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.83331 11.6667H10.8333" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {showLabel && 'Messages'} <span>(...)</span>
      </span>
    );
  }

  const renderCount = () => {
    switch (format) {
      case 'badge':
        return (
          <span className={`badge ${messagesCount > 0 ? 'bg-main' : 'bg-gray'}`}>
            {messagesCount}
          </span>
        );
      case 'text':
        return <span>{messagesCount} message{messagesCount !== 1 ? 's' : ''}</span>;
      case 'parentheses':
      default:
        return <span>({messagesCount})</span>;
    }
  };

  return (
    <span className={className}>
      {icon && (
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ marginRight: '8px' }}>
          <path d="M17.5 4.16667H2.5C2.05833 4.16667 1.63441 4.34226 1.32185 4.65482C1.00929 4.96738 0.833694 5.3913 0.833694 5.83333V14.1667C0.833694 14.6087 1.00929 15.0326 1.32185 15.3452C1.63441 15.6577 2.05833 15.8333 2.5 15.8333H17.5C17.9417 15.8333 18.3656 15.6577 18.6782 15.3452C18.9907 15.0326 19.1663 14.6087 19.1663 14.1667V5.83333C19.1663 5.3913 18.9907 4.96738 18.6782 4.65482C18.3656 4.34226 17.9417 4.16667 17.5 4.16667Z" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.83331 8.33333H14.1666" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.83331 11.6667H10.8333" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {showLabel && 'Messages'} {renderCount()}
    </span>
  );
}
