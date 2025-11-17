"use client";
import React from 'react';
import { sanitizeHTML } from '@/utils/security';

/**
 * SafeHTML Component
 * Renders HTML content safely by sanitizing it first
 * Prevents XSS attacks
 */
export default function SafeHTML({ 
  content, 
  className = '',
  tag = 'div',
  ...props 
}) {
  if (!content) return null;
  
  const sanitized = sanitizeHTML(content);
  const Tag = tag;
  
  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
      {...props}
    />
  );
}

