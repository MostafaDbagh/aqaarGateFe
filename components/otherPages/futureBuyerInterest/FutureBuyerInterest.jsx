"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from 'next-intl';
import DropdownSelect from "@/components/common/DropdownSelect";
import { futureBuyerAPI } from "@/apis";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import { translateApiMessage } from "@/utils/translateApiMessages";
import { syrianProvinces } from "@/constants/provinces";
import { amenitiesList } from "@/constants/amenities";
import { useAuthState } from "@/store/hooks/useAuth";
import styles from "./FutureBuyerInterest.module.css";

export default function FutureBuyerInterest() {
  const t = useTranslations('futureBuyer');
  const tApi = useTranslations('apiMessages');
  const locale = useLocale();
  const { showSuccessModal, showWarningModal, showModal, closeModal, showLoginModal } = useGlobalModal();
  const { isAuthenticated, user } = useAuthState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [error, setError] = useState('');
  const formRef = useRef(null);
  const lastSubmitTimeRef = useRef(0);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const isLoggedIn = !!(token && userStr);
      setIsLoggedIn(isLoggedIn);
      
      if (isLoggedIn && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUserRole(userData?.role || null);
        } catch (error) {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };
    
    checkAuth();
    setIsLoggedIn(isAuthenticated);
    
    if (user?.role) {
      setUserRole(user.role);
    }
  }, [isAuthenticated, user]);
  
  // Check if user is guest or agent (not allowed to submit)
  const isGuestOrAgent = !isLoggedIn || userRole === 'guest' || userRole === 'agent';
  const canSubmit = isLoggedIn && (userRole === 'user' || userRole === 'admin');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    status: 'both',
    minPrice: '',
    maxPrice: '',
    currency: 'USD',
    minSize: '',
    maxSize: '',
    sizeUnit: 'sqm',
    city: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    notes: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAmenityChange = (amenity, checked) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent submission if user is guest or agent - show login modal
    if (isGuestOrAgent) {
      const warningMsg = t('forRegisteredUsersOnly');
      setError(warningMsg);
      showWarningModal(
        t('warning'),
        warningMsg
      );
      // Show login modal after 3 seconds, close warning modal first
      setTimeout(() => {
        closeModal(); // Close only the warning modal
        // Small delay before opening login modal to ensure warning modal is closed
        setTimeout(() => {
          showLoginModal();
        }, 200);
      }, 3000);
      return;
    }
    
    setError('');
    setSubmitMessage('');
    
    // Prevent double submission
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 2000) {
      return;
    }
    lastSubmitTimeRef.current = now;
    
    // Validation - Required fields: name, email, phone, city, propertyType, status
    if (!formData.name || !formData.email || !formData.phone || !formData.city || !formData.propertyType || !formData.status) {
      setError(t('requiredFields'));
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('invalidEmail'));
      return;
    }
    
    // Price range validation
    if (formData.minPrice && formData.maxPrice && parseFloat(formData.minPrice) > parseFloat(formData.maxPrice)) {
      setError(t('invalidPriceRange'));
      return;
    }
    
    // Size range validation
    if (formData.minSize && formData.maxSize && parseFloat(formData.minSize) > parseFloat(formData.maxSize)) {
      setError(t('invalidSizeRange'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        propertyType: formData.propertyType,
        status: formData.status, // Required field
        minPrice: formData.minPrice ? parseFloat(formData.minPrice) : undefined,
        maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : undefined,
        currency: 'USD', // Always USD
        minSize: formData.minSize ? parseFloat(formData.minSize) : undefined,
        maxSize: formData.maxSize ? parseFloat(formData.maxSize) : undefined,
        sizeUnit: formData.sizeUnit,
        city: formData.city.trim(),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        amenities: formData.amenities,
        notes: formData.notes ? formData.notes.trim() : undefined
      };
      
      const result = await futureBuyerAPI.createFutureBuyer(submitData);
      
      if (result.success) {
        const successMsg = t('successMessage', { count: result.matchedPropertiesCount || 0 });
        setSubmitMessage(successMsg);
        showSuccessModal(
          locale === 'ar' ? 'نجاح' : 'Success',
          successMsg
        );
        // Reset form
        formRef.current?.reset();
        setFormData({
          name: '',
          email: '',
          phone: '',
          propertyType: '',
          status: 'both',
          minPrice: '',
          maxPrice: '',
          currency: 'USD',
          minSize: '',
          maxSize: '',
          sizeUnit: 'sqm',
          city: '',
          bedrooms: '',
          bathrooms: '',
          amenities: [],
          notes: ''
        });
      } else {
        throw new Error(result.message || 'Failed to submit request');
      }
    } catch (err) {
      let errorMsg = '';
      errorMsg = translateApiMessage(
        err?.response?.data?.message || err?.message || 'Failed to submit request',
        locale,
        tApi
      );
      
      setError(errorMsg);
      showWarningModal(
        tApi('error'),
        errorMsg
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const propertyTypes = ['Apartment', 'Villa', 'Building', 'Land', 'Holiday Home', 'Office', 'Commercial'];
  const statusOptions = ['both', 'sale', 'rent'];
  const sizeUnitOptions = ['sqm', 'dunam', 'sqft', 'sqyd', 'feddan'];
  
  return (
    <section className="section-future-buyer-interest tf-spacing-1">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            {/* Hero Section */}
            <div className={`heading-section text-center mb-60 ${styles.heroSection}`}>
              <div className={styles.heroIconWrapper}>
                <i className="icon-search" />
              </div>
              <h1 className={`title split-text effect-right ${styles.heroTitle}`}>
                {t('heroTitle')}
              </h1>
              <p className={`text-1 split-text split-lines-transform ${styles.heroSubtitle}`}>
                {t('heroSubtitle')}
              </p>
            </div>

            {/* Form Section */}
            <div className="form-section">
              <div className="row">
                <div className="col-lg-10 col-md-12 mx-auto">
                  <div className={styles.formContainer}>
                    <h2 className={styles.formTitle}>
                      {t('formTitle')}
                    </h2>
                    <p className={styles.formSubtitle}>
                      {t('formSubtitle')}
                    </p>

                    {error && (
                      <div className={`${styles.alert} ${styles.alertDanger}`}>
                        {error}
                      </div>
                    )}
                    {isGuestOrAgent && (
                      <div className={`${styles.alert} ${styles.alertWarning}`}>
                        <i className="icon-alert" style={{ marginRight: '8px' }} />
                        {t('forRegisteredUsersOnly')}
                      </div>
                    )}
                    {submitMessage && (
                      <div className={`${styles.alert} ${styles.alertSuccess}`}>
                        {submitMessage}
                      </div>
                    )}

                    <form
                      ref={formRef}
                      id="futureBuyerForm"
                      onSubmit={handleSubmit}
                    >
                      <div className="row">
                        {/* Contact Information */}
                        <div className="col-md-4 mb-20">
                          <fieldset>
                            <label htmlFor="name" className={styles.formLabel}>
                              <i className="icon-agent" /> {t('name')} <span className={styles.requiredStar}>*</span>
                            </label>
                            <div className={styles.inputWrapper}>
                              <input
                                type="text"
                                className={`tf-input style-2 ${styles.formInput}`}
                                placeholder={t('namePlaceholder')}
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </fieldset>
                        </div>
                        <div className="col-md-4 mb-20">
                          <fieldset>
                            <label htmlFor="email" className={styles.formLabel}>
                              <i className="icon-mail" /> {t('email')} <span className={styles.requiredStar}>*</span>
                            </label>
                            <div className={styles.inputWrapper}>
                              <input
                                type="email"
                                className={`tf-input style-2 ${styles.formInput}`}
                                placeholder={t('emailPlaceholder')}
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </fieldset>
                        </div>
                        <div className="col-md-4 mb-20">
                          <fieldset>
                            <label htmlFor="phone" className={styles.formLabel}>
                              <i className="icon-phone-1" /> {t('phone')} <span className={styles.requiredStar}>*</span>
                            </label>
                            <div className={styles.inputWrapper}>
                              <input
                                type="tel"
                                className={`tf-input style-2 ${styles.formInput}`}
                                placeholder={t('phonePlaceholder')}
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </fieldset>
                        </div>

                        {/* Property Requirements - First Row */}
                        <div className="col-md-4 mb-20">
                          <fieldset>
                            <label htmlFor="city" className={styles.formLabel}>
                              <i className="icon-location" /> {t('city')} <span className={styles.requiredStar}>*</span>
                            </label>
                            <div className={styles.inputWrapper}>
                              <DropdownSelect
                                name="city"
                                options={syrianProvinces}
                                selectedValue={formData.city}
                                onChange={(value) => handleDropdownChange('city', value)}
                                addtionalParentClass="form-select-wrapper"
                              />
                            </div>
                          </fieldset>
                        </div>
                        <div className="col-md-4 mb-20">
                          <fieldset>
                            <label htmlFor="propertyType" className={styles.formLabel}>
                              <i className="icon-home" /> {t('propertyType')} <span className={styles.requiredStar}>*</span>
                            </label>
                            <div className={styles.inputWrapper}>
                              <DropdownSelect
                                name="propertyType"
                                options={propertyTypes}
                                selectedValue={formData.propertyType}
                                onChange={(value) => handleDropdownChange('propertyType', value)}
                                addtionalParentClass="form-select-wrapper"
                              />
                            </div>
                          </fieldset>
                        </div>
                        <div className="col-md-4 mb-20">
                          <fieldset>
                            <label htmlFor="status" className={styles.formLabel}>
                              <i className="icon-tag" /> {t('status')} <span className={styles.requiredStar}>*</span>
                            </label>
                            <div className={styles.inputWrapper}>
                              <DropdownSelect
                                name="status"
                                options={statusOptions}
                                selectedValue={formData.status}
                                onChange={(value) => handleDropdownChange('status', value)}
                                addtionalParentClass="form-select-wrapper"
                              />
                            </div>
                          </fieldset>
                        </div>
                        {/* Price Range */}
                        <div className="col-md-4 mb-20">
                          <fieldset>
                            <label htmlFor="minPrice" className={styles.formLabel}>
                              <i className="icon-dollar" /> {t('minPrice')}
                            </label>
                            <div className={styles.inputWrapper}>
                              <input
                                type="number"
                                className={`tf-input style-2 ${styles.formInput}`}
                                placeholder={t('minPricePlaceholder')}
                                name="minPrice"
                                id="minPrice"
                                value={formData.minPrice}
                                onChange={handleInputChange}
                                min="0"
                              />
                            </div>
                          </fieldset>
                        </div>
                        <div className="col-md-4 mb-20">
                          <fieldset>
                            <label htmlFor="maxPrice" className={styles.formLabel}>
                              <i className="icon-dollar" /> {t('maxPrice')}
                            </label>
                            <div className={styles.inputWrapper}>
                              <input
                                type="number"
                                className={`tf-input style-2 ${styles.formInput}`}
                                placeholder={t('maxPricePlaceholder')}
                                name="maxPrice"
                                id="maxPrice"
                                value={formData.maxPrice}
                                onChange={handleInputChange}
                                min="0"
                              />
                            </div>
                          </fieldset>
                        </div>
                        <div className="col-md-4 mb-20">
                          <fieldset>
                            <label htmlFor="currency" className={styles.formLabel}>
                              <i className="icon-wallet" /> {t('currency')}
                            </label>
                            <div className={styles.inputWrapper}>
                              <input
                                type="text"
                                className={`tf-input style-2 ${styles.formInput}`}
                                value="USD"
                                disabled
                                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                              />
                            </div>
                          </fieldset>
                        </div>

                        {/* Size Range */}
                        <div className="col-md-4 mb-20">
                          <fieldset>
                            <label htmlFor="minSize" className={styles.formLabel}>
                              <i className="icon-compare" /> {t('minSize')}
                            </label>
                            <div className={styles.inputWrapper}>
                              <input
                                type="number"
                                className={`tf-input style-2 ${styles.formInput}`}
                                placeholder={t('minSizePlaceholder')}
                                name="minSize"
                                id="minSize"
                                value={formData.minSize}
                                onChange={handleInputChange}
                                min="0"
                              />
                            </div>
                          </fieldset>
                        </div>
                        <div className="col-md-4 mb-20">
                          <fieldset>
                            <label htmlFor="maxSize" className={styles.formLabel}>
                              <i className="icon-compare" /> {t('maxSize')}
                            </label>
                            <div className={styles.inputWrapper}>
                              <input
                                type="number"
                                className={`tf-input style-2 ${styles.formInput}`}
                                placeholder={t('maxSizePlaceholder')}
                                name="maxSize"
                                id="maxSize"
                                value={formData.maxSize}
                                onChange={handleInputChange}
                                min="0"
                              />
                            </div>
                          </fieldset>
                        </div>
                        <div className="col-md-4 mb-20">
                          <fieldset>
                            <label htmlFor="sizeUnit" className={styles.formLabel}>
                              <i className="icon-ruler" /> {t('sizeUnit')}
                            </label>
                            <div className={styles.inputWrapper}>
                              <DropdownSelect
                                name="sizeUnit"
                                options={sizeUnitOptions}
                                selectedValue={formData.sizeUnit}
                                onChange={(value) => handleDropdownChange('sizeUnit', value)}
                                addtionalParentClass="form-select-wrapper"
                              />
                            </div>
                          </fieldset>
                        </div>

                        {/* Bedrooms and Bathrooms */}
                        <div className="col-md-6 mb-20">
                          <fieldset>
                            <label htmlFor="bedrooms" className={styles.formLabel}>
                              <i className="icon-bed" /> {t('bedrooms')}
                            </label>
                            <div className={styles.inputWrapper}>
                              <input
                                type="number"
                                className={`tf-input style-2 ${styles.formInput}`}
                                placeholder={t('bedroomsPlaceholder')}
                                name="bedrooms"
                                id="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleInputChange}
                                min="0"
                              />
                            </div>
                          </fieldset>
                        </div>
                        <div className="col-md-6 mb-20">
                          <fieldset>
                            <label htmlFor="bathrooms" className={styles.formLabel}>
                              <i className="icon-bath" /> {t('bathrooms')}
                            </label>
                            <div className={styles.inputWrapper}>
                              <input
                                type="number"
                                className={`tf-input style-2 ${styles.formInput}`}
                                placeholder={t('bathroomsPlaceholder')}
                                name="bathrooms"
                                id="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleInputChange}
                                min="0"
                              />
                            </div>
                          </fieldset>
                        </div>

                        {/* Amenities */}
                        <div className="col-12 mb-20">
                          <fieldset>
                            <label className={styles.formLabel}>
                              <i className="icon-star" /> {t('amenities')}
                            </label>
                            <div className={styles.amenitiesGrid}>
                              {amenitiesList.map((amenity) => (
                                <div key={amenity} className={styles.amenityCheckbox}>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={formData.amenities.includes(amenity)}
                                      onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                                    />
                                    <span>{amenity}</span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          </fieldset>
                        </div>

                        {/* Notes */}
                        <div className="col-12 mb-20">
                          <fieldset>
                            <label htmlFor="notes" className={styles.formLabel}>
                              <i className="icon-file" /> {t('notes')}
                            </label>
                            <div className={styles.textareaWrapper}>
                              <textarea
                                name="notes"
                                rows={5}
                                className={`tf-input style-2 ${styles.formTextarea}`}
                                placeholder={t('notesPlaceholder')}
                                id="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                              />
                            </div>
                          </fieldset>
                        </div>

                        {/* Submit Button */}
                        <div className="col-12">
                          <button
                            type="submit"
                            className={`tf-btn bg-color-primary w-full ${styles.submitButton}`}
                            disabled={isSubmitting}
                            title={isGuestOrAgent ? t('forRegisteredUsersOnly') : ''}
                          >
                            <i className="icon-file" /> {isSubmitting
                              ? t('submitting')
                              : t('submitButton')
                            }
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

