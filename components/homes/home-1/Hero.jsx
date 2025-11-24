"use client";
import SearchForm from "@/components/common/SearchForm";
import React, { useState } from "react";

export default function Hero({
  searchParams,
  onSearchChange,
  setTriggerSearch,
}) {
  const [activeItem, setActiveItem] = useState("For sale");

  const statusOptions = [
    { label: "For sale", value: "sale" },
    { label: "For rent", value: "rent" },
  ];
  const handleChange = (key, value) => {
    if (onSearchChange) {
      onSearchChange({ [key]: value });
    }
  };

  return (
    <>
      <style jsx>{`
        .hero-background {
          background-image: url('/images/cities/hero.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          min-height: 100vh;
          position: relative;
        }
        
        .hero-background .tf-container {
          position: relative;
          z-index: 2;
        }
        
        @media (max-width: 768px) {
          .hero-background .form-title {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            align-items: center;
            gap: 10px;
          }
          
          .hero-background .box-item.wrap-btn {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            align-items: center;
            gap: 8px;
            width: 100% !important;
            margin-top: 0 !important;
            flex-shrink: 0 !important;
          }
          
          .hero-background .box-item.wrap-btn .btn-filter {
            flex-shrink: 0 !important;
            width: 50px !important;
            min-width: 50px !important;
            max-width: 50px !important;
            height: 50px !important;
          }
          
          .hero-background .box-item.wrap-btn .tf-btn {
            flex: 1 !important;
            width: 100% !important;
            min-width: 0 !important;
            white-space: nowrap !important;
            height: 50px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-background .form-title {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            align-items: center;
            gap: 8px;
          }
          
          .hero-background .box-item.wrap-btn {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            align-items: center;
            gap: 6px;
            width: 100% !important;
            margin-top: 0 !important;
            flex-shrink: 0 !important;
          }
          
          .hero-background .box-item.wrap-btn .btn-filter {
            flex-shrink: 0 !important;
            width: 44px !important;
            min-width: 44px !important;
            max-width: 44px !important;
            height: 44px !important;
          }
          
          .hero-background .box-item.wrap-btn .tf-btn {
            flex: 1 !important;
            width: 100% !important;
            min-width: 0 !important;
            white-space: nowrap !important;
            height: 44px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
      `}</style>
      
      <div className="page-title home01 hero-background">
      <div className="tf-container ">
        <div className="row justify-center relative">
          <div className="col-lg-8 ">
            <div className="content-inner">
              <div className="heading-title">
                <h1 className="title">Search your Dream Homes</h1>
                <p className="h6 fw-4">
                  Alot of  homes enthusiasts just like you visit our
                  website.
                </p>
              </div>
              <div className="wg-filter">
                <div className="form-title">
                  <div className="tf-dropdown-sort " data-bs-toggle="dropdown">
                    <div className="btn-select">
                      <span className="text-sort-value">{activeItem}</span>
                      <i className="icon-CaretDown" />
                    </div>
                    <div className="dropdown-menu">
                      {statusOptions.map((item) => (
                        <div
                          key={item.value}
                          className={`select-item ${
                            activeItem === item.value ? "active" : ""
                          }`}
                          onClick={() => {
                            setActiveItem(item.label);
                            handleChange("status", item.value);
                          }}
                        >
                          <span className="text-value-item">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <form onSubmit={(e) => e.preventDefault()}>
                    <fieldset>
                      <input
                        type="text"
                        placeholder="Place, neighborhood, school or agent..."
                        onChange={(e) =>
                          onSearchChange({ keyword: e.target.value })
                        }
                      />
                    </fieldset>
                  </form>
                  <div className="box-item wrap-btn">
                    <div className="btn-filter show-form searchFormToggler">
                      <div className="icons">
                        <svg width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                         aria-hidden="true">
                          <path
                            d="M21 4H14"
                            stroke="#F1913D"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 4H3"
                            stroke="#F1913D"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 12H12"
                            stroke="#F1913D"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 12H3"
                            stroke="#F1913D"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 20H16"
                            stroke="#F1913D"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 20H3"
                            stroke="#F1913D"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 2V6"
                            stroke="#F1913D"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 10V14"
                            stroke="#F1913D"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16 18V22"
                            stroke="#F1913D"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="tf-btn bg-color-primary pd-3"
                      onClick={() => setTriggerSearch(true)}
                    >
                      Search <i className="icon-MagnifyingGlass fw-6" />
                    </a>
                  </div>
                </div>
                <SearchForm
                  searchParams={searchParams}
                  onSearchChange={onSearchChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
