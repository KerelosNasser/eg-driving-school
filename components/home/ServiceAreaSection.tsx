"use client";

import { MapPin } from 'lucide-react';

export default function ServiceAreaSection() {
  const suburbs = [
    "Albany Creek, QLD 4035", "Arana Hills, QLD 4054", "Aspley, QLD 4034", "Bald Hills, QLD 4036", 
    "Boondall, QLD 4034", "Bracken Ridge, QLD 4017", "Bray Park, QLD 4500", "Brendale, QLD 4500", 
    "Bridgeman Downs, QLD 4035", "Brighton, QLD 4017", "Bunya, QLD 4055", "Burpengary, QLD 4505", 
    "Burpengary East, QLD 4505", "Caboolture South, QLD 4510", "Carseldine, QLD 4034", "Cashmere, QLD 4500", 
    "Chermside, QLD 4032", "Chermside West, QLD 4032", "Clontarf, QLD 4019", "Dakabin, QLD 4503", 
    "Deagon, QLD 4017", "Deception Bay, QLD 4508", "Eatons Hill, QLD 4037", "Everton Hills, QLD 4053", 
    "Everton Park, QLD 4053", "Ferny Grove, QLD 4055", "Ferny Hills, QLD 4055", "Fitzgibbon, QLD 4018", 
    "Geebung, QLD 4034", "Griffin, QLD 4503", "Joyner, QLD 4500", "Kallangur, QLD 4503", 
    "Kedron, QLD 4031", "Keperra, QLD 4054", "Kippa Ring, QLD 4021", "Kurwongbah, QLD 4503", 
    "Lawnton, QLD 4501", "Mango Hill, QLD 4509", "Margate, QLD 4019", "Mcdowall, QLD 4053", 
    "Mitchelton, QLD 4053", "Morayfield, QLD 4506", "Murrumba Downs, QLD 4503", "Narangba, QLD 4504", 
    "Newport, QLD 4020", "North Lakes, QLD 4509", "Petrie, QLD 4502", "Redcliffe, QLD 4020", 
    "Rothwell, QLD 4022", "Sandgate, QLD 4017", "Scarborough, QLD 4020", "Shorncliffe, QLD 4017", 
    "Stafford Heights, QLD 4053", "Strathpine, QLD 4500", "Taigum, QLD 4018", "Upper Caboolture, QLD 4510", 
    "Upper Kedron, QLD 4055", "Warner, QLD 4500", "Wavell Heights, QLD 4012", "Whiteside, QLD 4503", 
    "Woody Point, QLD 4019", "Zillmere, QLD 4034"
  ];

  return (
    <section className="py-20 md:py-32 bg-[#f4f4f4] relative overflow-hidden">
      {/* Background Map Pattern (Abstract) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
         <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 100 M100 0 L0 100" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
         </svg>
      </div>

      <div className="container max-w-6xl mx-auto px-4 relative z-10">
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
        
        <div className="flex flex-wrap justify-center gap-3">
          {suburbs.map((suburb, index) => (
            <span 
              key={index} 
              className="bg-white px-4 py-2 rounded-full text-sm text-gray-600 shadow-sm border border-gray-100 hover:border-(--primary) hover:text-black transition-colors cursor-default"
            >
              {suburb}
            </span>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm font-light">
            Don't see your suburb? <a href="/contact" className="text-black underline hover:text-(--primary) transition-colors">Contact us</a> to check availability.
          </p>
        </div>
      </div>
    </section>
  );
}
