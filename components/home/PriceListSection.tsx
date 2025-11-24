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
      <div className="container max-w-5xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6 text-black">Menu / Price List</h2>
        <h3 className="text-2xl font-bold text-center text-black mb-8">First Category</h3>
        <p className="text-center text-gray-500 mb-16 font-light">Add a description about this category</p>
        
        {/* Grid View: 2 columns, minimal design with separators */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:gap-x-12 md:gap-y-16">
          {PACKAGES.map((pkg) => (
            <div 
              key={pkg.id} 
              className="flex flex-col border-b border-gray-200 pb-8 md:pb-10"
            >
              <div className="mb-4 grow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                  <h4 className="text-black text-lg md:text-xl font-medium leading-tight">{pkg.name}</h4>
                  <div className="text-xl md:text-2xl font-bold text-black">${pkg.price}</div>
                </div>
                
                {/* Description */}
                {pkg.description && (
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-4 font-light">
                    {pkg.description}
                  </p>
                )}

                {/* Warning Note */}
                {pkg.warning && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-red-600 text-[10px] md:text-xs font-bold uppercase leading-tight tracking-wide">
                      {pkg.warning}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                <Link
                  href={`/book?package=${pkg.id}`}
                  className="w-full md:w-auto inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors gap-2 group"
                >
                  Book Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        </div>
        <p className="text-center text-gray-400 mt-12 text-xs font-light">Prices are subject to change without notice.</p>
    </section>
  );
}
