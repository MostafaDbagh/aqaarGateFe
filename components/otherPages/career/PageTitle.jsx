"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';

export default function PageTitle() {
  const t = useTranslations('career.pageTitle');
  
  // State to track the active item
  const [activeItem, setActiveItem] = useState(t('forSale'));

  // Array of items to render
  const items = [t('forSale'), t('forRent')];
  return (
    <>
      <style jsx>{`
        .page-title.career {
          background-image: url('/images/j2.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          min-height: 100vh;
          position: relative;
        }
        
        .page-title.career .tf-container {
          position: relative;
          z-index: 2;
        }
        
        .page-title.career .title {
          color: #ffffff !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .page-title.career .h6 {
          color: #ffffff !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
      `}</style>
      
      <div className="page-title career">
      <div className="tf-container">
        <div className="row justify-center">
          <div className="col-lg-8">
            <div className="content-inner">
              <div className="heading-title">
                <h1 className="title">
                  {t('title')}
                </h1>
                <p className="h6 fw-4">
                  {t('subtitle')}
                </p>
              </div>
              <div className="wg-filter">
                <div className="form-title">
                  <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
                    <div className="btn-select">
                      <span className="text-sort-value">{activeItem}</span>
                      <i className="icon-CaretDown" />
                    </div>
                    <div className="dropdown-menu">
                      {items.map((item) => (
                        <div
                          key={item}
                          className={`select-item ${
                            activeItem === item ? "active" : ""
                          }`}
                          onClick={() => setActiveItem(item)} // Set the active item on click
                        >
                          <span className="text-value-item">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <form>
                    <fieldset>
                      <input type="text" placeholder={t('searchPlaceholder')} />
                    </fieldset>
                  </form>
                  <div className="wrap-btn">
                    <a href="#" className="tf-btn bg-color-primary fw-7 pd-3">
                      {t('searchButton')} <i className="icon-MagnifyingGlass fw-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
