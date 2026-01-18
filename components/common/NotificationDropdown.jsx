"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useNotifications, useNotificationMutations } from "@/apis/hooks";
import { useTranslations } from "next-intl";
import styles from "./NotificationDropdown.module.css";

const ALERT_TYPE_CLASSES = {
  success: styles.alertSuccess,
  info: styles.alertInfo,
  warning: styles.alertWarning,
  error: styles.alertError,
  primary: styles.alertPrimary
};

export default function NotificationDropdown({ onClose }) {
  const tCommon = useTranslations('common');
  const { data: notificationsData, isLoading } = useNotifications({ 
    limit: 10, 
    isRead: false 
  });
  const { markAsRead, markAllAsRead, deleteNotification } = useNotificationMutations();
  
  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = notifications.length;

  const handleMarkAsRead = (notificationId, e) => {
    e.preventDefault();
    e.stopPropagation();
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = (e) => {
    e.preventDefault();
    e.stopPropagation();
    markAllAsRead();
  };

  const handleDelete = (notificationId, e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  };

  const getAlertClass = (alertType) => {
    return ALERT_TYPE_CLASSES[alertType] || styles.alertInfo;
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownHeader}>
        <h3 className={styles.dropdownTitle}>
          {tCommon('notifications')}
          {unreadCount > 0 && (
            <span className={styles.unreadCount}>({unreadCount})</span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className={styles.markAllReadButton}
          >
            {tCommon('markAllRead')}
          </button>
        )}
      </div>

      <div className={styles.dropdownContent}>
        {isLoading ? (
          <div className={styles.loading}>
            {tCommon('loading') || 'Loading...'}
          </div>
        ) : notifications.length === 0 ? (
          <div className={styles.empty}>
            {tCommon('noNewNotifications')}
          </div>
        ) : (
          <ul className={styles.notificationList}>
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''} ${getAlertClass(notification.alertType)}`}
                onClick={(e) => !notification.isRead && handleMarkAsRead(notification._id, e)}
              >
                <div className={styles.notificationContent}>
                  <div className={styles.notificationHeader}>
                    <h4 className={styles.notificationTitle}>{notification.title}</h4>
                    {!notification.isRead && (
                      <span className={styles.unreadDot}></span>
                    )}
                  </div>
                  <p className={styles.notificationMessage}>{notification.message}</p>
                  <div className={styles.notificationFooter}>
                    <span className={styles.notificationTime}>
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(notification._id, e)}
                      className={styles.deleteButton}
                      aria-label="Delete notification"
                    >
                      <i className="icon-close" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {notifications.length > 0 && (
        <div className={styles.dropdownFooter}>
          <Link href="/notifications" onClick={onClose} className={styles.viewAllLink}>
            {tCommon('viewAllNotifications')}
          </Link>
        </div>
      )}
    </div>
  );
}

