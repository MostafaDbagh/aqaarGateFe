"use client";
import React, { useState, useEffect } from "react";
import LocationLoader from "@/components/common/LocationLoader";

export default function Blogs2() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for blog data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <LocationLoader />
      </div>
    );
  }

  return (
    <section className="section-blog-grid">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            {/* Coming Soon Message */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              textAlign: 'center',
              padding: 'clamp(40px, 8vw, 60px) clamp(16px, 4vw, 20px)'
            }}>
              {/* Icon */}
              <div style={{
                width: 'clamp(80px, 15vw, 120px)',
                height: 'clamp(80px, 15vw, 120px)',
                backgroundColor: '#f3f4f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
                border: '3px solid #e5e7eb'
              }}>
                <svg width="clamp(40px, 8vw, 60px)" height="clamp(40px, 8vw, 60px)" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="#3b82f6"/>
                  <path d="M19 15L20.09 18.26L24 19L20.09 19.74L19 23L17.91 19.74L14 19L17.91 18.26L19 15Z" fill="#f59e0b"/>
                  <path d="M5 15L6.09 18.26L10 19L6.09 19.74L5 23L3.91 19.74L0 19L3.91 18.26L5 15Z" fill="#10b981"/>
                  </svg>
              </div>

              {/* Main Title */}
              <h1 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '16px',
                lineHeight: '1.2',
                padding: '0 20px'
              }}>
                Blogs Coming Soon
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                color: '#6b7280',
                marginBottom: '32px',
                maxWidth: '600px',
                lineHeight: '1.6',
                padding: '0 20px'
              }}>
                We're working hard to bring you amazing content about real estate, property tips, and market insights. Stay tuned for exciting articles coming your way!
              </p>

              {/* Features List */}
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon feature-icon-blue">
                    <svg className="feature-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              </div>
                  <span className="feature-text">Real Estate Tips</span>
            </div>

                <div className="feature-card">
                  <div className="feature-icon feature-icon-green">
                    <svg className="feature-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                      </div>
                  <span className="feature-text">Market Insights</span>
                    </div>

                <div className="feature-card">
                  <div className="feature-icon feature-icon-orange">
                    <svg className="feature-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                  <span className="feature-text">Investment Guide</span>
                  </div>
                </div>

          
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
          max-width: 800px;
          width: 100%;
          padding: 0 20px;
        }

        @media (max-width: 640px) {
          .features-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 0 16px;
          }
        }

        .feature-card {
          display: flex;
          align-items: center;
          padding: clamp(12px, 2vw, 16px);
          background-color: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          gap: 12px;
        }

        .feature-icon {
          width: clamp(36px, 6vw, 40px);
          height: clamp(36px, 6vw, 40px);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-svg {
          width: clamp(18px, 3vw, 20px);
          height: clamp(18px, 3vw, 20px);
        }

        .feature-icon-blue {
          background-color: #3b82f6;
        }

        .feature-icon-green {
          background-color: #10b981;
        }

        .feature-icon-orange {
          background-color: #f59e0b;
        }

        .feature-text {
          color: #374151;
          font-weight: 500;
          font-size: clamp(14px, 2vw, 16px);
        }

        @media (max-width: 480px) {
          .feature-card {
            flex-direction: column;
            text-align: center;
          }

          .feature-icon {
            margin-bottom: 8px;
          }
        }

        @media (max-width: 768px) {
          .feature-card {
            padding: 12px;
          }
        }
      `}</style>
    </section>
  );
}