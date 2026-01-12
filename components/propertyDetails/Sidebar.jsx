"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import MoreAboutPropertyModal from "../modals/MoreAboutPropertyModal";
import { useCreateMessage } from "@/apis/hooks";

export default function Sidebar({ property }) {
  const t = useTranslations('propertyDetail');
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
  // IMPORTANT: Only use property.agentEmail if explicitly set (admin can leave it blank)
  // Do NOT fall back to agentId.email or agent.email as admin may intentionally leave it blank
  const agentEmail = property?.agentEmail && property.agentEmail.trim() !== '' 
                     ? property.agentEmail 
                     : null;
  const agentNumber = property?.agentNumber || 
                      property?.agentId?.phone || 
                      property?.agent?.phone ||
                      "Not provided";
  const agentWhatsapp = property?.agentWhatsapp || 
                        property?.agentNumber || 
                        property?.agentId?.phone ||
                        property?.agent?.phone;
  const agentName = property?.agentId?.username || 
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
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
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
                  <span>{agentNumber && agentNumber !== "Not provided" ? agentNumber : t('phoneNotProvided')}</span>
                </li>
                {agentEmail && (
                  <li>
                    <i className="icon-mail" />
                    <a href={`mailto:${agentEmail}`}>{agentEmail}</a>
                  </li>
                )}
                {agentWhatsapp && agentWhatsapp !== "Not provided" && (
                  <li>
                    <i className="icon-whatsapp" />
                    <a 
                      href={`https://wa.me/${agentWhatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('whatsapp')}
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
                className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'} mb-3`}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '20px',
                  textAlign: 'center',
                  backgroundColor: isSuccess ? '#fef7f1' : '#fee2e2',
                  color: isSuccess ? '#f1913d' : '#991b1b',
                  border: `1px solid ${isSuccess ? 'rgba(241, 145, 61, 0.15)' : '#fecaca'}`
                }}
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
            className="tf-btn bg-color-primary w-full"
            style={{ 
              border: 'none', 
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}
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
