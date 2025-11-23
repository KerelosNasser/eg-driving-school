"use client";

import { EnhancedAuthForm } from "@/components/auth/EnhancedAuthForm";
import { useState } from "react";
import { User } from "firebase/auth";
import { CheckCircle2 } from "lucide-react";

export default function AuthTestPage() {
  const [successData, setSuccessData] = useState<{
    user: User;
    phoneNumber: string;
    additionalPhone?: string;
    healthNote?: string;
    address?: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Authentication Test</h1>
          <p className="text-gray-500">
            Testing the new EnhancedAuthForm component with Google & Phone Auth.
          </p>
        </div>

        {!successData ? (
          <EnhancedAuthForm onComplete={setSuccessData} />
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center gap-4 text-green-600 border-b border-gray-100 pb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Authentication Successful!</h2>
                <p className="text-green-700">User has been verified and data collected.</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">User</p>
                <p className="font-medium text-gray-900">{successData.user.displayName}</p>
                <p className="text-sm text-gray-500">{successData.user.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Phone Number</p>
                <p className="font-medium text-gray-900 font-mono">{successData.phoneNumber}</p>
              </div>

              {successData.address && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Address</p>
                  <p className="font-medium text-gray-900">{successData.address}</p>
                </div>
              )}

              {successData.additionalPhone && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Alternative Contact</p>
                  <p className="font-medium text-gray-900 font-mono">{successData.additionalPhone}</p>
                </div>
              )}

              {successData.healthNote && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Health Conditions</p>
                  <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {successData.healthNote}
                  </p>
                </div>
              )}
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Reset Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
