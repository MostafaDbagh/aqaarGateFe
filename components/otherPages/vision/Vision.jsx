'use client';

import React, { useEffect, useState } from 'react';
import styles from './Vision.module.css';

const Vision = () => {
  const [isVisible, setIsVisible] = useState(false);

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
              <span>Our Vision</span>
            </div>
            <h1 className={styles.heroTitle}>We Want to Change the Game</h1>
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
              <h3 className={styles.visionPointTitle}>No Comment Points for Prices</h3>
              <p className={styles.visionPointText}>
                No need to leave comments or use points to get prices. Everything is transparent and clear from the start.
              </p>
            </div>

            <div className={`${styles.visionPointCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.visionPointIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 9h6v6H9z" />
                </svg>
              </div>
              <h3 className={styles.visionPointTitle}>Single Clear Price</h3>
              <p className={styles.visionPointText}>
                No multi-price based on your country, work, or anything else. One clear price for everyone, everywhere.
              </p>
            </div>

            <div className={`${styles.visionPointCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.visionPointIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className={styles.visionPointTitle}>Display Syria to the World</h3>
              <p className={styles.visionPointText}>
                Show Syria's beautiful properties to the world with modern standards like Europe and the Gulf.
              </p>
            </div>
          </div>

          <div className={`${styles.visionStatement} ${isVisible ? styles.visible : styles.hidden}`}>
            <h2 className={styles.visionStatementTitle}>Let Syrians and All People Browse Beautiful Listings</h2>
            <p className={styles.visionStatementText}>
              We want to let Syrians and people from all around the world browse and see how beautiful our property listings are. 
              Search your way with many filters applied to give you the best experience.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.featureIcon}>✨</div>
              <h4 className={styles.featureTitle}>Simple & Easy</h4>
              <p className={styles.featureText}>Make things simple and easy for everyone to use</p>
            </div>

            <div className={`${styles.featureCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.featureIcon}>🔍</div>
              <h4 className={styles.featureTitle}>Many Filters</h4>
              <p className={styles.featureText}>Search with many filters applied up to users' preferences</p>
            </div>

            <div className={`${styles.featureCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.featureIcon}>🔒</div>
              <h4 className={styles.featureTitle}>Privacy Search</h4>
              <p className={styles.featureText}>No one from your Facebook relatives will observe you searching for your dream property</p>
            </div>
          </div>
        </div>

        <div className={`${styles.madeWithLoveSection} ${isVisible ? styles.visible : styles.hidden}`}>
          <div className={styles.decorativeHeart}>❤️</div>
          <div className={styles.decorativeHeart}>💝</div>
          <div className={styles.loveIcon}>❤️</div>
          <h2 className={styles.loveTitle}>Made with Love</h2>
          <p className={styles.loveText}>
            We want you to know that this app will keep having modifications and improvements. 
            We are committed to continuously enhancing our user experience to give you the best possible experience.
          </p>

          <div className={styles.feedbackCard}>
            <h3 className={styles.feedbackTitle}>
              <span>💬</span>
              <span>Your Feedback Matters</span>
            </h3>
            <p className={styles.feedbackText}>
              <strong>Positive and negative comments are welcome!</strong> We value your input and use it to make SyProperty better every day. 
              Your feedback helps us understand what works and what needs improvement, ensuring we deliver the best experience for everyone.
            </p>
          </div>

          <div className={styles.feedbackCard}>
            <div className={styles.featuresIcons}>
              <span>🚀</span>
              <span>✨</span>
              <span>🎯</span>
            </div>
            <h3 className={styles.feedbackTitle}>Many Features Coming Soon</h3>
            <p className={styles.feedbackText}>
              <strong>Many, many features will come soon!</strong> We are constantly working on new enhancements, tools, and capabilities to make your property search and browsing experience even better. Stay tuned for exciting updates!
            </p>
          </div>

          <div className={styles.footerNote}>
            We're here to serve you, and we appreciate every piece of feedback that helps us grow.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
