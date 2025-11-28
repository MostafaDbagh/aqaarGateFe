"use client";
import React from "react";
import Link from "next/link";

interface DashboardFooterProps {
  className?: string;
}

export default function DashboardFooter({ className = "" }: DashboardFooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className={`footer-dashboard ${className}`}>
      <p>Copyright © {currentYear} AqaarGate</p>
      <ul className="list">
        <li>
          <Link href="/privacy-policy">Privacy</Link>
        </li>
        <li>
          <Link href="/terms-and-conditions">Terms</Link>
        </li>
      </ul>
    </div>
  );
}

