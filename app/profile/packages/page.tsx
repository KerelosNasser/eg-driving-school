"use client";

import { PackagesTab } from "@/components/profile/PackagesTab";
import { useAuth } from "@/components/providers/AuthProvider";

export default function PackagesPage() {
  const { profile, loading } = useAuth();

  if (loading || !profile) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-xl">
      <PackagesTab />
    </div>
  );
}
