"use client";

import React, { useCallback } from "react";
import { WizardProvider, useWizard } from "./wizard/WizardContext";
import { WizardShell } from "./wizard/ui/WizardShell";
import { PackageStep } from "./wizard/steps/PackageStep";
import { PaymentStep } from "./wizard/steps/PaymentStep";
import { CalendarStep } from "./wizard/steps/CalendarStep";
import { SuccessStep } from "./wizard/steps/SuccessStep";

interface QuickBookWizardProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPackageId?: string;
}

interface WizardContentProps {
  isOpen: boolean;
  onClose: () => void;
}

const WizardContent: React.FC<WizardContentProps> = ({ isOpen, onClose }) => {
  const { currentStep, setCurrentStep } = useWizard();

  const handleClose = useCallback(() => {
    setCurrentStep("package");
    onClose();
  }, [setCurrentStep, onClose]);

  const renderStep = () => {
    switch (currentStep) {
      case "package":
        return <PackageStep />;
      case "payment":
        return <PaymentStep />;
      case "calendar":
        return <CalendarStep />;
      case "success":
        return <SuccessStep onClose={handleClose} />;
      default:
        return null;
    }
  };

  return (
    <WizardShell
      isOpen={isOpen}
      onClose={handleClose}
      currentStep={currentStep}
    >
      {renderStep()}
    </WizardShell>
  );
};

export default function QuickBookWizard({
  isOpen,
  onClose,
  preselectedPackageId,
}: QuickBookWizardProps) {
  // Always render WizardProvider to allow data prefetching
  return (
    <WizardProvider onSuccess={onClose}>
      <WizardContent isOpen={isOpen} onClose={onClose} />
    </WizardProvider>
  );
}
