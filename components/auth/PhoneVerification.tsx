"use client";

import { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface PhoneVerificationProps {
  onVerificationComplete: (phoneNumber: string) => void;
}

export function PhoneVerification({ onVerificationComplete }: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) return;
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      });
    }
  }, []);

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);

    // Basic validation for Australian mobile numbers
    // Starts with +61 or 04, followed by 8 digits.
    // We'll normalize to +61 format.
    let formattedNumber = phoneNumber.replace(/\s/g, "");
    
    // Allow specific test numbers to bypass validation
    const TEST_NUMBERS = ["+16505551234"];
    
    if (TEST_NUMBERS.includes(formattedNumber)) {
       // Skip Australian validation for test numbers
    } else {
        if (formattedNumber.startsWith("0")) {
          formattedNumber = "+61" + formattedNumber.substring(1);
        }
    
        if (!/^\+614\d{8}$/.test(formattedNumber)) {
          setError("Please enter a valid Australian mobile number (e.g., 0412 345 678)");
          setLoading(false);
          return;
        }
    }

    try {
      if (!auth) throw new Error("Auth not initialized");
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      setVerificationId(confirmationResult);
      setPhoneNumber(formattedNumber); // Store normalized number
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Failed to send verification code. Please try again.");
      if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = undefined; // Force re-init on next try if needed
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!verificationId) return;
    setError("");
    setLoading(true);

    try {
      await verificationId.confirm(otp);
      onVerificationComplete(phoneNumber);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!verificationId ? (
        <>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Mobile Number
            </label>
            <div className="flex gap-2">
              <Input
                id="phone"
                type="tel"
                placeholder="0412 345 678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              We'll send a verification code to this number.
            </p>
          </div>
          <div id="recaptcha-container"></div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button onClick={handleSendOtp} disabled={loading || !phoneNumber} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Send Verification Code
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium">
              Verification Code
            </label>
            <Input
              id="otp"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit code sent to {phoneNumber}
            </p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button onClick={handleVerifyOtp} disabled={loading || !otp} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Verify Code
          </Button>
          <Button
            variant="ghost"
            onClick={() => setVerificationId(null)}
            disabled={loading}
            className="w-full mt-2"
          >
            Change Number
          </Button>
        </>
      )}
    </div>
  );
}

// Add type definition for window.recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}
