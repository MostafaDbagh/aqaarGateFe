"use client";
import { homes, otherPages, propertyLinks } from "@/constants/menu";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from 'next-intl';
import { useAuthState } from "@/store/hooks/useAuth";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import React, { useState, useEffect } from "react";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('navigation');
  const isRTL = locale === 'ar';
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
  
  // Remove locale prefix from pathname for comparison
  const pathWithoutLocale = pathname?.replace(/^\/(en|ar)/, '') || pathname || '';
  const normalizedPath = pathWithoutLocale === '/' ? '/' : pathWithoutLocale.replace(/\/$/, '');
  
  // Check if home page is active - should be active for /, /en, /ar, /en/, /ar/
  const isHomeActive = normalizedPath === '/' || normalizedPath === '' || 
                       pathname === '/' || pathname === '/en' || pathname === '/ar' ||
                       pathname === '/en/' || pathname === '/ar/';
  
  // Check if property-list page is active
  const isPropertyListActive = normalizedPath === '/property-list' || normalizedPath?.startsWith('/property-list/') || 
                               normalizedPath?.startsWith('/property-detail/') || normalizedPath?.startsWith('/property-rental-service');
  
  const isParentActive = (menus) =>
    menus.some((menu) => {
      const menuPath = menu.href?.replace(/^\/(en|ar)/, '') || menu.href || '';
      const normalizedMenuPath = menuPath === '/' ? '/' : menuPath.replace(/\/$/, '');
      
      if (menu.submenu) {
        return menu.submenu.some((item) => {
          if (item.submenu) {
            return item.submenu.some((subItem) => {
              const subItemPath = subItem.href?.replace(/^\/(en|ar)/, '') || subItem.href || '';
              const normalizedSubItemPath = subItemPath === '/' ? '/' : subItemPath.replace(/\/$/, '');
              return normalizedSubItemPath === normalizedPath || normalizedPath?.startsWith(normalizedSubItemPath + '/');
            });
          }
          const itemPath = item.href?.replace(/^\/(en|ar)/, '') || item.href || '';
          const normalizedItemPath = itemPath === '/' ? '/' : itemPath.replace(/\/$/, '');
          return normalizedItemPath === normalizedPath || normalizedPath?.startsWith(normalizedItemPath + '/');
        });
      }
      return normalizedMenuPath === normalizedPath || normalizedPath?.startsWith(normalizedMenuPath + '/');
    });
  
  // Define navigation items in order
  const navItems = [
    {
      id: 'home',
      element: (
        <li key="home" style={{ padding: '12px 8px' }}
          className={`${
            isHomeActive ? "current-menu" : ""
          }`}
        >
          <a href="/">{t('home')}</a>
        </li>
      )
    },
    {
      id: 'listing',
      element: (
        <li key="listing"
          className={` style-2 ${
            isPropertyListActive ? "current-menu" : ""
          } `}
        >
          <a href="/property-list">{t('listing')}</a>
        </li>
      )
    },
    {
      id: 'pages',
      element: (
        <li key="pages"
          className={`has-child  ${
            isParentActive(otherPages) ? "current-menu" : ""
          } `}
        >
          <a href="#">{t('pages')}</a>
          <ul className="submenu">
            {otherPages
              .filter(menu => {
                // Hide "Future Interest Buyer" for guests and agents
                if (menu.href === '/future-buyer-interest') {
                  if (!isLoggedIn || userRole === 'guest' || userRole === 'agent') {
                    return false;
                  }
                }
                return true;
              })
              .map((menu, index) => (
              <li
                key={index}
                className={`${menu.className || ""}  ${
                  isParentActive(menu.submenu || []) ? "current-item" : ""
                }   ${
                  menu.href?.split("/")[1] == pathname.split("/")[1]
                    ? "current-item"
                    : ""
                } `}
              >
                {menu.submenu ? (
                  <>
                    <a href="#">{menu.title === "About Us" ? t('aboutUs') : menu.title === "Our Vision" ? t('ourVision') : menu.title === "Career" ? t('career') : menu.title === "FAQ's" ? t('faq') : menu.title === "Blog" ? t('blog') : menu.title === "Rental Service" ? t('rentalService') : menu.title === "Future Interest Buyer" ? t('futureInterestBuyer') : menu.title}</a>
                    <ul className="submenu">
                      {menu.submenu.map((item, subIndex) => (
                        <li
                          key={subIndex}
                          className={
                            item.href?.split("/")[1] == pathname.split("/")[1]
                              ? "current-item"
                              : ""
                          }
                        >
                          <Link href={item.href}>{item.label === "About Us" ? t('aboutUs') : item.label === "Our Vision" ? t('ourVision') : item.label === "Career" ? t('career') : item.label === "FAQ's" ? t('faq') : item.label === "Blog" ? t('blog') : item.label === "Rental Service" ? t('rentalService') : item.label === "Future Interest Buyer" ? t('futureInterestBuyer') : item.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link 
                    href={menu.href}
                    onClick={(e) => {
                      // Ensure navigation happens
                      e.stopPropagation();
                    }}
                    style={{ display: 'block', width: '100%' }}
                  >
                    {menu.label === "About Us" ? t('aboutUs') : menu.label === "Our Vision" ? t('ourVision') : menu.label === "Career" ? t('career') : menu.label === "FAQ's" ? t('faq') : menu.label === "Blog" ? t('blog') : menu.label === "Rental Service" ? t('rentalService') : menu.label === "Future Interest Buyer" ? t('futureInterestBuyer') : menu.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </li>
      )
    },
    {
      id: 'agents',
      element: (
        <li key="agents"
          className={` ${
            normalizedPath === '/agents' || normalizedPath?.startsWith('/agents/') || normalizedPath?.startsWith('/agents-details/') ? "current-menu" : ""
          } `}
        >
          <Link href="/agents">{t('agents')}</Link>
        </li>
      )
    },
    {
      id: 'futureBuyers',
      element: (
        <li 
          key="futureBuyers"
          className={`${normalizedPath === '/future-buyer-interest' || normalizedPath?.startsWith('/future-buyer-interest/') ? "current-menu" : ""}`}
        >
          <Link href="/future-buyer-interest">{t('futureInterestBuyer')}</Link>
        </li>
      )
    },
    {
      id: 'contact',
      element: (
        <li key="contact" className={normalizedPath === '/contact' || normalizedPath?.startsWith('/contact/') ? "current-menu" : ""}>
          <Link href={`/contact`}>{t('contact')}</Link>
        </li>
      )
    }
  ];
  
  // Reverse order for Arabic (RTL reading direction)
  // Header stays LTR but items are reversed for better UX in Arabic
  const orderedNavItems = isRTL ? [...navItems].reverse() : navItems;
  
  return (
    <>
      {orderedNavItems
        .filter(item => item.element !== null)
        .map(item => item.element)}
    </>
  );
}
