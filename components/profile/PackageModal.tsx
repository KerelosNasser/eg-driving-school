"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { CreatePackageInput, DrivingPackage } from "@/types/package";

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePackageInput) => Promise<void>;
  initialData?: DrivingPackage;
  isLoading: boolean;
}

export function PackageModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: PackageModalProps) {
  const [formData, setFormData] = useState<CreatePackageInput>({
    name: "",
    price: 0,
    hours: 0,
    description: "",
    warning: "",
    isTestPackage: false,
    active: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        hours: initialData.hours,
        description: initialData.description || "",
        warning: initialData.warning || "",
        isTestPackage: initialData.isTestPackage,
        active: initialData.active,
      });
    } else {
      setFormData({
        name: "",
        price: 0,
        hours: 0,
        description: "",
        warning: "",
        isTestPackage: false,
        active: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {initialData ? "Edit Package" : "Create New Package"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1">
              Package Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--primary)]"
              placeholder="e.g. 5 Hours Driving Lesson"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">
                Hours
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.5"
                value={formData.hours}
                onChange={(e) =>
                  setFormData({ ...formData, hours: Number(e.target.value) })
                }
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--primary)] h-24 resize-none"
              placeholder="Package details..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1">
              Warning Note (Optional)
            </label>
            <input
              type="text"
              value={formData.warning}
              onChange={(e) =>
                setFormData({ ...formData, warning: e.target.value })
              }
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--primary)]"
              placeholder="Important notice for users..."
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isTestPackage}
                onChange={(e) =>
                  setFormData({ ...formData, isTestPackage: e.target.checked })
                }
                className="w-4 h-4 rounded border-white/10 bg-black/50 text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <span className="text-sm text-white/80">Is Test Package?</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="w-4 h-4 rounded border-white/10 bg-black/50 text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <span className="text-sm text-white/80">Active</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialData ? "Update Package" : "Create Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
