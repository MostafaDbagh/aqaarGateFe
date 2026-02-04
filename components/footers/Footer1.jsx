"use client";
import React, { useEffect, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { footerData } from "@/constants/footerLinks";
import AppleStoreIcon from "@/components/icons/AppleStoreIcon";
import GooglePlayIcon from "@/components/icons/GooglePlayIcon";
import styles from "./Footer1.module.css";
function Footer1({ logo = "/images/logo/new-logo.png" }) {
  const t = useTranslations('footer');
  
  // Translate footer data
  const translatedFooterData = footerData.map(column => ({
    ...column,
    title: column.title === "About us" ? t('aboutUs') : 
           column.title === "Popular house" ? t('popularHouse') : 
           column.title === "Quick links" ? t('quickLinks') : 
           column.title,
    links: column.links.map(link => ({
      ...link,
      text: link.text === "Contact" ? t('links.contact') :
            link.text === "Our Vision" ? t('links.ourVision') :
            link.text === "About Us" ? t('links.aboutUs') :
            link.text === "Careers with realty" ? t('links.careers') :
            link.text === "Blogs" ? t('links.blogs') :
            link.text === "Agents" ? t('links.agents') :
            link.text === "# Holiday Homes" || link.text === "# Holiday Homes" ? t('links.holidayHomes') :
            link.text === "# Apartments" || link.text === "# Apartments" ? t('links.apartments') :
            link.text === "# Villas" || link.text === "# Villas" ? t('links.villas') :
            link.text === "# Offices" || link.text === "# Offices" ? t('links.offices') :
            link.text === "# Shops" || link.text === "# Shops" ? t('links.shops') :
            link.text === "# Lands" || link.text === "# Lands" ? t('links.lands') :
            link.text === "Terms of use" ? t('links.termsOfUse') :
            link.text === "Privacy policy" ? t('links.privacyPolicy') :
            link.text === "Rental service" ? t('links.rentalService') :
            link.text === "FAQs" ? t('links.faqs') :
            link.text
    }))
  }));
  const toggleOpen = useCallback((event) => {
    const parent = event.target.closest(".footer-col-block");
    const content = parent?.querySelector(".tf-collapse-content");

    if (!parent || !content) return;

    if (parent.classList.contains("open")) {
      parent.classList.remove("open");
      content.classList.remove("open");
      // Reset inline styles when closing
      if (window.innerWidth <= 767) {
        content.style.removeProperty("max-height");
        content.style.removeProperty("height");
        content.style.removeProperty("min-height");
        content.style.removeProperty("opacity");
        content.style.removeProperty("visibility");
        content.style.removeProperty("overflow");
        content.style.removeProperty("display");
      }
    } else {
      parent.classList.add("open");
      content.classList.add("open");
      // Force visibility on mobile with inline styles
      if (window.innerWidth <= 767) {
        content.style.setProperty("max-height", "2000px", "important");
        content.style.setProperty("height", "auto", "important");
        content.style.setProperty("min-height", "auto", "important");
        content.style.setProperty("opacity", "1", "important");
        content.style.setProperty("visibility", "visible", "important");
        content.style.setProperty("overflow", "visible", "important");
        content.style.setProperty("display", "block", "important");
      }
    }
  }, []);

  useEffect(() => {
    const headings = document.querySelectorAll(".title-mobile");

    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });

    // Clean up event listeners when the component unmounts
    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, [toggleOpen]);
    return (
      <footer id="footer" dir="ltr">
        <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="footer-top">
              <div className="footer-logo">
                <Link href={`/`}>
                  <Image
                    id="logo_footer"
                    alt="logo-footer"
                    src={logo}
                    width={138}
                    height={48}
                    loading="lazy"
                    priority={false}
                  />
                </Link>
              </div>
              <div className="wrap-contact-item">
                <div className="contact-item">
                  <div className="icons">
                    <i className="icon-phone-2" />
                  </div>
                  <div className="content">
                    <div className="title text-1">{t('callUs')}</div>
                    <h6>
                      <a href="#"> +963995278383</a>
                    </h6>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="icons">
                    <i className="icon-letter-2" />
                  </div>
                  <div className="content">
                    <div className="title text-1">{t('needLiveHelp')}</div>
                    <h6 className="fw-4">
                      <a href="mailto:contact@aqaargate.com">contact@aqaargate.com</a>
                    </h6>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="icons">
                    <img 
                      src="/icons/whatsapp.svg" 
                      alt="WhatsApp" 
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="content">
                    <div className="title text-1">{t('chatWhatsapp')}</div>
                    <h6 className="fw-4">
                      <a 
                        href={`https://wa.me/${'+971586057772'.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#f1913d', fontWeight: '600' }}
                      >
                        +971586057772
                      </a>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-main">
            <div className="row">
              {translatedFooterData.map((column, index) => (
                <div className="col-lg-3 col-md-6" key={index}>
                  <div
                    className={`footer-menu-list footer-col-block ${
                      column.className || ""
                    }`}
                  >
                    <h5 className="title lh-30 title-desktop">
                      {column.title}
                    </h5>
                    <h5 className="title lh-30 title-mobile">{column.title}</h5>
                    <ul className="tf-collapse-content">
                      {column.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          {link.href.startsWith("/") ? (
                            <Link href={link.href}>{link.text}</Link>
                          ) : (
                            <a href={link.href}>{link.text}</a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              <div className="col-lg-3 col-md-6">
                <div className="footer-menu-list">
                  <h5 className="title lh-30 mb-19">{t('downloadApp')}</h5>
                  <div className={styles.appStoreContainer}>
                    <div className={`hover-tooltip ${styles.appStoreIconWrapper}`}>
                      <a href="#" onClick={(e) => e.preventDefault()} className={styles.appStoreIconLink}>
                        <AppleStoreIcon width={150} height={50} className={styles.appStoreIcon} />
                      </a>
                      <span className="tooltip">{t('comingSoon')}</span>
                    </div>
                    <div className={`hover-tooltip ${styles.appStoreIconWrapper}`}>
                      <a href="#" onClick={(e) => e.preventDefault()} className={styles.appStoreIconLink}>
                        <GooglePlayIcon width={150} height={50} className={styles.appStoreIcon} />
                      </a>
                      <span className="tooltip">{t('comingSoon')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="footer-bottom">
            <p>
              {t('copyright')} {new Date().getFullYear()}{" "}
              <span className="fw-7">AqaarGate - REAL ESTATE</span> . {t('designedBy')}{" "}
              <a href="https://www.linkedin.com/in/mostafa-dbagh-528983180/" target="_blank" rel="noopener noreferrer" className={styles.developerName}>Mostafa Dbagh</a>
            </p>
            <div className="wrap-social">
              <div className="text-3  fw-6 text_white">{t('followUs')}</div>
              <ul className="tf-social ">
                <li>
                  <a href="https://www.facebook.com/profile.php?id=61585950591929" target="_blank" rel="noopener noreferrer">
                    <i className="icon-fb" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="icon-X" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="icon-linked" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/aqaar_gate?igsh=cG41aDg2YTlyeXo2" target="_blank" rel="noopener noreferrer">
                    <i className="icon-ins" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer1);
