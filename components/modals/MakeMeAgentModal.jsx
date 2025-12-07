"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { userAPI, authAPI } from "@/apis";
import { countryCodes, DEFAULT_COUNTRY_CODE, extractCountryCode } from "@/constants/countryCodes";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import logger from "@/utlis/logger";
import styles from "./MakeMeAgentModal.module.css";

// Wrapper component to ensure translations are available
function MakeMeAgentModalContent({ isOpen, onClose }) {
  const { showSuccessModal } = useGlobalModal();
  const pathname = usePathname();
  const locale = useLocale();
  // Extract locale from pathname (e.g., /ar/... or /en/...)
  const localeFromPath = pathname?.split('/')[1] || locale || 'en';
  const isRTL = localeFromPath === 'ar';
  // Always call useTranslations - it should work since we're inside NextIntlClientProvider
  const t = useTranslations('makeMeAgent');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    countryCode: DEFAULT_COUNTRY_CODE,
    job: "",
    company: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Load user data
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Extract phone number if exists
        let phoneNumber = userData.phone || "";
        let countryCode = DEFAULT_COUNTRY_CODE;
        
        if (phoneNumber) {
          const extracted = extractCountryCode(phoneNumber);
          if (extracted) {
            countryCode = extracted.countryCode;
            phoneNumber = extracted.phoneNumber;
          }
        }
        
        setFormData({
          email: userData.email || "",
          phone: phoneNumber,
          countryCode: countryCode,
          job: userData.job || "",
          company: userData.company || "",
        });
      }
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    if (id === "phone") {
      // Prevent phone number from starting with 0
      let phoneValue = value;
      if (phoneValue && phoneValue.trim().startsWith('0')) {
        phoneValue = phoneValue.replace(/^0+/, ''); // Remove leading zeros
        setErrors(prev => ({
          ...prev,
          phone: t('errors.phoneNoLeadingZero') || "Type your number without 0 in beginning"
        }));
      } else {
        // Clear error if valid
        setErrors(prev => ({
          ...prev,
          phone: prev.phone === (t('errors.phoneNoLeadingZero') || "Type your number without 0 in beginning") ? "" : prev.phone
        }));
      }
      setFormData(prev => ({
        ...prev,
        [id]: phoneValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
      // Clear error for this field when user starts typing
      if (errors[id]) {
        setErrors(prev => ({
          ...prev,
          [id]: ""
        }));
      }
    }
  };

  const validatePhoneField = () => {
    if (!formData.phone || formData.phone.trim() === "") {
      setErrors(prev => ({ ...prev, phone: t('errors.phoneRequired') }));
      return false;
    } else {
      // Remove all non-digit characters for validation
      const digitsOnly = formData.phone.replace(/\D/g, '');
      // Check if phone starts with 0
      if (digitsOnly.startsWith('0')) {
        setErrors(prev => ({ ...prev, phone: t('errors.phoneNoLeadingZero') || "Type your number without 0 in beginning" }));
        return false;
      } else if (digitsOnly.length < 9) {
        setErrors(prev => ({ ...prev, phone: t('errors.phoneMinLength') || "Phone number must be at least 9 digits" }));
        return false;
      } else if (digitsOnly.length > 15) {
        setErrors(prev => ({ ...prev, phone: t('errors.phoneMaxLength') || "Phone number must be at most 15 digits" }));
        return false;
      } else {
        setErrors(prev => ({ ...prev, phone: "" }));
        return true;
      }
    }
  };

  // Check if phone number is valid
  const isPhoneValid = () => {
    if (!formData.phone || formData.phone.trim() === "") {
      return false;
    }
    const digitsOnly = formData.phone.replace(/\D/g, '');
    // Check if phone starts with 0
    if (digitsOnly.startsWith('0')) {
      return false;
    }
    return digitsOnly.length >= 9 && digitsOnly.length <= 15;
  };

  // Check if form is valid (for button disabled state)
  const isFormValidForSubmit = () => {
    return isPhoneValid() &&
           formData.job && formData.job.trim() !== "" &&
           formData.company && formData.company.trim() !== "";
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.phone || formData.phone.trim() === "") {
      newErrors.phone = t('errors.phoneRequired');
    } else {
      // Remove all non-digit characters for validation
      const digitsOnly = formData.phone.replace(/\D/g, '');
      // Check if phone starts with 0
      if (digitsOnly.startsWith('0')) {
        newErrors.phone = t('errors.phoneNoLeadingZero') || "Type your number without 0 in beginning";
      } else if (digitsOnly.length < 9) {
        newErrors.phone = t('errors.phoneMinLength') || "Phone number must be at least 9 digits";
      } else if (digitsOnly.length > 15) {
        newErrors.phone = t('errors.phoneMaxLength') || "Phone number must be at most 15 digits";
      }
    }
    
    if (!formData.job || formData.job.trim() === "") {
      newErrors.job = t('errors.jobRequired');
    }
    
    if (!formData.company || formData.company.trim() === "") {
      newErrors.company = t('errors.companyRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare update data
      const updateData = {
        phone: formData.phone ? `${formData.countryCode}${formData.phone}` : "",
        job: formData.job,
        company: formData.company,
      };

      // First update the profile
      await userAPI.updateProfile(user._id, updateData);
      
      // Then make the user an agent
      const agentResult = await authAPI.makeAgent(user._id);
      
      // Update localStorage with new user data
      const finalUser = agentResult.user || user;
      localStorage.setItem("user", JSON.stringify(finalUser));
      
      // Close modal
      onClose();
      
      // Show success message with verification notice
      showSuccessModal(
        t('success.title'),
        t('success.message'),
        finalUser.email
      );
      
      // Reload page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      logger.error("Error making agent:", error);
      setErrors({ submit: error.message || t('errors.submitFailed') });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{t('title')}</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              {t('email')}:<span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              className={`${styles.input} ${styles.inputDisabled}`}
              disabled
            />
            <p className={styles.helperText}>{t('emailCannotBeChanged')}</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              {t('phoneNumber')}:<span className={styles.required}>*</span>
            </label>
            <div className={styles.phoneInputContainer}>
              <select
                id="countryCode"
                value={formData.countryCode}
                onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                className={styles.countryCodeSelect}
              >
                {countryCodes.map((country, index) => (
                  <option key={`${country.code}-${country.country}-${index}`} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={validatePhoneField}
                className={`${styles.phoneInput} ${errors.phone ? styles.inputError : ''}`}
                placeholder={t('phonePlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
                style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}
                autoComplete="off"
                required
              />
            </div>
            {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="job" className={styles.label}>
              {t('job')}:<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="job"
              value={formData.job}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.job ? styles.inputError : ''}`}
              placeholder={t('jobPlaceholder')}
              required
            />
            {errors.job && <p className={styles.errorText}>{errors.job}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="company" className={styles.label}>
              {t('company')}:<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.company ? styles.inputError : ''}`}
              placeholder={t('companyPlaceholder')}
              required
            />
            {errors.company && <p className={styles.errorText}>{errors.company}</p>}
          </div>

          {errors.submit && (
            <div className={styles.errorMessage}>
              {errors.submit}
            </div>
          )}

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !isFormValidForSubmit()}
            >
              {loading ? t('processing') : t('makeMeAgent')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

// Main component that conditionally renders the content
export default function MakeMeAgentModal({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render if we're on the client, mounted, and modal is open
  if (!mounted || typeof window === 'undefined' || !isOpen) {
    return null;
  }

  return <MakeMeAgentModalContent isOpen={isOpen} onClose={onClose} />;
}

