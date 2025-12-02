"use client";

import React from "react";
import { Check } from "lucide-react";
import { WizardStep } from "../types";

interface StepIndicatorProps {
  currentStep: WizardStep;
  completedSteps?: WizardStep[];
}

const steps: { id: WizardStep; label: string; number: number }[] = [
  { id: "package", label: "Package", number: 1 },
  { id: "payment", label: "Payment", number: 2 },
  { id: "calendar", label: "Calendar", number: 3 },
  { id: "success", label: "Complete", number: 4 },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps = [],
}) => {
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const getStepStatus = (step: (typeof steps)[0], index: number) => {
    if (completedSteps.includes(step.id)) return "completed";
    if (index < currentStepIndex) return "completed";
    if (step.id === currentStep) return "current";
    return "upcoming";
  };

  return (
    <div className="w-full py-6 px-4 bg-linear-to-r from-gray-50 to-white">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const status = getStepStatus(step, index);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 relative z-10">
                {/* Step Circle */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300
                    ${
                      status === "completed"
                        ? "bg-(--primary) text-black shadow-lg scale-110"
                        : status === "current"
                        ? "bg-(--primary) text-black shadow-xl scale-125 ring-4 ring-(--primary) ring-opacity-30"
                        : "bg-gray-200 text-gray-400"
                    }
                  `}
                >
                  {status === "completed" ? (
                    <Check size={20} strokeWidth={3} />
                  ) : (
                    <span className="text-sm">{step.number}</span>
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`
                    text-xs font-semibold transition-all duration-300 whitespace-nowrap
                    ${
                      status === "current"
                        ? "text-gray-900 scale-110"
                        : status === "completed"
                        ? "text-gray-600"
                        : "text-gray-400"
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 h-1 mx-2 bg-gray-200 rounded-full overflow-hidden relative">
                  <div
                    className={`
                      h-full bg-(--primary) transition-all duration-500 ease-out
                      ${index < currentStepIndex ? "w-full" : "w-0"}
                    `}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const status = getStepStatus(step, index);

          return (
            <div
              key={step.id}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${status === "current" ? "w-12" : "w-8"}
                ${
                  status === "completed" || status === "current"
                    ? "bg-(--primary)"
                    : "bg-gray-200"
                }
              `}
            />
          );
        })}
      </div>
    </div>
  );
};
