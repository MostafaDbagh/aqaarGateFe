"use client";
import React, { useState, useRef, useEffect } from "react";
import { ShareIcon, FacebookIcon, XIcon, WhatsAppIcon, EmailIcon, LinkIcon } from "@/components/icons";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import logger from "@/utlis/logger";
import styles from "./ShareButton.module.css";
import { formatPriceWithCurrency } from "@/utlis/propertyHelpers";

export default function ShareButton({ property }) {
  const t = useTranslations('propertyDetail');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get current page URL
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  // Get share text
  const getShareText = () => {
    const propertyTitle = property?.propertyKeyword || property?.propertyTitle || 'Property';
    const price = property?.propertyPrice != null ? formatPriceWithCurrency(property.propertyPrice, property?.currency) : '';
    return `${propertyTitle} ${price ? `- ${price}` : ''}`;
  };

  // Handle Web Share API (for mobile devices)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getShareText(),
          text: property?.propertyDesc || '',
          url: getShareUrl(),
        });
        setIsOpen(false);
      } catch (error) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError') {
          logger.error('Error sharing:', error);
        }
      }
    }
  };

  // Share on Facebook
  const shareOnFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  // Share on X (formerly Twitter)
  const shareOnTwitter = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());
    window.open(`https://x.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    setIsOpen(false);
  };

  // Share via Email
  const shareViaEmail = () => {
    const url = getShareUrl();
    const subject = encodeURIComponent(getShareText());
    const body = encodeURIComponent(`${property?.propertyDesc || ''}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsOpen(false);
  };

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      // Show success message (you can add a toast notification here)
      setIsOpen(false);
    } catch (error) {
      logger.error('Failed to copy link:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Check if native share is available
  const hasNativeShare = typeof navigator !== 'undefined' && navigator.share;

  return (
    <div className={styles.shareContainer} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.shareButton}
        aria-label={t('share')}
        title={t('share')}
      >
        <ShareIcon width={20} height={20} stroke="#5C5E61" />
      </button>

      {isOpen && (
        <>
          <div 
            className={styles.overlay}
            onClick={() => setIsOpen(false)}
          />
          <div className={styles.dropdown}>
            {hasNativeShare && (
              <button
                onClick={handleNativeShare}
                className={styles.shareOption}
              >
                <ShareIcon width={20} height={20} stroke="#5C5E61" />
                <span>{t('shareVia')}</span>
              </button>
            )}
            <button
              onClick={shareOnFacebook}
              className={styles.shareOption}
            >
              <FacebookIcon width={20} height={20} fill="#1877F2" />
              <span>Facebook</span>
            </button>
            <button
              onClick={shareOnTwitter}
              className={styles.shareOption}
            >
              <XIcon width={20} height={20} fill="#000000" />
              <span>X (Twitter)</span>
            </button>
            <button
              onClick={shareOnWhatsApp}
              className={styles.shareOption}
            >
              <WhatsAppIcon width={20} height={20} fill="#25D366" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={shareViaEmail}
              className={styles.shareOption}
            >
              <EmailIcon width={20} height={20} stroke="#5C5E61" />
              <span>{t('email')}</span>
            </button>
            <button
              onClick={copyLink}
              className={styles.shareOption}
            >
              <LinkIcon width={20} height={20} stroke="#5C5E61" />
              <span>{t('copyLink')}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

