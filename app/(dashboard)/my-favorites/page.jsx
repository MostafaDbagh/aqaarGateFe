import Favorites from "@/components/dashboard/Favorites";
import RouteGuard from "@/components/common/RouteGuard";
import React from "react";

export const metadata = {
  title: "My Favorites || AqaarGate - Real Estate React Nextjs Template",
  description: "AqaarGate - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <RouteGuard requiredRole="user">
      <Favorites />
    </RouteGuard>
  );
}
