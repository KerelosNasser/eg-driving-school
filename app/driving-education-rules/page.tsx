import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driving Education Rules - Achieve Driving - EG Driving School',
  description: 'Expert driving instruction for all ages and skill levels. Learn about our driving education rules and approach.',
};

export default function DrivingEducationRules() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#f4f4f4] py-16 text-center border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-black mb-4">Driving Education Rules</h1>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div key={item} className="aspect-video bg-black flex items-center justify-center">
                <span className="text-white font-bold">Video</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 bg-[#f4f4f4]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mb-16">
            <h4 className="text-2xl font-bold text-black mb-4">Grab interest</h4>
            <p className="text-gray-600 font-light">Say something interesting about your business here.</p>
          </div>
          
          <div>
            <h4 className="text-2xl font-bold text-black mb-4">Generate excitement</h4>
            <p className="text-gray-600 font-light">What's something exciting your business offers? Say it here.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
