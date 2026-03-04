"use client";

import React, { useMemo } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Properties from "@/components/homes/home-1/Properties";
import { useSearchListings } from "@/apis/hooks";
import LocationLoader from "@/components/common/LocationLoader";
import styles from "./VipPageClient.module.css";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aqaargate.com";

export default function VipPageClient() {
  const t = useTranslations("vipPage");
  const tBreadcrumb = useTranslations("breadcrumb");
  const locale = useLocale();

  const webPageSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: locale === "ar" ? "عقارات VIP - عقار غيت" : "VIP Properties - AqaarGate",
      description:
        locale === "ar"
          ? "عقارات VIP مختارة لصنّاع القرار. نقدّر وقتك."
          : "Curated VIP property listings for busy professionals. We value your time. Syria & Lattakia real estate.",
      url: `${baseUrl}/${locale}/vip`,
      inLanguage: locale === "ar" ? "ar" : "en",
      isPartOf: { "@id": `${baseUrl}/#organization` },
      about: {
        "@type": "Thing",
        name: locale === "ar" ? "عقارات مميزة للبيع والإيجار" : "VIP real estate listings",
      },
    }),
    [locale]
  );

  const { data, isLoading, isError } = useSearchListings({
    isVip: "true",
    limit: 24,
    sort: "newest",
    page: 1,
  });

  const listings = Array.isArray(data) ? data : data?.data ?? [];
  const hasListings = listings.length > 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <div id="wrapper" className={styles.wrapper}>
        <Header1 />
        <Breadcumb pageName={tBreadcrumb("vip")} />
        <div className="main-content">
          <section className={styles.hero} aria-label="VIP introduction">
            <div className={styles.heroOverlay} />
            <div className={`tf-container ${styles.heroContent}`}>
              <div className={styles.heroText}>
                <span className={styles.vipBadge}>{t("heroBadge")}</span>
                <h1 className={styles.heroTitle}>{t("heroTitle")}</h1>
                <p className={styles.heroSubtitle}>{t("heroSubtitle")}</p>
                <p className={styles.heroTagline}>{t("heroTagline")}</p>
              </div>
            </div>
          </section>

          <section className={styles.listingsSection} aria-labelledby="vip-listings-heading">
            <div className={`tf-container ${styles.listingsSectionInner}`}>
              <div className={styles.listingsTitleWrap}>
                <h2 id="vip-listings-heading" className={styles.listingsTitle}>{t("listingsTitle")}</h2>
                <p className={styles.listingsSubtitle}>{t("listingsSubtitle")}</p>
              </div>
              {isLoading ? (
                <div className={styles.loaderWrap}>
                  <LocationLoader size="medium" message="" />
                </div>
              ) : isError ? (
                <div className={styles.noListingsWrap}>
                  <span className={styles.noListingsIcon} aria-hidden>★</span>
                  <p className={styles.noListings}>{t("noListings")}</p>
                </div>
              ) : !hasListings ? (
                <div className={styles.noListingsWrap}>
                  <span className={styles.noListingsIcon} aria-hidden>★</span>
                  <p className={styles.noListings}>{t("noListings")}</p>
                </div>
              ) : (
                <div className={styles.vipGridWrap}>
                  <Properties listings={listings} isLoading={false} isError={false} />
                </div>
              )}
              {!isLoading && hasListings && (
                <div className={styles.viewAllWrap}>
                  <Link href="/property-list" className={styles.viewAllBtn}>
                    {t("viewAllProperties")}
                    <i className={`icon-arrow-right-2 ${styles.viewAllBtnIcon}`} aria-hidden />
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
        <Cta />
        <Footer1 />
      </div>
    </>
  );
}
