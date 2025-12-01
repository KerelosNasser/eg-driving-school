"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Payment, CreatePaymentInput } from "@/types/payment";
import { paymentService } from "@/lib/services/payment-service";
import { Plus, AlertCircle } from "lucide-react";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { PaymentHistory } from "./PaymentHistory";
import { AdminPaymentPanel } from "./AdminPaymentPanel";
import { RecordPaymentModal } from "./RecordPaymentModal";

export function PaymentsTab() {
  const { profile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = profile?.role === "admin";

  const fetchPayments = useCallback(async () => {
    if (!profile) return;

    try {
      setLoading(true);
      setError(null);

      const data = isAdmin
        ? await paymentService.getAllPayments()
        : await paymentService.getUserPayments(profile.uid);

      setPayments(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [profile, isAdmin]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleCreatePayment = async (data: CreatePaymentInput) => {
    try {
      setSubmitting(true);
      await paymentService.createPayment(data);
      await fetchPayments();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 relative">
        <LoadingIndicator
          fullscreen={false}
          message="Loading payments..."
          background="transparent"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isAdmin ? "Payment Approvals" : "Payment History"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isAdmin
              ? "Manage and approve user payments"
              : "View your transaction history and record new payments"}
          </p>
        </div>

        {!isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-(--primary) text-black font-bold rounded-lg hover:opacity-90 transition-colors"
          >
            <Plus size={20} />
            Record Payment
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {isAdmin ? (
        <AdminPaymentPanel payments={payments} onUpdate={fetchPayments} />
      ) : (
        <PaymentHistory payments={payments} />
      )}

      <RecordPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePayment}
        isLoading={submitting}
      />
    </div>
  );
}
