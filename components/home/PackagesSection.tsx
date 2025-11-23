"use client";

import { Car, Flag, ShieldCheck, Snowflake, RefreshCw, UserCog, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PackagesSection() {
  const packages = [
    { 
      icon: Car,
      title: "Beginner's Package", 
      desc: "Perfect for first-time drivers. Includes 10 hours of in-car training and a comprehensive theory course to build a strong foundation." 
    },
    { 
      icon: Flag,
      title: "Road Test Package", 
      desc: "Designed to help you prepare for your driving test. Includes 5 hours of in-car training and a mock test to ensure you're ready." 
    },
    { 
      icon: ShieldCheck,
      title: "Defensive Driving", 
      desc: "Become a safer, more confident driver. Includes 6 hours of advanced in-car training focusing on hazard perception and safety." 
    },
    { 
      icon: Snowflake,
      title: "Winter Driving", 
      desc: "Master the skills needed to drive safely in adverse conditions. Includes 3 hours of specialized in-car training." 
    },
    { 
      icon: RefreshCw,
      title: "Refresher Course", 
      desc: "Perfect for licensed drivers who haven't driven in a while. Brush up on your skills with 2 hours of targeted training." 
    },
    { 
      icon: UserCog,
      title: "Customized Training", 
      desc: "Every student is unique. We offer tailored training programs designed specifically to meet your individual needs and goals." 
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-(--primary)/10 text-(--primary-foreground) text-sm font-bold mb-6 tracking-wide uppercase">
            Our Courses
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">
            Start Your Driving Journey
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
            Choose the perfect program to help you become a safe and confident driver.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((item, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-(--primary) hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm text-black group-hover:bg-(--primary) group-hover:text-black transition-colors">
                <item.icon size={28} strokeWidth={1.5} />
              </div>
              
              <h4 className="text-2xl font-bold mb-4 text-black group-hover:text-(--primary) transition-colors">
                {item.title}
              </h4>
              
              <p className="text-gray-600 font-light leading-relaxed mb-8 min-h-[80px]">
                {item.desc}
              </p>

              <Link 
                href="/contact" 
                className="inline-flex items-center text-sm font-bold text-black hover:text-(--primary) transition-colors"
              >
                Learn more <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
