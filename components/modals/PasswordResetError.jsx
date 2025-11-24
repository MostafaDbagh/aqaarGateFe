"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";
import styles from "./PasswordResetError.module.css";

export default function PasswordResetError({ isOpen, onClose, onRetry, errorMessage }) {
  const pathname = usePathname();
  
  // Extract locale from pathname (e.g., /ar/... or /en/...)
  const locale = pathname?.split('/')[1] || 'en';
  const isRTL = locale === 'ar';
  
  // Use safe translations hook that works even without provider
  const t = useSafeTranslations('passwordResetError');
  if (!isOpen) return null;

  const handleRetryClick = () => {
    if (onRetry) {
      onRetry();
    }
  };

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={handleCloseClick} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" role="img" aria-label="Error icon">
              <circle 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="#F59E0B" 
                strokeWidth="2"
              />
              <path
                d="M12 8v4M12 16h.01"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className={styles.title}>{t('title')}</h2>
          
          <p className={styles.message}>
            {errorMessage || t('defaultMessage')}
          </p>

          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.retryButton}
              onClick={handleRetryClick}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles.buttonIcon} aria-hidden="true">
                <path
                  d="M1 4v6h6M23 20v-6h-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t('tryAgain')}
            </button>
            
            <button
              type="button"
              className={styles.closeButtonSecondary}
              onClick={handleCloseClick}
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

