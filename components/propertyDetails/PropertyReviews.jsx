"use client";
import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import LocationLoader from "@/components/common/LocationLoader";
import { useReviewsByProperty, useCreateReview } from "@/apis/hooks";
import { useQueryClient } from "@tanstack/react-query";
import logger from "@/utlis/logger";
import styles from "./PropertyReviews.module.css";

export default function PropertyReviews({ propertyId }) {
  const t = useTranslations('reviews');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const queryClient = useQueryClient();
  const { data: reviewsData, isLoading, isError } = useReviewsByProperty(propertyId);
  const createReviewMutation = useCreateReview();

  // Debug logging
  logger.debug('PropertyReviews Debug:', {
    propertyId,
    reviewsData,
    isLoading,
    isError
  });

  // Get last 5 reviews
  const recentReviews = useMemo(() => reviewsData?.data?.slice(0, 5) || [], [reviewsData?.data]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleRatingChange = useCallback((rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await createReviewMutation.mutateAsync({
        ...formData,
        propertyId
      });

      setFormData({
        name: '',
        email: '',
        review: '',
        rating: 5
      });
      setSubmitMessage(t('reviewSubmitted'));
      
      // Invalidate reviews query to refresh the list
      queryClient.invalidateQueries(['reviews', 'property', propertyId]);
    } catch (error) {
      setSubmitMessage(t('reviewFailed'));
      logger.error('Review submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = useCallback((ratingValue) => {
    const normalizedRating = Math.max(0, Math.min(5, Number(ratingValue) || 0));

    return Array.from({ length: 5 }, (_, index) => {
      const isFilled = index < normalizedRating;

      return (
        <i
          key={index}
          className={`icon-star ${styles.starIcon} ${isFilled ? styles.starFilled : styles.starEmpty}`}
          aria-hidden="true"
        />
      );
    });
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const getReviewerAvatar = useCallback((review) => {
    const fallbackAvatar = '/images/default-avatar.svg';
    const potentialSources = [
      review?.avatarUrl,
      review?.avatar,
      review?.userAvatar,
      review?.userId?.avatar,
    ];

    const validSource = potentialSources.find((src) => {
      if (typeof src !== 'string') {
        return false;
      }
      const trimmed = src.trim();
      if (!trimmed) {
        return false;
      }
      return !/i.pravatar.cc/i.test(trimmed);
    });

    if (validSource) {
      return validSource;
    }

    return fallbackAvatar;
  }, []);

  if (isLoading) {
    return (
      <section className="section-reviews tf-spacing-3">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div style={{ padding: '40px 20px' }}>
                <LocationLoader size="medium" message={t('loadingReviews')} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
            <div className={styles.wrapComment}>
              <h4 className={styles.reviewTitle}>{t('guestReviews')}</h4>
              
              {recentReviews.length > 0 ? (
                <ul className="comment-list">
                  {recentReviews.map((review) => (
                    <li key={review._id} className={styles.commentListItem}>
                      <div className={styles.commentItem}>
                        <div className={styles.imageWrap}>
                          <Image
                            alt="Reviewer avatar"
                            src={getReviewerAvatar(review)}
                            width={60}
                            height={60}
                            sizes="60px"
                            className={styles.reviewerImage}
                            onError={(event) => {
                              const img = event.currentTarget;
                              if (img.dataset.fallbackApplied === 'true') {
                                return;
                              }
                              img.dataset.fallbackApplied = 'true';
                              img.onerror = null;
                              img.src = '/images/default-avatar.svg';
                            }}
                          />
                        </div>
                        <div className={styles.reviewContent}>
                          <div className={styles.userDetails}>
                            <div className={styles.reviewAuthorRow}>
                              <h6 className={styles.reviewAuthor}>{review.name}</h6>
                              <div className={styles.reviewTime}>{formatDate(review.createdAt)}</div>
                            </div>
                            <div className={styles.reviewStars}>{renderStars(review.rating || 5)}</div>
                          </div>
                          <div className="comment">
                            <p className={styles.reviewText}>{review.review}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">{t('noReviewsYet')}</p>
                </div>
              )}

              {reviewsData?.data?.length > 5 && (
                <a href="#" className="tf-btn style-border fw-7 pd-1">
                  <span>{t('viewAllReviews')} ({reviewsData.data.length}) <i className="icon-arrow-right-2 fw-4" /></span>
                </a>
              )}
            </div>

            {/* Add Review Form */}
            <div className={styles.boxSend}>
              <div className={styles.addHeadingBox}>
                <h4 className={styles.addTitle}>{t('leaveReview')}</h4>
                <p className={styles.addDescription}>{t('emailNotPublished')}</p>
              </div>
              
              {submitMessage && (
                <div className={
                  submitMessage.includes('successfully')
                    ? styles.submitAlert
                    : styles.submitAlert + ' ' + styles.submitAlertDanger
                }>
                  {submitMessage}
                </div>
              )}

              <form className={styles.addReviewForm} onSubmit={handleSubmit}>
                <div className={styles.addCols}>
                  <fieldset className="name">
                    <label className={styles.addFormField} htmlFor="name">{t('name')}</label>
                    <input
                      type="text"
                      className={styles.addInput + " tf-input style-2"}
                      placeholder={t('namePlaceholder')}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                  <fieldset className="email">
                    <label className={styles.addFormField} htmlFor="email">{t('email')}</label>
                    <input
                      type="email"
                      className={styles.addInput + " tf-input style-2"}
                      placeholder={t('emailPlaceholder')}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                </div>

                {/* Rating Selection */}
                <fieldset className={styles.addRating + " rating"}>
                  <label className={styles.addFormField + " text-1 fw-6"}>{t('rating')}</label>
                  <div className={styles.ratingStars + " rating-stars"}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`${styles.starBtn} star-btn ${star <= formData.rating ? styles.starBtnActive + ' active' : ''}`}
                        onClick={() => handleRatingChange(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="message">
                  <label className={styles.addFormField} htmlFor="message">{t('review')}</label>
                  <textarea
                    id="message"
                    className={styles.addTextarea + " tf-input"}
                    name="review"
                    rows={4}
                    placeholder={t('reviewPlaceholder')}
                    value={formData.review}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>
                
                <button 
                  className={styles.reviewBtn + " tf-btn bg-color-primary pd-24 fw-7"}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('submitting') : t('postReview')}
                  <i className="icon-arrow-right-2 fw-4" />
                </button>
              </form>
            </div>
    </>
  );
}
