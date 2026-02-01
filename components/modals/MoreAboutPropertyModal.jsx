"use client";
import React, { useState } from "react";
import { useCreateMessage } from "@/apis/hooks";
import { formatPriceWithCurrency } from "@/utlis/propertyHelpers";

export default function MoreAboutPropertyModal({ 
  isOpen, 
  onClose, 
  property 
}) {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const createMessageMutation = useCreateMessage();

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
        agentId: property.agent || property.agentId,
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        senderPhone: formData.senderPhone,
        subject: `More About This Property - ${property.propertyKeyword}`,
        message: formData.message,
        messageType: 'info'
      });

      setSubmitMessage('Message sent successfully!');
      setFormData({ senderName: '', senderEmail: '', senderPhone: '', message: '' });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      const apiMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || error?.toString() || 'Unknown error';
      setSubmitMessage(`Failed to send message: ${apiMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6b7280',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.color = '#374151';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#6b7280';
          }}
        >
          ×
        </button>

        {/* Header */}
        <div className="modal-header" style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0,
            marginBottom: '8px'
          }}>
            More About This Property
          </h3>
        </div>

        {/* Property Info */}
        <div className="property-info" style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{
            fontSize: '16px',
            color: '#374151',
            margin: 0,
            fontWeight: '500'
          }}>
            {property.propertyKeyword} - {formatPriceWithCurrency(property.propertyPrice, property?.currency)}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Your Name */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Your name *
            </label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleInputChange}
              placeholder="Your name"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f1913d';
                e.target.style.boxShadow = '0 0 0 3px rgba(241, 145, 61, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Email */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Email *
            </label>
            <input
              type="email"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleInputChange}
              placeholder="Email"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f1913d';
                e.target.style.boxShadow = '0 0 0 3px rgba(241, 145, 61, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Phone */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Phone *
            </label>
            <input
              type="tel"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleInputChange}
              placeholder="Phone"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f1913d';
                e.target.style.boxShadow = '0 0 0 3px rgba(241, 145, 61, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px',
              padding: '4px 8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              display: 'inline-block'
            }}>
              Please fill out this field.
            </div>
          </div>

          {/* Message */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Message"
              rows={4}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                resize: 'vertical',
                minHeight: '100px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f1913d';
                e.target.style.boxShadow = '0 0 0 3px rgba(241, 145, 61, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px 24px',
              backgroundColor: '#f1913d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(241, 145, 61, 0.3)',
              opacity: isSubmitting ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = '#e67e22';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(241, 145, 61, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = '#f1913d';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(241, 145, 61, 0.3)';
              }
            }}
          >
            {isSubmitting ? 'Sending...' : (
              <>
                <i className="icon-mail" style={{ fontSize: '16px' }} />
                Email agent
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
