"use client";
import React from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import logger from "@/utlis/logger";

export default function GlobalStatusModal({ 
  isOpen, 
  onClose, 
  type = "success", // "success" or "warning"
  title,
  message,
  userEmail,
  showLoginButton = false
}) {
  const pathname = usePathname();
  
  // Extract locale from pathname (e.g., /ar/... or /en/...)
  const locale = pathname?.split('/')[1] || 'en';
  const isRTL = locale === 'ar';
  
  // Use safe translations hook
  const tGlobalStatus = useSafeTranslations('globalStatus');
  const tRegistrationSuccess = useSafeTranslations('registrationSuccess');
  
  // Use GlobalModal context for opening login modal
  const { showLoginModal } = useGlobalModal();
  if (!isOpen) {
    return null;
  }

  const isSuccess = type === "success";
  const iconColor = isSuccess ? "#25c55b" : "#f59e0b";
  const iconSymbol = isSuccess ? "✅" : "⚠️";
  const bgColor = isSuccess ? "#f0fdf4" : "#fffbeb";
  const borderColor = isSuccess ? "#bbf7d0" : "#fed7aa";

  const modalContent = (
    <div 
      className="modal fade show"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
        boxSizing: 'border-box'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="modal-dialog modal-dialog-centered"
        style={{
          maxWidth: '480px',
          width: '100%'
        }}
      >
        <div className="modal-content">
          <div className="flat-account">
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              {/* Status Icon */}
              <div 
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: iconColor,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '40px',
                  color: 'white',
                  boxShadow: `0 4px 12px ${iconColor}30`
                }}
              >
                {iconSymbol}
              </div>

              {/* Status Title */}
              <h2 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '28px', 
                fontWeight: '700',
                color: 'var(--Heading)'
              }}>
                {title}
              </h2>

              {/* Status Message */}
              <p style={{ 
                margin: '0 0 24px 0', 
                color: 'var(--Text)', 
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                {message}
              </p>

              {/* User Email (if provided) */}
              {userEmail && (
                <div style={{
                  backgroundColor: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '32px'
                }}>
                  <p style={{
                    margin: '0',
                    color: iconColor,
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {isSuccess ? tGlobalStatus('accountCreatedFor') : tGlobalStatus('email')} {userEmail}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {showLoginButton && isSuccess ? (
                  <>
                    <button
                      onClick={() => {
                        onClose();
                        showLoginModal();
                      }}
                      className="tf-btn bg-color-primary"
                      style={{
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        minWidth: window.innerWidth <= 360 ? '100%' : '120px',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: 'white'
                      }}
                    >
                      {tGlobalStatus('login')}
                    </button>
                    <button
                      onClick={onClose}
                      className="tf-btn style-border"
                      style={{
                        padding: '12px 24px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        color: 'var(--Text)',
                        minWidth: window.innerWidth <= 360 ? '100%' : '120px'
                      }}
                    >
                      {tGlobalStatus('close')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onClose}
                    className="tf-btn bg-color-primary"
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      minWidth: window.innerWidth <= 360 ? '100%' : '120px',
                      background: isSuccess ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'var(--Primary)',
                      color: 'white'
                    }}
                  >
                    {isSuccess ? tGlobalStatus('continue') : tGlobalStatus('close')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use React Portal to render at document body level
  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
