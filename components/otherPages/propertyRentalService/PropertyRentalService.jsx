"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./PropertyRentalService.module.css";
import { propertyRentalAPI } from "@/apis";

export default function PropertyRentalService() {
  const [formData, setFormData] = useState({
    propertyType: "",
    propertySize: "",
    bedrooms: "",
    bathrooms: "",
    features: "",
    location: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    additionalDetails: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await propertyRentalAPI.createPropertyRentalRequest({
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone,
        propertyType: formData.propertyType,
        propertySize: parseInt(formData.propertySize),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        location: formData.location,
        features: formData.features,
        additionalDetails: formData.additionalDetails || '',
      });

      if (response.success) {
        setSubmitMessage(response.message || "Thank you! Your property rental service request has been submitted successfully. Our team will contact you shortly to schedule a property inspection.");
        setFormData({
          propertyType: "",
          propertySize: "",
          bedrooms: "",
          bathrooms: "",
          features: "",
          location: "",
          ownerName: "",
          ownerEmail: "",
          ownerPhone: "",
          additionalDetails: ""
        });
      } else {
        setSubmitMessage("There was an error submitting your request. Please try again or contact us directly.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error?.message || error?.error || "There was an error submitting your request. Please try again or contact us directly.";
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>


      <section className="section-property-rental-service tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              {/* Hero Section */}
              <div className={`heading-section text-center mb-60 ${styles.heroSection}`}>
                <div className={styles.heroIconWrapper}>
                  <i className="icon-home" />
                </div>
                <h1 className={`title split-text effect-right ${styles.heroTitle}`}>
                  Property Rental Management Service
                </h1>
                <p className={`text-1 split-text split-lines-transform ${styles.heroSubtitle}`}>
                  Let AqaarGate handle your property rental needs with our comprehensive, professional management service
                </p>
              </div>

              {/* Service Overview */}
              <div className="service-overview mb-60">
                <div className="row">
                  <div className="col-lg-6 col-md-12 mb-30">
                    <div className={styles.serviceCard}>
                      <div className={`${styles.serviceIcon} ${styles.serviceIconOrange}`}>
                        <i className="icon-home" />
                      </div>
                      <h3 className={styles.serviceCardTitle}>
                        <i className="icon-home" /> Full-Service Property Management
                      </h3>
                      <p className={styles.serviceCardText}>
                        Our specialized maintenance team ensures your property remains in excellent condition throughout the rental period. We guarantee to maintain the property in the same condition as when we received it.
                      </p>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-12 mb-30">
                    <div className={styles.serviceCard}>
                      <div className={`${styles.serviceIcon} ${styles.serviceIconGreen}`}>
                        <svg width="75" height="75" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M83.7369 288.444C80.6561 259.715 80.1284 230.813 80.1284 201.89C80.1284 181.285 71.8196 116.625 78.7768 99.3229C79.9498 96.4035 96.6129 94.5956 98.6911 94.9388C111.692 97.0949 201.295 89.4578 209.969 92.9101C215.486 95.1026 221.59 105.823 226.201 109.95C263.285 143.152 250.998 128.911 250.998 183.502" stroke="white" strokeOpacity="0.9" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M248.47 271.071C245.796 276.081 253.619 303.435 248.47 305.96C243.147 308.568 105.302 309.164 92.0859 307.725" stroke="white" strokeOpacity="0.9" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M209.698 101.354C217.998 112.241 202.962 126.528 204.859 135.991C205.025 136.812 239.235 132.624 243.567 133.8" stroke="white" strokeOpacity="0.9" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M114.875 137.008C126.219 137.842 137.244 132.895 148.388 133.893" stroke="white" strokeOpacity="0.9" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M112.195 174.004C135.077 175.684 160.792 169.855 181.903 171.779" stroke="white" strokeOpacity="0.9" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M117.555 206.926C120.532 205.792 123.308 199.76 126.94 200.275C150.41 203.605 159.345 207.493 184.581 204.71" stroke="white" strokeOpacity="0.9" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M117.555 242.192C133.916 243.182 136.025 236.872 157.771 241.302" stroke="white" strokeOpacity="0.9" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M235.656 227.352C248.017 211.693 272.226 178.413 284.956 162.912C296.461 148.902 295.801 135.225 316.285 148.828C332.535 159.622 316.949 170.237 307.48 183.104C305.858 185.306 260.957 245.463 259.98 245.302C251.825 243.948 242.427 227.833 233.675 230.014C232.292 230.358 222.373 262.4 221.817 265.159C219.947 274.467 248.921 251.813 256.699 248.71" stroke="white" strokeOpacity="0.9" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
                          <path opacity="0.502093" d="M219.436 270.196C218.823 237.421 198.241 279.401 190.363 280.408C185.311 281.052 186.408 263.032 178.096 260.908C170.513 258.973 168.995 272.75 162.647 274.372C156.97 275.823 146.425 272.395 137.664 274.836" stroke="white" strokeOpacity="0.9" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className={styles.serviceCardTitle}>
                        <svg width="24" height="24" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', flexShrink: 0 }}>
                          <path d="M83.7369 288.444C80.6561 259.715 80.1284 230.813 80.1284 201.89C80.1284 181.285 71.8196 116.625 78.7768 99.3229C79.9498 96.4035 96.6129 94.5956 98.6911 94.9388C111.692 97.0949 201.295 89.4578 209.969 92.9101C215.486 95.1026 221.59 105.823 226.201 109.95C263.285 143.152 250.998 128.911 250.998 183.502" stroke="currentColor" strokeOpacity="0.9" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M248.47 271.071C245.796 276.081 253.619 303.435 248.47 305.96C243.147 308.568 105.302 309.164 92.0859 307.725" stroke="currentColor" strokeOpacity="0.9" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M209.698 101.354C217.998 112.241 202.962 126.528 204.859 135.991C205.025 136.812 239.235 132.624 243.567 133.8" stroke="currentColor" strokeOpacity="0.9" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M114.875 137.008C126.219 137.842 137.244 132.895 148.388 133.893" stroke="currentColor" strokeOpacity="0.9" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M112.195 174.004C135.077 175.684 160.792 169.855 181.903 171.779" stroke="currentColor" strokeOpacity="0.9" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M117.555 206.926C120.532 205.792 123.308 199.76 126.94 200.275C150.41 203.605 159.345 207.493 184.581 204.71" stroke="currentColor" strokeOpacity="0.9" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M117.555 242.192C133.916 243.182 136.025 236.872 157.771 241.302" stroke="currentColor" strokeOpacity="0.9" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M235.656 227.352C248.017 211.693 272.226 178.413 284.956 162.912C296.461 148.902 295.801 135.225 316.285 148.828C332.535 159.622 316.949 170.237 307.48 183.104C305.858 185.306 260.957 245.463 259.98 245.302C251.825 243.948 242.427 227.833 233.675 230.014C232.292 230.358 222.373 262.4 221.817 265.159C219.947 274.467 248.921 251.813 256.699 248.71" stroke="currentColor" strokeOpacity="0.9" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
                          <path opacity="0.502093" d="M219.436 270.196C218.823 237.421 198.241 279.401 190.363 280.408C185.311 281.052 186.408 263.032 178.096 260.908C170.513 258.973 168.995 272.75 162.647 274.372C156.97 275.823 146.425 272.395 137.664 274.836" stroke="currentColor" strokeOpacity="0.9" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Formal Rental Agreement
                      </h3>
                      <p className={styles.serviceCardText}>
                        We operate under a formal agreement between AqaarGate and the property owner. Both parties agree on rental duration and rental price, ensuring transparency and mutual understanding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="service-details mb-60">
                <div className="row">
                  <div className="col-lg-8 col-md-12 mx-auto">
                    <div className={styles.detailsBox}>
                      <h2 className={styles.detailsBoxTitle}>
                        How It Works
                      </h2>
                      
                      <div className={styles.stepsList}>
                        <div className={styles.stepItem}>
                          <div className={styles.stepNumber}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 13H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 17H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M10 9H9H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className={styles.stepContent}>
                            <h4 className={styles.stepContentTitle}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', flexShrink: 0 }}>
                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#f1913d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 2V8H20" stroke="#f1913d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16 13H8" stroke="#f1913d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16 17H8" stroke="#f1913d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 9H9H8" stroke="#f1913d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Submit Your Property Details
                            </h4>
                            <p className={styles.stepContentText}>
                              Fill out our comprehensive property submission form with all relevant details including property type, size, bedrooms, bathrooms, features, and location.
                            </p>
                          </div>
                        </div>

                        <div className={styles.stepItem}>
                          <div className={styles.stepNumber}>
                            <i className="icon-location" />
                          </div>
                          <div className={styles.stepContent}>
                            <h4 className={styles.stepContentTitle}>
                              <i className="icon-location" /> Property Inspection
                            </h4>
                            <p className={styles.stepContentText}>
                              Our professional team will visit your property to conduct a thorough inspection and assessment.
                            </p>
                          </div>
                        </div>

                        <div className={styles.stepItem}>
                          <div className={styles.stepNumber}>
                            <i className="icon-shield" />
                          </div>
                          <div className={styles.stepContent}>
                            <h4 className={styles.stepContentTitle}>
                              <i className="icon-shield" /> Agreement Finalization
                            </h4>
                            <p className={styles.stepContentText}>
                              After inspection, we'll finalize the rental agreement, including rental duration, rental price, and commission terms (minimum 25% commission).
                            </p>
                          </div>
                        </div>

                        <div className={styles.stepItem}>
                          <div className={styles.stepNumber}>
                            <i className="icon-home" />
                          </div>
                          <div className={styles.stepContent}>
                            <h4 className={styles.stepContentTitle}>
                              <i className="icon-home" /> Property Management Begins
                            </h4>
                            <p className={styles.stepContentText}>
                              Once the agreement is signed, we take over property management, maintenance, and rental operations, ensuring your property is well-maintained and generating income.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission & Terms */}
              <div className={`commission-section ${styles.commissionSection}`}>
                <div className="row">
                  <div className="col-lg-10 col-md-12 mx-auto">
                    <div className={styles.commissionBox}>
                      <h3 className={styles.commissionTitle}>
                        Commission Structure
                      </h3>
                      <p className={styles.commissionText}>
                        Our company charges a minimum commission of <strong className={styles.commissionHighlight}>25%</strong> of the rental amount. Additional terms and details can be negotiated between both parties to ensure a mutually beneficial agreement.
                      </p>
                      <div className={styles.highlightBox}>
                        <p className={styles.highlightBoxText}>
                          <strong>Agreement Terms Include:</strong> Rental duration, rental price, commission percentage, maintenance responsibilities, and any additional negotiated terms.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Submission Form */}
              <div className="form-section">
                <div className="row">
                  <div className="col-lg-8 col-md-12 mx-auto">
                    <div className={styles.formContainer}>
                      <h2 className={styles.formTitle}>
                        Submit Your Property
                      </h2>
                      <p className={styles.formSubtitle}>
                        Fill out the form below to get started with our property rental management service
                      </p>

                      {submitMessage && (
                        <div className={`${styles.alert} ${submitMessage.includes('successfully') ? styles.alertSuccess : styles.alertDanger}`}>
                          {submitMessage}
                        </div>
                      )}

                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          {/* Owner Information */}
                          <div className="col-md-6 mb-20">
                            <fieldset>
                              <label htmlFor="ownerName" className={styles.formLabel}>
                                <i className="icon-agent" /> Owner Name <span className={styles.requiredStar}>*</span>
                              </label>
                              <div className={styles.inputWrapper}>
                                <input
                                  type="text"
                                  id="ownerName"
                                  name="ownerName"
                                  className={`tf-input style-2 ${styles.formInput}`}
                                  placeholder="Your full name"
                                  value={formData.ownerName}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </fieldset>
                          </div>

                          <div className="col-md-6 mb-20">
                            <fieldset>
                              <label htmlFor="ownerEmail" className={styles.formLabel}>
                                <i className="icon-mail" /> Email Address <span className={styles.requiredStar}>*</span>
                              </label>
                              <div className={styles.inputWrapper}>
                                <input
                                  type="email"
                                  id="ownerEmail"
                                  name="ownerEmail"
                                  className={`tf-input style-2 ${styles.formInput}`}
                                  placeholder="your.email@example.com"
                                  value={formData.ownerEmail}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </fieldset>
                          </div>

                          <div className="col-md-6 mb-20">
                            <fieldset>
                              <label htmlFor="ownerPhone" className={styles.formLabel}>
                                <i className="icon-phone-1" /> Phone Number <span className={styles.requiredStar}>*</span>
                              </label>
                              <div className={styles.inputWrapper}>
                                <input
                                  type="tel"
                                  id="ownerPhone"
                                  name="ownerPhone"
                                  className={`tf-input style-2 ${styles.formInput}`}
                                  placeholder="+963 999 123 456"
                                  value={formData.ownerPhone}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </fieldset>
                          </div>

                          {/* Property Details */}
                          <div className="col-md-6 mb-20">
                            <fieldset>
                              <label htmlFor="propertyType" className={styles.formLabel}>
                                <i className="icon-home" /> Property Type <span className={styles.requiredStar}>*</span>
                              </label>
                              <div className={styles.inputWrapper}>
                                <select
                                  id="propertyType"
                                  name="propertyType"
                                  className={`tf-input style-2 ${styles.formInput} ${styles.formSelect}`}
                                  value={formData.propertyType}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Select property type</option>
                                  <option value="apartment">Apartment</option>
                                  <option value="villa">Villa</option>
                                  <option value="house">House</option>
                                  <option value="land">Land</option>
                                  <option value="commercial">Commercial</option>
                                  <option value="office">Office</option>
                                  <option value="shop">Shop</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                            </fieldset>
                          </div>

                          <div className="col-md-6 mb-20">
                            <fieldset>
                              <label htmlFor="propertySize" className={styles.formLabel}>
                                <i className="icon-compare" /> Property Size (Sqft) <span className={styles.requiredStar}>*</span>
                              </label>
                              <div className={styles.inputWrapper}>
                                <input
                                  type="number"
                                  id="propertySize"
                                  name="propertySize"
                                  className={`tf-input style-2 ${styles.formInput}`}
                                  placeholder="e.g., 1200"
                                  value={formData.propertySize}
                                  onChange={handleInputChange}
                                  required
                                  min="1"
                                />
                              </div>
                            </fieldset>
                          </div>

                          <div className="col-md-6 mb-20">
                            <fieldset>
                              <label htmlFor="bedrooms" className={styles.formLabel}>
                                <i className="icon-bed" /> Number of Bedrooms <span className={styles.requiredStar}>*</span>
                              </label>
                              <div className={styles.inputWrapper}>
                                <input
                                  type="number"
                                  id="bedrooms"
                                  name="bedrooms"
                                  className={`tf-input style-2 ${styles.formInput}`}
                                  placeholder="e.g., 3"
                                  value={formData.bedrooms}
                                  onChange={handleInputChange}
                                  required
                                  min="0"
                                />
                              </div>
                            </fieldset>
                          </div>

                          <div className="col-md-6 mb-20">
                            <fieldset>
                              <label htmlFor="bathrooms" className={styles.formLabel}>
                                <i className="icon-bath" /> Number of Bathrooms <span className={styles.requiredStar}>*</span>
                              </label>
                              <div className={styles.inputWrapper}>
                                <input
                                  type="number"
                                  id="bathrooms"
                                  name="bathrooms"
                                  className={`tf-input style-2 ${styles.formInput}`}
                                  placeholder="e.g., 2"
                                  value={formData.bathrooms}
                                  onChange={handleInputChange}
                                  required
                                  min="0"
                                />
                              </div>
                            </fieldset>
                          </div>

                          <div className="col-12 mb-20">
                            <fieldset>
                              <label htmlFor="location" className={styles.formLabel}>
                                <i className="icon-location" /> Property Location <span className={styles.requiredStar}>*</span>
                              </label>
                              <div className={styles.inputWrapper}>
                                <input
                                  type="text"
                                  id="location"
                                  name="location"
                                  className={`tf-input style-2 ${styles.formInput}`}
                                  placeholder="e.g., Damascus, Al-Mazzeh, Main Street"
                                  value={formData.location}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </fieldset>
                          </div>

                          <div className="col-12 mb-20">
                            <fieldset>
                              <label htmlFor="features" className={styles.formLabel}>
                                <i className="icon-star" /> Property Features <span className={styles.requiredStar}>*</span>
                              </label>
                              <div className={styles.textareaWrapper}>
                                <textarea
                                  id="features"
                                  name="features"
                                  className={`tf-input style-2 ${styles.formTextarea}`}
                                  rows={4}
                                  placeholder="Describe your property features (e.g., furnished, parking, garden, balcony, etc.)"
                                  value={formData.features}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </fieldset>
                          </div>

                          <div className="col-12 mb-20">
                            <fieldset>
                              <label htmlFor="additionalDetails" className={styles.formLabel}>
                                <i className="icon-file" /> Additional Details (Optional)
                              </label>
                              <div className={styles.textareaWrapper}>
                                <textarea
                                  id="additionalDetails"
                                  name="additionalDetails"
                                  className={`tf-input style-2 ${styles.formTextarea}`}
                                  rows={4}
                                  placeholder="Any additional information about your property or rental preferences..."
                                  value={formData.additionalDetails}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </fieldset>
                          </div>

                          <div className="col-12">
                            <button
                              type="submit"
                              className={`tf-btn bg-color-primary w-full ${styles.submitButton}`}
                              disabled={isSubmitting}
                            >
                              <i className="icon-file" /> {isSubmitting ? 'Submitting...' : 'Submit Property for Rental Service'}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className={`benefits-section ${styles.benefitsSection}`}>
                <div className="row">
                  <div className="col-12">
                    <h2 className={styles.benefitsTitle}>
                      Why Choose AqaarGate Property Rental Service?
                    </h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4 col-md-6 mb-30">
                    <div className={styles.benefitCard}>
                      <div className={`${styles.benefitIcon} ${styles.benefitIconOrange}`}>
                        <i className="icon-Hammer" />
                      </div>
                      <h4 className={styles.benefitTitle}>
                        Specialized Maintenance Team
                      </h4>
                      <p className={styles.benefitText}>
                        Our dedicated maintenance team ensures your property stays in perfect condition throughout the rental period.
                      </p>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6 mb-30">
                    <div className={styles.benefitCard}>
                      <div className={`${styles.benefitIcon} ${styles.benefitIconGreen}`}>
                        <i className="icon-shield" />
                      </div>
                      <h4 className={styles.benefitTitle}>
                        Condition Guarantee
                      </h4>
                      <p className={styles.benefitText}>
                        We guarantee to maintain your property in the same excellent condition as when we received it.
                      </p>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6 mb-30">
                    <div className={styles.benefitCard}>
                      <div className={`${styles.benefitIcon} ${styles.benefitIconBlue}`}>
                        <svg width="40" height="40" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto' }}>
                          <path d="M83.7369 288.444C80.6561 259.715 80.1284 230.813 80.1284 201.89C80.1284 181.285 71.8196 116.625 78.7768 99.3229C79.9498 96.4035 96.6129 94.5956 98.6911 94.9388C111.692 97.0949 201.295 89.4578 209.969 92.9101C215.486 95.1026 221.59 105.823 226.201 109.95C263.285 143.152 250.998 128.911 250.998 183.502" stroke="currentColor" strokeOpacity="1" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M248.47 271.071C245.796 276.081 253.619 303.435 248.47 305.96C243.147 308.568 105.302 309.164 92.0859 307.725" stroke="currentColor" strokeOpacity="1" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M209.698 101.354C217.998 112.241 202.962 126.528 204.859 135.991C205.025 136.812 239.235 132.624 243.567 133.8" stroke="currentColor" strokeOpacity="1" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M114.875 137.008C126.219 137.842 137.244 132.895 148.388 133.893" stroke="currentColor" strokeOpacity="1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M112.195 174.004C135.077 175.684 160.792 169.855 181.903 171.779" stroke="currentColor" strokeOpacity="1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M117.555 206.926C120.532 205.792 123.308 199.76 126.94 200.275C150.41 203.605 159.345 207.493 184.581 204.71" stroke="currentColor" strokeOpacity="1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M117.555 242.192C133.916 243.182 136.025 236.872 157.771 241.302" stroke="currentColor" strokeOpacity="1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M235.656 227.352C248.017 211.693 272.226 178.413 284.956 162.912C296.461 148.902 295.801 135.225 316.285 148.828C332.535 159.622 316.949 170.237 307.48 183.104C305.858 185.306 260.957 245.463 259.98 245.302C251.825 243.948 242.427 227.833 233.675 230.014C232.292 230.358 222.373 262.4 221.817 265.159C219.947 274.467 248.921 251.813 256.699 248.71" stroke="currentColor" strokeOpacity="1" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
                          <path opacity="0.6" d="M219.436 270.196C218.823 237.421 198.241 279.401 190.363 280.408C185.311 281.052 186.408 263.032 178.096 260.908C170.513 258.973 168.995 272.75 162.647 274.372C156.97 275.823 146.425 272.395 137.664 274.836" stroke="currentColor" strokeOpacity="1" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h4 className={styles.benefitTitle}>
                        Formal Agreement
                      </h4>
                      <p className={styles.benefitText}>
                        All terms are clearly defined in a formal agreement, ensuring transparency and peace of mind.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

