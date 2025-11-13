"use client";
import React from "react";

export default function ComingSoon({ 
  title = "Coming Soon",
  message = "This page is under development and will be available soon.",
  icon = "🚀"
}) {
  return (
    <div className="main-content w-100">
      <div className="main-content-inner style-3">
        <div className="button-show-hide show-mb">
          <span className="body-1">Show Dashboard</span>
        </div>
        <div className="widget-box-2 style-2" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '60px 20px'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>
            {icon}
          </div>
          <h2 className="title" style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: '#333'
          }}>
            {title}
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            maxWidth: '600px',
            lineHeight: '1.6',
            marginBottom: '40px'
          }}>
            {message}
          </p>
          <div style={{
            padding: '20px 40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '2px dashed #dee2e6',
            maxWidth: '500px'
          }}>
            <p style={{ 
              fontSize: '16px', 
              color: '#495057',
              margin: 0
            }}>
              We're working hard to bring you this feature. Please check back soon!
            </p>
          </div>
        </div>
        {/* .footer-dashboard */}
        <div className="footer-dashboard style-2">
          <p>Copyright © {new Date().getFullYear()} AqaarGate</p>
          <ul className="list">
            <li>
              <a href="#">Privacy</a>
            </li>
            <li>
              <a href="#">Terms</a>
            </li>
            <li>
              <a href="#">Support</a>
            </li>
          </ul>
        </div>
        {/* .footer-dashboard */}
      </div>
      <div className="overlay-dashboard" />
    </div>
  );
}

