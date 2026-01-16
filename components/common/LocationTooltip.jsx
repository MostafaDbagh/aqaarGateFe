"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./LocationTooltip.module.css";

export default function LocationTooltip({ location, children, className = "" }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current;
        // Check if text is truncated
        const truncated = element.scrollWidth > element.clientWidth;
        setIsTruncated(truncated);
      }
    };

    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(checkTruncation, 0);
    window.addEventListener('resize', checkTruncation);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkTruncation);
    };
  }, [location, children]);

  if (!location) return children;

  return (
    <span
      className={`${styles.tooltipContainer} ${className}`}
      onMouseEnter={() => isTruncated && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span
        ref={textRef}
        className={styles.textContainer}
      >
        {children}
      </span>
      {showTooltip && isTruncated && (
        <div className={styles.tooltip}>
          {location}
          <div className={styles.tooltipArrow} />
        </div>
      )}
    </span>
  );
}

