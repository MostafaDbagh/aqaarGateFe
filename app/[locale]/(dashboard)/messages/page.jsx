import Messages from "@/components/dashboard/Messages";
import RouteGuard from "@/components/common/RouteGuard";
import React from "react";

export const metadata = {
  title: "Messages || AqaarGate - Real Estate React Nextjs Template",
  description: "AqaarGate - Real Estate React Nextjs Template",
};

export default function MessagesPage() {
  return (
    <RouteGuard requiredRole="agent">
      <Messages />
    </RouteGuard>
  );
}
