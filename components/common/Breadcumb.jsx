"use client";
import React from "react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function Breadcumb({ pageName = "Property Listing" }) {
  const t = useTranslations('breadcrumb');
  
  // Map page names to translation keys (case-insensitive)
  const getTranslatedPageName = (name) => {
    const normalizedName = name?.toLowerCase().trim();
    
    if (normalizedName === "properties listings") {
      return t('propertyGridFullWidth');
    } else if (normalizedName === "property listing") {
      return t('propertyListing');
    } else if (normalizedName === "property details") {
      return t('propertyDetails');
    } else if (normalizedName === "property rental service") {
      return t('propertyRentalService');
    } else if (normalizedName === "agents details") {
      return t('agentsDetails');
    }
    return name; // Fallback to original if no translation found
  };

  return (
    <section className="flat-title">
      <div className="tf-container">
        <div className="row">
          <div className="col-lg-12">
            <div className="title-inner">
              <ul className="breadcrumb">
                <li>
                  <Link className="home fw-6 text-color-3" href={`/`}>
                    {t('home')}
                  </Link>
                </li>
                <li>{getTranslatedPageName(pageName)}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
