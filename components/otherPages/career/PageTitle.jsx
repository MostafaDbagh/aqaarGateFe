"use client";

import { useTranslations } from 'next-intl';

export default function PageTitle() {
  const t = useTranslations('career.pageTitle');

  return (
    <>
      <style jsx>{`
        .page-title.career {
          background-image: url('/images/j2.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          min-height: 35vh;
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .page-title.career .tf-container {
          position: relative;
          z-index: 2;
          width: 100%;
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
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
