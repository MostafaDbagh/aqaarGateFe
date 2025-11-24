"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon } from "@/components/icons";
import { authAPI } from "@/apis/auth";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import styles from "./Login.module.css";

export default function Login({ isOpen, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract locale from pathname (e.g., /ar/... or /en/...)
  const locale = pathname?.split('/')[1] || 'en';
  const isRTL = locale === 'ar';
  
  // Use safe translations hook that works even without provider
  const t = useSafeTranslations('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Use GlobalModal context for other modals
  const { showRegisterModal, showForgotPasswordModal } = useGlobalModal();

  const closeModal = useCallback(() => {
    // Reset form when closing
    setFormData({ email: '', password: '' });
    setShowPassword(false);
    setError('');
    onClose();
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleForgotPasswordClick = () => {
    // Close login modal first, then open forgot password flow
    closeModal();
    setTimeout(() => {
      showForgotPasswordModal();
    }, 200);
  };

  const handleSwitchToRegister = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close login modal and open register modal
    closeModal();
    setTimeout(() => {
      showRegisterModal();
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authAPI.signin(formData);
      
      // Close the modal
      closeModal();
      
      // No force redirect - let users navigate manually
      // Users can access their dashboards through the sidebar or navigation
      
    } catch (error) {
      setError(error.message || t('loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={styles.modalOverlay}
      dir={isRTL ? 'rtl' : 'ltr'}
      onClick={(e) => {
        // Prevent closing modal when clicking outside - only X button can close
        // Only prevent if clicking directly on overlay (not on container or its children)
        if (e.target === e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
          // Do nothing - modal should not close
        }
      }}
    >
      <div className={styles.modalContent}>
        <button 
          className={styles.closeButton} 
          onClick={closeModal} 
          aria-label="Close modal"
        >
          <i className="icon-close" />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.iconWrapper}>
            <i className="icon-login" />
          </div>
          <h2 className={styles.modalTitle}>{t('title')}</h2>
          <p className={styles.modalSubtitle}>
            {t('subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>{t('email')}</label>
            <div className={styles.inputWithIcon}>
              <UserIcon className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('emailPlaceholder')}
                className={styles.formInput}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>{t('password')}</label>
            <div className={styles.inputWithIcon}>
              <LockIcon className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('passwordPlaceholder')}
                className={styles.formInput}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOffIcon width={20} height={20} />
                ) : (
                  <EyeIcon width={20} height={20} />
                )}
              </button>
            </div>
            <div className={styles.forgotPasswordLink}>
              <button
                type="button"
                onClick={handleForgotPasswordClick}
              >
                {t('forgotPassword')}
              </button>
            </div>
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                {t('signingIn')}
              </>
            ) : (
              <>
                <i className="icon-login" />
                {t('signIn')}
              </>
            )}
          </button>

          <div className={styles.signUpLink}>
            {t('dontHaveAccount')}{" "}
            <a
            style={{fontSize:'16px'}}
              href="#"
              onClick={handleSwitchToRegister}
            >
              {t('register')}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
