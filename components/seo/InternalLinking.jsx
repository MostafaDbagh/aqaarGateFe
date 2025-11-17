"use client";
import Link from "next/link";
import React from "react";

export default function InternalLinking({ currentPage = "home" }) {
  const internalLinks = [
    {
      title: "Syria Real Estate",
      href: "/property-list",
      description: "Browse all properties for sale and rent in Syria"
    },
    {
      title: "Holiday Homes Syria",
      href: "/property-list?propertyType=Holiday Home",
      description: "Find holiday homes and vacation rentals in Syria"
    },
    {
      title: "Properties for Sale",
      href: "/property-list?status=sale",
      description: "Browse properties for sale in Syria and Lattakia"
    },
    {
      title: "Properties for Rent",
      href: "/property-list?status=rent",
      description: "Find rental properties in Syria and Lattakia"
    },
    {
      title: "Lattakia Properties",
      href: "/property-list?city=Lattakia",
      description: "Explore properties in Lattakia, Syria"
    },
    {
      title: "Contact Us",
      href: "/contact",
      description: "Get in touch with our real estate experts"
    }
  ];

  // Don't render on dashboard pages
  if (currentPage.includes("dashboard") || currentPage.includes("add-property") || currentPage.includes("my-")) {
    return null;
  }

  return (
    <section className="section-internal-linking" style={{ padding: "40px 0", backgroundColor: "#f9fafb" }}>
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <h3 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "600", color: "#374151" }}>
              Explore More Properties in Syria
            </h3>
            <div className="internal-links-grid" style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
              gap: "20px" 
            }}>
              {internalLinks.map((link, index) => (
                <Link 
                  key={index}
                  href={link.href}
                  style={{
                    display: "block",
                    padding: "16px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <h4 style={{ 
                    marginBottom: "8px", 
                    fontSize: "18px", 
                    fontWeight: "600", 
                    color: "#f1913d" 
                  }}>
                    {link.title}
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    fontSize: "14px", 
                    color: "#6b7280",
                    lineHeight: "1.5"
                  }}>
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


