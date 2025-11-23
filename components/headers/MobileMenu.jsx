"use client";
import { blogMenu, homes, otherPages, propertyLinks } from "@/constants/menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function MobileMenu() {
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
  return (
    <div
      className="offcanvas offcanvas-start mobile-nav-wrap"
      tabIndex={-1}
      id="menu-mobile"
      aria-labelledby="menu-mobile"
    >
      <div className="offcanvas-header top-nav-mobile">
        <div className="offcanvas-title">
          <Link href={`/`}>
            <Image
              alt="Mobile menu icon"
              src="/images/logo/logo@2x.png"
              width={272}
              height={84}
            />
          </Link>
        </div>
        <div data-bs-dismiss="offcanvas" aria-label="Close">
          <i className="icon-close" />
        </div>
      </div>
      <div className="offcanvas-body inner-mobile-nav">
        <div className="mb-body">
          <ul id="menu-mobile-menu">
            <li
              className={`menu-item  ${
                homes.some((elm) => elm.href == pathname)
                  ? "current-menu-item"
                  : ""
              } `}
            >
              <Link
                href="/"
                className="item-menu-mobile"
                onClick={() => {
                  const offcanvas = document.getElementById('menu-mobile');
                  if (offcanvas) {
                    const closeButton = offcanvas.querySelector('[data-bs-dismiss="offcanvas"]');
                    if (closeButton) {
                      closeButton.click();
                    }
                  }
                }}
              >
                Home
              </Link>
            </li>
            <li
              className={`menu-item   ${
                isParentActive(propertyLinks) ? "current-menu-item" : ""
              } `}
            >
              <Link
                href="/property-list"
                className="item-menu-mobile"
                onClick={() => {
                  const offcanvas = document.getElementById('menu-mobile');
                  if (offcanvas) {
                    const closeButton = offcanvas.querySelector('[data-bs-dismiss="offcanvas"]');
                    if (closeButton) {
                      closeButton.click();
                    }
                  }
                }}
              >
                Listing
              </Link>
            </li>
            <li
              className={`menu-item menu-item-has-children-mobile   ${
                isParentActive(otherPages) ? "current-menu-item" : ""
              } `}
            >
              <a
                href="#dropdown-menu-four"
                className="item-menu-mobile collapsed"
                data-bs-toggle="collapse"
                aria-expanded="true"
                aria-controls="dropdown-menu-four"
              >
                Pages
              </a>
              <div
                id="dropdown-menu-four"
                className="collapse"
                data-bs-parent="#menu-mobile-menu"
              >
                <ul className="sub-mobile">
                  {otherPages.map((links, i) => (
                    <React.Fragment key={i}>
                      {links.submenu ? (
                        <li
                          className={`menu-item menu-item-has-children-mobile-2   ${
                            isParentActive(links.submenu || [])
                              ? "current-menu-item"
                              : ""
                          }   `}
                        >
                          <a
                            href="#sub-agents"
                            className="item-menu-mobile collapsed"
                            data-bs-toggle="collapse"
                            aria-expanded="true"
                            aria-controls="sub-agents"
                          >
                            {links.title}
                          </a>
                          <div
                            id="sub-agents"
                            className="collapse"
                            data-bs-parent="#dropdown-menu-four"
                          >
                            <ul className="sub-mobile">
                              {links.submenu.map((link, i2) => (
                                <li
                                  className={`menu-item ${
                                    link.href?.split("/")[1] ==
                                    pathname.split("/")[1]
                                      ? "current-item"
                                      : ""
                                  }`}
                                  key={i2}
                                >
                                  <Link
                                    href={link.href}
                                    className="item-menu-mobile"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      ) : (
                        <li
                          className={`menu-item ${
                            links.href?.split("/")[1] == pathname.split("/")[1]
                              ? "current-item"
                              : ""
                          }`}
                        >
                          <Link href={links.href}>{links.label}</Link>
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            </li>
            <li
              className={`menu-item ${
                pathname?.split("/")[1] === "agents" ? "current-menu-item" : ""
              }`}
            >
              <Link
                href="/agents"
                className="item-menu-mobile"
                onClick={() => {
                  const offcanvas = document.getElementById('menu-mobile');
                  if (offcanvas) {
                    const closeButton = offcanvas.querySelector('[data-bs-dismiss="offcanvas"]');
                    if (closeButton) {
                      closeButton.click();
                    }
                  }
                }}
              >
                Agents
              </Link>
            </li>
            <li
              className={`menu-item ${
                pathname?.split("/")[1] === "property-rental-service" ? "current-menu-item" : ""
              }`}
            >
              <Link
                href="/property-rental-service"
                className="item-menu-mobile"
                onClick={() => {
                  const offcanvas = document.getElementById('menu-mobile');
                  if (offcanvas) {
                    const closeButton = offcanvas.querySelector('[data-bs-dismiss="offcanvas"]');
                    if (closeButton) {
                      closeButton.click();
                    }
                  }
                }}
              >
                Rental Service
              </Link>
            </li>
            <li
              className={`menu-item  ${
                isParentActive(blogMenu) ? "current-menu-item" : ""
              } `}
            >
              <Link
                href="/blog-grid"
                className="item-menu-mobile"
                onClick={() => {
                  const offcanvas = document.getElementById('menu-mobile');
                  if (offcanvas) {
                    const closeButton = offcanvas.querySelector('[data-bs-dismiss="offcanvas"]');
                    if (closeButton) {
                      closeButton.click();
                    }
                  }
                }}
              >
                Blogs
              </Link>
            </li>
            <li
              className={`menu-item ${
                "/contact" == pathname ? "current-item" : ""
              }`}
            >
              <Link href={`/contact`} className="tem-menu-mobile">
                {" "}
                Contact
              </Link>
            </li>
          </ul>
          <div className="support">
            <Link href="/contact" className="text-need">
              {" "}
              Need help?
            </Link>
            <ul className="mb-info">
              <li>
                Call Us Now: <span className="number">+971 50 666 6666</span>
              </li>
              <li>
                Support 24/7: <a href="mailto:support@aqaargate.com">support@aqaargate.com</a>
              </li>
              <li>
                <div className="wrap-social">
                  <p>Follow us:</p>
                  <ul className="tf-social style-2">
                    <li>
                      <a href="https://www.facebook.com/aqaargate" target="_blank" rel="noopener noreferrer">
                        <i className="icon-fb" />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.twitter.com/aqaargate" target="_blank" rel="noopener noreferrer">
                        <i className="icon-X" />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/company/aqaargate" target="_blank" rel="noopener noreferrer">
                        <i className="icon-linked" />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/aqaargate" target="_blank" rel="noopener noreferrer">
                        <i className="icon-ins" />
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
