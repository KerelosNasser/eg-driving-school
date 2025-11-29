"use client";

import React, { useState } from "react";
import QuickBookWizard from "../booking/QuickBookWizard";

export default function CalendarSection() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <section
      id="calendar"
      className="py-16 bg-linear-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Driving Lesson
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Click below to start your quick booking process
          </p>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Quick Book Now
          </button>
        </div>
      </div>

      <QuickBookWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </section>
  );
}
