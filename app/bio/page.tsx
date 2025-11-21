import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bio - Driving Instructor Emeal - EG Driving School',
  description: 'Expert driving instruction for all ages and skill levels. Meet Emeal, your qualified driving instructor since 2017.',
};

export default function Bio() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#f4f4f4] py-16 text-center border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-black mb-4">Bio</h1>
        </div>
      </section>

      {/* Bio Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-black mb-8">Get Your License with EG Driving school</h2>
          
          <div className="text-gray-600 font-light leading-relaxed text-lg space-y-6">
            <p>
              Hi, my name is Emeal and I have been a driving instructor since 2017 and am qualified to instruct in both manual and automatic vehicles. 
              The primary focus during our driving lessons is to ensure you learn all the necessary technical and safety skills required to be a responsible driver.
            </p>
            <p>
              I like to take a methodical approach, structuring the lesson in a step-by-step way to ensure that the information flows and makes sense. 
              My experience tells me that it is the best way to get results.
            </p>
            <p>
              I am punctual, patient and friendly. I enjoy meeting new people and can help in a range of situations from brand new learners, 
              to international licence conversions as well as refresher lessons.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
