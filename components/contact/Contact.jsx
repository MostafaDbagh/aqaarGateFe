"use client";
import React from "react";
import { useTranslations } from 'next-intl';
import DropdownSelect from "../common/DropdownSelect";

export default function Contact() {
  const t = useTranslations('contact');
  
  return (
    <>
      <style jsx>{`
        .contact-image-section {
          position: relative;
          min-height: 500px;
        }
        
        .contact-background-image {
          background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/images/cities/c1.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          width: 100%;
          height: 710px;
          position: relative;
        }
        
        .contact-background-image::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
          z-index: 1;
        }
        
        .image-wrap {
          background-image: url('/images/cities/c2.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        @media (max-width: 768px) {
          .contact-image-section {
            min-height: 300px;
          }
          
          .contact-background-image {
            min-height: 300px;
          }
        }
      `}</style>
    <section className="section-top-map style-2">
      <div className="wrap-map">
        <div className="row-height contact-image-section">
          <div className="contact-background-image"></div>
        </div>
      </div>
      <div className="box">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <form
                id="contactform"
                onSubmit={(e) => e.preventDefault()}
                className="form-contact"
              >
                <div className="heading-section">
                  <h2 className="title">{t('title')}</h2>
                  <p className="text-1">
                    {t('subtitle')}
                  </p>
                </div>
                <div className="cols">
                  <fieldset>
                    <label htmlFor="name">{t('name')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t('namePlaceholder')}
                      name="name"
                      id="name"
                      required
                    />
                  </fieldset>
                  <fieldset>
                    <label htmlFor="email">{t('email')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t('emailPlaceholder')}
                      name="email"
                      id="email-contact"
                      required
                    />
                  </fieldset>
                </div>
                <div className="cols">
                  <fieldset className="phone">
                    <label htmlFor="phone">{t('phoneNumber')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t('phonePlaceholder')}
                      name="phone"
                      id="phone"
                      required
                    />
                  </fieldset>
                  <div className="select">
                    <label className="text-1 fw-6 mb-12">
                      {t('interestedIn')}
                    </label>

                    <DropdownSelect
                      options={[t('selectOption'), t('location'), t('rent'), t('sale')]}
                      addtionalParentClass=""
                    />
                  </div>
                </div>
                <fieldset>
                  <label htmlFor="message">{t('yourMessage')}</label>
                  <textarea
                    name="message"
                    cols={30}
                    rows={10}
                    placeholder={t('messagePlaceholder')}
                    id="message"
                    required
                    defaultValue={""}
                  />
                </fieldset>
                <div className="send-wrap">
                  <button
                    className="tf-btn bg-color-primary fw-7 pd-8"
                    type="submit"
                  >
                    {t('contactExperts')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
