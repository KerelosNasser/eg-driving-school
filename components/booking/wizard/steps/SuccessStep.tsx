"use client";

import React from "react";
import { Check } from "lucide-react";
import { WizardButton } from "../ui/WizardButton";

interface SuccessStepProps {
  onClose: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ onClose }) => {
  return (
    <div className="relative text-center space-y-6 py-8">
      {/* Success Icon */}
      <div className="relative inline-block">
        <div className="w-24 h-24 bg-linear-to-br from-(--primary) to-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
          <Check size={48} className="text-black" strokeWidth={3} />
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-4">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">
            Booking Confirmed! 🎉
          </h3>
          <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
            Your booking request has been submitted successfully. You&apos;ll
            receive a confirmation email once it&apos;s been reviewed and
            approved.
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 max-w-md mx-auto mt-6">
          <p className="text-sm text-blue-900 font-medium">
            📧 Check your email for booking details
          </p>
          <p className="text-xs text-blue-700 mt-2">
            We&apos;ll notify you as soon as your lesson is confirmed
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4">
        <WizardButton
          onClick={onClose}
          className="px-12 py-6 text-lg"
          size="lg"
        >
          Done
        </WizardButton>
      </div>
    </div>
  );
};
