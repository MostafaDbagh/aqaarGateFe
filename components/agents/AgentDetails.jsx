"use client";
import React, { useState } from "react";
import { useTranslations } from 'next-intl';
import Listings from "./Listings";
import Link from "next/link";
import Image from "next/image";
import { useAgent } from "@/apis/hooks";
import LocationLoader from "../common/LocationLoader";
import styles from "./AgentDetails.module.css";

export default function AgentDetails({ agentId }) {
  const t = useTranslations('agentDetails');
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  
  // Fetch agent data from API
  const { data: agentData, isLoading, isError, error } = useAgent(agentId);
  // API returns { success: true, data: agent }, extract the agent object
  const agent = agentData?.data || agentData;

  if (isLoading) {
    return (
      <section className="section-agents-details tf-spacing-4">
        <div className="tf-container">
          <div className="row">
            <div className="col-12 text-center py-5">
              <LocationLoader 
                size="large" 
                message={t('loadingProfile')}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !agent) {
    return (
      <section className="section-agents-details tf-spacing-4">
        <div className="tf-container">
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="alert alert-danger">
                <h4>{t('agentNotFound')}</h4>
                <p>{error?.message || t('agentNotFoundMessage')}</p>
                <Link href="/agents" className="btn btn-primary">
                  {t('backToAgents')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="section-agents-details tf-spacing-4">
      <div className="tf-container">
        <div className="row">
          <div className="col-lg-8">
            <div className={`agent-details hover-img effec-overlay ${styles.agentDetailsContainer}`}>
              {/* First Row: Image and Info */}
              <div className={styles.firstRow}>
                <div className={`image-wrap ${styles.imageWrap}`}>
                  <Link href={`/agents-details/${agent._id}`}>
                    <Image
                      alt={agent.fullName || t('agent')}
                      width={400}
                      height={400}
                      src={agent.avatar || "/images/section/agent-details.jpg"}
                      className={styles.agentImage}
                    />
                  </Link>
                </div>
                <div className={`content-inner ${styles.contentInner}`}>
                  <div className="author">
                    <h4 className="name">
                      <Link href={`/agents-details/${agent._id}`}>
                        {agent.fullName || t('agentName')}
                      </Link>
                    </h4>
                    <p className="font-poppins">
                      {agent.position || agent.job || t('realEstateAgent')} at{" "}
                      <a href="#" className="fw-7">
                        {agent.companyName || "AqaarGate Real Estate"}
                      </a>
                    </p>
                  </div>
                  <ul className="info">
                    {agent.phone && (
                    <li>
                      <svg width={16}
                        height={17}
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                       aria-hidden="true">
                        <path
                          d="M9.5 7V4M9.5 7H12.5M9.5 7L13.5 3M11.5 15C5.97733 15 1.5 10.5227 1.5 5V3.5C1.5 3.10218 1.65804 2.72064 1.93934 2.43934C2.22064 2.15804 2.60218 2 3 2H3.91467C4.25867 2 4.55867 2.234 4.642 2.568L5.37933 5.51667C5.45267 5.81 5.34333 6.118 5.10133 6.29867L4.23933 6.94533C4.11595 7.03465 4.02467 7.16138 3.97903 7.3067C3.93339 7.45202 3.93584 7.60818 3.986 7.752C4.38725 8.84341 5.02094 9.83456 5.84319 10.6568C6.66544 11.4791 7.65659 12.1128 8.748 12.514C9.042 12.622 9.36667 12.5113 9.55467 12.2607L10.2013 11.3987C10.2898 11.2805 10.4113 11.1911 10.5504 11.1416C10.6895 11.0922 10.8401 11.0849 10.9833 11.1207L13.932 11.858C14.2653 11.9413 14.5 12.2413 14.5 12.5853V13.5C14.5 13.8978 14.342 14.2794 14.0607 14.5607C13.7794 14.842 13.3978 15 13 15H11.5Z"
                          stroke="#8E8E93"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                        <a href={`tel:${agent.phone}`} className="font-mulish fw-7">
                          {agent.phone}
                        </a>
                    </li>
                    )}
                    {agent.email && (
                    <li>
                      <svg width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                       aria-hidden="true">
                        <path
                          d="M14.5 4.5V11.5C14.5 11.8978 14.342 12.2794 14.0607 12.5607C13.7794 12.842 13.3978 13 13 13H3C2.60218 13 2.22064 12.842 1.93934 12.5607C1.65804 12.2794 1.5 11.8978 1.5 11.5V4.5M14.5 4.5C14.5 4.10218 14.342 3.72064 14.0607 3.43934C13.7794 3.15804 13.3978 3 13 3H3C2.60218 3 2.22064 3.15804 1.93934 3.43934C1.65804 3.72064 1.5 4.10218 1.5 4.5M14.5 4.5V4.662C14.5 4.9181 14.4345 5.16994 14.3096 5.39353C14.1848 5.61712 14.0047 5.80502 13.7867 5.93933L8.78667 9.016C8.55014 9.16169 8.2778 9.23883 8 9.23883C7.7222 9.23883 7.44986 9.16169 7.21333 9.016L2.21333 5.94C1.99528 5.80569 1.81525 5.61779 1.69038 5.3942C1.56551 5.1706 1.49997 4.91876 1.5 4.66267V4.5"
                          stroke="#8E8E93"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                        <a href={`mailto:${agent.email}`}>{agent.email}</a>
                    </li>
                    )}
                    {agent.location && (
                    <li>
                      <svg width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                       aria-hidden="true">
                        <path
                          d="M10 7C10 7.53043 9.78929 8.03914 9.41421 8.41421C9.03914 8.78929 8.53043 9 8 9C7.46957 9 6.96086 8.78929 6.58579 8.41421C6.21071 8.03914 6 7.53043 6 7C6 6.46957 6.21071 5.96086 6.58579 5.58579C6.96086 5.21071 7.46957 5 8 5C8.53043 5 9.03914 5.21071 9.41421 5.58579C9.78929 5.96086 10 6.46957 10 7Z"
                          stroke="#8E8E93"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13 7C13 11.7613 8 14.5 8 14.5C8 14.5 3 11.7613 3 7C3 5.67392 3.52678 4.40215 4.46447 3.46447C5.40215 2.52678 6.67392 2 8 2C9.32608 2 10.5979 2.52678 11.5355 3.46447C12.4732 4.40215 13 5.67392 13 7Z"
                          stroke="#8E8E93"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                        {agent.location}
                    </li>
                    )}
                  </ul>
                  
                  {/* Follow Me Section */}
                  <div className={styles.followMeSection}>
                    <h6 className={styles.followMeTitle}>{t('followMe')}</h6>
                    <ul className={`tf-social style-3 ${styles.socialMedia}`}>
                      <li>
                        <a 
                          href={agent.facebook || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title={agent.facebook ? "Facebook" : "Facebook (Coming Soon)"}
                        >
                          <i className="icon-fb" />
                        </a>
                      </li>
                      <li>
                        <a 
                          href={agent.twitter || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title={agent.twitter ? "Twitter" : "Twitter (Coming Soon)"}
                        >
                          <i className="icon-X" />
                        </a>
                      </li>
                      <li>
                        <a 
                          href={agent.linkedin || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title={agent.linkedin ? "LinkedIn" : "LinkedIn (Coming Soon)"}
                        >
                          <i className="icon-linked" />
                        </a>
                      </li>
                      <li>
                        <a href="#" title="Instagram (Coming Soon)">
                          <i className="icon-ins" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Second Row: Description and See More Button */}
              <div className={`${styles.descriptionRow} agent-content-section`}>
                <div className="content">
                  <h6 className="title">{agent.fullName ? t('aboutAgent', { name: agent.fullName }) : t('aboutThisAgent')}</h6>
                  <p className="text-1">
                    {agent.description || 
                      "Experienced real estate professional dedicated to helping clients achieve their property goals. With a deep understanding of the local market and a commitment to exceptional service, I'm here to guide you through every step of your real estate journey."
                    }
                  </p>
                  
                  {/* Additional Details Section */}
                  {showMoreDetails && (
                    <div className={`additional-details ${styles.additionalDetails}`}>
                    {/* Professional Details */}
                    <div className={`details-section ${styles.detailsSection}`}>
                      <h6 className={`title ${styles.sectionTitle}`}>{t('professionalDetails')}</h6>
                      
                      <div className={`details-grid ${styles.detailsGrid}`}>
                        <div className={`detail-item ${styles.detailItem}`}>
                          <strong className={styles.detailLabel}>{t('company')}:</strong>
                          <span className={styles.detailValue}>
                            {agent.companyName || "AqaarGate Real Estate"}
                          </span>
                        </div>
                        
                        <div className={`detail-item ${styles.detailItem}`}>
                          <strong className={styles.detailLabel}>{t('position')}:</strong>
                          <span className={styles.detailValue}>
                            {agent.position || agent.job || t('realEstateAgent')}
                          </span>
                        </div>
                        
                        {agent.officeNumber && (
                          <div className={`detail-item ${styles.detailItem}`}>
                            <strong className={styles.detailLabel}>{t('officePhone')}:</strong>
                            <span className={styles.detailValue}>
                              {agent.officeNumber}
                            </span>
                          </div>
                        )}
                        
                        {agent.officeAddress && (
                          <div className={`detail-item ${styles.detailItem}`}>
                            <strong className={styles.detailLabel}>{t('officeAddress')}:</strong>
                            <span className={styles.detailValue}>
                              {agent.officeAddress}
                            </span>
                          </div>
                        )}
                        
                        <div className={`detail-item ${styles.detailItem}`}>
                          <strong className={styles.detailLabel}>{t('memberSince')}:</strong>
                          <span className={styles.detailValue}>
                            {new Date(agent.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })}
                          </span>
                        </div>
                        
                        <div className={`detail-item ${styles.detailItem}`}>
                          <strong className={styles.detailLabel}>{t('specialization')}:</strong>
                          <span className={styles.detailValue}>
                            {t('residentialCommercial')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Services & Expertise */}
                    <div className={`services-section ${styles.servicesSection}`}>
                      <h6 className={`title ${styles.sectionTitle}`}>{t('servicesExpertise')}</h6>
                      
                      <div className={`services-grid ${styles.servicesGrid}`}>
                        <div className={`service-item ${styles.serviceItem}`}>
                          <div className={styles.serviceIcon}>🏠</div>
                          <strong className={styles.serviceTitle}>{t('propertySales')}</strong>
                          <span className={styles.serviceDescription}>{t('residentialCommercialDesc')}</span>
                        </div>
                        
                        <div className={`service-item ${styles.serviceItem}`}>
                          <div className={styles.serviceIcon}>🔑</div>
                          <strong className={styles.serviceTitle}>{t('propertyRentals')}</strong>
                          <span className={styles.serviceDescription}>{t('longShortTerm')}</span>
                        </div>
                        
                        <div className={`service-item ${styles.serviceItem}`}>
                          <div className={styles.serviceIcon}>📊</div>
                          <strong className={styles.serviceTitle}>{t('marketAnalysis')}</strong>
                          <span className={styles.serviceDescription}>{t('priceTrendReports')}</span>
                        </div>
                        
                        <div className={`service-item ${styles.serviceItem}`}>
                          <div className={styles.serviceIcon}>🤝</div>
                          <strong className={styles.serviceTitle}>{t('negotiation')}</strong>
                          <span className={styles.serviceDescription}>{t('expertDealMaking')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Professional Summary */}
                    <div className={`professional-summary ${styles.professionalSummary}`}>
                      <h6 className={`title ${styles.sectionTitle}`}>{t('professionalSummary')}</h6>
                      <p className={`text-1 ${styles.summaryText}`}>
                        {agent.fullName || t('agent')} brings extensive experience in real estate transactions, 
                        market analysis, and client relations. With a proven track record of successful property 
                        sales and satisfied clients, {agent.fullName?.split(' ')[0] || t('agent')} are committed to 
                        providing personalized service and expert guidance throughout the buying and selling process.
                      </p>
                      
                      <div className={`achievements ${styles.achievements}`}>
                        <div className={`achievement-item ${styles.achievementItem}`}>
                          <div className={styles.achievementNumber}>50+</div>
                          <span className={styles.achievementLabel}>{t('propertiesSold')}</span>
                        </div>
                        
                        <div className={`achievement-item ${styles.achievementItem}`}>
                          <div className={styles.achievementNumber}>5+</div>
                          <span className={styles.achievementLabel}>{t('yearsExperience')}</span>
                        </div>
                        
                        <div className={`achievement-item ${styles.achievementItem}`}>
                          <div className={styles.achievementNumber}>98%</div>
                          <span className={styles.achievementLabel}>{t('clientSatisfaction')}</span>
                        </div>
                        
                        <div className={`achievement-item ${styles.achievementItem}`}>
                          <div className={styles.achievementNumber}>24/7</div>
                          <span className={styles.achievementLabel}>{t('availability')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className={`contact-info ${styles.contactInfo}`}>
                      <h6 className={`title ${styles.sectionTitle}`}>{t('contactInformation')}</h6>
                      
                      <div className={`contact-grid ${styles.contactGrid}`}>
                        <div className={`contact-item ${styles.contactItem}`}>
                          <div className={styles.contactIcon}>📧</div>
                          <div>
                            <strong className={styles.contactLabel}>{t('emailLabel')}</strong>
                            <span className={styles.contactValue}>{agent.email || 'contact@property.com'}</span>
                          </div>
                        </div>
                        
                        {agent.phone && (
                          <div className={`contact-item ${styles.contactItem}`}>
                            <div className={styles.contactIcon}>📞</div>
                            <div>
                              <strong className={styles.contactLabel}>{t('phone')}</strong>
                              <span className={styles.contactValue}>{agent.phone}</span>
                            </div>
                          </div>
                        )}
                        
                        {agent.location && (
                          <div className={`contact-item ${styles.contactItem}`}>
                            <div className={styles.contactIcon}>📍</div>
                            <div>
                              <strong className={styles.contactLabel}>{t('location')}</strong>
                              <span className={styles.contactValue}>{agent.location}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className={`contact-item ${styles.contactItem}`}>
                          <div className={styles.contactIcon}>⏰</div>
                          <div>
                            <strong className={styles.contactLabel}>{t('responseTime')}</strong>
                            <span className={styles.contactValue}>{t('within2Hours')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                  
                  <button 
                    onClick={() => setShowMoreDetails(!showMoreDetails)}
                    className={`tf-btn-link ${styles.toggleButton}`}
                  >
                    <span>{showMoreDetails ? t('showLess') : t('showMore')}</span>
                    <svg width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={showMoreDetails ? styles.chevronIconRotated : styles.chevronIcon}
                     aria-hidden="true">
                      <g clipPath="url(#clip0_2450_13860)">
                        <path
                          d="M10.0013 18.3334C14.6037 18.3334 18.3346 14.6024 18.3346 10C18.3346 5.39765 14.6037 1.66669 10.0013 1.66669C5.39893 1.66669 1.66797 5.39765 1.66797 10C1.66797 14.6024 5.39893 18.3334 10.0013 18.3334Z"
                          stroke="#F1913D"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66797 10H13.3346"
                          stroke="#F1913D"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 13.3334L13.3333 10L10 6.66669"
                          stroke="#F1913D"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2450_13860">
                          <rect width={20} height={20} fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="tf-sidebar">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="form-contact-agent style-2 mb-30"
              >
                <h4 className="heading-title mb-30">{t('contactMe')}</h4>
                <fieldset>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t('yourName')}
                    name="name"
                    id="name"
                    required
                  />
                </fieldset>
                <fieldset>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t('email')}
                    name="email"
                    id="email-contact"
                    required
                  />
                </fieldset>
                <fieldset className="phone">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t('yourPhoneNumber')}
                    name="phone"
                    id="phone"
                    required
                  />
                </fieldset>
                <fieldset>
                  <textarea
                    name="message"
                    cols={30}
                    rows={10}
                    placeholder={t('message')}
                    id="message"
                    required
                    defaultValue={""}
                  />
                </fieldset>
                <div className="wrap-btn">
                  <a href={`mailto:${agent.email || 'contact@aqaargate.com'}`} className="tf-btn bg-color-primary w-full">
                    <svg width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                     aria-hidden="true">
                      <path
                        d="M18.125 5.625V14.375C18.125 14.8723 17.9275 15.3492 17.5758 15.7008C17.2242 16.0525 16.7473 16.25 16.25 16.25H3.75C3.25272 16.25 2.77581 16.0525 2.42417 15.7008C2.07254 15.3492 1.875 14.8723 1.875 14.375V5.625M18.125 5.625C18.125 5.12772 17.9275 4.65081 17.5758 4.29917C17.2242 3.94754 16.7473 3.75 16.25 3.75H3.75C3.25272 3.75 2.77581 3.94754 2.42417 4.29917C2.07254 4.65081 1.875 5.12772 1.875 5.625M18.125 5.625V5.8275C18.125 6.14762 18.0431 6.46242 17.887 6.74191C17.7309 7.0214 17.5059 7.25628 17.2333 7.42417L10.9833 11.27C10.6877 11.4521 10.3472 11.5485 10 11.5485C9.65275 11.5485 9.31233 11.4521 9.01667 11.27L2.76667 7.425C2.4941 7.25711 2.26906 7.02224 2.11297 6.74275C1.95689 6.46325 1.87496 6.14845 1.875 5.82833V5.625"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t('sendMessage')}
                  </a>
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="tf-btn style-border pd-24">
                    <svg width={21}
                      height={20}
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                     aria-hidden="true">
                      <path
                        d="M12.375 8.125V4.375M12.375 8.125H16.125M12.375 8.125L17.375 3.125M14.875 18.125C7.97167 18.125 2.375 12.5283 2.375 5.625V3.75C2.375 3.25272 2.57254 2.77581 2.92417 2.42417C3.27581 2.07254 3.75272 1.875 4.25 1.875H5.39333C5.82333 1.875 6.19833 2.1675 6.3025 2.585L7.22417 6.27083C7.31583 6.6375 7.17917 7.0225 6.87667 7.24833L5.79917 8.05667C5.64494 8.16831 5.53083 8.32672 5.47379 8.50837C5.41674 8.69002 5.4198 8.88523 5.4825 9.065C5.98406 10.4293 6.77618 11.6682 7.80398 12.696C8.83179 13.7238 10.0707 14.5159 11.435 15.0175C11.8025 15.1525 12.2083 15.0142 12.4433 14.7008L13.2517 13.6233C13.3623 13.4756 13.5141 13.3639 13.688 13.3021C13.8619 13.2402 14.0501 13.2311 14.2292 13.2758L17.915 14.1975C18.3317 14.3017 18.625 14.6767 18.625 15.1067V16.25C18.625 16.7473 18.4275 17.2242 18.0758 17.5758C17.7242 17.9275 17.2473 18.125 16.75 18.125H14.875Z"
                        stroke="#F1913D"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t('call')}
                  </a>
                  )}
                </div>
              </form>
        
            </div>
          </div>
        </div>
        
        {/* Listings - Full Width */}
        <div className="row">
          <div className="col-12">
            <Listings agentId={agentId} />
          </div>
        </div>
      </div>
    </section>
  );
}
