"use client";

import { Payment } from "@/types/payment";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface PaymentHistoryProps {
  payments: Payment[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  if (payments.length === 0) {
    return (
      <div className="text-center py-12 text-white/40 bg-white/5 rounded-xl border border-white/5">
        No payment history found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
        >
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-white">
                  ${payment.amount.toFixed(2)}
                </span>
                {getStatusBadge(payment.status)}
              </div>

              <div className="text-white/60 text-sm space-y-1">
                <p>
                  Ref: <span className="text-white">{payment.referenceId}</span>
                </p>
                {payment.packageName && (
                  <p>
                    Package:{" "}
                    <span className="text-white">{payment.packageName}</span>
                  </p>
                )}
                <p>Date: {new Date(payment.createdAt).toLocaleDateString()}</p>
              </div>

              {payment.notes && (
                <div className="text-white/60 text-sm bg-white/5 p-2 rounded mt-2">
                  Note: {payment.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
