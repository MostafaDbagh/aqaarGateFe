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
                        <i className="icon-shield" />
                      </div>
                      <h3 className={styles.serviceCardTitle}>
                        <i className="icon-shield" /> Formal Rental Agreement
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
                        <i className="icon-shield" />
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

