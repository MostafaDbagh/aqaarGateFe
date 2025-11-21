import MakeMeAgent from "@/components/dashboard/MakeMeAgent";
import Header1 from "@/components/headers/Header1";
import RouteGuard from "@/components/common/RouteGuard";
import React from "react";

export const metadata = {
  title: "Become an Agent || AqaarGate - Real Estate React Nextjs Template",
  description: "Become a property agent on AqaarGate",
};

export default function MakeMeAgentPage() {
  return (
    <RouteGuard requiredRole="user">
      <MakeMeAgent />
    </RouteGuard>
  );
}

