"use client";
import React from "react";
import Nav from "./Nav";
import Link from "next/link";
import Image from "next/image";
import DashboardNav from "./DashboardNav";
import { PhoneIcon } from "@/components/icons";
import { useAuthState } from "@/store/hooks/useAuth";
import { authAPI } from "@/apis/auth";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";

export default function Header1({ parentClass = "header" }) {
  // Use Redux for auth state
  const { isAuthenticated: isLoggedIn, isAgent, user } = useAuthState();
  const { showSuccessModal } = useGlobalModal();
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const makeAgent = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user._id) {
        const result = await authAPI.makeAgent(user._id);
        
        // Show success modal
        showSuccessModal(
          'Congratulations! 🎉', 
          'You are now a Property Agent! You can now list and manage properties.',
          user.email
        );
      }
    } catch (error) {
      // Handle error silently or show error modal
    }
  };

  return (
    <header id="header-main" className={parentClass}>
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
                      src="/images/logo/logo@2x.png"
                      width={120}
                      height={56}
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
                  <div className="phone-number">
                    <div className="icons">
                      <PhoneIcon stroke="black" />
                    </div>
                    <p>+963995278383</p>
                  </div>
                  <DashboardNav />
                  
                  {/* Add Property Button - Only for Agents */}
                  {isLoggedIn && isAgent && (
                    <div className="btn-add">
                      <Link
                        className="tf-btn style-border pd-23"
                        href={`/add-property`}
                        style={{ borderRadius: '12px' }}
                      >
                        Add property
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
                        🎯 Make Me Agent
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
