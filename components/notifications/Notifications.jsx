"use client";
import React, { useState, useEffect } from "react";
import { useNotifications, useNotificationMutations } from "@/apis/hooks";
import { useTranslations } from "next-intl";
import styles from "./Notifications.module.css";

const ALERT_TYPE_CLASSES = {
  success: styles.alertSuccess,
  info: styles.alertInfo,
  warning: styles.alertWarning,
  error: styles.alertError,
  primary: styles.alertPrimary
};

export default function Notifications() {
  const tCommon = useTranslations('common');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all');
  const itemsPerPage = 10;

  const { data: notificationsData, isLoading, refetch, error } = useNotifications({
    page: currentPage,
    limit: itemsPerPage,
    isRead: filter === 'all' ? undefined : filter === 'unread' ? false : true,
    type: typeFilter === 'all' ? undefined : typeFilter
  });

  const { markAsRead, markAllAsRead, deleteNotification } = useNotificationMutations();

  const notifications = notificationsData?.data?.notifications || [];
  const pagination = notificationsData?.data?.pagination || {};
  const unreadCount = notificationsData?.data?.unreadCount || 0;

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, typeFilter]);

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refetch();
  };

  const handleDelete = async (notificationId) => {
    await deleteNotification(notificationId);
    refetch();
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return tCommon('justNow') || 'Just now';
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${tCommon('minutesAgo') || 'm ago'}`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${tCommon('hoursAgo') || 'h ago'}`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${tCommon('daysAgo') || 'd ago'}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAlertClass = (alertType) => {
    return ALERT_TYPE_CLASSES[alertType] || styles.alertInfo;
  };

  return (
    <div className="main-content w-100">
      <div className="main-content-inner">
        {/* Header Section */}
        <div className="card mb-4">
          <div className="card-header">
            <div className={styles.headerContent}>
              <div>
                <h3 className="mb-2">{tCommon('notifications') || 'Notifications'}</h3>
                <p className={`${styles.subtitle} ${unreadCount === 0 ? styles.allReadText : ''}`}>
                  {unreadCount > 0 
                    ? `${unreadCount} ${tCommon('unreadNotifications') || 'unread notifications'}`
                    : tCommon('allNotificationsRead') || 'All notifications read'
                  }
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className={styles.markAllButton}
                >
                  <i className="icon-check" style={{ marginRight: '6px' }}></i>
                  {tCommon('markAllRead') || 'Mark all as read'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4" style={{ justifyContent: 'center' }}>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className={styles.statCard}>
              <div className={styles.statValue}>{notifications.length}</div>
              <div className={styles.statLabel}>{tCommon('total') || 'Total'}</div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: '#6366f1' }}>{unreadCount}</div>
              <div className={styles.statLabel}>{tCommon('unread') || 'Unread'}</div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: '#10b981' }}>{notifications.length - unreadCount}</div>
              <div className={styles.statLabel}>{tCommon('read') || 'Read'}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <i className="icon-filter" style={{ marginRight: '6px' }}></i>
                  {tCommon('filterByStatus') || 'Filter by status'}:
                </label>
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                  className={styles.filterSelect}
                >
                  <option value="all">{tCommon('all') || 'All'}</option>
                  <option value="unread">{tCommon('unread') || 'Unread'}</option>
                  <option value="read">{tCommon('read') || 'Read'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="card">
          <div className="card-header">
            <h3 className="mb-0">
              {tCommon('notifications') || 'Notifications'}
              {pagination.total > 0 && (
                <span className="text-muted ms-2">
                  ({pagination.total} {tCommon('total') || 'total'})
                </span>
              )}
            </h3>
          </div>
          <div className="card-body p-0">
            {isLoading ? (
              <div className={styles.loading}>
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{tCommon('loading') || 'Loading...'}</span>
                  </div>
                  <p className="mt-3">{tCommon('loading') || 'Loading...'}</p>
                </div>
              </div>
            ) : error ? (
              <div className={styles.empty}>
                <div className="text-center py-5">
                  <div className={styles.emptyIconWrapper}>
                    <i className="icon-alert" style={{ fontSize: '64px', color: '#ef4444' }}></i>
                  </div>
                  <h4 className="mt-3 mb-2">Error Loading Notifications</h4>
                  <p className="text-muted mb-3">{error?.message || 'Failed to load notifications'}</p>
                  <button 
                    onClick={() => refetch()} 
                    className="btn btn-primary"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className={styles.empty}>
                <div className="text-center py-5">
                  <div className={styles.emptyIconWrapper}>
                    <i className="icon-bell" style={{ fontSize: '64px', color: '#d1d5db' }}></i>
                  </div>
                  <h4 className="mt-3 mb-2">{tCommon('noNotifications') || 'No notifications'}</h4>
                  <p className="text-muted mb-0">{tCommon('noNotificationsDesc') || 'You don\'t have any notifications yet.'}</p>
                </div>
              </div>
            ) : (
              <ul className={styles.notificationList}>
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''} ${getAlertClass(notification.alertType)}`}
                >
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationHeader}>
                      <div className={styles.notificationTitleRow}>
                        <h4 className={styles.notificationTitle}>{notification.title}</h4>
                        {!notification.isRead && (
                          <span className={styles.unreadBadge}>{tCommon('new') || 'New'}</span>
                        )}
                      </div>
                      <div className={styles.notificationActions}>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className={styles.markReadButton}
                            title={tCommon('markAsRead') || 'Mark as read'}
                          >
                            <i className="icon-check" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className={styles.deleteButton}
                          title={tCommon('delete') || 'Delete'}
                        >
                          <i className="icon-close" />
                        </button>
                      </div>
                    </div>
                    <p className={styles.notificationMessage}>{notification.message}</p>
                    <div className={styles.notificationFooter}>
                      <span className={styles.notificationTime}>
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      <span className={styles.notificationDate}>
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
              </ul>
            )}
          </div>
          {(pagination.totalPages > 1 || pagination.total > itemsPerPage) && (
            <div className="card-footer">
              <div className={styles.pagination}>
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                  }}
                  disabled={currentPage === 1 || isLoading}
                  className={styles.paginationButton}
                >
                  <i className="icon-arrow-left" style={{ marginRight: '6px' }}></i>
                  {tCommon('previous') || 'Previous'}
                </button>
                <span className={styles.paginationInfo}>
                  {tCommon('page') || 'Page'} {pagination.page || currentPage} {tCommon('of') || 'of'} {pagination.totalPages || 1}
                  {pagination.total && (
                    <span className="text-muted ms-2">
                      ({pagination.total} {tCommon('total') || 'total'})
                    </span>
                  )}
                </span>
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(pagination.totalPages || 1, prev + 1));
                  }}
                  disabled={currentPage >= (pagination.totalPages || 1) || isLoading}
                  className={styles.paginationButton}
                >
                  {tCommon('next') || 'Next'}
                  <i className="icon-arrow-right" style={{ marginLeft: '6px' }}></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

