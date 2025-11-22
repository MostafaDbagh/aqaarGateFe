"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { userAPI, authAPI } from "@/apis";
import { countryCodes, DEFAULT_COUNTRY_CODE, extractCountryCode } from "@/constants/countryCodes";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import logger from "@/utlis/logger";
import styles from "./MakeMeAgentModal.module.css";

export default function MakeMeAgentModal({ isOpen, onClose }) {
  const { showSuccessModal } = useGlobalModal();
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
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error for this field
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.phone || formData.phone.trim() === "") {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.job || formData.job.trim() === "") {
      newErrors.job = "Job is required";
    }
    
    if (!formData.company || formData.company.trim() === "") {
      newErrors.company = "Company is required";
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
        "Congratulations! 🎉",
        "You are now an agent! Your account is pending admin verification. Once verified by an admin, you'll be able to list and manage properties.",
        finalUser.email
      );
      
      // Reload page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      logger.error("Error making agent:", error);
      setErrors({ submit: error.message || "Failed to become an agent. Please try again." });
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
          <h2 className={styles.modalTitle}>Become an Agent</h2>
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
              Email address:<span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              className={`${styles.input} ${styles.inputDisabled}`}
              disabled
            />
            <p className={styles.helperText}>Email cannot be changed</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone number:<span className={styles.required}>*</span>
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
                className={`${styles.phoneInput} ${errors.phone ? styles.inputError : ''}`}
                placeholder="Phone number"
                autoComplete="off"
                required
              />
            </div>
            {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="job" className={styles.label}>
              Job:<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="job"
              value={formData.job}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.job ? styles.inputError : ''}`}
              placeholder="e.g. Real Estate Agent"
              required
            />
            {errors.job && <p className={styles.errorText}>{errors.job}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="company" className={styles.label}>
              Company:<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.company ? styles.inputError : ''}`}
              placeholder="Your company name"
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
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Processing..." : "Make Me Agent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

