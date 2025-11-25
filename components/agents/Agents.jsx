"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import DropdownSelect from "../common/DropdownSelect";
import { useAgents } from "@/apis/hooks";
import LocationLoader from "../common/LocationLoader";
import { CopyIcon, CheckIcon } from "@/components/icons";
import Toast from "../common/Toast";
import styles from "./Agents.module.css";

export default function Agents() {
  const t = useTranslations('agents');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState(t('allLocation'));
  const [sortBy, setSortBy] = useState(t('sortBy.default'));
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Fetch agents from API
  const { data: agentsData, isLoading, isError, error } = useAgents();
  // API returns array directly, not wrapped in data property
  const agents = Array.isArray(agentsData) ? agentsData : [];

  // Filter agents based on search and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = !searchTerm || 
      agent.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === t('allLocation') || 
      agent.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  // Sort agents
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case t('sortBy.newest'):
        return new Date(b.createdAt) - new Date(a.createdAt);
      case t('sortBy.oldest'):
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => {
      setToast({ isVisible: false, message: '', type: 'success' });
    }, 3000);
  };

  // Handle copy email
  const handleCopyEmail = async (email, agentId) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(agentId);
      showToast(t('emailCopied'));
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch (error) {
      showToast(t('emailCopyFailed'), 'error');
    }
  };

  if (isLoading) {
    return (
      <section className="section-agent">
        <div className="tf-container">
          <div className="row">
            <div className="col-12 text-center py-5">
              <LocationLoader 
                size="large" 
                message={t('loading')}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="section-agent">
        <div className="tf-container">
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="alert alert-danger">
                <h4>{t('error.title')}</h4>
                <p>{error?.message || t('error.message')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <style jsx>{`
        .agent-item {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .agent-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
        }
        
        .image-wrap {
          position: relative;
          height: 250px;
          overflow: hidden;
        }
        
        .image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        
        .property-img {
          object-fit: cover !important;
        }
        
        .agent-item:hover .image-wrap img {
          transform: scale(1.08);
        }
        
        .content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .author {
          text-align: center;
        }
        
        .author h5.name {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        
        .author h5.name a,
        .author h5.name .agent-name-link {
          color: #333 !important;
          text-decoration: none !important;
        }
        
        .author h5.name a:hover,
        .author h5.name a:focus,
        .author h5.name a:active,
        .author h5.name .agent-name-link:hover,
        .author h5.name .agent-name-link:focus,
        .author h5.name .agent-name-link:active {
          color: #333 !important;
          text-decoration: none !important;
        }
        
        .author h5.name a * {
          color: #333 !important;
        }
        
        .author .text-2 {
          color: #666;
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .author .text-3 {
          color: #888;
          font-size: 14px;
          margin-bottom: 6px;
        }
        
        .author .text-3 i {
          margin-right: 5px;
          color: #007bff;
        }
        
        .author .cities-tags {
          justify-content: center;
        }
        
        .cities-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        
        .city-tag {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          border: none;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .city-tag::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .city-tag:hover::before {
          left: 100%;
        }
        
        .city-tag:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .all-icons-section {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #f0f0f0;
        }
        
        .all-icons-section h6 {
          font-size: 14px;
          color: #666;
          margin-bottom: 12px;
          font-weight: 500;
        }
        
        .all-icons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }
        
        .btn-icon, .social-icon {
          width: 38px;
          height: 38px;
          background: #f8f9fa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 14px;
          position: relative;
        }
        
        .btn-icon:hover, .social-icon:hover {
          background: #ff6b35;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }
        
        .phone-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1000;
          margin-bottom: 8px;
        }
        
        .phone-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: #333;
        }
        
        .btn-icon:hover .phone-tooltip {
          opacity: 1;
          visibility: visible;
        }
        
        .tf-grid-layout-2 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          padding: 20px 0;
        }
        
        @media (max-width: 1200px) {
          .tf-grid-layout-2 {
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
          }
        }
        
        @media (max-width: 992px) {
          .tf-grid-layout-2 {
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
          }
        }
        
        @media (max-width: 768px) {
          .tf-grid-layout-2 {
            grid-template-columns: repeat(1, 1fr);
            gap: 20px;
          }
          
          .image-wrap {
            height: 250px;
          }
          
          .content {
            padding: 20px;
          }
        }
        
        /* Enhanced City Dropdown Styling */
        .city-dropdown .nice-select {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
          border: 2px solid #e1ecff;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .city-dropdown .nice-select:hover {
          border-color: #667eea;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
        }
        
        .city-dropdown .nice-select.open {
          border-color: #667eea;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
        }
        
        .city-dropdown .nice-select .list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1ecff;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .city-dropdown .nice-select .list .option {
          padding: 12px 16px;
          font-weight: 500;
          color: #4a5568;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .city-dropdown .nice-select .list .option::before {
          content: "📍";
          margin-right: 8px;
          font-size: 14px;
        }
        
        .city-dropdown .nice-select .list .option:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateX(4px);
        }
        
        .city-dropdown .nice-select .list .option.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
        }
        
        .city-dropdown .nice-select .list .option.selected::after {
          content: "✓";
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-weight: bold;
        }
        
        /* Custom scrollbar for city dropdown */
        .city-dropdown .nice-select .list::-webkit-scrollbar {
          width: 6px;
        }
        
        .city-dropdown .nice-select .list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .city-dropdown .nice-select .list::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        
        .city-dropdown .nice-select .list::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }
        
        /* Enhanced animations and micro-interactions */
        .city-dropdown .nice-select .list {
          transform-origin: top center;
          animation: dropdownSlideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes dropdownSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .city-dropdown .nice-select .list .option {
          animation: fadeInUp 0.2s ease-out;
          animation-fill-mode: both;
        }
        
        .city-dropdown .nice-select .list .option:nth-child(1) { animation-delay: 0.05s; }
        .city-dropdown .nice-select .list .option:nth-child(2) { animation-delay: 0.1s; }
        .city-dropdown .nice-select .list .option:nth-child(3) { animation-delay: 0.15s; }
        .city-dropdown .nice-select .list .option:nth-child(4) { animation-delay: 0.2s; }
        .city-dropdown .nice-select .list .option:nth-child(5) { animation-delay: 0.25s; }
        .city-dropdown .nice-select .list .option:nth-child(6) { animation-delay: 0.3s; }
        .city-dropdown .nice-select .list .option:nth-child(7) { animation-delay: 0.35s; }
        .city-dropdown .nice-select .list .option:nth-child(8) { animation-delay: 0.4s; }
        .city-dropdown .nice-select .list .option:nth-child(9) { animation-delay: 0.45s; }
        .city-dropdown .nice-select .list .option:nth-child(10) { animation-delay: 0.5s; }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Pulse effect for selected city tag */
        .city-tag.selected {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          }
          50% {
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.6);
          }
          100% {
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          }
        }
        
        /* Enhanced search input styling */
        .box-title .wrap-sort input[type="text"] {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
          border: 2px solid #e1ecff;
          border-radius: 12px;
          padding: 16px 20px;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
          text-align: left;
          direction: ltr;
        }
        
        [dir="rtl"] .box-title .wrap-sort input[type="text"],
        html[dir="rtl"] .box-title .wrap-sort input[type="text"] {
          text-align: right;
          direction: rtl;
        }
        
        .box-title .wrap-sort input[type="text"]:focus {
          border-color: #667eea;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
          outline: none;
        }
        
        .box-title .wrap-sort input[type="text"]::placeholder {
          color: #a0aec0;
          font-weight: 400;
        }
        
        /* Fix dropdown text alignment for English */
        .box-title .wrap-sort .nice-select > span {
          text-align: left !important;
          direction: ltr !important;
        }
        
        [dir="rtl"] .box-title .wrap-sort .nice-select > span,
        html[dir="rtl"] .box-title .wrap-sort .nice-select > span {
          text-align: right !important;
          direction: rtl !important;
        }
      `}</style>
    <section className="section-agent">
      <div className="tf-container">
        <div className="row">
          <div className="box-title style-2 mb-48">
            <h2>{t('title')}</h2>
            <div className="wrap-sort">
              <form onSubmit={(e) => e.preventDefault()}>
                <fieldset>
                  <input
                    className=""
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    name="name"
                    tabIndex={2}
                    aria-required="true"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </fieldset>
              </form>

              <div className={`city-dropdown ${styles.cityDropdown}`}>
                <DropdownSelect
                  options={[
                    t('allLocation'),
                    t('cities.latakia'),
                    t('cities.damascus'),
                    t('cities.aleppo'),
                    t('cities.homs'),
                    t('cities.hama'),
                    t('cities.idlib'),
                    t('cities.deirEzZor'),
                    t('cities.daraa'),
                    t('cities.tartous'),
                  ]}
                  addtionalParentClass=""
                  selectedValue={locationFilter}
                  onChange={(value) => setLocationFilter(value)}
                />
              </div>

              <DropdownSelect
                options={[t('sortBy.default'), t('sortBy.newest'), t('sortBy.oldest')]}
                addtionalParentClass="select-sort style-2"
                selectedValue={sortBy}
                onChange={(value) => setSortBy(value)}
              />
            </div>
          </div>
          
          {sortedAgents.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3 className={styles.emptyTitle}>
                  {t('empty.title')}
                </h3>
                <p className={styles.emptyText}>
                  {t('empty.message')}
                </p>
                <div className={styles.emptyActions}>
                  <button
                    className={styles.resetBtn}
                    onClick={() => {
                      setSearchTerm('');
                      setLocationFilter(t('allLocation'));
                      setSortBy(t('sortBy.default'));
                    }}
                  >
                    {t('empty.resetFilters')}
                  </button>
                  {agents.length > 0 && (
                    <Link 
                      href="/agents"
                      className={styles.viewAllLink}
                    >
                      {t('empty.viewAll', { count: agents.length })}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="tf-grid-layout-2">
                {sortedAgents.map((agent) => (
                  <div key={agent._id} className="agent-item hover-img">
                    <div className="image-wrap" style={{height:'360px'}}>
                      <Link href={`/agents-details/${agent._id}`}>
                        <Image
                          className="lazyload property-img"
                          alt={agent.fullName || t('agentName')}
                          width={435}
                          height={450}
                          src={agent.avatar || "/images/avatar/agent-1.jpg"}
                        />
                      </Link>
                    </div>
                    <div className="content">
                      <div className="author">
                        <h5 className={styles.agentName + " name lh-30"}>
                          <Link 
                            href={`/agents-details/${agent._id}`}
                            className={"agent-name-link " + styles.agentNameLink}
                          >
                            {agent.fullName || t('agentName')}
                          </Link>
                        </h5>
                        <p className={styles.positionText + " text-2 lh-18"}>
                          {agent.position || agent.job || t('realEstateAgent')}
                        </p>
                        {agent.companyName && (
                          <p className={styles.companyText + " text-3 lh-18"}>
                            {agent.companyName}
                          </p>
                        )}
                        {agent.location && (
                          <div className="cities-tags">
                            {agent.location.split(',').map((city, index) => (
                              <span key={index} className="city-tag" dir="ltr">
                                {city.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {(agent.phone || agent.email || agent.facebook || agent.twitter || agent.linkedin) && (
                        <div className={styles.iconsSection + " all-icons-section"}>
                          <h6
                            className={styles.sectionHeader}
                          >{t('contactAndFollow')}</h6>
                          {/* Email and Phone Icons */}
                          <div className={styles.iconsRow}>
                            {/* Email Icon */}
                            {agent.email && (
                              <div className={styles.iconWrapper}
                                onMouseEnter={(e) => {
                                  const tooltip = e.currentTarget.querySelector('.email-tooltip');
                                  if (tooltip) tooltip.style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                  const tooltip = e.currentTarget.querySelector('.email-tooltip');
                                  if (tooltip) tooltip.style.opacity = '0';
                                }}
                              >
                                <button
                                  className={styles.iconButton}
                                  onClick={() => handleCopyEmail(agent.email, agent._id)}
                                  aria-label="Copy email to clipboard"
                                >
                                  {copiedEmail === agent._id ? (
                                    <CheckIcon className={styles.iconCheck} />
                                  ) : (
                                    <i className={"icon-letter " + styles.icon}></i>
                                  )}
                                </button>
                                {/* Tooltip */}
                                <div className={"email-tooltip " + styles.tooltip}>
                                  {copiedEmail === agent._id ? t('copied') : agent.email}
                                  <div className={styles.tooltipArrow}></div>
                                </div>
                              </div>
                            )}
                            {/* Phone Icon */}
                            {agent.phone && (
                              <div
                                className={styles.iconWrapper}
                                onMouseEnter={(e) => {
                                  const tooltip = e.currentTarget.querySelector('.phone-tooltip');
                                  if (tooltip) tooltip.style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                  const tooltip = e.currentTarget.querySelector('.phone-tooltip');
                                  if (tooltip) tooltip.style.opacity = '0';
                                }}
                              >
                                <a
                                  href={`tel:${agent.phone}`}
                                  className={styles.phoneLink}
                                  aria-label={`Call ${agent.phone}`}
                                >
                                  <i className={"icon-phone-3 " + styles.icon}></i>
                                </a>
                                {/* Tooltip */}
                                <div className={"phone-tooltip " + styles.tooltip}>
                                  {agent.phone}
                                  <div className={styles.tooltipArrow}></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="wrap-pagination">
                <p className="text-1">
                  Showing {sortedAgents.length} of {agents.length} agents
                </p>
                {agents.length > 20 && (
                  <ul className="wg-pagination justify-center">
                    <li className="arrow">
                      <a href="#">
                        <i className="icon-arrow-left" />
                      </a>
                    </li>
                    <li className="active">
                      <a href="#">1</a>
                    </li>
                    <li className="arrow">
                      <a href="#">
                        <i className="icon-arrow-right" />
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
    
    {/* Toast */}
    {toast.isVisible && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
      />
    )}
    </>
  );
}