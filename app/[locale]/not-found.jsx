import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Link from "next/link";
import { getLocale } from 'next-intl/server';
import React from "react";

export default async function NotFound() {
  const locale = await getLocale();
  const isRTL = locale === 'ar';
  
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <div className="main-content">
          <Breadcumb pageName={isRTL ? "الصفحة غير موجودة" : "Page Not Found"} />
          <div className="page-content">
            <div className="tf-container tf-spacing-1 pt-0">
              <div className="error-404 text-center">
                <h1 className="mb-20 title" style={{ fontSize: '3rem', fontWeight: 700, color: '#f1913d' }}>
                  404
                </h1>
                <h2 className="mb-20 title" style={{ fontSize: '2rem', fontWeight: 600 }}>
                  {isRTL 
                    ? 'عذراً... لم نتمكن من العثور على هذه الصفحة' 
                    : 'Oh no... We lost this page'}
                </h2>
                <p className="mb-40" style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#666' }}>
                  {isRTL 
                    ? 'بحثنا في كل مكان لكن لم نتمكن من العثور على ما تبحث عنه. دعنا نجد مكاناً أفضل لك للذهاب إليه.'
                    : 'We searched everywhere but couldn\'t find what you\'re looking for. Let\'s find a better place for you to go.'}
                </p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link
                    href={`/${locale}`}
                    className="tf-btn bg-color-primary rounded-4 pd-3 fw-6"
                    style={{ minWidth: '200px' }}
                  >
                    {isRTL ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
                  </Link>
                  <Link
                    href={`/${locale}/property-list`}
                    className="tf-btn style-2 rounded-4 pd-3 fw-6"
                    style={{ minWidth: '200px' }}
                  >
                    {isRTL ? 'تصفح العقارات' : 'Browse Properties'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}

