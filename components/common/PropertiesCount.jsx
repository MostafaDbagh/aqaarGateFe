"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { useDashboardStats } from '@/apis/hooks';

export default function PropertiesCount({ 
  showLabel = true, 
  className = '',
  icon = true,
  format = 'parentheses' // 'parentheses', 'badge', 'text'
}) {
  const pathname = usePathname();
  // Only fetch dashboard stats if we're on a dashboard page
  const isDashboardPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/review') || pathname?.startsWith('/messages') || pathname?.startsWith('/my-property');
  const { data: dashboardStats, isLoading } = useDashboardStats(isDashboardPage);
  const propertiesCount = dashboardStats?.data?.totalListings || 0;

  if (isLoading) {
    return (
      <span className={className}>
        {icon && (
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ marginRight: '8px' }}>
            <path d="M15 15C16.3807 15 17.5 13.8807 17.5 12.5C17.5 11.1193 16.3807 10 15 10C13.6193 10 12.5 11.1193 12.5 12.5C12.5 13.8807 13.6193 15 15 15Z" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.5013 9.16667C9.34225 9.16667 10.8346 7.67428 10.8346 5.83333C10.8346 3.99238 9.34225 2.5 7.5013 2.5C5.66035 2.5 4.16797 3.99238 4.16797 5.83333C4.16797 7.67428 5.66035 9.16667 7.5013 9.16667Z" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.33464 12.5H5.0013C4.11725 12.5 3.2694 12.8512 2.64428 13.4763C2.01916 14.1014 1.66797 14.9493 1.66797 15.8333V17.5" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.082 13.6666L17.332 13.4166" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.668 11.5834L11.918 11.3334" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.832 15.5834L14.082 14.8334" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.918 10.1666L16.168 9.41663" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.3333 15.5833L16 14.75" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.0013 10.25L13.668 9.41663" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.918 13.8333L12.7513 13.5" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.25 11.5L18.0833 11.1666" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {showLabel && 'My properties'} <span>(...)</span>
      </span>
    );
  }

  const renderCount = () => {
    switch (format) {
      case 'badge':
        return (
          <span className={`badge ${propertiesCount > 0 ? 'bg-main' : 'bg-gray'}`}>
            {propertiesCount}
          </span>
        );
      case 'text':
        return <span>{propertiesCount} propert{propertiesCount !== 1 ? 'ies' : 'y'}</span>;
      case 'parentheses':
      default:
        return <span>({propertiesCount})</span>;
    }
  };

  return (
    <span className={className}>
      {icon && (
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ marginRight: '8px' }}>
          <path d="M15 15C16.3807 15 17.5 13.8807 17.5 12.5C17.5 11.1193 16.3807 10 15 10C13.6193 10 12.5 11.1193 12.5 12.5C12.5 13.8807 13.6193 15 15 15Z" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.5013 9.16667C9.34225 9.16667 10.8346 7.67428 10.8346 5.83333C10.8346 3.99238 9.34225 2.5 7.5013 2.5C5.66035 2.5 4.16797 3.99238 4.16797 5.83333C4.16797 7.67428 5.66035 9.16667 7.5013 9.16667Z" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.33464 12.5H5.0013C4.11725 12.5 3.2694 12.8512 2.64428 13.4763C2.01916 14.1014 1.66797 14.9493 1.66797 15.8333V17.5" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.082 13.6666L17.332 13.4166" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.668 11.5834L11.918 11.3334" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.832 15.5834L14.082 14.8334" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.918 10.1666L16.168 9.41663" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.3333 15.5833L16 14.75" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.0013 10.25L13.668 9.41663" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.918 13.8333L12.7513 13.5" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.25 11.5L18.0833 11.1666" stroke="#A8ABAE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {showLabel && 'My properties'} {renderCount()}
    </span>
  );
}
