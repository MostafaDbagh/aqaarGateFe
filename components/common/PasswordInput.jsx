"use client";
import React, { useState } from "react";
import { useLocale } from "next-intl";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import styles from "./PasswordInput.module.css";

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  className = "",
  error = null
}) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`box-fieldset ${className}`}>
      {label && (
        <label htmlFor={id}>
          {label}{required && <span>*</span>}
        </label>
      )}
      <div className={styles.passwordContainer}>
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          className={`form-contact ${styles.passwordInput} ${error ? styles.inputError : ''} ${isRTL ? styles.rtlInput : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`${styles.eyeButton} ${isRTL ? styles.eyeButtonRTL : ''}`}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOffIcon width={20} height={20} stroke="#6b7280" />
          ) : (
            <EyeIcon width={20} height={20} stroke="#6b7280" />
          )}
        </button>
      </div>
      {error && (
        <span className={styles.errorText}>{error}</span>
      )}
    </div>
  );
}




