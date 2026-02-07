"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from 'next-intl';
import { useAuthState } from "@/store/hooks/useAuth";
import { authAPI } from "@/apis/auth";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import { getAddPropertyWhatsAppUrl } from "@/constants/contactWhatsApp";
import { 
  UserAvatarIcon, 
  DashboardIcon, 
  ProfileIcon, 
  PackageIcon, 
  HeartIcon, 
  ReviewIcon, 
  PropertyIcon, 
  AddPropertyIcon, 
  LogoutIcon 
} from "@/components/icons";
import NotificationBell from "@/components/common/NotificationBell";

export default function DashboardNav({ color = "" }) {
  const [isDDOpen, setIsDDOpen] = useState(false);
  const dropdownRef = useRef(null);
  const t = useTranslations('dashboardNav');
  const tCommon = useTranslations('common');
  
  // Use Redux for auth state
  const { 
    isAuthenticated: isLoggedIn, 
    isAgent: isAgentUser, 
    displayName, 
    logout: logoutUser,
    changeRole,
    user
  } = useAuthState();
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Use GlobalModal context for modals
  const { showRegisterModal, showLoginModal, showSuccessModal } = useGlobalModal();


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDDOpen(false);
      }
    };

    if (isDDOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDDOpen]);

  const handleUserIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle dropdown (for both guest and logged-in)
    setIsDDOpen((pre) => !pre);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await authAPI.signout();
      logoutUser(); // This will handle the redirect to home page
      setIsDDOpen(false);
    } catch (error) {
      // Still logout and redirect even if API call fails
      logoutUser(); // This will handle the redirect to home page
      setIsDDOpen(false);
    }
  };


  return (
    <div
      ref={dropdownRef}
      className={`box-user tf-action-btns dashboard-nav-user ${isDDOpen ? "active" : ""} `}
      onClick={handleUserIconClick}
    >
      <div className="user dashboard-nav-user-inner" 
      style={{ cursor: 'pointer',borderRadius: '24px' }}>
        <UserAvatarIcon />
      </div>
      <div className={`name ${color} dashboard-nav-name`}>
        {displayName === 'Guest' ? tCommon('guest') : displayName}
        {isLoggedIn && <i className="icon-CaretDown" />}
      </div>
      <div 
        className={`menu-user ${isDDOpen ? 'dashboard-nav-menu' : 'dashboard-nav-menu-hidden'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ADMIN MENU ITEMS */}
        {isLoggedIn && isAdmin && (
          <>
            {/* Admin Dashboard */}
            <Link 
              className="dropdown-item dashboard-disabled-mobile"
              href="/en/admin/overview"
              onClick={(e) => {
                if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }}
              style={{
                padding: '14px 12px',
                border: '1px solid #d1d5db'
              }}
            >
              <DashboardIcon />
              {t('adminDashboard')}
            </Link>


            {/* Properties */}
            <Link 
              className="dropdown-item dashboard-disabled-mobile" 
              href="/en/admin/properties"
              onClick={(e) => {
                if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }}
              style={{
                padding: '14px 12px',
                border: '1px solid #d1d5db'
              }}
            >
              <PropertyIcon />
              {t('properties')}
            </Link>

            {/* Agents */}
            <Link 
              className="dropdown-item dashboard-disabled-mobile" 
              href="/en/admin/agents"
              onClick={(e) => {
                if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }}
              style={{
                padding: '14px 12px',
                border: '1px solid #d1d5db'
              }}
            >
              <AddPropertyIcon />
              {t('agents')}
            </Link>

            {/* Rental Services */}
            <Link 
              className="dropdown-item dashboard-disabled-mobile" 
              href="/en/admin/rental-services"
              onClick={(e) => {
                if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }}
              style={{
                padding: '14px 12px',
                border: '1px solid #d1d5db'
              }}
            >
              <PropertyIcon />
              {t('rentalServices')}
            </Link>

            {/* Contact Us */}
            <Link 
              className="dropdown-item dashboard-disabled-mobile" 
              href="/en/admin/contacts"
              onClick={(e) => {
                if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }}
              style={{
                padding: '14px 12px',
                border: '1px solid #d1d5db'
              }}
            >
              <ReviewIcon />
              {t('contactUs')}
            </Link>
          </>
        )}

        {/* AGENT & USER MENU ITEMS (Not Admin) */}
        {isLoggedIn && !isAdmin && (
          <>
            {/* Dashboard - For agents only */}
            {isAgentUser && (
              <Link 
                className="dropdown-item dashboard-disabled-mobile"
                href="/dashboard"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                style={{
                  padding: '14px 12px',
                  border: '1px solid #d1d5db'
                }}
              >
                <DashboardIcon />
                {t('dashboard')}
              </Link>
            )}


            {/* My Package - Only for logged in agents (disabled on mobile only) */}
            {isAgentUser && (
              <Link 
                className="dropdown-item dashboard-disabled-mobile" 
                href="/my-package"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                style={{
                  padding: '14px 12px',
                  border: '1px solid #d1d5db'
                }}
              >
                <PackageIcon />
                {t('myPackage')}
              </Link>
            )}

            {/* My Profile - For ALL logged in users and agents (disabled on mobile only) */}
            <Link 
              className="dropdown-item dashboard-disabled-mobile" 
              href="/my-profile"
              onClick={(e) => {
                if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }}
              style={{
                padding: '14px 12px',
                border: '1px solid #d1d5db'
              }}
            >
              <ProfileIcon />
              {t('myProfile')}
            </Link>

            {/* My Favorites - For ALL logged in users (disabled on mobile only) */}
            <Link 
              className="dropdown-item dashboard-disabled-mobile" 
              href="/my-favorites"
              onClick={(e) => {
                if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }}
              style={{
                padding: '14px 12px',
                border: '1px solid #d1d5db'
              }}
            >
              <i className="icon-bookmark" />
              {t('myFavorites')}
            </Link>

            {/* Reviews - Only for logged in agents (disabled on mobile only) */}
            {isAgentUser && (
              <Link 
                className="dropdown-item dashboard-disabled-mobile" 
                href="/review"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                style={{
                  padding: '14px 12px',
                  border: '1px solid #d1d5db'
                }}
              >
                <ReviewIcon />
                {t('reviews')}
              </Link>
            )}

            {/* Messages - Only for logged in agents (disabled on mobile only) */}
            {isAgentUser && (
              <Link 
                className="dropdown-item dashboard-disabled-mobile" 
                href="/messages"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                style={{
                  padding: '14px 12px',
                  border: '1px solid #d1d5db'
                }}
              >
                <i className="icon-message" />
                {t('messages')}
              </Link>
            )}

            {/* My Properties - Only for logged in agents (disabled on mobile only) */}
            {isAgentUser && (
              <Link 
                className="dropdown-item dashboard-disabled-mobile" 
                href="/my-property"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                style={{
                  padding: '14px 12px',
                  border: '1px solid #d1d5db'
                }}
              >
                <PropertyIcon />
                {t('myProperties')}
              </Link>
            )}

            {/* Add Property - Visible for all logged-in users. Agent: link to add-property; user: open WhatsApp */}
            {isAgentUser ? (
              <Link 
                className="dropdown-item dashboard-disabled-mobile" 
                href="/add-property"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                style={{
                  padding: '14px 12px',
                  border: '1px solid #d1d5db'
                }}
              >
                <AddPropertyIcon />
                {t('addProperty')}
              </Link>
            ) : (
              <a
                className="dropdown-item dashboard-disabled-mobile add-property-whatsapp-item"
                href={getAddPropertyWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                    e.preventDefault();
                    window.open(getAddPropertyWhatsAppUrl(), '_blank');
                  }
                }}
                style={{
                  padding: '14px 12px',
                  border: '1px solid #86efac',
                  backgroundColor: '#dcfce7',
                  color: '#15803d'
                }}
              >
                <AddPropertyIcon />
                {t('addProperty')}
              </a>
            )}
          </>
        )}

        {/* Login/Register - Only for non-logged in users (dropdown below icon, no overlay) */}
        {!isLoggedIn && (
          <div className="auth-choice-dropdown" style={{ padding: 0, border: 'none' }}>
            <button
              type="button"
              className="dropdown-item auth-choice-login-btn"
              onClick={(e) => { e.preventDefault(); setIsDDOpen(false); showLoginModal(); }}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: '#1f2937',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '12px',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {t('login')}
            </button>
            <p style={{ textAlign: 'center', fontSize: '15px', color: '#4b5563', margin: '0 0 8px' }}>
              {t('dontHaveAccount')}{' '}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setIsDDOpen(false); showRegisterModal(); }}
                style={{ color: '#F97316', textDecoration: 'underline', fontWeight: 500 }}
              >
                {t('register')}
              </a>
            </p>
          </div>
        )}

        {/* Logout - Only for logged in users */}
        {isLoggedIn && (
          <button 
            type="button" 
            className="dropdown-item dashboard-nav-button" 
            onClick={handleLogout} 
            style={{
              padding: '14px 12px',
              border: '1px solid #d1d5db',
              cursor: 'pointer'
            }}
          >
            <LogoutIcon />
            {t('logout')}
          </button>
        )}
      </div>
    </div>
  );
}
