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
  
  // Build Google Maps embed URL - convert any Google Maps URL to embed format
  const mapEmbedUrl = useMemo(() => {
    if (property?.mapLocation) {
      const mapLocation = property.mapLocation.trim();
      
      // If it's already a valid embed URL, use it directly
      if (mapLocation.includes('google.com/maps/embed') && mapLocation.startsWith('http')) {
        return mapLocation;
      }
      
      // If it's a Google Maps URL, extract location and convert to embed
      if (mapLocation.includes('google.com/maps') || mapLocation.includes('goo.gl/maps') || mapLocation.includes('maps.app.goo.gl')) {
        // First, try to extract coordinates from URL (@lat,lng format) - most reliable
        const coordMatch = mapLocation.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
        if (coordMatch) {
          const lat = coordMatch[1];
          const lng = coordMatch[2];
          // Use the embed API format with coordinates
          return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzVcMzEjMDIuNiJOIDM1XzQ3JzMzLjAiRQ!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s`;
        }
        
        // Try to extract place ID from URL
        const placeIdMatch = mapLocation.match(/place\/([^\/\?&]+)/);
        if (placeIdMatch) {
          const placeId = placeIdMatch[1];
          // Use place ID with embed format
          return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzVcMzEjMDIuNiJOIDM1XzQ3JzMzLjAiRQ!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s&q=place_id:${placeId}`;
        }
        
        // Extract query parameter
        const qMatch = mapLocation.match(/[?&]q=([^&]+)/);
        if (qMatch) {
          const query = decodeURIComponent(qMatch[1]);
          return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzVcMzEjMDIuNiJOIDM1XzQ3JzMzLjAiRQ!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s&q=${encodeURIComponent(query)}`;
        }
        
        // For short URLs (maps.app.goo.gl), we need to convert them
        // The best approach is to use the URL with iframe directly
        // But since short URLs don't work directly, we'll use a workaround
        if (mapLocation.includes('maps.app.goo.gl') || mapLocation.includes('goo.gl/maps')) {
          // For short URLs, we'll use the address as fallback or try to extract info
          // Since we can't resolve short URLs client-side, use address fallback
          const fullAddress = [
            address,
            neighborhood,
            property?.city || property?.state,
            property?.country || 'Syria'
          ].filter(Boolean).join(', ');
          
          if (fullAddress) {
            return `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&hl=en&z=15&output=embed`;
          }
          
          // If no address, try using the short URL directly (may not work but worth trying)
          return mapLocation;
        }
        
        // For regular Google Maps URLs, try to extract location from path
        if (mapLocation.includes('/maps/')) {
          const mapsPathMatch = mapLocation.match(/\/maps\/([^?]+)/);
          if (mapsPathMatch) {
            const path = mapsPathMatch[1];
            return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzVcMzEjMDIuNiJOIDM1XzQ3JzMzLjAiRQ!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s&q=${encodeURIComponent(path)}`;
          }
        }
      }
      
      // If it's just coordinates (lat,lng format)
      const directCoordMatch = mapLocation.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);
      if (directCoordMatch) {
        const lat = directCoordMatch[1];
        const lng = directCoordMatch[2];
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzVcMzEjMDIuNiJOIDM1XzQ3JzMzLjAiRQ!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s`;
      }
      
      // If it's a plain text address, use it as query
      if (!mapLocation.includes('http')) {
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzVcMzEjMDIuNiJOIDM1XzQ3JzMzLjAiRQ!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s&q=${encodeURIComponent(mapLocation)}`;
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
    
    // Default fallback - use Damascus, Syria
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
          style={{ border: 0 }}
        />
        <a
          href={property?.mapLocation || `https://www.google.com/maps?q=${encodeURIComponent([address, neighborhood, property?.city || property?.state, property?.country || 'Syria'].filter(Boolean).join(', '))}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewLargerMap}
        >
          {t('viewLargerMap') || 'View larger map'}
        </a>
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
