"use client";
import React, { useState } from "react";
import styles from "./ForgotPassword.module.css";

export default function ForgotPassword({ isOpen, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
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
    
    // Validate email before submitting
    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the onSubmit function passed from parent
      await onSubmit(email);
      setEmail("");
      setEmailError("");
    } catch (err) {
      setError(err.message || "Failed to send reset code. Please try again.");
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
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
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
          <h2 className={styles.modalTitle}>Forgot Password?</h2>
          <p className={styles.modalSubtitle}>
            No worries! Enter your email and we'll send you a reset code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={validateEmail}
              placeholder="Enter your email"
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
                Sending...
              </>
            ) : (
              <>
                <i className="icon-mail" />
                Send Reset Code
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            className={styles.backButton}
          >
            <i className="icon-arrow-left-1" />
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

