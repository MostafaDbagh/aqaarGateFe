"use client";
import React, { useState, useEffect } from "react";
import LocationLoader from "@/components/common/LocationLoader";
import { useReviewsByAgent } from "@/apis/hooks";
import Toast from "../common/Toast";

export default function AgentReviews() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const { data: reviewsData, isLoading, isError, error } = useReviewsByAgent(
    user?._id,
    { page: currentPage, limit: itemsPerPage }
  );

  const reviews = reviewsData?.data || [];
  const stats = reviewsData?.stats || { totalReviews: 0, averageRating: 0, totalProperties: 0 };
  const pagination = reviewsData?.pagination || { currentPage: 1, totalPages: 0, totalReviews: 0 };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`icon-star${i <= rating ? '' : '-outline'}`}
          style={{ color: i <= rating ? '#FFB800' : '#ccc' }}
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!user) {
    return (
      <div className="main-content w-100">
        <div className="main-content-inner wrap-dashboard-content">
          <div className="alert alert-warning">
            Please log in to view your reviews.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content w-100">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="main-content-inner wrap-dashboard-content">
        <div className="button-show-hide show-mb">
          <span className="body-1">Show Reviews</span>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="mb-2 text-primary">{stats.totalReviews}</h3>
                <p className="mb-0 text-muted">Total Reviews</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="mb-2 text-warning">
                  {stats.averageRating.toFixed(1)} ⭐
                </h3>
                <p className="mb-0 text-muted">Average Rating</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="mb-2 text-success">{stats.totalProperties}</h3>
                <p className="mb-0 text-muted">Properties Reviewed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="widget-box-2">
          <h3 className="title">My Property Reviews</h3>
          <div className="wrap-table">
            {isLoading ? (
              <div style={{ padding: '40px 20px' }}>
                <LocationLoader size="medium" message="Loading reviews..." />
              </div>
            ) : isError ? (
              <div className="alert alert-danger">
                <h5>Error Loading Reviews</h5>
                <p>{error?.message || 'Failed to load reviews'}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-5">
                <i className="icon-star-outline" style={{ fontSize: '48px', color: '#ccc' }} />
                <h5 className="mt-3">No Reviews Yet</h5>
                <p className="text-muted">
                  When people review your properties, they will appear here.
                </p>
              </div>
            ) : (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Reviewer</th>
                      <th>Rating</th>
                      <th>Review</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {review.propertyId?.propertyKeyword || 'Unknown Property'}
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{review.name}</strong>
                            <br />
                            <small className="text-muted">{review.email}</small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            {renderStars(review.rating || 5)}
                          </div>
                        </td>
                        <td>
                          <div style={{ maxWidth: '300px' }}>
                            {review.review}
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">
                            {formatDate(review.createdAt)}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <p className="text-muted mb-0">
                      Showing {((pagination.currentPage - 1) * itemsPerPage) + 1}-
                      {Math.min(pagination.currentPage * itemsPerPage, pagination.totalReviews)} of {pagination.totalReviews} reviews
                    </p>
                    <ul className="wg-pagination">
                      {/* Previous button */}
                      <li className={!pagination.hasPreviousPage ? 'disabled' : ''}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.hasPreviousPage) {
                              handlePageChange(currentPage - 1);
                            }
                          }}
                        >
                          <i className="icon-arrow-left" />
                        </a>
                      </li>

                      {/* Page numbers */}
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <li key={page} className={page === currentPage ? 'active' : ''}>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                          >
                            {page}
                          </a>
                        </li>
                      ))}

                      {/* Next button */}
                      <li className={!pagination.hasNextPage ? 'disabled' : ''}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.hasNextPage) {
                              handlePageChange(currentPage + 1);
                            }
                          }}
                        >
                          <i className="icon-arrow-right" />
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

