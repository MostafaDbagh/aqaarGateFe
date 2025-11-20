import Profile from "@/components/dashboard/Profile";
import RouteGuard from "@/components/common/RouteGuard";
import React from "react";

export const metadata = {
  title: "My Profile || AqaarGate - Real Estate React Nextjs Template",
  description: "AqaarGate - Real Estate React Nextjs Template",
};
export default function page() {
  // Allow both user and agent roles
  return (
    <RouteGuard requiredRole="user">
      <Profile />
    </RouteGuard>
  );
}
