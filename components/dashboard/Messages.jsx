"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DropdownSelect from "../common/DropdownSelect";
import LocationLoader from "../common/LocationLoader";
import { useMessagesByAgent, useMessageMutations } from "@/apis/hooks";
import Toast from "../common/Toast";
import { CopyIcon, CheckIcon } from "@/components/icons";
import styles from "./Messages.module.css";

export default function Messages() {
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

  const messages = messagesData?.data || [];
  const pagination = messagesData?.pagination || {};
  const stats = messagesData?.stats || {};
  const filterOptions = messagesData?.filterOptions || { properties: [] };

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

  // Handle copy property ID (track copied row by messageId so only that row shows as copied)
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

  if (isLoading) {
    return (
      <div className="main-content w-100">
        <div className="main-content-inner">
          <div className="button-show-hide show-mb">
            <span className="body-1">Show Messages</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px' 
          }}>
            <LocationLoader 
              size="large" 
              message="Loading your messages..."
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
          <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
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
        <div className="row mb-4" style={{ justifyContent: 'center' }}>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {stats.total || 0}
              </div>
              <div className={styles.statLabel}>
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
                  options={["All", ...filterOptions.properties.map(p => p.propertyKeyword)]}
                  value={propertyFilter === 'all' ? 'All' : filterOptions.properties.find(p => p._id === propertyFilter)?.propertyKeyword || 'All'}
                  onChange={(value) => {
                    if (value === 'All') {
                      handleFilterChange('property', 'all');
                    } else {
                      const property = filterOptions.properties.find(p => p.propertyKeyword === value);
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
              Messages
              {pagination.totalMessages > 0 && (
                <span className="text-muted ms-2">
                  ({pagination.totalMessages} total - Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, pagination.totalMessages)})
                </span>
              )}
            </h3>
          </div>
          <div className="card-body p-0">
            {messages.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="icon-message" style={{ fontSize: '48px', color: '#6c757d' }} aria-hidden="true"></i>
                </div>
                <h5>No messages found</h5>
                <p className="text-muted">You don't have any messages matching your current filters.</p>
              </div>
            ) : (
              <div className="table-responsive" style={{ overflowX: 'auto', maxWidth: '100%' }}>
                <table className="table table-hover mb-0" style={{ minWidth: '1200px' }}>
                  <thead className="table-light">
                    <tr>
                      <th>Status</th>
                      <th>Sender</th>
                      <th>Subject</th>
                      <th>Property</th>
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
                            <strong>{message.senderName}</strong>
                            <br />
                            <small className="text-muted">{message.senderEmail}</small>
                          </div>
                        </td>
                        <td>
                          <div style={{ maxWidth: '200px' }}>
                            <strong>{message.subject}</strong>
                            <br />
                            <small className="text-muted" style={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {message.message}
                            </small>
                          </div>
                        </td>
                        <td>
                          {message.propertyId ? (
                            <div style={{ maxWidth: '150px' }}>
                              <strong>{message.propertyId.propertyKeyword}</strong>
                              <br />
                              <small className="text-muted">
                                ${message.propertyId.propertyPrice?.toLocaleString()}
                              </small>
                            </div>
                          ) : (
                            <span className="text-muted">Property not found</span>
                          )}
                        </td>
                        <td>
                          {message.propertyId?.propertyId ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                title={copiedId === message._id ? 'Copied!' : 'Copy Property ID'}
                                aria-label="Copy property ID to clipboard"
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
                                title="Mark as Read"
                                aria-label={`Mark message as read`}
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
                                {isMarkingAsRead ? 'Marking...' : 'Mark as Read'}
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
                              title="Delete Message"
                              aria-label={`Delete message from ${message.senderName}`}
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
        {pagination.totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <ul className="wg-pagination">
              {generatePaginationItems()}
            </ul>
          </div>
        )}

        {/* Reply Modal */}
        {replyModal.isOpen && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                    <strong>From:</strong> {replyModal.message.senderName} ({replyModal.message.senderEmail})
                  </div>
                  <div className="mb-3">
                    <strong>Subject:</strong> {replyModal.message.subject}
                  </div>
                  <div className="mb-3">
                    <strong>Message:</strong>
                    <div className="border p-3 mt-2" style={{ backgroundColor: '#f8f9fa' }}>
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
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                    <strong>From:</strong> {deleteModal.message.senderEmail}
                  </div>
                  <div className="mb-3">
                    <strong>Subject:</strong> {deleteModal.message.subject}
                  </div>
                  <div className="mb-3">
                    <strong>Message:</strong>
                    <div className="border p-3 mt-2" style={{ backgroundColor: '#f8f9fa', maxHeight: '150px', overflow: 'auto' }}>
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
