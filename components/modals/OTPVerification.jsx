"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";
import { authAPI } from "@/apis/auth";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import styles from "./OTPVerification.module.css"

export default function OTPVerification({ 
  isOpen, 
  onClose, 
  onSuccess, 
  userData,
  email,
  type = 'signup'
}) {
  const pathname = usePathname();
  
  // Extract locale from pathname (e.g., /ar/... or /en/...)
  const locale = pathname?.split('/')[1] || 'en';
  const isRTL = locale === 'ar';
  
  // Use safe translations hook that works even without provider
  const t = useSafeTranslations('otpVerification');
  const tRegistrationSuccess = useSafeTranslations('registrationSuccess');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes in seconds
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const inputRefs = useRef([]);
  const { showSuccessModal, showWarningModal } = useGlobalModal();

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Clear OTP and auto-focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setOtpVerified(false);
      setResendCooldown(300); // disable resend for first 5 minutes after opening
      setOtpTimer(300); // reset OTP countdown on open
      if (inputRefs.current[0]) {
        setTimeout(() => { inputRefs.current[0].focus(); }, 100);
      }
    }
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => { setResendCooldown(resendCooldown - 1); }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // OTP countdown (5 minutes)
  useEffect(() => {
    if (!isOpen) return;
    if (otpTimer <= 0) return;
    const timer = setTimeout(() => { setOtpTimer((prev) => Math.max(prev - 1, 0)); }, 1000);
    return () => clearTimeout(timer);
  }, [otpTimer, isOpen]);

  const formatSeconds = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Auto-verify OTP when all 6 digits are filled
  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 6 && !otpVerified && !isLoading && email) {
      // Only auto-verify if we have all 6 digits, not verified yet, not loading, and email exists
      handleVerifyOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp.join(''), otpVerified, isLoading, email]);

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = async (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    
    // Extract only numeric digits from pasted text
    const digits = pastedText.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length > 0) {
      const newOtp = [...otp];
      // Fill boxes with pasted digits
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || '';
      }
      setOtp(newOtp);
      setError('');
      
      // Focus the appropriate input box
      // If we got 6 digits, focus the last one (will auto-verify)
      // Otherwise, focus the next empty box
      if (digits.length === 6) {
        inputRefs.current[5]?.focus();
      } else {
        const nextIndex = Math.min(digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError(t('enterAllDigits'));
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const verifyResult = await authAPI.verifyOTP(email, otpString, type);
      if (verifyResult.success) {
        setOtpVerified(true);
        if (type === 'signup') {
          const result = await authAPI.signup(userData);
          if (result.success) {
            showSuccessModal(
              tRegistrationSuccess('title'),
              tRegistrationSuccess('message'),
              userData?.email,
              true // showLoginButton - only for registration
            );
            onClose();
          } else {
            showWarningModal(
              "Registration Failed",
              result.message || "Registration failed. Please try again.",
              userData?.email
            );
          }
        } else if (type === 'forgot_password') {
          onSuccess(otpString);
        }
      } else {
        setError(t('invalidOTP'));
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      // Extract error message from different error formats
      let errorMsg = t('verificationFailed');
      if (error?.message) {
        errorMsg = error.message;
      } else if (error?.error) {
        errorMsg = error.error;
      } else if (typeof error === 'string') {
        errorMsg = error;
      } else if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      
      setError(errorMsg);
      setOtp(['', '', '', '', '', '']);
      // Reset focus after a short delay to ensure input is cleared
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    // Start cooldown immediately to avoid multiple OTP generations
    setResendCooldown(300); // 5 minutes
    setOtpTimer(300);       // reset OTP expiry timer
    setIsSendingOTP(true);
    setError('');
    try {
      await authAPI.sendOTP(email, type);
    } catch (error) {
      setError(t('verificationFailed'));
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleClose = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResendCooldown(0);
    setOtpVerified(false);
    onClose();
  };

  if (!isOpen || !isMounted) return null;

  return (
    <div 
      className={styles.overlay}
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
      {/* Modal content */}
      <div 
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <h4 className={styles.title}>
            {type === 'forgot_password' ? t('titleForgotPassword') : t('title')}
          </h4>
          <span
            onClick={handleClose}
            className={styles.closeIcon}
          >
            ×
          </span>
        </div>
        
        {/* Email section */}
        <div className={styles.emailSection}>
          <div className={styles.emailIcon}>📧</div>
          <p className={styles.emailText}>
            {type === 'forgot_password' ? t('sentResetCode') : t('sentCode')}
          </p>
          <p className={styles.emailAddress}>
            {email}
          </p>
          
          {/* OTP Warning */}
          <div className={styles.warningBox}>
            <p className={styles.warningText}>
              <span>⏰</span>
              {t('otpExpires')} — {formatSeconds(otpTimer)}
            </p>
          </div>
        </div>

        {/* OTP Input */}
        <form onSubmit={handleVerifyOTP}>
          <div className={styles.otpBlock}>
            <label className={styles.otpLabel}>
              {t('enterCode')}
            </label>
            <div className={styles.otpInputs}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  maxLength="1"
                  className={styles.otpInput}
                  onFocus={(e) => { e.target.classList.add(styles.otpInputFocused); }}
                  onBlur={(e) => { e.target.classList.remove(styles.otpInputFocused); }}
                />
              ))}
            </div>
            {error && (
              <div className={styles.errorAlert}>
                {error}
              </div>
            )}
          </div>

          {/* Submit button */}
          <div className={styles.submitBlock}>
            <button
              type="submit"
              disabled={otp.join('').length !== 6 || isLoading}
              className={`${styles.submitButton} ${otp.join('').length === 6 && !isLoading ? styles.submitEnabled : styles.submitDisabled}`}
            >
              {type === 'forgot_password' 
                ? (isLoading ? t('verifying') : t('verifyAndReset'))
                : (isLoading ? t('verifying') : otpVerified ? t('completing') : t('verifyAndComplete'))
              }
            </button>
          </div>

          {/* Resend section */}
          <div className={styles.resendSection}>
            <p className={styles.resendText}>
              {t('didntReceive')}
            </p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendCooldown > 0 || isSendingOTP}
              className={styles.resendButton}
            >
              {isSendingOTP ? t('resending') : t('resendCode')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}