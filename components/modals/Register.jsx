"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useFileTranslations } from "@/hooks/useFileTranslations";
import { UserIcon, EmailIcon, LockIcon, EyeIcon, EyeOffIcon } from "@/components/icons";
import { authAPI } from "@/apis/auth";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import { countryCodes, DEFAULT_COUNTRY_CODE } from "@/constants/countryCodes";
import styles from "./Register.module.css";

export default function Register({ isOpen, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract locale from pathname (e.g., /ar/... or /en/...)
  const locale = pathname?.split('/')[1] || 'en';
  const isRTL = locale === 'ar';
  
  // Use file-based translations (works without NextIntlClientProvider)
  const t = useFileTranslations('register');
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    phone: "",
    countryCode: DEFAULT_COUNTRY_CODE,
    company: "",
    job: "",
    agreeToTerms: false
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Use GlobalModal context for other modals
  const { showLoginModal, showOTPModal, hideAllModals } = useGlobalModal();

  // Function to completely reset form data (call this after successful registration)
  const resetFormData = useCallback(() => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      phone: "",
      countryCode: DEFAULT_COUNTRY_CODE,
      company: "",
      job: "",
      agreeToTerms: false
    });
    setFieldErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
  }, []);

  const closeModal = useCallback(() => {
    // Keep form data persistent - only clear password fields for security
    setFormData(prev => ({
      ...prev,
      password: "",
      confirmPassword: ""
    }));
    setFieldErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If switching from agent to user, clear agent-specific fields
    if (name === "role" && value === "user") {
      setFormData(prev => ({
        ...prev,
        role: "user",
        phone: "",
        company: "",
        job: "",
        countryCode: DEFAULT_COUNTRY_CODE
      }));
      setFieldErrors(prev => ({
        ...prev,
        phone: "",
        company: "",
        job: ""
      }));
    } else if (name === "phone" && formData.role === "agent") {
      // Prevent phone number from starting with 0
      let phoneValue = value;
      if (phoneValue && phoneValue.trim().startsWith('0')) {
        phoneValue = phoneValue.replace(/^0+/, ''); // Remove leading zeros
        setFieldErrors(prev => ({
          ...prev,
          phone: t('errors.phoneNoLeadingZero') || "Type your number without 0 in beginning"
        }));
      } else {
        // Clear error if valid
        setFieldErrors(prev => ({
          ...prev,
          phone: prev.phone === (t('errors.phoneNoLeadingZero') || "Type your number without 0 in beginning") ? "" : prev.phone
        }));
      }
      setFormData(prev => ({
        ...prev,
        [name]: phoneValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear field error when user types (except for leading zero error)
    if (name !== "phone" || formData.role !== "agent" || !value.trim().startsWith('0')) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: name === "phone" && formData.role === "agent" && value.trim().startsWith('0') 
          ? prev[name] 
          : ""
      }));
    }
    
    // Clear general error when user starts typing
    if (error) {
      setError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateField = (fieldName) => {
    let error = "";
    
    switch(fieldName) {
      case "username":
        if (formData.username && formData.username.length < 3) {
          error = t('errors.usernameMinLength');
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
          error = t('errors.emailInvalid');
        }
        break;
      case "password":
        if (formData.password && formData.password.length < 6) {
          error = t('errors.passwordMinLength');
        }
        break;
      case "confirmPassword":
        if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
          error = t('errors.passwordsNotMatch');
        }
        break;
      case "phone":
        if (formData.role === "agent") {
          if (!formData.phone || formData.phone.trim() === "") {
            error = t('errors.phoneRequired');
          } else {
            // Remove all non-digit characters for validation
            const digitsOnly = formData.phone.replace(/\D/g, '');
            // Check if phone starts with 0
            if (digitsOnly.startsWith('0')) {
              error = t('errors.phoneNoLeadingZero') || "Type your number without 0 in beginning";
            } else if (digitsOnly.length < 9) {
              error = t('errors.phoneMinLength') || "Phone number must be at least 9 digits";
            } else if (digitsOnly.length > 15) {
              error = t('errors.phoneMaxLength') || "Phone number must be at most 15 digits";
            }
          }
        }
        break;
      case "company":
        if (formData.role === "agent") {
          if (!formData.company || formData.company.trim() === "") {
            error = t('errors.companyRequired');
          }
        }
        break;
      case "job":
        if (formData.role === "agent") {
          if (!formData.job || formData.job.trim() === "") {
            error = t('errors.jobRequired');
          }
        }
        break;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use the original form data without any modifications
      const userDataForRegistration = {
        ...formData
      };
      
      // Send OTP API call for signup
      await authAPI.sendOTP(userDataForRegistration.email, 'signup');
      
      // Close registration modal first
      closeModal();
      
      // Show OTP modal after a short delay using GlobalModalContext
      setTimeout(() => {
        showOTPModal(userDataForRegistration, formData.email, 'signup');
      }, 300);
      
    } catch (error) {
      setError(error.message || t('errors.otpFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // Check if phone number is valid (for agent role)
  const isPhoneValid = () => {
    if (formData.role !== "agent") {
      return true; // Phone not required for regular users
    }
    if (!formData.phone || formData.phone.trim() === "") {
      return false;
    }
    // Remove all non-digit characters for validation
    const digitsOnly = formData.phone.replace(/\D/g, '');
    // Check if phone starts with 0
    if (digitsOnly.startsWith('0')) {
      return false;
    }
    return digitsOnly.length >= 9 && digitsOnly.length <= 15;
  };

  const isFormValid = () => {
    const baseValid = formData.username &&
           formData.email &&
           formData.password &&
           formData.confirmPassword &&
           formData.password === formData.confirmPassword &&
           formData.password.length >= 6 &&
           formData.agreeToTerms &&
           Object.values(fieldErrors).every(error => !error);
    
    // If agent, also require phone, company, and job, and phone must be valid
    if (formData.role === "agent") {
      return baseValid &&
             isPhoneValid() &&
             formData.phone &&
             formData.phone.trim() !== "" &&
             formData.company &&
             formData.company.trim() !== "" &&
             formData.job &&
             formData.job.trim() !== "";
    }
    
    return baseValid;
  };

  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close register modal and open login modal
    closeModal();
    setTimeout(() => {
      showLoginModal();
    }, 300);
  };

  const handlePolicyLinkClick = useCallback((event, href) => {
    event.preventDefault();
    event.stopPropagation();
    closeModal();
    router.push(href);
  }, [closeModal, hideAllModals, router]);


  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!isOpen) return null;

    return (
      <>
        {/* Clean Modern Register Modal */}
        <div className={styles.modalOverlay} dir={isRTL ? 'rtl' : 'ltr'} onClick={handleOverlayClick}>
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
              <i className="icon-user-plus" />
            </div>
            <h2 className={styles.modalTitle}>{t('title')}</h2>
            <p className={styles.modalSubtitle}>
              {t('subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>{t('username')}</label>
              <div className={styles.inputWithIcon}>
                <UserIcon className={styles.inputIcon} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={() => validateField("username")}
                  placeholder={t('usernamePlaceholder')}
                  className={styles.formInput}
                  required
                />
              </div>
              {fieldErrors.username && (
                <span className={styles.errorSpan}>
                  {fieldErrors.username}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>{t('email')}</label>
              <div className={styles.inputWithIcon}>
                <EmailIcon className={styles.inputIcon} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => validateField("email")}
                  placeholder={t('emailPlaceholder')}
                  className={styles.formInput}
                  required
                />
              </div>
              {fieldErrors.email && (
                <span className={styles.errorSpan}>
                  {fieldErrors.email}
                </span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="role" className={styles.label}>{t('registerAs')}</label>
              <select
                className={styles.roleSelect}
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="user">{t('roleUser')}</option>
                <option value="agent">{t('roleAgent')}</option>
              </select>
            </div>

            {/* Agent-specific fields */}
            {formData.role === "agent" && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    {t('phoneNumber')} <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.phoneInputContainer}>
                    <select
                      id="countryCode"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
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
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => validateField("phone")}
                      placeholder={t('phonePlaceholder')}
                      className={styles.phoneInput}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      style={isRTL ? { textAlign: 'right' } : { textAlign: 'left' }}
                      required
                    />
                  </div>
                  {fieldErrors.phone && (
                    <span className={styles.errorSpan}>
                      {fieldErrors.phone}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="company" className={styles.label}>
                    {t('companyName')} <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWithIcon}>
                    <UserIcon className={styles.inputIcon} />
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      onBlur={() => validateField("company")}
                      placeholder={t('companyPlaceholder')}
                      className={styles.formInput}
                      required
                    />
                  </div>
                  {fieldErrors.company && (
                    <span className={styles.errorSpan}>
                      {fieldErrors.company}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="job" className={styles.label}>
                    {t('jobTitle')} <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWithIcon}>
                    <UserIcon className={styles.inputIcon} />
                    <input
                      type="text"
                      id="job"
                      name="job"
                      value={formData.job}
                      onChange={handleChange}
                      onBlur={() => validateField("job")}
                      placeholder={t('jobPlaceholder')}
                      className={styles.formInput}
                      required
                    />
                  </div>
                  {fieldErrors.job && (
                    <span className={styles.errorSpan}>
                      {fieldErrors.job}
                    </span>
                  )}
                </div>
              </>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="pass2" className={styles.label}>{t('password')}</label>
              <div className={styles.inputWithIcon}>
                <LockIcon className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="pass2"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => validateField("password")}
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
              {fieldErrors.password && (
                <span className={styles.errorSpan}>
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirm" className={styles.label}>{t('confirmPassword')}</label>
              <div className={styles.inputWithIcon}>
                <LockIcon className={styles.inputIcon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm"
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
                  className={styles.passwordToggle}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon width={20} height={20} />
                  ) : (
                    <EyeIcon width={20} height={20} />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <span className={styles.errorSpan}>
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <i className="icon-alert-circle" />
                {error}
              </div>
            )}

            {/* Terms and Conditions Checkbox */}
            <div className={styles.formGroup}>
              <div className={styles.checkboxContainer}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className={styles.checkboxInput}
                    required
                  />
                  <span className={styles.checkboxText}>
                    {t('agreeToTerms')}{" "}
                    <Link
                      href="/terms-and-conditions"
                      className={styles.termsLink}
                      onClick={(event) => handlePolicyLinkClick(event, "/terms-and-conditions")}
                    >
                      {t('termsAndConditions')}
                    </Link>{" "}
                    {t('and')}{" "}
                    <Link
                      href="/privacy-policy"
                      className={styles.termsLink}
                      onClick={(event) => handlePolicyLinkClick(event, "/privacy-policy")}
                    >
                      {t('privacyPolicy')}
                    </Link>
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner} />
                  {t('creatingAccount')}
                </>
              ) : (
                <>
                  <i className="icon-user-plus" />
                  {t('createAccount')}
                </>
              )}
            </button>

            <div className={styles.signInLink}>
              {t('alreadyHaveAccount')}{" "}
              <a
                href="#"
                onClick={handleSwitchToLogin}
              >
                {t('login')}
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
