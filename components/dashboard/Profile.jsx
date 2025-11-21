"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { userAPI } from "@/apis";
import Toast from "../common/Toast";
import LocationLoader from "../common/LocationLoader";
import DropdownSelect from "../common/DropdownSelect";
import { syrianProvinces } from "@/constants/provinces";
import { countryCodes, DEFAULT_COUNTRY_CODE, extractCountryCode } from "@/constants/countryCodes";
import logger from "@/utlis/logger";
import styles from "./Profile.module.css";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";

export default function Profile() {
  const { showLoginModal } = useGlobalModal();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Profile form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    description: "",
    company: "",
    position: "",
    officeNumber: "",
    officeAddress: "",
    job: "",
    phone: "",
    countryCode: DEFAULT_COUNTRY_CODE,
    location: "",
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



  // Password form data
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
          email: profile.email || "",
          description: profile.description || "",
          company: profile.company || "",
          position: profile.position || "",
          officeNumber: profile.officeNumber || "",
          officeAddress: profile.officeAddress || "",
          job: profile.job || "",
          phone: phoneNumber,
          countryCode: profile.countryCode || countryCode,
          location: profile.location || "",
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
        setToast({ type: "error", message: "Failed to load profile" });
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

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
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
      
      setToast({ type: "success", message: "Profile updated successfully!" });
    } catch (error) {
      logger.error("Error updating profile:", error);
      setToast({ type: "error", message: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ type: "error", message: "Passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setToast({ type: "error", message: "Password must be at least 6 characters" });
      return;
    }

    setSaving(true);

    try {
      await userAPI.changePassword(
        user._id,
        passwordData.oldPassword,
        passwordData.newPassword
      );
      
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      setToast({ type: "success", message: "Password changed successfully!" });
    } catch (error) {
      logger.error("Error changing password:", error);
      setToast({ type: "error", message: "Failed to change password" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <LocationLoader 
          size="large" 
          message="Loading your profile..."
        />
      </div>
    );
  }

  return (
    <div className="main-content style-2">
      <div className="main-content-inner wrap-dashboard-content-2">
        <div className="button-show-hide show-mb">
          <span className="body-1">Show Dashboard</span>
        </div>
        <div className="widget-box-2">
          {user?.role === "agent" && (
            <div className="box">
              <h3 className="title">Account Settings</h3>
              <div className="box-agent-account">
                <h6>Agent Account</h6>
                <p className="note">
                  Your current account type is set to agent. You have access to all agent features
                  including property management and analytics.
                </p>
                <div className={styles.pointsBalance}>
                  <strong>Points Balance:</strong> {user.pointsBalance || 'unlimited'} points
                </div>
              </div>
            </div>
          )}
          
          <div className="box">
            <h5 className="title">Avatar</h5>
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
                <p>Upload a new avatar</p>
                <div className="box-ip">
                  <input 
                    type="file" 
                    className="ip-file" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
                <p>JPEG, PNG, or WEBP (Max 5MB)</p>
              </div>
            </div>
          </div>

          <h5 className="title">Information</h5>
          <form onSubmit={handleSubmitProfile}>
            <fieldset className="box box-fieldset">
              <label htmlFor="username">
                Full name:<span>*</span>
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
                  Email address:<span>*</span>
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
                    Email cannot be changed once set
                  </p>
                )}
              </fieldset>
              <fieldset className="box-fieldset">
                <label htmlFor="phone">
                  Your Phone:
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
                    placeholder="Phone number"
                    disabled={!!formData.phone}
                    autoComplete="off"
                  />
                </div>
                {formData.phone && (
                  <p className={styles.phoneHelperText}>
                    Phone number cannot be changed once set
                  </p>
                )}
              </fieldset>
            </div>

            <fieldset className="box box-fieldset">
              <label htmlFor="description">
                Description:
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </fieldset>

            {user?.role === "agent" && (
              <fieldset className="box grid-layout-4 gap-30">
                <div className="box-fieldset">
                  <label htmlFor="company">
                    Your Company:
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
                  <label htmlFor="position">
                    Position:
                  </label>
                  <input
                    type="text"
                    id="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="box-fieldset">
                  <label htmlFor="officeNumber">
                    Office Number:
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
                    Office Address:
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

            <div className="box grid-layout-3 gap-30 box-info-2">
              <div className="box-fieldset">
                <label htmlFor="job">
                  Job:
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
                <label htmlFor="location">
                  Location:
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="box-fieldset">
                <label htmlFor="city">
                  City:
                </label>
                <DropdownSelect
                  name="city"
                  options={cityOptions}
                  selectedValue={formData.city}
                  onChange={(value) => setFormData(prev => ({ ...prev, city: value === "Select City" ? "" : value }))}
                  addtionalParentClass=""
                />
              </div>
            </div>

            



            {/* Services & Expertise - Checkboxes */}
            <fieldset className="box box-fieldset" style={{ width: '100%' }}>
              <label htmlFor="servicesAndExpertise" style={{ display: 'block', marginBottom: '16px' }}>
                Services & Expertise:
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
                        <span className="text-4" style={{ margin: '0' }}>{service}</span>
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
                  Response Time:
                </label>
                <DropdownSelect
                  name="responseTime"
                  options={responseTimeOptions}
                  selectedValue={formData.responseTime}
                  onChange={(value) => setFormData(prev => ({ ...prev, responseTime: value === "Select Response Time" ? "" : value }))}
                  addtionalParentClass=""
                />
              </div>
              <div className="box-fieldset">
                <label htmlFor="availability">
                  Availability:
                </label>
                <DropdownSelect
                  name="availability"
                  options={availabilityOptions}
                  selectedValue={formData.availability}
                  onChange={(value) => setFormData(prev => ({ ...prev, availability: value === "Select Availability" ? "" : value }))}
                  addtionalParentClass=""
                />
              </div>
              <div className="box-fieldset">
                <label htmlFor="yearsExperience">
                  Years Experience:
                </label>
                <input
                  type="number"
                  id="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                  className="form-control"
                  min="0"
                  max="50"
                  placeholder="e.g. 5"
                />
              </div>
            </div>

<div className="box box-fieldset">
              <label htmlFor="facebook">
                Facebook:
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
                Twitter:
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
                Linkedin:
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
                WhatsApp Number:
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
                  placeholder="WhatsApp number"
                  autoComplete="off"
                />
              </div>
            </fieldset>

            

            <div className="box" style={{ marginTop: '32px' }}>
              <button 
                type="submit"
                className="tf-btn bg-color-primary pd-10"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save & Update"}
              </button>
            </div>
          </form>

          <h5 className="title" style={{ marginTop: '32px' }}>Change password</h5>
          <form onSubmit={handleSubmitPassword}>
            <div className="box grid-layout-3 gap-30">
              <div className="box-fieldset">
                <label htmlFor="oldPassword">
                  Old Password:<span>*</span>
                </label>
                <div className="box-password">
                  <input
                    type="password"
                    id="oldPassword"
                    className="form-contact password-field"
                    placeholder="Old Password"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <div className="box-fieldset">
                <label htmlFor="newPassword">
                  New Password:<span>*</span>
                </label>
                <div className="box-password">
                  <input
                    type="password"
                    id="newPassword"
                    className="form-contact password-field2"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div className="box-fieldset mb-30">
                <label htmlFor="confirmPassword">
                  Confirm Password:<span>*</span>
                </label>
                <div className="box-password">
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-contact password-field3"
                    placeholder="Confirm Password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <div className="box">
              <button 
                type="submit" 
                className="tf-btn bg-color-primary pd-20"
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
        
        <div className="footer-dashboard">
          <p>Copyright © {new Date().getFullYear()} Popty</p>
          <ul className="list">
            <li>
              <a href="#">Privacy</a>
            </li>
            <li>
              <a href="#">Terms</a>
            </li>
            <li>
              <a href="#">Support</a>
            </li>
          </ul>
        </div>
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
