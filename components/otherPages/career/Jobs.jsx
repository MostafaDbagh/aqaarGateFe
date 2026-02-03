"use client";
import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { careerAPI } from '@/apis';

export default function Jobs({ initialCareers = [] }) {
  const t = useTranslations('career.jobs');
  const locale = useLocale();
  const [careers, setCareers] = useState(initialCareers);
  const [isLoading, setIsLoading] = useState(initialCareers.length === 0);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (initialCareers.length > 0) {
      setCareers(initialCareers);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    const fetchCareers = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const res = await careerAPI.getAllCareers({ limit: 50 });
        if (cancelled) return;
        const rawData = res?.data;
        const careersList = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.data)
            ? rawData.data
            : [];
        setCareers(careersList);
      } catch (err) {
        if (!cancelled) {
          setIsError(true);
          setCareers([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchCareers();
    return () => { cancelled = true; };
  }, [initialCareers.length]);

  const showJobListings = careers.length > 0;

  const getLocalized = (item, enKey, arKey) => {
    if (locale === 'ar' && item[arKey]) return item[arKey];
    return item[enKey] || item[arKey] || '';
  };

  if (isLoading) {
    return (
      <section className="section-career tf-spacing-1">
        <div className="tf-container">
          <div className="text-center py-5">
            <p className="text-muted">Loading careers...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="section-career tf-spacing-1">
        <div className="tf-container">
          <div className="text-center py-5">
            <p className="text-muted mb-3">Failed to load careers.</p>
            <button
              type="button"
              className="tf-btn style-border pd-10"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-career tf-spacing-1" style={{ minHeight: "200px", paddingBottom: "48px" }}>
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
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
                  {careers.map((item) => (
                      <div
                        key={item._id}
                        className={`career-item wow animate__fadeInUp animate__animated`}
                        data-wow-duration="1s"
                        data-wow-delay="0s"
                      >
                        <div className="content">
                          <h5 className="lh-28 name">{getLocalized(item, 'title', 'title_ar')}</h5>
                          <ul className="list-info">
                            <li className="text-4">
                              <i className="icon-bag" />
                              {t('department')}: {getLocalized(item, 'department', 'department_ar')}
                            </li>
                            <li className="text-4">
                              <i className="icon-location" />
                              {t('location')}: {getLocalized(item, 'location', 'location_ar')}
                            </li>
                            <li className="text-4">
                              <i className="icon-money" />
                              <span className="fw-7 text-color-primary">
                                {getLocalized(item, 'salary', 'salary_ar') || t('competitive') || 'Competitive'}
                              </span>
                              {item.salary || item.salary_ar ? ` ${t('month')}` : ''}
                            </li>
                          </ul>
                        </div>
                        <Link href="/contact" className="tf-btn style-border pd-10">
                          {t('applyNow')}
                        </Link>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              /* Career page placeholder - no open positions */
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
