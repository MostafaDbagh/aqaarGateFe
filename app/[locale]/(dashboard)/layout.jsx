"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import Header1 from "@/components/headers/Header1";
import React from "react";

// Metadata cannot be exported from client components
// export const metadata = {
//   title: "Dashboard || AqaarGate - Real Estate React Nextjs Template",
//   description: "AqaarGate - Real Estate React Nextjs Template",
// };
export default function DashboardLayout({ children }) {
  return (
    <>
      <div className="bg-dashboard">
        <div id="wrapper" className="bg-4">
          <Header1 parentClass="header dashboard" />
          <div className="page-layout">
            <Sidebar />
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
