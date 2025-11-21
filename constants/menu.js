/**
 * Navigation Menu Structure for AqaarGate
 * 
 * This file contains all navigation menu items organized by category.
 * All URLs should point to existing pages in the application.
 */

// Home page
export const homes = [
  { href: "/", label: "Home Page", isCurrent: true },
];

// Property-related pages
export const propertyLinks = [
  {
    href: "/property-list",
    label: "Property List"
  }
];

// Other public pages
export const otherPages = [
  { href: "/about-us", label: "About Us" },
  { href: "/vision", label: "Our Vision" },
  { href: "/career", label: "Career" },
  { href: "/faq", label: "FAQ's" },
  { href: "/blog-grid", label: "Blog" },
];

// Blog menu (for blog-specific navigation)
export const blogMenu = [
  { href: "/blog-grid", label: "Blog Grid" },
];

/**
 * Complete URL Structure Reference:
 * 
 * PUBLIC PAGES:
 * - / (Homepage)
 * - /property-list (Property listings)
 * - /property-detail/[id] (Property detail page)
 * - /agents (Agents listing)
 * - /agents-details/[id] (Agent detail page)
 * - /contact (Contact page)
 * - /about-us (About Us)
 * - /vision (Our Vision)
 * - /career (Career page)
 * - /faq (FAQ page)
 * - /blog-grid (Blog listing)
 * - /property-rental-service (Rental services)
 * - /terms-and-conditions (Terms and Conditions)
 * - /privacy-policy (Privacy Policy)
 * 
 * DASHBOARD PAGES (Require authentication):
 * - /dashboard (Dashboard overview)
 * - /add-property (Add new property)
 * - /my-favorites (User favorites)
 * - /my-property (User properties)
 * - /messages (User messages)
 * - /my-profile (User profile)
 * - /my-package (User package)
 * - /review (User reviews)
 * 
 * ADMIN PAGES (Require admin role):
 * - /admin/overview (Admin dashboard)
 * - /admin/properties (Admin properties management)
 * - /admin/add-property (Admin add property)
 * - /admin/agents (Admin agents management)
 * - /admin/contacts (Admin contacts)
 * - /admin/rental-services (Admin rental services)
 * - /admin/messages (Admin messages)
 * - /admin/reviews (Admin reviews)
 * - /admin/deleted-properties (Deleted properties)
 * - /admin/sold-properties (Sold properties)
 */
