"use client";
import React, { useState, useEffect } from "react";
import { useCreateMessage } from "@/apis/hooks";
import { getPropertyTitle } from "@/utlis/propertyHelpers";
import styles from "./ContactAgentModal.module.css";

export default function ContactAgentModal({ isOpen, onClose, property }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const { mutate: createMessage, isPending, isSuccess, isError, error } = useCreateMessage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare message data
    const agentId =
      (typeof property?.agentId === 'object' && property.agentId?._id) ? property.agentId._id :
      (typeof property?.agent === 'object' && property.agent?._id) ? property.agent._id :
      property?.agentId || property?.agent;

    const messageData = {
      propertyId: property._id,
      agentId,
      senderName: formData.name,
      senderEmail: formData.email,
      subject: `Ask a Question - ${property.propertyKeyword}`,
      message: formData.message,
      messageType: 'inquiry'
    };

    // Submit using the mutation
    createMessage(messageData);
  };

  // Handle successful submission
  useEffect(() => {
    if (isSuccess) {
      // Reset form and close modal after 2 seconds
      const timer = setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        onClose();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", email: "", message: "" });
    }
  }, [isOpen]);


  const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || (typeof error === 'string' ? error : null);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          <i className="icon-close" />
        </button>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>More About This Property</h2>
          {property && (
            <p className={styles.propertyInfo}>
              {property.propertyKeyword} {property.propertyType} - ${property.propertyPrice?.toLocaleString()}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              className={styles.formTextarea}
              rows={5}
              required
            />
          </div>

          {isSuccess && (
            <div className={styles.successMessage}>
              Message sent successfully! The agent will contact you soon.
            </div>
          )}

          {isError && (
            <div className={styles.errorMessage}>
              {errorMessage ? `Failed to send message: ${errorMessage}` : "Failed to send message. Please try again."}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isPending || isSuccess}
          >
            <i className="icon-mail" />
            {isPending ? "Sending..." : isSuccess ? "Sent!" : "Email agent"}
          </button>
        </form>
      </div>
    </div>
  );
}

