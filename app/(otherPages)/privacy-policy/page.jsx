"use client";
import React from "react";
import Link from "next/link";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";

export default function PrivacyPolicy() {
  const { showLoginModal, showRegisterModal } = useGlobalModal();

  const handleLoginClick = (e) => {
    e.preventDefault();
    showLoginModal();
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    showRegisterModal();
  };

  return (
    <div className="page-wrapper">
      {/* Clean Minimalist Header */}
      <header style={{
        backgroundColor: '#ffffff',
        padding: '20px 0',
        borderBottom: '1px solid #e5e5e5',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#000000',
            fontFamily: 'sans-serif',
            textDecoration: 'none'
          }}>
            <Link href="/" style={{ color: '#000000', textDecoration: 'none' }}>
              SyProperty
            </Link>
          </div>

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px'
          }}>
            <Link href="/" style={{
              fontSize: '16px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400',
              transition: 'color 0.2s ease'
            }}>
              Home
            </Link>
            <Link href="/about-us" style={{
              fontSize: '16px',
              color: '#000000',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '700'
            }}>
              About Us
            </Link>
          </nav>

          {/* Login/Register Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <button onClick={handleLoginClick} style={{
              fontSize: '16px',
              color: '#000000',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e5e5e5',
              transition: 'all 0.2s ease',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}>
              Login
            </button>
            <button onClick={handleRegisterClick} style={{
              fontSize: '16px',
              color: '#ffffff',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '600',
              padding: '10px 20px',
              borderRadius: '6px',
              backgroundColor: '#000000',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}>
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Privacy Policy Content */}
      <section className="section-listing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="privacy-content" style={{ 
                backgroundColor: '#ffffff', 
                padding: '40px 0', 
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: '1.6',
                fontSize: '16px',
                fontFamily: 'sans-serif'
              }}>
                
                {/* Main Title - Centered */}
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: '#000000',
                  textAlign: 'center',
                  marginBottom: '20px',
                  fontFamily: 'sans-serif',
                  letterSpacing: '-0.02em'
                }}>
                  Privacy Policy
                </h1>

                {/* Updated Date - Left Aligned */}
                <div style={{ 
                  marginBottom: '40px',
                  textAlign: 'left'
                }}>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#333333',
                    margin: '0',
                    fontWeight: '400'
                  }}>
                    Updated on: {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                {/* Introduction */}
                <p style={{ 
                  marginBottom: '40px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  SyProperty ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  1. Information We Collect
                </h2>
                
                <h3 style={{ 
                  color: '#000000', 
                  marginBottom: '20px', 
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  1.1 Personal Information
                </h3>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Register for an account
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Search for properties
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Contact agents or brokers
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Submit property listings
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Subscribe to our newsletter
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Participate in surveys or promotions
                  </li>
                </ul>

                <h3 style={{ 
                  color: '#000000', 
                  marginBottom: '20px', 
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  1.2 Automatically Collected Information
                </h3>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  We automatically collect certain information when you visit our website:
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    IP address and device information
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Browser type and version
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Operating system
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Pages visited and time spent on pages
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Referring website
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Cookies and similar tracking technologies
                  </li>
                </ul>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  2. How We Use Your Information
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  We use the information we collect to:
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Provide and maintain our services
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Process transactions and send related information
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Send you technical notices and support messages
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Respond to your comments and questions
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Improve our website and services
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Send you marketing communications (with your consent)
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Comply with legal obligations
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Protect against fraud and abuse
                  </li>
                </ul>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  3. Information Sharing and Disclosure
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  We may share your information in the following circumstances:
                </p>
                
                <h3 style={{ 
                  color: '#000000', 
                  marginBottom: '20px', 
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  3.1 With Real Estate Professionals
                </h3>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  When you express interest in a property or contact an agent, we may share your contact information and property preferences with the relevant real estate professional to facilitate communication.
                </p>

                <h3 style={{ 
                  color: '#000000', 
                  marginBottom: '20px', 
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  3.2 Service Providers
                </h3>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  We may share information with third-party service providers who assist us in operating our website, conducting business, or serving our users. These parties are bound by confidentiality agreements.
                </p>

                <h3 style={{ 
                  color: '#000000', 
                  marginBottom: '20px', 
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  3.3 Legal Requirements
                </h3>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  We may disclose information if required by law or in response to valid legal processes, such as subpoenas or court orders.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  4. Cookies and Tracking Technologies
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  We use cookies and similar technologies to:
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Remember your preferences and settings
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Analyze website traffic and usage patterns
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Provide personalized content and advertisements
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Improve website functionality
                  </li>
                </ul>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  You can control cookie settings through your browser preferences. However, disabling cookies may affect the functionality of our website.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  5. Data Security
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  6. Your Rights and Choices
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul style={{ 
                  marginBottom: '16px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Access:</strong> Request access to your personal information
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Correction:</strong> Request correction of inaccurate information
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Deletion:</strong> Request deletion of your personal information
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Portability:</strong> Request transfer of your data
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Opt-out:</strong> Unsubscribe from marketing communications
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Restriction:</strong> Request restriction of processing
                  </li>
                </ul>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  7. Data Retention
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  8. International Data Transfers
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  9. Children's Privacy
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  10. Third-Party Links
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  11. Changes to This Privacy Policy
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
                </p>

                                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  13. SyProperty's Business Model and Usage
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>Platform Role - No Interference Between Sellers and Buyers:</strong> SyProperty operates solely as a listing platform that displays property information. <strong>We do NOT interfere between sellers and buyers.</strong> All communications, negotiations, agreements, and transactions occur directly and exclusively between property sellers (or their agents) and property buyers. SyProperty is not involved, does not participate, and has no role in any aspect of real estate transactions between parties.
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>Revenue Model - Points from Listing Publications:</strong> SyProperty's revenue and profit come from points that agents pay when they publish property listings on our platform. <strong>We do NOT receive any commission, fee, or benefit from property sales or rentals between sellers and buyers.</strong> Our revenue is generated exclusively through:
                </p>
                <ul style={{ 
                  marginBottom: '20px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Listing Publication Points:</strong> Points deducted from agent accounts when they publish property listings on our platform
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Agent Subscription Packages:</strong> Package subscriptions (basic, premium, enterprise) purchased by agents
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Points Purchases:</strong> Points purchased by agents to maintain their account balance for listing publications
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Platform Usage Fees:</strong> Other platform usage fees (if applicable in the future)
                  </li>
                </ul>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  SyProperty has NO financial interest, benefits, commissions, or any other form of compensation from transactions between sellers and buyers. We do not participate in, facilitate, or benefit from any real estate transactions between parties.
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif',
                  fontWeight: '600'
                }}>
                  <strong>Advance Notification of Changes:</strong> If there are any changes to our business model, revenue structure, points system, fees, services, privacy practices, or policies that affect users, we will notify ALL types of users (regular users and agents) in advance. Material changes will be communicated with at least one (1) full month's advance notice via email and our communication channels. Continued use of the Service after such changes constitutes acceptance of the modified terms.
                </p>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  By using our Service, you acknowledge that you understand SyProperty operates as a listing platform only, does not interfere between sellers and buyers, and generates revenue solely from listing publications and agent subscriptions, not from property transactions.
                </p>

<h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  14. Contact Us
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div style={{ 
                  marginBottom: '40px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  fontFamily: 'sans-serif'
                }}>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>Email:</strong> privacy@syproperty.com
                  </p>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>Address:</strong> 123 Property Street, Real Estate City, RE 12345
                  </p>
                  <p style={{ margin: '0' }}>
                    <strong>Data Protection Officer:</strong> dpo@syproperty.com
                  </p>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Minimalist Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        padding: '40px 0',
        borderTop: '1px solid #e5e5e5',
        marginTop: '60px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          {/* Footer Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <Link href="/" style={{
              fontSize: '14px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              Home
            </Link>
            <Link href="/about-us" style={{
              fontSize: '14px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              About Us
            </Link>
            <Link href="/contact" style={{
              fontSize: '14px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              Contact
            </Link>
            <Link href="/terms-and-conditions" style={{
              fontSize: '14px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" style={{
              fontSize: '14px',
              color: '#000000',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '600'
            }}>
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <div style={{
            fontSize: '14px',
            color: '#999999',
            fontFamily: 'sans-serif',
            fontWeight: '400'
          }}>
            © {new Date().getFullYear()} SyProperty. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .privacy-content {
            padding: 20px 0 !important;
            max-width: 100% !important;
          }
          
          .privacy-content h1 {
            font-size: 36px !important;
          }
          
          .privacy-content h2 {
            font-size: 20px !important;
          }
          
          .privacy-content h3 {
            font-size: 18px !important;
          }
          
          .privacy-content p,
          .privacy-content li {
            font-size: 15px !important;
          }

          header nav {
            gap: 20px !important;
          }

          header div:last-child {
            gap: 10px !important;
          }

          footer div:first-child {
            gap: 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          .privacy-content h1 {
            font-size: 28px !important;
          }
          
          .privacy-content h2 {
            font-size: 18px !important;
          }
          
          .privacy-content h3 {
            font-size: 16px !important;
          }
          
          .privacy-content p,
          .privacy-content li {
            font-size: 14px !important;
          }

          header {
            padding: 15px 0 !important;
          }

          header div {
            flex-direction: column !important;
            gap: 15px !important;
          }

          header nav {
            gap: 15px !important;
          }

          footer div:first-child {
            flex-direction: column !important;
            gap: 15px !important;
          }
        }
      `}</style>
    </div>
  );
}