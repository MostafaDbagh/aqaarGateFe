'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './About.module.css';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('aboutUs');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const cities = [
    { name: 'Damascus', icon: '🏛️' },
    { name: 'Aleppo', icon: '🏰' },
    { name: 'Latakia', icon: '🌊' },
    { name: 'Homs', icon: '🏙️' },
    { name: 'Tartous', icon: '⛵' },
  ];

  return (
    <section className={styles.aboutSection}>
      <div className={styles.animatedBackground}>
        <div className={styles.floatingCircle} />
        <div className={styles.floatingCircle} />
        <div className={styles.floatingCircle} />
        <div className={styles.geometricShape} />
        <div className={styles.geometricShape} />
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.glassSection}>
          <div className={`${styles.heroSection} ${isVisible ? styles.visible : styles.hidden}`}>
            <div className={styles.heroBadge}>
              <span>{t('badge')}</span>
            </div>
            <h1 className={styles.heroTitle}>{t('title')}</h1>
            <div className={styles.heroDivider} />
            <p className={styles.heroSubtitle}>
              {t('subtitle')}
            </p>
          </div>

          <div className={styles.visionPointsGrid}>
            <div className={`${styles.visionPointCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.visionPointIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className={styles.visionPointTitle}>{t('modernArchitecture.title')}</h3>
              <p className={styles.visionPointText}>
                {t('modernArchitecture.text')}
              </p>
            </div>

            <div className={`${styles.visionPointCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.visionPointIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className={styles.visionPointTitle}>{t('ancientHeritage.title')}</h3>
              <p className={styles.visionPointText}>
                {t('ancientHeritage.text')}
              </p>
            </div>

            <div className={`${styles.visionPointCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.visionPointIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className={styles.visionPointTitle}>{t('brightFuture.title')}</h3>
              <p className={styles.visionPointText}>
                {t('brightFuture.text')}
              </p>
            </div>
          </div>

          <div className={`${styles.visionStatement} ${isVisible ? styles.visible : styles.hidden}`}>
            <h2 className={styles.visionStatementTitle}>{t('showcasingCities.title')}</h2>
            <p className={styles.visionStatementText}>
              {t('showcasingCities.text')}
            </p>
          </div>

          <div className={styles.citiesGrid}>
            {cities.map((city, index) => (
              <div 
                key={city.name} 
                className={`${styles.cityCard} ${isVisible ? styles.visible : styles.hidden}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.cityIcon}>{city.icon}</div>
                <h4 className={styles.cityName} dir="ltr">{city.name}</h4>
              </div>
            ))}
          </div>

          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.featureIcon}>🏗️</div>
              <h4 className={styles.featureTitle}>{t('development.title')}</h4>
              <p className={styles.featureText}>{t('development.text')}</p>
            </div>

            <div className={`${styles.featureCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.featureIcon}>🎨</div>
              <h4 className={styles.featureTitle}>{t('culture.title')}</h4>
              <p className={styles.featureText}>{t('culture.text')}</p>
            </div>

            <div className={`${styles.featureCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.featureIcon}>🇸🇾</div>
              <h4 className={styles.featureTitle}>{t('prideInHomeland.title')}</h4>
              <p className={styles.featureText}>{t('prideInHomeland.text')}</p>
            </div>
          </div>
        </div>

        <div className={`${styles.madeWithLoveSection} ${isVisible ? styles.visible : styles.hidden}`}>
          <div className={styles.decorativeHeart}>🇸🇾</div>
          <div className={styles.decorativeHeart}>🏛️</div>
          <div className={styles.loveIcon}>💙</div>
          <h2 className={styles.loveTitle}>{t('inspiringHope.title')}</h2>
          <p className={styles.loveText}>
            {t('inspiringHope.text')}
          </p>

          <div className={styles.feedbackCard}>
            <h3 className={styles.feedbackTitle}>
              <span>🌟</span>
              <span>{t('visionForSyria.title')}</span>
            </h3>
            <p className={styles.feedbackText}>
              <strong>{t('visionForSyria.text')}</strong>
            </p>
          </div>

          <div className={styles.feedbackCard}>
            <div className={styles.featuresIcons}>
              <span>🏙️</span>
              <span>🏛️</span>
              <span>🌆</span>
            </div>
            <h3 className={styles.feedbackTitle}>{t('buildingTogether.title')}</h3>
            <p className={styles.feedbackText}>
              <strong>{t('buildingTogether.text')}</strong>
            </p>
          </div>

          <div className={styles.footerNote}>
            {t('footerNote')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

