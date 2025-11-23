"use client";

import { MapPin, Phone, Clock, Send } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-(--primary)/10 text-(--primary-foreground) text-sm font-bold mb-6 tracking-wide uppercase">
            Contact Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">
            Get in Touch
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
            Have questions? We're here to help you start your driving journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <div className="space-y-10">
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h4 className="text-2xl font-bold mb-8 text-black">Contact Info</h4>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-(--primary) shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                    <p className="text-lg text-black font-medium">36 South st, Burpengary East, QLD 4505</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-(--primary) shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                    <a href="tel:0431512095" className="text-lg text-black font-medium hover:text-(--primary) transition-colors">
                      0431 512 095
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-(--primary) shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Hours</p>
                    <p className="text-lg text-black font-medium">09:00 am – 07:00 pm</p>
                    <p className="text-sm text-green-600 font-medium mt-1">Open today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
            <h4 className="text-2xl font-bold mb-2 text-black">Send a Message</h4>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              We'll get back to you as soon as possible.
            </p>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Name</label>
                  <input 
                    type="text" 
                    placeholder="Your name" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                <textarea 
                  placeholder="How can we help you?" 
                  rows={4}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none resize-none transition-colors"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
              >
                Send Message
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-xs text-gray-400 text-center mt-4">
                This site is protected by reCAPTCHA and the Google Privacy Policy apply.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
