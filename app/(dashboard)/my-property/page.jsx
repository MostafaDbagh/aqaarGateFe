import Property from "@/components/dashboard/Property";
import RouteGuard from "@/components/common/RouteGuard";
import React from "react";

export const metadata = {
  title: "My Property || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <RouteGuard requiredRole="agent">
      <Property />
    </RouteGuard>
  );
}
