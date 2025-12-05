"use client";
import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";

export default function TermsAndConditions() {
  const { showLoginModal, showRegisterModal } = useGlobalModal();
  const t = useTranslations('terms');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const handleLoginClick = (e) => {
    e.preventDefault();
    showLoginModal();
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    showRegisterModal();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="page-wrapper">
      {/* Clean Minimalist Header */}
      <header style={{
        backgroundColor: '#ffffff',
        padding: '20px 0',
        borderBottom: '1px solid #e5e5e5',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#000000',
            fontFamily: 'sans-serif',
            textDecoration: 'none'
          }}>
            <Link href="/" style={{ color: '#000000', textDecoration: 'none' }}>
              AqaarGate
            </Link>
          </div>

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px'
          }}>
            <Link href="/" style={{
              fontSize: '16px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400',
              transition: 'color 0.2s ease'
            }}>
              {t('footer.home')}
            </Link>
            <Link href="/about-us" style={{
              fontSize: '16px',
              color: '#000000',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '700'
            }}>
              {t('footer.aboutUs')}
            </Link>
          </nav>

          {/* Login/Register Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <button onClick={handleLoginClick} style={{
              fontSize: '16px',
              color: '#000000',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e5e5e5',
              transition: 'all 0.2s ease',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}>
              {tCommon('login')}
            </button>
            <button onClick={handleRegisterClick} style={{
              fontSize: '16px',
              color: '#ffffff',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '600',
              padding: '10px 20px',
              borderRadius: '6px',
              backgroundColor: '#000000',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}>
              {tCommon('register')}
            </button>
          </div>
        </div>
      </header>

      {/* Terms Content */}
      <section className="section-listing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="terms-content" style={{ 
                backgroundColor: '#ffffff', 
                padding: '40px 0', 
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: '1.6',
                fontSize: '16px',
                fontFamily: 'sans-serif'
              }}>
                
                {/* Main Title - Centered */}
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: '#000000',
                  textAlign: 'center',
                  marginBottom: '20px',
                  fontFamily: 'sans-serif',
                  letterSpacing: '-0.02em'
                }}>
                  {t('title')}
                </h1>

                {/* Updated Date - Left Aligned */}
                <div style={{ 
                  marginBottom: '40px',
                  textAlign: 'left'
                }}>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#333333',
                    margin: '0',
                    fontWeight: '400'
                  }}>
                    {t('updatedOn')} {formatDate(new Date())}
                  </p>
                </div>

                {/* Introduction */}
                <p style={{ 
                  marginBottom: '40px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('introduction')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section1.title')}
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section1.content')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section2.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section2.intro')}
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section2.list1')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section2.list2')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section2.list3')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section2.list4')}
                  </li>
                </ul>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section2.conclusion')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section3.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>{t('section3.verificationTitle')}</strong> {t('section3.verificationContent')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>{t('section3.adminRightsTitle')}</strong> {t('section3.adminRightsContent')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section3.disclaimer')}
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section3.disclaimerList1')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section3.disclaimerList2')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section3.disclaimerList3')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section3.disclaimerList4')}
                  </li>
                </ul>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section3.thirdPartyTitle')}</strong> {t('section3.thirdPartyContent')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>{t('section3.holidayHomesTitle')}</strong> {t('section3.holidayHomesContent')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>{t('section3.rentPeriodTitle')}</strong> {t('section3.rentPeriodContent')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section4.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section4.intro')}
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section4.list1')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section4.list2')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section4.list3')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section4.list4')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section4.list5')}
                  </li>
                </ul>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section4.suspensionTitle')}</strong> {t('section4.suspensionContent')}
                </p>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>{t('section4.deletionTitle')}</strong> {t('section4.deletionContent')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section5.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section5.intro')}
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section5.list1')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section5.list2')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section5.list3')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section5.list4')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section5.list5')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section5.list6')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section5.list7')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section5.list8')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section5.list9')}
                  </li>
                </ul>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section6.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>{t('section6.verificationTitle')}</strong> {t('section6.verificationContent')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>{t('section6.blockingTitle')}</strong> {t('section6.blockingContent')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section6.disclaimer')}
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section6.disclaimerList1')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section6.disclaimerList2')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section6.disclaimerList3')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section6.disclaimerList4')}
                  </li>
                </ul>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section7.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section7.dynamicTitle')}</strong> {t('section7.dynamicContent')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section7.algorithmTitle')}</strong> {t('section7.algorithmContent')}
                </p>
                <ul style={{ 
                  marginBottom: '20px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section7.factor1')}</strong>
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section7.factor2')}</strong>
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section7.factor3')}</strong>
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section7.factor4')}</strong>
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section7.factor5')}</strong>
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section7.factor6')}
                  </li>
                </ul>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section7.displayTitle')}</strong> {t('section7.displayContent')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section7.consentTitle')}</strong> {t('section7.consentContent')}
                </p>
                <ul style={{ 
                  marginBottom: '20px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section7.consentList1')}
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section7.consentList2')}
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section7.consentList3')}
                  </li>
                </ul>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section7.balanceTitle')}</strong> {t('section7.balanceContent')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section7.updatesTitle')}</strong> {t('section7.updatesContent')}
                </p>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section7.refundTitle')}</strong> {t('section7.refundContent')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section8.title')}
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section8.content1')}
                </p>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section8.content2Title')}</strong> {t('section8.content2')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section9.title')}
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section9.content')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section10.title')}
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section10.content1')}
                </p>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section10.content2Title')}</strong> {t('section10.content2')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section11.title')}
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section11.content')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section12.title')}
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section12.content1')}
                </p>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section12.content2Title')}</strong> {t('section12.content2')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section13.title')}
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section13.content')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section14.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section14.intro')}
                </p>
                <div style={{ 
                  marginBottom: '40px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  fontFamily: 'sans-serif'
                }}>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>{t('section14.email')}</strong> legal@AqaarGate.com
                  </p>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>{t('section14.phone')}</strong> +963995278383
                  </p>
                  <p style={{ margin: '0' }}>
                    <strong>{t('section14.address')}</strong> Dummyj Street , Latakia , Syria
                  </p>
                </div>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section15.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section15.thirdPartyTitle')}</strong> {t('section15.thirdPartyContent')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section15.adsenseTitle')}</strong> {t('section15.adsenseContent')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section15.endorsementTitle')}</strong> {t('section15.endorsementContent')}
                </p>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section15.choicesTitle')}</strong> {t('section15.choicesContent')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section16.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section16.evolutionTitle')}</strong> {t('section16.evolutionContent')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>{t('section16.developmentTitle')}</strong> {t('section16.developmentContent')}
                </p>
                <ul style={{ 
                  marginBottom: '20px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section16.devList1')}
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section16.devList2')}
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section16.devList3')}
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section16.devList4')}
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section16.devList5')}
                  </li>
                </ul>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section16.notificationContent')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section17.title')}
                </h2>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section17.content')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section18.title')}
                </h2>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section18.content')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section19.title')}
                </h2>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section19.content')}
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Minimalist Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        padding: '40px 0',
        borderTop: '1px solid #e5e5e5',
        marginTop: '60px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          {/* Footer Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <Link href="/" style={{
              fontSize: '14px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              {t('footer.home')}
            </Link>
            <Link href="/about-us" style={{
              fontSize: '14px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              {t('footer.aboutUs')}
            </Link>
            <Link href="/contact" style={{
              fontSize: '14px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              {t('footer.contact')}
            </Link>
            <Link href="/terms-and-conditions" style={{
              fontSize: '14px',
              color: '#000000',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '600'
            }}>
              {t('footer.terms')}
            </Link>
            <Link href="/privacy-policy" style={{
              fontSize: '14px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              {t('footer.privacy')}
            </Link>
          </div>

          {/* Copyright */}
          <div style={{
            fontSize: '14px',
            color: '#999999',
            fontFamily: 'sans-serif',
            fontWeight: '400'
          }}>
            © {new Date().getFullYear()} AqaarGate. {t('footer.copyright')}
          </div>
        </div>
      </footer>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .terms-content {
            padding: 20px 0 !important;
            max-width: 100% !important;
          }
          
          .terms-content h1 {
            font-size: 36px !important;
          }
          
          .terms-content h2 {
            font-size: 20px !important;
          }
          
          .terms-content p,
          .terms-content li {
            font-size: 15px !important;
          }

          header nav {
            gap: 20px !important;
          }

          header div:last-child {
            gap: 10px !important;
          }

          footer div:first-child {
            gap: 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          .terms-content h1 {
            font-size: 28px !important;
          }
          
          .terms-content h2 {
            font-size: 18px !important;
          }
          
          .terms-content p,
          .terms-content li {
            font-size: 14px !important;
          }

          header {
            padding: 15px 0 !important;
          }

          header div {
            flex-direction: column !important;
            gap: 15px !important;
          }

          header nav {
            gap: 15px !important;
          }

          footer div:first-child {
            flex-direction: column !important;
            gap: 15px !important;
          }
        }
      `}</style>
    </div>
  );
}
