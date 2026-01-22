"use client";
import React, { useState, useEffect } from "react";
import { adminAPI, agentAPI } from "@/apis";
import LocationLoader from "@/components/common/LocationLoader";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import styles from "./AdminAgents.module.css";
import { UserIcon, PhoneIcon, EmailIcon } from "@/components/icons";
import { extractCountryCode, DEFAULT_COUNTRY_CODE } from "@/constants/countryCodes";
import { useTranslations, useLocale } from 'next-intl';
import { translateApiMessage } from "@/utils/translateApiMessages";

export default function AdminAgents() {
  const { showSuccessModal, showWarningModal } = useGlobalModal();
  const t = useTranslations('apiMessages');
  const locale = useLocale();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [deletingAgentId, setDeletingAgentId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [agentDetails, setAgentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    isBlocked: "", // Show all agents by default
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState(null);

  // Helper function to format phone number with country code
  const formatPhoneNumber = (phone, countryCode = null) => {
    if (!phone) return '-';
    
    // First, try to extract country code from phone number
    const phoneData = extractCountryCode(phone);
    
    if (phoneData) {
      // If country code was found in phone number, use it
      return `${phoneData.countryCode} ${phoneData.phoneNumber}`;
    }
    
    // If countryCode is provided separately, use it
    if (countryCode) {
      // Remove any existing country code from phone
      const cleanPhone = phone.replace(/^\+?\d{1,4}\s?/, '').trim();
      return `${countryCode} ${cleanPhone}`;
    }
    
    // If no country code found and no countryCode provided, try to use default
    // Check if phone starts with a number (likely doesn't have country code)
    if (/^\d/.test(phone.trim())) {
      return `${DEFAULT_COUNTRY_CODE} ${phone.trim()}`;
    }
    
    // Fallback: return phone as is
    return phone;
  };

  useEffect(() => {
    fetchAgents();
  }, [filters]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllAgents(filters);
      setAgents(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleBlock = async (id) => {
    const agent = agents.find(a => a._id === id);
    setSelectedAgent(agent);
    setShowBlockModal(true);
  };

  const confirmBlock = async () => {
    if (!blockReason || !blockReason.trim()) {
      showWarningModal(t('error'), t('provideBlockReason'));
      return;
    }

    try {
      await adminAPI.blockAgent(selectedAgent._id, blockReason);
      showSuccessModal(
        t('success'),
        t('agentBlockedSuccess')
      );
      setShowBlockModal(false);
      setBlockReason("");
      setSelectedAgent(null);
      fetchAgents();
    } catch (err) {
      const errorMsg = translateApiMessage(err.message || "Failed to block agent", locale, t);
      showWarningModal(t('error'), errorMsg);
    }
  };

  const handleUnblock = async (id) => {
    if (!confirm(locale === 'ar' ? "هل أنت متأكد من إلغاء حظر هذا الوكيل؟" : "Are you sure you want to unblock this agent?")) return;

    try {
      await adminAPI.unblockAgent(id);
      showSuccessModal(t('success'), t('agentUnblockedSuccess'));
      fetchAgents();
    } catch (err) {
      const errorMsg = translateApiMessage(err.message || "Failed to unblock agent", locale, t);
      showWarningModal(t('error'), errorMsg);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setLoadingDetails(true);
      setShowDetailsModal(true);
      const response = await agentAPI.getAgentById(id);
      // Handle both wrapped and direct response
      const agent = response.data || response;
      setAgentDetails(agent);
    } catch (err) {
      const errorMsg = translateApiMessage(err.message || "Failed to load agent details", locale, t);
      showWarningModal(t('error'), errorMsg);
      setShowDetailsModal(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteAgent = async (id) => {
    const agent = agents.find(a => a._id === id);
    const agentName = agent?.username || agent?.email || 'this agent';
    const listingCount = agent?.listingCount || 0;
    
    const confirmMessage = listingCount > 0
      ? `Are you sure you want to delete ${agentName}? This will also delete all ${listingCount} listing(s) associated with this agent. This action cannot be undone.`
      : `Are you sure you want to delete ${agentName}? This action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeletingAgentId(id);
      const result = await adminAPI.deleteAgent(id);
      const message = result.deletedListingsCount > 0
        ? (locale === 'ar' 
            ? `تم حذف الوكيل و ${result.deletedListingsCount} قائمة بنجاح`
            : `Agent and ${result.deletedListingsCount} listing(s) deleted successfully`)
        : t('agentDeletedSuccess');
      showSuccessModal(t('success'), message);
      fetchAgents();
    } catch (err) {
      const errorMsg = translateApiMessage(err.message || "Failed to delete agent", locale, t);
      showWarningModal(t('error'), errorMsg);
    } finally {
      setDeletingAgentId(null);
    }
  };

  if (loading && agents.length === 0) {
    return (
      <div className={styles.loaderContainer}>
        <LocationLoader message="Loading agents..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Agents Management</h1>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <input
            type="text"
            placeholder="Search agents..."
            className={styles.searchInput}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={filters.isBlocked}
            onChange={(e) => handleFilterChange("isBlocked", e.target.value)}
          >
            <option value="">All Agents</option>
            <option value="false">Active</option>
            <option value="true">Blocked</option>
          </select>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Agents Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Agent Details</th>
              <th>Contact</th>
              <th>Company</th>
              <th>Listings</th>
              <th>Status</th>
              <th>Blocked Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.noData}>No agents found</td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent._id}>
                  <td>
                    <div className={styles.agentInfo}>
                      <div className={styles.agentNameRow}>
                        <UserIcon width={18} height={18} stroke="currentColor" />
                        <strong>{agent.username || agent.email}</strong>
                      </div>
                      {agent.location && (
                        <span className={styles.agentLocation}>{agent.location}</span>
                      )}
                      {agent.createdAt && (
                        <span className={styles.agentDate}>
                          Joined: {new Date(agent.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.contactInfo}>
                      <div className={styles.contactRow}>
                        <EmailIcon width={16} height={16} stroke="currentColor" />
                        <span>{agent.email}</span>
                      </div>
                      {agent.phone && (
                        <div className={styles.contactRow}>
                          <PhoneIcon width={16} height={16} stroke="currentColor" />
                          <span>{formatPhoneNumber(agent.phone)}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{agent.company || "-"}</td>
                  <td>
                    <span className={styles.listingCount}>{agent.listingCount || 0}</span>
                  </td>
                  <td>
                    {agent.isBlocked ? (
                      <span className={`${styles.badge} ${styles.badgeBlocked}`}>
                        {agent.blockedReason?.includes('New agent') ? 'Pending Verification' : 'Blocked'}
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeActive}`}>
                        Active
                      </span>
                    )}
                  </td>
                  <td className={styles.reasonCell}>
                    {agent.blockedReason || "-"}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.btn} ${styles.btnView}`}
                        onClick={() => handleViewDetails(agent._id)}
                      >
                        View Details
                      </button>
                      {agent.isBlocked ? (
                        <button
                          className={`${styles.btn} ${styles.btnUnblock}`}
                          onClick={() => handleUnblock(agent._id)}
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          className={`${styles.btn} ${styles.btnBlock}`}
                          onClick={() => handleBlock(agent._id)}
                        >
                          Block
                        </button>
                      )}
                      <button
                        className={`${styles.btn} ${styles.btnDelete} ${deletingAgentId === agent._id ? styles.btnLoading : ''}`}
                        onClick={() => handleDeleteAgent(agent._id)}
                        disabled={deletingAgentId === agent._id}
                      >
                        {deletingAgentId === agent._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Agent Details Modal */}
      {showDetailsModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
          <div className={styles.detailsModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Agent Details</h3>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowDetailsModal(false);
                  setAgentDetails(null);
                }}
              >
                ×
              </button>
            </div>
            
            {loadingDetails ? (
              <div className={styles.loaderContainer}>
                <LocationLoader message="Loading agent details..." />
              </div>
            ) : agentDetails ? (
              <div className={styles.detailsContent}>
                {/* Basic Information */}
                <div className={styles.detailsSection}>
                  <h4 className={styles.sectionTitle}>Basic Information</h4>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Username:</span>
                      <span className={styles.detailValue}>{agentDetails.username || agentDetails.fullName || '-'}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Email:</span>
                      <span className={styles.detailValue}>{agentDetails.email || '-'}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Phone:</span>
                      <span className={styles.detailValue}>{formatPhoneNumber(agentDetails.phone, agentDetails.countryCode)}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Role:</span>
                      <span className={styles.detailValue}>{agentDetails.role || '-'}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Status:</span>
                      <span className={styles.detailValue}>
                        {agentDetails.isBlocked ? (
                          <span className={`${styles.badge} ${styles.badgeBlocked}`}>
                            {agentDetails.blockedReason?.includes('New agent') ? 'Pending Verification' : 'Blocked'}
                          </span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>
                        )}
                      </span>
                    </div>
                    {agentDetails.blockedReason && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Blocked Reason:</span>
                        <span className={styles.detailValue}>{agentDetails.blockedReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {agentDetails.description && (
                  <div className={styles.detailsSection}>
                    <h4 className={styles.sectionTitle}>Description</h4>
                    <p className={styles.detailValue}>{agentDetails.description}</p>
                  </div>
                )}

                {/* Company Information */}
                {(agentDetails.company || agentDetails.position || agentDetails.job || agentDetails.officeAddress || agentDetails.officeNumber) && (
                  <div className={styles.detailsSection}>
                    <h4 className={styles.sectionTitle}>Company Information</h4>
                    <div className={styles.detailsGrid}>
                      {agentDetails.company && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Company:</span>
                          <span className={styles.detailValue}>{agentDetails.company}</span>
                        </div>
                      )}
                      {agentDetails.position && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Position:</span>
                          <span className={styles.detailValue}>{agentDetails.position}</span>
                        </div>
                      )}
                      {agentDetails.job && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Job Title:</span>
                          <span className={styles.detailValue}>{agentDetails.job}</span>
                        </div>
                      )}
                      {agentDetails.officeAddress && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Office Address:</span>
                          <span className={styles.detailValue}>{agentDetails.officeAddress}</span>
                        </div>
                      )}
                      {agentDetails.officeNumber && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Office Phone:</span>
                          <span className={styles.detailValue}>{formatPhoneNumber(agentDetails.officeNumber, agentDetails.countryCode)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Location Information */}
                {(agentDetails.location || agentDetails.city) && (
                  <div className={styles.detailsSection}>
                    <h4 className={styles.sectionTitle}>Location Information</h4>
                    <div className={styles.detailsGrid}>
                      {agentDetails.location && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Location:</span>
                          <span className={styles.detailValue}>{agentDetails.location}</span>
                        </div>
                      )}
                      {agentDetails.city && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>City:</span>
                          <span className={styles.detailValue}>{agentDetails.city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Arabic Information Section */}
                {(agentDetails.username_ar || agentDetails.description_ar || agentDetails.company_ar || agentDetails.position_ar || agentDetails.job_ar || agentDetails.officeAddress_ar || agentDetails.location_ar) && (
                  <div className={styles.detailsSection}>
                    <h4 className={styles.sectionTitle}>Arabic Info (المعلومات العربية)</h4>
                    <div className={styles.detailsGrid} dir="rtl" style={{ textAlign: 'right' }}>
                      {agentDetails.username_ar && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>الاسم الكامل:</span>
                          <span className={styles.detailValue} dir="rtl">{agentDetails.username_ar}</span>
                        </div>
                      )}
                      {agentDetails.description_ar && (
                        <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                          <span className={styles.detailLabel}>الوصف:</span>
                          <p className={styles.detailValue} dir="rtl" style={{ textAlign: 'right', whiteSpace: 'pre-wrap' }}>{agentDetails.description_ar}</p>
                        </div>
                      )}
                      {agentDetails.company_ar && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>الشركة:</span>
                          <span className={styles.detailValue} dir="rtl">{agentDetails.company_ar}</span>
                        </div>
                      )}
                      {agentDetails.position_ar && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>المنصب:</span>
                          <span className={styles.detailValue} dir="rtl">{agentDetails.position_ar}</span>
                        </div>
                      )}
                      {agentDetails.job_ar && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>مسمى الوظيفة:</span>
                          <span className={styles.detailValue} dir="rtl">{agentDetails.job_ar}</span>
                        </div>
                      )}
                      {agentDetails.officeAddress_ar && (
                        <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                          <span className={styles.detailLabel}>عنوان المكتب:</span>
                          <span className={styles.detailValue} dir="rtl">{agentDetails.officeAddress_ar}</span>
                        </div>
                      )}
                      {agentDetails.location_ar && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>الموقع:</span>
                          <span className={styles.detailValue} dir="rtl">{agentDetails.location_ar}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Services & Expertise */}
                {agentDetails.servicesAndExpertise && agentDetails.servicesAndExpertise.length > 0 && (
                  <div className={styles.detailsSection}>
                    <h4 className={styles.sectionTitle}>Services & Expertise</h4>
                    <div className={styles.servicesList}>
                      {agentDetails.servicesAndExpertise.map((service, index) => (
                        <span key={index} className={styles.serviceTag}>{service}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className={styles.detailsSection}>
                  <h4 className={styles.sectionTitle}>Additional Information</h4>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Points Balance:</span>
                      <span className={styles.detailValue}>{agentDetails.pointsBalance || 0}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Package Type:</span>
                      <span className={styles.detailValue}>{agentDetails.packageType || 'basic'}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Unlimited Points:</span>
                      <span className={styles.detailValue}>{agentDetails.hasUnlimitedPoints ? 'Yes' : 'No'}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Trial Period:</span>
                      <span className={styles.detailValue}>{agentDetails.isTrial ? 'Yes' : 'No'}</span>
                    </div>
                    {agentDetails.packageExpiry && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Package Expiry:</span>
                        <span className={styles.detailValue}>
                          {new Date(agentDetails.packageExpiry).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {agentDetails.yearsExperience && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Years Experience:</span>
                        <span className={styles.detailValue}>{agentDetails.yearsExperience}</span>
                      </div>
                    )}
                    {agentDetails.responseTime && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Response Time:</span>
                        <span className={styles.detailValue}>{agentDetails.responseTime}</span>
                      </div>
                    )}
                    {agentDetails.availability && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Availability:</span>
                        <span className={styles.detailValue}>{agentDetails.availability}</span>
                      </div>
                    )}
                    {agentDetails.createdAt && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Member Since:</span>
                        <span className={styles.detailValue}>
                          {new Date(agentDetails.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Media */}
                {(agentDetails.facebook || agentDetails.twitter || agentDetails.linkedin || agentDetails.whatsapp) && (
                  <div className={styles.detailsSection}>
                    <h4 className={styles.sectionTitle}>Social Media</h4>
                    <div className={styles.detailsGrid}>
                      {agentDetails.facebook && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Facebook:</span>
                          <a href={agentDetails.facebook} target="_blank" rel="noopener noreferrer" className={styles.detailValue}>
                            {agentDetails.facebook}
                          </a>
                        </div>
                      )}
                      {agentDetails.twitter && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Twitter/X:</span>
                          <a href={agentDetails.twitter} target="_blank" rel="noopener noreferrer" className={styles.detailValue}>
                            {agentDetails.twitter}
                          </a>
                        </div>
                      )}
                      {agentDetails.linkedin && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>LinkedIn:</span>
                          <a href={agentDetails.linkedin} target="_blank" rel="noopener noreferrer" className={styles.detailValue}>
                            {agentDetails.linkedin}
                          </a>
                        </div>
                      )}
                      {agentDetails.whatsapp && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>WhatsApp:</span>
                          <span className={styles.detailValue}>{agentDetails.whatsapp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.noData}>No details available</div>
            )}
          </div>
        </div>
      )}

      {/* Block Modal */}
      {showBlockModal && (
        <div className={styles.modalOverlay} onClick={() => setShowBlockModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Block Agent</h3>
            <p className={styles.modalSubtitle}>
              Are you sure you want to block <strong>{selectedAgent?.username || selectedAgent?.email}</strong>?
            </p>
            <div className={styles.modalForm}>
              <label className={styles.modalLabel}>
                Reason for blocking:
              </label>
              <textarea
                className={styles.modalTextarea}
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Enter the reason for blocking this agent..."
                rows={4}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                className={`${styles.btn} ${styles.btnCancel}`}
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockReason("");
                  setSelectedAgent(null);
                }}
              >
                Cancel
              </button>
              <button
                className={`${styles.btn} ${styles.btnBlock}`}
                onClick={confirmBlock}
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={filters.page === 1}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            className={styles.pageBtn}
            disabled={filters.page >= pagination.pages}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

