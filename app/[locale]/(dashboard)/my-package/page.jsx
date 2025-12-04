"use client";
import ComingSoon from "@/components/common/ComingSoon";
import RouteGuard from "@/components/common/RouteGuard";
import React from "react";

export default function page() {
  return (
    <RouteGuard requiredRole="user">
      <ComingSoon 
        title="My Package - Coming Soon"
        message="The package management feature is currently under development. You'll be able to view and manage your subscription packages here soon."
        icon=""
        usePackageTranslations={true}
      />
    </RouteGuard>
  );
}
