"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminSidebar.module.css";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { href: "/admin/overview", label: "Dashboard", icon: "icon-home" },
    { href: "/admin/properties", label: "Properties", icon: "icon-home" },
    { href: "/admin/agents", label: "Agents", icon: "icon-user" },
    { href: "/admin/rental-services", label: "Rental Services", icon: "icon-home" },
    { href: "/admin/contacts", label: "Contact Us", icon: "icon-mail" }
  ];

  const isActive = (href) => {
    if (href === "/admin/overview") {
      return pathname === "/admin/overview";
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      <div className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Admin Panel</h2>
          <button
            className={styles.mobileCloseBtn}
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          >
            <i className="icon-close" />
          </button>
        </div>
        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive(item.href) ? styles.active : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <i className={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div
        className={`${styles.mobileOverlay} ${isMobileOpen ? styles.overlayOpen : ""}`}
        onClick={() => setIsMobileOpen(false)}
      />
      <button
        className={styles.mobileToggle}
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
      >
        <i className="icon-menu" />
      </button>
    </>
  );
}

