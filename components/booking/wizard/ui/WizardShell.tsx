"use client";

import React from "react";
import { X } from "lucide-react";
import { WizardStep } from "../types";
import { StepIndicator } from "./StepIndicator";

interface WizardShellProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: WizardStep;
  children: React.ReactNode;
}

const stepTitles: Record<WizardStep, string> = {
  package: "Select Your Package",
  payment: "Complete Payment",
  calendar: "Choose Your Lesson Time",
  success: "Booking Confirmed!",
};

export const WizardShell: React.FC<WizardShellProps> = ({
  isOpen,
  onClose,
  currentStep,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border-t md:border border-gray-200 rounded-t-3xl md:rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl h-[92vh] md:h-auto md:max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-0 md:zoom-in-95 duration-500">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white border-b border-gray-100">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-(--primary) to-yellow-500 opacity-5 rounded-full blur-3xl -mr-48 -mt-48" />

          <div className="relative flex justify-between items-center p-6 md:p-8">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Quick Book
              </h2>
              <p className="text-gray-600 text-sm md:text-base font-medium">
                {stepTitles[currentStep]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 hover:rotate-90 p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative bg-gradient-to-b from-transparent to-gray-50/30">
          {/* Decorative gradient */}
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-(--primary) to-yellow-500 opacity-5 rounded-full blur-3xl -ml-48 -mb-48" />

          <div className="relative max-w-4xl mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
