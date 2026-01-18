"use client";
import React from "react";
import Nav from "./Nav";
import Link from "next/link";
import Image from "next/image";
import DashboardNav from "./DashboardNav";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import NotificationBell from "@/components/common/NotificationBell";
import { useAuthState } from "@/store/hooks/useAuth";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function Header1({ parentClass = "header" }) {
  // Use Redux for auth state
  const { isAuthenticated: isLoggedIn, isAgent, user } = useAuthState();
  const { showMakeMeAgentModal } = useGlobalModal();
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Check if we're on dashboard or admin pages
  // Remove locale from pathname for checking
  const pathWithoutLocale = pathname?.replace(/^\/(en|ar)/, '') || pathname || '';
  const isDashboardPage = pathWithoutLocale?.includes('/dashboard') || pathWithoutLocale?.includes('/admin') || 
                          pathWithoutLocale?.includes('/my-property') || pathWithoutLocale?.includes('/add-property') ||
                          pathWithoutLocale?.includes('/my-profile') || pathWithoutLocale?.includes('/my-package') ||
                          pathWithoutLocale?.includes('/messages') || pathWithoutLocale?.includes('/review') ||
                          pathWithoutLocale?.includes('/my-favorites') || pathWithoutLocale?.includes('/my-save-search');

  const makeAgent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    showMakeMeAgentModal();
  };

  return (
    <header id="header-main" className={parentClass} dir="ltr">
      <div className="header-inner">
        <div className="tf-container xl">
          <div className="row">
            <div className="col-12">
              <div className="header-inner-wrap">
                <div className="header-logo">
                  <Link href={`/`} className="site-logo">
                    <Image
                      className="logo_header"
                      alt="Property Listing Logo - Home"
                      src="/images/logo/new-logo.png"
                      width={138}
                      height={48}
                      priority
                    />
                  </Link>
                </div>
                <nav className="main-menu">
                  <ul className="navigation ">
                    <Nav />
                  </ul>
                </nav>
                <div className="header-right">
                  <LanguageSwitcher />
                  {isLoggedIn && <NotificationBell />}
                  <DashboardNav />
                  
                  {/* Add Property Button - Only for Agents */}
                  {isLoggedIn && isAgent && (
                    <div className="btn-add">
                      <Link
                        className="tf-btn style-border pd-23"
                        href={`/add-property`}
                        style={{ borderRadius: '12px' }}
                      >
                        {tCommon('addProperty')}
                      </Link>
                    </div>
                  )}
                  
                  {/* Make Me Agent Button - Only for Logged in Users (not agents, not admin) */}
                  {isLoggedIn && !isAgent && !isAdmin && (
                    <div className="btn-add">
                      <button
                        type="button"
                        className="tf-btn pd-23"
                        onClick={makeAgent}
                        style={{
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: '12px'
                        }}
                      >
                        🎯 {tCommon('makeMeAgent')}
                      </button>
                    </div>
                  )}
                  <div
                    className="mobile-button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#menu-mobile"
                    aria-controls="menu-mobile"
                  >
                    <i className="icon-menu" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
