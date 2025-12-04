"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from '@tanstack/react-query';
import { favoriteAPI } from "@/apis/favorites";
import ConfirmationModal from "../modals/ConfirmationModal";
import Toast from "../common/Toast";
import LocationLoader from "../common/LocationLoader";
import DashboardFooter from "../common/DashboardFooter";
import { useFavorites } from "@/components/contexts/FavoritesContext";
import logger from "@/utlis/logger";
import styles from "./Favorites.module.css";
import { useTranslations, useLocale } from 'next-intl';
import { translateKeywordWithT } from '@/utils/translateKeywords';

export default function Favorites() {
  const t = useTranslations('agent.favorites');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { favoritesCount, refreshFavoritesCount } = useFavorites();
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
      const parsedUser = JSON.parse(userData);
      logger.debug('👤 User loaded from localStorage:', parsedUser);
      logger.debug('   - Email:', parsedUser.email);
      logger.debug('   - Role:', parsedUser.role);
      logger.debug('   - ID:', parsedUser._id);
      setUser(parsedUser);
    } else {
      logger.warn('⚠️ No user found in localStorage');
    }
  }, []);

  // Fetch favorites with pagination
  const { data: favoritesData, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-favorites', user?._id, currentPage],
    queryFn: async () => {
      const result = await favoriteAPI.getFavorites({ page: currentPage, limit: itemsPerPage });
      return result;
    },
    enabled: !!user,
    retry: 1,
    keepPreviousData: true
  });

  const favorites = favoritesData?.data || [];
  const pagination = favoritesData?.pagination || {};

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get property image
  const getPropertyImage = (property) => {
    if (property?.images && property.images.length > 0) {
      return property.images[0].url;
    }
    return '/images/default.jpg';
  };

  // Get property status display
  const getStatusDisplay = (property) => {
    if (!property) return 'N/A';
    if (property.isSold) return t('sold');
    if (property.approvalStatus === 'closed') return t('closed');
    if (property.approvalStatus === 'pending') return t('pending');
    if (property.approvalStatus === 'approved') {
      return property.status === 'rent' ? t('forRent') : t('forSale');
    }
    return property.status === 'rent' ? t('forRent') : t('forSale');
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (pagination.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages || 1;
    
    if (totalPages <= 5) {
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

  // Handle delete favorite
  const handleDeleteFavorite = (favorite) => {
    const propertyName = favorite.propertyId?.propertyKeyword || t('thisProperty');
    setConfirmationModal({
      isOpen: true,
      title: t('removeFromFavorites'),
      message: t('removeFromFavoritesMessage', { property: propertyName }),
      confirmText: t('remove'),
      cancelText: t('cancel'),
      confirmColor: '#dc3545',
      onConfirm: async () => {
        setConfirmationModal(prev => ({ ...prev, loading: true }));
        try {
          await favoriteAPI.removeFavorite(favorite.propertyId._id);
          refetch(); // Refresh the favorites list
          refreshFavoritesCount(); // Update the global count
          setConfirmationModal({ isOpen: false, title: '', message: '', confirmText: t('confirm'), cancelText: t('cancel'), confirmColor: '#dc3545', onConfirm: null, loading: false });
          showToast(t('removedSuccessfully'), 'success');
        } catch (error) {
          logger.error('Error removing favorite:', error);
          setConfirmationModal({ isOpen: false, title: '', message: '', confirmText: t('confirm'), cancelText: t('cancel'), confirmColor: '#dc3545', onConfirm: null, loading: false });
          const errorMessage = error?.message || error?.error || t('failedToRemove');
          showToast(errorMessage, 'error');
        }
      },
      loading: false
    });
  };

  return (
    <div className="main-content w-100">
      <div className="main-content-inner" style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
        <div className="button-show-hide show-mb">
          <span className="body-1">{t('showDashboard')}</span>
        </div>
        <div className="widget-box-2 wd-listing">
          <h3 className="title" style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
            {t('title')}
            {favoritesCount > 0 && (
              <span className="favorites-title-count">
                ({favoritesCount} {t('total')} {favoritesCount === 1 ? t('property') : t('properties')})
              </span>
            )}
          </h3>

          {isLoading && (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <LocationLoader 
                size="large" 
                message={t('loadingFavoriteProperties')}
              />
            </div>
          )}

          {isError && (
            <div className="favorites-error" style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
              <p>{t('failedToLoad')}</p>
            </div>
          )}

          {!isLoading && !isError && favorites.length === 0 && (
            <div className="favorites-empty" style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
              <p>{t('noFavoritesYet')}</p>
              <Link href="/property-list" className="favorites-browse-link">
                {t('browseProperties')}
              </Link>
            </div>
          )}

          {!isLoading && !isError && favorites.length > 0 && (
            <div className="wrap-table">
              <div className="table-responsive">
                <table style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>{t('listing')}</th>
                      <th style={{ textAlign: 'center' }}>{t('status')}</th>
                      <th style={{ textAlign: 'center' }}>{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {favorites.map((favorite) => {
                      const property = favorite.propertyId;
                      if (!property) return null;

                      return (
                        <tr key={favorite._id} className="file-delete">
                          <td>
                            <div className="listing-box">
                              <div className="images">
                                <Image
                                  alt={property.propertyKeyword || 'Property'}
                                  src={getPropertyImage(property)}
                                  width={615}
                                  height={405}
                                />
                              </div>
                              <div className="content" style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                                <div className="title" style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                                  <Link
                                    href={`/property-detail/${property._id}`}
                                    className="link"
                                  >
                                    {property.propertyType || tCommon('property')}
                                  </Link>
                                </div>
                                {/* Property Keyword Tags */}
                                {property.propertyKeyword && (
                                  <div style={{ 
                                    marginTop: '16px', 
                                    marginBottom: '16px', 
                                    display: 'flex', 
                                    flexWrap: 'wrap', 
                                    gap: '6px',
                                    direction: locale === 'ar' ? 'rtl' : 'ltr',
                                    justifyContent: locale === 'ar' ? 'flex-start' : 'flex-end'
                                  }}>
                                    {property.propertyKeyword.split(',').map((keyword, index) => {
                                      const trimmedKeyword = keyword.trim();
                                      if (!trimmedKeyword) return null;
                                      const translatedKeyword = translateKeywordWithT(trimmedKeyword, tCommon);
                                      return (
                                        <span 
                                          key={index} 
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            padding: '4px 10px',
                                            backgroundColor: '#f0f0f0',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            color: '#333',
                                            fontWeight: '500',
                                            direction: locale === 'ar' ? 'rtl' : 'ltr',
                                            textAlign: 'center'
                                          }}
                                        >
                                          {translatedKeyword}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                                <div className="text-date" style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                                  {t('added')}: {formatDate(favorite.createdAt || favorite.addedAt)}
                                </div>
                                <div className="text-btn text-color-primary" style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
                                  ${property.propertyPrice?.toLocaleString() || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span 
                              className={`btn-status property-status-badge ${
                                property.isSold || property.approvalStatus === 'closed' ? 'status-closed' :
                                property.approvalStatus === 'pending' ? 'status-pending' :
                                property.status === 'rent' ? 'status-rent' : 'status-sale'
                              }`}
                            >
                              {getStatusDisplay(property)}
                            </span>
                          </td>
                          <td>
                            <ul className="list-action">
                              <li>
                                <button
                                  onClick={() => handleDeleteFavorite(favorite)}
                                  className="remove-file item favorites-delete-button"
                                >
                                  <svg width={16}
                                    height={16}
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                   aria-hidden="true">
                                    <path
                                      d="M9.82667 6.00035L9.596 12.0003M6.404 12.0003L6.17333 6.00035M12.8187 3.86035C13.0467 3.89501 13.2733 3.93168 13.5 3.97101M12.8187 3.86035L12.1067 13.1157C12.0776 13.4925 11.9074 13.8445 11.63 14.1012C11.3527 14.3579 10.9886 14.5005 10.6107 14.5003H5.38933C5.0114 14.5005 4.64735 14.3579 4.36999 14.1012C4.09262 13.8445 3.92239 13.4925 3.89333 13.1157L3.18133 3.86035M12.8187 3.86035C12.0492 3.74403 11.2758 3.65574 10.5 3.59568M3.18133 3.86035C2.95333 3.89435 2.72667 3.93101 2.5 3.97035M3.18133 3.86035C3.95076 3.74403 4.72416 3.65575 5.5 3.59568M10.5 3.59568V2.98501C10.5 2.19835 9.89333 1.54235 9.10667 1.51768C8.36908 1.49411 7.63092 1.49411 6.89333 1.51768C6.10667 1.54235 5.5 2.19901 5.5 2.98501V3.59568M10.5 3.59568C8.83581 3.46707 7.16419 3.46707 5.5 3.59568"
                                      stroke="currentColor"
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
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="favorites-pagination" style={{ direction: 'ltr', textAlign: 'left' }}>
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevPage}
                    disabled={!pagination.hasPreviousPage}
                    className="favorites-pagination-button"
                  >
                    « {t('previous')}
                  </button>

                  {/* Page Numbers */}
                  <div className="favorites-pagination-numbers">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="favorites-pagination-ellipsis">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageClick(page)}
                          className={`favorites-pagination-number ${currentPage === page ? 'favorites-pagination-number-active' : ''}`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={!pagination.hasNextPage}
                    className="favorites-pagination-button"
                  >
                    {t('next')} »
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* .footer-dashboard */}
        <DashboardFooter />
        {/* .footer-dashboard */}
      </div>
      <div className="overlay-dashboard" />

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
