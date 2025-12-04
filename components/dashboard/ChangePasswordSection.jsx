"use client";
import React, { useState } from "react";
import { userAPI } from "@/apis";
import logger from "@/utlis/logger";
import PasswordInput from "../common/PasswordInput";
import styles from "./ChangePasswordSection.module.css";
import { useTranslations } from 'next-intl';

export default function ChangePasswordSection({ userId, onPasswordChanged }) {
  const t = useTranslations('agent.profile.changePassword');
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
      setError(t('passwordsDoNotMatch'));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError(t('passwordMinLength'));
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
        onPasswordChanged(t('passwordChangedSuccessfully'));
      }
    } catch (error) {
      logger.error("Error changing password:", error);
      const errorMessage = error?.response?.data?.message || t('failedToChangePassword');
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.changePasswordSection}>
      <h5 className={styles.title}>{t('title')}</h5>
      <form onSubmit={handleSubmitPassword} className={styles.formContainer}>
        <div className="box grid-layout-3 gap-30">
          <PasswordInput
            id="oldPassword"
            label={t('oldPassword')}
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
            placeholder={t('oldPasswordPlaceholder')}
            autoComplete="current-password"
            required
            error={error && error.includes("old") ? error : null}
          />
          <PasswordInput
            id="newPassword"
            label={t('newPassword')}
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder={t('newPasswordPlaceholder')}
            autoComplete="new-password"
            required
            error={error && error.includes("New password") ? error : null}
          />
          <PasswordInput
            id="confirmPassword"
            label={t('confirmPassword')}
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            placeholder={t('confirmPasswordPlaceholder')}
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
            {t('passwordChangedSuccessfully')}
          </div>
        )}

        <div className={`box ${styles.submitButton}`}>
          <button 
            type="submit" 
            className="tf-btn bg-color-primary pd-20"
            disabled={saving}
          >
            {saving ? t('updating') : t('updatePassword')}
          </button>
        </div>
      </form>
    </div>
  );
}

