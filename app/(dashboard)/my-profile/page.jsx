import Profile from "@/components/dashboard/Profile";
import RouteGuard from "@/components/common/RouteGuard";
import React from "react";

export const metadata = {
  title: "My Profile || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <RouteGuard requiredRole="user">
      <Profile />
    </RouteGuard>
  );
}
