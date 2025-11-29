"use client";

import { useState, useEffect } from "react";
import { Check, X, AlertCircle, Loader2 } from "lucide-react";
import { Payment } from "@/types/payment";
import { paymentService } from "@/lib/services/payment-service";

export function AdminPaymentPanel() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{
    id: string;
    isOpen: boolean;
  }>({ id: "", isOpen: false });
  const [rejectNote, setRejectNote] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getAllPayments();
      setPayments(data);
    } catch (err) {
      setError("Failed to load payments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleStatusUpdate = async (
    id: string,
    status: "approved" | "rejected",
    notes?: string
  ) => {
    try {
      setProcessingId(id);
      await paymentService.updatePaymentStatus(id, status, notes);
      await fetchPayments();
      setRejectModal({ id: "", isOpen: false });
      setRejectNote("");
    } catch (err) {
      setError("Failed to update payment status");
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div>Loading payments...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Payment Requests</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white">
                  {payment.userName}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs border ${
                    payment.status === "approved"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : payment.status === "rejected"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  }`}
                >
                  {payment.status.toUpperCase()}
                </span>
              </div>

              <div className="text-white/60 text-sm space-y-1">
                <p>Email: {payment.userEmail}</p>
                <p>
                  Ref:{" "}
                  <span className="text-white font-mono">
                    {payment.referenceId}
                  </span>
                </p>
                <p>
                  Amount:{" "}
                  <span className="text-(--primary) font-bold">
                    ${payment.amount}
                  </span>
                </p>
                {payment.packageName && <p>Package: {payment.packageName}</p>}
                {payment.invitationCode && (
                  <p className="text-green-400">
                    Code: {payment.invitationCode} (Discount Applied)
                  </p>
                )}
                <p className="text-xs text-white/40">
                  {new Date(payment.createdAt).toLocaleString()}
                </p>
              </div>

              {payment.notes && (
                <div className="bg-white/5 p-2 rounded text-sm text-white/80 mt-2">
                  Note: {payment.notes}
                </div>
              )}
            </div>

            {payment.status === "pending" && (
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => handleStatusUpdate(payment.id, "approved")}
                  disabled={!!processingId}
                  className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors disabled:opacity-50"
                  title="Approve"
                >
                  {processingId === payment.id ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Check size={20} />
                  )}
                </button>
                <button
                  onClick={() =>
                    setRejectModal({ id: payment.id, isOpen: true })
                  }
                  disabled={!!processingId}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                  title="Reject"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        ))}

        {payments.length === 0 && (
          <div className="text-center py-12 text-white/40 bg-white/5 rounded-xl border border-white/5">
            No payment requests found.
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">Reject Payment</h3>
            <p className="text-white/60 text-sm">
              Please provide a reason for rejection (e.g., &quot;Funds not
              received&quot;).
            </p>

            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Rejection reason..."
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white h-24 focus:border-red-500/50 outline-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setRejectModal({ id: "", isOpen: false });
                  setRejectNote("");
                }}
                className="px-4 py-2 text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleStatusUpdate(rejectModal.id, "rejected", rejectNote)
                }
                disabled={!rejectNote.trim() || !!processingId}
                className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {processingId ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Reject Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
