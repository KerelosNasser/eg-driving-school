"use client";

import { useState, useEffect } from "react";
import { X, Loader2, DollarSign, FileText, Package } from "lucide-react";
import { CreatePaymentInput } from "@/types/payment";
import { DrivingPackage } from "@/types/package";
import { packageService } from "@/lib/services/package-service";
import { useAuth } from "@/components/providers/AuthProvider";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePaymentInput) => Promise<void>;
  isLoading: boolean;
}

export function RecordPaymentModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: RecordPaymentModalProps) {
  const { profile } = useAuth();
  const [packages, setPackages] = useState<DrivingPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);

  const [amount, setAmount] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      setLoadingPackages(true);
      try {
        const data = await packageService.getActivePackages();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoadingPackages(false);
      }
    };

    if (isOpen) {
      fetchPackages();
    }
  }, [isOpen]);

  // Update amount when package is selected
  useEffect(() => {
    if (selectedPackageId) {
      const pkg = packages.find((p) => p.id === selectedPackageId);
      if (pkg) {
        setAmount(pkg.price.toString());
      }
    }
  }, [selectedPackageId, packages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !profile.email || !profile.firstName) return;

    const selectedPackage = packages.find((p) => p.id === selectedPackageId);

    await onSubmit({
      userId: profile.uid,
      userEmail: profile.email,
      userName: `${profile.firstName} ${profile.lastName || ""}`.trim(),
      amount: parseFloat(amount),
      referenceId,
      packageId: selectedPackageId || undefined,
      packageName: selectedPackage?.name,
      notes: notes || undefined,
    });

    // Reset form
    setAmount("");
    setReferenceId("");
    setSelectedPackageId("");
    setNotes("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Record Payment</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Package Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Package size={16} />
              Select Package (Optional)
            </label>
            <select
              value={selectedPackageId}
              onChange={(e) => setSelectedPackageId(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-(--primary)"
              disabled={isLoading || loadingPackages}
            >
              <option value="">Custom Amount</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - ${pkg.price}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <DollarSign size={16} />
              Amount Paid
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-(--primary)"
              placeholder="0.00"
              disabled={isLoading}
            />
          </div>

          {/* Reference ID */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <FileText size={16} />
              Reference / Receipt No.
            </label>
            <input
              type="text"
              required
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-(--primary)"
              placeholder="e.g. PayID Ref or Receipt #"
              disabled={isLoading}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--primary)] min-h-[80px]"
              placeholder="Any additional details..."
              disabled={isLoading}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/60 hover:text-white transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !amount || !referenceId}
              className="px-6 py-2 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
