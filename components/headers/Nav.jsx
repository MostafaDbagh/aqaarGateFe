"use client";
import { homes, otherPages, propertyLinks } from "@/constants/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import React from "react";

export default function Nav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('navigation');
  const isRTL = locale === 'ar';
  
  const isParentActive = (menus) =>
    menus.some((menu) =>
      menu.submenu
        ? menu.submenu.some((item) =>
            item.submenu
              ? item.submenu.some(
                  (item) => item.href.split("/")[1] === pathname.split("/")[1]
                )
              : item.href.split("/")[1] === pathname.split("/")[1]
          )
        : menu.href.split("/")[1] === pathname.split("/")[1]
    );
  
  // Define navigation items in order
  const navItems = [
    {
      id: 'home',
      element: (
        <li key="home" style={{ padding: '12px 8px' }}
          className={`${
            homes.some((elm) => elm.href == pathname) ? "current-menu" : ""
          }`}
        >
          <a href="/">{t('home')}</a>
        </li>
      )
    },
    {
      id: 'listing',
      element: (
        <li key="listing"
          className={` style-2 ${
            isParentActive(propertyLinks) ? "current-menu" : ""
          } `}
        >
          <a href="/property-list">{t('listing')}</a>
        </li>
      )
    },
    {
      id: 'pages',
      element: (
        <li key="pages"
          className={`has-child  ${
            isParentActive(otherPages) ? "current-menu" : ""
          } `}
        >
          <a href="#">{t('pages')}</a>
          <ul className="submenu">
            {otherPages.map((menu, index) => (
              <li
                key={index}
                className={`${menu.className || ""}  ${
                  isParentActive(menu.submenu || []) ? "current-item" : ""
                }   ${
                  menu.href?.split("/")[1] == pathname.split("/")[1]
                    ? "current-item"
                    : ""
                } `}
              >
                {menu.submenu ? (
                  <>
                    <a href="#">{menu.title === "About Us" ? t('aboutUs') : menu.title === "Our Vision" ? t('ourVision') : menu.title === "Career" ? t('career') : menu.title === "FAQ's" ? t('faq') : menu.title === "Blog" ? t('blog') : menu.title}</a>
                    <ul className="submenu">
                      {menu.submenu.map((item, subIndex) => (
                        <li
                          key={subIndex}
                          className={
                            item.href?.split("/")[1] == pathname.split("/")[1]
                              ? "current-item"
                              : ""
                          }
                        >
                          <Link href={item.href}>{item.label === "About Us" ? t('aboutUs') : item.label === "Our Vision" ? t('ourVision') : item.label === "Career" ? t('career') : item.label === "FAQ's" ? t('faq') : item.label === "Blog" ? t('blog') : item.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={menu.href}>{menu.label === "About Us" ? t('aboutUs') : menu.label === "Our Vision" ? t('ourVision') : menu.label === "Career" ? t('career') : menu.label === "FAQ's" ? t('faq') : menu.label === "Blog" ? t('blog') : menu.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </li>
      )
    },
    {
      id: 'agents',
      element: (
        <li key="agents"
          className={` ${
            pathname?.split("/")[1] === "agents" ? "current-menu" : ""
          } `}
        >
          <Link href="/agents">{t('agents')}</Link>
        </li>
      )
    },
    {
      id: 'rentalService',
      element: (
        <li key="rentalService"
          className={` ${
            pathname?.split("/")[1] === "property-rental-service" ? "current-menu" : ""
          } `}
        >
          <Link href="/property-rental-service">{t('rentalService')}</Link>
        </li>
      )
    },
    {
      id: 'contact',
      element: (
        <li key="contact" className={"/contact" == pathname ? "current-menu" : ""}>
          <Link href={`/contact`}>{t('contact')}</Link>
        </li>
      )
    }
  ];
  
  // Reverse order for Arabic (RTL reading direction)
  // Header stays LTR but items are reversed for better UX in Arabic
  const orderedNavItems = isRTL ? [...navItems].reverse() : navItems;
  
  return (
    <>
      {orderedNavItems.map(item => item.element)}
    </>
  );
}
