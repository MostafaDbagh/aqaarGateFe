"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslations } from 'next-intl';

export default function Faqs() {
  const t = useTranslations('faq');
  
  return (
    <section className="section-faq">
      <div className="tf-container">
        <div className="row">
          <div className="col-xl-8 col-lg-7">
            <div className="heading-section mb-48">
              <h2 className="title">{t('title')}</h2>
            </div>
            <div className="tf-faq mb-49">
              <h3 className="fw-8 title mb-24">{t('overview')}</h3>
              <ul className="box-faq" id="wrapper-faq">
                <li className="faq-item active">
                  <a
                    href="#accordion-faq-one"
                    className="faq-header h6"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion-faq-one"
                  >
                    {t('questions.whyChooseOurService.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion-faq-one"
                    className="collapse show"
                    data-bs-parent="#wrapper-faq"
                  >
                    <p className="faq-body">
                      {t('questions.whyChooseOurService.answer').split('\n\n').map((paragraph, idx, arr) => (
                        <React.Fragment key={idx}>
                          {paragraph}
                          {idx < arr.length - 1 && <><br /><br /></>}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion-faq-two"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion-faq-two"
                  >
                    {t('questions.howSecureAreYourServices.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion-faq-two"
                    className="collapse"
                    data-bs-parent="#wrapper-faq"
                  >
                    <p className="faq-body">
                      {t('questions.howSecureAreYourServices.answer')}
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion-faq-three"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion-faq-three"
                  >
                    {t('questions.customerSupportService.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion-faq-three"
                    className="collapse"
                    data-bs-parent="#wrapper-faq"
                  >
                    <p className="faq-body">
                      {t('questions.customerSupportService.answer')}
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion-faq-four"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion-faq-four"
                  >
                    {t('questions.howCanIUpdateMyAccountInformation.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion-faq-four"
                    className="collapse"
                    data-bs-parent="#wrapper-faq"
                  >
                    <p className="faq-body">
                      {t('questions.howCanIUpdateMyAccountInformation.answer').split('\n\n').map((paragraph, idx, arr) => (
                        <React.Fragment key={idx}>
                          {paragraph}
                          {idx < arr.length - 1 && <><br /><br /></>}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="tf-faq mb-49">
              <h3 className="fw-8 title mb-24">{t('costsAndPayments')}</h3>
              <ul className="box-faq" id="wrapper-faq-2">
                <li className="faq-item">
                  <a
                    href="#accordion2-faq-one"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion2-faq-one"
                  >
                    {t('questions.howDoYouCalculateFees.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion2-faq-one"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-2"
                  >
                    <p className="faq-body">
                      {t('questions.howDoYouCalculateFees.answer')}
                    </p>
                  </div>
                </li>
                <li className="faq-item active">
                  <a
                    href="#accordion2-faq-two"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion2-faq-two"
                  >
                    {t('questions.howDoIPayMyInvoices.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion2-faq-two"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-2"
                  >
                    <p className="faq-body">
                      {t('questions.howDoIPayMyInvoices.answer')}
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion2-faq-four"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion2-faq-four"
                  >
                    {t('questions.areThereAnyHiddenFees.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion2-faq-four"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-2"
                  >
                    <p className="faq-body">
                      {t('questions.areThereAnyHiddenFees.answer')}
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion2-faq-five"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion2-faq-five"
                  >
                    {t('questions.whatIsTheRefundProcedure.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion2-faq-five"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-2"
                  >
                    <p className="faq-body">
                      {t('questions.whatIsTheRefundProcedure.answer')}
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion2-faq-six"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion2-faq-six"
                  >
                    {t('questions.isThereFinancialOrAccountingSupport.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion2-faq-six"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-2"
                  >
                    <p className="faq-body">
                      {t('questions.isThereFinancialOrAccountingSupport.answer')}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="tf-faq">
              <h3 className="fw-8 title mb-24">{t('safetyAndSecurity')}</h3>
              <ul className="box-faq" id="wrapper-faq-3">
                <li className="faq-item">
                  <a
                    href="#accordion3-faq-one"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion3-faq-one"
                  >
                    {t('questions.whatLanguagesDoesYourServiceSupport.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion3-faq-one"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-3"
                  >
                    <p className="faq-body">
                      {t('questions.whatLanguagesDoesYourServiceSupport.answer')}
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion3-faq-three"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion3-faq-three"
                  >
                    {t('questions.whatAreTheSafetyFeatures.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion3-faq-three"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-3"
                  >
                    <p className="faq-body">
                      {t('questions.whatAreTheSafetyFeatures.answer').split('\n\n').map((paragraph, idx, arr) => (
                        <React.Fragment key={idx}>
                          {paragraph}
                          {idx < arr.length - 1 && <><br /><br /></>}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion3-faq-four"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion3-faq-four"
                  >
                    {t('questions.howCanIRequestNewFeatures.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion3-faq-four"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-3"
                  >
                    <p className="faq-body">
                      {t('questions.howCanIRequestNewFeatures.answer').split('\n\n').map((paragraph, idx, arr) => (
                        <React.Fragment key={idx}>
                          {paragraph}
                          {idx < arr.length - 1 && <><br /><br /></>}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion3-faq-five"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion3-faq-five"
                  >
                    {t('questions.isMyDataProtected.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion3-faq-five"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-3"
                  >
                    <p className="faq-body">
                      {t('questions.isMyDataProtected.answer')}
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion3-faq-six"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion3-faq-six"
                  >
                    {t('questions.havingTechnicalIssues.title')}
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion3-faq-six"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-3"
                  >
                    <p className="faq-body">
                      {t('questions.havingTechnicalIssues.answer')}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
  
        </div>
      </div>
    </section>
  );
}
