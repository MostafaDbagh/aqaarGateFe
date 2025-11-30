"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import DropdownSelect from "../common/DropdownSelect";
import { useCreateListing } from "@/apis/hooks";
import Toast from "../common/Toast";
import DashboardFooter from "../common/DashboardFooter";
import { useRouter } from "next/navigation";
import { syrianProvinces } from "@/constants/provinces";
import { amenitiesList } from "@/constants/amenities";
import logger from "@/utlis/logger";
import styles from "./AddProperty.module.css";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import { sanitizeInput, validateFileUpload } from "@/utils/security";

export default function AddProperty({ isAdminMode = false }) {
  const router = useRouter();
  const { showSuccessModal, showLoginModal } = useGlobalModal();
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    propertyType: "Apartment",
    propertyKeyword: "",
    propertyDesc: "",
    propertyPrice: "",
    currency: "USD",
    status: "rent",
    rentType: isAdminMode ? "one-week" : "three-month",
    bedrooms: "",
    bathrooms: "",
    size: "",
    furnished: false,
    garages: false,
    garageSize: "",
    yearBuilt: "",
    floor: "",
    address: "",
    country: "Syria",
    state: "Aleppo",
    neighborhood: "Downtown",
    agent: "",
    agentId: "",
    amenities: [],
    propertyId: `PROP_${Date.now()}`,
    notes: "",
    // Arabic translation fields
    description_ar: "",
    address_ar: "",
    neighborhood_ar: "",
    notes_ar: ""
  });

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const createListingMutation = useCreateListing();

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

  // Handle tag click - add tag to propertyKeyword
  const handleTagClick = (tag) => {
    const currentKeyword = formData.propertyKeyword.trim();
    if (currentKeyword) {
      // If keyword already contains this tag, don't add it again
      if (currentKeyword.toLowerCase().includes(tag.toLowerCase())) {
        return;
      }
      // Add tag with comma separator
      setFormData(prev => ({
        ...prev,
        propertyKeyword: `${currentKeyword}, ${tag}`
      }));
    } else {
      // If keyword is empty, just set the tag
      setFormData(prev => ({
        ...prev,
        propertyKeyword: tag
      }));
    }
    
    // Clear error if exists
    if (errors.propertyKeyword) {
      setErrors(prev => ({ ...prev, propertyKeyword: '' }));
    }
  };

  // Load user data on mount
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setToast({ type: "error", message: "Please login to add property" });
        setTimeout(() => showLoginModal(), 2000);
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Set agent info in form data
      if (isAdminMode && userData.role === 'admin') {
        // Admin mode: auto-fill with admin details
        setFormData(prev => ({
          ...prev,
          agent: 'admin@aqaargate.com',
          agentId: userData._id,
          agentEmail: 'admin@aqaargate.com',
          agentNumber: userData.phone || '',
          agentWhatsapp: userData.phone || ''
        }));
      } else {
        // Regular agent mode
        setFormData(prev => ({
          ...prev,
          agent: userData.email,
          agentId: userData._id
        }));
      }
    };

    loadUser();
  }, [router]);

  // Check if agent is blocked
  const isAgentBlocked = user?.isBlocked === true;
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Update rentType when propertyType changes to Villa and status is rent
  useEffect(() => {
    if (formData.propertyType === "Villa" && formData.status === "rent") {
      // Set default to "daily" for Villa rent if current value is not in Villa options
      if (!["daily", "one-week", "two-week", "monthly"].includes(formData.rentType)) {
        setFormData(prev => ({
          ...prev,
          rentType: "daily"
        }));
      }
    } else if (formData.status === "rent") {
      // Reset to default for non-Villa rent properties
      if (["daily", "one-week", "two-week", "monthly"].includes(formData.rentType)) {
        setFormData(prev => ({
          ...prev,
          rentType: isAdmin || isAdminMode ? "one-week" : "three-month"
        }));
      }
    }
  }, [formData.propertyType, formData.status, isAdmin, isAdminMode]);
  
  // Property types - Holiday Home only for admin
  const getPropertyTypes = () => {
    const baseTypes = ["Apartment", "Villa", "Office", "House", "Land", "Commercial"];
    if (isAdmin || isAdminMode) {
      return [...baseTypes, "Holiday Home"];
    }
    return baseTypes;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For checkboxes, use checked value directly
    // For text inputs, allow spaces but remove only dangerous characters (<, >, javascript:, on*=)
    // Don't use sanitizeInput during typing as it trims spaces
    let sanitizedValue;
    if (type === 'checkbox') {
      sanitizedValue = checked;
    } else if (name === 'yearBuilt') {
      // Special handling for yearBuilt - allow numbers only
      const numericValue = value.replace(/[^0-9]/g, ''); // Only allow digits
      const currentYear = new Date().getFullYear();
      const maxYear = currentYear;
      const minYear = 1900;
      
      // Allow typing numbers freely, but validate immediately
      if (numericValue) {
        // Prevent more than 4 digits
        if (numericValue.length > 4) {
          sanitizedValue = formData.yearBuilt; // Keep previous value
          setErrors(prev => ({ ...prev, yearBuilt: `Year cannot be more than 4 digits. The date is invalid.` }));
          return; // Don't update
        }
        
        const yearNum = parseInt(numericValue);
        
        // Validate and show error immediately - check even while typing
        if (yearNum < minYear) {
          sanitizedValue = numericValue; // Allow typing but show error
          setErrors(prev => ({ ...prev, yearBuilt: `Year must be at least ${minYear}. The date is invalid.` }));
        } else if (yearNum > maxYear) {
          sanitizedValue = numericValue; // Allow typing but show error
          setErrors(prev => ({ ...prev, yearBuilt: `Year cannot be greater than ${maxYear}. The date is invalid.` }));
        } else {
          // Valid year - clear error
          sanitizedValue = numericValue;
          setErrors(prev => ({ ...prev, yearBuilt: '' }));
        }
      } else {
        // Empty value - clear error
        sanitizedValue = numericValue;
        setErrors(prev => ({ ...prev, yearBuilt: '' }));
      }
    } else if (type === 'text' || type === 'textarea' || type === 'email') {
      // Only remove dangerous characters, keep spaces
      sanitizedValue = value
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
      // Don't use .trim() here to allow spaces
    } else {
      sanitizedValue = value;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // For yearBuilt, errors are already set in the special handling above
    // For other fields, clear error when user starts typing
    if (name !== 'yearBuilt' && errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear Arabic field errors when user starts typing
    if (name.includes('_ar') && errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 10) {
      setToast({ type: "error", message: "Maximum 10 images allowed" });
      return;
    }

    // Validate and sanitize each file using security utility
    const validFiles = [];
    for (const file of files) {
      const validation = validateFileUpload(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
        maxFiles: 10
      });
      
      if (!validation.valid) {
        setToast({ type: "error", message: validation.error });
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (validFiles.length === 0) {
      return;
    }

    const newImages = [...images, ...validFiles];
    setImages(newImages);

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...newPreviews]);
    
    setToast({ type: "success", message: `${validFiles.length} image(s) added successfully` });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    
    setImages(newImages);
    setImagePreview(newPreviews);
  };

  const handleAmenityChange = (amenity, checked) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  // Check if all Arabic fields are filled
  const isArabicSectionComplete = () => {
    return (
      formData.description_ar && formData.description_ar.trim() !== '' &&
      formData.address_ar && formData.address_ar.trim() !== '' &&
      formData.neighborhood_ar && formData.neighborhood_ar.trim() !== '' &&
      formData.notes_ar && formData.notes_ar.trim() !== ''
    );
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.propertyType) newErrors.propertyType = "Property type is required";
    if (!formData.propertyKeyword) newErrors.propertyKeyword = "Property keyword/title is required";
    if (!formData.propertyDesc) newErrors.propertyDesc = "Property description is required";
    if (!formData.propertyPrice || isNaN(formData.propertyPrice) || parseFloat(formData.propertyPrice) <= 0) {
      newErrors.propertyPrice = "Valid price is required";
    }
    if (!formData.status) newErrors.status = "Property status (sale/rent) is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.neighborhood) newErrors.neighborhood = "Neighborhood is required";
    
    // Arabic translation fields - REQUIRED
    if (!formData.description_ar || formData.description_ar.trim() === '') {
      newErrors.description_ar = "Arabic description is required";
    }
    if (!formData.address_ar || formData.address_ar.trim() === '') {
      newErrors.address_ar = "Arabic address is required";
    }
    if (!formData.neighborhood_ar || formData.neighborhood_ar.trim() === '') {
      newErrors.neighborhood_ar = "Arabic neighborhood is required";
    }
    if (!formData.notes_ar || formData.notes_ar.trim() === '') {
      newErrors.notes_ar = "Arabic notes are required";
    }
    
    // Numeric validations
    if (!formData.bedrooms || isNaN(formData.bedrooms) || parseInt(formData.bedrooms) < 0) {
      newErrors.bedrooms = "Valid number of bedrooms is required";
    }
    if (!formData.bathrooms || isNaN(formData.bathrooms) || parseInt(formData.bathrooms) < 0) {
      newErrors.bathrooms = "Valid number of bathrooms is required";
    }
    if (!formData.size || isNaN(formData.size) || parseInt(formData.size) <= 0) {
      newErrors.size = "Valid size is required";
    }
    // Year built validation - dynamic max year (current year), min year is 1900
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear;
    const minYear = 1900;
    if (formData.yearBuilt && (isNaN(formData.yearBuilt) || parseInt(formData.yearBuilt) < minYear || parseInt(formData.yearBuilt) > maxYear)) {
      newErrors.yearBuilt = `Valid year is required (between ${minYear} and ${maxYear})`;
    }
    
    // User/Agent validation
    if (!formData.agent) newErrors.agent = "Agent email is required";
    if (!formData.agentId) newErrors.agentId = "Agent ID is required";
    if (!formData.propertyId) newErrors.propertyId = "Property ID is required";

    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Mark that submit has been attempted
    setSubmitAttempted(true);
  
    // Check if agent is blocked
    if (isAgentBlocked) {
      setToast({ type: "error", message: "Your account is blocked. You cannot add properties." });
      return;
    }

    logger.debug("🔄 Form submitted - Starting validation");
    
    const isValid = validateForm();
    logger.debug("✅ Form validation result:", isValid);
    logger.debug("📋 Form errors:", errors);
    logger.debug("📋 Form data:", formData);
    
    if (!isValid) {
      // Wait for state update and then show first error
      setTimeout(() => {
        const firstError = Object.keys(errors)[0];
        if (firstError) {
          const errorMessage = errors[firstError];
          setToast({ type: "error", message: errorMessage || "Please fix the errors in the form" });
          const element = document.querySelector(`[name="${firstError}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        } else {
          setToast({ type: "error", message: "Please fix the errors in the form. Check console for details." });
        }
      }, 10);
      return;
    }

    // Check if user is logged in
    if (!user) {
      logger.error("❌ User not logged in");
      setToast({ type: "error", message: "Please login to add property" });
      setTimeout(() => showLoginModal(), 2000);
      return;
    }
    
    logger.debug("✅ User authenticated:", user?.email);

    setIsSubmitting(true);
    
    logger.debug("📤 Preparing to make API call...");
    
    try {
      // IMPORTANT: Preserve exact propertyPrice value as entered by agent
      // NO DEDUCTION, NO MODIFICATION - Price must be sent exactly as entered
      const originalPrice = formData.propertyPrice;
      const parsedPrice = parseFloat(formData.propertyPrice);
      logger.info(`💰 Frontend - Property Price - Original: ${originalPrice}, Type: ${typeof originalPrice}, Parsed: ${parsedPrice}, Type: ${typeof parsedPrice}`);
      
      if (isNaN(parsedPrice)) {
        setErrors(prev => ({ ...prev, propertyPrice: "Valid price is required" }));
        return;
      }
      
      // CRITICAL: Ensure price is sent exactly as entered - NO DEDUCTION ALLOWED
      // Verify parsed price matches original (accounting for string to number conversion)
      if (originalPrice && Math.abs(parseFloat(originalPrice) - parsedPrice) > 0.01) {
        logger.error(`💰 Price mismatch detected! Original: ${originalPrice}, Parsed: ${parsedPrice}`);
        setErrors(prev => ({ ...prev, propertyPrice: "Price validation error" }));
        return;
      }
      
      const submitData = {
        ...formData,
        // Map state to city for backend compatibility (backend requires city field)
        city: formData.state || formData.city || "Aleppo",
        propertyPrice: parsedPrice, // CRITICAL: Send exact price - NO DEDUCTION, NO MODIFICATION
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        size: parseInt(formData.size),
        landArea: formData.landArea ? parseInt(formData.landArea) : parseInt(formData.size),
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : new Date().getFullYear(),
        floor: formData.floor ? parseInt(formData.floor) : undefined,
        garageSize: formData.garages && formData.garageSize ? parseInt(formData.garageSize) : 0,
        approvalStatus: isAdminMode && user?.role === 'admin' ? "approved" : "pending",
        isSold: false,
        isDeleted: false,
        // Auto-embed agent contact info from user profile
        agentEmail: isAdminMode && user?.role === 'admin' 
          ? 'admin@aqaargate.com' 
          : (user?.email || ""),
        agentNumber: user?.phone || "",
        agentWhatsapp: user?.phone || "",
        images: images,
        imageNames: images.map(img => img.name)
      };

      logger.debug("📤 Submitting property data:", submitData);
      logger.debug("📤 Images count:", images.length);
      logger.debug("📤 createListingMutation:", createListingMutation);
      
      const result = await createListingMutation.mutateAsync(submitData);
      
      logger.debug("Property created successfully:", result);
      
      // Show success modal
      const successMessage = isAdminMode && user?.role === 'admin'
        ? "Property has been added successfully and is automatically approved!"
        : "Your property has been submitted and is pending approval. You will be redirected to your properties page.";
      
      showSuccessModal(
        "Property Added Successfully!",
        successMessage,
        user?.email || ""
      );
      
      // Reset form with default values
      const resetFormData = {
        propertyType: "Apartment",
        propertyKeyword: "",
        propertyDesc: "",
        propertyPrice: "",
        currency: "USD",
        status: "rent",
        rentType: isAdminMode ? "one-week" : "three-month",
        bedrooms: "",
        bathrooms: "",
        size: "",
        furnished: false,
        garages: false,
        garageSize: "",
        yearBuilt: "",
        floor: "",
        address: "",
        country: "Syria",
        state: "Aleppo",
        neighborhood: "Downtown",
        amenities: [],
        propertyId: `PROP_${Date.now()}`,
        notes: "",
        // Arabic translation fields
        description_ar: "",
        address_ar: "",
        neighborhood_ar: "",
        notes_ar: ""
      };
      
      // If admin mode, auto-fill admin details again
      if (isAdminMode && user?.role === 'admin') {
        resetFormData.agent = 'admin@aqaargate.com';
        resetFormData.agentId = user._id;
        resetFormData.agentEmail = 'admin@aqaargate.com';
        resetFormData.agentNumber = user.phone || '';
        resetFormData.agentWhatsapp = user.phone || '';
      } else {
        resetFormData.agent = user?.email || "";
        resetFormData.agentId = user?._id || "";
      }
      
      setFormData(resetFormData);
      setImages([]);
      setImagePreview([]);
      setErrors({});
      
      // Redirect to my properties page after 2 seconds
      setTimeout(() => router.push("/my-property"), 2000);
      
    } catch (error) {
      logger.error("Error creating property:", error);
      
      let errorMessage = "Failed to create property";
      
      // Handle different error types
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      
      // Check for insufficient points error
      if (errorMessage.includes("Insufficient points") || errorMessage.includes("points")) {
        setToast({ 
          type: "error", 
          message: `${errorMessage}. Please purchase more points.` 
        });
      } else {
        setToast({ type: "error", message: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const amenityOptions = amenitiesList;

  return (
    <div className="main-content w-100">
      <div className="main-content-inner">
        <div className="button-show-hide show-mb">
          <span className="body-1">Show Dashboard</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Upload Media Section */}
          <div className="widget-box-2 mb-20">
            <h3 className="title">Upload Media</h3>
            <div className="box-uploadfile text-center">
              <div className="uploadfile">
                <label
                  htmlFor="imageUpload"
                  className="tf-btn bg-color-primary pd-10 btn-upload mx-auto cursor-pointer"
                >
                  <svg width={21}
                    height={20}
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                   aria-hidden="true">
                    <path
                      d="M13.625 14.375V17.1875C13.625 17.705 13.205 18.125 12.6875 18.125H4.5625C4.31386 18.125 4.0754 18.0262 3.89959 17.8504C3.72377 17.6746 3.625 17.4361 3.625 17.1875V6.5625C3.625 6.045 4.045 5.625 4.5625 5.625H6.125C6.54381 5.62472 6.96192 5.65928 7.375 5.72834M13.625 14.375H16.4375C16.955 14.375 17.375 13.955 17.375 13.4375V9.375C17.375 5.65834 14.6725 2.57417 11.125 1.97834C10.7119 1.90928 10.2938 1.87472 9.875 1.875H8.3125C7.795 1.875 7.375 2.295 7.375 2.8125V5.72834M13.625 14.375H8.3125C8.06386 14.375 7.8254 14.2762 7.64959 14.1004C7.47377 13.9246 7.375 13.6861 7.375 13.4375V5.72834M17.375 11.25V9.6875C17.375 8.94158 17.0787 8.22621 16.5512 7.69876C16.0238 7.17132 15.3084 6.875 14.5625 6.875H13.3125C13.0639 6.875 12.8254 6.77623 12.6496 6.60041C12.4738 6.4246 12.375 6.18614 12.375 5.9375V4.6875C12.375 4.31816 12.3023 3.95243 12.1609 3.6112C12.0196 3.26998 11.8124 2.95993 11.5512 2.69876C11.2901 2.4376 10.98 2.23043 10.6388 2.08909C10.2976 1.94775 9.93184 1.875 9.5625 1.875H8.625"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Select photos
                  <input 
                    id="imageUpload"
                    type="file" 
                    className="ip-file" 
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="file-name fw-5">
                  or drag photos here <br />
                  <span>(Up to 10 photos)</span>
                </p>
              </div>
            </div>
            
            {imagePreview.length > 0 && (
              <div className="box-img-upload">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="item-upload file-delete">
                    <Image
                      alt="Property image preview"
                      width={615}
                      height={405}
                      src={preview}
                      className="object-cover"
                    />
                    <span 
                      className="icon icon-trashcan1 remove-file cursor-pointer"
                      onClick={() => removeImage(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="widget-box-2 mb-20">
            <h5 className="title">Information</h5>
            <div className="box-info-property">
              <fieldset className="box box-fieldset">
                <label htmlFor="propertyKeyword">
                  Property Keyword:<span>*</span>
                </label>
                <input
                  type="text"
                  name="propertyKeyword"
                  className="form-control"
                  placeholder="e.g., Luxury, Modern, Spacious"
                  value={formData.propertyKeyword}
                  onChange={handleInputChange}
                />
                {errors.propertyKeyword && <span className="text-danger">{errors.propertyKeyword}</span>}
                
                {/* Keyword Tags Suggestions */}
                <div className={styles.keywordTagsContainer}>
                  <span className={styles.keywordTagsLabel}>Suggested tags:</span>
                  {keywordTags.map((tag, index) => (
                    <span
                      key={index}
                      className={styles.keywordTag}
                      onClick={() => handleTagClick(tag)}
                      title={`Click to add "${tag}"`}
                    >
                      {tag}
                      <span className={styles.keywordTagIcon}>+</span>
                    </span>
                  ))}
                </div>
              </fieldset>
              
              <fieldset className="box box-fieldset">
                <label htmlFor="propertyDesc">Description:</label>
                <textarea
                  name="propertyDesc"
                  className="textarea"
                  placeholder="Describe your property"
                  value={formData.propertyDesc}
                  onChange={handleInputChange}
                />
              </fieldset>
              
              <div className="box grid-layout-3 gap-30">
                <fieldset className="box-fieldset">
                  <label htmlFor="address">
                    Full Address:<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="Enter property full address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  {errors.address && <span className="text-danger">{errors.address}</span>}
                </fieldset>
               
                <fieldset className="box-fieldset">
                  <label htmlFor="country">
                    Country:<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    className={`form-control ${styles.disabledInput}`}
                    value="Syria"
                    disabled
                  />
                  {errors.country && <span className="text-danger">{errors.country}</span>}
                </fieldset>
              </div>
              
              <div className="box grid-layout-2 gap-30">
                <fieldset className="box-fieldset">
                  <label htmlFor="state">
                    Province/State:<span>*</span>
                  </label>
                  <DropdownSelect
                    name="state"
                    options={syrianProvinces}
                    selectedValue={formData.state}
                    onChange={(value) => handleDropdownChange('state', value)}
                    addtionalParentClass=""
                  />
                  {errors.state && <span className="text-danger">{errors.state}</span>}
                </fieldset>
                
                <fieldset className="box-fieldset">
                  <label htmlFor="neighborhood">
                    Neighborhood:<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="neighborhood"
                    className="form-control"
                    placeholder="Enter neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                  />
                  {errors.neighborhood && <span className="text-danger">{errors.neighborhood}</span>}
                </fieldset>
              </div>
            </div>
          </div>

          {/* Price Section */}


          {/* Additional Information Section */}
          <div className="widget-box-2 mb-20">
            <h3 className="title">Additional Information</h3>
            <div className="box grid-layout-3 gap-30">
              <fieldset className="box-fieldset">
                <label htmlFor="propertyType">
                  Property Type:<span>*</span>
                </label>
                <DropdownSelect
                  name="propertyType"
                  options={getPropertyTypes()}
                  selectedValue={formData.propertyType}
                  onChange={(value) => handleDropdownChange('propertyType', value)}
                  addtionalParentClass=""
                />
                {errors.propertyType && <span className="text-danger">{errors.propertyType}</span>}
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label htmlFor="status">
                  Property Status:<span>*</span>
                </label>
                <DropdownSelect
                  name="status"
                  options={["rent", "sale"]}
                  selectedValue={formData.status}
                  onChange={(value) => handleDropdownChange('status', value)}
                  addtionalParentClass=""
                />
                {errors.status && <span className="text-danger">{errors.status}</span>}
              </fieldset>
              
              {formData.status === "rent" && (
                <fieldset className="box-fieldset">
                  <label htmlFor="rentType">
                    Rent Period charge:<span>*</span>
                  </label>
                  <DropdownSelect
                    name="rentType"
                    options={
                      // For Villa + rent: show daily, one-week, two-week, monthly
                      formData.propertyType === "Villa" && formData.status === "rent"
                        ? ["daily", "one-week", "two-week", "monthly"]
                        // For admin: show all options
                        : isAdmin || isAdminMode
                        ? ["one-week", "two-week", "three-week", "one-month", "three-month", "six-month", "one-year"]
                        // For regular agents: show three-month, six-month, one-year
                        : ["monthly", "three-month", "six-month", "one-year"]
                    }
                    selectedValue={formData.rentType}
                    onChange={(value) => handleDropdownChange('rentType', value)}
                    addtionalParentClass=""
                  />
                  {errors.rentType && <span className="text-danger">{errors.rentType}</span>}
                </fieldset>
              )}
              
              <fieldset className="box-fieldset">
                <label htmlFor="propertyId">
                  Property ID:<span>*</span>
                </label>
                <input
                  type="text"
                  name="propertyId"
                  className="form-control"
                  value={formData.propertyId}
                  onChange={handleInputChange}
                />
                {errors.propertyId && <span className="text-danger">{errors.propertyId}</span>}
              </fieldset>
            </div>
            
            <div className="box grid-layout-3 gap-30">
              <fieldset className="box-fieldset">
                <label htmlFor="size">
                  Size (SqFt):<span>*</span>
                </label>
                <input
                  type="number"
                  name="size"
                  className="form-control"
                  value={formData.size}
                  onChange={handleInputChange}
                  min="0"
                />
                {errors.size && <span className="text-danger">{errors.size}</span>}
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label htmlFor="yearBuilt">
                  Year Built:
                </label>
                <input
                  type="number"
                  name="yearBuilt"
                  className="form-control"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="e.g., 2020"
                />
                {errors.yearBuilt && (
                  <span className="text-danger" style={{ display: 'block', marginTop: '5px', fontSize: '14px', fontWeight: '500' }}>
                    {errors.yearBuilt}
                  </span>
                )}
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label htmlFor="floor">
                  Floor:
                </label>
                <input
                  type="number"
                  name="floor"
                  className="form-control"
                  value={formData.floor}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="e.g., 3"
                />
              </fieldset>
            </div>
            
            <div className="box grid-layout-3 gap-30">
              <fieldset className="box-fieldset">
                <label htmlFor="bedrooms">
                  Bedrooms:<span>*</span>
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  className="form-control"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="1"
                />
                {errors.bedrooms && <span className="text-danger">{errors.bedrooms}</span>}
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label htmlFor="bathrooms">
                  Bathrooms:<span>*</span>
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  className="form-control"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="1"
                />
                {errors.bathrooms && <span className="text-danger">{errors.bathrooms}</span>}
              </fieldset>
            </div>
            
            <div className="box" style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
              <fieldset className="box-fieldset">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    name="furnished"
                    checked={formData.furnished}
                    onChange={handleInputChange}
                  />
                  <span>Furnished</span>
                </label>
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    name="garages"
                    checked={formData.garages}
                    onChange={handleInputChange}
                  />
                  <span>Has Garages</span>
                </label>
              </fieldset>
            </div>
            
            {/* Show Garage Size input only if "Has Garages" is checked */}
            {formData.garages && (
              <div className="box" style={{ 
                marginTop: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '30px'
              }}>
                <fieldset className="box-fieldset" style={{ gridColumn: 'span 4' }}>
                  <label htmlFor="garageSize">
                    Garage Size (SqFt):
                  </label>
                  <input
                    type="number"
                    name="garageSize"
                    id="garageSize"
                    className="form-control"
                    value={formData.garageSize}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Enter garage size in square feet"
                  />
                </fieldset>
              </div>
            )}
            
            <fieldset className="box-fieldset" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="notes">
                Notes:
              </label>
              <textarea
                style={{ fontSize: '18px', lineHeight: '22.4px', fontWeight: '500',color: '#374151' }}
                name="notes"
                id="notes"
                className="form-control"
                rows="4"
                placeholder="Any additional notes about the property..."
                value={formData.notes}
                onChange={handleInputChange}
              />
            </fieldset>
          </div>
          <div className="widget-box-2 mb-20">
            <h3 className="title">Price</h3>
            <div className="box-price-property">
              <div className="box grid-2 gap-30">
                <fieldset className="box-fieldset mb-30">
                  <label htmlFor="propertyPrice">
                    Price:<span>*</span>
                  </label>
                  <input
                    type="number"
                    name="propertyPrice"
                    className="form-control"
                    placeholder="Example: 250000"
                    value={formData.propertyPrice}
                    onChange={handleInputChange}
                    min="0"
                  />
                  {errors.propertyPrice && <span className="text-danger">{errors.propertyPrice}</span>}
                </fieldset>
                
                <fieldset className="box-fieldset mb-30">
                  <label htmlFor="currency">
                    Currency:<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="currency"
                    className={`form-control ${styles.disabledInput}`}
                    value="USD"
                    disabled
                    readOnly
                  />
                  {errors.currency && <span className="text-danger">{errors.currency}</span>}
                </fieldset>
              </div>
            </div>
          </div>

          {/* Arabic Translation Section */}
          <div className="widget-box-2 mb-20">
            <h3 className="title">Arabic Translation (الترجمة العربية) <span style={{ color: '#dc3545' }}>*</span></h3>
            <div className="box-info-property">
              <fieldset className="box box-fieldset">
                <label htmlFor="description_ar">
                  Description (الوصف):<span style={{ color: '#dc3545' }}>*</span>
                </label>
                <textarea
                  name="description_ar"
                  className={`textarea ${errors.description_ar ? 'is-invalid' : ''}`}
                  placeholder="أدخل وصف العقار بالعربية"
                  value={formData.description_ar}
                  onChange={handleInputChange}
                  dir="rtl"
                  required
                />
                {errors.description_ar && (
                  <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                    {errors.description_ar}
                  </span>
                )}
              </fieldset>
              
              <fieldset className="box box-fieldset">
                <label htmlFor="address_ar">
                  Full Address (العنوان الكامل):<span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  name="address_ar"
                  className={`form-control ${errors.address_ar ? 'is-invalid' : ''}`}
                  placeholder="أدخل العنوان الكامل بالعربية"
                  value={formData.address_ar}
                  onChange={handleInputChange}
                  dir="rtl"
                  required
                />
                {errors.address_ar && (
                  <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                    {errors.address_ar}
                  </span>
                )}
              </fieldset>
              
              <fieldset className="box box-fieldset">
                <label htmlFor="neighborhood_ar">
                  Neighborhood (الحي):<span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  name="neighborhood_ar"
                  className={`form-control ${errors.neighborhood_ar ? 'is-invalid' : ''}`}
                  placeholder="أدخل اسم الحي بالعربية"
                  value={formData.neighborhood_ar}
                  onChange={handleInputChange}
                  dir="rtl"
                  required
                />
                {errors.neighborhood_ar && (
                  <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                    {errors.neighborhood_ar}
                  </span>
                )}
              </fieldset>
              
              <fieldset className="box box-fieldset">
                <label htmlFor="notes_ar">
                  Notes (ملاحظات):<span style={{ color: '#dc3545' }}>*</span>
                </label>
                <textarea
                  name="notes_ar"
                  className={`textarea ${errors.notes_ar ? 'is-invalid' : ''}`}
                  placeholder="أي ملاحظات إضافية بالعربية..."
                  value={formData.notes_ar}
                  onChange={handleInputChange}
                  dir="rtl"
                  rows="4"
                  required
                />
                {errors.notes_ar && (
                  <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                    {errors.notes_ar}
                  </span>
                )}
              </fieldset>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="widget-box-2 mb-20">
            <h5 className="title">
              Amenities<span>*</span>
            </h5>
            <div className="box-amenities-property">
              <div className="grid grid-cols-2 gap-4">
                {amenityOptions.map((amenity) => (
                  <fieldset key={amenity} className="checkbox-item style-1">
                    <label>
                      <span className="text-4">{amenity}</span>
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                      />
                      <span className="btn-checkbox" />
                    </label>
                  </fieldset>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="box-btn">
            <button
              type="submit"
              className="tf-btn bg-color-primary pd-13"
              disabled={isSubmitting || isAgentBlocked || !isArabicSectionComplete()}
              style={isAgentBlocked ? { 
                opacity: 0.5, 
                cursor: 'not-allowed',
                backgroundColor: '#ccc'
              } : (!isArabicSectionComplete() ? { 
                opacity: 0.6, 
                cursor: 'not-allowed' 
              } : {})}
              title={isAgentBlocked ? 'Your account is blocked. This action is disabled.' : (!isArabicSectionComplete() ? "Please fill all required Arabic fields" : 'Add property')}
              onClick={(e) => {
                // Directly call handleSubmit to ensure API call happens
                handleSubmit(e);
              }}
            >
              {isSubmitting ? "Creating Property..." : "Add Property"}
            </button>
            {submitAttempted && !isArabicSectionComplete() && (
              <p style={{ 
                marginTop: '10px', 
                color: '#dc3545', 
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'center'
              }}>
                Please fill all required Arabic fields to submit
              </p>
            )}
            
            <button
              type="button"
              className="tf-btn style-border pd-10"
              disabled={isAgentBlocked}
              onClick={() => {
                // Check if agent is blocked
                if (isAgentBlocked) {
                  setToast({ type: "error", message: "Your account is blocked. This action is disabled." });
                  return;
                }
                // Save as draft functionality
                logger.debug("Save as draft:", formData);
                setToast({ type: "success", message: "Draft saved!" });
              }}
              style={isAgentBlocked ? { 
                opacity: 0.5, 
                cursor: 'not-allowed',
                borderColor: '#ccc',
                color: '#ccc'
              } : {}}
              title={isAgentBlocked ? 'Your account is blocked. This action is disabled.' : 'Save and preview property'}
            >
              Save & Preview
            </button>
          </div>
        </form>

        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}
