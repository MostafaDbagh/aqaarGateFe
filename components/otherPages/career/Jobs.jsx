"use client";
import React from "react";
import { useTranslations } from 'next-intl';

export default function Jobs() {
  const t = useTranslations('career.jobs');
  // Toggle this to show/hide job listings
  const showJobListings = false; // Set to true when you have jobs to display

  return (
    <section className="section-career tf-spacing-1">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            {/* Conditional rendering for header and content */}
            {showJobListings ? (
              <>
                <div className="heading-section text-center mb-48">
                  <h2
                    className="title wow animate__fadeInUp animate__animated"
                    data-wow-duration="1s"
                    data-wow-delay="0s"
                  >
                    {t('title')}
                  </h2>
                  <p
                    className="text-1 wow animate__fadeInUp animate__animated"
                    data-wow-duration="1s"
                    data-wow-delay="0s"
                  >
                    {t('subtitle')}
                  </p>
                </div>
                <div className="tf-grid-layout-2 mb-48">
                  {careerData.map((item, index) => (
                    <div
                      key={index}
                      className={`career-item wow animate__${item.animation} animate__animated`}
                      data-wow-duration="1s"
                      data-wow-delay="0s"
                    >
                      <div className="content">
                        <h5 className="lh-28 name">{item.title}</h5>
                        <ul className="list-info">
                          <li className="text-4">
                            <i className="icon-bag" />
                            {t('department')}: {item.department}
                          </li>
                          <li className="text-4">
                            <i className="icon-location" />
                            {t('location')}: {item.location}
                          </li>
                          <li className="text-4">
                            <i className="icon-money" />
                            <span className="fw-7 text-color-primary">
                              {item.salary}
                            </span>
                            {t('month')}
                          </li>
                        </ul>
                      </div>
                      <a href="#" className="tf-btn style-border pd-10">
                        {t('applyNow')}
                      </a>
                    </div>
                  ))}
                </div>
                <a href="#" className="tf-btn bg-color-primary fw-7 pd-16 mx-auto">
                  {t('loadMore')}
                </a>
              </>
            ) : (
              /* Career page placeholder with same design as original header */
              <div className="heading-section text-center mb-48">
                <h2
                  className="title wow animate__fadeInUp animate__animated"
                  data-wow-duration="1s"
                  data-wow-delay="0s"
                >
                  {t('joinTeam.title')}
                </h2>
                <p
                  className="text-1 wow animate__fadeInUp animate__animated"
                  data-wow-duration="1s"
                  data-wow-delay="0s"
                >
                  {t('joinTeam.subtitle')}
                </p>
                
                {/* Enhanced message with icons and styling */}
                <div className="mt-5">
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <div className="career-info-box" style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '40px',
                        border: '1px solid #e9ecef'
                      }}>
                        <div className="mb-4">
                          <i 
                            className="icon-bag" 
                            style={{ 
                              fontSize: '48px', 
                              color: '#ff6b35',
                              marginBottom: '20px',
                              display: 'block'
                            }} 
                          />
                        </div>
                        <h4 
                          className="mb-3"
                          style={{ 
                            color: '#333',
                            fontSize: '24px',
                            fontWeight: '600'
                          }}
                        >
                          {t('joinTeam.noOpenPositions')}
                        </h4>
                        <p 
                          className="mb-4"
                          style={{ 
                            fontSize: '16px',
                            color: '#666',
                            lineHeight: '1.6'
                          }}
                        >
                          {t('joinTeam.description')}
                        </p>
                        <div 
                          className="mt-4"
                          style={{ 
                            fontSize: '14px',
                            color: '#999'
                          }}
                        >
                          <i className="icon-mail me-2" />
                          {t('joinTeam.wantToKnow')}{' '}
                          <a href="/contact" className="text-color-primary ms-1">
                            {t('joinTeam.getInTouch')}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
