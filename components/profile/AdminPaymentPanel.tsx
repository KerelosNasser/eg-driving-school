"use client";

import { useState } from "react";
import { Payment, PaymentStatus } from "@/types/payment";
import { Check, X, Search } from "lucide-react";
import { paymentService } from "@/lib/services/payment-service";

interface AdminPaymentPanelProps {
  payments: Payment[];
  onUpdate: () => void;
}

export function AdminPaymentPanel({
  payments,
  onUpdate,
}: AdminPaymentPanelProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusUpdate = async (id: string, status: PaymentStatus) => {
    if (!confirm(`Are you sure you want to mark this payment as ${status}?`))
      return;

    try {
      setProcessingId(id);
      await paymentService.updatePaymentStatus(id, status);
      onUpdate();
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment status");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Filter */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name, email, or reference..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-(--primary) transition-colors"
        />
      </div>

      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between md:justify-start gap-4">
                  <h3 className="text-lg font-bold text-white">
                    {payment.userName}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                      payment.status
                    )} capitalize`}
                  >
                    {payment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/60">
                  <div>
                    <span className="block text-xs text-white/40 uppercase">
                      Amount
                    </span>
                    <span className="text-white font-medium">
                      ${payment.amount.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-white/40 uppercase">
                      Reference
                    </span>
                    <span className="text-white">{payment.referenceId}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-white/40 uppercase">
                      Package
                    </span>
                    <span className="text-white">
                      {payment.packageName || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-white/40 uppercase">
                      Date
                    </span>
                    <span>
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {payment.notes && (
                  <div className="text-sm bg-white/5 p-3 rounded-lg text-white/80 mt-2">
                    <span className="text-white/40 text-xs uppercase block mb-1">
                      User Notes
                    </span>
                    {payment.notes}
                  </div>
                )}
              </div>

              {/* Actions */}
              {payment.status === "pending" && (
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleStatusUpdate(payment.id, "approved")}
                    disabled={!!processingId}
                    className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg border border-green-500/20 transition-colors disabled:opacity-50"
                    title="Approve"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(payment.id, "rejected")}
                    disabled={!!processingId}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-colors disabled:opacity-50"
                    title="Reject"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-white/40 bg-white/5 rounded-xl border border-white/5">
            No payments found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
