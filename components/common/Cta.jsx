"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function Cta() {
  const t = useTranslations('cta');
  
  return (
    <section className="section-CTA" style={{marginTop:'64px'}}>
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="content-inner">
         
              <div className="content">
                <h4 className="text_white mb-8">
                  {t('title')}
                </h4>
                <p className="text_white text-1">
                  {t('subtitle')}
                </p>
              </div>
              <a href="#" className="tf-btn style-2 fw-6">
                {t('button')}
                <i className="icon-MagnifyingGlass fw-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
