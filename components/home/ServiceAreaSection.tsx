"use client";

import { useState } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useLoadScript } from "@react-google-maps/api";
import ServiceAreaMap from './ServiceAreaMap';
import { serviceAreas } from '@/lib/data/service-areas';

const libraries: ("places")[] = ["places"];

export default function ServiceAreaSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const filteredAreas = serviceAreas.filter(area => 
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    area.postcode.includes(searchTerm)
  );

  return (
    <section className="py-20 md:py-32 bg-[#f4f4f4] relative overflow-hidden">
      {/* Background Map Pattern (Abstract) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-6 text-(--primary)">
            <MapPin size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">
            Areas We Serve
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
            Proudly serving North Brisbane, Moreton Bay, and Redcliffe areas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Search & List */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 h-[600px] flex flex-col">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                type="text" 
                placeholder="Search suburb or postcode..." 
                className="pl-12 h-12 text-lg bg-gray-50 border-gray-200 focus:bg-white transition-all rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {filteredAreas.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredAreas.map((area) => (
                    <div 
                      key={`${area.name}-${area.postcode}`}
                      className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                      onMouseEnter={() => setHoveredArea(area.name)}
                      onMouseLeave={() => setHoveredArea(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                          <MapPin size={14} />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                          {area.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-gray-400 group-hover:text-blue-400 transition-colors">
                        {area.postcode}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <MapPin size={48} className="mb-4 opacity-20" />
                  <p>No areas found matching &quot;{searchTerm}&quot;</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm font-light">
                Don&apos;t see your suburb? <a href="/contact" className="text-black underline hover:text-blue-600 transition-colors">Contact us</a> to check availability.
              </p>
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="h-[600px] rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative bg-gray-200">
            {isLoaded ? (
              <ServiceAreaMap areas={serviceAreas} highlightedArea={hoveredArea} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
