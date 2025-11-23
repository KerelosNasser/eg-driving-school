"use client";

import { useState, useEffect } from "react";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  User, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult 
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Loader2, 
  Check, 
  Phone, 
  Smartphone, 
  FileText, 
  AlertCircle,
  MapPin,
  Navigation
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
} from "use-places-autocomplete";

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
}

const libraries: ("places")[] = ["places"];

export function EnhancedAuthForm(props: EnhancedAuthFormProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  if (!isLoaded) {
    return (
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return <AuthFormContent {...props} />;
}

function AuthFormContent({ onComplete }: EnhancedAuthFormProps) {
  // State
  const [isSignUp, setIsSignUp] = useState(true); // Default to Sign Up
  const [user, setUser] = useState<User | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState<ConfirmationResult | null>(null);
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
      /* Define search scope here */
      componentRestrictions: { country: "au" }, // Limit to Australia
    },
    debounce: 300,
  });

  // Sync local address state with autocomplete value
  useEffect(() => {
    setAddress(value);
  }, [value]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Initialize Recaptcha
  useEffect(() => {
    if (!auth || window.recaptchaVerifier) return;
    
    // Only init if we have the container
    if (document.getElementById("recaptcha-container")) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved
          },
        });
      } catch (e) {
        console.error("Recaptcha init error:", e);
      }
    }
  }, [otpSent]);

  // Google Sign In
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

  // Phone Formatting & Validation
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

  // Send OTP
  const handleSendOtp = async () => {
    if (!isValidPhone(phoneNumber)) {
      setError("Please enter a valid Australian mobile number (e.g., 0412 345 678)");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      if (!auth) throw new Error("Auth not initialized");
      
      if (!window.recaptchaVerifier) {
         window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      }

      const formattedNumber = phoneNumber.startsWith("0") 
        ? "+61" + phoneNumber.replace(/\s/g, "").substring(1)
        : phoneNumber;

      const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, window.recaptchaVerifier);
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

  // Verify OTP
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

  // Address Handlers
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
          const results = await getGeocode({ location: { lat: latitude, lng: longitude } });
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

  // Submit Form
  const handleSubmit = () => {
    if (user && isPhoneVerified && onComplete) {
      onComplete({
        user,
        phoneNumber,
        additionalPhone: isSignUp ? additionalPhone : undefined,
        healthNote: isSignUp ? healthNote : undefined,
        address: isSignUp ? address : undefined
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-8 transition-all duration-500 ease-in-out">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-full border border-gray-200">
          <span className={cn("text-sm font-medium px-3 py-1.5 rounded-full transition-all", !isSignUp ? "bg-white shadow-sm text-gray-900" : "text-gray-500")}>
            Sign In
          </span>
          <Switch 
            checked={isSignUp} 
            onCheckedChange={setIsSignUp}
            className="data-[state=checked]:bg-blue-600"
          />
          <span className={cn("text-sm font-medium px-3 py-1.5 rounded-full transition-all", isSignUp ? "bg-white shadow-sm text-gray-900" : "text-gray-500")}>
            Sign Up
          </span>
        </div>
        
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h2>
          <p className="text-sm text-gray-500">
            {isSignUp ? "Please provide your details to register." : "Sign in to access your account."}
          </p>
        </div>
      </div>

      {/* 1. Google Sign In */}
      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
        <Label className="text-base font-semibold flex items-center gap-2">
          1. Google Account <span className="text-red-500">*</span>
          {user && <Check className="w-5 h-5 text-green-500 animate-in zoom-in duration-300" />}
        </Label>
        
        {!user ? (
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full h-12 text-base font-medium transition-all hover:bg-gray-50 hover:border-gray-300"
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
            Sign in with Google
          </Button>
        ) : (
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            {user.photoURL ? (
              <Image 
                src={user.photoURL} 
                alt={user.displayName || "User"} 
                width={40} 
                height={40} 
                className="rounded-full border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold">
                {user.displayName?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <Check className="w-6 h-6 text-green-600" />
          </div>
        )}
      </div>

      {/* 2. Phone Verification */}
      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
        <Label className="text-base font-semibold flex items-center gap-2">
          2. Mobile Number <span className="text-red-500">*</span>
          {isPhoneVerified && <Check className="w-5 h-5 text-green-500 animate-in zoom-in duration-300" />}
        </Label>

        <div className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              type="tel"
              placeholder="0412 345 678"
              value={phoneNumber}
              onChange={handlePhoneChange}
              disabled={isPhoneVerified || (otpSent && !isPhoneVerified)}
              className={cn(
                "pl-10 h-11 text-lg tracking-wide transition-all",
                isPhoneVerified && "border-green-200 bg-green-50 text-green-900"
              )}
            />
            {!isPhoneVerified && !otpSent && phoneNumber.replace(/\s/g, "").length >= 10 && (
              <div className="absolute right-1 top-1 bottom-1">
                <Button 
                  size="sm" 
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="h-full px-4 font-medium animate-in fade-in zoom-in duration-200"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP"}
                </Button>
              </div>
            )}
          </div>

          {/* OTP Input */}
          {otpSent && !isPhoneVerified && (
            <div className="space-y-3 animate-in slide-in-from-top-2 fade-in">
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="pl-10 h-11 text-lg tracking-widest"
                />
                {otp.length === 6 && (
                  <div className="absolute right-1 top-1 bottom-1">
                    <Button 
                      size="sm" 
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="h-full px-4 bg-green-600 hover:bg-green-700 animate-in fade-in zoom-in"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {timer > 0 ? `Resend in ${timer}s` : "Didn't receive code?"}
                </span>
                {timer === 0 && (
                  <button 
                    onClick={handleSendOtp}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Hidden Recaptcha Container */}
          <div id="recaptcha-container"></div>
        </div>
      </div>

      {/* 3. Address Field (Optional) - Only for Sign Up */}
      {isSignUp && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150">
          <Label className="text-base font-semibold flex items-center gap-2 text-gray-700">
            3. Address <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search your address..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={!ready}
              className="pl-10 pr-12 h-11"
            />
            <div className="absolute right-1 top-1 bottom-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCurrentLocation}
                disabled={geoLoading || !ready}
                className="h-full px-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                title="Use current location"
              >
                {geoLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {/* Autocomplete Suggestions */}
            {status === "OK" && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-auto animate-in fade-in slide-in-from-top-1">
                {data.map(({ place_id, description }) => (
                  <li
                    key={place_id}
                    onClick={() => handleAddressSelect(description)}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition-colors"
                  >
                    {description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* 4. Additional Phone (Optional) - Only for Sign Up */}
      {isSignUp && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
          <Label className="text-base font-semibold flex items-center gap-2 text-gray-700">
            4. Alternative Contact <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              type="tel"
              placeholder="0412 345 678"
              value={additionalPhone}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                if (formatted.replace(/\s/g, "").length <= 10) setAdditionalPhone(formatted);
              }}
              className="pl-10 h-11"
            />
          </div>
        </div>
      )}

      {/* 5. Health Note (Optional) - Only for Sign Up */}
      {isSignUp && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-250">
          <Label className="text-base font-semibold flex items-center gap-2 text-gray-700">
            5. Health Conditions <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
          </Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Textarea
              placeholder="Any health conditions we should be aware of?"
              value={healthNote}
              onChange={(e) => setHealthNote(e.target.value)}
              className="pl-10 min-h-[100px] resize-none"
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-600 text-sm animate-in shake">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button 
        onClick={handleSubmit}
        disabled={!user || !isPhoneVerified}
        className={cn(
          "w-full h-12 text-lg font-semibold shadow-lg transition-all duration-300",
          user && isPhoneVerified 
            ? "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-0.5" 
            : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
        )}
      >
        {isSignUp ? "Complete Registration" : "Sign In"}
      </Button>
    </div>
  );
}
