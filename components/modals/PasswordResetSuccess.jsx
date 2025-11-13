"use client";
import React from "react";
import styles from "./PasswordResetSuccess.module.css";

export default function PasswordResetSuccess({ isOpen, onClose, onLogin }) {
  if (!isOpen) return null;

  const handleLoginClick = () => {
    if (onLogin) {
      onLogin();
    }
    onClose();
  };

  const handleCloseClick = () => {
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseClick();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
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
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" role="img" aria-label="Success icon">
              <circle 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="#25c55b" 
                strokeWidth="2"
                fill="#25c55b"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className={styles.title}>Password Reset Successful!</h2>
          
          <p className={styles.message}>
            Your password has been reset successfully. You can now log in with your new password.
          </p>

          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.loginButton}
              onClick={handleLoginClick}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles.buttonIcon} aria-hidden="true">
                <path
                  d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Login Now
            </button>
            
            <button
              type="button"
              className={styles.closeButtonSecondary}
              onClick={handleCloseClick}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
