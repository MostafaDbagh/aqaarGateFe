'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Vision.module.css';

const Vision = () => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('ourVision');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={styles.visionSection}>
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
          </div>

          <div className={styles.visionPointsGrid}>
            <div className={`${styles.visionPointCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.visionPointIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
              </div>
              <h3 className={styles.visionPointTitle}>{t('noCommentPoints.title')}</h3>
              <p className={styles.visionPointText}>
                {t('noCommentPoints.text')}
              </p>
            </div>

            <div className={`${styles.visionPointCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.visionPointIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 9h6v6H9z" />
                </svg>
              </div>
              <h3 className={styles.visionPointTitle}>{t('singleClearPrice.title')}</h3>
              <p className={styles.visionPointText}>
                {t('singleClearPrice.text')}
              </p>
            </div>

            <div className={`${styles.visionPointCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.visionPointIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className={styles.visionPointTitle}>{t('displaySyria.title')}</h3>
              <p className={styles.visionPointText}>
                {t('displaySyria.text')}
              </p>
            </div>
          </div>

          <div className={`${styles.visionStatement} ${isVisible ? styles.visible : styles.hidden}`}>
            <h2 className={styles.visionStatementTitle}>{t('browseListings.title')}</h2>
            <p className={styles.visionStatementText}>
              {t('browseListings.text')}
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.featureIcon}>✨</div>
              <h4 className={styles.featureTitle}>{t('simpleEasy.title')}</h4>
              <p className={styles.featureText}>{t('simpleEasy.text')}</p>
            </div>

            <div className={`${styles.featureCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.featureIcon}>🔍</div>
              <h4 className={styles.featureTitle}>{t('manyFilters.title')}</h4>
              <p className={styles.featureText}>{t('manyFilters.text')}</p>
            </div>

            <div className={`${styles.featureCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.featureIcon}>🔒</div>
              <h4 className={styles.featureTitle}>{t('privacySearch.title')}</h4>
              <p className={styles.featureText}>{t('privacySearch.text')}</p>
            </div>
          </div>
        </div>

        <div className={`${styles.madeWithLoveSection} ${isVisible ? styles.visible : styles.hidden}`}>
          <div className={styles.decorativeHeart}>❤️</div>
          <div className={styles.decorativeHeart}>💝</div>
          <div className={styles.loveIcon}>❤️</div>
          <h2 className={styles.loveTitle}>{t('madeWithLove.title')}</h2>
          <p className={styles.loveText}>
            {t('madeWithLove.text')}
          </p>

          <div className={styles.feedbackCard}>
            <h3 className={styles.feedbackTitle}>
              <span>💬</span>
              <span>{t('feedbackMatters.title')}</span>
            </h3>
            <p className={styles.feedbackText}>
              <strong>{t('feedbackMatters.text')}</strong>
            </p>
          </div>

          <div className={styles.feedbackCard}>
            <div className={styles.featuresIcons}>
              <span>🚀</span>
              <span>✨</span>
              <span>🎯</span>
            </div>
            <h3 className={styles.feedbackTitle}>{t('featuresComingSoon.title')}</h3>
            <p className={styles.feedbackText}>
              <strong>{t('featuresComingSoon.text')}</strong>
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

export default Vision;
