"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from '@tanstack/react-query';
import DropdownSelect from "../common/DropdownSelect";
import { listingAPI } from "@/apis/listing";
import EditPropertyModal from "../modals/EditPropertyModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import Toast from "../common/Toast";
import LocationLoader from "../common/LocationLoader";
import DashboardFooter from "../common/DashboardFooter";
import { EyeIcon } from "../icons/EyeIcon";
import logger from "@/utlis/logger";
import styles from "./Property.module.css";
import { useTranslations, useLocale } from 'next-intl';
import { translateKeywordWithT } from '@/utils/translateKeywords';

export default function Property() {
  const t = useTranslations('agent.property');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All');
  const [approvalFilter, setApprovalFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
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
  

  // Get user from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Check if agent is blocked
  const isAgentBlocked = user?.isBlocked === true;

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  // Handle edit property
  const handleEditProperty = (property) => {
    // Check if agent is blocked
    if (isAgentBlocked) {
      showToast('Your account is blocked. This action is disabled.', 'error');
      return;
    }

    // Check if user has a valid token
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please log in to perform this action.', 'error');
      return;
    }

    setSelectedProperty(property);
    setEditModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedProperty(null);
  };

  // Handle successful update
  const handleUpdateSuccess = () => {
    // Refetch the listings data
    refetch();
    showToast(t('propertyUpdated'), 'success');
  };

  // Handle export properties
  const handleExportProperties = async () => {
    if (isAgentBlocked) {
      showToast(t('accountBlocked'), 'error');
      return;
    }

    try {
      const blob = await listingAPI.exportProperties();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `properties_export_${new Date().toISOString().split('T')[0]}.csv`;
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


  // Handle mark as sold/unsold
  const handleMarkSold = (listing) => {
    // Check if agent is blocked
    if (isAgentBlocked) {
      showToast(t('accountBlocked'), 'error');
      return;
    }

    // Check if user has a valid token
    const token = localStorage.getItem('token');
    if (!token) {
      showToast(t('pleaseLogin'), 'error');
      return;
    }

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
          // Backend will automatically set soldDate when isSold is true
          // Backend will automatically clear soldDate when isSold is false
          // No need to send soldDate explicitly - backend handles it dynamically
          await listingAPI.updateListing(listing._id, updateData);
          refetch(); // Refresh the listings
          setConfirmationModal({ isOpen: false, title: '', message: '', confirmText: t('confirm'), cancelText: t('cancel'), confirmColor: '#dc3545', onConfirm: null, loading: false });
          showToast(listing.isSold ? t('propertyUnsold') : t('propertySold'), 'success');
        } catch (error) {
          logger.error(`Error marking property as ${action}:`, error);
          setConfirmationModal({ isOpen: false, title: '', message: '', confirmText: t('confirm'), cancelText: t('cancel'), confirmColor: '#dc3545', onConfirm: null, loading: false });
          
          // Show more specific error message
          const errorMessage = error?.message || error?.error || t('failedToUpdate');
          showToast(errorMessage, 'error');
        }
      },
      loading: false
    });
  };

  // Handle delete property (soft delete)
  const handleDeleteProperty = (listing) => {
    // Check if agent is blocked
    if (isAgentBlocked) {
      showToast(t('accountBlocked'), 'error');
      return;
    }

    // Check if user has a valid token
    const token = localStorage.getItem('token');
    if (!token) {
      showToast(t('pleaseLogin'), 'error');
      return;
    }

    setConfirmationModal({
      isOpen: true,
      title: t('deleteTitle'),
      message: t('deleteMessage'),
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
          // Force page reload after successful deletion
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          logger.error('Error deleting property:', error);
          logger.error('Full error object:', {
            message: error?.message,
            response: error?.response?.data,
            status: error?.response?.status,
            error: error?.error,
            stack: error?.stack
          });
          setConfirmationModal(prev => ({ ...prev, loading: false }));
          
          // Show more specific error message
          const errorMessage = error?.response?.data?.message || 
                              error?.response?.data?.error || 
                              error?.message || 
                              error?.error || 
                              (error?.response?.status === 401 ? t('unauthorizedDelete') :
                               error?.response?.status === 403 ? t('onlyDeleteOwn') :
                               error?.response?.status === 404 ? t('propertyNotFound') :
                               error?.response?.status === 500 ? t('serverError') :
                               t('failedToDelete'));
          showToast(errorMessage, 'error');
        }
      },
      loading: false
    });
  };

  // Fetch listings for the logged-in user
  const { data: listingsResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-listings', user?._id, currentPage],
    queryFn: () => {
      logger.debug('Property.jsx - Fetching listings for user:', user?._id);
      return listingAPI.getListingsByAgent(user._id, {
        page: currentPage,
        limit: itemsPerPage
      });
    },
    enabled: !!user?._id, // Only fetch if user ID exists
    staleTime: 0, // Always consider data stale to ensure fresh data
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Extract listings array and pagination info from the API response
  let listings = [];
  let totalCount = 0;
  let totalPages = 1;
  
  // Debug: Log the response structure
  if (listingsResponse) {
    logger.debug('Property.jsx - listingsResponse structure:', {
      type: typeof listingsResponse,
      isArray: Array.isArray(listingsResponse),
      hasData: !!listingsResponse.data,
      dataIsArray: Array.isArray(listingsResponse.data),
      keys: Object.keys(listingsResponse),
      response: listingsResponse
    });
  }
  
  // Debug: Log any errors
  if (isError) {
    logger.error('Property.jsx - Error fetching listings:', isError);
  }
  
  if (Array.isArray(listingsResponse)) {
    // If response is directly an array (old format)
    listings = listingsResponse;
    totalCount = listings.length;
    totalPages = Math.ceil(totalCount / itemsPerPage);
  } else if (listingsResponse?.data && Array.isArray(listingsResponse.data)) {
    // If response has data property with array (new format)
    listings = listingsResponse.data;
    totalCount = listingsResponse.pagination?.totalListings || listingsResponse.totalCount || listings.length;
    totalPages = listingsResponse.pagination?.totalPages || listingsResponse.totalPages || Math.ceil(totalCount / itemsPerPage);
  } else if (listingsResponse && Array.isArray(listingsResponse)) {
    // Fallback for direct array
    listings = listingsResponse;
    totalCount = listings.length;
    totalPages = Math.ceil(totalCount / itemsPerPage);
  }
  
  // Ensure listings is always an array
  if (!Array.isArray(listings)) {
    logger.warn('Property.jsx - Listings is not an array:', listings);
    listings = [];
  }

  // Filter listings based on search (client-side filtering for search only)
  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.propertyKeyword?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          listing.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Fix Property Type filter logic - normalize status to handle both "For Sale"/"sale" and "For Rent"/"rent"
    const normalizedStatus = listing.status?.toLowerCase() || '';
    const isSale = normalizedStatus === 'sale' || normalizedStatus === 'for sale';
    const isRent = normalizedStatus === 'rent' || normalizedStatus === 'for rent';
    const matchesStatus = statusFilter === 'All' || 
                         (statusFilter === 'For Sale' && isSale) ||
                         (statusFilter === 'For Rent' && isRent);
    
    // Use approvalStatusOriginal if available (from translation), otherwise use approvalStatus
    const actualApprovalStatus = (listing.approvalStatusOriginal || listing.approvalStatus?.toLowerCase() || listing.approvalStatus);
    const matchesApproval = approvalFilter === 'All' || 
                           actualApprovalStatus === approvalFilter.toLowerCase();
    
    const matchesPropertyType = propertyTypeFilter === 'All' || 
                               listing.propertyType === propertyTypeFilter;
    
    // Debug logging
    logger.debug('Filter Debug:', {
      listingTitle: listing.propertyKeyword,
      listingStatus: listing.status,
      listingPropertyType: listing.propertyType,
      statusFilter,
      propertyTypeFilter,
      matchesStatus,
      matchesPropertyType,
      approvalFilter,
      matchesApproval,
      matchesSearch,
      finalMatch: matchesSearch && matchesStatus && matchesPropertyType && matchesApproval
    });
    
    return matchesSearch && matchesStatus && matchesPropertyType && matchesApproval;
  });

  // Use filtered listings for display
  const displayListings = filteredListings;
  
  // Calculate display range for pagination info
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, displayListings.length);

  // Reset to page 1 when filters change (except search which is client-side)
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, propertyTypeFilter, approvalFilter]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get first image or fallback
  const getPropertyImage = (listing) => {
    if (listing.images && listing.images.length > 0) {
      return listing.images[0].url;
    }
    return '/images/section/property-1.jpg'; // Fallback image
  };

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
    <div className="main-content w-100">
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
                  options={[t('all'), t('pending'), t('approved'), t('closed')]}
                  addtionalParentClass=""
                  onChange={(value) => setApprovalFilter(value === t('all') ? 'All' : value === t('pending') ? 'Pending' : value === t('approved') ? 'Approved' : 'Closed')}
                  translateOption={(option) => {
                    if (option === 'All') return t('all');
                    if (option === 'Pending') return t('pending');
                    if (option === 'Approved') return t('approved');
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
        <div className="widget-box-2 wd-listing mt-20" style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 className="title" style={{ textAlign: locale === 'ar' ? 'right' : 'left', margin: 0 }}>
              {t('title')}
              {user && <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: locale === 'ar' ? '0' : '10px', marginRight: locale === 'ar' ? '10px' : '0' }}>
                ({filteredListings.length} {t('total')} - {t('showing')} {startIndex + 1}-{Math.min(endIndex, filteredListings.length)})
              </span>}
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleExportProperties}
                disabled={isAgentBlocked || filteredListings.length === 0}
                className="tf-btn"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #6366f1',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  cursor: (isAgentBlocked || filteredListings.length === 0) ? 'not-allowed' : 'pointer',
                  opacity: (isAgentBlocked || filteredListings.length === 0) ? 0.5 : 1,
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
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
              {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <LocationLoader 
                    size="medium" 
                    message={t('loading')}
                  />
                </div>
              ) : isError ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#dc3545' }}>
                  <p>{t('errorLoading')}</p>
                </div>
              ) : filteredListings.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <p>{t('noProperties')} <Link href="/add-property" className={styles.addPropertyLink}>{t('addFirstProperty')}</Link></p>
                </div>
              ) : (
                <table style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
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
                                          fontWeight: '500',
                                          direction: locale === 'ar' ? 'rtl' : 'ltr',
                                          textAlign: 'center',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        {translatedKeyword}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                              <div className="text-date" style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                                {t('postingDate')}: {formatDate(listing.createdAt)}
                              </div>
                              <div className="text-1 text-color-3" style={{ textAlign: locale === 'ar' ? 'right' : 'left', direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
                                {locale === 'ar' && listing.address_ar ? listing.address_ar : listing.address}
                              </div>
                              <div className="text-btn text-color-primary" style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                                ${listing.propertyPrice?.toLocaleString()}
                                {((listing.status?.toLowerCase() === 'rent' || listing.status?.toLowerCase() === 'for rent') && listing.rentType) && ` / ${listing.rentType}`}
                              </div>
                              
                              {/* Info Tags - ID and Views */}
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                marginTop: '12px',
                                flexWrap: 'wrap',
                                justifyContent: locale === 'ar' ? 'flex-end' : 'flex-start'
                              }}>
                                {/* Property ID Tag */}
                                <div style={{
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: 'white',
                                  padding: '5px 12px',
                                  borderRadius: '16px',
                                  fontSize: '10px',
                                  fontWeight: '700',
                                  fontFamily: 'monospace',
                                  letterSpacing: '0.5px',
                                  textTransform: 'uppercase',
                                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)',
                                  border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}>
                                  ID: {listing.propertyId || listing._id.substring(0, 8).toUpperCase()}
                                </div>
                                
                                {/* Views Count */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  background: '#c3c3c3',
                                  color: 'black',
                                  padding: '5px 12px',
                                  borderRadius: '16px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}>
                                  <EyeIcon 
                                    width={14} 
                                    height={14} 
                                    stroke="#333"
                                    fill="none"
                                    style={{ flexShrink: 0 }}
                                  />
                                  <span>{listing.visitCount || 0} {t('views')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="status-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                            {(() => {
                              const normalizedStatus = listing.status?.toLowerCase() || '';
                              const isSale = normalizedStatus === 'sale' || normalizedStatus === 'for sale';
                              const isRent = normalizedStatus === 'rent' || normalizedStatus === 'for rent';
                              return (
                                <span className="btn-status" style={{
                                  background: listing.isSold ? '#dc3545' : isSale ? '#00b14f' : '#007bff',
                                  color: 'white',
                                  padding: '8px',
                                  height: '40px',
                                  minWidth: '80px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  textAlign: 'center',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  border: 'none',
                                  outline: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  {listing.isSold ? t('sold') : isSale ? t('forSale') : t('forRent')}
                                </span>
                              );
                            })()}
                            <span className="btn-status" style={{
                              background: 
                                (listing.approvalStatusOriginal || listing.approvalStatus?.toLowerCase()) === 'pending' ? '#ff9500' : 
                                (listing.approvalStatusOriginal || listing.approvalStatus?.toLowerCase()) === 'approved' ? '#00b14f' : 
                                (listing.approvalStatusOriginal || listing.approvalStatus?.toLowerCase()) === 'closed' ? '#6c757d' : '#dc3545',
                              color: 'white',
                              padding: '8px',
                              height: '40px',
                              minWidth: '80px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              textAlign: 'center',
                              textTransform: 'capitalize',
                              letterSpacing: '0.3px',
                              border: 'none',
                              outline: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {(listing.approvalStatusOriginal || listing.approvalStatus?.toLowerCase()) === 'pending' ? `⏳ ${t('pending')}` : 
                               (listing.approvalStatusOriginal || listing.approvalStatus?.toLowerCase()) === 'approved' ? `✓ ${t('approved')}` :
                               (listing.approvalStatusOriginal || listing.approvalStatus?.toLowerCase()) === 'closed' ? `🔒 ${t('closed')}` : `❌ ${t('rejected')}`}
                            </span>
                          </div>
                        </td>
                        <td>
                          <ul className="list-action" style={{ justifyContent: 'center', direction: 'ltr' }}>
                            <li>
                              <button 
                                onClick={() => handleEditProperty(listing)} 
                                disabled={isAgentBlocked}
                                className="item"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  cursor: isAgentBlocked ? 'not-allowed' : 'pointer',
                                  color: isAgentBlocked ? '#D3D3D3' : '#A3ABB0',
                                  fontSize: '14px',
                                  opacity: isAgentBlocked ? 0.5 : 1
                                }}
                                title={isAgentBlocked ? t('accountBlocked') : t('edit')}
                              >
                                <svg width={16}
                                  height={16}
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                 aria-hidden="true">
                                  <path
                                    d="M11.2413 2.9915L12.366 1.86616C12.6005 1.63171 12.9184 1.5 13.25 1.5C13.5816 1.5 13.8995 1.63171 14.134 1.86616C14.3685 2.10062 14.5002 2.4186 14.5002 2.75016C14.5002 3.08173 14.3685 3.39971 14.134 3.63416L4.55467 13.2135C4.20222 13.5657 3.76758 13.8246 3.29 13.9668L1.5 14.5002L2.03333 12.7102C2.17552 12.2326 2.43442 11.7979 2.78667 11.4455L11.242 2.9915H11.2413ZM11.2413 2.9915L13 4.75016"
                                    stroke={isAgentBlocked ? '#D3D3D3' : '#A3ABB0'}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {t('edit')}
                              </button>
                            </li>
                            <li>
                              <button 
                                onClick={() => handleMarkSold(listing)} 
                                disabled={isAgentBlocked}
                                className="item"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  cursor: isAgentBlocked ? 'not-allowed' : 'pointer',
                                  color: isAgentBlocked ? '#D3D3D3' : (listing.isSold ? '#ff6b35' : '#A3ABB0'),
                                  fontSize: '14px',
                                  fontWeight: listing.isSold ? '600' : '400',
                                  opacity: isAgentBlocked ? 0.5 : 1
                                }}
                                title={isAgentBlocked ? t('accountBlocked') : (listing.isSold ? t('unmarkAsSold') : t('markAsSold'))}
                              >
                                <svg width={16}
                                  height={16}
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                 aria-hidden="true">
                                  <path
                                    d="M12.2427 12.2427C13.3679 11.1175 14.0001 9.59135 14.0001 8.00004C14.0001 6.40873 13.3679 4.8826 12.2427 3.75737C11.1175 2.63214 9.59135 2 8.00004 2C6.40873 2 4.8826 2.63214 3.75737 3.75737M12.2427 12.2427C11.1175 13.3679 9.59135 14.0001 8.00004 14.0001C6.40873 14.0001 4.8826 13.3679 3.75737 12.2427C2.63214 11.1175 2 9.59135 2 8.00004C2 6.40873 2.63214 4.8826 3.75737 3.75737M12.2427 12.2427L3.75737 3.75737"
                                    stroke={isAgentBlocked ? '#D3D3D3' : (listing.isSold ? '#ff6b35' : '#A3ABB0')}
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
                                disabled={isAgentBlocked}
                                className="remove-file item"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  cursor: isAgentBlocked ? 'not-allowed' : 'pointer',
                                  color: isAgentBlocked ? '#D3D3D3' : '#A3ABB0',
                                  fontSize: '14px',
                                  opacity: isAgentBlocked ? 0.5 : 1
                                }}
                                title={isAgentBlocked ? t('accountBlocked') : t('delete')}
                              >
                                <svg width={16}
                                  height={16}
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                 aria-hidden="true">
                                  <path
                                    d="M9.82667 6.00035L9.596 12.0003M6.404 12.0003L6.17333 6.00035M12.8187 3.86035C13.0467 3.89501 13.2733 3.93168 13.5 3.97101M12.8187 3.86035L12.1067 13.1157C12.0776 13.4925 11.9074 13.8445 11.63 14.1012C11.3527 14.3579 10.9886 14.5005 10.6107 14.5003H5.38933C5.0114 14.5005 4.64735 14.3579 4.36999 14.1012C4.09262 13.8445 3.92239 13.4925 3.89333 13.1157L3.18133 3.86035M12.8187 3.86035C12.0492 3.74403 11.2758 3.65574 10.5 3.59568M3.18133 3.86035C2.95333 3.89435 2.72667 3.93101 2.5 3.97035M3.18133 3.86035C3.95076 3.74403 4.72416 3.65575 5.5 3.59568M10.5 3.59568V2.98501C10.5 2.19835 9.89333 1.54235 9.10667 1.51768C8.36908 1.49411 7.63092 1.49411 6.89333 1.51768C6.10667 1.54235 5.5 2.19901 5.5 2.98501V3.59568M10.5 3.59568C8.83581 3.46707 7.16419 3.46707 5.5 3.59568"
                                    stroke={isAgentBlocked ? '#D3D3D3' : '#A3ABB0'}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
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
            {!isLoading && !isError && filteredListings.length > 0 && (
              <ul 
                className="wg-pagination" 
                style={{ 
                  marginTop: '20px',
                  direction: 'ltr', // Force LTR for pagination in both languages
                  textAlign: 'left' // Keep left alignment
                }}
              >
                <li className={`arrow ${currentPage === 1 ? 'disabled' : ''}`}>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePrevPage();
                    }}
                    style={{ 
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1
                    }}
                  >
                    <i className="icon-arrow-left" />
                  </a>
                </li>
                
                {getPageNumbers().map((page, index) => (
                  <li key={index} className={currentPage === page ? 'active' : ''}>
                    {page === '...' ? (
                      <span style={{ padding: '0 10px' }}>...</span>
                    ) : (
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageClick(page);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {page}
                      </a>
                    )}
                  </li>
                ))}
                
                <li className={`arrow ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handleNextPage();
                    }}
                    style={{ 
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1
                    }}
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
      <EditPropertyModal
        isOpen={editModalOpen}
        onClose={handleCloseModal}
        property={selectedProperty}
        onSuccess={handleUpdateSuccess}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, title: '', message: '', confirmText: t('confirm'), cancelText: t('cancel'), confirmColor: '#dc3545', onConfirm: null, loading: false, showInput: false })}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        confirmColor={confirmationModal.confirmColor}
        loading={confirmationModal.loading}
        showInput={confirmationModal.showInput || false}
        inputLabel={confirmationModal.inputLabel || ''}
        inputPlaceholder={confirmationModal.inputPlaceholder || ''}
        inputRequired={confirmationModal.inputRequired || false}
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
