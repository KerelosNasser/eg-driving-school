"use client"

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto font-sans">
      {/* Announcement Banner */}
      <div className="bg-[#f4f4f4] py-12 text-center border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-4 text-black">Announcement</h3>
          <p className="text-gray-600 font-light text-lg">Welcome! Check out my new announcement.</p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold mb-6 text-black">EG Driving school</h4>
            <div className="space-y-2 text-black text-lg font-light mb-8">
              <p>36 South st, Burpengary East, QLD 4505</p>
              <p>
                <a href="tel:0431512095" className="hover:text-[var(--primary)] transition-colors">0431 512 095</a>
              </p>
            </div>
            
            <div>
              <h5 className="font-bold text-lg mb-2 text-black">Hours</h5>
              <div className="text-black font-light">
                <p className="mb-1">Open today</p>
                <p>09:00 am – 07:00 pm</p>
              </div>
            </div>
          </div>
          
          {/* Get in Touch */}
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold mb-6 text-black">Get in Touch!</h4>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed font-light max-w-xs mx-auto md:mx-0">
              This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
            </p>
            <div className="space-y-4">
               <a 
                href="mailto:info@egdrivingschool.com.au" 
                className="inline-block text-black hover:text-[var(--primary)] font-bold underline decoration-2 underline-offset-4 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="py-8 text-center border-t border-gray-100">
        <div className="container mx-auto px-4 space-y-2">
          <p className="text-sm text-gray-500 font-light">
            Copyright © {currentYear} EG Driving school - All Rights Reserved.
          </p>
          <p className="text-xs text-gray-400 font-light">
            Powered by GoDaddy
          </p>
        </div>
      </div>
    </footer>
  );
}


