import React, { useState, useEffect } from 'react';
import { listingAPI } from '@/apis/listing';
import styles from './EditPropertyModal.module.css'

const EditPropertyModal = ({ isOpen, onClose, property, onSuccess }) => {
  const [formData, setFormData] = useState({
    propertyKeyword: '',
    address: '',
    propertyPrice: '',
    status: 'sale',
    approvalStatus: 'pending',
    description: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    yearBuilt: '',
    propertyType: '',
    amenities: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Available amenities list
  const availableAmenities = [
    'Shared Gym',
    'Smart Controls',
    'BBQ Area',
    'Private Garden',
    'Children\'s Play Area',
    'Smoke alarm',
    'Self check-in with lockbox',
    'Carbon monoxide alarm',
    'Security cameras',
    'Hangers',
    'Extra pillows & blankets',
    'Bed linens',
    'TV with standard cable',
    'Refrigerator',
    'Dishwasher',
    'Microwave',
    'Coffee maker'
  ];

  // Initialize form data when property changes
  useEffect(() => {
    if (property) {
      setFormData({
        propertyKeyword: property.propertyKeyword || '',
        address: property.address || '',
        propertyPrice: property.propertyPrice || '',
        status: property.status || 'sale',
        approvalStatus: property.approvalStatus || 'pending',
        description: property.description || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        squareFootage: property.squareFootage || '',
        yearBuilt: property.yearBuilt || '',
        propertyType: property.propertyType || '',
        amenities: property.amenities || []
      });
    }
  }, [property]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      const updateData = {
        ...formData,
        propertyPrice: parseFloat(formData.propertyPrice) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        squareFootage: parseInt(formData.squareFootage) || 0,
        yearBuilt: parseInt(formData.yearBuilt) || new Date().getFullYear()
      };

      await listingAPI.updateListing(property._id, updateData);
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update property');
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
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Edit Property
          </h2>
          <button 
            onClick={handleCancel}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            {error && (
              <div className={styles.errorAlert}>
                {error}
              </div>
            )}

            <div className={styles.gridGap28}>
            {/* Property Title */}
            <div>
              <label className={styles.formLabel}>
                Property Title *
              </label>
              <input
                type="text"
                name="propertyKeyword"
                value={formData.propertyKeyword}
                onChange={handleInputChange}
                required
                className={styles.input}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            {/* Address */}
            <div>
              <label className={styles.formLabel}>
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className={styles.input}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            {/* Price and Status Row */}
            <div className={styles.gridTwoCols}>
              <div>
                <label className={styles.formLabel}>
                  Price *
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
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label className={styles.formLabel}>
                  Property Type
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={styles.input}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>

            {/* Property Details Row */}
            <div className={styles.gridThreeCols}>
              <div>
                <label className={styles.formLabel}>
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  className={styles.input}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label className={styles.formLabel}>
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className={styles.input}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label className={styles.formLabel}>
                  Square Footage
                </label>
                <input
                  type="number"
                  name="squareFootage"
                  value={formData.squareFootage}
                  onChange={handleInputChange}
                  min="0"
                  className={styles.input}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>

            {/* Additional Details Row */}
            <div className={styles.gridTwoCols}>
              <div>
                <label className={styles.formLabel}>
                  Year Built
                </label>
                <input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  className={styles.input}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label className={styles.formLabel}>
                  Property Category
                </label>
                <input
                  type="text"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  placeholder="e.g., Apartment, House, Villa"
                  className={styles.input}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={styles.formLabel}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`${styles.input} ${styles.textarea}`}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            {/* Approval Status */}
            <div>
              <label className={styles.formLabel}>
                Approval Status
              </label>
              <select
                name="approvalStatus"
                value={formData.approvalStatus}
                onChange={handleInputChange}
                className={styles.input}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Amenities */}
            <div>
              <label className={styles.formLabel}>
                Amenities
              </label>
              <div className={styles.amenitiesWrap}>
                {/* Available Amenities Grid */}
                <div className={styles.amenitiesGrid}>
                  {availableAmenities.map((amenity) => (
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
                      <span className={formData.amenities.includes(amenity) ? styles.amenitySelected : styles.amenityLabel}>
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Selected Amenities */}
                {formData.amenities.length > 0 && (
                  <div>
                    <div className={styles.selectedAmenitiesTitle}>Selected Amenities:</div>
                    <div className={styles.selectedAmenitiesChips}>
                      {formData.amenities.map((a) => (
                        <span key={a} className={styles.chip}>{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>

            {/* Footer Buttons */}
            <div className={styles.footerButtons}>
              <button type="button" onClick={handleCancel} className={styles.btnSecondary}>Cancel</button>
              <button type="submit" disabled={loading} className={styles.btnPrimary}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyModal;
