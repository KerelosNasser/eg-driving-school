"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Define the package type for future database integration
interface DrivingPackage {
  id: string;
  name: string;
  price: number;
  hours: number;
  isTestPackage?: boolean;
  description?: string;
  warning?: string;
}

// Static data for now, will be replaced by DB data later
const PACKAGES: DrivingPackage[] = [
  { id: "1hr", name: "One hour Driving lesson", price: 75, hours: 1 },
  { id: "2hr", name: "2 hours block driving lesson", price: 145, hours: 2 },
  { id: "3hr", name: "3 hours driving lesson", price: 215, hours: 3 },
  { id: "5hr", name: "5 hours driving lesson", price: 350, hours: 5 },
  { id: "6hr", name: "6 hours driving lesson", price: 420, hours: 6 },
  { id: "10hr", name: "10 hours driving lesson", price: 690, hours: 10 },
  { 
    id: "test", 
    name: "Driving test package", 
    price: 200, 
    hours: 0, 
    isTestPackage: true,
    description: "Includes pick-up 1hr prior to test start time, 45 min pre-test warm up, use of instructor's vehicle for the test, and drop-off after the test result is received.",
    warning: "NOTE: THIS PACKAGE DOES NOT INCLUDE THE TMR TEST BOOKING FEE. YOU MUST BOOK THE TEST YOURSELF WITH TMR."
  }
];

export default function PriceListSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6 text-black">Menu / Price List</h2>
        <h3 className="text-2xl font-bold text-center text-black mb-8">First Category</h3>
        <p className="text-center text-gray-500 mb-12 font-light">Add a description about this category</p>
        
        {/* Grid View for All Screens */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {PACKAGES.map((pkg) => (
            <div 
              key={pkg.id} 
              className="flex flex-col p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-black transition-all duration-300 h-full hover:shadow-md"
            >
              <div className="mb-4 w-full flex-grow">
                <h4 className="text-black text-lg font-medium mb-2 leading-tight">{pkg.name}</h4>
                <div className="text-2xl font-bold text-black mb-3">${pkg.price}</div>
                
                {/* Description */}
                {pkg.description && (
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">
                    {pkg.description}
                  </p>
                )}

                {/* Warning Note */}
                {pkg.warning && (
                  <div className="mt-2 p-2.5 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-red-600 text-[10px] font-bold uppercase leading-tight tracking-wide">
                      {pkg.warning}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-auto pt-2">
                <Link
                  href={`/book?package=${pkg.id}`}
                  className="w-full bg-black text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
                >
                  Book Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 md:mt-16 p-8 md:p-10 bg-[#f4f4f4] rounded-xl max-w-4xl mx-auto">
          <p className="text-gray-600 mb-6 text-sm leading-relaxed font-light">
            Pick-up 1hr prior to test start time. 45 min pre-test warm up. Use of instructors vehicle to sit the test. Drop-off after the test result is received.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed font-light">
            Booking the driving Test with the Queensland transport and main roads (TMR) responsibility for booking the driving test by applicants
          </p>
        </div>
        
        <p className="text-center text-gray-400 mt-10 text-xs font-light">Prices are subject to change without notice.</p>
      </div>
    </section>
  );
}
