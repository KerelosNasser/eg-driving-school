"use client";

import React, { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { WizardButton } from "../ui/WizardButton";

interface SuccessStepProps {
  onClose: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [confettiPieces] = useState(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      left: `${(i * 5) % 100}%`,
      delay: `${(i * 0.1) % 0.5}s`,
      duration: `${2 + ((i * 0.2) % 2)}s`,
      opacity: 0.6 + ((i * 0.1) % 0.4),
    }))
  );

  useEffect(() => {
    // Trigger animations
    const timer1 = setTimeout(() => setShowConfetti(true), 100);
    const timer2 = setTimeout(() => setShowContent(true), 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative text-center space-y-6 py-8 animate-in fade-in zoom-in-95 duration-700">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confettiPieces.map((piece, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: piece.left,
                top: "-10%",
                animationDelay: piece.delay,
                animationDuration: piece.duration,
              }}
            >
              <Sparkles
                size={16}
                className="text-(--primary)"
                style={{
                  opacity: piece.opacity,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Success Icon */}
      <div className="relative inline-block">
        <div className="w-24 h-24 bg-linear-to-br from-(--primary) to-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-in zoom-in-50 duration-500">
          <Check size={48} className="text-black" strokeWidth={3} />
        </div>
        {/* Pulsing ring */}
        <div className="absolute inset-0 w-24 h-24 bg-(--primary) rounded-full opacity-20 animate-ping" />
      </div>

      {/* Success Message */}
      {showContent && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Booking Confirmed! 🎉
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
              Your booking request has been submitted successfully. You&apos;ll
              receive a confirmation email once it&apos;s been reviewed and
              approved.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 max-w-md mx-auto mt-6">
            <p className="text-sm text-blue-900 font-medium">
              📧 Check your email for booking details
            </p>
            <p className="text-xs text-blue-700 mt-2">
              We&apos;ll notify you as soon as your lesson is confirmed
            </p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <WizardButton
          onClick={onClose}
          className="px-12 py-6 text-lg"
          size="lg"
        >
          Done
        </WizardButton>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
};
