"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { userAPI } from "@/apis";
import Toast from "../common/Toast";
import LocationLoader from "../common/LocationLoader";
import DashboardFooter from "../common/DashboardFooter";
import DropdownSelect from "../common/DropdownSelect";
import { syrianProvinces } from "@/constants/provinces";
import { countryCodes, DEFAULT_COUNTRY_CODE, extractCountryCode } from "@/constants/countryCodes";
import logger from "@/utlis/logger";
import styles from "./Profile.module.css";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import { useLocale, useTranslations } from 'next-intl';
import { useSafeTranslations } from '@/hooks/useSafeTranslations';
import ChangePasswordSection from "./ChangePasswordSection";

export default function Profile() {
  const { showLoginModal } = useGlobalModal();
  const locale = useLocale();
  const t = useTranslations('agent.profile');
  const tSafe = useSafeTranslations('agent.profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [arabicErrors, setArabicErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Profile form data
  const [formData, setFormData] = useState({
    username: "",
    username_ar: "",
    email: "",
    description: "",
    description_ar: "",
    company: "",
    company_ar: "",
    position: "",
    position_ar: "",
    officeNumber: "",
    officeAddress: "",
    officeAddress_ar: "",
    job: "",
    job_ar: "",
    phone: "",
    countryCode: DEFAULT_COUNTRY_CODE,
    location: "",
    location_ar: "",
    city: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    whatsapp: "",
    whatsappCountryCode: DEFAULT_COUNTRY_CODE,
    servicesAndExpertise: [],
    responseTime: "",
    availability: "",
    yearsExperience: "",
  });

  // Avatar file state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Services & Expertise options
  const servicesOptions = [
    "Residential Sales",
    "Commercial Real Estate",
    "Property Management",
    "Real Estate Investment",
    "Property Valuation",
    "Rental Services",
    "Land Development",
    "Luxury Properties",
    "Foreclosure Properties",
    "New Construction",
    "Property Consulting",
    "Real Estate Marketing",
  ];

  // Response Time options
  const responseTimeOptions = [
    "Select Response Time",
    "Within 1 hour",
    "Within 2 hours",
    "Within 4 hours",
    "Within 24 hours",
    "Within 2 days",
  ];

  // Availability options
  const availabilityOptions = [
    "Select Availability",
    "Full-time",
    "Part-time",
    "Weekends only",
    "Evenings only",
    "Flexible",
  ];
  // City options (Syrian cities/provinces)
  const cityOptions = [
    "Select City",
    ...syrianProvinces
  ];

  // Translation helper functions
  const translateService = (service) => {
    try {
      return t(`services.${service}`, { defaultValue: service });
    } catch {
      return service;
    }
  };

  const translateResponseTime = (option) => {
    try {
      return t(`responseTimeOptions.${option}`, { defaultValue: option });
    } catch {
      return option;
    }
  };

  const translateAvailability = (option) => {
    try {
      return t(`availabilityOptions.${option}`, { defaultValue: option });
    } catch {
      return option;
    }
  };

  // Province translations mapping
  const provinceTranslations = {
    en: {
      "Aleppo": "Aleppo",
      "As-Suwayda": "As-Suwayda",
      "Damascus": "Damascus",
      "Daraa": "Daraa",
      "Deir ez-Zur": "Deir ez-Zur",
      "Hama": "Hama",
      "Homs": "Homs",
      "Idlib": "Idlib",
      "Latakia": "Latakia",
      "Raqqah": "Raqqah",
      "Tartus": "Tartus"
    },
    ar: {
      "Aleppo": "حلب",
      "As-Suwayda": "السويداء",
      "Damascus": "دمشق",
      "Daraa": "درعا",
      "Deir ez-Zur": "دير الزور",
      "Hama": "حماة",
      "Homs": "حمص",
      "Idlib": "إدلب",
      "Latakia": "اللاذقية",
      "Raqqah": "الرقة",
      "Tartus": "طرطوس"
    }
  };

  const translateProvince = (province) => {
    if (!province || province === "Select City") return province;
    
    // Use direct mapping based on locale
    const translations = provinceTranslations[locale] || provinceTranslations.en;
    return translations[province] || province;
  };




  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          showLoginModal();
          return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Fetch latest profile data
        const profile = await userAPI.getProfile(userData._id);
        
        // Extract country code from phone if it exists
        let phoneNumber = profile.phone || "";
        let countryCode = DEFAULT_COUNTRY_CODE;
        
        // Try to extract country code from phone number
        if (phoneNumber) {
          const extracted = extractCountryCode(phoneNumber);
          if (extracted) {
            countryCode = extracted.countryCode;
            phoneNumber = extracted.phoneNumber;
          }
        }
        
        setFormData({
          username: profile.username || "",
          username_ar: profile.username_ar || "",
          email: profile.email || "",
          description: profile.description || "",
          description_ar: profile.description_ar || "",
          company: profile.company || "",
          company_ar: profile.company_ar || "",
          position: profile.position || "",
          position_ar: profile.position_ar || "",
          officeNumber: profile.officeNumber || "",
          officeAddress: profile.officeAddress || "",
          officeAddress_ar: profile.officeAddress_ar || "",
          job: profile.job || "",
          job_ar: profile.job_ar || "",
          phone: phoneNumber,
          countryCode: profile.countryCode || countryCode,
          location: profile.location || "",
          location_ar: profile.location_ar || "",
          city: profile.city || "",
          facebook: profile.facebook || "",
          twitter: profile.twitter || "",
          linkedin: profile.linkedin || "",
          whatsapp: profile.whatsapp ? (extractCountryCode(profile.whatsapp)?.phoneNumber || profile.whatsapp.replace(/^\+\d+/, '')) : "",
          whatsappCountryCode: profile.whatsapp ? (extractCountryCode(profile.whatsapp)?.countryCode || DEFAULT_COUNTRY_CODE) : DEFAULT_COUNTRY_CODE,
          servicesAndExpertise: profile.servicesAndExpertise || [],
          responseTime: profile.responseTime || "",
          availability: profile.availability || "",
          yearsExperience: profile.yearsExperience || "",
        });
        setUser(profile);
        if (profile.avatar) {
          setAvatarPreview(profile.avatar);
        }
      } catch (error) {
        logger.error("Error loading profile:", error);
        setToast({ type: "error", message: t('errorLoading') });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    
    // Clear error when user starts typing in Arabic fields
    if (id.includes('_ar') && arabicErrors[id]) {
      setArabicErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  // Validate Arabic fields
  const validateArabicFields = () => {
    const errors = {};
    const requiredArabicFields = [
      'username_ar',
      'description_ar',
      'job_ar'
    ];
    
    // Add agent-specific fields if user is agent
    if (user?.role === 'agent') {
      requiredArabicFields.push('company_ar', 'officeAddress_ar');
    }
    
    requiredArabicFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        errors[field] = t('thisFieldIsRequired');
      }
    });
    
    setArabicErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if all Arabic fields are filled
  const isArabicSectionComplete = () => {
    const requiredFields = [
      'username_ar',
      'description_ar',
      'job_ar'
    ];
    
    if (user?.role === 'agent') {
      requiredFields.push('company_ar', 'officeAddress_ar');
    }
    
    return requiredFields.every(field => 
      formData[field] && formData[field].trim() !== ''
    );
  };

  const handleServiceChange = (service, checked) => {
    setFormData(prev => ({
      ...prev,
      servicesAndExpertise: checked 
        ? [...prev.servicesAndExpertise, service]
        : prev.servicesAndExpertise.filter(s => s !== service)
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChanged = (message) => {
    setToast({ type: "success", message });
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    
    // Mark that submit has been attempted
    setSubmitAttempted(true);
    
    // Validate Arabic fields before submitting
    if (!validateArabicFields()) {
      setToast({ type: "error", message: t('fillArabicFields') });
      return;
    }
    
    setSaving(true);

    try {
      // Prepare data with avatar file if selected
      const updateData = { ...formData };
      
      // Combine country code with phone number
      if (updateData.phone && updateData.countryCode) {
        updateData.phone = `${updateData.countryCode}${updateData.phone}`;
      }
      
      // Combine country code with WhatsApp number
      if (updateData.whatsapp && updateData.whatsappCountryCode) {
        updateData.whatsapp = `${updateData.whatsappCountryCode}${updateData.whatsapp}`;
      }
      
      if (avatarFile) {
        updateData.avatar = avatarFile;
      }

      const updatedUser = await userAPI.updateProfile(user._id, updateData);
      
      // Clear avatar file state after successful upload
      if (avatarFile) {
        setAvatarFile(null);
        setAvatarPreview(updatedUser.avatar || null);
      }
      
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setToast({ type: "success", message: t('profileUpdated') });
    } catch (error) {
      logger.error("Error updating profile:", error);
      setToast({ type: "error", message: t('failedToUpdate') });
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <LocationLoader 
          size="large" 
          message={t('loading')}
        />
      </div>
    );
  }

  return (
    <div className="main-content style-2">
      <div className="main-content-inner wrap-dashboard-content-2">
        <div className="button-show-hide show-mb">
          <span className="body-1">{t('showDashboard')}</span>
        </div>
        <div className="widget-box-2">
          {user?.role === "agent" && (
            <div className="box">
              <h3 className="title">{t('accountSettings')}</h3>
              <div className="box-agent-account">
                <h6>{t('agentAccount')}</h6>
                <p className="note">
                  {t('agentAccountDescription')}
                </p>
                <div className={styles.pointsBalance}>
                  <strong>{t('pointsBalance')}:</strong> {user.pointsBalance || t('unlimited')} {t('points')}
                </div>
              </div>
            </div>
          )}
          
          <div className="box">
            <h5 className="title">{t('avatar')}</h5>
            <div className="box-agent-avt">
              <div className="avatar">
                <Image
                  alt={user?.fullName || "User avatar"}
                  loading="lazy"
                  width={128}
                  height={128}
                  src={avatarPreview || user?.avatar || "/images/avatar/account.jpg"}
                />
              </div>
              <div className="content uploadfile">
                <p>{t('uploadNewAvatar')}</p>
                <div className="box-ip">
                  <input 
                    type="file" 
                    className="ip-file" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
                <p>{t('avatarFormat')}</p>
              </div>
            </div>
          </div>

          <h5 className="title">{t('information')}</h5>
          <form onSubmit={handleSubmitProfile}>
            <fieldset className="box box-fieldset">
              <label htmlFor="username">
                {t('fullName')}:<span>*</span>
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-control"
              />
            </fieldset>
            
            <div className="box grid-layout-2 gap-30">
              <fieldset className="box-fieldset">
                <label htmlFor="email">
                  {t('emailAddress')}:<span>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  disabled={!!formData.email}
                  style={formData.email ? { 
                    backgroundColor: '#f5f5f5', 
                    cursor: 'not-allowed',
                    opacity: 0.7
                  } : {}}
                />
                {formData.email && (
                  <p className={styles.emailHelperText}>
                    {t('emailCannotBeChanged')}
                  </p>
                )}
              </fieldset>
              <fieldset className="box-fieldset">
                <label htmlFor="phone">
                  {t('yourPhone')}:
                </label>
                <div className={styles.phoneInputContainer}>
                  <select
                    id="countryCode"
                    value={formData.countryCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                    disabled={!!formData.phone}
                    className={styles.countryCodeSelect}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.phoneInput}
                    placeholder={t('phoneNumber')}
                    disabled={!!formData.phone}
                    autoComplete="off"
                  />
                </div>
                {formData.phone && (
                  <p className={styles.phoneHelperText}>
                    {t('phoneCannotBeChanged')}
                  </p>
                )}
              </fieldset>
            </div>

            <fieldset className="box box-fieldset">
              <label htmlFor="description">
                {t('description')}:
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </fieldset>

            {user?.role === "agent" && (
              <fieldset className="box grid-layout-3 gap-30">
                <div className="box-fieldset">
                  <label htmlFor="company">
                    {t('companyName')}:
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="box-fieldset">
                  <label htmlFor="officeNumber">
                    {t('officeNumber')}:
                  </label>
                  <input
                    type="text"
                    id="officeNumber"
                    value={formData.officeNumber}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="box-fieldset">
                  <label htmlFor="officeAddress">
                    {t('officeAddress')}:
                  </label>
                  <input
                    type="text"
                    id="officeAddress"
                    value={formData.officeAddress}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </fieldset>
            )}

            <div className="box grid-layout-2 gap-30 box-info-2">
              <div className="box-fieldset">
                <label htmlFor="job">
                  {t('jobTitle')}:
                </label>
                <input
                  type="text"
                  id="job"
                  value={formData.job}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="box-fieldset">
                <label htmlFor="city">
                  {t('city')}:
                </label>
                <DropdownSelect
                  name="city"
                  options={cityOptions}
                  selectedValue={formData.city}
                  onChange={(value) => setFormData(prev => ({ ...prev, city: value === t('selectCity') ? "" : value }))}
                  addtionalParentClass=""
                  translateOption={(option) => {
                    if (option === "Select City") return t('selectCity');
                    return translateProvince(option);
                  }}
                />
              </div>
            </div>

            



            {/* Services & Expertise - Checkboxes */}
            <fieldset className="box box-fieldset" style={{ width: '100%' }}>
              <label htmlFor="servicesAndExpertise" style={{ display: 'block', marginBottom: '16px' }}>
                {t('servicesAndExpertise')}:
              </label>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', rowGap: '16px', width: '100%', paddingTop: '24px', paddingBottom: '24px', paddingLeft: '20px', paddingRight: '20px', borderRadius: '12px', border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                  {servicesOptions.map((service) => (
                    <fieldset key={service} className="checkbox-item style-1" style={{ flex: '0 0 calc(20% - 16px)', marginBottom: '0', width: 'auto' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.servicesAndExpertise.includes(service)}
                          onChange={(e) => handleServiceChange(service, e.target.checked)}
                          style={{ 
                            margin: '0', 
                            cursor: 'pointer',
                            width: '20px',
                            height: '20px',
                            accentColor: '#667eea',
                            border: '2px solid #000000',
                            borderRadius: '4px',
                            flexShrink: '0',
                            appearance: 'auto',
                            WebkitAppearance: 'checkbox',
                            MozAppearance: 'checkbox'
                          }}
                        />
                        <span className="text-4" style={{ margin: '0' }}>{translateService(service)}</span>
                        <span className="btn-checkbox" />
                      </label>
                    </fieldset>
                  ))}
                </div>
              </div>
            </fieldset>

            {/* Response Time, Availability, Years Experience */}
            <div className="box grid-layout-3 gap-30 box-info-2">
              <div className="box-fieldset">
                <label htmlFor="responseTime">
                  {t('responseTime')}:
                </label>
                <DropdownSelect
                  name="responseTime"
                  options={responseTimeOptions}
                  selectedValue={formData.responseTime}
                  onChange={(value) => setFormData(prev => ({ ...prev, responseTime: value === t('selectResponseTime') ? "" : value }))}
                  addtionalParentClass=""
                  translateOption={translateResponseTime}
                />
              </div>
              <div className="box-fieldset">
                <label htmlFor="availability">
                  {t('availability')}:
                </label>
                <DropdownSelect
                  name="availability"
                  options={availabilityOptions}
                  selectedValue={formData.availability}
                  onChange={(value) => setFormData(prev => ({ ...prev, availability: value === t('selectAvailability') ? "" : value }))}
                  addtionalParentClass=""
                  translateOption={translateAvailability}
                />
              </div>
              <div className="box-fieldset">
                <label htmlFor="yearsExperience">
                  {t('yearsExperience')}:
                </label>
                <input
                  type="number"
                  id="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                  className="form-control"
                  min="0"
                  max="50"
                  placeholder={t('yearsExperiencePlaceholder')}
                />
              </div>
            </div>

<div className="box box-fieldset">
              <label htmlFor="facebook">
                {t('facebook')}:
              </label>
              <input
                type="text"
                id="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="box box-fieldset">
              <label htmlFor="twitter">
                {t('twitter')}:
              </label>
              <input
                type="text"
                id="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="box box-fieldset">
              <label htmlFor="linkedin">
                {t('linkedin')}:
              </label>
              <input
                type="text"
                id="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <fieldset className="box-fieldset">
              <label htmlFor="whatsapp">
                {t('whatsappNumber')}:
              </label>
              <div className={styles.phoneInputContainer}>
                <select
                  id="whatsappCountryCode"
                  value={formData.whatsappCountryCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsappCountryCode: e.target.value }))}
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
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className={styles.phoneInput}
                  placeholder={t('whatsappPlaceholder')}
                  autoComplete="off"
                />
              </div>
            </fieldset>

            {/* Arabic Translation Section */}
            <div className="widget-box-2 mb-20" style={{ marginTop: '32px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h5 className="title">Arabic Translation (الترجمة العربية) <span style={{ color: '#dc3545' }}>*</span></h5>
              
              <fieldset className="box box-fieldset">
                <label htmlFor="username_ar">
                  Full name (الاسم الكامل):<span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  id="username_ar"
                  value={formData.username_ar}
                  onChange={handleInputChange}
                  className={`form-control ${arabicErrors.username_ar ? 'is-invalid' : ''}`}
                  dir="rtl"
                  placeholder="أدخل الاسم الكامل بالعربية"
                  required
                />
                {arabicErrors.username_ar && (
                  <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                    {arabicErrors.username_ar}
                  </span>
                )}
              </fieldset>

              <fieldset className="box box-fieldset">
                <label htmlFor="description_ar">
                  Description (الوصف):<span style={{ color: '#dc3545' }}>*</span>
                </label>
                <textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={handleInputChange}
                  rows={4}
                  dir="rtl"
                  placeholder="أدخل الوصف بالعربية"
                  className={arabicErrors.description_ar ? 'is-invalid' : ''}
                  required
                />
                {arabicErrors.description_ar && (
                  <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                    {arabicErrors.description_ar}
                  </span>
                )}
              </fieldset>

              {user?.role === "agent" && (
                <>
                  <fieldset className="box box-fieldset">
                    <label htmlFor="company_ar">
                      Company Name (اسم الشركة):<span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="company_ar"
                      value={formData.company_ar}
                      onChange={handleInputChange}
                      className={`form-control ${arabicErrors.company_ar ? 'is-invalid' : ''}`}
                      dir="rtl"
                      placeholder="أدخل اسم الشركة بالعربية"
                      required
                    />
                    {arabicErrors.company_ar && (
                      <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                        {arabicErrors.company_ar}
                      </span>
                    )}
                  </fieldset>

                  <fieldset className="box box-fieldset">
                    <label htmlFor="officeAddress_ar">
                      Office Address (عنوان المكتب):<span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="officeAddress_ar"
                      value={formData.officeAddress_ar}
                      onChange={handleInputChange}
                      className={`form-control ${arabicErrors.officeAddress_ar ? 'is-invalid' : ''}`}
                      dir="rtl"
                      placeholder="أدخل عنوان المكتب بالعربية"
                      required
                    />
                    {arabicErrors.officeAddress_ar && (
                      <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                        {arabicErrors.officeAddress_ar}
                      </span>
                    )}
                  </fieldset>
                </>
              )}

              <fieldset className="box box-fieldset">
                <label htmlFor="job_ar">
                  Job Title (مسمى الوظيفة):<span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  id="job_ar"
                  value={formData.job_ar}
                  onChange={handleInputChange}
                  className={`form-control ${arabicErrors.job_ar ? 'is-invalid' : ''}`}
                  dir="rtl"
                  placeholder="أدخل مسمى الوظيفة بالعربية"
                  required
                />
                {arabicErrors.job_ar && (
                  <span className="text-danger" style={{ fontSize: '14px', display: 'block', marginTop: '5px' }}>
                    {arabicErrors.job_ar}
                  </span>
                )}
              </fieldset>
            </div>

            <div className="box" style={{ marginTop: '32px' }}>
              <button 
                type="submit"
                className="tf-btn bg-color-primary pd-10"
                disabled={saving || !isArabicSectionComplete()}
                style={!isArabicSectionComplete() ? { 
                  opacity: 0.6, 
                  cursor: 'not-allowed' 
                } : {}}
                title={!isArabicSectionComplete() ? t('fillArabicFields') : ""}
              >
                {saving ? t('saving') : t('saveAndUpdate')}
              </button>
              {submitAttempted && !isArabicSectionComplete() && (
                <p style={{ 
                  marginTop: '10px', 
                  color: '#dc3545', 
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {t('fillArabicFieldsToSave')}
                </p>
              )}
            </div>
          </form>

       
        </div>
          <ChangePasswordSection userId={user?._id} onPasswordChanged={handlePasswordChanged} />
        <DashboardFooter />
      </div>
      <div className="overlay-dashboard" />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
