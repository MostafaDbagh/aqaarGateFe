"use client";
import React, { useEffect, useRef } from "react";

export default function MapComponent({ zoom = 14, center, address }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // Build Google Maps embed URL
    let mapUrl = '';
    
    if (center && typeof center === 'string') {
      // If center is coordinates string (lat,lng)
      const coords = center.trim();
      mapUrl = `https://www.google.com/maps?q=${coords}&hl=en&z=${zoom}&output=embed`;
    } else if (address) {
      // If address is provided
      mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&hl=en&z=${zoom}&output=embed`;
    } else {
      // Default to Damascus, Syria
      mapUrl = `https://www.google.com/maps?q=Damascus,Syria&hl=en&z=${zoom}&output=embed`;
    }

    // Update iframe src if ref exists
    if (mapRef.current) {
      mapRef.current.src = mapUrl;
    }
  }, [zoom, center, address]);

  return (
    <iframe
      ref={mapRef}
      src={`https://www.google.com/maps?q=Damascus,Syria&hl=en&z=${zoom}&output=embed`}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Property Map"
    />
  );
}

