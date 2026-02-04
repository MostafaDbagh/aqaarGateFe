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
import { keywordTags } from "@/constants/keywordTags";
import logger from "@/utlis/logger";
import styles from "./AddProperty.module.css";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import { sanitizeInput, validateFileUpload } from "@/utils/security";
import { useTranslations } from 'next-intl';
import { translateKeywordWithT } from '@/utils/translateKeywords';
import { userAPI } from '@/apis/user';

export default function AddProperty({ isAdminMode = false }) {
  const t = useTranslations('agent.addProperty');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { showSuccessModal, showLoginModal } = useGlobalModal();
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  // Hide spinner arrows for number inputs
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleId = 'hide-number-spinners';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none !important;
            margin: 0 !important;
            display: none !important;
          }
          input[type="number"] {
            -moz-appearance: textfield !important;
            -webkit-appearance: none !important;
            appearance: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);
  
  const [formData, setFormData] = useState({
    propertyType: "Apartment",
    propertyKeyword: "",
    propertyDesc: "",
    propertyPrice: "",
    currency: "USD",
    status: "rent",
    rentType: "monthly",
    bedrooms: "",
    bathrooms: "",
    size: "",
    sizeUnit: "", // Required field - will default to 'sqm' if not selected
    furnished: false,
    garages: false,
    garageSize: "",
    yearBuilt: "",
    floor: "",
    numberOfFloors: "",
    address: "",
    country: "Syria",
    state: "Damascus",
    neighborhood: "Downtown",
    agent: "",
    agentId: "",
    agentName: "", // Agent name (admin can specify when posting on behalf of others)
    agentName_ar: "", // Arabic agent name
    agentEmail: "", // Contact email (admin can change this)
    agentNumber: "", // Contact phone (admin can change this)
    agentWhatsapp: "", // Contact WhatsApp (admin can change this)
    agentFacebook: "", // Facebook URL (optional, admin only)
    amenities: [],
    propertyId: `PROP_${Date.now()}`,
    notes: "",
    mapLocation: "", // Google Maps location URL or coordinates
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
    
    // Clear error if exists
    if (errors.propertyKeyword) {
      setErrors(prev => ({ ...prev, propertyKeyword: '' }));
    }
  };
  
  // Check if a tag is selected
  const isTagSelected = (tag) => {
    const currentKeywords = formData.propertyKeyword
      .split(',')
      .map(k => k.trim())
      .filter(k => k);
    return currentKeywords.some(k => k.toLowerCase() === tag.toLowerCase());
  };

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setToast({ type: "error", message: "Please login to add property" });
        setTimeout(() => showLoginModal(), 2000);
        return;
      }

      const userData = JSON.parse(storedUser);
      
      // Try to fetch fresh user data from API to get latest isBlocked status
      // Only try if we have a token and user ID, and fail silently if API is unavailable
      const token = localStorage.getItem('token');
      if (token && userData._id) {
        userAPI.getProfile(userData._id)
          .then((freshUserData) => {
            // Use fresh data if available, otherwise fallback to stored data
            const finalUserData = freshUserData?.data || freshUserData || userData;
            setUser(finalUserData);
            
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(finalUserData));
            
            // Set agent info in form data
            if (isAdminMode && finalUserData.role === 'admin') {
              // Admin mode: auto-fill with admin details
              setFormData(prev => ({
                ...prev,
                agent: 'admin@aqaargate.com',
                agentId: finalUserData._id,
                agentName: finalUserData.agentName || finalUserData.username || '',
                agentEmail: 'admin@aqaargate.com',
                agentNumber: finalUserData.phone || '',
                agentWhatsapp: finalUserData.phone || ''
              }));
            } else {
              // Regular agent mode
              setFormData(prev => ({
                ...prev,
                agent: finalUserData.email,
                agentId: finalUserData._id
              }));
            }
          })
          .catch((error) => {
            // Silently fail and use stored data - don't show errors for API failures
            // This is expected when API server is not running
            logger.debug('Failed to fetch fresh user data, using stored data:', error);
          });
      }
      
      // Fallback to stored data if API call fails
      setUser(userData);
      
      // Set agent info in form data
      if (isAdminMode && userData.role === 'admin') {
        // Admin mode: auto-fill with admin details
        setFormData(prev => ({
          ...prev,
          agent: 'admin@aqaargate.com',
          agentId: userData._id,
          agentName: userData.agentName || userData.username || '',
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
  }, [router, showLoginModal, isAdminMode]);

  // Check if user is admin (must be defined before use)
  const isAdmin = user?.role === 'admin';
  
  // Check if agent is blocked (strict check - only true when explicitly blocked)
  const isAgentBlocked = user?.isBlocked === true;
  
  // Show warning banner ONLY for blocked agents (not for admins or unblocked agents)
  const showWarning = isAgentBlocked && !isAdmin && !isAdminMode;

  // Update rentType when propertyType changes to Villa or Holiday Home and status is rent
  useEffect(() => {
    if ((formData.propertyType === "Villa" || formData.propertyType === "Holiday Home") && formData.status === "rent") {
      // Set default to "daily" for Villa or Holiday Home rent if current value is not in options
      const validOptions = ["daily", "weekly", "monthly"];
      if (!validOptions.includes(formData.rentType)) {
        setFormData(prev => ({
          ...prev,
          rentType: "daily"
        }));
      }
    } else if (formData.status === "rent") {
      // Reset to default for non-Villa/Holiday Home rent properties
      if (["daily", "weekly", "monthly"].includes(formData.rentType)) {
        setFormData(prev => ({
          ...prev,
          rentType: isAdmin || isAdminMode ? "weekly" : "monthly"
        }));
      }
    }
  }, [formData.propertyType, formData.status, isAdmin, isAdminMode]);
  
  // Property types - Holiday Home only for admin; Building has numberOfFloors
  const getPropertyTypes = () => {
    const baseTypes = ["Apartment", "Villa", "Building", "Office", "Land", "Commercial"];
    if (isAdmin || isAdminMode) {
      return [...baseTypes, "Holiday Home"];
    }
    return baseTypes;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Prevent direct editing of propertyKeyword - only allow tag selection
    if (name === 'propertyKeyword') {
      return;
    }
    
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
    
    if (files.length + images.length > 15) {
      setToast({ type: "error", message: "Maximum 15 images allowed" });
      return;
    }

    // Validate and sanitize each file using security utility
    const validFiles = [];
    for (const file of files) {
      const validation = validateFileUpload(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
        maxFiles: 15
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

  // Check if all Arabic fields are filled (notes_ar is optional)
  const isArabicSectionComplete = () => {
    return (
      formData.description_ar && formData.description_ar.trim() !== '' &&
      formData.address_ar && formData.address_ar.trim() !== '' &&
      formData.neighborhood_ar && formData.neighborhood_ar.trim() !== ''
      // notes_ar is optional, so we don't check it
    );
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.propertyType) newErrors.propertyType = "Property type is required";
    // Property keyword is optional - no validation needed
    if (!formData.propertyDesc) newErrors.propertyDesc = "Property description is required";
    if (!formData.propertyPrice || isNaN(formData.propertyPrice) || parseFloat(formData.propertyPrice) <= 0) {
      newErrors.propertyPrice = "Valid price is required";
    }
    if (!formData.status) newErrors.status = "Property status (sale/rent) is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.neighborhood) newErrors.neighborhood = "Neighborhood is required";
    
    // Arabic translation fields - REQUIRED (except notes_ar which is optional)
    if (!formData.description_ar || formData.description_ar.trim() === '') {
      newErrors.description_ar = "Arabic description is required";
    }
    if (!formData.address_ar || formData.address_ar.trim() === '') {
      newErrors.address_ar = "Arabic address is required";
    }
    if (!formData.neighborhood_ar || formData.neighborhood_ar.trim() === '') {
      newErrors.neighborhood_ar = "Arabic neighborhood is required";
    }
    // notes_ar is optional - no validation needed
    
    // Numeric validations
    // Only validate bedrooms if property type is not Land, Commercial, Office, or Building
    if (formData.propertyType !== "Land" && formData.propertyType !== "Commercial" && formData.propertyType !== "Office" && formData.propertyType !== "Building") {
      if (!formData.bedrooms || isNaN(formData.bedrooms) || parseInt(formData.bedrooms) < 0) {
        newErrors.bedrooms = "Valid number of bedrooms is required";
      }
    }
    // Only validate bathrooms if property type is not Land, Commercial, Office, or Building
    // For Commercial and Office, bathrooms is optional
    if (formData.propertyType !== "Land" && formData.propertyType !== "Commercial" && formData.propertyType !== "Office" && formData.propertyType !== "Building") {
      if (!formData.bathrooms || isNaN(formData.bathrooms) || parseInt(formData.bathrooms) < 0) {
        newErrors.bathrooms = "Valid number of bathrooms is required";
      }
    }
    // For Building type: require number of floors (min 1)
    if (formData.propertyType === "Building") {
      if (!formData.numberOfFloors || isNaN(formData.numberOfFloors) || parseInt(formData.numberOfFloors) < 1) {
        newErrors.numberOfFloors = t('howManyFloorsRequired');
      }
    }
    if (!formData.size || isNaN(formData.size) || parseInt(formData.size) <= 0) {
      newErrors.size = "Valid size is required";
    }
    if (!formData.sizeUnit || formData.sizeUnit.trim() === '') {
      newErrors.sizeUnit = t('sizeUnitRequired');
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
    
    // Admin contact information validation
    if (isAdminMode && user?.role === 'admin') {
      // Agent name is required for admin
      if (!formData.agentName || formData.agentName.trim() === '') {
        newErrors.agentName = "Agent name is required";
      }
      
      // Email is optional - only validate format if provided
      if (formData.agentEmail && formData.agentEmail.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.agentEmail)) {
        newErrors.agentEmail = "Please enter a valid email address";
      }
      
      if (!formData.agentNumber || formData.agentNumber.trim() === '') {
        newErrors.agentNumber = "Contact phone is required";
      }
      
      if (!formData.agentWhatsapp || formData.agentWhatsapp.trim() === '') {
        newErrors.agentWhatsapp = "WhatsApp number is required";
      }
    }
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
        bedrooms: (formData.propertyType === "Land" || formData.propertyType === "Commercial" || formData.propertyType === "Office" || formData.propertyType === "Building") ? 0 : parseInt(formData.bedrooms) || 0,
        bathrooms: (formData.propertyType === "Land" || formData.propertyType === "Building") ? 0 : parseInt(formData.bathrooms) || 0,
        size: parseInt(formData.size),
        sizeUnit: formData.sizeUnit && formData.sizeUnit.trim() !== '' ? formData.sizeUnit : 'sqm', // Default to sqm if not selected
        landArea: formData.landArea ? parseInt(formData.landArea) : parseInt(formData.size),
        yearBuilt: formData.yearBuilt && formData.yearBuilt.toString().trim() !== '' ? parseInt(formData.yearBuilt) : null,
        floor: formData.propertyType !== "Building" && formData.floor ? parseInt(formData.floor) : undefined,
        numberOfFloors: formData.propertyType === "Building" && formData.numberOfFloors ? parseInt(formData.numberOfFloors) : undefined,
        garageSize: formData.garages && formData.garageSize ? parseInt(formData.garageSize) : 0,
        approvalStatus: isAdminMode && user?.role === 'admin' ? "approved" : "pending",
        isSold: false,
        isDeleted: false,
        // Auto-embed agent contact info from user profile
        // For admin: use formData values if provided, otherwise use admin defaults
        // For regular users: ALWAYS use their profile info (cannot change)
        agentName: isAdminMode && user?.role === 'admin'
          ? (formData.agentName && formData.agentName.trim() !== '' ? formData.agentName.trim() : null)
          : (user?.agentName || user?.username || ""), // Regular users: use their agentName or username
        agentName_ar: isAdminMode && user?.role === 'admin'
          ? (formData.agentName_ar && formData.agentName_ar.trim() !== '' ? formData.agentName_ar.trim() : null)
          : null, // Only admin can set Arabic name
        agentEmail: isAdminMode && user?.role === 'admin' 
          ? (formData.agentEmail && formData.agentEmail.trim() !== '' ? formData.agentEmail.trim() : null)
          : (user?.email || ""), // Regular users: always use their email
        agentNumber: isAdminMode && user?.role === 'admin'
          ? (formData.agentNumber || user?.phone || "")
          : (user?.phone || ""), // Regular users: always use their phone
        agentWhatsapp: isAdminMode && user?.role === 'admin'
          ? (formData.agentWhatsapp || user?.phone || "")
          : (user?.phone || ""), // Regular users: always use their phone
        agentFacebook: isAdminMode && user?.role === 'admin'
          ? (formData.agentFacebook && formData.agentFacebook.trim() !== '' ? formData.agentFacebook.trim() : null)
          : null, // Only admin can set Facebook URL
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
        rentType: "monthly",
        bedrooms: "",
        bathrooms: "",
        size: "",
        furnished: false,
        garages: false,
        garageSize: "",
        yearBuilt: "",
        floor: "",
        numberOfFloors: "",
        address: "",
        country: "Syria",
        state: "Damascus",
        neighborhood: "Downtown",
        amenities: [],
        propertyId: `PROP_${Date.now()}`,
        notes: "",
        mapLocation: "",
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

  // Translation helper functions for dropdowns
  const translatePropertyType = (type) => {
    try {
      return t(`propertyTypes.${type}`, { defaultValue: type });
    } catch {
      return type;
    }
  };

  const translateStatus = (status) => {
    try {
      return t(`status.${status}`, { defaultValue: status });
    } catch {
      return status;
    }
  };

  const translateRentType = (rentType) => {
    try {
      return t(`rentTypes.${rentType}`, { defaultValue: rentType });
    } catch {
      return rentType;
    }
  };

  const translateProvince = (province) => {
    try {
      return t(`provinces.${province}`, { defaultValue: province });
    } catch {
      return province;
    }
  };

  const translateAmenity = (amenity) => {
    try {
      return t(`amenities.${amenity}`, { defaultValue: amenity });
    } catch {
      return amenity;
    }
  };

  return (
    <div className="main-content w-100">
      <div className="main-content-inner">
        {/* Warning Banner for Blocked/Unverified Agents */}
        {showWarning && (
          <div className={styles.warningBanner}>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={styles.warningBannerIcon}
            >
              <path 
                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span>{t('verificationWarning')}</span>
          </div>
        )}
        <div className="button-show-hide show-mb">
          <span className="body-1">{t('showDashboard')}</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Upload Media Section */}
          <div className="widget-box-2 mb-20">
            <h3 className="title">{t('uploadMedia')}</h3>
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
                  {t('selectPhotos')}
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
                  {t('orDragPhotos')} <br />
                  <span>({t('upTo10Photos')})</span>
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
            <h5 className="title">{t('information')}</h5>
            <div className="box-info-property">
              <fieldset className="box box-fieldset">
                <label htmlFor="propertyKeyword">
                  {t('propertyKeyword')}:
                </label>
                
                {/* Display input showing selected tags (read-only) */}
                <input
                  type="text"
                  name="propertyKeyword"
                  className="form-control"
                  placeholder={t('selectTagsPlaceholder')}
                  value={formData.propertyKeyword}
                  readOnly
                  style={{ cursor: 'not-allowed', backgroundColor: '#f8f9fa' }}
                />
                
                {/* Selected Tags Display */}
                {formData.propertyKeyword && (
                  <div className={styles.selectedTagsContainer} style={{ marginTop: '12px' }}>
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
                
                {errors.propertyKeyword && <span className="text-danger">{errors.propertyKeyword}</span>}
                
                {/* Keyword Tags Suggestions - Only allow selection from these tags */}
                <div className={styles.keywordTagsContainer}>
                  <span className={styles.keywordTagsLabel}>{t('selectTagsLabel')}</span>
                  {keywordTags.map((tag, index) => {
                    const translatedTag = translateKeywordWithT(tag, tCommon);
                    return (
                      <span
                        key={index}
                        className={`${styles.keywordTag} ${isTagSelected(tag) ? styles.keywordTagSelected : ''}`}
                        onClick={() => handleTagClick(tag)}
                        title={`Click to ${isTagSelected(tag) ? 'remove' : 'add'} "${translatedTag}"`}
                      >
                        {translatedTag}
                        <span className={styles.keywordTagIcon}>{isTagSelected(tag) ? '✓' : '+'}</span>
                      </span>
                    );
                  })}
                </div>
              </fieldset>
              
              <fieldset className="box box-fieldset">
                <label htmlFor="propertyDesc">{t('description')}:<span style={{ color: '#dc3545' }}>*</span></label>
                <textarea
                  name="propertyDesc"
                  className="textarea"
                  placeholder={t('describeProperty')}
                  value={formData.propertyDesc}
                  onChange={handleInputChange}
                />
                {errors.propertyDesc && <span className="text-danger">{errors.propertyDesc}</span>}
              </fieldset>
              
              <div className="box grid-layout-3 gap-30">
                <fieldset className="box-fieldset">
                  <label htmlFor="address">
                    {t('fullAddress')}:<span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder={t('enterFullAddress')}
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  {errors.address && <span className="text-danger">{errors.address}</span>}
                </fieldset>
               
                <fieldset className="box-fieldset">
                  <label htmlFor="country">
                    {t('country')}:<span style={{ color: '#dc3545' }}>*</span>
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
                    {t('provinceState')}:<span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <DropdownSelect
                    name="state"
                    options={syrianProvinces}
                    selectedValue={formData.state}
                    onChange={(value) => handleDropdownChange('state', value)}
                    addtionalParentClass=""
                    translateOption={translateProvince}
                  />
                  {errors.state && <span className="text-danger">{errors.state}</span>}
                </fieldset>
                
                <fieldset className="box-fieldset">
                  <label htmlFor="neighborhood">
                    {t('neighborhood')}:<span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="neighborhood"
                    className="form-control"
                    placeholder={t('enterNeighborhood')}
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                  />
                  {errors.neighborhood && <span className="text-danger">{errors.neighborhood}</span>}
                </fieldset>
              </div>
              
              <fieldset className="box-fieldset">
                <label htmlFor="mapLocation">
                  {t('mapLocation') || 'Map Location'} (Google Maps):
                </label>
                <input
                  type="text"
                  name="mapLocation"
                  className="form-control"
                  placeholder={t('enterGoogleMapsLocation') || "Enter Google Maps URL or coordinates (e.g., https://maps.google.com/... or 35.5174,35.7925)"}
                  value={formData.mapLocation}
                  onChange={handleInputChange}
                />
                <small className="text-muted" style={{ fontSize: '12px', display: 'block', marginTop: '5px' }}>
                  {t('locationHint') || "Optional: Paste Google Maps URL or enter coordinates (latitude,longitude)"}
                </small>
                <div style={{ 
                  marginTop: '15px', 
                  padding: '12px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '6px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '13px', color: '#495057' }}>
                    {t('howToGetMapLocation') || 'How to get Google Maps location:'}
                  </div>
                  <ol style={{ 
                    margin: 0, 
                    paddingLeft: '20px', 
                    fontSize: '12px', 
                    color: '#6c757d',
                    lineHeight: '1.8'
                  }}>
                    <li>{t('mapLocationStep1') || '1. Open Google Maps'}</li>
                    <li>{t('mapLocationStep2') || '2. Click on the location'}</li>
                    <li>{t('mapLocationStep3') || '3. Click Share / مشاركة'}</li>
                    <li>{t('mapLocationStep4') || '4. Click Copy link / نسخ الرابط'}</li>
                    <li>{t('mapLocationStep5') || '5. Paste it in the input field above'}</li>
                  </ol>
                </div>
                {errors.mapLocation && <span className="text-danger">{errors.mapLocation}</span>}
              </fieldset>
            </div>
          </div>

          {/* Price Section */}


          {/* Additional Information Section */}
          <div className="widget-box-2 mb-20">
            <h3 className="title">{t('additionalInformation')}</h3>
            <div className="box grid-layout-3 gap-30">
              <fieldset className="box-fieldset">
                <label htmlFor="propertyType">
                  {t('propertyType')}:<span style={{ color: '#dc3545' }}>*</span>
                </label>
                <DropdownSelect
                  name="propertyType"
                  options={getPropertyTypes()}
                  selectedValue={formData.propertyType}
                  onChange={(value) => handleDropdownChange('propertyType', value)}
                  addtionalParentClass=""
                  translateOption={translatePropertyType}
                />
                {errors.propertyType && <span className="text-danger">{errors.propertyType}</span>}
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label htmlFor="status">
                  {t('propertyStatus')}:<span style={{ color: '#dc3545' }}>*</span>
                </label>
                <DropdownSelect
                  name="status"
                  options={["rent", "sale"]}
                  selectedValue={formData.status}
                  onChange={(value) => handleDropdownChange('status', value)}
                  addtionalParentClass=""
                  translateOption={translateStatus}
                />
                {errors.status && <span className="text-danger">{errors.status}</span>}
              </fieldset>
              
              {formData.status === "rent" && (
                <fieldset className="box-fieldset">
                  <label htmlFor="rentType">
                    {t('rentPeriodCharge')}:<span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <DropdownSelect
                    name="rentType"
                    options={
                      // For Villa or Holiday Home + rent: show daily, weekly, monthly, yearly
                      (formData.propertyType === "Villa" || formData.propertyType === "Holiday Home") && formData.status === "rent"
                        ? ["daily", "weekly", "monthly", "yearly"]
                        // For admin: show all options including daily
                        : (isAdmin || isAdminMode) && formData.propertyType === "Holiday Home" && formData.status === "rent"
                        ? ["daily", "weekly", "monthly", "yearly"]
                        : (isAdmin || isAdminMode)
                        ? ["weekly", "monthly", "yearly"]
                        : ["monthly", "yearly"]
                    }
                    selectedValue={formData.rentType}
                    onChange={(value) => handleDropdownChange('rentType', value)}
                    addtionalParentClass=""
                    translateOption={translateRentType}
                  />
                  {errors.rentType && <span className="text-danger">{errors.rentType}</span>}
                </fieldset>
              )}
              
              <fieldset className="box-fieldset">
                <label htmlFor="propertyId">
                  {t('propertyId')}:<span style={{ color: '#dc3545' }}>*</span>
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
                  {t('size')}:<span style={{ color: '#dc3545' }}>*</span>
                </label>
                <label htmlFor="sizeUnit" style={{ fontSize: '12px', marginLeft: '8px', color: '#6c757d', fontWeight: 'normal' }}>
                  ({t('sizeUnits.sqm')} / {t('sizeUnits.dunam')} / {t('sizeUnits.sqft')} / {t('sizeUnits.sqyd')} / {t('sizeUnits.feddan')}) <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                  <input
                    type="number"
                    name="size"
                    className="form-control no-spinner"
                    value={formData.size}
                    onChange={handleInputChange}
                    min="0"
                    style={{ 
                      flex: 1,
                      MozAppearance: 'textfield',
                      WebkitAppearance: 'none',
                      appearance: 'none'
                    }}
                    onWheel={(e) => e.target.blur()}
                  />
                  <select
                    name="sizeUnit"
                    className={`form-control ${errors.sizeUnit ? 'is-invalid' : ''}`}
                    value={formData.sizeUnit || ''}
                    onChange={handleInputChange}
                    required
                    style={{ width: '150px' }}
                  >
                    <option value="">{tCommon('select')}...</option>
                    <option value="sqm">{t('sizeUnits.sqm')}</option>
                    <option value="dunam">{t('sizeUnits.dunam')}</option>
                    <option value="sqft">{t('sizeUnits.sqft')}</option>
                    <option value="sqyd">{t('sizeUnits.sqyd')}</option>
                    <option value="feddan">{t('sizeUnits.feddan')}</option>
                  </select>
                </div>
                {errors.size && <span className="text-danger">{errors.size}</span>}
                {errors.sizeUnit && (
                  <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                    {errors.sizeUnit}
                  </span>
                )}
                <small className="text-muted" style={{ 
                  fontSize: '12px', 
                  display: 'block', 
                  marginTop: '5px',
                  color: '#6c757d',
                  fontStyle: 'italic',
                  padding: '4px 8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  border: '1px solid #e9ecef'
                }}>
                  ⓘ {t('sizeUnitDefaultWarning')}
                </small>
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label htmlFor="yearBuilt">
                  {t('yearBuilt')}:
                </label>
                <input
                  type="number"
                  name="yearBuilt"
                  className="form-control"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder={t('yearBuiltPlaceholder')}
                  style={{ MozAppearance: 'textfield' }}
                  onWheel={(e) => e.target.blur()}
                />
                {errors.yearBuilt && (
                  <span className="text-danger" style={{ display: 'block', marginTop: '5px', fontSize: '14px', fontWeight: '500' }}>
                    {errors.yearBuilt}
                  </span>
                )}
              </fieldset>
              
              {/* Hide floor (unit floor number) when Building - Building uses "How many floors?" instead */}
              {formData.propertyType !== "Building" && (
                <fieldset className="box-fieldset">
                  <label htmlFor="floor">
                    {t('floor')}:
                  </label>
                  <input
                    type="number"
                    name="floor"
                    className="form-control"
                    value={formData.floor}
                    onChange={handleInputChange}
                    min="0"
                    placeholder={t('floorPlaceholder')}
                    style={{ MozAppearance: 'textfield' }}
                    onWheel={(e) => e.target.blur()}
                  />
                </fieldset>
              )}
            </div>
            
            {/* How many floors? - Only for Building */}
            {formData.propertyType === "Building" && (
              <div className="box grid-layout-3 gap-30" style={{ marginBottom: '20px' }}>
                <fieldset className="box-fieldset">
                  <label htmlFor="numberOfFloors">
                    {t('howManyFloors')}:<span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="numberOfFloors"
                    id="numberOfFloors"
                    className="form-control"
                    value={formData.numberOfFloors}
                    onChange={handleInputChange}
                    min="1"
                    placeholder={t('howManyFloorsPlaceholder')}
                    style={{ MozAppearance: 'textfield' }}
                    onWheel={(e) => e.target.blur()}
                  />
                  {errors.numberOfFloors && <span className="text-danger">{errors.numberOfFloors}</span>}
                </fieldset>
              </div>
            )}

            <div className="box grid-layout-3 gap-30">
              {/* Hide bedrooms for Land, Commercial, Office, and Building */}
              {formData.propertyType !== "Land" && formData.propertyType !== "Commercial" && formData.propertyType !== "Office" && formData.propertyType !== "Building" && (
                <fieldset className="box-fieldset">
                  <label htmlFor="bedrooms">
                    {t('bedrooms')}:<span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    className="form-control"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="1"
                    style={{ MozAppearance: 'textfield' }}
                    onWheel={(e) => e.target.blur()}
                  />
                  {errors.bedrooms && <span className="text-danger">{errors.bedrooms}</span>}
                </fieldset>
              )}
              
              {/* Hide bathrooms for Land and Building. For Commercial and Office, bathrooms is optional */}
              {formData.propertyType !== "Land" && formData.propertyType !== "Building" && (
                <fieldset className="box-fieldset">
                  <label htmlFor="bathrooms">
                    {t('bathrooms')}
                    {/* Only show * (required) for residential types, not for Commercial/Office */}
                    {(formData.propertyType !== "Commercial" && formData.propertyType !== "Office") && <span style={{ color: '#dc3545' }}>*</span>}
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    className="form-control"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="0"
                    style={{ MozAppearance: 'textfield' }}
                    onWheel={(e) => e.target.blur()}
                  />
                  {errors.bathrooms && <span className="text-danger">{errors.bathrooms}</span>}
                </fieldset>
              )}
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
                  <span>{t('furnished')}</span>
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
                  <span>{t('hasGarages')}</span>
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
                    {t('garageSizeSqFt')}:
                  </label>
                  <input
                    type="number"
                    name="garageSize"
                    id="garageSize"
                    className="form-control"
                    value={formData.garageSize}
                    style={{ MozAppearance: 'textfield' }}
                    onWheel={(e) => e.target.blur()}
                    onChange={handleInputChange}
                    min="0"
                    placeholder={t('enterGarageSize')}
                  />
                </fieldset>
              </div>
            )}
            
            <fieldset className="box-fieldset" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="notes">
                {t('notes')}:
              </label>
              <textarea
                style={{ fontSize: '18px', lineHeight: '22.4px', fontWeight: '500',color: '#374151' }}
                name="notes"
                id="notes"
                className="form-control"
                rows="4"
                placeholder={t('notesPlaceholder')}
                value={formData.notes}
                onChange={handleInputChange}
              />
            </fieldset>
          </div>
          <div className="widget-box-2 mb-20">
            <h3 className="title">{t('price')}</h3>
            <div className="box-price-property">
              <div className="box grid-2 gap-30">
                <fieldset className="box-fieldset mb-30">
                  <label htmlFor="propertyPrice">
                    {t('price')}:<span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="propertyPrice"
                    className="form-control"
                    placeholder={t('pricePlaceholder')}
                    value={formData.propertyPrice}
                    onChange={handleInputChange}
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                  {errors.propertyPrice && <span className="text-danger">{errors.propertyPrice}</span>}
                </fieldset>
                
                <fieldset className="box-fieldset mb-30">
                  <label htmlFor="currency">
                    {t('currency')}:<span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <small className="d-block text-muted mb-1">{t('currencyAvailable')}</small>
                  <select
                    name="currency"
                    id="currency"
                    className="form-control"
                    value={formData.currency}
                    onChange={handleInputChange}
                  >
                    <option value="USD">USD</option>
                    <option value="SYP">SYP</option>
                  </select>
                  {errors.currency && <span className="text-danger">{errors.currency}</span>}
                </fieldset>
              </div>
            </div>
          </div>

          {/* Contact Information Section (Admin Only) */}
          {isAdminMode && user?.role === 'admin' && (
            <div className="widget-box-2 mb-20">
              <h3 className="title">Contact Information (معلومات الاتصال)</h3>
              <div className="box-info-property">
                <div style={{ 
                  marginBottom: '15px', 
                  padding: '12px', 
                  backgroundColor: '#fff3cd', 
                  borderRadius: '6px',
                  border: '1px solid #ffc107',
                  fontSize: '14px'
                }}>
                  <strong>Note:</strong> By default, admin contact information is used. You can change these fields to display the property owner's contact information instead.
                </div>
                
                <div className="box grid-layout-3 gap-30">
                  <fieldset className="box-fieldset">
                    <label htmlFor="agentName">
                      Agent Name (اسم الوكيل) <span className="text-danger">*</span>:
                    </label>
                    <input
                      type="text"
                      name="agentName"
                      className={`form-control ${errors.agentName ? 'is-invalid' : ''}`}
                      placeholder="Enter agent name"
                      value={formData.agentName || ''}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.agentName && (
                      <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                        {errors.agentName}
                      </span>
                    )}
                    <small className="text-muted" style={{ fontSize: '12px', display: 'block', marginTop: '5px' }}>
                      Required: Name of the agent or property owner
                    </small>
                  </fieldset>

                  <fieldset className="box-fieldset">
                    <label htmlFor="agentName_ar">
                      Agent Name in Arabic (اسم الوكيل بالعربي):
                    </label>
                    <input
                      type="text"
                      name="agentName_ar"
                      className="form-control"
                      placeholder="أدخل اسم الوكيل بالعربي"
                      value={formData.agentName_ar || ''}
                      onChange={handleInputChange}
                    />
                    <small className="text-muted" style={{ fontSize: '12px', display: 'block', marginTop: '5px' }}>
                      Optional: Arabic name of the agent or property owner
                    </small>
                  </fieldset>
                  
                  <fieldset className="box-fieldset">
                    <label htmlFor="agentEmail">
                      Contact Email (البريد الإلكتروني):
                    </label>
                    <input
                      type="email"
                      name="agentEmail"
                      className={`form-control ${errors.agentEmail ? 'is-invalid' : ''}`}
                      placeholder="Enter contact email (optional)"
                      value={formData.agentEmail || ''}
                      onChange={handleInputChange}
                    />
                    {errors.agentEmail && (
                      <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                        {errors.agentEmail}
                      </span>
                    )}
                    <small className="text-muted" style={{ fontSize: '12px', display: 'block', marginTop: '5px' }}>
                      Optional: Leave empty to hide email button. Default: admin@aqaargate.com
                    </small>
                  </fieldset>
                  
                  <fieldset className="box-fieldset">
                    <label htmlFor="agentNumber">
                      Contact Phone (رقم الهاتف):<span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="agentNumber"
                      className={`form-control ${errors.agentNumber ? 'is-invalid' : ''}`}
                      placeholder="Enter contact phone (e.g., +963999999999)"
                      value={formData.agentNumber || ''}
                      onChange={handleInputChange}
                    />
                    {errors.agentNumber && (
                      <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                        {errors.agentNumber}
                      </span>
                    )}
                    <small className="text-muted" style={{ fontSize: '12px', display: 'block', marginTop: '5px' }}>
                      Default: Admin phone number
                    </small>
                  </fieldset>
                  
                  <fieldset className="box-fieldset">
                    <label htmlFor="agentWhatsapp">
                      WhatsApp Number (رقم الواتساب):<span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="agentWhatsapp"
                      className={`form-control ${errors.agentWhatsapp ? 'is-invalid' : ''}`}
                      placeholder="Enter WhatsApp number (e.g., +963999999999)"
                      value={formData.agentWhatsapp || ''}
                      onChange={handleInputChange}
                    />
                    {errors.agentWhatsapp && (
                      <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                        {errors.agentWhatsapp}
                      </span>
                    )}
                    <small className="text-muted" style={{ fontSize: '12px', display: 'block', marginTop: '5px' }}>
                      Default: Admin WhatsApp number
                    </small>
                  </fieldset>
                  
                  <fieldset className="box-fieldset">
                    <label htmlFor="agentFacebook">
                      Facebook URL (رابط فيسبوك):
                    </label>
                    <input
                      type="url"
                      name="agentFacebook"
                      className={`form-control ${errors.agentFacebook ? 'is-invalid' : ''}`}
                      placeholder="Enter Facebook URL (optional, e.g., https://facebook.com/username)"
                      value={formData.agentFacebook || ''}
                      onChange={handleInputChange}
                    />
                    {errors.agentFacebook && (
                      <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                        {errors.agentFacebook}
                      </span>
                    )}
                    <small className="text-muted" style={{ fontSize: '12px', display: 'block', marginTop: '5px' }}>
                      Optional: Facebook profile or page URL. Will be displayed in listing card if provided.
                    </small>
                  </fieldset>
                </div>
              </div>
            </div>
          )}

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
                  Notes (الملاحظات):
                </label>
                <textarea
                  name="notes_ar"
                  className="textarea"
                  placeholder="أدخل أي ملاحظات إضافية بالعربية..."
                  value={formData.notes_ar}
                  onChange={handleInputChange}
                  dir="rtl"
                  rows="4"
                />
              </fieldset>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="widget-box-2 mb-20">
            <h5 className="title">
              {t('amenitiesLabel')}<span>*</span>
            </h5>
            <div className="box-amenities-property">
              <div className="grid grid-cols-2 gap-4">
                {amenityOptions.map((amenity) => (
                  <fieldset key={amenity} className="checkbox-item style-1">
                    <label>
                      <span className="text-4">{translateAmenity(amenity)}</span>
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
              title={isAgentBlocked ? t('accountBlocked') : (!isArabicSectionComplete() ? t('fillArabicFields') : t('addProperty'))}
              onClick={(e) => {
                // Directly call handleSubmit to ensure API call happens
                handleSubmit(e);
              }}
            >
              {isSubmitting ? t('creatingProperty') : t('addProperty')}
            </button>
            {submitAttempted && !isArabicSectionComplete() && (
              <p style={{ 
                marginTop: '10px', 
                color: '#dc3545', 
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'center'
              }}>
                {t('fillArabicFields')}
              </p>
            )}
            
            <button
              type="button"
              className="tf-btn style-border pd-10"
              disabled={isAgentBlocked}
              onClick={() => {
                // Check if agent is blocked
                if (isAgentBlocked) {
                  setToast({ type: "error", message: t('accountBlocked') });
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
              title={isAgentBlocked ? t('accountBlocked') : t('saveAndPreview')}
            >
              {t('saveAndPreview')}
            </button>
          </div>
        </form>

        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}
