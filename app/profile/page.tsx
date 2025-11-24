"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { User, Mail, Phone, Hash, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const router = useRouter();

  if (!profile) return null;

  const isAdmin = profile.role === "admin";

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-[var(--primary)] flex items-center justify-center text-black text-3xl font-bold shadow-[0_0_20px_rgba(255,214,0,0.3)]">
            {profile.firstName?.charAt(0) || user?.email?.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center text-amber-50 gap-3">
              {profile.displayName}
              {isAdmin && (
                <span className="bg-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full border border-red-500/30 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </h1>
            <p className="text-white/60">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">
            Personal Information
          </h2>

          <div className="bg-white/5 rounded-xl p-6 space-y-4 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-white/40">Full Name</p>
                <p className="font-medium">
                  {profile.firstName} {profile.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-white/40">Email Address</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-white/40">Phone Number</p>
                <p className="font-medium">
                  {profile.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">
            Account Details
          </h2>

          <div className="bg-white/5 rounded-xl p-6 space-y-4 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                <Hash className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-white/40">Invitation Code</p>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-xl font-bold tracking-wider text-[var(--primary)]">
                    {profile.invitationCode}
                  </p>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(profile.invitationCode)
                    }
                    className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-white/40 mt-1">
                  Share this code with friends!
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white/80 mb-3">
                  Admin Controls
                </h3>
                <button
                  onClick={() => router.push("/profile/packages")}
                  className="w-full py-3 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-white transition-colors mb-2"
                >
                  Manage Packages
                </button>
                <button
                  onClick={() => router.push("/admin")}
                  className="w-full py-3 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-white transition-colors"
                >
                  Access Admin Dashboard
                </button>
              </div>
            )}

            {/* Dev Only: Promote to Admin */}
            {process.env.NODE_ENV === "development" && !isAdmin && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white/80 mb-3">
                  Dev Tools
                </h3>
                <button
                  onClick={async () => {
                    await updateProfile({ role: "admin" });
                  }}
                  className="w-full py-3 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Promote to Admin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
