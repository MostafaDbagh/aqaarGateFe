"use client";
import Breadcumb from "@/components/common/Breadcumb";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Cta from "@/components/common/Cta";
import PropertyRentalService from "@/components/otherPages/propertyRentalService/PropertyRentalService";

export default function PropertyRentalServiceClient() {
  return (
    <div id="wrapper" className="counter-scroll">
      <Header1 />
      <Breadcumb pageName="Property Rental Service" />
      <div className="main-content">
        <PropertyRentalService />
        <Cta />
      </div>
      <Footer1 />
    </div>
  );
}
