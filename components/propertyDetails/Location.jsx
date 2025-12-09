"use client";
import React, { useMemo } from "react";
import { useTranslations, useLocale } from 'next-intl';
import styles from './Location.module.css';

export default function Location({ property }) {
  const t = useTranslations('propertyDetail');
  const locale = useLocale();
  
  // Use Arabic fields if available and locale is Arabic
  const address = locale === 'ar' && property?.address_ar ? property.address_ar : (property?.address || '');
  const neighborhood = locale === 'ar' && property?.neighborhood_ar ? property.neighborhood_ar : (property?.neighborhood || '');
  
  // Build Google Maps embed URL - use simple, reliable format
  const mapEmbedUrl = useMemo(() => {
    if (property?.mapLocation) {
      const mapLocation = property.mapLocation.trim();
      
      // If it's already a valid embed URL, use it directly
      if (mapLocation.includes('google.com/maps/embed') && mapLocation.startsWith('http')) {
        return mapLocation;
      }
      
      // Extract coordinates or query
      let query = null;
      let coords = null;
      
      // Check for coordinates (@lat,lng format)
      const coordMatch = mapLocation.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (coordMatch) {
        coords = `${coordMatch[1]},${coordMatch[2]}`;
      }
      
      // Check for coordinates as direct input (lat,lng)
      if (!coords) {
        const directCoordMatch = mapLocation.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);
        if (directCoordMatch) {
          coords = `${directCoordMatch[1]},${directCoordMatch[2]}`;
        }
      }
      
      // Extract place/query from URL
      if (!coords) {
        const qMatch = mapLocation.match(/[?&]q=([^&]+)/);
        if (qMatch) {
          query = decodeURIComponent(qMatch[1]);
        } else if (mapLocation.includes('place/')) {
          const placeMatch = mapLocation.match(/place\/([^\/\?]+)/);
          if (placeMatch) {
            query = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
          }
        } else if (!mapLocation.includes('http') && !mapLocation.includes('@')) {
          query = mapLocation;
        }
      }
      
      // Build embed URL - use maps.googleapis.com format that works with CSP
      if (coords) {
        // Use Google Maps Embed API format
        return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${coords.split(',')[1]}!3d${coords.split(',')[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s`;
      } else if (query) {
        // For text queries, use a simple embed format
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzVcMzEjMDIuNiJOIDM1XzQ3JzMzLjAiRQ!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s&q=${encodeURIComponent(query)}`;
      }
    }
    
    // Fallback: Build from address components
    const fullAddress = [
      address,
      neighborhood,
      property?.city || property?.state,
      property?.country || 'Syria'
    ].filter(Boolean).join(', ');
    
    if (fullAddress) {
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzVcMzEjMDIuNiJOIDM1XzQ3JzMzLjAiRQ!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s&q=${encodeURIComponent(fullAddress)}`;
    }
    
    // Default fallback
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzVcMzEjMDIuNiJOIDM1XzQ3JzMzLjAiRQ!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s&q=Damascus,Syria`;
  }, [property?.mapLocation, address, neighborhood, property?.city, property?.state, property?.country]);
  
  // Don't show map section if no location data available
  if (!property?.mapLocation && !address && !neighborhood) {
    return null;
  }
  
  return (
    <>
      <div className="wg-title text-11 fw-6 text-color-heading">
        {t('location')}
      </div>
      <div className={styles.mapContainer}>
        <iframe
          className={`map ${styles.mapIframe}`}
          src={mapEmbedUrl}
          width="100%"
          height="450"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Property Location Map"
        />
        <div className={styles.mapOverlay} />
      </div>
      <div className={`info-map ${styles.infoMap}`}>
        <div className={styles.infoItem}>
          <span className={`label fw-6 ${styles.label}`}>{t('address')}</span>
          <div className="text text-variant-1" style={{ direction: locale === 'ar' ? 'rtl' : 'ltr', textAlign: locale === 'ar' ? 'right' : 'left' }}>
            {address || t('notSpecified')}
          </div>
        </div>
        <div className={styles.infoItem}>
          <span className={`label fw-6 ${styles.label}`}>{t('city')}</span>
          <div className="text text-variant-1">{property?.city || property?.state || 'N/A'}</div>
        </div>
        <div className={styles.infoItem}>
          <span className={`label fw-6 ${styles.label}`}>{t('area')}</span>
          <div className="text text-variant-1" style={{ direction: locale === 'ar' ? 'rtl' : 'ltr', textAlign: locale === 'ar' ? 'right' : 'left' }}>
            {neighborhood || t('notSpecified')}
          </div>
        </div>
        <div className={styles.infoItem}>
          <span className={`label fw-6 ${styles.label}`}>{t('country')}</span>
          <div className="text text-variant-1">{property?.country || 'Syria'}</div>
        </div>
      </div>
    </>
  );
}
