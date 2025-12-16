import Breadcumb from "@/components/common/Breadcumb";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Cta from "@/components/common/Cta";
import PropertyRentalService from "@/components/otherPages/propertyRentalService/PropertyRentalService";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

export const metadata = {
  title: "Property Rental Service | AqaarGate - Full-Service Property Management",
  description: "Let AqaarGate manage and rent out your property. We provide comprehensive property rental services with a specialized maintenance team, guaranteed property condition maintenance, and flexible rental agreements. Start with our simple property submission form.",
  keywords: [
    "property rental service",
    "property management",
    "rental management",
    "property maintenance",
    "Syria property rental",
    "real estate management",
    "property rental agreement",
    "property rental commission",
    "AqaarGate rental service"
  ],
  openGraph: {
    title: "Property Rental Service | AqaarGate",
    description: "Comprehensive property rental and management services with guaranteed maintenance and flexible agreements.",
    url: `${baseUrl}/property-rental-service`,
    siteName: "AqaarGate",
    images: [
      {
        url: `${baseUrl}/images/logo/logo-2@2x.png`,
        width: 1200,
        height: 630,
        alt: "AqaarGate Property Rental Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: `${baseUrl}/property-rental-service`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function PropertyRentalServicePage() {
  return (
    <>
      <div id="wrapper" className="counter-scroll">
        <Header1 />
        <Breadcumb pageName="Property Rental Service" />
        <div className="main-content">
          {/* SEO Content - Visible to Google Crawler (Server-Side Rendered) */}
          <section style={{ padding: '40px 0', backgroundColor: '#f8f9fa' }}>
            <div className="tf-container">
              <div className="row">
                <div className="col-12">
                  <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
                    Property Rental Service | AqaarGate - Full-Service Property Management
                  </h1>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#666', marginBottom: '30px' }}>
                    Let <strong>AqaarGate manage and rent out your property</strong>. We provide comprehensive <strong>property rental services</strong> 
                    with a <strong>specialized maintenance team</strong>, <strong>guaranteed property condition maintenance</strong>, and 
                    <strong>flexible rental agreements</strong>. Our <strong>property management services</strong> in Syria and Lattakia 
                    ensure your property is well-maintained and generating income.
                  </p>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px', color: '#333' }}>
                    Comprehensive Property Management
                  </h2>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', marginBottom: '20px' }}>
                    AqaarGate offers <strong>full-service property management</strong> including <strong>rental management</strong>, 
                    <strong>property maintenance</strong>, and <strong>tenant relations</strong>. Start with our simple property submission form 
                    and let us handle all aspects of <strong>property rental in Syria</strong>.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <PropertyRentalService />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}

