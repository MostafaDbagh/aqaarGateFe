"use client";
import React, { useState } from "react";
import { useCreateMessage } from "@/apis/hooks";
import CopyIcon from "../common/CopyIcon";
import styles from "./ContactAgentModal.module.css"

export default function ContactAgentModal({ 
  isOpen, 
  onClose, 
  property, 
  agent 
}) {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

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

    try {
      await createMessageMutation.mutateAsync({
        propertyId: property._id,
        agentId: property.agentId || property.agent,
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        subject: `Contact Agent - ${property.propertyKeyword}`,
        message: formData.message,
        messageType: 'inquiry'
      });

      setSubmitMessage('Message sent successfully!');
      setFormData({ senderName: '', senderEmail: '', message: '' });
      setTimeout(() => { onClose(); }, 2000);
    } catch (error) {
      setSubmitMessage(`Failed to send message: ${error.message || 'Unknown error'}`);
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
            Contact Agent
          </h3>
        </div>

        {/* Agent Info */}
        <div className={styles.agentInfo}>
          <div className={styles.agentDetails}>
            <h4 className={styles.agentTitle}>
              Property Agent
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
              Full Name *
            </label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              className={styles.input}
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Email (optional)
            </label>
            <input
              type="email"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleInputChange}
              placeholder="Email Address (Optional)"
              className={styles.input}
            />
          </div>

          {/* Message */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={`Hello, I'm interested in ${property?.propertyKeyword || 'this property'}`}
              rows={5}
              required
              className={`${styles.input} ${styles.textarea}`}
            />
          </div>

          {/* Submit */}
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.btnSecondary}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.btnPrimary}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>

          {submitMessage && (
            <div className={styles.submitMessage}>
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
