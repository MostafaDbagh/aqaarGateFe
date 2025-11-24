"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";
import styles from "./ForgotPassword.module.css";

export default function ForgotPassword({ isOpen, onClose, onSubmit }) {
  const pathname = usePathname();
  
  // Extract locale from pathname (e.g., /ar/... or /en/...)
  const locale = pathname?.split('/')[1] || 'en';
  const isRTL = locale === 'ar';
  
  // Use safe translations hook that works even without provider
  const t = useSafeTranslations('forgotPassword');
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError(t('emailInvalid'));
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    
    // Validate email is not empty
    if (!email || email.trim().length === 0) {
      setEmailError(t('emailRequired'));
      return;
    }
    
    // Validate email format before submitting
    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the onSubmit function passed from parent
      await onSubmit(email.trim().toLowerCase());
      // Don't clear email here - parent needs it for next step
      setEmailError("");
    } catch (err) {
      // Extract error message from different error formats
      let errorMsg = t('sendFailed');
      if (err?.message) {
        errorMsg = err.message;
      } else if (err?.error) {
        errorMsg = err.error;
      } else if (typeof err === 'string') {
        errorMsg = err;
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setEmailError("");
    onClose();
  };


  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className={styles.modalOverlay} dir={isRTL ? 'rtl' : 'ltr'} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button 
          className={styles.closeButton} 
          onClick={handleClose} 
          aria-label="Close modal"
        >
          <i className="icon-close" />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.iconWrapper}>
            <i className="icon-mail" />
          </div>
          <h2 className={styles.modalTitle}>{t('title')}</h2>
          <p className={styles.modalSubtitle}>
            {t('subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>{t('email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={validateEmail}
              placeholder={t('emailPlaceholder')}
              className={styles.formInput}
              autoComplete="email"
              autoFocus
            />
            {emailError && (
              <span className={styles.errorSpan}>{emailError}</span>
            )}
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <i className="icon-alert-circle" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !email || email.trim().length === 0}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner} />
                {t('sending')}
              </>
            ) : (
              <>
                <i className="icon-mail" />
                {t('sendResetCode')}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            className={styles.backButton}
          >
            <i className="icon-arrow-left-1" />
            {t('backToLogin')}
          </button>
        </form>
      </div>
    </div>
  );
}

