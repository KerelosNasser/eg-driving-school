"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { EnhancedAuthForm } from "./EnhancedAuthForm";
import { User } from "firebase/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthComplete: (user: User, phoneNumber: string) => void;
}

export function AuthModal({ isOpen, onClose, onAuthComplete }: AuthModalProps) {
  const handleComplete = (data: {
    user: User;
    phoneNumber: string;
    additionalPhone?: string;
    healthNote?: string;
    address?: string;
  }) => {
    onAuthComplete(data.user, data.phoneNumber);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <EnhancedAuthForm onComplete={handleComplete} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
