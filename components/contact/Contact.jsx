"use client";
import React, { useState, useRef } from "react";
import { useTranslations, useLocale } from 'next-intl';
import DropdownSelect from "../common/DropdownSelect";
import { contactAPI } from "@/apis";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import { translateApiMessage } from "@/utils/translateApiMessages";
import styles from "./Contact.module.css";

const initialFieldErrors = { name: '', email: '', phone: '', interest: '', message: '' };

export default function Contact() {
  const t = useTranslations('contact');
  const tApi = useTranslations('apiMessages');
  const locale = useLocale();
  const { showSuccessModal, showWarningModal } = useGlobalModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);
  const interestOptionKeys = ['selectOption', 'rent', 'sale', 'job', 'futureBuyer', 'rentalService', 'becomeAgent', 'complain', 'query', 'location'];
  const [selectedInterest, setSelectedInterest] = useState('selectOption');
  const formRef = useRef(null);
  const lastSubmitTimeRef = useRef(0);

  const clearFieldError = (field) => {
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitMessage('');
    setFieldErrors(initialFieldErrors);

    // Prevent double submission (simple debounce)
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 2000) {
      return;
    }
    lastSubmitTimeRef.current = now;

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const phone = formData.get('phone')?.trim();
    const message = formData.get('message')?.trim();

    const interest = selectedInterest && selectedInterest !== 'selectOption'
      ? t(selectedInterest)
      : 'General Inquiry';

    const nextFieldErrors = { ...initialFieldErrors };
    let hasError = false;
    const err = (key, fallback) => {
      try {
        return t(key) || fallback;
      } catch {
        return fallback;
      }
    };

    if (!name) {
      nextFieldErrors.name = err('errors.nameRequired', 'Please enter your name');
      hasError = true;
    }
    if (!phone) {
      nextFieldErrors.phone = err('errors.phoneRequired', 'Please enter your phone number');
      hasError = true;
    }
    if (selectedInterest === 'selectOption') {
      nextFieldErrors.interest = err('errors.interestRequired', 'Please select what you are interested in');
      hasError = true;
    }
    if (!message) {
      nextFieldErrors.message = err('errors.messageRequired', 'Please enter your message');
      hasError = true;
    }
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        nextFieldErrors.email = err('errors.emailInvalid', 'Please enter a valid email address');
        hasError = true;
      }
    }

    if (hasError) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await contactAPI.createContact({
        name,
        email: email || undefined,
        phone,
        interest,
        message
      });
      
      if (result.success) {
        setSubmitMessage(locale === 'ar' ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' : 'Your message has been sent successfully! We will contact you soon.');
        showSuccessModal(
          locale === 'ar' ? 'نجاح' : 'Success',
          locale === 'ar' ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' : 'Your message has been sent successfully! We will contact you soon.'
        );
        formRef.current?.reset();
        setSelectedInterest('selectOption');
        setFieldErrors(initialFieldErrors);
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (err) {
      let errorMsg = '';
      
      // Handle rate limit error
      if (err?.error === 'RATE_LIMIT_EXCEEDED' || err?.response?.data?.error === 'RATE_LIMIT_EXCEEDED') {
        const retryAfter = err?.response?.data?.retryAfter || 900; // 15 minutes default
        const minutes = Math.ceil(retryAfter / 60);
        errorMsg = locale === 'ar'
          ? `تم تجاوز عدد الطلبات المسموح به. يرجى المحاولة مرة أخرى بعد ${minutes} دقيقة.`
          : `Too many requests. Please try again after ${minutes} minutes.`;
      } else {
        // Translate other errors
        errorMsg = translateApiMessage(
          err?.response?.data?.message || err?.message || 'Failed to send message',
          locale,
          tApi
        );
      }
      
      setError(errorMsg);
      showWarningModal(
        tApi('error'),
        errorMsg
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="section-top-map style-2">
      <div className="wrap-map">
        <div className={`row-height ${styles.contactImageSection}`}>
          <div className={styles.contactBackgroundImage}></div>
        </div>
      </div>
      <div className="box">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <form
                ref={formRef}
                id="contactform"
                onSubmit={handleSubmit}
                className="form-contact"
                noValidate
              >
                <div className="heading-section">
                  <h2 className="title">{t('title')}</h2>
                  <p className="text-1">
                    {t('subtitle')}
                  </p>
                </div>
                <div className="cols">
                  <fieldset>
                    <label htmlFor="name">{t('name')} <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      className={`form-control ${fieldErrors.name ? styles.inputError : ''}`}
                      placeholder={t('namePlaceholder')}
                      name="name"
                      id="name"
                      onChange={() => clearFieldError('name')}
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                    />
                    {fieldErrors.name && (
                      <span id="name-error" className={styles.fieldError} role="alert">{fieldErrors.name}</span>
                    )}
                  </fieldset>
                  <fieldset>
                    <label htmlFor="email">{t('email')}</label>
                    <input
                      type="text"
                      className={`form-control ${fieldErrors.email ? styles.inputError : ''}`}
                      placeholder={t('emailPlaceholder')}
                      name="email"
                      id="email-contact"
                      onChange={() => clearFieldError('email')}
                    />
                    {fieldErrors.email && <span className={styles.fieldError} role="alert">{fieldErrors.email}</span>}
                  </fieldset>
                </div>
                <div className="cols">
                  <fieldset className="phone">
                    <label htmlFor="phone">{t('phoneNumber')} <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      className={`form-control ${fieldErrors.phone ? styles.inputError : ''}`}
                      placeholder={t('phonePlaceholder')}
                      name="phone"
                      id="phone"
                      onChange={() => clearFieldError('phone')}
                      aria-invalid={!!fieldErrors.phone}
                      aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                    />
                    {fieldErrors.phone && (
                      <span id="phone-error" className={styles.fieldError} role="alert">{fieldErrors.phone}</span>
                    )}
                  </fieldset>
                  <div className="select">
                    <label className="text-1 fw-6 mb-12">
                      {t('interestedIn')} <span className={styles.required}>*</span>
                    </label>
                    <DropdownSelect
                      options={interestOptionKeys}
                      translateOption={(key) => t(key)}
                      addtionalParentClass=""
                      selectedValue={selectedInterest}
                      onChange={(value) => {
                        setSelectedInterest(value);
                        clearFieldError('interest');
                      }}
                    />
                    {fieldErrors.interest && <span className={styles.fieldError} role="alert">{fieldErrors.interest}</span>}
                  </div>
                </div>
                <fieldset>
                  <label htmlFor="message">{t('yourMessage')} <span className={styles.required}>*</span></label>
                  <textarea
                    name="message"
                    cols={30}
                    rows={10}
                    className={fieldErrors.message ? styles.inputError : ''}
                    placeholder={t('messagePlaceholder')}
                    id="message"
                    defaultValue=""
                    onChange={() => clearFieldError('message')}
                    aria-invalid={!!fieldErrors.message}
                    aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                    style={{marginBottom: 0}}
                  />
                  {fieldErrors.message && (
                    <span id="message-error" className={styles.fieldError} role="alert">
                      {fieldErrors.message}
                    </span>
                  )}
                </fieldset>
                {error && (
                  <div className={styles.errorMessage}>
                    {error}
                  </div>
                )}
                {submitMessage && (
                  <div className={styles.successMessage}>
                    {submitMessage}
                  </div>
                )}
                <div className="send-wrap">
                  <button
                    className={`tf-btn bg-color-primary fw-7 pd-8 mt-12 ${styles.submitButton}`}
                    type="submit"
                    disabled={isSubmitting}
                    style={{marginTop: '32px'}}
                  >
                    {isSubmitting 
                      ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                      : t('contactExperts')
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
