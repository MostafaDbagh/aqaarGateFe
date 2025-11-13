import Messages from "@/components/dashboard/Messages";
import RouteGuard from "@/components/common/RouteGuard";
import React from "react";

export const metadata = {
  title: "Messages || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};

export default function MessagesPage() {
  return (
    <RouteGuard requiredRole="agent">
      <Messages />
    </RouteGuard>
  );
}
