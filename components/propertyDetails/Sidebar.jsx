"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import MoreAboutPropertyModal from "../modals/MoreAboutPropertyModal";
import { useCreateMessage } from "@/apis/hooks";
import CopyIcon from "../common/CopyIcon";
import styles from "./Sidebar.module.css";

export default function Sidebar({ property }) {
  const t = useTranslations('propertyDetail');
  const locale = useLocale();
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    senderName: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [imageError, setImageError] = useState(false);
  
  const createMessageMutation = useCreateMessage();
  
  // Extract agent contact information from property
  // Only get email if explicitly set, don't use fallback defaults
  const agentEmail = property?.agentEmail && property.agentEmail.trim() !== '' 
                     ? property.agentEmail.trim()
                     : (property?.agentId?.email && property.agentId.email.trim() !== '' 
                        ? property.agentId.email.trim()
                        : (typeof property?.agent === 'object' && property?.agent?.email && property.agent.email.trim() !== ''
                           ? property.agent.email.trim()
                           : null));
  const rawAgentNumber = property?.agentNumber || 
                         property?.agentId?.phone || 
                         property?.agent?.phone ||
                         null;
  
  // Format phone number: always put + sign on the right
  // Arabic: 9999999999+ (plus sign on the right)
  // English: 9999999999+ (plus sign on the right)
  const formatPhoneNumber = (phone) => {
    if (!phone || phone === "Not provided") return null;
    // Remove any existing + sign
    let cleaned = phone.toString().replace(/\+/g, '').trim();
    if (!cleaned) return null;
    
    // Always put + at the end (right side) for both Arabic and English
    return `+${cleaned}`;
  };
  
  const agentNumber = rawAgentNumber ? formatPhoneNumber(rawAgentNumber) : null;
  const agentWhatsapp = property?.agentWhatsapp || 
                        property?.agentNumber || 
                        property?.agentId?.phone ||
                        property?.agent?.phone;
  // Get agent name - prioritize fullName from agentId over agentName to show complete name
  const agentName = (() => {
    // First priority: agentId.fullName (complete name)
    if (property?.agentId?.fullName && property.agentId.fullName.trim()) {
      return property.agentId.fullName.trim();
    }
    
    // Second priority: firstName + lastName from agentId
    if (property?.agentId?.firstName && property?.agentId?.lastName) {
      return `${property.agentId.firstName} ${property.agentId.lastName}`.trim();
    }
    
    // Third priority: fullName from agent object
    if (typeof property?.agent === 'object' && property.agent?.fullName && property.agent.fullName.trim()) {
      return property.agent.fullName.trim();
    }
    
    // Fourth priority: firstName + lastName from agent object
    if (typeof property?.agent === 'object' && property.agent?.firstName && property.agent?.lastName) {
      return `${property.agent.firstName} ${property.agent.lastName}`.trim();
    }
    
    // Fifth priority: agentName (may be incomplete)
    if (property?.agentName && property.agentName.trim()) {
      return property.agentName.trim();
    }
    
    // Sixth priority: username from agent object
    if (typeof property?.agent === 'object' && property.agent?.username && property.agent.username.trim()) {
      return property.agent.username.trim();
    }
    
    // Seventh priority: username from agentId
    if (property?.agentId?.username && property.agentId.username.trim()) {
      return property.agentId.username.trim();
    }
    
    // Eighth priority: agent as string
    if (typeof property?.agent === 'string' && property.agent.trim()) {
      return property.agent.trim();
    }
    
    // Ninth priority: email from agentId
    if (property?.agentId?.email && property.agentId.email.trim()) {
      return property.agentId.email.trim();
    }
    
    // Default fallback
    return "Property Agent";
  })();
  
  // Get agent avatar - check all possible image fields, fallback to initials if no image
  const agentAvatarInitial = property?.agentId?.avatar || 
                             property?.agentId?.image ||
                             property?.agentId?.imageUrl ||
                             property?.agent?.avatar ||
                             property?.agent?.image ||
                             property?.agent?.imageUrl ||
                             null;
  
  // Generate initials from agent name
  const getInitials = (name) => {
    if (!name || name === "Property Agent") return "PA";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const agentInitials = getInitials(agentName);
  const hasAvatarImage = !imageError && agentAvatarInitial;
  
  // Use initials if no image available
  const agentAvatar = hasAvatarImage ? agentAvatarInitial : null;

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
        agentId:
          (typeof property.agentId === 'object' && property.agentId?._id) ? property.agentId._id :
          (typeof property.agent === 'object' && property.agent?._id) ? property.agent._id :
          property.agentId || property.agent,
        senderName: formData.senderName,
        senderEmail: 'user@example.com', // Default email since we don't have email field
        subject: `Contact Agent - ${property.propertyKeyword}`,
        message: formData.message,
        messageType: 'inquiry'
      });

      setSubmitMessage(t('messageSentSuccess'));
      setFormData({ senderName: '', message: '' });
    } catch (error) {
      const apiMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || error?.toString() || 'Unknown error';
      setSubmitMessage(`${t('failedToSendMessage')} ${apiMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="tf-sidebar sticky-sidebar">
        <form
          className="form-contact-seller mb-30"
          onSubmit={handleSubmit}
        >
          <h4 className="heading-title mb-30">{t('contactAgent')}</h4>
          <div className="seller-info">
            <div className="avartar">
              {agentAvatar ? (
                <Image
                  alt={agentName}
                  src={agentAvatar}
                  width={200}
                  height={200}
                  className={styles.avatarImage}
                  onError={() => {
                    setImageError(true);
                  }}
                />
              ) : (
                <div className={styles.avatarInitials}>
                  {agentInitials}
                </div>
              )}
            </div>
            <div className="content">
              <h6 className="name">{agentName}</h6>
              <ul className="contact">
                <li>
                  <i className="icon-phone-1" />
                  <span 
                    dir="ltr" 
                    className={`${styles.phoneNumber} ${locale === 'ar' ? styles.phoneNumberRtl : styles.phoneNumberLtr}`}
                  >
                    {agentNumber || t('phoneNotProvided')}
                  </span>
                </li>
                {agentEmail && agentEmail.trim() !== '' && agentEmail !== 'info@example.com' && (
                  <li>
                    <i className="icon-mail" />
                    <a href={`mailto:${agentEmail}`}>{agentEmail}</a>
                    <CopyIcon text={agentEmail} />
                  </li>
                )}
                {agentWhatsapp && agentWhatsapp !== "Not provided" && (
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img 
                      src="/icons/whatsapp-contact.svg" 
                      alt="WhatsApp" 
                      width={16}
                      height={16}
                      style={{ width: '16px', height: '16px', display: 'inline-block' }}
                    />
                    <a 
                      href={`https://wa.me/${agentWhatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      className={`${styles.phoneNumber} ${locale === 'ar' ? styles.phoneNumberRtl : styles.phoneNumberLtr}`}
                    >
                      {formatPhoneNumber(agentWhatsapp)}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Submit Message */}
          {submitMessage && (() => {
            const isSuccess = submitMessage.toLowerCase().includes('success');
            return (
              <div
                className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'} mb-3 ${styles.submitMessage} ${isSuccess ? styles.submitMessageSuccess : styles.submitMessageError}`}
              >
                {submitMessage}
              </div>
            );
          })()}
          
          <fieldset className="mb-12">
            <input
              type="text"
              className="form-control"
              placeholder={t('fullName')}
              name="senderName"
              id="name1"
              value={formData.senderName}
              onChange={handleInputChange}
              required
            />
          </fieldset>
          <fieldset className="mb-30">
            <textarea
              name="message"
              cols={30}
              rows={10}
              placeholder={t('howCanAgentHelp')}
              id="message1"
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </fieldset>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`tf-btn bg-color-primary w-full ${styles.submitButton} ${isSubmitting ? styles.submitButtonDisabled : styles.submitButtonEnabled}`}
          >
            {isSubmitting ? t('sending') : t('sendMessage')}
          </button>
        </form>
        

      </div>

      {/* Modals */}
      <MoreAboutPropertyModal 
        isOpen={isMoreInfoModalOpen}
        onClose={() => setIsMoreInfoModalOpen(false)}
        property={property}
      />
    </>
  );
}
