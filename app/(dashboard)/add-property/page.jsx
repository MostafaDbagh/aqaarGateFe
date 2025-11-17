import AddProperty from "@/components/dashboard/AddProperty";
import RouteGuard from "@/components/common/RouteGuard";
import React from "react";

export const metadata = {
  title: "Add Property || AqaarGate - Real Estate React Nextjs Template",
  description: "AqaarGate - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <RouteGuard requiredRole="agent">
      <AddProperty />
    </RouteGuard>
  );
}
