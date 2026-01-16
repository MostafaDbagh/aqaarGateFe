"use client";
import React, { useState } from "react";
import styles from "./CopyIcon.module.css";

export default function CopyIcon({ text, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`${styles.copyButton} ${copied ? styles.copied : ''} ${className}`}
      type="button"
      aria-label={copied ? "Copied!" : "Copy"}
      title={copied ? "Copied!" : "Copy"}
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5.33337" y="5.33331" width="8" height="8" rx="1.33333" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.33337 10.6667V3.33333C3.33337 2.59695 3.93032 2 4.66671 2H12.0000" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

