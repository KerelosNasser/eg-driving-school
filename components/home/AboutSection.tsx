'use client';

import EditableText from '@/components/admin/EditableText';
import EditableImage from '@/components/admin/EditableImage';
import { MapPin, Calendar, Car, Award } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-12 md:py-24 bg-[#f4f4f4] relative overflow-hidden">
      {/* Background Pattern - Subtle */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gray-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-(--primary)/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Mobile "About Us" Badge - Visible only on mobile */}
        <div className="md:hidden text-center mb-8">
           <div className="inline-block px-4 py-1.5 rounded-full bg-(--primary)/10 text-(--primary-foreground) text-sm font-bold tracking-wide uppercase">
              About Us
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">
          
          {/* Image Column */}
          <div className="order-1 md:order-1 relative">
            <div className="relative h-[450px] md:h-[550px] w-full rounded-3xl overflow-hidden shadow-2xl transform md:rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white">
               <EditableImage
                 section="about"
                 field="instructorImage"
                 initialSrc="/instructor.png"
                 alt="Instructor Emeal"
                 width={800}
                 height={1000}
                 className="object-cover w-full h-full"
               />
               {/* Mobile Overlay for Name */}
               <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent md:hidden" />
               <div className="absolute bottom-0 left-0 p-6 md:hidden text-white w-full">
                 <h3 className="font-bold text-2xl text-amber-400 mb-1">Emeal</h3>
                 <p className="text-sm opacity-90 font-light flex items-center gap-2">
                    <Award size={16} className="text-(--primary)" />
                    Qualified Instructor
                 </p>
               </div>
            </div>
            
            {/* Desktop Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-(--primary) rounded-full -z-10 hidden md:block opacity-20" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500 rounded-full -z-10 hidden md:block opacity-10" />
          </div>

          {/* Text Column */}
          <div className="order-2 md:order-2 text-center md:text-left">
            {/* Desktop "About Us" Badge - Hidden on mobile */}
            <div className="hidden md:inline-block px-4 py-1.5 rounded-full bg-(--primary)/10 text-(--primary-foreground) text-sm font-bold mb-6 tracking-wide uppercase">
              About Us
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black tracking-tight">
              <EditableText 
                section="about" 
                field="title" 
                initialValue="EG Driving School" 
              />
            </h2>
            
            <h4 className="text-lg md:text-2xl text-gray-700 mb-6 md:mb-8 font-medium leading-snug">
              <EditableText 
                section="about" 
                field="subtitle" 
                initialValue="Expert Driving Instruction in North Brisbane, Moreton Bay, and Redcliffe" 
              />
            </h4>
            
            <div className="text-gray-600 leading-relaxed text-base md:text-lg font-light mb-8 md:mb-10">
              <EditableText 
                section="about" 
                field="description" 
                multiline
                initialValue={`EG Driving School is a trusted driving instruction business serving the North side of Brisbane, QLD area since 2015. \n\nLed by qualified instructor Emeal, we provide personalized lessons to help students of all ages and skill levels become safe, confident drivers.`} 
              />
            </div>

            {/* Features Grid - Mobile Optimized */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
               <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 hover:border-(--primary) transition-colors group text-center md:text-left">
                 <div className="bg-blue-50 p-2 md:p-3 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
                   <Car size={20} className="md:w-6 md:h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">Vehicle</p>
                    <p className="text-xs md:text-sm font-bold text-gray-900">Auto Transmission</p>
                 </div>
               </div>
               
               <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 hover:border-(--primary) transition-colors group text-center md:text-left">
                 <div className="bg-green-50 p-2 md:p-3 rounded-lg text-green-600 group-hover:bg-green-100 transition-colors shrink-0">
                   <MapPin size={20} className="md:w-6 md:h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">Location</p>
                    <p className="text-xs md:text-sm font-bold text-gray-900">North Brisbane</p>
                 </div>
               </div>
               
               <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 hover:border-(--primary) transition-colors group text-center md:text-left">
                 <div className="bg-orange-50 p-2 md:p-3 rounded-lg text-orange-600 group-hover:bg-orange-100 transition-colors shrink-0">
                   <Calendar size={20} className="md:w-6 md:h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">Experience</p>
                    <p className="text-xs md:text-sm font-bold text-gray-900">Since 2015</p>
                 </div>
               </div>
               
               <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 hover:border-(--primary) transition-colors group text-center md:text-left">
                 <div className="bg-purple-50 p-2 md:p-3 rounded-lg text-purple-600 group-hover:bg-purple-100 transition-colors shrink-0">
                   <Award size={20} className="md:w-6 md:h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">Instructor</p>
                    <p className="text-xs md:text-sm font-bold text-gray-900">Qualified & Patient</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
