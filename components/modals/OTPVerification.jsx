"use client";
import React, { useState, useEffect, useRef } from "react";
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
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
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

  // Auto-verify OTP when all 6 digits are filled
  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 6 && !otpVerified && !isLoading) {
      handleVerifyOTP();
    }
  }, [otp, otpVerified, isLoading]);

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

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
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
              "Registration Successful!",
              "Your account has been created successfully. You can now login with your credentials.",
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
        setError('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      if (error.message) setError(error.message);
      else if (error.error) setError(error.error);
      else if (typeof error === 'string') setError(error);
      else setError('OTP verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setIsSendingOTP(true);
    setError('');
    try {
      await authAPI.sendOTP(email, type);
      setResendCooldown(30);
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
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
      onClick={(e) => { if (e.target === e.currentTarget) { handleClose(); } }}
    >
      {/* Modal content */}
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h4 className={styles.title}>
            {type === 'forgot_password' ? 'Email Verification for Reset Password' : 'Verify Your Email'}
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
            {type === 'forgot_password' ? "We've sent a password reset code to" : "We've sent a 6-digit code to"}
          </p>
          <p className={styles.emailAddress}>
            {email}
          </p>
          
          {/* OTP Warning */}
          <div className={styles.warningBox}>
            <p className={styles.warningText}>
              <span>⏰</span>
              OTP will expire after 5 minutes
            </p>
          </div>
        </div>

        {/* OTP Input */}
        <form onSubmit={handleVerifyOTP}>
          <div className={styles.otpBlock}>
            <label className={styles.otpLabel}>
              Enter verification code
            </label>
            <div className={styles.otpInputs}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
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
                ? (isLoading ? 'Verifying...' : 'Verify & Reset Password')
                : (isLoading ? 'Verifying...' : otpVerified ? 'Completing Registration...' : 'Verify & Complete Registration')
              }
            </button>
          </div>

          {/* Resend section */}
          <div className={styles.resendSection}>
            <p className={styles.resendText}>
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendCooldown > 0 || isSendingOTP}
              className={styles.resendButton}
            >
              {isSendingOTP ? 'Sending...' : 
               resendCooldown > 0 ? 'Resend in ' + resendCooldown + 's' : 
               'Resend Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}