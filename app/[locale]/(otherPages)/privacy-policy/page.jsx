"use client";
import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

export default function PrivacyPolicy() {
  const { showLoginModal, showRegisterModal } = useGlobalModal();
  const t = useTranslations('privacy');
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
    // Use Gregorian calendar (miladi) for Arabic, not Hijri
    if (locale === 'ar') {
      // Force Gregorian calendar - manually format to avoid Hijri
      const d = new Date(date);
      const year = d.getFullYear();
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const month = months[d.getMonth()];
      const day = d.getDate();
      return `${day} ${month} ${year}`;
    }
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isRTL = locale === 'ar';

  return (
    <div className="page-wrapper" dir={isRTL ? 'rtl' : 'ltr'}>
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
          justifyContent: 'space-between',
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }}>
          {/* Logo */}
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#000000',
            fontFamily: 'sans-serif',
            textDecoration: 'none',
            order: isRTL ? 3 : 1
          }}>
            <Link href="/" style={{ color: '#000000', textDecoration: 'none' }}>
              AqaarGate
            </Link>
          </div>

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            order: isRTL ? 2 : 2
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

          {/* Language Switcher and Login/Register Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            order: isRTL ? 1 : 3
          }}>
            <LanguageSwitcher />
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

      {/* Privacy Policy Content */}
      <section className="section-listing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="privacy-content" style={{ 
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

                {/* Updated Date */}
                <div style={{ 
                  marginBottom: '40px',
                  textAlign: isRTL ? 'right' : 'left'
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
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('introduction')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section1.title')}
                </h2>
                
                <h3 style={{ 
                  color: '#000000', 
                  marginBottom: '20px', 
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section1.subsection1.title')}
                </h3>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section1.subsection1.intro')}
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: isRTL ? '0' : '20px',
                  paddingRight: isRTL ? '20px' : '0',
                  listStyle: 'disc',
                  direction: isRTL ? 'rtl' : 'ltr'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section1.subsection1.list1')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section1.subsection1.list2')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section1.subsection1.list3')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section1.subsection1.list4')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section1.subsection1.list5')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section1.subsection1.list6')}
                  </li>
                </ul>

                <h3 style={{ 
                  color: '#000000', 
                  marginBottom: '20px', 
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section1.subsection2.title')}
                </h3>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section1.subsection2.intro')}
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: isRTL ? '0' : '20px',
                  paddingRight: isRTL ? '20px' : '0',
                  listStyle: 'disc',
                  direction: isRTL ? 'rtl' : 'ltr'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section1.subsection2.list1')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section1.subsection2.list2')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section1.subsection2.list3')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section1.subsection2.list4')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section1.subsection2.list5')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section1.subsection2.list6')}
                  </li>
                </ul>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section2.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section2.intro')}
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: isRTL ? '0' : '20px',
                  paddingRight: isRTL ? '20px' : '0',
                  listStyle: 'disc',
                  direction: isRTL ? 'rtl' : 'ltr'
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
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section2.list5')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section2.list6')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section2.list7')}
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    {t('section2.list8')}
                  </li>
                </ul>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section3.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section3.intro')}
                </p>
                
                <h3 style={{ 
                  color: '#000000', 
                  marginBottom: '20px', 
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section3.subsection1.title')}
                </h3>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section3.subsection1.content')}
                </p>

                <h3 style={{ 
                  color: '#000000', 
                  marginBottom: '20px', 
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section3.subsection2.title')}
                </h3>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section3.subsection2.content')}
                </p>

                <h3 style={{ 
                  color: '#000000', 
                  marginBottom: '20px', 
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section3.subsection3.title')}
                </h3>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section3.subsection3.content')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section4.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section4.intro')}
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: isRTL ? '0' : '20px',
                  paddingRight: isRTL ? '20px' : '0',
                  listStyle: 'disc',
                  direction: isRTL ? 'rtl' : 'ltr'
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
                </ul>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section4.conclusion')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section5.title')}
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section5.content1')}
                </p>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>{t('section5.content2Title')}</strong> {t('section5.content2')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section6.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section6.intro')}
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: isRTL ? '0' : '20px',
                  paddingRight: isRTL ? '20px' : '0',
                  listStyle: 'disc',
                  direction: isRTL ? 'rtl' : 'ltr'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section6.right1')}</strong>
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section6.right2')}</strong>
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section6.right3')}</strong>
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section6.right4')}</strong>
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section6.right5')}</strong>
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section6.right6')}</strong>
                  </li>
                </ul>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section7.title')}
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section7.content1')}
                </p>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>{t('section7.content2Title')}</strong> {t('section7.content2')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section8.title')}
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section8.content')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section9.title')}
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section9.content')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section10.title')}
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section10.content')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section11.title')}
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section11.content')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section13.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>{t('section13.platformTitle')}</strong> {t('section13.platformContent')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>{t('section13.revenueTitle')}</strong> {t('section13.revenueContent')}
                </p>
                <ul style={{ 
                  marginBottom: '20px', 
                  paddingLeft: isRTL ? '0' : '20px',
                  paddingRight: isRTL ? '20px' : '0',
                  listStyle: 'disc',
                  direction: isRTL ? 'rtl' : 'ltr'
                }}>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section13.revenueList1')}</strong>
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section13.revenueList2')}</strong>
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section13.revenueList3')}</strong>
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>{t('section13.revenueList4')}</strong>
                  </li>
                </ul>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section13.noBenefit')}
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>{t('section13.notificationTitle')}</strong> {t('section13.notificationContent')}
                </p>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section13.acknowledgment')}
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                  fontFamily: 'sans-serif'
                }}>
                  {t('section14.title')}
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: isRTL ? 'right' : 'left',
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
                    <strong>{t('section14.email')}</strong> support@aqaargate.com
                  </p>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>{t('section14.phone')}</strong> +963995278383
                  </p>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>{t('section14.address')}</strong> Dummyj Street , Latakia , Syria
                  </p>
           
                </div>

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
            flexWrap: 'wrap',
            direction: isRTL ? 'rtl' : 'ltr'
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
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              {t('footer.terms')}
            </Link>
            <Link href="/privacy-policy" style={{
              fontSize: '14px',
              color: '#000000',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '600'
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
          .privacy-content {
            padding: 20px 0 !important;
            max-width: 100% !important;
          }
          
          .privacy-content h1 {
            font-size: 36px !important;
          }
          
          .privacy-content h2 {
            font-size: 20px !important;
          }
          
          .privacy-content h3 {
            font-size: 18px !important;
          }
          
          .privacy-content p,
          .privacy-content li {
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
          .privacy-content h1 {
            font-size: 28px !important;
          }
          
          .privacy-content h2 {
            font-size: 18px !important;
          }
          
          .privacy-content h3 {
            font-size: 16px !important;
          }
          
          .privacy-content p,
          .privacy-content li {
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
