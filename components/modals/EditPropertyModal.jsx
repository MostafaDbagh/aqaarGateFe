"use client";
import React, { useState, useEffect } from 'react';
import { listingAPI } from '@/apis/listing';
import DropdownSelect from '../common/DropdownSelect';
import { amenitiesList } from '@/constants/amenities';
import { useTranslations, useLocale } from 'next-intl';
import { translateKeywordWithT } from '@/utils/translateKeywords';
import styles from './EditPropertyModal.module.css'

const EditPropertyModal = ({ isOpen, onClose, property, onSuccess }) => {
  const t = useTranslations('agent.addProperty');
  const tCommon = useTranslations('common');
  const locale = useLocale();
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
    yearBuilt: '',
    propertyType: '',
    amenities: [],
    // Arabic translation fields
    description_ar: '',
    address_ar: '',
    neighborhood_ar: '',
    notes_ar: '',
    floor: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Suggested keyword tags
  const keywordTags = [
    "South-facing house",
    "East-facing",
    "West-facing",
    "Well-ventilated",
    "Bright",
    "Modern building",
    "Old building",
    "Spacious",
    "View",
    "Open view",
    "Sea view",
    "Mountain view",
    "luxury",
    'doublex finishing',
    'super doublex finishing',
    'standard finishing',
    'stone finishing',
    '2,400 shares',
    'Green Title Deed'
  ];

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
      // Normalize status: handle "for rent", "for sale", "rent", "sale", etc.
      let normalizedStatus = (property.status || 'sale').toLowerCase().trim();
      
      // Convert "for rent" or "for sale" to "rent" or "sale"
      if (normalizedStatus.includes('rent')) {
        normalizedStatus = 'rent';
      } else if (normalizedStatus.includes('sale')) {
        normalizedStatus = 'sale';
      }
      
      // Normalize rentType: handle "Three Months", "three-month", etc.
      let normalizedRentType = property.rentType || 'monthly';
      if (normalizedRentType) {
        const rentTypeLower = normalizedRentType.toLowerCase().trim();
        // Map common variations to standard format
        const rentTypeMap = {
          'three months': 'three-month',
          'three-month': 'three-month',
          'six months': 'six-month',
          'six-month': 'six-month',
          'one year': 'one-year',
          'one-year': 'one-year',
          'monthly': 'monthly',
          'weekly': 'weekly',
          'yearly': 'yearly'
        };
        normalizedRentType = rentTypeMap[rentTypeLower] || normalizedRentType.toLowerCase();
      }
      
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
        yearBuilt: property.yearBuilt || '',
        propertyType: property.propertyType || '',
        amenities: property.amenities || [],
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
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        squareFootage: parseInt(formData.squareFootage) || 0,
        yearBuilt: parseInt(formData.yearBuilt) || new Date().getFullYear(),
        // Arabic translation fields
        description_ar: formData.description_ar || undefined,
        address_ar: formData.address_ar || undefined,
        neighborhood_ar: formData.neighborhood_ar || undefined,
        notes_ar: formData.notes_ar || undefined,
        floor: formData.floor ? parseInt(formData.floor) : undefined
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
                {t('propertyTitle')} *
              </label>
              
              {/* Display input showing selected tags (read-only) */}
              <input
                type="text"
                name="propertyKeyword"
                value={formData.propertyKeyword}
                readOnly
                required
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
                  type="number"
                  name="propertyPrice"
                  value={formData.propertyPrice}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
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
                    'three-month',
                    'six-month',
                    'one-year',
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
            <div className={styles.gridThreeCols}>
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

              <div>
                <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                  {t('bathrooms')}
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

              <div>
                <label className={styles.formLabel} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                  {t('squareFootage')}
                </label>
                <input
                  type="number"
                  name="squareFootage"
                  value={formData.squareFootage}
                  onChange={handleInputChange}
                  min="0"
                  className={styles.input}
                  style={{ direction: 'ltr', textAlign: 'left' }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
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
