"use client";
import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import styles from "./NewPassword.module.css";
import logger from "@/utlis/logger";

export default function NewPassword({ isOpen, onClose, onSubmit }) {
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
        error = "Password must be at least 6 characters";
      }
    } else if (fieldName === "confirmPassword") {
      if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
        error = "Passwords do not match";
      }
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const validatePassword = () => {
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate both fields are filled
    if (!formData.password || formData.password.trim().length === 0) {
      setError("Password is required");
      setFieldErrors(prev => ({ ...prev, password: "Password is required" }));
      return;
    }
    
    if (!formData.confirmPassword || formData.confirmPassword.trim().length === 0) {
      setError("Please confirm your password");
      setFieldErrors(prev => ({ ...prev, confirmPassword: "Please confirm your password" }));
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
      let errorMsg = "Failed to reset password. Please try again.";
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
            <i className="icon-lock" />
          </div>
          <h2 className={styles.modalTitle}>Create New Password</h2>
          <p className={styles.modalSubtitle}>
            Your new password must be different from previously used passwords.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>New Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => validateField("password")}
                placeholder="Enter new password"
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
              <p className={styles.hint}>Must be at least 6 characters</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => validateField("confirmPassword")}
                placeholder="Confirm new password"
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
                Resetting...
              </>
            ) : (
              <>
                <i className="icon-check" />
                Reset Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

