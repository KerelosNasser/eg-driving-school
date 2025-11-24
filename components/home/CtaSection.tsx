"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CtaSection() {
  const [copied, setCopied] = useState(false);
  const payId = "0431 512 095";

  const handleCopy = () => {
    navigator.clipboard.writeText(payId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-10 md:py-12 bg-[#f4f4f4] border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
          
          {/* Text Content */}
          <div className="text-center md:text-left max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2 tracking-tight">
              Ready to start driving?
            </h2>
            <p className="text-gray-600 font-medium">
              Secure your lesson instantly or make a direct payment.
            </p>
          </div>

          {/* Actions Container */}
          <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
            
            {/* Glowing Button */}
            <a 
              href="https://calendar.app.google/XDUo3y47NbvDSCuS8" 
              className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-black bg-(--primary) rounded-full transition-transform hover:scale-105 active:scale-95 animate-glow w-full md:w-auto"
            >
              Book Now
              {/* Glow effect layer */}
              <span className="absolute inset-0 rounded-full bg-(--primary) blur-lg opacity-50 animate-pulse-glow -z-10"></span>
            </a>

            {/* Compact PayID Pill */}
            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors w-full md:w-auto justify-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">PayID</span>
              
              <div 
                onClick={handleCopy}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <span className="text-lg font-bold text-black group-hover:text-(--primary) transition-colors">
                  {payId}
                </span>
                <button 
                  className="text-gray-400 group-hover:text-black transition-colors"
                  aria-label="Copy PayID"
                >
                  {copied ? <Check size={16} strokeWidth={3} className="text-green-600" /> : <Copy size={16} strokeWidth={2.5} />}
                </button>
              </div>
              
              {/* Tooltip-ish feedback */}
              <div className="absolute -mt-16 bg-black text-white text-xs py-1 px-2 rounded opacity-0 transition-opacity duration-300 pointer-events-none" style={{ opacity: copied ? 1 : 0 }}>
                Copied!
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 214, 0, 0.6); }
          50% { box-shadow: 0 0 40px rgba(255, 214, 0, 0.9); }
        }
        .animate-glow {
          animation: glow-pulse 2s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
