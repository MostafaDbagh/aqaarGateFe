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
  const agentEmail = property?.agentEmail || 
                     property?.agentId?.email || 
                     (typeof property?.agent === 'string' && property?.agent.includes('@') ? property?.agent : null) ||
                     property?.agent?.email ||
                     "contact@property.com";
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
  const agentName = property?.agentName || 
                    property?.agentId?.username || 
                    property?.agentId?.fullName ||
                    property?.agentId?.email ||
                    (typeof property?.agent === 'string' ? property?.agent : property?.agent?.username || property?.agent?.email) ||
                    "Property Agent";
  
  // Get agent avatar - check all possible image fields, fallback to default if no image
  const agentAvatarInitial = property?.agentId?.avatar || 
                             property?.agentId?.image ||
                             property?.agentId?.imageUrl ||
                             property?.agent?.avatar ||
                             property?.agent?.image ||
                             property?.agent?.imageUrl ||
                             null;
  
  // Use fallback image if initial image fails or doesn't exist
  const agentAvatar = imageError || !agentAvatarInitial 
    ? "/images/agent-avatar.svg" 
    : agentAvatarInitial;

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
              <Image
                alt={agentName}
                src={agentAvatar}
                width={200}
                height={200}
                className={styles.avatarImage}
                onError={() => {
                  setImageError(true);
                }}
                unoptimized={agentAvatar === "/images/agent-avatar.svg"}
              />
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
                {agentEmail && (
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
