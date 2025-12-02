"use client";

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Copy, Check, ArrowRight } from 'lucide-react';
import QuickBookWizard from '@/components/booking/QuickBookWizard';

export default function PaymentSection() {
  const [copied, setCopied] = useState(false);
  const payId = "0431512095";

    const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(payId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-(--primary)/5 rounded-full blur-3xl" />
        <div className="absolute top-[40%] -left-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">
              Ready to Start <br/>
              <span className="text-(--primary)">Driving?</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 font-light leading-relaxed max-w-xl mx-auto md:mx-0">
              Secure your spot today. We offer flexible payment options including PayID for a seamless booking experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => setIsWizardOpen(true)}
              className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-(--primary) rounded-full transition-transform hover:scale-105 active:scale-95 animate-glow w-full md:w-auto"
            >
              Book Now
              {/* Glow effect layer */}
              <span className="absolute inset-0 rounded-full bg-(--primary) blur-lg opacity-50 animate-pulse-glow -z-10"></span>
            </button>
              <Link 
                href="/pricing" 
                className="inline-flex items-center justify-center bg-white text-black border-2 border-gray-100 px-8 py-4 text-lg font-bold rounded-full hover:border-black transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Payment Card */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 relative">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <CreditCard size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-(--primary)/10 rounded-2xl flex items-center justify-center mb-6 text-(--primary)">
                  <CreditCard className="w-6 h-6 text-black" />
                </div>
                
                <h4 className="text-2xl font-bold mb-2 text-black">Quick Payment</h4>
                <p className="text-gray-500 mb-8 text-sm">Use PayID for instant confirmation</p>
                
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6 group hover:border-(--primary) transition-colors cursor-pointer" onClick={handleCopy}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">PayID Number</span>
                    <span className="text-xs text-(--primary) font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {copied ? 'Copied!' : 'Click to copy'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="text-xl font-mono font-bold text-black">{payId}</code>
                    <button 
                      className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-black"
                      aria-label="Copy PayID"
                    >
                      {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3" />
                    Instant processing
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3" />
                    Secure transaction
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3" />
                    No hidden fees
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <QuickBookWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </section>
  );
}
