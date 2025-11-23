"use client";
import { useEffect } from 'react';
import { keywordsArray } from '@/constants/keywords';

export default function KeywordsMetaTag() {
  useEffect(() => {
    // Remove existing keywords meta tag if any
    const existingMeta = document.querySelector('meta[name="keywords"]');
    if (existingMeta) {
      existingMeta.remove();
    }

    // Create and add keywords meta tag
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'keywords');
    metaTag.setAttribute('content', keywordsArray.join(', '));
    document.head.appendChild(metaTag);

    // Cleanup function
    return () => {
      const meta = document.querySelector('meta[name="keywords"]');
      if (meta) {
        meta.remove();
      }
    };
  }, []);

  return null;
}

