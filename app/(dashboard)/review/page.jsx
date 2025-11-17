import Review from "@/components/dashboard/Review";
import RouteGuard from "@/components/common/RouteGuard";
import React from "react";

export const metadata = {
  title: "Review || AqaarGate - Real Estate React Nextjs Template",
  description: "AqaarGate - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <RouteGuard requiredRole="agent">
      <Review />
    </RouteGuard>
  );
}
