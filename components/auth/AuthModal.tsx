"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneVerification } from "./PhoneVerification";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthComplete: (user: User, phoneNumber: string) => void;
}

export function AuthModal({ isOpen, onClose, onAuthComplete }: AuthModalProps) {
  const [step, setStep] = useState<"google" | "phone">("google");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError("Authentication service is not available.");
      return;
    }
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setStep("phone");
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerified = (phoneNumber: string) => {
    if (user) {
      onAuthComplete(user, phoneNumber);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "google" ? "Sign in to Book" : "Verify Phone Number"}
          </DialogTitle>
          <DialogDescription>
            {step === "google"
              ? "Please sign in with your Google account to continue with your booking."
              : "We need to verify your Australian mobile number for booking confirmation."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === "google" ? (
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 h-12 text-base"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Image
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                )}
                Sign in with Google
              </Button>
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            </div>
          ) : (
            <PhoneVerification onVerificationComplete={handlePhoneVerified} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
