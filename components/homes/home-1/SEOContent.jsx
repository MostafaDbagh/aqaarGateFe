"use client";
import React from "react";
import { useTranslations, useLocale } from 'next-intl';
import Link from "next/link";
import styles from "./SEOContent.module.css";

// Helper function to parse **bold** text and convert to <strong> tags
const parseBoldText = (text) => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function SEOContent() {
  const locale = useLocale();
  const t = useTranslations('seoContent');
  const isRTL = locale === 'ar';

  // Helper to format CTA text with links
  const formatCTAText = () => {
    if (locale === 'ar') {
      return (
        <>
          تصفح <Link href="/property-list" className={styles.link} style={{margin:'0 2px'}}>{t('propertyListings')}</Link> 
          {' '}للعثور على منزل أحلامك في سوريا أو اللاذقية.{' '}
          تبحث عن <Link href="/property-list?propertyType=Holiday Home" className={styles.link} style={{margin:'0 2px'}}>{t('holidayHomesLink')}</Link>؟{' '}
          اطلع على <Link href="/property-list?status=rent&propertyType=Holiday Home" className={styles.link} style={{margin:'0 2px'}}>{t('holidayHomesRent')}</Link>.{' '}
          اتصل بـ <Link href="/agents" className={styles.link} style={{margin:'0 2px'}}>{t('realEstateAgents')}</Link> 
          {' '}للحصول على إرشادات مخصصة. ابدأ البحث عن عقارك اليوم!
        </>
      );
    } else {
      return (
        <>
          Browse our <Link href="/property-list" className={styles.link} style={{margin:'0 2px'}}>{t('propertyListings')}</Link> 
          {' '}to find your perfect home in Syria or Lattakia.{' '}
          Contact our <Link href="/agents" className={styles.link} target="_blank" style={{margin:'0 2px'}}>{t('realEstateAgents')}</Link> 
          {' '}for expert guidance.
        </>
      );
    }
  };

  return (
    <section className={`section-seo-content ${styles.seoSection}`} aria-label="SEO Content">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            {/* Main SEO Content */}
            <div className={styles.seoContent}>
              <div className={styles.contentBlock}>
                <h1 className={styles.mainTitle}>
                  {t('mainTitle')}
                </h1>
                
                <div className={styles.contentGrid}>
                  <div className={styles.contentItem}>
                    <h2 className={styles.subTitle}>
                      {t('syriaProperties.title')}
                    </h2>
                    <p className={styles.text}>
                      {parseBoldText(t('syriaProperties.text'))}
                    </p>
                  </div>

                  <div className={styles.contentItem}>
                    <h2 className={styles.subTitle}>
                      {t('lattakiaProperties.title')}
                    </h2>
                    <p className={styles.text}>
                      {parseBoldText(t('lattakiaProperties.text'))}
                    </p>
                  </div>

                  <div className={styles.contentItem}>
                    <h2 className={styles.subTitle}>
                      {t('holidayHomes.title')}
                    </h2>
                    <p className={styles.text}>
                      {parseBoldText(t('holidayHomes.text'))}
                    </p>
                  </div>

                  <div className={styles.contentItem}>
                    <h2 className={styles.subTitle}>
                      {t('propertyInvestment.title')}
                    </h2>
                    <p className={styles.text}>
                      {parseBoldText(t('propertyInvestment.text'))}
                    </p>
                  </div>
                </div>

                <div className={styles.ctaSection}>
                  <p className={styles.ctaText}>
                    {formatCTAText()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

