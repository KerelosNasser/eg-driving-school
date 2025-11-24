"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Check,
  X as XIcon,
} from "lucide-react";
import { DrivingPackage, CreatePackageInput } from "@/types/package";
import { packageService } from "@/lib/services/package-service";
import { PackageModal } from "./PackageModal";
import { useAuth } from "@/components/providers/AuthProvider";

export function PackagesTab() {
  const { profile } = useAuth();
  const [packages, setPackages] = useState<DrivingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<
    DrivingPackage | undefined
  >(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = profile?.role === "admin";

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const data = isAdmin
        ? await packageService.getAllPackages()
        : await packageService.getActivePackages();
      setPackages(data);
    } catch (err) {
      setError("Failed to load packages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (profile) {
      fetchPackages();
    }
  }, [profile, fetchPackages]);

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

  const handleSubmit = async (data: CreatePackageInput) => {
    try {
      setSubmitting(true);
      if (editingPackage) {
        await packageService.updatePackage(editingPackage.id, data);
      } else {
        await packageService.createPackage(data);
      }
      await fetchPackages();
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to save package");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-white/60">Loading packages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Packages</h2>
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-white transition-colors"
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
            className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-white/20 transition-colors"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-start justify-between md:justify-start gap-4">
                <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
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

              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span>${pkg.price}</span>
                <span>•</span>
                <span>{pkg.hours} Hours</span>
              </div>

              {pkg.description && (
                <p className="text-white/60 text-sm">{pkg.description}</p>
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
                    className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => alert("Booking functionality coming soon!")}
                  className="px-6 py-2 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-white transition-colors"
                >
                  Buy Now
                </button>
              )}
            </div>
          </div>
        ))}

        {packages.length === 0 && (
          <div className="text-center py-12 text-white/40 bg-white/5 rounded-xl border border-white/5">
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
    </div>
  );
}
