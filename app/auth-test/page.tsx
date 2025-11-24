"use client";

import { EnhancedAuthForm } from "@/components/auth/EnhancedAuthForm";
import { useState } from "react";
import { User } from "firebase/auth";
import { CheckCircle2, UserCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AuthTestPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [successData, setSuccessData] = useState<{
    user: User;
    phoneNumber: string;
    additionalPhone?: string;
    healthNote?: string;
    address?: string;
  } | null>(null);

  const handleComplete = (data: {
    user: User;
    phoneNumber: string;
    additionalPhone?: string;
    healthNote?: string;
    address?: string;
  }) => {
    setSuccessData(data);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Authentication Test
          </h1>
          <p className="text-gray-500">
            Click the button below to open the authentication dialog.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <UserCircle2 className="mr-2 h-6 w-6" />
              Open Auth Dialog
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
            <div className="sr-only">
              <DialogTitle>Authentication</DialogTitle>
            </div>
            <div className="p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <EnhancedAuthForm onComplete={handleComplete} />
            </div>
          </DialogContent>
        </Dialog>

        {successData && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 space-y-6 animate-in fade-in zoom-in duration-500 text-left mt-8">
            <div className="flex items-center gap-4 text-green-600 border-b border-gray-100 pb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Authentication Successful!
                </h2>
                <p className="text-green-700">
                  User has been verified and data collected.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  User
                </p>
                <p className="font-medium text-gray-900">
                  {successData.user.displayName}
                </p>
                <p className="text-sm text-gray-500">
                  {successData.user.email}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </p>
                <p className="font-medium text-gray-900 font-mono">
                  {successData.phoneNumber}
                </p>
              </div>

              {successData.address && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </p>
                  <p className="font-medium text-gray-900">
                    {successData.address}
                  </p>
                </div>
              )}

              {successData.additionalPhone && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Alternative Contact
                  </p>
                  <p className="font-medium text-gray-900 font-mono">
                    {successData.additionalPhone}
                  </p>
                </div>
              )}

              {successData.healthNote && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Health Conditions
                  </p>
                  <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {successData.healthNote}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setSuccessData(null);
                setIsOpen(true);
              }}
              className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Test Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
