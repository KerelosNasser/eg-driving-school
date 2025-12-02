"use client";

import React, { useState } from "react";
import { ArrowLeft, ChevronRight, Copy, Check } from "lucide-react";
import { useWizard } from "../WizardContext";
import { Button } from "@/components/ui/button";
import { WizardButton } from "../ui/WizardButton";

export const PaymentStep: React.FC = () => {
  const {
    selectedPackage,
    paymentReference,
    setPaymentReference,
    paymentNotes,
    setPaymentNotes,
    setCurrentStep,
    handlePaymentContinue,
    loading,
  } = useWizard();

  const [copied, setCopied] = useState(false);
  const payidEmail = "admin@egdrivingschool.com.au";

  const handleCopyPayID = async () => {
    await navigator.clipboard.writeText(payidEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selectedPackage) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Payment Details Card */}
      <div className="relative overflow-hidden bg-linear-to-br from-(--primary) via-yellow-400 to-yellow-500 rounded-2xl p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16" />

        <div className="relative">
          <h3 className="font-bold text-gray-900 mb-4 text-xl">
            Payment Details
          </h3>

          <div className="space-y-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                  PayID
                </p>
                <p className="text-gray-900 font-mono font-medium">
                  {payidEmail}
                </p>
              </div>
              <button
                onClick={handleCopyPayID}
                className="ml-3 p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              >
                {copied ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} className="text-gray-600" />
                )}
              </button>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-1">
                Reference: Your Name + Package Name
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200 flex items-baseline justify-between">
              <span className="text-gray-700 font-semibold">Total Amount:</span>
              <span className="text-3xl font-bold text-(--primary-dark)">
                ${selectedPackage.price}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="group">
          <label className="block mb-2">
            <span className="text-gray-700 font-semibold text-sm flex items-center gap-1">
              Payment Reference / Receipt No.
              <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="text"
            value={paymentReference}
            onChange={(e) => setPaymentReference(e.target.value)}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:border-(--primary) focus:ring-4 focus:ring-(--primary) focus:ring-opacity-20 transition-all duration-200 placeholder:text-gray-400"
            placeholder="e.g. PayID Ref or Receipt #"
            required
          />
        </div>

        <div className="group">
          <label className="block mb-2">
            <span className="text-gray-700 font-semibold text-sm">
              Notes (Optional)
            </span>
          </label>
          <textarea
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:border-(--primary) focus:ring-4 focus:ring-(--primary) focus:ring-opacity-20 transition-all duration-200 min-h-[100px] resize-none placeholder:text-gray-400"
            placeholder="Any additional details..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep("package")}
          className="px-6 hover:bg-gray-100"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
        <WizardButton
          onClick={handlePaymentContinue}
          disabled={!paymentReference || loading}
          loading={loading}
          className="flex-1 py-6 text-lg"
          size="lg"
        >
          Continue to Calendar
          <ChevronRight size={20} className="ml-2" />
        </WizardButton>
      </div>
    </div>
  );
};
