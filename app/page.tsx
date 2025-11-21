import Image from 'next/image';

export default function HomePage() {
  // Generate array for student images (1-23)
  const studentImages = Array.from({ length: 23 }, (_, i) => i + 1);

  return (
    <div className="bg-white font-sans">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop)' }}>
        <div className="container text-center relative z-10 px-4">
          <h1 className="text-white font-bold mb-6 leading-tight max-w-5xl mx-auto" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Learn to Drive Safely and Confidently
          </h1>
          <p className="text-white text-xl md:text-2xl mb-10 font-light max-w-3xl mx-auto">
            Expert driving instruction for all ages and skill levels
          </p>
          <a 
            href="https://calendar.app.google/XDUo3y47NbvDSCuS8" 
            className="inline-block bg-[var(--primary)] text-[var(--primary-foreground)] px-12 py-4 text-lg hover:opacity-90 transition-opacity font-bold tracking-wide"
          >
            Book a lesson
          </a>
        </div>
      </section>

      {/* Book Now - Payment Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-black">Book Now</h2>
          <div className="bg-[#f4f4f4] p-16 shadow-sm">
            <h4 className="text-xl font-bold mb-6 text-black">payment</h4>
            <p className="text-gray-600 text-lg mb-8 font-light">
              Payment through pay ID (0431512095)
            </p>
            <a href="/" className="text-blue-600 hover:underline text-sm font-medium">
              Find out more
            </a>
          </div>
        </div>
      </section>

      {/* EG Driving School Section (About) */}
      <section className="py-16 md:py-24 bg-[#f4f4f4]">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative h-[500px] w-full">
                <Image 
                  src="/instructor.png" 
                  alt="Instructor Emeal" 
                  fill
                  className="object-cover rounded-sm"
                />
              </div>
            </div>
            <div className="text-center md:text-left order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-8 text-black">EG Driving School</h2>
              <h4 className="text-xl text-black mb-10 font-normal">
                Expert Driving Instruction in North Brisbane, Moreton bay, and Redcliffe (Auto Transmission)
              </h4>
              <p className="text-gray-600 leading-relaxed text-lg font-light">
                EG Driving School is a trusted driving instruction business serving the North side of Brisbane, QLD area since 2015. 
                Led by qualified instructor Emeal, we provide personalized lessons to help students of all ages and skill levels 
                become safe, confident drivers. Whether you're a first-time learner or looking to improve your skills, our tailored 
                approach ensures you reach your driving goals efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu / Price List */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6 text-black">Menu / Price List</h2>
          <h3 className="text-2xl font-bold text-center text-black mb-8">First Category</h3>
          <p className="text-center text-gray-500 mb-16 font-light">Add a description about this category</p>
          
          <div className="space-y-8">
            {[
              { name: "One hours Driving lesson", price: "$75" },
              { name: "1.5 hours block driving lesson", price: "$105" },
              { name: "2 hours block driving lesson", price: "$145" },
              { name: "3 hours driving lesson", price: "$215" },
              { name: "5 hours driving lesson", price: "$350" },
              { name: "6 hours driving lesson", price: "$420" },
              { name: "10 hours driving lesson", price: "$690" },
              { name: "Driving test package", price: "$200" }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-baseline border-b border-gray-200 pb-4 hover:border-gray-400 transition-colors">
                <span className="text-black text-lg font-light">{item.name}</span>
                <span className="font-bold text-black text-lg">{item.price}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-16 p-10 bg-[#f4f4f4]">
            <p className="text-gray-600 mb-6 text-sm leading-relaxed font-light">
              Pick-up 1hr prior to test start time. 45 min pre-test warm up. Use of instructors vehicle to sit the test. Drop-off after the test result is received.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed font-light">
              Booking the driving Test with the Queensland transport and main roads (TMR) responsibility for booking the driving test by applicants
            </p>
          </div>
          
          <p className="text-center text-gray-400 mt-10 text-xs font-light">Add a footnote if this applies to your business</p>
        </div>
      </section>

      {/* Book now button section */}
      <section className="py-16 md:py-20 bg-[#f4f4f4]">
        <div className="text-center">
          <a 
            href="https://calendar.app.google/XDUo3y47NbvDSCuS8" 
            className="inline-block bg-[var(--primary)] text-[var(--primary-foreground)] px-16 py-5 text-xl hover:opacity-90 transition-opacity font-bold tracking-wide shadow-md"
          >
            Book Now
          </a>
        </div>
      </section>

      {/* Start Your Driving Journey */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-20 text-black">
            Start Your Driving Journey with EG Driving school
          </h2>
          
          <div className="grid md:grid-cols-3 gap-x-12 gap-y-16 text-center">
            {[
              { title: "Beginner's Package", desc: "Our Beginner's Package is perfect for those who have never driven before. It includes 10 hours of in-car training and a comprehensive theory course." },
              { title: "Road Test Package", desc: "Our Road Test Package is designed to help you prepare for your driving test. It includes 5 hours of in-car training and a mock test." },
              { title: "Defensive Driving Course", desc: "Our Defensive Driving Course is designed to help you become a safer and more confident driver. It includes 6 hours of in-car training and a theory course." },
              { title: "Winter Driving Course", desc: "Our Winter Driving Course will teach you the skills you need to drive safely in snowy and icy conditions. It includes 3 hours of in-car training." },
              { title: "Driver Refresher Course", desc: "Our Driver Refresher Course is perfect for those who haven't driven in a while and want to brush up on their skills. It includes 2 hours of in-car training." },
              { title: "Customized Training", desc: "We understand that every student is unique, which is why we offer customized training options to meet your specific needs." }
            ].map((item, index) => (
              <div key={index} className="px-2 group">
                <h4 className="text-xl font-bold mb-6 text-black group-hover:text-[var(--primary)] transition-colors">{item.title}</h4>
                <p className="text-gray-600 font-light leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery / Success Stories Section */}
      <section className="py-16 md:py-24 bg-[#f4f4f4]">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-black">
            From Classroom to Road: Our Graduates' Success Stories
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {studentImages.map((num) => (
              <div key={num} className="relative aspect-square overflow-hidden bg-gray-200 hover:opacity-90 transition-opacity">
                <Image
                  src={`/students/${num}.webp`}
                  alt={`Happy student ${num}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn to Drive Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-10 text-black">
            Learn to Drive with EG Driving school
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed font-light max-w-3xl mx-auto">
            Welcome to EG Driving school, the premier driving school in the area. Our experienced instructors will help you gain the skills and confidence you need to pass your driving test. Sign up today and start your journey towards becoming a safe and responsible driver!
          </p>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16 md:py-24 bg-[#f4f4f4]">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8 text-black">
            Start Your Driving Journey with EG Driving school
          </h2>
          <h4 className="text-2xl font-bold text-center text-black mb-12">Service area</h4>
          
          <p className="text-center text-gray-600 leading-relaxed mb-10 text-sm font-light max-w-4xl mx-auto">
            Albany Creek, QLD 4035 • Arana Hills, QLD 4054 • Aspley, QLD 4034 • Bald Hills, QLD 4036 • Boondall, QLD 4034 • Bracken Ridge, QLD 4017 • Bray Park, QLD 4500 • Brendale, QLD 4500 • Bridgeman Downs, QLD 4035 • Brighton, QLD 4017 • Bunya, QLD 4055 • Burpengary, QLD 4505 • Burpengary East, QLD 4505 • Caboolture South, QLD 4510 • Carseldine, QLD 4034 • Cashmere, QLD 4500 • Chermside, QLD 4032 • Chermside West, QLD 4032 • Clontarf, QLD 4019 • Dakabin, QLD 4503 • Deagon, QLD 4017 • Deception Bay, QLD 4508 • Eatons Hill, QLD 4037 • Everton Hills, QLD 4053 • Everton Park, QLD 4053 • Ferny Grove, QLD 4055 • Ferny Hills, QLD 4055 • Fitzgibbon, QLD 4018 • Geebung, QLD 4034 • Griffin, QLD 4503 • Joyner, QLD 4500 • Kallangur, QLD 4503 • Kedron, QLD 4031 • Keperra, QLD 4054 • Kippa Ring, QLD 4021 • Kurwongbah, QLD 4503 • Lawnton, QLD 4501 • Mango Hill, QLD 4509 • Margate, QLD 4019 • Mcdowall, QLD 4053 • Mitchelton, QLD 4053 • Morayfield, QLD 4506 • Murrumba Downs, QLD 4503 • Narangba, QLD 4504 • Newport, QLD 4020 • North Lakes, QLD 4509 • Petrie, QLD 4502 • Redcliffe, QLD 4020 • Rothwell, QLD 4022 • Sandgate, QLD 4017 • Scarborough, QLD 4020 • Shorncliffe, QLD 4017 • Stafford Heights, QLD 4053 • Strathpine, QLD 4500 • Taigum, QLD 4018 • Upper Caboolture, QLD 4510 • Upper Kedron, QLD 4055 • Warner, QLD 4500 • Wavell Heights, QLD 4012 • Whiteside, QLD 4503 • Woody Point, QLD 4019 • Zillmere, QLD 4034
          </p>
        </div>
      </section>

      {/* Contact Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6 text-black">Contact Us</h2>
          <h4 className="text-2xl text-center text-black mb-12 font-light">Better yet, see us in person!</h4>
          
          <p className="text-center text-gray-600 text-lg mb-20 leading-relaxed font-light max-w-3xl mx-auto">
            If you have questions about what programs we have available- or if you just want to say hello- feel free to drop us a line!
          </p>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-xl font-bold mb-6 text-black">EG Driving school</h4>
              <div className="space-y-2 text-gray-600 text-lg font-light mb-10">
                <p>36 South st, Burpengary East, QLD 4505</p>
                <p>
                  <a href="tel:0431512095" className="text-blue-600 hover:underline">0431 512 095</a>
                </p>
              </div>
              
              <div>
                <h5 className="font-bold text-xl mb-4 text-black">Hours</h5>
                <div className="text-gray-600 font-light">
                  <p className="mb-1">Open today</p>
                  <p>09:00 am – 07:00 pm</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-2xl font-bold mb-6 text-black">Get in Touch!</h4>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed font-light">
                This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
              </p>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Name" 
                  className="w-full p-3 bg-[#f4f4f4] border-none focus:ring-1 focus:ring-gray-300 outline-none"
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full p-3 bg-[#f4f4f4] border-none focus:ring-1 focus:ring-gray-300 outline-none"
                />
                <textarea 
                  placeholder="Message" 
                  rows={4}
                  className="w-full p-3 bg-[#f4f4f4] border-none focus:ring-1 focus:ring-gray-300 outline-none resize-none"
                ></textarea>
                <button 
                  type="submit" 
                  className="bg-black text-white px-8 py-3 font-bold hover:opacity-80 transition-opacity"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Mailing List */}
      <section className="py-16 md:py-24 bg-[#f4f4f4]">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-black">Join Our Mailing List</h2>
          <p className="text-gray-600 text-lg mb-12 font-light">
            Get 10% off your first purchase when you sign up for our newsletter!
          </p>
          <form className="flex flex-col md:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="flex-1 p-4 bg-white border border-gray-200 focus:border-black outline-none"
            />
            <button 
              type="submit" 
              className="bg-[var(--primary)] text-black px-10 py-4 font-bold hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
