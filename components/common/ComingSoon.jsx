"use client";
import React from "react";
import DashboardFooter from "./DashboardFooter";
import { useTranslations, useLocale } from 'next-intl';

export default function ComingSoon({ 
  title = "Coming Soon",
  message = "This page is under development and will be available soon.",
  icon = "🚀",
  usePackageTranslations = false // Flag to use package translations
}) {
  const locale = useLocale();
  // Always call useTranslations (React hooks must be called unconditionally)
  const tPackage = useTranslations('agent.package');
  
  // Use translations if usePackageTranslations is true, otherwise use provided props
  const displayTitle = usePackageTranslations ? tPackage('comingSoonTitle') : title;
  const displayMessage = usePackageTranslations ? tPackage('comingSoonMessage') : message;
  const displayWorkingHard = usePackageTranslations ? tPackage('workingHard') : "We're working hard to bring you this feature. Please check back soon!";
  const displayShowDashboard = usePackageTranslations ? tPackage('showDashboard') : "Show Dashboard";
  
  return (
    <div className="main-content w-100" style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="main-content-inner style-3">
        <div className="button-show-hide show-mb">
          <span className="body-1">{displayShowDashboard}</span>
        </div>
        <div className="widget-box-2 style-2" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '60px 20px'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>
            {icon}
          </div>
          <h2 className="title" style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: '#333'
          }}>
            {displayTitle}
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            maxWidth: '600px',
            lineHeight: '1.6',
            marginBottom: '40px',
            direction: locale === 'ar' ? 'rtl' : 'ltr',
            textAlign: 'center'
          }}>
            {displayMessage}
          </p>
          <div style={{
            padding: '20px 40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '2px dashed #dee2e6',
            maxWidth: '500px'
          }}>
            <p style={{ 
              fontSize: '16px', 
              color: '#495057',
              margin: 0,
              direction: locale === 'ar' ? 'rtl' : 'ltr',
              textAlign: 'center'
            }}>
              {displayWorkingHard}
            </p>
          </div>
        </div>
        {/* .footer-dashboard */}
        <DashboardFooter className="style-2" />
        {/* .footer-dashboard */}
      </div>
      <div className="overlay-dashboard" />
    </div>
  );
}

