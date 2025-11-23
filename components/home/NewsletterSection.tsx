"use client";

import { Mail, ArrowRight } from 'lucide-react';

export default function NewsletterSection() {
  return (
    <section className="py-20 md:py-32 bg-[#f4f4f4] relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-(--primary)/10 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container max-w-4xl mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-8 text-(--primary) rotate-3">
          <Mail size={32} />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">
          Join Our Mailing List
        </h2>
        <p className="text-gray-600 text-lg mb-12 font-light max-w-xl mx-auto">
          Get <span className="font-bold text-black">10% off</span> your first purchase when you sign up for our newsletter!
        </p>
        
        <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
          <div className="flex-1 relative">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full p-4 pl-6 bg-white border border-gray-200 rounded-full focus:border-black focus:ring-0 outline-none shadow-sm transition-colors"
            />
          </div>
          <button 
            type="submit" 
            className="bg-(--primary) text-black px-8 py-4 rounded-full font-bold hover:bg-black hover:text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            Subscribe
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <p className="text-xs text-gray-400 mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
