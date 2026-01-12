"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminAPI } from "@/apis";
import EditPropertyModal from "../modals/EditPropertyModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import Toast from "../common/Toast";
import LocationLoader from "../common/LocationLoader";
import DropdownSelect from "../common/DropdownSelect";
import { listingAPI } from "@/apis/listing";
import logger from "@/utlis/logger";
import styles from "../dashboard/Property.module.css";
import adminStyles from "./AdminProperties.module.css";
import { useTranslations, useLocale } from 'next-intl';
import { translateKeywordWithT } from '@/utils/translateKeywords';

export default function AdminPropertiesByAdmin() {
  const t = useTranslations('agent.property');
  const tAgent = useTranslations('agent.addProperty');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  // Helper function to get size unit label - return abbreviations
  const getSizeUnitLabel = (sizeUnit) => {
    if (!sizeUnit) return 'sqm'; // Default to sqm
    return sizeUnit.toUpperCase(); // Return abbreviation: SQM, DUNAM, SQFT, SQYD, FEDDAN
  };
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All');
  const [approvalFilter, setApprovalFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const itemsPerPage = 6;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  // Property type translations mapping
  const propertyTypeTranslations = {
    en: {
      "Apartment": "Apartment",
      "Villa": "Villa",
      "Holiday Home": "Holiday Home",
      "Office": "Office",
      "Townhouse": "Townhouse",
      "Commercial": "Commercial",
      "Land": "Land"
    },
    ar: {
      "Apartment": "شقة",
      "Villa": "فيلا",
      "Holiday Home": "منزل عطلة",
      "Office": "مكتب",
      "Townhouse": "منزل متلاصق",
      "Commercial": "تجاري",
      "Land": "أرض"
    }
  };

  const translatePropertyType = (propertyType) => {
    if (!propertyType) return propertyType;
    const translations = propertyTypeTranslations[locale] || propertyTypeTranslations.en;
    return translations[propertyType] || propertyType;
  };

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: t('confirm'),
    cancelText: t('cancel'),
    confirmColor: '#dc3545',
    onConfirm: null,
    loading: false
  });
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  // Fetch listings added by admin
  useEffect(() => {
    fetchListings();
  }, [currentPage, statusFilter, propertyTypeFilter, approvalFilter, searchTerm]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const filters = {
        page: currentPage,
        limit: itemsPerPage
      };
      
      if (statusFilter !== 'All') {
        filters.status = statusFilter.toLowerCase() === 'for sale' ? 'sale' : 'rent';
      }
      
      if (propertyTypeFilter !== 'All') {
        filters.propertyType = propertyTypeFilter;
      }
      
      if (approvalFilter !== 'All') {
        filters.approvalStatus = approvalFilter.toLowerCase();
      }
      
      if (searchTerm) {
        filters.search = searchTerm;
      }
      
      const response = await adminAPI.getPropertiesByAdmin(filters);
      setListings(response.data || []);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load properties");
      logger.error('Error fetching admin properties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit property
  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setSelectedProperty(null);
    fetchListings();
    showToast(t('propertyUpdated'), 'success');
  };

  // Handle mark as sold/unsold
  const handleMarkSold = (listing) => {
    const action = listing.isSold ? 'unsold' : 'sold';
    const title = listing.isSold ? t('unmarkAsSoldTitle') : t('markAsSoldTitle');
    const message = listing.isSold ? t('unmarkAsSoldMessage') : t('markAsSoldMessage');
    
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      confirmText: listing.isSold ? t('unmarkAsSold') : t('markAsSold'),
      cancelText: t('cancel'),
      confirmColor: '#ff6b35',
      onConfirm: async () => {
        setConfirmationModal(prev => ({ ...prev, loading: true }));
        try {
          const updateData = { isSold: !listing.isSold };
          await listingAPI.updateListing(listing._id, updateData);
          setConfirmationModal({ isOpen: false, title: '', message: '', confirmText: t('confirm'), cancelText: t('cancel'), confirmColor: '#dc3545', onConfirm: null, loading: false });
          showToast(listing.isSold ? t('propertyUnsold') : t('propertySold'), 'success');
          fetchListings();
        } catch (error) {
          logger.error(`Error marking property as ${action}:`, error);
          setConfirmationModal(prev => ({ ...prev, loading: false }));
          showToast(error?.response?.data?.message || t('failedToUpdate'), 'error');
        }
      },
      loading: false
    });
  };

  // Handle delete property
  const handleDeleteProperty = (listing) => {
    setConfirmationModal({
      isOpen: true,
      title: t('deleteProperty'),
      message: t('deletePropertyMessage'),
      confirmText: t('delete'),
      cancelText: t('cancel'),
      confirmColor: '#dc3545',
      showInput: true,
      inputLabel: t('deleteReasonLabel'),
      inputPlaceholder: t('deleteReasonPlaceholder'),
      inputRequired: true,
      onConfirm: async (deletedReason) => {
        setConfirmationModal(prev => ({ ...prev, loading: true }));
        try {
          await listingAPI.deleteListing(listing._id, deletedReason);
          setConfirmationModal({ isOpen: false, title: '', message: '', confirmText: t('confirm'), cancelText: t('cancel'), confirmColor: '#dc3545', onConfirm: null, loading: false, showInput: false });
          showToast(t('propertyDeleted'), 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          logger.error('Error deleting property:', error);
          setConfirmationModal(prev => ({ ...prev, loading: false }));
          const errorMessage = error?.response?.data?.message || error?.message || t('failedToDelete');
          showToast(errorMessage, 'error');
        }
      },
      loading: false
    });
  };

  // Get property image
  const getPropertyImage = (listing) => {
    if (listing.images && listing.images.length > 0) {
      const firstImage = listing.images[0];
      if (typeof firstImage === 'string') {
        return firstImage;
      }
      return firstImage.url || firstImage.secure_url || firstImage.path || '/images/default-property.jpg';
    }
    if (listing.imageNames && listing.imageNames.length > 0) {
      return listing.imageNames[0];
    }
    if (listing.coverImage) {
      return listing.coverImage;
    }
    if (listing.featuredImage) {
      return listing.featuredImage;
    }
    return '/images/default-property.jpg';
  };

  // Use listings directly from API (server-side filtering)
  const displayListings = listings;
  
  // Calculate display range for pagination info
  const totalListings = pagination?.total || displayListings.length;
  const totalPages = pagination?.pages || Math.ceil(totalListings / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + displayListings.length, totalListings);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, propertyTypeFilter, approvalFilter, searchTerm]);

  return (
    <div className={adminStyles.container}>
      <div className="main-content-inner wrap-dashboard-content">
        <div className="button-show-hide show-mb">
          <span className="body-1">{t('showDashboard')}</span>
        </div>
        <div className={adminStyles.filters}>
          <div className={adminStyles.filterGroup}>
            <select
              className={adminStyles.selectInput}
              value={approvalFilter === 'All' ? '' : approvalFilter.toLowerCase()}
              onChange={(e) => setApprovalFilter(e.target.value === '' ? 'All' : e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
            >
              <option value="">All Approval Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className={adminStyles.filterGroup}>
            <select
              className={adminStyles.selectInput}
              value={statusFilter === 'All' ? '' : statusFilter.toLowerCase() === 'for sale' ? 'sale' : 'rent'}
              onChange={(e) => setStatusFilter(e.target.value === '' ? 'All' : e.target.value === 'sale' ? 'For Sale' : 'For Rent')}
            >
              <option value="">All Status</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          <div className={adminStyles.filterGroup}>
            <select
              className={adminStyles.selectInput}
              value={propertyTypeFilter === 'All' ? '' : propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value === '' ? 'All' : e.target.value)}
            >
              <option value="">All Property Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Holiday Home">Holiday Home</option>
              <option value="Office">Office</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Commercial">Commercial</option>
              <option value="Land">Land</option>
            </select>
          </div>
          <div className={adminStyles.filterGroup}>
            <input
              type="text"
              className={adminStyles.searchInput}
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
          <h1 className={adminStyles.title}>
            Properties by Admin
            {totalListings > 0 && (
              <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: locale === 'ar' ? '0' : '10px', marginRight: locale === 'ar' ? '10px' : '0', color: '#6b7280' }}>
                ({totalListings} {t('total')} - {t('showing')} {startIndex + 1}-{endIndex})
              </span>
            )}
          </h1>
          <div className={adminStyles.tableContainer}>
            <div className="table-responsive">
              {loading ? (
                <div className={adminStyles.loaderContainer}>
                  <LocationLoader 
                    size="medium" 
                    message={t('loading')}
                  />
                </div>
              ) : error ? (
                <div className={adminStyles.error}>
                  <p>{error}</p>
                </div>
              ) : displayListings.length === 0 ? (
                <div className={adminStyles.noData}>
                  <p>{t('noProperties')}</p>
                </div>
              ) : (
                <table className={adminStyles.table} style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>{t('listing')}</th>
                      <th style={{ textAlign: 'center' }}>{t('status')}</th>
                      <th style={{ textAlign: 'center' }}>{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayListings.map((listing) => (
                      <tr key={listing._id} className="file-delete">
                        <td>
                          <div className="listing-box">
                            <div className="images" style={{ position: 'relative' }}>
                              <Image
                                alt={listing.propertyKeyword || 'Property'}
                                src={getPropertyImage(listing)}
                                width={615}
                                height={405}
                                style={{
                                  opacity: listing.isSold ? 0.7 : 1,
                                  transition: 'opacity 0.3s ease'
                                }}
                              />
                              {listing.isSold && (
                                <div style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  backgroundColor: 'rgba(220, 53, 69, 0.9)',
                                  color: 'white',
                                  padding: '8px 16px',
                                  borderRadius: '6px',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  letterSpacing: '1px',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                                }}>
                                  {t('sold')}
                                </div>
                              )}
                            </div>
                            <div className="content" style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                              <div className="title" style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                                <Link
                                  href={`/property-detail/${listing._id}`}
                                  className="link"
                                >
                                  {listing.propertyType || 'Property'}
                                </Link>
                              </div>
                              {/* Property Keyword Tags */}
                              {listing.propertyKeyword && (
                                <div style={{ 
                                  marginTop: '16px', 
                                  marginBottom: '16px', 
                                  display: 'flex', 
                                  flexWrap: 'wrap', 
                                  gap: '6px',
                                  justifyContent: locale === 'ar' ? 'flex-start' : 'flex-end',
                                  direction: locale === 'ar' ? 'rtl' : 'ltr',
                                  textAlign: locale === 'ar' ? 'right' : 'left'
                                }}>
                                  {listing.propertyKeyword.split(',').map((keyword, index) => {
                                    const trimmedKeyword = keyword.trim();
                                    if (!trimmedKeyword) return null;
                                    const translatedKeyword = translateKeywordWithT(trimmedKeyword, tCommon);
                                    return (
                                      <span 
                                        key={index} 
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          padding: '4px 10px',
                                          backgroundColor: '#f0f0f0',
                                          border: '1px solid #e0e0e0',
                                          borderRadius: '20px',
                                          fontSize: '12px',
                                          color: '#333',
                                          fontWeight: '500'
                                        }}
                                      >
                                        {translatedKeyword}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                              <p className="location text-1 flex items-center gap-6">
                                <i className="icon-location" /> {listing.city || listing.state || 'Location not specified'}
                              </p>
                              <ul className="meta-list flex" style={{ gap: '24px' }}>
                                {listing.bedrooms != null && Number(listing.bedrooms) > 0 && (
                                  <li className="text-1 flex items-center">
                                    <i className="icon-bed" style={{ margin: '0 2px' }} />
                                    <span>{listing.bedrooms}</span>
                                  </li>
                                )}
                                {listing.bathrooms != null && Number(listing.bathrooms) > 0 && (
                                  <li className="text-1 flex items-center">
                                    <i className="icon-bath" style={{ margin: '0 2px' }} />
                                    <span>{listing.bathrooms}</span>
                                  </li>
                                )}
                                <li className="text-1 flex items-center">
                                  <i className="icon-sqft" style={{ margin: '0 2px' }} />
                                  <span>{listing.size || 0}</span> {getSizeUnitLabel(listing.sizeUnit)}
                                </li>
                              </ul>
                              <div className="bot flex justify-between items-center">
                                <h5 className="price">
                                  {(() => {
                                    const currencySymbols = {
                                      'USD': '$',
                                      'SYP': 'SYP',
                                      'TRY': '₺',
                                      'EUR': '€'
                                    };
                                    const currency = listing?.currency || 'USD';
                                    const symbol = currencySymbols[currency] || currency;
                                    const exactPrice = listing.propertyPrice;
                                    if (exactPrice === null || exactPrice === undefined) {
                                      return `${symbol}0`;
                                    }
                                    const basePrice = `${symbol}${exactPrice.toLocaleString('en-US', { maximumFractionDigits: 0, useGrouping: true })}`;
                                    
                                    const statusToCheck = listing?.statusOriginal || listing?.status || '';
                                    const statusLower = statusToCheck.toLowerCase().trim();
                                    const isRent = statusLower === 'rent' || statusLower === 'for rent' || statusLower.includes('rent');
                                    if (isRent) {
                                      const rentTypeValue = listing?.rentType || listing?.rent_type || null;
                                      const rentType = (rentTypeValue && rentTypeValue !== null && rentTypeValue !== undefined && rentTypeValue !== '') 
                                        ? String(rentTypeValue).toLowerCase().trim()
                                        : 'monthly';
                                      
                                      const rentTypeMap = {
                                        'monthly': tCommon('monthly'),
                                        'weekly': tCommon('weekly'),
                                        'yearly': tCommon('yearly'),
                                        'daily': tCommon('daily')
                                      };
                                      const rentPeriod = rentTypeMap[rentType] || tCommon('monthly');
                                      return (
                                        <>
                                          {basePrice}
                                          <span>{rentPeriod}</span>
                                        </>
                                      );
                                    }
                                    
                                    return basePrice;
                                  })()}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {(() => {
                            const status = listing.approvalStatus?.toLowerCase() || 'pending';
                            let badgeClass = adminStyles.badgeDefault;
                            if (status === 'approved') badgeClass = adminStyles.badgeApproved;
                            else if (status === 'pending') badgeClass = adminStyles.badgePending;
                            else if (status === 'rejected') badgeClass = adminStyles.badgeRejected;
                            else if (status === 'closed') badgeClass = adminStyles.badgeClosed;
                            return (
                              <span className={`${adminStyles.badge} ${badgeClass}`}>
                                {listing.approvalStatus || 'Pending'}
                              </span>
                            );
                          })()}
                        </td>
                        <td>
                          <ul className="action-list flex">
                            <li>
                              <button 
                                onClick={() => handleEditProperty(listing)} 
                                className="item"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  cursor: 'pointer',
                                  color: '#A3ABB0',
                                  fontSize: '14px'
                                }}
                                title={t('edit')}
                              >
                                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11.3333 2.00002C11.5084 1.82491 11.7163 1.68601 11.9444 1.5913C12.1726 1.49659 12.4163 1.44824 12.6622 1.44824C12.9081 1.44824 13.1518 1.49659 13.38 1.5913C13.6081 1.68601 13.816 1.82491 13.9911 2.00002C14.1662 2.17513 14.3051 2.38307 14.3998 2.61122C14.4945 2.83938 14.5429 3.08305 14.5429 3.32891C14.5429 3.57477 14.4945 3.81844 14.3998 4.04659C14.3051 4.27475 14.1662 4.48269 13.9911 4.6578L5.32444 13.3245L1.33331 14.6667L2.67553 10.6755L11.3333 2.00002Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {t('edit')}
                              </button>
                            </li>
                            <li>
                              <button 
                                onClick={() => handleMarkSold(listing)} 
                                className="item"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  cursor: 'pointer',
                                  color: listing.isSold ? '#ff6b35' : '#A3ABB0',
                                  fontSize: '14px',
                                  fontWeight: listing.isSold ? '600' : '400'
                                }}
                                title={listing.isSold ? t('unmarkAsSold') : t('markAsSold')}
                              >
                                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                  <path d="M12.2427 12.2427C13.3679 11.1175 14.0001 9.59135 14.0001 8.00004C14.0001 6.40873 13.3679 4.8826 12.2427 3.75737C11.1175 2.63214 9.59135 2 8.00004 2C6.40873 2 4.8826 2.63214 3.75737 3.75737M12.2427 12.2427C11.1175 13.3679 9.59135 14.0001 8.00004 14.0001C6.40873 14.0001 4.8826 13.3679 3.75737 12.2427C2.63214 11.1175 2 9.59135 2 8.00004C2 6.40873 2.63214 4.8826 3.75737 3.75737M12.2427 12.2427L3.75737 3.75737" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {listing.isSold ? t('unmarkAsSold') : t('markAsSold')}
                              </button>
                            </li>
                            <li>
                              <button 
                                onClick={() => handleDeleteProperty(listing)} 
                                className="remove-file item"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  cursor: 'pointer',
                                  color: '#A3ABB0',
                                  fontSize: '14px'
                                }}
                                title={t('delete')}
                              >
                                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                  <path d="M9.82667 6.00035L9.596 12.0003M6.404 12.0003L6.17333 6.00035M12.8187 3.86035C13.0467 3.89501 13.2733 3.93168 13.5 3.97101M12.8187 3.86035L12.1067 13.1157C12.0776 13.4925 11.9074 13.8445 11.63 14.1012C11.3527 14.3579 10.9886 14.5005 10.6107 14.5003H5.38933C5.0114 14.5005 4.64735 14.3579 4.36999 14.1012C4.09262 13.8445 3.92239 13.4925 3.89333 13.1157L3.18133 3.86035M12.8187 3.86035C12.0492 3.74403 11.2758 3.65574 10.5 3.59568M3.18133 3.86035C2.95333 3.89435 2.72667 3.93101 2.5 3.97035M3.18133 3.86035C3.95076 3.74403 4.72416 3.65575 5.5 3.59568M10.5 3.59568V2.98501C10.5 2.19835 9.89333 1.54235 9.10667 1.51768C8.36908 1.49411 7.63092 1.49411 6.89333 1.51768C6.10667 1.54235 5.5 2.19901 5.5 2.98501V3.59568M10.5 3.59568C8.83581 3.46707 7.16419 3.46707 5.5 3.59568" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {t('delete')}
                              </button>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Pagination */}
            {!loading && !error && pagination && pagination.pages > 1 && (
              <div className={adminStyles.pagination}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={adminStyles.pageBtn}
                >
                  {t('previous')}
                </button>
                <span className={adminStyles.pageInfo}>
                  {t('page')} {pagination.page} {t('of')} {pagination.pages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= pagination.pages}
                  className={adminStyles.pageBtn}
                >
                  {t('next')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Property Modal */}
      {editModalOpen && selectedProperty && (
        <EditPropertyModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedProperty(null);
          }}
          property={selectedProperty}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, title: '', message: '', confirmText: t('confirm'), cancelText: t('cancel'), confirmColor: '#dc3545', onConfirm: null, loading: false })}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        confirmColor={confirmationModal.confirmColor}
        loading={confirmationModal.loading}
        showInput={confirmationModal.showInput}
        inputLabel={confirmationModal.inputLabel}
        inputPlaceholder={confirmationModal.inputPlaceholder}
        inputRequired={confirmationModal.inputRequired}
      />

      {/* Toast Notification */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
}

