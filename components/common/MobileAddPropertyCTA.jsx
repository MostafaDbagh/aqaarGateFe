"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthState } from "@/store/hooks/useAuth";
import { getAddPropertyWhatsAppUrl } from "@/constants/contactWhatsApp";
import styles from "./MobileAddPropertyCTA.module.css";

/**
 * Floating Add Property CTA - mobile only, small green button.
 * Suggested placement: fixed bottom-left so it doesn't overlap BackToTop (bottom-right).
 * Hidden on dashboard/admin/add-property pages where the action is already prominent.
 */
export default function MobileAddPropertyCTA() {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const tCommon = useTranslations("common");
  const { isAgent, user } = useAuthState();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hide on dashboard, admin, add-property, and auth pages
  const pathWithoutLocale = pathname?.replace(/^\/(en|ar)/, "") || pathname || "";
  const isHiddenPage =
    pathWithoutLocale.includes("/dashboard") ||
    pathWithoutLocale.includes("/admin") ||
    pathWithoutLocale.includes("/add-property") ||
    pathWithoutLocale.includes("/my-profile") ||
    pathWithoutLocale.includes("/my-property") ||
    pathWithoutLocale.includes("/login") ||
    pathWithoutLocale.includes("/register");

  if (!isMobile || isHiddenPage) return null;

  const isAdmin = user?.role === "admin";

  return (
    <div className={styles.ctaWrap} aria-label={tCommon("addProperty")}>
      {isAgent || isAdmin ? (
        <Link href="/add-property" className={styles.ctaBtn}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="9" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {tCommon("addProperty")}
        </Link>
      ) : (
        <a
          href={getAddPropertyWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtn}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="9" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {tCommon("addProperty")}
        </a>
      )}
    </div>
  );
}
