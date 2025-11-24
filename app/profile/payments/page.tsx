"use client";

import { PaymentsTab } from "@/components/profile/PaymentsTab";
import { useAuth } from "@/components/providers/AuthProvider";

export default function PaymentsPage() {
  const { profile, loading } = useAuth();

  if (loading || !profile) {
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
      <PaymentsTab />
    </div>
  );
}
