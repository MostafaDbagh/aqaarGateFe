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
        setIsTruncated(element.scrollWidth > element.clientWidth);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [location]);

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

