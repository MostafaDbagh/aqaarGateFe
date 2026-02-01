"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import DropdownSelect from "../common/DropdownSelect";
import LocationLoader from "../common/LocationLoader";
import { useMessagesByAgent, useMessageMutations } from "@/apis/hooks";
import Toast from "../common/Toast";
import { CopyIcon, CheckIcon } from "@/components/icons";
import styles from "../dashboard/Messages.module.css";
import adminStyles from "./AdminMessages.module.css";

/**
 * AdminMessages Component
 * 
 * Displays messages for properties added by admin (agent = 'admin@aqaargate.com')
 * Uses the same design and style as the agent Messages component
 */
export default function AdminMessages() {
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

  // Add classes to remove padding-left and padding-top for admin messages page
  useEffect(() => {
    const mainContent = document.querySelector('.page-layout .main-content');
    const mainContentInner = document.querySelector('.page-layout .main-content-inner');
    
    if (mainContent) {
      mainContent.classList.add('admin-messages-page');
    }
    if (mainContentInner) {
      mainContentInner.classList.add('admin-messages-page-inner');
    }
    
    return () => {
      if (mainContent) {
        mainContent.classList.remove('admin-messages-page');
      }
      if (mainContentInner) {
        mainContentInner.classList.remove('admin-messages-page-inner');
      }
    };
  }, []);

  // Fetch messages with current filters and pagination (BE already filters by admin's agentId)
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

  // Use API data directly so count and rows always match (no client-side filter)
  const messages = useMemo(() => (Array.isArray(messagesData?.data) ? messagesData.data : []), [messagesData?.data]);
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
    setCurrentPage(1);
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
      showToast('Message marked as read');
      refetch();
    } catch (error) {
      showToast('Failed to mark message as read', 'error');
    }
  };

  // Handle reply
  const handleReply = async () => {
    if (!replyModal.response.trim()) {
      showToast('Please enter a response', 'error');
      return;
    }

    try {
      await replyToMessage({
        messageId: replyModal.message._id,
        response: replyModal.response
      });
      showToast('Reply sent successfully');
      setReplyModal({ isOpen: false, message: null, response: '' });
      refetch();
    } catch (error) {
      showToast('Failed to send reply', 'error');
    }
  };

  // Handle archive
  const handleArchive = async (messageId) => {
    try {
      await archiveMessage(messageId);
      showToast('Message archived');
      refetch();
    } catch (error) {
      showToast('Failed to archive message', 'error');
    }
  };

  // Handle delete
  const handleDelete = async (messageId) => {
    try {
      await deleteMessage(messageId);
      showToast('Message deleted');
      setDeleteModal({ isOpen: false, message: null });
      refetch();
    } catch (error) {
      showToast('Failed to delete message', 'error');
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (message) => {
    setDeleteModal({ isOpen: true, message });
  };

  // Handle copy property ID
  const handleCopyPropertyId = async (propertyId, messageId) => {
    try {
      await navigator.clipboard.writeText(propertyId);
      setCopiedId(messageId);
      showToast('Property ID copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      showToast('Failed to copy property ID', 'error');
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    
    items.push(
      <li key="prev" className={page <= 1 ? "arrow disabled" : "arrow"}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (page > 1) handlePageChange(page - 1);
          }}
          className={page <= 1 ? adminStyles.paginationLinkDisabled : adminStyles.paginationLink}
          aria-label="Go to previous page"
        >
          <i className="icon-chevron-left" aria-hidden="true"></i>
        </a>
      </li>
    );

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

    items.push(
      <li key="next" className={page >= totalPages ? "arrow disabled" : "arrow"}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (page < totalPages) handlePageChange(page + 1);
          }}
          className={page >= totalPages ? adminStyles.paginationLinkDisabled : adminStyles.paginationLink}
          aria-label="Go to next page"
        >
          <i className="icon-chevron-right" aria-hidden="true"></i>
        </a>
      </li>
    );

    return items;
  };

  if (isLoading) {
    return (
      <div className="main-content w-100">
        <div className="main-content-inner">
          <div className="button-show-hide show-mb">
            <span className="body-1">Show Messages</span>
          </div>
          <div className={adminStyles.loaderContainer}>
            <LocationLoader 
              size="large" 
              message="Loading admin messages..."
            />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="main-content w-100">
        <div className="main-content-inner">
          <div className="button-show-hide show-mb">
            <span className="body-1">Show Messages</span>
          </div>
          <div className={adminStyles.errorContainer}>
            <p>Error loading messages. Please try again.</p>
            <button onClick={() => refetch()} className="btn btn-primary" aria-label="Retry loading messages">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content w-100">
      <div className="main-content-inner">
        <div className="button-show-hide show-mb">
          <span className="body-1">Show Messages</span>
        </div>

        {/* Statistics Cards */}
        <div className={`row mb-4 ${adminStyles.statsRow}`}>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className={styles.statCard}>
              <div className={adminStyles.statValue}>
                {stats.total || 0}
              </div>
              <div className={adminStyles.statLabel}>
                Total Messages
              </div>
            </div>
          </div>
          
          <div className="col-md-3 col-sm-6 mb-3">
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {stats.replied || 0}
              </div>
              <div className={styles.statLabel}>
                Replied
              </div>
            </div>
          </div>
          
          <div className="col-md-3 col-sm-6 mb-3">
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {stats.unread || 0}
              </div>
              <div className={styles.statLabel}>
                Unread
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Status</label>
                <DropdownSelect
                  options={["All", "Unread", "Read", "Replied", "Archived"]}
                  value={statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  onChange={(value) => handleFilterChange('status', value.toLowerCase() === 'all' ? 'all' : value.toLowerCase())}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Message Type</label>
                <DropdownSelect
                  options={["All", "Inquiry", "Viewing Request", "Offer", "Question", "Complaint"]}
                  value={messageTypeFilter === 'all' ? 'All' : messageTypeFilter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  onChange={(value) => handleFilterChange('messageType', value.toLowerCase().replace(' ', '_') === 'all' ? 'all' : value.toLowerCase().replace(' ', '_'))}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Property</label>
                <DropdownSelect
                  options={["All", ...properties.map(p => p?.propertyKeyword).filter(Boolean)]}
                  value={propertyFilter === 'all' ? 'All' : properties.find(p => p?._id === propertyFilter)?.propertyKeyword || 'All'}
                  onChange={(value) => {
                    if (value === 'All') {
                      handleFilterChange('property', 'all');
                    } else {
                      const property = properties.find(p => p?.propertyKeyword === value);
                      handleFilterChange('property', property?._id || 'all');
                    }
                  }}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Search</label>
                <form onSubmit={handleSearch} className="d-flex">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="btn btn-outline-primary" aria-label="Search messages">
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
            <h3 className="mb-0">
              Admin Property Messages
              {(pagination.totalMessages ?? 0) > 0 && (
                <span className="text-muted ms-2">
                  ({(pagination.totalMessages ?? 0)} total - Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, pagination.totalMessages ?? 0)})
                </span>
              )}
            </h3>
          </div>
          <div className="card-body p-0">
            {messages.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className={`icon-message ${adminStyles.emptyStateIcon}`} aria-hidden="true"></i>
                </div>
                <h5>No messages found</h5>
                <p className="text-muted">You don't have any messages for admin properties matching your current filters.</p>
              </div>
            ) : (
              <div className={`table-responsive ${adminStyles.tableWrapper}`}>
                <table className={`table table-hover mb-0 ${adminStyles.table}`}>
                  <thead className="table-light">
                    <tr>
                      <th>Status</th>
                      <th>Sender</th>
                      <th>Subject</th>
                      <th>Price</th>
                      <th>Property ID</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((message) => (
                      <tr key={message._id}>
                        <td>
                          <span className={`badge ${getStatusBadgeColor(message.status)}`}>
                            {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
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
                          <div className={adminStyles.messageIdCell} style={{ maxWidth: '280px', minWidth: '200px' }}>
                            <strong>Contact Agent</strong>
                            <div className={adminStyles.messageBodyCell} style={{ maxHeight: '180px', marginTop: '6px' }} title={message.message ?? ''}>
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
                            <span className="text-muted">Property not found</span>
                          )}
                        </td>
                        <td>
                          {message.propertyId?.propertyId ? (
                            <div className={adminStyles.propertyIdContainer}>
                              <small className={`text-muted ${adminStyles.propertyIdText}`}>
                                {message.propertyId.propertyId}
                              </small>
                              <button
                                type="button"
                                className={`btn btn-sm btn-link p-0 ${adminStyles.btnCopy} ${copiedId === message._id ? adminStyles.btnCopyCopied : ''}`}
                                onClick={() => handleCopyPropertyId(message.propertyId.propertyId, message._id)}
                                title={copiedId === message._id ? 'Copied!' : 'Copy Property ID'}
                                aria-label="Copy property ID to clipboard"
                              >
                                {copiedId === message._id ? (
                                  <CheckIcon className={adminStyles.btnIcon} />
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
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${getMessageTypeBadgeColor(message.messageType)}`}>
                            {message.messageType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td>
                          <small>{formatDate(message.createdAt)}</small>
                        </td>
                        <td>
                          <div className={`btn-group ${adminStyles.btnGroup}`} role="group">
                            {message.status === 'unread' && (
                              <button
                                className={`btn btn-sm ${adminStyles.btnMarkRead}`}
                                onClick={() => handleMarkAsRead(message._id)}
                                disabled={isMarkingAsRead}
                                title="Mark as Read"
                                aria-label={`Mark message as read`}
                              >
                                <i className={`icon-eye ${adminStyles.btnIcon}`} aria-hidden="true"></i>
                                {isMarkingAsRead ? 'Marking...' : 'Mark as Read'}
                              </button>
                            )}
                            <button
                              className={`btn btn-sm ${adminStyles.btnDelete}`}
                              onClick={() => handleDeleteClick(message)}
                              disabled={isDeleting}
                              title="Delete Message"
                              aria-label={`Delete message from ${message.senderName}`}
                            >
                              <i className={`icon-trash ${adminStyles.btnIcon}`} aria-hidden="true"></i>
                              {isDeleting ? 'Deleting...' : 'Delete'}
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
          <div className={`modal show d-block ${adminStyles.modalOverlay}`}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reply to Message</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setReplyModal({ isOpen: false, message: null, response: '' })}
                    aria-label="Close reply modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>From:</strong> {replyModal.message.senderName ?? '—'} ({replyModal.message.senderEmail && String(replyModal.message.senderEmail).trim() ? String(replyModal.message.senderEmail).trim() : '—'})
                    {replyModal.message.senderPhone?.trim() && (
                      <><br /><small className="text-muted">{replyModal.message.senderPhone.trim()}</small></>
                    )}
                  </div>
                  <div className="mb-3">
                    <strong>Subject:</strong> {replyModal.message.subject}
                  </div>
                  <div className="mb-3">
                    <strong>Message:</strong>
                    <div className={`border p-3 mt-2 ${adminStyles.modalMessageBox}`}>
                      {replyModal.message.message}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="response" className="form-label">Your Response:</label>
                    <textarea
                      id="response"
                      className="form-control"
                      rows="5"
                      value={replyModal.response}
                      onChange={(e) => setReplyModal({ ...replyModal, response: e.target.value })}
                      placeholder="Type your response here..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setReplyModal({ isOpen: false, message: null, response: '' })}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleReply}
                    disabled={isReplying || !replyModal.response.trim()}
                  >
                    {isReplying ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className={`modal show d-block ${adminStyles.modalOverlay}`}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Message</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setDeleteModal({ isOpen: false, message: null })}
                    aria-label="Close delete modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>From:</strong> {(deleteModal.message.senderEmail && String(deleteModal.message.senderEmail).trim()) ? String(deleteModal.message.senderEmail).trim() : (deleteModal.message.senderName ?? '—')}
                    {deleteModal.message.senderPhone?.trim() && (
                      <><br /><small className="text-muted">{deleteModal.message.senderPhone.trim()}</small></>
                    )}
                  </div>
                  <div className="mb-3">
                    <strong>Subject:</strong> {deleteModal.message.subject}
                  </div>
                  <div className="mb-3">
                    <strong>Message:</strong>
                    <div className={`border p-3 mt-2 ${adminStyles.modalMessageBoxScrollable}`}>
                      {deleteModal.message.message}
                    </div>
                  </div>
                  <div className="alert alert-warning">
                    <i className="icon-warning me-2"></i>
                    Are you sure you want to delete this message? This action cannot be undone.
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setDeleteModal({ isOpen: false, message: null })}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`btn btn-danger ${adminStyles.btnDelete}`}
                    onClick={() => handleDelete(deleteModal.message._id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
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

