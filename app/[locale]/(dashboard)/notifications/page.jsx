import Notifications from "@/components/notifications/Notifications";
import RouteGuard from "@/components/common/RouteGuard";
import React from "react";

export const metadata = {
  title: "Notifications || AqaarGate - Real Estate React Nextjs Template",
  description: "AqaarGate - Real Estate React Nextjs Template",
};

export default function NotificationsPage() {
  // Allow user, agent, and admin roles (admin has higher privileges)
  return (
    <RouteGuard requiredRole="user">
      <Notifications />
    </RouteGuard>
  );
}

