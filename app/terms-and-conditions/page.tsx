'use client';

import { FileText, Pen } from 'lucide-react';
import { useState } from 'react';

// Note: metadata export needs to be in a separate server component in production
// For now, keeping it here for compatibility

const contractClauses = [
  {
    number: "1",
    title: "ELIGIBILITY & ENROLLMENT",
    content: [
      "1.1 The Student must be at least sixteen (16) years of age, in accordance with Queensland learner license laws.",
      "1.2 The Student must hold a valid Queensland learner license (Learner Permit) at all times during instruction.",
      "1.3 Students under the age of eighteen (18) require written consent from a parent or legal guardian.",
      "1.4 The Student agrees to present the following documents: Learner License, proof of age, and logbook (if applicable)."
    ]
  },
  {
    number: "2",
    title: "BOOKINGS & PAYMENT TERMS",
    content: [
      "2.1 Payment may be made via Cash, Bank Transfer, or Credit/Debit Card.",
      "2.2 All lesson fees must be paid in advance unless otherwise arranged in writing with EG Driving School.",
      "2.3 No refunds shall be issued for missed lessons without forty-eight (48) hours' notice.",
      "2.4 A late cancellation fee equivalent to the full lesson fee shall apply if cancelled within forty-eight (48) hours of the scheduled time."
    ]
  },
  {
    number: "3",
    title: "CANCELLATION & RESCHEDULING",
    content: [
      "3.1 Forty-eight (48) hours' notice is required for any changes to scheduled lessons.",
      "3.2 Late arrivals of fifteen (15) minutes or more may result in shortened lesson time without refund.",
      "3.3 EG Driving School reserves the right to reschedule lessons due to weather conditions or safety concerns."
    ]
  },
  {
    number: "4",
    title: "STUDENT RESPONSIBILITIES",
    content: [
      "4.1 The Student must bring their valid Learner License to every lesson.",
      "4.2 The Student must not be under the influence of alcohol or drugs before or during any lesson.",
      "4.3 Mobile phone use while operating the vehicle is strictly prohibited.",
      "4.4 The Student agrees to follow all instructor directions at all times.",
      "4.5 The Student shall be liable for any traffic fines incurred during lessons."
    ]
  },
  {
    number: "5",
    title: "PROVIDER RESPONSIBILITIES",
    content: [
      "5.1 EG Driving School employs Queensland-approved driving instructors.",
      "5.2 All training vehicles are dual-controlled and fully insured.",
      "5.3 Q-SAFE test preparation and logbook guidance shall be provided where applicable."
    ]
  },
  {
    number: "6",
    title: "SAFETY & CONDUCT POLICY",
    content: [
      "6.1 Dangerous driving behavior will result in immediate cessation of the lesson without refund.",
      "6.2 Repeated misconduct may result in permanent expulsion from the program."
    ]
  },
  {
    number: "7",
    title: "LIABILITY & INSURANCE",
    content: [
      "7.1 All training vehicles are covered by comprehensive insurance.",
      "7.2 The Student shall be liable for damage to the vehicle resulting from negligence.",
      "7.3 EG Driving School is not responsible for lost or stolen personal items."
    ]
  },
  {
    number: "8",
    title: "QUEENSLAND DRIVING TESTS",
    content: [
      "8.1 Test bookings are subject to Queensland Transport availability.",
      "8.2 EG Driving School does not guarantee test success; results depend on Student performance.",
      "8.3 Vehicle hire for practical tests is available upon request."
    ]
  },
  {
    number: "9",
    title: "GENERAL PROVISIONS",
    content: [
      "9.1 This agreement complies with all Queensland road rules and licensing laws.",
      "9.2 Changes to these terms will be communicated via email or the official website.",
      "9.3 This agreement is governed by the laws of Queensland, Australia.",
      "9.4 By signing below, the Student acknowledges that they have read, understood, and agree to be bound by these Terms and Conditions."
    ]
  }
];

export default function TermsAndConditionsPage() {
  const [agreed, setAgreed] = useState(false);
  const currentDate = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 via-gray-50 to-amber-50 py-8 px-4">
      {/* Contract Document */}
      <div className="max-w-6xl mx-auto">
        {/* Paper Effect Container */}
        <div className="bg-white shadow-2xl border-8 border-double border-gray-300 relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
            <FileText className="w-96 h-96" />
          </div>

          {/* Header */}
          <div className="border-b-4 border-yellow-400 bg-linear-to-r from-black via-gray-900 to-black text-white py-6 px-6 md:px-8">
            <div className="text-center">
              <h1 className="text-2xl md:text-4xl text-amber-200 font-black tracking-wider mb-2">
                EG DRIVING SCHOOL
              </h1>
              <div className="h-0.5 w-24 bg-yellow-400 mx-auto mb-3"></div>
              <p className="text-xs md:text-sm text-gray-300 uppercase tracking-[0.2em] font-semibold">
                Student Enrollment Agreement
              </p>
            </div>
          </div>

          {/* Preamble */}
          <div className="px-6 md:px-8 py-4 border-b border-gray-200 bg-gray-50">
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed text-justify italic font-medium">
              This Agreement is entered into between <strong className="text-gray-900 not-italic">EG Driving School</strong> (hereinafter referred to as &ldquo;the Provider&rdquo;) 
              and the student (hereinafter referred to as &ldquo;the Student&rdquo;). By enrolling in driving lessons, the Student acknowledges 
              and agrees to comply with the following terms and conditions:
            </p>
          </div>

          {/* Contract Clauses - 2 Column Grid */}
          <div className="px-6 md:px-8 py-6">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {contractClauses.map((clause) => (
                <div key={clause.number} className="border-l-3 border-yellow-400 pl-3 md:pl-4 py-2">
                  <h2 className="text-sm md:text-base font-black text-gray-900 mb-2 uppercase tracking-wide leading-tight">
                    Art. {clause.number}: {clause.title}
                  </h2>
                  <div className="space-y-1.5">
                    {clause.content.map((item, idx) => (
                      <p key={idx} className="text-gray-700 text-[10px] md:text-xs leading-relaxed text-justify font-medium">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Footer */}
          <div className="bg-gray-900 text-white py-4 px-6 md:px-8 text-center">
            <p className="text-xs md:text-sm text-gray-400 font-semibold">
              © {new Date().getFullYear()} EG Driving School. All Rights Reserved.
            </p>
            <p className="text-[10px] text-gray-500 mt-1 font-medium">
              For inquiries, please contact us through our official channels.
            </p>
          </div>
        </div>

        {/* Download Note */}
        <div className="mt-4 text-center text-xs text-gray-600 font-medium">
          <p>This document should be reviewed carefully before enrollment.</p>
          <p className="mt-1">Keep a copy for your records.</p>
        </div>
      </div>
    </div>
  );
}
