"use client";
import React, { useState } from "react";
import { userAPI } from "@/apis";
import logger from "@/utlis/logger";
import PasswordInput from "../common/PasswordInput";
import styles from "./ChangePasswordSection.module.css";

export default function ChangePasswordSection({ userId, onPasswordChanged }) {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    setSaving(true);

    try {
      await userAPI.changePassword(
        userId,
        passwordData.oldPassword,
        passwordData.newPassword
      );

      // Reset form
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess(true);
      if (onPasswordChanged) {
        onPasswordChanged("Password changed successfully!");
      }
    } catch (error) {
      logger.error("Error changing password:", error);
      const errorMessage = error?.response?.data?.message || "Failed to change password";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.changePasswordSection}>
      <h5 className={styles.title}>Change password</h5>
      <form onSubmit={handleSubmitPassword} className={styles.formContainer}>
        <div className="box grid-layout-3 gap-30">
          <PasswordInput
            id="oldPassword"
            label="Old Password"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
            placeholder="Old Password"
            autoComplete="current-password"
            required
            error={error && error.includes("old") ? error : null}
          />
          <PasswordInput
            id="newPassword"
            label="New Password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder="New Password"
            autoComplete="new-password"
            required
            error={error && error.includes("New password") ? error : null}
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm Password"
            autoComplete="new-password"
            required
            className="mb-30"
            error={error && error.includes("match") ? error : null}
          />
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            Password changed successfully!
          </div>
        )}

        <div className={`box ${styles.submitButton}`}>
          <button 
            type="submit" 
            className="tf-btn bg-color-primary pd-20"
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

