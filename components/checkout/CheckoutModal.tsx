"use client";

import { useState, useEffect } from "react";
import { X, Check, AlertCircle, Loader2 } from "lucide-react";
import { DrivingPackage } from "@/types/package";
import { tierService } from "@/lib/services/tier-service";
import { paymentService } from "@/lib/services/payment-service";
import { useAuth } from "@/components/providers/AuthProvider";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: DrivingPackage;
}

export function CheckoutModal({
  isOpen,
  onClose,
  packageData,
}: CheckoutModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<"details" | "payment" | "success">(
    "details"
  );
  const [invitationCode, setInvitationCode] = useState("");
  const [validatingCode, setValidatingCode] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [discount, setDiscount] = useState<{
    percent: number;
    tierName: string;
  } | null>(null);
  const [payIdRef, setPayIdRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("details");
      setInvitationCode("");
      setDiscount(null);
      setPayIdRef("");
      setError(null);
      setCodeError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleValidateCode = async () => {
    if (!invitationCode) return;

    try {
      setValidatingCode(true);
      setCodeError(null);
      const result = await tierService.validateCode(invitationCode);

      if (result.isValid && result.tier) {
        setDiscount({
          percent: result.tier.discountPercentage,
          tierName: result.tier.name,
        });
      } else {
        setCodeError("Invalid or inactive code");
        setDiscount(null);
      }
    } catch {
      setCodeError("Error validating code");
    } finally {
      setValidatingCode(false);
    }
  };

  const calculateTotal = () => {
    if (!discount) return packageData.price;
    const discountAmount = (packageData.price * discount.percent) / 100;
    return packageData.price - discountAmount;
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      setError(null);

      const finalAmount = calculateTotal();

      await paymentService.createPayment({
        userId: user.uid,
        userEmail: user.email || "",
        userName: user.displayName || "Unknown User",
        amount: finalAmount,
        referenceId: payIdRef,
        packageId: packageData.id,
        packageName: packageData.name,
        ...(discount && {
          invitationCode: invitationCode,
          originalAmount: packageData.price,
          discountApplied: discount.percent,
        }),
        notes: "Manual PayID Payment",
      });

      setStep("success");
    } catch (err: unknown) {
      console.error("Payment submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit payment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {step === "success" ? "Payment Submitted" : "Checkout"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "details" && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-1">
                  {packageData.name}
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={invitationCode}
                    onChange={(e) =>
                      setInvitationCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter code"
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--primary) outline-none transition-colors"
                  />
                  <button
                    onClick={handleValidateCode}
                    disabled={!invitationCode || validatingCode}
                    className="px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {validatingCode ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
                {codeError && (
                  <p className="text-red-400 text-sm">{codeError}</p>
                )}
                {discount && (
                  <div className="text-green-400 text-sm flex items-center gap-2 bg-green-500/10 p-2 rounded border border-green-500/20">
                    <Check size={14} />
                    {discount.tierName} Tier: {discount.percent}% Discount
                    Applied!
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>${packageData.price}</span>
                </div>
                {discount && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({discount.percent}%)</span>
                    <span>
                      -$
                      {((packageData.price * discount.percent) / 100).toFixed(
                        2
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setStep("payment")}
                className="w-full py-3 bg-(--primary) text-black font-bold rounded-xl hover:bg-white transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {step === "payment" && (
            <form onSubmit={handleSubmitPayment} className="space-y-6">
              <div className="bg-(--primary)/10 border border-(--primary)/20 p-4 rounded-xl">
                <h4 className="font-bold text-(--primary) mb-2">
                  PayID Instructions
                </h4>
                <p className="text-white/80 text-sm mb-2">
                  Please transfer{" "}
                  <span className="font-bold text-white">
                    ${calculateTotal().toFixed(2)}
                  </span>{" "}
                  to:
                </p>
                <div className="bg-black/40 p-3 rounded border border-white/10 font-mono text-center text-lg text-white select-all">
                  0431 512 095
                </div>
                <p className="text-white/60 text-xs mt-2">
                  Use your name as the reference.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Payment Reference / Receipt Number
                </label>
                <input
                  type="text"
                  value={payIdRef}
                  onChange={(e) => setPayIdRef(e.target.value)}
                  placeholder="Enter PayID reference or receipt no."
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-(--primary) outline-none transition-colors"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-(--primary) text-black font-bold rounded-xl hover:bg-white transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Submit Payment"
                  )}
                </button>
              </div>
            </form>
          )}

          {step === "success" && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                <Check size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Payment Submitted!
                </h3>
                <p className="text-white/60">
                  Your payment is currently pending approval. You will receive
                  your package once an admin verifies the transaction.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
