"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import styles from "./NewPassword.module.css";
import logger from "@/utlis/logger";

export default function NewPassword({ isOpen, onClose, onSubmit }) {
  const pathname = usePathname();
  
  // Extract locale from pathname (e.g., /ar/... or /en/...)
  const locale = pathname?.split('/')[1] || 'en';
  const isRTL = locale === 'ar';
  
  // Use safe translations hook that works even without provider
  const t = useSafeTranslations('newPassword');
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
    // Clear field error when user starts typing
    setFieldErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const validateField = (fieldName) => {
    let error = "";
    
    if (fieldName === "password") {
      if (formData.password && formData.password.length < 6) {
        error = t('passwordMinLength');
      }
    } else if (fieldName === "confirmPassword") {
      if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
        error = t('passwordsNotMatch');
      }
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const validatePassword = () => {
    if (formData.password.length < 6) {
      return t('passwordMinLength');
    }
    if (formData.password !== formData.confirmPassword) {
      return t('passwordsNotMatch');
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate both fields are filled
    if (!formData.password || formData.password.trim().length === 0) {
      setError(t('passwordRequired'));
      setFieldErrors(prev => ({ ...prev, password: t('passwordRequired') }));
      return;
    }
    
    if (!formData.confirmPassword || formData.confirmPassword.trim().length === 0) {
      setError(t('confirmRequired'));
      setFieldErrors(prev => ({ ...prev, confirmPassword: t('confirmRequired') }));
      return;
    }
    
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit(formData.password.trim());
      // Don't clear form data here - parent handles success/error
      setError(""); // Clear any errors on success
    } catch (err) {
      // Extract error message from different error formats
      let errorMsg = t('resetFailed');
      if (err?.message) {
        errorMsg = err.message;
      } else if (err?.error) {
        errorMsg = err.error;
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      logger.error("NewPassword error:", errorMsg);
      // Set local error for immediate feedback, parent will also show error modal
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ password: "", confirmPassword: "" });
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
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
            <i className="icon-lock" />
          </div>
          <h2 className={styles.modalTitle}>{t('title')}</h2>
          <p className={styles.modalSubtitle}>
            {t('subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>{t('newPassword')}</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => validateField("password")}
                placeholder={t('newPasswordPlaceholder')}
                className={styles.formInput}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {fieldErrors.password ? (
              <span className={styles.errorSpan}>{fieldErrors.password}</span>
            ) : (
              <p className={styles.hint}>{t('mustBe6Chars')}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              {t('confirmPassword')}
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => validateField("confirmPassword")}
                placeholder={t('confirmPasswordPlaceholder')}
                className={styles.formInput}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <span className={styles.errorSpan}>{fieldErrors.confirmPassword}</span>
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
            disabled={
              isSubmitting || 
              !formData.password || 
              !formData.confirmPassword ||
              formData.password.trim().length === 0 ||
              formData.confirmPassword.trim().length === 0
            }
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner} />
                {t('resetting')}
              </>
            ) : (
              <>
                <i className="icon-check" />
                {t('resetPassword')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

