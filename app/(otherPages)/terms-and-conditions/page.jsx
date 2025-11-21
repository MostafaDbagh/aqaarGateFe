"use client";
import React from "react";
import Link from "next/link";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";

export default function TermsAndConditions() {
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

      {/* Terms Content */}
      <section className="section-listing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="terms-content" style={{ 
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
                  Terms & Conditions
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
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  Welcome to SyProperty. Please read these Terms and Conditions ("Terms," "Agreement," or "Terms of Service") carefully before accessing or using the SyProperty website, mobile applications, or any of our real estate services (collectively, the "Service"). These Terms constitute a legally binding agreement between you ("User," "you," or "your") and SyProperty ("we," "our," or "us"). By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree with any part of these Terms, you must not access or use our Service. The headings in this Agreement are for convenience only and do not affect the interpretation of these Terms.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  1. Acceptance of Terms
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  By accessing and using SyProperty ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. These Terms apply to all users, including but not limited to visitors, registered members, property owners, agents, and brokers who access SyProperty via the website, mobile application, APIs, or any related digital platform. If you do not agree to abide by the above, please do not use this service.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  2. Use License
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  Permission is granted to temporarily download one copy of SyProperty per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
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
                    modify or copy the materials
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    use the materials for any commercial purpose or for any public display
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    attempt to reverse engineer any software contained on SyProperty
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    remove any copyright or other proprietary notations from the materials
                  </li>
                </ul>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  All rights not expressly granted to you under this license are reserved by SyProperty. You may not sublicense, sell, or otherwise exploit any material from the Service.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  3. Property Listings and Information
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  SyProperty provides property listings and related information for informational purposes only. We do not guarantee the accuracy, completeness, or timeliness of any property information, including but not limited to:
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
                    Property prices, availability, or condition
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Property descriptions, images, or specifications
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Agent contact information or credentials
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Legal status or ownership of properties
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
                  <strong>Third-Party Content Disclaimer:</strong> Some property listings and related information are submitted by third parties, including users and real estate professionals. SyProperty does not verify, endorse, or guarantee such information and is not responsible for any inaccuracies, errors, or omissions.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  4. User Accounts and Responsibilities
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  When creating an account with SyProperty, you agree to:
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
                    Provide accurate, current, and complete information
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Maintain and update your account information
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Keep your password secure and confidential
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Accept responsibility for all activities under your account
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Notify us immediately of any unauthorized use
                  </li>
                </ul>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>Account Suspension and Termination:</strong> We reserve the right to suspend or terminate your account, without prior notice, if we suspect fraudulent activity, violation of these Terms, or misuse of our platform. You are responsible for maintaining the confidentiality of your account and password.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  5. Prohibited Uses
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  You may not use SyProperty:
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
                    For any unlawful purpose or to solicit others to perform unlawful acts
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    To infringe upon or violate our intellectual property rights or the intellectual property rights of others
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    To submit false or misleading information
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    To upload or transmit viruses or any other type of malicious code
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    Use automated systems (including bots, crawlers, or data mining tools) to access or collect data from SyProperty
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    Post duplicate, fake, misleading, or fraudulent property listings
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    Engage in spam activity or create multiple accounts for abusive purposes
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
                  6. Agent and Broker Services
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  SyProperty facilitates connections between users and real estate professionals. We are not a licensed real estate broker or agent. All real estate transactions are conducted directly between users and licensed professionals. We:
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
                    Do not participate in real estate transactions
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Do not provide legal, financial, or tax advice
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Are not responsible for the actions of agents or brokers
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Do not guarantee the performance of any real estate professional
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
                  7. Listing Fees and Points Calculation
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>Dynamic Listing Pricing:</strong> Each property listing requires a different amount of points to publish, calculated by our proprietary algorithm based on various property characteristics. The listing fee (in points) varies depending on the property's features and specifications.
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>Pricing Algorithm Factors:</strong> Our algorithm calculates the listing publication cost based on the following factors:
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
                    <strong>Property Characteristics:</strong> Number of bedrooms and bathrooms
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Location:</strong> City where the property is located
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Property Size:</strong> Square footage or land area (size)
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Furnished Status:</strong> Whether the property is furnished or unfurnished
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    <strong>Amenities:</strong> Number and type of amenities included with the property
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    Other property features and specifications
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
                  <strong>Points Display Before Publishing:</strong> Before you submit your property listing for publication, our platform will automatically calculate and display the exact number of points required to publish your listing based on your property's characteristics. You will see the total points cost calculated by our algorithm before proceeding with publication.
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>User Consent and Agreement Required:</strong> You must review and agree to the displayed points cost before your listing will be submitted for publication. By clicking "Publish," "Submit," or any similar confirmation button after reviewing the points cost, you confirm:
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
                    Your agreement to pay the specified number of points for listing publication
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    Your authorization for SyProperty to deduct these points from your account balance
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    Your understanding that the points cost may vary for different properties
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
                  <strong>Sufficient Points Balance Required:</strong> You must have sufficient points in your account balance to cover the listing publication cost at the time of submission. If your account does not have enough points, you will need to purchase additional points before proceeding with publication. The platform will notify you if your points balance is insufficient.
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>Algorithm Updates:</strong> Our pricing algorithm may be updated from time to time to reflect market conditions, service improvements, or other factors. This may result in different point costs for similar properties submitted at different times. The points cost displayed and agreed upon at the time of submission is the final and binding cost for that specific listing, regardless of future algorithm changes.
                </p>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>Non-Refundable After Publication:</strong> Once points are deducted for listing publication and the listing is approved and published, the points are non-refundable unless the listing is rejected during our review process or in other specific circumstances as outlined in our refund policy. You cannot receive a refund of points based solely on dissatisfaction with the point cost after agreeing to and completing the publication process.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  8. Intellectual Property Rights
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of SyProperty and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
                </p>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>User-Generated Content License:</strong> By uploading or submitting content (including images, descriptions, property listings, or other media), you grant SyProperty a non-exclusive, worldwide, royalty-free, perpetual license to use, display, distribute, modify, and reproduce such content in connection with the Service and for marketing purposes.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  9. Privacy Policy
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  Your privacy is important to us. Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  10. Limitation of Liability
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  In no event shall SyProperty, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                </p>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>Aggregate Liability Cap:</strong> In no event shall SyProperty's total liability to you for any claims arising out of or relating to the Service exceed the amount, if any, paid by you to SyProperty during the six (6) months prior to the event giving rise to liability, or $100, whichever is greater.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  11. Disclaimer
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, SyProperty excludes all representations, warranties, conditions and terms relating to our Service and the use of this Service. We do not warrant that the Service will be uninterrupted, error-free, or secure, or that any information obtained will be accurate or reliable.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  12. Governing Law
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  These Terms shall be interpreted and governed by the laws of the Syrian Arab Republic, without regard to its conflict of law provisions. Any disputes arising from or relating to these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of the Syrian Arab Republic.
                </p>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>Dispute Resolution:</strong> Before filing a formal legal action, both parties agree to attempt to resolve disputes amicably through negotiation or mediation.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  13. Changes to Terms
                </h2>
                <p style={{ 
                  marginBottom: '16px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. <strong>ONGOING MODIFICATIONS:</strong> This application will continue to undergo modifications and updates. If a revision is material, we will provide all types of users (regular users and agents) with at least one (1) full month's advance notice prior to any new terms taking effect. Continued use of the Service after any such modifications constitutes acceptance of the revised Terms. It is your responsibility to review these Terms periodically for any changes.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  14. Contact Information
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <div style={{ 
                  marginBottom: '40px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  fontFamily: 'sans-serif'
                }}>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>Email:</strong> legal@syproperty.com
                  </p>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p style={{ margin: '0' }}>
                    <strong>Address:</strong> 123 Property Street, Real Estate City, RE 12345
                  </p>
                </div>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  15. Advertisements and Google AdSense
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>Third-Party Advertisements:</strong> SyProperty may display advertisements, including Google AdSense advertisements, on our platform. These advertisements may be served by third-party advertising companies and may use cookies, web beacons, or similar technologies to collect information about your visits to our website and other websites.
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>Google AdSense:</strong> We use Google AdSense and other advertising services to display ads on our platform. Google AdSense uses cookies and similar technologies to serve ads based on your prior visits to our website and other websites. You may opt out of personalized advertising by visiting Google's Ads Settings or by managing your cookie preferences in your browser.
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>No Endorsement:</strong> The presence of advertisements on our platform does not constitute an endorsement, recommendation, or sponsorship by SyProperty of the advertised products, services, or companies. We are not responsible for the content, accuracy, or practices of third-party advertisers.
                </p>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>Your Choices:</strong> You may choose to disable cookies in your browser settings, which may affect your ability to interact with our platform and view certain advertisements. For more information about how we use cookies and tracking technologies, please refer to our Privacy Policy.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  16. Ongoing Modifications and Updates
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>Platform Evolution:</strong> SyProperty is an evolving platform that will continue to undergo modifications, updates, and improvements. We regularly update our features, functionality, design, and services to enhance user experience and comply with technological and legal requirements.
                </p>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  <strong>Continuous Development:</strong> These modifications may include but are not limited to:
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
                    Updates to features, user interface, and functionality
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    Changes to payment methods, pricing, or subscription packages
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    Security enhancements and technical improvements
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    Compliance with Syrian laws and regulations
                  </li>
                  <li style={{ 
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'sans-serif'
                  }}>
                    Integration of new services or third-party tools (including advertising services like Google AdSense)
                  </li>
                </ul>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  We will notify users of material changes as required by these Terms. By continuing to use the Service, you acknowledge that the platform may change and you agree to adapt to such modifications. We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  17. Severability
                </h2>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction in the Syrian Arab Republic, the remaining provisions will remain in full force and effect. The invalid, illegal, or unenforceable provision shall be replaced with a valid, legal, and enforceable provision that comes closest to the intent of the original provision.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  18. Entire Agreement
                </h2>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and SyProperty regarding your use of the Service and supersede all prior agreements, understandings, negotiations, and discussions, whether oral or written, relating to the subject matter hereof. No modification, amendment, or waiver of any provision of these Terms shall be effective unless in writing and signed by both parties.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  19. Force Majeure
                </h2>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  SyProperty shall not be liable for any delays, failures, or inability to perform its obligations under these Terms due to circumstances beyond its reasonable control, including but not limited to natural disasters, wars, acts of terrorism, government actions, internet outages, cyberattacks, equipment failures, or other force majeure events. In such events, SyProperty will use reasonable efforts to notify users and resume normal operations as soon as practicable.
                </p>



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
              color: '#000000',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '600'
            }}>
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" style={{
              fontSize: '14px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
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
          .terms-content {
            padding: 20px 0 !important;
            max-width: 100% !important;
          }
          
          .terms-content h1 {
            font-size: 36px !important;
          }
          
          .terms-content h2 {
            font-size: 20px !important;
          }
          
          .terms-content p,
          .terms-content li {
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
          .terms-content h1 {
            font-size: 28px !important;
          }
          
          .terms-content h2 {
            font-size: 18px !important;
          }
          
          .terms-content p,
          .terms-content li {
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