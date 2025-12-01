"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  User,
  Mail,
  Phone,
  Hash,
  Shield,
  Clock,
  Calendar,
  Package as UserPackageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { UserPackage } from "@/types/user-package";
import { userPackageService } from "@/lib/services/user-package-service";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import Link from "next/link";

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const router = useRouter();
  const [userPackages, setUserPackages] = useState<UserPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      if (user && profile?.role !== "admin") {
        try {
          const data = await userPackageService.getUserPackages(user.uid);
          setUserPackages(data);
        } catch (error) {
          console.error("Error fetching packages:", error);
        } finally {
          setLoadingPackages(false);
        }
      } else {
        setLoadingPackages(false);
      }
    };

    fetchPackages();
  }, [user, profile]);

  if (!profile) return null;

  const isAdmin = profile.role === "admin";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-(--primary) flex items-center justify-center text-black text-3xl font-bold shadow-lg">
            {profile.firstName?.charAt(0) || user?.email?.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center text-gray-900 gap-3">
              {profile.displayName}
              {isAdmin && (
                <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full border border-red-200 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions for Users */}
      {!isAdmin && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/profile/calendar"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-(--primary) text-black rounded-xl hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg group"
            >
              <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
              <span className="font-bold text-lg">Book a Lesson</span>
            </Link>

            <Link
              href="/profile/packages"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-200"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <UserPackageIcon size={24} className="text-gray-700" />
              </div>
              <span className="font-bold text-lg">Buy Package</span>
            </Link>

            <a
              href="https://wa.me/61431512095"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-200"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Phone size={24} className="text-gray-700" />
              </div>
              <span className="font-bold text-lg">Contact Support</span>
            </a>
          </div>
        </div>
      )}

      {/* My Packages Section */}
      {!isAdmin && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            My Active Packages
          </h2>
          {loadingPackages ? (
            <div className="h-40 relative">
              <LoadingIndicator
                fullscreen={false}
                size="sm"
                message="Loading your packages..."
                background="transparent"
              />
            </div>
          ) : userPackages.filter((pkg) => pkg.remainingHours > 0).length >
            0 ? (
            <div className="grid gap-4">
              {userPackages
                .filter((pkg) => pkg.remainingHours > 0)
                .map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-linear-to-r from-yellow-50 to-white border border-yellow-200 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {pkg.packageName}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-(--primary)" />
                          <span>
                            {pkg.remainingHours} / {pkg.totalHours} Hours
                            Remaining
                          </span>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-(--primary)"
                          style={{
                            width: `${
                              (pkg.remainingHours / pkg.totalHours) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="self-end md:self-center">
                      <Link
                        href="/profile/calendar"
                        className="flex items-center gap-2 px-6 py-3 bg-(--primary) text-black font-bold rounded-lg hover:opacity-90 transition-colors shadow-sm"
                      >
                        <Calendar size={20} />
                        Book Lesson
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
              <p className="text-gray-500 mb-4">
                You don&apos;t have any active packages yet.
              </p>
              <Link
                href="/profile/packages"
                className="inline-block px-6 py-2 bg-(--primary) text-black font-bold rounded-lg hover:opacity-90 transition-colors shadow-sm"
              >
                Browse Packages
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Personal Information
          </h2>

          <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">
                  {profile.firstName} {profile.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">
                  {profile.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Account Details
          </h2>

          <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm">
                <Hash className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Invitation Code</p>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-xl font-bold tracking-wider text-(--primary)">
                    {profile.invitationCode}
                  </p>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(profile.invitationCode)
                    }
                    className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors text-gray-700"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Share this code with friends!
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Admin Controls
                </h3>
                <button
                  onClick={() => router.push("/profile/packages")}
                  className="w-full py-3 bg-(--primary) text-black font-bold rounded-lg hover:opacity-90 transition-colors mb-2 shadow-sm"
                >
                  Manage Packages
                </button>
                <button
                  onClick={() => router.push("/admin")}
                  className="w-full py-3 bg-(--primary) text-black font-bold rounded-lg hover:opacity-90 transition-colors shadow-sm"
                >
                  Access Admin Dashboard
                </button>
              </div>
            )}

            {/* Role Switcher for Testing */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Role Switcher (Testing)
              </h3>
              <div className="flex gap-2 p-1 bg-gray-200 rounded-lg">
                <button
                  onClick={() => updateProfile({ role: "user" })}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    !isAdmin
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  User View
                </button>
                <button
                  onClick={() => updateProfile({ role: "admin" })}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    isAdmin
                      ? "bg-(--primary) text-black shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Admin View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
