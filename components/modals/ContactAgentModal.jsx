"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useCreateMessage } from "@/apis/hooks";
import CopyIcon from "../common/CopyIcon";
import styles from "./ContactAgentModal.module.css";

export default function ContactAgentModal({ 
  isOpen, 
  onClose, 
  property, 
  agent 
}) {
  const t = useTranslations("propertyDetail");
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitMessageType, setSubmitMessageType] = useState(null); // 'success' | 'error'

  const createMessageMutation = useCreateMessage();

  // Extract agent email from property
  // IMPORTANT: Only use property.agentEmail if explicitly set (admin can leave it blank)
  // Do NOT fall back to agentId.email or agent.email as admin may intentionally leave it blank
  const agentEmail = property?.agentEmail && property.agentEmail.trim() !== '' 
                     ? property.agentEmail 
                     : null;

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
    setSubmitMessage('');
    setSubmitMessageType(null);

    try {
      await createMessageMutation.mutateAsync({
        propertyId: property._id,
        agentId: property.agentId || property.agent,
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        senderPhone: formData.senderPhone?.trim() || undefined,
        subject: `Contact Agent - ${property.propertyKeyword}`,
        message: formData.message,
        messageType: 'inquiry'
      });

      setSubmitMessage(t('messageSentSuccess'));
      setSubmitMessageType('success');
      setFormData({ senderName: '', senderEmail: '', senderPhone: '', message: '' });
      setTimeout(() => { onClose(); }, 2000);
    } catch (error) {
      setSubmitMessage(`${t('failedToSendMessage')} ${error.message || ''}`);
      setSubmitMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={styles.closeButton}
        >
          ×
        </button>

        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {t('contactAgent')}
          </h3>
        </div>

        {/* Agent Info */}
        <div className={styles.agentInfo}>
          <div className={styles.agentDetails}>
            <h4 className={styles.agentTitle}>
              {t('propertyAgent')}
            </h4>
            {agentEmail && (
              <div className={styles.agentContact}>
                <i className={`icon-mail ${styles.agentIcon}`} />
                <span className={styles.agentEmail}>
                  {agentEmail}
                </span>
                <CopyIcon text={agentEmail} />
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {t('fullName')} *
            </label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleInputChange}
              placeholder={t('fullName')}
              onInvalid={(e) => e.target.setCustomValidity(t('pleaseFillOutThisField'))}
              onInput={(e) => e.target.setCustomValidity('')}
              required
              className={styles.input}
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {t('emailOptional')}
            </label>
            <input
              type="email"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleInputChange}
              placeholder={t('emailPlaceholder')}
              className={styles.input}
            />
          </div>

          {/* Phone (optional) */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {t('phoneOptional')}
            </label>
            <input
              type="tel"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleInputChange}
              placeholder={t('phoneOptional')}
              className={styles.input}
            />
          </div>

          {/* Message */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {t('messageLabel')} *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t('interestedInProperty', { property: property?.propertyKeyword || t('thisProperty') })}
              onInvalid={(e) => e.target.setCustomValidity(t('pleaseFillOutThisField'))}
              onInput={(e) => e.target.setCustomValidity('')}
              rows={5}
              required
              className={`${styles.input} ${styles.textarea}`}
            />
          </div>

          {/* Submit */}
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.btnSecondary}>
              {t('cancel')}
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.btnPrimary}>
              {isSubmitting ? t('sending') : t('sendMessage')}
            </button>
          </div>

          {submitMessage && (
            <div
              className={`${styles.submitMessage} ${
                submitMessageType === 'success' ? styles.submitMessageSuccess : submitMessageType === 'error' ? styles.submitMessageError : ''
              }`}
            >
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
