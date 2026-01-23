"use client";
import Breadcumb from "@/components/common/Breadcumb";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Cta from "@/components/common/Cta";
import FutureBuyerInterest from "@/components/otherPages/futureBuyerInterest/FutureBuyerInterest";
import React from "react";

export default function page() {
  return (
    <div id="wrapper" className="counter-scroll">
      <Header1 />
      <Breadcumb pageName="Future Buyer Interest" />
      <div className="main-content">
        <FutureBuyerInterest />
        <Cta />
      </div>
      <Footer1 />
    </div>
  );
}

