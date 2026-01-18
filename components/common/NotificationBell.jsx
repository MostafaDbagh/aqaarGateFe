"use client";
import React, { useState, useRef, useEffect } from "react";
import { useUnreadCount, useNotificationMutations } from "@/apis/hooks";
import NotificationDropdown from "./NotificationDropdown";
import BellIcon from "@/components/icons/BellIcon";
import styles from "./NotificationBell.module.css";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: unreadCountData } = useUnreadCount();
  const unreadCount = unreadCountData?.data?.unreadCount || 0;
  const hasNotifications = unreadCount > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleBellClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className={styles.notificationBellContainer}>
      <button
        type="button"
        onClick={handleBellClick}
        className={`${styles.bellButton} ${hasNotifications ? styles.hasNotifications : ''}`}
        aria-label="Notifications"
      >
        <BellIcon 
          className={styles.bellIcon}
          stroke={hasNotifications ? "#6366f1" : "#757575"}
          width={24}
          height={24}
        />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>
      {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
    </div>
  );
}

