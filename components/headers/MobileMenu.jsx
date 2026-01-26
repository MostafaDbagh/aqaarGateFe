"use client";
import { blogMenu, homes, otherPages, propertyLinks } from "@/constants/menu";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuthState } from "@/store/hooks/useAuth";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";

export default function MobileMenu() {
  const pathname = usePathname();
  const t = useTranslations("mobileMenu");
  const tNav = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { isAuthenticated, user } = useAuthState();
  const { showModal } = useGlobalModal();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check authentication status and user role
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const isLoggedIn = !!(token && userStr);
      setIsLoggedIn(isLoggedIn);
      
      if (isLoggedIn && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUserRole(userData?.role || null);
        } catch (error) {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };
    
    checkAuth();
    setIsLoggedIn(isAuthenticated);
    
    // Also check from Redux user if available
    if (user?.role) {
      setUserRole(user.role);
    }
    
    // Listen for storage changes
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated, user]);

  const isParentActive = (menus) =>
    menus.some((menu) =>
      menu.submenu
        ? menu.submenu.some((item) =>
            item.submenu
              ? item.submenu.some(
                  (item) => item.href.split("/")[1] === pathname.split("/")[1]
                )
              : item.href.split("/")[1] === pathname.split("/")[1]
          )
        : menu.href.split("/")[1] === pathname.split("/")[1]
    );
  return (
    <div
      className="offcanvas offcanvas-start mobile-nav-wrap"
      tabIndex={-1}
      id="menu-mobile"
      aria-labelledby="menu-mobile"
    >
      <div className="offcanvas-header top-nav-mobile">
        <div className="offcanvas-title">
          <Link href={`/`}>
            <Image
              alt="Mobile menu icon"
              src="/images/logo/new-logo.png"
              width={138}
              height={48}
            />
          </Link>
        </div>
        <div data-bs-dismiss="offcanvas" aria-label={tCommon("close")}>
          <i className="icon-close" />
        </div>
      </div>
      <div className="offcanvas-body inner-mobile-nav">
        <div className="mb-body">
          <ul id="menu-mobile-menu">
            <li
              className={`menu-item  ${
                homes.some((elm) => elm.href == pathname)
                  ? "current-menu-item"
                  : ""
              } `}
            >
              <Link
                href="/"
                className="item-menu-mobile"
                onClick={() => {
                  const offcanvas = document.getElementById('menu-mobile');
                  if (offcanvas) {
                    const closeButton = offcanvas.querySelector('[data-bs-dismiss="offcanvas"]');
                    if (closeButton) {
                      closeButton.click();
                    }
                  }
                }}
              >
                {t("home")}
              </Link>
            </li>
            <li
              className={`menu-item   ${
                isParentActive(propertyLinks) ? "current-menu-item" : ""
              } `}
            >
              <Link
                href="/property-list"
                className="item-menu-mobile"
                onClick={() => {
                  const offcanvas = document.getElementById('menu-mobile');
                  if (offcanvas) {
                    const closeButton = offcanvas.querySelector('[data-bs-dismiss="offcanvas"]');
                    if (closeButton) {
                      closeButton.click();
                    }
                  }
                }}
              >
                {t("listing")}
              </Link>
            </li>
            <li
              className={`menu-item menu-item-has-children-mobile   ${
                isParentActive(otherPages) ? "current-menu-item" : ""
              } `}
            >
              <a
                href="#dropdown-menu-four"
                className="item-menu-mobile collapsed"
                data-bs-toggle="collapse"
                aria-expanded="true"
                aria-controls="dropdown-menu-four"
              >
                {t("pages")}
              </a>
              <div
                id="dropdown-menu-four"
                className="collapse"
                data-bs-parent="#menu-mobile-menu"
              >
                <ul className="sub-mobile">
                  {otherPages
                    .filter(links => {
                      // Hide "Future Interest Buyer" for guests and agents
                      if (links.href === '/future-buyer-interest') {
                        if (!isLoggedIn || userRole === 'guest' || userRole === 'agent') {
                          return false;
                        }
                      }
                      return true;
                    })
                    .map((links, i) => (
                    <React.Fragment key={i}>
                      {links.submenu ? (
                        <li
                          className={`menu-item menu-item-has-children-mobile-2   ${
                            isParentActive(links.submenu || [])
                              ? "current-menu-item"
                              : ""
                          }   `}
                        >
                          <a
                            href="#sub-agents"
                            className="item-menu-mobile collapsed"
                            data-bs-toggle="collapse"
                            aria-expanded="true"
                            aria-controls="sub-agents"
                          >
                            {links.title}
                          </a>
                          <div
                            id="sub-agents"
                            className="collapse"
                            data-bs-parent="#dropdown-menu-four"
                          >
                            <ul className="sub-mobile">
                              {links.submenu.map((link, i2) => (
                                <li
                                  className={`menu-item ${
                                    link.href?.split("/")[1] ==
                                    pathname.split("/")[1]
                                      ? "current-item"
                                      : ""
                                  }`}
                                  key={i2}
                                >
                                  <Link
                                    href={link.href}
                                    className="item-menu-mobile"
                                  >
                                    {link.href === "/about-us" ? tNav("aboutUs") :
                                     link.href === "/vision" ? tNav("ourVision") :
                                     link.href === "/career" ? tNav("career") :
                                     link.href === "/faq" ? tNav("faq") :
                                     link.href === "/blog-grid" ? tNav("blog") :
                                     link.href === "/property-rental-service" ? tNav("rentalService") :
                                     link.href === "/future-buyer-interest" ? tNav("futureInterestBuyer") :
                                     link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      ) : (
                        <li
                          className={`menu-item ${
                            links.href?.split("/")[1] == pathname.split("/")[1]
                              ? "current-item"
                              : ""
                          }`}
                        >
                          <Link 
                            href={links.href}
                          >
                            {links.href === "/about-us" ? tNav("aboutUs") :
                             links.href === "/vision" ? tNav("ourVision") :
                             links.href === "/career" ? tNav("career") :
                             links.href === "/faq" ? tNav("faq") :
                             links.href === "/blog-grid" ? tNav("blog") :
                             links.href === "/property-rental-service" ? tNav("rentalService") :
                             links.href === "/future-buyer-interest" ? tNav("futureInterestBuyer") :
                             links.label}
                          </Link>
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            </li>
            <li
              className={`menu-item ${
                pathname?.split("/")[1] === "agents" ? "current-menu-item" : ""
              }`}
            >
              <Link
                href="/agents"
                className="item-menu-mobile"
                onClick={() => {
                  const offcanvas = document.getElementById('menu-mobile');
                  if (offcanvas) {
                    const closeButton = offcanvas.querySelector('[data-bs-dismiss="offcanvas"]');
                    if (closeButton) {
                      closeButton.click();
                    }
                  }
                }}
              >
                {t("agents")}
              </Link>
            </li>
            <li
              className={`menu-item ${
                pathname?.split("/")[1] === "future-buyer-interest" ? "current-menu-item" : ""
              }`}
            >
              <Link
                href="/future-buyer-interest"
                className="item-menu-mobile"
                onClick={() => {
                  const offcanvas = document.getElementById('menu-mobile');
                  if (offcanvas) {
                    const closeButton = offcanvas.querySelector('[data-bs-dismiss="offcanvas"]');
                    if (closeButton) {
                      closeButton.click();
                    }
                  }
                }}
              >
                {tNav("futureInterestBuyer")}
              </Link>
            </li>
            <li
              className={`menu-item  ${
                isParentActive(blogMenu) ? "current-menu-item" : ""
              } `}
            >
              <Link
                href="/blog-grid"
                className="item-menu-mobile"
                onClick={() => {
                  const offcanvas = document.getElementById('menu-mobile');
                  if (offcanvas) {
                    const closeButton = offcanvas.querySelector('[data-bs-dismiss="offcanvas"]');
                    if (closeButton) {
                      closeButton.click();
                    }
                  }
                }}
              >
                {t("blogs")}
              </Link>
            </li>
            <li
              className={`menu-item ${
                "/contact" == pathname ? "current-item" : ""
              }`}
            >
              <Link href={`/contact`} className="tem-menu-mobile">
                {" "}
                {t("contact")}
              </Link>
            </li>
          </ul>
          <div className="support">
            <Link href="/contact" className="text-need">
              {" "}
              {t("needHelp")}
            </Link>
            <ul className="mb-info">
              <li>
                {t("callUsNow")} <span className="number">+963 995278383</span>
              </li>
              <li>
                {t("support247")} <a href="mailto:support@aqaargate.com">support@aqaargate.com</a>
              </li>
              <li>
                <div className="wrap-social">
                  <p>{t("followUs")}</p>
                  <ul className="tf-social style-2">
                    <li>
                      <a href="https://www.facebook.com/profile.php?id=61585950591929" target="_blank" rel="noopener noreferrer">
                        <i className="icon-fb" />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.twitter.com/aqaargate" target="_blank" rel="noopener noreferrer">
                        <i className="icon-X" />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/company/aqaargate" target="_blank" rel="noopener noreferrer">
                        <i className="icon-linked" />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/aqaar_gate?igsh=cG41aDg2YTlyeXo2" target="_blank" rel="noopener noreferrer">
                        <i className="icon-ins" />
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
