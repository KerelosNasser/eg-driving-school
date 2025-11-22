"use client";

import { useState } from "react";
import { EnhancedAuthForm } from "@/components/auth/EnhancedAuthForm";
import { User } from "firebase/auth";
import { CheckCircle2 } from "lucide-react";

export default function AuthTestPage() {
  const [result, setResult] = useState<{
    user: User;
    phoneNumber: string;
    additionalPhone?: string;
    healthNote?: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Authentication Flow</h1>
          <p className="text-lg text-gray-600">
            Test the new enhanced authentication and profile collection form.
          </p>
        </div>

        {!result ? (
          <EnhancedAuthForm onComplete={setResult} />
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-green-100 animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Registration Complete!</h2>
              <p className="text-gray-500">We have successfully captured your details.</p>
            </div>

            <div className="space-y-6 border-t border-gray-100 pt-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Google Account</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">{result.user.displayName}</p>
                  <p className="text-sm text-gray-600">{result.user.email}</p>
                  <p className="text-xs text-gray-400 mt-1 font-mono">{result.user.uid}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Contact Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobile Number:</span>
                    <span className="font-medium text-gray-900">{result.phoneNumber}</span>
                  </div>
                  {result.additionalPhone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Alternative:</span>
                      <span className="font-medium text-gray-900">{result.additionalPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {result.healthNote && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Health Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 italic">&quot;{result.healthNote}&quot;</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => setResult(null)}
                className="w-full py-3 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
