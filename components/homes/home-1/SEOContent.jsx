"use client";
import React from "react";
import { useLocale } from 'next-intl';
import Link from "next/link";
import styles from "./SEOContent.module.css";

export default function SEOContent() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <section className={`section-seo-content ${styles.seoSection}`} aria-label="SEO Content">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            {/* Main SEO Content */}
            <div className={styles.seoContent}>
              {/* English Content */}
              {locale === 'en' && (
                <div className={styles.contentBlock}>
                  <h1 className={styles.mainTitle}>
                    AqaarGate - #1 Real Estate Platform in Syria & Lattakia | Buy, Rent & Sell Properties
                  </h1>
                  
                  <div className={styles.contentGrid}>
                    <div className={styles.contentItem}>
                      <h2 className={styles.subTitle}>
                        Real Estate Properties in Syria
                      </h2>
                      <p className={styles.text}>
                        Discover the best <strong>real estate properties in Syria</strong> with AqaarGate. 
                        We offer a wide selection of <strong>properties for sale and rent in Syria</strong>, 
                        including luxury homes, apartments, <strong>holiday homes</strong>, and commercial properties. 
                        Whether you're looking for <strong>syria apartments</strong>, <strong>syria houses</strong>, 
                        or <strong>syria villas</strong>, we have the perfect property for you.
                      </p>
                    </div>

                    <div className={styles.contentItem}>
                      <h2 className={styles.subTitle}>
                        Lattakia Real Estate & Properties
                      </h2>
                      <p className={styles.text}>
                        Explore <strong>Lattakia properties</strong> and <strong>Lattakia real estate</strong> 
                        with AqaarGate. Our collection includes <strong>Lattakia apartments</strong>, 
                        <strong>Lattakia houses</strong>, <strong>Lattakia villas</strong>, and 
                        <strong>Lattakia beach properties</strong>. Find your dream home in one of Syria's 
                        most beautiful coastal cities.
                      </p>
                    </div>

                    <div className={styles.contentItem}>
                      <h2 className={styles.subTitle}>
                        Holiday Homes & Vacation Rentals in Syria
                      </h2>
                      <p className={styles.text}>
                        Looking for <strong>holiday homes in Syria (بيوت عطلات سوريا)</strong> or <strong>vacation rentals</strong>? 
                        AqaarGate offers premium <strong>syria holiday homes</strong> and 
                        <strong>lattakia holiday homes</strong> for rent. Perfect for families and expats 
                        looking for <strong>syria vacation rentals</strong> or <strong>lattakia vacation rentals</strong>. 
                        Experience the beauty of Syria with our carefully selected <strong>holiday homes</strong>. 
                        From <strong>beachfront holiday homes</strong> to <strong>mountain retreats</strong>, find your perfect 
                        <strong>syria holiday home</strong> for your next vacation. Book your <strong>syria vacation rental</strong> today!
                      </p>
                    </div>

                    <div className={styles.contentItem}>
                      <h2 className={styles.subTitle}>
                        Property Investment in Syria
                      </h2>
                      <p className={styles.text}>
                        Invest in <strong>syria property investment</strong> opportunities with AqaarGate. 
                        We specialize in <strong>syria real estate</strong> for international buyers from 
                        Germany, Netherlands, EU countries, and Arab Gulf (UAE, Saudi Arabia, Qatar, Kuwait, 
                        Bahrain, Oman). Our expert team guides you through <strong>syria home buying</strong> 
                        and <strong>syria home selling</strong> processes.
                      </p>
                    </div>
                  </div>

                  <div className={styles.ctaSection}>
                    <p className={styles.ctaText}>
                      Browse our <Link href="/property-list" className={styles.link} style={{margin:'0 2px'}}>property listings </Link> 
                    
                      to find your perfect home in Syria or Lattakia. 
                      Contact our  <Link href="/agents" className={styles.link} target="_blank" style={{margin:'0 2px'}}>real estate agents </Link> 
                      for expert guidance.
                    </p>
                  </div>
                </div>
              )}

              {/* Arabic Content */}
              {locale === 'ar' && (
                <div className={styles.contentBlock}>
                  <h1 className={styles.mainTitle}>
                    عقار جيت AqaarGate - منصة العقارات #1 في سوريا واللاذقية | شراء، بيع وإيجار العقارات
                  </h1>
                  
                  <div className={styles.contentGrid}>
                    <div className={styles.contentItem}>
                      <h2 className={styles.subTitle}>
                        عقارات سوريا
                      </h2>
                      <p className={styles.text}>
                        اكتشف أفضل <strong>عقارات سوريا</strong> مع عقار جيت - منصة العقارات #1 في سوريا. 
                        نقدم أكثر من 1000 عقار موثق من <strong>العقارات للبيع والإيجار في سوريا</strong>، 
                        بما في ذلك المنازل الفاخرة والشقق و<strong>بيوت العطلات (بيوت عطلات سوريا)</strong> والفلل والعقارات التجارية. 
                        سواء كنت تبحث عن <strong>شقق في سوريا</strong> أو <strong>منازل في سوريا</strong> 
                        أو <strong>فلل في سوريا</strong> أو <strong>بيوت عطلات في سوريا</strong>، لدينا العقار المثالي لك. 
                        تصفح مجموعتنا الواسعة من <strong>عقارات سوريا</strong> واعثر على عقار أحلامك اليوم.
                      </p>
                    </div>

                    <div className={styles.contentItem}>
                      <h2 className={styles.subTitle}>
                        عقارات اللاذقية
                      </h2>
                      <p className={styles.text}>
                        استكشف <strong>عقارات اللاذقية</strong> مع عقار جيت. 
                        تشمل مجموعتنا <strong>شقق في اللاذقية</strong> و<strong>منازل في اللاذقية</strong> 
                        و<strong>فلل في اللاذقية</strong> و<strong>عقارات ساحلية في اللاذقية</strong>. 
                        ابحث عن منزل أحلامك في واحدة من أجمل المدن الساحلية في سوريا.
                      </p>
                    </div>

                    <div className={styles.contentItem}>
                      <h2 className={styles.subTitle}>
                        بيوت عطلات في سوريا
                      </h2>
                      <p className={styles.text}>
                        تبحث عن <strong>بيوت عطلات في سوريا</strong> أو <strong>إيجار منازل عطلات</strong>؟ 
                        يقدم عقار جيت <strong>بيوت عطلات سوريا</strong> و<strong>بيوت عطلات اللاذقية</strong> 
                        للإيجار. مثالية للعائلات والمغتربين الذين يبحثون عن <strong>إيجار منازل عطلات</strong> 
                        أو <strong>استئجار بيت عطلة</strong>. استمتع بجمال سوريا مع <strong>بيوت عطلات</strong> 
                        المختارة بعناية. من <strong>بيوت عطلات على الشاطئ</strong> إلى <strong>بيوت عطلات في الجبال</strong>، 
                        اعثر على <strong>بيت عطلة مثالي في سوريا</strong> لعطلتك القادمة. احجز <strong>إيجار بيت عطلة في سوريا</strong> اليوم!
                      </p>
                    </div>

                    <div className={styles.contentItem}>
                      <h2 className={styles.subTitle}>
                        استثمار عقاري في سوريا
                      </h2>
                      <p className={styles.text}>
                        استثمر في <strong>استثمار عقاري في سوريا</strong> مع عقار جيت. 
                        نتخصص في <strong>عقارات سوريا</strong> للمشترين الدوليين من ألمانيا وهولندا 
                        ودول الاتحاد الأوروبي والخليج العربي (الإمارات، السعودية، قطر، الكويت، 
                        البحرين، عمان). يرشدك فريقنا الخبير خلال عمليات <strong>شراء عقار في سوريا</strong> 
                        و<strong>بيع عقار في سوريا</strong>.
                      </p>
                    </div>
                  </div>

                  <div className={styles.ctaSection}>
                    <p className={styles.ctaText}>
                      تصفح <Link href="/property-list" className={styles.link} style={{margin:'0 2px'}}>أكثر من 1000 عقار موثق</Link> 
                      للعثور على منزل أحلامك في سوريا أو اللاذقية. 
                      تبحث عن <Link href="/property-list?propertyType=Holiday Home" className={styles.link} style={{margin:'0 2px'}}>بيوت عطلات في سوريا</Link>؟ 
                      اطلع على <Link href="/property-list?status=rent&propertyType=Holiday Home" className={styles.link} style={{margin:'0 2px'}}>إيجار بيوت عطلات</Link>. 
                      اتصل بـ <Link href="/agents" className={styles.link} style={{margin:'0 2px'}}>وكلاء العقارات الخبراء</Link> 
                      للحصول على إرشادات مخصصة. ابدأ البحث عن عقارك اليوم!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

