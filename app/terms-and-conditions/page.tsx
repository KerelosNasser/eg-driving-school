import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions - Driving School - EG Driving School',
  description: 'Expert driving instruction for all ages and skill levels. Read our terms and conditions for lessons and bookings.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
            Terms and Conditions
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Section 1 */}
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">**1. Eligibility & Enrollment**</h3>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>✅ <strong>Minimum Age:</strong> Students must be <strong>at least 16 years old</strong> (as per QLD learner license laws).</li>
              <li>✅ <strong>License Requirement:</strong> Must hold a <strong>valid Queensland learner license (Learner Permit)</strong>.</li>
              <li>✅ <strong>Under 18s:</strong> Parent/guardian consent is required for minors.</li>
              <li>✅ <strong>Documents Needed:</strong> Learner License, proof of age, and <strong>logbook (if applicable)</strong>.</li>
            </ul>

            {/* Section 2 */}
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">**2. Bookings & Payments**</h3>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>💳 <strong>Payment Methods:</strong> Cash, Bank Transfer, Credit/Debit Card.</li>
              <li>💰 <strong>Lesson Fees:</strong> Must be paid <strong>in advance</strong> unless otherwise arranged.</li>
              <li>❌ <strong>No Refunds</strong> for missed lessons without <strong>48 hours' notice</strong>.</li>
              <li>⚠️ <strong>Late Cancellation Fee:</strong> $[75] if cancelled within *48 hours**.</li>
            </ul>

            {/* Section 3 */}
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">**3. Cancellation & Rescheduling**</h3>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>🔄 <strong>48-Hour Notice Required</strong> for changes.</li>
              <li>⏰ <strong>Late Arrivals:</strong> If late by <strong>15+ minutes</strong>, lesson may be shortened (no refund).</li>
              <li>🌧️ <strong>Weather/Instructor Cancellations:</strong> EG Driving School may reschedule due to safety concerns.</li>
            </ul>

            {/* Section 4 */}
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">**4. Student Responsibilities**</h3>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>🚗 <strong>Bring Learner License to every lesson.</strong></li>
              <li>🚫 <strong>No alcohol/drugs before or during lessons.</strong></li>
              <li>📵 <strong>No mobile phone use while driving.</strong></li>
              <li>🚦 <strong>Follow instructor's directions at all times.</strong></li>
              <li>💸 <strong>Student liable for any traffic fines during lessons.</strong></li>
            </ul>

            {/* Section 5 */}
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">**5. EG Driving School's Responsibilities**</h3>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>✔️ <strong>QLD-approved instructors.</strong></li>
              <li>✔️ <strong>Dual-controlled, fully insured training cars.</strong></li>
              <li>✔️ <strong>Q-SAFE test preparation & logbook guidance (if applicable).</strong></li>
            </ul>

            {/* Section 6 */}
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">**6. Safety & Behavior Policy**</h3>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>🛑 <strong>Dangerous driving = Immediate lesson stop (no refund).</strong></li>
              <li>🔴 <strong>Repeated misconduct = Expulsion from the course.</strong></li>
            </ul>

            {/* Section 7 */}
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">**7. Liability & Insurance**</h3>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>🔐 <strong>Comprehensive insurance on all training vehicles.</strong></li>
              <li>⚠️ <strong>Students liable for damage due to negligence.</strong></li>
              <li>📱 <strong>Not responsible for lost/stolen items.</strong></li>
            </ul>

            {/* Section 8 */}
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">**8. QLD Driving Tests**</h3>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>📅 <strong>Test bookings subject to QLD Transport availability.</strong></li>
              <li>❌ <strong>No pass guarantee – depends on student performance.</strong></li>
              <li>🚘 <strong>Car hire for test available (if needed).</strong></li>
            </ul>

            {/* Section 9 */}
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">**9. General Policies**</h3>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>📜 <strong>Complies with QLD road rules & licensing laws.</strong></li>
              <li>✉️ <strong>Changes to terms will be notified via email/website.</strong></li>
              <li>⚖️ <strong>Disputes governed by Queensland law.</strong></li>
              <li>- you agree to abide by these terms and conditions.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
