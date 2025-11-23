"use client";
import { homes, otherPages, propertyLinks } from "@/constants/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback } from "react";

export default function Nav() {
  const pathname = usePathname();
  
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
  
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If already on the target page, do nothing
    if (pathname === href) {
      return;
    }
    
    // Use window.location.href for immediate, reliable navigation
    // This works on first click and bypasses all Next.js/Cloudflare issues
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
  }, [pathname]);
  
  return (
    <>
      <li 
        style={{ padding: '12px 8px' }}
        className={`${
          homes.some((elm) => elm.href == pathname) ? "current-menu" : ""
        }`}
      >
        <a 
          href="/"
          onClick={(e) => handleNavClick(e, '/')}
          style={{ display: 'block', width: '100%', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
        >
          Home
        </a>

      </li>
      <li
        className={` style-2 ${
          isParentActive(propertyLinks) ? "current-menu" : ""
        } `}
      >
        <a 
          href="/property-list"
          onClick={(e) => handleNavClick(e, '/property-list')}
          style={{ display: 'block', width: '100%', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
        >
          Listing
        </a>

      </li>
      <li
        className={`has-child  ${
          isParentActive(otherPages) ? "current-menu" : ""
        } `}
      >
        <a href="#" onClick={(e) => e.preventDefault()}>Pages</a>
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
                  <a href="#" onClick={(e) => e.preventDefault()}>{menu.title}</a>
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
                        <Link href={item.href}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link href={menu.href}>{menu.label}</Link>
              )}
            </li>
          ))}
        </ul>
      </li>
      <li
        className={` ${
          pathname?.split("/")[1] === "agents" ? "current-menu" : ""
        } `}
      >
        <a 
          href="/agents"
          onClick={(e) => handleNavClick(e, '/agents')}
          style={{ display: 'block', width: '100%', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
        >
          Agents
        </a>
      </li>
      <li
        className={` ${
          pathname?.split("/")[1] === "property-rental-service" ? "current-menu" : ""
        } `}
      >
        <a 
          href="/property-rental-service"
          onClick={(e) => handleNavClick(e, '/property-rental-service')}
          style={{ display: 'block', width: '100%', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
        >
          Rental Service
        </a>
      </li>
      <li 
        className={"/contact" == pathname ? "current-menu" : ""}
      >
        <a 
          href="/contact"
          onClick={(e) => handleNavClick(e, '/contact')}
          style={{ display: 'block', width: '100%', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
        >
          Contact
        </a>
      </li>
    </>
  );
}
