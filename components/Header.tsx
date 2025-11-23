'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
import EditableText from './admin/EditableText';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main Header - Glassy Black iOS Style */}
      <header 
        className={`w-full font-sans sticky top-0 z-50 transition-all duration-300 border-b border-white/10 bg-[#000000] ${
          isScrolled 
            ? 'md:bg-black/70 md:backdrop-blur-xl md:shadow-lg py-3' 
            : 'md:bg-black/80 md:backdrop-blur-md py-5'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-around items-center relative">
            
            {/* Logo Area (Left) */}
            <Link href="/" className="flex items-center gap-6 group z-20">
              <div className="bg-[var(--primary)] text-black font-black text-xl w-10 h-10 flex items-center justify-center rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                EG
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold text-white tracking-tight group-hover:text-[var(--primary)] transition-colors">Driving School</span>
              </div>
            </Link>

            {/* Desktop Navigation (Centered) */}
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Link 
                href="/" 
                className="text-white/90 hover:text-[var(--primary)] text-[15px] font-medium transition-colors tracking-wide"
              >
                Home
              </Link>
              
              <div className="relative group">
                <button className="text-white/90 hover:text-[var(--primary)] text-[15px] font-medium transition-colors flex items-center gap-1 tracking-wide">
                  Info <ChevronDown className="w-3 h-3 opacity-70" />
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-6 hidden group-hover:block">
                  <div className="bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl min-w-[240px] py-2 overflow-hidden">
                    <Link 
                      href="/terms-and-conditions" 
                      className="block px-6 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      Terms and Conditions
                    </Link>
                    <Link 
                      href="/driving-education-rules" 
                      className="block px-6 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      Driving Education Rules
                    </Link>
                  </div>
                </div>
              </div>

              <Link 
                href="/bio" 
                className="text-white/90 hover:text-[var(--primary)] text-[15px] font-medium transition-colors tracking-wide"
              >
                Bio
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-6 z-20">
              <a 
                href="tel:0431512095" 
                className="flex items-center gap-2 text-white/90 hover:text-[var(--primary)] transition-colors text-sm font-medium"
              >
                <Phone className="w-4 h-4" />
                <EditableText 
                  section="header" 
                  field="phoneNumber" 
                  initialValue="0431 512 095" 
                />
              </a>
              
              <a 
                href="https://calendar.app.google/XDUo3y47NbvDSCuS8" 
                className="bg-[var(--primary)] text-black px-5 py-2 text-sm font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,214,0,0.3)]"
              >
                Book Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors z-20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-xl z-10 transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          style={{ top: '0', paddingTop: '100px' }}
        >
          <div className="container mx-auto px-4 flex flex-col space-y-8 text-center">
            <Link 
              href="/" 
              className="text-2xl font-bold text-white hover:text-[var(--primary)]"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/terms-and-conditions" 
              className="text-xl font-medium text-gray-300 hover:text-[var(--primary)]"
              onClick={() => setIsMenuOpen(false)}
            >
              Terms & Conditions
            </Link>
            <Link 
              href="/driving-education-rules" 
              className="text-xl font-medium text-gray-300 hover:text-[var(--primary)]"
              onClick={() => setIsMenuOpen(false)}
            >
              Driving Rules
            </Link>
            <Link 
              href="/bio" 
              className="text-xl font-medium text-gray-300 hover:text-[var(--primary)]"
              onClick={() => setIsMenuOpen(false)}
            >
              Bio
            </Link>
            
            <div className="pt-8 flex flex-col items-center gap-6">
              <a 
                href="tel:0431512095" 
                className="flex items-center gap-2 text-white hover:text-[var(--primary)] transition-colors text-lg"
              >
                <Phone className="w-5 h-5" />
                <span>0431 512 095</span>
              </a>
              
              <a 
                href="https://calendar.app.google/XDUo3y47NbvDSCuS8" 
                className="inline-block bg-[var(--primary)] text-black px-10 py-4 text-lg font-bold rounded-full shadow-[0_0_20px_rgba(255,214,0,0.4)]"
              >
                Book a Lesson
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

