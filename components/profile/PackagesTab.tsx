"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Check,
  X as XIcon,
  Calendar,
  Clock,
} from "lucide-react";
import { DrivingPackage, CreatePackageInput } from "@/types/package";
import { UserPackage } from "@/types/user-package";
import { packageService } from "@/lib/services/package-service";
import { userPackageService } from "@/lib/services/user-package-service";
import { PackageModal } from "./PackageModal";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

export function PackagesTab() {
  const { profile, user } = useAuth();
  const [packages, setPackages] = useState<DrivingPackage[]>([]);
  const [userPackages, setUserPackages] = useState<UserPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<DrivingPackage | null>(
    null
  );
  const [editingPackage, setEditingPackage] = useState<
    DrivingPackage | undefined
  >(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = profile?.role === "admin";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const pkgData = isAdmin
        ? await packageService.getAllPackages()
        : await packageService.getActivePackages();
      setPackages(pkgData);

      if (user && !isAdmin) {
        const userPkgData = await userPackageService.getUserPackages(user.uid);
        setUserPackages(userPkgData);
      }
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user]);

  useEffect(() => {
    if (profile) {
      fetchData();
    }
  }, [profile, fetchData]);

  const handleCreate = () => {
    setEditingPackage(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (pkg: DrivingPackage) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      await packageService.deletePackage(id);
      setPackages(packages.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete package");
      console.error(err);
    }
  };

  const handleBuy = (pkg: DrivingPackage) => {
    setSelectedPackage(pkg);
    setIsCheckoutOpen(true);
  };

  const handleSubmit = async (data: CreatePackageInput) => {
    try {
      setSubmitting(true);
      if (editingPackage) {
        await packageService.updatePackage(editingPackage.id, data);
      } else {
        await packageService.createPackage(data);
      }
      await fetchData();
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to save package");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 relative">
        <LoadingIndicator
          fullscreen={false}
          message="Loading packages..."
          background="transparent"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User's Active Packages */}
      {!isAdmin && userPackages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">My Packages</h2>
          <div className="grid gap-4">
            {userPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-linear-to-r from-(--primary)/20 to-transparent border border-(--primary)/30 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {pkg.packageName}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-(--primary)" />
                      <span>
                        {pkg.remainingHours} / {pkg.totalHours} Hours Remaining
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
                    className="flex items-center gap-2 px-6 py-3 bg-(--primary) text-black font-bold rounded-lg hover:opacity-90 transition-colors"
                  >
                    <Calendar size={20} />
                    Book Lesson
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Packages
          </h2>
          {isAdmin && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-(--primary) text-black font-bold rounded-lg hover:opacity-90 transition-colors"
            >
              <Plus size={20} />
              Add Package
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-(--primary) transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-start justify-between md:justify-start gap-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {pkg.name}
                  </h3>
                  <div className="flex gap-2">
                    {pkg.isTestPackage && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                        Test Package
                      </span>
                    )}
                    {isAdmin &&
                      (pkg.active ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30 flex items-center gap-1">
                          <Check size={12} /> Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30 flex items-center gap-1">
                          <XIcon size={12} /> Inactive
                        </span>
                      ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <span>${pkg.price}</span>
                  <span>•</span>
                  <span>{pkg.hours} Hours</span>
                </div>

                {pkg.description && (
                  <p className="text-gray-500 text-sm">{pkg.description}</p>
                )}

                {pkg.warning && (
                  <div className="text-amber-400 text-xs bg-amber-500/10 p-2 rounded border border-amber-500/20">
                    Warning: {pkg.warning}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleBuy(pkg)}
                    className="px-6 py-2 bg-(--primary) text-black font-bold rounded-lg hover:opacity-90 transition-colors"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          ))}

          {packages.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-gray-200">
              {isAdmin
                ? "No packages found. Create one to get started."
                : "No active packages available at the moment."}
            </div>
          )}
        </div>

        {isAdmin && (
          <PackageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={editingPackage}
            isLoading={submitting}
          />
        )}

        {selectedPackage && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            packageData={selectedPackage}
          />
        )}
      </div>
    </div>
  );
}
