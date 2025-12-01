"use client";

import { useState } from "react";
import EditableText from "@/components/admin/EditableText";
import EditableImage from "@/components/admin/EditableImage";
import QuickBookWizard from "@/components/booking/QuickBookWizard";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <EditableImage
          section="home"
          field="heroBackground"
          initialSrc="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
          alt="Driving School Hero"
          width={2070}
          height={1380}
          className="object-cover w-full h-full"
          priority
        />
        {/* Simple, clean overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Main Content */}
      <div className="container relative z-10 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1
            className="text-white font-bold tracking-tight leading-tight drop-shadow-lg"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            <EditableText
              section="home"
              field="heroTitle"
              initialValue="Learn to Drive Safely and Confidently"
            />
          </h1>

          <p className="text-white text-lg md:text-2xl font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            <EditableText
              section="home"
              field="heroSubtitle"
              initialValue="Expert driving instruction for all ages and skill levels. Start your journey today."
            />
          </p>

          <div className="pt-4">
            <Button
              onClick={() => setIsWizardOpen(true)}
              size="lg"
              className="bg-[#ffd600] text-black hover:bg-[#e6c200] px-10 py-7 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Book a Lesson
            </Button>
          </div>
        </div>
      </div>

      <QuickBookWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </section>
  );
}
