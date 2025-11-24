"use client";

import { useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  User,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Check,
  Phone,
  Smartphone,
  FileText,
  AlertCircle,
  MapPin,
  Navigation,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";

// Add type definition for window.recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

interface EnhancedAuthFormProps {
  onComplete?: (data: {
    user: User;
    phoneNumber: string;
    additionalPhone?: string;
    healthNote?: string;
    address?: string;
  }) => void;
  className?: string;
}

const libraries: "places"[] = ["places"];

export function EnhancedAuthForm(props: EnhancedAuthFormProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthFormContent {...props} />;
}

function AuthFormContent({ onComplete, className }: EnhancedAuthFormProps) {
  // State
  const [isSignUp, setIsSignUp] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] =
    useState<ConfirmationResult | null>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [additionalPhone, setAdditionalPhone] = useState("");
  const [healthNote, setHealthNote] = useState("");
  const [address, setAddress] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  // Places Autocomplete
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "au" },
    },
    debounce: 300,
  });

  useEffect(() => {
    setAddress(value);
  }, [value]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (!auth || window.recaptchaVerifier) return;

    if (document.getElementById("recaptcha-container")) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
          }
        );
      } catch (e) {
        console.error("Recaptcha init error:", e);
      }
    }
  }, [otpSent]);

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError("Authentication service unavailable.");
      return;
    }
    setGoogleLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err: unknown) {
      console.error("Google Sign-In Error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to sign in with Google.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 10) {
      setPhoneNumber(formatted);
    }
  };

  const isValidPhone = (phone: string) => {
    const clean = phone.replace(/\s/g, "");
    return /^04\d{8}$/.test(clean) || /^\+614\d{8}$/.test(clean);
  };

  const handleSendOtp = async () => {
    if (!isValidPhone(phoneNumber)) {
      setError(
        "Please enter a valid Australian mobile number (e.g., 0412 345 678)"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (!auth) throw new Error("Auth not initialized");

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
          }
        );
      }

      const formattedNumber = phoneNumber.startsWith("0")
        ? "+61" + phoneNumber.replace(/\s/g, "").substring(1)
        : phoneNumber;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedNumber,
        window.recaptchaVerifier
      );
      setVerificationId(confirmationResult);
      setOtpSent(true);
      setTimer(60);
    } catch (err: unknown) {
      console.error("Error sending OTP:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send verification code.");
      }
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!verificationId || !otp) return;
    setLoading(true);
    setError("");

    try {
      await verificationId.confirm(otp);
      setIsPhoneVerified(true);
      setOtpSent(false);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();
    setAddress(description);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const results = await getGeocode({
            location: { lat: latitude, lng: longitude },
          });
          if (results[0]) {
            setValue(results[0].formatted_address, false);
            setAddress(results[0].formatted_address);
          }
        } catch (error) {
          console.error("Error getting location:", error);
          setError("Failed to get current location.");
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Unable to retrieve your location.");
        setGeoLoading(false);
      }
    );
  };

  const handleSubmit = () => {
    if (user && isPhoneVerified && onComplete) {
      onComplete({
        user,
        phoneNumber,
        additionalPhone: isSignUp ? additionalPhone : undefined,
        healthNote: isSignUp ? healthNote : undefined,
        address: isSignUp ? address : undefined,
      });
    }
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Mode Switch (Tabs) */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100/80 rounded-xl">
        <button
          onClick={() => setIsSignUp(false)}
          className={cn(
            "py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
            !isSignUp
              ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsSignUp(true)}
          className={cn(
            "py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
            isSignUp
              ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Sign Up
        </button>
      </div>

      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="text-sm text-gray-500">
          {isSignUp
            ? "Enter your details to get started."
            : "Sign in to manage your bookings."}
        </p>
      </div>

      <div className="space-y-4">
        {/* Google Sign In */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Google Account
          </Label>
          {!user ? (
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium transition-all"
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Image
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
              )}
              Continue with Google
            </Button>
          ) : (
            <div className="p-3 bg-green-50/50 border border-green-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                  {user.displayName?.charAt(0) || "U"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <Check className="w-5 h-5 text-green-600" />
            </div>
          )}
        </div>

        {/* Phone Verification */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Mobile Number
          </Label>
          <div className="relative group">
            <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              type="tel"
              placeholder="0412 345 678"
              value={phoneNumber}
              onChange={handlePhoneChange}
              disabled={isPhoneVerified || (otpSent && !isPhoneVerified)}
              className={cn(
                "pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all duration-200",
                isPhoneVerified &&
                  "bg-green-50/50 border-green-200 text-green-900"
              )}
            />
            {!isPhoneVerified &&
              !otpSent &&
              phoneNumber.replace(/\s/g, "").length >= 10 && (
                <div className="absolute right-1.5 top-1.5 bottom-1.5">
                  <Button
                    size="sm"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="h-full px-4 font-medium bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send Code"
                    )}
                  </Button>
                </div>
              )}
            {isPhoneVerified && (
              <div className="absolute right-3 top-3.5">
                <Check className="w-5 h-5 text-green-600" />
              </div>
            )}
          </div>

          {/* OTP Input */}
          {otpSent && !isPhoneVerified && (
            <div className="space-y-3 animate-in slide-in-from-top-2 fade-in pt-2">
              <div className="relative group">
                <Smartphone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white tracking-widest font-mono text-lg"
                />
                {otp.length === 6 && (
                  <div className="absolute right-1.5 top-1.5 bottom-1.5">
                    <Button
                      size="sm"
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="h-full px-4 bg-green-600 hover:bg-green-700 text-white shadow-sm"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-xs px-1">
                <span className="text-gray-500">
                  {timer > 0
                    ? `Resend code in ${timer}s`
                    : "Didn't receive code?"}
                </span>
                {timer === 0 && (
                  <button
                    onClick={handleSendOtp}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          )}

          <div id="recaptcha-container"></div>
        </div>

        {/* Sign Up Fields */}
        {isSignUp && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                Address
              </Label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search your address..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={!ready}
                  className="pl-10 pr-12 h-12 bg-gray-50/50 border-gray-200 focus:bg-white"
                />
                <div className="absolute right-1.5 top-1.5 bottom-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCurrentLocation}
                    disabled={geoLoading || !ready}
                    className="h-full w-9 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    title="Use current location"
                  >
                    {geoLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Navigation className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {status === "OK" && (
                  <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-xl max-h-60 overflow-auto animate-in fade-in slide-in-from-top-1">
                    {data.map(({ place_id, description }) => (
                      <li
                        key={place_id}
                        onClick={() => handleAddressSelect(description)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition-colors border-b border-gray-50 last:border-0"
                      >
                        {description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                Alternative Contact
              </Label>
              <div className="relative group">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="tel"
                  placeholder="0412 345 678"
                  value={additionalPhone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    if (formatted.replace(/\s/g, "").length <= 10)
                      setAdditionalPhone(formatted);
                  }}
                  className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                Health Conditions
                <span className="text-[10px] text-gray-400 font-normal uppercase tracking-wider">
                  Optional
                </span>
              </Label>
              <div className="relative group">
                <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Textarea
                  placeholder="Any health conditions we should be aware of?"
                  value={healthNote}
                  onChange={(e) => setHealthNote(e.target.value)}
                  className="pl-10 min-h-[100px] resize-none bg-gray-50/50 border-gray-200 focus:bg-white py-3"
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-in shake">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!user || !isPhoneVerified}
          className={cn(
            "w-full h-12 text-base font-semibold shadow-lg transition-all duration-300 rounded-xl mt-4",
            user && isPhoneVerified
              ? "bg-gray-900 hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5"
              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
          )}
        >
          {isSignUp ? "Complete Registration" : "Sign In"}
        </Button>
      </div>
    </div>
  );
}
