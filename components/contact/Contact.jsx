"use client";
import React, { useState, useRef } from "react";
import { useTranslations, useLocale } from 'next-intl';
import DropdownSelect from "../common/DropdownSelect";
import { contactAPI } from "@/apis";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import { translateApiMessage } from "@/utils/translateApiMessages";
import styles from "./Contact.module.css";

export default function Contact() {
  const t = useTranslations('contact');
  const tApi = useTranslations('apiMessages');
  const locale = useLocale();
  const { showSuccessModal, showWarningModal } = useGlobalModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedInterest, setSelectedInterest] = useState(t('selectOption'));
  const formRef = useRef(null);
  const lastSubmitTimeRef = useRef(0);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitMessage('');
    
    // Prevent double submission (simple debounce)
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 2000) { // 2 seconds minimum between submissions
      return;
    }
    lastSubmitTimeRef.current = now;
    
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const phone = formData.get('phone')?.trim();
    const message = formData.get('message')?.trim();
    
    // Get selected interest from state
    const interest = selectedInterest && selectedInterest !== t('selectOption') 
      ? selectedInterest 
      : 'General Inquiry';
    
    // Validation
    if (!name || !email || !phone || !message) {
      const errorMsg = locale === 'ar' 
        ? 'يرجى ملء جميع الحقول المطلوبة'
        : 'Please fill in all required fields';
      setError(errorMsg);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMsg = locale === 'ar' 
        ? 'يرجى إدخال عنوان بريد إلكتروني صحيح'
        : 'Please enter a valid email address';
      setError(errorMsg);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await contactAPI.createContact({
        name,
        email,
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
        // Reset form
        formRef.current?.reset();
        setSelectedInterest(t('selectOption'));
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
              >
                <div className="heading-section">
                  <h2 className="title">{t('title')}</h2>
                  <p className="text-1">
                    {t('subtitle')}
                  </p>
                </div>
                <div className="cols">
                  <fieldset>
                    <label htmlFor="name">{t('name')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t('namePlaceholder')}
                      name="name"
                      id="name"
                      required
                    />
                  </fieldset>
                  <fieldset>
                    <label htmlFor="email">{t('email')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t('emailPlaceholder')}
                      name="email"
                      id="email-contact"
                      required
                    />
                  </fieldset>
                </div>
                <div className="cols">
                  <fieldset className="phone">
                    <label htmlFor="phone">{t('phoneNumber')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t('phonePlaceholder')}
                      name="phone"
                      id="phone"
                      required
                    />
                  </fieldset>
                  <div className="select">
                    <label className="text-1 fw-6 mb-12">
                      {t('interestedIn')}
                    </label>

                    <DropdownSelect
                      options={[t('selectOption'), t('location'), t('rent'), t('sale')]}
                      addtionalParentClass=""
                      selectedValue={selectedInterest}
                      onChange={(value) => setSelectedInterest(value)}
                    />
                  </div>
                </div>
                <fieldset>
                  <label htmlFor="message">{t('yourMessage')}</label>
                  <textarea
                    name="message"
                    cols={30}
                    rows={10}
                    placeholder={t('messagePlaceholder')}
                    id="message"
                    required
                    defaultValue={""}
                  />
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
                    className={`tf-btn bg-color-primary fw-7 pd-8 ${styles.submitButton}`}
                    type="submit"
                    disabled={isSubmitting}
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
