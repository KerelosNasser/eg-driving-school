import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Bio - Driving Instructor Emeal - EG Driving School',
  description: 'Expert driving instruction for all ages and skill levels. Meet Emeal, your qualified driving instructor since 2017.',
};

export default function Bio() {
  return (
    <div className="bg-white min-h-screen">
      {/* Bio Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
            {/* Image Column (Left) */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative aspect-4/5 w-full max-w-md mx-auto lg:mx-0">
                <div className="absolute inset-0 bg-yellow-400 rounded-2xl transform translate-x-4 translate-y-4"></div>
                <Image 
                  src="/instructor.png" 
                  alt="Emeal - Driving Instructor" 
                  fill
                  className="object-cover rounded-2xl shadow-xl bg-gray-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </div>

            {/* Text Column (Right) */}
            <div className="w-full lg:w-1/2 text-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
                Get Your License with <span className="text-yellow-500">EG Driving School</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-light">
                <p>
                  Hi, my name is <span className="font-semibold text-gray-900">Emeal</span>. I have been a driving instructor since 2017 and am qualified to instruct in both <span className="font-semibold text-gray-900">manual and automatic</span> vehicles.
                </p>
                <p>
                  The primary focus during our driving lessons is to ensure you learn all the necessary technical and safety skills required to be a responsible driver.
                </p>
                <p>
                  I like to take a methodical approach, structuring the lesson in a step-by-step way to ensure that the information flows and makes sense. My experience tells me that it is the best way to get results.
                </p>
                <p>
                  I am <span className="font-semibold text-gray-900">punctual, patient, and friendly</span>. I enjoy meeting new people and can help in a range of situations from brand new learners to international license conversions as well as refresher lessons.
                </p>
              </div>

              <div className="mt-10">
                <div className="inline-flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-gray-900">7+ Years</span>
                    <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Experience</span>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-gray-900">Auto & Manual</span>
                    <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Qualified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
