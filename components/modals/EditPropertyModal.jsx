"use client";
import React, { useState, useEffect } from 'react';
import { listingAPI } from '@/apis/listing';
import DropdownSelect from '../common/DropdownSelect';
import { amenitiesList } from '@/constants/amenities';
import { keywordTags } from '@/constants/keywordTags';
import { normalizeRentType } from '@/constants/rentTypes';
import { useTranslations, useLocale } from 'next-intl';
import { translateKeywordWithT } from '@/utils/translateKeywords';
import styles from './EditPropertyModal.module.css';

const EditPropertyModal = ({ isOpen, onClose, property, onSuccess }) => {
  const t = useTranslations('agent.addProperty');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [originalContactInfo, setOriginalContactInfo] = useState(null); // Store original contact info to detect changes
  const [formData, setFormData] = useState({
    propertyKeyword: '',
    address: '',
    propertyPrice: '',
    status: 'sale',
    rentType: 'monthly',
    approvalStatus: 'pending',
    description: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    sizeUnit: 'sqm',
    yearBuilt: '',
    propertyType: '',
    amenities: [],
    // Contact information (admin can edit)
    agentEmail: '',
    agentNumber: '',
    agentWhatsapp: '',
    // Arabic translation fields
    description_ar: '',
    address_ar: '',
    neighborhood_ar: '',
    notes_ar: '',
    floor: ''
  });
  
  // Get user from localStorage to check if admin
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const isAdmin = user?.role === 'admin';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Suggested keyword tags

  // Handle tag click - add/remove tag from propertyKeyword
  const handleTagClick = (tag) => {
    const currentKeywords = formData.propertyKeyword
      .split(',')
      .map(k => k.trim())
      .filter(k => k);
    
    // Check if tag is already selected
    const tagIndex = currentKeywords.findIndex(k => k.toLowerCase() === tag.toLowerCase());
    
    if (tagIndex >= 0) {
      // Remove tag if already selected
      currentKeywords.splice(tagIndex, 1);
    } else {
      // Add tag if not selected
      currentKeywords.push(tag);
    }
    
    // Update propertyKeyword with comma-separated tags
    setFormData(prev => ({
      ...prev,
      propertyKeyword: currentKeywords.join(', ')
    }));
  };
  
  // Check if a tag is selected
  const isTagSelected = (tag) => {
    const currentKeywords = formData.propertyKeyword
      .split(',')
      .map(k => k.trim())
      .filter(k => k);
    return currentKeywords.some(k => k.toLowerCase() === tag.toLowerCase());
  };

  // Use same amenities list as AddProperty
  const amenityOptions = amenitiesList;

  // Initialize form data when property changes
  useEffect(() => {
    if (property) {
      // Get user data to check if admin
      const userData = localStorage.getItem('user');
      const currentUser = userData ? JSON.parse(userData) : null;
      const currentIsAdmin = currentUser?.role === 'admin';
      
      // Normalize status: handle "for rent", "for sale", "rent", "sale", etc.
      let normalizedStatus = (property.status || 'sale').toLowerCase().trim();
      
      // Convert "for rent" or "for sale" to "rent" or "sale"
      if (normalizedStatus.includes('rent')) {
        normalizedStatus = 'rent';
      } else if (normalizedStatus.includes('sale')) {
        normalizedStatus = 'sale';
      }
      
      // Normalize rentType: handle "Three Months", "three-month", etc.
      const normalizedRentType = normalizeRentType(property.rentType || 'monthly');
      
      // Store original contact info to detect changes
      const originalContact = {
        agentEmail: property.agentEmail || null,
        agentNumber: property.agentNumber || null,
        agentWhatsapp: property.agentWhatsapp || null
      };
      setOriginalContactInfo(originalContact);
      
      setFormData({
        propertyKeyword: property.propertyKeyword || '',
        address: property.address || '',
        propertyPrice: property.propertyPrice || '',
        status: normalizedStatus,
        rentType: normalizedRentType,
        approvalStatus: property.approvalStatus || 'pending',
        description: property.description || property.propertyDesc || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        squareFootage: property.squareFootage || property.size || '',
        sizeUnit: property.sizeUnit || '',
        yearBuilt: property.yearBuilt || '',
        propertyType: property.propertyType || '',
        amenities: property.amenities || [],
        // Contact information (load from property or use defaults for admin)
        agentEmail: property.agentEmail || (currentIsAdmin ? 'admin@aqaargate.com' : ''),
        agentNumber: property.agentNumber || (currentIsAdmin ? (currentUser?.phone || '') : ''),
        agentWhatsapp: property.agentWhatsapp || (currentIsAdmin ? (currentUser?.phone || '') : ''),
        // Arabic translation fields
        description_ar: property.description_ar || '',
        address_ar: property.address_ar || '',
        neighborhood_ar: property.neighborhood_ar || '',
        notes_ar: property.notes_ar || '',
        floor: property.floor || ''
      });
    }
  }, [property]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? value.toLowerCase() : value
    }));
  };

  // Handle dropdown change (for rentType)
  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle amenity toggle
  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Handle adding custom amenity
  const handleAddCustomAmenity = (customAmenity) => {
    if (customAmenity.trim() && !formData.amenities.includes(customAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, customAmenity.trim()]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare data for API
      // IMPORTANT: Do not send approvalStatus unless user is admin
      // Backend will preserve existing approvalStatus for non-admin users
      // CRITICAL: Preserve exact propertyPrice - NO DEDUCTION, NO MODIFICATION
      const { approvalStatus, rentType, ...formDataWithoutApprovalStatus } = formData;
      
      // Parse price exactly as entered - no deduction allowed
      const exactPrice = parseFloat(formData.propertyPrice);
      if (isNaN(exactPrice) || exactPrice <= 0) {
        setError(t('propertyPriceRequired'));
        setLoading(false);
        return;
      }
      
      const updateData = {
        ...formDataWithoutApprovalStatus,
        propertyPrice: exactPrice, // CRITICAL: Send exact price - NO DEDUCTION, NO MODIFICATION
        bedrooms: (formData.propertyType === "Land" || formData.propertyType === "Commercial" || formData.propertyType === "Office") ? 0 : parseInt(formData.bedrooms) || 0,
        bathrooms: formData.propertyType === "Land" ? 0 : parseInt(formData.bathrooms) || 0,
        squareFootage: parseInt(formData.squareFootage) || 0,
        sizeUnit: formData.sizeUnit && formData.sizeUnit.trim() !== '' ? formData.sizeUnit : 'sqm', // Default to sqm if not selected
        yearBuilt: parseInt(formData.yearBuilt) || new Date().getFullYear(),
        // Contact information (admin can edit)
        // NOTE: agent (legacy field) is NOT sent - it should never change
        // Only include contact fields if admin is editing AND values have changed
        ...(isAdmin && originalContactInfo ? {
          ...(formData.agentEmail !== undefined && formData.agentEmail.trim() !== (originalContactInfo.agentEmail || '').trim() 
            ? { agentEmail: formData.agentEmail.trim() || null } 
            : {}),
          ...(formData.agentNumber !== undefined && formData.agentNumber.trim() !== (originalContactInfo.agentNumber || '').trim() 
            ? { agentNumber: formData.agentNumber.trim() || null } 
            : {}),
          ...(formData.agentWhatsapp !== undefined && formData.agentWhatsapp.trim() !== (originalContactInfo.agentWhatsapp || '').trim() 
            ? { agentWhatsapp: formData.agentWhatsapp.trim() || null } 
            : {})
        } : {}),
        // Arabic translation fields
        ...(formData.description_ar ? { description_ar: formData.description_ar } : {}),
        ...(formData.address_ar ? { address_ar: formData.address_ar } : {}),
        ...(formData.neighborhood_ar ? { neighborhood_ar: formData.neighborhood_ar } : {}),
        ...(formData.notes_ar ? { notes_ar: formData.notes_ar } : {}),
        ...(formData.floor ? { floor: parseInt(formData.floor) } : {})
      };
      
      // Only include rentType if status is "rent"
      if (formData.status === 'rent' && formData.rentType) {
        updateData.rentType = formData.rentType;
      }
      
      // Only include approvalStatus if user is admin (check user role from localStorage or context)
      // For now, we'll let backend handle this - it will preserve existing approvalStatus for non-admin users

      await listingAPI.updateListing(property._id, updateData);
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || t('failedToUpdate'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError('');
    onClose();
  };

  // Standard input styling (migrated to CSS)
  const handleInputFocus = (e) => {
    e.target.classList.add(styles.inputFocused);
  };

  const handleInputBlur = (e) => {
    e.target.classList.remove(styles.inputFocused);
  };

  if (!isOpen || !property) return null;

  return (
    <div 
      className={styles.modalOverlay}
      onClick={handleCancel}
    >
      <div 
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader} style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
          <h2 className={styles.modalTitle}>
            {t('editProperty')}
          </h2>
          <button 
            onClick={handleCancel}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody} style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            {error && (
              <div className={styles.errorAlert}>
                {error}
              </div>
            )}

            <div className={styles.gridGap28} style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Property Title */}
            <div>
              <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                {t('propertyTitle')}
              </label>
              
              {/* Display input showing selected tags (read-only) */}
              <input
                type="text"
                name="propertyKeyword"
                value={formData.propertyKeyword}
                readOnly
                className={styles.input}
                placeholder={t('selectTagsPlaceholder')}
                style={{ cursor: 'not-allowed', backgroundColor: '#f8f9fa', direction: locale === 'ar' ? 'rtl' : 'ltr', textAlign: locale === 'ar' ? 'right' : 'left' }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              
              {/* Selected Tags Display */}
              {formData.propertyKeyword && (
                <div className={styles.selectedTagsContainer} style={{ marginTop: '12px', direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
                  {formData.propertyKeyword.split(',').map((keyword, index) => {
                    const trimmedKeyword = keyword.trim();
                    if (!trimmedKeyword) return null;
                    const translatedKeyword = translateKeywordWithT(trimmedKeyword, tCommon);
                    return (
                      <span key={index} className={styles.selectedTag}>
                        {translatedKeyword}
                        <span 
                          className={styles.removeTagIcon}
                          onClick={() => {
                            const currentKeywords = formData.propertyKeyword
                              .split(',')
                              .map(k => k.trim())
                              .filter(k => k && k !== trimmedKeyword);
                            setFormData(prev => ({
                              ...prev,
                              propertyKeyword: currentKeywords.join(', ')
                            }));
                          }}
                        >×</span>
                      </span>
                    );
                  })}
                </div>
              )}
              
              {/* Keyword Tags Suggestions - Only allow selection from these tags */}
              <div className={styles.keywordTagsContainer} style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
                <span className={styles.keywordTagsLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>{t('selectTagsLabel')}</span>
                {keywordTags.map((tag, index) => {
                  const translatedTag = translateKeywordWithT(tag, tCommon);
                  return (
                    <span
                      key={index}
                      className={`${styles.keywordTag} ${isTagSelected(tag) ? styles.keywordTagSelected : ''}`}
                      onClick={() => handleTagClick(tag)}
                      title={locale === 'ar' 
                        ? `${isTagSelected(tag) ? 'انقر لإزالة' : 'انقر للإضافة'} "${translatedTag}"`
                        : `Click to ${isTagSelected(tag) ? 'remove' : 'add'} "${translatedTag}"`}
                    >
                      {translatedTag}
                      <span className={styles.keywordTagIcon}>{isTagSelected(tag) ? '✓' : '+'}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                {t('fullAddress')} *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className={styles.input}
                style={{ direction: locale === 'ar' ? 'rtl' : 'ltr', textAlign: locale === 'ar' ? 'right' : 'left' }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
            {/* Price and Status Row */}
            <div className={styles.gridTwoCols}>
              <div>
                <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                  {t('price')} *
                </label>
                <input
                  type="text"
                  name="propertyPrice"
                  value={formData.propertyPrice}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className={styles.input}
                  style={{ direction: 'ltr', textAlign: 'left' }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                  {t('propertyStatus')}
                </label>
                <select
                  name="status"
                  value={formData.status || 'sale'}
                  onChange={handleInputChange}
                  className={styles.input}
                  style={{ direction: locale === 'ar' ? 'rtl' : 'ltr', textAlign: locale === 'ar' ? 'right' : 'left' }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <option value="sale">{t('status.sale')}</option>
                  <option value="rent">{t('status.rent')}</option>
                </select>
              </div>
            </div>

            {/* Rent Type - Only show when status is "rent" */}
            {(formData.status === 'rent' || formData.status?.toLowerCase() === 'rent') && (
              <div style={{ marginTop: '20px', direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
                <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                  {t('rentPeriodCharge')}: <span style={{ color: 'red' }}>*</span>
                </label>
                <DropdownSelect
                  name="rentType"
                  options={[
                    'monthly',
                    'yearly',
                    'weekly'
                  ]}
                  selectedValue={formData.rentType || 'monthly'}
                  onChange={(value) => handleDropdownChange('rentType', value)}
                  addtionalParentClass=""
                  translateOption={(option) => t(`rentTypes.${option}`) || option}
                />
              </div>
            )}

            {/* Property Details Row */}
            <div className={styles.gridTwoCols}>
              {/* Hide bedrooms for Land, Commercial, and Office */}
              {formData.propertyType !== "Land" && formData.propertyType !== "Commercial" && formData.propertyType !== "Office" && (
                <div>
                  <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                    {t('bedrooms')}
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="0"
                    className={styles.input}
                    style={{ direction: 'ltr', textAlign: 'left' }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              )}

              {/* Hide bathrooms for Land only. For Commercial and Office, bathrooms is optional */}
              {formData.propertyType !== "Land" && (
                <div>
                  <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                    {t('bathrooms')}
                    {/* Only show * (required) for residential types, not for Commercial/Office */}
                    {(formData.propertyType !== "Commercial" && formData.propertyType !== "Office") && <span style={{ color: 'red' }}> *</span>}
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="0"
                    step="0.5"
                    className={styles.input}
                    style={{ direction: 'ltr', textAlign: 'left' }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              )}
            </div>

            {/* Square Footage - Separate Row */}
            <div>
              <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                {t('squareFootage')}
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <input
                  type="number"
                  name="squareFootage"
                  value={formData.squareFootage}
                  onChange={handleInputChange}
                  min="0"
                  className={`${styles.input} no-spinner`}
                  style={{ direction: 'ltr', textAlign: 'left', flex: 1 }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onWheel={(e) => e.target.blur()}
                />
                <select
                  name="sizeUnit"
                  value={formData.sizeUnit || ''}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  style={{ width: '150px', direction: locale === 'ar' ? 'rtl' : 'ltr' }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <option value="">{tCommon('select')}...</option>
                  <option value="sqm">{t('sizeUnits.sqm')}</option>
                  <option value="dunam">{t('sizeUnits.dunam')}</option>
                  <option value="sqft">{t('sizeUnits.sqft')}</option>
                  <option value="sqyd">{t('sizeUnits.sqyd')}</option>
                  <option value="feddan">{t('sizeUnits.feddan')}</option>
                </select>
              </div>
              <small style={{ 
                fontSize: '11px', 
                display: 'block', 
                marginTop: '4px',
                color: '#6c757d',
                fontStyle: 'italic',
                padding: '4px 8px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #e9ecef',
                direction: locale === 'ar' ? 'rtl' : 'ltr',
                textAlign: locale === 'ar' ? 'right' : 'left'
              }}>
                ⓘ {t('sizeUnitDefaultWarning')}
              </small>
            </div>

            {/* Additional Details Row */}
            <div className={styles.gridTwoCols}>
              <div>
                <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                  {t('yearBuilt')}
                </label>
                <input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  className={styles.input}
                  style={{ direction: 'ltr', textAlign: 'left' }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                  {t('floor')}
                </label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  min="0"
                  placeholder={t('floorPlaceholder')}
                  className={styles.input}
                  style={{ direction: 'ltr', textAlign: 'left' }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                {t('description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`${styles.input} ${styles.textarea}`}
                style={{ direction: locale === 'ar' ? 'rtl' : 'ltr', textAlign: locale === 'ar' ? 'right' : 'left' }}
                placeholder={t('describeProperty')}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            {/* Contact Information Section (Admin Only) */}
            {isAdmin && (
              <div style={{ marginTop: '20px', marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: '600' }}>
                  Contact Information (معلومات الاتصال)
                </h3>
                <div style={{ 
                  marginBottom: '15px', 
                  padding: '12px', 
                  backgroundColor: '#fff3cd', 
                  borderRadius: '6px',
                  border: '1px solid #ffc107',
                  fontSize: '14px'
                }}>
                  <strong>Note:</strong> You can change these fields to display the property owner's contact information instead of admin details.
                </div>
                
                <div className={styles.gridThreeCols} style={{ gap: '15px' }}>
                  <div>
                    <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                      Contact Email (البريد الإلكتروني):
                    </label>
                    <input
                      type="email"
                      name="agentEmail"
                      value={formData.agentEmail || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter contact email (optional)"
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                    <small style={{ fontSize: '12px', color: '#6c757d', display: 'block', marginTop: '5px' }}>
                      Optional: Leave empty to hide email button. Default: admin@aqaargate.com
                    </small>
                  </div>
                  
                  <div>
                    <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                      Contact Phone (رقم الهاتف): <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="agentNumber"
                      value={formData.agentNumber || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter contact phone (e.g., +963999999999)"
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                    <small style={{ fontSize: '12px', color: '#6c757d', display: 'block', marginTop: '5px' }}>
                      Default: Admin phone number
                    </small>
                  </div>
                  
                  <div>
                    <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                      WhatsApp Number (رقم الواتساب): <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="agentWhatsapp"
                      value={formData.agentWhatsapp || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter WhatsApp number (e.g., +963999999999)"
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                    <small style={{ fontSize: '12px', color: '#6c757d', display: 'block', marginTop: '5px' }}>
                      Default: Admin WhatsApp number
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Arabic Translation Section */}
            <div className={styles.arabicSection}>
              <h3 className={styles.arabicSectionTitle}>
                Arabic Translation (الترجمة العربية)
              </h3>
              
              <div className={styles.gridGap28}>
                {/* Arabic Description */}
                <div>
                  <label className={styles.formLabel}>
                    Description (الوصف)
                  </label>
                  <textarea
                    name="description_ar"
                    value={formData.description_ar}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="أدخل وصف العقار بالعربية"
                    dir="rtl"
                    style={{ textAlign: 'right' }}
                    className={`${styles.input} ${styles.textarea}`}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>

                {/* Arabic Address */}
                <div>
                  <label className={styles.formLabel}>
                    Full Address (العنوان الكامل)
                  </label>
                  <input
                    type="text"
                    name="address_ar"
                    value={formData.address_ar}
                    onChange={handleInputChange}
                    placeholder="أدخل العنوان الكامل بالعربية"
                    dir="rtl"
                    style={{ textAlign: 'right' }}
                    className={styles.input}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>

                {/* Arabic Neighborhood */}
                <div>
                  <label className={styles.formLabel}>
                    Neighborhood (الحي)
                  </label>
                  <input
                    type="text"
                    name="neighborhood_ar"
                    value={formData.neighborhood_ar}
                    onChange={handleInputChange}
                    placeholder="أدخل اسم الحي بالعربية"
                    dir="rtl"
                    style={{ textAlign: 'right' }}
                    className={styles.input}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>

                {/* Arabic Notes */}
                <div>
                  <label className={styles.formLabel}>
                    Notes (ملاحظات)
                  </label>
                  <textarea
                    name="notes_ar"
                    value={formData.notes_ar}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="أي ملاحظات إضافية بالعربية..."
                    dir="rtl"
                    style={{ textAlign: 'right' }}
                    className={`${styles.input} ${styles.textarea}`}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
              <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                {t('amenitiesLabel')} <span style={{ color: 'red' }}>*</span>
              </label>
              <div className={styles.amenitiesWrap}>
                <div className={styles.amenitiesGrid}>
                  {amenityOptions.map((amenity) => (
                    <label
                      key={amenity}
                      className={styles.amenityItem}
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className={styles.checkbox}
                      />
                      <span className={formData.amenities.includes(amenity) ? styles.amenitySelected : styles.amenityLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                        {t(`amenities.${amenity}`) || amenity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            </div>

            {/* Footer Buttons */}
            <div className={styles.footerButtons} style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
              <button type="button" onClick={handleCancel} className={styles.btnSecondary} style={{ order: locale === 'ar' ? 2 : 1 }}>{tCommon('cancel')}</button>
              <button type="submit" disabled={loading} className={styles.btnPrimary} style={{ order: locale === 'ar' ? 1 : 2 }}>
                {loading ? t('saving') : t('saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyModal;
