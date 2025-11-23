import EditableText from '@/components/admin/EditableText';
import EditableImage from '@/components/admin/EditableImage';

export default function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
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
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="container text-center relative z-10 px-4">
        <h1 className="text-white font-bold mb-6 leading-tight max-w-5xl mx-auto" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <EditableText 
            section="home" 
            field="heroTitle" 
            initialValue="Learn to Drive Safely and Confidently" 
          />
        </h1>
        <p className="text-white text-xl md:text-2xl mb-10 font-light max-w-3xl mx-auto">
          <EditableText 
            section="home" 
            field="heroSubtitle" 
            initialValue="Expert driving instruction for all ages and skill levels" 
          />
        </p>
        <a 
          href="https://calendar.app.google/XDUo3y47NbvDSCuS8" 
          className="inline-block bg-(--primary) text-(--primary-foreground) px-12 py-4 text-lg hover:opacity-90 transition-opacity font-bold tracking-wide"
        >
          Book a lesson
        </a>
      </div>
    </section>
  );
}
