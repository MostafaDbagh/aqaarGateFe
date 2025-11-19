"use client";
import React, { useState, createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import AdminProperties from "./AdminProperties";
import AdminAddProperty from "./AdminAddProperty";
import AdminSoldProperties from "./AdminSoldProperties";
import AdminDeletedProperties from "./AdminDeletedProperties";
import AdminAgents from "./AdminAgents";
import AdminRentalServices from "./AdminRentalServices";
import AdminContacts from "./AdminContacts";
import AdminReviews from "./AdminReviews";
import AdminMessages from "./AdminMessages";

export const TABS = {
  OVERVIEW: 'overview',
  PROFILE: 'profile',
  PROPERTIES: 'properties',
  ADD_PROPERTY: 'add-property',
  SOLD_PROPERTIES: 'sold-properties',
  DELETED_PROPERTIES: 'deleted-properties',
  AGENTS: 'agents',
  RENTAL_SERVICES: 'rental-services',
  CONTACTS: 'contacts',
  REVIEWS: 'reviews',
  MESSAGES: 'messages'
};

export const AdminTabContext = createContext(null);

export const useAdminTab = () => {
  const context = useContext(AdminTabContext);
  return context; // Returns null if not in context, instead of throwing
};

export default function AdminDashboardMain() {
  const pathname = usePathname();
  const context = useAdminTab();

  // Initialize active tab from URL pathname only on mount
  useEffect(() => {
    if (pathname && context) {
      let tabToSet = TABS.OVERVIEW;
      if (pathname.includes('/admin/properties')) {
        tabToSet = TABS.PROPERTIES;
      } else if (pathname.includes('/admin/add-property')) {
        tabToSet = TABS.ADD_PROPERTY;
      } else if (pathname.includes('/admin/sold-properties')) {
        tabToSet = TABS.SOLD_PROPERTIES;
      } else if (pathname.includes('/admin/deleted-properties')) {
        tabToSet = TABS.DELETED_PROPERTIES;
      } else if (pathname.includes('/admin/agents')) {
        tabToSet = TABS.AGENTS;
      } else if (pathname.includes('/admin/rental-services')) {
        tabToSet = TABS.RENTAL_SERVICES;
      } else if (pathname.includes('/admin/contacts')) {
        tabToSet = TABS.CONTACTS;
      } else if (pathname.includes('/admin/reviews')) {
        tabToSet = TABS.REVIEWS;
      } else if (pathname.includes('/admin/messages')) {
        tabToSet = TABS.MESSAGES;
      } else if (pathname.includes('/admin/overview')) {
        tabToSet = TABS.OVERVIEW;
      }
      // Only set if different from current to avoid unnecessary updates
      if (context.activeTab !== tabToSet) {
        context.setActiveTab(tabToSet);
      }
    }
  }, [pathname]); // Update when pathname changes (e.g., from direct navigation)

  // Use context activeTab, fallback to OVERVIEW if not available
  const activeTab = context?.activeTab || TABS.OVERVIEW;

  const renderContent = () => {
    switch (activeTab) {
      case TABS.OVERVIEW:
        return <AdminDashboard />;
      case TABS.PROPERTIES:
        return <AdminProperties />;
      case TABS.ADD_PROPERTY:
        return <AdminAddProperty />;
      case TABS.SOLD_PROPERTIES:
        return <AdminSoldProperties />;
      case TABS.DELETED_PROPERTIES:
        return <AdminDeletedProperties />;
      case TABS.AGENTS:
        return <AdminAgents />;
      case TABS.RENTAL_SERVICES:
        return <AdminRentalServices />;
      case TABS.CONTACTS:
        return <AdminContacts />;
      case TABS.REVIEWS:
        return <AdminReviews />;
      case TABS.MESSAGES:
        return <AdminMessages />;
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

