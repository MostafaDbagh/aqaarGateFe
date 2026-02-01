"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import DropdownSelect from "../common/DropdownSelect";
import LocationLoader from "../common/LocationLoader";
import { useMessagesByAgent, useMessageMutations } from "@/apis/hooks";
import Toast from "../common/Toast";
import { CopyIcon, CheckIcon } from "@/components/icons";
import styles from "./Messages.module.css";

export default function Messages() {
  const t = useTranslations('agent.messages');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [messageTypeFilter, setMessageTypeFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const [copiedId, setCopiedId] = useState(null);

  const [replyModal, setReplyModal] = useState({
    isOpen: false,
    message: null,
    response: ''
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    message: null
  });

  // Get user from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch messages with current filters and pagination
  const { data: messagesData, isLoading, isError, refetch } = useMessagesByAgent(
    user?._id,
    {
      page: currentPage,
      limit: itemsPerPage,
      status: statusFilter,
      messageType: messageTypeFilter,
      propertyId: propertyFilter,
      search: searchTerm
    }
  );

  const messages = Array.isArray(messagesData?.data) ? messagesData.data : [];
  const pagination = messagesData?.pagination ?? {};
  const stats = messagesData?.stats ?? {};
  const filterOptions = messagesData?.filterOptions ?? {};
  const properties = Array.isArray(filterOptions.properties) ? filterOptions.properties : [];

  // Message mutations
  const {
    markAsRead,
    replyToMessage,
    archiveMessage,
    deleteMessage,
    isMarkingAsRead,
    isReplying,
    isArchiving,
    isDeleting
  } = useMessageMutations();

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => {
      setToast({ isVisible: false, message: '', type: 'success' });
    }, 3000);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1); // Reset to first page when filter changes
    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'messageType':
        setMessageTypeFilter(value);
        break;
      case 'property':
        setPropertyFilter(value);
        break;
      default:
        break;
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle mark as read
  const handleMarkAsRead = async (messageId) => {
    try {
      await markAsRead(messageId);
      showToast(t('messageMarkedAsRead'));
      refetch();
    } catch (error) {
      showToast(t('failedToMarkAsRead'), 'error');
    }
  };

  // Handle reply
  const handleReply = async () => {
    if (!replyModal.response.trim()) {
      showToast(t('pleaseEnterResponse'), 'error');
      return;
    }

    try {
      await replyToMessage({
        messageId: replyModal.message._id,
        response: replyModal.response
      });
      showToast(t('messageReplied'));
      setReplyModal({ isOpen: false, message: null, response: '' });
      refetch();
    } catch (error) {
      showToast(t('failedToReply'), 'error');
    }
  };

  // Handle archive
  const handleArchive = async (messageId) => {
    try {
      await archiveMessage(messageId);
      showToast(t('messageArchived'));
      refetch();
    } catch (error) {
      showToast(t('failedToArchive'), 'error');
    }
  };

  // Handle delete
  const handleDelete = async (messageId) => {
    try {
      await deleteMessage(messageId);
      showToast(t('messageDeleted'));
      setDeleteModal({ isOpen: false, message: null });
      refetch();
    } catch (error) {
      showToast(t('failedToDelete'), 'error');
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (message) => {
    setDeleteModal({ isOpen: true, message });
  };

  // Handle copy property ID (track copied row by messageId so only that row shows as copied)
  const handleCopyPropertyId = async (propertyId, messageId) => {
    try {
      await navigator.clipboard.writeText(propertyId);
      setCopiedId(messageId);
      showToast(t('idCopied'));
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      showToast(t('failedToCopy'), 'error');
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Translate message type
  const translateMessageType = (messageType) => {
    if (!messageType) return '';
    const normalized = messageType.replace('_', '').toLowerCase();
    const typeMap = {
      'inquiry': 'inquiry',
      'viewingrequest': 'viewingRequest',
      'offer': 'offer',
      'question': 'question',
      'complaint': 'complaint'
    };
    const key = typeMap[normalized] || normalized;
    return t(key) || messageType;
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'unread':
        return 'bg-danger';
      case 'read':
        return 'bg-info';
      case 'replied':
        return 'bg-success';
      case 'archived':
        return 'bg-secondary';
      default:
        return 'bg-light';
    }
  };

  // Get message type badge color
  const getMessageTypeBadgeColor = (messageType) => {
    switch (messageType) {
      case 'inquiry':
        return 'bg-primary';
      case 'info':
        return 'bg-info';
      default:
        return 'bg-light';
    }
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const { currentPage: page, totalPages } = pagination;
    
    // Previous button
    items.push(
      <li key="prev" className={page <= 1 ? "arrow disabled" : "arrow"}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (page > 1) handlePageChange(page - 1);
          }}
          style={{ 
            cursor: page <= 1 ? 'not-allowed' : 'pointer',
            opacity: page <= 1 ? 0.5 : 1
          }}
          aria-label="Go to previous page"
        >
          <i className="icon-chevron-left" aria-hidden="true"></i>
        </a>
      </li>
    );

    // Page numbers
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i} className={i === page ? "active" : ""}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            aria-label={`Go to page ${i}`}
            aria-current={i === page ? 'page' : undefined}
          >
            {i}
          </a>
        </li>
      );
    }

    // Next button
    items.push(
      <li key="next" className={page >= totalPages ? "arrow disabled" : "arrow"}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (page < totalPages) handlePageChange(page + 1);
          }}
          style={{ 
            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
            opacity: page >= totalPages ? 0.5 : 1
          }}
          aria-label="Go to next page"
        >
          <i className="icon-chevron-right" aria-hidden="true"></i>
        </a>
      </li>
    );

    return items;
  };

  const isRTL = locale === 'ar';

  if (isLoading) {
    return (
      <div className="main-content w-100" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="main-content-inner">
          <div className="button-show-hide show-mb">
            <span className="body-1">{t('showMessages')}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px' 
          }}>
            <LocationLoader 
              size="large" 
              message={t('loading')}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="main-content w-100" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="main-content-inner">
          <div className="button-show-hide show-mb">
            <span className="body-1">{t('showMessages')}</span>
          </div>
          <div style={{ textAlign: isRTL ? 'right' : 'center', padding: '40px', color: '#dc3545' }}>
            <p>{t('errorLoading')}</p>
            <button onClick={() => refetch()} className="btn btn-primary" aria-label={t('retry')}>
              {t('retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content w-100" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="main-content-inner">
        <div className="button-show-hide show-mb">
          <span className="body-1">{t('showMessages')}</span>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4" style={{ justifyContent: 'center' }}>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {stats.total || 0}
              </div>
              <div className={styles.statLabel} style={{ textAlign: isRTL ? 'right' : 'left' }}>
                {t('totalMessages')}
              </div>
            </div>
          </div>
          
          <div className="col-md-3 col-sm-6 mb-3">
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {stats.replied || 0}
              </div>
              <div className={styles.statLabel} style={{ textAlign: isRTL ? 'right' : 'left' }}>
                {t('replied')}
              </div>
            </div>
          </div>
          
          <div className="col-md-3 col-sm-6 mb-3">
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {stats.unread || 0}
              </div>
              <div className={styles.statLabel} style={{ textAlign: isRTL ? 'right' : 'left' }}>
                {t('unread')}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('status')}</label>
                <DropdownSelect
                  options={[t('all'), t('unread'), t('read'), t('replied'), t('archived')]}
                  value={statusFilter === 'all' ? t('all') : t(statusFilter)}
                  onChange={(value) => {
                    const statusMap = { [t('all')]: 'all', [t('unread')]: 'unread', [t('read')]: 'read', [t('replied')]: 'replied', [t('archived')]: 'archived' };
                    handleFilterChange('status', statusMap[value] || 'all');
                  }}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('messageType')}</label>
                <DropdownSelect
                  options={[t('all'), t('inquiry'), t('viewingRequest'), t('offer'), t('question'), t('complaint')]}
                  value={messageTypeFilter === 'all' ? t('all') : translateMessageType(messageTypeFilter)}
                  onChange={(value) => {
                    const typeMap = { [t('all')]: 'all', [t('inquiry')]: 'inquiry', [t('viewingRequest')]: 'viewing_request', [t('offer')]: 'offer', [t('question')]: 'question', [t('complaint')]: 'complaint' };
                    handleFilterChange('messageType', typeMap[value] || 'all');
                  }}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('property')}</label>
                <DropdownSelect
                  options={[t('all'), ...properties.map(p => p?.propertyKeyword).filter(Boolean)]}
                  value={propertyFilter === 'all' ? t('all') : properties.find(p => p?._id === propertyFilter)?.propertyKeyword || t('all')}
                  onChange={(value) => {
                    if (value === t('all')) {
                      handleFilterChange('property', 'all');
                    } else {
                      const property = properties.find(p => p?.propertyKeyword === value);
                      handleFilterChange('property', property?._id || 'all');
                    }
                  }}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('search')}</label>
                <form onSubmit={handleSearch} className="d-flex">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                  />
                  <button type="submit" className="btn btn-outline-primary" aria-label={t('search')}>
                    <i className="icon-search" aria-hidden="true"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="card">
          <div className="card-header">
            <h3 className="mb-0" style={{ textAlign: isRTL ? 'right' : 'left' }}>
              {t('title')}
              {(pagination.totalMessages ?? 0) > 0 && (
                <span className="text-muted ms-2">
                  ({(pagination.totalMessages ?? 0)} {t('total')} - {t('showing')} {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, pagination.totalMessages ?? 0)})
                </span>
              )}
            </h3>
          </div>
          <div className="card-body p-0">
            {messages.length === 0 ? (
              <div className="text-center py-5" style={{ textAlign: isRTL ? 'right' : 'center' }}>
                <div className="mb-3">
                  <i className="icon-message" style={{ fontSize: '48px', color: '#6c757d' }} aria-hidden="true"></i>
                </div>
                <h5>{t('noMessages')}</h5>
                <p className="text-muted">{t('noMessagesDescription')}</p>
              </div>
            ) : (
              <div className="table-responsive" style={{ overflowX: 'auto', maxWidth: '100%' }}>
                <table className="table table-hover mb-0" style={{ minWidth: '1200px' }}>
                  <thead className="table-light">
                    <tr>
                      <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('status')}</th>
                      <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('sender')}</th>
                      <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('subject')}</th>
                      <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('price')}</th>
                      <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('propertyId')}</th>
                      <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('type')}</th>
                      <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('date')}</th>
                      <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((message) => (
                      <tr key={message._id}>
                        <td>
                          <span className={`badge ${getStatusBadgeColor(message.status)}`}>
                            {t(message.status)}
                          </span>
                        </td>
                        <td>
                          <div>
                            <strong>{message.senderName ?? '—'}</strong>
                            <br />
                            <small className="text-muted">{message.senderEmail && String(message.senderEmail).trim() ? String(message.senderEmail).trim() : '—'}</small>
                            {message.senderPhone?.trim() && (
                              <>
                                <br />
                                <small className="text-muted">{message.senderPhone.trim()}</small>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ maxWidth: '280px', minWidth: '200px' }}>
                            <strong>{tCommon('contactAgent')}</strong>
                            <div
                              style={{
                                marginTop: '6px',
                                maxHeight: '180px',
                                overflowY: 'auto',
                                wordBreak: 'break-word',
                                whiteSpace: 'pre-wrap',
                                fontSize: '12px',
                                fontWeight: 400,
                                color: '#374151',
                                lineHeight: 1.5,
                                letterSpacing: '0.01em',
                                textAlign: isRTL ? 'right' : 'left'
                              }}
                              title={message.message ?? ''}
                            >
                              {message.message?.trim() || '—'}
                            </div>
                          </div>
                        </td>
                        <td>
                          {message.propertyId ? (
                            <strong>
                              {message.propertyId.currency === 'SYP'
                                ? `SYP ${message.propertyId.propertyPrice?.toLocaleString() ?? '—'}`
                                : `$${message.propertyId.propertyPrice?.toLocaleString() ?? '—'}`}
                            </strong>
                          ) : (
                            <span className="text-muted">{t('propertyNotFound')}</span>
                          )}
                        </td>
                        <td>
                          {message.propertyId?.propertyId ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', direction: isRTL ? 'rtl' : 'ltr' }}>
                              <small className="text-muted" style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                {message.propertyId.propertyId}
                              </small>
                              <button
                                type="button"
                                className="btn btn-sm btn-link p-0"
                                onClick={() => handleCopyPropertyId(message.propertyId.propertyId, message._id)}
                                style={{
                                  padding: '4px 6px',
                                  color: copiedId === message._id ? '#28a745' : '#6c757d',
                                  textDecoration: 'none',
                                  fontSize: '14px',
                                  lineHeight: '1',
                                  minWidth: '24px',
                                  minHeight: '24px',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  transition: 'color 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                title={copiedId === message._id ? t('copied') : t('copyPropertyId')}
                                aria-label={t('copyPropertyId')}
                                onMouseEnter={(e) => {
                                  if (copiedId !== message._id) {
                                    e.target.style.color = '#007bff';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.color = copiedId === message._id ? '#28a745' : '#6c757d';
                                }}
                              >
                                {copiedId === message._id ? (
                                  <CheckIcon style={{ fontSize: '16px' }} />
                                ) : (
                                  <CopyIcon 
                                    width={16} 
                                    height={16} 
                                    stroke={copiedId === message._id ? '#28a745' : '#6c757d'}
                                  />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted">{t('na')}</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${getMessageTypeBadgeColor(message.messageType)}`}>
                            {translateMessageType(message.messageType)}
                          </span>
                        </td>
                        <td>
                          <small>{formatDate(message.createdAt)}</small>
                        </td>
                        <td>
                          <div className="btn-group" role="group" style={{ gap: '8px' }}>
                            {message.status === 'unread' && (
                              <button
                                className="btn btn-sm"
                                style={{
                                  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                  border: 'none',
                                  color: 'white',
                                  borderRadius: '8px',
                                  padding: '8px 16px',
                                  fontSize: '13px',
                                  fontWeight: '500',
                                  boxShadow: '0 2px 8px rgba(6, 182, 212, 0.2)',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                                onClick={() => handleMarkAsRead(message._id)}
                                disabled={isMarkingAsRead}
                                title={t('markAsRead')}
                                aria-label={t('markAsRead')}
                                onMouseEnter={(e) => {
                                  if (!isMarkingAsRead) {
                                    e.target.style.transform = 'translateY(-1px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.3)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isMarkingAsRead) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(6, 182, 212, 0.2)';
                                  }
                                }}
                              >
                                <i className="icon-eye" aria-hidden="true" style={{ fontSize: '14px' }}></i>
                                {isMarkingAsRead ? t('marking') : t('markAsRead')}
                              </button>
                            )}
                            <button
                              className="btn btn-sm"
                              style={{
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                border: 'none',
                                color: 'white',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontSize: '13px',
                                fontWeight: '500',
                                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                              onClick={() => handleDeleteClick(message)}
                              disabled={isDeleting}
                              title={t('deleteMessage')}
                              aria-label={t('deleteMessage')}
                              onMouseEnter={(e) => {
                                if (!isDeleting) {
                                  e.target.style.transform = 'translateY(-1px)';
                                  e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isDeleting) {
                                  e.target.style.transform = 'translateY(0)';
                                  e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.2)';
                                }
                              }}
                            >
                              <i className="icon-trash" aria-hidden="true" style={{ fontSize: '14px' }}></i>
                              {isDeleting ? t('deleting') : t('delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {(pagination.totalPages ?? 1) > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <ul className="wg-pagination">
              {generatePaginationItems()}
            </ul>
          </div>
        )}

        {/* Reply Modal */}
        {replyModal.isOpen && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('replyToMessage')}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setReplyModal({ isOpen: false, message: null, response: '' })}
                    aria-label={tCommon('close')}
                  ></button>
                </div>
                <div className="modal-body" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                  <div className="mb-3">
                    <strong>{t('from')}:</strong> {replyModal.message.senderName ?? '—'} ({replyModal.message.senderEmail && String(replyModal.message.senderEmail).trim() ? String(replyModal.message.senderEmail).trim() : '—'})
                    {replyModal.message.senderPhone?.trim() && (
                      <><br /><small className="text-muted">{replyModal.message.senderPhone.trim()}</small></>
                    )}
                  </div>
                  <div className="mb-3">
                    <strong>{t('subject')}:</strong> {replyModal.message.subject}
                  </div>
                  <div className="mb-3">
                    <strong>{t('title')}:</strong>
                    <div className="border p-3 mt-2" style={{ backgroundColor: '#f8f9fa', textAlign: isRTL ? 'right' : 'left' }}>
                      {replyModal.message.message}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="response" className="form-label">{t('yourResponse')}:</label>
                    <textarea
                      id="response"
                      className="form-control"
                      rows="5"
                      value={replyModal.response}
                      onChange={(e) => setReplyModal({ ...replyModal, response: e.target.value })}
                      placeholder={t('responsePlaceholder')}
                      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setReplyModal({ isOpen: false, message: null, response: '' })}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleReply}
                    disabled={isReplying || !replyModal.response.trim()}
                  >
                    {isReplying ? t('sending') : t('sendReply')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('deleteMessage')}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setDeleteModal({ isOpen: false, message: null })}
                    aria-label={tCommon('close')}
                  ></button>
                </div>
                <div className="modal-body" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                  <div className="mb-3">
                    <strong>{t('from')}:</strong> {(deleteModal.message.senderEmail && String(deleteModal.message.senderEmail).trim()) ? String(deleteModal.message.senderEmail).trim() : (deleteModal.message.senderName ?? '—')}
                    {deleteModal.message.senderPhone?.trim() && (
                      <><br /><small className="text-muted">{deleteModal.message.senderPhone.trim()}</small></>
                    )}
                  </div>
                  <div className="mb-3">
                    <strong>{t('subject')}:</strong> {deleteModal.message.subject}
                  </div>
                  <div className="mb-3">
                    <strong>{t('title')}:</strong>
                    <div className="border p-3 mt-2" style={{ backgroundColor: '#f8f9fa', maxHeight: '150px', overflow: 'auto', textAlign: isRTL ? 'right' : 'left' }}>
                      {deleteModal.message.message}
                    </div>
                  </div>
                  <div className="alert alert-warning" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    <i className="icon-warning me-2"></i>
                    {t('deleteWarning')}
                  </div>
                </div>
                <div className="modal-footer" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setDeleteModal({ isOpen: false, message: null })}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(deleteModal.message._id)}
                    disabled={isDeleting}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 20px',
                      fontWeight: '500'
                    }}
                  >
                    {isDeleting ? t('deleting') : t('confirmDelete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast.isVisible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
          />
        )}
      </div>
    </div>
  );
}
