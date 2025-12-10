"use client";

import React from 'react';

/**
 * CircularLoader - A small circular loading spinner
 * Used for inline loading states like property counts
 */
export default function CircularLoader({ 
  size = 'small', // 'small', 'medium', 'large'
  color = '#f1913d', // Default orange color
  className = ''
}) {
  const sizeMap = {
    small: '16px',
    medium: '20px',
    large: '24px'
  };

  const borderWidth = {
    small: '2px',
    medium: '2.5px',
    large: '3px'
  };

  const loaderSize = sizeMap[size] || sizeMap.small;
  const border = borderWidth[size] || borderWidth.small;

  return (
    <div 
      className={`circular-loader ${className}`}
      style={{
        display: 'inline-block',
        width: loaderSize,
        height: loaderSize,
        border: `${border} solid rgba(241, 145, 61, 0.2)`,
        borderTop: `${border} solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    >
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}


