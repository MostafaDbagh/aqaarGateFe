"use client";
import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import AdminProperties from "./AdminProperties";
import AdminPropertiesByAdmin from "./AdminPropertiesByAdmin";
import AdminAddProperty from "./AdminAddProperty";
import AdminSoldProperties from "./AdminSoldProperties";
import AdminDeletedProperties from "./AdminDeletedProperties";
import AdminAgents from "./AdminAgents";
import AdminUsers from "./AdminUsers";
import AdminRentalServices from "./AdminRentalServices";
import AdminContacts from "./AdminContacts";
import AdminReviews from "./AdminReviews";
import AdminMessages from "./AdminMessages";
import AdminCreateAdmin from "./AdminCreateAdmin";

export const TABS = {
  OVERVIEW: 'overview',
  PROFILE: 'profile',
  PROPERTIES: 'properties',
  PROPERTIES_BY_ADMIN: 'properties-by-admin',
  ADD_PROPERTY: 'add-property',
  SOLD_PROPERTIES: 'sold-properties',
  DELETED_PROPERTIES: 'deleted-properties',
  AGENTS: 'agents',
  USERS: 'users',
  RENTAL_SERVICES: 'rental-services',
  CONTACTS: 'contacts',
  REVIEWS: 'reviews',
  MESSAGES: 'messages',
  CREATE_ADMIN: 'create-admin'
};

export const AdminTabContext = createContext(null);

export const useAdminTab = () => {
  const context = useContext(AdminTabContext);
  return context; // Returns null if not in context, instead of throwing
};

export default function AdminDashboardMain() {
  const pathname = usePathname();
  const context = useAdminTab();
  const lastPathnameRef = useRef(null);

  // Initialize active tab from URL pathname only on mount or when pathname actually changes
  useEffect(() => {
    // Skip if pathname hasn't actually changed
    if (lastPathnameRef.current === pathname) {
      return;
    }

    if (pathname && context) {
      let tabToSet = TABS.OVERVIEW;
      // Check for both /admin/... and /en/admin/... paths
      const normalizedPath = pathname.replace(/^\/(en|ar)/, '');
      if (normalizedPath.includes('/admin/properties-by-admin')) {
        tabToSet = TABS.PROPERTIES_BY_ADMIN;
      } else if (normalizedPath.includes('/admin/properties')) {
        tabToSet = TABS.PROPERTIES;
      } else if (normalizedPath.includes('/admin/add-property')) {
        tabToSet = TABS.ADD_PROPERTY;
      } else if (normalizedPath.includes('/admin/sold-properties')) {
        tabToSet = TABS.SOLD_PROPERTIES;
      } else if (normalizedPath.includes('/admin/deleted-properties')) {
        tabToSet = TABS.DELETED_PROPERTIES;
      } else if (normalizedPath.includes('/admin/agents')) {
        tabToSet = TABS.AGENTS;
      } else if (normalizedPath.includes('/admin/users')) {
        tabToSet = TABS.USERS;
      } else if (normalizedPath.includes('/admin/rental-services')) {
        tabToSet = TABS.RENTAL_SERVICES;
      } else if (normalizedPath.includes('/admin/contacts')) {
        tabToSet = TABS.CONTACTS;
      } else if (normalizedPath.includes('/admin/reviews')) {
        tabToSet = TABS.REVIEWS;
      } else if (normalizedPath.includes('/admin/messages')) {
        tabToSet = TABS.MESSAGES;
      } else if (normalizedPath.includes('/admin/create-admin')) {
        tabToSet = TABS.CREATE_ADMIN;
      } else if (normalizedPath.includes('/admin/overview')) {
        tabToSet = TABS.OVERVIEW;
      }
      // Only set if different from current to avoid unnecessary updates
      if (context.activeTab !== tabToSet) {
        context.setActiveTab(tabToSet);
      }
      lastPathnameRef.current = pathname;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // Update when pathname changes (e.g., from direct navigation)

  // Use context activeTab, fallback to OVERVIEW if not available
  const activeTab = context?.activeTab || TABS.OVERVIEW;

  const renderContent = () => {
    switch (activeTab) {
      case TABS.OVERVIEW:
        return <AdminDashboard />;
      case TABS.PROPERTIES:
        return <AdminProperties />;
      case TABS.PROPERTIES_BY_ADMIN:
        return <AdminPropertiesByAdmin />;
      case TABS.ADD_PROPERTY:
        return <AdminAddProperty />;
      case TABS.SOLD_PROPERTIES:
        return <AdminSoldProperties />;
      case TABS.DELETED_PROPERTIES:
        return <AdminDeletedProperties />;
      case TABS.AGENTS:
        return <AdminAgents />;
      case TABS.USERS:
        return <AdminUsers />;
      case TABS.RENTAL_SERVICES:
        return <AdminRentalServices />;
      case TABS.CONTACTS:
        return <AdminContacts />;
      case TABS.REVIEWS:
        return <AdminReviews />;
      case TABS.MESSAGES:
        return <AdminMessages />;
      case TABS.CREATE_ADMIN:
        return <AdminCreateAdmin />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
}

