import Dashboard from "@/components/dashboard/Dashboard";
import Header1 from "@/components/headers/Header1";
import RouteGuard from "@/components/common/RouteGuard";
import React from "react";

export const metadata = {
  title: "Dashboard || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <RouteGuard requiredRole="agent">
      <Dashboard />
    </RouteGuard>
  );
}
