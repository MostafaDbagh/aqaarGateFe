"use client";
import React from "react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function Breadcumb({ pageName = "Property Listing" }) {
  const t = useTranslations('breadcrumb');
  
  // Map page names to translation keys
  const getTranslatedPageName = (name) => {
    if (name === "Property Grid Full Width") {
      return t('propertyGridFullWidth');
    } else if (name === "Property Listing") {
      return t('propertyListing');
    } else if (name === "Property Details") {
      return t('propertyDetails');
    } else if (name === "Property Rental Service") {
      return t('propertyRentalService');
    } else if (name === "Agents Details") {
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
