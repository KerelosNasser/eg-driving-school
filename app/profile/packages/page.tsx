"use client";

import { PackagesTab } from "@/components/profile/PackagesTab";
import { useAuth } from "@/components/providers/AuthProvider";

export default function PackagesPage() {
  const { profile, loading } = useAuth();

  if (loading || !profile) {
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
      <PackagesTab />
    </div>
  );
}
