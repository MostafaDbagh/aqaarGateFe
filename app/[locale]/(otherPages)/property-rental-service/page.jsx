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
          <PropertyRentalService />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}

