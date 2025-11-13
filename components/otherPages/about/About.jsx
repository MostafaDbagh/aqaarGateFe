'use client';

import React, { useEffect, useState } from 'react';
import styles from './About.module.css';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

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
              <span>About Us</span>
            </div>
            <h1 className={styles.heroTitle}>A Group of Ambitious Young Syrians</h1>
            <div className={styles.heroDivider} />
            <p className={styles.heroSubtitle}>
              Showcasing the beauty, diversity, and real estate potential of Syria
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
              <h3 className={styles.visionPointTitle}>Modern Architecture</h3>
              <p className={styles.visionPointText}>
                Blending contemporary design with Syria's rich architectural heritage to showcase properties that stand the test of time.
              </p>
            </div>

            <div className={`${styles.visionPointCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.visionPointIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className={styles.visionPointTitle}>Ancient Heritage</h3>
              <p className={styles.visionPointText}>
                Preserving and celebrating Syria's historical legacy while building a bright future for real estate development.
              </p>
            </div>

            <div className={`${styles.visionPointCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.visionPointIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className={styles.visionPointTitle}>Bright Future</h3>
              <p className={styles.visionPointText}>
                Symbolizing progress, unity, and hope as we work together to rebuild and showcase Syria's real estate potential.
              </p>
            </div>
          </div>

          <div className={`${styles.visionStatement} ${isVisible ? styles.visible : styles.hidden}`}>
            <h2 className={styles.visionStatementTitle}>Showcasing Syria's Vibrant Cities</h2>
            <p className={styles.visionStatementText}>
              We highlight Syria's most beautiful and diverse cities — from the ancient streets of Damascus and Aleppo 
              to the coastal charm of Latakia and Tartous, and the historical significance of Homs. Each city represents 
              a unique blend of culture, heritage, and modern development, creating a tapestry of real estate opportunities 
              that reflect the true spirit of Syria.
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
                <h4 className={styles.cityName}>{city.name}</h4>
              </div>
            ))}
          </div>

          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.featureIcon}>🏗️</div>
              <h4 className={styles.featureTitle}>Development</h4>
              <p className={styles.featureText}>Promoting sustainable development and growth across Syria's real estate landscape</p>
            </div>

            <div className={`${styles.featureCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.featureIcon}>🎨</div>
              <h4 className={styles.featureTitle}>Culture</h4>
              <p className={styles.featureText}>Celebrating Syria's rich cultural heritage and architectural diversity</p>
            </div>

            <div className={`${styles.featureCard} ${isVisible ? styles.visible : styles.hidden}`}>
              <div className={styles.featureIcon}>🇸🇾</div>
              <h4 className={styles.featureTitle}>Pride in Homeland</h4>
              <p className={styles.featureText}>Demonstrating our deep love and pride for Syria through our work</p>
            </div>
          </div>
        </div>

        <div className={`${styles.madeWithLoveSection} ${isVisible ? styles.visible : styles.hidden}`}>
          <div className={styles.decorativeHeart}>🇸🇾</div>
          <div className={styles.decorativeHeart}>🏛️</div>
          <div className={styles.loveIcon}>💙</div>
          <h2 className={styles.loveTitle}>Inspiring Hope & Unity</h2>
          <p className={styles.loveText}>
            Our mission is to inspire hope and unity through the lens of real estate. We believe that by showcasing 
            Syria's beauty, diversity, and potential, we can contribute to a brighter future. With warm lighting, 
            clean urban visuals, and a professional, elegant approach, we emphasize development, culture, and pride 
            in our homeland.
          </p>

          <div className={styles.feedbackCard}>
            <h3 className={styles.feedbackTitle}>
              <span>🌟</span>
              <span>Our Vision for Syria</span>
            </h3>
            <p className={styles.feedbackText}>
              <strong>We see Syria not just as a place, but as a promise.</strong> A promise of restoration, growth, 
              and prosperity. Through our platform, we aim to connect people with properties that reflect Syria's 
              enduring spirit — combining ancient wisdom with modern innovation, creating spaces where history meets 
              the future.
            </p>
          </div>

          <div className={styles.feedbackCard}>
            <div className={styles.featuresIcons}>
              <span>🏙️</span>
              <span>🏛️</span>
              <span>🌆</span>
            </div>
            <h3 className={styles.feedbackTitle}>Building Together</h3>
            <p className={styles.feedbackText}>
              <strong>We are a team of passionate young Syrians</strong> dedicated to showcasing the real estate 
              potential of our homeland. Every property we feature tells a story — of resilience, beauty, and 
              the unwavering spirit of Syria. Together, we're building a platform that honors our past while 
              embracing our future.
            </p>
          </div>

          <div className={styles.footerNote}>
            From Damascus to Aleppo, from Latakia to Tartous — we're here to showcase Syria's real estate potential to the world.
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

