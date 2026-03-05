"use client";

import React, { useMemo } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Crown, Clock, Shield, Phone, Mail } from "lucide-react";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Properties from "@/components/homes/home-1/Properties";
import { useSearchListings } from "@/apis/hooks";
import LocationLoader from "@/components/common/LocationLoader";
import { useTranslations, useLocale } from "next-intl";
import styles from "./VipPageClient.module.css";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aqaargate.com";

export default function VipPageClient() {
  const t = useTranslations("vipPage");
  const tBreadcrumb = useTranslations("breadcrumb");
  const locale = useLocale();

  const { data, isLoading, isError } = useSearchListings({
    isVip: "true",
    limit: 12,
    sort: "newest",
    page: 1,
  });

  const listings = Array.isArray(data) ? data : data?.data ?? [];
  const hasListings = listings.length > 0;
  const showFeaturedSection = isLoading || hasListings;

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
            <div className={styles.heroImageWrap}>
              <Image
                src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920"
                alt="Luxury VIP real estate property"
                fill
                className={styles.heroImage}
                priority
              />
              <div className={styles.heroOverlay} />
            </div>
            <div className={styles.heroContent}>
              <div className={styles.heroInner}>
                <div className={styles.heroBadgeWrap}>
                  <Crown className={`${styles.heroBadgeIcon}`} size={48} />
                  <span className={styles.heroBadgeText}>{t("heroBadge")}</span>
                </div>
                <h1 className={styles.heroTitle}>
                  {t("heroTitle")}
                </h1>
                <p className={styles.heroSubtitle}>
                  {t("heroSubtitle")}
                </p>
                <Link href="/property-list" className={styles.heroCta}>
                  {t("heroCta")}
                </Link>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionInner}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>{t("whyTitle")}</h2>
                <p className={styles.sectionSubtitle}>
                  {t("whySubtitle")}
                </p>
              </div>
              <div className={styles.whyGrid}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIconWrap}>
                    <Clock className={styles.featureIcon} size={32} />
                  </div>
                  <h3 className={styles.featureTitle}>{t("whyTimeTitle")}</h3>
                  <p className={styles.featureText}>
                    {t("whyTimeDesc")}
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIconWrap}>
                    <Shield className={styles.featureIcon} size={32} />
                  </div>
                  <h3 className={styles.featureTitle}>{t("whatWeOffer")}</h3>
                  <ul className={styles.featureList}>
                    <li className={styles.featureListItem}>
                      <span className={styles.featureListCheck} aria-hidden>✓</span>
                      <span className={styles.featureListText}>{t("offerItem1")}</span>
                    </li>
                    <li className={styles.featureListItem}>
                      <span className={styles.featureListCheck} aria-hidden>✓</span>
                      <span className={styles.featureListText}>{t("offerItem2")}</span>
                    </li>
                    <li className={styles.featureListItem}>
                      <span className={styles.featureListCheck} aria-hidden>✓</span>
                      <span className={styles.featureListText}>{t("offerItem3")}</span>
                    </li>
                    <li className={styles.featureListItem}>
                      <span className={styles.featureListCheck} aria-hidden>✓</span>
                      <span className={styles.featureListText}>{t("offerItem4")}</span>
                    </li>
                  </ul>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIconWrap}>
                    <Crown className={styles.featureIcon} size={32} />
                  </div>
                  <h3 className={styles.featureTitle}>{t("whyPremiumTitle")}</h3>
                  <p className={styles.featureText}>
                    {t("whyPremiumDesc")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {showFeaturedSection && (
            <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="featured-vip-heading">
              <div className={styles.sectionInner}>
                <div className={styles.sectionHead}>
                  <h2 id="featured-vip-heading" className={styles.sectionTitle}>{t("listingsTitle")}</h2>
                  <p className={styles.sectionSubtitle}>
                    {t("listingsSubtitle")}
                  </p>
                </div>
                {isLoading ? (
                  <div className={styles.loaderWrap}>
                    <LocationLoader size="medium" message="" />
                  </div>
                ) : hasListings ? (
                  <div className={styles.vipGridWrap}>
                    <Properties listings={listings} isLoading={false} isError={false} showHeading={false} />
                  </div>
                ) : null}
              </div>
            </section>
          )}

          <section className={styles.ctaSection}>
            <div className={styles.ctaBox}>
              <Crown className={styles.ctaCrown} size={64} />
              <h2 className={styles.ctaTitle}>
                {t("ctaTitle")}
              </h2>
              <p className={styles.ctaText}>
                {t("ctaSubtitle")}
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/contact" className={styles.ctaBtnPrimary}>
                  <Phone className={styles.ctaBtnIcon} size={20} />
                  {t("ctaConsultation")}
                </Link>
                <Link href="/contact" className={styles.ctaBtnSecondary}>
                  <Mail className={styles.ctaBtnIcon} size={20} />
                  {t("ctaContact")}
                </Link>
              </div>
            </div>
          </section>

          <section className={styles.footerSeo}>
            <div className={styles.footerSeoInner}>
              <p className={styles.footerSeoText}>
                {t("seoFooter")}
              </p>
            </div>
          </section>
        </div>
        <Cta />
        <Footer1 />
      </div>
    </>
  );
}
