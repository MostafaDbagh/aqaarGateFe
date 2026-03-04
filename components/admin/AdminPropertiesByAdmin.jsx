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
import adminStyles from "./AdminPropertiesByAdmin.module.css";
import DashboardFooter from "../common/DashboardFooter";
import { EyeIcon } from "../icons/EyeIcon";
import { useTranslations, useLocale } from 'next-intl';
import { translateKeywordWithT } from '@/utils/translateKeywords';
import { formatPriceWithCurrency } from "@/utlis/propertyHelpers";

export default function AdminPropertiesByAdmin() {
  const t = useTranslations('agent.property');
  const tAgent = useTranslations('agent.addProperty');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  // Helper function to get size unit label
  const getSizeUnitLabel = (sizeUnit) => {
    if (!sizeUnit) return locale === 'ar' ? tCommon('sqm') : 'SQM';
    const unit = sizeUnit.toLowerCase();
    // Map size units to translation keys
    const unitMap = {
      'sqm': 'sqm',
      'dunam': 'dunam',
      'feddan': 'feddan',
      'sqft': 'sqft',
      'sqyd': 'sqyd'
    };
    const translationKey = unitMap[unit] || 'sqm';
    return tCommon(translationKey);
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
  const [featuredLoadingId, setFeaturedLoadingId] = useState(null);
  const [featuredOrderDraft, setFeaturedOrderDraft] = useState({}); // { [listingId]: inputValue } for unsaved order
  const [vipLoadingId, setVipLoadingId] = useState(null);

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

  // Toggle featured (star) - listing stays in Fresh Listings when featured
  const handleToggleFeatured = async (listing) => {
    const id = listing._id;
    const nextFeatured = !listing.isFeatured;
    setFeaturedLoadingId(id);
    try {
      const res = await listingAPI.setListingFeatured(id, nextFeatured);
      setFeaturedOrderDraft((prev) => { const next = { ...prev }; delete next[id]; return next; });
      setListings((prev) =>
        prev.map((l) => (l._id === id ? { ...l, isFeatured: nextFeatured, featuredOrder: nextFeatured ? (res?.featuredOrder ?? null) : null } : l))
      );
      showToast(nextFeatured ? 'Listing featured in Fresh Listings' : 'Listing unfeatured', 'success');
    } catch (err) {
      showToast(err?.message || 'Failed to update featured', 'error');
    } finally {
      setFeaturedLoadingId(null);
    }
  };

  // Toggle VIP - listing appears on VIP page when set
  const handleToggleVip = async (listing) => {
    const id = listing._id;
    const nextVip = !listing.isVip;
    setVipLoadingId(id);
    try {
      await listingAPI.setListingVip(id, nextVip);
      setListings((prev) => prev.map((l) => (l._id === id ? { ...l, isVip: nextVip } : l)));
      showToast(nextVip ? 'Listing marked as VIP' : 'Listing removed from VIP', 'success');
    } catch (err) {
      showToast(err?.message || 'Failed to update VIP', 'error');
    } finally {
      setVipLoadingId(null);
    }
  };

  // Set featured order (1 = first). Save triggers API; backend bumps others (e.g. previous 1 becomes 2).
  const handleSaveFeaturedOrder = async (listing) => {
    const id = listing._id;
    const raw = featuredOrderDraft[id] !== undefined ? featuredOrderDraft[id] : (listing.featuredOrder ?? '');
    const num = raw === '' ? null : parseInt(String(raw), 10);
    if (!listing.isFeatured) return;
    if (num !== null && (num < 1 || !Number.isInteger(num))) {
      showToast('Enter a number 1 or higher', 'error');
      return;
    }
    setFeaturedLoadingId(id);
    try {
      const res = await listingAPI.setListingFeatured(id, true, num ?? undefined);
      setFeaturedOrderDraft((prev) => { const next = { ...prev }; delete next[id]; return next; });
      setListings((prev) =>
        prev.map((l) => (l._id === id ? { ...l, featuredOrder: res?.featuredOrder ?? num ?? null } : l))
      );
      showToast('Featured order saved. Others shifted.', 'success');
      await fetchListings();
    } catch (err) {
      showToast(err?.message || 'Failed to save order', 'error');
    } finally {
      setFeaturedLoadingId(null);
    }
  };

  // Handle export properties
  const handleExportProperties = async () => {
    try {
      const blob = await adminAPI.exportAdminProperties();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin_properties_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast(t('exportSuccess'), 'success');
    } catch (error) {
      logger.error('Export error:', error);
      const errorMessage = error?.message || error?.error || t('exportError');
      showToast(errorMessage, 'error');
    }
  };

  // Fetch listings added by admin
  useEffect(() => {
    fetchListings();
  }, [currentPage, statusFilter, propertyTypeFilter, approvalFilter, searchTerm]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        page: currentPage,
        limit: itemsPerPage
      };
      
      if (statusFilter !== 'All') {
        // Normalize status filter
        filters.status = statusFilter.toLowerCase() === 'for sale' ? 'sale' : 
                         statusFilter.toLowerCase() === 'for rent' ? 'rent' : 
                         statusFilter.toLowerCase();
      }
      
      if (propertyTypeFilter !== 'All') {
        filters.propertyType = propertyTypeFilter;
      }
      
      if (approvalFilter !== 'All') {
        filters.approvalStatus = approvalFilter.toLowerCase();
      }
      
      if (searchTerm && searchTerm.trim()) {
        filters.search = searchTerm.trim();
      }
      
      const response = await adminAPI.getPropertiesByAdmin(filters);
      
      if (response && response.success !== false) {
        setListings(response.data || []);
        setPagination(response.pagination || {
          page: currentPage,
          limit: itemsPerPage,
          total: response.data?.length || 0,
          pages: 1
        });
      } else {
        throw new Error(response?.message || 'Failed to load properties');
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          "Failed to load properties";
      setError(errorMessage);
      logger.error('Error fetching admin properties:', err);
      setListings([]);
      setPagination(null);
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
      return firstImage.url || firstImage.secure_url || firstImage.path || '/images/section/property-1.jpg';
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
    return '/images/section/property-1.jpg';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  // Pagination handlers
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="main-content w-100 admin-properties-by-admin-page">
      <div className="main-content-inner wrap-dashboard-content">
        <div className="button-show-hide show-mb">
          <span className="body-1">{t('showDashboard')}</span>
        </div>
        <div className="row">
          <div className="col-md-2">
            <form onSubmit={(e) => e.preventDefault()}>
              <fieldset className="box-fieldset">
                <label>
                  {" "}
                  {t('approvalStatus')}:<span>*</span>{" "}
                </label>
                <DropdownSelect
                  options={[t('all'), t('pending'), t('approved'), t('rejected'), t('closed')]}
                  addtionalParentClass=""
                  onChange={(value) => {
                    if (value === t('all')) setApprovalFilter('All');
                    else if (value === t('pending')) setApprovalFilter('Pending');
                    else if (value === t('approved')) setApprovalFilter('Approved');
                    else if (value === t('rejected')) setApprovalFilter('Rejected');
                    else if (value === t('closed')) setApprovalFilter('Closed');
                  }}
                  translateOption={(option) => {
                    if (option === 'All') return t('all');
                    if (option === 'Pending') return t('pending');
                    if (option === 'Approved') return t('approved');
                    if (option === 'Rejected') return t('rejected');
                    if (option === 'Closed') return t('closed');
                    return option;
                  }}
                />
              </fieldset>
            </form>
          </div>
          <div className="col-md-2">
            <form onSubmit={(e) => e.preventDefault()}>
              <fieldset className="box-fieldset">
                <label>
                  {" "}
                  {t('status')}:<span>*</span>{" "}
                </label>
                <DropdownSelect
                  options={[t('all'), t('forSale'), t('forRent')]}
                  addtionalParentClass=""
                  onChange={(value) => setStatusFilter(value === t('all') ? 'All' : value === t('forSale') ? 'For Sale' : 'For Rent')}
                  translateOption={(option) => {
                    if (option === 'All') return t('all');
                    if (option === 'For Sale') return t('forSale');
                    if (option === 'For Rent') return t('forRent');
                    return option;
                  }}
                />
              </fieldset>
            </form>
          </div>
          <div className="col-md-2">
            <form onSubmit={(e) => e.preventDefault()}>
              <fieldset className="box-fieldset">
                <label>
                  {" "}
                  {t('propertyType')}:<span>*</span>{" "}
                </label>
                <DropdownSelect
                  options={["All", "Apartment", "Villa", "Holiday Home", "Office", "Townhouse", "Commercial", "Land"]}
                  addtionalParentClass=""
                  onChange={(value) => setPropertyTypeFilter(value)}
                  translateOption={(option) => {
                    if (option === 'All') return t('all');
                    return translatePropertyType(option);
                  }}
                />
              </fieldset>
            </form>
          </div>
          <div className="col-md-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <fieldset className="box-fieldset">
                <label>
                  {" "}
                  {t('search')}:<span>*</span>{" "}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </fieldset>
            </form>
          </div>
        </div>
        <div className={`widget-box-2 wd-listing mt-20 ${locale === 'ar' ? adminStyles.dirRtl : adminStyles.dirLtr}`}>
          <div className={adminStyles.headerRow}>
            <h3 className={`title ${adminStyles.titleRow} ${locale === 'ar' ? adminStyles.textEnd : adminStyles.textStart}`}>
              Properties by Admin
              {totalListings > 0 && (
                <span className={locale === 'ar' ? adminStyles.titleSubRtl : adminStyles.titleSub}>
                  ({totalListings} {t('total')} - {t('showing')} {startIndex + 1}-{endIndex})
                </span>
              )}
            </h3>
            <div className={adminStyles.actionsRow}>
              <button
                type="button"
                onClick={handleExportProperties}
                disabled={displayListings.length === 0}
                className={`tf-btn ${adminStyles.exportBtn}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('export')}
              </button>
            </div>
          </div>
          <div className="wrap-table">
            <div className="table-responsive">
              {loading ? (
                <div className={adminStyles.stateCenter}>
                  <LocationLoader 
                    size="medium" 
                    message={t('loading')}
                  />
                </div>
              ) : error ? (
                <div className={`${adminStyles.stateCenter} ${adminStyles.stateError}`}>
                  <p>{error}</p>
                </div>
              ) : displayListings.length === 0 ? (
                <div className={adminStyles.stateCenter}>
                  <p>{t('noProperties')}</p>
                </div>
              ) : (
                <table className={locale === 'ar' ? adminStyles.dirRtl : adminStyles.dirLtr}>
                  <thead>
                    <tr>
                      <th className={locale === 'ar' ? adminStyles.thEnd : adminStyles.thStart}>{t('listing')}</th>
                      <th className={adminStyles.thCenter}>{t('status')}</th>
                      <th className={adminStyles.thCenter}>{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayListings.map((listing) => (
                      <tr key={listing._id} className="file-delete">
                        <td>
                          <div className="listing-box">
                            <div className={`images ${adminStyles.imagesWrap} ${listing.isSold ? adminStyles.imgSold : ''}`}>
                              <Image
                                alt={listing.propertyKeyword || 'Property'}
                                src={getPropertyImage(listing)}
                                width={615}
                                height={405}
                              />
                              {listing.isSold && (
                                <div className={adminStyles.soldBadge}>
                                  {t('sold')}
                                </div>
                              )}
                            </div>
                            <div className={`content ${locale === 'ar' ? adminStyles.textEnd : adminStyles.textStart}`}>
                              <div className={`title ${locale === 'ar' ? adminStyles.textEnd : adminStyles.textStart}`}>
                                <Link
                                  href={`/property-detail/${listing._id}`}
                                  className="link"
                                >
                                  {listing.propertyType || 'Property'}
                                </Link>
                              </div>
                              {/* Property Keyword Tags */}
                              {listing.propertyKeyword && (
                                <div className={`${adminStyles.keywordsRow} ${locale === 'ar' ? adminStyles.keywordsRowRtl : ''} ${locale === 'ar' ? adminStyles.dirRtl : adminStyles.dirLtr} ${locale === 'ar' ? adminStyles.textEnd : adminStyles.textStart}`}>
                                  {listing.propertyKeyword.split(',').map((keyword, index) => {
                                    const trimmedKeyword = keyword.trim();
                                    if (!trimmedKeyword) return null;
                                    const translatedKeyword = translateKeywordWithT(trimmedKeyword, tCommon);
                                    return (
                                      <span key={index} className={adminStyles.keywordTag}>
                                        {translatedKeyword}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                              <div className={`text-date ${locale === 'ar' ? adminStyles.textEnd : adminStyles.textStart}`}>
                                {t('postingDate')}: {formatDate(listing.createdAt)}
                              </div>
                              <div className={`text-1 text-color-3 ${locale === 'ar' ? adminStyles.textEnd : adminStyles.textStart} ${locale === 'ar' ? adminStyles.dirRtl : adminStyles.dirLtr}`}>
                                {locale === 'ar' && listing.address_ar ? listing.address_ar : listing.address}
                              </div>
                              <div className={`text-btn text-color-primary ${locale === 'ar' ? adminStyles.textEnd : adminStyles.textStart}`}>
                                {formatPriceWithCurrency(listing?.propertyPrice, listing?.currency)}
                                {((listing.status?.toLowerCase() === 'rent' || listing.status?.toLowerCase() === 'for rent') && listing.rentType) && ` / ${listing.rentType}`}
                              </div>
                              
                              {/* Info Tags - ID and Views */}
                              <div className={`${adminStyles.infoRow} ${locale === 'ar' ? adminStyles.infoRowRtl : ''}`}>
                                <div className={adminStyles.idTag}>
                                  ID: {listing.propertyId || listing._id.substring(0, 8).toUpperCase()}
                                </div>
                                <div className={adminStyles.viewsTag}>
                                  <EyeIcon width={14} height={14} stroke="#333" fill="none" className={adminStyles.iconShrink} />
                                  <span>{listing.visitCount || 0} {t('views')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={`status-wrap ${adminStyles.statusWrap}`}>
                            {(() => {
                              const normalizedStatus = listing.status?.toLowerCase() || '';
                              const isSale = normalizedStatus === 'sale' || normalizedStatus === 'for sale';
                              const isRent = normalizedStatus === 'rent' || normalizedStatus === 'for rent';
                              const statusClass = listing.isSold ? adminStyles.btnStatusSold : isSale ? adminStyles.btnStatusSale : adminStyles.btnStatusRent;
                              return (
                                <span className={`btn-status ${adminStyles.btnStatus} ${statusClass}`}>
                                  {listing.isSold ? t('sold') : isSale ? t('forSale') : t('forRent')}
                                </span>
                              );
                            })()}
                            {(() => {
                              const approval = listing.approvalStatus?.toLowerCase();
                              const approvalClass = approval === 'pending' ? adminStyles.btnStatusPending : approval === 'approved' ? adminStyles.btnStatusApproved : approval === 'closed' ? adminStyles.btnStatusClosed : approval === 'rejected' ? adminStyles.btnStatusRejected : adminStyles.btnStatusPending;
                              return (
                                <span className={`btn-status ${adminStyles.btnStatus} ${adminStyles.btnStatusCapitalize} ${approvalClass}`}>
                                  {approval === 'pending' ? `⏳ ${t('pending')}` : approval === 'approved' ? `✓ ${t('approved')}` : approval === 'closed' ? `🔒 ${t('closed')}` : approval === 'rejected' ? `❌ ${t('rejected')}` : `⏳ ${t('pending')}`}
                                </span>
                              );
                            })()}
                          </div>
                        </td>
                        <td>
                          <ul className={`list-action ${adminStyles.listActionCenter} ${adminStyles.dirLtr}`}>
                            <li>
                              <button
                                onClick={() => handleToggleFeatured(listing)}
                                disabled={featuredLoadingId === listing._id}
                                className={`item ${adminStyles.actionBtn} ${adminStyles.actionBtnFeatured} ${listing.isFeatured ? adminStyles.actionBtnFeaturedActive : ''} ${featuredLoadingId === listing._id ? adminStyles.actionBtnWait : ''}`}
                                title={listing.isFeatured ? 'Featured in Fresh Listings (click to remove)' : 'Feature for Fresh Listings'}
                              >
                                {featuredLoadingId === listing._id ? (
                                  <span className={adminStyles.loadingDots}>...</span>
                                ) : (
                                  <svg width={20} height={20} viewBox="0 0 24 24" fill={listing.isFeatured ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                )}
                              </button>
                              {listing.isFeatured && (
                                <span className={adminStyles.featuredOrderWrap}>
                                  <label htmlFor={`featured-order-${listing._id}`} className={adminStyles.featuredOrderLabel}>#</label>
                                  <input
                                    id={`featured-order-${listing._id}`}
                                    type="number"
                                    min={1}
                                    value={featuredOrderDraft[listing._id] !== undefined ? featuredOrderDraft[listing._id] : (listing.featuredOrder ?? '')}
                                    placeholder=""
                                    disabled={featuredLoadingId === listing._id}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setFeaturedOrderDraft((prev) => ({ ...prev, [listing._id]: v }));
                                    }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSaveFeaturedOrder(listing); } }}
                                    title="Position on homepage (1 = first). Click Save to apply; others will shift."
                                    className={adminStyles.featuredOrderInput}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSaveFeaturedOrder(listing)}
                                    disabled={featuredLoadingId === listing._id}
                                    title="Save order (others with same or higher number will shift down)"
                                    className={adminStyles.saveOrderBtn}
                                  >
                                    {featuredLoadingId === listing._id ? '...' : 'Save'}
                                  </button>
                                </span>
                              )}
                            </li>
                            <li>
                              <button 
                                onClick={() => handleEditProperty(listing)} 
                                className={`item ${adminStyles.actionBtn}`}
                                title={t('edit')}
                              >
                                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={adminStyles.actionBtnSvg}>
                                  <path d="M11.2413 2.9915L12.366 1.86616C12.6005 1.63171 12.9184 1.5 13.25 1.5C13.5816 1.5 13.8995 1.63171 14.134 1.86616C14.3685 2.10062 14.5002 2.4186 14.5002 2.75016C14.5002 3.08173 14.3685 3.39971 14.134 3.63416L4.55467 13.2135C4.20222 13.5657 3.76758 13.8246 3.29 13.9668L1.5 14.5002L2.03333 12.7102C2.17552 12.2326 2.43442 11.7979 2.78667 11.4455L11.242 2.9915H11.2413ZM11.2413 2.9915L13 4.75016" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {t('edit')}
                              </button>
                            </li>
                            <li>
                              <button 
                                onClick={() => handleMarkSold(listing)} 
                                className={`item ${adminStyles.actionBtn} ${listing.isSold ? adminStyles.actionBtnSold : ''}`}
                                title={listing.isSold ? t('unmarkAsSold') : t('markAsSold')}
                              >
                                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={listing.isSold ? adminStyles.actionBtnSvgSold : adminStyles.actionBtnSvg}>
                                  <path
                                    d="M12.2427 12.2427C13.3679 11.1175 14.0001 9.59135 14.0001 8.00004C14.0001 6.40873 13.3679 4.8826 12.2427 3.75737C11.1175 2.63214 9.59135 2 8.00004 2C6.40873 2 4.8826 2.63214 3.75737 3.75737M12.2427 12.2427C11.1175 13.3679 9.59135 14.0001 8.00004 14.0001C6.40873 14.0001 4.8826 13.3679 3.75737 12.2427C2.63214 11.1175 2 9.59135 2 8.00004C2 6.40873 2.63214 4.8826 3.75737 3.75737M12.2427 12.2427L3.75737 3.75737"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {listing.isSold ? t('unmarkAsSold') : t('markAsSold')}
                              </button>
                            </li>
                            <li>
                              <button 
                                onClick={() => handleDeleteProperty(listing)} 
                                className={`remove-file item ${adminStyles.actionBtn}`}
                                title={t('delete')}
                              >
                                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={adminStyles.actionBtnSvg}>
                                  <path d="M9.82667 6.00035L9.596 12.0003M6.404 12.0003L6.17333 6.00035M12.8187 3.86035C13.0467 3.89501 13.2733 3.93168 13.5 3.97101M12.8187 3.86035L12.1067 13.1157C12.0776 13.4925 11.9074 13.8445 11.63 14.1012C11.3527 14.3579 10.9886 14.5005 10.6107 14.5003H5.38933C5.0114 14.5005 4.64735 14.3579 4.36999 14.1012C4.09262 13.8445 3.92239 13.4925 3.89333 13.1157L3.18133 3.86035M12.8187 3.86035C12.0492 3.74403 11.2758 3.65574 10.5 3.59568M3.18133 3.86035C2.95333 3.89435 2.72667 3.93101 2.5 3.97035M3.18133 3.86035C3.95076 3.74403 4.72416 3.65575 5.5 3.59568M10.5 3.59568V2.98501C10.5 2.19835 9.89333 1.54235 9.10667 1.51768C8.36908 1.49411 7.63092 1.49411 6.89333 1.51768C6.10667 1.54235 5.5 2.19901 5.5 2.98501V3.59568M10.5 3.59568C8.83581 3.46707 7.16419 3.46707 5.5 3.59568" strokeLinecap="round" strokeLinejoin="round" />
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
            
            {/* Pagination - Keep numbers in English and LTR direction for both languages */}
            {!loading && !error && displayListings.length > 0 && pagination && pagination.pages > 1 && (
              <ul className={`wg-pagination ${adminStyles.paginationWrap}`}>
                <li className={`arrow ${currentPage === 1 ? 'disabled' : ''}`}>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePrevPage();
                    }}
                    className={currentPage === 1 ? adminStyles.paginationArrowDisabled : adminStyles.paginationArrow}
                  >
                    <i className="icon-arrow-left" />
                  </a>
                </li>
                {getPageNumbers().map((page, index) => (
                  <li key={index} className={currentPage === page ? 'active' : ''}>
                    {page === '...' ? (
                      <span className={adminStyles.paginationEllipsis}>...</span>
                    ) : (
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageClick(page);
                        }}
                        className={adminStyles.paginationArrow}
                      >
                        {page}
                      </a>
                    )}
                  </li>
                ))}
                <li className={`arrow ${currentPage >= totalPages ? 'disabled' : ''}`}>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handleNextPage();
                    }}
                    className={currentPage >= totalPages ? adminStyles.paginationArrowDisabled : adminStyles.paginationArrow}
                  >
                    <i className="icon-arrow-right" />
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
        {/* .footer-dashboard */}
        <DashboardFooter />
        {/* .footer-dashboard */}
      </div>
      <div className="overlay-dashboard" />

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

